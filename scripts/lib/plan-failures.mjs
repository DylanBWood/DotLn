import { json as encode } from "./helpers.mjs";
import { docPath, docRelative } from "./config.mjs";
import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

import { controlPaths } from "./control.mjs";
import { readControl } from "./control-store.mjs";
import { isCorrection, readDecisions } from "./meta.mjs";
import { MANUAL_RECEIPTS, readOverrides } from "./plan-receipts.mjs";
import { readEntropyControl, readReceipt } from "./entropy-review.mjs";
import { checksPath, readGateChecks } from "./gate-evidence.mjs";
import { bounded } from "./planning-followups.mjs";
import { completedPhaseAttempts } from "./control-time.mjs";
import { parseHeader } from "../work-orders.mjs";
import { measuredFindingCounts } from "./review-findings.mjs";

// WO-172: what failed since the pass before, folded from the public record:
// the control logs, the planning control log and the structured decisions.
// An item carries identifiers, dates and paths, never a report's or a
// decision's text.
export const FAILURES_COMMAND = "npm run plan -- failures";
const ROWS_PER_PAGE = 32;
const START_BYTES = 1024;
const OFF_RAMPS = new Set([
  "CriterionWaived",
  "WorkOrderWithdrawn",
  "RecordCorrected",
  "OperatorOverrideRecorded",
]);
const KIND_ORDER = [
  "failed-judgment",
  "review-findings",
  "repair",
  "off-ramp",
  "amendment",
  "correction",
];
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const oneLine = (value) => String(value).replace(/\s+/gu, " ").trim();
const requireFailures = (condition, reason) => {
  if (!condition) throw new Error(`Planning failures: ${reason}`);
};

// The phase a correction's dispatch names: its first lifecycle phrase, else
// its first phase named in words. A dispatch that names none is `unnamed`.
const lifecyclePhrases = [
  [/\bresume:\s*next\b/iu, "implementation"],
  [/\bresume:\s*fix\b/iu, "repair"],
  [/\bresume:\s*verify\b/iu, "verification"],
  [/\bresume:\s*final review\b/iu, "finalReview"],
  [/\bresume:\s*release close\b/iu, "releaseClose"],
];
const phaseWords = [
  [
    /^\s*planning:|\bplanning (?:pass|session)\b|\bduring planning\b/iu,
    "planning",
  ],
  [/^\s*ideation:/iu, "ideation"],
  [/\bfinal review\b/iu, "finalReview"],
  [/\brelease close\b/iu, "releaseClose"],
  [/\brepair\b/iu, "repair"],
  [/\bverif(?:y|ication|ier)\b/iu, "verification"],
  [/\b(?:execution|implementation)\b/iu, "implementation"],
];
const firstNamed = (text, patterns) =>
  patterns
    .map(([pattern, phase]) => ({ phase, at: pattern.exec(text)?.index }))
    .filter((row) => row.at !== undefined)
    .sort((a, b) => a.at - b.at)[0]?.phase;
export const dispatchPhase = (dispatch) =>
  firstNamed(String(dispatch), lifecyclePhrases) ??
  firstNamed(String(dispatch), phaseWords) ??
  "unnamed";

// The window opens at the latest planning receipt's completion. Receipts are
// read as filed: the plan check validates their chain, and a count needs only
// the time (WO-172 D001 measured the chain at 1.63 s against 0.05 s). Like the
// chain, it excludes the manual redirect records by name and refuses any other
// receipt it cannot read.
export function latestPlanningReceipt(root) {
  const directory = docPath(root, "refutations");
  if (!existsSync(directory)) return null;
  let latest = null;
  for (const name of readdirSync(directory).sort()) {
    const id = /^(\d{4}-\d{2}-\d{2}-[a-z][a-z0-9-]*-\d{3})\.json$/u.exec(
      name,
    )?.[1];
    if (!id || MANUAL_RECEIPTS.test(name)) continue;
    let receipt;
    try {
      receipt = JSON.parse(readFileSync(join(directory, name), "utf8"));
    } catch {
      throw new Error(`Planning failures: receipt ${name} is not JSON`);
    }
    const completedAt = receipt?.episode?.completedAt;
    requireFailures(
      receipt?.schemaVersion === "plan-refutation-receipt-v1" &&
        receipt.receiptId === id &&
        Number.isSafeInteger(receipt.ordinal) &&
        typeof completedAt === "string" &&
        Number.isFinite(Date.parse(completedAt)),
      `receipt ${name} names no receipt schema, identity, ordinal or completion time`,
    );
    if (
      receipt.pass?.kind === "planning" &&
      (!latest || receipt.ordinal > latest.ordinal)
    )
      latest = {
        receiptId: id,
        ordinal: receipt.ordinal,
        completedAt: new Date(Date.parse(completedAt)).toISOString(),
      };
  }
  return latest;
}

