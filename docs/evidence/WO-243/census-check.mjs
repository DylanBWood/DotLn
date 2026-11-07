// Check the comparison-base census against the tree it describes.
//
// A reader of a comparison base is a runtime function in scripts/ or
// packages/ (tests, fixtures, generated dist/ and installed dependencies
// excluded) that reads one of the bases the closeout selection compares
// against: the activation checkpoint, the integrate helper's receipt, or the
// branch's fork point from main (a merge base with main, a range against
// main, or a helper that returns one), together with each runtime caller of
// an exported function that reads one. Every site of such a read carries a
// disposition below: the census row that names its reader, or the class of
// site the census excludes. The check fails on a site with no disposition, a
// disposition whose site is gone, a disposition whose row the census tables
// do not hold, a census row no site supports, or an excluded class the
// census does not state.
//
// usage: node docs/evidence/WO-243/census-check.mjs [--census D006|all] [--keys]
//   --census D006  read the census as D006 left it, so the readers it omits
//                  are named (the paired control); the default reads D006
//                  and the repair's completion of it, D017
//   --keys         print each site's key and lines instead of judging them
//
// It reads files and Git's file list and changes no bytes.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runGitPathList } from "../../../scripts/lib/git.mjs";
import { gateCodeIdentity } from "../../../scripts/lib/gate-evidence.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const args = process.argv.slice(2);
const census = args.includes("--census")
  ? args[args.indexOf("--census") + 1]
  : "all";
if (!["D006", "all"].includes(census))
  throw new Error("usage: census-check.mjs [--census D006|all] [--keys]");
const sectionIds = census === "D006" ? ["D006"] : ["D006", "D017"];

// Runtime source: scripts/ and packages/, without tests, fixtures, generated
// output or installed dependencies. scripts/test-runner.mjs is the gate
// runner, runtime source despite its name.
const runtime = (path) =>
  /^(?:scripts|packages)\//u.test(path) &&
  /\.(?:mjs|cjs|js|ts|sh)$/u.test(path) &&
  !/(?:^|\/)(?:dist|node_modules|fixtures|test)\//u.test(path) &&
  !/\.test\.(?:mjs|cjs|js|ts)$/u.test(path) &&
  !/^scripts\/test-(?!runner\.mjs$)/u.test(path);

