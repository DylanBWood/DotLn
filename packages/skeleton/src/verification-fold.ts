import {
  affectedVerificationCriteria,
  canonicalStringify,
  changedVerificationSurfaces,
  compileVerificationTask,
  copyCriterion,
  copySubject,
  type AcceptanceCriterion,
  type VerificationSubject,
  type VerificationTask,
} from "@dotln/compiler";
import type { AuthorityEnvelope, Command, Event } from "@dotln/kernel";
import type {
  AcceptanceEvidenceRow,
  FindingRecord,
  VerificationPending,
  VerificationState,
} from "./verification.js";
import { validateReviewOpening } from "./review.js";
import {
  validateBaselineContext,
  type BaselineContext,
  type BaselineWitness,
  type EvidenceWorkerResult,
  type VerificationWorkerResult,
} from "./verification-protocol.js";

const same = (a: unknown, b: unknown): boolean =>
  canonicalStringify(a) === canonicalStringify(b);
const requireState = (value: unknown, detail: string): void => {
  if (!value) throw new Error(`verification state: ${detail}`);
};

export type VerificationPayload = {
  reviewNotice?: true;
  reviewConventionsPath?: string | null;
  baselineContext?: BaselineContext;
  criteria: readonly AcceptanceCriterion[];
  baseline: VerificationSubject;
  subject: VerificationSubject;
  implementerEpisodeId: string;
  /** Optional cumulative source-worker lineage, supplied by the host. */
  implementerEpisodeIds?: readonly string[];
  episodeNamespace?: string;
  maxRepairs: number;
  authority: AuthorityEnvelope;
  command: Command;
  commandId: string;
  workerEpisodeId: string;
  role: VerificationTask["role"];
  inputHash: string;
  leaseExpiresAt: number;
  mode: string;
  verificationResultVersion: number;
  result: string;
  value: EvidenceWorkerResult;
};

export function foldVerificationOpening(
  state: VerificationState,
  event: Event,
  value: VerificationPayload,
): VerificationState {
  if (event.type !== "VerificationOpened") return state;
  requireState(
    value.reviewNotice === undefined ||
      (value.reviewNotice === true &&
        value.reviewConventionsPath !== undefined),
    "review notice requires a review-enabled stream",
  );
  const implementers = value.implementerEpisodeIds;
  requireState(
    implementers === undefined ||
      (Array.isArray(implementers) &&
        implementers.length > 0 &&
        implementers.length <= 100 &&
        implementers.every(
          (id) => typeof id === "string" && /^[a-zA-Z0-9_-]+$/u.test(id),
        ) &&
        new Set(implementers).size === implementers.length &&
        implementers.includes(value.implementerEpisodeId)),
    "implementer lineage",
  );
  const original = foldOriginalVerificationOpening(state, event, value);
  const opened = implementers
    ? {
        ...original,
        implementerEpisodes: [...implementers],
        episodeIds: [...implementers],
      }
    : original;
  return value.reviewNotice
    ? { ...opened, reviewNotice: value.reviewNotice }
    : opened;
}

