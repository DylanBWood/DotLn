import {
  constants,
  copyFileSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve, sep } from "node:path";
import { runGitPathList } from "./git.mjs";
import { classifyIgnoredMaterial, inspectNestedRepository } from "./paths.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const stat = (path) => lstatSync(path, { throwIfNoEntry: false });
const controlRoot = "docs/control/local";
const preservationProofs = new WeakMap();

// Inspect every component, including dangling and in-checkout symlinks.
function contained(root, path) {
  const absolute = resolve(root, path);
  if (!absolute.startsWith(root + sep))
    throw new Error("Preservation path must remain within its checkout");
  const components = relative(root, absolute).split(sep);
  let current = root;
  for (const [index, component] of components.entries()) {
    current = join(current, component);
    const item = stat(current);
    if (item?.isSymbolicLink())
      throw new Error("Worktree preservation refuses a symlink escape");
    if (item && index < components.length - 1 && !item.isDirectory())
      throw new Error("Preservation ancestor is not a directory");
  }
  return absolute;
}

function inventory(source, retainedControl) {
  const roots = ["docs/intake", ...(retainedControl ? [controlRoot] : [])];
  const ignored = new Set(
    runGitPathList(source, [
      "ls-files",
      "-z",
      "--others",
      "--ignored",
      "--exclude-standard",
      "--",
      ...roots,
    ]),
  );
  const result = [];
  const nestedRepositories = [];
  let discarded = 0;
  const file = (path, lane, absolute, item) => {
    if (!item.isFile())
      throw new Error("Preservation source is not a regular file");
    const bytes = readFileSync(absolute);
    result.push({
      source: path,
      kind: "file",
      lane,
      bytes: bytes.length,
      sha256: digest(bytes),
    });
  };
  // Git never lists the inside of a nested repository, so a unit walks every
  // entry itself; the same symlink and regular-file refusals apply within it.
  const unit = (path, lane) => {
    const absolute = contained(source, path),
      item = stat(absolute);
    if (!item) return;
    if (item.isDirectory()) {
      result.push({ source: path, kind: "directory", lane });
      for (const name of readdirSync(absolute).sort())
        unit(`${path}/${name}`, lane);
    } else file(path, lane, absolute, item);
  };
  const walk = (path, lane) => {
    if (lane === "control" && classifyIgnoredMaterial(path).disposable) return;
    const absolute = contained(source, path),
      item = stat(absolute);
    if (!item) return;
    if (item.isDirectory()) {
      if (ignored.has(`${path}/`) || stat(join(absolute, ".git"))) {
        const nested = inspectNestedRepository(source, `${path}/`);
        if (nested.repository && nested.empty && lane === "control") {
          nestedRepositories.push({
            source: path,
            lane,
            disposition: "empty-scaffolding",
          });
          discarded++;
          return;
        }
        nestedRepositories.push({
          source: path,
          lane,
          disposition: "preserved-unit",
        });
        unit(path, lane);
        return;
      }
      const start = result.length,
        discardedBefore = discarded;
      result.push({ source: path, kind: "directory", lane });
      for (const name of readdirSync(absolute).sort())
        walk(`${path}/${name}`, lane);
      // Neither the control root nor a directory that held only discarded
      // scaffolding is archived as an empty directory.
      if (
        result.length === start + 1 &&
        (path === controlRoot || discarded > discardedBefore)
      )
        result.pop();
    } else if (ignored.has(path)) file(path, lane, absolute, item);
  };
  for (const path of roots)
    walk(path, path === controlRoot ? "control" : "intake");
  return { entries: result, nestedRepositories };
}
const entries = (source, retainedControl) =>
  inventory(source, retainedControl).entries;

function requireIgnored(main, paths) {
  if (!paths.length) return;
  const ignored = new Set(
    runGitPathList(main, ["check-ignore", "--no-index", "--stdin", "-z"], {
      input: paths.join("\0") + "\0",
    }),
  );
  if (paths.some((path) => !ignored.has(path)))
    throw new Error("Preservation destinations must remain ignored in main");
  const tracked = runGitPathList(main, [
    "--literal-pathspecs",
    "ls-files",
    "-z",
    "--",
    ...paths,
  ]);
  if (tracked.length)
    throw new Error("Preservation destination is tracked in main");
}

function plan(source, main, workOrder, retainedControl) {
  const files = [],
    directories = [],
    mappings = new Map(),
    used = new Map();
  const { entries: rows, nestedRepositories } = inventory(
    source,
    retainedControl,
  );
  for (const entry of rows) {
    const parent = mappings.get(dirname(entry.source));
    const initial = parent
      ? `${parent}/${entry.source.slice(dirname(entry.source).length + 1)}`
      : entry.lane === "control"
        ? `${controlRoot}/retained/${workOrder}`
        : entry.source;
    let destination = initial,
      ordinal = 0;
    for (;;) {
      const target = contained(main, destination),
        existing = stat(target),
        reserved = used.get(destination);
      const compatible =
        entry.kind === "directory"
          ? existing?.isDirectory() &&
            (!reserved || reserved.kind === "directory")
          : existing?.isFile() &&
            digest(readFileSync(target)) === entry.sha256 &&
            (!reserved || reserved.sha256 === entry.sha256);
      if ((!existing && !reserved) || compatible) break;
      ordinal++;
      destination = `${initial}.from-${workOrder}${ordinal > 1 ? `-${ordinal}` : ""}`;
    }
    used.set(destination, entry);
    const row = {
      ...entry,
      destination,
      disposition: stat(join(main, destination))
        ? "identical"
        : destination !== initial
          ? "collision-preserved"
          : "copied",
    };
    if (entry.kind === "directory") {
      mappings.set(entry.source, destination);
      directories.push(row);
    } else files.push(row);
  }
  requireIgnored(
    main,
    files.map((row) => row.destination),
  );
  return { files, directories, nestedRepositories };
}

