import test from "node:test";
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  seedHarnessWriter,
  releaseHarnessWriter,
} from "../packages/skeleton/dist/src/harness-host.js";
import {
  chmodSync,
  closeSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  ftruncateSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync as removeDirectory,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";
import {
  createFixtureRoot,
  excludeFixtureOwnership,
  copyTemporaryMaterial,
  createScratchRoot,
  createTemporaryRoot,
  finishTemporaryRoot,
  readTemporaryOwner,
  temporaryOutcomeRecord,
  writeTemporaryOwner,
  removeTemporaryPath,
  removeTemporaryRoot,
  removeVerifiedTemporaryRoot,
  temporaryLedgerContradiction,
  temporaryRemovalAside,
  ownerAlive,
  readRetention,
  temporaryChurn,
  registeredTemporaryRoots,
  temporaryLedger,
  temporaryInventory,
  temporaryProcessTable,
  retireTemporaryLedger,
  promoteTemporaryRoot,
  withTemporaryOwner,
  pruneSessionTemporaryRoots,
  ensureTemporaryRoot,
  validateRetention,
  TEMPORARY_OWNER_FILE,
} from "./lib/temporary-roots.mjs";
import {
  journalLane,
  retainWorktreeJournals,
} from "./lib/worktree-removal.mjs";
import {
  applyTemporaryCandidate,
  boundTemporaryRoots,
  judgeTemporaryRoot,
  finishGateTemporaryRoots,
  listTemporaryRoots,
  pruneBudget,
  recordTemporaryGateResult,
  temporaryPrunePaths,
} from "./lib/temporary-prune.mjs";
import { pruneHarness } from "./lib/harness-prune.mjs";
import {
  formatPruneReport,
  pruneStartBudget,
  temporaryPruneSummary,
} from "./lib/temporary-prune-summary.mjs";
import { pruneStartBudgetKey } from "./lib/process-budget.mjs";
import { registerProcess } from "./lib/host-resources.mjs";
import { acquireHostLanes, formatLaneWait } from "./lib/host-lanes.mjs";
import { unownedTemporaryRootSites } from "./lib/temporary-root-declarations.mjs";
import { runGit } from "./lib/git.mjs";
import { beginGateRun } from "./lib/gate-evidence.mjs";

function fixture(t) {
  const container = createFixtureRoot(
    join(tmpdir(), "dotln-temporary-roots-test-"),
  );
  const root = ensureTemporaryRoot(join(container, "subject"), {
    class: "session-scratch",
    repository: container,
    owner: { gateId: undefined, suite: undefined },
  });
  // Synthetic owners model their own gates. Keep their boundary separate
  // from the live runner, which still owns the surrounding real fixture.
  const record = readTemporaryOwner(root);
  delete record.fixtureOwner;
  writeTemporaryOwner(root, record);
  t.after(() => {
    removeTemporaryRoot(root, record.token);
    removeTemporaryPath(container, { recursive: true, force: true });
  });
  mkdirSync(join(root, "roots"));
  return root;
}
function expired(root, name, extra = {}) {
  const path = createTemporaryRoot(join(root, "roots", name), {
    class: "gate-fixture",
    repository: root,
    ...extra,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      session: "0".repeat(64),
      gateId: undefined,
      suite: undefined,
      ...extra.owner,
    },
  });
  const record = readTemporaryOwner(path);
  record.createdAt = "2020-01-01T00:00:00.000Z";
  if (!record.owner.gateId) record.endedAt = record.createdAt;
  writeTemporaryOwner(path, record);
  return path;
}

test("synthetic Git seeds exclude physical ownership before cloning", (t) => {
  const root = fixture(t);
  const seed = createFixtureRoot(join(root, "seed-"));
  runGit(seed, ["-c", "init.templateDir=", "init", "-q"]);
  excludeFixtureOwnership(seed);
  const nested = createFixtureRoot(join(seed, "nested-"));
  writeFileSync(join(nested, "payload"), "fixture\n");
  runGit(seed, ["add", "-A"]);
  assert.equal(
    runGit(seed, ["ls-files", "**/.dotln-owner.json", ".dotln-owner.json"]),
    "",
  );
  runGit(seed, [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "fixture",
  ]);
  const clone = join(root, "clone");
  runGit(root, ["clone", "-q", seed, clone]);
  assert.equal(readTemporaryOwner(clone), null);
  assert.equal(
    readTemporaryOwner(join(clone, nested.slice(seed.length + 1))),
    null,
  );
  assert.ok(readTemporaryOwner(seed));
  assert.ok(readTemporaryOwner(nested));
});

test("temporary roots retain live, unknown and reused process identities correctly", (t) => {
  const root = fixture(t),
    path = expired(root, "owner-");
  const record = readTemporaryOwner(path);
  assert.equal(
    ownerAlive(record, [{ pid: record.owner.pid, birth: record.owner.birth }]),
    true,
  );
  assert.equal(ownerAlive(record, null), null);
  const missingBirth = { owner: { ...record.owner, birth: null } };
  assert.equal(ownerAlive(missingBirth, []), false);
  assert.equal(
    ownerAlive(missingBirth, [{ pid: record.owner.pid, birth: "2.0" }]),
    null,
    "a present PID without a recorded birth is never assumed dead",
  );
  assert.equal(ownerAlive(missingBirth, null), null);
  assert.equal(ownerAlive({ owner: { ...record.owner, pid: null } }, []), null);
  assert.equal(
    ownerAlive(record, [{ pid: record.owner.pid, birth: "2.0" }]),
    false,
  );
  assert.match(
    judgeTemporaryRoot(
      root,
      path,
      {},
      { processes: [{ pid: record.owner.pid, birth: record.owner.birth }] },
    ).retained.reason,
    /live/,
  );
  assert.equal(
    judgeTemporaryRoot(root, path, {}, { processes: [] }).candidate.class,
    "gate-fixture",
  );
  assert.equal(
    readTemporaryOwner(path).createdAt,
    record.createdAt,
    "preview does not rewrite the owner",
  );
});

test("prune removes expired owned read-only trees without traversing their links", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const path = expired(root, "readonly-");
  mkdirSync(join(path, "locked"));
  writeFileSync(join(path, "locked/file"), "discard");
  const outside = join(root, "keep");
  writeFileSync(outside, "keep");
  symlinkSync(outside, join(path, "link"));
  chmodSync(join(path, "locked"), 0o500);
  const report = await pruneHarness(root, {
    apply: true,
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  });
  assert.ok(
    report.removed.some((row) => row.path.endsWith(path.split("/").at(-1))),
  );
  assert.equal(existsSync(path), false);
  assert.equal(readFileSync(outside, "utf8"), "keep");
  assert.ok(
    report.census.some((row) => row.kind === "temporary-root" && row.bytes > 0),
  );
});

test("owner replacement and null retention preserve a root", (t) => {
  const root = fixture(t),
    path = expired(root, "forever-", { retentionHours: null });
  assert.match(
    judgeTemporaryRoot(root, path, {}, { processes: [] }).retained.reason,
    /indefinitely/,
  );
  const copied = expired(root, "copied-");
  const original = readTemporaryOwner(copied);
  cpSync(join(path, ".dotln-owner.json"), join(copied, ".dotln-owner.json"));
  assert.match(
    judgeTemporaryRoot(root, copied, {}, { processes: [] }).retained.reason,
    /replaced/,
  );
  // Put this creator's record back so its outer fixture can be torn down.
  const record = JSON.parse(
    readFileSync(join(copied, ".dotln-owner.json"), "utf8"),
  );
  assert.equal(record.token, readTemporaryOwner(path).token);
  writeTemporaryOwner(copied, original);
  removeTemporaryRoot(path);
});

test("legacy backfill requires age and a readable idle host; a stale warm hash is prunable", (t) => {
  const root = fixture(t),
    legacy = join(root, "roots/dotln-legacy-abcdef");
  mkdirSync(legacy);
  writeFileSync(join(legacy, "old"), "old fixture");
  const old = new Date("2020-01-01T00:00:00.000Z");
  utimesSync(legacy, old, old);
  const idle = { processes: [], openPaths: [], holders: [] };
  assert.match(
    judgeTemporaryRoot(root, legacy, {}, { ...idle, gateLive: true }).retained
      .reason,
    /uncertain/,
  );
  assert.match(
    judgeTemporaryRoot(root, legacy, {}, { ...idle, openPaths: null }).retained
      .reason,
    /unavailable/,
  );
  assert.match(
    judgeTemporaryRoot(
      root,
      legacy,
      {},
      { ...idle, openPaths: [join(legacy, "old")] },
    ).retained.reason,
    /live process/,
  );
  const candidate = judgeTemporaryRoot(root, legacy, {}, idle).candidate;
  assert.equal(candidate.kind, "legacy-backfill");
  applyTemporaryCandidate(root, candidate);
  assert.equal(existsSync(legacy), false);
  const warm = expired(root, "warm-", {
    class: "warm-fixture",
    cacheKey: "old",
  });
  assert.match(
    judgeTemporaryRoot(root, warm, { currentWarmKey: "old" }, idle).retained
      .reason,
    /current/,
  );
  assert.equal(
    judgeTemporaryRoot(root, warm, { currentWarmKey: "new" }, idle).candidate
      .class,
    "warm-fixture",
  );
  if (process.platform === "darwin") {
    assert.ok(existsSync(join(tmpdir(), "dotln/.metadata_never_index")));
    assert.ok(existsSync(join(root, ".runtime/.metadata_never_index")));
  }
});

test("warm cache freshness is judged by its owning worktree", (t) => {
  const root = fixture(t),
    sibling = fixture(t);
  for (const [repository, key] of [
    [root, "root-current"],
    [sibling, "sibling-current"],
  ]) {
    mkdirSync(join(repository, ".runtime/fixtures/launchpad"), {
      recursive: true,
    });
    writeFileSync(
      join(repository, ".runtime/fixtures/launchpad/current.json"),
      JSON.stringify({ key }),
    );
  }
  const warm = expired(sibling, "warm-", {
    class: "warm-fixture",
    cacheKey: "sibling-current",
  });
  const idle = { processes: [], holders: [] };
  assert.match(
    judgeTemporaryRoot(root, warm, {}, idle).retained.reason,
    /current/,
  );
  writeFileSync(
    join(sibling, ".runtime/fixtures/launchpad/current.json"),
    JSON.stringify({ key: "sibling-next" }),
  );
  assert.equal(
    judgeTemporaryRoot(root, warm, {}, idle).candidate.class,
    "warm-fixture",
  );
});

test("gate completion removes passed roots, retains failed roots and measures churn", (t) => {
  const root = fixture(t);
  let passed, failed;
  withTemporaryOwner(
    { repository: root, gateId: "gate-1", suite: "passed" },
    () => {
      passed = createFixtureRoot(join(root, "roots/passed-"));
      assert.equal(readTemporaryOwner(passed).owner.repository, root);
      writeFileSync(join(passed, "made"), "three");
    },
  );
  withTemporaryOwner(
    { repository: root, gateId: "gate-1", suite: "failed" },
    () => {
      failed = createFixtureRoot(join(root, "roots/failed-"));
      assert.equal(readTemporaryOwner(failed).owner.repository, root);
      writeFileSync(join(failed, "diagnose"), "keep");
    },
  );
  const report = finishGateTemporaryRoots(
    root,
    "gate-1",
    [
      { name: "passed", exitCode: 0 },
      { name: "failed", exitCode: 1 },
    ],
    { processes: [] },
  );
  assert.equal(existsSync(passed), false);
  assert.equal(existsSync(failed), true);
  assert.equal(report.blockers.length, 0);
  assert.equal(readTemporaryOwner(failed).retentionHours, 24);
  assert.equal(readTemporaryOwner(failed).outcome, "failed");
  const churn = temporaryChurn(root, "gate-1");
  assert.ok(churn.filesCreated >= 4);
  assert.ok(churn.filesDeleted >= 2);
  assert.ok(churn.bytesWritten > 0);
  assert.ok(temporaryLedger(root).some((row) => row.action === "removed"));
});

test("fixture copies exclude physical ownership at every depth and preserve their own marker", (t) => {
  const root = fixture(t);
  const source = createFixtureRoot(join(root, "roots/source-"));
  const child = createFixtureRoot(join(source, "nested-"));
  writeFileSync(join(source, "keep"), "source material");
  writeFileSync(join(source, "skip"), "filtered material");
  writeFileSync(join(child, "payload"), "nested material");
  const destination = createFixtureRoot(join(root, "roots/destination-"));
  const before = readTemporaryOwner(destination);
  copyTemporaryMaterial(source, destination, {
    recursive: true,
    filter: (from) => !from.endsWith("/skip"),
  });
  assert.deepEqual(readTemporaryOwner(destination), before);
  assert.equal(
    existsSync(join(destination, child.split("/").at(-1), ".dotln-owner.json")),
    false,
  );
  assert.equal(
    readFileSync(join(destination, "keep"), "utf8"),
    "source material",
  );
  assert.equal(existsSync(join(destination, "skip")), false);
  assert.ok(readTemporaryOwner(source) && readTemporaryOwner(child));
});

test("a nested instance gate shares its containing fixture's cleanup while a live capture stays protected", (t) => {
  const root = fixture(t);
  const parent = expired(root, "outer-", {
    owner: { gateId: "outer", suite: "instance" },
  });
  // This simulation supplies its own outer gate, independently of the test
  // runner's containing fixture. The simulated gate removes it below.
  const parentOwner = readTemporaryOwner(parent);
  delete parentOwner.fixtureOwner;
  writeTemporaryOwner(parent, parentOwner);
  const repository = join(parent, "instance");
  mkdirSync(repository);
  const coordination = createTemporaryRoot(join(parent, "coordination-"), {
    class: "coordination",
    repository,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      gateId: "inner",
      suite: "configuration-root",
    },
  });
  const scratch = createTemporaryRoot(join(parent, "scratch-"), {
    class: "session-scratch",
    repository,
    owner: { gateId: "outer", suite: "instance" },
  });
  const liveCapture = createTemporaryRoot(join(parent, "capture-"), {
    class: "worker-capture",
    repository,
    owner: { gateId: "outer", suite: "instance" },
  });
  const identity = readTemporaryOwner(scratch).owner;
  assert.equal(readTemporaryOwner(coordination).fixtureOwner.gateId, "outer");
  const report = finishGateTemporaryRoots(
    root,
    "outer",
    [{ name: "instance", exitCode: 0 }],
    {
      processes: [{ pid: identity.pid, birth: identity.birth }],
      worktrees: [],
      holders: [],
    },
  );
  assert.deepEqual(report.blockers, []);
  assert.equal(existsSync(coordination), false);
  assert.equal(existsSync(scratch), false);
  assert.ok(existsSync(liveCapture) && existsSync(parent));
  removeTemporaryRoot(liveCapture);
  finishGateTemporaryRoots(root, "outer", [{ name: "instance", exitCode: 0 }], {
    processes: [],
    worktrees: [],
    holders: [],
  });
  assert.equal(existsSync(parent), false);
});

test("an inner gate's completed coordination retains its containing gate lifetime", (t) => {
  const root = fixture(t);
  const outer = beginGateRun(root, "outer fixture lifetime");
  const parent = expired(root, "outer-lifetime-", {
    owner: { gateId: outer.run.runId, suite: "instance" },
  });
  const parentOwner = readTemporaryOwner(parent);
  delete parentOwner.fixtureOwner;
  writeTemporaryOwner(parent, parentOwner);
  const repository = join(parent, "instance");
  mkdirSync(repository);
  const coordination = createTemporaryRoot(join(parent, "coordination-"), {
    class: "coordination",
    repository,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      gateId: randomUUID(),
      session: "0".repeat(64),
    },
  });
  try {
    finishTemporaryRoot(coordination, "passed");
    assert.match(
      judgeTemporaryRoot(root, coordination, {}, { processes: [] }).retained
        .reason,
      /containing fixture gate is live/,
    );
    outer.release();
    const endedAt = new Date().toISOString();
    recordTemporaryGateResult(root, {
      temporaryGateId: outer.run.runId,
      recordedAt: endedAt,
      taskTimeline: [{ name: "instance", exitCode: 1 }],
    });
    assert.match(
      judgeTemporaryRoot(
        root,
        coordination,
        { now: Date.parse(endedAt) + 3_600_000 },
        { processes: [] },
      ).retained.reason,
      /window/,
    );
    assert.equal(
      readTemporaryOwner(coordination).outcome,
      "passed",
      "preview leaves the inner gate's record unchanged",
    );
  } finally {
    outer.release();
    removeTemporaryRoot(coordination);
    removeTemporaryRoot(parent);
  }
});

test("an orphaned containing fixture starts its full window after an inner gate ended", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const parent = expired(root, "orphaned-lifetime-", {
    owner: { gateId: randomUUID(), suite: "instance" },
  });
  const parentOwner = readTemporaryOwner(parent);
  delete parentOwner.fixtureOwner;
  writeTemporaryOwner(parent, parentOwner);
  const repository = join(parent, "instance");
  mkdirSync(repository);
  const coordination = createTemporaryRoot(join(parent, "coordination-"), {
    class: "coordination",
    repository,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      gateId: randomUUID(),
      session: "0".repeat(64),
    },
  });
  try {
    finishTemporaryRoot(coordination, "passed", "2020-01-01T00:00:00.000Z");
    const now = Date.now();
    assert.match(
      judgeTemporaryRoot(root, coordination, { now }, { processes: [] })
        .retained.reason,
      /end time unavailable/,
    );
    const options = {
      now,
      apply: true,
      processes: [],
      openPaths: [],
      scope: "repository",
      hostDirectory: join(root, ".runtime/host"),
    };
    const first = await pruneHarness(root, options);
    assert.equal(first.retentionsStarted.length, 1, JSON.stringify(first));
    assert.equal(
      readTemporaryOwner(parent).endedAt,
      new Date(now).toISOString(),
    );
    assert.equal(
      readTemporaryOwner(parent).endSource,
      "owner-death-observation",
    );
    assert.ok(existsSync(coordination));
    const after = now + 24 * 3_600_000 + 1;
    assert.equal(
      judgeTemporaryRoot(root, coordination, { now: after }, { processes: [] })
        .candidate.class,
      "coordination",
    );
    await pruneHarness(root, { ...options, now: after });
    assert.equal(existsSync(parent), false);
  } finally {
    if (existsSync(coordination)) removeTemporaryRoot(coordination);
    if (existsSync(parent)) removeTemporaryRoot(parent);
  }
});

