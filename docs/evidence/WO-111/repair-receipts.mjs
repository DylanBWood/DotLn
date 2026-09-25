#!/usr/bin/env node
// Offline correction of retained WO-111 evidence. Never launches a worker.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { replayResident } from "../../../packages/skeleton/dist/src/resident-store.js";
import {
  residentMachine,
  portfolioSelection,
  residentRefusal,
} from "../../../packages/skeleton/dist/src/resident-state.js";

const here = join(TOOL_ROOT, "docs/evidence/WO-111");
const read = (path) => readFileSync(path, "utf8");
const json = (path) => JSON.parse(read(path));
const fact = (value) => ({ epistemic: "observed", value });
const claim = (value) => ({ epistemic: "launch-claim", value });
const unknown = (reason) => ({ epistemic: "unknown", value: null, reason });
const sha = (text) => createHash("sha256").update(text).digest("hex");
const isBack = (e) =>
  e.type === "OperatorPresenceObserved" && e.payload.signal?.kind === "back";
const load = (store) => {
  const text = read(join(store, "events.jsonl"));
  return {
    text,
    events: decodeLog(text),
    state: replayResident(text).state.resident,
  };
};
function beforeBack(log) {
  const index = log.events.findIndex(isBack);
  assert.ok(index > 0);
  const lines = log.text.trimEnd().split("\n");
  const prefix = (end) =>
    replayResident(lines.slice(0, end).join("\n") + "\n").state.resident;
  return {
    before: prefix(index),
    after: prefix(index + 1),
    backAt: log.events[index].occurredAt,
  };
}
function projection(log, stream, awayAt) {
  return log.events.map((e, index) => {
    const p = e.payload;
    const row = {
      stream,
      index,
      atOffsetMs:
        e.type === "ResidentConfigured" ? null : e.occurredAt - awayAt,
      type: e.type,
    };
    if (e.type === "ResidentConfigured")
      row.timeBasis = "configuration event has no wall-clock sample";
    if (e.type === "OperatorPresenceObserved")
      row.presence = { origin: p.origin, kind: p.signal?.kind ?? "unknown" };
    if (e.type === "ScriptEpisodeDispatched")
      row.dispatch = { phase: p.phaseId, kind: p.kind };
    if (e.type === "PortfolioOrderActivated")
      row.activation = {
        phase: p.activation.phaseId,
        candidate: p.activation.order.candidateId,
        sizeFiles: p.activation.order.size.files,
      };
    if (e.type === "PortfolioOrderObserved")
      row.outcome = {
        verified: p.verified,
        change: p.portfolio?.change?.status ?? "none",
        verdict: p.portfolio?.verification?.verdict ?? "not-run",
      };
    if (e.type === "ScriptEpisodeObserved")
      row.discovery = {
        verified: p.verified,
        candidates: p.discovery?.candidates?.length ?? null,
      };
    if (e.type === "CliWorkerObserved") row.mission = { verified: p.verified };
    if (e.type === "ScriptEpisodeRefused") row.refusal = { reason: p.reason };
    return row;
  });
}
function launchClaims(location) {
  return ["WO-900", "WO-901", "WO-902"].flatMap((order) =>
    ["source", "verification"].flatMap((role) => {
      const log = load(join(location.root, "portfolio", `${role}-${order}`));
      return log.events
        .filter((e) => e.type === "WorkerAttemptStarted")
        .map((e, attempt) => {
          const p = e.payload;
          return {
            order,
            role,
            attempt: attempt + 1,
            launch: claim({
              transport: p.transport,
              version: p.harnessVersion,
              model: p.model,
              effort: p.effort,
              mode: p.mode,
            }),
            effectiveIdentity: unknown(
              "No effective per-episode model/effort readback; launch selectors are not effective identity.",
            ),
          };
        });
    }),
  );
}
function output(name, value, check) {
  const text = JSON.stringify(value, null, 2) + "\n";
  assert.ok(
    !/\/Users\/|\/private\/|\/var\/folders\/|(?:api[_-]?key|access_token)\s*[=:]/i.test(
      text,
    ),
    "public evidence must not contain private paths or credentials",
  );
  if (check)
    assert.equal(read(join(here, name)), text, `${name} reproducibility`);
  else writeFileSync(join(here, name), text, { flag: "wx" });
  return text;
}

