import { copyFixtureFiles } from "./lib/fixture-inputs.mjs";
// Met verification claims consume the existing gate evidence (WO-179); the
// dispatcher refuses a contradicted claim before it appends a result.
import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { spawnGit } from "./lib/git.mjs";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";

const [parent, subject] = process.argv.slice(2);
assert.ok(parent && isAbsolute(parent) && realpathSync(parent) === parent);
assert.ok(existsSync(join(parent, ".dotln-test-root-owner")));
const scripts = dirname(fileURLToPath(import.meta.url));
const root = join(parent, "verifier-gate-claims");
mkdirSync(join(root, "scripts"), { recursive: true });
mkdirSync(join(root, "docs/work-orders"), { recursive: true });
copyFixtureFiles(
  join(scripts, ".."),
  root,
  "scripts/test-verifier-gate-claims.fixture-inputs.json",
);
if (subject) cpSync(subject, join(root, "scripts/resume.mjs"));
cpSync(join(scripts, "lib"), join(root, "scripts/lib"), { recursive: true });
cpSync(join(scripts, "../.gitignore"), join(root, ".gitignore"));
installBeaconFixture(root);
const control = "docs/control/local/document-result.json";
const runs = "docs/control/local/document-runs.txt";
writeFileSync(
  join(root, "scripts/test-runner.mjs"),
  `import { appendFileSync, readFileSync } from "node:fs";
if (!process.argv.includes("--document")) throw new Error("product gate must be consumed, not rerun");
appendFileSync(${JSON.stringify(runs)}, "run\\n");
const exit = JSON.parse(readFileSync(${JSON.stringify(control)}, "utf8")).exit;
console.log(exit ? "FAIL docs-check 0.01 s" : "npm run test:docs: 1 passed; 0 failed; 0.01 s; 1 fresh task");
process.exit(exit);
`,
);
const env = {
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => !/^(?:CLAUDE|CODEX|COPILOT|DOTLN_|GIT_)/u.test(name),
    ),
  ),
  GIT_AUTHOR_NAME: "fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
for (const args of [
  ["init", "-q"],
  ["add", "-A"],
  ["commit", "-q", "-m", "fixture"],
  ["checkout", "-q", "-b", "wo-179"],
])
  assert.equal(spawnGit(["-C", root, ...args], { env }).status, 0);
const call = (args) =>
  spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), ...args], {
    cwd: root,
    env,
    encoding: "utf8",
  });
const pass = (args) => {
  const run = call(args);
  assert.equal(run.status, 0, `${args.join(" ")}: ${run.stderr}`);
  return run;
};
const actor = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const flags = Object.entries(actor).flatMap(([key, value]) => [
  `--${key === "harnessVersion" ? "harness-version" : key}`,
  value,
]);
writeFileSync(
  join(root, "docs/work-orders/WO-179-fixture.md"),
  "# WO-179 — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. `npm test` green at the final subject.\n2. `npm run test:docs` green.\n3. Prose read.\n",
);
mkdirSync(join(root, "docs/evidence/WO-179"), { recursive: true });
writeFileSync(
  join(root, "docs/evidence/WO-179/handoff.md"),
  "**Criterion 1:** unmet. Fixture has no row yet.\n**Criterion 2:** unmet. Fixture has not run it.\n**Criterion 3:** met. Read.\n",
);
pass(["activate", "WO-179", "docs/work-orders/WO-179-fixture.md"]);
pass(["implementation-ready", ...flags]);
const verify = pass(["verify"]).stdout;
const reportPath = join(root, "docs/verifications/WO-179/VER-001.md");
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(
  reportPath,
  `# fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n\n**Criterion 1:** met. npm test passed.\n**Criterion 2:** met. npm run test:docs passed.\n**Criterion 3:** met. Read.\n`,
);
const log = join(root, "docs/control/orders/WO-179.jsonl");
const before = readFileSync(log);
const refuse = (pattern, verdict = "pass") => {
  const run = call(["verification-result", verdict, ...flags]);
  assert.notEqual(
    run.status,
    0,
    `verification claim must refuse: ${run.stdout}`,
  );
  assert.match(run.stderr, pattern);
  assert.deepEqual(readFileSync(log), before, "a refusal appends no event");
  return run;
};
const { gateCodeIdentity, gateTreeHash, recordGateChecks } = await import(
  pathToFileURL(join(root, "scripts/lib/gate-evidence.mjs"))
);
const identity = gateCodeIdentity(root);
const noRow =
  /criterion 1 recorded met names npm test, and no passing complete npm test row exists at the current code identity/u;
