import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { readHandoffLedger } from "./lib/handoff-ledger.mjs";
import { verificationKnownIssues } from "./lib/verification-briefing.mjs";
import { failureRecord } from "./lib/plan-failures.mjs";
import { fold } from "./lib/control.mjs";
import { runGit } from "./lib/git.mjs";
import { executorEntryBriefing } from "./lib/executor-readiness.mjs";

const actor = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const state = {
  workOrderId: "WO-999",
  workOrderPath: "docs/work-orders/WO-999-fixture.md",
};
const activation = {
  type: "WorkOrderActivated",
  ...state,
  recordedAt: "2030-01-01T00:00:00.000Z",
};
const gate = {
  checkId: "npm test",
  executed: true,
  exitCode: 0,
  codeIdentity: "0".repeat(64),
  treeHash: "0".repeat(40),
  durationMs: 1,
  evidenceRef: "host-gate:fixture:npm test",
  recordedAt: "2030-01-01T00:00:00.000Z",
};
const correction = (ordinal) => ({
  ...activation,
  type: "RecordCorrected",
  subject: { ordinal, type: "FinalReviewCompleted" },
  fields: { productGate: gate.evidenceRef },
  previous: { productGate: "none" },
  evidence: { productGate: gate },
  reason: "Bind the recorded review",
  actor,
});
const write = (root, name, value) => {
  mkdirSync(dirname(join(root, name)), { recursive: true });
  writeFileSync(join(root, name), value);
};
const fixture = (t) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-retained-records-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(
    root,
    state.workOrderPath,
    "# Fixture\n\n**Acceptance criteria**\n\n1. Read the evidence.\n",
  );
  return root;
};

test("a declared economy trial discloses its installed support without adding work to ordinary dispatches", (t) => {
  const root = fixture(t);
  write(
    root,
    ".claude/harness-manifest.json",
    JSON.stringify({ origin: { ids: ["tinkerer-economy"] } }),
  );
  assert.match(
    executorEntryBriefing(root, "WO-999", { experiment: true }),
    /Tinkerer — Economy is equipped/,
  );
  assert.doesNotMatch(executorEntryBriefing(root, "WO-999"), /Tinkerer/);
  write(
    root,
    ".claude/harness-manifest.json",
    JSON.stringify({ origin: { ids: [] } }),
  );
  assert.doesNotMatch(
    executorEntryBriefing(root, "WO-999", { experiment: true }),
    /Tinkerer/,
  );
});

test("self-review counts tolerate presentation wrappers without accepting quotations or incomplete counts", (t) => {
  const root = fixture(t);
  for (const [line, valid] of [
    ["self-review: **found 2**; fixed 1; recorded 1", true],
    ["self-review: _found_ 2; fixed **1**; recorded 1", true],
    ["- `self-review:` found 2; fixed 1; recorded 1", true],
    ["Self-review (dotln-worker): found 2; fixed 1; recorded 1", true],
    ["> self-review: found 2; fixed 1; recorded 1", false],
    ["self-review: found 2; fixed 1", false],
    ["self-review: found two; fixed 1; recorded 1", false],
  ]) {
    write(
      root,
      "docs/evidence/WO-999/handoff.md",
      `**Criterion 1:** met. Read.\n${line}\n`,
    );
    assert.equal(
      readHandoffLedger(root, state).advisories.some((value) =>
        value.includes("lacks a self-review"),
      ),
      !valid,
      line,
    );
  }
});

test("latest malformed planning findings advise without resurrecting earlier issues and missing ids use the filename", (t) => {
  const root = fixture(t);
  const receipt = (ordinal, findings, receiptId) => ({
    schemaVersion: "plan-refutation-receipt-v1",
    ordinal,
    ...(receiptId ? { receiptId } : {}),
    pass: { kind: "planning" },
    result: {
      orders: [
        {
          workOrderId: "WO-999",
          ...(findings === undefined ? {} : { findings }),
        },
      ],
    },
  });
  const old = "2030-01-01-planning-fixture-001";
  const latest = "2030-01-01-planning-fixture-002";
  const issue = {
    kind: "known-issue",
    criterionId: "criterion:1",
    reason: "older sentinel",
    reopenWhen: "new observation",
  };
  write(
    root,
    `docs/planning/refutations/${old}.json`,
    JSON.stringify(receipt(1, [issue], old)),
  );
  for (const findings of [undefined, null, {}]) {
    write(
      root,
      `docs/planning/refutations/${latest}.json`,
      JSON.stringify(receipt(2, findings, latest)),
    );
    const text = verificationKnownIssues(root, state);
    assert.match(text, /Planning known issues unavailable:.*findings/);
    assert.doesNotMatch(text, /older sentinel/);
  }
  write(
    root,
    `docs/planning/refutations/${latest}.json`,
    JSON.stringify(receipt(2, [], latest)),
  );
  assert.doesNotMatch(
    verificationKnownIssues(root, state),
    /unavailable|older sentinel/,
  );
  assert.match(
    verificationKnownIssues(root, state),
    /known issues for WO-999: none\./,
  );
  write(
    root,
    `docs/planning/refutations/${latest}.json`,
    JSON.stringify(receipt(2, [issue])),
  );
  assert.match(
    verificationKnownIssues(root, state),
    new RegExp(`Planning receipt ${latest} known issues`),
  );
  assert.doesNotMatch(
    verificationKnownIssues(root, state),
    /receipt undefined/,
  );
});

test("passing integration and new-scope review counts are not failure items", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q"], { exec: true });
  excludeFixtureOwnership(root);
  assert.equal(runGit(root, ["rev-parse", "--show-toplevel"]), root);
  runGit(
    root,
    [
      "-c",
      "user.name=fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--allow-empty",
      "-qm",
      "fixture",
    ],
    { exec: true },
  );
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    [
      activation,
      {
        ...activation,
        type: "FinalReviewCompleted",
        verdict: "pass",
        finalReviewId: "FINAL-001",
        findingCounts: {
          escape: 0,
          integration: 2,
          "new-scope": 3,
          unclassed: 0,
        },
        actor,
      },
    ]
      .map((row) => JSON.stringify({ schemaVersion: 1, ...row }))
      .join("\n") + "\n",
  );
  assert.equal(
    failureRecord(root).items.filter((row) => row.kind === "review-findings")
      .length,
    0,
  );
});

test("a product gate correction binds only the actual passing final review once", () => {
  assert.throws(() => fold([activation, correction(1)]), /productGate subject/);
  const review = {
    ...activation,
    type: "FinalReviewCompleted",
    finalReviewId: "FINAL-001",
    reportPath: "docs/final-reviews/WO-999/FINAL-001.md",
    verdict: "fail",
    actor,
  };
  assert.throws(
    () => fold([activation, review, correction(2)]),
    /productGate subject/,
  );
  const passed = { ...review, verdict: "pass" };
  assert.doesNotThrow(() => fold([activation, passed, correction(2)]));
  assert.throws(
    () => fold([activation, passed, correction(2), correction(2)]),
    /productGate.*already/,
  );
  assert.throws(
    () =>
      fold([
        activation,
        { ...passed, evidence: { productGate: gate } },
        correction(2),
      ]),
    /productGate.*already/,
  );
});
