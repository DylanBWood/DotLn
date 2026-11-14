import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "../src/temporary-roots.js";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { decodeLog, type Event, type ExecutableProgramV1 } from "@dotln/kernel";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import {
  actorCatalog,
  type ActorResult,
  type ActorSpec,
} from "../src/actor-catalog.js";
import { ResidentHost } from "../src/resident-host.js";
import {
  ResidentStore,
  recordPresenceObservation,
  replayResident,
} from "../src/resident-store.js";
import {
  decodeResidentConfiguration,
  type ResidentState,
} from "../src/resident-state.js";
import { projectRuntimeStatus } from "../src/runtime-status.js";
import {
  verticalProgram,
  type IntentBinding,
  type VerticalCommand,
} from "../src/vertical.js";

// The index record the index command writes beside its pages; the resident
// reads the index page's cards from it and never a page's Markdown.
const fixtureCard = (
  id: string,
  section: string,
  phase: string,
  dependency: string,
  verdict: string | null,
) => ({
  id,
  line: 1,
  section,
  title: `${id} — Fixture`,
  phase,
  dependency,
  verdict,
  fields: { State: `${phase}.` },
  links: [],
});
const index = `${JSON.stringify(
  {
    schemaVersion: 1,
    index: {
      cards: [
        fixtureCard("WO-114", "Active", "active", "ready", null),
        fixtureCard("WO-158", "Open", "queued", "blocked", "fail"),
      ],
    },
    history: {
      cards: [fixtureCard("WO-120", "Closed", "closed", "unknown", "pass")],
    },
    workstreams: [],
    releaseTags: [],
  },
  null,
  2,
)}\n`;
const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo067-presence.json", import.meta.url),
    "utf8",
  ),
);
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const result: ActorResult = {
  exitCode: 0,
  signal: null,
  stdoutSha256: hash("ok\n"),
  firstLine: "ok",
  verified: true,
  reason: "completed",
};
const read = (directory: string) =>
  readFileSync(join(directory, "runtime-status-v1.json"), "utf8");

test("WO-114 per-event status, tick, privacy and restart transcript", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-status-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const indexPath = join(directory, "index.json");
  writeFileSync(indexPath, index);
  const spec: ActorSpec = {
    kind: "script",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 0, tokens: 0 },
    command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
    cwd: directory,
    timeoutMs: 1000,
    expectedStdoutSha256: hash("ok\n"),
  };
  const configuration = decodeResidentConfiguration({
    ...structuredClone(fixture),
    policyId: "fixture.progressive",
    actors: Object.fromEntries(
      ["probe", "widen", "peak"].map((phase) => [phase, spec]),
    ),
    evidence: ["verified-input"],
  });
  let at = 0;
  let finish!: (result: ActorResult) => void;
  const options = {
    directory,
    policyId: "fixture.progressive",
    configuration,
    workOrderCards: () => readFileSync(indexPath, "utf8"),
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      script: {
        kind: "script" as const,
        available: () => null,
        run: () => ({
          completed: new Promise<ActorResult>((resolve) => {
            finish = resolve;
          }),
          kill: () => {},
        }),
      },
    },
  };
  const host = new ResidentHost(options);
  await host.start();
  const transcript: string[] = [hash(read(directory))];
  const store = new ResidentStore(directory, {}, () =>
    readFileSync(indexPath, "utf8"),
  );
  await store.transaction((tx) =>
    tx.append("OperatorPresenceChanged", { presence: "away" }, 0),
  );
  transcript.push(hash(read(directory)));
  at = 10;
  const tick = host.tick();
  for (let i = 0; i < 200; i++) {
    if (JSON.parse(read(directory)).liveEpisodes.length === 1) break;
    await delay(10);
  }
  const live = JSON.parse(read(directory));
  assert.equal(live.liveEpisodes.length, 1);
  assert.equal(live.liveEpisodes[0].startedAt, 10);
  assert.equal(live.liveEpisodes[0].elapsedMs, 0);
  assert.deepEqual(live.workOrders.items, [
    { order: "WO-114", phase: "active", dependency: "ready", verdict: null },
    {
      order: "WO-158",
      phase: "queued",
      dependency: "blocked",
      verdict: "fail",
    },
  ]);
  transcript.push(hash(read(directory)));
  at = 30;
  await store.transaction((tx) => tx.sample(at));
  assert.equal(JSON.parse(read(directory)).liveEpisodes[0].elapsedMs, 20);
  transcript.push(hash(read(directory)));
  finish(result);
  await tick;
  const final = read(directory);
  assert.deepEqual(JSON.parse(final).liveEpisodes, []);
  transcript.push(hash(final));
  assert.ok(!final.includes(directory), "physical store path stays private");
  assert.ok(!/sessionId|hostName|hostname|endpoint|cwd|command/u.test(final));
  const log = store.read();
  host.close();
  unlinkSync(join(directory, "runtime-status-v1.json"));
  const restarted = new ResidentHost(options);
  await restarted.start();
  assert.equal(read(directory), final);
  assert.equal(restarted.store.read(), log);
  restarted.close();
  assert.deepEqual(transcript, [
    "c108fac47e4d7710367d4f0dc35a32387e76f0d865c14a1e3d1a8cba009322c7",
    "4e91c9751c23a6afbd710c50caf316ae31a0c6f8334068df63bcf827666d3160",
    "256d1944c49e087e5a6af826c06b9b81e5ce8fc58365b0834bb176cc63c75813",
    "531d99893c75e1035544dfe9a7eec5b3e450a21a88db51691de4190e0bee5f6d",
    "1c0c459609e660129b0ab65795c34e6d90541a1522f22e0d83b2d58568f812b2",
  ]);
});

