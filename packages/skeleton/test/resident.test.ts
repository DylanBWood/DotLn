import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
  realpathSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { decodeLog, type Event } from "@dotln/kernel";
import {
  actorCatalog,
  scriptAvailability,
  assertActorSpec,
  type ActorAdapter,
  type ActorResult,
  type ActorSpec,
} from "../src/actor-catalog.js";
import { ResidentHost } from "../src/resident-host.js";
import {
  ResidentStore,
  recordPresence,
  replayResident,
} from "../src/resident-store.js";
import {
  decodeResidentConfiguration,
  residentMachine,
  residentEpisodeId,
  type ResidentConfiguration,
  type ResidentState,
} from "../src/resident-state.js";

const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo067-presence.json", import.meta.url),
    "utf8",
  ),
);
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const result: ActorResult = {
  exitCode: 0,
  signal: null,
  stdoutSha256: hash("ok\n"),
  firstLine: "ok",
  verified: true,
  reason: "completed",
};
const spec = (cwd: string): ActorSpec => ({
  kind: "script",
  effect: "repo.inspect",
  surface: "fixture.source",
  resources: { files: 1, lines: 0, tokens: 0 },
  command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
  cwd,
  timeoutMs: 1000,
  expectedStdoutSha256: hash("ok\n"),
});
function configuration(cwd: string): ResidentConfiguration {
  return decodeResidentConfiguration({
    ...structuredClone(fixture),
    policyId: "fixture.progressive",
    actors: Object.fromEntries(
      ["probe", "widen", "peak"].map((phase) => [phase, spec(cwd)]),
    ),
    evidence: ["verified-input"],
  });
}
const state = (store: ResidentStore) =>
  replayResident(store.read()).state.resident as unknown as ResidentState;
const events = (store: ResidentStore, type: string) =>
  decodeLog(store.read()).filter((event) => event.type === type);
const payload = (event: Event) => event.payload as Record<string, unknown>;
function fake(
  run: ActorAdapter["run"] = () => ({
    completed: Promise.resolve(result),
    kill: () => {},
  }),
) {
  return {
    ...actorCatalog,
    script: { kind: "script" as const, available: () => null, run },
  };
}
async function until(check: () => boolean, timeout = 4000) {
  for (let elapsed = 0; elapsed < timeout; elapsed += 10) {
    if (check()) return;
    await delay(10);
  }
  assert.fail("fixture condition timed out");
}

test("WO-068 recorded clock drives all phases; replay ignores ambient clock; return cancels; idle needs a fresh edge", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-resident-"));
  let at = 0;
  const host = new ResidentHost({
    directory,
    policyId: "fixture.progressive",
    configuration: configuration(directory),
    now: () => at,
    catalog: fake(),
    capabilities: () => ["adapter.fixture"],
  });
  await host.start();
  t.after(() => {
    host.close();
    rmSync(directory, { recursive: true, force: true });
  });
  await recordPresence(directory, "away", () => at);
  await host.tick();
  assert.equal(events(host.store, "ScriptEpisodeDispatched").length, 0);
  for (const expected of ["widen", "peak", "probe"]) {
    at += 10;
    await host.tick();
    assert.equal(state(host.store).machine!.state, expected);
  }
  assert.equal(events(host.store, "ScriptEpisodeDispatched").length, 3);
  const before = JSON.stringify(replayResident(host.store.read()));
  const savedNow = Date.now;
  try {
    Date.now = () => {
      throw new Error("ambient clock read during replay");
    };
    assert.equal(JSON.stringify(replayResident(host.store.read())), before);
  } finally {
    Date.now = savedNow;
  }
  await recordPresence(directory, "returned", () => ++at);
  at += 20;
  await host.tick();
  assert.equal(events(host.store, "ScriptEpisodeDispatched").length, 3);
  await recordPresence(directory, "away", () => ++at);
  at += 100;
  await host.tick();
  assert.equal(state(host.store).machine!.state, "expired");
  await recordPresence(directory, "away", () => ++at);
  await host.tick();
  assert.equal(state(host.store).machine!.state, "expired");
  await recordPresence(directory, "returned", () => ++at);
  await recordPresence(directory, "away", () => ++at);
  at += 10;
  await host.tick();
  assert.equal(state(host.store).machine!.state, "widen");
  t.diagnostic(
    `dispatches=${events(host.store, "ScriptEpisodeDispatched").length}; replay byte-identical; expired→return→absence rearmed`,
  );
});

