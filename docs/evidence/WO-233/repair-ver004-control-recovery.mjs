// Retire six empty modeled owners from the failed regression run. Preserve
// their original markers and the real fixture's complete diagnosis window.
import assert from "node:assert/strict";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  activeGateRuns,
  readGateChecks,
} from "../../../scripts/lib/gate-evidence.mjs";
import {
  hostStateRoot,
  withHostLock,
} from "../../../scripts/lib/host-resources.mjs";
import { readHolders } from "../../../scripts/lib/host-lanes.mjs";
import {
  ownerAlive,
  readTemporaryOwner,
  removeTemporaryRoot,
  temporaryProcessTable,
  writeTemporaryOwner,
} from "../../../scripts/lib/temporary-roots.mjs";
import { judgeTemporaryRoot } from "../../../scripts/lib/temporary-prune.mjs";

const root = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));
const gateId = "5fb3245b-08ca-418c-b84d-dd90e075ff89";
const apply = process.argv.includes("--apply");
assert.ok(process.argv.slice(2).every((arg) => arg === "--apply"));
const row = readGateChecks(root).findLast(
  (entry) => entry.temporaryGateId === gateId,
);
assert.equal(row?.exitCode, 1);
const parent = row.temporaryCleanup.retained.find((entry) =>
  entry.path.endsWith("/dotln-fixture-temporary-9rvIsx"),
).path;
const specs = [
  [
    "dotln-temporary-roots-test-S5iDce",
    "roots/runtime-parent-u6z6bF/keep-DyIbuG",
    "worker-capture",
    "runtime-fixture",
  ],
  [
    "dotln-temporary-roots-test-UK0ztn",
    "roots/policy-parent-1CDjUO/protected-9BoWbL",
    "session-scratch",
    "removed-policy",
  ],
  [
    "dotln-temporary-roots-test-gDBW3Z",
    "roots/forever-ogycCS",
    "gate-fixture",
    null,
  ],
  [
    "dotln-temporary-roots-test-iRYRdO",
    "roots/dotln-expired-fixture-iCjj5z/nested-llTdgw",
    "session-scratch",
    "211b10d8-a7bb-4cd9-b302-d78f4bad876a",
  ],
  [
    "dotln-temporary-roots-test-iWeF1a",
    "roots/dotln-expired-fixture-EMdo51/nested-RAzfYW",
    "session-scratch",
    "cce54fd3-3727-451a-9ca0-54346989ece7",
  ],
  [
    "dotln-temporary-roots-test-tcibUV",
    "roots/dotln-expired-fixture-4xKVhW/nested-Jn9Nr3",
    "warm-fixture",
    "cd712af9-085f-4ead-9bac-71c440a08434",
  ],
];
const marker = (path) => join(path, ".dotln-owner.json");
const evidence = await withHostLock(hostStateRoot(), "lanes", async () => {
  assert.equal(activeGateRuns(root).length, 0);
  assert.equal(
    readHolders(hostStateRoot(), { worktree: root }).holders.length,
    0,
  );
  const processes = temporaryProcessTable(root);
  assert.ok(Array.isArray(processes));
  const outer = readTemporaryOwner(parent);
  const originalParent = readFileSync(marker(parent), "utf8");
  assert.equal(outer.owner.repository, root);
  assert.equal(outer.owner.gateId, gateId);
  assert.equal(outer.owner.suite, "harness-fixtures");
  assert.equal(outer.outcome, "failed");
  assert.equal(outer.retentionHours, 24);
  assert.equal(ownerAlive(outer, processes), false);
  const backup = join(parent, ".dotln-synthetic-control-markers.json");
  const saved = existsSync(backup)
    ? JSON.parse(readFileSync(backup, "utf8"))
    : null;
  const planned = specs.map(([containerName, child, kind, ownerGate]) => {
    const container = join(parent, containerName);
    const containerOwner = readTemporaryOwner(container);
    assert.equal(containerOwner.owner.repository, root);
    assert.equal(containerOwner.owner.gateId, gateId);
    assert.equal(containerOwner.owner.suite, "harness-fixtures");
    assert.equal(containerOwner.fixtureOwner.token, outer.token);
    assert.equal(ownerAlive(containerOwner, processes), false);
    const path = join(container, child);
    const name = relative(parent, path);
    const info = lstatSync(path, { throwIfNoEntry: false });
    if (info) assert.ok(info.isDirectory() && !info.isSymbolicLink());
    const markerExists =
      info && lstatSync(marker(path), { throwIfNoEntry: false });
    const original = markerExists
      ? readFileSync(marker(path), "utf8")
      : saved?.controls.find((entry) => entry.path === name)?.original;
    assert.equal(typeof original, "string");
    const record = JSON.parse(original);
    assert.equal(record.class, kind);
    assert.equal(record.owner.pid, 2147483647);
    assert.equal(record.owner.birth, "1.0");
    assert.equal(record.owner.gateId ?? null, ownerGate);
    assert.ok(
      record.owner.repository === container ||
        record.owner.repository.startsWith(container + "/"),
    );
    assert.equal(ownerAlive(record, processes), false);
    if (info) {
      assert.equal(info.dev, record.device);
      assert.equal(info.ino, record.inode);
      if (markerExists) {
        assert.deepEqual(readTemporaryOwner(path), record);
        assert.deepEqual(readdirSync(path), [".dotln-owner.json"]);
      } else {
        // Recursive removal can unlink the marker before removing its empty
        // directory. Only the archived identity permits completing that step.
        assert.ok(saved);
        assert.deepEqual(readdirSync(path), []);
      }
    }
    return {
      path,
      name,
      record,
      original,
      container,
      restoreMarker: Boolean(info && !markerExists),
      originalContainer: readFileSync(marker(container), "utf8"),
    };
  });
  const archive = {
    parent: originalParent,
    controls: planned.map((entry) => ({
      path: entry.name,
      original: entry.original,
      container: entry.originalContainer,
    })),
  };
  if (saved) assert.deepEqual(saved, archive);
  if (apply) {
    if (!saved)
      writeFileSync(backup, JSON.stringify(archive) + "\n", {
        flag: "wx",
        mode: 0o600,
      });
    for (const entry of planned) {
      if (entry.restoreMarker) {
        assert.deepEqual(readdirSync(entry.path), []);
        writeTemporaryOwner(entry.path, entry.record);
      }
      if (lstatSync(entry.path, { throwIfNoEntry: false }))
        removeTemporaryRoot(entry.path, entry.record.token);
    }
  }
  assert.equal(readFileSync(marker(parent), "utf8"), originalParent);
  for (const entry of planned)
    assert.equal(
      readFileSync(marker(entry.container), "utf8"),
      entry.originalContainer,
    );
  const later = judgeTemporaryRoot(
    root,
    parent,
    { now: Date.parse(outer.endedAt) + 49 * 3_600_000 },
    {
      processes,
      worktrees: [],
      holders: [],
      finishingGate: { id: gateId, repository: root },
    },
  );
  if (apply) assert.ok(later.candidate, later.retained?.reason);
  return {
    observedAt: new Date().toISOString(),
    apply,
    sourceGate: gateId,
    sourceRecordedAt: row.recordedAt,
    rule: "Creator disposal of exactly six empty source-identified synthetic controls; preserve original markers and the real failed fixture's diagnosis window.",
    controls: planned.map(({ name, record }) => ({
      path: name,
      class: record.class,
      ownerGate: record.owner.gateId ?? null,
      retentionHours: record.retentionHours,
      emptyApartFromOwner: true,
    })),
    controlsRemaining: planned.filter((entry) => existsSync(entry.path)).length,
    originalsPreserved: existsSync(backup),
    ancestorBytesPreserved: true,
    parentRemains: existsSync(parent),
    endedAt: outer.endedAt,
    earliestEligibility: new Date(
      Date.parse(outer.endedAt) + 24 * 3_600_000,
    ).toISOString(),
    postWindowCandidate: Boolean(later.candidate),
    postWindowReason: later.retained?.reason ?? null,
    limit:
      "The future judgment treats this worktree's writer as released; normal pruning still checks live use. No real failed fixture was deleted.",
  };
});
if (apply)
  writeFileSync(
    new URL("./repair-ver004-control-recovery.json", import.meta.url),
    JSON.stringify(evidence, null, 2) + "\n",
  );
console.log(JSON.stringify(evidence, null, 2));
