import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { join } from "node:path";
import { decodeLog } from "@dotln/kernel";
import { actorCatalog } from "../src/actor-catalog.js";
import { cliWorkerAdapter } from "../src/cli-actor.js";
import { ResidentHost } from "../src/resident-host.js";
import {
  recordPresence,
  answerHandoff,
  replayResident,
} from "../src/resident-store.js";
import {
  residentEpisodeId,
  residentMachine,
  type ResidentState,
} from "../src/resident-state.js";
import { WorkerFailure } from "../src/worker-protocol.js";
import { runWorkerProcess } from "../src/worker-transport.js";
import { actorFixture, completedRunner } from "./resident-actors.fixture.js";
const state = (h: ResidentHost) =>
  replayResident(h.store.read()).state.resident as unknown as ResidentState;
const events = (h: ResidentHost, type: string) =>
  decodeLog(h.store.read()).filter((e) => e.type === type);

for (const kind of ["writer", "inspection"] as const)
  test(`WO-122 ${kind} dispatches through the resident with stamp and envelope; a claim never advances the phase`, async (t) => {
    const f = actorFixture(kind);
    let at = 0,
      calls = 0;
    const host: ResidentHost = new ResidentHost({
      ...f,
      policyId: f.configuration.policyId,
      now: () => at,
      capabilities: () => ["adapter.fixture"],
      catalog: {
        ...actorCatalog,
        "cli-worker": cliWorkerAdapter({
          version: "0.154.0",
          runner: (launch) => {
            calls++;
            assert.equal(launch.resident?.store, f.directory);
            assert.equal(
              launch.resident?.episodeId,
              JSON.parse(launch.input).episodeId,
            );
            assert.notEqual(launch.resident?.episodeId, f.request.episodeId);
            assert.equal(state(host).present, false);
            assert.ok(
              launch.args.includes(
                kind === "writer"
                  ? 'default_permissions="dotln-writer"'
                  : 'default_permissions="dotln-worker"',
              ),
            );
            assert.equal(
              launch.args.includes("code_mode_host"),
              kind === "inspection",
            );
            return completedRunner(launch);
          },
        }),
      },
    });
    await host.start();
    t.after(() => {
      host.close();
      f.dispose();
    });
    await recordPresence(f.directory, "away", () => at);
    at = 10;
    await host.tick();
    assert.equal(calls, 1);
    assert.equal(events(host, "CliWorkerObserved").length, 1);
    const observed = events(host, "CliWorkerObserved")[0]!.payload as any;
    assert.equal(observed.worker.launch.origin, "actor");
    assert.equal(observed.worker.launch.row, "X-U1");
    assert.equal(observed.worker.result.envelope.status, "completed");
    assert.equal(observed.worker.result.envelope.episodeId, observed.episodeId);
    assert.equal(observed.verified, false);
    assert.equal(state(host).machine!.state, "probe");
    assert.equal(state(host).present, false);
    t.diagnostic(
      `${kind}: 1 dispatch, X-U1 claim, stamped envelope, operator away, no verified promotion`,
    );
  });

test("WO-122 unavailable launch row names its source and never falls back; nested authority cannot widen the phase", async (t) => {
  for (const mode of ["unavailable", "authority"] as const) {
    const f = actorFixture();
    t.after(f.dispose);
    if (mode === "authority")
      (
        f.configuration.graph.presence![0]!.phases[0]!.envelope as any
      ).allowedEffects = ["repo.inspect"];
    const host = new ResidentHost({
      ...f,
      policyId: f.configuration.policyId,
      now: () => 10,
      capabilities: () => ["adapter.fixture"],
      catalog: {
        ...actorCatalog,
        "cli-worker": cliWorkerAdapter({
          ...(mode === "unavailable"
            ? {
                rows: {
                  "codex-cli-exec": {
                    row: "X-U1",
                    label: "unavailable",
                    reason: "fixture missing path",
                  },
                },
              }
            : {}),
          runner: () => {
            assert.fail("must not launch");
          },
          version: "0.154.0",
        }),
      },
    });
    await host.start();
    await recordPresence(f.directory, "away", () => 0);
    await host.tick();
    host.close();
    assert.equal(events(host, "ScriptEpisodeDispatched").length, 0);
    assert.match(
      JSON.stringify(
        events(
          host,
          mode === "unavailable" ? "ActorUnavailable" : "ScriptEpisodeRefused",
        ),
      ),
      mode === "unavailable" ? /X-U1.*unavailable/ : /phase authority/,
    );
  }
});

