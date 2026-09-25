# WO-086 — Generated release history: `release list --markdown` renders the roadmap's Release boundary from local annotated tags and work-order headers between checked markers, the hand-kept assignment and collision notes move verbatim to a dated planning receipt, and `release prepare` records a collision as the order's typed decision instead of roadmap and README prose (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. A generated table replacing hand-kept
notes, one preserved receipt, and `release prepare` writing a decision
instead of prose; no version, contract, event schema or gate change.
Assigned at activation under the standing opt-out default.
**Cost:** adds `release list --markdown` (one row per local annotated tag:
version, date, order, classification, component versions, from the tag and
the order heading), emitted between markers in 06 §Release boundary and
checked like the README release block; a dated planning receipt holding
the retired notes byte for byte; `release prepare` at activation writing
the target into the control event and the order heading only, and at a
collision appending the integration decision the integrate helper already
drafts (product 07 §Independent workflows: "a dated decision record")
instead of a roadmap paragraph and a README sentence; the README release
block reduced to its version claim inside the existing fifteen-sentence
rule. Removes: 545 lines of 06 §Release boundary (20 machine-written
"collision retiming" paragraphs, the activation-completion and
component-integration paragraphs, two forward-retiming sections) and the
per-order growth of two paragraphs; the retiming vocabulary from the
surfaces a reader meets first (06, README, product 07's integration
sentence, CLAUDE.md's shared-memory line, edited by the 2026-09-25 pass).
Re-mints: none (`scripts/release.mjs` and `scripts/lib/release-preparation.mjs`
are not registered evidence sources). Wall-clock, tokens and context bytes
are unknown until run.
**Nomination provenance:** WO-035's release-history item, cut into a
bounded child at the operator's 2026-09-08 correction; held 2026-09-19
until WO-079 landed, which it did on 2026-09-20 (`worktree integrate`);
rewritten by the 2026-09-25 standard pass at the operator's item 3
("release retiming phrases everywhere in docs; makes me decentivized from
doing parallel work orders"). Planner-synthesized draft. Opaque identifier,
not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-164 merged (it edits `scripts/release.mjs` `list`, whose
per-tag cache this order's `--markdown` reads); WO-160 merged (the last
`release.mjs` edit; closed, v0.51.0).
**Recommended placement:** paired with WO-167 directly after WO-162 and
WO-163. This order edits `scripts/release.mjs`,
`scripts/lib/release-preparation.mjs`, products 06 and 10, the README and
one sentence of product 07; WO-167 edits product 07's body and the map.
The one product 07 sentence is named so the pair's integration is a
one-line union. WO-087 follows (both edit 06). A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-164",
    "relation": "hard",
    "reason": "the per-tag cache in release list that --markdown reads"
  },
  {
    "workOrderId": "WO-160",
    "relation": "satisfied-by-close",
    "reason": "the last edit of scripts/release.mjs before this order"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Release boundary (lines
21–566 at `64f9326f`) and its two forward-retiming subsections;
10-ir-compatibility.md §Separate version axes; `scripts/release.mjs`
(`list`; the README block check); `scripts/lib/release-preparation.mjs`
(line 120, the collision note; the README and roadmap writes); product 07
§Independent workflows and integration (the 2026-09-16 checklist and the
2026-09-17 amendment); `npm run worktree -- integrate` (the draft
integration decision it writes); the
[2026-09-25 standard-pass planning document](../planning/standard-pass-2026-09-25.md)
§4.

**Objective:** the tag is the record and the roadmap shows it as a
generated table; a version collision between two lanes is recorded once,
as the integrating order's decision, and writes no prose anywhere a reader
of the product documents or the README meets; the retired notes survive
verbatim in one receipt.

**Observed gap (dated 2026-09-25, `main` at `64f9326f`):**

- 06 §Release boundary is 545 lines of dated notes, two per order (an
  activation completion and, for every pair since 2026-09-16, a collision
  retiming); 107 of the roadmap's dated paragraphs are these.
- 1,056 lines across `docs/` mention retiming; the live surfaces are the
  roadmap (35), product 07 (7), the register (37, generated) and CLAUDE.md
  (1). The operator reports the phrases discourage parallel orders; the
  2026-09-17 amendment already made the second lane by preference an order
  with no retime, and every pair since has retimed anyway (WO-158
  v0.48→v0.49, WO-160 v0.50→v0.51, WO-111, WO-156, WO-100, WO-147, WO-069,
  WO-099, WO-110, WO-146).
- The 2026-09-19 measurement: 61 tags (93 now), the note machine-written,
  "no recurring hand cost". The cost is the reader's, not the writer's.

**Design (scope discipline):**

- The table is generated from local annotated tags joined to the orders
  their messages name; unpublished staging appears in no table.
- Markers in 06 (and 10 where it lists axes) are checked as the README
  block is; a stale table fails the document gate.
- `release prepare`: at activation, the target goes into the activation
  event and the order heading (as today) and nowhere else; at a
  collision, the helper appends the integration decision record with the
  superseded and new targets and the baseline, and touches no product
  document or README prose. The README block keeps the version claim.
- The retired notes move byte for byte to
  `docs/planning/release-history-notes-2026-08-31-to-2026-09-25.md` with a
  one-line pointer where the section stood.
- Product 07 §Independent workflows: the sentence naming "a dated roadmap
  note" becomes "the integration decision"; the mechanism text stays.
- Failure path: when the collision's decision cannot be appended (the
  integrate helper's decision stub meets an authored conflict,
  `worktree-integration.mjs`; receipt 029, WO-086 finding), `release
  prepare` refuses with the path and the remedy and writes nothing; it
  never falls back to a roadmap or README paragraph.
- **Declined alternatives, recorded:** assigning the application version
  at publication instead of activation (removes the collision itself;
  touches the activation event, the heading rule, `check-surfaces` and
  every role text; recorded as a map candidate with its reopening
  observation); editing the index generator; deleting the notes.

**Deliverables:** the emitter; the markers and check; the receipt; the
`release prepare` change; the write-backs below.

**Acceptance criteria (all required)**

1. The generated table equals the local annotated tags joined to their
   orders (a fixture compares it with `release list`); the marker check
   refuses a stale table.
2. The retired notes are byte-identical in the receipt file (hash recorded
   in the decisions).
3. A fixture collision through `release prepare` appends the integration
   decision and changes no product document or README line beyond the
   version claim; a fixture with a conflicted decisions record refuses
   with the path and writes nothing.
4. Write-backs land: 06 and 10 (the markers and pointer), the README block,
   the product 07 sentence, ledger entry; publication locks; product 06's
   ceiling in `doc-ceilings.json` lowered to its new size.
5. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`; `npm test`
at final review. No live row.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the roadmap's candidate sections (WO-087); version
assignment at publication (map candidate); component version policy;
rewriting any final review, verification or decision that mentions a
retime.

**Operator-review assumptions**

1. The tag is the record; the roadmap is a plan.
2. A collision recorded once as a decision, with no prose, is what makes a
   second lane cost nothing to read about.
