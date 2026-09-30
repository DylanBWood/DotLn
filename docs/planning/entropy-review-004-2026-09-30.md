# REVIEW-004 paid for and consumed — seven findings accepted, two orders filed, two declined on cost (2026-09-30)

Planning pass opened on `main` at `feb7a92e` (WO-066 merged and published as
v0.57.0) on branch `planning/2026-09-30-entropy-review-004`. Document-only.
The operator's dispatch was the bare phrase `planning: entropy reducer`,
captured verbatim in ignored intake
(`docs/intake/notes/2026-09-30-entropy-review-004-planning.md`, SHA-256
`13632879f91b792a59789a015da03053e5db65babc697a1e9286c65ddb373c67`),
received at 2026-09-30T13:05Z. No other operator text arrived.

Labels: **observed** (a command or file on this machine showed it),
**inferred** (stated with its evidence), **unknown**. Dates are UTC.

## 1. What was asked, and the subject

The phrase's procedure is product 07 §Operator-opened planning pass: open
with `npm run entropy -- subject`, consume before producing, dispose every
surviving finding and packet in this same pass, and weigh, sequence or
decline the accepted ones here. The review is the pass's subject, not the
register's existing rows.

Observed at entry:

- `npm run entropy -- subject` returned `review`: REVIEW-003 was the latest
  filed review and none was both refuted and undisposed. `plan start`
  printed 27 orders passed through final review since REVIEW-003 ended on
  2026-09-25.
- `main` clean and in sync with `origin/main`; one worktree; the index read
  "between work orders"; eleven sequence entries were closed.
- `plan start` also printed the failures instrument's counts since receipt
  034 (55 items: nine failed verifications, nine repairs, 26 corrections,
  ten amendments, one waiver) and the register: 783 entries, 194 pending
  (17 open, 4 needs-review, 33 untriaged, 140 deferred).
- The meter's advisory: `sequenceBytes` 13,516 against 8,192, the one
  budget breach in the process-health line.
- Process cost at entry: 80,895 tokens at dispatch scope, source
  `claude-transcript-message-usage`; dollars unknown. Subagents: none used,
  cap twenty; the plan was one background planning refuter and at most two
  read-only research agents if a finding needed them. None was needed.

## 2. The review and its refutation (observed from the receipts)

- **Reviewer.** [REVIEW-004](../instance/entropy-reducer/runs/REVIEW-004.md):
  `entropy-reducer@1`, `claude-opus-5-5` at `xhigh` on claude-code 2.1.285
  through `claude-cli-print`, recorded from the invocation; effective model
  and effort unknown. Against the explicit commit `feb7a92e`, so the
  working tree's drift during the episode is recorded and not refused.
  2,216 s, 145 turns, USD 11.71, zero denied tool calls, the frozen copy's
  inventory unchanged. REVIEW-003 took 1,089 s and USD 6.99; the reviewer
  reports 384 s of this episode in one `npm test` whose four failures were
  artifacts of its temporary root (ER4-007). The rest of the difference is
  unknown.
- **Refuter.** [REFUTATION-005](../instance/entropy-reducer/runs/REFUTATION-005.md),
  the same pin: 700 s, 44 turns, USD 2.08. It received the seven
  reproduction commands and nothing of the review's reasoning. Measured
  denominator seven, all selected; none by inspection. All seven survived,
  each with a second measurement and its stated limit.
- **Filing defect met.** `entropy refutation-receipt` wrote the receipt and
  its control event, then exited 1 with `ENOTEMPTY`: a drill had left
  read-only fixture directories in the frozen copy and the removal could
  not enter them. `npm run entropy -- check` was green and the pending
  dispatch cleared; six leftover files (24 KB) were removed by hand after a
  `chmod`. WO-175 carries it as observed gap 4 and criterion 8.

The findings, in the reviewer's order of constraint:

