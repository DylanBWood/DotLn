import test from "node:test";
import assert from "node:assert/strict";
import { Cadence, evaluateCadence } from "../src/index.js";
import type {
  Event,
  EventEnvelope,
  JsonValue,
  KernelEnv,
  PredicateRegistry,
} from "../src/index.js";

// Inline helpers (matching kernel.test.ts style; deliberately not imported from other test files).
const event = <P extends JsonValue = Record<string, never>>(
  id: string,
  type: string,
  at: number,
  payload: P = {} as P,
): EventEnvelope<string, P> => ({
  schemaVersion: 1,
  eventId: id,
  type,
  occurredAt: at,
  actorId: "actor",
  workstreamId: "ws",
  episodeId: "ep",
  payload,
});
const stateValue = (state: JsonValue, key: string): JsonValue | undefined =>
  state !== null && !Array.isArray(state) && typeof state === "object"
    ? (state as Readonly<Record<string, JsonValue>>)[key]
    : undefined;
const registry: PredicateRegistry = {
  "state.flag": { 1: ({ state }) => stateValue(state, "flag") === true },
  "gate.version": { 1: () => false, 2: () => true },
  "params.open": { 1: (_context, params) => params["open"] === true },
  "event.is-open": {
    1: ({ event: triggering }) => triggering?.type === "OpenGate",
  },
};
const env = (
  now: number,
  rngState: number,
  predicates: PredicateRegistry = registry,
): KernelEnv => ({ now, rngState, predicates });
const flagRef = { registryId: "state.flag", version: 1 } as const;

// Backoff(100, 2, 100000, 3, 0.5): base = 100 * 2^3 = 800; jitter 0.5 puts every draw in
// [400, 1200], so maxMs = 100000 never binds and Math.round never clamps to 0 — each rngState
// maps to ONE exact dueAt. Literals below were produced by the real kernel and hand-verified
// against the LCG: next = (imul(state, 1664525) + 1013904223) >>> 0; unit = next / 2^32;
// delay = round(800 * (1 + (unit*2 - 1) * 0.5)).
//   rngState 42 -> next = 42*1664525 + 1013904223 = 1083814273; unit ~= .252345; delay 602
//   rngState  7 -> next =  7*1664525 + 1013904223 = 1025555898; unit ~= .238781; delay 591
//   rngState  1 -> next =  1*1664525 + 1013904223 = 1015568748; unit ~= .236445; delay 589
test("AC3 evidence: Backoff jitter yields exact dueAt and rngState for pinned rngStates with a non-binding clamp", () => {
  const backoff = Cadence.Backoff(100, 2, 100000, 3, 0.5);
  assert.deepEqual(evaluateCadence(backoff, {}, env(100, 42)), {
    dueAt: 702,
    rngState: 1083814273,
    trace: "Backoff:3:602",
  });
  assert.deepEqual(evaluateCadence(backoff, {}, env(100, 7)), {
    dueAt: 691,
    rngState: 1025555898,
    trace: "Backoff:3:591",
  });
  assert.deepEqual(evaluateCadence(backoff, {}, env(0, 1)), {
    dueAt: 589,
    rngState: 1015568748,
    trace: "Backoff:3:589",
  });
});

test("AC3 evidence: Backoff rngState chains — successive draws differ and are reproducible", () => {
  const backoff = Cadence.Backoff(100, 2, 100000, 3, 0.5);
  const first = evaluateCadence(backoff, {}, env(100, 42));
  const second = evaluateCadence(backoff, {}, env(100, first.rngState));
  assert.deepEqual(first, {
    dueAt: 702,
    rngState: 1083814273,
    trace: "Backoff:3:602",
  });
  assert.deepEqual(second, {
    dueAt: 571,
    rngState: 378494188,
    trace: "Backoff:3:471",
  });
  assert.notEqual(second.dueAt, first.dueAt);
  assert.notEqual(second.rngState, first.rngState);
  assert.deepEqual(evaluateCadence(backoff, {}, env(100, 42)), first);
  assert.deepEqual(
    evaluateCadence(backoff, {}, env(100, first.rngState)),
    second,
  );
});

