import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as kernel from "../../packages/kernel/dist/src/index.js";
import { event } from "./wo103-authority-lib.mjs";
import {
  outboxOracle,
  sweepOutbox,
  ordersFor,
  outboxCount,
  OUTBOX_FACTORS,
  PERMUTATION_POLICY,
  completeCommand,
} from "./wo103-outbox-lib.mjs";
import { ROOT } from "./generate-authority-corpus.mjs";
const manifest = JSON.parse(
  readFileSync(`${ROOT}/corpus/manifests/WO-103.json`, "utf8"),
);

test("WO-103 exact capped outbox permutations, both projections and duplicate delivery", () => {
  const result = sweepOutbox(kernel);
  assert.equal(result.count, outboxCount());
  assert.equal(result.count * 2, manifest.outbox.expectedRuns);
  assert.equal(result.sha256, manifest.outbox.expectedStreamSha256);
  assert.deepEqual(result.classifications, manifest.outbox.classifications);
  assert.equal(
    result.findingCounts.incompletePending,
    manifest.outbox.incompletePendingCells,
  );
  assert.ok(result.findingCounts.incompletePending > 0);
  assert.ok(manifest.findingNumbers.includes("WO-103-F003"));
  if (result.findingCounts.divergence) {
    assert.ok(manifest.findingNumbers.includes("WO-103-F005"));
    assert.equal(result.findingCounts.divergence, manifest.outbox.divergences);
  } else assert.equal(manifest.outbox.divergences, 0);
});

test("WO-103 outbox oracle planted accepted, dedup, unknown and retroactive orphan traces", () => {
  const command = {
    commandId: "cmd-a",
    workstreamId: "ws",
    intent: { kind: "Act", effect: "act", payload: {} },
  };
  const persist = event("p", "CommandPersisted", { command });
  const result = event("r1", "CommandResult", { commandId: "cmd-a" });
  const later = event("r2", "CommandResult", { commandId: "cmd-a" });
  const orphan = event("orphan", "CommandResult", { commandId: "absent" });
  const known = [
    [
      [persist, result, later, orphan],
      ["accepted", "dedup", "unknown"],
    ],
    [
      [result, later, persist, orphan],
      ["preceded-persist", "dedup", "unknown"],
    ],
  ];
  for (const [events, branches] of known) {
    const expected = outboxOracle(events);
    assert.deepEqual(
      expected.traces.map((t) => t.branchPath[1]),
      branches,
    );
    assert.deepEqual(
      kernel.replayOutbox(events, { includeTraces: true }),
      expected,
    );
    assert.equal(expected.state.entries["cmd-a"].resultEventId, "r1");
    assert.deepEqual(kernel.pendingCommands(expected.state), []);
  }
  const state = kernel.persistCommand(kernel.emptyOutbox(), command);
  assert.equal(
    kernel.persistCommand(state, { ...command, replacement: true }),
    state,
  );
  const completed = kernel.applyCommandResult(state, result);
  assert.equal(
    kernel.persistCommand(completed.state, command),
    completed.state,
  );
  assert.deepEqual(kernel.applyCommandResult(completed.state, persist).trace, {
    reactorId: "outbox",
    reactorVersion: "1",
    branchPath: ["result", "ignored-event-type"],
    envInputs: ["eventType"],
    cadenceEvaluations: [],
  });
  assert.equal(completeCommand({ commandId: "bad" }), false);
});

test("WO-103 permutation caps and declared factor product are exact, seeded and unique", () => {
  assert.equal(ordersFor(4).length, 24);
  assert.equal(ordersFor(6).length, 720);
  assert.equal(ordersFor(8).length, 128);
  for (const size of [4, 6, 8]) {
    const orders = ordersFor(size);
    assert.equal(new Set(orders.map((o) => o.join(","))).size, orders.length);
    for (const order of orders)
      assert.deepEqual(
        [...order].sort((a, b) => a - b),
        Array.from({ length: size }, (_, i) => i),
      );
  }
  assert.notDeepEqual(ordersFor(8, "alternative-test-seed"), ordersFor(8));
  const factors = Object.values(OUTBOX_FACTORS).reduce(
    (n, levels) => n * levels.length,
    1,
  );
  const orderSum = Object.values(PERMUTATION_POLICY.alphabetSizes).reduce(
    (n, size) => n + ordersFor(size).length,
    0,
  );
  assert.equal(factors * orderSum, manifest.outbox.expectedOrders);
});
