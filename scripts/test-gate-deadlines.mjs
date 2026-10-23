import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import {
  deadlineLimit,
  gateLoad,
  observedSpawn,
  observedSpawnSync,
  startDeadline,
} from "../packages/skeleton/src/gate-deadlines.mjs";
import { executeSuite, scheduleSuites } from "./test-runner.mjs";
import { suiteEnvironment } from "./lib/suite-evidence.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import { checkMeasurementSeries, measurementGate } from "./measure-gates.mjs";

const shared = {
  DOTLN_GATE_LOAD_CLASS: "shared",
  DOTLN_GATE_CONCURRENCY: "4",
  DOTLN_GATE_LOAD_FACTOR: "8",
  DOTLN_GATE_TASK: "slow-double",
};
const root = new URL("../", import.meta.url).pathname;
const directory = (t) => {
  const path = mkdtempSync(join(tmpdir(), "dotln-deadlines-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
};

test("the scheduler declaration derives finite bounds and refuses an unbounded class", () => {
  assert.equal(deadlineLimit(17_200, 60_000, {}), 60_000);
  assert.equal(deadlineLimit(17_200, 60_000, shared), 137_600);
  assert.throws(() => deadlineLimit(Infinity, 100, shared), /finite/);
  assert.throws(
    () => gateLoad({ ...shared, DOTLN_GATE_LOAD_FACTOR: "Infinity" }),
    /Invalid scheduler/,
  );
  assert.throws(
    () => gateLoad({ ...shared, DOTLN_GATE_CONCURRENCY: "5" }),
    /Invalid scheduler/,
  );
  const env = suiteEnvironment(
    {},
    { task: "fixture", loadClass: "isolated", concurrency: 1, loadFactor: 2 },
  );
  assert.deepEqual(gateLoad(env), {
    name: "isolated",
    concurrency: 1,
    factor: 2,
  });
  assert.equal(env.NODE_OPTIONS, undefined);
});

test("a slow barrier double survives simulated load and a hit reads current peers", (t) => {
  const dir = directory(t);
  const peerFile = join(dir, "peers.json"),
    log = join(dir, "deadlines.jsonl");
  const env = {
    ...shared,
    DOTLN_GATE_PEER_FILE: peerFile,
    DOTLN_GATE_DEADLINE_LOG: log,
  };
  writeFileSync(
    peerFile,
    JSON.stringify({ tasks: ["slow-double", "early-peer"] }),
  );
  let time = 0;
  const deadline = startDeadline(
    "fixture:barrier",
    deadlineLimit(100, 100, env),
    { env, now: () => time },
  );
  time = 700;
  deadline.check();
  writeFileSync(
    peerFile,
    JSON.stringify({ tasks: ["slow-double", "later-peer"] }),
  );
  time = 801;
  assert.throws(() => deadline.check(), /fixture:barrier.*801/);
  const [record] = readFileSync(log, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(record.timeoutMs, 800);
  assert.equal(record.durationMs, 801);
  assert.deepEqual(record.concurrentTasks, ["later-peer"]);
  assert.equal(record.peerObservation, "scheduler-current");
  assert.equal(record.hit, true);
  assert.equal(record.loadClass, "shared");
  assert.ok(!JSON.stringify(record).includes(dir));
});

test("a slow subprocess double passes the derived bound and a hung process retains its diagnostic", async (t) => {
  const dir = directory(t);
  const log = join(dir, "deadlines.jsonl"),
    peerFile = join(dir, "peers.json");
  writeFileSync(
    peerFile,
    JSON.stringify({ tasks: ["slow-double", "busy-peer"] }),
  );
  const context = {
    task: "slow-double",
    loadClass: "shared",
    concurrency: 4,
    loadFactor: 8,
    peerFile,
    deadlineLog: log,
  };
  const slow = await executeSuite(
    {
      name: "slow-double",
      command: [process.execPath, "-e", "setTimeout(() => {}, 300)"],
      gateContext: context,
    },
    root,
    deadlineLimit(250, 250, shared),
  );
  assert.equal(slow.exitCode, 0, slow.output);
  assert.ok(slow.durationMs >= 250);
  const hung = await executeSuite(
    {
      name: "slow-double",
      command: [
        process.execPath,
        "-e",
        "process.on('SIGTERM', () => process.exit(0)); setInterval(() => {}, 1000)",
      ],
      gateContext: context,
    },
    root,
    500,
  );
  assert.notEqual(
    hung.exitCode,
    0,
    "a timeout remains a failure even if the child exits zero on SIGTERM",
  );
  const records = readFileSync(log, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse)
    .filter((row) => row.hit);
  assert.equal(records.length, 1);
  assert.equal(records[0].site, "suite:slow-double");
  assert.deepEqual(records[0].concurrentTasks, ["busy-peer"]);
  assert.ok(records[0].durationMs >= 500);
});

test("async process timeout is distinguished from an ordinary caller kill", async () => {
  const child = observedSpawn(
    process.execPath,
    ["-e", "setInterval(() => {}, 1000)"],
    { timeout: 50, stdio: "ignore" },
  );
  const [code, signal] = await once(child, "close");
  assert.equal(code, null);
  assert.equal(signal, "SIGTERM");
});

test("the synchronous subprocess boundary preserves timeout failure", () => {
  const result = observedSpawnSync(
    process.execPath,
    ["-e", "setInterval(() => {}, 1000)"],
    { timeout: 50, stdio: "ignore" },
  );
  assert.equal(result.error?.code, "ETIMEDOUT");
  assert.notEqual(result.status, 0);
});

test("measurement acceptance rejects reuse, source drift and an incomplete consecutive series", () => {
  const timeline = [
    {
      name: "build",
      start: 0,
      end: 10,
      predecessors: [],
      concurrentAtStart: [],
      loadClass: "isolated",
      peerCap: 0,
    },
    {
      name: "harness-fixtures",
      start: 10,
      end: 40,
      predecessors: ["build"],
      concurrentAtStart: [],
      loadClass: "shared",
      peerCap: 3,
    },
    {
      name: "process-debt",
      start: 10,
      end: 20,
      predecessors: ["build"],
      concurrentAtStart: ["harness-fixtures"],
      loadClass: "shared",
      peerCap: 3,
    },
  ].map(({ start, end, ...row }) => ({
    ...row,
    startedAt: new Date(start).toISOString(),
    finishedAt: new Date(end).toISOString(),
    executed: true,
    reused: false,
  }));
  const gate = {
    exitCode: 0,
    executionMode: "forced-fresh",
    reusedSuites: 0,
    freshSuites: 3,
    treeHash: "fixture",
    taskTimeline: timeline,
    criticalPath: gateCriticalPath(timeline),
    durationMs: 40,
  };
  const series = {
    schemaVersion: 1,
    command: "npm run test:full -- --fresh",
    configuration: "shared",
    runs: Array.from({ length: 5 }, (_, index) => ({
      ordinal: index + 1,
      startedAt: new Date(index * 100).toISOString(),
      finishedAt: new Date(index * 100 + 40).toISOString(),
      processExitCode: 0,
      gate: structuredClone(gate),
    })),
  };
  assert.equal(checkMeasurementSeries(series).allPassedFirstTime, true);
  const reused = structuredClone(series);
  reused.runs[2].gate.taskTimeline[1].reused = true;
  assert.throws(() => checkMeasurementSeries(reused));
  const drift = structuredClone(series);
  drift.runs[2].gate.treeHash = "changed";
  assert.throws(
    () => checkMeasurementSeries(drift),
    /source must remain fixed/,
  );
  assert.throws(
    () => checkMeasurementSeries({ ...series, runs: series.runs.slice(1) }),
    /five attempts/,
  );
});

test("one recorded timeline carries peers and computes its observed scheduling critical path offline", async () => {
  const rows = await scheduleSuites(
    [
      { name: "build", build: true, command: ["fixture"] },
      { name: "a", command: ["fixture"], group: "one" },
      { name: "b", command: ["fixture"], group: "one" },
      { name: "c", command: ["fixture"] },
      {
        name: "join",
        command: ["fixture"],
        loadClass: "isolated",
        after: ["b", "c"],
      },
    ],
    {
      parallelism: 16,
      concurrency: 2,
      execute: async (row) => {
        await new Promise((done) =>
          setTimeout(done, row.name === "c" ? 40 : 10),
        );
        return { name: row.name, executed: true, exitCode: 0 };
      },
    },
  );
  const recorded = JSON.parse(JSON.stringify({ taskTimeline: rows }));
  const byName = new Map(rows.map((row) => [row.name, row]));
  assert.deepEqual(byName.get("a").concurrentAtStart, []);
  assert.deepEqual(byName.get("c").concurrentAtStart, ["a"]);
  assert.deepEqual(byName.get("b").concurrentAtStart, ["c"]);
  assert.deepEqual(byName.get("join").concurrentAtStart, []);
  const critical = gateCriticalPath(recorded);
  assert.equal(critical.tasks[0], "build");
  assert.equal(critical.tasks.at(-1), "join");
  assert.ok(critical.tasks.includes("c"));
  assert.equal(critical.durationMs, critical.workMs + critical.waitMs);
  assert.equal(
    critical.durationMs,
    Date.parse(byName.get("join").finishedAt) -
      Date.parse(byName.get("build").startedAt),
  );
  assert.throws(
    () => gateCriticalPath([{ ...rows[0], predecessors: ["missing"] }]),
    /Missing timeline/,
  );
});

test("a group member skipped for a failed dependency is never a timeline edge", async () => {
  const rows = await scheduleSuites(
    [
      { name: "build", build: true, command: ["fixture"] },
      { name: "pre", command: ["fixture"] },
      { name: "c", command: ["fixture"], group: "g" },
      { name: "b", command: ["fixture"], group: "g" },
      { name: "a", command: ["fixture"], group: "g", after: ["pre"] },
      { name: "d", command: ["fixture"] },
    ],
    {
      concurrency: 1,
      keepGoing: true,
      execute: async (row) => {
        await new Promise((done) => setTimeout(done, 5));
        return {
          name: row.name,
          executed: true,
          exitCode: row.name === "pre" ? 1 : 0,
        };
      },
    },
  );
  const byName = new Map(rows.map((row) => [row.name, row]));
  assert.equal(byName.get("a").executed, false);
  assert.equal(byName.get("a").startedAt, undefined);
  assert.ok(!byName.get("c").predecessors.includes("a"));
  assert.ok(!byName.get("b").predecessors.includes("a"));
  const started = rows.filter((row) => row.startedAt);
  assert.equal(started.length, 5);
  assert.deepEqual(gateCriticalPath(started).tasks, [
    "build",
    "pre",
    "c",
    "b",
    "d",
  ]);
});

test("declared overlap keeps the factor of two per peer and the recorded capacity ceiling", () => {
  const overlap = {
    ...shared,
    DOTLN_GATE_CAPACITY: "8",
    DOTLN_GATE_CONCURRENCY: "3",
    DOTLN_GATE_LOAD_FACTOR: "6",
  };
  assert.deepEqual(gateLoad(overlap), {
    name: "shared",
    concurrency: 3,
    factor: 6,
  });
  assert.equal(deadlineLimit(100, 100, overlap), 600);
  assert.deepEqual(
    gateLoad({
      ...overlap,
      DOTLN_GATE_CONCURRENCY: "8",
      DOTLN_GATE_LOAD_FACTOR: "16",
    }),
    { name: "shared", concurrency: 8, factor: 16 },
  );
  assert.throws(
    () => gateLoad({ ...overlap, DOTLN_GATE_CAPACITY: "2" }),
    /Invalid scheduler/,
  );
  assert.throws(
    () =>
      gateLoad({
        ...overlap,
        DOTLN_GATE_CONCURRENCY: "9",
        DOTLN_GATE_LOAD_FACTOR: "18",
      }),
    /Invalid scheduler/,
  );
  assert.throws(
    () => gateLoad({ ...overlap, DOTLN_GATE_LOAD_CLASS: "isolated" }),
    /Invalid scheduler/,
  );
  const env = suiteEnvironment(
    {},
    {
      task: "exclusive",
      loadClass: "shared",
      concurrency: 3,
      loadFactor: 6,
      slotCapacity: 6,
      hostCapacity: 8,
    },
  );
  assert.equal(env.DOTLN_GATE_CAPACITY, "8");
  assert.deepEqual(gateLoad(env), {
    name: "shared",
    concurrency: 3,
    factor: 6,
  });
});

test("three-run measurement requires capacity, task RSS, peers and successful task deadlines", () => {
  const host = {
    platform: "fixture",
    arch: "fixture",
    cpus: 16,
    physicalBytes: 16 * 2 ** 30,
    laneCapacity: 8,
    node: "fixture",
  };
  const names = [
    "build",
    "harness-fixtures",
    "process-debt",
    "worktree-integration",
  ];
  const timeline = names.map((name, index) => ({
    name,
    startedAt: new Date(index * 10).toISOString(),
    finishedAt: new Date((index + 1) * 10).toISOString(),
    durationMs: 10,
    timeoutMs: 900_000,
    executed: true,
    reused: false,
    predecessors: index ? [names[index - 1]] : [],
    concurrentAtStart: [],
    loadClass: index ? "shared" : "isolated",
    peerCap: index ? 2 : 0,
    hostCapacity: 8,
    slotCapacity: 8,
    peakRssBytes: 1234,
  }));
  const gate = {
    exitCode: 0,
    executionMode: "forced-fresh",
    reusedSuites: 0,
    freshSuites: 4,
    treeHash: "fixture",
    codeIdentity: "fixture",
    durationMs: 40,
    taskTimeline: timeline,
    criticalPath: gateCriticalPath(timeline),
    loadClass: { hostCapacity: 8 },
    memory: { budgets: { physicalBytes: host.physicalBytes } },
  };
  assert.deepEqual(
    measurementGate({
      ...gate,
      cases: [{ productReadLog: "/synthetic-private/case" }],
      deadlineDiagnostics: [{ site: "fixture" }],
      taskTimeline: timeline.map((task) => ({
        ...task,
        productReadLog: "/synthetic-private/task",
        hostLaneWaitObservations: [{ holders: ["/synthetic-private/clone"] }],
        output: "fixture diagnostic text",
        outputRef: "/synthetic-private/log",
      })),
    }),
    gate,
  );
  assert.equal(measurementGate(undefined), null);
  const series = {
    schemaVersion: 2,
    command: "npm run test:full -- --fresh",
    configuration: "overlap",
    host,
    runs: Array.from({ length: 3 }, (_, index) => ({
      ordinal: index + 1,
      startedAt: new Date(index * 100).toISOString(),
      finishedAt: new Date(index * 100 + 40).toISOString(),
      processExitCode: 0,
      host: structuredClone(host),
      gate: structuredClone(gate),
      deadlines: names.map((task) => ({
        task,
        site: `suite:${task}`,
        hits: 0,
        samples: 1,
      })),
    })),
  };
  assert.equal(checkMeasurementSeries(series).runs, 3);
  for (const mutate of [
    (copy) => {
      delete copy.runs[0].gate.taskTimeline[1].peakRssBytes;
    },
    (copy) => {
      copy.runs[1].gate.taskTimeline[1].hostCapacity = 4;
    },
    (copy) => {
      copy.runs[1].gate.taskTimeline[1].concurrentAtStart = ["a", "b", "c"];
    },
    (copy) => {
      copy.runs[2].deadlines[1].hits = 1;
    },
    (copy) => {
      copy.runs[2].gate.taskTimeline[1].timedOut = true;
    },
    (copy) => {
      copy.runs[2].host.cpus = 8;
    },
    (copy) => {
      copy.runs[2].gate.codeIdentity = "changed";
    },
  ]) {
    const copy = structuredClone(series);
    mutate(copy);
    assert.throws(() => checkMeasurementSeries(copy));
  }
  assert.throws(
    () => checkMeasurementSeries({ ...series, runs: series.runs.slice(1) }),
    /three attempts/,
  );
});

test("lane wait unions overlapping tasks, attributes relation changes and separates timeline gaps", async () => {
  const { gateHostLaneWait, formatHostLaneWait } =
    await import("./lib/gate-timeline.mjs");
  const at = (ms) => new Date(ms).toISOString();
  const holder = (relation) => ({
    task: "fixture",
    slots: 2,
    relation,
    nested: false,
    worktree: "/private/fixture",
    file: "/private/registry",
  });
  const rows = [
    {
      name: "a",
      startedAt: at(0),
      finishedAt: at(1200),
      durationMs: 200,
      hostLaneWaitMs: 1000,
      hostLaneWaitObservations: [
        { observedAt: at(0), holders: [holder("another-checkout")] },
        { observedAt: at(700), phase: "lock", holders: [] },
      ],
    },
    {
      name: "b",
      startedAt: at(500),
      finishedAt: at(1700),
      durationMs: 200,
      hostLaneWaitMs: 1000,
      hostLaneWaitObservations: [
        { observedAt: at(500), holders: [holder("this-checkout")] },
      ],
    },
    {
      name: "join",
      startedAt: at(1900),
      finishedAt: at(2100),
      durationMs: 100,
      hostLaneWaitMs: 50,
      predecessors: ["a", "b"],
    },
    { name: "reused", reused: true, startedAt: at(0), hostLaneWaitMs: 99999 },
  ];
  const wait = gateHostLaneWait(rows);
  assert.equal(wait.wallMs, 1550);
  assert.deepEqual(wait.byRelation, {
    "this-checkout": 1000,
    "another-checkout": 700,
    unknown: 350,
  });
  assert.equal(wait.holders.length, 2);
  assert.ok(!JSON.stringify(wait).includes("/private/"));
  assert.match(
    formatHostLaneWait(wait),
    /1.6 s waiting for host lanes.*0.7 s behind another checkout/,
  );
  const critical = gateCriticalPath(rows);
  assert.equal(critical.waitMs, critical.laneWaitMs + critical.gapMs);
  assert.equal(critical.laneWaitMs, 1050);
  assert.equal(critical.gapMs, 750);
  assert.deepEqual(gateCriticalPath([]), {
    tasks: [],
    durationMs: 0,
    workMs: 0,
    waitMs: 0,
    laneWaitMs: 0,
    gapMs: 0,
  });
});

test("measured structural requests let a sibling document gate progress beside complete work", async (t) => {
  const { runGate, suites, STRUCTURAL_TASKS, structuralHostSlots } =
    await import("./test-runner.mjs");
  const { acquireHostLaneCapacity } = await import("./lib/host-lanes.mjs");
  const { delay, processAlive, readHostSnapshot } =
    await import("./lib/host-resources.mjs");
  const { mkdirSync, existsSync } = await import("node:fs");
  const { runGit } = await import("./lib/git.mjs");
  const base = directory(t),
    comparisons = [];
  for (const sizing of ["full-capacity", "measured"]) {
    const folder = join(base, sizing),
      registry = join(folder, "host");
    const completeRepo = join(folder, "complete"),
      documentRepo = join(folder, "document");
    for (const repo of [completeRepo, documentRepo]) {
      mkdirSync(repo, { recursive: true });
      runGit(repo, ["init", "-q", "-b", "main"]);
      writeFileSync(join(repo, "README.md"), "Fixture\n");
      runGit(repo, ["add", "."]);
      runGit(repo, [
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
      ]);
    }
    await acquireHostLaneCapacity({ directory: registry, capacity: 8 });
    const marker = join(folder, "early-peer-finished");
    const command = (ms, code = "", finish = "") => [
      process.execPath,
      "-e",
      `${code};setTimeout(()=>{${finish}},${ms})`,
    ];
    const table = [
      {
        name: "build",
        build: true,
        product: true,
        command: command(20),
        outputs: [],
      },
      {
        name: "long",
        product: true,
        loadSlots: 2,
        command: command(3000),
      },
      ...Array.from({ length: 10 }, (_, index) => ({
        name: `peer-${index}`,
        product: true,
        loadSlots: 2,
        group: "peers",
        groupLimit: 2,
        command: command(
          900 + 137 * index,
          "",
          index === 0
            ? `require('node:fs').writeFileSync(${JSON.stringify(marker)},'ready')`
            : "",
        ),
      })),
    ];
    const complete = runGate(["--review", "--again"], completeRepo, {
      table,
      hostDirectory: registry,
    });
    complete.catch(() => {});
    let doc, full;
    try {
      for (let i = 0; i < 500 && !existsSync(marker); i++) await delay(10);
      assert.ok(
        existsSync(marker),
        "complete gate has begun admitting its staggered peers",
      );
      const documentTable = [
        {
          name: "kit-verify",
          build: true,
          document: true,
          command: command(250),
          hostSlots:
            sizing === "measured" ? structuralHostSlots["kit-verify"] : 8,
        },
        ...STRUCTURAL_TASKS.map((name) => ({
          ...suites.find((row) => row.name === name),
          args: [],
          command: command(250),
          needsBuild: false,
          document: true,
          hostSlots:
            sizing === "measured"
              ? suites.find((row) => row.name === name).hostSlots
              : 8,
        })),
      ];
      doc = await runGate(["--document", "--again"], documentRepo, {
        table: documentTable,
        hostDirectory: registry,
      });
      full = await complete;
      assert.equal(doc.exitCode, 0, doc.output);
      assert.equal(full.exitCode, 0, full.output);
      assert.ok(full.taskTimeline.every((row) => row.executed));
      const longest = Math.max(
        ...full.taskTimeline.map((row) => row.durationMs),
      );
      const admittedAt = (row) =>
        Date.parse(row.startedAt) + (row.hostLaneWaitMs ?? 0);
      const lastDocumentAdmission = Math.max(
        ...doc.taskTimeline.map(admittedAt),
      );
      const laterCompleteAdmissions = full.taskTimeline.filter(
        (row) =>
          row.name.startsWith("peer-") &&
          admittedAt(row) > lastDocumentAdmission,
      ).length;
      comparisons.push({
        sizing,
        documentWallMs: doc.durationMs,
        documentLaneWaitMs: doc.hostLaneWait.wallMs,
        longestCompleteTaskMs: longest,
        completeWallMs: full.durationMs,
        laterCompleteAdmissions,
      });
      if (sizing === "measured") {
        assert.ok(
          doc.hostLaneWait.wallMs < longest,
          JSON.stringify(comparisons),
        );
        assert.ok(
          laterCompleteAdmissions > 0,
          "complete gate admits more peers after the document gate's last admission",
        );
        for (const row of doc.taskTimeline) {
          assert.equal(row.reservedSlots, 8);
          assert.equal(row.hostLaneSlots, structuralHostSlots[row.name] ?? 8);
        }
      }
    } finally {
      await complete;
      const guardFile = join(registry, "guard.json");
      if (existsSync(guardFile)) {
        const guard = JSON.parse(readFileSync(guardFile));
        if (
          processAlive(guard, readHostSnapshot({ footprint: false }).processes)
        )
          process.kill(guard.pid, "SIGTERM");
        for (let i = 0; i < 100 && existsSync(guardFile); i++) await delay(20);
      }
    }
  }
  assert.ok(
    comparisons[0].documentLaneWaitMs > comparisons[1].documentLaneWaitMs + 500,
    JSON.stringify(comparisons),
  );
  assert.ok(
    comparisons[0].documentLaneWaitMs >= comparisons[0].longestCompleteTaskMs,
    "the full-capacity control fails the bounded-wait property",
  );
  console.log(`STRUCTURAL_LANE_COMPARISON ${JSON.stringify(comparisons)}`);
});

test("lane attribution keeps alternating and mixed relations beyond 32 changes and clips a late join", async () => {
  const { recordLaneWait } = await import("./lib/host-lanes.mjs");
  const { gateHostLaneWait } = await import("./lib/gate-timeline.mjs");
  const at = (ms) => new Date(ms).toISOString();
  const observations = [],
    segments = [];
  for (let i = 0; i < 80; i++) {
    const relations =
      i % 4 === 0
        ? ["this-checkout"]
        : i % 4 === 1
          ? ["another-checkout"]
          : i % 4 === 2
            ? ["another-checkout", "this-checkout"]
            : [];
    recordLaneWait(observations, segments, {
      observedAt: at(10 + i * 10),
      phase: relations.length ? "capacity" : "lock",
      holders: relations.map((relation) => ({
        relation,
        task: `holder-${i}`,
        slots: 1,
      })),
    });
  }
  assert.equal(observations.length, 32);
  assert.equal(segments.length, 80);
  const task = {
    startedAt: at(0),
    hostLaneWaitMs: 810,
    hostLaneWaitObservations: observations,
    hostLaneWaitRelations: segments,
  };
  assert.deepEqual(gateHostLaneWait([task]).byRelation, {
    "this-checkout": 400,
    "another-checkout": 400,
    unknown: 210,
  });
  // A peer can join an already waiting overlap reservation after its first
  // relation observation. Only the portion inside the peer's wait counts.
  assert.deepEqual(
    gateHostLaneWait([
      {
        startedAt: at(25),
        hostLaneWaitMs: 20,
        hostLaneWaitRelations: segments,
      },
    ]).byRelation,
    { "this-checkout": 10, "another-checkout": 15, unknown: 5 },
  );
});

test("lane wait summary omits zero-rounded totals and relation parts without changing evidence", async () => {
  const { formatHostLaneWait } = await import("./lib/gate-timeline.mjs");
  const wait = {
    wallMs: 45,
    byRelation: { "this-checkout": 0, "another-checkout": 0, unknown: 45 },
    holders: [],
  };
  const before = structuredClone(wait);
  assert.equal(formatHostLaneWait(wait), "");
  assert.deepEqual(wait, before);
  assert.equal(
    formatHostLaneWait({
      wallMs: 1050,
      byRelation: {
        "this-checkout": 10,
        "another-checkout": 1000,
        unknown: 40,
      },
    }),
    "; 1.1 s waiting for host lanes (1.0 s behind another checkout)",
  );
  assert.equal(
    formatHostLaneWait({
      wallMs: 60,
      byRelation: { "this-checkout": 20, "another-checkout": 20, unknown: 20 },
    }),
    "; 0.1 s waiting for host lanes",
  );
});

test("lane attribution ends an overlap reservation wait before later child admissions", async () => {
  const { gateHostLaneWait } = await import("./lib/gate-timeline.mjs");
  const delay = (ms) => new Promise((done) => setTimeout(done, ms));
  const lightTasks = new Set(["light-a", "light-b", "light-c"]);
  const rows = await scheduleSuites(
    [
      { name: "build", build: true, command: ["fixture"] },
      {
        name: "exclusive",
        exclusive: true,
        overlap: 2,
        priority: 200,
        command: ["fixture"],
      },
      ...[...lightTasks].map((name) => ({ name, command: ["fixture"] })),
    ],
    {
      parallelism: 16,
      lightTasks,
      hostLanes: {
        directory: "fixture",
        capacity: 8,
        parentLease: null,
        onWait() {},
      },
      acquireLanes: async (options) => {
        if (options.task.endsWith(":overlap")) {
          for (let i = 0; i < 40; i++) {
            options.onWait([], {
              observedAt: new Date().toISOString(),
              phase: "capacity",
              holders: [
                {
                  task: `sibling-${i}`,
                  slots: 8,
                  relation: "another-checkout",
                },
              ],
            });
            await delay(2);
          }
        } else if (lightTasks.has(options.task)) await delay(25);
        return {
          record: { slots: options.slots },
          waitObservations: [],
          async release() {},
        };
      },
      execute: async (row) => {
        if (row.name === "exclusive") await delay(200);
        else if (lightTasks.has(row.name)) await delay(20);
        return { name: row.name, executed: true, exitCode: 0, durationMs: 0 };
      },
    },
  );
  assert.ok(rows.every((row) => row.exitCode === 0));
  const first = rows.find((row) => row.name === "light-a");
  const late = rows.find((row) => row.name === "light-c");
  assert.ok(gateHostLaneWait([first]).byRelation["another-checkout"] > 0);
  assert.ok(gateHostLaneWait([first]).byRelation.unknown >= 20);
  assert.equal(gateHostLaneWait([late]).byRelation["another-checkout"], 0);
  assert.ok(gateHostLaneWait([late]).byRelation.unknown >= 20);
});
