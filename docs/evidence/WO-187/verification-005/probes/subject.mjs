import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import {
  gateCodeIdentity,
  readGateChecks,
} from "../../../../../scripts/lib/gate-evidence.mjs";
import { coveringGateCheck } from "../../../../../scripts/lib/gate-reuse.mjs";
const root = process.cwd();
const codeIdentity = gateCodeIdentity(root);
const executor = JSON.parse(
  readFileSync("docs/evidence/WO-187/repair-004/review-gate.json", "utf8"),
).gate;
const result = await coveringGateCheck(
  root,
  "npm test",
  executor.requiredSuites,
  codeIdentity,
);
const summarize = (row) =>
  row
    ? Object.fromEntries(
        [
          "checkId",
          "codeIdentity",
          "durationMs",
          "exitCode",
          "executed",
          "recordedAt",
          "gateSelection",
          "executionMode",
          "freshSuites",
          "requiredSuites",
          "identityUnchanged",
        ].map((key) => [key, row[key]]),
      )
    : null;
const rows = readGateChecks(root).filter(
  (row) => row.codeIdentity === codeIdentity,
);
assert.ok(result.row);
assert.deepEqual(result.missing, []);
const output = {
  observedAt: new Date().toISOString(),
  codeIdentity,
  covering: {
    location: result.location,
    row: summarize(result.row),
    missing: result.missing,
  },
  executor: summarize(executor),
  latestDocument: summarize(
    rows.filter((row) => row.checkId === "npm run test:docs").at(-1),
  ),
};
writeFileSync(
  "docs/evidence/WO-187/verification-005/subject.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      codeIdentity,
      resultKeys: Object.keys(result),
      executor: summarize(executor),
      latestDocument: output.latestDocument,
    },
    null,
    2,
  ),
);
