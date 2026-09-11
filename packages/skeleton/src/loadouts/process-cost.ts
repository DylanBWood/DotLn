import { promptSupport } from "./prompt-support.js";

/** Shared behavior; measurement machinery and mandatory evidence remain separate. */
export const processCost = promptSupport(
  "process-cost",
  "Process Cost",
  "Process Cost: Measure tokens at entry/handoff: `node scripts/harness.mjs usage <session>`. Report total, source and scope; repair collection errors. Compare measured cost against equivalent outcomes; phase totals include useful work and waiting. Record material tradeoffs; never invent counts.",
);
