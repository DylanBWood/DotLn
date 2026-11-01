import { fork } from "node:child_process";
import { closeSync, mkdirSync, openSync, rmSync, writeSync } from "node:fs";
import { join } from "node:path";
import { streamObservation } from "./drive-stream.mjs";

export { commandFailed, researchCommandKind } from "./drive-diagnostics.mjs";

export const deadlineRefusal = Object.freeze({
  cause: "drive-deadline-exhausted",
  refused:
    "The configured drive deadline has elapsed; inspect its bound before re-entry.",
});

// Instance and caller clocks are independent ceilings. An absent clock is
// not a probe-sized default; a phase may need to await a complete gate.
export function phaseTimeLimit(
  configured,
  requested,
  deadlineAt,
  now = Date.now(),
) {
  const limits = [configured, requested].filter((value) => value != null);
  if (
    limits.some(
      (value) =>
        !Number.isSafeInteger(value) || value <= 0 || value > 2147483647,
    )
  )
    throw new Error(
      "A phase timeout must be a positive timer-safe integer or null",
    );
  if (deadlineAt != null && deadlineAt !== "") {
    const deadline = Number(deadlineAt);
    if (!Number.isSafeInteger(deadline) || deadline <= 0)
      throw new Error("Invalid drive deadline");
    limits.push(Math.max(0, deadline - now));
  }
  if (!limits.length) return null;
  const limit = Math.min(...limits);
  if (limit > 2147483647)
    throw new Error("Drive deadline exceeds the native timer range");
  return limit;
}

