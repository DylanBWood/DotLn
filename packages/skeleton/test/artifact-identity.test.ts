import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  canonicalStringify,
  compileLoadout,
  normalizeLoadoutGraph,
  seiriEnvironment,
  seiriLoadout,
  type ArtifactIdentityV1,
  type CompilationEnvironment,
  type LoadoutGraph,
} from "@dotln/compiler";
import {
  decodeLog,
  encodeLog,
  replay,
  type Decision,
  type Event,
  type EventDraft,
  type JsonValue,
} from "@dotln/kernel";
import {
  artifactIdentityInputs,
  artifactIdentityDrift,
  createLoadoutEquippedPayload,
  isArtifactIdentityV1,
  isArtifactRefusalPayload,
  isArtifactRefusalType,
  type LoadoutEquippedPayloadV2,
} from "../src/artifact-identity.js";
import { projectAuditEvents } from "../src/audit.js";
import {
  initialState,
  seiriPredicates,
  seiriReactor,
  type RuntimeState,
} from "../src/reactor.js";
import {
  LiveReactorDriver,
  runScenario,
  replayScenario,
  type FixtureTree,
} from "../src/scenario.js";
import { entropyReducerLoadout } from "../src/loadouts/entropy-reducer.js";

const read = (path: string) => readFile(new URL(path, import.meta.url), "utf8");
const fixture = JSON.parse(
  await read("../../fixtures/repo-tree.json"),
) as FixtureTree;
const legacyLog = await read("../../fixtures/wo029-legacy-scenario.jsonl");
const frozenOracle = await read("../../fixtures/wo003-decision-traces.json");
const json = (value: unknown): JsonValue => value as JsonValue;
const draft = (type: string, payload: unknown, at = 1_200_000): EventDraft => ({
  schemaVersion: 1,
  type,
  occurredAt: at,
  actorId: "repo-gardener",
  workstreamId: "ws_repo_garden",
  episodeId: "ep_seiri_1",
  payload: json(payload),
});
const event = (
  type: string,
  payload: unknown,
  eventId = "evt_probe",
): Event => ({ ...draft(type, payload), eventId });
const pin = (state: RuntimeState): ArtifactIdentityV1 => {
  assert.ok(isArtifactIdentityV1(state.artifactIdentity));
  return state.artifactIdentity;
};
const equipped = () => {
  const driver = new LiveReactorDriver();
  driver.equip(seiriLoadout);
  return driver;
};
const refusal = (decision: Decision<RuntimeState>, type: string) => {
  assert.deepEqual(decision.intents, []);
  assert.deepEqual(decision.schedules, []);
  assert.equal(decision.continuation?.kind, "Emit");
  if (decision.continuation?.kind !== "Emit")
    assert.fail("refusal event missing");
  assert.equal(decision.continuation.event.type, type);
  assert.ok(isArtifactRefusalPayload(decision.continuation.event.payload));
  assert.ok(decision.trace.branchPath.includes("refused"));
  return decision.continuation.event.payload;
};
const pulse = event("CadencePulse", { scheduleId: "schedule_seiri_20m" });

