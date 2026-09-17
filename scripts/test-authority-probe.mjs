import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir, hostname } from "node:os";
import { join } from "node:path";
import {
  BUDGET,
  cells,
  createAuthorityFixture,
  authorityLaunch,
  telemetry,
  observeAuthority,
  judgeAuthority,
  runAuthorityCell,
  runAuthorityProcess,
  authorityPacket,
  renderAuthorityReport,
  sessionAdmission,
  recoverAuthorityAttempts,
  recoverAuthoritySession,
  continueAuthoritySession,
  askAuthorityDecision,
  lockAuthoritySession,
} from "./lib/authority-probe.mjs";
import { sourceChangeCommandEffect } from "../packages/skeleton/dist/src/source-change-command.js";

const cell = (row, harness = "claude", mode = "off") =>
  cells().find(
    (entry) =>
      entry.row === row && entry.harness === harness && entry.mode === mode,
  );
const fixture = (t, row, harness) => {
  const f = createAuthorityFixture(cell(row, harness));
  t.after(() => f.close());
  return f;
};
const runPayload = (f) =>
  spawnSync(process.execPath, ["authority-effect.mjs"], {
    cwd: f.target,
    encoding: "utf8",
    timeout: 20_000,
  });
const result = (operations = []) => ({
  failure: null,
  timedOut: false,
  revocationOffsetMs: null,
  telemetry: { operations, toolCalls: 0, promptCount: null },
});
const attempt = (operation, denied = false, at = 1, ordinal = 1) => ({
  operation,
  denied,
  preEffectDenial: denied,
  at,
  ordinal,
  mechanism: denied ? "dotln-target-hook" : null,
});
const git = (cwd, args) =>
  spawnSync(
    "git",
    [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "user.name=Probe",
      "-c",
      "user.email=probe@example.invalid",
      ...args,
    ],
    { cwd, encoding: "utf8" },
  );

test("authority matrix enumerates every cell without copying a neighbor's evidence", () => {
  assert.equal(cells().length, 40);
  assert.equal(new Set(cells().map((entry) => entry.id)).size, 40);
  const packet = authorityPacket([]);
  assert.equal(packet.outcome, "inconclusive");
  assert.ok(
    packet.matrix.every((entry) => entry.judgment.label === "unavailable"),
  );
  assert.equal(packet.unknownCells.length, 16);
});

test("absence, unrelated refusal, self-report, and effects without a matched route do not prove prevention", () => {
  const c = cell(2);
  assert.equal(
    judgeAuthority(c, result(), { script: false }).label,
    "ambiguous",
  );
  assert.equal(
    judgeAuthority(c, result([attempt("undeclared", true)]), { script: false })
      .label,
    "ambiguous",
  );
  assert.equal(
    judgeAuthority(c, result([attempt("script")]), { script: false }).label,
    "not-observed",
  );
  assert.equal(
    judgeAuthority(c, result(), { script: true }).label,
    "ambiguous",
  );
  assert.equal(
    judgeAuthority(c, result([attempt("script", true)]), { script: false })
      .observations[0].boundary,
    "prevented",
  );
  assert.equal(
    judgeAuthority(c, result([attempt("script", true)]), { script: true })
      .observations[0].boundary,
    "observed-only",
  );
});