function configuration(directory: string) {
  const spec: ActorSpec = {
    kind: "script",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 0, tokens: 0 },
    command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
    cwd: directory,
    timeoutMs: 1000,
    expectedStdoutSha256: hash("ok\n"),
  };
  return decodeResidentConfiguration({
    ...structuredClone(fixture),
    policyId: "fixture.progressive",
    actors: Object.fromEntries(
      ["probe", "widen", "peak"].map((phase) => [phase, spec]),
    ),
    evidence: ["verified-input"],
  });
}

test("intent holds survive replay and restart without exposing raw diagnostics", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-intent-status-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const indexPath = join(directory, "index.json");
  writeFileSync(indexPath, index);
  let at = 0;
  const options = {
    directory,
    configuration: configuration(directory),
    policyId: "fixture.progressive",
    workOrderCards: () => readFileSync(indexPath, "utf8"),
    now: () => at,
  };
  const first = new ResidentHost(options);
  await first.start();
  try {
    await first.store.transaction((tx) => {
      tx.sample(++at);
      tx.append("IntentHeld", {
        draftId: "WO-997",
        step: "contract",
        reason: "private raw diagnostic",
      });
      tx.append("IntentHeld", {
        draftId: "WO-998",
        step: "private host path",
        reason: "another private diagnostic",
      });
    });
    const view = JSON.parse(read(directory));
    assert.deepEqual(view.holds, [
      {
        kind: "dispatch",
        reason: "intent-needs-human:contract",
        order: "WO-997",
      },
      { kind: "dispatch", reason: "intent-needs-human", order: "WO-998" },
    ]);
    assert.ok(!read(directory).includes("private"));
    const log = first.store.read();
    const state = replayResident(log).state
      .resident as unknown as ResidentState;
    assert.deepEqual(projectRuntimeStatus(state, decodeLog(log), index), view);
  } finally {
    first.close();
  }
  ++at;
  const restarted = new ResidentHost(options);
  try {
    await restarted.start();
    assert.equal(JSON.parse(read(directory)).holds.length, 2);
    assert.ok(!read(directory).includes("private"));
  } finally {
    restarted.close();
  }
});

// Every command of one continuation, with the identities a recorded log uses.
function verticalCommands(key: string): VerticalCommand[] {
  const found: VerticalCommand[] = [];
  const pending = [verticalProgram(key)];
  const seen = new Set<ExecutableProgramV1>();
  while (pending.length) {
    const program = pending.shift()!;
    if (seen.has(program)) continue;
    seen.add(program);
    if (program.kind !== "Invoke") continue;
    found.push(program.command.payload as unknown as VerticalCommand);
    pending.push(...Object.values(program.continuationByResult));
  }
  return found;
}

