import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  decodeLog,
  encodeLog,
  type Event,
  type JsonValue,
} from "@dotln/kernel";
import {
  consequentialActionClasses,
  deriveAuditRecords,
  projectAuditEvents,
  renderAuditProjections,
} from "../src/audit.js";
import {
  expectedInspectCommandId,
  replayScenario,
  runScenario,
  type FixtureTree,
} from "../src/scenario.js";

const fixture = JSON.parse(
  await readFile(
    fileURLToPath(new URL("../../fixtures/repo-tree.json", import.meta.url)),
    "utf8",
  ),
) as FixtureTree;

const liveEvents = (): readonly Event[] => decodeLog(runScenario(fixture).log);

const auditEvent = (
  eventId: string,
  type: string,
  payload: JsonValue,
  options: {
    readonly occurredAt?: number;
    readonly workstreamId?: string;
    readonly episodeId?: string | null;
    readonly correlationId?: string;
    readonly causationId?: string;
  } = {},
): Event => ({
  schemaVersion: 1,
  eventId,
  type,
  occurredAt: options.occurredAt ?? 0,
  actorId: "test-actor",
  workstreamId: options.workstreamId ?? "ws_test",
  ...(options.episodeId === null
    ? {}
    : { episodeId: options.episodeId ?? "ep_test" }),
  ...(options.correlationId === undefined
    ? {}
    : { correlationId: options.correlationId }),
  ...(options.causationId === undefined
    ? {}
    : { causationId: options.causationId }),
  payload,
});

test("AC1 enumerates each consequential action class with operator and verifier questions", () => {
  assert.deepEqual(consequentialActionClasses, [
    {
      actionClass: "work-order-dispatch",
      sourceEventTypes: ["WorkOrderEmitted"],
      requiredReferences: [
        "eventIds",
        "workstreamId",
        "episodeId when present",
        "workOrderRef",
      ],
      operatorQuestion: "What bounded work was emitted for this episode?",
      verifierQuestion:
        "Which canonical event and WorkOrder reference prove emission without claiming a transport receipt?",
    },
    {
      actionClass: "authority-decision",
      sourceEventTypes: ["CommandPersisted", "CommandRefused"],
      requiredReferences: [
        "eventIds",
        "workstreamId",
        "episodeId when present",
        "commandId when allowed",
        "authorityEnvelopeRef and reason when denied",
      ],
      operatorQuestion: "Was the requested action allowed or denied, and why?",
      verifierQuestion:
        "Does the decision retain its canonical command or refusal evidence without inventing either?",
    },
    {
      actionClass: "external-effect",
      sourceEventTypes: [
        "CommandResult",
        "DeletionAttempted",
        "SchedulesCancelled",
      ],
      requiredReferences: [
        "eventIds",
        "workstreamId",
        "episodeId when present",
        "commandId when one exists",
      ],
      operatorQuestion: "What outside action was requested or observed?",
      verifierQuestion:
        "Which retained events distinguish a requested effect from an observed result?",
    },
    {
      actionClass: "result",
      sourceEventTypes: ["CommandResult", "EpisodeTerminated"],
      requiredReferences: [
        "eventIds",
        "workstreamId",
        "episodeId when present",
        "commandId for command results",
      ],
      operatorQuestion: "What outcome did the episode or command return?",
      verifierQuestion:
        "Does the result point to the originating command and canonical result event?",
    },
    {
      actionClass: "verification",
      sourceEventTypes: ["VerificationRequested", "VerificationCompleted"],
      requiredReferences: [
        "eventIds",
        "workstreamId",
        "episodeId when present",
        "subjectRef when known",
      ],
      operatorQuestion:
        "Was the result accepted by the recorded verification step?",
      verifierQuestion:
        "Which request and completion events support the verdict, and what attribution is actually recorded?",
    },
    {
      actionClass: "recovery",
      sourceEventTypes: ["CommandPersisted", "CommandRedispatched"],
      requiredReferences: [
        "eventIds",
        "workstreamId",
        "episodeId when present",
        "commandId",
        "originalCommandEventId",
      ],
      operatorQuestion: "Which interrupted command resumed?",
      verifierQuestion:
        "Did recovery preserve the original canonical command identity?",
    },
    {
      actionClass: "no-op",
      sourceEventTypes: ["QueuedPulseNoOp"],
      requiredReferences: [
        "eventIds",
        "workstreamId",
        "episodeId when present",
        "evidenceEventIds",
      ],
      operatorQuestion: "Why did the system deliberately do nothing?",
      verifierQuestion:
        "Does the decline point to the event evidence that made further work inapplicable?",
    },
  ]);
});

