import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { docPath } from "./config.mjs";
import {
  dispatchEvents,
  dispatchPhase,
  effectiveDispatchLimits,
} from "./dispatch-bound.mjs";
import {
  attemptFinished,
  fetchMergedBases,
  driveRecordPath,
  readDriveRecord,
  routeOrder,
} from "./drive-route.mjs";
import {
  phaseRoots,
  resolveOrderWorktrees,
  runtimeOf,
} from "./order-worktrees.mjs";
import { readBudgets } from "./process-budget.mjs";
import { phaseWorkerNotes } from "./drive-prompts.mjs";
import { driveHost, launchRole } from "./drive-worker.mjs";
import { shellQuote } from "./git.mjs";
import {
  commandFailed,
  deadlineRefusal,
  phaseTimeLimit,
  processRunning,
} from "./drive-transport.mjs";
import {
  hostStateRoot,
  taskLauncher,
  withHostLock,
} from "./host-resources.mjs";
import { operatorControl } from "../../packages/compiler/src/operator-control.mjs";

export { phaseTimeLimit } from "./drive-transport.mjs";

export function driveStatus(root, order) {
  const trees = resolveOrderWorktrees(root, order);
  const result = spawnSync(
    process.execPath,
    [
      join(trees.launchpad, "scripts/resume.mjs"),
      "status",
      "--json",
      "--work-order",
      order,
    ],
    {
      cwd: trees.cwd,
      env: { ...process.env, DOTLN_LAUNCHPAD: trees.launchpad },
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      timeout: 30000,
    },
  );
  if (result.status !== 0)
    throw new Error(
      `canonical status refused: ${result.stderr?.trim() || result.stdout?.trim() || result.error?.message || `ended by ${result.signal}`}`,
    );
  let value;
  try {
    value = JSON.parse(result.stdout);
  } catch {
    throw new Error("canonical status returned unreadable output");
  }
  if (value.workOrder !== order || !value.route)
    throw new Error("canonical status selected another order or lacks route");
  return value;
}

// Operator controls belong to a session, so only a session's own status can
// read them; canonical status elsewhere stays a pure read of the log.
export async function controlledStatus(
  root,
  order,
  session = process.env.CODEX_THREAD_ID ?? process.env.CLAUDE_CODE_SESSION_ID,
) {
  const observed = driveStatus(root, order);
  const recovery = await operatorControl(
    { session_id: session, cwd: root },
    "Status",
  );
  if (!recovery) return observed;
  const mode = /^DotLn: operator-control (analysis|override);/.exec(
    recovery.systemMessage,
  )?.[1];
  return {
    ...observed,
    route: routeOrder(
      { phase: observed.phase },
      [],
      mode
        ? { operatorMode: mode }
        : {
            unavailable:
              "Operator-control state cannot be read; repair it before driving.",
          },
    ),
  };
}