test("finished vertical continuations leave live status and keep at most one hold each", () => {
  let at = 0;
  const events: Event[] = [];
  const intents: NonNullable<ResidentState["intents"]> = {};
  const record = (type: string, payload: Record<string, unknown>) =>
    events.push({
      eventId: `evt_${events.length + 1}`,
      type,
      actorId: "resident-host",
      occurredAt: ++at,
      payload,
    } as unknown as Event);
  const admit = (draftId: string) => {
    const key = `intent_${draftId.toLowerCase()}`;
    intents[draftId] = {
      kind: "admitted",
      binding: {
        key,
        authority: { expiresAt: 1_000_000 },
      } as unknown as IntentBinding,
    };
    return key;
  };
  const command = (key: string, step: string) =>
    verticalCommands(key).find((c) => c.step === step && c.round === 0)!;
  const start = (key: string, step: string) => {
    record("IntentStepStarted", {
      key,
      commandId: command(key, step).commandId,
    });
    return command(key, step);
  };
  const settle = (
    key: string,
    step: string,
    result: string,
    terminal: boolean,
  ) =>
    record("IntentStepSettled", {
      key,
      commandId: command(key, step).commandId,
      result,
      terminal,
    });
  const run = (key: string, last: string, result: string) => {
    start(key, "bundle");
    settle(key, "bundle", "completed", false);
    start(key, last);
    settle(key, last, result, true);
  };
  for (let n = 0; n < 20; n++)
    run(admit(`WO-${900 + n}`), "resolution", "completed");
  for (const draftId of ["WO-920", "WO-921", "WO-922"])
    run(admit(draftId), "source-change", "refused");
  run(admit("WO-923"), "contract", "NeedsHuman");
  run(admit("WO-924"), "review", "repair");
  // A pause between steps is not a finish: the row stays, not live.
  const paused = admit("WO-925");
  start(paused, "bundle");
  settle(paused, "bundle", "completed", false);
  // An earlier settled step does not retire the step running now.
  const running = admit("WO-926");
  start(running, "bundle");
  settle(running, "bundle", "completed", false);
  const live = start(running, "source-change");
  intents["WO-927"] = {
    kind: "NeedsHuman",
    step: "contract",
    reason: "private raw diagnostic",
  };
  const state = (step: ResidentState["intentStep"]) =>
    ({ at: ++at, intents, intentStep: step }) as unknown as ResidentState;
  const view = projectRuntimeStatus(
    state({ key: running, commandId: live.commandId }),
    events,
    null,
  );
  assert.deepEqual(view.actors, [
    {
      phase: "bundle",
      kind: "vertical-host",
      availability: "unknown",
      lastEpisode: command(paused, "bundle").episodeId,
    },
    {
      phase: "source-change",
      kind: "vertical-host",
      availability: "available",
      lastEpisode: live.episodeId,
    },
  ]);
  assert.deepEqual(
    view.liveEpisodes.map((row) => [row.order, row.phase, row.episodeId]),
    [["WO-926", "source-change", live.episodeId]],
  );
  const holds = [
    ...["WO-920", "WO-921", "WO-922"].map((order) => ({
      kind: "dispatch",
      reason: "intent-refused:source-change",
      order,
    })),
    {
      kind: "dispatch",
      reason: "intent-needs-human:contract",
      order: "WO-923",
    },
    { kind: "dispatch", reason: "intent-needs-human:review", order: "WO-924" },
    {
      kind: "dispatch",
      reason: "intent-needs-human:contract",
      order: "WO-927",
    },
  ];
  assert.deepEqual(view.holds, holds);
  assert.ok(!JSON.stringify(view).includes("private"));
  // When the running step settles terminally its row and episode retire too.
  settle(running, "source-change", "completed", true);
  const finished = projectRuntimeStatus(state(null), events, null);
  assert.deepEqual(
    finished.actors.map((row) => [row.phase, row.availability]),
    [["bundle", "unknown"]],
  );
  assert.deepEqual(finished.liveEpisodes, []);
  assert.deepEqual(finished.holds, holds);
});

