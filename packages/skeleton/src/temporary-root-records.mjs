// Shared build-free implementation. Scripts and the compiled runtime write the
// same records; a missing process observation always preserves the directory.
import { createHash, randomUUID } from "node:crypto";
import {
  accessSync,
  appendFileSync,
  chmodSync,
  constants,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { AsyncLocalStorage } from "node:async_hooks";
import { tmpdir } from "node:os";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";

/** @typedef {"gate-fixture"|"session-scratch"|"worker-capture"|"warm-fixture"|"coordination"|"closed-journal"} TemporaryClass */
/** @typedef {{pid: number|null, birth: string|null, repository: string, gateId?: string, suite?: string, session?: string, workOrder?: string}} TemporaryOwner */
/** @typedef {{schemaVersion: 1, token: string, class: TemporaryClass, owner: TemporaryOwner, createdAt: string, retentionHours: number|null, retentionOverride?: number|null, fixtureOwner?: {token: string, gateId: string, suite?: string}, device: number, inode: number, endedAt?: string, endSource?: "completion"|"owner-death-observation", outcome?: "passed"|"failed"|"abandoned", cacheKey?: string}} TemporaryRecord */
/** @typedef {{class: TemporaryClass, owner?: Partial<TemporaryOwner>, repository?: string, retentionHours?: number|null, cacheKey?: string, adoptExisting?: boolean}} TemporaryOptions */
/** @typedef {{pid: number, birth: string, ppid?: number, command?: string}} ProcessIdentity */
/** @typedef {{files: number, bytes: number, directories: number}} Inventory */

export const TEMPORARY_OWNER_FILE = ".dotln-owner.json";

/** Where a removal moves a root before deleting it: beside it, so the rename
 * stays on its volume, under a name its token derives. A root already there
 * is its own place aside.
 * @param {string} path @param {string} token */
export const temporaryRemovalAside = (path, token) =>
  basename(path) === `dotln-removing-${token}`
    ? path
    : join(dirname(path), `dotln-removing-${token}`);

/** Call after initializing a synthetic Git repository. Keep cleanup metadata
 * out of its index without changing the fixture's tracked ignore rules.
 * @param {string} repository */
export function excludeFixtureOwnership(repository) {
  const info = requireTemporaryDirectory(join(repository, ".git/info"));
  if (!lstatSync(join(repository, ".git")).isDirectory())
    throw new Error("Fixture Git repository must be initialized");
  mkdirSync(info, { recursive: true });
  const file = join(info, "exclude");
  const stat = lstatSync(file, { throwIfNoEntry: false });
  if (stat && (!stat.isFile() || stat.isSymbolicLink()))
    throw new Error("Fixture Git exclusions must be a regular file");
  const prior = stat ? readFileSync(file, "utf8") : "";
  if (!prior.split(/\r?\n/).includes(TEMPORARY_OWNER_FILE))
    appendFileSync(
      file,
      `${prior.endsWith("\n") || !prior ? "" : "\n"}${TEMPORARY_OWNER_FILE}\n`,
    );
}
/** Ownership describes one physical directory and never travels with its
 * contents. Preserve a caller's narrower copy filter as well.
 * @param {string|URL} source
 * @param {string|URL} destination
 * @param {import("node:fs").CopySyncOptions} [options] */
export function copyTemporaryMaterial(source, destination, options = {}) {
  cpSync(source, destination, {
    ...options,
    filter: (from, to) =>
      basename(from) !== TEMPORARY_OWNER_FILE &&
      (options.filter?.(from, to) ?? true),
  });
}
export const DEFAULT_RETENTION = Object.freeze({
  "gate-fixture-passed": 0,
  "gate-fixture-failed": 24,
  "session-scratch": 24,
  "worker-capture": 1,
  "warm-fixture": 0,
  "legacy-backfill": 48,
  coordination: null,
  // A closed order's session journals, states and gate index, kept in main's
  // retained lane after release close removes its worktree.
  "closed-journal": 720,
});
const TEMPORARY_CLASSES = [
  "gate-fixture",
  "session-scratch",
  "worker-capture",
  "warm-fixture",
  "coordination",
  "closed-journal",
];

/** The entries a closed-journal root may hold beside its owner record: the
 * session journals and other append-only logs, the session states and their
 * per-session sidecars, the gate index, the suite-success and deadline
 * directories, the order's change review reports, and a superseded state kept
 * when a retried close merged a newer one. Anything else is not the close's
 * to remove.
 * @param {string} name @param {boolean} directory */
export const closedJournalEntry = (name, directory) =>
  directory
    ? ["suite-success", "deadlines", "reviews"].includes(name)
    : name.endsWith(".jsonl") ||
      name === "checks.json" ||
      /^[a-f0-9]{64}(?:\.[a-z][a-z-]*)?\.json$/u.test(name) ||
      /\.prior-[a-f0-9]{16}$/u.test(name);
/** @typedef {Record<keyof typeof DEFAULT_RETENTION, number|null>} Retention */
const require = createRequire(import.meta.url);
/** @type {AsyncLocalStorage<Partial<TemporaryOwner>>} */
const ownerContext = new AsyncLocalStorage();
/** @template T @param {Partial<TemporaryOwner>} owner @param {() => T} operation @returns {T} */
export const withTemporaryOwner = (owner, operation) =>
  ownerContext.run(owner, operation);
/** @type {Map<string, {readHostSnapshot: Function}>} */
const readers = new Map();
/** @type {Map<number, {pid: number, birth: string|null}>} */
const identities = new Map();
/** @param {string} text */
const hash = (text) => createHash("sha256").update(text).digest("hex");

/** Locate the actual tool checkout, including from an immutable hook snapshot.
 * @param {string} [start] */
export function temporaryRepository(
  start = ownerContext.getStore()?.repository ||
    process.env.DOTLN_TEMP_REPOSITORY ||
    process.cwd(),
) {
  for (const initial of [start, dirname(fileURLToPath(import.meta.url))]) {
    let candidate;
    for (let at = resolve(initial); ;) {
      if (existsSync(join(at, "scripts/lib/host-resources.mjs"))) {
        candidate ??= at;
        if (existsSync(join(at, ".git"))) return realpathSync(at);
      }
      const parent = dirname(at);
      if (parent === at) break;
      at = parent;
    }
    if (candidate) return realpathSync(candidate);
  }
  return realpathSync(start);
}

/** @param {unknown} input @returns {Retention} */
export function validateRetention(input) {
  if (input === undefined) return { ...DEFAULT_RETENTION };
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid budget: retention must be an object");
  const value = /** @type {Record<string, unknown>} */ (input);
  for (const [key, hours] of Object.entries(value))
    if (
      !(key in DEFAULT_RETENTION) ||
      (hours !== null &&
        (typeof hours !== "number" || !Number.isFinite(hours) || hours < 0))
    )
      throw new Error(`Invalid budget: retention.${key}`);
  return { ...DEFAULT_RETENTION, .../** @type {Partial<Retention>} */ (value) };
}

/** Retention only paces cleanup. A budgets file written by a newer kit can name
 * a class this runtime never creates, as a pinned hook snapshot meets after its
 * worktree integrates main; this reader ignores such a key, while readBudgets
 * still validates the whole file at every gate.
 * @param {unknown} input */
const knownRetention = (input) =>
  input && typeof input === "object" && !Array.isArray(input)
    ? Object.fromEntries(
        Object.entries(input).filter(([key]) => key in DEFAULT_RETENTION),
      )
    : input;

/** @param {string} repository */
export function readRetention(repository) {
  // Product children receive the scheduler's policy, without reading its
  // document inputs. A nested fixture repository still reads its own policy.
  if (
    process.env.DOTLN_TEMP_RETENTION &&
    process.env.DOTLN_TEMP_REPOSITORY &&
    existsSync(repository) &&
    realpathSync(repository) === realpathSync(process.env.DOTLN_TEMP_REPOSITORY)
  )
    return validateRetention(
      knownRetention(JSON.parse(process.env.DOTLN_TEMP_RETENTION)),
    );
  // This module also runs while the control plane is being loaded. Resolve
  // its one configured document path without synchronously importing that
  // partly initialized module graph.
  const configPath = join(repository, "dotln.config.json");
  const roots = existsSync(configPath)
    ? (JSON.parse(readFileSync(configPath, "utf8")).roots ?? {})
    : {};
  const control = roots.control ?? `${roots.docs ?? "docs"}/control`;
  if (
    typeof control !== "string" ||
    isAbsolute(control) ||
    control
      .split(/[\\/]/)
      .some((part) => !part || part === "." || part === "..")
  )
    throw new Error("Invalid temporary-root control directory");
  const file = join(repository, control, "budgets.json");
  let retention;
  try {
    if (existsSync(file))
      retention = JSON.parse(readFileSync(file, "utf8")).retention;
  } catch (error) {
    // An integration can leave this file conflicted, and resolving that
    // conflict itself needs scratch space. Retention only paces cleanup, so
    // the default policy stands until the text parses; readBudgets still
    // refuses the broken file at every gate.
    if (!(error instanceof SyntaxError)) throw error;
  }
  return validateRetention(knownRetention(retention));
}

/** @param {string} [repository] @returns {ProcessIdentity[]|null} */
export function temporaryProcessTable(repository = temporaryRepository()) {
  try {
    let reader = readers.get(repository);
    if (!reader) {
      reader = require(
        join(temporaryRepository(repository), "scripts/lib/host-resources.mjs"),
      );
      if (reader) readers.set(repository, reader);
    }
    const sample = reader?.readHostSnapshot({ footprint: false });
    return Array.isArray(sample?.processes) &&
      sample.processes.some(
        (/** @type {ProcessIdentity} */ row) => row.pid === process.pid,
      )
      ? sample.processes
      : null;
  } catch {
    return null;
  }
}

/** @param {number} [pid] @param {string} [repository] */
export function temporaryProcessIdentity(
  pid = process.pid,
  repository = temporaryRepository(),
) {
  // Only this process has an immutable lifetime while the module is loaded.
  const cached = pid === process.pid ? identities.get(pid) : undefined;
  if (cached) return cached;
  const row = temporaryProcessTable(repository)?.find(
    (entry) => entry.pid === pid,
  );
  const identity = { pid, birth: row?.birth ?? null };
  if (pid === process.pid && identity.birth !== null)
    identities.set(pid, identity);
  return identity;
}

/** null means unknown, never dead. A gate's terminal row is judged by the
 * caller as well: live child processes still protect their roots.
 * @param {Pick<TemporaryRecord, "owner">} record @param {ProcessIdentity[]|null} [table]
 * @returns {boolean|null} */
export function ownerAlive(
  record,
  table = temporaryProcessTable(record.owner.repository),
) {
  if (!table || !record.owner.pid) return null;
  const process = table.find((row) => row.pid === record.owner.pid);
  // A complete observation can prove an absent PID dead without a birth
  // reading. A present PID with no recorded birth remains unknown, including
  // PID reuse; missing observations never establish death.
  if (!process) return false;
  return record.owner.birth ? process.birth === record.owner.birth : null;
}

/** Refuse aliasing ancestors, including a symlink to a directory. The system
 * temp directory itself may have a platform alias; callers resolve it first.
 * @param {string} path */
export function requireTemporaryDirectory(path) {
  const absolute = resolve(path);
  let at = absolute;
  while (true) {
    const info = lstatSync(at, { throwIfNoEntry: false });
    if (info && (!info.isDirectory() || info.isSymbolicLink()))
      throw new Error(
        `Temporary directory has a non-directory or symbolic-link ancestor: ${at}`,
      );
    if (
      info &&
      typeof process.getuid === "function" &&
      at === absolute &&
      info.uid !== process.getuid()
    )
      throw new Error("Temporary directory belongs to another user");
    const parent = dirname(at);
    if (at === parent) break;
    at = parent;
  }
  return absolute;
}

/** @param {string} repository */
export function markUnindexed(repository) {
  if (process.platform !== "darwin") return;
  for (const directory of [
    join(realpathSync(tmpdir()), "dotln"),
    join(repository, ".runtime"),
  ]) {
    requireTemporaryDirectory(directory);
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const marker = join(directory, ".metadata_never_index");
    try {
      writeFileSync(marker, "", { flag: "wx", mode: 0o600 });
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "EEXIST")
        throw error;
    }
  }
}

