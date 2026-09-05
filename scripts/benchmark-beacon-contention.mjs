import assert from "node:assert/strict";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from "node:worker_threads";
import {
  controlBeaconAddress,
  controlBeaconDirectory,
  sweepControlBeacons,
} from "../packages/skeleton/src/control-beacon-fs.mjs";
import {
  CONTROL_CODEBOOK,
  encodeControlBeacon,
} from "../packages/skeleton/src/control-codebook.mjs";
import {
  probeBeaconStorage,
  writeBeaconFile,
} from "../packages/skeleton/src/beacon-io.mjs";

// One request returns every member's observation. Workers have independent JS
// runtimes and share the filesystem cache; there are no writes in timed phases.
if (!isMainThread) {
  const { fixture, kind, requests } = workerData;
  const index = join(fixture, "index.json");
  const read =
    kind === "metadataSweep"
      ? () => sweepControlBeacons([{ worktree: fixture }])
      : () => JSON.parse(readFileSync(index, "utf8"));
  assert.deepEqual(read(), JSON.parse(readFileSync(index, "utf8")));
  for (let n = 0; n < 5; n++) read();
  parentPort.once("message", () => {
    const samples = [];
    let observationsRead = 0;
    for (let n = 0; n < requests; n++) {
      const start = performance.now();
      observationsRead += read().length;
      samples.push(performance.now() - start);
    }
    parentPort.postMessage({ samples, observationsRead });
    parentPort.close();
  });
  parentPort.postMessage("ready");
} else {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--smoke"))
    throw new Error(
      "usage: node scripts/benchmark-beacon-contention.mjs [--smoke]",
    );
  const smoke = args[0] === "--smoke";
  const requests = smoke ? 8 : 1000;
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-beacon-contention-")),
  );
  const round = async (fixture, members, readers, kind) => {
    const workers = [];
    let deadline;
    try {
      const ready = [];
      const results = [];
      for (let n = 0; n < readers; n++) {
        const worker = new Worker(new URL(import.meta.url), {
          workerData: {
            fixture,
            kind,
            requests:
              Math.floor(requests / readers) + (n < requests % readers ? 1 : 0),
          },
          resourceLimits: {
            maxOldGenerationSizeMb: 64,
            maxYoungGenerationSizeMb: 8,
            stackSizeMb: 4,
          },
        });
        workers.push(worker);
        ready.push(
          new Promise((resolve, reject) => {
            worker.once("message", (message) =>
              message === "ready"
                ? resolve()
                : reject(new Error("worker readiness protocol")),
            );
            worker.once("error", reject);
            worker.once("exit", (code) => {
              if (code) reject(new Error(`reader exited: ${code}`));
            });
          }),
        );
        results.push(
          new Promise((resolve, reject) => {
            worker.on("message", (message) => {
              if (message !== "ready") resolve(message);
            });
            worker.once("error", reject);
            worker.once("exit", (code) => {
              if (code) reject(new Error(`reader exited: ${code}`));
            });
          }),
        );
      }
      // Attach both groups before any worker can reject either promise.
      const completed = Promise.all(results);
      completed.catch(() => {});
      const timeout = new Promise((_, reject) => {
        deadline = setTimeout(
          () => reject(new Error("bounded reader case exceeded 30 seconds")),
          30000,
        );
      });
      await Promise.race([Promise.all(ready), timeout]);
      const cpu = process.cpuUsage();
      const start = performance.now();
      for (const worker of workers) worker.postMessage("start");
      const values = await Promise.race([completed, timeout]);
      const elapsedMs = performance.now() - start;
      const usedCpu = process.cpuUsage(cpu);
      const samples = values
        .flatMap((value) => value.samples)
        .sort((a, b) => a - b);
      assert.equal(samples.length, requests);
      assert.equal(
        values.reduce((sum, value) => sum + value.observationsRead, 0),
        members * requests,
      );
      return {
        requests,
        readers,
        equalObservationPayloads: true,
        elapsedMs: Number(elapsedMs.toFixed(2)),
        requestsPerSecond: Number(((requests / elapsedMs) * 1000).toFixed(1)),
        medianRequestMs: Number(
          samples[Math.floor(samples.length / 2)].toFixed(4),
        ),
        p95RequestMs: Number(
          samples[Math.ceil(samples.length * 0.95) - 1].toFixed(4),
        ),
        processCpuMs: Number(
          ((usedCpu.user + usedCpu.system) / 1000).toFixed(2),
        ),
      };
    } finally {
      clearTimeout(deadline);
      await Promise.allSettled(workers.map((worker) => worker.terminate()));
    }
  };
  try {
    const storage = probeBeaconStorage(root);
    const results = [];
    for (const members of smoke ? [12] : [12, 1000]) {
      const fixture = join(root, String(members));
      mkdirSync(fixture);
      const directory = controlBeaconDirectory(fixture);
      for (let n = 0; n < members; n++) {
        const state = {
          codebookVersion: 2,
          phase: CONTROL_CODEBOOK.phases[n % 8],
          latestVerdict: CONTROL_CODEBOOK.verdicts[n % 3],
          effort: CONTROL_CODEBOOK.efforts[n % 6],
          provenance: "host-projected",
        };
        writeBeaconFile(
          directory,
          controlBeaconAddress(`fixture-${n}`),
          {
            size: encodeControlBeacon(state),
            mtimeMs: 1200000,
            content: JSON.stringify(state),
          },
          { ...storage, sparse: false },
        );
      }
      writeFileSync(
        join(fixture, "index.json"),
        JSON.stringify(sweepControlBeacons([{ worktree: fixture }])),
      );
      for (const readers of smoke ? [1, 2] : [1, 2, 4]) {
        const result = { members, readers };
        const kinds =
          readers === 2
            ? ["singleJsonIndex", "metadataSweep"]
            : ["metadataSweep", "singleJsonIndex"];
        for (const kind of kinds)
          result[kind] = await round(fixture, members, readers, kind);
        results.push(result);
      }
    }
    console.log(
      JSON.stringify(
        {
          observedAt: new Date().toISOString(),
          node: process.version,
          platform: process.platform,
          scope:
            "warm-cache full-status reads; one timed batch per case; no concurrent writer; independent worker-thread JS runtimes in one process",
          sameDeviceAsCheckout:
            lstatSync(root).dev === lstatSync(process.cwd()).dev,
          limits: {
            maxReaderThreads: smoke ? 2 : 4,
            maxWorkerOldHeapMb: 64,
            caseTimeoutMs: 30000,
            totalRequestsPerCase: requests,
          },
          timing:
            "excludes fixture setup, worker startup and five warmups per reader; includes dispatch and completion messages in elapsed time; request latency starts when a worker begins that read",
          caveat:
            "1000 total requests per case, not 1000 simultaneous processes; no write contention, cold-cache, power-loss or multi-machine claim; 1000 members exercises individual beacons, beyond the 12-member group bound",
          results,
        },
        null,
        2,
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
