import { execFileSync, spawnSync } from "node:child_process";
import {
  realpathSync,
  statSync,
  mkdtempSync,
  openSync,
  closeSync,
  readSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export const nestedGitArgs = (directory) => [
  "-c",
  "core.hooksPath=/dev/null",
  "-c",
  "core.fsmonitor=false",
  "--git-dir",
  join(directory, ".git"),
  "--work-tree",
  directory,
];
export const gitlinkPaths = (entries) =>
  entries
    .filter((entry) => entry.startsWith("160000 "))
    .map((entry) => entry.slice(entry.indexOf("\t") + 1));

export const shellQuote = (value) => `'${value.replaceAll("'", `'\\''`)}'`;

export const failureOf = (result, fallback) =>
  [result.error?.message, result.stderr, result.stdout, fallback]
    .map((value) => (value == null ? "" : String(value).trim()))
    .find(Boolean) ?? "";

// Name each private path in a diagnostic by its label, longest first so a
// nested path wins over its parent, then mask every other absolute path. A
// path counts as absolute only where it starts: after a word, a dot, a colon,
// a slash or a label it continues something else (`src/tmp/x`, `https://`,
// `<label>/index`) and is kept.
export const redactPaths = (text, pairs) => {
  let out = String(text)
    .replace(/file:\/\/\/[^\s'";]+/gu, "file://<local>")
    .replace(/(?<!https?|ssh):\/(?!\/)[^\s'";]+/gu, ":<local>");
  for (const [path, label] of pairs
    .filter(([path]) => typeof path === "string" && path)
    .sort((a, b) => b[0].length - a[0].length))
    out = out.replaceAll(path, label);
  return out.replace(/(?<![\w.~:/>-])\/[^\s'";]+/gu, "<local>");
};

// Keep raw status/byte consumers and execFileSync diagnostics intact while
// giving Git subprocess invocation one home. These preserve the supplied argv.
export const spawnGit = (args, options) => spawnSync("git", args, options);
export const execGit = (args, options) => execFileSync("git", args, options);

export const runGit = (cwd, args, options = {}) => {
  const {
    trim = true,
    exec = false,
    raw = false,
    onFailure,
    ...spawnOptions
  } = options;
  if (raw) return spawnGit(args, { cwd, ...spawnOptions });
  if (exec) {
    const output = execGit(args, { cwd, encoding: "utf8", ...spawnOptions });
    return trim ? output.trim() : output;
  }
  const result = spawnGit(["-C", cwd, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...spawnOptions,
  });
  if (result.status !== 0) {
    if (onFailure) return onFailure(result, args);
    throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
  }
  return trim ? result.stdout.trim() : result.stdout;
};

/** The tag at `commit`, highest version first, and the nearest tag below it,
 * or null for each. The kit manifest's tag and the sibling registry's kit
 * version come from these same two lookups. */
// Provenance names original objects: a replacement ref must not redirect the
// exact or nearest tag (WO-218 FINAL-001).
export const describeTag = (root, commit) => {
  const exact = runGit(root, [
    "--no-replace-objects",
    "tag",
    "--points-at",
    commit,
    "--sort=-v:refname",
  ])
    .split("\n")
    .filter(Boolean);
  const nearest = runGit(
    root,
    ["--no-replace-objects", "describe", "--tags", "--abbrev=0", commit],
    { onFailure: () => null },
  );
  return { tag: exact[0] ?? null, nearest: nearest || null };
};

// Byte-framed batch reads preserve Unicode payloads without spawning one Git
// process per immutable object. Duplicate requests share the returned bytes.
export const readGitObjects = (root, objectIds, type) => {
  const objects = [...new Set(objectIds)];
  if (!objects.length) return new Map();
  const wire = runGit(root, ["--no-replace-objects", "cat-file", "--batch"], {
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
  const result = spawnGit(["-C", cwd, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
  if (result.error?.code === "ENOBUFS")
    throw new Error(
      "Git path-list read exceeded the 16 MiB limit; remove or reduce the listed tree, then rerun the same command",
    );
  if (result.status !== 0)
    throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
  if (result.stdout === "") return [];
  if (!result.stdout.endsWith("\0"))
    throw new Error(
      `git ${args.join(" ")} returned a non-NUL-terminated path list`,
    );
  return result.stdout.slice(0, -1).split("\0");
};

/** The entries of `git status --porcelain=v1 -z` output, as runGitPathList
 * splits it: each is "XY path", and a rename or copy carries its original
 * path as the next field, which has no status of its own. */
export const porcelainEntries = (fields) => {
  const entries = [];
  for (let index = 0; index < fields.length; index += 1) {
    const status = fields[index].slice(0, 2);
    const path = fields[index].slice(3);
    const origin = /[RC]/u.test(status) ? fields[++index] : undefined;
    entries.push({ status, path, origin });
  }
  return entries;
};
/** An entry's paths as a refusal names them, a rename or copy as old -> new. */
export const porcelainEntryName = ({ path, origin }) =>
  origin === undefined ? path : `${origin} -> ${path}`;

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

// A worktree entry holds a checkout only while its directory holds `.git`.
// Given an owner, the checkout must also belong to that Git common directory
// and have its branch checked out: a reused path may hold another clone,
// another repository's worktree or a link to some other checkout. A missing
// path answers false; a stat failure, or a `.git` Git cannot read, throws.
export const worktreeHasCheckout = (directory, owner) => {
  if (
    statSync(join(directory, ".git"), { throwIfNoEntry: false }) === undefined
  )
    return false;
  if (!owner) return true;
  const read = (args) =>
    runGit(directory, [...(owner.gitArgs ?? []), ...args], {
      onFailure: () => null,
    });
  const common = read(["rev-parse", "--git-common-dir"]);
  if (common === null) throw new Error("Git cannot read the checkout");
  return (
    realpathSync(resolve(directory, common)) ===
      realpathSync(owner.commonDirectory) &&
    read(["symbolic-ref", "--quiet", "HEAD"]) === `refs/heads/${owner.branch}`
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

/** The sole script printer for the byte-exact, lifecycle-admitted helper. */
export const releaseCloseCommand = (main, workOrder, mode = "--publish") => {
  if (
    !/^WO-\d{3}$/.test(workOrder) ||
    !["--publish", "--dry-run"].includes(mode)
  )
    throw new Error("Invalid release-close command");
  return `${shellQuote(process.execPath)} ${shellQuote(join(main, "scripts/release.mjs"))} close ${workOrder} ${mode}`;
};

/** Stream a large tree's NUL-framed names and retain only the selected paths.
 * The child's stdout goes to an owned temporary file, never a captured buffer. */
export function selectGitPaths(root, args, select) {
  const scratch = mkdtempSync(join(tmpdir(), "dotln-git-paths-"));
  let descriptor;
  try {
    descriptor = openSync(join(scratch, "paths"), "w+");
    const result = spawnGit(["-C", root, ...args], {
      stdio: ["ignore", descriptor, "pipe"],
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });
    if (result.status !== 0)
      throw new Error(failureOf(result, "Git tree path read failed"));
    const rows = [],
      chunk = Buffer.alloc(65536);
    let pending = Buffer.alloc(0),
      offset = 0,
      retained = 0;
    for (;;) {
      const length = readSync(descriptor, chunk, 0, chunk.length, offset);
      if (!length) break;
      offset += length;
      const bytes = Buffer.concat([pending, chunk.subarray(0, length)]);
      let start = 0,
        end;
      while ((end = bytes.indexOf(0, start)) >= 0) {
        const name = bytes.subarray(start, end).toString("utf8");
        if (select(name)) {
          retained += end - start + 1;
          if (retained > 16 * 1024 * 1024)
            throw new Error(
              "Selected Git paths exceed the 16 MiB limit; reduce the selected tree, then rerun",
            );
          rows.push(name);
        }
        start = end + 1;
      }
      pending = Buffer.from(bytes.subarray(start));
    }
    if (pending.length)
      throw new Error("Git tree returned a non-NUL-terminated path list");
    return rows;
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
    rmSync(scratch, { recursive: true, force: true });
  }
}