// The exported functions whose runtime callers are disposed too: those that
// read a base, closeoutScope, the selection itself, whose callers are the
// readers this order added, and changedSinceLastGate, which reads the newest
// gate row rather than a base but has a row of its own in D006.
const HELPERS = [
  "changedAgainstMain",
  "changedMachinery",
  "mergedMachinery",
  "closeoutChanges",
  "closeoutScope",
  "resolveBase",
  "reviewedLaunchpadIdentity",
  "frontPageFindings",
  "classifyDocumentFailures",
  "contributionSignoffRules",
  "changedSinceLastGate",
];
const PATTERNS = [
  { id: "merge-base", pattern: /merge-base/gu },
  { id: "symmetric-range", pattern: /\.\.\.HEAD\b|\bHEAD\.\.\./gu },
  { id: "exclusive-range", pattern: /(?<!\.)\.\.HEAD\b|\bHEAD\.\.(?!\.)/gu },
  {
    id: "checkpoint",
    pattern: /\b(?:latestCheckpoint|checkpoint)(?:Sha|Ref)s?\b/gu,
  },
  {
    id: "receipt",
    pattern: /integration\.json|\b(?:receiptFile|integrationReceiptPath)\(/gu,
  },
  ...HELPERS.map((name) => ({
    id: `call:${name}`,
    pattern: new RegExp(`\\b${name}\\(`, "gu"),
  })),
];

// A row of a census table is found by the backquoted path its first cell
// names, and by any further text that cell must hold (the function, or the
// caller a row names beside its reader). An excluded class is found by the
// phrases that state it.
const row = (section, reader, ...names) => ({ section, reader, names });
const D006 = (reader, ...names) => row("D006", reader, ...names);
const D017 = (reader, ...names) => row("D017", reader, ...names);
const CLASSES = {
  ancestry: ["**Ancestry predicates.**"],
  target: ["**Target repository bases.**", "Target-side bases"],
  allowlist: ["**Command allowlists.**"],
};
const excluded = (name) => ({ excluded: name });

const integration = "scripts/lib/worktree-integration.mjs";
const closeout = "scripts/lib/closeout-scope.mjs";
const runner = "scripts/test-runner.mjs";
const DISPOSITIONS = {
  "packages/skeleton/src/change-review-protocol.ts#CHANGE_REVIEW_SHELL#merge-base":
    excluded("allowlist"),
  "scripts/docs-check.mjs#frontPageFindings#call:frontPageFindings": D006(
    "scripts/docs-check.mjs",
  ),
  "scripts/docs-check.mjs#frontPageFindings#merge-base": D006(
    "scripts/docs-check.mjs",
  ),
  "scripts/docs-check.mjs#checkDocs#call:frontPageFindings": D006(
    "scripts/docs-check.mjs",
  ),
  "scripts/launchpad.mjs#publishUpdate#merge-base": D017(
    "scripts/launchpad.mjs",
    "`publishUpdate`",
  ),
  "scripts/lib/checkpoint.mjs#createCheckpoint#checkpoint": D006(
    "scripts/lib/checkpoint.mjs",
  ),
  [`${closeout}#integrationReceiptPath#receipt`]: D006(
    closeout,
    "`closeoutChanges`",
  ),
  [`${closeout}#readReceipt#receipt`]: D006(closeout, "`closeoutChanges`"),
  [`${closeout}#closeoutChanges#call:closeoutChanges`]: D006(
    closeout,
    "`closeoutChanges`",
  ),
  [`${closeout}#closeoutChanges#checkpoint`]: D006(
    closeout,
    "`closeoutChanges`",
  ),
  [`${closeout}#select#call:closeoutChanges`]: D006(
    closeout,
    "`closeoutChanges`",
  ),
  [`${closeout}#closeoutScope#call:closeoutScope`]: D017(
    closeout,
    "`closeoutScope`",
  ),
  "scripts/lib/contributions.mjs#contributionSignoffRules#exclusive-range":
    D017("scripts/lib/contributions.mjs", "`contributionSignoffRules`"),
  "scripts/lib/control-time.mjs#recoverControlTimes#checkpoint": D006(
    "scripts/lib/control-time.mjs",
  ),
  "scripts/lib/control.mjs#CORRECTABLE_FIELDS#checkpoint": D006(
    "scripts/lib/control.mjs",
  ),
  "scripts/lib/control.mjs#emptyState#checkpoint": D006(
    "scripts/lib/control.mjs",
  ),
  "scripts/lib/control.mjs#scanControl#checkpoint": D006(
    "scripts/lib/control.mjs",
  ),
  "scripts/lib/document-failures.mjs#classifyDocumentFailures#call:classifyDocumentFailures":
    D006("scripts/lib/document-failures.mjs"),
  "scripts/lib/document-failures.mjs#classifyDocumentFailures#merge-base": D006(
    "scripts/lib/document-failures.mjs",
  ),
  "scripts/lib/executor-readiness.mjs#closeoutBriefing#call:closeoutScope":
    D017(closeout, "`closeoutScope`", "`closeoutBriefing`"),
  "scripts/lib/executor-readiness.mjs#closeoutCompletionAdvisory#call:closeoutScope":
    D017(closeout, "`closeoutScope`", "`closeoutCompletionAdvisory`"),
  "scripts/lib/harness-prune.mjs#judgeStash#receipt": D006(
    "scripts/lib/harness-prune.mjs",
  ),
  "scripts/lib/lifecycle-evidence.mjs#requireLifecycleEvidence#call:changedAgainstMain":
    D017(
      "scripts/lib/planning-followups.mjs",
      "`scripts/lib/lifecycle-evidence.mjs`",
    ),
  "scripts/lib/planning-followups.mjs#changedAgainstMain#call:changedAgainstMain":
    D017("scripts/lib/planning-followups.mjs", "`changedAgainstMain`"),
  "scripts/lib/planning-followups.mjs#changedAgainstMain#merge-base": D017(
    "scripts/lib/planning-followups.mjs",
    "`changedAgainstMain`",
  ),
  "scripts/lib/release-preparation.mjs#integrationPreparationRefusal#checkpoint":
    D006("scripts/lib/release-preparation.mjs"),
  "scripts/lib/release-records.mjs#reviewedLaunchpadIdentity#merge-base": D006(
    "scripts/lib/release-records.mjs",
  ),
  "scripts/lib/review-worker.mjs#roundPlan#merge-base": D006(
    "scripts/lib/review-worker.mjs",
  ),
  "scripts/lib/target-base.mjs#targetBase#merge-base": excluded("target"),
  [`${integration}#decisionStub#checkpoint`]: D006(
    integration,
    "`decisionStub`",
  ),
  [`${integration}#regenerate#checkpoint`]: D017(integration, "`regenerate`"),
  [`${integration}#mergedMachinery#call:mergedMachinery`]: D006(
    integration,
    "`mergedMachinery`",
  ),
  [`${integration}#mergedMachinery#call:changedMachinery`]: D006(
    integration,
    "`mergedMachinery`",
  ),
  [`${integration}#owedChecks#call:closeoutScope`]: D017(
    closeout,
    "`closeoutScope`",
    "`owedChecks`",
  ),
  [`${integration}#integrateOwnedWorktree#receipt`]: D006(
    integration,
    "`integrateOwnedWorktree`",
  ),
  [`${integration}#integrateOwnedWorktree#checkpoint`]: D006(
    integration,
    "`integrateOwnedWorktree`",
  ),
  [`${integration}#integrateOwnedWorktree#merge-base`]: D006(
    integration,
    "`integrateOwnedWorktree`",
  ),
  [`${integration}#integrateOwnedWorktree#call:mergedMachinery`]: D006(
    integration,
    "`mergedMachinery`",
  ),
  "scripts/refute-plan.mjs#RESERVED_LANE_NAMES#receipt": D006(
    "scripts/refute-plan.mjs",
  ),
  "scripts/refute-plan.mjs#main#call:changedAgainstMain": D017(
    "scripts/lib/planning-followups.mjs",
    "`scripts/refute-plan.mjs`",
  ),
  "scripts/release.mjs#main#receipt": D006("scripts/release.mjs"),
  "scripts/resident-bind.mjs#resolveBase#call:resolveBase": D017(
    "scripts/resident-bind.mjs",
    "`resolveBase`",
  ),
  "scripts/resident-bind.mjs#resolveBase#merge-base": D017(
    "scripts/resident-bind.mjs",
    "`resolveBase`",
  ),
  "scripts/resident-bind.mjs#readBindingInputs#call:resolveBase": D017(
    "scripts/resident-bind.mjs",
    "`readBindingInputs`",
  ),
  "scripts/resident-bind.mjs#observeBinding#call:resolveBase": D017(
    "scripts/resident-bind.mjs",
    "`observeBinding`",
  ),
  "scripts/resume.mjs#renderOrder#checkpoint": D006("scripts/resume.mjs"),
  "scripts/resume.mjs#projectOrder#checkpoint": D006("scripts/resume.mjs"),
  "scripts/resume.mjs#run#checkpoint": D006("scripts/resume.mjs"),
  [`${runner}#changedMachinery#call:changedMachinery`]: D006(
    runner,
    "`changedMachinery`",
  ),
  [`${runner}#changedMachinery#merge-base`]: D006(runner, "`changedMachinery`"),
  [`${runner}#changedSinceLastGate#call:changedSinceLastGate`]: D006(
    runner,
    "`changedSinceLastGate`",
  ),
  [`${runner}#runGateChecks#call:changedMachinery`]: D006(
    runner,
    "`changedMachinery`",
  ),
  [`${runner}#runGateChecks#call:changedSinceLastGate`]: D006(
    runner,
    "`changedSinceLastGate`",
  ),
  [`${runner}#runGateChecks#call:classifyDocumentFailures`]: D017(
    "scripts/lib/document-failures.mjs",
    "`scripts/test-runner.mjs`",
  ),
  "scripts/worktree.mjs#main#symmetric-range": D017(
    "scripts/worktree.mjs",
    "`origin/main...HEAD`",
  ),
  "scripts/worktree.mjs#main#call:reviewedLaunchpadIdentity": D006(
    "scripts/lib/release-records.mjs",
    "`worktree publish`",
  ),
  "scripts/worktree.mjs#main#call:contributionSignoffRules": D017(
    "scripts/lib/contributions.mjs",
    "`scripts/worktree.mjs`",
  ),
};

// The top-level declaration a site sits in: the nearest line at or above it
// that declares a function, a binding or a class at the left margin.
const DECLARATION =
  /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\*?\s+|(?:const|let|var)\s+|(?:abstract\s+)?class\s+)([A-Za-z_$][\w$]*)/u;
