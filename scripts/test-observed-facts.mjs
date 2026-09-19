import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  appendFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import {
  appendObservation,
  journalRows,
  observedFacts,
  renderObservedFacts,
  scanHedges,
  scanMessage,
  observationBoundary,
  correctionCounts,
  observeTypedCorrection,
  observeBackgroundTool,
} from "../packages/skeleton/dist/src/observed-facts.js";
import { trapRows } from "./lib/meta.mjs";
import { observedFactsReport } from "./lib/harness-runtime.mjs";

const key = createHash("sha256").update("fixture-session").digest("hex");
const scope = {
  sessionKey: key,
  workOrder: "WO-999",
  phase: "implementation",
  startedAt: "2026-09-17T14:00:00.000Z",
};
const now = "2026-09-17T14:32:00.000Z";
const dispatch = "2026-09-17T14:06:00.000Z";
const write = (root, path, content) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};
const fixture = (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-facts-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
};
const task = (root, id = "a") =>
  appendObservation(
    root,
    scope,
    {
      backgroundTask: {
        key: id,
        dispatchedAt: dispatch,
        state: "running",
        observedAt: dispatch,
      },
    },
    dispatch,
  );
const hedges = (root) =>
  journalRows(root, scope).filter(
    (row) => row.typedEvent === "HedgedQuantityObserved",
  );

test("observed facts show fixture clock, every task/gate, counters, provenance and missing causes", (t) => {
  const root = fixture(t);
  task(root);
  task(root, "b");
  write(
    root,
    "docs/control/local/harness/checks.json",
    JSON.stringify([
      {
        checkId: "npm test",
        durationMs: 1200,
        recordedAt: now,
        workOrder: "WO-999",
      },
      {
        checkId: "suite:fixture",
        durationMs: 125,
        recordedAt: now,
        workOrder: "WO-999",
      },
      {
        checkId: "other",
        durationMs: 999,
        recordedAt: now,
        workOrder: "WO-998",
      },
    ]),
  );
  write(
    root,
    "docs/control/local/process/usage.jsonl",
    JSON.stringify({
      sessionKey: key,
      workOrder: scope.workOrder,
      startedAt: scope.startedAt,
      observation: {
        source: "fixture-counter",
        scope: "dispatch",
        observedAt: now,
        usage: { inputTokens: 15, totalTokens: 20 },
      },
    }) + "\n",
  );
  const text = renderObservedFacts(observedFacts(root, scope, now));
  for (const value of [
    now,
    dispatch,
    "1560000 ms",
    "task 1",
    "task 2",
    "1200 ms",
    "125 ms",
    "totalTokens 20",
    "fixture-counter",
    "outputTokens unknown (counter-unavailable)",
  ])
    assert.ok(text.includes(value), value);
  assert.doesNotMatch(text, /Gate other/);
});

test("lexical scanner excludes quotes/code and leaves factual or unknown quantities alone", (t) => {
  const root = fixture(t);
  task(root);
  const facts = observedFacts(root, scope, now);
  for (const text of [
    "The review was dispatched 26 minutes ago.",
    "The elapsed time is unknown.",
    "> roughly 10 minutes ago",
    '"roughly 10 minutes ago"',
    "'roughly 10 minutes ago'",
    "“roughly 10 minutes ago”",
    "```text\nroughly 10 minutes ago\n```",
    "~~~\nroughly 10 minutes ago\n~~~",
    "`roughly 10 minutes ago`",
    "I think this works. 10 tests passed.",
  ])
    assert.deepEqual(scanHedges(text, facts), [], text);
  for (const marker of [
    "roughly",
    "about",
    "approximately",
    "around",
    "probably",
    "I think",
    "should be",
    "~",
  ])
    assert.equal(
      scanHedges(`It was dispatched ${marker} 10 minutes ago`, facts)[0]
        .observed,
      `1560000 ms since ${dispatch}`,
    );
  assert.equal(scanHedges("roughly ten minutes ago", facts).length, 1);
  assert.equal(scanHedges("It is around 14:32", facts).length, 1);
  assert.equal(
    scanHedges("The review took about 3 minutes", facts)[0].observed,
    "unmeasured",
  );
});

test("no measurement and ambiguous measurements stay unmeasured", (t) => {
  const root = fixture(t);
  assert.equal(
    scanHedges("roughly 10 minutes ago", observedFacts(root, scope, now))[0]
      .observed,
    "unmeasured",
  );
  task(root);
  task(root, "b");
  const facts = observedFacts(root, scope, now);
  assert.equal(
    scanHedges("roughly 10 minutes ago", facts)[0].observed,
    "unmeasured",
  );
  assert.equal(
    scanHedges("task 2 was dispatched roughly 10 minutes ago", facts)[0].source,
    "session-task-dispatch",
  );
});