/** Each token owns an append-only segment. Retiring a completed root never
 * rewrites another process's live segment.
 * @param {string} repository */
export const temporaryLedgerPath = (repository) =>
  join(repository, ".runtime/temporary-roots/roots");
/** @param {TemporaryRecord} record @param {string} path @param {string} action @param {Record<string, unknown>} [details] */
function ledger(record, path, action, details = {}) {
  // Release close may have already removed the owning worktree. Its caller
  // records the removal; cleanup must never recreate that worktree for a log.
  if (!existsSync(record.owner.repository)) return;
  const file = join(
    temporaryLedgerPath(record.owner.repository),
    `${record.token}.jsonl`,
  );
  requireTemporaryDirectory(dirname(file));
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const info = lstatSync(file, { throwIfNoEntry: false });
  if (info && (!info.isFile() || info.isSymbolicLink()))
    throw new Error("Temporary-root ledger must be a regular file");
  appendFileSync(
    file,
    JSON.stringify({
      action,
      path,
      token: record.token,
      class: record.class,
      owner: record.owner,
      at: new Date().toISOString(),
      ...details,
    }) + "\n",
    { mode: 0o600 },
  );
  if (
    ["removed", "promoted"].includes(action) &&
    !record.owner.gateId &&
    path === registeredRootPath(file)
  )
    rmSync(file, { force: true });
}

/** @param {string} file */
const registeredRootPath = (file) => {
  const first = readFileSync(file, "utf8").split("\n")[0];
  if (!first) throw new Error("Empty temporary root ledger");
  return JSON.parse(first).path;
};

/** What a walk over an owned root may be given. `budget` is called before
 * each directory is listed or entry examined, and throws once a prune's time
 * is spent. `repair` lets the walk grant the owner access to an entry the
 * owner cannot read, through `chmod` (chmodSync unless a fixture makes it
 * fail), and `repaired` collects each grant's path and former mode, so a
 * caller that then keeps the root can put them back.
 * @typedef {{budget?: (path: string) => void, repair?: boolean, chmod?: (path: string, mode: number) => void, repaired?: Array<{path: string, mode: number}>}} WalkOptions */

