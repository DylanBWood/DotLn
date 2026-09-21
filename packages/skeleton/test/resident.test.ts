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
  cpSync,
  mkdirSync,
  readdirSync,
  readlinkSync,
  lstatSync,
  unlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";
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
import { WorkerStore } from "../src/worker-store.js";
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
    "colliding-budget",
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
    if (condition === "colliding-budget")
      (
        config.graph.presence![0]!.phases[0]!.scope.budget as Record<
          string,
          number
        >
      ).files = 0;
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

const lockProcess = fileURLToPath(
  new URL("./fixtures/resident-lock-process.js", import.meta.url),
);
type LockStep = {
  index: number;
  op: string;
  paths: string[];
  error: string | null;
};
function deadPid() {
  const child = spawnSync(process.execPath, ["-e", ""], { encoding: "utf8" });
  assert.equal(child.status, 0);
  assertDeadPid(child.pid);
  return child.pid;
}
function assertDeadPid(pid: number) {
  assert.throws(() => process.kill(pid, 0), { code: "ESRCH" });
}
function abandonedGuard(directory: string, pid: number) {
  const token = randomUUID();
  const name = `.host-lock-${token}`;
  const target = join(directory, name);
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, "owner.json"), JSON.stringify({ pid, token }));
  symlinkSync(name, join(directory, "host-lock-recovery"), "dir");
  return { target, token, guard: join(directory, "host-lock-recovery") };
}
async function seedFlight(directory: string, at = 0, dispatch = true) {
  const config = configuration(directory);
  writeFileSync(join(directory, "resident.json"), JSON.stringify(config));
  const host = new ResidentHost({
    directory,
    policyId: config.policyId,
    configuration: config,
    now: () => at,
    catalog: fake(),
  });
  await host.start();
  try {
    await recordPresence(directory, "returned", () => at);
    await recordPresence(directory, "away", () => at);
    if (!dispatch) return;
    await host.store.transaction((tx) => {
      tx.sample(at + 10);
      const machine = residentMachine(tx.resident!);
      const dueAt = machine.due(at + 10)!;
      tx.append("ScriptEpisodeDispatched", {
        episodeId: residentEpisodeId(machine, dueAt),
        dueAt,
        phaseId: machine.phase()!.phaseId,
        kind: "script",
        effect: "repo.inspect",
        authorityEnvelopeId:
          machine.phase()!.effectiveEnvelope.authorityEnvelopeId,
      });
    });
  } finally {
    host.close();
  }
}
function crashInput(
  directory: string,
  target: string,
  mode: "once" | "loop",
  label: string,
  stop?: number,
  at?: number,
) {
  return {
    directory,
    target,
    mode,
    trace: `${directory}-${label}.trace`,
    pause: `${directory}-${label}.pause`,
    resume: `${directory}-${label}.resume`,
    ...(stop === undefined ? {} : { stop }),
    ...(at === undefined ? {} : { at }),
  };
}
function runLockProcess(
  input: ReturnType<typeof crashInput> & { poll?: boolean },
) {
  const observed = spawnSync(
    process.execPath,
    [lockProcess, JSON.stringify(input)],
    {
      encoding: "utf8",
      timeout: 10000,
    },
  );
  assert.equal(observed.status, 0, observed.stderr || String(observed.error));
  return readFileSync(input.trace, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as LockStep);
}
async function killLockProcess(
  input: ReturnType<typeof crashInput> & { poll?: boolean },
) {
  const child = spawn(process.execPath, [lockProcess, JSON.stringify(input)], {
    stdio: ["ignore", "ignore", "pipe"],
  });
  let error = "";
  child.stderr!.on("data", (chunk) => {
    error += String(chunk);
  });
  const exited = new Promise<string | null>((resolve) =>
    child.once("exit", (_code, signal) => resolve(signal)),
  );
  try {
    await until(() => {
      if (child.exitCode !== null || child.signalCode !== null)
        assert.fail(
          `crash child exited before boundary ${input.stop}: ${error}`,
        );
      return existsSync(input.pause);
    }, 10000);
    const row = JSON.parse(readFileSync(input.pause, "utf8")) as LockStep;
    assert.equal(row.index, input.stop);
    child.kill("SIGKILL");
    assert.equal(await exited, "SIGKILL");
    return row;
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
      await exited;
    }
  }
}

