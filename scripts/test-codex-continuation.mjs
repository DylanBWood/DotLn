import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { sha256Hex as digest } from "./lib/helpers.mjs";
import { spawnGit } from "./lib/git.mjs";
import test from "node:test";
import assert from "node:assert/strict";

import {
  existsSync,
  realpathSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { codexContinuation } from "../packages/compiler/src/codex-continuation.mjs";
import { operatorControl } from "../packages/compiler/src/operator-control.mjs";
import {
  harnessSessionPhase,
  harnessWorkerWords,
  lowerToHarness,
  operatorMessageClass,
} from "../packages/compiler/dist/src/index.js";
import * as harnessHost from "../packages/skeleton/dist/src/harness-host.js";
import {
  contributorConfiguredProgram,
  contributorProfiles,
} from "../packages/skeleton/dist/src/loadouts/contributor.js";
import { personalFeedback } from "../packages/skeleton/dist/src/loadouts/feedback.js";

test("Codex generated entry restores context and continues through the emitted native JSON contract", async () => {
  const program = contributorConfiguredProgram();
  const installation = lowerToHarness(
    program,
    personalFeedback(),
    program.loadout.authorityEnvelope,
    contributorProfiles.find((profile) => profile.harness === "codex-cli"),
  );
  const entry = installation.files.find(
    (file) => file.path === ".codex/hooks/continuation.mjs",
  );
  const config = JSON.parse(
    installation.files.find((file) => file.path === ".codex/hooks.json")
      .contents,
  );
  assert.deepEqual(Object.keys(config.hooks), [
    "PostCompact",
    "SessionStart",
    "Stop",
    "UserPromptSubmit",
  ]);
  assert.equal(config.hooks.SessionStart[0].matcher, "^compact$");
  assert.ok(
    installation.files.some((file) => file.path === ".codex/config.toml"),
  );
  await fixture(async ({ root, input }) => {
    const path = join(root, "generated-hook.mjs");
    writeFileSync(path, entry.contents);
    const invoke = (event, extra) => {
      const result = spawnSync(process.execPath, [path], {
        cwd: root,
        encoding: "utf8",
        input: JSON.stringify({ ...input, hook_event_name: event, ...extra }),
        timeout: 15000,
      });
      assert.equal(result.status, 0, result.stderr);
      return JSON.parse(result.stdout);
    };
    assert.deepEqual(invoke("PostCompact", { trigger: "auto" }), {});
    assert.match(
      invoke("SessionStart", { source: "compact" }).hookSpecificOutput
        .additionalContext,
      /WO-999/,
    );
    assert.equal(invoke("Stop", { stop_hook_active: false }).decision, "block");
    assert.deepEqual(invoke("Stop", { stop_hook_active: true }), {});
    assert.deepEqual(invoke("Stop", { stop_hook_active: false }), {});
  });
});
async function fixture(run) {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-codex-continuation-")),
  );
  assert.equal(spawnGit(["init", "--quiet"], { cwd: root }).status, 0);
  excludeFixtureOwnership(root);
  assert.equal(
    spawnGit(["rev-parse", "--show-toplevel"], {
      cwd: root,
      encoding: "utf8",
    }).stdout.trim(),
    root,
  );
  const sessionId = `fixture-${root.split("/").at(-1)}`;
  const key = digest(sessionId),
    directory = join(root, "docs/control/local/harness");
  mkdirSync(directory, { recursive: true });
  mkdirSync(join(root, "scripts"));
  mkdirSync(join(root, "docs/control/orders"));
  const state = {
    task: { workOrder: "WO-999", phase: "active" },
    writer: { reserved: true, actorId: key },
  };
  const session = {
    role: "executor",
    workOrder: "WO-999",
    expectedEvent: "ImplementationReady",
    startingEventCount: 1,
  };
  const writeState = () =>
    writeFileSync(join(root, "fixture-state.json"), JSON.stringify(state));
  const writeSession = () =>
    writeFileSync(join(directory, `${key}.json`), JSON.stringify(session));
  writeState();
  writeSession();
  writeFileSync(
    join(root, "docs/control/orders/WO-999.jsonl"),
    JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
      "\n",
  );
  for (const [name, field, args] of [
    ["resume", "task", ["status", "--json"]],
    ["harness", "writer", ["writer", "--show"]],
  ])
    writeFileSync(
      join(root, `scripts/${name}.mjs`),
      `import fs from 'node:fs'; import assert from 'node:assert/strict'; assert.deepEqual(process.argv.slice(2),${JSON.stringify(args)}); console.log(JSON.stringify(JSON.parse(fs.readFileSync('fixture-state.json','utf8')).${field}));\n`,
    );
  const input = { cwd: root, session_id: sessionId, turn_id: "turn-1" };
  // The generated entry passes the compiler's classifier; a fixture may pass
  // the real harness runtime, which owns writer reservations.
  const hook = (event, extra = {}, loadRuntime) =>
    codexContinuation(
      { ...input, hook_event_name: event, ...extra },
      operatorControl,
      (prompt) => operatorMessageClass(prompt),
      loadRuntime,
      harnessSessionPhase,
      (prompt) => harnessWorkerWords(prompt),
    );
  const compact = async () => {
    await hook("PostCompact", { trigger: "auto" });
    return hook("SessionStart", { source: "compact" });
  };
  try {
    await run({
      root,
      directory,
      key,
      session,
      state,
      writeState,
      writeSession,
      input,
      hook,
      compact,
    });
  } finally {
    await operatorControl(
      { session_id: sessionId, prompt: "analysis: off" },
      "UserPromptSubmit",
    );
    rmSync(root, { recursive: true, force: true });
  }
}

