import test from "node:test";
import assert from "node:assert/strict";
import {
  Cadence,
  Program,
  EVALUABLE_PROGRAM_KINDS,
  decodeContinuation,
  serializeContinuation,
  stepProgram,
  decideProgram,
  type ExecutableProgramV1,
} from "../src/index.js";

type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const kindsEqual: Equal<
  ExecutableProgramV1["kind"],
  (typeof EVALUABLE_PROGRAM_KINDS)[number]
> = true;
const stepInput: Equal<Parameters<typeof stepProgram>[0], ExecutableProgramV1> =
  true;
const decisionInput: Equal<
  Parameters<typeof decideProgram>[0],
  ExecutableProgramV1
> = true;
const fullGrammarRejected: Program.T extends ExecutableProgramV1
  ? false
  : true = true;
const deferredChildRejected: {
  kind: "Sequence";
  programs: readonly Program.All[];
} extends ExecutableProgramV1
  ? false
  : true = true;
void [
  kindsEqual,
  stepInput,
  decisionInput,
  fullGrammarRejected,
  deferredChildRejected,
];

const done = Program.Done();
const ref = { registryId: "flag", version: 1, params: { flag: true } };
const command = {
  kind: "Act",
  effect: "read",
  payload: { values: [null, true, 1, "x"] },
} as const;
const draft = {
  schemaVersion: 1,
  type: "Finished",
  occurredAt: 1,
  actorId: "test",
  workstreamId: "ws",
  payload: null,
} as const;
const env = { now: 0, rngState: 1, predicates: { flag: { 1: () => true } } };
const fixtures: readonly ExecutableProgramV1[] = [
  done,
  Program.Emit(draft, done),
  Program.Invoke("cmd", command, { ok: done }),
  Program.Await(
    { type: "Result", commandId: "cmd", correlationId: "corr" },
    Cadence.After(10),
    done,
  ),
  Program.Guard(ref, done, Program.Emit(draft, done)),
  Program.Sequence([done]),
];
function refuses(value: unknown, path: string, code?: string) {
  const result = decodeContinuation(value);
  assert.equal(result.ok, false);
  if (result.ok) assert.fail("accepted malformed continuation");
  assert.equal(result.path, path, result.message);
  if (code) assert.equal(result.code, code, result.message);
  return result;
}

test("WO-046 executable constructors, parsed and serialized continuations preserve bytes and steps", () => {
  assert.deepEqual(
    fixtures.map((p) => p.kind).sort(),
    [...EVALUABLE_PROGRAM_KINDS].sort(),
  );
  for (const program of fixtures) {
    for (const value of [program, serializeContinuation(program)]) {
      const result = decodeContinuation(value);
      assert.ok(result.ok, result.ok ? "" : result.message);
      assert.deepEqual(result.value, program);
      assert.equal(
        serializeContinuation(result.value),
        serializeContinuation(program),
      );
      assert.deepEqual(
        stepProgram(result.value, {}, env),
        stepProgram(program, {}, env),
      );
    }
  }
});

test("WO-046 every deferred kind is refused at root and every recursive edge", () => {
  const deferred = [
    Program.Choose("p", []),
    Program.All([]),
    Program.Race([]),
    Program.Repeat(done, ref),
    Program.Compensate(done, done),
  ];
  for (const program of deferred) {
    const cases = [
      [program, "$.kind"],
      [Program.Emit(draft, program), "$.next.kind"],
      [Program.Await({ type: "x" }, Cadence.Once(0), program), "$.next.kind"],
      [
        Program.Invoke("cmd", command, { "odd.key": program }),
        '$.continuationByResult["odd.key"].kind',
      ],
      [Program.Guard(ref, program, done), "$.whenTrue.kind"],
      [Program.Guard(ref, done, program), "$.whenFalse.kind"],
      [
        Program.Sequence([done, Program.Sequence([program])]),
        "$.programs[1].programs[0].kind",
      ],
    ] as const;
    for (const [value, path] of cases)
      for (const input of [value, serializeContinuation(value)])
        assert.match(
          refuses(input, path, "DEFERRED_PROGRAM_KIND").message,
          new RegExp(program.kind),
        );
  }
});