test(
  "WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers",
  { timeout: 240000 },
  async (t) => {
    const root = mkdtempSync(join(tmpdir(), "dotln-lock-matrix-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const template = join(root, "template");
    mkdirSync(template);
    await seedFlight(template);
    const prefix = readFileSync(join(template, "events.jsonl"), "utf8");
    for (const mode of ["once", "loop"] as const)
      for (const scope of ["lifetime", "append"] as const)
        for (const reclaim of [false, true]) {
          const make = (label: string) => {
            const directory = join(root, label);
            cpSync(template, directory, { recursive: true });
            const target =
              scope === "append"
                ? join(directory, ".resident-append")
                : directory;
            const pid = deadPid();
            for (const path of [directory, join(directory, ".resident-append")])
              writeFileSync(join(path, "host.lock"), JSON.stringify({ pid }));
            if (reclaim) abandonedGuard(target, pid);
            return { directory, target, pid };
          };
          const label = `${mode}-${scope}-${reclaim ? "reclaim" : "fresh"}`;
          const discovery = make(`${label}-discovery`);
          const steps = runLockProcess(
            crashInput(discovery.directory, discovery.target, mode, "discover"),
          );
          assertDeadPid(discovery.pid);
          assert.ok(steps.some((step) => step.op === "symlinkSync"));
          assert.ok(
            steps.some(
              (step) =>
                step.op === "unlinkSync" &&
                step.paths.some((path) => path.endsWith("host-lock-recovery")),
            ),
          );
          assert.ok(
            steps.some(
              (step) =>
                step.op === "linkSync" &&
                step.paths.some((path) => path.endsWith("host.lock")),
            ),
          );
          if (reclaim)
            assert.ok(
              steps.some(
                (step) =>
                  step.op === "linkSync" &&
                  step.paths.some((path) => path.includes("next-")),
              ),
            );
          let publishedKills = 0;
          for (const step of steps) {
            const { directory, target, pid } = make(`${label}-${step.index}`);
            const actual = await killLockProcess(
              crashInput(directory, target, mode, "kill", step.index),
            );
            assert.deepEqual(actual, step, `${label} boundary trace changed`);
            if (existsSync(join(target, "host-lock-recovery")))
              publishedKills++;
            assert.equal(
              readFileSync(join(directory, "events.jsonl"), "utf8"),
              prefix,
              "kill window changed prior event bytes",
            );
            runLockProcess(crashInput(directory, target, mode, "restart"));
            const store = new ResidentStore(directory);
            assert.ok(store.read().startsWith(prefix));
            assert.equal(events(store, "ScriptEpisodeLost").length, 1);
            const continued = store.read();
            runLockProcess(crashInput(directory, target, mode, "again"));
            assert.ok(store.read().startsWith(continued));
            assert.equal(events(store, "ScriptEpisodeLost").length, 1);
            assert.equal(existsSync(join(target, "host-lock-recovery")), false);
            assertDeadPid(pid);
          }
          assert.ok(publishedKills > 0);
          t.diagnostic(
            `${label}: ${steps.length} deterministic SIGKILL boundaries; ${publishedKills} with published guard; exact prefix; one Lost; second restart continues`,
          );
        }
  },
);

test(
  "WO-143 thirty consecutive kill/restart rounds remain openable on once and loop paths",
  { timeout: 60000 },
  async (t) => {
    const root = mkdtempSync(join(tmpdir(), "dotln-lock-rounds-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    for (const mode of ["once", "loop"] as const) {
      const directory = join(root, mode);
      mkdirSync(directory);
      const target = join(directory, ".resident-append");
      // Discover the publication boundary once; each round then kills the actual
      // subprocess with an in-flight episode and a complete published guard.
      await seedFlight(directory);
      const discovery = runLockProcess(
        crashInput(directory, target, mode, "discover"),
      );
      const boundary = discovery.find(
        (row) => row.op === "symlinkSync" && row.error === null,
      )!.index;
      for (let round = 0; round < 30; round++) {
        const at = 100 + round * 100;
        await seedFlight(directory, at);
        const before = readFileSync(join(directory, "events.jsonl"), "utf8");
        const lostBefore = events(
          new ResidentStore(directory),
          "ScriptEpisodeLost",
        ).length;
        await killLockProcess(
          crashInput(
            directory,
            target,
            mode,
            `kill-${round}`,
            boundary,
            at + 11,
          ),
        );
        assert.ok(existsSync(join(target, "host-lock-recovery")));
        runLockProcess(
          crashInput(
            directory,
            target,
            mode,
            `restart-${round}`,
            undefined,
            at + 11,
          ),
        );
        const store = new ResidentStore(directory);
        assert.ok(store.read().startsWith(before));
        assert.equal(events(store, "ScriptEpisodeLost").length, lostBefore + 1);
      }
      const store = new ResidentStore(directory);
      await store.acquire();
      store.release();
      t.diagnostic(
        `${mode}: 30 consecutive in-flight SIGKILL/restart rounds, one new Lost per round, final store opens`,
      );
    }
  },
);

function storeSnapshot(directory: string): Record<string, string> {
  const values: Record<string, string> = {};
  const visit = (path: string) => {
    for (const name of readdirSync(path)) {
      const file = join(path, name);
      const stat = lstatSync(file);
      if (stat.isSymbolicLink()) values[file] = `link:${readlinkSync(file)}`;
      else if (stat.isDirectory()) {
        values[file] = "directory";
        visit(file);
      } else values[file] = readFileSync(file).toString("base64");
    }
  };
  visit(directory);
  return values;
}

test("WO-143 live, unreadable and legacy guards refuse unchanged; released locks remain compatible", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-guard-refusal-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const fault of [
    "live",
    "missing",
    "partial",
    "malformed",
    "symlink-owner",
    "legacy",
    "dangling",
    "foreign-target",
  ] as const) {
    const directory = join(root, fault);
    mkdirSync(directory);
    const pid = fault === "live" ? process.pid : deadPid();
    const prepared = abandonedGuard(directory, pid);
    const owner = join(prepared.target, "owner.json");
    if (fault === "missing") unlinkSync(owner);
    if (fault === "partial") writeFileSync(owner, '{"pid":');
    if (fault === "malformed")
      writeFileSync(owner, JSON.stringify({ pid: -1, token: prepared.token }));
    if (fault === "symlink-owner") {
      unlinkSync(owner);
      symlinkSync("missing", owner);
    }
    if (fault === "legacy") {
      unlinkSync(prepared.guard);
      rmSync(prepared.target, { recursive: true });
      mkdirSync(prepared.guard);
    }
    if (fault === "dangling") rmSync(prepared.target, { recursive: true });
    if (fault === "foreign-target") {
      unlinkSync(prepared.guard);
      symlinkSync("../foreign", prepared.guard);
    }
    const before = storeSnapshot(directory);
    assert.throws(
      () => new WorkerStore(directory).acquire(),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes(prepared.guard));
        assert.match(
          error.message,
          /host lock recovery is busy or interrupted; inspect before recovery/u,
        );
        return true;
      },
    );
    assert.deepEqual(storeSnapshot(directory), before, fault);
    if (fault !== "live") assertDeadPid(pid);
  }
  for (const hasLock of [false, true]) {
    const directory = join(root, `released-${hasLock}`);
    mkdirSync(directory);
    // Generated by v0.32.0's WorkerStore.acquire/append/release, before this
    // protocol change; retain the exact released bytes through acquisition.
    const released = readFileSync(
      new URL("../../fixtures/wo143-released-events.jsonl", import.meta.url),
      "utf8",
    );
    writeFileSync(join(directory, "events.jsonl"), released);
    const pid = hasLock ? deadPid() : undefined;
    if (pid !== undefined)
      writeFileSync(join(directory, "host.lock"), JSON.stringify({ pid }));
    const store = new WorkerStore(directory);
    store.acquire();
    assert.equal(store.read(), released);
    assert.deepEqual(
      JSON.parse(readFileSync(join(directory, "host.lock"), "utf8")),
      { pid: process.pid },
    );
    store.release();
    assert.deepEqual(readdirSync(directory), ["events.jsonl"]);
    if (pid !== undefined) assertDeadPid(pid);
  }
  const live = join(root, "live-lock");
  mkdirSync(live);
  writeFileSync(join(live, "host.lock"), JSON.stringify({ pid: process.pid }));
  let inspected = false;
  assert.throws(
    () =>
      new WorkerStore(live).acquire(() => {
        inspected = true;
      }),
    /already has a live host/u,
  );
  assert.equal(
    inspected,
    false,
    "mutable log must not be inspected before excluding its live writer",
  );
});