test("WO-029 new host equips v2, pins authority atomically, and receipts every compiled consumer with replay identity", () => {
  assert.equal(initialState().authority, null);
  const live = runScenario(fixture);
  const events = decodeLog(live.log);
  assert.equal(events[0]!.type, "ArtifactIdentityEnforcementStarted");
  const equipIndex = events.findIndex(
    (event) => event.type === "LoadoutEquipped",
  );
  const payload = events[equipIndex]!
    .payload as unknown as LoadoutEquippedPayloadV2;
  assert.equal(events[equipIndex]!.schemaVersion, 1);
  assert.equal(payload.payloadVersion, 2);
  assert.deepEqual(payload.graph, seiriLoadout);
  const compiled = compileLoadout(seiriLoadout, seiriEnvironment());
  assert.ok(compiled.ok);
  assert.deepEqual(payload.artifactIdentity, compiled.artifactIdentity);
  assert.deepEqual(
    live.decisions[equipIndex]!.state.authority,
    compiled.program.authorityEnvelope,
  );
  const consumers = new Set([
    "LoadoutEquipped",
    "OperatorPresenceChanged",
    "CadencePulse",
    "WorkOrderEmitted",
    "CommandResult",
    "DeletionAttempted",
    "CommandRefused",
    "EpisodeTerminated",
    "VerificationRequested",
  ]);
  let checked = 0;
  events.forEach((source, index) => {
    if (!consumers.has(source.type)) return;
    const trace = live.decisions[index]!.trace;
    const inputs = artifactIdentityInputs(
      payload.artifactIdentity,
      events[equipIndex]!.eventId,
    );
    assert.deepEqual(trace.envInputs.slice(-4), inputs, source.type);
    const recorded = events.filter(
      (candidate) =>
        candidate.type === "DecisionRecorded" &&
        candidate.causationId === source.eventId,
    );
    assert.equal(recorded.length, 1, source.type);
    assert.deepEqual(recorded[0]!.payload, { trace });
    checked += 1;
  });
  assert.equal(checked, 11);
  assert.equal(live.adapterEffects, 1);
  assert.deepEqual(replayScenario(live.log).decisions, live.decisions);
  assert.deepEqual(
    projectAuditEvents(decodeLog(replayScenario(live.log).log)),
    projectAuditEvents(events),
  );
});

test("WO-029 stale graph/pin equip is durably refused; replay of a refused log does not throw or invent a WorkOrder", () => {
  const generated = createLoadoutEquippedPayload(
    seiriLoadout,
    seiriEnvironment(),
  );
  assert.ok(generated.ok);
  const stale = {
    ...generated.payload,
    graph: {
      ...seiriLoadout,
      activeMechanics: seiriLoadout.activeMechanics.map((active) => ({
        ...active,
        semantics: [...active.semantics, "changed after compilation"],
      })),
    },
  };
  const driver = new LiveReactorDriver();
  const step = driver.feed(draft("LoadoutEquipped", stale));
  assert.deepEqual(refusal(step.decision, "ArtifactIdentityDrift").drift, [
    "semantic-hash",
    "component-definitions",
  ]);
  assert.equal(driver.state.artifactIdentity, null);
  assert.equal(driver.state.authority, null);
  refusal(
    driver.feed(draft(pulse.type, pulse.payload)).decision,
    "ArtifactIdentityUnavailable",
  );
  const replayed = replayScenario(driver.log);
  assert.equal(replayed.workOrder, null);
  assert.deepEqual(replayed.decisions, driver.decisions);
  assert.equal(
    decodeLog(driver.log).filter((event) => isArtifactRefusalType(event.type))
      .length,
    2,
  );
});

