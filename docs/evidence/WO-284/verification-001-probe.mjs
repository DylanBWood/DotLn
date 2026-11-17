import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const scratch = process.argv[2];
const imp = (p) => import(pathToFileURL(join(root, p)));
const { createFixtureRoot, removeTemporaryPath } = await imp(
  "scripts/lib/temporary-roots.mjs",
);
const { runGit } = await imp("scripts/lib/git.mjs");
const { runGate, executeSuite } = await imp("scripts/test-runner.mjs");
const { gateCodeIdentity, readGateChecks } = await imp(
  "packages/skeleton/src/gate-evidence.mjs",
);
const { standingReviewRow } = await imp("scripts/lib/handoff-ledger.mjs");
const { closeoutStandingFor, closeoutText } = await imp(
  "scripts/lib/closeout-scope.mjs",
);
const { coveringGateCheck, standingReviewCandidate } = await imp(
  "scripts/lib/gate-reuse.mjs",
);
const { TIME_LIMITS, timeLimits, timeLimit, reportTimeLimitAdvisories } =
  await imp("packages/skeleton/src/time-limits.mjs");
const { listTimeLimits, writeTimeLimits } = await imp(
  "scripts/time-limits.mjs",
);
const details = { observedAt: new Date().toISOString(), checks: [] };
const standing = await standingReviewRow(root);
details.subject = {
  identity: gateCodeIdentity(root),
  row: standing.row
    ? {
        recordedAt: standing.row.recordedAt,
        codeIdentity: standing.row.codeIdentity,
        evidenceRef: standing.row.evidenceRef,
        exitCode: standing.row.exitCode,
        requiredSuites: standing.row.requiredSuites,
        taskCount: standing.row.taskTimeline?.length,
      }
    : null,
};
const f = createFixtureRoot(join(tmpdir(), "dotln-verification-limits-"));
try {
  for (const args of [
    ["init", "-q", "-b", "main"],
    ["config", "user.name", "Fixture"],
    ["config", "user.email", "fixture@example.invalid"],
  ])
    runGit(f, args);
  mkdirSync(join(f, "scripts"));
  mkdirSync(join(f, "docs/control"), { recursive: true });
  writeFileSync(join(f, ".gitignore"), "docs/control/local/\n.runtime/\n");
  writeFileSync(join(f, "scripts/slow.mjs"), "setTimeout(() => {}, 350);\n");
  writeFileSync(
    join(f, "scripts/test-runner.mjs"),
    'console.log("slow — protects: a task under the root limits");\n',
  );
  runGit(f, ["add", "."]);
  runGit(f, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Independent verification fixture",
  ]);
  const file = join(f, "docs/control/time-limits.json");
  const put = (b) => writeFileSync(file, JSON.stringify(b, null, 2) + "\n");
  const table = [
    {
      name: "slow",
      product: true,
      command: [process.execPath, "scripts/slow.mjs"],
    },
  ];
  const capture = async (args) => {
    const lines = [];
    const log = console.log;
    console.log = (...args) => lines.push(args.join(" "));
    try {
      const row = await runGate(args, f, { table });
      return { row, lines };
    } finally {
      console.log = log;
    }
  };
  const initial = await capture(["--review", "--again"]);
  assert.equal(initial.row.exitCode, 0);
  const initialIdentity = gateCodeIdentity(f);
  put({ limits: { "suite.default": { set: 5400000 } } });
  const raised = await capture(["--review"]);
  details.raised = {
    resolved: timeLimit(f, "suite.default"),
    identityUnchanged: gateCodeIdentity(f) === initialIdentity,
    task: raised.row.taskTimeline?.map(({ name, timeoutMs, reused }) => ({
      name,
      timeoutMs,
      reused,
    })),
  };
  put({ scale: 0.00001 });
  const afterChange = await coveringGateCheck(f, "npm test", ["slow"]);
  const closeout = await closeoutStandingFor(f);
  const closeoutMessage = closeoutText(
    f,
    {
      workOrder: "WO-284",
      launchpad: "complete",
      satisfied: closeout,
      target: null,
      reasons: ["the fixture owes its complete review selection"],
    },
    { heading: "Independent fixture closeout" },
  );
  const skipped = await capture(["--review", "--again"]);
  const forced = await capture([
    "--review",
    "--again",
    "--reason",
    "independent check after changing the limits configuration",
  ]);
  details.changedConfiguration = {
    resolved: timeLimit(f, "suite.default"),
    identityUnchanged: gateCodeIdentity(f) === initialIdentity,
    standingReview: !!standingReviewCandidate(afterChange, ["slow"]),
    closeoutMessage,
    skipped: skipped.row,
    skipLines: skipped.lines,
    forced: {
      exitCode: forced.row.exitCode,
      forcedReason: forced.row.forcedReason,
      tasks: forced.row.taskTimeline?.map(
        ({ name, exitCode, failureKind, timeoutMs, timeLimitKey }) => ({
          name,
          exitCode,
          failureKind,
          timeoutMs,
          timeLimitKey,
        }),
      ),
    },
  };
  assert.equal(forced.row.exitCode, 1);
  assert.ok(forced.row.taskTimeline.some((t) => t.failureKind === "timeout"));
  put({
    enforce: false,
    scale: 0.000001,
    limits: { "suite.default": { set: 1 } },
  });
  const off = await executeSuite(table[0], f);
  assert.equal(off.exitCode, 0, off.output);
  assert.equal(off.timeoutMs, null);
  details.checks.push({
    name: "enforce false lets slow row finish",
    pass: true,
  });
  put({
    scale: 2,
    limits: {
      "suite.default": { set: "fast" },
      "suite.host": { set: 12345, note: "keep" },
    },
  });
  const advisory = [];
  const env = {};
  reportTimeLimitAdvisories(f, { env, print: (s) => advisory.push(s) });
  reportTimeLimitAdvisories(f, { env, print: (s) => advisory.push(s) });
  assert.equal(advisory.length, 1);
  assert.equal(
    timeLimit(f, "suite.default"),
    TIME_LIMITS["suite.default"].ms * 2,
  );
  writeTimeLimits(f);
  const refreshed = JSON.parse(readFileSync(file, "utf8"));
  assert.equal(refreshed.limits["suite.host"].set, 12345);
  assert.equal(refreshed.limits["suite.host"].note, "keep");
  assert.equal(listTimeLimits(f).rows.length, Object.keys(TIME_LIMITS).length);
  details.checks.push({
    name: "invalid value advises once, scaled fallback, owner fields preserved, every key listed",
    pass: true,
  });
  mkdirSync(join(f, "records/control"), { recursive: true });
  writeFileSync(
    join(f, "dotln.config.json"),
    JSON.stringify({ version: 1, roots: { control: "records/control" } }),
  );
  writeFileSync(
    join(f, "records/control/time-limits.json"),
    JSON.stringify({ limits: { "suite.default": { set: 9876 } } }),
  );
  assert.equal(timeLimit(f, "suite.default"), 9876);
  details.checks.push({
    name: "same-process configuration root relocation invalidates cached reading",
    pass: true,
  });
} finally {
  removeTemporaryPath(f, { recursive: true, force: true });
}
if (scratch)
  writeFileSync(
    join(scratch, "verify-limits-results.json"),
    JSON.stringify(details, null, 2) + "\n",
  );
const mismatches = [];
if (
  details.raised.task.some(
    (task) =>
      task.name === "slow" && task.timeoutMs !== details.raised.resolved,
  )
)
  mismatches.push("The raised limit is absent from the current task record.");
if (details.changedConfiguration.standingReview)
  mismatches.push(
    "The earlier pass still stands after a stricter scale is configured.",
  );
if (details.changedConfiguration.skipped.executed === false)
  mismatches.push("The forced selection skips the newly configured limit.");
details.contractFailures = mismatches;
if (scratch)
  writeFileSync(
    join(scratch, "verify-limits-results.json"),
    JSON.stringify(details, null, 2) + "\n",
  );
process.exitCode = mismatches.length ? 1 : 0;
console.log(JSON.stringify(details, null, 2));
