import { dispatchJournalDirectory } from "../../packages/skeleton/src/dispatch-journal.mjs";
import { sha256Hex as digest } from "./helpers.mjs";
// Off-ramps: the operator capture every operator act names, the recording
// session's observed role, and the report convention that judges a waived or
// defective criterion and a fail's basis (WO-158, WO-249). Shared by `resume`
// routes and their completion checks.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, posix } from "node:path";
import { docRelative, rootPattern } from "./config.mjs";
import { runGit } from "./git.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  BASIS_FORMS,
  blockingBasis,
  blockingBasisAdvisories,
  findingsBlockFormat,
  isFindingsMarker,
  readFindingsBlock,
} from "./review-findings.mjs";

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
/** The key the hooks file the running session's journal under: the SHA-256
 * of the first session variable the environment sets, or null when none is. */
export const sessionJournalKey = (env = process.env) => {
  const id = SESSION_VARIABLES.map((name) => env[name]).find(
    (value) => typeof value === "string" && value.trim(),
  );
  return id ? digest(id) : null;
};
/** The harness the running session's variable names, or unknown. */
export const sessionHarness = (env = process.env) =>
  env.CODEX_THREAD_ID
    ? "codex-cli"
    : env.COPILOT_AGENT_SESSION_ID
      ? "copilot-cli"
      : env.CLAUDE_CODE_SESSION_ID || env.CLAUDE_SESSION_ID
        ? "claude-code"
        : "unknown";
const harnessDirectory = dispatchJournalDirectory;
const journalAt = (root, key) => {
  const path = join(harnessDirectory(root), `${key}.json`);
  if (!/^[0-9a-f]{64}$/u.test(key) || !existsSync(path)) return undefined;
  try {
    const session = JSON.parse(readFileSync(path, "utf8"));
    const current = session.boundDispatch ?? session;
    const executedOrders = new Set(
      Array.isArray(session.executedOrders) ? session.executedOrders : [],
    );
    if (session.role === "executor" && typeof session.workOrder === "string")
      executedOrders.add(session.workOrder);
    if (current.role === "executor" && typeof current.workOrder === "string")
      executedOrders.add(current.workOrder);
    return {
      role: typeof current.role === "string" ? current.role : "unobserved",
      ...(typeof current.workOrder === "string"
        ? { workOrder: current.workOrder }
        : {}),
      ...(typeof session.startedAt === "string"
        ? { startedAt: session.startedAt }
        : {}),
      executedOrders: [...executedOrders],
    };
  } catch {
    return undefined;
  }
};
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
    (journal?.role === "executor" && journal.workOrder === workOrderId) ||
    journal?.executedOrders?.includes(workOrderId);
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
// `**Criterion <id>:** met`, `unmet`, `unmet, waived by <ordinal>` or
// `unmet, defective (<class>) by <ordinal>`, as a paragraph, a bullet or
// numbered item, or a quotation.
const criterionLine =
  /^\s*(?:>\s*)*(?:(?:[-*+]|\d{1,9}[.)])\s+)?\*\*Criterion (?<id>[A-Za-z0-9][A-Za-z0-9._-]{0,63}):\*\*\s*(?<judged>[Mm]et|[Uu]nmet)\b(?:,\s*(?:waived by (?<waived>\d+)\b|defective \((?<kind>[a-z][a-z-]*)\) by (?<defective>\d+)\b))?/u;
export const criterionLineForms =
  "`**Criterion <id>:** met`, `**Criterion <id>:** unmet`, `**Criterion <id>:** unmet, waived by <ordinal>` or `**Criterion <id>:** unmet, defective (<class>) by <ordinal>`";
// The header fields filed reports carry are never a judgment's evidence, even
// where one follows a criterion line in its paragraph: in bold, in any case,
// as a list item or a quotation, with the colon inside or outside the
// emphasis. A plain "Subject:" line and other prose after the judgment stay
// its evidence, which only the judge can vouch for.
const REPORT_FIELD =
  /^\s*(?:>\s*)*(?:(?:[-*+]|\d{1,9}[.)])\s+)?\*\*(?:Actor attestation|Actor|Process cost|Verdict|Subject)(?::\*\*|\*\*:)/iu;

