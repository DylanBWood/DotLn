import {
  canonicalStringify,
  compileLoadout,
  requireCompiled,
  type CompilationEnvironment,
  type CompiledPresencePolicy,
  type LoadoutGraph,
} from "@dotln/compiler";
import {
  authorize,
  commandId,
  type Event,
  type PredicateRegistry,
} from "@dotln/kernel";
import {
  assertActorResult,
  scriptResultVerified,
  assertActorSpec,
  type ActorSpec,
} from "./actor-contract.js";
import {
  PresenceMachine,
  presencePredicates,
  type PresenceSnapshot,
} from "./presence-machine.js";
import {
  decodePresenceObservation,
  presenceActorKey,
} from "./presence-signals.js";
import { assertHandoffPacket, type HandoffPacket } from "./handoff-contract.js";
import { isWriterRequest } from "./worker-protocol.js";

export interface ResidentConfiguration {
  graph: LoadoutGraph;
  environment: CompilationEnvironment;
  policyId: string;
  actors: Record<string, ActorSpec>;
  evidence: string[];
  heartbeatBudgetMs?: number;
}
export interface ResidentState {
  configuration: ResidentConfiguration | null;
  policy: CompiledPresencePolicy | null;
  machine: PresenceSnapshot | null;
  at: number;
  present: boolean;
  episodes: Record<string, "dispatched" | "observed" | "lost">;
  episodePhases: Record<string, string>;
  episodeGenerations: Record<string, number>;
  revokedBy: Event[];
  lastNoOp: string | null;
  lastHumanAt: number | null;
  actors: Record<
    string,
    {
      lastHeartbeatAt: number;
      status: "live" | "stalled" | "stopped";
      failureAt?: number;
      episodeId?: string;
    }
  >;
  progress: Record<string, number>;
  handoffs: Record<
    string,
    {
      packet: HandoffPacket;
      phaseId: string;
      generation: number;
      answer?: string;
    }
  >;
}
export function decodeResidentConfiguration(
  value: unknown,
): ResidentConfiguration {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid resident configuration");
  const v = value as ResidentConfiguration;
  if (
    Object.keys(v).some(
      (key) =>
        ![
          "graph",
          "environment",
          "policyId",
          "actors",
          "evidence",
          "heartbeatBudgetMs",
        ].includes(key),
    ) ||
    typeof v.policyId !== "string" ||
    !v.actors ||
    typeof v.actors !== "object" ||
    Array.isArray(v.actors) ||
    !Array.isArray(v.evidence) ||
    v.evidence.some((item) => typeof item !== "string")
  )
    throw new Error("invalid resident configuration fields");
  if (
    v.heartbeatBudgetMs !== undefined &&
    (!Number.isSafeInteger(v.heartbeatBudgetMs) || v.heartbeatBudgetMs < 1)
  )
    throw new Error("invalid resident heartbeat budget");
  const program = requireCompiled(compileLoadout(v.graph, v.environment));
  const policy = program.presence?.find((p) => p.policyId === v.policyId);
  if (!policy) throw new Error("resident policy is not compiled");
  if (Object.keys(v.actors).length !== policy.phases.length)
    throw new Error("resident requires one actor per phase");
  for (const phase of policy.phases) {
    if (!Object.hasOwn(v.actors, phase.phaseId))
      throw new Error("resident phase actor is missing");
    assertActorSpec(v.actors[phase.phaseId]);
  }
  return structuredClone(v);
}
export const emptyResidentState = (): ResidentState => ({
  configuration: null,
  policy: null,
  machine: null,
  at: 0,
  present: true,
  episodes: {},
  episodePhases: {},
  episodeGenerations: {},
  revokedBy: [],
  lastNoOp: null,
  lastHumanAt: null,
  actors: {},
  progress: {},
  handoffs: {},
});
export function residentMachine(
  state: ResidentState,
  predicates: PredicateRegistry = {},
) {
  if (!state.policy || !state.machine)
    throw new Error("resident is not configured");
  return new PresenceMachine(
    state.policy,
    { ...predicates, ...presencePredicates },
    state.machine,
  );
}
export function residentEpisodeId(
  machine: PresenceMachine,
  dueAt: number,
): string {
  return commandId(
    "resident",
    canonicalStringify([
      machine.compiled.policyId,
      machine.state,
      machine.phase()!.cadence,
      dueAt,
      machine.generation,
    ]),
    0,
    0,
  ).replace("cmd_", "script_");
}
export const residentEventTypes = [
  "ResidentConfigured",
  "ClockSampled",
  "ScriptEpisodeDispatched",
  "ScriptEpisodeObserved",
  "ScriptEpisodeLost",
  "ScriptEpisodeRefused",
  "ActorUnavailable",
  "OperatorPresenceObserved",
  "HandoffRequested",
  "HandoffAnswered",
  "CliWorkerObserved",
] as const;

