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
  assertActorSpec,
  type ActorSpec,
} from "./actor-contract.js";
import {
  PresenceMachine,
  presencePredicates,
  type PresenceSnapshot,
} from "./presence-machine.js";

export interface ResidentConfiguration {
  graph: LoadoutGraph;
  environment: CompilationEnvironment;
  policyId: string;
  actors: Record<string, ActorSpec>;
  evidence: string[];
}
export interface ResidentState {
  configuration: ResidentConfiguration | null;
  policy: CompiledPresencePolicy | null;
  machine: PresenceSnapshot | null;
  at: number;
  present: boolean;
  episodes: Record<string, "dispatched" | "observed" | "lost">;
  episodePhases: Record<string, string>;
  revokedBy: Event[];
  lastNoOp: string | null;
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
        !["graph", "environment", "policyId", "actors", "evidence"].includes(
          key,
        ),
    ) ||
    typeof v.policyId !== "string" ||
    !v.actors ||
    typeof v.actors !== "object" ||
    Array.isArray(v.actors) ||
    !Array.isArray(v.evidence) ||
    v.evidence.some((item) => typeof item !== "string")
  )
    throw new Error("invalid resident configuration fields");
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
  revokedBy: [],
  lastNoOp: null,
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
] as const;

export function residentRefusal(
  state: ResidentState,
  machine: PresenceMachine,
): string | null {
  const phase = machine.phase()!;
  const spec = state.configuration!.actors[phase.phaseId]!;
  if (!phase.scope.surfaces.includes(spec.surface))
    return "actor surface is outside phase scope";
  const limits: Record<string, number> = {
    ...phase.scope.budget,
    ...phase.scope.changeSize,
  };
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
  return authorization.authorized ? null : authorization.refusal.payload.reason;
}

export function foldResidentEvent(
  previous: ResidentState | undefined,
  event: Event,
  predicates: PredicateRegistry,
): ResidentState {
  const state = structuredClone(previous ?? emptyResidentState());
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
  }
  if (event.type === "OperatorPresenceChanged") {
    if (
      typeof payload["presence"] !== "string" ||
      !["away", "returned"].includes(payload["presence"])
    )
      throw new Error("invalid resident presence");
    state.present = payload["presence"] === "returned";
  }
  if (!state.machine) {
    if (!["ClockSampled", "OperatorPresenceChanged"].includes(event.type))
      throw new Error("resident event precedes configuration");
    return state;
  }
  const machine = residentMachine(state, predicates);
  machine.now = state.at;
  if (event.type === "OperatorPresenceChanged") {
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
    machine.dispatch(id);
    state.lastNoOp = null;
  }
  if (["ScriptEpisodeObserved", "ScriptEpisodeLost"].includes(event.type)) {
    const id = payload["episodeId"];
    if (typeof id !== "string" || state.episodes[id] !== "dispatched")
      throw new Error("resident outcome has no pending dispatch");
    const lost = event.type === "ScriptEpisodeLost";
    if (lost && (typeof payload["reason"] !== "string" || !payload["reason"]))
      throw new Error("lost episode needs a reason");
    if (!lost) {
      assertActorResult(payload);
      const expected =
        state.configuration!.actors[state.episodePhases[id]!]!
          .expectedStdoutSha256;
      const verified =
        payload.exitCode === 0 &&
        payload.signal === null &&
        payload.reason === "completed" &&
        payload.stdoutSha256 === expected;
      if (payload.verified !== verified)
        throw new Error("script verification contradicts recorded output");
    }
    state.episodes[id] = lost ? "lost" : "observed";
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
