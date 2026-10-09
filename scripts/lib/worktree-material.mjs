import {
  accessSync,
  constants,
  existsSync,
  lstatSync,
  readdirSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import {
  releaseCloseCommand,
  runGit,
  runGitPathList,
  shellQuote,
} from "./git.mjs";
import { describeIgnoredMaterial, isNestedRepositoryEntry } from "./paths.mjs";

export function materialPath(candidate) {
  const path =
    typeof candidate === "string" ? candidate.replace(/\/$/u, "") : "";
  if (
    !path ||
    isAbsolute(path) ||
    path.includes("\0") ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  )
    throw new Error(
      "Material path must be relative to the worktree without . or .. components",
    );
  return path;
}

const dispositions = new Set(["disposable", "preserve"]);

function checkedRows(rows) {
  if (!Array.isArray(rows))
    throw new Error("Material inventory must be an array");
  return rows.map((row) => {
    if (
      !row ||
      !dispositions.has(row.disposition) ||
      !["declared", "lane"].includes(row.source) ||
      typeof row.reason !== "string" ||
      !row.reason.trim()
    )
      throw new Error("Invalid material disposition record");
    return { ...row, path: materialPath(row.path) };
  });
}

// A material path never follows a symlink, including its parents.
export function requireMaterialContainment(root, path) {
  let current = root;
  for (const part of materialPath(path).split("/")) {
    current = join(current, part);
    if (lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink())
      throw new Error("Material path refuses a symlink");
  }
}

// A worktree is named physically: a word scoped through an alias of the same
// directory is the same word.
const physical = (path) => {
  try {
    return realpathSync(path);
  } catch {
    return resolve(path);
  }
};

/** Inventory every nested repository of a worktree. Git reports one as a
 * single directory unit whether an ignore rule covers it or it is merely
 * untracked, so both listings are read. A nested repository outside the
 * intake lane that the tracked tree does not declare as a submodule is
 * scratch and disposable; only an operator's close-time word for this
 * worktree changes a row's disposition, and a word that names no repository
 * here is refused. */
export function inventoryMaterial(
  root,
  { overrides = [], overrideWorktree = null } = {},
) {
  root = realpathSync(root);
  const words = new Map();
  for (const row of checkedRows(overrides)) {
    const scope = row.worktree ?? overrideWorktree;
    if (!scope || physical(scope) !== root) continue;
    if (words.has(row.path))
      throw new Error(
        `Duplicate material word for ${JSON.stringify(row.path)}`,
      );
    words.set(row.path, row);
  }
  // A repository no ignore rule covers, such as one cloned after review, is
  // scratch like an ignored one. A re-included intake unit is untracked while
  // its contents are ignored and stays protected intake either way.
  const units = (flags) =>
    runGitPathList(root, ["ls-files", "-z", "--others", ...flags]).filter(
      isNestedRepositoryEntry,
    );
  const rows = [
    ...new Set([
      ...units(["--ignored", "--exclude-standard"]),
      ...units(["--exclude-standard"]),
    ]),
  ]
    .sort()
    .map((path) => describeIgnoredMaterial(root, path))
    .filter((row) => row.kind === "nested-repository")
    .map((row) => {
      const path = materialPath(row.path);
      const explicit = words.get(path);
      if (explicit?.disposition === "disposable" && row.lane === "intake")
        throw new Error(
          "Protected intake repositories cannot be declared disposable",
        );
      if (explicit?.disposition === "disposable" && row.submodule)
        throw new Error("A declared submodule cannot be declared disposable");
      if (explicit?.disposition === "disposable" && row.linked)
        throw new Error(
          "A linked worktree of another repository cannot be declared disposable; its commits live in the owning repository",
        );
      return {
        path,
        lane: row.lane,
        disposition:
          explicit?.disposition ?? (row.disposable ? "disposable" : "preserve"),
        source: explicit?.source ?? "lane",
        reason: explicit?.reason ?? row.classification,
        ...(row.submodule ? { submodule: true } : {}),
      };
    });
  for (const path of words.keys())
    if (!rows.some((row) => row.path === path))
      throw new Error(
        `Material word names no nested repository of this worktree: ${JSON.stringify(path)}`,
      );
  return rows;
}

export function parseMaterialFlags(args, allowed) {
  const flags = [],
    material = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--material") {
      const value = args[++index] ?? "",
        at = value.lastIndexOf("=");
      const disposition = value.slice(at + 1);
      if (at < 1 || !["disposable", "preserve"].includes(disposition))
        throw new Error("usage: --material <path>=disposable|preserve");
      const candidate = value.slice(0, at),
        scopeAt = isAbsolute(candidate) ? candidate.indexOf("::") : -1;
      const worktree = scopeAt < 0 ? undefined : candidate.slice(0, scopeAt);
      if (worktree !== undefined && !isAbsolute(worktree))
        throw new Error("Scoped material needs an absolute worktree before ::");
      const path = materialPath(
        scopeAt < 0 ? candidate : candidate.slice(scopeAt + 2),
      );
      // Two words for one repository conflict whatever their spelling: a
      // trailing slash or an alias of the worktree names the same directory.
      const scoped = worktree === undefined ? undefined : physical(worktree);
      if (material.some((row) => row.path === path && row.worktree === scoped))
        throw new Error(`Duplicate material path: ${path}`);
      material.push({
        path,
        ...(scoped ? { worktree: scoped } : {}),
        disposition,
        source: "declared",
        reason: "operator close --material declaration",
      });
    } else {
      if (!allowed.includes(arg) || flags.includes(arg))
        throw new Error(`Unexpected or duplicate flag: ${arg}`);
      flags.push(arg);
    }
  }
  return { flags, material };
}

