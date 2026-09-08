import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

// Phase-zero instrument, not a lowered policy. No raw payload is retained.
const input = JSON.parse(readFileSync(0, "utf8"));
const shape = (value, key = "") => {
  if (value === null) return "null";
  if (Array.isArray(value))
    return [...new Set(value.map((v) => JSON.stringify(shape(v))))].map(
      JSON.parse,
    );
  if (typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, shape(v, k)]),
    );
  if (typeof value !== "string") return typeof value;
  if (key === "cwd") return "<cwd>";
  if (/session|transcript|tool_use_id/.test(key)) return "<identifier-or-path>";
  if (/path/i.test(key)) return "<path>";
  return "<string>";
};
const event = input.hook_event_name;
const tool = input.tool_name;
let output = {};
let decision = "observe";
if (
  event === "PreToolUse" &&
  JSON.stringify(input.tool_input).includes("dotln-fixture-denied")
) {
  decision = "deny";
  output = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        "DOTLN_PROBE_REFUSED: do not retry this fixture effect.",
    },
  };
}
if (event === "UserPromptSubmit") {
  output = {
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext:
        "The fixture prompt hook ran. Include PROMPT_OBSERVED in the final response.",
    },
  };
}
if (event === "Stop" && !existsSync(join(input.cwd, "stop-observed"))) {
  writeFileSync(join(input.cwd, "stop-observed"), "observed\n");
  decision = "block";
  output = {
    decision: "block",
    reason:
      "DOTLN_PROBE_STOP: the Stop fixture requires one continuation. Reply STOP_OBSERVED and finish; no further tools.",
  };
}
appendFileSync(
  join(input.cwd, "probe-events.jsonl"),
  JSON.stringify({
    event,
    ...(tool ? { tool } : {}),
    fields: shape(input),
    decision,
    ...(typeof input.stop_hook_active === "boolean"
      ? { stopHookActive: input.stop_hook_active }
      : {}),
    ...(tool === "Skill"
      ? { fixtureSkill: input.tool_input?.skill === "dotln-probe" }
      : {}),
  }) + "\n",
  { mode: 0o600 },
);
process.stdout.write(JSON.stringify(output));
