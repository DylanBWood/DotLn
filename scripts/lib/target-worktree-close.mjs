import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  unlinkSync,
} from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { docPath } from "./config.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  assertFinderMetadataTypes,
  isFinderMetadata,
} from "./finder-metadata.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import {
  parseWorktrees,
  redactPaths,
  runGit,
  runGitPathList,
  releaseCloseCommand,
  spawnGit,
  worktreeHasCheckout,
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

const git = (root, args) => runGit(root, [...HOST_GIT_READ, ...args]);
const gitPaths = (root, args) =>
  runGitPathList(root, [...HOST_GIT_READ, ...args]);

// Git's own failure text can carry the tree's absolute path or its Git
// directory's (a linked worktree keeps that under the clone's .git). Name both,
// and any further paths the caller passes, by role and mask any other local
// absolute path before quoting it, through the redaction the starter refresh
// shares.
const quoteGitFailure = (error, root, label, extra = []) => {
  let gitDirectory = join(root, ".git");
  try {
    const pointer = /^gitdir: (.+)$/mu.exec(
      readFileSync(gitDirectory, "utf8"),
    )?.[1];
    if (pointer) gitDirectory = resolve(root, pointer);
  } catch {
    // A checkout whose .git is a directory keeps its Git directory there.
  }
  return redactPaths(String(error.message ?? error), [
    [gitDirectory, `<${label} Git directory>`],
    [root, `<${label}>`],
    ...extra,
  ]);
};

// A refusal names the tree by its role, never by its absolute path; the entry
// it quotes is relative to that tree. A failing Git read names the tree too.
// Each refusal ends with the close command to rerun.
const closeClean = (root, label, rerun) => {
  let tracked;
  let untracked;
  try {
    tracked = git(root, ["status", "--porcelain", "--untracked-files=no"]);
    untracked = gitPaths(root, [
      "ls-files",
      "-z",
      "--others",
      "--exclude-standard",
    ]);
  } catch (error) {
    throw new Error(
      `${label} cannot close: ${quoteGitFailure(error, root, label)}; source retained. Fix what Git reports, then rerun ${rerun()}`,
    );
  }
  const foreign = untracked.filter((file) => !isFinderMetadata(root, file));
  if (tracked || foreign.length)
    throw new Error(
      `${label} is not clean (${tracked.split("\n")[0] || foreign[0]}); source retained. Clean it, then rerun ${rerun()}`,
    );
  return untracked;
};

const removeFinderMetadata = (root, files) => {
  for (const file of files)
    if (isFinderMetadata(root, file)) unlinkSync(join(root, file));
};

