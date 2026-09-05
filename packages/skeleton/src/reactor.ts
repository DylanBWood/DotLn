import {
  Cadence,
  Program,
  authorize,
  commandId,
  decideProgram,
  evaluateCadence,
  guardQueuedPulse,
  type ActIntent,
  type AuthorityEnvelope,
  type Command,
  type Decision,
  type Event,
  type EventDraft,
  type JsonValue,
  type KernelEnv,
  type PredicateRegistry,
  type Reactor,
  type WorkOrder,
} from "@dotln/kernel";
import {
  SEIRI_MINUTE,
  SEIRI_PULSE_SCHEDULE,
  SEIRI_QUEUED_PULSE,
  compileLoadout,
  canonicalStringify,
  seiriEnvironment,
  seiriLoadout,
  type ArtifactIdentityV1,
  type CompileDiagnostic,
  type CompiledProgram,
  type LoadoutGraph,
} from "@dotln/compiler";
import {
  artifactIdentityDrift,
  artifactIdentityInputs,
  artifactRefusalPayload,
  compileArtifact,
  isArtifactIdentityV1,
  isArtifactRefusalType,
  type ArtifactDriftField,
  type ArtifactRefusalType,
} from "./artifact-identity.js";
import { beaconAge, decodeSignalSize } from "./control-codebook.mjs";
import type {
  BeaconSweepRequest,
  JudgedBeacon,
  SignalObservation,
} from "./control-beacon.js";

export const MINUTE = SEIRI_MINUTE;
export const WORKSTREAM = "ws_repo_garden";
export const EPISODE = "ep_seiri_1";
export const ACTOR = "repo-gardener";
export const PULSE_SCHEDULE = SEIRI_PULSE_SCHEDULE;
export const QUEUED_PULSE = SEIRI_QUEUED_PULSE;

export type Candidate = Readonly<{
  path: string;
  classification: string;
  evidence: readonly string[];
}>;

export type Loadout = LoadoutGraph;

type RuntimePolicy = Readonly<{ maintenance: string }>;

export type RuntimeState = Readonly<{
  presence: "away" | "returned";
  rngState: number;
  policy: RuntimePolicy;
  loadout: JsonValue;
  artifactIdentity: JsonValue;
  compilationEnvironment: JsonValue;
  equippedEventId: string | null;
  identityEnforcementEventId: string | null;
  artifactIdentityBlocked: boolean;
  workOrder: JsonValue;
  candidates: readonly Candidate[];
  verified: boolean;
  verificationCompleted: boolean;
  pulseSeen: boolean;
  inspectionCompleted: boolean;
  deletionRefused: boolean;
  queuedPulseNoOp: boolean;
  authority: JsonValue;
  revocationEvents: readonly JsonValue[];
  program: JsonValue;
  commandResult: JsonValue;
  pendingCommand: JsonValue;
  authorizationEvidence: readonly string[];
  deletionPaths: readonly string[];
  refusalReason: JsonValue;
  persistedEffect: JsonValue;
  noOpEvidence: readonly string[];
  cancelledScheduleIds: readonly string[];
  activeScheduleIds: readonly string[];
  redispatchedCommandIds: readonly string[];
  beaconObservations: readonly JudgedBeacon[];
  beaconSweep: JsonValue;
}>;

export const loadout: Loadout = seiriLoadout;

const statePresence = (state: JsonValue): JsonValue | undefined =>
  state !== null && !Array.isArray(state) && typeof state === "object"
    ? (state as Readonly<Record<string, JsonValue>>)["presence"]
    : undefined;

export const seiriPredicates: PredicateRegistry = {
  "operator.away": { 1: ({ state }) => statePresence(state) === "away" },
  "operator.returned": {
    1: ({ state }) => statePresence(state) === "returned",
  },
  "operator.return-event": {
    1: ({ state, event }) =>
      statePresence(state) === "returned" &&
      event?.type === "OperatorPresenceChanged" &&
      event.payload !== null &&
      !Array.isArray(event.payload) &&
      typeof event.payload === "object" &&
      (event.payload as Readonly<Record<string, JsonValue>>)["presence"] ===
        "returned",
  },
};

export function compileLoadoutProgram(
  equipped: Loadout,
  baseCommit = "fixture-base",
): CompiledProgram {
  const result = compileLoadout(equipped, seiriEnvironment(baseCommit));
  if (!result.ok)
    throw new Error(
      result.diagnostics.map((entry) => entry.message).join("\n"),
    );
  return result.program;
}

