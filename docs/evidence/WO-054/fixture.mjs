#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  chmodSync,
  lstatSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { decodeLog } from "@dotln/kernel";
import { projectAcceptanceEvidenceMatrices } from "../../../packages/skeleton/dist/src/verification.js";
import {
  openSnapshotDriver,
  sourceSnapshotFixture,
} from "../../../packages/skeleton/dist/test/verification-worktree-fixture.js";

const mode = process.argv[2];
assert.ok(
  ["--write", "--check"].includes(mode),
  "use --write or --check after building",
);
const fixture = await sourceSnapshotFixture();
const { store, driver, host } = openSnapshotDriver(fixture, "recorded-proof");
try {
  await host.run(fixture.prepared.snapshotPath, "synthetic", "unknown");
  const events = decodeLog(driver.log),
    matrix = projectAcceptanceEvidenceMatrices(events)[0];
  assert.equal(
    process.platform,
    "darwin",
    "the recorded first proof requires actual macOS confinement",
  );
  assert.equal(matrix.rows[0].status, "failed");
  assert.equal(fixture.result.observation.testAfter.exitCode, 0);
  assert.deepEqual(
    fixture.prepared.subject.evidence.map((e) => e.outcome),
    ["pass", "fail"],
  );
  const output = {
    schemaVersion: 1,
    provenance:
      "WO-052 scratch target; process-double implementer and verifier; real Git and confined host tests",
    projection:
      "Portable observed results. Physical paths, raw stdout/stderr, timestamps and random commit identities are omitted; this is not the raw capsule or event log.",
    profile: fixture.prepared.subject.snapshot.profile,
    contract: fixture.prepared.subject.snapshot.contract,
    files: fixture.prepared.subject.files,
    diff: fixture.prepared.subject.diff,
    observedCommitMatchesWorkerCommit:
      fixture.prepared.subject.revision === fixture.result.observation.commit,
    snapshotHashPresent: /^fnv1a64:[a-f0-9]{16}$/.test(
      fixture.prepared.subject.snapshot.snapshotHash,
    ),
    workerFocusedTestExitCode: fixture.result.observation.testAfter.exitCode,
    hostTests: fixture.prepared.subject.evidence.map((e) => ({
      checkId: e.checkId,
      source: e.source,
      origin: e.hostTest.origin,
      kind: e.hostTest.kind,
      command: e.hostTest.command,
      exitCode: e.hostTest.exitCode,
      signal: e.hostTest.signal,
      outcome: e.outcome,
      observed: e.observed,
      expected: e.expected,
    })),
    finding: matrix.findings.map(({ finding }) => ({
      criterionId: finding.criterionId,
      severity: finding.severity,
      expected: finding.expected,
      observed: finding.observed,
      likelySurface: finding.likelySurface,
      hasReproduction: finding.reproductionSteps.length > 0,
      hasEvidenceReferences: finding.evidenceRefs.length > 0,
    })),
    rowStatuses: matrix.rows.map((row) => ({
      criterionId: row.criterion.criterionId,
      status: row.status,
    })),
    phase: matrix.phase,
    eventTypes: events.map((event) => event.type),
  };
  const path = new URL("snapshot-proof.json", import.meta.url),
    text = JSON.stringify(output, null, 2) + "\n";
  if (mode === "--write") writeFileSync(path, text, { flag: "wx" });
  else assert.equal(readFileSync(path, "utf8"), text);
  console.log(
    `${mode === "--write" ? "Recorded" : "Checked"} WO-054 snapshot proof: worker pass, host contract failure, failing matrix.`,
  );
} finally {
  store.release();
  fixture.source.finish();
  const unlock = (path) => {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) return;
    chmodSync(path, stat.isDirectory() ? 0o700 : 0o600);
    if (stat.isDirectory())
      for (const name of readdirSync(path)) unlock(join(path, name));
  };
  unlock(fixture.root);
  rmSync(fixture.root, { recursive: true });
}
