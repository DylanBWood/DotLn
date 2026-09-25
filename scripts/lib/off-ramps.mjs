// WO-158 off-ramps: the operator capture every operator act names, the
// recording session's observed role, and the report convention that judges a
// waived criterion. Shared by `resume` routes and their completion checks.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, posix } from "node:path";
import { docRelative, rootPattern } from "./config.mjs";
import { runGit } from "./git.mjs";
import { containedRegularFile } from "./paths.mjs";

export const sha256Bytes = (bytes) =>
  `sha256:${createHash("sha256").update(bytes).digest("hex")}`;

/**
 * The `plan override --capture` shape: an ignored, untracked file under the
 * intake root whose SHA-256 the caller states. The event carries both, so the
 * bytes it names stay checkable while the words themselves stay local.
 */
export function requireOperatorCapture(root, capture, captureHash) {
  const refuse = (message) => {
    throw new Error(message);
  };
  if (!/^sha256:[0-9a-f]{64}$/u.test(captureHash ?? ""))
    refuse(
      "requires --capture-hash sha256:<digest> of the operator's captured words",
    );
  if (
    typeof capture !== "string" ||
    !new RegExp(
      `^${rootPattern(root, "intake")}/(?:[a-zA-Z0-9._-]+/)*[a-zA-Z0-9._-]+$`,
      "u",
    ).test(capture) ||
    posix.normalize(capture) !== capture
  )
    refuse(
      `requires --capture <path> naming an ignored capture under ${docRelative(root, "intake")}/`,
    );
  if (!containedRegularFile(join(root, capture), root))
    refuse(`operator capture is not a contained regular file: ${capture}`);
  const bytes = readFileSync(join(root, capture));
  if (!bytes.toString("utf8").trim())
    refuse(`operator capture holds no words: ${capture}`);
  if (sha256Bytes(bytes) !== captureHash)
    refuse(`operator capture hash mismatch: ${capture}`);
  try {
    runGit(root, ["check-ignore", "-q", "--", capture]);
  } catch {
    refuse(`operator capture must be ignored: ${capture}`);
  }
  if (runGit(root, ["ls-files", "--", capture]))
    refuse(`operator capture must remain untracked: ${capture}`);
  return { capture, captureHash };
}

// Every harness names its current session in one of these; the harness
// journal is keyed by the same id's SHA-256 (harness-host sessionKey).
const SESSION_VARIABLES = [
  "CODEX_THREAD_ID",
  "COPILOT_AGENT_SESSION_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_SESSION_ID",
];
const harnessDirectory = (root) =>
  join(root, docRelative(root, "control", "local/harness"));
const journalAt = (root, key) => {
  const path = join(harnessDirectory(root), `${key}.json`);
  if (!/^[0-9a-f]{64}$/u.test(key) || !existsSync(path)) return undefined;
  try {
    const session = JSON.parse(readFileSync(path, "utf8"));
    return {
      role: typeof session.role === "string" ? session.role : "unobserved",
      ...(typeof session.workOrder === "string"
        ? { workOrder: session.workOrder }
        : {}),
      ...(typeof session.startedAt === "string"
        ? { startedAt: session.startedAt }
        : {}),
    };
  } catch {
    return undefined;
  }
};
const digest = (text) => createHash("sha256").update(text).digest("hex");
const sessionJournals = (root, env) =>
  [
    ...new Set(
      SESSION_VARIABLES.map((name) => env[name]).filter(
        (value) => typeof value === "string" && value.trim(),
      ),
    ),
  ].flatMap((id) => journalAt(root, digest(id)) ?? []);

/**
 * The harness session journal of the process running the route, when one is
 * observable: the role its dispatch resolved and the order it recorded. No
 * journal means no harness session was observed, never that none exists.
 */
export function recordingSession(root, env = process.env) {
  return (
    sessionJournals(root, env).find(({ role }) => role !== "unobserved") ?? {
      role: "unobserved",
    }
  );
}

// A live owner, or one this user cannot signal, still holds its reservation.
const processAlive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
};

/**
 * Why this process is the order's executor, or null. Any observed session
 * variable naming an executor journal for this order counts, and so does a
 * live writer reservation held by one: the reservation is keyed by the hook's
 * own session id, which the command's environment cannot rename. A journal
 * with no recorded order (a session opened by `resume: status`) is not an
 * executor of this order.
 */
export function executorOf(root, workOrderId, env = process.env) {
  const own = (journal) =>
    journal?.role === "executor" && journal.workOrder === workOrderId;
  if (sessionJournals(root, env).some(own))
    return `this session is ${workOrderId}'s executor`;
  const directory = join(harnessDirectory(root), "writer");
  if (!existsSync(directory)) return null;
  for (const name of readdirSync(directory)) {
    if (!/^reservation-[0-9a-f]{32}\.json$/u.test(name)) continue;
    try {
      const reservation = JSON.parse(
        readFileSync(join(directory, name), "utf8"),
      );
      if (
        own(journalAt(root, reservation.actorId)) &&
        (!Number.isSafeInteger(reservation.owner?.pid) ||
          processAlive(reservation.owner.pid))
      )
        return `${workOrderId}'s executor holds this worktree's writer reservation`;
    } catch {
      // An unreadable reservation is judged by the writer guard, not here.
    }
  }
  return null;
}

