import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { foldVertical } from "../../../packages/skeleton/dist/src/vertical.js";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const evidence = fileURLToPath(new URL("./", import.meta.url));
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const directory = json(
  join(root, "docs/control/local/wo118-run.json"),
).directory;
const local = json(join(directory, "run-result.json"));
const receipt = json(join(evidence, "initial-run.json"));
const rows = (file) => decodeLog(readFileSync(file, "utf8"));
const resident = rows(join(directory, "store/events.jsonl"));
const vertical = rows(
  join(directory, "store/vertical", local.key, "events.jsonl"),
);
const source = rows(
  join(directory, "store/vertical", local.key, "source/events.jsonl"),
);
const state = vertical.reduce(foldVertical, undefined);
assert.equal(state.terminal.kind, "refused");
assert.equal(state.terminal.step, "source-change");
assert.equal(state.terminal.reason, receipt.terminal.reason);
assert.equal(
  source.filter((event) => event.type === "WorkerAttemptStarted").length,
  1,
);
assert.deepEqual(
  source.map((event) => event.type),
  receipt.sourceEventTypes,
);
assert(source.some((event) => event.type === "WorkerInterrupted"));
assert(source.some((event) => event.type === "SourceChangeProcessStopped"));
const admission = resident.find((event) => event.type === "IntentAdmitted");
assert.equal(
  admission.payload.binding.baselineAssessment.producer.kind,
  "model",
);
assert.equal(admission.payload.binding.key, local.key);
assert.equal(
  resident.filter((event) => event.type === "IntentAdmitted").length,
  1,
);
const actions = json(join(directory, "actions.json"));
assert.equal(
  actions.filter((action) => action.type === "resident-start").length,
  2,
);
assert.equal(
  actions.filter((action) => action.type === "resident-exit").length,
  2,
);
assert.equal(
  actions.filter((action) => action.type === "actor-kill").length,
  1,
);
const restart = Date.parse(
  actions.find((action) => action.type === "resident-SIGTERM").at,
);
const firstStep = vertical.find(
  (event) => event.type === "VerticalStepCompleted",
);
const secondStep = vertical.filter(
  (event) => event.type === "VerticalStepCompleted",
)[1];
assert(firstStep.occurredAt <= restart && restart < secondStep.occurredAt);
const observed = resident
  .filter(
    (event) =>
      event.type === "OperatorPresenceObserved" &&
      event.payload.origin === "human",
  )
  .map((event) => ({
    store: "resident",
    eventId: event.eventId,
    type: event.type,
    purpose: "setup",
  }));
const controls = join(directory, "instance/docs/control/orders");
for (const name of readdirSync(controls).sort()) {
  if (!name.endsWith(".jsonl")) continue;
  const events = readFileSync(join(controls, name), "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  for (const event of events) {
    if (
      event.type !== "WorkOrderIdentityAllocated" ||
      event.provenance?.kind !== "intent"
    )
      continue;
    observed.push({
      store: "instance-control",
      eventId: `${event.workOrderId}:WorkOrderIdentityAllocated`,
      type: event.type,
      purpose:
        event.workOrderId === admission.payload.draftId
          ? "initial-intent"
          : "ambiguous-control-intent",
    });
  }
}
assert.deepEqual(observed, json(join(evidence, "human-events.json")));
assert.equal(observed.length, 3);
const target = join(directory, "target");
assert.equal(
  execFileSync("/bin/pwd", ["-P"], { cwd: target, encoding: "utf8" }).trim(),
  target,
);
assert.equal(
  execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: target,
    encoding: "utf8",
  }).trim(),
  target,
);
assert.equal(
  execFileSync(
    "git",
    ["rev-list", "--count", `main..fix/intent-${local.key}`],
    { cwd: target, encoding: "utf8" },
  ).trim(),
  "0",
);
for (const measure of json(join(evidence, "measures.json"))) {
  assert(["observed", "launch-claim", "unknown"].includes(measure.label));
  assert(measure.method && measure.evidence);
}
console.log(
  "Initial run evidence agrees: terminal refusal, one killed source attempt, zero commits, same admitted identity across restart, three declared human-origin events, labeled measures.",
);
