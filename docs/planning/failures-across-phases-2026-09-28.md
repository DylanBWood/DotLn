# Planning pass, 2026-09-28: the failures no instrument counted

Document-only planning pass on branch `planning/2026-09-28-standard-pass`
from clean `main` at `5f3849ec` (WO-162 merged and published as v0.52.10).
Between work orders; the projection lists WO-162, WO-163, WO-164, WO-168,
WO-169, WO-170 and WO-171 closed since the previous pass. Every claim
below names its source; a value nobody observed is written as unknown.
The pass is dated by the repository's UTC convention: it was dispatched
at 03:38Z on 2026-09-28.

## 1. What was asked, and the subject

The operator's dispatch was the bare prefix, a standard pass. Nine
minutes in, while the pass was reading the follow-up register, the
operator directed it (captured in ignored intake,
`docs/intake/notes/2026-09-28-standard-pass-planning.md`): about a
hundred failures have occurred across the phases, planning among them
for not noticing; they are to be addressed; they should all have been
documented. A third message asked whether the pass had gone through all
the older queued orders, whose text may be out of date. Later messages
corrected the pass (below) and set its refutation: GPT-6 Astra at `max`
with no time limit, in a `planning: refute` dispatch the operator opens
(§17).

**The planner's own failure, recorded as one.** What was misread: the
pass opened on the register and the sequence, listed the control events
of the seven closed orders, saw a repair in six of them and treated that
as background. What was meant: a pass reads what failed before it reads
what is queued. What changed: the failures became the subject, this
document counts them, §8 names why no pass was shown them, and §10
files the orders and the rules that answer them.

**A second failure, the trap the pass exists to count.** Later the
operator corrected the pass twice. The planner had reported the
operator's own switch of model back to the operator as news. And the
planner's instructions to the drafting agents said a live feedback
episode needs the operator's authorization, with a fallback that sent
each one back to the operator to run or waive: shifting the burden to
the intervenor. No rule required it. Product 07 says only that an order
names the episode in its Cost line, and the skeleton README runs it with
two commands. The requirement had grown from orders' own assumptions
("activating this order authorizes one live episode", WO-152, WO-154).
It had already cost fixes: WO-099 D027, WO-152 D009 and WO-157 D024
deferred real defects to avoid a second paid episode, and WO-070 and
WO-099 stopped to ask. The operator's direction, paraphrased: a live
feedback episode runs on Codex `gpt-6-sol` at `xhigh` or Claude Code
`claude-opus-5-5` at `xhigh`; on either it needs no authorization and
its cost is accepted. What changed: rule 6 of §10.1, every order this
pass amends, the sequence file's entry note, and WO-172's write-back
into product 07. The record the operator asked about: 92 live feedback
verifications in 56 orders, every one of their 368 verdicts a pass,
GPT-6 Astra in 69 of them; no budget problem on those runs is recorded.

The category, as this pass reads it: a failure is something a phase
recorded as having gone wrong. Inside it: a verification or final review
whose verdict is fail, and the repair it caused; a correction a role
recorded about its own work; a planning judgment that held, an order
amended during execution, a criterion waived. Outside it: a register row
that names a defect nobody has met, and a finding a report lists as
non-blocking (366 of those sit in the failed reports alone and were not
classified). If the operator meant another set, §2's table says what
was counted so the difference can be named.

Subject: the control logs, the 96 reports they record as failed, the 928
structured decisions, the planning control log and the 38 refutation
receipts, all at `5f3849ec`; the register at revision `b1bac9d0…` with
699 entries and 156 pending; the sequence as left by receipt 032.

## 2. The record

| What the record holds | Count | Source |
| --- | --- | --- |
| Orders with control events, all closed | 117 | `docs/control/resume.jsonl` (22 orders), `docs/control/orders/` (95) |
| Verifications completed | 214 | `VerificationCompleted` |
| Verifications failed | 86 | verdict `fail` |
| Final reviews completed | 128 | `FinalReviewCompleted` |
| Final reviews failed | 10 | verdict `fail` |
| **Failed judgments** | **96** | each has its report; none is missing |
| Repairs requested and completed | 99 | 89 answer a verification, 10 a final review |
| Orders whose first verification failed | 54 of 117 | |
| Orders that needed at least one repair | 57 | 37 one, 9 two, 5 three, 3 four, 2 five, 1 seven |
| Judgments that followed a failed one and failed again | 32 of 96 | the next judgment passed 64 times |
| Corrections recorded in decisions | 56 | a `misread`, `meant` and `changed` triple |
| Planning receipts that held | 14 of 38 | 27 holds; none since 2026-09-16 |
| Holds the operator overrode | 3 | `PlanHoldOverridden` |
| Orders amended during execution | 16 | 25 `PlanExecutionAmended`, 1 withdrawn |
| Criteria waived | 1 | WO-163 criterion 4 |
| Orders withdrawn, records corrected, overrides recorded as events | 0 | |

Three orders record one repair more than they have failed judgments
(WO-006, WO-039, WO-126). The operator's figure of about a hundred is
the 96 failed judgments or the 99 repairs.

The rate is not flat. An order is placed by the day it was made ready;
the 22 orders of the older log carry no times and are counted with the
first period.

| Made ready | Orders | First verification failed | Judgments | Failed |
| --- | --- | --- | --- | --- |
| to 2026-09-06 | 30 | 5 (17%) | 66 | 6 (9%) |
| 2026-09-07 to 09-14 | 15 | 10 (67%) | 57 | 26 (46%) |
| 2026-09-15 to 09-21 | 43 | 16 (37%) | 121 | 31 (26%) |
| 2026-09-22 to 09-28 | 29 | 23 (79%) | 98 | 33 (34%) |

