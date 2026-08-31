import { Cadence, Program, type ActIntent, type AuthorityEnvelope, type Command, type Decision, type DecisionTrace, type Event, type EventDraft, type EventEnvelope, type JsonValue, type KernelEnv, type OutboxState, type PredicateRef, type PredicateRegistry, type Reactor } from "./types.js";

export function predicate(ref: PredicateRef, state: JsonValue, env: KernelEnv, event?: Event): boolean {
  const fn = env.predicates[ref.registryId]?.[ref.version];
  if (!fn) throw new Error(`Unknown predicate ${ref.registryId}@${ref.version}`);
  return fn({ state, ...(event === undefined ? {} : { event }), env }, ref.params ?? {});
}

export interface CadenceResult { readonly dueAt: number | null; readonly rngState: number; readonly trace: string }
function draw(state: number): readonly [number, number] {
  const next = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return [next / 0x100000000, next];
}
export function evaluateCadence(cadence: Cadence.T, state: JsonValue, env: KernelEnv, event?: Event): CadenceResult {
  switch (cadence.kind) {
    case "Once": return { dueAt: cadence.at, rngState: env.rngState, trace: `Once:${cadence.at}` };
    case "After": return { dueAt: env.now + cadence.delayMs, rngState: env.rngState, trace: `After:${cadence.delayMs}` };
    case "Every": { if (!Number.isFinite(cadence.intervalMs) || cadence.intervalMs <= 0) throw new Error("Every intervalMs must be positive"); const start = cadence.startAt ?? 0; const due = env.now < start ? start : start + (Math.floor((env.now - start) / cadence.intervalMs) + 1) * cadence.intervalMs; return { dueAt: due, rngState: env.rngState, trace: `Every:${cadence.intervalMs}` }; }
    case "Gate": return predicate(cadence.conditionRef, state, env, event) ? evaluateCadence(cadence.cadence, state, env, event) : { dueAt: null, rngState: env.rngState, trace: "Gate:closed" };
    case "Until": return predicate(cadence.conditionRef, state, env, event) ? { dueAt: null, rngState: env.rngState, trace: "Until:cancelled" } : evaluateCadence(cadence.cadence, state, env, event);
    case "Backoff": { const [unit, next] = draw(env.rngState); const base = cadence.initialMs * cadence.factor ** cadence.attempt; const delay = Math.min(cadence.maxMs, Math.max(0, Math.round(base * (1 + (unit * 2 - 1) * cadence.jitter)))); return { dueAt: env.now + delay, rngState: next, trace: `Backoff:${cadence.attempt}:${delay}` }; }
    default: throw new Error(`Cadence ${cadence.kind} evaluation is deferred`);
  }
}

export interface ProgramStep { readonly residual: Program.T; readonly emitted: readonly EventDraft[]; readonly intents: readonly ActIntent[]; readonly waits: readonly Program.Await[] }
export function stepProgram(program: Program.T, state: JsonValue, env: KernelEnv, event?: Event): ProgramStep {
  switch (program.kind) {
    case "Done": return { residual: program, emitted: [], intents: [], waits: [] };
    case "Emit": return { residual: program.next, emitted: [program.event], intents: [], waits: [] };
    case "Invoke": {
      const payload = event?.payload as Readonly<Record<string, JsonValue>> | undefined;
      const result = payload?.result;
      const matches = event?.type === "CommandResult" && payload?.commandId === program.commandId && typeof result === "string";
      if (!matches) return { residual: program, emitted: [], intents: event === undefined ? [program.command] : [], waits: [] };
      const continuation = Object.hasOwn(program.continuationByResult, result) ? program.continuationByResult[result] : undefined;
      if (!continuation) throw new Error(`No Invoke continuation for result ${result}`);
      return { residual: continuation, emitted: [], intents: [], waits: [] };
    }
    case "Await": {
      const payload = event !== undefined && event.payload !== null && !Array.isArray(event.payload) && typeof event.payload === "object" ? event.payload as Readonly<Record<string, JsonValue>> : undefined;
      const matches = event !== undefined && event.type === program.pattern.type && (program.pattern.correlationId === undefined || event.correlationId === program.pattern.correlationId) && (program.pattern.commandId === undefined || payload?.commandId === program.pattern.commandId);
      return matches ? { residual: program.next, emitted: [], intents: [], waits: [] } : { residual: program, emitted: [], intents: [], waits: [program] };
    }
    case "Guard": return stepProgram(predicate(program.conditionRef, state, env, event) ? program.whenTrue : program.whenFalse, state, env, event);
    case "Sequence": {
      const [head, ...tail] = program.programs;
      if (!head) return { residual: Program.Done(), emitted: [], intents: [], waits: [] };
      const result = stepProgram(head, state, env, event);
      const remaining = result.residual.kind === "Done" ? tail : [result.residual, ...tail];
      return { ...result, residual: remaining.length === 0 ? Program.Done() : Program.Sequence(remaining) };
    }
    default: throw new Error(`Program ${program.kind} evaluation is deferred`);
  }
}

