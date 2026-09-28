# WO-167 decisions

Dispatch: `resume: next`, 2026-09-28. Session: Claude Code 2.1.283
(`claude --version`), model claude-opus-5-5, effort max (`CLAUDE_EFFORT`
readback). One writer; one subagent, the D008 refuter with no descendants,
against the observed cap of 20.

Goal alignment: the fold removes product 07's standstill (9 bytes of headroom
at the base), which blocks WO-173, WO-172 and WO-086 from writing their
sentences, and a reconciliation of rule and amendment that every cold-start
reader of the guide pays; it does not itself advance the source-to-deliverable
loop. Policy resistance: the emptied docs-check baseline and the fold must agree
(D001), and WO-086's named sentence stays untouched. Commons: one careful
rewrite now against smaller reads at every cold start; the map grows by the
moved text, outside the ceiling, where planners read it on demand. Drift: the
lowered ceiling makes the smaller guide the standard (D007). Escalation: no new
mechanism; the register's rename reconciliation stays manual, as receipt 029
recorded (D005). Success to the successful: WO-090's move-to-other-documents
approach and a written summary are declined by the order. Shifting the burden:
the fold removes the reader's reconciliation, and nine untriaged map rows go to
the next pass by design (D005). Rule beating: the docs check judges shapes and
bytes, not meaning, so the fold table gives every paragraph's carrying sentence
for the verifier to read, and the skills' citations are proven by the strict
resolver rather than a check that cannot see them (D006). Seeking the wrong
goal: bytes are the proxy; no rule was cut to reach a number. Naive
Interventionism: a dated paragraph's useful function (provenance and date) moves
into its citation, and the rationale stays in the decision or planning document
the citation names; consumers (the skills' `Read:` anchors, open orders' `Cites`
lines, the publication index and locks, the register) were each checked before
and after. NoOp keeps the standstill and the reconciliation cost.

## WO-167-D001

```json
{
  "id": "WO-167-D001",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Fold every paragraph of product 07 whose bold lead holds a date: the 33 the order counts (standalone paragraphs, the planning passes' line-start rule), the 11 Discipline bullets whose bold lead holds a date, and the dated bold span inside the process-budget bullet's paragraph. In the same paragraphs, fold the WO-053 amendment example the Design names and the plain-text 2026-09-10 amendment of the question-is-not-a-waiver bullet. Leave undated bold markers and non-bold provenance sentences as they are.",
  "evidence": [
    "Product 07 is byte-identical at 5f3849ec and at this order's base ddb58d26 (2,617 lines, 188,390 bytes).",
    "At ddb58d26: 33 paragraphs start a line with a bold span holding a date; the Prettier Markdown parser the docs check uses finds 44 paragraphs whose first child is such a span (33 standalone, 11 list items); 45 bold spans hold a date in all. The same rules give 32 and 43 at 64f9326f and at 9cc597d7.",
    "docs/planning/standard-pass-2026-09-25.md §5 counted with grep -c -E '^\\*\\*[^*]*(2026-0[89]-…)', which no list item matches.",
    "docs/control/doc-baseline.json listed two of the eleven bullets as receipts of product 07 (Automate recurring procedure; Machinery stand-down); criterion 1 empties that baseline, and scripts/docs-check.mjs productContent reads every paragraph node, list items included."
  ],
  "rationale": "The order's rule and its count disagree only on list items. Criterion 1's emptied baseline decides two of the eleven bullets outright, and the other nine have the same shape; the fold moves only where each date sits, so folding all eleven leaves zero under either reading at the cost of eleven short rows.",
  "rejected": [
    {
      "option": "Fold only the 33 the order counts",
      "reason": "Two remaining bullets are receipts the emptied baseline no longer admits, so the docs check refuses them, and eleven bold leads holding a date would remain as paragraphs by the parser the check uses."
    },
    {
      "option": "Ask the operator which count governs",
      "reason": "The criterion's own emptied baseline forces two bullets and the rest are the same category; no answer would change the action."
    },
    {
      "option": "Also fold every non-bold dated provenance sentence",
      "reason": "Outside the order's category of dated bold paragraphs; each extra edit adds a row the verifier must judge."
    }
  ],
  "reopenWhen": "A verifier or reviewer reads the order's rule as excluding list items and judges the eleven bullet edits outside scope, or a dated bold lead is found in product 07."
}
```

## WO-167-D002

```json
{
  "id": "WO-167-D002",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Adopt script extraction for the fold table's carrying-sentence column: a scratch script finds each folded sentence by a unique phrase and checks that its bracketed citation keeps every date of the base lead; every extracted row is then read by hand.",
  "question": "Can a scratch script produce the fold table's 'sentence that now carries its rule' column for every row faster than assembling it by hand?",
  "alternatives": [
    "Assemble the column by hand from the edit notes, row by row.",
    "Extract each carrying sentence by script from a map of row to unique phrase, then read every row."
  ],
  "observation": "Pre-registered threshold: adopt only if the script finds exactly one carrying sentence for every row within 600 s. Result: 46 of 46 rows located on the first run, each carrying sentence holding a bracketed citation with its row's dates; 2026-09-28T16:08:37Z to 16:10:05Z, including writing the script and the row map.",
  "budget": { "wallSeconds": 600 },
  "execution": "run",
  "cost": {
    "wallSeconds": 88,
    "tokens": null,
    "commands": ["node <scratch>/fold-table.mjs <worktree> <scratch>/fold-rows.json"],
    "source": "Shell timestamps before writing the script and after printing its rows. Tokens are part of the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["node <scratch>/fold-table.mjs <worktree> <scratch>/fold-rows.json"],
    "summary": "No per-order saving is claimed: the hand alternative was not timed. The script is also a check a hand table lacks (a row whose citation loses its date fails), and each rerun after an edit took under two seconds."
  },
  "outcome": "adopted",
  "regression": false,
  "history": { "lastAdoptedImprovementAt": "2026-09-27", "experimentsSinceAdoption": null },
  "evidence": [
    "docs/evidence/WO-167/fold-table.md: the adopted column, one row per paragraph.",
    "docs/evidence/WO-163/decisions.md WO-163-D001: the latest experiment recorded as adopted, dated 2026-09-27; WO-164, WO-168, WO-169, WO-170 and WO-171 recorded experiments the same day, whose order against it no source records, so the count since stays null."
  ],
  "rejected": [
    {
      "option": "Hand assembly",
      "reason": "Forty-six rows of quoted sentences invite transcription drift that nothing would detect."
    }
  ],
  "reopenWhen": "A fold-table row is found whose sentence or citation the script misread, or a later fold order times hand assembly against the script."
}
```