test("WO-143 malformed resident state preserves dead append guard and lock before reclaim", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-guard-inspection-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  await seedFlight(root);
  const target = join(root, ".resident-append");
  const pid = deadPid();
  abandonedGuard(target, pid);
  writeFileSync(join(target, "host.lock"), JSON.stringify({ pid }));
  writeFileSync(join(root, "events.jsonl"), '{"torn":');
  const before = storeSnapshot(root);
  await assert.rejects(
    new ResidentStore(root).acquire(),
    /invalid.*event log/u,
  );
  assert.deepEqual(storeSnapshot(root), before);
  assertDeadPid(pid);
});

test("WO-143 killed actors drain without further polling lock acquisitions", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-killed-poll-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  let at = 0;
  let killed = false;
  let finish!: (value: ActorResult) => void;
  const host = new ResidentHost({
    directory,
    policyId: "fixture.progressive",
    configuration: configuration(directory),
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: fake(() => ({
      completed: new Promise((resolve) => {
        finish = resolve;
      }),
      kill: () => {
        killed = true;
      },
    })),
  });
  await host.start();
  let acquisitions = 0;
  const acquire = WorkerStore.prototype.acquire;
  WorkerStore.prototype.acquire = function (...args) {
    acquisitions++;
    return acquire.apply(this, args);
  };
  try {
    await recordPresence(directory, "away", () => at);
    at = 10;
    const tick = host.tick();
    await until(
      () => events(host.store, "ScriptEpisodeDispatched").length === 1,
    );
    await recordPresence(directory, "returned", () => at);
    await until(() => killed);
    const count = acquisitions;
    at = 100000;
    await delay(100);
    assert.equal(
      acquisitions,
      count,
      "expired deadlines must not cycle locks after kill",
    );
    await recordPresence(directory, "away", () => at);
    const withPresence = acquisitions;
    await delay(100);
    assert.equal(
      acquisitions,
      withPresence,
      "changed log must not cycle locks after kill",
    );
    finish({ ...result, verified: false, reason: "operator-return" });
    await tick;
    assert.equal(
      acquisitions,
      withPresence + 1,
      "final outcome still gets its required transaction",
    );
  } finally {
    WorkerStore.prototype.acquire = acquire;
    host.close();
  }
});