const judge = (actor) =>
  Object.fromEntries(
    ["harness", "model", "effort"].map((key) => [
      key,
      typeof actor?.[key] === "string" && actor[key] ? actor[key] : "unknown",
    ]),
  );

/** Every item of the record, newest first, and the per-order facts the counts
 * read: the first time an order was made ready and how its first verification
 * ended. An event without a time is `recordedAt: unknown`; a decision carries
 * a date and no time. */
export function failureRecord(root) {
  const control = readControl(root);
  const items = [],
    facts = [];
  for (const events of control.eventSegments.values()) {
    const ready = new Set(),
      verified = new Set(),
      judged = new Map();
    for (const [index, event] of events.entries()) {
      const order = event.workOrderId,
        recordedAt = event.recordedAt ?? "unknown";
      // A corrected report path or attestation replaces the judgment's own,
      // as the control fold applies it (WO-158).
      if (event.type === "RecordCorrected") {
        const item = judged.get(event.subject?.ordinal);
        if (item) {
          const fields = event.fields ?? {};
          if (typeof fields.reportPath === "string")
            item.path = fields.reportPath;
          for (const key of ["model", "effort"])
            if (typeof fields[key] === "string") item.judge[key] = fields[key];
          item.corrected = true;
        }
      }
      if (event.type === "ImplementationReady" && !ready.has(order)) {
        ready.add(order);
        facts.push({ fact: "made-ready", order, recordedAt });
      }
      if (event.type === "VerificationCompleted" && !verified.has(order)) {
        verified.add(order);
        facts.push({
          fact: "first-verification",
          order,
          recordedAt,
          failed: event.verdict === "fail",
        });
      }
      // A clean review is no failure item; its zero stays in
      // finalReviewFindings.
      if (
        event.type === "FinalReviewCompleted" &&
        Object.values(measuredFindingCounts(event) ?? {}).some((n) => n > 0)
      )
        items.push({
          kind: "review-findings",
          order,
          report: event.finalReviewId,
          recordedAt,
          findingCounts: event.findingCounts,
        });
      if (
        ["VerificationCompleted", "FinalReviewCompleted"].includes(
          event.type,
        ) &&
        event.verdict === "fail"
      ) {
        const verification = event.type === "VerificationCompleted";
        const item = {
          kind: "failed-judgment",
          order,
          report:
            (verification ? event.verificationId : event.finalReviewId) ??
            "unknown",
          phase: verification ? "verification" : "finalReview",
          recordedAt,
          path: event.reportPath ?? "unknown",
          judge: judge(event.actor),
        };
        judged.set(index + 1, item);
        items.push(item);
      } else if (event.type === "RepairCompleted")
        items.push({
          kind: "repair",
          order,
          answers: event.sourceVerificationId ?? "unknown",
          recordedAt,
        });
      else if (OFF_RAMPS.has(event.type)) {
        const subject = events[(event.subject?.ordinal ?? 0) - 1];
        items.push({
          kind: "off-ramp",
          event: event.type,
          order,
          ...(typeof event.criterionId === "string"
            ? { criterion: event.criterionId }
            : {}),
          ...(event.type === "RecordCorrected" && subject
            ? {
                corrects:
                  subject.verificationId ??
                  subject.finalReviewId ??
                  subject.type,
              }
            : {}),
          recordedAt,
        });
      }
    }
  }
  // A withdrawal is its own item at its own time; an amendment reads withdrawn
  // only in a window whose end the withdrawal precedes.
  const planning = readOverrides(root);
  const byRow = new Map(planning.map((event) => [event.rowOrdinal, event]));
  const withdrawals = new Map(
    planning
      .filter((event) => event.type === "PlanExecutionAmendmentWithdrawn")
      .map((event) => [event.rowOrdinalWithdrawn, event.recordedAt]),
  );
  for (const event of planning)
    if (event.type === "PlanExecutionAmended") {
      const item = {
        kind: "amendment",
        event: event.type,
        order: event.workOrderId,
        decision: event.decisionId,
        recordedAt: event.recordedAt,
        withdrawn: withdrawals.has(event.rowOrdinal),
      };
      Object.defineProperty(item, "withdrawnAt", {
        value: withdrawals.get(event.rowOrdinal) ?? null,
      });
      items.push(item);
    } else if (event.type === "PlanExecutionAmendmentWithdrawn")
      items.push({
        kind: "amendment",
        event: event.type,
        order: event.workOrderId,
        decision: byRow.get(event.rowOrdinalWithdrawn)?.decisionId ?? "unknown",
        recordedAt: event.recordedAt,
      });
    else if (event.type === "PlanHoldOverridden")
      items.push({
        kind: "amendment",
        event: event.type,
        receipt: event.receiptId,
        recordedAt: event.recordedAt,
      });
  for (const decision of readDecisions(root))
    if (isCorrection(decision))
      items.push({
        kind: "correction",
        decision: decision.id,
        date: decision.date,
        phase: dispatchPhase(decision.dispatch),
      });
  // Newest first. A dated item sorts at the end of its day; an item without
  // a time is oldest.
  const key = (item) =>
    item.date
      ? `${item.date}T23:59:59.999Z`
      : item.recordedAt === "unknown"
        ? ""
        : item.recordedAt;
  const identity = (item) =>
    `${item.order ?? ""} ${item.report ?? item.answers ?? item.decision ?? item.receipt ?? item.event ?? ""}`;
  items.sort(
    (a, b) =>
      key(b).localeCompare(key(a)) ||
      KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
      identity(a).localeCompare(identity(b)),
  );
  return { control, items, facts };
}

