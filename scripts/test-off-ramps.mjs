import { copyFixtureFiles } from "./lib/fixture-inputs.mjs";
import { spawnGit } from "./lib/git.mjs";
import {
  namesLiveRun,
  requireLiveReceiptIdentity,
} from "./lib/handoff-ledger.mjs";
import { criterionJudgments } from "./lib/off-ramps.mjs";
// Off-ramps: each route appends its typed event with the actor attestation,
// refuses outside its legal phases with the legal list, and projects in
// status --json and current.md; withdrawn is terminal (WO-158).
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";

const parent = process.argv[2];
assert.ok(parent && isAbsolute(parent) && realpathSync(parent) === parent);
assert.ok(existsSync(join(parent, ".dotln-test-root-owner")));
const scripts = dirname(fileURLToPath(import.meta.url));
const root = join(parent, "off-ramps");
mkdirSync(join(root, "scripts"), { recursive: true });
mkdirSync(join(root, "docs/work-orders"), { recursive: true });
copyFixtureFiles(
  join(scripts, ".."),
  root,
  "scripts/test-off-ramps.fixture-inputs.json",
);
cpSync(join(scripts, "lib"), join(root, "scripts/lib"), { recursive: true });
installBeaconFixture(root);
assert.equal(spawnGit(["init", "-q", root]).status, 0);
cpSync(join(scripts, "../.gitignore"), join(root, ".gitignore"));

// Host session variables would make the fixture judge this session.
const baseEnv = {
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => !/^(?:CLAUDE|CODEX|COPILOT|DOTLN_|GIT_)/.test(name),
    ),
  ),
  GIT_AUTHOR_NAME: "fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
// Checkpoints need a HEAD to parent their recovery commits, and the order's
// own branch selects it as its worktree would. The fixture's scripts are
// tracked so its code identity, like a real worktree's, is the same whether
// read from the working tree or from a checkpoint (WO-115 D026).
for (const args of [
  ["add", "-A"],
  ["-c", "maintenance.auto=false", "commit", "-q", "-m", "fixture"],
  ["checkout", "-q", "-b", "wo-099"],
])
  assert.equal(spawnGit(["-C", root, ...args], { env: baseEnv }).status, 0);
const call = (args, env = {}) =>
  spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...baseEnv, ...env },
  });
const segmentPath = (id) => join(root, `docs/control/orders/${id}.jsonl`);
const events = (id = "WO-099") =>
  existsSync(segmentPath(id))
    ? readFileSync(segmentPath(id), "utf8").trim().split("\n").map(JSON.parse)
    : [];
const pass = (args, env) => {
  const run = call(args, env);
  assert.equal(run.status, 0, `${args.join(" ")}: ${run.stderr}`);
  return run.stdout;
};
const refuse = (pattern, args, env) => {
  const before = events().length;
  const run = call(args, env);
  assert.notEqual(run.status, 0, `refusal expected: ${args.join(" ")}`);
  assert.match(run.stderr, pattern, args.join(" "));
  assert.doesNotMatch(run.stderr, /at file:\/\//);
  assert.equal(events().length, before, "a refusal appends nothing");
  return run.stderr;
};
const status = (id = "WO-099") =>
  JSON.parse(pass(["status", "--json", "--work-order", id]));
const current = () =>
  readFileSync(join(root, "docs/control/current.md"), "utf8");
const last = () => events().at(-1);

const operator = [
  "--harness",
  "human",
  "--harness-version",
  "not-applicable",
  "--model",
  "human",
  "--effort",
  "unknown",
  "--source",
  "operator-attested",
];
const agent = {
  harness: "codex-cli",
  harnessVersion: "fixture-2",
  model: "fixture.model/beta",
  effort: "xhigh",
  source: "self-reported",
};
const agentFlags = [
  "--harness",
  agent.harness,
  "--harness-version",
  agent.harnessVersion,
  "--model",
  agent.model,
  "--effort",
  agent.effort,
  "--source",
  agent.source,
];
const readbackFlags = [
  "--harness",
  "claude-code",
  "--harness-version",
  "fixture-1",
  "--model",
  "fixture.model/alpha",
  "--effort",
  "xhigh",
  "--source",
  "claude-session-readback",
];
// Criterion 1: each route's legal phases, independent of the route table.
// Three more are legal (WO-249): a defect record while a role judges the
// order, a retraction wherever a judgment may still read a record, and a
// reopened handoff before any verification of it.
const legalIn = {
  none: [],
  active: ["accept-overrun", "withdraw", "correct", "override-record"],
  "ready-to-verify": [
    "withdraw",
    "correct",
    "override-record",
    "reopen-handoff",
  ],
  verifying: [
    "accept-overrun",
    "waive",
    "withdraw",
    "correct",
    "override-record",
    "defect",
    "retract",
  ],
  "needs-fix": [
    "accept-overrun",
    "waive",
    "withdraw",
    "correct",
    "override-record",
    "retract",
  ],
  repairing: [
    "accept-overrun",
    "waive",
    "withdraw",
    "correct",
    "override-record",
  ],
  verified: ["waive", "withdraw", "correct", "override-record", "retract"],
  "final-review": [
    "accept-overrun",
    "waive",
    "withdraw",
    "correct",
    "override-record",
    "defect",
    "retract",
  ],
  // A correction changes no phase; a closed order's recorded pass may still
  // need its product gate bound before publication (WO-115 D026), and a
  // record the operator reads in the pull request may still be retracted.
  closed: ["correct", "override-record", "retract"],
  withdrawn: [],
};
const matrix = (id = "WO-099") => {
  const { phase, legalOffRamps } = status(id);
  assert.deepEqual(legalOffRamps, legalIn[phase], phase);
  for (const route of [
    "accept-overrun",
    "waive",
    "withdraw",
    "correct",
    "override-record",
    "defect",
    "retract",
    "reopen-handoff",
  ])
    if (!legalIn[phase].includes(route))
      refuse(new RegExp(`${route} is not legal in phase ${phase}`), [
        route,
        "--work-order",
        id,
      ]);
  return phase;
};
const authority = "docs/work-orders/WO-099-fixture.md";
const authorityText =
  "# WO-099 — off-ramp fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. One.\n2. Two.\n";
writeFileSync(join(root, authority), authorityText);

mkdirSync(join(root, "docs/intake/notes"), { recursive: true });
const capture = (name, words) => {
  const path = `docs/intake/notes/${name}.md`;
  writeFileSync(join(root, path), words);
  return [
    "--capture",
    path,
    "--capture-hash",
    `sha256:${createHash("sha256").update(words).digest("hex")}`,
  ];
};
const waiverCapture = capture(
  "waiver",
  "Operator: accept criterion 2 unmet for this fixture.\n",
);
// A report lists its findings once (WO-187), so a fail has a basis to read
// (WO-249); `findings: null` writes a report without the block.
const report = (path, lines, { findings = [] } = {}) => {
  mkdirSync(join(root, dirname(path)), { recursive: true });
  writeFileSync(
    join(root, path),
    [
      "# Verification",
      "",
      `**Actor attestation:** ${JSON.stringify(agent)}`,
      "**Process cost:** unknown; cause no-session",
      "",
      ...lines,
      ...(findings === null ? [] : findingsBlock(findings)),
      "",
    ].join("\n"),
  );
};
// A report's findings block: the marker lines around a JSON array (WO-187),
// which a fail reads for its basis (WO-249).
const findingsBlock = (entries) => [
  "",
  "<!-- dotln-findings:start -->",
  JSON.stringify(entries),
  "<!-- dotln-findings:end -->",
];
const hash = (path) =>
  createHash("sha256")
    .update(readFileSync(join(root, path)))
    .digest("hex");

// Active: withdraw, correct and override-record are legal; waive is not.
// A failed recovery checkpoint must not make an event ordinal stand in for
// its checkpoint number. Block only this disposable fixture's first ref.
const checkpointBlock = join(root, ".git/refs/dotln/checkpoint");
mkdirSync(dirname(checkpointBlock), { recursive: true });
writeFileSync(checkpointBlock, "fixture blocks a checkpoint directory\n");
try {
  pass(["activate", "WO-099", authority]);
} finally {
  rmSync(checkpointBlock);
}
assert.equal(events()[0].checkpointUnavailable, true);
let state = status();
assert.deepEqual(state.legalOffRamps, [
  "accept-overrun",
  "withdraw",
  "correct",
  "override-record",
]);
for (const key of ["waivedCriteria", "corrections", "overrideRecords"])
  assert.deepEqual(state[key], []);
assert.equal(state.withdrawal, null);
refuse(
  /waive is not legal in phase active; it is legal in verifying, needs-fix, repairing, verified, final-review\. Legal off-ramps here: accept-overrun, withdraw, correct, override-record; run: npm run resume -- next/,
  ["waive", "2", "--reason", "accepted", ...waiverCapture, ...operator],
);
assert.match(
  current(),
  /- Legal off-ramps: accept-overrun, withdraw, correct, override-record/,
);

// override-record appends its event with the actor attestation.
refuse(/usage: npm run resume -- override-record --bypassed/, [
  "override-record",
  "--effects",
  "none",
  "--reason",
  "recovery",
  ...agentFlags,
]);
pass([
  "override-record",
  "--bypassed",
  "active-gate, writer-reservation",
  "--effects",
  "none",
  "--reason",
  "operator-directed recovery",
  ...agentFlags,
]);
assert.equal(last().type, "OperatorOverrideRecorded");
assert.deepEqual(last().actor, agent);
assert.deepEqual(last().bypassed, ["active-gate", "writer-reservation"]);
assert.equal(typeof last().checkpointSha, "string", "each route checkpoints");
state = status();
assert.equal(state.phase, "active", "an override record changes no phase");
assert.deepEqual(
  state.overrideRecords.map(({ ordinal, effects }) => ({ ordinal, effects })),
  [{ ordinal: 2, effects: ["none"] }],
);
assert.match(
  current(),
  /- Override records: ordinal 2 \(bypassed active-gate, writer-reservation; effects none\)/,
);

assert.equal(matrix(), "active");

// The executor judges every declared criterion on one line of its handoff
// ledger before either completion (WO-173). An absent ledger, a missing
// criterion, two lines for one criterion, a line for an undeclared criterion
// and a line hidden in a code fence refuse and append nothing, naming the
// identifiers and the accepted forms; a complete ledger records, and the
// event, the status and the next briefing carry what it recorded unmet.
const ledgerPath = (id = "WO-099") => `docs/evidence/${id}/handoff.md`;
const ledger = (lines, id = "WO-099") => {
  mkdirSync(join(root, dirname(ledgerPath(id))), { recursive: true });
  writeFileSync(
    join(root, ledgerPath(id)),
    `# Handoff\n\n${lines.join("\n")}\n`,
  );
};
const literal = (value) =>
  new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const criterionForms =
  "`**Criterion <id>:** met`, `**Criterion <id>:** unmet`, `**Criterion <id>:** unmet, waived by <ordinal>` or `**Criterion <id>:** unmet, defective (<class>) by <ordinal>`";
const ledgerRefusal = (detail, id = "WO-099") =>
  literal(
    `error: ${ledgerPath(id)}: ${detail}. Before handoff the executor judges each declared criterion (1, 2) on one line, met followed by its evidence or unmet followed by the decision that says why (criterion lines: ${criterionForms}).`,
  );
const readbackEnv = { CLAUDE_EFFORT: "xhigh" };
const completeReadback = ["implementation-ready", ...readbackFlags];
refuse(ledgerRefusal("absent"), completeReadback, readbackEnv);
ledger(["**Criterion 1:** met. The fixture holds."]);
refuse(
  ledgerRefusal("no line judges criterion 2"),
  completeReadback,
  readbackEnv,
);
ledger([
  "**Criterion 1:** met. One.",
  "**Criterion 2:** unmet. Two.",
  "- **Criterion 2:** met. Twice.",
]);
refuse(
  ledgerRefusal("two lines judge criterion 2"),
  completeReadback,
  readbackEnv,
);
ledger([
  "**Criterion 1:** met. One.",
  "**Criterion 2:** unmet. Two.",
  "**Criterion 3:** met. Undeclared.",
]);
refuse(
  ledgerRefusal(
    "criterion 3 is not declared by docs/work-orders/WO-099-fixture.md",
  ),
  completeReadback,
  readbackEnv,
);
ledger([
  "**Criterion 1:** met. One.",
  "```md",
  "**Criterion 2:** unmet. Fenced.",
  "```",
]);
refuse(
  ledgerRefusal("no line judges criterion 2"),
  completeReadback,
  readbackEnv,
);
// A met criterion that cites a live receipt stands on the code that receipt
// ran on: its source identity must equal the handoff identity, and a
// criterion naming a live run must cite one (WO-247).
const receiptPath = "docs/evidence/WO-099/live-drive-attempt-1.json";
const receipt = (codeIdentity) =>
  writeFileSync(
    join(root, receiptPath),
    JSON.stringify(
      codeIdentity === undefined
        ? { schemaVersion: 1, stop: { reason: "released" } }
        : {
            schemaVersion: 1,
            codeIdentity: { source: { codeIdentity }, fixtureTrees: null },
          },
    ),
  );
const citing = [
  "**Criterion 1:** met. The fixture holds; receipt [live-drive-attempt-1.json](live-drive-attempt-1.json).",
  "**Criterion 2:** unmet. WO-099-D001: the fixture leaves criterion 2 to the operator.",
];
ledger(citing);
refuse(
  /criterion 1 cites live-drive-attempt-1\.json, which is not a contained regular file under docs\/evidence/,
  completeReadback,
  readbackEnv,
);
receipt(undefined);
refuse(
  /criterion 1 cites live-drive-attempt-1\.json, which records no codeIdentity\.source/,
  completeReadback,
  readbackEnv,
);
const { gateCodeIdentity: codeIdentityOf } =
  await import("./lib/gate-evidence.mjs");
const handoffIdentity = codeIdentityOf(root);
// A criterion that names a live lifecycle stands on the identity its receipts
// carry; a receipt another criterion cites is evidence of what it recorded.
writeFileSync(
  join(root, authority),
  authorityText.replace("1. One.", "1. One live lifecycle per host."),
);
receipt("0".repeat(64));
refuse(
  new RegExp(
    `criterion 1 cites live-drive-attempt-1\\.json, whose source code identity ${"0".repeat(64)} differs from the handoff identity ${handoffIdentity}`,
  ),
  completeReadback,
  readbackEnv,
);
const recorded = await requireLiveReceiptIdentity(root, {
  checked: true,
  path: ledgerPath(),
  declared: [
    { id: "1", text: "One." },
    { id: "2", text: "Two." },
  ],
  met: ["1"],
  judgments: [
    {
      criterionId: "1",
      met: true,
      paragraph:
        "**Criterion 1:** met. [live-drive-attempt-1.json](live-drive-attempt-1.json)",
    },
  ],
});
assert.deepEqual(recorded, [
  {
    criterionId: "1",
    receipt: receiptPath,
    codeIdentity: "0".repeat(64),
    matchesHandoff: false,
  },
]);
// A receipt cited in the judgment's following lines counts with it, a blank
// line between them or not: the first receipt matches, and the second, in the
// paragraph below, is still read.
receipt(handoffIdentity);
ledger([
  "**Criterion 1:** met. Claude [live-drive-attempt-1.json](live-drive-attempt-1.json) and Codex",
  "",
  "[live-drive-attempt-2.json](live-drive-attempt-2.json), the second host's run.",
  "**Criterion 2:** unmet. WO-099-D001: the fixture leaves criterion 2 to the operator.",
]);
refuse(
  /criterion 1 cites live-drive-attempt-2\.json, which is not a contained regular file under docs\/evidence/,
  completeReadback,
  readbackEnv,
);
// A receipt inside a fenced example counts for nothing: the criterion that
// names a live lifecycle still cites none.
writeFileSync(
  join(root, authority),
  authorityText.replace("1. One.", "1. One live lifecycle per host."),
);
ledger([
  "**Criterion 1:** met. One.",
  "```md",
  "**Criterion 1:** met. [live-drive-attempt-9.json](live-drive-attempt-9.json)",
  "```",
  "**Criterion 2:** unmet. WO-099-D001: the fixture leaves criterion 2 to the operator.",
]);
refuse(
  /criterion 1 recorded met names a live lifecycle or drive but cites no live-drive-attempt-N\.json receipt/,
  completeReadback,
  readbackEnv,
);
// Only a criterion naming a live lifecycle or drive owes a receipt: mechanism
// wording and negations do not (WO-247-D005).
assert.equal(
  namesLiveRun("One live lifecycle per host on the final code."),
  true,
);
assert.equal(namesLiveRun("A live drive on each host closes the order."), true);
assert.equal(
  namesLiveRun("the boundary held in the live run of criterion 8"),
  false,
);
assert.equal(
  namesLiveRun("the stub boundary holds with no live episode"),
  false,
);
assert.equal(
  namesLiveRun(
    "requireGateClaims fails a completion whose live receipt's source identity differs",
  ),
  false,
);
assert.equal(namesLiveRun("no live drive is run for this criterion"), false);
assert.equal(namesLiveRun("judged without a live lifecycle"), false);
// A negated mention does not cancel a plain one elsewhere in the criterion.
assert.equal(
  namesLiveRun(
    "One live lifecycle per host on the final code, and no live drive runs inside the gate.",
  ),
  true,
);
assert.equal(
  namesLiveRun(
    "A live drive on each host closes the order; the gate runs without a live drive.",
  ),
  true,
);
assert.deepEqual(
  criterionJudgments(
    "**Criterion 1:** met. A\nwrapped line\n\n**Criterion 2:** unmet. B\n```\n**Criterion 3:** met. fenced\n```",
  ).map(({ criterionId, paragraph }) => [criterionId, paragraph]),
  [
    ["1", "**Criterion 1:** met. A\nwrapped line"],
    ["2", "**Criterion 2:** unmet. B"],
  ],
);
// A paragraph runs to the next judgment or heading, blank lines included.
assert.deepEqual(
  criterionJudgments(
    "**Criterion 1:** met. A\n\nmore evidence\n\n## Reviews\n\n**Criterion 2:** unmet. B",
  ).map(({ criterionId, paragraph }) => [criterionId, paragraph]),
  [
    ["1", "**Criterion 1:** met. A\n\nmore evidence"],
    ["2", "**Criterion 2:** unmet. B"],
  ],
);
// A criterion that names a live lifecycle must cite its receipt.
writeFileSync(
  join(root, authority),
  authorityText.replace("2. Two.", "2. Two: one live lifecycle per host."),
);
ledger([
  "**Criterion 1:** met. One.",
  "**Criterion 2:** met. Two, with no receipt.",
]);
refuse(
  /criterion 2 recorded met names a live lifecycle or drive but cites no live-drive-attempt-N\.json receipt/,
  completeReadback,
  readbackEnv,
);
writeFileSync(join(root, authority), authorityText);
// A matching receipt is admitted and recorded with the completion.
receipt(handoffIdentity);
ledger(citing);
// Criterion 2 without a waiver: a pass is refused and the verification fails.
const readback = call(completeReadback, readbackEnv);
assert.equal(readback.status, 0, readback.stderr);
assert.match(
  readback.stdout,
  /^WO-099 is ready for verification\. Handoff ledger: 1 met, 1 unmet \(criterion 2\)\.$/m,
);
const readbackOrdinal = events().length;
assert.deepEqual(last().unmetCriteria, ["2"]);
assert.deepEqual(last().evidence.liveReceipts, [
  {
    criterionId: "1",
    receipt: receiptPath,
    codeIdentity: handoffIdentity,
    matchesHandoff: true,
  },
]);
assert.deepEqual(status().unmetCriteria, [
  { criterionId: "2", ordinal: readbackOrdinal },
]);
assert.match(
  current(),
  new RegExp(
    `- Unmet criteria: 2 \\(recorded unmet by the executor at ordinal ${readbackOrdinal}\\)`,
  ),
);
assert.equal(matrix(), "ready-to-verify");
// The three sentences, pinned, and the unmet disclosure with both routes;
// no briefing grows by more than 400 bytes (WO-173 criterion 5).
const originalVerifySentence =
  "A finding names its class and the rule a repair must hold; a defect outside the declared criteria is boarded with its reproduction, not failed. A recorded off-ramp whose capture hash matches is judged from the record and never put back to the operator.";
const offRampSentence =
  "A recorded off-ramp whose capture hash matches is judged from the record and never put back to the operator.";
const defectBoundarySentence =
  "A repairable defect within the order's declared surfaces is repaired in the order through Adjacent Repair and may fail a criterion it breaks; a defect outside both its declared criteria and surfaces is boarded with its reproduction.";
const operatorMessageSentence =
  "A question, complaint or stale operator message is not an instruction to stop, narrow or widen work; only an explicit pause, stop or scope prefix changes it.";
const gateClaimSentence =
  "A met criterion naming npm test or npm run test:docs stands on that gate's passing row at the subject; completion consumes rows and runs no gate.";
const verifySentence = `A finding names its class and the rule a repair must hold. ${defectBoundarySentence} ${offRampSentence} ${operatorMessageSentence} ${gateClaimSentence}`;
const finalReviewSentences = `${defectBoundarySentence} ${offRampSentence} ${operatorMessageSentence} ${gateClaimSentence}`;
const repairSentence =
  "A repair closes the class the finding names: state the rule the repaired code holds and add a case the report did not quote.";
const ledgerSentence = (id, before) =>
  ` Before ${before}, judge each acceptance criterion on one line of docs/evidence/${id}/handoff.md: \`**Criterion <id>:** met\` with its evidence or \`unmet\` with why; a met criterion naming npm test or npm run test:docs stands on that gate's passing row.`;
// The three routes and the words rule (WO-249): a defect record is the
// judging role's own, and a waiver or an amendment needs the operator's words.
const routes = (id, criterion = "2") =>
  `\nThe executor recorded criterion ${criterion} unmet in docs/evidence/${id}/handoff.md. Three routes spare the cycle. A criterion no candidate can meet as written (bookkeeping, later-phase, absent-input, host-behavior, contradiction) is recorded defective with its evidence (npm run resume -- defect ${criterion} --class <class> --evidence <text> <actor flags> --work-order ${id}) and judged \`unmet, defective (<class>) by <ordinal>\`. A waiver is recorded only from the operator's words asking for that criterion's waiver (npm run resume -- waive ${criterion} --reason <text> --capture <path> --capture-hash sha256:<digest> <actor flags> --work-order ${id}), and an amendment needs the operator's words changing the criterion (npm run plan -- amend-order); words that call a criterion wrong or authorize a commit or a pull request ask for neither. Without a route the criterion is judged as it stands.`;
const bytes = (value) => Buffer.byteLength(value);
for (const [name, growth] of Object.entries({
  next: bytes(ledgerSentence("WO-099", "that command")),
  fix:
    bytes(` ${repairSentence}`) +
    bytes(ledgerSentence("WO-099", "repair-complete")),
  // The verify row measures only the bounded addition WO-173 made, apart
  // from the rules WO-179 added.
  verify: bytes(`\n${originalVerifySentence}`),
  "final-review": bytes(`\n${offRampSentence}`),
}))
  assert.ok(growth <= 400, `the ${name} briefing grows ${growth} bytes`);
const verifyBriefing = pass(["verify"]);
assert.ok(
  verifyBriefing.includes(
    `refuse a bare unknown.\n${verifySentence}${routes("WO-099")}\n`,
  ),
  verifyBriefing,
);
assert.equal(matrix(), "verifying");
const first = "docs/verifications/WO-099/VER-001.md";
report(first, [
  "**Criterion 1:** met.",
  "**Criterion 2:** unmet, waived by 9.",
]);
refuse(
  /criterion 2 names waiver ordinal 9, but no CriterionWaived event for it exists/,
  ["verification-result", "pass", ...agentFlags],
);
report(first, ["**Criterion 1:** met.", "**Criterion 2:** unmet."]);
refuse(
  /a pass cannot record criterion 2 unmet without a waiver or a defect record; record fail, record it defective with npm run resume -- defect 2 when its text puts it in one of the five classes, or record the operator's waiver with npm run resume -- waive 2 only from the operator's words asking for it/,
  ["verification-result", "pass", ...agentFlags],
);
// A fail names its basis in a readable findings block (WO-249); the unmet
// line is that basis here.
report(first, ["**Criterion 1:** met.", "**Criterion 2:** unmet."], {
  findings: null,
});
refuse(
  /a fail names its basis in the findings block, and the report has no findings block/,
  ["verification-result", "fail", ...agentFlags],
);
report(first, ["**Criterion 1:** met.", "**Criterion 2:** unmet."]);
pass(["verification-result", "fail", ...agentFlags]);
assert.equal(matrix(), "needs-fix");

// The waiver is the operator's act: capture checks, then the executor refusal.
refuse(/requires --capture-hash sha256:<digest>/, [
  "waive",
  "2",
  "--reason",
  "accepted",
  "--capture",
  "docs/intake/notes/waiver.md",
  "--capture-hash",
  "sha256:1234",
  ...operator,
]);
refuse(/operator capture hash mismatch/, [
  "waive",
  "2",
  "--reason",
  "accepted",
  "--capture",
  "docs/intake/notes/waiver.md",
  "--capture-hash",
  `sha256:${"0".repeat(64)}`,
  ...operator,
]);
writeFileSync(join(root, "docs/tracked-note.md"), "words\n");
refuse(/naming an ignored capture under docs\/intake\//, [
  "waive",
  "2",
  "--reason",
  "accepted",
  "--capture",
  "docs/tracked-note.md",
  "--capture-hash",
  `sha256:${hash("docs/tracked-note.md")}`,
  ...operator,
]);
const journal = (id, role) => {
  const directory = join(root, "docs/control/local/harness");
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, `${createHash("sha256").update(id).digest("hex")}.json`),
    JSON.stringify({
      role,
      workOrder: "WO-099",
      startedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
};
refuse(/declares acceptance criteria 1, 2, not 9/, [
  "waive",
  "9",
  "--reason",
  "accepted",
  ...waiverCapture,
  ...operator,
]);
refuse(/naming an ignored capture under docs\/intake\//, [
  "waive",
  "2",
  "--reason",
  "accepted",
  "--capture",
  "docs/intake/./notes/waiver.md",
  ...waiverCapture.slice(2),
  ...operator,
]);
refuse(/operator capture holds no words/, [
  "waive",
  "2",
  "--reason",
  "accepted",
  ...capture("blank", " \n\t\n"),
  ...operator,
]);
journal("executor-session", "executor");
// Every observed session variable counts, so renaming or blanking the one the
// harness keyed does not hide the executor (review finding, WO-158-D020).
for (const env of [
  { CLAUDE_CODE_SESSION_ID: "executor-session" },
  { CLAUDE_CODE_SESSION_ID: "executor-session", CODEX_THREAD_ID: "renamed" },
  { CLAUDE_CODE_SESSION_ID: "", CLAUDE_SESSION_ID: "executor-session" },
  { COPILOT_AGENT_SESSION_ID: "executor-session" },
])
  refuse(
    /this session is WO-099's executor, and the executor cannot record a waiver of its own order's criterion/,
    ["waive", "2", "--reason", "accepted", ...waiverCapture, ...operator],
    env,
  );
