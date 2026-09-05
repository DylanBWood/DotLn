import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "../packages/kernel/dist/src/index.js";
import { runWorkerDemo } from "../packages/skeleton/dist/src/worker-demo.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
} from "../packages/skeleton/dist/src/worker-transport.js";
import { WorkerStore } from "../packages/skeleton/dist/src/worker-store.js";
import { projectWorkerStatus } from "../packages/skeleton/dist/src/worker-status.js";
import { replayScenario } from "../packages/skeleton/dist/src/scenario.js";

if (process.env.DOTLN_LIVE_WORKERS !== "1")
  throw new Error(
    "live integration requires DOTLN_LIVE_WORKERS=1 and an authenticated nonsandboxed runner",
  );
const args = process.argv.slice(2);
const option = (key) => args[args.indexOf(key) + 1];
for (const key of ["--claude-model", "--codex-model", "--evidence"])
  assert.ok(args.includes(key) && option(key), `missing ${key}`);
const fixture = JSON.parse(
  readFileSync(
    new URL("../packages/skeleton/fixtures/repo-tree.json", import.meta.url),
    "utf8",
  ),
);
const statusCli = fileURLToPath(
  new URL("../packages/skeleton/dist/src/dotln.js", import.meta.url),
);
const evidence = {
  schemaVersion: 1,
  kind: "authenticated-live-models",
  observedAt: new Date().toISOString(),
  runs: [],
};
for (const transport of [
  new ClaudeCliPrintWorkOrderTransport(),
  new CodexCliExecWorkOrderTransport(),
]) {
  if (args.includes("--only") && option("--only") !== transport.name) continue;
  const directory = mkdtempSync("/private/tmp/dotln-live-worker-");
  const store = new WorkerStore(directory);
  const model = option(
    transport.name === "claude-cli-print" ? "--claude-model" : "--codex-model",
  );
  const effort = transport.name === "claude-cli-print" ? "high" : "unknown";
  const options = {
    directory,
    fixture,
    transport,
    model,
    effort,
    beacons: true,
  };
  let killed = false;
  if (args.includes("--kill-first") && transport.name === "claude-cli-print") {
    await assert.rejects(
      runWorkerDemo({
        ...options,
        onRunning: (dispatch) => setTimeout(() => dispatch.kill(), 1_500),
      }),
      /interrupted/u,
    );
    const interrupted = projectWorkerStatus(decodeLog(store.read()));
    assert.equal(interrupted.pendingCommands.length, 1);
    assert.equal(interrupted.episodes[0].phase, "interrupted");
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        Math.max(1, interrupted.episodes[0].leaseExpiresAt - Date.now() + 50),
      ),
    );
    killed = true;
  }
  let inFlight;
  let failure;
  const result = await runWorkerDemo({
    ...options,
    onRunning: () => {
      const before = store.read();
      const observation = spawnSync(
        process.execPath,
        [statusCli, "status", "--store", directory, "--json"],
        { encoding: "utf8" },
      );
      assert.equal(observation.status, 0);
      const status = JSON.parse(observation.stdout);
      assert.equal(status.runningEpisodes.length, 1);
      assert.equal(status.pendingCommands.length, 1);
      assert.equal(store.read(), before);
      inFlight = {
        running: status.runningEpisodes.length,
        pending: status.pendingCommands.length,
        phase: status.episodes.at(-1).phase,
        lastHeartbeatAt: status.episodes.at(-1).lastHeartbeatAt,
        leaseExpiresAt: status.episodes.at(-1).leaseExpiresAt,
        statusReadOnly: true,
      };
    },
  }).catch((error) => {
    failure = {
      code: error.code ?? "test-failure",
      detail: error.detail ?? "unavailable",
    };
  });
  if (!result) {
    const failed = {
      transport: transport.name,
      harnessVersion: transport.harnessVersion,
      model,
      effort,
      failure,
      inFlight,
    };
    evidence.runs.push(failed);
    console.log(JSON.stringify(failed));
    writeFileSync(
      resolve(option("--evidence")),
      JSON.stringify(evidence, null, 2) + "\n",
    );
    process.exitCode = 1;
    continue;
  }
  if (result.envelope.status !== "completed") {
    const blocked = {
      transport: transport.name,
      harnessVersion: transport.harnessVersion,
      model,
      effort,
      envelope: result.envelope,
      inFlight,
      completed: false,
    };
    evidence.runs.push(blocked);
    console.log(JSON.stringify(blocked));
    writeFileSync(
      resolve(option("--evidence")),
      JSON.stringify(evidence, null, 2) + "\n",
    );
    process.exitCode = 1;
    continue;
  }
  assert.ok(inFlight);
  assert.equal(result.envelope.status, "completed");
  assert.equal(result.scenario.verified, true);
  assert.deepEqual(
    result.scenario.candidates.map((candidate) => candidate.path),
    ["tmp/old-report.txt"],
  );
  assert.deepEqual(replayScenario(store.read()), result.scenario);
  const events = decodeLog(store.read());
  const status = projectWorkerStatus(events);
  assert.equal(status.runningEpisodes.length, 0);
  assert.equal(status.pendingCommands.length, 0);
  if (killed)
    assert.ok(events.some((event) => event.type === "WorkerLeaseExpired"));
  const run = {
    transport: transport.name,
    harnessVersion: transport.harnessVersion,
    model,
    effort,
    effectiveModel: "unknown",
    effectiveEffort: "unknown",
    envelope: result.envelope,
    inFlight,
    killedWorkerRecovered: killed,
    heartbeatCount: events.filter((event) => event.type === "WorkerHeartbeat")
      .length,
    compactEnvelopeBytes: Buffer.byteLength(JSON.stringify(result.envelope)),
    candidateCount: result.scenario.candidates.length,
    fakeVerifierAccepted: result.scenario.verified,
    replayIdentical: true,
    worktreeCleaned: events.some(
      (event) => event.type === "WorkerWorktreeRemoved",
    ),
    rawTranscriptRetainedInEvidence: false,
  };
  evidence.runs.push(run);
  // No tool transcript, provider session id, personal path or auth diagnostic.
  console.log(
    JSON.stringify({ transport: transport.name, envelope: result.envelope }),
  );
  writeFileSync(
    resolve(option("--evidence")),
    JSON.stringify(evidence, null, 2) + "\n",
  );
}
