import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as kernel from "../../packages/kernel/dist/src/index.js";
import {
  EXECUTION_CONTEXTS,
  MATCHING_TABLE_ALPHABET,
  PREDICATE_REGISTRY_DATA,
  PROGRAM_ATOM_ALPHABET,
  PROGRAM_BOUNDS,
  buildProgramCorpus,
  enumeratePrograms,
  environmentFor,
  hydratePredicateRegistry,
  programDepth,
  programNodeCount,
} from "./program-corpus-lib.mjs";
import {
  PATHS,
  RECORDED_SEED,
  REPO_ROOT,
  errorRecord,
  parseJsonl,
  sha256,
} from "./wo101-support.mjs";

const manifest = JSON.parse(readFileSync(PATHS.manifest, "utf8"));
const programFixturePaths = manifest.fixtures
  .filter((fixture) => fixture.path.startsWith("corpus/fixtures/program/"))
  .map((fixture) => fixture.path);
const fixtureRows = programFixturePaths.flatMap((path) =>
  parseJsonl(readFileSync(`${REPO_ROOT}/${path}`, "utf8"), path),
);

function cartesian(values, prefix = []) {
  if (values.length === 0) return [prefix];
  const [head, ...tail] = values;
  return head.flatMap((value) => cartesian(tail, [...prefix, value]));
}

function assertNoFunctions(value, path = "value") {
  assert.notEqual(typeof value, "function", `closure found at ${path}`);
  if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value))
      assertNoFunctions(child, `${path}.${key}`);
  }
}

function roundTrip(program, label) {
  assertNoFunctions(program, label);
  const serialized = kernel.serializeContinuation(program);
  assert.equal(typeof serialized, "string");
  const revived = kernel.deserializeContinuation(serialized);
  assert.deepEqual(revived, program, `${label} continuation round-trip drift`);
}

function evaluate(input) {
  const env = environmentFor(input);
  const step = errorRecord(() =>
    kernel.stepProgram(input.program, input.state, env, input.event),
  );
  const decision = errorRecord(() =>
    kernel.decideProgram(
      input.program,
      input.state,
      environmentFor(input),
      input.event,
    ),
  );
  assert.equal(
    step.ok,
    decision.ok,
    `${input.program.kind}: step/decision throw mismatch`,
  );
  if (!step.ok) {
    assert.deepEqual(decision.error, step.error);
    return { kind: "throw", error: step.error };
  }
  return { kind: "return", step: step.value, decision: decision.value };
}

test("WO-101 manifest pins the exhaustive Program grammar, registry, and exact constructor counts", () => {
  assert.deepEqual(manifest.program.bounds, PROGRAM_BOUNDS);
  assert.deepEqual(manifest.program.atomAlphabet, PROGRAM_ATOM_ALPHABET);
  assert.deepEqual(
    manifest.program.matchingTableAlphabet,
    MATCHING_TABLE_ALPHABET,
  );
  assert.deepEqual(
    manifest.program.predicateRegistry.data,
    PREDICATE_REGISTRY_DATA,
  );
  assert.equal(
    manifest.program.predicateRegistry.sha256,
    sha256(`${JSON.stringify(PREDICATE_REGISTRY_DATA, null, 2)}\n`),
  );
  assert.deepEqual(manifest.program.counts.fullEnumeration.exactSizeCounts, {
    1: 2,
    2: 30,
    3: 462,
    4: 7290,
  });
  assert.deepEqual(manifest.program.counts.fullEnumeration.rootKindCounts, {
    Await: 3952,
    Done: 1,
    Emit: 988,
    Guard: 248,
    Invoke: 1976,
    Sequence: 619,
  });
  assert.equal(manifest.program.counts.fullEnumeration.programs, 7784);
  assert.equal(manifest.program.counts.fullEnumeration.evaluationInputs, 38920);
  assert.equal(
    manifest.program.counts.fullEnumeration.generatedVectorArtifact.rows,
    38920,
  );
  assert.match(
    manifest.program.counts.fullEnumeration.generatedVectorArtifact.sha256,
    /^[0-9a-f]{64}$/,
  );
  assert.ok(
    Object.values(
      manifest.program.counts.fullEnumeration.allNodeOccurrenceCounts,
    ).every((count) => count > 0),
  );
  assert.deepEqual(manifest.program.cellCoverage.invoke, {
    distinctCartesianCells: 168,
    observedDistinctCells: 168,
    observedRows: 168,
    rowsPerCell: 1,
    missingCells: 0,
    duplicateCells: 0,
    unexpectedCells: 0,
    separateNoEventRows: 1,
  });
  assert.deepEqual(manifest.program.cellCoverage.await, {
    distinctCartesianCells: 672,
    observedDistinctCells: 672,
    observedRows: 672,
    rowsPerCell: 1,
    missingCells: 0,
    duplicateCells: 0,
    unexpectedCells: 0,
    separateNoEventRows: 4,
  });
});