const { executorOf } = await import(
  pathToFileURL(join(root, "scripts/lib/off-ramps.mjs"))
);
// A session opened by `resume: status` records the executor role but no order.
writeFileSync(
  join(
    root,
    "docs/control/local/harness",
    `${createHash("sha256").update("status-session").digest("hex")}.json`,
  ),
  JSON.stringify({ role: "executor", intent: "resume: status" }),
);
assert.equal(
  executorOf(root, "WO-099", { CLAUDE_CODE_SESSION_ID: "status-session" }),
  null,
);
// The writer reservation is keyed by the hook's session id, which the
// command's environment cannot rename.
const reservation = join(
  root,
  "docs/control/local/harness/writer",
  `reservation-${"a".repeat(32)}.json`,
);
mkdirSync(dirname(reservation), { recursive: true });
writeFileSync(
  reservation,
  JSON.stringify({
    actorId: createHash("sha256").update("executor-session").digest("hex"),
    owner: { pid: process.pid },
  }),
);
refuse(/WO-099's executor holds this worktree's writer reservation/, [
  "waive",
  "2",
  "--reason",
  "accepted",
  ...waiverCapture,
  ...operator,
]);
rmSync(reservation);
journal("verifier-session", "verifier");
const waived = pass(
  [
    "waive",
    "2",
    "--reason",
    "operator accepted the deviation",
    ...waiverCapture,
    ...operator,
  ],
  { CLAUDE_CODE_SESSION_ID: "verifier-session" },
);
const waiver = last();
assert.equal(waiver.type, "CriterionWaived");
assert.equal(waiver.criterionId, "2");
assert.equal(waiver.capture, "docs/intake/notes/waiver.md");
assert.deepEqual(waiver.recordingSession, {
  role: "verifier",
  capture: "created-during-session",
});
assert.equal(waiver.actor.harness, "human");
const waiverOrdinal = events().length;
assert.match(waived, new RegExp(`unmet, waived by ${waiverOrdinal}`));
state = status();
assert.equal(state.phase, "needs-fix", "a waiver changes no phase");
assert.deepEqual(
  state.waivedCriteria.map(({ criterionId, ordinal }) => ({
    criterionId,
    ordinal,
  })),
  [{ criterionId: "2", ordinal: waiverOrdinal }],
);
assert.match(
  current(),
  new RegExp(`- Waived criteria: 2 \\(ordinal ${waiverOrdinal}\\)`),
);
refuse(/criterion 2 of WO-099 is already waived by ordinal/, [
  "waive",
  "2",
  "--reason",
  "again",
  ...waiverCapture,
  ...operator,
]);

// The same criterion, now waived, lets the re-verification pass.
const fixBriefing = pass(["fix"]);
assert.ok(
  fixBriefing.includes(
    `read both artifacts. ${repairSentence}${ledgerSentence("WO-099", "repair-complete")}`,
  ),
  fixBriefing,
);
assert.equal(matrix(), "repairing");
// The ledger is rewritten at each completion; the report's own waived form
// is admitted and the criterion stays recorded unmet.
ledger([
  "**Criterion 1:** met. The fixture holds.",
  `**Criterion 2:** unmet, waived by ${waiverOrdinal}. WO-099-D001.`,
]);
const repaired = pass(["repair-complete", ...agentFlags]);
assert.match(
  repaired,
  /^WO-099 repair is ready for re-verification\. Handoff ledger: 1 met, 1 unmet \(criterion 2\)\.$/m,
);
assert.deepEqual(last().unmetCriteria, ["2"]);
pass(["verify"]);
const requestedOrdinal = events().length;
const second = "docs/verifications/WO-099/VER-002.md";
report(second, ["**Criterion 1:** met.", "**Criterion 2:** unmet."]);
refuse(
  new RegExp(`criterion 2 is waived by ordinal ${waiverOrdinal}; record it as`),
  ["verification-result", "pass", ...agentFlags],
);
report(second, [
  "**Criterion 1:** met.",
  `**Criterion 2:** unmet, waived by ${waiverOrdinal}.`,
]);
pass(["verification-result", "pass", ...agentFlags]);
assert.equal(matrix(), "verified");
assert.equal(status().latestVerdict, "pass");

// The judge reads the forms a report writes criteria in, and one line each.
const { judgeCriterionLines } = await import(
  pathToFileURL(join(root, "scripts/lib/off-ramps.mjs"))
);
const unwaived = { workOrderId: "WO-099", waivedCriteria: [] };
for (const [text, refused] of [
  ["1. **Criterion 2:** unmet.", true],
  ["> **Criterion 2:** unmet.", true],
  ["- [ ] **Criterion 2:** unmet.", false],
  ["````md\n```\n````\n**Criterion 2:** unmet.", true],
  ["~~~\n```\n**Criterion 2:** unmet.\n~~~", false],
  ["```\n**Criterion 2:** unmet.\n```", false],
  ["**Criterion 2:** met.\n**Criterion 2:** unmet.", true],
  ["**Criterion 2:** met.\n**Criterion 2:** met.", false],
])
  assert.equal(
    judgeCriterionLines(text, unwaived, "pass").length > 0,
    refused,
    text,
  );

