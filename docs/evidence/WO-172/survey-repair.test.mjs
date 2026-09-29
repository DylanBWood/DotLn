import test from "node:test";
import assert from "node:assert/strict";
import {
  repairChronology,
  repairRecordRoles,
  surveyEpisodes,
  compareByOrderAndRole,
  matchDays,
  questionAnswer,
  questionToolAnswers,
  messageBody,
  hookInjected,
  sdkLaunched,
  repeatedLines,
} from "./survey-repair.mjs";
const at = (s) => new Date(Date.UTC(2030, 0, 1) + s * 1000).toISOString();
test("record role repair preserves frozen membership and rejects unrelated or duplicate entries", () => {
  const record = {
    "WO-901": {
      steps: [
        {
          decision: "WO-901-D001",
          role: "unnamed",
          date: "2030-01-01",
          class: "correction",
        },
      ],
      corrections: [
        { decision: "WO-901-D001", role: "unnamed", date: "2030-01-01" },
      ],
      failedJudgments: [{ report: "VER-001", role: "verifier" }],
    },
  };
  const change = {
    decision: "WO-901-D001",
    groups: ["steps", "corrections"],
    role: "executor-repair",
  };
  const repaired = repairRecordRoles(record, [change]);
  assert.equal(record["WO-901"].steps[0].role, "unnamed");
  assert.deepEqual(repaired, {
    "WO-901": {
      ...record["WO-901"],
      steps: [{ ...record["WO-901"].steps[0], role: "executor-repair" }],
      corrections: [
        { ...record["WO-901"].corrections[0], role: "executor-repair" },
      ],
    },
  });
  assert.throws(
    () => repairRecordRoles(record, [{ ...change, decision: "WO-901-D002" }]),
    /frozen entry/,
  );
  assert.throws(() => repairRecordRoles(record, [change, change]), /duplicate/);
  assert.throws(() => repairRecordRoles(repaired, [change]), /original role/);
});
const message = (id, s, sequence, text = "message") => ({
  id,
  source: "fixture",
  session: "fixture",
  order: "WO-901",
  sentAt: at(s),
  sequence,
  text,
  via: "fixture",
});
const role = (text) =>
  text === "dispatch" ? "executor" : text === "verify" ? "verifier" : null;

