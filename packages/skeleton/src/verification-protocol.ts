import {
  assertVerificationTask,
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

export interface EvidenceWorkerRequest {
  readonly kind: "evidence-worker";
  readonly command: Command;
  readonly workOrder: WorkOrder;
  readonly capsule: VerificationTask;
  readonly episodeId: string;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly cwd: string;
  readonly profile: {
    readonly profileId: "verification-snapshot-v1";
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
export type TransportRequest = WorkerRequest | EvidenceWorkerRequest;
export type TransportResult = WorkerResult | EvidenceWorkerResult;
export type TransportResultFor<R extends TransportRequest> =
  R extends EvidenceWorkerRequest ? EvidenceWorkerResult : WorkerResult;

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
const check: (valid: unknown, reason: string) => asserts valid = (
  valid,
  reason,
) => {
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
      throw new WorkerFailure("invalid-result", "finding shape");
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
export function evidenceResultSchema(request: EvidenceWorkerRequest): object {
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
      summary: schemaText,
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
              criterionId: schemaText,
              claimType: { ...schemaText, enum: ["state", "behavior"] },
              verdict: { ...schemaText, enum: ["pass", "fail", "unverified"] },
              evidenceRefs: schemaTexts,
              exemplarRefs: schemaTexts,
              dissentRefs: schemaTexts,
            }),
          },
          findings: {
            type: "array",
            items: schemaObject({
              findingId: schemaText,
              criterionId: schemaText,
              severity: { ...schemaText, enum: ["blocking", "major", "minor"] },
              observed: schemaText,
              expected: schemaText,
              reproductionSteps: schemaTexts,
              evidenceRefs: schemaTexts,
              likelySurface: schemaTexts,
            }),
          },
        },
  );
}

export function validateTransportRequest(request: TransportRequest): void {
  if (!isEvidenceRequest(request)) return validateRequest(request);
  try {
    assertVerificationTask(request.capsule);
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
      request.profile.profileId !== "verification-snapshot-v1" ||
      request.profile.mounts.length !== 1 ||
      request.profile.mounts[0]?.path !== request.cwd ||
      request.profile.mounts[0]?.access !== "read"
    )
      throw new Error("profile mismatch");
  } catch {
    throw new WorkerFailure("profile-refused");
  }
}
export function transportResultSchema(request: TransportRequest): object {
  return isEvidenceRequest(request)
    ? evidenceResultSchema(request)
    : workerResultSchema(request);
}
export function parseTransportResult<R extends TransportRequest>(
  value: unknown,
  request: R,
): TransportResultFor<R> {
  return (
    isEvidenceRequest(request)
      ? parseEvidenceResult(value, request)
      : parseWorkerResult(value, request)
  ) as TransportResultFor<R>;
}
export function transportPrompt(request: TransportRequest): string {
  if (!isEvidenceRequest(request)) return workerPrompt(request);
  validateTransportRequest(request);
  return JSON.stringify({
    capsule: request.capsule,
    episodeId: request.episodeId,
    resultId: resultId(request.command),
    outputInstructions:
      request.capsule.role === "verifier"
        ? "Independently assess each criterion using the pinned diff, repository snapshot and host witnesses. This is the complete read mount projection; no tools or other context are granted. Preserve evidence source labels. A pass requires every required check, matching claim type and source, with no adverse witness. Missing or unavailable evidence is unverified. Emit full findings for failures, blocking when repair is required. Return only the schema object; completion means this evaluation finished, never implementation success."
        : "Propose replacement contents only for the blocking finding's likely surfaces in the pinned repository snapshot. Keep the repair focused. No file writes or other tools are granted; the host applies a validated proposal in its synthetic fixture and dispatches a fresh blinded verifier. Return only the schema object. You cannot certify acceptance.",
  });
}
