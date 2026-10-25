import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ClaudeCliPrintWorkOrderTransport } from "../../../packages/skeleton/dist/src/worker-transport.js";
import {
  changedSharedPaths,
  createQualificationFixture,
  hostFacts,
  makeHost,
  objectLocations,
  qualificationPaths,
  readRecord,
  relativize,
  requireNextEpisode,
  safeUsage,
  saveRecord,
  sharedSnapshot,
  version,
} from "./qualification-fixture.mjs";
export {
  classifyObjectLocations,
  relativize,
} from "./qualification-fixture.mjs";

const output = fileURLToPath(
  new URL("./claude-writer-qualification.json", import.meta.url),
);
const decisions = fileURLToPath(new URL("./decisions.md", import.meta.url));

async function qualify(decision) {
  const record = readRecord(output),
    number = requireNextEpisode(record, decision, decisions);
  const fixture = createQualificationFixture("claude", number),
    startedAt = Date.now(),
    cliVersion = version("claude");
  const settleMs = 1000;
  let usage,
    paths,
    before,
    comparison,
    locations,
    outcome,
    failure,
    processStartedAt,
    processStoppedAt;
  const transport = new ClaudeCliPrintWorkOrderTransport(
    undefined,
    cliVersion,
    (value) => {
      usage = value;
    },
  );
  const host = makeHost(fixture, transport, {
    onEvent(event) {
      if (event.type === "SourceChangeProcessStarted") {
        processStartedAt = Date.now();
        paths = qualificationPaths(fixture, host);
        before = sharedSnapshot(fixture.common, paths.gitdir);
      }
      if (event.type === "SourceChangeProcessStopped")
        processStoppedAt = Date.now();
    },
    afterResult() {
      locations = objectLocations(fixture, host);
      // The synchronous settlement hook is before any host import. A short
      // fixed interval also exposes an accidentally detached maintenance child.
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, settleMs);
      comparison = {
        settleMs,
        changedPaths: changedSharedPaths(
          before,
          sharedSnapshot(fixture.common, paths.gitdir),
        ),
        rrCachePresent: existsSync(join(fixture.common, "rr-cache")),
        excluded: "<gitdir> (including its private <store>)",
      };
      if (
        ["shared-before-import", "candidate-unreadable"].includes(
          locations.classification,
        ) ||
        comparison.changedPaths.length ||
        comparison.rrCachePresent
      )
        throw new Error("writer launch environment qualification failed");
    },
  });
  let row;
  try {
    try {
      outcome = await host.run();
    } catch (error) {
      failure = {
        kind: error?.constructor?.name ?? "unknown",
        code: typeof error?.code === "string" ? error.code : null,
      };
    }
    paths ??= qualificationPaths(fixture, host);
    const facts = hostFacts(host, outcome);
    row = {
      episode: number,
      causeDecision: decision ?? null,
      cliVersion,
      model: "claude-opus-5-5",
      effort: "xhigh",
      effectiveReadback: "unknown",
      maxBudgetUsd: 3,
      startedAt: new Date(startedAt).toISOString(),
      durationMs: Date.now() - startedAt,
      processWindow: {
        startedAt: processStartedAt
          ? new Date(processStartedAt).toISOString()
          : null,
        stoppedAt: processStoppedAt
          ? new Date(processStoppedAt).toISOString()
          : null,
      },
      objectLocation: locations ?? null,
      sharedRepository: comparison ?? null,
      host: facts,
      usage: safeUsage(usage),
      failure: failure ?? null,
    };
    row.passed =
      !failure &&
      locations?.classification === "private-only" &&
      comparison?.changedPaths.length === 0 &&
      comparison.rrCachePresent === false &&
      facts.outcome === "observed" &&
      facts.writer?.status === "completed" &&
      facts.writer.requiresHuman === false &&
      facts.candidateImported === 1 &&
      facts.sourceChangeObserved === 1 &&
      facts.importPrecedesObservation &&
      facts.focusedAfterExit === 0;
    row.stopReason =
      (locations &&
        ["shared-before-import", "candidate-unreadable"].includes(
          locations.classification,
        )) ||
      comparison?.changedPaths.length ||
      comparison?.rrCachePresent
        ? "writer-launch-environment"
        : null;
    saveRecord(
      output,
      relativize(
        {
          ...record,
          passed: row.passed,
          episodes: [...(record.episodes ?? []), row],
        },
        paths,
      ),
    );
  } finally {
    fixture.dispose();
  }
  return row;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2),
    decision = args.includes("--decision")
      ? args[args.indexOf("--decision") + 1]
      : undefined;
  try {
    const row = await qualify(decision);
    console.log(
      JSON.stringify({
        passed: row.passed,
        durationMs: row.durationMs,
        failure: row.failure,
      }),
    );
    if (!row.passed) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
