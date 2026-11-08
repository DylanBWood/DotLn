// Criterion 9's two arms in one replayable run: the instance-history suite's
// separate-track case (a receipt filed over the sequence alone, then a
// `track: separate` workstream with one open member) against the fixed
// plan-receipts.mjs and, in the control arm, against its bytes at the base
// commit d9798e38. Everything else is the current tree in both arms. Writes
// criterion-9-controls.json beside this file; scratch lives in system temp.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { exerciseHistory } from "../../../scripts/test-instance-history.mjs";

const base = "d9798e38ab4aed1c73d6f8837a21d5fe0c1732d3";
const reader = "scripts/lib/plan-receipts.mjs";
const output = new URL("./criterion-9-controls.json", import.meta.url);
const record = {
  schemaVersion: 1,
  comparison:
    "The same instance-history run in both arms; the control arm replaces only scripts/lib/plan-receipts.mjs with its bytes at the base commit before the kit update.",
  base,
  reader,
  arms: {},
};
for (const arm of ["control", "fixed"]) {
  let digest;
  const result = exerciseHistory({
    prepareSource: (root) => {
      const bytes =
        arm === "control"
          ? execFileSync("git", ["show", `${base}:${reader}`])
          : readFileSync(join(root, reader));
      if (arm === "control") writeFileSync(join(root, reader), bytes);
      digest = createHash("sha256").update(bytes).digest("hex");
    },
  });
  const separate = result.integration?.separateTrack;
  record.arms[arm] = {
    readerSha256: digest,
    command: separate?.command,
    exitCode: separate?.exitCode,
    elapsedMs: separate?.elapsedMs,
    output: separate?.output,
    instanceChecks: result.checks.map(({ command, exitCode }) => ({
      command,
      exitCode,
    })),
  };
}
writeFileSync(output, JSON.stringify(record, null, 2) + "\n");
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(record.arms).map(([arm, row]) => [arm, row.exitCode]),
    ),
  ),
);
assert.equal(record.arms.fixed.exitCode, 0);
assert.equal(record.arms.control.exitCode, 1);
assert.match(
  record.arms.control.output,
  /sequence, vision, roles or order inventory changed/u,
);