test("Stop journals once, emits facts without blocking, delivers the correction at the next boundary once", (t) => {
  const root = fixture(t);
  task(root);
  const transcriptPath = join(root, "fixture-session.jsonl");
  const final = (id) =>
    JSON.stringify({
      type: "assistant",
      uuid: id,
      timestamp: now,
      message: {
        role: "assistant",
        content: [
          {
            type: "text",
            text: "I dispatched the background review roughly 10 minutes ago.",
          },
        ],
      },
    }) + "\n";
  writeFileSync(
    transcriptPath,
    JSON.stringify({ sessionId: "fixture-session", cwd: root }) +
      "\n" +
      final("first"),
  );
  const first = observationBoundary(root, scope, {
    stop: true,
    transcriptPath,
    now,
  });
  assert.match(first, /Observed facts/);
  assert.doesNotMatch(first, /DotLn measurement advisory|decision.*block/);
  assert.equal(hedges(root).length, 1);
  assert.equal(hedges(root)[0].observed, `1560000 ms since ${dispatch}`);
  observationBoundary(root, scope, { stop: true, transcriptPath, now });
  observationBoundary(root, scope, {
    stop: true,
    transcriptPath,
    now,
    reentry: true,
  });
  assert.equal(hedges(root).length, 1);
  assert.match(
    observationBoundary(root, scope, { now }),
    /measurement advisory.*1560000/,
  );
  assert.doesNotMatch(
    observationBoundary(root, scope, { now }),
    /measurement advisory/,
  );
  appendFileSync(transcriptPath, final("second"));
  observationBoundary(root, scope, { stop: true, transcriptPath, now });
  assert.equal(hedges(root).length, 2);
});

test("missing/malformed transcripts remain nonblocking; later valid final message is scanned", (t) => {
  const root = fixture(t);
  const transcriptPath = join(root, "fixture-session.jsonl");
  assert.match(
    observationBoundary(root, scope, { stop: true, transcriptPath, now }),
    /session-transcript-unavailable/,
  );
  writeFileSync(
    transcriptPath,
    JSON.stringify({ sessionId: "fixture-session", cwd: root }) +
      "\ninvalid\n" +
      JSON.stringify({
        type: "assistant",
        message: {
          role: "assistant",
          content: [{ type: "text", text: "about 10 minutes ago" }],
        },
      }) +
      "\n{partial",
  );
  observationBoundary(root, scope, { stop: true, transcriptPath, now });
  assert.equal(hedges(root).length, 1);
  assert.equal(hedges(root)[0].observed, "unmeasured");
});

test("two typed corrections plus one hedge count 3, with phase/unit attribution and session IDs", (t) => {
  const root = fixture(t);
  observeTypedCorrection(root, scope, "correction: anti-oscillation");
  observeTypedCorrection(
    root,
    { ...scope, phase: "verification" },
    "correction: accuracy over sycophancy and malicious compliance",
  );
  scanMessage(root, scope, "Never guess: roughly 10 minutes ago", "final", now);
  const count = correctionCounts(journalRows(root, scope));
  assert.equal(count.total, 3);
  assert.deepEqual(count.byPhase, { implementation: 2, verification: 1 });
  assert.deepEqual(count.byUnit, {
    "anti-oscillation": 1,
    "correctness-over-sycophancy": 1,
    "fail-conservative-correction": 1,
    "never-guess": 1,
  });
  assert.equal(
    count.byPhaseAndUnit.verification["correctness-over-sycophancy"],
    1,
  );
  const trap = trapRows([
    {
      workOrder: "WO-999",
      metrics: { operatorCorrections: count.total },
      corrections: count,
    },
  ]).find((row) => row.id === "shifting-the-burden-to-the-intervenor");
  assert.equal(trap.corrections[0].total, 3);
  assert.equal(
    correctionCounts([
      {
        journal: "a",
        typedEvent: "OperatorCorrectionReceived",
        correction: { corrections: [{ eventId: "correction:0" }] },
      },
      {
        journal: "a",
        typedEvent: "OperatorCorrectionReceived",
        correction: {
          corrections: [
            { eventId: "correction:0" },
            { eventId: "correction:1" },
          ],
        },
      },
      {
        journal: "b",
        typedEvent: "OperatorCorrectionReceived",
        eventId: "correction:0",
      },
    ]).total,
    3,
  );
});

