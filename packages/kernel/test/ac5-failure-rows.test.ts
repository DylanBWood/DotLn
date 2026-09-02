import test from "node:test";
import assert from "node:assert/strict";
import {
  appendEvent,
  applyCommandResult,
  authorize,
  commandId,
  decodeLog,
  emptyOutbox,
  guardQueuedPulse,
  pendingCommands,
  persistCommand,
  replayOutbox,
} from "../src/index.js";
import type {
  AuthorityEnvelope,
  AuthorizationResult,
  Command,
  Event,
  EventEnvelope,
  JsonValue,
  KernelEnv,
  OutboxState,
  PredicateRef,
  PredicateRegistry,
} from "../src/index.js";

const event = <P extends JsonValue = Record<string, never>>(
  id: string,
  type: string,
  at: number,
  payload: P = {} as P,
): EventEnvelope<string, P> => ({
  schemaVersion: 1,
  eventId: id,
  type,
  occurredAt: at,
  actorId: "actor",
  workstreamId: "ws",
  episodeId: "ep",
  payload,
});
const stateValue = (state: JsonValue, key: string): JsonValue | undefined =>
  state !== null && !Array.isArray(state) && typeof state === "object"
    ? (state as Readonly<Record<string, JsonValue>>)[key]
    : undefined;
const requireAuthorized = (
  result: AuthorizationResult,
): Extract<AuthorizationResult, { authorized: true }> => {
  if (!result.authorized) assert.fail(result.refusal.payload.reason);
  return result;
};
const authority: AuthorityEnvelope = {
  authorityEnvelopeId: "auth",
  allowedEffects: ["write"],
  deniedEffects: [],
  resourceLimits: {},
  requiredEvidence: [],
  expiresAt: 999,
  revocationEventTypes: [],
};

// Literal commandId for workstreamId "ws", episodeId "ep", decisionIndex 3, intentIndex 0
// = "cmd_" + FNV-1a-64("ep:ep:3:0"). Pinned as a string so no kernel code shapes the oracle.
const CMD = "cmd_c835adb882f3d562";
const command: Command = {
  commandId: CMD,
  episodeId: "ep",
  workstreamId: "ws",
  intent: { kind: "Act", effect: "write", payload: { value: 1 } },
};

test("AC5 row 1 evidence: authorize + replayOutbox reproduce a literal pending outbox keyed by the real commandId", () => {
  const authorized = requireAuthorized(
    authorize(
      { kind: "Act", effect: "write", payload: { value: 1 } },
      authority,
      {
        now: 1,
        actorId: "a",
        workstreamId: "ws",
        episodeId: "ep",
        decisionIndex: 3,
        intentIndex: 0,
        evidence: [],
        revokedBy: [],
      },
    ),
  );
  assert.deepEqual(authorized.command, command);
  assert.equal(commandId("ws", "ep", 3, 0), CMD);
  const { log } = appendEvent("", {
    schemaVersion: 1,
    type: "CommandPersisted",
    occurredAt: 1,
    actorId: "a",
    workstreamId: "ws",
    episodeId: "ep",
    payload: { command: command as unknown as JsonValue },
  });
  const expected: OutboxState = {
    entries: { [CMD]: { command, status: "pending" } },
  };
  assert.deepEqual(replayOutbox(decodeLog(log)), expected);
  assert.deepEqual(pendingCommands(replayOutbox(decodeLog(log))), [command]);
});

test("AC5 row 1 evidence: a completed command is never re-dispatched — replay of persist+result leaves pendingCommands empty", () => {
  let log = "";
  ({ log } = appendEvent(log, {
    schemaVersion: 1,
    type: "CommandPersisted",
    occurredAt: 1,
    actorId: "a",
    workstreamId: "ws",
    episodeId: "ep",
    payload: { command: command as unknown as JsonValue },
  }));
  ({ log } = appendEvent(log, {
    schemaVersion: 1,
    type: "CommandResult",
    occurredAt: 2,
    actorId: "a",
    workstreamId: "ws",
    episodeId: "ep",
    payload: { commandId: CMD, result: "ok" },
  }));
  const recovered = replayOutbox(decodeLog(log));
  const expected: OutboxState = {
    entries: {
      [CMD]: { command, status: "completed", resultEventId: "evt_2" },
    },
  };
  assert.deepEqual(recovered, expected);
  assert.deepEqual(pendingCommands(recovered), []);
});

