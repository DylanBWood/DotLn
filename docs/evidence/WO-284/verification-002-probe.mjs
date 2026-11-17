import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const imp = (p) => import(pathToFileURL(join(root, p)));
const { createFixtureRoot, removeTemporaryPath } = await imp(
  "scripts/lib/temporary-roots.mjs",
);
const { runGit } = await imp("scripts/lib/git.mjs");
const { runGate } = await imp("scripts/test-runner.mjs");
const { gateCodeIdentity, gateTreeHash, findGateCheck } = await imp(
  "packages/skeleton/src/gate-evidence.mjs",
);
const { coveringTaskResults, coveringGateCheck } = await imp(
  "scripts/lib/gate-reuse.mjs",
);
const { closeoutStandingFor } = await imp("scripts/lib/closeout-scope.mjs");
const { timeLimits, timeLimitsDigest } = await imp(
  "packages/skeleton/src/time-limits.mjs",
);
const result = {
  observedAt: new Date().toISOString(),
  subject: gateCodeIdentity(root),
  checks: [],
};
const note = (name) => result.checks.push({ name, pass: true });
const base = createFixtureRoot(join(tmpdir(), "dotln-verify-002-"));
const main = join(base, "main");
const worktree = join(base, "worktree");
mkdirSync(main);
const put = (r, body) => {
  mkdirSync(join(r, "docs/control"), { recursive: true });
  writeFileSync(
    join(r, "docs/control/time-limits.json"),
    JSON.stringify(body, null, 2) + "\n",
  );
};
const table = [
  {
    name: "alpha",
    product: true,
    command: [process.execPath, "scripts/alpha.mjs"],
  },
];
const capture = async (r, args) => {
  const prior = console.log;
  console.log = () => {};
  try {
    return await runGate(args, r, { table });
  } finally {
    console.log = prior;
  }
};
try {
  for (const args of [
    ["init", "-q", "-b", "main"],
    ["config", "user.name", "Fixture"],
    ["config", "user.email", "fixture@example.invalid"],
  ])
    runGit(main, args);
  mkdirSync(join(main, "scripts"));
  mkdirSync(join(main, "docs/control"), { recursive: true });
  writeFileSync(join(main, ".gitignore"), "docs/control/local/\n.runtime/\n");
  writeFileSync(join(main, "scripts/alpha.mjs"), "setTimeout(() => {}, 60);\n");
  writeFileSync(
    join(main, "scripts/test-runner.mjs"),
    'console.log("alpha — protects: the independent fixture task");\n',
  );
  runGit(main, ["add", "."]);
  runGit(main, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Independent cross-worktree verification fixture",
  ]);
  runGit(main, ["worktree", "add", "-q", "-b", "verify-fixture", worktree]);
  put(main, { scale: 2 });
  const original = await capture(main, ["--review"]);
  assert.equal(original.exitCode, 0);
  assert.equal(gateCodeIdentity(main), gateCodeIdentity(worktree));
  assert.equal(
    (await coveringTaskResults(worktree, "npm test", table)).results.size,
    0,
  );
  assert.equal(
    (await coveringGateCheck(worktree, "npm test", ["alpha"])).row,
    undefined,
  );
  assert.equal(await closeoutStandingFor(worktree), undefined);
  note(
    "A linked worktree cannot carry main results under different effective limits",
  );

  const explicit = {
    limits: Object.fromEntries(
      Object.entries(timeLimits(main).limits).map(([key, row]) => [
        key,
        { set: row.ms, kit: -1, note: "same effective figure" },
      ]),
    ),
  };
  put(worktree, explicit);
  assert.equal(timeLimitsDigest(main), timeLimitsDigest(worktree));
  const reusable = await coveringTaskResults(worktree, "npm test", table);
  assert.equal(reusable.results.get("alpha")?.sourceRow.location, "main");
  assert.equal(
    (await closeoutStandingFor(worktree))?.recordedAt,
    original.recordedAt,
  );
  const carried = await capture(worktree, ["--review"]);
  assert.equal(carried.exitCode, 0);
  assert.equal(
    carried.taskTimeline.find((t) => t.name === "alpha")?.reused,
    true,
  );
  assert.equal(
    findGateCheck(worktree, "npm test", gateTreeHash(worktree))?.recordedAt,
    carried.recordedAt,
  );
  note(
    "Equivalent scale and explicit-per-key files carry main results and stand locally",
  );

  put(main, {});
  const later = await capture(main, ["--review"]);
  assert.equal(later.exitCode, 0);
  assert.equal(
    (await coveringTaskResults(worktree, "npm test", table)).results.size,
    0,
  );
  assert.equal(
    (await coveringGateCheck(worktree, "npm test", ["alpha"])).row,
    undefined,
  );
  assert.equal(await closeoutStandingFor(worktree), undefined);
  assert.equal(
    findGateCheck(worktree, "npm test", gateTreeHash(worktree)),
    undefined,
  );
  note(
    "A later main execution under other limits displaces an earlier carried pass through every reader",
  );

  const fresh = await capture(worktree, ["--review"]);
  assert.equal(fresh.exitCode, 0);
  assert.equal(
    fresh.taskTimeline.find((t) => t.name === "alpha")?.reused,
    undefined,
  );
  assert.equal(
    fresh.taskTimeline.find((t) => t.name === "alpha")?.timeoutMs,
    5400000,
  );
  writeFileSync(
    join(worktree, "docs/operator.md"),
    "An authored prose change.\n",
  );
  const unchanged = await capture(worktree, ["--review", "--again"]);
  assert.equal(unchanged.executed, false);
  note(
    "A fresh execution restores standing; an authored prose edit preserves the forced-run answer",
  );

  explicit.limits["generated.check"].set += 1;
  put(worktree, explicit);
  assert.equal(await closeoutStandingFor(worktree), undefined);
  assert.equal(
    (await coveringTaskResults(worktree, "npm test", table)).results.size,
    0,
  );
  note(
    "A changed nested-child limit invalidates standing even when the suite timeout is unchanged",
  );
} finally {
  removeTemporaryPath(base, { recursive: true, force: true });
}
if (process.argv[2])
  writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
