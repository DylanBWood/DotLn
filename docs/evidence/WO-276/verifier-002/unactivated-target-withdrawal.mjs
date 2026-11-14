import assert from "node:assert/strict";
import {
  writeFileSync,
  mkdirSync,
  readFileSync,
  appendFileSync,
} from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { withFixture } from "../../../../scripts/lib/target-worktree-fixture.mjs";
import { readIndex } from "../../../../scripts/work-orders.mjs";
let output;
withFixture((f) => {
  mkdirSync(join(f.main, "records/planning"), { recursive: true });
  writeFileSync(
    join(f.main, "records/planning/work-order-map.md"),
    "# Plan\n\n<!-- dotln-work-order-sequence:start -->\n\n<!-- dotln-work-order-sequence:end -->\n",
  );
  const before = readIndex(f.main, []);
  assert.ok(before.rows.some((r) => r.id === "WO-999"));
  const capture = "records/intake/abandon.txt",
    words = "Fixture operator: abandon this target order before activation.\n";
  appendFileSync(join(f.main, ".gitignore"), "\n/records/intake/\n");
  mkdirSync(join(f.main, "records/intake"), { recursive: true });
  writeFileSync(join(f.main, capture), words);
  const result = f.call(f.main, f.main, "resume", [
    "withdraw",
    "--work-order",
    "WO-999",
    "--disposition",
    "abandoned",
    "--reason",
    "set aside before activation",
    "--capture",
    capture,
    "--capture-hash",
    "sha256:" + createHash("sha256").update(words).digest("hex"),
    "--harness",
    "human",
    "--harness-version",
    "not-applicable",
    "--model",
    "human",
    "--effort",
    "unknown",
    "--source",
    "operator-attested",
  ]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const events = readFileSync(
    join(f.main, "records/state/orders/WO-999.jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "WorkOrderWithdrawn");
  let error = null;
  try {
    readIndex(f.main, []);
  } catch (e) {
    error = e.message;
  }
  assert.match(error, /control repository identity differs/u);
  output = {
    beforeIndexRead: true,
    withdrawalExit: result.status,
    eventType: events[0].type,
    hasRepositoryId: Object.hasOwn(events[0], "repositoryId"),
    hasBaseCommit: Object.hasOwn(events[0], "baseCommit"),
    indexError: error,
    limit:
      "Real withdrawal CLI in local target fixture, followed by actual index reader; no real order was withdrawn.",
  };
});
writeFileSync(process.argv[2], JSON.stringify(output, null, 2) + "\n");