test("gate cleanup retries scratch after its fixture writer repository is removed", (t) => {
  const root = fixture(t);
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    gateId: randomUUID(),
    suite: "passed",
  };
  const parent = expired(root, "writer-lifetime-", { owner });
  const parentOwner = readTemporaryOwner(parent);
  delete parentOwner.fixtureOwner;
  writeTemporaryOwner(parent, parentOwner);
  const repository = createTemporaryRoot(join(parent, "repo-"), {
    class: "gate-fixture",
    repository: root,
    owner,
  });
  runGit(repository, ["init", "-q", "-b", "main"]);
  const session = "completed-fixture-writer";
  seedHarnessWriter(repository, {
    worktree: repository,
    actorId: createHash("sha256").update(session).digest("hex"),
    reservedAt: new Date().toISOString(),
    owner: { pid: process.pid, source: "parent" },
  });
  const scratch = createTemporaryRoot(
    join(parent, "long-session-scratch-with-fixture-writer-"),
    {
      class: "session-scratch",
      repository,
      owner: {
        gateId: owner.gateId,
        suite: owner.suite,
        session: createHash("sha256").update(session).digest("hex"),
      },
    },
  );
  try {
    const report = finishGateTemporaryRoots(
      root,
      owner.gateId,
      [{ name: "passed", exitCode: 0 }],
      {
        processes: [],
        worktrees: [],
        holders: [],
      },
    );
    assert.deepEqual(report.blockers, []);
    assert.deepEqual(report.retained, []);
    assert.ok(report.removed.includes(scratch));
    assert.equal(existsSync(parent), false);
  } finally {
    if (existsSync(repository)) {
      releaseHarnessWriter(repository, {
        cwd: repository,
        session_id: session,
        hook_event_name: "Stop",
      });
      removeTemporaryRoot(repository);
    }
    if (existsSync(scratch)) removeTemporaryRoot(scratch);
    if (existsSync(parent)) removeTemporaryRoot(parent);
  }
});

test("a retained nested owner protects its ancestor and churn counts each file once", (t) => {
  const root = fixture(t);
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    gateId: randomUUID(),
    session: "0".repeat(64),
  };
  const parent = expired(root, "parent-", {
    owner: { ...owner, suite: "passed" },
  });
  // Model a completed independent gate, not the still-running test runner.
  const parentOwner = readTemporaryOwner(parent);
  delete parentOwner.fixtureOwner;
  writeTemporaryOwner(parent, parentOwner);
  const child = createTemporaryRoot(join(parent, "child-"), {
    class: "gate-fixture",
    repository: root,
    owner: { ...owner, suite: "failed" },
  });
  assert.equal(readTemporaryOwner(child).fixtureOwner.token, parentOwner.token);
  writeFileSync(join(child, "diagnosis"), "keep this");
  const tasks = [
    { name: "passed", exitCode: 0 },
    { name: "failed", exitCode: 1 },
  ];
  const endedAt = new Date().toISOString();
  recordTemporaryGateResult(root, {
    temporaryGateId: owner.gateId,
    recordedAt: endedAt,
    taskTimeline: tasks,
  });
  const requireDiagnosis = () => {
    assert.match(
      judgeTemporaryRoot(root, child, {}, { processes: [] }).retained.reason,
      /retention window/,
    );
    assert.match(
      judgeTemporaryRoot(root, parent, {}, { processes: [] }).retained.reason,
      /nested owned root retained/,
    );
  };
  // A crash after the terminal row but before the finisher must preserve the
  // child's own failed suite, even though its parent's suite passed.
  requireDiagnosis();
  const report = finishGateTemporaryRoots(root, owner.gateId, tasks, {
    processes: [],
    endedAt,
  });
  assert.ok(existsSync(parent) && existsSync(child));
  assert.ok(
    report.retained.some(
      (row) => row.path === parent && /nested/.test(row.reason),
    ),
  );
  requireDiagnosis();
  const afterWindow = { now: Date.parse(endedAt) + 24 * 3_600_000 + 1 };
  for (const path of [child, parent])
    assert.ok(
      judgeTemporaryRoot(root, path, afterWindow, { processes: [] }).candidate,
    );
  const inventory = temporaryInventory(parent),
    churn = temporaryChurn(root, owner.gateId);
  assert.equal(churn.filesCreated, inventory.files);
  assert.equal(churn.bytesWritten, inventory.bytes);
  assert.equal(churn.filesDeleted, 0);
  // These independent failed-owner controls have served their assertions.
  // Their simulated diagnosis window must not pin the real runner's fixture.
  removeTemporaryRoot(child);
  removeTemporaryRoot(parent);
});

test("removing an orphan capture never recreates its deleted owning worktree", (t) => {
  const root = fixture(t),
    repository = join(root, "deleted-worktree");
  mkdirSync(repository);
  const capture = expired(root, "orphan-", {
    class: "worker-capture",
    repository,
  });
  removeDirectory(repository, { recursive: true });
  const row = judgeTemporaryRoot(
    root,
    capture,
    {},
    { processes: [] },
  ).candidate;
  assert.equal(row.class, "worker-capture");
  applyTemporaryCandidate(root, row);
  assert.equal(existsSync(capture), false);
  assert.equal(existsSync(repository), false);
});

test("a passed fixture ends its nested runtime scratch but preserves an explicit null window", (t) => {
  const root = fixture(t);
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    gateId: "runtime-fixture",
    suite: "passed",
  };
  const parent = expired(root, "runtime-parent-", { owner });
  const children = ["session-scratch", "worker-capture", "coordination"].map(
    (kind) =>
      createTemporaryRoot(join(parent, `${kind}-`), {
        class: kind,
        repository: root,
        owner,
      }),
  );
  const keep = createTemporaryRoot(join(parent, "keep-"), {
    class: "worker-capture",
    repository: root,
    owner,
    retentionHours: null,
  });
  const ended = finishGateTemporaryRoots(
    root,
    owner.gateId,
    [{ name: "passed", exitCode: 0 }],
    { processes: [] },
  );
  assert.equal(ended.blockers.length, 0);
  for (const child of children) assert.equal(existsSync(child), false, child);
  assert.ok(existsSync(parent) && existsSync(keep));
  assert.equal(readTemporaryOwner(keep).retentionHours, null);
  removeTemporaryRoot(keep);
  finishGateTemporaryRoots(
    root,
    owner.gateId,
    [{ name: "passed", exitCode: 0 }],
    { processes: [] },
  );
  assert.equal(existsSync(parent), false);
});

test("gate cleanup finishes nested coordination after its fixture repository is removed", (t) => {
  const root = fixture(t);
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    gateId: "removed-fixture-repository",
    suite: "passed",
  };
  const parent = expired(root, "runtime-parent-", { owner });
  const repository = join(parent, "already-removed-repository");
  mkdirSync(repository);
  const coordination = createTemporaryRoot(join(parent, "coordination-"), {
    class: "coordination",
    repository,
    owner,
  });
  removeDirectory(repository, { recursive: true });
  const ended = finishGateTemporaryRoots(
    root,
    owner.gateId,
    [{ name: "passed", exitCode: 0 }],
    { processes: [], worktrees: [], holders: [] },
  );
  assert.deepEqual(ended.blockers, []);
  assert.ok(ended.removed.includes(coordination));
  assert.equal(existsSync(parent), false);
  assert.equal(existsSync(repository), false);
});

test("ordinary prune ends expired fixture lifetimes across repository removal and cache protocols", async (t) => {
  const cases = [
    { name: "present repositories", kind: "session-scratch" },
    { name: "removed worktree", kind: "session-scratch", removeWorktree: true },
    {
      name: "removed nested repository",
      kind: "worker-capture",
      removeNested: true,
    },
    {
      name: "both repositories removed",
      kind: "coordination",
      removeWorktree: true,
      removeNested: true,
    },
    { name: "current nested cache", kind: "warm-fixture", currentKey: true },
    { name: "unavailable nested cache key", kind: "warm-fixture" },
    {
      name: "nested cache without its own gate",
      kind: "warm-fixture",
      noOwnGate: true,
    },
    {
      name: "removed cache repository",
      kind: "warm-fixture",
      removeNested: true,
    },
    {
      name: "live cache owner",
      kind: "warm-fixture",
      removeNested: true,
      protect: "live",
    },
    { name: "unknown cache owner", kind: "warm-fixture", protect: "unknown" },
    {
      name: "explicit null cache retention",
      kind: "warm-fixture",
      removeWorktree: true,
      protect: "null",
    },
    {
      name: "unexpired cache diagnosis",
      kind: "warm-fixture",
      currentKey: true,
      protect: "window",
    },
    {
      name: "unreadable gate observation",
      kind: "session-scratch",
      protect: "malformed-gate",
    },
    {
      name: "missing repository through an alias",
      kind: "session-scratch",
      removeNested: true,
      protect: "alias",
    },
    { name: "live inner gate", kind: "warm-fixture", protect: "gate" },
    {
      name: "live containing gate",
      kind: "warm-fixture",
      protect: "outer-gate",
    },
    {
      name: "live containing gate without a cache gate id",
      kind: "warm-fixture",
      noOwnGate: true,
      protect: "outer-gate",
    },
    { name: "live nested writer", kind: "warm-fixture", protect: "writer" },
    { name: "live nested lane", kind: "warm-fixture", protect: "lane" },
  ];
  for (const scenario of cases)
    await t.test(scenario.name, async (t) => {
      const root = fixture(t);
      runGit(root, ["init", "-q", "-b", "main"]);
      const worktree = join(root, "worktree");
      mkdirSync(worktree);
      runGit(worktree, ["init", "-q", "-b", "main"]);
      const owner = {
        pid: 2147483647,
        birth: "1.0",
        session: "0".repeat(64),
        gateId: randomUUID(),
        suite: "failed",
      };
      const parent = expired(root, "dotln-expired-fixture-", {
        repository: worktree,
        owner,
      });
      const parentOwner = readTemporaryOwner(parent);
      delete parentOwner.fixtureOwner;
      writeTemporaryOwner(parent, parentOwner);
      const repository = join(parent, "instance");
      mkdirSync(repository);
      runGit(repository, ["init", "-q", "-b", "main"]);
      let releaseUse = () => {};
      t.after(() => {
        if (existsSync(repository)) releaseUse();
      });
      const nested = createTemporaryRoot(join(parent, "nested-"), {
        class: scenario.kind,
        repository,
        owner: {
          ...owner,
          ...(scenario.noOwnGate ? { gateId: undefined } : {}),
        },
        ...(scenario.kind === "warm-fixture" ? { cacheKey: "current" } : {}),
        ...(scenario.protect === "null" ? { retentionHours: null } : {}),
      });
      assert.equal(
        readTemporaryOwner(nested).fixtureOwner.token,
        parentOwner.token,
      );
      const endedAt = "2020-01-01T00:00:00.000Z";
      finishTemporaryRoot(nested, "failed", endedAt);
      finishTemporaryRoot(parent, "failed", endedAt);
      if (scenario.currentKey) {
        mkdirSync(join(repository, ".runtime/fixtures/launchpad"), {
          recursive: true,
        });
        writeFileSync(
          join(repository, ".runtime/fixtures/launchpad/current.json"),
          JSON.stringify({ key: "current" }),
        );
      }
      if (scenario.protect === "unknown") {
        const record = readTemporaryOwner(nested);
        record.owner.birth = null;
        writeTemporaryOwner(nested, record);
        // The containing fixture's own owner has ended, so its record lets it
        // go and only the cache nested in it, whose owner is unknown, keeps it.
        const containing = readTemporaryOwner(parent);
        containing.owner.pid = 2147483646;
        writeTemporaryOwner(parent, containing);
      }
      if (scenario.protect === "malformed-gate") {
        const directory = join(
          repository,
          "docs/control/local/harness/active-gates",
        );
        mkdirSync(directory, { recursive: true });
        writeFileSync(join(directory, `${owner.gateId}.json`), "{}");
      }
      if (scenario.protect === "gate") {
        const gate = beginGateRun(repository, "nested cache use");
        releaseUse = () => gate.release();
        const record = readTemporaryOwner(nested);
        record.owner.gateId = gate.run.runId;
        writeTemporaryOwner(nested, record);
      }
      if (scenario.protect === "outer-gate") {
        const gate = beginGateRun(worktree, "containing fixture use");
        releaseUse = () => gate.release();
        const containing = readTemporaryOwner(parent);
        containing.owner.gateId = gate.run.runId;
        writeTemporaryOwner(parent, containing);
        const record = readTemporaryOwner(nested);
        record.fixtureOwner.gateId = gate.run.runId;
        writeTemporaryOwner(nested, record);
        if (record.owner.gateId)
          assert.match(
            judgeTemporaryRoot(
              root,
              nested,
              {},
              {
                processes: [],
                finishingGate: { repository, id: record.owner.gateId },
              },
            ).retained.reason,
            /containing fixture gate is live/,
            "an inner gate's completion cannot end its containing fixture's use",
          );
      }
      if (scenario.protect === "writer") {
        const session = "nested-cache-writer";
        seedHarnessWriter(repository, {
          worktree: repository,
          actorId: createHash("sha256").update(session).digest("hex"),
          reservedAt: new Date().toISOString(),
          owner: { pid: process.pid, source: "parent" },
        });
        releaseUse = () =>
          releaseHarnessWriter(repository, {
            cwd: repository,
            session_id: session,
            hook_event_name: "Stop",
          });
      }
      if (scenario.removeWorktree)
        removeDirectory(worktree, { recursive: true });
      if (scenario.removeNested)
        removeDirectory(repository, { recursive: true });
      if (scenario.protect === "alias")
        symlinkSync(join(root, "absent"), repository);
      const options = {
        now:
          Date.parse(endedAt) +
          (scenario.protect === "window" ? 1 : 49) * 3_600_000,
        scope: "repository",
        temporaryBases: [join(root, "roots")],
        hostDirectory: join(root, ".runtime/host"),
        processes: ["live", "unknown"].includes(scenario.protect)
          ? [owner]
          : [],
        openPaths: [],
        holders: scenario.protect === "lane" ? [{ worktree: repository }] : [],
        sessionId: "ordinary-fixture-prune",
      };
      const markerBefore = readFileSync(
        join(parent, ".dotln-owner.json"),
        "utf8",
      );
      const report = await pruneHarness(root, options);
      const label = relative(root, parent);
      const retained = report.retained.find((row) => row.path === label);
      assert.equal(
        readFileSync(join(parent, ".dotln-owner.json"), "utf8"),
        markerBefore,
        "preview preserves the recorded window",
      );
      if (scenario.protect) {
        assert.ok(retained, JSON.stringify(report));
        const reason = {
          live: /owner is live/,
          unknown: /identity is unavailable/,
          null: /indefinitely/,
          window: /window has not passed/,
          "malformed-gate": /Malformed active gate marker/,
          alias: /symbolic-link ancestor/,
          gate: /owning gate is live/,
          // The containing fixture's record speaks before the roots nested
          // in it: its own gate is the live one. The nested cache's judgment
          // above names the same gate as its containing fixture's.
          "outer-gate": /owning gate is live/,
          writer: /writer reservation/,
          lane: /live host lane/,
        }[scenario.protect];
        assert.match(retained.reason, reason);
      } else {
        assert.ok(
          report.candidates.some((row) => row.path === label),
          JSON.stringify(report),
        );
        const applied = await pruneHarness(root, { ...options, apply: true });
        assert.deepEqual(applied.blockers, []);
        assert.ok(applied.removed.some((row) => row.path === label));
        assert.equal(existsSync(parent), false);
        assert.equal(existsSync(repository), false);
        if (scenario.removeWorktree) assert.equal(existsSync(worktree), false);
      }
      // These are synthetic retention controls. Their assertions end their
      // lifetime; do not carry them into the enclosing real gate's cleanup.
      releaseUse();
      if (existsSync(nested)) removeTemporaryRoot(nested);
      if (existsSync(parent)) removeTemporaryRoot(parent);
    });
});

test("removing a fixture repository cannot reset its recorded null retention", (t) => {
  const root = fixture(t),
    repository = join(root, "removed-policy");
  mkdirSync(join(repository, "docs/control"), { recursive: true });
  writeFileSync(
    join(repository, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "session-scratch": null } }),
  );
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    gateId: "removed-policy",
    suite: "passed",
  };
  const parent = expired(root, "policy-parent-", { owner });
  const scratch = createTemporaryRoot(join(parent, "protected-"), {
    class: "session-scratch",
    repository,
    owner,
  });
  const coordination = createTemporaryRoot(join(parent, "coordination-"), {
    class: "coordination",
    repository,
    owner,
  });
  const record = readTemporaryOwner(scratch);
  assert.equal(record.retentionHours, null);
  removeDirectory(repository, { recursive: true });
  assert.equal(
    temporaryOutcomeRecord(record, "passed", new Date().toISOString())
      .retentionHours,
    null,
  );
  const result = finishGateTemporaryRoots(
    root,
    "removed-policy",
    [{ name: "passed", exitCode: 0 }],
    { processes: [], worktrees: [], holders: [] },
  );
  assert.deepEqual(result.blockers, []);
  assert.ok(
    existsSync(scratch),
    "a missing policy cannot cancel a recorded null window",
  );
  assert.equal(
    existsSync(coordination),
    false,
    "default fixture coordination still ends with its gate",
  );
  removeTemporaryRoot(scratch);
});

