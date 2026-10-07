// VER-006: parent reproductions of the fresh adversary, with a variable episode duration.
// Synthetic saved-state and clock variations; no native model or remote effects.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  decodeLog,
  encodeLog,
} from "../../../packages/kernel/dist/src/index.js";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import {
  createSourceFixture,
  sourceFixtureOptions,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";
import {
  verticalFixture,
  put,
} from "../../../scripts/fixtures/vertical/fixture.mjs";
import {
  readVerticalConfiguration,
  createVerticalEntry,
} from "../../../scripts/lib/vertical-runtime.mjs";
import { ResidentHost } from "../../../packages/skeleton/dist/src/resident-host.js";
import { recordPresence } from "../../../packages/skeleton/dist/src/resident-store.js";
import { verticalResident } from "../../../packages/skeleton/dist/src/vertical-resident.js";
import { WorkerFailure } from "../../../packages/skeleton/dist/src/worker-protocol.js";

if (process.argv[2] === "legacy-receipt") {
  const root = createSourceFixture();
  try {
    const options = sourceFixtureOptions(root, () => 10);
    await assert.rejects(
      () =>
        new SourceChangeHost({
          ...options,
          afterReceiptSaved() {
            throw new Error("simulated host stop");
          },
        }).run(),
      /simulated host stop/,
    );
    const receiptName = readdirSync(join(root, "store")).find((name) =>
      name.endsWith(".source-change.json"),
    );
    assert.ok(receiptName, "the durable receipt exists");
    const logFile = join(root, "store", "events.jsonl");
    const legacyEvents = decodeLog(readFileSync(logFile, "utf8"))
      .filter(
        (event) =>
          ![
            "SourceChangeProcessStarted",
            "SourceChangeProcessStopped",
            "SourceChangeIntegrityChecked",
            "WorkerInterrupted",
          ].includes(event.type),
      )
      .map((event, index) => {
        const { sharedState, ...payload } = event.payload;
        return { ...event, eventId: `evt_${index + 1}`, payload };
      });
    writeFileSync(logFile, encodeLog(legacyEvents));
    decodeLog(readFileSync(logFile, "utf8"));
    const saved = JSON.parse(
      readFileSync(join(root, "store", receiptName), "utf8"),
    );
    const recovering = new SourceChangeHost(
      sourceFixtureOptions(root, () => 6000),
    );
    assert.deepEqual(recovering.tree.effect(), {
      commit: saved.observation.commit,
      diffHash: saved.observation.diffHash,
    });
    let outcome;
    try {
      outcome = await recovering.run();
    } catch (error) {
      outcome = { thrown: error.message };
    }
    console.log(
      JSON.stringify({
        probe: "legacy-receipt",
        durableReceiptPresent: true,
        candidateMatchesReceipt: true,
        outcome,
        dispatches: readFileSync(join(root, "launches.txt"), "utf8")
          .trim()
          .split("\n").length,
      }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
} else if (process.argv[2] === "slow-intake-backoff") {
  const f = await verticalFixture();
  let host;
  let episodes = 0;
  const launchesAt = [];
  try {
    const { number, draftId } = f.config.issues[0];
    f.config.issues[0] = { number, draftId, intake: "model" };
    put(join(f.directory, "vertical.json"), f.config);
    const judge = {
      name: "fake",
      harnessVersion: "not-applicable",
      dispatch(request, clock) {
        episodes++;
        launchesAt.push(f.now());
        const completed = Promise.resolve().then(() => {
          f.setTime(f.now() + Number(process.argv[3] ?? 2500));
          throw new WorkerFailure("interrupted", "synthetic slow interruption");
        });
        void completed.catch(() => {});
        return {
          receipt: Promise.resolve({
            commandId: request.command.commandId,
            transport: "fake",
            acceptedAt: clock(),
          }),
          completed,
          alive: () => false,
          kill() {},
        };
      },
    };
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge },
    });
    host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: verticalResident(entry.ports, entry.runs, { steps: 1 }),
    });
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 30 && episodes === 0; i++) {
      f.setTime(120 + i);
      await host.tick();
    }
    assert.equal(episodes, 1);
    const firstFinishedAt = f.now();
    // Do not advance time after the interruption: this is the next immediate tick.
    await host.tick();
    console.log(
      JSON.stringify({
        probe: "slow-intake-backoff",
        firstFinishedAt,
        launchesAt,
        episodeDurationMs: Number(process.argv[3] ?? 2500),
        episodesAfterImmediateNextTick: episodes,
        expectedFirstRetryNotBefore: firstFinishedAt + 1000,
      }),
    );
  } finally {
    host?.close();
    f.close();
  }
} else {
  throw new Error("select legacy-receipt or slow-intake-backoff");
}
