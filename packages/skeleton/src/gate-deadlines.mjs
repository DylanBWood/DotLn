import childProcess from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { availableParallelism, loadavg } from "node:os";

// A scheduler declaration, not a host-speed detector. The factor includes two
// times the measured solo baseline per scheduler slot. Ordinary host commands
// retain their existing finite bounds. See WO-128's deadline inventory.
/** @param {NodeJS.ProcessEnv} [env] */
export function gateLoad(env = process.env) {
  const name = env.DOTLN_GATE_LOAD_CLASS;
  if (!name) return { name: "standalone", concurrency: 1, factor: 1 };
  const concurrency = Number(env.DOTLN_GATE_CONCURRENCY);
  if (
    !["shared", "isolated"].includes(name) ||
    !Number.isInteger(concurrency) ||
    concurrency < 1 ||
    concurrency > 4 ||
    (name === "isolated" && concurrency !== 1) ||
    Number(env.DOTLN_GATE_LOAD_FACTOR) !== concurrency * 2
  )
    throw new Error("Invalid scheduler deadline load declaration");
  return { name, concurrency, factor: concurrency * 2 };
}

/** Preserve the standalone bound; only measured work can derive a larger one.
 * @param {number} baselineMs @param {number} minimumMs
 * @param {NodeJS.ProcessEnv} [env] */
export function deadlineLimit(baselineMs, minimumMs, env = process.env) {
  if (
    !Number.isFinite(baselineMs) ||
    !Number.isFinite(minimumMs) ||
    !(baselineMs > 0) ||
    !(minimumMs > 0)
  )
    throw new Error(
      "Deadline baseline and minimum must be positive and finite",
    );
  const load = gateLoad(env);
  return load.name === "standalone"
    ? minimumMs
    : Math.ceil(Math.max(minimumMs, baselineMs * load.factor));
}

/** @param {string} value */
const safeName = (value) =>
  /^[a-zA-Z0-9_./:@-]{1,240}$/.test(value) ? value : "unavailable";

/** Numeric diagnostic only: no command, environment value, process identity,
 * arbitrary stack, source contents or private path is retained.
 * @param {string} site @param {number} timeoutMs
 * @param {{env?: NodeJS.ProcessEnv, now?: () => number}} [options] */
export function startDeadline(site, timeoutMs, options = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new Error("Deadline must be a positive finite duration");
  const env = options.env ?? process.env;
  const load = gateLoad(env);
  const now = options.now ?? (() => performance.now());
  const started = now();
  const startedAt = new Date().toISOString();
  let finished = false;
  const finish = (hit = false) => {
    const durationMs = Math.max(0, now() - started);
    let peers = [];
    let peerObservation = "unavailable";
    if (env.DOTLN_GATE_PEER_FILE) {
      try {
        const observed = JSON.parse(
          readFileSync(env.DOTLN_GATE_PEER_FILE, "utf8"),
        );
        if (
          Array.isArray(observed.tasks) &&
          observed.tasks.every(
            /** @param {unknown} name */ (name) => typeof name === "string",
          )
        ) {
          peers = observed.tasks
            .filter(
              /** @param {string} name */ (name) =>
                name !== env.DOTLN_GATE_TASK,
            )
            .map(safeName);
          peerObservation = "scheduler-current";
        }
      } catch {
        // Never infer an empty peer set when the current observation is absent.
      }
    }
    const hostLoadPerCpu = (loadavg()[0] ?? 0) / availableParallelism();
    const record = {
      site: safeName(site),
      task: safeName(env.DOTLN_GATE_TASK ?? "standalone"),
      timeoutMs,
      durationMs,
      startedAt,
      finishedAt: new Date().toISOString(),
      hit,
      loadClass: load.name,
      concurrency: load.concurrency,
      loadFactor: load.factor,
      concurrentTasks: peers,
      peerObservation,
      hostLoadPerCpu,
      classification: !hit
        ? "completed"
        : (peerObservation === "scheduler-current" &&
              peers.length >= load.concurrency) ||
            hostLoadPerCpu > 2
          ? "outside-declared-load"
          : "deadline-hit-cause-unestablished",
    };
    if (!finished) {
      finished = true;
      if (
        env.DOTLN_GATE_DEADLINE_LOG &&
        (hit || env.DOTLN_GATE_MEASURE_DEADLINES === "1")
      )
        appendFileSync(
          env.DOTLN_GATE_DEADLINE_LOG,
          JSON.stringify(record) + "\n",
          { mode: 0o600 },
        );
    }
    return record;
  };
  return {
    timeoutMs,
    finish,
    check() {
      if (now() - started < timeoutMs) return;
      const record = finish(true);
      throw new Error(
        `Deadline ${record.site} hit after ${record.durationMs.toFixed(1)} ms (bound ${timeoutMs} ms; ${record.classification})`,
      );
    },
  };
}

