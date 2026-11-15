// What the release step's recovery meets where this instance renamed a file
// the starter then changed, as the repair's review noted it. The preview
// lists the old path as changed on both sides; the merge finishes on its own
// and carries the starter's change into the renamed file; the page's
// checkout of the old path and the `git rm` the page then gives both say the
// path matched nothing; the publish's judgment of the update's merge finds
// no file it failed to keep, while the renamed file holds the starter's
// change merged with this instance's. It records the behavior as it stands
// for the follow-up and is no case of a suite. Run it from the repository's
// root under the bounded wrapper with `node --test` and this file's path; it
// writes rename-note.json beside itself.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  changedOnBothSides,
  instanceChangesNotKept,
} from "../../../../scripts/launchpad.mjs";

const here = dirname(fileURLToPath(import.meta.url));
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
const NO_MATCH = /did not match any file/u;
const lines = (last, first = "one") =>
  `${first}\ntwo\nthree\nfour\nfive\nsix\nseven\n${last}\n`;

test("a file this instance renamed and the starter changed, followed through the page's recovery", () => {
  const root = mkdtempSync(join(tmpdir(), "wo277-rename-"));
  try {
    const git = (args) =>
      spawnSync("git", args, { cwd: root, encoding: "utf8", env: environment });
    const write = (path, text) => writeFileSync(join(root, path), text);
    git(["init", "-q", "-b", "main"]);
    git(["config", "commit.gpgsign", "false"]);
    write("KIT-MANIFEST.json", `${JSON.stringify({ files: [] })}\n`);
    write("guide.md", lines("eight"));
    git(["add", "."]);
    git(["commit", "-qm", "base"]);
    git(["branch", "starter"]);
    // This instance renames the file and changes its last line.
    git(["mv", "guide.md", "notes.md"]);
    write("notes.md", lines("eight, the instance's"));
    git(["commit", "-qam", "instance"]);
    // The starter changes the first line of the file at its old path.
    git(["switch", "-q", "starter"]);
    write("guide.md", lines("eight", "one, the starter's"));
    git(["commit", "-qam", "starter"]);
    git(["switch", "-q", "main"]);
    const instance = git(["rev-parse", "main"]).stdout.trim();
    const starter = git(["rev-parse", "starter"]).stdout.trim();
    const both = changedOnBothSides(root, instance, starter);
    git(["switch", "-q", "-c", "chore/starter-update", "main"]);
    const merge = git(["merge", "--no-edit", "starter"]);
    const checkout = git(["checkout", "main", "--", "guide.md"]);
    const remove = git(["rm", "-q", "--", "guide.md"]);
    const head = git(["rev-parse", "HEAD"]).stdout.trim();
    const kept = instanceChangesNotKept(root, {
      instance,
      starter,
      commit: head,
    });
    const renamed = git(["show", `${head}:notes.md`]).stdout;
    const result = {
      recordedAt: new Date().toISOString(),
      gitVersion: git(["--version"]).stdout.trim(),
      bothChanged: both.paths,
      mergeExit: merge.status,
      oldPathCheckoutExit: checkout.status,
      oldPathCheckoutSaysNoMatch: NO_MATCH.test(checkout.stderr),
      oldPathGitRmExit: remove.status,
      oldPathGitRmSaysNoMatch: NO_MATCH.test(remove.stderr),
      oldPathAbsentAtMergeCommit:
        git([
          "ls-tree",
          "--name-only",
          head,
          "--",
          "guide.md",
        ]).stdout.trim() === "",
      publishJudgmentNotKept: kept.paths,
      renamedFileHoldsInstanceBytes:
        renamed === git(["show", `${instance}:notes.md`]).stdout,
      renamedFileHoldsStarterChange: renamed.startsWith("one, the starter's"),
      renamedFileHoldsInstanceChange: renamed.includes("eight, the instance's"),
    };
    writeFileSync(
      join(here, "rename-note.json"),
      `${JSON.stringify(result, null, 2)}\n`,
    );
    assert.deepEqual(result.bothChanged, ["guide.md"]);
    assert.equal(result.mergeExit, 0);
    assert.equal(result.oldPathCheckoutSaysNoMatch, true);
    assert.equal(result.oldPathGitRmSaysNoMatch, true);
    assert.deepEqual(result.publishJudgmentNotKept, []);
    assert.equal(result.renamedFileHoldsInstanceBytes, false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
