#!/usr/bin/env node
// Run under harness bounded. The OS time utility accounts for the command and
// its waited-for children; wall time includes command startup, not lane wait.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { totalmem, availableParallelism, loadavg } from "node:os";
import { createHash } from "node:crypto";
import { suites, STRUCTURAL_TASKS, expand } from "./test-runner.mjs";
import {
  recordedHostLaneCapacity,
  memoryBudgets,
} from "./lib/host-resources.mjs";
import { findLaunchpad, docPath } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";

export function parseTaskResources(stderr, platform = process.platform) {
  if (platform !== "darwin")
    throw new Error("Structural measurement currently requires macOS time -lp");
  const number = (pattern) => {
    const value = Number(pattern.exec(stderr)?.[1]);
    if (!Number.isFinite(value))
      throw new Error("OS command resource measurement unavailable");
    return value;
  };
  return {
    wallMs: number(/^real\s+([\d.]+)$/m) * 1000,
    cpuMs: (number(/^user\s+([\d.]+)$/m) + number(/^sys\s+([\d.]+)$/m)) * 1000,
    rssPeakBytes: number(/^\s*(\d+)\s+maximum resident set size/m),
  };
}

export function measuredLaneRequest(runs, capacity, taskBudgetBytes) {
  if (
    !runs.length ||
    runs.some(
      (row) =>
        row.exitCode !== 0 ||
        !(row.wallMs > 0) ||
        !Number.isFinite(row.cpuMs) ||
        row.cpuMs < 0 ||
        !(row.rssPeakBytes > 0),
    )
  )
    throw new Error(
      "Three successful measured runs per context are required before sizing",
    );
  const cpuSlots = Math.max(
    1,
    Math.ceil(Math.max(...runs.map((row) => row.cpuMs / row.wallMs)) * 1.25),
  );
  const memorySlots = Math.max(
    1,
    Math.ceil(
      Math.max(...runs.map((row) => row.rssPeakBytes)) / taskBudgetBytes,
    ),
  );
  return Math.min(capacity, Math.max(cpuSlots, memorySlots));
}

function measure(kit, output) {
  const root = findLaunchpad();
  if (!output.startsWith(docPath(root, "evidence") + "/") || existsSync(output))
    throw new Error(
      "Choose a new evidence file; prior measurements are retained",
    );
  if (!existsSync(join(kit, "KIT-MANIFEST.json")))
    throw new Error("A fixture export is required");
  const capacity = recordedHostLaneCapacity(),
    limits = memoryBudgets(root, { capacity });
  const record = {
    schemaVersion: 1,
    command:
      "node scripts/harness.mjs bounded -- node scripts/measure-lanes.mjs --kit <fixture-export> --out <evidence-file>",
    observedAt: new Date().toISOString(),
    platform: process.platform,
    node: process.version,
    capacity,
    physicalBytes: totalmem(),
    logicalCpus: availableParallelism(),
    taskBudgetBytes: limits.taskBytes,
    exportCommit: JSON.parse(readFileSync(join(kit, "KIT-MANIFEST.json")))
      .commit,
    method:
      "Three sequential runs per task and context using /usr/bin/time -lp. CPU is user plus system time of the command and waited-for children; RSS is the OS maximum resident set, not physical footprint. Request is ceiling of maximum CPU/wall times 1.25 or RSS/per-lane budget, at least one, capped at recorded capacity. This is measured sizing, not a worst-case CPU guarantee. Core kit-verify invokes core's verifier against the same fixture export because core has no kit manifest.",
    runs: [],
    requests: {},
  };
  mkdirSync(dirname(output), { recursive: true });
  const save = () =>
    writeFileSync(output, JSON.stringify(record, null, 2) + "\n");
  for (const [context, cwd] of [
    ["core", root],
    ["export", kit],
  ]) {
    for (const task of [...STRUCTURAL_TASKS, "kit-verify"]) {
      const command =
        task === "kit-verify"
          ? [process.execPath, "scripts/launchpad.mjs", "verify", kit]
          : expand(
              [
                ...suites.find((row) => row.name === task).command,
                ...(suites.find((row) => row.name === task).args ?? []),
              ],
              cwd,
            );
      for (let run = 1; run <= 3; run++) {
        const loadAverage = loadavg();
        const result = spawnSync("/usr/bin/time", ["-lp", ...command], {
          cwd,
          encoding: "utf8",
          timeout: 150_000,
          maxBuffer: 16 * 1024 * 1024,
          env: { ...process.env, CODEX_THREAD_ID: "", DOTLN_LAUNCHPAD: "" },
        });
        const metrics = parseTaskResources(result.stderr ?? "");
        record.runs.push({
          context,
          task,
          run,
          ...metrics,
          capacity,
          exitCode: result.status,
          loadAverage,
          outputSha256: createHash("sha256")
            .update((result.stdout ?? "") + (result.stderr ?? ""))
            .digest("hex"),
        });
        save();
        console.log(
          `${context} ${task} ${run}/3: exit ${result.status}; CPU ${metrics.cpuMs} ms; RSS ${metrics.rssPeakBytes}; wall ${metrics.wallMs} ms`,
        );
        if (result.status !== 0 || result.error)
          throw new Error(
            `Measurement failed: ${context} ${task}; ${result.error?.code ?? "command refusal"}\n${result.stdout}\n${result.stderr}`,
          );
      }
    }
  }
  for (const task of [...STRUCTURAL_TASKS, "kit-verify"])
    record.requests[task] = measuredLaneRequest(
      record.runs.filter((row) => row.task === task),
      capacity,
      limits.taskBytes,
    );
  save();
  console.log(JSON.stringify(record.requests));
}

if (isMainModule(import.meta.url)) {
  try {
    const [kitFlag, kit, outFlag, output, ...rest] = process.argv.slice(2);
    if (
      kitFlag !== "--kit" ||
      outFlag !== "--out" ||
      !kit ||
      !output ||
      rest.length
    )
      throw new Error(
        "usage: measure-lanes --kit <fixture-export> --out <new-evidence-file>",
      );
    measure(resolve(kit), resolve(output));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
