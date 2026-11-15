import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd(),
  out = process.argv[2];
const imp = (name) => import(pathToFileURL(join(root, name)));
const { readControl } = await imp("scripts/lib/control-store.mjs");
const { readHandoffLedger, requireGateClaims, gateFields } = await imp(
  "scripts/lib/handoff-ledger.mjs",
);
const { gateCodeIdentity, readGateChecks } = await imp(
  "scripts/lib/gate-evidence.mjs",
);
const state = readControl(root).orders.get("WO-277").state;
const ledger = readHandoffLedger(root, state);
const productClaims = {
  checked: ledger.checked,
  claims: { ...ledger.claims, document: [] },
};
const coverage = await requireGateClaims(root, productClaims, {
  state,
  log: { warn: () => {} },
});
assert.deepEqual(coverage.advisories, []);
assert.ok(coverage.productGate);
const identity = gateCodeIdentity(root);
const rows = readGateChecks(root).filter(
  (row) => row.checkId === "npm test" && row.codeIdentity === identity,
);
const current = rows.findLast(
  (row) => row.recordedAt === coverage.productGate.recordedAt,
);
assert.ok(current);
assert.equal(current.exitCode, 0);
const selectedNames =
  /launchpad|sync-fixtures|registrations|test-target-worktree-close/u;
const fields = [
  "name",
  "exitCode",
  "executed",
  "reused",
  "startedAt",
  "finishedAt",
  "durationMs",
  "source",
  "sourceRecordedAt",
  "reusedFrom",
];
const selected = (row) =>
  (row.taskTimeline ?? row.cases ?? [])
    .filter((entry) => selectedNames.test(entry.name))
    .map((entry) =>
      Object.fromEntries(
        fields
          .filter((key) => entry[key] !== undefined)
          .map((key) => [key, entry[key]]),
      ),
    );
const result = {
  recordedAt: new Date().toISOString(),
  codeIdentity: identity,
  ledgerAdvisories: ledger.advisories,
  productClaims: productClaims.claims,
  coverage,
  currentRequiredSuites: current.requiredSuites,
  currentTaskFields: Object.keys(
    (current.taskTimeline ?? current.cases ?? [])[0] ?? {},
  ),
  relevantRuns: rows
    .filter(
      (row) => Date.parse(row.recordedAt) >= Date.parse("2026-11-15T15:00:00Z"),
    )
    .map((row) => ({
      ...gateFields(row),
      executionMode: row.executionMode,
      relevantTasks: selected(row),
    })),
};
writeFileSync(
  join(out, "gate-coverage.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      codeIdentity: identity,
      coverage,
      currentRequiredSuites: current.requiredSuites,
      currentTaskFields: result.currentTaskFields,
      relevantRuns: result.relevantRuns.map((row) => ({
        recordedAt: row.recordedAt,
        exitCode: row.exitCode,
        tasks: row.relevantTasks.length,
      })),
    },
    null,
    2,
  ),
);