test("WO-068 in-flight kill and finish obey return precedence and reject stale advancement", async (t) => {
  for (const disposition of ["kill", "finish"] as const) {
    const directory = mkdtempSync(join(tmpdir(), "dotln-return-"));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    const config = configuration(directory);
    config.graph = {
      ...config.graph,
      presence: config.graph.presence!.map((policy) => ({
        ...policy,
        phases: policy.phases.map((phase, index) =>
          index === 0 ? { ...phase, inFlightOnReturn: disposition } : phase,
        ),
      })),
    };
    let at = 0,
      kills = 0;
    let finish!: (value: ActorResult) => void;
    const host = new ResidentHost({
      directory,
      policyId: config.policyId,
      configuration: config,
      now: () => at,
      catalog: fake(() => ({
        completed: new Promise((resolve) => {
          finish = resolve;
        }),
        kill: () => {
          kills++;
          finish({ ...result, verified: false, reason: "operator-return" });
        },
      })),
      capabilities: () => ["adapter.fixture"],
    });
    await host.start();
    try {
      await recordPresence(directory, "away", () => at);
      at = 10;
      const tick = host.tick();
      await until(
        () => events(host.store, "ScriptEpisodeDispatched").length === 1,
      );
      await recordPresence(directory, "returned", () => at);
      if (disposition === "finish") {
        await delay(30);
        assert.equal(kills, 0);
        assert.equal(state(host.store).machine!.current!.status, "finishing");
        await recordPresence(directory, "away", () => ++at);
        finish(result);
      }
      await tick;
      assert.equal(kills, disposition === "kill" ? 1 : 0);
      assert.equal(
        state(host.store).machine!.state,
        disposition === "kill" ? "present" : "probe",
      );
      assert.equal(state(host.store).machine!.current, null);
      assert.equal(events(host.store, "ScriptEpisodeDispatched").length, 1);
    } finally {
      host.close();
    }
  }
});

test("WO-068 envelope, scope and runtime capability refusals never spawn; unavailable actor has no fallback", async (t) => {
  for (const condition of [
    "effect",
    "evidence",
    "scope",
    "budget",
    "capability",
    "unavailable",
  ] as const) {
    const directory = mkdtempSync(join(tmpdir(), "dotln-refusal-"));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    const config = configuration(directory);
    if (condition === "effect") config.actors.probe!.effect = "repo.write";
    if (condition === "evidence") config.evidence = [];
    if (condition === "scope") config.actors.probe!.surface = "outside";
    if (condition === "budget") config.actors.probe!.resources.files = 2;
    if (condition === "unavailable") config.actors.probe!.kind = "local-model";
    let at = 0,
      launches = 0;
    const host = new ResidentHost({
      directory,
      policyId: config.policyId,
      configuration: config,
      now: () => at,
      catalog: fake(() => {
        launches++;
        throw new Error("unexpected dispatch");
      }),
      capabilities: () =>
        condition === "capability" ? [] : ["adapter.fixture"],
    });
    await host.start();
    try {
      await recordPresence(directory, "away", () => at);
      at = 10;
      await host.tick();
      assert.equal(launches, 0);
      assert.equal(events(host.store, "ScriptEpisodeDispatched").length, 0);
      assert.ok(state(host.store).lastNoOp);
      if (condition === "unavailable")
        assert.match(state(host.store).lastNoOp!, /WO-110/u);
    } finally {
      host.close();
    }
  }
});

