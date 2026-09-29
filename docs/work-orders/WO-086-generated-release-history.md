# WO-086 — Generated release history: `release list --markdown` renders the roadmap's Release boundary from local annotated tags and work-order headers between checked markers, the hand-kept assignment and collision notes move verbatim to a dated planning receipt, and `release prepare` records a collision as the order's typed decision instead of roadmap and README prose (v0.56.1)

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
rule. Removes: 06 §Release boundary's hand-kept notes (545 lines at
`64f9326f`; 910 lines, 21 to 930, at `5f3849ec`, the executor counting
at its base: machine-written "collision retiming" paragraphs, the
activation-completion and component-integration paragraphs, two
forward-retiming sections) and the per-order growth of two paragraphs;
the retiming vocabulary from the
surfaces a reader meets first (06, README, product 07's integration
sentence, CLAUDE.md's shared-memory line, edited by the 2026-09-25 pass);
the docs check's unconditional exemption of 06 §Release boundary
(`scripts/docs-check.mjs` `productContent`; lines 21–857 and 63,183 bytes
at `4c34b332`, lines 21–930 and 68,433 bytes at `5f3849ec`), replaced by
the one registered marker pair of the generated table (WO-085 D009 O3;
D015 V2 and V7).
Re-mints: none (`scripts/release.mjs`, `scripts/lib/release-preparation.mjs`
and `scripts/docs-check.mjs` are not registered evidence sources).
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-035's release-history item, cut into a
bounded child at the operator's 2026-09-08 correction; held 2026-09-19
until WO-079 landed, which it did on 2026-09-20 (`worktree integrate`);
rewritten by the 2026-09-25 standard pass at the operator's item 3
("release retiming phrases everywhere in docs; makes me decentivized from
doing parallel work orders"); amended by the 2026-09-27 pass with the
docs check's exemption retirement and the corrected ceiling statement,
which WO-085's verifications boarded for planning (register rows
FUP-a6b9c4dc86ac8995 and FUP-040634d583e2c517); amended by the
2026-09-28 pass, which re-observed its figures on `main` at `5f3849ec`,
named the receipt file without a date range and moved the order into a
pair with a product order
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-164 merged (it edits `scripts/release.mjs` `list`, whose
per-tag cache this order's `--markdown` reads); WO-160 merged (the last
`release.mjs` edit; closed, v0.51.0).
**Recommended placement:** paired with WO-117 in the fourth slot. This
order edits `scripts/release.mjs`,
`scripts/lib/release-preparation.mjs`, `scripts/docs-check.mjs` (the
exemption), products 06 and 10, the README, `docs/README.md` and
one sentence of product 07; WO-117 edits `packages/console`, product 04
and one sentence of the README's "What runs today", which this order's
release block does not hold. Its product 07 sentence is four bytes
longer than the one it replaces and the guide has nine bytes of
headroom until the fold (WO-167), so it runs after the fold and after
WO-173 and WO-172, which add to the guide; it runs after WO-060 because
both write product 10 §Separate version axes. WO-087 follows (both edit
06). A recommendation, not a dependency token.

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
integration decision it writes); `scripts/docs-check.mjs`
(`productContent`: the Release boundary range and the comment that no
generator owns a marked product block) with
`docs/evidence/WO-085/decisions.md` D009 (O3) and D015 (V2, V7); the
[2026-09-25 standard-pass planning document](../planning/standard-pass-2026-09-25.md)
§4; the
[2026-09-27 planning document](../planning/onesie-twosie-followup-drain-2026-09-27.md)
§6.

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
- The 2026-09-19 measurement: 61 tags (93 on 2026-09-25, 109 on
  2026-09-28), the note machine-written, "no recurring hand cost". The
  cost is the reader's, not the writer's.

**Design (scope discipline):**

- The table is generated from local annotated tags joined to the orders
  their manifests name, as the work-order index's local release evidence
  is; the order's heading supplies display text only, so a heading that
  carries no version still joins. Unpublished staging appears in no
  table.