/** The digest a defect record binds: the criterion's text as the order's
 * numbered list declares it, wrapped lines joined. An amended criterion no
 * longer hashes to the record. */
export const criterionTextHash = (text) => sha256Bytes(text);

export const criterionJudgments = (report) => {
  // CommonMark fences: a fence closes only on its own character, at least as
  // long, with nothing after it.
  let fence;
  const rows = report.split(/\r?\n/).map((line) => {
    const marker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
    if (
      marker &&
      !fence &&
      !(marker[1][0] === "`" && marker[2].includes("`"))
    ) {
      fence = marker[1];
      return { line, fenced: true, match: null };
    }
    if (
      marker &&
      fence &&
      marker[1][0] === fence[0] &&
      marker[1].length >= fence.length &&
      !marker[2].trim()
    ) {
      fence = undefined;
      return { line, fenced: true, match: null };
    }
    return {
      line,
      fenced: Boolean(fence),
      match: fence ? null : criterionLine.exec(line),
    };
  });
  return rows.flatMap((row, index) => {
    if (!row.match) return [];
    // The judgment's paragraph: its line and every line after it up to the
    // next judgment, unfenced heading or findings block, fenced lines left
    // out, so a receipt cited in a wrapped or following paragraph, or after a
    // fenced example that holds a heading, belongs to the judgment above it,
    // and the report's findings are never read as a judgment's evidence.
    const paragraph = [row.line];
    for (let next = index + 1; next < rows.length; next++) {
      const following = rows[next];
      if (
        following.match ||
        (!following.fenced &&
          (/^ {0,3}#{1,6}\s/u.test(following.line) ||
            isFindingsMarker(following.line)))
      )
        break;
      if (!following.fenced) paragraph.push(following.line);
    }
    while (paragraph.length > 1 && !paragraph.at(-1).trim()) paragraph.pop();
    // What the paragraph says beyond the judgment's own form and the report's
    // header fields: the evidence a defective line must carry.
    const rest = [
      row.line.slice(row.match.index + row.match[0].length),
      ...paragraph.slice(1).filter((line) => !REPORT_FIELD.test(line)),
    ].join("\n");
    const { id, judged, waived, kind, defective } = row.match.groups;
    return [
      {
        criterionId: id,
        met: judged.toLowerCase() === "met",
        waivedBy: waived === undefined ? undefined : Number(waived),
        defectiveBy: defective === undefined ? undefined : Number(defective),
        defectClass: kind,
        evidence: /[\p{L}\p{N}]/u.test(rest),
        line: row.line,
        paragraph: paragraph.join("\n"),
      },
    ];
  });
};

const ordinalNamed = (judgment) => judgment.waivedBy ?? judgment.defectiveBy;
const plainUnmet = (judgment) =>
  !judgment.met && ordinalNamed(judgment) === undefined;

/**
 * A waiver or a defect record neither fails nor passes a criterion on its
 * own: the judge decides the verdict. What this refuses is a report that
 * disagrees with the control log or with itself:
 * - a pass over an unmet criterion the log neither waives nor records
 *   defective, or that omits a standing defect record of a criterion the
 *   order still declares;
 * - a waiver or defect line the log lacks, one a retraction undid, one whose
 *   class differs from the record's, one whose criterion text no longer
 *   hashes to the record, or a defect line that, on every line judging that
 *   criterion, names no evidence;
 * - an unmet line that omits the waiver or defect record the log holds,
 *   except a fail's unmet line that a blocking finding's basis names, which
 *   disputes a defect record;
 * - a fail with no readable findings block, or with neither an unmet line nor
 *   a blocking finding: a fail names what it failed on.
 * `criteria` is the order's declared criteria ({id, text}), or null when they
 * cannot be read. `advisories` names blocking findings without a basis or a
 * reproduction, which record all the same; `failRefused` says whether a
 * refusal concerns the fail's basis.
 */