test("AC5 row 1 evidence: persistCommand on an existing completed entry does not reset it to pending", () => {
  const completed: OutboxState = {
    entries: {
      [CMD]: { command, status: "completed", resultEventId: "evt_2" },
    },
  };
  const after = persistCommand(completed, command);
  assert.deepEqual(after, {
    entries: {
      [CMD]: { command, status: "completed", resultEventId: "evt_2" },
    },
  });
  assert.deepEqual(pendingCommands(after), []);
});

test("AC5 row 3 evidence: first delivery is accepted with literal trace, duplicate deduped with state unchanged", () => {
  const pending = persistCommand(emptyOutbox(), command);
  const result = event("res-1", "CommandResult", 2, {
    commandId: CMD,
    result: "ok",
  });
  const first = applyCommandResult(pending, result);
  assert.deepEqual(first.trace, {
    reactorId: "outbox",
    reactorVersion: "1",
    branchPath: ["result", "accepted"],
    envInputs: ["commandId"],
    cadenceEvaluations: [],
  });
  assert.deepEqual(first.state, {
    entries: {
      [CMD]: { command, status: "completed", resultEventId: "res-1" },
    },
  });
  const duplicate = applyCommandResult(first.state, {
    ...result,
    eventId: "res-2",
  });
  assert.deepEqual(duplicate.trace, {
    reactorId: "outbox",
    reactorVersion: "1",
    branchPath: ["result", "dedup"],
    envInputs: ["commandId"],
    cadenceEvaluations: [],
  });
  assert.deepEqual(duplicate.state, first.state);
  assert.equal(duplicate.state.entries[CMD]?.resultEventId, "res-1");
});

test("AC5 row 3 evidence: prototype-key commandIds yield the unknown trace and change nothing", () => {
  const pending = persistCommand(emptyOutbox(), command);
  for (const key of [
    "__proto__",
    "toString",
    "constructor",
    "hasOwnProperty",
  ]) {
    const outcome = applyCommandResult(
      pending,
      event(`proto-${key}`, "CommandResult", 3, {
        commandId: key,
        result: "ok",
      }),
    );
    assert.deepEqual(
      outcome.trace.branchPath,
      ["result", "unknown"],
      `commandId ${key} must be unknown`,
    );
    assert.deepEqual(
      outcome.state,
      pending,
      `commandId ${key} must not fabricate an entry`,
    );
  }
});

test("AC5 row 5 evidence: both presence branches produce the literal full decision", () => {
  const presencePredicates: PredicateRegistry = {
    "presence.away": {
      1: ({ state }) => stateValue(state, "presence") === "away",
    },
  };
  const kernelEnv: KernelEnv = {
    now: 10,
    rngState: 7,
    predicates: presencePredicates,
  };
  const ref: PredicateRef = { registryId: "presence.away", version: 1 };
  const pulse = event("pulse-1", "CadencePulse", 10);
  const futureScheduleIds = ["s-1", "s-2", "s-3"];

  const awayState = { presence: "away" };
  const away = guardQueuedPulse(
    awayState,
    pulse,
    kernelEnv,
    ref,
    futureScheduleIds,
  );
  assert.deepEqual(away, {
    state: awayState,
    intents: [],
    schedules: [],
    cancelledScheduleIds: [],
    trace: {
      reactorId: "presence-guard",
      reactorVersion: "1",
      branchPath: ["queued-pulse", "active"],
      envInputs: ["operatorPresence"],
      cadenceEvaluations: [],
    },
  });

  const returnedState = { presence: "returned" };
  const returned = guardQueuedPulse(
    returnedState,
    pulse,
    kernelEnv,
    ref,
    futureScheduleIds,
  );
  assert.deepEqual(returned, {
    state: returnedState,
    intents: [
      {
        kind: "NoOp",
        reason: "operator returned",
        evidence: ["pulse-1"],
        reevaluation: { kind: "Once", at: 10 },
        usefulWhen: { registryId: "presence.away", version: 1 },
      },
    ],
    schedules: [],
    cancelledScheduleIds: ["s-1", "s-2", "s-3"],
    trace: {
      reactorId: "presence-guard",
      reactorVersion: "1",
      branchPath: ["queued-pulse", "noop"],
      envInputs: ["operatorPresence"],
      cadenceEvaluations: ["cancel:s-1", "cancel:s-2", "cancel:s-3"],
    },
  });
  const noop = returned.intents[0];
  assert.ok(
    noop !== undefined && noop.kind === "NoOp",
    "exactly one NoOp intent",
  );
  assert.equal(returned.intents.length, 1);
  assert.equal(
    noop.usefulWhen,
    ref,
    "usefulWhen must be the caller's predicate ref",
  );
  assert.equal(
    returned.cancelledScheduleIds,
    futureScheduleIds,
    "cancelledScheduleIds must be the full futureScheduleIds array",
  );
});

