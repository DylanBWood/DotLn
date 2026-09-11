import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  realpathSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  appendEvent,
  decodeLog,
  replay,
  type AuthorityEnvelope,
  type EventDraft,
} from "@dotln/kernel";
import { compileFeedbackAudit, compileFeedbackUnits } from "@dotln/compiler";
import {
  personalFeedback,
  retainedFeedbackUnitsV1,
} from "../src/loadouts/feedback.js";
import { runFeedbackSelfhost } from "../src/feedback-selfhost.js";
import { FakeVerificationTransport } from "../src/verification-fake.js";
import {
  canonicalWorkerArgs,
  ClaudeCliPrintWorkOrderTransport,
} from "../src/worker-transport.js";
import { FEEDBACK_VERIFIER_LIMITS } from "../src/verification-protocol.js";
import {
  feedbackStateFromRuntime,
  initialState,
  seiriReactor,
} from "../src/reactor.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url)).replace(
  /\/$/u,
  "",
);
test("WO-011 bounded Claude patch observation retains the prior version and refuses an unknown one", () => {
  assert.equal(
    new ClaudeCliPrintWorkOrderTransport(undefined, "2.1.261").harnessVersion,
    "2.1.261",
  );
  assert.equal(
    new ClaudeCliPrintWorkOrderTransport(undefined, "2.1.263").harnessVersion,
    "2.1.263",
  );
  assert.throws(
    () => new ClaudeCliPrintWorkOrderTransport(undefined, "99.0.0"),
    /profile-refused/,
  );
});
test("WO-011 selfhost executes the real repository audit, recovers its saved result, and independently verifies once", async () => {
  const directory = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-feedback-selfhost-")),
  );
  let at = 1000000,
    calls = 0;
  const transport = new FakeVerificationTransport();
  const dispatch = transport.dispatch.bind(transport);
  transport.dispatch = (request, now) => {
    calls++;
    assert.equal("kind" in request && request.kind, "evidence-worker");
    assert.ok("feedback" in request && request.feedback);
    assert.deepEqual(
      readdirSync(request.cwd),
      [".git"],
      "verifier has no ambient repository context",
    );
    const args = canonicalWorkerArgs(
      "claude-cli-print",
      { ...request, model: "claude-sonnet-5", effort: "max" },
      "unused",
    );
    assert.deepEqual(
      JSON.parse(args[args.indexOf("--settings") + 1]!).attribution,
      { commit: "", pr: "", sessionUrl: false },
    );
    assert.equal(args[args.indexOf("--max-budget-usd") + 1], "3.00");
    let timeout = 0;
    const refused = new ClaudeCliPrintWorkOrderTransport((launch) => {
      timeout = launch.timeoutMs;
      throw new Error("fixture stops before a process launch");
    }, "2.1.263");
    assert.throws(
      () =>
        refused.dispatch(
          { ...request, model: "claude-sonnet-5", effort: "max" },
          now,
        ),
      /fixture stops/,
    );
    assert.equal(timeout, FEEDBACK_VERIFIER_LIMITS.timeoutMs);
    return dispatch(request, now);
  };
  const options = {
    root,
    directory,
    transport,
    model: "synthetic",
    effort: "unknown" as const,
    now: () => at++,
  };
  try {
    await assert.rejects(
      runFeedbackSelfhost({
        ...options,
        afterAuditSaved: () => {
          throw new Error("simulated host interruption");
        },
      }),
      /simulated host interruption/,
    );
    assert.equal(calls, 0);
    const auditBefore = readFileSync(
      join(directory, "audit/events.jsonl"),
      "utf8",
    );
    const result = await runFeedbackSelfhost(options);
    assert.equal(result.complete, true);
    assert.equal(calls, 1);
    assert.equal(
      result.auditLog,
      auditBefore,
      "recovery must not execute the completed audit again",
    );
    assert.equal(result.report.fixtures.length, 10);
    assert.ok(
      result.report.fixtures.every(
        (fixture) =>
          fixture.present.exitCode === 0 &&
          fixture.removed.exitCode === 1 &&
          fixture.removed.failed === 1,
      ),
    );
    assert.equal(result.report.context.commonBaseline.bytes, 3530);
    assert.equal(
      result.report.context.beforeBytes - result.report.context.afterBytes,
      result.report.context.savedBytes,
    );
    assert.ok(result.report.context.savedBytes > 0);
    assert.ok(result.matrix.rows.every((row) => row.status === "verified"));
    const events = decodeLog(result.verificationLog);
    assert.deepEqual(
      (
        events.find((event) => event.type === "WorkerAttemptStarted")!
          .payload as { limits: unknown }
      ).limits,
      FEEDBACK_VERIFIER_LIMITS,
    );
    const opening = events.find((event) => event.type === "VerificationOpened")!
      .payload as { baseline: { evidence: { outcome: string }[] } };
    assert.ok(
      opening.baseline.evidence.every((item) => item.outcome === "unavailable"),
    );
    const cached = await runFeedbackSelfhost(options);
    assert.equal(cached.verificationLog, result.verificationLog);
    assert.equal(calls, 1);
  } finally {
    rmSync(directory, { recursive: true });
  }
});