export const materialCloseCommand = (
  main,
  workOrder,
  path,
  disposition = "preserve",
) =>
  `${releaseCloseCommand(main, workOrder)} ${(Array.isArray(path)
    ? path
    : [path]
  )
    .map((row) => {
      const candidate = typeof row === "string" ? row : row.path;
      const scope =
        typeof row === "string" || !row.worktree ? "" : `${row.worktree}::`;
      return `--material ${shellQuote(`${scope}${materialPath(candidate)}=${disposition}`)}`;
    })
    .join(" ")}`;

export const materialFlagValue = (row) =>
  `${row.worktree ? `${row.worktree}::` : ""}${row.path}=${row.disposition}`;

// Git inside a nested repository runs with that repository's hooks and file
// monitor off: a scratch repository's own configuration never executes during
// a close. A failed read records null, never a guess.
const NESTED_GIT = [
  "-c",
  "core.hooksPath=/dev/null",
  "-c",
  "core.fsmonitor=false",
];
// The repository is named explicitly: with an unreadable HEAD, discovery
// would otherwise fall through to the worktree that holds it.
const readNested = (directory, args) =>
  runGit(
    directory,
    [
      ...NESTED_GIT,
      "--git-dir",
      join(directory, ".git"),
      "--work-tree",
      directory,
      ...args,
    ],
    { timeout: 5000, onFailure: () => null },
  );

/** What a removal record keeps about a scratch repository: its head commit
 * and whether a remote of that repository held it, as its remote-tracking
 * refs stood at its last fetch or push. */
export function scratchRepositoryFacts(root, path) {
  const directory = join(root, materialPath(path));
  const head =
    readNested(directory, ["rev-parse", "--verify", "--quiet", "HEAD"]) || null;
  const held =
    head === null
      ? null
      : readNested(directory, [
          "for-each-ref",
          "--contains",
          head,
          "--format=%(refname)",
          "refs/remotes/",
        ]);
  return { head, remoteHeld: held === null ? null : held !== "" };
}

// Deleting an entry needs write permission on the directory that holds it. A
// directory this user cannot write refuses the whole removal before any byte
// leaves, so a failed removal never leaves half a repository behind.
const unwritableDirectory = (directory) => {
  const pending = [directory];
  while (pending.length) {
    const current = pending.pop();
    try {
      accessSync(current, constants.R_OK | constants.W_OK | constants.X_OK);
    } catch {
      return current;
    }
    for (const entry of readdirSync(current, { withFileTypes: true }))
      if (entry.isDirectory()) pending.push(join(current, entry.name));
  }
  return null;
};

/** Remove every scratch repository of a worktree, recording each with its
 * path, head commit and remote facts; a preview records what would go. Every
 * directory is checked before any byte leaves, so a refusal retains every
 * repository whole; `onRemoved` receives each record as its removal lands, so
 * a later failure loses no record. `prepare` runs over each directory first
 * and may return an undo that a refusal calls; the worktree helper uses it to
 * restore write bits on directories this user owns. */
export function removeScratchRepositories(
  root,
  material,
  { dryRun = false, prepare, onRemoved } = {},
) {
  const rows = material.filter((entry) => entry.disposition === "disposable");
  const removals = rows.map((row) => ({
    worktree: root,
    path: row.path,
    ...scratchRepositoryFacts(root, row.path),
    outcome: dryRun ? "would-remove" : "removed",
  }));
  if (dryRun) return removals;
  const undos = [];
  for (const row of rows) {
    requireMaterialContainment(root, row.path);
    const directory = join(root, row.path);
    undos.push(prepare?.(directory));
    const sealed = unwritableDirectory(directory);
    if (sealed) {
      for (const undo of undos.reverse()) undo?.();
      throw new Error(
        `Scratch repository ${JSON.stringify(row.path)} could not be removed (${JSON.stringify(sealed.slice(root.length + 1))} is not writable); source retained`,
      );
    }
  }
  rows.forEach((row, index) => {
    const directory = join(root, row.path);
    try {
      rmSync(directory, { recursive: true, force: true });
    } catch (error) {
      throw new Error(
        `Scratch repository ${JSON.stringify(row.path)} could not be removed (${error.message}); source retained`,
      );
    }
    if (existsSync(directory))
      throw new Error(
        `Scratch repository ${JSON.stringify(row.path)} could not be removed; source retained`,
      );
    onRemoved?.(removals[index]);
  });
  return removals;
}
