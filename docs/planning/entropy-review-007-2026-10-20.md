# Entropy Reducer planning pass — REVIEW-007 (2026-10-20)

## 1. Subject, authority and provenance

The operator opened `planning: entropy reducer` on 2026-10-20 at about
19:30Z in Claude Code (Fable 5.1, effort max, host-selected), with no
other message. The ignored compaction-safety capture
(`docs/intake/notes/planning-entropy-reducer-2026-10-20.md`) has SHA-256
`0742cd45ee2aaf6a9e2466aec73ead29a871d414e52328e1298f644478eb6190`; it is
a sibling record, never a source to mine. This document is planner
synthesis of public repository evidence, and the clean-room screen found
no suspect material in the sources used: repository records, the gate
index of this checkout and the two Entropy Reducer receipts.

Entry was clean `main` at `e4c46109`, WO-218 closed as v0.87.0 (the tag
at origin, the GitHub Release `DotLn v0.87.0` published at 19:23:43Z) and
no active order. `entropy subject` found no filed review both refuted and
undisposed (the latest filed review is REVIEW-006, consumed on
2026-10-10), so the pass dispatched the pinned reviewer against that
commit. The pass runs on `planning/2026-10-20-entropy-reducer`, created by
`plan start`; only the parent writes this planning checkout. Fan-out,
planned against `subagentCap` 20 with 0 admissions observed at entry:
three workers and no descendants, the external reviewer, the blinded
entropy refuter and one background planning refuter after the subject is
committed; no research worker, because every input is a record on this
machine.

Aim, as read: consume before produce; dispose every surviving finding and
packet in this pass; retire WO-218 from the sequence and decide the rows
its close boarded, one of them a planning decision on the shape of the
three remaining batch orders; re-dispose every reopening condition that
fired since receipt 049. Traps named before the material choices: filing a
gate-time order from WO-218's thirteen complete runs (shifting the burden
onto the gate lane, which the operator declined on 2026-10-17; the
measurement is recorded and the lever named instead); treating the three
remaining batches' identical criterion 2 as settled text when WO-218's
first verification failed on it (the criterion is rewritten before another
batch pays that round); adding WO-218's four boarded rows to WO-219
because it is convenient (weighed against a fifth batch in §6); and the
NoOp of consuming only the review, which would have left those rows
untriaged and the fired conditions unread.

## 2. Entry observations

