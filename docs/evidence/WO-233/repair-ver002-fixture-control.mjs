// Run the retention controls inside a gate-owned parent, then inspect its
// lifecycle cleanup. Run outside gates under the bounded harness wrapper.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createTemporaryRoot,
  removeTemporaryRoot,
  retireTemporaryLedger,
} from "../../../scripts/lib/temporary-roots.mjs";
import { finishGateTemporaryRoots } from "../../../scripts/lib/temporary-prune.mjs";
import { activeGateRuns } from "../../../scripts/lib/gate-evidence.mjs";
import {
  hostStateRoot,
  withHostLock,
} from "../../../scripts/lib/host-resources.mjs";
import { observedSpawnSync } from "../../../packages/skeleton/src/gate-deadlines.mjs";

const repository = fileURLToPath(new URL("../../../", import.meta.url));
assert.equal(activeGateRuns(repository).length, 0);
const gateId = randomUUID();
const suite = "harness-fixtures";
const parent = createTemporaryRoot(join(tmpdir(), "dotln-retention-control-"), {
  class: "gate-fixture",
  repository,
  owner: { gateId, suite },
});
try {
  const env = {
    ...process.env,
    TMPDIR: parent,
    DOTLN_TEMP_REPOSITORY: repository,
    DOTLN_TEMP_GATE: gateId,
    DOTLN_TEMP_SUITE: suite,
  };
  delete env.NODE_TEST_CONTEXT;
  const child = observedSpawnSync(
    process.execPath,
    [
      "--test",
      "--test-name-pattern=standalone gate material shares suite retention",
      "scripts/test-temporary-roots.mjs",
    ],
    { cwd: repository, env, encoding: "utf8", timeout: 20_000 },
  );
  assert.equal(child.status, 0, child.stderr + child.stdout);
  const report = await withHostLock(hostStateRoot(), "lanes", async () => {
    assert.equal(activeGateRuns(repository).length, 0);
    return finishGateTemporaryRoots(
      repository,
      gateId,
      [{ name: suite, exitCode: child.status }],
      { rootPaths: [parent] },
    );
  });
  const result = {
    observedAt: new Date().toISOString(),
    gateId,
    childExitCode: child.status,
    childOutput: child.stdout,
    parentRemains: existsSync(parent),
    removed: report.removed.length,
    retainedReasons: report.retained.map((row) => row.reason),
    blockers: report.blockers,
  };
  console.log(JSON.stringify(result, null, 2));
  assert.equal(result.parentRemains, false);
  assert.deepEqual(report.retained, []);
  assert.deepEqual(report.blockers, []);
} finally {
  if (existsSync(parent)) removeTemporaryRoot(parent);
  retireTemporaryLedger(repository, gateId);
}
