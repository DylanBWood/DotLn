# WO-090 — Shorter cold start: the execution guide keeps the executor's operating contract, the model-specific and sandbox paragraphs move with pointers, and the directed-load total per role is measured lower (v0.35.1)

**Cost:** adds no step, check, hook or receipt; adds pointers where
paragraphs leave the guide. Removes context bytes from every role's directed
reads, by the amount criterion 1 measures; the before figure on 2026-09-19 at
`3b3533f8` is a guide of 1,772 lines against 804 at the 2026-09-08 sweep,
and the per-role directed-load totals are measured at activation with
`scripts/harness-context.mjs` because no current total is recorded.
Wall-clock and tokens of the order itself are unknown until run. This line
replaces the legacy-unavailable declaration of 2026-09-09.

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
criterion 6; closed). The dated planning deferral lapsed by its own terms
when WO-053 closed on 2026-09-18.
**Recommended placement:** lane pair with WO-145 (2026-09-19 planning
pass), after WO-142, WO-144 and WO-140, which write product 07 and the role
text first. It edits product 07, `docs/AI-HARNESS-SECURITY.md` and the
playbook; WO-145 edits the contributor loadout and product 05. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "documentation structure is not the product bottleneck",
    "until": "WO-053"
  },
  {
    "workOrderId": "WO-039",
    "relation": "satisfied-by-close",
    "reason": "the directed-load measurement method"
  }
]
<!-- dotln-dependencies:end -->

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
- Re-observed 2026-09-19 at `3b3533f8`: the guide is 1,772 lines. The
  generated role text is a separate measure this order does not reduce:
  `CLAUDE.md` plus the role skill is 20,849 bytes for the executor, 17,891
  for the verifier, 19,109 for the reviewer, 12,437 for release close and
  13,509 for the planner, under ceilings raised four times across three
  roles on 2026-09-17 and 2026-09-18 (`docs/control/budgets.json`). The
  operator's 2026-09-18 deferral of role-text efficiency to a later pass
  (WO-054-D006) stays unowned.

**Design (scope discipline):**

- Removal before pruning; a rule keeps a home; the line count is a
  consequence, not the measure.

**Deliverables:** the moves, the pointers, the table, the measurement, the
write-backs below.

**Acceptance criteria (all required)**

1. The directed-load total per role, measured by WO-039's method, is lower
   after than before for every role; no relocated paragraph is in a role's
   directed-read set unless it already was; no role's generated cold-start
   bytes (`measureColdStarts`) rise.
2. The relocation table accounts for every removed paragraph.
3. Write-backs land: 07 §Read order, `docs/AI-HARNESS-SECURITY.md`, the
   playbook, ledger entry; publication locks.
4. `npm test` green; `git diff --check` clean.

**Evidence gate:** the measurement; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the phrase table (WO-088); dropping any rule; reducing the
generated role text (`CLAUDE.md` and the role skills).

**Operator-review assumptions**

1. Every rule keeps a home.
