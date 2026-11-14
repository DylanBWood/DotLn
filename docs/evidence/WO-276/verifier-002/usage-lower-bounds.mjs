import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { dayUse } from "../../../../scripts/lib/meta.mjs";
import { renderDailyUse } from "../../../../packages/skeleton/dist/src/observed-facts.js";
const now = new Date("2026-11-12T15:00:00.000Z");
const prices = {
  "model-a": { uncachedInput: 3, cacheRead: 0.3, cacheWrite: 3.75, output: 15 },
};
const row = (
  role,
  at,
  tokens,
  source = "claude-transcript-message-usage",
  scope = "dispatch",
) => ({
  workOrder: "WO-999",
  role,
  series: role + " " + at,
  model: "model-a",
  recordedAt: at,
  observation: { source, scope, observedAt: at, usage: tokens },
});
const read = (rows) =>
  dayUse(process.cwd(), { now, timeZone: "UTC", rows, prices });
const measured = row("executor", "2026-11-12T10:00:00.000Z", {
  inputTokens: 20_000_000,
  cachedInputTokens: 0,
  cacheWriteInputTokens: 0,
  outputTokens: 0,
  totalTokens: 20_000_000,
});
const unknown = (role) => row(role, "2026-11-12T12:00:00.000Z", null);
const priced = read([measured]),
  same = read([measured, unknown("executor")]),
  different = read([measured, unknown("reviewer")]);
assert.equal(priced.pricedUsd, 60);
assert.equal(same.pricedUsd, 0);
assert.equal(different.pricedUsd, 60);
const priceLines = [priced, same, different].map((use) =>
  renderDailyUse({ usd: 50 }, use),
);
assert.match(priceLines[0], /daily figure is reached/u);
assert.doesNotMatch(priceLines[1], /daily figure is reached/u);
assert.match(priceLines[2], /daily figure is reached/u);
const codex = row(
  "executor",
  "2026-11-12T10:00:00.000Z",
  { inputTokens: 1000, outputTokens: 20, totalTokens: 1020 },
  "codex-result-envelope",
);
const tokenControl = read([codex]),
  tokenPartial = read([codex, unknown("reviewer")]);
assert.equal(tokenControl.totalTokens, 1020);
assert.equal(tokenPartial.totalTokens, 20);
const tokenLines = [tokenControl, tokenPartial].map((use) =>
  renderDailyUse({ tokens: 100 }, use),
);
assert.match(tokenLines[0], /daily figure is reached/u);
assert.doesNotMatch(tokenLines[1], /daily figure is reached/u);
writeFileSync(
  process.argv[2],
  JSON.stringify(
    {
      dollars: {
        control: priced,
        sameRole: same,
        differentRole: different,
        printed: priceLines,
      },
      tokens: {
        control: tokenControl,
        partial: tokenPartial,
        printed: tokenLines,
      },
      limit:
        "Pure production aggregation with supported usage observations; renderer uses gate-built distribution corresponding to standing subject.",
    },
    null,
    2,
  ) + "\n",
);
