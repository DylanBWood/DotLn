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
import { suiteEnvironment, suiteInputHash } from "./lib/suite-evidence.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import { checkMeasurementSeries } from "./measure-gates.mjs";

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

test("reuse keys distinguish the declared load policy without transient peer or log identities", () => {
  const snapshot = {
    reusable: true,
    entries: [],
    context: "fixture",
    runtime: "fixture",
  };
  const task = {
    name: "kernel",
    command: ["fixture"],
    loadPolicy: { loadClass: "shared", concurrency: 4, version: 1 },
  };
  const first = suiteInputHash(task, snapshot);
  assert.equal(
    suiteInputHash(
      {
        ...task,
        gateContext: { peerFile: "different", deadlineLog: "different" },
      },
      snapshot,
    ),
    first,
  );
  assert.notEqual(
    suiteInputHash(
      { ...task, loadPolicy: { ...task.loadPolicy, concurrency: 1 } },
      snapshot,
    ),
    first,
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
