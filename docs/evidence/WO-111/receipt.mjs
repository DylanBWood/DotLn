#!/usr/bin/env node
// Reduce retained local WO-111 logs to closed, public synthetic facts.
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
    join(TOOL_ROOT, "docs/control/local/wo111/location.json"),
    "utf8",
  ),
);
const raw = (path) => JSON.parse(readFileSync(path, "utf8"));
const fact = (value) => ({ epistemic: "observed", value });
const claim = (value) => ({ epistemic: "launch-claim", value });
const unknown = (reason) => ({ epistemic: "unknown", value: null, reason });
const sha = (text) => createHash("sha256").update(text).digest("hex");
const git = (cwd, ...args) =>
  execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    timeout: 15000,
  }).trim();
const logs = (store) => {
  const text = readFileSync(join(store, "events.jsonl"), "utf8");
  return {
    events: decodeLog(text),
    state: replayResident(text).state.resident,
  };
};
const presenceAt = (events, kind) =>
  events.find(
    (event) =>
      event.type === "OperatorPresenceObserved" &&
      event.payload.origin === "human" &&
      event.payload.signal?.kind === kind,
  )?.occurredAt;
const eventRow = (stream, index, event, awayAt) => {
  const row = {
    stream,
    index,
    atOffsetMs: event.occurredAt - awayAt,
    type: event.type,
  };
  if (event.type === "OperatorPresenceObserved")
    row.presence = {
      origin: event.payload.origin,
      kind: event.payload.signal?.kind ?? "unknown",
    };
  if (event.type === "ScriptEpisodeDispatched")
    row.dispatch = { phase: event.payload.phaseId, kind: event.payload.kind };
  if (event.type === "PortfolioOrderActivated")
    row.activation = {
      phase: event.payload.activation.phaseId,
      candidate: event.payload.activation.order.candidateId,
      sizeFiles: event.payload.activation.order.size.files,
    };
  if (event.type === "PortfolioOrderObserved")
    row.outcome = {
      verified: event.payload.verified,
      change: event.payload.portfolio?.change?.status ?? "none",
      verdict: event.payload.portfolio?.verification?.verdict ?? "not-run",
    };
  if (event.type === "ScriptEpisodeObserved")
    row.discovery = {
      verified: event.payload.verified,
      candidates: event.payload.discovery?.candidates?.length ?? null,
    };
  if (event.type === "CliWorkerObserved")
    row.mission = { verified: event.payload.verified };
  if (event.type === "ScriptEpisodeRefused") row.refused = true;
  return row;
};