test("a budget left in conflict by an integration still admits scratch under the default policy", (t) => {
  const root = fixture(t),
    repository = join(root, "conflicted-budget"),
    budgets = join(repository, "docs/control/budgets.json");
  mkdirSync(dirname(budgets), { recursive: true });
  writeFileSync(
    budgets,
    '{\n<<<<<<< Updated upstream\n  "retention": {}\n=======\n  "drivenSessionCeiling": 80\n>>>>>>> Stashed changes\n}\n',
  );
  assert.equal(readRetention(repository)["session-scratch"], 24);
  // Only unreadable text falls back: a budget that parses keeps its refusal.
  writeFileSync(
    budgets,
    JSON.stringify({ retention: { "session-scratch": -1 } }),
  );
  assert.throws(
    () => readRetention(repository),
    /Invalid budget: retention\.session-scratch/,
  );
});

test("application scratch cleans up at its own completion while fixture teardown waits for the gate", (t) => {
  const root = fixture(t);
  withTemporaryOwner(
    { repository: root, gateId: "explicit-completion", suite: "passed" },
    () => {
      const parent = createFixtureRoot(join(root, "case-"));
      const scratch = createScratchRoot(join(parent, "operation-"));
      assert.ok(readTemporaryOwner(scratch).fixtureOwner);
      removeTemporaryPath(scratch, { recursive: true, force: true });
      assert.equal(existsSync(scratch), false);
      removeTemporaryPath(parent, { recursive: true, force: true });
      assert.ok(existsSync(parent));
      const result = finishGateTemporaryRoots(
        root,
        "explicit-completion",
        [{ name: "passed", exitCode: 0 }],
        { processes: [] },
      );
      assert.deepEqual(result.blockers, []);
      assert.equal(existsSync(parent), false);
    },
  );
});

test("a gate id without a matching cleanup repository does not defer creator teardown", (t) => {
  const root = fixture(t);
  const path = expired(root, "unmanaged-gate-", {
    owner: { gateId: randomUUID(), suite: "nested" },
  });
  removeTemporaryPath(path, { recursive: true, force: true });
  assert.equal(existsSync(path), false);
  assert.ok(
    temporaryLedger(root).some(
      (row) => row.action === "removed" && row.path === path,
    ),
  );
});

test("churn inventory does not count sparse holes as written content", (t) => {
  const root = fixture(t);
  const before = temporaryInventory(root);
  const fd = openSync(join(root, "sparse"), "w");
  try {
    ftruncateSync(fd, 1024 ** 4);
  } finally {
    closeSync(fd);
  }
  const after = temporaryInventory(root);
  assert.equal(after.files, before.files + 1);
  assert.ok(after.bytes - before.bytes < 1024 * 1024);
});

test("a replaced gate owner is retained without claiming a cleanup failure", (t) => {
  const root = fixture(t);
  const path = expired(root, "replaced-", {
    owner: { gateId: "replaced", suite: "passed" },
  });
  const owner = readTemporaryOwner(path);
  writeTemporaryOwner(path, { ...owner, token: randomUUID() });
  const result = finishGateTemporaryRoots(
    root,
    "replaced",
    [{ name: "passed", exitCode: 0 }],
    { processes: [] },
  );
  assert.deepEqual(result.blockers, []);
  assert.ok(
    result.retained.some(
      (row) => row.path === path && row.reason.includes("identity changed"),
    ),
  );
  assert.ok(existsSync(path));
  writeTemporaryOwner(path, owner);
});

test("standalone gate material shares suite retention without losing null policies or cache ownership", (t) => {
  const root = fixture(t);
  const gateId = randomUUID();
  const paths = {};
  const owner = { pid: 2147483647, birth: "1.0", gateId, suite: "passed" };
  for (const [name, extra] of Object.entries({
    passed: {},
    failed: { owner: { ...owner, suite: "failed" } },
    unknown: { owner: { ...owner, pid: null, birth: null } },
    forever: { retentionHours: null },
    scratch: { class: "session-scratch" },
    cache: { class: "warm-fixture", cacheKey: "current" },
    coordination: { class: "coordination" },
    sibling: { owner: { ...owner, gateId: randomUUID() } },
  })) {
    const path = expired(root, `${name}-`, {
      class: "worker-capture",
      owner,
      ...extra,
    });
    // Model standalone roots, independently of the test runner's fixture.
    const record = readTemporaryOwner(path);
    delete record.fixtureOwner;
    writeTemporaryOwner(path, record);
    paths[name] = path;
  }
  mkdirSync(join(root, "docs/control"), { recursive: true });
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "session-scratch": null } }),
  );
  const tasks = [
    { name: "passed", exitCode: 0 },
    { name: "failed", exitCode: 1 },
  ];
  const endedAt = new Date().toISOString();
  recordTemporaryGateResult(root, {
    temporaryGateId: gateId,
    recordedAt: endedAt,
    taskTimeline: tasks,
  });
  assert.ok(
    judgeTemporaryRoot(root, paths.passed, {}, { processes: [] }).candidate,
  );
  writeTemporaryOwner(paths.passed, {
    ...readTemporaryOwner(paths.passed),
    endedAt,
    endSource: "owner-death-observation",
    outcome: "abandoned",
  });
  assert.ok(
    judgeTemporaryRoot(root, paths.passed, {}, { processes: [] }).candidate,
    "the terminal suite result supersedes a provisional orphan observation",
  );
  assert.match(
    judgeTemporaryRoot(root, paths.failed, {}, { processes: [] }).retained
      .reason,
    /retention window/,
  );
  const report = finishGateTemporaryRoots(root, gateId, tasks, {
    processes: [],
    endedAt,
  });
  assert.deepEqual(report.blockers, []);
  assert.deepEqual(report.removed, [paths.passed]);
  assert.equal(existsSync(paths.passed), false);
  for (const name of [
    "failed",
    "unknown",
    "forever",
    "scratch",
    "cache",
    "coordination",
  ])
    assert.ok(
      report.retained.some((row) => row.path === paths[name] && row.reason),
    );
  assert.equal(readTemporaryOwner(paths.failed).retentionHours, 24);
  assert.equal(readTemporaryOwner(paths.failed).endedAt, endedAt);
  assert.equal(readTemporaryOwner(paths.forever).retentionHours, null);
  assert.equal(readTemporaryOwner(paths.scratch).retentionHours, null);
  for (const name of ["cache", "coordination", "sibling"])
    assert.equal(readTemporaryOwner(paths[name]).endedAt, undefined);
  assert.equal(
    report.retained.some((row) => row.path === paths.sibling),
    false,
  );
  // These controls deliberately sever containing-fixture ownership. Their
  // creator disposes them after proving each independent retention rule.
  for (const path of Object.values(paths)) {
    if (existsSync(path)) removeTemporaryRoot(path);
    assert.equal(existsSync(path), false);
  }
});

test("repeated completion never extends a diagnosis window and supersedes provisional observations", (t) => {
  const root = fixture(t);
  const path = expired(root, "completed-", {
    owner: { gateId: randomUUID(), suite: "failed" },
  });
  const first = "2026-10-27T01:00:00.000Z";
  const later = "2026-10-27T03:00:00.000Z";
  const earlier = "2026-10-27T00:00:00.000Z";
  finishTemporaryRoot(path, "failed", first);
  assert.equal(finishTemporaryRoot(path, "failed", later).endedAt, first);
  assert.equal(readTemporaryOwner(path).retentionHours, 24);
  assert.equal(finishTemporaryRoot(path, "failed", earlier).endedAt, earlier);
  writeTemporaryOwner(path, {
    ...readTemporaryOwner(path),
    endSource: "owner-death-observation",
    outcome: "abandoned",
  });
  assert.equal(finishTemporaryRoot(path, "failed", later).endedAt, later);
  assert.equal(readTemporaryOwner(path).endSource, "completion");
});

test("terminal-row crash recovery preserves explicit and class null retention", (t) => {
  const root = fixture(t);
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    gateId: randomUUID(),
    suite: "passed",
  };
  const parent = expired(root, "recovery-parent-", { owner });
  // This control supplies its own terminal gate independently of the runner.
  const parentOwner = readTemporaryOwner(parent);
  delete parentOwner.fixtureOwner;
  writeTemporaryOwner(parent, parentOwner);
  const forever = createTemporaryRoot(join(parent, "forever-"), {
    class: "worker-capture",
    repository: root,
    owner,
    retentionHours: null,
  });
  const scratch = createTemporaryRoot(join(parent, "scratch-"), {
    class: "session-scratch",
    repository: root,
    owner,
  });
  const disposable = createTemporaryRoot(join(parent, "disposable-"), {
    class: "worker-capture",
    repository: root,
    owner,
    retentionHours: 0,
  });
  mkdirSync(join(root, "docs/control"), { recursive: true });
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "session-scratch": null } }),
  );
  recordTemporaryGateResult(root, {
    temporaryGateId: owner.gateId,
    recordedAt: new Date().toISOString(),
    taskTimeline: [{ name: "passed", exitCode: 0 }],
  });
  for (const path of [forever, scratch]) {
    assert.match(
      judgeTemporaryRoot(root, path, {}, { processes: [] }).retained.reason,
      /indefinitely/,
    );
    assert.equal(
      readTemporaryOwner(path).endedAt,
      undefined,
      "preview does not rewrite the root",
    );
  }
  assert.match(
    judgeTemporaryRoot(root, parent, {}, { processes: [] }).retained.reason,
    /nested/,
  );
  assert.ok(
    judgeTemporaryRoot(root, disposable, {}, { processes: [] }).candidate,
  );
  removeTemporaryRoot(forever);
  removeTemporaryRoot(scratch);
  finishGateTemporaryRoots(
    root,
    owner.gateId,
    [{ name: "passed", exitCode: 0 }],
    {
      processes: [],
    },
  );
  assert.equal(existsSync(parent), false);
});

test("gate completion preserves a nested root named by a live sibling writer or lane", (t) => {
  const root = fixture(t),
    sibling = fixture(t);
  runGit(sibling, ["init", "-q", "-b", "main"]);
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    gateId: randomUUID(),
    suite: "passed",
  };
  const parent = expired(root, "parallel-parent-", { owner });
  const child = createTemporaryRoot(join(parent, "parallel-capture-"), {
    class: "worker-capture",
    repository: sibling,
    owner,
  });
  const session = "live-parallel-writer";
  seedHarnessWriter(sibling, {
    worktree: sibling,
    actorId: createHash("sha256").update(session).digest("hex"),
    reservedAt: new Date().toISOString(),
    owner: { pid: process.pid, source: "parent" },
  });
  const finish = (holders = []) =>
    finishGateTemporaryRoots(
      root,
      owner.gateId,
      [{ name: "passed", exitCode: 0 }],
      { processes: [], holders },
    );
  try {
    const report = finish();
    assert.ok(
      report.retained.some(
        (row) => row.path === child && /writer/.test(row.reason),
      ),
    );
    assert.ok(existsSync(parent) && existsSync(child));
    assert.equal(readTemporaryOwner(child).endedAt, undefined);
  } finally {
    releaseHarnessWriter(sibling, {
      cwd: sibling,
      session_id: session,
      hook_event_name: "Stop",
    });
  }
  const lane = finish([{ worktree: sibling, task: "parallel-gate" }]);
  assert.ok(
    lane.retained.some((row) => row.path === child && /lane/.test(row.reason)),
  );
  assert.ok(existsSync(parent) && existsSync(child));
  assert.equal(finish().blockers.length, 0);
  assert.equal(existsSync(parent), false);
});

test("an orphan's full window starts when apply first proves its long-lived owner ended", async (t) => {
  for (const [kind, hours] of [
    ["worker-capture", 1],
    ["session-scratch", 24],
    ["gate-fixture", 24],
  ]) {
    const root = fixture(t);
    runGit(root, ["init", "-q", "-b", "main"]);
    const owner = {
      pid: 2147483647,
      birth: "1.0",
      gateId: kind === "gate-fixture" ? randomUUID() : undefined,
      suite: undefined,
      session: "0".repeat(64),
    };
    const capture = createTemporaryRoot(join(root, "roots/long-lived-"), {
      class: kind,
      repository: root,
      owner,
    });
    const record = readTemporaryOwner(capture);
    // This case models an independent orphan rather than the enclosing
    // runner fixture's lifetime, so its own class window is the subject.
    delete record.fixtureOwner;
    record.createdAt = "2020-01-01T00:00:00.000Z";
    writeTemporaryOwner(capture, record);
    const now = Date.now(),
      options = {
        now,
        processes: [],
        openPaths: [],
        scope: "repository",
        hostDirectory: join(root, ".runtime/host"),
      };
    assert.match(
      judgeTemporaryRoot(root, capture, { now }, { processes: [owner] })
        .retained.reason,
      /live/,
    );
    assert.match(
      judgeTemporaryRoot(root, capture, { now }, { processes: [] }).retained
        .reason,
      /end time unavailable/,
    );
    assert.equal(readTemporaryOwner(capture).endedAt, undefined);
    const first = await pruneHarness(root, { ...options, apply: true });
    assert.equal(first.retentionsStarted.length, 1);
    assert.ok(existsSync(capture));
    assert.equal(
      readTemporaryOwner(capture).endedAt,
      new Date(now).toISOString(),
    );
    assert.equal(
      readTemporaryOwner(capture).endSource,
      "owner-death-observation",
    );
    if (kind === "gate-fixture")
      assert.equal(readTemporaryOwner(capture).outcome, "abandoned");
    assert.match(
      judgeTemporaryRoot(
        root,
        capture,
        { now: now + hours * 3_600_000 - 1 },
        { processes: [] },
      ).retained.reason,
      /window/,
    );
    await pruneHarness(root, {
      ...options,
      now: now + hours * 3_600_000 + 1,
      apply: true,
    });
    assert.equal(existsSync(capture), false);
  }
});

test("root ledger segments retire independently after durable gate metrics", (t) => {
  const root = fixture(t);
  for (let i = 0; i < 3; i++) {
    const path = createTemporaryRoot(join(root, "roots/short-"), {
      class: "gate-fixture",
      repository: root,
      owner: { gateId: undefined, suite: undefined },
    });
    removeTemporaryRoot(path);
  }
  assert.deepEqual(temporaryLedger(root), []);
  const path = createTemporaryRoot(join(root, "roots/gated-"), {
    class: "gate-fixture",
    repository: root,
    owner: { gateId: "retire-gate" },
  });
  removeTemporaryRoot(path);
  assert.ok(temporaryChurn(root, "retire-gate").filesDeleted > 0);
  retireTemporaryLedger(root);
  assert.ok(
    temporaryLedger(root).length > 0,
    "generic cleanup cannot retire unfinished gate metrics",
  );
  retireTemporaryLedger(root, "retire-gate");
  assert.deepEqual(temporaryLedger(root), []);
});

test("a promoted child is counted through its containing fixture only once", (t) => {
  const root = fixture(t),
    owner = { gateId: "promotion-gate" };
  const parent = createTemporaryRoot(join(root, "roots/promoted-parent-"), {
    class: "gate-fixture",
    repository: root,
    owner,
  });
  const child = createTemporaryRoot(join(parent, "stage-"), {
    class: "gate-fixture",
    repository: root,
    owner,
  });
  writeFileSync(join(child, "built"), "published bytes");
  promoteTemporaryRoot(child);
  const inventory = temporaryInventory(parent),
    churn = temporaryChurn(root, "promotion-gate");
  assert.equal(churn.filesCreated, inventory.files);
  assert.equal(churn.bytesWritten, inventory.bytes);
});

test("prune removes an eligible legacy parent and its owned child as one tree", async (t) => {
  const root = fixture(t),
    parent = join(root, "roots/dotln-legacy-abcdef");
  runGit(root, ["init", "-q", "-b", "main"]);
  mkdirSync(parent);
  const child = createTemporaryRoot(join(parent, "child-"), {
    class: "gate-fixture",
    repository: root,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      session: "0".repeat(64),
      gateId: undefined,
      suite: undefined,
    },
  });
  const record = readTemporaryOwner(child);
  record.createdAt = "2020-01-01T00:00:00.000Z";
  record.endedAt = record.createdAt;
  writeTemporaryOwner(child, record);
  const old = new Date("2020-01-01T00:00:00.000Z");
  utimesSync(parent, old, old);
  const report = await pruneHarness(root, {
    apply: true,
    scope: "repository",
    temporaryBases: [join(root, "roots")],
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  });
  assert.equal(
    report.removed.filter((row) => row.kind === "legacy-backfill").length,
    1,
  );
  assert.equal(existsSync(parent), false);
  assert.equal(existsSync(child), false);
});

test("session cleanup removes its scratch and dead capture but preserves a live sibling and worker", (t) => {
  const root = fixture(t);
  const digest = (id) => createHash("sha256").update(id).digest("hex");
  const own = ensureTemporaryRoot(join(root, "own"), {
    class: "session-scratch",
    repository: root,
    owner: { session: digest("own") },
  });
  const sibling = ensureTemporaryRoot(join(root, "sibling"), {
    class: "session-scratch",
    repository: root,
    owner: { session: digest("sibling") },
  });
  const dead = expired(root, "capture-", {
    class: "worker-capture",
    owner: { pid: 2147483647, birth: "1.0", session: digest("own") },
  });
  const live = ensureTemporaryRoot(join(root, "live"), {
    class: "worker-capture",
    repository: root,
    owner: { session: digest("own") },
  });
  const turnEnd = pruneSessionTemporaryRoots(root, "own");
  assert.ok(existsSync(own), "a live host keeps scratch between turns");
  assert.ok(turnEnd.retained.includes(own));
  const report = pruneSessionTemporaryRoots(root, "own", {
    dispatchEnded: true,
  });
  assert.deepEqual(report.removed, [own]);
  assert.deepEqual(turnEnd.removed, [dead]);
  assert.deepEqual(report.retained, [live]);
  assert.equal(existsSync(own), false);
  assert.ok(existsSync(sibling) && existsSync(live));
});