function expireActorHeartbeats(state: ResidentState) {
  const budget = state.configuration?.heartbeatBudgetMs ?? 30000;
  for (const actor of Object.values(state.actors)) {
    if (actor.status === "live" && state.at - actor.lastHeartbeatAt >= budget) {
      actor.status = "stalled";
      actor.failureAt = actor.lastHeartbeatAt + budget;
    }
  }
}

export function residentRefusal(
  state: ResidentState,
  machine: PresenceMachine,
): string | null {
  const phase = machine.phase()!;
  const spec = state.configuration!.actors[phase.phaseId]!;
  const orderId =
    spec.worker?.request.workOrder.workOrderId ?? spec.handoff?.workOrderId;
  if (
    orderId &&
    Object.values(state.handoffs).some(
      (h) => h.packet.workOrderId === orderId && h.answer === undefined,
    )
  )
    return "work order is waiting for a human handoff answer";
  if (!phase.scope.surfaces.includes(spec.surface))
    return "actor surface is outside phase scope";
  const limits: Record<string, number> = { ...phase.scope.budget };
  for (const [resource, amount] of Object.entries(phase.scope.changeSize))
    limits[resource] = Math.min(limits[resource] ?? Infinity, amount);
  if (
    Object.keys(limits).some((key) => !Object.hasOwn(spec.resources, key)) ||
    Object.entries(spec.resources).some(
      ([resource, amount]) =>
        amount > (limits[resource] ?? 0) ||
        amount >
          (Object.hasOwn(phase.effectiveEnvelope.resourceLimits, resource)
            ? phase.effectiveEnvelope.resourceLimits[resource]!
            : 0),
    )
  )
    return "actor resource reservation exceeds phase scope or authority budget";
  const authorization = authorize(
    { kind: "Act", effect: spec.effect, payload: {} },
    phase.effectiveEnvelope,
    {
      now: state.at,
      actorId: spec.kind,
      workstreamId: "resident",
      decisionIndex: 0,
      intentIndex: 0,
      evidence: state.configuration!.evidence,
      revokedBy: state.revokedBy,
      state: machine.projected(),
      predicateEnv: { rngState: 0, predicates: machine.predicates },
    },
  );
  if (spec.worker) {
    const request = spec.worker.request;
    const envelope = phase.effectiveEnvelope;
    const effects = [...request.workOrder.allowedOperations];
    if (isWriterRequest(request)) {
      const authority = request.authorityEnvelope;
      if (
        authority.expiresAt > envelope.expiresAt ||
        Object.entries(authority.resourceLimits).some(
          ([key, amount]) => amount > (spec.resources[key] ?? 0),
        ) ||
        envelope.requiredEvidence.some(
          (e) => !authority.requiredEvidence.includes(e),
        ) ||
        envelope.revocationEventTypes.some(
          (e) => !authority.revocationEventTypes.includes(e),
        ) ||
        authority.revocationEventTypes.some(
          (e) => !envelope.revocationEventTypes.includes(e),
        ) ||
        (authority.revocationConditions?.length ?? 0) > 0 ||
        (envelope.revocationConditions?.length ?? 0) > 0
      )
        return "worker authority exceeds or cannot represent the resident phase";
      effects.push(
        ...authority.allowedEffects.filter((e) => !effects.includes(e)),
      );
    }
    for (const effect of effects) {
      for (const candidate of isWriterRequest(request)
        ? [envelope, request.authorityEnvelope]
        : [envelope]) {
        const check = authorize(
          { kind: "Act", effect, payload: {} },
          candidate,
          {
            now: state.at,
            actorId: spec.kind,
            workstreamId: "resident",
            decisionIndex: 0,
            intentIndex: 0,
            evidence: state.configuration!.evidence,
            revokedBy: state.revokedBy,
            state: machine.projected(),
            predicateEnv: { rngState: 0, predicates: machine.predicates },
          },
        );
        if (!check.authorized)
          return "worker operations exceed the resident phase authority";
      }
    }
  }
  return authorization.authorized ? null : authorization.refusal.payload.reason;
}

