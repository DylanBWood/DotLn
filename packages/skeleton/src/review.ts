import type { Event, EventDraft, JsonValue } from "@dotln/kernel";
import type { ReviewWorkerResult } from "./verification-protocol.js";
import type { VerificationState } from "./verification.js";
import {
  canonicalStringify,
  compileVerificationTask,
  copyFinding,
  repositoryPath,
  verificationLine,
  type Evaluation,
  type ReviewFinding,
  type VerificationSubject,
  type VerificationTask,
} from "@dotln/compiler";
import {
  deriveRepairOrder,
  type RepairOriginal,
  type ReviewRepairWitness,
} from "./repair.js";

/** The capsule retains the prior verification contract; this is the current
 * episode's derived order, never an implementer-authored narrative. */
export const reviewWorkOrder = (capsule: VerificationTask) => ({
  ...capsule.workOrder,
  objective:
    "Independently review the sealed candidate's scope, maintainability and declared conventions.",
  nonGoals: [
    "Changing behavior acceptance",
    "Repository writes",
    "Automatically repairing should or nit findings",
  ],
  outputContract: { type: "review-result-v1" },
});

/** Host-selected context. No implementer prose or worker-authored test rows. */
export interface ReviewContext {
  readonly conventionsPath: string | null;
  readonly baseline: VerificationSubject;
  readonly rows: readonly {
    readonly episodeId: string;
    readonly evaluation: Evaluation;
  }[];
  readonly implementerEpisodes: readonly string[];
}
export interface ReviewCompleted {
  readonly subjectRevision: string;
  readonly baselineRevision: string;
  readonly inputHash: string;
  readonly reviewerEpisodeId: string;
  readonly verifierEpisodeIds: readonly string[];
  readonly implementerEpisodeIds: readonly string[];
  readonly conventionsPath: string | null;
  readonly counts: Readonly<Record<ReviewFinding["severity"], number>>;
  readonly findings: readonly ReviewFinding[];
  readonly requiresHuman: boolean;
}

const same = (a: unknown, b: unknown) =>
  canonicalStringify(a) === canonicalStringify(b);
const requireReview: (value: unknown, detail: string) => asserts value = (
  value,
  detail,
) => {
  if (!value) throw new Error(`review: ${detail}`);
};

export function validateReviewOpening(
  conventionsPath: string | null,
  baseline: VerificationSubject,
  subject: VerificationSubject,
  baselineKind?: "baseline" | "comparison",
): void {
  requireReview(
    baselineKind !== "baseline" &&
      subject.snapshot &&
      (conventionsPath === null ||
        (repositoryPath(conventionsPath) &&
          subject.files.some(
            (file) =>
              file.path === conventionsPath &&
              baseline.files.some(
                (base) =>
                  base.path === file.path && base.contents === file.contents,
              ),
          ))),
    "declared conventions must be an unchanged sealed file or absent",
  );
}

