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
  readCorpusManifest,
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
import { assertFindings, summarizeFindings } from "./bounded-findings.mjs";

const manifest = readCorpusManifest();
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
  assertFindings(first.findingsSummary, manifest.findings);
  assert.equal(checkCorpus(first), true);
  const repeat = buildCorpus(RECORDED_SEED);
  assert.deepEqual(first.files, repeat.files);
  const alternate = buildCorpus(`${RECORDED_SEED}-alternate`);
  assertFindings(
    summarizeFindings(first.full),
    summarizeFindings(alternate.full),
    "Full grid changed",
  );
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
    const summary = inspectPurity([row], evaluator);
    assert.equal(summary.total, 1);
    const findings = summary.kept;
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

test("WO-185 bounded full-grid equality distinguishes nonfinite swaps beyond its retained rows", () => {
  const full = enumerateGrid();
  const baseline = summarizeFindings(full);
  let changed = false;
  function swap(value) {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (typeof child === "number" && !Number.isFinite(child)) {
        value[key] = Number.isNaN(child) ? Infinity : NaN;
        changed = true;
        return;
      }
      swap(child);
      if (changed) return;
    }
  }
  for (const row of full.slice(32)) {
    swap(row);
    if (changed) break;
  }
  assert.equal(changed, true);
  assert.throws(
    () => assertFindings(summarizeFindings(full), baseline),
    /Full|findings total=/,
  );
  assertFindings(
    summarizeFindings([{ a: 1, b: 1.5 }]),
    summarizeFindings([{ b: 1.5, a: 1 }]),
  );
  // The class also includes JSON's null, signed-zero and missing-value aliases.
  for (const [left, right] of [
    [NaN, null],
    [Infinity, -Infinity],
    [0, -0],
    [undefined, null],
    [{ x: undefined }, {}],
    [Array(1), [undefined]],
    [NaN, { $number: "NaN" }],
  ]) {
    assert.throws(
      () =>
        assertFindings(summarizeFindings([left]), summarizeFindings([right])),
      /findings total=/,
    );
  }
});

test("WO-185 oversized drift quarantine refuses generation before changing any file", async (t) => {
  const {
    mkdtempSync,
    mkdirSync,
    cpSync,
    writeFileSync,
    rmSync,
    readdirSync,
    realpathSync,
  } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { execFileSync } = await import("node:child_process");
  const scratch = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-wo185-quarantine-")),
  );
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  mkdirSync(join(scratch, "corpus/harness"), { recursive: true });
  mkdirSync(join(scratch, "packages/kernel"), { recursive: true });
  for (const name of [
    "bounded-findings.mjs",
    "wo102-cadence-lib.mjs",
    "wo102-reference.mjs",
    "generate-cadence-corpus.mjs",
  ])
    cpSync(
      join(REPO_ROOT, "corpus/harness", name),
      join(scratch, "corpus/harness", name),
    );
  cpSync(
    join(REPO_ROOT, "packages/kernel/dist"),
    join(scratch, "packages/kernel/dist"),
    { recursive: true },
  );
  cpSync(
    join(REPO_ROOT, "packages/kernel/package.json"),
    join(scratch, "packages/kernel/package.json"),
  );
  const kernel = join(scratch, "packages/kernel/dist/src/core.js");
  const original = readFileSync(kernel, "utf8");
  assert.equal(original.split("rngState: next,").length, 2);
  writeFileSync(
    kernel,
    original.replace("rngState: next,", "rngState: env.rngState,"),
  );
  mkdirSync(join(scratch, "corpus/manifests"), { recursive: true });
  const prior = "Preserve the previous exact corpus.\n";
  writeFileSync(join(scratch, MANIFEST_PATH), prior);
  let failure;
  try {
    execFileSync(
      process.execPath,
      [
        join(scratch, "corpus/harness/generate-cadence-corpus.mjs"),
        "--seed",
        RECORDED_SEED,
        "--write",
      ],
      { encoding: "utf8", timeout: 20000, stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch (error) {
    failure = error;
  }
  assert.equal(
    failure?.status,
    1,
    String(failure?.stack ?? "generator unexpectedly succeeded"),
  );
  assert.match(
    failure.stderr,
    /findings-limit:.*findings total=126792; kept=32; digest=/,
  );
  assert.equal(readFileSync(join(scratch, MANIFEST_PATH), "utf8"), prior);
  assert.deepEqual(readdirSync(join(scratch, "corpus")).sort(), [
    "harness",
    "manifests",
  ]);
  assert.deepEqual(readdirSync(join(scratch, "corpus/manifests")), [
    "WO-102.json",
  ]);
});
