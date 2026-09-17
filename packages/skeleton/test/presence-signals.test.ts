import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  mkdirSync,
  writeFileSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { decodeLog } from "@dotln/kernel";
import { lowerToHarness, fnv1a64 } from "@dotln/compiler";
import {
  contributorProfiles,
  contributorProgram,
} from "../src/loadouts/contributor.js";
import { personalFeedback } from "../src/loadouts/feedback.js";
import { ResidentHost } from "../src/resident-host.js";
import {
  ResidentStore,
  recordPresence,
  recordPresenceObservation,
  replayResident,
} from "../src/resident-store.js";
import {
  decodeResidentConfiguration,
  type ResidentState,
} from "../src/resident-state.js";
import {
  actorCatalog,
  scriptAvailability,
  type ActorResult,
} from "../src/actor-catalog.js";
import {
  classifyPresenceSignal,
  decodePresenceObservation,
  PRESENCE_HOOK_EVENTS,
  type PresenceSignal,
} from "../src/presence-signals.js";
import { recordHarnessHeartbeat } from "../src/presence-heartbeat.js";

const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo067-presence.json", import.meta.url),
    "utf8",
  ),
);
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const result: ActorResult = {
  exitCode: 0,
  signal: null,
  stdoutSha256: digest("ok\n"),
  firstLine: "ok",
  verified: true,
  reason: "completed",
};
function config(directory: string) {
  return decodeResidentConfiguration({
    ...structuredClone(fixture),
    policyId: "fixture.progressive",
    heartbeatBudgetMs: 25,
    evidence: ["verified-input"],
    actors: Object.fromEntries(
      ["probe", "widen", "peak"].map((phase) => [
        phase,
        {
          kind: "script",
          effect: "repo.inspect",
          surface: "fixture.source",
          resources: { files: 1, lines: 0, tokens: 0 },
          command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
          cwd: directory,
          timeoutMs: 1000,
          expectedStdoutSha256: digest("ok\n"),
        },
      ]),
    ),
  });
}
const state = (store: ResidentStore) =>
  replayResident(store.read()).state.resident as unknown as ResidentState;
const heartbeat = (
  event: (typeof PRESENCE_HOOK_EVENTS)[number],
  interaction: "human" | "scripted" | "unknown" = "unknown",
): PresenceSignal => ({
  kind: "heartbeat",
  event,
  sessionId: "fixture-session",
  interaction,
});
async function until(check: () => boolean) {
  for (let i = 0; i < 200; i++) {
    if (check()) return;
    await delay(10);
  }
  assert.fail("fixture condition timed out");
}

test("WO-121 classifier depends on signal evidence and stamp, never launch path", (t) => {
  for (const event of PRESENCE_HOOK_EVENTS)
    for (const interaction of ["human", "scripted", "unknown"] as const) {
      for (const stamp of [undefined, { episodeId: "fixture-episode" }]) {
        const signal = heartbeat(event, interaction);
        const expected =
          !stamp && event === "UserPromptSubmit" && interaction === "human"
            ? "human"
            : "actor";
        for (const launchPath of [
          "operator-terminal",
          "resident-detached",
          "unrelated-path",
        ]) {
          const input = { ...signal, launchPath };
          assert.equal(classifyPresenceSignal(input, stamp), expected);
        }
      }
    }
  assert.equal(
    classifyPresenceSignal({ kind: "progress", taskId: "foreground" }),
    "task",
  );
  t.diagnostic(
    "all activity=actor; stamped prompt=actor; observed human prompt=human; launch-path permutations identical",
  );
});

