import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { copilotShape } from "../fixtures/copilot-probe-hook.mjs";
import { runProcess } from "./writing-worker-probe.mjs";
import {
  sessionTranscript,
  decodeUsageSource,
  usageObservation,
} from "../../packages/skeleton/src/usage-observation.mjs";

const repository = resolve(import.meta.dirname, "../..");
const events = {
  SessionStart: "sessionStart",
  UserPromptSubmit: "userPromptSubmitted",
  PreToolUse: "preToolUse",
  PostToolUse: "postToolUse",
  Stop: "agentStop",
};
export const copilotLaunchRows = [
  {
    id: "P1",
    trust: false,
    forms: ["claude", "native"],
    permissions: "tools",
    model: "default",
  },
  {
    id: "P2",
    trust: true,
    forms: ["claude"],
    permissions: "tools",
    model: "default",
  },
  {
    id: "P3",
    trust: true,
    forms: ["native"],
    permissions: "tools",
    model: "default",
  },
  {
    id: "P4",
    trust: true,
    forms: ["claude", "native"],
    permissions: "tools",
    model: "default",
    child: true,
  },
  {
    id: "P5",
    trust: true,
    forms: ["claude", "native"],
    permissions: "all",
    model: "default",
  },
  {
    id: "P6",
    trust: true,
    forms: ["claude"],
    permissions: "all",
    model: "auto",
  },
];
const write = (directory, path, text) => {
  mkdirSync(dirname(join(directory, path)), { recursive: true });
  writeFileSync(join(directory, path), text, { mode: 0o600 });
};
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const readLines = (path) => {
  let invalidLines = 0;
  const rows = existsSync(path)
    ? readFileSync(path, "utf8")
        .split("\n")
        .filter(Boolean)
        .flatMap((line) => {
          try {
            return [JSON.parse(line)];
          } catch {
            invalidLines++;
            return [];
          }
        })
    : [];
  return { rows, invalidLines };
};
const safeValue = (value) =>
  typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/.test(value)
    ? value
    : null;
const containedTemp = (directory) => {
  const physical = realpathSync(directory);
  assert.ok(
    physical.startsWith(`${realpathSync(tmpdir())}${sep}`),
    "Copilot probe requires a system-temporary scratch directory",
  );
  assert.ok(
    physical !== repository && !physical.startsWith(`${repository}${sep}`),
    "Never probe in DotLn",
  );
  return physical;
};

