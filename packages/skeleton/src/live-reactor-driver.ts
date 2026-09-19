import { seiriEnvironment, type CompilationEnvironment } from "@dotln/compiler";
import {
  appendEvent,
  decodeLog,
  replay,
  type Decision,
  type Event,
  type EventDraft,
  type JsonValue,
} from "@dotln/kernel";
import {
  artifactRefusalPayload,
  createLoadoutEquippedPayload,
  isArtifactRefusalType,
} from "./artifact-identity.js";
import {
  ACTOR,
  EPISODE,
  WORKSTREAM,
  initialState,
  seiriPredicates,
  projectRuntimeEnvironment,
  seiriReactor,
  walkingStateFromRuntime,
  artifactIdentityFromRuntime,
  type Loadout,
  type RuntimeState,
} from "./reactor.js";

export interface ReactorStep {
  readonly event: Event;
  readonly decision: Decision<RuntimeState>;
}

export class LiveReactorDriver {
  #log = "";
  #state = initialState();
  #decisions: Decision<RuntimeState>[] = [];

  constructor(
    private readonly onEvents?: (events: readonly Event[]) => void,
    private readonly persistEvent?: (event: Event) => void,
  ) {}

  feed(draft: EventDraft): ReactorStep {
    if (
      draft.type === "BeaconSweepRequested" &&
      (draft.payload as { perceptionVersion?: unknown } | null)
        ?.perceptionVersion !== 1
    )
      throw new Error(
        "new BeaconSweepRequested requires perceptionVersion: 1; use observeBeaconSweep",
      );
    if (draft.type === "ArtifactIdentityEnforcementStarted")
      throw new Error(
        "the enforcement boundary is host-owned; use ensureIdentityEnforcement",
      );
    if (
      draft.type === "LoadoutEquipped" &&
      (draft.payload === null ||
        typeof draft.payload !== "object" ||
        Array.isArray(draft.payload) ||
        (draft.payload as Readonly<Record<string, JsonValue>>)[
          "payloadVersion"
        ] !== 2)
    )
      throw new Error(
        "new LoadoutEquipped input requires payloadVersion: 2; use equip",
      );
    this.ensureIdentityEnforcement(draft.occurredAt);
    const step = this.append(draft);
    const decision = step.decision;
    const consuming = decision.trace.envInputs.some((input) =>
      input.startsWith("artifactIdentity.semanticHash:"),
    );
    if (
      consuming ||
      decision.trace.reactorId === "artifact-identity" ||
      isArtifactRefusalType(step.event.type)
    )
      this.append({
        schemaVersion: 1,
        type: "DecisionRecorded",
        occurredAt: step.event.occurredAt,
        actorId: step.event.actorId,
        workstreamId: step.event.workstreamId,
        ...(step.event.episodeId === undefined
          ? {}
          : { episodeId: step.event.episodeId }),
        ...(step.event.correlationId === undefined
          ? {}
          : { correlationId: step.event.correlationId }),
        causationId: step.event.eventId,
        payload: { trace: decision.trace as unknown as JsonValue },
      });
    if (
      decision.continuation?.kind === "Emit" &&
      isArtifactRefusalType(decision.continuation.event.type)
    )
      this.append(decision.continuation.event);
    return step;
  }

  /** Exactly once per canonical log, before accepting any new external input. */
  ensureIdentityEnforcement(at: number): void {
    if (
      walkingStateFromRuntime(this.#state).identityEnforcementEventId !== null
    )
      return;
    this.append(
      scenarioDraft("ArtifactIdentityEnforcementStarted", at, {
        payloadVersion: 1,
      }),
    );
  }
  equip(
    graph: Loadout,
    environment: CompilationEnvironment = seiriEnvironment(),
    at = 0,
  ): ReactorStep {
    const result = createLoadoutEquippedPayload(graph, environment);
    return result.ok
      ? this.feed(
          scenarioDraft(
            "LoadoutEquipped",
            at,
            result.payload as unknown as JsonValue,
          ),
        )
      : this.feed(
          scenarioDraft(
            "ArtifactCompilationRefused",
            at,
            artifactRefusalPayload(
              "equip compilation failed",
              null,
              walkingStateFromRuntime(this.#state).equippedEventId,
              artifactIdentityFromRuntime(this.#state),
              null,
              result.diagnostics,
            ) as unknown as JsonValue,
          ),
        );
  }
  private append(draft: EventDraft): ReactorStep {
    const appended = appendEvent(this.#log, draft);
    this.persistEvent?.(appended.event);
    this.#log = appended.log;
    const stepped = replay(
      this.#state,
      [appended.event],
      seiriReactor,
      seiriPredicates,
      projectRuntimeEnvironment,
    );
    const decision = stepped.decisions[0];
    if (decision === undefined)
      throw new Error(`reactor did not decide ${appended.event.type}`);
    this.#state = stepped.state;
    this.#decisions.push(decision);
    this.onEvents?.(decodeLog(this.#log));
    return { event: appended.event, decision };
  }
  restore(log: string): void {
    this.#log = log;
    const restored = replay(
      initialState(),
      decodeLog(log),
      seiriReactor,
      seiriPredicates,
      projectRuntimeEnvironment,
    );
    this.#state = restored.state;
    this.#decisions = [...restored.decisions];
    this.onEvents?.(decodeLog(this.#log));
  }
  get log(): string {
    return this.#log;
  }
  get state(): RuntimeState {
    return this.#state;
  }
  get decisions(): readonly Decision<RuntimeState>[] {
    return this.#decisions;
  }
}

export const scenarioDraft = (
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