test("WO-121 negative activity stream never changes away phase or cancels; human return preserves foreground", async (t) => {
  for (const returnSignal of [
    { kind: "back" },
    heartbeat("UserPromptSubmit", "human"),
  ] as PresenceSignal[]) {
    for (const disposition of ["kill", "finish", "foreground"] as const) {
      const directory = mkdtempSync(join(tmpdir(), "dotln-origins-"));
      const configuration = config(directory);
      configuration.graph = {
        ...configuration.graph,
        presence: configuration.graph.presence!.map((p) => ({
          ...p,
          phases: p.phases.map((phase) => ({
            ...phase,
            discretionary: disposition !== "foreground",
            inFlightOnReturn: disposition === "kill" ? "kill" : "finish",
          })),
        })),
      };
      let at = 0,
        kills = 0;
      let finish!: (r: ActorResult) => void;
      let context: { residentStore: string; episodeId: string } | undefined;
      const host = new ResidentHost({
        directory,
        policyId: configuration.policyId,
        configuration,
        now: () => at,
        capabilities: () => ["adapter.fixture"],
        catalog: {
          ...actorCatalog,
          script: {
            kind: "script",
            available: () => null,
            run: (_spec, stamp) => {
              context = stamp;
              return {
                completed: new Promise((resolve) => {
                  finish = resolve;
                }),
                kill: () => {
                  kills++;
                  finish({
                    ...result,
                    verified: false,
                    signal: "SIGKILL",
                    reason: "operator-return",
                  });
                },
              };
            },
          },
        },
      });
      await host.start();
      t.after(() => {
        host.close();
        rmSync(directory, { recursive: true, force: true });
      });
      await recordPresence(directory, "away", () => at);
      at = 10;
      const running = host.tick();
      await until(() => context !== undefined);
      assert.equal(context!.residentStore, directory);
      const stamp = { episodeId: context!.episodeId };
      const before = state(host.store).machine!;
      for (const event of PRESENCE_HOOK_EVENTS) {
        await recordPresenceObservation(
          directory,
          heartbeat(event, "human"),
          stamp,
          () => ++at,
        );
        if (event !== "UserPromptSubmit")
          await recordPresenceObservation(
            directory,
            heartbeat(event),
            undefined,
            () => ++at,
          );
      }
      await recordPresenceObservation(
        directory,
        { kind: "progress", taskId: "foreground" },
        undefined,
        () => ++at,
      );
      await delay(30);
      const after = state(host.store);
      assert.equal(after.present, false);
      assert.equal(after.machine!.state, before.state);
      assert.equal(after.machine!.generation, before.generation);
      assert.deepEqual(after.machine!.current, before.current);
      assert.equal(kills, 0);
      await recordPresenceObservation(
        directory,
        returnSignal,
        undefined,
        () => ++at,
      );
      await until(() => disposition !== "kill" || kills === 1);
      if (disposition !== "kill") finish(result);
      await running;
      assert.equal(kills, disposition === "kill" ? 1 : 0);
      assert.equal(state(host.store).machine!.state, "present");
      assert.equal(state(host.store).machine!.current, null);
      // Late worker traffic must not revive the completed episode.
      await recordPresenceObservation(
        directory,
        heartbeat("PreToolUse"),
        stamp,
        () => ++at,
      );
      assert.equal(
        state(host.store).actors[`episode:${stamp.episodeId}`]!.status,
        "stopped",
      );
      t.diagnostic(
        `${returnSignal.kind}/${disposition}: away stream caused zero phase changes/cancellations; return ${disposition === "kill" ? "killed discretionary work" : "allowed in-flight work to complete"}`,
      );
    }
  }
});

test("WO-121 human idle threshold, actor stall, and task progress are independent replay clocks", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-clocks-"));
  const configuration = config(directory);
  configuration.graph = {
    ...configuration.graph,
    presence: configuration.graph.presence!.map((p) => ({
      ...p,
      humanIdleMs: 40,
    })),
  };
  const host = new ResidentHost({
    directory,
    policyId: configuration.policyId,
    configuration,
  });
  await host.start();
  t.after(() => {
    host.close();
    rmSync(directory, { recursive: true, force: true });
  });
  await recordPresence(directory, "returned", () => 0);
  await recordPresenceObservation(
    directory,
    heartbeat("PreToolUse"),
    undefined,
    () => 10,
  );
  await recordPresenceObservation(
    directory,
    { kind: "progress", taskId: "task" },
    undefined,
    () => 34,
  );
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.status,
    "live",
  );
  await host.store.transaction((tx) => tx.sample(35));
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.status,
    "stalled",
  );
  assert.equal(state(host.store).present, true);
  assert.equal(state(host.store).machine!.state, "present");
  await host.store.transaction((tx) => tx.sample(40));
  assert.equal(state(host.store).present, false);
  assert.equal(state(host.store).machine!.state, "probe");
  await recordHarnessHeartbeat(
    "UserPromptSubmit",
    { hook_event_name: "UserPromptSubmit", session_id: "fixture-session" },
    { DOTLN_RESIDENT_STORE: directory },
    () => 41,
  );
  assert.equal(
    state(host.store).present,
    false,
    "ambiguous real profile prompt remains actor",
  );
  await recordPresenceObservation(
    directory,
    heartbeat("PostToolUse"),
    undefined,
    () => 42,
  );
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.status,
    "live",
  );
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.failureAt,
    35,
  );
  await recordPresenceObservation(
    directory,
    heartbeat("Stop"),
    undefined,
    () => 43,
  );
  await host.store.transaction((tx) => tx.sample(139));
  assert.equal(state(host.store).machine!.state, "probe");
  await host.store.transaction((tx) => tx.sample(140));
  assert.equal(
    state(host.store).machine!.state,
    "expired",
    "phase decay still measures absence-policy activity",
  );
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.status,
    "stalled",
  );
  const expected = JSON.stringify(replayResident(host.store.read()));
  const saved = Date.now;
  try {
    Date.now = () => {
      throw new Error("ambient time during replay");
    };
    assert.equal(JSON.stringify(replayResident(host.store.read())), expected);
  } finally {
    Date.now = saved;
  }
  const before = host.store.read();
  await assert.rejects(
    recordPresence(directory, "invalid" as "away", () => 150),
    /invalid resident presence/,
  );
  assert.equal(host.store.read(), before, "invalid command cannot become back");
  await assert.rejects(
    recordPresenceObservation(
      directory,
      heartbeat("PreToolUse"),
      { episodeId: "" },
      () => 150,
    ),
    /invalid presence/,
  );
  assert.equal(host.store.read(), before, "invalid ingress writes nothing");
  assert.throws(
    () =>
      decodePresenceObservation({
        signal: heartbeat("PreToolUse"),
        origin: "human",
        at: 150,
      }),
    /invalid presence/,
  );
  t.diagnostic(
    "actor stalled at 35 without presence change; human idle at 40; phase decay at 140; task progress renewed neither clock; replay identical",
  );
});