test("WO-029 every stored compiled consumer uses the same fail-closed comparison for each drift axis", async (t) => {
  const driver = equipped();
  const original = driver.state;
  const identity = pin(original);
  const cases = [
    [
      "compiler-contract-version",
      { ...identity, compilerContractVersion: "future-contract" },
    ],
    [
      "compiler-package-version",
      { ...identity, compilerPackageVersion: "0.0.0" },
    ],
    [
      "semantic-hash",
      { ...identity, semanticHash: "fnv1a64:0000000000000000" },
    ],
    [
      "component-definitions",
      {
        ...identity,
        componentDefinitions: identity.componentDefinitions.map(
          (entry, index) =>
            index === 0
              ? { ...entry, definitionHash: "fnv1a64:0000000000000000" }
              : entry,
        ),
      },
    ],
    [
      "compilation-environment",
      {
        ...identity,
        compilationEnvironment: {
          ...identity.compilationEnvironment,
          repo: "/old/repo",
        },
      },
    ],
    [
      "authority-expiry",
      { ...identity, authorityExpiresAt: identity.authorityExpiresAt + 1 },
    ],
  ] as const;
  const consumers = [
    event("OperatorPresenceChanged", { presence: "away" }),
    event("OperatorPresenceChanged", { presence: "returned" }),
    pulse,
    event("WorkOrderEmitted", {}),
    event("CommandResult", {}),
    event("DeletionAttempted", {}),
    event("CommandRefused", {}),
    event("EpisodeTerminated", {}),
    event("VerificationRequested", {}),
    event("CommandRedispatchRequested", {}),
  ];
  for (const [axis, altered] of cases)
    await t.test(axis, () => {
      const state = { ...original, artifactIdentity: json(altered) };
      for (const source of consumers) {
        const result = replay(state, [source], seiriReactor, seiriPredicates);
        const payload = refusal(result.decisions[0]!, "ArtifactIdentityDrift");
        assert.deepEqual(payload.drift, [axis]);
        assert.equal(payload.sourceEventId, source.eventId);
        assert.deepEqual(payload.pinnedIdentity, altered);
        assert.deepEqual(payload.observedIdentity, identity);
        assert.equal(result.state.authority, null);
        assert.deepEqual(
          replay(state, [source], seiriReactor, seiriPredicates),
          result,
        );
      }
    });
});

test("WO-029 diagnostics, malformed v2 payloads and pre-equip consumers are typed inert refusals", () => {
  const state = equipped().state;
  const graphs: unknown[] = [
    { ...seiriLoadout, activeMechanics: [] },
    {
      ...seiriLoadout,
      activeMechanics: seiriLoadout.activeMechanics.map((active) => ({
        ...active,
        requiredCapabilities: ["missing-capability"],
      })),
    },
    { malformed: true },
  ];
  for (const graph of graphs) {
    const changed = { ...state, loadout: json(graph) };
    const result = replay(changed, [pulse], seiriReactor, seiriPredicates);
    assert.ok(
      refusal(result.decisions[0]!, "ArtifactCompilationRefused").diagnostics
        .length > 0,
    );
    assert.equal(result.state.authority, null);
  }
  for (const payloadVersion of [null, 0, 1, 3, "2"]) {
    const source = event("LoadoutEquipped", {
      payloadVersion,
      graph: seiriLoadout,
      artifactIdentity: pin(state),
    });
    refusal(
      replay(initialState(), [source], seiriReactor, seiriPredicates)
        .decisions[0]!,
      "ArtifactIdentityInvalid",
    );
  }
  const identity = pin(state);
  const malformedIdentities = [
    { ...identity, schemaVersion: 2 },
    { ...identity, unknownField: true },
    {
      ...identity,
      componentDefinitions: [
        ...identity.componentDefinitions,
        identity.componentDefinitions[0],
      ],
    },
    {
      ...identity,
      componentDefinitions: identity.componentDefinitions.map((entry) => ({
        ...entry,
        componentKind: [entry.componentKind],
      })),
    },
  ];
  for (const malformed of malformedIdentities) {
    assert.equal(isArtifactIdentityV1(malformed), false);
    const driver = new LiveReactorDriver();
    refusal(
      driver.feed(
        draft("LoadoutEquipped", {
          payloadVersion: 2,
          graph: seiriLoadout,
          artifactIdentity: malformed,
        }),
      ).decision,
      "ArtifactIdentityInvalid",
    );
    assert.equal(driver.state.authority, null);
    assert.deepEqual(replayScenario(driver.log).decisions, driver.decisions);
    const stored = replay(
      { ...state, artifactIdentity: json(malformed) },
      [pulse],
      seiriReactor,
      seiriPredicates,
    );
    refusal(stored.decisions[0]!, "ArtifactIdentityInvalid");
    assert.equal(stored.state.authority, null);
  }
  const missingOrigin = replay(
    { ...state, equippedEventId: null },
    [pulse],
    seiriReactor,
    seiriPredicates,
  );
  const missingOriginRefusal = refusal(
    missingOrigin.decisions[0]!,
    "ArtifactIdentityInvalid",
  );
  assert.equal(missingOriginRefusal.equippedEventId, null);
  assert.equal(missingOrigin.state.authority, null);
  const driver = new LiveReactorDriver();
  refusal(
    driver.feed(draft(pulse.type, pulse.payload)).decision,
    "ArtifactIdentityUnavailable",
  );
  assert.equal(driver.state.authority, null);
  const diagnosticHost = new LiveReactorDriver();
  diagnosticHost.equip({ ...seiriLoadout, activeMechanics: [] });
  const events = decodeLog(diagnosticHost.log);
  assert.equal(events[1]!.type, "ArtifactCompilationRefused");
  assert.equal(events[2]!.type, "DecisionRecorded");
  assert.equal(diagnosticHost.state.authority, null);
  assert.deepEqual(
    replayScenario(diagnosticHost.log).decisions,
    diagnosticHost.decisions,
  );
});