export function compileWorkOrder(
  equipped: Loadout,
  baseCommit = "fixture-base",
): WorkOrder {
  return compileLoadoutProgram(equipped, baseCommit).workOrder;
}

export const initialState = (): RuntimeState => ({
  presence: "returned",
  rngState: 17,
  policy: { maintenance: "absent-only" },
  loadout: null,
  artifactIdentity: null,
  compilationEnvironment: null,
  equippedEventId: null,
  identityEnforcementEventId: null,
  artifactIdentityBlocked: false,
  workOrder: null,
  candidates: [],
  verified: false,
  verificationCompleted: false,
  pulseSeen: false,
  inspectionCompleted: false,
  deletionRefused: false,
  queuedPulseNoOp: false,
  authority: null,
  revocationEvents: [],
  program: null,
  commandResult: null,
  pendingCommand: null,
  authorizationEvidence: [],
  deletionPaths: [],
  refusalReason: null,
  persistedEffect: null,
  noOpEvidence: [],
  cancelledScheduleIds: [],
  activeScheduleIds: [],
  redispatchedCommandIds: [],
  beaconObservations: [],
  beaconSweep: null,
});

const asObject = (
  value: JsonValue,
): Readonly<Record<string, JsonValue>> | undefined =>
  value !== null && !Array.isArray(value) && typeof value === "object"
    ? (value as Readonly<Record<string, JsonValue>>)
    : undefined;

const stringField = (value: JsonValue, key: string): string | undefined => {
  const candidate = asObject(value)?.[key];
  return typeof candidate === "string" ? candidate : undefined;
};

const stringArrayField = (value: JsonValue, key: string): readonly string[] => {
  const candidate = asObject(value)?.[key];
  return Array.isArray(candidate) &&
    candidate.every((item) => typeof item === "string")
    ? candidate
    : [];
};

const candidatesField = (value: JsonValue): readonly Candidate[] => {
  const candidates = asObject(value)?.["candidates"];
  return Array.isArray(candidates)
    ? (candidates as unknown as readonly Candidate[])
    : [];
};

const eventFromState = (value: JsonValue, name: string): Event => {
  if (value === null) throw new Error(`runtime state lacks ${name}`);
  return value as unknown as Event;
};

const workOrderFromValue = (value: JsonValue): WorkOrder => {
  if (value === null) throw new Error("runtime state lacks WorkOrder");
  return value as unknown as WorkOrder;
};

const cadenceFromCompiled = (compiled: CompiledProgram) => {
  const value = compiled.cadences[0];
  if (value === undefined) throw new Error("compiled loadout lacks cadence");
  return value;
};

const authorityFromState = (state: RuntimeState): AuthorityEnvelope =>
  state.authority as unknown as AuthorityEnvelope;

const revocationsFromState = (state: RuntimeState): readonly Event[] =>
  state.revocationEvents as unknown as readonly Event[];

const programFromState = (state: RuntimeState): Program.T => {
  if (state.program === null)
    throw new Error("runtime state lacks continuation");
  return state.program as unknown as Program.T;
};

const requiredContinuation = (decision: Decision<RuntimeState>): Program.T => {
  if (decision.continuation === undefined)
    throw new Error("kernel program decision lacks a continuation");
  return decision.continuation;
};

export const workOrderFromState = (state: RuntimeState): WorkOrder =>
  workOrderFromValue(state.workOrder);

export const commandFromState = (state: RuntimeState): Command => {
  if (state.pendingCommand === null)
    throw new Error("runtime state lacks pending command");
  return state.pendingCommand as unknown as Command;
};

const inspectIntent = (workOrder: WorkOrder): ActIntent => ({
  kind: "Act",
  effect: "repo.inspect",
  resource: "inspections",
  payload: { workOrder: workOrder as unknown as JsonValue },
});

const verificationProgram = (
  workOrder: WorkOrder,
  at: number,
  verificationSubject: string,
): Program.T => {
  const inspect = inspectIntent(workOrder);
  const id = commandId(WORKSTREAM, EPISODE, 1, 0);
  return Program.Invoke(id, inspect, {
    [verificationSubject]: Program.Emit(
      draft("VerificationRequested", at + 2, { commandId: id }),
      Program.Done(),
    ),
  });
};

