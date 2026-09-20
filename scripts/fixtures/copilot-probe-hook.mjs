import { createHash } from "node:crypto";
import { appendFileSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { text } from "node:stream/consumers";
import { fileURLToPath, pathToFileURL } from "node:url";

export function copilotShape(value) {
  if (value === null) return "null";
  if (Array.isArray(value))
    return [
      ...new Set(value.map((item) => JSON.stringify(copilotShape(item)))),
    ].map(JSON.parse);
  if (typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, copilotShape(item)]),
    );
  return typeof value;
}

const tools = new Set([
  "Bash",
  "Read",
  "Edit",
  "Write",
  "Skill",
  "Agent",
  "Task",
  "bash",
  "view",
  "edit",
  "create",
  "apply_patch",
  "skill",
  "task",
]);
export function copilotHookObservation(
  input,
  registration,
  event,
  directory,
  env = process.env,
) {
  const session = input.session_id ?? input.sessionId;
  const tool = input.tool_name ?? input.toolName;
  let args = input.tool_input ?? input.toolArgs;
  if (typeof args === "string") {
    try {
      args = JSON.parse(args);
    } catch {
      args = undefined;
    }
  }
  const command = typeof args?.command === "string" ? args.command : "";
  const attempt =
    ["claude-deny", "claude-error", "native-deny", "native-error"].find(
      (name) => command === `printf fixture > ${name}.txt`,
    ) ?? null;
  const decision =
    event === "PreToolUse" && attempt?.startsWith(`${registration}-`)
      ? attempt.endsWith("-deny")
        ? "deny"
        : "error"
      : "observe";
  const id = input.tool_use_id ?? input.toolCallId;
  const joinable = typeof id === "string" || input.timestamp !== undefined;
  return {
    registration,
    event,
    tool: tool === undefined ? null : tools.has(tool) ? tool : "other",
    fields: copilotShape(input),
    cwdMatches: input.cwd === directory,
    hookCwdMatches: realpathSync(process.cwd()) === directory,
    claudeProjectDirMatches: env.CLAUDE_PROJECT_DIR === directory,
    copilotProjectDirMatches: env.COPILOT_PROJECT_DIR === directory,
    sessionVariablePresent: typeof env.COPILOT_AGENT_SESSION_ID === "string",
    sessionVariableMatches:
      typeof session === "string" && env.COPILOT_AGENT_SESSION_ID === session,
    childIdentityPresent: typeof (input.agent_id ?? input.agentId) === "string",
    attempt,
    decision,
    // Correlation stays in disposable scratch, not in retained observations.
    correlation: joinable
      ? createHash("sha256")
          .update(
            JSON.stringify([
              session,
              event,
              id ?? [input.timestamp, tool, input.tool_input ?? input.toolArgs],
            ]),
          )
          .digest("hex")
      : null,
  };
}

async function main() {
  const [registration, event] = process.argv.slice(2);
  if (
    !["claude", "native"].includes(registration) ||
    ![
      "SessionStart",
      "UserPromptSubmit",
      "PreToolUse",
      "PostToolUse",
      "Stop",
    ].includes(event)
  )
    throw new Error("Invalid Copilot probe hook invocation");
  const directory = realpathSync(dirname(fileURLToPath(import.meta.url)));
  const input = JSON.parse(await text(process.stdin));
  const observation = copilotHookObservation(
    input,
    registration,
    event,
    directory,
  );
  const runtime = JSON.parse(
    readFileSync(join(directory, "probe-runtime.json"), "utf8"),
  );
  if (runtime.hostModule) {
    const { harnessHostProcess, harnessProcessAlive } = await import(
      runtime.hostModule
    );
    const owner = harnessHostProcess();
    observation.owner = {
      source: owner.source,
      alive: harnessProcessAlive(owner),
    };
  }
  appendFileSync(
    join(directory, "probe-events.jsonl"),
    JSON.stringify(observation) + "\n",
    { mode: 0o600 },
  );
  if (observation.decision === "error") {
    process.stderr.write(
      "DOTLN_COPILOT_PROBE_HOOK_ERROR: expected fixture failure; do not retry.\n",
    );
    process.exitCode = 2;
    return;
  }
  let output = {};
  if (observation.decision === "deny")
    output = {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason:
          "DOTLN_COPILOT_PROBE_DENY: expected fixture refusal; do not retry.",
      },
    };
  if (event === "UserPromptSubmit")
    output = {
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: `Include ${registration.toUpperCase()}_CONTEXT_OBSERVED in the final answer.`,
      },
    };
  if (event === "Stop")
    output = { systemMessage: `${registration.toUpperCase()}_STOP_OBSERVED` };
  process.stdout.write(JSON.stringify(output));
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
)
  await main();
