import { promptSupport } from "./prompt-support.js";

/** Shared behavior; measurement machinery and mandatory evidence remain separate. */
export const processCost = promptSupport(
  "process-cost",
  "Process Cost",
  "Process Cost: At entry/handoff run `node scripts/harness.mjs usage <session>`. Report total, source, scope and cutoff; fix collection errors. Final counters stay in ignored receipts and the response. Compare equivalent outcomes including work and waiting; name tradeoffs, invent no counts.",
);
