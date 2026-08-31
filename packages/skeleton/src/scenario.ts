import {
  Cadence, Program, appendEvent, authorize, commandId, decodeLog, decideProgram,
  evaluateCadence, guardQueuedPulse, pendingCommands, replayOutbox,
  type ActIntent, type AuthorityEnvelope, type Command, type DecisionTrace,
  type Event, type EventDraft, type JsonValue, type PredicateRegistry, type WorkOrder,
} from "@dotln/kernel";

export const MINUTE = 60_000;
const WORKSTREAM = "ws_repo_garden";
const EPISODE = "ep_seiri_1";
const ACTOR = "repo-gardener";
const PULSE_SCHEDULE = "schedule_seiri_20m";
const QUEUED_PULSE = "schedule_seiri_already_queued";

export interface Candidate { readonly path: string; readonly classification: string; readonly evidence: readonly string[] }
export interface FixtureFile { readonly path: string; readonly referencedBy: readonly string[]; readonly classification: string }
export interface FixtureTree { readonly files: readonly FixtureFile[] }
export interface Loadout { readonly identity: "Repo Gardener"; readonly activeMechanic: "Seiri"; readonly semantics: readonly string[]; readonly normative: false }
export interface ScenarioOptions { readonly crashAfterPersist?: boolean }
export interface ScenarioResult {
  readonly log: string; readonly traces: readonly DecisionTrace[]; readonly timeline: readonly string[];
  readonly glyphScene: string; readonly workOrder: WorkOrder; readonly candidates: readonly Candidate[];
  readonly verified: boolean; readonly adapterEffects: number; readonly adapterDispatches: readonly string[];
  readonly cancelledScheduleIds: readonly string[]; readonly activeScheduleIds: readonly string[];
}

export const loadout: Loadout = {
  identity: "Repo Gardener", activeMechanic: "Seiri", normative: false,
  semantics: ["inventory", "classify", "analyze references", "propose deletion candidates", "attach evidence", "never delete"],
};

const presenceRef = { registryId: "operator.away", version: 1 } as const;
const statePresence = (state: JsonValue): JsonValue | undefined => state !== null && !Array.isArray(state) && typeof state === "object" ? (state as Readonly<Record<string, JsonValue>>)["presence"] : undefined;
const predicates: PredicateRegistry = {
  "operator.away": { 1: ({ state }) => statePresence(state) === "away" },
  "operator.returned": { 1: ({ state }) => statePresence(state) === "returned" },
};
const cadence = Cadence.Until(Cadence.Gate(Cadence.Every(20 * MINUTE), presenceRef), { registryId: "operator.returned", version: 1 });

export function compileWorkOrder(equipped: Loadout, baseCommit = "fixture-base"): WorkOrder {
  if (equipped.identity !== "Repo Gardener" || equipped.activeMechanic !== "Seiri" || !equipped.semantics.includes("never delete")) throw new Error("unsupported loadout");
  return {
    workOrderId: "wo_repo_inspection_1",
    objective: "Inspect the bounded fixture repository and propose safe deletion candidates.",
    acceptanceCriteria: ["Inventory every fixture path", "Classify every path", "Attach reference evidence to every candidate"],
    knownFacts: ["The repository is a deterministic fixture", "The operator is absent at dispatch"],
    decisions: [`${equipped.identity} uses ${equipped.activeMechanic}`, "Deletion remains operator-owned"],
    constraints: ["Inspect only the fixture tree", "Do not mutate repository contents"],
    nonGoals: ["Delete files", "Inspect another repository"],
    repo: "packages/skeleton/fixtures/repo-tree.json", baseCommit,
    allowedOperations: ["repo.inventory", "repo.classify", "repo.references", "repo.proposeDeletion"],
    prohibitedOperations: ["repo.delete", "repo.write"],
    requiredEvidence: ["inventory", "classification", "reference-analysis"],
    outputContract: { type: "CommandResult", result: "candidates", candidateFields: ["path", "classification", "evidence"] },
  };
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
    const candidates = this.fixture.files.filter(file => file.referencedBy.length === 0 && file.classification === "generated-stale")
      .map(file => ({ path: file.path, classification: file.classification, evidence: [`inventory:${file.path}`, `classification:${file.classification}`, "references:none"] }));
    this.#seen.set(command.commandId, candidates);
    return candidates;
  }
}