test("WO-122 transport rejection and synchronous refusal become one durable failure each", async (t) => {
  for (const sync of [true, false]) {
    const f = actorFixture();
    t.after(f.dispose);
    const host = new ResidentHost({
      ...f,
      policyId: f.configuration.policyId,
      now: () => 10,
      capabilities: () => ["adapter.fixture"],
      catalog: {
        ...actorCatalog,
        "cli-worker": cliWorkerAdapter({
          version: "0.154.0",
          runner: () => {
            if (sync) throw new WorkerFailure("profile-refused");
            return {
              accepted: Promise.resolve(),
              completed: Promise.reject(new WorkerFailure("interrupted")),
              alive: () => false,
              kill: () => {},
            };
          },
        }),
      },
    });
    await host.start();
    await recordPresence(f.directory, "away", () => 0);
    await host.tick();
    host.close();
    const observed = events(host, "CliWorkerObserved");
    assert.equal(observed.length, 1);
    assert.match(
      JSON.stringify(observed),
      sync ? /profile-refused/ : /interrupted/,
    );
  }
});

test("WO-122 human packet survives restart, rejects invalid answers, and resumes after an explicit human answer", async (t) => {
  const f = actorFixture();
  const question = {
    workOrderId: f.request.workOrder.workOrderId,
    question: "Which scope should run?",
    options: [
      { id: "small", label: "Small change" },
      { id: "hold", label: "Hold scope" },
    ],
    evidenceRefs: ["fixture:scope"],
  };
  f.configuration.actors.probe = {
    kind: "human-handoff",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 1, tokens: 200 },
    handoff: question,
  };
  let at = 10;
  const options = {
    ...f,
    policyId: f.configuration.policyId,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      "cli-worker": cliWorkerAdapter({
        runner: completedRunner,
        version: "0.154.0",
      }),
    },
  };
  let host = new ResidentHost(options);
  await host.start();
  await recordPresence(f.directory, "away", () => 0);
  await host.tick();
  const packet = Object.values(state(host).handoffs)[0]!.packet;
  const packetDirectory = join(f.directory, "control/local/handoffs");
  assert.deepEqual(
    JSON.parse(
      readFileSync(join(packetDirectory, `${packet.episodeId}.json`), "utf8"),
    ),
    { ...question, episodeId: packet.episodeId },
  );
  assert.equal(state(host).machine!.current, null);
  host.close();
  host = new ResidentHost(options);
  await host.start();
  t.after(() => {
    host.close();
    f.dispose();
  });
  at = 20;
  await host.tick();
  at = 30;
  await host.tick();
  assert.equal(events(host, "HandoffRequested").length, 1);
  assert.equal(readdirSync(packetDirectory).length, 1);
  const answer = {
    episodeId: packet.episodeId,
    workOrderId: packet.workOrderId,
    optionId: "small",
  };
  for (const bad of [
    { ...answer, episodeId: "missing" },
    { ...answer, workOrderId: "other" },
    { ...answer, optionId: "missing" },
  ])
    await assert.rejects(
      answerHandoff(f.directory, bad, () => at),
      /handoff answer/,
    );
  assert.equal(events(host, "HandoffAnswered").length, 0);
  await answerHandoff(f.directory, answer, () => at);
  await assert.rejects(
    answerHandoff(f.directory, answer, () => at),
    /handoff answer/,
  );
  assert.equal(state(host).machine!.state, "widen");
  at = 40;
  await host.tick();
  assert.equal(events(host, "CliWorkerObserved").length, 1);
  const saved = Date.now;
  const before = JSON.stringify(state(host));
  try {
    Date.now = () => {
      throw new Error("ambient clock in replay");
    };
    assert.equal(JSON.stringify(state(host)), before);
  } finally {
    Date.now = saved;
  }
  t.diagnostic(
    "one packet/request across restart; three invalid answers refused; explicit answer resumed CLI dispatch; replay deterministic",
  );
});

