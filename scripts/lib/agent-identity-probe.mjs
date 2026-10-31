import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createScratchRoot } from "./temporary-roots.mjs";
import { TOOL_ROOT } from "./config.mjs";
import { fixture } from "./target-worktree-fixture.mjs";
import { write, json } from "./helpers.mjs";
import { shellQuote } from "./git.mjs";

export function identityRows(events, { lateWrite = false } = {}) {
  const calls = events.filter((row) => row.event === "PreToolUse" && row.agent);
  const observed = (yes, reason) => ({
    status: yes ? "observed" : calls.length ? "absent" : "untestable",
    reason,
  });
  return {
    childIdentity: observed(
      calls.some((row) => row.agent && row.type === "dotln-worker"),
      "agent_id and agent_type on a child's tool call",
    ),
    childEffort: observed(
      calls.some((row) => row.effort),
      "effort.level on a child's tool call",
    ),
    nestedSpawner: observed(
      calls.some((row) => row.tool === "Agent" && !row.denied),
      "nested Agent admission names its calling worker",
    ),
    lateDirectory: observed(
      events.some((row) => row.createdLateDirectory) && lateWrite,
      "directory created by SubagentStart after spawn; declared synthetic write succeeded",
    ),
    pinnedEffort: observed(
      calls.length > 0 && calls.every((row) => row.effort === "xhigh"),
      "child tool hooks report the definition's xhigh pin; selection only, not effective inference effort",
    ),
    targetHooks: observed(
      calls.some((row) => row.source === "target" && row.cwd === "target"),
      "target worker cwd and target bundle hook both observed; shell cd alone is not worker cwd",
    ),
  };
}

