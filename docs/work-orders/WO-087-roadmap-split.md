# WO-087 — Roadmap split: the candidate policy sections move to `14-planning-policies.md` with their slugs, so the roadmap holds the ladder (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A documentation move with publication
rows. Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-035's roadmap-split item, cut into a bounded
child at the operator's 2026-09-08 correction. Planner-synthesized draft.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** none open (a dated planning deferral until WO-053 closes or
the operator waives it).
**Recommended placement:** any free lane under the deferral; it edits 06,
adds 14, and moves publication index rows and locks. A recommendation, not
a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "documentation structure is not the product bottleneck",
    "until": "WO-053"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Work-order navigation and
identity through §Counterfactual profiling work orders (the candidate
sections); `docs/publication/` (index rows and locks);
`scripts/check-publication.mjs`.

**Objective:** Move the roadmap's candidate sections (navigation and
identity, whole-or-split, beacon checkpoint, unattended portfolio, budget
windows, capability progression policies, efficiency, bounded baseline,
counterfactual profiling) into `docs/product/14-planning-policies.md`
keeping every slug, and move the publication index rows with them.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The roadmap carries roughly 650 lines of candidate policy between its
  ladder rungs.

**Design (scope discipline):**

- Slugs unchanged; links updated; zero broken links.
- **Declined alternatives, recorded:** deleting candidates.

**Deliverables:** the move, the rows and locks, the write-backs below.

**Acceptance criteria (all required)**

1. Every moved heading keeps its slug; `check-publication` passes with the
   rows relocated and both edition locks refreshed; zero broken links.
2. Write-backs land: `docs/README.md`, ledger entry.
3. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 2.

**Non-goals:** changing any candidate's text.

**Operator-review assumptions**

1. A numbered product document is the right home for policy candidates.
