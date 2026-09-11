import { performance } from "node:perf_hooks";
import { main as workOrders } from "../work-orders.mjs";
import { writeDecisionsIndex } from "./meta.mjs";
import { syncFollowups } from "./planning-followups.mjs";
import { emitHarness } from "./harness.mjs";

// The package command builds first. Refresh only these owned, deterministic
// projections before capturing the evidence tree. Historical observations,
// publication locks and release versions remain explicit review inputs.
export function prepareHarnessEvidence(root) {
  const started = performance.now();
  workOrders(["index"], root);
  writeDecisionsIndex(root);
  syncFollowups(root);
  emitHarness(root, { termsRoot: root });
  return { durationMs: performance.now() - started };
}
