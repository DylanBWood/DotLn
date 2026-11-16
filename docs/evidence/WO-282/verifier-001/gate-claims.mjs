// VER-001 probe P4 (WO-282 criteria 1, 2, 3 and 5): whether the completion's
// own gate-claim reader accepts the product claims as they stand, read-only.
// It asks the reader the completion calls for the `npm test` and
// `npm test -- --review` claims and records the row it consumes. The
// document claim is judged by the document gate the verifier runs last.
//
// usage: node gate-claims.mjs <launchpad> <results.json>
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const [launchpad, output] = process.argv.slice(2);
const { requireGateClaims } = await import(
  join(launchpad, "scripts/lib/handoff-ledger.mjs")
);
const { gateCodeIdentity } = await import(
  join(launchpad, "scripts/lib/gate-evidence.mjs")
);
const warnings = [];
const log = { warn: (line) => warnings.push(line), log: () => {} };
let result;
let refusal = null;
try {
  result = await requireGateClaims(
    launchpad,
    {
      checked: true,
      claims: { plain: ["5"], review: ["1", "2", "3", "5"], document: [] },
    },
    { log },
  );
} catch (error) {
  refusal = error.message;
}
const gate = result?.productGate ?? null;
const record = {
  probe: "P4 gate-claims",
  observedAt: new Date().toISOString(),
  currentCodeIdentity: gateCodeIdentity(launchpad),
  refusal,
  advisories: result?.advisories ?? [],
  warnings,
  productGate: gate && {
    checkId: gate.checkId,
    codeIdentity: gate.codeIdentity,
    treeHash: gate.treeHash,
    exitCode: gate.exitCode,
    executed: gate.executed,
    recordedAt: gate.recordedAt,
    evidenceRef: gate.evidenceRef,
  },
};
record.pass =
  refusal === null &&
  record.advisories.length === 0 &&
  gate?.exitCode === 0 &&
  gate?.codeIdentity === record.currentCodeIdentity;
writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify(record, null, 1));
process.exitCode = record.pass ? 0 : 1;
