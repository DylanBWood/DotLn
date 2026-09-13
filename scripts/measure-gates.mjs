#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { availableParallelism } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readGateChecks } from "./lib/gate-evidence.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import { suites } from "./test-runner.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
  assert.equal(series.schemaVersion, 1);
  assert.equal(series.command, "npm run test:full -- --fresh");
  assert.ok(["shared", "isolated"].includes(series.configuration));
  assert.equal(series.runs.length, 5, "five attempts are required");
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
    assert.deepEqual(
      run.gate.taskTimeline.map((task) => task.name).sort(),
      series.runs[0].gate.taskTimeline.map((task) => task.name).sort(),
    );
    for (const name of ["harness-fixtures", "process-debt"]) {
      const task = run.gate.taskTimeline.find((task) => task.name === name);
      assert.equal(task?.loadClass, series.configuration);
      if (series.configuration === "shared") assert.ok(task.peerCap > 0);
      else assert.equal(task.peerCap, 0);
    }
    if (index) assert.ok(run.startedAt >= series.runs[index - 1].finishedAt);
    for (const task of run.gate.taskTimeline) {
      assert.ok(task.concurrentAtStart.length <= task.peerCap);
      assert.ok(Date.parse(task.finishedAt) >= Date.parse(task.startedAt));
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
    output.startsWith(join(root, "docs/evidence/")),
    "measurement output must be evidence in this worktree",
  );
  assert.ok(
    !existsSync(output),
    "retain previous attempts; choose a new series file",
  );
  const series = {
    schemaVersion: 1,
    command: "npm run test:full -- --fresh",
    host: {
      platform: process.platform,
      arch: process.arch,
      cpus: availableParallelism(),
      node: process.version,
    },
    execution:
      "operator-authorized host execution outside the sandbox; actor-attested",
    configuration: suites
      .filter((row) => ["harness-fixtures", "process-debt"].includes(row.name))
      .every((row) => row.exclusive || row.loadClass === "isolated")
      ? "isolated"
      : "shared",
    runs: [],
  };
  const local = join(root, "docs/control/local/wo128-series", `${Date.now()}`);
  mkdirSync(local, { recursive: true });
  mkdirSync(dirname(output), { recursive: true });
  const diagnosticRoot = join(root, "docs/control/local/harness/deadlines");
  for (let ordinal = 1; ordinal <= 5; ordinal++) {
    const previousLogs = new Set(
      existsSync(diagnosticRoot) ? readdirSync(diagnosticRoot) : [],
    );
    const startedAt = new Date().toISOString();
    console.log(`Fresh full gate ${ordinal}/5 started at ${startedAt}`);
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
    const gate = readGateChecks(root)
      .filter(
        (row) =>
          row.checkId === "npm run test:full" && row.recordedAt >= startedAt,
      )
      .at(-1);
    const records = (
      existsSync(diagnosticRoot) ? readdirSync(diagnosticRoot) : []
    )
      .filter((name) => !previousLogs.has(name))
      .flatMap((name) => {
        const path = join(diagnosticRoot, name, "deadlines.jsonl");
        return existsSync(path)
          ? readFileSync(path, "utf8")
              .trim()
              .split("\n")
              .filter(Boolean)
              .map(JSON.parse)
          : [];
      });
    series.runs.push({
      ordinal,
      startedAt,
      finishedAt,
      processExitCode,
      gate: gate ?? null,
      deadlines: summarizeDeadlines(records),
    });
    // Preserve every attempt locally without changing gate inputs between runs.
    writeFileSync(
      join(local, "series.json"),
      JSON.stringify(series, null, 2) + "\n",
    );
    console.log(
      `Fresh full gate ${ordinal}/5: exit ${processExitCode}; ${gate?.durationMs ?? "unknown"} ms; ${gate?.freshSuites ?? 0} fresh / ${gate?.reusedSuites ?? 0} reused tasks`,
    );
    if (processExitCode !== 0 || gate?.exitCode !== 0) {
      console.error(
        "Measurement stopped at the first failure. Diagnose the retained attempt before another series.",
      );
      writeFileSync(output, JSON.stringify(series, null, 2) + "\n", {
        flag: "wx",
      });
      process.exitCode = 1;
      return;
    }
  }
  writeFileSync(output, JSON.stringify(series, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify(checkMeasurementSeries(series)));
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
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