test("background metadata keeps only identifiers hashed and explicit last-observed states", () => {
  const observation = observeBackgroundTool(
    "Agent",
    { run_in_background: true, prompt: "private" },
    { agent_id: "synthetic", status: "running" },
    dispatch,
  );
  assert.equal(observation.backgroundTask.dispatchedAt, dispatch);
  assert.doesNotMatch(JSON.stringify(observation), /private|synthetic/);
  assert.equal(observeBackgroundTool("Agent", {}, {}, dispatch), null);
  assert.equal(
    observeBackgroundTool("TaskOutput", { task_id: "synthetic" }, {}, now)
      .backgroundTask.state,
    "unknown",
  );
  assert.equal(
    observeBackgroundTool(
      "TaskStop",
      { task_id: "synthetic" },
      { is_error: true },
      now,
    ).backgroundTask.state,
    "unknown",
  );
});

test("scanner does not substitute another quantity or stale usage", (t) => {
  const root = fixture(t);
  task(root);
  write(
    root,
    "docs/control/local/process/usage.jsonl",
    JSON.stringify({
      sessionKey: key,
      workOrder: scope.workOrder,
      startedAt: scope.startedAt,
      observation: {
        source: "fixture",
        usage: {
          totalTokens: 100,
          inputTokens: 80,
          outputTokens: 20,
          cachedInputTokens: 10,
          reasoningOutputTokens: 5,
          costUsd: 0.15,
        },
      },
    }) + "\n",
  );
  const facts = observedFacts(root, scope, now);
  facts.gates.push({ checkId: "npm test", durationMs: 99, recordedAt: now });
  for (const phrase of [
    "I fixed the file roughly 10 minutes ago",
    "Around 10 minutes ago I fixed the file",
    "The npm test gate ran roughly 3 seconds ago",
    "The review ended about 3 minutes ago",
    "The task failed around 10 minutes ago",
    "The npm test gate budget is roughly 3 seconds",
    "The npm test gate needed roughly 3 retries",
    "The coffee cost about 3 dollars",
  ])
    assert.equal(scanHedges(phrase, facts)[0].observed, "unmeasured", phrase);
  assert.equal(
    scanHedges("The npm test gate took 99 ms, probably.", facts)[0].observed,
    "99 ms",
  );
  assert.equal(
    scanHedges("The dispatch cost about 3 dollars", facts)[0].observed,
    "0.15 USD",
  );
  assert.equal(
    scanHedges("The current time is around 14:32", facts)[0].observed,
    now,
  );
  assert.equal(
    scanHedges("The task was dispatched around 14:06", facts)[0].observed,
    dispatch,
  );
  assert.equal(
    scanHedges("roughly 10 cached input tokens", facts)[0].observed,
    10,
  );
  assert.equal(
    scanHedges("roughly 5 reasoning output tokens", facts)[0].observed,
    5,
  );
  assert.deepEqual(
    scanHedges("roughly 10 minutes ago, approximately 200 tokens", facts).map(
      (row) => row.observed,
    ),
    [`1560000 ms since ${dispatch}`, 100],
  );
  assert.equal(
    observedFacts(root, { ...scope, startedAt: now }, now).usage,
    null,
  );
});

