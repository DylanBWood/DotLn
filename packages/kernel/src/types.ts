export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  JsonPrimitive | { readonly [key: string]: JsonValue } | readonly JsonValue[];

export interface EventEnvelope<
  T extends string = string,
  P extends JsonValue = JsonValue,
> {
  readonly schemaVersion: 1;
  readonly eventId: string;
  readonly type: T;
  readonly occurredAt: number;
  readonly actorId: string;
  readonly workstreamId: string;
  readonly episodeId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly payload: P;
}

export type EventDraft<
  T extends string = string,
  P extends JsonValue = JsonValue,
> = Omit<EventEnvelope<T, P>, "eventId">;

export type Comparison = EventEnvelope<
  "Comparison",
  {
    readonly itemA: string;
    readonly itemB: string;
    readonly dimension?: string;
    readonly judge: string;
    readonly result: "itemA" | "itemB" | "draw";
    readonly context: JsonValue;
    readonly orderRandomized: boolean;
  }
>;
export type Refusal = EventEnvelope<
  "CommandRefused",
  {
    readonly intentIndex: number;
    readonly reason: string;
    readonly authorityEnvelopeId: string;
  }
>;
export type Event = EventEnvelope | Comparison | Refusal;

export interface PredicateRef {
  readonly registryId: string;
  readonly version: number;
  readonly params?: Readonly<Record<string, JsonValue>>;
}
export interface EventPattern {
  readonly type: string;
  readonly correlationId?: string;
  readonly commandId?: string;
}

export namespace Program {
  export type T =
    | Done
    | Emit
    | Invoke
    | Await
    | Sequence
    | Choose
    | All
    | Race
    | Guard
    | Repeat
    | Compensate;
  export interface Done {
    readonly kind: "Done";
  }
  export interface Emit {
    readonly kind: "Emit";
    readonly event: EventDraft;
    readonly next: T;
  }
  export interface Invoke {
    readonly kind: "Invoke";
    readonly commandId: string;
    readonly command: ActIntent;
    readonly continuationByResult: Readonly<Record<string, T>>;
  }
  export interface Await {
    readonly kind: "Await";
    readonly pattern: EventPattern;
    readonly timeout: Cadence.T;
    readonly next: T;
  }
  export interface Sequence {
    readonly kind: "Sequence";
    readonly programs: readonly T[];
  }
  export interface Choose {
    readonly kind: "Choose";
    readonly policyRef: string;
    readonly alternatives: readonly T[];
  }
  export interface All {
    readonly kind: "All";
    readonly programs: readonly T[];
  }
  export interface Race {
    readonly kind: "Race";
    readonly programs: readonly T[];
  }
  export interface Guard {
    readonly kind: "Guard";
    readonly conditionRef: PredicateRef;
    readonly whenTrue: T;
    readonly whenFalse: T;
  }
  export interface Repeat {
    readonly kind: "Repeat";
    readonly program: T;
    readonly stopConditionRef: PredicateRef;
  }
  export interface Compensate {
    readonly kind: "Compensate";
    readonly program: T;
    readonly compensation: T;
  }
  export const Done = (): Done => ({ kind: "Done" });
  export const Emit = (event: EventDraft, next: T): Emit => ({
    kind: "Emit",
    event,
    next,
  });
  export const Invoke = (
    commandId: string,
    command: ActIntent,
    continuationByResult: Readonly<Record<string, T>>,
  ): Invoke => ({ kind: "Invoke", commandId, command, continuationByResult });
  export const Await = (
    pattern: EventPattern,
    timeout: Cadence.T,
    next: T,
  ): Await => ({ kind: "Await", pattern, timeout, next });
  export const Sequence = (programs: readonly T[]): Sequence => ({
    kind: "Sequence",
    programs,
  });
  export const Choose = (
    policyRef: string,
    alternatives: readonly T[],
  ): Choose => ({ kind: "Choose", policyRef, alternatives });
  export const All = (programs: readonly T[]): All => ({
    kind: "All",
    programs,
  });
  export const Race = (programs: readonly T[]): Race => ({
    kind: "Race",
    programs,
  });
  export const Guard = (
    conditionRef: PredicateRef,
    whenTrue: T,
    whenFalse: T,
  ): Guard => ({ kind: "Guard", conditionRef, whenTrue, whenFalse });
  export const Repeat = (
    program: T,
    stopConditionRef: PredicateRef,
  ): Repeat => ({ kind: "Repeat", program, stopConditionRef });
  export const Compensate = (program: T, compensation: T): Compensate => ({
    kind: "Compensate",
    program,
    compensation,
  });
}

