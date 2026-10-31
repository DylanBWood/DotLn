import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createHmac } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const shape = (value) =>
  value === null
    ? "null"
    : Array.isArray(value)
      ? value.map(shape)
      : typeof value === "object"
        ? Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, shape(item)]),
          )
        : typeof value;

// This hook is installed only in the synthetic probe. Reduce identities at
// collection and allow exactly the declared reads, writes and two spawns.
export function observe(input, base, source) {
  const config = JSON.parse(readFileSync(join(base, "probe.json"), "utf8"));
  const stateFile = join(base, "probe-state.json");
  const state = existsSync(stateFile)
    ? JSON.parse(readFileSync(stateFile, "utf8"))
    : { identities: {}, spawns: [] };
  const identity = (value) => {
    if (typeof value !== "string") return null;
    const hash = createHmac("sha256", readFileSync(join(base, "key")))
      .update(value)
      .digest("hex");
    return (state.identities[hash] ??=
      `identity-${Object.keys(state.identities).length + 1}`);
  };
  const agent = identity(input.agent_id);
  const row = {
    source,
    event: input.hook_event_name,
    tool: input.tool_name ?? null,
    fields: shape(input),
    session: identity(input.session_id),
    agent,
    type:
      input.agent_type === "dotln-worker"
        ? "dotln-worker"
        : input.agent_type
          ? "other"
          : null,
    effort: ["low", "medium", "high", "xhigh", "max"].includes(
      input.effort?.level,
    )
      ? input.effort.level
      : null,
    cwd:
      resolve(input.cwd) === config.target
        ? "target"
        : resolve(input.cwd) === config.root
          ? "launchpad"
          : "other",
    invocation: identity(input.tool_use_id),
  };
  if (input.hook_event_name === "SubagentStart" && !existsSync(config.late)) {
    mkdirSync(config.late);
    row.createdLateDirectory = true;
  }
  let allowed = true;
  if (input.hook_event_name === "PreToolUse") {
    const tool = input.tool_name;
    const file = resolve(input.cwd, input.tool_input?.file_path ?? ".");
    allowed =
      tool === "Read" &&
      [
        join(config.root, "direct.txt"),
        join(config.target, "source.txt"),
      ].includes(file);
    if (tool === "Write")
      allowed = agent !== null && file === join(config.late, "observed.txt");
    if (tool === "Agent") {
      const spawner = agent ?? "root";
      allowed =
        input.tool_input?.subagent_type === "dotln-worker" &&
        !state.spawns.includes(spawner) &&
        state.spawns.length < 2;
      if (allowed) state.spawns.push(spawner);
    }
    if (tool === "TaskOutput" || tool === "SubagentHandback") allowed = true;
    // A worker may change its shell's directory solely to report it. The
    // hook's cwd row distinguishes that from an actual host worker cwd.
    if (tool === "Bash")
      allowed = input.tool_input?.command === `cd '${config.target}' && pwd -P`;
  }
  row.denied = !allowed;
  writeFileSync(stateFile, JSON.stringify(state), { mode: 0o600 });
  appendFileSync(join(base, "events.jsonl"), JSON.stringify(row) + "\n", {
    mode: 0o600,
  });
  return allowed
    ? {}
    : {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "Synthetic identity probe permits only its declared operations.",
        },
      };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [base, source] = process.argv.slice(2);
  process.stdout.write(
    JSON.stringify(observe(JSON.parse(readFileSync(0, "utf8")), base, source)),
  );
}
