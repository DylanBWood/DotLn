// Measure every committed blob read, full clean check and candidate import
// on the synthetic vertical's source-change step. No live model or network.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import {
  SourceChangeWorktree,
  HOST_GIT,
} from "../../../packages/skeleton/dist/src/source-change-worktree.js";
import { verticalFixture } from "../../../scripts/fixtures/vertical/fixture.mjs";
import {
  readVerticalConfiguration,
  runVerticalIssue,
} from "../../../scripts/lib/vertical-runtime.mjs";

const cleanChecks = [],
  imports = [];
const clean = SourceChangeWorktree.prototype.cleanAgainstCommit;
const importCandidate = SourceChangeWorktree.prototype.importCandidate;
SourceChangeWorktree.prototype.cleanAgainstCommit = function () {
  const started = performance.now();
  const result = clean.call(this);
  const durationMs = performance.now() - started;
  const options = {
    cwd: this.path,
    env: { ...process.env, ...this.objectEnvironment },
  };
  const entries = execFileSync(
    "git",
    [...HOST_GIT, "ls-tree", "-r", "-z", "HEAD"],
    options,
  )
    .toString()
    .split("\0")
    .filter(Boolean)
    .map((entry) => entry.slice(0, entry.indexOf("\t")).split(" "))
    .filter(([, type]) => type === "blob");
  const catFileMs = entries.map(([, , object]) => {
    const at = performance.now();
    execFileSync("git", [...HOST_GIT, "cat-file", "blob", object], options);
    return performance.now() - at;
  });
  cleanChecks.push({ durationMs, trackedBlobs: entries.length, catFileMs });
  return result;
};
SourceChangeWorktree.prototype.importCandidate = function (commit) {
  const started = performance.now();
  const result = importCandidate.call(this, commit);
  imports.push({
    durationMs: performance.now() - started,
    objects: result.objects.length,
  });
  return result;
};
const f = await verticalFixture();
try {
  const result = await runVerticalIssue({
    directory: f.directory,
    issue: 1,
    configuration: readVerticalConfiguration(f.directory, f.launchpad),
    now: () => {
      f.tick();
      return f.now();
    },
    external: f.external,
    steps: 6,
  });
  assert.equal(result.receipts.at(-1)?.command.step, "source-change");
  assert.equal(result.receipts.at(-1)?.result, "completed");
  assert.ok(cleanChecks.length > 0);
  assert.equal(imports.length, 1);
  const record = {
    recordedAt: new Date().toISOString(),
    source: "synthetic vertical fixture",
    method:
      "Wall-clock performance.now around the actual clean check and pack-objects/index-pack import. Separately time cat-file for every tracked blob with the same host Git flags and private environment; no path sampling.",
    cleanChecks,
    imports,
    maxCleanMs: Math.max(...cleanChecks.map((row) => row.durationMs)),
    maxCatFileMs: Math.max(...cleanChecks.flatMap((row) => row.catFileMs)),
    maxImportMs: Math.max(...imports.map((row) => row.durationMs)),
  };
  writeFileSync(
    new URL("repair-costs.json", import.meta.url),
    JSON.stringify(record, null, 2) + "\n",
  );
  console.log(JSON.stringify(record));
} finally {
  SourceChangeWorktree.prototype.cleanAgainstCommit = clean;
  SourceChangeWorktree.prototype.importCandidate = importCandidate;
  f.close();
}