// This is the first new assertion, so the optional baseline subject demonstrates
// criterion 3 independently of the later briefing assertions.
refuse(noRow);
refuse(noRow, "fail");
const row = {
  checkId: "npm test",
  treeHash: gateTreeHash(root),
  codeIdentity: identity,
  subject: gateTreeHash(root),
  durationMs: 1,
  executed: true,
  exitCode: 0,
  evidenceRef: "synthetic-wo179-product-gate",
  recordedAt: new Date().toISOString(),
};
for (const extra of [
  { exitCode: 1 },
  { partial: true, excludedSuites: ["fixture-product"] },
  { codeIdentity: "sha256:" + "0".repeat(64) },
]) {
  recordGateChecks(root, [{ ...row, ...extra }]);
  refuse(noRow);
}
recordGateChecks(root, [row]);
// Completion consumes the document row and never runs the document gate.
const documentRow = {
  ...row,
  checkId: "npm run test:docs",
  evidenceRef: "synthetic-wo179-document-gate",
};
refuse(/Handoff document row missing or failed at the current code identity/u);
recordGateChecks(root, [{ ...documentRow, exitCode: 1 }]);
refuse(/Handoff document row missing or failed at the current code identity/u);
recordGateChecks(root, [documentRow]);
const completion = pass(["verification-result", "pass", ...flags]);
assert.doesNotMatch(completion.stdout, /Running npm run test:docs/u);
assert.ok(
  !existsSync(join(root, runs)),
  "the stub runner never ran the document gate",
);
const event = readFileSync(log, "utf8")
  .trim()
  .split("\n")
  .map(JSON.parse)
  .at(-1);
assert.equal(event.type, "VerificationCompleted");
assert.equal(event.verdict, "pass");
assert.equal(event.evidence.productGate.evidenceRef, row.evidenceRef);
assert.equal(event.evidence.productGate.codeIdentity, identity);
assert.equal(
  gateCodeIdentity(root),
  identity,
  "report and gate bookkeeping leave the subject identity unchanged",
);
const finalReview = pass(["final-review"]).stdout;
const expected = [
  "A question, complaint or stale operator message is not an instruction to stop, narrow or widen work; only an explicit pause, stop or scope prefix changes it.",
  "A repairable defect within the order's declared surfaces is repaired in the order through Adjacent Repair and may fail a criterion it breaks; a defect outside both its declared criteria and surfaces is boarded with its reproduction.",
  "A met criterion naming npm test or npm run test:docs stands on that gate's passing row at the subject; completion consumes rows and runs no gate.",
];
for (const briefing of [verify, finalReview])
  for (const sentence of expected)
    assert.ok(briefing.includes(sentence), sentence);
console.log(
  "WO-179 verifier gate claims: missing, failed, partial and stale rows refuse without events; current passing row is consumed, document gate runs inline; both briefings carry the three rules",
);

// Focused handoffs and the fresh final review use different evidence rules.
const { readPreflightSuites } = await import(
  pathToFileURL(join(root, "scripts/lib/handoff-ledger.mjs"))
);
assert.deepEqual(
  readPreflightSuites(
    "**Preflight:** `npm test -- --only alpha`,\n`npm test -- --only beta` and `npm test -- --only alpha`.\n\n**Other:** --only ignored",
  ),
  ["alpha", "beta"],
);
writeFileSync(
  join(root, "scripts/test-runner.mjs"),
  `
if (!process.argv.includes("--list")) throw new Error("focused handoff consumes document evidence instead of running a gate");
for (const name of ["format", "configuration-root", "registrations", "declarations", "generated", "host", "alpha", "beta", "gamma"]) console.log(name + " — protects: fixture");
`,
);
const structural = [
  "format",
  "configuration-root",
  "registrations",
  "declarations",
  "generated",
  "host",
];
let lastTime = Date.now();
const gateRow = (checkId, names, extra = {}) => {
  const recordedAt = new Date(
    (lastTime = Math.max(Date.now(), lastTime + 1)),
  ).toISOString();
  return {
    checkId,
    codeIdentity: gateCodeIdentity(root),
    treeHash: gateTreeHash(root),
    durationMs: 1,
    executed: true,
    exitCode: 0,
    identityUnchanged: true,
    evidenceRef: `fixture:${checkId}:${recordedAt}`,
    recordedAt,
    requiredSuites: names,
    taskTimeline: names.map((name) => ({
      name,
      executed: true,
      durationMs: 1,
      exitCode: 0,
      finishedAt: recordedAt,
    })),
    ...extra,
  };
};
const report = (where, judgments) => {
  mkdirSync(dirname(where), { recursive: true });
  writeFileSync(
    where,
    `# Fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n\n${judgments}\n\n<!-- dotln-findings:start -->\n[]\n<!-- dotln-findings:end -->\n`,
  );
};
const judged =
  "**Criterion 1:** met. Current gate rows.\n**Criterion 2:** met. Current document row.\n**Criterion 3:** met. Read.";