| Id      | Severity | Altitude | What was measured                                                                                                                                                                                                                         |
| ------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ER4-001 | major    | 5        | the gate's code identity excludes `docs/`, `.claude/`, `.agents/` and root Markdown; a kernel case reads product 02 and the console product suite read 456 excluded paths; one bold term changed, identity unchanged, the kernel case red |
| ER4-002 | major    | 5        | `harness-fixtures` does not declare `scripts/harness.mjs`; a mutant of its `evidence --wait` exit code selects two suites, passes both, and fails the unselected case                                                                       |
| ER4-003 | major    | 6        | 1,134 prose reopening conditions against one predicate; three numeric conditions crossed with nothing evaluating them                                                                                                                       |
| ER4-004 | minor    | 8        | the one predicate (WO-150-D003) names a metric order rows do not carry, so the meter's candidate count is zero whatever the state                                                                                                           |
| ER4-005 | minor    | 10       | docs-check parses 1,262 Markdown files (27.5 MB) a run, 6.6 s of 8.6 s; 9.3 s of a 17.2 s document gate; the plan check at 4.7 s                                                                                                            |
| ER4-006 | minor    | 10       | 139 authority revisions hold 27 distinct transcripts; 76 of 82 successors repeat their predecessor; 5,400,240 repeated bytes                                                                                                                |
| ER4-007 | minor    | 5        | the launched worker's temporary root is outside its copy and unobserved; inside the copy, `test-portfolio` fails 2 of 3 as a nested checkout                                                                                                |

Four packets: `gate-identity-covers-suite-inputs`,
`machinery-selection-follows-imports`,
`reopen-conditions-evaluated-at-planning-entry` and
`history-independent-document-checks`, each with corroborating and
dissenting references. The pass read the dissent as constraints: WO-173
D003's reason for excluding documentation from the key, WO-132's selection
by declared sources, the 2026-09-19 rule that whoever observes a condition
records it, and the operator's decision to leave `fastGateMs` unset.

## 3. Re-measurement on the operator's host (observed, this pass)

The review ran in a frozen copy on the dispatch host, which is the
operator's machine. These figures are from the checkout itself at
`feb7a92e`, timed while the refutation worker ran (load averages 3.6, 2.9,
3.0), so the timings are upper readings.

| Finding | This pass                                                                                                                                                                                                                                  | Holds |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| ER4-001 | the exclusion is at `gate-evidence.mjs` line 679; the runner gives `-docs` tasks to skeleton and console only; the drill was not repeated here (the refuter repeated it)                                                                  | yes   |
| ER4-002 | the runner's own table: `harness-fixtures` declares 27 sources and not `scripts/harness.mjs`, which only `harness` declares; `scripts/test-harness.mjs` names it on 36 lines. Also declared by no suite: `scripts/docs-check.mjs`, `scripts/lib/handoff-ledger.mjs`, `scripts/lib/plan-subject.mjs` | yes   |
| ER4-003 | the plan check 4.78 and 4.74 s; five release tags newer than the generated table; WO-172 holds 1,808,181 tracked bytes under `docs/evidence`, 1,354,491 as distinct blobs; 1,134 prose conditions                                          | yes   |
| ER4-004 | the predicate at WO-150 decisions line 137; the lookup at `meta.mjs` line 1735; the executor's cold start 26,903 bytes; the health line "0 reopen candidates"                                                                              | yes   |
| ER4-005 | docs-check alone 9.29 s; 1,258 tracked Markdown files under `docs/`; `scripts/lib/plan-continuation.mjs` imports the Markdown parser                                                                                                       | yes   |
| ER4-006 | 139 revisions, 27 blobs, 76 of 82, 5,400,240 bytes; `docs/evidence` holds 157,912,349 tracked bytes and 147,192,532 as distinct blobs                                                                                                      | yes   |
| ER4-007 | zero mentions of `TMPDIR` in the dispatch, the command and the transport; the filing defect of §2                                                                                                                                          | yes   |

