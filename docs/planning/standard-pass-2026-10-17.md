# Standard planning pass, 2026-10-17

## 1. Subject, authority and provenance

The operator opened `planning: standard planning pass with some comments` on
2026-10-17 at about 18:00Z and, between 18:02Z and 18:08Z, sent five
comments while the pass read the record. The dispatch and the five comments
are captured verbatim in ignored intake
(`docs/intake/notes/planning-standard-pass-2026-10-17.md`, SHA-256
`77c11cf4d052fcb9288bddf547ccc80eac2ea14c6d46316a425cd6e6ddef108b`), a
sibling record, never a source to mine. This document is planner synthesis
of public repository evidence and of the operator's own transcripts on the
operator's machine; the clean-room screen found no suspect material.

Entry was clean `main` at `7b8206f4`, with WO-213 closed (v0.83.0) and no
active order. Three orders closed since receipt 045
(`2026-10-13-planning-4f74762e1dd466b6-045`, frozen 2026-10-13T19:35:31Z):
WO-215 (v0.81.0), WO-210 (v0.82.0) and WO-213 (v0.83.0). The pass runs on
`planning/2026-10-17-standard-pass`, created by `plan start`. Only the
parent writes this planning checkout.

Fan-out, planned against `subagentCap` 20 with 0 admissions observed at
entry: three read-only `dotln-worker` drafters (one order text each: the review
order, a gate order and the WO-096 amendment) and one background refuter,
four in all, no descendants, no critic and no analyst group. All three
drafts were declined by the operator before filing (§5). The orders this pass files the planner wrote without a drafter: WO-216
from the gate index's failure rows (§4.5), and WO-217 to WO-220 from the
register's boarded decision rows (§4.6), both on the operator's direction. The
operator's third comment is about review agents that always find something,
so this pass did its own reading and spawned no reviewer of its package.

The five comments, in the planner's words (§4 gives each the evidence),
and the two directions that followed them mid-pass (§4.5, §4.6):

1. Agents answer pushback with agreement openers instead of checking; the
   operator wants a team that finds its way to the truth, and says neither
   party is right that often.
2. Executors and repairs never consider alternatives when speed or
   architecture has several options, and never consider refactoring what
   exists.
3. Review agents always return findings: a hundred review agents would all
   come back with something, which should not happen.
4. A build, not a biography: these behaviours are suggested in long prose
   instead of built as deterministic rules, cases and context.
5. The last orders were nothing but gate runs, gate failures and runs that
   fail at the end; the attempts to fix the gate blocked progress further;
   the operator is close to capping all testing at five minutes and dropping
   whatever does not fit.

Aim, as read: retire the three closes, dispose what they fired and what the
2026-10-16 ideation left, and answer each comment from the record, filing an
order only where a condition has occurred or the operator's direction asks
for a build. Traps named before the material choices: agreeing with the
operator's reading where the record does not support it (each reading
below says where it does and where it does not); filing machinery ahead of the operator's one focus (five orders are filed ahead of WO-080: one because it removes the
bookkeeping failures every later cycle pays, four because the operator
directed that the boarded rows be resolved; the alternative of filing
none is recorded with its cost, and the operator may interleave them); reading a remark as a direction and then
swinging to its opposite (the pass did both, and records the corrections
in §4.5); answering a complaint about prose with more
prose (each answer names its check, or says why none can be built); and
repeating the withdrawn WO-213 expansion under a new name (the gate order
bounds time and selection and carries nothing between runs). The NoOp at
entry would have left three closed entries in the sequence, twenty-six
register rows undisposed, the operator's five comments unrecorded, the
complete gate at twenty-eight to fifty minutes paid eleven times per order,
and the next order (WO-080) adding a three-repository real-Git suite to it.

## 2. Entry observations

`plan start` and `plan failures` in the window since receipt 045: 7 failed
verifications, 4 failed final reviews, 11 repairs, 3 orders made ready, 2
failed first verifications, 3 corrections (WO-213 D029, D031 and D045), 0
off-ramps and 15 execution amendments (WO-210 D014, D017, D020, D028 and
D029; WO-213 D008, D010, D012 twice, D039, D051, D052 and D072 three
times). The record totals stand at 145 failed verifications, 20 failed
final reviews, 168 repairs, 176 orders made ready, 84 failed first
verifications, 181 corrections, 6 off-ramps and 69 amendments. Fourteen
measured final reviews of the ten most recent orders recorded 96 escapes;
the seven since receipt 045 recorded 88. Local records: 4 release closes,
0 host denials, 37 interventions (31 unclassified), 24 long phases
(WO-213 11, WO-210 9, WO-215 4), 9 repeated gate runs at a green identity
(WO-213 5, WO-210 3, WO-215 1), and the eight recent closes split six
delivery and two machinery.

Phase time of the three closes, from the control events:

| Order | Span | Verifications | Repairs | Final reviews | Implementation | Repair | Verification | Final review |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-215 | 8.3 h | 2 | 1 | 1 | 2.2 h | 2.8 h | 1.2 h | 0.9 h |
| WO-210 | 28.5 h | 5 | 4 | 3 | 3.6 h | 17.6 h | 2.3 h | 2.9 h |
| WO-213 | 51.9 h | 7 | 6 | 3 | 5.8 h | 25.5 h | 3.3 h | 2.7 h |

Repair took 43.1 hours against 9.4 hours of implementation over WO-210 and
WO-213.

**Routing the failed reports.**

