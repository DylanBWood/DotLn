import test from "node:test";
import assert from "node:assert/strict";
import { decodeLog } from "../../packages/kernel/dist/src/index.js";
import { runScenario } from "../../packages/skeleton/dist/src/scenario.js";
import {
  demoTree,
  exactFiles,
  GOLDEN,
  MANIFEST,
  OBSERVATIONS,
  read,
  readJson,
  SEED,
  sha256,
} from "./wo105-common.mjs";
import { buildGoldenFiles } from "./generate-golden-corpus.mjs";
import {
  assertScenarioIdentity,
  buildTreeFiles,
  generateTree,
  LABEL,
  SPECS,
  treeFamilies,
  validateTree,
} from "./generate-tree-corpus.mjs";
import {
  assertRecovery,
  classifyRecovery,
  crashOpening,
  recoveryFamilies,
  referencePending,
  skeletonSweep,
} from "./skeleton-crash-sweep.mjs";

test("WO-105 golden traces, event log and glyph scene match live/replay and recorded source/fixture bytes", () => {
  exactFiles(buildGoldenFiles(), "check");
  const golden = readJson(GOLDEN);
  const live = runScenario(demoTree());
  assertScenarioIdentity(live);
  assert.deepEqual(
    live.decisions.map((decision) => decision.trace),
    golden.decisionTraces,
  );
  assert.equal(live.log, golden.eventLog);
  assert.equal(live.glyphScene, golden.glyphScene);
  const manifest = readJson(MANIFEST);
  assert.equal(golden.baseCommit, manifest.baseCommit);
  for (const [path, expected] of Object.entries(manifest.oracles))
    assert.equal(sha256(read(path)), expected, path);
  for (const [path, expected] of Object.entries(manifest.fixtures)) {
    assert.equal(sha256(read(path)), expected.sha256, path);
    assert.equal(Buffer.byteLength(read(path)), expected.bytes, path);
  }
  const observations = read(OBSERVATIONS);
  assert.equal(sha256(observations), manifest.retention.observationsSha256);
  assert.ok(
    Buffer.byteLength(observations) <=
      manifest.retention.observationBudgetBytes,
  );
  const rows = observations
    .trimEnd()
    .split("\n")
    .map((line) => JSON.parse(line));
  for (const sweep of [...manifest.store.sweeps, ...manifest.skeleton.sweeps]) {
    const { recording: _recording, ...record } = rows.find(
      (row) => row.lane === sweep.lane && row.id === sweep.id,
    );
    assert.deepEqual(record, sweep);
  }
});

test("WO-105 tree generator, structural truth and distinct live signatures regenerate from seed", () => {
  exactFiles(buildTreeFiles(), "check");
  assert.deepEqual(buildTreeFiles(), buildTreeFiles(SEED));
  assert.notDeepEqual(buildTreeFiles("alternate"), buildTreeFiles());
  const families = treeFamilies();
  assert.equal(families.length, 4);
  assert.deepEqual(
    families.map(({ tree: _tree, truth: _truth, ...family }) => family),
    readJson(MANIFEST).treeFamilies,
  );
  assert.deepEqual(
    families.map((family) => family.disposition),
    Array(4).fill("included"),
  );
  assert.equal(
    new Set(families.map((family) => family.signatureSha256)).size,
    4,
  );
  assert.deepEqual(
    families.map((family) => family.signature.candidates.length),
    [1, 2, 3, 0],
  );
  assert.match(
    read("corpus/fixtures/skeleton-trees/README.md"),
    /NON-NORMATIVE/,
  );
  for (const { tree, truth } of families) {
    assert.equal(truth.label, LABEL);
    validateTree(tree, truth);
    assertScenarioIdentity(runScenario(tree));
  }
});

test("WO-105 validator rejects planted invalid inventories, graphs, classifications and ground truth", () => {
  const original = generateTree(SPECS[1], SEED);
  const corruptions = [
    ({ tree }) => tree.files.push(tree.files[0]),
    ({ tree }) => tree.files[0].referencedBy.push("absent.txt"),
    ({ tree }) =>
      tree.files[1].referencedBy.push(tree.files[1].referencedBy[0]),
    ({ tree }) => (tree.files[0].classification = "unrecognized"),
    ({ truth }) => truth.inventoryCount++,
    ({ truth }) => (truth.reachable = []),
    ({ truth }) => (truth.orphans = []),
    ({ truth }) => (truth.plantedCandidates = []),
    ({ truth }) => (truth.roots = ["absent.txt"]),
    ({ truth }) => (truth.label = "normative"),
  ];
  for (const corrupt of corruptions) {
    const copy = structuredClone(original);
    corrupt(copy);
    assert.throws(() => validateTree(copy.tree, copy.truth));
  }
});

test("WO-105 assert-tripping families retain explicit exclusion reasons", () => {
  const families = treeFamilies(SEED, () => {
    throw new Error("reactor did not declare a NoOp");
  });
  assert.deepEqual(
    families.map((family) => family.id),
    SPECS.map((spec) => spec.id),
  );
  for (const family of families) {
    assert.equal(family.disposition, "excluded-with-reason");
    assert.equal(family.reason, "reactor did not declare a NoOp");
    assert.equal(family.signature, undefined);
    validateTree(family.tree, family.truth);
  }
});

test("WO-105 recovery self-tests catch missing pending commands, duplicate effects and false trace identity", () => {
  const fixture = demoTree();
  const log = crashOpening(fixture);
  const surviving = decodeLog(log);
  assert.equal(referencePending(surviving).length, 1);
  const live = runScenario(fixture, { crashAfterPersist: true });
  assertRecovery(live, surviving, 1);
  assert.throws(
    () => assertRecovery({ ...live, recoveredCommands: [] }, surviving, 1),
    /pending commands recomputed/,
  );
  assert.throws(
    () => assertRecovery({ ...live, adapterEffects: 2 }, surviving, 2),
    /more than one effect/,
  );
  const decisions = structuredClone(live.decisions);
  decisions[0].trace.branchPath = ["planted divergence"];
  assert.throws(
    () => assertRecovery({ ...live, decisions }, surviving, 1),
    /live\/replay decision traces/,
  );
  assert.equal(classifyRecovery(fixture, log, "").adapterEffects, 0);
  assert.equal(
    classifyRecovery(fixture, log, log.slice(0, 1), 1).outcome,
    "loud-failure",
  );
  assert.throws(
    () =>
      classifyRecovery(fixture, log, "{", 1, (_fixture, options) => {
        options.recoveryLogTransform(log);
        return live;
      }),
    /undecodable log silently recovered/,
  );
  for (const { log: transformed } of recoveryFamilies(log))
    assert.equal(classifyRecovery(fixture, log, transformed).adapterEffects, 1);
  const persist = surviving.find((event) => event.type === "CommandPersisted");
  const result = {
    type: "CommandResult",
    payload: { commandId: persist.payload.command.commandId },
  };
  assert.deepEqual(referencePending([result, persist, result]), []);
});

test("WO-105 every declared skeleton cut and both retained families satisfy recovery invariants", () => {
  const result = skeletonSweep();
  assert.deepEqual(result, readJson(MANIFEST).skeleton);
  assert.equal(result.cutPoints, 16554);
  assert.equal(result.sweeps[0].outcomes["recovered-prefix"], 12);
  assert.equal(result.sweeps[0].outcomes["loud-failure"], 16542);
});