test("Codex lifecycle boundary observes its current transcript and handoff, including typed corrections", async (t) => {
  const root = fixture(t);
  const id = "00000000-0000-0000-0000-000000000141";
  const prior = {
    CODEX_THREAD_ID: process.env.CODEX_THREAD_ID,
    CODEX_HOME: process.env.CODEX_HOME,
  };
  process.env.CODEX_THREAD_ID = id;
  process.env.CODEX_HOME = join(root, "codex");
  t.after(() => {
    for (const [key, value] of Object.entries(prior)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  const sessionKey = createHash("sha256").update(id).digest("hex");
  write(
    root,
    `docs/control/local/harness/${sessionKey}.json`,
    JSON.stringify({
      role: "executor",
      workOrder: "WO-999",
      usageSessionKey: sessionKey,
      startedAt: scope.startedAt,
    }),
  );
  const row = (payload) => ({ type: "response_item", timestamp: now, payload });
  const transcript = [
    {
      type: "session_meta",
      timestamp: scope.startedAt,
      payload: { id, cwd: root },
    },
    row({
      type: "function_call",
      call_id: "launch",
      name: "spawn_agent",
      arguments: '{"task_name":"review"}',
    }),
    row({
      type: "function_call_output",
      call_id: "launch",
      output: '{"agent_id":"synthetic","status":"running"}',
    }),
    row({
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: "correction: anti-oscillation" }],
    }),
    row({
      type: "message",
      role: "assistant",
      channel: "final",
      content: [{ type: "output_text", text: "roughly 10 minutes ago" }],
    }),
  ];
  write(
    root,
    `codex/sessions/fixture-${id}.jsonl`,
    transcript.map((row) => JSON.stringify(row)).join("\n") + "\n",
  );
  const text = await observedFactsReport(
    root,
    { workOrderId: "WO-999", phase: "active" },
    "About 3 tokens",
  );
  assert.match(text, /Observed facts/);
  assert.match(text, /task 1/);
  const first = correctionCounts(
    journalRows(root, {
      sessionKey,
      workOrder: "WO-999",
      phase: "implementation",
    }),
  );
  assert.equal(first.total, 3);
  assert.equal(first.byUnit["anti-oscillation"], 1);
  const next = await observedFactsReport(
    root,
    { workOrderId: "WO-999", phase: "active" },
    "About 3 tokens",
  );
  assert.match(next, /measurement advisory/);
  const again = await observedFactsReport(
    root,
    { workOrderId: "WO-999", phase: "active" },
    "About 3 tokens",
  );
  assert.doesNotMatch(again, /measurement advisory/);
});

test("bounded lexical scan stays under the order's 100 ms fixture budget", (t) => {
  const root = fixture(t);
  task(root);
  const facts = observedFacts(root, scope, now);
  const text =
    "A factual sentence with 10 tests.\n".repeat(1000) +
    "roughly 10 minutes ago";
  const started = performance.now();
  assert.equal(scanHedges(text, facts).length, 1);
  const duration = performance.now() - started;
  t.diagnostic(`lexical fixture scan: ${duration.toFixed(3)} ms`);
  assert.ok(duration < 100);
});

for (const status of ["completed", "failed", "stopped", "killed"])
  for (const envelope of ["user", "queue-operation", "attachment"])
    test(`WO-142 B2 Bash dispatch and native ${envelope} ${status} notices retain scoped terminal facts only`, (t) => {
      const root = fixture(t);
      const sessionId = "fixture-notices";
      const noticeScope = {
        ...scope,
        sessionKey: createHash("sha256").update(sessionId).digest("hex"),
      };
      const observation = observeBackgroundTool(
        "Bash",
        { run_in_background: true, command: "private-command" },
        {
          backgroundTaskId: "task-one",
          interrupted: false,
          isImage: false,
          noOutputExpected: true,
          stderr: "",
          stdout: "",
        },
        dispatch,
        "call-one",
      );
      assert.equal(observation.backgroundTask.state, "dispatched");
      appendObservation(root, noticeScope, observation, dispatch);
      const completedAt = "2026-09-17T14:07:00.000Z";
      const transcriptPath = join(root, `${sessionId}.jsonl`);
      const content = `<task-notification><task-id>task-one</task-id><tool-use-id>call-one</tool-use-id><output-file>private-output</output-file><status>${status}</status><summary>private-summary</summary><note><result>private-result</result><usage>private-usage</usage></note></task-notification>`;
      const native =
        envelope === "queue-operation"
          ? { type: envelope, operation: "enqueue", content }
          : envelope === "attachment"
            ? {
                type: envelope,
                attachment: { type: "queued_command", prompt: content },
              }
            : { type: "user", message: { role: "user", content } };
      writeFileSync(
        transcriptPath,
        [
          { ...native, sessionId, cwd: root, timestamp: completedAt },
          // Re-delivery must not extend elapsed time; queue removals are not notices.
          {
            ...native,
            sessionId,
            cwd: root,
            timestamp: "2026-09-17T14:08:00.000Z",
          },
          {
            type: "queue-operation",
            operation: "remove",
            content,
            timestamp: "2026-09-17T14:09:00.000Z",
          },
        ]
          .map((row) => JSON.stringify(row))
          .join("\n") + "\n",
      );
      const first = observationBoundary(root, noticeScope, {
        transcriptPath,
        now,
      });
      assert.match(first, new RegExp(`last observed state ${status}`));
      assert.match(first, /elapsed to terminal observation 60000 ms/);
      observationBoundary(root, noticeScope, {
        transcriptPath,
        now: "2026-09-17T15:00:00.000Z",
      });
      assert.equal(
        observedFacts(root, noticeScope, "2026-09-17T15:00:00.000Z").tasks[0]
          .elapsedMs,
        60000,
      );
      const journal = journalRows(root, noticeScope);
      assert.equal(
        journal.filter((row) => row.eventId?.startsWith("task-notice:")).length,
        1,
      );
      assert.ok(
        journal.every(
          (row) =>
            row.workOrder === scope.workOrder && row.phase === scope.phase,
        ),
      );
      assert.doesNotMatch(
        JSON.stringify(journal),
        /private-|task-one|call-one/,
      );
    });

test("WO-142 B2 non-Codex briefing leaves the facts block to its hook", async () => {
  const prior = process.env.CODEX_THREAD_ID;
  delete process.env.CODEX_THREAD_ID;
  try {
    assert.equal(
      await observedFactsReport("/unused", { phase: "active" }, ""),
      "",
    );
  } finally {
    if (prior !== undefined) process.env.CODEX_THREAD_ID = prior;
  }
});

const nativeNoticeHash = (value) =>
  createHash("sha256").update(value).digest("hex");
const nativeNotice = (id, status = "completed", call = "") =>
  `<task-notification><task-id>${id}</task-id>${call ? `<tool-use-id>${call}</tool-use-id>` : ""}<status>${status}</status><summary>synthetic payload</summary></task-notification>`;
const nativeNoticeFixture = (t) => {
  const root = mkdtempSync(join(tmpdir(), "wo142-f2-negative-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const scope = {
    sessionKey: nativeNoticeHash("fixture-native"),
    workOrder: "WO-999",
    phase: "repair",
    startedAt: "2026-09-17T14:00:00.000Z",
  };
  const path = join(root, "fixture-native.jsonl");
  return {
    root,
    scope,
    path,
    run(rows) {
      writeFileSync(
        path,
        rows
          .map((row) =>
            JSON.stringify({
              sessionId: "fixture-native",
              cwd: root,
              timestamp: "2026-09-17T14:07:00.000Z",
              ...row,
            }),
          )
          .join("\n") + "\n",
      );
      return observationBoundary(root, scope, {
        transcriptPath: path,
        now: "2026-09-17T15:00:00.000Z",
      });
    },
  };
};
test("F2 queue remove, stale timestamps and unrelated attachments establish no task", (t) => {
  const f = nativeNoticeFixture(t);
  f.run([
    {
      type: "queue-operation",
      operation: "remove",
      content: nativeNotice("removed-only"),
    },
    {
      type: "queue-operation",
      operation: "enqueue",
      content: nativeNotice("stale"),
      timestamp: "2026-09-17T13:59:59.000Z",
    },
    {
      type: "attachment",
      attachment: { type: "other", prompt: nativeNotice("unrelated") },
    },
    {
      type: "attachment",
      attachment: { type: "queued_command", prompt: nativeNotice("bad-time") },
      timestamp: "not-a-time",
    },
    {
      type: "user",
      message: { role: "assistant", content: nativeNotice("wrong-role") },
    },
    {
      type: "queue-operation",
      operation: "enqueue",
      content: nativeNotice("unsupported-status", "pending"),
    },
  ]);
  assert.deepEqual(observedFacts(f.root, f.scope).tasks, []);
});
test("F2 mixed native deliveries retain first terminal time and hash invocation aliases", (t) => {
  const f = nativeNoticeFixture(t);
  appendObservation(f.root, f.scope, {
    backgroundTask: {
      key: nativeNoticeHash("canonical-task"),
      invocationKey: nativeNoticeHash("fixture-call"),
      state: "dispatched",
      dispatchedAt: "2026-09-17T14:06:00.000Z",
      observedAt: "2026-09-17T14:06:00.000Z",
    },
  });
  const text = nativeNotice("notice-alias", "completed", "fixture-call");
  f.run([
    { type: "queue-operation", operation: "enqueue", content: text },
    {
      type: "attachment",
      attachment: { type: "queued_command", prompt: text },
      timestamp: "2026-09-17T14:08:00.000Z",
    },
    {
      type: "user",
      message: { role: "user", content: text },
      timestamp: "2026-09-17T14:09:00.000Z",
    },
  ]);
  const journal = journalRows(f.root, f.scope);
  const tasks = observedFacts(
    f.root,
    f.scope,
    "2026-09-17T15:00:00.000Z",
  ).tasks;
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].key, nativeNoticeHash("canonical-task"));
  assert.equal(tasks[0].elapsedMs, 60000);
  assert.equal(tasks[0].state, "completed");
  assert.equal(
    journal.filter((row) => row.eventId?.startsWith("task-notice:")).length,
    1,
  );
  assert.ok(
    journal.every(
      (row) => row.workOrder === "WO-999" && row.phase === "repair",
    ),
  );
  assert.doesNotMatch(
    JSON.stringify(journal),
    /canonical-task|fixture-call|notice-alias|synthetic payload/,
  );
});