/** The original decider-free opening branch, including its validation. */
function foldOriginalVerificationOpening(
  state: VerificationState,
  event: Event,
  value: VerificationPayload,
): VerificationState {
  switch (event.type) {
    case "VerificationOpened": {
      requireState(state.next === "unopened", "workstream already opened");
      const criteria = (value.criteria as AcceptanceCriterion[]).map(
        copyCriterion,
      );
      const baseline = copySubject(value.baseline as VerificationSubject);
      const subject = copySubject(value.subject as VerificationSubject);
      const capsule = compileVerificationTask("opening", criteria, subject);
      if (value.reviewConventionsPath !== undefined)
        validateReviewOpening(
          value.reviewConventionsPath,
          baseline,
          subject,
          value.baselineContext?.kind,
        );
      if (value.baselineContext) {
        validateBaselineContext(value.baselineContext, capsule);
        const expected =
          value.baselineContext.kind === "baseline"
            ? subject
            : value.baselineContext.witness.capsule.subject;
        requireState(same(baseline, expected), "baseline episode identity");
      }
      requireState(
        baseline.repo === subject.repo &&
          baseline.baseCommit === subject.baseCommit &&
          baseline.revision === subject.baseCommit,
        "baseline identity",
      );
      requireState(
        typeof value.implementerEpisodeId === "string" &&
          value.implementerEpisodeId.length > 0 &&
          Number.isSafeInteger(value.maxRepairs) &&
          value.maxRepairs >= 0 &&
          value.maxRepairs <= 10,
        "opening policy",
      );
      requireState(
        baseline.evidence.length > 0 &&
          criteria.every((criterion) =>
            baseline.evidence.some(
              (item) => item.criterionId === criterion.criterionId,
            ),
          ),
        "baseline witness coverage",
      );
      requireState(
        value.episodeNamespace === undefined ||
          /^[a-zA-Z0-9_-]+$/u.test(value.episodeNamespace),
        "episode namespace",
      );
      return {
        ...state,
        ...(value.reviewConventionsPath !== undefined
          ? { reviewConventionsPath: value.reviewConventionsPath }
          : {}),
        ...(value.baselineContext
          ? {
              baselineContext: JSON.parse(
                JSON.stringify(value.baselineContext),
              ) as BaselineContext,
              ...(value.baselineContext.kind === "comparison"
                ? {
                    baselineWitness: JSON.parse(
                      JSON.stringify(value.baselineContext.witness),
                    ) as BaselineWitness,
                  }
                : {}),
            }
          : {}),
        ...(value.episodeNamespace
          ? { episodeNamespace: value.episodeNamespace }
          : {}),
        criteria,
        baseline,
        subject,
        authority: value.authority as AuthorityEnvelope,
        maxRepairs: value.maxRepairs,
        implementerEpisodes: [value.implementerEpisodeId],
        episodeIds: [value.implementerEpisodeId],
        rows: criteria.map((criterion) => ({
          criterion,
          status: "incomplete",
          evaluations: [],
        })),
        evidence: subject.evidence,
        next: "verify",
      };
    }
    default:
      return state;
  }
}

/** Evaluations and findings are folded only after the reactor admits the result. */
export function foldVerificationEvaluation(
  state: VerificationState,
  event: Event,
  pending: VerificationPending,
  result: VerificationWorkerResult,
  common: VerificationState,
): VerificationState {
  switch (event.type) {
    case "CommandResult": {
      const rows = state.rows.map((row): AcceptanceEvidenceRow => {
        const evaluation = result.evaluations.find(
          (item) => item.criterionId === row.criterion.criterionId,
        );
        return evaluation
          ? {
              criterion: row.criterion,
              status:
                evaluation.verdict === "pass"
                  ? "verified"
                  : evaluation.verdict === "fail"
                    ? "failed"
                    : "incomplete",
              evaluations: [
                ...row.evaluations,
                {
                  ...evaluation,
                  provenance: {
                    kind: "host-admitted-verifier",
                    commandId: pending.command.commandId,
                    inputHash: pending.capsule.inputHash,
                  },
                  eventId: event.eventId,
                  episodeId: result.envelope.episodeId,
                  subjectRevision: result.subjectRevision,
                  stale: false,
                },
              ],
            }
          : row;
      });
      const findingRecords: FindingRecord[] = result.findings.map(
        (finding) => ({
          finding,
          eventId: event.eventId,
          episodeId: result.envelope.episodeId,
          subjectRevision: result.subjectRevision,
          status: "open",
        }),
      );
      // A subsequent conclusive verifier assessment supersedes findings for its criteria.
      const assessed = result.evaluations
        .filter((item) => item.verdict !== "unverified")
        .map((item) => item.criterionId);
      const findings = [
        ...state.findings.map((record): FindingRecord =>
          assessed.includes(record.finding.criterionId)
            ? {
                ...record,
                status:
                  result.evaluations.find(
                    (item) => item.criterionId === record.finding.criterionId,
                  )?.verdict === "pass"
                    ? "resolved"
                    : "superseded",
              }
            : record,
        ),
        ...findingRecords,
      ];
      const repairPlans = result.findings
        .filter((finding) => finding.severity === "blocking")
        .map((finding) => ({
          findingId: finding.findingId,
          capsule: compileVerificationTask(
            `repair_${state.dispatchCount}_${finding.findingId}`,
            state.criteria.filter(
              (criterion) => criterion.criterionId === finding.criterionId,
            ),
            state.subject!,
            finding,
          ),
        }));
      return {
        ...common,
        ...(result.baselineFindings
          ? { baselineFindings: result.baselineFindings }
          : {}),
        rows,
        findings,
        repairPlans: [...state.repairPlans, ...repairPlans],
        next: result.envelope.requiresHuman
          ? "attention"
          : rows.every((row) => row.status === "verified")
            ? state.reviewConventionsPath !== undefined
              ? "review"
              : "complete"
            : repairPlans.length > 0 && state.repairCount < state.maxRepairs
              ? "repair"
              : "attention",
      };
    }
    default:
      return state;
  }
}