test("Codex compaction restores the owned task and continues once without dispatching or releasing its writer", async () =>
  fixture(async ({ root, directory, hook, compact }) => {
    const control = readFileSync(
      join(root, "docs/control/orders/WO-999.jsonl"),
      "utf8",
    );
    const ownership = readFileSync(join(root, "fixture-state.json"), "utf8");
    assert.deepEqual(await hook("SessionStart", { source: "startup" }), {});
    assert.deepEqual(await hook("Stop", { stop_hook_active: false }), {});
    const restored = await compact();
    assert.equal(restored.hookSpecificOutput.hookEventName, "SessionStart");
    assert.match(
      restored.hookSpecificOutput.additionalContext,
      /WO-999.*ImplementationReady/,
    );
    assert.match(
      restored.hookSpecificOutput.additionalContext,
      /already answered side question/,
    );
    const continued = await hook("Stop", { stop_hook_active: false });
    assert.equal(continued.decision, "block");
    assert.match(continued.reason, /Continue the authorized unfinished task/);
    assert.deepEqual(await hook("Stop", { stop_hook_active: true }), {});
    assert.deepEqual(await hook("Stop", { stop_hook_active: false }), {});
    await compact();
    assert.deepEqual(
      await hook("Stop", { stop_hook_active: false }),
      {},
      "duplicate compact delivery cannot rearm a consumed turn",
    );
    assert.equal(
      readFileSync(join(root, "docs/control/orders/WO-999.jsonl"), "utf8"),
      control,
    );
    assert.equal(
      readFileSync(join(root, "fixture-state.json"), "utf8"),
      ownership,
    );
    assert.equal(
      readdirSync(directory).filter((name) =>
        name.includes(".codex-continued-"),
      ).length,
      1,
    );
  }));

test("Codex conversation text does not control compaction recovery", async () => {
  await fixture(async ({ directory, hook, compact }) => {
    // The prompt hook journals what was said; it writes no continuation
    // record or receipt and decides nothing.
    const recovery = () =>
      readdirSync(directory).filter((name) =>
        /\.codex-(?:continuation|continued-|probe-)/u.test(name),
      );
    const before = recovery();
    for (const prompt of [
      "Stop, that's wrong",
      "no, stop",
      "Actually stop",
      "stop?",
      "Don’t continue",
      "pause",
      "GO",
      "What remains?",
      "conversation only: status",
    ]) {
      assert.deepEqual(await hook("UserPromptSubmit", { prompt }), {});
      assert.deepEqual(recovery(), before);
    }
    assert.ok((await compact()).hookSpecificOutput);
  });
});

