// Reproduce the repaired census finding independently of census-check.mjs.
// This reads the candidate, its preserved records and Git; it changes no file.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { closeoutChanges } from "../../../scripts/lib/closeout-scope.mjs";
import {
  readControl,
  eventsForOrder,
} from "../../../scripts/lib/control-store.mjs";
import { changedAgainstMain } from "../../../scripts/lib/planning-followups.mjs";
import { gateCodeIdentity } from "../../../scripts/lib/gate-evidence.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" });
const decisionsPath = "docs/evidence/WO-243/decisions.md";
const reportPath = "docs/verifications/WO-243/VER-001.md";
const decisions = readFileSync(join(root, decisionsPath), "utf8");
const section = (text, id) => {
  const start = text.indexOf(`\n## WO-243-${id}`);
  assert.ok(start >= 0, `${id} exists`);
  const next = text.indexOf("\n## WO-243-D", start + 1);
  return text.slice(start, next < 0 ? undefined : next);
};
const d017 = section(decisions, "D017");
const rows = d017.split("\n").filter((line) => line.startsWith("| `"));
const repaired = rows.find((line) =>
  line.startsWith("| `scripts/lib/planning-followups.mjs`"),
);
assert.ok(repaired, "the repaired census names the previously missing reader");
for (const name of [
  "changedAgainstMain",
  "scripts/lib/lifecycle-evidence.mjs",
  "scripts/refute-plan.mjs",
  "merge-base HEAD main origin/main",
  "Kept:",
])
  assert.ok(repaired.includes(name), `the row records ${name}`);
assert.equal(rows.length, 8, "the repair records eight consumer dispositions");
assert.equal(
  section(decisions, "D006"),
  section(
    git("show", `refs/dotln/checkpoint/WO-243/7:${decisionsPath}`),
    "D006",
  ),
  "D006 remains the original immutable record",
);
assert.equal(
  readFileSync(join(root, reportPath), "utf8"),
  git("show", `refs/dotln/checkpoint/WO-243/7:${reportPath}`),
  "VER-001 remains the original immutable report",
);
const productRepairDiff = git(
  "diff",
  "--name-only",
  "refs/dotln/checkpoint/WO-243/7",
  "refs/dotln/checkpoint/WO-243/9",
  "--",
  "scripts",
  "packages",
  "package.json",
  "package-lock.json",
).trim();
assert.equal(
  productRepairDiff,
  "",
  "the repair changes no product source or dependencies",
);
const activation = eventsForOrder(readControl(root), "WO-243").findLast(
  (event) => event.type === "WorkOrderActivated",
);
const activationBase = git("rev-parse", `${activation.checkpointSha}^1`).trim();
const selectionBase = closeoutChanges(root, "WO-243").base;
const followupBase = changedAgainstMain(root).base;
assert.equal(
  selectionBase,
  activationBase,
  "the current selection reads its activation base",
);
assert.equal(
  followupBase,
  selectionBase,
  "the repaired reader returns that base on this subject",
);

// Broader terms than the repair check uses: event consumers, alternate Git
// range/base spellings and the start's own base are retained for manual review.
const patterns =
  /merge-base|fork-point|--merge-base|merge-tree|@\{upstream\}|WorkOrderActivated|launchpadBase|integration\.json|receiptFile\(|integrationReceiptPath\(|(?:latestCheckpoint|checkpoint)(?:Sha|Ref)|\.{2,3}(?:HEAD|main)|(?:HEAD|main)\.{2,3}/u;
const runtime = (path) =>
  /\.(?:mjs|cjs|js|ts|sh)$/u.test(path) &&
  !/(?:^|\/)(?:test|fixtures|dist|node_modules)\/|\.test\.(?:mjs|cjs|js|ts)$|^scripts\/test-(?!runner\.mjs$)/u.test(
    path,
  );
const files = [
  ...new Set(
    git(
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "-z",
      "--",
      "scripts",
      "packages",
    ).split("\0"),
  ),
]
  .filter(runtime)
  .filter((path) => existsSync(join(root, path)))
  .sort();
const sites = [];
for (const file of files) {
  const lines = readFileSync(join(root, file), "utf8").split("\n");
  lines.forEach((text, index) => {
    if (patterns.test(text)) sites.push({ file, line: index + 1, text });
  });
}
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      workOrder: "WO-243",
      criterion: "3",
      recordedAt: new Date().toISOString(),
      codeIdentity: gateCodeIdentity(root),
      result: "pass",
      checks: {
        missingReaderAndCallersNamed: true,
        repairRows: rows.length,
        originalCensusUnchanged: true,
        originalReportUnchanged: true,
        productRepairDiff: [],
        activationBase,
        selectionBase,
        followupBase,
      },
      independentSweep: {
        scope:
          "runtime scripts/ and packages/; tests, fixtures, dist and installed dependencies excluded",
        files: files.length,
        matchedLines: sites.length,
        disposition:
          "Manually reviewed with D006 and D017; event timing/position, main's tip, target bases, ancestry predicates and command allowlists add no omitted comparison-base reader.",
        sites,
      },
    },
    null,
    2,
  ),
);