One correction to the review's account. ER4-003 says WO-172's evidence
bytes crossed their threshold "with no record of the observation". WO-172's
final review did record it, on the sibling row FUP-5e2f4ce16f9e8be1, which
it opened for planning on 2026-09-29. The row that carries the condition
(FUP-8a4e201d861208ad) was untouched, which is the finding's point: the
observation reached a row only because a reviewer happened to measure.

## 4. Dispositions

Recorded with `npm run entropy -- dispose REVIEW-004 <id> <disposition>
'<reason>'`. `npm run entropy -- check` afterwards: status `ok`, 24
dispositions, nine packets, no interrupted filing. The generated rows are
[`entropy-reviews/REVIEW-004.md`](entropy-reviews/REVIEW-004.md).

| Id                                              | Kind    | Disposition | Decision                                                                                       |
| ----------------------------------------------- | ------- | ----------- | ---------------------------------------------------------------------------------------------- |
| ER4-001                                         | finding | accept      | WO-174                                                                                         |
| ER4-002                                         | finding | accept      | WO-174                                                                                         |
| ER4-003                                         | finding | accept      | the three crossed conditions acted on here (§5.3); the mechanism is WO-175                     |
| ER4-004                                         | finding | accept      | WO-175                                                                                         |
| ER4-005                                         | finding | accept      | true; declined as an order on cost (§5.4)                                                      |
| ER4-006                                         | finding | accept      | true; declined as an order on cost (§5.4)                                                      |
| ER4-007                                         | finding | accept      | WO-175                                                                                         |
| `gate-identity-covers-suite-inputs`             | packet  | accept      | filed; WO-174's design record                                                                  |
| `machinery-selection-follows-imports`           | packet  | accept      | filed; WO-174's design record                                                                  |
| `reopen-conditions-evaluated-at-planning-entry` | packet  | accept      | filed; WO-175's design record                                                                  |
| `history-independent-document-checks`           | packet  | defer       | not filed; it stays in the receipt until ER4-005's condition occurs                            |

Every finding is accepted because every one is true and measured twice. An
accepted finding is a register row, not an order: two of the seven are
declined as work, and the decline is recorded on the row with the number
that would change it.

## 5. Routes

### 5.1 WO-174 — a passing gate row stands for what its suites read and execute

ER4-001 and ER4-002 are the review's constraint: the two gates every order
hands off on can both be green over bytes that fail. The reuse at the key is
four days old (WO-173), and the planning refuter named this exact case as a
known issue on WO-173 before it shipped (receipt 033: a gate reused at an
unchanged identity after a named input outside it changes). ER4-001's drill
is that observation.

One order carries both, because both repairs are in `scripts/test-runner.mjs`
and its fixture suite and neither can run beside the other:

- Product cases that read documentation carry the `[document]` tag and run
  in the document gate; kernel gains a `-docs` task; a read guard on the
  product package suites fails a case outside the tag that reads a path the
  identity excludes. Adding the excluded trees to the identity is declined:
  it restores the rerun after every report write that WO-173 removed.
- A closure check in runner-fixtures holds each machinery suite's declared
  sources to its entry file's literal imports and spawned scripts, after
  the evidence inventories' check (WO-157 item 12); the lists are repaired.
  Selection by declared sources stays the rule. The `--review` cost of the
  repaired lists is recorded for three changes and fails nothing.

Placement: the second lane of a pair with WO-058 at the head. It is the one
order of this pass with a claim on the critical path: the target is an
independently verified source-to-deliverable loop, and WO-123 and WO-118
will compose more suites on the same rows. No re-mint on its preferred
route.

### 5.2 WO-175 — a numeric reopening condition reports itself

ER4-003's mechanism, ER4-004 and ER4-007, in three groups with disjoint
files:

- The meter refuses a predicate it cannot resolve, resolves budget-row
  metrics, and counts what it computed.
- `npm run plan -- conditions` evaluates a named table of at most twelve
  numeric conditions and `plan start` prints how many hold. No gate, no
  refusal, no prose evaluated. The rows are the ones this review and this
  pass measured, so the listing starts with known answers.
