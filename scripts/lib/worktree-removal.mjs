import { createHash } from "node:crypto";
import {
  chmodSync,
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { docRelative } from "./config.mjs";
import { parseWorktrees } from "./git.mjs";
import { requireMaterialContainment } from "./worktree-material.mjs";
import { activeGateRuns } from "./gate-evidence.mjs";
import { prepareBeaconDisposal } from "./beacons.mjs";
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
  const preservedPaths = [
    ...reconciliation.files.map((row) => row.destination),
    ...(reconciliation.recovery ?? [])
      .filter((row) => row.outcome === "bundled")
      .map((row) => row.path),
  ];
  const preserved = [...new Set(preservedPaths)].map((file) => {
    requireMaterialContainment(main, file);
    if (!lstatSync(join(main, file)).isFile())
      throw new Error("Preserved file is not regular");
    return { path: file, sha256: fileDigest(join(main, file)) };
  });
  const proof = {
    schemaVersion: 1,
    main,
    subject,
    workOrder,
    recordedAt: new Date().toISOString(),
    snapshot: snapshot(subject),
    preserved,
    directories: reconciliation.directories.map((row) => row.destination),
  };
  const file = receiptPath(main, workOrder, subject);
  requireMaterialContainment(main, file);
  mkdirSync(dirname(join(main, file)), { recursive: true, mode: 0o700 });
  writeFileSync(join(main, file), JSON.stringify(proof) + "\n", {
    mode: 0o600,
  });
  return file;
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
  if (
    proof.schemaVersion !== 1 ||
    proof.main !== main ||
    proof.subject !== subject ||
    proof.workOrder !== workOrder ||
    !Array.isArray(proof.snapshot) ||
    !Array.isArray(proof.preserved) ||
    !Array.isArray(proof.directories)
  )
    throw new Error("Preservation receipt does not bind this subject");
  const original = new Map(
    proof.snapshot.map((row) => [row.path, JSON.stringify(row)]),
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
  for (const row of proof.preserved) {
    requireMaterialContainment(main, row.path);
    const saved = join(main, row.path);
    if (!lstatSync(saved).isFile() || fileDigest(saved) !== row.sha256)
      throw new Error(`Preservation byte proof failed: ${row.path}`);
  }
  for (const name of proof.directories) {
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