## WO-167-D003

```json
{
  "id": "WO-167-D003",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Fold each dated paragraph by editing the sentence that states its rule and appending a bracketed citation, [source, date], linked where the paragraph linked its rationale. Keep an undated bold label where it names a rule (four paragraphs and eleven bullets). Where a dated paragraph restated a sentence the section already holds, keep the existing sentence and fold in only what it added: one order at a time through final review stays the §Independent workflows sentence it repeated; a sibling's publication and the verifier's observation join the existing not-a-failed-review sentence. Reduce history to citations: the two consumption paragraphs, the route catalog and design of the 2026-09-25 pass, the rationale and intake captures of the R1 replan and vision-into-use rules, and the WO-053 example. Drop the 2026-09-25 interim rule, which its own text bounded until WO-158 closed.",
  "evidence": [
    "docs/planning/r1-replan-2026-09-16.md lines 13-14 and docs/planning/vision-into-use-2026-09-17.md lines 19-20 record the two intake captures with their SHA-256 digests; the cited documents record the rules' rationale.",
    "The three rules inside the consumption paragraphs keep a home: closed entries leave the sequence (Standard artifacts), a finding half reserved by a standing operator direction stays recorded against it (the entropy reducer paragraph), an order's final criterion names both npm test and npm run test:docs (the work-order drafts bullet).",
    "docs/work-orders/README.md lists WO-158 under Closed (v0.49.0); the interim sentence began 'Until it closes'. The permanent forms stand in §Operator resume phrases (waive, withdraw, correct) and the role skills' off-ramps line.",
    "docs/evidence/WO-139/decisions.md WO-139-D002 (2026-09-18) records the WO-053 amendment."
  ],
  "rationale": "The order's objective is a reader who meets each rule once, where it applies, with a citation; the citation keeps the date and names the document that holds the reasons, so the fold removes the reconciliation without removing the record.",
  "rejected": [
    {
      "option": "Keep the intake capture paths and digests in the guide",
      "reason": "The cited planning documents already record them; in the guide they are provenance a reader must skip."
    },
    {
      "option": "Restate the WO-158 interim rule as permanent",
      "reason": "That would add a rule the paragraph scoped; the permanent forms already exist where they apply."
    },
    {
      "option": "A written summary of the guide",
      "reason": "Declined by the order: the rule text must be the rule."
    }
  ],
  "reopenWhen": "A role's receipt or decision cites a rule the folded guide no longer states, or a citation in the guide points at a paragraph or document that no longer holds the reason (receipt 029, finding 1)."
}
```

## WO-167-D004

```json
{
  "id": "WO-167-D004",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Place the nine candidates in the planning map under a non-candidate section, 'Moved from the execution guide (2026-09-28)', as level-three 'Candidate —' headings with their slugs. Keep their text byte-for-byte except that each dated lead becomes a status word and a bracketed citation, two links into product 05 and three into the planning directory are rebased, and two references that pointed within product 07 now name it. Remove the nine audience-status index rows; retarget product 05's one inbound link and its sentence; leave the map's two historical references to product 07 as written; keep product 07's bold 'Candidate — immediate working-state recovery' paragraph. The refutation-pass candidate held one live rule, the operator's platform-first standard that the planning refuter's subject reads from product 07; that sentence stays in product 07, in §Operator-opened planning pass beside the judgment rules, with the bytes the refuter reads unchanged.",
  "evidence": [
    "scripts/lib/planning-followups.mjs collectFollowupSources: a heading starting 'Candidates' harvests its section's list items or itself as rows, so a 'Candidates —' parent over the nine would add a tenth row; the section title chosen matches no candidate rule, and no line of the moved text starts a list item.",
    "docs/publication/audience-status-index.md covers every ATX heading of the numbered product documents only; check-publication reports 267/267 after the removal.",
    "docs/planning/work-order-map.md lines 202 and 496 sit in the dated record of the 2026-09-12 gate-cost pass and its NoOp digest; editing line 496 changed the source of FUP-19014370f2f92586 (settled), so both edits were reverted and the register rebuilt from HEAD before the dispositions.",
    "The 2026-09-17 register counts (Measured, follow-up register settlement) and the 2026-09-18 substance note (stale writer) are recorded in no planning document found by search, so the chronology keeps its figures in the map.",
    "scripts/docs-check.mjs counts only 'Candidate —' headings; the bold paragraph is not one, and its sentence now carries the 2026-09-25 routes' rule (fold table row 10).",
    "scripts/lib/plan-subject.mjs buildGoalSubject reads the platform-first standard from product 07 with /the point is to create a platform,[\\s\\S]*?before a later pass pays it again\\./ and throws 'product 07 platform-first standard missing' without it; npm run test:docs failed so after the move. With the sentence in §Operator-opened planning pass the extracted bytes equal those at ddb58d26, and the planning gate's platformStandard input matches receipt 033."
  ],
  "rationale": "The move keeps each candidate's evidence where planners read it, keeps every slug so references still name the section, and changes no candidate's substance.",
  "rejected": [
    {
      "option": "Fold each candidate's measurement chronology into one status paragraph",
      "reason": "Some figures exist only there, and the planner judges a candidate's reopening from that series."
    },
    {
      "option": "Retarget the nine index rows to the map",
      "reason": "The index covers product headings only."
    },
    {
      "option": "Update the map's two historical references",
      "reason": "They record what a dated pass decided, and one edit invalidated a settled register row."
    },
    {
      "option": "Move the bold immediate-recovery candidate too",
      "reason": "Outside the order's nine; it is not a heading the check reads, and it creates a new register row that a planning pass should choose."
    }
  ],
  "reopenWhen": "A consolidation order moves product 07's remaining candidate text, or a reader cannot find a moved candidate from a reference by its section name."
}
```