Since the previous pass (receipt 032, 2026-09-27T02:16Z): seven orders
closed, seven judgments failed, seven repairs, five corrections. Six of
the seven orders failed their first verification.

The [inventory](failure-inventory-2026-09-28.md) lists every failed
judgment with the findings that failed it, and every correction.

## 3. What the failures cost

Times are event-to-event wall-clock from a request to its completion, so
a wait inside an attempt is counted; 491 of the 559 recorded attempts
carry both times.

| Phase attempts | Attempts timed | Hours | Share | Median |
| --- | --- | --- | --- | --- |
| Implementation | 99 | 221.2 | 49.6% | 64 min |
| Verification, passed | 110 | 32.2 | 7.2% | 16 min |
| Verification, failed | 80 | 43.7 | 9.8% | 19 min |
| Repair | 92 | 103.5 | 23.2% | 30 min |
| Final review, passed | 100 | 41.5 | 9.3% | 24 min |
| Final review, failed | 10 | 3.6 | 0.8% | 25 min |
| All | 491 | 445.6 | | |

Failed judgments and their repairs are 150.8 of 445.6 hours, 33.8%. One
repair of 37.3 hours (WO-157) includes a wait; with every attempt capped
at six hours the share is 114.3 of 363.3 hours, 31.5%, and for attempts
begun on or after 2026-09-22 it is 33.1 of 87.7 hours, 37.7%. A failed
judgment costs, at the median, 19 minutes of judging and 30 of repair
before the judgment that replaces it.

Gate time multiplies with it. The rolling index of the last 256 gate
rows in the main checkout holds between 2 and 9 product gate runs for
each of the last ten orders, 16 to 75 minutes an order, where the
2026-09-15 stand-down designed one; the plain product gate runs 314 to
322 s and the review selection 612 to 645 s, the skeleton suite alone
310 to 315 s of it.

Tokens by phase are unknown: the usage records carry a role, and repair
and implementation share one.

## 4. What failed

Eight read-only surveys read the 96 failed reports whole and classified
each finding that caused the fail verdict: 184 findings, a median of one
a report and at most eight; 52 reports rest on one finding. The classes
are defined in the inventory.

| Class | Findings | | Origin | Findings |
| --- | --- | --- | --- | --- |
| A guard admits or refuses wrongly | 48 (26%) | | Implementation | 127 (69%) |
| Wrong for a case ordinary use has not reached | 25 (14%) | | A repair | 28 (15%) |
| A required gate or check is red | 23 (13%) | | Planning, the order text | 16 (9%) |
| Wrong on the ordinary path | 20 (11%) | | The harness or host | 6 (3%) |
| A record claims what it cannot support | 12 (7%) | | Integration with `main` | 4 (2%) |
| A deliverable is missing or partial | 12 (7%) | | The judge itself | 2 (1%) |
| The order could not be met as written | 9 (5%) | | Unknown | 1 (1%) |
| A document write-back is missing or wrong | 9 (5%) | | | |
| Outside the order's scope or authority | 7 (4%) | | | |
| Integration or release mechanics | 6 (3%) | | | |
| A test passes without proving its claim | 5 (3%) | | | |
| The tooling failed, not the change | 5 (3%) | | | |
| A stated bound was missed | 3 (2%) | | | |

| How the judge found it | Findings | | Was it reached in ordinary use | Findings |
| --- | --- | --- | --- | --- |
| A case the judge constructed | 86 (47%) | | Yes | 112 (61%) |
| Running a gate | 34 (18%) | | No | 69 (38%) |
| The criterion's own check | 29 (16%) | | Unknown | 3 (2%) |
| Auditing a record | 19 (10%) | | | |
| Reading | 14 (8%) | | | |
| Integrating `main` | 2 (1%) | | | |

149 findings were new, 23 were introduced by the repair before them and
12 persisted from an earlier report. The classification is the surveys'
reading of the reports, checked by the planner against the reports it
read itself; where a survey inferred an origin it says so in the
inventory's notes.

## 5. Six causes

A report belongs to a group when every finding that failed it does, so
the groups understate: 45 reports hold at least one finding an existing
check would have shown, and 24 hold nothing else. Hours are judging plus
repair, each attempt capped at six.

| Cause | Reports | Hours | Since 09-22 |
| --- | --- | --- | --- |
| A. An existing check would have shown every failing finding before handoff | 24 | 21.6 | 9 |
| B. The executor had recorded the gap and handed off | 13 | 9.8 | 9 |
| A or B | 27 | 25.2 | 12 of 33 |
| C. Every failing finding came from the repair before it | 16 | 15.2 | 4 |
| D. Every failing finding needs a case ordinary use has not reached | 23 | 24.7 | 7 |
| E. Every failing finding lies outside the change | 6 | 10.1 | 2 |
| F. Every failing finding comes from the order's text | 6 | 4.8 | 2 |
| In none of these wholly | 35 | | |

**A. The check existed and was not run.** 58 of the 184 findings: the
executor re-reading the order's criterion list would have shown 17,
running the criterion's own command 12, `npm run test:docs` 10,
`npm test` 6, the review selection 6, the publication or release
surface check 5, and two others. Seven of the ten failed final reviews
hold a red gate, four of them a machinery suite no earlier gate had
selected (WO-133, WO-139, WO-100, WO-164). The unit that requires every
required check to pass before completion is equipped as role text; the
completion command does not read a gate row for the executor, and its
one advisory about the document gate prints "missing" whenever a report
was written after the gate ran (WO-171, 44 s after a passing gate;
WO-164, 37 s).