export function validateReviewContext(
  review: ReviewContext,
  capsule: VerificationTask,
): void {
  const subject = capsule.subject;
  requireReview(
    subject.snapshot && capsule.role === "verifier",
    "sealed candidate required",
  );
  const baseline = compileVerificationTask(
    "review_base",
    capsule.criteria,
    review.baseline,
  ).subject;
  requireReview(
    same(review, {
      conventionsPath: review.conventionsPath,
      baseline,
      rows: review.rows.map((row) => ({
        episodeId: row.episodeId,
        evaluation: {
          criterionId: row.evaluation.criterionId,
          claimType: row.evaluation.claimType,
          verdict: row.evaluation.verdict,
          evidenceRefs: row.evaluation.evidenceRefs,
          exemplarRefs: row.evaluation.exemplarRefs,
          dissentRefs: row.evaluation.dissentRefs,
        },
      })),
      implementerEpisodes: review.implementerEpisodes,
    }),
    "context shape",
  );
  requireReview(
    baseline.snapshot &&
      baseline.repo === subject.repo &&
      baseline.revision === subject.baseCommit &&
      same(baseline.snapshot.contract, subject.snapshot.contract) &&
      same(baseline.snapshot.tests, subject.snapshot.tests),
    "baseline identity",
  );
  requireReview(
    review.conventionsPath === null ||
      (repositoryPath(review.conventionsPath) &&
        subject.files.some((file) => file.path === review.conventionsPath) &&
        baseline.files.some(
          (file) =>
            file.path === review.conventionsPath &&
            file.contents ===
              subject.files.find((candidate) => candidate.path === file.path)
                ?.contents,
        )),
    "declared conventions must be an unchanged sealed file or absent",
  );
  requireReview(
    Array.isArray(review.implementerEpisodes) &&
      review.implementerEpisodes.length > 0 &&
      review.implementerEpisodes.length <= 100 &&
      review.implementerEpisodes.every(verificationLine) &&
      new Set(review.implementerEpisodes).size ===
        review.implementerEpisodes.length &&
      review.rows.length === capsule.criteria.length,
    "episode identities or row coverage",
  );
  for (const criterion of capsule.criteria) {
    const rows = review.rows.filter(
      (row) => row.evaluation.criterionId === criterion.criterionId,
    );
    requireReview(rows.length === 1, "criterion coverage");
    const { episodeId, evaluation } = rows[0]!;
    requireReview(
      verificationLine(episodeId) &&
        !review.implementerEpisodes.includes(episodeId),
      "independent verifier identity",
    );
    requireReview(
      evaluation.verdict === "pass" &&
        evaluation.claimType === criterion.claimType &&
        evaluation.exemplarRefs.length === 0 &&
        evaluation.dissentRefs.length === 0 &&
        evaluation.evidenceRefs.length > 0 &&
        evaluation.evidenceRefs.length <= 100 &&
        new Set(evaluation.evidenceRefs).size ===
          evaluation.evidenceRefs.length,
      "passing behavior required",
    );
    const evidence = evaluation.evidenceRefs.map((id) =>
      subject.evidence.find((row) => row.evidenceId === id),
    );
    requireReview(
      evidence.every(
        (row) =>
          row &&
          row.outcome === "pass" &&
          row.criterionId === criterion.criterionId &&
          row.claimType === criterion.claimType &&
          row.source === criterion.evidenceSource,
      ) &&
        criterion.requiredChecks.every((check) =>
          evidence.some((row) => row?.checkId === check),
        ) &&
        !subject.evidence.some(
          (row) =>
            row.criterionId === criterion.criterionId &&
            criterion.requiredChecks.includes(row.checkId) &&
            row.outcome !== "pass",
        ),
      "passing host witnesses required",
    );
  }
}

export function createReviewContext(
  state: VerificationState,
  capsule: VerificationTask,
): ReviewContext {
  const review: ReviewContext = {
    conventionsPath: state.reviewConventionsPath!,
    baseline: state.baseline!,
    rows: state.rows.map((row) => {
      const last = row.evaluations.at(-1)!;
      requireReview(
        row.status === "verified" &&
          !last.stale &&
          last.subjectRevision === state.subject!.revision,
        "current passing behavior before review",
      );
      const {
        criterionId,
        claimType,
        verdict,
        evidenceRefs,
        exemplarRefs,
        dissentRefs,
      } = last;
      return {
        episodeId: last.episodeId,
        evaluation: {
          criterionId,
          claimType,
          verdict,
          evidenceRefs,
          exemplarRefs,
          dissentRefs,
        },
      };
    }),
    implementerEpisodes: state.implementerEpisodes,
  };
  validateReviewContext(review, capsule);
  return review;
}

export function reviewReferences(
  capsule: VerificationTask,
  review: ReviewContext,
): string[] {
  return [
    "contract",
    "diff",
    ...(review.conventionsPath === null
      ? []
      : [`conventions:${review.conventionsPath}`]),
    ...new Set(
      [...review.baseline.files, ...capsule.subject.files].map(
        (file) => `file:${file.path}`,
      ),
    ),
  ];
}

/** Expected is the rule the implementation must hold; it is a review judgment,
 * not a fabricated failed behavior witness. */
