import type { BeaconClaimRecord } from "./beacon.js";
import { renderBeaconGlyphs } from "./control-beacon.js";
import { seiriEnvironment, type CompilationEnvironment } from "@dotln/compiler";
import {
  artifactRefusalPayload,
  createLoadoutEquippedPayload,
  isArtifactIdentityV1,
  isArtifactRefusalType,
} from "./artifact-identity.js";
import {
  appendEvent,
  decodeLog,
  pendingCommands,
  replay,
  replayOutbox,
  type ActIntent,
  type Command,
  type Decision,
  type Event,
  type EventDraft,
  type JsonValue,
  type NoOpIntent,
  type ObserveIntent,
  type WorkOrder,
} from "@dotln/kernel";
import {
  ACTOR,
  EPISODE,
  WORKSTREAM,
  commandFromState,
  initialState,
  loadout,
  seiriPredicates,
  seiriReactor,
  workOrderFromState,
  type Candidate,
  type Loadout,
  type RuntimeState,
} from "./reactor.js";

export {
  MINUTE,
  compileLoadoutProgram,
  compileWorkOrder,
  expectedInspectCommandId,
  loadout,
  type Candidate,
  type Loadout,
  type RuntimeState,
} from "./reactor.js";

export interface FixtureFile {
  readonly path: string;
  readonly referencedBy: readonly string[];
  readonly classification: string;
}

export interface FixtureTree {
  readonly files: readonly FixtureFile[];
}

export interface ScenarioOptions {
  readonly crashAfterPersist?: boolean;
  readonly recoveryLogTransform?: (persistedLog: string) => string;
  readonly equippedLoadout?: Loadout;
  readonly onEvents?: (events: readonly Event[]) => void;
  readonly onExecutorClaim?: (claim: BeaconClaimRecord) => void;
  readonly verifier?: ScenarioVerifier;
}

export interface ScenarioResult {
  readonly log: string;
  readonly decisions: readonly Decision<RuntimeState>[];
  readonly timeline: readonly string[];
  readonly glyphScene: string;
  readonly workOrder: WorkOrder | null;
  readonly candidates: readonly Candidate[];
  readonly verified: boolean;
  readonly cancelledScheduleIds: readonly string[];
  readonly activeScheduleIds: readonly string[];
}

export interface LiveScenarioResult extends ScenarioResult {
  readonly adapterEffects: number;
  readonly adapterDispatches: readonly string[];
  readonly recoveredCommands: readonly Command[];
}

export class FakeExecutor {
  readonly #seen = new Map<string, readonly Candidate[]>();
  readonly dispatches: string[] = [];
  effects = 0;

  constructor(
    private readonly fixture: FixtureTree,
    private readonly emitClaim?: (claim: BeaconClaimRecord) => void,
  ) {}

  dispatch(command: Command, claimedAt = 0): readonly Candidate[] {
    this.dispatches.push(command.commandId);
    const prior = this.#seen.get(command.commandId);
    if (prior) return prior;
    this.emitClaim?.({
      recordType: "beacon-claim",
      codebookVersion: 1,
      provenance: "self-reported",
      actor: "fake-executor",
      scope: { workstreamId: WORKSTREAM, episodeId: EPISODE },
      claimedAt,
      actionClass: "verification",
      outcome: "passed",
      refusalCount: 0,
    });
    this.effects += 1;
    const candidates = this.fixture.files
      .filter(
        (file) =>
          file.referencedBy.length === 0 &&
          file.classification === "generated-stale",
      )
      .map((file) => ({
        path: file.path,
        classification: file.classification,
        evidence: [
          `inventory:${file.path}`,
          `classification:${file.classification}`,
          "references:none",
        ],
      }));
    this.#seen.set(command.commandId, candidates);
    return candidates;
  }
}

export interface ScenarioVerifier {
  dispatch(
    intent: ObserveIntent,
    candidates: readonly Candidate[],
    driver: LiveReactorDriver,
    now: number,
  ): boolean;
}

class FakeVerifier implements ScenarioVerifier {
  constructor(private readonly fixture: FixtureTree) {}

  dispatch(intent: ObserveIntent, candidates: readonly Candidate[]): boolean {
    if (intent.subject !== "candidates")
      throw new Error(`fake verifier cannot observe ${intent.subject}`);
    return (
      candidates.length > 0 &&
      candidates.every((candidate) => {
        const source = this.fixture.files.find(
          (file) => file.path === candidate.path,
        );
        return (
          source?.referencedBy.length === 0 &&
          candidate.evidence.length >= 3 &&
          candidate.evidence.some((value) => value === "references:none")
        );
      })
    );
  }
}

