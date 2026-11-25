# The room of 2026-11-25, round 3: verdicts on draft 1 of the plan

Record of the [2026-11-25 planning pass](data-is-the-record-2026-11-25.md). Each seat answered `SIGN` or `BLOCK` with the replacement text that would get its signature. These are the seats' own papers as returned, changed in four ways only: a checkout's absolute path is replaced by its name (`worktree:` marks a path in WO-288's worktree, whose files are not on `main`), each paper's headings are set one level down, and a document's title in quotation marks is set as code where the document check would read it as the operator's words, and the repository's formatter has laid out its Markdown. A model named here is the one the host or the seat reported. What the pass checked itself is said in the pass document.

## Claude Fable 5.2

Seat: Claude Fable 5.2, round 3
BLOCK

I sign sections 1 to 3 and 5 to 8. Four passages of section 9, and the sentence of section 4 that item 5 copies, can still return WO-288 on what the plan excludes; with the replacements below I sign. wt = `the WO-288 worktree`; other paths are under `the main checkout`.

**B1. Section 9, item 1, last sentence.** Read as written, the executor deletes the five recorder programs. FINAL-001 and VER-013 to VER-015 link them, a filed report cannot be edited, and the document check fails a link to a missing file (`scripts/docs-check.mjs`:340). Replace with:
"The recorder programs retained from FINAL-001 and VER-013 to VER-015 stay on file, since filed reports link them, and return nothing by their exit status."

**B2. Section 9, item 5, and section 4.** Nothing says when a criterion is met; the chair's first draft did, after an attack showed the need (`docs/planning/passes/data-is-the-record-2026-11-25.md`:144-145). "A broken promise" is a ground beyond the named cases, and criterion 7 still holds a universal. "A documented command admits" covers any text a judge feeds `worker record`. Replace item 5's first sentence with:
"A criterion is met when the cases, suites or records it names hold at the handed-over identity, and nothing else makes one unmet. What returns this order: such a case or a required suite failing there and again when run alone; one of ver-013-witness.mjs, ver-014-older-receipts.mjs, ver-014-health-body.mjs or ver-014-concurrent-qualification.mjs exiting nonzero twice; on input a kit writer produced or a documented command's arguments admit (for a command that takes a worker's text, a return a worker produced or a fixture the suites hold), a wrong result accepted, a record lost or misfiled, or a regression against main; the clean-room floor or an authority or credential boundary."
In section 4, replace "a broken promise" with "a counterexample to an invariant a criterion states", and add to its first bullet: "Where a command takes free text, only text a writer actually produced, or what its contract names, is supported."

**B3. Section 9, item 7.** This verification reads only the repair, so "what verification declared unread" is nearly the whole change, and the final reviewer is told to read it. FINAL-001 did that after VER-012, and it restarted the loop (wt `docs/final-reviews/WO-288/FINAL-001.md`:139-141). VER-015's F1 also cannot be "reproduced as closed": `main` refuses its texts (wt `docs/verifications/WO-288/VER-015.md`:21). Replace the first three sentences with:
"The verification confirms VER-015's findings closed: F1 by the strike, its texts being refused with the remedy; F2 by the public command refusing each damaged return and filing nothing; F3 by item 2. It judges each criterion by item 5 and reads the repair since checkpoint 131 (caaaee05f) and what calls it. The final review judges the integration of main and the release surfaces and reads what the integration changed. Fifteen verifications and one final review have read the rest; neither role reads it again or launches readers over it."

**B4. Section 9, opening, third sentence.** The day's-figure order may merge after this repair ends, so the final reviewer meets the conflict, and the sentence covers only the repair and only the rule. That order's cases repeat or differ from the worktree's (wt `packages/skeleton/test/executor-supports.test.ts`:314). Replace with:
"At any integration of main into this worktree, by any role, use this worktree's own script and take this worktree's text, cases and documents wherever main's change for a day's figure differs from or repeats them; regenerate what is emitted; then bind with npm run plan -- amend-order."

**Improvements that do not block**

1. Item 4, add: "The hooks will still say a launch is due, because core's election stays for criterion 32; ignore that line in this order." The cadence reads the election alone (wt `scripts/lib/worker-cadence.mjs`:25).
2. Item 2, name the case: `"WO-288 criterion D3: no shipped file passes a time limit…"` in `scripts/test-runner.test.mjs`. Another case has that prefix (wt `scripts/test-drive.mjs`:7976).
3. Item 3, replace "on the tree it hands over" with "after the passing complete run, on that tree; the records written after it do not unmake it".
4. Item 6, add: "Beyond items 1 to 3, change code only to make a failing suite pass. The combined review already filed is this repair's one review." Item 8, name who acts: "its judge files the report, records the result, writes the standing file and says the order is parked."
5. Section 1: by my count from `docs/control/orders/` the medians are 2.9, 8.3, 10.9 and 15.0 h, and implementation goes from 1.1 to 5.6 h.

**Section 9 read by each role**

- **Executor.** Undecided: whether "leave this order's evidence" means delete (B1); whether the hook's due line or item 4 wins (improvement 1); whether the restore owes a second review, or the inventory more work (improvement 4). `bracedEnd` has no user but `objectAt` (wt `scripts/lib/review-worker.mjs`:2840) and goes too.
- **Verifier.** It can still return the order by judging a criterion unmet on its words, by "a broken promise", or by a text it composes for a command that admits any text (B2). It cannot show F1 closed as worded (B3). On a fail it does not know who writes the standing file (improvement 4).
- **Final reviewer.** It is told to read everything the repair-only verification left unread (B3), and has no rule for the conflict and repeated cases the day's-figure order brings (B4).

Not established: I ran nothing, so a repeated case title failing after a merge is inferred (`docs/product/07-execution-guide.md`:4119-4122).

## Claude Opus 5.5

Seat: Claude Opus 5.5, round 3
BLOCK

I would defend the plan's choices: close WO-288 first, ship the day's-figure order ahead of it, hold the port in reserve, put nothing in force, and propose retiring the queue form. Six sentences, though, would send WO-288 round again or are false. With the replacements below, I sign.

**B1. Section 9, item 1, last sentence.**
- VER-013, VER-014, VER-015 and FINAL-001 link those programs; for example, `VER-015.md` links `ver-015-recorder.mjs`. Removing them breaks links in records nobody may edit, so the document gate fails.
- `scripts/test-review-worker.mjs` mixes 191 tests, recorder cases and other Part B cases together, so "their cases" needs a stated edge.

Replace with:
"The recorder programs retained from FINAL-001 and VER-013 to VER-015 stay on file as records; no role runs them, and they return nothing. Every case that asserts a return `main` refuses is recorded is removed with the code."

**B2. Section 2 "Ahead", and the section 9 preamble.** If the day's-figure order merges before WO-288's final review, the final reviewer integrates it. A case that pins that order's interim wording then fails at the integrated identity, and under item 5 that returns the order.

Add to "Ahead":
"Its cases assert only what this worktree's text also satisfies: the facts line reads as the worktree's, and the executor's rule no longer ends a turn at the day's figure."

Replace the preamble's integration sentence with:
"If main has moved, integrate it first with this worktree's own script, then bind with npm run plan -- amend-order. In every integration by any role, where main's day's-figure line or rule differs, this worktree's text stands and a case pinning main's wording follows it; that is integration and returns nothing."

**B3. Section 4 and section 9 item 5: "untested" against "withholds a pass".** A verifier whose sandbox stops `ver-014-health-body.mjs` can neither pass nor return the order. It would likely fail it, which parks the order. Replace item 5's last two sentences, and the matching sentence of section 4, with:
"A check that did not run neither passes nor returns. The judge runs it through the host's permission flow; where only I can supply what it needs, the judge states that block once, with the line that clears it, and waits."

**B4. Section 9, item 7.**
- When the verification reads only the repair, "what verification declared unread" becomes the whole rest of the change. That is the sweep the item forbids.
- F1 cannot be "reproduced as closed": its texts are still refused, by design.

Replace the item's first two sentences with:
"The verification shows VER-015's findings closed: F1 by the strike of criterion 14's last clause, F2 by the no-diff check and `main`'s refusal of its damaged returns, F3 by the key and the mark on the two figures. It judges each criterion on its named evidence at the handed-over identity and reads the repair since checkpoint 131 (caaaee05f) and what consumes it. The final review judges the integration of main, the release surfaces, and any file of that repair or its consumers that the verification names as unread."

**B5. Section 9 preamble, "rules 4 and 9".**
- Criterion 31 requires the emitted roots to state "the frame's rules 2 to 6 and 9". If the direction rewrites those rules, a verifier can judge criterion 31 unmet.
- Criterion 32 requires the cadence to stay elected in core's configuration, so un-electing it in the worktree fails criterion 32.

Replace the preamble's second paragraph with:
"Write it where the order's readers look: the frame's opening paragraph, so that for this order it governs over rules 4 and 9, the executor's, verifier's and reviewer's role text and product 07, while rules 2 to 6 and 9 keep the text criterion 31 judges; criteria 14, 25 and 27; the known issues."

Add to item 4: "The cadence stays elected, as criterion 32 requires; a due line a hook prints is not acted on."

In section 8, write: "un-electing core's critic cadence, after WO-288 merges".

**B6. Section 1: the November medians are false.** I recomputed them from `docs/control/orders/`, dating each order by its first passing final review. The draft took the upper of the two middle values in an even count. Replace with:
"1 to 9 November 20, 10.9 h, three under six hours; 10 to 25 November 6, 15.0 h, none. Median implementation time went from 1.1 h to 5.6 h."
The September and October figures hold.

**Improvements (not blocking).**
1. Section 2 "Ahead": on `main`, the console document task was stopped at its memory limit in two full document gates out of two (the 2026-11-23 pass, Validation). Add: "If its document gate is stopped there, the executor follows the stop's message on `memory.gateShare` (`docs/control/budgets.json`), records why, and the setting returns after Part E lands."
2. Section 9, item 5: after the four program names, add "each run as its header says, with a built checkout of main at 77b5fc11e where it takes one".

**Section 9 read as each role.**
- **Executor:** three holes. B1: whether to remove the programs, and which cases go. B2: whose text to take at integration. B5: the due lines the hooks still print, against item 4.
- **Verifier:** two holes. B3: stuck on a check that did not run. B4: what "closed" means for F1. Item 5's "broken promise on supported input" is bounded by item 7's reading of the repair and its consumers, and it stays.
- **Final reviewer:** two holes. B4: an "unread" remainder that is the whole change. B2: an integration that brings in the day's-figure order.

With these fixes, none of the three can return the order on what the plan means to exclude.

One check for item 1: restoring `readReturn` together with `objectAt`, which only `readReturn` calls, gives `main`'s behavior, because `markdown-links.mjs` is unchanged in the worktree.

## GPT-6.2 Astra

BLOCK

1. **§1, throughput.** The draft uses the upper middle observation for even-sized cohorts. For November 1–9, the middle pair was 10.35 and 11.45 hours. Replace the figures and September conclusion with the following. Lifecycle records (`docs/control/orders`)

   *From first activation to first passing final review, the four UTC cohorts had 108, 71, 20 and 6 orders. Median elapsed hours were 2.9, 8.3, 10.9 and 15.0. The counts under six hours were 80, 30, 3 and 0. Median time to implementation-ready rose from 1.1 to 5.6 hours. Only three of September’s 24 days with a passing review had multiple passes all under six hours. Release throughput remains unmeasured.*

2. **§§2 and 7, delivery order.** The repair lacks a passing complete run. The console task twice stopped a full document gate and passed alone. Those facts establish neither a verification within hours nor a certain earlier release. Replace the timing claim and fallback. Repair standing (`worktree:docs/evidence/WO-288/standing.md:13`) · Full-gate results (`docs/planning/passes/the-kit-keeps-working-2026-11-23.md:1026`)

   *Run the authorized prompt order first while WO-288 is stopped. Check its emitted instructions in an upgraded starter. Claim continuation once a session takes its next authorized action and honors an explicit pause. If the console memory stop recurs, hold that release and proceed to WO-288’s attended attempt. This gives Parts D and E one chance together. Independent verification starts after a passing handoff. If WO-288 parks, advance the console fix wherever that stop blocks delivery.*

3. **§§4 and 9.5, verdicts.** A reader can reproduce a genuine loss. A refusal can name a remedy while breaking a supported command. Isolation can remove the load that caused a gate failure. Replace the isolated-rerun condition and §9.5’s blanket exclusions. VER-015 F2 (`worktree:docs/verifications/WO-288/VER-015.md:23`)

   *Reproduce a case at the same identity, alone where possible and under the recorded concurrency and limits where the failure depends on them. Mark a criterion met when its named evidence holds and no blocking condition applies. Judge a reproduction by its supported input and observed result, whoever wrote it. A refusal with a remedy is acceptable where the contract permits it. Wording matters where a criterion requires an emitted instruction. Missing evidence withholds a pass. Board other observations with reopening conditions.*

4. **§9 opening and item 4, authority.** Rebinding pins bytes. Criterion 31 references the very frame rules being changed, and its test requires whole-report delivery and a reader per part. Add the following. Amendment record (`worktree:scripts/lib/plan-receipts.mjs:2049`) · Emitted-role test (`worktree:scripts/test-harness.mjs:25770`)

   *Cite the ignored capture’s SHA-256 with the decision’s paraphrase. Rebind only changes within that authorization. Extend only this repair’s wall-clock and complete-run bounds. Apply the conduct and reading exceptions to WO-288’s remaining dispatches. Judge criteria 4, 31 and 32 against the general rules at checkpoint 131 using their named cases on the handoff.*

5. **§9.1–3 and 7, closure.** The VER-015 recorder program requires the withdrawn behavior. One test combines it with split-batch assertions. The receipt checker deliberately consults historical sources when filing proof is absent. Replace the instruction to reproduce all three findings as closed. Recorder expectations (`worktree:docs/evidence/WO-288/ver-015-recorder.mjs:171`) · Combined test (`worktree:scripts/test-review-worker.mjs:4485`) · D332 inventory (`worktree:docs/evidence/WO-288/decisions.md:12950`) · Receipt contract (`worktree:scripts/lib/plan-receipts.mjs:1043`)

   *Preserve historical programs and split-batch assertions. Dispose of F1 by the authorized withdrawal. For F2, independently submit the standalone control and three damaged assignments through the public recorder. The control files its finding. Each damaged return is refused and creates no record. For F3, freeze D332’s 154 calls in 23 files before rollback, reconcile moved sites, mark the forced 1 ms deadline, read the ordinary deadline from its key, and require the planted destructured deadline to fail at its supplying line. Carry criterion 27’s five-trial result and zero older rebuilds on the witnessed filing routes. Preserve historical validation for unwitnessed receipts.*

6. **§§4, 7 and 9.8, stopping.** The router counts failures separately. A repair unable to qualify never reaches item 8. Add the following. Drive bounds (`scripts/lib/drive-route.mjs:123`)

   *Use attended dispatch for the combined-bound trial until lifecycle parking ships. If WO-288’s handoff still fails after one scoped correction and retry, or required evidence remains unavailable, record the failure or incomplete check and stop. On that stop or either failed verdict, preserve standing and checkpoints. Planning moves WO-288 to Not now and makes the publication port eligible for activation.*

**Executor.** Record `repair-complete` only with passing product and document evidence.  
**Verifier.** Use `resume: verify`, carry VER-015’s unaffected coverage, and identify genuinely unread interactions.  
**Final reviewer.** Use `resume: final review` after verification passes. Require a passing complete row at the integrated code identity and document evidence after the final report. A refused carry commit leaves the verdict unrecorded. Hand off its exact retry. A subsequent publish refusal preserves the recorded pass. Pass transition (`worktree:scripts/resume.mjs:2545`)

## GPT-6.2 Sol

BLOCK

1. **§1, throughput.** The recorded medians differ from the draft, and September’s 80 of 108 orders under six hours do not establish a six-hour ceiling. Replace the throughput bullet. Lifecycle records (`docs/control/orders`)

   > By UTC date of first passing final review, September had 108 orders at a median of 2.94 hours from activation. October had 71 at 8.30 hours, November 1–9 had 20 at 10.90 hours, and November 10–25 had six at 14.95 hours. The September, early November and late November cohorts had 80, three and zero orders under six hours. Median implementation rose from 1.11 to 5.63 hours. Median verification stayed under an hour. Release throughput remains unmeasured.

2. **§§2, 6–7, delivery.** The document gate twice hit the console memory ceiling on the planning branch. WO-288’s current repair still lacks complete qualification. A passing final review sets `closed` before publication, so that state could retire the reserve while the instance still waits. Replace the scheduling and reserve language. Document-gate record (`docs/planning/passes/the-kit-keeps-working-2026-11-23.md:1025`) · Standing (`worktree:docs/evidence/WO-288/standing.md:9`) · Lifecycle fold (`worktree:scripts/lib/control.mjs:595`)

   > Propose the day’s-figure fix first. Qualify it from `main` and show an upgraded starter taking its next authorized step after reaching the figure and honoring an explicit pause. If the full document gate reproduces the console memory stop, advance the standalone console fix at the existing budget as a prerequisite for the affected delivery. Give WO-288 one attended attempt. Its time to verification remains unknown. Keep the publication port in reserve until release close confirms those fixes shipped. A park makes the port next for authorized activation. For ordinary orders, `worktree start` activates the order before `drive:` can carry it to its actual stop.

3. **§9 items 1–3 and 7, acceptance.** VER-015’s recorder program expects F1’s closing prose to be accepted and F2’s damaged assignments to be refused. Restoring `main` deliberately refuses F1. The suite also combines the withdrawn expectation with retained batch assertions. Criterion 25 still needs a fixed population, and the receipt guarantee needs the planning-check scope. Replace the evidence instructions. VER-015 (`worktree:docs/verifications/WO-288/VER-015.md:19`) · Batch case (`worktree:scripts/test-review-worker.mjs:4584`) · Inventory record (`worktree:docs/evidence/WO-288/decisions.md:12950`) · Receipt reader (`worktree:scripts/lib/plan-receipts.mjs:1038`)

   > Compare the restored reader and its exclusive helpers with `77b5fc11e`. Preserve the batch assertions and baseline parser cases, and archive the superseded probes with their reports. Record F1 as disposed by the criterion amendment. For F2, show the public recorder refusing each original damaged assignment with zero filings and preserving the findings from a standalone valid result. For F3, freeze D332’s 154 call sites by file and call at the named checkpoint. Require the D3 case, both keyed or marked Codex arms and the planted unregistered bound failing at its supplying line. New sites are follow-ups under criterion 25. For criterion 27, compare five trials with the recorded base. Either memory outcome still requires zero older-subject rebuilds on the retained planning-check route.

4. **§9 item 5, findings.** The blanket exclusions can dismiss a valid regression or boundary breach because a reader found it, or because a judge wrote the fixture. Replace the exclusions. Judgment contract (`worktree:docs/product/07-execution-guide.md:4018`)

   > Apply §4 to the behavior and evidence regardless of who found it. Faithful fixtures count, including inputs a documented command promises to refuse. A remedy clears a refusal only where the contract permits that refusal. Other points get a reopening condition. Unavailable required proof leaves the attempt incomplete.

5. **§§4, 7 and 9, stop and handoff.** The current repair is already recorded. Failed judgments leave `needs-fix`, and the lifecycle has no park action. Item 8 also leaves an incomplete qualification without a stop. Replace the immediate stop instructions. Repair event (`worktree:docs/control/orders/WO-288.jsonl:70`) · Lifecycle actions (`worktree:scripts/lib/lifecycle-actions.mjs:15`)

   > Continue the recorded repair and record any needed extension with `accept-overrun`. After successful qualification and `repair-complete`, the operator dispatches `resume: verify` and, on pass, `resume: final review` in the worktree. A reproduced blocker or outstanding required proof ends the attempt. Record the actual verdict or incomplete status, preserve the worktree and checkpoints, and write standing. The planner records a manual hold in Not now. Canonical parking starts when the termination order ships.

**Section 9 by role**

- **Executor.** Bind the paraphrased decision with the paste’s SHA-256 before qualification and rebind against a newer planning receipt. Make the cadence exception explicit for all three WO-288 roles. Criteria 31 and 32 still judge ordinary emitted behavior.
- **Verifier.** Cite evidence for each criterion and identify outstanding affected interactions. Use the qualifying complete review row and exact-tree document evidence. This keeps carried areas from becoming an unread-work list.
- **Final reviewer.** Integrate current `main` with the worktree’s script and rebind before preparing release surfaces. Reuse the product row at the same code identity, remeasure if integration changes the measured inputs, and obtain document evidence after the last edit. Hand off a refused commit or publish separately from the verdict.
