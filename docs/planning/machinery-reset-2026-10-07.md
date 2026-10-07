# Machinery reset: why orders take a day and never pass, and what changes (2026-10-07)

A planning pass opened by the operator's `planning:` dispatch of 2026-10-07
on `main` at `bd437eb2`, with four mid-turn messages. The dispatch and the
messages are captured verbatim in ignored intake
(`docs/intake/notes/2026-10-07-machinery-reset-planning.md`, SHA-256
`e181640347ef46d8e1a66bbb3f9e2d9fbd9ed18feb7b9278c082a931cbedfa14`); this
document paraphrases them. Planner synthesis over the control record, the
gate index, the decisions of the six orders active since the last planning
receipt, and the role sources; the clean-room screen found no stop condition.

## 1. What was asked

Paraphrased from the dispatch and the four messages:

1. The last six to eight orders take more than a day each, fail
   verification and final review repeatedly, and executors get the basic
   order of operations wrong: documents are updated after the gate that
   judged them, so the gate is lost. Fix the machinery so this cannot
   recur, and the order that stops the lost 30-minute gates runs next;
   the order of everything else is the planner's.
2. Orders are to carry everything an executor needs, with no gap left for
   the executor to fill: every queued order is to be gone over, new orders
   filed for missing dependencies, and each written so that it can be run
   step by step.
3. The adversary was asked for once, at the end of implementation, beside
   one principal-engineer improver; the planner is to say how that became
   an adversary at the executor's, the repair's, the verifier's and the
   reviewer's completions.
4. Two orders cost about forty hours building readers over natural
   language and Markdown until not doing that was found to be the answer;
   the planner is to find them in the record.
5. The planner is to read the failure evidence the record already holds
   (WO-172 built the feed for that) without being told.
6. The subagent cap of twenty may be exceeded in this pass.

The last planning receipt is `2026-10-03-planning-90bdcd90e4af7f16-040`.
Entry (`npm run plan -- start machinery-reset`) counted, since
2026-10-03T16:26:39Z: 16 failed verifications, 2 failed final reviews, 19
repairs, 5 orders made ready, 5 failed first verifications, 25 corrections,
2 operator overrides, 11 execution amendments, 24 long phases, 28 repeated
gate runs, 12 interventions; conditions holding: 7.

## 2. The record since the last pass

### 2.1 Hours per order

From `npm run resume -- times` (activation to the last passing final
review, local checkpoint refs; second precision):

| Order | Activated | Hours | Verifications | Repairs |
| --- | --- | --- | --- | --- |
| WO-185 | 2026-10-02 | 47.7 | 4 | 3 |
| WO-112 | 2026-10-05 | 29.9 | 7 | 6 |
| WO-184 | 2026-10-02 | 24.9 | 2 | 1 |
| WO-195 | 2026-10-03 | 23.9 | 2 | 1 |
| WO-123 | 2026-10-05 | 22.5 | 5 | 4 |
| WO-186 | 2026-10-05 | 20.3 | 3 | 2 |
| WO-187 | 2026-10-05 | 17.4 | 5 | 4 |

The 78 orders closed between 2026-09-15 and 2026-10-01 took 1 to 5 hours
with one or two verifications each, with seven exceptions above 10 hours
(WO-052, WO-085, WO-115, WO-122, WO-132, WO-157, WO-172). Every order
activated since 2026-10-02 took more than 17 hours, and `npm run meta`'s
process-health line on 2026-10-07 reads: first verification failed in 8 of
the last 8 closed orders.

### 2.2 Every failed report, by cause

Twenty reports failed across the six orders (WO-185's VER-001 and VER-002
fall before the window's opening timestamp and are included because the
order closed inside it):