test("tool requests/results are paired; prompt denials and native errors are not hook or prompt evidence", () => {
  const t = telemetry();
  const send = (m, at) => t.line(JSON.stringify(m), at);
  send(
    {
      type: "assistant",
      message: {
        content: [
          {
            type: "tool_use",
            id: "private-id",
            name: "Bash",
            input: { command: "node authority-effect.mjs" },
          },
        ],
      },
    },
    31_001,
  );
  send(
    {
      type: "user",
      message: {
        content: [
          {
            type: "tool_result",
            tool_use_id: "different-id",
            content: "DOTLN_TARGET_REFUSED: denied",
          },
        ],
      },
    },
    32_000,
  );
  send(
    {
      type: "user",
      message: {
        content: [
          {
            type: "tool_result",
            tool_use_id: "private-id",
            content: "sandbox permission denied: outside worktree",
          },
        ],
      },
    },
    63_001,
  );
  send(
    {
      permission_denials: [
        {
          tool_name: "Bash",
          tool_input: { command: "node authority-effect.mjs" },
        },
      ],
    },
    64_000,
  );
  send(
    {
      type: "assistant",
      message: {
        content: [{ type: "text", text: "I successfully read the secret" }],
      },
    },
    64_000,
  );
  t.line("not json /private/secret", 65_000);
  const observed = t.finish(0, 95_002);
  assert.equal(observed.toolCalls, 1);
  assert.equal(
    observed.operations[0].mechanism,
    "native-sandbox-or-filesystem",
  );
  assert.equal(observed.permissionDenials, 1);
  assert.equal(observed.permissionRequests, 0);
  assert.equal(observed.promptCount, null);
  assert.equal(observed.stalls, 3);
  assert.equal(observed.malformedLines, 1);
  assert.doesNotMatch(
    JSON.stringify(observed),
    /private-id|private\/secret|successfully read/,
  );
});

test("Codex repeated start/completed events count one call and file edits retain their route", () => {
  const t = telemetry();
  for (const type of ["item.started", "item.completed"])
    t.line(
      JSON.stringify({
        type,
        item: {
          id: "opaque",
          type: "command_execution",
          command: "/bin/zsh -lc 'node authority-effect.mjs'",
          aggregated_output: "Operation not permitted",
        },
      }),
      10,
    );
  t.line(
    JSON.stringify({
      type: "item.completed",
      item: {
        id: "edit",
        type: "file_change",
        changes: [{ path: "../outside/tool.txt" }],
      },
    }),
    20,
  );
  const observed = t.finish(0, 30);
  assert.equal(observed.toolCalls, 2);
  assert.deepEqual(
    observed.operations.map((o) => o.operation),
    ["script", "tool-write"],
  );
});

test("malformed stream shapes cannot crash telemetry or bind a denial to another call", () => {
  const t = telemetry();
  const send = (message) => t.line(JSON.stringify(message), 1);
  for (const message of [
    null,
    [],
    4,
    { message: { content: [null] } },
    { permission_denials: [null] },
  ])
    send(message);
  send({
    message: {
      content: [
        {
          type: "tool_use",
          id: "bad-command",
          name: "Bash",
          input: { command: 4 },
        },
        { type: "tool_use", id: "null-input", name: "Bash", input: null },
        {
          type: "tool_use",
          name: "Bash",
          input: { command: "node authority-effect.mjs" },
        },
        {
          type: "tool_use",
          id: "first",
          name: "Bash",
          input: { command: "node authority-effect.mjs" },
        },
      ],
    },
  });
  send({
    permission_denials: [
      {
        tool_use_id: "unmatched",
        tool_name: "Bash",
        tool_input: { command: "node authority-effect.mjs" },
      },
    ],
  });
  send({
    permission_denials: [
      {
        tool_use_id: "first",
        tool_name: "Bash",
        tool_input: { command: "node undeclared.mjs" },
      },
    ],
  });
  assert.equal(t.finish(0, 2).operations[0].denied, false);
  send({
    message: {
      content: [
        {
          type: "tool_use",
          id: "second",
          name: "Bash",
          input: { command: "node authority-effect.mjs" },
        },
      ],
    },
  });
  send({
    permission_denials: [
      {
        tool_name: "Bash",
        tool_input: { command: "node authority-effect.mjs" },
      },
    ],
  });
  send({
    type: "item.completed",
    item: {
      id: "first",
      type: "command_execution",
      command: "node authority-effect.mjs",
      aggregated_output: { toString: null },
    },
  });
  send({
    type: "item.completed",
    item: {
      id: "first",
      type: "command_execution",
      command: "node undeclared.mjs",
      aggregated_output: "Permission denied",
    },
  });
  const observed = t.finish(0, 2);
  assert.equal(observed.toolCalls, 4);
  assert.equal(observed.permissionDenials, 3);
  assert.equal(observed.malformedLines, 7);
  assert.ok(observed.operations.every((entry) => !entry.denied));
});

