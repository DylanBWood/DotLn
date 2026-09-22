# Closeout follow-ups after WO-100 and WO-064 — the 2026-09-22 planning pass (fourth of the day)

Dispatched by the operator's `planning:` message and corrected twice
mid-pass by the operator; all three messages are captured verbatim in
ignored intake
(`docs/intake/notes/2026-09-22-closeout-followups-planning.md`, SHA-256
`a664688747a33959ac18e55c4b67975c93ee068d4b5e8e7989df9b3027d68558` after
the corrections were appended). The operator expects zero or one order from
the pass; if one, it runs next and solo; the pass is to find any follow-up
or other work worth doing before any future order; everything found goes
into that single order, authorized by the operator; and the order must be
clear enough for its executor and carry enough acceptance criteria for its
verifier. Document-only, on the planning branch
`planning/2026-09-22-closeout-followups` from `main` at `ad5bb1d7`. The
independent refutation receipt is named in section 11; the operator's
corrections and the pass's error are recorded in section 12.

## 1. What was asked, and what the pass found

The pair at the head of the sequence is closed: WO-064 merged as v0.43.0 and
WO-100 as v0.44.0, both on 2026-09-22, and the canonical status reads
"between work orders". The register at entry: 540 entries, 150 pending, of
which three carried invalidated dispositions, three were open and 29 were
untriaged decision records from the six orders closed on 2026-09-22
(WO-063, WO-120, WO-152, WO-151, WO-064, WO-100). Every pending row that was
not already deferred was read whole by script (section 2).

Sixteen of those records are boarded-up defects with a concrete fix each,
across eleven seams: the closeout helper that stranded WO-100's final review
and needed an operator recovery; the adjacent queue's un-retargetable
deferred items; the source-change host's uncounted ceiling; target
publication running the target's hooks with the operator's credentials; the
skeleton refusing any grant-bearing identity; the resident's binding
bypassing its profile check and lacking a default model; refused live
episodes with no recorded reason; receipt witnesses that overstate; Claude
Code attestations writing `unknown` for a supplied effort; evidence
registries that miss protocol files and new artifacts; a control fold bound
to a section constant; and a gate fixture teardown that can fail any gate.
They are all filed as WO-157, one operator-authorized order at the head of
the sequence (section 4). Everything else the pass found is settled with its
evidence, written back into product 07 as one sentence, or kept as a record
(sections 3 and 6).

Entry counters (`node scripts/harness.mjs usage`, scope dispatch, source
claude-transcript-message-usage): 4 input, 61,268 cached input, 19,549
cache-write, 536 output tokens, cost unknown; subagents 0 of 20. Model
claude-fable-5-1 and effort xhigh are operator-selected; `CLAUDE_EFFORT=xhigh`
is exported in this session (WO-157 item 11). Handoff counters are in the
response and the ignored receipt.

## 2. The register, read whole