test("VER-002 B2 automatic backgrounding and successful TaskStop retain terminal elapsed", (t) => {
  const root = fixture(t);
  const automatic = observeBackgroundTool(
    "Bash",
    { command: "private-command" },
    { backgroundTaskId: "automatic", timedOutAfterMs: 1000 },
    dispatch,
    "automatic-call",
  );
  assert.equal(automatic?.backgroundTask.state, "dispatched");
  appendObservation(root, scope, automatic, dispatch);
  const stoppedAt = "2026-09-17T14:07:00.000Z";
  const stopped = observeBackgroundTool(
    "TaskStop",
    { task_id: "automatic" },
    {
      task_id: "automatic",
      task_type: "local_bash",
      message: "synthetic-success",
    },
    stoppedAt,
  );
  assert.equal(stopped.backgroundTask.state, "stopped");
  appendObservation(root, scope, stopped, stoppedAt);
  for (const at of [now, "2026-09-17T15:32:00.000Z"])
    assert.equal(observedFacts(root, scope, at).tasks[0].elapsedMs, 60000);
  for (const output of [
    {},
    { task_id: "automatic", is_error: true },
    { task_id: "automatic", error: "failed" },
    { task_id: "automatic", status: "unsupported" },
  ])
    assert.equal(
      observeBackgroundTool("TaskStop", { task_id: "automatic" }, output, now)
        .backgroundTask.state,
      "unknown",
    );
  for (const status of ["completed", "failed", "stopped", "killed"])
    assert.equal(
      observeBackgroundTool(
        "TaskOutput",
        { task_id: "automatic" },
        { status },
        now,
      ).backgroundTask.state,
      status,
    );
});