test("WO-121 running actor silence is sampled without incoming traffic", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-silence-"));
  let at = 0;
  let finish!: (r: ActorResult) => void;
  const configuration = config(directory);
  const host = new ResidentHost({
    directory,
    policyId: configuration.policyId,
    configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      script: {
        kind: "script",
        available: () => null,
        run: () => ({
          completed: new Promise((resolve) => {
            finish = resolve;
          }),
          kill: () => assert.fail("stall is not a return"),
        }),
      },
    },
  });
  await host.start();
  t.after(() => {
    host.close();
    rmSync(directory, { recursive: true, force: true });
  });
  await recordPresence(directory, "away", () => 0);
  at = 10;
  const running = host.tick();
  await until(() => !!finish);
  const episodeId = state(host.store).machine!.current!.id;
  await recordPresenceObservation(
    directory,
    heartbeat("Stop"),
    { episodeId },
    () => 11,
  );
  at = 36;
  await until(() =>
    Object.values(state(host.store).actors).some((a) => a.status === "stalled"),
  );
  assert.equal(state(host.store).present, false);
  assert.equal(state(host.store).machine!.state, "probe");
  finish(result);
  await running;
});

test("WO-121 late heartbeats retain missed deadlines; backwards live back preserves intent; task keys are data", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-late-signals-"));
  const configuration = config(directory);
  configuration.graph = {
    ...configuration.graph,
    presence: configuration.graph.presence!.map((p) => ({
      ...p,
      humanIdleMs: 40,
    })),
  };
  const host = new ResidentHost({
    directory,
    policyId: configuration.policyId,
    configuration,
  });
  await host.start();
  t.after(() => {
    host.close();
    rmSync(directory, { recursive: true, force: true });
  });
  await recordPresence(directory, "returned", () => 0);
  await recordPresenceObservation(
    directory,
    heartbeat("PreToolUse"),
    undefined,
    () => 10,
  );
  await recordPresenceObservation(
    directory,
    heartbeat("Stop"),
    undefined,
    () => 35,
  );
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.failureAt,
    35,
  );
  await recordPresenceObservation(
    directory,
    heartbeat("PostToolUse"),
    undefined,
    () => 61,
  );
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.failureAt,
    60,
  );
  await host.store.transaction((tx) => tx.sample(161));
  assert.equal(state(host.store).machine!.state, "expired");
  await recordPresence(directory, "returned", () => 10);
  assert.equal(state(host.store).present, true);
  assert.equal(state(host.store).machine!.state, "present");
  assert.equal(state(host.store).lastHumanAt, 161);
  for (const taskId of ["constructor", "__proto__"])
    await recordPresenceObservation(
      directory,
      { kind: "progress", taskId },
      undefined,
      () => 162,
    );
  const progress = state(host.store).progress;
  assert.equal(progress["constructor"], 162);
  assert.equal(progress["__proto__"], 162);
  await host.store.transaction((tx) =>
    tx.append(
      "OperatorPresenceObserved",
      {
        signal: heartbeat("PreToolUse"),
        origin: "actor",
        at: 100,
      },
      100,
    ),
  );
  assert.equal(
    state(host.store).actors["session:fixture-session"]!.status,
    "stalled",
    "stale replay heartbeat cannot revive an already expired deadline",
  );
  await host.store.transaction((tx) =>
    tx.append(
      "OperatorPresenceObserved",
      { signal: { kind: "away" }, origin: "human", at: 20 },
      20,
    ),
  );
  assert.equal(
    state(host.store).present,
    true,
    "stale replay observation cannot undo newer human intent",
  );
});