/**
 * Whether the capture file came into being after the recording session began
 * (WO-158 receipt 028 known issue, criterion 2). An observation of timing, not
 * of authorship: the operator may also write a file during the session.
 */
export function captureTiming(root, capture, session) {
  const started = Date.parse(session.startedAt ?? "");
  let born;
  try {
    born = statSync(join(root, capture)).birthtimeMs;
  } catch {
    return "unobserved";
  }
  if (!Number.isFinite(started) || !born) return "unobserved";
  return born >= started ? "created-during-session" : "created-before-session";
}

// A report judges a criterion on one line, outside code fences:
// `**Criterion <id>:** met`, `unmet`, or `unmet, waived by <ordinal>`, as a
// paragraph, a bullet or numbered item, or a quotation.
const criterionLine =
  /^\s*(?:>\s*)*(?:(?:[-*+]|\d{1,9}[.)])\s+)?\*\*Criterion ([A-Za-z0-9][A-Za-z0-9._-]{0,63}):\*\*\s*([Mm]et|[Uu]nmet)\b(?:,\s*waived by (\d+)\b)?/u;
export const criterionLineForms =
  "`**Criterion <id>:** met`, `**Criterion <id>:** unmet` or `**Criterion <id>:** unmet, waived by <ordinal>`";

export const criterionJudgments = (report) => {
  // CommonMark fences: a fence closes only on its own character, at least as
  // long, with nothing after it.
  let fence;
  return report.split(/\r?\n/).flatMap((line) => {
    const marker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
    if (
      marker &&
      !fence &&
      !(marker[1][0] === "`" && marker[2].includes("`"))
    ) {
      fence = marker[1];
      return [];
    }
    if (
      marker &&
      fence &&
      marker[1][0] === fence[0] &&
      marker[1].length >= fence.length &&
      !marker[2].trim()
    ) {
      fence = undefined;
      return [];
    }
    const match = fence ? null : criterionLine.exec(line);
    return match
      ? [
          {
            criterionId: match[1],
            met: match[2].toLowerCase() === "met",
            waivedBy: match[3] === undefined ? undefined : Number(match[3]),
          },
        ]
      : [];
  });
};

/**
 * A waiver neither fails nor passes a criterion on its own: the judge decides
 * the verdict. What this refuses is a record that disagrees with the control
 * log — a pass over an unwaived unmet criterion, a waiver the log lacks, or an
 * unmet line that omits the waiver the log holds.
 */
export function judgeCriterionLines(report, state, verdict) {
  const waivers = new Map(
    (state.waivedCriteria ?? []).map((waiver) => [waiver.criterionId, waiver]),
  );
  const refusals = [];
  const judgments = criterionJudgments(report);
  const seen = new Map();
  for (const judgment of judgments) {
    const key = `${judgment.met}:${judgment.waivedBy ?? ""}`;
    const prior = seen.get(judgment.criterionId);
    if (prior !== undefined && prior !== key)
      refusals.push(
        `criterion ${judgment.criterionId} is judged on conflicting lines; one report judges a criterion once`,
      );
    seen.set(judgment.criterionId, prior ?? key);
  }
  for (const judgment of judgments) {
    const waiver = waivers.get(judgment.criterionId);
    if (judgment.waivedBy !== undefined) {
      if (judgment.met)
        refusals.push(
          `criterion ${judgment.criterionId} is recorded met and waived; a waiver applies only to an unmet criterion`,
        );
      else if (!waiver || waiver.ordinal !== judgment.waivedBy)
        refusals.push(
          `criterion ${judgment.criterionId} names waiver ordinal ${judgment.waivedBy}, but ${waiver ? `its CriterionWaived event is ordinal ${waiver.ordinal}` : `no CriterionWaived event for it exists in ${state.workOrderId}'s current activation`}`,
        );
      continue;
    }
    if (judgment.met) continue;
    if (waiver)
      refusals.push(
        `criterion ${judgment.criterionId} is waived by ordinal ${waiver.ordinal}; record it as \`**Criterion ${judgment.criterionId}:** unmet, waived by ${waiver.ordinal}\``,
      );
    else if (verdict === "pass")
      refusals.push(
        `a pass cannot record criterion ${judgment.criterionId} unmet without a waiver; record fail, or the operator records one with npm run resume -- waive ${judgment.criterionId}`,
      );
  }
  return refusals;
}

export function requireCriterionLines(root, reportPath, state, verdict) {
  const refusals = judgeCriterionLines(
    readFileSync(join(root, reportPath), "utf8"),
    state,
    verdict,
  );
  if (refusals.length)
    throw new Error(
      `${reportPath}: ${refusals.join("; ")} (criterion lines: ${criterionLineForms})`,
    );
}
