import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildCorpus,
  checkCorpus,
  parseArgs,
  MANIFEST_PATH,
  TOOLCHAIN_PROFILE,
  renderFindings,
} from "./generate-cadence-corpus.mjs";
import {
  RECORDED_SEED,
  PINNED_BASE_COMMIT,
  REPO_ROOT,
  decodeNumbers,
  encodeNumbers,
  enumerateGrid,
  inspectRow,
  inspectPurity,
  outcome,
  json,
  reference,
  shipped,
} from "./wo102-cadence-lib.mjs";
import { HAND_COMPUTED_BACKOFF, referenceDraw } from "./wo102-reference.mjs";

const manifest = JSON.parse(
  readFileSync(join(REPO_ROOT, MANIFEST_PATH), "utf8"),
);
test("WO-102 literal planted anchors pin next-tick, default origin, throws and hand-computed Backoff", () => {
  const anchor = (cadence, env, expected) => {
    const row = { cadence, state: {}, env };
    assert.deepEqual(shipped(row), expected);
    assert.deepEqual(reference(row), expected);
  };
  anchor(
    { kind: "Every", intervalMs: 20 },
    { now: 0, rngState: 7 },
    { result: { dueAt: 20, rngState: 7, trace: "Every:20" } },
  );
  anchor(
    { kind: "Every", intervalMs: 20, startAt: 50 },
    { now: 50, rngState: 7 },
    { result: { dueAt: 70, rngState: 7, trace: "Every:20" } },
  );
  anchor(
    { kind: "Every", intervalMs: 20, startAt: 50 },
    { now: 130, rngState: 7 },
    { result: { dueAt: 150, rngState: 7, trace: "Every:20" } },
  );
  anchor(
    { kind: "Every", intervalMs: 0 },
    { now: 0, rngState: 7 },
    { throws: { name: "Error", message: "Every intervalMs must be positive" } },
  );
  anchor(
    { kind: "Once", at: 50 },
    { now: 100, rngState: 7 },
    { result: { dueAt: 50, rngState: 7, trace: "Once:50" } },
  );
  anchor(
    { kind: "After", delayMs: 10 },
    { now: 100, rngState: 7 },
    { result: { dueAt: 110, rngState: 7, trace: "After:10" } },
  );
  assert.deepEqual(shipped(HAND_COMPUTED_BACKOFF), {
    result: HAND_COMPUTED_BACKOFF.expected,
  });
  assert.deepEqual(reference(HAND_COMPUTED_BACKOFF), {
    result: HAND_COMPUTED_BACKOFF.expected,
  });
  assert.equal(referenceDraw(42).next, 1083814273);
  for (const [seed, next] of [
    [634785765, 0],
    [615934122, 1],
    [2782269413, 2147483648],
    [653637408, 4294967295],
  ]) {
    assert.equal(referenceDraw(seed).next, next);
    anchor(
      {
        kind: "Backoff",
        initialMs: 0,
        factor: 2,
        maxMs: 0,
        attempt: 0,
        jitter: 0,
      },
      { now: 100, rngState: seed },
      { result: { dueAt: 100, rngState: next, trace: "Backoff:0:0" } },
    );
  }
  anchor(
    {
      kind: "Backoff",
      initialMs: 1,
      factor: 0.5,
      maxMs: 100000,
      attempt: 1,
      jitter: 1,
    },
    { now: 0, rngState: 2782269413 },
    { result: { dueAt: 1, rngState: 2147483648, trace: "Backoff:1:1" } },
  );
  anchor(
    {
      kind: "Backoff",
      initialMs: 100,
      factor: 2,
      maxMs: 100000,
      attempt: 3,
      jitter: 2,
    },
    { now: 100, rngState: 7 },
    { result: { dueAt: 100, rngState: 1025555898, trace: "Backoff:3:0" } },
  );
});
test("WO-102 tagged numbers preserve nonfinite intervals; absent startAt is actually absent", () => {
  for (const value of [NaN, Infinity, -Infinity])
    assert.ok(Object.is(decodeNumbers(JSON.parse(json(value))), value));
  assert.throws(
    () => decodeNumbers({ $number: "unknown" }),
    /Unknown tagged number/,
  );
  const rows = enumerateGrid();
  const absent = rows.filter(
    (row) => row.kind === "Every" && row.classes.includes("startAt-absent"),
  );
  assert.ok(absent.length > 0);
  for (const row of absent)
    assert.equal(
      Object.hasOwn(JSON.parse(json(row)).cadence, "startAt"),
      false,
    );
  for (const tag of ["NaN", "+Infinity", "-Infinity"])
    assert.ok(
      rows.some(
        (row) =>
          row.kind === "Every" &&
          row.classes.includes(`invalid-interval:${tag}`) &&
          row.expected.throws,
      ),
    );
});
test("WO-102 generator parser rejects missing, duplicate and ambiguous options", () => {
  assert.deepEqual(parseArgs(["--seed", RECORDED_SEED, "--check"]), {
    seed: RECORDED_SEED,
    mode: "check",
  });
  for (const args of [
    [],
    ["--check"],
    ["--seed"],
    ["--seed", "--write"],
    ["--seed", RECORDED_SEED, "--check", "--write"],
    ["--seed", RECORDED_SEED, "--seed", "x", "--write"],
    ["--seed", "x", "--write", "--unexpected"],
  ])
    assert.throws(() => parseArgs(args));
});
test("WO-102 regeneration is byte-identical and seed changes selection without changing the full set", () => {
  const first = buildCorpus(RECORDED_SEED);
  assert.equal(checkCorpus(first), true);
  const repeat = buildCorpus(RECORDED_SEED);
  assert.deepEqual(first.files, repeat.files);
  const alternate = buildCorpus(`${RECORDED_SEED}-alternate`);
  assert.deepEqual(first.full, alternate.full);
  assert.notDeepEqual(
    first.files.filter((file) => file.path.endsWith(".jsonl")),
    alternate.files.filter((file) => file.path.endsWith(".jsonl")),
  );
  assert.deepEqual(first.manifest.counts, manifest.counts);
  assert.equal(manifest.pinnedBaseCommit, PINNED_BASE_COMMIT);
  assert.equal(manifest.seed, RECORDED_SEED);
  assert.deepEqual(manifest.toolchainProfile, TOOLCHAIN_PROFILE);
  assert.deepEqual(manifest.handComputedBackoff, HAND_COMPUTED_BACKOFF);
  assert.ok(
    manifest.fixtureTotals.bytes <=
      manifest.selection.budget.maximumTotalFixtureBytes,
  );
});
test("WO-102 detects planted clamp/threading drift and renders a numbered exact quarantine", () => {
  const row = { id: "planted", kind: "Backoff", ...HAND_COMPUTED_BACKOFF };
  const mutant = () => ({
    result: { dueAt: 100101, rngState: 42, trace: "Backoff:3:100001" },
  });
  const issues = inspectRow(row, mutant);
  assert.deepEqual(
    issues.map((issue) => issue.type),
    ["shipped-reference-drift", "backoff-clamp", "rng-threading"],
  );
  const finding = { number: "WO-102-F001", ...issues[0] };
  const rendered = renderFindings([finding]);
  assert.match(rendered, /## WO-102-F001/);
  assert.deepEqual(
    JSON.parse(rendered.match(/```json\n([\s\S]*?)\n```/)[1]),
    encodeNumbers(finding),
  );
  const source = readFileSync(
    join(REPO_ROOT, "corpus/harness/wo102-reference.mjs"),
    "utf8",
  );
  assert.doesNotMatch(source, /(?:import\s|Math\.imul|>>>|\*\*)/);
});

test("WO-102 poison-only violations are exact findings and host functions are restored", () => {
  const row = {
    id: "planted-purity",
    kind: "Backoff",
    ...HAND_COMPUTED_BACKOFF,
    expected: { result: HAND_COMPUTED_BACKOFF.expected },
  };
  const now = Date.now;
  const random = Math.random;
  for (const ambient of [() => Date.now(), () => Math.random()]) {
    const evaluator = (input) =>
      outcome(() => {
        ambient();
        return shipped(input).result;
      });
    const findings = inspectPurity([row], evaluator);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].type, "ambient-source-leakage");
    assert.equal(findings[0].vectorId, row.id);
    assert.deepEqual(findings[0].expected, {
      result: HAND_COMPUTED_BACKOFF.expected,
    });
    assert.match(
      findings[0].actual.throws.message,
      /ambient (Date.now|Math.random) consulted/,
    );
    assert.equal(Date.now, now);
    assert.equal(Math.random, random);
  }
});
