import test from "node:test";
import assert from "node:assert/strict";
import {
  Cadence,
  EVALUABLE_CADENCE_KINDS,
  EVALUABLE_PROGRAM_KINDS,
  Program,
  evaluateCadence,
  replay,
  stepProgram,
} from "../src/index.js";
import type {
  Event,
  EventDraft,
  KernelEnv,
  PredicateRegistry,
  Reactor,
} from "../src/index.js";

const predicates: PredicateRegistry = {
  "always.true": { 1: () => true },
  "always.false": { 1: () => false },
};
const trueRef = { registryId: "always.true", version: 1 } as const;
const falseRef = { registryId: "always.false", version: 1 } as const;
const env = (now = 100, rngState = 1): KernelEnv => ({
  now,
  rngState,
  predicates,
});
const event = (eventId: string, occurredAt = 0): Event => ({
  schemaVersion: 1,
  eventId,
  type: "Tick",
  occurredAt,
  actorId: "test",
  workstreamId: "ws",
  payload: {},
});
const emitted: EventDraft = {
  schemaVersion: 1,
  type: "Emitted",
  occurredAt: 0,
  actorId: "test",
  workstreamId: "ws",
  payload: {},
};

test("WO-017 evaluable-kind data: every listed Cadence and Program kind evaluates, every unlisted kind throws is deferred", () => {
  assert.deepEqual(EVALUABLE_CADENCE_KINDS, [
    "Once",
    "After",
    "Every",
    "Gate",
    "Until",
    "Backoff",
  ]);
  assert.deepEqual(EVALUABLE_PROGRAM_KINDS, [
    "Done",
    "Emit",
    "Invoke",
    "Await",
    "Guard",
    "Sequence",
  ]);

  const cadences: readonly Cadence.T[] = [
    Cadence.Once(1),
    Cadence.After(1),
    Cadence.Every(1),
    Cadence.Burst(2, 1),
    Cadence.Calendar("* * * * *", "UTC"),
    Cadence.Window(Cadence.Once(1), 0, 2),
    Cadence.While(Cadence.Once(1), trueRef),
    Cadence.Until(Cadence.Once(1), falseRef),
    Cadence.Gate(Cadence.Once(1), trueRef),
    Cadence.Sequence([]),
    Cadence.Merge([]),
    Cadence.Race([]),
    Cadence.Repeat(Cadence.Once(1), 1),
    Cadence.Backoff(1, 2, 8, 0, 0),
  ];
  const evaluableCadences = new Set<string>(EVALUABLE_CADENCE_KINDS);
  for (const cadence of cadences) {
    if (evaluableCadences.has(cadence.kind))
      assert.doesNotThrow(() => evaluateCadence(cadence, {}, env()));
    else
      assert.throws(
        () => evaluateCadence(cadence, {}, env()),
        new RegExp(`Cadence ${cadence.kind} evaluation is deferred`),
      );
  }

  const programs: readonly Program.T[] = [
    Program.Done(),
    Program.Emit(emitted, Program.Done()),
    Program.Invoke("cmd", { kind: "Act", effect: "read", payload: {} }, {}),
    Program.Await({ type: "Done" }, Cadence.After(1), Program.Done()),
    Program.Sequence([]),
    Program.Choose("policy", []),
    Program.All([]),
    Program.Race([]),
    Program.Guard(trueRef, Program.Done(), Program.Done()),
    Program.Repeat(Program.Done(), falseRef),
    Program.Compensate(Program.Done(), Program.Done()),
  ];
  const evaluablePrograms = new Set<string>(EVALUABLE_PROGRAM_KINDS);
  for (const program of programs) {
    if (evaluablePrograms.has(program.kind))
      assert.doesNotThrow(() => stepProgram(program, {}, env()));
    else
      assert.throws(
        () => stepProgram(program, {}, env()),
        new RegExp(`Program ${program.kind} evaluation is deferred`),
      );
  }
});

test("WO-017 Program.Sequence empty: one step is Done with no effects or waits", () => {
  assert.deepEqual(stepProgram(Program.Sequence([]), {}, env()), {
    residual: Program.Done(),
    emitted: [],
    intents: [],
    waits: [],
  });
});

test("WO-017 Every finite interval: NaN and infinities are refused", () => {
  for (const interval of [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])
    assert.throws(
      () => evaluateCadence(Cadence.Every(interval), {}, env()),
      /Every intervalMs must be positive/,
    );
});

test("WO-017 Backoff binding: maxMs clamp determines the exact dueAt", () => {
  assert.deepEqual(
    evaluateCadence(Cadence.Backoff(100, 3, 250, 2, 0), {}, env(1_000, 1)),
    {
      dueAt: 1_250,
      rngState: 1_015_568_748,
      trace: "Backoff:2:250",
    },
  );
});

test("WO-017 replay environment: policy is promoted and absent rngState falls back to zero", () => {
  const initial = { policy: { mode: "bounded" } } as const;
  const reactor: Reactor<typeof initial> = (state, input, environment) => ({
    state,
    intents: [],
    schedules: [],
    trace: {
      reactorId: "environment-probe",
      reactorVersion: "1",
      branchPath: [input.eventId],
      envInputs: [
        `rng:${environment.rngState}`,
        `policy:${JSON.stringify(environment.policy)}`,
      ],
      cadenceEvaluations: [],
    },
  });
  const result = replay(initial, [event("evt_probe", 25)], reactor, predicates);
  assert.deepEqual(result.decisions[0]?.trace.envInputs, [
    "rng:0",
    'policy:{"mode":"bounded"}',
  ]);
});
