import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const output = process.argv[2];
const hash = (value) => createHash("sha256").update(value).digest("hex");
const run = (cwd, args, expected = 0, env = process.env) => {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    env,
    maxBuffer: 8 * 1024 * 1024,
  });
  if (expected !== null) assert.equal(result.status, expected, result.stderr);
  return result;
};
const record = "docs/evidence/WO-277/status.json";
const originalBytes = run(root, [
  "show",
  "refs/dotln/checkpoint/WO-277/3:" + record,
]).stdout;
const original = JSON.parse(originalBytes);
const currentBytes = readFileSync(join(root, record), "utf8");
const current = JSON.parse(currentBytes);
const expected = structuredClone(original);
expected.route.cwd = "<worktree>";
expected.route.launchpad = "<worktree>";
assert.deepEqual(current, expected);
const home = new RegExp(
  "/" +
    ["Users", "home"].map((value) => "(?:" + value + ")").join("|/") +
    "/[^/\\s]+/",
  "u",
);
const { privatePathLines } = await import(
  pathToFileURL(join(root, "scripts/lib/private-paths.mjs"))
);
assert.deepEqual(privatePathLines(record, originalBytes), [13, 14]);
assert.deepEqual(privatePathLines(record, currentBytes), []);
const statusRepair = {
  originalSha256: hash(originalBytes),
  currentSha256: hash(currentBytes),
  originalPrivatePathLines: [13, 14],
  currentPrivatePathLines: [],
  onlyChangedFields: ["route.cwd", "route.launchpad"],
  allOtherFieldsPreserved: true,
};
const { changedOnBothSides, instanceChangesNotKept } = await import(
  pathToFileURL(join(root, "scripts/launchpad.mjs"))
);
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")),
);
Object.assign(env, {
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
});
const fixture = mkdtempSync(join(output, "merge with spaces "));
let recovery;
try {
  const git = (args, expected = 0) => run(fixture, args, expected, env);
  git(["init", "-q", "-b", "main"]);
  git(["config", "commit.gpgsign", "false"]);
  const file = "retired guide.md";
  const keptFile = "live guide.md";
  writeFileSync(
    join(fixture, "KIT-MANIFEST.json"),
    JSON.stringify({ files: [] }) + "\n",
  );
  writeFileSync(join(fixture, file), "initial text\n");
  writeFileSync(join(fixture, keptFile), "initial text\n");
  git(["add", "."]);
  git(["commit", "-qm", "initial fixture"]);
  git(["branch", "starter"]);
  git(["rm", "--", file]);
  writeFileSync(join(fixture, keptFile), "instance text\n");
  git(["commit", "-qam", "instance keeps its choices"]);
  const instance = git(["rev-parse", "HEAD"]).stdout.trim();
  git(["switch", "-q", "starter"]);
  writeFileSync(join(fixture, file), "incoming text\n");
  writeFileSync(join(fixture, keptFile), "incoming text\n");
  git(["commit", "-qam", "incoming update"]);
  const starter = git(["rev-parse", "HEAD"]).stdout.trim();
  const both = changedOnBothSides(fixture, instance, starter);
  assert.deepEqual([...both.paths].sort(), [keptFile, file].sort());
  git(["switch", "-q", "-c", "chore/starter-update", "main"]);
  const merge = git(["merge", "--no-edit", "starter"], 1);
  const unresolvedBefore = git(["diff", "--name-only", "--diff-filter=U", "-z"])
    .stdout.split("\0")
    .filter(Boolean);
  assert.deepEqual(unresolvedBefore.sort(), [keptFile, file].sort());
  git(["checkout", "main", "--", keptFile]);
  const checkout = git(["checkout", "main", "--", file], 1);
  assert.match(checkout.stderr, /did not match any file/u);
  assert.equal(existsSync(join(fixture, file)), true);
  const remove = git(["rm", "--", file]);
  assert.equal(existsSync(join(fixture, file)), false);
  const unresolvedAfter = git([
    "diff",
    "--name-only",
    "--diff-filter=U",
    "-z",
  ]).stdout;
  assert.equal(unresolvedAfter, "");
  assert.equal(
    readFileSync(join(fixture, keptFile), "utf8"),
    "instance text\n",
  );
  git(["commit", "-q", "--no-edit"]);
  const commit = git(["rev-parse", "HEAD"]).stdout.trim();
  const kept = instanceChangesNotKept(fixture, { instance, starter, commit });
  assert.deepEqual(kept.paths, []);
  recovery = {
    fixtureOnly: true,
    pathsWithSpaces: true,
    gitVersion: git(["--version"]).stdout.trim(),
    previewBothChanged: both.paths,
    mergeExit: merge.status,
    checkoutDeletedExit: checkout.status,
    checkoutNamesMissingPath: true,
    removeExit: remove.status,
    deletionPreserved: true,
    editedFilePreserved: true,
    unresolvedAfter: [],
    publishJudgmentNotKept: kept.paths,
  };
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
const result = { recordedAt: new Date().toISOString(), statusRepair, recovery };
writeFileSync(
  join(output, "repair-results.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    statusRepair: "pass",
    recovery: "pass",
    pathsWithSpaces: true,
  }),
);