/** Nearest nested owner boundaries, including invalid markers. A parent must
 * not erase a descendant's independent retention or live ownership. A
 * directory its owner cannot list stops the walk as a restricted entry,
 * unless `repair` is set: the walk then grants the owner read, write and
 * search on it and lists it.
 * @param {string} path @param {WalkOptions} [options] @returns {string[]} */
export function nestedTemporaryRoots(path, options = {}) {
  options.budget?.(path);
  const found = [];
  for (const entry of readableEntries(path, options)) {
    if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
    const child = join(path, entry.name);
    if (ownerMarkerPresent(child, options)) found.push(child);
    else found.push(...nestedTemporaryRoots(child, options));
  }
  return found;
}

/** Code of the refusal a walk or removal raises for an entry its owner
 * cannot read and, where asked, could not repair. */
export const RESTRICTED_ENTRY = "RESTRICTED_ENTRY";
/** @param {string} path @param {unknown} cause */
const restrictedEntry = (path, cause) =>
  Object.assign(new Error(`restricted-entry: ${path}`, { cause }), {
    code: RESTRICTED_ENTRY,
    path,
  });
/** @param {unknown} error */
const denied = (error) =>
  ["EACCES", "EPERM"].includes(
    /** @type {NodeJS.ErrnoException} */ (error)?.code ?? "",
  );
/** Grants the owner what reading and removing need: read, write and search on
 * a directory, read and write on a file that lacks owner read. A link is
 * never changed. A failed grant is a restricted entry naming its path.
 * @param {string} path @param {import("node:fs").Stats} info
 * @param {WalkOptions} options */
function repairEntry(path, info, options) {
  if (info.isSymbolicLink()) return;
  const needed = info.isDirectory() ? 0o700 : 0o600;
  if (info.isDirectory() ? (info.mode & 0o700) === 0o700 : info.mode & 0o400)
    return;
  try {
    (options.chmod ?? chmodSync)(path, (info.mode & 0o777) | needed);
  } catch (cause) {
    throw restrictedEntry(path, cause);
  }
  options.repaired?.push({ path, mode: info.mode & 0o7777 });
}
/** Puts back the modes a walk granted, newest first. What can no longer be
 * changed back, as an entry since removed, is left as it is.
 * @param {Array<{path: string, mode: number}>} repaired */
export function restoreTemporaryRepairs(repaired) {
  for (const { path, mode } of [...repaired].reverse())
    try {
      chmodSync(path, mode);
    } catch {
      /* Gone or no longer ours to change. */
    }
  repaired.length = 0;
}
/** A directory's entries; a denied listing is repaired first when asked.
 * @param {string} path @param {WalkOptions} options */
function readableEntries(path, options) {
  try {
    return readdirSync(path, { withFileTypes: true });
  } catch (error) {
    if (!denied(error)) throw error;
    if (!options.repair) throw restrictedEntry(path, error);
    repairEntry(path, lstatSync(path), options);
    return readdirSync(path, { withFileTypes: true });
  }
}
/** Whether a directory holds an owner marker. A directory without owner
 * search denies even that look, and is repaired first when asked.
 * @param {string} directory @param {WalkOptions} options */
function ownerMarkerPresent(directory, options) {
  const marker = join(directory, TEMPORARY_OWNER_FILE);
  try {
    return Boolean(lstatSync(marker, { throwIfNoEntry: false }));
  } catch (error) {
    if (!denied(error)) throw error;
    if (!options.repair) throw restrictedEntry(directory, error);
    repairEntry(directory, lstatSync(directory), options);
    return Boolean(lstatSync(marker, { throwIfNoEntry: false }));
  }
}
/** A root is its token and its inode. The token in the marker inside the
 * directory proves it is the one that was created, since fixture copies exclude
 * the marker and seeds keep it out of Git, and the inode says it was not
 * replaced on its volume. A volume's device number is assigned at mount and a
 * reboot can renumber it, so a device that differs while the inode matches is
 * re-stamped through writeTemporaryOwner, never refused for that alone.
 * @param {string} path @returns {TemporaryRecord|null} */
export function readTemporaryOwner(path) {
  const info = lstatSync(path, { throwIfNoEntry: false });
  if (!info || !info.isDirectory() || info.isSymbolicLink()) return null;
  const marker = join(path, TEMPORARY_OWNER_FILE);
  const markerInfo = lstatSync(marker, { throwIfNoEntry: false });
  if (!markerInfo) return null;
  if (!markerInfo.isFile() || markerInfo.isSymbolicLink())
    throw new Error("Temporary owner record is not a regular file");
  const record = JSON.parse(readFileSync(marker, "utf8"));
  if (
    record?.schemaVersion !== 1 ||
    !/^[a-f0-9-]{36}$/.test(record.token ?? "") ||
    !TEMPORARY_CLASSES.includes(record.class) ||
    !record.owner ||
    typeof record.owner.repository !== "string" ||
    !isAbsolute(record.owner.repository) ||
    !(
      record.owner.pid === null ||
      (Number.isSafeInteger(record.owner.pid) && record.owner.pid > 0)
    ) ||
    !(
      record.owner.birth === null ||
      (typeof record.owner.birth === "string" && record.owner.birth.length > 0)
    ) ||
    !Number.isFinite(Date.parse(record.createdAt)) ||
    !(
      record.retentionHours === null ||
      (Number.isFinite(record.retentionHours) && record.retentionHours >= 0)
    ) ||
    !Number.isInteger(record.device) ||
    info.ino !== record.inode
  )
    throw new Error(
      "Temporary owner record is invalid or the directory was replaced",
    );
  return info.dev === record.device
    ? record
    : writeTemporaryOwner(path, record);
}

/** Where a root inside a parent that a stopped removal left aside was
 * registered: at the same place under the parent's registered path, read from
 * the parent's own marker and ledger. Null when no such parent holds it.
 * @param {string} path @returns {string|null} */
function relocatedRegistration(path) {
  for (let at = dirname(path); dirname(at) !== at; at = dirname(at)) {
    const token = /^dotln-removing-([a-f0-9-]{36})$/u.exec(basename(at))?.[1];
    if (!token) continue;
    try {
      const parent = JSON.parse(
        readFileSync(join(at, TEMPORARY_OWNER_FILE), "utf8"),
      );
      if (parent?.token !== token) return null;
      const first = readTemporarySegment(
        join(temporaryLedgerPath(parent.owner.repository), `${token}.jsonl`),
      )[0];
      // The parent must be its own removal's aside, the directory its marker
      // names; one moved anywhere else binds none of its nested roots.
      return first?.token === token &&
        typeof first.path === "string" &&
        temporaryRemovalAside(first.path, token) === at &&
        lstatSync(at).ino === parent.inode
        ? join(first.path, relative(at, path))
        : null;
    } catch {
      return null;
    }
  }
  return null;
}

/** Whether the owner's ledger binds a root to its marker: the marker inside the
 * directory carries the record's token, and the owner repository's ledger
 * segment for that token registers this same path without a later removal.
 * Returns the segment's rows when bound, or null.
 * @param {string} path @param {TemporaryRecord} record */