test("WO-068 two once invocations produce byte-identical events to two loop ticks", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-once-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const config = configuration(directory);
  const logs: string[] = [];
  for (const mode of ["once", "loop"]) {
    const storeDir = join(directory, mode);
    await recordPresence(storeDir, "away", () => 0);
    const run = (samples: number[], once: boolean) => {
      const code = `import { ResidentHost } from ${JSON.stringify(new URL("../src/resident-host.js", import.meta.url).href)};
        import { actorCatalog } from ${JSON.stringify(new URL("../src/actor-catalog.js", import.meta.url).href)};
        const input = JSON.parse(process.argv[1]);
        const catalog = { ...actorCatalog, script: {kind:'script',available:()=>null,run:()=>({completed:Promise.resolve(input.result),kill:()=>{}})} };
        await new ResidentHost({...input.options,now:()=>input.samples.shift(),catalog,capabilities:()=>['adapter.fixture']})
          .run({once:input.once,cycles:2,tickMs:1});`;
      const observed = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          code,
          JSON.stringify({
            options: {
              directory: storeDir,
              policyId: config.policyId,
              configuration: config,
            },
            samples,
            once,
            result,
          }),
        ],
        { encoding: "utf8", timeout: 3000 },
      );
      assert.equal(observed.status, 0, observed.stderr);
    };
    if (mode === "once") {
      run([0], true);
      run([10, 10], true);
    } else run([0, 10, 10], false);
    logs.push(new ResidentStore(storeDir).read());
  }
  assert.equal(logs[0], logs[1]);
});

test("WO-068 malformed saved evidence refuses before append/reclaim; presence rejects symlink stores", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-decode-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const store = new ResidentStore(join(directory, "store"));
  await assert.rejects(
    store.transaction((tx) =>
      tx.append("ScriptEpisodeObserved", { verified: true }),
    ),
    /precedes configuration/u,
  );
  const config = configuration(directory);
  await store.transaction((tx) => {
    tx.append("ResidentConfigured", { configuration: config });
    tx.sample(0);
    tx.append("OperatorPresenceChanged", { presence: "away" });
    tx.sample(10);
    const machine = residentMachine(tx.resident!);
    const episodeId = residentEpisodeId(machine, machine.due(10)!);
    assert.throws(
      () => tx.append("ScriptEpisodeDispatched", { episodeId }),
      /invalid/u,
    );
    tx.append("ScriptEpisodeDispatched", {
      episodeId,
      dueAt: 10,
      phaseId: "probe",
      kind: "script",
      effect: "repo.inspect",
      authorityEnvelopeId:
        machine.phase()!.effectiveEnvelope.authorityEnvelopeId,
    });
    assert.throws(
      () => tx.append("ScriptEpisodeObserved", { episodeId, verified: true }),
      /invalid/u,
    );
    assert.throws(
      () =>
        tx.append("ScriptEpisodeObserved", {
          episodeId,
          ...result,
          stdoutSha256: hash("forged"),
        }),
      /contradicts/u,
    );
    tx.append("ScriptEpisodeObserved", { episodeId, ...result });
  });
  symlinkSync(store.store.directory, join(directory, "alias"));
  const before = store.read();
  await assert.rejects(
    recordPresence(join(directory, "alias"), "away", () => 11),
    /symlink/u,
  );
  assert.equal(store.read(), before);
});

