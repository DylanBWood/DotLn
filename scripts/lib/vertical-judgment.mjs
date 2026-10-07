import {
  existsSync,
  linkSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  validateIntakeResult,
  validateTriageResult,
  verticalJudgmentSubjectHash,
} from "../../packages/skeleton/dist/src/vertical-judgment-protocol.js";
import { runVerticalJudgment } from "../../packages/skeleton/dist/src/vertical-judgment-host.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
} from "../../packages/skeleton/dist/src/worker-transport.js";

/** The triage episode's whole input: the observed item, the admitted contract,
 * the sealed candidate's surfaces and diff, and its host-run tests. Evidence
 * references name only records the host holds; the episode may cite no other. */
export function triageSubject(state, active, candidate) {
  const { contract, criteria, derivation } = state.binding;
  const item = active.item;
  const head = active.observation.payload.headSha;
  const surfaces = new Set(derivation.surfaces.map((s) => s.path));
  const files = candidate.files
    .filter((file) => surfaces.has(file.path) || file.path === item.path)
    .map((file) => ({ path: file.path, contents: file.contents }));
  return {
    schemaVersion: "vertical-triage-v1",
    item: {
      id: item.id,
      class: item.class,
      path: item.path ?? null,
      line: item.line ?? null,
      text: item.text,
    },
    criteria: criteria.map((c) => ({
      criterionId: c.criterionId,
      description: c.description,
    })),
    statements: contract.statements
      .filter((s) => s.status === "active")
      .map((s) => ({ class: s.class, text: s.text })),
    candidate: { revision: head, diff: candidate.diff, files },
    evidence: [
      {
        ref: contract.contractId,
        detail: "The admitted StoryContract: its statements and criteria.",
      },
      ...files.map((file) => ({
        ref: `${head}:${file.path}`,
        detail: `Candidate ${file.path} at the observed head.`,
      })),
      ...candidate.evidence.map((e) => ({
        ref: e.evidenceId,
        detail: `Host-run \`${e.automatedTest}\` for ${e.criterionId} at the observed head: ${e.outcome} (${e.observed}; expected ${e.expected}).`,
      })),
    ],
  };
}

/** The configured live CLI for every vertical episode, admitted only with
 * DOTLN_LIVE_WORKERS=1; a test supplies its double instead. */
export function liveTransport(cfg) {
  if (process.env.DOTLN_LIVE_WORKERS !== "1")
    throw new Error("vertical live workers require DOTLN_LIVE_WORKERS=1");
  return cfg.workers.transport === "codex-cli-exec"
    ? new CodexCliExecWorkOrderTransport()
    : new ClaudeCliPrintWorkOrderTransport();
}

/** One judgment per subject. The record is named by the subject's hash and
 * written once, before its verdict is used, so recovery replays the same
 * verdict and a changed subject launches a fresh episode instead of reusing a
 * stale one. A rejected return is kept beside the records. `transport` may be
 * a factory, resolved only when an episode launches, so replay needs no live
 * worker (D047). */
export async function recordedJudgment({
  directory,
  name,
  task,
  subject,
  transport,
  model,
  effort,
  now,
}) {
  const subjectHash = verticalJudgmentSubjectHash(subject);
  const file = join(directory, `${name}-${subjectHash.slice(7, 23)}.json`);
  const identity = `ep_vertical_${task}_${subjectHash.slice(7, 23)}`;
  const replay = () => {
    const bytes = readFileSync(file, "utf8");
    let record;
    try {
      record = JSON.parse(bytes);
    } catch {
      // A parse error quotes the record's bytes; name the refusal instead.
      throw new Error(`${task} record does not bind this subject's episode`);
    }
    if (
      record.schemaVersion !== 1 ||
      verticalJudgmentSubjectHash(record.subject) !== subjectHash ||
      record.subjectHash !== subjectHash ||
      record.task !== task ||
      record.provenance?.subjectHash !== subjectHash ||
      record.provenance?.episodeId !== identity ||
      !["model", "double"].includes(record.provenance?.kind)
    )
      throw new Error(`${task} record does not bind this subject's episode`);
    (task === "intake" ? validateIntakeResult : validateTriageResult)(
      record.result,
      subject,
    );
    return record;
  };
  if (existsSync(file)) return replay();
  const judged = await runVerticalJudgment(
    {
      task,
      subject,
      transport: typeof transport === "function" ? transport() : transport,
      model,
      effort,
      retain: directory,
    },
    now,
  );
  const record = { schemaVersion: 1, task, subjectHash, subject, ...judged };
  // Complete bytes, then an exclusive link: a kill never leaves a torn record.
  const partial = `${file}.${process.pid}.partial`;
  try {
    mkdirSync(directory, { recursive: true });
    writeFileSync(partial, JSON.stringify(record, null, 2) + "\n", {
      flag: "wx",
    });
  } catch (error) {
    throw new JudgmentRecordError(task, error);
  }
  try {
    linkSync(partial, file);
  } catch (error) {
    // Another entry linked this subject's record first: every entry uses the
    // one durable verdict, as recovery would, and nothing is refused.
    if (existsSync(file)) return replay();
    throw new JudgmentRecordError(task, error);
  } finally {
    // Cleanup cannot replace the published/replayed verdict or mask the
    // primary publication error. A leftover partial is never replayed.
    try {
      unlinkSync(partial);
    } catch {}
  }
  return record;
}

/** The episode returned a verdict the host could not record. Retrying would
 * buy a further episode for the same unrecordable verdict (D047). */
export class JudgmentRecordError extends Error {
  constructor(task, error) {
    super(`${task} record could not be written`, { cause: error });
    this.name = "JudgmentRecordError";
  }
}