- **WO-215 VER-001** (criteria 6 and 11): the dry run misreported its
  preview with main behind origin, and the release-close row's write-back
  was missed. Executor defects, repaired once. Nothing carried.
- **WO-210 VER-001**: every criterion met, and F1 broke a behavior main
  had, shown by a probe on both trees. **VER-002**: every criterion met,
  and the operator authorized a failing verdict because an instance on
  v0.81.0 could not take the release by the documented update. Both were
  defects of the instance update route, repaired. **FINAL-001** (three
  reviewers, 28 findings, 3 blocking) and **FINAL-002** (two reviewers and
  a refuter, 19 findings, 1 blocking): the blocking findings were a false
  advisory from effort discovery, an untracked generated index left by the
  documented update, a raw permission error on an unreadable ignored
  directory, and a gone worktree entry refused with a raw ENOENT. Carried:
  the reading in §4.3.
- **WO-213 VER-003 to VER-006**: four consecutive failures on criteria 16,
  17 and 19, the validation-system expansion the operator added during the
  second repair (D039) and withdrew after the fourth failure (D072). Each
  failure was one side of the same boundary: a stale pass admitted
  (VER-004, VER-005, VER-006) or unchanged work invalidated (VER-003,
  VER-006). Carried: the gate order (§5) and the reading in §4.5.
  **FINAL-001** (three reviewers, 18 findings, 2 blocking: a roleless
  session could take the publish admission; a non-idempotent substitution
  made every register sync append a revision) and **FINAL-002** (three
  reviewers, 10 findings, 1 blocking: a stray file under `packages/` made
  the instance digest throw). Carried: §4.3.
- **The corrections**: D029 (a review judged seven register rows where the
  listing had paged seventy), D031 (a scope expansion read as twenty new
  reviewers) and D045 (the targeted-first preflight read as optional) are
  all misreadings of process text by roles, which §4.4 takes as evidence.
- **Long phases and repeated gate runs** have the causes §4.5 records.

The reader profile is unchanged with three releases unscored, so `plan
start` called no reader due and none ran.

## 3. Reopening observations

`plan conditions` at 18:02Z (45.7 s):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 3.857 s | 8 s | no |
| Release table lag | 3 tags | 3 tags | no |
| Latest two closed orders, distinct evidence blob bytes | 276,238 and 1,017,736 | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 6,977,546 bytes | 10 MB | no |
| collectSources | 0.958 s | 3 s | no |
| Uncached release listing | 4.971 s | 10 s | no |
| status --all --json | 6,215,061 bytes | 32 MB | no |
| Work-order index | 2.451 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured | 30 s / 15 s | unknown |
| Plain gate, thirty-day median | 298.843 s | 360 s | no |
| gate-task vertical | 722.676 s against a 753.864 s median | 1,130.796 s | no |
| gate-task target-worktree | 668.362 s against a 51.303 s median (32 samples) | 76.954 s | yes |
| coldStartBytes.executor | 28,112 | 24,576 (WO-150-D003) | yes; the ceiling is 29,246 |

**The target-worktree task** grew thirteenfold in the week WO-210 and
WO-213 gave an exported instance its own lifecycle and gate: its suite ran
26 times since receipt 045, median 173 s and longest 605 s. It is the largest single growth in the gate since the vertical split.
WO-216's launchpad file lanes answer the other cap breach (§4.5); the
target-worktree growth is read again by the next pass from the rows
WO-216 records.