function collect(returnWindow, check) {
  const stem = returnWindow ? "return-" : "";
  const location = json(
    join(
      TOOL_ROOT,
      `docs/control/local/wo111/${returnWindow ? "return-location" : "location"}.json`,
    ),
  );
  const originalPath = `${stem}receipt.json`;
  const original = json(join(here, originalPath));
  assert.equal(
    sha(read(join(here, original.eventStream.value.path))),
    original.eventStream.value.sha256,
  );
  const log = load(location.store);
  const receipt = structuredClone(original);
  receipt.schemaVersion = 2;
  receipt.correction = fact({
    original: originalPath,
    originalSha256: sha(read(join(here, originalPath))),
    source:
      "VER-001 and WO-111-D012; offline replay of retained raw stores, no live rerun",
  });
  const edge = beforeBack(log);
  const launches = launchClaims(location);
  assert.equal(launches.length, 6);
  receipt.episodeLaunches = fact(launches);
  delete receipt.workerLaunch;
  receipt.presenceAuthorship = claim({
    method:
      "Executor entered away/back in response to operator messages, as D003 records; the log classifier assigns human by signal kind and cannot authenticate the sender.",
  });
  receipt.inFlightReturn = fact({
    exercised: edge.before.machine.current !== null,
    pendingEpisodeCount: Object.values(edge.before.episodes).filter(
      (status) => status === "dispatched",
    ).length,
    phaseRules: log.state.policy.phases.map((p) => ({
      phase: p.phaseId,
      inFlightOnReturn: p.inFlightOnReturn,
    })),
    fixture:
      "packages/skeleton/test/resident.test.ts: WO-068 in-flight kill and finish obey return precedence and reject stale advancement",
    limit:
      "Neither live return had an in-flight episode; the cited test uses fake actors, not live portfolio workers.",
  });
  assert.equal(receipt.inFlightReturn.value.exercised, false);
  assert.equal(receipt.inFlightReturn.value.pendingEpisodeCount, 0);
  receipt.budget = fact({
    method:
      "resident replay; episodes count admitted portfolio outcomes; wallMs sums max(0, observation state.at - activation.at); tokens include only actor-reported values; ceiling is the recorded portfolio definition",
    consumed: {
      episodes: log.state.portfolio.episodes,
      wallMs: log.state.portfolio.wallMs,
      tokens: log.state.portfolio.tokens,
    },
    ceiling: log.state.configuration.portfolio.definition.budget,
  });
  receipt.snapshotCoverage = fact({
    method:
      "checkoutSnapshot from WO-053/fixture.mjs: HEAD, tracked and nonignored worktree bytes and index; ignored paths excluded",
    excludedObservedWrites: [
      "harness installation/exclude records in the ignored DotLn control lane",
      "mission store in the first window's ignored DotLn control lane",
      "target .git/info/exclude worker blocks",
    ],
    source:
      "VER-001 m3; those ignored writes are outside the checkout equality claim",
  });
  receipt.outsidePortfolioChange = fact({
    checkedLocation: "user Codex home/config.toml",
    changed: true,
    effect:
      "project trust_level=trusted entry for this window's scratch target",
    source:
      "VER-001 B1; entries remain present in the repair's read-only inventory",
    attribution:
      "Inference: Codex launch persisted trust; supported by matching scratch keys, verifier-recorded timing and inherited Codex home. No writer-identifying log was found.",
    criterion2: "unmet; no operator exception recorded",
  });
  receipt.outsideHostFilesystem = unknown(
    "The Codex config change is reported separately as observed. Other unmeasured host paths and network endpoints remain unknown.",
  );
  receipt.runnerReturn = fact({
    source:
      "run.mjs one-second pulse calls AbortController.abort after it sees present",
    stoppedAfterBackMs: original.window.value.runnerStoppedAfterBackMs,
    limit:
      "Zero later dispatches before caller shutdown cannot alone establish cancellation at the future due time.",
  });
  let rows = projection(log, "portfolio", original.window.value.awayAt);
  if (returnWindow) {
    const machine = residentMachine(edge.before);
    const phase = machine.phase();
    const selection = portfolioSelection(edge.before, phase);
    assert.ok("activation" in selection);
    assert.equal(residentRefusal(edge.before, machine), null);
    assert.equal(phase.cadence.kind, "Gate");
    assert.equal(phase.cadence.cadence.kind, "After");
    const dueAt = edge.before.machine.armedAt + phase.cadence.cadence.delayMs;
    assert.ok(dueAt > edge.backAt);
    const samples = [dueAt - 1, dueAt, dueAt + 1000].map((at) => ({
      at,
      withReturn: residentMachine(edge.after).due(at),
      withoutReturn: residentMachine(edge.before).due(at),
    }));
    assert.ok(samples.every((sample) => sample.withReturn === null));
    assert.equal(samples[1].withoutReturn, dueAt);
    const control = residentMachine(edge.before);
    control.due(dueAt);
    control.dispatch("offline-control");
    assert.throws(
      () => residentMachine(edge.after).dispatch("offline-control"),
      /not ready/,
    );
    receipt.returnCancellation = fact({
      method:
        "Replay retained prefix immediately before and through back; portfolioSelection plus residentRefusal establish eligibility; compare due/dispatch with and without the edge using residentMachine, the runtime under examination",
      preBackCandidateEligible: "activation" in selection,
      preBackInFlight: edge.before.machine.current !== null,
      pendingDueAt: dueAt,
      backBeforeDueMs: dueAt - edge.backAt,
      stateAtBack: edge.after.machine.state,
      postBackDispatches: original.returnCancellation.value.postBackDispatches,
      postBackActivations:
        original.returnCancellation.value.postBackActivations,
      remainingEpisodeBudget:
        receipt.budget.value.ceiling.episodes - edge.before.portfolio.episodes,
      samples,
      controlDispatchAccepted: control.current !== null,
      returnedDispatchRejected: true,
      limit:
        "Offline runtime replay, not an independent policy implementation or a live wait to due time.",
    });
    Object.assign(receipt.curveShape.value, {
      phaseAfterPeakBeforeBack: edge.before.machine.state,
      nextCandidate: selection.activation.order.candidateId,
      episodesUsed: edge.before.portfolio.episodes,
      episodesCeiling: receipt.budget.value.ceiling.episodes,
      budgetMethod: receipt.budget.value.method,
    });
    receipt.generatorProvenance = fact({
      source: "VER-001 m4",
      observation:
        "Second window used the filed seed, run and baseline; bind/presence commands and location edits were not captured as a complete replayable shell transcript.",
    });
  } else {
    const mission = load(location.missionStore);
    const missionLaunches = mission.events
      .filter((event) => event.type === "CliWorkerObserved")
      .map((event) => {
        const launch = event.payload.worker.launch;
        return {
          launch: claim({
            transport: launch.transport,
            version: launch.harnessVersion,
            model: launch.model,
            effort: launch.effort,
            profileId: launch.profileId,
          }),
          effectiveIdentity: unknown(
            "No effective mission-episode identity readback.",
          ),
        };
      });
    assert.equal(missionLaunches.length, 1);
    Object.assign(receipt.mission.value, {
      subject:
        "WO-111 DotLn worktree, bound as WO-111-1; not the scratch portfolio orders",
      composition:
        "separate resident and store running alongside the portfolio",
      holdScope:
        "mission store only; no non-mission actor was bound there, so the hold refused no work",
      portfolioDispatchHeld: log.state.dispatchHeld ?? null,
      explanation:
        "Accurate contract:surfaces drift over docs/lineage/decisions-index.md; the declared surfaces omitted that changed path.",
      episodes: missionLaunches,
    });
    receipt.returnCausality = unknown(
      "The portfolio's three-episode budget was exhausted before back. The separate mission-store hold was not a cause of portfolio stopping.",
    );
    receipt.generatorProvenance = fact({
      source: "VER-001 m4",
      observation:
        "First-window seed/run/baseline/mission files were edited after launch; launchpad also had a manual synthetic grant-registry commit. The filed generators are not an exact reproduction of that window's preparation; raw stores preserve what ran.",
    });
    rows.push(
      ...projection(mission, "mission", original.window.value.missionAwayAt),
    );
  }
  const eventsName = `${stem}events-v2.json`;
  const eventsText = output(eventsName, rows, check);
  receipt.eventStream = fact({
    path: eventsName,
    rows: rows.length,
    sha256: sha(eventsText),
    fields: [
      "stream",
      "index",
      "atOffsetMs",
      "type",
      "selected sanitized payload fields",
    ],
    method:
      "All resident events in original order per store; portfolio offsets use awayAt, mission offsets use missionAwayAt, configured events use null because their timestamp is logical zero. Both streams use the same projection; refusals include reason.",
  });
  output(`${stem}receipt-v2.json`, receipt, check);
  console.log(
    JSON.stringify({
      receipt: `${stem}receipt-v2.json`,
      rows: rows.length,
      launches: launches.length,
      criterion2: "unmet",
      check,
    }),
  );
}
assert.ok(
  ["collect", "check"].includes(process.argv[2]),
  "usage: node docs/evidence/WO-111/repair-receipts.mjs collect|check",
);
collect(false, process.argv[2] === "check");
collect(true, process.argv[2] === "check");