for (const returned of [false, true])
  test(`WO-122 a crash after handoff dispatch recovers the same packet${returned ? " across a new absence without promoting it" : " without losing the question"}`, async (t) => {
    const f = actorFixture();
    t.after(f.dispose);
    f.configuration.actors.probe = {
      kind: "human-handoff",
      effect: "repo.inspect",
      surface: "fixture.source",
      resources: { files: 1, lines: 1, tokens: 200 },
      handoff: {
        workOrderId: "held",
        question: "Proceed?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ],
        evidenceRefs: ["fixture:evidence"],
      },
    };
    let at = 10;
    let dispatchGeneration: number;
    const options = {
      ...f,
      policyId: f.configuration.policyId,
      now: () => at,
      capabilities: () => ["adapter.fixture"],
    };
    let host = new ResidentHost(options);
    await host.start();
    await recordPresence(f.directory, "away", () => 0);
    await host.store.transaction((tx) => {
      tx.sample(10);
      const machine = residentMachine(tx.resident!);
      dispatchGeneration = machine.generation;
      const dueAt = machine.due(10)!;
      const id = residentEpisodeId(machine, dueAt);
      const spec = f.configuration.actors.probe!;
      tx.append("ScriptEpisodeDispatched", {
        episodeId: id,
        dueAt,
        phaseId: "probe",
        kind: spec.kind,
        effect: spec.effect,
        authorityEnvelopeId:
          machine.phase()!.effectiveEnvelope.authorityEnvelopeId,
      });
      actorCatalog[spec.kind].run(spec, {
        residentStore: f.directory,
        episodeId: id,
      });
    });
    host.close();
    if (returned) {
      await recordPresence(f.directory, "returned", () => 11);
      await recordPresence(f.directory, "away", () => 12);
      at = 22;
    }
    host = new ResidentHost(options);
    await host.start();
    await host.tick();
    host.close();
    assert.equal(events(host, "HandoffRequested").length, 1);
    assert.equal(events(host, "ScriptEpisodeLost").length, 0);
    assert.equal(
      readdirSync(join(f.directory, "control/local/handoffs")).length,
      1,
    );
    const handoff = Object.values(state(host).handoffs)[0]!;
    assert.equal(handoff.generation, dispatchGeneration!);
    if (returned) {
      const currentGeneration = state(host).machine!.generation;
      assert.notEqual(currentGeneration, dispatchGeneration!);
      await answerHandoff(
        f.directory,
        {
          episodeId: handoff.packet.episodeId,
          workOrderId: "held",
          optionId: "yes",
        },
        () => 23,
      );
      assert.equal(
        state(host).handoffs[handoff.packet.episodeId]!.answer,
        "yes",
      );
      assert.equal(state(host).machine!.state, "probe");
      assert.equal(state(host).machine!.generation, currentGeneration);
    }
  });

test("WO-122 nested expiry, missing evidence and unrepresentable revocation refuse before launch", async (t) => {
  for (const condition of ["expired", "evidence", "revocation"] as const) {
    const f = actorFixture();
    t.after(f.dispose);
    for (const spec of Object.values(f.configuration.actors)) {
      spec.worker!.request = structuredClone(spec.worker!.request);
      const request = spec.worker!.request as any;
      if (condition === "expired") request.authorityEnvelope.expiresAt = 5;
      if (condition === "evidence")
        request.authorityEnvelope.requiredEvidence = [
          "verified-input",
          "absent-proof",
        ];
      if (condition === "revocation")
        request.authorityEnvelope.revocationEventTypes.push("ExtraRevocation");
    }
    const host = new ResidentHost({
      ...f,
      policyId: f.configuration.policyId,
      now: () => 10,
      capabilities: () => ["adapter.fixture"],
      catalog: {
        ...actorCatalog,
        "cli-worker": cliWorkerAdapter({
          runner: () => assert.fail("must not launch"),
          version: "0.154.0",
        }),
      },
    });
    await host.start();
    await recordPresence(f.directory, "away", () => 0);
    await host.tick();
    host.close();
    assert.equal(events(host, "ScriptEpisodeDispatched").length, 0);
    assert.equal(events(host, "ScriptEpisodeRefused").length, 1);
  }
});

