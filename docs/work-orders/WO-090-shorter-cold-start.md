# WO-090 — Shorter cold start: the execution guide keeps the executor's operating contract, the model-specific and sandbox paragraphs move with pointers, and the directed-load total per role is measured lower (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation relocation with a
measurement. Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-035's cold-start item and its 2026-09-06
redirect note, cut into a bounded child at the operator's 2026-09-08
correction. Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-039 merged (the directed-load measurement method,
criterion 6; closed). A dated planning deferral until WO-053 closes or the
operator waives it.
**Recommended placement:** any free lane under the deferral; it edits
product 07, `docs/AI-HARNESS-SECURITY.md` and the playbook. A
recommendation, not a dependency token.

**Cites (read these sections):** 07-execution-guide.md §Read order for a
cold start and §Model-specific notes; `docs/AI-HARNESS-SECURITY.md`;
`docs/PLAYBOOK.md`; `docs/evidence/WO-039/README.md` (criterion 6's
method); `scripts/harness-context.mjs`.

**Objective:** Reduce the guide to the executor's operating contract by
moving §Model-specific notes and the sandbox-approval paragraphs to the
harness security document and the playbook with pointers, retiring any
paragraph a generated skill or compiled unit already carries, and prove
with WO-039's method that every role's directed-load total is lower after
than before, with a relocation table naming where each paragraph went and
whether it was retired or relocated.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The guide was 804 lines at the sweep; the cold start for one order read
  about 1,340 lines with cited sections.

**Design (scope discipline):**

- Removal before pruning; a rule keeps a home; the line count is a
  consequence, not the measure.

**Deliverables:** the moves, the pointers, the table, the measurement, the
write-backs below.

**Acceptance criteria (all required)**

1. The directed-load total per role, measured by WO-039's method, is lower
   after than before for every role; no relocated paragraph is in a role's
   directed-read set unless it already was.
2. The relocation table accounts for every removed paragraph.
3. Write-backs land: 07 §Read order, `docs/AI-HARNESS-SECURITY.md`, the
   playbook, ledger entry; publication locks.
4. `npm test` green; `git diff --check` clean.

**Evidence gate:** the measurement; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the phrase table (WO-088); dropping any rule.

**Operator-review assumptions**

1. Every rule keeps a home.