const save = (file, value) => {
  mkdirSync(join(file, ".."), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${randomUUID()}.tmp`;
  writeFileSync(temporary, JSON.stringify(value, null, 2) + "\n", {
    mode: 0o600,
    flag: "wx",
  });
  renameSync(temporary, file);
};
// Entry is a recorded reservation in every physical worktree. A shell's exit
// status can belong to a later command and cannot establish this fact.
export function nativePhaseEntry(host, roots, session, role, order) {
  const observations = roots.map(([checkout, runtime]) =>
    session
      ? host.phaseEntryReadback(checkout, runtime, session)
      : { entered: false, role: null, workOrder: null },
  );
  const complete =
    observations.length > 0 &&
    observations.every(
      (row) => row.entered && row.role === role && row.workOrder === order,
    );
  return {
    entry: { source: "native-phase-state", complete, roots: observations },
    ...(complete
      ? {}
      : {
          refused:
            "The native worker did not complete its recorded phase entry in every required worktree; inspect entry before re-dispatch.",
        }),
  };
}
export async function phaseDefinition(launchpad, role, host = "claude") {
  driveHost(host);
  const { checkHarness, readBuildOverlay } = await import(
    pathToFileURL(join(launchpad, "scripts/lib/harness.mjs"))
  );
  checkHarness(launchpad, {
    runtimeRoot: launchpad,
    overlay: readBuildOverlay(launchpad),
  });
  const {
    contributorConfiguredProgram,
    contributorVerifierEffort,
    contributorWorkerPins,
  } = await import(
    pathToFileURL(
      join(launchpad, "packages/skeleton/dist/src/loadouts/contributor.js"),
    )
  );
  const { workerSpecification } = await import(
    pathToFileURL(join(launchpad, "packages/compiler/dist/src/harness.js"))
  );
  const workers = contributorConfiguredProgram().workers;
  const name = `dotln-${role}`;
  const selected =
    role === "router"
      ? {
          name,
          ...contributorWorkerPins[host],
          skills: ["dotln-router"],
          body: "Use the preloaded router skill. The entire input is the drive phrase. Do not read an order, diff, report or worker narrative.",
        }
      : workers.find((worker) => worker.name === name);
  const helper = workers.find((worker) => worker.name === "dotln-worker");
  if (!selected || !helper)
    throw new Error("Generated phase or review worker is missing");
  const adapt = (worker) => {
    const {
      name: ignored,
      skills,
      ...definition
    } = workerSpecification(worker);
    Object.assign(definition, contributorWorkerPins[host]);
    if (worker.name === "dotln-verifier")
      definition.effort = contributorVerifierEffort;
    definition.prompt += skills
      .map(
        (skill) =>
          `\n${readFileSync(join(launchpad, `${host === "codex" ? ".agents" : ".claude"}/skills/${skill}/SKILL.md`), "utf8")}`,
      )
      .join("");
    if (worker.name !== "dotln-router")
      definition.prompt += phaseWorkerNotes(launchpad);
    return definition;
  };
  return {
    name,
    definition: adapt(selected),
    helpers: { [helper.name]: adapt(helper) },
  };
}

// Injectable at the transport boundary: fixtures exercise the same route and
// incomplete-attempt logic without inventing live host observations.
export async function driveLoop({
  status,
  launch,
  saveRecord = () => {},
  record,
  stopAt,
  signal,
}) {
  for (;;) {
    if (signal?.aborted)
      return {
        ...record,
        stop: {
          reason: "dispatch-refused",
          next: "The owning router ended or cancelled this run; inspect its retained record before re-entry.",
        },
      };
    const before = await status();
    const route = before.route;
    if (stopAt && before.phase === stopAt)
      return {
        ...record,
        stop: {
          reason: "fixture-endpoint",
          next: "The declared live fixture ends at the passing final review.",
        },
      };
    if (!route.action) return { ...record, stop: route.stop };
    const result = await launch(route, before);
    if (workerRan(result))
      record.attempts.push({
        phase: before.phase,
        action: route.action,
        ...result,
      });
    if (signal?.aborted) continue;
    if (result.refused) {
      // A worker can record its dispatch before it is refused, and a refusal
      // stamped earlier than that log would read as stale. An unreadable status
      // must not cost the refusal its report.
      let settled = before;
      try {
        settled = await status();
      } catch {}
      record.refused = result.refused;
      record.factsAt = settled.route.eventCount ?? record.factsAt;
      saveRecord(record);
      return {
        ...record,
        stop: {
          reason: record.exhausted ? "budget-exhausted" : "dispatch-refused",
          next: result.refused,
        },
      };
    }
    const after = await status();
    record.factsAt = after.route.eventCount ?? record.factsAt;
    if (!attemptFinished(route.action, after))
      record.incomplete[route.action] =
        (record.incomplete[route.action] ?? 0) + 1;
    else record.incomplete[route.action] = 0;
    saveRecord(record);
  }
}

const harnessHost = (launchpad) =>
  import(
    pathToFileURL(join(launchpad, "packages/skeleton/dist/src/harness-host.js"))
  );

const workerRan = (result) =>
  Boolean(result.startedAt) || Object.hasOwn(result, "exitCode");

// A session's own identity must not reach the worker it starts.
export function workerEnvironment(env = process.env) {
  const clean = { ...env };
  for (const key of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDECODE",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
    "CLAUDE_EFFORT",
    "DOTLN_DRIVEN_WORKER",
  ])
    delete clean[key];
  return clean;
}

// A worker recorded as running either still runs, so it must not gain a second
// writer, or died unobserved, which leaves its reservations for this drive.
async function recoverStaleWorker(old, trees) {
  if (!old?.worker?.running || !Number.isSafeInteger(old.worker.pid)) return;
  if (processRunning(old.worker.pid))
    throw new Error(
      "Drive worker is still running; resume its owning router instead of starting another writer.",
    );
  const harness = await harnessHost(trees.launchpad);
  for (const checkout of new Set([trees.main, trees.launchpad, trees.cwd]))
    harness.releasePhaseWriter(
      checkout,
      runtimeOf(checkout, trees),
      old.worker.sessionId ?? old.worker.id,
    );
  old.worker.running = false;
}

// A driven worker runs outside the gate, wrapper and journal that bound a role
// session, so its role's dispatch wall clock is also each attempt's watchdog.
// An operator's recorded acceptance reaches it through the same reader.
export function attemptTimeLimit(record, budgets, route, events, requested) {
  const { wallClockMs } = effectiveDispatchLimits(
    budgets,
    route.role,
    dispatchPhase({ role: route.role, intent: route.phrase }),
    events,
  );
  const configured = [record.limits.drivenPhaseTimeoutMs, wallClockMs].filter(
    (value) => value != null,
  );
  // An accepted ceiling can exceed what a timer can hold; it then just holds
  // for as long as a timer can.
  return phaseTimeLimit(
    configured.length ? Math.min(...configured, 2147483647) : null,
    requested,
    undefined,
  );
}

function subagentLimits(budgets) {
  const cap = budgets?.subagentCap === undefined ? 20 : budgets.subagentCap;
  const ceiling =
    budgets?.drivenSessionCeiling === undefined
      ? cap === null
        ? null
        : cap * 4
      : budgets.drivenSessionCeiling;
  return { cap, ceiling };
}

// A new worker holds nothing yet, so any holder in its worktrees is another.
function writerConflict(harness, { record, trees }, route) {
  for (const [checkout, runtime] of phaseRoots(route, trees)) {
    const holder = harness.phaseWriterView(checkout, runtime);
    if (!holder.reserved) continue;
    const identities = [
      [
        "router",
        process.env.CLAUDE_CODE_SESSION_ID ?? process.env.CODEX_THREAD_ID,
      ],
      ["previous-phase", record.worker?.sessionId ?? record.worker?.id],
    ];
    return {
      checkout:
        checkout === trees.main
          ? "main"
          : checkout === trees.launchpad
            ? "order-launchpad"
            : "target",
      alive: holder.alive ?? "unknown",
      relation:
        identities.find(
          ([, id]) => id && harness.phaseActor(id) === holder.actorId,
        )?.[0] ?? "unmatched",
    };
  }
  return null;
}

// A configured limit the host cannot meter refuses rather than passes unknown.
export function unenforceableLimit(record, maxWorkerUsd) {
  if (record.limits.tokens !== null && record.routerUsage.totalTokens === null)
    return "A router token limit is configured but its host counter is unavailable, so the drive cannot enforce it. Clear dispatches.router.tokens in the budgets document, then drive again.";
  if (
    record.host === "codex" &&
    (record.limits.costUsd !== null || maxWorkerUsd !== undefined)
  )
    return "Codex CLI exposes no dollar counter or ceiling, so the drive cannot enforce a dollar limit. Clear dispatches.router.costUsd in the budgets document, then drive again.";
  if (
    record.limits.costUsd !== null &&
    record.attempts.some((row) => row.costUsd === null)
  )
    return "A worker's cost is unknown, so the remaining phase-worker dollar budget cannot be established. Router cost is outside this limit. Clear dispatches.router.costUsd in the budgets document, or drive on a host that reports cost, then drive again.";
  return null;
}

function dollarAllowance(record, maxWorkerUsd) {
  const remainingUsd =
    record.limits.costUsd === null
      ? null
      : Math.max(
          0,
          record.limits.costUsd -
            record.attempts.reduce((sum, row) => sum + (row.costUsd ?? 0), 0),
        );
  const dollarLimit =
    maxWorkerUsd === undefined
      ? remainingUsd
      : remainingUsd === null
        ? maxWorkerUsd
        : Math.min(maxWorkerUsd, remainingUsd);
  return { remainingUsd, dollarLimit };
}

function admitWorker(drive, worker) {
  const {
    record,
    saveRecord,
    budget,
    trees,
    directory,
    session,
    cap,
    ceiling,
  } = drive;
  const admission = budget.admitSubagentTool(
    trees.launchpad,
    directory,
    { session_id: session, tool_use_id: worker, tool_name: "Agent" },
    true,
    { cap: ceiling, spawnerCap: cap, spawner: "router" },
  );
  if (admission.refusal) {
    record.exhausted = true;
    saveRecord();
    return { refused: admission.refusal };
  }
  // An unreadable counter is unknown, which is not the same as spent.
  if (admission.advisory && admission.usage.count === null)
    return { refused: admission.advisory };
  budget.linkSubagentResult(directory, {
    session_id: session,
    tool_use_id: worker,
    tool_response: { agentId: worker },
  });
  return undefined;
}

function workerObservers(drive, { worker, route, context }) {
  const {
    record,
    saveRecord,
    budget,
    trees,
    directory,
    session,
    cap,
    ceiling,
  } = drive;
  const observedChildren = new Set();
  const observedSpawners = new Map();
  return {
    observedChildren,
    onSpawn: (pid, clock) => {
      record.worker = {
        id: worker,
        pid,
        running: true,
        role: route.role,
        action: route.action,
        timeoutMs: clock.timeoutMs,
      };
      saveRecord();
    },
    onSession: (nativeSessionId) => {
      record.worker.sessionId = nativeSessionId;
      save(context, {
        ...JSON.parse(readFileSync(context, "utf8")),
        nativeSessionId,
      });
      saveRecord();
    },
    onCommand: (observation) => {
      record.worker.lastCommand = observation;
      if (commandFailed(observation))
        record.worker.commandFailures = [
          ...(record.worker.commandFailures ?? []),
          observation,
        ].slice(-16);
      saveRecord();
    },
    onSubagent: ({ id, sender, children }) => {
      // Codex reports completed admissions, not a pre-tool hook. Preserve
      // every observed child, then stop further work if a bound was crossed.
      const spawned = observedSpawners.get(sender) ?? new Set();
      observedSpawners.set(sender, spawned);
      for (const child of children) {
        const invocation = `${worker}:${id}:${child}`;
        budget.admitSubagentTool(
          trees.launchpad,
          directory,
          {
            session_id: session,
            tool_use_id: invocation,
            tool_name: "Agent",
          },
          true,
          {
            cap: null,
            spawner: sender === record.worker.sessionId ? worker : sender,
          },
        );
        budget.linkSubagentResult(directory, {
          session_id: session,
          tool_use_id: invocation,
          tool_response: { agentId: child },
        });
        observedChildren.add(child);
        spawned.add(child);
      }
      const total = budget.subagentUsage(
        trees.launchpad,
        directory,
        session,
      ).count;
      if (
        (ceiling !== null && total > ceiling) ||
        (cap !== null && spawned.size > cap)
      ) {
        record.exhausted = true;
        saveRecord();
        return "Observed Codex admissions exceeded the declared role-text budget; further work stopped.";
      }
      return undefined;
    },
  };
}

// Attach what the host and the drive can each say about a finished attempt.
function summarizeAttempt(drive, attempt) {
  const { record, budget, trees, directory, session, ceiling, workerHost } =
    drive;
  const { result, route, worker, definition, harness, observedChildren } =
    attempt;
  result.cwd =
    route.cwd === trees.cwd && trees.target
      ? "target-worktree"
      : route.action === "release-close"
        ? "main"
        : "order-worktree";
  result.workerId = worker;
  if (record.worker?.id === worker) record.worker.running = false;
  const observedBudget = budget.subagentUsage(
    trees.launchpad,
    directory,
    session,
  );
  record.budget = {
    ...observedBudget,
    cap: ceiling,
    remaining:
      ceiling === null || observedBudget.count === null
        ? null
        : Math.max(0, ceiling - observedBudget.count),
    source:
      workerHost === "codex"
        ? "native-stream-minimum-and-router-admissions"
        : "shared-hook-counter",
    ...(workerHost === "codex"
      ? { countKind: "minimum-observed", unknownRemainder: true }
      : {}),
  };
  if (workerHost === "claude") {
    result.hooks = harness.phaseSessionReadback(
      route.cwd,
      runtimeOf(route.cwd, trees),
      worker,
    );
    result.effort =
      result.hooks.effort.length === 1 ? result.hooks.effort[0] : null;
    result.effortSource = result.effort ? "hook-input" : "unknown";
    result.subagents = {
      ...result.hooks.subagents,
      source: "phase-local-hook-counter",
    };
  } else {
    result.hooks = { hookCalls: null, source: "codex-unhooked-role-text" };
    result.effort = null;
    result.effortSource = "not-exposed-by-native-json-stream";
    result.subagents = {
      count: observedChildren.size,
      countKind: "minimum-observed",
      unknownRemainder: true,
      source: "native-collab-events",
    };
  }
  result.selectedModel = definition.model;
  result.selectedEffort = definition.effort;
  result.host = workerHost;
}

async function launchAttempt(drive, route, before) {
  const { order, trees, record, saveRecord, workerHost, signal } = drive;
  const { directory, session, cap, ceiling } = drive;
  const timeoutMs = attemptTimeLimit(
    record,
    drive.budgets,
    route,
    dispatchEvents(trees.launchpad, order),
    drive.requestedTimeoutMs,
  );
  const deadlineAt = process.env.DOTLN_DRIVE_DEADLINE_AT;
  const expired = () => {
    if (phaseTimeLimit(null, timeoutMs, deadlineAt) !== 0) return undefined;
    record.exhausted = true;
    saveRecord();
    return { ...deadlineRefusal };
  };
  let elapsed = expired();
  if (elapsed) return elapsed;
  const harness = await harnessHost(route.launchpad);
  // A successful native exit does not persist a resumable session, so every
  // attempt is a fresh worker given the same phrase.
  const worker = randomUUID();
  const conflict = writerConflict(harness, drive, route);
  if (conflict) {
    record.writerConflict = conflict;
    saveRecord();
    return {
      refused:
        "The worktree has another writer. Inspect its reservation; a dead Codex owner requires the operator's operator override: recovery phrase.",
    };
  }
  const unenforceable = unenforceableLimit(record, drive.maxWorkerUsd);
  if (unenforceable) return { refused: unenforceable };
  elapsed = expired();
  if (elapsed) return elapsed;
  const { name, definition, helpers } = await phaseDefinition(
    route.launchpad,
    route.role,
    workerHost,
  );
  const context = join(directory, `${worker}.json`);
  save(context, {
    schemaVersion: 1,
    root: trees.launchpad,
    directory,
    session,
    worker,
    role: route.role,
    workOrder: order,
    cap,
    ceiling,
  });
  const definitions = join(directory, `${worker}.agents.json`);
  save(definitions, { [name]: definition, ...helpers });
  const { remainingUsd, dollarLimit } = dollarAllowance(
    record,
    drive.maxWorkerUsd,
  );
  if (dollarLimit === 0) {
    record.exhausted = true;
    saveRecord();
    return { refused: "declared phase-worker dollar budget exhausted" };
  }
  drive.onTransition({
    order,
    phase: before.phase,
    action: route.action,
    worker: record.attempts.length + 1,
    transport: record.transport,
  });
  const { observedChildren, ...observers } = workerObservers(drive, {
    worker,
    route,
    context,
  });
  try {
    const result = await launchRole({
      host: workerHost,
      launchpad: route.launchpad,
      role: route.role,
      definition,
      definitions,
      worker,
      dollarLimit,
      phrase: route.phrase,
      cwd: route.cwd,
      env: {
        ...drive.contextEnv,
        DOTLN_LAUNCHPAD: route.launchpad,
        DOTLN_DRIVEN_WORKER: context,
        ...(workerHost === "claude" ? { CLAUDE_CODE_SESSION_ID: worker } : {}),
      },
      timeoutMs,
      deadlineAt,
      beforeLaunch: () => expired() ?? admitWorker(drive, worker),
      signal,
      ...observers,
    });
    if (result.cause === deadlineRefusal.cause) record.exhausted = true;
    if (result.refused && !workerRan(result)) {
      saveRecord();
      return result;
    }
    if (workerHost === "codex" && result.workerStarted !== false) {
      // The transport's refusal is the more specific: entry never replaces it.
      const { refused } = result;
      Object.assign(
        result,
        nativePhaseEntry(
          harness,
          phaseRoots(route, trees),
          result.sessionId,
          route.role,
          order,
        ),
        refused ? { refused } : {},
      );
    }
    summarizeAttempt(drive, {
      result,
      route,
      worker,
      definition,
      harness,
      observedChildren,
    });
    if (
      result.costUsd !== null &&
      remainingUsd !== null &&
      result.costUsd >= remainingUsd
    )
      record.exhausted = true;
    saveRecord();
    return result;
  } finally {
    const current = record.worker?.id === worker ? record.worker : null;
    const ended = !current || !processRunning(current.pid);
    if (current) current.running = !ended;
    // An unobserved end retains ownership for canonical recovery. Neither a
    // transport exception nor lost supervision is authority to free a writer.
    if (ended)
      for (const [checkout, runtime] of phaseRoots(route, trees))
        harness.releasePhaseWriter(
          checkout,
          runtime,
          current?.sessionId ?? worker,
        );
  }
}

// A fetch that failed cannot tell an unmerged order from an unseen merge.
export function awaitingMergeStop(stop, unreachable) {
  if (stop.reason !== "awaiting-merge" || !unreachable.length) return stop;
  const names = unreachable.map((row) => row.label).join(" and ");
  return {
    ...stop,
    next: `The ${names} remote could not be fetched, so a completed merge may not be visible yet. The drive record's fetchFailures holds the cause; repair it and type the same drive phrase again. Otherwise, ${stop.next}`,
  };
}

