# An attack on the first direction for WO-288, 2026-11-25

Record of the [2026-11-25 planning pass](data-is-the-record-2026-11-25.md). A research worker was given the session's first draft of a direction for WO-288 and one task: to find every way the order could still be returned with it in force. The draft it attacked and the text it returned were both superseded by the room's direction. This is a worker's report as returned, changed in three ways only: a checkout's absolute path is replaced by its name (`worktree:` marks a path in WO-288's worktree, whose files are not on `main`), its headings are set one level down, and the repository's formatter has laid out its Markdown. It is a worker's reading: what the pass checked itself is said in the pass document. The worker was the instance's `default` worker, and the host reported claude-opus-5-5.

I read everything you assigned in `the WO-288 worktree` and wrote nothing. I ran no tests or gates, only read-only greps and git ref reads. I did not read the planning pass document, VER-001 to VER-011, the Part records, the review reports, all of `handoff.md`, or §Independent workflows. I also could not tell whether the recorder is a judged feedback source, or how long the current repair dispatch has been running.

### 1. Holes, most likely first

1. **The direction only reaches verifiers and reviewers through the order's text, and the draft does not say where to write it.**
   - The order's precedence sentence covers only the executor's role text (order 187-190).
   - Product 07's queue-form rule 9 (2819-2828) still sends readers at final review and makes a regression block whatever was read.
   - Role texts that require readers, a full-diff read or blocking on regressions: verifier SKILL 67, 69, 72; reviewer SKILL 9, 10, 68, 75.
   - Verifiers apply amendments literally, criterion by criterion. VER-015 (lines 95, 117) honoured D265 on 23 and 34. D326 (decisions 12776) notes the order "says nothing of the kind for criterion 25". A critic point undid VER-013's carry-over of D265 to criterion 25 (VER-013 121, 221).
   - **Fix:** name the places to write it: the frame's opening sentence, rule 9 in place of its sentence about VER-011, criteria 14, 25 and 27 inline (the way D265 amended 23 and 34), and Known issues, which the verify briefing prints (product 07 4088).

2. **The draft limits which findings block, but a fail is triggered by any unmet criterion line.** A pass is refused over any unmet line (verifier SKILL 83; product 07 4056-4060). A verifier who judges, say, criterion 13 or 38 unmet on its wording must fail, even if the draft calls the finding a follow-up. **Fix:** define when a criterion is met.

3. **Criterion 27 is not settled, and its figure flips between runs.**
   - It was a blocking basis in VER-014 (F3, line 19).
   - Its medians so far: 56.66% (D271), 51.35% (VER-013 125), 47.96% (D324), and 43.13% with one trial at 53.46% (VER-015 103).
   - D327 refused to carry an earlier series because the decisions had changed since. Every dispatch changes the decisions, and integrating a planning pass changes the corpus.
   - **Fix:** settle it on this repair's measurement, with the negative outcome allowed, and no later role measures again.

4. **Items 3 and 5 contradict item 1(a) and a failing suite.**
   - Item 3 forbids further recorder repair. Item 5 allows it only when a suite fails. But 1(a) blocks when a retained program fails.
   - The recorder changed after the retained programs last passed (standing.md 5 and 11), and item 5 does not ask for them to be rerun.

5. **Rebinding the amendment.**
   - `amend-order` binds to the newest planning receipt (plan-receipts.mjs 2017-2020). It hashes the decision (1865, 1889-1892) and the order's text up to the bound length (plan-continuation.mjs 443-445).
   - After main was last integrated, the planning check failed until the amendment was bound to the newest receipt (D265 evidence, decisions 10891). The document gate runs that check (test-runner.mjs 1015-1019).
   - So any planning receipt that reaches main (this pass's, for one) breaks the document gate at final review, which fails criterion 33.
   - The paraphrase check failed only after the first binding, forcing a reword and a rebind (D270).
   - **Fix:** run docs-check before binding, and let any role rebind as bookkeeping.

6. **Final-review duties outside the draft's bases.**
   - A changed standing document "returns to repair" (reviewer SKILL 28).
   - Final review covers "the criteria, the integration and the release surfaces" (product 07 4274).
   - Product 07's recorder and filing-proof passages are already known to trail the code (D329, VER-015 F11).

7. **Integration failures.** Under 1(b), a suite that main's own new code breaks would return the order. Inference: the criterion-25 inventory scans every shipped file, so new code landing on main with a literal time limit would fail it. A failing suite cannot simply be boarded, because a pass needs a passing complete row at the integrated identity (reviewer SKILL 78).

8. **Flaky instruments.** The health-body and concurrent-qualification programs depend on timing (VER-014 21, 23). Part C's intermittent failure is still "inconclusive" (VER-015 91). VER-014 ran under a Codex sandbox. One failure blocks under the draft. **Fix:** require two failures run alone, and treat a sandbox or missing-service failure as untested.

9. **Two-way wording.**
   - "A case that a criterion names": most criteria name a suite, not a case.
   - "The closing-prose case": three cases match (test-review-worker.mjs 4485, 5489, 5889).
   - "Retained reproduction program": the reproductions for VER-014 F2 and VER-015 F3 are `.md` files. `ver-013-repair-recorder.mjs` could be read as one of VER-013's, and it expects some valid notes to be refused (VER-014 15).
   - "The inventory case": there are several. The criterion's case is "WO-288 criterion D3…" (test-runner.test.mjs 21522).
   - Main is not pinned for the programs that compare against it.

10. **The conduct critic is not covered.** Item 1 names verifiers, reviewers and readers, not the critic, yet a critic point flipped criterion 25 at VER-013. The critic report outstanding from the stopped repair (standing.md 13) is not in item 5.

11. **Feedback edition (conditional).** If the repair touched a judged feedback source, `npm run sync` refuses to carry the edition until a live episode runs (sync.mjs 88), and criterion 8 gets re-judged. Item 5 omits sync.

12. **Dispatch bound.** The repair was requested at 12:57:43Z, and no bound acceptance has been recorded since 2026-11-21 (`docs/control/orders/WO-288.jsonl`). The repair's wall-clock bound is local-median (budgets.json). The draft does not authorize running past it.

13. **The pass may fail to record, or publish may be declined.** A carry commit that Git refuses throws before the passing final review is recorded (decisions 12832). A publish can be declined by a stop (reviewer SKILL 88). Neither is a return to repair, but the order does not end. Tell the reviewer.

### 2. Factual errors

- "Ten readers… VER-013": VER-013 launched eleven (VER-013 9, 243).
- No single "closing-prose case" exists (three cases match, see hole 9).
- VER-015's only retained program is `ver-015-recorder.mjs`.
- Your summary is off on two points: VER-013 judged criterion 14 met (VER-013 3), and VER-014 also failed criterion 27.
- "My rule of 2026-11-25" and "the first order under" it are unverified; I did not read the pass. If the order cites an order number that is not yet on main, expect a broken-link failure in docs-check (inference).
- Checkpoint 131 is correct: `caaaee05f`, tree `a3e5c57ff221`. Checkpoint 133 is the newest.

### 3. What the operator should hear

Regressions against main stop blocking. So the recorder could file a clean example in place of a damaged review (losing its blocking finding, with exit 0) on any text outside the nine programs. That failure class has come back at a new spelling four times (D273, D289, D307 and D325). A slow-target-test failure like VER-013 F3 would also ship to instances in v1.5.0. A final return leaves the order stopped, not ended. A waiver would end it: a verifier or reviewer records one from your captured words (resume.mjs 2713-2761, `--capture` required; the executor is refused, 1388).

### 4. Corrected text

```
resume: fix

Operator direction for WO-288, 2026-11-25. Record it in a new decision as this order's authorization and write it into the order, paraphrased, copying none of its sentences; run node scripts/docs-check.mjs over both before binding. If main has moved, integrate it first with this worktree's own script, then bind with npm run plan -- amend-order. Any role of this order rebinds the same decision after a later edit of the order or the decision, or after an integration brings a newer planning receipt; that is bookkeeping and returns nothing. Take this repair as long as it needs.

Write it where the order's readers look: the frame's opening paragraph, so that for this order it governs the verifier's and reviewer's role text and product 07 §Verification review and attack and §The queue form; rule 9, in place of its sentence on the verification after VER-011; criteria 14, 25 and 27, as D265 amended 23 and 34; and Known issues. Add or renumber no criterion.

1. A criterion is met when the cases, suites or records it names hold at the handed-over tree; items 4 to 6 settle criteria 14, 25 and 27. A criterion is unmet, and a finding blocks, only when: (a) such a case fails twice when run alone; (b) one of these programs in docs/evidence/WO-288/ exits nonzero twice there, compared where it asks with main at 77b5fc11e: final-001-recorder.mjs, ver-013-recorder.mjs, ver-013-matrix.mjs, ver-013-witness.mjs, ver-014-closing-prose.mjs, ver-014-older-receipts.mjs, ver-014-health-body.mjs, ver-014-concurrent-qualification.mjs and ver-015-recorder.mjs; (c) the complete run or the document gate at the subject's identity fails on a suite that fails again alone; or (d) the clean-room floor or an authority or credential boundary is broken. A failure a sandbox or a missing service causes is untested, not failed.

2. Everything else is a follow-up row and blocks nothing: a behavior main had; any text, state, timing or source form built or met beyond those cases and programs; a document's wording; a release surface; a point from a reader or a conduct critic. The final reviewer edits a document or release finding itself or boards it, and fixes what integrating main breaks where it can without touching the recorder or the inventory. A refused pass-transition commit or publish is recorded and handed to me; neither returns the order.

3. Verification 16 reads the repair since checkpoint 131 (caaaee05f): it runs the programs in 1(b) and the cases of each criterion whose files that repair changed, and carries VER-015's other judgments. The final review reads the change since that checkpoint and what integration brings, the same way, and reproduces no other earlier finding. Neither launches readers or reviews the rest of the change; readers have read all of it four times.

4. Criterion 14's closing-prose clause is met by the plan-refutation suite and the recorder programs in 1(b). A later order under my rule of 2026-11-25 removes the recorder's reading of text around a result.

5. Criterion 25 is met when the case named WO-288 criterion D3 in scripts/test-runner.test.mjs passes; any figure it passes is a follow-up row.

6. Criterion 27's memory clause rests on this repair's five-trial measurement of the handed-over tree. If its median is above half the base, record negative with that tree's heap profile and what would have to change; that meets the clause. No later role measures again.

7. This repair: judge the outstanding critic report; run npm run sync with any live feedback episode it asks; bring product 07's recorder and filing-proof passages into line with the code; run the affected suites and the programs in 1(b) on the final tree; make one passing complete run, the measurement and the document gate; record repair-complete. Change the recorder or the inventory only to make a failing suite or program in 1(b) pass.

8. If verification 16 or the final review still returns the order, start no repair: record the return, write the standing file and stop for my decision.
```