function ledgerBinding(path, record) {
  const marker = join(path, TEMPORARY_OWNER_FILE);
  const markerInfo = lstatSync(marker, { throwIfNoEntry: false });
  let token;
  try {
    if (markerInfo?.isFile() && !markerInfo.isSymbolicLink())
      token = JSON.parse(readFileSync(marker, "utf8")).token;
  } catch {
    token = undefined;
  }
  const repository = record.owner.repository;
  const rows = existsSync(repository)
    ? readTemporarySegment(
        join(temporaryLedgerPath(repository), `${record.token}.jsonl`),
      )
    : [];
  const registered = rows[0]?.path;
  // A root a stopped removal left aside is bound where its token puts it,
  // also inside a parent that another stopped removal left aside.
  const asideOfItself = basename(path) === `dotln-removing-${record.token}`;
  const at =
    typeof registered !== "string"
      ? null
      : asideOfItself
        ? temporaryRemovalAside(registered, record.token)
        : registered;
  return token === record.token &&
    rows[0]?.token === record.token &&
    at !== null &&
    ((existsSync(at) && realpathSync(at) === realpathSync(path)) ||
      relocatedRegistration(path) === at) &&
    !rows.some(
      (row) =>
        row.path === registered && ["removed", "promoted"].includes(row.action),
    )
    ? rows
    : null;
}

/** The ledger's word against a root's marker, for a judgment that may delete
 * it. Where the owner repository exists, its ledger must register the
 * marker's token at this path, so a record naming a repository that never
 * registered it is refused; a root whose repository is gone, as after a closed
 * worktree's removal, is judged by its marker alone.
 * @param {string} path @param {TemporaryRecord} record @returns {string|null} */
export function temporaryLedgerContradiction(path, record) {
  if (!existsSync(record.owner.repository)) return null;
  return ledgerBinding(path, record)
    ? null
    : "the owner's ledger does not register this root's token at this path";
}

/** Writes the record over the marker of the directory it names. The inode must
 * still match. A differing device is a renumbered volume. Where the owner
 * repository exists it is re-stamped only under the ledger binding above and
 * recorded on the root's ledger segment with both numbers. Where the owner
 * repository is gone, as after a closed worktree's removal, no ledger remains
 * to hold it, and the second proof is the marker inside the directory: it
 * must carry the record's token, beside the inode compared here, before the
 * device is re-stamped. Returns the record as written.
 * @param {string} path @param {TemporaryRecord} record @returns {TemporaryRecord} */
export function writeTemporaryOwner(path, record) {
  requireTemporaryDirectory(path);
  const info = lstatSync(path);
  if (info.ino !== record.inode)
    throw new Error("Temporary directory identity changed");
  const renumbered = info.dev !== record.device;
  const written = renumbered ? { ...record, device: info.dev } : record;
  if (renumbered && !existsSync(record.owner.repository)) {
    if (markerToken(path) !== record.token)
      throw new Error(
        "Temporary root device changed and its marker does not carry this record's token; retained",
      );
  } else if (renumbered) {
    const rows = ledgerBinding(path, record);
    if (!rows)
      throw new Error(
        "Temporary root device changed and its owner's ledger does not register this token at this path; retained",
      );
    // The transition is ledgered before the marker changes, so a failed
    // append leaves the old number to be re-stamped, and recorded, at the
    // next read. A retry after a failed marker write finds the same pair as
    // the latest transition and records nothing more; a later reboot that
    // repeats an earlier pair is a new transition and is recorded.
    const latest = [...rows]
      .reverse()
      .find((row) => row.action === "device-renumbered");
    if (
      latest?.recordedDevice !== record.device ||
      latest?.observedDevice !== info.dev
    )
      ledger(written, path, "device-renumbered", {
        recordedDevice: record.device,
        observedDevice: info.dev,
      });
  }
  const file = join(path, TEMPORARY_OWNER_FILE);
  const partial = `${file}.${randomUUID()}.partial`;
  writeFileSync(partial, JSON.stringify(written) + "\n", {
    flag: "wx",
    mode: 0o600,
  });
  renameSync(partial, file);
  return written;
}

/** Runtime scratch created inside a gate fixture belongs to that fixture's
 * lifetime, including a nested instance gate. Unrelated owners stay separate.
 * @param {string} path @param {TemporaryOwner} owner */
function enclosingFixture(path, owner) {
  for (let at = dirname(path); ;) {
    const parent = readTemporaryOwner(at);
    if (parent) {
      // An instance gate runs inside the outer gate's disposable repository.
      // It keeps its own gate metrics but shares that containing lifetime.
      if (
        parent.owner.gateId !== owner.gateId &&
        parent.fixtureOwner?.gateId !== owner.gateId &&
        owner.repository !== at &&
        !owner.repository.startsWith(at + sep)
      )
        return undefined;
      if (parent.fixtureOwner) return parent.fixtureOwner;
      if (parent.class === "gate-fixture" && parent.owner.gateId)
        return {
          token: parent.token,
          gateId: parent.owner.gateId,
          ...(parent.owner.suite ? { suite: parent.owner.suite } : {}),
        };
      return undefined;
    }
    const next = dirname(at);
    if (next === at) return undefined;
    at = next;
  }
}

/** Mark a fixed owned root, used for session scratch and cached fixtures.
 * An existing unmarked directory requires the owning protocol's explicit
 * adoption; normal fixture creation never adopts material.
 * @param {string} path @param {TemporaryOptions} options */
export function ensureTemporaryRoot(path, options) {
  const repository = realpathSync(
    options.repository ??
      options.owner?.repository ??
      ownerContext.getStore()?.repository ??
      process.env.DOTLN_TEMP_REPOSITORY ??
      temporaryRepository(),
  );
  markUnindexed(repository);
  const parent = realpathSync(dirname(path));
  path = requireTemporaryDirectory(join(parent, basename(path)));
  const existing = lstatSync(path, { throwIfNoEntry: false });
  const prior = existing ? readTemporaryOwner(path) : null;
  if (prior) {
    if (
      prior.class !== options.class ||
      (options.owner?.session &&
        options.owner.session !== prior.owner.session) ||
      (options.cacheKey && options.cacheKey !== prior.cacheKey)
    )
      throw new Error("Temporary root belongs to a different owner or class");
    if (
      !existsSync(
        join(
          temporaryLedgerPath(prior.owner.repository),
          `${prior.token}.jsonl`,
        ),
      )
    )
      ledger(prior, path, "created");
    return path;
  }
  if (existing && !options.adoptExisting)
    throw new Error("Unmarked temporary directory retained");
  if (!existing) mkdirSync(path, { mode: 0o700 });
  const info = lstatSync(path);
  const policy = readRetention(repository);
  const identity = temporaryProcessIdentity(
    options.owner?.pid ?? process.pid,
    repository,
  );
  const session =
    process.env.CODEX_THREAD_ID ||
    process.env.CLAUDE_CODE_SESSION_ID ||
    process.env.CLAUDE_SESSION_ID ||
    process.env.COPILOT_AGENT_SESSION_ID;
  /** @type {TemporaryRecord} */
  const record = {
    schemaVersion: 1,
    token: randomUUID(),
    class: options.class,
    owner: {
      ...identity,
      ...(process.env.DOTLN_TEMP_GATE
        ? { gateId: process.env.DOTLN_TEMP_GATE }
        : {}),
      ...(process.env.DOTLN_TEMP_SUITE
        ? { suite: process.env.DOTLN_TEMP_SUITE }
        : {}),
      ...(session ? { session: hash(session) } : {}),
      ...ownerContext.getStore(),
      ...options.owner,
      repository,
    },
    createdAt: new Date().toISOString(),
    retentionHours:
      options.retentionHours === undefined
        ? policy[
            options.class === "gate-fixture"
              ? "gate-fixture-failed"
              : options.class
          ]
        : options.retentionHours,
    device: info.dev,
    inode: info.ino,
    ...(options.cacheKey ? { cacheKey: options.cacheKey } : {}),
    ...(options.retentionHours !== undefined
      ? { retentionOverride: options.retentionHours }
      : {}),
  };
  const fixtureOwner = enclosingFixture(path, record.owner);
  if (fixtureOwner) {
    record.fixtureOwner = fixtureOwner;
    if (options.retentionHours === undefined && record.class === "coordination")
      record.retentionHours = policy["gate-fixture-failed"];
  }
  writeTemporaryOwner(path, record);
  ledger(record, path, "created");
  return path;
}