| Order | Failed reports | What failed | Cause class |
| --- | --- | --- | --- |
| WO-123 | VER-001 to VER-004 | criterion 5 each time: ordinary issue wording classed as new by a hand-built English predicate grammar; repaired four times by adding phrases; D037 replaced the grammar with a persisted judgment supplied as input | prose-parsing criterion (planning) |
| WO-187 | VER-001 to VER-004 | criteria 2 and 4 each time: three readers inferring records from free-form Markdown (the known-issues section, final-review findings, the self-review line); each repair opened a new silent loss; VER-004 F1: "no rule set over free-form prose has held"; repaired by exact structured formats | prose-parsing criteria (planning) |
| WO-112 | VER-001 | criterion 1: the triage verdict was fixed by scenario identity, because the order was planned as evidence-only while the designs it cited assigned it the intake and triage episodes (D018) | no-code order (planning) |
| WO-112 | VER-002 to VER-006 | every criterion met each time; the verdict failed on two to four new in-surface defects found by the attack or the fresh adversary in the repair just made; closed by two operator overrides (VER-007, FINAL-001) | verdict not bound to the criteria (WO-187's route rule) |
| WO-185 | FINAL-001 | all eight criteria met; three reproduced in-surface findings routed blocking | verdict not bound to the criteria |
| WO-185 | VER-001, VER-002 | criterion 3 (a detached descendant escaped the sweep; the repair adopted processes the task never started) | a defect in a large machinery order |
| WO-186 | VER-001, FINAL-001 | criterion 3 (the reuse claim check answered with main's row after a failed run) | a defect in a large machinery order |
| WO-195 | VER-001 | criterion 3 (one stdout line bypassed the retained report) | a defect in a small machinery order |

Fifteen of the twenty are planning or policy defects this pass removes:
eight prose-parsing criteria, six verdicts that failed with every criterion
met, one order planned without the code its criteria needed. The other
five are real defects in machinery orders, four of them in the two largest
(WO-185, eight criteria over the host guard; WO-186, eleven over the runner).

### 2.3 The lost gates

The review gate (`npm test -- --review`) ran 1,841 to 1,863 s in each of
WO-112's final attempts; the `vertical` task alone is 840 to 850 s. The
record of gates lost to procedure, each a full rerun:

- WO-112 D049: the executor ran the review gate, then the formatter; the
  whitespace fix changed the code identity; 1,863 s lost. D049 lists the
  same loss in WO-164, WO-148, WO-146 and WO-158, and says that a lesson
  written into an order's receipt has failed five times.
- WO-112 D057 and D058: the executor wrote two of its own records during
  the review gate, which forbids every repository write; the passing
  1,861 s run could not qualify and was run again.
- WO-112 D063 and WO-187 FINAL-001: the reviewer spawned its adversary
  and started the review gate a minute later; the live gate refused every
  probe; 248,326 tokens and 18 minutes returned source inferences.
- 28 product-gate rows at an identity already green since the last pass,
  22 of them WO-186's own.

Why the rule did not hold: the gate order is one clause inside a
2,000-character sentence of the executor role (`contributor.ts` line 96);
the `format` row is a document-gate row, so a product gate never runs
Prettier; the review selection is always `forced-fresh`
(`scripts/test-runner.mjs` line 2377), so the verifier's and reviewer's
gates rerun bytes the executor's passing row already covers; and the
mechanical guard D049 asked for is boarded in two register rows with no
order (FUP-3799fb396f911d8a, FUP-117dc832458dc6e2).

### 2.4 The corrections

Twenty-five correction records in the window. Read by their `misread` and
`meant` fields, they fall into: role procedure applied wrongly or not at
all (D049, D057, D058, D063, WO-186 D021 and D039, WO-187 D050 and D054,
WO-185 D022 and D029, WO-184 D040 to D042: 13); measurement and provenance
slips (WO-186 D010, D016 and D022, WO-187 D018, WO-123 D028, WO-184 D036:
6); the operator's steering misread (WO-112 D016, WO-186 D020, WO-184 D041:
3); planning (WO-112 D018, WO-123 D018: 2); repair-internal (WO-185 D009,
D012, D014 and D024: 4, overlapping the first class). The first class is
what a numbered procedure answers; the second is what a shorter role text
answers.

### 2.5 Conditions that hold

`npm run plan -- conditions` on 2026-10-07 at 05:46Z: seven hold.
`gate-task:target-publish` 356.405 s against a median of 17.803 s,
`gate-task:worktree-integration` 288.470 s against 125.581 s and
`gate-task:harness-fixtures` 399.784 s against 261.423 s go to WO-197.
`coldStartBytes.executor` 29,777 against 29,246 goes to WO-196.
`order-evidence` (1.06 and 2.77 MB in the last two closed orders) and
`week-evidence` (16.3 MB this week) are the evidence-volume rows
FUP-8a4e201d861208ad and FUP-be1103fbfdd14653, declined again in §12 with
the reason the operator gave in September (pruning is not authorized; the
growth follows the number of verifications, which §3 cuts). `release-tags`
(7 local annotated tags absent from the generated table, WO-086 D006) is
recorded open in §11; it is a release-close bookkeeping row and no order's
subject.

## 3. The machinery: what breaks and the one order that fixes it

Four causes, from §2:

1. **Nothing mechanical orders the handoff.** The sequence (format, document
   gate, product gate, records, completion) exists only as prose. WO-196
   adds the `format` row to the product and review gates' preflight stage,
   which already exists in the runner and already suppresses every later
   task on failure; the gate refuses to start on an unformatted file within
   seconds and prints the repair. Product 07 §Discipline now states the
   sequence in one bullet, and WO-196 puts it at the head of every role as
   numbered steps.
2. **A review gate at an unchanged identity reruns everything.** WO-186
   composed the plain selection from passing task rows at one identity and
   left the review selection `forced-fresh`. Nothing reads the mode
   (grep over `scripts/resume.mjs`, `scripts/release.mjs`,
   `scripts/lib/release-preparation.mjs`). WO-196 composes the review
   selection by the same rule; `--again` keeps forcing fresh.
3. **The verdict is not bound to the criteria.** WO-187 made a defect in
   the declared surfaces blocking whether or not a criterion fails; with a
   fresh attacker at each verification, every repair opened a new surface
   and WO-112 ran seven verifications with every criterion met from the
   second on. Product 07 §Verification review and attack now binds
   `blocking` to an unmet criterion or a regression against `main`; every
   other defect is a follow-up with reproduction, fixed within the Boy
   Scout bound at the next repair if there is one. Re-verification ends
   when the criteria hold. Final review is acceptance.
4. **The role text is a wall.** Executor 22,904 bytes in 73 lines, the
   longest 2,017 characters; the five-refusals paragraph in CLAUDE.md and
   again in each skill; the installed executor root over its ceiling. WO-196
   restructures every role into numbered steps followed by the unchanged
   rules, removes the duplicate paragraph, and brings each root under its
   ceiling with no new acceptance.

WO-196 runs next and alone, as the operator directed on 2026-10-07: it
changes the gate every order runs and the text every role reads.

## 4. Gates: the slow tasks, and a worktree's gate after a merge

Three gate tasks crossed their reopening thresholds (§2.5). The 2026-10-02
pass measured that selecting suites by what a change affects is not the
lever (99% median share of task time still affected) and that reruns and
three slow cases were; WO-186 took those. Since then three other tasks grew,
one of them twentyfold. WO-197 reads the per-case durations WO-186 put on
the rows, names the case and the commit range of each growth, repairs each
at its cause with a bound assertion, and records the vertical suite's three
slowest cases with what each waits on. It is the machinery lane of the first
pair after WO-196, beside WO-199, and touches no file WO-199 touches.

### 4.1 A passing suite that fails after a merge into main

The operator reported, more than once, a suite that passed in a worktree
and failed the moment `main` was merged. Git worktrees share tags,
branches and `refs/dotln/`, so anything that reads them sees a merge
instantly. The record holds one documented instance: WO-179 D012
(2026-10-01), the review selection taken against the moving
`origin/main` tip, which WO-186 answered with the merge base on
2026-10-05. At `bd437eb2` the six readers of shared state are bounded
(`check-surfaces --local` reads HEAD's ancestors; the index and the
release history report newer tags without refusing; the followups and
plan-subject helpers use the merge base; `contributions.mjs` uses a
two-dot range; the gate-reuse helper reads main's index only for reuse).
The instance the operator saw cannot be found from main's records
because a worktree's gate rows leave with the worktree at release close
and nothing on a row says what the shared refs were. WO-198 records the
shared refs on every row, prints which of them moved when a task fails,
and runs a worktree's document and plain gates across a sibling merge
and tag in a fixture; a task that flips there is repaired at its cause in
that order. The next live flip is then attributable in one line, and the
operator is asked to name the suite and the failing cases when it
happens.

## 5. How one adversary became four

The operator's note of 2026-10-02 (item 6) asked for one adversarial
sub-agent and one principal-engineer improver at the end of implementation.
The 2026-10-02 pass §3 read thirteen failed final reviews, found fourteen of
eighteen blocking findings already present in the verified subject, and
answered with WO-187: verification became attack, implementation review and
a fresh adversary; the executor got one adversary before each completion,
repairs included; final review kept every duty, and reviewers spawned their
own under the fan-out rule (WO-112 FINAL-001). The improver was folded into
the executor's one worker "as an improver too". At WO-187's final review
the operator confirmed the executor's and repair's adversary and boarded the
separate improver for planning (D051).

The result in the record: WO-112 paid one worker per completion and per
verification, seven verifications, 175,796 to 248,326 tokens and 11 to 18
minutes each; its escape count at final review was two, WO-187's three. The
cost multiplied and the escapes did not fall.

Decision: product 07 now says what the operator asked for. Two workers,
adversary and improver, run once before `implementation-ready` and not
before `repair-complete`; the verifier judges with its own probes and the
two reports and spawns only to reproduce one named claim; final review
spawns nothing by rule. WO-196 regenerates the role sentences to match.
Reopen: an order's escape count rises over three consecutive orders after
WO-196.

## 6. The two forty-hour orders

The operator's description was accurate. WO-123 (22.5 h, four repairs of
criterion 5) built an English predicate grammar to class issue text and
replaced it with a persisted judgment in D037. WO-187 (17.4 h, four repairs
of criteria 2 and 4) built three readers over free-form Markdown and
replaced them with exact structured formats in VER-004's repair. Together
39.9 hours. Both criteria were written by planning passes (2026-10-02).

Decision: product 07 §Operator-opened planning pass now carries the screen:
no criterion requires a deterministic reading of natural language or
free-form Markdown; a classification of wording is a persisted judgment
supplied as input; a record in a document is a marker block holding JSON or
a typed field. Every queued order was screened in this pass (§8). The
known-issues reader WO-187 left (`scripts/lib/verification-briefing.mjs`)
stays: VER-005 passed its bounded form; reopen when it drops a section of an
order filed after this pass.

## 7. What planning did wrong, and what changes in how orders are written

- WO-112 was planned as "adds no code" while the designs it cited assigned
  it model episodes (D018). The screen in §6 and product 07 now applies to
  every order that claims no code.
- Orders are written as narrative contracts: objective, gap, design,
  criteria. None named the file, the function and the command for each
  step, so executors read source to find out where the order lands and
  guessed where it did not say (WO-112 D016 lists fifteen such guesses).
  Every queued order now carries an `Execution plan` (§8), and product 07
  requires one.
- The planner did not read the failure feed row by row before the operator
  asked. §2.2 is that reading; the feed's rows carry report paths and
  judges but not the failing criterion or the finding's class, so the
  cause pattern (every criterion met, verdict failed) is visible only in
  the reports. Reopen for a later pass: a row that names the failing
  criteria and the blocking findings' classes, so the pattern is one page.
- Passes filed eleven and twelve orders at once (2026-10-02) and judged
  them for goal alignment, not for executability. This pass files two
  orders and amends the queue.

## 8. Every queued order, gone over

Filled below from the per-order research (eight read-only workers, one per
four orders, each verifying every cited path against `main` at
`bd437eb2`). Each order gains a `Track` line where it lacked one, a
`Known issues and carry-ins` section where it lacked one, an `Execution
plan` with the verified file, function and command of each step, a handoff
sequence, and its stale statements corrected in place. Steps that depend on
an unmerged order say so and name what will be known then.

What the research found across the thirty-two orders, and what the pass did:

| Finding | Orders | What changed |
| --- | --- | --- |
| Byte bounds against headroom other orders had consumed, or a product 07 "9 bytes until the fold" that closed on 2026-09-19 | every order with a product write-back; product 03 sat at 0 headroom with WO-074 and WO-075 each promising 300 to 400 bytes | every bound removed; the ceilings reset (§10); the stale WO-167 dependency reasons rewritten |
| Closed orders named as co-writers, dependencies or blockers (WO-061, WO-066, WO-086, WO-087, WO-112, WO-116, WO-117, WO-123, WO-124, WO-167, WO-173, WO-172, WO-184, WO-187) | 29 orders | corrected in place |
| A criterion that reads prose or free-form Markdown (the WO-123 and WO-187 pattern) | WO-074, WO-077, WO-078, WO-080, WO-081, WO-082, WO-083, WO-088, WO-089, WO-093, WO-096, WO-097, WO-098, WO-113, WO-118, WO-183, WO-188, WO-189, WO-190, WO-191, WO-192, WO-193, WO-194, WO-014 | each replaced by a typed input: a JSON block between markers, a typed field, a persisted judgment, a JSON record the test asserts on |
| Planned as no code or fixtures while a criterion needs capability the tree lacks (the WO-112 pattern) | WO-118 (D060, D065 recovery), WO-082 (four of six demonstrations), WO-094 (a Safety criterion that passed vacuously), WO-095 (a reactor change called conditional), WO-183 (a model episode credited to a double), WO-014 (no channel observes approval requests) | WO-199 filed and made WO-118's dependency; WO-082 and WO-014 narrowed to what the tree supplies with the rest as candidates; WO-094 given its predicate; WO-095's live episode planned; WO-183's adapter named |
| Design questions the executor would have had to answer | every order (the workers listed 2 to 5 each) | a default recorded in the order with its reopening condition |
| Items already done elsewhere | WO-188 items 2 and 6 (WO-195), item 22 (WO-196) | recorded as not reproduced or moved |
| A duty no order named: a role-text change needs a chained role oracle fixture and a process-debt source entry | WO-073, WO-097, WO-098, WO-188, WO-191, WO-192, and WO-196 itself | the step written into each |
| Lane pairs sharing a source file | the 2026-10-02 pairs and this pass's first cut | re-cut on the workers' primary-surface lists (§9) |

Each order's `Known issues and carry-ins` section names what was stale and
what the pass decided, and its `Execution plan` ends with the handoff
sequence of §3.

## 9. The sequence

WO-196 first and alone. Then six pairs, delivery lane first, cut on the
primary source files the research recorded so that no pair shares a
script, package or test file: WO-199 with WO-197; WO-074 with WO-188;
WO-075 with WO-190; WO-073 with WO-198; WO-077 with WO-189; WO-078 with
WO-191. Edges respected inside the lane: WO-198 and WO-188 follow WO-196
(the runner and the role source), WO-191 follows WO-188 (item 24), WO-078
follows WO-077. WO-072 runs alone (every machinery order shares
`resume.mjs`, `release.mjs` or `worktree.mjs` with it), then WO-076,
WO-118 (after WO-199, WO-075 and WO-076) and the rest one at a time in
their former order, with WO-089 before WO-088 and WO-083 last: it needs
the operator's fork on the operator's own machine, where DotLn may not be
installed for some time, and nothing before it needs that. WO-088's gap
was absent for a third pass; its own assumption says to take it out, and
the pass leaves that `withdraw` to the operator. The operator said the
order of everything but WO-196 is the planner's.

## 10. Document ceilings

Product 07 measured 175,881 non-exempt bytes against its 168,083 ceiling at
entry (7,798 over, advisory through WO-187 D013), and 178,557 after this
pass's edits (+2,676: the verdict and worker rules, the handoff sequence,
the planning screens, with the briefing-reader paragraph condensed by 1,300
bytes). The 2026-10-05 note asked the next pass to reset the ceiling from
the write-backs still queued. The operator directed during this pass that byte
figures are not theirs to settle: orders promised bytes against headroom
other orders had consumed by the time they ran (product 03 sat at its
ceiling exactly while WO-074 and WO-075 each promised 300 to 400 bytes
"against 3,284 bytes of headroom on 2026-09-28"), and reviews then asked
the operator to trim or raise. Decision: ceilings are planning's alone.
Every product document's ceiling is set in `docs/control/doc-ceilings.json`
to its measured non-exempt bytes plus one tenth, with this section as the
decision; every byte bound was removed from every queued order; product
07's planning section states the rule; WO-196 criterion 8 makes an
overrun an advisory the next pass reads instead of a gate failure; and the
advisory reference on product 07 is removed because the text fits. The
next pass re-measures and resets. WO-187 D013's optimization row stays
open for a pass that wants to shrink 07.