export function foldResidentEvent(
  previous: ResidentState | undefined,
  event: Event,
  predicates: PredicateRegistry,
): ResidentState {
  const state = structuredClone({ ...emptyResidentState(), ...previous });
  const payload = event.payload as Record<string, unknown>;
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    throw new Error("invalid resident event payload");
  if (event.type === "ResidentConfigured") {
    const configuration = decodeResidentConfiguration(payload["configuration"]);
    if (state.configuration) {
      if (
        canonicalStringify(configuration) !==
        canonicalStringify(state.configuration)
      )
        throw new Error("resident configuration changed within a store");
      return state;
    }
    state.configuration = configuration;
    state.policy = requireCompiled(
      compileLoadout(configuration.graph, configuration.environment),
    ).presence!.find((p) => p.policyId === configuration.policyId)!;
    const machine = new PresenceMachine(state.policy);
    if (!state.present) machine.absence(state.at);
    state.machine = machine.snapshot();
    return state;
  }
  if (event.type === "ClockSampled") {
    const at = payload["at"];
    if (
      typeof at !== "number" ||
      !Number.isFinite(at) ||
      at < 0 ||
      at !== event.occurredAt
    )
      throw new Error("invalid recorded clock sample");
    state.at = Math.max(state.at, at); // A backwards wall clock cannot replenish a phase.
    expireActorHeartbeats(state);
  }
  let humanChanged = false;
  if (event.type === "OperatorPresenceObserved") {
    const observation = decodePresenceObservation(payload);
    if (observation.at !== event.occurredAt)
      throw new Error("presence time differs from event");
    state.at = Math.max(state.at, observation.at);
    // A late heartbeat cannot hide a deadline crossed before its arrival.
    expireActorHeartbeats(state);
    const { signal, origin, stamp } = observation;
    if (
      origin === "human" &&
      observation.at >= state.at &&
      observation.at >= (state.lastHumanAt ?? 0)
    ) {
      state.lastHumanAt = observation.at;
      state.present = signal.kind !== "away";
      humanChanged = true;
    }
    if (origin === "actor" && signal.kind === "heartbeat") {
      const key = presenceActorKey(signal, stamp);
      const old = state.actors[key];
      // A late heartbeat cannot resurrect a completed/lost resident episode.
      if (
        observation.at >= state.at &&
        (!stamp ||
          !["observed", "lost"].includes(
            state.episodes[stamp.episodeId] ?? "",
          )) &&
        (!old || observation.at >= old.lastHeartbeatAt)
      ) {
        state.actors[key] = {
          lastHeartbeatAt: observation.at,
          status: "live",
          ...(stamp ? { episodeId: stamp.episodeId } : {}),
          ...(old?.failureAt === undefined ? {} : { failureAt: old.failureAt }),
        };
      }
    }
    if (origin === "task" && signal.kind === "progress")
      state.progress = {
        ...state.progress,
        [signal.taskId]: Math.max(
          Object.hasOwn(state.progress, signal.taskId)
            ? state.progress[signal.taskId]!
            : 0,
          observation.at,
        ),
      };
  }
  if (event.type === "OperatorPresenceChanged") {
    if (
      typeof payload["presence"] !== "string" ||
      !["away", "returned"].includes(payload["presence"])
    )
      throw new Error("invalid resident presence");
    state.present = payload["presence"] === "returned";
    state.lastHumanAt = state.at;
    humanChanged = true;
  }
  if (
    event.type === "ClockSampled" &&
    state.present &&
    state.lastHumanAt !== null &&
    state.policy?.humanIdleMs !== undefined &&
    state.at - state.lastHumanAt >= state.policy.humanIdleMs
  ) {
    state.present = false;
    humanChanged = true;
  }
  if (!state.machine) {
    if (
      ![
        "ClockSampled",
        "OperatorPresenceChanged",
        "OperatorPresenceObserved",
      ].includes(event.type)
    )
      throw new Error("resident event precedes configuration");
    return state;
  }
  const machine = residentMachine(state, predicates);
  machine.now = state.at;
  if (humanChanged) {
    if (state.present) machine.returned();
    else machine.absence();
  }
  if (event.type === "ClockSampled") machine.transition("idle-expired");
  if (
    state.policy!.phases.some(
      (phase) =>
        phase.effectiveEnvelope.revocationEventTypes.includes(event.type) ||
        phase.effectiveEnvelope.revocationConditions?.length,
    )
  )
    state.revokedBy.push(event);
  if (event.type === "ScriptEpisodeDispatched") {
    const dueAt = machine.due(state.at);
    const id = payload["episodeId"];
    const phase = machine.phase();
    const spec = phase ? state.configuration!.actors[phase.phaseId]! : null;
    if (
      typeof id !== "string" ||
      dueAt === null ||
      id !== residentEpisodeId(machine, dueAt) ||
      Object.hasOwn(state.episodes, id) ||
      payload["dueAt"] !== dueAt ||
      payload["phaseId"] !== phase!.phaseId ||
      payload["kind"] !== spec!.kind ||
      payload["effect"] !== spec!.effect ||
      payload["authorityEnvelopeId"] !==
        phase!.effectiveEnvelope.authorityEnvelopeId ||
      residentRefusal(state, machine)
    )
      throw new Error("invalid or repeated resident dispatch");
    state.episodes[id] = "dispatched";
    state.episodePhases[id] = phase!.phaseId;
    state.episodeGenerations[id] = machine.generation;
    state.actors[`episode:${id}`] = {
      lastHeartbeatAt: state.at,
      status: "live",
      episodeId: id,
    };
    machine.dispatch(id);
    state.lastNoOp = null;
  }
  if (event.type === "HandoffRequested") {
    const packet = payload["packet"];
    assertHandoffPacket(packet);
    const id = packet.episodeId;
    const phaseId = state.episodePhases[id];
    const spec = phaseId ? state.configuration!.actors[phaseId] : undefined;
    if (
      state.episodes[id] !== "dispatched" ||
      !spec?.handoff ||
      canonicalStringify(packet) !==
        canonicalStringify({ ...spec.handoff, episodeId: id }) ||
      Object.values(state.handoffs).some(
        (h) =>
          h.packet.workOrderId === packet.workOrderId && h.answer === undefined,
      )
    )
      throw new Error("invalid or repeated handoff request");
    state.handoffs[id] = {
      packet,
      phaseId: phaseId!,
      generation: state.episodeGenerations[id]!,
    };
    state.episodes[id] = "observed";
    state.actors[`episode:${id}`]!.status = "stopped";
    // Waiting is durable state, not a live actor or an occupied process slot.
    machine.waitForInput(id);
  }
  if (event.type === "HandoffAnswered") {
    const id = payload["episodeId"];
    const handoff = typeof id === "string" ? state.handoffs[id] : undefined;
    const option = payload["optionId"];
    if (
      event.actorId !== "operator" ||
      payload["origin"] !== "human" ||
      !handoff ||
      handoff.answer !== undefined ||
      payload["workOrderId"] !== handoff.packet.workOrderId ||
      typeof option !== "string" ||
      !handoff.packet.options.some((o) => o.id === option)
    )
      throw new Error("invalid, stale or repeated human handoff answer");
    handoff.answer = option;
    state.at = Math.max(state.at, event.occurredAt);
    machine.now = state.at;
    machine.transition("idle-expired");
    if (
      !machine.present &&
      !machine.current &&
      machine.state === handoff.phaseId &&
      machine.generation === handoff.generation
    ) {
      machine.dispatch(handoff.packet.episodeId);
      machine.outcome("verified-success", handoff.packet.episodeId);
    }
    state.lastNoOp = null;
  }
  if (
    [
      "ScriptEpisodeObserved",
      "CliWorkerObserved",
      "ScriptEpisodeLost",
    ].includes(event.type)
  ) {
    const id = payload["episodeId"];
    if (typeof id !== "string" || state.episodes[id] !== "dispatched")
      throw new Error("resident outcome has no pending dispatch");
    const lost = event.type === "ScriptEpisodeLost";
    if (lost && (typeof payload["reason"] !== "string" || !payload["reason"]))
      throw new Error("lost episode needs a reason");
    if (!lost) {
      assertActorResult(payload);
      const spec = state.configuration!.actors[state.episodePhases[id]!]!;
      if ((event.type === "CliWorkerObserved") !== (spec.kind === "cli-worker"))
        throw new Error("actor observation kind differs from dispatch");
      const verified = scriptResultVerified(spec, payload, id);
      if (payload.verified !== verified)
        throw new Error("script verification contradicts recorded output");
    }
    state.episodes[id] = lost ? "lost" : "observed";
    const actor = state.actors[`episode:${id}`];
    if (actor) actor.status = "stopped";
    machine.outcome(
      !lost && payload["verified"] === true ? "verified-success" : "failure",
      id,
    );
  }
  if (["ActorUnavailable", "ScriptEpisodeRefused"].includes(event.type)) {
    if (
      typeof payload["reason"] !== "string" ||
      !payload["reason"] ||
      !state.policy!.phases.some((p) => p.phaseId === payload["phaseId"])
    )
      throw new Error("resident NoOp needs a reason and phase");
    state.lastNoOp = payload["reason"];
  }
  state.machine = machine.snapshot();
  return state;
}
