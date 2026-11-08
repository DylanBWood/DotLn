import {
  boundJournal,
  dispatchJournalDirectory,
  readDispatchJournal,
  readDispatchJournals,
} from "../../packages/skeleton/src/dispatch-journal.mjs";
import { formatDuration } from "./duration.mjs";
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { readBudgets } from "./process-budget.mjs";
import { readGateChecks } from "./gate-evidence.mjs";
import { readControl, eventsForOrder } from "./control-store.mjs";

export const dispatchSession = (env = process.env) =>
  [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
  ]
    .map((name) => env[name])
    .find((value) => typeof value === "string" && value.trim());
const keyOf = (id) => createHash("sha256").update(id).digest("hex");
const directory = dispatchJournalDirectory;
export const dispatchPhase = (journal) =>
  journal.role === "executor"
    ? journal.intent?.startsWith("resume: fix")
      ? "repairing"
      : "active"
    : journal.role === "verifier"
      ? "verifying"
      : journal.role === "reviewer"
        ? "final-review"
        : journal.role;
const scopePhase = (phase) => (phase === "needs-fix" ? "repairing" : phase);

const phaseCompletion = {
  active: "ImplementationReady",
  repairing: "RepairCompleted",
  verifying: "VerificationCompleted",
  "final-review": "FinalReviewCompleted",
};
export function phaseBoundEvents(events, phase) {
  return events.slice(
    events.findLastIndex(
      (event) => event.type === phaseCompletion[scopePhase(phase)],
    ) + 1,
  );
}

export function dispatchEvents(root, workOrder) {
  if (!/^WO-\d{3}$/u.test(workOrder ?? "")) return [];
  const events = eventsForOrder(readControl(root), workOrder);
  const activation = events.findLastIndex(
    (event) => event.type === "WorkOrderActivated",
  );
  return events.slice(Math.max(0, activation));
}

export function dispatchJournals(root) {
  return readDispatchJournals(directory(root));
}

/** Fold phase-scoped operator authority once for lifecycle and execution. */
export function effectiveDispatchLimits(budgets, role, phase, events) {
  const configured = budgets?.dispatches[role];
  const limits =
    phase === "repairing" ? (configured?.repair ?? configured) : configured;
  const acceptances = phaseBoundEvents(events, phase).filter(
    (event) =>
      event.type === "DispatchBoundAccepted" &&
      scopePhase(event.phase) === phase,
  );
  const ceiling = (metric) => {
    const base = limits?.[metric] ?? null;
    if (
      acceptances.some(
        (event) => event.metric === metric && event.ceiling === null,
      )
    )
      return null;
    if (base === null) return null;
    return Math.max(
      base,
      ...acceptances
        .filter((event) => event.metric === metric)
        .map((event) => event.ceiling),
    );
  };
  return {
    wallClockMs: ceiling("wallClockMs"),
    completeRuns: ceiling("completeRuns"),
    acceptances,
    wallClockBasis: limits?.wallClockBasis ?? null,
  };
}

/** The gate and hooks share the same checkout-local journal and run census.
 * Missing journals and old budget keys are observable unset bounds. A malformed
 * present record throws rather than inventing a fresh dispatch. */
