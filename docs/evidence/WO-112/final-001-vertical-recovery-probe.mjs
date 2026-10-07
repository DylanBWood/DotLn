// FINAL-001 F1: a source-change writer dispatched through the vertical's
// transport wrapper (scripts/lib/vertical-transport.mjs) records no process
// group, so recovery cannot establish its termination.
//   crash-vertical / crash-direct: the host is SIGKILLed while its writer runs;
//     the writer then exits, and a fresh host recovers after the lease.
//   revoke-vertical: running authority ends while the writer runs.
// Synthetic writers and the skeleton's source fixture; no model or forge.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = fileURLToPath(new URL("../../../", import.meta.url));
const load = (path) => import(pathToFileURL(join(repo, path)).href);
const skeleton = (path) => join(repo, "packages/skeleton/dist", path);
const { decodeLog } = await load("packages/kernel/dist/src/index.js");
const { SourceChangeHost } = await load(
  "packages/skeleton/dist/src/source-change-host.js",
);
const { CodexCliExecWorkOrderTransport, runWorkerProcess } = await load(
  "packages/skeleton/dist/src/worker-transport.js",
);
const { createSourceFixture, sourceFixtureOptions } = await load(
  "packages/skeleton/dist/test/source-change-fixture.js",
);
const { verticalTransport } = await load("scripts/lib/vertical-transport.mjs");

const events = (root) =>
  decodeLog(readFileSync(join(root, "store/events.jsonl"), "utf8"));
const outcome = (promise) =>
  promise.then(
    (value) => ({ status: value.status }),
    (error) => ({ error: error.message }),
  );

async function crash(wrapped) {
  const root = createSourceFixture();
  const pidFile = join(root, "writer.pid");
  const writer = join(root, "writer.mjs");
  writeFileSync(
    writer,
    `import {writeFileSync} from 'node:fs'; writeFileSync(${JSON.stringify(pidFile)}, String(process.pid)); process.stdin.resume(); setInterval(() => {}, 1000);\n`,
  );
  const script = `
    import {SourceChangeHost} from ${JSON.stringify(pathToFileURL(skeleton("src/source-change-host.js")).href)};
    import {sourceFixtureOptions} from ${JSON.stringify(pathToFileURL(skeleton("test/source-change-fixture.js")).href)};
    import {CodexCliExecWorkOrderTransport, runWorkerProcess} from ${JSON.stringify(pathToFileURL(skeleton("src/worker-transport.js")).href)};
    import {verticalTransport} from ${JSON.stringify(pathToFileURL(join(repo, "scripts/lib/vertical-transport.mjs")).href)};
    const inner = new CodexCliExecWorkOrderTransport(launch => runWorkerProcess({...launch, binary: process.execPath, args: [process.argv[2]]}), '0.154.0');
    const transport = ${wrapped} ? verticalTransport(inner, async () => true) : inner;
    await new SourceChangeHost({...sourceFixtureOptions(process.argv[1], () => 10), transport,
      onRunning() { setTimeout(() => process.kill(process.pid, 'SIGKILL'), 200); }}).run();`;
  const host = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", script, root, writer],
    { encoding: "utf8", timeout: 30_000 },
  );
  const started = events(root).find(
    (event) => event.type === "SourceChangeProcessStarted",
  );
  const pid = existsSync(pidFile) ? Number(readFileSync(pidFile, "utf8")) : 0;
  // The orphaned writer then ends, as a finished or killed writer would.
  for (const target of [-pid, pid])
    try {
      if (pid) process.kill(target, "SIGKILL");
    } catch {}
  await new Promise((resolve) => setTimeout(resolve, 300));
  const recovery = await outcome(
    new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
  );
  rmSync(root, { recursive: true, force: true });
  return {
    case: wrapped ? "crash-vertical" : "crash-direct",
    hostSignal: host.signal,
    recordedProcessGroup: started?.payload.processGroup ?? "absent",
    recovery,
  };
}

async function revoke() {
  const root = createSourceFixture();
  let allowed = true;
  let t = 10;
  const sleeper = (launch) =>
    runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: ["-e", "setTimeout(() => {}, 60000)"],
    });
  const transport = verticalTransport(
    new CodexCliExecWorkOrderTransport(sleeper, "0.154.0"),
    async () => allowed,
  );
  setTimeout(() => (allowed = false), 400);
  const first = await outcome(
    new SourceChangeHost({
      ...sourceFixtureOptions(root, () => (t += 1)),
      transport,
    }).run(),
  );
  const types = events(root).map((event) => event.type);
  rmSync(root, { recursive: true, force: true });
  return {
    case: "revoke-vertical",
    first,
    recordedProcessGroup: types.includes("SourceChangeProcessStarted")
      ? "see crash cases"
      : "absent",
    processStoppedRecorded: types.includes("SourceChangeProcessStopped"),
    workerInterruptedRecorded: types.includes("WorkerInterrupted"),
    lastEvent: types.at(-1),
  };
}

for (const row of [await crash(true), await crash(false), await revoke()])
  console.log(JSON.stringify(row));
