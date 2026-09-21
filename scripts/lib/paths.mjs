import { defaultDocRelative, docPath, docRelative } from "./config.mjs";
import { spawnSync } from "node:child_process";
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

export const parseJson = (source, displayPath) => {
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(
      `invalid JSON in ${displayPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const readJsonFile = (path) => {
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    throw new Error(
      `cannot read JSON file ${path}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return parseJson(source, path);
};

export const workOrderAuthorityPath = (
  root,
  workOrderId,
  workOrderPath,
  { requireFile = true } = {},
) => {
  const authorityRoot = docPath(root, "workOrders");
  const authorityPath = resolve(root, workOrderPath ?? "");
  if (
    !/^WO-\d{3}$/.test(workOrderId ?? "") ||
    !workOrderPath ||
    !authorityPath.startsWith(`${authorityRoot}${sep}`) ||
    !basename(authorityPath).startsWith(`${workOrderId}-`) ||
    (requireFile && !containedRegularFile(authorityPath, authorityRoot))
  )
    throw new Error(
      `invalid work-order authority path for ${workOrderId ?? "none"}: ${workOrderPath ?? "none"}`,
    );
  return authorityPath;
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
  // Linked worktrees and unreadable repositories are never disposable here.
  try {
    if (!lstatSync(gitDirectory).isDirectory())
      return { repository: true, commits: null, empty: false };
    const git = (...args) => {
      const result = spawnSync(
        "git",
        ["--git-dir", gitDirectory, "--work-tree", directory, ...args],
        { cwd: directory, encoding: "utf8", timeout: 5000 },
      );
      if (result.status !== 0) throw new Error("Repository inspection failed");
      return result.stdout.trim();
    };
    const commits = git("rev-list", "--all", "--count") !== "0";
    const refs = git("for-each-ref", "--format=%(refname)");
    const index = git("ls-files", "--stage");
    const objects = git("count-objects", "-v");
    const noObjects =
      ["count", "in-pack", "packs", "garbage"].every((key) =>
        new RegExp(`^${key}: 0$`, "m").test(objects),
      ) && !/^alternate:/m.test(objects);
    const unborn = /^refs\/heads\/.+/.test(
      git("symbolic-ref", "--quiet", "HEAD"),
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