test("WO-143 concurrent dead-guard starts publish exactly one reclaim claim", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-guard-contenders-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, "store");
  mkdirSync(directory);
  const pid = deadPid();
  const old = abandonedGuard(directory, pid);
  const processes = ["a", "b"].map((name) =>
    workerPeer(directory, join(root, name), [
      { op: "linkSync", match: `next-${old.token}.json`, when: "before" },
    ]),
  );
  t.after(async () => {
    await Promise.all(processes.map((peer) => peer.stop()));
  });
  await Promise.all(processes.map((peer) => peer.ready(0)));
  for (const peer of processes) peer.go(0);
  const outcomes = await Promise.all(processes.map((peer) => peer.result()));
  assert.equal(outcomes.filter((row) => row.acquired).length, 1);
  assert.equal(
    outcomes.reduce((sum, row) => sum + row.claims, 0),
    1,
  );
  assert.equal(existsSync(old.guard), false);
  assert.throws(() => new WorkerStore(directory).acquire(), /live host/u);
  assertDeadPid(pid);
  t.diagnostic(
    "two starts held before the same exclusive claim: one claim, one writer, one refusal",
  );
});

function workerPeer(
  directory: string,
  control: string,
  points: { op: string; match?: string; when?: "before" | "after" }[],
  operation: "acquire" | "transaction" = "acquire",
) {
  const child = spawn(
    process.execPath,
    [
      fileURLToPath(
        new URL("./fixtures/worker-lock-process.js", import.meta.url),
      ),
      JSON.stringify({ directory, control, points, operation }),
    ],
    { stdio: ["ignore", "ignore", "pipe", "ipc"] },
  );
  let stderr = "";
  child.stderr!.on("data", (chunk) => {
    stderr += String(chunk);
  });
  const exited = new Promise<void>((resolve) =>
    child.once("exit", () => resolve()),
  );
  const wait = async (path: string) =>
    until(() => {
      if (child.exitCode !== null || child.signalCode !== null)
        assert.fail(`worker peer exited: ${stderr}`);
      return existsSync(path);
    }, 10000);
  return {
    child,
    ready: (index: number) => wait(`${control}.ready-${index}`),
    go: (index: number) => writeFileSync(`${control}.go-${index}`, "go"),
    async result() {
      await wait(`${control}.result`);
      return JSON.parse(readFileSync(`${control}.result`, "utf8")) as {
        acquired: boolean;
        claims: number;
        error: string;
      };
    },
    async release() {
      if (child.exitCode === null && child.signalCode === null)
        child.send("release");
      await exited;
    },
    async stop() {
      if (child.exitCode === null && child.signalCode === null)
        child.kill("SIGKILL");
      await exited;
    },
  };
}