`plan start` and `plan failures` in the window since receipt 049
(2026-10-19T23:25:08Z): 1 failed verification (WO-218 VER-001, criterion
2), 0 failed final reviews, 1 repair, 1 order made ready, 1 failed first
verification, 0 corrections, 0 off-ramps and 1 execution amendment (WO-218
D053, the release classification assigned to the order). FINAL-001 recorded
23 escapes, eleven of them repaired inside the review and the rest boarded
(§6); the sixteen measured final reviews of the ten most recent orders
recorded 184, 11.5 per review (161 and 10.1 at the 2026-10-19 pass). The
first-review escape counts of the last seven closed orders are 12, 25,
17, 20, 20, 3 and 23 (WO-215, WO-210, WO-213, WO-216, WO-221, WO-222,
WO-218): not three consecutive rises, so the machinery reset's reversal
condition is not reached, and the two batch orders at the ends of that
list are its largest counts. Local records: 1 release-close record
(WO-218's; the feed flags it as a dry run, while the tag and the Release
exist at origin), 0 host denials, 10 interventions (2 directions at
WO-218's release close, 8 unclassified and unattributed), 5 long phases
(all WO-218's), 0 repeated product-gate rows at a green identity, 17
failed gate rows (WO-218) and 1 shell diagnostic (an equals-word,
unassigned); the eight recent closes split five delivery and three
machinery. The record totals stand at 148 failed verifications, 22 failed
final reviews, 173 repairs, 180 orders made ready, 87 failed first
verifications, 181 corrections, 6 off-ramps and 78 amendments.

Canonical status reads `closed`, VER-002 pass, FINAL-001 pass, legal next
`release-close, next, activate`. Process health: no budget breach; WO-218
tokens 316,976,199; first verification failed in 6 of the last 8 closed
orders; 0 reopen candidates. WO-218's phases from the control events:
implementation 257 minutes against the record's 75-minute median,
verification 50 against 17, repair 159 against 45 and final review 116
against 25; the order closed about 19 hours after receipt 049 and about
17 hours after its activation. The register held 163 pending rows at
entry (1 open, 5 untriaged, 157 deferred) of 1,214, at revision
`b0a0522b…`; the five untriaged rows are WO-218's own boarding decisions
(§6). No reader run is due (`readerDue` false; seven unscored releases on
an unchanged profile).

**Routing the failed report.** WO-218 VER-001 failed criterion 2 because
five settled rows named no case that fails without their fix under a
Preflight suite: three of the named cases pass at the order's base
(D055). The repair replaced the evidence class with 91 paired controls,
each case run with only its row's fix reverted and recorded with both
arms' exit codes, and VER-002 replayed all 91 in a disposable copy. The
cause class is planning's: the criterion said "a case that fails without
the fix" and named no control, and the same sentence stands in WO-217,
WO-219 and WO-220. §6 rewrites it before another batch pays that round.
The five long phases are the batch's size (45 rows, 91 controls, 64
decisions); the 17 failed gate rows and the ten failed complete runs are
read in §3.

## 3. Reopening observations

`plan conditions` at 19:31Z (44.7 s; load 2.8 on 16 CPUs):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 5.056 s | 8 s | no |
| Release table lag | 1 tag (v0.87.0) | 3 tags | no |
| Latest two closed orders, distinct evidence blob bytes | 2,509,079 (WO-222) and 1,205,251 (WO-218) | 1 MB in two consecutive orders | yes |
| Evidence path growth since Monday 00:00 UTC | 4,841,097 bytes | 10 MB | no |
| collectSources | 0.857 s | 3 s | no |
| Uncached release listing | 4.267 s | 10 s | no |
| status --all --json | 6,499,372 bytes | 32 MB | no |
| Work-order index | 2.115 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured fresh; read from rows below | 30 s / 15 s | from rows: yes |
| Plain gate, thirty-day median | 298.8 s | 360 s | no |
| gate-task vertical | 722.7 s against a 753.9 s median (74 samples) | 1,130.8 s | no |
| gate-task vertical:file:test-vertical.mjs | 723.5 s, no earlier sample | none | unknown |
| gate-task target-worktree | 611.3 s against a 126.6 s median (38 samples) | 189.8 s | yes, the pre-split sample |
| gate-task vertical statements / judgment | 549.9 s / 476.9 s against 491.1 s / 469.2 s | 736.7 s / 703.8 s | no |
| coldStartBytes.executor | 29,213 | 24,576 (WO-150-D003) | reopened; the ceiling is 29,246 |

**The evidence condition fired.** WO-222 committed 2,509,079 bytes of
distinct evidence blobs and WO-218 1,205,251, the second consecutive
order over 1 MB, which is the per-order clause FUP-8a4e201d861208ad was
re-deferred under on 2026-10-13. The bytes are the records each order's
criteria required: WO-222's measured series (`before.json` 552,574,
`after.json` 1,213,169 and `after-attempt-1.json` 365,150 bytes, the
three forced-fresh runs its acceptance named) and WO-218's control
record (`repair-controls.json` 260,170 and `repair-controls.md` 87,975
bytes, the 91 paired controls that answered VER-001), its 64 decisions
(176,784 bytes) and its README (85,568 bytes). The week added 4.84 MB.
Neither is a diagnostic capture of the kind the 2026-10-13 pass named;
both are the evidence class a later verifier replays. The row is
re-deferred under a condition that separates required records from
captures (§5.3).

**The target-worktree task** is the same pre-split sample the 2026-10-19
pass read: WO-222 split the suite into four file lanes and no complete
run since has left a new `target-worktree` task row, so the hold stays
read as answered by WO-222 and reopens on a `target-worktree:file:*` row
above one and a half times its own thirty-day median once three samples
exist.

**The document gate from its rows.** 264 fresh passing `npm run
test:docs` rows since REVIEW-006 (2026-10-10T23:57Z) have a median of
117.7 s; the last 40 have 136.8 s and the nine since WO-222 merged
138.4 s; the latest, at WO-218's final review, took 133.7 s. The 2026-10-10
pass's figures were 110.9 s over 151 rows and 122.4 s over the last 40.
The 60 s and 20 s conditions of FUP-fb8cbeabbddef397 hold, as they have
since WO-186 moved `resume` onto the critical path; candidate 3's 180 s
is not reached.

