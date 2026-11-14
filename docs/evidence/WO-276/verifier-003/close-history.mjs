// Re-verification of VER-002: retained reproducer with repaired expectations.
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { withFixture } from "../../../../scripts/lib/target-worktree-fixture.mjs";
import { write } from "../../../../scripts/lib/helpers.mjs";
import { routeFacts } from "../../../../scripts/lib/drive-route.mjs";
import { readCloseHistory } from "../../../../scripts/release.mjs";
let result;
withFixture((f) => {
  f.mapClone();
  f.start();
  const state = {
    phase: "closed",
    workOrderId: "WO-999",
    repositoryId: "target",
  };
  const file = "records/state/local/retained/WO-999/release-close.json";
  const settled = {
    schemaVersion: 1,
    workOrderId: "WO-999",
    dryRun: false,
    publication: {
      outcome: "not-attempted",
      target: {
        repositoryId: "target",
        policy: "declared",
        outcome: "published",
      },
    },
    cleanup: { outcome: "clean", branch: { outcome: "deleted" } },
    targetCleanup: { outcome: "removed" },
  };
  write(f.main, file, JSON.stringify(settled));
  const rows = [
    { attempt: 0, released: routeFacts(f.orderRoot, state, []).released },
  ];
  assert.equal(rows[0].released, true);
  for (let n = 1; n <= 20; n++) {
    // The real close writer takes its enumerable history from this function
    // and keeps recoveryAttempts non-enumerable, so those do not serialize.
    const { recoveryAttempts, ...history } = readCloseHistory(f.main, "WO-999");
    const later = {
      schemaVersion: 1,
      workOrderId: "WO-999",
      dryRun: true,
      publication: { outcome: "not-attempted" },
      cleanup: { outcome: "not-attempted" },
      ...history,
    };
    write(f.main, file, JSON.stringify(later));
    rows.push({
      attempt: n,
      released: routeFacts(f.orderRoot, state, []).released,
      inlineAttempts: history.previousAttempts.length,
      archiveCount: history.archivedAttempts.length,
      settledStillRecoverable: recoveryAttempts.some(
        (a) => a.publication?.target?.outcome === "published",
      ),
    });
  }
  assert.equal(rows[8].released, true);
  assert.ok(rows.every((row) => row.released));
  assert.equal(rows[9].settledStillRecoverable, true);
  result = {
    scenario:
      "One settled target close followed by twenty dry-run attempts, using the real close-history producer and router reader",
    rows,
  };
});
writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