const enclosing = (lines, index) => {
  for (let at = index; at >= 0; at--) {
    const match = DECLARATION.exec(lines[at]);
    if (match) return match[1];
  }
  return "(module)";
};
// A merge-base whose own argument list, up to its closing bracket, holds
// --is-ancestor answers whether one commit contains another and returns no
// base.
const ancestryPredicate = (lines, index, column) =>
  [lines[index].slice(column), ...lines.slice(index + 1, index + 4)]
    .join("\n")
    .split(/[\])]/u)[0]
    .includes("--is-ancestor");

function scan() {
  const files = [
    ...new Set(
      runGitPathList(root, [
        "ls-files",
        "--cached",
        "--others",
        "--exclude-standard",
        "-z",
        "--",
        "scripts",
        "packages",
      ]),
    ),
  ]
    .filter(runtime)
    .filter((path) => existsSync(join(root, path)))
    .sort();
  const keys = new Map();
  const ancestry = new Map();
  for (const path of files) {
    const lines = readFileSync(join(root, path), "utf8").split("\n");
    lines.forEach((line, index) => {
      for (const { id, pattern } of PATTERNS)
        for (const match of line.matchAll(pattern)) {
          if (
            id === "merge-base" &&
            ancestryPredicate(lines, index, match.index)
          ) {
            ancestry.set(path, [...(ancestry.get(path) ?? []), index + 1]);
            continue;
          }
          const key = `${path}#${enclosing(lines, index)}#${id}`;
          const seen = keys.get(key) ?? [];
          if (!seen.includes(index + 1)) seen.push(index + 1);
          keys.set(key, seen);
        }
    });
  }
  return { files, keys, ancestry };
}