**Evidence** did not fire this time: WO-213 committed 1,017,736 bytes of
distinct evidence (its expansion's probes and audit outputs among them) and
WO-210 276,238. The week arm did not fire either.

**The cold start** is unchanged at 28,112 bytes since 2026-10-09, the
operator's reserved efficiency pass (FUP-f1c7a256bec46737 stays open).

**Order-lifecycle triggers.** No deferred row's condition names WO-215,
WO-210 or WO-213 by their close. Twenty-two deferred rows name an absorbed
order (WO-089, WO-095, WO-098, WO-113) whose carrier has not landed; each
still fires at the carrier's close. FUP-2518166a22767f47 names an
observation (a phase worker's gate recorded with `DOTLN_LAUNCHPAD` set) that
WO-210's record does not contain, and stays as it is. FUP-74362527b75d12f5
(two passes in a row ending with more pending rows than they began with):
the 2026-10-13 pass ended at 247 pending rows, the 2026-10-16 ideation at
275 (it minted fourteen and disposed none, and two closes added rows
between), and this pass begins at 281; this pass ends below its entry
count (§7), so the trigger does not fire.

**The order-size rule** (product 07 §Operator-opened planning pass) reopens
when the complete run's median falls to half its 24.9 minutes or merged
orders fail first verification more often than five of eight. The median
rose to 28.2 minutes (§4.5); one merged order has closed (WO-210) and it
failed its first verification, which is one observation against an
eight-order baseline. Neither condition is read as occurred; the reading
in §4.3 is that the reviewer count, not the order's size, predicts a
review's finding count.

**The meter** (`npm run meta` at the sync) reports three reopen signals:
WO-150-D003's cold-start condition (28,112 bytes against 24,576, unchanged
since 2026-10-09, §3), and the shifting-the-burden and
drift-to-low-performance signals worsened over three consecutive order
deltas; the window's recorded causes are the ones §4.5 names, and WO-216
is the answer this pass files for them.

## 4. The operator's five comments, against the record

Each reading says what the record supports, what it does not, and what the
pass does. The operator asked for a team that finds its way to the truth,
so disagreement is written where the evidence puts it.

### 4.1 Agreement openers

**What was said.** Agents reply with agreement and apology openers (that
the operator is right to push back, that the agent is sorry to have wasted
the operator's time, that the operator is absolutely right); correctness
over sycophancy is not being adhered to. The capture's SHA-256 is
`77c11cf4d052fcb9288bddf547ccc80eac2ea14c6d46316a425cd6e6ddef108b`.

**What the record shows.** The planner searched every Claude Code
transcript of the DotLn-family projects on the operator's machine (118
project directories, about 470 session files, 10,875 assistant text parts,
this session excluded) and the 131 Codex rollouts since 2026-09-15:

| Measure | Claude Code | Codex |
| --- | ---: | ---: |
| Assistant texts containing an agreement or apology phrase | 46 in 33 sessions | 5 in 4 sessions |
| Replies opening with agreement ("You're right", "Exactly", "Correct") | 34 | not measured |
| Replies opening with disagreement ("No,", "Not quite", "Partly") | 10 | not measured |

The two quoted phrases exist: "You're right to push on that" (2026-09-22)
and "That wasted your time, and I'm sorry" (Codex, 2026-10-15, during
WO-213's repairs). In nearly every instance read, the opener is followed by a named error
(that the agent had guessed instead of checking; that offering the
override phrase as the answer had been wrong). The
openers cluster in sessions where the operator was intervening often:
37 interventions since receipt 045, most of them in WO-213's week.

**Where the readings differ.** The phrases are rare (about 0.4% of
replies) and attached to real errors, so "not adhered to in the least" is
not what these transcripts show. What they do show is the asymmetry the
operator is pointing at: replies open by agreeing 3.4 times as often as by
disagreeing, and the record cannot say who was right in any of them. The
compiled `correctness-over-sycophancy` unit binds judgments of a subject to
evidence; it says nothing about the register of a reply to pushback, and no
check observes replies at all. Whether an agent abandons a correct position
under pushback is the substance of the complaint, and nothing measures it.

**What the pass does.** No order. A phrase filter at Stop time is the only
mechanical check available, and it would teach the model to vary its
phrasing rather than to check. The checkable part already exists as the
shared evidence rule (a claim names the command and output it rests on);
the WO-096 amendment (§5) records, on the unit's migration row, why the
register is not lowered and what observation reopens it: the operator cites
a session in which an agent abandoned a correct position without new
evidence. The NoOp is in §8.

### 4.2 Tinkering

**What was said.** No executor or repair considers alternatives when speed
or architecture has several options, or considers refactoring existing
code.

**What the record shows.** The tinkerer-economy support is equipped by
default since WO-150 (v0.39.0), with the trigger WO-196 moved to "when the
work shows a fork", and a decline left unrecorded. Since WO-196 landed
(2026-10-07), the four largest orders (WO-118, WO-215, WO-210 and WO-213)
recorded zero experiments and zero declines; five experiments exist in
decision files touched since then, all in smaller orders. WO-150's
reopening observation (ten equipped dispatches recording an experiment or a
decline, and fewer than half doing either) cannot be evaluated, because
nothing is recorded either way. The decision records of the three closes
hold rejected options, nearly all of them process choices (one worker per
finding, which checkpoint to roll back to) rather than design forks with a
measured axis. Review found the refactoring the executor did not
(`starter-seeds` re-implementing a composition rule instead of importing
it, WO-210 FINAL-001 F21).

A structural cause the record supports: an order's execution plan names,
per step, the file and the function it changes, so the architecture is
fixed when the order is filed, and the executor meets no fork to tinker at.
The order template's Design asks for "alternatives and reasons", and the
orders filed since 2026-10-11 state a chosen approach with few named
alternatives.

**Where the readings differ.** The operator's observation is right for the
orders they watched; the support that was meant to elicit tinkering has
been silent since its trigger changed, and the record cannot tell silence
from a fork honestly declined.

**What the pass does.** Two things. Planning's half now: every order this
pass files names at least one rejected alternative and the axis it differs
on (product 07 §Operator-opened planning pass, §9), and the two new orders
do. The build: the WO-096 amendment lowers the tinkerer unit to two checks,
the order-contract check requiring the Alternatives element for orders
filed from today, and a `fork:` line in the executor's handoff that
completion reads (§5).

### 4.3 Reviews that always find something

**What was said.** A hundred review agents would all come back with
findings; that should not happen.

**What the record shows.** Final reviews have declared their findings in a
structured block since 2026-10-06. In that record:

| Reviews | Spawned reviewer workers | Findings per review |
| --- | --- | --- |
| 22 (WO-196 to WO-203, WO-072 to WO-078, WO-188 to WO-191, WO-199 twice) | none | 0 to 2; fifteen recorded zero |
| 9 (WO-187, WO-118, WO-215, WO-210 three times, WO-213 three times) | one to four | 7, 11, 12, 28, 19, 6, 18, 10, 6 |

A spawned reviewer returns about ten items whatever its surface ("the
lifecycle reviewer reported ten items (A1 to A10) ... the text reviewer ten
(B1 to B10)", WO-210 FINAL-002; "three read-only reviewers reported 27
items", FINAL-001). Of the 99 findings in the seven reviews since receipt
045, 7 were blocking, 4 were operator packets and 88 were follow-ups. Each
blocking finding cost a repair, a verification and a final review; the
blocking ones were a false advisory, an untracked index, a raw error on an
unreadable ignored directory, a gone worktree entry, a roleless session's
admission, a non-idempotent substitution and a stray file under
`packages/`. The 88 follow-ups became register rows: pending rows stood at
247 after the 2026-10-13 pass and 281 at this pass's entry. All 25 planning
refutation receipts on record are `aligned-with-findings`; none is
`aligned`.

**Where the readings differ.** The operator is right about spawned
reviewers: every review that spawned one recorded findings, and the count
tracks the number of reviewers, not the subject. The record does not
support the claim for reviews as such: fifteen of the twenty-two reviews
that read the subject themselves recorded nothing and passed. The
distinction matters, because it says where the build goes: into what a
spawned reviewer is told and what a finding must carry, not into
forbidding review.

**What the pass does.** An order that builds this as checks (a finding
refused without what it breaks and the command that showed it; reviewers
spawned for cause; a worker cap per role; a yield readback) was drafted and
declined by the operator, as was a product 07 paragraph stating the rule as
prose. The shape is map candidate 6(a), for the operator's word. The finding
stands in this record: spawned reviewers return findings in proportion to
their number, and the register grows by them.

### 4.4 A build, not a biography

**What was said.** Nearly all the nonsense comes from behaviour that is
suggested in long prose rather than built as deterministic rules, cases and
context, as every application before 2021 was.

**What the record shows.** The six role skills total 92,279 bytes of
generated prose; the executor's cold start is 28,112 bytes against a
24,576-byte ceiling raised to 29,246 by dated acceptances. Of the units the
executor's loadout lists, the hook-lowered ones are the writer reservation,
attribution, lint-disable, the five refusals and the Stop-time advisories;
anti-oscillation, bounded-boy-scout-cleanup, correctness-over-sycophancy,
fail-conservative-correction, goal-alignment, process-cost,
decision-receipts, tinkerer-economy, adjacent-repair, communication-intent,
operator-check-in and follow-up-queue are role sentences. Three of the
window's corrections were roles misreading process prose (D029, D031,
D045), and the behaviours in the three comments above are all prose units.
The vision names the principle (product 00 §Common substrate; product 03
§The skills layer), and WO-096, the order that lowers units to compiled
mechanisms, sits thirteenth of fourteen in the queue.

**Where the readings differ.** None on the principle. One qualification:
the five refusals, the completion checks and the document gate are builds,
and they are what held during the week the prose did not; the complaint is
about the remainder.

**What the pass does.** A recut of WO-096 to the operator's words (each
prose unit lowered to a check or its reason recorded; the compiler refusing
growth in prose; the tinkerer unit as two checks) was drafted and declined
by the operator, who left the order as written; the shape is map candidate
6(c). A product 07 sentence stating the principle was written and withdrawn
on the same direction, because a rule against prose is itself prose. What
this pass builds is WO-216 (§4.5), whose every rule is a task, a row or a
refusal.

### 4.5 The gate, and why it is so hard

**What was said.** Five to ten failures came from trying to fix the testing
and gate problem; the repository does nothing but run gates, fail gates,
accidentally run gates, or run them ninety percent of the way and fail; the
fixes themselves block progress; the operator is close to capping testing
at five minutes and dropping whatever does not fit.

**What the record shows.** Gate rows recorded in this checkout since
receipt 045: 516 task rows and 1,636 minutes of task time in four days.

| Run | Runs | Failed | Median | Longest | Minutes in all |
| --- | ---: | ---: | ---: | ---: | ---: |
| `npm test` complete | 33 | 9 | 1,689 s | 3,063 s | 754 |
| `npm run test:docs` | 125 | 17 | 110 s | 527 s | 233 |
| `--only launchpad` | 14 | 5 | 457 s | 847 s | 108 |
| `--only target-worktree` | 26 | 5 | 173 s | 605 s | 98 |
| `--only runner-fixtures` | 28 | 8 | 100 s | 303 s | 53 |
| `--only launchpad-planning` | 21 | 7 | 87 s | 316 s | 41 |

Eleven complete runs per closed order, against 2.29 on 2026-10-13, and a
median of 28.2 minutes against 24.9; WO-213's last fresh complete review
took 2,976 s. The failures the operator counts are WO-213's four
verifications and two final reviews plus WO-210's two and two: ten.

Why it was hard, from the record:

1. **The orders changed the instruments that judge them.** WO-215 changed
   release close, WO-210 the runner, the gate, the close and resume, WO-213
   the document check, the hooks and the runner again; every review of them
   notes that the instruments under review also recorded the work. A defect
   in the instrument shows up as a gate failure and is repaired under the
   same gate.
2. **The expansion.** On 2026-10-16, inside WO-213's second repair, the
   operator directed a validation-system expansion (D039, D051, D052):
   parallel targeted preflights and per-task reuse of passes across fixes.
   It changed 20 code files (5,578 lines added), failed four verifications
   on alternate sides of one boundary (a stale pass admitted; unchanged work
   invalidated), spent about 8.9 hours of recorded gate wall time, and was
   withdrawn on 2026-10-17 at the operator's direction with seventeen
   workers checking the undo. Its account
   (`docs/evidence/WO-213/validation-expansion-history.md`) names the
   lessons: carried task time is not wall time saved; whole-code identity
   restarts everything; binding more is not safer; route-by-route fixing
   does not converge; stopped runs record nothing. No planning pass filed
   the expansion, so none of the 2026-10-13 filing screens applied to it.
3. **The gate grew while being fixed.** WO-210 and WO-213 added the instance
   lifecycle fixtures (target-worktree 51 s to 668 s) and whole-corpus
   record screens, so each repair paid a longer complete run than the last.
4. **Review fan-out** turned edge states into blocking cycles (§4.3): seven
   cycles for seven blocking findings, each a repair of two to eight hours
   plus a verification and a review.

**Where the readings differ.** "All it does is run gates" is 27 hours of
gate time in four days, but the larger sink was repair, 43 hours over
WO-210 and WO-213, and repairs were driven by the findings and by the
expansion as much as by the suites. "Five minutes of testing" already
describes the plain gate: its thirty-day median is 298.8 s. The cost is the
28- to 50-minute complete gate paid eleven times per order, and the
preflight-then-complete double that the 2026-10-13 rule required. Dropping
every suite over five minutes would drop launchpad, target-worktree,
vertical, skeleton and harness-fixtures, which are the detectors for the
surfaces these orders changed (the failing single-suite rows above are the
orders' own preflights catching their own defects). The lever is where the
complete gate is paid and what a role runs before handoff.

**What the complete gates failed on.** The operator asked whether the pass
had looked at why the complete gates fail, and named the answer: a
dependency left undeclared, a sync that did not occur, found after forty
minutes. The gate index of this checkout holds the rows:

| Run | Order | Length | Failed at | Root | Class |
| --- | --- | ---: | ---: | --- | --- |
| 2026-10-13 21:54Z | WO-215 | 27.1 min | 5.6 min | process-debt: the role-oracle snapshot not re-minted after a role-text change (D010) | stale artifact |
| 2026-10-14 09:43Z | WO-210 | 0.1 min | 0.1 min | format | formatting |
| 2026-10-14 19:24Z | WO-210 | 41.3 min | 22.2 min | runner-fixtures: added fixture inputs missing from `machinerySources` | declaration |
| 2026-10-15 00:23Z | WO-210 | 44.7 min | 29.2 min | launchpad at its 900 s deadline with four peers (and worktree-integration) | deadline |
| 2026-10-15 00:42Z | WO-210 | 18.5 min | 15.0 min | launchpad at its 900 s deadline, alone | deadline |
| 2026-10-15 15:46Z | WO-213 | 0.1 min | 0.1 min | format | formatting |
| 2026-10-16 07:02Z | WO-213 | 38.1 min | 21.2 min | wo107-schema: a watchdog fixture refusing under host memory pressure (D042) | host state |

None of the seven found a product defect. Of the seventeen failed document
gates, fourteen failed on a stale generated artifact (the meta index six
times, release surfaces three, the work-order index once, evidence editions
three, the harness bundle twice, the planning receipt once) and five on
`docs-check`. Two more declaration failures stopped complete reviews on
2026-10-16 without a row: a copied CLI fixture missing `runtime-inputs.mjs`
(D038) and `harness-fixtures` not declaring `control-store.mjs`, found after
1,420 s (D039). The runner continues after a failed task: the 2026-10-13
run spent 21 minutes after process-debt failed.

**Two corrections.** The pass first read the five-minute remark as a
direction and had a time-budgeted gate order drafted; the operator said
the remark was venting and that such an order would have no chance of
success or usefulness. The planner then withdrew every gate work from the
pass, which the operator named as the opposite error: agreeing, then
swinging from one extreme to the other, against the anti-oscillation and
correctness-over-sycophancy rules. The operator's direction, stated after
both: stop executors spending days per order on gates; fix why the
complete gates fail; read what the WO-213 expansion tried and improve on
it. Both swings are recorded here as the planner's errors; the record
above is what the evidence supported throughout.

**What the pass does.** WO-216 (§5), written by the planner from the rows
above and the expansion's own account: a structural phase runs first, in
seconds, in every gate and at every handoff (formatting, the configuration
and registration rows, the declaration scan over every suite's sources and
every copied-fixture closure, the freshness of every generated artifact,
the host's memory state) and stops the run before any suite starts, naming
`npm run sync` when an artifact is stale; one `npm run sync` regenerates
every derived artifact policy allows and names what it refuses; a failed
task stops the run from starting more (`--keep-going` restores today's
behavior); the complete gate runs once per order, fresh, at final review,
while handoffs stand on the structural phase and the order's own Preflight
suites; the launchpad suite runs as file lanes under their own deadlines;
a stopped run records what finished. It takes the expansion's directions 1
and 2 (history §8) and none of its reuse (history §6): nothing is carried
between runs, so the class that failed four verifications cannot recur.
The time-budgeted selection stays declined (map candidate 6(b)), and the
mid-run route that admitted the expansion is candidate 5 for the operator's
word.

### 4.6 The boarded follow-ups

**What was said.** After the gate direction, the operator asked for
standard work orders that resolve every boarded, follow-up and reopened
row.

**What the record shows.** At `7b8206f4` the register holds 281 pending
rows: 151 candidates (ideas with reopening conditions, 105 of them in the
planning map and 20 in product 05) and 130 decision rows, each boarded by a
closed order's verifier or reviewer under product 07's boarded-defect rule
and deferred to "the next order that edits these surfaces", a planning pass
or a repair. They span 53 orders; the oldest is WO-054's (2026-09-18); 88
were boarded in the week of 2026-10-13 to 2026-10-17 alone, and the pending
count rose from 247 to 281 in that week. The rule that the next order
editing a surface takes its rows delivered none of the 130: every one is
still pending.

**What the pass does.** Four orders, cut by subsystem from the 130 rows
(seven are disposed by this pass itself: three settled, one declined, two
allocated to WO-216, one left open with the operator): WO-217 (the gate,
the runner, the host guard, gate evidence and the fixtures; 31 rows),
WO-218 (the instance lifecycle, export and kit, publication, release close,
the starter and worktrees; 32), WO-219 (lifecycle records, attestation,
role text, hooks, the harness and planning machinery; 40) and WO-220 (the
resident, the vertical, the console, intake and triage, audit, the corpus
lanes and the kernel's admission; 20). Each lists its rows by id with the
register's excerpt and source link; the executor reads each row at its
source, reproduces or restates it, and fixes it with a fixture case or
declines it with its reason; the register disposition applied through the
checked `--apply` route is the record, which verification reads row by
row; a row only the operator can decide leaves as an operator packet; at
most a third of a batch may be declined. The standard for later passes: a
boarded-follow-ups order is cut the same way, per subsystem, when a
subsystem's pending decision rows pass twenty, and the pass's register
section counts them. The 151 candidate rows stay planning's: they are ideas,
not defects, and this pass disposes the ones it read (§7).

## 5. Orders filed and amended

| Order | What it delivers | Basis | Placement |
| --- | --- | --- | --- |
| WO-216 | No gate fails late on bookkeeping: the structural phase first in every gate and handoff (formatting, declarations and copied-fixture closures, generated-artifact freshness, host memory state) with fail-fast and the `npm run sync` remedy; the complete gate once per order at final review with handoffs on the Preflight suites; launchpad as file lanes; stopped runs recorded. | The operator's direction of 2026-10-17 (§4.5); FUP-201956913dc8ea85 (WO-213-D072's planning follow-up), FUP-92bdaad7521fd511, FUP-e96221b106cd136a, FUP-182984d482ca59ca | Position 1 |
| WO-217 | Boarded follow-ups, batch 1: 31 rows on the gate, the runner, the host guard, gate evidence and the fixtures, each fixed with a case or declined with its reason. | The operator's direction (§4.6); the 31 rows by id | Position 2 |
| WO-218 | Batch 2: 32 rows on the instance lifecycle, export and kit, publication, release close, the starter and worktrees. | The same; the 32 rows | Position 3 |
| WO-219 | Batch 3: 40 rows on lifecycle records, attestation, role text, hooks, the harness and planning machinery. | The same; the 40 rows | Position 4 |
| WO-220 | Batch 4: 20 rows on the resident, the vertical, the console, intake and triage, audit, the corpus lanes and the kernel's admission. | The same; the 20 rows | Position 5 |

WO-216 names its rejected alternatives and their axes, its Preflight line,
a final criterion naming both gates and `npm test -- --review` (it edits
declared machinery sources), and its carried rows by id. It edits no
feedback-judged source, so it owes no live feedback episode. Its own
criteria are fixture-based plus its own handoff rows, so its verification
does not depend on the mechanism it builds. The four batches share one
contract (the Design, criteria and steps of each are the same shape with
the rows and surfaces of their subsystem); WO-220's surfaces include
feedback-judged sources, so an edit there owes one live feedback episode,
which its Cost line states.

Five machinery and cleanup orders stand ahead of the operator's focus
(WO-080, WO-204, WO-192, WO-083): WO-216 because every later order pays
the failures it removes, and the four batches on the operator's direction.
The alternative, filing nothing, is recorded in §8 with its reversal
condition; the operator may interleave the batches with the focus orders
by one sequence edit.

Three drafts were declined by the operator before filing and are not
records: a review order (a finding refused without what it breaks and the
command that showed it; reviewers spawned for cause; a worker cap per role;
a yield readback), a time-budgeted gate (a 300 s selection before handoff
with the complete gate once at final review) and a recut of WO-096 (each
prose unit lowered to a check or its reason recorded; the compiler refusing
growth in prose; the tinkerer unit as two checks). Their shapes are the
map's candidate 6, for the operator's word. No order is amended.

## 6. The sequence

WO-215, WO-210 and WO-213 leave the list; the generated index's history
page is their record. The list stays one serial group (operator direction,
2026-10-13), the 2026-10-13 order with the five new orders first: WO-216,
WO-217, WO-218, WO-219, WO-220, WO-080, WO-204, WO-192, WO-083, WO-207,
WO-193, WO-183, WO-088, WO-091, WO-096, WO-014.

## 7. The register

At entry (revision `d6462e4d…`) the register held 1,155 rows, 281 of them
pending: 1 needing review, 2 open, 23 untriaged and 255 deferred. Every
active row was read with its source decision (the 14 rows of the
2026-10-16 ideation, the 9 rows the three closes boarded, the 2 open rows
and the one needing review), and every deferred row was read for a fired
trigger (§3). The 130 pending decision rows were exported whole and cut by
subsystem (§4.6).

The register changed in three steps:

1. **The sync.** After the map's candidates section and the product 05
   reading were written, `npm run meta` minted the six candidates of this
   pass and returned FUP-0090 and FUP-fc4158d3207e495d to review because
   their product 05 sections changed (1,161 rows, revision `1d1963ca…`,
   288 pending).
2. **One batch of 153 dispositions** (`docs/control/local/fup-2026-10-17-apply.json`,
   ignored): 128 allocations (the four batches' 123 rows, WO-216's four
   rows and FUP-0126 to WO-080), 21 deferrals (the twelve remaining
   ideation rows, the six new candidates, FUP-0090, FUP-fc4158d3207e495d
   and FUP-b3c1a8260bca40b7, each with its reopening condition), 3
   settlements (FUP-2a2be2cc2807f530, FUP-13d9674e38ef3b49 and
   FUP-4290f78ca9e7e7ac, whose decisions are in force) and 1 decline
   (FUP-69bd004155a6ec30, WO-210-D036's look-alike and omitted-reference
   items, which reach no use the order names).
3. **After the batch:** revision `b14ce9ee…`, 1,161 rows, 156 pending (1
   open, 155 deferred, none untriaged and none awaiting review). That is
   125 fewer pending rows than at entry; FUP-74362527b75d12f5's trigger
   (two passes in a row ending above their entry count) does not fire.

| Target | Rows | What the order's text says |
| --- | --- | --- |
| WO-216 | FUP-201956913dc8ea85, FUP-92bdaad7521fd511, FUP-e96221b106cd136a, FUP-182984d482ca59ca | the expansion's planning follow-up; the structural phase and the regeneration command; the launchpad cut; the measured claim |
| WO-217 | 31 rows (the order lists them) | the gate, the runner, the host guard, gate evidence and the fixtures |
| WO-218 | 32 rows | the instance lifecycle, export and kit, publication, release close, the starter and worktrees |
| WO-219 | 40 rows | lifecycle records, attestation, role text, hooks, the harness and planning machinery |
| WO-220 | 20 rows | the resident, the vertical, the console, intake and triage, audit, the corpus lanes and the kernel's admission |
| WO-080 | FUP-0126 | the workstream application rows its Known issues carry |

The deferrals stand as recorded, each with the condition the row or this
pass names; FUP-f1c7a256bec46737 stays open with the operator (the
reserved efficiency pass); the 151 candidate rows that this pass did not
read keep their triggers.

## 8. Decisions and NoOp records

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| A check on reply register (comment 1) | The openers are rare in the operator's own transcripts and follow named errors; the asymmetry (34 agreeing openers to 10 disagreeing) is real, and the substance (abandoning a correct position) is unmeasured; a Stop-time phrase filter would teach phrasing, not checking. Evidence: §4.1; map candidate 1. | Each planning pass, from the same transcript count. | The operator cites a session in which an agent abandoned a correct position without new evidence, or a harness exposes a reply-level observation point. |
| Filing no order and keeping the focus first | Rejected: four of the seven complete-gate failures and fourteen of the seventeen document-gate failures since receipt 045 were bookkeeping, each found minutes into a run every later order pays again; WO-080 adds a suite to that gate next. Evidence: §4.5. | At WO-216's close, from the gate rows. | The operator places the focus first; or WO-216's own cycle exceeds the median cycle it was filed to cut (WO-210's 28.5 h, WO-213's 51.9 h), which reopens the placement, not the order. |
| Disposing the 151 candidate rows in this pass, or batching them into orders | They are ideas with reopening conditions, not boarded defects; this pass disposes the ones it read and leaves the rest to their triggers, as every pass does. Evidence: §4.6, §7. | Each planning pass. | The operator directs a sweep of the candidates, or a candidate's trigger occurs. |
| A review order and the WO-096 recut (drafted and declined) | The operator declined both when asked; the review finding (§4.3) and the tinkerer reading (§4.2) stand recorded. Evidence: §5; map candidate 6. | Each planning pass. | The operator directs either, or a final review records more than ten findings from spawned workers again. |
| A time-budgeted gate (a 300 s selection before handoff; drafted and withdrawn) | The five-minute remark was venting, not direction; a budget bounds time without touching the causes the rows show, which WO-216 fixes instead. Evidence: §4.5; map candidate 6(b). | Each planning pass, from the gate rows. | The operator directs it, or WO-216's structural phase and file lanes leave a complete run above an hour. |
| Dropping every suite over five minutes | The plain gate's thirty-day median is already 298.8 s; the suites over five minutes (launchpad, target-worktree, vertical, skeleton, harness-fixtures) are the detectors for the surfaces the recent orders changed, and their failing single-suite rows were those orders' own preflights catching their own defects. Evidence: §4.5. | Each planning pass. | The operator directs it. |
| Reopening the order-size rule | One merged order has closed and failed its first verification, one observation against an eight-order baseline; the complete run's median rose rather than fell; the reviewer count, not size, tracks findings. Evidence: §3, §4.3, map candidate 2. | Each planning pass. | The 2026-10-13 condition occurs over eight closes, or a review with no spawned reviewer records more than five findings. |
| An order for the mid-run expansion route (map candidate 7) | The route is the operator's own (`amend-order` on an operator authorization); refusing it needs the operator's word. Evidence: §4.5. | At the pull request. | The operator asks for it, or a second mid-run expansion onto gate or runner surfaces fails a verification. |
| Allocating the draft pull request at verified (FUP-81c8f4915c7790d3) to WO-192 | It adds a push effect at `verified` that the router does not yet drive, and the review window it opens is the one the declined review draft would have narrowed; WO-192 first. Evidence: the 2026-10-16 ledger entry; §5. | At WO-192's close. | WO-192 closes, or an order's pull request receives feedback the record cannot route. |
| Orders for the outside read's remaining shapes (structural performance guards, the growth-curve benchmark, the continuation payload, sibling checks before the pass, the ablation trial, overnight episodes, a target's skills as convention input, canaries, verification lenses, prefix-cache ordering) | Each names a mechanism without an occurred condition; the measured-claims shape is taken by WO-217 and role-text economy by WO-096. Evidence: the map's 2026-10-16 section. | Each row's own trigger. | The row's reopening condition occurs. |
| Re-recording the open cold-start row (FUP-f1c7a256bec46737) | Unchanged at 28,112 bytes since 2026-10-09. Evidence: §3. | Every planning entry. | A role text changes the reading, or the operator opens the efficiency pass. |
| Rewriting the catalog rows of WO-215, WO-210 and WO-213 | The generated index's history page is their record; the rows keep their preflight context. | Never; by the next pass that reshapes the catalog. | A pass reshapes the catalog. |
| A reader run | The profile is unchanged with three unscored releases; `plan start` reported no reader due. | Every planning entry. | A changed profile with three unscored releases, or the operator's word. |

## 9. Write-backs

Every product-document change amends the sentence it changes; no dated
paragraph is added. On the operator's direction against prose, this pass
writes no behavioural rule into a product document: a review paragraph and
a sentence on filing corrections as checks, both written mid-pass, were
withdrawn.

- **Product 05 §Candidate — Tinkerer / Scientist:** the 2026-10-17 reading
  (no experiment and no decline recorded by the four largest orders since
  WO-196; the recut that would lower the unit was declined).
- **Product 07 §Operator-opened planning pass:** an order's Design names
  at least one rejected alternative and its axis (an order-contract
  element, which WO-088's contract check can read).
- **Product 07 §Workflow closeout and releases:** the three routes for
  feedback on a merged pull request after the pass, and the second
  publish's observed failure (FUP-1241a4d027a07dce), as documentation of
  what exists.
- **Product 06:** the generated release table (168 tags).
- **The sequence, the map, the ledger:** the sequence is one serial group of sixteen with WO-216 and the four batches first; the map holds this pass's paragraph, the candidates section (six) and the five new catalog rows; the ledger holds one
  ideation section for the operator's five comments and this pass's
  registration heading.
- **Orders:** WO-216 to WO-220 filed (§5); none amended.

## 10. Goal alignment and cost

The mission contribution is the same as on 2026-10-13: the operator's fork
carrying its own work into DotLn-Angular. This pass removes what was
stopping core from getting there: the cycle cost that three orders paid in
repairs, gate runs and boarded findings, and the prose rules that let roles
misread their process three times in a week.

Traps named before the material choices, and what was done about each:

- **Shifting the burden.** Each comment is answered with a check or a
  recorded reason, never a new reminder for the operator (§4).
- **Rule beating.** WO-216's handoff stands on the order's own Preflight
  suites, which the order names; an order naming none would hand off on
  the structural phase alone, so the gap is the next pass's reading of the
  Preflight lines it files, and the complete gate still runs at final review.
- **Seeking the wrong goal.** Five machinery and cleanup orders ahead of
  the focus is the meter's machinery-share signal made worse on purpose:
  the rows show the gate failing on its own bookkeeping, and the operator
  directed the boarded rows resolved; the NoOp in §8 records the reversal
  condition and the interleaving the operator may choose.
- **Drift.** The 2026-10-13 order-size rule and the serial choice stay;
  neither condition has occurred (§3).
- **Success to the successful.** WO-096 moves up on the operator's word,
  not on its own age.
- **Policy resistance.** The withdrawn expansion is the record of what the
  gate's reuse resists; WO-216 carries nothing between runs and changes
  what runs first, not what is remembered.
- **Naive interventionism.** Five orders, each on the operator's direction
  and the record's rows; three drafts declined before filing; six candidates and
  the ideation's remaining rows deferred with reopening observations (§7,
  §8); this pass spawned no reviewer of its own package.
- **Commons and escalation.** Four admissions of twenty; no descendants.

Cost of this pass is in §12.

## 11. Document ceilings

Every product document's ceiling is set in `docs/control/doc-ceilings.json`
to its non-exempt bytes measured by `node scripts/docs-check.mjs` after this
pass's write-backs, plus one tenth, with this section as the decision.
Since the 2026-10-13 pass, products 02, 03, 05, 07, 09 and 12 grew through
the three closes' write-backs (product 07 by about 17,000 bytes, mostly
WO-210's and WO-213's) and this pass's few sentences; the rest are
unchanged.

| Document | Measured | Ceiling |
| --- | --- | --- |
| 00-vision.md | 28,275 | 31,103 |
| 01-principles.md | 9,462 | 10,409 |
| 02-domain-model.md | 149,912 | 164,904 |
| 03-architecture.md | 184,022 | 202,425 |
| 04-interfaces.md | 60,516 | 66,568 |
| 05-pattern-library.md | 135,946 | 149,541 |
| 06-roadmap.md (non-exempt) | 41,953 | 46,149 |
| 07-execution-guide.md | 210,052 | 231,058 |
| 08-publication-compiler.md | 24,867 | 27,354 |
| 09-audit-resilience-privacy.md | 52,735 | 58,009 |
| 10-ir-compatibility.md | 25,787 | 28,366 |
| 11-proteino.md | 2,058 | 2,264 |
| 11-protino.md | 30,626 | 33,689 |
| 12-workstream-application.md | 23,572 | 25,930 |
| 13-uifa-roles.md | 27,015 | 29,717 |

No order carries a byte bound. The roadmap's generated release table was
refreshed inside its exempt block (`npm run release -- list --markdown
--write`; 168 tags).

## 12. Validation and independent judgment

(Completed after the checks and the refutation receipt; see the end of this
section.)

