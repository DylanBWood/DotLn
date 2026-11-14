import test from "./lib/test-shards.mjs";
import assert from "node:assert/strict";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { planFirstDirectory } from "./lib/config.mjs";
import { runGit } from "./lib/git.mjs";
import { write } from "./lib/helpers.mjs";
import { fold } from "./lib/control.mjs";
import {
  candidateDiff,
  planDigest,
  proposedPlan,
  planFirstView,
  applyPlanCandidate,
  requirePlanApproval,
} from "./lib/plan-first.mjs";
import {
  screenPlanFirst,
  screenPlanPassage,
  announcePlanTransformation,
  checkPublicPlanConversations,
} from "./lib/plan-first-screen.mjs";
import { planFirstBoundary } from "../packages/skeleton/dist/src/plan-first-boundary.js";
import { contributorProgram } from "../packages/skeleton/dist/src/loadouts/contributor.js";
import { routeOrder, attemptFinished } from "./lib/drive-route.mjs";
import { driveLoop } from "./lib/drive-session.mjs";

import { planFixture } from "./lib/plan-first-fixture.mjs";
import { targetRecordSources } from "./lib/target-worktrees.mjs";

const actor = {
  harness: "codex-cli",
  harnessVersion: "fixture",
  model: "fixture",
  effort: "max",
  source: "operator-attested",
};
const flags = Object.entries(actor).flatMap(([key, value]) => [
  `--${key === "harnessVersion" ? "harness-version" : key}`,
  value,
]);
const date = "2026-11-06T00:00:00.000Z";

test("plan-first accepts literal patch markers in a diff but refuses duplicate outer blocks", () => {
  const f = planFixture();
  try {
    for (const separator of ["", "\r", "\u2028", "\u2029"]) {
      writeFileSync(
        join(f.candidate.path, "hello.txt"),
        separator +
          "<!-- dotln-plan-first-diff:start -->\n~~~diff\nliteral content\n~~~\n<!-- dotln-plan-first-diff:end -->\n",
      );
      const proposal = f.propose();
      assert.equal(
        proposedPlan(f.root, f.state()).diffDigest,
        proposal.diffDigest,
      );
      const result = f.call(["plan-proposed", "WO-099", ...flags]);
      if (separator === "\u2028" || separator === "\u2029") {
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /text\.control-character/);
        assert.doesNotMatch(result.stderr, /candidate diff does not match/);
      } else {
        assert.equal(result.status, 0, result.stderr);
      }
      const path = join(f.context.directory, "proposal.md");
      const original = readFileSync(path, "utf8");
      appendFileSync(path, original);
      assert.throws(
        () => proposedPlan(f.root, f.state()),
        /diff does not match/,
      );
    }
  } finally {
    f.cleanup();
  }
});