test("VER-002 B2 task fold excludes old scopes and respects observation chronology", (t) => {
  const root = fixture(t);
  for (const [otherScope, at, key] of [
    [{ ...scope, phase: "verification" }, dispatch, "other-phase"],
    [{ ...scope, workOrder: "WO-998" }, dispatch, "other-order"],
    [scope, "2026-09-17T13:59:00.000Z", "old-dispatch"],
  ])
    appendObservation(
      root,
      otherScope,
      {
        backgroundTask: {
          key,
          state: "dispatched",
          dispatchedAt: at,
          observedAt: at,
        },
      },
      at,
    );
  assert.deepEqual(observedFacts(root, scope, now).tasks, []);
  const stoppedAt = "2026-09-17T14:07:00.000Z";
  appendObservation(
    root,
    scope,
    {
      backgroundTask: {
        key: "current",
        state: "stopped",
        observedAt: stoppedAt,
      },
    },
    stoppedAt,
  );
  appendObservation(
    root,
    scope,
    {
      backgroundTask: {
        key: "current",
        state: "dispatched",
        dispatchedAt: dispatch,
        observedAt: dispatch,
      },
    },
    now,
  );
  const facts = observedFacts(root, scope, now);
  assert.equal(facts.tasks.length, 1);
  assert.equal(facts.tasks[0].state, "stopped");
  assert.equal(facts.tasks[0].elapsedMs, 60000);
});

test("VER-002 B2 same-scan invocation aliases link reconstructed dispatch and killed notice", (t) => {
  const f = nativeNoticeFixture(t);
  const timestamp = "2026-09-17T14:06:00.000Z";
  f.run([
    {
      type: "assistant",
      timestamp,
      message: {
        role: "assistant",
        content: [
          { type: "tool_use", id: "new-call", name: "Bash", input: {} },
        ],
      },
    },
    {
      type: "user",
      timestamp,
      message: {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: "new-call",
            content: JSON.stringify({
              backgroundTaskId: "canonical",
              timedOutAfterMs: 1000,
            }),
          },
        ],
      },
    },
    {
      type: "queue-operation",
      operation: "enqueue",
      content: nativeNotice("alias", "killed", "new-call"),
    },
  ]);
  const tasks = observedFacts(f.root, f.scope, now).tasks;
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].state, "killed");
  assert.equal(tasks[0].elapsedMs, 60000);
});

test("VER-002 B2 transcript notices do not multiply journal reads or invocation hashes", async (t) => {
  const fs = (await import("node:fs")).default;
  const crypto = (await import("node:crypto")).default;
  const { syncBuiltinESMExports } = await import("node:module");
  const f = nativeNoticeFixture(t);
  const journal = join(
    f.root,
    "docs/control/local/harness",
    `${f.scope.sessionKey}.jsonl`,
  );
  mkdirSync(dirname(journal), { recursive: true });
  writeFileSync(
    journal,
    Array.from({ length: 16636 }, (_, index) =>
      JSON.stringify({
        workOrder: f.scope.workOrder,
        phase: f.scope.phase,
        recordedAt: dispatch,
        backgroundTask: {
          key: nativeNoticeHash(`task-${index}`),
          invocationKey: nativeNoticeHash(`call-${index}`),
          state: "dispatched",
          dispatchedAt: dispatch,
          observedAt: dispatch,
        },
      }),
    ).join("\n") + "\n",
  );
  const notices = Array.from({ length: 200 }, (_, index) => ({
    type: "queue-operation",
    operation: "enqueue",
    content: nativeNotice(`task-${index}`, "killed", `call-${index}`),
  }));
  const read = fs.readFileSync,
    hash = crypto.createHash;
  let reads = 0,
    hashes = 0;
  fs.readFileSync = function (path, ...args) {
    if (String(path) === journal) reads++;
    return read.call(this, path, ...args);
  };
  crypto.createHash = function (...args) {
    hashes++;
    return hash.apply(this, args);
  };
  syncBuiltinESMExports();
  try {
    f.run(notices);
    f.run(notices);
  } finally {
    fs.readFileSync = read;
    crypto.createHash = hash;
    syncBuiltinESMExports();
  }
  t.diagnostic(`two boundaries: ${reads} journal reads, ${hashes} hashes`);
  assert.ok(reads <= 10, `journal reads must not scale with notices: ${reads}`);
  assert.ok(hashes <= 2000, `hashes must be linear in notices: ${hashes}`);
  assert.equal(
    journalRows(f.root, f.scope).filter((row) =>
      row.eventId?.startsWith("task-notice:"),
    ).length,
    200,
  );
});