**The complete runs, and the gate's share of WO-218.** Between WO-218's
activation (01:19Z) and its close (18:13Z) this checkout's gate index
holds 13 complete runs: 3 passed (1,673.7, 1,748.4 and 1,836.8 s, the
implementation handoff, the repair handoff and the final review) and 10
failed, 3 of them stopped by the structural phase within 15 s and 7 late,
at 325, 1,605, 1,717, 779, 873, 638 and 393 s. FINAL-001 names its two (a
direct Git spawn and the launchpad case census, bookkeeping rules tripped
by a new export case); the gate index records duration and exit code
only and its host-gate references name no retained log, so the cause of
the other five is unknown to this pass. Gate time in the window: 13,752 s
(3.82 h) of 34,971 phase seconds (9.71 h), 39.3%, of which complete runs
11,633 s (6,374 s in failed runs), document gates 1,412 s over 11 rows
(4 failed), structural rows 704 s over 24 (3 failed, each under 15 s) and
diff checks 3 s. The document gate is 4.0% of the phase time; the failed
complete runs are 18.2%. The passing complete-run median since WO-222
merged is 1,748.4 s over three runs, against WO-222's after median of
1,668.5 s and D015's reversal threshold of 2,538.4 s (no reversion), and
not half of the order-size rule's 24.9 minutes (not reopened). The
2026-10-10 pass's gate-time NoOp named "a pass measures gates above a
quarter of phase time" as a reversal condition; it has occurred for one
order, from failed complete runs and not from the document gate the NoOp
was about. §5.3 decides it.

**WO-216's measured claim at close three of five** (FUP-182984d482ca59ca):
13 complete runs against a baseline of eleven per closed order (not
below); no structural-class failure in the structural phase after two
minutes (its three stops took 12.7, 14.0 and 14.8 s, as designed) but two
bookkeeping failures inside complete runs at 638 and 393 s against 1.3
(not below); 229 gate task minutes against 545 (below). One of three
below baseline, as at closes one and two. The reading continues at the
next two closes.

**Order-lifecycle triggers.** Of 157 deferred rows, ten open their
reopening condition with a bare order lifecycle event (five on WO-083,
and one each on WO-098, WO-096, WO-193, WO-111 and WO-086); none fired,
since none of WO-083, WO-096, WO-098 and WO-193 has activated or closed
and the WO-086 collision clause remains unobserved. No deferred row's
condition names WO-218. The WO-111 row's second clause (two on-demand
reviews showing findings the lifecycle missed at an accepted cost) is
read in §5.3 against REVIEW-005, REVIEW-006 and REVIEW-007. The
2026-10-10 pass's candidate 2 (a typed `reopenOn` field) reopens when
such rows pass ten: they number ten, and no fired trigger was left.

**The cold start** is 29,213 bytes, 33 under its 29,246 ceiling; the
operator's reserved efficiency pass (FUP-f1c7a256bec46737, open,
unchanged reading). **The harness re-probe row** (FUP-ec75a4295bf36696):
this session and WO-218's final review ran Claude Code 2.1.304 against the
manifest's 2.1.263; no capability or role-text mismatch is observed and
no integration contract changed; re-deferred unchanged.

## 4. Review and blinded refutation

[REVIEW-007](../instance/entropy-reducer/runs/REVIEW-007.md) ran 1,322 s
(112 turns, USD 6.455) over 6,871 tracked paths with 1 denied tool call (a
Read outside the copy the reviewer made on purpose to test `--restricted`)
and filed two measured findings, one major and one minor, and two packets.
Both survived [REFUTATION-008](../instance/entropy-reducer/runs/REFUTATION-008.md)
(193 s, 25 turns, USD 0.753, 0 denials), which received reproduction
commands without the reviewer's narrative or proposals. Both workers
reported the source repository's tracked status and untracked listing
unchanged across their episodes, and this checkout's ref count by
namespace is the same before and after both (2 heads, 1,904 `refs/dotln`,
172 tags, 1 stash). The planner re-measured both findings at `e4c46109`
before disposing them.

| Item | Evidence accepted | Decision in this pass |
| --- | --- | --- |
| ER7-001, the frozen copy's route home | The refutation episode's own frozen copy listed this checkout as `origin` for fetch and push (`git remote -v` in the copy, found through the pending dispatch record). `freezeSubject` clones with `--no-hardlinks --no-checkout` and never removes or rewrites `origin`; the Claude launch passes `--safe-mode` and `--restricted` with Bash among `--allowedTools` and no permission prompts; the receipt's witnesses are the tracked status, the untracked listing and two inventories that skip `.git`. The drill on throwaway repositories in system temp created a branch in the source while both digests stayed at the empty-input hash. | Accept; WO-219 step 22 (§5.1). |
| ER7-002, WO-188-D015's reopening condition | `node scripts/docs-check.mjs` passes with 28 current operator-word advisories against 332 historical. WO-200-D002, WO-210-D024 and WO-221-D028 quote the replies the operator gave to proposals the sessions put, verbatim and without a capture digest, and WO-203 VER-001 line 149 quotes an operator phrase the same way; all four postdate D015's 0 current on 2026-10-08; no planning document cites D015; the 2026-10-19 standard pass's validation line called the advisories historical at a commit where 24 were current. The refuter's dissent: FUP-71fc2efc208f597a settled onto D015 under the narrower typed-quotation condition. | Accept; D015 re-disposed here (§5.2); WO-219 step 23. |
| Packet `frozen-subject-has-no-route-home` | Filed under `docs/proposals/`. | Accept; WO-219 takes its expected shape, with the refs digest recording rather than refusing on the explicit-commit route. |
| Packet `operator-word-reopen-observable` | Filed under `docs/proposals/`. | Accept; WO-219 takes the negative controls and the count by class; the typed refusal and the named records are unchanged. |

