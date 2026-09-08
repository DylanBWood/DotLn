import assert from "node:assert/strict";
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
assert.equal(
  process.env.DOTLN_LIVE_HARNESS,
  "1",
  "explicit live harness probe required",
);
const mode = process.argv[2];
assert.ok(["claude", "claude-bare", "codex"].includes(mode));
const directory = mkdtempSync("/private/tmp/dotln-harness-probe-");
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
  settingsDeniedFileAbsent: !existsSync(join(directory, "settings-denied.txt")),
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
