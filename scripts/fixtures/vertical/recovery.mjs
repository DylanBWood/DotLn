// The real source host and transport wrapper, driven only by disposable writers.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { decodeLog } from "@dotln/kernel";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import {
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
import {
  createSourceFixture,
  sourceFixtureOptions,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";
import { verticalTransport } from "../../lib/vertical-transport.mjs";

const events = (root) =>
  decodeLog(readFileSync(join(root, "store/events.jsonl"), "utf8"));
const outcome = (promise) =>
  promise.then(
    (value) => ({ status: value.status }),
    (error) => ({ error: error.message }),
  );
export async function crashRecovery({
  wrapped = true,
  alive = false,
  mismatch = false,
  leaderless = false,
  beforeRecord = false,
  grandchild = false,
} = {}) {
  const root = createSourceFixture();
  let group;
  try {
    const writer = join(root, "hold.mjs");
    const ready = join(root, "writer-ready");
    const spawned = join(root, "spawned-group");
    const childScript = grandchild
      ? `const {spawn}=require('node:child_process'); const {writeFileSync}=require('node:fs'); const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'}); writeFileSync(${JSON.stringify(ready)},String(child.pid)); child.unref();`
      : "setInterval(()=>{},1000)";
    writeFileSync(
      writer,
      leaderless
        ? `import {spawn} from 'node:child_process'; import {writeFileSync} from 'node:fs';
          const child=spawn(process.execPath,['-e',${JSON.stringify(childScript)}],{stdio:'ignore'});
          ${grandchild ? "" : `writeFileSync(${JSON.stringify(ready)},String(child.pid));`} child.unref(); setTimeout(()=>process.exit(0),200);`
        : `import {writeFileSync} from 'node:fs'; writeFileSync(${JSON.stringify(ready)},String(process.pid)); process.stdin.resume(); setInterval(()=>{},1000);`,
    );
    const script = `
      import {SourceChangeHost} from ${JSON.stringify(new URL("../../../packages/skeleton/dist/src/source-change-host.js", import.meta.url).href)};
      import {sourceFixtureOptions} from ${JSON.stringify(new URL("../../../packages/skeleton/dist/test/source-change-fixture.js", import.meta.url).href)};
      import {CodexCliExecWorkOrderTransport, runWorkerProcess} from ${JSON.stringify(new URL("../../../packages/skeleton/dist/src/worker-transport.js", import.meta.url).href)};
      import {verticalTransport} from ${JSON.stringify(new URL("../../lib/vertical-transport.mjs", import.meta.url).href)};
      import {existsSync,writeFileSync} from 'node:fs';
      const inner = new CodexCliExecWorkOrderTransport(launch => {
        const run=runWorkerProcess({...launch, binary: process.execPath, args: [process.argv[2]]});
        writeFileSync(${JSON.stringify(spawned)},String(run.processGroup)); return run;
      }, '0.154.0');
      const options=sourceFixtureOptions(process.argv[1], () => 10);
      const append=options.store.append;
      options.store.append=event=>{ if (${beforeRecord} && event.type==='SourceChangeProcessStarted') process.kill(process.pid,'SIGKILL'); return append(event); };
      await new SourceChangeHost({...options,
        transport: ${wrapped} ? verticalTransport(inner, async () => true) : inner,
        onRunning() {
          if (!${leaderless}) process.kill(process.pid,'SIGKILL');
          else { const timer=setInterval(()=>{ if(existsSync(${JSON.stringify(ready)})) { clearInterval(timer); process.kill(process.pid,'SIGKILL'); } },5); }
        }}).run();`;
    const host = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script, root, writer],
      {
        encoding: "utf8",
        timeout: 30_000,
      },
    );
    const started = events(root).find(
      (event) => event.type === "SourceChangeProcessStarted",
    );
    group =
      started?.payload.processGroup ??
      (existsSync(spawned) ? Number(readFileSync(spawned, "utf8")) : undefined);
    if (leaderless || beforeRecord) {
      const { readHostSnapshot } = await import("../../lib/host-resources.mjs");
      const deadline = Date.now() + 5000;
      while (
        readHostSnapshot({ footprint: false }).processes.some(
          (row) => row.pid === group,
        )
      ) {
        if (Date.now() >= deadline)
          throw new Error("fixture leader did not exit");
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
    if (!alive && typeof group === "number") {
      try {
        process.kill(-group, "SIGKILL");
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    if (mismatch && started) {
      const { encodeLog } = await import("@dotln/kernel");
      writeFileSync(
        join(root, "store/events.jsonl"),
        encodeLog(
          events(root).map((event) =>
            event.type === "SourceChangeProcessStarted"
              ? {
                  ...event,
                  payload: {
                    ...event.payload,
                    processIdentity: { birth: "0.0", uniqueId: null },
                  },
                }
              : event,
          ),
        ),
      );
    }
    const writerStarted = existsSync(ready);
    const options = sourceFixtureOptions(root, () => 20);
    const recovery = await outcome(
      new SourceChangeHost({
        ...options,
        transport: wrapped
          ? verticalTransport(options.transport, async () => true)
          : options.transport,
      }).run(),
    );
    let writerAlive = false;
    if (typeof group === "number") {
      try {
        process.kill(-group, 0);
        writerAlive = true;
      } catch {}
    }
    return {
      case: grandchild
        ? "crash-grandchild-vertical"
        : beforeRecord
          ? "crash-before-start-record"
          : leaderless
            ? "crash-leaderless-vertical"
            : alive
              ? mismatch
                ? "identity-mismatch"
                : "crash-live-vertical"
              : wrapped
                ? "crash-vertical"
                : "crash-direct",
      hostSignal: host.signal,
      recordedProcessGroup: started?.payload.processGroup ?? null,
      processIdentityRecorded: !!started?.payload.processIdentity,
      writerStarted,
      ...(leaderless
        ? {
            descendantStopped: (() => {
              try {
                process.kill(Number(readFileSync(ready, "utf8")), 0);
                return false;
              } catch (error) {
                return error.code === "ESRCH";
              }
            })(),
          }
        : {}),
      recovery,
      writerAlive,
      processStoppedRecorded: events(root).some(
        (event) => event.type === "SourceChangeProcessStopped",
      ),
    };
  } finally {
    if (typeof group === "number")
      try {
        process.kill(-group, "SIGKILL");
      } catch {}
    rmSync(root, { recursive: true, force: true });
  }
}

export async function revokeRecovery() {
  const root = createSourceFixture();
  let dispatch;
  try {
    let allowed = true;
    const transport = verticalTransport(
      new CodexCliExecWorkOrderTransport(
        (launch) =>
          runWorkerProcess({
            ...launch,
            binary: process.execPath,
            args: ["-e", "setTimeout(() => {}, 60000)"],
          }),
        "0.154.0",
      ),
      async () => allowed,
    );
    const first = await outcome(
      new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10),
        transport,
        onRunning(run) {
          dispatch = run;
          setTimeout(() => {
            allowed = false;
          }, 20);
        },
      }).run(),
    );
    const rows = events(root);
    return {
      case: "revoke-vertical",
      first,
      recordedProcessGroup:
        rows.find((event) => event.type === "SourceChangeProcessStarted")
          ?.payload.processGroup ?? null,
      processStoppedRecorded: rows.some(
        (event) => event.type === "SourceChangeProcessStopped",
      ),
      workerInterruptedRecorded: rows.some(
        (event) => event.type === "WorkerInterrupted",
      ),
      workerInterruptionReason: rows.find(
        (event) => event.type === "WorkerInterrupted",
      )?.payload.reason,
    };
  } finally {
    dispatch?.kill();
    rmSync(root, { recursive: true, force: true });
  }
}
