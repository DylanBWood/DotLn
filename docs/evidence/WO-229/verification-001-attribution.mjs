// VER-001 F1: every holder a wait observes belongs to another checkout, yet the
// relation split attributes the start of a long wait to "checkout unknown".
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-229/verification-001-attribution.mjs
// Exit 1 while a wait with more than 32 observations loses its observed relation.
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const source = (path) => new URL(`../../../${path}`, import.meta.url).href;
const { runGate } = await import(source("scripts/test-runner.mjs"));
const { acquireHostLaneCapacity, acquireHostLanes } = await import(
  source("scripts/lib/host-lanes.mjs")
);
const { gateHostLaneWait } = await import(
  source("scripts/lib/gate-timeline.mjs")
);
const { readGateChecks } = await import(
  source("scripts/lib/gate-evidence.mjs")
);
const { delay, processAlive, readHostSnapshot } = await import(
  source("scripts/lib/host-resources.mjs")
);

// Lock acquisition and the instant before the first capacity observation are
// the only time the order admits as unknown.
const SLACK_MS = 500;
const base = realpathSync(mkdtempSync(join(tmpdir(), "wo229-ver001-f1-")));
const paths = [base];
const result = {};

async function stopGuard(registry) {
  const file = join(registry, "guard.json");
  if (!existsSync(file)) return;
  const guard = JSON.parse(readFileSync(file, "utf8"));
  if (processAlive(guard, readHostSnapshot({ footprint: false }).processes))
    process.kill(guard.pid, "SIGTERM");
  for (let i = 0; i < 100 && existsSync(file); i++) await delay(20);
}

// Case A: a real document gate in one checkout waits while a sibling
// checkout's holders rotate 60 times; the registry stays full throughout.
async function rotatingGate() {
  const registry = join(base, "a-host"),
    repo = join(base, "a-repo"),
    other = join(base, "a-sibling");
  paths.push(registry, repo, other);
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  mkdirSync(other);
  writeFileSync(
    join(repo, "docs/control/budgets.json"),
    JSON.stringify({
      memory: { signalIntervalMs: 50, footprintIntervalMs: 100 },
    }),
  );
  await acquireHostLaneCapacity({ directory: registry, capacity: 4 });
  const git = (...args) => execFileSync("git", args, { stdio: "ignore" });
  git("init", "-q", repo);
  git("-C", repo, "add", ".");
  git(
    "-C",
    repo,
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
    "Fixture",
  );
  const hold = (task) =>
    acquireHostLanes({
      directory: registry,
      slots: 1,
      worktree: other,
      task,
      parentLease: null,
      onWait: () => {},
    });
  const held = [
    await hold("sibling-a"),
    await hold("sibling-b"),
    await hold("sibling-c"),
  ];
  const lines = [],
    original = console.log;
  let waiting = false;
  console.log = (...args) => {
    const line = args.join(" ");
    lines.push(line);
    if (line.startsWith("WAIT host lanes")) waiting = true;
  };
  const rotation = (async () => {
    for (let i = 0; i < 1500 && !waiting; i++) await delay(20);
    for (let i = 0; i < 60; i++) {
      held.push(await hold(`sibling-${i}`));
      await held.shift().release();
      await delay(100);
    }
    while (held.length) await held.shift().release();
  })();
  let row;
  try {
    row = await runGate(["--document", "--again"], repo, {
      hostDirectory: registry,
      table: [
        {
          name: "build",
          build: true,
          document: true,
          command: [process.execPath, "-e", "setTimeout(()=>{},20)"],
        },
        {
          name: "docs-check",
          document: true,
          command: [process.execPath, "-e", "setTimeout(()=>{},20)"],
        },
      ],
    });
  } finally {
    await rotation;
    console.log = original;
    await stopGuard(registry);
  }
  const recorded = readGateChecks(repo)
    .filter((entry) => entry.checkId === "npm run test:docs")
    .at(-1);
  const waits = lines.filter((line) => line.startsWith("WAIT"));
  const wait = recorded.hostLaneWait;
  return {
    exitCode: row.exitCode,
    waitLines: waits.length,
    waitLinesNamingAnotherCheckout: waits.filter((line) =>
      /another checkout/.test(line),
    ).length,
    waitLinesNamingOtherRelations: waits.filter((line) =>
      /this checkout|checkout unknown|registry lock/.test(line),
    ).length,
    summary: lines.find((line) => line.startsWith("npm run test:docs:")),
    wallMs: wait.wallMs,
    byRelation: wait.byRelation,
    retainedObservations: recorded.taskTimeline.find(
      (task) => task.name === "build",
    ).hostLaneWaitObservations.length,
    pathLeaks: paths.filter((path) =>
      JSON.stringify({ lines, recorded }).includes(path),
    ).length,
    expectation: `another-checkout >= wallMs - ${SLACK_MS}`,
    holds: wait.byRelation["another-checkout"] >= wait.wallMs - SLACK_MS,
  };
}

// Case B: one static holder that never changes. The heartbeat is scaled from
// 30 s to 50 ms, so the 7 s wait stands for a wait above 32 heartbeats
// (about 16 minutes at the default).
async function staticHolder() {
  const registry = join(base, "b-host"),
    a = join(base, "b-a"),
    b = join(base, "b-b");
  paths.push(registry, a, b);
  mkdirSync(a);
  mkdirSync(b);
  await acquireHostLaneCapacity({ directory: registry, capacity: 4 });
  const holder = await acquireHostLanes({
    directory: registry,
    slots: 4,
    worktree: a,
    task: "complete",
    parentLease: null,
  });
  const startedAt = new Date().toISOString();
  let published = 0;
  const pending = acquireHostLanes({
    directory: registry,
    slots: 1,
    worktree: b,
    task: "waiter",
    parentLease: null,
    waitHeartbeatMs: 50,
    onWait: () => published++,
  });
  await delay(7000);
  await holder.release();
  const lease = await pending;
  const wait = gateHostLaneWait([
    {
      name: "waiter",
      startedAt,
      finishedAt: new Date().toISOString(),
      hostLaneWaitMs: Date.now() - Date.parse(startedAt),
      hostLaneWaitObservations: lease.waitObservations,
    },
  ]);
  await lease.release();
  return {
    publishedObservations: published,
    retainedObservations: lease.waitObservations.length,
    observedRelations: [
      ...new Set(
        lease.waitObservations.flatMap((row) =>
          row.holders.map((holder) => holder.relation),
        ),
      ),
    ],
    wallMs: wait.wallMs,
    byRelation: wait.byRelation,
    expectation: `another-checkout >= wallMs - ${SLACK_MS}`,
    holds: wait.byRelation["another-checkout"] >= wait.wallMs - SLACK_MS,
  };
}

try {
  result.rotatingGate = await rotatingGate();
  result.staticHolder = await staticHolder();
} finally {
  rmSync(base, { recursive: true, force: true });
}
console.log(JSON.stringify(result, null, 2));
process.exitCode =
  result.rotatingGate.holds && result.staticHolder.holds ? 0 : 1;