const journalRows = (path) =>
  readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);

test("WO-255 a Codex dispatch line journals the worker options it names for the session's launches, and an ordinary message selects nothing", async () =>
  fixture(async ({ directory, key, hook }) => {
    for (const prompt of [
      "planning: standard pass, astra",
      "resume: next fable",
      "resume: next",
      "use astra for the reviews",
    ])
      await hook("UserPromptSubmit", { prompt });
    const selected = journalRows(join(directory, `${key}.jsonl`)).filter(
      (row) => row.typedEvent === "WorkerOptionsSelected",
    );
    assert.deepEqual(
      selected.map(({ options, source }) => [options, source]),
      [
        [{ codex: "astra" }, "codex-prompt-hook"],
        [{ claude: "fable" }, "codex-prompt-hook"],
        [{}, "codex-prompt-hook"],
      ],
    );
  }));

test("WO-255 a checkout's first Codex dispatch line makes its journal lane and keeps the selection, an ordinary message makes nothing, and no lane is made through a link", async () =>
  fixture(async ({ root, directory, key, hook }) => {
    // A checkout that has never held a journal: no local control lane.
    const local = join(root, "docs/control/local");
    rmSync(local, { recursive: true, force: true });
    await hook("UserPromptSubmit", { prompt: "use astra for the reviews" });
    assert.equal(existsSync(local), false, "an ordinary message makes no lane");
    await hook("UserPromptSubmit", {
      prompt: "planning: standard pass, astra",
    });
    assert.deepEqual(
      journalRows(join(directory, `${key}.jsonl`))
        .filter((row) => row.typedEvent === "WorkerOptionsSelected")
        .map(({ options, source }) => [options, source]),
      [[{ codex: "astra" }, "codex-prompt-hook"]],
    );
    // A local control lane that is a link leads nowhere the hook writes.
    rmSync(local, { recursive: true, force: true });
    const elsewhere = realpathSync(
      createFixtureRoot(join(tmpdir(), "dotln-codex-elsewhere-")),
    );
    try {
      symlinkSync(elsewhere, local);
      await hook("UserPromptSubmit", { prompt: "resume: status astra" });
      // Only the fixture root's own ownership marker is there.
      assert.deepEqual(
        readdirSync(elsewhere).filter((name) => name !== ".dotln-owner.json"),
        [],
      );
    } finally {
      rmSync(elsewhere, { recursive: true, force: true });
    }
  }));