export interface ProgramDecision<S extends JsonValue = JsonValue> extends Decision<S> { readonly emitted: readonly EventDraft[]; readonly waits: readonly Program.Await[] }
export function decideProgram<S extends JsonValue>(program: Program.T, state: S, env: KernelEnv, event?: Event): ProgramDecision<S> {
  const step = stepProgram(program, state, env, event);
  return { state, intents: step.intents, continuation: step.residual, schedules: [], trace: { reactorId: "program", reactorVersion: "1", branchPath: [program.kind, step.residual.kind], envInputs: event === undefined ? [] : ["event"], cadenceEvaluations: step.waits.map(wait => `await:${wait.pattern.type}`) }, emitted: step.emitted, waits: step.waits };
}

export const serializeContinuation = (program: Program.T): string => JSON.stringify(program);
export const deserializeContinuation = (value: string): Program.T => JSON.parse(value) as Program.T;

export function stableHash(value: string): string { let h = 0xcbf29ce484222325n; for (const byte of new TextEncoder().encode(value)) h = ((h ^ BigInt(byte)) * 0x100000001b3n) & 0xffffffffffffffffn; return h.toString(16).padStart(16, "0"); }
export function commandId(workstreamId: string, episodeId: string | undefined, decisionIndex: number, intentIndex: number): string { return `cmd_${stableHash(`${episodeId ? `ep:${episodeId}` : `ws:${workstreamId}`}:${decisionIndex}:${intentIndex}`)}`; }

export type AuthorizationResult = { readonly authorized: true; readonly command: Command; readonly authority: AuthorityEnvelope } | { readonly authorized: false; readonly refusal: Omit<EventEnvelope<"CommandRefused", { readonly intentIndex: number; readonly reason: string; readonly authorityEnvelopeId: string }>, "eventId">; readonly trace: DecisionTrace };
const effectMatches = (pattern: string, effect: string): boolean => pattern.endsWith("*") ? effect.startsWith(pattern.slice(0, -1)) : pattern === effect;
export function authorize(intent: ActIntent, envelope: AuthorityEnvelope, context: { readonly now: number; readonly actorId: string; readonly workstreamId: string; readonly episodeId?: string; readonly decisionIndex: number; readonly intentIndex: number; readonly evidence: readonly string[]; readonly revokedBy: readonly Event[] }): AuthorizationResult {
  const ownsResource = intent.resource === undefined || Object.hasOwn(envelope.resourceLimits, intent.resource);
  const reason = typeof intent.effect !== "string" ? "effect is not a string" : context.now > envelope.expiresAt ? "authority expired" : envelope.revocationEventTypes.some(t => context.revokedBy.some(e => e.type === t)) ? "authority revoked" : envelope.deniedEffects.some(pattern => effectMatches(pattern, intent.effect)) ? "effect denied" : !envelope.allowedEffects.some(pattern => effectMatches(pattern, intent.effect)) ? "effect not allowed" : envelope.requiredEvidence.some(e => !context.evidence.includes(e)) ? "required evidence missing" : intent.resource !== undefined && (!ownsResource || envelope.resourceLimits[intent.resource]! <= 0) ? "resource limit exceeded" : undefined;
  if (reason === undefined) {
    const resourceLimits = intent.resource === undefined ? envelope.resourceLimits : { ...envelope.resourceLimits, [intent.resource]: envelope.resourceLimits[intent.resource]! - 1 };
    return { authorized: true, command: { commandId: commandId(context.workstreamId, context.episodeId, context.decisionIndex, context.intentIndex), ...(context.episodeId === undefined ? {} : { episodeId: context.episodeId }), workstreamId: context.workstreamId, intent }, authority: { ...envelope, resourceLimits } };
  }
  return { authorized: false, refusal: { schemaVersion: 1, type: "CommandRefused", occurredAt: context.now, actorId: context.actorId, workstreamId: context.workstreamId, ...(context.episodeId === undefined ? {} : { episodeId: context.episodeId }), payload: { intentIndex: context.intentIndex, reason, authorityEnvelopeId: envelope.authorityEnvelopeId } }, trace: { reactorId: "authority-guard", reactorVersion: "1", branchPath: ["refused", reason], envInputs: ["now", "authorityEnvelope", "evidence", "revocations"], cadenceEvaluations: [] } };
}