/** @param {string} prefix @param {TemporaryOptions} options */
export function createTemporaryRoot(prefix, options) {
  const base = isAbsolute(prefix) ? dirname(prefix) : tmpdir();
  const physical = realpathSync(base);
  requireTemporaryDirectory(physical);
  const path = mkdtempSync(join(physical, basename(prefix)));
  try {
    return ensureTemporaryRoot(path, { ...options, adoptExisting: true });
  } catch (error) {
    rmSync(path, { recursive: true, force: true });
    throw error;
  }
}

/** Fixture convenience keeps each call site's existing prefix and nesting.
 * @param {string} prefix */
export const createFixtureRoot = (prefix) =>
  createTemporaryRoot(prefix, { class: "gate-fixture" });
/** @param {string} prefix */
export const createWorkerCapture = (prefix) =>
  createTemporaryRoot(prefix, { class: "worker-capture" });
/** Application scratch has its own explicit operation cleanup. A containing
 * fixture still owns its fallback lifetime if that operation is interrupted.
 * @param {string} prefix */
export const createScratchRoot = (prefix) =>
  createTemporaryRoot(prefix, { class: "session-scratch" });

/** Promotion hands a staging directory to an existing durable protocol. Its
 * random temporary owner must never enter the published product inventory.
 * @param {string} path */
export function promoteTemporaryRoot(path) {
  const record = readTemporaryOwner(path);
  if (!record) throw new Error("Unowned temporary root cannot be promoted");
  const measured = temporaryInventory(path);
  rmSync(join(path, TEMPORARY_OWNER_FILE));
  ledger(record, path, "promoted", measured);
}

/** Links are counted as entries, never followed, including node_modules links.
 * @param {string} path @param {Set<string>} [excluded] @returns {Inventory} */
export function temporaryInventory(path, excluded = new Set()) {
  if (excluded.has(path)) return { files: 0, bytes: 0, directories: 0 };
  const info = lstatSync(path, { throwIfNoEntry: false });
  if (!info) return { files: 0, bytes: 0, directories: 0 };
  if (!info.isDirectory() || info.isSymbolicLink())
    return { files: 1, bytes: entryBytes(info), directories: 0 };
  const result = { files: 0, bytes: 0, directories: 1 };
  for (const name of readdirSync(path)) {
    const child = temporaryInventory(join(path, name), excluded);
    result.files += child.files;
    result.bytes += child.bytes;
    result.directories += child.directories;
  }
  return result;
}

/** Grants the owner read, write and search on every directory of a tree, never
 * on a link target or a file. `budget`, when given, is asked before each
 * entry, so a bounded removal can stop inside a large tree.
 * @param {string} path @param {RemovalOptions} [options] */
function makeTemporaryWritable(path, options = {}) {
  options.budget?.(path);
  const info = lstatSync(path, { throwIfNoEntry: false });
  if (!info?.isDirectory() || info.isSymbolicLink()) return;
  (options.chmod ?? chmodSync)(path, (info.mode & 0o777) | 0o700);
  for (const name of readdirSync(path))
    makeTemporaryWritable(join(path, name), options);
}

/** Removes a tree, or a single file, that its caller has already judged
 * removable: each directory is made writable, then each entry is deleted.
 * With a `budget`, both walks ask it before every entry, so a bounded removal
 * stops inside the tree, leaving it partly deleted at its path for the
 * caller's next run to judge and finish. Without one this is one recursive
 * rmSync. Links are deleted, never followed.
 * @param {string} path @param {RemovalOptions} [options] */
export function removeTree(path, options = {}) {
  makeTemporaryWritable(path, options);
  deleteEntry(path, options);
}

/** Explicit creator teardown. The pruning judge performs its additional
 * liveness/retention checks before calling this identity-checked remover.
 * @param {string} path @param {string} [token] @param {RemovalOptions} [options] */
export function removeTemporaryRoot(path, token, options) {
  requireTemporaryDirectory(path);
  const record = readTemporaryOwner(path);
  if (!record || (token !== undefined && token !== record.token))
    throw new Error("Temporary root ownership changed; retained");
  return removeVerifiedTemporaryRoot(path, record, options);
}

/** What a removal may be given by a prune: `budget`, called before each entry
 * is examined or deleted, throws once the prune's time is spent; `chmod`
 * replaces chmodSync wherever the removal grants the owner access (a
 * temporary root's walk for an entry that lacks it, removeTree's walk for
 * every directory), so a fixture can make a grant fail or see the walk reach
 * a path.
 * @typedef {{budget?: (path: string) => void, chmod?: (path: string, mode: number) => void}} RemovalOptions */

/** The bytes an entry holds: a file's allocated bytes up to its size, so a
 * sparse hole is not counted as written, and any other entry's size.
 * @param {import("node:fs").Stats} info */
const entryBytes = (info) =>
  info.isFile() && Number.isFinite(info.blocks)
    ? Math.min(info.size, info.blocks * 512)
    : info.size;

/** One walk before a removal, or before the byte proof of a root about to
 * go: an entry its owner cannot read is granted what reading and deleting
 * need, and every entry is counted as temporaryInventory counts it. Links are
 * counted, never followed or changed.
 * @param {string} path @param {RemovalOptions} [options] @returns {Inventory} */
export function prepareTemporaryRemoval(path, options = {}) {
  const walk = { ...options, repair: true };
  options.budget?.(path);
  const info = lstatSync(path);
  if (!info.isDirectory() || info.isSymbolicLink()) {
    if (info.isFile()) repairEntry(path, info, walk);
    return { files: 1, bytes: entryBytes(info), directories: 0 };
  }
  repairEntry(path, info, walk);
  const result = { files: 0, bytes: 0, directories: 1 };
  for (const name of readdirSync(path)) {
    const child = prepareTemporaryRemoval(join(path, name), options);
    result.files += child.files;
    result.bytes += child.bytes;
    result.directories += child.directories;
  }
  return result;
}