async function runDriveUnlocked(
  root,
  order,
  {
    stopAt,
    host: selectedHost,
    maxWorkerUsd,
    timeoutMs: requestedTimeoutMs,
    signal,
    runId,
    onTransition = (row) => console.log(JSON.stringify(row)),
  } = {},
) {
  const workerHost = driveHost(selectedHost);
  const trees = resolveOrderWorktrees(root, order);
  const file = driveRecordPath(trees.main, order);
  const old = readDriveRecord(trees.main, order);
  if (old?.host && old.host !== workerHost)
    throw new Error("Drive re-entry must keep its recorded host");
  await recoverStaleWorker(old, trees);
  const budgets = readBudgets(trees.launchpad);
  const { cap, ceiling } = subagentLimits(budgets);
  const session = old?.session ?? randomUUID();
  const directory = docPath(trees.main, "control", "local/drives", order);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const budget = await import(
    pathToFileURL(
      join(trees.launchpad, "packages/skeleton/dist/src/subagent-budget.js"),
    )
  );
  const initialized = budget.initializeSubagentCounter(directory, session);
  if (initialized) throw new Error(initialized);
  const initialStatus = driveStatus(root, order);
  // A released order has nothing left to learn from either remote. The fetch
  // can take minutes and cannot be cancelled, so it says so before it starts.
  const fetchesBases =
    initialStatus.phase === "closed" &&
    initialStatus.route.stop?.reason !== "released";
  if (fetchesBases)
    onTransition({ order, phase: "closed", action: "fetch-bases" });
  const unreachable = fetchesBases ? fetchMergedBases(root, order) : [];
  const record = {
    schemaVersion: 1,
    workOrder: order,
    host: workerHost,
    transport: workerHost === "codex" ? "codex-cli-exec" : "claude-cli-print",
    session,
    runId,
    driverPid: process.pid,
    running: true,
    startedAt: old?.startedAt ?? new Date().toISOString(),
    attempts: old?.attempts ?? [],
    // Counts describe the log they saw; a transition since has moved past them.
    incomplete:
      old?.factsAt === initialStatus.route.eventCount ? old.incomplete : {},
    factsAt: initialStatus.route.eventCount,
    limits: {
      subagentCap: cap,
      drivenSessionCeiling: ceiling,
      drivenPhaseTimeoutMs: budgets?.drivenPhaseTimeoutMs ?? null,
      tokens: budgets?.dispatches.router.tokens ?? null,
      costUsd: budgets?.dispatches.router.costUsd ?? null,
      costScope: "phase-workers",
    },
    routerUsage: {
      totalTokens: null,
      costUsd: null,
      source: "host-router-counter-unavailable",
    },
    worker: old?.worker ?? null,
    refused: null,
    writerConflict: null,
    exhausted: false,
    attentionSince: initialStatus.route.eventCount ?? 0,
    // Causes stay in this ignored record: a remote's error can name its URL.
    ...(unreachable.length ? { fetchFailures: unreachable } : {}),
  };
  const saveRecord = () => save(file, record);
  saveRecord();
  const drive = {
    order,
    trees,
    budgets,
    record,
    saveRecord,
    budget,
    directory,
    session,
    cap,
    ceiling,
    workerHost,
    signal,
    onTransition,
    maxWorkerUsd,
    requestedTimeoutMs,
    contextEnv: workerEnvironment(),
  };
  try {
    const result = await driveLoop({
      status: () => controlledStatus(root, order),
      launch: (route, before) => launchAttempt(drive, route, before),
      saveRecord,
      record,
      stopAt,
      signal,
    });
    record.stop = awaitingMergeStop(result.stop, unreachable);
    return record;
  } catch (error) {
    // A thrown failure still leaves its cause for the next reader of the record.
    record.stop = { reason: "dispatch-refused", next: error.message };
    throw error;
  } finally {
    record.running = false;
    saveRecord();
  }
}