export function processRunning(pid) {
  if (!Number.isSafeInteger(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code !== "ESRCH";
  }
}

// The raw native stream and stderr of one phase, written beside the drive
// record while it runs. A declined or failed phase keeps them for diagnosis;
// a phase that ended normally removes them, so the ignored record holds no
// narrative it has no use for (WO-247-D003). The retention names only the
// files that were opened, and a capture that could not be written says so.
function phaseCapture(capture) {
  if (!capture?.directory || !capture.name) return null;
  const paths = {
    events: join(capture.directory, `${capture.name}.events.jsonl`),
    stderr: join(capture.directory, `${capture.name}.stderr.txt`),
  };
  const descriptors = {};
  let failed = false;
  const write = (name, chunk) => {
    try {
      if (!descriptors[name]) {
        mkdirSync(capture.directory, { recursive: true, mode: 0o700 });
        descriptors[name] = openSync(paths[name], "w", 0o600);
      }
      writeSync(descriptors[name], chunk);
    } catch {
      // A capture that cannot be written leaves the phase to run.
      failed = true;
    }
  };
  return {
    stdout: (chunk) => write("events", chunk),
    stderr: (chunk) => write("stderr", chunk),
    finish(keep) {
      for (const descriptor of Object.values(descriptors))
        try {
          closeSync(descriptor);
        } catch {}
      const opened = Object.keys(descriptors);
      if (!keep) {
        for (const name of opened) rmSync(paths[name], { force: true });
        return null;
      }
      return {
        ...Object.fromEntries(opened.map((name) => [name, paths[name]])),
        source: "native-stdout-and-stderr",
        ...(failed ? { captureFailed: true } : {}),
      };
    },
  };
}

// Supervise one native process. The stream observer reads what it says; this
// owns only its lifetime: the fork, the clocks, and the stops.
export async function launchPhase({
  args,
  cwd,
  launchpad = cwd,
  env,
  timeoutMs,
  deadlineAt,
  onSpawn,
  onSession,
  onSubagent,
  onCommand,
  protocol = "claude",
  command = "claude",
  launcherCommand = null,
  signal,
  capture,
}) {
  const started = Date.now();
  const appliedTimeoutMs = phaseTimeLimit(null, timeoutMs, deadlineAt, started);
  if (appliedTimeoutMs === 0) return { ...deadlineRefusal };
  const captured = phaseCapture(capture);
  const phaseDeadlineAt =
    appliedTimeoutMs === null ? null : started + appliedTimeoutMs;
  const child = fork(new URL("./drive-process.mjs", import.meta.url), [], {
    env,
    execArgv: [],
    stdio: ["ignore", "pipe", "pipe", "ipc"],
    detached: true,
  });
  const startedAt = new Date(started).toISOString();
  let buffer = "",
    stderrDiagnostic = "",
    timedOut = false,
    nativeExit,
    nativeSignal = null,
    nativePid,
    killTimer;
  const killNative = () => {
    if (!nativePid) return;
    try {
      process.kill(-nativePid, "SIGKILL");
    } catch {}
  };
  const stop = () => {
    if (child.connected) child.send({ type: "stop" }, () => {});
    else killNative();
    killTimer ??= setTimeout(() => {
      killNative();
      child.kill("SIGKILL");
    }, 5500);
  };
  const observation = streamObservation({
    protocol,
    launchpad,
    launcherCommand,
    onSession,
    onSubagent,
    onCommand,
    stop,
  });
  const { facts, inspect } = observation;
  const expire = () => {
    timedOut = true;
    if (
      deadlineAt != null &&
      deadlineAt !== "" &&
      Date.now() >= Number(deadlineAt)
    )
      Object.assign(facts, deadlineRefusal);
    stop();
  };
  let setupFailure;
  let setup = Promise.resolve();
  let ready = false;
  const pending = [];
  const ended = new Promise((resolve) => {
    child.stdout.on("data", (chunk) => {
      captured?.stdout(chunk);
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop();
      if (ready) lines.forEach(inspect);
      else pending.push(...lines);
    });
    child.stderr.on("data", (chunk) => {
      captured?.stderr(chunk);
      stderrDiagnostic = (stderrDiagnostic + chunk).slice(-8192);
      if (/cannot be used with/.test(stderrDiagnostic))
        facts.cause = "cli-argument-conflict";
    });
    child.on("error", () => {
      facts.error = true;
      facts.cause = "launch-failed";
    });
    child.on("message", (message) => {
      if (message.type === "spawned") {
        nativePid = message.pid;
        setup = Promise.resolve()
          .then(() => onSpawn?.(message.pid, { timeoutMs: appliedTimeoutMs }))
          .then(() => {
            ready = true;
            pending.splice(0).forEach(inspect);
          })
          .catch((failure) => {
            setupFailure = failure;
            stop();
          });
      }
      if (message.type === "deadline-expired") expire();
      if (message.type === "launch-error") {
        facts.error = true;
        facts.cause = "launch-failed";
      }
      if (message.type === "ended") {
        nativeExit = message.code;
        nativeSignal =
          message.signal == null
            ? null
            : [
                  "SIGTERM",
                  "SIGKILL",
                  "SIGINT",
                  "SIGHUP",
                  "SIGABRT",
                  "SIGSEGV",
                ].includes(message.signal)
              ? message.signal
              : "other";
      }
    });
    child.on("exit", () => {
      // Native pipes can outlive a crashed supervisor. Observe its exit before
      // close, and terminate the group whose PID came from our own spawn.
      if (nativeExit === undefined && nativePid) {
        facts.error = true;
        facts.cause = "supervisor-ended-before-worker";
        killNative();
      }
    });
    child.on("close", (exitCode) => {
      resolve({ exitCode: nativeExit === undefined ? exitCode : nativeExit });
    });
  });
  const timer =
    phaseDeadlineAt === null
      ? undefined
      : setTimeout(expire, Math.max(0, phaseDeadlineAt - Date.now()));
  const abort = () => {
    facts.cause = "owner-cancelled";
    stop();
  };
  signal?.addEventListener("abort", abort, { once: true });
  try {
    child.send(
      { type: "launch", command, args, cwd, deadlineAt: phaseDeadlineAt },
      () => {},
    );
    if (signal?.aborted) abort();
    const result = await ended;
    await setup;
    const endDeadline = Date.now() + 5000;
    while (processRunning(nativePid) && Date.now() < endDeadline)
      await new Promise((done) => setTimeout(done, 25));
    if (processRunning(nativePid))
      throw new Error(
        "Native worker end is unobserved; retain its reservation and recovery records.",
      );
    if (setupFailure) throw setupFailure;
    if (buffer) inspect(buffer);
    observation.observeStderrTail(stderrDiagnostic);
    const error = facts.error || result.exitCode !== 0;
    const retained = captured?.finish(error || Boolean(facts.refused)) ?? null;
    return {
      ...result,
      exitSignal: nativeSignal,
      error,
      ...(captured ? { retained } : {}),
      ...(facts.cause ? { cause: facts.cause } : {}),
      ...(facts.refused ? { refused: facts.refused } : {}),
      timedOut,
      timeoutMs: appliedTimeoutMs,
      workerStarted: Boolean(nativePid),
      workerEnded: true,
      costUsd: facts.costUsd,
      usage: facts.usage,
      ...observation.observed(),
      model: facts.model,
      nativeReadback: {
        effort: facts.effort,
        permissionMode: facts.permissionMode,
      },
      ...(facts.sessionId ? { sessionId: facts.sessionId } : {}),
      startedAt,
      finishedAt: new Date().toISOString(),
    };
  } catch (error) {
    captured?.finish(true);
    throw error;
  } finally {
    clearTimeout(timer);
    clearTimeout(killTimer);
    signal?.removeEventListener("abort", abort);
    if (child.connected) child.disconnect();
  }
}
