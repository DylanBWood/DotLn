import test from "node:test";
import assert from "node:assert/strict";
import { Cadence, Program, appendEvent, authorize, decodeLog, encodeLog, evaluateCadence, replay, stepProgram } from "../src/index.js";
import type { ActIntent, AuthorityEnvelope, Event, EventDraft, JsonValue, KernelEnv, PredicateRegistry, Reactor } from "../src/index.js";

const stateValue = (state: JsonValue, key: string): JsonValue | undefined => state !== null && !Array.isArray(state) && typeof state === "object" ? (state as Readonly<Record<string, JsonValue>>)[key] : undefined;
const predicates: PredicateRegistry = { "state.flag": { 1: ({ state }) => stateValue(state, "flag") === true } };
const env = (now = 100, rngState = 7): KernelEnv => ({ now, rngState, predicates });
const draft = <P extends JsonValue>(type: string, at: number, payload: P): EventDraft<string, P> => ({ schemaVersion: 1, type, occurredAt: at, actorId: "a", workstreamId: "ws", payload });

// Deliberate poison-and-restore: AC2 clause 3 says replay consults nothing outside
// the log, so the ambient sources are stubbed to THROW for the duration of the
// kernel call and restored in finally. Any kernel read of Date.now/Math.random fails loudly.
const poisoned = <R>(run: () => R): R => {
  const realNow = Date.now;
  const realRandom = Math.random;
  globalThis.Date.now = () => { throw new Error("kernel consulted ambient Date.now"); };
  globalThis.Math.random = () => { throw new Error("kernel consulted ambient Math.random"); };
  try { return run(); } finally { globalThis.Date.now = realNow; globalThis.Math.random = realRandom; }
};

test("AC2 evidence: replay consults nothing outside the log — Date.now and Math.random poisoned to throw", () => {
  let log = "";
  ({ log } = appendEvent(log, { schemaVersion: 1, type: "Added", occurredAt: 10, actorId: "a", workstreamId: "ws", episodeId: "ep-1", correlationId: "corr-1", causationId: "evt_0", payload: { amount: 2 } }));
  ({ log } = appendEvent(log, { schemaVersion: 1, type: "Added", occurredAt: 20, actorId: "a", workstreamId: "ws", payload: { amount: 3 } }));
  ({ log } = appendEvent(log, { schemaVersion: 1, type: "Added", occurredAt: 30, actorId: "a", workstreamId: "ws", payload: { amount: 5 } }));
  type SumState = { readonly total: number; readonly rngState: number; readonly seenTimes: readonly number[] };
  const reactor: Reactor<SumState> = (state, incoming, environment) => {
    const payload = incoming.payload as Readonly<Record<string, JsonValue>>;
    return { state: { total: state.total + Number(payload.amount), rngState: environment.rngState, seenTimes: [...state.seenTimes, environment.now] }, intents: [], schedules: [], trace: { reactorId: "sum", reactorVersion: "1", branchPath: [incoming.type], envInputs: [`now:${environment.now}`, `rng:${environment.rngState}`], cadenceEvaluations: [] } };
  };
  const initial: SumState = { total: 0, rngState: 11, seenTimes: [] };
  const first = poisoned(() => replay(initial, decodeLog(log), reactor, predicates));
  const second = poisoned(() => replay(initial, decodeLog(encodeLog(decodeLog(log))), reactor, predicates));
  assert.deepEqual(second, first);
  assert.deepEqual(first.state, { total: 10, rngState: 11, seenTimes: [10, 20, 30] });
  assert.deepEqual(first.decisions.map(decision => decision.trace.envInputs), [["now:10", "rng:11"], ["now:20", "rng:11"], ["now:30", "rng:11"]]);
});

