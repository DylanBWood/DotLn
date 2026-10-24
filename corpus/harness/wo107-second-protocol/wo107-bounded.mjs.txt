#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";

export const SAFETY = {
  intervalMs: 250,
  aggregateRssBytes: 8 * 2 ** 30,
  additionalSwapMiB: 512,
  maxProcesses: 100,
  deadlineMs: 2 * 60 * 60 * 1000,
  nodeHeap: "unchanged Node default; no NODE_OPTIONS injection",
};

export function health() {
  assert.equal(
    process.platform,
    "darwin",
    "this host monitor is qualified for macOS only",
  );
  const output = execFileSync(
    "/usr/sbin/sysctl",
    ["-n", "vm.swapusage", "kern.memorystatus_vm_pressure_level"],
    { encoding: "utf8", timeout: 2000, maxBuffer: 4096 },
  );
  const swap = output.match(/used\s*=\s*([\d.]+)M\b/);
  const pressure = Number(output.trim().split("\n").at(-1));
  assert.ok(swap && [1, 2, 4].includes(pressure), "memory monitor unavailable");
  return { swapUsedMiB: Number(swap[1]), memoryPressure: pressure };
}

export function processTable() {
  return execFileSync("/bin/ps", ["-axo", "pid=,ppid=,pgid=,rss=,lstart="], {
    encoding: "utf8",
    timeout: 2000,
    maxBuffer: 2 * 1024 * 1024,
  })
    .trim()
    .split("\n")
    .map((line) => {
      const match = line.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(.+)$/);
      assert.ok(match, "unreadable process inventory");
      return {
        pid: Number(match[1]),
        ppid: Number(match[2]),
        pgid: Number(match[3]),
        rssBytes: Number(match[4]) * 1024,
        birth: match[5].trim(),
      };
    });
}

// Track descendants and the owned process group. Birth identities keep a
// recycled PID out of cleanup. This is sampled supervision, not an OS quota;
// detached descendants born and reparented between samples can be unobserved.
export function ownedProcesses(table, rootPid, known) {
  const owned = new Map(
    table
      .filter(
        (p) =>
          p.pid === rootPid ||
          p.pgid === rootPid ||
          known.get(p.pid) === p.birth,
      )
      .map((p) => [p.pid, p]),
  );
  let changed = true;
  while (changed) {
    changed = false;
    for (const process of table)
      if (owned.has(process.ppid) && !owned.has(process.pid)) {
        owned.set(process.pid, process);
        changed = true;
      }
  }
  for (const p of owned.values()) known.set(p.pid, p.birth);
  return [...owned.values()];
}

export async function bounded(
  command,
  { limits = SAFETY, observe = () => {}, stdio = "inherit" } = {},
) {
  const baseline = health();
  assert.equal(
    baseline.memoryPressure,
    1,
    "host memory pressure is not normal; no test launched",
  );
  const started = performance.now();
  const [program, ...args] = command;
  const child = spawn(program === "node" ? process.execPath : program, args, {
    detached: true,
    stdio,
    env: { ...process.env, DOTLN_WO107_MONITORED: "1" },
  });
  const known = new Map();
  let reason = null;
  let peakRssBytes = 0;
  let peakProcesses = 0;
  let samples = 0;
  let peakSwapGrowthMiB = 0;
  let finished = false;
  const stop = (why) => {
    if (reason) return;
    reason = why;
    // The new child owns this group; never use a name-based kill or another
    // session's process. Kill promptly on a resource trip, with no grace load.
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
    const table = processTable();
    for (const p of ownedProcesses(table, child.pid, known)) {
      const current = processTable().find(
        (row) => row.pid === p.pid && row.birth === p.birth,
      );
      if (current)
        try {
          process.kill(p.pid, "SIGKILL");
        } catch (error) {
          if (error.code !== "ESRCH") throw error;
        }
    }
    observe({ event: "resource-stop", reason: why });
  };
  const inspect = () => {
    if (finished || reason) return;
    try {
      const members = ownedProcesses(processTable(), child.pid, known);
      const rssBytes = members.reduce((sum, p) => sum + p.rssBytes, 0);
      const current = health();
      samples++;
      peakRssBytes = Math.max(peakRssBytes, rssBytes);
      peakProcesses = Math.max(peakProcesses, members.length);
      peakSwapGrowthMiB = Math.max(
        peakSwapGrowthMiB,
        current.swapUsedMiB - baseline.swapUsedMiB,
      );
      if (rssBytes >= limits.aggregateRssBytes) stop("aggregate-rss");
      else if (current.memoryPressure !== 1) stop("host-memory-pressure");
      else if (
        current.swapUsedMiB - baseline.swapUsedMiB >=
        limits.additionalSwapMiB
      )
        stop("host-swap-growth");
      else if (members.length > limits.maxProcesses) stop("process-count");
      else if (performance.now() - started > limits.deadlineMs)
        stop("deadline");
    } catch {
      stop("monitor-unavailable");
    }
  };
  const interrupt = () => stop("operator-interrupt");
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", interrupt);
  observe({ event: "resource-start", limits, baseline });
  inspect();
  const interval = setInterval(inspect, limits.intervalMs);
  let exit;
  try {
    exit = await new Promise((accept, reject) => {
      child.on("error", reject);
      child.on("exit", (code, signal) => accept({ code, signal }));
    });
  } finally {
    finished = true;
    clearInterval(interval);
    process.off("SIGINT", interrupt);
    process.off("SIGTERM", interrupt);
  }
  const receipt = {
    event: "resource-finished",
    ...exit,
    reason,
    samples,
    sampledPeakRssBytes: peakRssBytes,
    sampledPeakProcesses: peakProcesses,
    sampledMaxSwapGrowthMiB: peakSwapGrowthMiB,
    elapsedMs: performance.now() - started,
    limits,
    scope:
      "owned process group plus observed descendants; sampled maxima, not hard OS quotas",
  };
  observe(receipt);
  return receipt;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  assert.equal(
    args.shift(),
    "--",
    "usage: wo107-bounded -- <program> <args...>",
  );
  assert.ok(args.length);
  bounded(args, {
    observe: (receipt) => console.error(JSON.stringify(receipt)),
  })
    .then((result) => {
      process.exitCode = result.reason ? 125 : (result.code ?? 1);
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
