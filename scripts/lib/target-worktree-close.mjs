import {
  createScratchRoot,
  removeTemporaryPath as rmSync,
} from "./temporary-roots.mjs";
import { createHash } from "node:crypto";
import {
  existsSync,
  accessSync,
  constants,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { docPath, loadConfig } from "./config.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  assertFinderMetadataTypes,
  isFinderMetadata,
} from "./finder-metadata.mjs";
import { readGateChecks } from "./gate-evidence.mjs";
import { HOST_GIT_READ, fetchIntoCheckout } from "./github-repository.mjs";
import {
  addRemovalChild,
  closeBlocker,
  timeRemovalChild,
} from "./release-steps.mjs";
import { boundTemporaryRoots } from "./temporary-prune.mjs";
import {
  journalMoveSources,
  retainWorktreeJournals,
} from "./worktree-removal.mjs";
import {
  parseWorktrees,
  redactPaths,
  runGit,
  runGitPathList,
  selectGitPaths,
  releaseCloseCommand,
  spawnGit,
  worktreeHasCheckout,
} from "./git.mjs";
import {
  forgetTargetWorktree,
  physicalDirectory,
  removeOrderHostRules,
  targetWorktreeForOrder,
  validateOrderHostRules,
} from "./target-worktrees.mjs";
import { dispatchJournalDirectory } from "../../packages/skeleton/src/dispatch-journal.mjs";
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
const closeReadFailure = (error, root, label, rerun) =>
  new Error(
    `${label} cannot close: ${/16 MiB/u.test(String(error.message)) ? "Git path listing exceeds the 16 MiB limit; reduce the listed output" : `${quoteGitFailure(error, root, label)}; fix what Git reports`}; source retained. Then rerun ${rerun()}`,
  );
const listedPaths = (root, args, label, rerun) => {
  try {
    return gitPaths(root, args);
  } catch (error) {
    throw closeReadFailure(error, root, label, rerun);
  }
};
// A Git read the cleanliness judgment depends on refuses as that judgment
// does: by the tree's role, quoting what Git reports.
const cleanRead = (root, label, rerun, read) => {
  try {
    return read();
  } catch (error) {
    if (/16 MiB/u.test(String(error.message)))
      throw closeReadFailure(error, root, label, rerun);
    throw new Error(
      `${label} cannot close: ${quoteGitFailure(error, root, label)}; source retained. Fix what Git reports, then rerun ${rerun()}`,
    );
  }
};
const untrackedPaths = (root, label, rerun) =>
  cleanRead(root, label, rerun, () =>
    gitPaths(root, ["ls-files", "-z", "--others", "--exclude-standard"]),
  );
const closeClean = (
  root,
  label,
  rerun,
  { ignored = new Set(), candidates } = {},
) => {
  const tracked = cleanRead(root, label, rerun, () =>
    git(root, ["status", "--porcelain", "--untracked-files=no"]),
  );
  const untracked = candidates ?? untrackedPaths(root, label, rerun);
  const foreign = untracked.filter(
    (file) => !isFinderMetadata(root, file) && !ignored.has(file),
  );
  if (tracked || foreign.length)
    throw closeBlocker(
      "not-clean",
      `${label} is not clean (${tracked.split("\n")[0] || foreign[0]}); source retained. Clean it, then rerun ${rerun()}`,
    );
  return untracked;
};

// A declared disposable entry is a path or a pattern with two wildcard forms:
// `**` as a whole segment matches any number of segments, and `*` matches any
// characters within one segment, a leading dot included. A path lies under an
// entry when a leading run of its segments matches the whole entry; the
// shortest such run is the match's root, so `**/node_modules` names
// `libs/a/node_modules` once for every file below it, and a `node_modules`
// nested inside that one is part of it.
const isPattern = (entry) => entry.includes("*");
const segmentMatches = (pattern, name) => {
  if (!pattern.includes("*")) return pattern === name;
  const parts = pattern.split("*");
  const first = parts[0],
    last = parts.at(-1);
  if (
    name.length < first.length + last.length ||
    !name.startsWith(first) ||
    !name.endsWith(last)
  )
    return false;
  const end = name.length - last.length;
  let at = first.length;
  for (const part of parts.slice(1, -1)) {
    const found = name.indexOf(part, at);
    if (found < 0 || found + part.length > end) return false;
    at = found + part.length;
  }
  return true;
};

/** The root under which a listed path matches one declared entry, or null.
 * @param {string} entry @param {string} file */
export const disposableMatchRoot = (entry, file) => {
  const path = file.replace(/\/+$/u, "");
  if (!isPattern(entry))
    return path === entry || path.startsWith(`${entry}/`) ? entry : null;
  const pattern = entry.split("/"),
    segments = path.split("/");
  const seen = new Map();
  // The fewest path segments from `at` on that the entry's segments from
  // `index` on match whole, as the end index, or -1. Trying the shorter run
  // for each `**` first finds the shortest match.
  const end = (index, at) => {
    if (index === pattern.length) return at;
    const key = index * (segments.length + 1) + at;
    if (seen.has(key)) return seen.get(key);
    let found = -1;
    if (pattern[index] === "**")
      for (let next = at; next <= segments.length && found < 0; next++)
        found = end(index + 1, next);
    else if (
      at < segments.length &&
      segmentMatches(pattern[index], segments[at])
    )
      found = end(index + 1, at + 1);
    seen.set(key, found);
    return found;
  };
  const length = end(0, 0);
  return length > 0 ? segments.slice(0, length).join("/") : null;
};

// A path under a declared disposable entry is regenerable output.
const underDisposable = (disposable, file) =>
  disposable.some((entry) => disposableMatchRoot(entry, file) !== null);

// The directories a deletion inspects and prunes: each literal entry, and each
// root a pattern matched among the listed paths, with the entry that named it.
const disposableRoots = (files, disposable) => {
  const roots = new Map();
  for (const entry of disposable)
    if (!isPattern(entry)) roots.set(entry, entry);
    else
      for (const file of files) {
        const root = disposableMatchRoot(entry, file);
        if (root !== null && !roots.has(root)) roots.set(root, entry);
      }
  return [...roots.keys()]
    .sort()
    .map((path) => ({ path, entry: roots.get(path) }));
};

