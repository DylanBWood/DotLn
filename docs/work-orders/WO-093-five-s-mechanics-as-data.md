# WO-093 — The 5S mechanics as data: Seiton, Seisō, Seiketsu, Shitsuke and Safety join Seiri as typed active mechanics with their terms, seeds, envelopes and tooltip collections, compiling alone and together in one group (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Five mechanic definitions in the
skeleton's loadouts. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** WO-037's "the 5S set as data" item, cut into a
bounded child at the operator's 2026-09-08 correction; product 05 §5S / 6S.
Planner-synthesized draft. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-091 merged (the six mechanics compile in one group).
**Recommended placement:** after WO-091, beside WO-092; it edits
`packages/skeleton/src/loadouts/`. A recommendation, not a dependency
token.

**Cites (read these sections):** 05-pattern-library.md §5S / 6S — the
maintenance organism; `packages/skeleton/src/loadouts/entropy-reducer.ts`
(the compiled Shine and Standardize to reuse); `packages/compiler/src/seiri.ts`.

**Objective:** Define the five mechanics with canonical term, translation,
kanji, secondary RPG title, tags, WorkOrder seed, envelope and tooltip
collections following 05: Shine makes cleaning double as inspection,
Standardize turns a recurring repair into a proposed test, rule, hook or
script, Sustain is the cadence, Safety is the parallel guard region; Shine
and Standardize reuse the Entropy Reducer's definitions where semantics
coincide and record any divergence; each compiles alone with a pinned
tooltip, and all six compile in one group.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Seiton, Shitsuke and Safety exist as prose only.

**Design (scope discipline):**

- Definitions are data; the Repo Gardener's base rank holds no deletion
  authority.
- **Declined alternatives, recorded:** forking Shine silently.

**Deliverables:** the definitions, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. Each mechanic compiles alone with its tooltip pinned (term, translation,
   kanji, RPG title, GRANTS, RESTRICTIONS, OBLIGATION, PASSIVE, PULSE,
   INTERRUPT, cost); all six compile in one group.
2. Divergences from the Entropy Reducer's definitions are recorded in the
   result, or none are.
3. Write-backs land: 05 §5S / 6S (which pieces are compiled), ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** bonuses (WO-094); the scenario (WO-095).

**Operator-review assumptions**

1. Names and semantics follow 05.
