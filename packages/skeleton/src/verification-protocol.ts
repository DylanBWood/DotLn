import {
  assertVerificationTask,
  assertCompiledFeedback,
  type CompiledFeedback,
  canonicalStringify,
  copyFinding,
  verificationLine,
  type Evaluation,
  type RepositoryFile,
  type VerificationFinding,
  type VerificationTask,
} from "@dotln/compiler";
import type { Command, ResultEnvelope, WorkOrder } from "@dotln/kernel";
import {
  planPrompt,
  planResultSchema,
  validatePlanRequest,
  validatePlanResult,
  type PlanRefutationRequest,
  type PlanRefutationResult,
} from "./plan-refutation-protocol.js";
import {
  validateReviewerOutput,
  type ReviewerOutput,
} from "./loadouts/entropy-reducer.js";
import {
  entropyRefutationPrompt,
  entropyRefutationResultSchema,
  entropyReviewPrompt,
  entropyReviewResultSchema,
  isEntropyRefutationRequest,
  isEntropyReviewRequest,
  validateEntropyRefutationRequest,
  validateEntropyRefutationResult,
  validateEntropyReviewRequest,
  type EntropyRefutationRequest,
  type EntropyRefutationResult,
  type EntropyReviewRequest,
} from "./entropy-review-protocol.js";
import {
  isMissionCheckRequest,
  missionCheckPrompt,
  missionCheckResultSchema,
  validateMissionCheckRequest,
  validateMissionCheckResult,
  type MissionCheckObserved,
  type MissionCheckRequest,
} from "./mission-check-protocol.js";
import {
  isWriterRequest,
  parseStoredWriterResult,
  validateWriterRequest,
  writerPrompt,
  writerResultSchema,
  type WriterRequest,
  type WriterResult,
  parseWorkerResult,
  resultId,
  validateRequest,
  WorkerFailure,
  workerPrompt,
  workerResultSchema,
  type WorkerEffort,
  type WorkerRequest,
  type WorkerResult,
} from "./worker-protocol.js";

/** Fixed bound for the source-heavy feedback audit; other profiles keep WO-009 limits. */
export const FEEDBACK_VERIFIER_LIMITS = {
  timeoutMs: 600_000,
  maxBudgetUsd: "5.00",
} as const;

export interface EvidenceWorkerRequest {
  readonly feedback?: CompiledFeedback;
  readonly kind: "evidence-worker";
  readonly command: Command;
  readonly workOrder: WorkOrder;
  readonly capsule: VerificationTask;
  readonly episodeId: string;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly cwd: string;
  readonly profile: {
    readonly profileId: "verification-snapshot-v1" | "worktree-snapshot";
    readonly mounts: readonly {
      readonly path: string;
      readonly access: "read";
    }[];
  };
}
export interface VerificationWorkerResult {
  readonly kind: "verification";
  readonly envelope: ResultEnvelope;
  readonly subjectRevision: string;
  readonly evaluations: readonly Evaluation[];
  readonly findings: readonly VerificationFinding[];
}
export interface RepairWorkerResult {
  readonly kind: "repair";
  readonly envelope: ResultEnvelope;
  readonly subjectRevision: string;
  readonly replacements: readonly RepositoryFile[];
}
export type EvidenceWorkerResult =
  VerificationWorkerResult | RepairWorkerResult;
export type TransportRequest =
  | WorkerRequest
  | WriterRequest
  | EvidenceWorkerRequest
  | PlanRefutationRequest
  | MissionCheckRequest
  | EntropyReviewRequest
  | EntropyRefutationRequest;
export type TransportResult =
  | WorkerResult
  | WriterResult
  | EvidenceWorkerResult
  | PlanRefutationResult
  | MissionCheckObserved
  | ReviewerOutput
  | EntropyRefutationResult;
export type TransportResultFor<R extends TransportRequest> =
  R extends EntropyReviewRequest
    ? ReviewerOutput
    : R extends EntropyRefutationRequest
      ? EntropyRefutationResult
      : R extends MissionCheckRequest
        ? MissionCheckObserved
        : R extends PlanRefutationRequest
          ? PlanRefutationResult
          : R extends EvidenceWorkerRequest
            ? EvidenceWorkerResult
            : R extends WriterRequest
              ? WriterResult
              : WorkerResult;

export const isPlanRequest = (
  request: TransportRequest,
): request is PlanRefutationRequest =>
  "kind" in request && request.kind === "plan-refutation";

export const isEvidenceRequest = (
  request: TransportRequest,
): request is EvidenceWorkerRequest =>
  "kind" in request && request.kind === "evidence-worker";
