// FINAL-001 F1 reproduction: a kit launch spelled with an npm flag after the
// script name (`npm run worker --silent -- review …`) is not recognized by the
// hook's kit-launch recognizer, so it is never charged against subagentCap,
// while the plain spelling, the flag before the script name and the node
// spelling each count one use. Observed on WO-258's executor session, whose
// helper journal holds ten WorkerLaunched rows while the hook's readback
// counts seven launches. Run from the repository root after npm run build.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { kitWorkerLaunch } from "../../../packages/skeleton/dist/src/harness-host.js";

const spellings = [
  "npm run worker -- review --kind combined --host codex --model astra --since 9725193c",
  "npm run worker --silent -- review --kind combined --host codex --model astra --since 9725193c",
  "npm run --silent worker -- review --kind combined --host codex --model astra",
  "node scripts/worker.mjs review --kind combined --host codex --model astra",
];
const recognized = spellings.map((command) => ({
  command,
  launch: kitWorkerLaunch(command),
}));
assert.deepEqual(recognized[0].launch, { uses: 1, host: "codex" });
assert.equal(
  recognized[1].launch,
  null,
  "the --silent spelling is not counted",
);
assert.deepEqual(recognized[2].launch, { uses: 1, host: "codex" });
assert.deepEqual(recognized[3].launch, { uses: 1, host: "codex" });

// The executor session's record, read on 2026-11-08: the worker helper's own
// journal rows against the hook's readback (node scripts/harness.mjs usage
// fb74ee9b-0caf-49f2-8ba5-0464930525ca). Both live in ignored local state, so
// the figures are recorded here as observed.
const observed = {
  executorSession: "fb74ee9b-0caf-49f2-8ba5-0464930525ca",
  helperJournalWorkerLaunchedRows: 10,
  usageReadbackLaunched: { total: 7, claude: 0, codex: 7 },
  reviewReportsOnDisk: 10,
  observedAt: "2026-11-08T12:48:00Z",
};
const result = {
  schemaVersion: 1,
  finding: "FINAL-001 F1 (follow-up, new-scope)",
  recognized,
  observed,
  reading:
    "kitWorkerLaunch reads the npm script's arguments with npmScriptArgs; an npm flag between the script name and -- leaves the invocation unrecognized, so the launch is neither counted nor refused at the cap. The helper's journal counts every launch, so the two records disagree by the uncounted spellings.",
};
writeFileSync(
  new URL("./final-001-kit-launch-count.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    result.recognized.map((row) => [
      row.command.split(" ").slice(0, 4).join(" "),
      row.launch,
    ]),
  ),
);