test("WO-101 regenerates the exact uncommitted full-vector digest pinned by the manifest", () => {
  const regenerated = buildProgramCorpus(RECORDED_SEED, kernel);
  assert.deepEqual(
    regenerated.summary.fullEnumeration.generatedVectorArtifact,
    manifest.program.counts.fullEnumeration.generatedVectorArtifact,
  );
});

test("WO-101 replays every committed Program vector against built dist with exact results and residual round-trips", () => {
  const ids = new Set();
  const originalNow = Date.now;
  const originalRandom = Math.random;
  Date.now = () => {
    throw new Error("committed Program vector observed ambient Date.now");
  };
  Math.random = () => {
    throw new Error("committed Program vector observed ambient Math.random");
  };
  try {
    for (const row of fixtureRows) {
      assert.equal(
        ids.has(row.id),
        false,
        `duplicate Program vector id ${row.id}`,
      );
      ids.add(row.id);
      const before = JSON.stringify(row.input);
      const actual = evaluate(row.input);
      const repeated = evaluate(structuredClone(row.input));
      assert.deepEqual(repeated, actual, `${row.id}: repeat-call drift`);
      assert.deepEqual(actual, row.expected, row.id);
      assert.equal(
        JSON.stringify(row.input),
        before,
        `${row.id}: input mutation`,
      );
      roundTrip(row.input.program, `${row.id}.input`);
      if (actual.kind === "return")
        roundTrip(actual.step.residual, `${row.id}.residual`);
    }
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
  assert.equal(
    ids.size,
    manifest.program.counts.committedEnumeration.vectors +
      manifest.program.counts.invokeTruthTable.actualEventCells +
      manifest.program.counts.invokeTruthTable.noEventCells +
      manifest.program.counts.awaitTruthTable.actualEventCells +
      manifest.program.counts.awaitTruthTable.noEventCells +
      manifest.program.counts.sequenceLaws,
  );
});

test("WO-101 full bounded enumeration is deterministic and pure under poisoned ambient time/randomness", () => {
  const programs = enumeratePrograms(RECORDED_SEED);
  assert.equal(programs.length, 7784);
  const originalNow = Date.now;
  const originalRandom = Math.random;
  Date.now = () => {
    throw new Error("Program corpus observed ambient Date.now");
  };
  Math.random = () => {
    throw new Error("Program corpus observed ambient Math.random");
  };
  let evaluations = 0;
  try {
    for (const program of programs) {
      assert.ok(programNodeCount(program) <= PROGRAM_BOUNDS.maximumNodes);
      assert.ok(programDepth(program) <= PROGRAM_BOUNDS.maximumDepth);
      roundTrip(program, `enumeration.${evaluations}.input`);
      for (const context of EXECUTION_CONTEXTS) {
        const input = {
          program: structuredClone(program),
          state: structuredClone(context.state),
          env: structuredClone(context.env),
          ...(context.event === undefined
            ? {}
            : { event: structuredClone(context.event) }),
        };
        const before = JSON.stringify(input);
        const firstStep = kernel.stepProgram(
          input.program,
          input.state,
          environmentFor(input),
          input.event,
        );
        const secondStep = kernel.stepProgram(
          structuredClone(input.program),
          structuredClone(input.state),
          environmentFor(input),
          input.event === undefined ? undefined : structuredClone(input.event),
        );
        assert.deepEqual(
          secondStep,
          firstStep,
          `stepProgram drift at ${evaluations}`,
        );
        const firstDecision = kernel.decideProgram(
          input.program,
          input.state,
          environmentFor(input),
          input.event,
        );
        const secondDecision = kernel.decideProgram(
          structuredClone(input.program),
          structuredClone(input.state),
          environmentFor(input),
          input.event === undefined ? undefined : structuredClone(input.event),
        );
        assert.deepEqual(
          secondDecision,
          firstDecision,
          `decideProgram drift at ${evaluations}`,
        );
        assert.equal(
          JSON.stringify(input),
          before,
          `input mutation at ${evaluations}`,
        );
        roundTrip(firstStep.residual, `enumeration.${evaluations}.residual`);
        evaluations++;
      }
    }
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
  assert.equal(evaluations, 38920);
});

test("WO-101 Invoke truth table independently accounts for dispatch, advances, throws, and stationary cells", () => {
  const rows = fixtureRows.filter((row) => row.family === "invoke-truth-table");
  const counts = { dispatch: 0, advance: 0, throw: 0, stationary: 0 };
  const observedKeys = new Set();
  for (const row of rows) {
    if (row.dimensions.event === "absent") {
      counts.dispatch++;
      assert.equal(row.expected.kind, "return");
      assert.deepEqual(row.expected.step, {
        residual: row.input.program,
        emitted: [],
        intents: [row.input.program.command],
        waits: [],
      });
      continue;
    }
    const { eventType, correlation, commandId, payloadShape } = row.dimensions;
    const key = JSON.stringify([
      eventType,
      correlation,
      commandId,
      payloadShape,
    ]);
    assert.equal(
      observedKeys.has(key),
      false,
      `duplicate Invoke factorial cell ${key}`,
    );
    observedKeys.add(key);
    assert.ok(
      ["absent", "match", "other"].includes(correlation),
      "Invoke correlation axis must be present even though it is ignored",
    );
    const matchingEnvelope =
      eventType === "CommandResult" && commandId === "match";
    if (matchingEnvelope && payloadShape === "object-unknown-result") {
      counts.throw++;
      assert.deepEqual(row.expected, {
        kind: "throw",
        error: {
          name: "Error",
          message: "No Invoke continuation for result unknown",
        },
      });
    } else if (matchingEnvelope && payloadShape === "object-known-result") {
      counts.advance++;
      assert.equal(row.expected.kind, "return");
      assert.deepEqual(row.expected.step, {
        residual: { kind: "Done" },
        emitted: [],
        intents: [],
        waits: [],
      });
    } else {
      counts.stationary++;
      assert.equal(row.expected.kind, "return");
      assert.deepEqual(row.expected.step, {
        residual: row.input.program,
        emitted: [],
        intents: [],
        waits: [],
      });
    }
  }
  assert.deepEqual(counts, {
    dispatch: 1,
    advance: 3,
    throw: 3,
    stationary: 162,
  });
  const expectedKeys = new Set(
    cartesian([
      MATCHING_TABLE_ALPHABET.eventTypes,
      Object.keys(MATCHING_TABLE_ALPHABET.correlationIds),
      Object.keys(MATCHING_TABLE_ALPHABET.commandIds),
      Object.keys(MATCHING_TABLE_ALPHABET.payloadShapes),
    ]).map(JSON.stringify),
  );
  assert.deepEqual(observedKeys, expectedKeys);
});

test("WO-101 Await truth table independently accounts for all optional-pattern and payload-shape cells", () => {
  const rows = fixtureRows.filter((row) => row.family === "await-truth-table");
  const counts = { advance: 0, wait: 0 };
  const observedKeys = new Set();
  for (const row of rows) {
    const pattern = row.input.program.pattern;
    if (row.dimensions.event === "absent") {
      counts.wait++;
      assert.deepEqual(row.expected.step, {
        residual: row.input.program,
        emitted: [],
        intents: [],
        waits: [row.input.program],
      });
      continue;
    }
    const { eventType, correlation, commandId, payloadShape } = row.dimensions;
    const key = JSON.stringify([
      row.patternMode,
      eventType,
      correlation,
      commandId,
      payloadShape,
    ]);
    assert.equal(
      observedKeys.has(key),
      false,
      `duplicate Await factorial cell ${key}`,
    );
    observedKeys.add(key);
    const correlationMatches =
      pattern.correlationId === undefined || correlation === "match";
    const commandMatches =
      pattern.commandId === undefined ||
      (commandId === "match" && payloadShape.startsWith("object-"));
    const matches =
      eventType === "CommandResult" && correlationMatches && commandMatches;
    assert.equal(row.expected.kind, "return");
    if (matches) {
      counts.advance++;
      assert.deepEqual(row.expected.step, {
        residual: { kind: "Done" },
        emitted: [],
        intents: [],
        waits: [],
      });
    } else {
      counts.wait++;
      assert.deepEqual(row.expected.step, {
        residual: row.input.program,
        emitted: [],
        intents: [],
        waits: [row.input.program],
      });
    }
  }
  assert.deepEqual(counts, { advance: 128, wait: 548 });
  const expectedKeys = new Set(
    cartesian([
      MATCHING_TABLE_ALPHABET.awaitPatternModes.map((mode) => mode.id),
      MATCHING_TABLE_ALPHABET.eventTypes,
      Object.keys(MATCHING_TABLE_ALPHABET.correlationIds),
      Object.keys(MATCHING_TABLE_ALPHABET.commandIds),
      Object.keys(MATCHING_TABLE_ALPHABET.payloadShapes),
    ]).map(JSON.stringify),
  );
  assert.deepEqual(observedKeys, expectedKeys);
});

test("WO-101 Sequence vectors pin one-head normalization and preserve channels without flattening", () => {
  const rows = Object.fromEntries(
    fixtureRows
      .filter((row) => row.family === "sequence-law")
      .map((row) => [row.law, row]),
  );
  assert.deepEqual(rows["empty-list-normalizes-to-Done"].expected.step, {
    residual: { kind: "Done" },
    emitted: [],
    intents: [],
    waits: [],
  });
  assert.deepEqual(rows["singleton-Done-is-absorbed"].expected.step.residual, {
    kind: "Done",
  });
  assert.deepEqual(rows["Done-head-removes-only-head"].expected.step.residual, {
    kind: "Sequence",
    programs: [rows["Done-head-removes-only-head"].input.program.programs[1]],
  });
  assert.deepEqual(
    rows["emitting-head-preserves-channel-and-advances"].expected.step.emitted,
    [
      rows["emitting-head-preserves-channel-and-advances"].input.program
        .programs[0].event,
    ],
  );
  assert.equal(
    rows["non-Done-Invoke-remains-wrapped"].expected.step.residual.kind,
    "Sequence",
  );
  assert.deepEqual(
    rows["non-Done-Invoke-remains-wrapped"].expected.step.intents,
    [rows["non-Done-Invoke-remains-wrapped"].input.program.programs[0].command],
  );
  assert.equal(
    rows["non-Done-Await-remains-wrapped"].expected.step.waits.length,
    1,
  );
  assert.deepEqual(
    rows["nested-Done-is-absorbed-once"].expected.step.residual,
    {
      kind: "Sequence",
      programs: [
        rows["nested-Done-is-absorbed-once"].input.program.programs[1],
      ],
    },
  );
  assert.deepEqual(
    rows["nested-emission-preserves-tail"].expected.step.residual,
    { kind: "Sequence", programs: [{ kind: "Done" }] },
  );
  assert.equal(
    rows["nested-non-Done-is-not-flattened"].expected.step.residual.programs[0]
      .kind,
    "Sequence",
  );
  const doneTail = rows["Done-head-preserves-two-element-tail-order"];
  assert.deepEqual(doneTail.expected.step, {
    residual: {
      kind: "Sequence",
      programs: doneTail.input.program.programs.slice(1),
    },
    emitted: [],
    intents: [],
    waits: [],
  });
  const invokeTail = rows["non-Done-head-preserves-two-element-tail-order"];
  assert.deepEqual(invokeTail.expected.step, {
    residual: invokeTail.input.program,
    emitted: [],
    intents: [invokeTail.input.program.programs[0].command],
    waits: [],
  });
  const emittedTail = rows["emitting-head-preserves-two-element-tail-order"];
  assert.deepEqual(emittedTail.expected.step, {
    residual: {
      kind: "Sequence",
      programs: emittedTail.input.program.programs.slice(1),
    },
    emitted: [emittedTail.input.program.programs[0].event],
    intents: [],
    waits: [],
  });
});

test("WO-101 frozen predicate registry drives both branches and pins unknown references", () => {
  assert.ok(Object.isFrozen(PREDICATE_REGISTRY_DATA));
  assert.ok(PREDICATE_REGISTRY_DATA.entries.every(Object.isFrozen));
  const trueGuard = {
    kind: "Guard",
    conditionRef: {
      registryId: "state.equals",
      version: 1,
      params: { field: "flag", expected: true },
    },
    whenTrue: {
      kind: "Emit",
      event: PROGRAM_ATOM_ALPHABET.eventDrafts[0],
      next: { kind: "Done" },
    },
    whenFalse: { kind: "Done" },
  };
  assert.deepEqual(
    kernel.stepProgram(
      trueGuard,
      { flag: true },
      { now: 0, rngState: 0, predicates: hydratePredicateRegistry() },
    ),
    {
      residual: { kind: "Done" },
      emitted: [PROGRAM_ATOM_ALPHABET.eventDrafts[0]],
      intents: [],
      waits: [],
    },
  );
  assert.deepEqual(
    kernel.stepProgram(
      trueGuard,
      { flag: false },
      { now: 0, rngState: 0, predicates: hydratePredicateRegistry() },
    ),
    { residual: { kind: "Done" }, emitted: [], intents: [], waits: [] },
  );
  const eventGuard = {
    kind: "Guard",
    conditionRef: {
      registryId: "event.type",
      version: 1,
      params: { type: "Signal" },
    },
    whenTrue: {
      kind: "Emit",
      event: PROGRAM_ATOM_ALPHABET.eventDrafts[0],
      next: { kind: "Done" },
    },
    whenFalse: {
      kind: "Emit",
      event: PROGRAM_ATOM_ALPHABET.eventDrafts[1],
      next: { kind: "Done" },
    },
  };
  const eventEnv = {
    now: 0,
    rngState: 0,
    predicates: hydratePredicateRegistry(),
  };
  const signal = {
    schemaVersion: 1,
    eventId: "signal",
    type: "Signal",
    occurredAt: 0,
    actorId: "actor",
    workstreamId: "ws",
    payload: {},
  };
  const other = { ...signal, eventId: "other", type: "Other" };
  assert.deepEqual(kernel.stepProgram(eventGuard, {}, eventEnv, signal), {
    residual: { kind: "Done" },
    emitted: [PROGRAM_ATOM_ALPHABET.eventDrafts[0]],
    intents: [],
    waits: [],
  });
  assert.deepEqual(kernel.stepProgram(eventGuard, {}, eventEnv, other), {
    residual: { kind: "Done" },
    emitted: [PROGRAM_ATOM_ALPHABET.eventDrafts[1]],
    intents: [],
    waits: [],
  });
  assert.deepEqual(kernel.stepProgram(eventGuard, {}, eventEnv), {
    residual: { kind: "Done" },
    emitted: [PROGRAM_ATOM_ALPHABET.eventDrafts[1]],
    intents: [],
    waits: [],
  });
  assert.throws(
    () =>
      kernel.stepProgram(
        { ...trueGuard, conditionRef: { registryId: "missing", version: 9 } },
        {},
        { now: 0, rngState: 0, predicates: hydratePredicateRegistry() },
      ),
    (error) =>
      error instanceof Error && error.message === "Unknown predicate missing@9",
  );
});