test("session completion preserves a class whose retention becomes null after creation", (t) => {
  const root = fixture(t);
  const session = createHash("sha256").update("changed-policy").digest("hex");
  const scratch = ensureTemporaryRoot(join(root, "changed-policy"), {
    class: "session-scratch",
    repository: root,
    owner: { session },
  });
  assert.equal(readTemporaryOwner(scratch).retentionHours, 24);
  mkdirSync(join(root, "docs/control"), { recursive: true });
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "session-scratch": null } }),
  );
  const result = pruneSessionTemporaryRoots(root, "changed-policy", {
    dispatchEnded: true,
  });
  assert.deepEqual(result.removed, []);
  assert.deepEqual(result.retained, [scratch]);
  assert.equal(readTemporaryOwner(scratch).retentionHours, null);
  assert.ok(existsSync(scratch));
  removeTemporaryRoot(scratch);
});

test("session cleanup skips unrelated malformed markers and isolates its own blocker", (t) => {
  const root = fixture(t),
    digest = (id) => createHash("sha256").update(id).digest("hex");
  const make = (name, session) =>
    ensureTemporaryRoot(join(root, name), {
      class: "session-scratch",
      repository: root,
      owner: { session: digest(session) },
    });
  const unrelated = make("unrelated", "sibling"),
    blocked = make("blocked", "own"),
    healthy = make("healthy", "own");
  const originals = [unrelated, blocked].map((path) => [
    path,
    readTemporaryOwner(path),
  ]);
  for (const path of [unrelated, blocked])
    writeFileSync(join(path, ".dotln-owner.json"), "invalid\n");
  const report = pruneSessionTemporaryRoots(root, "own", {
    dispatchEnded: true,
  });
  assert.deepEqual(report.removed, [healthy]);
  assert.deepEqual(report.retained, [blocked]);
  assert.equal(report.blockers.length, 1);
  assert.ok(existsSync(unrelated) && existsSync(blocked));
  for (const [path, record] of originals) writeTemporaryOwner(path, record);
});

test("a parallel worktree's writer or lane protects even an expired root", (t) => {
  const root = fixture(t),
    sibling = join(root, "sibling");
  mkdirSync(sibling);
  runGit(sibling, ["init", "-q", "-b", "main"]);
  const path = expired(root, "sibling-root-", { repository: sibling });
  const context = {
    processes: [],
    worktrees: [{ worktree: root }, { worktree: sibling }],
  };
  assert.match(
    judgeTemporaryRoot(
      root,
      path,
      {},
      { ...context, holders: [{ worktree: sibling, task: "parallel gate" }] },
    ).retained.reason,
    /live host lane/,
  );
  const session = "parallel-writer";
  seedHarnessWriter(sibling, {
    worktree: sibling,
    actorId: createHash("sha256").update(session).digest("hex"),
    reservedAt: new Date().toISOString(),
    owner: { pid: process.pid, source: "parent" },
  });
  try {
    assert.match(
      judgeTemporaryRoot(root, path, {}, context).retained.reason,
      /writer reservation/,
    );
  } finally {
    releaseHarnessWriter(sibling, {
      cwd: sibling,
      session_id: session,
      hook_event_name: "Stop",
    });
  }
  assert.ok(existsSync(path));
});

test("retention seeds admit an older instance and reject invalid values", (t) => {
  const root = fixture(t);
  assert.equal(readRetention(root)["worker-capture"], 1);
  // A closed order's journals are kept thirty days unless the budgets say so.
  assert.equal(readRetention(root)["closed-journal"], 720);
  for (const file of [
    "docs/control/budgets.json",
    "scripts/kit/budgets.template.json",
  ])
    assert.equal(
      JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"))
        .retention["closed-journal"],
      720,
      `${file} seeds the closed-journal window`,
    );
  // A newer kit's class paces nothing in this runtime's reader, while the
  // gate's budget validation still refuses a key it does not know.
  mkdirSync(join(root, "docs/control"), { recursive: true });
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "future-class": 5, "worker-capture": 2 } }),
  );
  assert.equal(readRetention(root)["worker-capture"], 2);
  assert.equal("future-class" in readRetention(root), false);
  assert.throws(
    () => validateRetention({ "future-class": 5 }),
    /Invalid budget: retention.future-class/,
  );
  mkdirSync(join(root, "docs/control"), { recursive: true });
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "session-scratch": null } }),
  );
  assert.equal(readRetention(root)["session-scratch"], null);
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "worker-capture": -1 } }),
  );
  assert.throws(
    () => readRetention(root),
    /Invalid budget: retention.worker-capture/,
  );
});

test("declarations name a raw temp call and ignore quoted examples", (t) => {
  const root = fixture(t);
  mkdirSync(join(root, "scripts"));
  writeFileSync(
    join(root, "scripts/bad.mjs"),
    'import {mkdtempSync as raw} from "node:fs";\nraw(join(tmpdir(), "dotln-unowned-"));\n',
  );
  writeFileSync(
    join(root, "scripts/example.mjs"),
    'const example = "mkdtempSync(join(tmpdir(), \\\"dotln-example-\\\"))";\n' +
      String.raw`const re = /^[a-z][a-z0-9+.-]*:|^\/\/|^#/iu;` +
      "\n",
  );
  writeFileSync(
    join(root, "scripts/absolute.mjs"),
    [
      'import fs from "node:fs";',
      `fs.promises.mkdtemp(${JSON.stringify(join(tmpdir(), "dotln-absolute-"))});`,
      'fs.mkdtempSync("/tmp/plain-prefix-");',
      'fs.mkdtempSync("/some/temporary/base/dotln-literal-");',
      'fs.mkdtempSync(join(store, ".atomic-"));',
    ].join("\n"),
  );
  assert.deepEqual(unownedTemporaryRootSites(root), [
    { path: "scripts/absolute.mjs", line: 2 },
    { path: "scripts/absolute.mjs", line: 3 },
    { path: "scripts/absolute.mjs", line: 4 },
    { path: "scripts/bad.mjs", line: 2 },
  ]);
});

test("declarations follow executable evidence imports and path literals transitively", (t) => {
  const root = fixture(t);
  for (const directory of [
    "packages/example/test",
    "docs/evidence/example",
    "docs/evidence/other",
    "docs/intake",
  ])
    mkdirSync(join(root, directory), { recursive: true });
  const write = (path, source) => writeFileSync(join(root, path), source);
  write(
    "packages/example/test/entry.test.ts",
    [
      'import "../../../docs/evidence/example/fixture.mjs";',
      'await import(pathToFileURL(join(process.cwd(), "docs/evidence/other/fixture.mjs")).href);',
      'const ignored = "docs/intake/private.mjs";',
    ].join("\n"),
  );
  write(
    "docs/evidence/example/fixture.mjs",
    'export * from "./factory.mjs";\n',
  );
  write(
    "docs/evidence/example/factory.mjs",
    [
      'import "./fixture.mjs";',
      'import { mkdtempSync as raw } from "node:fs";',
      'raw(join(tmpdir(), "dotln-imported-evidence-"));',
    ].join("\n"),
  );
  write(
    "docs/evidence/other/fixture.mjs",
    'fs.mkdtempSync("/tmp/other-evidence-");\n',
  );
  write(
    "docs/intake/private.mjs",
    'mkdtempSync(join(tmpdir(), "dotln-private-"));\n',
  );
  assert.deepEqual(unownedTemporaryRootSites(root), [
    { path: "docs/evidence/example/factory.mjs", line: 3 },
    { path: "docs/evidence/other/fixture.mjs", line: 1 },
  ]);
});

test("temporary declarations honor relocated documents and intake", (t) => {
  const root = fixture(t);
  writeFileSync(
    join(root, "dotln.config.json"),
    JSON.stringify({ version: 1, roots: { docs: "records" } }),
  );
  for (const directory of [
    "packages/example/test",
    "records/evidence",
    "records/intake",
  ])
    mkdirSync(join(root, directory), { recursive: true });
  writeFileSync(
    join(root, "packages/example/test/entry.test.ts"),
    [
      'await import(pathToFileURL(join(process.cwd(), "records/evidence/fixture.mjs")).href);',
      'const privateInput = "records/intake/private.mjs";',
    ].join("\n"),
  );
  for (const path of [
    "records/evidence/fixture.mjs",
    "records/intake/private.mjs",
  ])
    writeFileSync(
      join(root, path),
      'mkdtempSync(join(tmpdir(), "dotln-relocated-"));\n',
    );
  assert.deepEqual(unownedTemporaryRootSites(root), [
    { path: "records/evidence/fixture.mjs", line: 1 },
  ]);
});

test("prune and gate admission name each other under the host lock", async (t) => {
  const root = fixture(t),
    directory = join(root, ".runtime/host");
  runGit(root, ["init", "-q", "-b", "main"]);
  // A fresh process prepares this registry rather than reusing the native
  // reader cached for a previous fixture's registry.
  if (process.platform === "darwin")
    execFileSync(process.execPath, [
      "--input-type=module",
      "-e",
      `const {readHostSnapshot}=await import(${JSON.stringify(new URL("./lib/host-resources.mjs", import.meta.url).href)}); readHostSnapshot({footprint:false,directory:process.argv[1]});`,
      directory,
    ]);
  const gate = registerProcess(
    "lanes",
    process.pid,
    { worktree: root, task: "running-gate", slots: 1 },
    directory,
  );
  try {
    await assert.rejects(
      pruneHarness(root, {
        apply: true,
        scope: "repository",
        hostDirectory: directory,
      }),
      /Prune refused: running gate running-gate holds host lanes/,
    );
  } finally {
    gate.release();
  }
  let enter, release;
  const entered = new Promise((resolve) => {
    enter = resolve;
  });
  const barrier = new Promise((resolve) => {
    release = resolve;
  });
  const apply = pruneHarness(root, {
    apply: true,
    scope: "repository",
    hostDirectory: directory,
    beforeApply: async () => {
      enter();
      await barrier;
    },
  });
  await entered;
  const labels = [];
  const waiting = acquireHostLanes({
    directory,
    worktree: root,
    task: "host",
    waitHeartbeatMs: 10,
    onWait: (_, observation) => {
      labels.push(formatLaneWait("host", observation));
      release();
    },
  });
  await apply;
  const lane = await waiting;
  try {
    assert.ok(labels.some((label) => label.includes("harness prune")));
  } finally {
    await lane.release();
  }
});

// A closing worktree's harness directory, as release close meets it: session
// journals, states and sidecars, the gate index, suite-success and deadline
// records, beside the captures and markers that stay with the worktree.
function closingWorktree(root, name) {
  const worktree = join(root, name),
    harness = join(worktree, "docs/control/local/harness");
  mkdirSync(join(harness, "suite-success"), { recursive: true });
  mkdirSync(join(harness, "deadlines/gate-1"), { recursive: true });
  mkdirSync(join(harness, "runner/capture"), { recursive: true });
  const session = "a".repeat(64);
  for (const [path, text] of [
    [`${session}.jsonl`, '{"typedEvent":"HostPermissionDenied"}\n'],
    [`${session}.json`, '{"role":"executor"}\n'],
    [`${session}.subagents.json`, '{"count":1}\n'],
    ["writer-events.jsonl", '{"event":"released"}\n'],
    ["checks.json", '[{"checkId":"npm test","n":1}]\n'],
    ["suite-success/one", "ok\n"],
    ["deadlines/gate-1/active.json", "{}\n"],
    ["runner/capture/output.log", "captured\n"],
    [`${session}.subagents.started`, "started\n"],
    [`${session}.advisory`, "advisory\n"],
    ["writer.json", "{}\n"],
  ])
    writeFileSync(join(harness, path), text);
  symlinkSync(join(harness, "writer.json"), join(harness, "linked.jsonl"));
  return { worktree, harness, session };
}
// The prune judges a lane's owner as ended once its close process is gone.
function endedLane(lane, createdAt) {
  const record = readTemporaryOwner(lane);
  record.owner = {
    ...record.owner,
    pid: 2147483647,
    birth: "1.0",
    gateId: undefined,
    suite: undefined,
    session: undefined,
  };
  if (createdAt) record.createdAt = createdAt;
  writeTemporaryOwner(lane, record);
  return record;
}

test("a closed order's journals move into its retained lane and a retried close merges into it", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const { worktree, harness, session } = closingWorktree(root, "closing");
  const moved = retainWorktreeJournals(root, worktree, "WO-901");
  const lane = join(root, journalLane(root, "WO-901"));
  assert.equal(moved.lane, "docs/control/local/retained/WO-901/harness");
  assert.equal(moved.outcome, "moved");
  assert.equal(moved.files, 7);
  assert.equal(readTemporaryOwner(lane).class, "closed-journal");
  assert.equal(readTemporaryOwner(lane).owner.workOrder, "WO-901");
  assert.equal(readTemporaryOwner(lane).retentionHours, 720);
  assert.deepEqual(
    readdirSync(lane).sort(),
    [
      TEMPORARY_OWNER_FILE,
      `${session}.json`,
      `${session}.jsonl`,
      `${session}.subagents.json`,
      "checks.json",
      "deadlines",
      "sources.jsonl",
      "suite-success",
      "writer-events.jsonl",
    ].sort(),
  );
  // Captures, markers, the writer and every link stay with the worktree.
  assert.deepEqual(
    readdirSync(harness).sort(),
    [
      `${session}.advisory`,
      `${session}.subagents.started`,
      "deadlines",
      "linked.jsonl",
      "runner",
      "suite-success",
      "writer.json",
    ].sort(),
  );
  assert.equal(
    JSON.parse(readFileSync(join(lane, "sources.jsonl"), "utf8")).worktree,
    realpathSync(worktree),
  );
  // A retried close finds the lane and merges: a log gains its new rows, the
  // gate index takes the union, an identical record is dropped, and a newer
  // state keeps its earlier bytes beside it.
  const token = readTemporaryOwner(lane).token;
  writeFileSync(join(harness, `${session}.jsonl`), '{"row":2}\n');
  writeFileSync(join(harness, `${session}.json`), '{"role":"verifier"}\n');
  writeFileSync(
    join(harness, "checks.json"),
    '[{"checkId":"npm test","n":1},{"checkId":"npm test","n":2}]\n',
  );
  writeFileSync(join(harness, "suite-success/one"), "ok\n");
  writeFileSync(join(harness, `${"b".repeat(64)}.jsonl`), '{"row":1}\n');
  const retried = retainWorktreeJournals(root, worktree, "WO-901");
  assert.equal(retried.files, 5);
  assert.equal(readTemporaryOwner(lane).token, token);
  assert.equal(
    readFileSync(join(lane, `${session}.jsonl`), "utf8"),
    '{"typedEvent":"HostPermissionDenied"}\n{"row":2}\n',
  );
  assert.equal(
    readFileSync(join(lane, `${session}.json`), "utf8"),
    '{"role":"verifier"}\n',
  );
  const prior = readdirSync(lane).filter((name) => name.includes(".prior-"));
  assert.equal(prior.length, 1);
  assert.equal(
    readFileSync(join(lane, prior[0]), "utf8"),
    '{"role":"executor"}\n',
  );
  assert.deepEqual(JSON.parse(readFileSync(join(lane, "checks.json"))), [
    { checkId: "npm test", n: 1 },
    { checkId: "npm test", n: 2 },
  ]);
  assert.equal(existsSync(join(harness, "suite-success/one")), false);
  assert.equal(
    readFileSync(join(lane, "sources.jsonl"), "utf8").trim().split("\n").length,
    2,
  );
  // A preview moves nothing, and nothing left to move records nothing.
  writeFileSync(join(harness, `${"c".repeat(64)}.jsonl`), "{}\n");
  assert.equal(
    retainWorktreeJournals(root, worktree, "WO-901", { dryRun: true }).outcome,
    "would-move",
  );
  assert.ok(existsSync(join(harness, `${"c".repeat(64)}.jsonl`)));
  // A file the repository tracks is its content and stays where it is.
  writeFileSync(join(harness, "tracked.jsonl"), "{}\n");
  runGit(root, ["add", "-f", relative(root, join(harness, "tracked.jsonl"))]);
  assert.equal(retainWorktreeJournals(root, worktree, "WO-901").files, 1);
  assert.ok(existsSync(join(harness, "tracked.jsonl")));
  assert.equal(existsSync(join(lane, "tracked.jsonl")), false);
  assert.deepEqual(retainWorktreeJournals(root, join(root, "none"), "WO-904"), {
    lane: null,
    files: 0,
    bytes: 0,
    outcome: "nothing",
  });
});

test("a cross-volume journal move copies, and any other failure keeps the worktree's journals", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const exdev = (from, to) => {
    if (from.includes("/docs/control/local/harness/"))
      throw Object.assign(new Error("cross-device link"), { code: "EXDEV" });
    return renameSync(from, to);
  };
  const across = closingWorktree(root, "across");
  assert.equal(
    retainWorktreeJournals(root, across.worktree, "WO-905", { rename: exdev })
      .files,
    7,
  );
  const acrossLane = join(root, journalLane(root, "WO-905"));
  assert.equal(
    readFileSync(join(acrossLane, `${across.session}.jsonl`), "utf8"),
    '{"typedEvent":"HostPermissionDenied"}\n',
  );
  assert.equal(
    existsSync(join(across.harness, `${across.session}.jsonl`)),
    false,
  );
  for (const [label, rename, copyFile, code] of [
    [
      "a permission denial",
      () => {
        throw Object.assign(new Error("denied"), { code: "EACCES" });
      },
      undefined,
      "EACCES",
    ],
    [
      "a full disk during the cross-volume copy",
      exdev,
      () => {
        throw Object.assign(new Error("no space"), { code: "ENOSPC" });
      },
      "ENOSPC",
    ],
  ]) {
    const { worktree, harness, session } = closingWorktree(
      root,
      `failing-${code}`,
    );
    assert.throws(
      () =>
        retainWorktreeJournals(
          root,
          worktree,
          `WO-90${code === "EACCES" ? 6 : 7}`,
          {
            rename,
            ...(copyFile ? { copyFile } : {}),
          },
        ),
      new RegExp(
        `Journal retention stopped at .*: ${code}; the worktree is retained`,
      ),
      label,
    );
    // Nothing the worktree held is lost, since the first move already
    // failed, and no partial copy is left in the lane.
    for (const name of [`${session}.jsonl`, `${session}.json`, "checks.json"])
      assert.ok(existsSync(join(harness, name)), `${label}: ${name}`);
    const lane = join(
      root,
      journalLane(root, `WO-90${code === "EACCES" ? 6 : 7}`),
    );
    assert.deepEqual(
      readdirSync(lane).filter((name) => name.includes(".partial-")),
      [],
    );
  }
});

