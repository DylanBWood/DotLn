// Criterion 5 in one replayable run: the criteria review's dry run for this
// order on the Claude host, and what its brief's preamble (the text before
// the brief's own ## Brief heading) carries. Writes criterion-5-brief.json
// beside this file with the measured size the dry run prints and which of the
// three rules the preamble holds; the brief's text itself is not copied.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  operatorWordsRule,
  workerNoPrintRules,
} from "../../../packages/compiler/dist/src/index.js";

const root = resolve(import.meta.dirname, "../../..");
const output = new URL("./criterion-5-brief.json", import.meta.url);
const command = [
  "scripts/worker.mjs",
  "review",
  "--kind",
  "criteria",
  "--host",
  "claude",
  "--order",
  "WO-259",
  "--dry-run",
];
const run = spawnSync(process.execPath, command, {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
assert.equal(run.status, 0, run.stderr);
const dry = JSON.parse(run.stdout);
const preamble = dry.brief.split("\n## Brief")[0];
const record = {
  schemaVersion: 1,
  command:
    "npm run worker -- review --kind criteria --host claude --order WO-259 --dry-run",
  exitCode: run.status,
  host: dry.host,
  option: dry.option,
  report: dry.report,
  measured: dry.measured,
  briefSha256: dry.briefSha256,
  preamble: {
    characters: preamble.length,
    paraphraseRule: preamble.includes(operatorWordsRule),
    localLaneRule: preamble.includes(
      "never reads or prints the contents of `docs/control/local/`",
    ),
    authorLineRule: preamble.includes(
      "never prints a commit header or an author line",
    ),
    noPrintRulesVerbatim: preamble.includes(workerNoPrintRules),
  },
};
writeFileSync(output, JSON.stringify(record, null, 2) + "\n");
console.log(
  JSON.stringify({ measured: record.measured.brief, ...record.preamble }),
);
for (const key of ["paraphraseRule", "localLaneRule", "authorLineRule"])
  assert.equal(record.preamble[key], true, key);
assert.equal(record.measured.brief, dry.brief.length);