test("AC2 AuditRecord v1 keeps canonical references and no copied event payloads", () => {
  const events = liveEvents();
  const records = deriveAuditRecords(events);
  const eventIds = new Set(events.map((event) => event.eventId));

  assert.equal(records.length, 10);
  for (const record of records) {
    assert.equal(record.schemaVersion, 1);
    assert.equal(record.episodeId, "ep_seiri_1");
    assert.ok(record.eventIds.every((eventId) => eventIds.has(eventId)));
    assert.equal(Object.hasOwn(record, "payload"), false);
  }

  const dispatch = records.find(
    (record) => record.actionClass === "work-order-dispatch",
  );
  assert.ok(dispatch?.actionClass === "work-order-dispatch");
  assert.equal(dispatch.workOrderRef, "wo_repo_inspection_1");

  const allowed = records.find(
    (record) =>
      record.actionClass === "authority-decision" &&
      record.decision === "allowed",
  );
  assert.ok(
    allowed?.actionClass === "authority-decision" &&
      allowed.decision === "allowed",
  );
  assert.equal(allowed.commandId, expectedInspectCommandId);

  const denied = records.find(
    (record) =>
      record.actionClass === "authority-decision" &&
      record.decision === "denied",
  );
  assert.ok(denied);
  assert.equal(Object.hasOwn(denied, "commandId"), false);

  const verification = records.find(
    (record) => record.actionClass === "verification",
  );
  assert.ok(verification?.actionClass === "verification");
  assert.equal(verification.association, "derived-single-request-in-scope");

  const serialized = JSON.stringify(records);
  assert.doesNotMatch(serialized, /tmp\/old-report\.txt/u);
  assert.doesNotMatch(serialized, /Inspect the bounded fixture repository/u);
  assert.doesNotMatch(serialized, /"payload"/u);

  const recoveryEvents = decodeLog(
    runScenario(fixture, { crashAfterPersist: true }).log,
  );
  const recovery = deriveAuditRecords(recoveryEvents).find(
    (record) => record.actionClass === "recovery",
  );
  assert.deepEqual(recovery, {
    schemaVersion: 1,
    recordId: "audit:evt_9:recovery",
    actionClass: "recovery",
    action: "command.redispatch",
    outcome: "redispatched",
    occurredAt: 1200001,
    actorId: "repo-gardener",
    workstreamId: "ws_repo_garden",
    episodeId: "ep_seiri_1",
    eventIds: ["evt_8", "evt_9"],
    commandId: expectedInspectCommandId,
    originalCommandEventId: "evt_8",
    recoveryState: "redispatched",
  });
});

