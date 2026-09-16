# WO-134 — Planning-pass selection: the refutation helpers resolve the current dated pass without depending on ledger insertion order, and a regression test covers two passes sharing one calendar day (v0.23.0)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor any; verifier any; reviewer any.
**Release classification:** patch. Two planning helper scripts and one
added test case change; no contract, schema, predicate or envelope changes;
no product document changes. Assigned at activation under the standing
opt-out default.
**Cost:** adds no recurring step, check, receipt, hook, key or ritual; adds
one test case to an existing suite. It removes an operator correction per
same-day planning pass and removes the silent wrong-pass selection that
currently depends on a documented but unchecked ledger convention.

**Nomination provenance:** candidates 2 and 9 of
[the planning map](../planning/work-order-map.md#candidates--release-close-and-planning-dispatch-defects-recorded-2026-09-16),
recorded 2026-09-16 from the v0.23.0 release-close attempt. The patch under
review is already on `main` at `fbfcde0`, carried there by a document-only
planning dispatch; this order supplies the review and the test it never had.

**Depends on:** nothing. It reviews source already merged.

**Recommended placement:** ahead of the WO-068 release close, which cannot
tag until a reviewer gate covers the source now on `main`.

**Cites (read these sections):** `scripts/lib/plan-direct.mjs`
`latestPlanningPass`; `scripts/refute-plan.mjs` the `refute` transport
branch; `scripts/lib/plan-subject.mjs` `planningPasses`;
`scripts/lib/plan-receipts.mjs` `checkPlanGate`;
`docs/lineage/idea-ledger.md` header (the declared newest-first order);
`docs/work-orders/WO-084-ledger-order-and-index.md`.

**Objective:** `npm run plan -- refute` selects the same pass that
`checkPlanGate` demands a receipt for, on any day, without either helper
depending on where a section was inserted in the ledger.

**Observed gap (dated 2026-09-16, `main` at `fbfcde0`, v0.23.0 unreleased):**
Both helpers sorted dated ledger headings by date alone. `Array.prototype.sort`
is stable, so two passes sharing a calendar day resolved to whichever heading
appeared first in the file, while `checkPlanGate` demanded a receipt for the
pass it identified independently. On 2026-09-16 that made the plan gate
unsatisfiable through the supported commands: `plan -- check` asked for a
receipt for `planning-496d3a8cf6dab3e9` and `plan -- refute` could only ever
aim at `planning-8f6dda8f556e7e98`, which already held receipt 014, so it
stopped with "one judgment per pass". The shipped patch breaks the tie on
ledger position. That is correct only while the ledger obeys its declared
newest-first order, and `WO-084:53` records that nothing checks that order.

**Design (scope discipline):** the two helpers share one selection rule.
Prefer deriving the current pass from something already checked — the
receipt chain, or the pass set `checkPlanGate` computes — over a second
ordering convention. If ledger position is retained, the two helpers must
read it through one shared function, not two copies. No new hook, gate,
command or document surface.

**Deliverables:** the shared selection rule; its regression test; no
generated output changes.

**Acceptance criteria (all required)**

1. Fixture: a ledger with two dated planning-pass headings on one calendar
   date, in both insertion orders, selects the same pass that
   `checkPlanGate` demands a receipt for, in both orders.
2. Fixture: the selected pass is unchanged when the two same-day sections
   are swapped, or the dependence on position is removed entirely.
3. `scripts/lib/plan-direct.mjs` and `scripts/refute-plan.mjs` express the
   rule once; neither carries a private copy of the comparator.
4. A single-pass ledger and a multi-date ledger keep their current
   selection; existing receipts 001 to 015 remain admissible and their
   judged subjects are unchanged.
5. `npm run test:docs` green, including `plan` and
   `plan-refutation-current`.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test` once at final
review, recorded as the reviewer product-gate row.

**Write-back duty:** sources and reopening conditions in the order's
decisions record. Dispose candidates 2 and 9 in the planning map when the
rule no longer depends on the unchecked ledger convention. Introduce no
capability id: this order adds no capability, and a new id is a planning
claim, not an execution write-back (candidate 1).

**Non-goals:** enforcing the ledger insertion rule, which is WO-084; any
change to receipt format, subject composition or the continuation gate; any
document reorganization; any new capability row.

**Operator-review assumptions**

1. v0.23.0 is the right target: the patch is already on `main` beside the
   resident, so one tag covers both.
2. Reviewing source already merged is acceptable here because the merge
   was the defect; the alternative is an override of the closed phase.
