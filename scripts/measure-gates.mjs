#!/usr/bin/env node
import { json as prettyJson } from "./lib/helpers.mjs";
import { docPath, findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { availableParallelism, totalmem } from "node:os";
import { dirname, join, resolve } from "node:path";

import { readGateChecks } from "./lib/gate-evidence.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import { suites } from "./test-runner.mjs";
import { recordedHostLaneCapacity } from "./lib/host-resources.mjs";

const root = findLaunchpad();

// The package command is an alias; the runner records complete reviews under
// the canonical npm test id. Bound the lookup to this attempt's time window.
export function measurementGateForRun(checks, startedAt, finishedAt) {
  return checks
    .filter(
      (row) =>
        row.checkId === "npm test" &&
        row.gateSelection === "review" &&
        row.recordedAt >= startedAt &&
        row.recordedAt <= finishedAt,
    )
    .at(-1);
}

// Published measurements retain task observations, not temporary diagnostic
// paths or duplicate raw output. The original gate row and logs remain local.
export function measurementGate(gate) {
  if (!gate) return null;
  const omit = (row, keys) =>
    Object.fromEntries(
      Object.entries(row).filter(([key]) => !keys.includes(key)),
    );
  return {
    ...omit(gate, ["cases", "deadlineDiagnostics"]),
    taskTimeline: gate.taskTimeline.map((task) =>
      omit(task, [
        "productReadLog",
        "hostLaneWaitObservations",
        "output",
        "outputRef",
      ]),
    ),
  };
}

export function summarizeDeadlines(records) {
  const groups = new Map();
  for (const record of records) {
    const { site, task, timeoutMs, loadClass, concurrency, loadFactor } =
      record;
    const key = JSON.stringify({
      site,
      task,
      timeoutMs,
      loadClass,
      concurrency,
      loadFactor,
    });
    const group = groups.get(key) ?? {
      site,
      task,
      timeoutMs,
      loadClass,
      concurrency,
      loadFactor,
      durations: [],
      hits: 0,
      maxPeers: 0,
      maxHostLoadPerCpu: 0,
    };
    group.durations.push(record.durationMs);
    group.hits += Number(record.hit);
    group.maxPeers = Math.max(group.maxPeers, record.concurrentTasks.length);
    group.maxHostLoadPerCpu = Math.max(
      group.maxHostLoadPerCpu,
      record.hostLoadPerCpu,
    );
    groups.set(key, group);
  }
  return [...groups.values()]
    .map(({ durations, ...group }) => {
      durations.sort((a, b) => a - b);
      return {
        ...group,
        samples: durations.length,
        maxDurationMs: durations.at(-1),
        p95DurationMs: durations[Math.ceil(durations.length * 0.95) - 1],
      };
    })
    .sort(
      (a, b) => a.task.localeCompare(b.task) || a.site.localeCompare(b.site),
    );
}

export function checkMeasurementSeries(series) {
  assert.ok([1, 2].includes(series.schemaVersion));
  const current = series.schemaVersion === 2;
  assert.equal(series.command, "npm run test:full -- --fresh");
  assert.ok(
    ["shared", "isolated", ...(current ? ["overlap"] : [])].includes(
      series.configuration,
    ),
  );
  assert.equal(
    series.runs.length,
    current ? 3 : 5,
    current ? "three attempts are required" : "five attempts are required",
  );
  if (current) {
    assert.ok(
      Number.isInteger(series.host.laneCapacity) &&
        series.host.laneCapacity >= 1 &&
        series.host.laneCapacity <= 8,
    );
    assert.ok(
      Number.isFinite(series.host.physicalBytes) &&
        series.host.physicalBytes > 0,
    );
  }
  for (const [index, run] of series.runs.entries()) {
    assert.equal(run.ordinal, index + 1);
    assert.equal(run.processExitCode, 0);
    assert.equal(run.gate.exitCode, 0);
    assert.equal(run.gate.executionMode, "forced-fresh");
    assert.equal(run.gate.reusedSuites, 0);
    assert.ok(run.gate.freshSuites > 0);
    assert.ok(
      run.gate.taskTimeline.every((task) => task.executed && !task.reused),
    );
    assert.equal(
      new Set(run.gate.taskTimeline.map((task) => task.name)).size,
      run.gate.freshSuites,
    );
    assert.deepEqual(gateCriticalPath(run.gate), run.gate.criticalPath);
    assert.equal(
      run.gate.treeHash,
      series.runs[0].gate.treeHash,
      "measurement source must remain fixed",
    );
    if (current) {
      assert.equal(
        run.gate.codeIdentity,
        series.runs[0].gate.codeIdentity,
        "measurement code identity must remain fixed",
      );
      assert.equal(run.gate.loadClass.hostCapacity, series.host.laneCapacity);
      assert.equal(
        run.gate.memory.budgets.physicalBytes,
        series.host.physicalBytes,
      );
      assert.deepEqual(
        run.host,
        series.host,
        "measurement host must remain fixed",
      );
    }
    assert.deepEqual(
      run.gate.taskTimeline.map((task) => task.name).sort(),
      series.runs[0].gate.taskTimeline.map((task) => task.name).sort(),
    );
    for (const name of [
      "harness-fixtures",
      "process-debt",
      ...(current ? ["worktree-integration"] : []),
    ]) {
      const task = run.gate.taskTimeline.find((task) => task.name === name);
      const overlap =
        series.configuration === "overlap"
          ? Math.min(2, series.host.laneCapacity - 1)
          : 0;
      assert.equal(
        task?.loadClass,
        series.configuration === "overlap"
          ? overlap
            ? "shared"
            : "isolated"
          : series.configuration,
      );
      if (series.configuration === "overlap")
        assert.equal(task.peerCap, overlap);
      else if (series.configuration === "shared") assert.ok(task.peerCap > 0);
      else assert.equal(task.peerCap, 0);
    }
    if (index) assert.ok(run.startedAt >= series.runs[index - 1].finishedAt);
    for (const task of run.gate.taskTimeline) {
      assert.ok(task.concurrentAtStart.length <= task.peerCap);
      assert.ok(Date.parse(task.finishedAt) >= Date.parse(task.startedAt));
      if (current) {
        assert.ok(
          Number.isFinite(task.peakRssBytes) && task.peakRssBytes >= 0,
          `${task.name}: missing peak RSS`,
        );
        assert.equal(task.hostCapacity, series.host.laneCapacity);
        assert.ok(
          Number.isSafeInteger(task.slotCapacity) &&
            task.slotCapacity >= 1 &&
            task.slotCapacity <= series.host.laneCapacity,
        );
        assert.ok(Number.isFinite(task.timeoutMs) && task.timeoutMs > 0);
        assert.ok(
          !task.timedOut && task.failureKind !== "timeout",
          `${task.name}: task ended at its deadline`,
        );
        assert.ok(
          task.durationMs < task.timeoutMs,
          `${task.name}: task reached its deadline`,
        );
        const deadline = run.deadlines.find(
          (row) => row.site === `suite:${task.name}` && row.task === task.name,
        );
        assert.ok(
          deadline && deadline.samples >= 1 && deadline.hits === 0,
          `${task.name}: missing or hit task deadline`,
        );
      }
    }
  }
  return {
    runs: series.runs.length,
    durationsMs: series.runs.map((run) => run.gate.durationMs),
    allPassedFirstTime: true,
  };
}

function measure(output) {
  assert.equal(
    realpathSync(process.cwd()),
    realpathSync(root),
    "run from the worktree root",
  );
  assert.ok(
    output.startsWith(`${docPath(root, "evidence")}/`),
    "measurement output must be evidence in this worktree",
  );
  assert.ok(
    !existsSync(output),
    "retain previous attempts; choose a new series file",
  );
  const series = {
    schemaVersion: 2,
    command: "npm run test:full -- --fresh",
    host: {
      platform: process.platform,
      arch: process.arch,
      cpus: availableParallelism(),
      physicalBytes: totalmem(),
      laneCapacity: recordedHostLaneCapacity(),
      node: process.version,
    },
    execution: "unknown",
    configuration: suites
      .filter((row) =>
        ["harness-fixtures", "process-debt", "worktree-integration"].includes(
          row.name,
        ),
      )
      .every((row) => row.exclusive && row.overlap === 2)
      ? "overlap"
      : suites
            .filter((row) =>
              ["harness-fixtures", "process-debt"].includes(row.name),
            )
            .every((row) => row.exclusive || row.loadClass === "isolated")
        ? "isolated"
        : "shared",
    runs: [],
  };
  const local = docPath(root, "control", "local/gate-series", `${Date.now()}`);
  mkdirSync(local, { recursive: true });
  mkdirSync(dirname(output), { recursive: true });
  for (let ordinal = 1; ordinal <= 3; ordinal++) {
    const startedAt = new Date().toISOString();
    console.log(`Fresh full gate ${ordinal}/3 started at ${startedAt}`);
    const log = join(local, `${ordinal}.log`);
    const fd = openSync(log, "wx", 0o600);
    let processExitCode;
    try {
      const run = spawnSync("npm", ["run", "test:full", "--", "--fresh"], {
        cwd: root,
        env: { ...process.env, DOTLN_GATE_MEASURE_DEADLINES: "1" },
        stdio: ["ignore", fd, fd],
      });
      processExitCode = run.status ?? 1;
    } finally {
      closeSync(fd);
    }
    const finishedAt = new Date().toISOString();
    const gate = measurementGateForRun(
      readGateChecks(root),
      startedAt,
      finishedAt,
    );
    const records = gate?.deadlineDiagnostics ?? [];
    series.runs.push({
      ordinal,
      startedAt,
      finishedAt,
      processExitCode,
      host: {
        platform: process.platform,
        arch: process.arch,
        cpus: availableParallelism(),
        physicalBytes: totalmem(),
        laneCapacity: recordedHostLaneCapacity(),
        node: process.version,
      },
      gate: measurementGate(gate),
      deadlines: summarizeDeadlines(records),
    });
    // Preserve every attempt locally without changing gate inputs between runs.
    writeFileSync(join(local, "series.json"), prettyJson(series));
    console.log(
      `Fresh full gate ${ordinal}/3: exit ${processExitCode}; ${gate?.durationMs ?? "unknown"} ms; ${gate?.freshSuites ?? 0} fresh / ${gate?.reusedSuites ?? 0} reused tasks`,
    );
    if (processExitCode !== 0 || gate?.exitCode !== 0) {
      console.error(
        "Measurement stopped at the first failure. Diagnose the retained attempt before another series.",
      );
      writeFileSync(output, prettyJson(series), {
        flag: "wx",
      });
      process.exitCode = 1;
      return;
    }
  }
  writeFileSync(output, prettyJson(series), { flag: "wx" });
  console.log(JSON.stringify(checkMeasurementSeries(series)));
}

if (isMainModule(import.meta.url)) {
  try {
    const [mode, file, ...extra] = process.argv.slice(2);
    if (extra.length || !["--run", "--check"].includes(mode) || !file)
      throw new Error(
        "usage: measure-gates --run|--check docs/evidence/WO-NNN/<series>.json",
      );
    if (mode === "--check")
      console.log(
        JSON.stringify(
          checkMeasurementSeries(
            JSON.parse(readFileSync(resolve(file), "utf8")),
          ),
        ),
      );
    else measure(resolve(file));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