test("[document] WO-114 helper and installed-snapshot heartbeat share the host's index and replay every publication", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-status-writers-"));
  const indexPath = join(directory, "index.json");
  writeFileSync(indexPath, index.replaceAll("WO-158", "WO-999"));
  const selectedIndex = readFileSync(indexPath, "utf8");
  const snapshots: { bytes: string; log: string }[] = [];
  const rename = fs.renameSync;
  t.mock.method(fs, "renameSync", (from: fs.PathLike, to: fs.PathLike) => {
    rename(from, to);
    if (String(to) === join(directory, "runtime-status-v1.json"))
      snapshots.push({
        bytes: read(directory),
        log: readFileSync(join(directory, "events.jsonl"), "utf8"),
      });
  });
  syncBuiltinESMExports();
  t.after(() => {
    t.mock.restoreAll();
    syncBuiltinESMExports();
  });
  const host = new ResidentHost({
    directory,
    configuration: configuration(directory),
    policyId: "fixture.progressive",
    workOrderCards: () => readFileSync(indexPath, "utf8"),
    now: () => 0,
  });
  t.after(() => host.close());
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  await host.start();
  await recordPresenceObservation(
    directory,
    { kind: "away" },
    undefined,
    () => 1,
  );
  const root = new URL("../../../../", import.meta.url);
  // The observer before a tool call carries the heartbeat and pins the runtime
  // it is read from.
  const hook = readFileSync(
    new URL(".claude/hooks/write-observer.mjs", root),
    "utf8",
  );
  const snapshot = hook.match(/\.runtime\/harness\/[a-z0-9]+/u)![0];
  const { recordHarnessHeartbeat } = await import(
    new URL(
      `${snapshot}/packages/skeleton/dist/src/presence-heartbeat.js`,
      root,
    ).href
  );
  await recordHarnessHeartbeat(
    "PreToolUse",
    {
      hook_event_name: "PreToolUse",
      session_id: "00000000-0000-0000-0000-000000000000",
    },
    { DOTLN_RESIDENT_STORE: directory },
    () => 2,
  );
  await new ResidentStore(directory).transaction((tx) => tx.sample(3));
  for (const snapshot of snapshots) {
    const events = decodeLog(snapshot.log);
    const state = replayResident(snapshot.log).state.resident as unknown as
      ResidentState | undefined;
    assert.equal(
      snapshot.bytes,
      JSON.stringify(
        projectRuntimeStatus(state, events, selectedIndex),
        null,
        2,
      ) + "\n",
    );
    const view = JSON.parse(snapshot.bytes);
    assert.deepEqual(
      view.workOrders.items.map((row: { order: string }) => row.order),
      ["WO-114", "WO-999"],
    );
    assert.ok(!snapshot.bytes.includes(directory));
    assert.ok(!snapshot.bytes.includes("00000000-0000-0000-0000-000000000000"));
  }
  // Start publishes twice; each helper appends observation + clock; final sample.
  assert.equal(snapshots.length, 7);
  const latest = read(directory);
  unlinkSync(join(directory, "runtime-status-v1.json"));
  await new ResidentStore(directory).transaction(() => {});
  assert.equal(read(directory), latest);
});

test("WO-276 (rolling review 3, F2): when the owner's card source fails after a good read, a helper over the same store reports the failure and never the cards read before it; a later good read restores them", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-status-source-"));
  let fail = false;
  const host = new ResidentHost({
    directory,
    configuration: configuration(directory),
    policyId: "fixture.progressive",
    workOrderCards: () => {
      if (fail) throw new Error("the index command refused an order");
      return index;
    },
    now: () => 0,
  });
  t.after(() => host.close());
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  await host.start();
  const orders = () =>
    JSON.parse(read(directory)).workOrders as {
      status: string;
      reason?: string;
      items?: { order: string }[];
    };
  const helper = () => new ResidentStore(directory).transaction(() => {});
  await helper();
  assert.equal(orders().status, "available");
  // The owner's next reading fails: its own publication says so.
  fail = true;
  await host.tick();
  assert.equal(orders().status, "unavailable");
  assert.equal(orders().reason, "index-unreadable");
  // A helper has no source of its own and reads through the owner's
  // binding, which now carries the failure and no longer names the cards.
  await helper();
  assert.equal(orders().status, "unavailable");
  assert.equal(orders().reason, "index-unreadable");
  // The source reads again: owner and helper publish the cards.
  fail = false;
  await host.tick();
  assert.equal(orders().status, "available");
  await helper();
  assert.equal(orders().status, "available");
  assert.ok(orders().items!.length > 0);
});

