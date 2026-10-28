// Dispose only the seven empty controls identified by the completed fixture's
// creation ledger, then use normal gate cleanup for their containing roots.
import assert from "node:assert/strict";
import { existsSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
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
  TEMPORARY_OWNER_FILE,
  nestedTemporaryRoots,
  ownerAlive,
  readTemporaryOwner,
  registeredTemporaryRoots,
  removeTemporaryRoot,
} from "../../../scripts/lib/temporary-roots.mjs";
import { finishGateTemporaryRoots } from "../../../scripts/lib/temporary-prune.mjs";

const root = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));
const gateId = "2a47ed0d-5c31-4d6c-bcf9-2f5737a0fdb9";
const row = readGateChecks(root).findLast(
  (row) => row.temporaryGateId === gateId,
);
assert.equal(row?.exitCode, 0);
const parents = row.temporaryCleanup.retained.filter((row) =>
  /^dotln-fixture-temporary-/.test(basename(row.path)),
);
assert.equal(parents.length, 1);
const parent = parents[0].path;
const evidence = await withHostLock(hostStateRoot(), "lanes", async () => {
  assert.equal(activeGateRuns(root).length, 0);
  assert.equal(
    readHolders(hostStateRoot(), { worktree: root, includeWorktrees: true })
      .holders.length,
    0,
  );
  const parentOwner = readTemporaryOwner(parent);
  assert.equal(parentOwner.owner.repository, root);
  assert.equal(parentOwner.owner.gateId, gateId);
  assert.equal(parentOwner.owner.suite, "harness-fixtures");
  assert.equal(parentOwner.outcome, "passed");
  assert.equal(ownerAlive(parentOwner), false);
  const fixtures = nestedTemporaryRoots(parent);
  assert.equal(fixtures.length, 1);
  const fixture = fixtures[0];
  const fixtureOwner = readTemporaryOwner(fixture);
  assert.match(basename(fixture), /^dotln-temporary-roots-test-/);
  assert.equal(fixtureOwner.fixtureOwner.token, parentOwner.token);
  assert.equal(fixtureOwner.fixtureOwner.gateId, gateId);
  assert.equal(ownerAlive(fixtureOwner), false);
  const controls = nestedTemporaryRoots(fixture);
  const expected = new Map([
    ["cache", "warm-fixture"],
    ["coordination", "coordination"],
    ["failed", "worker-capture"],
    ["forever", "worker-capture"],
    ["scratch", "session-scratch"],
    ["sibling", "worker-capture"],
    ["unknown", "worker-capture"],
  ]);
  assert.equal(controls.length, expected.size);
  const registrations = registeredTemporaryRoots(fixture);
  const planned = [];
  for (const path of controls) {
    const name = /^([a-z]+)-[A-Za-z0-9]{6}$/.exec(basename(path))?.[1];
    const record = readTemporaryOwner(path);
    assert.ok(expected.has(name));
    assert.equal(relative(fixture, path), `roots/${basename(path)}`);
    assert.equal(record.class, expected.get(name));
    assert.equal(record.owner.repository, fixture);
    assert.equal(record.owner.session, "0".repeat(64));
    assert.equal(record.owner.pid, name === "unknown" ? null : 2147483647);
    assert.equal(record.owner.birth, name === "unknown" ? null : "1.0");
    assert.equal(record.fixtureOwner, undefined);
    assert.ok(
      registrations.some(
        (row) => row.path === path && row.token === record.token,
      ),
    );
    assert.deepEqual(readdirSync(path), [TEMPORARY_OWNER_FILE]);
    planned.push({ path, record, name });
    expected.delete(name);
  }
  assert.equal(expected.size, 0);
  // All identities and payload boundaries were checked before any mutation.
  for (const { path, record } of planned)
    removeTemporaryRoot(path, record.token);
  const cleanup = finishGateTemporaryRoots(root, gateId, row.taskTimeline, {
    rootPaths: [parent],
    endedAt: row.recordedAt,
  });
  const result = {
    observedAt: new Date().toISOString(),
    sourceGate: gateId,
    sourceRecordedAt: row.recordedAt,
    rule: "Explicit creator disposal of seven empty, source-identified test controls; no production liveness, identity or retention exception.",
    controls: planned.map(({ name, record }) => ({
      name,
      class: record.class,
      gateId: record.owner.gateId,
      retentionHours: record.retentionHours,
      outcome: record.outcome,
      emptyApartFromOwner: true,
    })),
    removedContainers: cleanup.removed.length,
    retained: cleanup.retained,
    blockers: cleanup.blockers,
    parentRemains: existsSync(parent),
  };
  assert.equal(result.parentRemains, false);
  assert.deepEqual(result.retained, []);
  assert.deepEqual(result.blockers, []);
  return result;
});
writeFileSync(
  new URL("./repair-ver002-control-recovery.json", import.meta.url),
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(JSON.stringify(evidence, null, 2));
