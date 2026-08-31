import test from "node:test";
import assert from "node:assert/strict";
import { guardQueuedPulse } from "../src/index.js";
import type { EventEnvelope, JsonValue, KernelEnv, PredicateRef, PredicateRegistry, PresenceDecision } from "../src/index.js";

const event = <P extends JsonValue = Record<string, never>>(id: string, type: string, at: number, payload: P = {} as P): EventEnvelope<string, P> => ({ schemaVersion: 1, eventId: id, type, occurredAt: at, actorId: "actor", workstreamId: "ws", episodeId: "ep", payload });
const stateValue = (state: JsonValue, key: string): JsonValue | undefined => state !== null && !Array.isArray(state) && typeof state === "object" ? (state as Readonly<Record<string, JsonValue>>)[key] : undefined;
const predicates: PredicateRegistry = {
  "presence.away": { 1: ({ state }) => stateValue(state, "presence") === "away" },
  "presence.away-after": { 1: ({ env: environment }, params) => environment.now >= Number(params["threshold"]) },
};
const env = (now = 100, rngState = 7): KernelEnv => ({ now, rngState, predicates });
const awayRef: PredicateRef = { registryId: "presence.away", version: 1 };

test("AC1 evidence: no ambient Date.now or Math.random read on either branch (poisoned globals)", () => {
  const originalNow = Date.now;
  const originalRandom = Math.random;
  Date.now = (): number => { throw new Error("kernel read ambient Date.now"); };
  Math.random = (): number => { throw new Error("kernel read ambient Math.random"); };
  try {
    for (const presence of ["returned", "away"] as const) {
      for (const ids of [[], ["s-2", "s-9", "s-4"]] as readonly (readonly string[])[]) {
        const decision = guardQueuedPulse({ presence }, event(`pulse-${presence}-${ids.length}`, "CadencePulse", 60), env(60, 8), awayRef, ids);
        assert.deepEqual(decision.trace.branchPath, ["queued-pulse", presence === "away" ? "active" : "noop"]);
        assert.deepEqual(decision.cancelledScheduleIds, presence === "away" ? [] : ids);
      }
    }
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
});

test("AC1 evidence: identical decisions across a simulated one-hour ambient clock gap", () => {
  const originalNow = Date.now;
  let ambient = 1_000_000;
  Date.now = (): number => { ambient += 3_600_000; return ambient; };
  try {
    for (const presence of ["returned", "away"] as const) {
      const state = { presence, queue: ["a", "b"] };
      const pulse = event(`pulse-gap-${presence}`, "CadencePulse", 77);
      const first = guardQueuedPulse(state, pulse, env(77, 13), awayRef, ["s-2", "s-9", "s-4"]);
      const second = guardQueuedPulse(structuredClone(state), structuredClone(pulse), env(77, 13), awayRef, ["s-2", "s-9", "s-4"]);
      assert.deepEqual(second, first);
    }
  } finally {
    Date.now = originalNow;
  }
});

test("AC1 evidence: cancelledScheduleIds preserves caller order for multi-element schedule lists", () => {
  const ids = Object.freeze(["s-2", "s-9", "s-4", "s-7"]);
  const decision = guardQueuedPulse({ presence: "returned" }, event("pulse-order", "CadencePulse", 10), env(10, 3), awayRef, ids);
  assert.deepEqual(decision.cancelledScheduleIds, ["s-2", "s-9", "s-4", "s-7"]);
  assert.deepEqual(decision.trace.cadenceEvaluations, ["cancel:s-2", "cancel:s-9", "cancel:s-4", "cancel:s-7"]);
  assert.deepEqual(ids, ["s-2", "s-9", "s-4", "s-7"]);
});

test("AC1 evidence: full-decision property across varied state, presence, now and rngState", () => {
  const presences = ["away", "returned", "idle", "unknown"] as const;
  for (let seed = 0; seed < 120; seed++) {
    const presence = presences[seed % presences.length]!;
    const state = { presence, seed, tags: [`t-${seed}`, `t-${seed + 1}`], nested: { depth: seed % 5 } };
    const pulse = event(`pulse-${seed}`, "CadencePulse", 1000 + seed * 17);
    const environment = env(1000 + seed * 17, seed * 31 + 5);
    const ids = [`s-${seed}-b`, `s-${seed}-a`, `s-${seed}-c`].slice(0, seed % 4);
    const ref: PredicateRef = seed % 3 === 0 ? { registryId: "presence.away", version: 1, params: { seed } } : awayRef;
    const first = guardQueuedPulse(state, pulse, environment, ref, ids);
    const second = guardQueuedPulse(structuredClone(state), structuredClone(pulse), { ...environment }, ref, [...ids]);
    assert.deepEqual(second, first);
    const away = presence === "away";
    const expected: PresenceDecision<typeof state> = {
      state,
      intents: away ? [] : [{ kind: "NoOp", reason: "operator returned", evidence: [pulse.eventId], reevaluation: { kind: "Once", at: pulse.occurredAt }, usefulWhen: ref }],
      schedules: [],
      cancelledScheduleIds: away ? [] : ids,
      trace: { reactorId: "presence-guard", reactorVersion: "1", branchPath: ["queued-pulse", away ? "active" : "noop"], envInputs: ["operatorPresence"], cadenceEvaluations: away ? [] : ids.map(id => `cancel:${id}`) },
    };
    assert.deepEqual(first, expected);
  }
});

test("AC1 evidence: env.now reaches the predicate and flips the decision branch", () => {
  const ref: PredicateRef = { registryId: "presence.away-after", version: 1, params: { threshold: 500 } };
  const state = { presence: "irrelevant" };
  const pulse = event("pulse-env", "CadencePulse", 480);
  const before = guardQueuedPulse(state, pulse, env(480, 1), ref, ["s-2", "s-9", "s-4"]);
  const atThreshold = guardQueuedPulse(state, pulse, env(500, 1), ref, ["s-2", "s-9", "s-4"]);
  assert.deepEqual(before.trace.branchPath, ["queued-pulse", "noop"]);
  assert.deepEqual(before.cancelledScheduleIds, ["s-2", "s-9", "s-4"]);
  assert.deepEqual(atThreshold.trace.branchPath, ["queued-pulse", "active"]);
  assert.deepEqual(atThreshold.intents, []);
  assert.deepEqual(atThreshold.cancelledScheduleIds, []);
  const rerun = guardQueuedPulse(structuredClone(state), structuredClone(pulse), env(480, 999), ref, ["s-2", "s-9", "s-4"]);
  assert.deepEqual(rerun, before);
});

test("AC1 evidence: representative returned-path decision matches the full literal Decision", () => {
  const decision = guardQueuedPulse(
    { presence: "returned", focus: "deep-work" },
    event("pulse-42", "CadencePulse", 4200),
    env(4200, 99),
    { registryId: "presence.away", version: 1, params: { grace: 5 } },
    ["s-2", "s-9", "s-4"],
  );
  assert.deepEqual(decision, {
    state: { presence: "returned", focus: "deep-work" },
    intents: [{
      kind: "NoOp",
      reason: "operator returned",
      evidence: ["pulse-42"],
      reevaluation: { kind: "Once", at: 4200 },
      usefulWhen: { registryId: "presence.away", version: 1, params: { grace: 5 } },
    }],
    schedules: [],
    cancelledScheduleIds: ["s-2", "s-9", "s-4"],
    trace: {
      reactorId: "presence-guard",
      reactorVersion: "1",
      branchPath: ["queued-pulse", "noop"],
      envInputs: ["operatorPresence"],
      cadenceEvaluations: ["cancel:s-2", "cancel:s-9", "cancel:s-4"],
    },
  });
});

test("AC1 evidence: representative away-path decision is literally empty of intents and cancellations", () => {
  const decision = guardQueuedPulse(
    { presence: "away", focus: "afk" },
    event("pulse-43", "CadencePulse", 4300),
    env(4300, 100),
    { registryId: "presence.away", version: 1 },
    ["s-2", "s-9", "s-4"],
  );
  assert.deepEqual(decision, {
    state: { presence: "away", focus: "afk" },
    intents: [],
    schedules: [],
    cancelledScheduleIds: [],
    trace: {
      reactorId: "presence-guard",
      reactorVersion: "1",
      branchPath: ["queued-pulse", "active"],
      envInputs: ["operatorPresence"],
      cadenceEvaluations: [],
    },
  });
});