## WO-167-D005

```json
{
  "id": "WO-167-D005",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Reconcile the register in the order receipt 029 fixes: add the map sections, cut the candidates from product 07, sync, then apply nine duplicate dispositions as one --apply batch of nine requests at each row's missing revision (docs/evidence/WO-167/register-duplicates.json). Each duplicate names its map row and the predecessor's last disposition; the nine map rows stay untriaged for the pass that triages them. Product 05's Tinkerer / Scientist row, whose text changed only by the inbound-link retarget, is left needing review for the final review.",
  "evidence": [
    "Base (ddb58d26): 707 entries, 149 pending, revision efd20f2bac9d500609226fbdb226c3732ab461fb4a2966d5b733a57861fb9007.",
    "After the cut and sync: 716 entries, 163 pending (ten needing review, nine untriaged), revision 550933af82bc4156017f8b73db5c9cc8f19177600294caccee0efbbd30636e31.",
    "After the batch: 716 entries, 154 pending (144 deferred, nine untriaged, one needing review), 34 duplicates, revision 21bb91441e60011036ed7366eb9d54cc0192f433d3e2a5877af165f2b72c2508.",
    "Predecessors' last dispositions: FUP-0111 open; FUP-3e3dcc8781144d46, FUP-b8a329d9970b8206, FUP-3f2a874835f66bb5 and FUP-57257901a26aec18 deferred; FUP-baa0ea5df1f8e6a9 allocated (WO-132) and FUP-56b2d81b540555bb allocated (WO-137); FUP-6c401ec3e9e06edb and FUP-195ab93be762ad42 settled.",
    "scripts/lib/planning-followups.mjs followupStatus: a disposition holds only while its sourceRevision equals the row's revision count, so a disposition made before the cut would fall to needs-review when the cut appends the missing revision.",
    "docs/planning/followups.md: a touched row is fixed inside the Boy Scout bound or recorded as left in the order's decisions, and the final review disposes each listed row."
  ],
  "rationale": "The criterion names nine duplicate dispositions; carrying each predecessor's status to its new row is a planning disposition, which the duplicate's reason makes cheap for the next pass.",
  "rejected": [
    {
      "option": "Carry each predecessor's disposition to its map row now",
      "reason": "Eighteen requests where the criterion names nine, and each carried allocation or deferral is a planning judgment."
    },
    {
      "option": "Dispose before the cut",
      "reason": "The cut's missing revision would invalidate every disposition."
    },
    {
      "option": "Re-settle the product 05 row now",
      "reason": "The register procedure assigns a touched row to the final review."
    }
  ],
  "reopenWhen": "A pass cannot tell a moved row's status from its map row, or the final review finds a touched row without a disposition."
}
```

## WO-167-D006

