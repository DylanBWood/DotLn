# WO-167 — The execution guide folded: its 32 dated amendment paragraphs are folded into the sentences they amend with one-line citations, its nine candidates move to the planning map, every heading a role skill or the publication index cites still resolves, and the guide's ceiling is lowered to the result (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any. The fold is a
rewrite of the document every role reads at cold start; the verifier
checks that no rule changed meaning.
**Release classification:** patch. Documentation only: the guide's text and
the map; the role skills' `Read:` anchors are unchanged. Assigned at
activation under the standing opt-out default.
**Cost:** adds a folded guide (each dated paragraph's rule edited into the
sentence it amends, its date and source reduced to a bracketed citation of
the decision or planning document that holds the rationale), nine map
sections carrying the guide's candidates under their slugs with register
reconciliation, and a lowered ceiling for 07 in `doc-ceilings.json`;
removes the 32 dated paragraphs and nine candidate sections as separate
text and the reading they cost every cold start. Re-mints: `docs/product/`
is not a registered evidence source; the generated skills cite headings,
not bytes, so no bundle change unless a cited heading moves (it must not).
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's 2026-09-25 item 4 ("all adds,
ballooning in size, AI slop"), measured by the standard pass: the guide is
181,458 bytes and 2,531 lines, 1,933 at WO-090's close five days earlier;
32 dated paragraphs; nine candidates. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-085 merged (the check that keeps the fold from regrowing
and the ceiling this order lowers).
**Recommended placement:** paired with WO-086 directly after WO-162 and
WO-163. This order edits product 07's body and the map; WO-086 edits
`release.mjs`, products 06 and 10, the README and one named sentence of
product 07 (§Independent workflows: "a dated roadmap note" → "the
integration decision"), which this order leaves to it. Disjoint apart from
that sentence; neither depends on the other. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-085",
    "relation": "hard",
    "reason": "the docs check and the ceiling this order lowers"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md whole (the fold's
subject; its 32 dated paragraphs and nine `Candidate —` headings at
`64f9326f`); `.claude/skills/*/SKILL.md` and `.agents/skills/*/SKILL.md`
(every `Read:` anchor into the guide); `docs/publication/` (index rows);
`docs/planning/work-order-map.md` (the candidates sections); the WO-090
order and its FINAL-001 (the earlier cut and what it kept);
`docs/planning/followups.md`; the
[2026-09-25 standard-pass planning document](../planning/standard-pass-2026-09-25.md)
§5.

**Objective:** a reader of the execution guide meets each rule once, in
the sentence where it applies, with a citation to its rationale; the
guide's candidates live in the map; every role skill's cold-start read
resolves unchanged; the guide is measurably smaller and its ceiling holds
it there.

**Observed gap (dated 2026-09-25, `main` at `64f9326f`):**

- 32 dated bold paragraphs (`**Operator correction (2026-09-07…)**`,
  `**Amendment (2026-09-17…)**`, `**Second consumption (2026-09-25)…**`)
  each restate a rule beside the sentence it amends; a cold-start reader
  reads both and reconciles them.
- Nine `## Candidate —` sections (about 480 lines, §Candidate — guided
  operator work orders through §Candidate — total subagent cap) sit
  between the guide's operating sections.
- WO-090's cut (1,933 lines on 2026-09-20) regrew by 598 lines in five
  days; the inflow check (WO-085) now precedes this fold.

**Design (scope discipline):**

- Fold, never delete a rule: for each dated paragraph, edit the governing
  sentence to state the current rule and append a bracketed citation
  (`[WO-041 breakout, 2026-09-07]`, `[vision-into-use pass, 2026-09-17]`);
  the rationale stays where it is recorded (decisions, planning documents,
  final reviews). Where a paragraph records history rather than a rule
  (the consumption paragraphs, the WO-053 amendment example), replace it
  with one citation line.
- Move the nine candidates to the map under their slugs; `npm run meta`
  reconciles the register; inbound links updated.
- Keep every `##` heading that a role skill's `Read:` line, a `Cites`
  line in a queued order, or the publication index names; the verifier
  checks the anchor list before and after.
- Record the before and after line and byte counts and lower 07's ceiling
  to the after count.
- **Declined alternatives, recorded:** a second cut of sections into other
  documents (WO-090 did the move; the residue is inline amendments);
  folding every product document in one order (one document per order so
  the verifier can read the whole diff against the whole document); a
  model-written summary of the guide (the rule text must be the rule).

**Deliverables:** the folded guide; the map sections; the register
reconciliation; the ceiling; the count record.

**Acceptance criteria (all required)**

1. Zero dated bold paragraphs and zero `Candidate —` headings remain in
   product 07 (the WO-085 check's baseline for 07 is emptied); every rule
   each removed paragraph stated is present in the sentence it governed
   (the verifier samples at least ten paragraphs against the diff and
   names them).
2. Every heading cited by a role skill, a queued order's `Cites` line or
   the publication index resolves after the fold; the docs check reports
   zero broken anchors.
3. The register carries each moved candidate as a duplicate of its map
   row with history retained; pending counts recorded before and after.
4. Product 07's byte count is recorded before and after and its ceiling
   lowered to the after count; the publication locks are refreshed.
5. Write-backs land: ledger entry; `docs/README.md` where it points at a
   moved candidate.
6. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the diff; the anchor list before and after; the register
counts; `npm run test:docs`; `npm test` at final review. No live row.

**Write-back duty:** as listed in criteria 4 and 5.

**Non-goals:** any change to a rule's meaning (a needed correction is a
finding for a separate decision); the other product documents (03, 02, 05
are later consolidation orders in the map's candidates); the sentence
WO-086 edits; the role skills.

**Operator-review assumptions**

1. Folding an amendment into its sentence, with a citation, preserves the
   record: the decision and planning documents keep the rationale and the
   date, and the guide keeps the rule.