**B. The gap was known.** In 13 reports the executor's own decisions
record the unmet criterion or the red gate before the handoff (WO-090,
WO-152, WO-149, WO-138, WO-156, WO-111 VER-002, WO-153, WO-164, WO-168,
WO-163, WO-162, WO-115 VER-002, WO-121). The lifecycle gives an executor
no other route: it cannot waive, it may not amend without the operator,
and it was corrected for stopping the operator to ask (WO-162 D013). So
the gap travels to a verifier that fails it, and the operator decides
one cycle later: a waiver (WO-163), an amendment (WO-162), an accepted
deviation (WO-111), a scope expansion (WO-153, WO-156). `waive` is
legal from the moment verification is dispatched; nothing tells the
operator or the verifier that there is something to waive.

**C. The repair introduced the next failure.** 16 reports, and a third
of all failed judgments are followed by another. The surveys name the
mechanism in the reports' own words: a repair closes the shapes the
report quoted, and its regression covers those shapes (WO-142 D016 says
so of its own repair); three verifiers record that the repair followed
their direction and that the direction was incomplete (WO-126 VER-003,
VER-005, VER-006).

**D and the guards.** 48 findings are guards, 32 reports hold at least
one, and 15 hold nothing else (50.9 hours across the 32). Five orders
account for 16 failed judgments by repairing one guard a shape at a
time: WO-126's command classifier (criterion 8 unmet six times), WO-132's
redirect adapter (three spellings), WO-125's effort and write guards
(three reports), WO-039's reservation race (two) and WO-142's live-gate
list (two). Each ran
until someone stated a rule for input the guard cannot read: WO-126's
"whole-line floor", WO-132's fail-closed operand rule. 2026-09-15's
stand-down said the same of machinery verified by machinery; the orders
filed since kept adding guards (WO-142, WO-144, WO-158, WO-168), and
each paid one to three failed judgments.

**E. Outside the change.** Six reports failed an order for a gate case
it did not touch or a sibling's merge: the resident's lock matrix
cancelled at its 240 s deadline (four records: WO-114 VER-001, WO-159
D020, WO-115 FINAL-001, WO-168 D013), a fixture tied to moving `main`
(WO-115 VER-001 and VER-002), a release fixture racing Git maintenance
(WO-121), a sibling's publication failed as a defect (WO-045, which its
own final review calls a misclassification).

**F. The order's text.** 16 findings in ten reports, and seven of the
56 corrections: two criteria that cannot both hold (WO-162: byte-identical
fixtures and a compiler release), a criterion no command can show
(WO-163: a generated mark in the diff statistics), a bound that needs
work the non-goals exclude (WO-156), a requirement no repair can meet
(WO-090: a lower total for sections no role loaded), a baseline the
pass recorded and did not check (WO-159 D013), a universal the fixtures
contradict.

**Scope added during execution.** Fourteen failed reports sit wholly or
partly in scope the operator added after activation while the order's
filed criteria held (WO-006 both, WO-007, WO-019, WO-043 VER-002,
WO-044 VER-001 and VER-003, WO-054 VER-001, WO-125 VER-002 and VER-003,
WO-130 VER-002 and VER-003, WO-131, WO-132 VER-002), by the surveys'
notes. An expansion has no criterion a refuter judged and often no
fixture; the count is recorded here.

## 6. Who judged

The executor and the first verifier are read from the completions'
attestations. Twenty-two orders of the older log carry none.

| Executor's harness, judge's harness | Orders | First verification failed |
| --- | --- | --- |
| Codex executes, Claude Code judges | 78 | 28 (36%) |
| Claude Code executes, Codex judges | 24 | 20 (83%) |
| Same harness | 4 | 2 |
| Unrecorded | 11 | 4 |

| Verifier | Verifications | Failed | Findings by a constructed case |
| --- | --- | --- | --- |
| Claude Opus 5 | 101 | 32 (32%) | 35% of 54 |
| Codex, GPT-6 Astra | 30 | 16 (53%) | 65% of 37 |
| Codex, GPT-6 Sol | 24 | 10 (42%) | 67% of 18 |
| Claude Opus 5.5 | 22 | 10 (45%) | 32% of 22 |
| Codex, GPT-5.6 Sol | 11 | 6 (55%) | 50% of 16 |
| Claude Fable 5.1 | 10 | 7 (70%) | 67% of 21 |
| Unrecorded | 16 | 5 (31%) | 13% of 16 |

What the record shows: the pairing changed on 2026-09-22 (WO-100 D007)
and the first-verification failure rate rose from 37% to 79% in the
same week. What it does not show is the cause. Three readings fit, and
the record cannot separate them: the newer judges construct more cases;
the newer executors hand off more defects; the last week's orders were
machinery with guards, which fail more whoever judges. The surveys add
one mechanism that is recorded: Codex fires no project hook, so an
order executed under Codex meets the installed hooks for the first time
in the judge's session (WO-039, WO-126, WO-142, WO-144). No order is
filed on this table. It is here because the choice of judge is the
operator's and has a measured price.

## 7. The roles' own failures

**Corrections.** The 56 structured corrections, by the planner's
reading of each:

| What failed | Count | Examples |
| --- | --- | --- |
| A claim beyond the evidence | 15 | a completion recorded before its result was read (WO-130 D003); a gate reported as covering a check it never runs (WO-148 D019); a section cited that does not exist (WO-100 D019) |
| An operator direction widened, narrowed or misattributed | 7 | WO-049 D002, D005, D006; WO-129 D002; WO-054 D007 |
| A design error met and corrected in the work | 7 | WO-099 D015; WO-133 D004 |
| The order's own text was wrong | 7 | WO-133 D002; WO-148 D003; WO-159 D004, D013, D014; WO-158 D017; WO-128 D010 |
| A lifecycle or record procedure performed wrongly | 6 | WO-130 D010; WO-162 D016 |
| Stopped, paused or asked what the record settled | 5 | WO-126 D019; WO-131 D016; WO-111 D016; WO-162 D013; WO-163 D021 |
| Cost that bought no evidence | 5 | WO-126 D014; WO-163 D019 |
| The order misread | 2 | WO-099 D010; WO-148 D011 |
| The contract weakened to obtain a pass | 2 | WO-111 D019, D020 |