test("queued delivery after later output and operator messages uses send chronology", () => {
  const rows = repairChronology(
    [
      message("dispatch", 0, 1, "dispatch"),
      message("later", 30, 5),
      { ...message("queued", 10, 3), deliveredAt: at(40) },
    ],
    [
      { at: at(5), sequence: 2, text: "before" },
      { at: at(20), sequence: 4, text: "after" },
      { at: at(35), sequence: 6, tool: "after tool" },
    ],
    role,
  );
  assert.deepEqual(
    rows.map((r) => r.id),
    ["dispatch", "queued", "later"],
  );
  assert.equal(rows[1].agentBefore.text, "before");
  assert.deepEqual(rows[1].agentBefore.tools, []);
  assert.equal(rows[1].sinceAgent, 5);
  assert.equal(rows[1].gapPrevOperator, 10);
  assert.equal(rows[2].gapPrevOperator, 20);
  assert.equal(rows[1].sinceDispatch, 10);
});
test("equal timestamps use source order and activity deltas cannot carry later tools", () => {
  const [row] = repairChronology(
    [message("queued", 10, 3)],
    [
      { at: at(15), sequence: 1, tool: "future" },
      { at: at(10), sequence: 4, text: "later same clock" },
      { at: at(10), sequence: 2, text: "prior same clock" },
      { at: at(5), sequence: 5, tool: "prior tool" },
    ],
    role,
  );
  assert.equal(row.agentBefore.text, "prior same clock");
  assert.deepEqual(row.agentBefore.tools, ["prior tool"]);
  assert.equal(row.sinceAgent, 0);
  assert.equal(row.gapPrevOperator, null);
  assert.equal(row.sinceDispatch, null);
});
test("a delayed dispatch determines send-time roles; episodes split at a role boundary", () => {
  const messages = repairChronology(
    [
      message("verify", 20, 4, "verify"),
      message("queued", 10, 2, "dispatch"),
      message("after", 30, 5),
    ],
    [],
    role,
  ).map((r) => ({
    ...r,
    c: { class: "direction", failureInstruction: false },
  }));
  assert.deepEqual(
    messages.map((r) => r.role),
    ["executor", "verifier", "verifier"],
  );
  assert.equal(messages[0].sinceDispatch, 0);
  assert.equal(surveyEpisodes(messages).length, 2);
});
test("order and role must both match; unknown roles never borrow another role’s record", () => {
  const episodes = [
    {
      order: "WO-901",
      role: "executor",
      start: at(0),
      class: "correction",
      failureInstruction: true,
    },
    {
      order: "WO-901",
      role: "verifier",
      start: at(0),
      class: "correction",
      failureInstruction: true,
    },
    {
      order: "WO-902",
      role: "executor",
      start: at(0),
      class: "correction",
      failureInstruction: true,
    },
  ];
  const record = {
    "WO-901": {
      steps: [
        {
          decision: "WO-901-D001",
          role: "verifier",
          date: "2030-01-01",
          class: "correction",
        },
      ],
      corrections: [
        { decision: "WO-901-D002", role: "unnamed", date: "2030-01-01" },
      ],
      failedJudgments: [
        { report: "VER-001", role: "verifier", date: "2030-01-01" },
      ],
    },
  };
  const result = compareByOrderAndRole(episodes, record);
  assert.equal(
    result.rows.find((r) => r.role === "verifier").classes.correction.matched,
    1,
  );
  assert.equal(
    result.rows.find((r) => r.order === "WO-901" && r.role === "executor")
      .failureInstructions.matched,
    0,
  );
  assert.equal(
    result.rows.find((r) => r.order === "WO-902").classes.correction.matched,
    0,
  );
  assert.equal(result.rows.find((r) => r.role === "unnamed").corrections, 1);
  assert.deepEqual(result.differingOrders, ["WO-901", "WO-902"]);
});
test("day matching consumes once, prefers same day and leaves timeless records unmatched", () => {
  assert.deepEqual(
    matchDays(
      ["2030-01-01", "2030-01-02", "2030-01-02"],
      ["2030-01-02", "unknown"],
    ),
    { transcript: 3, record: 2, matched: 1 },
  );
});