test("AC3 evidence: Backoff floor clamps a negative jittered delay to zero, never due before now", () => {
  // jitter 2 with rngState 7: unit ~= .238781 -> 800 * (1 + (unit*2 - 1) * 2) ~= -35.9 -> round -36 -> max(0, -36) = 0.
  assert.deepEqual(
    evaluateCadence(Cadence.Backoff(100, 2, 100000, 3, 2), {}, env(100, 7)),
    { dueAt: 100, rngState: 1025555898, trace: "Backoff:3:0" },
  );
});

test("AC3 evidence: Backoff draws jitter from explicit rngState only — ambient Math.random and Date.now poisoned", () => {
  const originalRandom = Math.random;
  const originalNow = Date.now;
  try {
    Math.random = () => {
      throw new Error("ambient Math.random consulted");
    };
    Date.now = () => {
      throw new Error("ambient Date.now consulted");
    };
    assert.deepEqual(
      evaluateCadence(
        Cadence.Backoff(100, 2, 100000, 3, 0.5),
        {},
        env(100, 42),
      ),
      { dueAt: 702, rngState: 1083814273, trace: "Backoff:3:602" },
    );
  } finally {
    Math.random = originalRandom;
    Date.now = originalNow;
  }
});

test("AC3 evidence: Every before startAt yields exactly startAt", () => {
  const rows: readonly (readonly [
    intervalMs: number,
    startAt: number,
    now: number,
  ])[] = [
    [20, 50, 10],
    [20, 50, 49],
    [20, 50, 0],
    [1000, 999999, 5],
  ];
  for (const [intervalMs, startAt, now] of rows) {
    const result = evaluateCadence(
      Cadence.Every(intervalMs, startAt),
      {},
      env(now, 7),
    );
    assert.equal(
      result.dueAt,
      startAt,
      `Every(${intervalMs}, ${startAt}) at now=${now}`,
    );
    assert.equal(result.trace, `Every:${intervalMs}`);
  }
});

test("AC3 evidence: Every has no fixed points — grid of now/startAt/interval yields the exact next tick strictly after now", () => {
  const rows: readonly (readonly [
    intervalMs: number,
    startAt: number | undefined,
    now: number,
    expected: number,
  ])[] = [
    [20, 50, 50, 70], // now === startAt must yield startAt + interval
    [20, 50, 70, 90], // now exactly on a later tick -> next tick, not now
    [20, 50, 130, 150], // now on the tick 50 + 4*20 -> 150
    [20, undefined, 0, 20], // default startAt 0, now === startAt
    [20, undefined, 40, 60], // default startAt, now on a tick
    [7, 3, 3, 10],
    [7, 3, 10, 17], // 3 + 7 = 10 is a tick -> 17
    [1, 0, 5, 6],
    [1000, 500, 500, 1500],
    [20, 50, 51, 70], // just past startAt
    [20, 50, 69, 70], // just before a tick
  ];
  for (const [intervalMs, startAt, now, expected] of rows) {
    const result = evaluateCadence(
      Cadence.Every(intervalMs, startAt),
      {},
      env(now, 7),
    );
    assert.equal(
      result.dueAt,
      expected,
      `Every(${intervalMs}, ${startAt}) at now=${now}`,
    );
    assert.ok(
      result.dueAt !== null && result.dueAt > now,
      `Every(${intervalMs}, ${startAt}) at now=${now} must be strictly after now, got ${result.dueAt}`,
    );
  }
});

test("AC3 evidence: Until open path recurses into the inner cadence verbatim", () => {
  // Inner Every: start 50, now 110 -> 50 + (floor(60/20)+1)*20 = 130.
  assert.deepEqual(
    evaluateCadence(
      Cadence.Until(Cadence.Every(20, 50), flagRef),
      { flag: false },
      env(110, 7),
    ),
    { dueAt: 130, rngState: 7, trace: "Every:20" },
  );
  // Inner Backoff: the pinned rngState 42 literals must come through untouched, rng threading included.
  assert.deepEqual(
    evaluateCadence(
      Cadence.Until(Cadence.Backoff(100, 2, 100000, 3, 0.5), flagRef),
      { flag: false },
      env(100, 42),
    ),
    { dueAt: 702, rngState: 1083814273, trace: "Backoff:3:602" },
  );
  // Closed path for contrast: cancelled, no recursion.
  assert.deepEqual(
    evaluateCadence(
      Cadence.Until(Cadence.Every(20, 50), flagRef),
      { flag: true },
      env(110, 7),
    ),
    { dueAt: null, rngState: 7, trace: "Until:cancelled" },
  );
});