/** Deletes one entry of a root being removed. Without a budget this is the
 * recursive rmSync it always was; with one, each entry is deleted on its own
 * after the budget allows it, so a prune can stop inside a large root.
 * @param {string} path @param {RemovalOptions} options */
function deleteEntry(path, options) {
  if (!options.budget) {
    rmSync(path, { recursive: true, force: false });
    return;
  }
  options.budget(path);
  const info = lstatSync(path);
  if (info.isDirectory() && !info.isSymbolicLink()) {
    for (const name of readdirSync(path))
      deleteEntry(join(path, name), options);
    rmdirSync(path);
  } else rmSync(path, { force: false });
}

/** The path a root's ledger registered, or null where its ledger is gone.
 * @param {TemporaryRecord} record @returns {string|null} */
const registeredPathOf = (record) => {
  if (!existsSync(record.owner.repository)) return null;
  try {
    const first = readTemporarySegment(
      join(
        temporaryLedgerPath(record.owner.repository),
        `${record.token}.jsonl`,
      ),
    )[0];
    return first?.token === record.token && typeof first.path === "string"
      ? first.path
      : null;
  } catch {
    return null;
  }
};

/** @param {string} path @returns {unknown} */
const markerToken = (path) => {
  try {
    const marker = join(path, TEMPORARY_OWNER_FILE);
    const info = lstatSync(marker);
    return info.isFile() && !info.isSymbolicLink()
      ? JSON.parse(readFileSync(marker, "utf8")).token
      : null;
  } catch {
    return null;
  }
};

/** The act of a removal whose identity was read as `record`. Whatever holds
 * the path when the act starts is moved aside by one atomic rename, so what is
 * deleted is never chosen by a path a replacement could take after the
 * identity was read: the moved directory must carry the record's inode and its
 * marker the record's token, or it goes back to its path while that is still
 * free and nothing is deleted. A parent that refuses the rename refuses before
 * anything changes; a root already aside shows the same before any of it is
 * deleted. Nothing inside is touched before the root is verified: owned roots
 * nested in it go with it, and one that a stop leaves in its aside is bound
 * through its parent's registration (ledgerBinding). The place aside is
 * recorded before the rename, so their segments wait for it
 * (retireTemporaryLedger). Any failure after the rename
 * puts the root back at its path, and its owner record goes last, so a removal
 * that stops leaves a root its marker still names: at its path, or, stopped by
 * the process ending, aside where its ledger finds it (registeredTemporaryRoots).
 * So does a removal a prune's budget or an unrepairable entry stops: the
 * entries already deleted stay deleted, and the next prune finishes the rest.
 * @param {string} path @param {TemporaryRecord} record @param {RemovalOptions} [options] */
export function removeVerifiedTemporaryRoot(path, record, options = {}) {
  const aside = temporaryRemovalAside(path, record.token);
  // A root finished from its aside, or from inside a parent another stopped
  // removal left aside, is recorded under the path its ledger registered, so
  // that registration ends with it.
  const original = registeredPathOf(record);
  const registered =
    aside === path
      ? (original ?? path)
      : original !== null && relocatedRegistration(path) === original
        ? original
        : path;
  if (aside !== path) {
    ledger(record, registered, "moving", { aside });
    renameSync(path, aside);
  } else accessSync(dirname(path), constants.W_OK | constants.X_OK);
  const restore = () => {
    if (aside === path || lstatSync(path, { throwIfNoEntry: false })) return;
    try {
      renameSync(aside, path);
    } catch {
      // It stays aside, named by its token, with its contents intact.
    }
  };
  const info = lstatSync(aside);
  if (
    !info.isDirectory() ||
    info.isSymbolicLink() ||
    info.ino !== record.inode ||
    markerToken(aside) !== record.token
  ) {
    restore();
    throw new Error("Temporary root ownership changed; retained");
  }
  let measured;
  try {
    measured = prepareTemporaryRemoval(aside, options);
    // Measure before deletion; a failed removal keeps its attempted
    // inventory and never claims a successful deletion.
    ledger(record, registered, "removing", { ...measured, aside });
    for (const name of readdirSync(aside))
      if (name !== TEMPORARY_OWNER_FILE)
        deleteEntry(join(aside, name), options);
    rmSync(join(aside, TEMPORARY_OWNER_FILE));
    rmdirSync(aside);
  } catch (error) {
    restore();
    throw error;
  }
  ledger(record, registered, "removed", measured);
  return measured;
}

/** Whether a directory is what a removal leaves when it stops after deleting
 * the owner record and before the directory itself: named for a token's aside
 * and empty, so nothing in it remains to retain.
 * @param {string} path */
export function temporaryRemovalRemains(path) {
  if (!/^dotln-removing-[a-f0-9-]{36}$/u.test(basename(path))) return false;
  const info = lstatSync(path, { throwIfNoEntry: false });
  return Boolean(
    info?.isDirectory() && !info.isSymbolicLink() && !readdirSync(path).length,
  );
}

/** Removes such remains with rmdir, which refuses anything that has since
 * appeared inside, after checking the directory judged is the one present.
 * Where the given repository's ledger registers that token, its registration
 * ends here as removed.
 * @param {string} path @param {number} inode @param {string} repository */
export function removeTemporaryRemovalRemains(path, inode, repository) {
  requireTemporaryDirectory(path);
  const token = /^dotln-removing-([a-f0-9-]{36})$/u.exec(basename(path))?.[1];
  if (!token || !temporaryRemovalRemains(path) || lstatSync(path).ino !== inode)
    throw new Error("Removal remains changed; retained");
  rmdirSync(path);
  const first = existsSync(repository)
    ? readTemporarySegment(
        join(temporaryLedgerPath(repository), `${token}.jsonl`),
      )[0]
    : undefined;
  if (
    first?.token === token &&
    typeof first.path === "string" &&
    typeof first.owner?.repository === "string"
  )
    ledger(
      /** @type {TemporaryRecord} */ ({
        token,
        class: first.class,
        owner: first.owner,
      }),
      first.path,
      "removed",
      { files: 0, bytes: 0, directories: 1 },
    );
}

/** fs.rmSync-compatible creator cleanup, with measurements for owned material.
 * Removing unrelated files keeps fs.rmSync's ordinary behavior.
 * @param {import("node:fs").PathLike} path @param {import("node:fs").RmOptions} [options] */
export function removeTemporaryPath(path, options) {
  if (typeof path !== "string") return rmSync(path, options);
  const absolute = resolve(path);
  let record = null;
  let at = absolute;
  while (dirname(at) !== at) {
    if (lstatSync(at, { throwIfNoEntry: false })?.isDirectory()) {
      try {
        record = readTemporaryOwner(at);
      } catch {
        break;
      } // Copied fixture data does not govern explicit file mutations.
      if (record) break;
    }
    at = dirname(at);
  }
  if (!record) return rmSync(path, options);
  // Defer only to the gate whose ledger the creator is actually using. A
  // copied repository carrying an inherited gate id alone has no completion
  // that can see its local ledger, so its explicit teardown stays immediate.
  const context = ownerContext.getStore();
  const gateRepository =
    context?.gateId && context.gateId === record.owner.gateId
      ? context.repository
      : process.env.DOTLN_TEMP_GATE === record.owner.gateId
        ? process.env.DOTLN_TEMP_GATE_REPOSITORY
        : undefined;
  if (
    at === absolute &&
    options?.recursive &&
    record.class === "gate-fixture" &&
    record.owner.gateId &&
    gateRepository &&
    existsSync(gateRepository) &&
    realpathSync(gateRepository) === record.owner.repository &&
    !record.endedAt
  )
    return;
  const measured = temporaryInventory(absolute);
  rmSync(path, options);
  if (!existsSync(absolute)) ledger(record, absolute, "removed", measured);
}

