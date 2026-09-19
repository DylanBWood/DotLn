#!/usr/bin/env node
import { isMainModule } from "../lib/paths.mjs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { homedir } from "node:os";

import { performance } from "node:perf_hooks";
import {
  livePreflightAsync,
  request,
  settings,
  waitForIdle,
} from "./local-runner-smoke.mjs";
const exec = promisify(execFile);

export async function readHealth() {
  const options = { encoding: "utf8", timeout: 2000 };
  const results = await Promise.all([
    exec(
      "osascript",
      [
        "-l",
        "JavaScript",
        "-e",
        'ObjC.import("Foundation"); $.NSProcessInfo.processInfo.thermalState',
      ],
      options,
    ),
    exec("sysctl", ["-n", "kern.memorystatus_vm_pressure_level"], options),
    exec("sysctl", ["vm.swapusage"], options),
  ]);
  const thermal = results[0].stdout.trim(),
    pressure = results[1].stdout.trim();
  const swap = results[2].stdout.match(/used\s*=\s*([\d.]+)M\b/);
  if (!/^[0-3]$/.test(thermal) || !/^(1|2|4)$/.test(pressure) || !swap)
    throw new Error("Native resource observations unavailable");
  return {
    observedAt: new Date().toISOString(),
    thermalState: Number(thermal),
    memoryPressure: Number(pressure),
    swapUsedMiB: Number(swap[1]),
  };
}
export function healthStop(sample, baseline) {
  if (
    !sample ||
    !baseline ||
    !Number.isFinite(sample.swapUsedMiB) ||
    !Number.isFinite(baseline.swapUsedMiB)
  )
    return "monitor-unavailable";
  if (sample.thermalState !== 0) return "thermal-not-nominal";
  if (sample.memoryPressure !== 1) return "memory-pressure-not-normal";
  if (sample.swapUsedMiB - baseline.swapUsedMiB >= 128)
    return "swap-growth-limit";
  return null;
}

// A sampled process/socket inventory is not a no-egress boundary.
export async function runnerSockets() {
  const processes = (
    await exec("ps", ["-axo", "pid=,comm="], {
      encoding: "utf8",
      timeout: 2000,
    })
  ).stdout;
  const pids = processes
    .split("\n")
    .filter(
      (line) =>
        line.includes("/Applications/LM Studio.app/") ||
        line.includes("/.lmstudio/"),
    )
    .map((line) => line.trim().split(/\s+/, 1)[0]);
  if (!pids.length)
    return {
      classification: "unavailable",
      reason: "No runner process matched",
    };
  let result;
  try {
    result = await exec(
      "lsof",
      ["-nP", "-a", "-p", pids.join(","), "-i", "-F", "n"],
      { encoding: "utf8", timeout: 2000 },
    );
  } catch (error) {
    if (error.code === 1 && !error.killed)
      result = { stdout: error.stdout ?? "" };
    else
      return {
        classification: "unavailable",
        reason: "Socket inventory failed",
      };
  }
  const addresses = result.stdout
    .split("\n")
    .filter((s) => s.startsWith("n"))
    .map((s) => s.slice(1));
  const loopback = addresses.filter((address) =>
    address
      .split("->")
      .every(
        (endpoint) =>
          endpoint.startsWith("127.0.0.1:") || endpoint.startsWith("[::1]:"),
      ),
  );
  return {
    classification: "observed",
    observedAt: new Date().toISOString(),
    runnerProcessCount: pids.length,
    internetSocketCount: addresses.length,
    loopbackSocketCount: loopback.length,
    otherSocketCount: addresses.length - loopback.length,
    source:
      "ps comm path selection; lsof -nP Internet sockets; addresses and PIDs discarded",
  };
}