report(join(root, "docs/final-reviews/WO-179/FINAL-001.md"), judged);
const reviewBefore = readFileSync(log);
const refuseReview = () => {
  const run = call(["final-review-result", "pass", ...flags]);
  assert.notEqual(run.status, 0, run.stdout);
  assert.match(
    run.stderr,
    /passing complete review row at the integrated code identity/u,
  );
  assert.deepEqual(readFileSync(log), reviewBefore);
};
refuseReview();
const requested = JSON.parse(
  readFileSync(log, "utf8").trim().split("\n").at(-1),
).recordedAt;
recordGateChecks(root, [
  gateRow("npm run test:docs", [...structural, "docs-check"]),
]);
// A row with no executed task, a focused row and a row at another identity
// supply nothing; the row's time against the dispatch and its reused suites
// no longer matter, since the identity says what was tested.
for (const extra of [
  {
    recordedAt: new Date(Date.parse(requested) - 1).toISOString(),
    taskTimeline: [],
    gateSelection: "review",
    reusedSuites: 0,
  },
  { gateSelection: "plain", reusedSuites: 0 },
  { gateSelection: "review", reusedSuites: 0, codeIdentity: "wrong-identity" },
]) {
  recordGateChecks(root, [
    gateRow("npm test", [...structural, "alpha", "beta", "gamma"], extra),
  ]);
  refuseReview();
}
// A review row names every listed suite; gamma's tasks carry its name as a
// prefix, as release, launchpad and vertical tasks do in a real row.
const freshReview = (extra = {}) => {
  const row = gateRow("npm test", [...structural, "alpha", "beta", "gamma"], {
    gateSelection: "review",
    reusedSuites: 0,
    ...extra,
  });
  row.taskTimeline = row.taskTimeline.flatMap((entry) =>
    entry.name === "gamma"
      ? ["gamma:file:one", "gamma:file:two"].map((name) => ({ ...entry, name }))
      : [entry],
  );
  return row;
};
// A later failed fresh run displaces the standing fresh row through the
// shared lookup, so nothing supplies the claim.
recordGateChecks(root, [freshReview()]);
const failedFresh = freshReview({ exitCode: 1 });
failedFresh.taskTimeline = failedFresh.taskTimeline.map((entry) =>
  entry.name === "beta" ? { ...entry, exitCode: 1 } : entry,
);
recordGateChecks(root, [failedFresh]);
refuseReview();
// The newest standing passing row at the identity records, whichever role
// recorded it and whether or not the runner reused passing suites there: a
// later composed review row (reused results) is that row.
const olderFresh = freshReview();
const newestFresh = freshReview({
  recordedAt: new Date(Date.parse(requested) - 1).toISOString(),
});
const composed = freshReview({ reusedSuites: 2, executionMode: "composed" });
composed.taskTimeline = composed.taskTimeline.map((entry) =>
  ["alpha", "beta"].includes(entry.name)
    ? {
        ...entry,
        reused: true,
        sourceRow: {
          task: entry.name,
          codeIdentity: newestFresh.codeIdentity,
          treeHash: newestFresh.treeHash,
          recordedAt: newestFresh.recordedAt,
          evidenceRef: newestFresh.evidenceRef,
          location: "worktree",
        },
      }
    : entry,
);
// The FINAL report is written, so a document row judging this tree exists.
recordGateChecks(root, [
  gateRow("npm run test:docs", [...structural, "docs-check"]),
]);
recordGateChecks(root, [olderFresh, newestFresh, composed]);
recordGateChecks(root, [
  gateRow("npm test", structural, {
    partial: true,
    gateSelection: "review",
    excludedSuites: ["alpha", "beta", "gamma"],
  }),
]);
pass(["final-review-result", "pass", ...flags]);
assert.equal(
  JSON.parse(readFileSync(log, "utf8").trim().split("\n").at(-1)).evidence
    .productGate.evidenceRef,
  composed.evidenceRef,
);

