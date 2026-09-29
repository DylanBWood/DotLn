// Read an existing DotLn publication; record shapes only. No remote mutation.
// node docs/evidence/WO-065/smoke.mjs --store <episode-store> --number <N>
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { observePullRequest } from "../../../scripts/lib/pull-request-observer.mjs";
import { executeGh } from "../../../scripts/lib/github-repository.mjs";
const root = fileURLToPath(new URL("../../../", import.meta.url));
const [storeFlag, directory, numberFlag, rawNumber, ...extra] =
  process.argv.slice(2);
assert.ok(
  storeFlag === "--store" &&
    directory &&
    numberFlag === "--number" &&
    /^[1-9][0-9]*$/.test(rawNumber ?? "") &&
    !extra.length,
  "usage: node docs/evidence/WO-065/smoke.mjs --store <episode-store> --number <N>",
);
const store = resolve(directory),
  number = Number(rawNumber);
const events = () =>
  decodeLog(readFileSync(join(store, "publication/events.jsonl"), "utf8"));
const before = events();
const result = observePullRequest({ cwd: root, store, number });
assert.equal(
  result.appended,
  true,
  "use a publication with no current observation for this smoke",
);
const after = events();
assert.equal(after.length, before.length + 1);
const opened = before.find(
  (e) => e.type === "PullRequestOpened" && e.payload.number === number,
);
const event = after.at(-1);
assert.equal(event.causationId, opened.eventId);
assert.equal(event.correlationId, opened.correlationId);
const again = spawnSync(
  process.execPath,
  [
    join(root, "scripts/worktree.mjs"),
    "observe-pr",
    "--store",
    store,
    "--number",
    String(number),
  ],
  { cwd: root, encoding: "utf8" },
);
assert.equal(again.status, 0, "second observation CLI failed");
assert.equal(
  events().length,
  after.length,
  "remote state changed during smoke; inspect before rerunning",
);
const view = executeGh(root, [
  "pr",
  "view",
  String(number),
  "--repo",
  result.payload.repositoryId,
  "--json",
  "headRefOid,number,state",
]);
assert.equal(view.status, 0, "independent gh view failed");
const observed = JSON.parse(view.stdout);
assert.equal(result.payload.headSha, observed.headRefOid);
assert.equal(result.payload.number, observed.number);
const version = executeGh(root, ["--version"]);
const receipt = {
  schemaVersion: 1,
  recordedAt: new Date().toISOString(),
  runner: "executor under explicit operator scratch-repository authorization",
  node: process.version,
  gh: version.stdout.match(/^gh version (\S+)/)?.[1] ?? "unknown",
  target: {
    repository: "github.com/<owner>/<scratch-repository>",
    number: "positive-integer",
    state: observed.state,
  },
  event: {
    type: event.type,
    actorId: event.actorId,
    payloadKeys: Object.keys(event.payload).sort(),
    repositoryIdShape: "github.com/<owner>/<repository>",
    headShaShape: "sha1-hex-40",
    headMatchesIndependentView: true,
    numberMatchesIndependentView: true,
    causationMatchesOpened: true,
    correlationMatchesOpened: true,
    appendedCount: after.length - before.length,
    secondObservationAppendedCount: 0,
    checks: result.payload.checks.length,
    comments: result.payload.comments.length,
    classes: [...new Set(result.payload.comments.map((c) => c.class))].sort(),
  },
  limit:
    "This scratch PR may have no checks or review comments; recorded synthetic fixtures establish classification, pagination and privacy behavior.",
};
assert.match(result.payload.headSha, /^[a-f0-9]{40}$/);
writeFileSync(
  new URL("./smoke.json", import.meta.url),
  JSON.stringify(receipt, null, 2) + "\n",
  { flag: "wx" },
);
console.log(
  "Live observation and CLI dedup passed; wrote shape-reduced smoke.json.",
);
