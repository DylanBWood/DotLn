import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repository = fileURLToPath(new URL("../../", import.meta.url));
export async function subagentProbe(args) {
  assert.equal(
    process.env.DOTLN_LIVE_HARNESS,
    "1",
    "explicit live harness probe required",
  );
  assert.equal(args.length, 1, "usage: --subagents <new-evidence-file.json>");
  const target = resolve(repository, args[0]);
  assert.ok(
    !existsSync(target),
    "retain existing observations; choose a new evidence file",
  );
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-subagents-")));
  assert.equal(
    spawnSync("git", ["init", "--quiet", root], { cwd: root }).status,
    0,
  );
  assert.equal(
    realpathSync(
      spawnSync("git", ["rev-parse", "--show-toplevel"], {
        cwd: root,
        encoding: "utf8",
      }).stdout.trim(),
    ),
    root,
  );
  const write = (path, contents) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents, { mode: 0o600 });
  };
  const id = randomUUID();
  write("root-session.txt", id);
  write("identity-key.txt", randomBytes(32));
  for (const file of ["direct.txt", "workflow-one.txt", "workflow-two.txt"])
    write(file, `Synthetic ${file}\n`);
  write(
    "CLAUDE.md",
    "# Synthetic subagent probe\nRead only the three named fixture files. No nested agents, network, shell, outside reads or writes.\n",
  );
  copyFileSync(
    join(repository, "scripts/fixtures/subagent-probe-hook.mjs"),
    join(root, "probe-hook.mjs"),
  );
  write(
    "probe-workflow.ts",
    `export const meta = { name: "dotln-subagent-probe", description: "Two synthetic read-only agents" };\nconst a = await agent("Read workflow-one.txt using Read exactly once and reply with its synthetic text. No other tools or agents.", { label: "fixture-one" });\nconst b = await agent("Read workflow-two.txt using Read exactly once and reply with its synthetic text. No other tools or agents.", { label: "fixture-two" });\nreturn [a, b];\n`,
  );
  const hooks = Object.fromEntries(
    [
      "SessionStart",
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
  const prompt =
    'This is an authorized isolated identity probe. First call Agent exactly once (general-purpose, foreground): ask it to Read direct.txt exactly once and return the text, with no other tools or agents. Then call Workflow exactly once with scriptPath "probe-workflow.ts"; that script is already written and creates exactly two sequential agents. Do not inspect the script or files yourself, change the script, run a shell, make network calls, or spawn any other agents. If either tool is unavailable, report that fact without substitutes. Finish after both calls.';
  const launch = [
    "-p",
    "--session-id",
    id,
    "--model",
    "claude-fable-5",
    "--effort",
    "xhigh",
    "--no-session-persistence",
    "--setting-sources",
    "project",
    "--strict-mcp-config",
    "--mcp-config",
    '{"mcpServers":{}}',
    "--tools",
    "Read,Agent,Workflow,TaskOutput",
    "--allowedTools",
    "Read,Agent,Workflow,TaskOutput",
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
    workflowUnavailable: false,
    authenticationUnavailable: false,
  };
  const result = await new Promise((done) => {
    const child = spawn("claude", launch, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    });
    let buffer = "";
    const inspect = (line) => {
      try {
        const value = JSON.parse(line);
        for (const block of value.message?.content ?? [])
          if (block.type === "tool_use")
            observed.tools.push({
              name: block.name,
              parent: Boolean(value.parent_tool_use_id),
            });
        if (value.type === "result") observed.error = value.is_error === true;
        observed.workflowUnavailable ||=
          /workflow.{0,80}(not available|unavailable|not provided)/i.test(line);
        observed.authenticationUnavailable ||=
          /not logged in|authentication_failed/i.test(line);
      } catch {
        /* Non-JSON output is not retained. */
      }
    };
    child.stdout.on("data", (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop();
      lines.forEach(inspect);
    });
    child.stderr.resume();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {}
    }, 240000);
    child.on("error", () => {
      clearTimeout(timer);
      done({ exitCode: null, launchFailed: true, timedOut });
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      if (buffer) inspect(buffer);
      done({ exitCode, timedOut });
    });
  });
  const events = existsSync(join(root, "probe-events.jsonl"))
    ? readFileSync(join(root, "probe-events.jsonl"), "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(JSON.parse)
    : [];
  unlinkSync(join(root, "root-session.txt"));
  unlinkSync(join(root, "identity-key.txt"));
  const labels = new Map();
  for (const event of events)
    for (const [field, hash] of Object.entries(event.identities ?? {})) {
      if (!labels.has(hash)) labels.set(hash, `identity-${labels.size + 1}`);
      event.identities[field] = labels.get(hash);
    }
  // Replace the scratch digest log with the same anonymous labels filed below.
  writeFileSync(
    join(root, "probe-events.jsonl"),
    events.map(JSON.stringify).join("\n") + "\n",
  );
  const record = {
    schemaVersion: 1,
    observedAt: new Date().toISOString(),
    harness: "claude-code",
    version,
    actor: {
      model: "claude-fable-5",
      effort: "xhigh",
      source: "launch-selector",
    },
    ...result,
    ...observed,
    events,
    rawTranscriptRetained: false,
    userSettingsWritten: false,
    requestedAgents: 3,
  };
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(record, null, 2) + "\n");
  console.log(
    JSON.stringify({
      path: args[0],
      ...result,
      tools: observed.tools,
      hookEvents: events.length,
    }),
  );
}
