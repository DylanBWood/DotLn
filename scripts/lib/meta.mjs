import { docPath, docRelative } from "./config.mjs";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { usageRecordIdentity } from "../../packages/skeleton/src/usage-observation.mjs";
import { correctionCounts } from "../../packages/skeleton/src/correction-observation.mjs";
import { readControl, eventsForOrder } from "./control-store.mjs";
import { completedPhaseAttempts } from "./control-time.mjs";
import { readGateChecks } from "./gate-evidence.mjs";
import {
  readBudgets,
  budgetVerdict,
  dispatchKinds,
  measureColdStarts,
} from "./process-budget.mjs";

const json = (root, path, fallback = null) =>
  existsSync(join(root, path))
    ? JSON.parse(readFileSync(join(root, path), "utf8"))
    : fallback;
const jsonl = (root, path) =>
  existsSync(join(root, path))
    ? readFileSync(join(root, path), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    : [];
const bytes = (root, path) =>
  existsSync(join(root, path)) && lstatSync(join(root, path)).isFile()
    ? readFileSync(join(root, path)).length
    : null;
const sumKnown = (values) =>
  values.length && values.every(Number.isFinite)
    ? values.reduce((sum, value) => sum + value, 0)
    : null;
const delta = (value, previous) =>
  Number.isFinite(value) && Number.isFinite(previous) ? value - previous : null;
const git = (root, args) => {
  const run = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  return run.status === 0 ? run.stdout.trimEnd() : null;
};
const roleForPhase = {
  implementation: "executor",
  repair: "executor",
  verification: "verifier",
  finalReview: "reviewer",
};

// GitHub-style fragments include the whole heading, including any title after
// the stable decision id. Fence contents are never headings.
export const markdownHeadings = (source) => {
  const visible = source.replace(
    /^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm,
    (match) => match.replace(/[^\n]/g, " "),
  );
  const seen = new Map();
  return [...visible.matchAll(/^#{1,6} (.+?)[ \t]*#*[ \t]*$/gm)].map(
    (match) => {
      const stem = match[1]
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_\s-]/gu, "")
        .replace(/\s/g, "-");
      const ordinal = seen.get(stem) ?? 0;
      seen.set(stem, ordinal + 1);
      return {
        index: match.index,
        anchor: `${stem}${ordinal ? `-${ordinal}` : ""}`,
      };
    },
  );
};

// Experiment evidence extends the existing decision record, not the runtime
// schema. Unknown token/effect observations are null, never invented zeros.
function checkExperiment(entry, path) {
  const text = (value) => typeof value === "string" && value.trim();
  const texts = (value) =>
    Array.isArray(value) && value.length > 0 && value.every(text);
  const measured = (value) => Number.isFinite(value) && value >= 0;
  const optionalMeasurement = (value) => value === null || measured(value);
  const effectMeasurement = (value) => value === null || Number.isFinite(value);
  if (
    !text(entry.question) ||
    !texts(entry.alternatives) ||
    entry.alternatives.length < 2 ||
    !text(entry.observation) ||
    !["run", "declined"].includes(entry.execution) ||
    !["adopted", "kept-current", "inconclusive"].includes(entry.outcome) ||
    (entry.execution === "declined" &&
      (!text(entry.reason) || entry.outcome !== "kept-current"))
  )
    throw new Error(
      `${path}: experiment requires question, alternatives, observation, execution and outcome; declining requires a reason and kept-current`,
    );
  if (
    !measured(entry.budget?.wallSeconds) ||
    entry.budget.wallSeconds <= 0 ||
    entry.budget.wallSeconds > 900 ||
    !measured(entry.cost?.wallSeconds) ||
    entry.cost.wallSeconds > entry.budget.wallSeconds ||
    !optionalMeasurement(entry.cost.tokens) ||
    !texts(entry.cost.commands) ||
    !text(entry.cost.source)
  )
    throw new Error(
      `${path}: experiment requires measured cost with commands/source inside its budget (at most 900 s); unknown tokens use null`,
    );
  if (
    !effectMeasurement(entry.effect?.wallSecondsPerOrder) ||
    !effectMeasurement(entry.effect?.tokensPerOrder) ||
    !texts(entry.effect?.commands) ||
    !text(entry.effect?.summary)
  )
    throw new Error(
      `${path}: experiment effect requires commands, summary and per-order observations (null when unknown)`,
    );
  if (
    ![true, false, "unknown"].includes(entry.regression) ||
    !(
      entry.history?.lastAdoptedImprovementAt === null ||
      (typeof entry.history?.lastAdoptedImprovementAt === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(entry.history.lastAdoptedImprovementAt))
    ) ||
    !(
      entry.history?.experimentsSinceAdoption === null ||
      (Number.isInteger(entry.history?.experimentsSinceAdoption) &&
        entry.history.experimentsSinceAdoption >= 0)
    )
  )
    throw new Error(
      `${path}: experiment requires regression and history observations; unknown history uses null`,
    );
}

