# WO-089 — Capability table fold: the dated addenda fold into the rows they reassess, the missing verification row is added, and no level exceeds what a cited passing final review supports (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One document fold with a migration note.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-035's capability-table item, cut into a
bounded child at the operator's 2026-09-08 correction. Planner-synthesized
draft. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** none open (a dated planning deferral until WO-053 closes or
the operator waives it).
**Recommended placement:** any free lane under the deferral; it edits
`docs/planning/capability-table.md` only. Note that the plan-refutation
subject reads the table's rows, so the fold changes the subject hash. A
recommendation, not a dependency token.

**Cites (read these sections):** `docs/planning/capability-table.md` (the
rows and the seven addenda); `docs/final-reviews/` (the verdicts that bound
each level); `scripts/lib/plan-subject.mjs` (the capability cells).

**Objective:** Fold each dated addendum into the row it reassesses using the
`Last change` column, add the missing WO-010 row, keep the historical
assessment text under a dated migration note, and promote no level without
the evidence the addenda already cite.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Seven addenda and a missing row; transports and verification still read
  level 0 in the rows.

**Design (scope discipline):**

- One row per capability; the migration note preserves the prior text.

**Deliverables:** the fold, the note, the write-backs below.

**Acceptance criteria (all required)**

1. One row per capability with the addenda folded; the WO-010 row exists;
   each level cites a passing final review or stays where it was.
2. Write-backs land: ledger entry.
3. `npm test` green; `git diff --check` clean.

**Evidence gate:** the diff; `npm test`.

**Write-back duty:** as listed in criterion 2.

**Non-goals:** new capabilities.

**Operator-review assumptions**

1. The fold is bookkeeping, not assessment.
