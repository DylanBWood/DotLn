import { runGit } from "./git.mjs";
import { defaultDocRelative, docPath, docRelative } from "./config.mjs";

import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { basename, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const containedRegularFile = (path, root) =>
  existsSync(path) &&
  lstatSync(path).isFile() &&
  realpathSync(path).startsWith(`${realpathSync(root)}${sep}`);

export const parseJson = (source, displayPath, { rawErrors = false } = {}) => {
  try {
    return JSON.parse(source);
  } catch (error) {
    if (rawErrors) throw error;
    throw new Error(
      `invalid JSON in ${displayPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const readJsonFile = (path, { rawErrors = false } = {}) => {
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    if (rawErrors) throw error;
    throw new Error(
      `cannot read JSON file ${path}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return parseJson(source, path, { rawErrors });
};

export const workOrderAuthorityPath = (
  root,
  workOrderId,
  workOrderPath,
  { requireFile = true } = {},
) => {
  const authorityRoots = [
    docPath(root, "workOrders"),
    docPath(root, "derivedWorkOrders"),
  ];
  const authorityRoot = authorityRoots.find((directory) =>
    resolve(root, workOrderPath ?? "").startsWith(`${directory}${sep}`),
  );
  const authorityPath = resolve(root, workOrderPath ?? "");
  if (
    !/^WO-\d{3}$/.test(workOrderId ?? "") ||
    !workOrderPath ||
    !authorityRoot ||
    !basename(authorityPath).startsWith(`${workOrderId}-`) ||
    (requireFile &&
      (!containedRegularFile(authorityPath, authorityRoot) ||
        !containedRegularFile(authorityPath, root)))
  )
    throw new Error(
      `invalid work-order authority path for ${workOrderId ?? "none"}: ${workOrderPath ?? "none"}`,
    );
  return authorityPath;
};

/** Both catalog roots share the existing WO-NNN namespace. Never follow a
 * symlink while discovering authority files. The derived child is scanned once. */
export const workOrderAuthorityFiles = (root) => {
  const files = new Set();
  for (const key of ["workOrders", "derivedWorkOrders"]) {
    const directory = docPath(root, key);
    if (!existsSync(directory)) continue;
    if (
      !lstatSync(directory).isDirectory() ||
      !realpathSync(directory).startsWith(`${realpathSync(root)}${sep}`)
    )
      throw new Error(
        `${docRelative(root, key)}: directory must remain inside the repository`,
      );
    for (const name of readdirSync(directory))
      if (/^WO-.*\.md$/.test(name))
        files.add(`${docRelative(root, key)}/${name}`);
  }
  return [...files].sort();
};

// Ignored-material classification reads launchpad-relative names, so each
// lane is anchored at its configured root; without a launchpad it is today's.
const lanes = (root) => ({
  intake: root ? docRelative(root, "intake") : defaultDocRelative("intake"),
  controlLocal: root
    ? docRelative(root, "control", "local")
    : defaultDocRelative("control", "local"),
});
const anchored = (candidate, prefix) =>
  candidate === prefix || candidate.startsWith(`${prefix}/`);
const protectedIntake = (candidate, root) =>
  anchored(candidate, lanes(root).intake);
const anchoredBuildOutput = (candidate) =>
  /^(?:node_modules|dist)(?:\/|$)/.test(candidate) ||
  /^packages\/[^/]+\/(?:node_modules|dist)(?:\/|$)/.test(candidate);

// File suffixes and nested beacon-stage names do not classify whole
// repositories. Only the project's explicit scratch-directory lanes do.
const disposableRepositoryLane = (candidate, root) =>
  anchoredBuildOutput(candidate) ||
  anchored(candidate, ".runtime") ||
  anchored(candidate, `${lanes(root).controlLocal}/harness`) ||
  anchored(candidate, `${lanes(root).controlLocal}/cache`) ||
  anchored(candidate, ".control-beacons") ||
  /^\.dotln-beacon-stage-[A-Za-z0-9]{6}(?:\/|$)/.test(candidate);

export const disposableBasename = (candidate) =>
  basename(candidate) === ".DS_Store" ||
  basename(candidate).endsWith(".tsbuildinfo");

export const classifyIgnoredMaterial = (candidate, root) => {
  const { intake: intakeRoot, controlLocal } = lanes(root);
  const intake = anchored(candidate, intakeRoot);
  const disposable =
    !intake &&
    (anchoredBuildOutput(candidate) ||
      anchored(candidate, ".runtime") ||
      anchored(candidate, `${controlLocal}/harness`) ||
      // Derived listing records, rebuilt on demand (WO-164).
      anchored(candidate, `${controlLocal}/cache`) ||
      anchored(candidate, ".control-beacons") ||
      /(?:^|\/)\.dotln-beacon-stage-[A-Za-z0-9]{6}(?:\/|$)/.test(candidate) ||
      disposableBasename(candidate));
  return {
    disposable,
    releaseEvidenceAllowed:
      intake ||
      disposable ||
      anchored(candidate, controlLocal) ||
      candidate === ".claude/settings.local.json",
  };
};

/** The lane an ignored path belongs to; each lane names its own remedy. */
export const ignoredLane = (candidate, root) =>
  protectedIntake(candidate, root)
    ? "intake"
    : anchored(candidate, lanes(root).controlLocal)
      ? "control"
      : candidate === ".claude/settings.local.json"
        ? "settings"
        : "other";

/** `git ls-files --others` reports a nested repository as one directory
 * entry with a trailing slash and never descends into it. */
export const isNestedRepositoryEntry = (candidate) => candidate.endsWith("/");

/** An unborn HEAD alone says nothing about saved refs, index or objects. */
export function inspectNestedRepository(root, candidate) {
  const directory = join(root, candidate.replace(/\/$/, ""));
  let names;
  try {
    names = readdirSync(directory);
  } catch {
    return { repository: false, commits: false, empty: false };
  }
  if (!names.includes(".git"))
    return { repository: false, commits: false, empty: false };
  const gitDirectory = join(directory, ".git");
  // Linked worktrees and unreadable repositories need an explicit word;
  // their metadata cannot establish empty standalone scaffolding.
  try {
    if (!lstatSync(gitDirectory).isDirectory())
      return { repository: true, commits: null, empty: false };
    const inspectionGitFlags = [
      "--git-dir",
      gitDirectory,
      "--work-tree",
      directory,
    ];
    const inspectionGitOptions = {
      cwd: directory,
      timeout: 5000,
      maxBuffer: 1024 * 1024,
      onFailure: () => {
        throw new Error("Repository inspection failed");
      },
    };
    const commits =
      runGit(
        directory,
        [...inspectionGitFlags, "rev-list", "--all", "--count"],
        inspectionGitOptions,
      ) !== "0";
    const refs = runGit(
      directory,
      [...inspectionGitFlags, "for-each-ref", "--format=%(refname)"],
      inspectionGitOptions,
    );
    const index = runGit(
      directory,
      [...inspectionGitFlags, "ls-files", "--stage"],
      inspectionGitOptions,
    );
    const objects = runGit(
      directory,
      [...inspectionGitFlags, "count-objects", "-v"],
      inspectionGitOptions,
    );
    const noObjects =
      ["count", "in-pack", "packs", "garbage"].every((key) =>
        new RegExp(`^${key}: 0$`, "m").test(objects),
      ) && !/^alternate:/m.test(objects);
    const unborn = /^refs\/heads\/.+/.test(
      runGit(
        directory,
        [...inspectionGitFlags, "symbolic-ref", "--quiet", "HEAD"],
        inspectionGitOptions,
      ),
    );
    return {
      repository: true,
      commits,
      empty:
        names.length === 1 &&
        unborn &&
        !commits &&
        !refs &&
        !index &&
        noObjects,
    };
  } catch {
    return { repository: true, commits: null, empty: false };
  }
}

const remedies = (root) => ({
  intake:
    "archive it with npm run backup:intake or move it outside the checkout from an operator terminal, then retry",
  control: `${lanes(root).controlLocal} records are preserved into main's ignored retained/WO-NNN lane automatically; this entry cannot be preserved as a regular file or directory unit, so move or delete it from an operator terminal`,
  settings:
    "the operator-owned settings file is never deleted here; move it out of the worktree from an operator terminal",
  other:
    "move it outside the checkout or delete it from an operator terminal; nothing in the release close deletes ignored material",
});

/** One classified row per ignored entry: what it is, which lane owns it,
 * whether removal may discard it, and the remedy that applies to that lane. */
export function describeIgnoredMaterial(root, candidate) {
  const lane = ignoredLane(candidate, root);
  const base = classifyIgnoredMaterial(candidate.replace(/\/$/, ""), root);
  if (!isNestedRepositoryEntry(candidate))
    return {
      path: candidate,
      kind: "file",
      lane,
      ...base,
      classification: `${lane} lane: ignored file`,
      remedy: remedies(root)[lane],
    };
  const nested = inspectNestedRepository(root, candidate);
  if (!nested.repository)
    return {
      path: candidate,
      kind: "directory",
      lane,
      ...base,
      classification: `${lane} lane: ignored directory`,
      remedy: remedies(root)[lane],
    };
  if (
    base.disposable &&
    nested.commits !== null &&
    disposableRepositoryLane(candidate.replace(/\/$/, ""), root)
  )
    return {
      path: candidate,
      kind: "nested-repository",
      lane,
      ...base,
      classification: `${lane} lane: disposable scratch repository`,
      remedy:
        "disposable by lane; it is removed with the worktree unless declared preserve",
    };
  if (nested.empty && lane !== "intake")
    return {
      path: candidate,
      kind: "nested-repository",
      lane,
      disposable: true,
      releaseEvidenceAllowed: true,
      classification: `${lane} lane: empty nested repository (fixture scaffolding; only .git, no commit)`,
      remedy: "disposable; it is removed with the worktree",
    };
  const preserved = lane === "intake" || lane === "control";
  return {
    path: candidate,
    kind: "nested-repository",
    lane,
    disposable: false,
    releaseEvidenceAllowed: base.releaseEvidenceAllowed,
    classification: `${lane} lane: nested repository with content${nested.commits === null ? " (commit state unknown)" : nested.commits ? "" : " and no commit"}`,
    remedy: preserved
      ? "preserved as a directory unit by the reviewed helper"
      : "move it outside the checkout from an operator terminal; a nested repository is never deleted here",
  };
}

export const isMainModule = (moduleUrl, entry = process.argv[1]) => {
  if (!entry) return false;
  try {
    return (
      realpathSync(resolve(entry)) === realpathSync(fileURLToPath(moduleUrl))
    );
  } catch {
    return false;
  }
};