- A launched review or refutation gets a temporary root beside its frozen
  copy, named in its instructions, inventoried in its receipt and removed
  with the episode, including past read-only leftovers.

Placement: the second lane of a pair with WO-059. It re-mints the five
editions, because the instruction sentence lives in a judged feedback
source; a live feedback episode is owed only if the feedback edition's
judged behavior changes (WO-154 D001), and then it is the executor's.

Why the third group rides here and not alone: it is a small change in the
same loop (the reviewer that produces findings and the entry that reads
them), and an order's fixed cost of three phases and a release is larger
than the change.

### 5.3 The three conditions that had occurred

| Condition                                                  | Observed                                                     | What this pass did                                                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| the plan check above 2 s (WO-156 D008, D010)               | 4.74 to 4.78 s here; 4.37 to 4.83 s in the two episodes      | recorded on both rows; no order (§5.4); the threshold that would change the decision is 8 s, carried by ER4-005's row                                                         |
| the release table "more than a few releases" behind (WO-086 D006) | five tags, v0.56.1 to v0.57.0, one day after landing  | regenerated with `npm run release -- list --markdown --write` (120 tags); docs-check no longer reports newer tags. No lifecycle step writes the table; WO-175's listing shows the count at each planning entry |
| one order above 1 MB of evidence (FUP-8a4e201d861208ad)    | WO-172: 1,808,181 tracked, 1,354,491 distinct                | recorded on the row; the condition restated on distinct blob bytes in two consecutive orders; FUP-5e2f4ce16f9e8be1 settled: superseded editions keep their bytes              |

The weekly evidence condition (10 MB from 2026-09-25) had not occurred: the
review measured 9,878,036 bytes. It is left as recorded and will be the
listing's first live row.

### 5.4 Two findings declined as orders

**ER4-005, the document gate's parse.** True: the cost follows the size of
closed history, and it is the third gate task in three reviews to do so.
Declined now on arithmetic. A blob-keyed parse cache would save about 9 s
of a 17 s gate. At six to fifteen document-gate runs an order (an inference
from the phases that run it, not a count) that is one to two and a half
minutes an order, against an order's three phases and a cache inside a
gate whose job is correctness. The growth is about 0.2 s a day. The
operator-amended figure of WO-156 (the plan check under 2 s) is not
restored: the check was 16 to 20 s when that order was filed and is 4.7 s
now. The disagreement with the reviewer's precedent argument (ER2-004 and
ER3-002 were each accepted and repaired) is recorded here: those two were
19 and 20 s each, inside every gate.

**ER4-006, the repeated authority transcripts.** True, and smaller than its
byte count suggests. Identical blobs are one Git object (the refuter's
note, and 27 blobs for 139 files here), so the 5.4 MB costs a clone or a
fetch nothing; it is 3.4% of the working tree's evidence and some lines in
a pull request's diff. The register's thresholds counted tracked bytes,
which is the proxy; the row now counts distinct blob bytes. The
by-reference form follows WO-154 and is worth taking when an order is
already in `scripts/authority-evidence.mjs`.

## 6. The sequence and the register

**The sequence.** Eleven closed entries leave (WO-060, WO-167, WO-116,
WO-173, WO-065, WO-172, WO-117, WO-086, WO-087, WO-066, WO-057). Two
orders are filed as second lanes of pairs cut from the head of the serial
run, whose reading order is unchanged:

| Slot          | Entries         | Why here                                                                                                   |
| ------------- | --------------- | ---------------------------------------------------------------------------------------------------------- |
| head          | WO-058; WO-174  | the next delivery order; the gate rows every later order hands off on. WO-174 closes before WO-059 starts  |
| second        | WO-059; WO-175  | the next delivery order; the planning instrument and the reviewer's confinement                            |
| the serial run | WO-061 onward  | unchanged                                                                                                  |

