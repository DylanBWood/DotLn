// Shared build-free implementation. Scripts and the compiled runtime write the
// same records; a missing process observation always preserves the directory.
import { createHash, randomUUID } from "node:crypto";
import {
  appendFileSync,
  chmodSync,
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
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { AsyncLocalStorage } from "node:async_hooks";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** @typedef {"gate-fixture"|"session-scratch"|"worker-capture"|"warm-fixture"|"coordination"} TemporaryClass */
/** @typedef {{pid: number|null, birth: string|null, repository: string, gateId?: string, suite?: string, session?: string}} TemporaryOwner */
/** @typedef {{schemaVersion: 1, token: string, class: TemporaryClass, owner: TemporaryOwner, createdAt: string, retentionHours: number|null, retentionOverride?: number|null, fixtureOwner?: {token: string, gateId: string, suite?: string}, device: number, inode: number, endedAt?: string, endSource?: "completion"|"owner-death-observation", outcome?: "passed"|"failed"|"abandoned", cacheKey?: string}} TemporaryRecord */
/** @typedef {{class: TemporaryClass, owner?: Partial<TemporaryOwner>, repository?: string, retentionHours?: number|null, cacheKey?: string, adoptExisting?: boolean}} TemporaryOptions */
/** @typedef {{pid: number, birth: string, ppid?: number, command?: string}} ProcessIdentity */
/** @typedef {{files: number, bytes: number, directories: number}} Inventory */

export const TEMPORARY_OWNER_FILE = ".dotln-owner.json";

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
});
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
    return validateRetention(JSON.parse(process.env.DOTLN_TEMP_RETENTION));
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
  return validateRetention(retention);
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

/** Nearest nested owner boundaries, including invalid markers. A parent must
 * not erase a descendant's independent retention or live ownership.
 * @param {string} path @returns {string[]} */
export function nestedTemporaryRoots(path) {
  const found = [];
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
    const child = join(path, entry.name);
    if (lstatSync(join(child, TEMPORARY_OWNER_FILE), { throwIfNoEntry: false }))
      found.push(child);
    else found.push(...nestedTemporaryRoots(child));
  }
  return found;
}

/** @param {string} path @returns {TemporaryRecord|null} */
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
    ![
      "gate-fixture",
      "session-scratch",
      "worker-capture",
      "warm-fixture",
      "coordination",
    ].includes(record.class) ||
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
    info.dev !== record.device ||
    info.ino !== record.inode
  )
    throw new Error(
      "Temporary owner record is invalid or the directory was replaced",
    );
  return record;
}

/** @param {string} path @param {TemporaryRecord} record */
export function writeTemporaryOwner(path, record) {
  requireTemporaryDirectory(path);
  const info = lstatSync(path);
  if (info.dev !== record.device || info.ino !== record.inode)
    throw new Error("Temporary directory identity changed");
  const file = join(path, TEMPORARY_OWNER_FILE);
  const partial = `${file}.${randomUUID()}.partial`;
  writeFileSync(partial, JSON.stringify(record) + "\n", {
    flag: "wx",
    mode: 0o600,
  });
  renameSync(partial, file);
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
    return {
      files: 1,
      bytes:
        info.isFile() && Number.isFinite(info.blocks)
          ? Math.min(info.size, info.blocks * 512)
          : info.size,
      directories: 0,
    };
  const result = { files: 0, bytes: 0, directories: 1 };
  for (const name of readdirSync(path)) {
    const child = temporaryInventory(join(path, name), excluded);
    result.files += child.files;
    result.bytes += child.bytes;
    result.directories += child.directories;
  }
  return result;
}

/** Change directory permissions only, never a link target or file contents.
 * @param {string} path */
export function makeTemporaryWritable(path) {
  const info = lstatSync(path, { throwIfNoEntry: false });
  if (!info?.isDirectory() || info.isSymbolicLink()) return;
  chmodSync(path, (info.mode & 0o777) | 0o700);
  for (const name of readdirSync(path)) makeTemporaryWritable(join(path, name));
}

/** Explicit creator teardown. The pruning judge performs its additional
 * liveness/retention checks before calling this identity-checked remover.
 * @param {string} path @param {string} [token] */
export function removeTemporaryRoot(path, token) {
  requireTemporaryDirectory(path);
  const record = readTemporaryOwner(path);
  if (!record || (token !== undefined && token !== record.token))
    throw new Error("Temporary root ownership changed; retained");
  makeTemporaryWritable(path);
  const measured = temporaryInventory(path);
  // Measure before deletion; a failed removal keeps its attempted inventory
  // and never claims a successful deletion.
  ledger(record, path, "removing", measured);
  rmSync(path, { recursive: true, force: false });
  ledger(record, path, "removed", measured);
  return measured;
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

/** Metrics are durable before a gate retires its completed segments. Other
 * cleanup retires only absent roots with a proven dead owner; live segments
 * are append-only and are never rewritten by a concurrent census.
 * @param {string} repository @param {string} [gateId] */
export function retireTemporaryLedger(repository, gateId) {
  const directory = temporaryLedgerPath(repository);
  if (!existsSync(directory)) return;
  const table = temporaryProcessTable(repository);
  for (const name of readdirSync(directory).filter((name) =>
    /^[a-f0-9-]{36}\.jsonl$/.test(name),
  )) {
    const file = join(directory, name);
    const rows = readTemporarySegment(file);
    const first = rows[0];
    if (!first || (gateId && first.owner?.gateId !== gateId)) continue;
    if (!gateId && first.owner?.gateId) continue; // Only the gate may retire unfinished metrics.
    const terminal = rows.some(
      (row) =>
        row.path === first.path && ["removed", "promoted"].includes(row.action),
    );
    if (
      (!existsSync(first.path) || terminal) &&
      (first.owner?.pid === process.pid ||
        ownerAlive({ owner: first.owner }, table) === false)
    )
      rmSync(file, { force: true });
  }
}

/** Current root registrations, not individual file deletions.
 * @param {string} repository */
export function registeredTemporaryRoots(repository) {
  const roots = new Map();
  for (const row of temporaryLedger(repository)) {
    if (row.action === "created") roots.set(row.token, row);
    if (
      ["removed", "promoted"].includes(row.action) &&
      roots.get(row.token)?.path === row.path
    )
      roots.delete(row.token);
  }
  return [...roots.values()].filter((row) => existsSync(row.path));
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
  retireTemporaryLedger(repository);
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