export function readDecisions(root, { workOrder } = {}) {
  const directory = docPath(root, "evidence");
  const decisions = [];
  if (!existsSync(directory)) return decisions;
  for (const name of readdirSync(directory)
    .sort()
    .filter(
      (name) => /^WO-\d{3}$/.test(name) && (!workOrder || name === workOrder),
    )) {
    const path = docRelative(root, "evidence", `${name}/decisions.md`);
    if (!existsSync(join(root, path))) continue;
    const source = readFileSync(join(root, path), "utf8");
    const headings = markdownHeadings(source);
    const entries = [...source.matchAll(/^```json\n([\s\S]*?)^```/gm)];
    if (!entries.length)
      throw new Error(
        `${path}: decision entries must use the documented JSON shape`,
      );
    for (const match of entries) {
      const entry = JSON.parse(match[1]);
      if (
        typeof entry.id !== "string" ||
        !entry.id.startsWith(`${name}-`) ||
        !entry.date ||
        !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
        !entry.dispatch?.trim() ||
        !entry.decision?.trim() ||
        !entry.reopenWhen ||
        !Array.isArray(entry.evidence) ||
        !entry.evidence.length ||
        !Array.isArray(entry.rejected)
      )
        throw new Error(
          `${path}: decision requires id, date, dispatch source, evidence, rejected choices and reopening condition`,
        );
      if (
        entry.kind === "correction" &&
        !["misread", "meant", "changed"].every(
          (key) => typeof entry[key] === "string" && entry[key].trim(),
        )
      )
        throw new Error(
          `${path}: correction requires what was misread, meant and changed`,
        );
      if (entry.kind === "experiment") checkExperiment(entry, path);
      const condition = entry.reopenWhen;
      if (
        !(typeof condition === "string" && condition.trim()) &&
        !(
          condition &&
          typeof condition === "object" &&
          typeof condition.metric === "string" &&
          [">", ">=", "<"].includes(condition.operator) &&
          Number.isFinite(condition.value) &&
          Number.isInteger(condition.consecutive ?? 1) &&
          (condition.consecutive ?? 1) > 0
        )
      )
        throw new Error(
          `${path}: reopening condition must be readable prose or a bounded metric predicate`,
        );
      if (decisions.some((prior) => prior.id === entry.id))
        throw new Error(`Duplicate decision id: ${entry.id}`);
      if (
        entry.followup !== undefined &&
        !(typeof entry.followup === "string" && entry.followup.trim())
      )
        throw new Error(`${path}: followup must name an action`);
      if (
        entry.reopens !== undefined &&
        !(
          entry.reopens &&
          typeof entry.reopens === "object" &&
          /^WO-\d{3}-D\d{3}$/.test(entry.reopens.decisionId) &&
          entry.reopens.decisionId !== entry.id &&
          typeof entry.reopens.observation === "string" &&
          entry.reopens.observation.trim()
        )
      )
        throw new Error(
          `${path}: reopens requires another decisionId and its observed trigger`,
        );
      const row = { ...entry, workOrder: name, path };
      // Projection metadata cannot alter historic decision/amendment hashes.
      Object.defineProperty(row, "anchor", {
        value: headings.findLast((heading) => heading.index < match.index)
          ?.anchor,
      });
      decisions.push(row);
    }
  }
  return decisions;
}
const safeCell = (value) =>
  String(value).replaceAll("|", "\\|").replace(/\s+/g, " ");
export function renderDecisionsIndex(decisions) {
  return [
    "# Decisions index",
    "",
    "Generated by `npm run meta` from per-order decisions. Original records retain their sources, rejected alternatives and reopening conditions. A non-goal is local to its order.",
    "",
    "| Decision | Dispatch source | Choice | Reopen when |",
    "| --- | --- | --- | --- |",
    ...decisions.map(
      (row) =>
        `| [${row.id}](../evidence/${row.workOrder}/decisions.md#${row.anchor ?? row.id.toLowerCase()}) | ${safeCell(row.dispatch)} | ${safeCell(row.decision)} | ${safeCell(typeof row.reopenWhen === "string" ? row.reopenWhen : JSON.stringify(row.reopenWhen))} |`,
    ),
    "",
  ].join("\n");
}
export function writeDecisionsIndex(root, { check = false } = {}) {
  const decisions = readDecisions(root);
  const path = docPath(root, "lineage", "decisions-index.md");
  const expected = renderDecisionsIndex(decisions);
  if (check) {
    for (const row of decisions) {
      const anchors = markdownHeadings(
        readFileSync(join(root, row.path), "utf8"),
      );
      if (
        !row.anchor ||
        !anchors.some((heading) => heading.anchor === row.anchor)
      )
        throw new Error(
          `Decision index fragment does not resolve: ${row.path}#${row.anchor ?? row.id.toLowerCase()}`,
        );
    }
    if (!existsSync(path) || readFileSync(path, "utf8") !== expected)
      throw new Error("Decisions index is stale; run npm run meta");
  } else if (!existsSync(path) || readFileSync(path, "utf8") !== expected) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, expected);
  }
  return decisions;
}

export function mergedSubjects(root, count = 5) {
  const source = git(root, [
    "log",
    "--first-parent",
    "--merges",
    `-${count}`,
    "--format=%s%x00%b%x00",
    "HEAD",
  ]);
  if (source === null) return [];
  const values = source.split("\0");
  const rows = [];
  for (let index = 0; index + 1 < values.length; index += 2) {
    const subject = values[index].trim(),
      body = values[index + 1].trim();
    if (!subject) continue;
    const title =
      /^Merge pull request /i.test(subject) && body
        ? body.split("\n")[0]
        : subject;
    const workOrder =
      title.match(/\bWO-\d{3}\b/)?.[0] ??
      (subject.match(/\/wo-(\d{3})\b/)?.[1]
        ? `WO-${subject.match(/\/wo-(\d{3})\b/)[1]}`
        : null);
    rows.push({ title, characters: [...title].length, workOrder });
  }
  return rows.reverse();
}

