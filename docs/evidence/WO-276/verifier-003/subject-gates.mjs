import { readFileSync, writeFileSync } from "node:fs";
import {
  gateCodeIdentity,
  gateTreeHash,
  readGateChecks,
  findGateCheck,
  gateCheckStands,
} from "../../../../scripts/lib/gate-evidence.mjs";
import {
  readPreflightSuites,
  requireDocumentRow,
} from "../../../../scripts/lib/handoff-ledger.mjs";
const root = process.cwd();
const identity = gateCodeIdentity(root),
  treeHash = gateTreeHash(root);
const row = findGateCheck(root, "npm test", treeHash);
const preflight = readPreflightSuites(
  readFileSync(
    "docs/work-orders/WO-276-the-queue-lands-as-one-order.md",
    "utf8",
  ),
);
const fields = [
  "checkId",
  "codeIdentity",
  "treeHash",
  "recordedAt",
  "startedAt",
  "exitCode",
  "gateSelection",
  "executed",
  "executionMode",
  "requiredSuites",
  "freshSuites",
  "reusedSuites",
];
const select = (value) =>
  value
    ? Object.fromEntries(
        fields.filter((key) => key in value).map((key) => [key, value[key]]),
      )
    : null;
const document = await requireDocumentRow(root);
const result = {
  identity,
  treeHash,
  preflight,
  complete: select(row),
  completeStands: Boolean(
    row && gateCheckStands(row, readGateChecks(root), root),
  ),
  preflightNotInComplete: preflight.filter(
    (name) => !row?.requiredSuites?.includes(name),
  ),
  document: select(document.row),
  documentStands: Boolean(document.row),
  documentRefusal: document.refusal ?? null,
};
writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
console.log(
  JSON.stringify({
    identity,
    completeStands: result.completeStands,
    completeRecordedAt: row?.recordedAt,
    documentStands: result.documentStands,
  }),
);
