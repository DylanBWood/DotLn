#!/usr/bin/env node
// One explicit, detached live row; raw transport output stays ephemeral.
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import {
  mkdirSync,
  openSync,
  closeSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { ResidentHost } from "../packages/skeleton/dist/src/resident-host.js";
import {
  recordPresence,
  replayResident,
} from "../packages/skeleton/dist/src/resident-store.js";
import { actorFixture } from "../packages/skeleton/dist/test/resident-actors.fixture.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const local = join(root, "docs/control/local/wo122-live");
const output = join(root, "docs/evidence/WO-122/live.json");
if (process.argv[2] === "--child") {
  const f = actorFixture();
  // Keep the scratch worktree for inspection; only this ignored local record
  // contains its path. The public row contains shapes and explicit observations.
  writeFileSync(
    join(local, "scratch.json"),
    JSON.stringify({ root: f.root, worktree: f.cwd, store: f.directory }) +
      "\n",
    { mode: 0o600 },
  );
  f.request.model = "gpt-6-astra";
  f.request.effort = "xhigh";
  // decodeResidentConfiguration clones declarations, so update each actual input.
  for (const spec of Object.values(f.configuration.actors)) {
    spec.worker.request.model = f.request.model;
    spec.worker.request.effort = f.request.effort;
  }
  let at = 0;
  const host = new ResidentHost({
    ...f,
    policyId: f.configuration.policyId,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
  });
  const started = Date.now();
  try {
    await host.start();
    await recordPresence(f.directory, "away", () => at);
    at = 10;
    await host.tick();
    const state = replayResident(host.store.read()).state.resident;
    const event = decodeLog(host.store.read()).find(
      (e) => e.type === "CliWorkerObserved",
    );
    const worker = event?.payload.worker;
    const envelope = worker?.result?.envelope;
    const changed =
      readFileSync(join(f.cwd, "fixture.txt"), "utf8") ===
      "resident changed this fixture\n";
    let testPassed = false;
    try {
      execFileSync(process.execPath, ["fixture-test.mjs"], {
        cwd: f.cwd,
        stdio: "ignore",
      });
      testPassed = true;
    } catch {}
    const shape = (value) =>
      value === null
        ? "null"
        : Array.isArray(value)
          ? value.map(shape)
          : typeof value === "object"
            ? Object.fromEntries(
                Object.entries(value).map(([key, item]) => [key, shape(item)]),
              )
            : typeof value;
    const row = {
      workOrder: "WO-122",
      recordedAt: new Date().toISOString(),
      label:
        envelope && worker?.launch.origin === "actor" && state.present === false
          ? "observed"
          : "blocked",
      sourceRow: "X-U1",
      launch:
        "detached Node parent → resident → supervised Codex source-change-v1; no terminal",
      model: "gpt-6-astra",
      effort: "xhigh",
      harnessVersion: worker?.launch.harnessVersion ?? "unknown",
      operatorAwayBeforeAndAfter: state.present === false,
      origin: worker?.launch.origin ?? "unknown",
      profile: worker?.launch.profileId ?? "unknown",
      envelopeShape: envelope ? shape(envelope) : "absent",
      failure: worker?.failure ?? null,
      launchObserved: Boolean(event),
      envelopeValidated: Boolean(envelope),
      envelopeStatus: envelope?.status ?? "absent",
      hostChecks: {
        changed,
        testPassed,
        commitObserved: Boolean(envelope?.observedCommit),
        selfReportCompleted: envelope?.status === "completed",
        verifiedPromotion: state.machine.state !== "probe",
      },
      durationMs: Date.now() - started,
      limits: [
        "WO-122 verifies launch and envelope; edit/test/commit are separate host observations",
        "One synthetic scratch worktree and one real launch",
        "Authentication lifetime unknown",
        "Self-report is not independent source-change verification",
        "No raw transcript, paths or session/commit identities in this row",
      ],
    };
    writeFileSync(output, JSON.stringify(row, null, 2) + "\n");
    assert.equal(row.label, "observed");
    assert.equal(row.origin, "actor");
    assert.equal(row.operatorAwayBeforeAndAfter, true);
  } finally {
    host.close();
  }
} else {
  if (process.argv.length !== 2)
    throw new Error("usage: node scripts/evidence-resident-actors.mjs");
  mkdirSync(local, { recursive: true });
  mkdirSync(dirname(output), { recursive: true });
  const fd = openSync(join(local, "collector.log"), "w", 0o600);
  const child = spawn(
    process.execPath,
    [fileURLToPath(import.meta.url), "--child"],
    { cwd: root, detached: true, stdio: ["ignore", fd, fd] },
  );
  const code = await new Promise((done, reject) => {
    child.once("error", reject);
    child.once("close", done);
  });
  closeSync(fd);
  console.log(
    `WO-122 live collector exit ${code}; shapes-only row: docs/evidence/WO-122/live.json`,
  );
  process.exitCode = code ?? 1;
}
