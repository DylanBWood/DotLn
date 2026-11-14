import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver002-shard-"));
try {
  const module = new URL(
    "../../../../scripts/lib/test-shards.mjs",
    import.meta.url,
  ).href;
  const file = join(scratch, "inferred.test.mjs"),
    output = join(scratch, "runs.jsonl");
  writeFileSync(
    file,
    `import test from ${JSON.stringify(module)};\nimport {appendFileSync} from 'node:fs';\ntest(function inferred(){appendFileSync(process.env.DOTLN_PROBE_OUTPUT,'inferred\\n')});\ntest({timeout:1000},function configured(){appendFileSync(process.env.DOTLN_PROBE_OUTPUT,'configured\\n')});\n`,
  );
  const statuses = [];
  for (let n = 1; n <= 3; n++) {
    const run = spawnSync(process.execPath, ["--test", file], {
      encoding: "utf8",
      env: {
        ...process.env,
        DOTLN_TEST_SHARD: `${n}/3`,
        DOTLN_PROBE_OUTPUT: output,
      },
    });
    assert.equal(run.status, 0, run.stderr);
    statuses.push(run.status);
  }
  const rows = readFileSync(output, "utf8").trim().split("\n");
  const counts = Object.fromEntries(
    ["inferred", "configured"].map((name) => [
      name,
      rows.filter((x) => x === name).length,
    ]),
  );
  assert.deepEqual(counts, { inferred: 3, configured: 3 });
  writeFileSync(
    process.argv[2],
    JSON.stringify(
      {
        shardExitCodes: statuses,
        registrations: 2,
        executedBodies: 6,
        counts,
        sourceLimit:
          "The helper explicitly documents that a non-string title registers in every shard; current 431-case evidence uses explicit titles",
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
