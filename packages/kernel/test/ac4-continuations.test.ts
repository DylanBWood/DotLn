import test from "node:test";
import assert from "node:assert/strict";
import { Cadence, Program, decideProgram, deserializeContinuation, serializeContinuation, stepProgram } from "../src/index.js";
import type { ActIntent, Event, EventDraft, EventEnvelope, JsonValue, KernelEnv, PredicateRef, PredicateRegistry } from "../src/index.js";

const event = <P extends JsonValue = Record<string, never>>(id: string, type: string, at: number, payload: P = {} as P): EventEnvelope<string, P> => ({ schemaVersion: 1, eventId: id, type, occurredAt: at, actorId: "actor", workstreamId: "ws", episodeId: "ep", payload });
const draft = <P extends JsonValue = Record<string, never>>(type: string, at: number, payload: P = {} as P): EventDraft<string, P> => ({ schemaVersion: 1, type, occurredAt: at, actorId: "actor", workstreamId: "ws", episodeId: "ep", payload });
const stateValue = (state: JsonValue, key: string): JsonValue | undefined => state !== null && !Array.isArray(state) && typeof state === "object" ? (state as Readonly<Record<string, JsonValue>>)[key] : undefined;
const predicates: PredicateRegistry = { "state.flag": { 1: ({ state }) => stateValue(state, "flag") === true } };
const env = (now = 100, rngState = 7): KernelEnv => ({ now, rngState, predicates });

const invokeIntent: ActIntent = { kind: "Act", effect: "model.call", payload: { prompt: "original" } };
const invokeProgram = (): Program.Invoke => Program.Invoke("cmd_1", invokeIntent, { ok: Program.Done() });
const flagRef: PredicateRef = { registryId: "state.flag", version: 1, params: { expected: true } };

// Structural closure check: runs on the PRE-serialization value, so a
// function-valued field cannot hide behind JSON.stringify dropping it.
function assertNoFunctions(value: unknown, path: string): void {
  assert.notEqual(typeof value, "function", `closure found at ${path}`);
  if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) assertNoFunctions(child, `${path}.${key}`);
  }
}

// Round-trip discipline applied to every reachable residual: no closures
// before serialization, JSON.stringify never undefined, lossless round trip.
function roundTrip(residual: Program.T, label: string): Program.T {
  assertNoFunctions(residual, label);
  const serialized = serializeContinuation(residual);
  assert.equal(typeof serialized, "string", `${label}: serializeContinuation produced ${typeof serialized}`);
  const revived = deserializeContinuation(serialized);
  assert.deepEqual(revived, residual, `${label}: round trip lost information`);
  return revived;
}

test("AC4 evidence: Invoke refuses a foreign commandId — residual deep-equals pre-step program, intents empty, no re-dispatch on any unrelated event", () => {
  const program = invokeProgram();
  // Dispatch happens exactly once, on the no-event step.
  const dispatch = stepProgram(program, { flag: true }, env());
  assert.deepEqual(dispatch.intents, [{ kind: "Act", effect: "model.call", payload: { prompt: "original" } }]);
  assert.deepEqual(dispatch.residual, { kind: "Invoke", commandId: "cmd_1", command: { kind: "Act", effect: "model.call", payload: { prompt: "original" } }, continuationByResult: { ok: { kind: "Done" } } });
  // Wrong commandId: the whole residual is the untouched Invoke, not merely the same kind.
  const wrongId = stepProgram(program, { flag: true }, env(), event("r-wrong", "CommandResult", 5, { commandId: "cmd_other", result: "ok" }));
  assert.deepEqual(wrongId.residual, program);
  assert.deepEqual(wrongId.intents, []);
  assert.deepEqual(wrongId.emitted, []);
  assert.deepEqual(wrongId.waits, []);
  // A stream of unrelated events must never surface the command intent again.
  const unrelated: readonly Event[] = [
    event("u1", "CommandResult", 6, { commandId: "cmd_other", result: "ok" }),
    event("u2", "CommandResult", 7, { commandId: "cmd_1", result: 42 }),
    event("u3", "Approved", 8, { commandId: "cmd_1", result: "ok" }),
    event("u4", "CadencePulse", 9),
    event("u5", "CommandResult", 10, null),
    event("u6", "CommandResult", 11, ["commandId", "cmd_1"]),
  ];
  for (const unrelatedEvent of unrelated) {
    const step = stepProgram(program, { flag: true }, env(), unrelatedEvent);
    assert.deepEqual(step.intents, [], `re-dispatched on ${unrelatedEvent.eventId}`);
    assert.deepEqual(step.residual, program, `advanced on ${unrelatedEvent.eventId}`);
    assert.deepEqual(step.emitted, [], `emitted on ${unrelatedEvent.eventId}`);
  }
});

