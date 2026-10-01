import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  MANIFEST_PATH,
  FINDINGS_PATH,
  renderFindings,
} from "./generate-cadence-corpus.mjs";
import {
  REPO_ROOT,
  GRID,
  countRows,
  enumerateGrid,
  inspectGrid,
  inspectPurity,
  json,
} from "./wo102-cadence-lib.mjs";
const manifest = JSON.parse(
  readFileSync(join(REPO_ROOT, MANIFEST_PATH), "utf8"),
);
const full = enumerateGrid();
test(`WO-102 full declared sweep (${full.length}): drift, determinism, clamp, RNG threading, call order, no mutation`, () => {
  assert.deepEqual(countRows(full), manifest.counts.full);
  const expectedBackoff = Object.values(GRID.Backoff).reduce(
    (product, values) => product * values.length,
    1,
  );
  assert.equal(manifest.counts.full.byConstructor.Backoff, expectedBackoff);
  const cells = full
    .filter((row) => row.kind === "Backoff")
    .map((row) => json([row.cadence, row.env]));
  assert.equal(
    new Set(cells).size,
    expectedBackoff,
    "Every declared Cartesian cell occurs exactly once",
  );
  assert.deepEqual(
    inspectGrid(full),
    manifest.findings.filter(
      (finding) => finding.type !== "ambient-source-leakage",
    ),
    "New or changed violations require numbered reproducing findings",
  );
  if (manifest.findings.length)
    assert.equal(
      readFileSync(join(REPO_ROOT, FINDINGS_PATH), "utf8"),
      renderFindings(manifest.findings),
    );
  else assert.equal(existsSync(join(REPO_ROOT, FINDINGS_PATH)), false);
});
test(`WO-102 no ambient clock or RNG under poisoned Date.now/Math.random (${full.length} vectors)`, () => {
  const findings = inspectPurity(full);
  assert.deepEqual(
    findings,
    manifest.findings
      .filter((finding) => finding.type === "ambient-source-leakage")
      .map(({ number, ...finding }) => finding),
    "Ambient dependence must be quarantined with its exact reproducer",
  );
});
test("WO-102 composition enumeration covers every truth mask, version, depth and terminal path", () => {
  for (const kind of ["Gate", "Until"])
    for (const eventClass of [
      "event-absent",
      "event:OpenGate",
      "event:OtherEvent",
    ])
      assert.ok(
        manifest.counts.full.byClass[kind][eventClass] > 0,
        `${kind}: ${eventClass}`,
      );
  const composed = full.filter(
    (row) => row.kind === "Gate" || row.kind === "Until",
  );
  for (const root of GRID.composition.roots)
    for (const depth of GRID.composition.depths)
      for (const profile of GRID.composition.profiles) {
        const rows = composed.filter(
          (row) =>
            row.kind === root &&
            row.classes.includes(`depth:${depth}`) &&
            row.classes.includes(`profile:${profile}`),
        );
        assert.equal(rows.length, 2 ** depth * GRID.composition.leaves.length);
        for (let mask = 0; mask < 2 ** depth; mask++) {
          const assignments = rows.filter((row) =>
            row.classes.includes(`truth-mask:${mask}`),
          );
          assert.equal(assignments.length, GRID.composition.leaves.length);
          let reached = depth;
          for (let level = 0; level < depth; level++) {
            const kind =
              level % 2 === 0 ? root : root === "Gate" ? "Until" : "Gate";
            const truth = (mask & (1 << level)) !== 0;
            if ((kind === "Gate" && !truth) || (kind === "Until" && truth)) {
              reached = level + 1;
              break;
            }
          }
          for (const row of assignments) {
            assert.equal(row.predicateCalls.length, reached, row.id);
            assert.deepEqual(
              row.predicateCalls.map((ref) => ref.params.level),
              Array.from({ length: reached }, (_, level) => level),
            );
            assert.deepEqual(
              row.predicateCalls.map((ref) => ref.version),
              Array.from({ length: reached }, (_, level) => (level % 2) + 1),
            );
          }
        }
      }
  // Explicit null paths suppress even a failing child; the open path throws.
  const unknown = composed.filter((row) =>
    row.classes.includes("unknown-predicate-short-circuit"),
  );
  assert.equal(unknown.length, 8);
  assert.equal(unknown.filter((row) => row.expected.throws).length, 4);
  assert.equal(
    unknown.filter((row) => row.expected.result?.dueAt === null).length,
    4,
  );
});