Twenty-four were recorded during a repair, nineteen during
implementation, five during verification, three at final review, one
in planning and four name no phase; 34 name the operator in their
dispatch. Two recur after a rule was written against them: a
conversation-only question paused the work on 2026-09-10 and again on
2026-09-14, and a role put a settled matter back to the operator three
times in one order (WO-163). Four corrections of a claim beyond the
evidence are dated in the week before the rule that evidence precedes a
claim entered the instruction floor (2026-09-16, `1e16cb90`), and
eleven in the twelve days since. A rule in prose stopped neither.

**Two of the 56 name a follow-up.** The register admits a decision by
its `followup` field, so 54 corrections never reached a planning pass.

**The judges.** 38 of the 96 failed reports record an error of the
judge's own or of the judge before it. The recurring ones: a gate run
again at a code identity that already held a passing row (344 s in
WO-054, 312.54 s in WO-166, two full gates in WO-131, and one run the
operator stopped, WO-163 D019); the judge's own dispatch staling the
generated index so its first gate was red (WO-039, WO-041, WO-132); a
write into the tree the judge was judging (WO-125, WO-126, WO-099,
WO-142); a verdict or a route the record later corrected (WO-114 D009,
WO-111 D016, WO-045).

## 8. Why no phase noticed

| What a pass or the operator reads | What it says about a failed judgment |
| --- | --- |
| `resume status` | each order's latest verification and latest verdict; "Process health: no observed budget breach; 0 reopen candidates" |
| The generated index | every closed order "final-reviewed" |
| The planning cost table | 46 rows, none with metrics; five trap series, none of which counts a judgment |
| The meter's per-order snapshot | `attempts`, a total; no verdict |
| `plan start` | the first page of the register |
| The follow-up register | a decision only when it names a follow-up |
| The pull-request body | the meter's row |

The events were there the whole time: `completedPhaseAttempts` already
pairs every attempt, failed ones included. The status projection takes
the latest one and the meter counts them without asking how they ended.
The trap named "drift to low performance" watches cold-start bytes,
subject length and gate steps. Planning's procedure names the status,
the sequence and the register, and this pass followed it into the same
blind spot as the passes before it.

Earlier passes did count rework when the operator pointed at it: the
2026-09-09 pass measured WO-042's 16 hours, and the 2026-09-15
stand-down counted 27 verification reports on eight machinery orders.
Neither left a counter behind.

## 9. What is not recorded at all

| Lane | What exists | Gap |
| --- | --- | --- |
| Release close | logs and notes under the ignored local lane for eleven of the 117 orders, under no common name; no event | a failed close leaves no public record and no count |
| Gate failures | 32 failed rows among the last 256 in the main checkout's index; older rows archived by tree hash | local only; 234 of 257 output references did not resolve on 2026-09-27 |
| Guard refusals, operator corrections counted from journals | six per-order snapshots hold them | the journals of every order closed before WO-170 are gone |
| Attempts that produced no report | the surveys met three (WO-039, WO-126 VER-004 twice) | a judge session that opens an allocation and writes nothing is invisible |
| Operator overrides | six decisions name one; no `OperatorOverrideRecorded` event exists | whether none happened since WO-158 or none was recorded is unknown |

WO-172 counts the first two where the local lane exists; the rest are
map candidates (§13).

## 10. Routes

### 10.1 Planning rules, in force from this pass

Each answers a cause §5 measured, rule 6 as the operator corrected it.
They are written here, and rules 1 and 6 on the sequence file's entry
note, until the execution guide has room; WO-172 writes them into product
07 after the fold.

1. **A pass reads what failed first.** Before the register: the failed
   judgments, repairs and corrections since the previous pass, each
   failed report read and its cause given a route in the pass's
   document.
2. **A criterion declares its set.** It names what it covers and what
   happens to everything else, and never claims a universal the fixtures
   cannot enumerate. An order that adds or changes a guard states what
   the guard does with input it cannot read.
3. **Criteria are checked against each other and against the
   non-goals.** A bound that depends on excluded work states what holds
   if the bound is not reached.
4. **A fact in an order carries its commit, and is re-observed before
   the order moves to the head.** A count, a size or a line range is the
   executor's to re-measure at its base when it moves over time.
5. **An order names the gates in its final criterion, the registered
   sources it expects to edit and what they owe**: a deterministic
   re-mint, a carry, or a live feedback episode the executor runs.
6. **A step the executor can perform is the executor's** (operator
   direction, 2026-09-28). A live feedback episode runs in the executor's
   session on Codex `gpt-6-sol` at `xhigh` or Claude Code
   `claude-opus-5-5` at `xhigh`, with no operator authorization and its
   cost accepted; a read-only smoke and a measurement of the executor's
   own launch are the executor's too. Only a step the order's objective
   gives the operator, a session the operator witnesses or a run in the
   operator's own fork, is the operator's, and it has a stated fallback
   for the case that it has not happened by handoff.

### 10.2 New orders