export interface ReplayResult<S extends JsonValue> { readonly state: S; readonly decisions: readonly Decision<S>[] }
function stateField(state: JsonValue, key: string): JsonValue | undefined { return state !== null && !Array.isArray(state) && typeof state === "object" ? (state as Readonly<Record<string, JsonValue>>)[key] : undefined; }
export function replay<S extends JsonValue>(initial: S, events: readonly Event[], reactor: Reactor<S>, predicates: PredicateRegistry): ReplayResult<S> {
  let state = initial;
  const decisions: Decision<S>[] = [];
  for (const event of events) {
    const rngState = stateField(state, "rngState");
    const policy = stateField(state, "policy");
    const env: KernelEnv = { now: event.occurredAt, rngState: typeof rngState === "number" ? rngState : 0, predicates, ...(policy === undefined ? {} : { policy }) };
    const decision = reactor(state, event, env);
    decisions.push(decision);
    state = decision.state;
  }
  return { state, decisions };
}

export const emptyOutbox = (): OutboxState => ({ entries: {} });
export function persistCommand(state: OutboxState, command: Command): OutboxState {
  return Object.hasOwn(state.entries, command.commandId) ? state : { entries: { ...state.entries, [command.commandId]: { command, status: "pending" } } };
}
export const pendingCommands = (state: OutboxState): readonly Command[] => Object.values(state.entries).filter(entry => entry.status === "pending").map(entry => entry.command);
export function replayOutbox(events: readonly Event[]): OutboxState {
  let state = emptyOutbox();
  for (const event of events) {
    if (event.type === "CommandPersisted") {
      const payload = event.payload !== null && !Array.isArray(event.payload) && typeof event.payload === "object" ? event.payload as Readonly<Record<string, JsonValue>> : undefined;
      const command = payload !== undefined && payload["command"] !== null && !Array.isArray(payload["command"]) && typeof payload["command"] === "object" ? payload["command"] as unknown as Command : undefined;
      if (command !== undefined && typeof command.commandId === "string" && command.commandId !== "") state = persistCommand(state, command);
    } else if (event.type === "CommandResult") {
      state = applyCommandResult(state, event).state;
    }
  }
  return state;
}
export function applyCommandResult(state: OutboxState, result: Event): { readonly state: OutboxState; readonly trace: DecisionTrace } {
  if (result.type !== "CommandResult") return { state, trace: { reactorId: "outbox", reactorVersion: "1", branchPath: ["result", "ignored-event-type"], envInputs: ["eventType"], cadenceEvaluations: [] } };
  const command = result.payload !== null && !Array.isArray(result.payload) && typeof result.payload === "object" ? (result.payload as Readonly<Record<string, JsonValue>>)["commandId"] : undefined;
  if (typeof command !== "string" || !Object.hasOwn(state.entries, command)) return { state, trace: { reactorId: "outbox", reactorVersion: "1", branchPath: ["result", "unknown"], envInputs: ["commandId"], cadenceEvaluations: [] } };
  const current = state.entries[command]!;
  if (current.status === "completed") return { state, trace: { reactorId: "outbox", reactorVersion: "1", branchPath: ["result", "dedup"], envInputs: ["commandId"], cadenceEvaluations: [] } };
  return { state: { entries: { ...state.entries, [command]: { ...current, status: "completed", resultEventId: result.eventId } } }, trace: { reactorId: "outbox", reactorVersion: "1", branchPath: ["result", "accepted"], envInputs: ["commandId"], cadenceEvaluations: [] } };
}
export interface PresenceDecision<S extends JsonValue = JsonValue> extends Decision<S> { readonly cancelledScheduleIds: readonly string[] }
export function guardQueuedPulse<S extends JsonValue>(state: S, pulse: Event, env: KernelEnv, presenceRef: PredicateRef, futureScheduleIds: readonly string[]): PresenceDecision<S> {
  const away = predicate(presenceRef, state, env, pulse);
  const cancelledScheduleIds = away ? [] : futureScheduleIds;
  return { state, intents: away ? [] : [{ kind: "NoOp", reason: "operator returned", evidence: [pulse.eventId], reevaluation: Cadence.Once(pulse.occurredAt), usefulWhen: presenceRef }], schedules: [], cancelledScheduleIds, trace: { reactorId: "presence-guard", reactorVersion: "1", branchPath: ["queued-pulse", away ? "active" : "noop"], envInputs: ["operatorPresence"], cadenceEvaluations: cancelledScheduleIds.map(id => `cancel:${id}`) } };
}