class FakeScheduler {
  readonly #active = new Set<string>();

  schedule(...ids: readonly string[]): void {
    for (const id of ids) this.#active.add(id);
  }

  cancel(ids: readonly string[]): void {
    for (const id of ids) this.#active.delete(id);
  }

  get activeScheduleIds(): readonly string[] {
    return [...this.#active];
  }
}

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
    if (this.#state.identityEnforcementEventId !== null) return;
    this.append(
      draft("ArtifactIdentityEnforcementStarted", at, { payloadVersion: 1 }),
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
          draft("LoadoutEquipped", at, result.payload as unknown as JsonValue),
        )
      : this.feed(
          draft(
            "ArtifactCompilationRefused",
            at,
            artifactRefusalPayload(
              "equip compilation failed",
              null,
              this.#state.equippedEventId,
              isArtifactIdentityV1(this.#state.artifactIdentity)
                ? this.#state.artifactIdentity
                : null,
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

const continuationEvent = (
  decision: Decision<RuntimeState>,
  purpose: string,
): EventDraft => {
  if (decision.continuation?.kind !== "Emit")
    throw new Error(`${purpose} did not emit an event`);
  return decision.continuation.event;
};

const scheduledEvent = (
  decision: Decision<RuntimeState>,
  scheduleId: string,
): EventDraft => {
  const schedule = decision.schedules.find(
    (candidate) => candidate.scheduleId === scheduleId,
  );
  if (schedule === undefined)
    throw new Error(`reactor did not declare schedule ${scheduleId}`);
  return schedule.eventToEmit;
};

const actIntent = (
  decision: Decision<RuntimeState>,
  effect: string,
): ActIntent => {
  const intent = decision.intents.find(
    (candidate): candidate is ActIntent =>
      candidate.kind === "Act" && candidate.effect === effect,
  );
  if (intent === undefined)
    throw new Error(`reactor did not request ${effect}`);
  return intent;
};

const observeIntent = (
  decision: Decision<RuntimeState>,
  subject: string,
): ObserveIntent => {
  const intent = decision.intents.find(
    (candidate): candidate is ObserveIntent =>
      candidate.kind === "Observe" && candidate.subject === subject,
  );
  if (intent === undefined)
    throw new Error(`reactor did not request observation of ${subject}`);
  return intent;
};

const noOpIntent = (decision: Decision<RuntimeState>): NoOpIntent => {
  const intent = decision.intents.find(
    (candidate): candidate is NoOpIntent => candidate.kind === "NoOp",
  );
  if (intent === undefined) throw new Error("reactor did not declare a NoOp");
  return intent;
};

const project = (events: readonly Event[]): readonly string[] =>
  events.map(
    (event, index) =>
      `${String(index + 1).padStart(2, "0")} ${event.type} — ${event.eventId}`,
  );

export function renderGlyphScene(state: RuntimeState): string {
  const returned = state.presence === "returned";
  return [
    "🐛 Repo Gardener",
    returned ? "◌ dormant" : "🌙 active",
    state.pulseSeen ? "⏱️ pulsing" : "○ waiting",
    state.inspectionCompleted ? "🔎 inspecting" : "○ unknown",
    state.deletionRefused ? "🛡️ inverted/refused" : "○ unguarded",
    state.verificationCompleted && state.verified
      ? "✅ verified"
      : "○ unverified",
    returned ? "☀️ phase:returned" : "○ away",
    state.queuedPulseNoOp ? "💤 faded/cancelled" : "○ scheduled",
    ...(state.beaconObservations.length
      ? [renderBeaconGlyphs(state.beaconObservations)]
      : []),
  ].join("  ");
}

const projectResult = (
  log: string,
  state: RuntimeState,
  decisions: readonly Decision<RuntimeState>[],
): ScenarioResult => {
  const events = decodeLog(log);
  return {
    log,
    decisions,
    timeline: project(events),
    glyphScene: renderGlyphScene(state),
    workOrder: state.workOrder === null ? null : workOrderFromState(state),
    candidates: state.candidates,
    verified: state.verified,
    cancelledScheduleIds: state.cancelledScheduleIds,
    activeScheduleIds: state.activeScheduleIds,
  };
};

export { projectResult as projectScenario };

export function replayScenario(log: string): ScenarioResult {
  const replayed = replay(
    initialState(),
    decodeLog(log),
    seiriReactor,
    seiriPredicates,
  );
  return projectResult(log, replayed.state, replayed.decisions);
}

export function startScenario(
  driver: LiveReactorDriver,
  equipped: Loadout = loadout,
  environment: CompilationEnvironment = seiriEnvironment(),
  startAt = 0,
) {
  driver.feed(
    draft("InspectionTaskCreated", startAt, {
      bounded: true,
      fixture: "repo-tree.json",
    }),
  );
  driver.equip(equipped, environment, startAt);

  const away = driver.feed(
    draft("OperatorPresenceChanged", startAt, { presence: "away" }),
  );
  const primaryScheduleId = away.decision.schedules[0]?.scheduleId;
  const queuedScheduleId = away.decision.schedules[1]?.scheduleId;
  if (primaryScheduleId === undefined || queuedScheduleId === undefined)
    throw new Error("reactor did not emit the compiled Seiri schedules");

  const pulse = driver.feed(scheduledEvent(away.decision, primaryScheduleId));
  const emittedWorkOrder = driver.feed(
    continuationEvent(pulse.decision, "cadence pulse"),
  );
  const granted = emittedWorkOrder.decision;

  const command = commandFromState(granted.state);
  const persisted = driver.feed(
    draft(
      "CommandPersisted",
      pulse.event.occurredAt + 1,
      { command: command as unknown as JsonValue },
      pulse.event.eventId,
      emittedWorkOrder.event.eventId,
    ),
  );
  return { away, pulse, persisted, command, queuedScheduleId };
}

export type ScenarioOpening = ReturnType<typeof startScenario>;

export function restoreScenarioOpening(
  driver: LiveReactorDriver,
): ScenarioOpening {
  const events = decodeLog(driver.log);
  const step = (type: string): ReactorStep => {
    const index = events.findIndex((event) => event.type === type);
    if (index < 0) throw new Error(`incomplete scenario opening: ${type}`);
    return { event: events[index]!, decision: driver.decisions[index]! };
  };
  const away = step("OperatorPresenceChanged");
  const queuedScheduleId = away.decision.schedules[1]?.scheduleId;
  if (!queuedScheduleId) throw new Error("missing queued scenario schedule");
  return {
    away,
    pulse: step("CadencePulse"),
    persisted: step("CommandPersisted"),
    command: commandFromState(step("CommandPersisted").decision.state),
    queuedScheduleId,
  };
}

export function runScenario(
  fixture: FixtureTree,
  options: ScenarioOptions = {},
): LiveScenarioResult {
  const driver = new LiveReactorDriver(options.onEvents);
  const executor = new FakeExecutor(fixture, options.onExecutorClaim);
  const opening = startScenario(driver, options.equippedLoadout ?? loadout);
  const { command, pulse, persisted } = opening;

  let recoveredCommands: readonly Command[] = [];
  let resultCause = persisted.event;
  if (options.crashAfterPersist) {
    driver.restore(options.recoveryLogTransform?.(driver.log) ?? driver.log);
    recoveredCommands = pendingCommands(replayOutbox(decodeLog(driver.log)));
    if (recoveredCommands.length === 0)
      return {
        ...projectResult(driver.log, driver.state, driver.decisions),
        adapterEffects: executor.effects,
        adapterDispatches: executor.dispatches,
        recoveredCommands,
      };
    for (const pending of recoveredCommands) {
      const persistedSource = decodeLog(driver.log).find((source) => {
        const payload = source.payload as {
          readonly command?: { readonly commandId?: string };
        } | null;
        return (
          source.type === "CommandPersisted" &&
          payload?.command?.commandId === pending.commandId
        );
      });
      if (persistedSource === undefined)
        throw new Error("pending command lacks its canonical persist event");
      const recovery = driver.feed(
        draft(
          "CommandRedispatchRequested",
          persisted.event.occurredAt,
          { commandId: pending.commandId },
          pending.commandId,
          persistedSource.eventId,
        ),
      );
      if (
        recovery.decision.continuation?.kind === "Emit" &&
        isArtifactRefusalType(recovery.decision.continuation.event.type)
      )
        return {
          ...projectResult(driver.log, driver.state, driver.decisions),
          adapterEffects: executor.effects,
          adapterDispatches: executor.dispatches,
          recoveredCommands,
        };
      executor.dispatch(pending, persisted.event.occurredAt);
      const redispatched = driver.feed(
        draft(
          "CommandRedispatched",
          pulse.event.occurredAt + 1,
          { commandId: pending.commandId },
          pending.commandId,
          recovery.event.eventId,
        ),
      );
      resultCause = redispatched.event;
    }
  }

  const candidates = executor.dispatch(command, persisted.event.occurredAt);
  const commandResult = driver.feed(
    draft(
      "CommandResult",
      pulse.event.occurredAt + 2,
      {
        commandId: command.commandId,
        result: "candidates",
        candidates: candidates as unknown as JsonValue,
      },
      command.commandId,
      resultCause.eventId,
    ),
  );

  return {
    ...finishScenario(
      driver,
      fixture,
      opening,
      commandResult,
      undefined,
      options.verifier,
    ),
    adapterEffects: executor.effects,
    adapterDispatches: executor.dispatches,
    recoveredCommands,
  };
}

/** The same fake verifier, refusal and scheduler finish both demo transports. */
export function finishScenario(
  driver: LiveReactorDriver,
  fixture: FixtureTree,
  opening: ScenarioOpening,
  commandResult: ReactorStep,
  now?: () => number,
  verifier: ScenarioVerifier = new FakeVerifier(fixture),
): ScenarioResult {
  const { away, pulse, command, queuedScheduleId } = opening;
  const candidates = commandResult.decision.state.candidates;
  const scheduler = new FakeScheduler();
  scheduler.schedule(
    ...away.decision.schedules.map((schedule) => schedule.scheduleId),
  );
  const at = (offset: number) => now?.() ?? pulse.event.occurredAt + offset;
  // A restarted host may have persisted part of this suffix. Reuse its exact
  // event and Decision, including original causes, rather than replaying effects.
  const feedOnce = (event: EventDraft): ReactorStep => {
    const events = decodeLog(driver.log);
    const index = events.findIndex(
      (source) =>
        source.type === event.type && source.causationId === event.causationId,
    );
    return index < 0
      ? driver.feed(event)
      : { event: events[index]!, decision: driver.decisions[index]! };
  };

  const deletion = actIntent(commandResult.decision, "repo.delete");
  const deletionAttempted = feedOnce(
    draft(
      "DeletionAttempted",
      at(3),
      {
        effect: deletion.effect,
        paths: (
          deletion.payload as unknown as { readonly paths: readonly string[] }
        ).paths,
      },
      command.commandId,
      commandResult.event.eventId,
    ),
  );
  const refused = feedOnce(
    continuationEvent(deletionAttempted.decision, "deletion guard"),
  );

  const terminated = feedOnce(
    continuationEvent(refused.decision, "structural refusal"),
  );
  const verificationRequested = feedOnce(
    continuationEvent(terminated.decision, "episode continuation"),
  );

  const accepted = verifier.dispatch(
    observeIntent(verificationRequested.decision, "candidates"),
    candidates,
    driver,
    at(5),
  );
  feedOnce(
    draft(
      "VerificationCompleted",
      at(5),
      { accepted, candidateCount: candidates.length },
      command.commandId,
      verificationRequested.event.eventId,
    ),
  );

  // The initial away event shares this type and has no cause; match the return
  // payload separately to preserve the historical default event bytes.
  if (driver.state.presence !== "returned")
    driver.feed(
      draft("OperatorPresenceChanged", at(6), {
        presence: "returned",
      }),
    );
  const queuedDraft = scheduledEvent(away.decision, queuedScheduleId);
  const priorQueued = decodeLog(driver.log).findIndex(
    (event) =>
      event.type === "CadencePulse" &&
      (event.payload as { scheduleId?: string }).scheduleId ===
        queuedScheduleId,
  );
  const queued =
    priorQueued < 0
      ? driver.feed(queuedDraft)
      : {
          event: decodeLog(driver.log)[priorQueued]!,
          decision: driver.decisions[priorQueued]!,
        };

  const noOp = noOpIntent(queued.decision);
  feedOnce(
    draft(
      "QueuedPulseNoOp",
      queued.event.occurredAt,
      { reason: noOp.reason, evidence: noOp.evidence },
      queued.event.eventId,
      queued.event.eventId,
    ),
  );
  scheduler.cancel(queued.decision.state.cancelledScheduleIds);
  feedOnce(
    draft(
      "SchedulesCancelled",
      queued.event.occurredAt,
      {
        scheduleIds: queued.decision.state.cancelledScheduleIds,
        activeScheduleIds: scheduler.activeScheduleIds,
      },
      queued.event.eventId,
      queued.event.eventId,
    ),
  );

  return projectResult(driver.log, driver.state, driver.decisions);
}
