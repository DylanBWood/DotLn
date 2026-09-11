# WO-084 — Ledger order and index: one insertion rule enforced by a generated index and check, Resolutions moved to their own surface, and the trailing sections relocated with a dated migration note (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation structure and one check.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-035's ledger item, cut into a bounded child
at the operator's 2026-09-08 correction; the 2026-09-06 sweep's
measurements. Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** none open (a dated planning deferral until WO-053 closes or
the operator waives it).
**Recommended placement:** any free lane under the deferral; it edits
`docs/lineage/idea-ledger.md` (section moves only), adds
`docs/lineage/resolutions.md`, `scripts/lineage.mjs` and
`docs/lineage/README.md`, and edits `CLAUDE.md` §Start here. A
recommendation, not a dependency token.

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

**Cites (read these sections):** `docs/work-orders/WO-035-documentation-structure-reset.md`
(the umbrella's wording and measurements); 01-principles.md Principle 12
(append-only; superseding names what it supersedes);
`docs/lineage/idea-ledger.md` header (the declared ordering); `CLAUDE.md`
§Start here.

**Objective:** Keep newest-first below the header; move Resolutions to
`docs/lineage/resolutions.md`; relocate the trailing sections appended below
the boundary to their dated positions with a dated migration note in the
header; normalize the bold-lead sections to the backtick tag; add
`scripts/lineage.mjs index` generating `docs/lineage/README.md` (section to
line, counts by status, sections lacking a tag) and `--check` in `npm test`
refusing a section below the boundary, an unlabeled entry, or a status
outside the declared set.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`; the 2026-09-06
sweep's counts):**

- The ledger grew at both ends; the newest sections use two lead
  conventions; nothing checks the order.

**Design (scope discipline):**

- Whole-section moves only; no entry prose changes.
- **Declined alternatives, recorded:** per-session ledger files.

**Deliverables:** the moves, the note, `resolutions.md`, the script, the
index, the check, the write-backs below.

**Acceptance criteria (all required)**

1. `lineage index --check` passes on the reset ledger and refuses fixture
   sections below the boundary, unlabeled entries and unknown statuses; the
   generated counts equal a grep of the file.
2. The diff shows only section moves, tag normalization and the header note;
   no entry's prose changes.
3. Write-backs land: `CLAUDE.md` §Start here (the Resolutions path),
   `docs/README.md`, ledger entry.
4. `npm test` green with the check in the chain; `git diff --check` clean;
   no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** any other reset item (WO-085 to WO-090).

**Operator-review assumptions**

1. Relocating whole sections with a note honors the append-only rule.