export function judgeReport(
  report,
  state,
  verdict,
  { criteria = null, evidenceRoot, exists } = {},
) {
  const waivers = new Map(
    (state.waivedCriteria ?? []).map((waiver) => [waiver.criterionId, waiver]),
  );
  const defects = new Map(
    (state.defectiveCriteria ?? []).map((record) => [
      record.criterionId,
      record,
    ]),
  );
  const retracted = new Map(
    (state.retractedOffRamps ?? []).map((row) => [row.subject.ordinal, row]),
  );
  const texts = criteria
    ? new Map(criteria.map((criterion) => [criterion.id, criterion.text]))
    : null;
  const block = readFindingsBlock(report);
  const blocking = block.readable
    ? block.entries.filter((entry) => entry.route === "blocking")
    : [];
  // A blocking finding whose basis names a criterion disputes its record.
  const disputed = new Set(
    blocking.map((entry) => blockingBasis(entry)?.criterion).filter(Boolean),
  );
  const refusals = [];
  let failRefused = false;
  const judgments = criterionJudgments(report);
  const seen = new Map();
  for (const judgment of judgments) {
    const key = `${judgment.met}:${judgment.waivedBy ?? ""}:${judgment.defectiveBy ?? ""}:${judgment.defectClass ?? ""}`;
    const prior = seen.get(judgment.criterionId);
    if (prior !== undefined && prior !== key)
      refusals.push(
        `criterion ${judgment.criterionId} is judged on conflicting lines; one report judges a criterion once`,
      );
    seen.set(judgment.criterionId, prior ?? key);
  }
  // A summary line and a detailed line may judge one criterion; the evidence
  // a defective line owes may stand on either.
  const evidenced = new Set(
    judgments
      .filter((judgment) => judgment.evidence)
      .map((judgment) => judgment.criterionId),
  );
  const retraction = (ordinal) =>
    retracted.has(ordinal)
      ? `ordinal ${ordinal} was retracted by ordinal ${retracted.get(ordinal).ordinal}`
      : undefined;
  for (const judgment of judgments) {
    const id = judgment.criterionId;
    const waiver = waivers.get(id);
    const defect = defects.get(id);
    if (judgment.waivedBy !== undefined) {
      if (judgment.met)
        refusals.push(
          `criterion ${id} is recorded met and waived; a waiver applies only to an unmet criterion`,
        );
      else if (retraction(judgment.waivedBy))
        refusals.push(
          `criterion ${id} names waiver ordinal ${judgment.waivedBy}, but ${retraction(judgment.waivedBy)}`,
        );
      else if (!waiver || waiver.ordinal !== judgment.waivedBy)
        refusals.push(
          `criterion ${id} names waiver ordinal ${judgment.waivedBy}, but ${waiver ? `its CriterionWaived event is ordinal ${waiver.ordinal}` : `no CriterionWaived event for it exists in ${state.workOrderId}'s current activation`}`,
        );
      continue;
    }
    if (judgment.defectiveBy !== undefined) {
      const named = `criterion ${id} names defect record ordinal ${judgment.defectiveBy}`;
      if (judgment.met)
        refusals.push(
          `criterion ${id} is recorded met and defective; a defect record applies only to an unmet criterion`,
        );
      else if (retraction(judgment.defectiveBy))
        refusals.push(`${named}, but ${retraction(judgment.defectiveBy)}`);
      else if (!defect || defect.ordinal !== judgment.defectiveBy)
        refusals.push(
          `${named}, but ${defect ? `its standing CriterionDefectRecorded event is ordinal ${defect.ordinal}` : `no CriterionDefectRecorded event for it stands in ${state.workOrderId}'s current activation`}`,
        );
      else if (defect.class !== judgment.defectClass)
        refusals.push(
          `${named} as ${judgment.defectClass}, but that record's class is ${defect.class}`,
        );
      else if (!texts?.has(id))
        refusals.push(
          `${named}, but ${state.workOrderId}'s current text of criterion ${id} cannot be read to compare with the record`,
        );
      else if (criterionTextHash(texts.get(id)) !== defect.criterionHash)
        refusals.push(
          `${named}, but criterion ${id}'s text no longer hashes to that record, so the criterion was amended after it; a fresh npm run resume -- defect ${id} records the amended text`,
        );
      else if (!evidenced.has(id))
        refusals.push(
          `${named} with an empty paragraph; the line or the paragraph under it states the judge's own evidence for the class`,
        );
      continue;
    }
    if (judgment.met) continue;
    if (waiver)
      refusals.push(
        `criterion ${id} is waived by ordinal ${waiver.ordinal}; record it as \`**Criterion ${id}:** unmet, waived by ${waiver.ordinal}\``,
      );
    else if (defect) {
      if (!(verdict === "fail" && disputed.has(id)))
        refusals.push(
          `criterion ${id} is recorded defective (${defect.class}) by ordinal ${defect.ordinal}; record it as \`**Criterion ${id}:** unmet, defective (${defect.class}) by ${defect.ordinal}\` with your evidence, or, finding it judgeable, fail with a blocking finding whose basis names criterion ${id}`,
        );
    } else if (verdict === "pass")
      refusals.push(
        `a pass cannot record criterion ${id} unmet without a waiver or a defect record; record fail, record it defective with npm run resume -- defect ${id} when its text puts it in one of the five classes, or record the operator's waiver with npm run resume -- waive ${id} only from the operator's words asking for it`,
      );
  }
  // A pass judges every standing record of a criterion the order still
  // declares; a criterion a planning pass struck is judged by no report.
  if (verdict === "pass")
    for (const defect of defects.values())
      if (
        (!texts || texts.has(defect.criterionId)) &&
        !judgments.some(
          (judgment) => judgment.criterionId === defect.criterionId,
        )
      )
        refusals.push(
          `criterion ${defect.criterionId} is recorded defective (${defect.class}) by ordinal ${defect.ordinal} and this pass does not judge it; carry \`**Criterion ${defect.criterionId}:** unmet, defective (${defect.class}) by ${defect.ordinal}\` with your own evidence for the class, or judge it met`,
        );
  if (verdict === "fail") {
    if (!block.readable) {
      failRefused = true;
      refusals.push(
        `a fail names its basis in the findings block, and ${block.cause}`,
      );
    } else if (!blocking.length && !judgments.some(plainUnmet)) {
      failRefused = true;
      refusals.push(
        "a fail names an unmet criterion or a blocking finding: every criterion line here is met, waived or defective, and the findings block lists no blocking entry",
      );
    }
  }
  const advisories = block.readable
    ? blockingBasisAdvisories(block.entries, {
        declared: criteria?.map((criterion) => criterion.id) ?? null,
        met: judgments
          .filter((judgment) => judgment.met)
          .map((judgment) => judgment.criterionId),
        evidenceRoot,
        exists,
      })
    : [];
  return { refusals, advisories, findings: block, failRefused };
}