Disjoint primary surfaces and no hard edge inside a pair. WO-058 and WO-174
may both touch `packages/console/test/console-commands.test.ts` (pinned
values; case names). WO-059 and WO-175 both re-mint, so the second
integration re-mints once more, deterministically. The pairing follows the
standing directions: a pair holds one delivery order and one machinery or
evidence order (2026-09-16), and the balance sought is half product, half
debt (2026-09-25).

**The sequence's entry note, folded.** The file stood at 13,516 bytes
against a configured 8,192 and a dated acceptance of 12,369; WO-117 D013
(FUP-9ada0dd67e9fd3e4) asked the next pass that changes the sequence to
reconcile it. It held fifteen dated paragraphs (thirteen pass notes and two standing
rules), nearly all about orders that have closed. They sit outside the byte-addressed
sequence block (WO-172 D010), so they are no part of the planning subject,
and their record is each pass's planning document, the map and the ledger.
The rule this pass writes into the file: a pass's dated note leaves with
the last entry it places, as a closed entry does. The standing placements
that still bind a queued entry are restated in one paragraph (the serial
run until R2; WO-072 on WO-123; WO-088 and WO-089 last). The lane-pair
rule is kept in two sentences with a link to the map, which holds it in
full. The file is 3,868 bytes and the meter reports no budget breach. No
acceptance is recorded, and the 2026-09-22 acceptance is no longer relied
on.

One paragraph could not simply leave: the live-episode rule of 2026-09-28
lived only there, because WO-172 carried rule 1 of that pass into product
07 and not rule 6 (WO-172 D010, FUP-a9412a7815418c21). It is now one
paragraph in product 07 §Operator-opened planning pass, 642 bytes, after
the standard artifacts; the guide holds 1,341 bytes of headroom under its
ceiling. The software-engineer edition's source lock follows; its claims
are unchanged.

**The register.** This pass's subject is the review. The 55 items of the
failures instrument and the register's 17 open, 4 needs-review and 33
untriaged rows at entry are the next standard pass's and were not
disposed; the open rows were read so that no finding duplicated one.
Fourteen dispositions in one batch, each with its reason in the register:

| Row                                           | Now                 | Why                                                                                          |
| --------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| ER4-001, ER4-002 (FUP-c494a909ca1c6017, FUP-4f482b75a1071ab9) | allocated, WO-174 | §5.1                                                                         |
| ER4-003, ER4-004, ER4-007 (FUP-a7461ebe9627663d, FUP-72adcb05563bb99b, FUP-ae897de944b750d6) | allocated, WO-175 | §5.2                                         |
| ER4-005 (FUP-fb8cbeabbddef397)                | deferred            | §5.4; reopen at 30 s, 15 s or 8 s                                                            |
| ER4-006 (FUP-adf6621e7f958dd8)                | deferred            | §5.4; reopen at 10% or the next order in the writer                                          |
| FUP-3dc0266d6b87b939, FUP-ab1746dc9c595d95    | settled             | WO-156's repairs stand; the latency clause occurred and is carried by ER4-005's row          |
| FUP-8a4e201d861208ad                          | deferred            | its per-order condition occurred once, on an outlier order; restated on distinct blob bytes  |
| FUP-5e2f4ce16f9e8be1                          | settled             | planning's answer to WO-172's final review: superseded editions keep their bytes             |
| FUP-9ada0dd67e9fd3e4                          | settled             | the sequence is 3,868 bytes                                                                  |
| FUP-a9412a7815418c21                          | settled             | rule 6 is in product 07                                                                      |
| FUP-7629e03c6573f5cb                          | deferred            | WO-174's files touch it and the order leaves it; its interim rule is in force                |

`followups --touching` was run three ways. With the eleven closed orders'
identifiers it listed 62 pending rows; two had their condition met by this
pass and are in the table (the sequence size and rule 6); the others were
read and left, the open ones for the standard pass and the deferred ones
because their conditions have not occurred. With WO-174's files it listed
five rows and with WO-175's files nine: one is deferred above, and the
rest are named on the orders' catalog rows for the completion advisory,
without a "deferred again" written on each.

