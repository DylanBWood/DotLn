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
const identity = gateCodeIdentity(root);
assert.equal(
  identity,
  "636e663b66ac5d871322cf8956c9609baad2a48bbebb405813c029288375da94",
);
const rows = readGateChecks(root).filter((r) => r.codeIdentity === identity);
const review = rows.filter((r) => r.checkId === "npm test").at(-1);
assert.ok(review);
const complete = await coveringGateCheck(
  root,
  "npm test",
  review.requiredSuites,
  identity,
);
assert.ok(
  complete.row,
  JSON.stringify({
    missing: complete.missing,
    displaced: complete.displaced?.tasks,
  }),
);
assert.equal(complete.row.exitCode, 0);
assert.equal(complete.row.requiredSuites.length, 46);
assert.equal(complete.row.taskTimeline.length, 122);
assert.ok(complete.row.taskTimeline.every((task) => task.exitCode === 0));
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
for (const suite of required)
  assert.ok(complete.row.requiredSuites.includes(suite), suite);
console.log(
  JSON.stringify(
    {
      identity,
      candidateTree: gateTreeHash(root),
      completeAt: complete.row.recordedAt,
      completeExit: complete.row.exitCode,
      checkId: complete.row.checkId,
      gateSelection: complete.row.gateSelection,
      requiredSuites: complete.row.requiredSuites.length,
      taskCount: complete.row.taskTimeline.length,
      coveredPreflight: required,
      durationMs: complete.row.durationMs,
      evidenceRef: complete.row.evidenceRef,
      structuralTasks: complete.row.taskTimeline
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
        .map(({ name, exitCode, executed }) => ({ name, exitCode, executed })),
    },
    null,
    2,
  ),
);
