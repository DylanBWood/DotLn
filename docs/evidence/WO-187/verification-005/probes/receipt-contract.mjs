import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { validatePlanResult } from "../../../../../packages/skeleton/dist/src/plan-refutation-protocol.js";
import { validateReceipt } from "../../../../../scripts/lib/plan-receipts.mjs";
const file =
  "docs/planning/refutations/2026-10-03-planning-90bdcd90e4af7f16-040.json";
const actual = JSON.parse(readFileSync(file, "utf8"));
await validateReceipt(process.cwd(), actual);
const results = [];
for (const [name, findings] of [
  ["missing", undefined],
  ["null", null],
  ["object", {}],
  ["explicit-empty", []],
]) {
  const candidate = structuredClone(actual.result);
  const order = candidate.orders.find((row) => row.workOrderId === "WO-187");
  if (findings === undefined) delete order.findings;
  else order.findings = findings;
  try {
    validatePlanResult(candidate, actual.subject);
    results.push({ name, accepted: true });
  } catch (error) {
    results.push({ name, accepted: false, error: error.message });
  }
}
assert.deepEqual(
  results.map((row) => row.accepted),
  [false, false, false, true],
);
const output = {
  observedAt: new Date().toISOString(),
  source: file,
  currentReceiptValid: true,
  canonicalFiling:
    "scripts/lib/plan-receipts.mjs validates result and receipt before writing",
  results,
};
writeFileSync(
  "docs/evidence/WO-187/verification-005/receipt-contract.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log(JSON.stringify(output, null, 2));
