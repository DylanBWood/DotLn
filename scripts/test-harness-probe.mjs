import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { hostname, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  LABELS,
  createScratchWorktree,
  observeScratch,
  renderReport,
  runWritingWorker,
  runProcess,
  launchSelectors,
  operationEvidence,
  shape,
} from "./lib/writing-worker-probe.mjs";

const repository = resolve(import.meta.dirname, "..");
const write = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};

test("WO-146 Copilot probe refuses live work without opt-in and reduces payload values", async () => {
  const { runCopilotProbe } = await import("./lib/copilot-probe.mjs");
  const { copilotShape } = await import("./fixtures/copilot-probe-hook.mjs");
  await assert.rejects(
    runCopilotProbe({ env: {} }),
    /explicit live harness probe/,
  );
  assert.deepEqual(
    copilotShape({
      session_id: "private-id",
      cwd: "/private/path",
      tool_input: { command: "private command", offset: 42 },
      prompt: "private prompt",
      agent_id: "private-agent",
      active: true,
      effort: null,
    }),
    {
      session_id: "string",
      cwd: "string",
      tool_input: { command: "string", offset: "number" },
      prompt: "string",
      agent_id: "string",
      active: "boolean",
      effort: "null",
    },
  );
});

const copilotStub = String.raw`#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const {spawnSync} = require("node:child_process");
const args = process.argv.slice(2), cwd = process.cwd();
const home = process.env.COPILOT_HOME;
if (!home || !home.startsWith(cwd + path.sep)) throw new Error("non-isolated CLI home");
if (process.env.COPILOT_AGENT_SESSION_ID) throw new Error("parent session leaked");
if (args[0] === "--version") { console.log("GitHub Copilot CLI 1.0.86."); process.exit(0); }
if (!args.includes("-p") || args[args.indexOf("--max-ai-credits")+1] !== "30") throw new Error("unbounded launch");
const row = JSON.parse(fs.readFileSync("probe-row.json","utf8"));
const settings = JSON.parse(fs.readFileSync(path.join(home,"settings.json"),"utf8"));
const state = JSON.parse(fs.readFileSync(path.join(home,"config.json"),"utf8"));
if (state.trustedFolders.includes(cwd) !== row.trust || settings.trustedFolders !== undefined) throw new Error("trust fixture differs");
const records = [];
const emit = (type,data) => records.push({type,timestamp:"2030-01-02T00:00:00.000Z",data});
emit("session.start",{sessionId:"private-session",copilotVersion:"1.0.86",context:{cwd}});
emit("session.model_change",{newModel:args.includes("--model")?"auto":"fixture-model",reasoningEffort:args.includes("--model")?null:"xhigh",source:"fixture"});
const nativeNames = {SessionStart:"sessionStart",UserPromptSubmit:"userPromptSubmitted",PreToolUse:"preToolUse",PostToolUse:"postToolUse",Stop:"agentStop"};
const markers = ["INSTRUCTION_OBSERVED","SKILL_OBSERVED"];
function hook(event, tool, input, id) {
  let denied = false;
  if (!row.trust) return false;
  for (const form of row.forms) {
    const config = JSON.parse(fs.readFileSync(form==="claude"?".claude/settings.json":".github/hooks/probe.json","utf8"));
    const groups = config.hooks[form==="claude"?event:nativeNames[event]];
    const hooks = form==="claude"?groups.flatMap(group=>group.hooks):groups;
    if (hooks.length!==1) throw new Error("duplicate fixture registration");
    const payload = form==="claude"
      ? {hook_event_name:event,session_id:"private-session",cwd,tool_name:tool,tool_input:input,tool_use_id:id}
      : {sessionId:"private-session",cwd,toolName:tool,toolArgs:input,toolCallId:id};
    for (const entry of hooks) {
      const result = spawnSync(entry.command || entry.bash,{shell:true,cwd,encoding:"utf8",
        env:{...process.env,CLAUDE_PROJECT_DIR:cwd,COPILOT_PROJECT_DIR:cwd,COPILOT_AGENT_SESSION_ID:"private-session"},
        input:JSON.stringify(payload)});
      const output = result.stdout ? JSON.parse(result.stdout) : {};
      if(result.status!==0 || output.hookSpecificOutput?.permissionDecision==="deny") denied=true;
      if(event==="UserPromptSubmit") markers.push(form.toUpperCase()+"_CONTEXT_OBSERVED");
      if(event==="Stop") console.log(output.systemMessage);
    }
  }
  return denied;
}
hook("SessionStart"); hook("UserPromptSubmit");
let sequence=0;
function call(name, tool, input, effect) {
  const id="private-call-"+(++sequence);
  emit("tool.execution_start",{toolCallId:id,toolName:name,arguments:input});
  const denied=hook("PreToolUse",tool,input,id);
  if(!denied) {effect?.();hook("PostToolUse",tool,input,id);}
  emit("tool.execution_complete",{toolCallId:id,success:!denied,result:{content:denied?"expected refusal":"private-result"}});
}
call("skill","Skill",{skill:"dotln-probe"});
call("view","Read",{file_path:path.join(cwd,"fixture.txt")});
call("edit","Edit",{file_path:"fixture.txt"},()=>fs.writeFileSync("fixture.txt","after\n"));
call("create","Write",{file_path:"created.txt"},()=>fs.writeFileSync("created.txt","fixture\n"));
call("bash","Bash",{command:"node shell-identity.mjs"},()=>fs.writeFileSync("shell-identity.json",JSON.stringify({sessionVariablePresent:true,claudeProjectDirMatches:false})));
for(const name of ["claude-deny","claude-error","native-deny","native-error"])
  call("bash","Bash",{command:"printf fixture > "+name+".txt"},()=>fs.writeFileSync(name+".txt","fixture"));
if(row.child) call("task","Agent",{description:"private-child"});
emit("assistant.message",{content:markers.join(" ")});
emit("session.shutdown",{totalNanoAiu:1250000000});
hook("Stop");
const log = path.join(home,"session-state/private-session/events.jsonl");
fs.mkdirSync(path.dirname(log),{recursive:true});
fs.writeFileSync(log,records.map(JSON.stringify).join("\n")+"\n");
`;