assert.equal(
  spawnGit(["-C", root, "checkout", "-qb", "wo-216"], { env }).status,
  0,
);
writeFileSync(
  join(root, "docs/work-orders/WO-216-fixture.md"),
  "# WO-216 — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. `npm test -- --review` green.\n2. `npm run test:docs` green.\n3. Prose read.\n\n**Preflight:** `npm test -- --only alpha`,\n`npm test -- --only beta`.\n",
);
mkdirSync(join(root, "docs/evidence/WO-216"), { recursive: true });
writeFileSync(
  join(root, "docs/evidence/WO-216/handoff.md"),
  judged + "\nself-review: found 0; fixed 0; recorded 0\n",
);
pass(["activate", "WO-216", "docs/work-orders/WO-216-fixture.md"]);
writeFileSync(
  join(root, "scripts/subject.mjs"),
  "export const focused = true;\n",
);
const focusedLog = join(root, "docs/control/orders/WO-216.jsonl");
const focusedRows = new Map();
const recordFocused = (name, extra = {}) => {
  const checkId =
    name === "structural"
      ? name
      : name === "document"
        ? "npm run test:docs"
        : `suite:${name}`;
  const names =
    name === "structural"
      ? structural
      : [...structural, name === "document" ? "docs-check" : name];
  const row = gateRow(checkId, names, {
    gateSelection:
      name === "structural"
        ? "structural"
        : name === "document"
          ? "document"
          : "single",
    ...extra,
  });
  recordGateChecks(root, [row]);
  if (!Object.keys(extra).length) focusedRows.set(name, row);
  return row;
};
const refuseFocused = (action, name) => {
  const prior = readFileSync(focusedLog);
  const run = call([
    action,
    ...(action === "verification-result" ? ["pass"] : []),
    ...flags,
  ]);
  assert.notEqual(run.status, 0, run.stdout);
  assert.ok(run.stderr.includes(name), run.stderr);
  assert.deepEqual(readFileSync(focusedLog), prior);
};
for (const name of ["structural", "alpha", "beta", "document"]) {
  refuseFocused("implementation-ready", name);
  recordFocused(name, { codeIdentity: "another-identity" });
  refuseFocused("implementation-ready", name);
  recordFocused(name, { exitCode: 1 });
  refuseFocused("implementation-ready", name);
  recordFocused(name);
}
// A focused row satisfies the handoff claim and supplies nothing to a
// complete run: that run composes only from rows of its own check at the
// identity, so a focused sequence followed by a complete run executes every
// suite twice. The runner leads a complete run with changed suites instead
// (changedSinceLastGate in scripts/test-runner.mjs).
const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
const composedFromFocused = await coveringTaskResults(root, "npm test", [
  { name: "alpha" },
  { name: "beta" },
]);
assert.equal(composedFromFocused.results.size, 0);
const assertFocusedEvent = (type) => {
  const event = JSON.parse(
    readFileSync(focusedLog, "utf8").trim().split("\n").at(-1),
  );
  assert.equal(event.type, type);
  assert.deepEqual(
    event.evidence.productGate.evidenceRefs,
    [...focusedRows.values()].map((row) => row.evidenceRef),
  );
  assert.equal(event.evidence.productGate.codeIdentity, gateCodeIdentity(root));
};
pass(["implementation-ready", ...flags]);
assertFocusedEvent("ImplementationReady");
const focusedBriefing = pass(["verify"]).stdout;
assert.match(focusedBriefing, /suite:alpha, suite:beta/u);
report(join(root, "docs/verifications/WO-216/VER-001.md"), judged);
for (const name of ["structural", "alpha", "beta", "document"]) {
  recordFocused(name, { exitCode: 1 });
  refuseFocused("verification-result", name);
  recordFocused(name);
}
// A failed verdict may still contain met gate claims; it consumes the same rows.
pass(["verification-result", "fail", ...flags]);
assertFocusedEvent("VerificationCompleted");
pass(["fix"]);
for (const name of ["structural", "alpha", "beta", "document"]) {
  recordFocused(name, { exitCode: 1 });
  refuseFocused("repair-complete", name);
  recordFocused(name);
}
pass(["repair-complete", ...flags]);
assertFocusedEvent("RepairCompleted");
console.log(
  "Focused handoffs: implementation, verification and repair consume structural, every declared suite and document refs; missing, stale and failed rows refuse. Final review requires a fresh complete review after dispatch.",
);