test("the prune judges a closed order's journal lane by its class window and keeps its parent lane", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const lanes = {};
  for (const [order, createdAt] of [
    ["WO-911", "2020-01-01T00:00:00.000Z"],
    ["WO-912", null],
    ["WO-913", "2020-01-01T00:00:00.000Z"],
  ]) {
    retainWorktreeJournals(root, closingWorktree(root, order).worktree, order);
    lanes[order] = join(root, journalLane(root, order));
    endedLane(lanes[order], createdAt);
  }
  // The undeclared-entry refusal holds the third lane until it is judged
  // under a null window below.
  writeFileSync(join(lanes["WO-913"], "notes.txt"), "operator note\n");
  // Every order here has a published release, so only a lane's own owned
  // root can keep it.
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
    publishedRelease: () => "v9.9.9",
  };
  const report = await pruneHarness(root, { ...options, apply: true });
  const row = (order) =>
    [...report.removed, ...report.retained].find(
      (entry) => entry.path === `docs/control/local/retained/${order}/harness`,
    );
  assert.equal(row("WO-911").class, "closed-journal");
  assert.ok(report.removed.includes(row("WO-911")));
  assert.equal(existsSync(lanes["WO-911"]), false);
  assert.equal(row("WO-912").reason, "retention window has not passed");
  assert.equal(row("WO-912").class, "closed-journal");
  assert.ok(existsSync(lanes["WO-912"]));
  assert.match(
    row("WO-913").reason,
    /closed-journal root holds an entry its class does not declare: notes\.txt/,
  );
  assert.ok(
    report.census.some(
      (entry) =>
        entry.kind === "temporary-root" &&
        entry.class === "closed-journal" &&
        entry.candidates === 1 &&
        entry.retained === 2,
    ),
  );
  // The order's lane keeps its owned journal root's window, whatever else
  // would let the lane go, and follows once that root is gone: the temporary
  // roots are judged first, so in the same prune.
  for (const order of ["WO-912", "WO-913"])
    assert.equal(
      report.retained.find(
        (entry) => entry.path === `docs/control/local/retained/${order}`,
      ).reason,
      "nested owned root retained: harness",
    );
  assert.ok(
    report.removed.some(
      (entry) =>
        entry.kind === "retained-lane" &&
        entry.path === "docs/control/local/retained/WO-911",
    ),
  );
  assert.equal(
    existsSync(join(root, "docs/control/local/retained/WO-911")),
    false,
  );
  const after = await pruneHarness(root, { ...options, apply: true });
  assert.ok(!after.removed.some((entry) => entry.kind === "retained-lane"));
  assert.ok(existsSync(lanes["WO-912"]));
  // A null window keeps an expired lane indefinitely.
  removeDirectory(join(lanes["WO-913"], "notes.txt"));
  mkdirSync(join(root, "docs/control"), { recursive: true });
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify({ retention: { "closed-journal": null } }),
  );
  assert.equal(
    judgeTemporaryRoot(root, lanes["WO-913"], {}, { processes: [] }).retained
      .reason,
    "class is retained indefinitely",
  );
});

// A record written before a reboot carries the device number its volume had
// then; only the marker is rewritten, so the directory keeps its inode.
function renumber(path) {
  const record = readTemporaryOwner(path);
  writeFileSync(
    join(path, TEMPORARY_OWNER_FILE),
    JSON.stringify({ ...record, device: record.device + 1 }) + "\n",
  );
  return record;
}
const ledgerRows = (root, token) =>
  temporaryLedger(root).filter((row) => row.token === token);

test("a renumbered device is re-stamped and judged by its class and window like any root", (t) => {
  const root = fixture(t),
    path = expired(root, "renumbered-"),
    { device, inode, token } = renumber(path);
  const started = performance.now();
  const judged = judgeTemporaryRoot(root, path, {}, { processes: [] });
  const restampMs = performance.now() - started;
  assert.ok(judged.candidate, JSON.stringify(judged));
  const restamped = JSON.parse(
    readFileSync(join(path, TEMPORARY_OWNER_FILE), "utf8"),
  );
  assert.equal(restamped.device, device);
  assert.equal(restamped.inode, inode);
  assert.deepEqual(
    ledgerRows(root, token)
      .filter((row) => row.action === "device-renumbered")
      .map(({ recordedDevice, observedDevice }) => ({
        recordedDevice,
        observedDevice,
      })),
    [{ recordedDevice: device + 1, observedDevice: device }],
  );
  // A retried judgment finds the record current and writes nothing more.
  assert.ok(judgeTemporaryRoot(root, path, {}, { processes: [] }).candidate);
  assert.equal(
    ledgerRows(root, token).filter((row) => row.action === "device-renumbered")
      .length,
    1,
  );
  applyTemporaryCandidate(root, judged.candidate);
  assert.equal(existsSync(path), false);
  t.diagnostic(`renumbered judgment with re-stamp ${restampMs.toFixed(1)} ms`);
});

test("a renumbered device never admits a replaced, foreign, live, protected or undeclared root", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const judge = (path, context = {}) =>
    judgeTemporaryRoot(root, path, {}, { processes: [], ...context });
  // Each refusal is read with the whole judgment in view, so a case that
  // admitted its root fails naming what it judged.
  const refused = (path, context) => {
    const judgment = judge(path, context);
    assert.ok(judgment?.retained, JSON.stringify(judgment));
    return judgment.retained.reason;
  };
  const replace = (path) => {
    const marker = readFileSync(join(path, TEMPORARY_OWNER_FILE));
    renameSync(path, `${path}.original`);
    mkdirSync(path);
    writeFileSync(join(path, TEMPORARY_OWNER_FILE), marker);
  };
  // A different inode is a real replacement, device change or not.
  const replaced = expired(root, "replaced-");
  renumber(replaced);
  replace(replaced);
  assert.match(refused(replaced), /invalid or the directory was replaced/);
  // A token the ledger does not register at this path.
  const forged = expired(root, "forged-");
  const forgedRecord = renumber(forged);
  writeFileSync(
    join(forged, TEMPORARY_OWNER_FILE),
    JSON.stringify({
      ...forgedRecord,
      device: forgedRecord.device + 1,
      token: randomUUID(),
    }) + "\n",
  );
  assert.match(
    refused(forged),
    /ledger does not register this token at this path/,
  );
  // With an unchanged device too, a marker the ledger does not register at
  // this path is not the root that was created.
  const unbound = expired(root, "unbound-");
  writeFileSync(
    join(unbound, TEMPORARY_OWNER_FILE),
    JSON.stringify({ ...readTemporaryOwner(unbound), token: randomUUID() }) +
      "\n",
  );
  assert.match(
    refused(unbound),
    /owner's ledger does not register this root's token at this path/,
  );
  // A record naming a repository that holds no registration of it, with or
  // without a device change.
  const elsewhere = join(root, "elsewhere");
  mkdirSync(elsewhere);
  const claimed = expired(root, "claimed-");
  writeFileSync(
    join(claimed, TEMPORARY_OWNER_FILE),
    JSON.stringify({
      ...readTemporaryOwner(claimed),
      owner: { ...readTemporaryOwner(claimed).owner, repository: elsewhere },
    }) + "\n",
  );
  assert.match(
    refused(claimed),
    /owner's ledger does not register this root's token at this path/,
  );
  const foreign = expired(root, "foreign-");
  const foreignRecord = renumber(foreign);
  writeFileSync(
    join(foreign, TEMPORARY_OWNER_FILE),
    JSON.stringify({
      ...foreignRecord,
      device: foreignRecord.device + 1,
      owner: { ...foreignRecord.owner, repository: elsewhere },
    }) + "\n",
  );
  assert.match(
    refused(foreign),
    /ledger does not register this token at this path/,
  );
  // Live and unknown owners keep their roots after the re-stamp.
  const live = expired(root, "live-", {
    owner: { pid: process.pid, birth: "live" },
  });
  renumber(live);
  assert.equal(
    refused(live, { processes: [{ pid: process.pid, birth: "live" }] }),
    "owner is live",
  );
  const unknown = expired(root, "unknown-", { owner: { pid: null } });
  renumber(unknown);
  assert.equal(refused(unknown), "owner identity is unavailable");
  // A writer reserving the checkout protects every root within it.
  const reserved = expired(root, "reserved-");
  renumber(reserved);
  const session = "renumbered-writer";
  seedHarnessWriter(root, {
    worktree: root,
    actorId: createHash("sha256").update(session).digest("hex"),
    reservedAt: new Date().toISOString(),
    owner: { pid: process.pid, source: "parent" },
  });
  try {
    assert.match(
      refused(reserved, { worktrees: [{ worktree: root }] }),
      /writer reservation/,
    );
  } finally {
    releaseHarnessWriter(root, {
      cwd: root,
      session_id: session,
      hook_event_name: "Stop",
    });
  }
  // A replacement between the judgment and the removal is refused at apply.
  const raced = expired(root, "raced-");
  renumber(raced);
  const plan = judge(raced);
  assert.ok(plan.candidate);
  replace(raced);
  assert.throws(
    () => applyTemporaryCandidate(root, plan.candidate),
    /identity changed|replaced|ownership changed/,
  );
  // A replacement as late as the act itself, after the identity was read:
  // the act moves whatever holds the path aside, finds another directory or a
  // link there, puts it back and deletes nothing.
  const late = expired(root, "late-");
  renumber(late);
  const lateRecord = readTemporaryOwner(late);
  replace(late);
  assert.throws(
    () => removeVerifiedTemporaryRoot(late, lateRecord),
    /ownership changed/,
  );
  const lateLink = expired(root, "late-link-");
  renumber(lateLink);
  const lateLinkRecord = readTemporaryOwner(lateLink);
  // A registered root nested in it, reachable through the link, is not
  // touched either.
  const lateChild = expired(root, `${basename(lateLink)}/child-`);
  writeFileSync(join(lateChild, "sentinel"), "kept\n");
  renameSync(lateLink, `${lateLink}.original`);
  symlinkSync(`${lateLink}.original`, lateLink);
  assert.throws(
    () => removeVerifiedTemporaryRoot(lateLink, lateLinkRecord),
    /ownership changed/,
  );
  assert.ok(lstatSync(lateLink).isSymbolicLink());
  assert.ok(
    existsSync(join(`${lateLink}.original`, basename(lateChild), "sentinel")),
  );
  for (const [path, record] of [
    [late, lateRecord],
    [lateLink, lateLinkRecord],
  ]) {
    assert.ok(existsSync(join(path, TEMPORARY_OWNER_FILE)), path);
    assert.ok(existsSync(join(`${path}.original`, TEMPORARY_OWNER_FILE)), path);
    assert.equal(existsSync(temporaryRemovalAside(path, record.token)), false);
  }
  // A parent moved under its aside name anywhere but its own aside binds none
  // of the roots nested in it, and nothing in it is deleted.
  const misplaced = expired(root, "misplaced-");
  const misplacedToken = readTemporaryOwner(misplaced).token;
  const misplacedChild = expired(root, `${basename(misplaced)}/child-`);
  writeFileSync(join(misplacedChild, "sentinel"), "kept\n");
  const misplacedPlace = join(root, "roots", "misplaced-place");
  mkdirSync(misplacedPlace);
  const misplacedAt = join(misplacedPlace, `dotln-removing-${misplacedToken}`);
  renameSync(misplaced, misplacedAt);
  assert.match(
    refused(join(misplacedAt, basename(misplacedChild))),
    /ledger does not register/,
  );
  assert.ok(
    existsSync(join(misplacedAt, basename(misplacedChild), "sentinel")),
  );
  // A link to a root is not that root.
  const linked = expired(root, "linked-");
  renumber(linked);
  const link = join(root, "roots", "link-to-linked");
  symlinkSync(linked, link);
  assert.match(refused(link), /symbolic-link/);
  // A closed-journal root holding an entry its class does not declare.
  retainWorktreeJournals(
    root,
    closingWorktree(root, "undeclared").worktree,
    "WO-921",
  );
  const lane = join(root, journalLane(root, "WO-921"));
  endedLane(lane, "2020-01-01T00:00:00.000Z");
  renumber(lane);
  writeFileSync(join(lane, "notes.txt"), "operator note\n");
  assert.match(refused(lane), /does not declare: notes\.txt/);
  // Nothing was deleted, and a retried judgment says the same.
  for (const path of [
    replaced,
    `${replaced}.original`,
    forged,
    unbound,
    claimed,
    foreign,
    live,
    unknown,
    reserved,
    raced,
    `${raced}.original`,
    linked,
    lane,
  ])
    assert.ok(existsSync(path), path);
  assert.match(refused(forged), /ledger does not register/);
  assert.ok(lstatSync(link).isSymbolicLink());
});

test("a retried merge counts a log once, and a lane's links never take a write outside it", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const session = "f".repeat(64);
  const worktree = (name, rows) => {
    const directory = join(root, name, "docs/control/local/harness");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, `${session}.jsonl`), rows);
    return { worktree: join(root, name), directory };
  };
  retainWorktreeJournals(root, worktree("first", "A\n").worktree, "WO-931");
  const lane = join(root, journalLane(root, "WO-931"));
  // The merge publishes its rows, then cannot remove the source: the retry
  // finds them already appended and only removes the source.
  const second = worktree("second", "B\n");
  chmodSync(second.directory, 0o500);
  try {
    assert.throws(
      () => retainWorktreeJournals(root, second.worktree, "WO-931"),
      /Journal retention stopped at .*: EACCES/,
    );
  } finally {
    chmodSync(second.directory, 0o700);
  }
  assert.equal(readFileSync(join(lane, `${session}.jsonl`), "utf8"), "A\nB\n");
  // The surviving source gained a row before the retry: only that row is new.
  writeFileSync(join(second.directory, `${session}.jsonl`), "B\nC\n");
  retainWorktreeJournals(root, second.worktree, "WO-931");
  assert.equal(
    readFileSync(join(lane, `${session}.jsonl`), "utf8"),
    "A\nB\nC\n",
  );
  assert.equal(existsSync(join(second.directory, `${session}.jsonl`)), false);
  // A source whose leading rows repeat is merged once: its earlier attempt's
  // merge record says how much of it the lane already holds.
  retainWorktreeJournals(root, worktree("base", "A\n").worktree, "WO-933");
  const repeatedLane = join(root, journalLane(root, "WO-933"));
  const repeated = worktree("repeated", "B\nB\n");
  chmodSync(repeated.directory, 0o500);
  try {
    assert.throws(
      () => retainWorktreeJournals(root, repeated.worktree, "WO-933"),
      /Journal retention stopped at .*: EACCES/,
    );
  } finally {
    chmodSync(repeated.directory, 0o700);
  }
  assert.equal(
    readFileSync(join(repeatedLane, `${session}.jsonl`), "utf8"),
    "A\nB\nB\n",
  );
  writeFileSync(join(repeated.directory, `${session}.jsonl`), "B\nB\nC\n");
  retainWorktreeJournals(root, repeated.worktree, "WO-933");
  assert.equal(
    readFileSync(join(repeatedLane, `${session}.jsonl`), "utf8"),
    "A\nB\nB\nC\n",
  );
  // Another worktree's append between two attempts of one source does not
  // make the retry append that source's rows again.
  retainWorktreeJournals(
    root,
    worktree("first-of-three", "A\n").worktree,
    "WO-934",
  );
  const between = join(root, journalLane(root, "WO-934"));
  const interrupted = worktree("interrupted", "B\n");
  chmodSync(interrupted.directory, 0o500);
  try {
    assert.throws(
      () => retainWorktreeJournals(root, interrupted.worktree, "WO-934"),
      /Journal retention stopped at .*: EACCES/,
    );
  } finally {
    chmodSync(interrupted.directory, 0o700);
  }
  retainWorktreeJournals(
    root,
    worktree("in-between", "D\n").worktree,
    "WO-934",
  );
  retainWorktreeJournals(root, interrupted.worktree, "WO-934");
  assert.equal(
    readFileSync(join(between, `${session}.jsonl`), "utf8"),
    "A\nB\nD\n",
  );
  // A first merge from another source keeps every row, even one that repeats
  // the log's last.
  retainWorktreeJournals(
    root,
    worktree("repeating", "D\nE\n").worktree,
    "WO-934",
  );
  assert.equal(
    readFileSync(join(between, `${session}.jsonl`), "utf8"),
    "A\nB\nD\nD\nE\n",
  );
  // A log from another source whose bytes equal the lane's is still appended.
  retainWorktreeJournals(root, worktree("alpha", "X\n").worktree, "WO-935");
  const equal = join(root, journalLane(root, "WO-935"));
  retainWorktreeJournals(root, worktree("beta", "X\n").worktree, "WO-935");
  assert.equal(readFileSync(join(equal, `${session}.jsonl`), "utf8"), "X\nX\n");
  // An attempt that never published is not proven by another worktree's
  // later append of the same bytes at its place.
  const sha = (text) => createHash("sha256").update(text).digest("hex");
  const unpublished = worktree("unpublished", "Y\n");
  writeFileSync(
    join(equal, "merges.jsonl"),
    JSON.stringify({
      worktree: realpathSync(unpublished.worktree),
      log: `${session}.jsonl`,
      offset: 4,
      length: 2,
      span: sha("Y\n"),
      through: 2,
      source: sha("Y\n"),
    }) + "\n",
    { flag: "a" },
  );
  // The source that published there cannot remove its own log; after the
  // unpublished one appends its rows, its retry still trusts its own record,
  // which the earlier unpublished intent does not disprove.
  const sameBytes = worktree("same-bytes", "Y\n");
  chmodSync(sameBytes.directory, 0o500);
  try {
    assert.throws(
      () => retainWorktreeJournals(root, sameBytes.worktree, "WO-935"),
      /Journal retention stopped at .*: EACCES/,
    );
  } finally {
    chmodSync(sameBytes.directory, 0o700);
  }
  retainWorktreeJournals(root, unpublished.worktree, "WO-935");
  retainWorktreeJournals(root, sameBytes.worktree, "WO-935");
  assert.equal(
    readFileSync(join(equal, `${session}.jsonl`), "utf8"),
    "X\nX\nY\nY\n",
  );
  // A torn last record does not swallow the next one: the retry after a
  // failed source removal still reads it and appends nothing again.
  writeFileSync(join(equal, "merges.jsonl"), '{"torn":', { flag: "a" });
  const afterTorn = worktree("after-torn", "Z\n");
  chmodSync(afterTorn.directory, 0o500);
  try {
    assert.throws(
      () => retainWorktreeJournals(root, afterTorn.worktree, "WO-935"),
      /Journal retention stopped at .*: EACCES/,
    );
  } finally {
    chmodSync(afterTorn.directory, 0o700);
  }
  retainWorktreeJournals(root, afterTorn.worktree, "WO-935");
  assert.equal(
    readFileSync(join(equal, `${session}.jsonl`), "utf8"),
    "X\nX\nY\nY\nZ\n",
  );
  // A link planted in a lane refuses the move and writes nothing past it.
  const outside = join(root, "outside");
  mkdirSync(outside);
  const linkedLane = join(root, journalLane(root, "WO-932"));
  retainWorktreeJournals(root, worktree("third", "C\n").worktree, "WO-932");
  symlinkSync(outside, join(linkedLane, "suite-success"));
  const fourth = worktree("fourth", "D\n");
  mkdirSync(join(fourth.directory, "suite-success"));
  writeFileSync(join(fourth.directory, "suite-success/marker"), "ok\n");
  assert.throws(
    () => retainWorktreeJournals(root, fourth.worktree, "WO-932"),
    /refuses a symlink/,
  );
  assert.throws(
    () =>
      retainWorktreeJournals(root, fourth.worktree, "WO-932", { dryRun: true }),
    /refuses a symlink/,
  );
  removeDirectory(join(linkedLane, "suite-success"));
  removeDirectory(join(linkedLane, "sources.jsonl"));
  symlinkSync(
    join(outside, "sources.jsonl"),
    join(linkedLane, "sources.jsonl"),
  );
  assert.throws(
    () => retainWorktreeJournals(root, fourth.worktree, "WO-932"),
    /refuses a symlink/,
  );
  removeDirectory(join(linkedLane, "sources.jsonl"));
  assert.deepEqual(readdirSync(outside), []);
  assert.ok(existsSync(join(fourth.directory, "suite-success/marker")));
});