| Order | What it lands | Class | Re-mint |
| --- | --- | --- | --- |
| [WO-172](../work-orders/WO-172-failures-reach-planning.md) Failures reach planning | `plan failures` over the public record; the counts in `plan start`, with the orders closed since the last Entropy Reducer review; failed judgments, repairs and recorded corrections per order in the meter and one line of process health; the direction count judged against a hand classification; the decision dispatch fields that hold the operator's words paraphrased | patch | none |
| [WO-173](../work-orders/WO-173-handoff-states-what-it-knows.md) A handoff states what it knows | a criterion ledger at the two executor completions; a criterion recorded met needs its gate's passing row, the document gate run inline; a criterion recorded unmet shown in the status and the next briefing with the waiver route; `npm test` not run again at a code identity that passed; three briefing sentences; eight subtests for the lock matrix; the register advisory's rule | patch | deterministic (the role text) |

WO-173 answers causes A and B, the repeated gates of §7, the lock
matrix of cause E and, by its briefing sentences, causes C and the
guards. WO-172 answers §8. Neither adds a refusal to a handoff: a
criterion recorded unmet always records.

### 10.3 Orders re-observed and amended

Rule 4 applied to the queue. The planner re-observed and amended the six
queued orders of the first four slots and WO-087 itself; §10.4 reports
the rest.

| Order | What had gone stale or was unbounded | Amendment |
| --- | --- | --- |
| WO-060 SourceBundle contract | a screen that "keeps secrets out", a universal; no gate but `npm test`; the export, the registry and the compiler release it cannot avoid were unnamed; a ledger duty; write-backs unbounded against 507 bytes of headroom in product 10 | the screen refuses a declared set and states its limit; re-mints, carry and console re-pin named; both gates; bounded write-backs |
| WO-116 Audit projection served | a fixture to prove that no projection holds bytes "the privacy rules exclude", where product 09 defers those rules; the terminal command the contract must name does not exist | the terminal command is a deliverable; the served bytes equal the terminal's; no redaction claimed |
| WO-167 The execution guide folded | "all 32" dated paragraphs: the guide holds 33; 9 bytes of headroom | the executor counts at its base by a stated rule; the fold moves to the head |
| WO-086 Generated release history | 545 lines and 63,183 exempt bytes, now 910 and 68,433; a receipt file named for a date range that has passed; plain `npm test` for an order that edits three scripts the review selection judges | figures carry both commits; the file name holds no range; the review gate |
| WO-087 Candidates leave the roadmap | a range named by line numbers that moved from 799–1662 to 931–1794 | the range is named by its headings |
| WO-065 Pull-request state observation | a cited helper WO-163 moved; a resident cadence promised that WO-068 closed without; a comment "containing a secret-shaped token" refused, against a screen that declares its set and refuses every link off an allowlist the order never named; no log named for the event; an operator-only smoke with no fallback | the observer sits beside the target-publish host and appends to its `publication/` log; one comment is refused, not the observation; the forge host is the allowlist; the smoke has the rule-6 fallback; both gates |
| WO-117 Console live host | status refresh, `commands` and `invoke` already shipped; an equip preview and build authoring with no terminal command; "the same events as the terminal" against product 04's two console receipts; a register row allocated to it and absent from its text; no fallback for the witnessed session | the order adds the combined mode; the preview leaves; parity is judged as product 04 defines it; the allocated hardening becomes criterion 3, with its four re-mints named; the rule-6 fallback; both gates |

### 10.4 The rest of the queue

Five read-only surveys re-observed the 45 open orders outside §10.3
against `main` at `5f3849ec`. They found 109 of 899 citations unresolved
or moved; a final criterion naming plain `npm test` or no gate in every
order, `npm run test:docs` in none; 44 legacy Cost lines and 41 ledger
duties; a changed observed gap in 37; and 173 flagged criterion phrases
(64 conflicts, 43 claims no command shows, 34 universals, 22 operator or
live steps without a fallback, 10 moving numbers). Five drafting agents
then drafted each order from its survey. The planner checked every draft
for form, dependency edges and steps routed to the operator, read in full
or in their changed sections WO-057, WO-058, WO-059, WO-062, WO-066,
WO-075, WO-080, WO-096, WO-097, WO-098, WO-112, WO-118 and WO-123, and
applied the operator's live-episode direction to every draft itself: the
agents' edits under it were refused by their host's permission checker,
since the direction reached them only as a relayed message. The other
facts rest on the surveys' and the change records' cited evidence, which
the refutation judges. 37 drafts are installed.

Counted from the change records: 112 facts re-observed, 111 form
corrections (the legacy Cost line, the ledger duty, the field order), 88
conflicts settled, 79 declared sets, 58 gate corrections, 45 carry-ins
written in from the map and the register, 41 re-mints named, 40
citations, 37 placements, 34 dependency changes, 33 bounded write-backs
and 17 fallbacks. The 44 orders this pass amended grew from 263,681 to
561,148 bytes; the added text is what the rules require and the
carry-ins that had lived only in the map and the register.

Typed dependencies added, each on an order sequenced earlier: WO-167 for
the orders that write product 07 (WO-072, WO-073, WO-077, WO-078, WO-080,
WO-088, WO-113, WO-123); WO-123 for WO-072 (the path-identity guard);
WO-058 for WO-061; WO-074 for WO-076; WO-075 for WO-077 and WO-078;
WO-077 for WO-078; WO-078 for WO-083; WO-116 for WO-118; WO-063 for
WO-123. WO-075's edge to the closed WO-049 becomes reference-only.

Decisions the planner made instead of leaving them to the operator:

- WO-066 carries its four carry-ins; `repair.ts` admits a host-recorded
  review item; the loop sits beside the publication host.
- WO-097 and WO-098 extend `feedback-v1` compatibly past the ten-unit
  bound (re-cutting the family is declined); directed load is reported,
  not required to fall; the counts carry the direction.
- WO-096's denominator is the executor's count of the capture.
- WO-112 is a patch, as the evidence runs of WO-053, WO-056 and WO-111
  were; it and WO-118 reuse WO-064's scratch repository.
