// VER-002 independent probes of WO-229's repaired attribution and the
// condition that consumes it. Both earlier static-holder checks build their
// task row by hand; these go through the runner's own row assembly.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-229/verification-002-probes.mjs
// Exit 0 when every case holds.
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const source = (path) => new URL(`../../../${path}`, import.meta.url).href;
const { scheduleSuites } = await import(source("scripts/test-runner.mjs"));
const { acquireHostLaneCapacity, acquireHostLanes, formatLaneWait } =
  await import(source("scripts/lib/host-lanes.mjs"));
const { gateHostLaneWait, gateCriticalPath, formatHostLaneWait } = await import(
  source("scripts/lib/gate-timeline.mjs")
);
const { measureDocumentGates, documentGateMeasurement } = await import(
  source("scripts/lib/planning-conditions.mjs")
);
const { readGateChecks } = await import(
  source("scripts/lib/gate-evidence.mjs")
);
const { delay, processAlive, readHostSnapshot } = await import(
  source("scripts/lib/host-resources.mjs")
);

// Time before the first capacity observation is the only unknown expected.
const SLACK_MS = 300;
const base = realpathSync(mkdtempSync(join(tmpdir(), "wo229-ver002-")));
const result = {};

const fixtureRepo = (repo) => {
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  writeFileSync(
    join(repo, "docs/control/budgets.json"),
    JSON.stringify({
      memory: { signalIntervalMs: 50, footprintIntervalMs: 100 },
    }),
  );
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
};

async function stopGuard(registry) {
  const file = join(registry, "guard.json");
  if (!existsSync(file)) return;
  const guard = JSON.parse(readFileSync(file, "utf8"));
  if (processAlive(guard, readHostSnapshot({ footprint: false }).processes))
    process.kill(guard.pid, "SIGTERM");
  for (let i = 0; i < 100 && existsSync(file); i++) await delay(20);
}

const criticalSplit = (rows) => {
  const path = gateCriticalPath(rows);
  return {
    laneWaitMs: path.laneWaitMs,
    gapMs: path.gapMs,
    waitMs: path.waitMs,
    sumHolds: path.laneWaitMs + path.gapMs === path.waitMs,
  };
};

// Case A: one unchanging other-checkout holder, more than 32 heartbeats, and
// the runner's ordinary admission row. Case B: the same holder in front of an
// exclusive task's `:overlap` reservation that light peers join.
async function runnerStatic(shape) {
  const folder = join(base, shape),
    registry = join(folder, "host"),
    repo = join(folder, "repo"),
    other = join(folder, "other");
  mkdirSync(repo, { recursive: true });
  mkdirSync(other, { recursive: true });
  await acquireHostLaneCapacity({ directory: registry, capacity: 4 });
  const holder = await acquireHostLanes({
    directory: registry,
    slots: shape === "overlap" ? 3 : 4,
    worktree: other,
    task: "sibling-complete",
    parentLease: null,
    onWait() {},
  });
  const lines = [];
  let released = false;
  const release = (async () => {
    for (let i = 0; i < 1500 && lines.length < 60; i++) await delay(10);
    await holder.release();
    released = true;
  })();
  const light = new Set(["light-a", "light-b"]);
  // The scheduler requires one build; it is admitted by a stub lease so the
  // registry wait under test belongs to the rows after it.
  const build = { name: "build", build: true, command: ["fixture"] };
  const table =
    shape === "overlap"
      ? [
          build,
          {
            name: "exclusive",
            exclusive: true,
            overlap: 2,
            priority: 200,
            command: ["fixture"],
          },
          { name: "light-a", command: ["fixture"] },
          { name: "light-b", command: ["fixture"] },
        ]
      : [build, { name: "task", command: ["fixture"] }];
  let rows;
  try {
    rows = await scheduleSuites(table, {
      repo,
      concurrency: 4,
      lightTasks: light,
      hostLanes: {
        directory: registry,
        capacity: 4,
        parentLease: null,
        waitHeartbeatMs: 50,
        onWait: (_holders, observation) =>
          lines.push(formatLaneWait("probe", observation)),
      },
      acquireLanes: (options) =>
        options.task === "build"
          ? {
              record: { slots: options.slots },
              waitObservations: [],
              waitRelations: [],
              async release() {},
            }
          : acquireHostLanes(options),
      execute: async (row) => {
        await delay(row.name === "exclusive" ? 300 : 30);
        return { name: row.name, executed: true, exitCode: 0, durationMs: 5 };
      },
    });
  } finally {
    await release;
  }
  const recorded = JSON.parse(JSON.stringify({ taskTimeline: rows }));
  const wait = gateHostLaneWait(recorded.taskTimeline);
  const first = recorded.taskTimeline.find(
    (row) => row.name === (shape === "overlap" ? "exclusive" : "task"),
  );
  const firstWait = gateHostLaneWait([first]);
  const text = JSON.stringify({ recorded, lines, wait });
  return {
    released,
    exitCodes: recorded.taskTimeline.map((row) => row.exitCode),
    waitLines: lines.length,
    waitLinesNamingAnotherCheckout: lines.filter((line) =>
      line.includes("another checkout"),
    ).length,
    retainedObservations: first.hostLaneWaitObservations?.length ?? 0,
    relationSegments: first.hostLaneWaitRelations,
    firstTaskWaitMs: first.hostLaneWaitMs,
    firstTaskByRelation: firstWait.byRelation,
    gateWallMs: wait.wallMs,
    gateByRelation: wait.byRelation,
    summary: formatHostLaneWait(wait),
    criticalPath: criticalSplit(recorded.taskTimeline),
    pathLeaks: [base, folder, repo, other, registry].filter((path) =>
      text.includes(path),
    ).length,
    holds:
      released &&
      lines.length > 32 &&
      first.hostLaneWaitObservations?.length === 32 &&
      firstWait.byRelation["another-checkout"] >= firstWait.wallMs - SLACK_MS &&
      firstWait.byRelation["this-checkout"] === 0 &&
      text.indexOf(base) === -1,
  };
}