test("AC5 row 5 evidence: the predicate registry is really consulted, once, with the pulse as context event", () => {
  const calls: (Event | undefined)[] = [];
  const counting: PredicateRegistry = {
    "presence.away": {
      1: (context) => {
        calls.push(context.event);
        return stateValue(context.state, "presence") === "away";
      },
    },
  };
  const kernelEnv: KernelEnv = { now: 10, rngState: 7, predicates: counting };
  const pulse = event("pulse-2", "CadencePulse", 10);
  const decision = guardQueuedPulse(
    { presence: "away" },
    pulse,
    kernelEnv,
    { registryId: "presence.away", version: 1 },
    ["s-1"],
  );
  assert.equal(calls.length, 1, "predicate must run exactly once");
  assert.equal(
    calls[0],
    pulse,
    "predicate must receive the pulse as context.event",
  );
  assert.deepEqual(decision.trace.branchPath, ["queued-pulse", "active"]);
});

test("B4 regression: episode and workstream commandId namespaces cannot collide, and both commands survive replay", () => {
  const epId = commandId("wsA", "wsB", 3, 0);
  const wsId = commandId("wsB", undefined, 3, 0);
  assert.notEqual(epId, wsId);
  assert.equal(epId, "cmd_9f0a119f70ab47ff");
  assert.equal(wsId, "cmd_bc1ac4ef335409c4");
  assert.equal(commandId("ws", "", 3, 0), commandId("ws", undefined, 3, 0));
  assert.equal(commandId("ws", "", 3, 0), "cmd_030cb49f8b1f142c");

  const commandA: Command = {
    commandId: epId,
    episodeId: "wsB",
    workstreamId: "wsA",
    intent: { kind: "Act", effect: "write", payload: "A" },
  };
  const commandB: Command = {
    commandId: wsId,
    workstreamId: "wsB",
    intent: { kind: "Act", effect: "write", payload: "B" },
  };
  const recovered = replayOutbox([
    event("p-A", "CommandPersisted", 1, {
      command: commandA as unknown as JsonValue,
    }),
    event("p-B", "CommandPersisted", 2, {
      command: commandB as unknown as JsonValue,
    }),
  ]);
  const expected: OutboxState = {
    entries: {
      [epId]: { command: commandA, status: "pending" },
      [wsId]: { command: commandB, status: "pending" },
    },
  };
  assert.deepEqual(recovered, expected);
  assert.deepEqual(
    pendingCommands(recovered).map((pending) => pending.commandId),
    [epId, wsId],
  );
});

test("B4 regression: null and malformed payloads replay without crashing and persist nothing", () => {
  const replayed = replayOutbox([
    event("n-1", "CommandPersisted", 1, null),
    event("n-2", "CommandResult", 2, null),
    event("n-3", "CommandPersisted", 3, { command: null }),
    event("n-4", "CommandPersisted", 4, { command: ["not", "a", "command"] }),
    event("n-5", "CommandPersisted", 5, {
      command: { commandId: 7, workstreamId: "ws" },
    }),
    event("n-6", "CommandPersisted", 6, {
      command: { commandId: {}, workstreamId: "ws" },
    }),
    event("n-7", "CommandPersisted", 7, {
      command: { commandId: "", workstreamId: "ws" },
    }),
    event("n-8", "CommandPersisted", 8, { noCommandHere: true }),
    event("n-9", "CommandResult", 9, 42),
  ]);
  assert.deepEqual(replayed, { entries: {} });

  const nullResult = applyCommandResult(
    emptyOutbox(),
    event("n-10", "CommandResult", 10, null),
  );
  assert.deepEqual(nullResult.state, { entries: {} });
  assert.deepEqual(nullResult.trace.branchPath, ["result", "unknown"]);
  const numberResult = applyCommandResult(
    emptyOutbox(),
    event("n-11", "CommandResult", 11, 42),
  );
  assert.deepEqual(numberResult.state, { entries: {} });
  assert.deepEqual(numberResult.trace.branchPath, ["result", "unknown"]);
});