test("WO-029 historical replay keeps the frozen WO-003 trace oracle; the logged boundary prevents forward legacy consumption", () => {
  assert.equal(
    createHash("sha256").update(frozenOracle).digest("hex"),
    "ec53d1c841de5486cf656694228c83f67e8549993d0ac63c187d10728707a173",
  );
  const historical = replayScenario(legacyLog);
  assert.deepEqual(
    historical.decisions.map((decision) => decision.trace),
    JSON.parse(frozenOracle),
  );
  assert.equal(historical.verified, true);
  assert.ok(
    historical.decisions.every(
      (decision) => decision.state.artifactIdentity === null,
    ),
  );
  assert.equal(
    projectAuditEvents(decodeLog(legacyLog)).receipt.artifactIdentity
      .records[0]!.status,
    "unavailable",
  );
  const driver = new LiveReactorDriver();
  driver.restore(legacyLog);
  const before = driver.log;
  driver.ensureIdentityEnforcement(2_000_000);
  driver.ensureIdentityEnforcement(2_000_000);
  assert.ok(driver.log.startsWith(before));
  assert.equal(driver.state.authority, null);
  refusal(
    driver.feed(draft(pulse.type, pulse.payload, 2_000_000)).decision,
    "ArtifactIdentityUnavailable",
  );
  const oldState = driver.state;
  const duplicate = event("ArtifactIdentityEnforcementStarted", {
    payloadVersion: 1,
  });
  assert.deepEqual(
    replay(oldState, [duplicate], seiriReactor, seiriPredicates).state,
    oldState,
  );
  const rawEquip = event("LoadoutEquipped", seiriLoadout);
  refusal(
    replay(driver.state, [rawEquip], seiriReactor, seiriPredicates)
      .decisions[0]!,
    "ArtifactIdentityUnavailable",
  );
  driver.equip(seiriLoadout, seiriEnvironment(), 2_000_001);
  const allowed = driver.feed(
    draft("OperatorPresenceChanged", { presence: "away" }, 2_000_002),
  );
  assert.equal(allowed.decision.schedules.length, 2);
  assert.equal(
    decodeLog(driver.log).filter(
      (event) => event.type === "ArtifactIdentityEnforcementStarted",
    ).length,
    1,
  );
  assert.deepEqual(replayScenario(driver.log).decisions, driver.decisions);
});

test("WO-029 host factory cannot mint or accept legacy events, and snapshots the caller's graph", () => {
  const driver = new LiveReactorDriver();
  assert.throws(
    () => driver.feed(draft("LoadoutEquipped", seiriLoadout)),
    /requires payloadVersion: 2/u,
  );
  assert.equal(driver.log, "");
  const source = structuredClone(seiriLoadout);
  const result = createLoadoutEquippedPayload(source, seiriEnvironment());
  assert.ok(result.ok);
  (source.supportFacets as unknown as { name: string }[])[0]!.name =
    "changed by caller";
  assert.notDeepEqual(result.payload.graph, source);
  assert.deepEqual(result.payload.graph, seiriLoadout);
  const invalid = createLoadoutEquippedPayload(
    draft("LoadoutEquipped", seiriLoadout) as unknown as LoadoutGraph,
    seiriEnvironment(),
  );
  assert.equal(invalid.ok, false);
  driver.equip(seiriLoadout);
  const log = driver.log;
  driver.restore(log);
  driver.ensureIdentityEnforcement(10);
  assert.equal(driver.log, log);
});