export function prepareCopilotScratch(
  row,
  { hostModule, base = tmpdir() } = {},
) {
  assert.ok(/^P(?:[1-9]|10)$/.test(row.id) || row.id === "interactive");
  const parent = realpathSync(base);
  assert.ok(
    parent === realpathSync(tmpdir()) ||
      parent.startsWith(`${realpathSync(tmpdir())}${sep}`),
    "scratch base must be system-temporary",
  );
  const directory = containedTemp(
    mkdtempSync(join(parent, "dotln-copilot-probe-")),
  );
  const home = join(directory, "cli-home");
  mkdirSync(home);
  const init = spawnSync("git", ["init", "--quiet", directory], {
    encoding: "utf8",
  });
  assert.equal(init.status, 0, init.stderr);
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
    join(repository, "scripts/fixtures/copilot-probe-hook.mjs"),
    join(directory, "probe-hook.mjs"),
  );
  write(
    directory,
    "probe-runtime.json",
    json({ hostModule: hostModule ?? null }),
  );
  write(directory, "probe-row.json", json(row));
  write(directory, "fixture.txt", "before\n");
  write(
    directory,
    "CLAUDE.md",
    "# Isolated public fixture\n\nInclude INSTRUCTION_OBSERVED in your final answer. Work only in this scratch repository. Do not inspect credentials, personal settings, other repositories or the network. Use only the named fixture skill. Never commit or publish.\n",
  );
  symlinkSync("CLAUDE.md", join(directory, "AGENTS.md"));
  write(
    directory,
    ".agents/skills/dotln-probe/SKILL.md",
    "---\nname: dotln-probe\ndescription: Execute the isolated Copilot hook fixture when asked for dotln-probe.\n---\n\nRead fixture.txt with the file read tool. Edit its one line from before to after with the edit or patch tool. Create created.txt containing fixture with the create or patch tool. Run node shell-identity.mjs. Attempt each of these exact shell commands once, in separate tool calls; a refusal is expected, never retry or use another route:\n\n" +
      ["claude-deny", "claude-error", "native-deny", "native-error"]
        .map((name) => `- \`printf fixture > ${name}.txt\``)
        .join("\n") +
      "\n\nInclude SKILL_OBSERVED and any instruction or hook observation markers you actually received in the final answer. Do not repeat a marker you did not receive. No external reads, settings changes, network tools or publication.\n",
  );
  write(
    directory,
    "shell-identity.mjs",
    'import {writeFileSync} from "node:fs";\nwriteFileSync("shell-identity.json",JSON.stringify({sessionVariablePresent:typeof process.env.COPILOT_AGENT_SESSION_ID==="string",claudeProjectDirMatches:process.env.CLAUDE_PROJECT_DIR===process.cwd()}));\nwriteFileSync(".probe-session.json",JSON.stringify({sessionId:process.env.COPILOT_AGENT_SESSION_ID}),{mode:0o600});\n',
  );
  for (const form of row.forms) {
    const hooks = Object.fromEntries(
      Object.entries(events).map(([event, native]) => {
        const command =
          form === "claude"
            ? `node "$CLAUDE_PROJECT_DIR/probe-hook.mjs" claude ${event}`
            : `node '${join(directory, "probe-hook.mjs").replaceAll("'", "'\\''")}' native ${event}`;
        return form === "claude"
          ? [
              event,
              [
                {
                  ...(event.includes("Tool") ? { matcher: ".*" } : {}),
                  hooks: [{ type: "command", command, timeout: 10 }],
                },
              ],
            ]
          : [native, [{ type: "command", bash: command, timeoutSec: 10 }]];
      }),
    );
    write(
      directory,
      form === "claude" ? ".claude/settings.json" : ".github/hooks/probe.json",
      json(form === "claude" ? { hooks } : { version: 1, hooks }),
    );
  }
  // Disposable CLI home, never the operator's configuration or credentials.
  write(
    home,
    "settings.json",
    json({
      memory: false,
      includeCoAuthoredBy: false,
      autoUpdate: false,
    }),
  );
  write(
    home,
    "config.json",
    json({ trustedFolders: row.trust ? [directory] : [] }),
  );
  return { directory, home };
}