export async function runLoad({
  base,
  observeHealth = readHealth,
  observeState,
  preflight = livePreflightAsync,
  record = () => {},
  baseline,
  durationMs = 120000,
  maxRequests = 10,
  pauseMs = 5000,
  pollMs = 1000,
  requestTimeoutMs = 15000,
  invoke = request,
}) {
  if (
    ![durationMs, maxRequests, pauseMs, pollMs, requestTimeoutMs].every(
      Number.isFinite,
    ) ||
    durationMs <= 0 ||
    durationMs > 120000 ||
    maxRequests < 1 ||
    maxRequests > 10 ||
    !Number.isInteger(maxRequests) ||
    pauseMs < 0 ||
    pollMs <= 0 ||
    pollMs > 1000 ||
    requestTimeoutMs > 15000
  )
    throw new Error("Load limits exceed the authorized bounded experiment");
  baseline ??= await observeHealth();
  const start = performance.now(),
    controller = new AbortController();
  const packet = {
    startedAt: new Date().toISOString(),
    baseline,
    rows: [],
    samples: [],
    stageChecks: [],
    stopReason: null,
    limits: {
      durationMs,
      maxRequests,
      pauseMs,
      pollMs,
      maxOutputTokens: 128,
      parallel: 1,
      requestTimeoutMs,
    },
  };
  const stop = (reason) => {
    packet.stopReason ??= reason;
    controller.abort();
  };
  let observation = null;
  const collect = async () => {
    try {
      const gate = await preflight();
      const sample = {
        ...(await observeHealth()),
        afterMs: performance.now() - start,
        gateProcessCount: gate?.gateProcessCount ?? null,
      };
      packet.samples.push(sample);
      const reason = healthStop(sample, baseline);
      if (reason) stop(reason);
    } catch (error) {
      packet.monitorError = error.message;
      stop("monitor-or-gate-refusal");
    }
    record(packet);
  };
  const observe = () => {
    observation ??= collect().finally(() => {
      observation = null;
    });
    return observation;
  };
  // The native readers are independently bounded; a monitoring failure aborts
  // the client rather than permitting more load. This is a same-host observer.
  const monitor = setInterval(() => {
    void observe();
  }, pollMs);
  const deadline = setTimeout(() => stop("duration-limit"), durationMs);
  const operatorStop = () => stop("operator-stop");
  process.once("SIGINT", operatorStop);
  process.once("SIGTERM", operatorStop);
  try {
    await observe();
    while (!controller.signal.aborted && packet.rows.length < maxRequests) {
      if (performance.now() - start >= durationMs) {
        stop("duration-limit");
        break;
      }
      const row = await invoke(
        base,
        {
          model: "dotln-local",
          ...settings,
          max_tokens: 128,
          messages: [
            {
              role: "user",
              content:
                "Count upwards from 1 to 500, separated by commas. Do not skip any numbers. Output only the numbers.",
            },
          ],
        },
        {
          timeoutMs: Math.min(
            requestTimeoutMs,
            Math.max(1, durationMs - (performance.now() - start)),
          ),
          signal: controller.signal,
        },
      );
      row.number = packet.rows.length + 1;
      packet.rows.push(row);
      record(packet);
      if (observeState) {
        try {
          row.idleAfter = await waitForIdle(observeState);
        } catch (error) {
          row.idleAfter = { idle: false, errorShape: error.message };
        }
        if (!row.idleAfter.idle) stop("runner-not-idle");
      }
      if (row.status !== "completed")
        stop(controller.signal.aborted ? packet.stopReason : "request-failure");
      await observe();
      if (packet.rows.length === 2 && !controller.signal.aborted) {
        packet.stageChecks.push({
          afterRequests: 2,
          afterMs: performance.now() - start,
          health: packet.samples.at(-1),
          decision: "continue-to-stage-two",
        });
      }
      if (!controller.signal.aborted && packet.rows.length < maxRequests) {
        await new Promise((done) => {
          const finish = () => {
            clearTimeout(timer);
            controller.signal.removeEventListener("abort", finish);
            done();
          };
          const timer = setTimeout(finish, pauseMs);
          controller.signal.addEventListener("abort", finish, { once: true });
          if (controller.signal.aborted) finish();
        });
      }
    }
    packet.stopReason ??= "request-limit";
  } finally {
    clearInterval(monitor);
    clearTimeout(deadline);
    await observation;
    process.removeListener("SIGINT", operatorStop);
    process.removeListener("SIGTERM", operatorStop);
    packet.finishedAt = new Date().toISOString();
    packet.elapsedMs = performance.now() - start;
    record(packet);
  }
  return packet;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 3 || args[0] !== "--live" || args[1] !== "--packet")
    throw new Error(
      "usage: node scripts/probes/local-runner-load.mjs --live --packet <existing-readiness-json>",
    );
  const path = resolve(args[2]);
  if (!existsSync(path)) throw new Error("Readiness packet required");
  const packet = JSON.parse(readFileSync(path, "utf8"));
  if (packet.loadTest)
    throw new Error("Retain existing load test; do not overwrite it");
  const lms = resolve(homedir(), ".lmstudio/bin/lms");
  const state = async () => {
    const rows = JSON.parse(
      (await exec(lms, ["ps", "--json"], { encoding: "utf8", timeout: 2000 }))
        .stdout,
    );
    const model = rows.find((m) => m.identifier === "dotln-local");
    if (
      model &&
      (model.modelKey !== "qwen/qwen3.6-27b" ||
        model.contextLength !== 4096 ||
        model.parallel !== 1)
    )
      throw new Error("Model load differs from authorized limits");
    return {
      status: model?.status ?? "unavailable",
      queued: model?.queued ?? null,
    };
  };
  const initial = await state();
  if (initial.status !== "idle" || initial.queued !== 0)
    throw new Error("Pinned alias must be idle with no queue");
  const result = await runLoad({
    base: "http://127.0.0.1:1234",
    observeState: state,
    observeHealth: async () => {
      const health = await readHealth();
      if (!packet.duringGenerationSockets) {
        const list = async () =>
          JSON.parse(
            (
              await exec(lms, ["ps", "--json"], {
                encoding: "utf8",
                timeout: 2000,
              })
            ).stdout,
          );
        const before = (await list()).find(
          (m) => m.identifier === "dotln-local",
        )?.status;
        if (before === "generating") {
          const snapshot = await runnerSockets();
          const after = (await list()).find(
            (m) => m.identifier === "dotln-local",
          )?.status;
          packet.duringGenerationSockets = {
            ...snapshot,
            stateBefore: before,
            stateAfter: after,
            duringGeneration: after === "generating",
          };
        }
      }
      return health;
    },
    baseline: packet.loadBaseline ?? (await readHealth()),
    record: (loadTest) => {
      packet.loadTest = loadTest;
      writeFileSync(path, JSON.stringify(packet, null, 2) + "\n");
    },
  });
  console.log(
    JSON.stringify({
      stopReason: result.stopReason,
      requests: result.rows.length,
      elapsedMs: result.elapsedMs,
      healthSamples: result.samples.length,
    }),
  );
}
if (isMainModule(import.meta.url)) await main();
