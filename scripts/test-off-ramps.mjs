import { spawnGit } from "./lib/git.mjs";
// WO-158 off-ramps: each route appends its typed event with the actor
// attestation, refuses outside its legal phases with the legal list, and
// projects in status --json and current.md; withdrawn is terminal.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
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
cpSync(join(scripts, "resume.mjs"), join(root, "scripts/resume.mjs"));
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
  ["commit", "-q", "-m", "fixture"],
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
const legalIn = {
  none: [],
  active: ["withdraw", "correct", "override-record"],
  "ready-to-verify": ["withdraw", "correct", "override-record"],
  verifying: ["waive", "withdraw", "correct", "override-record"],
  "needs-fix": ["waive", "withdraw", "correct", "override-record"],
  repairing: ["waive", "withdraw", "correct", "override-record"],
  verified: ["waive", "withdraw", "correct", "override-record"],
  "final-review": ["waive", "withdraw", "correct", "override-record"],
  // A correction changes no phase; a closed order's recorded pass may still
  // need its product gate bound before publication (WO-115 D026).
  closed: ["correct"],
  withdrawn: [],
};
const matrix = (id = "WO-099") => {
  const { phase, legalOffRamps } = status(id);
  assert.deepEqual(legalOffRamps, legalIn[phase], phase);
  for (const route of ["waive", "withdraw", "correct", "override-record"])
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
const report = (path, lines) => {
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
      "",
    ].join("\n"),
  );
};
const hash = (path) =>
  createHash("sha256")
    .update(readFileSync(join(root, path)))
    .digest("hex");

// Active: withdraw, correct and override-record are legal; waive is not.
pass(["activate", "WO-099", authority]);
let state = status();
assert.deepEqual(state.legalOffRamps, [
  "withdraw",
  "correct",
  "override-record",
]);
for (const key of ["waivedCriteria", "corrections", "overrideRecords"])
  assert.deepEqual(state[key], []);
