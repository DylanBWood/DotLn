import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  realpathSync,
  rmdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ensureTemporaryRoot,
  temporaryRepository,
} from "./temporary-root-records.mjs";

/** The process table's state column (`ps -o stat=` on macOS and Linux) opens
 * with `Z` for a zombie: a process that has exited and waits only for its
 * parent to collect its status. Signal zero still finds it, but it holds no
 * file, runs nothing and can write nothing again, so a writer reservation it
 * owns is stale however long its row lingers in the table.
 * @param {unknown} state */
export const zombieProcessState = (state) =>
  typeof state === "string" && state.trimStart().startsWith("Z");

/** One process's table state, or undefined when the table cannot say: an
 * absent row or a refused `ps` is unknown, never dead.
 * @param {number} pid */
export function processTableState(pid) {
  const result = spawnSync("ps", ["-o", "stat=", "-p", String(pid)], {
    encoding: "utf8",
    timeout: 5000,
  });
  const state = result.status === 0 ? result.stdout.trim() : "";
  return state || undefined;
}

/** @param {string} root @param {string} [repository] */
const transitionPaths = (root, repository = temporaryRepository()) => {
  const physical = realpathSync(root);
  const key = createHash("sha256").update(physical).digest("hex");
  const parent = join(
    tmpdir(),
    `dotln-writer-transition-${process.getuid?.() ?? "user"}`,
  );
  mkdirSync(parent, { recursive: true, mode: 0o700 });
  ensureTemporaryRoot(parent, {
    class: "coordination",
    repository,
    adoptExisting: true,
  });
  return {
    physical,
    lock: join(parent, key),
    registrations: join(parent, `${key}.registrations`),
  };
};
/** @param {string} root @param {string} physical */
const requireWorktree = (root, physical) => {
  if (realpathSync(root) !== physical || !existsSync(join(root, ".git")))
    throw new Error("writer worktree disappeared during registration");
};

/** Registration attempts may overlap: their existing conditional instance
 * protocol chooses the writer. A lease prevents teardown during that attempt.
 * Publishing the lease before checking the exclusive lock closes both races.
 * @template T
 * @param {string} root
 * @param {() => T} operation
 * @param {{repository?: string}} [options]
 * @returns {T}
 */
export function withWriterRegistration(root, operation, { repository } = {}) {
  const { physical, lock, registrations } = transitionPaths(root, repository);
  mkdirSync(registrations, { recursive: true, mode: 0o700 });
  const lease = join(registrations, randomUUID());
  mkdirSync(lease, { mode: 0o700 });
  try {
    if (lstatSync(lock, { throwIfNoEntry: false }))
      throw new Error(
        `writer registration or teardown in progress at ${lock} (or lock requires inspection)`,
      );
    requireWorktree(root, physical);
    return operation();
  } finally {
    rmdirSync(lease);
  }
}

/** Teardown excludes every registration attempt. Coordination lives outside
 * the subject so removing the subject cannot remove a lock or lease.
 * Abandoned locks or leases refuse; no process identity is guessed.
 * @template T
 * @param {string} root
 * @param {() => T} operation
 * @param {{requireGit?: boolean}} [options]
 * @returns {T}
 */
export function withWriterReservationLock(
  root,
  operation,
  { requireGit = true } = {},
) {
  const { physical, lock, registrations } = transitionPaths(root);
  try {
    mkdirSync(lock, { mode: 0o700 });
  } catch {
    throw new Error(
      `writer registration or teardown in progress at ${lock} (or lock requires inspection)`,
    );
  }
  try {
    if (existsSync(registrations) && readdirSync(registrations).length)
      throw new Error(
        `writer registration in progress at ${registrations} (or lease requires inspection)`,
      );
    // A waiter that resolved the path before another teardown cannot recreate it.
    if (requireGit) requireWorktree(root, physical);
    else if (realpathSync(root) !== physical)
      throw new Error("unregistered directory changed during teardown");
    return operation();
  } finally {
    rmdirSync(lock);
  }
}

/** Cleanup needs proof of no holder, not a guess about process liveness.
 * Honour both current directory instances and the legacy record. Malformed,
 * live, stale and unknown holders all preserve the worktree until released by
 * the existing writer protocol. @param {string} root
 */
export function writerTeardownBlocker(root) {
  const directory = join(root, "docs/control/local/harness");
  try {
    const legacy = join(directory, "writer.json");
    if (lstatSync(legacy, { throwIfNoEntry: false }))
      return "writer reservation (not proven released)";
    const current = join(directory, "writer");
    const metadata = lstatSync(current, { throwIfNoEntry: false });
    if (!metadata) return null;
    if (!metadata.isDirectory() || readdirSync(current).length)
      return "writer reservation (not proven released)";
    return null;
  } catch {
    return "writer reservation unreadable";
  }
}
