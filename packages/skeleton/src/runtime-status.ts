import { type Event, type PredicateRegistry } from "@dotln/kernel";
import {
  runtimeOrdersFromIndex,
  type RuntimeStatusV1,
} from "./runtime-status-contract.js";
import { residentMachine, type ResidentState } from "./resident-state.js";

const orderId = (value: unknown): string | null =>
  typeof value === "string" && /^WO-\d{3}$/u.test(value) ? value : null;
const publicClaim = (value: string): string | null =>
  /^[A-Za-z0-9][A-Za-z0-9_.:+ -]{0,127}$/u.test(value) &&
  !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/iu.test(value)
    ? value
    : null;

/** A pure, allowlisted projection. The event log supplies timestamps and
 * observed signal; the fold supplies current state. Neither raw payloads nor
 * paths, endpoints, session identifiers or host details are copied. */
export function projectRuntimeStatus(
  state: ResidentState | undefined,
  events: readonly Event[],
  indexText: string | null,
  predicates: PredicateRegistry = {},
): RuntimeStatusV1 {
  const configured = state?.configuration;
  const dispatches = new Map<string, Event>();
  const lastByPhase = new Map<string, string>();
  let signal: RuntimeStatusV1["presence"]["signal"] = "unknown";
  let lastNoOp: { type: string; phase: string } | null = null;
  for (const event of events) {
    const payload = event.payload as Record<string, unknown>;
    if (event.type === "ScriptEpisodeDispatched") {
      const episode = payload["episodeId"];
      const phase = payload["phaseId"];
      if (typeof episode === "string" && typeof phase === "string") {
        dispatches.set(episode, event);
        lastByPhase.set(phase, episode);
      }
    }
    if (event.type === "OperatorPresenceObserved") {
      const kind = (payload["signal"] as { kind?: unknown } | undefined)?.kind;
      if (["away", "back", "progress", "heartbeat"].includes(String(kind)))
        signal = kind as typeof signal;
    } else if (event.type === "OperatorPresenceChanged") {
      signal = payload["presence"] === "away" ? "away" : "back";
    }
    if (["ActorUnavailable", "ScriptEpisodeRefused"].includes(event.type))
      lastNoOp = { type: event.type, phase: String(payload["phaseId"] ?? "") };
    if (event.type === "ScriptEpisodeDispatched") lastNoOp = null;
  }
  const actors: RuntimeStatusV1["actors"] = (state?.policy?.phases ?? []).map(
    (phase) => {
      const episode = lastByPhase.get(phase.phaseId) ?? null;
      const live =
        episode !== null && state?.episodes[episode] === "dispatched";
      return {
        phase: phase.phaseId,
        kind: configured!.actors[phase.phaseId]!.kind,
        availability:
          phase.availability.kind === "NoOp" ||
          (lastNoOp?.type === "ActorUnavailable" &&
            lastNoOp.phase === phase.phaseId)
            ? "unavailable"
            : live
              ? "available"
              : "unknown",
        lastEpisode: episode,
      };
    },
  );
  const liveEpisodes: RuntimeStatusV1["liveEpisodes"] = Object.entries(
    state?.episodes ?? {},
  )
    .filter(([, status]) => status === "dispatched")
    .map(([episodeId]) => {
      const phase = state!.episodePhases[episodeId]!;
      const spec = configured!.actors[phase]!;
      const startedAt = dispatches.get(episodeId)?.occurredAt ?? state!.at;
      const request = spec.worker?.request ?? spec.local?.request;
      const activation = state!.portfolio.activations[episodeId];
      return {
        episodeId,
        order: orderId(
          activation?.order.workOrder.workOrderId ??
            request?.workOrder.workOrderId ??
            spec.handoff?.workOrderId,
        ),
        actor: spec.kind,
        transport:
          spec.worker?.transport ??
          (spec.kind === "local-model" ? "local-model" : spec.kind),
        phase,
        startedAt,
        elapsedMs: Math.max(0, state!.at - startedAt),
        launchClaims: request
          ? {
              source: "request" as const,
              model: publicClaim(request.model),
              effort: publicClaim(request.effort),
            }
          : { source: "none" as const, model: null, effort: null },
      };
    });
  const machine = state?.machine;
  const cadences: RuntimeStatusV1["presence"]["cadences"] = (
    state?.policy?.phases ?? []
  ).map((phase) => ({
    phase: phase.phaseId,
    nextFireAt:
      machine?.state === phase.phaseId
        ? residentMachine(state!, predicates).nextCadenceAt()
        : null,
  }));
  const holds: RuntimeStatusV1["holds"] = [];
  if (state?.dispatchHeld)
    holds.push({
      kind: "mission",
      reason:
        state.dispatchHeld.verdict === "drift"
          ? "mission-check-drift"
          : "mission-check-unknown",
      order: null,
    });
  for (const handoff of Object.values(state?.handoffs ?? {}))
    if (handoff.answer === undefined)
      holds.push({
        kind: "handoff",
        reason: "awaiting-human-answer",
        order: orderId(handoff.packet.workOrderId),
      });
  if (state?.lastNoOp && lastNoOp)
    holds.push({
      kind: "dispatch",
      reason:
        lastNoOp.type === "ActorUnavailable"
          ? "actor-unavailable"
          : "dispatch-refused",
      order: null,
    });
  const limit = configured?.portfolio?.definition.budget;
  const consumed = state?.portfolio ?? { episodes: 0, wallMs: 0, tokens: 0 };
  const remaining = (cap: number | undefined, used: number) =>
    cap === undefined ? null : Math.max(0, cap - used);
  let workOrders: RuntimeStatusV1["workOrders"];
  try {
    workOrders = runtimeOrdersFromIndex(indexText);
  } catch {
    workOrders = { status: "unavailable", items: [] };
  }
  return {
    viewModelVersion: "runtime-status-v1",
    observedAt: state?.at ?? 0,
    actors,
    liveEpisodes,
    presence: {
      signal,
      present: state?.present ?? true,
      phase: machine?.state ?? null,
      cadences,
    },
    holds,
    budget: {
      status: limit ? "configured" : "unavailable",
      episodes: {
        consumed: consumed.episodes,
        remaining: remaining(limit?.episodes, consumed.episodes),
      },
      wallMs: {
        consumed: consumed.wallMs,
        remaining: remaining(limit?.wallMs, consumed.wallMs),
      },
      tokens: {
        consumed: consumed.tokens,
        remaining: remaining(limit?.tokens, consumed.tokens),
      },
    },
    workOrders,
  };
}