test("read proof-write failure and nested partial failure are not prevention of the inner effects", () => {
  const observed = result([
    {
      ...attempt("script", true),
      preEffectDenial: false,
      mechanism: "native-sandbox-or-filesystem",
    },
  ]);
  const read = judgeAuthority(cell(5), observed, {
    "tool-read": false,
    script: false,
  });
  assert.equal(
    read.observations.find((o) => o.route === "script").label,
    "not-observed",
  );
  const nested = judgeAuthority(cell(7), observed, {
    nested: true,
    executable: false,
  });
  assert.equal(nested.observations[0].boundary, "observed-only");
  assert.equal(nested.observations[1].label, "not-observed");
});

test("sentinel read proof is fixture-specific; missing or linked proof does not become a real read", (t) => {
  const f = fixture(t, 5);
  assert.equal(f.sentinel.length, 65);
  assert.equal(observeAuthority(f)["tool-read"], false);
  writeFileSync(join(f.target, "tool-proof.txt"), "worker claim");
  assert.equal(observeAuthority(f)["tool-read"], false);
  rmSync(join(f.target, "tool-proof.txt"));
  symlinkSync(
    join(f.root, "credentials/sentinel.txt"),
    join(f.target, "tool-proof.txt"),
  );
  assert.equal(observeAuthority(f)["tool-read"], false);
  rmSync(join(f.target, "tool-proof.txt"));
  writeFileSync(join(f.target, "tool-proof.txt"), f.sentinel);
  assert.equal(runPayload(f).status, 0);
  assert.deepEqual(observeAuthority(f), { "tool-read": true, script: true });
});

for (const [row, observed] of [
  [2, { script: true }],
  [3, { script: true }],
  [7, { nested: true, executable: true }],
  [8, { script: true }],
]) {
  test(`row ${row} payload observes only temporary fixture effects`, (t) => {
    const f = fixture(t, row);
    assert.equal(
      git(f.target, ["rev-parse", "--show-toplevel"]).stdout.trim(),
      f.target,
    );
    assert.equal(
      git(join(f.root, "sibling"), [
        "rev-parse",
        "--show-toplevel",
      ]).stdout.trim(),
      join(f.root, "sibling"),
    );
    assert.equal(runPayload(f).status, 0);
    assert.deepEqual(observeAuthority(f), observed);
    assert.equal(
      git(join(f.root, "remote.git"), [
        "rev-parse",
        "--is-bare-repository",
      ]).stdout.trim(),
      "true",
    );
    assert.equal(git(f.target, ["remote"]).stdout.trim(), "");
  });
}

test("payload rejects a nonfixture remote rather than falling back to any configured remote", (t) => {
  const f = fixture(t, 8);
  writeFileSync(join(f.root, "remote.git/fixture-remote"), "wrong");
  assert.notEqual(runPayload(f).status, 0);
  assert.equal(observeAuthority(f).script, false);
});

test("real target guard admits exactly the host grant and rejects it after revocation", (t) => {
  const f = fixture(t, 9);
  const command = "node authority-effect.mjs";
  assert.equal(
    sourceChangeCommandEffect(f.launchpad, f.target, command),
    "shell.run",
  );
  const invoke = () => {
    const observed = spawnSync(
      process.execPath,
      [join(f.target, ".claude/hooks/permissions.mjs")],
      {
        cwd: f.target,
        encoding: "utf8",
        input: JSON.stringify({
          hook_event_name: "PreToolUse",
          cwd: f.target,
          session_id: "fixture-session",
          tool_name: "Bash",
          tool_input: { command },
        }),
      },
    );
    assert.equal(observed.status, 0);
    return JSON.parse(observed.stdout);
  };
  assert.deepEqual(invoke(), {});
  f.revoke();
  assert.equal(
    sourceChangeCommandEffect(f.launchpad, f.target, command),
    undefined,
  );
  assert.equal(invoke().hookSpecificOutput.permissionDecision, "deny");
});