ER5-001's headroom check: REVIEW-007 used 55.1% of its 2,400 s limit
(REVIEW-006 29.3%, REVIEW-005 58.5%) and REFUTATION-008 10.7% of 1,800 s
(REFUTATION-007 7.5%). No reversal condition is reached (an observed
deadline loss, or two successive episodes of one kind above 80%); the
limits stay.

## 5. Planning decisions and NoOp records

### 5.1 One guard from the major finding

ER7-001 goes to [WO-219](../work-orders/WO-219-boarded-follow-ups-records-roles-and-the-harness.md)
as step 22: `freezeSubject` removes `origin` (or sets its push URL to a
refusing value) right after the clone and refuses to hand off a copy with
a configured remote; the confinement record digests the source's refs
(`git for-each-ref`) before and after the episode beside the two existing
witnesses, refuses a changed digest on the HEAD route and records it on
the explicit-commit route; fixtures cover a push attempt from the copy and
a moved source ref on each route; the README's sentence that confinement
is instructed and then checked names the refs digest. The NoOp was
weighed: leaving the channel open keeps every review and refutation under
instruction alone where ref writes are concerned, while the receipt says
the confinement is checked; the guard costs one Git command at freeze and
one digest on each side of an episode. Rejected: a dedicated order (axis:
the fixed cycle, for a guard of a few lines, when WO-219 owns the planning
machinery and runs second); a refusal on the explicit-commit route (axis:
the operator may move refs while a review of a named commit runs, and the
record is the honest witness there); relying on the Codex workspace
sandbox (axis: the Claude route is the pinned one, and the sandbox was not
exercised). Until WO-219 lands, the README states the channel in one
sentence, so a reader of a receipt knows what checked covers. This pass's
own two episodes ran with the channel open; the ref listing shows nothing
moved.

### 5.2 WO-188-D015 re-disposed

D015 (2026-10-08) widened the operator-word check, kept the regex advisory
because it cannot tell a paraphrase from a quotation, made the only
refusal a typed `operatorQuote` without a `captureSha256`, and reopened
when a new record quoted operator words without a capture digest and the
check admitted it. That has happened four times since, each a reply the
operator gave to a proposal a session put and the session recorded
verbatim: WO-200-D002 (2026-10-12), WO-210-D024 (2026-10-14), WO-221-D028
with its first evidence line (2026-10-19) and WO-203 VER-001 line 149. The
check admitted each as an advisory, and the advisory's 28 current rows
hold about 22 incidental quote characters beside them (JSON finding
arrays, program output, quoted document terms), so no planning entry read
the condition from the summary line; the 2026-10-13 and 2026-10-19 passes
classified rows by hand and the latter called them historical.

Decision: the advisory stays advisory and the typed refusal stays the
refusing route, as D015 decided and for its reason; the four records are
not rewritten (filed decisions and reports keep their bytes, and each
quotes a reply to a proposal the record itself names); the defect this
pass acts on is the advisory's noise, which WO-219 step 23 removes with
negative-control fixtures for each incidental class and a current count
by class, so a planning entry reads attributed speech from the summary
line. A record that must quote the operator writes the typed field with
its digest, as product 07 and the check already say. D015's reopening
condition is restated: the attributed-speech count passes ten after WO-219
lands, or a record is found to misstate the operator's words. The row the
register keeps for the condition is the accepted finding's
(FUP-46deeb2483a9c28d, allocated to WO-219).

