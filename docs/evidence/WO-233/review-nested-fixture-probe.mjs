// Reproduce the nested-retention test inside a runner-owned temporary parent,
// then inspect actual gate teardown. Run outside gates under harness bounded.
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
import { observedSpawnSync } from "../../../packages/skeleton/src/gate-deadlines.mjs";

const repository = fileURLToPath(new URL("../../../", import.meta.url));
const gateId = randomUUID();
const suite = "harness-fixtures";
const parent = createTemporaryRoot(join(tmpdir(), "dotln-nested-rehearsal-"), {
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
      "--test-name-pattern=a retained nested owner protects",
      "scripts/test-temporary-roots.mjs",
    ],
    { cwd: repository, env, encoding: "utf8", timeout: 20_000 },
  );
  assert.equal(child.status, 0, child.stderr + child.stdout);
  const report = finishGateTemporaryRoots(
    repository,
    gateId,
    [{ name: suite, exitCode: child.status }],
    { processes: [], worktrees: [], holders: [], rootPaths: [parent] },
  );
  const result = {
    gateId,
    childExitCode: child.status,
    childOutput: child.stdout,
    parentRemains: existsSync(parent),
    removed: report.removed.length,
    retainedReasons: report.retained.map((row) => row.reason),
    blockers: report.blockers,
  };
  console.log(JSON.stringify(result, null, 2));
  if (process.argv.includes("--expect-clean")) {
    assert.equal(result.parentRemains, false);
    assert.deepEqual(report.retained, []);
    assert.deepEqual(report.blockers, []);
  }
} finally {
  if (existsSync(parent)) removeTemporaryRoot(parent);
  retireTemporaryLedger(repository, gateId);
}
