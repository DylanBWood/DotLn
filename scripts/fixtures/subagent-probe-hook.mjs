import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { createHmac } from "node:crypto";
import { basename, join, resolve } from "node:path";

// Synthetic scratch probe only. Reduce values at collection; no raw transcript.
const input = JSON.parse(readFileSync(0, "utf8"));
const shape = (value) => {
  if (value === null) return "null";
  if (Array.isArray(value)) return value.map(shape);
  if (typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, shape(v)]),
    );
  return typeof value;
};
const rootId = readFileSync(join(input.cwd, "root-session.txt"), "utf8").trim();
const tool = input.tool_name;
const event = input.hook_event_name;
const key = readFileSync(join(input.cwd, "identity-key.txt"));
const identities = {};
const collect = (value, prefix = "") => {
  if (!value || typeof value !== "object") return;
  for (const [name, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${name}` : name;
    if (typeof entry === "string" && /(?:^|_)(?:id|path)$|Id$/.test(name))
      identities[path] = createHmac("sha256", key).update(entry).digest("hex");
    else if (entry && typeof entry === "object") collect(entry, path);
  }
};
collect(input);
const file = basename(input.tool_input?.file_path ?? "");
const marker = ["direct.txt", "workflow-one.txt", "workflow-two.txt"].includes(
  file,
)
  ? file
  : null;
let output = {};
if (event === "PreToolUse") {
  let permitted =
    tool === "Read" &&
    marker !== null &&
    resolve(input.cwd, input.tool_input.file_path) === join(input.cwd, marker);
  if (tool === "Agent") permitted = !input.agent_id;
  if (tool === "Workflow")
    permitted =
      !input.agent_id &&
      typeof input.tool_input?.scriptPath === "string" &&
      resolve(input.cwd, input.tool_input.scriptPath) ===
        join(input.cwd, "probe-workflow.ts");
  if (tool === "TaskOutput") permitted = !input.agent_id;
  if (permitted && ["Agent", "Workflow"].includes(tool)) {
    try {
      writeFileSync(join(input.cwd, `${tool}.admitted`), "once\n", {
        flag: "wx",
        mode: 0o600,
      });
    } catch {
      permitted = false;
    }
  }
  if (!permitted)
    output = {
      hookSpecificOutput: {
        hookEventName: event,
        permissionDecision: "deny",
        permissionDecisionReason:
          "Synthetic probe permits only its three reads and the named parent spawns.",
      },
    };
}
appendFileSync(
  join(input.cwd, "probe-events.jsonl"),
  JSON.stringify({
    event,
    ...(tool ? { tool } : {}),
    fields: shape(input),
    sessionMatchesRoot: input.session_id === rootId,
    identities,
    agentType: [
      "general-purpose",
      "workflow",
      "fixture-one",
      "fixture-two",
    ].includes(input.agent_type)
      ? input.agent_type
      : input.agent_type
        ? "other"
        : null,
    hasAgentId: typeof input.agent_id === "string" && input.agent_id.length > 0,
    ...(marker ? { fixture: marker } : {}),
    ...(input.tool_response
      ? { responseFields: shape(input.tool_response) }
      : {}),
    denied: Boolean(output.hookSpecificOutput),
  }) + "\n",
  { mode: 0o600 },
);
process.stdout.write(JSON.stringify(output));