test("AC3 captures the L0 receipt, causal timeline, and governed raw JSON with fidelity links", () => {
  const events = liveEvents();
  const projections = projectAuditEvents(events);

  assert.deepEqual(
    projections.receipt.receipts.map((entry) => ({
      recordId: entry.recordId,
      action: entry.action,
      outcome: entry.outcome,
      evidenceLinks: entry.evidenceLinks,
    })),
    [
      {
        recordId: "audit:evt_6:work-order-dispatch",
        action: "work-order.emit",
        outcome: "emitted",
        evidenceLinks: ["event:evt_6"],
      },
      {
        recordId: "audit:evt_8:authority-decision",
        action: "repo.inspect",
        outcome: "allowed",
        evidenceLinks: ["event:evt_8"],
      },
      {
        recordId: "audit:evt_9:external-effect",
        action: "repo.inspect",
        outcome: "observed",
        evidenceLinks: ["event:evt_8", "event:evt_9"],
      },
      {
        recordId: "audit:evt_9:result",
        action: "command.result",
        outcome: "returned",
        evidenceLinks: ["event:evt_9"],
      },
      {
        recordId: "audit:evt_10:external-effect",
        action: "repo.delete",
        outcome: "requested",
        evidenceLinks: ["event:evt_10"],
      },
      {
        recordId: "audit:evt_11:authority-decision",
        action: "repo.delete",
        outcome: "denied",
        evidenceLinks: ["event:evt_10", "event:evt_11", "event:evt_12"],
      },
      {
        recordId: "audit:evt_13:result",
        action: "episode.terminate",
        outcome: "terminated",
        evidenceLinks: ["event:evt_13"],
      },
      {
        recordId: "audit:evt_16:verification",
        action: "verification.complete",
        outcome: "passed",
        evidenceLinks: ["event:evt_15", "event:evt_16"],
      },
      {
        recordId: "audit:evt_20:no-op",
        action: "cadence.no-op",
        outcome: "no-op",
        evidenceLinks: ["event:evt_20"],
      },
      {
        recordId: "audit:evt_21:external-effect",
        action: "schedule.cancel",
        outcome: "observed",
        evidenceLinks: ["event:evt_21"],
      },
    ],
  );
  assert.equal(projections.receipt.fidelity, "L0");
  assert.deepEqual(projections.receipt.governance, {
    audience: ["operator"],
    purpose: "everyday-confirmation",
    intendedAccess: "not-defined",
    enforcement: "deferred",
    persistenceClass: "projections",
    retentionClass: "not-defined",
  });
  assert.ok(projections.receipt.omissions.length > 0);
  assert.deepEqual(projections.receipt.deeperProjection, {
    projection: "causal-timeline",
    projectionRef: "audit-projection:ep:ep_seiri_1:causal-timeline",
    availability: "exists",
    intendedAccess: "not-defined",
    enforcement: "deferred",
  });
  for (const receipt of projections.receipt.receipts) {
    assert.equal(receipt.actor, "repo-gardener");
    assert.equal(receipt.scope.workstreamId, "ws_repo_garden");
    assert.equal(receipt.scope.episodeId, "ep_seiri_1");
    assert.equal(typeof receipt.time, "number");
    assert.equal(
      receipt.timelineLink,
      `audit-projection:ep:ep_seiri_1:causal-timeline#${receipt.recordId}`,
    );
  }

  assert.deepEqual(
    projections.timeline.entries.map((entry) => ({
      recordId: entry.recordId,
      timelineOrdinal: entry.timelineOrdinal,
      appendOrdinal: entry.appendOrdinal,
    })),
    [
      {
        recordId: "audit:evt_6:work-order-dispatch",
        timelineOrdinal: 1,
        appendOrdinal: 6,
      },
      {
        recordId: "audit:evt_8:authority-decision",
        timelineOrdinal: 2,
        appendOrdinal: 8,
      },
      {
        recordId: "audit:evt_9:external-effect",
        timelineOrdinal: 3,
        appendOrdinal: 9,
      },
      {
        recordId: "audit:evt_9:result",
        timelineOrdinal: 4,
        appendOrdinal: 9,
      },
      {
        recordId: "audit:evt_10:external-effect",
        timelineOrdinal: 5,
        appendOrdinal: 10,
      },
      {
        recordId: "audit:evt_11:authority-decision",
        timelineOrdinal: 6,
        appendOrdinal: 12,
      },
      {
        recordId: "audit:evt_13:result",
        timelineOrdinal: 7,
        appendOrdinal: 13,
      },
      {
        recordId: "audit:evt_16:verification",
        timelineOrdinal: 8,
        appendOrdinal: 16,
      },
      {
        recordId: "audit:evt_20:no-op",
        timelineOrdinal: 9,
        appendOrdinal: 20,
      },
      {
        recordId: "audit:evt_21:external-effect",
        timelineOrdinal: 10,
        appendOrdinal: 21,
      },
    ],
  );
  assert.equal(projections.timeline.fidelity, "L1");
  assert.deepEqual(projections.timeline.governance, {
    audience: ["operator", "verifier"],
    purpose: "causal-review",
    intendedAccess: "not-defined",
    enforcement: "deferred",
    persistenceClass: "projections",
    retentionClass: "not-defined",
  });
  assert.deepEqual(projections.timeline.correlationGroups, [
    {
      correlationId: "evt_5",
      recordIds: [
        "audit:evt_6:work-order-dispatch",
        "audit:evt_8:authority-decision",
      ],
    },
    {
      correlationId: expectedInspectCommandId,
      recordIds: ["audit:evt_9:external-effect", "audit:evt_9:result"],
    },
  ]);
  assert.ok(projections.timeline.omissions.length > 0);
  assert.deepEqual(projections.timeline.deeperProjection, {
    projection: "governed-raw-json",
    projectionRef: "audit-projection:ep:ep_seiri_1:governed-raw-json",
    availability: "exists",
    intendedAccess: "restricted",
    enforcement: "deferred",
  });

  assert.equal(projections.governedRaw.fidelity, "L4");
  assert.deepEqual(projections.governedRaw.events, events);
  assert.deepEqual(
    projections.governedRaw.completeness.eventFieldOmissions,
    [],
  );
  assert.deepEqual(projections.governedRaw.governance, {
    audience: ["verifier"],
    intendedAccess: "restricted",
    enforcement: "deferred",
    purpose: "bounded-audit-reconstruction",
    sourcePersistenceClass: "canonical",
    projectionPersistenceClass: "projections",
    retentionClass: "not-defined",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(projections.governedRaw, null, 2)).events,
    events,
  );
});