test("WO-254 Codex operator instructions are captured with their form class and restored verbatim after a compaction, and the first reply is probed", async () =>
  fixture(async ({ root, directory, key, hook, compact }) => {
    const instruction = "pause before the final gate";
    const request = "could you pause before the final gate?";
    for (const prompt of [instruction, request])
      assert.deepEqual(await hook("UserPromptSubmit", { prompt }), {});
    const observed = journalRows(join(directory, `${key}.jsonl`)).filter(
      (row) => row.typedEvent === "OperatorMessageObserved",
    );
    assert.deepEqual(
      observed.map(({ source, class: kind, prefix, digest: sha, bytes }) => ({
        source,
        kind,
        prefix,
        sha,
        bytes,
      })),
      [
        {
          source: "codex-prompt-hook",
          kind: "unclassified",
          prefix: null,
          sha: digest(instruction),
          bytes: Buffer.byteLength(instruction),
        },
        {
          source: "codex-prompt-hook",
          kind: "question",
          prefix: null,
          sha: digest(request),
          bytes: Buffer.byteLength(request),
        },
      ],
    );
    assert.ok(
      observed.every((row) => !JSON.stringify(row).includes("pause")),
      "the metadata journal holds no message text",
    );
    assert.deepEqual(
      journalRows(join(directory, `${key}.codex-messages.jsonl`)).map(
        ({ kind, class: form, text }) => ({ kind, form, text }),
      ),
      [
        { kind: "operator", form: "unclassified", text: instruction },
        { kind: "operator", form: "question", text: request },
      ],
    );
    const context = (await compact()).hookSpecificOutput.additionalContext;
    const task = context.indexOf("is still outstanding.");
    assert.ok(task > 0, context);
    assert.ok(
      context.indexOf(instruction) > task &&
        context.indexOf(request) > context.indexOf(instruction),
      `both messages follow the task sentence verbatim, oldest first: ${context}`,
    );
    assert.match(
      context,
      /\[1\] unclassified, .*:\npause before the final gate\n\[2\] question, .*:\ncould you pause before the final gate\?/u,
    );
    // The turn's transcript holds a reply before the compaction, then the
    // first reply after it, tool work and a later final reply: the probe
    // names the first after the compaction, not the stop's last message.
    const reply = "Paused before the final gate; awaiting the operator.";
    const final = "The final gate waits for the operator's word.";
    const transcript = join(root, "fixture-transcript.jsonl");
    const said = (at, text, phase) => ({
      timestamp: at,
      type: "response_item",
      payload: {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text }],
        phase,
      },
    });
    writeFileSync(
      transcript,
      [
        said(
          "2030-01-02T10:00:00.000Z",
          "a reply before the compaction",
          "commentary",
        ),
        {
          timestamp: "2030-01-02T10:00:01.000Z",
          type: "compacted",
          payload: { message: "" },
        },
        {
          timestamp: "2030-01-02T10:00:02.000Z",
          type: "response_item",
          payload: { type: "reasoning", summary: [] },
        },
        said("2030-01-02T10:00:03.000Z", reply, "commentary"),
        {
          timestamp: "2030-01-02T10:00:04.000Z",
          type: "response_item",
          payload: { type: "function_call", name: "shell", arguments: "{}" },
        },
        said("2030-01-02T10:00:05.000Z", final, "final_answer"),
      ]
        .map((row) => JSON.stringify(row))
        .join("\n") + "\n",
    );
    assert.equal(
      (
        await hook("Stop", {
          stop_hook_active: false,
          last_assistant_message: final,
          transcript_path: transcript,
        })
      ).decision,
      "block",
    );
    const probes = journalRows(join(directory, `${key}.jsonl`)).filter(
      (row) => row.compactionProbe,
    );
    assert.equal(probes.length, 1);
    assert.deepEqual(
      {
        sessionKey: probes[0].compactionProbe.sessionKey,
        turnId: probes[0].compactionProbe.turnId,
        task: probes[0].compactionProbe.task,
        reply: probes[0].compactionProbe.firstAssistantMessage,
      },
      {
        sessionKey: key,
        turnId: "turn-1",
        task: {
          workOrder: "WO-999",
          role: "executor",
          expectedEvent: "ImplementationReady",
        },
        reply: {
          source: "transcript",
          phase: "commentary",
          at: "2030-01-02T10:00:03.000Z",
          digest: digest(reply),
          bytes: Buffer.byteLength(reply),
          excerpt: reply,
        },
      },
      "the probe names the first reply after the compaction against the saved task",
    );
    await hook("Stop", {
      stop_hook_active: true,
      last_assistant_message: "a later reply",
    });
    assert.equal(
      journalRows(join(directory, `${key}.jsonl`)).filter(
        (row) => row.compactionProbe,
      ).length,
      1,
      "only the first reply after the compaction is probed",
    );
  }));

