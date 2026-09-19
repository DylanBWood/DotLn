# WO-084 — Ledger order and index: one insertion rule enforced by a generated index and check, Resolutions moved to their own surface, and the trailing sections relocated with a dated migration note (v0.31.2)

**Cost:** adds one generated index (`docs/lineage/README.md`) and one check
inside the existing document suite (`npm run test:docs`), never in the
product gate; its duration is unknown until built and is recorded at
verification. Removes, measured on 2026-09-19 at `3b3533f8`: 31 `##` sections
filed below the Resolutions boundary (line 6115 of 7,580) against a header
that says never at the end, two of them operator ideation dated 2026-09-18
that a newest-first reader does not meet; and the hand decision, at every
ideation and planning write, of where a section goes. Wall-clock, tokens and
context bytes of the order itself are unknown until run. This line replaces
the legacy-unavailable declaration of 2026-09-09.

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation structure and one check.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-035's ledger item, cut into a bounded child
at the operator's 2026-09-08 correction; the 2026-09-06 sweep's
measurements. Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** none open. The dated planning deferral lapsed by its own
terms when WO-053 closed on 2026-09-18.
**Recommended placement:** lane pair with WO-142 (2026-09-19 planning pass),
which is fenced off these paths; it edits `docs/lineage/idea-ledger.md`
(section moves only), adds `docs/lineage/resolutions.md`,
`scripts/lineage.mjs` and `docs/lineage/README.md`, and updates the live
references to the Resolutions surface. A recommendation, not a dependency
token.

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
line, counts by status, sections lacking a tag) and `--check` in the
document suite (`npm run test:docs`; the 2026-09-15 stand-down keeps
document checks out of the product gate) refusing a section below the
boundary, an unlabeled entry, or a status outside the declared set.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`; the 2026-09-06
sweep's counts):**

- The ledger grew at both ends; the newest sections use two lead
  conventions; nothing checks the order.
- Re-observed 2026-09-19 at `3b3533f8`: 31 sections sit below the boundary,
  dated 2026-09-05 to 2026-09-18; `CLAUDE.md`, `docs/README.md`, the root
  README, the playbook and the role skills do not mention Resolutions; product
  07 does, in §Operator-opened ideation mode and §Discipline (other documents
  were not searched). The planning-pass selector derives a pass
  id from the bytes of its dated `##` heading
  (`scripts/lib/plan-subject.mjs` `planningPasses`), so a moved section keeps
  its receipt only if its heading is byte-identical.

**Design (scope discipline):**

- Whole-section moves only; no entry prose changes; no `##` heading byte
  changes, because receipts address planning passes by heading.
- **Declined alternatives, recorded:** per-session ledger files.

**Deliverables:** the moves, the note, `resolutions.md`, the script, the
index, the check, the write-backs below.

**Acceptance criteria (all required)**

1. `lineage index --check` passes on the reset ledger and refuses fixture
   sections below the boundary, unlabeled entries and unknown statuses; the
   generated counts equal a grep of the file.
2. The diff shows only section moves, tag normalization and the header note;
   no entry's prose changes; every planning-pass id computed from the ledger
   is the same set before and after, and `npm run plan -- check` passes.
3. Write-backs land: every current reference to the Resolutions surface
   names the new path (a grep of the live documents shows none left),
   `docs/README.md`, ledger entry.
4. `npm run test:docs` green with the check in its chain; `npm test` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm run test:docs`; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** any other reset item (WO-085 to WO-090).

**Operator-review assumptions**

1. Relocating whole sections with a note honors the append-only rule.
