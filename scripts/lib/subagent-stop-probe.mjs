import { createFixtureRoot } from "./temporary-roots.mjs";
import { write as writeFixture, json as prettyJson } from "./helpers.mjs";
import { spawnGit } from "./git.mjs";
import { TOOL_ROOT, workerSelector } from "./config.mjs";
import { runProbeSession } from "./subagent-probe.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

// The two background shells of the probe session, one for each actor. A
// task is attributed to its starter by the command its entry carries, since
// whether the host's list is the worker's or the session's is the question.
const SHELLS = { parent: "sleep 297", worker: "sleep 311" };
// What the launchpad's default worker runs on Claude, read once a run.
const selected = () => workerSelector("claude");

/** What the hook's events say of a worker's stop, reduced to the three
 * observations the probe is for. `events` are the hook fixture's rows in
 * order; each carries `agent` (whether the hook input named an agent), and a
 * stop row carries `backgroundTasks` when the input held that list. */
export function readSubagentStops(events) {
  const stops = events.filter((row) => row.event === "SubagentStop");
  const first = stops[0];
  const tasks = first?.backgroundTasks;
  const owners = new Set((tasks ?? []).map((task) => task.startedBy));
  // The list's scope at the worker's first stop, when both shells were live.
  const listScope = !first
    ? "no subagent stop observed"
    : tasks === undefined
      ? "the input carried no background_tasks"
      : tasks.length === 0
        ? "empty"
        : owners.has("parent")
          ? "session"
          : owners.has(null)
            ? "unattributed"
            : "worker";
  // Whether a listed shell carries the identifier its start returned, for
  // each actor's shell: what lets a hook tell whose a listed task is.
  const startMatchesList = (actor) => {
    const start = events.find(
      (row) => row.event === "PostToolUse" && row.started === actor,
    );
    const listedTask = tasks?.find((task) => task.startedBy === actor);
    return start?.response === undefined || listedTask?.id === undefined
      ? null
      : start.response === listedTask.id;
  };
  // Whether the identifier the parent's Agent call returned is the one the
  // list names the stopping worker by: what lets a hook tell a sibling
  // worker the parent started from a task nobody's call is on record for.
  const agentStart = events.find(
    (row) => row.event === "PostToolUse" && row.tool === "Agent",
  );
  const own = tasks?.find((task) => task.self);
  const refusedAt = events.findIndex(
    (row) => row.event === "SubagentStop" && row.decision === "block",
  );
  const after = refusedAt < 0 ? [] : events.slice(refusedAt + 1);
  // The host held the worker when the worker acted again after the refusal:
  // a tool call of its own, or a second stop that re-enters.
  const workerAfter = after.filter(
    (row) => row.agent && row.event !== "SubagentStop",
  );
  const reentry = after.find((row) => row.event === "SubagentStop");
  const lastStop = events.findLastIndex((row) => row.event === "SubagentStop");
  return {
    stopInputFields: first ? Object.keys(first.fields).sort() : null,
    backgroundTaskFields:
      first && Array.isArray(first.fields.background_tasks)
        ? first.fields.background_tasks.map((entry) =>
            Object.keys(entry).sort(),
          )
        : null,
    stops: stops.map((row) => ({
      stopHookActive: row.stopHookActive ?? null,
      decision: row.decision,
      backgroundTasks: row.backgroundTasks ?? null,
    })),
    listScope,
    listHoldsStoppingWorker: tasks ? tasks.some((task) => task.self) : null,
    startIdentifierNamesListedTask: {
      worker: startMatchesList("worker"),
      parent: startMatchesList("parent"),
    },
    startIdentifierFields: [
      ...new Set(
        events
          .filter((row) => row.event === "PostToolUse" && row.started)
          .map((row) => row.responseField),
      ),
    ],
    agentStartIdentifierField: agentStart?.responseField ?? null,
    agentStartIdentifierNamesWorkerEntry:
      agentStart?.response === undefined || own?.id === undefined
        ? null
        : agentStart.response === own.id,
    refusedStopHeldWorker:
      refusedAt < 0
        ? "no stop was refused"
        : workerAfter.length > 0 || reentry !== undefined,
    workerCallsAfterRefusal: workerAfter
      .filter((row) => row.event === "PreToolUse")
      .map((row) => row.tool),
    reentryStopHookActive: reentry?.stopHookActive ?? null,
    // Whether the parent was prompted again after the worker's last stop,
    // which is where the parent's prompt facts are printed.
    parentPromptAfterWorkerStop:
      lastStop >= 0 &&
      events
        .slice(lastStop + 1)
        .some((row) => row.event === "UserPromptSubmit" && !row.agent),
    parentStops: events
      .filter((row) => row.event === "Stop")
      .map((row) => ({
        stopHookActive: row.stopHookActive ?? null,
        backgroundTasks: row.backgroundTasks ?? null,
      })),
  };
}

/** One live scratch session: the parent starts a background shell, launches
 * one background worker that starts another, and the hook refuses the
 * worker's first stop. Writes the observation to a new evidence file. */
