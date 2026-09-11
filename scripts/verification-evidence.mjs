#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { currentEvidence } from "../packages/skeleton/src/evidence-editions.mjs";
import { decodeLog, pendingCommands, replayOutbox } from "@dotln/kernel";
import { runVerificationDemo } from "../packages/skeleton/dist/src/verification-demo.js";
import { FakeVerificationTransport } from "../packages/skeleton/dist/src/verification-fake.js";
import {
  projectWorkerStatus,
  renderWorkerStatus,
} from "../packages/skeleton/dist/src/worker-status.js";
import { projectAcceptanceEvidenceMatrices } from "../packages/skeleton/dist/src/verification.js";

const mode = process.argv.slice(2);
if (mode.length !== 1 || !["--write", "--check"].includes(mode[0]))
  throw new Error(
    "usage: verification-evidence.mjs --write|--check (build first)",
  );
const repository = new URL("../", import.meta.url);
const root = new URL(
  `${currentEvidence(fileURLToPath(repository), "verification").directory}/`,
  repository,
);
const directory = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-verification-evidence-")),
);
const json = (value) => JSON.stringify(value, null, 2) + "\n";
try {
  let at = 1_000_000;
  let staleStatus;
  const observed = [];
  const result = await runVerificationDemo({
    directory,
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
    now: () => at++,
    onEvent: (event) => {
      observed.push(event);
      if (event.type === "VerificationSubjectSubmitted")
        staleStatus = projectWorkerStatus(observed);
    },
  });
  const events = decodeLog(result.log);
  assert.equal(result.matrix.phase, "complete");
  assert.ok(result.matrix.rows.every((row) => row.status === "verified"));
  assert.deepEqual(
    staleStatus.acceptanceEvidenceMatrices[0].rows.map((row) => row.status),
    ["stale", "stale", "verified"],
  );
  assert.equal(pendingCommands(replayOutbox(events)).length, 0);
  assert.deepEqual(projectAcceptanceEvidenceMatrices(events)[0], result.matrix);
  const files = new Map([
    ["events.jsonl", result.log],
    ["matrix.json", json(result.matrix)],
    ["stale-status.json", json(staleStatus)],
    ["stale-status.txt", renderWorkerStatus(staleStatus) + "\n"],
  ]);
  for (const [name, contents] of files) {
    const path = new URL(name, root);
    if (mode[0] === "--write") {
      mkdirSync(root, { recursive: true });
      writeFileSync(path, contents);
    } else
      assert.equal(
        readFileSync(path, "utf8"),
        contents,
        `stale verification evidence: ${name}`,
      );
  }
  console.log(
    `${mode[0] === "--write" ? "Recorded" : "Verified"} ${files.size} synthetic verification evidence files; planted defect, repair, staleness and replay are green.`,
  );
} finally {
  rmSync(directory, { recursive: true });
}