### 5.3 Declined mechanisms and alternatives

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| A gate-time order, or the time-budgeted gate, from WO-218's 39.3% (the 2026-10-10 NoOp's reversal clause occurred) | The share is failed complete runs (18.2% of phase time) and the three required runs (15.0%), not the document gate (4.0%); the complete run at each handoff is product 07's rule since WO-216; the operator declined a time-budgeted gate on 2026-10-17 (the map's candidate 6 (b)), and nothing here changes that reading. What the pass can add is attribution: ten failed runs, three fail-fast structural stops under 15 s and seven late, two of them named bookkeeping by FINAL-001 and five unknown because the index keeps duration and exit only. Evidence: §3. | Each planning entry from the gate index. | Two consecutive orders above a quarter of phase time with the late failures' causes named, or the operator reopens candidate 6 (b). |
| A retained log for a failed complete run | The gate index's host-gate reference resolves to no file, so the cause of five late failures is unknown to this pass; a planning pass reads the index, not session scratch. Recording a log path per failed row is a change to the gate index's row shape, WO-217's subsystem, and no row asks for it yet. Evidence: §3. | At WO-217's close. | A pass needs the cause of more than two late failures in one order, or a WO-217 row touches the row shape. |
| A fifth batch for WO-218's subsystem | §6.2. | At WO-219's close. | WO-219's first verification fails on more than a third of its rows, or more rows land on the instance and publication subsystem before it activates. |
| Splitting WO-219 (50 rows, 27 steps) | Two orders pay two cycles; its Preflight runs the suites its steps name; the two exceptions are named in its Design and Known issues. Evidence: §6.2. | At WO-219's first verification. | That verification fails on more than a third of its rows, or its implementation passes 20 hours. |
| Sustain: the reviewer on a cadence (FUP-c7f181269a96c4c5, whose second clause occurred) | REVIEW-005, REVIEW-006 and REVIEW-007 each returned two measured findings the order lifecycle had passed, at USD 9.32, 5.03 and 7.21 per review-and-refutation pair; but nothing runs a review unless the operator opens a pass (product 07; WO-151's non-goal), the operator has not asked, and this pass's major finding is in the review machinery itself, which argues for closing that channel before any cadence. Evidence: §4; the three receipts' cost lines. | Each entropy pass. | The operator asks for a cadence, or a review finds a major defect outside its own machinery that a lifecycle gate had passed. |
| Rewriting the four records that quote operator replies | Filed records keep their bytes; each quotes a reply to a proposal the record names; no reader has reported a misstatement. Evidence: §5.2. | On a reported misstatement. | A record is found to misstate the operator's words. |
| Making the attributed-words advisory a refusal for new text | D015's reason stands: the regex cannot tell a paraphrase from a quotation; the typed field refuses. Evidence: D015. | At WO-219's close. | The narrowed advisory still admits a verbatim quotation after WO-219. |
| An evidence ceiling or pruning (FUP-8a4e201d861208ad, fired) | The bytes are the records two orders' criteria required (WO-222's measured series, WO-218's controls), which a later verifier replays; the week added 4.84 MB; pruning stays the operator's. Evidence: §3. | Every planning entry. | A week adds more than 10 MB, two consecutive orders commit more than 1 MB of blobs no criterion required, or measured reading or storage harm occurs. |
| Re-basing the `target-worktree` median | The latest fresh sample is still the pre-split task's; no new sample since. Evidence: §3. | Each planning entry. | A `target-worktree:file:*` row above one and a half times its own thirty-day median once three samples exist. |
| A typed `reopenOn` field (the 2026-10-10 candidate 2) | Ten bare-opener rows, the condition reads pass ten, and no fired trigger was left. Evidence: §3. | Every planning entry. | Such rows pass ten, or a pass leaves a named fired trigger. |
| A research worker | Every input is a record on this machine or a receipt this pass filed. | Each pass. | A finding needs a host page or a run this pass cannot read. |
| A reader run | Profile unchanged; `plan start` reported none due (seven unscored). | Every planning entry. | A changed profile with three unscored releases, or the operator's word. |
| Timeout listing or larger limits (ER5-001) | 55.1% and 10.7% this pass; the receipts expose duration. | Every entropy pass. | An observed deadline loss or two successive episodes of one kind above 80%. |
| Broad harness profile requalification | No observed mismatch on 2.1.304. Evidence: §3. | Next entropy pass. | An observed capability or role-text mismatch, a changed integration contract or operator direction. |

### 5.4 Corrections this pass records

- **The 2026-10-19 standard pass's validation line** said the operator-word
  advisories were historical and none was in that pass's files. The second
  clause stands; the first was wrong: at that pass's own commit
  (`899eeec1`) the check reported 24 current advisories, and the records
  behind them had been committed before the pass closed (REFUTATION-008's
  ancestry check). The historical document keeps its bytes; this pass is
  the correction, and WO-219 step 23 makes the next such line readable from
  the summary count.
- **The 2026-10-10 pass's gate-time NoOp** named a reversal clause (gates
  above a quarter of phase time) without saying which gate; §3 measures the
  clause for WO-218 and §5.3 restates it with the complete runs named.