export function foldVerificationRepair(
  state: VerificationState,
  event: Event,
  value: VerificationPayload,
): VerificationState {
  if (event.type !== "VerificationSubjectSubmitted") return state;
  // Proposals replace contents, not the host-owned file metadata. Complete
  // their file records before the original fold checks exact subject equality.
  const prepared =
    state.proposal && state.subject
      ? {
          ...state,
          proposal: {
            ...state.proposal,
            replacements: state.proposal.replacements.map((replacement) => ({
              ...state.subject!.files.find(
                (file) => file.path === replacement.path,
              ),
              ...replacement,
            })),
          },
        }
      : state;
  const repaired = foldOriginalVerificationRepair(prepared, event, value);
  if (state.reviewConventionsPath === undefined) return repaired;
  // Review needs every final evaluation at the repaired revision, including
  // criteria whose own surfaces did not change.
  return {
    ...repaired,
    rows: repaired.rows.map((row) => ({
      ...row,
      status: row.evaluations.length > 0 ? "stale" : "incomplete",
      evaluations: row.evaluations.map((evaluation) => ({
        ...evaluation,
        stale: true,
      })),
    })),
    staleness: [
      ...repaired.staleness.slice(0, -1),
      {
        ...repaired.staleness.at(-1)!,
        criterionIds: state.criteria.map((criterion) => criterion.criterionId),
      },
    ],
  };
}

/** The original decider-free repair-application branch. */
function foldOriginalVerificationRepair(
  state: VerificationState,
  event: Event,
  value: VerificationPayload,
): VerificationState {
  switch (event.type) {
    case "VerificationSubjectSubmitted": {
      requireState(
        state.next === "apply-repair" &&
          state.proposal &&
          state.subject &&
          state.continuation.kind === "Done",
        "repair application phase",
      );
      const subject = copySubject(value.subject as VerificationSubject);
      requireState(
        subject.repo === state.subject!.repo &&
          subject.baseCommit === state.subject!.baseCommit &&
          subject.revision !== state.subject!.revision,
        "repair revision identity",
      );
      const expected = state.subject!.files.map(
        (file) =>
          state.proposal!.replacements.find(
            (replacement) => replacement.path === file.path,
          ) ?? file,
      );
      requireState(
        same(subject.files, expected),
        "applied repair differs from proposal",
      );
      compileVerificationTask("repaired", state.criteria, subject);
      const changedSurfaces = changedVerificationSurfaces(
        state.subject!,
        subject,
      );
      requireState(changedSurfaces.length > 0, "repair must change source");
      const affected = affectedVerificationCriteria(
        state.criteria,
        changedSurfaces,
      );
      const rows = state.rows.map((row): AcceptanceEvidenceRow =>
        affected.includes(row.criterion.criterionId)
          ? {
              ...row,
              status: row.evaluations.length > 0 ? "stale" : "incomplete",
              evaluations: row.evaluations.map((evaluation) => ({
                ...evaluation,
                stale: true,
              })),
            }
          : row,
      );
      return {
        ...state,
        subject,
        rows,
        next: "verify",
        proposal: null,
        repairCount: state.repairCount + 1,
        implementerEpisodes: [
          ...state.implementerEpisodes,
          state.proposal!.envelope.episodeId,
        ],
        evidence: [...state.evidence, ...subject.evidence],
        staleness: [
          ...state.staleness,
          { eventId: event.eventId, changedSurfaces, criterionIds: affected },
        ],
      };
    }
    default:
      return state;
  }
}