test("WO-068 inspected restart records lost once and cannot reuse dispatched identity", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-lost-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  let at = 0;
  const options = {
    directory,
    policyId: "fixture.progressive",
    configuration: configuration(directory),
    now: () => at,
    catalog: fake(),
    capabilities: () => ["adapter.fixture"],
  };
  const first = new ResidentHost(options);
  await first.start();
  await recordPresence(directory, "away", () => at);
  let id = "";
  await first.store.transaction((tx) => {
    tx.sample(10);
    const machine = residentMachine(tx.resident!);
    id = residentEpisodeId(machine, machine.due(10)!);
    tx.append("ScriptEpisodeDispatched", {
      episodeId: id,
      dueAt: 10,
      phaseId: machine.state,
      kind: "script",
      effect: "repo.inspect",
      authorityEnvelopeId:
        machine.phase()!.effectiveEnvelope.authorityEnvelopeId,
    });
  });
  const contender = new ResidentHost(options);
  await assert.rejects(contender.start(), /live host/u);
  first.close();
  at = 11;
  await new ResidentHost(options).run({ once: true });
  at = 21;
  await new ResidentHost(options).run({ once: true });
  const store = new ResidentStore(directory);
  assert.equal(events(store, "ScriptEpisodeLost").length, 1);
  assert.equal(
    events(store, "ScriptEpisodeDispatched").filter(
      (event) => payload(event).episodeId === id,
    ).length,
    1,
  );
  const before = store.read();
  writeFileSync(store.store.logPath, before + "{torn");
  await assert.rejects(new ResidentHost(options).start());
  assert.equal(readFileSync(store.store.logPath, "utf8"), before + "{torn");
});

