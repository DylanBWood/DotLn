// Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-260/verification-003-gates.mjs
// VER-003 gate-row probe: the subject's code identity and candidate tree,
// and whether the executor's complete review row covers every Preflight
// suite at that identity. Read-only: computes hashes and reads gate rows.
import assert from "node:assert/strict";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const { gateCodeIdentity, readGateChecks, gateTreeHash } = await import(
  pathToFileURL(join(root, "packages/skeleton/src/gate-evidence.mjs"))
);
const { coveringGateCheck } = await import(
  pathToFileURL(join(root, "scripts/lib/gate-reuse.mjs"))
);
const handedOff =
  "00cad38aa337787a27655fd20543fb4fe7eb4692ff1b0db51987e8027cf647c9";
const identity = gateCodeIdentity(root);
const candidateTree = gateTreeHash(root);
const all = readGateChecks(root);
const atIdentity = all.filter((r) => r.codeIdentity === identity);
const summary = (r) => ({
  checkId: r.checkId,
  gateSelection: r.gateSelection,
  exitCode: r.exitCode,
  recordedAt: r.recordedAt,
  treeHash: r.treeHash,
  candidateTree: r.candidateTree,
  suites: r.requiredSuites?.length,
  tasks: r.taskTimeline?.length,
  durationMs: r.durationMs,
});
const review = atIdentity.filter((r) => r.checkId === "npm test").at(-1);
const required = [
  "runner-fixtures",
  "worktree",
  "target-worktree",
  "target-publish",
  "release",
  "harness-fixtures",
  "skeleton",
  "launchpad",
  "host",
];
let complete = null;
if (review) {
  complete = await coveringGateCheck(
    root,
    "npm test",
    review.requiredSuites,
    identity,
  );
}
const docRows = all
  .filter((r) => r.checkId === "npm run test:docs")
  .slice(-3)
  .map(summary);
const out = {
  identity,
  identityMatchesHandoff: identity === handedOff,
  candidateTree,
  rowsAtIdentity: atIdentity.map(summary),
  covering: complete?.row
    ? {
        ...summary(complete.row),
        everyTaskPassed: complete.row.taskTimeline.every(
          (t) => t.exitCode === 0,
        ),
        reusedOrUnrun: complete.row.taskTimeline
          .filter((t) => t.executed === false)
          .map((t) => t.name),
        preflightCovered: required.filter((s) =>
          complete.row.requiredSuites.includes(s),
        ),
        preflightMissing: required.filter(
          (s) => !complete.row.requiredSuites.includes(s),
        ),
        structural: complete.row.taskTimeline
          .filter((t) =>
            [
              "host",
              "format",
              "git-surface",
              "clean-room",
              "plan-refutation",
              "validate",
              "generated",
            ].includes(t.name),
          )
          .map(({ name, exitCode, executed }) => ({
            name,
            exitCode,
            executed,
          })),
      }
    : { missing: complete?.missing, displaced: complete?.displaced?.tasks },
  latestDocumentRows: docRows,
};
console.log(JSON.stringify(out, null, 2));
assert.ok(complete?.row, "no covering complete row at the subject identity");
assert.equal(complete.row.exitCode, 0);
assert.deepEqual(out.covering.preflightMissing, []);
