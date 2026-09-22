# REVIEW-002 consumed — four findings accepted, three packets filed, nothing sequenced at the limit (2026-09-22)

Planning pass opened on `main` at `4bf626f4` on branch
`planning/2026-09-22-entropy-review-002`, the second planning pass of the
day. Document-only. The operator's dispatch was the bare phrase
`planning: entropy reducer`, captured verbatim in ignored intake
(`docs/intake/notes/2026-09-22-entropy-review-002-planning.md`, SHA-256
`053babc0e18033bca0c2adbbfb9ba4870a270ffbf625924c4e9248d4ffe834a5`), received
at 2026-09-22T16:25Z. No other operator text arrived. The pass consumed
[REVIEW-002](../instance/entropy-reducer/runs/REVIEW-002.md) under
[REFUTATION-003](../instance/entropy-reducer/runs/REFUTATION-003.md),
re-measured each finding on the current `main`, recorded seven dispositions,
filed three proposal packets, and designed one order it could not sequence. It
paid for no review episode, filed no order, changed no sequence entry, and
implemented nothing.

Labels: **observed** (a command or file on this machine showed it),
**inferred** (stated with its evidence), **unknown**.

## 1. What was asked, and the subject

The phrase's procedure is product 07 §Operator-opened planning pass and WO-151
D007 and D011: open with `npm run entropy -- subject`, consume before
producing, dispose every surviving finding and packet in this same pass, and
weigh, sequence or decline the accepted ones here. The phrase makes the review
the pass's subject instead of the register's existing rows.

Observed at entry:

- `npm run entropy -- subject` returned `consume`: REVIEW-002 at base
  `5b4b99ca`, refutation REFUTATION-003, four findings (four measured, none by
  inspection; two major, two minor, none blocking), four survived, none
  refuted, blocked or unselected, three proposal packets; reason printed:
  bound by a refutation and nothing disposed. `npm run entropy -- check`
  reported status `ok` with zero dispositions.
- `main` at `4bf626f4`, clean, in sync with `origin/main`; the worktree list
  holds only `main`; the index lists WO-151 and WO-152 final-reviewed and the
  next queued pair WO-100 and WO-064; `npm run meta -- --check` passes; the
  register holds 524 entries, 139 pending (17 untriaged, 1 needs-review, 4
  open, 117 deferred).
