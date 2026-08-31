import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { decodeLog, encodeLog, replayOutbox, pendingCommands } from "@dotln/kernel";
import { compileWorkOrder, expectedInspectCommandId, loadout, replayScenario, runScenario, type FixtureTree } from "../src/scenario.js";

const fixture = JSON.parse(await readFile(fileURLToPath(new URL("../../fixtures/repo-tree.json", import.meta.url)), "utf8")) as FixtureTree;

test("the 13-step live scenario and JSONL replay have identical decision traces", () => {
  const live = runScenario(fixture);
  const replayed = replayScenario(live.log, fixture);
  assert.deepEqual(replayed.traces, live.traces);
  assert.deepEqual(replayed.timeline, live.timeline);
  assert.equal(live.workOrder.workOrderId, "wo_repo_inspection_1");
  assert.deepEqual(Object.keys(live.workOrder).sort(), ["acceptanceCriteria", "allowedOperations", "baseCommit", "constraints", "decisions", "knownFacts", "nonGoals", "objective", "outputContract", "prohibitedOperations", "repo", "requiredEvidence", "workOrderId"]);
  assert.equal(live.verified, true);
  assert.match(live.glyphScene, /🐛.*dormant.*inverted\/refused.*verified.*phase:returned.*faded\/cancelled/u);
  const tampered = decodeLog(live.log).map(event => event.type === "DecisionRecorded" ? { ...event, payload: { trace: { reactorId: "forged" } } } : event);
  assert.deepEqual(replayScenario(encodeLog(tampered), fixture).traces, live.traces, "replay must recompute rather than trust stored trace payloads");
});

test("loadout is a causal, explicitly provisional input to WorkOrder compilation", () => {
  assert.equal(compileWorkOrder(loadout).decisions[0], "Repo Gardener uses Seiri");
  assert.throws(() => compileWorkOrder({ ...loadout, semantics: loadout.semantics.filter(value => value !== "never delete") }), /unsupported loadout/);
});

test("the canonical thirteen scenario milestones occur in exact order", () => {
  const types = decodeLog(runScenario(fixture).log).map(event => event.type);
  const milestones = ["InspectionTaskCreated", "LoadoutEquipped", "OperatorPresenceChanged", "CadencePulse", "WorkOrderEmitted", "CommandPersisted", "CommandResult", "DeletionAttempted", "CommandRefused", "EpisodeTerminated", "VerificationCompleted", "OperatorPresenceChanged", "QueuedPulseNoOp"];
  let cursor = -1;
  for (const type of milestones) { const next = types.indexOf(type, cursor + 1); assert.ok(next > cursor, `${type} must follow the prior milestone`); cursor = next; }
  const expectedCounts: Readonly<Record<string, number>> = { InspectionTaskCreated: 1, LoadoutEquipped: 1, OperatorPresenceChanged: 2, CadencePulse: 2, WorkOrderEmitted: 1, CommandPersisted: 1, CommandResult: 1, DeletionAttempted: 1, CommandRefused: 1, EpisodeTerminated: 1, VerificationCompleted: 1, QueuedPulseNoOp: 1 };
  for (const [type, count] of Object.entries(expectedCounts)) assert.equal(types.filter(candidate => candidate === type).length, count, `${type} multiplicity`);
});

test("step 9 attempts deletion exactly once and receives structural refusal", () => {
  const result = runScenario(fixture);
  const refusals = decodeLog(result.log).filter(event => event.type === "CommandRefused");
  assert.equal(refusals.length, 1);
  assert.equal(decodeLog(result.log).filter(event => event.type === "DeletionAttempted" && (event.payload as { effect?: string }).effect === "repo.delete").length, 1);
  assert.deepEqual(refusals[0]?.payload, { intentIndex: 0, reason: "effect denied", authorityEnvelopeId: "auth_seiri" });
  assert.equal(result.adapterEffects, 1, "only inspection reaches the adapter");
});

test("step 12 folds return, guards the queued pulse, and executes declared cancellations", () => {
  const result = runScenario(fixture);
  const events = decodeLog(result.log);
  assert.deepEqual(result.cancelledScheduleIds, ["schedule_seiri_20m", "schedule_seiri_already_queued"]);
  assert.deepEqual(result.activeScheduleIds, [], "runtime scheduler executes both cancellations");
  assert.equal(events.filter(event => event.type === "QueuedPulseNoOp").length, 1);
  assert.deepEqual((events.find(event => event.type === "SchedulesCancelled")?.payload as { scheduleIds: readonly string[] }).scheduleIds, result.cancelledScheduleIds);
  assert.deepEqual(result.traces.at(-1)?.branchPath, ["queued-pulse", "noop"]);
});

test("row 1 crash+restart re-dispatches pending command while adapter dedupe prevents duplicate effect", () => {
  const normal = runScenario(fixture);
  const durableMarker = "reconstructed-from-persisted-log";
  const result = runScenario(fixture, {
    crashAfterPersist: true,
    recoveryLogTransform: persistedLog => encodeLog(decodeLog(persistedLog).map(event => {
      if (event.type !== "CommandPersisted") return event;
      const payload = event.payload as unknown as { command: { intent: { payload: { workOrder: { baseCommit: string } } } } };
      return {
        ...event,
        payload: {
          command: {
            ...(event.payload as unknown as { command: object }).command,
            intent: {
              ...(payload.command.intent as unknown as object),
              payload: {
                ...(payload.command.intent.payload as unknown as object),
                workOrder: { ...payload.command.intent.payload.workOrder, baseCommit: durableMarker },
              },
            },
          },
        },
      };
    })),
  });
  assert.equal(expectedInspectCommandId, "cmd_5ee0c6d8e207bd25");
  assert.equal(result.adapterDispatches.length, 2, "restart redispatch plus duplicate delivery are both observable");
  assert.deepEqual(result.adapterDispatches, [expectedInspectCommandId, expectedInspectCommandId]);
  assert.equal(
    ((result.recoveredCommands[0]?.intent.payload as { workOrder?: { baseCommit?: string } }).workOrder?.baseCommit),
    durableMarker,
    "the re-dispatched command must be reconstructed from durable log state",
  );
  assert.equal(result.adapterEffects, 1, "recovery dispatch plus normal dispatch produce one adapter effect");
  assert.deepEqual({ candidates: result.candidates, verified: result.verified, traces: result.traces, cancelled: result.cancelledScheduleIds }, { candidates: normal.candidates, verified: normal.verified, traces: normal.traces, cancelled: normal.cancelledScheduleIds });
  assert.deepEqual(pendingCommands(replayOutbox(decodeLog(result.log))), []);
  const persisted = decodeLog(result.log).find(event => event.type === "CommandPersisted");
  assert.equal((persisted?.payload as { command: { commandId: string } }).command.commandId, expectedInspectCommandId);
});
