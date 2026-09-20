import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
assert.equal(
  realpathSync(process.cwd()),
  realpathSync(root),
  "run from repository root",
);
assert.equal(
  realpathSync(
    spawnSync("git", ["rev-parse", "--show-toplevel"], {
      cwd: root,
      encoding: "utf8",
    }).stdout.trim(),
  ),
  realpathSync(root),
);

// WO-044: writing-worker and unattended-launch rows in a scratch foreign
// worktree. `report` needs no live harness; `claude` and `codex` do.
async function writingWorker(args) {
  const { renderReport, runWritingWorker } =
    await import("./lib/writing-worker-probe.mjs");
  const [target, ...rest] = args;
  const options = {};
  for (let index = 0; index < rest.length; index += 2) {
    const name = rest[index];
    const value = rest[index + 1];
    if (
      !/^--(out|date|launch|base|attempt)$/.test(name ?? "") ||
      value === undefined
    )
      throw new Error(
        "usage: harness-probe.mjs --writing-worker claude|codex|report [--date YYYY-MM-DD] [--launch a,b] [--out dir] [--base dir] [--attempt name]",
      );
    options[name.slice(2)] = value;
  }
  if (options.date && !/^\d{4}-\d{2}-\d{2}$/.test(options.date))
    throw new Error("--date must be YYYY-MM-DD");
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const out = options.out ? resolve(options.out) : root;
  if (target === "report") {
    const { counts, rows } = renderReport({ out, date });
    console.log(
      `writing-worker-smoke-${date}: ${rows.length} rows (${Object.entries(
        counts,
      )
        .map(([label, count]) => `${count} ${label}`)
        .join(", ")})`,
    );
    return;
  }
  assert.ok(
    ["claude", "codex"].includes(target),
    "harness must be claude or codex",
  );
  assert.equal(
    process.env.DOTLN_LIVE_HARNESS,
    "1",
    "explicit live harness probe required",
  );
  const written = await runWritingWorker({
    harness: target,
    out,
    date,
    launches: options.launch ? options.launch.split(",") : null,
    ...(options.base ? { base: resolve(options.base) } : {}),
    ...(options.attempt ? { attempt: options.attempt } : {}),
  });
  console.log(
    `${written.length} run files written; render with --writing-worker report --date ${date}`,
  );
}