test("WO-142 terminal lifetime is distinct from dispatch age in measurement advisories", (t) => {
  const root = fixture(t);
  task(root);
  appendObservation(
    root,
    scope,
    {
      backgroundTask: {
        key: "a",
        state: "completed",
        observedAt: "2026-09-17T14:07:00.000Z",
      },
    },
    "2026-09-17T14:07:00.000Z",
  );
  const facts = observedFacts(root, scope, now);
  assert.equal(facts.tasks[0].elapsedMs, 60000);
  assert.equal(
    scanHedges("Task 1 was dispatched roughly 10 minutes ago", facts)[0]
      .observed,
    `1560000 ms since ${dispatch}`,
  );
  assert.equal(
    scanHedges("Task 1 was dispatched around 14:06", facts)[0].observed,
    dispatch,
  );
});

for (const [status, tool, content, isError] of [
  ["completed", "TaskOutput", "synthetic text output", false],
  ["failed", "TaskOutput", "synthetic failed output", false],
  ["completed", "TaskStop", "No task found with ID", true],
  ["killed", "TaskStop", JSON.stringify({ task_id: "terminal-task" }), false],
]) {
  test(`VER-003 F1 ${status} notice survives later ${tool} ${isError ? "error" : "result"}`, (t) => {
    const f = nativeNoticeFixture(t);
    appendObservation(
      f.root,
      f.scope,
      observeBackgroundTool(
        "Bash",
        {},
        { backgroundTaskId: "terminal-task" },
        dispatch,
      ),
      dispatch,
    );
    const text = f.run([
      {
        type: "queue-operation",
        operation: "enqueue",
        content: nativeNotice("terminal-task", status),
      },
      {
        type: "assistant",
        timestamp: "2026-09-17T14:08:00.000Z",
        message: {
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: "later-call",
              name: tool,
              input: { task_id: "terminal-task" },
            },
          ],
        },
      },
      {
        type: "user",
        timestamp: "2026-09-17T14:08:01.000Z",
        message: {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: "later-call",
              content,
              is_error: isError,
            },
          ],
        },
      },
    ]);
    for (const at of [now, "2026-09-17T16:00:00.000Z"]) {
      const tasks = observedFacts(f.root, f.scope, at).tasks;
      assert.equal(tasks.length, 1);
      assert.equal(tasks[0].state, status);
      assert.equal(tasks[0].observedAt, "2026-09-17T14:07:00.000Z");
      assert.equal(tasks[0].elapsedMs, 60000);
    }
    assert.match(text, /elapsed to terminal observation 60000 ms/);
    assert.doesNotMatch(
      JSON.stringify(journalRows(f.root, f.scope)),
      /terminal-task|later-call|synthetic text|No task found/,
    );
  });
}

test("VER-003 F1 earliest terminal wins in every append order, with independent earliest dispatch", (t) => {
  const permutations = (items) =>
    items.length
      ? items.flatMap((item, index) =>
          permutations(items.filter((_, i) => i !== index)).map((rest) => [
            item,
            ...rest,
          ]),
        )
      : [[]];
  const events = [
    { state: "dispatched", dispatchedAt: dispatch, observedAt: dispatch },
    { state: "completed", observedAt: "2026-09-17T14:07:00.000Z" },
    { state: "stopped", observedAt: "2026-09-17T14:08:00.000Z" },
    {
      state: "running",
      dispatchedAt: "2026-09-17T14:06:30.000Z",
      observedAt: "2026-09-17T14:09:00.000Z",
    },
    { state: "unknown", observedAt: "2026-09-17T14:10:00.000Z" },
  ];
  for (const order of permutations(events)) {
    const root = fixture(t);
    for (const event of order)
      appendObservation(
        root,
        scope,
        { backgroundTask: { key: "same-task", ...event } },
        now,
      );
    const [result] = observedFacts(root, scope, now).tasks;
    assert.equal(result.state, "completed");
    assert.equal(result.observedAt, "2026-09-17T14:07:00.000Z");
    assert.equal(result.dispatchedAt, dispatch);
    assert.equal(result.elapsedMs, 60000);
  }
});

