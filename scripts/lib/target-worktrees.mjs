import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { docPath, loadConfig } from "./config.mjs";
import { exportSiblings, readDeclaration } from "./siblings.mjs";
import { runGit } from "./git.mjs";

export const targetRegistryPath = (launchpad) =>
  docPath(launchpad, "control", "local/target-worktrees.json");
export const cloneMapPath = (launchpad) =>
  docPath(launchpad, "control", "local/repository-clones.json");
const targetStartsPath = (launchpad) =>
  docPath(launchpad, "control", "local/target-starts.json");

// Physical pwd resolves directory aliases that realpath can retain, including
// volume aliases. Selection accepts alternate spellings of the same launchpad.
export const directoryIdentity = (directory) => {
  try {
    return execFileSync("/bin/pwd", ["-P"], {
      cwd: directory,
      encoding: "utf8",
      timeout: 5_000,
    }).replace(/\n$/u, "");
  } catch {
    throw new Error(`directory is unreadable: ${directory}`);
  }
};

// Creation still requires the source-change guard's exact directory spelling
// before checking containment or creating any worktree.
export const physicalDirectory = (directory) => {
  try {
    if (
      resolve(directory) === directory &&
      realpathSync.native(directory) === directory &&
      lstatSync(directory).isDirectory() &&
      directoryIdentity(directory) === directory
    )
      return directory;
  } catch {
    throw new Error(`directory is unreadable: ${directory}`);
  }
  throw new Error(`spelling differs from filesystem identity: ${directory}`);
};

const readMap = (file) => {
  if (!existsSync(file)) return {};
  if (!lstatSync(file).isFile() || lstatSync(file).isSymbolicLink())
    throw new Error(`local registry is not a regular file: ${file}`);
  const bytes = readFileSync(file, "utf8");
  let value;
  try {
    value = JSON.parse(bytes);
  } catch {
    throw new Error(`invalid local registry: ${file}`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`invalid local registry: ${file}`);
  return value;
};
const writeMap = (root, file, value) => {
  let ancestor = dirname(file);
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  physicalDirectory(ancestor);
  runGit(root, ["check-ignore", "--quiet", "--no-index", file]);
  if (runGit(root, ["ls-files", "--", file]))
    throw new Error(`local registry must not be tracked: ${file}`);
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    flag: "wx",
    mode: 0o600,
  });
  renameSync(temporary, file);
};
const gitTopLevel = (clone) => {
  physicalDirectory(clone);
  if (
    runGit(clone, ["rev-parse", "--show-toplevel"], {
      onFailure: () => undefined,
    }) !== clone
  )
    throw new Error(`not a Git top level: ${clone}`);
  return clone;
};

export const recordRepositoryClone = (launchpad, id, clone) => {
  if (
    !Object.hasOwn(loadConfig(launchpad).repositories, id) &&
    !exportSiblings(readDeclaration(launchpad)).some((entry) => entry.id === id)
  )
    throw new Error(`unknown repository id ${JSON.stringify(id)}`);
  gitTopLevel(clone);
  const file = cloneMapPath(launchpad);
  writeMap(launchpad, file, { ...readMap(file), [id]: clone });
};

export const recordedRepositoryClone = (launchpad, id) =>
  readMap(cloneMapPath(launchpad))[id];

export const resolveTargetStart = (launchpad, id) => {
  try {
    const repository = loadConfig(launchpad).repositories[id];
    if (!repository) throw new Error("unknown repository id");
    const clone = readMap(cloneMapPath(launchpad))[id];
    if (typeof clone !== "string") throw new Error("no local clone recorded");
    gitTopLevel(clone);
    const parent = physicalDirectory(
      resolve(launchpad, repository.worktreeParent),
    );
    return { clone, parent, repository };
  } catch (error) {
    throw new Error(`repository ${id}: ${error.message}`);
  }
};

