import {
  boundJournal,
  dispatchJournalDirectory,
  dispatchNamesOrder,
  readDispatchJournal,
  readDispatchJournals,
  readJournalRows,
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

/** What the operator's acceptances leave of one metric's base: no ceiling
 * when one says as needed or the base is unset, and never below the base. */
const acceptedCeiling = (acceptances, metric, base) => {
  const own = acceptances.filter((event) => event.metric === metric);
  if (own.some((event) => event.ceiling === null)) return null;
  if (base === null) return null;
  return Math.max(base, ...own.map((event) => event.ceiling));
};
/** The budgets file's subagent cap, every role's base: 20 when the file
 * states none, null when it disables the cap. */
export const baseSubagentCap = (budgets) =>
  budgets?.subagentCap === undefined ? 20 : budgets.subagentCap;
/** The acceptances of one dispatch: those recorded for its phase since that
 * phase last completed. */
const phaseAcceptances = (events, phase) =>
  phaseBoundEvents(events, phase).filter(
    (event) =>
      event.type === "DispatchBoundAccepted" &&
      scopePhase(event.phase) === phase,
  );

/** Fold phase-scoped operator authority once for lifecycle and execution.
 * The two bounds start from the role's row; the subagent cap starts from the
 * budgets file's top-level value, whatever the role. */
export function effectiveDispatchLimits(budgets, role, phase, events) {
  const configured = budgets?.dispatches[role];
  const limits =
    phase === "repairing" ? (configured?.repair ?? configured) : configured;
  const acceptances = phaseAcceptances(events, phase);
  const ceiling = (metric) =>
    acceptedCeiling(acceptances, metric, limits?.[metric] ?? null);
  return {
    wallClockMs: ceiling("wallClockMs"),
    completeRuns: ceiling("completeRuns"),
    subagentCap: acceptedCeiling(
      acceptances,
      "subagentCap",
      baseSubagentCap(budgets),
    ),
    acceptances,
    wallClockBasis: limits?.wallClockBasis ?? null,
  };
}

/** The subagent cap a session's dispatch runs under: `base`, the budgets
 * file's value, or the ceiling an acceptance recorded for that dispatch since
 * its phase began. A session that dispatched no order reads the base, so one
 * order's acceptance never reaches another's dispatch. The runtime's cap
 * reader calls this with the value it read, and no session edits the budgets
 * file for one order. */
export function dispatchSubagentCap(
  root,
  base,
  { session = dispatchSession(), sessionKey, journal, events } = {},
) {
  const key = sessionKey ?? (session ? keyOf(session) : undefined);
  if (!journal && key) {
    const file = join(directory(root), `${key}.json`);
    if (existsSync(file)) journal = readDispatchJournal(file);
  }
  journal = boundJournal(journal);
  if (!journal?.role || !/^WO-\d{3}$/u.test(journal.workOrder ?? ""))
    return base;
  return acceptedCeiling(
    phaseAcceptances(
      events ?? dispatchEvents(root, journal.workOrder),
      dispatchPhase(journal),
    ),
    "subagentCap",
    base,
  );
}
/** The cap a drive of one order runs under: the largest ceiling any
 * acceptance of the order's current activation records for the cap, since a
 * drive's counter spans its phases. */
export const activationSubagentCap = (base, events) =>
  acceptedCeiling(
    events.filter((event) => event.type === "DispatchBoundAccepted"),
    "subagentCap",
    base,
  );

/** A drive's two limits as they stand now: the cap, which is the budgets
 * file's value or the largest one an acceptance of the order's current
 * activation records, and the descendant ceiling, which the file states or
 * which is four times whichever cap applies. A drive and the hooks of its
 * workers read this at each admission, so a cap the operator accepts while a
 * drive runs reaches the launches after it. */
export function drivenSubagentLimits(budgets, events = []) {
  const cap = activationSubagentCap(baseSubagentCap(budgets), events);
  const ceiling =
    budgets?.drivenSessionCeiling === undefined
      ? cap === null
        ? null
        : cap * 4
      : budgets.drivenSessionCeiling;
  return { cap, ceiling };
}
/** The same limits read from the order's control log as it stands, for a
 * reader that holds no events: a drive between launches, and the hook of a
 * drive's worker, which passes the two budget values it read itself. */
export function currentDrivenLimits(
  root,
  workOrder,
  budgets = readBudgets(root),
) {
  return drivenSubagentLimits(budgets, dispatchEvents(root, workOrder));
}

/** A gap in a phase's journals that begins at a turn's end row and is longer
 * than this is idle and adds nothing to the phase's wall-clock value. */
export const IDLE_INTERVAL_MS = 10 * 60 * 1000;

const callEnds = (row) =>
  row.event === "PostToolUse" || row.event === "PostToolUseFailure";

/** The spans of one session's tool calls, each from a start row to an end
 * row. Rows that name their call (`call`) pair exactly: the span runs from
 * the call's first start row to its last end row, and a call with no end row
 * (one refused or interrupted) has no span. Rows that name none, which an
 * earlier kit and some hosts write, pair by tool: an end row closes the
 * earliest start row of its tool still open, and a further end row with none
 * open extends the span just closed. That reading keeps a long call beside
 * shorter ones of the same tool worked, and errs toward worked time where a
 * call never ended and its tool was used again. */
function callSpans(events) {
  const named = new Map();
  const open = new Map();
  const closed = new Map();
  const spans = [];
  for (const { row, at } of events) {
    if (typeof row.tool !== "string") continue;
    const starts = row.event === "PreToolUse";
    if (!starts && !callEnds(row)) continue;
    // An end row that names a call whose start row named none (the hooks
    // were replaced while the call ran) pairs by tool, as an unnamed row.
    if (
      typeof row.call === "string" &&
      row.call &&
      (starts || named.has(row.call))
    ) {
      const call = named.get(row.call) ?? { from: at, to: null };
      if (!starts) call.to = at;
      named.set(row.call, call);
    } else if (starts) {
      if (!open.has(row.tool)) open.set(row.tool, at);
    } else if (open.has(row.tool)) {
      const span = { from: open.get(row.tool), to: at };
      spans.push(span);
      closed.set(row.tool, span);
      open.delete(row.tool);
    } else if (closed.has(row.tool)) closed.get(row.tool).to = at;
  }
  for (const call of named.values()) if (call.to !== null) spans.push(call);
  return spans;
}

/** The idle time between two instants in the journals of a phase's sessions,
 * given as one list of rows for each session. A gap between two rows that
 * follow one another, or between the last row and `to`, is idle only when it
 * begins at a turn's end row (the hosts' `Stop` event), is longer than the
 * interval, and no tool call's start row and end row lie on either side of
 * it. Every other span is worked. A turn's end row counts only in a session
 * whose journal holds a tool call's start row: a host whose tool calls no
 * hook sees writes nothing while it works, so its journal cannot show a gap
 * as idle and its phase reads elapsed time. Only a hook event's own row marks
 * activity: the rows a hook derives while it handles an event carry no event
 * and are passed over.
 * @param {readonly (readonly Record<string, any>[])[]} journals
 * @param {number} from @param {number} to @param {number} [interval] */
export function idleTime(journals, from, to, interval = IDLE_INTERVAL_MS) {
  const marks = [];
  const calls = [];
  for (const rows of journals) {
    const events = rows
      .filter((row) => typeof row?.event === "string")
      .map((row) => ({ row, at: Date.parse(row.recordedAt ?? "") }))
      .filter(({ at }) => Number.isFinite(at))
      .sort((a, b) => a.at - b.at);
    const showsWork = events.some(({ row }) => row.event === "PreToolUse");
    for (const { row, at } of events)
      if (at >= from && at <= to)
        marks.push({ at, turnEnd: showsWork && row.event === "Stop" });
    calls.push(...callSpans(events));
  }
  // At one instant a row that is no turn's end sorts last, so a tie never
  // makes the gap after it idle.
  marks.sort((a, b) => a.at - b.at || Number(b.turnEnd) - Number(a.turnEnd));
  let idle = 0;
  marks.forEach((mark, index) => {
    if (!mark.turnEnd) return;
    const next = marks[index + 1]?.at ?? to;
    if (
      next - mark.at > interval &&
      !calls.some((call) => call.from <= mark.at && call.to >= next)
    )
      idle += next - mark.at;
  });
  return idle;
}

/** The journals of a phase's sessions: this session's, and for a dispatch
 * that names an order every session of the same attempt, which is the same
 * role, line and order, the same phase boundary where both journals record
 * one, and a start no earlier than this one's (the anchor is the attempt's
 * earliest, and a session bound while the lane could not be read keeps a
 * later start of its own). A dispatch that names no order is its own
 * session alone. */
function phaseJournalRows(root, journal, key) {
  const keys = new Set(key ? [key] : []);
  if (dispatchNamesOrder(journal.intent))
    for (const other of dispatchJournals(root))
      if (
        other.journal.role === journal.role &&
        other.journal.intent === journal.intent &&
        (other.journal.workOrder ?? null) === (journal.workOrder ?? null) &&
        (!other.journal.phaseBoundary ||
          !journal.phaseBoundary ||
          other.journal.phaseBoundary === journal.phaseBoundary) &&
        Date.parse(other.journal.startedAt) >= Date.parse(journal.startedAt)
      )
        keys.add(other.key);
  return [...keys].map((session) =>
    readJournalRows(join(directory(root), `${session}.jsonl`)),
  );
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
    "Use analysis: to diagnose. The operator can authorize proceeding in ordinary language in this conversation, including an early run for as long as needed; the agent records the contextual authorization with npm run resume -- accept-overrun <wallClockMs|completeRuns|subagentCap> --ceiling <value|unlimited> --reason <text> --capture <path> --capture-hash sha256:<digest> <actor-flags> and continues in the same session. No special phrase, session exit or manual operator command is required.";
  if (!journal?.role || !Number.isFinite(Date.parse(journal.startedAt)))
    return {
      role: journal?.role ?? null,
      elapsedMs: null,
      workedMs: null,
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
    acceptances: recorded,
    wallClockBasis,
  } = effectiveDispatchLimits(
    readBudgets(root, { cutoff: journal.startedAt }),
    journal.role,
    phase,
    events,
  );
  // The standing is the two bounds': an accepted subagent cap changes
  // neither its rows nor whether it reads as unset.
  const acceptances = recorded.filter(
    (event) => event.metric !== "subagentCap",
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
  // The bound measures work: the elapsed time less the idle gaps the phase's
  // journals show. Where they cannot be read the value is the elapsed time.
  let idleMs = 0;
  try {
    idleMs = idleTime(phaseJournalRows(root, journal, key), started, now);
  } catch {
    idleMs = 0;
  }
  const workedMs = Math.max(0, elapsedMs - idleMs);
  const exceeded = [
    { metric: "wallClockMs", value: workedMs, bound: wallClockMs },
    { metric: "completeRuns", value: completeRuns, bound },
  ].filter((row) => row.bound !== null && row.value >= row.bound);
  return {
    role: journal.role,
    workOrder: journal.workOrder ?? null,
    phase,
    sessionKey: key ?? null,
    startedAt: journal.startedAt,
    elapsedMs,
    workedMs,
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

/** The phase's wall-clock value as a reader sees it: the worked time, and
 * beside it the elapsed time since the dispatch where the two differ. */
const wallClockShown = (standing) => {
  const worked = standing.workedMs ?? standing.elapsedMs;
  return worked === standing.elapsedMs
    ? formatDuration(worked)
    : `${formatDuration(worked)} worked (${formatDuration(standing.elapsedMs)} elapsed)`;
};
export const dispatchStandingLine = (standing) =>
  `dispatch standing: ${wallClockShown(standing)} of ${standing.acceptance?.some((event) => event.metric === "wallClockMs" && event.ceiling === null) ? "as needed" : standing.wallClockMs === null ? "unset" : formatDuration(standing.wallClockMs)}; complete runs ${standing.completeRuns ?? "unknown"} of ${standing.acceptance?.some((event) => event.metric === "completeRuns" && event.ceiling === null) ? "as needed" : (standing.bound ?? "unset")}; ${standing.state}`;
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
 * cannot replenish elapsed time or consumed complete runs. A dispatch whose
 * line names no order has no attempt to share: a planning pass starts at its
 * own session, so no other session's journal is its anchor. */
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
  if (!dispatchNamesOrder(intent)) return undefined;
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