export function dispatchStanding(
  root,
  {
    session = dispatchSession(),
    journal,
    sessionKey,
    now = Date.now(),
    events,
    gates,
  } = {},
) {
  const key = sessionKey ?? (session ? keyOf(session) : undefined);
  if (!journal && key) {
    const file = join(directory(root), `${key}.json`);
    if (existsSync(file)) journal = readDispatchJournal(file);
  }
  journal = boundJournal(journal);
  if (journal?.unavailable) {
    // The marker describes an earlier failed scan, not permanent corruption.
    // Re-read the whole lane: any remaining damage still throws its named
    // error, while repaired history supplies the earliest recorded anchor.
    // The stored request index belongs to full order history, not the current
    // activation's acceptance events supplied by lifecycle callers.
    const recovered = phaseDispatchAnchor(root, {
      workOrder: journal.workOrder,
      intent: journal.intent,
      phase: dispatchPhase(journal),
      cutoff: journal.startedAt,
      phaseBoundary: journal.phaseBoundary,
    });
    journal = recovered?.journal ?? journal;
  }
  const routes =
    "Use analysis: to diagnose. The operator can authorize proceeding in ordinary language in this conversation, including an early run for as long as needed; the agent records the contextual authorization with npm run resume -- accept-overrun <wallClockMs|completeRuns> --ceiling <value|unlimited> --reason <text> --capture <path> --capture-hash sha256:<digest> <actor-flags> and continues in the same session. No special phrase, session exit or manual operator command is required.";
  if (!journal?.role || !Number.isFinite(Date.parse(journal.startedAt)))
    return {
      role: journal?.role ?? null,
      elapsedMs: null,
      wallClockMs: null,
      completeRuns: null,
      bound: null,
      acceptance: null,
      state: "unset",
      cause: "no-journal",
      routes,
    };
  const phase = dispatchPhase(journal);
  events ??= dispatchEvents(root, journal.workOrder);
  const {
    wallClockMs,
    completeRuns: bound,
    acceptances,
    wallClockBasis,
  } = effectiveDispatchLimits(
    readBudgets(root, { cutoff: journal.startedAt }),
    journal.role,
    phase,
    events,
  );
  const started = Date.parse(journal.startedAt);
  const completeRuns = (gates ?? readGateChecks(root)).filter(
    (row) =>
      row.executed === true &&
      !row.boundStop &&
      hostAdmitted(row) &&
      row.checkId === "npm test" &&
      ["plain", "review"].includes(row.gateSelection) &&
      !row.partial &&
      Date.parse(row.startedAt ?? row.recordedAt) >= started,
  ).length;
  const elapsedMs = Math.max(0, now - started);
  const exceeded = [
    { metric: "wallClockMs", value: elapsedMs, bound: wallClockMs },
    { metric: "completeRuns", value: completeRuns, bound },
  ].filter((row) => row.bound !== null && row.value >= row.bound);
  return {
    role: journal.role,
    workOrder: journal.workOrder ?? null,
    phase,
    sessionKey: key ?? null,
    startedAt: journal.startedAt,
    elapsedMs,
    wallClockMs,
    wallClockBasis,
    completeRuns,
    bound,
    acceptance: acceptances.length ? acceptances : null,
    state: exceeded.length
      ? "exceeded"
      : wallClockMs === null &&
          bound === null &&
          !acceptances.some((event) => event.ceiling === null)
        ? "unset"
        : "within",
    exceeded,
    routes,
  };
}

// Gate execution includes structural refusals. Count a complete selection
// only after host admission; retain the historical count when old rows carry
// neither a host result nor an explicit unrun-host observation.
function hostAdmitted(row) {
  const host =
    row.taskTimeline?.find((task) => task.name === "host") ??
    row.cases?.find((task) => task.name === "host");
  return host
    ? host.executed === true && host.exitCode === 0
    : !row.unrunSuites?.includes("host");
}

export const dispatchStandingLine = (standing) =>
  `dispatch standing: ${formatDuration(standing.elapsedMs)} of ${standing.acceptance?.some((event) => event.metric === "wallClockMs" && event.ceiling === null) ? "as needed" : standing.wallClockMs === null ? "unset" : formatDuration(standing.wallClockMs)}; complete runs ${standing.completeRuns ?? "unknown"} of ${standing.acceptance?.some((event) => event.metric === "completeRuns" && event.ceiling === null) ? "as needed" : (standing.bound ?? "unset")}; ${standing.state}`;
export const dispatchBoundMessage = (standing) =>
  `DOTLN_DISPATCH_BOUND: ${standing.exceeded.map(({ metric, value, bound }) => `${metric === "wallClockMs" ? "wall clock" : "complete runs"}=${metric === "wallClockMs" ? formatDuration(value) : value}, bound=${metric === "wallClockMs" ? formatDuration(bound) : bound}`).join("; ")}. ${dispatchStandingLine(standing)}. ${standing.routes}`;

// Retain the first measurement for older consumers, and keep every cause on
// this one stop so a multi-bound refusal never inflates the intervention count.
const boundStop = (standing) => ({
  ...standing.exceeded[0],
  exceeded: standing.exceeded,
});
export const dispatchBoundResult = (standing) => ({
  exitCode: 1,
  boundStop: boundStop(standing),
  dispatchBound: {
    role: standing.role,
    workOrder: standing.workOrder,
    phase: standing.phase,
    sessionKey: standing.sessionKey,
    startedAt: standing.startedAt,
  },
  output: dispatchBoundMessage(standing),
});

export function recordBoundStop(
  root,
  standing,
  source,
  at = new Date().toISOString(),
) {
  if (standing.state !== "exceeded" || !standing.sessionKey) return;
  const dir = directory(root);
  mkdirSync(dir, { recursive: true });
  appendFileSync(
    join(dir, `${standing.sessionKey}.jsonl`),
    `${JSON.stringify({
      at,
      workOrder: standing.workOrder,
      role: standing.role,
      phase: standing.phase,
      source,
      boundStop: boundStop(standing),
      dispatchStartedAt: standing.startedAt,
    })}\n`,
  );
}

