// Independent WO-253 verification. All removals are confined to disposable
// repositories created under the caller's session scratch directory.
import assert from "node:assert/strict";
import fs from "node:fs";
import cp from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";
const source = fs.realpathSync(process.cwd());
const scratch = process.argv[2];
assert.ok(scratch && fs.statSync(scratch).isDirectory());
const container = fs.realpathSync(
  fs.mkdtempSync(join(scratch, "wo253-ver002-")),
);
const { createTemporaryRoot, readTemporaryOwner, writeTemporaryOwner } =
  await import(pathToFileURL(join(source, "scripts/lib/temporary-roots.mjs")));
const { pruneHarness } = await import(
  pathToFileURL(join(source, "scripts/lib/harness-prune.mjs"))
);
const git = (root, ...args) =>
  cp
    .execFileSync(
      "git",
      [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "-c",
        "commit.gpgsign=false",
        "-c",
        "maintenance.auto=false",
        ...args,
      ],
      { cwd: root, encoding: "utf8" },
    )
    .trim();
const repository = (name) => {
  const root = join(container, name);
  fs.mkdirSync(root);
  git(root, "init", "-q", "-b", "main");
  assert.equal(
    fs.realpathSync(git(root, "rev-parse", "--show-toplevel")),
    root,
  );
  return root;
};
const make = (root, name, kind = "gate-fixture", recent = false) => {
  fs.mkdirSync(join(root, "roots"), { recursive: true });
  const path = createTemporaryRoot(join(root, "roots", name), {
    class: kind,
    repository: root,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      gateId: undefined,
      suite: undefined,
      session: undefined,
    },
  });
  const record = readTemporaryOwner(path);
  delete record.fixtureOwner;
  record.createdAt = "2020-01-01T00:00:00.000Z";
  record.endedAt = recent ? new Date().toISOString() : record.createdAt;
  record.endSource = "completion";
  record.outcome = recent ? "failed" : "passed";
  record.retentionHours = recent ? 24 : 0;
  writeTemporaryOwner(path, record);
  fs.writeFileSync(
    join(path, kind === "closed-journal" ? "checks.json" : "payload"),
    "{}\n",
  );
  return path;
};
try {
  const root = repository("cli");
  const eligible = [
    make(root, "dotln-fixture-"),
    make(root, "dotln-capture-", "worker-capture"),
    make(root, "dotln-scratch-", "session-scratch"),
    make(root, "dotln-second-fixture-"),
  ];
  fs.chmodSync(join(eligible[0], "payload"), 0);
  fs.mkdirSync(join(eligible[1], "locked/inner"), { recursive: true });
  fs.chmodSync(join(eligible[1], "locked"), 0);
  const journal = make(root, "journal-", "closed-journal");
  const recentJournal = make(root, "recent-journal-", "closed-journal", true);
  const failed = make(root, "failed-", "gate-fixture", true);
  const malformed = make(root, "malformed-");
  fs.writeFileSync(join(malformed, ".dotln-owner.json"), "bad json\n");
  const unmarked = make(root, "unmarked-");
  fs.unlinkSync(join(unmarked, ".dotln-owner.json"));
  const retained = [recentJournal, failed, malformed, unmarked];
  for (const path of retained)
    fs.chmodSync(
      join(path, path === recentJournal ? "checks.json" : "payload"),
      0,
    );
  const read = fs.readFileSync;
  let forbiddenReads = 0;
  fs.readFileSync = function (path, ...args) {
    if (
      [...eligible, ...retained].some(
        (base) =>
          String(path) ===
          join(base, base === recentJournal ? "checks.json" : "payload"),
      )
    ) {
      forbiddenReads++;
      throw new Error("Probe forbids reading record-only or retained payload");
    }
    return read.call(this, path, ...args);
  };
  syncBuiltinESMExports();
  try {
    await pruneHarness(root, {
      scope: "repository",
      hostDirectory: join(root, ".runtime/host"),
      openPaths: [],
    });
    assert.equal(forbiddenReads, 0);
  } finally {
    fs.readFileSync = read;
    syncBuiltinESMExports();
  }
  const cli = () => {
    const result = cp.spawnSync(
      process.execPath,
      [join(source, "scripts/harness.mjs"), "prune", "--apply"],
      {
        cwd: root,
        env: { ...process.env, DOTLN_PRUNE_SCOPE: "repository" },
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  const report = cli();
  for (const path of eligible) {
    assert.equal(
      fs.existsSync(path),
      false,
      JSON.stringify(
        report.retained.map(({ kind, reason }) => ({ kind, reason })),
      ),
    );
    assert.equal(
      report.removed.find((row) => row.path === relative(root, path))?.proof,
      "record",
    );
  }
  assert.equal(
    fs.existsSync(journal),
    false,
    JSON.stringify(
      report.retained.map(({ kind, reason }) => ({ kind, reason })),
    ),
  );
  assert.equal(
    report.removed.find((row) => row.path === relative(root, journal))?.proof,
    "inventory",
  );
  for (const path of retained) assert.ok(fs.existsSync(path));
  assert.equal(report.reads.snapshots, 1);
  assert.equal(report.reads.byteInventories, 1);
  assert.equal(cli().removed.length, 0);
  console.log(
    JSON.stringify({
      probe: "isolated repository CLI",
      recordRemovals: 4,
      journalRemovals: 1,
      retained: 4,
      forbiddenPayloadReads: forbiddenReads,
      snapshots: report.reads.snapshots,
      byteInventories: report.reads.byteInventories,
      repeatedApplyRemovals: 0,
    }),
  );

  // Exercise a later stash-inventory batch, beyond the executor's case
  // that expires before the first inventory operation.
  const stashRoot = repository("stash-batches");
  for (let i = 0; i < 80; i++)
    fs.writeFileSync(join(stashRoot, `file-${i}`), `base ${i}\n`);
  git(stashRoot, "add", ".");
  git(stashRoot, "commit", "-qm", "fixture base");
  for (let i = 0; i < 80; i++)
    fs.writeFileSync(join(stashRoot, `file-${i}`), `changed ${i}\n`);
  git(stashRoot, "stash", "push", "-q", "-m", "WO-901 integrate 2030-01-01");
  const options = {
    apply: true,
    scope: "repository",
    processes: [],
    openPaths: [],
    hostDirectory: join(stashRoot, ".runtime/host"),
    publishedRelease: (order) => (order === "WO-901" ? "v1.0.0" : null),
  };
  const spawn = cp.spawnSync;
  let clock = 0;
  let batches = 0;
  cp.spawnSync = function (file, args, ...rest) {
    const result = spawn.call(this, file, args, ...rest);
    if (
      file === "git" &&
      args.includes("cat-file") &&
      args.includes("--batch")
    ) {
      batches++;
      clock = 2;
    }
    return result;
  };
  syncBuiltinESMExports();
  let stopped;
  try {
    stopped = await pruneHarness(stashRoot, {
      ...options,
      budgetMs: 1,
      budgetClock: () => clock,
    });
  } finally {
    cp.spawnSync = spawn;
    syncBuiltinESMExports();
  }
  assert.equal(batches, 1, "No second blob batch may run after expiry");
  assert.equal(stopped.stoppedAt?.step, "plan");
  assert.equal(stopped.remaining, 1);
  assert.equal(
    stopped.retained.find((row) => row.kind === "integration-stash")?.reason,
    "budget",
  );
  assert.ok(git(stashRoot, "stash", "list"));
  const resumed = await pruneHarness(stashRoot, options);
  assert.equal(git(stashRoot, "stash", "list"), "");
  assert.equal(resumed.remaining, 0);
  console.log(
    JSON.stringify({
      probe: "stash expiry after first blob batch",
      batchesBeforeStop: batches,
      stoppedAt: stopped.stoppedAt.step,
      remainingAtStop: stopped.remaining,
      remainingAfterResume: resumed.remaining,
    }),
  );
} finally {
  // Only this probe's disposable repositories, never worktree material.
  fs.rmSync(container, { recursive: true, force: true });
}
