// Final review of WO-276: the close's rebase rule asks for a base commit that
// is each branch commit's change exactly, and takes the first one that is, so
// one base commit can answer for two branch commits. This builds a branch
// that changes a file, changes another, reverts the first change and makes it
// again, and a base that holds only the first three replayed, in a fresh
// repository under the scratch directory given as argv[2], and prints what
// the tips hold and what mergedChange answers. Adapted from the review
// worker's probe of the same claim.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const scratch = process.argv[2];
const { mergedChange } = await import(
  pathToFileURL(join(process.cwd(), "scripts/lib/merged-change.mjs")).href
);
const root = join(scratch, "rebase-reuse");
rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });
const git = (...args) => {
  const result = spawnSync(
    "git",
    ["-C", root, "-c", "maintenance.auto=false", ...args],
    { encoding: "utf8" },
  );
  if (result.status !== 0)
    throw new Error(`git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
};
const write = (name, text) => writeFileSync(join(root, name), text);
const commit = (subject) => {
  git("add", "-A");
  git("commit", "-qm", subject);
  return git("rev-parse", "HEAD");
};
let result;
try {
  git("init", "-q", "-b", "main");
  git("config", "user.email", "probe@example.invalid");
  git("config", "user.name", "Probe");
  write("a.txt", "one\ntwo\nthree\n");
  write("b.txt", "alpha\nbeta\n");
  commit("base");
  git("switch", "-qc", "wo-999");
  write("a.txt", "one\ntwo changed\nthree\n");
  const first = commit("change a");
  write("b.txt", "alpha\nbeta\ngamma\n");
  const second = commit("change b");
  write("a.txt", "one\ntwo\nthree\n");
  const third = commit("revert the change to a");
  write("a.txt", "one\ntwo changed\nthree\n");
  commit("change a again");
  git("switch", "-q", "main");
  write("c.txt", "another person's work\n");
  commit("unrelated");
  for (const replayed of [first, second, third]) git("cherry-pick", replayed);
  const answer = mergedChange(root, "wo-999", "main");
  result = {
    branchCommits: git("rev-list", "--count", "main..wo-999"),
    branchTipHoldsTheChange: git("show", "wo-999:a.txt").includes(
      "two changed",
    ),
    baseTipHoldsTheChange: git("show", "main:a.txt").includes("two changed"),
    merged: answer.merged,
    by: answer.by,
    baseCommitsMatched: answer.commits.length,
    baseCommitsRead: answer.read,
  };
} finally {
  rmSync(root, { recursive: true, force: true });
}
console.log(JSON.stringify(result, null, 2));