test("AC3 evidence: predicate registry selects the ref's version", () => {
  const gateV1 = Cadence.Gate(Cadence.After(10), {
    registryId: "gate.version",
    version: 1,
  });
  const gateV2 = Cadence.Gate(Cadence.After(10), {
    registryId: "gate.version",
    version: 2,
  });
  assert.deepEqual(evaluateCadence(gateV1, {}, env(100, 7)), {
    dueAt: null,
    rngState: 7,
    trace: "Gate:closed",
  });
  assert.deepEqual(evaluateCadence(gateV2, {}, env(100, 7)), {
    dueAt: 110,
    rngState: 7,
    trace: "After:10",
  });
});

test("AC3 evidence: predicate registry passes ref params through to the predicate", () => {
  const gate = (params?: Readonly<Record<string, JsonValue>>): Cadence.Gate =>
    Cadence.Gate(
      Cadence.After(10),
      params === undefined
        ? { registryId: "params.open", version: 1 }
        : { registryId: "params.open", version: 1, params },
    );
  assert.equal(
    evaluateCadence(gate({ open: true }), {}, env(100, 7)).dueAt,
    110,
  );
  assert.equal(
    evaluateCadence(gate({ open: false }), {}, env(100, 7)).dueAt,
    null,
  );
  assert.equal(evaluateCadence(gate({}), {}, env(100, 7)).dueAt, null);
  assert.equal(evaluateCadence(gate(), {}, env(100, 7)).dueAt, null); // absent params reach the predicate as {}
});

test("AC3 evidence: predicate registry threads the triggering event into the predicate context", () => {
  const gate = Cadence.Gate(Cadence.After(10), {
    registryId: "event.is-open",
    version: 1,
  });
  assert.equal(
    evaluateCadence(gate, {}, env(100, 7), event("e1", "OpenGate", 90)).dueAt,
    110,
  );
  assert.equal(
    evaluateCadence(gate, {}, env(100, 7), event("e2", "OtherEvent", 90)).dueAt,
    null,
  );
  assert.equal(evaluateCadence(gate, {}, env(100, 7)).dueAt, null); // no event -> context.event undefined
});

test("AC3 evidence: unknown predicate or unknown version throws naming the id", () => {
  assert.throws(
    () =>
      evaluateCadence(
        Cadence.Gate(Cadence.After(10), { registryId: "no.such", version: 1 }),
        {},
        env(100, 7),
      ),
    /no\.such@1/,
  );
  assert.throws(
    () =>
      evaluateCadence(
        Cadence.Gate(Cadence.After(10), {
          registryId: "gate.version",
          version: 99,
        }),
        {},
        env(100, 7),
      ),
    /gate\.version@99/,
  );
});

test("AC3 evidence: Gate consults its predicate — false yields null dueAt, and the predicate is actually invoked", () => {
  assert.deepEqual(
    evaluateCadence(
      Cadence.Gate(Cadence.Once(150), flagRef),
      { flag: false },
      env(100, 7),
    ),
    { dueAt: null, rngState: 7, trace: "Gate:closed" },
  );
  const calls: Array<{
    readonly params: JsonValue;
    readonly eventType: string | null;
  }> = [];
  const recording: PredicateRegistry = {
    "record.calls": {
      1: ({ event: triggering }, params) => {
        calls.push({ params, eventType: triggering?.type ?? null });
        return true;
      },
    },
  };
  const trigger: Event = event("pulse-1", "CadencePulse", 90);
  const result = evaluateCadence(
    Cadence.Gate(Cadence.Once(150), {
      registryId: "record.calls",
      version: 1,
      params: { tag: "g1" },
    }),
    {},
    env(100, 7, recording),
    trigger,
  );
  assert.deepEqual(result, { dueAt: 150, rngState: 7, trace: "Once:150" });
  assert.deepEqual(calls, [
    { params: { tag: "g1" }, eventType: "CadencePulse" },
  ]);
});