export { inheritedLedgerDuty } from "./dependencies.mjs";
export function codeDiffBytes(root, revision) {
  const command = revision
    ? ["show", "--format=", revision, "--", "packages", "scripts"]
    : ["diff", "HEAD", "--", "packages", "scripts"];
  const output = git(root, command);
  if (output === null) return null;
  let total = Buffer.byteLength(output);
  if (!revision) {
    const paths = git(root, [
      "ls-files",
      "--others",
      "--exclude-standard",
      "-z",
      "--",
      "packages",
      "scripts",
    ]);
    if (paths === null) return null;
    for (const path of paths.split("\0").filter(Boolean)) {
      const patch = spawnSync(
        "git",
        ["diff", "--no-index", "--", "/dev/null", path],
        { cwd: root, maxBuffer: 8 * 1024 * 1024 },
      );
      if (![0, 1].includes(patch.status) || !patch.stdout) return null;
      total += patch.stdout.length;
    }
  }
  return total;
}

function hookObservations(root, workOrder) {
  const directory = docPath(root, "control", "local/harness");
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => /^[a-f0-9]{64}\.jsonl$/.test(name))
    .flatMap((name) => {
      const state = json(
        root,
        docRelative(root, "control", `local/harness/${name.slice(0, -1)}`),
        {},
      );
      let role;
      return jsonl(root, docRelative(root, "control", `local/harness/${name}`))
        .filter(
          (row) =>
            (Object.hasOwn(row, "workOrder")
              ? row.workOrder
              : state.workOrder) === workOrder,
        )
        .map((row) => {
          if (row.role) role = row.role;
          // Timing follows the evaluated event. Attribute it from the preceding
          // observed role, without an extra session-file read on every hook call.
          return {
            ...row,
            journal: name,
            ...(row.hookTiming && !row.role && role ? { role } : {}),
          };
        });
    });
}
function usageRows(root, workOrder) {
  const rows = jsonl(
    root,
    docRelative(root, "control", "local/process/usage.jsonl"),
  ).filter((row) => row.workOrder === workOrder);
  const latest = new Map();
  const superseded = new Set(rows.flatMap((row) => row.supersedes ?? []));
  for (const row of rows.filter(
    (row) => !superseded.has(usageRecordIdentity(row)),
  ))
    latest.set(
      `${row.role}:${row.startedAt ?? "dispatch"}:${row.sessionKey ?? row.ordinal ?? 0}:${row.observation.source}`,
      row,
    );
  return [...latest.values()].map(({ sessionKey, supersedes, ...row }) => row);
}

function authorshipCost(observations) {
  const rows = observations
    .map((row) => row.authorship)
    .filter(
      (row) =>
        row &&
        ["durationMs", "files", "bytes", "commands"].every(
          (key) => Number.isFinite(row[key]) && row[key] >= 0,
        ),
    );
  return {
    authorshipSnapshots: rows.length || null,
    authorshipMs: sumKnown(rows.map((row) => row.durationMs)),
    authorshipBytes: sumKnown(rows.map((row) => row.bytes)),
    authorshipCommands: sumKnown(rows.map((row) => row.commands)),
    authorshipMeanMs: rows.length
      ? rows.reduce((total, row) => total + row.durationMs, 0) / rows.length
      : null,
    authorshipPeakBytes: rows.length
      ? Math.max(...rows.map((row) => row.bytes))
      : null,
  };
}

function hookCost(observations) {
  const durations = observations
    .map((row) => row.hookTiming?.durationMs)
    .filter((value) => Number.isFinite(value) && value >= 0);
  return {
    hookRuns: durations.length || null,
    hookMs: sumKnown(durations),
    hookMeanMs: durations.length
      ? sumKnown(durations) / durations.length
      : null,
    hookPeakMs: durations.length ? Math.max(...durations) : null,
  };
}

function guardRefusalCount(observations) {
  const invocations = new Set();
  let uncorrelated = 0;
  for (const row of observations) {
    if (!(row.refused || row.refusal || row.decision === "deny")) continue;
    const key = row.refusal?.invocationKey;
    if (typeof key === "string" && /^[a-f0-9]{64}$/.test(key))
      invocations.add(key);
    // Historical or identity-free outcomes cannot be paired by time or command
    // text without inventing a shared invocation. Preserve those observations.
    else uncorrelated++;
  }
  return invocations.size + uncorrelated;
}