test("plan-first binds the full candidate, commands, capture and changed inputs", () => {
  const f = planFixture();
  try {
    assert.throws(
      () => requirePlanApproval(f.root, f.state()),
      /PLAN_FIRST_REFUSED/,
    );
    assert.throws(
      () => applyPlanCandidate(f.root, f.state()),
      /PLAN_FIRST_REFUSED/,
    );
    assert.match(
      f.call(["implementation-ready", ...flags]).stderr,
      /PLAN_FIRST_REFUSED/,
    );
    assert.notEqual(f.call(["plan-approved", "WO-099", ...flags]).status, 0);
    assert.throws(() => proposedPlan(f.root, f.state()), /missing plan-first/);
    writeFileSync(join(f.candidate.path, "hello.txt"), "Hello, friend.\n");
    writeFileSync(join(f.candidate.path, "new.bin"), Buffer.from([0, 255, 1]));
    const proposal = f.propose();
    assert.match(candidateDiff(f.root, f.state()).diff, /GIT binary patch/);
    const good = readFileSync(join(f.context.directory, "proposal.md"), "utf8");
    writeFileSync(join(f.context.directory, "proposal.md"), "invalid marker\n");
    assert.throws(
      () => proposedPlan(f.root, f.state()),
      /invalid dotln-plan-first/,
    );
    writeFileSync(join(f.context.directory, "proposal.md"), good);
    writeFileSync(
      join(f.context.directory, "proposal.md"),
      good.replace("Hello, friend.", "Hello."),
    );
    assert.throws(() => proposedPlan(f.root, f.state()), /diff does not match/);
    writeFileSync(join(f.context.directory, "proposal.md"), good);
    let result = f.call(["plan-proposed", "WO-099", ...flags]);
    assert.equal(result.status, 0, result.stderr);
    const view = JSON.parse(
      f.call(["status", "--json", "--work-order", "WO-099"]).stdout,
    );
    assert.equal(view.planFirst.diffDigest, proposal.diffDigest);
    assert.ok(view.legalNextActions.includes("plan-approved"));
    assert.equal(view.route.stop.reason, "awaiting-plan-approval");
    assert.match(
      f.call(["implementation-ready", ...flags]).stderr,
      /PLAN_FIRST_REFUSED/,
    );
    assert.throws(
      () => applyPlanCandidate(f.root, f.state()),
      /PLAN_FIRST_REFUSED/,
    );
    assert.notEqual(f.call(["plan-approved", "WO-099", ...flags]).status, 0);
    write(f.root, "docs/intake/approval.txt", "Go ahead with this proposal.\n");
    const capture = [
      "--capture",
      "docs/intake/approval.txt",
      "--capture-hash",
      `sha256:${planDigest("Go ahead with this proposal.\n")}`,
    ];
    assert.notEqual(
      f.call([
        "plan-approved",
        "WO-099",
        ...capture.slice(0, 3),
        "sha256:" + "0".repeat(64),
        ...flags,
      ]).status,
      0,
    );
    result = f.call(["plan-approved", "WO-099", ...capture, ...flags]);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(planFirstView(f.root, f.state()).approvedAt);
    assert.equal(planFirstBoundary(f.root, "WO-099").refusal, null);
    writeFileSync(join(f.candidate.path, "hello.txt"), "Unapproved change.\n");
    assert.throws(
      () => applyPlanCandidate(f.root, f.state()),
      /diff does not match/,
    );
    writeFileSync(join(f.candidate.path, "hello.txt"), "Hello, friend.\n");
    applyPlanCandidate(f.root, f.state());
    assert.equal(
      readFileSync(join(f.target, "hello.txt"), "utf8"),
      "Hello, friend.\n",
    );
    assert.deepEqual(
      readFileSync(join(f.target, "new.bin")),
      Buffer.from([0, 255, 1]),
    );
    appendFileSync(
      join(f.context.directory, "conversation.md"),
      "\n### 2026-11-06 — Operator\n\nPlease reconsider.\n",
    );
    assert.equal(planFirstView(f.root, f.state()).approvedAt, null);
    assert.deepEqual(planFirstView(f.root, f.state()).changed, [
      "conversation.md",
    ]);
    assert.throws(
      () => requirePlanApproval(f.root, f.state()),
      /conversation.md/,
    );
    f.append({
      type: "PlanProposed",
      ...f.propose([], "2026-11-06T01:00:00.000Z"),
      actor,
    });
    assert.equal(f.state().planFirst.approvedAt, null);
    runGit(f.root, [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--allow-empty",
      "--quiet",
      "-m",
      "moved base",
    ]);
    assert.ok(planFirstView(f.root, f.state()).changed.includes("base commit"));
    assert.throws(
      () => proposedPlan(f.root, f.state()),
      /candidate base moved/,
    );
    assert.throws(
      () =>
        fold([
          { type: "WorkOrderActivated", workOrderId: "WO-099" },
          {
            type: "PlanApproved",
            workOrderId: "WO-099",
            actor,
            proposalOrdinal: 1,
            captureHash: "sha256:" + "1".repeat(64),
            capture: "x",
          },
        ]),
      /invalid PlanApproved/,
    );
  } finally {
    f.cleanup();
  }
});