// RecordCorrected: never a verdict or report bytes; the fold projects it.
const before = hash(second);
refuse(
  /must be a normalized path to VER-002\.md; a verdict never moves to another report/,
  [
    "correct",
    second,
    "--set",
    `reportPath=${first}`,
    "--reason",
    "rebind the pass",
    ...operator,
  ],
);
refuse(
  /a report path is corrected only on a recorded result, not on VerificationRequested/,
  [
    "correct",
    String(requestedOrdinal),
    "--set",
    "reportPath=docs/verifications/WO-099/sub/VER-002.md",
    "--reason",
    "move the allocation",
    ...operator,
  ],
);
refuse(/a correction never records a claude-session-readback/, [
  "correct",
  String(readbackOrdinal),
  "--set",
  "effort=high",
  "--reason",
  "another session's effort",
  ...operator,
]);
refuse(/ultra is a supplied spelling, not a recorded effort/, [
  "correct",
  second,
  "--set",
  "effort=ultra",
  "--reason",
  "spelling",
  ...operator,
]);
pass([
  "correct",
  String(readbackOrdinal),
  "--set",
  "effort=high",
  "--set",
  "source=operator-attested",
  "--reason",
  "the executor ran at high; the operator attests it",
  ...operator,
]);
refuse(/a verdict is never corrected/, [
  "correct",
  second,
  "--set",
  "verdict=fail",
  "--reason",
  "wrong verdict",
  ...operator,
]);
refuse(/body is not a correctable field .* report bytes never change/, [
  "correct",
  second,
  "--set",
  "body=rewritten",
  "--reason",
  "rewrite the report",
  ...operator,
]);
refuse(/already records model fixture.model\/beta/, [
  "correct",
  second,
  "--set",
  "model=fixture.model/beta",
  "--reason",
  "same",
  ...operator,
]);
refuse(/a correction never records a claude-session-readback/, [
  "correct",
  second,
  "--set",
  "source=claude-session-readback",
  "--reason",
  "readback claimed",
  ...operator,
]);
refuse(/is not a contained report under docs\/verifications\/WO-099/, [
  "correct",
  second,
  "--set",
  "reportPath=docs/verifications/WO-099/missing/VER-002.md",
  "--reason",
  "missing report",
  ...operator,
]);
// A result records the digest of the report it judged, and a
// report path moves only to those bytes. A distinct VER-002.md holding other
// content (no actor or cost line, criterion 1 unmet) is refused; the same
// bytes at a contained path are admitted, the correction records the digest
// it checked, and the chained path corrects back the same way.
const relocated = "docs/verifications/WO-099/sub/VER-002.md";
const secondResult = events().find(
  (event) =>
    event.type === "VerificationCompleted" &&
    event.verificationId === "VER-002",
);
assert.equal(secondResult.reportHash, `sha256:${hash(second)}`);
mkdirSync(join(root, dirname(relocated)), { recursive: true });
writeFileSync(
  join(root, relocated),
  "# Another report\n\n**Criterion 1:** unmet.\n",
);
refuse(
  /holds different bytes from the report ordinal \d+ judged \(sha256:[0-9a-f]{64}, ordinal \d+'s recorded report digest\); a verdict never rests on another report, and a different report takes its own judgment/,
  [
    "correct",
    second,
    "--set",
    `reportPath=${relocated}`,
    "--reason",
    "rebind the pass to another report",
    ...operator,
  ],
);
assert.equal(status().verificationPath, second);
assert.equal(status().latestVerdict, "pass");
cpSync(join(root, second), join(root, relocated));
pass([
  "correct",
  second,
  "--set",
  `reportPath=${relocated}`,
  "--reason",
  "the report was relocated with its bytes",
  ...operator,
]);
assert.equal(last().type, "RecordCorrected");
assert.equal(last().subject.reportHash, `sha256:${hash(second)}`);
const relocatedOrdinal = events().length;
assert.equal(status().verificationPath, relocated);
assert.equal(status().latestVerdict, "pass");
assert.equal(hash(relocated), before);
pass([
  "correct",
  relocated,
  "--set",
  `reportPath=${second}`,
  "--reason",
  "restored to the allocated path",
  ...operator,
]);
const restoredOrdinal = events().length;
assert.equal(status().verificationPath, second);
assert.equal(hash(second), before);
const checkpoint = (ordinal) => events()[ordinal - 1];
const recordedCheckpoint = checkpoint(2);
const replacementCheckpoint = events().find(
  (event) =>
    event.checkpointRef &&
    event.checkpointRef !== recordedCheckpoint.checkpointRef,
);
assert.ok(
  replacementCheckpoint,
  JSON.stringify(
    events().map(({ type, checkpointRef, checkpointUnavailable }) => ({
      type,
      checkpointRef,
      checkpointUnavailable,
    })),
  ),
);
assert.equal(
  recordedCheckpoint.checkpointRef,
  "refs/dotln/checkpoint/WO-099/1",
  "event and checkpoint ordinals are deliberately different",
);
refuse(
  new RegExp(
    `checkpoint ${recordedCheckpoint.checkpointRef} resolves to [0-9a-f]+, not 0{40}`,
  ),
  [
    "correct",
    "2",
    "--set",
    `checkpointSha=${"0".repeat(40)}`,
    "--reason",
    "wrong sha",
    ...operator,
  ],
);
pass([
  "correct",
  "2",
  "--set",
  `checkpointRef=${replacementCheckpoint.checkpointRef}`,
  "--set",
  `checkpointSha=${replacementCheckpoint.checkpointSha}`,
  "--reason",
  "the recovery point was another recorded checkpoint",
  ...operator,
]);
assert.deepEqual(last().previous, {
  checkpointRef: recordedCheckpoint.checkpointRef,
  checkpointSha: recordedCheckpoint.checkpointSha,
});
pass([
  "correct",
  second,
  "--set",
  "model=fixture.model/gamma",
  "--set",
  "effort=high",
  "--reason",
  "the session ran gamma at high",
  ...operator,
]);
const correction = last();
assert.equal(correction.type, "RecordCorrected");
assert.equal(correction.subject.type, "VerificationCompleted");
assert.deepEqual(correction.previous, {
  model: "fixture.model/beta",
  effort: "xhigh",
});
assert.equal(hash(second), before, "report bytes never change");
state = status();
const correctionOrdinal = events().length;
assert.equal(state.latestVerdict, "pass", "the verdict is unchanged");
assert.equal(state.latestAttestation.model, "fixture.model/gamma");
assert.equal(state.latestAttestation.effort, "high");
// Every correction of the event is listed, the two path relocations included.
assert.deepEqual(state.latestAttestation.correctedBy, [
  relocatedOrdinal,
  restoredOrdinal,
  correctionOrdinal,
]);
assert.deepEqual(
  state.effortDrift.map(({ effort }) => effort),
  ["high", "xhigh"],
);
assert.equal(
  state.corrections.find(
    ({ subject }) => subject.type === "VerificationCompleted",
  ).subject.ordinal,
  correction.subject.ordinal,
);
assert.match(
  current(),
  new RegExp(
    `corrected by ordinal ${relocatedOrdinal}, ${restoredOrdinal}, ${correctionOrdinal}`,
  ),
);
assert.match(
  current(),
  new RegExp(
    `ordinal ${correctionOrdinal} corrects ordinal ${correction.subject.ordinal} \\(model fixture.model/beta -> fixture.model/gamma; effort xhigh -> high\\)`,
  ),
);

// A completion disagreeing with a readable CLAUDE_EFFORT is refused with it.
pass(["final-review"]);
assert.equal(matrix(), "final-review");
refuse(
  /this Claude Code session exports CLAUDE_EFFORT=xhigh; attest --effort xhigh --source claude-session-readback rather than high/,
  [
    "final-review-result",
    "pass",
    "--harness",
    "claude-code",
    "--harness-version",
    "fixture-1",
    "--model",
    "fixture.model/alpha",
    "--effort",
    "high",
    "--source",
    "operator-attested",
  ],
  { CLAUDE_EFFORT: "xhigh" },
);

// WorkOrderWithdrawn: terminal, disposed, and a dependency reads it as unmet.
refuse(
  /usage: npm run resume -- withdraw --disposition failed\|superseded\|abandoned/,
  [
    "withdraw",
    "--disposition",
    "paused",
    "--reason",
    "stop",
    ...waiverCapture,
    ...operator,
  ],
);
const withdrawal = capture(
  "withdraw",
  "Operator: withdraw WO-099 as failed.\n",
);
pass([
  "withdraw",
  "--disposition",
  "failed",
  "--reason",
  "the literal criterion cannot be met",
  ...withdrawal,
  ...operator,
]);
assert.equal(last().type, "WorkOrderWithdrawn");
assert.equal(
  last().orderHash,
  `sha256:${createHash("sha256").update(authorityText).digest("hex")}`,
);
state = status();
assert.equal(state.phase, "withdrawn");
assert.equal(state.withdrawal.disposition, "failed");
assert.deepEqual(state.legalNextActions, ["activate"]);
assert.deepEqual(state.legalOffRamps, []);
assert.equal(
  state.orders.find(({ workOrder }) => workOrder === "WO-099").withdrawal,
  "failed",
);
assert.match(current(), /- Phase: withdrawn/);
assert.match(
  current(),
  /- Withdrawal: failed at ordinal \d+ — the literal criterion cannot be met/,
);
assert.equal(matrix(), "withdrawn");
for (const action of ["next", "verify", "fix", "final-review", "briefing"])
  refuse(
    /phase withdrawn; run: npm run resume -- activate WO-099 docs\/work-orders\/WO-099-fixture\.md \(after the changed authority gains a new \*\*Reactivation/,
    [action],
  );
refuse(/final-review-result|phase withdrawn/, [
  "final-review-result",
  "pass",
  ...agentFlags,
]);

const dependent = "docs/work-orders/WO-100-dependent.md";
writeFileSync(
  join(root, dependent),
  `# WO-100 — dependent\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n<!-- dotln-dependencies:start -->\n${JSON.stringify([{ workOrderId: "WO-099", relation: "hard", reason: "fixture prerequisite" }])}\n<!-- dotln-dependencies:end -->\n\n**Objective:** fixture.\n`,
);
const blocked = call([
  "activate",
  "WO-100",
  dependent,
  "--work-order",
  "WO-100",
]);
assert.notEqual(blocked.status, 0);
assert.match(
  blocked.stderr,
  /WO-099 \(hard\): fixture prerequisite; WO-099 is withdrawn \(failed\) and cannot close as filed/,
);
const { readControl } = await import(
  pathToFileURL(join(root, "scripts/lib/control-store.mjs"))
);
const { readDependencies } = await import(
  pathToFileURL(join(root, "scripts/lib/dependencies.mjs"))
);
const projected = readDependencies(
  root,
  { workOrderId: "WO-100", workOrderPath: dependent },
  readControl(root),
);
assert.deepEqual(
  projected.entries.map(({ state, detail, disposition }) => ({
    state,
    detail,
    disposition,
  })),
  [{ state: "unmet", detail: "withdrawn", disposition: "failed" }],
);
assert.equal(projected.blocking.length, 1);

// Only a changed revision with a dated reactivation note leaves withdrawn.
refuse(/activate requires a changed order revision .* is unchanged/, [
  "activate",
  "WO-099",
  authority,
]);
writeFileSync(join(root, authority), `${authorityText}\nRevised.\n`);
refuse(/activate requires a changed order revision .* has no new note/, [
  "activate",
  "WO-099",
  authority,
]);
writeFileSync(
  join(root, authority),
  `${authorityText}\n**Reactivation (2000-01-01):** too early.\n`,
);
refuse(/has new notes dated only before/, ["activate", "WO-099", authority]);
// A note's date is a calendar date, not a digit shape.
for (const date of ["9999-99-99", "2026-02-30"]) {
  writeFileSync(
    join(root, authority),
    `${authorityText}\n**Reactivation (${date}):** impossible date.\n`,
  );
  refuse(new RegExp(`dates a new note ${date}, which is not a calendar date`), [
    "activate",
    "WO-099",
    authority,
  ]);
}
writeFileSync(
  join(root, authority),
  `${authorityText}\n**Reactivation (${new Date().toISOString().slice(0, 10)}):** criterion 2 was reframed.\n`,
);
pass(["activate", "WO-099", authority]);
state = status();
assert.equal(state.phase, "active", "a reactivated order leaves withdrawn");
assert.equal(state.withdrawal, null);
assert.deepEqual(state.waivedCriteria, []);
assert.doesNotMatch(current(), /Phase: withdrawn/);
// A second withdrawal needs a note the withdrawn revision did not hold.
const noted = readFileSync(join(root, authority), "utf8");
pass([
  "withdraw",
  "--disposition",
  "abandoned",
  "--reason",
  "second cycle",
  ...withdrawal,
  ...operator,
]);
writeFileSync(join(root, authority), `${noted}\n`);
refuse(/has no new note/, ["activate", "WO-099", authority]);
writeFileSync(
  join(root, authority),
  `${noted}**Reactivation (${new Date().toISOString().slice(0, 10)}):** second cycle reframed.\n`,
);
pass(["activate", "WO-099", authority]);
assert.equal(status().phase, "active");

// A closed order can bind its product gate or queue an override record.
const closedAuthority = "docs/work-orders/WO-101-closed.md";
writeFileSync(
  join(root, closedAuthority),
  authorityText.replace("WO-099 — off-ramp fixture", "WO-101 — closed fixture"),
);
const on101 = (args, env) => pass([...args, "--work-order", "WO-101"], env);
pass(["activate", "WO-101", closedAuthority, "--work-order", "WO-101"]);
const nextBriefing101 = on101(["next"]);
assert.ok(
  nextBriefing101.includes(
    `--work-order WO-101.${ledgerSentence("WO-101", "that command")}`,
  ),
  nextBriefing101,
);
// The executor records criterion 2 unmet; the verify briefing lists it with
// both routes; the verifier's session records the waiver in phase verifying;
// the report judges the criterion unmet, waived by that ordinal, and a
// passing verification is recorded (WO-173 criterion 3).
ledger(
  [
    "**Criterion 1:** met. The fixture holds.",
    "**Criterion 2:** unmet. WO-101-D001: left to the operator.",
  ],
  "WO-101",
);
on101(["implementation-ready", ...agentFlags]);
const unmetOrdinal = events("WO-101").length;
assert.deepEqual(events("WO-101").at(-1).unmetCriteria, ["2"]);
assert.deepEqual(status("WO-101").unmetCriteria, [
  { criterionId: "2", ordinal: unmetOrdinal },
]);
const verifyBriefing101 = on101(["verify"]);
assert.ok(
  verifyBriefing101.includes(`${verifySentence}${routes("WO-101")}\n`),
  verifyBriefing101,
);
assert.equal(status("WO-101").phase, "verifying");
on101(
  [
    "waive",
    "2",
    "--reason",
    "operator accepted the disclosed gap before the report",
    ...waiverCapture,
    ...operator,
  ],
  { CLAUDE_CODE_SESSION_ID: "verifier-session" },
);
const waiver101 = events("WO-101").at(-1);
assert.equal(waiver101.type, "CriterionWaived");
assert.equal(waiver101.recordingSession.role, "verifier");
const waiverOrdinal101 = events("WO-101").length;
assert.equal(
  status("WO-101").phase,
  "verifying",
  "a waiver in verifying changes no phase",
);
report("docs/verifications/WO-101/VER-001.md", [
  "**Criterion 1:** met.",
  `**Criterion 2:** unmet, waived by ${waiverOrdinal101}.`,
]);
on101(["verification-result", "pass", ...agentFlags]);
assert.equal(status("WO-101").latestVerdict, "pass");
const finalBriefing101 = on101(["final-review"]);
assert.ok(
  finalBriefing101.includes(
    `refuse a bare unknown.\n${finalReviewSentences}\n`,
  ),
  finalBriefing101,
);
assert.doesNotMatch(
  finalBriefing101,
  /The executor recorded/,
  "a criterion the record already waives needs neither route",
);
report("docs/final-reviews/WO-101/FINAL-001.md", [
  "**Criterion 1:** met.",
  `**Criterion 2:** unmet, waived by ${waiverOrdinal101}.`,
]);
on101(["final-review-result", "pass", ...agentFlags]);
assert.equal(matrix("WO-101"), "closed");

// A recorded passing final review that carries no product gate (the result
// transition only advises) is bound to one in `closed` by the row's evidence
// reference. The row must be a complete passing npm test at the working
// tree's code identity, and only a passing final review takes one; the
// correction carries the whole row for the publication consumers
// (WO-115 D026).
const reviewOrdinal = events("WO-101").length;
assert.equal(events("WO-101").at(-1).type, "FinalReviewCompleted");
assert.equal(events("WO-101").at(-1).evidence?.productGate, undefined);
const bindGate = (ordinal, reference) => [
  "correct",
  String(ordinal),
  "--set",
  `productGate=${reference}`,
  "--reason",
  "bind the gate the transition could not find",
  ...operator,
  "--work-order",
  "WO-101",
];
// `refuse` counts WO-099's events; these refusals must leave WO-101's alone.
const before101 = events("WO-101").length;
refuse(
  /no complete passing npm test row records host-gate:missing:npm test/,
  bindGate(reviewOrdinal, "host-gate:missing:npm test"),
);
const { gateCodeIdentity, gateTreeHash, recordGateChecks } = await import(
  pathToFileURL(join(root, "scripts/lib/gate-evidence.mjs"))
);
const gateRow = (evidenceRef, codeIdentity) => ({
  checkId: "npm test",
  codeIdentity,
  treeHash: gateTreeHash(root),
  subject: gateTreeHash(root),
  durationMs: 1,
  executed: true,
  exitCode: 0,
  evidenceRef,
  recordedAt: new Date().toISOString(),
});
recordGateChecks(root, [
  gateRow("host-gate:stale:npm test", "0".repeat(64)),
  gateRow("host-gate:current:npm test", gateCodeIdentity(root)),
]);
refuse(
  /records code identity 0{64}, but ordinal \d+ judged [a-f0-9]{64} \(checkpoint refs\/dotln\/checkpoint\/WO-101\/\d+\)/,
  bindGate(reviewOrdinal, "host-gate:stale:npm test"),
);
refuse(
  /a product gate is bound only to a recorded passing final review, not to ordinal \d+ \(FinalReviewRequested\)/,
  bindGate(reviewOrdinal - 1, "host-gate:current:npm test"),
);
// In closed, nothing but a product gate is corrected.
refuse(/in closed a correction binds only a product gate/, [
  "correct",
  String(reviewOrdinal),
  "--set",
  "effort=high",
  "--set",
  "source=operator-attested",
  "--reason",
  "late attestation",
  ...operator,
  "--work-order",
  "WO-101",
]);
// A bound gate must have run on the bytes the pass recorded and the working
// tree must still be those bytes.
const ignoreBytes = readFileSync(join(root, ".gitignore"));
writeFileSync(join(root, ".gitignore"), ignoreBytes + "# late edit\n");
refuse(
  /the working tree's code identity [a-f0-9]{64} differs from the [a-f0-9]{64} ordinal \d+ judged/,
  bindGate(reviewOrdinal, "host-gate:current:npm test"),
);
writeFileSync(join(root, ".gitignore"), ignoreBytes);
assert.equal(events("WO-101").length, before101);
// A complete pass cannot be rebound after a later failed execution of one
// of its tasks. Repairing that task makes the original complete row stand.
const boundIdentity = gateCodeIdentity(root);
const taskTime = new Date().toISOString();
recordGateChecks(root, [
  {
    ...gateRow("host-gate:displaced:npm test", boundIdentity),
    requiredSuites: ["fixture-task"],
    taskTimeline: [
      {
        name: "fixture-task",
        executed: true,
        durationMs: 1,
        exitCode: 0,
        finishedAt: taskTime,
      },
    ],
  },
]);
recordGateChecks(root, [
  {
    ...gateRow("host-gate:failed-task:npm test", boundIdentity),
    exitCode: 1,
    recordedAt: new Date(Date.parse(taskTime) + 1).toISOString(),
    requiredSuites: ["fixture-task"],
    taskTimeline: [
      {
        name: "fixture-task",
        executed: true,
        durationMs: 1,
        exitCode: 1,
        finishedAt: new Date(Date.parse(taskTime) + 1).toISOString(),
      },
    ],
  },
]);
refuse(
  /no complete passing npm test row records host-gate:displaced:npm test/,
  bindGate(reviewOrdinal, "host-gate:displaced:npm test"),
);
recordGateChecks(root, [
  {
    ...gateRow("host-gate:repaired-task:npm test", boundIdentity),
    recordedAt: new Date(Date.parse(taskTime) + 2).toISOString(),
    requiredSuites: ["fixture-task"],
    taskTimeline: [
      {
        name: "fixture-task",
        executed: true,
        durationMs: 1,
        exitCode: 0,
        finishedAt: new Date(Date.parse(taskTime) + 2).toISOString(),
      },
    ],
  },
]);
pass(bindGate(reviewOrdinal, "host-gate:current:npm test"));
const boundGate = events("WO-101").at(-1);
assert.equal(boundGate.type, "RecordCorrected");
assert.deepEqual(boundGate.subject, {
  ordinal: reviewOrdinal,
  type: "FinalReviewCompleted",
  reportPath: "docs/final-reviews/WO-101/FINAL-001.md",
});
assert.deepEqual(boundGate.fields, {
  productGate: "host-gate:current:npm test",
});
assert.deepEqual(boundGate.previous, { productGate: "none" });
assert.equal(
  boundGate.evidence.productGate.codeIdentity,
  gateCodeIdentity(root),
);
assert.equal(boundGate.evidence.productGate.exitCode, 0);
assert.equal(matrix("WO-101"), "closed");
assert.equal(
  status("WO-101").corrections.at(-1).evidence.productGate.evidenceRef,
  "host-gate:current:npm test",
);
refuse(
  /already records productGate host-gate:current:npm test/,
  bindGate(reviewOrdinal, "host-gate:current:npm test"),
);
// A verdict never moves to other bytes: a review with a gate keeps it.
recordGateChecks(root, [
  gateRow("host-gate:later:npm test", gateCodeIdentity(root)),
]);
refuse(
  /already records product gate host-gate:current:npm test; a verdict never moves to other bytes/,
  bindGate(reviewOrdinal, "host-gate:later:npm test"),
);

// The fold refuses a malformed off-ramp event even when hand-appended.
const { fold } = await import(pathToFileURL(join(root, "scripts/resume.mjs")));
const activation = {
  schemaVersion: 1,
  recordedAt: "2026-01-01T00:00:00.000Z",
  type: "WorkOrderActivated",
  workOrderId: "WO-101",
  workOrderPath: "docs/work-orders/WO-101.md",
};
const human = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
assert.throws(
  () =>
    fold([
      activation,
      {
        ...activation,
        type: "RecordCorrected",
        subject: { ordinal: 1 },
        fields: { verdict: "pass" },
        reason: "hand edit",
        actor: human,
      },
    ]),
  /invalid RecordCorrected field verdict at line 2/,
);
assert.throws(
  () =>
    fold([
      activation,
      {
        ...activation,
        type: "CriterionWaived",
        criterionId: "2",
        reason: "no words",
        actor: human,
      },
    ]),
  /invalid CriterionWaived operator capture at line 2/,
);
// A hand-appended gate binding must name a final review and carry a valid
// row whose reference matches the field (WO-115 D026).
const validGate = gateRow("host-gate:hand:npm test", "0".repeat(64));
for (const [label, subject, evidence, pattern] of [
  [
    "subject",
    { ordinal: 1, type: "WorkOrderActivated" },
    { productGate: validGate },
    /invalid RecordCorrected productGate subject at line 2/,
  ],
  [
    "reference",
    { ordinal: 1, type: "FinalReviewCompleted" },
    { productGate: { ...validGate, evidenceRef: "host-gate:other:npm test" } },
    /invalid RecordCorrected productGate evidence at line 2/,
  ],
  [
    "partial",
    { ordinal: 1, type: "FinalReviewCompleted" },
    { productGate: { ...validGate, partial: true } },
    /invalid RecordCorrected productGate evidence at line 2/,
  ],
])
  assert.throws(
    () =>
      fold([
        activation,
        {
          ...activation,
          type: "RecordCorrected",
          subject,
          fields: { productGate: "host-gate:hand:npm test" },
          previous: { productGate: "none" },
          reason: "hand edit",
          evidence,
          actor: human,
        },
      ]),
    pattern,
    label,
  );
// A criterion recorded met that names a gate stands on that gate's row
// (WO-173 criterion 2). `npm test` and `npm test -- --review` need a passing
// complete row at the current code identity, the review form one whose
// required suites cover the review selection the runner lists (an untracked
// script a suite declares selects it); `npm run test:docs` consumes a current
// passing row without running a gate. The same criteria recorded unmet
// record with no row and a failing document gate, and a gate that
// cannot start or a gate index that cannot be read each advise once and
// record.
const gateAuthority = (id) => `docs/work-orders/${id}-gates.md`;
const gateOrder = (id) => {
  writeFileSync(
    join(root, gateAuthority(id)),
    `# ${id} — gate fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. \`npm run test:docs\` green.\n2. \`npm test\` green at the\n   final subject.\n3. \`npm test -- --review\` green.\n4. Prose only.\n`,
  );
  pass(["activate", id, gateAuthority(id), "--work-order", id]);
};
const on = (id) => (args, env) => pass([...args, "--work-order", id], env);
const refuseOn = (id, pattern, args, env) => {
  const before = events(id).length;
  const run = call([...args, "--work-order", id], env);
  assert.notEqual(run.status, 0, `refusal expected: ${args.join(" ")}`);
  assert.match(run.stderr, pattern, args.join(" "));
  assert.doesNotMatch(run.stderr, /at file:\/\//);
  assert.equal(events(id).length, before, "a refusal appends nothing");
  return run.stderr;
};
const stubRunner = join(root, "scripts/test-runner.mjs");
const documentControl = "docs/control/local/stub-document-gate.json";
const stubDocumentGate = (exit, lines) => {
  mkdirSync(join(root, dirname(documentControl)), { recursive: true });
  writeFileSync(join(root, documentControl), JSON.stringify({ exit, lines }));
};
const plantRunner = () =>
  writeFileSync(
    stubRunner,
    `import { existsSync, readFileSync } from "node:fs";
const args = process.argv.slice(2);
if (args.includes("--list")) {
  for (const name of ["build", "alpha", ...(existsSync("scripts/declared-untracked.mjs") ? ["stub-machinery"] : [])])
    console.log(\`\${name} — protects: fixture\`);
} else if (args.includes("--document")) {
  const control = JSON.parse(readFileSync(${JSON.stringify(documentControl)}, "utf8"));
  for (const line of control.lines) console.log(line);
  process.exit(control.exit);
} else {
  console.error("unexpected stub runner arguments");
  process.exit(2);
}
`,
  );
const { readGateChecks } = await import(
  pathToFileURL(join(root, "scripts/lib/gate-evidence.mjs"))
);
const readGateChecksAt = (codeIdentity) =>
  readGateChecks(root).filter(
    (row) => row.checkId === "npm test" && row.codeIdentity === codeIdentity,
  );
const claimRow = (evidenceRef, extra = {}) => {
  const row = {
    ...gateRow(evidenceRef, gateCodeIdentity(root)),
    requiredSuites: ["build", "alpha"],
    ...extra,
  };
  return {
    ...row,
    cases: row.requiredSuites.map((name) => ({
      name,
      executed: true,
      exitCode: 0,
      durationMs: 0,
      startedAt: row.recordedAt,
      finishedAt: row.recordedAt,
    })),
  };
};
const allMet = [
  "**Criterion 1:** met. The document gate ran.",
  "**Criterion 2:** met. The gate ran.",
  "**Criterion 3:** met. The review gate ran.",
  "**Criterion 4:** met. Read.",
];
const instead =
  "record the criterion unmet with the reason instead \\(criterion lines: ";
// The binding cases above recorded complete passing rows at this code
// identity without a requiredSuites field; a plain claim stands on such a
// row, so the gate-claim cases start at an identity that holds none.
const ignoreBytes101 = readFileSync(join(root, ".gitignore"));
writeFileSync(join(root, ".gitignore"), ignoreBytes101 + "# WO-102 identity\n");
gateOrder("WO-102");
ledger(allMet, "WO-102");
const identity = gateCodeIdentity(root);
assert.equal(
  readGateChecksAt(identity).length,
  0,
  "no npm test row at the gate-claim identity",
);
const noRow = new RegExp(
  `^error: criteria 2, 3 recorded met names npm test -- --review, and no passing complete npm test row exists at the current code identity ${identity}\\. Handoff rows missing or failed: structural[^\n]*Run the named Preflight suites, or ${instead}`,
  "m",
);
const completeAgent = ["implementation-ready", ...agentFlags];
refuseOn("WO-102", noRow, completeAgent);
recordGateChecks(root, [
  claimRow("host-gate:failed:npm test", { exitCode: 1 }),
]);
refuseOn("WO-102", noRow, completeAgent);
recordGateChecks(root, [
  claimRow("host-gate:partial:npm test", {
    partial: true,
    excludedSuites: ["alpha"],
  }),
]);
refuseOn("WO-102", noRow, completeAgent);
// A passing plain row, while an untracked script a suite declares puts that
// suite into the review selection the row lacks.
recordGateChecks(root, [claimRow("host-gate:plain:npm test")]);
plantRunner();
writeFileSync(
  join(root, "scripts/declared-untracked.mjs"),
  "export const declared = true;\n",
);
// Introducing the runner and declared untracked source changes the
// code identity. First prove the old green row cannot satisfy either claim;
// then record a plain row at the new identity to judge selection coverage.
const reviewIdentity = gateCodeIdentity(root);
assert.notEqual(reviewIdentity, identity);
refuseOn(
  "WO-102",
  new RegExp(
    `^error: criteria 2, 3 recorded met names npm test -- --review, and no passing complete npm test row exists at the current code identity ${reviewIdentity}\\. Handoff rows missing or failed: structural[^\n]*Run the named Preflight suites, or ${instead}`,
    "m",
  ),
  completeAgent,
);
recordGateChecks(root, [claimRow("host-gate:plain:npm test")]);
refuseOn(
  "WO-102",
  new RegExp(
    `^error: criteria 2, 3 recorded met names npm test -- --review,[^\n]*current review selection lacks stub-machinery[^\n]*${instead}`,
    "m",
  ),
  completeAgent,
);
recordGateChecks(root, [
  claimRow("host-gate:review:npm test", {
    requiredSuites: ["build", "alpha", "stub-machinery"],
  }),
]);
// Completion consumes the document row and runs no gate: without a passing
// row at the current code identity the claim refuses, a failed row refuses,
// and a passing row records.
const documentRow = (evidenceRef, extra = {}) =>
  claimRow(evidenceRef, {
    checkId: "npm run test:docs",
    requiredSuites: ["docs-check"],
    ...extra,
  });
refuseOn(
  "WO-102",
  /^error: Handoff document row missing or failed at the current code identity \S+; run npm run test:docs once after the last document edit, then complete again, or record the criterion unmet with the reason instead/m,
  completeAgent,
);
recordGateChecks(root, [documentRow("host-gate:docs:failed", { exitCode: 1 })]);
refuseOn(
  "WO-102",
  /^error: Handoff document row missing or failed at the current code identity \S+; run npm run test:docs once after the last document edit/m,
  completeAgent,
);
recordGateChecks(root, [documentRow("host-gate:docs:passed")]);
const recordedGates = call([...completeAgent, "--work-order", "WO-102"]);
assert.equal(recordedGates.status, 0, recordedGates.stderr);
assert.doesNotMatch(recordedGates.stdout, /Running npm run test:docs/);
assert.match(
  recordedGates.stdout,
  /^WO-102 is ready for verification\. Handoff ledger: 4 met, 0 unmet\.$/m,
);
const gateEvent = events("WO-102").at(-1);
assert.equal(gateEvent.type, "ImplementationReady");
assert.deepEqual(gateEvent.unmetCriteria, []);
assert.equal(
  gateEvent.evidence.productGate.evidenceRef,
  "host-gate:review:npm test",
);
assert.equal(
  gateEvent.evidence.documentGate.evidenceRef,
  "host-gate:docs:passed",
  "the consumed document row is recorded",
);
assert.deepEqual(status("WO-102").unmetCriteria, []);
assert.doesNotMatch(on("WO-102")(["verify"]), /The executor recorded/);
// The same criteria recorded unmet record at a code identity that holds no
// row, without a runner and while the document stub would fail.
stubDocumentGate(1, ["FAIL docs-check 0.20 s"]);
rmSync(stubRunner);
const runnerAbsentIdentity = gateCodeIdentity(root);
const ignoreBytes102 = readFileSync(join(root, ".gitignore"));
writeFileSync(join(root, ".gitignore"), ignoreBytes102 + "# WO-103 identity\n");
assert.notEqual(gateCodeIdentity(root), identity);
gateOrder("WO-103");
ledger(
  [
    "**Criterion 1:** unmet. WO-103-D001: not run.",
    "**Criterion 2:** unmet. Not run.",
    "**Criterion 3:** unmet. Not run.",
    "**Criterion 4:** met. Read.",
  ],
  "WO-103",
);
const unmetRun = call([...completeAgent, "--work-order", "WO-103"]);
assert.equal(unmetRun.status, 0, unmetRun.stderr);
assert.doesNotMatch(unmetRun.stdout, /Running npm run test:docs/);
assert.doesNotMatch(
  unmetRun.stderr,
  /Advisory: (?:Document gate|Gate index|Review selection)/,
);
assert.deepEqual(events("WO-103").at(-1).unmetCriteria, ["1", "2", "3"]);
assert.match(
  unmetRun.stdout,
  /^WO-103 is ready for verification\. Handoff ledger: 1 met, 3 unmet \(criteria 1, 2, 3\)\.$/m,
);
// A verifier may judge met what the executor recorded unmet; the final
// review is then told what the executor recorded, with both routes.
on("WO-103")(["verify"]);
report("docs/verifications/WO-103/VER-001.md", [
  "**Criterion 1:** met.",
  "**Criterion 2:** met.",
  "**Criterion 3:** met.",
  "**Criterion 4:** met.",
]);
// Changing an unmet judgment to met needs the current gate evidence (WO-179).
plantRunner();
recordGateChecks(root, [
  claimRow("host-gate:verified-103:npm test", {
    requiredSuites: ["build", "alpha", "stub-machinery"],
  }),
]);
recordGateChecks(root, [documentRow("host-gate:docs-103")]);
on("WO-103")(["verification-result", "pass", ...agentFlags]);
const finalBriefing103 = on("WO-103")(["final-review"]);
assert.ok(
  finalBriefing103.includes(
    `${finalReviewSentences}\nThe executor recorded criteria 1, 2, 3 unmet in docs/evidence/WO-103/handoff.md. Three routes spare the cycle. A criterion no candidate can meet as written (bookkeeping, later-phase, absent-input, host-behavior, contradiction) is recorded defective with its evidence (npm run resume -- defect <criterion> --class <class> --evidence <text> <actor flags> --work-order WO-103) and judged \`unmet, defective (<class>) by <ordinal>\`. A waiver is recorded only from the operator's words asking for that criterion's waiver (npm run resume -- waive <criterion> --reason <text> --capture <path> --capture-hash sha256:<digest> <actor flags> --work-order WO-103), and an amendment needs the operator's words changing the criterion (npm run plan -- amend-order); words that call a criterion wrong or authorize a commit or a pull request ask for neither. Without a route the criterion is judged as it stands.\n`,
  ),
  finalBriefing103,
);
rmSync(stubRunner);
writeFileSync(join(root, ".gitignore"), ignoreBytes102);
assert.equal(gateCodeIdentity(root), runnerAbsentIdentity);
assert.notEqual(runnerAbsentIdentity, reviewIdentity);
// Removing the untracked runner changes the identity too. A historical row
// at this current identity lets the following cases isolate unavailable
// review selection and document execution rather than a stale product row.
recordGateChecks(root, [
  claimRow("host-gate:absent-runner:npm test", {
    requiredSuites: ["build", "alpha", "stub-machinery"],
  }),
]);
// A gate that cannot start, a review selection without a runner and a gate
// index that cannot be read each advise once and record.
report("docs/verifications/WO-102/VER-001.md", [
  "**Criterion 1:** unmet.",
  "**Criterion 2:** met.",
]);
on("WO-102")(["verification-result", "fail", ...agentFlags]);
const fixBriefing102 = on("WO-102")(["fix"]);
assert.ok(
  fixBriefing102.includes(
    `read both artifacts. ${repairSentence}${ledgerSentence("WO-102", "repair-complete")}`,
  ),
  fixBriefing102,
);
ledger(allMet, "WO-102");
const cannotStart = call([
  "repair-complete",
  ...agentFlags,
  "--work-order",
  "WO-102",
]);
assert.equal(cannotStart.status, 0, cannotStart.stderr);
assert.match(
  cannotStart.stderr,
  /^Advisory: Review selection unavailable \(scripts\/test-runner\.mjs is absent\); the npm test -- --review claim of criterion 3 stands on the plain npm test row \(recorded [^,]+, 0\.00 s, 3 suites, host-gate:absent-runner:npm test\)\.$/m,
);
assert.match(
  cannotStart.stderr,
  /^Advisory: Document gate cannot start: scripts\/test-runner\.mjs is absent; the npm run test:docs claim of criterion 1 is recorded as stated\.$/m,
);
assert.equal(
  (cannotStart.stderr.match(/Advisory: Document gate cannot start/g) ?? [])
    .length,
  1,
);
assert.deepEqual(events("WO-102").at(-1).unmetCriteria, []);
assert.equal(
  events("WO-102").at(-1).evidence.productGate.evidenceRef,
  "host-gate:absent-runner:npm test",
);
on("WO-102")(["verify"]);
report("docs/verifications/WO-102/VER-002.md", ["**Criterion 2:** unmet."]);
on("WO-102")(["verification-result", "fail", ...agentFlags]);
on("WO-102")(["fix"]);
const archive = join(
  root,
  "docs/control/local/harness/check-history/legacy.json",
);
mkdirSync(dirname(archive), { recursive: true });
writeFileSync(archive, "not json\n");
ledger(
  [
    "**Criterion 1:** unmet. WO-102-D002.",
    "**Criterion 2:** met. The row.",
    "**Criterion 3:** unmet. Not run.",
    "**Criterion 4:** met. Read.",
  ],
  "WO-102",
);
const unreadable = call([
  "repair-complete",
  ...agentFlags,
  "--work-order",
  "WO-102",
]);
assert.equal(unreadable.status, 0, unreadable.stderr);
assert.match(
  unreadable.stderr,
  /^Advisory: Gate index unavailable: .+; the npm test claim of criterion 2 is recorded as stated\.$/m,
);
assert.equal(
  (unreadable.stderr.match(/Advisory: Gate index unavailable/g) ?? []).length,
  1,
);
assert.deepEqual(events("WO-102").at(-1).unmetCriteria, ["1", "3"]);
assert.equal(events("WO-102").at(-1).evidence.productGate, undefined);
rmSync(archive);
// Gate storage a completion cannot read or write never refuses the handoff.
// The diff check's row is not recorded, a met claim is recorded as stated,
// the document gate is not run (its runner could not record a row and would
// exit as failed), one advisory says so and the damaged index is left as it
// is: both completions, met and unmet, under a parse error, a directory where
// the index belongs and a JSON value that is not a list. A verifier's
// completion reports the same storage once and records.
const liveIndex = join(root, "docs/control/local/harness/checks.json");
const liveBytes = readFileSync(liveIndex);
const damage = {
  "not json": () => writeFileSync(liveIndex, "not json\n"),
  directory: () => {
    rmSync(liveIndex);
    mkdirSync(liveIndex);
  },
  "not a list": () => writeFileSync(liveIndex, '{"rows":[]}\n'),
};
const restoreIndex = () => {
  rmSync(liveIndex, { recursive: true, force: true });
  writeFileSync(liveIndex, liveBytes);
};
const unavailableLines = (run) =>
  run.stderr.match(/^Advisory: Gate index unavailable: .*$/gm) ?? [];
const damaged = (id, args, kind) => {
  damage[kind]();
  const bytes = kind === "directory" ? null : readFileSync(liveIndex);
  const before = events(id).length;
  const run = call([...args, "--work-order", id]);
  assert.equal(run.status, 0, `${args[0]} under ${kind}: ${run.stderr}`);
  assert.equal(events(id).length, before + 1, "the completion records");
  assert.equal(unavailableLines(run).length, 1, run.stderr);
  assert.doesNotMatch(run.stdout, /Running npm run test:docs/);
  if (bytes) assert.deepEqual(readFileSync(liveIndex), bytes);
  else assert.ok(statSync(liveIndex).isDirectory());
  restoreIndex();
  const event = events(id).at(-1);
  assert.equal(event.evidence.gateIndexError, undefined);
  assert.equal(event.evidence.productGate, undefined);
  assert.ok(
    event.evidence.advisories.includes(
      unavailableLines(run)[0].slice("Advisory: ".length),
    ),
  );
  return { run, event };
};
const causes = {
  "not json": `Unexpected token 'o', "not json " is not valid JSON`,
  directory: "EISDIR: illegal operation on a directory, read",
  "not a list": "Malformed host gate evidence",
};
const spared = (kind, claims) =>
  literal(
    `Advisory: Gate index unavailable: ${causes[kind]}; the git diff --check row is not recorded${claims ? ", and the npm test claim of criteria 2, 3 and the npm run test:docs claim of criterion 1 are recorded as stated" : ""}.`,
  );
const unmetGates = [
  "**Criterion 1:** unmet. WO-106-D001: not run.",
  "**Criterion 2:** unmet. Not run.",
  "**Criterion 3:** unmet. Not run.",
  "**Criterion 4:** met. Read.",
];
// Were it run, this document gate would refuse the claim.
plantRunner();
stubDocumentGate(1, ["FAIL docs-check 0.20 s"]);
const sparedCase = (id, action, lines, kind) => {
  ledger(lines, id);
  const { run, event } = damaged(id, [action, ...agentFlags], kind);
  assert.match(run.stderr, spared(kind, lines === allMet));
  assert.deepEqual(
    event.unmetCriteria,
    lines === allMet ? [] : ["1", "2", "3"],
  );
};
const failVerification = (id, kind) => {
  on(id)(["verify"]);
  report(`docs/verifications/${id}/VER-001.md`, [
    "**Criterion 1:** unmet.",
    "**Criterion 2:** met.",
  ]);
  if (kind) {
    const { run } = damaged(
      id,
      ["verification-result", "fail", ...agentFlags],
      kind,
    );
    assert.match(
      run.stderr,
      literal(
        `Advisory: Gate index unavailable: ${causes[kind]}; the git diff --check row is not recorded, and the npm test claim of criterion 2 is recorded as stated.`,
      ),
    );
  } else on(id)(["verification-result", "fail", ...agentFlags]);
  on(id)(["fix"]);
};
gateOrder("WO-106");
sparedCase("WO-106", "implementation-ready", allMet, "not json");
failVerification("WO-106", "not a list");
sparedCase("WO-106", "repair-complete", unmetGates, "directory");
gateOrder("WO-107");
sparedCase("WO-107", "implementation-ready", unmetGates, "not a list");
failVerification("WO-107");
sparedCase("WO-107", "repair-complete", allMet, "not json");
rmSync(stubRunner);
// An order file whose criteria cannot be read records with one advisory and
// no ledger field, as before this rule.
writeFileSync(
  join(root, "docs/work-orders/WO-105-plain.md"),
  "# WO-105 — plain fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture without a criteria list.\n",
);
pass([
  "activate",
  "WO-105",
  "docs/work-orders/WO-105-plain.md",
  "--work-order",
  "WO-105",
]);
const unreadCriteria = call([...completeAgent, "--work-order", "WO-105"]);
assert.equal(unreadCriteria.status, 0, unreadCriteria.stderr);
assert.equal(
  (
    unreadCriteria.stderr.match(
      /^Advisory: docs\/work-orders\/WO-105-plain\.md declares no numbered acceptance criteria this completion can read; docs\/evidence\/WO-105\/handoff\.md is not checked\.$/gm,
    ) ?? []
  ).length,
  1,
);
assert.equal(events("WO-105").at(-1).unmetCriteria, undefined);
assert.deepEqual(status("WO-105").unmetCriteria, []);
assert.match(unreadCriteria.stdout, /^WO-105 is ready for verification\.$/m);
// The fold refuses a malformed unmet list, hand-appended or not, and
// projects a well-formed one with its ordinal.
assert.throws(
  () =>
    fold([
      activation,
      {
        ...activation,
        type: "ImplementationReady",
        unmetCriteria: ["2", 3],
        actor: human,
      },
    ]),
  /invalid ImplementationReady unmetCriteria at line 2/,
);
assert.deepEqual(
  fold([
    activation,
    {
      ...activation,
      type: "ImplementationReady",
      unmetCriteria: ["2"],
      actor: human,
    },
  ]).unmetCriteria,
  [{ criterionId: "2", ordinal: 2 }],
);
process.stdout.write("off-ramp fixtures passed\n");

// A post-close record stays local until a new worktree can carry its change.
{
  assert.equal(
    spawnGit(["-C", root, "checkout", "-q", "-B", "main"], {
      env: baseEnv,
    }).status,
    0,
  );
  const segmentBefore = readFileSync(segmentPath("WO-101"));
  const projectionBefore = readFileSync(join(root, "docs/control/current.md"));
  const output = on101([
    "override-record",
    "--bypassed",
    "release-close",
    "--effects",
    "fixture recovery",
    "--reason",
    "Record recovery after the order closed.",
    ...operator,
  ]);
  assert.match(
    output,
    /pending OperatorOverrideRecorded.*local\/pending-overrides/u,
  );
  assert.deepEqual(readFileSync(segmentPath("WO-101")), segmentBefore);
  assert.deepEqual(
    readFileSync(join(root, "docs/control/current.md")),
    projectionBefore,
  );
  const { readdirSync } = await import("node:fs");
  const lane = join(root, "docs/control/local/pending-overrides");
  const names = readdirSync(lane);
  assert.equal(names.length, 1);
  const pending = JSON.parse(readFileSync(join(lane, names[0]), "utf8"));
  assert.equal(pending.type, "OperatorOverrideRecorded");
  assert.equal(pending.workOrderId, "WO-101");
  assert.deepEqual(pending.bypassed, ["release-close"]);
  assert.equal(pending.actor.source, "operator-attested");
  console.log("post-close override queues without changing tracked control");

  // Only main's pending lane is consumed by the next worktree start.
  // A refusal must preserve the capture and give a usable, quoted rerun.
  for (const [index, kind] of ["branch", "detached"].entries()) {
    const linked = join(parent, `override ${kind}'s checkout`);
    assert.equal(
      spawnGit(
        [
          "-C",
          root,
          "worktree",
          "add",
          ...(kind === "detached" ? ["--detach"] : ["-b", "wo-101"]),
          linked,
          "HEAD",
        ],
        { env: baseEnv },
      ).status,
      0,
    );
    cpSync(
      join(root, "docs/control/orders"),
      join(linked, "docs/control/orders"),
      {
        recursive: true,
      },
    );
    cpSync(join(root, "docs/work-orders"), join(linked, "docs/work-orders"), {
      recursive: true,
    });
    cpSync(
      join(root, "docs/control/current.md"),
      join(linked, "docs/control/current.md"),
    );
    const capture = `docs/intake/override-${kind}.md`;
    const words = `Retain this ${kind} fixture's recovery words.\n`;
    const captureHash = `sha256:${createHash("sha256").update(words).digest("hex")}`;
    mkdirSync(join(linked, "docs/intake"), { recursive: true });
    writeFileSync(join(linked, capture), words);
    const reason = "Keep the operator's $HOME and $(literal) text.";
    const args = [
      "override-record",
      "--bypassed",
      "release-close",
      "--effects",
      `fixture ${kind} recovery`,
      "--reason",
      reason,
      "--capture",
      capture,
      "--capture-hash",
      captureHash,
      ...operator,
      ...(kind === "detached" ? ["--work-order", "WO-101"] : []),
    ];
    const run = spawnSync(
      process.execPath,
      [join(linked, "scripts/resume.mjs"), ...args],
      {
        cwd: linked,
        encoding: "utf8",
        env: baseEnv,
      },
    );
    assert.equal(run.status, 1, `${kind} checkout must refuse: ${run.stderr}`);
    assert.match(
      run.stderr,
      /closed-order override-record must run from main/u,
    );
    assert.match(run.stderr, /capture remains in this checkout/u);
    assert.ok(
      !existsSync(join(linked, "docs/control/local/pending-overrides")),
    );
    assert.equal(readFileSync(join(linked, capture), "utf8"), words);
    assert.deepEqual(
      readFileSync(join(linked, "docs/control/orders/WO-101.jsonl")),
      segmentBefore,
    );
    assert.deepEqual(
      readFileSync(join(linked, "docs/control/current.md")),
      projectionBefore,
    );
    assert.equal(
      readdirSync(lane).length,
      index + 1,
      "refusal writes neither lane",
    );
    assert.deepEqual(readFileSync(segmentPath("WO-101")), segmentBefore);
    const remedy = /^Run from main: (.+)$/mu.exec(run.stderr)?.[1];
    assert.ok(remedy, run.stderr);
    // Supply the stated capture prerequisite using fixture bytes, then execute
    // the printed command to prove both selection and shell quoting survive.
    mkdirSync(join(root, "docs/intake"), { recursive: true });
    writeFileSync(join(root, capture), words);
    const rerun = spawnSync("sh", ["-c", remedy], {
      cwd: linked,
      encoding: "utf8",
      env: baseEnv,
    });
    assert.equal(rerun.status, 0, rerun.stderr);
    assert.equal(readdirSync(lane).length, index + 2);
    const recorded = readdirSync(lane)
      .map((name) => JSON.parse(readFileSync(join(lane, name), "utf8")))
      .find((row) => row.effects.includes(`fixture ${kind} recovery`));
    assert.equal(recorded.workOrderId, "WO-101");
    assert.equal(recorded.reason, reason);
    assert.equal(recorded.capture, capture);
    assert.equal(recorded.captureHash, captureHash);
    assert.deepEqual(readFileSync(segmentPath("WO-101")), segmentBefore);
    assert.deepEqual(
      readFileSync(join(root, "docs/control/current.md")),
      projectionBefore,
    );
    console.log(
      `closed override from ${kind} worktree refuses without writes and reruns from main`,
    );
  }
}

// A dispatch extension is an operator-captured act, independent of a result.
{
  const id = "WO-108";
  gateOrder(id);
  const budgets = JSON.parse(
    readFileSync(join(scripts, "kit/budgets.template.json"), "utf8"),
  );
  budgets.dispatches.executor.wallClockMs = 0;
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify(budgets),
  );
  const captureFlags = capture(
    "bound-extension",
    "Operator: extend this fixture dispatch bound.\n",
  );
  const flags = [
    "--ceiling",
    "9000000000000",
    "--reason",
    "operator extension",
    ...captureFlags,
    ...agentFlags,
  ];
  refuseOn(id, /must extend/, [
    "accept-overrun",
    "completeRuns",
    "--ceiling",
    "0",
    "--reason",
    "invalid",
    ...captureFlags,
    ...operator,
  ]);
  const key = createHash("sha256").update("bound-executor").digest("hex");
  const statePath = join(root, `docs/control/local/harness/${key}.json`);
  writeFileSync(
    statePath,
    JSON.stringify({
      role: "executor",
      intent: "resume: next",
      workOrder: id,
      startedAt: new Date().toISOString(),
    }),
  );
  refuseOn(id, /DOTLN_DISPATCH_BOUND.*analysis:.*accept-overrun/, ["next"]);
  on(id)(
    [
      "accept-overrun",
      "wallClockMs",
      ...flags.map((flag) =>
        flag === "9000000000000" ? "1000000000000" : flag,
      ),
    ],
    { CLAUDE_CODE_SESSION_ID: "bound-executor" },
  );
  writeFileSync(
    statePath,
    JSON.stringify({
      role: "reviewer",
      workOrder: "WO-105",
      boundDispatch: {
        role: "executor",
        intent: "resume: next",
        workOrder: id,
        startedAt: new Date().toISOString(),
        phaseBoundary: "fixture",
      },
    }),
  );
  on(id)(
    [
      "accept-overrun",
      "wallClockMs",
      ...flags.map((flag) =>
        flag === "9000000000000" ? "2000000000000" : flag,
      ),
    ],
    { CLAUDE_CODE_SESSION_ID: "bound-executor" },
  );
  writeFileSync(
    statePath,
    JSON.stringify({
      role: "reviewer",
      workOrder: id,
      executedOrders: [id],
      boundDispatch: {
        role: "reviewer",
        intent: "resume: final review",
        workOrder: id,
        startedAt: new Date().toISOString(),
        phaseBoundary: "fixture",
      },
    }),
  );
  on(id)(
    [
      "accept-overrun",
      "wallClockMs",
      ...flags.map((flag) =>
        flag === "9000000000000" ? "3000000000000" : flag,
      ),
    ],
    { CLAUDE_CODE_SESSION_ID: "bound-executor" },
  );
  writeFileSync(
    statePath,
    JSON.stringify({
      role: "executor",
      intent: "resume: next",
      workOrder: id,
      startedAt: new Date().toISOString(),
    }),
  );
  const broken = [...flags];
  broken[broken.indexOf("--capture-hash") + 1] = `sha256:${"0".repeat(64)}`;
  refuseOn(id, /capture hash mismatch/, [
    "accept-overrun",
    "wallClockMs",
    ...broken,
  ]);
  on(id)(["accept-overrun", "wallClockMs", ...flags], {
    CLAUDE_CODE_SESSION_ID: "bound-executor",
  });
  const event = events(id).at(-1);
  assert.equal(event.type, "DispatchBoundAccepted");
  assert.equal(event.phase, "active");
  assert.match(event.captureHash, /^sha256:/u);
  assert.equal(status(id).boundAcceptances.length, 4);
  assert.equal(event.recordingSession.role, "executor");
  assert.deepEqual(event.actor, agent);
  assert.equal(status(id).phase, "active");
  assert.match(on(id)(["next"]), /Execute/);
  const repairStart = new Date().toISOString();
  writeFileSync(
    segmentPath(id),
    readFileSync(segmentPath(id), "utf8") +
      [
        {
          type: "VerificationCompleted",
          workOrderId: id,
          verificationId: "VER-001",
          reportPath: `docs/verifications/${id}/VER-001.md`,
          verdict: "fail",
          recordedAt: repairStart,
        },
      ]
        .map(JSON.stringify)
        .join("\n") +
      "\n",
  );
  budgets.dispatches.executor.repair.wallClockMs = 0;
  writeFileSync(
    join(root, "docs/control/budgets.json"),
    JSON.stringify(budgets),
  );
  writeFileSync(
    statePath,
    JSON.stringify({
      role: "executor",
      intent: "resume: fix",
      workOrder: id,
      startedAt: repairStart,
    }),
  );
  refuseOn(id, /DOTLN_DISPATCH_BOUND/, ["fix"]);
  on(id)(["accept-overrun", "wallClockMs", ...flags]);
  assert.match(on(id)(["fix"]), /Repair/);

  on(id)([
    "withdraw",
    "--disposition",
    "abandoned",
    "--reason",
    "fixture completed",
    ...captureFlags,
    ...operator,
  ]);
  refuseOn(id, /accept-overrun is not legal in phase withdrawn/, [
    "accept-overrun",
    "wallClockMs",
    ...flags,
  ]);
}

// A captured conversational authorization is recorded by the stopped executor
// without retiring its live writer or rewriting its phase anchor.
{
  const id = "WO-109";
  gateOrder(id);
  const executorKey = createHash("sha256")
    .update("stopped-executor")
    .digest("hex");
  const statePath = join(
    root,
    `docs/control/local/harness/${executorKey}.json`,
  );
  writeFileSync(
    statePath,
    JSON.stringify({
      role: "executor",
      intent: "resume: next",
      workOrder: id,
      startedAt: new Date().toISOString(),
    }),
  );
  const reservationPath = join(
    root,
    "docs/control/local/harness/writer",
    `reservation-${"b".repeat(32)}.json`,
  );
  mkdirSync(dirname(reservationPath), { recursive: true });
  writeFileSync(
    reservationPath,
    JSON.stringify({ actorId: executorKey, owner: { pid: process.pid } }),
  );
  const held = readFileSync(reservationPath);
  const anchor = readFileSync(statePath);
  const env = { CLAUDE_CODE_SESSION_ID: "stopped-executor" };
  const flags = [
    "accept-overrun",
    "completeRuns",
    "--ceiling",
    "4",
    "--reason",
    "operator authorizes the pending continuation from context",
    ...capture(
      "contextual-extension",
      "The pending action is another complete review.\nOperator: fucking go.\n",
    ),
    ...agentFlags,
  ];
  const broken = [...flags];
  broken[broken.indexOf("--capture-hash") + 1] = `sha256:${"0".repeat(64)}`;
  refuseOn(id, /capture hash mismatch/, broken, env);
  try {
    on(id)(flags, env);
    assert.equal(events(id).at(-1).recordingSession.role, "executor");
    assert.deepEqual(events(id).at(-1).actor, agent);
    assert.deepEqual(
      readFileSync(reservationPath),
      held,
      "continuation keeps the writer byte-exact",
    );
    assert.deepEqual(
      readFileSync(statePath),
      anchor,
      "continuation keeps the phase anchor byte-exact",
    );
    assert.equal(status(id).phase, "active");
  } finally {
    rmSync(reservationPath, { force: true });
  }
}

// An operator may authorize an as-needed run before any dispatch or stop.
{
  const id = "WO-110";
  gateOrder(id);
  const captureFlags = capture(
    "early-as-needed",
    "Operator: let this run go for as long as needed.\n",
  );
  for (const metric of ["wallClockMs", "completeRuns"]) {
    on(id)([
      "accept-overrun",
      metric,
      "--ceiling",
      "unlimited",
      "--reason",
      "early operator authorization for this phase",
      ...captureFlags,
      ...agentFlags,
    ]);
  }
  const accepted = status(id).boundAcceptances;
  assert.deepEqual(
    accepted.map((row) => [row.metric, row.ceiling]),
    [
      ["wallClockMs", null],
      ["completeRuns", null],
    ],
  );
  assert.equal(status(id).phase, "active");
  assert.match(current(), /as needed/);
  assert.match(on(id)(["next"]), /Execute/);
  refuseOn(id, /must extend/, [
    "accept-overrun",
    "completeRuns",
    "--ceiling",
    "5",
    "--reason",
    "cannot silently replace unlimited permission",
    ...captureFlags,
    ...agentFlags,
  ]);
}

// Criteria judge the product (WO-249). A criterion no candidate can meet as
// written is recorded defective by class by the verifier or the reviewer and
// never the executor; a report line citing the record is judged against it
// and against the criterion's current text; a retraction undoes a waiver or a
// defect record; a reopened handoff returns the order to the phase it left;
// and a fail names the criterion or the finding it failed on.
const criteriaSession = (name, role, id) => {
  const directory = join(root, "docs/control/local/harness");
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, `${createHash("sha256").update(name).digest("hex")}.json`),
    JSON.stringify({
      role,
      workOrder: id,
      startedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  return { CLAUDE_CODE_SESSION_ID: name };
};
const criteriaOrder = (id, third) => {
  const path = `docs/work-orders/${id}-criteria.md`;
  const write = (text) =>
    writeFileSync(
      join(root, path),
      `# ${id} — criteria fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. One.\n2. Two.\n3. ${text}\n`,
    );
  write(third);
  pass(["activate", id, path, "--work-order", id]);
  return write;
};
const criteriaHandoff = (
  id,
  act,
  third = "unmet. Bookkeeping: its subject is a byte count.",
) => {
  ledger(
    [
      "**Criterion 1:** met. One holds.",
      "**Criterion 2:** met. Two holds.",
      `**Criterion 3:** ${third}`,
    ],
    id,
  );
  return act;
};
const withAdvisory = (id, args, env) => {
  const run = call([...args, "--work-order", id], env);
  assert.equal(run.status, 0, `${args.join(" ")}: ${run.stderr}`);
  return run;
};
{
  const id = "WO-120";
  const third = "The briefing grows by at most 400 bytes.";
  const amend = criteriaOrder(id, third);
  const act = on(id);
  const executorSession = criteriaSession("criteria-executor", "executor", id);
  const verifierSession = criteriaSession("criteria-verifier", "verifier", id);
  const reviewerSession = criteriaSession("criteria-reviewer", "reviewer", id);
  criteriaHandoff(id, act);
  act(["implementation-ready", ...agentFlags]);
  const handoffOrdinal = events(id).length;

  // Criterion 4: a reopened handoff returns to the phase the handoff left,
  // clears the recorded unmet criteria, and the next completion records a
  // fresh ledger timed from the reopening.
  const reopenCapture = capture(
    "reopen-handoff",
    "Operator: I widened WO-120 after its handoff; reopen it.\n",
  );
  const reopen = [
    "reopen-handoff",
    "--reason",
    "the operator widened the order after its handoff",
    ...reopenCapture,
    ...operator,
  ];
  assert.match(
    act(reopen),
    /the ImplementationReady handoff at ordinal \d+ is reopened, and the order returns to active with its unmet criteria cleared/,
  );
  assert.equal(events(id).at(-1).type, "HandoffReopened");
  assert.deepEqual(events(id).at(-1).handoff, {
    ordinal: handoffOrdinal,
    type: "ImplementationReady",
  });
  assert.equal(status(id).phase, "active");
  assert.deepEqual(status(id).unmetCriteria, []);
  assert.deepEqual(
    status(id).reopenedHandoffs.map(({ ordinal }) => ordinal),
    [events(id).length],
  );
  assert.match(
    current(),
    /- Reopened handoffs: ordinal \d+ reopens ordinal \d+ \(ImplementationReady\)/,
  );
  refuseOn(id, /reopen-handoff is not legal in phase active/, reopen);
  criteriaHandoff(id, act, "unmet. Bookkeeping: still a byte count.");
  act(["implementation-ready", ...agentFlags]);
  assert.deepEqual(events(id).at(-1).unmetCriteria, ["3"]);
  assert.deepEqual(status(id).unmetCriteria, [
    { criterionId: "3", ordinal: events(id).length },
  ]);
  assert.equal(
    typeof status(id).elapsed.implementation,
    "number",
    "the reopened attempt is timed from its reopening",
  );

  // The unmet briefing prints the three routes and the words rule.
  const verifyBriefing = act(["verify"]);
  assert.ok(verifyBriefing.includes(routes(id, "3")), verifyBriefing);
  refuseOn(id, /reopen-handoff is not legal in phase verifying/, reopen);

  // Criterion 1: the executor is refused, and so are a class outside the five
  // and a criterion the order does not declare.
  const evidence =
    "The criterion's subject is the briefing's byte growth, a count rather than a behavior of the product.";
  const defect = (criterion = "3", kind = "bookkeeping") => [
    "defect",
    criterion,
    "--class",
    kind,
    "--evidence",
    evidence,
    ...agentFlags,
  ];
  refuseOn(
    id,
    /defect refused: this session is WO-120's executor, and the executor cannot record its own order's criterion defective/,
    defect(),
    executorSession,
  );
  refuseOn(
    id,
    /defect refused: arithmetic is not a defect class; a criterion is recorded defective as one of bookkeeping, later-phase, absent-input, host-behavior, contradiction/,
    defect("3", "arithmetic"),
    verifierSession,
  );
  refuseOn(
    id,
    /defect refused: docs\/work-orders\/WO-120-criteria\.md declares acceptance criteria 1, 2, 3, not 9/,
    defect("9"),
    verifierSession,
  );
  assert.match(
    act(defect(), verifierSession),
    /Recorded CriterionDefectRecorded for WO-120 criterion 3 \(bookkeeping\) at ordinal \d+\./,
  );
  const first = events(id).length;
  const record = events(id).at(-1);
  assert.equal(record.type, "CriterionDefectRecorded");
  assert.equal(record.criterionId, "3");
  assert.equal(record.class, "bookkeeping");
  assert.equal(record.evidence, evidence);
  assert.equal(
    record.criterionHash,
    `sha256:${createHash("sha256").update(third).digest("hex")}`,
  );
  assert.equal(record.recordingSession.role, "verifier");
  assert.deepEqual(
    status(id).defectiveCriteria.map(
      ({ criterionId, class: kind, ordinal }) => ({
        criterionId,
        kind,
        ordinal,
      }),
    ),
    [{ criterionId: "3", kind: "bookkeeping", ordinal: first }],
  );
  assert.equal(
    status(id).phase,
    "verifying",
    "a defect record changes no phase",
  );
  assert.match(
    current(),
    new RegExp(`- Defective criteria: 3 \\(bookkeeping, ordinal ${first}\\)`),
  );
  refuseOn(
    id,
    new RegExp(
      `criterion 3 of WO-120 is already recorded defective \\(bookkeeping\\) by ordinal ${first} for its current text`,
    ),
    defect(),
    verifierSession,
  );
  refuseOn(
    id,
    new RegExp(
      `waive refused: criterion 3 of WO-120 is recorded defective \\(bookkeeping\\) by ordinal ${first}; npm run resume -- retract ${first} undoes that record first`,
    ),
    ["waive", "3", "--reason", "accepted", ...waiverCapture, ...operator],
    verifierSession,
  );

  // Criterion 3, in an open phase: a retraction undoes the record, a line
  // citing the retracted ordinal is refused, and the record can be made again.
  const retractCapture = capture(
    "retract",
    "Operator: that defect record of WO-120 criterion 3 is wrong; retract it.\n",
  );
  const retract = (ordinal) => [
    "retract",
    String(ordinal),
    "--reason",
    "the operator judged the record wrong",
    ...retractCapture,
    ...operator,
  ];
  const ver = `docs/verifications/${id}/VER-001.md`;
  const defective = (ordinal, rest = ` ${evidence}`, kind = "bookkeeping") =>
    `**Criterion 3:** unmet, defective (${kind}) by ${ordinal}.${rest}`;
  refuseOn(
    id,
    /retract refused: this session is WO-120's executor, and the executor cannot retract a record of its own order's criterion/,
    retract(first),
    executorSession,
  );
  refuseOn(
    id,
    new RegExp(
      `retract refused: ordinal ${first - 1} is VerificationRequested; a retraction undoes a CriterionWaived or a CriterionDefectRecorded record`,
    ),
    retract(first - 1),
    verifierSession,
  );
  assert.match(
    act(retract(first), verifierSession),
    new RegExp(
      `Recorded OffRampRetracted for WO-120 at ordinal ${first + 1}: ordinal ${first}'s CriterionDefectRecorded of criterion 3 is retracted, and no phase changed\\.`,
    ),
  );
  assert.equal(status(id).phase, "verifying");
  assert.deepEqual(status(id).defectiveCriteria, []);
  assert.deepEqual(
    status(id).retractedOffRamps.map(({ ordinal, subject }) => [
      ordinal,
      subject,
    ]),
    [
      [
        first + 1,
        { ordinal: first, type: "CriterionDefectRecorded", criterionId: "3" },
      ],
    ],
  );
  assert.equal(events(id).at(-1).recordingSession.role, "verifier");
  assert.match(
    current(),
    new RegExp(
      `- Retracted off-ramps: ordinal ${first + 1} retracts ordinal ${first} \\(CriterionDefectRecorded, criterion 3\\)`,
    ),
  );
  refuseOn(
    id,
    new RegExp(
      `retract refused: ordinal ${first} no longer stands; ordinal ${first + 1} retracted it`,
    ),
    retract(first),
    verifierSession,
  );
  report(ver, [
    ...["**Criterion 1:** met.", "**Criterion 2:** met."],
    defective(first),
  ]);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 names defect record ordinal ${first}, but ordinal ${first} was retracted by ordinal ${first + 1}`,
    ),
    ["verification-result", "pass", ...agentFlags],
  );
  // The operator's retraction stands for the text it judged: the same record
  // for that text is refused, and the amended criterion admits a fresh one.
  refuseOn(
    id,
    new RegExp(
      `defect refused: ordinal ${first + 1} retracted ordinal ${first}, the record of criterion 3 for its current text, and the operator's retraction stands until the criterion's text is amended`,
    ),
    defect(),
    verifierSession,
  );
  amend("The briefing grows by at most 512 bytes.");
  act(defect(), verifierSession);
  const recorded = events(id).length;

  // The report line is judged against the record: its class, its ordinal,
  // its paragraph and the criterion's current text.
  const met = ["**Criterion 1:** met.", "**Criterion 2:** met."];
  report(ver, [...met, defective(recorded, ` ${evidence}`, "later-phase")]);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 names defect record ordinal ${recorded} as later-phase, but that record's class is bookkeeping`,
    ),
    ["verification-result", "pass", ...agentFlags],
  );
  report(ver, [...met, defective(recorded + 7)]);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 names defect record ordinal ${recorded + 7}, but its standing CriterionDefectRecorded event is ordinal ${recorded}`,
    ),
    ["verification-result", "pass", ...agentFlags],
  );
  report(ver, [...met, defective(recorded, "")]);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 names defect record ordinal ${recorded} with an empty paragraph`,
    ),
    ["verification-result", "pass", ...agentFlags],
  );
  // A report's header field in the paragraph is never the judge's evidence,
  // in any case, as a list item or a quotation, with the colon inside or
  // outside the emphasis.
  for (const field of [
    "**Verdict:** pass",
    "1. **Verdict:** pass.",
    "**Verdict**: pass.",
    "> **Process Cost:** unknown",
  ]) {
    report(ver, [...met, defective(recorded, ""), field]);
    refuseOn(
      id,
      new RegExp(
        `criterion 3 names defect record ordinal ${recorded} with an empty paragraph`,
      ),
      ["verification-result", "pass", ...agentFlags],
    );
  }
  report(ver, [...met, "**Criterion 3:** unmet."]);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 is recorded defective \\(bookkeeping\\) by ordinal ${recorded}; record it as \`\\*\\*Criterion 3:\\*\\* unmet, defective \\(bookkeeping\\) by ${recorded}\``,
    ),
    ["verification-result", "pass", ...agentFlags],
  );
  // An amended criterion no longer hashes to its record; a fresh record for
  // the amended text replaces it and is admitted.
  amend("The briefing grows by at most 256 bytes.");
  report(ver, [...met, defective(recorded)]);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 names defect record ordinal ${recorded}, but criterion 3's text no longer hashes to that record, so the criterion was amended after it; a fresh npm run resume -- defect 3 records the amended text`,
    ),
    ["verification-result", "pass", ...agentFlags],
  );
  assert.match(
    act(defect(), verifierSession),
    new RegExp(
      `at ordinal ${recorded + 1}, replacing ordinal ${recorded}, which the criterion's earlier text carried`,
    ),
  );
  const amended = recorded + 1;
  assert.deepEqual(
    status(id).defectiveCriteria.map(({ ordinal }) => ordinal),
    [amended],
  );
  report(ver, [...met, defective(recorded)]);
  refuseOn(
    id,
    new RegExp(
      `its standing CriterionDefectRecorded event is ordinal ${amended}`,
    ),
    ["verification-result", "pass", ...agentFlags],
  );
  // A pass with the defective line records, its summary line standing on the
  // detailed line's evidence; a pass without a findings block advises as
  // before and records all the same.
  report(
    ver,
    [...met, defective(amended, ""), "", "## Detail", "", defective(amended)],
    { findings: null },
  );
  const passed = withAdvisory(id, [
    "verification-result",
    "pass",
    ...agentFlags,
  ]);
  assert.match(
    passed.stderr,
    /Advisory: docs\/verifications\/WO-120\/VER-001\.md: the report has no findings block; the verification result records all the same\./,
  );
  assert.equal(status(id).latestVerdict, "pass");

  // Criterion 2: the final review confirms the record on the same line with
  // its own evidence, or disputes it in a fail; a met line stands over it.
  const finalBriefing = act(["final-review"]);
  assert.doesNotMatch(
    finalBriefing,
    /The executor recorded/,
    "a criterion the record holds defective needs no route",
  );
  const final = `docs/final-reviews/${id}/FINAL-001.md`;
  report(final, met);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 is recorded defective \\(bookkeeping\\) by ordinal ${amended} and this pass does not judge it`,
    ),
    ["final-review-result", "pass", ...agentFlags],
  );
  report(final, [...met, defective(amended, "")]);
  refuseOn(
    id,
    new RegExp(
      `criterion 3 names defect record ordinal ${amended} with an empty paragraph`,
    ),
    ["final-review-result", "pass", ...agentFlags],
  );
  report(final, [
    ...met,
    "**Criterion 3:** unmet. The reviewer finds it judgeable.",
  ]);
  refuseOn(
    id,
    /or, finding it judgeable, fail with a blocking finding whose basis names criterion 3/,
    ["final-review-result", "fail", ...agentFlags],
  );
  const reproduction = `docs/evidence/${id}/final-001-criterion-3.md`;
  mkdirSync(join(root, dirname(reproduction)), { recursive: true });
  writeFileSync(join(root, reproduction), "The reviewer's reproduction.\n");
  report(
    final,
    [...met, "**Criterion 3:** unmet. The reviewer finds it judgeable."],
    {
      findings: [
        {
          id: "F1",
          route: "blocking",
          class: "escape",
          summary: "Criterion 3 names a behavior and is unmet.",
          basis: { criterion: "3" },
          reproduction,
        },
      ],
    },
  );
  const disputed = withAdvisory(
    id,
    ["final-review-result", "fail", ...agentFlags],
    reviewerSession,
  );
  assert.doesNotMatch(disputed.stderr, /blocking finding F1 has/);
  assert.equal(status(id).phase, "needs-fix");
  assert.deepEqual(
    status(id).defectiveCriteria.map(({ ordinal }) => ordinal),
    [amended],
    "the record stands while a review disputes it",
  );

  // The repair answers the review; its reopened handoff returns to repairing.
  act(["fix"]);
  criteriaHandoff(id, act, "met. The byte growth is now a behavior.");
  act(["repair-complete", ...agentFlags]);
  const repairOrdinal = events(id).length;
  assert.match(
    act(reopen),
    /the RepairCompleted handoff at ordinal \d+ is reopened, and the order returns to repairing/,
  );
  assert.deepEqual(events(id).at(-1).handoff, {
    ordinal: repairOrdinal,
    type: "RepairCompleted",
  });
  assert.equal(status(id).phase, "repairing");
  criteriaHandoff(id, act, "met. The byte growth is now a behavior.");
  act(["repair-complete", ...agentFlags]);
  assert.deepEqual(events(id).at(-1).unmetCriteria, []);
  act(["verify"]);
  report(`docs/verifications/${id}/VER-002.md`, [
    ...met,
    "**Criterion 3:** met. It holds.",
  ]);
  act(["verification-result", "pass", ...agentFlags]);
  act(["final-review"]);
  report(`docs/final-reviews/${id}/FINAL-002.md`, [
    ...met,
    "**Criterion 3:** met. It holds.",
  ]);
  act(["final-review-result", "pass", ...agentFlags]);
  assert.equal(status(id).phase, "closed", "a met line stands over the record");
}

// Criterion 5: a fail names an unmet criterion or a blocking finding, in a
// readable findings block; a blocking entry's basis and reproduction advise.
{
  const id = "WO-121";
  criteriaOrder(id, "Three.");
  const act = on(id);
  criteriaHandoff(id, act, "met. Three holds.");
  act(["implementation-ready", ...agentFlags]);
  act(["verify"]);
  const ver = `docs/verifications/${id}/VER-001.md`;
  const met = [
    "**Criterion 1:** met.",
    "**Criterion 2:** met.",
    "**Criterion 3:** met.",
  ];
  report(ver, met);
  refuseOn(
    id,
    /a fail names an unmet criterion or a blocking finding: every criterion line here is met, waived or defective, and the findings block lists no blocking entry/,
    ["verification-result", "fail", ...agentFlags],
  );
  report(ver, met, { findings: null });
  refuseOn(
    id,
    /a fail names its basis in the findings block, and the report has no findings block/,
    ["verification-result", "fail", ...agentFlags],
  );
  writeFileSync(
    join(root, ver),
    `${readFileSync(join(root, ver), "utf8")}\n<!-- dotln-findings:start -->\n[{"id": "F1",\n<!-- dotln-findings:end -->\n`,
  );
  refuseOn(
    id,
    /a fail names its basis in the findings block, and the findings block is not valid JSON/,
    ["verification-result", "fail", ...agentFlags],
  );
  const reproduction = `docs/evidence/${id}/ver-001-regression.md`;
  mkdirSync(join(root, dirname(reproduction)), { recursive: true });
  writeFileSync(
    join(root, reproduction),
    "The probe main passes and the change fails.\n",
  );
  report(ver, met, {
    findings: [
      {
        id: "F1",
        route: "blocking",
        class: "escape",
        summary: "The change broke the status read main had.",
        basis: { regression: "status --json read the order on main" },
        reproduction,
      },
    ],
  });
  const failed = withAdvisory(id, [
    "verification-result",
    "fail",
    ...agentFlags,
  ]);
  assert.doesNotMatch(failed.stderr, /blocking finding F1 has/);
  assert.equal(status(id).phase, "needs-fix");
}
{
  const id = "WO-122";
  criteriaOrder(id, "Three.");
  const act = on(id);
  criteriaHandoff(id, act, "met. Three holds.");
  act(["implementation-ready", ...agentFlags]);
  act(["verify"]);
  report(
    `docs/verifications/${id}/VER-001.md`,
    ["**Criterion 1:** met.", "**Criterion 2:** met.", "**Criterion 3:** met."],
    {
      findings: [
        {
          id: "F1",
          route: "blocking",
          class: "escape",
          summary: "A blocking finding with no basis.",
        },
        {
          id: "F2",
          route: "blocking",
          class: "escape",
          summary: "A basis naming an undeclared criterion.",
          basis: { criterion: "9" },
          reproduction: "docs/evidence/WO-122/absent.md",
        },
        {
          id: "F3",
          route: "blocking",
          class: "escape",
          summary: "A numeric basis naming a criterion the report judges met.",
          basis: { criterion: 3 },
          reproduction: "docs/evidence/WO-122/repro.md",
        },
      ],
    },
  );
  mkdirSync(join(root, "docs/evidence/WO-122"), { recursive: true });
  writeFileSync(join(root, "docs/evidence/WO-122/repro.md"), "Repro.\n");
  const advised = withAdvisory(id, [
    "verification-result",
    "fail",
    ...agentFlags,
  ]);
  assert.match(
    advised.stderr,
    /Advisory: docs\/verifications\/WO-122\/VER-001\.md: blocking finding F1 has no basis \("basis": \{"criterion": "<id>"\} or \{"regression": "<the behavior main had>"\} and a "reproduction" path\) and no reproduction path under docs\/evidence\/WO-122\/; blocking finding F2 has/,
  );
  assert.match(
    advised.stderr,
    /blocking finding F2 has a basis criterion 9 the order does not declare and a reproduction docs\/evidence\/WO-122\/absent\.md that is not a file; blocking finding F3 has a basis criterion 3 the report judges met; the result records all the same\n/,
  );
  assert.equal(status(id).phase, "needs-fix");
  assert.ok(
    events(id)
      .at(-1)
      .evidence.advisories.some((line) =>
        line.includes("blocking finding F1 has no basis"),
      ),
    "the advisory rides on the recorded result",
  );
}

// One record judges a criterion: a waiver refuses a defect record until the
// operator's retraction undoes it, a record the amended text replaced no
// longer stands to retract, and a criterion a planning pass struck is judged
// by no report, so a pass carries no line for its standing record.
{
  const id = "WO-123";
  const path = `docs/work-orders/${id}-criteria.md`;
  const amend = criteriaOrder(id, "Three counts bytes.");
  const act = on(id);
  const verifierSession = criteriaSession(
    "criteria-verifier-123",
    "verifier",
    id,
  );
  criteriaHandoff(id, act);
  act(["implementation-ready", ...agentFlags]);
  act(["verify"]);
  act(
    [
      "waive",
      "3",
      "--reason",
      "the operator accepts it unmet",
      ...capture("waive-123", "Operator: accept WO-123 criterion 3 unmet.\n"),
      ...operator,
    ],
    verifierSession,
  );
  const waiver = events(id).length;
  const defect = [
    "defect",
    "3",
    "--class",
    "bookkeeping",
    "--evidence",
    "Criterion 3's subject is a byte count, not a behavior of the product.",
    ...agentFlags,
  ];
  refuseOn(
    id,
    new RegExp(
      `defect refused: criterion 3 of WO-123 is waived by ordinal ${waiver}, and one record judges a criterion`,
    ),
    defect,
    verifierSession,
  );
  const retract = (ordinal) => [
    "retract",
    String(ordinal),
    "--reason",
    "the operator's words asked for no waiver",
    ...capture(
      "retract-123",
      "Operator: I never asked to waive WO-123 criterion 3; retract it.\n",
    ),
    ...operator,
  ];
  assert.match(
    act(retract(waiver), verifierSession),
    new RegExp(
      `Recorded OffRampRetracted for WO-123 at ordinal ${waiver + 1}: ordinal ${waiver}'s CriterionWaived of criterion 3 is retracted, and no phase changed\\.`,
    ),
  );
  assert.deepEqual(status(id).waivedCriteria, []);
  act(defect, verifierSession);
  const replaced = events(id).length;
  amend("Three counts bytes, amended.");
  act(defect, verifierSession);
  const standing = events(id).length;
  refuseOn(
    id,
    new RegExp(
      `retract refused: ordinal ${replaced} no longer stands; a later record of criterion 3 replaced it`,
    ),
    retract(replaced),
    verifierSession,
  );
  writeFileSync(
    join(root, path),
    `# ${id} — criteria fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. One.\n2. Two.\n`,
  );
  report(`docs/verifications/${id}/VER-001.md`, [
    "**Criterion 1:** met.",
    "**Criterion 2:** met.",
  ]);
  act(["verification-result", "pass", ...agentFlags]);
  assert.equal(status(id).latestVerdict, "pass");
  assert.deepEqual(
    status(id).defectiveCriteria.map(({ ordinal }) => ordinal),
    [standing],
    "the struck criterion's record stands; no report judges it",
  );
}

