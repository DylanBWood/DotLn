import test from "node:test";
import assert from "node:assert/strict";
import { decodeHarnessInput, runHarnessHook } from "../src/harness-host.js";
import { feedbackBoundary } from "../src/feedback-boundary.js";

const valid = {
  hook_event_name: "PreToolUse",
  cwd: "/missing/wo045-fixture",
  session_id: "fixture",
};
test("WO-045 hook decoder validates required, optional and config-bound fields", () => {
  const cases: [unknown, string, string][] = [
    [null, "EXPECTED_OBJECT", "$"],
    [[], "EXPECTED_OBJECT", "$"],
    [
      { ...valid, hook_event_name: "Other" },
      "UNKNOWN_EVENT",
      "$.hook_event_name",
    ],
    [
      { ...valid, hook_event_name: "Stop" },
      "EVENT_MISMATCH",
      "$.hook_event_name",
    ],
    [{ ...valid, session_id: "" }, "EMPTY_SESSION", "$.session_id"],
    [
      { ...valid, stop_hook_active: "true" },
      "EXPECTED_BOOLEAN",
      "$.stop_hook_active",
    ],
    [
      { ...valid, effort: { level: "ultra" } },
      "INVALID_EFFORT",
      "$.effort.level",
    ],
    [{ ...valid, effort: { level: 7 } }, "INVALID_EFFORT", "$.effort.level"],
  ];
  for (const key of ["hook_event_name", "cwd", "session_id"]) {
    const missing: Record<string, unknown> = { ...valid };
    delete missing[key];
    cases.push([missing, "MISSING_FIELD", `$.${key}`]);
  }
  for (const key of [
    "hook_event_name",
    "cwd",
    "session_id",
    "tool_name",
    "tool_use_id",
    "transcript_path",
    "harness_version",
    "prompt",
  ])
    cases.push([{ ...valid, [key]: 7 }, "EXPECTED_STRING", `$.${key}`]);
  for (const key of ["tool_input", "tool_response", "effort"])
    for (const value of [null, [], "object"])
      cases.push([{ ...valid, [key]: value }, "EXPECTED_OBJECT", `$.${key}`]);
  for (const [value, code, path] of cases) {
    const result = decodeHarnessInput(value, "PreToolUse");
    assert.equal(result.ok, false, JSON.stringify(value));
    if (!result.ok)
      assert.deepEqual(
        { code: result.code, path: result.path },
        { code, path },
      );
  }
});

test("WO-045 supplied inputs reject inherited fields and accessors without evaluating them", () => {
  const inherited = Object.assign(Object.create({ prompt: 7 }), valid);
  assert.equal(decodeHarnessInput(inherited).ok, false);
  let reads = 0;
  for (const value of [
    {
      ...valid,
      get prompt() {
        reads++;
        throw new Error("getter ran");
      },
    },
    {
      ...valid,
      effort: {
        get level() {
          reads++;
          throw new Error("getter ran");
        },
      },
    },
    { ...valid, effort: Object.create({ level: "ultra" }) },
    new Proxy(
      {},
      {
        getPrototypeOf() {
          throw new Error("unreadable");
        },
      },
    ),
  ])
    assert.equal(decodeHarnessInput(value).ok, false);
  assert.equal(reads, 0);
  assert.equal(
    decodeHarnessInput({ ...valid, prompt: undefined }).ok,
    false,
    "present fields must have their declared type",
  );
});

test("WO-045 hook decoder accepts native metadata and all declared effort levels", () => {
  for (const level of [undefined, "low", "medium", "high", "xhigh", "max"]) {
    const value = {
      ...valid,
      effort: level === undefined ? {} : { level },
      tool_name: "Bash",
      tool_input: { command: "pwd" },
      tool_response: { stdout: "ok" },
      tool_use_id: "tool",
      transcript_path: "/fixture",
      harness_version: "fixture",
      prompt: "",
      stop_hook_active: false,
      permission_mode: "default",
      source: "startup",
    };
    assert.deepEqual(decodeHarnessInput(value, "PreToolUse"), {
      ok: true,
      value,
    });
  }
});

test("WO-045 wrapper rejects malformed supplied and raw input before runtime or host effects", async () => {
  const config = {
    compilerPackageVersion: "unavailable",
    runtime: {
      skeletonVersion: "unavailable",
      boundaryContract: "feedback-v1" as const,
    },
    event: "PreToolUse" as const,
    kind: "permission" as const,
  };
  let boundaryCalls = 0;
  const boundary: typeof feedbackBoundary = (...args) => {
    boundaryCalls++;
    return feedbackBoundary(...args);
  };
  for (const [supplied, raw, code] of [
    [{ ...valid, cwd: 7 }, undefined, "EXPECTED_STRING"],
    [null, undefined, "EXPECTED_OBJECT"],
    [undefined, "{", "INVALID_JSON"],
  ] as const) {
    const write = process.stdout.write;
    let output = "";
    try {
      process.stdout.write = ((chunk: string | Uint8Array) => {
        output += String(chunk);
        return true;
      }) as typeof write;
      await runHarnessHook(config, boundary, supplied, raw);
    } finally {
      process.stdout.write = write;
    }
    const result = JSON.parse(output);
    assert.equal(result.hookSpecificOutput.permissionDecision, "deny");
    assert.match(
      result.hookSpecificOutput.permissionDecisionReason,
      new RegExp(code),
    );
    assert.doesNotMatch(output, /runtime unavailable|bootstrap/);
  }
  assert.equal(boundaryCalls, 0);
});