const draft = (
  type: string,
  occurredAt: number,
  payload: JsonValue,
  correlationId?: string,
  causationId?: string,
): EventDraft => ({
  schemaVersion: 1,
  type,
  occurredAt,
  actorId: ACTOR,
  workstreamId: WORKSTREAM,
  episodeId: EPISODE,
  ...(correlationId === undefined ? {} : { correlationId }),
  ...(causationId === undefined ? {} : { causationId }),
  payload,
});

const linkedDraft = (
  event: EventDraft,
  correlationId: string | undefined,
  causationId: string,
): EventDraft => ({
  schemaVersion: event.schemaVersion,
  type: event.type,
  occurredAt: event.occurredAt,
  actorId: event.actorId,
  workstreamId: event.workstreamId,
  ...(event.episodeId === undefined ? {} : { episodeId: event.episodeId }),
  ...(correlationId === undefined ? {} : { correlationId }),
  causationId,
  payload: event.payload,
});

const observed = (
  state: RuntimeState,
  event: Event,
  branch = "observed",
): Decision<RuntimeState> => ({
  state,
  intents: [],
  schedules: [],
  trace: {
    reactorId: "seiri-reactor",
    reactorVersion: "1",
    branchPath: [event.type, branch],
    envInputs: ["event"],
    cadenceEvaluations: [],
  },
});

const pinnedIdentity = (state: RuntimeState): ArtifactIdentityV1 | null =>
  isArtifactIdentityV1(state.artifactIdentity) ? state.artifactIdentity : null;

const withIdentityTrace = (
  decision: Decision<RuntimeState>,
  identity: ArtifactIdentityV1 | null,
  equippedEventId: string | null,
): Decision<RuntimeState> =>
  identity === null || equippedEventId === null
    ? decision
    : {
        ...decision,
        trace: {
          ...decision.trace,
          envInputs: [
            ...new Set([
              ...decision.trace.envInputs,
              ...artifactIdentityInputs(identity, equippedEventId),
            ]),
          ],
        },
      };

const artifactRefused = (
  state: RuntimeState,
  event: Event,
  type: ArtifactRefusalType,
  reason: string,
  options: Readonly<{
    pinned?: ArtifactIdentityV1 | null;
    observed?: ArtifactIdentityV1 | null;
    diagnostics?: readonly CompileDiagnostic[];
    drift?: readonly ArtifactDriftField[];
  }> = {},
): Decision<RuntimeState> => {
  const pin = options.pinned ?? pinnedIdentity(state);
  return {
    state:
      type === "UnknownScheduleRefused"
        ? state
        : {
            ...state,
            artifactIdentityBlocked: true,
            authority: null,
            pendingCommand: null,
            program: null,
            activeScheduleIds: [],
          },
    intents: [],
    schedules: [],
    continuation: Program.Emit(
      {
        schemaVersion: 1,
        type,
        occurredAt: event.occurredAt,
        actorId: event.actorId,
        workstreamId: event.workstreamId,
        ...(event.episodeId === undefined
          ? {}
          : { episodeId: event.episodeId }),
        ...(event.correlationId === undefined
          ? {}
          : { correlationId: event.correlationId }),
        causationId: event.eventId,
        payload: artifactRefusalPayload(
          reason,
          event.eventId,
          state.equippedEventId,
          pin,
          options.observed ?? null,
          options.diagnostics ?? [],
          options.drift ?? [],
        ) as unknown as JsonValue,
      },
      Program.Done(),
    ),
    trace: {
      reactorId: "artifact-identity",
      reactorVersion: "1",
      branchPath: [event.type, "refused", type, reason],
      envInputs: [
        "event",
        "equipped-artifact",
        "logged-enforcement-boundary",
        ...(pin === null || state.equippedEventId === null
          ? []
          : artifactIdentityInputs(pin, state.equippedEventId)),
      ],
      cadenceEvaluations: [],
    },
  };
};