- WO-123 carries the path-identity guard (FUP-8369f2b4284e70a8).
- WO-075's smoke runs through the live-smoke path; it writes no notices
  file, since it copies only the project's own compiled output.
- The live smokes and install rows of WO-057, WO-062 and WO-065 are the
  executor's; WO-074 reaches the local-terms list through
  `DOTLN_LAUNCHPAD`.
- The corpus orders WO-102, WO-103, WO-105 and WO-107 are restated in the
  current form as patches outside the sequence; WO-105 drops the three
  families WO-045's decoder now refuses, and WO-107's gate no longer
  appends to its own input.
- WO-014 stays outside the sequence until a correction or decision
  records approval prompts interrupting an ordinary session; WO-088 stays
  second to last, and the pass that reaches it re-observes its gap and
  takes it out of the sequence if the gap is still absent.

Steps that stay the operator's, each with its fallback: a session the
operator witnesses (WO-112, WO-117, WO-118, WO-014 criteria 1 and 15),
the operator's own launchpad run (WO-083), remote grants and a
repository setting only the operator's account holds (WO-112, WO-118),
and a local-terms list absent from the machine (WO-074, WO-097, WO-098).

The six umbrellas (WO-033, WO-034, WO-035, WO-036, WO-037, WO-040) are
not edited: each says in its own text that it is superseded whole, and
the rules its children took from it by citation are now stated in the
children. One survey error was caught in review: `no-lint-type-disables-as-fixes`
is at version 1, not 2; no draft relied on it.

## 11. The sequence

Seven closed entries leave (WO-168, WO-169, WO-164, WO-171, WO-170,
WO-162, WO-163); two are filed; 41 remain.

| Slot | Entries | Why here |
| --- | --- | --- |
| head | WO-060; WO-167 | the first product entry, which opens gate G for WO-061, WO-062 and WO-065; the fold, because the guide has 9 bytes of headroom and three orders wait to write into it |
| second | WO-116; WO-173 | the third step of gate U, which WO-117 waits for; the handoff order, so that the orders after it hand off under it |
| third | WO-065; WO-172 | the first order gate G unblocks; the planning instrument |
| fourth | WO-117; WO-086 | the live console; the release history, whose guide sentence needs the fold |
| fifth (one entry) | WO-087 | after WO-086; not beside WO-066, which also edits product 06 |
| sixth (unchanged) | WO-066; WO-057 | |
| the serial run | WO-058 onward | unchanged |

Disjoint files inside each pair and no hard edge inside a pair. WO-173
and WO-172 depend on WO-167 by a typed edge, and WO-086 follows it by
placement. One order of each of the first two pairs re-mints, and WO-117
in the fourth, since the register row it now carries edits a common
evidence source.

This recuts four pairs. The operator's standing directions are the
authority, and each is paraphrased from its capture: a pair holds one
delivery order and one machinery or evidence order (2026-09-16); the
order of delivery is the best one, and the balance sought is half
product, half debt (2026-09-25). Of the sixteen orders closed since
2026-09-25, two were delivery orders (WO-070, WO-115) and fourteen were
machinery or documentation debt, and every entry the 2026-09-27 pass
left ahead of WO-060 was debt; receipts 031 and 032 both recorded that
no order ahead of WO-060 opens a critical-path gate. The
previous pass left the move to the operator because it read a three-day
budget as a three-day hold; the capture says the operator had the budget
to drain the queue, not that debt goes first. The move is the planner's
and the operator can reverse it at review.

## 12. The register: dispositions

The register held 156 pending rows at entry and 164 after the map's
eight candidates were synced. The pass read them whole and writes 33
dispositions in one batch, 32 of them on pending rows; each reason is in
the register.