// Second repair (VER-002 F4 and F5): cases the report did not quote.
const q = (question, labels, multiSelect = false) => ({
  question,
  header: "h",
  multiSelect,
  options: labels.map((label) => ({ label, description: "d" })),
});
test("a picked option, a typed value, a multiple selection and a note are read as the operator's values", () => {
  const questions = [
    q("One?", ["Yes", "No"]),
    q("Many?", ["Alpha", "Beta, with a comma", "Gamma"], true),
    q("Typed?", ["Left", "Right"]),
  ];
  const values = questionAnswer(
    { questions },
    {
      questions,
      answers: {
        "One?": "Yes",
        "Many?": "Alpha, Beta, with a comma, something typed",
        "Typed?": "neither of these",
      },
      annotations: {
        "One?": { notes: "a note beside the pick" },
        "Typed?": { preview: "shown, not typed" },
      },
    },
  );
  assert.deepEqual(
    values.map((v) => [v.question, v.value, v.picked, Boolean(v.note)]),
    [
      ["One?", "Yes", true, false],
      ["One?", "a note beside the pick", false, true],
      ["Many?", "Beta, with a comma", true, false],
      ["Many?", "Alpha", true, false],
      ["Many?", "something typed", false, false],
      ["Typed?", "neither of these", false, false],
    ],
  );
});
test("an answer given only as a note holds the host's placeholder, which the operator did not type", () => {
  const questions = [q("One?", ["Yes", "No"])];
  assert.deepEqual(
    questionAnswer(
      { questions },
      {
        questions,
        answers: { "One?": "(notes only)" },
        annotations: { "One?": { notes: "do the other thing" } },
      },
    ).map((v) => [v.value, v.picked, Boolean(v.placeholder), Boolean(v.note)]),
    [
      ["(notes only)", false, true, false],
      ["do the other thing", false, false, true],
    ],
  );
  // The same words typed without a note are the operator's.
  assert.deepEqual(
    questionAnswer(
      { questions },
      { questions, answers: { "One?": "(notes only)" }, annotations: {} },
    ).map((v) => [v.value, Boolean(v.placeholder)]),
    [["(notes only)", false]],
  );
});
test("a question left unanswered gives no value and the call's own input stands in for a missing echo", () => {
  const questions = [q("One?", ["Yes", "No"]), q("Two?", ["A", "B"])];
  assert.deepEqual(
    questionAnswer({ questions }, { answers: { "Two?": "B" } }).map((v) => [
      v.question,
      v.value,
      v.picked,
    ]),
    [["Two?", "B", true]],
  );
  assert.deepEqual(questionAnswer({ questions }, undefined), []);
});
test("a session's lines give each answered question-tool result once, at the result's time and place", () => {
  const questions = [q("One?", ["Yes", "No"])];
  const call = (id, at, extra = {}) => ({
    type: "assistant",
    timestamp: at,
    message: {
      content: [
        { type: "text", text: "asking" },
        { type: "tool_use", id, name: "AskUserQuestion", input: { questions } },
      ],
    },
    ...extra,
  });
  const result = (id, at, answer, extra = {}, part = {}) => ({
    type: "user",
    timestamp: at,
    message: {
      content: [
        { type: "tool_result", tool_use_id: id, content: "answered", ...part },
      ],
    },
    toolUseResult: { questions, answers: { "One?": answer }, annotations: {} },
    ...extra,
  });
  const lines = [
    call("a", "2030-01-01T00:00:00.000Z"),
    result("a", "2030-01-01T00:00:40.000Z", "Yes"),
    // A refused call holds no answer; it is counted and left out.
    call("b", "2030-01-01T00:01:00.000Z"),
    {
      type: "user",
      timestamp: "2030-01-01T00:01:05.000Z",
      message: {
        content: [
          {
            type: "tool_result",
            tool_use_id: "b",
            is_error: true,
            content: "refused",
          },
        ],
      },
      toolUseResult: "Error: refused",
    },
    // A subagent thread's question is not the operator's session.
    call("c", "2030-01-01T00:02:00.000Z", { isSidechain: true }),
    result("c", "2030-01-01T00:02:09.000Z", "No", { isSidechain: true }),
    // Another tool's result in the same line is not an answer.
    {
      type: "assistant",
      timestamp: "2030-01-01T00:03:00.000Z",
      message: {
        content: [
          {
            type: "tool_use",
            id: "d",
            name: "Bash",
            input: { command: "true" },
          },
          {
            type: "tool_use",
            id: "e",
            name: "AskUserQuestion",
            input: { questions },
          },
        ],
      },
    },
    {
      type: "user",
      timestamp: "2030-01-01T00:03:30.000Z",
      message: {
        content: [
          { type: "tool_result", tool_use_id: "d", content: "ok" },
          { type: "tool_result", tool_use_id: "e", content: "answered" },
        ],
      },
      toolUseResult: {
        questions,
        answers: { "One?": "typed instead" },
        annotations: {},
      },
    },
    // A result whose call the session does not hold is passed over.
    result("z", "2030-01-01T00:04:00.000Z", "Yes"),
  ];
  assert.deepEqual(
    questionToolAnswers(lines).map((r) => [
      r.answered,
      r.sentAt.slice(14, 19),
      r.calledAt.slice(14, 19),
      r.sequence,
      r.values.map((v) => [v.value, v.picked]),
    ]),
    [
      [true, "00:40", "00:00", 2, [["Yes", true]]],
      [false, "01:05", "01:00", 4, []],
      [true, "03:30", "03:00", 8, [["typed instead", false]]],
    ],
  );
});
test("a body of parts is read for its text and names what else it holds", () => {
  assert.deepEqual(messageBody("  plain  "), { text: "plain", others: [] });
  assert.deepEqual(
    messageBody([
      { type: "text", text: "see this" },
      { type: "image", source: {} },
      { type: "text", text: "and this" },
    ]),
    { text: "see this\nand this", others: ["image"] },
  );
  // An image alone holds no text; the caller decides whether that is a message.
  assert.deepEqual(messageBody([{ type: "image", source: {} }]), {
    text: "",
    others: ["image"],
  });
  assert.deepEqual(messageBody(undefined), { text: "", others: [] });
});
test("a hook's injection is recognised by the host's item type or by one whole hook element, under any hook name", () => {
  assert.equal(
    hookInjected(
      '<hook_prompt hook_run_id="x">continue the task</hook_prompt>',
    ),
    true,
  );
  assert.equal(
    hookInjected("<user-prompt-submit-hook>context</user-prompt-submit-hook>"),
    true,
  );
  assert.equal(hookInjected("plain text", "HookPrompt"), true);
  // The operator writing about a hook, or quoting one inside a message, typed it.
  assert.equal(
    hookInjected("the stop hook fired twice <hook_prompt>x</hook_prompt> why"),
    false,
  );
  assert.equal(hookInjected("<hook_prompt>unterminated"), false);
  assert.equal(hookInjected("<pasted_content>a hook</pasted_content>"), false);
  assert.equal(hookInjected("hook", "UserMessage"), false);
});