const equipDecision = (
  state: RuntimeState,
  event: Event,
): Decision<RuntimeState> => {
  const payload = asObject(event.payload);
  const legacy =
    payload === undefined || !Object.hasOwn(payload, "payloadVersion");
  if (
    legacy &&
    (state.identityEnforcementEventId !== null || state.artifactIdentityBlocked)
  )
    return artifactRefused(
      state,
      event,
      "ArtifactIdentityUnavailable",
      "legacy equip after enforcement boundary",
    );
  if (
    !legacy &&
    (payload?.["payloadVersion"] !== 2 ||
      Object.keys(payload).sort().join(",") !==
        "artifactIdentity,graph,payloadVersion" ||
      !isArtifactIdentityV1(payload["artifactIdentity"]))
  )
    return artifactRefused(
      state,
      event,
      "ArtifactIdentityInvalid",
      "invalid v2 equip payload",
    );
  const pin = legacy
    ? null
    : (payload!["artifactIdentity"] as unknown as ArtifactIdentityV1);
  const graph = legacy ? event.payload : payload!["graph"]!;
  const environment =
    pin === null ? seiriEnvironment() : pin.compilationEnvironment;
  const compiled = compileArtifact(graph, environment);
  if (!compiled.ok)
    return artifactRefused(
      state,
      event,
      "ArtifactCompilationRefused",
      "compile diagnostics",
      {
        pinned: pin,
        diagnostics: compiled.diagnostics,
      },
    );
  const drift =
    pin === null ? [] : artifactIdentityDrift(pin, compiled.artifactIdentity);
  if (drift.length > 0)
    return artifactRefused(
      state,
      event,
      "ArtifactIdentityDrift",
      "equipped artifact differs from compilation",
      {
        pinned: pin,
        observed: compiled.artifactIdentity,
        drift,
      },
    );
  return withIdentityTrace(
    observed(
      {
        ...state,
        loadout: graph,
        artifactIdentity: pin as unknown as JsonValue,
        compilationEnvironment: environment as unknown as JsonValue,
        equippedEventId: event.eventId,
        artifactIdentityBlocked: false,
        authority: compiled.program.authorityEnvelope as unknown as JsonValue,
        ...(legacy
          ? {}
          : {
              workOrder: null,
              pendingCommand: null,
              program: null,
              activeScheduleIds: [],
            }),
      },
      event,
      "equipped",
    ),
    pin,
    event.eventId,
  );
};

/** Every compiled consumer, including stored authority/continuations, enters here. */
const withEquippedArtifact = (
  state: RuntimeState,
  event: Event,
  consume: (compiled: CompiledProgram) => Decision<RuntimeState>,
): Decision<RuntimeState> => {
  const pin = pinnedIdentity(state);
  if (state.artifactIdentity !== null && pin === null)
    return artifactRefused(
      state,
      event,
      "ArtifactIdentityInvalid",
      "invalid stored artifact identity",
    );
  if (pin !== null && state.equippedEventId === null)
    return artifactRefused(
      state,
      event,
      "ArtifactIdentityInvalid",
      "pinned artifact has no equip event reference",
    );
  if (
    state.loadout === null ||
    state.artifactIdentityBlocked ||
    (state.identityEnforcementEventId !== null && pin === null)
  )
    return artifactRefused(
      state,
      event,
      "ArtifactIdentityUnavailable",
      state.loadout === null
        ? "no valid equip"
        : "explicit v2 re-equip required",
    );
  const compiled = compileArtifact(state.loadout, state.compilationEnvironment);
  if (!compiled.ok)
    return artifactRefused(
      state,
      event,
      "ArtifactCompilationRefused",
      "compile diagnostics",
      {
        diagnostics: compiled.diagnostics,
      },
    );
  const drift =
    pin === null ? [] : artifactIdentityDrift(pin, compiled.artifactIdentity);
  if (drift.length > 0)
    return artifactRefused(
      state,
      event,
      "ArtifactIdentityDrift",
      "pinned artifact differs from compilation",
      {
        observed: compiled.artifactIdentity,
        drift,
      },
    );
  return withIdentityTrace(
    consume(compiled.program),
    pin,
    state.equippedEventId,
  );
};

const predicateEnv = (env: KernelEnv): Omit<KernelEnv, "now"> => ({
  rngState: env.rngState,
  predicates: env.predicates,
  ...(env.policy === undefined ? {} : { policy: env.policy }),
});

const presenceDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
  compiled: CompiledProgram,
): Decision<RuntimeState> => {
  const presence = stringField(event.payload, "presence");
  if (presence !== "away" && presence !== "returned")
    return observed(state, event, "invalid-presence");

  const nextState: RuntimeState = {
    ...state,
    presence,
    revocationEvents: [
      ...state.revocationEvents,
      event as unknown as JsonValue,
    ],
  };
  if (presence === "away") {
    const compiledCadence = cadenceFromCompiled(compiled);
    const cadence = compiledCadence.cadence as Cadence.T;
    const evaluated = evaluateCadence(cadence, nextState, env, event);
    if (evaluated.dueAt === null)
      throw new Error("away cadence did not produce a pulse");
    const schedules = [
      {
        scheduleId: compiledCadence.scheduleId,
        cadence,
        eventToEmit: draft(
          "CadencePulse",
          evaluated.dueAt,
          {
            scheduleId: compiledCadence.scheduleId,
          },
          undefined,
          event.eventId,
        ),
        cancelOn: compiledCadence.cancelOn,
      },
      {
        scheduleId: compiledCadence.queuedScheduleId,
        cadence: Cadence.Once(evaluated.dueAt + compiledCadence.queuedDelayMs),
        eventToEmit: draft(
          "CadencePulse",
          evaluated.dueAt + compiledCadence.queuedDelayMs,
          {
            scheduleId: compiledCadence.queuedScheduleId,
          },
          undefined,
          event.eventId,
        ),
        cancelOn: compiledCadence.cancelOn,
      },
    ] as const;
    return {
      state: {
        ...nextState,
        rngState: evaluated.rngState,
        activeScheduleIds: schedules.map((schedule) => schedule.scheduleId),
      },
      intents: [],
      schedules,
      trace: {
        reactorId: "seiri-cadence",
        reactorVersion: "1",
        branchPath: ["away", "scheduled"],
        envInputs: ["operatorPresence", "virtualTime"],
        cadenceEvaluations: [evaluated.trace],
      },
    };
  }

  const workOrder = workOrderFromState(nextState);
  const revoked = authorize(
    inspectIntent(workOrder),
    authorityFromState(state),
    {
      now: env.now,
      actorId: ACTOR,
      workstreamId: WORKSTREAM,
      episodeId: EPISODE,
      decisionIndex: 3,
      intentIndex: 0,
      evidence: [],
      revokedBy: revocationsFromState(nextState),
      state: nextState,
      predicateEnv: predicateEnv(env),
    },
  );
  if (
    revoked.authorized ||
    revoked.refusal.payload.reason !== "authority revoked"
  )
    throw new Error("operator return did not revoke inspect authority");
  return {
    state: nextState,
    intents: [],
    schedules: [],
    trace: revoked.trace,
  };
};

const pulseDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
  compiled: CompiledProgram,
): Decision<RuntimeState> => {
  const scheduleId = stringField(event.payload, "scheduleId");
  const compiledCadence = cadenceFromCompiled(compiled);
  if (scheduleId === compiledCadence.scheduleId) {
    const workOrder = compiled.workOrder;
    return {
      ...observed(
        {
          ...state,
          pulseSeen: true,
          workOrder: workOrder as unknown as JsonValue,
        },
        event,
        "work-order-ready",
      ),
      continuation: Program.Emit(
        draft(
          "WorkOrderEmitted",
          event.occurredAt,
          { workOrder: workOrder as unknown as JsonValue },
          event.eventId,
          event.eventId,
        ),
        Program.Done(),
      ),
    };
  }
  if (scheduleId !== compiledCadence.queuedScheduleId) {
    if (
      state.identityEnforcementEventId === null &&
      state.artifactIdentity === null
    )
      return observed(state, event, "unknown-schedule");
    return artifactRefused(
      state,
      event,
      "UnknownScheduleRefused",
      `unknown schedule: ${scheduleId ?? "unavailable"}`,
    );
  }

  const activationCondition = compiled.statechartGuards[0]?.activationCondition;
  if (activationCondition === undefined)
    throw new Error("compiled loadout lacks an activation guard");
  const guarded = guardQueuedPulse(state, event, env, activationCondition, [
    compiledCadence.scheduleId,
    compiledCadence.queuedScheduleId,
  ]);
  return {
    state: {
      ...state,
      cancelledScheduleIds: guarded.cancelledScheduleIds,
    },
    intents: guarded.intents,
    schedules: guarded.schedules,
    trace: guarded.trace,
  };
};

const workOrderDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
  compiled: CompiledProgram,
): Decision<RuntimeState> => {
  const workOrder = workOrderFromValue(
    asObject(event.payload)?.["workOrder"] ?? null,
  );
  const verification = compiled.verificationPlan.find(
    (episode) => episode.required,
  );
  if (verification === undefined)
    throw new Error("compiled loadout lacks a required verification episode");
  const program = verificationProgram(
    workOrder,
    event.occurredAt,
    verification.subject,
  );
  const programDecision = decideProgram(program, state, env);
  const continuation = requiredContinuation(programDecision);
  const inspect = programDecision.intents[0];
  if (inspect?.kind !== "Act")
    throw new Error("verification program did not produce an inspect intent");
  const granted = authorize(inspect, authorityFromState(state), {
    now: env.now,
    actorId: ACTOR,
    workstreamId: WORKSTREAM,
    episodeId: EPISODE,
    decisionIndex: 1,
    intentIndex: 0,
    evidence: [],
    revokedBy: revocationsFromState(state),
    state,
    predicateEnv: predicateEnv(env),
  });
  if (!granted.authorized)
    throw new Error(
      `inspection authorization failed: ${granted.refusal.payload.reason}`,
    );
  return {
    state: {
      ...state,
      workOrder: workOrder as unknown as JsonValue,
      authority: granted.authority as unknown as JsonValue,
      pendingCommand: granted.command as unknown as JsonValue,
      program: continuation as unknown as JsonValue,
    },
    intents: programDecision.intents,
    continuation,
    schedules: programDecision.schedules,
    trace: granted.trace,
  };
};

const deletionDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
): Decision<RuntimeState> => {
  const effect = stringField(event.payload, "effect") ?? "";
  const paths = stringArrayField(event.payload, "paths");
  const evidence = state.candidates.flatMap((candidate) => candidate.evidence);
  const deletion: ActIntent = { kind: "Act", effect, payload: { paths } };
  const refused = authorize(deletion, authorityFromState(state), {
    now: env.now,
    actorId: ACTOR,
    workstreamId: WORKSTREAM,
    episodeId: EPISODE,
    decisionIndex: 2,
    intentIndex: 0,
    evidence,
    revokedBy: revocationsFromState(state),
    state,
    predicateEnv: predicateEnv(env),
  });
  if (refused.authorized) throw new Error("deletion unexpectedly authorized");
  return {
    state: {
      ...state,
      authorizationEvidence: evidence,
      deletionPaths: paths,
      refusalReason: refused.refusal.payload.reason,
    },
    intents: [],
    continuation: Program.Emit(
      linkedDraft(refused.refusal, expectedInspectCommandId, event.eventId),
      Program.Done(),
    ),
    schedules: [],
    trace: refused.trace,
  };
};

const episodeDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
): Decision<RuntimeState> => {
  const result = eventFromState(state.commandResult, "CommandResult");
  const continued = decideProgram(
    programFromState(state),
    state,
    { ...env, now: result.occurredAt },
    result,
  );
  const continuation = requiredContinuation(continued);
  if (continuation.kind !== "Emit")
    throw new Error("verification continuation did not emit a request");
  const linkedContinuation = Program.Emit(
    linkedDraft(continuation.event, expectedInspectCommandId, event.eventId),
    continuation.next,
  );
  return {
    state: {
      ...state,
      program: linkedContinuation as unknown as JsonValue,
    },
    intents: continued.intents,
    continuation: linkedContinuation,
    schedules: continued.schedules,
    trace: continued.trace,
  };
};

const beaconSweepDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
): Decision<RuntimeState> => {
  const request = event.payload as unknown as BeaconSweepRequest & {
    decisionIndex: number;
  };
  if (
    request.intent?.kind !== "Observe" ||
    request.intent.subject !== "control-beacons" ||
    !["public", "verifier"].includes(request.audience) ||
    !Number.isSafeInteger(request.staleAfterMs) ||
    request.staleAfterMs < 0 ||
    !Number.isSafeInteger(request.decisionIndex) ||
    request.decisionIndex < 0
  )
    throw new Error("invalid Beacon sweep request");
  const effect: ActIntent = {
    kind: "Act",
    effect: `observe.beacons.${request.audience}`,
    resource: "beaconSweeps",
    payload: { subject: request.intent.subject, audience: request.audience },
  };
  // Observation values are deliberately absent from this authority context.
  const authorization = authorize(effect, request.authority, {
    now: env.now,
    actorId: event.actorId,
    workstreamId: event.workstreamId,
    ...(event.episodeId ? { episodeId: event.episodeId } : {}),
    decisionIndex: request.decisionIndex,
    intentIndex: 0,
    evidence: request.evidence,
    revokedBy: request.revokedBy,
    state: { presence: state.presence, policy: state.policy },
    predicateEnv: predicateEnv(env),
  });
  return {
    state: {
      ...state,
      beaconSweep: {
        requestEventId: event.eventId,
        staleAfterMs: request.staleAfterMs,
        authorization: authorization as unknown as JsonValue,
      },
    },
    intents: authorization.authorized ? [request.intent] : [],
    schedules: [],
    trace: authorization.trace,
  };
};

const beaconObservedDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
): Decision<RuntimeState> => {
  const payload = event.payload as unknown as {
    sweptAt: number;
    observations: readonly SignalObservation[];
    commandId: string;
  };
  const sweep = state.beaconSweep as unknown as {
    staleAfterMs: number;
    authorization: { authorized: boolean; command?: Command };
  } | null;
  if (
    !sweep?.authorization.authorized ||
    payload.commandId !== sweep.authorization.command?.commandId ||
    payload.sweptAt !== event.occurredAt ||
    payload.sweptAt !== env.now ||
    !Array.isArray(payload.observations)
  )
    throw new Error("BeaconObserved lacks its authorized sweep or event time");
  const cadenceEvaluations: string[] = [];
  const observations = payload.observations.map((observation): JudgedBeacon => {
    // Persist decoded perception, but bind it to the captured size on replay.
    const decoded =
      observation.size === null
        ? { status: "absent" }
        : decodeSignalSize(BigInt(observation.size));
    if (canonicalStringify(decoded) !== canonicalStringify(observation.decoded))
      throw new Error(
        "BeaconObserved decoded fields differ from captured metadata",
      );
    let age = beaconAge(observation, env.now, sweep.staleAfterMs);
    if (age === "fresh" || age === "stale") {
      // The kernel clock is integer milliseconds: round the captured origin up
      // so a sub-ms remainder cannot fire the After cadence prematurely.
      const origin =
        observation.mtimeNs == null
          ? observation.mtimeMs!
          : Number((BigInt(observation.mtimeNs) + 999999n) / 1000000n);
      const evaluated = evaluateCadence(
        Cadence.After(sweep.staleAfterMs),
        state,
        { ...env, now: origin },
        event,
      );
      cadenceEvaluations.push(evaluated.trace);
      age =
        evaluated.dueAt !== null && env.now >= evaluated.dueAt
          ? "stale"
          : "fresh";
    }
    return { ...observation, age };
  });
  return {
    state: { ...state, beaconObservations: observations },
    intents: [],
    schedules: [],
    trace: {
      reactorId: "beacon-observer",
      reactorVersion: "1",
      branchPath: ["BeaconObserved", ...observations.map(({ age }) => age)],
      envInputs: ["event.payload.observations", "event.occurredAt"],
      cadenceEvaluations,
    },
  };
};

