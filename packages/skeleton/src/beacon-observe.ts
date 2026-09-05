import {
  appendEvent,
  decodeLog,
  replay,
  type AuthorizationResult,
  type EventDraft,
  type JsonValue,
} from "@dotln/kernel";
import { initialState, seiriPredicates, seiriReactor } from "./reactor.js";
import type { BeaconSweepRequest, BeaconWorktree } from "./control-beacon.js";
import { sweepControlBeacons } from "./control-beacon-fs.mjs";

export function replayBeaconSweep(log: string) {
  return replay(initialState(), decodeLog(log), seiriReactor, seiriPredicates);
}

// Host inputs carry the grant; the Observe intent does not manufacture it.
// persist is called before each dependent edge action, including the first stat.
export function observeBeaconSweep(
  log: string,
  request: BeaconSweepRequest,
  worktrees: readonly BeaconWorktree[],
  now: number,
  persist: (log: string) => void,
  read = sweepControlBeacons,
) {
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
    payload: {
      ...request,
      decisionIndex: decodeLog(log).length,
    } as unknown as JsonValue,
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
  const observations = read(worktrees, request.audience);
  const observed = append({
    ...base,
    type: "BeaconObserved",
    causationId: persisted.eventId,
    correlationId: authorization.command.commandId,
    payload: {
      commandId: authorization.command.commandId,
      sweptAt: now,
      observations,
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
    sweptAt: now,
  };
}
