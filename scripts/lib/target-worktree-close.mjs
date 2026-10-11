import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { docPath } from "./config.mjs";
import {
  ensureClean,
  parseWorktrees,
  removeMergedBranch,
  runGit,
  runGitPathList,
} from "./git.mjs";
import {
  forgetTargetWorktree,
  physicalDirectory,
  targetWorktreeForOrder,
} from "./target-worktrees.mjs";
import {
  withWriterReservationLock,
  writerTeardownBlocker,
} from "../../packages/skeleton/src/writer-teardown.mjs";

/** Target teardown has no release ladder. Keep its receipt separate from the
 * launchpad cleanup, whose recovery paths belong to a different repository. */
export const closeTargetWorktree = async (root, state, dryRun, record) => {
  const entry = targetWorktreeForOrder(root, state.workOrderId);
  if (!entry) {
    const prior = [...record.previousAttempts]
      .reverse()
      .find(
        (attempt) => attempt.targetCleanup?.outcome === "removed",
      )?.targetCleanup;
    if (!prior) throw new Error("target worktree registry entry is missing");
    record.targetCleanup = prior;
    return;
  }
  if (
    entry.repositoryId !== state.repositoryId ||
    entry.baseCommit !== state.baseCommit
  )
    throw new Error("target registry differs from the merged order");
  physicalDirectory(entry.clone);
  const row = (record.targetCleanup = {
    path: entry.target,
    branch: entry.branch,
    outcome: "retained",
  });
  const containsBranch = () => {
    if (runGit(entry.clone, ["branch", "--list", entry.branch]))
      runGit(entry.clone, [
        "merge-base",
        "--is-ancestor",
        entry.branch,
        entry.baseBranch,
      ]);
  };
  containsBranch();
  const registered = parseWorktrees(entry.clone).find(
    (item) => item.worktree === entry.target,
  );
  if (existsSync(entry.target)) {
    physicalDirectory(entry.target);
    if (registered?.branch !== `refs/heads/${entry.branch}`)
      throw new Error("target worktree registration differs; source retained");
    const { checkTargetHarness, removeTargetHarness } =
      await import("./harness.mjs");
    withWriterReservationLock(entry.target, () => {
      const blocker = writerTeardownBlocker(entry.target);
      if (blocker) throw new Error(blocker);
      const lane = docPath(
        entry.runtimeRoot,
        "control",
        "local/harness/targets",
        createHash("sha256").update(entry.target).digest("hex"),
      );
      const writer = join(lane, "writer");
      if (
        existsSync(join(lane, "writer.json")) ||
        (existsSync(writer) &&
          (!lstatSync(writer).isDirectory() || readdirSync(writer).length))
      )
        throw new Error("target writer reservation is not proven released");
      ensureClean(entry.target);
      containsBranch();
      const manifestPath = ".claude/target-worker-manifest.json";
      const installed = existsSync(join(entry.target, manifestPath));
      const owned = installed
        ? new Set([
            manifestPath,
            ...JSON.parse(
              readFileSync(join(entry.target, manifestPath), "utf8"),
            ).installed.map((file) => file.path),
          ])
        : new Set();
      if (installed)
        checkTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
      const other = runGitPathList(entry.target, [
        "ls-files",
        "-z",
        "--others",
        "--ignored",
        "--exclude-standard",
      ]).filter((file) => !owned.has(file));
      if (other.length)
        throw new Error(
          `target has ignored material; source retained: ${other.join(", ")}`,
        );
      if (dryRun) return;
      if (installed)
        removeTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
      runGit(entry.clone, ["worktree", "remove", entry.target]);
    });
  } else if (registered) {
    throw new Error(
      "target directory missing but still registered; inspect before retrying",
    );
  }
  if (dryRun) {
    row.outcome = "would-remove";
    return;
  }
  containsBranch();
  if (runGit(entry.clone, ["branch", "--list", entry.branch]))
    removeMergedBranch(entry.clone, entry.branch);
  if (existsSync(entry.launchpad))
    forgetTargetWorktree(entry.launchpad, entry.target);
  forgetTargetWorktree(root, entry.target);
  row.outcome = "removed";
};
