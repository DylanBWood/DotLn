// Two histories the commands page's release step gives no route for, each
// followed as the page words it, in synthetic repositories. First: an
// instance whose earlier update reached main by a squash merge. The starter's
// next change to a file of the instance's own then reads as changed on both
// sides, the page's `git checkout main -- <path>` keeps the bytes of the
// earlier update, and the publish's judgment of the merge finds nothing not
// kept, so the starter's later change is left out with no refusal. Second: a
// kit file this instance edited and the starter changed. The merge stops on
// it, it is no `both changed:` file, the page names no command for it, and the
// block's `git add -A` and `git commit` then conclude the merge with the
// conflict's markers in the file. Run from the repository's root under the
// bounded wrapper, with the directory to write update-recovery-gaps.json
// into as its one argument.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const repository = process.cwd();
const output = process.argv[2];
assert.ok(output, "usage: node update-recovery-gaps.mjs <output directory>");
const { changedOnBothSides, instanceChangesNotKept } = await import(
  pathToFileURL(join(repository, "scripts/launchpad.mjs"))
);
// No inherited variable may route a Git read to another repository, and no
// user or system setting reaches the fixtures' commands or the kit's reads.
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

// The release step's paragraph as the page prints it.
const page = readFileSync(join(repository, "docs/OPERATOR.md"), "utf8");
const paragraph = page
  .split(/^## /mu)
  .find((part) => part.startsWith("5. "))
  .split("\n\n")[1];
const pageNames = {
  checkoutForEachBothChanged: paragraph.includes(
    "For each `both changed:` file, whether or not the merge stopped on it, run `git checkout main -- <path>`",
  ),
  readsRefusedRows: paragraph.includes("each `refused` kit file"),
  take: paragraph.includes("--take"),
  squash: /squash/u.test(paragraph),
};
assert.deepEqual(pageNames, {
  checkoutForEachBothChanged: true,
  readsRefusedRows: true,
  take: false,
  squash: false,
});

const fixture = (name, body) => {
  const root = mkdtempSync(join(tmpdir(), `wo277-final-${name}-`));
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
    const read = (path) => readFileSync(join(root, path), "utf8");
    const unmerged = () =>
      git(["diff", "--name-only", "--diff-filter=U"])
        .stdout.trim()
        .split("\n")
        .filter(Boolean);
    git(["init", "-q", "-b", "main"]);
    git(["config", "commit.gpgsign", "false"]);
    return body({ root, git, write, read, unmerged });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

// An earlier update that reached main by a squash merge.
const squashed = fixture("squash", ({ root, git, write, read, unmerged }) => {
  write("KIT-MANIFEST.json", `${JSON.stringify({ files: [] })}\n`);
  write("seed.md", "base\n");
  git(["add", "."]);
  git(["commit", "-qm", "base"]);
  git(["branch", "starter"]);
  // The starter's first release changes the file; this instance never does.
  git(["switch", "-q", "starter"]);
  write("seed.md", "the starter's first change\n");
  git(["commit", "-qam", "starter one"]);
  // The instance takes that release by a squash: main holds its bytes and
  // none of the starter's commits.
  git(["switch", "-q", "main"]);
  git(["merge", "--squash", "-q", "starter"]);
  git(["commit", "-qm", "the first update, squashed"]);
  // The starter's second release changes the file again.
  git(["switch", "-q", "starter"]);
  write("seed.md", "the starter's second change\n");
  git(["commit", "-qam", "starter two"]);
  git(["switch", "-q", "main"]);
  const instance = git(["rev-parse", "main"]).stdout.trim();
  const starter = git(["rev-parse", "starter"]).stdout.trim();
  const both = changedOnBothSides(root, instance, starter);
  assert.deepEqual(both.paths, ["seed.md"]);

  // The update as the page's second block takes it, recovered as its
  // paragraph says.
  git(["switch", "-q", "-c", "chore/starter-update", "main"]);
  const merge = git(["merge", "--no-edit", "starter"], 1);
  const stoppedOn = unmerged();
  assert.deepEqual(stoppedOn, ["seed.md"]);
  const checkout = git(["checkout", "main", "--", "seed.md"]);
  assert.deepEqual(unmerged(), []);
  git(["commit", "-q", "--no-edit"]);
  const kept = instanceChangesNotKept(root, {
    instance,
    starter,
    commit: git(["rev-parse", "HEAD"]).stdout.trim(),
  });
  assert.deepEqual(kept.paths, []);
  const afterPage = read("seed.md");
  assert.equal(afterPage, "the starter's first change\n");

  // The same merge resolved to the starter's bytes, which is what an
  // instance that never changed the file wants.
  git(["switch", "-q", "main"]);
  git(["switch", "-q", "-c", "chore/starter-update-taken", "main"]);
  git(["merge", "--no-edit", "starter"], 1);
  git(["checkout", "starter", "--", "seed.md"]);
  git(["commit", "-q", "--no-edit"]);
  const taken = instanceChangesNotKept(root, {
    instance,
    starter,
    commit: git(["rev-parse", "HEAD"]).stdout.trim(),
  });
  assert.deepEqual(taken.paths, ["seed.md"]);
  return {
    gitVersion: git(["--version"]).stdout.trim(),
    history:
      "base; the starter changes seed.md; main takes that by git merge --squash; the starter changes seed.md again; the instance never edits it",
    bothChanged: both.paths,
    merge: { exit: merge.status, stoppedOn },
    pageRecovery: { path: "seed.md", checkoutExit: checkout.status },
    publishJudgmentNotKept: kept.paths,
    fileAfterPageRecovery: afterPage.trim(),
    starterChangeLeftOut: true,
    counterCase: {
      resolution: "seed.md resolved to the starter's bytes",
      publishJudgmentNotKept: taken.paths,
    },
  };
});

// A kit file this instance edited and the starter changed.
const kitFile = fixture("kit", ({ root, git, write, read, unmerged }) => {
  write(
    "KIT-MANIFEST.json",
    `${JSON.stringify({ files: [{ path: "kit.md" }] })}\n`,
  );
  write("kit.md", "base\n");
  write("own.md", "base\n");
  git(["add", "."]);
  git(["commit", "-qm", "base"]);
  git(["branch", "starter"]);
  write("kit.md", "the instance's edit of a kit file\n");
  write("own.md", "the instance's\n");
  git(["commit", "-qam", "instance"]);
  git(["switch", "-q", "starter"]);
  write("kit.md", "the starter's change\n");
  write("own.md", "the starter's\n");
  git(["commit", "-qam", "starter"]);
  git(["switch", "-q", "main"]);
  const instance = git(["rev-parse", "main"]).stdout.trim();
  const starter = git(["rev-parse", "starter"]).stdout.trim();
  const both = changedOnBothSides(root, instance, starter);
  assert.deepEqual(both.paths, ["own.md"]);

  git(["switch", "-q", "-c", "chore/starter-update", "main"]);
  const merge = git(["merge", "--no-edit", "starter"], 1);
  const stoppedOn = unmerged();
  assert.deepEqual(stoppedOn, ["kit.md", "own.md"]);
  // The page's recovery: each `both changed:` file, and no other.
  for (const path of both.paths) git(["checkout", "main", "--", path]);
  const left = unmerged();
  assert.deepEqual(left, ["kit.md"]);
  // The block's remaining Git lines, as a person who goes on would type
  // them; the emit, the lineage index and the sync between them do not
  // resolve a conflict in a kit document.
  const add = git(["add", "-A"]);
  const commit = git(["commit", "-qm", "Take the starter update"]);
  const committed = read("kit.md");
  const markers = /^<{7} /mu.test(committed) && /^>{7} /mu.test(committed);
  assert.equal(markers, true);
  assert.equal(
    git(["rev-list", "--parents", "-n", "1", "HEAD"]).stdout.trim().split(" ")
      .length,
    3,
  );
  return {
    history:
      "base lists kit.md in the kit manifest; the instance edits kit.md and own.md; the starter changes both",
    bothChanged: both.paths,
    merge: { exit: merge.status, stoppedOn },
    unresolvedAfterPageRecovery: left,
    blockGoesOn: { addExit: add.status, commitExit: commit.status },
    mergeCommitHoldsConflictMarkersInKitFile: markers,
  };
});

const result = {
  recordedAt: new Date().toISOString(),
  pageParagraphNames: pageNames,
  earlierUpdateSquashed: squashed,
  editedKitFile: kitFile,
};
writeFileSync(
  join(output, "update-recovery-gaps.json"),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(
  JSON.stringify({
    result: "pass",
    squashBothChanged: squashed.bothChanged,
    squashNotKept: squashed.publishJudgmentNotKept,
    kitLeftUnresolved: kitFile.unresolvedAfterPageRecovery,
    kitMarkersCommitted: kitFile.mergeCommitHoldsConflictMarkersInKitFile,
  }),
);