// An entry counts as the base checkout only while its directory is this
// clone's checkout of the base branch. Otherwise, whatever is at the path (
// nothing, an empty directory, another repository, a link to another
// checkout) is out of reach, and the caller never moves the branch under the
// entry. A path that cannot be inspected refuses, so the close never moves a
// branch underneath files it cannot see.
const checkoutExists = (directory, branch, commonDirectory, rerun) => {
  try {
    return worktreeHasCheckout(directory, {
      commonDirectory,
      branch,
      gitArgs: HOST_GIT_READ,
    });
  } catch (error) {
    throw new Error(
      `target clone base ${branch} checkout cannot be inspected (${error.code ?? error.message}); source retained. Restore access to the worktree that holds ${branch}, which git worktree list names, then rerun ${rerun()}`,
    );
  }
};

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
    finderMetadata: {},
  });
  const manifestPath = ".claude/target-worker-manifest.json";
  const targetId = createHash("sha256").update(entry.target).digest("hex");
  const lane = docPath(
    entry.runtimeRoot,
    "control",
    "local/harness/targets",
    targetId,
  );
  const requireReleasedBundleOwnership = () => {
    const exclude = resolve(
      entry.clone,
      git(entry.clone, ["rev-parse", "--git-path", "info/exclude"]),
    );
    const registryPath = docPath(
      entry.runtimeRoot,
      "control",
      "local/harness/excludes",
      `${createHash("sha256").update(exclude).digest("hex")}.json`,
    );
    let member = false;
    if (existsSync(registryPath)) {
      if (!containedRegularFile(registryPath, entry.runtimeRoot))
        throw new Error(
          "target exclude registry is not a contained regular file; source retained",
        );
      const registry = JSON.parse(readFileSync(registryPath, "utf8"));
      if (!registry.members || typeof registry.members !== "object")
        throw new Error(
          "target exclude ownership is unreadable; source retained",
        );
      member = Object.hasOwn(registry.members, targetId);
    }
    if (existsSync(join(lane, "installation.json")) || member)
      throw new Error(
        `target bundle manifest is missing while installation ownership remains; source retained. Restore the installed ${manifestPath} and its bundle files before rerunning ${releaseCloseCommand(root, state.workOrderId, dryRun ? "--dry-run" : "--publish")}`,
      );
  };
  if (!existsSync(entry.target)) requireReleasedBundleOwnership();
  const { checkTargetHarness, removeTargetHarness } =
    await import("./harness.mjs");
  const rerun = () =>
    releaseCloseCommand(
      root,
      state.workOrderId,
      dryRun ? "--dry-run" : "--publish",
    );
  const holders = parseWorktrees(entry.clone).filter(
    (item) => item.branch === `refs/heads/${entry.baseBranch}`,
  );
  const commonDirectory = resolve(
    entry.clone,
    git(entry.clone, ["rev-parse", "--git-common-dir"]),
  );
  const baseCheckout = holders.find((item) =>
    checkoutExists(item.worktree, entry.baseBranch, commonDirectory, rerun),
  )?.worktree;
  // With no checkout present, an entry whose checkout is gone, locked or not,
  // still holds the branch: Git's own `branch -f` and
  // `fetch origin <base>:<base>` refuse to move it, and a checkout restored or
  // remounted there would show the merged change staged as a deletion. The
  // close then completes only when the base needs no move.
  const staleHolder = baseCheckout ? undefined : holders[0];
  const mutationRoot = baseCheckout ?? entry.clone;
  withWriterReservationLock(mutationRoot, () => {
    const blocker = writerTeardownBlocker(mutationRoot);
    if (blocker)
      throw new Error(
        `target clone base ${entry.baseBranch}: ${blocker}; source retained. Release that writer, then rerun ${rerun()}`,
      );
    let baseMetadata = [];
    if (baseCheckout) {
      const base = `target clone base ${entry.baseBranch}`;
      try {
        row.finderMetadata.base = assertFinderMetadataTypes(baseCheckout);
      } catch (error) {
        throw new Error(
          `${base} cannot close: ${error.message}. Then rerun ${rerun()}`,
        );
      }
      baseMetadata = closeClean(baseCheckout, base, rerun);
    }
    // Fetch objects before updating any ref, so a failed fetch or a divergent
    // local base cannot partially change the clone's references.
    try {
      git(entry.clone, [
        "fetch",
        "--no-tags",
        "--refmap=",
        "origin",
        entry.baseBranch,
      ]);
    } catch (error) {
      // A local-path origin is named by role too; it may share the clone's
      // path as a prefix, so it is listed as well and the longer one wins.
      const origin = runGit(
        entry.clone,
        [...HOST_GIT_READ, "remote", "get-url", "origin"],
        { onFailure: () => "" },
      );
      throw new Error(
        `target clone base ${entry.baseBranch} cannot close: fetch failed: ${redactPaths(
          error.message,
          [
            [isAbsolute(origin) ? origin : "", "<target origin>"],
            [entry.clone, "<target clone>"],
          ],
        )}; source retained. Fix the fetch, then rerun ${rerun()}`,
      );
    }
    const fetched = git(entry.clone, ["rev-parse", "FETCH_HEAD^{commit}"]);
    const localBase = runGit(
      entry.clone,
      [
        ...HOST_GIT_READ,
        "rev-parse",
        "--verify",
        `refs/heads/${entry.baseBranch}`,
      ],
      { onFailure: () => null },
    );
    if (
      localBase &&
      spawnGit([
        "-C",
        entry.clone,
        ...HOST_GIT_READ,
        "merge-base",
        "--is-ancestor",
        localBase,
        fetched,
      ]).status !== 0
    )
      throw new Error(
        `target clone base ${entry.baseBranch} cannot fast-forward to fetched base ${fetched}; source retained. Reconcile the local ${entry.baseBranch} with origin/${entry.baseBranch}, then rerun ${rerun()}`,
      );
    if (staleHolder && localBase !== fetched) {
      const state = staleHolder.locked
        ? `locked${typeof staleHolder.locked === "string" ? `: ${staleHolder.locked}` : ""}`
        : staleHolder.prunable
          ? "prunable"
          : "its path holds another checkout";
      const clear = staleHolder.locked
        ? "clear the entry with git worktree unlock, then git worktree prune"
        : staleHolder.prunable
          ? "clear the entry with git worktree prune"
          : "move what sits at its path elsewhere, then clear the entry with git worktree prune";
      throw new Error(
        `target clone base ${entry.baseBranch} is held by a worktree entry whose checkout is gone (${state}), so the close cannot move it to the fetched base; source retained. Restore or remount that worktree and fast-forward it, or ${clear} (git worktree list names it), then rerun ${rerun()}`,
      );
    }
    // A stale ref lock makes these moves fail with Git's text, which names the
    // clone's Git directory; quote it by role.
    const moveRef = (cwd, args) => {
      try {
        git(cwd, args);
      } catch (error) {
        throw new Error(
          `target clone base ${entry.baseBranch} cannot close: ${quoteGitFailure(
            error,
            cwd,
            cwd === entry.clone
              ? "target clone"
              : `target clone base ${entry.baseBranch}`,
            [[commonDirectory, "<target clone Git directory>"]],
          )}; source retained. Fix what Git reports, then rerun ${rerun()}`,
        );
      }
    };
    moveRef(entry.clone, [
      "update-ref",
      `refs/remotes/origin/${entry.baseBranch}`,
      fetched,
    ]);
    if (!dryRun) {
      if (baseCheckout) {
        removeFinderMetadata(baseCheckout, baseMetadata);
        moveRef(baseCheckout, [
          "merge",
          "--ff-only",
          `origin/${entry.baseBranch}`,
        ]);
      } else
        moveRef(entry.clone, [
          "update-ref",
          `refs/heads/${entry.baseBranch}`,
          fetched,
          localBase ?? "",
        ]);
    }
    const containsBranch = () => {
      if (git(entry.clone, ["branch", "--list", entry.branch]))
        git(entry.clone, [
          "merge-base",
          "--is-ancestor",
          entry.branch,
          dryRun ? `origin/${entry.baseBranch}` : entry.baseBranch,
        ]);
    };
    containsBranch();
    const registered = parseWorktrees(entry.clone).find(
      (item) => item.worktree === entry.target,
    );
    if (existsSync(entry.target)) {
      physicalDirectory(entry.target);
      if (registered?.branch !== `refs/heads/${entry.branch}`)
        throw new Error(
          `target worktree registration differs; source retained. Inspect git worktree list in the clone, then rerun ${rerun()}`,
        );
      withWriterReservationLock(entry.target, () => {
        const blocker = writerTeardownBlocker(entry.target);
        if (blocker)
          throw new Error(
            `target worktree: ${blocker}; source retained. Release that writer, then rerun ${rerun()}`,
          );
        const writer = join(lane, "writer");
        if (
          existsSync(join(lane, "writer.json")) ||
          (existsSync(writer) &&
            (!lstatSync(writer).isDirectory() || readdirSync(writer).length))
        )
          throw new Error(
            `target writer reservation is not proven released; source retained. Release that writer, then rerun ${rerun()}`,
          );
        try {
          row.finderMetadata.target = assertFinderMetadataTypes(entry.target);
        } catch (error) {
          throw new Error(
            `target worktree cannot close: ${error.message}. Then rerun ${rerun()}`,
          );
        }
        const metadata = closeClean(entry.target, "target worktree", rerun);
        containsBranch();
        const installed = existsSync(join(entry.target, manifestPath));
        if (!installed) requireReleasedBundleOwnership();
        if (installed)
          checkTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
        const owned = installed
          ? new Set([
              manifestPath,
              ...JSON.parse(
                readFileSync(join(entry.target, manifestPath), "utf8"),
              ).installed.map((file) => file.path),
            ])
          : new Set();
        const ignoredFiles = gitPaths(entry.target, [
          "ls-files",
          "-z",
          "--others",
          "--ignored",
          "--exclude-standard",
        ]);
        const otherFiles = [
          ...ignoredFiles.filter(
            (file) => !owned.has(file) && !isFinderMetadata(entry.target, file),
          ),
          ...row.finderMetadata.target.skippedIgnoredDirectories.map(
            (directory) => `${directory}/`,
          ),
        ];
        const directories = gitPaths(entry.target, [
          "ls-files",
          "-z",
          "--others",
          "--ignored",
          "--exclude-standard",
          "--directory",
        ]).filter(
          (directory) =>
            directory.endsWith("/") &&
            otherFiles.some((file) => file.startsWith(directory)) &&
            ![...owned].some((file) => file.startsWith(directory)),
        );
        // A removal remedy must never name an ancestor of an installed file.
        // Keep each remaining path once, covered by its outermost safe directory.
        const other = [...new Set([...directories, ...otherFiles])]
          .filter(
            (file) =>
              !directories.some(
                (directory) => file !== directory && file.startsWith(directory),
              ),
          )
          .sort();
        if (other.length)
          throw new Error(
            `target has ignored material; source retained: ${other.join(", ")}. Move or remove the listed paths, then rerun ${releaseCloseCommand(root, state.workOrderId, dryRun ? "--dry-run" : "--publish")}`,
          );
        if (dryRun) return;
        if (installed)
          removeTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
        removeFinderMetadata(entry.target, [...metadata, ...ignoredFiles]);
        git(entry.clone, ["worktree", "remove", entry.target]);
      });
    } else if (registered) {
      throw new Error(
        `target directory missing but still registered; source retained. Inspect git worktree list in the clone, then rerun ${rerun()}`,
      );
    }
    if (dryRun) {
      row.outcome = "would-remove";
      return;
    }
    containsBranch();
    // Containment is proven against the declared base above. Git's ordinary
    // branch deletion checks HEAD, which may be detached at an older commit.
    if (git(entry.clone, ["branch", "--list", entry.branch]))
      git(entry.clone, ["branch", "-D", entry.branch]);
    if (existsSync(entry.launchpad))
      forgetTargetWorktree(entry.launchpad, entry.target);
    forgetTargetWorktree(root, entry.target);
    row.outcome = "removed";
  });
};