test("WO-276 (rolling review 14, F1): when the owner cannot replace its copy of the cards, a helper over the same store reports them unreadable and never the cards copied before, while the owner publishes what it read; a later copy restores the helper's", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-status-copy-"));
  const later = index.replace("WO-158", "WO-159");
  assert.notEqual(later, index);
  let cards = index;
  const host = new ResidentHost({
    directory,
    configuration: configuration(directory),
    policyId: "fixture.progressive",
    workOrderCards: () => cards,
    now: () => 0,
  });
  t.after(() => host.close());
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  // The owner's store, with the write of its cards copy failing on demand as
  // a full or failing disk would fail it; every other write goes through.
  const store = host.store as unknown as {
    replaceProjection(target: string, bytes: string): void;
  };
  const replace = store.replaceProjection.bind(host.store);
  let failing = false;
  store.replaceProjection = (target, bytes) => {
    if (failing && target.endsWith(".runtime-status-cards.json"))
      throw new Error("ENOSPC: no space left on device");
    replace(target, bytes);
  };
  await host.start();
  const orders = () =>
    JSON.parse(read(directory)).workOrders as {
      status: string;
      reason?: string;
      items?: { order: string }[];
    };
  const named = () => orders().items?.map((row) => row.order);
  const helper = () => new ResidentStore(directory).transaction(() => {});
  await helper();
  assert.deepEqual(named(), ["WO-114", "WO-158"]);
  // The cards change and the copy cannot be replaced: the owner publishes
  // what it read.
  cards = later;
  failing = true;
  await host.tick();
  assert.deepEqual(named(), ["WO-114", "WO-159"]);
  // The helper reads through the binding, which carries the failure: it
  // reports the cards unreadable, never the copy the first read left.
  await helper();
  assert.equal(orders().status, "unavailable");
  assert.equal(orders().reason, "index-unreadable");
  // The copy is written again: owner and helper publish the same cards.
  failing = false;
  await host.tick();
  assert.deepEqual(named(), ["WO-114", "WO-159"]);
  await helper();
  assert.deepEqual(named(), ["WO-114", "WO-159"]);
  // With the copy already holding what the owner read, a failing write is
  // never attempted and the binding stays available.
  failing = true;
  await host.tick();
  await helper();
  assert.deepEqual(named(), ["WO-114", "WO-159"]);
});

test("the resident's own entry has no card source: in a valid launchpad its work orders are unavailable until the script-side launcher starts it", (t) => {
  const directory = createFixtureRoot(
    join(tmpdir(), "dotln-status-launchpad-"),
  );
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const orders = join(directory, "orders");
  mkdirSync(orders);
  writeFileSync(
    join(directory, "dotln.config.json"),
    JSON.stringify({ version: 1, roots: { workOrders: "orders" } }),
  );
  const store = join(directory, "resident");
  mkdirSync(store);
  writeFileSync(
    join(store, "resident.json"),
    JSON.stringify(configuration(store)),
  );
  const cli = spawnSync(
    process.execPath,
    [
      new URL("../src/dotln.js", import.meta.url).pathname,
      "resident",
      "--store",
      store,
      "--policy",
      "fixture.progressive",
      "--once",
    ],
    { env: { ...process.env, DOTLN_LAUNCHPAD: directory }, encoding: "utf8" },
  );
  assert.equal(cli.status, 0, cli.stderr);
  // This package reads no page and no Markdown: the cards come from the
  // launcher (scripts/resident.mjs), and without it nothing is bound.
  assert.deepEqual(JSON.parse(read(store)).workOrders, {
    status: "unavailable",
    items: [],
    reason: "binding-unavailable",
  });
});

test("WO-114 failed publication cannot abort start, presence or dispatch and the next tick rebuilds", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-status-failure-"));
  const indexPath = join(directory, "index.json");
  writeFileSync(indexPath, index);
  const target = join(directory, "runtime-status-v1.json");
  mkdirSync(target);
  let runs = 0;
  let at = 0;
  const host = new ResidentHost({
    directory,
    policyId: "fixture.progressive",
    configuration: configuration(directory),
    workOrderCards: () => readFileSync(indexPath, "utf8"),
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      script: {
        kind: "script",
        available: () => null,
        run: () => {
          runs++;
          return { completed: Promise.resolve(result), kill: () => {} };
        },
      },
    },
  });
  t.after(() => host.close());
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  await host.start();
  await recordPresenceObservation(
    directory,
    { kind: "away" },
    undefined,
    () => 0,
  );
  const events = () => decodeLog(host.store.read());
  assert.deepEqual(
    events()
      .slice(-2)
      .map((event) => event.type),
    ["OperatorPresenceObserved", "ClockSampled"],
  );
  at = 10;
  await host.tick();
  assert.equal(runs, 1);
  assert.ok(events().some((event) => event.type === "ScriptEpisodeObserved"));
  assert.ok(!events().some((event) => event.type === "ScriptEpisodeLost"));
  rmSync(target, { recursive: true });
  // An unreadable index only makes the order section unavailable.
  unlinkSync(indexPath);
  mkdirSync(indexPath);
  await host.tick();
  assert.equal(JSON.parse(read(directory)).workOrders.status, "unavailable");
  rmSync(indexPath, { recursive: true });
  writeFileSync(indexPath, index);
  await host.tick();
  assert.equal(JSON.parse(read(directory)).workOrders.status, "available");
  assert.ok(!readdirSync(directory).some((name) => name.endsWith(".tmp")));
  const latest = read(directory);
  host.close();
  const restarted = new ResidentHost({
    directory,
    configuration: configuration(directory),
    policyId: "fixture.progressive",
  });
  await restarted.start();
  assert.equal(read(directory), latest);
  restarted.close();
});