assert.equal(state.withdrawal, null);
refuse(
  /waive is not legal in phase active; it is legal in verifying, needs-fix, repairing, verified, final-review\. Legal off-ramps here: withdraw, correct, override-record; run: npm run resume -- next/,
  ["waive", "2", "--reason", "accepted", ...waiverCapture, ...operator],
);
assert.match(
  current(),
  /- Legal off-ramps: withdraw, correct, override-record/,
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

// WO-173: the executor judges every declared criterion on one line of its
// handoff ledger before either completion. An absent ledger, a missing
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
  "`**Criterion <id>:** met`, `**Criterion <id>:** unmet` or `**Criterion <id>:** unmet, waived by <ordinal>`";
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
ledger([
  "**Criterion 1:** met. The fixture holds.",
  "**Criterion 2:** unmet. WO-099-D001: the fixture leaves criterion 2 to the operator.",
]);
// Criterion 2 without a waiver: a pass is refused and the verification fails.
const readback = call(completeReadback, readbackEnv);
assert.equal(readback.status, 0, readback.stderr);
assert.match(
  readback.stdout,
  /^WO-099 is ready for verification\. Handoff ledger: 1 met, 1 unmet \(criterion 2\)\.$/m,
);
const readbackOrdinal = events().length;
assert.deepEqual(last().unmetCriteria, ["2"]);
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
// WO-173 criterion 5: the three sentences, pinned, and the unmet disclosure
// with both routes; no briefing grows by more than 400 bytes.
const verifySentence =
  "A finding names its class and the rule a repair must hold; a defect outside the declared criteria is boarded with its reproduction, not failed. A recorded off-ramp whose capture hash matches is judged from the record and never put back to the operator.";
const offRampSentence =
  "A recorded off-ramp whose capture hash matches is judged from the record and never put back to the operator.";
const repairSentence =
  "A repair closes the class the finding names: state the rule the repaired code holds and add a case the report did not quote.";
const ledgerSentence = (id, before) =>
  ` Before ${before}, judge each acceptance criterion on one line of docs/evidence/${id}/handoff.md: \`**Criterion <id>:** met\` with its evidence or \`unmet\` with why; a met criterion naming npm test or npm run test:docs stands on that gate's passing row.`;
const routes = (id) =>
  `\nThe executor recorded criterion 2 unmet in docs/evidence/${id}/handoff.md. A waiver this session records from the operator's capture (npm run resume -- waive 2 --reason <text> --capture <path> --capture-hash sha256:<digest> <actor flags> --work-order ${id}) or an authorized amendment (npm run plan -- amend-order) spares the cycle; without either the criterion is judged as it stands.`;
const bytes = (value) => Buffer.byteLength(value);
for (const [name, growth] of Object.entries({
  next: bytes(ledgerSentence("WO-099", "that command")),
  fix:
    bytes(` ${repairSentence}`) +
    bytes(ledgerSentence("WO-099", "repair-complete")),
  verify: bytes(`\n${verifySentence}`),
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
  /a pass cannot record criterion 2 unmet without a waiver; record fail, or the operator records one with npm run resume -- waive 2/,
  ["verification-result", "pass", ...agentFlags],
);
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
// VER-001 F2: a result records the digest of the report it judged, and a
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
refuse(
  /checkpoint refs\/dotln\/checkpoint\/WO-099\/1 resolves to [0-9a-f]+, not 0{40}/,
  [
    "correct",
    "2",
    "--set",
    "checkpointRef=refs/dotln/checkpoint/WO-099/1",
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
  `checkpointRef=${checkpoint(1).checkpointRef}`,
  "--set",
  `checkpointSha=${checkpoint(1).checkpointSha}`,
  "--reason",
  "the override's recovery point was the activation checkpoint",
  ...operator,
]);
assert.deepEqual(last().previous, {
  checkpointRef: checkpoint(2).checkpointRef,
  checkpointSha: checkpoint(2).checkpointSha,
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
// VER-001 F1: a note's date is a calendar date, not a digit shape.
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

// A closed order takes no off-ramp.
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
// WO-173 criterion 3: the executor records criterion 2 unmet; the verify
// briefing lists it with both routes; the verifier's session records the
// waiver in phase verifying; the report judges the criterion unmet, waived
// by that ordinal, and a passing verification is recorded.
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
  finalBriefing101.includes(`refuse a bare unknown.\n${offRampSentence}\n`),
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
// WO-173 criterion 2: a criterion recorded met that names a gate stands on
// that gate's row. `npm test` and `npm test -- --review` need a passing
// complete row at the current code identity, the review form one whose
// required suites cover the review selection the runner lists (an untracked
// script a suite declares selects it); `npm run test:docs` runs inline, last,
// and a failure refuses with the failing tasks. The same criteria recorded
// unmet record with no row and a failing document gate, and a gate that
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
const claimRow = (evidenceRef, extra = {}) => ({
  ...gateRow(evidenceRef, gateCodeIdentity(root)),
  requiredSuites: ["build", "alpha"],
  ...extra,
});
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
  `^error: criteria 2, 3 recorded met names npm test -- --review, and no passing complete npm test row exists at the current code identity ${identity}\\. Run npm test -- --review, or ${instead}`,
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
refuseOn(
  "WO-102",
  new RegExp(
    `^error: criterion 3 recorded met names npm test -- --review, and no passing complete npm test row at the current code identity ${identity} covers the current review selection: the latest row \\(recorded [^,]+, 0\\.00 s, 2 suites, host-gate:plain:npm test\\) lacks stub-machinery\\. Run npm test -- --review, or ${instead}`,
    "m",
  ),
  completeAgent,
);
recordGateChecks(root, [
  claimRow("host-gate:review:npm test", {
    requiredSuites: ["build", "alpha", "stub-machinery"],
  }),
]);
// The document gate runs last, inline; a failure refuses with the failing tasks.
stubDocumentGate(1, [
  "PASS format 0.10 s",
  "FAIL docs-check 0.20 s",
  "  [docs-check] product ceiling exceeded",
  "npm run test:docs: 1 passed; 1 failed; 0.30 s; 2 fresh tasks",
]);
const failedGate = refuseOn(
  "WO-102",
  /^error: criterion 1 recorded met names npm run test:docs, and the document gate failed after [\d.]+ s \(exit 1\):\n {2}FAIL docs-check 0\.20 s\n {2}npm run test:docs: 1 passed; 1 failed; 0\.30 s; 2 fresh tasks\nRepair and complete again, or record the criterion unmet with the reason instead/m,
  completeAgent,
);
assert.doesNotMatch(failedGate, /PASS format/);
stubDocumentGate(0, [
  "PASS format 0.10 s",
  "npm run test:docs: 2 passed; 0 failed; 0.30 s; 2 fresh tasks",
]);
const recordedGates = call([...completeAgent, "--work-order", "WO-102"]);
assert.equal(recordedGates.status, 0, recordedGates.stderr);
assert.match(
  recordedGates.stdout,
  /^Running npm run test:docs, which criterion 1 recorded met names; the completion runs it once, after every other check\.\nnpm run test:docs: 2 passed; 0 failed; 0\.30 s; 2 fresh tasks\n/m,
);
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
  gateEvent.evidence.documentGate,
  undefined,
  "the stub records no document row",
);
assert.deepEqual(status("WO-102").unmetCriteria, []);
assert.doesNotMatch(on("WO-102")(["verify"]), /The executor recorded/);
// The same criteria recorded unmet record at a code identity that holds no
// row, without a runner and while the document stub would fail.
stubDocumentGate(1, ["FAIL docs-check 0.20 s"]);
rmSync(stubRunner);
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
on("WO-103")(["verification-result", "pass", ...agentFlags]);
const finalBriefing103 = on("WO-103")(["final-review"]);
assert.ok(
  finalBriefing103.includes(
    `${offRampSentence}\nThe executor recorded criteria 1, 2, 3 unmet in docs/evidence/WO-103/handoff.md. A waiver this session records from the operator's capture (npm run resume -- waive <criterion> --reason <text> --capture <path> --capture-hash sha256:<digest> <actor flags> --work-order WO-103) or an authorized amendment (npm run plan -- amend-order) spares the cycle; without either the criterion is judged as it stands.\n`,
  ),
  finalBriefing103,
);
writeFileSync(join(root, ".gitignore"), ignoreBytes102);
assert.equal(gateCodeIdentity(root), identity);
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
  /^Advisory: Review selection unavailable \(scripts\/test-runner\.mjs is absent\); the npm test -- --review claim of criterion 3 stands on the plain npm test row \(recorded [^,]+, 0\.00 s, 3 suites, host-gate:review:npm test\)\.$/m,
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
  "host-gate:review:npm test",
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
        `Advisory: Gate index unavailable: ${causes[kind]}; the git diff --check row is not recorded.`,
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