```json
{
  "id": "WO-167-D006",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Prove that the role skills' and the instruction file's citations resolve with the harness library's strict resolver over CLAUDE.md and all twelve installed skills (18 of 18 anchored Read selectors resolve), and record that node scripts/harness-context.mjs --check, which criterion 2 names as that proof, exits 0 whether or not a cited heading exists.",
  "evidence": [
    "scripts/harness-context.mjs main runs measureColdStarts (scripts/lib/process-budget.mjs), which reads only CLAUDE.md and the skill files' byte counts; the strict resolution (directedReads, sectionRange) runs in measureHarnessContext, which scripts/test-harness.mjs and scripts/harness-evidence.mjs call, for the executor, verifier, reviewer and release-close roles only.",
    "Negative control, 2026-09-28, product 07 restored byte-identical afterwards: with '## Goal-aligned decisions' renamed '## Goal alignment decisions', node scripts/harness-context.mjs --check exited 0 with empty stderr, while measureHarnessContext() threw 'Unresolved required section: Goal-aligned decisions'.",
    "Positive run on the folded guide: readDirectives and sectionRange over CLAUDE.md and .claude/skills and .agents/skills for all six roles resolve 18 of 18 anchored selectors; with '## Operator-opened planning pass' renamed, the same command failed the two planner selectors.",
    "The same flow is in scripts/harness-context.mjs at 4c34b332, the base of the 2026-09-27 pass that recorded reproducing the refusal with this command.",
    "FUP-40f361277410f64f, the row for WO-085-D016's follow-up, is allocated to WO-167 on the premise that this command 'resolves every Read selector strictly' and failed on a renamed Goal-aligned decisions heading; the negative control above contradicts that premise for this command, while the strict resolution the proof here uses does fail on it. The final review disposes that row."
  ],
  "rationale": "Criterion 2's other checks and this command all report zero failures, but a proof that cannot fail proves nothing; the strict resolution is the same library code the harness suite uses, applied to every role.",
  "followup": "Decide how the skills' heading citations get a check that can fail: node scripts/harness-context.mjs --check measures cold-start bytes only and exits 0 with a cited product heading renamed, while measureHarnessContext covers four of six roles; either the check (or the document gate) resolves every installed skill's anchored Read selectors with sectionRange, or orders stop naming this command as that proof. Paths: scripts/harness-context.mjs, scripts/lib/process-budget.mjs, scripts/lib/harness-context.mjs, scripts/test-harness.mjs, docs/product/07-execution-guide.md §Read order for a cold start. Checks: node --test scripts/test-harness.mjs; npm run test:docs; the renamed-heading negative control in docs/evidence/WO-167/README.md. Priority: before the next order that renames a product 07 heading.",
  "rejected": [
    {
      "option": "Make harness-context --check resolve selectors in this order",
      "reason": "A documentation-only order; the command's documented contract is that budget observations never refuse, so a refusing mode needs its own decision, tests and the harness suite."
    },
    {
      "option": "Cite only the named command",
      "reason": "Its premise in criterion 2 does not hold."
    }
  ],
  "reopenWhen": "The follow-up lands, or a skill's heading citation breaks without any check refusing."
}
```

## WO-167-D007

```json
{
  "id": "WO-167-D007",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Lower product 07's ceiling to ceil(154,129 × 1.02) = 157,212 with 154,129 non-exempt bytes at landing, and empty its docs-check baseline. Prepare the patch release with release prepare --local. Discharge the ledger duty with this decisions file and its decisions-index row, as the generated work-order index directs. docs/README.md needs no change and no open order's Cites line needs a retarget, because neither cites a moved heading.",
  "evidence": [
    "Product 07: 188,390 bytes and 2,617 lines at ddb58d26 (ceiling 188,399, 9 bytes of headroom); 154,129 bytes and 2,068 lines after the fold, all counted (no exempt range).",
    "The planning map: 381,012 bytes and 2,282 lines at ddb58d26; 412,672 bytes and 2,780 lines after.",
    "docs/control/doc-ceilings.json policy: initial ceiling ceil(non-exempt bytes at landing × 1.02); consolidation lowers it in the same change; only a raise needs a planning decision.",
    "docs/work-orders/README.md WO-167 row: 'Inherited ledger duty: discharge with this order's decisions file when recorded and its row in the decisions index; no lifecycle ledger append.'",
    "docs/README.md refers to the execution guide at lines 14, 54, 85, 209, 272 and 307, each to the whole guide or to a section that stays (§Operator-opened ideation mode, §Operator resume phrases, §Operator-opened planning pass), never to a candidate; the 46 product 07 citations in open orders' Cites lines are the same before and after, none of a candidate heading."
  ],
  "rationale": "The ceiling rule every other product document follows gives the next order its two per cent of room and holds the guide at its folded size.",
  "rejected": [
    {
      "option": "Keep the old ceiling",
      "reason": "It would leave 34,270 bytes of room for the regrowth the order exists to stop."
    }
  ],
  "reopenWhen": "A later change needs to raise product 07's ceiling (a planning decision, per the check), or product 07 changes on main before this order lands, which changes the landing count."
}
```

## WO-167-D008

```json
{
  "id": "WO-167-D008",
  "date": "2026-09-28",
  "dispatch": "resume: next; operator answer to the goal-section conflict: commits and refutation",
  "decision": "Folding the two dated paragraphs of §Goal-aligned decisions, which criterion 1 requires, changes the goal standard the planning gate binds byte-for-byte to receipt 033, and no executor route exists. On the operator's authorization, follow WO-090-D006: after the product gate, commit the changed planning inputs (product 07 and this order's assigned title) with this decision record locally, refresh and commit the planning cost table, run one pass-scoped direct refutation with one fresh background worker and no descendants, and file it through the receipt helper. No push, pull request, integration or publication is authorized; independent verification stays a separate dispatch.",
  "evidence": [
    "node scripts/refute-plan.mjs check at the base ddb58d26, in a temporary detached worktree built and then removed: exit 0; judged, committed and workspace subjects all sha256:9b06eead1ffdebcdf1827b5f1455cdad71b8a0d418bce0004dc104c96b1c08fa.",
    "After the fold: 'planning pass needs a receipt matching the current subject: observed evidence or goal standard changed'; of the goal review's platformStandard, goalStandard, criticalPath and evidenceHash, only goalStandard differs from receipt 033's judged subject.",
    "scripts/lib/plan-subject.mjs section(): the raw bytes of §Goal-aligned decisions; scripts/lib/plan-continuation.mjs checkPlanContinuation: exact comparison, with no admitted update for the goal standard.",
    "npm run test:docs labelled the plan failures inherited against the base; the direct run at the base passes, so that label is wrong for this case.",
    "docs/evidence/WO-090/decisions.md WO-090-D006: operator-authorized local commits and one refutation, the one precedent; its follow-up FUP-50a41e39f51a3e01 is deferred until another execution order needs to edit the bound goal standard.",
    "Operator answer in this session, 2026-09-28, to the question naming the conflict and three routes: 'Commits + refutation (Recommended)'."
  ],
  "rationale": "The fold's rules are unchanged, but the gate binds exact text and a self-attested equivalence is not its required judgment. The precedent resolves this occurrence without weakening either check; the recurring conflict is recorded against WO-090-D006 as its reopening observation rather than solved by a machinery change inside a documentation order.",
  "rejected": [
    {
      "option": "Leave §Goal-aligned decisions unfolded and seek a waiver of criterion 1",
      "reason": "The operator chose the precedent, which keeps the criterion whole."
    },
    {
      "option": "Pause for a planning pass to design the route",
      "reason": "Not chosen by the operator; the precedent is available now."
    },
    {
      "option": "Change the planning gate in this order",
      "reason": "A documentation-only order; the route is planning's to design (FUP-50a41e39f51a3e01)."
    }
  ],
  "reopens": {
    "decisionId": "WO-090-D006",
    "observation": "WO-167, a second execution order, needed to edit the bound goal standard (criterion 1 folds two dated paragraphs of §Goal-aligned decisions); the operator authorized local commits and one refutation again on 2026-09-28."
  },
  "reopenWhen": "The refutation finds an observed blocking mismatch, the committed subject differs from the reviewed bytes at final review, or an executor route for an authorized goal-standard edit lands."
}
```

