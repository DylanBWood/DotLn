# WO-097 — Rule migration batch 1a: six new units at rung one or two compile through the harness target into the Contributor build, each retiring its always-on sentence with the reverse mapping proven (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Six compiled units and their lowering.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the first half of WO-040's batch one, cut into a
bounded child at the operator's 2026-09-08 correction. Planner-synthesized
draft. Opaque identifier, not a priority. Clean-room screen: applies with
force.
**Depends on:** WO-096 merged (the ledger rows the batch selects from).
**Recommended placement:** after WO-096; it edits the compiler's feedback
module, the skeleton's loadouts, the always-on prose it retires, and the
regenerated bundle. A recommendation, not a dependency token.

**Cites (read these sections):** `docs/work-orders/WO-040-rule-migration-batch-one.md`
(the unit shape, the retirement and reverse-mapping rules, the measurement
method); `docs/evidence/WO-011/README.md`; `packages/compiler/src/feedback.ts`;
`packages/skeleton/src/loadouts/feedback.ts`.

**Objective:** Six new units, all at rung one or two (a deterministic check
or a generated hook), each complete (FeedbackUnit shape, a synthesized
incident citing public lineage, a regression fixture failing when the
mechanism is removed, maturity stats, handler, lowering into the Contributor
build), each retiring the always-on sentence that stated it with the
sentence's hash pinned and absence asserted, with the reverse-mapping
fixture proving every removed sentence has a covering unit.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Ten units govern live sessions; the rest is prose.

**Design (scope discipline):**

- The umbrella's rules unchanged; six units, not twelve.

**Deliverables:** the units, fixtures, retirements, the regenerated bundle,
the write-backs below.

**Acceptance criteria (all required)**

1. Six units at rung one or two, each with the full shape and a regression
   fixture that fails when its mechanism is removed; none duplicates an
   existing unit.
2. Each lowers through `harness-v1`; `harness check` passes on the
   regenerated bundle; the WO-039 hook fixtures cover each new hook.
3. Each unit's always-on sentence is removed with its hash pinned and
   absence asserted; the reverse-mapping fixture proves coverage and fails
   on a fixture removal without it; the instruction-byte comparison per unit
   is recorded.
4. Write-backs land: the migration ledger rows updated, ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency; a fresh
   feedback evidence edition (operator-run live audit).

**Evidence gate:** the transcripts; `npm test`; the evidence edition.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the skill and cadence units, the whole-set measurement and
the template (WO-098).

**Operator-review assumptions**

1. Six is a half batch; the selection rule is satisfied across both halves.
