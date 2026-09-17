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