## WO-167-D009

```json
{
  "id": "WO-167-D009",
  "date": "2026-09-28",
  "dispatch": "resume: next; within the operator's authorization of local commits (WO-167-D008)",
  "decision": "Commit the rest of the stable product-document change locally (b1745981) so the committed tree agrees with the folded guide committed for the refutation, and read the first gate run's failure as the known WO-143 lock-matrix deadline (FUP-1d57cbcb226d8f8a, allocated to WO-173), not a defect of this order. The product gate then passed.",
  "evidence": [
    "npm test run 1, 2026-09-28T16:39:18Z, before any commit: 27 passed, 1 failed (skeleton: 'WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers', test timed out after 240000 ms), 379.66 s, code identity 8d9335071cb792b7aa62ac090e93d7a08bb840b539c1dd36b9be15f5abd5cb1a.",
    "npm test run 2, 16:47:51Z, after commits 76979cc2 and 2f508b69: skeleton passed and worktree-integration failed five subtests; its real-Git fixture builds from the committed tree, where product 07 was folded but the publication index still listed the nine candidate rows ('index coverage failed: 0 missing, 9 extra'); run 1 had passed that suite on the uncommitted tree.",
    "npm test run 3, 16:55:13Z, after b1745981: 28 passed, 0 failed, 375.56 s, 72 fresh tasks, exit 0, same code identity, tested tree 572f1d2b1bbd60a662b3841053806279a21377a7.",
    "docs/planning/followups.json FUP-1d57cbcb226d8f8a: allocated to WO-173; four earlier records of the matrix cancelled at 240 s, three followed by a passing rerun; reopen when WO-173 closes without the eight subtests or a cell is cancelled at its own deadline while no sibling gate runs.",
    "The code identity excludes docs/ and root Markdown, which are all this order changes."
  ],
  "rationale": "Run 2's failure came from the partial commit, not from the fold: a commit of the planning inputs alone left the committed tree internally inconsistent. The coherence commit contains only files the planning subject does not read, so the refutation's frozen subject is unchanged; the evidence files and lifecycle projections stay uncommitted for final review.",
  "rejected": [
    {
      "option": "Leave the partial commit and rely on the final review's commit",
      "reason": "Any product gate before final review, the verifier's included, would fail on the incoherent committed tree."
    },
    {
      "option": "Record the lock-matrix timeout as a new follow-up",
      "reason": "It is allocated to WO-173 with a reopening condition this run does not meet (WO-173 has not run)."
    }
  ],
  "reopenWhen": "The WO-143 lock matrix times out again on this subject while no sibling gate runs, or worktree-integration fails on the coherent committed tree."
}
```

## WO-167-D010

```json
{
  "id": "WO-167-D010",
  "date": "2026-09-28",
  "dispatch": "resume: next; completion advisory on touched follow-up rows",
  "decision": "Leave the seven pending rows the implementation-ready advisory lists for the final review to dispose: FUP-dde0b0bf89f86cfc is this order's own D006 follow-up, and the other six match a touched file by text only and name seams this order does not open.",
  "evidence": [
    "npm run plan -- followups --touching after implementation-ready, 2026-09-28: seven rows.",
    "FUP-dde0b0bf89f86cfc (WO-167-D006, untriaged): the harness-context proof gap, recorded with its follow-up.",
    "FUP-7308cb30f71fb745 (deferred, per-document consolidation after the guide): products 03, 02 and 05 are this order's non-goals.",
    "FUP-50cda1c03ecd8ea8 (WO-171-D014), FUP-56b599e15f97e666 (WO-099-D027), FUP-acfe4bfda716d8fb (WO-158-D008), FUP-f1c7a256bec46737 (WO-054-D006) and FUP-fd05316b6030ef73 (WO-168-D009), all deferred: prune usage retention, resident-state wording, usage attribution, the executor cold-start ceiling and a Codex reservation text pass; each matched meta.json, product 07, current.md or README.md by text, and none is changed in meaning by the fold."
  ],
  "rationale": "The register procedure has the executor fix a touched row inside the Boy Scout bound or record it as left, and never widen the order; none of these is a bounded fix inside a documentation fold.",
  "rejected": [
    {
      "option": "Dispose the six unrelated rows in this order",
      "reason": "The register procedure gives each listed row's disposition to the final review."
    },
    {
      "option": "Fix one of them in this order",
      "reason": "None is a bounded fix inside the fold, and the per-document consolidation is a named non-goal."
    }
  ],
  "reopenWhen": "The final review finds one of these rows changed in meaning by the fold."
}
```

