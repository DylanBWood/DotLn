import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  realpathSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { codexContinuation } from "../packages/compiler/src/codex-continuation.mjs";
import { operatorControl } from "../packages/compiler/src/operator-control.mjs";

const digest = (text) => createHash("sha256").update(text).digest("hex");

test("generated JavaScript harness surfaces agree with the repository format policy", async () => {
  const { harnessInstallation } = await import("./lib/harness.mjs");
  const paths = harnessInstallation()
    .files.map((file) => file.path)
    .filter((path) => path.endsWith(".mjs"));
  assert.ok(paths.includes(".codex/hooks/continuation.mjs"));
  const result = spawnSync(
    process.execPath,
    ["node_modules/prettier/bin/prettier.cjs", "--check", ...paths],
    { encoding: "utf8", timeout: 30000 },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("Codex generated entry restores context and continues through the emitted native JSON contract", async () => {
  const { harnessInstallation } = await import("./lib/harness.mjs");
  const installation = harnessInstallation();
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
    mkdtempSync(join(tmpdir(), "dotln-codex-continuation-")),
  );
  assert.equal(spawnSync("git", ["init", "--quiet"], { cwd: root }).status, 0);
  assert.equal(
    spawnSync("git", ["rev-parse", "--show-toplevel"], {
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
  const hook = (event, extra = {}) =>
    codexContinuation(
      { ...input, hook_event_name: event, ...extra },
      operatorControl,
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
    const before = readdirSync(directory);
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
      assert.deepEqual(readdirSync(directory), before);
    }
    assert.ok((await compact()).hookSpecificOutput);
  });
});

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