test("a device transition is ledgered before the marker changes, and once", (t) => {
  const root = fixture(t),
    path = expired(root, "ledger-first-"),
    { device, token } = renumber(path);
  const segment = join(
    root,
    ".runtime/temporary-roots/roots",
    `${token}.jsonl`,
  );
  chmodSync(segment, 0o400);
  try {
    assert.match(
      judgeTemporaryRoot(root, path, {}, { processes: [] }).retained.reason,
      /EACCES|permission denied/i,
    );
  } finally {
    chmodSync(segment, 0o600);
  }
  // The failed append left the old number in place for the next read.
  assert.equal(
    JSON.parse(readFileSync(join(path, TEMPORARY_OWNER_FILE), "utf8")).device,
    device + 1,
  );
  assert.ok(judgeTemporaryRoot(root, path, {}, { processes: [] }).candidate);
  assert.equal(
    ledgerRows(root, token).filter((row) => row.action === "device-renumbered")
      .length,
    1,
  );
  // Later reboots that renumber the volume again, even back to a pair seen
  // before, are each recorded.
  for (const stale of [device + 2, device + 1]) {
    const record = readTemporaryOwner(path);
    writeFileSync(
      join(path, TEMPORARY_OWNER_FILE),
      JSON.stringify({ ...record, device: stale }) + "\n",
    );
    readTemporaryOwner(path);
  }
  assert.deepEqual(
    ledgerRows(root, token)
      .filter((row) => row.action === "device-renumbered")
      .map((row) => row.recordedDevice),
    [device + 1, device + 2, device + 1],
  );
});

test("plan start's apply names what it removed when it stops partway", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  // The shorter path is judged and removed first, as parents come before
  // what is nested in them; the second cannot be, since its parent refuses
  // the removal.
  const removable = expired(root, "a-");
  mkdirSync(join(root, "roots", "locked"));
  const blocked = expired(root, "locked/b-with-a-much-longer-name-");
  chmodSync(join(root, "roots", "locked"), 0o500);
  let report;
  try {
    report = await temporaryPruneSummary(root, {
      apply: true,
      scope: "repository",
      hostDirectory: join(root, ".runtime/host"),
      processes: [],
      openPaths: [],
    });
  } finally {
    chmodSync(join(root, "roots", "locked"), 0o700);
  }
  assert.match(report, /^Prune: apply stopped after 1 removed, \d+ bytes \(/);
  assert.match(report, /what remains:\nPrune: \d+ candidates/);
  assert.equal(existsSync(removable), false);
  // The refused root keeps its contents and its owner record: a parent that
  // refuses the removal refuses it before anything inside is deleted.
  assert.ok(existsSync(join(blocked, TEMPORARY_OWNER_FILE)));
  assert.equal(readTemporaryOwner(blocked).class, "gate-fixture");
});

test("a removal stopped after it moved its root aside is found there and finished", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  };
  const path = expired(root, "stopped-");
  const { token } = readTemporaryOwner(path);
  const aside = temporaryRemovalAside(path, token);
  // The stop: the act moved the root aside and its deletion never ran.
  renameSync(path, aside);
  const census = await pruneHarness(root, options);
  assert.deepEqual(
    census.candidates.map((row) => row.path),
    [relative(root, aside)],
  );
  const applied = await pruneHarness(root, { ...options, apply: true });
  assert.equal(applied.removed.length, 1);
  assert.equal(existsSync(aside), false);
  assert.equal(existsSync(path), false);
  // A path reused by a new root does not hide the earlier root left aside.
  const reused = expired(root, "reused-");
  const reusedToken = readTemporaryOwner(reused).token;
  const reusedAside = temporaryRemovalAside(reused, reusedToken);
  renameSync(reused, reusedAside);
  ensureTemporaryRoot(reused, { class: "gate-fixture", repository: root });
  const again = await pruneHarness(root, { ...options, apply: true });
  assert.ok(
    again.removed.some((row) => row.path === relative(root, reusedAside)),
    JSON.stringify(again.removed),
  );
  assert.equal(existsSync(reusedAside), false);
  assert.notEqual(readTemporaryOwner(reused).token, reusedToken);
  // Finishing the aside ends the earlier registration; the new root keeps
  // its own.
  assert.equal(
    registeredTemporaryRoots(root).some((row) => row.token === reusedToken),
    false,
  );
  assert.equal(
    existsSync(
      join(root, ".runtime/temporary-roots/roots", `${reusedToken}.jsonl`),
    ),
    false,
  );
  // A captured root of a checkout that is gone, left aside by a stopped
  // removal, is still found by a close.
  const checkout = join(root, "closed-checkout");
  mkdirSync(checkout);
  const captured = expired(root, "captured-", { repository: checkout });
  const capturedRecord = readTemporaryOwner(captured);
  const capturedAside = temporaryRemovalAside(captured, capturedRecord.token);
  renameSync(captured, capturedAside);
  removeDirectory(checkout, { recursive: true });
  assert.ok(
    temporaryPrunePaths(root, {
      scope: "close",
      ownedTemporaryRoots: [
        {
          path: captured,
          token: capturedRecord.token,
          repository: capturedRecord.owner.repository,
        },
      ],
    }).includes(capturedAside),
  );
  // A parent whose removal moved it aside and stopped is found there with
  // the roots nested in it, which its registration binds; their segments
  // wait for it.
  const nest = expired(root, "nest-");
  const nestToken = readTemporaryOwner(nest).token;
  const nestChild = expired(root, `${basename(nest)}/child-`);
  const nestChildSegment = join(
    root,
    ".runtime/temporary-roots/roots",
    `${readTemporaryOwner(nestChild).token}.jsonl`,
  );
  const nestAside = temporaryRemovalAside(nest, nestToken);
  writeFileSync(
    join(root, ".runtime/temporary-roots/roots", `${nestToken}.jsonl`),
    JSON.stringify({
      action: "moving",
      path: nest,
      token: nestToken,
      aside: nestAside,
    }) + "\n",
    { flag: "a" },
  );
  renameSync(nest, nestAside);
  // The parent's path is reused, with a directory at the child's place.
  const reusedChild = join(nest, basename(nestChild));
  mkdirSync(reusedChild, { recursive: true });
  retireTemporaryLedger(root);
  assert.ok(existsSync(nestChildSegment));
  const nested = await pruneHarness(root, { ...options, apply: true });
  assert.ok(
    nested.removed.some((row) => row.path === relative(root, nestAside)),
    JSON.stringify(nested),
  );
  assert.equal(existsSync(nestAside), false);
  assert.ok(existsSync(reusedChild));
  // An aside whose parent refuses the removal keeps everything it holds.
  mkdirSync(join(root, "roots", "refusing"));
  const refusing = expired(root, "refusing/r-");
  const refusingToken = readTemporaryOwner(refusing).token;
  const refusingAside = temporaryRemovalAside(refusing, refusingToken);
  renameSync(refusing, refusingAside);
  chmodSync(join(root, "roots", "refusing"), 0o500);
  try {
    assert.throws(
      () => removeTemporaryRoot(refusingAside, refusingToken),
      /EACCES|EPERM/,
    );
  } finally {
    chmodSync(join(root, "roots", "refusing"), 0o700);
  }
  assert.ok(existsSync(join(refusingAside, TEMPORARY_OWNER_FILE)));
  // Owned roots nested inside go with their verified parent.
  const parent = expired(root, "parent-");
  const child = createTemporaryRoot(join(parent, "child-"), {
    class: "gate-fixture",
    repository: root,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      gateId: undefined,
      suite: undefined,
    },
  });
  const childSegment = join(
    root,
    ".runtime/temporary-roots/roots",
    `${readTemporaryOwner(child).token}.jsonl`,
  );
  assert.ok(existsSync(childSegment));
  removeTemporaryRoot(parent);
  assert.equal(existsSync(parent), false);
  // The child went with its verified parent; retirement then ends its
  // segment.
  retireTemporaryLedger(root);
  assert.equal(existsSync(childSegment), false);
  // A session's scratch left aside beside its place is walked by the census
  // even when no ledger registers it.
  const base = join(root, "system-temporary");
  const session = join(base, "dotln", "a".repeat(64));
  const sessionAside = join(session, `dotln-removing-${randomUUID()}`);
  mkdirSync(sessionAside, { recursive: true });
  assert.ok(
    temporaryPrunePaths(root, {
      scope: "all",
      temporaryBases: [base],
    }).includes(sessionAside),
  );
  // A directory held aside that is not the root, as when a replacement could
  // not be moved back, is retained with its contents.
  const held = expired(root, "held-");
  const heldRecord = readTemporaryOwner(held);
  const heldAside = temporaryRemovalAside(held, heldRecord.token);
  renameSync(held, `${held}.original`);
  mkdirSync(heldAside);
  writeFileSync(
    join(heldAside, TEMPORARY_OWNER_FILE),
    readFileSync(join(`${held}.original`, TEMPORARY_OWNER_FILE)),
  );
  const retained = await pruneHarness(root, { ...options, apply: true });
  assert.match(
    retained.retained.find((row) => row.path === relative(root, heldAside))
      ?.reason ?? "",
    /invalid or the directory was replaced/,
  );
  assert.ok(existsSync(join(heldAside, TEMPORARY_OWNER_FILE)));
  assert.ok(existsSync(join(`${held}.original`, TEMPORARY_OWNER_FILE)));
});

// A root's ledger segment, in its owner repository.
const segmentOf = (repository, token) =>
  join(repository, ".runtime/temporary-roots/roots", `${token}.jsonl`);
// A removal that stopped right after moving its root aside: the move is in the
// owner's ledger and the rename happened, and nothing more. The ledger row
// names the path the removal was given, as the stop recorded it before
// removals ledgered a relocated root under its registration.
const stopAfterMove = (path, record) => {
  const aside = temporaryRemovalAside(path, record.token);
  writeFileSync(
    segmentOf(record.owner.repository, record.token),
    JSON.stringify({ action: "moving", path, token: record.token, aside }) +
      "\n",
    { flag: "a" },
  );
  renameSync(path, aside);
  return aside;
};
const pruneOptions = (root) => ({
  scope: "repository",
  temporaryBases: [join(root, "roots")],
  hostDirectory: join(root, ".runtime/host"),
  processes: [],
  openPaths: [],
  holders: [],
  sessionId: "recovery-fixture-prune",
});

test("a renumbered root whose owner repository is gone is proven by its marker and removed by prune apply", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const checkout = join(root, "closed-checkout");
  mkdirSync(checkout);
  const orphan = expired(root, "dotln-orphan-", { repository: checkout });
  const replaced = expired(root, "dotln-replaced-", { repository: checkout });
  writeFileSync(join(orphan, "payload"), "regenerable\n");
  // The closed checkout goes with its ledger, as a release close removes it.
  removeDirectory(checkout, { recursive: true });
  // The reboot: the volume's device number changes; the directory, its inode
  // and the token in its marker do not.
  const { device, inode, token } = renumber(orphan);
  // A directory that took a root's place carries a copy of its marker and
  // another inode; it is refused whatever its device says.
  const copied = readFileSync(join(replaced, TEMPORARY_OWNER_FILE), "utf8");
  removeDirectory(replaced, { recursive: true });
  mkdirSync(replaced);
  writeFileSync(join(replaced, "payload"), "retained\n");
  writeFileSync(
    join(replaced, TEMPORARY_OWNER_FILE),
    JSON.stringify({ ...JSON.parse(copied), device: device + 1 }) + "\n",
  );
  const options = pruneOptions(root);
  const census = await pruneHarness(root, options);
  assert.ok(
    census.candidates.some((row) => row.path === relative(root, orphan)),
    JSON.stringify(census),
  );
  const restamped = JSON.parse(
    readFileSync(join(orphan, TEMPORARY_OWNER_FILE), "utf8"),
  );
  assert.equal(restamped.device, device);
  assert.equal(restamped.inode, inode);
  assert.equal(restamped.token, token);
  assert.match(
    census.retained.find((row) => row.path === relative(root, replaced))
      ?.reason ?? "",
    /invalid or the directory was replaced/,
  );
  const applied = await pruneHarness(root, { ...options, apply: true });
  assert.ok(
    applied.removed.some((row) => row.path === relative(root, orphan)),
    JSON.stringify(applied),
  );
  assert.equal(existsSync(orphan), false);
  assert.equal(readFileSync(join(replaced, "payload"), "utf8"), "retained\n");
  removeDirectory(replaced, { recursive: true });
});

test("a child whose own removal stopped inside its parent's aside stays bound and held until a prune finishes both", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const parent = expired(root, "parent-");
  const parentRecord = readTemporaryOwner(parent);
  const child = expired(root, `${basename(parent)}/child-`);
  const childRecord = readTemporaryOwner(child);
  writeFileSync(join(child, "payload"), "retained\n");
  // Two stops: the parent's removal moved it aside, then the child's own
  // removal, given the place the child was found, moved it aside in there.
  const parentAside = stopAfterMove(parent, parentRecord);
  const childAside = stopAfterMove(
    join(parentAside, basename(child)),
    childRecord,
  );
  assert.equal(
    temporaryLedgerContradiction(childAside, readTemporaryOwner(childAside)),
    null,
  );
  retireTemporaryLedger(root);
  assert.ok(existsSync(segmentOf(root, childRecord.token)));
  assert.equal(readFileSync(join(childAside, "payload"), "utf8"), "retained\n");
  const applied = await pruneHarness(root, {
    ...pruneOptions(root),
    apply: true,
  });
  assert.ok(
    applied.removed.some((row) => row.path === relative(root, parentAside)),
    JSON.stringify(applied),
  );
  assert.equal(existsSync(parentAside), false);
  retireTemporaryLedger(root);
  assert.equal(existsSync(segmentOf(root, childRecord.token)), false);
});

test("a child finished from its parent's aside ends its own registration", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const parent = expired(root, "parent-");
  const parentRecord = readTemporaryOwner(parent);
  writeFileSync(join(parent, "payload"), "retained\n");
  const child = expired(root, `${basename(parent)}/child-`);
  const childRecord = readTemporaryOwner(child);
  const parentAside = stopAfterMove(parent, parentRecord);
  removeTemporaryRoot(join(parentAside, basename(child)), childRecord.token);
  // The removal is recorded under the child's registration, so the
  // registration ends and its segment leaves with it.
  assert.equal(
    registeredTemporaryRoots(root).some(
      (row) => row.token === childRecord.token,
    ),
    false,
  );
  assert.equal(existsSync(segmentOf(root, childRecord.token)), false);
  assert.equal(
    readFileSync(join(parentAside, "payload"), "utf8"),
    "retained\n",
  );
  assert.ok(
    registeredTemporaryRoots(root).some(
      (row) => row.token === parentRecord.token && row.path === parentAside,
    ),
  );
});

test("an empty unmarked aside a stopped removal left is removed, and a non-empty one keeps its payload", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const judge = (path) =>
    judgeTemporaryRoot(
      root,
      path,
      {},
      { processes: [], holders: [], worktrees: [], openPaths: [] },
    );
  // The stop between deleting the owner record and the directory.
  const remains = expired(root, "remains-");
  const remainsRecord = readTemporaryOwner(remains);
  const remainsAside = stopAfterMove(remains, remainsRecord);
  removeDirectory(join(remainsAside, TEMPORARY_OWNER_FILE));
  // An unmarked aside that still holds something is not those remains.
  const kept = expired(root, "kept-");
  const keptAside = stopAfterMove(kept, readTemporaryOwner(kept));
  writeFileSync(join(keptAside, "payload"), "retained\n");
  removeDirectory(join(keptAside, TEMPORARY_OWNER_FILE));
  assert.equal(judge(remainsAside)?.candidate?.kind, "removal-remains");
  assert.match(judge(keptAside)?.retained?.reason ?? "", /unmarked root/);
  const applied = await pruneHarness(root, {
    ...pruneOptions(root),
    apply: true,
  });
  assert.ok(
    applied.removed.some((row) => row.path === relative(root, remainsAside)),
    JSON.stringify(applied),
  );
  assert.equal(existsSync(remainsAside), false);
  assert.equal(
    registeredTemporaryRoots(root).some(
      (row) => row.token === remainsRecord.token,
    ),
    false,
  );
  assert.equal(readFileSync(join(keptAside, "payload"), "utf8"), "retained\n");
  removeDirectory(keptAside, { recursive: true });
});

