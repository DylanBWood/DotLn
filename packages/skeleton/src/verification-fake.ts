import type { VerificationTask, VerificationFinding } from "@dotln/compiler";
import { WorkerFailure } from "./worker-protocol.js";
import {
  isEvidenceRequest,
  parseTransportResult,
  validateTransportRequest,
  type EvidenceWorkerResult,
  type EvidenceWorkerRequest,
  type TransportRequest,
  type TransportResultFor,
} from "./verification-protocol.js";
import type {
  TransportDispatch,
  WorkOrderTransport,
} from "./worker-transport.js";

/** Deterministic test double. All inputs and witnesses remain labeled synthetic. */
export function fixtureVerificationResult(
  capsule: VerificationTask,
  episodeId: string,
  resultId: string,
): EvidenceWorkerResult {
  const envelope = {
    workOrderId: capsule.workOrder.workOrderId,
    episodeId,
    resultId,
    status: "completed" as const,
    summary: "Synthetic fixture episode completed.",
    requiresHuman: false,
  };
  if (capsule.role === "repairer") {
    const policy = JSON.parse(
      capsule.subject.files.find((file) => file.path === "policy.json")!
        .contents,
    );
    return {
      kind: "repair",
      envelope,
      subjectRevision: capsule.subject.revision,
      replacements: [
        {
          path: "policy.json",
          contents:
            JSON.stringify({ ...policy, includeReferenced: false }) + "\n",
        },
      ],
    };
  }
  const findings: VerificationFinding[] = [];
  const evaluations = capsule.criteria.map((criterion) => {
    const evidence = capsule.subject.evidence.filter(
      (item) => item.criterionId === criterion.criterionId,
    );
    const failed = evidence.find((item) => item.outcome === "fail");
    const verdict = failed
      ? ("fail" as const)
      : criterion.requiredChecks.every((check) =>
            evidence.some(
              (item) => item.checkId === check && item.outcome === "pass",
            ),
          )
        ? ("pass" as const)
        : ("unverified" as const);
    if (failed)
      findings.push({
        findingId: `finding_${capsule.workOrder.workOrderId}_${criterion.criterionId}`,
        criterionId: criterion.criterionId,
        severity: "blocking",
        observed: failed.observed,
        expected: failed.expected,
        reproductionSteps: failed.reproductionSteps,
        evidenceRefs: [failed.evidenceId],
        likelySurface: ["policy.json"],
      });
    return {
      criterionId: criterion.criterionId,
      claimType: criterion.claimType,
      verdict,
      evidenceRefs: evidence.map((item) => item.evidenceId),
      exemplarRefs: [],
      dissentRefs: [],
    };
  });
  return {
    kind: "verification",
    envelope,
    subjectRevision: capsule.subject.revision,
    evaluations,
    findings,
  };
}

export class FakeVerificationTransport implements WorkOrderTransport<EvidenceWorkerRequest> {
  readonly name = "fake" as const;
  readonly harnessVersion = "not-applicable";
  dispatch<R extends TransportRequest>(
    request: R,
    now: () => number,
  ): TransportDispatch<TransportResultFor<R>> {
    validateTransportRequest(request);
    if (!isEvidenceRequest(request)) throw new WorkerFailure("profile-refused");
    const result = parseTransportResult(
      fixtureVerificationResult(
        request.capsule,
        request.episodeId,
        `result_${request.command.commandId}`,
      ),
      request,
    ) as TransportResultFor<R>;
    return {
      receipt: Promise.resolve({
        commandId: request.command.commandId,
        transport: this.name,
        acceptedAt: now(),
      }),
      completed: Promise.resolve(result),
      alive: () => false,
      kill: () => {},
    };
  }
}