## 7. Declined alternatives — the NoOp register of this pass

Each is a `NoOpIntent`: what happens if nothing changes, why the choice
wins, what reopens it.

- **An order for the document gate's parse cache (ER4-005).** If nothing
  changes the gate grows about 0.2 s a day from 17 s. The decline wins on
  the arithmetic of §5.4 and on keeping a cache out of a correctness gate.
  Reopen: `npm run test:docs` above 30 s, docs-check above 15 s or the
  plan check above 8 s, on the operator's host.
- **An order for authority transcripts by reference (ER4-006).** If
  nothing changes each regeneration of role text or hooks writes another
  50 to 70 KB file that Git stores once. Reopen: the next order that edits
  `scripts/authority-evidence.mjs`, or repeated copies above 10% of
  `docs/evidence`.
- **Adding the excluded trees to the gate's identity.** It would make
  ER4-001 true by construction and bring back a full gate after every
  report write. Reopen: the read guard finds a path product cases must read
  in the product gate that reports also write.
- **A transitive import closure for machinery selection.** It can select
  the two longest suites on most script edits. Reopen: a regression passes
  `--review` through a transitive import after WO-174 closes.
- **Closing the untracked-source gap in WO-174 (FUP-7629e03c6573f5cb).**
  The same key, a different cause and a product choice between two
  repairs; no gate row that missed a source is recorded and the interim
  rule holds. A third group would widen an order whose two groups already
  share one file. Reopen: that row's condition.
- **Evaluating prose conditions, or requiring the predicate form.** Most
  of the 1,134 are qualitative, and a rule with no reader is ceremony.
  Reopen: the listing's first month of output.
- **A lifecycle step that regenerates the release table.** The table
  lagged five tags in a day and a planning pass regenerated it in one
  command. A step in release preparation would edit `scripts/release.mjs`
  for a projection nobody was misled by. Reopen: a reader acts on a stale
  table, or the listing shows it behind at two consecutive planning
  entries.
- **A separate order for the reviewer's temporary root.** An order's fixed
  cost exceeds the change. Reopen: WO-175's first verification fails on
  that group alone.
- **A fresh planning acceptance for the sequence's size.** The route the
  2026-09-22 pass took would have raised a ceiling over thirteen notes about
  closed orders. Reopen: the file exceeds 8,192 bytes again.
- **Disposing the failures instrument's 55 items and the open register
  rows.** They are a standard pass's subject (product 07), and mixing them
  in would make this pass's refutation judge two subjects. If nothing
  changes they stay listed at the next `plan start`. Reopen: the next
  standard pass.
- **Research agents.** Seven findings with reproduction commands, a
  blinded second measurement and cheap local checks needed none.

## 8. Goal alignment

**Mission and critical path.** The critical path runs through WO-058,
WO-059, WO-061, WO-124, WO-062 and WO-123 to the loop from core (WO-112).
WO-174 is on it as a precondition of trust: the path's claim is an
independently verified loop, and the rows that verification binds can be
green over failing bytes. WO-175 is operator flow, not critical path: it
removes hand measurement from planning entry and a blind spot from the
reviewer. Neither delays a delivery order; each is the second lane of a
pair.

**The eight traps, where material.** _Rule beating_ is the pass's subject:
ER4-001 and ER4-002 are evidence that passes without the intended behavior
occurring, and WO-174's guards are fixtures that fail against the present
source. _Shifting the burden_: two reviews found crossed thresholds by
hand, at about USD 10 a review; WO-175 moves the numeric ones to planning
entry. _Drift to low performance_: declining to restore the two-second
plan check could be this trap, so the decline states its arithmetic and a
threshold instead of adopting 4.7 s as the standard; the sequence's size
is the opposite case, where the pass removed the cause instead of
recording a third acceptance. _Escalation_: two orders for seven findings,
no gate, no hook, no refusal at a handoff; the listing is on demand.
_Seeking the wrong goal_: tracked bytes and gate seconds are proxies;
ER4-006 and ER4-005 are declined where the proxy moved and the outcome did
not. _Commons_: the pass spent USD 13.79 on two episodes and no subagent
before its own refutation. _Policy resistance_: WO-174's guard must not
fight WO-173's reuse, so the key is left alone and the cases move.
_Success to the successful_: the hand-kept source lists have six orders of
investment; the check keeps them and holds them, and the transitive
alternative is recorded.