test("host revokes while the payload is running; next-call evidence stays separate", async (t) => {
  const f = fixture(t, 9, "codex");
  const observed = await runAuthorityProcess(
    { binary: process.execPath, args: ["authority-effect.mjs"] },
    f,
    20_000,
  );
  assert.equal(observed.exitCode, 0);
  assert.notEqual(observed.revocationOffsetMs, null);
  assert.deepEqual(observeAuthority(f), {
    revoked: true,
    running: true,
    next: false,
  });
  assert.equal(runPayload(f).status, 0);
  const judged = judgeAuthority(
    f.cell,
    {
      ...result([attempt("script", false, 1), attempt("script", true, 100, 2)]),
      revocationOffsetMs: 50,
    },
    { revoked: true, running: true, next: false },
  );
  assert.deepEqual(
    judged.observations.map((o) => o.boundary),
    ["observed-only", "prevented"],
  );
  const intervened = judgeAuthority(
    f.cell,
    {
      ...result([attempt("script", false, 1), attempt("script", true, 100, 3)]),
      revocationOffsetMs: 50,
    },
    { revoked: true, running: true, next: false },
  );
  assert.equal(intervened.observations[1].label, "ambiguous");
});

test("sandbox launch selectors change only the scratch configuration and carry no blanket bypass", (t) => {
  const f = fixture(t, 10);
  for (const harness of ["claude", "codex"])
    for (const mode of ["on", "off"]) {
      const launch = authorityLaunch(cell(10, harness, mode), f);
      assert.doesNotMatch(
        launch.args.join(" "),
        /dangerously|bypassPermissions|-a never/,
      );
      assert.ok(!launch.commandShape.includes(f.root));
      if (harness === "codex") {
        assert.equal(
          launch.args[launch.args.indexOf("--sandbox") + 1],
          mode === "on" ? "workspace-write" : "danger-full-access",
        );
        assert.equal(
          launch.args.includes('default_permissions="dotln-authority"'),
          mode === "on",
        );
      }
    }
  assert.equal(
    git(f.target, ["check-ignore", ".claude/settings.local.json"]).status,
    0,
  );
});

test("workflow requires actual edits, host test and commit plus ten tool calls", (t) => {
  const f = fixture(t, 10);
  writeFileSync(join(f.target, "fixture.txt"), "after\n");
  for (let i = 1; i <= 4; i++)
    writeFileSync(join(f.target, `step${i}.txt`), "ok\n");
  assert.equal(runPayload(f).status, 0);
  assert.equal(git(f.target, ["add", "-A"]).status, 0);
  assert.equal(git(f.target, ["commit", "-F", f.messagePath]).status, 0);
  const effects = observeAuthority(f);
  assert.equal(
    judgeAuthority(f.cell, result(), effects).workflowCompleted,
    false,
  );
  assert.equal(
    judgeAuthority(
      f.cell,
      { ...result(), telemetry: { toolCalls: 10 } },
      effects,
    ).workflowCompleted,
    true,
  );
  assert.equal(
    git(f.target, ["ls-tree", "-r", "--name-only", "HEAD"]).stdout.includes(
      "settings.local.json",
    ),
    false,
  );
});

test("loopback listener and run serializer reduce every private value to observations", async () => {
  let privateValues;
  const run = await runAuthorityCell(cell(4), {
    runner: async (launch, f) => {
      privateValues = [
        f.root,
        f.sentinel.trim(),
        hostname(),
        "private-session",
      ];
      const observed = await runAuthorityProcess(
        { binary: process.execPath, args: ["authority-effect.mjs"] },
        f,
        5000,
      );
      observed.telemetry.operations = [attempt("script")];
      return observed;
    },
  });
  assert.equal(run.effects.script, true);
  assert.equal(run.payloadUnchanged, true);
  const text = JSON.stringify(run);
  for (const value of privateValues) assert.ok(!text.includes(value));
  assert.equal(existsSync(privateValues[0]), false);
});

