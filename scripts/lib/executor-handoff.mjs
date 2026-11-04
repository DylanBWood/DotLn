import { dispatchJournalDirectory } from "../../packages/skeleton/src/dispatch-journal.mjs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Prepare before appending the completion event: missing release machinery must
// not produce a successful handoff with a reservation we cannot retire.
export async function executorWriterRelease(
  root,
  sessionId = process.env.CODEX_THREAD_ID ||
    process.env.COPILOT_AGENT_SESSION_ID,
) {
  if (!sessionId) return () => {};
  const runtime = join(root, "packages/skeleton/dist/src/harness-host.js");
  // The installed harness keeps reservations in its fixed physical lane,
  // whatever the configured document roots.
  const directory = dispatchJournalDirectory(root);
  if (!existsSync(runtime)) {
    if (
      existsSync(join(directory, "writer")) ||
      existsSync(join(directory, "writer.json"))
    )
      throw new Error(
        "Writer release runtime unavailable; completion not recorded",
      );
    return () => {};
  }
  const {
    releaseHarnessWriter,
    harnessWriterView,
    pruneCompletedHarnessSession,
  } = await import(pathToFileURL(runtime).href);
  if (
    typeof releaseHarnessWriter !== "function" ||
    typeof harnessWriterView !== "function"
  )
    throw new Error(
      "Writer release runtime incompatible; completion not recorded",
    );
  const actorId = createHash("sha256").update(sessionId).digest("hex");
  return () => {
    releaseHarnessWriter(root, {
      cwd: root,
      session_id: sessionId,
      hook_event_name: "Stop",
    });
    const writer = harnessWriterView(root);
    if (writer.reserved && writer.actorId === actorId)
      throw new Error(
        "Completion recorded but this session's writer reservation remains; do not repeat the transition",
      );
    if (typeof pruneCompletedHarnessSession === "function")
      console.log(
        pruneCompletedHarnessSession(root, sessionId, { dispatchEnded: true }),
      );
  };
}

const codexRuntime = async (root, names) => {
  const runtime = join(root, "packages/skeleton/dist/src/harness-host.js");
  if (!existsSync(runtime)) return null;
  const host = await import(pathToFileURL(runtime).href);
  return names.every((name) => typeof host[name] === "function") ? host : null;
};

/**
 * A Codex role command that is its whole phase, the release close, holds the
 * session's writer while it runs. It reserves at the start of an attempt, so
 * a retry after a stop holds the writer again or meets a foreign holder's
 * refusal before it acts. Claude and Copilot hooks reserve around their own
 * calls, so outside Codex this does nothing; a missing runtime leaves the
 * completion's own preparation to report it.
 */
export async function reserveCodexRoleCommand(
  root,
  sessionId = process.env.CODEX_THREAD_ID,
) {
  if (!sessionId) return;
  const host = await codexRuntime(root, ["reserveCodexDispatchWriter"]);
  host?.reserveCodexDispatchWriter(root, sessionId);
}

/**
 * The same reservation, made before the command moves its checkout. A close
 * loads built modules only after preparing the runtime, so this one runs the
 * built runtime as it stands in a child process: the retry meets a foreign
 * holder's refusal before it fetches, fast-forwards or rebuilds anything, and
 * the command's own process still loads its modules after the preparation.
 * A checkout whose runtime is missing, cannot load or cannot reserve is
 * judged from the reservation files themselves: the command proceeds, to
 * build and then reserve, only when no other session's reservation is there.
 */
export function reserveCodexRoleCommandBeforeLoad(
  root,
  sessionId = process.env.CODEX_THREAD_ID,
) {
  if (!sessionId) return;
  const runtime = join(root, "packages/skeleton/dist/src/harness-host.js");
  const reserved = existsSync(runtime)
    ? spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          'const [runtime, root, session] = process.argv.slice(1); let host; try { host = await import(runtime); } catch { process.exit(2); } if (typeof host.reserveCodexDispatchWriter !== "function") process.exit(2); try { host.reserveCodexDispatchWriter(root, session); } catch (error) { process.stderr.write(String(error?.message ?? error)); process.exit(1); }',
          pathToFileURL(runtime).href,
          root,
          sessionId,
        ],
        { cwd: root, encoding: "utf8", timeout: 60000 },
      )
    : { status: 2 };
  if (reserved.error) throw reserved.error;
  if (reserved.status === 2) return refuseForeignReservation(root, sessionId);
  if (reserved.status !== 0)
    throw new Error(
      reserved.stderr?.trim() ||
        `writer reservation exited ${reserved.status ?? reserved.signal}`,
    );
}

/**
 * Without a runtime that can reserve, the reservation files decide: no
 * reservation, or only this session's, lets the command go on to prepare the
 * runtime and reserve with it; any other, or one that cannot be read, refuses
 * before anything moves.
 */
function refuseForeignReservation(root, sessionId) {
  // The lane the runtime reserves in, not the configured control root.
  const directory = dispatchJournalDirectory(root);
  const actorId = createHash("sha256").update(sessionId).digest("hex");
  const files = [];
  try {
    const lock = join(directory, "writer");
    if (existsSync(lock))
      for (const name of readdirSync(lock)) files.push(join(lock, name));
    if (existsSync(join(directory, "writer.json")))
      files.push(join(directory, "writer.json"));
  } catch (error) {
    throw new Error(
      `this worktree's writer reservation cannot be read before release close moves main (${error.code ?? error.message}); nothing was changed`,
      { cause: error },
    );
  }
  const foreign = files.filter((file) => {
    try {
      return JSON.parse(readFileSync(file, "utf8")).actorId !== actorId;
    } catch {
      return true;
    }
  });
  if (foreign.length)
    throw new Error(
      `no built runtime in ${root} can reserve this session's writer, and the worktree holds a reservation that is not this session's; nothing was changed. Prepare the runtime with node scripts/bootstrap.mjs, inspect the holder with node scripts/harness.mjs writer --show, and retry release close.`,
    );
}

/**
 * The same command ended without its completion event: it is a stopped
 * dispatch, so this Codex session's own reservation is released and the stop
 * is journaled, and the host process that stays open holds nothing.
 */
export async function releaseStoppedCodexCommand(
  root,
  stop,
  sessionId = process.env.CODEX_THREAD_ID,
) {
  if (!sessionId) return null;
  const host = await codexRuntime(root, ["releaseStoppedDispatch"]);
  if (!host) return { held: null, released: false, runtime: "unavailable" };
  return host.releaseStoppedDispatch(root, sessionId, stop);
}

export async function refreshExecutorIndex(root) {
  const packagePath = join(root, "package.json");
  // Standalone lifecycle consumers need not install the repository index tool.
  if (
    !existsSync(packagePath) ||
    !JSON.parse(readFileSync(packagePath, "utf8")).scripts?.["work-orders"]
  )
    return;
  const { main } = await import(
    pathToFileURL(join(root, "scripts/work-orders.mjs")).href
  );
  main(["index"], root);
}