test("audit source validation refuses missing canonical references instead of inventing success", () => {
  assert.throws(
    () =>
      deriveAuditRecords([
        auditEvent("evt_1", "CommandResult", { result: "anything" }),
      ]),
    /invalid audit source evt_1 CommandResult: missing commandId/u,
  );
  assert.throws(
    () =>
      deriveAuditRecords([
        auditEvent("evt_1", "QueuedPulseNoOp", {
          reason: "not useful",
          evidence: ["evt_missing"],
        }),
      ]),
    /missing or non-canonical NoOp evidence/u,
  );
  assert.throws(
    () =>
      deriveAuditRecords([
        auditEvent("evt_1", "WorkOrderEmitted", {
          workOrder: { workOrderId: " " },
        }),
      ]),
    /missing workOrder\.workOrderId/u,
  );
  assert.throws(
    () =>
      projectAuditEvents([
        auditEvent("evt_duplicate", "Context", {}),
        auditEvent("evt_duplicate", "Context", {}),
      ]),
    /duplicate eventId evt_duplicate/u,
  );
  assert.throws(
    () => deriveAuditRecords([auditEvent("", "Context", {})]),
    /eventId must be non-blank/u,
  );
  assert.throws(
    () =>
      deriveAuditRecords([
        auditEvent("evt_1", "Context", {}, { workstreamId: " " }),
      ]),
    /workstreamId must be non-blank/u,
  );
  assert.throws(
    () =>
      projectAuditEvents([
        {
          schemaVersion: 1,
          eventId: "evt_1",
          type: "Context",
          occurredAt: 0,
          actorId: "actor",
          workstreamId: "ws_test",
        } as Event,
      ]),
    /payload must be present JSON data/u,
  );
});

test("causal timeline obeys causation while correlation remains an append-stable group", () => {
  const workOrderPayload = (workOrderId: string): JsonValue => ({
    workOrder: { workOrderId },
  });
  const caused = [
    auditEvent("evt_child", "WorkOrderEmitted", workOrderPayload("wo_child"), {
      causationId: "evt_parent",
      correlationId: "corr_shared",
    }),
    auditEvent(
      "evt_parent",
      "WorkOrderEmitted",
      workOrderPayload("wo_parent"),
      {
        correlationId: "corr_shared",
      },
    ),
  ];
  const causedProjection = projectAuditEvents(caused).timeline;
  assert.deepEqual(
    causedProjection.entries.map((entry) => entry.recordId),
    [
      "audit:evt_parent:work-order-dispatch",
      "audit:evt_child:work-order-dispatch",
    ],
  );
  assert.deepEqual(causedProjection.correlationGroups, [
    {
      correlationId: "corr_shared",
      recordIds: [
        "audit:evt_child:work-order-dispatch",
        "audit:evt_parent:work-order-dispatch",
      ],
    },
  ]);

  const correlated = [
    auditEvent("evt_child", "WorkOrderEmitted", workOrderPayload("wo_child"), {
      correlationId: "evt_parent",
    }),
    auditEvent("evt_parent", "WorkOrderEmitted", workOrderPayload("wo_parent")),
  ];
  const projection = projectAuditEvents(correlated).timeline;
  assert.deepEqual(
    projection.entries.map((entry) => entry.recordId),
    [
      "audit:evt_child:work-order-dispatch",
      "audit:evt_parent:work-order-dispatch",
    ],
  );
  assert.deepEqual(projection.correlationGroups, [
    {
      correlationId: "evt_parent",
      recordIds: ["audit:evt_child:work-order-dispatch"],
    },
  ]);

  const multiRecordCause = [
    auditEvent("evt_persisted", "CommandPersisted", {
      command: {
        commandId: "cmd_multi",
        intent: { effect: "repo.inspect" },
      },
    }),
    auditEvent("evt_after_result", "WorkOrderEmitted", workOrderPayload("wo"), {
      causationId: "evt_result",
    }),
    auditEvent("evt_result", "CommandResult", {
      commandId: "cmd_multi",
      result: "returned",
    }),
  ];
  assert.deepEqual(
    projectAuditEvents(multiRecordCause).timeline.entries.map(
      (entry) => entry.recordId,
    ),
    [
      "audit:evt_persisted:authority-decision",
      "audit:evt_result:external-effect",
      "audit:evt_result:result",
      "audit:evt_after_result:work-order-dispatch",
    ],
  );

  assert.throws(
    () =>
      projectAuditEvents([
        auditEvent("evt_cycle_a", "WorkOrderEmitted", workOrderPayload("a"), {
          causationId: "evt_cycle_b",
        }),
        auditEvent("evt_cycle_b", "WorkOrderEmitted", workOrderPayload("b"), {
          causationId: "evt_cycle_a",
        }),
      ]),
    /invalid audit causation cycle/u,
  );
  assert.throws(
    () =>
      projectAuditEvents([
        auditEvent("evt_self", "WorkOrderEmitted", workOrderPayload("self"), {
          causationId: "evt_self",
        }),
      ]),
    /event cannot cause itself/u,
  );
});

