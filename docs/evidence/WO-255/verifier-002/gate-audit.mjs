// Select only gate identity, coverage and outcome fields; omit nested logs.
import {
  gateCodeIdentity,
  gateTreeHash,
  readGateChecks,
  intactGateExecutionRow,
  passingGateResult,
  missingGateSuites,
  gateCheckStands,
} from "../../../../scripts/lib/gate-evidence.mjs";
const root = process.cwd();
const identity = gateCodeIdentity(root);
const all = readGateChecks(root);
const rows = all
  .filter(
    (row) =>
      row.codeIdentity === identity &&
      ["structural", "npm test", "npm run test:docs"].includes(row.checkId),
  )
  .map((row) => ({
    checkId: row.checkId,
    recordedAt: row.recordedAt,
    gateSelection: row.gateSelection,
    codeIdentity: row.codeIdentity,
    treeHash: row.treeHash,
    documentTreeHash: row.documentTreeHash,
    documentTreeExcludes: row.documentTreeExcludes,
    exitCode: row.exitCode,
    executed: row.executed,
    durationMs: row.durationMs,
    evidenceRef: row.evidenceRef,
    intact: intactGateExecutionRow(row),
    passing: passingGateResult(row),
    stands: gateCheckStands(row, all, root),
    requiredSuites: row.requiredSuites,
    missing: missingGateSuites(row),
  }));
console.log(
  JSON.stringify({ identity, tree: gateTreeHash(root), rows }, null, 2),
);