test("WO-117 bad launchpad sources remain live, replace old bindings and survive helpers", async (t) => {
  for (const reason of [
    "launchpad-unavailable",
    "configuration-invalid",
  ] as const) {
    const directory = createFixtureRoot(join(tmpdir(), "dotln-index-source-"));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    const store = join(directory, "store");
    mkdirSync(store);
    const oldIndex = join(directory, "old-index.md");
    writeFileSync(oldIndex, index);
    writeFileSync(
      join(store, ".runtime-status-source.json"),
      JSON.stringify({ version: 1, indexPath: oldIndex }),
    );
    writeFileSync(
      join(store, "resident.json"),
      JSON.stringify(configuration(store)),
    );
    const launchpad = join(directory, "launchpad");
    if (reason === "configuration-invalid") {
      mkdirSync(launchpad);
      writeFileSync(join(launchpad, "dotln.config.json"), "{");
    }
    const cli = spawnSync(
      process.execPath,
      [
        new URL("../src/dotln.js", import.meta.url).pathname,
        "resident",
        "--store",
        store,
        "--policy",
        "fixture.progressive",
        "--once",
      ],
      {
        env: { ...process.env, DOTLN_LAUNCHPAD: launchpad },
        encoding: "utf8",
        timeout: 5000,
      },
    );
    assert.equal(cli.status, 0, cli.stderr);
    assert.ok(
      decodeLog(readFileSync(join(store, "events.jsonl"), "utf8")).length > 0,
    );
    assert.deepEqual(JSON.parse(read(store)).workOrders, {
      status: "unavailable",
      items: [],
      reason,
    });
    await recordPresenceObservation(
      store,
      { kind: "away" },
      undefined,
      () => 50,
    );
    assert.deepEqual(JSON.parse(read(store)).workOrders, {
      status: "unavailable",
      items: [],
      reason,
    });
    assert.ok(!read(store).includes(directory));
    // A valid next lifetime replaces the failure and restores the selected index.
    const recovered = new ResidentStore(store, {}, () =>
      readFileSync(oldIndex, "utf8"),
    );
    await recovered.acquire();
    recovered.release();
    assert.equal(JSON.parse(read(store)).workOrders.status, "available");
  }
});

test("WO-184 criterion 10: a FIFO configuration or binding cannot block the resident CLI", (t) => {
  for (const source of ["configuration", "binding"]) {
    const directory = createFixtureRoot(join(tmpdir(), "dotln-index-fifo-"));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    mkdirSync(join(directory, "orders"));
    writeFileSync(
      join(directory, "dotln.config.json"),
      JSON.stringify({ version: 1, roots: { workOrders: "orders" } }),
    );
    const store = join(directory, "store");
    mkdirSync(store);
    writeFileSync(
      join(store, "resident.json"),
      JSON.stringify(configuration(store)),
    );
    const target =
      source === "configuration"
        ? join(directory, "dotln.config.json")
        : join(store, ".runtime-status-source.json");
    if (source === "configuration") rmSync(target);
    assert.equal(spawnSync("mkfifo", [target]).status, 0);
    const cli = spawnSync(
      process.execPath,
      [
        new URL("../src/dotln.js", import.meta.url).pathname,
        "resident",
        "--store",
        store,
        "--policy",
        "fixture.progressive",
        "--once",
      ],
      {
        env: { ...process.env, DOTLN_LAUNCHPAD: directory },
        encoding: "utf8",
        timeout: 5000,
      },
    );
    assert.equal(cli.status, 0, cli.stderr);
    assert.deepEqual(JSON.parse(read(store)).workOrders, {
      status: "unavailable",
      items: [],
      // The entry replaces a binding it cannot read with what it knows: it
      // was started without the launcher, so nothing is bound.
      reason:
        source === "configuration"
          ? "configuration-invalid"
          : "binding-unavailable",
    });
    assert.ok(
      decodeLog(readFileSync(join(store, "events.jsonl"), "utf8")).length > 0,
    );
  }
});

