#!/usr/bin/env node
// Run the existing WO-099 mission-check actor beside the live portfolio.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { ResidentHost } from "../../../packages/skeleton/dist/src/resident-host.js";
import { replayResident } from "../../../packages/skeleton/dist/src/resident-store.js";

const location = JSON.parse(
  readFileSync(
    join(TOOL_ROOT, "docs/control/local/wo111/location.json"),
    "utf8",
  ),
);
const store = location.missionStore;
const logPath = join(store, "events.jsonl");
function observation() {
  const log = existsSync(logPath) ? readFileSync(logPath, "utf8") : "";
  const events = decodeLog(log);
  const state = replayResident(log).state.resident;
  return {
    present: state?.present ?? true,
    phase: state?.machine?.state ?? null,
    dispatches: events.filter(
      (event) => event.type === "ScriptEpisodeDispatched",
    ).length,
    results: events
      .filter((event) => event.type === "CliWorkerObserved")
      .map((event) => ({
        verdict:
          event.payload.worker?.result?.judgment?.verdict ??
          state?.missionChecks?.[event.payload.episodeId]?.verdict ??
          "unknown",
        verified: event.payload.verified,
      })),
    holds: events.filter((event) => event.type === "MissionDriftObserved")
      .length,
    events: events.length,
  };
}

async function main() {
  const config = JSON.parse(readFileSync(join(store, "resident.json"), "utf8"));
  const host = new ResidentHost({
    directory: store,
    policyId: config.policyId,
    configuration: config,
  });
  const controller = new AbortController();
  const startedAt = Date.now();
  let seenAway = false;
  let lastProgress = startedAt;
  const pulse = setInterval(() => {
    const seen = observation();
    if (!seen.present) seenAway = true;
    if (Date.now() - lastProgress >= 60_000) {
      console.log(
        JSON.stringify({
          elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000),
          ...seen,
        }),
      );
      lastProgress = Date.now();
    }
    if (seenAway && seen.present) controller.abort();
  }, 1000);
  try {
    await host.run({ tickMs: 1000, signal: controller.signal });
  } finally {
    clearInterval(pulse);
    const endedAt = Date.now();
    writeFileSync(
      join(location.root, "mission.json"),
      `${JSON.stringify({ startedAt, endedAt, elapsedMs: endedAt - startedAt, observation: observation() }, null, 2)}\n`,
      { flag: "wx", mode: 0o600 },
    );
    console.log(
      JSON.stringify({
        elapsedSeconds: Math.floor((endedAt - startedAt) / 1000),
        ...observation(),
      }),
    );
  }
}

if (process.argv[2] === "status") console.log(JSON.stringify(observation()));
else if (process.argv[2] === "run") await main();
else throw new Error("usage: node docs/evidence/WO-111/mission.mjs status|run");