/** Stable source family, including built/pinned runtime copies. Line numbers
 * move on compilation and are deliberately not used as a baseline identity.
 * @param {string} operation @param {number} timeout */
function callerSite(operation, timeout) {
  const frames = new Error().stack?.split("\n").slice(2) ?? [];
  for (const frame of frames) {
    const match = /\/(scripts|packages|corpus)\/(.+?):\d+:\d+/.exec(frame);
    if (!match || match[2]?.split("/").at(-1) === "gate-deadlines.mjs")
      continue;
    const path = `${match[1]}/${match[2]}`
      .replace("/dist/", "/")
      .replace(/\.js$/, ".ts");
    return `${path}:${operation}:${timeout}`;
  }
  return `inline:${operation}:${timeout}`;
}

// Explicit imports preserve Node's normal startup environment and reuse rule.
// Untimed calls and standalone calls preserve the original API and options.
/** @param {"spawnSync" | "execFileSync"} operation @param {any[]} args */
function observedSync(operation, args) {
  const index = args.findIndex(
    (arg, i) => i > 0 && arg && typeof arg === "object" && !Array.isArray(arg),
  );
  const options = index >= 0 ? args[index] : null;
  const timeout = options?.timeout;
  const run = /** @type {(...values: any[]) => any} */ (
    childProcess[operation]
  );
  if (!timeout) return run(...args);
  const deadline = startDeadline(callerSite(operation, timeout), timeout);
  let hit = false;
  try {
    const result = run(...args);
    hit = result?.error?.code === "ETIMEDOUT";
    return result;
  } catch (error) {
    hit = /** @type {NodeJS.ErrnoException} */ (error).code === "ETIMEDOUT";
    throw error;
  } finally {
    deadline.finish(hit);
  }
}

export const observedSpawnSync = /** @type {typeof childProcess.spawnSync} */ (
  (...args) => observedSync("spawnSync", args)
);
export const observedExecFileSync =
  /** @type {typeof childProcess.execFileSync} */ (
    (...args) => observedSync("execFileSync", args)
  );

/** Async spawn's native timeout does not expose which signal source fired.
 * Own that same timer so a deadline hit is distinguished from a caller kill. */
/** @param {any[]} args */
function observedAsync(...args) {
  const run =
    /** @type {(...args: any[]) => import("node:child_process").ChildProcess} */ (
      childProcess.spawn
    );
  const index = args.findIndex(
    (arg, i) => i > 0 && arg && typeof arg === "object" && !Array.isArray(arg),
  );
  const options = index >= 0 ? args[index] : null;
  const timeout = options?.timeout;
  if (!timeout) return run(...args);
  const deadline = startDeadline(callerSite("spawn", timeout), timeout);
  const next = [...args];
  next[index] = { ...options, timeout: 0 };
  const child = run(...next);
  const timer = setTimeout(() => {
    deadline.finish(true);
    child.kill(options.killSignal ?? "SIGTERM");
  }, timeout);
  child.once("close", () => {
    clearTimeout(timer);
    deadline.finish();
  });
  return child;
}
export const observedSpawn = /** @type {typeof childProcess.spawn} */ (
  observedAsync
);
