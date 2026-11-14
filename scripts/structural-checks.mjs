#!/usr/bin/env node
import { dispatchBoundResult } from "./lib/dispatch-bound.mjs";
import { formatDuration } from "./lib/duration.mjs";
import { findLaunchpad } from "./lib/config.mjs";
import { judgeRunningGit, judgeRunningNode } from "./lib/node-engines.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { unownedTemporaryRootSites } from "./lib/temporary-root-declarations.mjs";
import {
  uncoveredFixtureInputs,
  uncoveredMachinerySources,
} from "./lib/machinery-coverage.mjs";
import {
  judgeLaneMemory,
  memoryBudgets,
  pressureSample,
  requiredTaskPeakRss,
  sampleFileEventDaemon,
} from "./lib/host-resources.mjs";
import {
  BUILD_PHASE_ARTIFACTS,
  checkGenerated,
  generatedArtifacts,
} from "./lib/generated-artifacts.mjs";
import { checkGitSurface, recordGitSurface } from "./lib/git-surface.mjs";

export function checkHost(
  sample = pressureSample(),
  {
    // The root whose gate this host is judged for: a kit root's gate carries
    // fewer and lighter tasks than core's, and is sized to those.
    root = findLaunchpad(),
    limits = memoryBudgets(root),
    requiredPeakBytes = requiredTaskPeakRss(root),
    fileEvents = sampleFileEventDaemon(),
    standing,
    nodeVersion,
    packageRoot,
    gitVersion,
    // Whether this gate was started inside a gate that was admitted and
    // holds its lanes. Such a gate stands on that admission at warning
    // pressure, which the run it belongs to may itself have produced:
    // refusing it relieves nothing and fails the run that started it.
    underRunningGate = false,
  } = {},
) {
  const runtime = judgeRunningNode(nodeVersion, packageRoot);
  // The Git floor is judged where Node is, with one git --version spawn.
  const git = judgeRunningGit(packageRoot, gitVersion);
  const lane = judgeLaneMemory({
    limits,
    requiredPeakBytes,
    physicalBytes: sample.physicalBytes,
  });
  const { underBudget } = lane;
  if (standing?.state === "exceeded")
    return { ...dispatchBoundResult(standing), sample, fileEvents };
  const standsOnRunningGate = underRunningGate && sample.level === "warning";
  const daemon = judgeFileEventDaemon(fileEvents, { underRunningGate });
  return {
    exitCode:
      !runtime.admitted ||
      !git.admitted ||
      sample.level === "critical" ||
      (sample.level === "warning" && !underRunningGate) ||
      daemon.refused ||
      underBudget
        ? 1
        : 0,
    sample,
    fileEvents,
    taskBudgetBytes: limits.taskBytes,
    requiredPeakBytes,
    output: `${runtime.message}\n${git.message}\nHost memory: ${sample.level}; pressure=${sample.pressure}; swapBytes=${sample.swapBytes}; physicalBytes=${sample.physicalBytes}; source=${sample.source}${standsOnRunningGate ? "; admitted on the running gate that started this one and holds its lanes" : ""}\n${daemon.message}\n${lane.message}`,
  };
}

/** The resident memory above which the host's file-events daemon is taken
 * to be stuck: 1 GiB. A healthy one held 0.01 to 0.17 GiB under this
 * repository's gates, complete runs included; one whose event table had
 * overflowed passed 1 GiB within hours and 15 GiB within two days, used a
 * whole processor with nothing running, and returned to megabytes only when
 * it was restarted. Of two complete runs made in that state one added 4 GiB
 * and one added nothing, and what held the memory was not established: the
 * refusal is a precaution against running on a daemon in that state. */
export const FILE_EVENT_DAEMON_LIMIT_BYTES = 2 ** 30;

/** What a gate says of the file-events daemon's sample, and whether it
 * refuses on it. The sample is shown at every start, so that its growth is
 * seen the day it begins. Above the limit a gate refuses and names the
 * restart, which needs an administrator; a gate started inside a running
 * gate reports the same reading and stands on that gate's admission, since
 * refusing it would only fail the run that started it. A host with no such
 * daemon, or a sample that could not be taken, is reported and refuses
 * nothing.
 * @param {{residentBytes?: number|null, source?: string, unavailable?: string}|null|undefined} fileEvents
 * @param {{underRunningGate?: boolean}} [options] */
