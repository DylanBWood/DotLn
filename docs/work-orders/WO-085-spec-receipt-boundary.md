# WO-085 — Product documents stop accreting: a docs check bounds each product document's bytes, refuses a new dated receipt paragraph or candidate heading under `docs/product/` and a quoted operator message in a decision record, resolves every in-repo link and anchor, and the write-back rule is edit-in-place (v0.52.2)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. One document-gate check, one control
file, two product-document sentences bound to it; no product code, contract
or role-text change. Assigned at activation under the standing opt-out
default.
**Cost:** adds `scripts/docs-check.mjs` to the document gate
(`npm run test:docs`), reading `docs/control/doc-ceilings.json` (bytes per
product document, set by this order at each document's size when it lands
and lowered by any later consolidation order in the same change; raising a
ceiling requires a planning decision named in the file); a baseline list of
the dated bold paragraphs and candidate headings present at activation, so
only additions fail; the rule that a decision record's `dispatch` field
carries a control prefix and a paraphrase (baseline exempt; WO-153 D008);
the anchor and link resolution WO-090 D007 carried in; the edit-in-place
sentence in product 07 §Documentation freshness and ownership (written by
the 2026-09-25 pass) and 08 §Freshness and ownership, each naming the
check. Removes: the growth path the measurements below show, at its inflow;
this order moves nothing. Exempt: generated blocks between markers; the
whole of 06 §Release boundary until WO-086 retires it, because product 07
§Discipline has every activation write a dated paragraph there and
`release prepare` writes the collision note (receipt 029, WO-085 finding
1); `docs/planning/`, evidence, verifications and reviews. Exempt text is
excluded from a document's byte count, and each ceiling carries two per
cent headroom above the non-exempt bytes at landing so an in-place edit
fits (receipt 029, finding 2). Re-mints: none (no registered evidence source is edited).
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-035's spec/receipt item, cut into a bounded
child at the operator's 2026-09-08 correction; held 2026-09-19 to be
rewritten (its check would have refused `release prepare`'s own roadmap
note); rewritten by the 2026-09-25 standard pass at the operator's item 4
("docs/product docs becoming a cancer: all adds, ballooning in size, AI
slop"). Register rows FUP-87ed701db7d7209e (WO-153 D008) and the WO-090
D007 carry-in. Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** none open. The 2026-09-08 planning deferral until WO-053
lapsed at WO-053's close (2026-09-18); WO-069 landed the configuration
root this check reads document roots through.
**Recommended placement:** paired with WO-166 directly after WO-070 and
WO-115. This order adds a script under `scripts/` and a control file and
edits products 07 and 08; WO-166 edits the harness runtime and the
loadout. Disjoint files; neither depends on the other; only WO-166
re-mints. WO-167 (the guide's fold) and WO-086 (the roadmap's generated
history) run after this order so the check keeps what they remove from
returning. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-053",
    "relation": "satisfied-by-close",
    "reason": "the 2026-09-08 planning deferral lapsed at its close on 2026-09-18"
  },
  {
    "workOrderId": "WO-069",
    "relation": "satisfied-by-close",
    "reason": "reads document roots through the configuration root"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Documentation
freshness and ownership (the edit-in-place rule) and §Discipline (no
ratchet creep); 08-publication-compiler.md §Freshness and ownership;
03-architecture.md §Corpus policy; `scripts/check-publication.mjs` (no size
check today); `scripts/test-runner.mjs` (the `--document` task list);
`scripts/lib/release-preparation.mjs` line 120 (the machine-written note
shape the check admits until WO-086); `docs/evidence/WO-090/decisions.md`
D007 (the anchor rules); `docs/evidence/WO-153/decisions.md` D008; the
[2026-09-25 standard-pass planning document](../planning/standard-pass-2026-09-25.md)
§5.

**Objective:** a product document cannot grow past its recorded ceiling,
gain a dated receipt paragraph or a candidate heading, or link to a heading
that does not exist, without the document gate refusing; a decision record
cannot quote the operator's message as its dispatch; and the written rule
every role reads says to edit the sentence that changed rather than append
a dated paragraph.

**Observed gap (dated 2026-09-25, `main` at `64f9326f`):**

- `docs/product/` is 1,048,121 bytes across fifteen documents, from
  296,483 on 2026-09-01 (3.5×) over 164 commits, 13,033 lines added and
  2,827 deleted; 03 is 171,984 bytes, 07 is 181,458 and 06 is 148,793.
- 183 dated bold paragraphs sit under product headings (06: 107; 07: 32;
  03: 23; 05: 8) and 64 `Candidate —` headings (05: 21; 07: 9; 03: 8; 06:
  6). Every order and pass appends; the freshness rule says not to rewrite
  history, and nothing says to edit in place.
- WO-090 cut product 07 to 1,933 lines on 2026-09-20; it is 2,531 lines
  five days later. A consolidation without an inflow check is undone.
- Neither `check-publication` nor the document gate has a size, receipt or
  candidate check; links and anchors are healthy but unchecked (the
  2026-09-08 observation still holds).
- The 2026-09-19 hold's objection: a receipt check refuses the release
  tool's own roadmap note. Answered by exempting that exact shape until
  WO-086 retires the note.

**Design (scope discipline):**

- Ceilings: `doc-ceilings.json` lists each product document, its ceiling
  in bytes (non-exempt bytes at landing plus two per cent), the date and
  the decision that set it; a document over its ceiling fails with the
  overage and the remedy; a document absent from the file fails. Exempt
  regions (marker blocks; 06 §Release boundary until WO-086) are excluded
  from the count, and the check prints the exempt bytes separately.
- Receipt shape: a paragraph beginning `**…(YYYY-MM-DD…):**` or
  `**…(operator direction…)**` under `docs/product/`; the baseline
  enumerates the existing ones by document and nearest heading; an addition
  fails with "edit the sentence the change amends; a receipt belongs in the
  order's evidence README".
- Candidate shape: a `## Candidate —` or `### Candidate —` heading under
  `docs/product/`; baseline as above; an addition fails with "candidates go
  to the planning map".
- Decision dispatch: the field matches a control prefix (`planning:`,
  `ideation:`, `resume:`, `scope expand:`, `conversation only:`,
  `analysis:`, `operator override:`) followed by at most 240 characters of
  paraphrase; existing records are baselined.
- Links and anchors: as WO-090 D007 (in-repo Markdown anchors resolved
  against target headings; hand-written links; the 41 unresolved decision
  anchors in closed reports declared historical).
- The check prints one table (document, bytes, ceiling, headroom) and
  exits nonzero on any failure; it runs in the document gate only.
- **Declined alternatives, recorded:** moving the existing receipts in this
  order (WO-167 folds product 07; the roadmap's notes go with WO-086 and
  its candidates with WO-087; the rest are later consolidation orders, one
  per document); a repository-wide byte budget (a reader pays per
  document); deleting candidates; a check on prose quality (no rule a
  gate can judge; the ceiling is the proxy the operator can read).

**Deliverables:** the check; the ceilings file; the baselines; the two
bound sentences; the write-backs below.

**Acceptance criteria (all required)**

1. On fixtures, the check fails for a document over its ceiling, a new
   dated receipt paragraph, a new candidate heading, a broken anchor, a
   missing file and a dispatch field without a control prefix; it passes on
   the current tree.
2. `doc-ceilings.json` names every product document; each ceiling equals
   the document's non-exempt bytes at landing plus two per cent, and the
   check refuses a document the file omits; a fixture activation-style
   paragraph under 06 §Release boundary passes while WO-086 is unmerged.
3. Products 07 and 08 state the edit-in-place rule and name the check;
   `docs/README.md` points at it.
4. Write-backs land: ledger entry; publication locks; register row
   FUP-87ed701db7d7209e retargeted (the sweep of existing records is not in
   scope and stays named there).
5. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`; `npm test`
at final review. No live row.

**Write-back duty:** as listed in criteria 3 and 4.

**Non-goals:** moving or folding existing text (WO-086, WO-087, WO-167);
the sweep of committed decision records for quoted operator chat (WO-153
D008's first clause); a prose-quality judge; the planning documents.

**Operator-review assumptions**

1. A ceiling at today's size is the right first setting: every later
   addition must remove something, and a consolidation order lowers the
   ceiling it earns.
2. Refusing new dated paragraphs does not lose history: the order's
   evidence README is the receipt's home and the decisions index exposes it.