// Criterion 3, across activations: a record of an earlier activation is not
// this activation's to retract.
{
  ledger(["**Criterion 1:** met. One.", "**Criterion 2:** met. Two."]);
  on("WO-099")(["implementation-ready", ...agentFlags]);
  on("WO-099")(["verify"]);
  refuseOn(
    "WO-099",
    new RegExp(
      `retract refused: ordinal ${waiverOrdinal} precedes WO-099's current activation at ordinal \\d+`,
    ),
    [
      "retract",
      String(waiverOrdinal),
      "--reason",
      "an earlier activation's waiver",
      ...waiverCapture,
      ...operator,
    ],
  );
}

// Criterion 6: a heading inside a fenced example does not end a judgment's
// paragraph, so a citation after the fence still belongs to the judgment.
{
  const [judgment] = criterionJudgments(
    [
      "**Criterion 1:** met. The example below holds.",
      "",
      "```md",
      "## A heading inside the example",
      "```",
      "",
      "Receipt: docs/evidence/WO-247/live-drive-attempt-4.json.",
      "",
      "## The next section",
      "",
      "Not this judgment's.",
    ].join("\n"),
  );
  assert.match(judgment.paragraph, /live-drive-attempt-4\.json/);
  // The report's findings block ends a paragraph too: it is never read as
  // the evidence a defective line carries.
  const [beforeBlock] = criterionJudgments(
    [
      "**Criterion 3:** unmet, defective (bookkeeping) by 4.",
      "",
      "<!-- dotln-findings:start -->",
      "[]",
      "<!-- dotln-findings:end -->",
    ].join("\n"),
  );
  assert.equal(beforeBlock.evidence, false);
  // A plain "Subject:" line is the judge's evidence; the bold header field
  // a report carries is not.
  const evidenceOf = (line) =>
    criterionJudgments(
      `**Criterion 3:** unmet, defective (bookkeeping) by 4.\n${line}`,
    )[0].evidence;
  assert.equal(
    evidenceOf("Subject: a byte count of the briefing, not a behavior."),
    true,
  );
  assert.equal(evidenceOf("**Subject:** WO-249"), false);
  assert.equal(beforeBlock.defectiveBy, 4);
  assert.equal(beforeBlock.defectClass, "bookkeeping");
  assert.doesNotMatch(
    judgment.paragraph,
    /A heading inside the example|Not this judgment's/,
  );
}

