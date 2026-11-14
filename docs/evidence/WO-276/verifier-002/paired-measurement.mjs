import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { pairedRoundReport } from "../../../../scripts/lib/plan-failures.mjs";
const report = pairedRoundReport(process.cwd());
const row = report.orders.find((order) => order.workOrder === "WO-276");
assert.equal(row.rounds, 2);
assert.deepEqual(
  row.perRound.map((r) => r.decision),
  ["WO-276-D081", "WO-276-D082"],
);
writeFileSync(
  process.argv[2],
  JSON.stringify(
    {
      observed: row,
      sourceObservation:
        "D081 describes a recheck; D082 describes a final combined delta round; D043 reserves roundFindings for paired first rounds, and D121 reports no paired round",
    },
    null,
    2,
  ) + "\n",
);
