import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { measuredLaneRequest } from "../../../scripts/measure-lanes.mjs";
const files = [
  "structural-need.json",
  "structural-attempt001.json",
  "structural-attempt002.json",
];
const records = files.map((file) =>
  JSON.parse(readFileSync(new URL(file, import.meta.url))),
);
const [complete] = records;
assert.equal(complete.runs.length, 42);
assert.ok(complete.runs.every((row) => row.exitCode === 0));
assert.ok(
  records.every(
    (record) =>
      record.capacity === complete.capacity &&
      record.taskBudgetBytes === complete.taskBudgetBytes,
  ),
);
const tasks = {};
for (const task of Object.keys(complete.requests)) {
  const samples = records
    .flatMap((record) => record.runs)
    .filter((row) => row.task === task && row.exitCode === 0);
  const observedNeed = measuredLaneRequest(
    samples,
    complete.capacity,
    complete.taskBudgetBytes,
  );
  tasks[task] = {
    successfulSamples: samples.length,
    completeSeriesNeed: complete.requests[task],
    observedNeed,
    qualifies: observedNeed < complete.capacity / 2,
    hostRequest:
      observedNeed < complete.capacity / 2 ? observedNeed : complete.capacity,
  };
}
const result = {
  command: "node docs/evidence/WO-229/size-requests.mjs",
  capacity: complete.capacity,
  sources: files,
  method:
    "Keep every successful observation from the retained attempts when sizing. A failure in another task does not erase a larger successful resource observation. Apply the strict half-capacity bound to the conservative integer need.",
  tasks,
};
writeFileSync(
  new URL("sizing.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result));