export function copyReviewFindings(
  value: unknown,
  capsule: VerificationTask,
  review: ReviewContext,
): readonly ReviewFinding[] {
  requireReview(Array.isArray(value) && value.length <= 100, "findings shape");
  const refs = reviewReferences(capsule, review);
  const seen = new Set<string>();
  return value.map((item) => {
    const finding = copyFinding(item);
    requireReview(
      finding.class === "review" &&
        same(item, finding) &&
        !seen.has(finding.findingId),
      "finding shape or duplicate",
    );
    requireReview(
      capsule.criteria.some(
        (criterion) => criterion.criterionId === finding.criterionId,
      ) &&
        finding.evidenceRefs.every((ref) => refs.includes(ref)) &&
        finding.evidenceRefs.some(
          (ref) => ref === "contract" || ref.startsWith("conventions:"),
        ) &&
        finding.evidenceRefs.some(
          (ref) => ref === "diff" || ref.startsWith("file:"),
        ) &&
        finding.likelySurface.every((path) => refs.includes(`file:${path}`)),
      "finding criterion, rule source or surface",
    );
    seen.add(finding.findingId);
    return finding;
  });
}

export function createReviewCompleted(
  capsule: VerificationTask,
  review: ReviewContext,
  episodeId: string,
  findings: readonly ReviewFinding[],
  requiresHuman: boolean,
): ReviewCompleted {
  validateReviewContext(review, capsule);
  requireReview(
    verificationLine(episodeId) &&
      !review.implementerEpisodes.includes(episodeId) &&
      !review.rows.some((row) => row.episodeId === episodeId),
    "independent reviewer identity",
  );
  requireReview(typeof requiresHuman === "boolean", "human attention flag");
  const copied = copyReviewFindings(findings, capsule, review);
  return {
    subjectRevision: capsule.subject.revision,
    baselineRevision: review.baseline.revision,
    inputHash: capsule.inputHash,
    reviewerEpisodeId: episodeId,
    verifierEpisodeIds: [...new Set(review.rows.map((row) => row.episodeId))],
    implementerEpisodeIds: [...review.implementerEpisodes],
    conventionsPath: review.conventionsPath,
    counts: {
      blocking: copied.filter((finding) => finding.severity === "blocking")
        .length,
      should: copied.filter((finding) => finding.severity === "should").length,
      nit: copied.filter((finding) => finding.severity === "nit").length,
    },
    findings: copied,
    requiresHuman,
  };
}

export function reviewCompletedEvent(
  capsule: VerificationTask,
  review: ReviewContext,
  result: ReviewWorkerResult,
  admitted: Event,
  commandId: string,
): EventDraft {
  return {
    schemaVersion: 1,
    type: "ReviewCompleted",
    actorId: admitted.actorId,
    workstreamId: admitted.workstreamId,
    occurredAt: 0,
    correlationId: commandId,
    causationId: admitted.eventId,
    payload: createReviewCompleted(
      capsule,
      review,
      result.envelope.episodeId,
      result.findings,
      result.envelope.requiresHuman,
    ) as unknown as JsonValue,
  };
}

/** WO-123's composition consumes the host's completed review; WO-182 consumes
 * knownItems. Only blocking findings can construct a RepairHost input. */
export function routeReview(
  review: ReviewCompleted,
  original: RepairOriginal,
  subject: VerificationSubject,
) {
  requireReview(
    review.subjectRevision === subject.revision,
    "stale review route",
  );
  const knownItems = review.findings.filter(
    (finding) => finding.severity !== "blocking",
  );
  const blocking = review.findings.filter(
    (finding) => finding.severity === "blocking",
  );
  const repairs = review.requiresHuman
    ? []
    : blocking.map((finding) => {
        const witness: ReviewRepairWitness = {
          class: "independent-review",
          evidenceId: `review:${review.reviewerEpisodeId}:${finding.findingId}`,
          subjectRevision: review.subjectRevision,
          criterionId: finding.criterionId,
          itemId: finding.findingId,
          testCommand:
            original.tests.find(
              (test) => test.criterionId === finding.criterionId,
            )?.command ?? "",
          observed: finding.observed,
          expected: finding.expected,
          reviewFinding: finding,
        };
        const bounded = { ...original, roundLimit: 1 };
        return {
          original: bounded,
          reviewItem: { witness, finding },
          derivation: deriveRepairOrder(finding, {
            ...bounded,
            subject,
            round: 0,
            reviewItem: witness,
          }),
        };
      });
  return {
    kind:
      review.requiresHuman ||
      repairs.some((repair) => repair.derivation.kind === "NeedsHuman")
        ? ("NeedsHuman" as const)
        : blocking.length
          ? ("RepairAndReverify" as const)
          : ("DeliverableKnownItems" as const),
    knownItems,
    repairs,
  };
}
