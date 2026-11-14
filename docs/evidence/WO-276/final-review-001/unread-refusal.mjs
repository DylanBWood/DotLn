// Final review of WO-276: a resident whose command-line adapter holds no
// reader of mission documents, as the package's own entry builds it, is
// given a mission check. This runs such a resident over the mission fixture,
// with a process double in the command-line worker's place so that no model
// runs, and prints whether anything an operator reads (the event log, the
// runtime status, the status and audit commands) names scripts/resident.mjs,
// and the reason the hold records. Adapted from the review worker's probe.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const repo = process.cwd();
const dist = (path) => import(pathToFileURL(join(repo, path)).href);
const { missionFixture, missionRunner } = await dist(
  "packages/skeleton/dist/test/mission-check.fixture.js",
);
const { ResidentHost } = await dist(
  "packages/skeleton/dist/src/resident-host.js",
);
const { recordPresence, replayResident } = await dist(
  "packages/skeleton/dist/src/resident-store.js",
);
const { actorCatalog } = await dist(
  "packages/skeleton/dist/src/actor-catalog.js",
);
const { cliWorkerAdapter } = await dist(
  "packages/skeleton/dist/src/cli-actor.js",
);
const scriptDouble = {
  script: {
    kind: "script",
    available: () => null,
    run: () => ({
      completed: Promise.resolve({
        exitCode: 0,
        signal: null,
        stdoutSha256:
          "dc51b8c96c2d745df3bd5590d990230a482fd247123599548e0632fdbf97fc22",
        firstLine: "ok",
        verified: true,
        reason: "completed",
      }),
      kill: () => {},
    }),
  },
};
const fixture = missionFixture();
mkdirSync(fixture.directory, { recursive: true });
let at = 0;
const host = new ResidentHost({
  directory: fixture.directory,
  policyId: fixture.configuration.policyId,
  configuration: fixture.configuration,
  now: () => at,
  capabilities: () => ["adapter.fixture"],
  catalog: {
    ...actorCatalog,
    ...scriptDouble,
    "cli-worker": cliWorkerAdapter({
      version: "0.154.0",
      runner: missionRunner(() => ({
        schemaVersion: "mission-check-v1",
        verdict: "on-mission",
        findings: [],
      })),
    }),
  },
});
let result;
try {
  await host.start();
  await recordPresence(fixture.directory, "away", () => at);
  for (at of [10, 20, 30]) await host.tick();
  const log = host.store.read();
  const held = replayResident(log).state.resident?.dispatchHeld ?? null;
  const status = readFileSync(
    join(fixture.directory, "runtime-status-v1.json"),
    "utf8",
  );
  const command = (name) =>
    spawnSync(
      process.execPath,
      [
        join(repo, "packages/skeleton/dist/src/dotln.js"),
        name,
        "--store",
        fixture.directory,
      ],
      { encoding: "utf8" },
    ).stdout;
  const names = (text) => text.includes("resident.mjs");
  result = {
    holdReason: held ? held.reason.replace(held.episodeId, "<episode>") : null,
    eventLogNamesTheLauncher: names(log),
    runtimeStatusNamesTheLauncher: names(status),
    statusCommandNamesTheLauncher: names(command("status")),
    auditCommandNamesTheLauncher: names(command("audit")),
  };
} finally {
  host.close();
  fixture.dispose();
}
console.log(JSON.stringify(result, null, 2));