const object = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
const exact = (
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean =>
  Object.keys(value).sort().join(",") === [...expected].sort().join(",");
/** Every contract reason an evidence result can be refused for. The list is
 * closed: `check` accepts nothing else, so a new reason is added here first. */
export const EVIDENCE_RESULT_REFUSALS = [
  "episode result shape",
  "episode envelope.summary must be a string of at most 320 characters",
  "episode envelope",
  "episode role or subject",
  "repair replacements",
  "repair outside focused surface",
  "repair has no substantive change",
  "criterion coverage",
  "evaluation shape",
  "evaluation criterion",
  "claim-typed evidence",
  "unsupported pass",
  "contradictory witness",
  "unsupported failure",
  "finding shape",
  "finding shape or duplicate",
  "finding criterion or evidence",
  "finding observed versus expected",
  "failed criterion lacks finding",
] as const;
export type EvidenceResultRefusal = (typeof EVIDENCE_RESULT_REFUSALS)[number];
/** What an `invalid-result` refusal may record and print (WO-157 item 8,
 * WO-152 D009): the contract reasons, the transport's parse phases, the
 * host's receipt check and `unclassified`. Raw model output is never among
 * them. */
export const INVALID_RESULT_DETAILS = [
  ...EVIDENCE_RESULT_REFUSALS,
  "wire-json",
  "final-message-absent",
  "final-message-json",
  "receipt-command",
  "unclassified",
] as const;
export type InvalidResultDetail = (typeof INVALID_RESULT_DETAILS)[number];
/** A detail outside the vocabulary is refused verbatim and recorded as
 * `unclassified`, so the refusal itself is never lost. */
export const invalidResultDetail = (
  detail: string | undefined,
): InvalidResultDetail =>
  (INVALID_RESULT_DETAILS as readonly string[]).includes(detail ?? "")
    ? (detail as InvalidResultDetail)
    : "unclassified";
const check: (
  valid: unknown,
  reason: EvidenceResultRefusal,
) => asserts valid = (valid, reason) => {
  if (!valid) throw new WorkerFailure("invalid-result", reason);
};
const refs = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length <= 100 &&
  value.every(verificationLine) &&
  new Set(value).size === value.length;

export function parseEvidenceResult(
  value: unknown,
  request: Pick<
    EvidenceWorkerRequest,
    "command" | "workOrder" | "capsule" | "episodeId"
  >,
): EvidenceWorkerResult {
  const root = object(value);
  const envelope = object(root?.envelope);
  const verifying = request.capsule.role === "verifier";
  check(
    root &&
      envelope &&
      exact(
        root,
        verifying
          ? ["kind", "envelope", "subjectRevision", "evaluations", "findings"]
          : ["kind", "envelope", "subjectRevision", "replacements"],
      ),
    "episode result shape",
  );
  check(
    typeof envelope.summary === "string" && envelope.summary.length <= 320,
    "episode envelope.summary must be a string of at most 320 characters",
  );
  check(
    exact(envelope, [
      "workOrderId",
      "episodeId",
      "status",
      "resultId",
      "summary",
      "requiresHuman",
    ]) &&
      envelope.workOrderId === request.workOrder.workOrderId &&
      envelope.episodeId === request.episodeId &&
      envelope.resultId === resultId(request.command) &&
      verificationLine(envelope.summary) &&
      envelope.summary.length <= 320 &&
      ["completed", "failed", "blocked"].includes(String(envelope.status)) &&
      typeof envelope.requiresHuman === "boolean",
    "episode envelope",
  );
  check(
    root.subjectRevision === request.capsule.subject.revision &&
      root.kind === (verifying ? "verification" : "repair"),
    "episode role or subject",
  );
  if (!verifying) {
    check(
      Array.isArray(root.replacements) &&
        root.replacements.length <= 100 &&
        (envelope.status !== "completed" || root.replacements.length > 0),
      "repair replacements",
    );
    const seen = new Set<string>();
    for (const value of root.replacements) {
      const file = object(value);
      check(
        file &&
          exact(file, ["path", "contents"]) &&
          typeof file.path === "string" &&
          !seen.has(file.path) &&
          request.capsule.finding?.likelySurface.includes(file.path) &&
          request.capsule.subject.files.some(
            (prior) => prior.path === file.path,
          ) &&
          typeof file.contents === "string" &&
          file.contents.length <= 100_000,
        "repair outside focused surface",
      );
      seen.add(file.path);
    }
    check(
      envelope.status !== "completed" ||
        root.replacements.some(
          (file) =>
            request.capsule.subject.files.find(
              (prior) => prior.path === file.path,
            )?.contents !== file.contents,
        ),
      "repair has no substantive change",
    );
    return root as unknown as RepairWorkerResult;
  }
  check(
    Array.isArray(root.evaluations) &&
      Array.isArray(root.findings) &&
      root.findings.length <= 100 &&
      root.evaluations.length <= request.capsule.criteria.length &&
      (envelope.status !== "completed" ||
        root.evaluations.length === request.capsule.criteria.length),
    "criterion coverage",
  );
  const seen = new Set<string>();
  for (const value of root.evaluations) {
    const item = object(value);
    check(
      item &&
        exact(item, [
          "criterionId",
          "claimType",
          "verdict",
          "evidenceRefs",
          "exemplarRefs",
          "dissentRefs",
        ]) &&
        typeof item.criterionId === "string" &&
        !seen.has(item.criterionId) &&
        Array.isArray(item.exemplarRefs) &&
        item.exemplarRefs.length === 0 &&
        Array.isArray(item.dissentRefs) &&
        item.dissentRefs.length === 0,
      "evaluation shape",
    );
    const criterion = request.capsule.criteria.find(
      (criterion) => criterion.criterionId === item.criterionId,
    );
    check(
      criterion &&
        item.claimType === criterion.claimType &&
        ["pass", "fail", "unverified"].includes(String(item.verdict)) &&
        refs(item.evidenceRefs),
      "evaluation criterion",
    );
    const evidence = item.evidenceRefs.map((ref) =>
      request.capsule.subject.evidence.find(
        (entry) => entry.evidenceId === ref,
      ),
    );
    check(
      evidence.every(
        (entry) =>
          entry &&
          entry.criterionId === criterion.criterionId &&
          entry.claimType === criterion.claimType &&
          entry.source === criterion.evidenceSource,
      ),
      "claim-typed evidence",
    );
    if (item.verdict === "pass") {
      check(
        evidence.length > 0 &&
          evidence.every((entry) => entry?.outcome === "pass") &&
          criterion.requiredChecks.every((id) =>
            evidence.some((entry) => entry?.checkId === id),
          ),
        "unsupported pass",
      );
      // Omitting an adverse witness for the same required check cannot certify it.
      check(
        !request.capsule.subject.evidence.some(
          (entry) =>
            entry.criterionId === criterion.criterionId &&
            criterion.requiredChecks.includes(entry.checkId) &&
            entry.outcome !== "pass",
        ),
        "contradictory witness",
      );
    }
    if (item.verdict === "fail")
      check(
        evidence.some((entry) => entry?.outcome === "fail"),
        "unsupported failure",
      );
    seen.add(item.criterionId);
  }
  const findingIds = new Set<string>();
  for (const value of root.findings) {
    let finding: VerificationFinding;
    try {
      finding = copyFinding(value as VerificationFinding);
    } catch {
      throw new WorkerFailure(
        "invalid-result",
        "finding shape" satisfies EvidenceResultRefusal,
      );
    }
    check(
      canonicalStringify(finding) === canonicalStringify(value) &&
        !findingIds.has(finding.findingId),
      "finding shape or duplicate",
    );
    const criterion = request.capsule.criteria.find(
      (criterion) => criterion.criterionId === finding.criterionId,
    );
    const evaluation = root.evaluations.find(
      (entry) => entry.criterionId === finding.criterionId,
    );
    check(
      criterion &&
        evaluation?.verdict === "fail" &&
        finding.likelySurface.every((path) =>
          criterion.codeSurfaces.includes(path),
        ) &&
        finding.evidenceRefs.every((ref) =>
          evaluation.evidenceRefs.includes(ref),
        ),
      "finding criterion or evidence",
    );
    check(
      finding.evidenceRefs.some((ref) =>
        request.capsule.subject.evidence.some(
          (entry) =>
            entry.evidenceId === ref &&
            entry.outcome === "fail" &&
            entry.observed === finding.observed &&
            entry.expected === finding.expected,
        ),
      ),
      "finding observed versus expected",
    );
    findingIds.add(finding.findingId);
  }
  const findings = root.findings;
  check(
    root.evaluations.every(
      (item) =>
        item.verdict !== "fail" ||
        findings.some((finding) => finding.criterionId === item.criterionId),
    ),
    "failed criterion lacks finding",
  );
  return root as unknown as VerificationWorkerResult;
}

const schemaObject = (properties: Record<string, unknown>): object => ({
  type: "object",
  additionalProperties: false,
  required: Object.keys(properties),
  properties,
});
const schemaText = { type: "string" };
const schemaTexts = { type: "array", items: schemaText };
/** A verificationLine as far as schema keywords the live transports accept can
 * say it; control characters stay with admission (WO-157 item 16). */
const schemaLine = { ...schemaText, minLength: 1, maxLength: 2_000 };
const schemaOneOf = (values: readonly string[]): object =>
  values.length > 0
    ? { ...schemaText, enum: [...new Set(values)] }
    : schemaLine;
/** copyFinding's `lines`: 1-100 entries; uniqueness stays with admission. */
const schemaLines = (items: object): object => ({
  type: "array",
  minItems: 1,
  maxItems: 100,
  items,
});

/** The strings admission and repair derivation already require of a finding.
 * A live verifier cannot guess them, so its schema and instructions state them. */
function findingContract(request: EvidenceWorkerRequest) {
  const { evidence, snapshot } = request.capsule.subject;
  const adverse = evidence.filter((entry) => entry.outcome === "fail");
  // A finding needs a failing evaluation, which needs a failing witness of
  // its criterion; without one, admission can accept no finding (WO-157 D024).
  const failing = request.capsule.criteria.filter((criterion) =>
    adverse.some((entry) => entry.criterionId === criterion.criterionId),
  );
  return {
    criterionIds: failing.map((criterion) => criterion.criterionId),
    likelySurface: failing.flatMap((criterion) => criterion.codeSurfaces),
    evidenceIds: evidence.map((entry) => entry.evidenceId),
    observed: adverse.map((entry) => entry.observed),
    expected: adverse.map((entry) => entry.expected),
    // Only the worktree-snapshot profile turns steps into host-run commands.
    reproductionSteps: snapshot
      ? [
          ...adverse.flatMap((entry) => entry.reproductionSteps),
          ...snapshot.tests.map((test) => test.command),
        ]
      : [],
  };
}
export function evidenceResultSchema(request: EvidenceWorkerRequest): object {
  const contract = findingContract(request);
  const common = {
    kind: {
      ...schemaText,
      enum: [request.capsule.role === "verifier" ? "verification" : "repair"],
    },
    envelope: schemaObject({
      workOrderId: { ...schemaText, enum: [request.workOrder.workOrderId] },
      episodeId: { ...schemaText, enum: [request.episodeId] },
      resultId: { ...schemaText, enum: [resultId(request.command)] },
      status: { ...schemaText, enum: ["completed", "blocked", "failed"] },
      summary: { ...schemaText, maxLength: 320 },
      requiresHuman: { type: "boolean" },
    }),
    subjectRevision: {
      ...schemaText,
      enum: [request.capsule.subject.revision],
    },
  };
  return schemaObject(
    request.capsule.role === "repairer"
      ? {
          ...common,
          replacements: {
            type: "array",
            items: schemaObject({ path: schemaText, contents: schemaText }),
          },
        }
      : {
          ...common,
          evaluations: {
            type: "array",
            items: schemaObject({
              criterionId: schemaOneOf(
                request.capsule.criteria.map(
                  (criterion) => criterion.criterionId,
                ),
              ),
              claimType: { ...schemaText, enum: ["state", "behavior"] },
              verdict: {
                ...schemaText,
                enum: contract.criterionIds.length
                  ? ["pass", "fail", "unverified"]
                  : ["pass", "unverified"],
              },
              evidenceRefs: {
                type: "array",
                maxItems: 100,
                items: schemaOneOf(contract.evidenceIds),
              },
              // Admission requires both empty.
              exemplarRefs: { ...schemaTexts, maxItems: 0 },
              dissentRefs: { ...schemaTexts, maxItems: 0 },
            }),
          },
          findings: {
            type: "array",
            maxItems: contract.criterionIds.length ? 100 : 0,
            items: schemaObject({
              findingId: schemaLine,
              criterionId: schemaOneOf(contract.criterionIds),
              severity: { ...schemaText, enum: ["blocking", "major", "minor"] },
              observed: schemaOneOf(contract.observed),
              expected: schemaOneOf(contract.expected),
              reproductionSteps: schemaLines(
                schemaOneOf(contract.reproductionSteps),
              ),
              evidenceRefs: schemaLines(schemaOneOf(contract.evidenceIds)),
              likelySurface: schemaLines(schemaOneOf(contract.likelySurface)),
            }),
          },
        },
  );
}

export function validateTransportRequest(request: TransportRequest): void {
  if (isEntropyReviewRequest(request))
    return validateEntropyReviewRequest(request);
  if (isEntropyRefutationRequest(request))
    return validateEntropyRefutationRequest(request);
  if (isWriterRequest(request)) return validateWriterRequest(request);
  if (isMissionCheckRequest(request))
    return validateMissionCheckRequest(request);
  if (isPlanRequest(request)) return validatePlanRequest(request);
  if (!isEvidenceRequest(request)) return validateRequest(request);
  try {
    assertVerificationTask(request.capsule);
    if (request.feedback !== undefined)
      assertCompiledFeedback(request.feedback);
    if (
      canonicalStringify(request.workOrder) !==
        canonicalStringify(request.capsule.workOrder) ||
      request.command.intent.kind !== "Act" ||
      request.command.intent.effect !==
        request.workOrder.allowedOperations[0] ||
      canonicalStringify(request.command.intent.payload) !==
        canonicalStringify({ capsule: request.capsule }) ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/u.test(request.model) ||
      request.model.length > 100 ||
      !/^[a-zA-Z0-9_-]+$/u.test(request.episodeId) ||
      request.profile.profileId !==
        (request.capsule.subject.snapshot?.profile ??
          "verification-snapshot-v1") ||
      request.profile.mounts.length !== 1 ||
      request.profile.mounts[0]?.path !== request.cwd ||
      request.profile.mounts[0]?.access !== "read"
    )
      throw new Error("profile mismatch");
  } catch (error) {
    throw new WorkerFailure(
      "profile-refused",
      error instanceof Error ? error.message : "invalid verification profile",
    );
  }
}
export function transportResultSchema(request: TransportRequest): object {
  if (isEntropyReviewRequest(request)) return entropyReviewResultSchema();
  if (isEntropyRefutationRequest(request))
    return entropyRefutationResultSchema(request);
  if (isWriterRequest(request)) return writerResultSchema(request);
  if (isMissionCheckRequest(request))
    return missionCheckResultSchema(request.subject);
  if (isPlanRequest(request)) return planResultSchema(request.subject);
  return isEvidenceRequest(request)
    ? evidenceResultSchema(request)
    : workerResultSchema(request);
}
export function parseTransportResult<R extends TransportRequest>(
  value: unknown,
  request: R,
): TransportResultFor<R> {
  return (
    isEntropyReviewRequest(request)
      ? validateReviewerOutput(value, {
          workOrderId: request.workOrder.workOrderId,
          episodeId: request.episodeId,
        })
      : isEntropyRefutationRequest(request)
        ? validateEntropyRefutationResult(value, request)
        : isMissionCheckRequest(request)
          ? validateMissionCheckResult(value, request.subject)
          : isWriterRequest(request)
            ? parseStoredWriterResult(value, request)
            : isPlanRequest(request)
              ? validatePlanResult(value, request.subject)
              : isEvidenceRequest(request)
                ? parseEvidenceResult(value, request)
                : parseWorkerResult(value, request)
  ) as TransportResultFor<R>;
}
export function transportPrompt(request: TransportRequest): string {
  if (isEntropyReviewRequest(request)) return entropyReviewPrompt(request);
  if (isEntropyRefutationRequest(request))
    return entropyRefutationPrompt(request);
  if (isWriterRequest(request)) return writerPrompt(request);
  if (isMissionCheckRequest(request)) return missionCheckPrompt(request);
  if (isPlanRequest(request)) {
    validatePlanRequest(request);
    return planPrompt(request);
  }
  if (!isEvidenceRequest(request)) return workerPrompt(request);
  validateTransportRequest(request);
  return JSON.stringify({
    capsule: request.capsule,
    episodeId: request.episodeId,
    resultId: resultId(request.command),
    outputInstructions:
      request.capsule.role === "verifier"
        ? `Independently assess each criterion using the pinned diff, repository snapshot and host witnesses. This is the complete read mount projection; no tools or other context are granted. Preserve evidence source labels. A pass requires every required check, matching claim type and source, with no adverse witness. Missing or unavailable evidence is unverified. Emit full findings for failures, blocking when repair is required. A finding restates host evidence: reference the failing witness in evidenceRefs, which must also appear in that criterion's evaluation, and copy observed and expected verbatim from that witness; keep likelySurface within the criterion's codeSurfaces.${
            request.capsule.subject.snapshot
              ? " Each reproduction step must be that witness's reproduction step copied verbatim or one of the contract's exact named commands; the host runs them and interprets no prose."
              : ""
          } Put your own diagnosis in envelope.summary. Keep envelope.summary to at most 320 characters. Return only the schema object; completion means this evaluation finished, never implementation success.`
        : "Propose replacement contents only for the blocking finding's likely surfaces in the pinned repository snapshot. Keep the repair focused. No file writes or other tools are granted; the host applies a validated proposal in its synthetic fixture and dispatches a fresh blinded verifier. Keep envelope.summary to at most 320 characters. Return only the schema object. You cannot certify acceptance.",
  });
}
