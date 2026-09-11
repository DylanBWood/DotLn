# WO-092 — The `sets` graph extension: an additive collection names a set's member actives and piece-count bonuses, the three views round-trip it, and the compiled inspection lists each bonus armed or dark (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. An additive graph collection under
schema version 1. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** WO-037's set-definitions item, cut into a
bounded child at the operator's 2026-09-08 correction. Planner-synthesized
draft. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-091 merged (a set's members are several actives in one
group).
**Recommended placement:** after WO-091; it edits the compiler's types,
normalize, views and compile. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-091",
    "relation": "hard",
    "reason": "a set's members are several actives in one group"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 04-interfaces.md §RPG / Path-of-Exile
view (set bonuses) and §Editable-view v1 normalization and semantic hash;
10-ir-compatibility.md §Invariants; `packages/compiler/src/views.ts`,
`normalize.ts`.

**Objective:** Add an optional `sets` collection: a set names member active
ids and bonuses, each with a piece count and one emission of an existing
kind; absent normalizes to empty; the three editable views encode and
decode it; a bonus is armed when at least its piece count of members is
equipped; the compiled inspection lists each bonus armed or dark with the
arming count; no bonus semantics for the 5S set here (a fixture set).

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No set definition, bonus emission or arming inspection exists.

**Design (scope discipline):**

- Additive; existing hashes unchanged.

**Deliverables:** the collection, codecs, arming inspection, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. A fixture graph with `sets` round-trips through the three views and
   hashes equal; a graph without it keeps its hash.
2. The inspection lists each fixture bonus armed at its count and dark one
   piece short.
3. Write-backs land: 02 §LoadoutGraph v1 payload contract, 04 §RPG view, 10
   §Separate version axes, ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the 5S bonuses (WO-094); the render (WO-095).

**Operator-review assumptions**

1. Additive under schema 1.