export function requireDispatchBound(root, options = {}) {
  const standing = dispatchStanding(root, options);
  if (standing.state === "exceeded") {
    let recording = "";
    try {
      recordBoundStop(root, standing, options.source ?? "probe");
    } catch (error) {
      recording = ` Stop record unavailable: ${error.message}.`;
    }
    const error = new Error(dispatchBoundMessage(standing) + recording);
    error.code = "DOTLN_DISPATCH_BOUND";
    error.standing = standing;
    throw error;
  }
  return standing;
}

/** Preserve the earliest dispatch in the unfinished attempt so a new thread
 * cannot replenish elapsed time or consumed complete runs. */
export function phaseDispatchAnchor(
  root,
  {
    workOrder,
    intent,
    phase,
    cutoff,
    phaseBoundary,
    events = /^WO-\d{3}$/u.test(workOrder ?? "")
      ? eventsForOrder(readControl(root), workOrder)
      : [],
  },
) {
  if (cutoff) {
    // The recorded request distinguishes events sharing a timestamp. Older
    // anchors without that request retain the timestamp-based boundary.
    const request = /^WO-\d{3}:(\w+):(\d+)$/u.exec(phaseBoundary ?? "");
    const index = request ? Number(request[2]) : -1;
    events =
      index >= 0 && events[index]?.type === request[1]
        ? events.slice(0, index + 1)
        : events.filter(
            (event) =>
              !event.recordedAt ||
              Date.parse(event.recordedAt) <= Date.parse(cutoff),
          );
  }
  intent ??=
    phase === "repairing"
      ? "resume: fix"
      : phase === "active"
        ? "resume: next"
        : phase === "verifying"
          ? "resume: verify"
          : "resume: final review";
  const boundPhase =
    phase ??
    (intent === "resume: fix"
      ? "repairing"
      : intent === "resume: next"
        ? "active"
        : intent === "resume: verify"
          ? "verifying"
          : "final-review");
  const boundary = events.findLast(
    (event) =>
      event.type === "WorkOrderActivated" ||
      event.type === phaseCompletion[boundPhase],
  );
  return dispatchJournals(root)
    .filter(
      ({ journal }) =>
        journal.workOrder === workOrder &&
        journal.intent === intent &&
        (!phaseBoundary ||
          !journal.phaseBoundary ||
          journal.phaseBoundary === phaseBoundary) &&
        (!cutoff || Date.parse(journal.startedAt) <= Date.parse(cutoff)) &&
        (!boundary?.recordedAt ||
          Date.parse(journal.startedAt) >= Date.parse(boundary.recordedAt)),
    )
    .sort(
      (a, b) =>
        Date.parse(a.journal.startedAt) - Date.parse(b.journal.startedAt),
    )[0];
}

/** A new thread cannot erase an unfinished phase's original dispatch. A completed
 * repair starts a new attempt on its next failure rather than carrying debt
 * from an already completed attempt. Reads and completion never call this. */
export function requireRedispatchBound(root, { workOrder, intent, now } = {}) {
  const events = dispatchEvents(root, workOrder);
  const anchor = phaseDispatchAnchor(root, { workOrder, intent, events });
  if (anchor)
    return requireDispatchBound(root, {
      journal: anchor.journal,
      sessionKey: anchor.key,
      now,
      events,
      source: "redispatch",
    });
  return null;
}

/** Public intervention data carries measurements and lifecycle outcomes only;
 * operator capture text remains in intake. Missing later events stay unknown. */
export function dispatchBoundActivity(events, stops, role) {
  const roles = {
    active: "executor",
    "needs-fix": "executor",
    repairing: "executor",
    verifying: "verifier",
    "final-review": "reviewer",
  };
  const boundStops = stops.filter((stop) => !role || stop.role === role);
  const boundAcceptances = events
    .filter(
      (event) =>
        event.type === "DispatchBoundAccepted" &&
        (!role || roles[event.phase] === role),
    )
    .map(({ metric, ceiling, phase, recordedAt }) => ({
      metric,
      ceiling,
      phase,
      at: recordedAt,
    }));
  const afterStop = boundStops.map((stop) => {
    const next = events
      .filter(
        (event) =>
          event.workOrderId === stop.workOrder &&
          Date.parse(event.recordedAt) > Date.parse(stop.at),
      )
      .sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt))[0];
    return {
      at: stop.at,
      metric: stop.metric,
      ...(stop.exceeded ? { exceeded: stop.exceeded } : {}),
      nextEvent: next?.type ?? null,
      delayMs: next ? Date.parse(next.recordedAt) - Date.parse(stop.at) : null,
    };
  });
  return {
    boundStops: { count: boundStops.length, stops: boundStops },
    boundAcceptances,
    afterStop,
  };
}