/** The refusals alone, for a reader that only asks whether a report agrees. */
export const judgeCriterionLines = (report, state, verdict, context) =>
  judgeReport(report, state, verdict, context).refusals;

/**
 * Judge a recorded report against the log and the order's criteria; refuse
 * on disagreement, and return the advisories to print and record. A pass
 * whose findings block cannot be read advises, as before; a fail's cannot,
 * and its refusal states the block's form.
 */
export function requireCriterionLines(
  root,
  reportPath,
  state,
  verdict,
  { criteria = null } = {},
) {
  const evidenceRoot = docRelative(root, "evidence", state.workOrderId);
  const { refusals, advisories, findings, failRefused } = judgeReport(
    readFileSync(join(root, reportPath), "utf8"),
    state,
    verdict,
    {
      criteria,
      evidenceRoot,
      exists: (path) =>
        containedRegularFile(join(root, path), join(root, evidenceRoot)),
    },
  );
  if (refusals.length)
    throw new Error(
      `${reportPath}: ${refusals.join("; ")} (criterion lines: ${criterionLineForms}${failRefused ? `; a report lists its findings in one block: ${findingsBlockFormat}, a blocking entry also carrying ${BASIS_FORMS}` : ""})`,
    );
  return {
    advisories: advisories.map((line) => `${reportPath}: ${line}`),
    findings,
  };
}