**Naive Interventionism.** The reuse at an unchanged identity keeps its
function (no full gate after a report write). The affected consumers are
the executor's handoff claims, `productGate` bindings and `--review`. The
second-order harm of re-tagging is a product case that a code change
breaks being caught in the document gate instead of the product gate; both
are every order's final criterion. Every change is a tag, a task, a check
or a listing, reversible by removing it. The smallest probes are the two
drills the review already ran.

**Platform lens.** The listing is an interface planning entry consumes,
with rows a stranger can read (an id, a value, a threshold). The guard and
the closure check are fixtures any fork's suites run. The reviewer's
temporary root is recorded in a receipt a stranger reads without the
session.

**A risk this pass carries itself.** ER4-001 applies to a document-only
planning branch: this pass edits product 06, product 07, two orders, the
index and the register, and a document-only pass runs no code suite. §11
records what was run to check it.

## 9. Evidence and cost of this pass

Read-only inspection of `main` at `feb7a92e`: product 07's planning,
ideation and goal-alignment sections; the sequence; the index; the two
earlier entropy passes' documents and the 2026-09-28 pass's routes and
register sections; REVIEW-004 and REFUTATION-005 whole (the findings, the
packets, the attempts); the entropy command and the parts of its library
that dispatch, file and dispose; the follow-up procedure; the 62 rows that
name the closed orders and the 21 open or needs-review rows; the rows the
findings bear on; WO-156 D008 and D010, WO-086 D006, WO-172 D010; the
headers of WO-058, WO-059, WO-061, WO-124 and WO-062; the runner's suite
table, selection and reuse lookup; the gate identity; the meter's
predicate reader and evaluator; the docs check's file enumeration.

Commands: `npm run entropy -- subject`, `review`, `receipt`, `refute`,
`refutation-receipt`, eleven `dispose` and `check`; `npm run plan --
start`, `failures`, `followups` (page, `--show`, `--export`, three
`--touching`, one `--apply` of fourteen); `npm run meta`; `npm run
release -- list --markdown --write`; the timings and censuses of §3.

Written outside the repository: the ignored intake capture, the session
scratch (two helper scripts, the register export, the dispatch outputs),
the ignored local apply request, and the removal of the refutation's
leftover scratch directory under the system temporary directory.

Entropy: REVIEW-004 2,216 s, USD 11.71; REFUTATION-005 700 s, USD 2.08
(result envelopes; tokens unknown, cause harness-no-readback). Session
usage and the check of the risk named in §8 are in §11 and the response.

## 10. Reversal conditions for this plan

- The read guard finds that most console cases must stay in the product
  gate: WO-174's admitted alternative (a declared identity input) becomes
  its main route, by the executor's decision.
- The repaired source lists make `--review` for a one-file script change
  exceed the product gate: the exclusion list, not the check, is revisited.
- WO-175's listing takes more than 60 s or its timing rows flap on a
  loaded host: those rows move behind a flag.
- The operator wants the plan check back under 2 s, or the byte-reference
  form now: ER4-005's or ER4-006's row is allocated from its packet or
  finding, and the decline is reversed.
- A placement from a removed sequence note is needed and found nowhere:
  the fold's rule reopens.
- A pass opens with `planning: entropy reducer` while an earlier review's
  findings are still undecided: WO-151 D007's own reopening observation.

## 11. Independent review

Pending at the time this section was first committed; the receipt, the
gates run and the handoff usage are recorded below by the same pass.