| Row | What it asks | Now | Why |
| --- | --- | --- | --- |
| FUP-1d57cbcb226d8f8a | the lock matrix as one subtest (WO-159 D020) | allocated, WO-173 | its condition occurred: four records of the matrix cancelled at its 240 s deadline |
| FUP-6c401ec3e9e06edb | local lane retention | settled | the prune exists and its apply finishes; the listing of 2026-09-28 names what it keeps |
| FUP-0111 | planner startup context | open | the first page showed eight rows and the pass acted on them; it did not show the failures, which WO-172 adds |
| FUP-045a0a480f95bcc7 | the moved helper WO-062 and WO-065 cite | settled | both cite `scripts/lib/github-repository.mjs` |
| FUP-5e2f4ce16f9e8be1, FUP-8a4e201d861208ad, FUP-be1103fbfdd14653 | evidence retention and tracked evidence bytes | deferred | 28.7 MB in the week, 23.9 of it in four days; an order now adds 0.05 to 0.67 MB |
| FUP-667e12ad11c15caf | a mutation campaign on a current commit | declined | no queued order needs one and no gate runs it |
| FUP-71fc2efc208f597a | operator chat kept verbatim in decisions | allocated, WO-172 | a pattern search finds fifteen candidates |
| FUP-756224e6e2cbf35a | a waiver whose capture matches is not put back to the operator | allocated, WO-173 | its briefing sentences |
| FUP-e96e0676a5c34f98 | who confirms a waiver under Codex | deferred | one occurrence; the waiver stands on the operator's capture |
| FUP-80a2f11e1e0874d8 | the direction count counts what was directed | allocated, WO-172 | judged against a hand classification |
| FUP-9625ca888d7d08f5 | correcting a wrong execution amendment | deferred | one occurrence, recovered in its order |
| FUP-b8a329d9970b8206 | cold-gate structural cuts | deferred | the plain gate runs 314 to 322 s; the multiplier is the runs an order, which WO-173 reduces |
| FUP-beb13d8d099d2917 | receipts by identity | deferred | the receipts directory holds 17.4 MB in 77 files |
| FUP-dc6c139003bd4b89 | usage copies a snapshot names | deferred | four lanes wait and nothing is lost while they do |
| FUP-58a4c432faa720e6 | the export refuses the host scratchpad | declined | the pass exported to the printed session scratch |
| FUP-5a03cc13047c1dc4 | the register advisory's counts | allocated in part, WO-173; declined in part | 123 dispositions in seven reviews, 11 on generated projections; WO-173 rewords the rule |
| FUP-abfdb650f125a77f, FUP-ba35c0b5ae47cfb8 | the reviewer's phrase depends on the operator | allocated, WO-172 | sixteen orders closed since REVIEW-003; `plan start` prints the count |
| FUP-51bfd093f90f9e07 | per-role meter attribution | deferred | this pass relied on no per-role figure |
| FUP-b1163d128e371b7f | the selection omits untracked files | allocated, WO-173 | the completion reads the change with its untracked files |
| FUP-e55e258d37cb3f20 | naming and export rules in the feed's scripts | deferred | WO-172 and WO-173 do not open the four edges |
| FUP-8369f2b4284e70a8 | variant path spellings pass the source-change guards (WO-162 D004) | allocated, WO-123 | WO-123 is the first order that adds a production source-change caller; WO-072 takes WO-123 as a hard dependency |
| FUP-ecf9d3b703a0b7d9, FUP-5f33921210b0c441, FUP-b053a956adb84b6a, FUP-0fe667120ff19e79 | map candidates 1, 2, 3 and 6 of 2026-09-28 | deferred | as §13 and the map record |
| FUP-ee5190faadaeffa0 | map candidate 4, which judge | deferred | the cause is not established, so a change would be a guess |
| FUP-5c6f6df2298843b5, FUP-1acab8a941a8814e | map candidates 5 and 7 | declined | as §13 and the map record |
| FUP-5c87e6f142847def | map candidate 8, whether the live feedback audit earns its place | deferred | 92 live verifications, 368 verdicts, all pass |
| FUP-0023 | the documentation reset, WO-084 to WO-090 | allocated, WO-086 to WO-089 | its condition occurred: WO-079 closed and this pass rewrote WO-089 |

Rows read and left: the other 132 pending rows, whose reopening
conditions have not occurred. Four of them are rows the new orders'
files touch (FUP-fa028783f3f6b17f, FUP-4f8cd7989607ad3f,
FUP-51c310284c2fea17, FUP-e821aa2ced3aa111); a "deferred again" for
each would be the noise §13 measures, so none is written. Register row
FUP-4656197433cb8b3d, allocated to WO-117 by the previous pass and
absent from its text, is now its criterion 3.

## 13. Declined alternatives — the NoOp register of this pass

Each is a `NoOpIntent`: what happens if nothing changes, why the choice
wins, what reopens it.

- **File nothing; the inventory is the answer.** The next pass opens on
  the same instruments and the rate stays where it is: a third of the
  recorded phase time. Declined. Reopen: none.
- **Change the verdict rule so a constructed case cannot fail an order.**
  23 reports failed only on cases ordinary use has not reached, 24.7
  hours. The operator made that change for planning refutation on
  2026-09-15. For code it would also have passed WO-170's ordering
  defect and WO-171's unretained copy, which are real and cheap to fix
  while the order is open. The smaller step is rule 2: a criterion that
  declares its set turns a case outside it into a boarded follow-up
  without touching what a judge may fail. Deferred for code while
  rule 2 takes effect. Reopen: after WO-173, two orders in a row fail
  only on cases outside their declared sets.
- **Refuse a handoff whose gate is red.** It would have stopped 24
  failed judgments. It would also restore the transition gate the
  stand-down removed, and a gate red for a sibling's reason would strand
  an executor. WO-173 refuses the claim, not the handoff. Reopen: an
  executor records a red gate as unmet and the cycle is spent anyway in
  three orders.
- **An adversarial review by the executor before every handoff.** It
  duplicates the verifier for the 126 findings no existing check shows,
  at a cost nobody has measured; one order that ran a three-lens review
  before handoff still failed on a guard (WO-171). Reopen: an order pays
  such a review and its first verification passes where its neighbours
  fail.
- **A different judge.** §6 measures a difference and cannot name its
  cause, so a change of judge would be a guess. Declined. Reopen: the
  same order is judged by two judges.
- **A release-close outcome record.** A failed close leaves no public
  trace. No close is recorded as failed since WO-171 made the prune
  finish, and the record would need a commit on `main` that no pull
  request carries. Deferred as a map candidate. Reopen: a release close
  fails and the next pass cannot say why.
- **Failed gate output kept with its row** (map candidate 6 of
  2026-09-27). Unchanged: this pass needed no failure log. Reopen as
  recorded.
- **Attempts that leave no report.** Three were met in 96 reports.
  Deferred as a map candidate. Reopen: a verification is dispatched and
  no result is recorded for it within a day.
- **Excluding generated projections from the register's match** (WO-169
  D002). Seven final reviews wrote 123 dispositions; 11 named a
  generated projection or the release line. Too few for a code change;
  WO-173 rewords the rule that made a review write the other 60.
  Reopen: the share passes a quarter.
- **Pruning evidence or storing receipts by identity.** Tracked evidence
  grew 28.7 MB in the week to 2026-09-28, 23.9 of it in the first four
  days; the sixteen orders closed since 2026-09-25 added 5.4 MB, 0.05
  to 0.67 MB each. The receipts directory is 17.4 MB. Both deferred
  again.
  Reopen: one order commits more than 1 MB under `docs/evidence`, or
  the receipts pass 32 MB.
