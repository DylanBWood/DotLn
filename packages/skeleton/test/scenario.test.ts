import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  authorize,
  decodeLog,
  encodeLog,
  pendingCommands,
  replay,
  replayOutbox,
  defaultEnvironmentProjection,
  type PredicateRegistry,
  type DecisionTrace,
  type ActIntent,
  type Event,
  type JsonValue,
  type WorkOrder,
} from "@dotln/kernel";
import { withLinkedSupports } from "@dotln/compiler";
import { currentEvidence } from "../src/evidence-editions.mjs";
import { feedbackEditionLog } from "../src/feedback-edition-log.js";
import {
  compileLoadoutProgram,
  compileWorkOrder,
  expectedInspectCommandId,
  loadout,
  replayScenario as replayScenarioUnchecked,
  runScenario as runScenarioUnchecked,
  type FixtureTree,
  type Loadout,
  type ScenarioResult,
} from "../src/scenario.js";

import {
  initialState,
  initialVerificationRuntime,
  projectRuntimeEnvironment,
  seiriPredicates,
  seiriReactor,
  type RuntimeState,
} from "../src/reactor.js";

const assertProjectionIdentity = (
  log: string,
  initial: RuntimeState = initialState(),
  registry: PredicateRegistry = seiriPredicates,
) => {
  const events = decodeLog(log);
  const fallback = replay(initial, events, seiriReactor, registry);
  for (const projector of [
    projectRuntimeEnvironment,
    defaultEnvironmentProjection,
  ]) {
    const explicit = replay(initial, events, seiriReactor, registry, projector);
    assert.deepEqual(explicit, fallback);
    // The same bytes, one decision at a time: a stored live stream with a few
    // hundred heartbeats serializes past the engine's string limit as one array.
    assert.equal(explicit.decisions.length, fallback.decisions.length);
    explicit.decisions.forEach((decision, index) =>
      assert.equal(
        JSON.stringify(decision),
        JSON.stringify(fallback.decisions[index]),
        `decision ${index}`,
      ),
    );
  }
  return fallback;
};
const runScenario: typeof runScenarioUnchecked = (...args) => {
  const result = runScenarioUnchecked(...args);
  assert.deepEqual(
    assertProjectionIdentity(result.log).decisions,
    result.decisions,
  );
  return result;
};
const replayScenario: typeof replayScenarioUnchecked = (log) => {
  const result = replayScenarioUnchecked(log);
  assert.deepEqual(assertProjectionIdentity(log).decisions, result.decisions);
  return result;
};

const fixture = JSON.parse(
  await readFile(
    fileURLToPath(new URL("../../fixtures/repo-tree.json", import.meta.url)),
    "utf8",
  ),
) as FixtureTree;
const wo003DecisionTraces = JSON.parse(
  await readFile(
    fileURLToPath(
      new URL("../../fixtures/wo003-decision-traces.json", import.meta.url),
    ),
    "utf8",
  ),
) as readonly DecisionTrace[];
const legacyEvents = decodeLog(
  await readFile(
    new URL("../../fixtures/wo029-legacy-scenario.jsonl", import.meta.url),
    "utf8",
  ),
);

const semanticProjection = (result: ScenarioResult) => ({
  decisions: result.decisions,
  timeline: result.timeline,
  glyphScene: result.glyphScene,
  workOrder: result.workOrder,
  candidates: result.candidates,
  verified: result.verified,
  cancelledScheduleIds: result.cancelledScheduleIds,
  activeScheduleIds: result.activeScheduleIds,
});

const assertScenarioIdentity = (
  expected: ScenarioResult,
  actual: ScenarioResult,
): void =>
  assert.deepEqual(semanticProjection(actual), semanticProjection(expected));

