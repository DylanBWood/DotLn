import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createHmac } from "node:crypto";
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
// The subagent-stop mode names the two shell commands its session may run:
// one for the parent, one for the worker. Without that file this hook is the
// phase-zero instrument and judges no shell command but its own fixture's.
const stopProbePath = join(input.cwd, "stop-probe.json");
const stopProbe = existsSync(stopProbePath)
  ? JSON.parse(readFileSync(stopProbePath, "utf8"))
  : null;
// An identifier is kept only as a keyed digest, so two events that name one
// task can be matched and no host identifier is retained.
const digest = (id) =>
  createHmac("sha256", readFileSync(join(input.cwd, "identity-key.txt")))
    .update(String(id))
    .digest("hex");
// Whose shell a background task is, by the command the mode gave each actor.
const startedBy = (value) => {
  const text = JSON.stringify(value ?? null);
  return text.includes(stopProbe.worker)
    ? "worker"
    : text.includes(stopProbe.parent)
      ? "parent"
      : null;
};
const startResponse = (response) => {
  const task = response?.task ?? response ?? {};
  const field = [
    "backgroundTaskId",
    "agentId",
    "agent_id",
    "task_id",
    "task_name",
  ].find((name) => typeof task[name] === "string");
  return field
    ? { response: digest(task[field]), responseField: field }
    : { responseField: null };
};
let output = {};
let decision = "observe";
const deny = (reason) => {
  decision = "deny";
  output = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
};
if (
  event === "PreToolUse" &&
  JSON.stringify(input.tool_input).includes("dotln-fixture-denied")
)
  deny("DOTLN_PROBE_REFUSED: do not retry this fixture effect.");
if (stopProbe && event === "PreToolUse" && tool === "Bash") {
  const expected = input.agent_id ? stopProbe.worker : stopProbe.parent;
  if (
    input.tool_input?.command !== expected ||
    input.tool_input?.run_in_background !== true
  )
    deny(
      "DOTLN_PROBE_REFUSED: this probe admits one named background shell for each actor and no other command.",
    );
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
// One worker stop is refused as one session stop is, to see whether the host
// holds the worker and what its re-entry carries.
if (
  event === "SubagentStop" &&
  !existsSync(join(input.cwd, "subagent-stop-observed"))
) {
  writeFileSync(join(input.cwd, "subagent-stop-observed"), "observed\n");
  decision = "block";
  output = {
    decision: "block",
    reason:
      "DOTLN_PROBE_SUBAGENT_STOP: a background shell this worker started is still running. Stop it with the TaskStop tool, reply WORKER_STOPPED and finish.",
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
    ...(stopProbe
      ? {
          agent: typeof input.agent_id === "string" && input.agent_id !== "",
          ...(Array.isArray(input.background_tasks)
            ? {
                backgroundTasks: input.background_tasks.map((task) => ({
                  ...(typeof task?.id === "string"
                    ? { id: digest(task.id) }
                    : {}),
                  type: typeof task?.type === "string" ? task.type : null,
                  status: typeof task?.status === "string" ? task.status : null,
                  startedBy: startedBy(task),
                  // Whether this entry is the stopping worker itself.
                  ...(typeof input.agent_id === "string" &&
                  task?.id === input.agent_id
                    ? { self: true }
                    : {}),
                })),
              }
            : {}),
          ...(event === "PostToolUse" && tool === "Bash"
            ? { started: startedBy(input.tool_input) }
            : {}),
          // The identifier a start returned, by the field that carried it,
          // so a listed task can be matched with the call that started it.
          ...(event === "PostToolUse" && ["Bash", "Agent"].includes(tool)
            ? startResponse(input.tool_response)
            : {}),
        }
      : {}),
  }) + "\n",
  { mode: 0o600 },
);
process.stdout.write(JSON.stringify(output));
