# WO-087 — Candidates leave the roadmap: its candidate and policy sections move to the planning map's candidates sections with their slugs reconciled in the register, so the roadmap holds the ladder and the generated release history (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Text moves, publication index rows and
register reconciliation; no product code or contract change. Assigned at
activation under the standing opt-out default.
**Cost:** adds one map section per moved roadmap section (navigation and
identity, whole-or-split, beacon checkpoint, unattended portfolio, budget
windows, capability progression policies and its three subsections,
bounded baseline, counterfactual profiling, local-model experiments) with
the slug of each heading preserved, and the register reconciliation of
each renamed source as a duplicate of its new entry
(`docs/planning/followups.md`); removes about 650 lines of candidate policy
from 06 and their publication index rows and locks; lowers product 06's
ceiling in `doc-ceilings.json` to its new size. Re-mints: none. Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** WO-035's roadmap-split item, cut into a bounded
child at the operator's 2026-09-08 correction; held 2026-09-19 until
WO-085 and WO-090 settled what lives where (WO-090 closed 2026-09-20;
WO-085 rewritten 2026-09-25); rewritten by the 2026-09-25 standard pass at
the operator's item 4: the destination is the planning map, not a new
numbered product document, because candidates are planning material the
register already collects from the map. Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-086 merged (both edit 06; the generated history lands
first so the roadmap is edited once more, not twice).
**Recommended placement:** a one-entry slot directly after WO-086 and
WO-167; it may run beside whichever of those is still open once WO-086
has closed, as WO-146 and WO-149 did beside their pairs. It edits 06, the
map, the publication index and locks, `docs/README.md` and the register.
A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-086",
    "relation": "hard",
    "reason": "both edit product 06; the generated history lands first"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Work-order navigation and
identity through §Candidate — local-model usefulness experiments (lines
799–1662 at `64f9326f`); `docs/planning/work-order-map.md` §Preserved
unallocated candidates and the dated candidates sections;
`docs/planning/followups.md` (renamed sources reconcile as duplicates);
`docs/publication/` (index rows and locks); `scripts/check-publication.mjs`;
the [2026-09-25 standard-pass planning document](../planning/standard-pass-2026-09-25.md)
§5.

**Objective:** the roadmap holds the version ladder with exit criteria and
the generated release history and nothing else; every candidate it carried
is in the planning map under its slug, with its register row carried
across, and no link breaks.

**Observed gap (dated 2026-09-25, `main` at `64f9326f`):**

- 06 carries about 650 lines of candidate policy between its ladder rungs
  (six `Candidate —` headings and the capability-progression policies); it
  is 2,155 lines and 148,793 bytes, the third-largest product document.
- The register collects candidate headings from product and planning
  documents alike (`docs/planning/followups.md`), so the move loses no
  identity; a renamed source is reconciled as a duplicate of its new entry.
- The 2026-09-08 draft's destination, `14-planning-policies.md`, would add a
  sixteenth product document to the corpus item 4 measures; the map is
  where the other 64 candidates' siblings already live.

**Design (scope discipline):**

- Move each section verbatim under a map heading carrying the same slug;
  update inbound links; run `npm run meta` so the register reconciles
  each renamed source as a duplicate of its new entry with history kept.
- Remove the moved sections' publication index rows and refresh the locks.
- Lower 06's ceiling to its new size.
- **Declined alternatives, recorded:** a new product document (item 4);
  deleting candidates; editing any candidate's text.

**Deliverables:** the move, the rows and locks, the register
reconciliation, the write-backs below.

**Acceptance criteria (all required)**

1. Every moved heading keeps its slug; `check-publication` passes with the
   rows removed and both edition locks refreshed; the docs check reports
   zero broken links and 06 under its lowered ceiling.
2. The register shows each moved candidate's old row as a duplicate of its
   map row with its history retained; no pending row is lost (counts
   recorded before and after).
3. Write-backs land: `docs/README.md`, ledger entry.
4. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the diff; the register counts; `npm run test:docs`;
`npm test` at final review. No live row.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** changing any candidate's text; the other product documents'
candidate headings (05's 21 are the pattern library's own material; 03's
eight and 07's nine are WO-167's and a later consolidation order's).

**Operator-review assumptions**

1. Candidates are planning material; the map is their home and the
   register their index.