/** Historical events without a count are unmeasured, never zero escapes.
 * The recent figure takes every final review of the ten most recently
 * reviewed orders, including failed attempts and findings on passing reviews. */
export function finalReviewFindings(
  control,
  includes = () => true,
  { full = false } = {},
) {
  const events = [...control.eventSegments.values()]
    .flat()
    .filter((event) => event.type === "FinalReviewCompleted")
    .sort((a, b) => (b.recordedAt ?? "").localeCompare(a.recordedAt ?? ""));
  const recentOrders = [
    ...new Set(events.map((event) => event.workOrderId)),
  ].slice(0, 10);
  const summarize = (rows) => {
    const measured = rows.filter(measuredFindingCounts);
    const escapes = measured.reduce(
      (sum, event) => sum + event.findingCounts.escape,
      0,
    );
    const unclassed = measured.reduce(
      (sum, event) => sum + event.findingCounts.unclassed,
      0,
    );
    return {
      reviews: rows.length,
      measured: measured.length,
      escapes,
      unclassed,
      escapesPerFinalReview:
        rows.length && measured.length === rows.length
          ? escapes / rows.length
          : null,
    };
  };
  const selected = events.filter((event) =>
    includes({ recordedAt: event.recordedAt ?? "unknown" }),
  );
  const byOrder = new Map();
  for (const event of selected) {
    const rows = byOrder.get(event.workOrderId) ?? [];
    rows.push(event);
    byOrder.set(event.workOrderId, rows);
  }
  const rows = [...byOrder].map(([order, events]) => [
    order,
    summarize(events),
  ]);
  const shown = full ? rows : rows.slice(0, LOCAL_ORDERS);
  return {
    ...summarize(selected),
    byOrder: Object.fromEntries(shown),
    ...(shown.length < rows.length
      ? { otherOrders: rows.length - shown.length }
      : {}),
    recent: {
      orders: recentOrders.length,
      ...summarize(
        events.filter((event) => recentOrders.includes(event.workOrderId)),
      ),
    },
  };
}

// A bound is a UTC date (its midnight) or a timestamp that carries its zone: a
// time without one would read as the host's local time. It names a moment
// that exists: the engine rolls 2026-09-31 into October and 2026-02-30 into
// March, which would move the window without saying so (WO-172-D029).
const BOUND =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/iu;
const canonicalTime = (value, flag) => {
  const fields = typeof value === "string" ? BOUND.exec(value) : null,
    time = fields ? Date.parse(value) : NaN,
    zone = fields?.[7] ?? "Z",
    offset = /^z$/iu.test(zone)
      ? 0
      : (zone.startsWith("-") ? -1 : 1) *
        (Number(zone.slice(1, 3)) * 60 + Number(zone.slice(4, 6)));
  // Read in the zone the bound names, the instant gives back the bound's own
  // date and time; any other reading is a moment the bound never named.
  // An instant outside the years 0000 to 9999 has no text that sorts with
  // the record's times, so its bound is refused.
  requireFailures(
    Number.isFinite(time) &&
      new Date(time).getUTCFullYear() >= 0 &&
      new Date(time).getUTCFullYear() <= 9999 &&
      new Date(time + offset * 60000)
        .toISOString()
        .startsWith(
          `${fields[1]}-${fields[2]}-${fields[3]}T${fields[4] ?? "00"}:${fields[5] ?? "00"}:${fields[6] ?? "00"}`,
        ),
    `${flag} needs a UTC date or a time with its zone, such as 2026-09-28T04:00:00.000Z`,
  );
  return new Date(time).toISOString();
};

/** The window a page reads. `--all` removes the lower bound and admits items
 * without a time; `--since` replaces the receipt's time; both bounds and a
 * decision's day are included. */
