// Dispose the exact synthetic failed-owner controls left by the retention
// regression, then let the recorded passing gate finish its own containers.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import {
  activeGateRuns,
  readGateChecks,
} from "../../../scripts/lib/gate-evidence.mjs";
import { readHolders } from "../../../scripts/lib/host-lanes.mjs";
import {
  hostStateRoot,
  withHostLock,
} from "../../../scripts/lib/host-resources.mjs";
import {
  ownerAlive,
  readTemporaryOwner,
  removeTemporaryRoot,
  temporaryProcessTable,
} from "../../../scripts/lib/temporary-roots.mjs";
import { finishGateTemporaryRoots } from "../../../scripts/lib/temporary-prune.mjs";

const repository = realpathSync(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
const gateId = "e38288a3-d0ae-411c-863b-7f2ae37e7350";
const container = join(
  realpathSync(tmpdir()),
  "dotln-fixture-temporary-eoXSQC",
);
const fixture = join(container, "dotln-temporary-roots-test-ti3Kab");
const parent = join(fixture, "roots/parent-HC0lc3");
const child = join(parent, "child-HXTkkW");
const expected = [
  [container, "dd3ded3e-7fbe-45da-a6ab-9917b1e3897a"],
  [fixture, "5e490148-5eb2-434c-ac36-996392945f8f"],
  [parent, "2fda6603-65f4-4d80-acfe-9d639380685b"],
  [child, "c0ede869-750c-45c0-be02-edec71477f9a"],
];
assert.ok(process.argv.slice(2).every((arg) => arg === "--apply"));
const gate = readGateChecks(repository).findLast(
  (row) => row.temporaryGateId === gateId,
);
assert.equal(gate?.exitCode, 0);
assert.equal(
  gate.taskTimeline.find((task) => task.name === "harness-fixtures").exitCode,
  0,
);

function inspect() {
  assert.equal(activeGateRuns(repository).length, 0);
  assert.equal(
    readHolders(hostStateRoot(), {
      worktree: repository,
      includeWorktrees: true,
    }).holders.length,
    0,
  );
  const table = temporaryProcessTable(repository);
  assert.ok(table);
  const records = expected.map(([path, token]) => {
    const record = readTemporaryOwner(path);
    assert.equal(record.token, token);
    assert.equal(record.class, "gate-fixture");
    assert.equal(ownerAlive(record, table), false);
    return record;
  });
  assert.equal(records[0].owner.gateId, gateId);
  assert.equal(records[1].owner.gateId, gateId);
  assert.equal(records[2].owner.gateId, "e84ff4aa-28dd-4f8d-9c7f-8881aa1061f6");
  assert.equal(records[3].owner.gateId, records[2].owner.gateId);
  assert.equal(records[3].fixtureOwner.token, records[2].token);
  assert.equal(records[3].outcome, "failed");
  assert.equal(records[3].owner.pid, 2147483647);
  assert.equal(records[3].owner.birth, "1.0");
  assert.deepEqual(readdirSync(parent).sort(), [
    ".dotln-owner.json",
    "child-HXTkkW",
  ]);
  assert.deepEqual(readdirSync(child).sort(), [
    ".dotln-owner.json",
    "diagnosis",
  ]);
  assert.equal(readFileSync(join(child, "diagnosis"), "utf8"), "keep this");
  return records;
}

const before = inspect();
let cleanup = null;
if (process.argv.includes("--apply"))
  await withHostLock(hostStateRoot(), "lanes", async () => {
    inspect();
    removeTemporaryRoot(child, expected[3][1]);
    removeTemporaryRoot(parent, expected[2][1]);
    cleanup = finishGateTemporaryRoots(repository, gateId, gate.taskTimeline, {
      rootPaths: [container],
      endedAt: gate.recordedAt,
    });
    assert.deepEqual(cleanup.retained, []);
    assert.deepEqual(cleanup.blockers, []);
    assert.equal(existsSync(container), false);
  });
console.log(
  JSON.stringify(
    {
      gateId,
      gateRecordedAt: gate.recordedAt,
      apply: Boolean(cleanup),
      before,
      cleanup,
      containerRemains: existsSync(container),
    },
    null,
    2,
  ),
);
