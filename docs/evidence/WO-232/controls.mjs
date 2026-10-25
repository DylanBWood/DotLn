import assert from "node:assert/strict";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  exerciseHistory,
  assertHistory,
} from "../../../scripts/test-instance-history.mjs";
const selected = process.argv[2] ?? "both";
assert.ok(["base", "head", "both"].includes(selected));
for (const arm of selected === "both" ? ["base", "head"] : [selected]) {
  const baseline = "a81561976c8629834a5a18623b097fa4d7d8681a";
  const paths = [
    "scripts/lib/plan-continuation.mjs",
    "scripts/lib/work-order-workstream.mjs",
    "scripts/work-orders.mjs",
  ];
  const digests = {};
  const result = exerciseHistory({
    prepareSource: (root) => {
      for (const path of paths) {
        const bytes =
          arm === "base"
            ? execFileSync("git", ["show", `${baseline}:${path}`])
            : readFileSync(join(root, path));
        if (arm === "base") writeFileSync(join(root, path), bytes);
        digests[path] = createHash("sha256").update(bytes).digest("hex");
      }
    },
  });
  let exitCode = 0;
  try {
    assertHistory(result);
  } catch {
    exitCode = 1;
  }
  const record = {
    baseline,
    readerFiles: paths,
    readerDigests: digests,
    bundleSha256: JSON.parse(
      readFileSync(
        "scripts/fixtures/instance-with-history/manifest.json",
        "utf8",
      ),
    ).bundle.sha256,
    exitCode,
    ...result,
  };
  const output = "docs/evidence/WO-232/controls.json";
  const controls = existsSync(output)
    ? JSON.parse(readFileSync(output, "utf8"))
    : {
        schemaVersion: 1,
        comparison:
          "Same instance-history suite, with only the three reader files replaced by activation-base bytes in the base arm; current exporter and harness in both arms.",
      };
  controls[arm] = record;
  writeFileSync(output, JSON.stringify(controls, null, 2) + "\n");
  console.log(
    JSON.stringify(
      {
        arm,
        exitCode,
        elapsedMs: result.elapsedMs,
        checks: result.checks.map(({ command, exitCode }) => ({
          command,
          exitCode,
        })),
        selfMembers: result.selfMembers,
      },
      null,
      2,
    ),
  );
  if (arm === "base") {
    assert.equal(exitCode, 1);
    assert.equal(result.selfMembers.length, 2);
    assert.deepEqual(
      result.checks
        .filter((row) => row.exitCode !== 0)
        .map((row) => row.command),
      ["npm run plan -- check", "npm run test:docs"],
    );
    assert.ok(
      result.checks.some(
        (row) =>
          row.command === "npm run plan -- check" &&
          /unmatched execution amendment WO-001/.test(row.output),
      ),
    );
    assert.ok(
      result.selfMembers.every(
        (row) => row.integration === "diverged" && row.stale === "yes",
      ),
    );
  } else assertHistory(result);
}