/** @param {string} repository @returns {Array<Record<string, any>>} */
export function temporaryLedger(repository) {
  const directory = temporaryLedgerPath(repository);
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => /^[a-f0-9-]{36}\.jsonl$/.test(name))
    .flatMap((name) => readTemporarySegment(join(directory, name)));
}

/** Independent retirement can remove a listed segment before it is read.
 * @param {string} file @returns {Array<Record<string, any>>} */
const readTemporarySegment = (file) => {
  try {
    return readFileSync(file, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
      return [];
    throw error;
  }
};

/** Only an observed absence retires a segment; a path this process cannot
 * inspect may still hold its root.
 * @param {string} path */
const observedAbsent = (path) => {
  try {
    return !lstatSync(path, { throwIfNoEntry: false });
  } catch {
    return false;
  }
};

/** The segment's latest place aside that no later removal ended: where a
 * stopped removal moved its root, or null.
 * @param {Array<Record<string, any>>} rows @returns {Record<string, any>|null} */
const pendingAside = (rows) => {
  /** @type {Record<string, any> | null} */
  let pending = null;
  for (const row of rows)
    if (
      ["moving", "removing"].includes(row.action) &&
      typeof row.aside === "string"
    )
      pending = row;
    else if (["removed", "promoted"].includes(row.action)) pending = null;
  return pending;
};

/** Whether a root registered at `path` may still be present inside the place
 * a stopped removal moved one of its absent ancestors to, whichever
 * repository's ledger recorded that move: from the nearest ancestor that
 * exists, each missing component is looked for both where it was and inside
 * every removal aside beside it, and at the end the root is looked for at its
 * own place and its token's aside. A directory that cannot be read counts as
 * holding it, so only an observed absence lets its segment retire.
 * @param {string} path @param {string} token */
function heldByAncestorAside(path, token) {
  let base = dirname(path);
  while (dirname(base) !== base && observedAbsent(base)) base = dirname(base);
  const components = relative(base, path).split(sep);
  if (components.length < 2) return false;
  /** @param {string} directory @param {number} index @returns {boolean} */
  const search = (directory, index) => {
    const name = components[index] ?? "";
    if (index === components.length - 1)
      return [name, `dotln-removing-${token}`].some(
        (entry) => !observedAbsent(join(directory, entry)),
      );
    const next = join(directory, name);
    /** @type {import("node:fs").Stats | undefined} */
    let nextInfo;
    try {
      nextInfo = lstatSync(next, { throwIfNoEntry: false });
    } catch {
      return true;
    }
    if (
      nextInfo?.isDirectory() &&
      !nextInfo.isSymbolicLink() &&
      search(next, index + 1)
    )
      return true;
    /** @type {import("node:fs").Dirent[]} */
    let entries;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch {
      return true;
    }
    return entries.some(
      (entry) =>
        entry.isDirectory() &&
        /^dotln-removing-[a-f0-9-]{36}$/u.test(entry.name) &&
        search(join(directory, entry.name), index + 1),
    );
  };
  return search(base, 0);
}

/** Metrics are durable before a gate retires its completed segments. Other
 * cleanup retires only absent roots with a proven dead owner; live segments
 * are append-only and are never rewritten by a concurrent census. A segment
 * waits while its root may still be held inside a removal aside: its own,
 * wherever the removal recorded it, or an ancestor's. A caller that already
 * holds a process table passes it, so one observation serves a whole prune
 * (null is an unavailable table, which proves no owner dead); `gateIds`
 * retires several finished gates' segments in one reading of the ledger.
 * @param {string} repository @param {string} [gateId]
 * @param {{table?: ProcessIdentity[]|null, gateIds?: Set<string>}} [options] */
export function retireTemporaryLedger(repository, gateId, options = {}) {
  const directory = temporaryLedgerPath(repository);
  if (!existsSync(directory)) return;
  const table =
    options.table === undefined
      ? temporaryProcessTable(repository)
      : options.table;
  const gates = options.gateIds ?? (gateId ? new Set([gateId]) : null);
  const segments = readdirSync(directory)
    .filter((name) => /^[a-f0-9-]{36}\.jsonl$/.test(name))
    .map((name) => {
      const file = join(directory, name);
      return { file, rows: readTemporarySegment(file) };
    });
  // A parent whose removal moved it aside and stopped still holds the roots
  // nested in it; their segments wait while it is there.
  const asides = segments.flatMap(({ rows }) => {
    const pending = pendingAside(rows);
    return pending && !observedAbsent(pending.aside) ? [pending] : [];
  });
  for (const { file, rows } of segments) {
    const first = rows[0];
    if (!first) continue;
    // Only the gate, or a caller naming it as finished, may retire its
    // unfinished metrics.
    if (gates ? !gates.has(first.owner?.gateId) : first.owner?.gateId) continue;
    const terminal = rows.some(
      (row) =>
        row.path === first.path && ["removed", "promoted"].includes(row.action),
    );
    const own = pendingAside(rows);
    const absent =
      observedAbsent(first.path) &&
      observedAbsent(temporaryRemovalAside(first.path, first.token));
    const held =
      asides.some(
        (parent) =>
          first.path.startsWith(parent.path + sep) &&
          [first.path, temporaryRemovalAside(first.path, first.token)].some(
            (place) =>
              !observedAbsent(join(parent.aside, relative(parent.path, place))),
          ),
      ) ||
      // Its own removal stopped where it recorded the aside, as inside a
      // parent's aside, or a parent's move this ledger never saw holds it.
      (!terminal && own !== null && !observedAbsent(own.aside)) ||
      (!terminal && absent && heldByAncestorAside(first.path, first.token));
    if (
      !held &&
      (absent || terminal) &&
      (first.owner?.pid === process.pid ||
        ownerAlive({ owner: first.owner }, table) === false)
    )
      rmSync(file, { force: true });
  }
}

/** The ledger segment files of a repository, one per token. A prune reads
 * them one at a time, so its budget can stop the listing between two.
 * @param {string} repository @returns {string[]} */
export function temporaryLedgerSegments(repository) {
  const directory = temporaryLedgerPath(repository);
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => /^[a-f0-9-]{36}\.jsonl$/.test(name))
    .map((name) => join(directory, name));
}

/** The root one segment still registers, or null: its creation not followed
 * by a removal or promotion of that path, at its path or, where a stopped
 * removal left it, aside. A segment holds one token's rows.
 * @param {string} file @returns {Record<string, any>|null} */