export function summarizeCopilotProbe(directory, row, result = {}) {
  containedTemp(directory);
  const hookLog = readLines(join(directory, "probe-events.jsonl"));
  const invocations = hookLog.rows;
  const counts = new Map();
  for (const event of invocations)
    if (event.correlation) {
      const key = `${event.registration}:${event.event}:${event.correlation}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  const sessions = join(directory, "cli-home/session-state");
  const sources = result.logs
    ? [{ rows: result.logs, invalidLines: 0 }]
    : existsSync(sessions)
      ? readdirSync(sessions, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => readLines(join(sessions, entry.name, "events.jsonl")))
      : [];
  const logs = sources.flatMap((source) => source.rows);
  const start = logs.find((entry) => entry.type === "session.start");
  const worktreeMatches = start?.data?.context?.cwd === directory;
  const usage =
    worktreeMatches && sources.length === 1 ? usageObservation(logs) : null;
  const text = logs
    .filter((entry) => entry.type === "assistant.message")
    .map((entry) =>
      typeof entry.data?.content === "string" ? entry.data.content : "",
    )
    .join("\n");
  const shell = join(directory, "shell-identity.json");
  const toolStarts = logs.filter(
    (entry) => entry.type === "tool.execution_start",
  );
  const attempts = Object.fromEntries(
    ["claude-deny", "claude-error", "native-deny", "native-error"].map(
      (name) => {
        const hooks = invocations.filter(
          (entry) => entry.attempt === name && entry.decision !== "observe",
        );
        const started = toolStarts.find(
          (entry) =>
            entry.data?.arguments?.command === `printf fixture > ${name}.txt`,
        );
        const completed =
          started &&
          logs.find(
            (entry) =>
              entry.type === "tool.execution_complete" &&
              entry.data?.toolCallId === started.data.toolCallId,
          );
        return [
          name,
          {
            hookAttempts: hooks.length,
            effectAbsent: !existsSync(join(directory, `${name}.txt`)),
            toolFailed: completed?.data?.success === false,
            // Absence alone proves neither denial nor an attempted call.
            denialObserved:
              hooks.length > 0 &&
              completed?.data?.success === false &&
              !existsSync(join(directory, `${name}.txt`)),
          },
        ];
      },
    ),
  );
  return {
    ...row,
    trustSource: "disposable config.json",
    observedAt: new Date().toISOString(),
    cliVersion: safeValue(start?.data?.copilotVersion),
    exitCode: result.exitCode ?? null,
    timedOut: result.timedOut ?? false,
    spawnError: safeValue(result.spawnError),
    durationMs: result.durationMs ?? null,
    authenticationUnavailable:
      /not logged in|authentication[_ -]?(?:failed|required|unavailable)|no authentication|no valid credentials/i.test(
        (result.stdout ?? "") + (result.stderr ?? ""),
      ),
    invalidLogLines:
      hookLog.invalidLines +
      sources.reduce((sum, source) => sum + source.invalidLines, 0),
    worktreeMatches,
    events: invocations.map(({ correlation: _correlation, ...entry }) => entry),
    maxInvocationsPerCorrelatedEvent: counts.size
      ? Math.max(...counts.values())
      : null,
    uncorrelatedInvocations: invocations.filter((entry) => !entry.correlation)
      .length,
    attempts,
    fixtureEdited:
      readFileSync(join(directory, "fixture.txt"), "utf8") === "after\n",
    fixtureCreated: existsSync(join(directory, "created.txt")),
    shellIdentity: existsSync(shell)
      ? JSON.parse(readFileSync(shell, "utf8"))
      : null,
    instructionObserved: text.includes("INSTRUCTION_OBSERVED"),
    skillObserved: text.includes("SKILL_OBSERVED"),
    instructionLoadedOnce: "untested",
    promptContext: Object.fromEntries(
      ["claude", "native"].map((form) => [
        form,
        text.includes(`${form.toUpperCase()}_CONTEXT_OBSERVED`),
      ]),
    ),
    stopMessageInOutput: Object.fromEntries(
      ["claude", "native"].map((form) => [
        form,
        (result.stdout ?? "").includes(`${form.toUpperCase()}_STOP_OBSERVED`),
      ]),
    ),
    modelChanges: worktreeMatches
      ? logs
          .filter((entry) => entry.type === "session.model_change")
          .map((entry) => ({
            model: safeValue(entry.data?.newModel),
            effort: safeValue(entry.data?.reasoningEffort),
            source: safeValue(entry.data?.source),
            fields: copilotShape(entry.data),
          }))
      : [],
    eventShapes: Object.fromEntries(
      [
        "session.start",
        "session.model_change",
        "session.shutdown",
        "session.usage_checkpoint",
        "model.model_call_success",
      ].flatMap((type) => {
        const entry = logs.filter((event) => event.type === type).at(-1);
        return entry ? [[type, copilotShape(entry.data)]] : [];
      }),
    ),
    approvalPrompts: "unknown",
    aiCredits: usage?.aiCredits ?? null,
    creditSource: usage?.creditSource ?? "unavailable",
    creditScope: usage?.creditScope ?? "unknown",
    creditObservedAt: usage?.creditObservedAt ?? null,
    rawTranscriptRetained: false,
    operatorSettingsWritten: false,
  };
}

export function renderCopilotProbe(record) {
  const interactive = record.interactive ?? [];
  const interactivePending =
    interactive.length < 2 ||
    interactive.some((row) => row.status === "reserved");
  const interactiveModelChange = interactive.some(
    (row) =>
      row.enteredBare &&
      row.status === "collected" &&
      row.modelChanges?.length > 1,
  );
  const rows = [
    ...record.rows,
    ...(record.interactive ?? []).filter((row) => row.events),
  ];
  const observed = (predicate) =>
    rows.some(predicate) ? "observed" : "not observed";
  const answers = [
    [
      "H1",
      "Registration and event counts",
      observed((row) => row.events.length),
      "Per-row events identify each registration. Original timestamp-only correlation maxima are ambiguous when simultaneous calls share a timestamp, not proof of duplicate handlers.",
    ],
    [
      "H2",
      "Hook project variable and cwd",
      observed((row) =>
        row.events.some((event) => event.claudeProjectDirMatches),
      ),
      "See claudeProjectDirMatches, copilotProjectDirMatches and hookCwdMatches, not the shell environment.",
    ],
    [
      "H3",
      "Payload field names",
      observed((row) => row.events.length),
      "Each event retains its field/type tree; no payload values or correlation keys are retained.",
    ],
    [
      "H4",
      "Tool names",
      observed((row) => row.events.some((event) => event.tool)),
      "Observed names only; absent tool names remain untested.",
    ],
    [
      "H5",
      "JSON denial and hook error",
      observed((row) =>
        Object.values(row.attempts).some((attempt) => attempt.denialObserved),
      ),
      `Judge each protocol and permission mode separately. Missing effects alone do not establish enforcement. Interactive rows are ${interactivePending ? "pending" : "collected"}.`,
    ],
    [
      "H6",
      "Prompt context",
      observed((row) => Object.values(row.promptContext).some(Boolean)),
      "Markers must occur in assistant messages, not just hook input or output.",
    ],
    [
      "H7",
      "Stop message",
      observed((row) => Object.values(row.stopMessageInOutput).some(Boolean)),
      "Output visibility, not lifecycle enforcement; operator-visible delivery must be separately attested.",
    ],
    [
      "H8",
      "Child hooks and identity",
      observed((row) => row.events.some((event) => event.childIdentityPresent)),
      "P4 and corrected P9 request one read-only child. A parent spawn is not a child tool event; missing child identity remains unknown.",
    ],
    [
      "H9",
      "Shell session variable",
      observed((row) => row.shellIdentity?.sessionVariablePresent),
      "Observed only when the fixture shell program ran; the hook variable is a separate fact.",
    ],
    [
      "H10",
      "Instructions and skill",
      observed((row) => row.instructionObserved && row.skillObserved),
      "AGENTS.md is a symlink. Marker delivery proves availability, not once-only loading; that count remains untested.",
    ],
    [
      "H11",
      "Writer owner and liveness",
      observed((row) => row.events.some((event) => event.owner?.alive)),
      "Uses harnessHostProcess and harnessProcessAlive; no process identifier is retained.",
    ],
    [
      "H12",
      "Model, effort and usage log",
      observed((row) => row.worktreeMatches && row.modelChanges.length),
      `Selected values and event shapes only. Auto is not a resolved model. A bare interactive mid-session change is ${interactiveModelChange ? "observed" : "pending"}.`,
    ],
  ];
  return [
    `# Copilot CLI phase-zero observations - ${record.date}`,
    "",
    `WO-146. Scripted model launches: ${record.launchesStarted}/12; each carries a 30-AI-credit soft cap. Installed version: ${record.installedVersion ?? "unknown"}.`,
    "Scratch repositories and CLI homes are system-temporary. No operator settings are written. No live CLI is part of a test gate. This is probe evidence, not workflow qualification.",
    ...(record.trustCorrection
      ? [
          "Correction: P1-P6 were collected with trustedFolders misplaced in settings.json. Their requested trust state was not established; preserve their no-hook observations, but do not use them to judge trusted hooks. P7-P10 use disposable config.json. No earlier observation was replaced.",
        ]
      : []),
    "",
    "| Anchor | Question | Result | Limit |",
    "| --- | --- | --- | --- |",
    ...answers.map(
      ([anchor, question, result, limit]) =>
        `| <a id="${anchor}"></a>${anchor} | ${question} | ${result} | ${limit} |`,
    ),
    "",
    "## Scripted rows",
    "",
    "| Row | Trust fixture | Registration | Permissions | Model selector | Exit | Wall-clock ms |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...record.rows.map(
      (row) =>
        `| ${row.id} | ${record.trustCorrection && !row.trustSource ? "not established" : row.trust ? "trusted selection" : "untrusted selection"} | ${row.forms.join(", ")} | ${row.permissions} | ${row.model} | ${row.exitCode ?? "unknown"} | ${row.durationMs ?? "unknown"} |`,
    ),
    "",
    `## Interactive rows - ${interactivePending ? "blocked awaiting operator observation" : "observations collected"}`,
    "",
    "H1, H5 and H12 require operator-observed sessions entered as bare `copilot` in scratch, including allow-all denial observations and a mid-session model change. Scripted rows and the implementing session are not substitutes. The four executor/fail/fix/pass episodes remain a separate qualification, not performed by this probe.",
    "",
    ...(record.interactive ?? []).map(
      (row) =>
        `${row.id}: ${row.status}; bare entry ${row.enteredBare === true ? "operator-attested" : "not yet attested"}; permissions ${row.permissions ?? "unknown"}; hook invocations ${row.events?.length ?? "unknown"}.`,
    ),
    "",
    `Machine-readable observations: [companion](copilot-cli-${record.date}.json).`,
    "",
  ].join("\n");
}