export function failureWindow(
  root,
  { since = null, until = null, all = false } = {},
) {
  requireFailures(
    !(all && since !== null),
    "--all and --since exclude each other",
  );
  const upper = until === null ? null : canonicalTime(until, "--until");
  let lower = null,
    opensAt;
  if (all) opensAt = "the whole record (--all)";
  else if (since !== null) {
    lower = canonicalTime(since, "--since");
    opensAt = "--since";
  } else {
    const receipt = latestPlanningReceipt(root);
    lower = receipt?.completedAt ?? null;
    opensAt = receipt
      ? `latest planning receipt ${receipt.receiptId}`
      : "no planning receipt: every item with a time";
  }
  requireFailures(
    lower === null || upper === null || lower <= upper,
    "the window closes before it opens",
  );
  const includes = (item) => {
    if (item.date)
      return (
        (lower === null || item.date >= lower.slice(0, 10)) &&
        (upper === null || item.date <= upper.slice(0, 10))
      );
    if (item.recordedAt === "unknown") return all;
    const at = new Date(Date.parse(item.recordedAt)).toISOString();
    return (lower === null || at >= lower) && (upper === null || at <= upper);
  };
  // An amendment reads withdrawn only when its withdrawal precedes the end.
  const shown = (item) =>
    item.event === "PlanExecutionAmended"
      ? {
          ...item,
          withdrawn:
            item.withdrawnAt !== null &&
            (upper === null ||
              new Date(Date.parse(item.withdrawnAt)).toISOString() <= upper),
        }
      : item;
  return {
    public: {
      since: lower,
      until: upper,
      opensAt,
      timeless: all ? "included" : "excluded",
    },
    flags: `${all ? " --all" : since !== null ? ` --since ${lower}` : ""}${upper === null ? "" : ` --until ${upper}`}`,
    includes,
    shown,
  };
}

export function failureCounts(items, facts) {
  const count = (predicate) => items.filter(predicate).length;
  const offRampEvents = {};
  for (const item of items.filter((row) => row.kind === "off-ramp"))
    offRampEvents[item.event] = (offRampEvents[item.event] ?? 0) + 1;
  return {
    failedVerifications: count(
      (row) => row.kind === "failed-judgment" && row.phase === "verification",
    ),
    failedFinalReviews: count(
      (row) => row.kind === "failed-judgment" && row.phase === "finalReview",
    ),
    repairs: count((row) => row.kind === "repair"),
    ordersMadeReady: facts.filter((row) => row.fact === "made-ready").length,
    failedFirstVerifications: facts.filter(
      (row) => row.fact === "first-verification" && row.failed,
    ).length,
    corrections: count((row) => row.kind === "correction"),
    offRamps: count((row) => row.kind === "off-ramp"),
    offRampEvents,
    amendments: count((row) => row.event === "PlanExecutionAmended"),
    withdrawnAmendments: count(
      (row) => row.event === "PlanExecutionAmendmentWithdrawn",
    ),
    overriddenHolds: count((row) => row.event === "PlanHoldOverridden"),
  };
}

// Local only: failed rows of this checkout's gate index, counted per order and
// never listed; a run can leave both a runner row and a host row, and a row
// without an order is unassigned. The page names the orders with the most
// rows and counts the rest. A checkout without the index adds nothing.
const LOCAL_ORDERS = 12;
function localMemoryStops(root, includes) {
  const file = join(dirname(checksPath(root)), "memory-incidents.jsonl");
  if (!existsSync(file)) return null;
  const byScope = {};
  const countedStops = new Set();
  let stops = 0;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line) continue;
    let row;
    try {
      row = JSON.parse(line);
    } catch {
      continue;
    }
    if (row.failureKind !== "memory-budget" || !includes(row)) continue;
    // A guard and runner may both witness the same stopped tree. Preserve the
    // incident attempts, but count its PID/birth identity once in this view.
    if (typeof row.stopId === "string") {
      if (countedStops.has(row.stopId)) continue;
      countedStops.add(row.stopId);
    }
    stops++;
    const scope = ["task", "gate", "host"].includes(row.scope)
      ? row.scope
      : "unknown";
    byScope[scope] = (byScope[scope] ?? 0) + 1;
  }
  return {
    source: "local",
    counted:
      "typed memory stops in this checkout's ignored incident ledger; counted only, separate from failed gate rows",
    stops,
    byScope,
  };
}
function localGateFailures(root, includes) {
  if (!existsSync(checksPath(root))) return null;
  let rows;
  try {
    rows = readGateChecks(root);
  } catch (error) {
    return { source: "local", unavailable: oneLine(error.message) };
  }
  const byOrder = {};
  for (const row of rows)
    if (
      row?.executed === true &&
      Number.isInteger(row.exitCode) &&
      row.exitCode !== 0 &&
      includes({
        recordedAt: Number.isFinite(Date.parse(row.recordedAt))
          ? row.recordedAt
          : "unknown",
      })
    ) {
      const order =
        typeof row.workOrder === "string" ? row.workOrder : "unassigned";
      byOrder[order] = (byOrder[order] ?? 0) + 1;
    }
  const ranked = Object.entries(byOrder).sort(
    ([a, m], [b, n]) => n - m || a.localeCompare(b),
  );
  const rest = ranked.slice(LOCAL_ORDERS);
  return {
    source: "local",
    counted:
      "failed rows of this checkout's gate index, not runs (a run can leave a runner row and a host row); counted only",
    failedRows: ranked.reduce((sum, [, value]) => sum + value, 0),
    byOrder: Object.fromEntries(ranked.slice(0, LOCAL_ORDERS)),
    ...(rest.length
      ? {
          otherOrders: rest.length,
          otherRows: rest.reduce((sum, [, value]) => sum + value, 0),
        }
      : {}),
  };
}

