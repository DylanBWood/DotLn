// Re-run VER-006's immutable probes and assert the repaired outcomes.
// Disposable synthetic targets and doubles only; no native model or forge.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const rows = [];
for (const [file, args, check] of [
  [
    "verification-006-cleanup-probe.mjs",
    [],
    (actual) => {
      assert.equal(actual.episodes, 1);
      assert.equal(actual.durableVerdict, "acknowledge");
      assert.equal(actual.leftoverPartials, 1);
      for (const key of [
        "firstTerminal",
        "secondTerminal",
        "persistedTerminal",
      ])
        assert.equal(actual[key].kind, "resolved");
    },
  ],
  [
    "verification-006-boundary-probes.mjs",
    ["legacy-receipt"],
    (actual) => {
      assert.equal(actual.durableReceiptPresent, true);
      assert.equal(actual.candidateMatchesReceipt, true);
      assert.equal(actual.outcome.status, "observed");
      assert.equal(actual.dispatches, 1);
    },
  ],
]) {
  const startedAt = new Date().toISOString();
  const started = process.hrtime.bigint();
  const relative = `docs/evidence/WO-112/${file}`;
  const result = spawnSync(process.execPath, [relative, ...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 60_000,
    maxBuffer: 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  // The fixtures also print paths/diagnostics. Retain only their declared
  // synthetic result row, not private host paths or raw command output.
  const records = result.stdout
    .split("\n")
    .filter((line) => line.startsWith("{"));
  assert.equal(records.length, 1);
  const actual = JSON.parse(records[0]);
  check(actual);
  rows.push({
    command: ["node", relative, ...args],
    startedAt,
    completedAt: new Date().toISOString(),
    wallMs: Number(process.hrtime.bigint() - started) / 1e6,
    exitCode: result.status,
    actual,
  });
}
console.log(JSON.stringify({ schemaVersion: 1, rows }, null, 2));