test("projection fidelity links share one scope across mixed and context-only logs", () => {
  const projectAndCheckLinks = (events: readonly Event[]): string => {
    const projections = projectAuditEvents(events);
    assert.equal(
      projections.receipt.deeperProjection.projectionRef,
      projections.timeline.projectionRef,
    );
    assert.equal(
      projections.timeline.deeperProjection.projectionRef,
      projections.governedRaw.projectionRef,
    );
    return projections.governedRaw.projectionRef;
  };

  assert.equal(
    projectAndCheckLinks([
      auditEvent("evt_context", "Context", {}, { episodeId: "ep_context" }),
      auditEvent(
        "evt_work",
        "WorkOrderEmitted",
        { workOrder: { workOrderId: "wo_mixed" } },
        { episodeId: "ep_work" },
      ),
    ]),
    "audit-projection:ws:ws_test:governed-raw-json",
  );
  assert.equal(
    projectAndCheckLinks([
      auditEvent("evt_context", "Context", {}, { episodeId: "ep_context" }),
    ]),
    "audit-projection:ep:ep_context:governed-raw-json",
  );
  assert.equal(
    projectAndCheckLinks([
      auditEvent("evt_context", "Context", {}, { episodeId: null }),
      auditEvent(
        "evt_work",
        "WorkOrderEmitted",
        { workOrder: { workOrderId: "wo_partial" } },
        { episodeId: "ep_work" },
      ),
    ]),
    "audit-projection:ws:ws_test:governed-raw-json",
  );
  assert.equal(
    projectAndCheckLinks([
      auditEvent(
        "evt_context",
        "Context",
        {},
        { episodeId: null, workstreamId: "ws_context" },
      ),
      auditEvent(
        "evt_work",
        "WorkOrderEmitted",
        { workOrder: { workOrderId: "wo_partial_mixed" } },
        { episodeId: "ep_work", workstreamId: "ws_work" },
      ),
    ]),
    "audit-projection:log:mixed:governed-raw-json",
  );
  assert.equal(
    projectAndCheckLinks([
      auditEvent(
        "evt_a",
        "Context",
        {},
        { episodeId: "ep_shared", workstreamId: "ws_a" },
      ),
      auditEvent(
        "evt_b",
        "Context",
        {},
        { episodeId: "ep_shared", workstreamId: "ws_b" },
      ),
    ]),
    "audit-projection:log:mixed:governed-raw-json",
  );
});