// WO-039 phase-zero rows: one interactive-shaped scratch session per mode.
function phaseZero(mode) {
  assert.equal(
    process.env.DOTLN_LIVE_HARNESS,
    "1",
    "explicit live harness probe required",
  );
  assert.ok(["claude", "claude-bare", "codex"].includes(mode));
  const directory = mkdtempSync(
    join(realpathSync(tmpdir()), "dotln-harness-probe-"),
  );
  const write = (path, text) => {
    mkdirSync(dirname(join(directory, path)), { recursive: true });
    writeFileSync(join(directory, path), text);
  };
  assert.equal(
    spawnSync("git", ["init", "--quiet", directory], { cwd: directory }).status,
    0,
  );
  assert.equal(
    realpathSync(
      spawnSync("git", ["rev-parse", "--show-toplevel"], {
        cwd: directory,
        encoding: "utf8",
      }).stdout.trim(),
    ),
    directory,
  );
  copyFileSync(
    join(root, "scripts/fixtures/harness-probe-hook.mjs"),
    join(directory, "probe-hook.mjs"),
  );
  const skill =
    "---\nname: dotln-probe\ndescription: Run the isolated DotLn harness probe when asked for dotln-probe.\n---\n\nInclude SKILL_OBSERVED in the final response. Read fixture.txt with the file read tool, then change its one line from before to after using the file edit tool. Attempt the exact shell command `printf dotln-fixture-denied > blocked.txt` once. A refusal is expected; do not retry it. Finish with the requested observation markers. Stay in this scratch directory and do not inspect user files, settings, credentials, or other repositories.\n";
  write("fixture.txt", "before\n");
  write(
    "CLAUDE.md",
    "# Isolated harness fixture\nUse the named project skill. Do not read outside this scratch checkout.\n",
  );
  write(
    "AGENTS.md",
    "# Isolated harness fixture\nUse the named project skill. Do not read outside this scratch checkout.\n",
  );
  const command = `node '${join(directory, "probe-hook.mjs")}'`;
  const hooks = Object.fromEntries(
    ["PreToolUse", "PostToolUse", "Stop", "UserPromptSubmit"].map((event) => [
      event,
      [
        {
          ...(event.includes("Tool") ? { matcher: ".*" } : {}),
          hooks: [{ type: "command", command, timeout: 10 }],
        },
      ],
    ]),
  );
  write(
    ".claude/settings.json",
    JSON.stringify(
      {
        autoMemoryEnabled: false,
        permissions: { deny: ["Bash(touch settings-denied.txt)"] },
        hooks,
      },
      null,
      2,
    ) + "\n",
  );
  write(".claude/skills/dotln-probe/SKILL.md", skill);
  write(".agents/skills/dotln-probe/SKILL.md", skill);
  write(".codex/hooks.json", JSON.stringify({ hooks }, null, 2) + "\n");
  const isCodex = mode === "codex";
  const executable = isCodex ? "codex" : "claude";
  const model = isCodex ? "gpt-6-astra" : "claude-fable-5";
  const effort = isCodex ? "max" : "xhigh";
  const prompt = `${isCodex ? "$dotln-probe" : "Use the dotln-probe skill by name with the Skill tool."} Run only the isolated fixture procedure. Also attempt the exact command touch settings-denied.txt once to test a settings deny. A denial is expected; do not retry. No network calls or external effects. Do not read or modify any user-scope settings.`;
  const args = isCodex
    ? [
        "-a",
        "on-request",
        "exec",
        "--ephemeral",
        "--ignore-user-config",
        "--sandbox",
        "workspace-write",
        "--model",
        model,
        "-c",
        `model_reasoning_effort="${effort}"`,
        "--json",
        prompt,
      ]
    : [
        "-p",
        "--model",
        model,
        "--effort",
        effort,
        "--no-session-persistence",
        "--setting-sources",
        "user,project",
        "--strict-mcp-config",
        "--mcp-config",
        '{"mcpServers":{}}',
        "--tools",
        "Bash,Read,Edit,Write,Skill",
        "--output-format",
        "stream-json",
        "--verbose",
        "--include-hook-events",
        ...(mode === "claude-bare" ? ["--bare"] : []),
        prompt,
      ];
  const version = spawnSync(executable, ["--version"], {
    encoding: "utf8",
  }).stdout.trim();
  const result = spawnSync(executable, args, {
    cwd: directory,
    encoding: "utf8",
    timeout: 240_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  const output = result.stdout ?? "";
  const messages = output.split("\n").flatMap((line) => {
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  });
  const events = existsSync(join(directory, "probe-events.jsonl"))
    ? readFileSync(join(directory, "probe-events.jsonl"), "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse)
    : [];
  const observedModels = [
    ...new Set(
      messages.flatMap((m) =>
        [m.model, m.message?.model, ...Object.keys(m.modelUsage ?? {})].filter(
          (v) =>
            typeof v === "string" &&
            /^(claude-[a-z0-9.-]+|gpt-[a-z0-9.-]+)$/.test(v),
        ),
      ),
    ),
  ];
  const record = {
    schemaVersion: 1,
    mode,
    observedAt: new Date().toISOString(),
    version,
    actor: {
      harness: isCodex ? "codex-cli" : "claude-code",
      model,
      effort,
      source: "launch-selector",
    },
    observedModels,
    effectiveEffort: "unobserved",
    exitCode: result.status,
    timedOut: result.error?.code === "ETIMEDOUT",
    skillResolved:
      output.includes("SKILL_OBSERVED") || events.some((e) => e.fixtureSkill),
    promptContextObserved: output.includes("PROMPT_OBSERVED"),
    stopContinued: events.some((e) => e.stopHookActive === true),
    deniedFileAbsent: !existsSync(join(directory, "blocked.txt")),
    settingsDeniedFileAbsent: !existsSync(
      join(directory, "settings-denied.txt"),
    ),
    fixtureEdited:
      readFileSync(join(directory, "fixture.txt"), "utf8").trim() === "after",
    authenticationUnavailable: /not logged in|authentication_failed/i.test(
      output,
    ),
    untrustedHooksReported:
      /untrusted|not trusted|hook.{0,50}trust|trust.{0,50}hook/i.test(
        output + (result.stderr ?? ""),
      ),
    eventTypes: [...new Set(messages.map((m) => m.type))],
    events,
    rawTranscriptRetained: false,
    userScopeSettingsWritten: false,
  };
  const target = resolve(
    root,
    `docs/discovery/harness-smoke-2026-09-07/${mode}.json`,
  );
  mkdirSync(dirname(target), { recursive: true });
  assert.ok(
    !existsSync(target),
    "retain probe observations; choose a new evidence path for a new attempt",
  );
  writeFileSync(target, JSON.stringify(record, null, 2) + "\n");
  console.log(
    JSON.stringify(
      {
        ...record,
        events: events.map(({ event, tool, decision }) => ({
          event,
          tool,
          decision,
        })),
      },
      null,
      2,
    ),
  );
}

if (process.argv[2] === "--subagents") {
  const { subagentProbe } = await import("./lib/subagent-probe.mjs");
  await subagentProbe(process.argv.slice(3));
} else if (process.argv[2] === "--authority") {
  const { authorityCli } = await import("./lib/authority-probe.mjs");
  await authorityCli(process.argv.slice(3));
} else if (process.argv[2] === "copilot") {
  const { copilotProbe } = await import("./lib/copilot-probe.mjs");
  await copilotProbe(process.argv.slice(3));
} else if (process.argv[2] === "--writing-worker")
  await writingWorker(process.argv.slice(3));
else phaseZero(process.argv[2]);
