// The final review's reading of the gate ledger: the code identity of the
// reviewed tree, what the canonical claim reader says of the criteria that
// name npm test, every npm test row recorded at that identity, and the
// handoff's self-review line measured against the reader's bound. Run from
// the repository's root under the bounded wrapper, with the directory to
// write gate-rows.json into as its one argument.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const output = process.argv[2];
assert.ok(output, "usage: node gate-rows.mjs <output directory>");
const load = (name) => import(pathToFileURL(join(root, name)));
const { readControl } = await load("scripts/lib/control-store.mjs");
const { readHandoffLedger, requireGateClaims } = await load(
  "scripts/lib/handoff-ledger.mjs",
);
const { gateCodeIdentity, readGateChecks } = await load(
  "scripts/lib/gate-evidence.mjs",
);
const state = readControl(root).orders.get("WO-277").state;
const identity = gateCodeIdentity(root);
const ledger = readHandoffLedger(root, state);
// The product claims alone: the document row is judged for the final tree.
const coverage = await requireGateClaims(
  root,
  { checked: ledger.checked, claims: { ...ledger.claims, document: [] } },
  { state, log: { warn: () => {} } },
);
assert.deepEqual(coverage.advisories, []);
assert.equal(coverage.productGate.exitCode, 0);
assert.equal(coverage.productGate.codeIdentity, identity);
const line = readFileSync(join(root, ledger.path), "utf8")
  .split("\n")
  .find((text) => text.startsWith("self-review"));
const reason = /; unreviewed \d+ lines? \((.*)\)$/u.exec(line ?? "")?.[1];
const result = {
  recordedAt: new Date().toISOString(),
  codeIdentity: identity,
  claims: ledger.claims,
  productGate: coverage.productGate,
  npmTestRowsAtIdentity: readGateChecks(root)
    .filter(
      (row) => row.checkId === "npm test" && row.codeIdentity === identity,
    )
    .map((row) => ({
      recordedAt: row.recordedAt,
      exitCode: row.exitCode,
      executionMode: row.executionMode,
      durationMs: row.durationMs,
      treeHash: row.treeHash,
    })),
  handoffSelfReview: {
    ledgerAdvisories: ledger.advisories,
    linePresent: Boolean(line),
    lineCharacters: line?.length ?? null,
    reasonCharacters: reason?.length ?? null,
    readerReasonBound: 200,
  },
};
writeFileSync(
  join(output, "gate-rows.json"),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(
  JSON.stringify({
    codeIdentity: identity,
    productGate: coverage.productGate.recordedAt,
    rows: result.npmTestRowsAtIdentity.length,
    reasonCharacters: result.handoffSelfReview.reasonCharacters,
  }),
);