test("audit associations stay scope-bound and honor explicit verification links", () => {
  const crossScope = [
    auditEvent(
      "evt_persisted",
      "CommandPersisted",
      {
        command: {
          commandId: "cmd_shared",
          intent: { effect: "repo.inspect" },
        },
      },
      { workstreamId: "ws_a", episodeId: "ep_a" },
    ),
    auditEvent(
      "evt_result",
      "CommandResult",
      { commandId: "cmd_shared", result: "returned" },
      { workstreamId: "ws_b", episodeId: "ep_b" },
    ),
  ];
  const crossScopeRecords = deriveAuditRecords(crossScope);
  assert.equal(
    crossScopeRecords.some(
      (record) =>
        record.actionClass === "external-effect" &&
        record.eventIds.includes("evt_result"),
    ),
    false,
  );
  assert.deepEqual(
    crossScopeRecords.find(
      (record) =>
        record.actionClass === "result" &&
        record.recordId === "audit:evt_result:result",
    )?.eventIds,
    ["evt_result"],
  );

  const verification = deriveAuditRecords([
    auditEvent("evt_request_1", "VerificationRequested", {
      commandId: "cmd_1",
    }),
    auditEvent("evt_request_2", "VerificationRequested", {
      commandId: "cmd_2",
    }),
    auditEvent(
      "evt_complete",
      "VerificationCompleted",
      { accepted: true },
      {
        causationId: "evt_unrelated",
        correlationId: "evt_request_1",
      },
    ),
  ]).find((record) => record.actionClass === "verification");
  assert.ok(verification?.actionClass === "verification");
  assert.deepEqual(verification.eventIds, ["evt_request_1", "evt_complete"]);
  assert.equal(verification.subjectRef, "cmd_1");
  assert.equal(verification.association, "explicit-event-link");

  const ambiguousVerification = deriveAuditRecords([
    auditEvent("evt_ambiguous_request_1", "VerificationRequested", {
      commandId: "cmd_1",
    }),
    auditEvent("evt_ambiguous_request_2", "VerificationRequested", {
      commandId: "cmd_2",
    }),
    auditEvent("evt_ambiguous_complete", "VerificationCompleted", {
      accepted: false,
    }),
  ]).find((record) => record.actionClass === "verification");
  assert.ok(ambiguousVerification?.actionClass === "verification");
  assert.equal(ambiguousVerification.association, "completion-event-only");
  assert.deepEqual(ambiguousVerification.eventIds, ["evt_ambiguous_complete"]);

  const episodeLess = deriveAuditRecords([
    auditEvent(
      "evt_attempt",
      "DeletionAttempted",
      { effect: "repo.delete" },
      { episodeId: null },
    ),
    auditEvent(
      "evt_refusal",
      "CommandRefused",
      { reason: "effect denied", authorityEnvelopeId: "auth_test" },
      { episodeId: null },
    ),
  ]).find(
    (record) =>
      record.actionClass === "authority-decision" &&
      record.decision === "denied",
  );
  assert.ok(
    episodeLess?.actionClass === "authority-decision" &&
      episodeLess.decision === "denied",
  );
  assert.equal(episodeLess.association, "refusal-event-only");
  assert.equal(episodeLess.action, "command.refused");
  assert.deepEqual(episodeLess.eventIds, ["evt_refusal"]);
});

test("AC4 step 9 refusal is explicit in the receipt and causal timeline", () => {
  const projections = projectAuditEvents(liveEvents());
  const receipt = projections.receipt.receipts.find(
    (entry) => entry.action === "repo.delete" && entry.outcome === "denied",
  );
  assert.deepEqual(receipt?.authority, {
    decision: "denied",
    authorityEnvelopeRef: "auth_seiri",
    reason: "effect denied",
  });
  assert.deepEqual(receipt?.evidenceLinks, [
    "event:evt_10",
    "event:evt_11",
    "event:evt_12",
  ]);

  const timeline = projections.timeline.entries.find(
    (entry) =>
      entry.actionClass === "authority-decision" && entry.decision === "denied",
  );
  assert.ok(
    timeline?.actionClass === "authority-decision" &&
      timeline.decision === "denied",
  );
  assert.equal(timeline.action, "repo.delete");
  assert.equal(timeline.authorityEnvelopeRef, "auth_seiri");
  assert.equal(timeline.reason, "effect denied");
  assert.equal(timeline.association, "derived-same-episode-time-adjacency");
  assert.equal(Object.hasOwn(timeline, "commandId"), false);
  assert.match(
    projections.timeline.omissions.join("\n"),
    /not canonical causation/u,
  );
});

test("AC5 all projection bytes are identical over live, replayed, and re-encoded logs", () => {
  const live = runScenario(fixture);
  const events = decodeLog(live.log);
  const before = structuredClone(events);
  const expected = renderAuditProjections(events);
  const replayed = replayScenario(live.log, fixture);
  const rerun = runScenario(fixture);

  assert.equal(renderAuditProjections(decodeLog(replayed.log)), expected);
  assert.equal(renderAuditProjections(decodeLog(encodeLog(events))), expected);
  assert.equal(renderAuditProjections(decodeLog(rerun.log)), expected);
  assert.deepEqual(events, before, "pure folds must not mutate the event log");
});
