import { promptSupport } from "./prompt-support.js";

/** Shared behavior; measurement remains advisory. */
export const processCost = promptSupport(
  "process-cost",
  "Process Cost",
  "Process Cost: At entry/handoff run `node scripts/harness.mjs usage <session>`. Report available total, source, scope and cutoff; unavailable counters are unknown and never block completion. Final counters stay in ignored receipts and the response. Compare equivalent outcomes including work and waiting; name tradeoffs, invent no counts.",
);
