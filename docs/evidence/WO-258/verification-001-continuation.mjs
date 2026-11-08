// Replay the same committed-history case against the base and current reader.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runGit } from "../../../scripts/lib/git.mjs";
import { sha256Hex } from "../../../scripts/lib/helpers.mjs";
import { exerciseHistory } from "../../../scripts/test-instance-history.mjs";
const reader = "scripts/lib/plan-receipts.mjs";
const base = "d9798e38ab4aed1c73d6f8837a21d5fe0c1732d3";
const result = {};
for (const arm of ["control", "fixed"]) {
  let digest;
  const history = exerciseHistory({
    prepareSource(root) {
      const bytes =
        arm === "control"
          ? runGit(process.cwd(), ["show", `${base}:${reader}`], {
              trim: false,
            })
          : readFileSync(join(root, reader), "utf8");
      digest = sha256Hex(bytes);
      if (arm === "control") writeFileSync(join(root, reader), bytes);
    },
  });
  const row = history.integration.separateTrack;
  result[arm] = {
    readerSha256: digest,
    exitCode: row.exitCode,
    command: row.command,
    output: row.output,
    instanceChecks: history.checks.map(({ command, exitCode }) => ({
      command,
      exitCode,
    })),
  };
}
writeFileSync(
  new URL("./verification-001-continuation.json", import.meta.url),
  JSON.stringify({ base, reader, arms: result }, null, 2) + "\n",
);
assert.equal(result.control.exitCode, 1);
assert.match(
  result.control.output,
  /sequence, vision, roles or order inventory changed/u,
);
assert.equal(result.fixed.exitCode, 0);
assert.match(result.fixed.output, /"continuation": \{/u);
assert.deepEqual(
  result.fixed.instanceChecks.filter((row) => row.exitCode !== 0),
  [],
);
console.log(
  JSON.stringify({
    control: result.control.exitCode,
    fixed: result.fixed.exitCode,
    fixedInstanceFailures: 0,
  }),
);