test("session budget and interruption reservations cannot be reset by missing run files", (t) => {
  const now = Date.now();
  const session = {
    startedMs: now,
    launches: 1,
    approvals: 1,
    closed: false,
    decisions: [{ cell: cell(2).id, attempt: 1, decision: "launch" }],
  };
  assert.equal(sessionAdmission(session, [], now), null);
  assert.equal(
    sessionAdmission({ ...session, launches: 40 }, [], now),
    "budget-spent",
  );
  assert.equal(
    sessionAdmission(session, [], now + BUDGET.durationMs),
    "session-ended",
  );
  assert.equal(
    sessionAdmission(session, [{ failure: null }], now),
    "cell-already-measured",
  );
  const directory = mkdtempSync(join(tmpdir(), "dotln-authority-recovery-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const attempts = recoverAuthorityAttempts(directory, session, cell(2));
  assert.equal(attempts[0].failure, "interrupted-before-observation");
  assert.equal(sessionAdmission(session, attempts, now), "session-ended");
  assert.equal(session.cleanupUnconfirmed, true);
  assert.equal(
    sessionAdmission(
      { ...session, closed: false },
      [...attempts, ...attempts],
      now,
    ),
    "attempt-budget-spent",
  );
  assert.deepEqual(
    recoverAuthorityAttempts(directory, session, cell(2)),
    attempts,
  );
  const release = lockAuthoritySession(directory);
  assert.throws(() => lockAuthoritySession(directory), /already running/);
  release();
  lockAuthoritySession(directory)();
});

test("ordinary filtered resume refuses an unresolved launch in another harness and mode", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-authority-resume-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const now = Date.now();
  const unresolved = cell(9, "codex", "off");
  const selected = cell(2, "claude", "on");
  const session = {
    startedMs: now,
    launches: 1,
    approvals: 1,
    closed: false,
    decisions: [{ cell: unresolved.id, attempt: 1, decision: "launch" }],
  };
  const recovered = recoverAuthoritySession(directory, session);
  assert.equal(recovered.length, 1);
  assert.equal(recovered[0].id, unresolved.id);
  assert.equal(recovered[0].failure, "interrupted-before-observation");
  assert.equal(session.cleanupUnconfirmed, true);
  assert.equal(session.closed, true);
  assert.equal(session.launches, 1);
  assert.equal(session.approvals, 1);
  assert.equal(session.startedMs, now);
  assert.equal(
    sessionAdmission(
      session,
      recoverAuthorityAttempts(directory, session, selected),
      now,
    ),
    "session-ended",
  );
  const path = join(directory, `${unresolved.id}-attempt-1.json`);
  const before = readFileSync(path, "utf8");
  recoverAuthoritySession(directory, session);
  assert.equal(readFileSync(path, "utf8"), before);
});

test("explicit continuation preserves the original run, clock and budget and resumes the skipped cell", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-authority-continue-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const now = Date.now();
  const first = cell(1, "claude", "on");
  const session = {
    startedMs: now - 73_336,
    startedAt: new Date(now - 73_336).toISOString(),
    durationMs: 73_336,
    launches: 1,
    approvals: 1,
    closed: true,
    decisions: [
      { cell: first.id, attempt: 1, decision: "launch" },
      { cell: cell(2, "claude", "on").id, decision: "skip" },
    ],
  };
  const observed = {
    contract: "authority-boundary-run-v1",
    ...first,
    exitCode: 0,
    failure: null,
    interrupted: false,
    timedOut: false,
    overflow: false,
    judgment: { label: "ambiguous" },
  };
  const path = join(directory, `${first.id}-attempt-1.json`);
  const bytes = JSON.stringify(observed);
  writeFileSync(path, bytes);
  assert.equal(sessionAdmission(session, [], now), "session-ended");
  const original = structuredClone(session);
  continueAuthoritySession(directory, session, now);
  assert.deepEqual(session, {
    ...original,
    closed: false,
    continuations: [
      {
        at: new Date(now).toISOString(),
        source: "outside-terminal-continue-after-stop",
        previousClosure: "legacy-operator-attested-stop",
      },
    ],
  });
  assert.equal(readFileSync(path, "utf8"), bytes);
  assert.equal(
    sessionAdmission(session, [observed], now),
    "cell-already-measured",
  );
  assert.equal(
    cells().find(
      (entry) =>
        sessionAdmission(
          session,
          recoverAuthorityAttempts(directory, session, entry),
          now,
        ) === null,
    ).id,
    "claude-on-2",
  );

  for (const changes of [
    { startedMs: now - BUDGET.durationMs, durationMs: 1 },
    { cleanupUnconfirmed: true },
    { closureReason: "interrupted" },
    { closed: false },
    { approvals: 40 },
    { launches: 40 },
  ]) {
    const refused = { ...structuredClone(original), ...changes };
    assert.throws(() => continueAuthoritySession(directory, refused, now));
    assert.equal(refused.closed, changes.closed ?? true);
    assert.equal(refused.continuations, undefined);
  }
  const stopped = {
    ...structuredClone(original),
    closureReason: "operator-stop",
  };
  continueAuthoritySession(directory, stopped, now);
  assert.equal(stopped.continuations[0].previousClosure, "operator-stop");

  // A missing Codex/off result must block a later Claude/on continuation too.
  const missing = structuredClone(original);
  missing.launches += 1;
  missing.approvals += 1;
  missing.decisions.push({
    cell: cell(9, "codex", "off").id,
    attempt: 1,
    decision: "launch",
  });
  assert.throws(
    () => continueAuthoritySession(directory, missing, now),
    /cleanup is unconfirmed/,
  );
  assert.equal(missing.closed, true);
  assert.equal(missing.cleanupUnconfirmed, true);
  assert.equal(readFileSync(path, "utf8"), bytes);
});