test("AC4 evidence: Invoke ignores event type — a non-CommandResult event carrying a matching payload must not advance", () => {
  const program = invokeProgram();
  const masquerade = stepProgram(program, { flag: true }, env(), event("masq", "Approved", 5, { commandId: "cmd_1", result: "ok" }));
  assert.deepEqual(masquerade.residual, program);
  assert.deepEqual(masquerade.intents, []);
  assert.deepEqual(masquerade.waits, []);
  // The genuine correlated result is the only event that advances.
  const advanced = stepProgram(program, { flag: true }, env(), event("real", "CommandResult", 5, { commandId: "cmd_1", result: "ok" }));
  assert.deepEqual(advanced.residual, { kind: "Done" });
  assert.deepEqual(advanced.intents, []);
});

test("AC4 evidence: Await ignores wrong correlationId and wrong type — residual stays the Await and the waits channel reports it", () => {
  const awaitNode = Program.Await({ type: "Approved", correlationId: "corr-1" }, Cadence.After(1000), Program.Done());
  const wrongCorrelation = stepProgram(awaitNode, {}, env(), { ...event("a1", "Approved", 5), correlationId: "corr-2" });
  assert.deepEqual(wrongCorrelation.residual, awaitNode);
  assert.deepEqual(wrongCorrelation.waits, [awaitNode]);
  assert.deepEqual(wrongCorrelation.intents, []);
  assert.deepEqual(wrongCorrelation.emitted, []);
  const wrongType = stepProgram(awaitNode, {}, env(), { ...event("a2", "Rejected", 5), correlationId: "corr-1" });
  assert.deepEqual(wrongType.residual, awaitNode);
  assert.deepEqual(wrongType.waits, [awaitNode]);
  assert.deepEqual(wrongType.intents, []);
  const noEvent = stepProgram(awaitNode, {}, env());
  assert.deepEqual(noEvent.residual, awaitNode);
  assert.deepEqual(noEvent.waits, [awaitNode]);
  // Only the fully matching event advances, and the wait clears.
  const matched = stepProgram(awaitNode, {}, env(), { ...event("a3", "Approved", 5), correlationId: "corr-1" });
  assert.deepEqual(matched.residual, { kind: "Done" });
  assert.deepEqual(matched.waits, []);
});

test("AC4 evidence: decideProgram returns the full literal decision on the no-event dispatch path", () => {
  const program = invokeProgram();
  const state = { flag: true, cursor: 3 };
  const decision = decideProgram(program, state, env());
  assert.equal(decision.state, state, "state must pass through by reference");
  assert.deepEqual(decision, {
    state: { flag: true, cursor: 3 },
    intents: [{ kind: "Act", effect: "model.call", payload: { prompt: "original" } }],
    continuation: { kind: "Invoke", commandId: "cmd_1", command: { kind: "Act", effect: "model.call", payload: { prompt: "original" } }, continuationByResult: { ok: { kind: "Done" } } },
    schedules: [],
    trace: { reactorId: "program", reactorVersion: "1", branchPath: ["Invoke", "Invoke"], envInputs: [], cadenceEvaluations: [] },
    emitted: [],
    waits: [],
  });
});

test("AC4 evidence: decideProgram returns the full literal decision on the event path, including waits-derived cadenceEvaluations", () => {
  const awaitNode = Program.Await({ type: "Approved", correlationId: "corr-1" }, Cadence.After(1000), Program.Done());
  const pending = decideProgram(awaitNode, { flag: false }, env(), { ...event("a1", "Approved", 5), correlationId: "corr-2" });
  assert.deepEqual(pending, {
    state: { flag: false },
    intents: [],
    continuation: { kind: "Await", pattern: { type: "Approved", correlationId: "corr-1" }, timeout: { kind: "After", delayMs: 1000 }, next: { kind: "Done" } },
    schedules: [],
    trace: { reactorId: "program", reactorVersion: "1", branchPath: ["Await", "Await"], envInputs: ["event"], cadenceEvaluations: ["await:Approved"] },
    emitted: [],
    waits: [{ kind: "Await", pattern: { type: "Approved", correlationId: "corr-1" }, timeout: { kind: "After", delayMs: 1000 }, next: { kind: "Done" } }],
  });
  const advanced = decideProgram(invokeProgram(), { flag: true }, env(), event("r1", "CommandResult", 5, { commandId: "cmd_1", result: "ok" }));
  assert.deepEqual(advanced, {
    state: { flag: true },
    intents: [],
    continuation: { kind: "Done" },
    schedules: [],
    trace: { reactorId: "program", reactorVersion: "1", branchPath: ["Invoke", "Done"], envInputs: ["event"], cadenceEvaluations: [] },
    emitted: [],
    waits: [],
  });
});