export function trapRows(orders) {
  const definitions = [
    [
      "rule-beating",
      "Read-obligation bytes against diff bytes; Stop refusals and re-announcements",
      ["readAmplification", "stopRefusals", "reAnnouncements"],
    ],
    [
      "seeking-the-wrong-goal",
      "Machinery share of elapsed time; phase durations against code-change size",
      ["machineryShare", "elapsedPerCodeByte"],
    ],
    [
      "shifting-the-burden-to-the-intervenor",
      "Operator corrections, manual closeout steps and emergency planning passes",
      ["operatorCorrections", "manualCloseoutSteps", "emergencyPasses"],
    ],
    [
      "drift-to-low-performance",
      "Subject length, gate step count and cold-start byte series",
      ["coldStartBytes", "subjectCharacters", "gateStepCount"],
    ],
    [
      "policy-resistance",
      "Guard refusals, bypass tools and ad hoc scripts",
      ["guardRefusals", "bypassTools", "adHocScripts"],
    ],
  ];
  return definitions.map(([id, signal, metrics]) => {
    const metric = metrics[0];
    const series = orders.map((row, index) => ({
      workOrder: row.workOrder,
      value: row.metrics[metric] ?? null,
      delta: delta(row.metrics[metric], orders[index - 1]?.metrics[metric]),
    }));
    const indicators = metrics.map((metric) => ({
      metric,
      series: orders.map((row, index) => ({
        workOrder: row.workOrder,
        value: row.metrics[metric] ?? null,
        delta: delta(row.metrics[metric], orders[index - 1]?.metrics[metric]),
      })),
    }));
    const worsening = indicators
      .filter(
        (row) =>
          row.series.length >= 4 &&
          row.series
            .slice(-3)
            .every((value) => value.delta !== null && value.delta > 0),
      )
      .map((row) => row.metric);
    return {
      id,
      signal,
      ...(id === "shifting-the-burden-to-the-intervenor"
        ? {
            corrections: orders.map((row) => ({
              workOrder: row.workOrder,
              ...row.corrections,
            })),
          }
        : {}),
      metric,
      series,
      indicators,
      worsening,
      reopenCandidate: worsening.length > 0,
    };
  });
}

/** Reconcile an explicit cost promise against recorded outcomes. Ambiguous prose
 * and absent measurements stay unknown; this projection never grants or refuses. */
export function reconcileCost(workOrder, cost, gateRows, observedAt) {
  const rows = gateRows.filter(
    (row) =>
      row.workOrder === workOrder &&
      ["npm test", "npm run test:full"].includes(row.checkId) &&
      row.executed,
  );
  const bound =
    /(?:fresh (?:product )?gate|fresh wall-clock)[^.;]{0,70}?(?:under|below|less than|<)\s*(\d+(?:\.\d+)?)\s*(seconds?|secs?|s|minutes?|mins?|m)\b/i.exec(
      cost,
    );
  const ceilingMs = bound
    ? Number(bound[1]) * (/^m/.test(bound[2]) ? 60000 : 1000)
    : null;
  const fresh = rows.filter(
    (row) =>
      row.exitCode === 0 &&
      Number.isFinite(row.durationMs) &&
      row.durationMs >= 0 &&
      (!row.reusedSuites || row.executionMode === "fresh"),
  );
  const shortfall =
    ceilingMs !== null && fresh.some((row) => row.durationMs >= ceilingMs);
  return {
    workOrder,
    promisedRemoval: cost || "unknown",
    observedAt,
    observedRows: rows.map(
      ({
        checkId,
        recordedAt,
        durationMs,
        exitCode,
        evidenceRef,
        executionMode,
      }) => ({
        checkId,
        recordedAt,
        durationMs,
        exitCode,
        evidenceRef,
        executionMode,
      }),
    ),
    ceilingMs,
    outcome: shortfall
      ? "shortfall"
      : ceilingMs !== null && fresh.length
        ? "met"
        : "unknown",
    planningInput: shortfall
      ? "Measured fresh gate exceeds the promised limit; reconsider at planning."
      : null,
  };
}

