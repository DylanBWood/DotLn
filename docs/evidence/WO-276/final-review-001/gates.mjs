import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const root = process.cwd();
const lib = (name) =>
  import(pathToFileURL(join(root, "scripts/lib", name)).href);
const {
  gateCodeIdentity,
  gateTreeHash,
  readGateChecks,
  findGateCheck,
  gateCheckStands,
} = await lib("gate-evidence.mjs");
const { readPreflightSuites, requireDocumentRow } =
  await lib("handoff-ledger.mjs");
const { coveringGateCheck } = await lib("gate-reuse.mjs");
const identity = gateCodeIdentity(root),
  treeHash = gateTreeHash(root);
const row = findGateCheck(root, "npm test", treeHash);
const preflight = readPreflightSuites(
  readFileSync(
    "docs/work-orders/WO-276-the-queue-lands-as-one-order.md",
    "utf8",
  ),
);
let covering;
try {
  const found = await coveringGateCheck(root, "npm test", preflight, identity);
  covering = {
    keys: Object.keys(found ?? {}),
    row: found?.row
      ? {
          recordedAt: found.row.recordedAt,
          gateSelection: found.row.gateSelection,
          exitCode: found.row.exitCode,
          codeIdentity: found.row.codeIdentity,
          treeHash: found.row.treeHash,
          required: found.row.requiredSuites?.length,
          fresh: found.row.freshSuites,
          reused: found.row.reusedSuites,
          durationMs: found.row.durationMs,
        }
      : null,
    missing: found?.missing,
    displaced: found?.displaced,
    candidates: found?.candidates?.length,
  };
} catch (error) {
  covering = { error: String(error?.message ?? error) };
}
const document = await requireDocumentRow(root);
console.log(
  JSON.stringify(
    {
      identity,
      treeHash,
      rowAtTree: row
        ? {
            recordedAt: row.recordedAt,
            sel: row.gateSelection,
            exit: row.exitCode,
            id: row.codeIdentity,
          }
        : null,
      rowStands: Boolean(
        row && gateCheckStands(row, readGateChecks(root), root),
      ),
      preflightCount: preflight.length,
      preflightNotInComplete: preflight.filter(
        (n) => !row?.requiredSuites?.includes(n),
      ),
      covering,
      documentRow: document.row
        ? { recordedAt: document.row.recordedAt, exit: document.row.exitCode }
        : null,
      documentRefusal: document.refusal ?? null,
    },
    null,
    1,
  ),
);