export const targetStartPlan = (
  launchpad,
  declaration,
  workOrderId,
  { recovery = false } = {},
) => {
  const { clone, parent, repository } = resolveTargetStart(
    launchpad,
    declaration.id,
  );
  const branch = `wo-${workOrderId.slice(3)}`;
  const target = join(parent, `${basename(clone)}-wo${workOrderId.slice(3)}`);
  const orderRoot = join(
    dirname(launchpad),
    `${basename(launchpad)}-wo${workOrderId.slice(3)}`,
  );
  const overlaps = (a, b) => a === b || a.startsWith(`${b}${sep}`);
  // Keep sibling names distinct even on case-insensitive filesystems. Refuse
  // case-only pairs on every host so a start plan is portable between them.
  const sameSiblingName =
    dirname(target) === dirname(orderRoot) &&
    basename(target).normalize("NFC").toLowerCase() ===
      basename(orderRoot).normalize("NFC").toLowerCase();
  if (
    sameSiblingName ||
    overlaps(target, orderRoot) ||
    overlaps(orderRoot, target)
  )
    throw new Error(
      `repository ${declaration.id}: target and launchpad worktree paths overlap`,
    );
  if (
    overlaps(target, launchpad) ||
    overlaps(launchpad, target) ||
    overlaps(target, clone) ||
    overlaps(clone, target)
  )
    throw new Error(`repository ${declaration.id}: target overlaps a checkout`);
  if (!recovery && lstatSync(target, { throwIfNoEntry: false }))
    throw new Error(`repository ${declaration.id}: target already exists`);
  if (!recovery && runGit(clone, ["branch", "--list", branch]))
    throw new Error(`repository ${declaration.id}: branch already exists`);
  runGit(clone, [
    "rev-parse",
    "--verify",
    `${declaration.baseCommit}^{commit}`,
  ]);
  if (!recovery && readMap(targetRegistryPath(launchpad))[target])
    throw new Error(`repository ${declaration.id}: target already registered`);
  return {
    target,
    clone,
    branch,
    baseBranch: repository.baseBranch,
    baseCommit: declaration.baseCommit,
    repositoryId: declaration.id,
    workOrderId,
  };
};

export const readTargetStart = (launchpad, workOrderId) =>
  readMap(targetStartsPath(launchpad))[workOrderId];
export const recordTargetStart = (launchpad, entry) => {
  const file = targetStartsPath(launchpad);
  writeMap(launchpad, file, { ...readMap(file), [entry.workOrderId]: entry });
};
export const forgetTargetStart = (launchpad, workOrderId) => {
  const file = targetStartsPath(launchpad);
  const entries = readMap(file);
  delete entries[workOrderId];
  writeMap(launchpad, file, entries);
};

export const recordTargetWorktree = (launchpad, entry) => {
  const file = targetRegistryPath(launchpad);
  writeMap(launchpad, file, { ...readMap(file), [entry.target]: entry });
};
export const forgetTargetWorktree = (launchpad, target) => {
  const file = targetRegistryPath(launchpad);
  const entries = readMap(file);
  delete entries[target];
  writeMap(launchpad, file, entries);
};
export const targetWorktreeForOrder = (launchpad, workOrderId) => {
  const entries = Object.values(readMap(targetRegistryPath(launchpad))).filter(
    (entry) => entry.workOrderId === workOrderId,
  );
  if (entries.length > 1)
    throw new Error(`multiple target worktrees registered for ${workOrderId}`);
  return entries[0];
};
export const registeredOrder = (launchpad, cwd) => {
  const top = runGit(cwd, ["rev-parse", "--show-toplevel"], {
    onFailure: () => undefined,
  });
  if (!top) return undefined;
  const entry = readMap(targetRegistryPath(launchpad))[physicalDirectory(top)];
  if (!entry || entry.launchpad !== directoryIdentity(launchpad))
    return undefined;
  const branch = runGit(top, ["symbolic-ref", "--quiet", "--short", "HEAD"], {
    onFailure: () => undefined,
  });
  if (branch !== `wo-${entry.workOrderId?.slice(3)}`)
    throw new Error("registered target worktree branch differs from its order");
  return entry.workOrderId;
};
