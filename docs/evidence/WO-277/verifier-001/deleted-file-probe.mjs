import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { changedOnBothSides } from "../../../../scripts/launchpad.mjs";
const out = process.env.DOTLN_VERIFY_OUTPUT;
if (!out)
  throw new Error(
    "Set DOTLN_VERIFY_OUTPUT to session scratch; filed evidence is immutable.",
  );
const root = join(out, "deleted-file-fixture");
test("a both-changed deletion is not restored by the page checkout command", () => {
  mkdirSync(root);
  const git = (args, expected = 0) => {
    const r = spawnSync("git", args, {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Fixture",
        GIT_COMMITTER_NAME: "Fixture",
        GIT_AUTHOR_EMAIL: "fixture@example.invalid",
        GIT_COMMITTER_EMAIL: "fixture@example.invalid",
      },
    });
    assert.equal(r.status, expected, r.stderr);
    return r;
  };
  git(["init", "-b", "main"]);
  git(["config", "commit.gpgsign", "false"]);
  writeFileSync(join(root, "KIT-MANIFEST.json"), JSON.stringify({ files: [] }));
  writeFileSync(join(root, "sample.md"), "base\n");
  git(["add", "."]);
  git(["commit", "-qm", "base"]);
  git(["branch", "starter"]);
  git(["rm", "sample.md"]);
  git(["commit", "-qm", "instance deletion"]);
  git(["switch", "starter"]);
  writeFileSync(join(root, "sample.md"), "incoming change\n");
  git(["add", "sample.md"]);
  git(["commit", "-qm", "starter change"]);
  git(["switch", "main"]);
  const both = changedOnBothSides(root, "main", "starter");
  assert.deepEqual(both.paths, ["sample.md"]);
  const merge = git(["merge", "--no-edit", "starter"], 1);
  const checkout = git(["checkout", "main", "--", "sample.md"], 1);
  const unresolved = git([
    "diff",
    "--name-only",
    "--diff-filter=U",
  ]).stdout.trim();
  assert.equal(unresolved, "sample.md");
  git(["rm", "sample.md"]);
  assert.equal(
    git(["diff", "--name-only", "--diff-filter=U"]).stdout.trim(),
    "",
  );
  const result = {
    recordedAt: new Date().toISOString(),
    bothChanged: both.paths,
    instanceFileState: both.states.get("sample.md"),
    mergeExit: merge.status,
    documentedCheckoutExit: checkout.status,
    documentedCheckoutError: checkout.stderr.trim(),
    unresolvedAfterCheckout: unresolved,
    gitRmKeepsDeletionAndResolves: true,
  };
  writeFileSync(
    join(out, "deleted-file-results.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
});
