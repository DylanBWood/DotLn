import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { digest } from "./wo107-records.mjs";

const sizes = [64, 1024, 8192];
export const SCENARIO_IDS = [
  ...sizes.flatMap((size) => [
    `replay/${size}`,
    `decodeLog/${size}`,
    `encodeLog/${size}`,
  ]),
  ...[
    "Once",
    "After",
    "Every",
    "Burst",
    "Calendar",
    "Window",
    "While",
    "Until",
    "Gate",
    "Sequence",
    "Merge",
    "Race",
    "Repeat",
    "Backoff",
  ].map((kind) => `evaluateCadence/${kind}`),
  ...["empty", "ascii-short", "unicode", "ascii-4096"].map(
    (name) => `stableHash/${name}`,
  ),
  ...["workstream", "episode", "unicode", "long"].map(
    (name) => `commandId/${name}`,
  ),
  "skeleton/live",
  "skeleton/replay",
  "command/build",
  "command/kernel",
  "command/skeleton",
];
export const metadata = (scenarios) =>
  scenarios.map(({ run, ...spec }) => spec);

export async function scenarios(runCommand) {
  const k = await import("../../packages/kernel/dist/src/index.js");
  const demo = await import("../../packages/skeleton/dist/src/scenario.js");
  const registry = [];
  const add = (id, family, description, units, unit, run, parameters = {}) =>
    registry.push({
      id,
      family,
      description,
      units,
      unit,
      warmups: 2,
      repetitions: 9,
      command: [],
      parameters,
      run,
    });
  const trace = {
    reactorId: "wo107-counter",
    reactorVersion: "1",
    branchPath: [],
    envInputs: [],
    cadenceEvaluations: [],
  };
  const reactor = (state, event) => ({
    state: { count: state.count + event.payload.amount },
    intents: [],
    schedules: [],
    trace,
  });
  for (const size of sizes) {
    const events = Array.from({ length: size }, (_, i) => ({
      schemaVersion: 1,
      eventId: `evt_${i + 1}`,
      type: "Counted",
      occurredAt: i,
      actorId: "profiling-fixture",
      workstreamId: "wo107-synthetic",
      payload: {
        amount: 1,
        label: `item-${i}`,
        nested: { enabled: i % 2 === 0 },
      },
    }));
    const log = k.encodeLog(events);
    assert.deepEqual(k.decodeLog(log), events);
    const batches = Math.max(2, Math.floor(16384 / size));
    const parameters = {
      events: size,
      utf8Bytes: Buffer.byteLength(log),
      batches,
      fixtureSha256: digest(log),
    };
    add(
      `replay/${size}`,
      "a",
      "Kernel replay over generated valid events with a synthetic counting reactor; fixture generation and decoding excluded.",
      size * batches,
      "events",
      () => {
        let result;
        for (let i = 0; i < batches; i++)
          result = k.replay({ count: 0 }, events, reactor, {});
        assert.equal(result.state.count, size);
        assert.equal(result.decisions.length, size);
        return [result.state.count, result.decisions.length];
      },
      parameters,
    );
    add(
      `decodeLog/${size}`,
      "d",
      "Decode complete generated JSONL; envelope and payload validation included.",
      size * batches,
      "events",
      () => {
        let result;
        for (let i = 0; i < batches; i++) result = k.decodeLog(log);
        assert.equal(result.length, size);
        return [result.length, result.at(-1).eventId];
      },
      parameters,
    );
    add(
      `encodeLog/${size}`,
      "d",
      "Encode generated event objects to complete JSONL.",
      size * batches,
      "events",
      () => {
        let result;
        for (let i = 0; i < batches; i++) result = k.encodeLog(events);
        assert.equal(result, log);
        return result.length;
      },
      parameters,
    );
  }
  const conditionRef = { registryId: "wo107.open", version: 1 };
  const predicates = { "wo107.open": { 1: ({ state }) => state.open } };
  const grids = {
    Once: [0, 50, 1000].map((at) => k.Cadence.Once(at)),
    After: [0, 1, 1000].map((delay) => k.Cadence.After(delay)),
    Every: [1, 7, 1000].flatMap((interval) =>
      [undefined, 50].map((start) => k.Cadence.Every(interval, start)),
    ),
    Gate: [k.Cadence.Once(50), k.Cadence.Every(7, 3)].map((c) =>
      k.Cadence.Gate(c, conditionRef),
    ),
    Until: [k.Cadence.After(1), k.Cadence.Every(7, 3)].map((c) =>
      k.Cadence.Until(c, conditionRef),
    ),
    Backoff: [0, 3, 12].flatMap((attempt) =>
      [0, 0.5, 2].map((jitter) =>
        k.Cadence.Backoff(100, 2, 10000, attempt, jitter),
      ),
    ),
    Burst: [1, 4].map((count) => ({ kind: "Burst", count, intervalMs: 7 })),
    Calendar: ["UTC", "America/New_York"].map((timezone) => ({
      kind: "Calendar",
      expression: "0 * * * *",
      timezone,
    })),
    Window: [0, 50].map((start) => ({
      kind: "Window",
      cadence: k.Cadence.Every(7),
      start,
      end: 100,
    })),
    While: [k.Cadence.Once(50), k.Cadence.After(1)].map((cadence) => ({
      kind: "While",
      cadence,
      conditionRef,
    })),
    Sequence: [1, 3].map((n) => ({
      kind: "Sequence",
      cadences: Array.from({ length: n }, () => k.Cadence.After(1)),
    })),
    Merge: [1, 3].map((n) => ({
      kind: "Merge",
      cadences: Array.from({ length: n }, () => k.Cadence.Once(50)),
    })),
    Race: [1, 3].map((n) => ({
      kind: "Race",
      cadences: Array.from({ length: n }, () => k.Cadence.After(1)),
    })),
    Repeat: [1, 3].map((count) => ({
      kind: "Repeat",
      cadence: k.Cadence.After(1),
      count,
    })),
  };
  assert.deepEqual(Object.keys(grids).sort(), [...k.CADENCE_KINDS].sort());
  for (const kind of k.CADENCE_KINDS) {
    const supported = k.EVALUABLE_CADENCE_KINDS.includes(kind);
    const cases = grids[kind].flatMap((cadence) =>
      [0, 49, 50, 51, 10000].flatMap((now) =>
        [false, true].flatMap((open) =>
          [7, 42].map((rngState) => ({
            cadence,
            state: { open },
            env: { now, rngState, predicates },
          })),
        ),
      ),
    );
    const batches = supported ? 100 : 5;
    add(
      `evaluateCadence/${kind}`,
      "b",
      `${kind}: ${supported ? "evaluation" : "expected deferred-evaluation rejection"} over parameter, time, predicate and RNG grids.`,
      cases.length * batches,
      "calls",
      () => {
        let checksum = 0;
        for (let i = 0; i < batches; i++)
          for (const c of cases) {
            if (supported) {
              const result = k.evaluateCadence(c.cadence, c.state, c.env);
              checksum += (result.dueAt ?? 0) + result.rngState;
            } else {
              let message;
              try {
                k.evaluateCadence(c.cadence, c.state, c.env);
              } catch (error) {
                message = error.message;
              }
              assert.equal(message, `Cadence ${kind} evaluation is deferred`);
              checksum++;
            }
          }
        return checksum;
      },
      {
        grids: grids[kind],
        now: [0, 49, 50, 51, 10000],
        open: [false, true],
        rngState: [7, 42],
        batches,
        expected: supported ? "evaluated" : "deferred rejection",
      },
    );
  }
  for (const [name, input, batches] of [
    ["empty", "", 10000],
    ["ascii-short", "wo107-personal-fixture", 10000],
    ["unicode", "café Δ 🌳 漢字", 10000],
    ["ascii-4096", "x".repeat(4096), 100],
  ]) {
    const expected = k.stableHash(input);
    add(
      `stableHash/${name}`,
      "c",
      `stableHash UTF-8 input class ${name}; encoding included.`,
      batches,
      "hashes",
      () => {
        let result;
        for (let i = 0; i < batches; i++) result = k.stableHash(input);
        assert.equal(result, expected);
        return result;
      },
      { input, batches },
    );
  }
  for (const [name, workstream, episode] of [
    ["workstream", "wo107-fixture", undefined],
    ["episode", "wo107-fixture", "synthetic-episode"],
    ["unicode", "流れ-🌳", "épisode-Δ"],
    ["long", "w".repeat(1024), "e".repeat(1024)],
  ]) {
    const batches = name === "long" ? 200 : 5000;
    add(
      `commandId/${name}`,
      "c",
      `commandId ${name} identities with varying decision and intent indices.`,
      batches,
      "ids",
      () => {
        let result;
        for (let i = 0; i < batches; i++)
          result = k.commandId(workstream, episode, i, i % 7);
        assert.match(result, /^cmd_[a-f0-9]{16}$/);
        return result;
      },
      { workstream, episode: episode ?? null, batches },
    );
  }
  const tree = JSON.parse(
    readFileSync("packages/skeleton/fixtures/repo-tree.json", "utf8"),
  );
  const live = demo.runScenario(tree);
  const replayed = demo.replayScenario(live.log);
  assert.equal(live.verified, true);
  assert.equal(live.adapterEffects, 1);
  assert.deepEqual(replayed.decisions, live.decisions);
  assert.deepEqual(replayed.timeline, live.timeline);
  const demoParameters = {
    fixture: "packages/skeleton/fixtures/repo-tree.json",
    fixtureSha256: digest(JSON.stringify(tree)),
    events: k.decodeLog(live.log).length,
    logSha256: digest(live.log),
    batches: 5,
  };
  for (const mode of ["live", "replay"])
    add(
      `skeleton/${mode}`,
      "e",
      `Full current canonical 13-step demo (${demoParameters.events} persisted events), ${mode}; shipped deterministic fake transports, no model invocation.`,
      5,
      "demos",
      () => {
        let result;
        for (let i = 0; i < 5; i++)
          result =
            mode === "live"
              ? demo.runScenario(tree)
              : demo.replayScenario(live.log);
        assert.equal(result.verified, true);
        assert.equal(result.log, live.log);
        return [result.log, result.timeline];
      },
      demoParameters,
    );
  for (const suite of ["build", "kernel", "skeleton"]) {
    const files =
      suite === "build"
        ? []
        : readdirSync(`packages/${suite}/dist/test`)
            .filter((f) => f.endsWith(".test.js"))
            .sort()
            .map((f) => `packages/${suite}/dist/test/${f}`);
    const command =
      suite === "build"
        ? ["npm", "run", "build"]
        : [
            "node",
            "--test",
            "--test-reporter=tap",
            "--test-concurrency=2",
            ...files,
          ];
    registry.push({
      id: `command/${suite}`,
      family: "f",
      description:
        suite === "build"
          ? "Full npm run build; shipped build stages a fresh forced TypeScript build, filesystem caches uncontrolled."
          : `Complete ${suite} node:test suite, including document tests; file concurrency 2; all ${files.length} files explicitly enumerated.`,
      warmups: 1,
      repetitions: 3,
      units: 1,
      unit: "commands",
      command,
      parameters: { files },
      run: () => runCommand(command),
    });
  }
  assert.deepEqual(
    registry.map((s) => s.id),
    SCENARIO_IDS,
  );
  return registry;
}