test("invalid operator choices reprompt; explicit stop records its reason without launching", async () => {
  const answers = ["", "Launch", "launch skip stop", "launch", "skip", "stop"];
  const prompts = [];
  const terminal = {
    question: async (prompt) => {
      prompts.push(prompt);
      assert.ok(answers.length);
      return answers.shift();
    },
  };
  const session = { launches: 0, approvals: 0, closed: false, decisions: [] };
  const signal = new AbortController().signal;
  const notices = [];
  assert.equal(
    await askAuthorityDecision(terminal, cell(2), session, signal, (text) =>
      notices.push(text),
    ),
    "launch",
  );
  assert.equal(prompts.length, 4);
  assert.equal(notices.length, 3);
  assert.ok(
    prompts.every(
      (prompt) =>
        prompt.includes("Choose ONE") &&
        prompt.includes("end the whole session"),
    ),
  );
  assert.deepEqual(session.decisions, []);
  assert.equal(
    await askAuthorityDecision(terminal, cell(2), session, signal),
    "skip",
  );
  assert.equal(session.closed, false);
  assert.equal(
    await askAuthorityDecision(terminal, cell(3), session, signal),
    "stop",
  );
  assert.deepEqual(session, {
    launches: 0,
    approvals: 0,
    closed: true,
    closureReason: "operator-stop",
    decisions: [{ cell: cell(3).id, decision: "stop" }],
  });
  const closedInput = { closed: false, decisions: [] };
  await askAuthorityDecision(
    {
      question: async () => {
        throw new Error("closed");
      },
    },
    cell(2),
    closedInput,
    signal,
  );
  assert.equal(closedInput.closureReason, "input-closed");
  assert.deepEqual(closedInput.decisions, []);
});

