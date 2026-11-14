import {
  createScratchRoot,
  removeTemporaryPath as rmSync,
} from "./temporary-roots.mjs";
import { lstatSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGit, runGitPathList } from "./git.mjs";

/** Whether the working tree still holds a path Git tracks, as a test of one
 * path: the path is a file or a link, every directory above it is a
 * directory, and nothing the snapshot has `staged` stands above it. Where a
 * directory above it has become a file or a link, or is gone, the tracked
 * path went with it, and what stands there now is what the snapshot holds.
 * Where the snapshot holds a directory above it as a repository of its own,
 * by that repository's commit, it holds nothing beneath it: Git adds no path
 * beyond a file, a link or such an entry. A path that is missing reads as
 * lost; any other failure to read one is raised, never taken for a file
 * that is gone. On a volume that folds case the file system answers for a
 * name in any case, so this test alone cannot tell a file from one renamed
 * by case: the snapshot adds by name only a path that passes it and that
 * Git says an ignore rule matches.
 * @param {string} root
 * @param {ReadonlySet<string>} staged */
function heldIn(root, staged) {
  const entryAt = (path) => {
    try {
      return lstatSync(join(root, path));
    } catch (error) {
      // No entry, or a name above it that is no directory: nothing is there.
      if (error.code === "ENOENT" || error.code === "ENOTDIR") return undefined;
      throw error;
    }
  };
  // Many tracked paths share their directories, so each is read once.
  const directories = new Map();
  const reached = (directory) => {
    if (!directories.has(directory)) {
      const cut = directory.lastIndexOf("/");
      directories.set(
        directory,
        !staged.has(directory) &&
          (cut < 0 || reached(directory.slice(0, cut))) &&
          Boolean(entryAt(directory)?.isDirectory()),
      );
    }
    return directories.get(directory);
  };
  return (path) => {
    const cut = path.lastIndexOf("/");
    if (cut >= 0 && !reached(path.slice(0, cut))) return false;
    const entry = entryAt(path);
    return Boolean(entry && (entry.isFile() || entry.isSymbolicLink()));
  };
}

/** The working tree as one Git tree object: every file Git tracks, as the
 * working tree holds it, and every untracked file no ignore rule matches. It
 * is written through a temporary index, so the real index is untouched; only
 * the objects land in the repository's store.
 * @param {string} root */
export function workingTree(root, gitOptions = []) {
  const temporary = createScratchRoot(join(tmpdir(), "dotln-checkpoint-"));
  try {
    const env = { ...process.env, GIT_INDEX_FILE: join(temporary, "index") };
    // A caller reading a repository it does not own passes the host's safe
    // options, so that repository's hooks and file monitor never run.
    // The temporary index starts empty, so every file is read from the
    // working tree whatever the real index says of it: a flag that tells Git
    // to assume a tracked file unchanged, or to skip it, hides no change.
    runGit(root, [...gitOptions, "add", "-A"], { env });
    // From an empty index every file is untracked, and an ignore rule speaks
    // of untracked files: a file Git tracks whose path a rule has come to
    // match was left out above. Git is asked which tracked paths its rules
    // match, and each of those the working tree still holds is added by its
    // name, which no ignore rule and no sparse pattern judges. A tracked
    // file the working tree has lost stays out. No other tracked path is
    // added: the pass above staged the working tree as it stands, so a file
    // renamed since Git last saw it is held under its new name alone.
    const staged = new Set(
      runGitPathList(root, [...gitOptions, "ls-files", "-z"], { env }),
    );
    const ignored = new Set(
      runGitPathList(root, [
        ...gitOptions,
        "ls-files",
        "-z",
        "--cached",
        "--ignored",
        "--exclude-standard",
      ]),
    );
    // Every tracked path the pass above left out is looked for, whether or
    // not a rule matches it, so that one the working tree holds and nothing
    // can read is an error here and never a file quietly left out.
    const held = heldIn(root, staged);
    const left = [
      ...new Set(runGitPathList(root, [...gitOptions, "ls-files", "-z"])),
    ].filter((path) => !staged.has(path) && held(path) && ignored.has(path));
    for (let at = 0; at < left.length; at += 200)
      runGit(
        root,
        [
          ...gitOptions,
          "update-index",
          "--add",
          "--",
          ...left.slice(at, at + 200),
        ],
        { env },
      );
    return runGit(root, [...gitOptions, "write-tree"], { env });
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

// A recovery object, never a branch commit or a lifecycle event. The real
// index is untouched, and ignored intake deliberately remains outside Git.
export function createCheckpoint(
  root,
  action,
  workOrderId,
  { hookless = false } = {},
) {
  if (!/^WO-\d{3}$/.test(workOrderId))
    throw new Error("invalid checkpoint order");
  const prefix = `refs/dotln/checkpoint/${workOrderId}/`;
  const used = runGit(root, ["for-each-ref", "--format=%(refname)", prefix])
    .split("\n")
    .filter(Boolean)
    .map((ref) => Number(ref.slice(prefix.length)))
    .filter(Number.isInteger);
  const checkpointRef = `${prefix}${Math.max(0, ...used) + 1}`;
  const tree = workingTree(root);
  const checkpointSha = runGit(root, [
    ...(hookless ? ["-c", "core.hooksPath=/dev/null"] : []),
    "commit-tree",
    tree,
    "-p",
    "HEAD",
    "-m",
    `dotln checkpoint: ${action} ${workOrderId}`,
  ]);
  runGit(root, ["update-ref", checkpointRef, checkpointSha, ""]);
  return { checkpointSha, checkpointRef };
}