const replacePayload = (
  log: string,
  eventType: string,
  transform: (payload: JsonValue) => JsonValue,
): { readonly log: string; readonly eventIndex: number } => {
  let eventIndex = -1;
  const events = decodeLog(log).map((event, index) => {
    if (eventIndex !== -1 || event.type !== eventType) return event;
    eventIndex = index;
    return { ...event, payload: transform(event.payload) } as Event;
  });
  if (eventIndex === -1) throw new Error(`fixture lacks ${eventType}`);
  return { log: encodeLog(events), eventIndex };
};

test("WO-016 AC1 one typed reactor and its pure helpers own kernel decisions", async () => {
  const sourceDirectory = fileURLToPath(new URL("../../src/", import.meta.url));
  const sourceFiles = (await readdir(sourceDirectory))
    .filter((file) => file.endsWith(".ts"))
    .sort();
  const sources = new Map(
    await Promise.all(
      sourceFiles.map(
        async (file) =>
          [
            file,
            await readFile(
              fileURLToPath(new URL(`../../src/${file}`, import.meta.url)),
              "utf8",
            ),
          ] as const,
      ),
    ),
  );
  const reactor = sources.get("reactor.ts") ?? "";
  assert.match(reactor, /export const seiriReactor: Reactor<RuntimeState> =/u);
  assert.deepEqual(
    [...reactor.matchAll(/from\s+"([^"]+)"/gu)].map((match) => match[1]),
    [
      "./repair.js",
      "./source-change-state.js",
      "./resident-state.js",
      "./source-change-state.js",
      "./source-change-state.js",
      "@dotln/kernel",
      "@dotln/compiler",
      "./artifact-identity.js",
      "./control-codebook.mjs",
      "./beacon-perception.js",
      "./execution-environment.js",
      "./control-beacon.js",
      "./verification-protocol.js",
    ],
    "the reactor imports only the kernel, pure compiler, identity checks, pure Beacon projections, pure verification contracts and pure resident/source-change folds",
  );
  assert.deepEqual(
    [
      ...(sources.get("source-change-state.ts") ?? "").matchAll(
        /from\s+"([^"]+)"/gu,
      ),
    ].map((match) => match[1]),
    ["@dotln/compiler", "@dotln/kernel"],
    "the source-change fold has no host dependency",
  );
  for (const pure of [
    "beacon-perception.ts",
    "execution-environment.ts",
    "verification-protocol.ts",
    "verification.ts",
    "resident-state.ts",
    "source-change-state.ts",
    "repair.ts",
    "presence-machine.ts",
    "actor-contract.ts",
    "work-candidate.ts",
  ])
    assert.doesNotMatch(
      sources.get(pure) ?? "",
      /from\s+"node:/u,
      `${pure} must keep filesystem and key access at the edge`,
    );
  for (const decider of [
    "evaluateCadence",
    "authorize",
    "decideProgram",
    "guardQueuedPulse",
  ]) {
    assert.match(reactor, new RegExp(`\\b${decider}\\(`, "u"));
    for (const [file, source] of sources)
      if (
        file !== "reactor.ts" &&
        !(decider === "evaluateCadence" && file === "presence-machine.ts") &&
        !(decider === "authorize" && file === "resident-state.ts")
      )
        assert.doesNotMatch(
          source,
          new RegExp(`\\b${decider}\\(`, "u"),
          `${decider} leaked into ${file}`,
        );
  }

  const scenario = sources.get("scenario.ts") ?? "";
  const replayBody = scenario.slice(
    scenario.indexOf("export function replayScenario"),
    scenario.indexOf("export function startScenario"),
  );
  assert.match(replayBody, /replay\(/u);
  assert.doesNotMatch(replayBody, /fixture|\.find\(|switch\s*\(|for\s*\(/u);
  // Raised 748 -> 751 at the operator's direction during WO-047 final review.
  // WO-050 and WO-047 each bought headroom by deleting the same blank
  // separators in the LiveReactorDriver getters, so the two savings did not
  // compose: main banked them and WO-047's four projector arguments landed on
  // a file with none left. The bound is again at zero headroom; WO-047-D007
  // records that this defers, and does not answer, whether scenario.ts should
  // be split instead of ratcheted.
  assert.ok(
    scenario.split("\n").length - 1 < 751,
    "scenario.ts must remain smaller than the main baseline",
  );
});

test("WO-016 AC3 live and replay match every complete Decision and semantic projection", () => {
  const live = runScenario(fixture);
  const replayed = replayScenario(live.log);
  const eventCount = decodeLog(live.log).length;
  assert.equal(live.decisions.length, eventCount);
  assert.equal(replayed.decisions.length, eventCount);
  assertScenarioIdentity(live, replayed);

  assert.deepEqual(live.workOrder, compileWorkOrder(loadout));
  assert.ok(live.workOrder);
  assert.equal(live.workOrder.workOrderId, "wo_repo_inspection_1");
  assert.deepEqual(Object.keys(live.workOrder).sort(), [
    "acceptanceCriteria",
    "allowedOperations",
    "baseCommit",
    "constraints",
    "decisions",
    "knownFacts",
    "nonGoals",
    "objective",
    "outputContract",
    "prohibitedOperations",
    "repo",
    "requiredEvidence",
    "workOrderId",
  ]);
  assert.deepEqual(live.candidates, [
    {
      path: "tmp/old-report.txt",
      classification: "generated-stale",
      evidence: [
        "inventory:tmp/old-report.txt",
        "classification:generated-stale",
        "references:none",
      ],
    },
  ]);
  assert.equal(live.verified, true);
  assert.match(
    live.glyphScene,
    /🐛.*dormant.*inverted\/refused.*verified.*phase:returned.*faded\/cancelled/u,
  );

  const events = decodeLog(live.log);
  const recordedDecisionSources = [
    2, 4, 6, 8, 11, 13, 15, 17, 19, 22, 24,
  ] as const;
  const recordedEvents = events.filter(
    (event) => event.type === "DecisionRecorded",
  );
  assert.equal(recordedEvents.length, recordedDecisionSources.length);
  recordedEvents.forEach((event, index) =>
    assert.deepEqual(
      (event.payload as { readonly trace?: unknown }).trace,
      live.decisions[recordedDecisionSources[index]!]!.trace,
    ),
  );

  assert.deepEqual(
    {
      ...live.decisions[8]?.trace,
      envInputs: live.decisions[8]?.trace.envInputs.filter(
        (input) => !input.startsWith("artifactIdentity."),
      ),
    },
    {
      reactorId: "authority-guard",
      reactorVersion: "1",
      branchPath: ["authorized", "repo.inspect"],
      envInputs: [
        "now:1200000",
        "authorityEnvelope:auth_seiri",
        "evidence",
        "revocations",
        "state",
        "rngState:17",
        "predicates",
        "policy",
        "resource:inspections",
      ],
      cadenceEvaluations: [],
    },
  );
  assert.deepEqual(live.decisions[22]?.trace.branchPath, [
    "refused",
    "authority revoked",
  ]);
});

test("WO-008 AC6 the running scenario consumes the compiled Seiri loadout", () => {
  const compiled = compileLoadoutProgram(loadout);
  assert.deepEqual(compileWorkOrder(loadout), compiled.workOrder);
  assert.deepEqual(compiled.authorityEnvelope.deniedEffects, [
    "repo.delete",
    "repo.write",
  ]);
  assert.equal(compiled.cadences[0]?.scheduleId, "schedule_seiri_20m");
  assert.equal(compiled.verificationPlan[0]?.subject, "candidates");
  assert.deepEqual(
    compiled.componentManifest
      .filter((entry) => entry.componentKind === "support-facet")
      .map((entry) => entry.componentId),
    [
      "seiri.absence-cadence",
      "seiri.evidence-capture",
      "seiri.independent-verification",
      "seiri.read-only",
      "seiri.repo-scope",
    ],
  );
});

test("WO-029 the new trace delta adds only the boundary, receipts and pin inputs to the frozen WO-003 mechanics", () => {
  const result = runScenario(fixture);
  const events = decodeLog(result.log);
  assert.deepEqual(
    result.decisions
      .filter(
        (_, index) =>
          !["ArtifactIdentityEnforcementStarted", "DecisionRecorded"].includes(
            events[index]!.type,
          ),
      )
      .map((decision) => ({
        ...decision.trace,
        envInputs: decision.trace.envInputs.filter(
          (input) => !input.startsWith("artifactIdentity."),
        ),
      })),
    wo003DecisionTraces.filter(
      (_, index) => legacyEvents[index]!.type !== "DecisionRecorded",
    ),
  );
  for (const [index, source] of events.entries())
    if (source.type === "DecisionRecorded")
      assert.deepEqual(result.decisions[index]!.trace, wo003DecisionTraces[3]);
});

test("WO-008 AC2 an unequipped support changes the live reactor program", () => {
  const withoutScope = withLinkedSupports(
    loadout,
    loadout.supportFacets
      .map((support) => support.supportFacetId)
      .filter((supportId) => supportId !== "seiri.repo-scope"),
  );
  const equipped = runScenario(fixture);
  const unequipped = runScenario(fixture, { equippedLoadout: withoutScope });
  assert.notDeepEqual(unequipped.decisions, equipped.decisions);
  assert.ok(equipped.workOrder);
  assert.ok(unequipped.workOrder);
  assert.deepEqual(unequipped.workOrder.constraints, [
    "Do not mutate repository contents",
  ]);
  assert.deepEqual(equipped.workOrder.constraints, [
    "Inspect only the fixture tree",
    "Do not mutate repository contents",
  ]);
});

test("WO-008 AC2 the running reactor consumes compiled cadence identifiers", () => {
  const changedIds = {
    ...loadout,
    supportFacets: loadout.supportFacets.map((support) =>
      support.supportFacetId !== "seiri.absence-cadence"
        ? support
        : {
            ...support,
            emissions: support.emissions.map((emission) =>
              emission.kind !== "cadence"
                ? emission
                : {
                    ...emission,
                    scheduleId: "changed.primary",
                    queuedScheduleId: "changed.queued",
                  },
            ),
          },
    ),
  };
  const result = runScenario(fixture, { equippedLoadout: changedIds });
  const cadencePulses = decodeLog(result.log)
    .filter((event) => event.type === "CadencePulse")
    .map((event) => (event.payload as { scheduleId: string }).scheduleId);
  assert.deepEqual(cadencePulses, ["changed.primary", "changed.queued"]);
  assert.equal(result.verified, true);
});

test("WO-008 AC3 the precedence winner authorizes the emitted runtime effect", () => {
  const contestedAuthority: Loadout = {
    ...loadout,
    activeMechanics: loadout.activeMechanics.map((active) => ({
      ...active,
      authorityEnvelope: {
        ...active.authorityEnvelope,
        allowedEffects: [
          ...active.authorityEnvelope.allowedEffects,
          "repo.delete",
        ],
        revocationConditions: [],
      },
      // WO-042 permits restoration only inside the active's original authority.
      workOrder: {
        ...active.workOrder,
        allowedOperations: [
          ...active.workOrder.allowedOperations,
          "repo.delete",
        ],
      },
    })),
    supportFacets: loadout.supportFacets.map((support) => {
      if (support.supportFacetId === "seiri.repo-scope")
        return {
          ...support,
          claims: [
            {
              claimId: "safety.delete",
              target: "authority.repo.delete",
              value: "allow",
              layer: "safety-invariants",
              hard: false,
            },
          ],
          emissions: [
            ...support.emissions,
            {
              kind: "permission-guard",
              emissionId: "safety.delete.permission",
              allowedOperations: ["repo.delete"],
              prohibitedOperations: [],
              allowedEffects: ["repo.delete"],
              deniedEffects: [],
            },
          ],
        } as const;
      if (support.supportFacetId === "seiri.evidence-capture")
        return {
          ...support,
          claims: [
            {
              claimId: "skin.delete",
              target: "authority.repo.delete",
              value: "deny",
              layer: "visual-skin",
              hard: false,
            },
          ],
          emissions: [
            ...support.emissions,
            {
              kind: "permission-guard",
              emissionId: "skin.delete.permission",
              allowedOperations: [],
              prohibitedOperations: ["repo.delete"],
              allowedEffects: [],
              deniedEffects: ["repo.delete"],
            },
          ],
        } as const;
      return support;
    }),
  };
  const compiled = compileLoadoutProgram(
    withLinkedSupports(
      contestedAuthority,
      contestedAuthority.supportFacets
        .map((support) => support.supportFacetId)
        .filter((supportId) => supportId !== "seiri.absence-cadence"),
    ),
  );
  const authorization = authorize(
    {
      kind: "Act",
      effect: "repo.delete",
      payload: {},
    } satisfies ActIntent,
    compiled.authorityEnvelope,
    {
      now: 0,
      actorId: "precedence-probe",
      workstreamId: "precedence-probe",
      decisionIndex: 0,
      intentIndex: 0,
      evidence: [],
      revokedBy: [],
    },
  );
  assert.equal(authorization.authorized, true);
  assert.ok(compiled.workOrder.allowedOperations.includes("repo.delete"));
  assert.ok(!compiled.workOrder.prohibitedOperations.includes("repo.delete"));
});

test("the canonical scenario milestones retain exact order with the WO-029 enforcement and receipt delta", () => {
  const types = decodeLog(runScenario(fixture).log).map((event) => event.type);
  assert.deepEqual(types, [
    "ArtifactIdentityEnforcementStarted",
    "InspectionTaskCreated",
    "LoadoutEquipped",
    "DecisionRecorded",
    "OperatorPresenceChanged",
    "DecisionRecorded",
    "CadencePulse",
    "DecisionRecorded",
    "WorkOrderEmitted",
    "DecisionRecorded",
    "CommandPersisted",
    "CommandResult",
    "DecisionRecorded",
    "DeletionAttempted",
    "DecisionRecorded",
    "CommandRefused",
    "DecisionRecorded",
    "EpisodeTerminated",
    "DecisionRecorded",
    "VerificationRequested",
    "DecisionRecorded",
    "VerificationCompleted",
    "OperatorPresenceChanged",
    "DecisionRecorded",
    "CadencePulse",
    "DecisionRecorded",
    "QueuedPulseNoOp",
    "SchedulesCancelled",
  ]);
  const expectedCounts: Readonly<Record<string, number>> = {
    ArtifactIdentityEnforcementStarted: 1,
    DecisionRecorded: 11,
    InspectionTaskCreated: 1,
    LoadoutEquipped: 1,
    OperatorPresenceChanged: 2,
    CadencePulse: 2,
    WorkOrderEmitted: 1,
    CommandPersisted: 1,
    CommandResult: 1,
    DeletionAttempted: 1,
    CommandRefused: 1,
    EpisodeTerminated: 1,
    VerificationCompleted: 1,
    QueuedPulseNoOp: 1,
  };
  for (const [type, count] of Object.entries(expectedCounts))
    assert.equal(
      types.filter((candidate) => candidate === type).length,
      count,
      `${type} multiplicity`,
    );
});

test("WO-016 AC6 every derived event names an earlier canonical cause and its pulse or command", () => {
  const events = decodeLog(runScenario(fixture).log);
  const expectedLinks = [
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, "evt_3"],
    [undefined, undefined],
    [undefined, "evt_5"],
    [undefined, "evt_5"],
    [undefined, "evt_7"],
    ["evt_7", "evt_7"],
    ["evt_7", "evt_9"],
    ["evt_7", "evt_9"],
    [expectedInspectCommandId, "evt_11"],
    [expectedInspectCommandId, "evt_12"],
    [expectedInspectCommandId, "evt_12"],
    [expectedInspectCommandId, "evt_14"],
    [expectedInspectCommandId, "evt_14"],
    [expectedInspectCommandId, "evt_16"],
    [expectedInspectCommandId, "evt_16"],
    [expectedInspectCommandId, "evt_18"],
    [expectedInspectCommandId, "evt_18"],
    [expectedInspectCommandId, "evt_20"],
    [expectedInspectCommandId, "evt_20"],
    [undefined, undefined],
    [undefined, "evt_23"],
    [undefined, "evt_5"],
    [undefined, "evt_25"],
    ["evt_25", "evt_25"],
    ["evt_25", "evt_25"],
  ] as const;
  assert.equal(events.length, expectedLinks.length);
  const ordinals = new Map(
    events.map((event, index) => [event.eventId, index] as const),
  );
  events.forEach((event, index) => {
    const [correlationId, causationId] = expectedLinks[index]!;
    assert.equal(
      event.correlationId,
      correlationId,
      `${event.eventId} correlation`,
    );
    assert.equal(event.causationId, causationId, `${event.eventId} causation`);
    if (causationId !== undefined)
      assert.ok(
        (ordinals.get(causationId) ?? Number.MAX_SAFE_INTEGER) < index,
        `${event.eventId} must point to an earlier event`,
      );
  });
});

test("WO-016 step 9 preserves deletion paths, evidence, and structural refusal", () => {
  const result = runScenario(fixture);
  const events = decodeLog(result.log);
  const attempted = events.find((event) => event.type === "DeletionAttempted");
  const refused = events.find((event) => event.type === "CommandRefused");
  assert.deepEqual(attempted?.payload, {
    effect: "repo.delete",
    paths: ["tmp/old-report.txt"],
  });
  assert.deepEqual(refused?.payload, {
    intentIndex: 0,
    reason: "effect denied",
    authorityEnvelopeId: "auth_seiri",
  });
  assert.deepEqual(result.decisions[13]?.state.authorizationEvidence, [
    "inventory:tmp/old-report.txt",
    "classification:generated-stale",
    "references:none",
  ]);
  assert.deepEqual(result.decisions[13]?.state.deletionPaths, [
    "tmp/old-report.txt",
  ]);
  assert.equal(result.adapterEffects, 1, "only inspection reaches the adapter");
});

test("WO-016 step 12 executes the reactor's NoOp and declared cancellations", () => {
  const result = runScenario(fixture);
  const events = decodeLog(result.log);
  assert.deepEqual(result.cancelledScheduleIds, [
    "schedule_seiri_20m",
    "schedule_seiri_already_queued",
  ]);
  assert.deepEqual(result.activeScheduleIds, []);
  assert.deepEqual(result.decisions[24]?.trace.branchPath, [
    "queued-pulse",
    "noop",
  ]);
  assert.deepEqual(
    events.find((event) => event.type === "QueuedPulseNoOp")?.payload,
    { reason: "operator returned", evidence: ["evt_25"] },
  );
  assert.deepEqual(
    events.find((event) => event.type === "SchedulesCancelled")?.payload,
    {
      scheduleIds: ["schedule_seiri_20m", "schedule_seiri_already_queued"],
      activeScheduleIds: [],
    },
  );
});

test("WO-016 AC4 semantic payload changes alter the decision at their event", async (t) => {
  const live = runScenario(fixture);
  const cases: ReadonlyArray<{
    readonly name: string;
    readonly type: string;
    readonly transform: (payload: JsonValue) => JsonValue;
  }> = [
    {
      name: "CommandResult.candidates",
      type: "CommandResult",
      transform: (payload) => ({ ...(payload as object), candidates: [] }),
    },
    {
      name: "VerificationCompleted.accepted",
      type: "VerificationCompleted",
      transform: (payload) => ({ ...(payload as object), accepted: false }),
    },
    {
      name: "WorkOrderEmitted.workOrder",
      type: "WorkOrderEmitted",
      transform: (payload) => {
        const current = payload as unknown as {
          readonly workOrder: WorkOrder;
        };
        return {
          workOrder: { ...current.workOrder, baseCommit: "forged" },
        } as unknown as JsonValue;
      },
    },
    {
      name: "CommandRefused.reason",
      type: "CommandRefused",
      transform: (payload) => ({
        ...(payload as object),
        reason: "forged refusal",
      }),
    },
    {
      name: "SchedulesCancelled.scheduleIds",
      type: "SchedulesCancelled",
      transform: (payload) => ({
        ...(payload as object),
        scheduleIds: [],
      }),
    },
    {
      name: "CommandPersisted.command.intent.effect",
      type: "CommandPersisted",
      transform: (payload) => {
        const current = payload as unknown as {
          readonly command: {
            readonly intent: Readonly<Record<string, JsonValue>>;
          } & Readonly<Record<string, JsonValue>>;
        };
        return {
          command: {
            ...current.command,
            intent: { ...current.command.intent, effect: "repo.write" },
          },
        } as unknown as JsonValue;
      },
    },
  ];

  for (const payloadCase of cases)
    await t.test(payloadCase.name, () => {
      const tampered = replacePayload(
        live.log,
        payloadCase.type,
        payloadCase.transform,
      );
      const replayed = replayScenario(tampered.log);
      assert.notDeepEqual(
        replayed.decisions[tampered.eventIndex],
        live.decisions[tampered.eventIndex],
      );
      assert.throws(() => assertScenarioIdentity(live, replayed));
    });
});

test("WO-016 AC7 a negative fixture stays unverified in live, replay, and glyph state", () => {
  const negativeFixture: FixtureTree = {
    files: [
      {
        path: "src/used.ts",
        referencedBy: ["src/index.ts"],
        classification: "source",
      },
    ],
  };
  const live = runScenario(negativeFixture);
  const replayed = replayScenario(live.log);
  assertScenarioIdentity(live, replayed);
  assert.deepEqual(live.candidates, []);
  assert.equal(live.verified, false);
  assert.match(live.glyphScene, /○ unverified/u);
  assert.doesNotMatch(live.glyphScene, /✅ verified/u);
  assert.deepEqual(
    decodeLog(live.log).find((event) => event.type === "VerificationCompleted")
      ?.payload,
    { accepted: false, candidateCount: 0 },
  );
});

test("row 1 crash recovery replays state, redispatches, and adapter-deduplicates", () => {
  const normal = runScenario(fixture);
  const durableMarker = "reconstructed-from-persisted-log";
  const result = runScenario(fixture, {
    crashAfterPersist: true,
    recoveryLogTransform: (persistedLog) =>
      encodeLog(
        decodeLog(persistedLog).map((event) => {
          if (event.type !== "CommandPersisted") return event;
          const payload = event.payload as unknown as {
            command: {
              intent: { payload: { workOrder: { baseCommit: string } } };
            };
          };
          return {
            ...event,
            payload: {
              command: {
                ...(event.payload as unknown as { command: object }).command,
                intent: {
                  ...(payload.command.intent as unknown as object),
                  payload: {
                    ...(payload.command.intent.payload as unknown as object),
                    workOrder: {
                      ...payload.command.intent.payload.workOrder,
                      baseCommit: durableMarker,
                    },
                  },
                },
              },
            },
          };
        }),
      ),
  });
  assert.equal(expectedInspectCommandId, "cmd_5ee0c6d8e207bd25");
  assert.deepEqual(result.adapterDispatches, [
    expectedInspectCommandId,
    expectedInspectCommandId,
  ]);
  assert.equal(
    (
      result.recoveredCommands[0]?.intent.payload as {
        workOrder?: { baseCommit?: string };
      }
    ).workOrder?.baseCommit,
    durableMarker,
  );
  assert.equal(result.adapterEffects, 1);
  assert.deepEqual(
    {
      candidates: result.candidates,
      verified: result.verified,
      cancelled: result.cancelledScheduleIds,
    },
    {
      candidates: normal.candidates,
      verified: normal.verified,
      cancelled: normal.cancelledScheduleIds,
    },
  );
  assertScenarioIdentity(result, replayScenario(result.log));
  assert.deepEqual(pendingCommands(replayOutbox(decodeLog(result.log))), []);
  const persisted = decodeLog(result.log).find(
    (event) => event.type === "CommandPersisted",
  );
  const redispatched = decodeLog(result.log).find(
    (event) => event.type === "CommandRedispatched",
  );
  const requested = decodeLog(result.log).find(
    (event) => event.type === "CommandRedispatchRequested",
  );
  const commandResult = decodeLog(result.log).find(
    (event) => event.type === "CommandResult",
  );
  assert.equal(
    (persisted?.payload as { command: { commandId: string } }).command
      .commandId,
    expectedInspectCommandId,
  );
  assert.equal(redispatched?.correlationId, expectedInspectCommandId);
  assert.equal(requested?.causationId, persisted?.eventId);
  assert.equal(redispatched?.causationId, requested?.eventId);
  assert.equal(commandResult?.correlationId, expectedInspectCommandId);
  assert.equal(commandResult?.causationId, redispatched?.eventId);
});

test("WO-047 complete Decision bytes match across stored skeleton streams", async (t) => {
  const root = new URL("../../../../", import.meta.url);
  const evidence = (kind: "artifact-identity" | "verification" | "feedback") =>
    currentEvidence(fileURLToPath(root), kind).directory;
  const fixtures = [
    [
      "WO-003 oracle",
      "packages/skeleton/fixtures/wo029-legacy-scenario.jsonl",
      null,
    ],
    ["demo", `${evidence("artifact-identity")}/scenario.jsonl`, null],
    ["worker recovery", "packages/console/fixtures/wo009.events.jsonl", null],
    [
      "verification",
      `${evidence("verification")}/events.jsonl`,
      "ws_independent_verification",
    ],
    ["feedback audit", "audit", null],
    ["feedback verifier", "verifier", "ws_feedback_audit_verification"],
  ] as const;
  for (const [name, path, workstream] of fixtures)
    await t.test(name, async (subtest) => {
      // A schema 2 feedback edition names its live audit and commits the
      // verifier stream by reference; replay needs the bodies (WO-154).
      const log =
        path === "audit" || path === "verifier"
          ? feedbackEditionLog(fileURLToPath(root), evidence("feedback"), path)
              .value
          : await readFile(new URL(path, root), "utf8");
      const replayed = assertProjectionIdentity(
        log,
        workstream === null
          ? initialState()
          : initialVerificationRuntime(workstream),
        name === "feedback audit" || workstream !== null ? {} : seiriPredicates,
      );
      // The array's serialized size, summed per decision: brackets, commas
      // and each element, without building the one oversized string.
      const serializedBytes = replayed.decisions.reduce(
        (sum, decision) => sum + Buffer.byteLength(JSON.stringify(decision)),
        2 + Math.max(0, replayed.decisions.length - 1),
      );
      subtest.diagnostic(
        `${replayed.decisions.length} complete decisions; ${serializedBytes} identical serialized bytes`,
      );
      if (name === "WO-003 oracle")
        assert.deepEqual(
          replayed.decisions.map((decision) => decision.trace),
          wo003DecisionTraces,
        );
    });
});