// Local only: what the shell said about commands as written, as this
// checkout's observer counted it, per class and per order and never listed
// (WO-172-D037, WO-172-D038). The observer sees a command under Claude Code:
// at the call where the host did not mark its result failed, and otherwise at
// the next observed call, so the count is a lower bound. A row without
// an order is unassigned, a line that cannot be read is passed over, and a
// checkout without the file adds nothing.
const SHELL_DIAGNOSTICS = "shell-diagnostics.jsonl";
const LOCAL_KINDS = 24;
function localShellDiagnostics(root, includes) {
  const path = join(dirname(checksPath(root)), SHELL_DIAGNOSTICS);
  if (!existsSync(path)) return null;
  let lines;
  try {
    requireFailures(
      lstatSync(path).isFile(),
      "the shell diagnostic log is not a regular file",
    );
    lines = readFileSync(path, "utf8").split("\n");
  } catch (error) {
    return { source: "local", unavailable: oneLine(error.message) };
  }
  // A name a row holds is never a name the tally already has.
  const byKind = Object.create(null),
    byOrder = Object.create(null);
  for (const line of lines) {
    let row;
    try {
      row = JSON.parse(line);
    } catch {
      continue;
    }
    if (
      typeof row?.kind !== "string" ||
      !/^[a-z][a-z-]{0,39}$/u.test(row.kind) ||
      !includes({
        recordedAt: Number.isFinite(Date.parse(row.at)) ? row.at : "unknown",
      })
    )
      continue;
    const order =
      typeof row.workOrder === "string" && /^WO-\d{3}$/u.test(row.workOrder)
        ? row.workOrder
        : "unassigned";
    byKind[row.kind] = (byKind[row.kind] ?? 0) + 1;
    byOrder[order] = (byOrder[order] ?? 0) + 1;
  }
  const rank = (counts) =>
    Object.entries(counts).sort(
      ([a, m], [b, n]) => n - m || a.localeCompare(b),
    );
  const ranked = rank(byOrder),
    rest = ranked.slice(LOCAL_ORDERS),
    kinds = rank(byKind),
    otherKinds = kinds.slice(LOCAL_KINDS);
  return {
    source: "local",
    counted:
      "diagnostics the shell printed about commands as written, as this checkout's observer saw them under Claude Code; a lower bound, counted only",
    diagnostics: ranked.reduce((sum, [, value]) => sum + value, 0),
    byKind: Object.fromEntries(kinds.slice(0, LOCAL_KINDS)),
    ...(otherKinds.length
      ? {
          otherKinds: otherKinds.length,
          otherKindRows: otherKinds.reduce((sum, [, value]) => sum + value, 0),
        }
      : {}),
    byOrder: Object.fromEntries(ranked.slice(0, LOCAL_ORDERS)),
    ...(rest.length
      ? {
          otherOrders: rest.length,
          otherRows: rest.reduce((sum, [, value]) => sum + value, 0),
        }
      : {}),
  };
}

const sourceNote = (root) =>
  `${controlPaths(root).legacy}, ${controlPaths(root).orders}/, ${docRelative(root, "control", "plan-refutations.jsonl")} and the decisions under ${docRelative(root, "evidence")}/; identifiers, dates and paths only`;

const knownOrder = (value) =>
  /^WO-\d{3}$/u.test(value ?? "") ? value : "unassigned";
const knownTime = (value) =>
  typeof value === "string" && Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : "unknown";
const classes = new Set([
  "correction",
  "direction",
  "question",
  "ideation",
  "answer",
  "scope expansion",
  "interrupt",
  "acknowledgement",
  "override",
  "takeover",
  "other step",
  "positive reinforcement",
  "trial and error",
  "unclassified",
]);
const phases = new Set([
  "implementation",
  "verification",
  "repair",
  "finalReview",
  "release-close",
  "planning",
  "planner",
  "refuter",
  "ideation",
  "unknown",
]);
const tally = (rows, field, limit = 6) => {
  const counts = new Map();
  for (const row of rows)
    counts.set(row[field], (counts.get(row[field]) ?? 0) + 1);
  const ranked = [...counts].sort(
    ([a, m], [b, n]) => n - m || a.localeCompare(b),
  );
  return {
    by: Object.fromEntries(ranked.slice(0, limit)),
    other: ranked.slice(limit).reduce((sum, [, count]) => sum + count, 0),
  };
};