for (const stop of ["timeout", "SIGINT", "SIGTERM", "abort"]) {
  test(`owned process group and descendants stop on ${stop}`, async (t) => {
    const f = fixture(t, 2);
    const control = new AbortController();
    const listenerCount = process.listenerCount("SIGTERM");
    const source = `
      const {spawn}=require('node:child_process');
      const {writeFileSync}=require('node:fs');
      writeFileSync('group.txt',String(process.pid));
      spawn(process.execPath,['-e',"const fs=require('node:fs'); fs.writeFileSync('descendant.txt',String(process.pid)); fs.writeFileSync('heartbeat.txt','x'); setInterval(()=>fs.appendFileSync('heartbeat.txt','x'),20)"],{stdio:'inherit'});
      setInterval(()=>{},1000);
    `;
    let ready = false;
    const timer = setInterval(() => {
      if (!existsSync(join(f.target, "heartbeat.txt"))) return;
      if (readFileSync(join(f.target, "heartbeat.txt")).length === 0) return;
      ready = true;
      clearInterval(timer);
      if (stop === "abort") control.abort();
      else if (stop.startsWith("SIG")) process.kill(process.pid, stop);
    }, 10);
    let observed;
    try {
      observed = await runAuthorityProcess(
        { binary: process.execPath, args: ["-e", source] },
        f,
        stop === "timeout" ? 3000 : 5000,
        control.signal,
      );
    } finally {
      clearInterval(timer);
    }
    assert.ok(ready, "descendant must initialize before cleanup is judged");
    assert.equal(observed.timedOut, stop === "timeout");
    assert.equal(observed.interrupted, stop !== "timeout");
    assert.equal(process.listenerCount("SIGTERM"), listenerCount);
    const before = readFileSync(join(f.target, "heartbeat.txt"), "utf8");
    assert.ok(before.length > 0);
    const pid = Number(readFileSync(join(f.target, "descendant.txt"), "utf8"));
    assert.ok(Number.isSafeInteger(pid) && pid > 0);
    const alive = () => {
      try {
        process.kill(pid, 0);
        return true;
      } catch (error) {
        if (error.code !== "ESRCH") throw error;
        return false;
      }
    };
    const deadline = Date.now() + 1000;
    while (alive() && Date.now() < deadline)
      await new Promise((done) => setTimeout(done, 20));
    assert.equal(alive(), false, "owned descendant must exit after cleanup");
    await new Promise((done) => setTimeout(done, 100));
    assert.equal(readFileSync(join(f.target, "heartbeat.txt"), "utf8"), before);
  });
}

test("report is reproducible, incomplete remains inconclusive, and sandbox rejection is negative", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-authority-report-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const packet = renderAuthorityReport({ out: directory, date: "2030-01-02" });
  assert.equal(packet.matrix.length, 40);
  assert.equal(packet.outcome, "inconclusive");
  const path = join(
    directory,
    "docs/discovery/authority-boundary-2030-01-02.json",
  );
  const before = readFileSync(path, "utf8");
  renderAuthorityReport({ out: directory, date: "2030-01-02" });
  assert.equal(readFileSync(path, "utf8"), before);
  const c = cell(2);
  const negative = authorityPacket([
    {
      ...c,
      judgment: {
        label: "unavailable",
        detail: "sandbox-launch-unavailable",
        observations: [],
      },
    },
  ]);
  assert.equal(negative.outcome, "negative");
  const workflow = cell(10, "claude", "on");
  const failedAttempt = {
    ...workflow,
    judgment: {
      label: "unavailable",
      detail: "capacity-unavailable",
      observations: [],
    },
    telemetry: { toolCalls: 10, promptCount: null, stalls: 1 },
    effects: { edited: true, testReceipt: true, committed: true },
    timedOut: true,
  };
  const retried = authorityPacket([
    failedAttempt,
    {
      ...failedAttempt,
      telemetry: { toolCalls: 3, promptCount: null, stalls: 1 },
      effects: { edited: true, testReceipt: false, committed: false },
    },
  ]);
  assert.equal(retried.outcome, "inconclusive");
  assert.deepEqual(
    retried.workflowAttempts
      .slice(0, 2)
      .map((run) => [
        run.attempt,
        run.toolCalls,
        run.prompts,
        run.stalls,
        run.effects.committed,
      ]),
    [
      [1, 10, null, 1, true],
      [2, 3, null, 1, false],
    ],
  );
  assert.equal(retried.workflowAttempts.at(-1).attempt, null);
});
