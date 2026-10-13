// Replays the ledger of the status test for finished continuations through a
// pre-repair projection and the current build, and prints what each shows.
// The ledger holds twenty resolved, three refused, one terminal NeedsHuman,
// one terminal repair, one paused and one running continuation, plus one
// admission hold. Before the repair every continuation that ever started a
// step keeps a vertical-host row; after it only the paused and running ones do.
// Usage: node docs/evidence/WO-118/probe-status-retirement.mjs
//   [pre-repair runtime-status.js] [current runtime-status.js]
// The default pre-repair module is the one the visibility run exported, which
// the ignored local pointer docs/control/local/wo118-visibility.json locates.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repository = fileURLToPath(new URL("../../../", import.meta.url));
const dist = join(repository, "packages/skeleton/dist/src");
const before =
  process.argv[2] ??
  join(
    JSON.parse(
      readFileSync(
        join(repository, "docs/control/local/wo118-visibility.json"),
        "utf8",
      ),
    ).instance,
    "packages/skeleton/dist/src/runtime-status.js",
  );
const after = process.argv[3] ?? join(dist, "runtime-status.js");
const { verticalProgram } = await import(
  pathToFileURL(join(dist, "vertical.js")).href
);

// Every command of one continuation, with the identities a recorded log uses.
const commands = (key) => {
  const found = [];
  const pending = [verticalProgram(key)];
  const seen = new Set();
  while (pending.length) {
    const program = pending.shift();
    if (seen.has(program)) continue;
    seen.add(program);
    if (program.kind !== "Invoke") continue;
    found.push(program.command.payload);
    pending.push(...Object.values(program.continuationByResult));
  }
  return found;
};
let at = 0;
const events = [];
const intents = {};
const record = (type, payload) =>
  events.push({
    eventId: `evt_${events.length + 1}`,
    type,
    actorId: "resident-host",
    occurredAt: ++at,
    payload,
  });
const admit = (draftId) => {
  const key = `intent_${draftId.toLowerCase()}`;
  intents[draftId] = { kind: "admitted", binding: { key } };
  return key;
};
const command = (key, step) =>
  commands(key).find((c) => c.step === step && c.round === 0);
const start = (key, step) => {
  record("IntentStepStarted", { key, commandId: command(key, step).commandId });
  return command(key, step);
};
const settle = (key, step, result, terminal) =>
  record("IntentStepSettled", {
    key,
    commandId: command(key, step).commandId,
    result,
    terminal,
  });
const run = (key, last, result) => {
  start(key, "bundle");
  settle(key, "bundle", "completed", false);
  start(key, last);
  settle(key, last, result, true);
};
for (let n = 0; n < 20; n++)
  run(admit(`WO-${900 + n}`), "resolution", "completed");
for (const draftId of ["WO-920", "WO-921", "WO-922"])
  run(admit(draftId), "source-change", "refused");
run(admit("WO-923"), "contract", "NeedsHuman");
run(admit("WO-924"), "review", "repair");
const paused = admit("WO-925");
start(paused, "bundle");
settle(paused, "bundle", "completed", false);
const running = admit("WO-926");
start(running, "bundle");
settle(running, "bundle", "completed", false);
const live = start(running, "source-change");
intents["WO-927"] = { kind: "NeedsHuman", step: "contract", reason: "held" };
const counts = (view) => ({
  verticalRows: view.actors.filter((row) => row.kind === "vertical-host")
    .length,
  liveEpisodes: view.liveEpisodes.length,
  holds: view.holds.length,
});
const report = {};
for (const [label, path] of [
  ["preRepair", before],
  ["repaired", after],
]) {
  const { projectRuntimeStatus } = await import(pathToFileURL(path).href);
  const view = projectRuntimeStatus(
    {
      at: ++at,
      intents,
      intentStep: { key: running, commandId: live.commandId },
    },
    events,
    null,
  );
  report[label] = { whileRunning: counts(view) };
}
// Settle the running step terminally and project again.
settle(running, "source-change", "completed", true);
for (const [label, path] of [
  ["preRepair", before],
  ["repaired", after],
]) {
  const { projectRuntimeStatus } = await import(pathToFileURL(path).href);
  report[label].afterRunningSettles = counts(
    projectRuntimeStatus({ at: ++at, intents, intentStep: null }, events, null),
  );
}
console.log(JSON.stringify(report));