// The census sections and the rows of their tables, by first cell.
function readCensus() {
  const decisions = readFileSync(
    join(root, "docs/evidence/WO-243/decisions.md"),
    "utf8",
  );
  const sections = {};
  for (const id of ["D006", "D017"]) {
    const start = decisions.indexOf(`\n## WO-243-${id}`);
    if (start === -1) {
      sections[id] = null;
      continue;
    }
    const next = decisions.indexOf("\n## WO-243-D", start + 1);
    const text = decisions.slice(start, next === -1 ? undefined : next);
    const rows = text
      .split("\n")
      .filter((line) => line.startsWith("| `"))
      .map((line) => line.split("|")[1].trim());
    sections[id] = { text, rows };
  }
  return sections;
}

const { files, keys, ancestry } = scan();
if (args.includes("--keys")) {
  for (const [key, lines] of keys) console.log(`${key} ${lines.join(",")}`);
  process.exit(0);
}

const sections = readCensus();
const read = sectionIds.map((id) => sections[id]).filter(Boolean);
const failures = [];
const judged = [];
const used = new Map();
for (const [key, lines] of keys) {
  const disposition = DISPOSITIONS[key];
  if (!disposition) {
    failures.push({ kind: "no-disposition", key, lines });
    judged.push({ key, lines, disposition: null, result: "fail" });
    continue;
  }
  let found;
  if (disposition.excluded) {
    found = CLASSES[disposition.excluded].some((phrase) =>
      read.some((section) => section.text.includes(phrase)),
    );
    if (!found)
      failures.push({
        kind: "class-not-stated",
        key,
        lines,
        class: disposition.excluded,
      });
  } else {
    const section = sectionIds.includes(disposition.section)
      ? sections[disposition.section]
      : null;
    const cell = section?.rows.find(
      (cell) =>
        cell.includes(`\`${disposition.reader}\``) &&
        disposition.names.every((name) => cell.includes(name)),
    );
    found = Boolean(cell);
    if (cell) used.set(`${disposition.section}|${cell}`, true);
    if (!found)
      failures.push({
        kind: "reader-not-named",
        key,
        lines,
        row: `${disposition.section}: ${disposition.reader} ${disposition.names.join(" ")}`.trim(),
      });
  }
  judged.push({
    key,
    lines,
    disposition: disposition.excluded
      ? `excluded: ${disposition.excluded}`
      : `${disposition.section}: ${disposition.reader}`,
    result: found ? "pass" : "fail",
  });
}
for (const key of Object.keys(DISPOSITIONS))
  if (!keys.has(key)) failures.push({ kind: "stale-disposition", key });
const ancestrySites = [...ancestry.values()].reduce(
  (sum, lines) => sum + lines.length,
  0,
);
if (
  ancestrySites &&
  !CLASSES.ancestry.some((phrase) =>
    read.some((section) => section.text.includes(phrase)),
  )
)
  failures.push({
    kind: "class-not-stated",
    class: "ancestry",
    sites: ancestrySites,
  });
for (const id of sectionIds.filter((id) => id !== "D006"))
  if (!sections[id]) failures.push({ kind: "section-missing", section: id });
  else
    for (const cell of sections[id].rows)
      if (!used.has(`${id}|${cell}`))
        failures.push({ kind: "row-without-site", section: id, row: cell });

const result = {
  schemaVersion: 1,
  workOrder: "WO-243",
  criterion: "3",
  census: sectionIds.join("+"),
  recordedAt: new Date().toISOString(),
  codeIdentity: gateCodeIdentity(root),
  scope:
    "tracked and untracked .mjs, .cjs, .js, .ts and .sh files under scripts/ and packages/, without tests, fixtures, dist/ or node_modules/",
  counts: {
    files: files.length,
    readerKeys: keys.size,
    readerSites: [...keys.values()].reduce(
      (sum, lines) => sum + lines.length,
      0,
    ),
    ancestrySites,
    failures: failures.length,
  },
  failures,
  keys: judged,
  ancestry: Object.fromEntries(ancestry),
  result: failures.length ? "fail" : "pass",
  exitCode: failures.length ? 1 : 0,
};
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.exitCode;
