import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

export const failureOf = (result, fallback) =>
  (result.stderr || result.stdout || result.error?.message || fallback).trim();

export const runGit = (cwd, args, options = {}) => {
  const { trim = true, ...spawnOptions } = options;
  const result = spawnSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...spawnOptions,
  });
  if (result.status !== 0)
    throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
  return trim ? result.stdout.trim() : result.stdout;
};

export const runGitPathList = (cwd, args, options = {}) => {
  const result = spawnSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
  if (result.status !== 0)
    throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
  if (result.stdout === "") return [];
  if (!result.stdout.endsWith("\0"))
    throw new Error(
      `git ${args.join(" ")} returned a non-NUL-terminated path list`,
    );
  return result.stdout.slice(0, -1).split("\0");
};

export const ensureClean = (root) => {
  const dirty = runGit(root, [
    "status",
    "--porcelain",
    "--untracked-files=all",
  ]);
  if (dirty !== "")
    throw new Error(
      `working tree is not clean: ${root} (${dirty.split("\n")[0]})`,
    );
};

export const parseWorktrees = (root) =>
  runGit(root, ["worktree", "list", "--porcelain"])
    .split("\n\n")
    .filter(Boolean)
    .map((record) =>
      Object.fromEntries(
        record.split("\n").map((line) => {
          const at = line.indexOf(" ");
          return at < 0
            ? [line, true]
            : [line.slice(0, at), line.slice(at + 1)];
        }),
      ),
    );

export const mainWorktree = (root) => {
  const main = parseWorktrees(root).find(
    (item) => item.branch === "refs/heads/main",
  );
  if (!main?.worktree)
    throw new Error("no main-branch control-plane worktree found");
  return resolve(main.worktree);
};

export const removeMergedBranch = (root, branch) => {
  const upstream = spawnSync(
    "git",
    ["-C", root, "rev-parse", "--verify", `${branch}@{upstream}`],
    { encoding: "utf8" },
  );
  if (upstream.status === 0)
    runGit(root, ["branch", "--unset-upstream", branch]);
  runGit(root, ["branch", "-d", branch]);
};
