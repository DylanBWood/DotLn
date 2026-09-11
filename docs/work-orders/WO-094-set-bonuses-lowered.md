# WO-094 — Set bonuses lowered: the five 5S bonuses compile to real emissions that arm at their piece counts and go dark one piece short, and the Safety gate compiles and refuses (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Bonus emissions over WO-092's
collection. Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-037's bonuses item, cut into a bounded child
at the operator's 2026-09-08 correction. Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-092 merged (bonus emissions live in the sets collection);
WO-093 merged (the pieces the bonuses count).
**Recommended placement:** after WO-092 and WO-093; it edits the 5S set
definition and compiler fixtures. A recommendation, not a dependency token.

**Cites (read these sections):** 05-pattern-library.md §5S / 6S;
04-interfaces.md §RPG view; `docs/work-orders/WO-037-five-s-equipment-set.md`
(the five bonuses).

**Objective:** Two of five: every Sort candidate carries a proposed
canonical home (evidence-schema); three: every cleanup invokes an integrity
check (verifier episode); four: a recurring repair proposes a
standardization (evidence field and work-order obligation); five: the cycle
schedules its own bounded reevaluation (a cadence in the evaluable subset);
six with Safety: a destructive change is legal only with isolation,
evidence, independent verification and explicit approval (permission guard
plus statechart gate), which the Gardener's base rank refuses.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Set bonuses are "meant to compile".

**Design (scope discipline):**

- The gate is the deliverable; the authority is not.

**Deliverables:** the bonuses, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. For each bonus, a fixture proves it dark one piece short and armed at its
   count, and that its emission changes the semantic hash only when armed.
2. The Safety gate compiles and refuses the destructive change in a fixture.
3. Write-backs land: 04 §RPG view (bonuses implemented for this set), 05,
   ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the scenario and render (WO-095); real deletion authority.

**Operator-review assumptions**

1. Evidence-gated escalation stays a preserved candidate.