// Case C: `plan conditions --slow`'s sampler over three real fixture document
// gates whose first sample waits behind another checkout's holder process.
const HOLDER = `
const [registry, other, ready, hold] = process.argv.slice(1);
const { acquireHostLanes } = await import(${JSON.stringify(source("scripts/lib/host-lanes.mjs"))});
const { writeFileSync } = await import("node:fs");
const lease = await acquireHostLanes({ directory: registry, slots: 4, worktree: other, task: "sibling-review", parentLease: null, onWait() {} });
writeFileSync(ready, "ready");
await new Promise((done) => setTimeout(done, Number(hold)));
await lease.release();
`;
const CHILD = `
const [repo, registry, sampleId] = process.argv.slice(1);
const { runGate } = await import(${JSON.stringify(source("scripts/test-runner.mjs"))});
const quick = [process.execPath, "-e", "setTimeout(()=>{},20)"];
const row = await runGate(["--document", "--again"], repo, {
  hostDirectory: registry,
  planningSampleId: sampleId,
  table: [
    { name: "build", build: true, document: true, command: quick },
    { name: "docs-check", document: true, command: quick },
  ],
});
process.exitCode = row.exitCode;
`;

async function slowCondition() {
  const folder = join(base, "condition"),
    registry = join(folder, "host"),
    repo = join(folder, "repo"),
    other = join(folder, "other"),
    ready = join(folder, "holder-ready");
  mkdirSync(other, { recursive: true });
  fixtureRepo(repo);
  await acquireHostLaneCapacity({ directory: registry, capacity: 4 });
  const holder = spawn(
    process.execPath,
    ["--input-type=module", "-e", HOLDER, registry, other, ready, "2500"],
    { stdio: "ignore" },
  );
  const holderExit = new Promise((done) => holder.on("exit", done));
  for (let i = 0; i < 500 && !existsSync(ready); i++) await delay(10);
  const outputs = [];
  let samples;
  try {
    samples = measureDocumentGates(
      repo,
      { remaining: () => 120_000 },
      {
        readChecks: readGateChecks,
        run: (_root, args, timeout) => {
          const sampleId = args.at(-1);
          const child = spawnSync(
            process.execPath,
            ["--input-type=module", "-e", CHILD, repo, registry, sampleId],
            { cwd: repo, encoding: "utf8", timeout },
          );
          outputs.push(child.stdout + child.stderr);
          if (child.status !== 0)
            throw new Error(`child exit ${child.status}: ${child.stderr}`);
        },
      },
    );
  } finally {
    await holderExit;
    await stopGuard(registry);
  }
  const measurement = documentGateMeasurement(samples);
  const rows = readGateChecks(repo).filter(
    (row) => row.checkId === "npm run test:docs",
  );
  const text = JSON.stringify({ rows, outputs, samples });
  const executionMatches = samples.every(
    (sample) =>
      Math.abs(
        sample.executionS - (sample.wallS - sample.hostLaneWait.wallMs / 1000),
      ) < 1e-9,
  );
  return {
    holderReady: existsSync(ready),
    samples: samples.map((sample) => ({
      wallS: Number(sample.wallS.toFixed(3)),
      executionS: Number(sample.executionS?.toFixed(3)),
      contended: sample.contended,
      hostLaneWait: sample.hostLaneWait,
      unavailable: sample.unavailable,
    })),
    wallMedianS: Number(measurement.wallMedianS?.toFixed(3)),
    executionMedianS: Number(measurement.executionMedianS?.toFixed(3)),
    judgedFigure: measurement.judgedFigure,
    value: Number(measurement.value?.toFixed(3)),
    summaries: outputs.map((output) =>
      output.split("\n").find((line) => line.startsWith("npm run test:docs:")),
    ),
    pathLeaks: [base, folder, repo, other, registry].filter((path) =>
      text.includes(path),
    ).length,
    holds:
      samples.length === 3 &&
      samples[0].contended === true &&
      samples[0].hostLaneWait.byRelation["another-checkout"] >=
        samples[0].hostLaneWait.wallMs - SLACK_MS &&
      samples.slice(1).every((sample) => sample.contended === false) &&
      executionMatches &&
      measurement.value === measurement.executionMedianS &&
      text.indexOf(base) === -1,
  };
}

try {
  result.runnerStatic = await runnerStatic("ordinary");
  result.runnerOverlap = await runnerStatic("overlap");
  result.slowCondition = await slowCondition();
} finally {
  rmSync(base, { recursive: true, force: true });
}
console.log(JSON.stringify(result, null, 2));
process.exitCode = Object.values(result).every((row) => row.holds) ? 0 : 1;