/** Local observations are kept apart from immutable failed judgments. Page
 * metadata counts them; the export carries only these sanitized projections. */
export function operationalFailures(root, control, includes) {
  const rows = [],
    unreadable = { closes: 0, journals: 0, gates: 0 };
  let closeRecords = 0,
    journalRecords = 0;
  const retained = docPath(root, "control", "local/retained");
  if (existsSync(retained))
    for (const name of readdirSync(retained).sort()) {
      if (!/^WO-\d{3}$/.test(name)) continue;
      const file = join(retained, name, "release-close.json");
      if (!existsSync(file)) continue;
      try {
        if (
          !lstatSync(join(retained, name)).isDirectory() ||
          !lstatSync(file).isFile()
        )
          throw new Error();
        const record = JSON.parse(readFileSync(file, "utf8"));
        if (record.schemaVersion !== 1 || record.workOrderId !== name)
          throw new Error();
        closeRecords++;
        for (const attempt of [
          ...(Array.isArray(record.previousAttempts)
            ? record.previousAttempts
            : []),
          record,
        ]) {
          if (!attempt?.publication || !Array.isArray(attempt.blockers)) {
            unreadable.closes++;
            continue;
          }
          const published = ["published", "already-published"].includes(
            attempt.publication.tagOutcome,
          );
          if (attempt.blockers.length || !published)
            rows.push({
              kind: "release-close",
              order: name,
              recordedAt: knownTime(attempt.recordedAt ?? attempt.startedAt),
              blockers: attempt.blockers.length,
              unpublishedTag: !published,
              dryRun: attempt.dryRun === true,
              noRelease: attempt.publication.outcome === "no-release",
            });
        }
      } catch {
        unreadable.closes++;
      }
    }
  const directory = dirname(checksPath(root));
  if (existsSync(directory))
    for (const name of readdirSync(directory).sort()) {
      if (!/^[a-f0-9]{64}\.jsonl$/.test(name)) continue;
      try {
        const file = join(directory, name);
        if (!lstatSync(file).isFile()) throw new Error();
        journalRecords++;
        for (const line of readFileSync(file, "utf8")
          .split("\n")
          .filter(Boolean)) {
          let row;
          try {
            row = JSON.parse(line);
          } catch {
            unreadable.journals++;
            continue;
          }
          const context = {
            order: knownOrder(row.workOrder),
            phase: phases.has(row.phase) ? row.phase : "unknown",
            recordedAt: knownTime(row.recordedAt),
          };
          if (row.typedEvent === "HostPermissionDenied")
            rows.push({ kind: "host-denial", ...context });
          else if (row.typedEvent === "OperatorMessageObserved")
            rows.push({
              kind: "intervention",
              ...context,
              class: classes.has(row.class) ? row.class : "unclassified",
              source: [
                "claude-prompt-hook",
                "copilot-prompt-hook",
                "codex-dispatch-phrase",
              ].includes(row.source)
                ? row.source
                : "unknown",
              route: ["turn-prompt", "mid-turn", "interrupt"].includes(
                row.route,
              )
                ? row.route
                : "unknown",
            });
        }
      } catch {
        unreadable.journals++;
      }
    }
  const attempts = [];
  for (const events of control.eventSegments.values()) {
    const completions = events.filter((event) =>
      [
        "ImplementationReady",
        "VerificationCompleted",
        "RepairCompleted",
        "FinalReviewCompleted",
      ].includes(event.type),
    );
    for (const [index, attempt] of [
      ...completedPhaseAttempts(events),
    ].entries())
      if (Number.isFinite(attempt.elapsedMs) && attempt.elapsedMs >= 0)
        attempts.push({
          kind: "long-phase",
          order: knownOrder(attempt.workOrder),
          phase: attempt.phase,
          elapsedMs: attempt.elapsedMs,
          recordedAt: knownTime(completions[index]?.recordedAt),
        });
  }
  const medians = {};
  for (const phase of new Set(attempts.map((row) => row.phase))) {
    const values = attempts
      .filter((row) => row.phase === phase)
      .map((row) => row.elapsedMs)
      .sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    medians[phase] =
      values.length % 2
        ? values[middle]
        : (values[middle - 1] + values[middle]) / 2;
  }
  rows.push(
    ...attempts
      .filter((row) => row.elapsedMs > 2 * medians[row.phase])
      .map((row) => ({ ...row, medianMs: medians[row.phase] })),
  );
  try {
    const green = new Set();
    for (const row of readGateChecks(root).sort((a, b) =>
      (a.recordedAt ?? "").localeCompare(b.recordedAt ?? ""),
    )) {
      if (
        row.checkId !== "npm test" ||
        row.executed !== true ||
        !/^[a-f0-9]{64}$/.test(row.codeIdentity ?? "")
      )
        continue;
      if (green.has(row.codeIdentity))
        rows.push({
          kind: "repeated-gate",
          order: knownOrder(row.workOrder),
          recordedAt: knownTime(row.recordedAt),
        });
      if (row.exitCode === 0) green.add(row.codeIdentity);
    }
  } catch {
    unreadable.gates++;
  }
  const selected = rows.filter(includes);
  const ofKind = (kind) => selected.filter((row) => row.kind === kind);
  const summary = (kind) => {
    const selected = ofKind(kind),
      orders = tally(selected, "order");
    return {
      source: "local",
      count: selected.length,
      byOrder: orders.by,
      otherOrderRows: orders.other,
    };
  };
  const interventions = ofKind("intervention"),
    closes = ofKind("release-close");
  const recent = [...control.orders]
    .filter(([, row]) => row.state.phase === "closed")
    .sort(
      ([a, left], [b, right]) =>
        (right.closeRecordedAt ?? "").localeCompare(
          left.closeRecordedAt ?? "",
        ) || a.localeCompare(b),
    )
    .slice(0, 8);
  const tracks = { delivery: 0, machinery: 0, evidence: 0, unknown: 0 };
  for (const [, row] of recent) {
    let track = "unknown";
    try {
      const file = join(root, row.state.workOrderPath);
      if (lstatSync(file).isFile())
        track = parseHeader(
          readFileSync(file, "utf8"),
          row.state.workOrderPath,
        ).track;
    } catch {
      /* Absent authority metadata never guesses a track. */
    }
    tracks[track]++;
  }
  return {
    observations: selected,
    localReleaseCloses: {
      ...summary("release-close"),
      records: closeRecords,
      unreadable: unreadable.closes,
      dryRuns: closes.filter((row) => row.dryRun).length,
      noRelease: closes.filter((row) => row.noRelease).length,
    },
    localHostDenials: {
      ...summary("host-denial"),
      journals: journalRecords,
      unreadable: unreadable.journals,
    },
    interventions: {
      ...summary("intervention"),
      byClass: tally(interventions, "class", 14).by,
      byPhase: tally(interventions, "phase", phases.size).by,
      bySource: tally(interventions, "source").by,
      unclassified: interventions.filter((row) => row.class === "unclassified")
        .length,
      coverage:
        "Claude/Copilot prompt-hook rows; Codex dispatch phrases only; unobserved messages unknown",
    },
    longPhases: {
      ...summary("long-phase"),
      mediansMs: medians,
      counted:
        "completed attempts above twice their phase median over the full control record",
    },
    repeatedGateRuns: {
      ...summary("repeated-gate"),
      unreadable: unreadable.gates,
      counted:
        "product-gate rows at an identity already green; rows, not distinct runs",
    },
    recentTracks: { counted: recent.length, ...tracks },
  };
}