test("WO-029 recovery checks the pin before redispatch; restoring legacy or drifted history never reaches an adapter", () => {
  for (const mode of ["legacy", "drift"] as const) {
    const result = runScenario(fixture, {
      crashAfterPersist: true,
      recoveryLogTransform: (log) =>
        mode === "legacy"
          ? encodeLog(decodeLog(legacyLog).slice(0, 8))
          : encodeLog(
              decodeLog(log).map((source) =>
                source.type !== "LoadoutEquipped"
                  ? source
                  : {
                      ...source,
                      payload: json({
                        ...(source.payload as object),
                        artifactIdentity: {
                          ...(
                            source.payload as unknown as LoadoutEquippedPayloadV2
                          ).artifactIdentity,
                          compilerPackageVersion: "old-compiler",
                        },
                      }),
                    },
              ),
            ),
    });
    assert.equal(result.adapterEffects, 0, mode);
    assert.deepEqual(result.adapterDispatches, []);
    const events = decodeLog(result.log);
    assert.equal(
      events.filter(
        (source) => source.type === "ArtifactIdentityEnforcementStarted",
      ).length,
      1,
    );
    assert.equal(events.at(-1)!.type, "ArtifactIdentityUnavailable");
    assert.ok(!events.some((source) => source.type === "CommandRedispatched"));
    const ordinals = new Map(
      events.map((source, index) => [source.eventId, index]),
    );
    events.forEach((source, index) => {
      if (source.causationId !== undefined)
        assert.ok(
          (ordinals.get(source.causationId) ?? Infinity) < index,
          "recovery references the restored log's earlier canonical cause",
        );
    });
    assert.deepEqual(replayScenario(result.log).decisions, result.decisions);
  }
  const complete = runScenario(fixture, {
    crashAfterPersist: true,
    recoveryLogTransform: () => legacyLog,
  });
  assert.equal(
    complete.adapterEffects,
    0,
    "a completed restored outbox never dispatches a stale in-memory command",
  );
  assert.deepEqual(complete.recoveredCommands, []);
});

test("WO-029 unknown schedule ids have durable inert evidence; reused ids from an earlier equip remain unstamped", () => {
  const driver = equipped();
  const unknown = driver.feed(
    draft("CadencePulse", { scheduleId: "retired.schedule" }),
  );
  refusal(unknown.decision, "UnknownScheduleRefused");
  assert.equal(decodeLog(driver.log).at(-1)!.type, "UnknownScheduleRefused");
  assert.ok(driver.state.authority !== null);
  const oldPulse = draft(pulse.type, pulse.payload);
  driver.equip(seiriLoadout, seiriEnvironment("new-base"));
  const reused = driver.feed(oldPulse);
  assert.equal(reused.decision.continuation?.kind, "Emit");
  if (reused.decision.continuation?.kind === "Emit")
    assert.equal(
      reused.decision.continuation.event.type,
      "WorkOrderEmitted",
      "a pulse lacks an issuance artifact stamp: reuse cannot be detected by id alone",
    );
});