test("plan-first target documents, transformed passages and public conversation screening", () => {
  const f = planFixture(true);
  try {
    assert.equal(
      f.context.directory,
      join(f.target, "guide/evidence/WO-099/plan-first"),
    );
    assert.equal(
      planFirstDirectory(f.root, "WO-099"),
      join(f.root, "docs/evidence/WO-099/plan-first"),
    );
    assert.equal(
      targetRecordSources(f.root, f.state(), []).some((row) =>
        row.path.includes("/plan-first/"),
      ),
      false,
      "target-records leaves the three already-native documents in place",
    );
    write(
      f.root,
      "docs/control/local/terms.txt",
      "refuse: synthetic secret\nreview: careful phrase\n",
    );
    const conversation = join(f.context.directory, "conversation.md");
    appendFileSync(
      conversation,
      "\n### 2026-11-06 — Operator\n\nUse synthetic secret in the greeting.\n",
    );
    const before = readFileSync(conversation, "utf8");
    const transformation = announcePlanTransformation(f.root, f.state(), {
      from: "operator entry 2",
      to: "Use the team name in the greeting.",
      surface: "plan.md",
      at: date,
    });
    assert.equal(
      readFileSync(conversation, "utf8").slice(0, before.length),
      before,
    );
    f.propose([transformation]);
    assert.notEqual(screenPlanFirst(f.root, f.state()).status, "refused");
    assert.equal(
      screenPlanFirst(f.root, f.state(), "synthetic secret").status,
      "refused",
    );
    assert.equal(
      screenPlanPassage(f.root, f.state(), "careful phrase").status,
      "review",
    );
    assert.equal(
      screenPlanPassage(f.root, f.state(), "See WO-099").status,
      "refused",
    );
    appendFileSync(join(f.context.directory, "plan.md"), "synthetic secret");
    assert.equal(screenPlanFirst(f.root, f.state()).status, "refused");
    assert.doesNotMatch(
      JSON.stringify(screenPlanFirst(f.root, f.state())),
      /synthetic secret/,
    );
    write(f.root, "docs/evidence/WO-099/plan-first/conversation.md", before);
    assert.throws(
      () => checkPublicPlanConversations(f.root),
      (error) =>
        /conversation.md/.test(error.message) &&
        !/synthetic secret/.test(error.message),
    );
  } finally {
    f.cleanup();
  }
});