### 10.1 Ceilings set

| Document | Measured | Ceiling |
| --- | --- | --- |
| 00-vision.md | 28,041 | 30,846 |
| 01-principles.md | 9,462 | 10,409 |
| 02-domain-model.md | 149,450 | 164,395 |
| 03-architecture.md | 176,807 | 194,488 |
| 04-interfaces.md | 60,516 | 66,568 |
| 05-pattern-library.md | 135,256 | 148,782 |
| 06-roadmap.md (non-exempt) | 41,309 | 45,440 |
| 07-execution-guide.md | 178,811 | 196,693 |
| 08-publication-compiler.md | 22,633 | 24,897 |
| 09-audit-resilience-privacy.md | 51,569 | 56,726 |
| 10-ir-compatibility.md | 25,665 | 28,232 |
| 11-proteino.md | 2,058 | 2,264 |
| 11-protino.md | 30,626 | 33,689 |
| 12-workstream-application.md | 18,327 | 20,160 |
| 13-uifa-roles.md | 26,964 | 29,661 |

Measured by `node scripts/docs-check.mjs` on 2026-10-07 (07 after this
pass's edits).

## 11. Register rows read

Disposed through `npm run plan -- followups --apply` in this pass:
allocated to WO-196: FUP-3799fb396f911d8a (D049), FUP-117dc832458dc6e2
(D057), FUP-ac99e09feec05a3b (D063), FUP-f4bf5a4ada0c1420 (D051, the
improver), FUP-8ce4b4b0104ba41b (the executor root's bytes),
FUP-3f9d788f4d8c89ac (self-review forms); allocated to WO-197:
FUP-331423b3559f5cfa (WO-174 D021), FUP-e96221b106cd136a (the three
gate-task conditions; its plain-gate part stays declined); allocated to
WO-199: FUP-627ec3088bb86e62 (D065), FUP-5f8a48126bb022be (D060),
FUP-60dab7dee5b4073d (D066); deferred: FUP-5d48c4f3c2a3730d (D061),
FUP-8a4e201d861208ad and FUP-be1103fbfdd14653 (evidence volume);
settled: FUP-3d2f14d1de17c607 (D018, the no-code screen); declined:
FUP-0e62f2c7cfd0ed54 (a bound on the advisory route). Read and left as
they are: FUP-0a7c93eed06727ce (optimize 07), FUP-0c10689747f83675,
FUP-1315c82ef74fb832 (WO-187's six low items), FUP-84bc6f15abd1e45f
(WO-189's). The workers' per-order `followups --touching` reads are the
orders' own duty at activation; this pass read the rows its two new
machinery orders touch.

## 12. Declined, with reopening conditions

- **A `resume qualify` command that runs the whole handoff.** The sequence
  is three commands the numbered procedure lists, and the runner's preflight
  makes the one step that loses gates mechanical; a fourth command is a
  surface to maintain. Reopen: a gate is lost to formatting or to a record
  write after WO-196.
- **Refusing every spawn during a live gate.** A read-only worker may
  inspect a gate; the advisory plus the step order answers D063. Reopen: a
  probing worker is spawned during a gate after WO-196.
- **A watcher that detects record writes during a review gate (D057's
  follow-up).** The procedure leaves nothing to write during the gate and
  the Claude hook already refuses; a Codex watcher would need its own
  fixture family. Reopen: a record write during a review gate after WO-196.
- **Splitting WO-188 into several orders.** Its items are small and
  recorded; it waits behind the delivery lane now rather than beside it.
  Reopen: an item of WO-188 blocks a delivery order.
- **Pruning evidence (FUP-8a4e201d861208ad, FUP-be1103fbfdd14653).** The
  week's 16.3 MB and the last two orders' 1.06 and 2.77 MB follow seven
  and five verifications; §3 cuts the count. Pruning is not authorized.
  Reopen: a week after WO-196 adds more than 10 MB with orders that passed
  verification in at most two attempts.
- **Changing the known-issues reader to a marker block.** See §6.
- **Lane packing and the shell suites' copying.** Declined with reopening
  tests by the 2026-10-02 pass §15; unchanged.
- **WO-082's four unsupplied demonstrations, WO-014's phases 2 and 3,
  WO-088 as an order.** Narrowed or left for the operator's withdrawal;
  the map's candidates section holds each with its reopening condition.
- **A Codex record-write watcher, a per-worktree tag namespace, forbidding
  merges while a gate runs.** Declined in WO-196's and WO-198's Design.

## 13. Goal alignment

- **Mission and critical path.** The delivery lane (WO-074 onward to WO-118)
  has not moved since 2026-10-01; WO-196 is the shortest route to orders
  that pass in hours again, WO-197 removes about 680 s from every review
  gate, WO-199 unblocks WO-118's criterion 2, and WO-198 turns the next
  merge-time failure into a one-line cause.
- **Policy resistance and fixes that fail.** The lesson-in-a-receipt failed
  five times (D049); the preflight is in the runner, not in text. The
  adversary-everywhere rule did not cut escapes; the criteria-bound verdict
  removes the loop it created.
- **Tragedy of the commons and escalation.** Each verification cost one
  worker and one 31-minute gate; this pass removes two workers per order
  and two fresh gates per order. No new gate, agent or ritual is added.
- **Drift to low performance.** The verdict standard is unchanged for the
  criteria; what changes is that in-surface defects outside them are
  boarded with reproduction, as product 07 always allowed for items
  outside the surfaces.
- **Success to the successful.** The review-everything rule had investment
  (WO-187); the record, not the investment, decides.
- **Shifting the burden.** Two overrides closed WO-112; the criteria-bound
  verdict and the numbered procedure remove the reason for the next one.
- **Rule beating and seeking the wrong goal.** A composed review row can
  pass bytes that never ran only if the identity misses a byte; WO-186
  made the identity cover untracked code; WO-196's known issue names the
  reopening test.
- **Naive Interventionism.** The runner's preflight stage, the reuse rule
  and the role compiler all exist; WO-196 extends each by one case.
- **NoOp.** Leaving the machinery as it is leaves every order at 17 to 48
  hours and the delivery lane stopped.

## 14. What would reverse these decisions

- An order after WO-196 loses a gate to formatting or a record write.
- Three consecutive orders after WO-196 show rising escape counts at final
  review.
- A composed review row passes at an identity where `--again` fails.
- A queued order's execution plan names a file or function that is not
  there when the order activates.

## 15. Independent review

One fresh `dotln-worker` refuter judged the committed subject (the three
new orders, the thirty-two amended ones and the sequence) through
`npm run plan -- refute`; its receipt and dispositions are recorded under
`docs/planning/refutations/` and summarized here once filed.