test("a prompt the host marks as sent through its SDK entry point is not the operator's typing", () => {
  for (const line of [
    { entrypoint: "sdk-cli" },
    { promptSource: "sdk" },
    { turnOrigin: "sdk", entrypoint: "cli" },
    { entrypoint: "SDK-ts" },
  ])
    assert.equal(sdkLaunched(line), true, JSON.stringify(line));
  for (const line of [
    { entrypoint: "cli" },
    { promptSource: "typed", turnOrigin: "human" },
    { entrypoint: "sdkless" },
    { entrypoint: 7, promptSource: null },
    {},
    null,
  ])
    assert.equal(sdkLaunched(line), false, JSON.stringify(line));
});

test("a line repeated in a continued session's file is read once, in the file that holds the most lines", () => {
  const passed = repeatedLines([
    { name: "first", lines: ["a", "b", "c"] },
    { name: "continued", lines: ["a", "b", "c", "d", "e"] },
    { name: "apart", lines: ["x", "y", null, ""] },
  ]);
  assert.deepEqual([...passed.get("first")], ["a", "b", "c"]);
  assert.deepEqual([...passed.get("continued")], []);
  assert.deepEqual([...passed.get("apart")], []);
  // Files of one size are told apart by name, and a line without an
  // identifier is never passed over.
  const even = repeatedLines([
    { name: "b", lines: ["a", undefined] },
    { name: "a", lines: ["a", undefined] },
  ]);
  assert.deepEqual([...even.get("a")], []);
  assert.deepEqual([...even.get("b")], ["a"]);
  // A line three files hold is read in one of them.
  const three = repeatedLines([
    { name: "one", lines: ["k"] },
    { name: "two", lines: ["k", "l"] },
    { name: "three", lines: ["k", "l", "m"] },
  ]);
  assert.deepEqual(
    ["one", "two", "three"].map((name) => [...three.get(name)]),
    [["k"], ["k", "l"], []],
  );
});