export function verifyPreservedMaterial(source, main, receipt) {
  source = realpathSync(source);
  main = realpathSync(main);
  const current = entries(source, receipt.retainedControl);
  const expected = new Map(
    [...receipt.directories, ...receipt.files].map((row) => [row.source, row]),
  );
  const proofs = preservationProofs.get(receipt);
  if (
    !proofs ||
    current.length !== expected.size ||
    current.some(
      (entry) =>
        expected.get(entry.source)?.kind !== entry.kind ||
        proofs.get(entry.source) !== entry.sha256,
    )
  )
    throw new Error(
      "Worktree material changed during preservation; source retained",
    );
  requireIgnored(
    main,
    receipt.files.map((row) => row.destination),
  );
  for (const row of receipt.directories)
    if (!stat(contained(main, row.destination))?.isDirectory())
      throw new Error("Preserved directory is missing; source retained");
  for (const row of receipt.files) {
    const from = contained(source, row.source),
      to = contained(main, row.destination);
    if (
      !stat(from)?.isFile() ||
      !stat(to)?.isFile() ||
      digest(readFileSync(from)) !== proofs.get(row.source) ||
      !readFileSync(from).equals(readFileSync(to))
    )
      throw new Error("Preservation byte proof failed; source retained");
  }
}

/** Exclusive copies never replace state. Partial copies are retained; a retry
 * chooses a collision path. Sources survive until the caller's guarded teardown.
 */
function reconcile(
  source,
  main,
  workOrder,
  { dryRun = false, retainedControl = false, copyFile = copyFileSync } = {},
) {
  if (!/^WO-\d{3}$/.test(workOrder))
    throw new Error("Worktree preservation needs its work order");
  source = realpathSync(source);
  main = realpathSync(main);
  const planned =
    source === main
      ? { files: [], directories: [], nestedRepositories: [] }
      : plan(source, main, workOrder, retainedControl);
  const proofs = new Map(planned.files.map((row) => [row.source, row.sha256]));
  const receipt = {
    workOrder,
    dryRun,
    retainedControl,
    directories: planned.directories,
    files: planned.files.map(({ sha256, ...row }) => row),
    nestedRepositories: planned.nestedRepositories,
    bytes: planned.files.reduce((sum, row) => sum + row.bytes, 0),
  };
  preservationProofs.set(receipt, proofs);
  if (dryRun || source === main) return receipt;
  for (const row of receipt.directories)
    mkdirSync(contained(main, row.destination), {
      recursive: true,
      mode: 0o700,
    });
  for (const row of receipt.files) {
    const from = contained(source, row.source),
      to = contained(main, row.destination);
    if (digest(readFileSync(from)) !== proofs.get(row.source))
      throw new Error(
        "Worktree material changed during preservation; source retained",
      );
    if (!stat(to)) {
      mkdirSync(dirname(to), { recursive: true, mode: 0o700 });
      copyFile(from, to, constants.COPYFILE_EXCL);
    }
    if (!stat(to)?.isFile() || !readFileSync(from).equals(readFileSync(to)))
      throw new Error("Preservation byte proof failed; source retained");
  }
  verifyPreservedMaterial(source, main, receipt);
  return receipt;
}

export const reconcileIntake = (source, main, workOrder, options = {}) =>
  reconcile(source, main, workOrder, options);
export const reconcileWorktreeMaterial = (
  source,
  main,
  workOrder,
  options = {},
) => reconcile(source, main, workOrder, { ...options, retainedControl: true });

export function renderIntakeReconciliation(receipt) {
  const label = receipt.retainedControl
    ? "Worktree preservation"
    : "Intake reconciliation";
  return (
    [
      `${label}${receipt.dryRun ? " preview" : " receipt"}: ${receipt.files.length} files, ${receipt.directories.length} directories, ${receipt.bytes} bytes; source retained until worktree removal.`,
      ...(receipt.nestedRepositories ?? []).map(
        (row) =>
          `  ${JSON.stringify(row.source)}: nested repository ${row.disposition === "empty-scaffolding" ? "discarded as empty fixture scaffolding (only .git, no commit)" : "preserved as a directory unit"}`,
      ),
      ...[...receipt.directories, ...receipt.files].map(
        (row) =>
          `  ${JSON.stringify(row.source)} -> ${JSON.stringify(row.destination)}: ${row.disposition}${row.kind === "directory" ? ", directory" : `, ${row.bytes} bytes`}`,
      ),
    ].join("\n") + "\n"
  );
}
