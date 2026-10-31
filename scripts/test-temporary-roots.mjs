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
  mkdirSync,
  openSync,
  ftruncateSync,
  readFileSync,
  rmSync as removeDirectory,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
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
  ownerAlive,
  readRetention,
  temporaryChurn,
  temporaryLedger,
  temporaryInventory,
  retireTemporaryLedger,
  promoteTemporaryRoot,
  withTemporaryOwner,
  pruneSessionTemporaryRoots,
  ensureTemporaryRoot,
} from "./lib/temporary-roots.mjs";
import {
  applyTemporaryCandidate,
  judgeTemporaryRoot,
  finishGateTemporaryRoots,
  recordTemporaryGateResult,
} from "./lib/temporary-prune.mjs";
import { pruneHarness } from "./lib/harness-prune.mjs";
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
          "outer-gate": /containing fixture gate is live/,
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
