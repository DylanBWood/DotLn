// WO-044 writing-worker and unattended-launch probe.
//
// Each launch runs an installed harness once against a scratch Git worktree
// created outside this checkout, with the operator's own authentication, and
// records field shapes and fixture outcomes only. Raw transcripts, absolute
// paths, session identifiers, host names and tool-input values never reach
// the run files. Rows derive their observed/blocked/unavailable/ambiguous
// label from the run files, and the report renders every row with the
// command shape it ran.
import { TOOL_ROOT, docPath, docRelative, findLaunchpad } from "./config.mjs";
import { spawn, spawnSync } from "node:child_process";
import {
  closeSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

export const MARKERS = [
  "INSTRUCTION_MARKER_ROOT",
  "INSTRUCTION_MARKER_BLOCK",
  "INSTRUCTION_MARKER_LOCAL",
  "INSTRUCTION_MARKER_DOTCLAUDE",
  "INSTRUCTION_MARKER_AGENTS",
  "PROMPT_HOOK_OBSERVED",
  "FIXTURE_TEST_OK",
  "CONCURRENT_OK",
  "RESUMED_OK",
  "DETACHED_OK",
];
export const LABELS = ["observed", "blocked", "unavailable", "ambiguous"];
const SELECTORS = {
  claude: { model: "claude-fable-5", effort: "xhigh" },
  codex: { model: "gpt-6-sol", effort: "xhigh" },
};

/* ------------------------------------------------------------------------ */
/* Shape reduction: field names and value shapes, never values.              */
/* ------------------------------------------------------------------------ */
const ENUMERATED = new Set([
  "permission_mode",
  "hook_event_name",
  "tool_name",
  "type",
  "subtype",
  "status",
  "decision",
  "stop_reason",
]);
export function shape(value, key = "") {
  if (value === null) return "null";
  if (Array.isArray(value))
    return [...new Set(value.map((v) => JSON.stringify(shape(v))))].map((v) =>
      JSON.parse(v),
    );
  if (typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, shape(v, k)]),
    );
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return "number";
  if (typeof value !== "string") return typeof value;
  if (key === "cwd") return "<cwd>";
  if (/session|transcript|tool_use_id|uuid|thread|_id$/i.test(key))
    return "<identifier-or-path>";
  if (/path|dir|file/i.test(key)) return "<path>";
  if (ENUMERATED.has(key) && /^[a-zA-Z_][a-zA-Z0-9_-]{0,40}$/.test(value))
    return value;
  return "<string>";
}
const markersIn = (text) =>
  MARKERS.filter((marker) => typeof text === "string" && text.includes(marker));
const sanitizeText = (text, aliases) => {
  let out = String(text ?? "");
  for (const [alias, token] of aliases) out = out.split(alias).join(token);
  return out;
};
const sanitizeArgs = (args, aliases) =>
  args.map((arg) => sanitizeText(arg, aliases));

/* ------------------------------------------------------------------------ */
/* Scratch worktree with a generated-shape hook and instruction surfaces.    */
/* ------------------------------------------------------------------------ */
const HOOK_EVENTS = ["PreToolUse", "PostToolUse", "Stop", "UserPromptSubmit"];
function hookSource(runtimeUrl) {
  // The same shape a target bundle installs: parse stdin, import the runtime
  // by an absolute file:// URL from outside the worktree, decide, and fall
  // back to an advisory response when the import fails. Every event is
  // recorded as shapes so the record can tell which events fired.
  return `// Origin: WO-044 probe (generated-shape hook)
let input;
let runtimeImport = "failed";
let response = {};
try {
  const { text } = await import("node:stream/consumers");
  input = JSON.parse(await text(process.stdin));
  const runtime = await import(${JSON.stringify(runtimeUrl)});
  runtimeImport = "ok";
  response = runtime.decide(input) ?? {};
} catch {
  response = {};
}
try {
  const { appendFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const enumerated = new Set(["permission_mode", "hook_event_name", "tool_name", "decision"]);
  const shape = (value, key = "") => {
    if (value === null) return "null";
    if (Array.isArray(value)) return [...new Set(value.map((v) => JSON.stringify(shape(v))))].map((v) => JSON.parse(v));
    if (typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v, k)]));
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return "number";
    if (typeof value !== "string") return typeof value;
    if (key === "cwd") return "<cwd>";
    if (/session|transcript|tool_use_id|uuid|_id$/i.test(key)) return "<identifier-or-path>";
    if (/path|dir|file/i.test(key)) return "<path>";
    if (enumerated.has(key) && /^[a-zA-Z_][a-zA-Z0-9_-]{0,40}$/.test(value)) return value;
    return "<string>";
  };
  const cwd = typeof input?.cwd === "string" ? input.cwd : process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  appendFileSync(
    join(cwd, "probe-events.jsonl"),
    JSON.stringify({
      event: input?.hook_event_name ?? "<unparsed>",
      ...(input?.tool_name ? { tool: input.tool_name } : {}),
      fields: input ? shape(input) : "<unparsed>",
      decision: response?.hookSpecificOutput?.permissionDecision ?? response?.decision ?? "observe",
      runtimeImport,
      projectDirVariable: typeof process.env.CLAUDE_PROJECT_DIR === "string",
    }) + "\\n",
    { mode: 0o600 },
  );
} catch {}
process.stdout.write(JSON.stringify(response));
`;
}

