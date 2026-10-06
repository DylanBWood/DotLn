import assert from "node:assert/strict";
import { mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync, execFileSync } from "node:child_process";
const root = process.cwd(),
  scratch = process.argv[2];
const results = [];
for (const variant of ["current", "baseline"]) {
  const parent = realpathSync(mkdtempSync(join(scratch, `ver005-${variant}-`)));
  writeFileSync(
    join(parent, ".dotln-test-root-owner"),
    "WO-187 VER-005 fixture\n",
  );
  const args = [join(root, "scripts/test-verification-review.mjs"), parent];
  if (variant === "baseline") {
    const baseline = join(parent, "original-resume.mjs");
    writeFileSync(
      baseline,
      execFileSync("git", ["show", "08845c71:scripts/resume.mjs"], {
        cwd: root,
      }),
    );
    args.push(baseline);
  }
  const started = performance.now();
  const run = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  const diagnostic = (run.stdout + "\n" + run.stderr)
    .split("\n")
    .filter((line) => /passed|AssertionError|verify must/.test(line));
  const row = {
    variant,
    exitCode: run.status,
    durationMs: Math.round(performance.now() - started),
    diagnostic,
  };
  results.push(row);
  console.log(JSON.stringify(row));
  writeFileSync(join(parent, "output.txt"), run.stdout + "\n" + run.stderr);
  if (variant === "current") assert.equal(run.status, 0, run.stderr);
  else {
    assert.notEqual(run.status, 0);
    assert.match(run.stderr, /verify must print the order's known issues/);
  }
}
writeFileSync(
  "docs/evidence/WO-187/verification-005/fixture.json",
  JSON.stringify({ observedAt: new Date().toISOString(), results }, null, 2) +
    "\n",
);