test("WO-121 generated hooks emit exactly one reduced observation per event and no SessionStart heartbeat", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-hook-presence-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const root = fileURLToPath(new URL("../../../../", import.meta.url));
  symlinkSync(join(root, "packages"), join(directory, "packages"), "dir");
  const profile = contributorProfiles.find((p) => p.harness === "claude-code")!;
  const program = contributorProgram();
  const files = [
    "packages/compiler/dist/src/feedback.js",
    "packages/skeleton/dist/src/feedback-boundary.js",
    "packages/skeleton/dist/src/feedback-source-comments.js",
    "packages/skeleton/dist/src/harness-host.js",
    "packages/skeleton/dist/src/reactor.js",
    "packages/skeleton/dist/src/presence-heartbeat.js",
  ].map((path) => ({
    path,
    hash: `fnv1a64:${fnv1a64(readFileSync(join(root, path), "utf8"))}`,
  }));
  const bundle = lowerToHarness(
    program,
    personalFeedback(),
    program.loadout.authorityEnvelope,
    { ...profile, runtime: { ...profile.runtime, files } },
  );
  const settings = JSON.parse(
    bundle.files.find((f) => f.path === profile.settings.path)!.contents,
  );
  const storePath = join(directory, "store");
  await recordPresence(storePath, "away", () => 0);
  for (const event of PRESENCE_HOOK_EVENTS) {
    const file = bundle.files.find(
      (f) => f.path === `.claude/hooks/presence-${event.toLowerCase()}.mjs`,
    )!;
    assert.ok(file);
    assert.equal(
      JSON.stringify(settings.hooks[event]).split(file.path).length - 1,
      1,
    );
    const path = join(directory, file.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, file.contents);
    for (const stamped of [false, true]) {
      const run = spawnSync(process.execPath, [path], {
        encoding: "utf8",
        input: JSON.stringify({
          hook_event_name: event,
          session_id: "fixture-session",
          prompt: "DO_NOT_STORE_PROMPT",
          tool_input: { secret: "DO_NOT_STORE_TOOL" },
        }),
        env: {
          DOTLN_RESIDENT_STORE: storePath,
          ...(stamped ? { DOTLN_RESIDENT_EPISODE_ID: "fixture-episode" } : {}),
        },
      });
      assert.equal(run.status, 0);
      assert.equal(run.stdout, "{}");
      assert.equal(run.stderr, "");
    }
  }
  assert.doesNotMatch(JSON.stringify(settings.hooks.SessionStart), /presence-/);
  const store = new ResidentStore(storePath);
  const observations = decodeLog(store.read()).filter(
    (e) => e.type === "OperatorPresenceObserved",
  );
  assert.equal(observations.length, 9);
  assert.equal(state(store).present, false);
  assert.doesNotMatch(store.read(), /DO_NOT_STORE/);
  await recordHarnessHeartbeat("PreToolUse", {}, {});
  assert.equal(
    decodeLog(store.read()).filter((e) => e.type === "OperatorPresenceObserved")
      .length,
    9,
  );
});

test("WO-121 native script receives only explicit resident stamp environment", async (t) => {
  const unavailable = scriptAvailability();
  if (unavailable) {
    t.skip(unavailable);
    return;
  }
  const directory = mkdtempSync(join(tmpdir(), "dotln-stamp-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const expected = "/fixture-store|fixture-episode|undefined";
  const actor = config(directory).actors["probe"]!;
  const run = actorCatalog.script.run(
    {
      ...actor,
      command: [
        process.execPath,
        "-e",
        "process.stdout.write([process.env.DOTLN_RESIDENT_STORE,process.env.DOTLN_RESIDENT_EPISODE_ID,String(process.env.HOME)].join('|'))",
      ],
      expectedStdoutSha256: digest(expected),
    },
    { residentStore: "/fixture-store", episodeId: "fixture-episode" },
  );
  assert.equal((await run.completed).verified, true);
});