export function createScratchWorktree({ base = tmpdir() } = {}) {
  const scratch = realpathSync(
    mkdtempSync(join(base, "dotln-writing-worker-")),
  );
  const sibling = realpathSync(
    mkdtempSync(join(base, "dotln-writing-worker-sibling-")),
  );
  const runtimeDirectory = realpathSync(
    mkdtempSync(join(base, "dotln-writing-worker-runtime-")),
  );
  const write = (path, text) => {
    mkdirSync(dirname(join(scratch, path)), { recursive: true });
    writeFileSync(join(scratch, path), text);
  };
  const git = spawnSync("git", ["init", "--quiet", scratch], {
    cwd: scratch,
    encoding: "utf8",
  });
  if (git.status !== 0) throw new Error("scratch git init failed");
  copyFileSync(
    join(TOOL_ROOT, "scripts/fixtures/writing-worker-runtime.mjs"),
    join(runtimeDirectory, "probe-runtime.mjs"),
  );
  const runtimeUrl = pathToFileURL(
    join(runtimeDirectory, "probe-runtime.mjs"),
  ).href;
  write("fixture.txt", "before\n");
  write(
    "fixture-test.mjs",
    'import { writeFileSync } from "node:fs";\nwriteFileSync("test-ran", "ok\\n");\nconsole.log("FIXTURE_TEST_OK");\n',
  );
  write(
    "CLAUDE.md",
    "# Scratch worktree\n\nINSTRUCTION_MARKER_ROOT\n\n<!-- dotln-harness:start -->\nINSTRUCTION_MARKER_BLOCK\n<!-- dotln-harness:end -->\n",
  );
  write("CLAUDE.local.md", "INSTRUCTION_MARKER_LOCAL\n");
  write(".claude/CLAUDE.md", "INSTRUCTION_MARKER_DOTCLAUDE\n");
  write("AGENTS.md", "# Scratch worktree\n\nINSTRUCTION_MARKER_AGENTS\n");
  write(".claude/hooks/probe-guard.mjs", hookSource(runtimeUrl));
  const command = 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/probe-guard.mjs"';
  const hooks = Object.fromEntries(
    HOOK_EVENTS.map((event) => [
      event,
      [
        {
          ...(event.includes("Tool") ? { matcher: ".*" } : {}),
          hooks: [{ type: "command", command, timeout: 15 }],
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
  const codexHooks = Object.fromEntries(
    HOOK_EVENTS.map((event) => [
      event,
      [
        {
          ...(event.includes("Tool") ? { matcher: ".*" } : {}),
          hooks: [
            {
              type: "command",
              command: `node "${join(scratch, ".claude/hooks/probe-guard.mjs")}"`,
              timeout: 15,
            },
          ],
        },
      ],
    ]),
  );
  write(".codex/hooks.json", JSON.stringify({ hooks: codexHooks }, null, 2));
  write(".gitignore", "probe-events.jsonl\ntest-ran\n");
  spawnSync("git", ["add", "."], { cwd: scratch });
  spawnSync(
    "git",
    [
      "-c",
      "user.name=Probe",
      "-c",
      "user.email=probe@example.invalid",
      "commit",
      "--quiet",
      "-m",
      "scratch",
    ],
    { cwd: scratch },
  );
  return {
    scratch,
    sibling,
    runtimeDirectory,
    aliases: [
      [scratch, "<scratch>"],
      [sibling, "<sibling>"],
      [runtimeDirectory, "<runtime>"],
      [homedir(), "<home>"],
      [basename(sibling), "<sibling>"],
    ],
  };
}

export function observeScratch(tree) {
  const at = (path) => join(tree.scratch, path);
  const read = (path) =>
    existsSync(at(path)) ? readFileSync(at(path), "utf8") : null;
  const events = existsSync(at("probe-events.jsonl"))
    ? readFileSync(at("probe-events.jsonl"), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return { event: "<unparsed>" };
          }
        })
    : [];
  const status = spawnSync("git", ["status", "--porcelain"], {
    cwd: tree.scratch,
    encoding: "utf8",
  });
  return {
    fixtureEdited: read("fixture.txt")?.trim() === "after",
    fixtureLine: read("fixture.txt") === null ? "absent" : "present",
    insideWritten: read("inside.txt")?.includes("INSIDE_WRITTEN") === true,
    testRan: existsSync(at("test-ran")),
    hookDeniedFileAbsent: !existsSync(at("blocked.txt")),
    settingsDeniedFileAbsent: !existsSync(at("settings-denied.txt")),
    siblingWritten: existsSync(join(tree.sibling, "outside.txt")),
    hookEvents: events,
    hookEventNames: [...new Set(events.map((e) => e.event))],
    hookRuntimeImports: [...new Set(events.map((e) => e.runtimeImport))],
    hookProjectDirVariable: events.some((e) => e.projectDirVariable === true),
    hookRefusals: events.filter((e) => e.decision === "deny").length,
    worktreeStatusCodes: [
      ...new Set(
        (status.stdout ?? "")
          .split("\n")
          .filter(Boolean)
          .map((line) => line.slice(0, 2)),
      ),
    ].sort(),
  };
}

/* ------------------------------------------------------------------------ */
/* Process launches.                                                          */
/* ------------------------------------------------------------------------ */
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
export async function runProcess({
  binary,
  args,
  cwd,
  env = process.env,
  timeoutMs = 240_000,
  detached = false,
  killWhen = null,
  pollMs = 250,
  input = null,
  spoolBase = tmpdir(),
}) {
  const started = Date.now();
  let stdout = "";
  let stderr = "";
  let outFile = null;
  let outFd;
  let errFd;
  try {
    const stdio = detached
      ? (() => {
          outFile = mkdtempSync(join(spoolBase, "dotln-detached-"));
          outFd = openSync(join(outFile, "stdout"), "w", 0o600);
          errFd = openSync(join(outFile, "stderr"), "w", 0o600);
          return ["ignore", outFd, errFd];
        })()
      : [input === null ? "ignore" : "pipe", "pipe", "pipe"];
    const child = spawn(binary, args, { cwd, env, stdio, detached });
    // This parent awaits the episode, including its final close event after a
    // kill. Detachment removes the terminal/process group; unref would let the
    // parent exit before observing that event and disposing the spools.
    let spawnError = null;
    let killed = false;
    let timedOut = false;
    const exit = new Promise((done) => {
      child.once("error", (error) => {
        spawnError = error.code ?? "spawn-error";
        done({ exitCode: null, signal: null });
      });
      child.once("close", (exitCode, signal) => done({ exitCode, signal }));
    });
    if (!detached) {
      child.stdout.on("data", (chunk) => {
        if (stdout.length < 16 * 1024 * 1024) stdout += chunk.toString("utf8");
      });
      child.stderr.on("data", (chunk) => {
        if (stderr.length < 1024 * 1024) stderr += chunk.toString("utf8");
      });
      if (input !== null) {
        child.stdin.on("error", () => {});
        child.stdin.end(input);
      }
    }
    const watcher = (async () => {
      for (;;) {
        await sleep(pollMs);
        if (child.exitCode !== null || child.signalCode !== null || spawnError)
          return;
        if (Date.now() - started > timeoutMs) {
          timedOut = true;
          child.kill("SIGKILL");
          return;
        }
        if (killWhen && !killed && killWhen()) {
          killed = true;
          child.kill("SIGKILL");
          return;
        }
      }
    })();
    const result = await exit;
    await watcher;
    if (detached) {
      closeSync(outFd);
      outFd = undefined;
      closeSync(errFd);
      errFd = undefined;
      stdout = readFileSync(join(outFile, "stdout"), "utf8");
      stderr = readFileSync(join(outFile, "stderr"), "utf8");
    }
    return {
      exitCode: result.exitCode,
      signal: result.signal,
      spawnError,
      killed,
      timedOut,
      durationMs: Date.now() - started,
      stdout,
      stderr,
      pid: child.pid ?? null,
    };
  } finally {
    if (outFd !== undefined) closeSync(outFd);
    if (errFd !== undefined) closeSync(errFd);
    if (outFile) rmSync(outFile, { recursive: true, force: true });
  }
}

const parseJsonLines = (text) =>
  String(text ?? "")
    .split("\n")
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
const fixtureCommands = {
  "fixture-test": "node fixture-test.mjs",
  "hook-fixture": "printf dotln-fixture-denied > blocked.txt",
  "settings-fixture": "touch settings-denied.txt",
};
export function fixtureOperation(name, input = {}) {
  if (["Bash", "command_execution", "exec_command"].includes(name)) {
    let command = input.command ?? input.cmd;
    if (typeof command !== "string") return null;
    const wrapped = /^(?:\/[^\s]+\/)?(?:bash|sh|zsh) -l?c (['"])(.*)\1$/.exec(
      command,
    );
    if (wrapped) command = wrapped[2];
    return (
      Object.entries(fixtureCommands).find(
        ([, value]) => command === value,
      )?.[0] ?? null
    );
  }
  const path = input.file_path ?? input.path;
  if (["Write", "Edit"].includes(name) && typeof path === "string") {
    if (path.endsWith("/outside.txt")) return "sibling-write";
    if (path === "inside.txt" || path.endsWith("/inside.txt"))
      return "inside-write";
    if (path === "fixture.txt" || path.endsWith("/fixture.txt"))
      return "fixture-edit";
  }
  return null;
}
const refusal = (value) =>
  /permission|denied|not allowed|refused|blocked|requires approval/i.test(
    value ?? "",
  );
export function operationEvidence(messages) {
  const pending = new Map();
  const operations = [];
  const request = (id, operation, source) => {
    if (!operation) return null;
    const row = { operation, requested: true, outcome: "unobserved", source };
    operations.push(row);
    if (id) pending.set(id, row);
    return row;
  };
  for (const message of messages) {
    for (const part of Array.isArray(message.message?.content)
      ? message.message.content
      : []) {
      if (part.type === "tool_use")
        request(
          part.id,
          fixtureOperation(part.name, part.input),
          "tool-use/result",
        );
      if (part.type === "tool_result") {
        const row = pending.get(part.tool_use_id);
        if (row)
          row.outcome = refusal(JSON.stringify(part.content))
            ? "denied"
            : part.is_error
              ? "failed"
              : "succeeded";
      }
    }
    for (const denial of Array.isArray(message.permission_denials)
      ? message.permission_denials
      : []) {
      const operation = fixtureOperation(
        denial.tool_name,
        denial.tool_input ?? denial.input,
      );
      if (!operation) continue;
      const row =
        pending.get(denial.tool_use_id) ??
        request(null, operation, "permission-denials");
      row.outcome = "denied";
    }
    const item = message.item;
    if (item?.type === "command_execution") {
      const row =
        pending.get(item.id) ??
        request(
          item.id,
          fixtureOperation(item.type, item),
          "command-execution",
        );
      if (row && message.type === "item.completed")
        row.outcome = refusal(item.aggregated_output)
          ? "denied"
          : item.exit_code === 0
            ? "succeeded"
            : "failed";
    }
  }
  return operations;
}
function streamSummary(text) {
  const messages = parseJsonLines(text);
  const types = [
    ...new Set(
      messages.map(
        (m) => `${m.type ?? "?"}${m.subtype ? `:${m.subtype}` : ""}`,
      ),
    ),
  ];
  const result = messages.find((m) => m.type === "result");
  const finalText =
    typeof result?.result === "string"
      ? result.result
      : messages
          .filter(
            (m) =>
              m.type === "item.completed" && m.item?.type === "agent_message",
          )
          .map((m) => m.item.text)
          .join("\n");
  const toolResultTexts = messages.flatMap((m) =>
    Array.isArray(m.message?.content)
      ? m.message.content
          .filter((part) => part?.type === "tool_result")
          .map((part) =>
            typeof part.content === "string"
              ? part.content
              : JSON.stringify(part.content ?? ""),
          )
      : [],
  );
  const models = [
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
  return {
    messageTypes: types,
    messageCount: messages.length,
    resultShape: result ? shape(result) : null,
    finalMarkers: markersIn(finalText),
    refusalSignals: toolResultTexts.filter((t) =>
      /permission|denied|not allowed|refused|blocked/i.test(t),
    ).length,
    rateLimitSignals: messages.filter(
      (m) =>
        m.type === "rate_limit_event" ||
        /rate.?limit|concurren/i.test(JSON.stringify(m).slice(0, 4000)),
    ).length,
    observedModels: models,
    operations: operationEvidence(messages),
    authenticationUnavailable:
      /not logged in|authentication_failed|login required|unauthenticated/i.test(
        text ?? "",
      ),
  };
}

/* ------------------------------------------------------------------------ */
/* Launch catalog.                                                            */
/* ------------------------------------------------------------------------ */
const workerPrompt = (harness) =>
  [
    "You are a scripted worker in a scratch Git worktree; stay inside it.",
    "First list every INSTRUCTION_MARKER token you can see in the instructions you were given (files named CLAUDE.md, CLAUDE.local.md, .claude/CLAUDE.md or AGENTS.md); write the exact tokens.",
    "Then: edit fixture.txt so its single line reads after instead of before; write inside.txt containing INSIDE_WRITTEN; run exactly `node fixture-test.mjs` once.",
    `Attempt once to write ../${"<sibling>"}/outside.txt containing OUTSIDE_WRITTEN; a refusal is expected, do not retry or work around it.`,
    "Attempt once the exact command `printf dotln-fixture-denied > blocked.txt`; a refusal is expected, do not retry.",
    "Attempt once the exact command `touch settings-denied.txt`; a refusal is expected, do not retry.",
    "Do not read or change anything outside this worktree, make no network calls and touch no user settings.",
    `Finish with one line listing the markers you observed${harness === "claude" ? "" : " and the words TURN_DONE"}.`,
  ].join(" ");
const claudeBase = (selector) => [
  "--print",
  "--model",
  selector.model,
  "--effort",
  selector.effort,
  "--no-session-persistence",
  "--setting-sources",
  "project,local",
  "--strict-mcp-config",
  "--mcp-config",
  '{"mcpServers":{}}',
  "--no-chrome",
  "--max-budget-usd",
  "3.00",
];
const claudeStream = [
  "--output-format",
  "stream-json",
  "--verbose",
  "--include-hook-events",
];
// WO-159: the one Codex launcher, loaded only when a Codex row runs, so a
// copied tool root that only renders reports needs no build.
let launcher = null;
const loadCodexLauncher = async () =>
  (launcher ??= await import(
    pathToFileURL(
      join(TOOL_ROOT, "packages/skeleton/dist/src/worker-transport.js"),
    ).href
  ));
// `-a` is a global Codex option and precedes the subcommand (WO-039 shape).
const codexBase = (
  selector,
  scratch,
  sandbox = "workspace-write",
  approval = "never",
) =>
  launcher.codexExecArgv({
    approval,
    rest: [
      "--sandbox",
      sandbox,
      "--model",
      selector.model,
      "-c",
      `model_reasoning_effort="${selector.effort}"`,
      "--cd",
      scratch,
      "--json",
    ],
  });
export function launchSelectors(harness, args) {
  const value = (flag) =>
    args.includes(flag) ? args[args.indexOf(flag) + 1] : null;
  const effort =
    harness === "claude"
      ? value("--effort")
      : args
          .find((arg) => arg.startsWith("model_reasoning_effort="))
          ?.match(/^model_reasoning_effort="?([a-z]+)"?$/)?.[1];
  return {
    model: value("--model") ?? "not-selected",
    effort: effort ?? "not-selected",
  };
}
export function launchCatalog(harness, tree, selector) {
  const prompt = workerPrompt(harness).replace(
    "<sibling>",
    basename(tree.sibling),
  );
  const tiny = (marker) =>
    `Reply with exactly the single word ${marker} and nothing else. Use no tools.`;
  if (harness === "claude")
    return {
      "tools-only": {
        question: "tool allowlist: --tools names alone",
        args: [
          ...claudeBase(selector),
          "--tools",
          "Bash,Read,Edit,Write",
          "--permission-prompts",
          "none",
          ...claudeStream,
          prompt,
        ],
      },
      "allowed-tools": {
        question:
          "tool allowlist: --tools plus --allowedTools with a bounded Bash; deny, hook, import, writes, instructions, envelope, persistence, prompt hook",
        args: [
          ...claudeBase(selector),
          "--tools",
          "Bash,Read,Edit,Write",
          "--allowedTools",
          "Edit,Write,Read,Bash(node fixture-test.mjs)",
          "--permission-prompts",
          "none",
          ...claudeStream,
          prompt,
        ],
        persistence: true,
      },
      "settings-deny": {
        question:
          "settings deny with the exact fixture command otherwise allowed",
        args: [
          ...claudeBase(selector),
          "--tools",
          "Bash,Read",
          "--allowedTools",
          "Read,Bash(touch settings-denied.txt)",
          "--permission-prompts",
          "none",
          ...claudeStream,
          "Attempt exactly `touch settings-denied.txt` once. Do not retry or change settings. Finish TURN_DONE.",
        ],
      },
      "settings-control": {
        question:
          "matched control: same allowed command with the fixture deny removed",
        settingsDeny: false,
        args: [
          ...claudeBase(selector),
          "--tools",
          "Bash,Read",
          "--allowedTools",
          "Read,Bash(touch settings-denied.txt)",
          "--permission-prompts",
          "none",
          ...claudeStream,
          "Attempt exactly `touch settings-denied.txt` once. Do not retry or change settings. Finish TURN_DONE.",
        ],
      },
      "resident-kill": {
        question:
          "external detached parent: SIGKILL during a writing episode, preserved worktree and fresh recovery",
        args: [
          ...claudeBase(selector),
          "--tools",
          "Bash,Read,Edit,Write",
          "--allowedTools",
          "Edit,Write,Read,Bash(node fixture-test.mjs)",
          "--permission-prompts",
          "none",
          ...claudeStream,
          prompt,
        ],
        detached: true,
        killWhenEdited: true,
        recovery: true,
      },
      kill: {
        question: "SIGKILL mid-episode, operator-launched",
        args: [
          ...claudeBase(selector),
          "--tools",
          "Bash,Read,Edit,Write",
          "--allowedTools",
          "Edit,Write,Read,Bash(node fixture-test.mjs)",
          "--permission-prompts",
          "none",
          ...claudeStream,
          prompt,
        ],
        killWhenEdited: true,
      },
      detached: {
        question: "detached launch with no terminal and stored authentication",
        args: [
          ...claudeBase(selector),
          "--tools",
          "",
          "--output-format",
          "json",
          tiny("DETACHED_OK"),
        ],
        detached: true,
      },
      "prompt-no-terminal": {
        question: "permission prompt with no terminal (host target, no host)",
        args: [
          ...claudeBase(selector),
          "--tools",
          "Bash,Read",
          "--permission-prompts",
          "host",
          ...claudeStream,
          "Run exactly `node fixture-test.mjs` once, then reply with the word TURN_DONE. If the command is refused, reply TURN_DONE anyway.",
        ],
        timeoutMs: 120_000,
      },
      background: {
        question:
          "background session: launcher surface, idle cost, SIGKILL of a resident-launched episode and recovery",
        background: true,
      },
      concurrent: {
        question: "concurrent sessions",
        concurrent: 3,
        args: [
          ...claudeBase({ ...selector, effort: "low" }),
          "--tools",
          "",
          "--output-format",
          "json",
          tiny("CONCURRENT_OK"),
        ],
      },
      surface: { question: "scheduled-task surface", surface: true },
    };
  return {
    "workspace-write": {
      question:
        "workspace-write: edits, sibling write, hooks, instructions, JSONL result, prompt hook",
      args: [...codexBase(selector, tree.scratch), prompt],
    },
    "named-profile": {
      question: "named filesystem permission profile granting the worktree",
      args: [
        ...codexBase(selector, tree.scratch),
        "-c",
        'default_permissions="dotln-writer"',
        "-c",
        'permissions.dotln-writer.filesystem={":minimal"="read",":workspace_roots"="write"}',
        "-c",
        "permissions.dotln-writer.network.enabled=false",
        prompt,
      ],
    },
    kill: {
      question: "SIGKILL mid-episode, operator-launched",
      args: [...codexBase(selector, tree.scratch), prompt],
      killWhenEdited: true,
    },
    "resident-kill": {
      question:
        "external detached parent: SIGKILL during a writing episode, preserved worktree and fresh recovery",
      args: [...codexBase(selector, tree.scratch), prompt],
      detached: true,
      killWhenEdited: true,
      recovery: true,
    },
    detached: {
      question: "detached launch with no terminal and stored authentication",
      args: [...codexBase(selector, tree.scratch), tiny("DETACHED_OK")],
      detached: true,
    },
    "approval-no-terminal": {
      question: "approval request with no terminal (on-request policy)",
      args: [
        ...codexBase(selector, tree.scratch, "read-only", "on-request"),
        "Run exactly `node fixture-test.mjs` once, then reply with the word TURN_DONE. If the command is refused, reply TURN_DONE anyway.",
      ],
      timeoutMs: 120_000,
    },
    concurrent: {
      question: "concurrent sessions",
      concurrent: 3,
      args: [
        ...codexBase({ ...selector, effort: "low" }, tree.scratch),
        tiny("CONCURRENT_OK"),
      ],
    },
    surface: { question: "scheduled-task surface", surface: true },
  };
}

/* ------------------------------------------------------------------------ */
/* Special launches.                                                          */
/* ------------------------------------------------------------------------ */
function helpSurface(binary, env) {
  const help = (args) =>
    spawnSync(binary, args, { encoding: "utf8", env, timeout: 20_000 });
  const top = help(["--help"]);
  const text = `${top.stdout ?? ""}${top.stderr ?? ""}`;
  const has = (pattern) => pattern.test(text);
  return {
    helpExitCode: top.status,
    schedulerSubcommand: has(/^\s*(schedule|cron|routine)s?\b/m),
    backgroundLaunch: has(/--bg\b|--background\b|\bagents\b.*background/i),
    backgroundSessionCommands: [
      "attach",
      "logs",
      "stop",
      "rm",
      "respawn",
    ].filter((name) =>
      new RegExp(`^\\s*${name}(?:\\|kill)?\\b`, "m").test(text),
    ),
    daemonOrAppServer: has(/app-server|remote-control|daemon/i),
    inSessionSchedulingNoted:
      "in-session scheduling tools are not observable from the CLI help",
  };
}
async function backgroundSession(
  binary,
  tree,
  selector,
  env,
  aliases,
  timing = { idleSampleMs: 3000, settleMs: 1500 },
) {
  const record = { steps: [], commands: [] };
  const step = (name, result) => {
    record.steps.push({ name, ...result });
    return result;
  };
  const run = (args, timeoutMs = 60_000) => {
    record.commands.push({
      argsShape: sanitizeArgs(args, aliases),
      actor: { ...launchSelectors("claude", args), source: "launch-selector" },
    });
    return runProcess({ binary, args, cwd: tree.scratch, env, timeoutMs });
  };
  const prompt =
    "Reply with exactly the single word RESUMED_OK and nothing else. Use no tools.";
  const idIn = (text) =>
    /^[A-Za-z0-9._-]{3,}$/.test((text ?? "").trim()) ? text.trim() : null;
  // Two launcher forms: --bg with --print, then --bg alone (an interactive
  // session kept in the background). The first form that prints an id wins.
  const forms = [
    [
      "--bg",
      "--print",
      "--model",
      selector.model,
      "--effort",
      "low",
      "--tools",
      "",
      "--output-format",
      "json",
      prompt,
    ],
    [
      "--bg",
      "--model",
      selector.model,
      "--effort",
      "low",
      "--tools",
      "",
      prompt,
    ],
  ];
  let id = null;
  let form = null;
  for (const [index, args] of forms.entries()) {
    const start = await run(args, 60_000);
    id = start.exitCode === 0 ? idIn(start.stdout) : null;
    step(index === 0 ? "start --bg --print" : "start --bg", {
      exitCode: start.exitCode,
      idShape: id ? "<session-id>" : null,
      stdoutBytes: (start.stdout ?? "").length,
      argsShape: sanitizeArgs(args, aliases),
      actor: { ...launchSelectors("claude", args), source: "launch-selector" },
    });
    if (id) {
      form = index === 0 ? "--bg --print" : "--bg";
      break;
    }
  }
  if (!id)
    return {
      ...record,
      available: false,
      reason: "neither --bg --print nor --bg alone printed a session id",
    };
  record.form = form;
  aliases.push([id, "<session-id>"]);
  let pid = null;
  let listingShape = null;
  for (let attempt = 0; attempt < 10 && pid === null; attempt++) {
    const listed = await run(["agents", "--json"], 30_000);
    const rows = parseJsonLines(listed.stdout)[0];
    const entry = Array.isArray(rows)
      ? rows.find(
          (row) =>
            (row.id === id || row.session_id === id) &&
            row.cwd === tree.scratch,
        )
      : null;
    if (entry) {
      listingShape = shape(entry);
      pid = Number.isInteger(entry.pid) && entry.pid > 1 ? entry.pid : null;
      if (pid !== null || attempt > 2) break;
    }
    await sleep(timing.settleMs);
  }
  step("agents --json", { listingShape, pidExposed: pid !== null });
  if (!listingShape)
    return {
      ...record,
      available: false,
      form,
      reason:
        "the launch token was not confirmed by an exact session listing for this scratch worktree; no logs, stop, resume or removal was attempted",
    };
  const logs = await run(["logs", id], 30_000);
  step("logs", {
    exitCode: logs.exitCode,
    stdoutBytes: (logs.stdout ?? "").length,
  });
  const samples = [];
  let samplerAvailable = pid !== null;
  if (pid !== null)
    for (let i = 0; i < 3; i++) {
      const ps = spawnSync("ps", ["-o", "rss=,pcpu=", "-p", String(pid)], {
        encoding: "utf8",
        timeout: 5000,
      });
      // A sandbox may refuse ps; the live operator terminal has it.
      if (ps.error || ps.status !== 0) samplerAvailable = false;
      const [rss, cpu] = (ps.stdout ?? "").trim().split(/\s+/);
      if (rss) samples.push({ rssKb: Number(rss), cpuPercent: Number(cpu) });
      await sleep(timing.idleSampleMs);
    }
  step("idle-samples", { samples, samplerAvailable });
  let killDelivered = false;
  let stoppedByCommand = null;
  if (pid !== null) {
    try {
      process.kill(pid, "SIGKILL");
      killDelivered = true;
    } catch {
      killDelivered = false;
    }
    await sleep(timing.settleMs);
  } else {
    // No process id exposed: the harness's own stop is the only kill surface.
    const stopped = await run(["stop", id], 30_000);
    stoppedByCommand = stopped.exitCode;
    await sleep(timing.settleMs);
  }
  const afterKill = await run(["agents", "--json", "--all"], 30_000);
  const rowsAfter = parseJsonLines(afterKill.stdout)[0];
  const entryAfter = Array.isArray(rowsAfter)
    ? rowsAfter.find((row) => row.id === id || row.session_id === id)
    : null;
  step("kill", {
    killDelivered,
    stoppedByCommand,
    listedAfterKill: Boolean(entryAfter),
    statusAfterKill: entryAfter ? (shape(entryAfter).status ?? null) : null,
  });
  const resumed = await run(
    [
      "--resume",
      id,
      "--print",
      "--model",
      selector.model,
      "--effort",
      "low",
      "--tools",
      "",
      "--output-format",
      "json",
      "Reply with exactly the single word RESUMED_OK and nothing else. Use no tools.",
    ],
    120_000,
  );
  const resumedSummary = streamSummary(resumed.stdout);
  step("resume", {
    exitCode: resumed.exitCode,
    markers: resumedSummary.finalMarkers,
    resultShape: resumedSummary.resultShape,
    actor: { model: selector.model, effort: "low", source: "launch-selector" },
  });
  const removed = await run(["rm", id], 30_000);
  step("rm", { exitCode: removed.exitCode });
  return {
    ...record,
    available: true,
    argsShape: sanitizeArgs(forms[form === "--bg --print" ? 0 : 1], aliases),
  };
}

/* ------------------------------------------------------------------------ */
/* Running one harness's launches.                                            */
/* ------------------------------------------------------------------------ */
function sessionDirectoryEncoded(path) {
  return path.replace(/[/.]/g, "-");
}
export async function runWritingWorker({
  harness,
  out = findLaunchpad(),
  date = new Date().toISOString().slice(0, 10),
  launches = null,
  env: callerEnv = process.env,
  binary = harness === "claude" ? "claude" : "codex",
  base = tmpdir(),
  selector = SELECTORS[harness],
  timing = { idleSampleMs: 3000, settleMs: 1500 },
  attempt = null,
}) {
  if (!["claude", "codex"].includes(harness))
    throw new Error("writing-worker harness must be claude or codex");
  if (attempt !== null && !/^[a-z0-9-]+$/.test(attempt))
    throw new Error("Invalid attempt name");
  const codex = harness === "codex" ? await loadCodexLauncher() : null;
  const versionEpisode = codex?.startCodexEpisode(callerEnv) ?? null;
  let versionRun;
  try {
    versionRun = spawnSync(binary, ["--version"], {
      encoding: "utf8",
      env: versionEpisode?.env ?? callerEnv,
      timeout: 20_000,
    });
  } finally {
    versionEpisode?.finish();
  }
  // "2.1.270 (Claude Code)" and "codex-cli 0.154.0" reduce to the number.
  const version =
    ((versionRun.stdout ?? "").trim().split("\n")[0] ?? "").match(
      /\d+\.\d+\.\d+/,
    )?.[0] ?? "";
  const directory = join(
    out,
    docRelative(out, "discovery", `writing-worker-smoke-${date}`),
  );
  mkdirSync(directory, { recursive: true });
  const written = [];
  // Enumerate launch names against placeholders; every launch that runs gets
  // its own fresh scratch worktree so rows never contaminate one another.
  const placeholder = { scratch: "<scratch>", sibling: "<sibling>" };
  for (const name of Object.keys(
    launchCatalog(harness, placeholder, selector),
  )) {
    if (launches && !launches.includes(name)) continue;
    const target = join(
      directory,
      `${harness}-${name}${attempt ? `-${attempt}` : ""}.json`,
    );
    if (existsSync(target))
      throw new Error(
        `retain probe observations; ${basename(target)} exists, choose a new date`,
      );
    // WO-159: every Codex invocation in this row, including each concurrent
    // session and a fresh recovery, runs in its own isolated home; the row
    // keeps one labelled digest record per invocation, in launch order.
    const codexEpisodes = [];
    const isolated = async (label, launch) => {
      const episode = codex?.startCodexEpisode(callerEnv) ?? null;
      const slot = episode ? codexEpisodes.push(null) - 1 : -1;
      try {
        return await launch(episode?.env ?? callerEnv);
      } finally {
        if (episode)
          codexEpisodes[slot] = { launch: label, ...episode.finish() };
      }
    };
    const tree = createScratchWorktree({ base });
    const launch = launchCatalog(harness, tree, selector)[name];
    if (launch.settingsDeny === false) {
      const path = join(tree.scratch, ".claude/settings.json");
      const settings = JSON.parse(readFileSync(path, "utf8"));
      settings.permissions.deny = [];
      writeFileSync(path, JSON.stringify(settings, null, 2) + "\n");
    }
    const aliases = tree.aliases;
    const record = {
      schemaVersion: 1,
      workOrder: "WO-044",
      harness,
      launch: name,
      question: launch.question,
      observedAt: new Date().toISOString(),
      version,
      actor: {
        harness: harness === "claude" ? "claude-code" : "codex-cli",
        ...launchSelectors(harness, launch.args ?? []),
        source: "launch-selector",
      },
      effectiveEffort: "unobserved",
      rawTranscriptRetained: false,
      userScopeSettingsWritten: false,
    };
    if (launch.surface) {
      Object.assign(record, {
        surface: await isolated("help", (env) => helpSurface(binary, env)),
      });
    } else if (launch.background) {
      // Claude only: the Codex catalog has no background launch, and its
      // several invocations would otherwise share one home.
      Object.assign(record, {
        background: await backgroundSession(
          binary,
          tree,
          selector,
          callerEnv,
          aliases,
          timing,
        ),
      });
      record.actor = { ...record.actor, model: selector.model, effort: "low" };
    } else if (launch.concurrent) {
      const runs = await Promise.all(
        Array.from({ length: launch.concurrent }, (_, index) =>
          isolated(`concurrent-${index + 1}`, (env) =>
            runProcess({
              binary,
              args: launch.args,
              cwd: tree.scratch,
              env,
              timeoutMs: 180_000,
            }),
          ),
        ),
      );
      Object.assign(record, {
        argsShape: sanitizeArgs(launch.args, aliases),
        concurrent: runs.map((run) => ({
          exitCode: run.exitCode,
          signal: run.signal,
          durationMs: run.durationMs,
          markers: streamSummary(run.stdout).finalMarkers,
          rateLimitSignals: streamSummary(run.stdout).rateLimitSignals,
          authenticationUnavailable: streamSummary(run.stdout)
            .authenticationUnavailable,
        })),
      });
    } else {
      const encoded = sessionDirectoryEncoded(tree.scratch);
      const sessionDirectory = join(
        callerEnv.HOME ?? homedir(),
        ".claude",
        "projects",
        encoded,
      );
      const before = existsSync(sessionDirectory)
        ? readdirSync(sessionDirectory).length
        : 0;
      const killWhen = launch.killWhenEdited
        ? () => {
            const observed = observeScratch(tree);
            return (
              observed.fixtureEdited ||
              observed.insideWritten ||
              observed.hookEvents.some(
                (e) =>
                  e.event === "PreToolUse" &&
                  ["Edit", "Write", "apply_patch"].includes(e.tool),
              )
            );
          }
        : null;
      const run = await isolated("exec", (env) =>
        runProcess({
          binary,
          args: launch.args,
          cwd: tree.scratch,
          env,
          timeoutMs: launch.timeoutMs ?? 300_000,
          detached: Boolean(launch.detached),
          killWhen,
        }),
      );
      const after = existsSync(sessionDirectory)
        ? readdirSync(sessionDirectory).length
        : 0;
      const observed = observeScratch(tree);
      Object.assign(record, {
        argsShape: sanitizeArgs(launch.args, aliases),
        exitCode: run.exitCode,
        signal: run.signal,
        spawnError: run.spawnError,
        killed: run.killed,
        timedOut: run.timedOut,
        durationMs: run.durationMs,
        detached: Boolean(launch.detached),
        stream: streamSummary(run.stdout),
        stderrSignals: {
          authenticationUnavailable:
            /not logged in|authentication_failed|login required|unauthenticated/i.test(
              run.stderr ?? "",
            ),
          networkUnavailable:
            /ENOTFOUND|ECONNREFUSED|ECONNRESET|CONNECT tunnel|tunnel failed|network is unreachable|proxy|failed to connect|fetch failed/i.test(
              `${run.stdout}${run.stderr}`,
            ),
          configRejected:
            /unknown field|invalid|unrecognized|error parsing/i.test(
              run.stderr ?? "",
            ),
          hookTrust:
            /untrusted|not trusted|hook.{0,60}trust|trust.{0,60}hook/i.test(
              `${run.stdout}${run.stderr}`,
            ),
        },
        worktree: {
          fixtureEdited: observed.fixtureEdited,
          insideWritten: observed.insideWritten,
          testRan: observed.testRan,
          hookDeniedFileAbsent: observed.hookDeniedFileAbsent,
          settingsDeniedFileAbsent: observed.settingsDeniedFileAbsent,
          siblingWritten: observed.siblingWritten,
          statusCodes: observed.worktreeStatusCodes,
        },
        hooks: {
          eventNames: observed.hookEventNames,
          runtimeImports: observed.hookRuntimeImports,
          projectDirVariable: observed.hookProjectDirVariable,
          refusals: observed.hookRefusals,
          events: observed.hookEvents.map((e) => ({
            event: e.event,
            ...(e.tool ? { tool: e.tool } : {}),
            fields: e.fields,
            decision: e.decision,
            runtimeImport: e.runtimeImport,
          })),
        },
        ...(launch.persistence
          ? {
              sessionPersistence: {
                filesBefore: before,
                filesAfter: after,
                persisted: after > before,
              },
            }
          : {}),
      });
      if (launch.recovery) {
        // This probe store preserves the observed worktree state, not a vendor
        // conversation. The launch profiles deliberately disable persistence.
        const saved = join(tree.runtimeDirectory, "recovery.json");
        writeFileSync(
          saved,
          JSON.stringify({ worktree: record.worktree, actor: record.actor }),
        );
        const persisted = JSON.parse(readFileSync(saved, "utf8"));
        const recoveryArgs = [
          ...launch.args.slice(0, -1),
          "Read fixture.txt and report its current state, then finish the bounded edit to after if needed. Do not modify other files or settings. Reply RESUMED_OK.",
        ];
        const recovered = await isolated("recovery", (env) =>
          runProcess({
            binary,
            args: recoveryArgs,
            cwd: tree.scratch,
            env,
            detached: true,
            timeoutMs: 120_000,
          }),
        );
        const afterRecovery = observeScratch(tree);
        record.recovery = {
          mode: "fresh-episode-on-preserved-worktree",
          persistedStateRead: Boolean(persisted.worktree),
          argsShape: sanitizeArgs(recoveryArgs, aliases),
          actor: {
            ...launchSelectors(harness, recoveryArgs),
            source: "launch-selector",
          },
          exitCode: recovered.exitCode,
          signal: recovered.signal,
          timedOut: recovered.timedOut,
          stream: streamSummary(recovered.stdout),
          worktree: {
            fixtureEdited: afterRecovery.fixtureEdited,
            insideWritten: afterRecovery.insideWritten,
            statusCodes: afterRecovery.worktreeStatusCodes,
          },
          conversationRecovery:
            "unavailable: launch profile disables session persistence; transport worker-store recovery not exercised",
        };
      }
    }
    if (codex) {
      // Observed for Codex from each invocation's isolation digests; Claude
      // remains a claim.
      record.codexEpisodes = codexEpisodes;
      record.userScopeSettingsWritten = codexEpisodes.some(
        (episode) => !codex.codexDigestPairEqual(episode.userConfig),
      );
    }
    writeFileSync(target, JSON.stringify(record, null, 2) + "\n");
    written.push(target);
    process.stdout.write(`${basename(target)}: ${summaryLine(record)}\n`);
  }
  return written;
}
function summaryLine(record) {
  if (record.surface)
    return `help parsed; scheduler subcommand ${record.surface.schedulerSubcommand}`;
  if (record.background)
    return `background steps ${record.background.steps.length}; available ${record.background.available}`;
  if (record.concurrent)
    return `concurrent exits ${record.concurrent.map((r) => r.exitCode).join(",")}`;
  return `exit ${record.exitCode ?? record.signal}; edited ${record.worktree.fixtureEdited}; hook events ${record.hooks.eventNames.join("/") || "none"}`;
}

/* ------------------------------------------------------------------------ */
/* Rows: each question, judged from a launch record.                          */
/* ------------------------------------------------------------------------ */
const ran = (r) =>
  r &&
  r.spawnError === null &&
  !r.stream?.authenticationUnavailable &&
  !r.stderrSignals?.authenticationUnavailable &&
  !(r.stderrSignals?.networkUnavailable && r.exitCode !== 0);
const operationRows = (r, operation) =>
  (r?.stream?.operations ?? []).filter((row) => row.operation === operation);
const wasDenied = (r, operation) =>
  operationRows(r, operation).some(
    (row) => row.requested && row.outcome === "denied",
  );
const residentJudgment = (r) => {
  if (!ran(r)) return ["blocked", blockedReason(r)];
  if (!r.killed || r.signal !== "SIGKILL")
    return [
      "unavailable",
      `the detached writing episode did not reach a confirmed SIGKILL (exit ${r.exitCode ?? r.signal}; timeout ${r.timedOut}); worktree edit ${r.worktree.fixtureEdited}; recovery ${r.recovery?.exitCode ?? "not run"}`,
    ];
  return [
    "observed",
    `the external detached parent delivered SIGKILL; exit ${r.exitCode ?? r.signal}; worktree edit ${r.worktree.fixtureEdited}, inside write ${r.worktree.insideWritten}, status ${r.worktree.statusCodes.join(", ") || "clean"}; fresh recovery from the preserved worktree exited ${r.recovery?.exitCode ?? r.recovery?.signal ?? "not run"}, edit after recovery ${r.recovery?.worktree?.fixtureEdited ?? "unobserved"}. Vendor conversation and transport worker-store recovery remain unavailable in this ephemeral profile.`,
  ];
};
const blockedReason = (r) =>
  !r
    ? "launch not run"
    : r.spawnError
      ? "the harness executable did not start"
      : r.stream?.authenticationUnavailable ||
          r.stderrSignals?.authenticationUnavailable
        ? "authentication was unavailable to the launch (a sandboxed session cannot read the harness credential store)"
        : "the launch could not reach its provider (network egress unavailable to the session)";
function judge(harness) {
  const worker = harness === "claude" ? "allowed-tools" : "workspace-write";
  const P = harness === "claude" ? "C" : "X";
  const rows = [];
  const row = (id, question, launch, judgeFn) =>
    rows.push({ id: `${P}-${id}`, question, launch, judgeFn });
  if (harness === "claude") {
    row(
      "W1",
      "Which tool-allowlist form admits editing and a bounded shell: `--tools` names alone",
      "tools-only",
      (r) =>
        !ran(r)
          ? ["blocked", blockedReason(r)]
          : [
              ["fixture-edit", "inside-write", "fixture-test"].every(
                (operation) => wasDenied(r, operation),
              ) ||
              (r.worktree.fixtureEdited &&
                r.worktree.insideWritten &&
                r.worktree.testRan)
                ? "observed"
                : "ambiguous",
              `with only --tools and no allow rule, the edit ${r.worktree.fixtureEdited ? "happened" : "did not happen"}, the write ${r.worktree.insideWritten ? "happened" : "did not happen"} and the bounded shell command ${r.worktree.testRan ? "ran" : "did not run"}; ${r.stream.refusalSignals} aggregate refusal signals do not establish a particular operation's cause`,
            ],
    );
    row(
      "W2",
      "Which tool-allowlist form admits editing and a bounded shell: `--tools` plus `--allowedTools` with an exact Bash pattern",
      "allowed-tools",
      (r) =>
        !ran(r)
          ? ["blocked", blockedReason(r)]
          : [
              "observed",
              `with --allowedTools Edit,Write,Read,Bash(node fixture-test.mjs) the edit ${r.worktree.fixtureEdited ? "happened" : "did not happen"}, the write ${r.worktree.insideWritten ? "happened" : "did not happen"} and the allowed command ${r.worktree.testRan ? "ran" : "did not run"}`,
            ],
    );
  } else {
    row(
      "W1",
      "`workspace-write` sandbox: does exec mode edit and write inside the worktree",
      "workspace-write",
      (r) =>
        !ran(r)
          ? ["blocked", blockedReason(r)]
          : [
              "observed",
              `the edit ${r.worktree.fixtureEdited ? "happened" : "did not happen"}, the write ${r.worktree.insideWritten ? "happened" : "did not happen"} and the fixture command ${r.worktree.testRan ? "ran" : "did not run"} under approval never`,
            ],
    );
    row(
      "W2",
      "Named filesystem permission profile granting write on the workspace roots",
      "named-profile",
      (r) =>
        !ran(r)
          ? ["blocked", blockedReason(r)]
          : r.stderrSignals.configRejected && !r.worktree.fixtureEdited
            ? [
                "ambiguous",
                "the named permission profile was not accepted as written; no edit happened",
              ]
            : [
                "observed",
                `under the named write profile the edit ${r.worktree.fixtureEdited ? "happened" : "did not happen"} and the sibling write ${r.worktree.siblingWritten ? "happened" : "did not happen"}`,
              ],
    );
  }
  row(
    "W3",
    harness === "claude"
      ? "Does the scratch project's `permissions.deny` apply in print mode"
      : "Does a project hook refuse a fixture command in exec mode",
    harness === "claude" ? "settings-deny" : worker,
    (r, records) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : harness === "claude"
          ? r.worktree.settingsDeniedFileAbsent &&
            wasDenied(r, "settings-fixture") &&
            records.get("claude-settings-control")?.worktree
              ?.settingsDeniedFileAbsent === false
            ? [
                "observed",
                "the exact otherwise-allowed command was requested and denied; the matched control without permissions.deny created the file, establishing the settings rule's effect",
              ]
            : r.worktree.settingsDeniedFileAbsent
              ? [
                  "ambiguous",
                  "the file was not created; operation-specific denial and a successful matched control are both required to attribute this to the settings rule",
                ]
              : [
                  "observed",
                  "the deny rule did not apply: the fixture file was created",
                ]
          : r.hooks.refusals > 0 && r.worktree.hookDeniedFileAbsent
            ? ["observed", "the project hook refused the fixture command"]
            : r.hooks.eventNames.length === 0
              ? [
                  "unavailable",
                  `no hook event was recorded${r.stderrSignals.hookTrust ? " and the harness reported hook trust" : ""}; the fixture file ${r.worktree.hookDeniedFileAbsent ? "was not" : "was"} created`,
                ]
              : [
                  "ambiguous",
                  "hook events were recorded but no refusal was recorded",
                ],
  );
  row(
    "W4",
    harness === "claude"
      ? "Does a generated-shape PreToolUse hook under the worktree fire and refuse in print mode"
      : "Which hook events fire in exec mode",
    worker,
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : r.hooks.eventNames.length === 0
          ? [
              "unavailable",
              `no hook event fired for the launch${r.stderrSignals.hookTrust ? " (hook trust reported)" : ""}`,
            ]
          : r.hooks.refusals > 0 && r.worktree.hookDeniedFileAbsent
            ? [
                "observed",
                `hook events ${r.hooks.eventNames.join(", ")} fired; the refusal held and the fixture file was not created`,
              ]
            : [
                "observed",
                `hook events ${r.hooks.eventNames.join(", ")} fired; refusals recorded: ${r.hooks.refusals}; fixture file absent: ${r.worktree.hookDeniedFileAbsent}`,
              ],
  );
  row(
    "W5",
    "Can a hook under the worktree import a runtime by an absolute `file://` path",
    worker,
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : r.hooks.runtimeImports.includes("ok")
          ? [
              "observed",
              `the hook imported the runtime from outside the worktree by file:// URL${r.hooks.projectDirVariable ? "; CLAUDE_PROJECT_DIR was set" : ""}`,
            ]
          : r.hooks.eventNames.length === 0
            ? ["unavailable", "no hook ran, so the import was not exercised"]
            : ["observed", "the hook ran but the absolute import failed"],
  );
  row(
    "W6",
    "Is a write inside the worktree admitted and a write to a sibling directory refused",
    worker,
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : [
            r.worktree.siblingWritten || wasDenied(r, "sibling-write")
              ? "observed"
              : "ambiguous",
            `inside write ${r.worktree.insideWritten ? "happened" : "did not happen"}; sibling write ${r.worktree.siblingWritten ? "happened (not confined; the sibling lies under the OS temporary directory, which a harness sandbox may treat as writable by default)" : "did not happen"}; matched sibling requests ${operationRows(r, "sibling-write").length}, matched denial ${wasDenied(r, "sibling-write")}; an absent effect alone does not establish containment`,
          ],
  );
  row(
    "W7",
    "Which instruction surfaces load; is there a worktree-local surface for a bundle's marked block",
    worker,
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : r.stream.finalMarkers.filter((m) =>
              m.startsWith("INSTRUCTION_MARKER"),
            ).length
          ? [
              "observed",
              `markers echoed: ${r.stream.finalMarkers.filter((m) => m.startsWith("INSTRUCTION_MARKER")).join(", ")}; the marked block in CLAUDE.md ${r.stream.finalMarkers.includes("INSTRUCTION_MARKER_BLOCK") ? "was" : "was not"} visible`,
            ]
          : [
              "ambiguous",
              "no instruction marker was echoed in the final response",
            ],
  );
  row(
    "W8",
    harness === "claude"
      ? "What does the structured result envelope look like with tools enabled"
      : "What does the JSONL result look like with tools enabled",
    worker,
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : r.stream.messageCount
          ? [
              "observed",
              `message types ${r.stream.messageTypes.join(", ")}; ${harness === "claude" ? `result fields ${Object.keys(r.stream.resultShape ?? {}).join(", ") || "none"}` : "final agent message captured"}`,
            ]
          : ["ambiguous", "no structured message was parsed from stdout"],
  );
  if (harness === "claude")
    row(
      "W9",
      "Does `--no-session-persistence` leave no session file for the worktree",
      worker,
      (r) =>
        !ran(r)
          ? ["blocked", blockedReason(r)]
          : r.sessionPersistence
            ? [
                "observed",
                r.sessionPersistence.persisted
                  ? "a session file appeared under the user session store despite the flag"
                  : "no session file appeared under the user session store",
              ]
            : ["unavailable", "persistence was not checked for this launch"],
    );
  row(
    "W10",
    "Which hook events fire for the scripted initial prompt, and does the hook input mark a non-interactive session",
    worker,
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : (() => {
            const prompt = r.hooks.events.find(
              (e) => e.event === "UserPromptSubmit",
            );
            if (!prompt)
              return [
                "unavailable",
                `no UserPromptSubmit event fired; events: ${r.hooks.eventNames.join(", ") || "none"}`,
              ];
            const fields = Object.keys(prompt.fields ?? {});
            const interactive = fields.filter((f) =>
              /interactive|tty|headless|print|source|origin/i.test(f),
            );
            return [
              "observed",
              `UserPromptSubmit fired with fields ${fields.join(", ")}; permission_mode ${prompt.fields?.permission_mode ?? "absent"}; ${interactive.length ? `fields suggesting session origin: ${interactive.join(", ")}` : "no field names a non-interactive origin"}`,
            ];
          })(),
  );
  row(
    "K1",
    "SIGKILL mid-episode (operator-launched): harness exit and worktree state",
    "kill",
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : r.killed
          ? [
              "observed",
              `killed after the first write signal; signal ${r.signal}; fixture edited ${r.worktree.fixtureEdited}; inside written ${r.worktree.insideWritten}; status codes ${r.worktree.statusCodes.join(" ") || "clean"}`,
            ]
          : [
              "ambiguous",
              `the episode finished before a write signal was seen (exit ${r.exitCode})`,
            ],
  );
  row(
    "U1",
    "Detached launch with no terminal and the operator's stored authentication; authentication lifetime",
    "detached",
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : r.stream.finalMarkers.includes("DETACHED_OK") || r.exitCode === 0
          ? [
              "observed",
              `the detached process completed (exit ${r.exitCode}); lifetime before a login is demanded is not measurable in one launch and stays unknown`,
            ]
          : [
              "ambiguous",
              `the detached process exited ${r.exitCode ?? r.signal} without the expected marker`,
            ],
  );
  row(
    "U2",
    "Permission or approval request with no terminal: refused, hung or auto-denied",
    harness === "claude" ? "prompt-no-terminal" : "approval-no-terminal",
    (r) =>
      !ran(r)
        ? ["blocked", blockedReason(r)]
        : r.worktree.testRan
          ? ["observed", "the command ran with no terminal attached"]
          : wasDenied(r, "fixture-test")
            ? [
                "observed",
                `the exact fixture command was requested and a matched denial was recorded (exit ${r.exitCode} after ${Math.round((r.durationMs ?? 0) / 1000)} s); the file effect did not occur`,
              ]
            : [
                "ambiguous",
                `the fixture effect did not occur and no matched request/denial establishes permission behavior; ${r.timedOut ? "the launch timed out" : `the launch exited ${r.exitCode}`}`,
              ],
  );
  row(
    "U3",
    "Scheduled-task or cron surface; whether a scheduled launch loads the worktree's settings and hooks",
    "surface",
    (r) =>
      !r
        ? ["unavailable", "help was not captured"]
        : r.surface.schedulerSubcommand
          ? [
              "observed",
              "a scheduler subcommand exists in the installed help; loading of worktree settings by a scheduled launch was not exercised",
            ]
          : [
              "unavailable",
              `no scheduler subcommand in the installed help; ${r.surface.backgroundLaunch ? "background session launch exists" : "no background launch"}${r.surface.backgroundSessionCommands.length ? ` with ${r.surface.backgroundSessionCommands.join("/")}` : ""}${r.surface.daemonOrAppServer ? "; a daemon or app-server surface is listed" : ""}; whether a scheduled launch loads worktree settings is untested`,
            ],
  );
  if (harness === "claude") {
    row("U4", "Idle cost of a session left open", "background", (r) =>
      !r || !r.background.available
        ? [
            "unavailable",
            r
              ? (r.background.reason ?? "background session unavailable")
              : "launch not run",
          ]
        : (() => {
            const samples =
              r.background.steps.find((s) => s.name === "idle-samples")
                ?.samples ?? [];
            const idle = r.background.steps.find(
              (s) => s.name === "idle-samples",
            );
            return samples.length
              ? [
                  "observed",
                  `idle resident process sampled ${samples.length} times: max rss ${Math.max(...samples.map((s) => s.rssKb))} KB, max cpu ${Math.max(...samples.map((s) => s.cpuPercent))}%`,
                ]
              : [
                  "unavailable",
                  idle?.samplerAvailable === false
                    ? "the process sampler was unavailable to the probe, so idle cost was not measured"
                    : "the background listing exposed no process id, so idle cost was not sampled",
                ];
          })(),
    );
    row("U5", "Concurrent session limit observed", "concurrent", (r) =>
      !r
        ? ["blocked", blockedReason(r)]
        : r.concurrent.some((c) => c.authenticationUnavailable)
          ? ["blocked", "authentication was unavailable"]
          : [
              "observed",
              `${r.concurrent.filter((c) => c.exitCode === 0).length} of ${r.concurrent.length} concurrent launches completed; rate-limit status messages ${r.concurrent.reduce((n, c) => n + c.rateLimitSignals, 0)} (routine status, not a refusal); no limit was reached at this count`,
            ],
    );
    row(
      "U6",
      "SIGKILL of a resident-launched episode and its recovery",
      "resident-kill",
      residentJudgment,
    );
  } else {
    row("U4", "Idle cost of a session left open", "surface", (r) => [
      "unavailable",
      "exec mode leaves no resident session open; the app-server daemon surface was not exercised",
    ]);
    row("U5", "Concurrent session limit observed", "concurrent", (r) =>
      !r
        ? ["blocked", blockedReason(r)]
        : r.concurrent.some((c) => c.authenticationUnavailable)
          ? ["blocked", "authentication was unavailable"]
          : [
              "observed",
              `${r.concurrent.filter((c) => c.exitCode === 0).length} of ${r.concurrent.length} concurrent launches completed; rate-limit status messages ${r.concurrent.reduce((n, c) => n + c.rateLimitSignals, 0)} (routine status, not a refusal); no limit was reached at this count`,
            ],
    );
    row(
      "U6",
      "SIGKILL of a resident-launched episode and its recovery",
      "resident-kill",
      residentJudgment,
    );
  }
  return rows;
}

/* ------------------------------------------------------------------------ */
/* Report.                                                                    */
/* ------------------------------------------------------------------------ */
const commandShape = (record) =>
  record?.argsShape
    ? `${record.harness} ${record.argsShape.filter((a) => a.length < 200).join(" ")}`
    : record?.background
      ? `${record.harness} ${record.background.form ?? "--bg --print (attempted); --bg (attempted)"} ...; agents --json`
      : record?.surface
        ? `${record.harness} --help`
        : "not run";
export function renderReport({ out = findLaunchpad(), date }) {
  const directory = join(
    out,
    docRelative(out, "discovery", `writing-worker-smoke-${date}`),
  );
  const files = existsSync(directory)
    ? readdirSync(directory)
        .filter((n) => n.endsWith(".json"))
        .sort()
    : [];
  const records = new Map(
    files
      .map((name) => {
        const record = JSON.parse(readFileSync(join(directory, name), "utf8"));
        return [
          `${record.harness}-${record.launch}`,
          { ...record, runFile: name },
        ];
      })
      .sort((a, b) => a[1].observedAt.localeCompare(b[1].observedAt)),
  );
  const rows = [];
  for (const harness of ["claude", "codex"])
    for (const row of judge(harness)) {
      const record = records.get(`${harness}-${row.launch}`) ?? null;
      const [label, observation] = row.judgeFn(record, records);
      rows.push({
        id: row.id,
        harness,
        version:
          record?.version.match(/\d+\.\d+\.\d+/)?.[0] ??
          record?.version ??
          "not run",
        question: row.question,
        ...(row.id === "C-W3" && records.get("claude-settings-control")
          ? {
              supportingRun: `writing-worker-smoke-${date}/${records.get("claude-settings-control").runFile}`,
            }
          : {}),
        label,
        observation,
        command: commandShape(record),
        run: record ? `writing-worker-smoke-${date}/${record.runFile}` : null,
      });
    }
  const counts = Object.fromEntries(
    LABELS.map((l) => [l, rows.filter((r) => r.label === l).length]),
  );
  const versions = [
    ...new Set(
      [...records.values()].map(
        (r) =>
          `${r.harness === "claude" ? "Claude Code" : "Codex CLI"} ${r.version.match(/\d+\.\d+\.\d+/)?.[0] ?? r.version}`,
      ),
    ),
  ];
  const selectors = [
    ...new Set(
      [...records.values()].flatMap((r) => {
        const launches = r.argsShape
          ? [launchSelectors(r.harness, r.argsShape)]
          : (r.background?.steps ?? []).flatMap((step) =>
              step.actor ? [step.actor] : [],
            );
        return launches
          .filter((actor) => actor.model !== "not-selected")
          .map((actor) => `${r.harness}: ${actor.model} at ${actor.effort}`);
      }),
    ),
  ];
  const md = [
    `# Writing-worker and unattended-launch harness truth — ${date} (WO-044)`,
    "",
    "These rows precede any target-bundle, transport-profile or resident-launcher rule. `scripts/harness-probe.mjs --writing-worker <harness>` created a fresh scratch Git worktree outside this checkout for every launch, with one fixture file, one trivial test script, a project `permissions.deny` rule, one generated-shape PreToolUse hook that imports its runtime by an absolute `file://` URL from outside the worktree and refuses a fixture command, and the instruction surfaces `CLAUDE.md` (with a marked block), `CLAUDE.local.md`, `.claude/CLAUDE.md` and `AGENTS.md`. Launches used the operator's own authentication through the harness's unsandboxed command request from the executor session. Hook inputs and result messages were reduced to field names and value shapes at collection; run files retain no raw transcripts, absolute paths, session identifiers or host names. Repaired detached launches delete their temporary raw spools in finally; the original detached observations retained spools at collection; repair removed the two identified owned spools and records that correction in their run files. Labels are `observed`, `blocked`, `unavailable` or `ambiguous`; every row names the command shape it ran and its run file.",
    "",
    `Installed harnesses: ${versions.length ? versions.join("; ") : "none run yet"}. Selectors derived from each saved launch or step: ${selectors.join("; ") || "none"}; effort labels are launch selectors, not effective-session readback. Row counts: ${LABELS.map((l) => `${counts[l]} ${l}`).join(", ")}.`,
    "",
    "| Row | Harness | Question | Label | Observation and limit | Command shape |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows.map(
      (r) =>
        `| <a id="${r.id}"></a>${r.id} | ${r.harness === "claude" ? "Claude Code" : "Codex CLI"} ${r.version} | ${r.question} | ${r.label} | ${r.observation.replace(/\|/g, "\\|")}${r.supportingRun ? `; [matched control](${r.supportingRun})` : ""} | \`${r.command.replace(/`/g, "'")}\` |`,
    ),
    "",
    "Each launch's complete field/shape tree is in its run file under the dated directory. A `blocked` row records a launch that could not run (no executable or no authentication); an `unavailable` row records a surface the installed harness does not expose or a signal the launch did not produce; an `ambiguous` row records contradictory or insufficient signals. WO-049, WO-051 and WO-068 design from these labels; an unavailable row is a valid result.",
    "",
  ].join("\n");
  writeFileSync(
    join(out, docRelative(out, "discovery", `writing-worker-smoke-${date}.md`)),
    md,
  );
  const index = {
    schemaVersion: 1,
    workOrder: "WO-044",
    record: docRelative(out, "discovery", `writing-worker-smoke-${date}.md`),
    runs: files.map((name) =>
      docRelative(out, "discovery", `writing-worker-smoke-${date}/${name}`),
    ),
    rows: rows.map(({ id, harness, label, run, supportingRun }) => ({
      id,
      harness,
      label,
      run,
      ...(supportingRun ? { supportingRun } : {}),
    })),
    counts,
  };
  writeFileSync(
    join(
      out,
      docRelative(out, "discovery", `writing-worker-smoke-${date}.json`),
    ),
    JSON.stringify(index, null, 2) + "\n",
  );
  // Dated addendum in environment.md, replaced idempotently between markers.
  const environmentPath = docPath(out, "discovery", "environment.md");
  if (existsSync(environmentPath)) {
    const start = "<!-- dotln-wo044-addendum:start -->";
    const end = "<!-- dotln-wo044-addendum:end -->";
    const block = [
      start,
      `## WO-044 writing-worker and unattended-launch addendum (${date})`,
      "",
      `The [writing-worker record](writing-worker-smoke-${date}.md) and its [index](writing-worker-smoke-${date}.json) carry ${rows.length} labeled rows (${LABELS.map((l) => `${counts[l]} ${l}`).join(", ")}) observed with ${versions.length ? versions.join(" and ") : "no harness run yet"}. Each launch ran in a fresh scratch worktree outside this checkout with the operator's authentication through the harness's unsandboxed request, and every row cites its command shape and run file; paths, session identifiers and host names were reduced to shapes at collection. Earlier observations above remain time-indexed and unchanged. Requested model and effort are launch selectors, not effective-session readback.`,
      end,
    ].join("\n");
    const text = readFileSync(environmentPath, "utf8");
    const next = text.includes(start)
      ? text.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block)
      : `${text.trimEnd()}\n\n${block}\n`;
    if (next !== text) writeFileSync(environmentPath, next);
  }
  // One-line disposition answering the planning map's checkpoint note.
  const mapPath = docPath(out, "planning", "work-order-map.md");
  if (existsSync(mapPath)) {
    const marker = "<!-- dotln-wo044-disposition -->";
    const line = `${marker} **WO-044 checkpoint disposition (${date}):** the writing-worker record is filed at [writing-worker-smoke-${date}.md](../discovery/writing-worker-smoke-${date}.md) with ${LABELS.map((l) => `${counts[l]} ${l}`).join(", ")} rows; the first mandatory replan checkpoint is now open for the next planning pass, which designs WO-049, WO-051 and WO-068 from those labels.`;
    const text = readFileSync(mapPath, "utf8");
    const next = text.includes(marker)
      ? text.replace(new RegExp(`${marker}[^\\n]*`), line)
      : text.replace(
          /(The first mandatory replan checkpoint follows WO-044's record\.[^\n]*\n)/,
          `$1\n${line}\n`,
        );
    if (next !== text) writeFileSync(mapPath, next);
  }
  return { rows, counts, index };
}
