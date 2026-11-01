import { createHash, randomUUID } from "node:crypto";
import {
  appendFileSync,
  chmodSync,
  closeSync,
  constants,
  copyFileSync,
  existsSync,
  lstatSync,
  linkSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { docRelative } from "./config.mjs";
import { parseWorktrees, runGitPathList } from "./git.mjs";
import { requireMaterialContainment } from "./worktree-material.mjs";
import { activeGateRuns } from "./gate-evidence.mjs";
import { prepareBeaconDisposal } from "./beacons.mjs";
import { materialSummary } from "./material-summary.mjs";
import {
  closedJournalEntry,
  ensureTemporaryRoot,
  TEMPORARY_OWNER_FILE,
} from "./temporary-roots.mjs";
import { dispatchJournalDirectory } from "../../packages/skeleton/src/dispatch-journal.mjs";
import {
  withWriterReservationLock,
  writerTeardownBlocker,
} from "../../packages/skeleton/src/writer-teardown.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fileDigest = (file) => {
  const hash = createHash("sha256");
  const descriptor = openSync(file, "r");
  const chunk = Buffer.alloc(64 * 1024);
  try {
    let count;
    while ((count = readSync(descriptor, chunk, 0, chunk.length, null)))
      hash.update(chunk.subarray(0, count));
    return hash.digest("hex");
  } finally {
    closeSync(descriptor);
  }
};
const regularDirectory = (subject) => {
  if (!lstatSync(subject).isDirectory() || lstatSync(subject).isSymbolicLink())
    throw new Error(`Subject is not a regular directory: ${subject}`);
  return realpathSync(subject);
};
const receiptPath = (main, workOrder, subject) =>
  docRelative(
    main,
    "control",
    `local/retained/${workOrder}/worktree-removal-${digest(Buffer.from(resolve(subject)))}.json`,
  );

/** Where a closed order's session journals outlive its worktree, relative to
 * main: an owned root of class closed-journal inside the order's retained lane.
 * @param {string} main @param {string} workOrder */
export const journalLane = (main, workOrder) =>
  docRelative(main, "control", `local/retained/${workOrder}/harness`);

// Publish whole bytes under a temporary name, so a stop never leaves a torn
// journal at its canonical name.
const replaceWhole = (file, bytes) => {
  const partial = `${file}.partial-${randomUUID()}`;
  try {
    writeFileSync(partial, bytes, { flag: "wx", mode: 0o600 });
    renameSync(partial, file);
  } finally {
    rmSync(partial, { force: true });
  }
};

/** Before release close removes a worktree, what its sessions recorded moves
 * into main's retained lane for the order: the session journals and other
 * logs, the session states and their sidecars, the gate index, and the
 * suite-success and deadline records, as listed by closedJournalEntry. Gate
 * captures, targets, excludes, the writer, the started markers and every link
 * stay and fall with the worktree or their own classes. The lane is an owned
 * root of class closed-journal whose window the prune judges. An existing lane
 * is merged, never replaced: a log gains the new rows, each append recorded in merges.jsonl so a retry
 * makes it once, the gate index takes the
 * union of its rows, an identical file is dropped, and a differing state keeps
 * its earlier bytes beside the newer one under a content-addressed name. A
 * rename across volumes falls back to copy then remove; any other failure
 * stops with the worktree intact, so a retried close merges what remains.
 * `rename` and `copyFile` are injectable so the failure paths can be exercised.
 * @param {string} main @param {string} subject @param {string} workOrder
 * @param {{dryRun?: boolean, rename?: typeof renameSync, copyFile?: typeof copyFileSync}} [options]
 * @returns {{lane: string|null, files: number, bytes: number, outcome: "moved"|"nothing"|"would-move"}} */