export async function runCopilotProbe({
  out = repository,
  env = process.env,
  binary = "copilot",
  date = new Date().toISOString().slice(0, 10),
  base = tmpdir(),
  correctTrust = false,
  hostModule = pathToFileURL(
    join(repository, "packages/skeleton/dist/src/harness-host.js"),
  ).href,
} = {}) {
  assert.equal(
    env.DOTLN_LIVE_HARNESS,
    "1",
    "explicit live harness probe required",
  );
  assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  const target = join(out, `docs/discovery/copilot-cli-${date}.json`);
  const markdown = join(out, `docs/discovery/copilot-cli-${date}.md`);
  const previousRecord = correctTrust
    ? JSON.parse(readFileSync(target, "utf8"))
    : null;
  if (correctTrust)
    assert.ok(
      previousRecord.launchesStarted === 6 &&
        previousRecord.rows.length === 6 &&
        !previousRecord.trustCorrection &&
        previousRecord.rows.every((row) => !row.trustSource),
      "trust correction requires exactly the six original observations",
    );
  else
    assert.ok(
      !existsSync(target) && !existsSync(markdown),
      "retain existing Copilot probe; do not repeat launches",
    );
  mkdirSync(dirname(target), { recursive: true });
  const previousLaunches = readdirSync(dirname(target))
    .filter((name) => /^copilot-cli-\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .reduce((sum, name) => {
      const previous = JSON.parse(
        readFileSync(join(dirname(target), name), "utf8"),
      );
      assert.ok(
        Number.isSafeInteger(previous.launchesStarted) &&
          previous.launchesStarted >= 0,
        "unreadable prior launch count",
      );
      return sum + previous.launchesStarted;
    }, 0);
  const launches = correctTrust
    ? copilotLaunchRows
        .filter((row) => row.trust && row.model !== "auto")
        .map((row, index) => ({ ...row, id: `P${index + 7}` }))
    : copilotLaunchRows;
  assert.ok(
    previousLaunches + launches.length <= 12,
    "Copilot scripted launch bound reached",
  );
  const record = previousRecord ?? {
    schemaVersion: 1,
    date,
    harness: "copilot-cli",
    installedVersion: null,
    launchesStarted: 0,
    rows: [],
  };
  // Reserve before launch: interruption cannot silently reset the spend bound.
  if (correctTrust) {
    record.trustCorrection = {
      observedAt: new Date().toISOString(),
      cause:
        "trustedFolders is runtime state in config.json, not a settings.json preference",
      evidence: "WO-146-D004",
    };
    writeFileSync(target, json(record));
  } else writeFileSync(target, json(record), { flag: "wx" });
  for (const row of launches) {
    const { directory, home } = prepareCopilotScratch(row, {
      base,
      hostModule,
    });
    const launchEnv = {
      ...env,
      COPILOT_HOME: home,
      COPILOT_AUTO_UPDATE: "false",
      COPILOT_ALLOW_ALL: "false",
    };
    for (const key of [
      "COPILOT_AGENT_SESSION_ID",
      "COPILOT_CUSTOM_INSTRUCTIONS_DIRS",
      "COPILOT_MODEL",
      "CLAUDE_PROJECT_DIR",
      "COPILOT_PROJECT_DIR",
    ])
      delete launchEnv[key];
    try {
      if (!record.installedVersion) {
        const version = spawnSync(binary, ["--version"], {
          cwd: directory,
          env: launchEnv,
          encoding: "utf8",
          timeout: 5000,
        });
        record.installedVersion =
          version.status === 0
            ? (version.stdout.match(/\b\d+\.\d+\.\d+\b/)?.[0] ?? null)
            : null;
      }
      const prompt =
        "Use the dotln-probe skill by name and perform only its isolated procedure. Do not retry a refused call. Report markers actually received from instructions or hooks. " +
        (row.child
          ? "Also spawn exactly one read-only explore agent to read fixture.txt and report its single line. The child must not spawn another agent or edit anything."
          : "Do not spawn any agents.");
      const args = [
        "-p",
        prompt,
        "--max-ai-credits",
        "30",
        "--disable-builtin-mcps",
        "--no-auto-update",
        row.permissions === "all" ? "--allow-all" : "--allow-all-tools",
        ...(row.model === "auto" ? ["--model", "auto"] : []),
      ];
      record.launchesStarted++;
      writeFileSync(target, json(record));
      const result = await runProcess({
        binary,
        args,
        cwd: directory,
        env: launchEnv,
        timeoutMs: 240_000,
      });
      const observation = summarizeCopilotProbe(directory, row, result);
      record.rows.push(observation);
      writeFileSync(target, json(record));
      writeFileSync(markdown, renderCopilotProbe(record));
      console.log(
        `${row.id}: exit ${result.exitCode ?? "unknown"}; ${observation.events.length} hook invocations; ${result.durationMs} ms`,
      );
      if (result.spawnError || observation.authenticationUnavailable) break;
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
  return record;
}

export async function copilotProbe(args) {
  if (args[0]?.startsWith("qualification-")) {
    const {
      prepareCopilotQualification,
      armCopilotQualification,
      collectCopilotQualification,
    } = await import("./copilot-qualification.mjs");
    const [action, directory, sessionId, ...rest] = args;
    if (action === "qualification-prepare" && args.length === 1) {
      assert.equal(
        process.env.DOTLN_LIVE_HARNESS,
        "1",
        "explicit qualification preparation required",
      );
      console.log(json(prepareCopilotQualification()));
    } else if (action === "qualification-next" && args.length === 2) {
      console.log(json(armCopilotQualification(directory)));
    } else if (action === "qualification-collect" && directory && sessionId) {
      const options = collectionOptions(rest);
      console.log(
        json(collectCopilotQualification(directory, sessionId, options)),
      );
    } else
      throw new Error(
        "usage: copilot qualification-prepare | qualification-next <scratch> | qualification-collect <scratch> <session> --bare [--permissions normal|all|unknown] [--approvals observed|not-observed|unknown]",
      );
    return;
  }
  if (args[0] === "interactive-prepare") {
    assert.equal(args.length, 2, "interactive-prepare trusted|untrusted");
    assert.equal(
      process.env.DOTLN_LIVE_HARNESS,
      "1",
      "explicit interactive preparation required",
    );
    assert.ok(["trusted", "untrusted"].includes(args[1]));
    console.log(
      json(prepareCopilotInteractive({ trust: args[1] === "trusted" })),
    );
    return;
  }
  if (args[0] === "interactive-collect") {
    assert.ok(
      args[1],
      "interactive-collect <scratch> --bare [--permissions normal|all|unknown]",
    );
    console.log(
      json(
        collectCopilotInteractive(
          args[1],
          collectionOptions(args.slice(2), true),
        ),
      ),
    );
    return;
  }
  assert.ok(
    args.length === 0 || (args.length === 1 && args[0] === "--correct-trust"),
    "usage: DOTLN_LIVE_HARNESS=1 node scripts/harness-probe.mjs copilot [--correct-trust]",
  );
  const record = await runCopilotProbe({
    correctTrust: args[0] === "--correct-trust",
  });
  console.log(
    `Retained docs/discovery/copilot-cli-${record.date}.{json,md}; interactive observations remain pending.`,
  );
}

function collectionOptions(args, interactive = false) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--bare") options.bare = true;
    else if (args[index] === "--permissions" && args[index + 1])
      options.permissions = args[++index];
    else if (args[index] === "--approvals" && args[index + 1])
      options.approvalPrompts = args[++index];
    else if (interactive && args[index] === "--blocked" && args[index + 1])
      options.blocked = args[++index];
    else if (interactive && args[index] === "--trust" && args[index + 1])
      options.trust = args[++index];
    else throw new Error("unknown collection option");
  }
  return options;
}

export function prepareCopilotInteractive({
  out = repository,
  trust = true,
  date = new Date().toISOString().slice(0, 10),
  base = tmpdir(),
} = {}) {
  const path = join(out, `docs/discovery/copilot-cli-${date}.json`);
  const record = JSON.parse(readFileSync(path, "utf8"));
  const interactive = (record.interactive ??= []);
  assert.ok(
    interactive.length < 2,
    "two reserved interactive probe episodes exhausted",
  );
  const id = `I${interactive.length + 1}`;
  const row = {
    id: "interactive",
    trust,
    forms: ["claude", "native"],
    model: "operator-selected",
    permissions: "unknown",
  };
  const { directory } = prepareCopilotScratch(row, {
    base,
    hostModule: pathToFileURL(
      join(repository, "packages/skeleton/dist/src/harness-host.js"),
    ).href,
  });
  write(directory, "interactive-reservation.json", json({ id, date }));
  interactive.push({ id, status: "reserved", trustRequested: trust });
  writeFileSync(path, json(record));
  writeFileSync(
    join(out, `docs/discovery/copilot-cli-${date}.md`),
    renderCopilotProbe(record),
  );
  return {
    directory,
    id,
    entry: "copilot",
    trust: trust
      ? "operator accepts folder trust"
      : "operator does not accept folder trust",
    prompt:
      "Use dotln-probe once. Do not spawn agents. Only report markers you actually received.",
    followup: trust
      ? "Enable allow-all in-session before the fixture; change the selected model in-session after it, then run node shell-identity.mjs and exit. Report the actual permission mode and any visible Stop marker."
      : "If untrusted entry is unavailable, stop and report that limit; do not silently trust it.",
    launches: 0,
  };
}

export function collectCopilotInteractive(
  directory,
  {
    out = repository,
    bare = false,
    permissions = "unknown",
    approvalPrompts = "unknown",
    env = process.env,
    blocked,
    trust = "unknown",
  } = {},
) {
  assert.equal(bare, true, "operator must attest a bare copilot launch");
  assert.ok(["normal", "all", "unknown"].includes(permissions));
  assert.ok(["observed", "not-observed", "unknown"].includes(approvalPrompts));
  assert.ok(["trusted", "untrusted", "unknown"].includes(trust));
  const root = containedTemp(directory);
  const reservation = JSON.parse(
    readFileSync(join(root, "interactive-reservation.json"), "utf8"),
  );
  const path = join(out, `docs/discovery/copilot-cli-${reservation.date}.json`);
  const record = JSON.parse(readFileSync(path, "utf8"));
  const index = record.interactive.findIndex(
    (row) => row.id === reservation.id,
  );
  assert.ok(
    index >= 0 && record.interactive[index].status === "reserved",
    "preserve a collected interactive observation",
  );
  if (blocked !== undefined) {
    assert.ok(
      [
        "trust-required",
        "session-not-created",
        "authentication-unavailable",
      ].includes(blocked),
    );
    record.interactive[index] = {
      ...record.interactive[index],
      status: "blocked",
      cause: blocked,
      enteredBare: true,
      entrySource: "operator-attested",
      permissions,
      approvalPrompts,
    };
    writeFileSync(path, json(record));
    writeFileSync(
      join(out, `docs/discovery/copilot-cli-${reservation.date}.md`),
      renderCopilotProbe(record),
    );
    return record.interactive[index];
  }
  const { sessionId } = JSON.parse(
    readFileSync(join(root, ".probe-session.json"), "utf8"),
  );
  const logs = decodeUsageSource(
    readFileSync(sessionTranscript(root, { sessionId, env }), "utf8"),
  );
  const start = logs.find((row) => row.type === "session.start");
  const stop = logs.filter((row) => row.type === "session.shutdown").at(-1);
  assert.ok(
    start && stop,
    "exit the identified interactive session before collection",
  );
  const row = JSON.parse(readFileSync(join(root, "probe-row.json"), "utf8"));
  const observation = summarizeCopilotProbe(root, row, {
    logs,
    durationMs: Date.parse(stop.timestamp) - Date.parse(start.timestamp),
  });
  record.interactive[index] = {
    ...observation,
    id: reservation.id,
    status: "collected",
    enteredBare: true,
    entrySource: "operator-attested",
    trustRequested: row.trust,
    trust: trust === "unknown" ? null : trust === "trusted",
    trustSource:
      trust === "unknown"
        ? "unobserved"
        : "operator-attested folder-trust choice",
    permissions,
    permissionSource: "operator-attested",
    approvalPrompts,
  };
  writeFileSync(path, json(record));
  writeFileSync(
    join(out, `docs/discovery/copilot-cli-${reservation.date}.md`),
    renderCopilotProbe(record),
  );
  return record.interactive[index];
}