test("WO-117 only the lifetime owner sweeps status temporaries", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-status-sweep-"));
  const stale = join(directory, ".runtime-status-abandoned.tmp");
  const unrelated = join(directory, "keep.tmp");
  writeFileSync(stale, "stale");
  writeFileSync(unrelated, "keep");
  const owner = new ResidentStore(directory);
  await owner.acquire();
  t.after(() => {
    owner.release();
    rmSync(directory, { recursive: true, force: true });
  });
  assert.ok(!fs.existsSync(stale));
  assert.equal(readFileSync(unrelated, "utf8"), "keep");
  writeFileSync(stale, "new temporary");
  await new ResidentStore(directory).transaction(() => {});
  assert.ok(
    fs.existsSync(stale),
    "helper cannot sweep a live writer's temporary",
  );
  await assert.rejects(new ResidentStore(directory).acquire(), /live host/u);
  assert.ok(fs.existsSync(stale), "failed lifetime acquisition cannot sweep");
});

test("[document] WO-190 the repository's index page yields the active and queued orders; its history page holds every settled card", async () => {
  const { runtimeOrdersFromIndex } =
    await import("../src/runtime-status-contract.js");
  const readPage = (name: string) =>
    readFileSync(
      new URL(`../../../../docs/work-orders/${name}`, import.meta.url),
      "utf8",
    );
  const page = readPage("README.md");
  const history = readPage("HISTORY.md");
  // The cards are the index command's own output; no file records them.
  const repository = new URL("../../../../", import.meta.url).pathname;
  const cards = execFileSync(
    process.execPath,
    [join(repository, "scripts/work-orders.mjs"), "index", "--json"],
    { cwd: repository, encoding: "utf8", maxBuffer: 64_000_000 },
  );
  // An independent scan: the cards under the named level-two headings.
  const cardsUnder = (text: string, sections: readonly string[]) => {
    const cards: string[] = [];
    let current = "";
    for (const line of text.split("\n")) {
      const heading = line.match(/^## (.+)$/u);
      if (heading) current = heading[1]!;
      const card = line.match(/^### (WO-\d{3})$/u);
      if (card && sections.includes(current)) cards.push(card[1]!);
    }
    return cards;
  };
  // The resident reads the index page's cards from the index record.
  const projected = runtimeOrdersFromIndex(cards);
  assert.equal(projected.status, "available");
  assert.ok(projected.items.length > 0);
  assert.deepEqual(
    projected.items.map((item) => item.order),
    cardsUnder(page, ["Active", "Open"]),
  );
  for (const item of projected.items)
    assert.ok(
      !["closed", "withdrawn", "superseded", "historical"].includes(item.phase),
      `${item.order} is settled (${item.phase}) but on the index page`,
    );
  assert.ok(projected.items.some((item) => item.dependency !== "unknown"));
  const settled = cardsUnder(history, [
    "Closed",
    "Withdrawn",
    "Superseded",
    "Historical",
  ]);
  assert.ok(settled.length > 0);
  assert.equal(
    new Set([...projected.items.map((item) => item.order), ...settled]).size,
    projected.items.length + settled.length,
    "an order is on both pages",
  );
  assert.equal(
    settled.length,
    (history.match(/^### WO-\d{3}$/gmu) ?? []).length,
    "a history card sits outside the four settled sections",
  );
  // A page is not the index record.
  for (const text of [page, history])
    assert.throws(
      () => runtimeOrdersFromIndex(text),
      /invalid generated work-order index/u,
    );
});

test("resident expiry between steps shows one hold and terminal outcomes preserve the indexed phase", () => {
  const key = "intent_status";
  const command = verticalCommands(key).find((c) => c.step === "bundle")!;
  const events = [
    {
      eventId: "start",
      type: "IntentStepStarted",
      occurredAt: 1,
      payload: { key, commandId: command.commandId },
    },
    {
      eventId: "end",
      type: "IntentStepSettled",
      occurredAt: 2,
      payload: {
        key,
        commandId: command.commandId,
        result: "completed",
        terminal: false,
      },
    },
  ] as unknown as Event[];
  const state = {
    at: 9,
    intentStep: null,
    intents: {
      "WO-114": {
        kind: "admitted",
        binding: { key, authority: { expiresAt: 10 } },
      },
    },
  } as unknown as ResidentState;
  assert.equal(projectRuntimeStatus(state, events, index).actors.length, 1);
  state.at = 10;
  const expired = projectRuntimeStatus(state, events, index);
  assert.deepEqual(expired.actors, []);
  assert.deepEqual(expired.holds, [
    { kind: "dispatch", reason: "intent-needs-human", order: "WO-114" },
  ]);
  assert.equal(
    expired.workOrders.items.find((r) => r.order === "WO-114")!.phase,
    "active; intent-needs-human",
  );
  assert.deepEqual(
    projectRuntimeStatus(state, events, index),
    expired,
    "replay adds no duplicate hold",
  );
  const finished = structuredClone(events);
  (finished[1]!.payload as Record<string, unknown>).terminal = true;
  const resolved = projectRuntimeStatus(state, finished, index);
  assert.deepEqual(
    resolved.holds,
    [],
    "a completed intent is not expired again",
  );
  assert.equal(
    resolved.workOrders.items.find((r) => r.order === "WO-114")!.phase,
    "active; intent-resolved",
  );
  assert.deepEqual(
    projectRuntimeStatus(state, [], index).holds,
    expired.holds,
    "expiry before the first step also holds",
  );
});

test("WO-276 F5: the owner reads its work-order cards before it takes the store's append lock, so a helper's transaction completes while the owner's card source is slow, and the owner still publishes the cards", async (t) => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-status-slow-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const entered = join(directory, "cards-entered");
  // The owner runs in a process of its own: its card source leaves a mark
  // and then holds the process for three seconds, as the launcher's index
  // command holds it while it derives the cards.
  const owner = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { writeFileSync } from "node:fs";
      import { ResidentHost } from ${JSON.stringify(new URL("../src/resident-host.js", import.meta.url).href)};
      const [directory, entered, cards, configuration] = JSON.parse(process.argv[1]);
      const host = new ResidentHost({
        directory,
        policyId: configuration.policyId,
        configuration,
        now: () => 0,
        workOrderCards: () => {
          writeFileSync(entered, "");
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
          return cards;
        },
      });
      await host.start();
      host.close();`,
      JSON.stringify([directory, entered, index, configuration(directory)]),
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  let stderr = "";
  owner.stderr.on("data", (chunk) => (stderr += chunk));
  const exited = new Promise((done) => owner.on("exit", done));
  for (let waited = 0; !existsSync(entered); waited += 20) {
    assert.ok(waited < 30000, "the owner never read its cards");
    await delay(20);
  }
  // A helper's transaction while the owner is inside its card source: it
  // takes the append lock and appends, where it waited two seconds for a
  // lock the owner held and gave up.
  const started = Date.now();
  await recordPresenceObservation(directory, { kind: "away" });
  const waited = Date.now() - started;
  assert.ok(waited < 2500, `the helper waited ${waited} ms`);
  assert.equal(await exited, 0, stderr);
  const status = JSON.parse(read(directory)).workOrders as {
    status: string;
    items: { order: string }[];
  };
  assert.equal(status.status, "available");
  assert.deepEqual(
    status.items.map((row) => row.order),
    ["WO-114", "WO-158"],
  );
});

test("WO-276 F6: the host refuses an option it does not read, naming what replaced a removed one, so a caller left on another release's options fails at construction and never reads its work orders as unavailable", () => {
  const directory = join(tmpdir(), "dotln-host-options-never-made");
  assert.throws(
    () =>
      new ResidentHost({
        directory,
        policyId: "fixture.progressive",
        workOrderIndexPath: join(directory, "README.md"),
      } as never),
    /^Error: resident host option workOrderIndexPath was replaced by workOrderCards, a function that returns the work-order cards: scripts\/resident\.mjs hands the resident workOrderCardSource from scripts\/lib\/work-order-cards\.mjs$/u,
  );
  assert.throws(
    () =>
      new ResidentHost({
        directory,
        policyId: "fixture.progressive",
        workOrderCard: () => index,
      } as never),
    /^Error: unknown resident host option: workOrderCard$/u,
  );
  assert.equal(existsSync(directory), false);
});

test(
  "WO-276 (F70): a FIFO where an owner started by the launcher keeps its copy of the cards cannot block it, and the copy it writes replaces the FIFO",
  { timeout: 15000 },
  async (t) => {
    const directory = createFixtureRoot(join(tmpdir(), "dotln-cards-fifo-"));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    const copy = join(directory, ".runtime-status-cards.json");
    assert.equal(spawnSync("mkfifo", [copy]).status, 0);
    const host = new ResidentHost({
      directory,
      configuration: configuration(directory),
      policyId: "fixture.progressive",
      workOrderCards: () => index,
      now: () => 0,
    });
    await host.start();
    host.close();
    assert.equal(JSON.parse(read(directory)).workOrders.status, "available");
    assert.ok(fs.lstatSync(copy).isFile());
    assert.equal(readFileSync(copy, "utf8"), index);
  },
);