test("WO-147 a lock released between observation and read is re-inspected under the guard", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-lock-contention-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const peers: ReturnType<typeof workerPeer>[] = [];
  t.after(async () => {
    await Promise.all(peers.map((peer) => peer.stop()));
  });
  for (const operation of ["acquire", "transaction"] as const) {
    const directory = join(root, operation);
    mkdirSync(directory);
    if (operation === "transaction") await seedFlight(directory);
    const lockDirectory =
      operation === "transaction"
        ? join(directory, ".resident-append")
        : directory;
    const holder = workerPeer(
      lockDirectory,
      join(root, `${operation}-holder`),
      [],
    );
    peers.push(holder);
    assert.equal((await holder.result()).acquired, true);
    const before = readFileSync(join(directory, "events.jsonl"), "utf8");
    const contender = workerPeer(
      directory,
      join(root, `${operation}-contender`),
      [{ op: "lstatSync", match: "host.lock", when: "after" }],
      operation,
    );
    peers.push(contender);
    await contender.ready(0);
    await holder.release();
    contender.go(0);
    const outcome = await contender.result();
    assert.equal(outcome.acquired, true, outcome.error);
    assert.equal(outcome.error, "");
    assert.equal(readFileSync(join(directory, "events.jsonl"), "utf8"), before);
    await contender.release();
  }
  t.diagnostic(
    "direct acquisition and resident transaction both survive holder release after observed host.lock; prior event bytes unchanged",
  );
});

test("WO-147 retirement probe tolerates a delayed claim present when recursive cleanup begins", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-lock-retirement-probe-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const attempts = 20;
  let reproduced = 0;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const directory = join(root, String(attempt));
    mkdirSync(directory);
    const peers: ReturnType<typeof workerPeer>[] = [];
    const original = workerPeer(directory, join(directory, "original"), [
      { op: "preflight" },
      { op: "rmSync", when: "before" },
    ]);
    peers.push(original);
    await original.ready(0);
    const guard = join(directory, "host-lock-recovery");
    const targetName = readlinkSync(guard);
    const target = join(directory, targetName);
    const ownerPath = join(target, "owner.json");
    const owner = JSON.parse(readFileSync(ownerPath, "utf8")) as {
      pid: number;
      token: string;
    };
    const pid = deadPid();
    writeFileSync(ownerPath, JSON.stringify({ ...owner, pid }) + "\n");
    const next = `next-${owner.token}.json`;
    const delayed = workerPeer(directory, join(directory, "delayed"), [
      { op: "linkSync", match: next, when: "before" },
      { op: "linkSync", match: next, when: "after" },
    ]);
    peers.push(delayed);
    try {
      await delayed.ready(0);
      original.go(0);
      await original.ready(1);
      assert.deepEqual(
        JSON.parse(readFileSync(join(directory, "host.lock"), "utf8")),
        { pid: original.child.pid },
      );
      delayed.go(0);
      await delayed.ready(1);
      assert.ok(existsSync(join(target, next)));
      original.go(1);
      const outcome = await original.result();
      if (!outcome.acquired) reproduced++;
      else await original.release();
      delayed.go(1);
      const refused = await delayed.result();
      assert.equal(refused.acquired, false);
      await delayed.release();
      assertDeadPid(pid);
    } finally {
      await Promise.all(peers.map((peer) => peer.stop()));
    }
  }
  assert.equal(
    reproduced,
    0,
    "retirement must not fail after publishing host.lock when a delayed claim is present",
  );
  t.diagnostic(
    `${attempts} attempts paused retirement before rmSync with a delayed successor claim present; ENOTEMPTY inference not reproduced`,
  );
});

