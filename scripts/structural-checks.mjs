#!/usr/bin/env node
import { findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  uncoveredFixtureInputs,
  uncoveredMachinerySources,
} from "./lib/machinery-coverage.mjs";
import {
  largestTaskPeakRss,
  memoryBudgets,
  pressureSample,
} from "./lib/host-resources.mjs";
import {
  BUILD_PHASE_ARTIFACTS,
  checkGenerated,
  generatedArtifacts,
} from "./lib/generated-artifacts.mjs";

export function checkHost(
  sample = pressureSample(),
  {
    limits = memoryBudgets(findLaunchpad()),
    requiredPeakBytes = largestTaskPeakRss(),
  } = {},
) {
  const underBudget = limits.taskBytes < requiredPeakBytes;
  return {
    exitCode:
      ["warning", "critical"].includes(sample.level) || underBudget ? 1 : 0,
    sample,
    taskBudgetBytes: limits.taskBytes,
    requiredPeakBytes,
    output: `Host memory: ${sample.level}; pressure=${sample.pressure}; swapBytes=${sample.swapBytes}; physicalBytes=${sample.physicalBytes}; source=${sample.source}\nPer-lane memory budget ${limits.taskBytes} bytes ${underBudget ? "is below" : "covers"} measured task peak RSS ${requiredPeakBytes} bytes (${limits.hostLanes} host lanes)`,
  };
}

export function checkDeclarations(root, table, closures) {
  const machinery = uncoveredMachinerySources(root, table);
  const fixtures = uncoveredFixtureInputs(root, closures);
  return {
    exitCode: machinery.length || fixtures.length ? 1 : 0,
    output: [
      ...machinery.map(
        ({ suite, path }) =>
          `Missing machinerySources declaration: ${suite}: ${path}`,
      ),
      ...fixtures.map(
        ({ fixture, path, declaration }) =>
          `Missing copied-fixture input: ${fixture}: ${path}; update ${declaration}`,
      ),
    ].join("\n"),
  };
}

if (isMainModule(import.meta.url)) {
  try {
    const root = findLaunchpad();
    const [mode, ...rest] = process.argv.slice(2);
    const buildPhaseOnly =
      mode === "generated" &&
      rest.length === 1 &&
      rest[0] === "--build-phase-only";
    if (
      (rest.length && !buildPhaseOnly) ||
      !["declarations", "generated", "host"].includes(mode)
    )
      throw new Error(
        "usage: structural-checks.mjs declarations|generated [--build-phase-only]|host",
      );
    let result;
    if (mode === "declarations") {
      const { suites, expandSuiteTasks } = await import("./test-runner.mjs");
      result = checkDeclarations(
        root,
        expandSuiteTasks(
          suites.filter((row) => row.machinery),
          root,
        ),
      );
    } else if (mode === "generated")
      // A focused selection judges only what its build phase makes current.
      result = checkGenerated(
        root,
        buildPhaseOnly
          ? {
              artifacts: generatedArtifacts(root).filter((row) =>
                BUILD_PHASE_ARTIFACTS.includes(row.name),
              ),
            }
          : {},
      );
    else result = checkHost();
    if (result.output) console.log(result.output);
    for (const row of result.cases ?? []) {
      console.log(
        `${row.exitCode ? "STALE" : "CURRENT"} ${row.name} ${(row.durationMs / 1000).toFixed(3)} s`,
      );
      if (row.exitCode) console.log(row.output);
    }
    if (result.stale?.length)
      console.log(
        `Run npm run sync; stale artifacts: ${result.stale.join(", ")}`,
      );
    console.log(`STRUCTURAL_RESULT ${JSON.stringify(result)}`);
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