## WO-167-D011

Dispatch: `resume: fix`, 2026-09-28, repairing
[VER-001](../../verifications/WO-167/VER-001.md) F1. Session: Claude Code
2.1.283, model claude-opus-5-5, effort xhigh (`CLAUDE_EFFORT` readback). One
writer; no subagents (0 of the cap of 20, none planned). The D002 experiment is
this order's one economy trial; the repair starts no second one.

Goal alignment: criterion 2 names a proof that could not fail, so the order
cannot pass final review, and the three queued writers to product 07 wait on it.
Rule beating is the trap VER-001 names: a green exit stood in for a resolution
the command never ran, and the npm-test suite that runs it is described as "role
read contracts resolve". Shifting the burden: NoOp or a substitute ad-hoc script
leaves the next moved heading to be found by a role at cold start. Policy
resistance: budget observations stay advisory, as WO-155 decided; only an
unresolved read refuses, which is the resolver's existing contract
(`directedReads` already throws). Escalation: no new gate, flag or suite; the
existing `harness-context` suite and its preflight already run `--check`.
Commons: the resolution took 7 ms in process; the whole command ran 0.08 to
0.09 s real before and 0.09 s after, three runs each on this host. Drift,
success to the successful and seeking the wrong goal: the check's measurement
output is byte-identical, so the meter and its trends are
unaffected. Naive Interventionism: the refusal can block a heading rename, which
is its purpose; the fix for that is to change the skill's anchor in the same
change. NoOp keeps a failed criterion or asks the operator to waive it.

```json
{
  "id": "WO-167-D011",
  "date": "2026-09-28",
  "dispatch": "resume: fix (VER-001 F1)",
  "decision": "Repair F1 by the verifier's first route: node scripts/harness-context.mjs --check now resolves every document selector the installed floor's and all twelve role skills' Read directives name, with the strict resolver (readDirectives, sectionRange), and exits 1 naming each unresolved required section or file; budget advisories still never refuse and the measurement output is unchanged. A regression in scripts/test-process-debt.mjs renames a cited heading and removes a skill the floor reads. Product 07's sentence on --check is reworded in the same 104 bytes, so the guide stays at D007's landing count and ceiling.",
  "evidence": [
    "VER-001 F1 (major): the named command measured bytes only and exited 0 on the renamed-heading negative control; repair must make it enforce the promise with a renamed-heading regression, or obtain an authorized criterion amendment.",
    "scripts/test-runner.mjs describes the harness-context suite, which runs node scripts/harness-context.mjs --check as a fast preflight task, as 'role read contracts resolve and remain within cold-start bounds'.",
    "Positive, real repository, 2026-09-28: exit 0, empty stderr; 18 anchored and 17 whole-file document selectors resolve across CLAUDE.md and the twelve skills (task selectors such as @work-order are skipped as task input).",
    "Negative control, product 07 copied aside, '## Goal-aligned decisions' renamed, restored byte-identical (cmp): exit 1 with twelve lines, one per skill in both roots, each ending 'Unresolved required section: Goal-aligned decisions'; standard output byte-identical to the positive run.",
    "The new test fails on HEAD's scripts/harness-context.mjs (exit 0 where 1 is expected) and passes on the repair; node --test scripts/test-process-debt.mjs: 116 passed, 0 failed.",
    "A first wording added 183 bytes to product 07 (154,312); node scripts/docs-check.mjs then refused the recounted ceiling 157,399 as a raise over HEAD's committed 157,212 without a planning decision. The sentence '`--check` evaluates and prints budget advisories without refusing; no flag prints the measurement alone.' became '`--check` refuses any unresolved `Read:`, never a budget advisory; no flag prints the measurement alone.', both 104 bytes, so product 07 is 154,129 bytes and 2,068 lines and D007's ceiling of 157,212 stays exact.",
    "node scripts/refute-plan.mjs check after the product 07 edit: judged, committed and workspace subjects equal (sha256:eeda3b95…); the edit is outside the bound goal standard.",
    "D006's follow-up (register row FUP-dde0b0bf89f86cfc) is discharged by this repair, and the premise under which FUP-40f361277410f64f was allocated to this order now holds; both rows are left for the final review to dispose, as D010 does for the touched rows."
  ],
  "rationale": "The criterion's words are the contract: the named command must be able to fail on a moved heading. The strict resolver already exists and already defines the failure message; wiring it into the command's check mode is one function and one test, and it makes the gate description true.",
  "rejected": [
    {
      "option": "Amend criterion 2 to name D006's ad-hoc resolver script",
      "reason": "Needs operator authorization and leaves a gate task whose description claims a resolution it does not run; the next order would inherit the same false proof."
    },
    {
      "option": "Resolve the reads in the document gate (docs-check) instead",
      "reason": "Criterion 2 names harness-context --check, and the docs check deliberately reads the skills' inline-code citations as nothing (WO-085 D016)."
    },
    {
      "option": "Extend measureHarnessContext to six roles",
      "reason": "It compares fixture selectors against a frozen activation baseline for byte deltas; it is not a check of the installed skills' own reads."
    },
    {
      "option": "Keep D006's rejection (no refusing mode in a documentation order)",
      "reason": "VER-001 routes the repair to the check; the refusal is limited to unresolved reads, so D006's concern that budget observations never refuse still holds."
    }
  ],
  "reopenWhen": "A skill or floor Read selector is found unresolved while harness-context --check exits 0, or the check refuses a selector the strict resolver in directedReads accepts."
}
```

