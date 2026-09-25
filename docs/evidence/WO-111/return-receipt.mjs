#!/usr/bin/env node
// Preserve the second live window's pending-work return contrast without
// publishing local store or worktree paths.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { replayResident } from "../../../packages/skeleton/dist/src/resident-store.js";

const here = join(TOOL_ROOT, "docs/evidence/WO-111");
const location = JSON.parse(
  readFileSync(
    join(TOOL_ROOT, "docs/control/local/wo111/return-location.json"),
    "utf8",
  ),
);
const raw = (path) => JSON.parse(readFileSync(path, "utf8"));
const fact = (value) => ({ epistemic: "observed", value });
const unknown = (reason) => ({ epistemic: "unknown", value: null, reason });
const sha = (value) => createHash("sha256").update(value).digest("hex");
const git = (cwd, ...args) =>
  execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    timeout: 15_000,
  }).trim();
const isSignal = (event, kind) =>
  event.type === "OperatorPresenceObserved" &&
  event.payload.origin === "human" &&
  event.payload.signal?.kind === kind;

export function collect() {
  const run = raw(join(location.root, "run.json"));
  const baseline = raw(join(location.root, "window-baseline.json"));
  const pending = raw(join(location.root, "return-preback.json"));
  const log = readFileSync(join(location.store, "events.jsonl"), "utf8");
  const lines = log.trimEnd().split("\n");
  const events = decodeLog(log);
  const state = replayResident(log).state.resident;
  const awayIndex = events.findIndex((event) => isSignal(event, "away"));
  const backIndex = events.findIndex((event) => isSignal(event, "back"));
  assert.ok(awayIndex >= 0 && backIndex > awayIndex);
  const awayAt = events[awayIndex].occurredAt;
  const backAt = events[backIndex].occurredAt;
  const stateAtBack = replayResident(
    lines.slice(0, backIndex + 1).join("\n") + "\n",
  ).state.resident;
  const activations = events.filter(
    (event) => event.type === "PortfolioOrderActivated",
  );
  const observed = events.filter(
    (event) => event.type === "PortfolioOrderObserved",
  );
  const orders = observed.map((event) => {
    const activated = activations.find(
      (item) => item.payload.episodeId === event.payload.episodeId,
    );
    assert.ok(activated, "verified order needs a durable activation");
    const change = event.payload.portfolio?.change;
    assert.equal(change?.status, "observed");
    const changedPaths = git(
      location.target,
      "diff",
      "--no-ext-diff",
      "--no-renames",
      "--name-only",
      location.baseCommit,
      change.commit,
    )
      .split("\n")
      .filter(Boolean);
    return {
      phase: activated.payload.activation.phaseId,
      candidate: activated.payload.activation.order.candidateId,
      ceilingFiles:
        state.configuration.portfolio.definition.phases[
          activated.payload.activation.phaseId
        ].files,
      changedPaths,
      verified: event.payload.verified,
      verification: event.payload.portfolio?.verification?.verdict,
      atOffsetMs: event.occurredAt - awayAt,
    };
  });
  const rows = events.map((event, index) => ({
    index,
    atOffsetMs: event.occurredAt - awayAt,
    type: event.type,
    ...(event.type === "OperatorPresenceObserved"
      ? {
          presence: {
            origin: event.payload.origin,
            kind: event.payload.signal?.kind ?? "unknown",
          },
        }
      : {}),
    ...(event.type === "PortfolioOrderActivated"
      ? {
          activation: {
            phase: event.payload.activation.phaseId,
            candidate: event.payload.activation.order.candidateId,
          },
        }
      : {}),
    ...(event.type === "PortfolioOrderObserved"
      ? {
          outcome: {
            verified: event.payload.verified,
            verdict:
              event.payload.portfolio?.verification?.verdict ?? "not-run",
          },
        }
      : {}),
  }));
  const eventsText = rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
  const postBackDispatches = events.filter(
    (event) =>
      event.type === "ScriptEpisodeDispatched" && event.occurredAt > backAt,
  ).length;
  const postBackActivations = activations.filter(
    (event) => event.occurredAt > backAt,
  ).length;
  const boundary = {
    mainCheckoutUnchanged:
      JSON.stringify(baseline.main) === JSON.stringify(run.after.main),
    selectedCheckoutUnchanged:
      JSON.stringify(baseline.selected) === JSON.stringify(run.after.selected),
    targetMainUnchanged:
      JSON.stringify(baseline.target) === JSON.stringify(run.after.target),
    sentinelUnchanged: baseline.sentinel === run.after.sentinel,
    templateUnchanged: run.before.template === run.after.template,
    zeroRemotesBeforeAndAfter:
      Object.values(run.before.remotes).every((count) => count === 0) &&
      Object.values(run.after.remotes).every((count) => count === 0),
    launchpadConfigurationUnchanged:
      readFileSync(join(location.launchpad, "dotln.config.json"), "utf8") ===
      git(location.launchpad, "show", "HEAD:dotln.config.json") + "\n",
  };
  assert.ok(pending.observedAt < backAt && pending.observedAt >= awayAt);
  assert.ok(pending.dueAt > backAt, "the fourth dispatch was not yet due");
  assert.equal(pending.episodesUsed, 3);
  assert.equal(pending.episodesCeiling, 4);
  assert.equal(pending.phase, "probe");
  assert.equal(pending.inFlight, false);
  assert.ok(pending.nextCandidate.startsWith("repeated-repair:"));
  assert.deepEqual(
    orders.map((order) => order.phase),
    ["probe", "widen", "peak"],
  );
  assert.deepEqual(
    orders.map((order) => order.changedPaths.length),
    [1, 1, 2],
  );
  assert.ok(
    orders.every((order) => order.verified && order.verification === "pass"),
  );
  assert.equal(activations.length, 3);
  assert.equal(postBackDispatches, 0);
  assert.equal(postBackActivations, 0);
  assert.equal(stateAtBack.machine.state, "present");
  assert.equal(stateAtBack.present, true);
  assert.equal(state.machine.state, "present");
  assert.equal(state.portfolio.episodes, 3);
  assert.ok(Object.values(boundary).every(Boolean));
  const receipt = {
    schemaVersion: 1,
    workOrder: "WO-111",
    purpose:
      "Supplementary live return contrast; the first window is receipt.json.",
    window: fact({
      awayAt,
      backAt,
      durationMs: backAt - awayAt,
      runnerStoppedAfterBackMs: run.endedAt - backAt,
    }),
    curveShape: fact({
      phases: orders.map((order) => ({
        phase: order.phase,
        ceilingFiles: order.ceilingFiles,
        changedFiles: order.changedPaths.length,
        verified: order.verified,
      })),
      phaseAfterPeakBeforeBack: pending.phase,
      nextCandidate: pending.nextCandidate,
      episodesUsed: pending.episodesUsed,
      episodesCeiling: pending.episodesCeiling,
      reportedWallMs: state.portfolio.wallMs,
      reportedTokens: state.portfolio.tokens,
    }),
    returnCancellation: fact({
      preBackCandidateEligible: true,
      preBackInFlight: pending.inFlight,
      pendingDueAt: pending.dueAt,
      backBeforeDueMs: pending.dueAt - backAt,
      stateAtBack: stateAtBack.machine.state,
      postBackDispatches,
      postBackActivations,
      remainingEpisodeBudget: pending.episodesCeiling - pending.episodesUsed,
    }),
    protectedSurfaces: fact(boundary),
    eventStream: fact({
      path: "return-events.jsonl",
      rows: rows.length,
      sha256: sha(eventsText),
    }),
    netValueOfAbsence: unknown(
      "Verified changes and increasing phase ceilings are observed, but no benefit, risk, disruption or opportunity-cost measure was collected; no optimal absence length or positive net payoff is established.",
    ),
    actualEpisodeTokens: unknown(
      "Portfolio actors did not report token usage; zero reported tokens is not zero model usage.",
    ),
    outsideHostFilesystem: unknown(
      "The host checked named local surfaces and Git remotes, not every host path or network endpoint.",
    ),
  };
  writeFileSync(join(here, "return-events.jsonl"), eventsText, {
    flag: "wx",
  });
  writeFileSync(
    join(here, "return-receipt.json"),
    `${JSON.stringify(receipt, null, 2)}\n`,
    { flag: "wx" },
  );
  return receipt;
}

if (process.argv[1]?.endsWith("return-receipt.mjs")) {
  if (process.argv[2] !== "collect")
    throw new Error(
      "usage: node docs/evidence/WO-111/return-receipt.mjs collect",
    );
  const result = collect();
  console.log(
    JSON.stringify({
      orders: result.curveShape.value.phases.length,
      pendingMsAtBack: result.returnCancellation.value.backBeforeDueMs,
      eventRows: result.eventStream.value.rows,
    }),
  );
}