test("WO-146 Copilot stub exercises both registrations, trust, caps, denial evidence and immutable observations", async (t) => {
  const {
    runCopilotProbe,
    copilotLaunchRows,
    prepareCopilotScratch,
    summarizeCopilotProbe,
    renderCopilotProbe,
  } = await import("./lib/copilot-probe.mjs");
  const root = mkdtempSync(join(tmpdir(), "dotln-copilot-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const binary = join(root, "copilot-stub");
  writeFileSync(binary, copilotStub, { mode: 0o700 });
  const record = await runCopilotProbe({
    out: root,
    binary,
    date: "2030-01-02",
    base: root,
    hostModule: null,
    env: {
      ...process.env,
      DOTLN_LIVE_HARNESS: "1",
      COPILOT_AGENT_SESSION_ID: "private-parent",
    },
  });
  assert.equal(record.launchesStarted, 6);
  assert.equal(record.rows.length, 6);
  assert.ok(
    record.rows.every((row) => row.exitCode === 0 && row.invalidLogLines === 0),
  );
  assert.equal(record.rows[0].events.length, 0);
  assert.equal(record.rows[0].attempts["claude-deny"].denialObserved, false);
  for (const row of record.rows.slice(1))
    for (const form of row.forms)
      for (const verdict of ["deny", "error"])
        assert.equal(row.attempts[`${form}-${verdict}`].denialObserved, true);
  assert.equal(record.rows[3].maxInvocationsPerCorrelatedEvent, 1);
  assert.ok(record.rows[3].events.some((row) => row.registration === "claude"));
  assert.ok(record.rows[3].events.some((row) => row.registration === "native"));
  assert.equal(record.rows[5].modelChanges[0].model, "auto");
  assert.equal(record.rows[5].modelChanges[0].effort, null);
  assert.ok(record.rows.every((row) => row.aiCredits === 1.25));
  assert.ok(
    record.rows.every(
      (row) =>
        row.creditSource === "copilot-session.shutdown" &&
        row.creditScope === "session-cumulative" &&
        row.creditObservedAt === "2030-01-02T00:00:00.000Z",
    ),
  );
  const collected = renderCopilotProbe({
    ...record,
    interactive: [
      { id: "I1", status: "blocked", enteredBare: true },
      {
        ...record.rows[1],
        id: "I2",
        status: "collected",
        enteredBare: true,
        modelChanges: [
          ...record.rows[1].modelChanges,
          ...record.rows[5].modelChanges,
        ],
      },
    ],
  });
  assert.match(collected, /Interactive rows - observations collected/);
  assert.match(collected, /bare interactive mid-session change is observed/);
  const retained = readFileSync(
    join(root, "docs/discovery/copilot-cli-2030-01-02.json"),
    "utf8",
  );
  for (const forbidden of [
    root,
    "private-session",
    "private-call",
    "private-result",
    "private-child",
    "correlation",
  ])
    assert.ok(!retained.includes(forbidden), forbidden);
  const markdown = readFileSync(
    join(root, "docs/discovery/copilot-cli-2030-01-02.md"),
    "utf8",
  );
  for (let index = 1; index <= 12; index++)
    assert.ok(markdown.includes(`id="H${index}"`));
  assert.match(markdown, /blocked awaiting operator/);
  await assert.rejects(
    runCopilotProbe({
      out: root,
      binary,
      date: "2030-01-02",
      env: { DOTLN_LIVE_HARNESS: "1" },
    }),
    /retain existing/,
  );
  const scratch = prepareCopilotScratch(copilotLaunchRows[1], { base: root });
  const absent = summarizeCopilotProbe(scratch.directory, copilotLaunchRows[1]);
  assert.equal(absent.attempts["claude-deny"].effectAbsent, true);
  assert.equal(absent.attempts["claude-deny"].denialObserved, false);
  assert.equal(absent.maxInvocationsPerCorrelatedEvent, null);
  assert.equal(absent.instructionLoadedOnce, "untested");
  const historical = structuredClone(record);
  for (const row of historical.rows) delete row.trustSource;
  write(
    root,
    "docs/discovery/copilot-cli-2030-01-02.json",
    JSON.stringify(historical),
  );
  const corrected = await runCopilotProbe({
    out: root,
    binary,
    date: "2030-01-02",
    base: root,
    hostModule: null,
    env: { ...process.env, DOTLN_LIVE_HARNESS: "1" },
    correctTrust: true,
  });
  assert.equal(corrected.launchesStarted, 10);
  assert.deepEqual(corrected.rows.slice(0, 6), historical.rows);
  assert.deepEqual(
    corrected.rows.slice(6).map((row) => row.id),
    ["P7", "P8", "P9", "P10"],
  );
  await assert.rejects(
    runCopilotProbe({
      out: root,
      binary,
      date: "2030-01-02",
      env: { DOTLN_LIVE_HARNESS: "1" },
      correctTrust: true,
    }),
    /exactly the six original/,
  );
  write(
    root,
    "docs/discovery/copilot-cli-2030-01-03.json",
    JSON.stringify({ launchesStarted: 7 }),
  );
  await assert.rejects(
    runCopilotProbe({
      out: root,
      binary,
      date: "2030-01-04",
      env: { DOTLN_LIVE_HARNESS: "1" },
    }),
    /launch bound/,
  );
  assert.equal(
    readdirSync(root).filter((name) => name.startsWith("dotln-copilot-probe-"))
      .length,
    1,
    "only the explicitly prepared no-effects fixture remains; driver scratch was removed",
  );
});

test("WO-146 operator qualification uses real fixture transitions, fresh identities and a six-attempt bound", async (t) => {
  const {
    prepareCopilotQualification,
    armCopilotQualification,
    collectCopilotQualification,
  } = await import("./lib/copilot-qualification.mjs");
  const out = mkdtempSync(join(tmpdir(), "dotln-copilot-qualification-test-"));
  t.after(() => rmSync(out, { recursive: true, force: true }));
  const { directory } = prepareCopilotQualification({ out, base: out });
  assert.throws(
    () => prepareCopilotQualification({ out, base: out }),
    /preserve the existing/,
  );
  const env = {
    ...process.env,
    COPILOT_HOME: join(directory, ".copilot-qualification/copilot-home"),
  };
  for (const key of ["COPILOT_AGENT_SESSION_ID", "CODEX_THREAD_ID"])
    delete env[key];
  const run = (...args) => {
    const result = spawnSync(
      process.execPath,
      ["scripts/resume.mjs", ...args],
      {
        cwd: directory,
        encoding: "utf8",
        env,
        timeout: 30_000,
      },
    );
    assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
    return result.stdout;
  };
  const actor = {
    harness: "copilot-cli",
    harnessVersion: "1.0.86",
    model: "fixture-model",
    effort: "high",
    source: "operator-attested",
  };
  const flags = [
    "--harness",
    actor.harness,
    "--harness-version",
    actor.harnessVersion,
    "--model",
    actor.model,
    "--effort",
    actor.effort,
    "--source",
    actor.source,
  ];
  let record;
  for (let step = 0; step < 4; step++) {
    const armed = armCopilotQualification(directory, { out });
    assert.equal(armed.entry, "copilot");
    assert.throws(
      () => armCopilotQualification(directory, { out }),
      /collect the reserved/,
    );
    const timestamp = new Date().toISOString();
    if (step === 0 || step === 2) {
      run(step === 0 ? "next" : "fix");
      write(
        directory,
        "fixture/add.mjs",
        "export const add = (left, right) => left + right;\n",
      );
      run(step === 0 ? "implementation-ready" : "repair-complete", ...flags);
    } else {
      run("verify");
      const report = `docs/verifications/WO-999/VER-${step === 1 ? "001" : "002"}.md`;
      write(
        directory,
        report,
        [
          "# Synthetic qualification verifier",
          `**Actor attestation:** ${JSON.stringify(actor)}`,
          "**Process cost:** unknown; cause harness-no-readback",
          step === 1
            ? "WO-146 planted fixture defect: fixture/add.mjs fails at import."
            : "Fixture assertions pass.",
          "",
        ].join("\n"),
      );
      run("verification-result", step === 1 ? "fail" : "pass", ...flags);
    }
    const sessionId = `private-fixture-session-${step}`;
    write(
      env.COPILOT_HOME,
      `session-state/${sessionId}/events.jsonl`,
      [
        {
          type: "session.start",
          timestamp,
          data: {
            sessionId,
            copilotVersion: "1.0.86",
            context: { cwd: directory },
          },
        },
        {
          type: "session.model_change",
          timestamp,
          data: { newModel: "fixture-model", reasoningEffort: "high" },
        },
        {
          type: "session.shutdown",
          timestamp: new Date().toISOString(),
          data: {
            tokenDetails: {
              input: { tokenCount: 10 },
              output: { tokenCount: 3 },
              cache_read: { tokenCount: 0 },
              cache_write: { tokenCount: 0 },
            },
          },
        },
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    assert.throws(
      () => collectCopilotQualification(directory, sessionId, { out, env }),
      /attest a bare/,
    );
    record = collectCopilotQualification(directory, sessionId, {
      out,
      env,
      bare: true,
      permissions: "all",
    });
    assert.equal(record.completedEpisodes, step + 1);
    assert.equal(record.episodes.at(-1).passed, true);
    assert.throws(
      () =>
        collectCopilotQualification(directory, sessionId, {
          out,
          env,
          bare: true,
        }),
      /reserve exactly one/,
    );
  }
  assert.equal(record.qualified, true);
  assert.equal(record.attemptsReserved, 4);
  assert.equal(record.episodes[1].plantedDefectReported, true);
  assert.ok(record.episodes.every((row) => row.aiCredits === null));
  assert.doesNotMatch(
    JSON.stringify(record),
    /private-fixture-session|copilot-home|events.jsonl/,
  );
  assert.ok(!JSON.stringify(record).includes(directory));
  assert.throws(
    () => armCopilotQualification(directory, { out }),
    /already complete/,
  );
  const stateFile = join(directory, ".copilot-qualification/state.json");
  const state = JSON.parse(readFileSync(stateFile, "utf8"));
  state.nextEpisode = 0;
  state.attempts = Array.from({ length: 6 }, () => ({
    observation: { passed: false },
  }));
  writeFileSync(stateFile, JSON.stringify(state));
  assert.throws(
    () => armCopilotQualification(directory, { out }),
    /two retries exhausted/,
  );
});

test("WO-146 interactive reservations require operator attestations and preserve blocked observations", async (t) => {
  const { prepareCopilotInteractive, collectCopilotInteractive } =
    await import("./lib/copilot-probe.mjs");
  const out = mkdtempSync(join(tmpdir(), "dotln-copilot-interactive-test-"));
  t.after(() => rmSync(out, { recursive: true, force: true }));
  write(
    out,
    "docs/discovery/copilot-cli-2030-01-02.json",
    JSON.stringify({
      date: "2030-01-02",
      rows: [],
      launchesStarted: 0,
    }),
  );
  const first = prepareCopilotInteractive({
    out,
    base: out,
    date: "2030-01-02",
    trust: false,
  });
  assert.equal(first.entry, "copilot");
  assert.equal(first.launches, 0);
  assert.throws(
    () => collectCopilotInteractive(first.directory, { out }),
    /attest a bare/,
  );
  const blocked = collectCopilotInteractive(first.directory, {
    out,
    bare: true,
    blocked: "trust-required",
  });
  assert.equal(blocked.status, "blocked");
  assert.throws(
    () =>
      collectCopilotInteractive(first.directory, {
        out,
        bare: true,
        blocked: "trust-required",
      }),
    /preserve a collected/,
  );
  prepareCopilotInteractive({ out, base: out, date: "2030-01-02" });
  assert.throws(
    () => prepareCopilotInteractive({ out, base: out, date: "2030-01-02" }),
    /two reserved/,
  );
});

test("WO-139 subagent probe confines reads and parent fan-out structurally", (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-probe-budget-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "root-session.txt", "synthetic-root");
  write(root, "identity-key.txt", "synthetic-key");
  const invoke = (tool, tool_input, agent_id) => {
    const run = spawnSync(
      process.execPath,
      [join(repository, "scripts/fixtures/subagent-probe-hook.mjs")],
      {
        cwd: root,
        input: JSON.stringify({
          cwd: root,
          session_id: "synthetic-root",
          hook_event_name: "PreToolUse",
          tool_name: tool,
          tool_input,
          ...(agent_id ? { agent_id } : {}),
        }),
        encoding: "utf8",
      },
    );
    assert.equal(run.status, 0, run.stderr);
    return JSON.parse(run.stdout).hookSpecificOutput?.permissionDecision;
  };
  assert.equal(invoke("Read", { file_path: "/outside/direct.txt" }), "deny");
  assert.equal(
    invoke("Read", { file_path: join(root, "direct.txt") }),
    undefined,
  );
  assert.equal(invoke("Agent", {}, "child"), "deny");
  assert.equal(invoke("Agent", {}), undefined);
  assert.equal(invoke("Agent", {}), "deny");
  assert.equal(
    invoke("Workflow", { scriptPath: "/outside/probe-workflow.ts" }),
    "deny",
  );
  assert.equal(
    invoke("Workflow", { scriptPath: join(root, "probe-workflow.ts") }),
    undefined,
  );
  assert.equal(invoke("Workflow", { scriptPath: "probe-workflow.ts" }), "deny");
});

// Stub harnesses. They imitate the launch surfaces the probe drives (print
// and exec runs, hook invocation, background sessions, help) so the probe's
// plumbing, sanitization and report are exercised without a live account.
// They prove nothing about the real harnesses; the live rows do that.
const claudeStub = String.raw`#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const value = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const out = (m) => process.stdout.write(JSON.stringify(m) + "\n");
const statePath = path.join(process.env.DOTLN_STUB_STATE, "agents.json");
const readState = () => (fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : []);
const writeState = (rows) => fs.writeFileSync(statePath, JSON.stringify(rows));
const step = Number(process.env.DOTLN_STUB_STEP_MS || 120);
if (args[0] === "--version") { console.log("9.9.9 (Claude Code stub)"); process.exit(0); }
if (args[0] === "--help") {
  console.log(["Usage: claude [options] [command] [prompt]", "Options:", "  --bg, --background   Start the session in the background and return immediately", "  -p, --print          Print response and exit", "Commands:", "  agents [options]     Manage background agents", "  attach <id>          Open a background session", "  logs <id>            Print a background session's recent terminal output", "  stop|kill <id>       Stop a background session", "  rm <id>              Delete a background session"].join("\n"));
  process.exit(0);
}
if (args[0] === "agents") { out(readState().filter((r) => has("--all") || r.status === "running")); process.exit(0); }
if (args[0] === "logs") { console.log("stub logs " + args[1]); process.exit(0); }
if (args[0] === "rm") { writeState(readState().filter((r) => r.id !== args[1])); process.exit(0); }
if (has("--bg")) {
  const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { detached: true, stdio: "ignore" });
  child.unref();
  const id = "stub-session-" + child.pid;
  writeState([...readState(), { id, pid: child.pid, status: "running", cwd: process.cwd(), transcript_path: "/stub/transcript.jsonl" }]);
  console.log(id);
  process.exit(0);
}
const prompt = args[args.length - 1];
const format = value("--output-format") || "text";
const stream = format === "stream-json";
const cwd = process.cwd();
const result = (text) => ({ type: "result", subtype: "success", is_error: false, duration_ms: 5, num_turns: 1, result: text, session_id: "stub-session-print", uuid: "stub-uuid", total_cost_usd: 0.001, usage: { input_tokens: 1, output_tokens: 1 } });
if (has("--resume")) { out(result("RESUMED_OK")); process.exit(0); }
const single = /single word ([A-Z_]+)/.exec(prompt);
if (single) { out(result(single[1])); process.exit(0); }
const tools = (value("--tools") || "").split(",").filter(Boolean);
const allowed = (value("--allowedTools") || "").split(",").filter(Boolean);
const prompts = value("--permission-prompts") || "host";
const settingsPath = path.join(cwd, ".claude/settings.json");
const settings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, "utf8")) : {};
const hookPath = path.join(cwd, ".claude/hooks/probe-guard.mjs");
const hookInstalled = fs.existsSync(hookPath) && JSON.stringify(settings).includes("probe-guard");
const runHook = (event, extra) => {
  if (!hookInstalled) return {};
  const input = { session_id: "stub-session-print", transcript_path: path.join(process.env.HOME || "/", ".claude/projects/stub/transcript.jsonl"), cwd, permission_mode: "default", hook_event_name: event, ...extra };
  const run = spawnSync(process.execPath, [hookPath], { cwd, input: JSON.stringify(input), encoding: "utf8", env: { ...process.env, CLAUDE_PROJECT_DIR: cwd } });
  try { return JSON.parse(run.stdout || "{}"); } catch { return {}; }
};
const emit = (m) => { if (stream) out(m); };
emit({ type: "system", subtype: "init", session_id: "stub-session-print", cwd, model: "claude-stub-5", permissionMode: "default", tools });
const promptHook = runHook("UserPromptSubmit", { prompt, prompt_id: "p1" });
const context = (promptHook.hookSpecificOutput && promptHook.hookSpecificOutput.additionalContext) || "";
const toolResult = (text, isError) => emit({ type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: "toolu_1", content: text, is_error: Boolean(isError) }] } });
const observed = [];
const useTool = (name, input, effect) => {
  if (!tools.includes(name)) return false;
  emit({ type: "assistant", message: { role: "assistant", model: "claude-stub-5", content: [{ type: "tool_use", id: "toolu_1", name, input }] } });
  const pre = runHook("PreToolUse", { tool_name: name, tool_input: input, tool_use_id: "toolu_1" });
  const decision = pre.hookSpecificOutput && pre.hookSpecificOutput.permissionDecision;
  if (decision === "deny") { toolResult("Permission denied by hook: " + pre.hookSpecificOutput.permissionDecisionReason, true); return false; }
  const allowedHere = allowed.includes(name) || (name === "Bash" && allowed.includes("Bash(" + input.command + ")")) || name === "Read";
  if (!allowedHere) {
    if (prompts !== "none") sleep(step);
    toolResult("Permission denied: " + (prompts === "none" ? "no prompt target" : "the host answered no"), true);
    return false;
  }
  const done = effect();
  if (done && done.denied) { toolResult(done.denied, true); return false; }
  toolResult((done && done.text) || "ok", false);
  runHook("PostToolUse", { tool_name: name, tool_input: input, tool_response: { success: true }, tool_use_id: "toolu_1" });
  sleep(step);
  return true;
};
const sibling = (/\.\.\/([^/ ]+)\/outside\.txt/.exec(prompt) || [])[1] || "sibling";
useTool("Read", { file_path: "CLAUDE.md" }, () => ({ text: fs.readFileSync(path.join(cwd, "CLAUDE.md"), "utf8") }));
useTool("Edit", { file_path: "fixture.txt", old_string: "before", new_string: "after" }, () => { fs.writeFileSync(path.join(cwd, "fixture.txt"), "after\n"); });
useTool("Write", { file_path: "inside.txt", content: "INSIDE_WRITTEN" }, () => { fs.writeFileSync(path.join(cwd, "inside.txt"), "INSIDE_WRITTEN\n"); });
if (useTool("Bash", { command: "node fixture-test.mjs" }, () => ({ text: spawnSync(process.execPath, ["fixture-test.mjs"], { cwd, encoding: "utf8" }).stdout }))) observed.push("FIXTURE_TEST_OK");
useTool("Write", { file_path: "../" + sibling + "/outside.txt", content: "OUTSIDE_WRITTEN" }, () => ({ denied: "Permission denied: path is outside the working directory" }));
useTool("Bash", { command: "printf dotln-fixture-denied > blocked.txt" }, () => { fs.writeFileSync(path.join(cwd, "blocked.txt"), "x\n"); });
useTool("Bash", { command: "touch settings-denied.txt" }, () => {
  if ((settings.permissions && settings.permissions.deny || []).includes("Bash(touch settings-denied.txt)")) return { denied: "Permission denied by settings" };
  fs.writeFileSync(path.join(cwd, "settings-denied.txt"), "");
});
runHook("Stop", { stop_hook_active: false });
const markers = ["INSTRUCTION_MARKER_ROOT", "INSTRUCTION_MARKER_BLOCK"];
if (fs.existsSync(path.join(cwd, "CLAUDE.local.md"))) markers.push("INSTRUCTION_MARKER_LOCAL");
if (context.includes("PROMPT_HOOK_OBSERVED")) markers.push("PROMPT_HOOK_OBSERVED");
const text = "Markers observed: " + markers.concat(observed).join(" ") + (tools.length ? "" : " TURN_DONE");
if (stream) out({ type: "assistant", message: { role: "assistant", model: "claude-stub-5", content: [{ type: "text", text }] } });
out(result(text));
`;

const codexStub = String.raw`#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const args = process.argv.slice(2);
const value = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const out = (m) => process.stdout.write(JSON.stringify(m) + "\n");
const step = Number(process.env.DOTLN_STUB_STEP_MS || 120);
// WO-159: every DotLn Codex invocation runs in its own isolated home.
const home = process.env.CODEX_HOME;
if (!home || !/^dotln-codex-home-\d+-/.test(path.basename(home)) || fs.readdirSync(home).some((name) => name !== "auth.json")) throw new Error("non-isolated Codex home");
// The home each invocation saw, so a fixture can prove no two launches share one.
if (process.env.DOTLN_STUB_STATE) fs.appendFileSync(path.join(process.env.DOTLN_STUB_STATE, "codex-homes.jsonl"), JSON.stringify({ home, command: args.includes("exec") ? "exec" : args[0] }) + "\n");
if (args[0] === "--version") { console.log("codex-cli 9.9.9 (stub)"); process.exit(0); }
if (args[0] === "--help") {
  console.log(["Codex CLI", "Commands:", "  agents            Browse all agent sessions on the shared local app-server daemon", "  exec              Run Codex non-interactively", "  app-server        Run the app server", "  remote-control    Manage the app-server daemon"].join("\n"));
  process.exit(0);
}
if (!args.includes("exec")) { console.error("unexpected stub invocation"); process.exit(64); }
const cwd = value("--cd") || process.cwd();
const sandbox = value("--sandbox") || "read-only";
const prompt = args[args.length - 1];
out({ type: "thread.started", thread_id: "stub-thread" });
out({ type: "turn.started" });
const single = /single word ([A-Z_]+)/.exec(prompt);
const message = (text) => out({ type: "item.completed", item: { id: "item_1", type: "agent_message", text } });
if (single) { message(single[1]); out({ type: "turn.completed", usage: { input_tokens: 1, output_tokens: 1 } }); process.exit(0); }
if (sandbox === "read-only") {
  out({type:"item.completed",item:{id:"fixture-command",type:"command_execution",command:"node fixture-test.mjs",exit_code:1,aggregated_output:"Permission denied: no terminal"}});
  console.error("approval requested for command execution; no terminal is attached");
  message("The command needs approval that no terminal can grant. TURN_DONE");
  out({ type: "turn.completed", usage: { input_tokens: 1, output_tokens: 1 } });
  process.exit(0);
}
const observed = ["INSTRUCTION_MARKER_AGENTS"];
fs.writeFileSync(path.join(cwd, "fixture.txt"), "after\n"); sleep(step);
fs.writeFileSync(path.join(cwd, "inside.txt"), "INSIDE_WRITTEN\n"); sleep(step);
const ran = spawnSync(process.execPath, ["fixture-test.mjs"], { cwd, encoding: "utf8" });
if (ran.status === 0) observed.push("FIXTURE_TEST_OK");
sleep(step);
message("Sibling write refused by the sandbox. Markers observed: " + observed.join(" ") + " TURN_DONE");
out({ type: "turn.completed", usage: { input_tokens: 1, output_tokens: 1 } });
`;

function stubEnvironment(t) {
  const root = mkdtempSync(join(tmpdir(), "dotln-probe-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const bin = join(root, "bin");
  mkdirSync(bin);
  for (const [name, source] of [
    ["claude", claudeStub],
    ["codex", codexStub],
  ]) {
    writeFileSync(join(bin, name), source);
    chmodSync(join(bin, name), 0o755);
  }
  const home = join(root, "home");
  mkdirSync(home);
  const state = join(root, "state");
  mkdirSync(state);
  const out = join(root, "out");
  write(
    out,
    "docs/discovery/environment.md",
    "# Environment discovery — fixture\n\n## Earlier addendum\n\nUnchanged earlier rows.\n",
  );
  write(
    out,
    "docs/planning/work-order-map.md",
    "# Map\n\n**Critical path:** orders. The first mandatory replan checkpoint follows WO-044's record. Later text.\n\n## Table\n",
  );
  const base = join(root, "scratch");
  mkdirSync(base);
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    HOME: home,
    DOTLN_STUB_STATE: state,
  };
  return { root, bin, home, out, base, env };
}
const readTree = (root) => {
  const files = {};
  const walk = (directory) => {
    for (const name of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, name.name);
      if (name.isDirectory()) walk(path);
      else files[path] = readFileSync(path, "utf8");
    }
  };
  walk(root);
  return files;
};

test("WO-044 VER-001 absent effects and unrelated refusals are ambiguous, and operation evidence uses matched requests", async (t) => {
  const { base, out, env, root } = stubEnvironment(t);
  const stub = join(root, "noop");
  writeFileSync(
    stub,
    '#!/usr/bin/env node\nif(process.argv.includes("--version")) console.log("0.154.0");else console.log(JSON.stringify({type:"turn.completed"}));\n',
  );
  chmodSync(stub, 0o755);
  await runWritingWorker({
    harness: "codex",
    binary: stub,
    out,
    base,
    env,
    date: "2030-01-02",
    launches: ["approval-no-terminal"],
  });
  assert.equal(
    renderReport({ out, date: "2030-01-02" }).rows.find((r) => r.id === "X-U2")
      .label,
    "ambiguous",
  );
  writeFileSync(
    stub,
    '#!/usr/bin/env node\nif(process.argv.includes("--version")) console.log("2.1.270");else {console.log(JSON.stringify({type:"user",message:{content:[{type:"tool_result",tool_use_id:"unrelated",content:"Permission denied"}]}}));console.log(JSON.stringify({type:"result",result:"DONE"}));}\n',
  );
  await runWritingWorker({
    harness: "claude",
    binary: stub,
    out,
    base,
    env,
    date: "2030-01-02",
    launches: ["settings-deny"],
  });
  assert.equal(
    renderReport({ out, date: "2030-01-02" }).rows.find((r) => r.id === "C-W3")
      .label,
    "ambiguous",
  );
  const evidence = operationEvidence([
    {
      message: {
        content: [
          {
            type: "tool_use",
            id: "sensitive-id",
            name: "Bash",
            input: { command: "node fixture-test.mjs" },
          },
        ],
      },
    },
    {
      message: {
        content: [
          {
            type: "tool_result",
            tool_use_id: "other",
            content: "Permission denied",
          },
        ],
      },
    },
    {
      message: {
        content: [
          {
            type: "tool_result",
            tool_use_id: "sensitive-id",
            content: "Permission denied",
          },
        ],
      },
    },
  ]);
  assert.deepEqual(evidence, [
    {
      operation: "fixture-test",
      requested: true,
      outcome: "denied",
      source: "tool-use/result",
    },
  ]);
});

test("WO-044 VER-001 detached spools are removed after success, spawn failure and SIGKILL", async (t) => {
  const { root, base } = stubEnvironment(t);
  for (const kind of ["success", "spawn-failure", "kill"]) {
    await runProcess({
      binary:
        kind === "spawn-failure" ? join(root, "absent") : process.execPath,
      args: [
        "-e",
        kind === "kill"
          ? 'console.log("RAW_FIXTURE");setInterval(()=>{},1000)'
          : 'console.log("RAW_FIXTURE")',
      ],
      cwd: base,
      detached: true,
      spoolBase: base,
      pollMs: 20,
      killWhen: kind === "kill" ? () => true : null,
    });
    assert.deepEqual(readdirSync(base), [], kind);
  }
});

test("WO-044 VER-001 an unconfirmed background token never targets another session", async (t) => {
  const { root, out, base, env } = stubEnvironment(t);
  const stub = join(root, "unconfirmed");
  writeFileSync(
    stub,
    '#!/usr/bin/env node\nconst fs=require("node:fs");const args=process.argv.slice(2);if(args.includes("--version")) console.log("2.1.270");else if(args.includes("--bg")) console.log("notice");else if(args[0]==="agents") console.log(JSON.stringify([{id:"another-session",pid:process.ppid,cwd:process.cwd()}]));else {fs.writeFileSync(process.env.DOTLN_STUB_STATE+"/unexpected-command",args[0]);process.exit(1);}\n',
  );
  chmodSync(stub, 0o755);
  await runWritingWorker({
    harness: "claude",
    binary: stub,
    out,
    base,
    env,
    date: "2030-01-02",
    launches: ["background"],
    timing: { settleMs: 1, idleSampleMs: 1 },
  });
  const result = JSON.parse(
    readFileSync(
      join(
        out,
        "docs/discovery/writing-worker-smoke-2030-01-02/claude-background.json",
      ),
    ),
  );
  assert.equal(result.background.available, false);
  assert.match(result.background.reason, /not confirmed/);
  assert.equal(
    existsSync(join(env.DOTLN_STUB_STATE, "unexpected-command")),
    false,
  );
});

test("WO-044 shape reduction keeps field names and enumerated values, never identifiers, paths or free text", () => {
  const reduced = shape({
    session_id: "abc123",
    transcript_path: "/Users/someone/.claude/x.jsonl",
    cwd: "/private/tmp/x",
    permission_mode: "default",
    hook_event_name: "PreToolUse",
    tool_name: "Bash",
    tool_input: { command: "printf secret > file", file_path: "/x/y" },
    prompt: "operator wording",
    count: 3,
    flag: true,
    nested: [{ uuid: "u" }, { uuid: "v" }],
  });
  assert.deepEqual(reduced, {
    session_id: "<identifier-or-path>",
    transcript_path: "<identifier-or-path>",
    cwd: "<cwd>",
    permission_mode: "default",
    hook_event_name: "PreToolUse",
    tool_name: "Bash",
    tool_input: { command: "<string>", file_path: "<path>" },
    prompt: "<string>",
    count: "number",
    flag: true,
    nested: [{ uuid: "<identifier-or-path>" }],
  });
});

test("WO-044 the scratch worktree is a committed foreign repository outside this checkout with the generated-shape hook, deny rule and instruction surfaces", (t) => {
  const { base } = stubEnvironment(t);
  const tree = createScratchWorktree({ base });
  assert.ok(!tree.scratch.startsWith(repository));
  const top = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: tree.scratch,
    encoding: "utf8",
  }).stdout.trim();
  assert.equal(top, tree.scratch);
  assert.equal(
    spawnSync("git", ["status", "--porcelain"], {
      cwd: tree.scratch,
      encoding: "utf8",
    }).stdout,
    "",
    "the scratch worktree starts clean",
  );
  const settings = JSON.parse(
    readFileSync(join(tree.scratch, ".claude/settings.json"), "utf8"),
  );
  assert.deepEqual(settings.permissions.deny, [
    "Bash(touch settings-denied.txt)",
  ]);
  for (const event of ["PreToolUse", "PostToolUse", "Stop", "UserPromptSubmit"])
    assert.match(
      settings.hooks[event][0].hooks[0].command,
      /CLAUDE_PROJECT_DIR.*probe-guard\.mjs/,
    );
  const hook = readFileSync(
    join(tree.scratch, ".claude/hooks/probe-guard.mjs"),
    "utf8",
  );
  assert.match(hook, /await import\("file:\/\/\//);
  assert.ok(hook.includes(tree.runtimeDirectory));
  for (const path of [
    "fixture.txt",
    "fixture-test.mjs",
    "CLAUDE.md",
    "CLAUDE.local.md",
    ".claude/CLAUDE.md",
    "AGENTS.md",
    ".codex/hooks.json",
  ])
    assert.ok(existsSync(join(tree.scratch, path)), path);
  assert.match(
    readFileSync(join(tree.scratch, "CLAUDE.md"), "utf8"),
    /<!-- dotln-harness:start -->\nINSTRUCTION_MARKER_BLOCK/,
  );
  // The hook decides through the imported runtime and records shapes only.
  const deny = spawnSync(process.execPath, [".claude/hooks/probe-guard.mjs"], {
    cwd: tree.scratch,
    encoding: "utf8",
    env: { ...process.env, CLAUDE_PROJECT_DIR: tree.scratch },
    input: JSON.stringify({
      session_id: "s",
      transcript_path: "/t",
      cwd: tree.scratch,
      permission_mode: "default",
      hook_event_name: "PreToolUse",
      tool_name: "Bash",
      tool_input: { command: "printf dotln-fixture-denied > blocked.txt" },
      tool_use_id: "toolu_9",
    }),
  });
  assert.equal(
    JSON.parse(deny.stdout).hookSpecificOutput.permissionDecision,
    "deny",
  );
  const observed = observeScratch(tree);
  assert.deepEqual(observed.hookRuntimeImports, ["ok"]);
  assert.equal(observed.hookRefusals, 1);
  assert.equal(observed.hookProjectDirVariable, true);
  const recorded = readFileSync(
    join(tree.scratch, "probe-events.jsonl"),
    "utf8",
  );
  assert.ok(
    !recorded.includes("blocked.txt"),
    "tool input values are not recorded",
  );
  assert.ok(
    !recorded.includes(tree.scratch),
    "the worktree path is not recorded",
  );
});

test("WO-044 the probe drives every Claude and Codex launch through stub harnesses, records shapes only, and renders the labeled record, addendum and disposition", async (t) => {
  const { base, out, env, home, root } = stubEnvironment(t);
  const date = "2030-01-02";
  const claude = await runWritingWorker({
    harness: "claude",
    out,
    date,
    env: { ...env, DOTLN_STUB_STEP_MS: "500" },
    base,
    timing: { idleSampleMs: 50, settleMs: 50 },
  });
  assert.equal(claude.length, 11);
  const codex = await runWritingWorker({
    harness: "codex",
    out,
    date,
    env: { ...env, DOTLN_STUB_STEP_MS: "500" },
    base,
    timing: { idleSampleMs: 50, settleMs: 50 },
  });
  assert.equal(codex.length, 8);
  // WO-159 VER-001 F1: every Codex invocation, including each concurrent
  // session and the fresh recovery, ran in its own home, and each row keeps
  // one record per invocation naming the home that launch saw.
  const invocations = readFileSync(
    join(root, "state", "codex-homes.jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const homes = invocations.map((invocation) => invocation.home);
  assert.equal(
    new Set(homes).size,
    homes.length,
    "no two launches share a home",
  );
  const launched = invocations
    .filter((invocation) => invocation.command !== "--version")
    .map(
      ({ home }) => `sha256:${createHash("sha256").update(home).digest("hex")}`,
    );
  const recorded = [];
  const expected = {
    concurrent: ["concurrent-1", "concurrent-2", "concurrent-3"],
    "resident-kill": ["exec", "recovery"],
    surface: ["help"],
  };
  for (const path of codex) {
    const row = JSON.parse(readFileSync(path, "utf8"));
    assert.deepEqual(
      row.codexEpisodes.map((episode) => episode.launch),
      expected[row.launch] ?? ["exec"],
      path,
    );
    for (const episode of row.codexEpisodes) {
      assert.equal(episode.homeRemoved, true, path);
      assert.equal(episode.userConfig.before, episode.userConfig.after, path);
      assert.equal(episode.trustTable.before, episode.trustTable.after, path);
      recorded.push(episode.home);
    }
    assert.equal(row.userScopeSettingsWritten, false, path);
  }
  assert.deepEqual(recorded.toSorted(), launched.toSorted());
  const directory = join(out, `docs/discovery/writing-worker-smoke-${date}`);
  const record = (name) =>
    JSON.parse(readFileSync(join(directory, `${name}.json`), "utf8"));
  const toolsOnly = record("claude-tools-only");
  assert.equal(toolsOnly.worktree.fixtureEdited, false);
  assert.ok(toolsOnly.stream.refusalSignals > 0);
  const allowed = record("claude-allowed-tools");
  assert.equal(allowed.version, "9.9.9");
  assert.deepEqual(allowed.worktree, {
    fixtureEdited: true,
    insideWritten: true,
    testRan: true,
    hookDeniedFileAbsent: true,
    settingsDeniedFileAbsent: true,
    siblingWritten: false,
    statusCodes: ["??", " M"].sort(),
  });
  assert.deepEqual(allowed.hooks.eventNames.sort(), [
    "PostToolUse",
    "PreToolUse",
    "Stop",
    "UserPromptSubmit",
  ]);
  assert.deepEqual(allowed.hooks.runtimeImports, ["ok"]);
  assert.equal(allowed.hooks.projectDirVariable, true);
  assert.ok(allowed.hooks.refusals >= 1);
  assert.ok(allowed.stream.finalMarkers.includes("INSTRUCTION_MARKER_ROOT"));
  assert.ok(allowed.stream.finalMarkers.includes("PROMPT_HOOK_OBSERVED"));
  assert.deepEqual(allowed.stream.observedModels, ["claude-stub-5"]);
  assert.equal(allowed.sessionPersistence.persisted, false);
  assert.equal(allowed.stream.resultShape.session_id, "<identifier-or-path>");
  assert.equal(allowed.stream.resultShape.result, "<string>");
  const promptEvent = allowed.hooks.events.find(
    (event) => event.event === "UserPromptSubmit",
  );
  assert.equal(promptEvent.fields.prompt, "<string>");
  assert.equal(promptEvent.fields.permission_mode, "default");
  const kill = record("claude-kill");
  assert.equal(kill.killed, true);
  assert.equal(kill.signal, "SIGKILL");
  assert.equal(kill.worktree.fixtureEdited, true);
  const detached = record("claude-detached");
  assert.equal(detached.detached, true);
  assert.equal(detached.exitCode, 0);
  assert.deepEqual(detached.stream.finalMarkers, ["DETACHED_OK"]);
  const noTerminal = record("claude-prompt-no-terminal");
  assert.equal(noTerminal.worktree.testRan, false);
  assert.ok(noTerminal.stream.refusalSignals > 0);
  const background = record("claude-background");
  assert.equal(background.background.available, true);
  assert.deepEqual(
    background.background.steps.map((step) => step.name),
    [
      "start --bg --print",
      "agents --json",
      "logs",
      "idle-samples",
      "kill",
      "resume",
      "rm",
    ],
  );
  assert.equal(background.background.steps[0].idShape, "<session-id>");
  assert.equal(background.background.steps[1].pidExposed, true);
  assert.equal(background.background.steps[1].listingShape.id, "<string>");
  const idle = background.background.steps[3];
  assert.ok(
    idle.samples.length === 3 || idle.samplerAvailable === false,
    "three idle samples, or a sampler the sandbox refused",
  );
  assert.equal(background.background.steps[4].killDelivered, true);
  assert.deepEqual(background.background.steps[5].markers, ["RESUMED_OK"]);
  const concurrent = record("claude-concurrent");
  assert.deepEqual(
    { model: concurrent.actor.model, effort: concurrent.actor.effort },
    launchSelectors("claude", concurrent.argsShape),
  );
  assert.equal(concurrent.actor.effort, "low");
  assert.equal(concurrent.concurrent.length, 3);
  assert.ok(concurrent.concurrent.every((run) => run.exitCode === 0));
  const surface = record("claude-surface");
  assert.equal(surface.surface.schedulerSubcommand, false);
  assert.equal(surface.surface.backgroundLaunch, true);
  assert.deepEqual(surface.surface.backgroundSessionCommands, [
    "attach",
    "logs",
    "stop",
    "rm",
  ]);
  const workspace = record("codex-workspace-write");
  assert.equal(workspace.worktree.fixtureEdited, true);
  assert.deepEqual(workspace.hooks.eventNames, []);
  assert.ok(workspace.stream.messageTypes.includes("turn.completed"));
  assert.ok(
    workspace.stream.finalMarkers.includes("INSTRUCTION_MARKER_AGENTS"),
  );
  assert.equal(record("codex-named-profile").worktree.fixtureEdited, true);
  assert.equal(record("codex-kill").killed, true);
  assert.equal(record("codex-detached").exitCode, 0);
  assert.equal(record("codex-approval-no-terminal").worktree.testRan, false);
  assert.equal(record("codex-concurrent").concurrent.length, 3);
  assert.equal(record("codex-concurrent").actor.effort, "low");
  for (const harness of ["claude", "codex"]) {
    const resident = record(`${harness}-resident-kill`);
    assert.equal(resident.detached, true);
    assert.equal(resident.killed, true);
    assert.equal(resident.signal, "SIGKILL");
    assert.equal(resident.recovery.persistedStateRead, true);
    assert.equal(resident.recovery.exitCode, 0);
    assert.equal(resident.recovery.worktree.fixtureEdited, true);
  }
  assert.equal(record("codex-surface").surface.daemonOrAppServer, true);

  const rendered = renderReport({ out, date });
  assert.equal(rendered.rows.length, 17 + 16);
  const label = (id) => rendered.rows.find((row) => row.id === id).label;
  assert.equal(label("C-W1"), "observed");
  assert.equal(label("C-W3"), "observed");
  assert.equal(label("C-W4"), "observed");
  assert.equal(label("C-W5"), "observed");
  assert.equal(label("C-W9"), "observed");
  assert.equal(label("C-K1"), "observed");
  assert.equal(label("C-U3"), "unavailable");
  assert.ok(["observed", "unavailable"].includes(label("C-U4")));
  assert.equal(label("C-U6"), "observed");
  assert.equal(label("X-W3"), "unavailable");
  assert.equal(label("X-W4"), "unavailable");
  assert.equal(label("X-U4"), "unavailable");
  assert.equal(label("X-U6"), "observed");
  assert.ok(rendered.rows.every((row) => LABELS.includes(row.label)));
  const md = readFileSync(
    join(out, `docs/discovery/writing-worker-smoke-${date}.md`),
    "utf8",
  );
  for (const row of rendered.rows)
    assert.ok(md.includes(`<a id="${row.id}"></a>`));
  const index = JSON.parse(
    readFileSync(
      join(out, `docs/discovery/writing-worker-smoke-${date}.json`),
      "utf8",
    ),
  );
  assert.equal(index.runs.length, 19);
  assert.equal(index.rows.length, 33);
  const environment = readFileSync(
    join(out, "docs/discovery/environment.md"),
    "utf8",
  );
  assert.match(
    environment,
    /## WO-044 writing-worker and unattended-launch addendum \(2030-01-02\)/,
  );
  assert.ok(environment.startsWith("# Environment discovery — fixture"));
  const map = readFileSync(
    join(out, "docs/planning/work-order-map.md"),
    "utf8",
  );
  assert.match(map, /WO-044 checkpoint disposition \(2030-01-02\)/);
  assert.ok(
    map.indexOf("checkpoint disposition") >
      map.indexOf("follows WO-044's record."),
  );
  // Rendering again changes nothing.
  const before = readTree(join(out, "docs"));
  renderReport({ out, date });
  assert.deepEqual(readTree(join(out, "docs")), before);
  // Nothing private reaches the committed surfaces.
  for (const [path, text] of Object.entries(before)) {
    for (const secret of [
      base,
      home,
      hostname(),
      "stub-session",
      "toolu_",
      "stub-uuid",
      "/stub/transcript.jsonl",
    ])
      assert.ok(!text.includes(secret), `${path} leaks ${secret}`);
  }
  // A second run at the same date refuses to overwrite observations.
  await assert.rejects(
    runWritingWorker({
      harness: "claude",
      out,
      date,
      env,
      base,
      launches: ["surface"],
    }),
    /retain probe observations/,
  );
});
