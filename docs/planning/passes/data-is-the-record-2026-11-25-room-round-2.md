# The room of 2026-11-25, round 2: cross-examination

Record of the [2026-11-25 planning pass](data-is-the-record-2026-11-25.md). Each seat read all five round-1 papers with the authors' names removed, the chair's reading of what they agreed, and six forks. These are the seats' own papers as returned, changed in four ways only: a checkout's absolute path is replaced by its name (`worktree:` marks a path in WO-288's worktree, whose files are not on `main`), each paper's headings are set one level down, and a document's title in quotation marks is set as code where the document check would read it as the operator's words, and the repository's formatter has laid out its Markdown. A model named here is the one the host or the seat reported. What the pass checked itself is said in the pass document.

## Claude Fable 5.2

Seat: Claude Fable 5.2, round 2

Paths are under `the main checkout`; wt = `the WO-288 worktree`; 07 = `docs/product/07-execution-guide.md`; seq = `docs/planning/sequence.md`; orders = `docs/control/orders/`. I ran no test or gate.

### 1. Corrections to "agreed"

- **A4.** I hold it with one addition: on supported input, a wrong result accepted or a record lost or misfiled returns an order whatever promise it misses. "Regression" does not cover a new feature that fails open.
- **A5.** I did not hold this in round 1; I gave the cut to a planner and a refuter. I hold it now, worded: a planner and a refuter may change how a criterion is evidenced while the Objective stays true as written. A change to the Objective, or a dropped part, is the owner's, and he may give it in advance in the order's text. Parking needs nobody.
- **A6.** "What an instance waits on goes first" needs its limit: every queued order's plan names files WO-288 changes, so WO-288's one bounded attempt precedes them, one separable slice excepted (fork 1).
- A1, A2, A3, A7 and A8 I hold as written.

### 2. The forks

**Fork 1. Vote: (a), with one slice ahead. Not (c) as written, not (b).**
- (c)'s premise fails. Part F's publish route imports Part D's `childLimit`, which `main` lacks, and calls it at five sites (wt `scripts/lib/drive-route.mjs`:19, 343-488). Part F also lives outside the ten files: `scripts/lib/dispatch-bound.mjs`, `scripts/lib/drive-session.mjs` and 1,363 added lines of `scripts/test-drive.mjs`. WO-289 rewrites `blocked-turn`, which the worktree rewrote and pins (wt `scripts/test-harness.mjs`:25780).
- (b) strands Part E, and every core document gate needs it: the console task was stopped at its memory limit in two full runs of two on `main` (`docs/planning/passes/the-kit-keeps-working-2026-11-23.md`:1026-1034).
- The day's-figure fix alone is separable: one string in `renderDailyUse`, one sentence in `contributor.ts`, three cases.
- Moves me: the restore or the slice not coming out clean.
- Text: "WO-288 gets one bounded close before any other queued order merges. The fenced direction stands with item 4 reading: criterion 14's last clause is withdrawn; `readReturn`, the names only it reaches and their cases return to main's text at `77b5fc11e`, shown by a no-diff check; the documents tell the session to put the result alone in the input file, as main's refusal does. Item 1(b) loses the five recorder programs. One verification, one final review, then it parks. One order is filed now and placed first: the day's-figure text, byte-identical to the worktree's. He types its phrase and pastes the direction. The repair may run beside it; WO-288's final review follows its merge."

**Fork 2. Vote: (b), with red first and a refuter who predicts.**
- Under (a), WO-289's re-cut reads text only, and its own known issue says every criterion can hold while sessions still stop (`docs/work-orders/WO-289-a-session-is-told-to-go-on-and-ends-its-turn-only-for-what-the-operator-must-do.md`:425-430).
- Sub-fork: criterion 25's detector was written by the order it graded and passed while missing two figures (wt `docs/verifications/WO-288/VER-015.md`:29-31). The census behind criterion 23 came from planning and also missed sites, but its misses surfaced as findings. What matters is that the code under judgment does not write its own list.
- Moves me: red-first orders that still return on disputes over a reading.
- Text: "A criterion names one behavior where its user meets it, its supported domain, the public command, and one of three closed forms: scenarios, each with a control that fails at the base; an invariant held by construction, one choke point and a lint that bans the raw call, where one counterexample on supported input decides; or a list frozen at a named checkpoint, built before the implementation by a method the order states, never by the code under judgment. At filing the refuter predicts each outcome without seeing the planner's. In the order's first hour the executor makes each scenario fail by its command; one that cannot fail returns to planning then."

**Fork 3. Vote: the standard stays, the open failure joins it, the final review does not sweep.**
- The eighteen escapes do not argue for a full read. All of them were routed follow-up in reviews that passed: `findingCounts` in orders `WO-284.jsonl` (1) and `WO-287.jsonl` (17), and the findings block of `docs/final-reviews/WO-287/FINAL-001.md` holds 21 follow-ups and nothing blocking.
- Open against closed failure, and the writer of an input, are already the kit's words (07:4133-4140).
- The driven route already stops at three failed verifications and two failed final reviews (`.claude/skills/dotln-router/SKILL.md`:21); the attended route has nothing.
- Moves me: a blocking-class escape, missed at a final review under this rule, that an instance then meets.
- Text: "Supported input is what a kit writer produces or a person gives a documented command; text a judge composes is not. An order returns on: a listed scenario or required suite failing at the tree's identity; a reproduction of an earlier blocking finding failing again; on supported input, a wrong result accepted, a record lost or misfiled, or what main accepted now refused; the floor or an authority boundary. A refusal that names its remedy returns nothing else. A check that did not run leaves its criterion unmet. The final review judges integration, release surfaces and what verification declared unread. At a criterion's second return a planner and a refuter re-cut its evidence; a third failed judgment parks the order."

**Fork 4. Vote: retire.**
- Kept narrow at about ten criteria, the form is the Order-size rule the sequence already has (seq:35-38). What would remain of the form is its machinery: two to eight parts, each the size of an ordinary order, umbrella records and a frame (07:2743-2751), which cannot fit in ten criteria.
- I checked P5's count in `docs/control/orders/` and it holds: twenty orders passed final review from 1 to 9 November, one to three verifications each, median about 11 h, three under six hours. Small orders already gave more than one a day. What they cost him was phrases.
- Moves me: a design that needs more than about ten criteria and cannot go contract first.
- Text: "The queue form's section leaves product 07 and its entry leaves the sequence. The Order-size rule stands: one design, one releasable outcome, about ten criteria, a shared contract first and alone. An order with a separable part names at filing the cut it takes at that part's second return. Nothing a consumer waits on shares an order. The economy comes from one drive phrase an order, a second lane for disjoint surfaces that he elects as a standing setting, and his merging several small pull requests at a sitting. A train of orders under one release is not built now."

**Fork 5. Vote: a rule by who writes the record.**
- (a) is not what the kit has today. The findings block counts as a marker any line whose only letters are the marker's name, behind a quote or in another case, and finds its fence with the Markdown parser (`scripts/lib/review-findings.mjs`:16-33); the dependencies block reads through `markdownMarkerLines` (`scripts/lib/dependencies.mjs`:1). A strict extractor has to be written.
- (b) is the direction the code already states: planning consumes the event, never the report (`scripts/lib/review-findings.mjs`:5-8), and the lifecycle log already carries the counts.
- Moves me: strict blocks still producing reader defects in the first two orders that use them; then orders go to (c).
- Text: "The writer decides the form. A fact a command records (a review result, a verdict, judgments, findings, attestation, cost) is given to that command as JSON, validated, and kept in the order's lifecycle log or a sidecar it names; the Markdown beside it is prose no program reads. A text a person authors and reviews as a diff (an order's fields and criteria, the sequence's list) keeps one JSON block between exact marker lines at column 0, its count fixed by its schema, read without a Markdown grammar and refused whole otherwise. Pages nobody authors are rendered. Moves, in order: the review result; report verdicts and judgments; the order's block. Closed records keep their readers."

**Fork 6. Vote: file little, put nothing in force.**
- WO-289, WO-290, WO-292 and WO-293 are written against WO-288's merged text and typed `satisfied-by-close` on it; WO-291 and WO-294 are not (their dependency blocks). Re-cutting the four against `main` now is wasted if WO-288 closes.
- The refuter already composes its standard from product 07's goal block (07:67-110), so his tests have a home.
- Moves me: his word that he wants the appendix kept as a page.
- Text: "This pass files one new order against main: the day's-figure text, three criteria. WO-291 (ten criteria) and WO-294 (eight) stand as filed, after WO-288's attempt. WO-293, WO-295 and WO-296 become one termination order of at most eight criteria and one prompt change. WO-289, WO-290 and WO-292 keep their dependency and are re-read once WO-288 closes or parks. None of the six rules enters force: each is recorded with its assessment for him to confirm or strike. The appendix stays a record, marked as the planner's reading; his five tests enter the goal block when he confirms them. Only WO-088 is proposed for retirement. Added: one order, one template line. Removed: the queue form's section, two orders, six drafted rules."

### 3. Factual errors

1. **The packet's first fact, and fork 1(c).** Part F is more than 1,006 lines in ten files, and its hunks are not identical changes on `main`; the citations are under fork 1.
2. **The brief, P3 and my own P2** treat the eighteen final-review escapes as defects a sweep caught. Every one was a follow-up in a passing review (fork 3).
3. **P3**: the console has no dependency-free checker to build on. `schemaMatches` is a helper inside a test (`packages/console/test/runtime-status.test.ts`:101); the product decodes by hand.
4. **P5 and the brief's addendum** place the integration ruling at about line 4933 of `docs/lineage/idea-ledger.md`. It is at about 3809; about 4935 is the ruling that a hold needs an observed failure.
5. **The chair's draft**: seq:242-245 still promises that a message sent mid-turn says so on arrival, which the WO-289 re-cut removed (WO-289:424); that line of WO-289 links the absent layout as well.
6. **A3, P5 and my P2** speak as if a strict marker-block extractor exists. It does not (fork 5).
7. **P1 and P4**, on delivering from clean `main`: neither accounts for the document gate's memory stop that such orders meet until Part E lands (fork 1).

### 4. Where I changed my mind

- **Who cuts at the bound.** A planner and a refuter re-cut evidence; the cut of a part is his unless the order named it at filing. P1 and P4 were right, and WO-296's own design already said so.
- **The final review.** From unsure to no full read, on my own check of the eighteen and on P1's and P4's position.
- **Criteria.** The refuter predicts outcomes independently (P4); a retained reproduction of a blocking finding returns an order (P5); a check that did not run withholds a pass (P4).
- **Something ships before WO-288.** P1, P4 and the chair's (c) were right that an instance should not wait on the umbrella's fate. The facts limit it to one slice.
- **Retirements.** From four orders to one (P1, P4, P5). My case for the others was tidiness, not evidence.
- **Held:** closing before parking; retiring the queue form; the open-failure clause; no new standing page.

Not established: whether the slice order can run beside WO-288's repair under the pair rule, whether `drive:` starts for it from `main`, and whether the restore leaves every other Part B case green.

### 5. The first page

Nothing was put in force and nothing was merged while you were away.

WO-288 looped for two reasons. It promised things about sets nobody had listed, and one part tried to find a review inside free text. The room proposes this:

1. Paste one direction in WO-288's session. The recorder goes back to what `main` does, the two open criteria are settled on named evidence, and the order gets one verification and one final review. If either returns it, it parks. There are no more repairs.
2. Type one phrase for a three-criteria order that ships the day's-figure fix your work instance has waited on since 19 November.
3. After that, small orders again, the instance's first, one phrase each.

Three decisions are yours: whether a second lane is a standing setting; whether your five tests of September go into the goal rules; whether WO-088 is retired.

The six rules written on 25 November are not rules. Each is recorded with our assessment, for you to confirm or strike. The queue form is proposed for removal.

Your first day back should cost one paste, about six phrases and two merges.

## Claude Opus 5.5

Seat: Claude Opus 5.5, round 2
Model: claude-opus-5-5, from the host's statement. Effort: xhigh, read from `CLAUDE_EFFORT` (that is the selected effort; the host does not report the effective one).

### 1. Corrections to "agreed"

- **A1.** I hold it, with one addition. This absence carries no grant (P1, P4), so his return costs phrases. Also, the rule that makes acceptance loop is policy, which the room can change without him.
- **A2.** "Does not reach an instance" should read "does not merge". Core's own sessions record reviews with it too.
- **A3.** I hold it. The seed for one linter is a schema checker that needs no dependency, but today it is only a test helper (`packages/console/test/runtime-status.test.ts:101`). Promoting it is a step, not free.
- **A4.** "Supported input" must carry Fork 3's definition, or the loop reopens. "Regression" means against `main`, on that input. Add the distinction between open and closed failures.
- **A6.** WO-294 moves ahead of machinery, but after WO-288.
  - Part F added 460 lines to `scripts/lib/drive-route.mjs`, which WO-294 also edits.
  - `drive:` cannot start WO-288 until WO-294 lands: `main`'s configuration loader refuses WO-288's `kinds` key (WO-294, Observed gap).
- **A8.** Add an author field to the Rules-recorded form. `checkRulesRecorded` requires every recorded rule to cite one of his messages (`scripts/lib/planning-document.mjs:30`, `:94–102`). That is how a planner's own reading came to be attributed to him today.

### 2. The forks

**Fork 1.** Vote (a), plus Part F's own order, written now against `main` and held under Not now until WO-288 parks. Checked: Part F's drive-route code imports Part D's `childLimit`, which `main` lacks, and `harness-host.ts` mixes hunks from Parts A, B, D and F. So (c) is a port followed by a conflicted reintegration. Moves me: the restore breaking Part B. Text: he types `resume: fix` with the chair's block, amended:
- Item 4: "Criterion 14's last clause is struck; `readReturn` and every name only it reaches return to `main`'s text with their cases."
- Item 1(b): drop the five recorder programs, and add a check that those functions show no diff against `main`.
- Item 8: place Part F's order first.

He then types `resume: verify` and `resume: final review` by hand, because `drive:` cannot read WO-288's `kinds` key.

**Fork 2.** Vote (b), with red first. Checked: criterion 23 claimed every limit the kit ships, though the 2026-11-16 census had already listed 327 sites. Written over that list, it would have ended. P4 is right that a list the implementation writes hides its omissions. Moves me: red-first criteria still returning on readings. Text:
"A criterion names one behavior where its user meets it, the public command, and one closed form:
- scenarios, each with a control that fails on `main`;
- an invariant enforced by construction, where one counterexample decides;
- or a list frozen before activation by a source independent of the implementation.
In the first hour the executor makes each scenario fail; a scenario that cannot fail returns to planning. A lint checks the fields."

**Fork 3.** Checked: FINAL-001's escapes lay inside what verification "was instructed to read" (`docs/final-reviews/WO-288/FINAL-001.md:135`). The cure is a recorded first read, not a second sweep. Moves me: an instance stopped by an escape that only a whole final read would catch. Text:
"An order returns on:
- a listed scenario failing by its command;
- a suite or the document gate failing again when run alone;
- on supported input, an open failure (a wrong result accepted, a record lost or misfiled) or a regression against `main`. Supported input is what a kit command, role or committed fixture produces, or what a person produces by the documented command;
- a breach of the clean-room floor or of an authority or credential boundary.
Anything else is a follow-up. Missing evidence is unmet. The final review judges integration, release surfaces, and what verification recorded as unread. At a criterion's second return, its evidence is re-cut. At the third failed judgment, the order parks."

**Fork 4.** Vote: retire, as P2 says. I have changed my mind. Checked: the form study's own comparison (`the-kit-stops-no-work-2026-11-16-wo-276-form-study.md` §2.7) finds the form saved his dispatches (19 against about 79) and release cycles, not phase or machine time. `drive:` removes the dispatch cost. Its three trials took 7, 3 and 15-plus verifications. Moves me: driven small orders costing him more phrases per outcome than WO-276 did. Text: "A planner files no combined order. The economy comes from `drive:`, two standing lanes on disjoint surfaces, and merges taken together; an instance updates when it chooses. An order the owner directs to be combined is planned from its end state, holds nothing anyone waits on, and verifies and cuts each part alone."

**Fork 5.** Vote: a rule by kind of record, not one form. Checked: a schema checker with no dependency exists as a test helper (`packages/console/test/runtime-status.test.ts:101`). Moves me: marker blocks producing reader defects. Text:
"- Facts made at a lifecycle step (a review result, a verdict, criterion judgments, attestation, cost) go as JSON to the command that records them. They are validated there and kept in the log or a sidecar; the report's Markdown is prose.
- An authored contract a person reviews whole (an order's fields and criteria) is one block between exact marker lines, read by one extractor that knows no Markdown grammar.
- New orders' decisions move to JSONL with a rendered page, later.
Order of moves: review result, verdicts, order block."

**Fork 6.** Commit now:
- The amended WO-288 text.
- Part F re-filed against `main`, eight criteria (34 to 41), under Not now until WO-288 parks.
- One termination order replacing WO-293, WO-295 and WO-296, with at most eight criteria. It carries Fork 3's rule into the verifier's and reviewer's text and product 07, the fix briefing's count of returns, the park, and the refuter's question.
- WO-289, WO-290, WO-291, WO-292 and WO-294 re-screened to Fork 2, each stating Fork 3, with their typed dependencies kept.

The six rules: none goes into force as written, and the sixteen rules on `main` merge into twelve. The appendix becomes one page in `docs/planning/`, marked unconfirmed until he corrects it, kept by the planner and loaded by no session. Retire WO-088, WO-091, WO-096 and WO-014; withdraw WO-244, keeping its checkpoint.

### 3. Factual errors

1. **Chair's facts.** "Part F is 1,006 changed lines in 10 files" counts every part's changes in those files.
   - `harness-host.ts` also carries Part A's cadence line and Part B's launch count.
   - Part F's drive-route code depends on Part D's `childLimit`, which `main` lacks: `grep -c childLimit` gives 0 in `main`'s `packages/skeleton/src/time-limits.mjs`.
2. **Fork 1(c).** The rule in force does not ask to undo the 2026-11-19 addition. The rule is prospective, and the pass that wrote it kept Part F in WO-288. `main`'s sequence reads "WO-288 first, to its end" and names Part F's sentences as the reason; the chair's diff of `docs/planning/sequence.md` removes that entry.
3. **P2.** WO-244 cannot go to `docs/retired/`. That route is for a proposal retired before activation (`sequence.md`, "Every open order"), and WO-244 was activated on 2026-11-08, per its Not now entry. It has to be withdrawn.
4. **P3.** "The dependency-free checker the console already has" is a test helper, not shipped code (`runtime-status.test.ts:101`).
5. **P1.** The chair's direction asks for whole runs on the handed-over tree (pass document, item 3), which is today's handoff rule. It does not ask for a run after every edit.
6. **P5 (mine).** "Drive it from a checkout on main" is wrong for WO-288, because `main`'s configuration loader refuses its `kinds` key (WO-294, Observed gap).
7. **P5 (mine).** My per-criterion hours divided elapsed time by criteria of unequal size. The form study's comparison finds no saving in phase time (§2.7).
8. **Chair's draft.** The sequence still promises WO-289's line for a message sent mid-turn (`docs/planning/sequence.md:242–245`), which the re-cut removed. P1 and P4 caught this; I missed it.

### 4. Where I changed my mind

- **The queue form:** from keeping it narrow to retiring it, because of P2 and the form study's §2.7. My economy figure was wrong (error 7).
- **Lists for claims over a set:** built before activation by a source independent of the implementation, not by a step of the order itself (P4).
- **The return rule:** open versus closed failure (P2); missing evidence is unmet (P4); red first (P2).
- **The final review:** no second whole read. P2 and P3 left this open; FINAL-001's own account (line 135) settles it for me.
- **WO-289's mid-turn line:** I asked to restore it. I now accept its removal (P4), on two conditions: his complaint is recorded with a reopening condition, and the sequence's promise is struck. It blocks no instance and needs a read of the host's transcript.
- **Where I hold:** Fork 1 (a) over (b) and (c), because Part F is coupled to Part D. And a regression against `main` on supported input still returns an order, against the chair's draft rule.

### 5. The first page

Nothing ran while you were away. The plan is ready.

1. **WO-288 ends with one message from you.** The message:
   - puts the review recorder's reader back to what `main` does;
   - strikes the clause of criterion 14 that asked for more;
   - settles criteria 25 and 27 on named evidence;
   - re-runs every test on the final tree.

   The order then gets one verification and one final review. If either fails, it parks, and the instance's fixes (Part F, already filed as their own order) go first. The text to paste is in the pass document. After it, type `resume: verify` and then `resume: final review`. `drive:` cannot start this order until WO-294 lands.
2. **From now on:**
   - Orders are small, and `drive:` runs them in two lanes.
   - Every criterion is a short list of scenarios, fixed before work starts.
   - After a repair, every test runs again, and only the change is read again.
   - An order parks at its third failed judgment.
   - Nothing is added to a running order.
   - No program reads a fact from prose.
3. **Yours to decide:**
   - The paste.
   - Retiring four parked orders and withdrawing WO-244.
   - Whether the one-page `What the operator wants` reads you right.

## GPT-6.2 Astra

### 1. Corrections to the agreement

- **A1.** P5 placed today’s constraint at acceptance and expected operator attention to become the next constraint. My inference is that repair occupies the line while the owner holds the decision that can free it. WO-288 spent 45 h 13 min between phases. The cause of much of that time, including the wait before final review, is unknown. An absence grant should name the orders, permitted effects, expiry and stopping condition. The owner retains the merge. WO-288-D313 and D319 (`worktree:docs/evidence/WO-288/decisions.md:12595`) · `docs/lineage/idea-ledger.md:7110`
- **A2–A3.** Restoring `main` removes WO-288’s widened search. The existing reader still scans mixed text for a findings object. The whole-result contract is a separate delivery. I sign the sequence **worker result → report judgments → order fields**. P3 originally placed orders second. `scripts/lib/review-worker.mjs:2406`
- **A4–A5.** P3 retained a full final read. P2, P3 and P5 called for fresh tests on every edited tree. I sign one passing product gate per code identity, reused across roles, and document evidence on the exact tree. A reviewer may read a whole component when the effect of a repair is uncertain. Planner and refuter may change an evidence method under delegated authority. A smaller promise requires the owner’s election, including a cut specified at filing. `docs/product/07-execution-guide.md:4059` · `docs/product/07-execution-guide.md:4669`
- **A6–A7.** Count this room once toward WO-244’s two further manual runs. P2 proposed retiring WO-244. During execution, prohibit new promises while allowing repairs and tests needed for existing ones. Stopping compulsory delivery of whole critic reports requires an explicit edit. WO-288’s frame orders delivery, its emitted role repeats it, and criterion 31 checks the frame. I would preserve the full report for retrieval and send the owner decisions requiring attention. `docs/planning/sequence.md:287` · WO-288 frame, line 219 (`worktree:docs/work-orders/WO-288-cores-own-tooling-lands-as-one-order.md:219`) · packages/skeleton/src/loadouts/contributor.ts:123 (`worktree:packages/skeleton/src/loadouts/contributor.ts:123`)
- **A8.** An explicit pause takes effect immediately. A standing process change gets a separate assessment covering cost, what could break, doing nothing, the alternative and a reversal condition. Put planner proposals outside the operator’s rules block. Its validator requires an observed operator message and matching digest. Trial the change at the decision point, name the instruction or step it replaces, and open each pass with time from original need to release, releases per day, operator interventions, emergency sessions and net rule growth. `scripts/lib/planning-document.mjs:183` · November 25 pass, line 402 (`docs/planning/passes/data-is-the-record-2026-11-25.md:402`)

### 2. The six forks

**1. WO-288 — C, with a port to `main`.** Move 36 into WO-289 and 34, 35 and 41 into WO-297. Keep 37–40 in the remainder. F’s hook and role sentences are separable from A’s cadence and B’s worker accounting. Carry the unfinished-dispatch helper and adapt D’s timeout calls. Prove the next action and actual remote refs in an upgraded starter. Integrate both releases, restore the baseline reader and amend 14/25/27 as below. Allow one verification and one final review. Park on either return. **Inference:** C offers the shortest independent path to the first fix. A costs fewer owner decisions and merges if it passes. An earlier independently qualified rollback would change my vote. harness-host.ts:7798 (`worktree:packages/skeleton/src/harness-host.ts:7798`) · VER-015.md:117 (`worktree:docs/verifications/WO-288/VER-015.md:117`)

**2. Criteria — B.** Name the user-visible behavior, supported domain, public command and observable result. Choose scenarios with a failing control, an invariant enforced by construction that one admissible counterexample disproves, or a list frozen at a named revision. A step may freeze an independently sourced list. The inventory scanned 661 files and missed two child deadlines. The refuter predicts outcomes independently before activation. Lint fields and references. Make the control fail as the executor’s first step, using a planted fault if the baseline already passes. An indistinguishable control returns to planning immediately. I would require separate discovery if the refuter cannot establish the population. VER-015.md:29 (`worktree:docs/verifications/WO-288/VER-015.md:29`) · WO-289, line 425 (`docs/work-orders/WO-289-a-session-is-told-to-go-on-and-ends-its-turn-only-for-what-the-operator-must-do.md:425`)

**3. Returns and termination.** Input a kit writer produces or a documented command admits is supported, whoever authored the fixture. Return a broken promise, supported regression, attributable required-gate failure, or Clean Room, authority or credential breach. Silent loss qualifies. A refusal with a remedy is acceptable where the contract permits refusal. A retained reproduction blocks while it demonstrates a current violation. Missing proof yields *incomplete*. Final review probes integration, unread interactions and high-risk consumers. Count failed verifications and final reviews together per activation. At two, planner and refuter reconsider repair, equivalent proof or an authorized cut. At three, the lifecycle parks attended and driven work. A carried-claim escape would widen final review. Execution guide:4012 (`docs/product/07-execution-guide.md:4012`) · FINAL-001.md:141 (`worktree:docs/final-reviews/WO-288/FINAL-001.md:141`)

**4. Keep the queue form narrowly.** Require one releasable outcome, shared design, at most ten criteria, independently verifiable parts and a cut authorized at filing. A waiting fix gets its own release. Drive small orders. Use two disjoint worktrees on a named grant, one writer each. Keep one final-review-through-release window and schedule merges where that saves the owner a visit. Verified parts of one approved release may share its integrated gate. Separate orders retain their own closes. WO-276 used 19 dispatches against an estimated 79. I would retire the form if the next qualifying order delays a waiting consumer or cannot exercise its cut. Form study:314 (`docs/planning/passes/the-kit-stops-no-work-2026-11-16-wo-276-form-study.md:314`) · `docs/planning/sequence.md:17`

**5. Choose the record by its writer.** First, accept one whole worker JSON result through its launch transport or designated artifact. Bind launch and tree independently of the payload. Validate before filing. Missing, malformed or multiple results yield *incomplete* and no filing. An identical retry files once. Second, submit verdicts, criterion judgments, findings and attestation as JSON to the result command. The lifecycle event identifies the immutable record by digest. Third, give authored orders one versioned JSON header between exact reserved marker lines. Duplicate markers invalidate it. Runtime and lint share validators. Keep the pinned Markdown parser for document checks. I would use standalone order JSON if examples can change the extracted record. change-review-protocol.ts:199 (`packages/skeleton/src/change-review-protocol.ts:199`) · `scripts/resume.mjs:2338`

**6. File and recut against `main`.** Proposed criterion counts follow. File WO-297 (3, sign-off, refused publish, actual refs) and WO-298 (3, strict result). Recut WO-289 (9, continuation and pause) first, WO-291 (10, target base and pin) as its possible pair, WO-292 (9, guards and first refusal) after publication, and WO-290 (6, one continuation) conditional on recurrence. Advance WO-294 (8, drive startup) before WO-298, WO-293 (5, judgments and parking) and WO-295 (1, refuter prediction). Absorb WO-296 into WO-293. Replace six draft rules with sourced directions and separate assessments. Condense the appendix into the existing Focus section, maintained by the planner for owner correction. Retain every *Not now* trigger. Advance the console fix alone if it blocks qualification. Sequence:242 (`docs/planning/sequence.md:242`) · Sequence:281 (`docs/planning/sequence.md:281`)

### 3. Factual corrections

- **The 1,006 lines are a ten-file diff total.** I reproduced the sum against `main`. It includes other parts’ edits and omits F code. The hook calls `unfinishedDispatchLine` outside the ten files. The drive records a post-review publication refusal in another omitted file. Within `contributor.ts`, the turn rule and reviewer’s publication instruction can be selected separately. The drive uses D’s `childLimit("drive.git-read")` and keyed remote fetches. `main`’s fetch accepts `timeoutMs`. Identical integration is therefore an unsafe premise. Preserve the existing bounds during the port, regenerate outputs and verify the integrated result. dispatch-bound.mjs:465 (`worktree:scripts/lib/dispatch-bound.mjs:465`) · drive-session.mjs:356 (`worktree:scripts/lib/drive-session.mjs:356`) · contributor.ts:922 (`worktree:packages/skeleton/src/loadouts/contributor.ts:922`) · drive-route.mjs:343 (`worktree:scripts/lib/drive-route.mjs:343`) · drive-route.mjs:872 (`worktree:scripts/lib/drive-route.mjs:872`) · main github-repository.mjs:315 (`scripts/lib/github-repository.mjs:315`)
- **P5’s early count holds.** For November 1–9 UTC, I counted 20 distinct final-review passes, one to three verifications each, and a median activation-to-pass time of 10 h 54 min. WO-245, WO-248 and WO-250 finished that interval under six hours. Several activation intervals overlapped. November 10–25 had six passes, including two queue orders, WO-276 and WO-287. WO-288’s last event is a repair request. These figures measure final review. Release throughput needs release evidence. WO-245.jsonl:6 (`docs/control/orders/WO-245.jsonl:6`) · WO-248.jsonl:6 (`docs/control/orders/WO-248.jsonl:6`) · WO-250.jsonl:6 (`docs/control/orders/WO-250.jsonl:6`) · WO-288.jsonl:70 (`worktree:docs/control/orders/WO-288.jsonl:70`)
- **The eighteen escapes were all filed as follow-ups.** WO-284 contributed one and WO-287 seventeen. Some were repaired during final review. WO-288 supplies the stronger reason to keep an independent attack on a recorder that can silently lose evidence. Its repair reader cleared 454 lines, while the Part B reader found two independently reproduced blockers. WO-284 final review:35 (`docs/final-reviews/WO-284/FINAL-001.md:35`) · WO-287 final review:128 (`docs/final-reviews/WO-287/FINAL-001.md:128`) · WO-288 final review:143 (`worktree:docs/final-reviews/WO-288/FINAL-001.md:143`)
- **P5’s proposed rollback instructions overstate `main`’s refusal.** With `--format json`, `main` accepts a single recognized object surrounded by prose. VER-015 proved silent misfiling at its judged identity. The later repair reported zero filings on 156 damaged cases. Its subsequent complete run stopped on a fixture issue, and the correction has focused evidence only. Neither the old failure nor the focused successes settle release fitness today. `scripts/lib/review-worker.mjs:2432` · WO-288-D332 (`worktree:docs/evidence/WO-288/decisions.md:12948`) · WO-288-D333 (`worktree:docs/evidence/WO-288/decisions.md:13005`)
- **P5’s proposed drive from `main` still has two obstacles.** The old validator rejects WO-288’s `kinds` configuration. Even after lookup succeeds, the router stops a pending repair at three failed verifications. The bounded repair needs the attended order session. For a newly filed order, `worktree start` activates it before the routing phrase is useful. November 23 pass:141 (`docs/planning/passes/the-kit-keeps-working-2026-11-23.md:141`) · `scripts/lib/drive-route.mjs:123` · Execution guide:485 (`docs/product/07-execution-guide.md:485`)
- **Criterion 27 already admits a profiled negative.** It separately requires zero older-receipt rebuilds. Part E also addresses a real failure under load. The console task exceeded its memory budget in two full document gates, passed alone, and had passed in a full gate three hours earlier. A green isolated run cannot settle that failure. WO-288 criterion 27:591 (`worktree:docs/work-orders/WO-288-cores-own-tooling-lands-as-one-order.md:591`) · November 23 pass:1025 (`docs/planning/passes/the-kit-keeps-working-2026-11-23.md:1025`)

### 4. Where I changed my mind

P3 moved me from parking the umbrella indefinitely to preserving **one bounded attempt after the waiting fixes ship**. P2 identified a smaller recorder rollback than discarding Part B. Part E’s measured failure makes preserving that attempt worthwhile. P5’s early cohort supports a trial of small orders. The first release date under either course remains an inference. My evidence here is a read-only source comparison, filed judgments and lifecycle counts. I ran no product test or gate.

The November 19 addition is recorded under intake SHA-256s `d6b031ccfd876ff0035a6e5011015d644086a8c1a656b84f59613e5d9136e132` and `8bff23961c67992c80637cf28869982e03e54bce1b7b59890d333905f06b551e`. The November 23 priority for a waiting instance fix is recorded under `0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270`. The later rule supports recommending a cut. The owner’s message in WO-288 supplies authority to make it. **I sign this plan for P4.** WO-288-D049 (`worktree:docs/evidence/WO-288/decisions.md:2656`) · November 23 pass:814 (`docs/planning/passes/the-kit-keeps-working-2026-11-23.md:814`)

### 5. First page for the operator

The first update should let a session take its next authorized step when the daily figure is reached. The second should tell you whether the reviewed branch reached its remote. Each gets independent proof in an upgraded starter.

**Suggested message for WO-288’s existing session**

```text
resume: fix

Preserve this checkpoint. Move criterion 36 to WO-289 and 34, 35 and 41 to WO-297. Authorize those starts from main. After they ship, integrate main here and bind this amendment for both judges.

Restore main’s JSON-return reader and remove 14’s closing-prose clause. Narrow 25 to the D3 inventory, the two VER-015 child deadlines and a planted unregistered deadline the inventory must catch. For 27, run five comparable trials. Accept a median at most half the base, or a profiled negative explaining what must change. Require zero older-receipt rebuilds either way.

Keep conduct reports on file and send me only decisions I own. Give the remainder one verification and one final review under this paper’s evidence rule. If either returns it, park it with its worktree and evidence. I retain the merge.
```

## GPT-6.2 Sol

### Corrections to “agreed”

`W/` denotes the WO-288 worktree. Other paths refer to the main checkout.

- **A1.** Operator attention constrains decisions that require his authority. Rework is the immediate delivery constraint while WO-288 holds the line. P5 makes that distinction, and I now hold it too. The record attributes 45 h 13 min to gaps between phases, with only one avoidable wait directly established. Track repair, dispatch wait, merge wait and release separately. An absence grant names orders, effects, expiry and stopping conditions. The operator retains the merge. `W/docs/evidence/WO-288/decisions.md:12385`, `W/docs/evidence/WO-288/decisions.md:12592`, `docs/lineage/idea-ledger.md:2135`
- **A2–A3.** Remove WO-288’s widened search. A rollback restores the baseline behavior. The first contract pilot establishes which result the worker submitted. P3 placed order contracts before report judgments. I put report judgments second because they already control lifecycle transitions. Keep the pinned parser for document checks and retain historical readers for archived records. New records must pass their declared validator before filing. `scripts/lib/review-worker.mjs:2370`, `scripts/lib/off-ramps.mjs:230`
- **A4–A5.** A new product identity needs a passing product row at that identity, with the required selection and limits. Roles reuse that row. Document-only changes need document evidence at the applicable tree. Reproduce blockers and revisit affected claims and consumers. Unknown impact widens the review. Planner and refuter may change how a promise is proved within recorded authority. Narrowing the promise requires the owner. Count failed verdicts once per report allocation, across both judgment phases. `docs/product/07-execution-guide.md:4059`, `docs/product/07-execution-guide.md:4669`, `docs/planning/sequence.md:172`
- **A6–A7.** WO-294 goes before the first drive that needs it and before another umbrella integration attempt. A clean-base instance fix can proceed by the attended route. Part F’s criteria 34–36 and 41 cover the reported blockers. Preserve 37–39 as separate maintenance candidates and the six follow-ups under 40. Inference: extraction gives the waiting fixes the shortest credible independent path. Close-first costs the fewest owner decisions if it passes once. The bounded close after extraction earns its place only by offering D and E one chance to land together. `docs/planning/passes/the-kit-keeps-working-2026-11-23.md:137`, `W/docs/work-orders/WO-288-cores-own-tooling-lands-as-one-order.md:618`
- **A8.** Keep sourced direction and planner judgment side by side. The current checker establishes that an operator message exists and matches its digest. It cannot establish that a proposed rule follows from the message. Put proposals outside that block until authorized. Trial changes at the decision point and retire the conflicting instruction. Compare the next five deliveries on elapsed time from the original need, releases, operator touches, emergency sessions and rule growth. Ask the refuter whether the pass amplified or retreated. Count this room once toward WO-244 when it reaches a signed plan. `scripts/lib/planning-document.mjs:165`, `docs/planning/sequence.md:287`, `docs/planning/passes/the-kit-keeps-working-2026-11-23-critic-of-the-critics.md:76`

### The six forks

#### 1. How WO-288 ends

**Vote (c).** Hook and role edits separate from A/B. Port the Stop helper and publication driver, adapting D’s new keys. `W/scripts/lib/dispatch-bound.mjs:465`, `W/scripts/lib/drive-session.mjs:1222`, `W/packages/skeleton/src/time-limits.mjs:270`

**Move me** with an independently qualified earlier rollback or a clean-base blocker the console fix cannot remove.

**Paste in WO-288 after the turn and publication fixes ship.**

```text
resume: fix

Cut Part F. Restore main’s recorder and remove criterion 14’s closing-prose clause. Amend 25 to D332’s frozen 154 calls, both D326 Codex arms and the planted unkeyed control. Apply 27’s memory and rebuild rules. Disable core cadence and prove opt-in in a fixture. Give it one verification and one final review. Park on either return and preserve checkpoints.
```

#### 2. What an unambiguous criterion is

**Vote (b).** WO-289 can satisfy its wording checks while sessions still stop. VER-015’s scanner missed a limit that reached Git. `docs/work-orders/WO-289-a-session-is-told-to-go-on-and-ends-its-turn-only-for-what-the-operator-must-do.md:425`, `W/docs/verifications/WO-288/VER-015.md:29`

**Sign.** Name one behavior, supported inputs, the public command and the observable result. Use scenarios with a failing control, an enforced invariant with a decisive counterexample, or a list frozen at a named checkpoint. A discovery step may build the list from a source independent of the implementation under judgment. The refuter predicts outcomes before activation. Lint fields and references. Establish the failing control before changing behavior.

**Move me** if independent predictions still disagree or the control accepts the defect.

#### 3. What returns an order

**Vote and sign.** Return a reproduced broken promise, supported baseline regression, attributable required-check failure or protected-boundary breach. Support follows kit writers and documented workflows, including faithful fixtures. A remedy excuses a contract-permitted refusal. Retained reproductions use the same rule. Missing proof makes judgment incomplete. Board hypothetical findings with reopening conditions. Final review judges integration, release risk and unread impacts. At the second failed verdict, planner and refuter choose a proof-equivalent repair or propose an owner cut. At the third failed verdict per activation, the lifecycle parks attended and driven work. `docs/product/07-execution-guide.md:3995`, `W/docs/final-reviews/WO-288/FINAL-001.md:141`, `scripts/lib/drive-route.mjs:123`

**Move me** if carried evidence repeatedly conceals supported regressions.

#### 4. The queue form and the economy of the line

**Vote and sign.** Keep the form for one releasable outcome with a shared design, roughly ten criteria and independently verifiable slices. Specify each cut at filing and obtain authority for it before use. Give waiting fixes their own delivery. Drive one order by default. An explicit grant may run two with disjoint authored and generated surfaces. Use serial merge windows. Share a release when the slices are ready together and the existing close route supports it. WO-276’s dispatch savings were estimated, while its release wait was observed. `docs/planning/sequence.md:17`, `docs/planning/passes/the-kit-stops-no-work-2026-11-16-wo-276-form-study.md:314`

**Move me** if matched deliveries show more waiting or operator work.

#### 5. The form of a record

**Vote and sign.** First, a worker submits one whole versioned JSON result. Bind it to the host-issued launch and tree, including required Items. Missing, malformed or competing submissions leave the review incomplete with no filing. Commit once after validation and make identical delivery retries safe. Second, give verdicts and judgments as JSON to the result command. Keep durable evidence beside the lifecycle log and render Markdown. Third, allow a single exact-marker JSON block for authored order contracts. Validate it independently of Markdown grammar. Preserve closed records. `packages/skeleton/src/change-review-protocol.ts:297`, `packages/skeleton/src/worker-transport.ts:785`, `docs/lineage/idea-ledger.md:9606`

**Move me** on divergent historical replay or ambiguous block boundaries.

#### 6. What this pass commits while he is away

**Sign.** Re-cut against `main`. WO-289 turn behavior (6), WO-291 target base and heading (10), WO-292 target guards (9), WO-294 routing (8), WO-293 termination (6), WO-295 refuter prompt (2). File Reviewed publication and sign-off (5), Console gate memory (2, conditional) and Whole worker result (4). Hold WO-290 continuation (6) for recurrence. Supersede WO-296. Remove the six draft rules and duplicate screens, retaining sourced proposals. The planner maintains a short `docs/planning/operator-intent.md` from the appendix. Stage WO-088 and WO-096 retirement for authorization and retain the other triggers. `docs/planning/sequence.md:281`, `docs/planning/passes/data-is-the-record-2026-11-25.md:400`

**Move me** if a starter replay identifies an earlier blocker.

### Factual errors

- **The chair’s Part F count measures overlap.** The ten named paths do total 1,006 changed lines against `main`. They include A’s cadence hook, A/B’s worker accounting and D’s limit changes. They omit Part F’s supporting changes in `dispatch-bound.mjs`, `drive-session.mjs` and fixtures. Identical hunks are useful where their prerequisites match. Independent qualification is still owed. `W/docs/work-orders/WO-288-cores-own-tooling-lands-as-one-order.md:417`, `W/packages/skeleton/src/harness-host.ts:440`, `W/packages/skeleton/src/harness-host.ts:560`, `W/scripts/lib/drive-session.mjs:347`
- **P2 and P5 overstate the strictness of `main`’s recorder.** It accepts whole JSON and a lone fence, then scans mixed text for a unique findings object. It refused the damaged assignments in VER-015. That evidence supports reverting the newly widened search and leaves a separate reason to establish a designated submission channel. `scripts/lib/review-worker.mjs:2370`, `scripts/lib/review-worker.mjs:2402`, `W/docs/verifications/WO-288/VER-015.md:23`
- **P5’s early count holds.** I counted the first passing `FinalReviewCompleted` per order in UTC. November 1–9 had 20, with overlapping activations, one to three verifications each, a 10.9-hour median and three under six hours. November 10–25 had six passes, of which **two** were queue-form orders. WO-288 had fourteen failed verifications, one passing verification and one failed final review. The counts measure review throughput. `docs/control/orders/WO-248.jsonl:6`, `docs/control/orders/WO-260.jsonl:14`, `docs/control/orders/WO-276.jsonl:42`, `docs/control/orders/WO-287.jsonl:18`, `W/docs/control/orders/WO-288.jsonl:70`
- **P5’s fixed-half objection omits criterion 27’s other outcome.** The criterion accepts a measured negative with a profile and a change needed. Its receipt-rebuild requirement still applies. The chair’s memory-gate evidence comes from two November 24 failures and an earlier pass on the same planning branch. Reproduce that stop before advancing the console slice. `W/docs/work-orders/WO-288-cores-own-tooling-lands-as-one-order.md:591`, `docs/planning/passes/the-kit-keeps-working-2026-11-23.md:1022`
- **P2’s one-phrase economy starts after activation.** The router has no activation action. One owner instruction can authorize both steps, and the existing commands still have to perform them. The current three-verification bound stops the drive while repair is pending. It does not park the order in canonical lifecycle state. `scripts/lib/drive-route.mjs:22`, `scripts/lib/drive-route.mjs:123`, `docs/product/07-execution-guide.md:484`
- **The draft sequence promises a removed behavior and links to an absent layout.** WO-289 explicitly leaves mid-turn messages unmarked. The layout link at `docs/planning/sequence.md:254` has no file at its target. `docs/planning/sequence.md:242`, `docs/work-orders/WO-289-a-session-is-told-to-go-on-and-ends-its-turn-only-for-what-the-operator-must-do.md:424`

Both checkouts and the lifecycle counts were checked read-only. The clean-base slices still need starter qualification. The stopped repair still lacks a passing complete run for its latest edits. Effective model and effort are unknown in this review. `W/docs/evidence/WO-288/standing.md:11`

### Where I changed my mind

- **P3 moved me from withdrawal to a bounded second chance.** Separate the waiting fixes first. Once they ship, the remaining order can earn one attempt without holding them hostage. WO-294 and a fresh integrated qualification are real prerequisites for that course.
- **P5 moved me to distinguish today’s repair bottleneck from the standing constraint on owner decisions.** The early-November recount supports the possibility of faster review throughput. It leaves release throughput and the cost of driven work to measure.
- **P4 made continuation a required observation.** A starter replay must show the session taking its next authorized action after the daily figure and honoring an explicit pause. P2’s failing control belongs in that same proof. I would keep the control and drop the one-hour deadline.

### First page

Approve the starter fixes first. One should let an ordinary session keep working after it reports the daily figure, while still honoring a pause. Another should tell you which reviewed branch still needs publishing and respect the sign-off level you set. Verify both from a clean v1.4.0 starter using a fixture remote. Give the target-base fix its own delivery.

If the console memory stop recurs during qualification, clear that specific blocker in its own order at the existing budget. Fix core’s drive startup before relying on it to carry later orders between phases. Each order should come to you with one activation decision and, after independent review, one merge decision.

Once the turn and publication fixes are available, give WO-288 one last attempt in its own session. Restore the baseline recorder, settle the inventory and memory on named evidence, and keep the checkpoints if either judgment returns it.

Measure time from the original request through the starter release. The time already spent waiting belongs in that number.