export namespace Cadence {
  export type T =
    | Once
    | After
    | Every
    | Burst
    | Calendar
    | Window
    | While
    | Until
    | Gate
    | Sequence
    | Merge
    | Race
    | Repeat
    | Backoff;
  export interface Once {
    readonly kind: "Once";
    readonly at: number;
  }
  export interface After {
    readonly kind: "After";
    readonly delayMs: number;
  }
  export interface Every {
    readonly kind: "Every";
    readonly intervalMs: number;
    readonly startAt?: number;
  }
  export interface Burst {
    readonly kind: "Burst";
    readonly count: number;
    readonly intervalMs: number;
  }
  export interface Calendar {
    readonly kind: "Calendar";
    readonly expression: string;
    readonly timezone: string;
  }
  export interface Window {
    readonly kind: "Window";
    readonly cadence: T;
    readonly start: number;
    readonly end: number;
  }
  export interface While {
    readonly kind: "While";
    readonly cadence: T;
    readonly conditionRef: PredicateRef;
  }
  export interface Until {
    readonly kind: "Until";
    readonly cadence: T;
    readonly conditionRef: PredicateRef;
  }
  export interface Gate {
    readonly kind: "Gate";
    readonly cadence: T;
    readonly conditionRef: PredicateRef;
  }
  export interface Sequence {
    readonly kind: "Sequence";
    readonly cadences: readonly T[];
  }
  export interface Merge {
    readonly kind: "Merge";
    readonly cadences: readonly T[];
  }
  export interface Race {
    readonly kind: "Race";
    readonly cadences: readonly T[];
  }
  export interface Repeat {
    readonly kind: "Repeat";
    readonly cadence: T;
    readonly count: number;
  }
  export interface Backoff {
    readonly kind: "Backoff";
    readonly initialMs: number;
    readonly factor: number;
    readonly maxMs: number;
    readonly attempt: number;
    readonly jitter: number;
  }
  export const Once = (at: number): Once => ({ kind: "Once", at });
  export const After = (delayMs: number): After => ({ kind: "After", delayMs });
  export const Every = (intervalMs: number, startAt?: number): Every =>
    startAt === undefined
      ? { kind: "Every", intervalMs }
      : { kind: "Every", intervalMs, startAt };
  export const Burst = (count: number, intervalMs: number): Burst => ({
    kind: "Burst",
    count,
    intervalMs,
  });
  export const Calendar = (expression: string, timezone: string): Calendar => ({
    kind: "Calendar",
    expression,
    timezone,
  });
  export const Window = (cadence: T, start: number, end: number): Window => ({
    kind: "Window",
    cadence,
    start,
    end,
  });
  export const While = (cadence: T, conditionRef: PredicateRef): While => ({
    kind: "While",
    cadence,
    conditionRef,
  });
  export const Until = (cadence: T, conditionRef: PredicateRef): Until => ({
    kind: "Until",
    cadence,
    conditionRef,
  });
  export const Gate = (cadence: T, conditionRef: PredicateRef): Gate => ({
    kind: "Gate",
    cadence,
    conditionRef,
  });
  export const Sequence = (cadences: readonly T[]): Sequence => ({
    kind: "Sequence",
    cadences,
  });
  export const Merge = (cadences: readonly T[]): Merge => ({
    kind: "Merge",
    cadences,
  });
  export const Race = (cadences: readonly T[]): Race => ({
    kind: "Race",
    cadences,
  });
  export const Repeat = (cadence: T, count: number): Repeat => ({
    kind: "Repeat",
    cadence,
    count,
  });
  export const Backoff = (
    initialMs: number,
    factor: number,
    maxMs: number,
    attempt: number,
    jitter: number,
  ): Backoff => ({
    kind: "Backoff",
    initialMs,
    factor,
    maxMs,
    attempt,
    jitter,
  });
}

