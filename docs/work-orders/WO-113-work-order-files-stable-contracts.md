# WO-113 — Work-order files are stable contracts: state changes live in control events, receipts in evidence directories, judgment in verifications and the release decision in final reviews, checked forward from a cutoff and migrated for the open orders (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One check in the work-order tooling and
a forward-only migration of open orders' dated notes. Assigned at activation
under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 external audit's separation rule
(the work-order file must stop becoming the execution log), restated by the
operator during the critical-path planning pass's correction; the
repository's existing homes for each surface. Planner-synthesized draft;
captures and hashes in the ledger section of that date. Opaque identifier,
not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-043 merged (supersession and deferral become typed
entries, so no dated prose is needed for them); WO-026 merged (the index;
satisfied at `v0.5.2`).
**Recommended placement:** after WO-043, in any free lane; it edits
`scripts/work-orders.mjs` (the check), the open orders' dated notes, and
the evidence READMEs that receive them. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-043",
    "relation": "hard",
    "reason": "supersession and deferral become typed entries"
  },
  {
    "workOrderId": "WO-026",
    "relation": "satisfied-by-release",
    "release": "v0.5.2",
    "reason": "the index"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline
(forward-only enforcement; never back-fill history) and §Documentation
freshness and ownership; 09-audit-resilience-privacy.md §Canonical audit
record; `docs/verifications/README.md` and `docs/final-reviews/` (the
judgment and decision homes); `docs/evidence/` (the receipt homes);
`docs/control/` (the state homes); `scripts/work-orders.mjs` (`parseHeader`);
the open orders carrying dated notes (redirect notes, retarget
reconciliations, ideation breakout receipts, umbrella records).

**Objective:** Make the five surfaces machine-kept: a work-order file holds
the stable contract (title, metadata, typed dependencies, cites, objective,
gap, design, deliverables, criteria, non-goals, assumptions); a state change
is a control event; a receipt lives under `docs/evidence/WO-NNN/`;
independent judgment is a `VER-NNN`; the release decision is a `FINAL-NNN`.
A check refuses, for orders filed after the cutoff, any dated note or
receipt paragraph in the order file (a bold dated lead, a heading containing
a date, a "receipt" or "reconciliation" section), and the open orders'
existing dated notes move verbatim to their evidence READMEs with a one-line
pointer, umbrella supersession becoming WO-043's typed `superseded` entries.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Open orders carry redirect notes, retarget reconciliations, ideation
  breakout receipts and, since this pass, umbrella records; the index reads
  their headers, so every such note is an untyped addition to the contract
  region.

**Design (scope discipline):**

- The cutoff is the activation date; closed and historical orders are never
  edited (their notes are history).
- The check is a positive rule over the order's sections; the allowed
  section set is documented in 07.
- **Declined alternatives, recorded:** rewriting closed orders; a front-matter
  migration (unselected in the roadmap).

**Deliverables:** the check, the migration, the pointers, the write-backs
below.

**Acceptance criteria (all required)**

1. The check refuses a fixture order with a dated bold lead, a dated
   heading and a receipt section, and passes the allowed section set; it
   runs in `index --check`.
2. Every open order passes the check after migration; each moved note is
   byte-identical in its evidence README with a pointer left behind; umbrella
   records are typed `superseded` entries and the prose record is in the
   evidence README.
3. Closed and historical orders are byte-identical to the activation base.
4. Write-backs land: 07 §Discipline (the five surfaces and the allowed
   sections), `docs/work-orders/README.md` Sources and limits (generated),
   ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** product-doc receipts (WO-085); front matter; editing closed
orders.

**Operator-review assumptions**

1. The umbrella records this pass added are the last dated notes filed
   before the cutoff; they migrate here.