export async function agentIdentityProbe(args) {
  assert.equal(
    process.env.DOTLN_LIVE_HARNESS,
    "1",
    "explicit live harness probe required",
  );
  assert.equal(
    args.length,
    1,
    "usage: --agent-identity <new-evidence-file.json>",
  );
  const output = resolve(TOOL_ROOT, args[0]);
  assert.ok(
    !existsSync(output),
    "retain existing observations; choose a new evidence file",
  );
  const base = realpathSync(
    createScratchRoot(join(tmpdir(), "dotln-agent-identity-")),
  );
  try {
    const f = fixture(base);
    f.mapClone();
    f.start();
    const root = f.main;
    const late = join(base, "late");
    write(base, "key", randomBytes(32), { mode: 0o600 });
    write(base, "probe.json", json({ root, target: f.target, late }));
    write(root, "direct.txt", "Synthetic worker identity probe.\n");
    write(
      root,
      "CLAUDE.md",
      "# Isolated identity probe\nOnly the declared synthetic reads, write, cwd check and two worker spawns are authorized. No network, repository edits, or other commands.\n",
    );
    const command = (source) =>
      `node ${shellQuote(join(TOOL_ROOT, "scripts/fixtures/agent-identity-probe-hook.mjs"))} ${shellQuote(base)} ${source}`;
    const events = [
      "SessionStart",
      "UserPromptSubmit",
      "PreToolUse",
      "PostToolUse",
      "SubagentStart",
      "SubagentStop",
      "Stop",
    ];
    const hooks = Object.fromEntries(
      events.map((event) => [
        event,
        [
          {
            hooks: [
              { type: "command", command: command("parent"), timeout: 10 },
            ],
          },
        ],
      ]),
    );
    write(
      root,
      ".claude/settings.json",
      json({ autoMemoryEnabled: false, hooks }),
    );
    write(
      root,
      ".claude/agents/dotln-worker.md",
      `---\nname: dotln-worker\ndescription: Synthetic identity probe worker\nmodel: claude-opus-5-5\neffort: xhigh\ntools: Read, Write, Bash, Agent, TaskOutput\n---\nFollow the synthetic probe prompt. No additional work.\n`,
    );
    // Keep the real emitted target hooks and add an observation alongside
    // them. The source label establishes which project's settings ran.
    const targetSettings = join(f.target, ".claude/settings.json");
    const settings = JSON.parse(readFileSync(targetSettings, "utf8"));
    for (const event of events) {
      settings.hooks ??= {};
      settings.hooks[event] ??= [];
      settings.hooks[event].push({
        hooks: [{ type: "command", command: command("target"), timeout: 10 }],
      });
    }
    writeFileSync(targetSettings, json(settings));
    const worker = `Read ${join(root, "direct.txt")} once. Then use Agent exactly once, subagent_type dotln-worker, with a prompt to Read ${join(f.target, "source.txt")} once and finish without any other tool or agent. Then Write exactly 'synthetic late write\\n' to ${join(late, "observed.txt")}. Finally Read ${join(f.target, "source.txt")} once. If your host cwd is not the target, you may run exactly: cd '${f.target}' && pwd -P. If any required tool is unavailable, report that and continue the remaining steps without substitutes. No other operations.`;
    const prompt = `Run one foreground Agent of subagent_type dotln-worker, no model override, no inherited context. Set its working directory to ${f.target} if the Agent schema supports cwd; otherwise report that absence and launch it normally. Its entire prompt is: ${worker} After it finishes, stop. No other tools, agents, reads or writes.`;
    const argv = [
      "-p",
      "--model",
      "claude-opus-5-5",
      "--effort",
      "xhigh",
      "--no-session-persistence",
      "--setting-sources",
      "project",
      "--strict-mcp-config",
      "--mcp-config",
      '{"mcpServers":{}}',
      "--tools",
      "Read,Write,Bash,Agent,TaskOutput",
      "--allowedTools",
      "Read,Write,Bash,Agent,TaskOutput",
      "--permission-prompts",
      "none",
      "--output-format",
      "stream-json",
      "--verbose",
      "--include-hook-events",
      "--forward-subagent-text",
      "--max-budget-usd",
      "5",
      prompt,
    ];
    const version = spawnSync("claude", ["--version"], {
      encoding: "utf8",
    }).stdout.trim();
    const observed = {
      tools: [],
      usage: null,
      costUsd: null,
      cwdUnsupported: false,
      error: false,
    };
    const env = { ...f.env };
    delete env.CLAUDECODE;
    const result = await new Promise((done) => {
      const child = spawn("claude", argv, {
        cwd: root,
        env,
        stdio: ["ignore", "pipe", "pipe"],
        detached: true,
      });
      let buffer = "",
        timedOut = false;
      const inspect = (line) => {
        try {
          const row = JSON.parse(line);
          for (const block of row.message?.content ?? [])
            if (block.type === "tool_use")
              observed.tools.push({
                name: block.name,
                nested: Boolean(row.parent_tool_use_id),
                inputFields: Object.keys(block.input ?? {}),
              });
          if (row.type === "result") {
            observed.usage = row.usage ?? null;
            observed.costUsd = row.total_cost_usd ?? null;
            observed.error = row.is_error === true;
          }
          observed.cwdUnsupported ||=
            /(?:cwd|working directory).{0,90}(?:not supported|not available|no .*parameter|does not (?:have|support))/i.test(
              line,
            );
        } catch {
          /* Retain reduced observations only. */
        }
      };
      child.stdout.on("data", (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop();
        lines.forEach(inspect);
      });
      child.stderr.resume();
      const timer = setTimeout(() => {
        timedOut = true;
        try {
          process.kill(-child.pid, "SIGTERM");
        } catch {}
      }, 300000);
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
    const rows = existsSync(join(base, "events.jsonl"))
      ? readFileSync(join(base, "events.jsonl"), "utf8")
          .trim()
          .split("\n")
          .filter(Boolean)
          .map(JSON.parse)
      : [];
    const capabilities = identityRows(rows, {
      lateWrite: existsSync(join(late, "observed.txt")),
    });
    const record = {
      schemaVersion: 1,
      observedAt: new Date().toISOString(),
      harness: "claude-code",
      version,
      rootSelection: {
        model: "claude-opus-5-5",
        effort: "xhigh",
        source: "launch-selector",
      },
      workerSelection: {
        model: "claude-opus-5-5",
        effort: "xhigh",
        source: "agent-definition",
      },
      ...result,
      ...observed,
      rows: capabilities,
      events: rows,
      targetBundle:
        "WO-072 registered target fixture with emitted WO-049 hooks plus observation hook",
      selectedDesign: Object.values(capabilities).every(
        (row) => row.status === "observed",
      )
        ? "in-process"
        : "separate-phase-sessions",
      otherHarnesses: { codex: "untested", copilot: "untested" },
      rawTranscriptRetained: false,
      userSettingsWritten: false,
      maxBudgetUsd: 5,
      requestedAgents: 2,
    };
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, json(record), { flag: "wx" });
    console.log(
      json({
        path: args[0],
        ...result,
        rows: capabilities,
        selectedDesign: record.selectedDesign,
        costUsd: observed.costUsd,
      }),
    );
    return record;
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}