test("WO-029 Seiri and Entropy Reducer pins retain exact environment inputs, require re-equip on relocation, and do not authenticate rewritten pairs", async () => {
  const entropyFixture = JSON.parse(
    await read("../../../compiler/fixtures/wo029-entropy-reducer.json"),
  );
  assert.deepEqual(
    normalizeLoadoutGraph(entropyReducerLoadout(11_000)),
    normalizeLoadoutGraph(entropyFixture),
  );
  for (const graph of [seiriLoadout, entropyReducerLoadout(11_000)]) {
    const environment: CompilationEnvironment =
      graph === seiriLoadout
        ? seiriEnvironment()
        : {
            environmentId: "entropy-reducer.manual-review",
            version: 1,
            capabilities: [],
            repo: "/fixture/repository",
            baseCommit: "fixture-base",
          };
    const driver = new LiveReactorDriver();
    driver.equip(graph, environment);
    const original = pin(driver.state);
    const moved = { ...environment, repo: "/relocated/repository" };
    const relocated = createLoadoutEquippedPayload(graph, moved);
    assert.ok(relocated.ok);
    assert.deepEqual(
      artifactIdentityDrift(original, relocated.payload.artifactIdentity),
      ["semantic-hash", "compilation-environment"],
    );
    const stale = { ...driver.state, compilationEnvironment: json(moved) };
    refusal(
      replay(stale, [pulse], seiriReactor, seiriPredicates).decisions[0]!,
      "ArtifactIdentityDrift",
    );
    driver.equip(graph, moved);
    assert.deepEqual(pin(driver.state), relocated.payload.artifactIdentity);
    const rewritten = {
      ...graph,
      activeMechanics: graph.activeMechanics.map((active) => ({
        ...active,
        semantics: [
          ...active.semantics,
          "author rewrites source and pin together",
        ],
      })),
    };
    driver.equip(rewritten, moved);
    assert.equal(
      driver.state.artifactIdentityBlocked,
      false,
      "equality cannot authenticate a writer who replaces both sides",
    );
    assert.notEqual(pin(driver.state).semanticHash, original.semanticHash);
    assert.deepEqual(replayScenario(driver.log).decisions, driver.decisions);
  }
});

test("WO-029 L0 and governed raw expose canonical comparison/refusal references while cryptographic and outer-confinement claims stay absent", () => {
  const driver = equipped();
  driver.feed(draft("CadencePulse", { scheduleId: "unknown" }));
  const valid = createLoadoutEquippedPayload(seiriLoadout, seiriEnvironment());
  assert.ok(valid.ok);
  driver.feed(
    draft("LoadoutEquipped", {
      ...valid.payload,
      artifactIdentity: {
        ...valid.payload.artifactIdentity,
        compilerPackageVersion: "0.0.0",
      },
    }),
  );
  driver.equip({ ...seiriLoadout, activeMechanics: [] });
  const events = decodeLog(driver.log);
  const audit = projectAuditEvents(events);
  assert.deepEqual(audit.governedRaw.events, events);
  assert.deepEqual(
    audit.receipt.artifactIdentity,
    audit.governedRaw.artifactIdentity,
  );
  const records = audit.receipt.artifactIdentity.records;
  assert.equal(records[0]!.status, "matched");
  assert.equal(
    records[0]!.identity?.semanticHash,
    valid.payload.artifactIdentity.semanticHash,
  );
  const ids = new Set(events.map((event) => `event:${event.eventId}`));
  assert.ok(
    records.every(
      (record) =>
        record.evidenceLinks.length > 0 &&
        record.evidenceLinks.every((id) => ids.has(id)),
    ),
  );
  assert.deepEqual(
    records
      .filter((record) => record.status === "refused")
      .map((record) => record.eventType),
    [
      "UnknownScheduleRefused",
      "ArtifactIdentityDrift",
      "ArtifactCompilationRefused",
    ],
  );
  assert.ok(
    records
      .find((record) => record.eventType === "ArtifactCompilationRefused")!
      .diagnosticCodes.includes("SEMANTICS UNSUPPORTED"),
  );
  assert.match(
    canonicalStringify(audit.governedRaw.completeness),
    /cryptographic integrity hashes, authenticity/u,
  );
  assert.match(
    canonicalStringify(audit.receipt.artifactIdentity.limitations),
    /outer confinement evidence is separate/u,
  );
  assert.deepEqual(projectAuditEvents(decodeLog(encodeLog(events))), audit);
});
