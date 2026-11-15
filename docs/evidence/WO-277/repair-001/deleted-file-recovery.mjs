// The release step's recovery for the files a starter update and this
// instance both changed, followed as the commands page words it, in a
// synthetic history: a file the instance edited and the starter edited
// (the merge stops on it), a file the instance deleted and the starter
// edited (the merge stops on it), and a file both edited in different lines
// (the merge takes it in silence). Each is restored with `git checkout main
// -- <path>`, and where that checkout says the path matched no file, kept
// deleted with `git rm <path>`. The publish's own judgment of the update's
// merge then finds every such file holding this instance's state. A second
// merge that leaves the deleted file at the starter's bytes fails that
// judgment, so the judgment tells the two apart. Run it from the repository's
// root under the bounded wrapper with `node --test` and this file's path; it
// writes deleted-file-recovery.json beside itself.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  changedOnBothSides,
  instanceChangesNotKept,
} from "../../../../scripts/launchpad.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repository = join(here, "../../../..");
// No inherited variable may route a Git read to another repository, and no
// user or system setting reaches the fixture's commands or the kit's reads.
for (const name of Object.keys(process.env))
  if (/^GIT_/u.test(name)) delete process.env[name];
process.env.GIT_CONFIG_NOSYSTEM = "1";
process.env.GIT_CONFIG_GLOBAL = "/dev/null";
const environment = {
  ...process.env,
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
// What Git answers when a checkout names a path the revision does not hold.
const NO_MATCH = /did not match any file\(s\) known to git/u;

// The release step's paragraph as the page prints it.
const releaseParagraph = () => {
  const page = readFileSync(join(repository, "docs/OPERATOR.md"), "utf8");
  const step = page.split(/^## /mu).find((part) => part.startsWith("5. "));
  return step.split("\n\n")[1];
};

test("the page's recovery keeps an edited file and a deleted file, and the publish's judgment agrees", () => {
  const paragraph = releaseParagraph();
  const named = {
    checkout: paragraph.includes("run `git checkout main -- <path>`"),
    noMatch: paragraph.includes(
      "says the path did not match any file known to Git",
    ),
    gitRm: paragraph.includes("run `git rm <path>` to keep it deleted"),
    manifest: paragraph.includes(
      "`git checkout main -- .claude/harness-manifest.json`",
    ),
  };
  assert.deepEqual(named, {
    checkout: true,
    noMatch: true,
    gitRm: true,
    manifest: true,
  });

  const root = mkdtempSync(join(tmpdir(), "wo277-recovery-"));
  try {
    const git = (args, expected = 0) => {
      const result = spawnSync("git", args, {
        cwd: root,
        encoding: "utf8",
        env: environment,
      });
      if (expected !== null)
        assert.equal(
          result.status,
          expected,
          `git ${args.join(" ")}: ${result.stderr}`,
        );
      return result;
    };
    const write = (path, text) => writeFileSync(join(root, path), text);
    git(["init", "-q", "-b", "main"]);
    git(["config", "commit.gpgsign", "false"]);
    write("KIT-MANIFEST.json", `${JSON.stringify({ files: [] })}\n`);
    write("edited.md", "base\n");
    write("deleted.md", "base\n");
    write("silent.md", "one\ntwo\nthree\nfour\nfive\n");
    git(["add", "."]);
    git(["commit", "-qm", "base"]);
    git(["branch", "starter"]);
    // This instance's own changes on main.
    write("edited.md", "instance\n");
    write("silent.md", "one, the instance's\ntwo\nthree\nfour\nfive\n");
    git(["rm", "-q", "deleted.md"]);
    git(["commit", "-qam", "instance"]);
    // The starter's changes to the same three files.
    git(["switch", "-q", "starter"]);
    write("edited.md", "starter\n");
    write("deleted.md", "starter\n");
    write("silent.md", "one\ntwo\nthree\nfour\nfive, the starter's\n");
    git(["commit", "-qam", "starter"]);
    git(["switch", "-q", "main"]);
    const instance = git(["rev-parse", "main"]).stdout.trim();
    const starter = git(["rev-parse", "starter"]).stdout.trim();
    const both = changedOnBothSides(root, instance, starter);
    assert.deepEqual(both.paths, ["deleted.md", "edited.md", "silent.md"]);

    // The update as the page's second block takes it, recovered as its
    // paragraph says, file by file.
    const merge = (branch) => {
      git(["switch", "-q", "-c", branch, "main"]);
      const result = git(["merge", "--no-edit", "starter"], 1);
      return {
        exit: result.status,
        stoppedOn: git(["diff", "--name-only", "--diff-filter=U"])
          .stdout.trim()
          .split("\n")
          .filter(Boolean),
      };
    };
    const first = merge("chore/starter-update");
    assert.deepEqual(first.stoppedOn, ["deleted.md", "edited.md"]);
    const routes = both.paths.map((path) => {
      const checkout = git(["checkout", "main", "--", path], null);
      const route = { path, checkoutExit: checkout.status };
      if (checkout.status !== 0) {
        route.checkoutSaysNoMatch = NO_MATCH.test(checkout.stderr);
        assert.equal(route.checkoutSaysNoMatch, true, checkout.stderr);
        route.gitRmExit = git(["rm", "-q", "--", path]).status;
      }
      return route;
    });
    const unresolved = git([
      "diff",
      "--name-only",
      "--diff-filter=U",
    ]).stdout.trim();
    assert.equal(unresolved, "");
    git(["commit", "-q", "--no-edit"]);
    const kept = instanceChangesNotKept(root, {
      instance,
      starter,
      commit: git(["rev-parse", "HEAD"]).stdout.trim(),
    });
    assert.deepEqual(kept.paths, []);
    const deletedAtTip =
      git([
        "ls-tree",
        "--name-only",
        "HEAD",
        "--",
        "deleted.md",
      ]).stdout.trim() === "";
    assert.equal(deletedAtTip, true);

    // The same merge with the deleted file left at the starter's bytes.
    git(["switch", "-q", "main"]);
    const second = merge("chore/starter-update-taken");
    git(["checkout", "main", "--", "edited.md"]);
    git(["checkout", "main", "--", "silent.md"]);
    git(["add", "--", "deleted.md"]);
    git(["commit", "-q", "--no-edit"]);
    const taken = instanceChangesNotKept(root, {
      instance,
      starter,
      commit: git(["rev-parse", "HEAD"]).stdout.trim(),
    });
    assert.deepEqual(taken.paths, ["deleted.md"]);

    const result = {
      recordedAt: new Date().toISOString(),
      gitVersion: git(["--version"]).stdout.trim(),
      pageParagraphNames: named,
      bothChanged: both.paths,
      instanceStateOfDeleted: both.states.get("deleted.md"),
      merge: first,
      recovery: routes,
      unresolvedAfterRecovery: [],
      deletedAbsentAtMergeCommit: deletedAtTip,
      publishJudgmentNotKept: kept.paths,
      counterCase: {
        resolution:
          "deleted.md left at the starter's bytes; edited.md and silent.md restored from main",
        merge: second,
        publishJudgmentNotKept: taken.paths,
      },
    };
    writeFileSync(
      join(here, "deleted-file-recovery.json"),
      `${JSON.stringify(result, null, 2)}\n`,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