// The files and bytes a path holds, never following a link.
const measure = (path) => {
  const info = lstatSync(path, { throwIfNoEntry: false });
  if (!info) return { files: 0, bytes: 0 };
  if (!info.isDirectory() || info.isSymbolicLink())
    return { files: 1, bytes: info.size };
  const total = { files: 0, bytes: 0 };
  for (const name of readdirSync(path)) {
    const child = measure(join(path, name));
    total.files += child.files;
    total.bytes += child.bytes;
  }
  return total;
};

// Which of `paths` the ignore rules of one committed tree ignore: the tree's
// .gitignore blobs are laid out in a scratch repository and judged there, so
// the pre-fast-forward working copy's rules never decide.
const ignoredByTree = (clone, commit, paths) => {
  if (!paths.length) return new Set();
  const rules = selectGitPaths(
    clone,
    [...HOST_GIT_READ, "ls-tree", "-r", "--name-only", "-z", commit],
    (file) => file === ".gitignore" || file.endsWith("/.gitignore"),
  );
  const scratch = createScratchRoot(join(tmpdir(), "dotln-target-ignore-"));
  try {
    // Only committed ignore blobs supply policy: neither an init template's
    // info/exclude nor the operator's global excludes may authorize deletion.
    git(scratch, ["init", "--quiet", "--template="]);
    for (const file of rules) {
      mkdirSync(dirname(join(scratch, file)), { recursive: true });
      writeFileSync(
        join(scratch, file),
        runGit(clone, [...HOST_GIT_READ, "show", `${commit}:${file}`], {
          trim: false,
        }),
      );
    }
    const judged = spawnGit(
      [
        "-C",
        scratch,
        ...HOST_GIT_READ,
        "-c",
        "core.excludesFile=",
        "check-ignore",
        "--no-index",
        "-z",
        "--stdin",
      ],
      {
        input: `${paths.join("\0")}\0`,
        encoding: "utf8",
        // The output is a subset of the candidate paths; match the 16 MiB
        // ceiling of runGitPathList, which reads those candidates.
        maxBuffer: 16 * 1024 * 1024,
      },
    );
    if (judged.error || ![0, 1].includes(judged.status))
      throw new Error(
        `base ignore judgment unavailable: ${judged.error?.code ?? (judged.stderr.trim() || `git check-ignore exited ${judged.status}`)}`,
      );
    return new Set(judged.stdout.split("\0").filter(Boolean));
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
};

// Delete the listed files and prune the directories they leave empty under
// each disposable root; a root that still holds other files stays. The files
// and bytes deleted are counted into `deleted` as each goes, so a deletion
// that stops part way still records what it removed.
const deleteDisposable = (
  root,
  files,
  roots,
  label,
  rerun,
  deleted = { files: 0, bytes: 0 },
) => {
  const removing = (path, remove) => {
    try {
      remove();
    } catch (error) {
      if (String(error.message).startsWith(`${label} cannot close:`))
        throw error;
      const relative = path.slice(root.length + 1) || ".";
      const directory = dirname(relative);
      throw closeBlocker(
        "declared-root-unreadable",
        `${label} cannot close: disposable directory ${directory} could not remove ${relative} (${error.code ?? "filesystem-error"}); no further deletion attempted. Restore directory access or remove an immutable flag (chflags nouchg), then rerun ${rerun()}`,
      );
    }
  };
  // A listed directory, such as a nested repository, is walked without
  // following links, so each file counts as it is removed.
  const removeEntry = (path) => {
    const info = lstatSync(path, { throwIfNoEntry: false });
    if (!info) return;
    if (info.isDirectory() && !info.isSymbolicLink()) {
      for (const name of readdirSync(path).sort())
        removeEntry(join(path, name));
      rmdirSync(path);
      return;
    }
    unlinkSync(path);
    deleted.files += 1;
    deleted.bytes += info.size;
  };
  for (const file of files) {
    const path = join(root, file);
    removing(path, () => removeEntry(path));
  }
  const prune = (directory) =>
    removing(directory, () => {
      const info = lstatSync(directory, { throwIfNoEntry: false });
      if (!info?.isDirectory() || info.isSymbolicLink()) return;
      for (const name of readdirSync(directory)) prune(join(directory, name));
      if (!readdirSync(directory).length) rmdirSync(directory);
    });
  for (const { path } of roots) prune(join(root, path));
  return deleted;
};

// Each declared entry with the count of files deleted under it; a pattern
// also lists each root it matched with that root's file count.
const disposableRows = (files, disposable) =>
  disposable
    .map((entry) => {
      const matches = new Map();
      for (const file of files) {
        const root = disposableMatchRoot(entry, file);
        if (root !== null) matches.set(root, (matches.get(root) ?? 0) + 1);
      }
      return {
        path: entry,
        files: [...matches.values()].reduce((sum, count) => sum + count, 0),
        ...(isPattern(entry)
          ? {
              matches: [...matches.keys()]
                .sort()
                .map((path) => ({ path, files: matches.get(path) })),
            }
          : {}),
      };
    })
    .filter((row) => row.files);

// Every disposable root is judged before anything is deleted: no component on
// the way to it may be a link or leave the tree, and each directory under it
// needs the access its deletion takes. A root a pattern matched is named with
// that pattern.
const inspectDisposable = (root, roots, label, rerun, writable = true) => {
  const inspect = (directory) => {
    const info = lstatSync(directory, { throwIfNoEntry: false });
    if (!info?.isDirectory() || info.isSymbolicLink()) return;
    try {
      accessSync(
        directory,
        constants.R_OK | constants.X_OK | (writable ? constants.W_OK : 0),
      );
    } catch {
      throw closeBlocker(
        "declared-root-unreadable",
        `${label} cannot close: declared directory ${directory.slice(root.length + 1) || "."} needs ${writable ? "write, read and search" : "read and search"} access; source retained. Restore access, then rerun ${rerun()}`,
      );
    }
    for (const name of readdirSync(directory)) inspect(join(directory, name));
  };
  for (const { path: declared, entry } of roots) {
    const named =
      entry === declared ? declared : `${declared} (matched by ${entry})`;
    let directory = root;
    for (const segment of declared.split("/")) {
      directory = join(directory, segment);
      const info = lstatSync(directory, { throwIfNoEntry: false });
      if (!info) break;
      if (
        info.isSymbolicLink() ||
        !realpathSync(directory).startsWith(`${root}/`)
      )
        throw closeBlocker(
          "declared-root-unreadable",
          `${label} cannot close: declared root ${named} has a symlinked component; source retained. Correct the registration or path, then rerun ${rerun()}`,
        );
    }
    inspect(join(root, declared));
    if (writable && existsSync(join(root, declared))) {
      try {
        accessSync(
          dirname(join(root, declared)),
          constants.W_OK | constants.X_OK,
        );
      } catch {
        throw closeBlocker(
          "declared-root-unreadable",
          `${label} cannot close: parent of declared root ${named} needs write and search access; source retained. Restore access, then rerun ${rerun()}`,
        );
      }
    }
  }
};

// The kit's own writes in a target, the only material besides declared output
// the close removes there: what a session recorded in the fixed harness lane,
// moved into main's retained lane for the order as a launchpad worktree's
// journals and change reviews are; a writer directory the writer protocol
// proves released; and the kit's entries under .runtime/, the Spotlight marker
// markUnindexed writes, a harness snapshot and the temporary-root ledger's
// segments. Any other file in those directories is judged like any other path.
const residueMarker = ".runtime/.metadata_never_index";
const residueSnapshot = /^(\.runtime\/harness\/[a-f0-9]{16})\//u;
const residueSnapshotFile = /^(\.runtime\/harness\/[a-f0-9]{16})\/(.+)$/u;
const residueLedger =
  /^\.runtime\/temporary-roots\/roots\/[a-f0-9-]{36}\.jsonl$/u;
const residueLedgerDirectory = ".runtime/temporary-roots/roots";
// The writer protocol's directory in that fixed lane, relative to the target.
const residueWriter = join(dispatchJournalDirectory("."), "writer");
const regularFile = (path) => {
  const info = lstatSync(path, { throwIfNoEntry: false });
  return Boolean(info?.isFile() && !info.isSymbolicLink());
};
const realDirectories = (root, relativePath) => {
  let at = root;
  for (const segment of relativePath.split("/")) {
    at = join(at, segment);
    const info = lstatSync(at, { throwIfNoEntry: false });
    if (!info?.isDirectory() || info.isSymbolicLink()) return false;
  }
  return true;
};
// The verified content of each harness snapshot the listing names, keyed by
// its content-addressed name: for each path inside it, a package file's size
// and digest, a package link's target, or the record of its name input. The
// snapshot a launchpad runtime serving the target installs now is computed
// from that runtime's own package source, as the emit computes it. Any other
// snapshot, one an earlier runtime installed, proves itself by content
// (provenRuntimeSnapshot): by the record its installer wrote, whose bytes hash
// to the directory's name, or, for one installed before records were written,
// by its own package files reproducing that name with a serving runtime's
// pinned file list. A directory's name alone proves nothing, and neither does
// a file placed in it; a runtime that cannot be read verifies nothing.
const verifiedSnapshots = (target, listed, runtimeRoots, harness) => {
  const snapshots = new Map();
  const lists = [];
  for (const runtimeRoot of runtimeRoots) {
    let installation;
    try {
      installation = harness.harnessInstallation({ runtimeRoot });
    } catch {
      continue;
    }
    lists.push(installation.runtimeFiles);
    const snapshot = installation.runtimeSnapshot;
    if (snapshot && !snapshots.has(snapshot))
      snapshots.set(
        snapshot,
        harness.runtimeSnapshotContent(
          installation.runtimeFiles,
          installation.runtimeInventory,
        ),
      );
  }
  const named = new Set(
    listed.map((file) => residueSnapshot.exec(file)?.[1]).filter(Boolean),
  );
  for (const snapshot of named) {
    if (snapshots.has(snapshot)) continue;
    const input = harness.provenRuntimeSnapshot(target, snapshot, lists);
    if (input)
      snapshots.set(
        snapshot,
        harness.runtimeSnapshotContent(input.files, input.inventory),
      );
  }
  return snapshots;
};
// A file is the kit's harness snapshot only when a verified snapshot of that
// name lists its path with the same size and digest, or the same link
// target, and every directory above it is a real directory.
const snapshotEntry = (target, file, snapshots) => {
  const [, snapshot, inside] = residueSnapshotFile.exec(file) ?? [];
  const expected = snapshots.get(snapshot)?.get(inside);
  if (!expected || !realDirectories(target, dirname(file))) return false;
  const path = join(target, file);
  const own = lstatSync(path, { throwIfNoEntry: false });
  if (expected.kind === "link")
    return (
      Boolean(own?.isSymbolicLink()) && readlinkSync(path) === expected.target
    );
  return (
    Boolean(own?.isFile()) &&
    own.size === expected.bytes &&
    createHash("sha256").update(readFileSync(path)).digest("hex") ===
      expected.sha256
  );
};
// A ledger segment the kit wrote opens with the row of the token its name
// carries.
const ledgerSegment = (path, file) => {
  if (!regularFile(path)) return false;
  try {
    const first = JSON.parse(readFileSync(path, "utf8").split("\n", 1)[0]);
    return first?.token === basename(file, ".jsonl");
  } catch {
    return false;
  }
};
const targetResidue = (main, target, workOrderId, listed, verified) => {
  const journals = new Set(journalMoveSources(main, target, workOrderId));
  const paths = new Set(),
    snapshots = new Map(),
    ledger = [];
  let marker = null;
  for (const file of listed) {
    const snapshot = residueSnapshot.exec(file)?.[1];
    if (journals.has(file)) paths.add(file);
    else if (
      file === residueMarker &&
      regularFile(join(target, file)) &&
      lstatSync(join(target, file)).size === 0
    ) {
      // markUnindexed writes this marker empty.
      paths.add(file);
      marker = file;
    } else if (
      snapshot &&
      !file.endsWith("/") &&
      snapshotEntry(target, file, verified)
    ) {
      // Only the snapshot's listed files: a tracked file there is the
      // repository's, and a listed directory, such as an untracked nested
      // repository, is judged like any other path.
      paths.add(file);
      snapshots.set(snapshot, [...(snapshots.get(snapshot) ?? []), file]);
    } else if (
      residueLedger.test(file) &&
      ledgerSegment(join(target, file), file)
    ) {
      paths.add(file);
      ledger.push(file);
    }
  }
  // A snapshot's record goes last, so a deletion that stops part way leaves
  // the rest of that snapshot provable by its record on the next attempt; a
  // snapshot proven without its record carries the record's text, which
  // deleteResidue writes there before deleting any of it.
  const recordLast = (path) => (a, b) => {
    const record = (file) =>
      verified.get(path)?.get(file.slice(path.length + 1))?.record ? 1 : 0;
    return record(a) - record(b) || (a < b ? -1 : a > b ? 1 : 0);
  };
  const snapshotRow = ([path, files]) => {
    const [inside, entry] =
      [...(verified.get(path) ?? [])].find(([, value]) => value.record) ?? [];
    const record = inside && `${path}/${inside}`;
    return {
      path,
      files: files.sort(recordLast(path)),
      ...(record && !files.includes(record)
        ? { record: { path: record, text: entry.text } }
        : {}),
    };
  };
  return {
    paths,
    journals: journals.size,
    marker,
    snapshots: [...snapshots]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(snapshotRow),
    ledger: ledger.sort(),
    // Only a writer directory reached through real directories inside the
    // target: one a tracked link reaches lies wherever the link points.
    writer:
      realDirectories(target, residueWriter) &&
      !readdirSync(join(target, residueWriter)).length
        ? residueWriter
        : null,
  };
};

// Removes the directories under `directory` that hold nothing, and then
// `directory` itself when it is left empty, never following a link.
const pruneEmpty = (directory) => {
  const info = lstatSync(directory, { throwIfNoEntry: false });
  if (!info?.isDirectory() || info.isSymbolicLink()) return;
  for (const name of readdirSync(directory)) pruneEmpty(join(directory, name));
  if (!readdirSync(directory).length) rmdirSync(directory);
};
const residueRefusal = (kind, path, error, rerun) =>
  closeBlocker(
    "declared-root-unreadable",
    `target worktree cannot close: the kit's ${kind} ${path} could not be removed (${error.code ?? "filesystem-error"}); source retained. Restore directory access, then rerun ${rerun()}`,
  );

// Deletes the residue the judgment named, after the journals have moved, all
// but the temporary-root ledger, which takeLedger removes last. Only the
// listed files go, one at a time, each counted into `deleted` as it goes, and
// only directories left empty after them are removed, so a tracked file or
// anything else a snapshot directory holds stays. Each row is added once its
// entry is gone, so a deletion that stops part way still records what it
// removed; a preview names what it would delete, the ledger included.
const deleteResidue = (
  target,
  residue,
  {
    dryRun,
    rerun,
    rows = [],
    deleted = { files: 0, bytes: 0 },
    declared = new Set(),
  },
) => {
  const refusal = (kind, path, error) =>
    residueRefusal(kind, path, error, rerun);
  // A file the close wrote itself (`uncounted`) is deleted with the rest but
  // never counted among the target's files.
  const remove = (kind, path, files, after = () => {}, uncounted = null) => {
    const size = { files: 0, bytes: 0 };
    try {
      for (const file of files) {
        const measured = measure(join(target, file));
        if (!dryRun) unlinkSync(join(target, file));
        if (file === uncounted) continue;
        if (!dryRun) {
          deleted.files += measured.files;
          deleted.bytes += measured.bytes;
        }
        size.files += measured.files;
        size.bytes += measured.bytes;
      }
      if (!dryRun) after();
    } catch (error) {
      throw refusal(kind, path, error);
    }
    rows.push({
      path,
      kind,
      ...size,
      outcome: dryRun ? "would-delete" : "deleted",
    });
  };
  if (residue.writer)
    remove("released writer", residue.writer, [], () =>
      rmdirSync(join(target, residue.writer)),
    );
  if (residue.marker)
    remove("Spotlight marker", residue.marker, [residue.marker]);
  for (const snapshot of residue.snapshots) {
    // A snapshot proven without its record gets one before any of its files
    // goes, deleted last, so a deletion that stops part way leaves the rest
    // provable on the next attempt even once no runtime would install it. A
    // file the listing names at that path is declared output, since the
    // judgment refused undeclared material, and is deleted first, counted
    // with the rest, to make way. The judgment already stopped the close for
    // a foreign file there that the listing does not name, and a record the
    // repository holds itself stays; nothing else there is replaced.
    let written = null;
    if (!dryRun && snapshot.record && realDirectories(target, snapshot.path))
      try {
        const path = join(target, snapshot.record.path);
        const present = lstatSync(path, { throwIfNoEntry: false });
        if (present && declared.has(snapshot.record.path)) {
          unlinkSync(path);
          deleted.files += 1;
          deleted.bytes += present.size;
        }
        if (!lstatSync(path, { throwIfNoEntry: false })) {
          writeFileSync(path, snapshot.record.text, { flag: "wx" });
          written = snapshot.record.path;
        }
      } catch (error) {
        throw refusal("harness snapshot", snapshot.path, error);
      }
    remove(
      "harness snapshot",
      snapshot.path,
      written ? [...snapshot.files, written] : snapshot.files,
      () => pruneEmpty(join(target, snapshot.path)),
      written,
    );
  }
  if (dryRun && residue.ledger.length)
    remove("temporary-root ledger", residueLedgerDirectory, residue.ledger);
  return rows;
};

// The temporary-root ledger binds each root it registers to the target while
// the target stands, and a prune believes a root's marker only as far as that
// ledger registers it. So the ledger leaves only with the target: takeLedger
// deletes its segments immediately before Git removes the worktree, timed and
// counted as the residue's deletion with the record's row, and keeps their
// bytes. Its putBack, called when that removal stops, writes each segment
// back as it was while the target directory stands, so every root the ledger
// registers stays as prunable as before the attempt, and takes them out of
// the deletion's counts; it never recreates a removed worktree, never writes
// through a link or over a file, and returns what it could not write back. A
// segment that cannot be deleted stops the close with those already taken
// written back.
const takeLedger = (target, files, { rerun, record, rows }) => {
  const taken = [];
  const size = (entries) =>
    entries.reduce((sum, { bytes }) => sum + bytes.length, 0);
  const putBack = () => {
    const root = lstatSync(target, { throwIfNoEntry: false });
    if (!taken.length || !root?.isDirectory() || root.isSymbolicLink())
      return null;
    const restored = [];
    let failure = null;
    try {
      let directory = target;
      for (const segment of residueLedgerDirectory.split("/")) {
        directory = join(directory, segment);
        const info = lstatSync(directory, { throwIfNoEntry: false });
        if (!info) mkdirSync(directory, { mode: 0o700 });
        else if (!info.isDirectory() || info.isSymbolicLink())
          throw Object.assign(new Error("not a directory"), {
            code: "ENOTDIR",
          });
      }
      for (const entry of taken) {
        writeFileSync(join(target, entry.file), entry.bytes, {
          flag: "wx",
          mode: 0o600,
        });
        restored.push(entry);
      }
    } catch (error) {
      failure = `; the kit's temporary-root ledger could not be written back (${error.code ?? "filesystem-error"}), so the roots it registered are carried in the close record alone`;
    }
    addRemovalChild(record, "disposable-deletion", 0, {
      files: -restored.length,
      bytes: -size(restored),
    });
    const row = rows.find((entry) => entry.kind === "temporary-root ledger");
    if (row && !failure) row.outcome = "restored";
    return failure;
  };
  if (!files.length) return { putBack };
  const started = performance.now();
  const counted = () =>
    addRemovalChild(
      record,
      "disposable-deletion",
      performance.now() - started,
      { files: taken.length, bytes: size(taken) },
    );
  try {
    for (const file of files) {
      const bytes = readFileSync(join(target, file));
      unlinkSync(join(target, file));
      taken.push({ file, bytes });
    }
    pruneEmpty(join(target, ".runtime/temporary-roots"));
  } catch (error) {
    counted();
    const refusal = residueRefusal(
      "temporary-root ledger",
      residueLedgerDirectory,
      error,
      rerun,
    );
    const lost = putBack();
    if (lost) refusal.message += lost;
    throw refusal;
  }
  counted();
  rows.push({
    path: residueLedgerDirectory,
    kind: "temporary-root ledger",
    files: taken.length,
    bytes: size(taken),
    outcome: "deleted",
  });
  return { putBack };
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
export const closeTargetWorktree = async (
  root,
  state,
  dryRun,
  record,
  { retryMode = dryRun ? "--dry-run" : "--publish" } = {},
) => {
  validateOrderHostRules(root, state.workOrderId);
  const entry = targetWorktreeForOrder(root, state.workOrderId);
  if (!entry) {
    const prior = [...(record.recoveryAttempts ?? record.previousAttempts)]
      .reverse()
      .find(
        (attempt) => attempt.targetCleanup?.outcome === "removed",
      )?.targetCleanup;
    if (!prior) throw new Error("target worktree registry entry is missing");
    record.targetCleanup = prior;
    if (!dryRun) removeOrderHostRules(root, state.workOrderId);
    return;
  }
  if (
    entry.repositoryId !== state.repositoryId ||
    entry.baseCommit !== state.baseCommit
  )
    throw new Error("target registry differs from the merged order");
  physicalDirectory(entry.clone);
  // The registration's disposable paths (class first, never removed) and the
  // gate's advisory of what commands wrote into the clone's base checkout.
  const registration = loadConfig(root).repositories[state.repositoryId];
  const disposable = registration?.disposable ?? [];
  const baseDisposablePolicy = registration?.baseDisposablePolicy ?? "delete";
  // The order's launchpad worktree holds the gate index until the launchpad
  // cleanup that follows this close; main's copy is the fallback.
  let baseCheckoutWrites;
  try {
    const gateRows = readGateChecks(
      existsSync(entry.launchpad) ? entry.launchpad : root,
    ).filter(
      (gateRow) =>
        gateRow.repositoryId === state.repositoryId &&
        typeof gateRow.checkId === "string" &&
        gateRow.checkId.startsWith(`target:${state.repositoryId}:`),
    );
    baseCheckoutWrites = gateRows.some(
      (gateRow) => gateRow.baseCheckoutWrites === null,
    )
      ? null
      : [
          ...new Set(
            gateRows
              .filter(
                (gateRow) =>
                  gateRow.repositoryId === state.repositoryId &&
                  typeof gateRow.checkId === "string" &&
                  gateRow.checkId.startsWith(`target:${state.repositoryId}:`) &&
                  Array.isArray(gateRow.baseCheckoutWrites),
              )
              .flatMap((gateRow) => gateRow.baseCheckoutWrites),
          ),
        ].sort();
  } catch {
    // This observation is advisory. An unreadable record says nothing about
    // base writes; the actual checkout still undergoes every close judgment.
    baseCheckoutWrites = null;
  }
  const row = (record.targetCleanup = {
    path: entry.target,
    branch: entry.branch,
    outcome: "retained",
    finderMetadata: {},
    disposable: { target: [], base: [] },
    baseCheckoutWrites,
    baseDisposablePolicy,
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
        `target bundle manifest is missing while installation ownership remains; source retained. Restore the installed ${manifestPath} and its bundle files before rerunning ${releaseCloseCommand(root, state.workOrderId, retryMode)}`,
      );
  };
  if (!existsSync(entry.target)) requireReleasedBundleOwnership();
  const {
    checkTargetHarness,
    harnessInstallation,
    provenRuntimeSnapshot,
    removeTargetHarness,
    runtimeSnapshotContent,
  } = await import("./harness.mjs");
  const rerun = () => releaseCloseCommand(root, state.workOrderId, retryMode);
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
  const locked = (directory, label, operation) => {
    try {
      return withWriterReservationLock(directory, operation);
    } catch (error) {
      if (
        /writer registration.*(?:in progress|requires inspection)/u.test(
          error.message,
        )
      )
        throw closeBlocker(
          "writer-held",
          `${label}: writer transition lock requires inspection; source retained. Confirm no registration or teardown is running, inspect the named lock through the writer diagnostics and remove only a proven abandoned lock, then rerun ${rerun()}`,
        );
      throw error;
    }
  };
  locked(mutationRoot, `target clone base ${entry.baseBranch}`, () => {
    const blocker = writerTeardownBlocker(mutationRoot);
    if (blocker)
      throw closeBlocker(
        "writer-held",
        `target clone base ${entry.baseBranch}: ${blocker}; source retained. Release that writer, then rerun ${rerun()}`,
      );
    // Fetch objects before updating any ref, so a failed fetch or a divergent
    // local base cannot partially change the clone's references. The base
    // checkout is judged by the fetched tree's ignore rules, so the fetch
    // comes first; no ref moves until the judgment passes.
    let fetched;
    try {
      const urls = git(entry.clone, [
        "config",
        "--get-all",
        "remote.origin.url",
      ]).split("\n");
      if (urls.length !== 1 || !urls[0])
        throw new Error("origin must have one fetch URL");
      fetched = timeRemovalChild(record, "base-fetch", () =>
        fetchIntoCheckout(entry.clone, urls[0], entry.baseBranch),
      );
    } catch (error) {
      // A local-path origin is named by role too; it may share the clone's
      // path as a prefix, so it is listed as well and the longer one wins.
      const origin = runGit(
        entry.clone,
        [...HOST_GIT_READ, "remote", "get-url", "origin"],
        { onFailure: () => "" },
      );
      throw closeBlocker(
        "base-fetch",
        `target clone base ${entry.baseBranch} cannot close: fetch failed: ${redactPaths(
          error.message,
          [
            [isAbsolute(origin) ? origin : "", "<target origin>"],
            [entry.clone, "<target clone>"],
          ],
        )}; source retained. ${error.boundMs ? `Run git fetch origin ${entry.baseBranch} in the target clone, whose commit this close then finds held` : "Fix the fetch"}, then rerun ${rerun()}`,
      );
    }
    let baseMetadata = [];
    let baseDisposable = [];
    if (baseCheckout) {
      const base = `target clone base ${entry.baseBranch}`;
      try {
        row.finderMetadata.base = timeRemovalChild(
          record,
          "finder-metadata",
          () => assertFinderMetadataTypes(baseCheckout),
        );
      } catch (error) {
        throw new Error(
          `${base} cannot close: ${error.message}. Then rerun ${rerun()}`,
        );
      }
      if (row.finderMetadata.base.skippedIgnoredDirectories.length)
        throw closeBlocker(
          "declared-root-unreadable",
          `${base} cannot close: cannot inspect ignored directories: ${row.finderMetadata.base.skippedIgnoredDirectories.join(", ")}; restore directory read and search access; source retained. Then rerun ${rerun()}`,
        );
      // Include paths ignored by the current checkout: only the fetched
      // tree decides which files are ignored, including files it stops
      // ignoring. An untracked file the fetched base ignores is judged like the
      // target's ignored material: under a declared disposable path it is
      // deleted; undeclared, it refuses with the registration remedy; a
      // file the fetched base does not ignore keeps the ordinary refusal.
      let ignored, candidates;
      try {
        candidates = gitPaths(baseCheckout, ["ls-files", "-z", "--others"]);
        ignored = ignoredByTree(entry.clone, fetched, candidates);
      } catch (error) {
        if (/16 MiB/u.test(String(error.message)))
          throw closeReadFailure(error, baseCheckout, base, rerun);
        throw new Error(
          `${base} cannot close: ${quoteGitFailure(error, baseCheckout, base)}; source retained. Fix what Git reports, then rerun ${rerun()}`,
        );
      }
      // Name the actual ignored file; a tracked ancestor is never a remedy.
      const undeclared = [
        ...new Set(
          [...ignored].filter(
            (file) =>
              !underDisposable(disposable, file) &&
              !isFinderMetadata(baseCheckout, file),
          ),
        ),
      ].sort();
      if (undeclared.length)
        throw closeBlocker(
          "undeclared-ignored-material",
          `${base} has undeclared ignored material; source retained: ${undeclared.slice(0, 20).join(", ")}${undeclared.length > 20 ? ` and ${undeclared.length - 20} more` : ""}. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun ${rerun()}`,
        );
      baseMetadata = closeClean(baseCheckout, base, rerun, {
        ignored,
        candidates,
      });
      baseDisposable = [...ignored].filter((file) =>
        underDisposable(disposable, file),
      );
      row.disposable.base = disposableRows(baseDisposable, disposable);
      if (baseDisposablePolicy === "judge-only" && candidates.length) {
        const originals = new Set(candidates),
          prefixes = new Set(candidates);
        for (const file of candidates) {
          const parts = file.split("/");
          while (parts.length > 1) {
            parts.pop();
            prefixes.add(parts.join("/"));
          }
        }
        let collisions;
        try {
          collisions = selectGitPaths(
            entry.clone,
            [...HOST_GIT_READ, "ls-tree", "-r", "--name-only", "-z", fetched],
            (file) => {
              if (prefixes.has(file)) return true;
              const parts = file.split("/");
              while (parts.length > 1) {
                parts.pop();
                if (originals.has(parts.join("/"))) return true;
              }
              return false;
            },
          );
        } catch (error) {
          throw closeReadFailure(error, baseCheckout, base, rerun);
        }
        if (collisions.length)
          throw new Error(
            `${base} judge-only output collides with fetched tracked paths: ${collisions.slice(0, 20).join(", ")}; source retained. Preserve that output outside those paths, then rerun ${rerun()}`,
          );
      }
      inspectDisposable(
        baseCheckout,
        disposableRoots(baseDisposable, disposable),
        base,
        rerun,
        baseDisposablePolicy === "delete",
      );
    }
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
    // Containment is judged against the fetched base. The local base moves
    // only after the target worktree is judged, so a close refused on the
    // target leaves the base checkout, its output and its branch untouched.
    const moveBase = () => {
      if (baseCheckout) {
        if (baseDisposablePolicy === "delete") {
          timeRemovalChild(record, "finder-metadata", () =>
            removeFinderMetadata(baseCheckout, baseMetadata),
          );
          // Timed and counted even when a removal stops part way.
          const deleted = { files: 0, bytes: 0 };
          const started = performance.now();
          try {
            deleteDisposable(
              baseCheckout,
              baseDisposable,
              disposableRoots(baseDisposable, disposable),
              `target clone base ${entry.baseBranch}`,
              rerun,
              deleted,
            );
          } finally {
            addRemovalChild(
              record,
              "disposable-deletion",
              performance.now() - started,
              deleted,
            );
          }
        }
        moveRef(baseCheckout, [
          "merge",
          "--ff-only",
          ...(baseDisposablePolicy === "judge-only"
            ? ["--no-overwrite-ignore"]
            : []),
          `origin/${entry.baseBranch}`,
        ]);
      } else if (localBase !== fetched)
        moveRef(entry.clone, [
          "fetch",
          "--no-tags",
          ".",
          `${fetched}:refs/heads/${entry.baseBranch}`,
        ]);
    };
    const containsBranch = () => {
      if (git(entry.clone, ["branch", "--list", entry.branch]))
        if (
          spawnGit([
            "-C",
            entry.clone,
            ...HOST_GIT_READ,
            "merge-base",
            "--is-ancestor",
            entry.branch,
            `origin/${entry.baseBranch}`,
          ]).status !== 0
        )
          throw new Error(
            `target branch ${entry.branch} is not merged into origin/${entry.baseBranch}; source retained. Merge the reviewed branch, then rerun ${rerun()}`,
          );
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
      locked(entry.target, "target worktree", () => {
        // A held writer stops the close before anything is judged or deleted.
        const blocker = writerTeardownBlocker(entry.target);
        if (blocker)
          throw closeBlocker(
            "writer-held",
            `target worktree: ${blocker}; source retained. Release that writer, then rerun ${rerun()}`,
          );
        const writer = join(lane, "writer");
        if (
          existsSync(join(lane, "writer.json")) ||
          (existsSync(writer) &&
            (!lstatSync(writer).isDirectory() || readdirSync(writer).length))
        )
          throw closeBlocker(
            "writer-held",
            `target writer reservation is not proven released; source retained. Release that writer, then rerun ${rerun()}`,
          );
        try {
          row.finderMetadata.target = timeRemovalChild(
            record,
            "finder-metadata",
            () => assertFinderMetadataTypes(entry.target),
          );
        } catch (error) {
          throw new Error(
            `target worktree cannot close: ${error.message}. Then rerun ${rerun()}`,
          );
        }
        const unreadableDisposable =
          row.finderMetadata.target.skippedIgnoredDirectories.filter(
            (directory) => underDisposable(disposable, directory),
          );
        if (unreadableDisposable.length)
          throw closeBlocker(
            "declared-root-unreadable",
            `target worktree cannot close: cannot inspect declared disposable directories: ${unreadableDisposable.join(", ")}; restore directory read and search access; source retained. Then rerun ${rerun()}`,
          );
        // Both listings are read once, and the kit's own residue is named in
        // them before either judgment, so neither refuses what the kit wrote.
        const untracked = untrackedPaths(
          entry.target,
          "target worktree",
          rerun,
        );
        const ignoredFiles = listedPaths(
          entry.target,
          ["ls-files", "-z", "--others", "--ignored", "--exclude-standard"],
          "target worktree",
          rerun,
        );
        // A snapshot is proven against what the launchpad runtime the
        // target's hooks load, then main's, would install, or by its own
        // content, and only when the listing names a snapshot path.
        const listed = [...untracked, ...ignoredFiles];
        const residue = targetResidue(
          root,
          entry.target,
          state.workOrderId,
          listed,
          listed.some((file) => residueSnapshot.test(file))
            ? verifiedSnapshots(
                entry.target,
                listed,
                [...new Set([entry.runtimeRoot, root].filter(Boolean))],
                {
                  harnessInstallation,
                  provenRuntimeSnapshot,
                  runtimeSnapshotContent,
                },
              )
            : new Map(),
        );
        // A snapshot proven without its record is given one before any of it
        // is deleted. A file the listing names at that path is judged like
        // any other: declared output is deleted and undeclared material is
        // refused below. One the listing does not name, such as a file the
        // repository tracks, would leave a stopped deletion's remainder
        // unprovable, so it stops the close before anything moves unless it
        // is the record itself, byte for byte, which is kept and serves.
        for (const snapshot of residue.snapshots) {
          const path =
            snapshot.record &&
            !listed.includes(snapshot.record.path) &&
            join(entry.target, snapshot.record.path);
          if (
            path &&
            lstatSync(path, { throwIfNoEntry: false }) &&
            !(
              regularFile(path) &&
              readFileSync(path, "utf8") === snapshot.record.text
            )
          )
            throw closeBlocker(
              "declared-root-unreadable",
              `target worktree cannot close: the kit's harness snapshot ${snapshot.path} holds ${snapshot.record.path}, a file the kit did not write at its record's path, so a deletion that stopped part way could not be proven again; source retained. Remove or rename that file in the target repository, then rerun ${rerun()}`,
            );
        }
        const metadata = closeClean(entry.target, "target worktree", rerun, {
          ignored: residue.paths,
          candidates: untracked,
        });
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
        // Declared regenerable output is deleted before the judgment of what
        // remains; nothing bundle-owned or kit-written is counted as
        // disposable, so the journals move even under a declared path.
        const targetDisposable = ignoredFiles.filter(
          (file) =>
            !owned.has(file) &&
            !residue.paths.has(file) &&
            underDisposable(disposable, file),
        );
        row.disposable.target = disposableRows(targetDisposable, disposable);
        const otherFiles = [
          ...ignoredFiles.filter(
            (file) =>
              !owned.has(file) &&
              !residue.paths.has(file) &&
              !isFinderMetadata(entry.target, file) &&
              !underDisposable(disposable, file),
          ),
          ...row.finderMetadata.target.skippedIgnoredDirectories
            .filter((directory) => !underDisposable(disposable, directory))
            .map((directory) => `${directory}/`),
        ];
        // Paths a named directory must not cover: installed files, the kit's
        // residue and declared output, which the close removes itself.
        const kept = [...owned, ...residue.paths, ...targetDisposable];
        const directories = listedPaths(
          entry.target,
          [
            "ls-files",
            "-z",
            "--others",
            "--ignored",
            "--exclude-standard",
            "--directory",
          ],
          "target worktree",
          rerun,
        ).filter(
          (directory) =>
            directory.endsWith("/") &&
            otherFiles.some((file) => file.startsWith(directory)) &&
            !kept.some((file) => file.startsWith(directory)),
        );
        // A removal remedy must never name an ancestor of any of those. Keep
        // each remaining path once, covered by its outermost safe directory.
        const other = [...new Set([...directories, ...otherFiles])]
          .filter(
            (file) =>
              !directories.some(
                (directory) => file !== directory && file.startsWith(directory),
              ),
          )
          .sort();
        if (other.length)
          throw closeBlocker(
            "undeclared-ignored-material",
            `target has undeclared ignored material; source retained: ${other.join(", ")}. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun ${releaseCloseCommand(root, state.workOrderId, retryMode)}`,
          );
        const roots = disposableRoots(targetDisposable, disposable);
        inspectDisposable(entry.target, roots, "target worktree", rerun);
        // The roots the target's temporary-root ledger registers outlive that
        // ledger in the close record: the close's own prune judges them, and
        // after the target is gone each is judged by its marker.
        const captured = residue.ledger.length
          ? boundTemporaryRoots(entry.target)
          : [];
        const known = new Set(
          (record.ownedTemporaryRoots ?? []).map((saved) => saved.path),
        );
        if (captured.length)
          record.ownedTemporaryRoots = [
            ...(record.ownedTemporaryRoots ?? []),
            ...captured.filter((saved) => !known.has(saved.path)),
          ];
        if (dryRun) {
          row.residue = {
            journals: retainWorktreeJournals(
              root,
              entry.target,
              state.workOrderId,
              { dryRun: true },
            ),
            deleted: deleteResidue(entry.target, residue, {
              dryRun: true,
              rerun,
            }),
            ledgerRoots: captured.length,
          };
          return;
        }
        // Declared output goes before the bundle, so a failure there retains
        // the bundle and a retry judges the same tree. The journals move
        // first, so a failed move deletes nothing.
        timeRemovalChild(record, "finder-metadata", () =>
          removeFinderMetadata(entry.target, [...metadata, ...ignoredFiles]),
        );
        const journals = timeRemovalChild(record, "journal-retention", () =>
          retainWorktreeJournals(root, entry.target, state.workOrderId),
        );
        row.residue = { journals, deleted: [], ledgerRoots: captured.length };
        // The kit's residue but its ledger, then declared output, timed and
        // counted even when a removal stops part way.
        const deleted = { files: 0, bytes: 0 };
        const started = performance.now();
        try {
          deleteResidue(entry.target, residue, {
            dryRun: false,
            rerun,
            rows: row.residue.deleted,
            deleted,
            declared: new Set(targetDisposable),
          });
          deleteDisposable(
            entry.target,
            targetDisposable,
            roots,
            "target worktree",
            rerun,
            deleted,
          );
        } finally {
          addRemovalChild(
            record,
            "disposable-deletion",
            performance.now() - started,
            deleted,
          );
        }
        if (installed)
          removeTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
        // The ledger goes last, so a removal that stops before Git's leaves
        // it untouched, and one that stops in Git's while the target stands
        // gets it back as it was.
        const ledger = takeLedger(entry.target, residue.ledger, {
          rerun,
          record,
          rows: row.residue.deleted,
        });
        try {
          timeRemovalChild(record, "git-worktree-remove", () =>
            git(entry.clone, ["worktree", "remove", entry.target]),
          );
        } catch (error) {
          const lost = ledger.putBack();
          if (lost) error.message += lost;
          throw error;
        }
        // The ref the opt-in draft route left in the clone goes with the
        // worktree.
        runGit(
          entry.clone,
          [
            ...HOST_GIT_READ,
            "update-ref",
            "-d",
            `refs/dotln/draft/${state.workOrderId}`,
          ],
          { onFailure: () => null },
        );
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
    moveBase();
    containsBranch();
    // Containment is proven against the declared base above. Git's ordinary
    // branch deletion checks HEAD, which may be detached at an older commit.
    if (git(entry.clone, ["branch", "--list", entry.branch]))
      timeRemovalChild(record, "branch-delete", () =>
        git(entry.clone, ["branch", "-D", entry.branch]),
      );
    // The literal-rule fallback's rules never outlive the order (WO-221).
    row.hostRules = removeOrderHostRules(root, state.workOrderId)
      ? "removed"
      : "none";
    if (existsSync(entry.launchpad))
      forgetTargetWorktree(entry.launchpad, entry.target);
    forgetTargetWorktree(root, entry.target);
    row.outcome = "removed";
  });
};