| Class                                                                                                                                                                 | Rows | Disposition                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In-order repair directives and review routings the closed order discharged (WO-064 D008; WO-100 D009, D011, D014, D015; WO-151 D009, D010, D012, D013, D014; WO-152 D007) | 11   | settled, with the closing evidence named: WO-064 VER-002 and FINAL-001 (v0.43.0); WO-100 repair-003, VER-004 and FINAL-002 (v0.44.0); WO-151 D017 and FINAL-001 (v0.42.0); WO-152 D009 (v0.41.1)                                                    |
| Boarded-up defects with a concrete fix (WO-100 D006, D007, D016, D017; WO-064 D006, D010, D011; WO-152 D009, D011, D012; WO-151 D001, D017, D020, D021; WO-120 D007; WO-063 D005) | 16   | allocated to WO-157, the one order (section 4); first disposed as deferred by the pass's draft and re-disposed after the operator's correction (section 12), history retained                                                                             |
| A wording duty a planning pass can discharge (WO-152 D004)                                                                                                            | 1    | settled: product 07's registered-source sentence now excludes component release labels                                                                                                                                                                  |
| A non-defect with an unmet reopening observation (WO-151 D007: the reviewer's phrase depends on the operator)                                                          | 1    | deferred: two orders have closed since WO-151 merged and the phrase has been used once; the map's 2026-09-22 closes section keeps it as item 11, outside WO-157                                                                                          |
| Invalidated dispositions (FUP-0083, FUP-0108, FUP-0110) and the deferral whose reopening fired (FUP-0107)                                                              | 4    | re-read at their new revisions (section 3)                                                                                                                                                                                                              |
| Open items (FUP-0111, FUP-b8a329d9970b8206, FUP-16adc40db1da7959)                                                                                                     | 3    | FUP-0111 measured again and left open; the other two unchanged                                                                                                                                                                                          |
| The eleven seam rows the map's new section creates on sync                                                                                                            | 11   | allocated to WO-157 (ten) and deferred (the WO-151 D007 seam)                                                                                                                                                                                           |

Eleven of the 29 untriaged rows were in-order directives, again the class
product 07's settlement candidate names; the ten-directive reopening
threshold it records is met for the second pass running, and the smallest
fix (verifier role text reserving `followup` for what outlives the order)
stays with the next order that edits the verifier role. WO-157 item 2
regenerates the executor's role text; the verifier's sentence is not in its
scope. No collector change is allocated.

## 3. The invalidated dispositions and the fired deferral

- **FUP-0083, progressive absence authority (product 03).** Allocated to
  WO-067 and WO-100 with the reopening "WO-100 closes without that
  write-back". WO-100 closed with it: FINAL-002 criterion 4 records that
  product 03 states the progressive-authority status. Settled.
- **FUP-0108, the unattended portfolio (product 06).** Allocated to WO-100
  and WO-111. WO-100 is closed and the candidate paragraph now says what it
  shipped and what stays candidate; the live hour is WO-111, queued.
  Re-allocated to WO-111; reopens if WO-111 is withdrawn.
- **FUP-0110, work-order navigation and identity (product 06).** The source
  revision moved because WO-120 and WO-100 wrote their derived-work and
  portfolio paragraphs into that section; the settled decision (evidence
  view, typed dependency status, topology check; the scheduler declined) is
  unchanged. Re-settled.
- **FUP-0107, budget-window ladders (product 06).** Deferred on 2026-09-19
  with the reopening "WO-100's activation", which has occurred. The
  observation the 2026-09-19 decision waited for (a consumer for queue age
  and completion rate) has not: the portfolio ranks candidates by phase, and
  the operator still dispatches every order by hand. Deferred again; reopens
  when WO-111 closes with an observed unattended run or a second lane runs
  unattended.

## 4. The one order: WO-157

**What it carries.** Fifteen items in six seam groups, one per boarded-up
defect (WO-064 D011 and WO-152 D011 share item 2), each stated in the order
with what was observed, the source lines, the fix with a default route and
the admitted alternative, the fixture, and what the verifier checks; an
executor procedure that orders the groups, puts item 4's writer-profile
probe first inside its group, and sequences the single edition re-mint
(bundle regeneration, `harness-context --check`, the authority, artifact,
verification and feedback editions with one live self-host episode, the
component bumps) after the last registered-source edit; and nineteen
acceptance criteria, one per item plus the re-mint, the fail-before rule,
the write-backs and the gate.

**Why one order.** The operator directed it, and the record supports it:
every item is a defect a closed order recorded with its paths and intended
fix; three of them (the resident's profile check, the default model, the
uncounted ceiling) were routed to WO-111, whose text forbids runtime
changes; two (target hooks, the grant-bearing identity) stand between the
portfolio and any operator repository; and eight of the fifteen touch
registered evidence sources, so one order pays one re-mint where eight
patch orders would pay eight. The order's Cost line names the additions,
the registered sources it edits and what it removes.

**What the pass re-checked** (all on `ad5bb1d7`): the intent-to-add stash
failure, reproduced in a scratch repository on Git 2.55.0; the adjacent
queue's phase guard, which makes the D011 retarget impossible as recorded;
`CLAUDE_EFFORT=xhigh` exported in this session against a probe that records
no readback; one abandoned `dotln-gate-sandbox-*` root in the temporary
directory. Every other item's observation is quoted from its decision
record with the source lines the pass located.

**The three items WO-111 could not carry.** WO-100 D006 (the resident-side
profile check), D007 (a default model for always-on agents) and D016 (the
file ceiling and deletions WO-052 does not count) all said "WO-111", and
product 06 said WO-111 "owns adopting" the default; WO-111's criterion 6
forbids runtime source changes and its non-goals exclude any runtime fix.
WO-157 items 3, 6 and 7 land them ahead of the proof, and item 7 moves
product 06's paragraph from candidate to shipped.

## 5. The sequence

WO-100 and WO-064 leave the sequence under the 2026-09-22 rule. WO-157 takes
a one-entry slot at the head, before WO-153 and WO-154, solo, at the
operator's direction; it edits registered sources and re-mints the
editions, so it must not run beside WO-154 or WO-155. No other entry moves.
The sequence measures 7,890 bytes against the 8,192 ceiling; the dated
12,369-byte acceptance is not needed and stays as history. 48 queued
entries (the pass's first draft said 49; corrected here).

## 6. Seams recorded in the map

The map's new section, "Candidates — returns from the WO-064 and WO-100
closes (recorded 2026-09-22)", gathers the eleven seams with sources and,
for each, the WO-157 items that land it and the observation that reopens it
after WO-157 closes. Ten are allocated to WO-157; the eleventh (WO-151
D007, the reviewer's dependence on the operator's phrase) is a record with
an unmet reopening observation and stays outside the order. Two other
write-backs land in this pass: product 07's registered-source duty now
excludes component release labels (WO-152 D004), and product 07 §Retained
planning follow-ups says to sync before disposing a deferred queue item
(the procedure half of WO-157 item 2). The catalog carries WO-157's row and
a dated note on WO-113's row for item 14. Measured for the record: `plan
check` runs 16.67 s on `ad5bb1d7`, the figure WO-156 removes.

## 7. Declined alternatives — the NoOp register of this pass

- _File no order._ The next final review runs the same helper with the same
  standing reason for an intent-to-add entry, and every other item stays a
  register row until some later order happens to open its seam. Declined;
  the operator directed one order.
- _One narrow order and fifteen deferrals (the pass's first draft)._
  Declined by the operator's correction; recorded in section 12 with the
  reason the draft was wrong on the record's own terms.
- _Sixteen patch orders._ Three dispatches and a gate each for changes of a
  few lines to a few dozen, and eight re-mints where one suffices.
  Declined; the operator directed one order.
- _Leave the reopen-conditioned items (target hooks, the grant-bearing
  identity, the uncounted ceiling) for the passes that reach WO-066 or an
  operator repository._ Each is a recorded defect with a fix and a fixture;
  waiting adds a rediscovery cost and a chance the activating pass misses
  the row. Declined; the operator directed everything now.
- _Include WO-151 D007 (a register-thinness prompt at planning entry)._ It
  is not a defect: its record names a reopening observation (ten closed
  orders without the phrase, or two passes carrying findings undecided) that
  has not occurred. Kept as the map's item 11; reverse when it occurs.
- _Amend WO-111 to carry the three runtime follow-ups._ WO-111 is an
  evidence order by design; widening it re-keys the critical-path proof.
  Declined; WO-157 lands them first.
- _Pair WO-157 with WO-153 rather than a solo slot._ The operator said solo,
  and WO-157 re-mints, as WO-154 and WO-155 do. Declined.
- _Spend survey agents on the register._ 35 rows, six decision files and the
  source lines fit one session's reading; no subagent was spent before the
  refutation. Declined.
- _Change the collector for in-order directives._ Eleven more this pass; the
  smallest fix stays verifier role text for the next verifier-role edit, as
  the 2026-09-21 pass recorded. Declined; reverse when that order runs or
  the count keeps rising.

## 8. Goal alignment

**Mission and critical path.** The always-on runtime and its first proven
loop are the critical path; the next critical-path orders are WO-111 and
WO-114, behind two pairs of entropy-reducing patches. WO-157 sits ahead of
them and removes an operator rescue from every final review, lands the
three runtime changes WO-111 could not carry, and closes the two limits
that stand between the portfolio and an operator repository. It costs one
slot and one re-mint.

**The traps.** _Shifting the burden to the intervenor_: the stranded
receipt made the operator the recovery mechanism; item 1 removes that, and
item 2 removes a recurring advisory the record had assigned to an executor
who could not act on it. _Escalation and rule beating_: every item adds a
refusal with its remedy printed, a recorded detail or a fixture, not a
procedure; the one procedural sentence (sync before dispose) matches what
the tool already requires. _Commons_: one order, one re-mint, one live
episode where sixteen orders would pay far more; no subagent before the
refutation. _Drift to low performance_: eleven in-order directives settled
with their evidence; the fail-before rule on every fixture. _Success to the
successful_: the one-seam convention was set aside by the operator for this
order, and the order says so rather than pretending each item is a seam of
its own. _Seeking the wrong goal_: no register row is closed without its
evidence or a reopening observation; the one non-defect stays a record.
_Policy resistance_: the release-label exclusion and the sync sentence align
two duties with what the tools do. NoOp for each choice is in section 7.

**Naive Interventionism.** Each item names the existing behaviour it keeps
(the helper's checkpoint, stash, merge and `--continue`; the host's surface
check; the publication's refusals; the fold's validation; the fixture's
assertions) and changes one step beside it; the smallest probe per item is
the fixture that fails today; item 4's probe precedes its guard.

## 9. Evidence and cost of this pass

Read-only inspection of `main` at `ad5bb1d7`: canonical status, the
sequence, product 07's goal-alignment, planning, ideation, integration and
candidate sections, the three same-day planning documents' route and answer
sections, the ledger head, the follow-up procedure, the budgets file, the
register (whole, by script), the decision files of WO-063, WO-064, WO-100,
WO-120, WO-151 and WO-152, FINAL-002 of WO-100 and FINAL-001 of WO-064 and
WO-151, the headers of WO-111 and WO-153 to WO-156, WO-066's push lines,
the map's three latest candidate sections and catalog rows, and the source
lines each item cites (the integrate helper, the adjacent-queue command and
library, `repair.ts`, the source-change and target-publication hosts,
`artifact-identity.ts`, `resident-bind.mjs`, `config.mjs`, the verification
protocol, transport and host, `dotln.ts`, `entropy-review.mjs`,
`evidence-sources.mjs`, the kernel's JSONL protocol registry,
`derived-contract.mjs`, `control.mjs`, `test-runner.test.mjs`), the
discovery probe's readback rows, and the temporary directory's sandbox
roots. Commands: `npm run plan -- followups` (page and six `--show`),
`npm run plan -- start`, `npm run meta -- --check`, `npm run meta`,
45 and then 27 `followups --apply` calls,
`/usr/bin/time node scripts/refute-plan.mjs check` (16.67 s), `git` log,
status, tag, worktree, show and diff, `gh release list`, and a
scratch-repository reproduction of the stash failure (Git 2.55.0). No file
outside the repository was written except the ignored intake capture and
the granted scratch directory. Entry counters are in section 1; handoff
counters are in the response and the ignored receipt.

## 10. Reversal conditions for this plan

- WO-157's executor finds an item's fix contradicts its record on the code
  as it stands: record the deviation in the decisions and keep the item's
  criterion, or return it to planning with the observation; the order does
  not shrink silently.
- The operator prefers WO-157 split or paired: edit the sequence; the map's
  section carries each item's seam for a split.
- A reader of the sequence needs a closed entry: the 2026-09-22 rule
  reopens.
- Any item's reopening observation in the map section, after WO-157 closes.

## 11. Independent review

One fresh background refuter (Entropy Reducer, Contra-Auguste mask,
architecture-and-semantics lens; the second of two spawned, the first
stopped before judging when the pass corrected three cross-references in the
order and regenerated the prompt) judged the committed subject at
`f1a9fd6d` under
[receipt 027](refutations/2026-09-22-planning-12a29b8b07c6265d-027.md):
scope pass, WO-157 and the sequence judged, 47 verdicts carried by hash,
dispatch-to-file 600 s, verdict **aligned-with-findings** for WO-157 and the
plan, no hold. The briefing carried the canonical prompt, the schema and the
operator's atomicity direction (section 12) and nothing else; the worker
read only the prompt files, ran nothing against the repository and reported
model `claude-fable-5-1` with `CLAUDE_EFFORT=xhigh` observed in its
environment. Nine known issues, each with a reopening observation, none a
hold:

- criterion 17: the fail-then-pass rule can be met by a base failure that
  is a missing symbol rather than the item's assertion;
- criterion 15: the title says "deterministic" while the criterion admits a
  recorded diagnosis with the race unfixed;
- criterion 7: "the latest Claude Sonnet" is an alias; the resolved model id
  must be what the binding records;
- criterion 8: "an unknown detail is refused" could refuse the recording of
  a refusal and return the episode to the undiagnosable class;
- criterion 6: `--check` is unspecified when no registered
  `authorityProfile` is readable;
- criterion 3: the deletion refusal may collide with a legitimate Sort
  deletion in WO-111 or WO-118;
- criterion 19: a pre-authorized cold-start raise repeats a route the
  acceptances record seven times since 2026-09-17;
- criterion 18: the order names removals by decision id but no gate or
  order each item unblocks, and the register read "allocated" before
  judgment;
- criterion 11: `claude-session-readback` is a readback only if the host,
  not DotLn's dispatcher, exports the variable.

Disposition: all nine are carried as known issues for the executor's
decisions, written on WO-157's catalog row; none changes the order's text
in this pass. The pass records one disagreement without manufacturing
dissent: the criterion 18 finding is right that no item names a gate, and
the planning document's section 4 supplies it (items 3, 6, 7 and 11 precede
WO-111; item 4 precedes WO-066; item 14 precedes WO-113; items 1 and 2
serve every final review); the executor's decisions carry that mapping per
item.

## 12. Operator corrections: everything in one order, stated for its executor and verifier

After the pass had filed a narrow WO-157 (the integrate helper alone) and
disposed the other fifteen defects as deferred register rows and map
candidates, the operator sent two messages, captured verbatim in the same
intake note: the first, that everything was to go into a single work order,
one time, authorized by them; the second, that the order be clear enough for
its executor, since it is larger than normal, and carry enough acceptance
criteria for its verifier.

**The specific error.** The dispatch said "0 or 1 work orders" and "find any
follow ups or anything really that would be useful to be completed next".
The pass read the first phrase through the planning convention of one seam
per order and produced the smallest order it could defend, then treated the
rest of what it had found as material for later passes. The second phrase
and the standing record say otherwise: each of the fifteen other items is a
recorded defect with its paths and intended fix, three of them had been
misrouted to an order that cannot carry them, and deferring them re-created
the exact pattern the 2026-09-22 REVIEW-002 pass had corrected that morning
(findings carried as rows instead of orders). The category the operator
pointed at was the whole set, authorized as one order.

**What changed.** WO-157 was rewritten as the omnibus: fifteen items in six
seam groups, each with observed cause, source lines, fix (default route and
admitted alternative), fixture and verifier checks; an executor procedure
for group order, the item 4 probe and the single re-mint; nineteen
acceptance criteria; the operator authorization recorded in its provenance
and assumptions. The sixteen register rows were re-disposed from deferred to
allocated to WO-157 with their history retained; the map's section now says
all eleven seams are allocated (the WO-151 D007 record excepted) and each
item names the WO-157 item that lands it; the WO-154 boy-scout nomination
was withdrawn into item 11; the sequence paragraph, the ledger section and
this document were rewritten. The refutation judges the rewritten order.

**Goal alignment of the correction, briefly.** The first draft optimised
the pass's own conventions over the operator's stated goal and the
record's evidence: seeking the wrong goal, and shifting the burden of
fifteen rediscoveries to later passes. One order with one re-mint is the
smaller total cost. The correction is the rewrite and this record, not a
wording change.

**Third direction, before the refutation.** The operator sent: "tell the
refuter that the atomicity requirement needs to be relaxed for this work
order" (captured verbatim in the same intake note; SHA-256
`4ee79b0df30d18530fd904eff225b12320f2d193c7b157e4c72524f90ac8347d`). The
refuter's briefing therefore carries, beside the canonical prompt and
schema, that one operator-authorized line: WO-157's cross-seam scope is
authorized and the one-seam (atomicity) convention is not a criterion for
this order, so multi-seam scope alone is neither a finding nor a hold. The
direction adds no other input to the worker.