test("VER-003 N2 nonterminal chronology retains the earliest of multiple dispatch observations", (t) => {
  for (const reverse of [false, true]) {
    const root = fixture(t);
    const events = [
      { state: "dispatched", dispatchedAt: dispatch, observedAt: dispatch },
      {
        state: "running",
        dispatchedAt: "2026-09-17T14:06:30.000Z",
        observedAt: "2026-09-17T14:07:00.000Z",
      },
    ];
    for (const event of reverse ? events.reverse() : events)
      appendObservation(
        root,
        scope,
        { backgroundTask: { key: "same-task", ...event } },
        now,
      );
    const [result] = observedFacts(root, scope, now).tasks;
    assert.equal(result.state, "running");
    assert.equal(result.dispatchedAt, dispatch);
    assert.equal(result.elapsedMs, 1560000);
  }
});

for (const axis of ["phase", "order", "start"]) {
  test(`VER-003 N2 transcript journal ${axis} scope excludes stale notice deduplication and invocation aliases`, (t) => {
    for (const staleNotice of [false, true]) {
      const f = nativeNoticeFixture(t);
      const other = {
        ...f.scope,
        ...(axis === "phase" ? { phase: "verification" } : {}),
        ...(axis === "order" ? { workOrder: "WO-998" } : {}),
      };
      const at = axis === "start" ? "2026-09-17T13:59:00.000Z" : dispatch;
      const key = nativeNoticeHash(
        staleNotice ? "current-task" : "stale-alias",
      );
      appendObservation(
        f.root,
        other,
        {
          ...(staleNotice
            ? { eventId: `task-notice:${nativeNoticeHash(`${key}:completed`)}` }
            : {}),
          backgroundTask: {
            key,
            invocationKey: nativeNoticeHash("reused-call"),
            state: staleNotice ? "completed" : "dispatched",
            observedAt: at,
          },
        },
        at,
      );
      f.run([
        {
          type: "queue-operation",
          operation: "enqueue",
          content: nativeNotice("current-task", "completed", "reused-call"),
        },
      ]);
      const tasks = observedFacts(f.root, f.scope, now).tasks;
      assert.equal(tasks.length, 1);
      assert.equal(tasks[0].key, nativeNoticeHash("current-task"));
      assert.equal(tasks[0].observedAt, "2026-09-17T14:07:00.000Z");
    }
  });
}

test("VER-003 N1 native prompt notice is observed before transcript flush and reconciles earlier evidence once", (t) => {
  const f = nativeNoticeFixture(t);
  appendObservation(
    f.root,
    f.scope,
    observeBackgroundTool(
      "Bash",
      {},
      { backgroundTaskId: "prompt-task" },
      dispatch,
      "prompt-call",
    ),
    dispatch,
  );
  const prompt = nativeNotice("prompt-task", "completed", "prompt-call");
  const first = observationBoundary(f.root, f.scope, {
    transcriptPath: f.path,
    prompt,
    now: "2026-09-17T14:07:01.000Z",
  });
  assert.match(
    first,
    /last observed state completed; elapsed to terminal observation 61000 ms/,
  );
  observationBoundary(f.root, f.scope, { transcriptPath: f.path, prompt, now });
  assert.equal(
    journalRows(f.root, f.scope).filter((r) =>
      r.eventId?.startsWith("task-notice:"),
    ).length,
    1,
  );
  // The queued transcript timestamp can become available after the prompt hook.
  const rows = [
    { type: "queue-operation", operation: "enqueue", content: prompt },
  ];
  f.run(rows);
  const size = journalRows(f.root, f.scope).length;
  f.run(rows);
  assert.equal(journalRows(f.root, f.scope).length, size);
  const [result] = observedFacts(f.root, f.scope, now).tasks;
  assert.equal(result.state, "completed");
  assert.equal(result.elapsedMs, 60000);
  assert.doesNotMatch(
    JSON.stringify(journalRows(f.root, f.scope)),
    /prompt-task|prompt-call|synthetic payload/,
  );
});

test("VER-003 N1 prompt parser ignores ordinary prose, quoted envelopes and unsupported statuses", (t) => {
  for (const prompt of [
    "Continue",
    `Example: ${nativeNotice("fake")}`,
    `\`\`\`\n${nativeNotice("fake")}\n\`\`\``,
    nativeNotice("fake", "pending"),
  ]) {
    const f = nativeNoticeFixture(t);
    observationBoundary(f.root, f.scope, { prompt, now });
    assert.deepEqual(observedFacts(f.root, f.scope, now).tasks, []);
  }
});