test("a nested registration in another repository's ledger waits while its parent sits aside", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const other = join(root, "other-owner");
  mkdirSync(other);
  runGit(other, ["init", "-q", "-b", "main"]);
  const parent = expired(root, "parent-");
  const parentRecord = readTemporaryOwner(parent);
  const child = expired(root, `${basename(parent)}/child-`, {
    repository: other,
  });
  const childRecord = readTemporaryOwner(child);
  writeFileSync(join(child, "payload"), "retained\n");
  // The parent's move is recorded in its own repository's ledger, which the
  // child's repository never reads.
  const parentAside = stopAfterMove(parent, parentRecord);
  const moved = join(parentAside, basename(child));
  retireTemporaryLedger(other);
  assert.ok(existsSync(segmentOf(realpathSync(other), childRecord.token)));
  assert.equal(readFileSync(join(moved, "payload"), "utf8"), "retained\n");
  assert.equal(
    temporaryLedgerContradiction(moved, readTemporaryOwner(moved)),
    null,
  );
  // Once the parent and what it holds are gone, the segment retires.
  removeTemporaryRoot(parentAside, parentRecord.token);
  retireTemporaryLedger(other);
  assert.equal(
    existsSync(segmentOf(realpathSync(other), childRecord.token)),
    false,
  );
});

test("a stale Codex home listing that cannot inspect an entry never replaces the prune's result", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const path = expired(root, "listed-");
  const homes = join(root, "codex-homes");
  mkdirSync(join(homes, "dotln-codex-home-2147483647-fixture"), {
    recursive: true,
  });
  // Its names can be listed, but no entry can be inspected.
  chmodSync(homes, 0o400);
  let result;
  try {
    result = await pruneHarness(root, {
      apply: true,
      scope: "repository",
      hostDirectory: join(root, ".runtime/host"),
      processes: [],
      openPaths: [],
      codexHomeRoot: homes,
    });
  } finally {
    chmodSync(homes, 0o700);
  }
  assert.equal(existsSync(path), false);
  assert.equal(result.removed.length, 1);
  assert.deepEqual(result.staleCodexEpisodeHomes, []);
  assert.match(result.staleCodexEpisodeHomesUnavailable, /EACCES/);
});

test("a stopped apply keeps naming its removals when the census after it fails", async () => {
  const calls = [];
  const report = await temporaryPruneSummary("unused", {
    apply: true,
    pruneHarness: async (_root, options) => {
      calls.push(options.apply);
      if (options.apply)
        throw Object.assign(new Error("parent refused"), {
          pruneRemoved: [{ bytes: 7 }],
        });
      throw new Error("ledger unreadable");
    },
  });
  assert.deepEqual(calls, [true, false]);
  assert.equal(
    report,
    "Prune: apply stopped after 1 removed, 7 bytes (parent refused); what remains:\nPrune: census unavailable; material retained (ledger unreadable)",
  );
});

test("a root removed before its bookkeeping failed is reported as removed", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const path = expired(root, "bookkeeping-");
  // The ledger accepts rows, but its directory refuses the segment's
  // retirement that follows the removal.
  const segments = join(root, ".runtime/temporary-roots/roots");
  chmodSync(segments, 0o500);
  let report;
  try {
    report = await temporaryPruneSummary(root, {
      apply: true,
      scope: "repository",
      hostDirectory: join(root, ".runtime/host"),
      processes: [],
      openPaths: [],
    });
  } finally {
    chmodSync(segments, 0o700);
  }
  assert.equal(existsSync(path), false);
  assert.match(report, /^Prune: apply stopped after 1 removed, \d+ bytes \(/);
});

// A planted backlog written straight to disk, each root a marker, one small
// file and its ledger segment, as createTemporaryRoot leaves them, without a
// process-table reading per root. Every owner has ended and every window has
// passed.
function plantExpiredBacklog(root, base, count, prefix) {
  const ledger = join(root, ".runtime/temporary-roots/roots");
  mkdirSync(ledger, { recursive: true });
  mkdirSync(base, { recursive: true });
  const owner = {
    pid: 2147483647,
    birth: "1.0",
    repository: realpathSync(root),
  };
  const paths = [];
  for (let index = 0; index < count; index++) {
    const path = join(base, `${prefix}${String(index).padStart(6, "0")}`);
    mkdirSync(path);
    const info = lstatSync(path);
    const token = randomUUID();
    writeFileSync(
      join(path, TEMPORARY_OWNER_FILE),
      JSON.stringify({
        schemaVersion: 1,
        token,
        class: "gate-fixture",
        owner,
        createdAt: "2020-01-01T00:00:00.000Z",
        endedAt: "2020-01-01T00:00:00.000Z",
        endSource: "completion",
        outcome: "passed",
        retentionHours: 0,
        device: info.dev,
        inode: info.ino,
      }) + "\n",
    );
    writeFileSync(join(path, "payload"), "fixture\n");
    writeFileSync(
      join(ledger, `${token}.jsonl`),
      JSON.stringify({
        action: "created",
        path,
        token,
        class: "gate-fixture",
        owner,
        at: "2020-01-01T00:00:00.000Z",
      }) + "\n",
    );
    paths.push(path);
  }
  return paths;
}

test("a kit-owned root goes on its record with its unreadable entries repaired, and only an expired closed-journal root is byte-inventoried", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  // Expired kit-owned roots of every class the record proves.
  const owned = {
    fixture: expired(root, "dotln-owned-fixture-"),
    scratch: expired(root, "dotln-owned-scratch-", {
      class: "session-scratch",
    }),
    capture: expired(root, "dotln-owned-capture-", { class: "worker-capture" }),
    warm: expired(root, "dotln-owned-warm-", {
      class: "warm-fixture",
      cacheKey: "stale",
    }),
    unreadable: expired(root, "dotln-owned-unreadable-"),
    restricted: expired(root, "dotln-owned-restricted-"),
  };
  writeFileSync(join(owned.unreadable, "secret"), "unreadable\n");
  chmodSync(join(owned.unreadable, "secret"), 0o000);
  mkdirSync(join(owned.restricted, "locked/inner"), { recursive: true });
  writeFileSync(join(owned.restricted, "locked/inner/file"), "inside\n");
  chmodSync(join(owned.restricted, "locked"), 0o000);
  // A root with no owner record and one whose record is malformed, each
  // holding a file nobody may read: the prune reads neither.
  const recordless = join(root, "roots", "dotln-recordless-abc123");
  const malformed = join(root, "roots", "dotln-malformed-def456");
  for (const path of [recordless, malformed]) {
    mkdirSync(path);
    writeFileSync(join(path, "secret"), "unreadable\n");
    chmodSync(join(path, "secret"), 0o000);
  }
  writeFileSync(join(malformed, TEMPORARY_OWNER_FILE), "not a record\n");
  t.after(() => {
    for (const path of [recordless, malformed])
      removeDirectory(path, { recursive: true, force: true });
  });
  // A closed order's journal root past its window, and one inside it.
  const lanes = {};
  for (const [order, createdAt] of [
    ["WO-931", "2020-01-01T00:00:00.000Z"],
    ["WO-932", null],
  ]) {
    retainWorktreeJournals(root, closingWorktree(root, order).worktree, order);
    lanes[order] = join(root, journalLane(root, order));
    endedLane(lanes[order], createdAt);
  }
  // A journal its owner cannot read is proven like any other.
  writeFileSync(join(lanes["WO-931"], "sealed.jsonl"), "{}\n");
  chmodSync(join(lanes["WO-931"], "sealed.jsonl"), 0o000);
  const report = await pruneHarness(root, {
    apply: true,
    scope: "repository",
    temporaryBases: [join(root, "roots")],
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
    currentWarmKey: "current",
    publishedRelease: () => "v9.9.9",
  });
  const row = (path) =>
    [...report.removed, ...report.retained].find(
      (entry) => entry.path === relative(root, path),
    );
  for (const [name, path] of Object.entries(owned)) {
    assert.equal(existsSync(path), false, name);
    assert.ok(report.removed.includes(row(path)), name);
    assert.equal(row(path).proof, "record", name);
  }
  assert.equal(row(recordless).reason, "legacy backfill window has not passed");
  assert.match(row(malformed).reason, /JSON/);
  for (const path of [recordless, malformed])
    assert.equal(lstatSync(join(path, "secret")).mode & 0o777, 0, path);
  // The expired journal root's bytes are proven before it goes, the
  // mode-000 journal among them with the mode it had, and the proof is kept
  // beside its order's lane, outside it; the one inside its window is not
  // read, nor is its lane, which keeps its journal root's window. The expired
  // one's lane follows it in the same prune, inventoried as every lane the
  // plan deletes is, and the journal proof outlives it.
  const journal = row(lanes["WO-931"]);
  assert.equal(journal.proof, "inventory");
  assert.ok(report.removed.includes(journal));
  assert.equal(existsSync(lanes["WO-931"]), false);
  assert.match(
    journal.byteProof,
    /^docs\/control\/local\/retained\/WO-931\.harness\.bytes-[a-f0-9]{16}\.json$/u,
  );
  const proof = JSON.parse(readFileSync(join(root, journal.byteProof), "utf8"));
  assert.equal(proof.workOrder, "WO-931");
  assert.ok(proof.files.some((file) => file.path === "checks.json"));
  assert.equal(
    proof.files.find((file) => file.path === "sealed.jsonl").mode,
    0,
  );
  assert.equal(row(lanes["WO-932"]).reason, "retention window has not passed");
  assert.equal(
    report.retained.find(
      (entry) => entry.path === "docs/control/local/retained/WO-932",
    ).reason,
    "nested owned root retained: harness",
  );
  assert.ok(
    report.removed.some(
      (entry) => entry.path === "docs/control/local/retained/WO-931",
    ),
  );
  // The journal's proof, then its lane's inventory at the plan and again at
  // the lane's pre-delete check.
  assert.equal(report.reads.snapshots, 0);
  assert.equal(report.reads.byteInventories, 3);
});

test("an entry its owner cannot make readable keeps its root by name and stops nothing", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  // The fixture's own teardown removes this root, granting itself what the
  // locked directory denies.
  const restricted = expired(root, "dotln-unrepairable-");
  mkdirSync(join(restricted, "locked"));
  chmodSync(join(restricted, "locked"), 0o000);
  const plain = expired(root, "dotln-plain-");
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  };
  // A preview repairs nothing, and names the entry it cannot read.
  const preview = await pruneHarness(root, options);
  assert.equal(
    preview.retained.find((entry) => entry.path === relative(root, restricted))
      .reason,
    `restricted-entry: ${join(restricted, "locked")}`,
  );
  assert.equal(lstatSync(join(restricted, "locked")).mode & 0o777, 0);
  const report = await pruneHarness(root, {
    ...options,
    apply: true,
    chmodEntry: () => {
      throw Object.assign(new Error("operation not permitted"), {
        code: "EPERM",
      });
    },
  });
  assert.equal(existsSync(plain), false);
  assert.ok(existsSync(join(restricted, TEMPORARY_OWNER_FILE)));
  assert.equal(
    report.retained.find((entry) => entry.path === relative(root, restricted))
      .reason,
    `restricted-entry: ${join(restricted, "locked")}`,
  );
});

test("a one-millisecond budget stops the prune with a partial report and the next run resumes it", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const paths = ["a-", "b-", "c-"].map((name) => expired(root, name));
  // A root of many entries, judged first, whose removal the budget cuts.
  const large = expired(root, "0-");
  for (let index = 0; index < 400; index++)
    mkdirSync(join(large, `entry-${index}/inner`), { recursive: true });
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  };
  const stopped = await pruneHarness(root, {
    ...options,
    apply: true,
    budgetMs: 1,
  });
  assert.ok(stopped.stoppedAt, JSON.stringify(stopped));
  assert.equal(stopped.stoppedAt.path, relative(root, large));
  assert.equal(stopped.remaining, 4);
  assert.equal(
    stopped.retained.find((entry) => entry.path === relative(root, large))
      .reason,
    "budget",
  );
  assert.ok(existsSync(join(large, TEMPORARY_OWNER_FILE)));
  const summary = formatPruneReport(stopped);
  assert.match(
    summary,
    new RegExp(
      `removed ${stopped.removed.length}; remaining ${stopped.remaining}; resume with node scripts/harness\\.mjs prune --apply`,
    ),
  );
  assert.match(summary, /Prune stopped at its budget of 0 h 0 min in /);
  // Without a budget the prune finishes what the bounded one left.
  const resumed = await pruneHarness(root, { ...options, apply: true });
  assert.equal(resumed.stoppedAt, null);
  assert.equal(resumed.remaining, 0);
  for (const path of [large, ...paths]) assert.equal(existsSync(path), false);
  assert.equal(stopped.removed.length + resumed.removed.length, 4);
});

test("a bounded prune over two thousand expired roots stops inside its budget on one table and no byte inventory, and a second run resumes", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const base = join(root, "backlog");
  const paths = plantExpiredBacklog(root, base, 2000, "dotln-backlog-");
  let tables = 0;
  const options = {
    scope: "repository",
    temporaryBases: [base],
    hostDirectory: join(root, ".runtime/host"),
    openPaths: [],
    holders: [],
    sessionId: "backlog-fixture",
    readProcesses: () => {
      tables += 1;
      return [];
    },
  };
  const budgetMs = 400;
  const first = await pruneHarness(root, {
    ...options,
    apply: true,
    budgetMs,
  });
  assert.ok(first.stoppedAt, JSON.stringify(first.stoppedAt));
  // The prune stopped at its budget, judging and removing as it went: what
  // it found it removed, and it never judged the whole backlog first.
  assert.ok(first.stoppedAt.afterMs < budgetMs + 250, first.stoppedAt.afterMs);
  assert.ok(first.removed.length > 0);
  assert.ok(first.candidates.length < 2000);
  assert.equal(first.candidates.length, first.removed.length);
  assert.equal(first.remaining, 2000 - first.removed.length);
  assert.ok(first.removed.every((row) => row.proof === "record"));
  assert.equal(first.reads.snapshots, 1);
  assert.equal(first.reads.byteInventories, 0);
  assert.equal(tables, 1);
  const second = await pruneHarness(root, { ...options, apply: true });
  assert.equal(second.stoppedAt, null);
  assert.equal(first.removed.length + second.removed.length, 2000);
  assert.equal(second.reads.snapshots, 1);
  assert.equal(second.reads.byteInventories, 0);
  // The owner's writer is read once for each second of judging, not per root.
  assert.ok(
    second.reads.writerViews < second.removed.length / 10,
    JSON.stringify(second.reads),
  );
  assert.equal(tables, 2);
  assert.ok(paths.every((path) => !existsSync(path)));
});

// A root this process owns and lives in, with no gate or session.
function liveRoot(root, path) {
  const made = createTemporaryRoot(path, {
    class: "gate-fixture",
    repository: root,
    owner: { gateId: undefined, suite: undefined, session: undefined },
  });
  const record = readTemporaryOwner(made);
  delete record.fixtureOwner;
  writeTemporaryOwner(made, record);
  return made;
}

test("an apply puts back what it granted to judge a root it then keeps", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  // Two expired parents, each holding a live owner's root: one inside a
  // directory nobody may list, one whose own directory nobody may search.
  const listed = expired(root, "dotln-kept-locked-");
  mkdirSync(join(listed, "locked"));
  liveRoot(root, join(listed, "locked", "live-"));
  const searched = expired(root, "dotln-kept-sealed-");
  const sealed = liveRoot(root, join(searched, "live-"));
  chmodSync(join(listed, "locked"), 0o000);
  chmodSync(sealed, 0o000);
  const report = await pruneHarness(root, {
    apply: true,
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    readProcesses: () => temporaryProcessTable(root),
    openPaths: [],
  });
  const modes = [join(listed, "locked"), sealed].map(
    (path) => lstatSync(path).mode & 0o777,
  );
  chmodSync(join(listed, "locked"), 0o700);
  chmodSync(sealed, 0o700);
  assert.deepEqual(modes, [0, 0]);
  for (const parent of [listed, searched])
    assert.match(
      report.retained.find((entry) => entry.path === relative(root, parent))
        .reason,
      /^nested owned root retained: .+ \(owner is live\)$/u,
    );
  assert.equal(report.removed.length, 0);
});

test("a parent kept for a live nested root puts back what its judgment granted inside the nested roots it had let go", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  // Expired nested roots, each with a directory nobody may list, beside one
  // live nested root: whichever the walk judges before the live one is let
  // go, and its walk's grant must be put back when the live one keeps the
  // parent. Eight of them make an earlier one all but certain in any listing
  // order; the assertion holds in every order.
  const parent = expired(root, "dotln-kept-parent-");
  const lets = Array.from({ length: 8 }, (_, index) =>
    expired(root, `${basename(parent)}/let-${index}-`),
  );
  for (const child of lets) mkdirSync(join(child, "locked"));
  liveRoot(root, join(parent, "live-"));
  // The fixture's teardown grants itself what the locked directories deny.
  for (const child of lets) chmodSync(join(child, "locked"), 0o000);
  const judged = judgeTemporaryRoot(
    root,
    parent,
    {},
    { processes: temporaryProcessTable(root), repair: true },
  );
  assert.match(
    judged.retained?.reason ?? "",
    /^nested owned root retained: live-.+ \(owner is live\)$/u,
  );
  assert.deepEqual(
    lets.map((child) => lstatSync(join(child, "locked")).mode & 0o777),
    lets.map(() => 0),
  );
});