export function judgeFileEventDaemon(
  fileEvents,
  { underRunningGate = false } = {},
) {
  const bytes = fileEvents?.residentBytes;
  if (typeof bytes !== "number")
    return {
      refused: false,
      message: `File-events daemon: no sample (${fileEvents?.unavailable ?? fileEvents?.source ?? "not sampled"})`,
    };
  const reading = `File-events daemon: residentBytes=${bytes}; limitBytes=${FILE_EVENT_DAEMON_LIMIT_BYTES}`;
  if (bytes <= FILE_EVENT_DAEMON_LIMIT_BYTES)
    return { refused: false, message: reading };
  const stuck =
    "over the limit: a healthy daemon holds under 0.2 GiB here, and the one that passed this limit reached 15 GiB over the next day of gates and returned to megabytes only when it was restarted";
  return underRunningGate
    ? {
        refused: false,
        message: `${reading}; ${stuck}; admitted on the running gate that started this one. Restart the daemon before the next gate: sudo killall fseventsd (the system starts it again).`,
      }
    : {
        refused: true,
        message: `${reading}; ${stuck}. Restart it, which needs an administrator, and rerun this command: sudo killall fseventsd (the system starts it again).`,
      };
}

export function checkDeclarations(root, table, closures) {
  const machinery = uncoveredMachinerySources(root, table);
  const fixtures = uncoveredFixtureInputs(root, closures);
  const temporary = unownedTemporaryRootSites(root);
  return {
    exitCode: machinery.length || fixtures.length || temporary.length ? 1 : 0,
    output: [
      ...machinery.map(
        ({ suite, path }) =>
          `Missing machinerySources declaration: ${suite}: ${path}`,
      ),
      ...fixtures.map(
        ({ fixture, path, declaration }) =>
          `Missing copied-fixture input: ${fixture}: ${path}; update ${declaration}`,
      ),
      ...temporary.map(
        ({ path, line }) =>
          `Unowned temporary root: ${path}:${line}; use createTemporaryRoot with an owner and class`,
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
    const recording =
      mode === "git-surface" && rest.length === 1 && rest[0] === "--record";
    // The gate that runs the host check says whether it was itself started
    // inside a running gate; the gate knows that from a lease it validated.
    const underRunningGate =
      mode === "host" &&
      rest.length === 1 &&
      rest[0] === "--under-running-gate";
    if (
      (rest.length && !buildPhaseOnly && !recording && !underRunningGate) ||
      !["declarations", "generated", "git-surface", "host"].includes(mode)
    )
      throw new Error(
        "usage: structural-checks.mjs declarations|generated [--build-phase-only]|git-surface [--record]|host [--under-running-gate]",
      );
    let result;
    if (recording) {
      // The record is rewritten from the tree; its diff is what a reviewer
      // confirms against the floor's manual.
      const { added, removed, scopedElsewhere } = recordGitSurface(root);
      result = {
        exitCode: 0,
        output: `Recorded scripts/lib/git-surface.json: ${added.length} added${added.length ? ` (${added.join(", ")})` : ""}; ${removed.length} removed${removed.length ? ` (${removed.join(", ")})` : ""}. Confirm each added form against the declared Git floor's manual before committing.${scopedElsewhere.length ? ` A scoped form is named outside the files its entry admits, and the check keeps failing there until a reviewer adds the file to the entry: ${scopedElsewhere.join(", ")}.` : ""}`,
      };
    } else if (mode === "git-surface") result = checkGitSurface(root);
    else if (mode === "declarations") {
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
    else result = checkHost(undefined, { underRunningGate });
    if (result.output) console.log(result.output);
    for (const row of result.cases ?? []) {
      console.log(
        `${row.exitCode ? "STALE" : "CURRENT"} ${row.name} ${formatDuration(row.durationMs)}`,
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
