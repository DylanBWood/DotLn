import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { decodeLog, encodeLog } from "../../packages/kernel/dist/src/index.js";
import { readCorpusManifest } from "./generate-cadence-corpus.mjs";
import {
  REPO_ROOT,
  countRows,
  decodeNumbers,
  shipped,
  sha256,
  KINDS,
  GRID,
  REGISTRY,
  enumerateGrid,
  inspectGrid,
} from "./wo102-cadence-lib.mjs";
import { assertFindings } from "./bounded-findings.mjs";
const manifest = readCorpusManifest();
test("WO-185 replay lane's full-grid findings use bounded diagnostics", () => {
  assertFindings(
    inspectGrid(enumerateGrid()),
    manifest.findings.filter((row) => row.type !== "ambient-source-leakage"),
  );
});
const rows = [];
for (const fixture of manifest.fixtures) {
  const bytes = readFileSync(join(REPO_ROOT, fixture.path), "utf8");
  test(`WO-102 fixture ${fixture.path} hash and exact replay (${fixture.rows} vectors)`, () => {
    assert.equal(sha256(bytes), fixture.sha256);
    assert.equal(Buffer.byteLength(bytes), fixture.bytes);
    const envelopes = decodeLog(bytes);
    assert.equal(encodeLog(envelopes), bytes);
    const shard = envelopes.map((envelope, index) => {
      assert.equal(envelope.type, "CadenceGoldenVector");
      assert.equal(envelope.eventId, `evt_${index + 1}`);
      const row = decodeNumbers(envelope.payload);
      assert.equal(envelope.occurredAt, row.env.now);
      return row;
    });
    assert.equal(shard.length, fixture.rows);
    for (const row of shard) {
      const calls = [];
      assert.deepEqual(shipped(row, calls), row.expected, row.id);
      assert.deepEqual(calls, row.predicateCalls, row.id);
    }
  });
  rows.push(
    ...decodeLog(bytes).map((envelope) => decodeNumbers(envelope.payload)),
  );
}
test("WO-102 fixture census, counts, registry and explicit boundary classes match manifest", () => {
  assert.deepEqual(countRows(rows), manifest.counts.committed);
  assert.equal(new Set(rows.map((row) => row.id)).size, rows.length);
  assert.deepEqual(
    Object.keys(manifest.counts.full.byConstructor).sort(),
    [...KINDS].sort(),
  );
  assert.deepEqual(manifest.grid, GRID);
  assert.deepEqual(manifest.predicateRegistry, REGISTRY);
  assert.deepEqual(
    readdirSync(join(REPO_ROOT, "corpus/fixtures/cadence")).sort(),
    manifest.fixtures.map((fixture) => fixture.path.split("/").at(-1)).sort(),
  );
  for (const kind of ["Once", "After", "Every"])
    assert.equal(
      manifest.counts.full.byConstructor[kind],
      manifest.counts.committed.byConstructor[kind],
    );
  const classes = manifest.counts.committed.byClass.Every;
  for (const name of [
    "startAt-absent",
    "startAt-present",
    "at-start",
    "at-first-tick",
    "at-fourth-tick",
    "unit-interval",
    "huge-interval",
    "invalid-interval:NaN",
    "invalid-interval:+Infinity",
    "invalid-interval:-Infinity",
    "invalid-interval:0",
    "invalid-interval:-1",
  ])
    assert.ok(classes[name] > 0, name);
  for (const kind of KINDS)
    for (const name of Object.keys(manifest.counts.full.byClass[kind]))
      assert.ok(
        manifest.counts.committed.byClass[kind][name] > 0,
        `${kind}: ${name}`,
      );
});