// Criterion 3, in closed: the pull request's merge state, read as release
// close reads it after fetching origin's main, decides the retraction's form.
// Its own repository holds a main checkout, the order's worktree and origin.
{
  const id = "WO-124";
  const main = join(parent, "closed-retraction");
  const order = join(parent, "closed-retraction-wo-124");
  const origin = join(parent, "closed-retraction-origin.git");
  mkdirSync(join(main, "scripts"), { recursive: true });
  copyFixtureFiles(
    join(scripts, ".."),
    main,
    "scripts/test-off-ramps.fixture-inputs.json",
  );
  cpSync(join(scripts, "lib"), join(main, "scripts/lib"), { recursive: true });
  installBeaconFixture(main);
  const git = (cwd, ...args) => {
    const run = spawnGit(["-C", cwd, ...args], {
      env: baseEnv,
      encoding: "utf8",
    });
    assert.equal(run.status, 0, `git ${args.join(" ")}: ${run.stderr}`);
    return (run.stdout ?? "").trim();
  };
  assert.equal(spawnGit(["init", "-q", main]).status, 0);
  cpSync(join(scripts, "../.gitignore"), join(main, ".gitignore"));
  git(main, "checkout", "-q", "-B", "main");
  git(main, "add", "-A");
  git(main, "-c", "maintenance.auto=false", "commit", "-q", "-m", "fixture");
  assert.equal(spawnGit(["init", "-q", "--bare", origin]).status, 0);
  git(main, "remote", "add", "origin", origin);
  git(main, "push", "-q", "origin", "main");
  git(main, "worktree", "add", "-q", "-b", "wo-124", order, "main");
  const run = (checkout, args, env = {}) =>
    spawnSync(
      process.execPath,
      [join(checkout, "scripts/resume.mjs"), ...args, "--work-order", id],
      { cwd: checkout, encoding: "utf8", env: { ...baseEnv, ...env } },
    );
  const ok = (checkout, args, env) => {
    const result = run(checkout, args, env);
    assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
    return result.stdout;
  };
  const segment = (checkout) =>
    readFileSync(join(checkout, `docs/control/orders/${id}.jsonl`), "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
  const state = (checkout) => JSON.parse(ok(checkout, ["status", "--json"]));
  const write = (checkout, path, text) => {
    mkdirSync(join(checkout, dirname(path)), { recursive: true });
    writeFileSync(join(checkout, path), text);
  };
  const authority = `docs/work-orders/${id}-closed.md`;
  write(
    order,
    authority,
    `# ${id} — closed retraction fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. One.\n2. Two.\n3. Three contradicts two.\n`,
  );
  // The repository meters, so release preparation writes the record lines
  // the pass and the publication read.
  write(
    order,
    "docs/control/budgets.json",
    readFileSync(join(scripts, "kit/budgets.template.json"), "utf8"),
  );
  const verifier = (() => {
    const name = "closed-retraction-verifier";
    write(
      order,
      `docs/control/local/harness/${createHash("sha256").update(name).digest("hex")}.json`,
      JSON.stringify({
        role: "verifier",
        workOrder: id,
        startedAt: "2026-01-01T00:00:00.000Z",
      }),
    );
    return { CLAUDE_CODE_SESSION_ID: name };
  })();
  const reportIn = (path, lines) =>
    write(
      order,
      path,
      [
        "# Report",
        "",
        `**Actor attestation:** ${JSON.stringify(agent)}`,
        "**Process cost:** unknown; cause no-session",
        "",
        ...lines,
        ...findingsBlock([]),
        "",
      ].join("\n"),
    );
  const met = ["**Criterion 1:** met.", "**Criterion 2:** met."];
  // One pass through the lifecycle to closed, criterion 3 recorded
  // defective (contradiction) by the verifier and confirmed by the review.
  const close = (round) => {
    write(
      order,
      `docs/evidence/${id}/handoff.md`,
      `# Handoff\n\n**Criterion 1:** met. One.\n**Criterion 2:** met. Two.\n**Criterion 3:** unmet. Contradiction: it cannot hold with criterion 2.\n`,
    );
    ok(order, [
      round === 1 ? "implementation-ready" : "repair-complete",
      ...agentFlags,
    ]);
    ok(order, ["verify"]);
    const recordedDefect = ok(
      order,
      [
        "defect",
        "3",
        "--class",
        "contradiction",
        "--evidence",
        "Criterion 3 cannot hold with criterion 2 as written.",
        ...agentFlags,
      ],
      verifier,
    );
    // Round 1 has no stored body yet; round 2's record leaves it stale.
    assert.equal(
      recordedDefect.includes(
        "The stored pull-request body's criterion lines are now stale: npm run release -- prepare --local rewrites them before the final review's pass.",
      ),
      round === 2,
      recordedDefect,
    );
    const ordinal = segment(order).length;
    const line = `**Criterion 3:** unmet, defective (contradiction) by ${ordinal}. It cannot hold with criterion 2.`;
    reportIn(`docs/verifications/${id}/VER-00${round}.md`, [...met, line]);
    ok(order, ["verification-result", "pass", ...agentFlags]);
    ok(order, ["final-review"]);
    reportIn(`docs/final-reviews/${id}/FINAL-00${round}.md`, [
      ...met,
      `**Criterion 3:** unmet, defective (contradiction) by ${ordinal}. The review confirms the contradiction.`,
    ]);
    // The stored body names the record for the operator; the pass refuses
    // stale lines while release preparation can still rewrite them.
    const body = `docs/final-reviews/${id}/PR.md`;
    const recordLine = `- Criterion 3: defective (contradiction) by ordinal ${ordinal}; npm run resume -- retract ${ordinal} --work-order ${id} in the order's worktree undoes a wrong record before the merge.`;
    if (round === 1) {
      write(order, body, `# ${id}\n\nReviewed.\n`);
      const length = segment(order).length;
      const stale = run(order, ["final-review-result", "pass", ...agentFlags]);
      assert.notEqual(stale.status, 0);
      assert.ok(
        stale.stderr.includes(
          `final-review-result pass refused: ${body}: the body's criterion lines do not match the 1 waived or defective criterion the order's record holds; release preparation writes these lines above the process table:\n${recordLine}\n`,
        ),
        stale.stderr,
      );
      assert.equal(segment(order).length, length, "a refusal appends nothing");
    }
    write(
      order,
      body,
      `# ${id}\n\nReviewed.\n\n<!-- dotln-criterion-records:start -->\n\n${recordLine}\n\n<!-- dotln-criterion-records:end -->\n`,
    );
    if (round === 2) {
      // Without a process meter preparation writes no lines, so the pass
      // names their removal instead of preparation.
      const budgets = join(order, "docs/control/budgets.json");
      const budgetBytes = readFileSync(budgets);
      rmSync(budgets);
      const unmetered = run(order, [
        "final-review-result",
        "pass",
        ...agentFlags,
      ]);
      writeFileSync(budgets, budgetBytes);
      assert.notEqual(unmetered.status, 0);
      assert.ok(
        unmetered.stderr.includes(
          `final-review-result pass refused: ${body}: the body names criterion-record lines, which release preparation writes only for a launchpad order in a repository with a process meter; remove them\nThen npm run test:docs runs again before the pass is recorded.`,
        ),
        unmetered.stderr,
      );
    }
    ok(order, ["final-review-result", "pass", ...agentFlags]);
    assert.equal(state(order).phase, "closed");
    return ordinal;
  };
  ok(order, ["activate", id, authority]);
  const firstRecord = close(1);
  const words =
    "Operator: that record of WO-124 criterion 3 is wrong; retract it before I merge.\n";
  const captureFile = "docs/intake/notes/closed-retraction.md";
  write(order, captureFile, words);
  const retract = (ordinal) => [
    "retract",
    String(ordinal),
    "--reason",
    "the operator read the pull-request body and judged the record wrong",
    "--capture",
    captureFile,
    "--capture-hash",
    `sha256:${createHash("sha256").update(words).digest("hex")}`,
    ...operator,
  ];
  // A merge state that cannot be read records nothing.
  const originUrl = git(main, "remote", "get-url", "origin");
  git(main, "remote", "set-url", "origin", join(parent, "missing-origin.git"));
  const unread = segment(order).length;
  const blind = run(order, retract(firstRecord));
  assert.notEqual(blind.status, 0);
  assert.match(
    blind.stderr,
    /retract cannot read whether WO-124's pull request is merged \(the launchpad fetch failed: [^)]+\); nothing was recorded/,
  );
  assert.equal(segment(order).length, unread);
  git(main, "remote", "set-url", "origin", originUrl);
  // Unmerged, from main: main holds the reviewed record, but the order's
  // branch has moved past origin's main, so the retraction returns the order
  // to repair in its own worktree, which the refusal names.
  git(order, "add", "-A");
  git(
    order,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-q",
    "-m",
    `${id} reviewed once`,
  );
  git(order, "push", "-q", "origin", "HEAD:main");
  git(main, "pull", "-q", "--ff-only", "origin", "main");
  write(order, "notes/after-review.md", "A commit origin's main lacks.\n");
  git(order, "add", "-A");
  git(order, "-c", "maintenance.auto=false", "commit", "-q", "-m", "after");
  write(main, captureFile, words);
  const mainSegment = readFileSync(
    join(main, `docs/control/orders/${id}.jsonl`),
  );
  const fromMain = run(main, retract(firstRecord));
  assert.notEqual(fromMain.status, 0);
  assert.ok(
    fromMain.stderr.includes(
      `WO-124's pull request is unmerged, so its retraction returns the order to repair in its own worktree; nothing was written. Run the same command in ${realpathSync(order)}.`,
    ),
    fromMain.stderr,
  );
  assert.deepEqual(
    readFileSync(join(main, `docs/control/orders/${id}.jsonl`)),
    mainSegment,
  );
  // Unmerged: the order returns to needs-fix with the retraction as its
  // failure source, and release close refuses while it stands unrepaired.
  assert.match(
    ok(order, retract(firstRecord)),
    /The pull request is unmerged, so the order returns to needs-fix with the retraction as its failure source/,
  );
  const retraction = segment(order).at(-1);
  const retractionOrdinal = segment(order).length;
  assert.equal(retraction.type, "OffRampRetracted");
  assert.equal(retraction.pullRequest, "unmerged");
  assert.match(
    readFileSync(join(order, "docs/control/current.md"), "utf8"),
    new RegExp(
      `- Retracted off-ramps: ordinal ${retractionOrdinal} retracts ordinal ${firstRecord} \\(CriterionDefectRecorded, criterion 3; pull request unmerged\\)`,
    ),
  );
  // The branch then merges without its repair: main's record holds the
  // reviewed pass and the retraction stays in the order's worktree, so a
  // retraction from main is refused, naming the repair there.
  git(order, "push", "-q", "origin", "HEAD:main");
  git(main, "pull", "-q", "--ff-only", "origin", "main");
  const unrepaired = run(main, retract(firstRecord));
  assert.notEqual(unrepaired.status, 0);
  assert.ok(
    unrepaired.stderr.includes(
      `ordinal ${firstRecord} of WO-124 is already retracted in its worktree ${realpathSync(order)}, recorded there before a merge that left it unrepaired; the repair, a fresh verification and a fresh final review in that worktree answer it, as release close demands`,
    ),
    unrepaired.stderr,
  );
  const mainLane = join(main, "docs/control/local/pending-overrides");
  assert.ok(!existsSync(mainLane) || readdirSync(mainLane).length === 0);
  let projected = state(order);
  assert.equal(projected.phase, "needs-fix");
  assert.deepEqual(projected.defectiveCriteria, []);
  assert.deepEqual(projected.legalNextActions, ["fix"]);
  const { unrepairedRetraction } = await import(
    pathToFileURL(join(order, "scripts/lib/control.mjs"))
  );
  assert.equal(
    unrepairedRetraction(segment(order))?.subject.ordinal,
    firstRecord,
  );
  const repair = ok(order, ["fix"]);
  assert.ok(
    repair.includes(
      `using ${captureFile}, the operator's words retracting ordinal ${firstRecord} (the CriterionDefectRecorded of criterion 3, now judged without it)`,
    ),
    repair,
  );
  assert.equal(
    segment(order).at(-1).sourceFindingId,
    `retraction-${retractionOrdinal}`,
  );
  // The operator's retraction stands for the text it judged, so the repair
  // amends criterion 3 before the verifier records it defective again.
  write(
    order,
    authority,
    `# ${id} — closed retraction fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** fixture.\n\n**Acceptance criteria (all required)**\n\n1. One.\n2. Two.\n3. Three, amended, still contradicts two.\n`,
  );
  const secondRecord = close(2);
  // Repaired there but not yet merged: only merging that branch remains.
  const repairedOnly = run(main, retract(firstRecord));
  assert.notEqual(repairedOnly.status, 0);
  assert.ok(
    repairedOnly.stderr.includes(
      `ordinal ${firstRecord} of WO-124 is already retracted in its worktree ${realpathSync(order)}, recorded there before a merge that left it unrepaired; its repair has passed there since, and merging that branch answers it`,
    ),
    repairedOnly.stderr,
  );
  assert.equal(
    unrepairedRetraction(segment(order)),
    undefined,
    "the repair, verification and review answer it",
  );
  // Merged: from the order's worktree nothing is written; from main the
  // record waits in main's pending lane and the order stays closed.
  git(order, "add", "-A");
  git(
    order,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-q",
    "-m",
    `${id} reviewed`,
  );
  git(order, "push", "-q", "origin", "HEAD:main");
  git(main, "pull", "-q", "--ff-only", "origin", "main");
  const before = readFileSync(join(order, `docs/control/orders/${id}.jsonl`));
  const refused = run(order, retract(secondRecord));
  assert.notEqual(refused.status, 0);
  assert.match(
    refused.stderr,
    /WO-124's pull request is merged, so its retraction is recorded from main; nothing was written\./,
  );
  assert.deepEqual(
    readFileSync(join(order, `docs/control/orders/${id}.jsonl`)),
    before,
  );
  write(main, captureFile, words);
  assert.match(
    ok(main, retract(secondRecord)),
    new RegExp(
      `^Recorded pending OffRampRetracted for WO-124 \\(ordinal ${secondRecord}'s CriterionDefectRecorded of criterion 3\\) in docs/control/local/pending-overrides/WO-124-[0-9a-f-]{36}\\.json; the next worktree start carries it into the reviewed record\\. The pull request is merged, so the branch cannot be repaired in place and the order stays closed: a planning pass files the follow-up from the record, where npm run plan -- failures counts the retraction\\.$`,
      "m",
    ),
  );
  const lane = join(main, "docs/control/local/pending-overrides");
  const [pendingName, ...others] = readdirSync(lane);
  assert.deepEqual(others, []);
  const pending = JSON.parse(readFileSync(join(lane, pendingName), "utf8"));
  assert.equal(pending.type, "OffRampRetracted");
  assert.equal(pending.pullRequest, "merged");
  assert.deepEqual(pending.subject, {
    ordinal: secondRecord,
    type: "CriterionDefectRecorded",
    criterionId: "3",
  });
  assert.equal(
    state(main).phase,
    "closed",
    "a merged order's retraction changes no phase",
  );
  // A second retraction of the same record waits on nothing: the lane's
  // first record already carries it, so main refuses the duplicate.
  const duplicate = run(main, retract(secondRecord));
  assert.notEqual(duplicate.status, 0);
  assert.ok(
    duplicate.stderr.includes(
      `ordinal ${secondRecord} of WO-124 is already retracted by the pending record ${pendingName}; the next worktree start carries it`,
    ),
    duplicate.stderr,
  );
  assert.deepEqual(readdirSync(lane), [pendingName]);
  // A released order takes no retraction: its close is recorded.
  write(
    main,
    `docs/control/local/retained/${id}/release-close.json`,
    JSON.stringify({
      workOrderId: id,
      dryRun: false,
      publication: { outcome: "no-release" },
      cleanup: { outcome: "clean" },
    }),
  );
  const released = run(main, retract(secondRecord));
  assert.notEqual(released.status, 0);
  assert.match(
    released.stderr,
    /retract refused: WO-124 is released, and a retraction after release close records nothing/,
  );
  assert.deepEqual(readdirSync(lane), [pendingName]);
  // The next worktree start carries the record into the reviewed record; a
  // start that copied it once and kept its source file carries it again
  // without folding the retraction twice.
  const { carryPendingOverrides } = await import(
    pathToFileURL(join(main, "scripts/lib/pending-overrides.mjs"))
  );
  const pendingBytes = readFileSync(join(lane, pendingName), "utf8");
  const carryAdvisories = [];
  const carry = () =>
    carryPendingOverrides(main, order, () => {}, {
      advisory: (line) => carryAdvisories.push(line),
    });
  assert.deepEqual(carry(), [id]);
  assert.equal(segment(order).at(-1).type, "OffRampRetracted");
  const carried = segment(order).length;
  writeFileSync(join(lane, pendingName), pendingBytes);
  assert.deepEqual(carry(), [id]);
  assert.deepEqual(carryAdvisories, []);
  assert.equal(
    segment(order).length,
    carried,
    "the held event is not appended twice",
  );
  assert.deepEqual(readdirSync(lane), []);
  // Carried out of the lane, the retraction is in the order's worktree until
  // that branch merges, where main's record and lane show neither; a second
  // one from main is refused, naming the worktree that holds the first.
  rmSync(join(main, `docs/control/local/retained/${id}/release-close.json`));
  const again = run(main, retract(secondRecord));
  assert.notEqual(again.status, 0);
  assert.ok(
    again.stderr.includes(
      `ordinal ${secondRecord} of WO-124 is already retracted in the worktree ${realpathSync(order)}, which a worktree start carried it into; main's record holds it once that branch merges`,
    ),
    again.stderr,
  );
  assert.deepEqual(readdirSync(lane), []);
  console.log("closed retractions read the merge as release close does");
}