- **A structural cut of the product gate.** The plain gate is 314 to
  322 s, under the six minutes the stand-down set; the review selection
  is 612 to 645 s. The larger multiplier is the 2 to 9 runs an order,
  which WO-173 reduces. Reopen: after WO-173 an order still pays more
  than four product gate runs.
- **An Entropy Reducer review in this pass.** Sixteen orders have closed
  since REVIEW-003; the recorded condition (ten) has occurred. The
  planner skill starts a review only from the operator's phrase, which is
  its authority for the external launch, so this pass does not run one;
  WO-172 prints the count at every entry. Deferred. Reopen: two pass
  entries in a row show a review due and none has run.
- **Withdrawing the six umbrella orders outside the sequence.** Declined:
  a withdrawal takes the operator's words (WO-158) and nothing waits on
  one; the umbrellas stay unedited, not activatable by their own text,
  and their children now state the rules they carried. Reopen: an
  umbrella's text misleads an executor or a pass.

## 14. Goal alignment

Mission and critical path. The mission is operator flow: supervision,
recovery and verification moved into machinery that can be relied on. A
third of recorded phase time spent on failed judgments is that
supervision, paid by the operator as dispatches and waits. Neither new
order is on the source-to-deliverable path; both reduce what every
order on it will pay, and the sequence puts a product order beside each.
WO-060 and WO-116 open gates G and U.

Traps. Policy resistance: WO-173 sits beside the stand-down's removal of
transition gates; it refuses a claim the record contradicts and admits
every handoff, so the two do not undo each other, and its fallback is
the advisory it replaces. Commons: the inline document gate costs 12.8 s
a completion against 19 minutes of judging and 30 of repair for a
failure, at the medians; the role text grows
by at most 150 bytes against the reviewer's 405. Drift to low
performance: the standard made explicit is the first verification, which
no instrument watched while it went from 17% failed to 79%. Escalation:
no refusal is added to a handoff, no threshold to planning; WO-172
counts and a pass decides. Success to the successful: the verdict rule
and the choice of judge are recorded with their measurements, not
excluded. Shifting the burden: cause B is the operator deciding one
cycle late; WO-173 moves the decision to the dispatch where a waiver is
already legal. The pass fell into this trap itself and the operator
corrected it (§1): by rule 6 a live feedback episode, a read-only smoke
and a measurement of the executor's own launch are the executor's, and
no amended order asks the operator for a step the executor can perform.
Rule beating: a ledger can say met for everything; it is
checked only where a gate can check it, and the order says so. Seeking
the wrong goal: the measure is failed judgments and their hours, not
ledger lines written; a lower count bought by judges who look less
would be the wrong goal, which is why the verdict rule is not changed
here.

Naive Interventionism. What the present behavior does well: an
independent judge finds real defects, 112 of 184 on paths ordinary use
reaches; that is kept whole. Consumers: every executor, verifier and
reviewer session, and the final review's publication check, which reads
the same gate row. Second-order harm: an executor that records every
criterion unmet to avoid a refusal; the ledger then says so in the
status the operator reads. Reversibility: each item is one call site.
Smallest probe: WO-173 is its own first subject, since its criterion 9
requires its own ledger.

Platform lens. `plan failures` is a command with typed output over
content-addressed records; the ledger is a file in the form the
verification report already has; this repository consumes both before
any export; a stranger to the session can read either.

## 15. Evidence and cost of this pass

- Surveys: eight read-only agents read the 96 failed reports
  (2,880,914 tokens, 453 tool uses, 740 to 1,240 s each by the harness
  readback of the agent tasks). Five more re-observed the 45 open orders
  outside §10.3; four reported 2,022,121 tokens and 768 tool uses in
  2,202 to 2,729 s, and the fifth reached the host's usage limit after
  writing its result, so its counters are unknown. Five drafting agents
  then wrote the amended text of their batches into session scratch, and
  the planner reviewed each draft against the repository before applying
  it (§10.4). The planner read the 56 corrections, the register's 156
  pending rows, the orders of §10.3 and the sources the two new orders
  name.
- Model: the operator set Claude Fable 5.1 at maximum effort for the
  pass and switched the session to Claude Opus 5.5 during it (first
  observed at 13:46:51Z on 2026-09-28, when the fifth order survey had
  stopped on the Fable 5.1 usage limit after writing its result). The
  eight report surveys and the five order surveys ran on Fable 5.1; the
  five drafting agents were started on Opus. The refuter's model is
  recorded in §17.
- Counts were made by throwaway scripts in session scratch over the
  control logs, the decisions and the register's export; WO-172 replaces
  them.
- Gates: `npm run test:docs` passed 23 of 23 in 12.81 s on the branch
  before the first write.
- Usage and the refutation's cost are in §17 and the response.

## 16. Reversal conditions for this plan

- After WO-173 closes, the first verification fails in more than half
  of the next eight orders made ready.
- A completion is observed refusing while the gate row it asks for
  exists.
- A pass after WO-172 files its document without the failures of its
  window.
- An order amended under rule 2 fails verification on a case inside its
  declared set that its fixtures did not hold.
- The operator moves the debt entries back ahead of the product
  entries, or strikes an item.

## 17. Independent review

At the operator's direction the pass's one refutation runs on GPT-6
Astra at `max` with no time limit, in a `planning: refute` dispatch the
operator opens after this subject is committed. The external transport
could not serve it: its twenty-minute deadline is a constant
(`PLAN_REFUTATION_LIMITS` in
`packages/skeleton/src/plan-refutation-protocol.ts`) that a planning
pass cannot change. The receipt, its verdict and the dispositions of its
findings are recorded here when this pass resumes.