test("WO-254 every operator message since the dispatch is restored verbatim, however many and however long; a capture never splits a character; without a transcript the probe names the stop's message as such", async () =>
  fixture(async ({ directory, key, hook, compact }) => {
    const instruction = "pause before the final gate";
    const request = "could you pause before the final gate?";
    // Two long messages whose instructions sit in their tails, past half of
    // 64 KiB, and many short ones after them.
    const tailed = (letter, tail) =>
      `${letter.repeat(40 * 1024 - Buffer.byteLength(tail))}${tail}`;
    const long = [
      tailed("x", "then rerun the release suite"),
      tailed("y", "and keep the review reports"),
    ];
    const short = Array.from(
      { length: 200 },
      (_, index) =>
        `ordinary message ${String(index).padStart(3, "0")} of the dispatch`,
    );
    for (const prompt of [instruction, request, ...long, ...short])
      assert.deepEqual(await hook("UserPromptSubmit", { prompt }), {});
    const context = (await compact()).hookSpecificOutput.additionalContext;
    assert.match(
      context,
      /\[1\] unclassified, [^\n]*:\npause before the final gate\n/u,
    );
    assert.match(
      context,
      /\[2\] question, [^\n]*:\ncould you pause before the final gate\?\n/u,
    );
    for (const text of [...long, ...short])
      assert.ok(context.includes(`:\n${text}`), "every message is whole");
    assert.doesNotMatch(context, /cut here|for size/u);
    assert.ok(
      context.indexOf(short.at(-1)) > context.indexOf(long[1]),
      "oldest first",
    );
    // A capture cut inside a two-byte character keeps only whole characters.
    await hook("UserPromptSubmit", { prompt: `${"a".repeat(65535)}é` });
    const captured = journalRows(
      join(directory, `${key}.codex-messages.jsonl`),
    ).at(-1);
    assert.equal(captured.truncated, true);
    assert.equal(captured.text, "a".repeat(65535));
    await hook("Stop", {
      stop_hook_active: false,
      last_assistant_message: "the stop's own message",
    });
    const probe = journalRows(join(directory, `${key}.jsonl`)).find(
      (row) => row.compactionProbe,
    ).compactionProbe.firstAssistantMessage;
    assert.deepEqual(
      { source: probe.source, phase: probe.phase, at: probe.at },
      { source: "stop-last-message", phase: null, at: null },
    );
  }));

test("WO-254 a repair session's message is journaled in the repair phase, and a capture that cannot be written still reserves the writer", async () =>
  fixture(
    async ({ root, directory, key, session, writeSession, input, hook }) => {
      session.intent = "resume: fix";
      session.expectedEvent = "RepairCompleted";
      writeSession();
      // The capture's lane file is a directory here, so its append fails.
      mkdirSync(join(directory, `${key}.codex-messages.jsonl`));
      const reserved = [];
      const runtime = async () => ({
        reserveCodexDispatchWriter: (where, id) => reserved.push([where, id]),
      });
      assert.deepEqual(
        await hook("UserPromptSubmit", { prompt: "keep going" }, runtime),
        {},
      );
      const row = journalRows(join(directory, `${key}.jsonl`)).find(
        (entry) => entry.typedEvent === "OperatorMessageObserved",
      );
      assert.equal(row.phase, "repair");
      assert.equal(
        harnessSessionPhase({ intent: "resume: fix", role: "executor" }),
        "repair",
      );
      assert.deepEqual(reserved, [[root, input.session_id]]);
    },
  ));