// A fixture or interrupted owner requests cancellation through the retained
// run identity. It never signals a PID taken from an untrusted stale record.
export function requestDriveStop(root, order) {
  const record = readDriveRecord(root, order);
  if (record?.running && record.runId)
    save(`${driveRecordPath(root, order)}.stop`, { runId: record.runId });
  return record;
}

// The kernel lock survives concurrent entry and is released if the router dies.
// A still-running detached worker is separately checked by its retained record.
export async function runDrive(
  root,
  order,
  options = {},
  execute = runDriveUnlocked,
) {
  const main = resolveOrderWorktrees(root, order).main;
  const name = `drive-${createHash("sha256").update(`${main}:${order}`).digest("hex")}`;
  // The lock's helper may compile on first use, which must not count against
  // the wait that decides another drive is already running.
  taskLauncher(hostStateRoot());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1000);
  try {
    return await withHostLock(
      hostStateRoot(),
      name,
      async () => {
        clearTimeout(timer);
        const runId = randomUUID();
        const owner = Number(process.env.DOTLN_DRIVE_PARENT_PID);
        const lifetime = new AbortController();
        const cancel = () => lifetime.abort();
        const stopFile = `${driveRecordPath(main, order)}.stop`;
        const watch = setInterval(() => {
          if (Number.isSafeInteger(owner) && owner > 1) {
            try {
              process.kill(owner, 0);
            } catch (error) {
              if (error.code === "ESRCH") cancel();
            }
          }
          if (existsSync(stopFile)) {
            try {
              if (JSON.parse(readFileSync(stopFile, "utf8")).runId === runId)
                cancel();
            } catch {
              cancel();
            }
          }
        }, 250);
        process.once("SIGTERM", cancel);
        process.once("SIGINT", cancel);
        options.signal?.addEventListener("abort", cancel, { once: true });
        if (options.signal?.aborted) cancel();
        try {
          return await execute(root, order, {
            ...options,
            runId,
            signal: lifetime.signal,
          });
        } finally {
          clearInterval(watch);
          process.removeListener("SIGTERM", cancel);
          process.removeListener("SIGINT", cancel);
          options.signal?.removeEventListener("abort", cancel);
        }
      },
      { signal: controller.signal },
    );
  } catch (error) {
    if (!controller.signal.aborted) throw error;
    throw new Error(
      `Another drive of ${order} is already running in this launchpad; wait for it or read node scripts/drive.mjs status ${order}.`,
    );
  } finally {
    clearTimeout(timer);
  }
}
