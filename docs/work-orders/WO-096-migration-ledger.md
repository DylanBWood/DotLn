# WO-096 — Migration ledger and whole-set classification: every feedback shape the operator named gets a typed row or an exclusion count, the ten compiled units are marked, governance mode is derived by one rule, and the render is checked with the local-terms screen (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A generated projection over typed rows
and its check; no unit compiled here. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** WO-040's migration-ledger and classification
items, cut into a bounded child at the operator's 2026-09-08 correction.
Planner-synthesized draft. Opaque identifier, not a priority. Clean-room
screen: applies with force; employer-specific shapes get no row.
**Depends on:** WO-011 merged (the ten units; satisfied at `v0.13.0`);
WO-039 merged (the local-terms check; closed). A dated planning deferral
until WO-053 closes or the operator waives it.
**Recommended placement:** first of the migration children; it adds
`corpus/feedback/migration.json`, its renderer and check, and
`docs/lineage/feedback-migration.md`. A recommendation, not a dependency
token.

**Cites (read these sections):** `docs/work-orders/WO-040-rule-migration-batch-one.md`
(the umbrella's ledger rules, verbatim the authority for the row shape);
02-domain-model.md §Feedback; `scripts/feedback-evidence.mjs`;
`scripts/lib/terms.mjs`.

**Objective:** One row per shape (generic id, taxonomy category, cheapest
sufficient rung, status, governance mode derived by the umbrella's rule, a
synthesized source note citing the ledger); employer-specific shapes as a
count per exclusion class with no row; the denominator pinned to the intake
capture's hash with the operator's attestation disclosed; the ten units
marked `compiled`; `npm run feedback -- migration` renders the projection;
`--check` refuses a stale render, a compiled unit missing from the rows, a
`mechanism` row whose retired sentence is present, and any row text matching
the local-terms list (`unavailable` when the list is absent); batch 1a and
1b candidates named.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Ten shapes compiled, roughly 140 named, no ledger of the rest.

**Design (scope discipline):**

- The umbrella's rules are the row contract; nothing copied from any
  predecessor file.

**Deliverables:** the rows, renderer, check, render, the write-backs below.

**Acceptance criteria (all required)**

1. The ledger classifies every shape with the ten marked `compiled`,
   exclusion counts with no rows, the pinned denominator with the
   attestation disclosed, and counts per status and governance mode rendered
   from the derived rule.
2. `--check` refuses a stale render, a missing compiled unit, a `mechanism`
   row with its sentence present, and a fixture row carrying a synthetic
   local term; it reports `unavailable` without the list.
3. Batch 1a and 1b candidates are named in the ledger under the umbrella's
   selection rule.
4. Write-backs land: 06 (the migration rung's status), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** compiling any unit (WO-097, WO-098).

**Operator-review assumptions**

1. The operator may add or strike candidate shapes by `ideation:` before
   activation.