class FakeScheduler {
  readonly #active = new Set<string>();
  schedule(...ids: readonly string[]): void { for (const id of ids) this.#active.add(id); }
  cancel(ids: readonly string[]): void { for (const id of ids) this.#active.delete(id); }
  get activeScheduleIds(): readonly string[] { return [...this.#active]; }
}

type RuntimeState = { readonly presence: "away" | "returned"; readonly rngState: number; readonly policy: { readonly maintenance: string }; readonly loadout: JsonValue };
const initialState = (): RuntimeState => ({ presence: "returned", rngState: 17, policy: { maintenance: "absent-only" }, loadout: loadout as unknown as JsonValue });
function foldPresence(state: RuntimeState, event: Event): RuntimeState {
  if (event.type !== "OperatorPresenceChanged" || event.payload === null || Array.isArray(event.payload) || typeof event.payload !== "object") return state;
  const presence = (event.payload as Readonly<Record<string, JsonValue>>)["presence"];
  return presence === "away" || presence === "returned" ? { ...state, presence } : state;
}

const inspectIntent = (workOrder: WorkOrder): ActIntent => ({ kind: "Act", effect: "repo.inspect", resource: "inspections", payload: { workOrder: workOrder as unknown as JsonValue } });
const authority = (): AuthorityEnvelope => ({ authorityEnvelopeId: "auth_seiri", allowedEffects: ["repo.inspect"], deniedEffects: ["repo.delete", "repo.write"], resourceLimits: { inspections: 1 }, requiredEvidence: [], expiresAt: 40 * MINUTE, revocationEventTypes: ["OperatorPresenceChanged:return"] });
const verificationProgram = (workOrder: WorkOrder, at: number) => {
  const inspect = inspectIntent(workOrder);
  const id = commandId(WORKSTREAM, EPISODE, 1, 0);
  return Program.Invoke(id, inspect, { candidates: Program.Emit(draft("VerificationRequested", at + 2, { commandId: id }), Program.Done()) });
};

const verifier = (fixture: FixtureTree, candidates: readonly Candidate[]): boolean => candidates.length > 0 && candidates.every(candidate => {
  const source = fixture.files.find(file => file.path === candidate.path);
  return source?.referencedBy.length === 0 && candidate.evidence.length >= 3 && candidate.evidence.some(value => value === "references:none");
});

const draft = (type: string, occurredAt: number, payload: JsonValue, correlationId?: string): EventDraft => ({
  schemaVersion: 1, type, occurredAt, actorId: ACTOR, workstreamId: WORKSTREAM, episodeId: EPISODE,
  ...(correlationId === undefined ? {} : { correlationId }), payload,
});

function project(events: readonly Event[]): readonly string[] {
  return events.map((event, index) => `${String(index + 1).padStart(2, "0")} ${event.type} — ${event.eventId}`);
}
export function renderGlyphScene(events: readonly Event[]): string {
  const has = (type: string) => events.some(event => event.type === type);
  const latestPresence = events.filter(event => event.type === "OperatorPresenceChanged").at(-1);
  const returned = latestPresence?.payload !== null && !Array.isArray(latestPresence?.payload) && typeof latestPresence?.payload === "object" && (latestPresence.payload as Readonly<Record<string, JsonValue>>)["presence"] === "returned";
  return [`🐛 Repo Gardener`, `${returned ? "◌ dormant" : has("OperatorPresenceChanged") ? "🌙 active" : "○ dormant"}`, `${has("CadencePulse") ? "⏱️ pulsing" : "○ waiting"}`, `${has("CommandResult") ? "🔎 inspecting" : "○ unknown"}`, `${has("CommandRefused") ? "🛡️ inverted/refused" : "○ unguarded"}`, `${has("VerificationCompleted") ? "✅ verified" : "○ unverified"}`, `${returned ? "☀️ phase:returned" : "○ away"}`, `${has("QueuedPulseNoOp") ? "💤 faded/cancelled" : "○ scheduled"}`].join("  ");
}

export function replayScenario(log: string, fixture: FixtureTree): ScenarioResult {
  const events = decodeLog(log);
  const traces: DecisionTrace[] = [];
  let state = initialState();
  const result = events.find(event => event.type === "CommandResult");
  const candidates = result === undefined ? [] : ((result.payload as unknown as { candidates: readonly Candidate[] }).candidates ?? []);
  const workOrderEvent = events.find(event => event.type === "WorkOrderEmitted");
  if (!workOrderEvent) throw new Error("log lacks WorkOrderEmitted");
  const workOrder = (workOrderEvent.payload as unknown as { workOrder: WorkOrder }).workOrder;
  const program = verificationProgram(workOrder, workOrderEvent.occurredAt);
  let resultForContinuation: Event | undefined;
  for (const event of events) {
    if (event.type === "OperatorPresenceChanged") {
      state = foldPresence(state, event);
      if (state.presence === "away") {
        const evaluated = evaluateCadence(cadence, state, { now: event.occurredAt, rngState: state.rngState, predicates });
        traces.push({ reactorId: "seiri-cadence", reactorVersion: "1", branchPath: ["away", "scheduled"], envInputs: ["operatorPresence", "virtualTime"], cadenceEvaluations: [evaluated.trace] });
      }
    } else if (event.type === "WorkOrderEmitted") {
      traces.push(decideProgram(program, state, { now: event.occurredAt, rngState: state.rngState, predicates }).trace);
    } else if (event.type === "CommandResult") {
      resultForContinuation = event;
    } else if (event.type === "CommandRefused") {
      const deletion: ActIntent = { kind: "Act", effect: "repo.delete", payload: { paths: candidates.map(candidate => candidate.path) } };
      const replayed = authorize(deletion, authority(), { now: event.occurredAt, actorId: ACTOR, workstreamId: WORKSTREAM, episodeId: EPISODE, decisionIndex: 2, intentIndex: 0, evidence: candidates.flatMap(candidate => candidate.evidence), revokedBy: [] });
      if (replayed.authorized) throw new Error("replay unexpectedly authorized deletion");
      traces.push(replayed.trace);
    } else if (event.type === "EpisodeTerminated" && resultForContinuation !== undefined) {
      traces.push(decideProgram(program, state, { now: resultForContinuation.occurredAt, rngState: state.rngState, predicates }, resultForContinuation).trace);
    } else if (event.type === "CadencePulse" && state.presence === "returned" && event.payload !== null && typeof event.payload === "object" && !Array.isArray(event.payload) && (event.payload as Readonly<Record<string, JsonValue>>)["scheduleId"] === QUEUED_PULSE) {
      traces.push(guardQueuedPulse(state, event, { now: event.occurredAt, rngState: state.rngState, predicates, policy: state.policy }, presenceRef, [PULSE_SCHEDULE, QUEUED_PULSE]).trace);
    }
  }
  const cancelled = events.find(event => event.type === "SchedulesCancelled");
  const cancelledScheduleIds = cancelled === undefined ? [] : (cancelled.payload as { scheduleIds: readonly string[] }).scheduleIds;
  const verifiedEvent = events.find(event => event.type === "VerificationCompleted");
  const verified = verifiedEvent !== undefined && verifiedEvent.payload !== null && !Array.isArray(verifiedEvent.payload) && typeof verifiedEvent.payload === "object" && (verifiedEvent.payload as Readonly<Record<string, JsonValue>>)["accepted"] === true;
  return { log, traces, timeline: project(events), glyphScene: renderGlyphScene(events), workOrder, candidates, verified, adapterEffects: 0, adapterDispatches: [], cancelledScheduleIds, activeScheduleIds: [] };
}

export function runScenario(fixture: FixtureTree, options: ScenarioOptions = {}): ScenarioResult {
  let log = "";
  const traces: DecisionTrace[] = [];
  const append = (event: EventDraft): Event => { const result = appendEvent(log, event); log = result.log; return result.event; };
  const recordTrace = (trace: DecisionTrace, at: number): void => { traces.push(trace); append(draft("DecisionRecorded", at, { trace: trace as unknown as JsonValue })); };

  append(draft("InspectionTaskCreated", 0, { bounded: true, fixture: "repo-tree.json" }));
  append(draft("LoadoutEquipped", 0, loadout as unknown as JsonValue));
  let state = initialState();
  state = foldPresence(state, append(draft("OperatorPresenceChanged", 0, { presence: "away" })));
  const cadenceResult = evaluateCadence(cadence, state, { now: 0, rngState: state.rngState, predicates });
  const cadenceTrace: DecisionTrace = { reactorId: "seiri-cadence", reactorVersion: "1", branchPath: ["away", "scheduled"], envInputs: ["operatorPresence", "virtualTime"], cadenceEvaluations: [cadenceResult.trace] };
  recordTrace(cadenceTrace, 0);
  if (cadenceResult.dueAt !== 20 * MINUTE) throw new Error("unexpected cadence pulse");
  const pulse = append(draft("CadencePulse", cadenceResult.dueAt, { scheduleId: PULSE_SCHEDULE }));
  const workOrder = compileWorkOrder(loadout);
  append(draft("WorkOrderEmitted", pulse.occurredAt, { workOrder: workOrder as unknown as JsonValue }, pulse.eventId));

  const inspect = inspectIntent(workOrder);
  const auth = authorize(inspect, authority(), { now: pulse.occurredAt, actorId: ACTOR, workstreamId: WORKSTREAM, episodeId: EPISODE, decisionIndex: 1, intentIndex: 0, evidence: [], revokedBy: [] });
  if (!auth.authorized) throw new Error(auth.refusal.payload.reason);
  const command = auth.command;
  const program = verificationProgram(workOrder, pulse.occurredAt);
  const initialProgramDecision = decideProgram(program, state, { now: pulse.occurredAt, rngState: state.rngState, predicates });
  recordTrace(initialProgramDecision.trace, pulse.occurredAt);
  append(draft("CommandPersisted", pulse.occurredAt + 1, { command: command as unknown as JsonValue }, pulse.eventId));

  const adapter = new FakeExecutor(fixture);
  if (options.crashAfterPersist) {
    const recovered = replayOutbox(decodeLog(log));
    for (const pending of pendingCommands(recovered)) {
      adapter.dispatch(pending);
      append(draft("CommandRedispatched", pulse.occurredAt + 1, { commandId: pending.commandId }));
    }
  }
  const candidates = adapter.dispatch(command);
  const commandResult = append(draft("CommandResult", pulse.occurredAt + 2, { commandId: command.commandId, result: "candidates", candidates: candidates as unknown as JsonValue }, command.commandId));
  const deletion: ActIntent = { kind: "Act", effect: "repo.delete", payload: { paths: candidates.map(candidate => candidate.path) } };
  append(draft("DeletionAttempted", pulse.occurredAt + 3, { effect: deletion.effect, paths: candidates.map(candidate => candidate.path) }));
  const refused = authorize(deletion, auth.authority, { now: pulse.occurredAt + 3, actorId: ACTOR, workstreamId: WORKSTREAM, episodeId: EPISODE, decisionIndex: 2, intentIndex: 0, evidence: candidates.flatMap(candidate => candidate.evidence), revokedBy: [] });
  if (refused.authorized) throw new Error("deletion unexpectedly authorized");
  append(refused.refusal);
  recordTrace(refused.trace, pulse.occurredAt + 3);
  append(draft("EpisodeTerminated", pulse.occurredAt + 4, { continuation: "verification" }));
  const continued = decideProgram(program, state, { now: commandResult.occurredAt, rngState: state.rngState, predicates }, commandResult);
  recordTrace(continued.trace, pulse.occurredAt + 4);
  if (continued.continuation?.kind !== "Emit") throw new Error("Invoke continuation did not select verification");
  append(continued.continuation.event);
  const verified = verifier(fixture, candidates);
  append(draft("VerificationCompleted", pulse.occurredAt + 5, { accepted: verified, candidateCount: candidates.length }));

  state = foldPresence(state, append(draft("OperatorPresenceChanged", pulse.occurredAt + 6, { presence: "returned" })));
  const scheduler = new FakeScheduler();
  scheduler.schedule(PULSE_SCHEDULE, QUEUED_PULSE);
  const queued = append(draft("CadencePulse", pulse.occurredAt + 7, { scheduleId: QUEUED_PULSE }));
  const guarded = guardQueuedPulse(state, queued, { now: queued.occurredAt, rngState: state.rngState, predicates, policy: state.policy }, presenceRef, [PULSE_SCHEDULE, QUEUED_PULSE]);
  recordTrace(guarded.trace, queued.occurredAt);
  append(draft("QueuedPulseNoOp", queued.occurredAt, { reason: "operator returned", evidence: [queued.eventId] }));
  scheduler.cancel(guarded.cancelledScheduleIds);
  append(draft("SchedulesCancelled", queued.occurredAt, { scheduleIds: guarded.cancelledScheduleIds, activeScheduleIds: scheduler.activeScheduleIds }));
  const events = decodeLog(log);
  return { log, traces, timeline: project(events), glyphScene: renderGlyphScene(events), workOrder, candidates, verified, adapterEffects: adapter.effects, adapterDispatches: adapter.dispatches, cancelledScheduleIds: guarded.cancelledScheduleIds, activeScheduleIds: scheduler.activeScheduleIds };
}

export const expectedInspectCommandId = commandId(WORKSTREAM, EPISODE, 1, 0);
