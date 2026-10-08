// VER-003 variation probe, derived from FINAL-001's committed probe.
// Usage: node scripts/harness.mjs bounded -- node docs/evidence/WO-199/verification-003-variation-probe.mjs <repo-root> <host-only|rerun-reobserve|pre-dispatch>
import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [repo, variant] = process.argv.slice(2);
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
const HOLD = new URL("./verification-003-hold-preload.mjs", import.meta.url)
  .pathname;
const CLI = join(repo, "packages/skeleton/dist/src/dotln.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const within = (done, ms) => {
  let timer;
  return Promise.race([
    done,
    new Promise((r) => (timer = setTimeout(r, ms))),
  ]).finally(() => clearTimeout(timer));
};
function cli(f, settings, hold) {
  const child = spawn(
    process.execPath,
    [
      "--import",
      DOUBLES,
      "--import",
      HOLD,
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
        VER003_HOLD: hold,
      },
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    },
  );
  let stdout = "",
    stderr = "";
  child.stdout.on("data", (d) => (stdout += d));
  child.stderr.on("data", (d) => (stderr += d));
  const done = new Promise((resolve) =>
    child.once("close", (code, signal) =>
      resolve({ code, signal, stdout, stderr, endedAt: Date.now() }),
    ),
  );
  return { child, done };
}
const events = (f, key) =>
  decodeLog(
    new WorkerStore(join(f.directory, "vertical", key, "source")).read(),
  ).map(
    (e) =>
      e.type +
      (e.type === "WorkerInterrupted"
        ? `:${e.payload.reason}:${e.payload.signal ?? "-"}`
        : "") +
      (e.type === "SourceChangeRefused" ? `:${e.payload.reason}` : "") +
      (e.type === "SourceChangeIntegrityChecked"
        ? `:${e.payload.outcome}`
        : "") +
      (e.type === "SourceChangeObserved"
        ? `:exit=${e.payload.testAfter.exitCode}:sig=${e.payload.testAfter.signal}`
        : ""),
  );
const sourceReceipts = (f, key) => {
  const d = join(f.directory, "vertical", key, "receipts");
  if (!existsSync(d)) return [];
  return readdirSync(d)
    .map((n) => JSON.parse(readFileSync(join(d, n), "utf8")))
    .filter((r) => r.command?.step === "source-change")
    .map((r) => ({
      result: r.result,
      testAfter: r.value?.testAfter && [
        r.value.testAfter.exitCode,
        r.value.testAfter.signal,
      ],
    }));
};
const state = (f, key) => {
  const r = runState(f.directory, key);
  return {
    terminal: r.terminal?.kind ?? null,
    pending: r.pending?.step ?? null,
  };
};

const f = await verticalFixture();
const report = { variant, startedAt: new Date(), runs: [] };
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
    hold = join(f.root, "hold.json");
  const plan = {
    "host-only": [{ select: "post", target: "host", signal: "SIGTERM" }, null],
    "rerun-reobserve": [
      { select: "post", target: "group", signal: "SIGINT" },
      { select: "post", target: "group", signal: "SIGHUP" },
      null,
    ],
    "pre-dispatch": [
      { select: "pre", target: "group", signal: "SIGINT" },
      null,
    ],
  }[variant];
  for (const [index, step] of plan.entries()) {
    const marker = join(f.root, `held-${index}`);
    put(settings, {
      at: f.now() + 1 + index,
      ready: join(f.root, "ready"),
      sleep: false,
    });
    put(
      hold,
      step
        ? { enabled: true, select: step.select, marker }
        : { enabled: false, marker },
    );
    const run = cli(f, settings, hold);
    const row = { index, step };
    if (step) {
      const deadline = Date.now() + 60_000;
      while (!existsSync(marker) && Date.now() < deadline) await sleep(20);
      row.held = existsSync(marker);
      await sleep(500);
      const sentAt = Date.now();
      process.kill(
        step.target === "group" ? -run.child.pid : run.child.pid,
        step.signal,
      );
      const ended = await within(run.done, 30_000);
      if (!ended) {
        try {
          process.kill(-run.child.pid, "SIGKILL");
        } catch {}
      }
      row.exit = ended
        ? {
            code: ended.code,
            signal: ended.signal,
            afterMs: ended.endedAt - sentAt,
            stderr: ended.stderr.trim().split("\n").slice(-2),
          }
        : "timeout";
    } else {
      const ended = await within(run.done, 120_000);
      if (!ended) {
        try {
          process.kill(-run.child.pid, "SIGKILL");
        } catch {}
      }
      row.exit = ended
        ? {
            code: ended.code,
            signal: ended.signal,
            stderr: ended.stderr.trim().split("\n").slice(-2),
          }
        : "timeout";
    }
    row.events = events(f, key);
    row.state = state(f, key);
    row.receipts = sourceReceipts(f, key);
    row.writerAttempts = row.events.filter(
      (e) => e === "WorkerAttemptStarted",
    ).length;
    report.runs.push(row);
  }
} finally {
  f.close();
}
report.finishedAt = new Date();
console.log(JSON.stringify(report, null, 1));
