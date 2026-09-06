import {
  appendEvent,
  decodeLog,
  replay,
  type AuthorizationResult,
  type EventDraft,
  type JsonValue,
} from "@dotln/kernel";
import { initialState, seiriPredicates, seiriReactor } from "./reactor.js";
import type { BeaconSweepRequest } from "./control-beacon.js";
import { declareBeaconPerception } from "./execution-environment.js";
import {
  compilePerception,
  projectSenseObservation,
  validatePerception,
} from "./beacon-perception.js";
import { readMountedBeacons } from "./beacon-perception-fs.js";
import type { BeaconProvenance } from "./beacon-provenance.mjs";
import { SENSE_IDS } from "@dotln/compiler";

const sweepPayload = (request: BeaconSweepRequest, decisionIndex: number) => {
  let perception;
  let perceptionError: string | null = null;
  try {
    if (
      request.senses &&
      (!Array.isArray(request.senses) ||
        request.senses.some((id) => !SENSE_IDS.includes(id)) ||
        new Set(request.senses).size !== request.senses.length)
    )
      throw new Error();
    perception = declareBeaconPerception(
      request.senses ?? [],
      request.environment,
      request.audience,
    );
  } catch {
    perception = declareBeaconPerception([], undefined, request.audience);
    perceptionError = "beacon environment profile or sense selection refused";
  }
  // The physical profile, key handle and arbitrary request fields are excluded.
  return {
    intent: request.intent,
    audience: request.audience,
    authority: request.authority,
    evidence: request.evidence,
    revokedBy: request.revokedBy,
    staleAfterMs: request.staleAfterMs,
    decisionIndex,
    perceptionVersion: 1,
    perception,
    perceptionError,
  };
};

export function projectBeaconSparseTwin(
  request: BeaconSweepRequest,
  now: number,
) {
  const payload = sweepPayload(request, 0);
  const compiled = compilePerception(
    payload.perception,
    request.authority,
    request.audience,
  );
  const event = {
    schemaVersion: 1 as const,
    eventId: "affordance-preview",
    occurredAt: now,
    actorId: "beacon-observer",
    workstreamId: "ws_beacon_control",
    episodeId: "ep_beacon_sweep",
    type: "BeaconSweepRequested",
    payload: payload as unknown as JsonValue,
  };
  const state = initialState();
  const decision = seiriReactor(state, event, {
    now,
    rngState: state.rngState,
    predicates: seiriPredicates,
    policy: state.policy,
  });
  const authorization = (
    decision.state.beaconSweep as unknown as {
      authorization: AuthorizationResult;
    }
  ).authorization;
  return {
    actions: authorization.authorized
      ? [{ action: "sweep", intent: request.intent }]
      : [],
    supportCosts: compiled.ok ? compiled.program.supportCosts : [],
    diagnostics: compiled.ok ? [] : compiled.diagnostics,
  };
}

export function replayBeaconSweep(log: string) {
  return replay(initialState(), decodeLog(log), seiriReactor, seiriPredicates);
}

// Host inputs carry the grant; the Observe intent does not manufacture it.
// persist is called before each dependent edge action, including the first stat.
export function observeBeaconSweep(
  log: string,
  request: BeaconSweepRequest,
  now: number,
  persist: (log: string) => void,
  options: {
    readonly read?: typeof readMountedBeacons;
    readonly key?: BeaconProvenance;
  } = {},
) {
  const profile = request.environment
    ? structuredClone(request.environment)
    : undefined;
  const payload = sweepPayload(
    { ...request, ...(profile ? { environment: profile } : {}) },
    decodeLog(log).length,
  );
  let currentLog = log;
  let folded = replayBeaconSweep(log);
  const append = (draft: EventDraft) => {
    const appended = appendEvent(currentLog, draft);
    const decision = seiriReactor(folded.state, appended.event, {
      now: appended.event.occurredAt,
      rngState: folded.state.rngState,
      predicates: seiriPredicates,
      policy: folded.state.policy,
    });
    persist(appended.log);
    currentLog = appended.log;
    folded = {
      ...folded,
      state: decision.state,
      decisions: [...folded.decisions, decision],
    };
    return appended.event;
  };
  const base = {
    schemaVersion: 1 as const,
    occurredAt: now,
    actorId: "beacon-observer",
    workstreamId: "ws_beacon_control",
    episodeId: "ep_beacon_sweep",
  };
  const requested = append({
    ...base,
    type: "BeaconSweepRequested",
    payload: payload as unknown as JsonValue,
  });
  const { authorization } = folded.state.beaconSweep as unknown as {
    authorization: AuthorizationResult;
  };
  if (!authorization.authorized) {
    append({ ...authorization.refusal, causationId: requested.eventId });
    return { log: currentLog, ...folded, authorized: false as const };
  }
  const persisted = append({
    ...base,
    type: "CommandPersisted",
    causationId: requested.eventId,
    correlationId: authorization.command.commandId,
    payload: { command: authorization.command as unknown as JsonValue },
  });
  const declaration = payload.perception;
  const raw = (options.read ?? readMountedBeacons)(
    profile!,
    declaration.senses,
    options.key,
  );
  const fine = declaration.senses.includes("fine-spectrum");
  const observations = raw.observations.map((item) =>
    projectSenseObservation(item, fine),
  );
  const groups =
    raw.groups === "not-sensed"
      ? raw.groups
      : raw.groups.map((item) => projectSenseObservation(item, fine));
  const keyEpoch = options.key?.epoch ?? null;
  validatePerception({ observations, groups }, declaration, keyEpoch);
  const observed = append({
    ...base,
    type: "BeaconObserved",
    causationId: persisted.eventId,
    correlationId: authorization.command.commandId,
    payload: {
      commandId: authorization.command.commandId,
      sweptAt: now,
      observations,
      groups,
      keyEpoch,
      perceptionVersion: 1,
    },
  });
  append({
    ...base,
    type: "CommandResult",
    causationId: observed.eventId,
    correlationId: authorization.command.commandId,
    payload: {
      commandId: authorization.command.commandId,
      observationCount: observations.length,
    },
  });
  return {
    log: currentLog,
    ...folded,
    authorized: true as const,
    observations,
    groups,
    sweptAt: now,
  };
}
