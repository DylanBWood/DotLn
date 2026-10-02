// WO-179: met verification claims consume the existing gate evidence; the
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
cpSync(
  subject ?? join(scripts, "resume.mjs"),
  join(root, "scripts/resume.mjs"),
);
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
mkdirSync(dirname(join(root, control)), { recursive: true });
writeFileSync(join(root, control), JSON.stringify({ exit: 1 }));
refuse(
  /criterion 2 recorded met names npm run test:docs, and the document gate failed/u,
);
writeFileSync(join(root, control), JSON.stringify({ exit: 0 }));
const completion = pass(["verification-result", "pass", ...flags]);
assert.match(
  completion.stdout,
  /Running npm run test:docs, which criterion 2 recorded met names/u,
);
assert.equal(readFileSync(join(root, runs), "utf8"), "run\nrun\n");
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
  "A met criterion naming npm test or npm run test:docs stands on that gate's passing row at the subject or an inline run.",
];
for (const briefing of [verify, finalReview])
  for (const sentence of expected)
    assert.ok(briefing.includes(sentence), sentence);
console.log(
  "WO-179 verifier gate claims: missing, failed, partial and stale rows refuse without events; current passing row is consumed, document gate runs inline; both briefings carry the three rules",
);