test("WO-122 late answers release the hold without advancing an expired policy", async (t) => {
  const f = actorFixture();
  t.after(f.dispose);
  f.configuration.actors.probe = {
    kind: "human-handoff",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 1, tokens: 200 },
    handoff: {
      workOrderId: "held",
      question: "Proceed?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ],
      evidenceRefs: ["fixture:evidence"],
    },
  };
  const host = new ResidentHost({
    ...f,
    policyId: f.configuration.policyId,
    now: () => 10,
    capabilities: () => ["adapter.fixture"],
  });
  await host.start();
  await recordPresence(f.directory, "away", () => 0);
  await host.tick();
  const packet = Object.values(state(host).handoffs)[0]!.packet;
  await answerHandoff(
    f.directory,
    { episodeId: packet.episodeId, workOrderId: "held", optionId: "yes" },
    () => 600010,
  );
  assert.equal(state(host).machine!.state, "expired");
  assert.equal(state(host).handoffs[packet.episodeId]!.answer, "yes");
  host.close();
});

test("WO-122 pending handoff holds its order across return while another order dispatches", async (t) => {
  const f = actorFixture();
  t.after(f.dispose);
  // A human answer moves probe to widen, whose question is then held. Return
  // re-arms probe for a distinct order without answering the widen question.
  const handoff = (workOrderId: string) => ({
    kind: "human-handoff" as const,
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 1, tokens: 200 },
    handoff: {
      workOrderId,
      question: "Proceed?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ],
      evidenceRefs: ["fixture:evidence"],
    },
  });
  f.configuration.actors.probe = handoff("first");
  f.configuration.actors.widen = handoff("held");
  let at = 10;
  const host = new ResidentHost({
    ...f,
    policyId: f.configuration.policyId,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
  });
  await host.start();
  await recordPresence(f.directory, "away", () => 0);
  await host.tick();
  const first = Object.values(state(host).handoffs)[0]!.packet;
  await answerHandoff(
    f.directory,
    { episodeId: first.episodeId, workOrderId: "first", optionId: "yes" },
    () => at,
  );
  at = 20;
  await host.tick();
  const held = Object.values(state(host).handoffs).find(
    (h) => h.packet.workOrderId === "held",
  )!;
  await recordPresence(f.directory, "returned", () => 21);
  await recordPresence(f.directory, "away", () => 22);
  at = 32;
  await host.tick();
  assert.equal(events(host, "HandoffRequested").length, 3);
  assert.equal(state(host).handoffs[held.packet.episodeId]!.answer, undefined);
  // An answer from the previous policy generation cannot promote this new one.
  await answerHandoff(
    f.directory,
    { episodeId: held.packet.episodeId, workOrderId: "held", optionId: "yes" },
    () => 33,
  );
  assert.equal(state(host).machine!.state, "probe");
  host.close();
});

test("WO-122 native process stamps are per launch and cancellation does not wait on escaped stderr", async (t) => {
  const f = actorFixture();
  t.after(f.dispose);
  const original = process.env["DOTLN_RESIDENT_EPISODE_ID"];
  const launch = {
    binary: process.execPath,
    cwd: f.cwd,
    input: "",
    timeoutMs: 3000,
  };
  const outputs = await Promise.all(
    ["one", "two"].map(
      (episodeId) =>
        runWorkerProcess({
          ...launch,
          resident: { store: f.directory, episodeId },
          args: ["-e", "console.log(process.env.DOTLN_RESIDENT_EPISODE_ID)"],
        }).completed,
    ),
  );
  assert.deepEqual(
    outputs.map((o) => o.stdout.trim()),
    ["one", "two"],
  );
  assert.equal(process.env["DOTLN_RESIDENT_EPISODE_ID"], original);
  const pidFile = join(f.root, "escaped-pid");
  const script = `const {spawn}=require('node:child_process'); const {writeFileSync}=require('node:fs'); const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{detached:true,stdio:['ignore','ignore',2]}); writeFileSync(${JSON.stringify(pidFile)},String(child.pid)); child.unref(); setInterval(()=>{},1000);`;
  const child = runWorkerProcess({
    ...launch,
    timeoutMs: 300,
    resident: { store: f.directory, episodeId: "kill" },
    args: ["-e", script],
  });
  try {
    await assert.rejects(
      Promise.race([
        child.completed,
        delay(2000).then(() => {
          throw new Error("unbounded cancellation");
        }),
      ]),
      /deadline-exceeded/,
    );
  } finally {
    child.kill();
    try {
      process.kill(Number(readFileSync(pidFile, "utf8")), "SIGKILL");
    } catch {}
  }
});
