# WO-283 — Planning stops writing a table of past costs that nobody acts on (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. `npm run meta -- --plan-cost` and
`docs/planning/cost-table.json` are removed; a planning pass no longer
writes the table, the plan's review is no longer handed it, and a receipt
is no longer refused for it. Receipts filed with the table keep reading.
Assigned at activation under the standing opt-out default.
**Cost:** removes one command, one committed file, its reader in the
planning subject, its observations in the review prompt and their cases
(estimates: a few hundred lines of code and tests); adds one compatibility
case for receipts filed with the table. It removes a step every planning
pass pays and a check that stopped every pass on 2026-11-15. One complete
review run at final review. Tokens and steps are unknown until run.
**Nomination provenance:** the operator's direction under `operator
override:` during the 2026-11-14 planning pass (journal digest
`64eb6b4d1af2c7b18a708534c035d34e8bd3af7de12326c560e8a036e586c075`) and the
messages after it (captured in ignored intake by their journal rows), in
paraphrase: what no one can show to be useful does not stay. The pass could
not show the table useful: no decision reads it, and its size limit stopped
every planning pass. Clean-room screen: core's own tooling.
**Depends on:** none.
**Recommended placement:** second, after WO-277.
**Cites (read these sections):** `scripts/meta.mjs` (`--plan-cost`);
`scripts/lib/meta.mjs` (`planCostTable`, `planCostText`);
`scripts/lib/plan-subject.mjs` (the `costTable` option, the table's reader,
`costEvidenceStatus`); `scripts/lib/plan-receipts.mjs` (the prefetch of the
table, receipt validation); `scripts/lib/plan-direct.mjs`; product 07
§Operator-opened planning pass (the Standard artifacts bullet on
`--plan-cost`); the 2026-11-14 pass's Validation section.
**Objective:** A planning pass writes no table of past costs and its review
reads none; `npm run plan -- check`, `npm run plan -- refute` and `npm run
plan -- receipt` work without the file; every receipt filed with the table
before this order still validates against its own committed sources.

**Observed gap (dated 2026-11-15 at the planning branch's `a3cdfaf2b`):**

1. A pass must run `npm run meta -- --plan-cost` after its subject changes,
   and a receipt is refused while the table is stale
   (`scripts/lib/plan-subject.mjs`, "Planning cost evidence is stale").
2. The table holds the meter's data for the last five closed orders and the
   dated acceptances, nothing about the plan being judged beyond one row per
   order; its trap signals reach the review prompt as observations, and no
   rule or check acts on them ("cost shortfalls become planning input and
   never create an automatic structural hold", product 07).
3. Its 64 KB size limit refused every planning pass once WO-276's record
   entered the meter's window, and was removed under the operator's
   override on 2026-11-15 to let the 2026-11-14 pass finish.

**Design (scope discipline):**

- Remove the writer, the file, the reader and the prompt's observations
  together, and keep historical receipts valid: a receipt filed with the
  table validates against the table at its own committed revision, as
  every receipt's subject is rebuilt at its revision today. Rejected:
  shrinking the table to the plan's own orders (axis: purpose; the operator
  asked for what is not useful to go, and no decision reads even the
  smaller table).

**Execution plan (the executor follows these steps in order; observed at
`a3cdfaf2b`, 2026-11-15):**

1. `scripts/lib/plan-subject.mjs`: the subject no longer reads the table
   for a current subject; a historical receipt's rebuild at its revision
   reads it when that revision holds it. Cases in
   `scripts/test-plan-refutation.mjs`. Check: `npm test -- --only
   plan-refutation`.
2. `scripts/lib/plan-receipts.mjs` and `scripts/lib/plan-direct.mjs`: no
   prefetch or prompt observation of the table for a new receipt. Check:
   `npm test -- --only plan-refutation`.
3. `scripts/meta.mjs` and `scripts/lib/meta.mjs`: `--plan-cost`,
   `planCostTable` and `planCostText` removed; `scripts/test-process-debt.mjs`
   loses their cases. Check: `npm test -- --only process-debt` and `npm test
   -- --only meta`.
4. `git rm docs/planning/cost-table.json`; product 07's Standard artifacts
   bullet on `--plan-cost` removed. Check: `npm run test:docs`.
5. Write-backs: `docs/evidence/WO-283/decisions.md` and the regenerated
   decisions index. Then the handoff sequence of product 07 §Discipline.

**Deliverables:** the removed command, file, reader and observations; the
historical-receipt case; the decisions.

**Acceptance criteria (all required)**

1. With `docs/planning/cost-table.json` absent, `npm run plan -- check`
   passes on this repository and a fixture pass files its receipt through
   `npm run plan -- receipt` (`npm test -- --only plan-refutation`).
2. Every receipt under `docs/planning/refutations/` filed before this order
   still validates (`npm run plan -- check`).
3. `npm run meta -- --plan-cost` is refused as an unknown option, and no
   standing document names it (`npm run test:docs`).
4. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only plan-refutation`, `npm test -- --only
process-debt`, `npm test -- --only meta`, `npm test -- --only
launchpad-planning` and `npm test -- --only configuration-root`; the
structural phase; the complete run with `npm test -- --review` at final
review.

**Evidence gate:** under `docs/evidence/WO-283/`: the receipt check over
every historical receipt; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** the decisions and the index; the release's Read before
upgrading says a planning pass no longer writes the table and an
instance's file can be deleted.

**Known issues and carry-ins:** until WO-278 lands, the first round is
launched as WO-276-D118 records.

**Non-goals:** the order's own `Cost:` line, which is the planner's estimate
and stays; the meter's other uses (`npm run meta`'s health line).

**Operator-review assumptions:** none beyond the order's text.