export async function collectMeta(
  root,
  { now = new Date().toISOString(), previousEdition = "v0.16.0" } = {},
) {
  const control = readControl(root),
    budgets = readBudgets(root),
    decisions = readDecisions(root);
  const closed = [...control.orders]
    .filter(([, row]) => row.state.phase === "closed")
    .sort(([, a], [, b]) =>
      (a.closeRecordedAt ?? "").localeCompare(b.closeRecordedAt ?? ""),
    );
  const selected = [
    ...closed.slice(-5),
    ...[...control.orders].filter(([, row]) => row.state.phase !== "closed"),
  ];
  const coldStart = measureColdStarts(root, previousEdition);
  const sequencePath = docRelative(root, "planning", "sequence.md");
  const sizePaths = [
    sequencePath,
    docRelative(root, "planning", "work-order-map.md"),
    docRelative(root, "workOrders", "README.md"),
    docRelative(root, "lineage", "idea-ledger.md"),
    "CLAUDE.md",
    ...coldStart.profiles.map((row) => row.path),
  ];
  const sizes = Object.fromEntries(
    sizePaths.map((path) => [path, bytes(root, path)]),
  );
  const manifest = json(root, ".claude/harness-manifest.json", {});
  let declared = {
    promptTokens: null,
    supports: null,
    units: null,
    hooks:
      manifest.installed?.filter((row) => /^\.claude\/hooks\//.test(row.path))
        .length ?? null,
  };
  try {
    const module = await import(
      pathToFileURL(
        join(root, "packages/skeleton/dist/src/loadouts/contributor.js"),
      ).href
    );
    const feedback = await import(
      pathToFileURL(
        join(root, "packages/skeleton/dist/src/loadouts/feedback.js"),
      ).href
    );
    const program = module.contributorConfiguredProgram().loadout;
    declared = {
      ...declared,
      promptTokens: program.supportCosts.reduce(
        (total, row) => total + row.promptTokens,
        0,
      ),
      supports: program.supportCosts.length,
      units: feedback.personalFeedback().units.length,
    };
  } catch {
    /* Missing compilation is explicit, never inferred from prose bytes. */
  }
  const checks = readGateChecks(root);
  const titles = mergedSubjects(root, 100);
  const orders = selected.map(([workOrder, row]) => {
    const events = eventsForOrder(control, workOrder);
    const phases = [...completedPhaseAttempts(events)].map((attempt) => ({
      phase: attempt.phase,
      role: roleForPhase[attempt.phase],
      elapsedMs: attempt.elapsedMs === "unknown" ? null : attempt.elapsedMs,
    }));
    const snapshot =
      json(root, docRelative(root, "evidence", `${workOrder}/meta.json`)) ??
      json(
        root,
        docRelative(root, "evidence", `${workOrder}/meta-baseline.json`),
      );
    const prior = snapshot?.orders?.find(
      (entry) => entry.workOrder === workOrder,
    );
    const active = row.state.phase !== "closed";
    const contextEdition = json(
      root,
      docRelative(root, "evidence", `${workOrder}/harness-context.json`),
    );
    const historicCold = contextEdition?.profiles?.map((profile) => ({
      role: profile.role,
      skillsRoot: profile.skillsRoot,
      bytes:
        profile.bytes ??
        sumKnown(
          (profile.after?.files ?? [])
            .filter(
              (file) =>
                file.path === "CLAUDE.md" || file.path.endsWith("/SKILL.md"),
            )
            .map((file) => file.bytes),
        ),
    }));
    const hook = hookObservations(root, workOrder);
    // Closed worktrees retain their local journal elsewhere. Preserve only a
    // snapshot explicitly derived from that journal, never the old decision count.
    const corrections =
      !hook.length && prior?.corrections?.source === "session-journal"
        ? prior.corrections
        : correctionCounts(hook);
    const usage = usageRows(root, workOrder);
    const gateRows = checks.filter(
      (check) =>
        check.workOrder === workOrder &&
        ["npm test", "npm run test:full"].includes(check.checkId),
    );
    const successfulGate = gateRows.findLast(
      (row) => row.executed === true && row.exitCode === 0,
    );
    // Count observed tasks in the latest successful gate, not gate invocations
    // or top-level suites: release cases can be separate tasks. Historical
    // reuse counts remain part of their aggregate's coverage; new gates are fresh.
    const legacyGateSteps = successfulGate
      ? checks.filter(
          (row) =>
            row.workOrder === workOrder &&
            row.recordedAt === successfulGate.recordedAt &&
            row.checkId.startsWith("suite:"),
        ).length
      : 0;
    const gateSteps =
      Number.isSafeInteger(successfulGate?.freshSuites) &&
      successfulGate.freshSuites >= 0
        ? successfulGate.freshSuites +
          (Number.isSafeInteger(successfulGate.reusedSuites) &&
          successfulGate.reusedSuites >= 0
            ? successfulGate.reusedSuites
            : 0)
        : Array.isArray(successfulGate?.taskTimeline)
          ? successfulGate.taskTimeline.filter((row) => row.executed === true)
              .length
          : legacyGateSteps || null;
    const evidence = events
      .map((event) => event.evidence)
      .filter(Boolean)
      .at(-1);
    const readCount =
      evidence?.readCount ??
      hook.filter((value) => Number.isFinite(value.outputCount)).at(-1)
        ?.outputCount ??
      prior?.metrics.readObligationCount ??
      null;
    const readBytes =
      evidence?.readBytes ??
      hook.filter((value) => Number.isFinite(value.outputBytes)).at(-1)
        ?.outputBytes ??
      prior?.metrics.readObligationBytes ??
      null;
    const diffBytes = active
      ? codeDiffBytes(root)
      : (prior?.metrics.codeDiffBytes ?? null);
    const durationMs = sumKnown(phases.map((value) => value.elapsedMs));
    const machineMs = sumKnown(
      phases
        .filter((value) =>
          ["verification", "finalReview"].includes(value.phase),
        )
        .map((value) => value.elapsedMs),
    );
    const observedUsage = usage.filter(
      (value) => value.observation.scope === "dispatch",
    );
    const metrics = {
      elapsedMs: durationMs,
      attempts: phases.length,
      gateMs:
        sumKnown(gateRows.map((value) => value.durationMs)) ??
        prior?.metrics.gateMs ??
        null,
      fastGateMs:
        gateRows
          .filter(
            (value) => value.checkId === "npm test" && value.exitCode === 0,
          )
          .at(-1)?.durationMs ??
        prior?.metrics.fastGateMs ??
        null,
      readObligationCount: readCount,
      readObligationBytes: readBytes,
      codeDiffBytes: diffBytes,
      readAmplification:
        readBytes !== null && diffBytes > 0 ? readBytes / diffBytes : null,
      machineryShare:
        durationMs > 0 && machineMs !== null ? machineMs / durationMs : null,
      elapsedPerCodeByte:
        durationMs !== null && diffBytes > 0 ? durationMs / diffBytes : null,
      tokens:
        sumKnown(
          observedUsage.map((value) => value.observation.usage.totalTokens),
        ) ??
        prior?.metrics.tokens ??
        null,
      costUsd:
        sumKnown(
          observedUsage.map((value) => value.observation.usage.costUsd),
        ) ??
        prior?.metrics.costUsd ??
        null,
      declaredPromptTokens: active
        ? declared.promptTokens
        : (prior?.metrics.declaredPromptTokens ?? null),
      coldStartBytes: active
        ? Math.max(...coldStart.profiles.map((value) => value.bytes ?? 0))
        : (prior?.metrics.coldStartBytes ??
          (historicCold?.some((value) => Number.isFinite(value.bytes))
            ? Math.max(...historicCold.map((value) => value.bytes ?? 0))
            : null)),
      subjectCharacters:
        titles.findLast((value) => value.workOrder === workOrder)?.characters ??
        prior?.metrics.subjectCharacters ??
        null,
      gateStepCount: gateSteps ?? prior?.metrics.gateStepCount ?? null,
      operatorCorrections: corrections.total,
      guardRefusals: hook.length
        ? guardRefusalCount(hook)
        : (prior?.metrics.guardRefusals ?? null),
      stopRefusals: hook.length
        ? hook.filter(
            (value) =>
              value.event === "Stop" &&
              (value.refused || value.finished === false),
          ).length
        : (prior?.metrics.stopRefusals ?? null),
      reAnnouncements: prior?.metrics.reAnnouncements ?? null,
      manualCloseoutSteps: prior?.metrics.manualCloseoutSteps ?? null,
      emergencyPasses: prior?.metrics.emergencyPasses ?? null,
      bypassTools: prior?.metrics.bypassTools ?? null,
      adHocScripts: prior?.metrics.adHocScripts ?? null,
      commandsRun: hook.some((value) => value.toolStep)
        ? hook.filter((value) => value.commandRun).length
        : (sumKnown(
            observedUsage.map(
              (value) => value.observation.activity?.commandsRun,
            ),
          ) ??
          prior?.metrics.commandsRun ??
          null),
      bytesReadIntoContext: hook.length
        ? sumKnown(
            hook
              .flatMap((value) => value.byteReads ?? [])
              .map((value) => value.endByte - value.startByte),
          )
        : (prior?.metrics.bytesReadIntoContext ?? null),
      stepCount: hook.some((value) => value.toolStep)
        ? hook.filter((value) => value.toolStep).length
        : (sumKnown(
            observedUsage.map((value) => value.observation.activity?.stepCount),
          ) ??
          prior?.metrics.stepCount ??
          null),
      ...authorshipCost(hook),
      ...hookCost(hook),
      prBodyBytes:
        bytes(root, docRelative(root, "finalReviews", `${workOrder}/PR.md`)) ??
        prior?.metrics.prBodyBytes ??
        null,
    };
    const dispatches = dispatchKinds.map((role) => {
      const rolePhases = phases.filter((value) => value.role === role),
        roleUsage = usage.filter((value) => value.role === role),
        roleHooks = hook.filter((value) => value.role === role);
      return {
        role,
        wallClockMs:
          sumKnown(rolePhases.map((value) => value.elapsedMs)) ??
          sumKnown(roleUsage.map((value) => value.durationMs)),
        attempts: rolePhases.length || null,
        bytesReadIntoContext: sumKnown(
          roleHooks
            .flatMap((value) => value.byteReads ?? [])
            .map((value) => value.endByte - value.startByte),
        ),
        commandsRun: roleHooks.some((value) => value.toolStep)
          ? roleHooks.filter((value) => value.commandRun).length
          : sumKnown(
              roleUsage.map((value) => value.observation.activity?.commandsRun),
            ),
        stepCount: roleHooks.some((value) => value.toolStep)
          ? roleHooks.filter((value) => value.toolStep).length
          : sumKnown(
              roleUsage.map((value) => value.observation.activity?.stepCount),
            ),
        ...authorshipCost(roleHooks),
        ...hookCost(roleHooks),
        observedTokens: sumKnown(
          roleUsage
            .filter((value) => value.observation.scope === "dispatch")
            .map((value) => value.observation.usage.totalTokens),
        ),
        observedCostUsd: sumKnown(
          roleUsage
            .filter((value) => value.observation.scope === "dispatch")
            .map((value) => value.observation.usage.costUsd),
        ),
        declaredPromptTokens:
          active && role === "executor"
            ? declared.promptTokens
            : (prior?.dispatches?.find((value) => value.role === role)
                ?.declaredPromptTokens ?? null),
      };
    });
    return {
      workOrder,
      phase: row.state.phase,
      phases,
      metrics,
      corrections,
      dispatches,
      usage,
      coldStart: active
        ? coldStart.profiles.map(({ role, skillsRoot, bytes }) => ({
            role,
            skillsRoot,
            bytes,
          }))
        : (historicCold ?? prior?.coldStart ?? null),
      sizes: active ? sizes : (prior?.sizes ?? null),
      declared: active ? declared : (prior?.declared ?? null),
      source: {
        phases: "canonical control fold",
        usage: usage.length ? "host observations" : "unavailable",
        unobserved: "null means unavailable, never zero",
      },
    };
  });
  for (let index = 0; index < orders.length; index++)
    orders[index].delta = Object.fromEntries(
      Object.entries(orders[index].metrics).map(([key, value]) => [
        key,
        delta(value, orders[index - 1]?.metrics[key]),
      ]),
    );
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index],
      before = orders[index - 1];
    order.sizeDeltas = Object.fromEntries(
      Object.entries(order.sizes ?? {}).map(([path, value]) => [
        path,
        delta(value, before?.sizes?.[path]),
      ]),
    );
    for (const dispatch of order.dispatches)
      dispatch.delta = Object.fromEntries(
        Object.entries(dispatch)
          .filter(([key]) => key !== "role")
          .map(([key, value]) => [
            key,
            delta(
              value,
              before?.dispatches.find((row) => row.role === dispatch.role)?.[
                key
              ],
            ),
          ]),
      );
  }
  const budgetRows = coldStart.profiles.map((row) => ({
    metric: row.metric,
    value: row.bytes,
    ceiling: row.ceiling,
    verdict: row.verdict,
  }));
  for (const [metric, value, ceiling] of [
    ["sequenceBytes", sizes[sequencePath], budgets?.limits.sequenceBytes],
  ])
    budgetRows.push({
      metric,
      value,
      ceiling,
      verdict: budgetVerdict(budgets, metric, value, ceiling),
    });
  for (const order of orders.filter((row) => row.phase !== "closed")) {
    for (const metric of ["fastGateMs", "prBodyBytes"])
      budgetRows.push({
        metric,
        scope: order.workOrder,
        value: order.metrics[metric],
        ceiling: budgets?.limits[metric],
        verdict: budgetVerdict(
          budgets,
          metric,
          order.metrics[metric],
          budgets?.limits[metric],
          order.workOrder,
        ),
      });
    for (const role of dispatchKinds)
      for (const [metric, field] of [
        ["tokens", "totalTokens"],
        ["costUsd", "costUsd"],
      ]) {
        const rows = order.usage.filter(
          (row) => row.role === role && row.observation.scope === "dispatch",
        );
        const ceiling = budgets?.dispatches[role]?.[metric];
        for (const row of rows.length ? rows : [null]) {
          const value = row?.observation.usage[field] ?? null;
          budgetRows.push({
            metric: `${role}.${metric}`,
            scope: order.workOrder,
            dispatchStartedAt: row?.startedAt ?? null,
            value,
            ceiling,
            verdict: budgetVerdict(
              budgets,
              `${role}.${metric}`,
              value,
              ceiling,
              order.workOrder,
            ),
          });
        }
      }
  }
  const traps = trapRows(orders);
  const reopenCandidates = decisions
    .filter((decision) => {
      const condition = decision.reopenWhen;
      if (typeof condition !== "object") return false;
      const values = orders
        .slice(-(condition.consecutive ?? 1))
        .map((row) => row.metrics[condition.metric]);
      return (
        values.length === (condition.consecutive ?? 1) &&
        values.every(
          (value) =>
            Number.isFinite(value) &&
            (condition.operator === ">"
              ? value > condition.value
              : condition.operator === ">="
                ? value >= condition.value
                : condition.operator === "<"
                  ? value < condition.value
                  : false),
        )
      );
    })
    .map((row) => ({
      decision: row.id,
      condition: row.reopenWhen,
      path: row.path,
    }));
  for (const trap of traps.filter((row) => row.reopenCandidate))
    reopenCandidates.push({
      trap: trap.id,
      condition: "worsened over three consecutive order deltas",
    });
  return {
    schemaVersion: 1,
    observedAt: now,
    revision: git(root, ["rev-parse", "HEAD"]),
    orders,
    costReconciliation: closed.map(([workOrder, row]) => {
      const path = row.state.workOrderPath;
      const authority =
        path && existsSync(join(root, path))
          ? readFileSync(join(root, path), "utf8")
          : "";
      const cost =
        /^\*\*Cost:\*\*[^\S\r\n]*([\s\S]*?)(?=\n\s*\n|\n\*\*|(?![\s\S]))/m
          .exec(authority)?.[1]
          ?.replace(/\s+/g, " ")
          .trim() ?? "";
      const current = reconcileCost(workOrder, cost, checks, now);
      const snapshot =
        json(root, docRelative(root, "evidence", `${workOrder}/meta.json`)) ??
        json(
          root,
          docRelative(root, "evidence", `${workOrder}/meta-baseline.json`),
        );
      const prior = snapshot?.orders?.find(
        (entry) => entry.workOrder === workOrder,
      );
      return {
        ...current,
        historicalMetrics: prior
          ? {
              source: docRelative(
                root,
                "evidence",
                `${workOrder}/meta${existsSync(docPath(root, "evidence", `${workOrder}/meta.json`)) ? "" : "-baseline"}.json`,
              ),
              cutoff: snapshot.observedAt,
              metrics: prior.metrics,
            }
          : null,
      };
    }),
    unassignedDispatches: usageRows(root, null),
    coldStart,
    declared,
    sizes,
    subjects: mergedSubjects(root),
    budgets: budgetRows,
    traps,
    reopenCandidates,
  };
}