function selection(root, options) {
  const view = failureWindow(root, options);
  const record = failureRecord(root);
  const items = record.items.filter(view.includes).map(view.shown);
  const local = localGateFailures(root, view.includes);
  const memory = localMemoryStops(root, view.includes);
  const shell = localShellDiagnostics(root, view.includes);
  const operational = operationalFailures(root, record.control, view.includes);
  return {
    view,
    record,
    items,
    operational,
    revision: sha256(encode({ window: view.public, items })),
    counts: {
      window: failureCounts(items, record.facts.filter(view.includes)),
      record: failureCounts(record.items, record.facts),
    },
    ...(local ? { local } : {}),
    ...(memory ? { memory } : {}),
    ...(shell ? { shell } : {}),
  };
}

/** One page of the window, newest first, under the feed's 8 KB bound. */
export function planningFailures(
  root,
  { since = null, until = null, all = false, cursor = null } = {},
) {
  const chosen = selection(root, { since, until, all });
  let offset = 0;
  if (cursor !== null) {
    const match = /^([a-f0-9]{64}):(\d+)$/u.exec(cursor);
    requireFailures(
      match &&
        match[1] === chosen.revision &&
        Number.isSafeInteger(Number(match[2])) &&
        Number(match[2]) <= chosen.items.length,
      "stale or invalid page cursor; restart plan failures",
    );
    offset = Number(match[2]);
  }
  const page = {
    revision: chosen.revision,
    source: sourceNote(root),
    window: chosen.view.public,
    counts: chosen.counts,
    finalReviewFindings: finalReviewFindings(
      chosen.record.control,
      chosen.view.includes,
    ),
    ...(chosen.local ? { localGateFailures: chosen.local } : {}),
    ...(chosen.memory ? { localMemoryStops: chosen.memory } : {}),
    ...(chosen.shell ? { localShellDiagnostics: chosen.shell } : {}),
    ...Object.fromEntries(
      Object.entries(chosen.operational).filter(
        ([key]) => key !== "observations",
      ),
    ),
    items: chosen.items.length,
    rows: chosen.items.slice(offset, offset + ROWS_PER_PAGE),
    next: null,
  };
  return bounded(
    page,
    () =>
      offset + page.rows.length < chosen.items.length
        ? `${FAILURES_COMMAND}${chosen.view.flags} --cursor ${chosen.revision}:${offset + page.rows.length}`
        : null,
    "one failure item",
    requireFailures,
  );
}