const react = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
  compiled?: CompiledProgram,
): Decision<RuntimeState> => {
  switch (event.type) {
    case "BeaconSweepRequested":
      return beaconSweepDecision(state, event, env);
    case "BeaconObserved":
      return beaconObservedDecision(state, event, env);
    case "InspectionTaskCreated":
      return observed(state, event, "task-opened");
    case "OperatorPresenceChanged":
      return presenceDecision(state, event, env, compiled!);
    case "CadencePulse":
      return pulseDecision(state, event, env, compiled!);
    case "WorkOrderEmitted":
      return workOrderDecision(state, event, env, compiled!);
    case "CommandRedispatchRequested":
      if (
        stringField(event.payload, "commandId") === undefined ||
        stringField(event.payload, "commandId") !==
          stringField(state.pendingCommand, "commandId")
      )
        return artifactRefused(
          state,
          event,
          "ArtifactIdentityInvalid",
          "recovery request does not name the stored command",
        );
      return observed(state, event, "redispatch-ready");
    case "CommandPersisted": {
      const command = asObject(event.payload)?.["command"] ?? null;
      const effect =
        command === null
          ? undefined
          : stringField(asObject(command)?.["intent"] ?? null, "effect");
      if (effect?.startsWith("observe.beacons."))
        return observed(state, event, "beacon-sweep-durable");
      return observed(
        {
          ...state,
          pendingCommand: command,
          persistedEffect: effect ?? null,
        },
        event,
        "command-durable",
      );
    }
    case "CommandRedispatched": {
      const commandId = stringField(event.payload, "commandId");
      return observed(
        {
          ...state,
          redispatchedCommandIds:
            commandId === undefined
              ? state.redispatchedCommandIds
              : [...state.redispatchedCommandIds, commandId],
        },
        event,
        "command-redispatched",
      );
    }
    case "CommandResult": {
      if (event.workstreamId === "ws_beacon_control")
        return observed(state, event, "beacon-sweep-returned");
      const candidates = candidatesField(event.payload);
      const deletion: ActIntent = {
        kind: "Act",
        effect: "repo.delete",
        payload: { paths: candidates.map((candidate) => candidate.path) },
      };
      return {
        state: {
          ...state,
          candidates,
          commandResult: event as unknown as JsonValue,
          inspectionCompleted: true,
          deletionPaths: candidates.map((candidate) => candidate.path),
        },
        intents: [deletion],
        schedules: [],
        trace: {
          reactorId: "seiri-reactor",
          reactorVersion: "1",
          branchPath: ["CommandResult", "deletion-proposed"],
          envInputs: ["event.payload.candidates"],
          cadenceEvaluations: [],
        },
      };
    }
    case "DeletionAttempted":
      return deletionDecision(state, event, env);
    case "CommandRefused":
      if (event.workstreamId === "ws_beacon_control")
        return observed(state, event, "beacon-sweep-refused");
      return {
        ...observed(
          {
            ...state,
            deletionRefused: true,
            refusalReason: stringField(event.payload, "reason") ?? null,
          },
          event,
          "episode-terminating",
        ),
        continuation: Program.Emit(
          draft(
            "EpisodeTerminated",
            event.occurredAt + 1,
            {
              continuation: "verification",
            },
            expectedInspectCommandId,
            event.eventId,
          ),
          Program.Done(),
        ),
      };
    case "EpisodeTerminated":
      return episodeDecision(state, event, env);
    case "VerificationRequested":
      return {
        ...observed(state, event, "verification-dispatched"),
        intents: [{ kind: "Observe", subject: "candidates" }],
      };
    case "VerificationCompleted":
      return observed(
        {
          ...state,
          verified: asObject(event.payload)?.["accepted"] === true,
          verificationCompleted: true,
        },
        event,
        "verification-folded",
      );
    case "QueuedPulseNoOp":
      return observed(
        {
          ...state,
          queuedPulseNoOp: true,
          noOpEvidence: stringArrayField(event.payload, "evidence"),
        },
        event,
        "no-op-folded",
      );
    case "SchedulesCancelled":
      return observed(
        {
          ...state,
          cancelledScheduleIds: stringArrayField(event.payload, "scheduleIds"),
          activeScheduleIds: stringArrayField(
            event.payload,
            "activeScheduleIds",
          ),
        },
        event,
        "cancellation-folded",
      );
    default:
      return observed(state, event);
  }
};

export const seiriReactor: Reactor<RuntimeState> = (state, event, env) => {
  if (event.type === "ArtifactIdentityEnforcementStarted") {
    if (canonicalStringify(event.payload) !== '{"payloadVersion":1}')
      return artifactRefused(
        state,
        event,
        "ArtifactIdentityInvalid",
        "invalid enforcement boundary",
      );
    if (state.identityEnforcementEventId !== null)
      return observed(state, event, "already-enforced");
    return observed(
      {
        ...state,
        identityEnforcementEventId: event.eventId,
        ...(pinnedIdentity(state) === null
          ? { authority: null, pendingCommand: null, program: null }
          : {}),
      },
      event,
      "enforcement-started",
    );
  }
  if (event.type === "LoadoutEquipped") return equipDecision(state, event);
  if (isArtifactRefusalType(event.type))
    return observed(
      event.type === "UnknownScheduleRefused"
        ? state
        : {
            ...state,
            artifactIdentityBlocked: true,
            authority: null,
            pendingCommand: null,
            program: null,
            activeScheduleIds: [],
          },
      event,
      "refusal-recorded",
    );
  // Beacon authority is supplied by its explicit host request, not this loadout.
  const beaconResult =
    event.workstreamId === "ws_beacon_control" &&
    (event.type === "CommandResult" || event.type === "CommandRefused");
  const consumesProgram =
    !beaconResult &&
    [
      "OperatorPresenceChanged",
      "CadencePulse",
      "WorkOrderEmitted",
      "CommandResult",
      "DeletionAttempted",
      "CommandRefused",
      "EpisodeTerminated",
      "VerificationRequested",
      "CommandRedispatchRequested",
    ].includes(event.type);
  return consumesProgram
    ? withEquippedArtifact(state, event, (compiled) =>
        react(state, event, env, compiled),
      )
    : react(state, event, env);
};

export const expectedInspectCommandId = commandId(WORKSTREAM, EPISODE, 1, 0);