test("WO-254 a stopped Codex turn lets its writer go and the next prompt of its outstanding dispatch reserves it again, naming a foreign holder without refusing", async () =>
  fixture(async ({ root, directory, key, hook }) => {
    const runtime = async () => harnessHost;
    const view = () => harnessHost.harnessWriterView(root);
    const sessionId = `fixture-${root.split("/").at(-1)}`;
    // A host that has delivered no prompt event keeps today's reservation.
    harnessHost.seedHarnessWriter(root, {
      actorId: key,
      worktree: root,
      owner: { source: "thread" },
      reservedAt: "2026-11-04T10:28:47.334Z",
    });
    assert.deepEqual(
      await hook("Stop", { stop_hook_active: false }, runtime),
      {},
    );
    assert.equal(view().actorId, key, "no prompt hook observed, no release");
    // Once the prompt hook is observed, a turn that stops releases and
    // journals the stop; the next prompt reserves again.
    await hook("UserPromptSubmit", { prompt: "continue" }, runtime);
    assert.equal(view().actorId, key);
    assert.deepEqual(
      await hook("Stop", { stop_hook_active: false }, runtime),
      {},
    );
    assert.equal(
      view().reserved,
      false,
      "the stopped turn released its writer",
    );
    const stop = journalRows(join(directory, `${key}.jsonl`)).find(
      (row) => row.dispatchStopped,
    )?.dispatchStopped;
    assert.deepEqual(
      (({
        role,
        workOrder,
        command,
        writerHeld,
        writerReleased,
        dispatchOutstanding,
      }) => ({
        role,
        workOrder,
        command,
        writerHeld,
        writerReleased,
        dispatchOutstanding,
      }))(stop ?? {}),
      {
        role: "executor",
        workOrder: "WO-999",
        command: "turn",
        writerHeld: true,
        writerReleased: true,
        dispatchOutstanding: true,
      },
    );
    assert.deepEqual(
      await hook("UserPromptSubmit", { prompt: "carry on" }, runtime),
      {},
    );
    assert.deepEqual(
      (({ reserved, actorId }) => ({ reserved, actorId }))(view()),
      { reserved: true, actorId: key },
      "the resumed turn of an outstanding dispatch holds its writer again",
    );
    // Another session took the worktree between turns: the prompt is
    // admitted and told so; nothing is refused or replaced.
    harnessHost.releaseHarnessWriter(root, {
      cwd: root,
      session_id: sessionId,
      hook_event_name: "Stop",
    });
    const foreign = digest("another-claude-session");
    harnessHost.seedHarnessWriter(root, {
      actorId: foreign,
      worktree: root,
      owner: { pid: process.pid, source: "CLAUDE_PID" },
      reservedAt: "2026-11-04T10:46:35.397Z",
    });
    const noted = await hook("UserPromptSubmit", { prompt: "go on" }, runtime);
    assert.equal(noted.decision, undefined);
    assert.match(
      noted.hookSpecificOutput.additionalContext,
      /does not hold this worktree's writer.*reserved by another session \(actor [0-9a-f]{12}; host process \d+/su,
    );
    assert.equal(view().actorId, foreign, "the foreign holder is untouched");
    harnessHost.releaseHarnessWriter(root, {
      cwd: root,
      session_id: "another-claude-session",
      hook_event_name: "Stop",
    });
  }));

test("Codex wakes an unfinished work order after compaction and an old-message reply", async () =>
  fixture(async ({ root, input, hook, compact }) => {
    await hook("UserPromptSubmit", {
      prompt: "conversation only: what is the status?",
    });
    // The side question was answered earlier; the same task/turn then compacts.
    const restored = await compact();
    assert.match(
      restored.hookSpecificOutput.additionalContext,
      /WO-999.*ImplementationReady/,
    );
    const continued = await hook("Stop", {
      stop_hook_active: false,
      last_assistant_message: "The work order is still in progress.",
    });
    assert.equal(continued.decision, "block");
    assert.match(continued.reason, /Continue the authorized unfinished task/);
    assert.match(continued.reason, /already answered side question/);
    assert.deepEqual(await hook("Stop", { stop_hook_active: true }), {});
    // Completing the task prevents later compaction from restoring stale work.
    writeFileSync(
      join(root, "docs/control/orders/WO-999.jsonl"),
      readFileSync(join(root, "docs/control/orders/WO-999.jsonl"), "utf8") +
        JSON.stringify({ type: "ImplementationReady", workOrderId: "WO-999" }) +
        "\n",
    );
    input.turn_id = "completed-turn";
    assert.deepEqual(await compact(), {});
    assert.deepEqual(await hook("Stop", { stop_hook_active: false }), {});
  }));