export function collect() {
  const run = raw(join(location.root, "run.json"));
  const missionRun = raw(join(location.root, "mission.json"));
  const windowBaseline = raw(join(location.root, "window-baseline.json"));
  const portfolio = logs(location.store);
  const mission = logs(location.missionStore);
  const awayAt = presenceAt(portfolio.events, "away");
  const backAt = presenceAt(portfolio.events, "back");
  const missionAwayAt = presenceAt(mission.events, "away");
  const missionBackAt = presenceAt(mission.events, "back");
  assert.ok(
    awayAt && backAt && missionAwayAt && missionBackAt,
    "both human presence edges are required in both stores",
  );
  const activated = new Map(
    portfolio.events
      .filter((event) => event.type === "PortfolioOrderActivated")
      .map((event) => [event.payload.episodeId, event.payload.activation]),
  );
  const orders = portfolio.events
    .filter((event) => event.type === "PortfolioOrderObserved")
    .map((event) => {
      const activation = activated.get(event.payload.episodeId);
      assert.ok(activation, "every order result has a durable activation");
      const result = event.payload.portfolio;
      const changedPaths =
        result?.change.status === "observed"
          ? git(
              location.target,
              "diff",
              "--no-ext-diff",
              "--no-renames",
              "--name-only",
              location.baseCommit,
              result.change.commit,
            )
              .split("\n")
              .filter(Boolean)
          : [];
      return {
        phase: activation.phaseId,
        candidate: activation.order.candidateId,
        surfaces: activation.order.surfaces,
        changedPaths,
        sourceChange: result?.change.status ?? "none",
        commit:
          result?.change.status === "observed" ? result.change.commit : null,
        verification: result?.verification ?? { verdict: "not-run" },
        verified: event.payload.verified,
        atOffsetMs: event.occurredAt - awayAt,
      };
    });
  const candidateReport =
    portfolio.state.discovery?.report.candidates.map((candidate) => ({
      kind: candidate.kind,
      paths: candidate.paths,
      evidenceRefs: candidate.evidence.length,
    })) ?? [];
  const missionChecks = Object.values(mission.state.missionChecks ?? {}).map(
    (value) => value.verdict,
  );
  const missionFindings = (mission.state.dispatchHeld?.findings ?? []).map(
    (finding) => ({
      kind: finding.kind,
      reference: finding.reference,
      reason: finding.reason,
    }),
  );
  const allEvents = [
    ...portfolio.events.map((event, index) =>
      eventRow("portfolio", index, event, awayAt),
    ),
    ...mission.events.map((event, index) =>
      eventRow("mission", index, event, missionAwayAt),
    ),
  ];
  const eventsText =
    allEvents.map((row) => JSON.stringify(row)).join("\n") + "\n";
  const boundary = {
    mainCheckoutUnchanged:
      JSON.stringify(windowBaseline.main) === JSON.stringify(run.after.main),
    selectedCheckoutUnchanged:
      JSON.stringify(windowBaseline.selected) ===
      JSON.stringify(run.after.selected),
    targetMainUnchanged:
      JSON.stringify(windowBaseline.target) ===
      JSON.stringify(run.after.target),
    sentinelUnchanged: windowBaseline.sentinel === run.after.sentinel,
    templateUnchanged: run.before.template === run.after.template,
    zeroRemotesBeforeAndAfter:
      Object.values(run.before.remotes).every((count) => count === 0) &&
      Object.values(run.after.remotes).every((count) => count === 0),
    launchpadConfigurationUnchanged:
      readFileSync(join(location.launchpad, "dotln.config.json"), "utf8") ===
      git(location.launchpad, "show", "HEAD:dotln.config.json") + "\n",
  };
  const postBackDispatches = portfolio.events.filter(
    (event) =>
      event.type === "ScriptEpisodeDispatched" && event.occurredAt > backAt,
  ).length;
  const postBackMissionDispatches = mission.events.filter(
    (event) =>
      event.type === "ScriptEpisodeDispatched" &&
      event.occurredAt > missionBackAt,
  ).length;
  const result = {
    schemaVersion: 1,
    workOrder: "WO-111",
    seed: fact({
      candidateKinds: candidateReport,
      focusedCheckExitCodesAtAway: windowBaseline.checks,
      remoteCounts: run.before.remotes,
    }),
    workerLaunch: claim({
      transport: "codex-cli-exec",
      version: "0.156.1",
      model: "gpt-6-sol",
      effort: "xhigh",
    }),
    effectiveWorkerIdentity: unknown(
      "The CLI transport returns no effective model and effort readback for each episode.",
    ),
    window: fact({
      awayAt,
      backAt,
      durationMs: backAt - awayAt,
      missionAwayAt,
      missionBackAt,
      postBackDispatches,
      postBackMissionDispatches,
      runnerStoppedAfterBackMs: run.endedAt - backAt,
      missionStoppedAfterBackMs: missionRun.endedAt - missionBackAt,
    }),
    progression: fact(orders),
    mission: fact({
      dispatches: mission.events.filter(
        (event) => event.type === "ScriptEpisodeDispatched",
      ).length,
      verdicts: missionChecks,
      findings: missionFindings,
      holds: mission.events.filter(
        (event) => event.type === "MissionDriftObserved",
      ).length,
    }),
    budget: fact({
      method:
        "resident fold over admitted portfolio outcomes and recorded timestamps; token count includes only actor-reported tokens",
      consumed: {
        episodes: portfolio.state.portfolio.episodes,
        wallMs: portfolio.state.portfolio.wallMs,
        tokens: portfolio.state.portfolio.tokens,
      },
      ceiling: { episodes: 3, wallMs: 3600000 },
    }),
    protectedSurfaces: fact({
      ...boundary,
      mainHeadBefore: run.before.main.head,
      mainHeadAfter: run.after.main.head,
    }),
    eventStream: fact({
      path: "events.jsonl",
      rows: allEvents.length,
      sha256: sha(eventsText),
      fields: [
        "stream",
        "index",
        "atOffsetMs",
        "type",
        "selected sanitized payload fields",
      ],
    }),
    outsideHostFilesystem: unknown(
      "The host observes the selected checkout, target main, launchpad configuration, sentinel and local Git remotes; it cannot inventory every other host path or network endpoint.",
    ),
    actualEpisodeTokens: unknown(
      "The portfolio actors did not report token usage; zero reported tokens is not zero model usage.",
    ),
    returnCausality: unknown(
      "The portfolio budget was exhausted and the mission hold was raised before back; no post-back dispatch alone cannot attribute the stop to return.",
    ),
  };
  assert.ok(
    candidateReport.length >= 6,
    "producer must discover the seeded imperfections",
  );
  assert.ok(
    Object.values(windowBaseline.checks).every((status) => status !== 0),
    "seeded checks must start red",
  );
  assert.deepEqual(
    orders.slice(0, 3).map((order) => order.phase),
    ["probe", "widen", "peak"],
  );
  assert.ok(
    orders.length >= 3 &&
      orders
        .slice(0, 3)
        .every(
          (order) => order.verified && order.verification.verdict === "pass",
        ),
  );
  assert.equal(orders[0].changedPaths.length, 1);
  assert.equal(orders[2].changedPaths.length, 2);
  assert.ok(missionChecks.length >= 1, "mission check must record a verdict");
  assert.equal(postBackDispatches, 0);
  assert.equal(postBackMissionDispatches, 0);
  assert.ok(
    Object.values(boundary).every(Boolean),
    "protected surfaces must remain unchanged",
  );
  for (const order of orders)
    assert.ok(
      order.changedPaths.every((path) => order.surfaces.includes(path)),
      "each changed path must be in its derived order",
    );
  writeFileSync(join(here, "events.jsonl"), eventsText, { flag: "wx" });
  writeFileSync(
    join(here, "receipt.json"),
    `${JSON.stringify(result, null, 2)}\n`,
    { flag: "wx" },
  );
  return result;
}

if (process.argv[1] && process.argv[1].endsWith("receipt.mjs")) {
  if (process.argv[2] !== "collect")
    throw new Error("usage: node docs/evidence/WO-111/receipt.mjs collect");
  const result = collect();
  console.log(
    JSON.stringify({
      orders: result.progression.value.length,
      missionVerdicts: result.mission.value.verdicts,
      eventRows: result.eventStream.value.rows,
      windowMs: result.window.value.durationMs,
    }),
  );
}
