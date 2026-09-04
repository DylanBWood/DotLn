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
}

export interface ScenarioResult {
  readonly log: string;
  readonly decisions: readonly Decision<RuntimeState>[];
  readonly timeline: readonly string[];
  readonly glyphScene: string;
  readonly workOrder: WorkOrder;
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

  constructor(private readonly fixture: FixtureTree) {}

  dispatch(command: Command): readonly Candidate[] {
    this.dispatches.push(command.commandId);
    const prior = this.#seen.get(command.commandId);
    if (prior) return prior;
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

class FakeVerifier {
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

interface ReactorStep {
  readonly event: Event;
  readonly decision: Decision<RuntimeState>;
}

class LiveReactorDriver {
  #log = "";
  #state = initialState();
  #decisions: Decision<RuntimeState>[] = [];

  feed(draft: EventDraft): ReactorStep {
    const appended = appendEvent(this.#log, draft);
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

const recordDecision = (
  driver: LiveReactorDriver,
  decision: Decision<RuntimeState>,
  source: Event,
  correlationId?: string,
): ReactorStep =>
  driver.feed(
    draft(
      "DecisionRecorded",
      source.occurredAt,
      { trace: decision.trace as unknown as JsonValue },
      correlationId,
      source.eventId,
    ),
  );

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
    workOrder: workOrderFromState(state),
    candidates: state.candidates,
    verified: state.verified,
    cancelledScheduleIds: state.cancelledScheduleIds,
    activeScheduleIds: state.activeScheduleIds,
  };
};

export function replayScenario(log: string): ScenarioResult {
  const replayed = replay(
    initialState(),
    decodeLog(log),
    seiriReactor,
    seiriPredicates,
  );
  return projectResult(log, replayed.state, replayed.decisions);
}

export function runScenario(
  fixture: FixtureTree,
  options: ScenarioOptions = {},
): LiveScenarioResult {
  const driver = new LiveReactorDriver();
  const scheduler = new FakeScheduler();
  const executor = new FakeExecutor(fixture);
  const verifier = new FakeVerifier(fixture);

  driver.feed(
    draft("InspectionTaskCreated", 0, {
      bounded: true,
      fixture: "repo-tree.json",
    }),
  );
  driver.feed(
    draft(
      "LoadoutEquipped",
      0,
      (options.equippedLoadout ?? loadout) as unknown as JsonValue,
    ),
  );

  const away = driver.feed(
    draft("OperatorPresenceChanged", 0, { presence: "away" }),
  );
  recordDecision(driver, away.decision, away.event);
  scheduler.schedule(
    ...away.decision.schedules.map((schedule) => schedule.scheduleId),
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
  recordDecision(driver, granted, emittedWorkOrder.event, pulse.event.eventId);

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

  let recoveredCommands: readonly Command[] = [];
  let resultCause = persisted.event;
  if (options.crashAfterPersist) {
    driver.restore(options.recoveryLogTransform?.(driver.log) ?? driver.log);
    recoveredCommands = pendingCommands(replayOutbox(decodeLog(driver.log)));
    for (const pending of recoveredCommands) {
      executor.dispatch(pending);
      const redispatched = driver.feed(
        draft(
          "CommandRedispatched",
          pulse.event.occurredAt + 1,
          { commandId: pending.commandId },
          pending.commandId,
          persisted.event.eventId,
        ),
      );
      resultCause = redispatched.event;
    }
  }

  const candidates = executor.dispatch(command);
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

  const deletion = actIntent(commandResult.decision, "repo.delete");
  const deletionAttempted = driver.feed(
    draft(
      "DeletionAttempted",
      pulse.event.occurredAt + 3,
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
  const refused = driver.feed(
    continuationEvent(deletionAttempted.decision, "deletion guard"),
  );
  recordDecision(
    driver,
    deletionAttempted.decision,
    deletionAttempted.event,
    command.commandId,
  );

  const terminated = driver.feed(
    continuationEvent(refused.decision, "structural refusal"),
  );
  recordDecision(
    driver,
    terminated.decision,
    terminated.event,
    command.commandId,
  );
  const verificationRequested = driver.feed(
    continuationEvent(terminated.decision, "episode continuation"),
  );

  const accepted = verifier.dispatch(
    observeIntent(verificationRequested.decision, "candidates"),
    candidates,
  );
  driver.feed(
    draft(
      "VerificationCompleted",
      pulse.event.occurredAt + 5,
      { accepted, candidateCount: candidates.length },
      command.commandId,
      verificationRequested.event.eventId,
    ),
  );

  driver.feed(
    draft("OperatorPresenceChanged", pulse.event.occurredAt + 6, {
      presence: "returned",
    }),
  );
  const queued = driver.feed(scheduledEvent(away.decision, queuedScheduleId));
  recordDecision(driver, queued.decision, queued.event, queued.event.eventId);

  const noOp = noOpIntent(queued.decision);
  driver.feed(
    draft(
      "QueuedPulseNoOp",
      queued.event.occurredAt,
      { reason: noOp.reason, evidence: noOp.evidence },
      queued.event.eventId,
      queued.event.eventId,
    ),
  );
  scheduler.cancel(queued.decision.state.cancelledScheduleIds);
  driver.feed(
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

  return {
    ...projectResult(driver.log, driver.state, driver.decisions),
    adapterEffects: executor.effects,
    adapterDispatches: executor.dispatches,
    recoveredCommands,
  };
}