test("Codex recovery controls arriving during task observation suppress continuation", async () => {
  for (const event of ["PostCompact", "SessionStart", "Stop"])
    await fixture(async ({ input, hook, compact }) => {
      await compact();
      let calls = 0;
      const result = await codexContinuation(
        {
          ...input,
          hook_event_name: event,
          trigger: "auto",
          source: "compact",
          stop_hook_active: false,
        },
        async (value, currentEvent) => {
          if (++calls === 2)
            await operatorControl(
              { ...value, prompt: "analysis: inspect" },
              "UserPromptSubmit",
            );
          return operatorControl(value, currentEvent);
        },
      );
      assert.equal(result.decision, undefined);
      assert.match(result.systemMessage, /Pause/);
      assert.equal(
        (await hook("Stop", { stop_hook_active: false })).decision,
        undefined,
      );
    });
});

test("Codex side questions do not replace unfinished work; analysis and override always suppress automatic continuation", async () => {
  await fixture(async ({ hook, compact }) => {
    await compact();
    await hook("UserPromptSubmit", {
      prompt: "conversation only: explain the changes",
    });
    assert.equal(
      (await hook("Stop", { stop_hook_active: false })).decision,
      "block",
    );
  });
  for (const prompt of [
    "analysis: inspect this first",
    "operator override: recover",
  ])
    await fixture(async ({ hook, compact }) => {
      await compact();
      assert.match(
        (await hook("UserPromptSubmit", { prompt })).systemMessage,
        /operator-control/,
      );
      assert.equal(
        (await hook("Stop", { stop_hook_active: false })).decision,
        undefined,
      );
      assert.match(
        (await compact()).hookSpecificOutput.additionalContext,
        /Pause|suspended/,
      );
    });
});

test("Codex completed, foreign, absent and malformed task identities never request continuation", async () => {
  for (const change of [
    ({ state }) => {
      state.task.phase = "ready-to-verify";
    },
    ({ state }) => {
      state.task.workOrder = "WO-998";
    },
    ({ state }) => {
      state.writer.actorId = "another-session";
    },
    ({ state }) => {
      state.writer.reserved = false;
    },
    ({ session }) => {
      session.role = "planner";
    },
    ({ session }) => {
      session.startingEventCount = -1;
    },
    ({ session }) => {
      session.startingEventCount = 99;
    },
    ({ root }) => {
      writeFileSync(
        join(root, "docs/control/orders/WO-999.jsonl"),
        JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
          "\n" +
          JSON.stringify({
            type: "ImplementationReady",
            workOrderId: "WO-999",
          }) +
          "\n",
      );
    },
  ])
    await fixture(async (context) => {
      await context.compact();
      change(context);
      context.writeState();
      context.writeSession();
      assert.deepEqual(
        await context.hook("SessionStart", { source: "compact" }),
        {},
      );
      assert.deepEqual(
        await context.hook("Stop", { stop_hook_active: false }),
        {},
      );
    });
  await fixture(async ({ directory, key, hook }) => {
    rmSync(join(directory, `${key}.json`));
    assert.deepEqual(await hook("PostCompact", { trigger: "auto" }), {});
    writeFileSync(join(directory, `${key}.json`), "bad json");
    const result = await hook("Stop", { stop_hook_active: false });
    assert.equal(result.decision, undefined);
    assert.match(result.systemMessage, /unavailable/);
  });
});

test("Codex root continuation ignores subagent events, unobserved turns, and corrupt continuation records", async () =>
  fixture(async ({ directory, key, hook, compact }) => {
    assert.deepEqual(
      await hook("PostCompact", { trigger: "auto", agent_id: "child" }),
      {},
    );
    assert.deepEqual(await hook("Stop", { stop_hook_active: false }), {});
    await compact();
    assert.deepEqual(
      await hook("Stop", { stop_hook_active: false, turn_id: "other-turn" }),
      {},
    );
    writeFileSync(
      join(directory, `${key}.codex-continuation.json`),
      '{"version":88}',
    );
    const result = await hook("Stop", { stop_hook_active: false });
    assert.equal(result.decision, undefined);
    assert.match(result.systemMessage, /unavailable/);
  }));
