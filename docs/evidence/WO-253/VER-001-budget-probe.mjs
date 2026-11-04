// Independent verification reproduction, WO-253 VER-001 F1.
// Run from the worktree root, passing the session scratch directory.
// Only the disposable fixture created below is changed; no host-wide prune.
import fs from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { syncBuiltinESMExports } from "node:module";

const source = fs.realpathSync(process.cwd());
const scratch = process.argv[2];
assert.ok(
  scratch && fs.statSync(scratch).isDirectory(),
  "Pass session scratch",
);
const root = fs.realpathSync(
  fs.mkdtempSync(join(scratch, "wo253-budget-probe-")),
);
const git = spawnSync("git", ["init", "-q", "-b", "main"], {
  cwd: root,
  encoding: "utf8",
});
assert.equal(git.status, 0, git.stderr);
const snapshot = join(root, ".runtime/harness/0123456789abcdef");
fs.mkdirSync(snapshot, { recursive: true });
for (let index = 0; index < 10; index++)
  fs.writeFileSync(join(snapshot, `entry-${index}`), "public fixture\n");
const { pruneHarness } = await import(
  pathToFileURL(join(source, "scripts/lib/harness-prune.mjs"))
);
let clock = 0;
let checksAfterExpiry = 0;
let deletedAfterExpiry = 0;
const originalChmod = fs.chmodSync;
const originalRm = fs.rmSync;
// The supported budgetClock seam models time spent in permission preparation.
// Advance it after the candidate's proof recheck, when removal starts.
fs.chmodSync = function (path, ...args) {
  if (String(path) === snapshot) clock = 2;
  return originalChmod.call(this, path, ...args);
};
fs.rmSync = function (path, ...args) {
  if (String(path) === snapshot && clock === 2) deletedAfterExpiry++;
  return originalRm.call(this, path, ...args);
};
syncBuiltinESMExports();
try {
  const report = await pruneHarness(root, {
    apply: true,
    scope: "repository",
    processes: [],
    openPaths: [],
    hostDirectory: join(root, ".runtime/isolated-host"),
    budgetMs: 1,
    budgetClock: () => {
      if (clock === 2) checksAfterExpiry++;
      return clock;
    },
  });
  console.log(
    JSON.stringify({
      probe: "planned snapshot deletion after budget expiry",
      budgetMs: 1,
      clockAtRemoval: clock,
      checksAfterExpiry,
      deletedAfterExpiry,
      removed: report.removed.map(({ kind, path }) => ({ kind, path })),
      snapshotExists: fs.existsSync(snapshot),
      remaining: report.remaining,
      stoppedAt: report.stoppedAt,
    }),
  );
  assert.equal(clock, 2, "The probe must actually expire the clock");
  assert.ok(
    report.stoppedAt,
    "Budget expiry inside planned-root removal must report a partial stop",
  );
  assert.ok(
    fs.existsSync(snapshot),
    "The interrupted root must remain resumable",
  );
  assert.ok(
    report.remaining > 0,
    "The interrupted root must count as remaining",
  );
} finally {
  fs.chmodSync = originalChmod;
  fs.rmSync = originalRm;
  syncBuiltinESMExports();
  fs.rmSync(root, { recursive: true, force: true });
}