## WO-167-D012

<!-- integration refs/dotln/checkpoint/WO-167/6 -->

```json
{
  "id": "WO-167-D012",
  "date": "2026-09-28",
  "dispatch": "resume: fix; worktree integrate WO-167; completed by resume: final review (FINAL-001)",
  "decision": "Integrated main at 0f3498a6 (WO-060, published as v0.53.0) into the branch at 8541e0d4 as merge commit 49de2a30, during the VER-001 repair at the operator's direction (D013); checkpoint and named stash retained. The final review assessed the two authored resolutions and the resolved register. README.md's release block names only this order's line, retimed from v0.52.11 to v0.53.1 over the v0.53.0 tag. docs/product/06-roadmap.md keeps both activation paragraphs, WO-167's above WO-060's, and WO-167's retiming paragraph. docs/planning/followups.json keeps every row of main and of the branch, each with its revisions and dispositions as a prefix of the merged row. Main's change touches none of this order's surfaces, and no resolution changed a WO-167 criterion, behavior, contract or authority.",
  "evidence": [
    "refs/dotln/checkpoint/WO-167/6",
    "base 8541e0d42a2cd26cf4e9c2dda2173b18996453a1",
    "upstream 0f3498a6ec80375728192dde872515a97d447907",
    "Final review, 2026-09-28: git diff --stat ddb58d26 0f3498a6 over docs/product/07-execution-guide.md, docs/planning/work-order-map.md, docs/control/doc-ceilings.json, docs/control/doc-baseline.json, docs/publication/audience-status-index.md and docs/product/05-pattern-library.md is empty.",
    "Final review, row comparison of the working register with main's and the branch's: 709 rows on main, 717 on the branch at 8541e0d4, 719 merged; none missing, none whose revisions or dispositions diverge from either side.",
    "git ls-remote origin names main at 0f3498a6 and tag v0.53.0 on it; no v0.53.1 tag exists locally or on origin.",
    "The final review's npm test -- --review on the integrated subject: 35 passed, 0 failed, 636.58 s, 79 fresh tasks, exit 0, recorded 2026-09-28T19:02:01.738Z, code identity 5c5161546bb104cecae87d3261f6130bc41b2651f16bc564ccaf07202d300e53."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-28. Original base: `8541e0d42a2cd26cf4e9c2dda2173b18996453a1`.
Fetched main: `0f3498a6ec80375728192dde872515a97d447907`. Checkpoint: `refs/dotln/checkpoint/WO-167/6`.
Named stash retained: `a177676d9fab8160bad75741c59d3c7274f7784e` (WO-167 integrate 2026-09-28).
Resolved projections: docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/control/current.md, docs/work-orders/README.md.
Release preparation: WO-167 target v0.53.1 remains current. Files changed: docs/evidence/WO-167/meta.json, docs/final-reviews/WO-167/PR.md. Meter snapshot: docs/evidence/WO-167/meta.json, 3208 bytes. Tag observation: local snapshot only.
Carried-forward claims: the order, VER-001 and VER-002 keep their recorded subjects. VER-002 judged the integrated subject (49de2a30 plus the working tree), so its six criterion judgments were made on the merged bytes and none is carried across bases; VER-001's judgments other than F1 concern surfaces main did not touch. The repair's D013 fixes were made after the merge and judged by VER-002. Final review owns its independent acceptance judgment, recorded in [FINAL-001](../../final-reviews/WO-167/FINAL-001.md).
Authored conflicts observed: README.md, docs/product/06-roadmap.md.
Affected checks: the helper selected npm test -- --review, publication, harness and local release checks. The repair's executed results are in the evidence README; the final review's gate and checks are in FINAL-001. This integration supplies no acceptance verdict.

## WO-167-D013

Dispatch: `resume: fix`, 2026-09-28, during the VER-001 repair. Operator
direction in this session, verbatim: "just deal with merging in main now ffs".
Session as in D011; no subagents.

Goal alignment: the sibling WO-060 published `v0.53.0` on main at 13:56, so
this order's unpublished `v0.52.11` collided and every release and planning
check on the branch had to meet the merged tree before final review could
pass. The operator moved that integration from final review into this repair.
Shifting the burden: each defect below would otherwise have stopped the final
reviewer at the same point. Rule beating and policy resistance: both fixes
admit only what the existing design already calls bookkeeping (the recorded
phase and order path; a release label) and keep every other refusal.
Escalation: no new command, gate or event; one receipt field and one update
kind. NoOp leaves `--continue` unusable for any order whose control log is
uncommitted, and the planning gate red after any collision retime of a judged
title.

```json
{
  "id": "WO-167-D013",
  "date": "2026-09-28",
  "dispatch": "resume: fix; operator direction: \"just deal with merging in main now ffs\"",
  "decision": "Integrate main now with npm run worktree -- integrate WO-167 (merge commit 49de2a30, base 8541e0d4 to upstream 0f3498a6, checkpoint refs/dotln/checkpoint/WO-167/6, named stash a177676d retained), and repair the two defects the integration met: --continue and the README release-block projection now fall back to the phase and order path the receipt recorded while the uncommitted control log is in the integration's own stash; the planning continuation admits one replacement of a judged release label as a release-retiming update.",
  "evidence": [
    "First pass: authored conflicts README.md and docs/product/06-roadmap.md. README kept this branch's unpublished v0.52.11 line for the retime; product 06 kept both activation paragraphs, WO-167 above WO-060, as main orders WO-162 above WO-163.",
    "--continue refused 'integrate requires the selected order in repairing or final-review': scripts/lib/worktree-integration.mjs read the phase from docs/control/orders/WO-167.jsonl, which is untracked and was in the integration's --include-untracked stash; the receipt already recorded phase at the start. The README release block was reported as authored for the same reason: mixedProjection reads the order path from the same log.",
    "After the phase fallback, the stash applied with one conflict: the retiming paragraph an earlier release prepare --local in this repair had written (before the merge) against product 06; resolved after WO-167's activation paragraph, as main places WO-162's retiming. The completing pass regenerated runtime, bundle, projections, release preparation (v0.53.1 current), indexes and locks, and wrote the D012 stub.",
    "node scripts/refute-plan.mjs check then refused 'existing work-order bytes changed'. With the title's label set back to v0.52.11 (probe restored byte-identical by cmp) it exited 0, so the retime was the only cause. Receipt 034 judged the labelled title because D008 committed it before the refutation; releaseAssignment admitted a label only on a placeholder or unlabelled title, and plan amend-order normalizes the label on both sides (scripts/lib/plan-receipts.mjs amendPlanOrder with executionAmendmentSource; the WO-158 fixture asserts a label-only change is no amendment), so it refuses 'order has no substantive execution amendment'; no route existed. The amend-order refusal is read from source and that fixture, not run here.",
    "After the fix: the planning check exits 0 and reports WO-167 as release-retiming from v0.52.11 to v0.53.1 beside WO-060's release-assignment v0.53.0.",
    "Regressions, each failing on HEAD's source and passing on the repair: 'WO-167 continuation admits one collision retime of a judged release label, and nothing else' (scripts/test-plan-refutation.mjs; HEAD refuses with 'existing work-order bytes changed'), and 'WO-167 --continue judges the recorded phase while the uncommitted control log travels in the stash' (scripts/test-worktree-integration.mjs).",
    "The Follow-up Queue stays at revision 0: both fixes were made inline to finish the directed merge, so a queue, announce, start, complete sequence written afterwards would misstate their order; this record is their receipt."
  ],
  "rationale": "The operator directed the merge now; finishing it meant the integration command had to complete and the merged tree had to pass the planning gate. Both defects sit on the integration path every later order takes, and each fix is the smallest that admits what the existing design already names as bookkeeping.",
  "rejected": [
    {
      "option": "Leave the integration to final review",
      "reason": "The operator directed it now."
    },
    {
      "option": "Finish the merge by hand (commit, git stash apply, regenerate) around the refusing --continue",
      "reason": "Loses the receipt's generation and draft record, and leaves the refusal for every later order with an uncommitted log."
    },
    {
      "option": "Set the title back to v0.52.11",
      "reason": "Release preparation targets v0.53.1 above the v0.53.0 tag; it only moves the same refusal to final review."
    },
    {
      "option": "Run a fresh planning refutation for the label",
      "reason": "D008's pass took 2,401,703 ms to dispatch and file; a release label is bookkeeping that the gate's amendment matching already normalizes."
    },
    {
      "option": "plan amend-order WO-167",
      "reason": "By its source and the WO-158 fixture, it treats a label-only change as no substantive execution amendment."
    }
  ],
  "reopenWhen": "A retime admitted as release-retiming hides a change other than the title's release label, or an integration continuation proceeds for an order whose recorded phase no longer holds once its log is restored."
}
```

## WO-167-D014 — correction: the consolidation row's condition occurred at the final-review pass

Dispatch: `resume: final review`, 2026-09-28, after the result transition.
Session: Claude Code 2.1.284, model claude-opus-5-5, effort xhigh
(`CLAUDE_EFFORT` readback); no subagents.

```json
{
  "id": "WO-167-D014",
  "date": "2026-09-28",
  "dispatch": "resume: final review (FINAL-001), after final-review-result pass",
  "decision": "Correct the final review's disposition of FUP-7308cb30f71fb745 (per-document consolidation after the guide, reopening when WO-167 closes). FINAL-001's Rows table and the deferral it applied say the condition falls at release close, not at final review; that was misread. The final-review pass itself moves an order to phase closed. The row is now open for the next planning pass. FINAL-001 is filed and stays as written; this record and the register carry the correction.",
  "evidence": [
    "docs/control/orders/WO-167.jsonl: FinalReviewCompleted at 2026-09-28T19:06:52.862Z; npm run resume -- status --json then reports phase closed.",
    "docs/work-orders/README.md after the transition: WO-167 is marked final-reviewed, and the orders that depend on it read 'WO-167: hard (met)'.",
    "The register's latest disposition of FUP-7308cb30f71fb745 after the correction is open at source revision 1, applied at revision e52a94b4 through docs/control/local/plan/WO-167-final-review-correction.json."
  ],
  "rationale": "A reopening condition that has occurred cannot stay deferred on the same words. The row asks planning for one consolidation order per document after the fold proves the method, and FINAL-001 records the fold's measurements.",
  "rejected": [
    {
      "option": "Edit FINAL-001's row",
      "reason": "A filed report is immutable once its hash is recorded; corrections go in a decision."
    },
    {
      "option": "Leave the deferral for release close to trigger",
      "reason": "It states a false fact about when the condition holds, and nothing at release close re-reads the row."
    }
  ],
  "reopenWhen": "The next planning pass finds the row's condition read differently, or a later final review defers a row on the same misreading of when an order closes."
}
```