const display = (value) =>
  value === null || value === undefined
    ? "unavailable"
    : typeof value === "number"
      ? Number(value.toFixed(3)).toLocaleString("en-US")
      : String(value);
export function renderMetaTable(meta) {
  const d = (row, key) =>
    `${display(row.metrics[key])} (Δ ${display(row.delta[key])})`;
  return [
    "",
    `Observation cutoff: ${meta.observedAt ?? "unknown"}; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.`,
    "",
    "| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...meta.orders.map(
      (row) =>
        `| ${row.workOrder} | ${d(row, "elapsedMs")} / ${row.metrics.attempts} | ${d(row, "gateMs")} | ${d(row, "readObligationCount")} / ${d(row, "readObligationBytes")} | ${d(row, "tokens")} / ${d(row, "costUsd")} | ${d(row, "declaredPromptTokens")} | ${d(row, "operatorCorrections")} |`,
    ),
    "",
    "Unavailable observations are not zero; unset ceilings are not approvals of a future limit.",
    "",
    "| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...meta.orders
      .filter((row) => row.phase !== "closed")
      .flatMap((order) =>
        order.dispatches.map(
          (row) =>
            `| ${order.workOrder}/${row.role} | ${display(row.wallClockMs)} (${display(row.delta.wallClockMs)}) | ${display(row.bytesReadIntoContext)} (${display(row.delta.bytesReadIntoContext)}) | ${display(row.commandsRun)} (${display(row.delta.commandsRun)}) | ${display(row.observedTokens)} (${display(row.delta.observedTokens)}) | ${display(row.stepCount)} (${display(row.delta.stepCount)}) | ${display(row.observedCostUsd)} (${display(row.delta.observedCostUsd)}) / ${display(row.declaredPromptTokens)} |`,
        ),
      ),
  ].join("\n");
}
export function renderMeta(meta) {
  const metricRows = meta.orders.flatMap((order) => [
    `${order.workOrder} metrics (value; previous-order delta):`,
    ...Object.entries(order.metrics).map(
      ([key, value]) =>
        `  ${key}: ${display(value)}; Δ ${display(order.delta[key])}`,
    ),
    ...order.phases.map(
      (row) => `  phase ${row.phase}: ${display(row.elapsedMs)} ms`,
    ),
    ...order.dispatches.map(
      (row) =>
        `  ${row.role}: ${Object.entries(row)
          .filter(([key]) => !["role", "delta"].includes(key))
          .map(
            ([key, value]) =>
              `${key} ${display(value)} (Δ ${display(row.delta[key])})`,
          )
          .join("; ")}`,
    ),
    ...Object.entries(order.sizes ?? {}).map(
      ([path, value]) =>
        `  ${path}: ${display(value)} bytes; Δ ${display(order.sizeDeltas[path])}`,
    ),
  ]);
  return [
    renderMetaTable(meta),
    "",
    ...metricRows,
    "",
    "Per-dispatch usage sources:",
    ...meta.orders.flatMap((order) =>
      order.usage.map(
        (row) =>
          `${order.workOrder}/${row.role}: ${display(row.observation.usage.totalTokens)} tokens; USD ${display(row.observation.usage.costUsd)}; ${row.observation.source}, ${row.observation.scope}`,
      ),
    ),
    ...(meta.unassignedDispatches ?? []).map(
      (row) =>
        `Unassigned planning ${row.dispatch}/${row.role}: ${display(row.observation.usage.totalTokens)} tokens; USD ${display(row.observation.usage.costUsd)}; ${row.observation.source}`,
    ),
    "",
    "Installed cold start:",
    ...meta.coldStart.profiles.map(
      (row) =>
        `${row.skillsRoot}/${row.role}: ${display(row.bytes)} bytes; Δ ${display(row.delta)}; ${row.verdict}`,
    ),
    "",
    `Declared supports=${display(meta.declared.supports)}, units=${display(meta.declared.units)}, hooks=${display(meta.declared.hooks)}`,
    "",
    "Merged title series (characters; no numeric limit):",
    ...meta.subjects.map((row) => `${row.characters}: ${row.title}`),
    "",
    "Closed-order cost reconciliation (planning input only):",
    ...(meta.costReconciliation ?? []).map(
      (row) =>
        `${row.workOrder}: promised removal: ${row.promisedRemoval}; observed: ${row.observedRows.length ? row.observedRows.map((gate) => `${gate.checkId} ${display(gate.durationMs)} ms at ${gate.recordedAt} (${gate.evidenceRef})`).join("; ") : row.historicalMetrics ? `historical metrics ${JSON.stringify(row.historicalMetrics.metrics)}; source ${row.historicalMetrics.source}; cutoff ${row.historicalMetrics.cutoff}` : "unknown"}; outcome ${row.outcome}${row.planningInput ? `; PLANNING INPUT: ${row.planningInput}` : ""}`,
    ),
    "",
    "Budget observations:",
    ...meta.budgets.map(
      (row) =>
        `${row.scope ?? "current"}/${row.metric}: ${display(row.value)}; ceiling ${row.ceiling == null ? "unset" : row.ceiling}; ${row.verdict}`,
    ),
    "",
    "Systems-trap signals:",
    ...meta.orders.map(
      (row) =>
        `${row.workOrder} journal corrections: ${row.corrections.total}; per phase ${JSON.stringify(row.corrections.byPhase)}; per unit ${JSON.stringify(row.corrections.byUnit)}; per phase/unit ${JSON.stringify(row.corrections.byPhaseAndUnit)}.`,
    ),
    ...meta.traps.map(
      (row) =>
        `${row.id}: ${row.indicators.map((indicator) => `${indicator.metric} ${display(indicator.series.at(-1)?.value)} (Δ ${display(indicator.series.at(-1)?.delta)})`).join("; ")}; ${row.reopenCandidate ? "REOPEN CANDIDATE" : "insufficient worsening evidence"}`,
    ),
    ...meta.reopenCandidates.map(
      (row) =>
        `REOPEN ${row.decision ?? row.trap}: ${JSON.stringify(row.condition)}`,
    ),
  ].join("\n");
}

export function metaHealth(meta) {
  const breached = meta.budgets.filter(
    (row) => row.verdict === "breach",
  ).length;
  const latest = meta.orders.at(-1);
  return `Process health: ${breached ? `${breached} budget breaches` : "no observed budget breach"}; ${latest?.workOrder ?? "no work"} tokens ${display(latest?.metrics.tokens)}; ${meta.reopenCandidates.length} reopen candidates; unset limits remain unset.`;
}
export function checkMeta(meta) {
  for (const row of meta.budgets.filter((row) => row.verdict === "breach"))
    console.warn(
      `Advisory: process budget ${row.metric}=${row.value ?? row.bytes} exceeds ${row.ceiling}; planning input.`,
    );
}