## 6. WO-218's close and its rows

WO-218 closed on 2026-10-20 as v0.87.0, a minor: 39 of its 45 rows
settled, each naming a paired control VER-002 replayed, and 6 declined
with their harm, evidence and reversal condition; integration took in
nothing; its final review repaired eleven findings inside the Boy Scout
bound and ran the complete review fresh at the repaired identity. The
fork's three requests of 2026-10-19 are among the settled rows: a declared
target release titled by its display name, the starter's core-named tag
kept out of an instance's local baseline, and a judge-only base checkout
at close. WO-218 leaves the sequence. Its close boarded five rows, all
untriaged at entry; each is decided here.

### 6.1 D056: the shape of a batch order (FUP-e700292da312f361)

VER-001 recorded that two of receipt 049's known issues had occurred:
criterion 2's (a settled row's named case passing at the base, three of
them) and criterion 5's (the objective promising a pending-count fall for
rows that were allocated at activation, so already outside the pending
count: 158 before and 158 after). It asked this pass to decide whether a
batch order's settled rows must record their named case run with the fix
reverted, and to amend or annotate the objective's count sentence.

Both are decided for the three remaining batches, WO-217, WO-219 and
WO-220, whose objective and criterion 2 were the same sentences as
WO-218's:

- **Criterion 2 names the control.** A settled row's evidence names the
  fixture file, the case and the control that shows the case failing with
  only that row's fix reverted and passing with it, recorded in
  `docs/evidence/WO-NNN/repair-controls.json` in the shape WO-218's repair
  filed (per control: the rows, the suite and command, the reversion by
  path, both arms' exit codes and the verdict); a row the source already
  meets names the command run at the base and its output; a case that
  also passes at the base, or with the fix reverted, settles nothing. The
  README step writes the control record as rows are settled. The reason is
  WO-218's own record: the sentence "a case that fails without the fix"
  cost one failed verification, a repair of 91 controls and a second
  verification, about three and a half of the order's 9.7 phase hours
  (verification 50 minutes, repair 159), and the control is what the
  second verifier replayed to pass it. Writing it into
  the criterion lets the executor file it the first time and the verifier
  replay it rather than discover its absence. Rejected: leaving the
  sentence and relying on the known-issue carry-in that each batch already
  held (axis: verification judges a criterion as written, product 07's
  2026-10-13 screen, and the carry-in did not stop WO-218's first
  verification from failing); requiring the control only when a case is
  new (axis: the three cases that passed at the base were existing cases
  the executor cited as covering a fix, which is the case the control
  exists to catch).
- **The objective says what the count does.** The listed rows were
  allocated when the order was filed and the register counts an allocated
  row as closed, so the pending count does not fall by them; the README
  records the count before and after and claims no fall. This is a
  correction of a false promise, not a change of scope.

A standing screen for later passes is written into product 07 beside the
2026-10-19 one (§7): a criterion that settles a boarded row by "a case
that fails without the fix" names the control and its record. The row is
settled on these amendments, with the reopening condition that another
batch's objective promises a count fall for allocated rows or a settled
row's named case passes at the base in a later batch's verification.

### 6.2 The four boarded repairs (D059, D062, D063, D064)

| Row | Source | Content | Disposition |
| --- | --- | --- | --- |
| FUP-27e0c0fff9cedb75 | D059 (VER-002 F1), corrected by D064 | the historical-id dependency refusal moved from `parseDependencies` into `readDependencies`, so `parseHeader`, the index and the planning readers admit a hard or satisfied dependency on a declared historical id; main's test asserted the refusal through the index reader and the subject replaced the assertion | allocated to WO-219, step 18 |
| FUP-eacf4e6eb0b39fbe | D062 (FINAL-001 F13 to F15, F20) | the admitted publish helper's loaded modules (dist, node_modules) are not bound to main's committed bytes and the closure is judged against a movable ref; a same-tree draft retry after a failed title edit refuses as a moved head; a deletion failure under a declared root stops with a raw EPERM after deleting part of the output and the 16 MiB listing refusals name no role or rerun; a passing partial structural row revokes the Preflight handoff route | allocated to WO-219, step 19 |
| FUP-4018cf3118ea113e | D063 (FINAL-001 F16 to F19) | the already-current starter refresh tags the starter's tip rather than the refresh commit; a close whose attempts archive cannot be written records a readable history as unreadable, and a missing archive makes every retry refuse with a nested, doubling record; a declared-release registration refused at the base judgment prints the no-release line and records no publication target; `isStarterTag` spawns one `git cat-file` per tag | allocated to WO-219, step 20 |
| FUP-4fe22d2e0c8d843d | D064 (FINAL-001 F21, F22) | `--continue --stash-applied` completes with the work reverted or a collision unresolved and names no command; a `build: none` emit keeps generated-surface text in both floors and the drift message misleads | allocated to WO-219, step 21 |

WO-219 takes all four. Three of them (D059, D062's admission finding and
D064) land on surfaces WO-219 already names: `scripts/work-orders.mjs`,
`packages/skeleton/src/harness-host.ts` and the `worktree` and `harness`
suites of its Preflight. D063 and the target-publish and close findings of
D062 are WO-218's own subsystem, which closed with it and has no later
batch; the orders that next name `scripts/release.mjs` are WO-083 (the
run in the operator's fork, which exercises exactly these surfaces) and
WO-091, far down the queue, and none names `starter-refresh.mjs`. The
alternative weighed was a fifth batch for those two rows: it pays the
fixed cycle, which WO-218 measured at 9.7 phase hours, for two rows, and
it sits behind three batches in the serial queue while the fork's target
orders cross the release close and the starter at their next close
(F18 prints a misleading no-release line for a declared release; F17
loses the close's publication binding on a retry; F16 tags an operator
commit). WO-219 runs second. Its Design records the exception and its
axis, its Known issues the rule that a finding the base no longer
reproduces is declined with the output that shows it, and its Preflight
gains the suites the new steps name (`target-publish`,
`target-worktree`, `release`, `siblings-fixtures`, `release-preparation`,
`launchpad`, `worktree-integration`). The order grows from 44 rows and 21
steps to 50 rows and 27 steps (four rows and four steps from WO-218's
close, two rows and two steps from REVIEW-007, §5.1 and §5.2); the
decisions remain the authority on each rule, and each names its
reproduction under the bounded wrapper.

### 6.3 Placement

WO-217 is now first, WO-219 second and WO-220 third; each order's
placement line, dependency text and operator-review assumption 3 say so.
No typed edge changes: WO-217's and WO-219's references to WO-218 remain
reference-only and now read "closed".

## 7. Sequence, map, orders, write-backs and the register

WO-218 leaves the sequence; fourteen entries remain, serial: WO-217,
WO-219, WO-220, WO-080, WO-204, WO-192, WO-083, WO-207, WO-193, WO-183,
WO-088, WO-091, WO-096 and WO-014. The sequence's paragraphs now say that
WO-218 closed with the fork's blocker landed, that the three remaining
batches follow with WO-217 first, and that WO-219 carries WO-218's four
boarded rows and the two REVIEW-007 findings.

Orders amended, so this pass's receipt judges them:

- [WO-217](../work-orders/WO-217-boarded-follow-ups-the-gate.md):
  criterion 2 (the paired control and its record), the objective's count
  sentence, the README step, placement (position 1), the dependency text
  on WO-218 (closed) and operator-review assumption 3.
- [WO-219](../work-orders/WO-219-boarded-follow-ups-records-roles-and-the-harness.md):
  the same, plus four rows from WO-218's close as steps 18 to 21 and two
  REVIEW-007 rows as steps 22 and 23 (50 rows, 27 steps), the Cost line's
  surfaces and step count, the Preflight line, the Design (the fifth-batch
  alternative), Known issues (the exception; the two REVIEW-007 rows),
  provenance and placement (position 2).
- [WO-220](../work-orders/WO-220-boarded-follow-ups-the-resident-and-the-vertical.md):
  criterion 2, the objective, the README step, placement (position 3) and
  assumption 3.

Write-backs: product 07 §Operator-opened planning pass (the Consumptions
sentence; the control screen beside the 2026-10-19 one);
`docs/instance/entropy-reducer/README.md` §What the reviewer may run (the
interim channel, in one sentence); the map (the recommendation paragraph,
the candidates section dated 2026-10-20, the REVIEW-007 disposition table
and the four catalog rows); the ledger's registration heading; the
roadmap's release table (v0.87.0). `npm run publication:check` passes with both edition locks current after the
software-engineer edition's lock was refreshed to product 07's new bytes;
`node scripts/docs-check.mjs` passes with 15 product documents and 0
failures, and the operator-word advisories stay at 28 current, so this
pass's documents add none of the rows §5.2 describes.

**The register.** The entry register held 163 pending rows (1 open, 5
untriaged, 157 deferred) of 1,214, at revision `b0a0522b…`. The first sync
minted the two accepted findings (FUP-568da2f2b62ee478 for ER7-001,
FUP-46deeb2483a9c28d for ER7-002) and `npm run meta` the five candidates of
the map's 2026-10-20 section, 1,221 rows in all; one batch of 17
dispositions then applied from the ignored control lane
(`docs/control/local/apply-entropy-2026-10-20.json`, revision
`d58583cc…` to `513e292a…`): 1 settled (WO-218 D056, into the three
batches' criterion 2 and objective), 6 allocated to WO-219 (D059, D062,
D063, D064, ER7-001, ER7-002), 9 deferred with the conditions of §3 and
§5.3 (the fired evidence clause, WO-216's claim at close three, the
harness re-probe, the Sustain row by its occurred second clause, and the
five candidates) and the cold-start row kept open as the operator's
reserved pass. The register holds 1,221 rows with 163 pending (1 open, 162
deferred, 0 untriaged), 274 allocated and 641 settled. `followups
--touching WO-218` listed exactly the five boarding rows at entry, and
each is disposed above; no other pending row names the retired order.

## 8. Goal alignment and cost

The mission contribution is the delivery lane: WO-080, WO-204, WO-192 and
WO-083, with the fork's target orders running now against the surfaces
WO-218 just fixed. This pass files no order. It makes the three remaining
batches pass their first verification on the criterion WO-218 failed,
closes a channel in the review machinery before more episodes run, and
clears the five rows WO-218's close left. NoOp at entry would have left
those rows untriaged, the same criterion 2 in three queued orders, two
fired conditions unread and the review channel unrecorded. Consume before
produce ruled out paying twice for an undisposed review; the two episodes
cost 1,515 s and USD 7.2075 (REVIEW-005's pair 9.32, REVIEW-006's 5.03),
with the same two-finding yield as the two passes before.

Traps named before the material choices, and what was done about each:
shifting the burden (a gate-time order from WO-218's 39.3% would have
moved the cost onto the lane the operator closed on 2026-10-17; the
measurement is recorded and attributed instead); success to the successful
(WO-219 takes six rows because it runs second and owns the machinery,
weighed against a fifth batch and a split, each with its reopening
condition); rule beating (the quarter-of-phase clause was read whole, not
narrowed to the document gate it was written about); Naive
Interventionism (no new gate, agent or ritual: one criterion rewritten in
three orders, six steps added to one, one screen sentence); policy
resistance (the control is what the second verifier replayed, written
where the executor reads it first); seeking the wrong goal (the
operator-word advisory is fixed at its noise, not escalated to the refusal
D015 rejected); commons and escalation (three workers of twenty; the guard
costs one command and one digest per dispatch); drift (the criterion is
tightened and the screen names its case). The outcome matched the plan:
three workers, no new order, no activation.

## 9. Document ceilings

Every product document's ceiling is set in `docs/control/doc-ceilings.json`
to its non-exempt bytes measured by `node scripts/docs-check.mjs` after
this pass's write-backs, plus one tenth, with this section as the decision:

| Document | Measured | Ceiling |
| --- | --- | --- |
| 00-vision.md | 28,275 | 31,103 |
| 01-principles.md | 9,462 | 10,409 |
| 02-domain-model.md | 149,912 | 164,904 |
| 03-architecture.md | 184,022 | 202,425 |
| 04-interfaces.md | 60,705 | 66,776 |
| 05-pattern-library.md | 135,946 | 149,541 |
| 06-roadmap.md (non-exempt) | 41,953 | 46,149 |
| 07-execution-guide.md | 232,739 | 256,013 |
| 08-publication-compiler.md | 24,867 | 27,354 |
| 09-audit-resilience-privacy.md | 52,735 | 58,009 |
| 10-ir-compatibility.md | 25,787 | 28,366 |
| 11-proteino.md | 2,058 | 2,264 |
| 11-protino.md | 30,626 | 33,689 |
| 12-workstream-application.md | 23,572 | 25,930 |
| 13-uifa-roles.md | 27,015 | 29,717 |

Two ceilings move: product 04's, whose measured bytes grew after the
2026-10-17 pass set it, and product 07's, which this pass's two sentences
and the 2026-10-19 passes' paragraphs grew; the other thirteen are reset to
the same figures.

No order carries a byte bound.

## 10. Validation and independent judgment

«fill-validation»