test("WO-011 shared reactor dispatches a pinned audit, refuses expiry, and makes semantic correction a durable diagnosis request", () => {
  const program = compileFeedbackUnits(retainedFeedbackUnitsV1);
  const workOrder = compileFeedbackAudit(
    program,
    "fixture",
    "a".repeat(40),
    "source-1",
  );
  const authority: AuthorityEnvelope = {
    authorityEnvelopeId: "fixture-authority",
    allowedEffects: ["feedback.audit", "repo.delete"],
    deniedEffects: [],
    resourceLimits: { audits: 1 },
    requiredEvidence: ["feedback-policy", "pinned-source"],
    expiresAt: 10,
    revocationEventTypes: [],
  };
  let state = initialState(),
    log = "";
  const decisions: ReturnType<typeof seiriReactor>[] = [];
  const feed = (
    type: string,
    at: number,
    payload: unknown,
    actorId = "feedback-host",
  ) => {
    const draft = {
      schemaVersion: 1,
      type,
      occurredAt: at,
      actorId,
      workstreamId: "test_feedback",
      payload,
    } as EventDraft;
    const appended = appendEvent(log, draft);
    const decision = seiriReactor(state, appended.event, {
      now: at,
      rngState: 17,
      predicates: {},
    });
    log = appended.log;
    state = decision.state;
    decisions.push(decision);
    return decision;
  };
  feed("FeedbackAuditOpened", 0, {
    program,
    workOrder,
    authority,
    subject: "source-1",
  });
  const requested = feed("FeedbackAuditRequested", 1, {});
  assert.equal(requested.intents[0]?.kind, "Act");
  const pending = feedbackStateFromRuntime(state).pending!;
  feed("CommandPersisted", 2, { command: pending });
  assert.equal(
    feed("FeedbackAuditExecutionRequested", 3, {}).trace.branchPath.at(-1),
    "feedback-execution-ready",
  );
  assert.equal(
    feed("FeedbackAuditExecutionRequested", 11, {}).trace.branchPath.at(-1),
    "feedback-execution-refused",
  );
  const before = feedbackStateFromRuntime(state).policy;
  feed(
    "OperatorCorrectionReceived",
    12,
    { message: "ordinary content" },
    "worker",
  );
  assert.deepEqual(feedbackStateFromRuntime(state).policy, before);
  feed("OrdinaryMessage", 13, { message: "profanity alone" }, "operator");
  assert.deepEqual(feedbackStateFromRuntime(state).policy, before);
  const correction = feed("OperatorReportsRegression", 14, {}, "operator");
  assert.equal(correction.continuation?.kind, "Emit");
  assert.deepEqual(feedbackStateFromRuntime(state).policy.allowedEffects, [
    "feedback.audit",
  ]);
  assert.equal(
    feed("FeedbackAuditExecutionRequested", 15, {}).trace.branchPath.at(-1),
    "feedback-execution-refused",
  );
  const replayed = replay(initialState(), decodeLog(log), seiriReactor, {});
  assert.deepEqual(replayed.state, state);
  assert.deepEqual(replayed.decisions, decisions);
});
