import { gateCodeIdentity } from "/Users/dylanwood/Projects/DotLn-wo226/packages/skeleton/src/gate-evidence.mjs";
import {
  gateCandidates,
  preflightRows,
} from "/Users/dylanwood/Projects/DotLn-wo226/scripts/lib/gate-reuse.mjs";
const root = "/Users/dylanwood/Projects/DotLn-wo226";
const id = gateCodeIdentity(root);
console.log("currentCodeIdentity", id);
for (const checkId of ["npm test", "npm run test:docs"]) {
  const c = await gateCandidates(root, checkId, id);
  console.log("==", checkId, "location", c.location, "rows", c.rows.length);
  for (const r of c.rows.slice(-4))
    console.log(
      JSON.stringify({
        recordedAt: r.recordedAt,
        exitCode: r.exitCode,
        gateSelection: r.gateSelection,
        treeHash: r.treeHash,
        durationMs: r.durationMs,
        evidenceRef: r.evidenceRef,
        executionMode: r.executionMode,
        requiredSuites: Array.isArray(r.requiredSuites)
          ? r.requiredSuites.length
          : undefined,
        tasks: Array.isArray(r.tasks) ? r.tasks.length : undefined,
      }),
    );
}
const suites = [
  "harness-fixtures",
  "harness",
  "process-debt",
  "launchpad",
  "skeleton",
  "plan-refutation",
  "configuration-root",
  "evidence-sources",
];
const p = await preflightRows(root, id, suites);
console.log(
  "preflight rows",
  p.rows.map((r) => ({
    checkId: r.checkId,
    recordedAt: r.recordedAt,
    exitCode: r.exitCode,
    gateSelection: r.gateSelection,
  })),
);
console.log("preflight missing", JSON.stringify(p.missing));