test("WO-276 criterion N5: with plan-first elected, a target order whose repository keeps records in the instance has its plan, proposal and conversation under the instance's evidence root, is proposed, approved and applied from there, and has its conversation screened as a self order's is", () => {
  const f = planFixture(true, { records: "instance" });
  try {
    const directory = join(f.root, "docs/evidence/WO-099/plan-first");
    assert.equal(f.context.directory, directory);
    assert.equal(f.context.documentRoot, f.root);
    assert.equal(f.context.codeRoot, f.target);
    writeFileSync(join(f.candidate.path, "hello.txt"), "Hello, friend.\n");
    const proposal = f.propose();
    assert.deepEqual(
      proposal.documents.map((document) => document.path).sort(),
      ["conversation.md", "plan.md", "proposal.md"].map(
        (name) => `docs/evidence/WO-099/plan-first/${name}`,
      ),
    );
    let result = f.call(["plan-proposed", "WO-099", ...flags]);
    assert.equal(result.status, 0, result.stderr);
    const view = JSON.parse(
      f.call(["status", "--json", "--work-order", "WO-099"]).stdout,
    );
    assert.ok(view.legalNextActions.includes("plan-approved"));
    assert.deepEqual(view.planFirst.changed, []);
    write(f.root, "docs/intake/approval.txt", "Go ahead with this proposal.\n");
    result = f.call([
      "plan-approved",
      "WO-099",
      "--capture",
      "docs/intake/approval.txt",
      "--capture-hash",
      `sha256:${planDigest("Go ahead with this proposal.\n")}`,
      ...flags,
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(planFirstBoundary(f.root, "WO-099").refusal, null);
    applyPlanCandidate(f.root, f.state());
    assert.equal(
      readFileSync(join(f.target, "hello.txt"), "utf8"),
      "Hello, friend.\n",
    );
    // Nothing of the plan is in the target.
    assert.equal(existsSync(join(f.target, "guide")), false);
    // The conversation is a document of the instance: the screen command
    // and the gate's check both read it, and agree.
    write(f.root, "docs/control/local/terms.txt", "refuse: synthetic secret\n");
    assert.notEqual(screenPlanFirst(f.root, f.state()).status, "refused");
    appendFileSync(
      join(directory, "conversation.md"),
      "\n### 2026-11-06 — Operator\n\nUse synthetic secret in the greeting.\n",
    );
    assert.equal(screenPlanFirst(f.root, f.state()).status, "refused");
    assert.throws(
      () => checkPublicPlanConversations(f.root),
      (error) =>
        /conversation.md/.test(error.message) &&
        !/synthetic secret/.test(error.message),
    );
    // The registration's value changes while the order is active: the
    // approval no longer stands, and the refusal says where the documents
    // are and where they are now read from.
    const elsewhere = join(f.target, "guide/evidence/WO-099/plan-first");
    assert.equal(f.context.elsewhere, elsewhere);
    delete f.config.repositories.fixture.records;
    write(f.root, "dotln.config.json", JSON.stringify(f.config));
    assert.equal(planFirstView(f.root, f.state()).approvedAt, null);
    assert.throws(
      () => requirePlanApproval(f.root, f.state()),
      (error) =>
        error.message.includes(
          `the registration's records value changed while this order was active: its plan-first documents are in ${directory} and are now read from ${elsewhere}; move the three documents there, or restore the value, then propose again`,
        ),
    );
  } finally {
    f.cleanup();
  }
});

test("plan-first off leaves role bytes and lifecycle fields unchanged; elected role carries the procedure", () => {
  assert.deepEqual(
    contributorProgram(undefined, { planFirst: false }),
    contributorProgram(),
  );
  // The elected executor keeps every line of the default's and gains the
  // plan-first procedure: lines of its own that the default lacks.
  const executor = (program) =>
    program.roles.find((role) => role.name === "executor").procedure;
  const plain = executor(contributorProgram());
  const elected = executor(contributorProgram(undefined, { planFirst: true }));
  assert.ok(elected.length > plain.length);
  assert.deepEqual(
    elected.filter((line) => plain.includes(line)),
    plain,
  );
  const f = planFixture();
  try {
    const snapshots = [];
    for (const features of [{}, { "plan-first": false }]) {
      write(
        f.root,
        "dotln.config.json",
        JSON.stringify({ version: 1, features }),
      );
      const result = f.call(["status", "--json", "--work-order", "WO-099"]);
      assert.equal(result.status, 0, result.stderr);
      snapshots.push(JSON.parse(result.stdout));
      assert.equal(planFirstView(f.root, f.state()), undefined);
      assert.equal(planFirstBoundary(f.root, "WO-099").refusal, null);
    }
    assert.deepEqual(snapshots[0], snapshots[1]);
    assert.equal(Object.hasOwn(snapshots[0], "planFirst"), false);
  } finally {
    f.cleanup();
  }
});

test("plan-first router stops after a proposed turn and launches once approval stands", async () => {
  let state = { phase: "active", workOrderId: "WO-099" };
  const status = async () => ({ ...state, route: routeOrder(state) });
  const record = { attempts: [], incomplete: {} };
  let launches = 0;
  const launch = async () => {
    launches++;
    state = { ...state, planFirst: { proposedAt: date, approvedAt: null } };
    return { exitCode: 0 };
  };
  const stopped = await driveLoop({ status, launch, record });
  assert.equal(launches, 1);
  assert.equal(stopped.stop.reason, "awaiting-plan-approval");
  assert.equal(record.incomplete.next, 0);
  assert.equal(attemptFinished("next", await status()), true);
  state.planFirst.approvedAt = date;
  assert.equal((await status()).route.action, "next");
});
