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

export const MINUTE = 60_000;
export const WORKSTREAM = "ws_repo_garden";
export const EPISODE = "ep_seiri_1";
export const ACTOR = "repo-gardener";
export const PULSE_SCHEDULE = "schedule_seiri_20m";
export const QUEUED_PULSE = "schedule_seiri_already_queued";

export type Candidate = Readonly<{
  path: string;
  classification: string;
  evidence: readonly string[];
}>;

export type Loadout = Readonly<{
  identity: "Repo Gardener";
  activeMechanic: "Seiri";
  semantics: readonly string[];
  normative: false;
}>;

type RuntimePolicy = Readonly<{ maintenance: string }>;

export type RuntimeState = Readonly<{
  presence: "away" | "returned";
  rngState: number;
  policy: RuntimePolicy;
  loadout: JsonValue;
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
}>;

export const loadout: Loadout = {
  identity: "Repo Gardener",
  activeMechanic: "Seiri",
  normative: false,
  semantics: [
    "inventory",
    "classify",
    "analyze references",
    "propose deletion candidates",
    "attach evidence",
    "never delete",
  ],
};

const presenceRef = { registryId: "operator.away", version: 1 } as const;
const returnedRef = { registryId: "operator.returned", version: 1 } as const;
const returnRevocationRef = {
  registryId: "operator.return-event",
  version: 1,
} as const;

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

const cadence = Cadence.Until(
  Cadence.Gate(Cadence.Every(20 * MINUTE), presenceRef),
  returnedRef,
);

export function compileWorkOrder(
  equipped: Loadout,
  baseCommit = "fixture-base",
): WorkOrder {
  if (
    equipped.identity !== "Repo Gardener" ||
    equipped.activeMechanic !== "Seiri" ||
    !equipped.semantics.includes("never delete")
  )
    throw new Error("unsupported loadout");
  return {
    workOrderId: "wo_repo_inspection_1",
    objective:
      "Inspect the bounded fixture repository and propose safe deletion candidates.",
    acceptanceCriteria: [
      "Inventory every fixture path",
      "Classify every path",
      "Attach reference evidence to every candidate",
    ],
    knownFacts: [
      "The repository is a deterministic fixture",
      "The operator is absent at dispatch",
    ],
    decisions: [
      `${equipped.identity} uses ${equipped.activeMechanic}`,
      "Deletion remains operator-owned",
    ],
    constraints: [
      "Inspect only the fixture tree",
      "Do not mutate repository contents",
    ],
    nonGoals: ["Delete files", "Inspect another repository"],
    repo: "packages/skeleton/fixtures/repo-tree.json",
    baseCommit,
    allowedOperations: [
      "repo.inventory",
      "repo.classify",
      "repo.references",
      "repo.proposeDeletion",
    ],
    prohibitedOperations: ["repo.delete", "repo.write"],
    requiredEvidence: ["inventory", "classification", "reference-analysis"],
    outputContract: {
      type: "CommandResult",
      result: "candidates",
      candidateFields: ["path", "classification", "evidence"],
    },
  };
}

const authority = (): AuthorityEnvelope => ({
  authorityEnvelopeId: "auth_seiri",
  allowedEffects: ["repo.inspect"],
  deniedEffects: ["repo.delete", "repo.write"],
  resourceLimits: { inspections: 1 },
  requiredEvidence: [],
  expiresAt: 40 * MINUTE,
  revocationEventTypes: [],
  revocationConditions: [returnRevocationRef],
});

export const initialState = (): RuntimeState => ({
  presence: "returned",
  rngState: 17,
  policy: { maintenance: "absent-only" },
  loadout: null,
  workOrder: null,
  candidates: [],
  verified: false,
  verificationCompleted: false,
  pulseSeen: false,
  inspectionCompleted: false,
  deletionRefused: false,
  queuedPulseNoOp: false,
  authority: authority() as unknown as JsonValue,
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

const loadoutFromValue = (value: JsonValue): Loadout => {
  if (value === null) throw new Error("runtime state lacks equipped loadout");
  return value as unknown as Loadout;
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

const verificationProgram = (workOrder: WorkOrder, at: number): Program.T => {
  const inspect = inspectIntent(workOrder);
  const id = commandId(WORKSTREAM, EPISODE, 1, 0);
  return Program.Invoke(id, inspect, {
    candidates: Program.Emit(
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

const predicateEnv = (env: KernelEnv): Omit<KernelEnv, "now"> => ({
  rngState: env.rngState,
  predicates: env.predicates,
  ...(env.policy === undefined ? {} : { policy: env.policy }),
});

const presenceDecision = (
  state: RuntimeState,
  event: Event,
  env: KernelEnv,
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
    const evaluated = evaluateCadence(cadence, nextState, env, event);
    if (evaluated.dueAt === null)
      throw new Error("away cadence did not produce a pulse");
    const schedules = [
      {
        scheduleId: PULSE_SCHEDULE,
        cadence,
        eventToEmit: draft(
          "CadencePulse",
          evaluated.dueAt,
          {
            scheduleId: PULSE_SCHEDULE,
          },
          undefined,
          event.eventId,
        ),
        cancelOn: [returnedRef],
      },
      {
        scheduleId: QUEUED_PULSE,
        cadence: Cadence.Once(evaluated.dueAt + 7),
        eventToEmit: draft(
          "CadencePulse",
          evaluated.dueAt + 7,
          {
            scheduleId: QUEUED_PULSE,
          },
          undefined,
          event.eventId,
        ),
        cancelOn: [returnedRef],
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
): Decision<RuntimeState> => {
  const scheduleId = stringField(event.payload, "scheduleId");
  if (scheduleId === PULSE_SCHEDULE) {
    const workOrder = compileWorkOrder(loadoutFromValue(state.loadout));
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
  if (scheduleId !== QUEUED_PULSE)
    return observed(state, event, "unknown-schedule");

  const guarded = guardQueuedPulse(state, event, env, presenceRef, [
    PULSE_SCHEDULE,
    QUEUED_PULSE,
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
): Decision<RuntimeState> => {
  const workOrder = workOrderFromValue(
    asObject(event.payload)?.["workOrder"] ?? null,
  );
  const program = verificationProgram(workOrder, event.occurredAt);
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

export const seiriReactor: Reactor<RuntimeState> = (state, event, env) => {
  switch (event.type) {
    case "InspectionTaskCreated":
      return observed(state, event, "task-opened");
    case "LoadoutEquipped":
      return observed({ ...state, loadout: event.payload }, event, "equipped");
    case "OperatorPresenceChanged":
      return presenceDecision(state, event, env);
    case "CadencePulse":
      return pulseDecision(state, event, env);
    case "WorkOrderEmitted":
      return workOrderDecision(state, event, env);
    case "CommandPersisted": {
      const command = asObject(event.payload)?.["command"] ?? null;
      const effect =
        command === null
          ? undefined
          : stringField(asObject(command)?.["intent"] ?? null, "effect");
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

export const expectedInspectCommandId = commandId(WORKSTREAM, EPISODE, 1, 0);
