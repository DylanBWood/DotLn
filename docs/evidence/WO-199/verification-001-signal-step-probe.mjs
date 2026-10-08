// VER-001: signal a real `dotln vertical` while a non-writer judgment step is
// in flight, and time the host's exit. The writer step already completed in the
// same run. The signal goes to the host's pid alone, as `kill <pid>` or a
// process supervisor sends it. Run:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-199/verification-001-signal-step-probe.mjs
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  verticalFixture,
  runState,
  put,
} from "../../../scripts/fixtures/vertical/fixture.mjs";
import {
  runVerticalIssue,
  readVerticalConfiguration,
} from "../../../scripts/lib/vertical-runtime.mjs";

const cli = fileURLToPath(
  new URL("../../../packages/skeleton/dist/src/dotln.js", import.meta.url),
);
const preload = fileURLToPath(
  new URL("./verification-001-signal-step-preload.mjs", import.meta.url),
);
const DELAY = 30_000;

async function trial(signal, dropListeners) {
  const f = await verticalFixture();
  let child;
  try {
    const state = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: readVerticalConfiguration(f.directory, f.launchpad),
      now: f.now,
      external: f.external,
      steps: 5,
    });
    const settings = join(f.root, "interrupt.json"),
      marker = join(f.root, "judgment-marker");
    put(settings, {
      at: f.now() + 1,
      ready: join(f.root, "writer-ready"),
      sleep: false,
    });
    const run = (delay) => {
      child = spawn(
        process.execPath,
        ["--import", preload, cli, "vertical", "1", "--store", f.directory],
        {
          env: {
            ...process.env,
            DOTLN_LAUNCHPAD: f.launchpad,
            DOTLN_LIVE_WORKERS: "1",
            DOTLN_INTERRUPT_FIXTURE: settings,
            PROBE_JUDGMENT_MARKER: marker,
            PROBE_JUDGMENT_DELAY_MS: String(delay),
            PROBE_DROP_SIGNAL_LISTENERS: dropListeners ? "1" : "0",
          },
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      let stderr = "";
      child.stderr.on("data", (data) => (stderr += data));
      child.stdout.resume();
      return new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("close", (code, closed) =>
          resolve({ code, signal: closed, stderr }),
        );
      });
    };
    const first = run(DELAY);
    const deadline = Date.now() + 60_000;
    while (!existsSync(marker) && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 20));
    if (!existsSync(marker)) throw new Error("no judgment step reached");
    const pendingWhenSignalled = runState(f.directory, state.binding.key)
      .pending?.step;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const sentAt = Date.now();
    child.kill(signal);
    const result = await first;
    const exitAfterSignalMs = Date.now() - sentAt;
    const after = runState(f.directory, state.binding.key);
    return {
      variant: dropListeners
        ? "HEAD disposition (dotln vertical signal listeners dropped)"
        : "subject",
      signal,
      judgmentDelayMs: DELAY,
      pendingWhenSignalled: pendingWhenSignalled ?? null,
      exitAfterSignalMs,
      exitCode: result.code,
      exitSignal: result.signal,
      stderrTail: result.stderr.trim().split("\n").slice(-1),
      pendingAfter: after.pending?.step ?? null,
      terminalAfter: after.terminal?.kind ?? null,
    };
  } finally {
    child?.kill("SIGKILL");
    f.close();
  }
}

for (const [signal, drop] of [
  ["SIGTERM", false],
  ["SIGINT", false],
  ["SIGHUP", false],
  ["SIGTERM", true],
])
  console.log(JSON.stringify(await trial(signal, drop)));