export function registeredTemporaryRootOf(file) {
  /** @type {Record<string, any>|null} */
  let row = null;
  for (const entry of readTemporarySegment(file)) {
    if (entry.action === "created") row = entry;
    if (
      row !== null &&
      ["removed", "promoted"].includes(entry.action) &&
      row.token === entry.token &&
      row.path === entry.path
    )
      row = null;
  }
  if (!row) return null;
  // A root a stopped removal left aside is listed there, even when its path
  // now holds another root.
  const aside = temporaryRemovalAside(row.path, row.token);
  if (existsSync(aside)) return { ...row, path: aside };
  return existsSync(row.path) ? row : null;
}

/** Current root registrations, not individual file deletions.
 * @param {string} repository */
export function registeredTemporaryRoots(repository) {
  return temporaryLedgerSegments(repository).flatMap((file) => {
    const row = registeredTemporaryRootOf(file);
    return row ? [row] : [];
  });
}

/** File inventories count each deleted incarnation and remaining entries once;
 * overwrites and material removed outside the helper are explicitly unobserved.
 * @param {string} repository @param {string} gateId */
export function temporaryChurn(repository, gateId) {
  const rows = temporaryLedger(repository).filter(
    (row) => row.owner?.gateId === gateId,
  );
  const deleted = rows.filter((row) => row.action === "removed");
  const created = rows.filter((row) => row.action === "created");
  const promoted = rows.filter(
    (row) =>
      row.action === "promoted" &&
      !created.some(
        (parent) =>
          parent.path !== row.path && row.path.startsWith(parent.path + sep),
      ),
  );
  const liveRoots = registeredTemporaryRoots(repository).filter(
    (row) => row.owner?.gateId === gateId,
  );
  const remaining = liveRoots
    .filter(
      (row) =>
        !liveRoots.some(
          (parent) =>
            parent.path !== row.path && row.path.startsWith(parent.path + sep),
        ),
    )
    .map((row) => temporaryInventory(row.path));
  const filesDeleted = deleted.reduce((sum, row) => sum + (row.files ?? 0), 0);
  return {
    filesCreated:
      filesDeleted +
      [...remaining, ...promoted].reduce(
        (sum, row) => sum + (row.files ?? 0),
        0,
      ),
    filesDeleted,
    bytesWritten: [...deleted, ...remaining, ...promoted].reduce(
      (sum, row) => sum + (row.bytes ?? 0),
      0,
    ),
    source:
      "owned-root content inventories at helper removal and gate completion, capped by allocated bytes for sparse files; physical I/O, overwrites and uninstrumented removals unobserved",
  };
}

/** Gate-owned disposable material shares the suite's outcome even when it
 * lives outside a fixture directory. Caches and independent coordination
 * retain their own protocols.
 * @param {TemporaryRecord} record */
export const hasGateTemporaryLifetime = (record) =>
  Boolean(
    record.class === "gate-fixture" ||
    record.fixtureOwner ||
    (record.owner.gateId &&
      ["session-scratch", "worker-capture"].includes(record.class)),
  );

/** Normal completion and crash-recovery preview judge the same retention.
 * @param {TemporaryRecord} record @param {"passed"|"failed"|"abandoned"} outcome
 * @param {string} endedAt @returns {TemporaryRecord} */
export function temporaryOutcomeRecord(record, outcome, endedAt) {
  const policy = readRetention(record.owner.repository);
  const key =
    record.class === "gate-fixture" || hasGateTemporaryLifetime(record)
      ? outcome === "passed"
        ? "gate-fixture-passed"
        : "gate-fixture-failed"
      : record.class;
  const retentionHours = Object.hasOwn(record, "retentionOverride")
    ? (record.retentionOverride ?? null)
    : record.retentionHours === null &&
        record.class !== "coordination" &&
        !existsSync(record.owner.repository)
      ? null
      : hasGateTemporaryLifetime(record) &&
          record.class !== "coordination" &&
          record.class !== "gate-fixture" &&
          policy[record.class] === null
        ? null
        : policy[key];
  return {
    ...record,
    endedAt,
    endSource: "completion",
    outcome,
    retentionHours,
  };
}

/** @param {string} path @param {"passed"|"failed"} outcome @param {string} [endedAt] */
export function finishTemporaryRoot(
  path,
  outcome,
  endedAt = new Date().toISOString(),
) {
  const record = readTemporaryOwner(path);
  if (!record) throw new Error("Temporary root has no owner");
  // Retrying completion must not restart a diagnosis window. An earlier
  // authoritative end can correct a late recovery; an orphan observation
  // is provisional and yields to the actual completion.
  const completionTime =
    record.endSource === "completion" &&
    record.endedAt &&
    Date.parse(record.endedAt) <= Date.parse(endedAt)
      ? record.endedAt
      : endedAt;
  const finished = temporaryOutcomeRecord(record, outcome, completionTime);
  writeTemporaryOwner(path, finished);
  return finished;
}

/** @param {TemporaryRecord} record @param {number} [now] */
export function temporaryRetentionPassed(record, now = Date.now()) {
  return (
    record.retentionHours !== null &&
    now - Date.parse(record.endedAt ?? record.createdAt) >=
      record.retentionHours * 3_600_000
  );
}

/** The caller has established the end of this dispatch and released its
 * writer. Explicit teardown does not wait for the orphan-retention window;
 * a null window still preserves the class. Live worker processes retain
 * captures even after their supervising session has ended.
 * A turn-end caller supplies no dispatch completion; its live or unknown
 * host retains scratch for the next turn.
 * @param {string} repository @param {string} sessionId
 * @param {{dispatchEnded?: boolean}} [options] */
export function pruneSessionTemporaryRoots(
  repository,
  sessionId,
  { dispatchEnded = false } = {},
) {
  const session = hash(sessionId);
  const table = temporaryProcessTable(repository);
  /** @type {string[]} */
  const removed = [],
    retained = [];
  /** @type {Array<{path: string, reason: string}>} */
  const blockers = [];
  const roots = registeredTemporaryRoots(repository)
    .filter(
      (row) =>
        row.owner?.session === session &&
        ["session-scratch", "worker-capture"].includes(row.class),
    )
    .sort((a, b) => b.path.length - a.path.length);
  for (const row of roots) {
    try {
      const record = readTemporaryOwner(row.path);
      if (!record || record.token !== row.token)
        throw new Error("session root identity changed");
      if (
        record.retentionHours === null ||
        nestedTemporaryRoots(row.path).length ||
        ((!dispatchEnded || record.class === "worker-capture") &&
          ownerAlive(record, table) !== false)
      ) {
        retained.push(row.path);
        continue;
      }
      const completed = finishTemporaryRoot(row.path, "passed");
      if (completed.retentionHours === null) {
        retained.push(row.path);
        continue;
      }
      removeTemporaryRoot(row.path, record.token);
      removed.push(row.path);
    } catch (error) {
      retained.push(row.path);
      blockers.push({
        path: row.path,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  retireTemporaryLedger(repository, undefined, { table });
  return { removed, retained, blockers };
}

/** @param {string} path @param {number} pid */
export function assignTemporaryProcess(path, pid) {
  const record = readTemporaryOwner(path);
  if (!record) throw new Error("Temporary root has no owner");
  record.owner = {
    ...record.owner,
    ...temporaryProcessIdentity(pid, record.owner.repository),
  };
  writeTemporaryOwner(path, record);
}
