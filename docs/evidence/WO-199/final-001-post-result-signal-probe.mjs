// FINAL-001 probe: a terminal-wide signal while the source host runs its
// synchronous post-result focused test. The real CLI runs in its own process
// group and the probe signals the whole group, as Ctrl-C reaches every process
// of a foreground job; the writer group is detached and is not signalled.
// Uses the order's CLI actor doubles; no model runs.
// Usage: node final-001-post-result-signal-probe.mjs <repo-root> <subject|subject-diag|head> [SIGNAL]
import { execFileSync, spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [repo, variant = "subject", signalName = "SIGINT"] =
  process.argv.slice(2);
if (!["subject", "subject-diag", "head"].includes(variant))
  throw new Error("variant is subject, subject-diag or head");
const at = (path) => pathToFileURL(join(repo, path)).href;
const { decodeLog } = await import(at("packages/kernel/dist/src/index.js"));
const { WorkerStore } = await import(
  at("packages/skeleton/dist/src/worker-store.js")
);
const { verticalFixture, runState, put } = await import(
  at("scripts/fixtures/vertical/fixture.mjs")
);
const { runVerticalIssue, readVerticalConfiguration } = await import(
  at("scripts/lib/vertical-runtime.mjs")
);
const DOUBLES = join(repo, "scripts/fixtures/vertical/interrupt-preload.mjs");
const SLOW = new URL("./final-001-slow-test-preload.mjs", import.meta.url)
  .pathname;
const CLI = join(repo, "packages/skeleton/dist/src/dotln.js");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** `done`'s value, or undefined once `ms` have passed; the timer never holds
 * the probe open after `done` settles. */
const within = (done, ms) => {
  let timer;
  return Promise.race([
    done,
    new Promise((resolve) => (timer = setTimeout(resolve, ms))),
  ]).finally(() => clearTimeout(timer));
};

function cli(f, settings, slow) {
  const child = spawn(
    process.execPath,
    [
      "--import",
      DOUBLES,
      "--import",
      SLOW,
      CLI,
      "vertical",
      "1",
      "--store",
      f.directory,
    ],
    {
      env: {
        ...process.env,
        DOTLN_LAUNCHPAD: f.launchpad,
        DOTLN_LIVE_WORKERS: "1",
        DOTLN_INTERRUPT_FIXTURE: settings,
        DOTLN_SLOW_TEST: slow,
        ...(variant === "subject-diag" ? { PROBE_SIGNAL_DIAG: "1" } : {}),
        ...(variant === "head" ? { PROBE_DROP_SIGNAL_LISTENERS: "1" } : {}),
      },
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    },
  );
  let stdout = "",
    stderr = "";
  child.stdout.on("data", (data) => (stdout += data));
  child.stderr.on("data", (data) => (stderr += data));
  const done = new Promise((resolve) =>
    child.once("close", (code, signal) =>
      resolve({ code, signal, stdout, stderr, endedAt: Date.now() }),
    ),
  );
  return { child, done };
}
const group = (pid) =>
  execFileSync("/bin/ps", ["-A", "-o", "pid=,ppid=,pgid=,command="], {
    encoding: "utf8",
  })
    .split("\n")
    .filter((line) => line.trim().split(/\s+/)[2] === String(pid))
    .map((line) => line.trim().replace(/\s+/g, " ").slice(0, 120));
const sourceRows = (f, key) =>
  decodeLog(
    new WorkerStore(join(f.directory, "vertical", key, "source")).read(),
  ).map((event) => ({
    type: event.type,
    ...(event.type === "SourceChangeObserved"
      ? { testAfter: event.payload.testAfter }
      : {}),
    ...(event.type === "SourceChangeRefused"
      ? { reason: event.payload.reason }
      : {}),
    ...(event.type === "WorkerInterrupted"
      ? { reason: event.payload.reason, signal: event.payload.signal ?? null }
      : {}),
  }));
const sourceReceipts = (f, key) => {
  const directory = join(f.directory, "vertical", key, "receipts");
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .map((name) => JSON.parse(readFileSync(join(directory, name), "utf8")))
    .filter((receipt) => receipt.command?.step === "source-change")
    .map((receipt) => ({
      result: receipt.result,
      testAfter: receipt.value?.testAfter,
    }));
};
const state = (f, key) => {
  const run = runState(f.directory, key);
  return {
    terminal: run.terminal?.kind ?? null,
    pending: run.pending?.step ?? null,
  };
};

const f = await verticalFixture();
const report = { variant, signal: signalName, startedAt: new Date() };
try {
  const before = await runVerticalIssue({
    directory: f.directory,
    issue: 1,
    configuration: readVerticalConfiguration(f.directory, f.launchpad),
    now: () => {
      f.tick();
      return f.now();
    },
    external: f.external,
    steps: 5,
  });
  const key = before.binding.key;
  report.lastStepBeforeCli = before.receipts.at(-1).command.step;
  const settings = join(f.root, "interrupt.json"),
    slow = join(f.root, "slow.json"),
    marker = join(f.root, "slow-test-started");
  put(settings, {
    at: f.now() + 1,
    ready: join(f.root, "ready"),
    sleep: false,
  });
  put(slow, { enabled: true, marker });
  const first = cli(f, settings, slow);
  const deadline = Date.now() + 60_000;
  while (!existsSync(marker) && Date.now() < deadline) await sleep(20);
  report.postResultTestStarted = existsSync(marker);
  await sleep(500);
  report.groupAtSignal = group(first.child.pid);
  const sentAt = Date.now();
  process.kill(-first.child.pid, signalName);
  const ended = await within(first.done, 30_000);
  if (!ended) first.child.kill("SIGKILL");
  report.firstRun = ended
    ? {
        exitCode: ended.code,
        exitSignal: ended.signal,
        exitAfterMs: ended.endedAt - sentAt,
        stderr: ended.stderr.trim().split("\n").slice(-2),
      }
    : { timedOutAfterMs: 30_000 };
  if (existsSync(`${marker}.diag`))
    report.diagnostics = readFileSync(`${marker}.diag`, "utf8")
      .trim()
      .split("\n");
  report.sourceEventsAfterSignal = sourceRows(f, key);
  report.stateAfterSignal = state(f, key);
  report.sourceReceiptAfterSignal = sourceReceipts(f, key);
  put(slow, { enabled: false, marker });
  put(settings, {
    at: f.now() + 2,
    ready: join(f.root, "ready"),
    sleep: false,
  });
  const rerun = cli(f, settings, slow);
  const resumed = await within(rerun.done, 120_000);
  if (!resumed) rerun.child.kill("SIGKILL");
  report.rerun = resumed
    ? { exitCode: resumed.code, exitSignal: resumed.signal }
    : { timedOutAfterMs: 120_000 };
  report.stateAfterRerun = state(f, key);
  report.sourceReceiptAfterRerun = sourceReceipts(f, key);
} finally {
  f.close();
}
report.finishedAt = new Date();
console.log(JSON.stringify(report, null, 2));