test("WO-046 malformed nodes and payloads name the precise field", () => {
  const invoke = Program.Invoke("cmd", command, { ok: done });
  const awaitNode = Program.Await({ type: "Result" }, Cadence.Once(0), done);
  const guard = Program.Guard(ref, done, done);
  const emit = Program.Emit(draft, done);
  const cases: readonly [unknown, string][] = [
    [null, "$"],
    [[], "$"],
    [{}, "$.kind"],
    [{ kind: 1 }, "$.kind"],
    [{ kind: "Unknown" }, "$.kind"],
    [{ kind: "Done", extra: 1 }, "$.extra"],
    [{ kind: "Emit", event: draft }, "$.next"],
    [
      { ...emit, event: { ...draft, schemaVersion: 2 } },
      "$.event.schemaVersion",
    ],
    [
      { ...emit, event: { ...draft, eventId: "unexpected" } },
      "$.event.eventId",
    ],
    [{ ...emit, event: { ...draft, occurredAt: "now" } }, "$.event.occurredAt"],
    [{ ...emit, event: { ...draft, episodeId: null } }, "$.event.episodeId"],
    [{ ...invoke, commandId: 1 }, "$.commandId"],
    [{ ...invoke, command: { ...command, kind: "Wait" } }, "$.command.kind"],
    [{ ...invoke, command: { ...command, effect: 1 } }, "$.command.effect"],
    [
      { ...invoke, command: { ...command, resource: false } },
      "$.command.resource",
    ],
    [{ ...invoke, continuationByResult: [] }, "$.continuationByResult"],
    [
      { ...invoke, continuationByResult: { ok: null } },
      "$.continuationByResult.ok",
    ],
    [{ ...awaitNode, pattern: { type: 1 } }, "$.pattern.type"],
    [
      { ...awaitNode, pattern: { type: "Result", commandId: 1 } },
      "$.pattern.commandId",
    ],
    [{ ...awaitNode, timeout: {} }, "$.timeout.kind"],
    [
      {
        ...awaitNode,
        timeout: {
          kind: "Gate",
          cadence: { kind: "Once", at: "now" },
          conditionRef: ref,
        },
      },
      "$.timeout.cadence.at",
    ],
    [
      { ...guard, conditionRef: { ...ref, registryId: false } },
      "$.conditionRef.registryId",
    ],
    [
      { ...guard, conditionRef: { ...ref, version: "1" } },
      "$.conditionRef.version",
    ],
    [
      { ...guard, conditionRef: { ...ref, params: [] } },
      "$.conditionRef.params",
    ],
    [{ kind: "Sequence", programs: {} }, "$.programs"],
  ];
  for (const [value, path] of cases) refuses(value, path);
  refuses("{", "$", "INVALID_JSON");
  refuses(
    '{"kind":"Emit","event":{"payload":1e400},"next":{"kind":"Done"}}',
    "$.event.payload",
    "NON_JSON_NUMBER",
  );
});

test("WO-046 direct values cannot hide closures, inherited fields, cycles or lossy JSON", () => {
  for (const value of [undefined, () => true, BigInt(1), Number.NaN, Infinity])
    refuses(
      { ...Program.Emit(draft, done), event: { ...draft, payload: value } },
      "$.event.payload",
    );
  refuses(Object.create({ kind: "Done" }), "$", "NON_JSON_OBJECT");
  const cycle: { kind: string; programs: unknown[] } = {
    kind: "Sequence",
    programs: [],
  };
  cycle.programs.push(cycle);
  refuses(cycle, "$.programs[0]", "CYCLIC_VALUE");
  refuses({ kind: "Sequence", programs: Array(1) }, "$.programs[0]");
  let called = false;
  refuses(
    {
      get kind() {
        called = true;
        return "Done";
      },
    },
    "$.kind",
  );
  assert.equal(called, false);
  for (const prototype of [
    null,
    {
      [Symbol.iterator]: function* () {
        yield Program.All([]);
      },
    },
  ]) {
    const programs = [done];
    Object.setPrototypeOf(programs, prototype);
    refuses({ kind: "Sequence", programs }, "$.programs", "NON_JSON_OBJECT");
  }
  const shared = Program.Sequence([done, done]);
  assert.ok(decodeContinuation(shared).ok);
});

test("WO-046 own prototype-named result branches remain data", () => {
  const program = Program.Invoke(
    "cmd",
    command,
    JSON.parse('{"__proto__":{"kind":"Done"},"constructor":{"kind":"Done"}}'),
  );
  const decoded = decodeContinuation(serializeContinuation(program));
  assert.ok(decoded.ok);
  for (const result of ["__proto__", "constructor"])
    assert.equal(
      stepProgram(decoded.value, {}, env, {
        ...draft,
        eventId: "evt_1",
        type: "CommandResult",
        payload: { commandId: "cmd", result },
      }).residual.kind,
      "Done",
    );
});

test("WO-046 Await validates the full Cadence shape without claiming its evaluation", () => {
  for (const timeout of [
    Cadence.Calendar("*", "UTC"),
    Cadence.Sequence([Cadence.Once(0)]),
    Cadence.While(Cadence.Once(1), ref),
  ])
    assert.ok(
      decodeContinuation(Program.Await({ type: "x" }, timeout, done)).ok,
    );
});

test("WO-046 iterative decoding accepts deep trees without stack overflow", () => {
  let program: ExecutableProgramV1 = done;
  for (let i = 0; i < 5000; i++) program = Program.Sequence([program]);
  assert.ok(decodeContinuation(program).ok);
});