export interface ActIntent {
  readonly kind: "Act";
  readonly effect: string;
  readonly resource?: string;
  readonly payload: JsonValue;
}
export interface WaitIntent {
  readonly kind: "Wait";
  readonly cadence: Cadence.T;
}
export interface ObserveIntent {
  readonly kind: "Observe";
  readonly subject: string;
}
export interface NoOpIntent {
  readonly kind: "NoOp";
  readonly reason: string;
  readonly evidence: readonly string[];
  readonly reevaluation: Cadence.T;
  readonly usefulWhen: PredicateRef;
}
export type Intent = ActIntent | WaitIntent | ObserveIntent | NoOpIntent;
export interface DecisionTrace {
  readonly reactorId: string;
  readonly reactorVersion: string;
  readonly branchPath: readonly string[];
  readonly envInputs: readonly string[];
  readonly cadenceEvaluations: readonly string[];
}
export interface Schedule {
  readonly scheduleId: string;
  readonly cadence: Cadence.T;
  readonly eventToEmit: EventDraft;
  readonly cancelOn: readonly PredicateRef[];
}
export interface Decision<S extends JsonValue = JsonValue> {
  readonly state: S;
  readonly intents: readonly Intent[];
  readonly continuation?: Program.T;
  readonly schedules: readonly Schedule[];
  readonly trace: DecisionTrace;
}
export interface KernelEnv {
  readonly now: number;
  readonly rngState: number;
  readonly predicates: PredicateRegistry;
  readonly policy?: JsonValue;
}
export type Predicate = (
  context: Readonly<{ state: JsonValue; event?: Event; env: KernelEnv }>,
  params: Readonly<Record<string, JsonValue>>,
) => boolean;
export type PredicateRegistry = Readonly<
  Record<string, Readonly<Record<number, Predicate>>>
>;
export type Reactor<S extends JsonValue = JsonValue> = (
  state: S,
  event: Event,
  env: KernelEnv,
) => Decision<S>;

export interface AuthorityEnvelope {
  readonly authorityEnvelopeId: string;
  readonly allowedEffects: readonly string[];
  readonly deniedEffects: readonly string[];
  readonly resourceLimits: Readonly<Record<string, number>>;
  readonly requiredEvidence: readonly string[];
  readonly expiresAt: number;
  readonly revocationEventTypes: readonly string[];
}
export interface Command {
  readonly commandId: string;
  readonly episodeId?: string;
  readonly workstreamId: string;
  readonly intent: ActIntent;
}
export interface CommandReceipt {
  readonly commandId: string;
  readonly transport: string;
  readonly acceptedAt: number;
}
export interface WorkOrder {
  readonly workOrderId: string;
  readonly objective: string;
  readonly acceptanceCriteria: readonly string[];
  readonly knownFacts: readonly string[];
  readonly decisions: readonly string[];
  readonly constraints: readonly string[];
  readonly nonGoals: readonly string[];
  readonly repo: string;
  readonly baseCommit: string;
  readonly allowedOperations: readonly string[];
  readonly prohibitedOperations: readonly string[];
  readonly requiredEvidence: readonly string[];
  readonly outputContract: JsonValue;
}
export interface ResultEnvelope {
  readonly workOrderId: string;
  readonly episodeId: string;
  readonly status: "completed" | "failed" | "blocked";
  readonly resultId: string;
  readonly summary: string;
  readonly requiresHuman: boolean;
}

export interface OutboxEntry {
  readonly command: Command;
  readonly status: "pending" | "completed";
  readonly resultEventId?: string;
}
export interface OutboxState {
  readonly entries: Readonly<Record<string, OutboxEntry>>;
}