/** Every item of the window whole, for a file the pass reads. */
export function exportFailures(
  root,
  { since = null, until = null, all = false } = {},
) {
  const chosen = selection(root, { since, until, all });
  return {
    revision: chosen.revision,
    kind: "plan-failures",
    source: sourceNote(root),
    window: chosen.view.public,
    counts: chosen.counts,
    finalReviewFindings: finalReviewFindings(
      chosen.record.control,
      chosen.view.includes,
      { full: true },
    ),
    ...(chosen.local ? { localGateFailures: chosen.local } : {}),
    ...(chosen.memory ? { localMemoryStops: chosen.memory } : {}),
    ...(chosen.shell ? { localShellDiagnostics: chosen.shell } : {}),
    ...chosen.operational,
    items: chosen.items.length,
    rows: chosen.items,
  };
}
export const isFailuresExport = (value) =>
  value?.kind === "plan-failures" &&
  typeof value.revision === "string" &&
  Array.isArray(value.rows);

/** The orders whose final review passed after the latest filed Entropy
 * Reducer review; with no filed review the count is unknown. */
export function sinceEntropyReview(root, control = readControl(root)) {
  const review = readEntropyControl(root)
    .filter((event) => event.type === "EntropyReviewFiled")
    .at(-1);
  if (!review) return { review: null, finalReviewPassedOrders: "unknown" };
  const { endedAt } = readReceipt(root, review.receiptId);
  requireFailures(
    typeof endedAt === "string" && Number.isFinite(Date.parse(endedAt)),
    `entropy receipt ${review.receiptId} names no completion time`,
  );
  const passed = new Set();
  for (const events of control.eventSegments.values())
    for (const event of events)
      if (
        event.type === "FinalReviewCompleted" &&
        event.verdict === "pass" &&
        typeof event.recordedAt === "string" &&
        Date.parse(event.recordedAt) > Date.parse(endedAt)
      )
        passed.add(event.workOrderId);
  return {
    review: review.receiptId,
    endedAt,
    finalReviewPassedOrders: passed.size,
  };
}

/** The `plan start` block: the default window's counts, the command and the
 * Entropy Reducer count, in at most 1 KB. It suggests and schedules nothing,
 * and a count that cannot be computed is one line saying why. */
export function failuresAtStart(root) {
  const block = { command: FAILURES_COMMAND };
  let control;
  try {
    const chosen = selection(root, {});
    control = chosen.record.control;
    const recent = finalReviewFindings(control).recent;
    // The full feed keeps the receipt identity in window.opensAt. Here the
    // actual cutoff and command preserve access to that provenance while all
    // counts, including unknown historical measurements, fit the start bound.
    Object.assign(block, {
      since: chosen.view.public.since,
      items: chosen.items.length,
      counts: chosen.counts.window,
      finalReviewEscapes: `${recent.escapes}/${recent.reviews} reviews; ${recent.orders} orders; ${recent.unclassed} unclassed${recent.measured === recent.reviews ? "" : `; rate unknown (${recent.measured} measured)`}`,
      localReleaseCloses: chosen.operational.localReleaseCloses.count,
      localHostDenials: chosen.operational.localHostDenials.count,
      interventions: {
        count: chosen.operational.interventions.count,
        unclassified: chosen.operational.interventions.unclassified,
      },
      longPhases: chosen.operational.longPhases.count,
      repeatedGateRuns: chosen.operational.repeatedGateRuns.count,
      recentTracks: chosen.operational.recentTracks,
      localCoverage: "local; Codex dispatch-only; incomplete",
    });
  } catch (error) {
    block.unavailable = `counts not computed: ${oneLine(error.message)}`;
  }
  try {
    block.sinceEntropyReview = sinceEntropyReview(root, control);
  } catch (error) {
    block.sinceEntropyReview = `unknown: ${oneLine(error.message)}`;
  }
  // A reason is clipped so the block keeps its bound; the counts never are.
  for (const key of ["unavailable", "sinceEntropyReview"])
    while (
      Buffer.byteLength(encode(block)) > START_BYTES &&
      typeof block[key] === "string" &&
      block[key].length > 80
    )
      block[key] = `${block[key].slice(0, block[key].length - 40).trimEnd()}…`;
  requireFailures(
    Buffer.byteLength(encode(block)) <= START_BYTES,
    "the plan start block exceeds 1 KB",
  );
  return block;
}