test("AC4 evidence: three-step predicate-ref program round-trips losslessly at every step with a structural pre-serialization closure check", () => {
  // The checker itself must be able to find a function, or the check is vacuous.
  assert.throws(() => assertNoFunctions({ bad: () => 0 }, "probe"), /closure found at probe\.bad/);
  assert.throws(() => assertNoFunctions({ nested: { deep: [Math.max] } }, "probe"), /closure found at probe\.nested\.deep\.0/);

  const finished = draft("Finished", 0);
  const awaitNode = Program.Await({ type: "Approved", correlationId: "corr-1" }, Cadence.Until(Cadence.After(1000), flagRef), Program.Guard(flagRef, Program.Emit(finished, Program.Done()), Program.Done()));
  const program = Program.Sequence([invokeProgram(), awaitNode]);

  // Step 1: dispatch. Residual deep-equals the pre-step program.
  let step = stepProgram(program, { flag: true }, env());
  assert.deepEqual(step.intents, [{ kind: "Act", effect: "model.call", payload: { prompt: "original" } }]);
  assert.deepEqual(step.residual, program);
  let residual = roundTrip(step.residual, "after-dispatch");

  // Foreign commandId at the Sequence level: residual deep-equals the pre-step
  // program (not merely kind "Sequence") and nothing is re-dispatched.
  step = stepProgram(residual, { flag: true }, env(), event("r-foreign", "CommandResult", 4, { commandId: "cmd_other", result: "ok" }));
  assert.deepEqual(step.residual, program);
  assert.deepEqual(step.intents, []);
  residual = roundTrip(step.residual, "after-foreign-result");

  // Step 2: the correlated result advances past Invoke to the Await.
  step = stepProgram(residual, { flag: true }, env(), event("r-match", "CommandResult", 5, { commandId: "cmd_1", result: "ok" }));
  assert.deepEqual(step.residual, { kind: "Sequence", programs: [awaitNode] });
  assert.deepEqual(step.intents, []);
  residual = roundTrip(step.residual, "after-invoke");

  // Step 3: the correlated approval advances past Await to the Guard.
  step = stepProgram(residual, { flag: true }, env(), { ...event("approved", "Approved", 6), correlationId: "corr-1" });
  assert.deepEqual(step.residual, { kind: "Sequence", programs: [Program.Guard(flagRef, Program.Emit(finished, Program.Done()), Program.Done())] });
  residual = roundTrip(step.residual, "after-await");

  // Step 4: the Guard consults the predicate ref (conditions are data) and emits.
  step = stepProgram(residual, { flag: true }, env());
  assert.deepEqual(step.emitted, [finished]);
  assert.deepEqual(step.residual, { kind: "Done" });
  roundTrip(step.residual, "final");
});

test("AC4 evidence (B1 regression): prototype-key results throw No Invoke continuation and never resolve native functions", () => {
  const program = invokeProgram();
  for (const key of ["constructor", "__proto__", "toString", "hasOwnProperty"]) {
    assert.throws(
      () => stepProgram(program, { flag: true }, env(), event(`p-${key}`, "CommandResult", 5, { commandId: "cmd_1", result: key })),
      /No Invoke continuation/,
      `prototype key ${key} did not throw`
    );
  }
  // Unknown results behave identically to prototype keys.
  assert.throws(
    () => stepProgram(program, { flag: true }, env(), event("p-unknown", "CommandResult", 5, { commandId: "cmd_1", result: "nope" })),
    /No Invoke continuation/
  );
  // The known result still resolves, and its residual serializes to a string.
  const advanced = stepProgram(program, { flag: true }, env(), event("p-ok", "CommandResult", 5, { commandId: "cmd_1", result: "ok" }));
  assert.deepEqual(advanced.residual, { kind: "Done" });
  assert.equal(serializeContinuation(advanced.residual), '{"kind":"Done"}');
});