test("AC2 evidence: evaluateCadence, stepProgram, and authorize never read ambient time or randomness under poison", () => {
  poisoned(() => {
    // Cadence: every evaluated kind that touches time or RNG, with literal pins.
    assert.equal(evaluateCadence(Cadence.Once(150), {}, env()).dueAt, 150);
    assert.equal(evaluateCadence(Cadence.After(25), {}, env()).dueAt, 125);
    assert.equal(evaluateCadence(Cadence.Every(20, 50), {}, env(110)).dueAt, 130);
    assert.equal(evaluateCadence(Cadence.Until(Cadence.Every(20), { registryId: "state.flag", version: 1 }), { flag: true }, env()).dueAt, null);
    assert.deepEqual(evaluateCadence(Cadence.Backoff(100, 2, 100000, 1, .5), {}, env(1000, 42)), { dueAt: 1150, rngState: 1083814273, trace: "Backoff:1:150" });
    assert.deepEqual(evaluateCadence(Cadence.Backoff(100, 2, 100000, 1, .5), {}, env(1000, 7)), { dueAt: 1148, rngState: 1025555898, trace: "Backoff:1:148" });

    // Program: Invoke dispatch, result consumption, and Await matching.
    const program = Program.Sequence([Program.Invoke("cmd_1", { kind: "Act", effect: "model.call", payload: {} }, { ok: Program.Await({ type: "Approved", correlationId: "c1" }, Cadence.After(5), Program.Done()) })]);
    const dispatch = stepProgram(program, { flag: true }, env());
    assert.deepEqual(dispatch.intents, [{ kind: "Act", effect: "model.call", payload: {} }]);
    const resultEvent: Event = { schemaVersion: 1, eventId: "r1", type: "CommandResult", occurredAt: 5, actorId: "a", workstreamId: "ws", payload: { commandId: "cmd_1", result: "ok" } };
    const consumed = stepProgram(dispatch.residual, { flag: true }, env(), resultEvent);
    assert.deepEqual(consumed.residual, Program.Sequence([Program.Await({ type: "Approved", correlationId: "c1" }, Cadence.After(5), Program.Done())]));
    const approved: Event = { schemaVersion: 1, eventId: "ap1", type: "Approved", occurredAt: 6, actorId: "a", workstreamId: "ws", correlationId: "c1", payload: {} };
    assert.deepEqual(stepProgram(consumed.residual, { flag: true }, env(), approved).residual, Program.Done());

    // Authorization: one grant with resource accounting, one structural refusal.
    const intent: ActIntent = { kind: "Act", effect: "write", resource: "cpu", payload: {} };
    const envelope: AuthorityEnvelope = { authorityEnvelopeId: "auth-1", allowedEffects: ["write"], deniedEffects: [], resourceLimits: { cpu: 1 }, requiredEvidence: [], expiresAt: 999, revocationEventTypes: [] };
    const context = { now: 1, actorId: "a", workstreamId: "ws", episodeId: "ep", decisionIndex: 3, intentIndex: 0, evidence: [], revokedBy: [] };
    const granted = authorize(intent, envelope, context);
    assert.equal(granted.authorized, true);
    if (granted.authorized) assert.deepEqual(granted.authority.resourceLimits, { cpu: 0 });
    const refused = authorize({ kind: "Act", effect: "read", payload: {} }, envelope, context);
    assert.equal(refused.authorized, false);
    if (!refused.authorized) {
      assert.equal(refused.refusal.payload.reason, "effect not allowed");
      assert.deepEqual(refused.trace.branchPath, ["refused", "effect not allowed"]);
    }
  });
});

test("AC2 evidence: appendEvent edge-assigns sequential literal eventIds evt_1..evt_4", () => {
  let log = "";
  const returned: Event[] = [];
  for (const amount of [1, 2, 3, 4]) {
    const appended = appendEvent(log, draft("Added", amount * 10, { amount }));
    log = appended.log;
    returned.push(appended.event);
  }
  assert.deepEqual(returned.map(event => event.eventId), ["evt_1", "evt_2", "evt_3", "evt_4"]);
  const decoded = decodeLog(log);
  assert.deepEqual(decoded.map(event => event.eventId), ["evt_1", "evt_2", "evt_3", "evt_4"]);
  assert.deepEqual(decoded, returned);
  const lines = log.trimEnd().split("\n");
  assert.equal(lines.length, 4);
  lines.forEach((line, index) => assert.equal((JSON.parse(line) as Event).eventId, `evt_${index + 1}`));
});

test("AC2 evidence: store round trip preserves correlationId, causationId, and episodeId", () => {
  const { log, event: assigned } = appendEvent("", { schemaVersion: 1, type: "Linked", occurredAt: 42, actorId: "actor-1", workstreamId: "ws-1", episodeId: "ep-9", correlationId: "corr-7", causationId: "evt_0", payload: { ref: "r" } });
  assert.deepEqual(assigned, { schemaVersion: 1, eventId: "evt_1", type: "Linked", occurredAt: 42, actorId: "actor-1", workstreamId: "ws-1", episodeId: "ep-9", correlationId: "corr-7", causationId: "evt_0", payload: { ref: "r" } });
  const decoded = decodeLog(log);
  assert.deepEqual(decoded, [assigned]);
  const roundTripped = decodeLog(encodeLog(decoded));
  assert.deepEqual(roundTripped, decoded);
  assert.equal(roundTripped[0]?.correlationId, "corr-7");
  assert.equal(roundTripped[0]?.causationId, "evt_0");
  assert.equal(roundTripped[0]?.episodeId, "ep-9");
});

test("AC2 evidence: encodeLog ends with a newline so appendEvent after a round trip stays well-formed", () => {
  assert.equal(encodeLog([]), "");
  let log = "";
  ({ log } = appendEvent(log, draft("Added", 10, { amount: 2 })));
  ({ log } = appendEvent(log, draft("Added", 20, { amount: 3 })));
  const reencoded = encodeLog(decodeLog(log));
  assert.ok(reencoded.endsWith("\n"), "encodeLog must terminate the log with a newline");
  assert.equal(reencoded, log);
  const third = appendEvent(reencoded, draft("Added", 30, { amount: 5 }));
  const decoded = decodeLog(third.log);
  assert.equal(decoded.length, 3);
  assert.deepEqual(decoded.map(event => event.eventId), ["evt_1", "evt_2", "evt_3"]);
  assert.deepEqual(decoded[2]?.payload, { amount: 5 });
  assert.equal(decoded[2]?.occurredAt, 30);
});
