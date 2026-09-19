import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

export const shellQuote = (value) => `'${value.replaceAll("'", `'\\''`)}'`;

export const failureOf = (result, fallback) =>
  [result.stderr, result.stdout, result.error?.message, fallback]
    .map((value) => (value == null ? "" : String(value).trim()))
    .find(Boolean) ?? "";

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

// Byte-framed batch reads preserve Unicode payloads without spawning one Git
// process per immutable object. Duplicate requests share the returned bytes.
export const readGitObjects = (root, objectIds, type) => {
  const objects = [...new Set(objectIds)];
  if (!objects.length) return new Map();
  const wire = runGit(root, ["cat-file", "--batch"], {
    trim: false,
    encoding: null,
    input: objects.join("\n") + "\n",
  });
  const result = new Map();
  let offset = 0;
  for (const object of objects) {
    const end = wire.indexOf(10, offset);
    const header = wire.subarray(offset, end).toString("ascii").split(" ");
    const length = Number(header[2]);
    if (
      end < offset ||
      header.length !== 3 ||
      header[0] !== object ||
      header[1] !== type ||
      !/^\d+$/.test(header[2]) ||
      !Number.isSafeInteger(length) ||
      length < 0 ||
      end + length + 1 >= wire.length ||
      wire[end + length + 1] !== 10
    )
      throw new Error(
        `Git ${type} batch has invalid framing for requested object ${object}`,
      );
    result.set(object, wire.subarray(end + 1, end + 1 + length));
    offset = end + length + 2;
  }
  if (offset !== wire.length)
    throw new Error(`Git ${type} batch has trailing bytes`);
  return result;
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