export function retainWorktreeJournals(
  main,
  subject,
  workOrder,
  { dryRun = false, rename = renameSync, copyFile = copyFileSync } = {},
) {
  main = realpathSync(main);
  if (!/^WO-\d{3}$/.test(workOrder))
    throw new Error("Journal retention requires a work order");
  const lane = journalLane(main, workOrder);
  requireMaterialContainment(main, lane);
  const destination = join(main, lane);
  const source = dispatchJournalDirectory(subject);
  const sourceInfo = lstatSync(source, { throwIfNoEntry: false });
  /** @type {Array<{from: string, to: string, size: number}>} */
  const moves = [];
  const plan = (from, to) => {
    const info = lstatSync(from);
    if (info.isDirectory() && !info.isSymbolicLink())
      for (const name of readdirSync(from).sort())
        plan(join(from, name), join(to, name));
    else if (info.isFile()) moves.push({ from, to, size: info.size });
  };
  if (sourceInfo?.isDirectory() && !sourceInfo.isSymbolicLink())
    for (const entry of readdirSync(source, { withFileTypes: true }))
      if (
        entry.name !== TEMPORARY_OWNER_FILE &&
        (entry.isDirectory() || entry.isFile()) &&
        closedJournalEntry(entry.name, entry.isDirectory())
      )
        plan(join(source, entry.name), join(destination, entry.name));
  // A file the repository tracks is its content, not a session's record: a
  // relocated configuration root can leave this fixed harness path unignored
  // and committed, and moving it would leave the worktree modified.
  if (moves.length) {
    const tracked = new Set(
      runGitPathList(subject, [
        "ls-files",
        "-z",
        "--",
        relative(subject, source),
      ]),
    );
    if (tracked.size)
      moves.splice(
        0,
        moves.length,
        ...moves.filter((move) => !tracked.has(relative(subject, move.from))),
      );
  }
  const counted = {
    files: moves.length,
    bytes: moves.reduce((sum, move) => sum + move.size, 0),
  };
  // Every write stays inside the lane: no destination or ancestor may be a
  // link, an existing destination must be a regular file, and so must the
  // lane's own source log. A preview refuses what the move would refuse.
  const sources = join(destination, "sources.jsonl");
  const merges = join(destination, "merges.jsonl");
  const requireDestination = (path) => {
    requireMaterialContainment(main, relative(main, path));
    const info = lstatSync(path, { throwIfNoEntry: false });
    if (info && !info.isFile())
      throw new Error(
        `Journal lane entry is not a regular file: ${relative(destination, path)}`,
      );
  };
  if (moves.length)
    for (const path of [sources, merges, ...moves.map((move) => move.to)])
      requireDestination(path);
  if (dryRun || !moves.length)
    return {
      lane: existsSync(destination) || (dryRun && moves.length) ? lane : null,
      ...counted,
      outcome: moves.length ? "would-move" : "nothing",
    };
  mkdirSync(dirname(destination), { recursive: true, mode: 0o700 });
  ensureTemporaryRoot(destination, {
    class: "closed-journal",
    repository: main,
    owner: { workOrder },
  });
  requireDestination(sources);
  requireDestination(merges);
  // The host keeps each session's transcript under the checkout it ran in,
  // so the lane records where its journals came from before they move.
  const origin = realpathSync(subject);
  // A row goes on a line of its own, even after a torn last line.
  const appendLine = (file, row) => {
    let boundary = "";
    const info = lstatSync(file, { throwIfNoEntry: false });
    if (info?.size) {
      const descriptor = openSync(file, "r");
      try {
        const last = Buffer.alloc(1);
        readSync(descriptor, last, 0, 1, info.size - 1);
        if (last[0] !== 0x0a) boundary = "\n";
      } finally {
        closeSync(descriptor);
      }
    }
    appendFileSync(file, boundary + JSON.stringify(row) + "\n", {
      mode: 0o600,
    });
  };
  appendLine(sources, {
    worktree: origin,
    at: new Date().toISOString(),
    ...counted,
  });
  // Each append into a log the lane already holds is recorded in merges.jsonl
  // before it is published: the worktree, the log, where the appended bytes
  // start, their length and digest, and how much of the source they bring the
  // merge through, with that prefix's digest. A retry trusts its own row only
  // while the log still holds those bytes there, no other worktree's append
  // starts inside them, and the source still begins with that prefix. So an
  // append that never published is made again, even if another worktree
  // later appended the same bytes at that place, and one that did is never
  // repeated, whatever other worktrees appended after it.
  /** @type {Array<Record<string, any>>} */
  const merged = [];
  try {
    for (const line of readFileSync(merges, "utf8").split("\n"))
      try {
        const row = JSON.parse(line);
        if (row && typeof row === "object") merged.push(row);
      } catch {
        // A torn or foreign line proves nothing.
      }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  /** @param {Record<string, any>} row @param {string} log */
  const spans = (row, log) =>
    row.log === log &&
    [row.offset, row.length, row.through].every(Number.isSafeInteger) &&
    row.offset >= 0 &&
    row.length >= 0;
  /** @param {string} log @param {Buffer} current @param {Buffer} incoming */
  const mergedThrough = (log, current, incoming) => {
    for (let index = merged.length - 1; index >= 0; index--) {
      const row = merged[index];
      if (row.worktree !== origin || !spans(row, log)) continue;
      const { offset, length, through } = row;
      if (through > incoming.length || offset + length > current.length)
        continue;
      // Another worktree's later append that starts inside these bytes shows
      // this one never published them; an earlier one proves nothing.
      if (
        merged.some(
          (other, later) =>
            later > index &&
            other.worktree !== origin &&
            spans(other, log) &&
            other.offset >= offset &&
            other.offset < offset + length,
        )
      )
        continue;
      if (
        digest(incoming.subarray(0, through)) === row.source &&
        digest(current.subarray(offset, offset + length)) === row.span
      )
        return through;
    }
    return 0;
  };
  /** @param {string} log @param {number} offset @param {Buffer} bytes @param {Buffer} source */
  const recordMerge = (log, offset, bytes, source) => {
    const row = {
      worktree: origin,
      log,
      offset,
      length: bytes.length,
      span: digest(bytes),
      through: source.length,
      source: digest(source),
    };
    appendLine(merges, row);
    merged.push(row);
  };
  const relocate = (from, to) => {
    try {
      rename(from, to);
    } catch (error) {
      if (error.code !== "EXDEV") throw error;
      // A rename cannot cross volumes: copy under a temporary name, publish
      // the whole copy, then remove the source.
      const partial = `${to}.partial-${randomUUID()}`;
      try {
        copyFile(from, partial, constants.COPYFILE_EXCL);
        // A copied log is recorded as merged before it is published, so a
        // source whose removal then fails is never appended twice.
        if (to.endsWith(".jsonl")) {
          const bytes = readFileSync(partial);
          recordMerge(relative(destination, to), 0, bytes, bytes);
        }
        renameSync(partial, to);
      } finally {
        rmSync(partial, { force: true });
      }
      rmSync(from);
    }
  };
  for (const { from, to } of moves)
    try {
      requireMaterialContainment(main, relative(main, to));
      mkdirSync(dirname(to), { recursive: true, mode: 0o700 });
      const existing = lstatSync(to, { throwIfNoEntry: false });
      if (!existing) {
        relocate(from, to);
        continue;
      }
      if (!existing.isFile() || existing.isSymbolicLink())
        throw new Error("the retained entry is not a regular file");
      const incoming = readFileSync(from),
        current = readFileSync(to);
      if (to.endsWith(".jsonl")) {
        // Only the source's bytes past what this worktree's earlier attempts
        // merged are appended, so a retried close counts no row twice and
        // drops none, even if the source has grown since; a log from another
        // source is appended whole, even when its bytes equal the lane's.
        const log = relative(destination, to);
        const through = mergedThrough(log, current, incoming);
        const rest = incoming.subarray(through);
        if (rest.length) {
          const separator = Buffer.from(
            current.length && current.at(-1) !== 0x0a ? "\n" : "",
          );
          recordMerge(log, current.length + separator.length, rest, incoming);
          replaceWhole(to, Buffer.concat([current, separator, rest]));
        }
        rmSync(from);
      } else if (incoming.equals(current)) rmSync(from);
      else {
        let union = null;
        if (basename(to) === "checks.json")
          try {
            const rows = [
              ...JSON.parse(current.toString("utf8")),
              ...JSON.parse(incoming.toString("utf8")),
            ];
            const seen = new Set();
            union = rows.filter((row) => {
              const key = JSON.stringify(row);
              return !seen.has(key) && seen.add(key);
            });
          } catch {
            union = null;
          }
        if (Array.isArray(union)) {
          replaceWhole(to, JSON.stringify(union, null, 2) + "\n");
          rmSync(from);
        } else {
          // The newer state takes the canonical name; the earlier bytes stay
          // in the same lane under a name derived from them.
          const prior = `${to}.prior-${digest(current).slice(0, 16)}`;
          if (existsSync(prior)) rmSync(to);
          else renameSync(to, prior);
          relocate(from, to);
        }
      }
    } catch (error) {
      throw new Error(
        `Journal retention stopped at ${relative(subject, from)}: ${error.code ?? error.message}; the worktree is retained and a retried close merges the rest`,
      );
    }
  return { lane, ...counted, outcome: "moved" };
}

/** Discovery supplies candidates only; removal still verifies the full proof.
 * This lane survives a failed finish even if no close record was written. */
export function retainedWorktreeRemovalSubjects(
  main,
  workOrder,
  { knownSubjects = [] } = {},
) {
  main = realpathSync(main);
  if (!/^WO-\d{3}$/.test(workOrder))
    throw new Error("Removal receipt discovery requires a work order");
  const lane = docRelative(main, "control", `local/retained/${workOrder}`);
  requireMaterialContainment(main, lane);
  if (!existsSync(join(main, lane))) return [];
  const knownReceipts = new Set(
    knownSubjects.map((subject) => receiptPath(main, workOrder, subject)),
  );
  const subjects = [];
  for (const name of readdirSync(join(main, lane)).sort()) {
    if (!/^worktree-removal-[a-f0-9]{64}\.json$/.test(name)) continue;
    const file = join(lane, name);
    // History already supplies these candidates (or records their completed
    // removal). Their proof is judged only if removal is actually attempted.
    if (knownReceipts.has(file)) continue;
    requireMaterialContainment(main, file);
    if (!lstatSync(join(main, file)).isFile())
      throw new Error(`Preservation receipt is not regular: ${file}`);
    const proof = JSON.parse(readFileSync(join(main, file), "utf8"));
    if (
      proof.schemaVersion !== 1 ||
      proof.main !== main ||
      proof.workOrder !== workOrder ||
      typeof proof.subject !== "string" ||
      resolve(proof.subject) !== proof.subject ||
      receiptPath(main, workOrder, proof.subject) !== file ||
      proof.subject === main ||
      !relative(proof.subject, main).startsWith("..")
    )
      throw new Error(
        `Preservation receipt does not bind its subject: ${file}`,
      );
    subjects.push(proof.subject);
  }
  return subjects;
}

// Never follow a link, including one pointing outside the subject. Hash the
// pre-removal tree so a reused path or new bytes cannot be disposed. The
// anchored disposable beacon lane keeps its sparse size signal instead.
function snapshot(subject) {
  const rows = [];
  const walk = (name) => {
    const file = join(subject, name);
    const item = lstatSync(file);
    if (item.isSymbolicLink())
      rows.push({ path: name, kind: "symlink", target: readlinkSync(file) });
    else if (item.isDirectory()) {
      rows.push({ path: name, kind: "directory" });
      for (const child of readdirSync(file).sort())
        walk(name ? `${name}/${child}` : child);
    } else if (item.isFile()) {
      // paths.mjs classifies this lane as disposable. Its sparse signal files
      // encode state in their size; reading their holes is neither a byte proof
      // for preserved material nor a useful disposal precondition.
      if (name.startsWith(".control-beacons/"))
        rows.push({ path: name, kind: "beacon", size: item.size });
      else rows.push({ path: name, kind: "file", sha256: fileDigest(file) });
    } else throw new Error(`Unsupported removal entry: ${file}`);
  };
  walk("");
  return rows;
}

export function restoreOwnedDirectoryWrites(subject) {
  subject = regularDirectory(subject);
  const changed = [];
  const walk = (file) => {
    const item = lstatSync(file);
    if (item.isSymbolicLink() || !item.isDirectory()) return;
    if (item.uid === process.getuid?.() && !(item.mode & 0o200)) {
      changed.push({ file, mode: item.mode & 0o7777 });
      chmodSync(file, item.mode | 0o200);
    }
    for (const name of readdirSync(file)) walk(join(file, name));
  };
  try {
    walk(subject);
  } catch (error) {
    for (const row of changed.reverse())
      if (existsSync(row.file)) chmodSync(row.file, row.mode);
    throw error;
  }
  return () => {
    for (const row of changed.reverse())
      if (existsSync(row.file) && !lstatSync(row.file).isSymbolicLink())
        chmodSync(row.file, row.mode);
  };
}

// A receipt carries these compact summaries, and reading its sidecar
// recomputes them and requires an exact match, so writer and reader share one
// definition.
const inventorySummaries = (inventory) => ({
  snapshot: materialSummary(
    inventory.snapshot.map((row) => ({ path: row.path, class: row.kind })),
  ),
  preserved: materialSummary(
    inventory.preserved.map((row) => ({ path: row.path, class: "file" })),
  ),
  directories: materialSummary(
    inventory.directories.map((path) => ({ path, class: "directory" })),
  ),
});

/** Called only after the existing in-process preservation verifier passes. */
export function recordWorktreeRemoval(main, subject, reconciliation) {
  main = realpathSync(main);
  subject = regularDirectory(subject);
  if (subject === main || !relative(subject, main).startsWith(".."))
    throw new Error("Removal subject contains main");
  if (!parseWorktrees(main).some((row) => resolve(row.worktree) === subject))
    throw new Error("Removal proof requires the registered subject");
  const workOrder = reconciliation.workOrder;
  if (!/^WO-\d{3}$/.test(workOrder) || reconciliation.dryRun)
    throw new Error("Removal proof requires actual preservation for its order");
  const preservedPaths = reconciliation.files.map((row) => row.destination);
  const preserved = [...new Set(preservedPaths)].map((file) => {
    requireMaterialContainment(main, file);
    if (!lstatSync(join(main, file)).isFile())
      throw new Error("Preserved file is not regular");
    return { path: file, sha256: fileDigest(join(main, file)) };
  });
  const inventory = {
    snapshot: snapshot(subject),
    preserved,
    directories: reconciliation.directories.map((row) => row.destination),
  };
  const bytes = JSON.stringify(inventory) + "\n";
  const inventoryDigest = digest(bytes);
  const file = receiptPath(main, workOrder, subject);
  const inventoryPath = join(
    dirname(file),
    `removal-inventory-${inventoryDigest}.json`,
  );
  requireMaterialContainment(main, inventoryPath);
  mkdirSync(dirname(join(main, inventoryPath)), {
    recursive: true,
    mode: 0o700,
  });
  const destination = join(main, inventoryPath);
  if (!existsSync(destination)) {
    // Publish complete bytes atomically. A stopped write can leave only an
    // unreferenced preparation file, never a poisoned content-addressed name.
    const temporary = `${destination}.prepare-${randomUUID()}`;
    try {
      writeFileSync(temporary, bytes, { flag: "wx", mode: 0o600 });
      try {
        linkSync(temporary, destination);
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
    } finally {
      rmSync(temporary, { force: true });
    }
  }
  requireMaterialContainment(main, inventoryPath);
  if (
    !lstatSync(destination).isFile() ||
    fileDigest(destination) !== inventoryDigest
  )
    throw new Error("Removal inventory digest differs");
  const proof = {
    schemaVersion: 1,
    main,
    subject,
    workOrder,
    recordedAt: new Date().toISOString(),
    inventory: { path: inventoryPath, digest: `sha256:${inventoryDigest}` },
    ...inventorySummaries(inventory),
  };
  requireMaterialContainment(main, file);
  mkdirSync(dirname(join(main, file)), { recursive: true, mode: 0o700 });
  writeFileSync(join(main, file), JSON.stringify(proof) + "\n", {
    mode: 0o600,
  });
  return file;
}

/** Old receipts carry inline arrays. New receipts keep the same byte proof in
 * one digest-bound sidecar, which must remain in the order's retained lane. */
export function readRemovalInventory(
  main,
  file,
  proof = JSON.parse(readFileSync(join(main, file), "utf8")),
) {
  if (!proof.inventory) return proof;
  const { path, digest: expected } = proof.inventory;
  if (
    !/^sha256:[a-f0-9]{64}$/.test(expected ?? "") ||
    path !== join(dirname(file), `removal-inventory-${expected.slice(7)}.json`)
  )
    throw new Error("Removal inventory reference is invalid");
  requireMaterialContainment(main, path);
  const bytes = readFileSync(join(main, path));
  if (`sha256:${digest(bytes)}` !== expected)
    throw new Error("Removal inventory digest differs");
  const inventory = JSON.parse(bytes);
  if (
    !Array.isArray(inventory.snapshot) ||
    !Array.isArray(inventory.preserved) ||
    !Array.isArray(inventory.directories)
  )
    throw new Error("Removal inventory is invalid");
  const summaries = inventorySummaries(inventory);
  if (
    Object.entries(summaries).some(
      ([key, value]) => JSON.stringify(proof[key]) !== JSON.stringify(value),
    )
  )
    throw new Error("Removal inventory summary differs");
  return inventory;
}

/** A partial Git removal may leave only a subset of the recorded tree. Every
 * remaining entry must still match, and every preserved destination must hold. */
export function verifyWorktreeRemoval(main, subject, workOrder) {
  main = realpathSync(main);
  subject = regularDirectory(subject);
  if (subject === main || !relative(subject, main).startsWith(".."))
    throw new Error("Removal subject contains main");
  const file = receiptPath(main, workOrder, subject);
  requireMaterialContainment(main, file);
  if (!lstatSync(join(main, file)).isFile())
    throw new Error("Preservation receipt is not regular");
  const proof = JSON.parse(readFileSync(join(main, file), "utf8"));
  const inventory = readRemovalInventory(main, file, proof);
  if (
    proof.schemaVersion !== 1 ||
    proof.main !== main ||
    proof.subject !== subject ||
    proof.workOrder !== workOrder ||
    !Array.isArray(inventory.snapshot) ||
    !Array.isArray(inventory.preserved) ||
    !Array.isArray(inventory.directories)
  )
    throw new Error("Preservation receipt does not bind this subject");
  const original = new Map(
    inventory.snapshot.map((row) => [row.path, JSON.stringify(row)]),
  );
  const restoreBeaconPermissions = prepareBeaconDisposal(subject);
  try {
    if (
      snapshot(subject).some(
        (row) => original.get(row.path) !== JSON.stringify(row),
      )
    )
      throw new Error("Leftover directory changed since preservation");
  } finally {
    restoreBeaconPermissions();
  }
  for (const row of inventory.preserved) {
    requireMaterialContainment(main, row.path);
    const saved = join(main, row.path);
    if (!lstatSync(saved).isFile() || fileDigest(saved) !== row.sha256)
      throw new Error(`Preservation byte proof failed: ${row.path}`);
  }
  for (const name of inventory.directories) {
    requireMaterialContainment(main, name);
    if (!lstatSync(join(main, name)).isDirectory())
      throw new Error(`Preserved directory missing: ${name}`);
  }
  return file;
}

export function removeUnregisteredWorktree(
  main,
  subject,
  workOrder,
  { dryRun = false } = {},
) {
  subject = regularDirectory(subject);
  return withWriterReservationLock(
    subject,
    () => {
      if (parseWorktrees(main).some((row) => resolve(row.worktree) === subject))
        throw new Error(`Subject is still a registered worktree: ${subject}`);
      const writer = writerTeardownBlocker(subject);
      if (writer) throw new Error(writer);
      if (activeGateRuns(subject).length)
        throw new Error("active gate; leftover directory retained");
      const receipt = verifyWorktreeRemoval(main, subject, workOrder);
      if (!dryRun) {
        const restoreBeaconPermissions = prepareBeaconDisposal(subject);
        try {
          const restoreWrites = restoreOwnedDirectoryWrites(subject);
          try {
            rmSync(subject, { recursive: true });
          } catch (error) {
            restoreWrites();
            throw error;
          }
        } finally {
          restoreBeaconPermissions();
        }
      }
      return receipt;
    },
    { requireGit: false },
  );
}
