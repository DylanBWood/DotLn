import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { verificationKnownIssues } from "../../../../../scripts/lib/verification-briefing.mjs";
const scratch = process.argv[2],
  cases = [];
for (const [name, findings] of [
  ["missing", undefined],
  ["null", null],
  ["object", {}],
  ["explicit-empty", []],
]) {
  const root = realpathSync(mkdtempSync(join(scratch, "ver005-receipt-")));
  mkdirSync(join(root, "docs/work-orders"), { recursive: true });
  mkdirSync(join(root, "docs/planning/refutations"), { recursive: true });
  const state = {
    workOrderId: "WO-187",
    workOrderPath: "docs/work-orders/WO-187-fixture.md",
  };
  writeFileSync(
    join(root, state.workOrderPath),
    "# WO-187 — fixture\n\n**Known issues and carry-ins:** Order sentinel.\n\n**Non-goals:** None.\n",
  );
  const old = {
    schemaVersion: "plan-refutation-receipt-v1",
    pass: { kind: "planning" },
    ordinal: 1,
    receiptId: "2030-01-01-planning-fixture-001",
    result: {
      orders: [
        {
          workOrderId: "WO-187",
          findings: [
            {
              kind: "known-issue",
              criterionId: "criterion:2",
              reason: "Earlier receipt sentinel.",
              reopenWhen: "Reproduction.",
            },
          ],
        },
      ],
    },
  };
  writeFileSync(
    join(root, `docs/planning/refutations/${old.receiptId}.json`),
    JSON.stringify(old),
  );
  const before = verificationKnownIssues(root, state);
  const next = {
    ...old,
    ordinal: 2,
    receiptId: "2030-01-01-planning-fixture-002",
    result: {
      orders: [
        {
          workOrderId: "WO-187",
          ...(findings === undefined ? {} : { findings }),
        },
      ],
    },
  };
  writeFileSync(
    join(root, `docs/planning/refutations/${next.receiptId}.json`),
    JSON.stringify(next),
  );
  const after = verificationKnownIssues(root, state);
  cases.push({
    name,
    before,
    after,
    receiptSentinelBefore: before.includes("Earlier receipt sentinel"),
    receiptSentinelAfter: after.includes("Earlier receipt sentinel"),
    hasUnavailableAdvisory: after.includes("unavailable"),
  });
}
writeFileSync(
  "docs/evidence/WO-187/verification-005/adversary-receipts.json",
  JSON.stringify({ observedAt: new Date().toISOString(), cases }, null, 2) +
    "\n",
);
console.log(
  JSON.stringify(
    cases.map(
      ({
        name,
        receiptSentinelBefore,
        receiptSentinelAfter,
        hasUnavailableAdvisory,
      }) => ({
        name,
        receiptSentinelBefore,
        receiptSentinelAfter,
        hasUnavailableAdvisory,
      }),
    ),
    null,
    2,
  ),
);