- Markers in 06 (and 10 where it lists axes) are checked by the index's
  rule: the committed table carries the snapshot of the tags it was
  generated from, the check requires each recorded tag to remain
  available and unchanged and the rows to equal those tags' rows, and a
  newer local tag is reported without refusing. A sibling lane that
  publishes a tag therefore cannot turn this worktree's document gate
  red; a checkout that lacks a recorded tag is refused with the tag's
  name, as the index check refuses it today.
- `release prepare`: at activation, the target goes into the activation
  event and the order heading (as today) and nowhere else; at a
  collision, the helper appends the integration decision record with the
  superseded and new targets and the baseline, and touches no product
  document or README prose. The README block keeps the version claim.
- The retired notes move byte for byte to
  `docs/planning/release-history-notes.md`, which states the dates of
  the first and last note it holds, with a one-line pointer where the
  section stood.
- Product 07 §Independent workflows: the sentence naming "a dated roadmap
  note" becomes "the integration decision"; the mechanism text stays.
- The docs check stops exempting 06 §Release boundary by its heading.
  The generated table's marker pair is registered by product path and
  marker name as the one block the check exempts from the byte count and
  from receipt and candidate detection; a marker pair nobody registered,
  and a Release boundary whose terminating heading was demoted or
  quoted, exempt nothing. `docs/README.md`'s sentence about the exemption
  and the unregistered markers is edited in place.
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
`release prepare` change; the docs check's registered exemption; the
write-backs below.

**Authorized repair scope (2026-09-29, WO-086-D016):** the operator's
`scope expand: merge main in` includes canonical `worktree integrate`
during this repair, its conflict resolutions and regenerated projections,
and affected checks on the integrated subject. Preserve the original
verification report and recovery material; assess carried-forward claims
explicitly and retain the retired release notes byte for byte.

**Acceptance criteria (all required)**

1. The generated table equals the recorded tags joined to their orders
   through the tags' manifests (a fixture compares it with `release
   list`, and one order in the fixture has a heading with no version).
   The marker check refuses a table whose rows differ from its recorded
   tags, passes with a report when a newer local tag exists, and names a
   recorded tag the checkout lacks.
2. The retired notes are byte-identical in the receipt file (hash recorded
   in the decisions).
3. A fixture collision through `release prepare` and the integrate helper
   yields exactly one integration decision in the order's decisions
   record, with the superseded and new targets and the baseline, and
   changes no product document or README line beyond the version claim;
   a fixture with a conflicted decisions record refuses with the path and
   writes nothing.
4. Write-backs land: 06 and 10 (the markers and pointer), the README block,
   the product 07 sentence, `docs/README.md`'s exemption sentence, ledger
   entry; publication locks. The docs check exempts the registered
   generated block and nothing else in 06: a fixture with an unregistered
   marker pair and one with a demoted terminating heading each report the
   receipt, the candidate and the bytes inside. Product 06 holds no
   collision-retiming, activation-completion or forward-retiming
   paragraph outside the generated markers, and the docs check's
   baseline for 06 holds no receipt shape under Release boundary. Product
   06's counted bytes are recorded before and after; its entry in
   `doc-ceilings.json` equals the counted bytes at landing plus two per
   cent and does not exceed its entry at the order's base, except by the
   standing release policy that stays counted under §Release boundary
   (operator authorization, 2026-09-29, WO-086-D004). The bytes
   the heading exemption excluded (63,183 at `4c34b332`, 68,433 at
   `5f3849ec`) were never counted, so the ceiling does not fall by them
   (WO-085 D009 O3).
5. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`; `npm test
-- --review` before `implementation-ready`, because every file under
`scripts/` is a declared source of the configuration-root suite, and again
at final review. No live row.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the roadmap's candidate sections (WO-087); version
assignment at publication, which would remove the collision itself but
changes the activation event, the heading rule, `check-surfaces` and
every role text (map candidate; this order is the smaller probe, and a
collision that still needs a hand step after it reopens that candidate);
component version policy;
rewriting any final review, verification or decision that mentions a
retime.

**Operator-review assumptions**

1. The tag is the record; the roadmap is a plan.
2. A collision recorded once as a decision, with no prose, is what makes a
   second lane cost nothing to read about.
