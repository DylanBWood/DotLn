import type { ReviewContext, ReviewCompleted } from "./review.js";
import type {
  AcceptanceCriterion,
  Evaluation,
  VerificationFinding,
  VerificationTask,
  VerificationSubject,
  VerificationEvidence,
} from "@dotln/compiler";
import {
  replay,
  type Event,
  type EventDraft,
  type JsonValue,
  type AuthorityEnvelope,
  type Command,
  type ExecutableProgramV1,
} from "@dotln/kernel";
import {
  VERIFICATION_HOST,
  initialVerificationRuntime,
  projectRuntimeEnvironment,
  seiriReactor,
  verificationStateFromRuntime,
} from "./reactor.js";
import {
  baselineWitnessRows,
  type BaselineContext,
  type RepairWorkerResult,
  type BaselineWitness,
  type BaselineComparisonFinding,
} from "./verification-protocol.js";
export {
  VERIFICATION_HOST,
  initialVerificationRuntime,
  initialVerificationState,
  verificationAuthorization,
  verificationStateFromRuntime,
} from "./reactor.js";

export interface MatrixEvaluation extends Evaluation {
  readonly provenance: {
    readonly kind: "host-admitted-verifier";
    readonly commandId: string;
    readonly inputHash: string;
  };
  readonly eventId: string;
  readonly episodeId: string;
  readonly subjectRevision: string;
  readonly stale: boolean;
}
export interface AcceptanceEvidenceRow {
  readonly criterion: AcceptanceCriterion;
  readonly status: "incomplete" | "verified" | "failed" | "stale";
  readonly evaluations: readonly MatrixEvaluation[];
}
export interface FindingRecord {
  readonly finding: VerificationFinding;
  readonly eventId: string;
  readonly episodeId: string;
  readonly subjectRevision: string;
  readonly status: "open" | "resolved" | "superseded";
}
export interface VerificationPending {
  readonly review?: ReviewContext;
  readonly baseline?: BaselineContext;
  readonly capsule: VerificationTask;
  readonly command: Command;
  readonly ordinal: number;
  readonly persisted: boolean;
  readonly attempts: readonly string[];
  readonly activeEpisode: string | null;
  readonly leaseExpiresAt: number;
  readonly leaseExpired: boolean;
}
export interface VerificationState {
  readonly reviewNotice?: true;
  readonly reviewConventionsPath?: string | null;
  readonly reviewCompleted?: ReviewCompleted;
  readonly baselineContext?: BaselineContext;
  readonly baselineWitness?: BaselineWitness;
  readonly baselineFindings?: readonly BaselineComparisonFinding[];
  readonly episodeNamespace?: string;
  readonly workstreamId: string;
  readonly criteria: readonly AcceptanceCriterion[];
  readonly baseline: VerificationSubject | null;
  readonly subject: VerificationSubject | null;
  readonly rows: readonly AcceptanceEvidenceRow[];
  readonly evidence: readonly VerificationEvidence[];
  readonly findings: readonly FindingRecord[];
  readonly repairPlans: readonly {
    readonly findingId: string;
    readonly capsule: VerificationTask;
  }[];
  readonly implementerEpisodes: readonly string[];
  readonly episodeIds: readonly string[];
  readonly authority: AuthorityEnvelope | null;
  readonly revocations: readonly Event[];
  readonly pending: VerificationPending | null;
  readonly continuation: ExecutableProgramV1;
  readonly next:
    | "unopened"
    | "verify"
    | "repair"
    | "apply-repair"
    | "complete"
    | "baseline-witnessed"
    | "review"
    | "reviewed"
    | "attention";
  readonly proposal: RepairWorkerResult | null;
  readonly dispatchCount: number;
  readonly repairCount: number;
  readonly maxRepairs: number;
  readonly lastResultEventId: string | null;
  readonly refusedResults: readonly string[];
  readonly staleness: readonly {
    readonly eventId: string;
    readonly changedSurfaces: readonly string[];
    readonly criterionIds: readonly string[];
  }[];
}
export function replayVerification(
  events: readonly Event[],
  workstreamId: string,
): VerificationState {
  return verificationStateFromRuntime(
    replay(
      initialVerificationRuntime(workstreamId),
      events,
      seiriReactor,
      {},
      projectRuntimeEnvironment,
    ).state,
  );
}
export interface AcceptanceEvidenceMatrix {
  readonly review?: ReviewCompleted;
  readonly baselineWitness?: BaselineWitness;
  readonly baselineEvidence?: ReturnType<typeof baselineWitnessRows>;
  readonly baselineFindings?: readonly BaselineComparisonFinding[];
  readonly workstreamId: string;
  readonly subjectRevision: string | null;
  readonly phase: VerificationState["next"];
  readonly baseline: VerificationSubject | null;
  readonly rows: readonly AcceptanceEvidenceRow[];
  readonly evidence: readonly VerificationEvidence[];
  readonly findings: readonly FindingRecord[];
  readonly staleness: VerificationState["staleness"];
}
export function projectAcceptanceEvidenceMatrices(
  events: readonly Event[],
): readonly AcceptanceEvidenceMatrix[] {
  const streams = [
    ...new Set(
      events
        .filter(
          (event) =>
            event.type === "VerificationOpened" &&
            event.actorId === VERIFICATION_HOST,
        )
        .map((event) => event.workstreamId),
    ),
  ];
  return streams.map((id) => {
    const state = replayVerification(events, id);
    return {
      ...(state.baselineWitness
        ? {
            baselineWitness: state.baselineWitness,
            baselineEvidence: baselineWitnessRows(state.baselineWitness),
          }
        : {}),
      ...(state.baselineFindings
        ? { baselineFindings: state.baselineFindings }
        : {}),
      ...(state.reviewCompleted ? { review: state.reviewCompleted } : {}),
      workstreamId: id,
      subjectRevision: state.subject?.revision ?? null,
      phase: state.next,
      baseline: state.baseline,
      rows: state.rows,
      evidence: state.evidence,
      findings: state.findings,
      staleness: state.staleness,
    };
  });
}

export function verificationDraft(
  workstreamId: string,
  type: string,
  occurredAt: number,
  payload: unknown,
  correlationId?: string,
): EventDraft {
  return {
    schemaVersion: 1,
    type,
    occurredAt,
    actorId: VERIFICATION_HOST,
    workstreamId,
    ...(correlationId ? { correlationId } : {}),
    payload: payload as JsonValue,
  };
}