test("a prune judges the roots a kept parent queues once and counts none of them as remaining", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  // A live root nested in an expired parent and registered in another
  // repository's ledger, so the listing does not name it: the parent's walk
  // finds it, the parent is kept for it, and it is queued and judged after.
  const other = join(root, "other-repository");
  mkdirSync(other);
  runGit(other, ["init", "-q", "-b", "main"]);
  const parent = expired(root, "dotln-queued-parent-");
  const nested = createTemporaryRoot(join(parent, "live-"), {
    class: "gate-fixture",
    repository: other,
    owner: { gateId: undefined, suite: undefined, session: undefined },
  });
  const record = readTemporaryOwner(nested);
  delete record.fixtureOwner;
  writeTemporaryOwner(nested, record);
  const lone = expired(root, "dotln-queued-lone-");
  const report = await pruneHarness(root, {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    readProcesses: () => temporaryProcessTable(root),
    openPaths: [],
  });
  assert.equal(report.stoppedAt, null);
  assert.match(
    report.retained.find((entry) => entry.path === relative(root, parent))
      ?.reason ?? "",
    /^nested owned root retained: live-/u,
  );
  assert.ok(
    report.retained.some((entry) => entry.path === relative(root, nested)),
    JSON.stringify(report.retained),
  );
  assert.deepEqual(
    report.candidates.map((entry) => entry.path),
    [relative(root, lone)],
  );
  // Only the one candidate a preview leaves remains; the queued root was
  // judged, not left.
  assert.equal(report.remaining, 1);
});

test("a root whose owner record its owner cannot read is kept by that record's path and stops no close", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const sealed = expired(root, "dotln-sealed-record-");
  const plain = expired(root, "dotln-plain-record-");
  // The fixture's teardown grants itself what the sealed record denies.
  chmodSync(join(sealed, TEMPORARY_OWNER_FILE), 0o000);
  // The close captures both, the sealed one admitted unread.
  const owned = boundTemporaryRoots(root);
  assert.deepEqual(
    owned.map((row) => row.path).sort(),
    [plain, sealed].map((path) => realpathSync(path)).sort(),
  );
  const report = await pruneHarness(root, {
    apply: true,
    scope: "close",
    ownedTemporaryRoots: owned,
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  });
  assert.equal(existsSync(plain), false);
  assert.ok(existsSync(sealed));
  assert.equal(
    report.retained.find((entry) => entry.path === relative(root, sealed))
      ?.reason,
    `restricted-entry: ${join(realpathSync(sealed), TEMPORARY_OWNER_FILE)}`,
  );
});

test("a planned candidate whose re-check the budget cuts short stops the apply there, kept as budget", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  // A dead suite-success cache of fifty files: its plan inventory looks at
  // the clock 51 times, and so does its pre-delete re-check.
  const cache = join(root, ".git/dotln/suite-success");
  mkdirSync(cache, { recursive: true });
  for (let index = 0; index < 50; index++)
    writeFileSync(join(cache, `row-${index}`), "passed\n");
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  };
  // Each look advances this clock a millisecond: 80 looks see the plan
  // through and stop the re-check partway.
  let clock = 0;
  const stopped = await pruneHarness(root, {
    ...options,
    apply: true,
    budgetMs: 80,
    budgetClock: () => clock++,
  });
  assert.deepEqual(
    { step: stopped.stoppedAt?.step, path: stopped.stoppedAt?.path },
    { step: "removal", path: "git-common/dotln/suite-success" },
  );
  assert.equal(
    stopped.retained.find(
      (entry) => entry.path === "git-common/dotln/suite-success",
    )?.reason,
    "budget",
  );
  assert.equal(stopped.remaining, 1);
  assert.ok(existsSync(cache));
  const resumed = await pruneHarness(root, { ...options, apply: true });
  assert.equal(resumed.stoppedAt, null);
  assert.equal(existsSync(cache), false);
});

// Every planned kind removed as a tree asks the budget before each entry of
// its permission walk and of its deletion, not only before its re-check.
test("a budget spent once a planned snapshot's re-check has passed stops its permission walk, kept as budget, and the next prune finishes it", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const snapshot = join(
    realpathSync(root),
    ".runtime/harness/0123456789abcdef",
  );
  mkdirSync(snapshot, { recursive: true });
  for (let index = 0; index < 10; index++)
    writeFileSync(join(snapshot, `entry-${index}`), "snapshot\n");
  // A directory the walk would grant next if it did not ask the budget first.
  const nested = join(snapshot, "nested");
  mkdirSync(nested);
  writeFileSync(join(nested, "entry"), "snapshot\n");
  chmodSync(nested, 0o500);
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  };
  // The clock stands still through the plan and the re-check, and passes the
  // one-millisecond budget as the removal grants the snapshot's own directory.
  let clock = 0;
  const grants = [];
  const stopped = await pruneHarness(root, {
    ...options,
    apply: true,
    budgetMs: 1,
    budgetClock: () => clock,
    chmodEntry: (path, mode) => {
      grants.push(path);
      if (path === snapshot) clock = 2;
      chmodSync(path, mode);
    },
  });
  // The walk granted the snapshot's directory and stopped before the next.
  assert.deepEqual(grants, [snapshot]);
  assert.equal(lstatSync(nested).mode & 0o777, 0o500);
  assert.deepEqual(
    { step: stopped.stoppedAt?.step, path: stopped.stoppedAt?.path },
    { step: "removal", path: ".runtime/harness/0123456789abcdef" },
  );
  assert.equal(
    stopped.retained.find(
      (entry) => entry.path === ".runtime/harness/0123456789abcdef",
    )?.reason,
    "budget",
  );
  assert.equal(stopped.removed.length, 0);
  assert.equal(stopped.remaining, 1);
  assert.equal(readdirSync(snapshot).length, 11);
  const resumed = await pruneHarness(root, { ...options, apply: true });
  assert.equal(resumed.stoppedAt, null);
  assert.equal(resumed.remaining, 0);
  assert.equal(existsSync(snapshot), false);
});

test("a budget spent partway through deleting a retained lane keeps it as budget beside the proof of every file, and the next prune finishes it", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const retained = join(realpathSync(root), "docs/control/local/retained");
  const lane = join(retained, "WO-901");
  const groups = 4;
  const perGroup = 25;
  for (let group = 0; group < groups; group++) {
    mkdirSync(join(lane, `group-${group}`), { recursive: true });
    for (let index = 0; index < perGroup; index++)
      writeFileSync(join(lane, `group-${group}`, `row-${index}`), "receipt\n");
  }
  const files = () =>
    readdirSync(lane, { recursive: true, withFileTypes: true }).filter(
      (entry) => entry.isFile(),
    ).length;
  const proofs = () =>
    readdirSync(retained).filter((name) => name.startsWith("WO-901.bytes-"));
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
    publishedRelease: (order) => (order === "WO-901" ? "v1.0.0" : null),
  };
  // The clock stands still until the removal grants the lane's directory;
  // from then each look advances it a millisecond. After that grant the
  // permission walk asks once for each group and each file, and the deletion
  // once for the lane and once for each group and each file, so the budget
  // ends with half of the groups deleted.
  const budgetMs = 1000;
  const walkAsks = groups * (1 + perGroup);
  const halfOfDeletion = 1 + (groups / 2) * (1 + perGroup);
  let clock = 0;
  let counting = false;
  const stopped = await pruneHarness(root, {
    ...options,
    apply: true,
    budgetMs,
    budgetClock: () => (counting ? clock++ : clock),
    chmodEntry: (path, mode) => {
      if (path === lane && !counting) {
        counting = true;
        clock = budgetMs - walkAsks - halfOfDeletion;
      }
      chmodSync(path, mode);
    },
  });
  assert.ok(counting, "the removal's permission walk began");
  assert.deepEqual(
    { step: stopped.stoppedAt?.step, path: stopped.stoppedAt?.path },
    { step: "removal", path: "docs/control/local/retained/WO-901" },
  );
  assert.equal(
    stopped.retained.find(
      (entry) => entry.path === "docs/control/local/retained/WO-901",
    )?.reason,
    "budget",
  );
  assert.equal(stopped.remaining, 1);
  const left = files();
  assert.ok(left > 0 && left < groups * perGroup, String(left));
  // The proof published before the deletion began names every file.
  const [proof, ...others] = proofs();
  assert.deepEqual(others, []);
  const proven = JSON.parse(readFileSync(join(retained, proof), "utf8"));
  assert.equal(
    proven.files.filter((file) => !file.directory).length,
    groups * perGroup,
  );
  const resumed = await pruneHarness(root, { ...options, apply: true });
  assert.equal(resumed.stoppedAt, null);
  assert.equal(resumed.remaining, 0);
  assert.equal(existsSync(lane), false);
  assert.ok(proofs().includes(proof));
});

test("a budget spent inside an integration stash's byte inventory stops the plan there, kept as budget, and the next prune drops it", async (t) => {
  const root = fixture(t);
  const git = (...args) =>
    runGit(root, [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "maintenance.auto=false",
      ...args,
    ]);
  git("init", "-q", "-b", "main");
  excludeFixtureOwnership(root);
  writeFileSync(join(root, "tracked.txt"), "base\n");
  git("add", "tracked.txt");
  git("commit", "-qm", "base");
  writeFileSync(join(root, "tracked.txt"), "stashed\n");
  git("stash", "push", "-q", "-m", "WO-901 integrate 2030-01-01");
  const label = "stash@{0} On main: WO-901 integrate 2030-01-01";
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  };
  // The stash's release is looked up just before its inventory: the clock
  // passes the one-millisecond budget there, inside the judgment.
  let clock = 0;
  const stopped = await pruneHarness(root, {
    ...options,
    apply: true,
    budgetMs: 1,
    budgetClock: () => clock,
    publishedRelease: (order) => {
      clock = 2;
      return order === "WO-901" ? "v1.0.0" : null;
    },
  });
  assert.equal(clock, 2, "the stash's judgment began");
  // Planned, the stash would stop the apply at its removal instead.
  assert.deepEqual(
    { step: stopped.stoppedAt?.step, path: stopped.stoppedAt?.path },
    { step: "plan", path: label },
  );
  assert.equal(
    stopped.retained.find((entry) => entry.path === label)?.reason,
    "budget",
  );
  assert.ok(
    !stopped.candidates.some((entry) => entry.kind === "integration-stash"),
  );
  assert.equal(stopped.remaining, 1);
  assert.notEqual(git("stash", "list").trim(), "");
  const resumed = await pruneHarness(root, {
    ...options,
    apply: true,
    publishedRelease: (order) => (order === "WO-901" ? "v1.0.0" : null),
  });
  assert.equal(resumed.stoppedAt, null);
  assert.equal(git("stash", "list").trim(), "");
});

test("a gate's end names a root it cannot list as a cleanup blocker instead of failing", (t) => {
  const root = fixture(t);
  let passed;
  withTemporaryOwner(
    { repository: root, gateId: "gate-locked", suite: "passed" },
    () => {
      passed = createFixtureRoot(join(root, "roots/locked-gate-"));
    },
  );
  mkdirSync(join(passed, "locked"));
  // The fixture's teardown grants itself what the locked directory denies.
  chmodSync(join(passed, "locked"), 0o000);
  const report = finishGateTemporaryRoots(
    root,
    "gate-locked",
    [{ name: "passed", exitCode: 0 }],
    { processes: [] },
  );
  assert.ok(
    report.blockers.some(
      (row) =>
        row.path === passed &&
        row.reason === `restricted-entry: ${join(passed, "locked")}`,
    ),
    JSON.stringify(report.blockers),
  );
  assert.ok(existsSync(passed));
});

test("a budget spent judging a nested root keeps its parent, the root being judged, as budget", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const parent = expired(root, "dotln-parent-");
  const child = expired(root, `${basename(parent)}/child-`);
  for (let index = 0; index < 100; index++)
    mkdirSync(join(child, `d-${index}`));
  // Each look advances this clock a millisecond: the parent's walk finds the
  // child, and the child's walk of a hundred directories outlasts 30 looks.
  let clock = 0;
  const report = await pruneHarness(root, {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
    budgetMs: 30,
    budgetClock: () => clock++,
  });
  assert.equal(report.stoppedAt?.path, relative(root, parent));
  assert.equal(
    report.retained.find((entry) => entry.path === relative(root, parent))
      ?.reason,
    "budget",
  );
  assert.ok(
    !report.retained.some((entry) => entry.path === relative(root, child)),
  );
  // The parent kept as budget and the child it holds, never judged alone.
  assert.equal(report.remaining, 2);
});

test("a listing asks its budget once a batch, lists the first batch even when spent, and counts what it did not read", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  plantExpiredBacklog(root, join(root, "backlog"), 200, "dotln-listed-");
  // Each look at this clock advances it a millisecond: the budget is spent at
  // its first ask, which comes after the first batch of 64 segments.
  let clock = 0;
  const listing = listTemporaryRoots(root, {
    scope: "repository",
    budget: pruneBudget(1, () => clock++),
  });
  assert.equal(listing.paths.length, 64, JSON.stringify(listing.stoppedAt));
  assert.equal(listing.unexamined, 136);
  assert.match(
    listing.stoppedAt,
    /\.runtime\/temporary-roots\/roots\/[a-f0-9-]{36}\.jsonl$/u,
  );
  assert.equal(clock, 2);
  assert.equal(
    listTemporaryRoots(root, { scope: "repository" }).paths.length,
    200,
  );
});

test("a budget spent inside a deletion keeps that root at its path with its record, and the next prune finishes it", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const path = expired(root, "dotln-deleted-partway-");
  for (let index = 0; index < 100; index++)
    writeFileSync(join(path, `file-${index}`), "payload\n");
  const options = {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  };
  // Each look at this clock advances it a millisecond. The removal's walk
  // looks once per entry before its deletions do, so 150 looks let the walk
  // of 101 entries finish and stop the deletions partway.
  let clock = 0;
  const stopped = await pruneHarness(root, {
    ...options,
    apply: true,
    budgetMs: 150,
    budgetClock: () => clock++,
  });
  assert.equal(stopped.stoppedAt?.step, "removal", JSON.stringify(stopped));
  assert.equal(stopped.stoppedAt.path, relative(root, path));
  assert.equal(
    stopped.retained.find((entry) => entry.path === relative(root, path))
      .reason,
    "budget",
  );
  assert.equal(stopped.removed.length, 0);
  assert.equal(stopped.remaining, 1);
  assert.ok(existsSync(join(path, TEMPORARY_OWNER_FILE)));
  const left = readdirSync(path).filter((name) =>
    name.startsWith("file-"),
  ).length;
  assert.ok(left > 0 && left < 100, String(left));
  const resumed = await pruneHarness(root, { ...options, apply: true });
  assert.equal(resumed.stoppedAt, null);
  assert.equal(resumed.remaining, 0);
  assert.equal(existsSync(path), false);
});

test("a preview counts the candidates no walk has measured as unmeasured and as remaining, and prints no resume", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  const paths = ["a-", "b-"].map((name) => expired(root, name));
  const preview = await pruneHarness(root, {
    scope: "repository",
    hostDirectory: join(root, ".runtime/host"),
    processes: [],
    openPaths: [],
  });
  assert.equal(preview.candidates.length, 2);
  assert.equal(preview.unmeasured, 2);
  assert.equal(preview.remaining, 2);
  const text = formatPruneReport(preview);
  assert.match(
    text,
    /^Prune: 2 candidates; 0 bytes \(2 unmeasured\); 0 removed; 0 retained$/mu,
  );
  assert.match(
    text,
    /^ {2}temporary-root\/gate-fixture: 2 candidates, 0 bytes \(2 unmeasured\), 0 retained$/mu,
  );
  assert.doesNotMatch(text, /remaining|resume/u);
  for (const path of paths) assert.ok(existsSync(path));
});

test("the census after a failed bounded apply has what the budget leaves", async () => {
  const budgets = [];
  await temporaryPruneSummary("unused", {
    apply: true,
    budgetMs: 60_000,
    pruneHarness: async (_root, options) => {
      budgets.push(options.budgetMs);
      if (!options.apply)
        return {
          candidates: [],
          removed: [],
          retained: [],
          census: [],
          bytes: 0,
          unmeasured: 0,
          remaining: 0,
          stoppedAt: null,
        };
      await new Promise((resolve) => setTimeout(resolve, 20));
      throw new Error("parent refused");
    },
  });
  assert.equal(budgets[0], 60_000);
  assert.ok(budgets[1] >= 0 && budgets[1] < 60_000 - 10, String(budgets[1]));
});

test("the routine prune's budget key is judged as the budgets reader judges it, and a refused value leaves the default with an advisory", (t) => {
  const root = fixture(t);
  const write = (value) => {
    mkdirSync(join(root, "docs/control"), { recursive: true });
    writeFileSync(
      join(root, "docs/control/budgets.json"),
      JSON.stringify(value),
    );
  };
  // Unset, the routine prune has thirty minutes.
  assert.deepEqual(pruneStartBudget(root), { budgetMs: 1_800_000 });
  for (const [value, budgetMs] of [
    [{}, 1_800_000],
    [{ prune: {} }, 1_800_000],
    [{ prune: { startBudgetMs: 5 } }, 5],
    [{ prune: { startBudgetMs: null } }, null],
  ]) {
    write(value);
    assert.deepEqual(pruneStartBudget(root), { budgetMs });
  }
  for (const value of [
    { prune: null },
    { prune: [] },
    { prune: { startBudgetMs: -1 } },
    { prune: { startBudgetMs: "5" } },
  ]) {
    write(value);
    const read = pruneStartBudget(root);
    assert.equal(read.budgetMs, 1_800_000);
    assert.match(read.advisory, /Invalid budget: prune\.startBudgetMs/u);
    assert.match(read.advisory, /the default of 0 h 30 min applies$/u);
    assert.throws(
      () => pruneStartBudgetKey(value),
      /Invalid budget: prune\.startBudgetMs/u,
    );
  }
});