/** The current session's pending release-close dispatch, or null: the
 * operator's resume: release close phrase, which the prompt hook journals as
 * pending while main lacks the merged order's records (WO-258). Read from the
 * session's own state in the dispatch journal, so the close needs no built
 * runtime to find it. */
export function pendingReleaseClose(root, env = process.env) {
  const session = dispatchSession(env);
  if (!session) return null;
  const key = keyOf(session);
  const file = join(directory(root), `${key}.json`);
  let state;
  try {
    state = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
  return state?.pendingReleaseClose &&
    typeof state.pendingReleaseClose === "object"
    ? { key, file, journal: join(directory(root), `${key}.jsonl`), state }
    : null;
}

// Replaces the session's state file whole, through an exclusive temporary
// file and a rename, as the hook writes it.
function rewriteSessionState(file, state) {
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary, JSON.stringify(state) + "\n", {
      mode: 0o600,
      flag: "wx",
    });
    renameSync(temporary, file);
  } finally {
    // The rename consumed it unless the write or the rename failed.
    if (existsSync(temporary)) unlinkSync(temporary);
  }
}

/** Consumes the session's pending release-close phrase once a publishing close
 * of the order its recorded dispatch names completes: the phrase stayed
 * pending only in case main had not yet received the merged order, and that
 * close was its own, so no later helper in the session records another
 * order's dispatch from it without a new phrase (WO-258-D028). Returns whether
 * a pending phrase was consumed. */
export function consumePendingReleaseClose(
  root,
  workOrderId,
  env = process.env,
) {
  const pending = pendingReleaseClose(root, env);
  if (!pending || pending.state.releaseCloseDispatch?.workOrder !== workOrderId)
    return false;
  const { pendingReleaseClose: consumed, ...state } = pending.state;
  rewriteSessionState(pending.file, state);
  appendFileSync(
    pending.journal,
    JSON.stringify({
      recordedAt: new Date().toISOString(),
      event: "PendingReleaseCloseConsumed",
      workOrder: workOrderId,
      dispatch: {
        action: "release-close",
        consumed: consumed.reason ?? "records-may-not-be-in-checkout",
      },
      source: "release-close-helper",
    }) + "\n",
    { mode: 0o600 },
  );
  return true;
}

/** Records a pending release-close dispatch once main holds the order's
 * records: the lifecycle's own `resume release-close` for the order, then the
 * session's recorded dispatch, which keys the helper's admission, and one
 * journal row saying it came from the pending phrase. A refusal records
 * nothing and leaves the pending row for the next attempt. */
export function recordPendingReleaseClose(root, pending, workOrderId) {
  const run = spawnSync(
    process.execPath,
    [
      join(root, "scripts/resume.mjs"),
      "release-close",
      "--work-order",
      workOrderId,
    ],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 60_000,
      maxBuffer: 4 * 1024 * 1024,
    },
  );
  if (run.status !== 0)
    return {
      recorded: false,
      reason: `npm run resume -- release-close --work-order ${workOrderId} refused: ${String(
        run.stderr || run.stdout || run.error?.message || "no output",
      )
        .trim()
        .replace(/\s+/gu, " ")
        .slice(0, 400)}`,
    };
  const recordedAt = new Date().toISOString();
  const { pendingReleaseClose: _pending, ...state } = pending.state;
  rewriteSessionState(pending.file, {
    ...state,
    workOrder: workOrderId,
    releaseCloseDispatch: { workOrder: workOrderId, recordedAt },
    // The phrase bound its dispatch before main held the merged order; the
    // recorded dispatch belongs to that order, from the same start.
    ...(state.boundDispatch
      ? {
          boundDispatch: {
            ...state.boundDispatch,
            workOrder: workOrderId,
            phaseBoundary: `${workOrderId}:none:-1`,
          },
        }
      : {}),
  });
  appendFileSync(
    pending.journal,
    JSON.stringify({
      recordedAt,
      event: "ReleaseCloseDispatchRecorded",
      workOrder: workOrderId,
      dispatch: {
        action: "release-close",
        recorded: true,
        from: _pending.reason ?? "records-not-in-checkout",
      },
      source: "release-close-helper",
    }) + "\n",
    { mode: 0o600 },
  );
  return { recorded: true, recordedAt };
}