- The review's base commit is an ancestor of `HEAD` (`git merge-base
  --is-ancestor`). Ninety-five files changed between them, all from the
  WO-151 and WO-152 closes. Four of the findings' listed surfaces are among
  them (the loadout generator by three lines for the planner's entropy
  clause, the test runner by eleven for the `entropy` document check, the
  current-edition pointer, and two new edition logs), so section 3
  re-measures every finding on `HEAD` rather than carrying the review's
  numbers.
- Process cost at entry: 81,058 tokens at dispatch scope, source
  `claude-transcript-message-usage`, observed 2026-09-22T16:25:43Z; dollars
  unknown (counter unavailable). Subagents: none used at entry, cap twenty;
  the plan for the cap is one fresh background refuter and nothing else.

## 2. The review and its refutation (observed from the receipts)

- **Reviewer.** `entropy-reducer@1`: `claude-fable-5-1` at `max` on
  claude-code 2.1.278 through the `claude-cli-print` transport, recorded from
  the invocation; effective model and effort unknown. Episode 993 s, 64
  turns, USD 9.50 list (the rendered cost line reads `unknown`; the receipt's
  JSON records the figure, and WO-151 D016 explains why the rendering was not
  re-filed). Confinement: file tools restricted to the frozen copy, zero
  denied tool calls, tracked status not byte-identical across the episode on
  the explicit-commit route (drift recorded, not refused).
- **Refuter.** REFUTATION-003, the same pin: 458 s, 21 turns, USD 2.90. It
  received only the four reproduction commands; measured denominator four,
  `selected`; by-inspection denominator zero, `not-applicable`. All four
  survived with independent measurement. It added one caveat on ER2-003
  (`--check` is not parsed by `harness-context.mjs`, so the flag is inert and
  the same measurement prints regardless) and the stack-sampled cause for
  ER2-004 (99.9% of samples at `cacheKey` under `loadConfig` under
  `rootPattern`, called from the `Array.filter` callback at
  `plan-subject.mjs` 309–314).
- **The findings.** ER2-001 (major, altitude 6): retained evidence copies
  committed inputs by value; 80 self-host logs were 56% of tracked bytes, 97%
  of them source bodies stored twice per edition; the planning refutation
  receipts embed every sequenced order's text. ER2-002 (major, altitude 5):
  edition staleness is keyed on registered sources that include
  `package.json`, the lock file and every workspace package file, so a
  version-only bump re-mints both editions and spends one live episode of
  about 320 s (WO-147 D010) to record a subject-hash-only change; 59
  editions for 34 orders in seven days. ER2-003 (minor, altitude 6):
  cold-start bytes grew 125% to 176% per role since v0.16.0, the ceiling
  route produced six acceptances in four days without binding, and the
  1,666-byte refusals paragraph is loaded twice per role. ER2-004 (minor,
  altitude 9): `plan check` took 20.5 s with 3.9 million `statSync` calls
  and 212 spawns, as two 25 s tasks inside every `test:docs` run.
- **The packets.** `content-addressed-evidence-inputs`,
  `behavioral-staleness-key-for-evidence-editions` and
  `cold-start-trend-and-single-source-floor`, each with corroborating and
  dissenting evidence. The pass read the dissenting references as
  constraints: WO-147 D010's rejection of bypassing the staleness check, the
  receipts' self-containment, and the operator's 2026-09-17 and 2026-09-18
  directions on the ceiling route.

## 3. Re-measurement on `main` at `4bf626f4` (observed, this pass)

| Finding | At the review (base `5b4b99ca`)                                                                     | At `HEAD` `4bf626f4`, 2026-09-22                                                                                                                                                                        | Holds |
| ------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| ER2-001 | 80 logs, 100,882,272 of 179,844,991 tracked bytes (56.1%); receipts' JSON 11,451,460 bytes          | 82 logs, 104,786,967 of 184,846,333 (56.7%), +3,904,695 bytes over two closes; receipts' JSON unchanged at 11,451,460 (no receipt filed since 024)                                                    | yes   |
| ER2-002 | 59 editions for 34 orders since 2026-09-15; one live episode of 320.6 s per re-mint (WO-147 D010)   | two editions added by the two closes (WO-151 revision 001, WO-152 revision 001); whether either was version-only is not determined by this pass (both orders also edited other registered sources)  | yes   |
| ER2-003 | executor 24,412 of 24,576; paragraph once in each of six skills                                     | `CLAUDE.md` 6,113; skills executor 18,299, verifier 15,252, reviewer 16,430, release-close 7,854, planner 10,002 (up from 8,920 by WO-151's clause), refuter 9,577; the 1,667-byte paragraph (with newline) once in each; executor 24,412 of 24,576 | yes   |
| ER2-004 | 20.54 s real (review); 19.66 s (refuter); 3,879,656 `statSync` calls                                | 16.46 s real, 13.99 user, 2.56 sys, exit 0; the cause is unchanged code (`plan-subject.mjs` 308–314 and `config.mjs` 429–455, read by this pass)                                                     | yes   |

The host and its load differ between the three timings of ER2-004; the
finding is the cause and the order of magnitude, not a fixed number.

## 4. Dispositions

Recorded with `npm run entropy -- dispose REVIEW-002 <id> accept '<reason>'`;
each appends an `EntropyFindingDisposed` event to
`docs/control/entropy-reducer.jsonl`, an accepted finding appends a list item
under the formal heading in
[the generated review document](entropy-reviews/REVIEW-002.md), and an
accepted packet is filed under `docs/proposals/<id>/packet.json` with an
`EntropyPacketFiled` event. `npm run entropy -- check` afterwards: status
`ok`, seven dispositions, three packets, no interrupted filing.

| Id                                               | Kind    | Disposition | Reason, in short                                                                                                                                                                                                                                             |
| ------------------------------------------------ | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ER2-001                                          | finding | accept      | Re-measured and growing; FUP-0051's reopening observation (a demonstrated upkeep problem) has occurred; candidate for an evidence-editions order when the sequence has room.                                                                                  |
| ER2-002                                          | finding | accept      | Measured and survived; WO-147 D010's rejection stands as a constraint; the candidate mechanizes D010's own field-by-field comparison; the same order as ER2-001.                                                                                             |
| ER2-003                                          | finding | accept      | Re-measured; the single-source emission is a bounded generator change nominated to WO-100, conditional on a skill read alone staying complete (no decision record found either way); the metric and ceiling route waits for the operator's efficiency pass. |
| ER2-004                                          | finding | accept      | Re-measured; a few-line hoist in a shared check every final review and planning pass runs twice; nominated to WO-064 with the check `plan check` under 2 s.                                                                                                  |
| `content-addressed-evidence-inputs`              | packet  | accept      | Filed as the design record; the order decides the shape and must handle a blob recorded before its commit exists; existing editions stay byte-identical; the logs before the receipts.                                                                       |
| `behavioral-staleness-key-for-evidence-editions` | packet  | accept      | Filed beside the first; a behavioral change never inherits an older live audit; the smallest probe is the subject-only comparison D010 made by hand.                                                                                                        |
| `cold-start-trend-and-single-source-floor`       | packet  | accept      | Filed; the emission half rides with WO-100's nomination, the metric half is the operator's reserved pass; reviewed rules are not trimmed either way.                                                                                                          |

Why accept rather than defer or dismiss, in one sentence each. ER2-001 and
ER2-002 are the largest measured recurring costs in the repository (bytes and
a live episode per order) and each has a settled constraint the packet already
honors. ER2-003 is two things: a defect nobody decided (the same 1,667 bytes
twice per role) and an observation about a route the operator decided; the
pass accepts the finding, routes the defect, and records the observation
against the direction instead of overruling it. ER2-004 is a pure cost with a
traced cause and a fix smaller than an order.

## 5. Routes

**5.1 The limit.** The sequence holds exactly 100 orders and the planning
subject refuses more (`scripts/lib/plan-subject.mjs` line 301, observed). The
sequence's own rule keeps closed entries until the operator changes the
horizon, and the earlier 2026-09-22 pass left that decision open (candidate 3
of its map section; FUP-7f13b0e220950f10). A planner does not change the
horizon, so this pass files no order and changes no entry; the sequence
preamble gains one paragraph saying so.

**5.2 The evidence-editions order.** Designed in the map's REVIEW-002 section
and not filed: one seam (the feedback self-host recorder and its staleness
check), five criteria (inputs recorded as `{path, blobHash}` resolved from
Git, with a working-tree fallback before the commit exists; staleness keyed
on a behavioral identity with pins as metadata; a behavioral change still
cannot inherit an older live audit, kept as a regression; existing editions
and receipts byte-identical, schema version moved; a Cost line that measures
the per-edition bytes and the live episodes removed), the receipt subject as
a second criterion group only if the executor judges it the same seam, the
smallest probe (skip the live episode only when the generated `feedback.json`
differs from its predecessor solely in the subject field), non-goals (history
rewriting, LFS, out-of-tree retention), and placement in a one-entry slot
after WO-100 and WO-064 when room exists because it re-mints the editions and
must not run beside an order that does the same. Expected value by the
packets' figures: about 1.2 MB less per edition and one fewer live episode
for most orders; the pass claims no measurement until the order runs.

**5.3 The boy-scout nominations.** Product 07's planning section admits "a
named boy-scout item for the next activation" as the alternative to an order.
The bounded boy-scout rule makes each item host-reviewed: the executor admits
or declines it in its decisions, and a declined item stays a register row.
The nominations are written on the catalog rows of WO-064 and WO-100, not in
the order texts receipt 024 judged, so neither order is re-keyed.

- WO-064 (the second-lane order of the next pair; it already edits
  `scripts/`): in `scripts/lib/plan-subject.mjs` lines 309–314, build the
  work-order path pattern once per call instead of once per committed path
  per sequence order. Check: `plan check` under 2 s wall-clock and the
  `plan-refutation` suite green; no behavior changes. Inferred size: a few
  lines (the pattern is a pure function of the root and the order id; the
  refuter's stack sample places 99.9% of the calls under it).
- WO-100 (its own criterion 5 regenerates the bundle and mints a fresh
  feedback edition because runtime source changes): emit the shared refusals
  paragraph once in the floor and have each generated skill refer to it. The
  first step is the check the packet leaves open: whether a skill read
  without the floor must stay complete in any supported harness. No decision
  record for the repetition was found (product 07, WO-135, WO-139 and WO-144
  decisions searched); if it must stand alone, the executor declines the item
  and the row reopens for the efficiency pass. WO-064 was declined for this
  item because the generator is a registered source and the change would
  spend a live episode WO-064 would otherwise not pay.

**5.4 What waits for the operator.** The cold-start trend metric and the
retirement of the ceiling-plus-acceptance route belong to the efficiency pass
the operator reserved on 2026-09-18 (WO-054 D006, reopen: "the operator
begins the efficiency pass"); the 2026-09-17 direction (raise by one 4 KB step
with the rule named, never trim) stands until then. The horizon decision
(candidate 3, open) now gates four items: the evidence-editions order, the
WO-153 draft, and the two boy-scout items if their executors decline them.

## 6. The register

This pass's subject is the review, not the register's existing rows (product
07; WO-151 D007). The seventeen untriaged rows and one invalidated
disposition the WO-151 and WO-152 closes left behind were not read and remain
queued for the next standard pass; nothing in this pass depends on them.

Rows created by the four acceptances (through the generated review document
and `npm run meta`), disposed in this pass with `plan followups --apply`:
ER2-001 and ER2-002 deferred to the evidence-editions order with the horizon
as the reopening condition; ER2-003 allocated to WO-100 for the emission half
with the efficiency pass as its reopening condition; ER2-004 allocated to
WO-064. Rows re-disposed: FUP-0051 (artifact growth and maintenance), whose
reopening observation occurred, deferred to the same order with the dated
note on its map entry; FUP-7f13b0e220950f10 (the sequence at its limit) kept
open with the four waiting items named; FUP-b8a329d9970b8206 (cold-gate
structural cuts) kept open with ER2-004's measurement added as the first
per-task observation the row has carried. The identifiers of the new rows
are in the register; the receipts are the dispositions' `at` timestamps.

## 7. Declined alternatives — the NoOp register of this pass

The map's REVIEW-002 section carries the register: paying for a fresh review;
filing the evidence-editions order now; retiring closed entries; folding the
work into WO-085 or WO-060; a patch order for `plan check`; the dedupe on
WO-064; retiring the ceiling route here; dismissing ER2-003; LFS, compression
or out-of-tree retention; a size budget; triaging the register's untriaged
rows; survey agents. Each names what happens if nothing changes, why the
decline wins and what reverses it.

Three of them deserve a line here. _Retiring the ceiling route_ is the one
place this pass disagrees with a reviewer it otherwise accepted: the finding
is measured and the route has indeed never bound, but the operator chose it
twice with reasons (needed rules outrank caps; efficiency later), and product
07 asks that disagreement be recorded with its evidence, not resolved by a
planner. _Paying for a fresh review_ would have cost about 993 s and USD 9.50
by the only observation and rediscovered the same four findings under new
identifiers, which is the failure WO-151 D011 added `subject` to prevent.
_Filing the order now_ is refused by the subject itself, not by judgment.

## 8. Goal alignment

Mission and critical path: none of the four findings sits on the typed route
to M3. The evidence-editions order is repository health and operator flow
(clone, fetch and worktree time; the PR diff every integrating final review
reads; the live episode and its wall-clock most orders now pay); ER2-004
shortens every gate that runs `test:docs`; ER2-003's emission half restores
the headroom the next reviewed rule needs. NoOp for each: growth of about
80 MB a week continues and each close pays a live episode to record a hash;
every gate keeps two 25 s tasks; the next reviewed rule that touches the
floor triggers another acceptance record.

The eight traps, where material. _Policy resistance_: a by-reference edition
must not fight the staleness check, so D010's rejection is carried as a
regression criterion, not relaxed. _Commons_: repository bytes and model
spend are the commons the findings name; this pass spent no episode and one
refuter, and adds no recurring check. _Drift to low performance_: the
acceptance ritual is the drift ER2-003 names; it is recorded against the
standing direction rather than normalized further by a seventh acceptance.
_Escalation_: two boy-scout items and one designed order instead of three
orders; no gate, hook or role. _Success to the successful_: the by-value
recorder has investment (validators, the console's pinned self-host case);
the packets' alternatives are recorded and the order may reopen them with a
measured reason. _Shifting the burden_: the live re-mint episode is a
recurring cost executors and reviewers pay, and WO-147 D010's followup priced
it into every order; removing it where behavior did not change is the aim,
not pricing it forever. _Rule beating_: a declined boy-scout item must stay a
register row; `plan check` under 2 s is a measured check; the dedupe's check
is completeness, not bytes. _Wrong goal_: fewer bytes is a proxy; the outcome
is that evidence still binds its subject while a stranger's clone and every
integrating review pay less.

Naive Interventionism: the recorder's useful function (a live audit bound to
its exact subject) is kept; its consumers are `validateSelfhost`, the
feedback-evidence check and the console's self-host fixture; the second-order
harm is an edition that is not self-contained outside Git, recorded as a risk
the order must weigh; reversibility is by schema version with every old
edition untouched; the smallest probe is the subject-only comparison. Platform
lens: an edition that records inputs by blob identity is content-addressed by
construction, which is the second of the four checks, and the other three are
unchanged.

## 9. Evidence and cost of this pass

Read-only inspection of `main` at `4bf626f4`: canonical status through the
index, the sequence, product 07's planning, ideation and goal-alignment
sections and its discipline paragraphs the findings cite, product 03 §Corpus
policy, the operator guide for the reviewer, REVIEW-002 and REFUTATION-003
whole, the same-day planning document and its ledger section, WO-151's
decisions and recorded limits, WO-147 D010, WO-054 D006, the budgets file,
the follow-up procedure and three register rows, the headers of WO-064,
WO-085, WO-090, WO-084 and WO-100, the dispose implementation, the
follow-up collector's heading rule and allocation rule, and the two source
locations ER2-004 names. Commands: `npm run entropy -- subject`, `check` and
seven `dispose` calls; `npm run plan -- followups` (page and three `--show`),
`npm run plan -- start`; `npm run meta -- --check`; `git` log, diff, status,
worktree, merge-base and ls-files byte censuses; `wc -c` over the floor and
skills; `/usr/bin/time node scripts/refute-plan.mjs check`.

Limits met and reported rather than worked around: the subject's 100-order
limit (section 5.1). The sequence file after this pass's paragraph is
measured in the handoff against the dated 12,369-byte acceptance recorded by
the earlier pass; no new acceptance is needed if it stays under. No model
call was made outside this session before the refutation; no subagent was
spent before it. No file outside the repository was written except the
ignored intake capture and the granted scratch directory. Entry counters are
in section 1; handoff counters are in the response and the ignored receipt.

## 10. Reversal conditions for this plan

- The operator changes the horizon: the evidence-editions order is filed
  from the map's design, after the WO-153 draft, in a one-entry slot after
  WO-100 and WO-064.
- WO-064's executor declines the `plan check` item: the row stays open and
  the next pass with room files a patch order.
- WO-100's executor finds a skill must stay complete without the floor: the
  emission item is declined and the row reopens for the efficiency pass with
  that observation.
- The operator opens the efficiency pass: the cold-start metric and ceiling
  route are decided there from the filed packet.
- A later review or verifier shows a by-reference edition failing a consumer
  that needs bodies without Git: the order's design reopens with that
  observation.
- Two planning passes open with `planning: entropy reducer` and a review's
  findings are still carried to a later pass undecided: WO-151 D007's own
  reopening observation.

## 11. Independent review

Receipt
[2026-09-22-planning-72c46910a176d62e-025](refutations/2026-09-22-planning-72c46910a176d62e-025.md):
one fresh background reviewer, given only the canonical prompt (175,517
bytes as pretty-printed JSON, read whole in ten contiguous line slices by
its own statement) and nothing else, judged the committed subject at
`02375ac4`. Pass scope: WO-151, the one order whose file changed since
receipt 024 (by its appended execution record), plus the sequence; 99
verdicts carried by hash. The helper selected that scope; this pass changed
no order text. Verdict `aligned-with-findings` for WO-151 and for the plan;
no hold; six known issues, zero observed failures, zero vision
contradictions. Dispatch to file took 557 s as the helper observed it; the
worker itself finished in 444 s over 35 tool uses and 143,053 tokens by the
harness's task notification. It was the pass's single spent subagent of the
twenty-agent cap. The worker made no repository or Git writes and spawned no
agents; its only writes were its result, its statement and a small schema
validator in the granted scratch directory.

The reviewer's answers to the four questions, in short. WO-151 sits on no
critical-path gate row and names no blocked outcome it enables; its NoOp
cost before the order was the hand-performed host steps and REVIEW-001's
measured-versus-inspection loss, none of it a number in the meter, and after
the order NoOp costs nothing further. Removal balance: no, by every measured
ledger (six subcommands, a control log, one gate step, a generated document
per disposed review, an edition re-mint and a live episode added; procedural
removals unmeasured). Failure behavior: mostly degrading, with one refusing
edge, the `entropy` document check failing every later order's gate on a
chain-breaking receipt, constructible and not observed.

The six known issues and what this pass makes of them:

1. _Criterion 7, rule beating._ A filed pair satisfies the live-row
   criterion even if the reviewer measured nothing. The reopening
   observation (REVIEW-002's receipt records denied tools above zero or
   fewer than half its findings measured) is already answered by the
   record the reviewer could not see: REVIEW-002 records zero denied tool
   calls and four of four findings measured (WO-151's recorded limits).
   Not met; nothing to do.
2. _Criterion 6, policy resistance._ The `entropy` check inside
   `test:docs` turns a hand-edited or chain-breaking receipt into a gate
   refusal for unrelated orders. Constructible; WO-151's own decisions
   record the interrupted-filing tolerance and the same edge. Carried to
   WO-151's catalog row with its reopening observation.
3. _Criterion 5, the wrong goal._ The order names no critical-path outcome;
   its route into the product is the register. Reopens when an accepted
   Entropy Reducer finding is sequenced as, or amends, an order on a
   critical-path gate row. This pass's accepted findings are repository
   health and gate time, not gate rows, so the observation stands open.
4. _Criterion 2, attestation._ The pinned route records model and effort
   from the invocation's flags, not from a readback of the session that
   ran. Already recorded as WO-151's first known limit; the reopening
   observation (an attested model differing from a usage readback) has no
   readback to compare against today.
5. _Criterion 8, gate step count._ 78 at WO-151, the series high, with the
   meter's worsening list empty. The Cost line named the added step; the
   next observed row decides it.
6. _Criterion 8, the Cost line reads "unknown until run" beside an observed
   row._ By product 07 §Process budget the Cost line is the promise and the
   cost table is the observation the meter compares it with; the pairing
   is the design, not a stale claim. Recorded here so the next reviewer
   reading a closed order's Cost line has the pointer.

After the receipt the operator directed, in one line captured verbatim in
ignored intake
(`docs/intake/notes/2026-09-22-entropy-review-002-planning-operator-answer.md`,
SHA-256 `b39ddef91c5216fe9d3d5601bfa05c26645ccb073b33542b79bad7aa791000b1`),
that the pass push the branch and open the pull request when done.
`npm run test:docs` after the receipt: recorded in the handoff.