test("WO-068 native script uses exact argv/cwd, clears inherited env, verifies output and denies network", async (t) => {
  const unavailable = scriptAvailability();
  if (process.platform !== "darwin") {
    t.skip(unavailable!);
    return;
  }
  assert.equal(
    unavailable,
    null,
    "native script fixture needs an outside-sandbox runner",
  );
  const directory = mkdtempSync(join(tmpdir(), "dotln-script-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const text =
    JSON.stringify({
      cwd: realpathSync(directory),
      args: ["a b", "$(never);*", ""],
      inherited: false,
    }) + "\n";
  const declared = {
    ...spec(directory),
    expectedStdoutSha256: hash(text),
    command: [
      process.execPath,
      "-e",
      "console.log(JSON.stringify({cwd:process.cwd(),args:process.argv.slice(1),inherited:'DOTLN_SCRIPT_SENTINEL' in process.env}))",
      "a b",
      "$(never);*",
      "",
    ],
  };
  process.env.DOTLN_SCRIPT_SENTINEL = "fixture-only";
  try {
    const observed = await actorCatalog.script.run(declared).completed;
    assert.equal(observed.verified, true, JSON.stringify(observed));
    assert.equal(observed.stdoutSha256, hash(text));
  } finally {
    delete process.env.DOTLN_SCRIPT_SENTINEL;
  }
  const net = await actorCatalog.script.run({
    ...spec(directory),
    command: [
      process.execPath,
      "-e",
      "require('node:net').connect(9,'127.0.0.1').on('error',e=>{console.log(e.code);process.exit(e.code==='EPERM'?0:1)})",
    ],
    expectedStdoutSha256: hash("EPERM\n"),
  }).completed;
  assert.equal(net.verified, true, JSON.stringify(net));
  assert.equal(
    (
      await actorCatalog.script.run({
        ...spec(directory),
        expectedStdoutSha256: hash("wrong"),
      }).completed
    ).verified,
    false,
  );
  const timed = await actorCatalog.script.run({
    ...spec(directory),
    timeoutMs: 50,
    command: [process.execPath, "-e", "setInterval(()=>{},1000)"],
  }).completed;
  assert.equal(timed.reason, "timeout");
  assert.equal(timed.verified, false);
  const capped = await actorCatalog.script.run({
    ...spec(directory),
    command: [
      process.execPath,
      "-e",
      "process.stdout.write('x'.repeat(100000))",
    ],
  }).completed;
  assert.equal(capped.reason, "output-limit");
  assert.ok(capped.firstLine.length <= 160);
  assert.throws(() =>
    assertActorSpec({ ...spec(directory), command: ["relative"] }),
  );
  assert.throws(() => assertActorSpec({ ...spec(directory), timeoutMs: 0 }));
  const missingCwd = await actorCatalog.script.run({
    ...spec(join(directory, "missing")),
  }).completed;
  assert.equal(missingCwd.verified, false);
  assert.match(missingCwd.reason, /supervisor exited/u);
  const heldPipes = await actorCatalog.script.run({
    ...spec(directory),
    timeoutMs: 100,
    command: [
      process.execPath,
      "-e",
      "require('node:child_process').spawn(process.execPath,['-e','setTimeout(()=>{},300)'],{detached:true,stdio:['ignore',1,2]}).unref()",
    ],
  }).completed;
  assert.equal(
    heldPipes.reason,
    "timeout",
    "detached inherited pipes cannot block the bounded observation",
  );
  t.diagnostic(
    "native sandbox: EPERM; exact argv/cwd; inherited sentinel absent; timeout/output cap enforced",
  );
});

test("WO-068 fresh CLI once and presence commands; SIGKILL recovery and dead-owner reclaim", async (t) => {
  if (process.platform !== "darwin") {
    t.skip("native script adapter is Darwin-only");
    return;
  }
  assert.equal(scriptAvailability(), null);
  const directory = mkdtempSync(join(tmpdir(), "dotln-process-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const config = configuration(directory);
  // Real-clock CLI policy uses the same table with a long live expiry/deadline.
  config.graph = {
    ...config.graph,
    activeMechanics: config.graph.activeMechanics.map((mechanic) => ({
      ...mechanic,
      authorityEnvelope: {
        ...mechanic.authorityEnvelope,
        expiresAt: Number.MAX_SAFE_INTEGER,
      },
    })),
    presence: config.graph.presence!.map((policy) => ({
      ...policy,
      decay: { ...policy.decay, idleMs: 10000 },
      phases: policy.phases.map((phase) => ({
        ...phase,
        requiredCapabilities: [],
      })),
    })),
  };
  config.actors.probe = {
    ...spec(directory),
    timeoutMs: 5000,
    command: [
      process.execPath,
      "-e",
      "require('node:fs').writeFileSync('script-started','yes');setInterval(()=>require('node:fs').appendFileSync('beats','x'),20)",
    ],
  };
  writeFileSync(join(directory, "resident.json"), JSON.stringify(config));
  const cli = fileURLToPath(new URL("../src/dotln.js", import.meta.url));
  const run = (args: string[]) =>
    spawnSync(process.execPath, [cli, ...args, "--store", directory], {
      encoding: "utf8",
      timeout: 4000,
    });
  assert.equal(
    run(["resident", "--policy", config.policyId, "--once"]).status,
    0,
  );
  assert.equal(run(["presence", "away"]).status, 0);
  const child = spawn(
    process.execPath,
    [
      cli,
      "resident",
      "--policy",
      config.policyId,
      "--tick",
      "10",
      "--store",
      directory,
    ],
    { stdio: "ignore" },
  );
  t.after(() => {
    if (child.exitCode === null && child.signalCode === null)
      child.kill("SIGKILL");
  });
  const exited = new Promise<void>((resolve) =>
    child.once("exit", () => resolve()),
  );
  await until(() => existsSync(join(directory, "script-started")));
  assert.notEqual(
    run(["resident", "--policy", config.policyId, "--once"]).status,
    0,
  );
  await until(
    () =>
      !existsSync(join(directory, ".resident-append", "host.lock")) &&
      !existsSync(join(directory, ".resident-append", "host-lock-recovery")),
  );
  child.kill("SIGKILL");
  await exited;
  await delay(150);
  const beats = existsSync(join(directory, "beats"))
    ? readFileSync(join(directory, "beats"), "utf8")
    : "";
  await delay(100);
  assert.equal(
    existsSync(join(directory, "beats"))
      ? readFileSync(join(directory, "beats"), "utf8")
      : "",
    beats,
    "supervisor kills orphan script when resident IPC disconnects",
  );
  assert.equal(
    run(["resident", "--policy", config.policyId, "--once"]).status,
    0,
  );
  const store = new ResidentStore(directory);
  assert.equal(events(store, "ScriptEpisodeLost").length, 1);
  const ids = events(store, "ScriptEpisodeDispatched").map(
    (event) => payload(event).episodeId,
  );
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(run(["presence", "back"]).status, 0);
  t.diagnostic(
    "fresh --once exit 0; live-owner refusal; SIGKILL orphan stopped; dead-owner inspection/reclaim; lost recorded once",
  );
});
