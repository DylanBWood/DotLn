import type {
  VerificationSubject,
  VerificationEvidence,
} from "@dotln/compiler";
import {
  replay,
  type Event,
  type EventDraft,
  type JsonValue,
} from "@dotln/kernel";
import {
  VERIFICATION_HOST,
  initialVerificationRuntime,
  seiriReactor,
  verificationStateFromRuntime,
  type AcceptanceEvidenceRow,
  type FindingRecord,
  type VerificationState,
} from "./reactor.js";
export {
  VERIFICATION_HOST,
  initialVerificationRuntime,
  initialVerificationState,
  verificationAuthorization,
  verificationStateFromRuntime,
  type MatrixEvaluation,
  type AcceptanceEvidenceRow,
  type FindingRecord,
  type VerificationPending,
  type VerificationState,
} from "./reactor.js";

/** Compatibility projection over the shared typed reactor, never a second decider. */
export function verificationReactor(
  state: VerificationState,
  event: Event,
): VerificationState {
  const runtime = {
    ...initialVerificationRuntime(state.workstreamId),
    verification: state as unknown as JsonValue,
  };
  return verificationStateFromRuntime(
    seiriReactor(runtime, event, {
      now: event.occurredAt,
      rngState: 17,
      predicates: {},
    }).state,
  );
}
export function replayVerification(
  events: readonly Event[],
  workstreamId: string,
): VerificationState {
  return verificationStateFromRuntime(
    replay(initialVerificationRuntime(workstreamId), events, seiriReactor, {})
      .state,
  );
}
export interface AcceptanceEvidenceMatrix {
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