test("WO-143 a delayed claimant cannot unlink a successor through a retired target", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-guard-generation-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, "store");
  mkdirSync(directory);
  const peers: ReturnType<typeof workerPeer>[] = [];
  t.after(async () => {
    await Promise.all(peers.map((peer) => peer.stop()));
  });
  const original = workerPeer(directory, join(root, "original"), [
    { op: "preflight" },
    { op: "unlinkSync", match: "host-lock-recovery", when: "after" },
  ]);
  peers.push(original);
  await original.ready(0);
  const guard = join(directory, "host-lock-recovery");
  const originalTarget = readlinkSync(guard);
  const delayed = workerPeer(directory, join(root, "delayed"), [
    { op: "readlinkSync", match: "host-lock-recovery", when: "after" },
  ]);
  peers.push(delayed);
  await delayed.ready(0);
  original.go(0);
  await original.ready(1);
  await original.stop();
  assert.equal(existsSync(guard), false);
  assert.ok(
    existsSync(join(directory, originalTarget)),
    "retired target survives interrupted cleanup",
  );
  const successor = workerPeer(directory, join(root, "successor"), [
    { op: "preflight" },
  ]);
  peers.push(successor);
  await successor.ready(0);
  const successorTarget = readlinkSync(guard);
  assert.notEqual(successorTarget, originalTarget);
  const lock = join(directory, "host.lock");
  const lockBefore = readFileSync(lock, "utf8");
  const lockInode = lstatSync(lock).ino;
  assert.deepEqual(JSON.parse(lockBefore), { pid: original.child.pid });
  delayed.go(0);
  const refused = await delayed.result();
  assert.equal(refused.acquired, false);
  assert.equal(
    refused.claims,
    1,
    "loser actually claims orphan before canonical-target fence",
  );
  assert.equal(
    readlinkSync(guard),
    successorTarget,
    "successor guard is intact",
  );
  // Without the claim-time fence the refused claimant still replaces this lock.
  assert.equal(
    readFileSync(lock, "utf8"),
    lockBefore,
    "refused claimant leaves the shared host lock untouched",
  );
  assert.equal(lstatSync(lock).ino, lockInode, "host lock inode is unchanged");
  successor.go(0);
  assert.equal((await successor.result()).acquired, true);
  t.diagnostic(
    "delayed old-target claim refused after canonical identity changed; successor retained ownership",
  );
});

test(
  "WO-143 once and loop recover kills during a running episode's polling acquisition",
  { timeout: 60000 },
  async (t) => {
    const root = mkdtempSync(join(tmpdir(), "dotln-poll-crash-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const template = join(root, "template");
    mkdirSync(template);
    await seedFlight(template, 0, false);
    for (const mode of ["once", "loop"] as const) {
      const make = (label: string) => {
        const directory = join(root, label);
        cpSync(template, directory, { recursive: true });
        return { directory, target: join(directory, ".resident-append") };
      };
      const discovery = make(`${mode}-discovery`);
      const steps = runLockProcess({
        ...crashInput(
          discovery.directory,
          discovery.target,
          mode,
          "discovery",
          undefined,
          10,
        ),
        poll: true,
      });
      for (const step of steps) {
        const { directory, target } = make(`${mode}-${step.index}`);
        const actual = await killLockProcess({
          ...crashInput(directory, target, mode, "kill", step.index, 10),
          poll: true,
        });
        assert.deepEqual(actual, step);
        const store = new ResidentStore(directory);
        const before = store.read();
        assert.equal(
          events(store, "ScriptEpisodeDispatched").length,
          1,
          "actual subprocess dispatched before polling crash",
        );
        assert.equal(
          events(store, "ScriptEpisodeObserved").length,
          0,
          "episode remains in flight",
        );
        runLockProcess(
          crashInput(directory, target, mode, "restart", undefined, 111),
        );
        assert.ok(store.read().startsWith(before));
        assert.equal(events(store, "ScriptEpisodeLost").length, 1);
      }
      t.diagnostic(
        `${mode}: ${steps.length} running-episode polling boundaries; dispatched subprocess episode is lost once after restart`,
      );
    }
  },
);