export async function subagentStopProbe(args) {
  assert.equal(
    process.env.DOTLN_LIVE_HARNESS,
    "1",
    "explicit live harness probe required",
  );
  assert.equal(
    args.length,
    1,
    "usage: --subagent-stop <new-evidence-file.json>",
  );
  const target = resolve(TOOL_ROOT, args[0]);
  assert.ok(
    !existsSync(target),
    "retain existing observations; choose a new evidence file",
  );
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-subagent-stop-")),
  );
  assert.equal(spawnGit(["init", "--quiet", root], { cwd: root }).status, 0);
  const write = (path, contents) =>
    writeFixture(root, path, contents, { mode: 0o600 });
  write("identity-key.txt", randomBytes(32));
  write("stop-probe.json", JSON.stringify(SHELLS));
  write(
    "CLAUDE.md",
    "# Synthetic subagent-stop probe\nRun only the two named background shells. No network, no file reads or writes, no other commands or agents.\n",
  );
  copyFileSync(
    join(TOOL_ROOT, "scripts/fixtures/harness-probe-hook.mjs"),
    join(root, "probe-hook.mjs"),
  );
  const hooks = Object.fromEntries(
    [
      "UserPromptSubmit",
      "PreToolUse",
      "PostToolUse",
      "Stop",
      "SubagentStart",
      "SubagentStop",
    ].map((event) => [
      event,
      [
        {
          ...(event.includes("Tool") ? { matcher: ".*" } : {}),
          hooks: [
            {
              type: "command",
              command: `node '${join(root, "probe-hook.mjs")}'`,
              timeout: 10,
            },
          ],
        },
      ],
    ]),
  );
  write(
    ".claude/settings.json",
    JSON.stringify({ autoMemoryEnabled: false, hooks }),
  );
  const prompt = `This is an authorized isolated probe in a scratch directory. Step 1: call Bash exactly once with run_in_background true and the exact command \`${SHELLS.parent}\`. Step 2: call Agent exactly once (general-purpose, run_in_background true) with this prompt: "Call Bash exactly once with run_in_background true and the exact command \`${SHELLS.worker}\`. Do not wait for it. Then reply WORKER_DONE and finish. If a hook then refuses your stop and names a tool, call that tool on the shell you started, reply WORKER_STOPPED and finish." Step 3: wait for that agent's completion notification without calling any tool. Step 4: call TaskStop on the shell you started in step 1, then reply PARENT_DONE and finish. Run no other command, read no file, and start no other agent. If a tool is unavailable, say so without a substitute.`;
  const tools = "Bash,Agent,TaskStop,TaskOutput";
  const MODEL = selected();
  const launch = [
    "-p",
    "--session-id",
    randomUUID(),
    "--model",
    MODEL.model,
    "--effort",
    MODEL.effort,
    "--no-session-persistence",
    "--setting-sources",
    "project",
    "--strict-mcp-config",
    "--mcp-config",
    '{"mcpServers":{}}',
    "--tools",
    tools,
    "--allowedTools",
    tools,
    "--permission-prompts",
    "none",
    "--output-format",
    "stream-json",
    "--verbose",
    "--include-hook-events",
    "--forward-subagent-text",
    prompt,
  ];
  const version = spawnSync("claude", ["--version"], {
    encoding: "utf8",
  }).stdout.trim();
  const observed = {
    tools: [],
    error: false,
    authenticationUnavailable: false,
  };
  const result = await runProbeSession(root, launch, (value, line) => {
    for (const block of value.message?.content ?? [])
      if (block.type === "tool_use")
        observed.tools.push({
          name: block.name,
          parent: Boolean(value.parent_tool_use_id),
        });
    if (value.type === "result") observed.error = value.is_error === true;
    observed.authenticationUnavailable ||=
      /not logged in|authentication_failed/i.test(line);
  });
  const events = existsSync(join(root, "probe-events.jsonl"))
    ? readFileSync(join(root, "probe-events.jsonl"), "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(JSON.parse)
    : [];
  unlinkSync(join(root, "identity-key.txt"));
  // The keyed digests leave as anonymous labels, the same label for the
  // same task wherever it is listed.
  const labels = new Map();
  const label = (digest) => {
    if (!labels.has(digest)) labels.set(digest, `task-${labels.size + 1}`);
    return labels.get(digest);
  };
  for (const row of events) {
    if (row.response !== undefined) row.response = label(row.response);
    for (const task of row.backgroundTasks ?? [])
      if (task.id !== undefined) task.id = label(task.id);
  }
  const record = {
    schemaVersion: 1,
    observedAt: new Date().toISOString(),
    harness: "claude-code",
    version,
    actor: { ...MODEL, source: "launch-selector" },
    ...result,
    ...observed,
    shells: {
      parent: "one background shell, started before the worker",
      worker: "one background shell, started by the worker",
    },
    ...readSubagentStops(events),
    events: events.map((row) => ({
      event: row.event,
      ...(row.tool ? { tool: row.tool } : {}),
      agent: row.agent,
      decision: row.decision,
      ...(row.started ? { started: row.started } : {}),
      ...(row.response !== undefined ? { returned: row.response } : {}),
    })),
    rawTranscriptRetained: false,
    userSettingsWritten: false,
  };
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, prettyJson(record));
  console.log(
    JSON.stringify({
      path: args[0],
      ...result,
      listScope: record.listScope,
      refusedStopHeldWorker: record.refusedStopHeldWorker,
      hookEvents: events.length,
    }),
  );
}
