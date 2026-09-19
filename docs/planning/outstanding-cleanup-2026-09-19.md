# Outstanding cleanup — what reviews logged and nobody owned, the register settled, and one order to clear it (2026-09-19)

The operator opened this pass on the main checkout after the v0.31.1 close
with one request: non-blocking issues are logged, suggestions are made and
never looked at, low-hanging bugs and debt continue; if it makes sense, file
a single work order that cleans up the repository and anything outstanding,
with a pass budgeted for it. A second message left to this pass whether
WO-084 to WO-090 move sooner. Both are captured verbatim in ignored intake
(`docs/intake/notes/2026-09-19-outstanding-cleanup-planning.md`; its SHA-256
is in the ledger section).

Method: one planning session on `planning/2026-09-19-outstanding-cleanup`,
the sole writer, with eight read-only background surveys batched over groups
of items (two over the register's decision rows, one over its candidate rows,
three over the verification reports and final reviews by order range, one
over the tree, one over the planning, refutation, release and control
surfaces) and one refuter reserved: nine of the twenty subagents
`docs/control/budgets.json` allows, no descendants. A survey is model output.
Each was told to cite a path or a command for every item and to check the
current tree before calling anything open; the planner re-checked thirteen
high-impact items by hand and all thirteen reproduced, and corrected two of
its own inferences against the tree (§4). What no one checked is labeled
unknown. Entry process cost: 167,887 tokens at dispatch scope
(`node scripts/harness.mjs usage`, transcript message usage, cutoff
2026-09-19T00:35Z); cost in dollars unavailable. The eight surveys reported
1,852,818 tokens between them and ran 860 to 1,213 s each, in parallel.

## 1. What the operator observed, checked against the records

The observation holds, and the records show the mechanism.

- **The feed meant to carry suggestions carried records instead.** The
  follow-up register held 399 entries, 371 pending, 364 never triaged. 235
  entries are per-order decision records, harvested as follow-ups although a
  decision with a reopening observation is a record. Three planning passes
  took nothing from the feed (product 07 §Candidate — planner startup
  context), so the real items inside it were never met.
- **Nominations were attached to orders that did not carry them.** Two
  boy-scout items named for WO-135 and one for WO-110 (the refuter's
  conditional schema, its discarded result, the Codex temporary directory)
  appear in neither order. The extraction decided for `scenario.ts` was a
  conditional item on WO-068, which did not exercise it; the file sits at
  750 lines against a bound of 751. The kernel hygiene pair admitted on
  2026-09-16 waits for a kernel order that is not in the near sequence.
- **Final reviews hand items to "the next planning pass", and passes read
  the register, which does not collect final reviews.** The shared advisory
  marker that silenced the Stop completion advisory in four consecutive
  sessions (WO-133 FINAL-002) is the clearest case: nominated twice, in no
  register row, owned by nobody.
- **Deferrals lapse silently.** All seven documentation orders were deferred
  on 2026-09-08 until WO-053 closed. It closed on 2026-09-18 and nothing
  re-read them (§4).
- **Reopening observations occurred and nothing reopened.** The local-lane
  snapshot count passed its threshold of twenty (27); the once-per-order gate
  passed six minutes in sixteen of seventeen recorded final reviews; the
  README release block passed its fifteen-sentence bound (26); the runbook's
  installed versions changed. Each condition was written down and none has
  an observer.

## 2. What the surveys found

| Surface                                                  | Items read                                  | Record-only, fixed, superseded or duplicate | Open, fits one cleanup order | Open, needs its own decision or order |
| -------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ---------------------------- | ------------------------------------- |
| Register decision rows, WO-043 to WO-125                 | 102                                         | 98                                          | 3                            | 1                                     |
| Register decision rows, WO-126 to WO-141                 | 126                                         | 121                                         | 2                            | 3                                     |
| Register candidate rows                                  | 136                                         | 74 (46 historical, 14 allocated, 14 duplicate) | 6                         | 56                                    |
| Reviews and verifications, WO-002 to WO-032              | 116 reports and 74 final reviews in total   | 26 lines fixed or superseded                | 44                           | 1, plus 6 record-only                 |
| Reviews and verifications, WO-038 to WO-068              | (same corpus)                               | 22 lines                                    | 36                           | 11                                    |
| Reviews and verifications, WO-101 to WO-141              | (same corpus)                               | 17 lines                                    | 39                           | 5, plus 13 record-only                |
| Tree (scripts, packages, corpus, configuration, links)   | tracked files; 1,486 links in 74 documents  | 12 clean checks                             | 19                           | 1, plus 3 record-only                 |
| Planning documents, 47 receipts, releases, control state | —                                           | 13                                          | 24                           | 5, plus 8 record-only                 |

The columns overlap across surveys (the `scenario.ts` bound was reported by
four of them), so the rows are not additive; WO-142's 50 rows, several of which group
related one-line items, are the de-duplicated cut. The tree survey's clean results matter as much as its
findings: no TODO or FIXME marker, no lint or type suppression, no skipped
test without a stated condition, no AI attribution in history, every
`package.json` script target present, every test file reached by the runner,
`tsc --noEmit` clean in all four workspaces, and 48 dead links, all from two
generators (WO-142 rows A3 and A5) and one anchor.

**Register settlement.** The pass disposed every pending row through
`npm run plan -- followups --apply`: decision records with no outstanding
action are `settled` under their own reopening condition; records whose
condition fired and was answered are `settled` with the answering record
named; work an order owns is `allocated`; repeated nominations are
`duplicate`; live ideas that need their own order are `deferred` with the
source's reopening condition, or a suggested one labeled as the pass's; the
few that ask for an operator answer stay `open`. The counts before and after
are in §9. The collector change that stops the refill is WO-142 row A1.

## 3. The cut for WO-142

A row enters the order when all four hold: a survey observed it present at
`3b3533f8` with a path; the fix is local with a deterministic check; it needs
no product decision, no new gate, hook, key or recurring step, no
replay-sensitive, semantic-hash or worker-input change and no live spend
beyond the one feedback edition a skeleton order already pays; and no queued
order owns it. The order re-observes every row before editing, because a
survey is a lead, and ends each row as `fixed`, `not-reproduced` or
`returned` (at most six, never a starred row).

One order rather than several because the rows share one regenerated
bundle, one evidence edition and one gate, and because the operator asked
for one budgeted pass. The cost of that choice is breadth: 50 rows over four
packages, `scripts/` and the live documents. The row file makes partial
states visible, and the order's first operator-review assumption names the
split (Parts A and C from B and D) if the first day shows the breadth is
wrong.

## 4. WO-084 to WO-090 — move two, hold five

The seven orders were cut from WO-035 on 2026-09-08 with one typed
`planning-deferral` each, "documentation structure is not the product
bottleneck", until WO-053 closes or the operator waives it. WO-053's final
review completed on 2026-09-18T00:42Z (`docs/control/orders/WO-053.jsonl`),
so every deferral lapsed by its own terms. Each gap was re-measured:

| Order  | 2026-09-08 gap                               | Observed 2026-09-19                                                                                                                                                                                                                                                                       | Decision                        |
| ------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| WO-084 | the ledger grew at both ends                 | 31 `##` sections sit below the Resolutions boundary (line 6115 of 7,580), two of them operator ideation dated 2026-09-18; the header says never at the end. A planner reading newest-first from the top does not meet them.                                                               | move: pair with WO-142          |
| WO-090 | the guide was 804 lines                      | 1,772 lines; the directed-load measurement still exists (`scripts/harness-context.mjs`).                                                                                                                                                                                                  | move: the slot WO-138 cannot use |
| WO-085 | specifications accrete receipts              | true and worse, but its check refuses any new dated receipt paragraph under `docs/product/`, and `npm run release -- prepare` writes a dated roadmap note on every version collision (product 07 §Independent workflows); the check as written refuses the release tool's own output.     | hold: rewrite before it moves   |
| WO-086 | hand-kept retiming layers disagree with tags | 61 tags; the per-collision paragraph is machine-written by `release prepare`, so no recurring hand cost remains; it edits `scripts/release.mjs` beside queued WO-079.                                                                                                                     | hold                            |
| WO-087 | 650 lines of candidate policy in the roadmap | the roadmap is 1,674 lines; a pure relocation with no measured reader cost, cheaper once WO-085 and WO-090 settle what lives where.                                                                                                                                                      | hold                            |
| WO-088 | four phrase-table copies, one omits a phrase | not reproduced: the README, `docs/README.md`, the playbook and the guide each carry the same seven `resume:` phrases.                                                                                                                                                                    | hold: gap to be re-observed     |
| WO-089 | seven capability addenda and a missing row   | sixteen dated sections; but WO-135's continuing-work gate requires appended dated reassessments and refuses an overwritten row, and the refutation subject reads the rows, so a fold is a subject change at a planning boundary (inference from product 07 §Operator-opened planning pass). | hold: rewrite as a planning act |

**Two corrections to the planner's own first reading.** It first inferred
that WO-086 removes a recurring hand cost, because seven collision-retiming
paragraphs entered the roadmap in three days; product 07 §Independent
workflows shows `release prepare` writes them, so the inference was wrong
and WO-086 holds. It first read the operator's 2026-09-18 deferral of
cold-start efficiency "for a later pass" (WO-054-D006) as WO-090's subject;
the ceilings count `CLAUDE.md` plus the role skill
(`scripts/lib/process-budget.mjs` `measureColdStarts`), which WO-090 does not
reduce. WO-090 moves on the guide's growth alone, gains a criterion that the
generated bytes do not rise, and the role-text pass stays unowned (§6).

**Why any move.** Neither order is on the critical path, and the 2026-09-08
reason still holds for the product outcome. Both gaps are commons costs that
compound per order and both now have a free place: WO-084's surfaces are
written only by planning and ideation, so it pairs with WO-142 at no cost to
delivery; WO-138 cannot activate while WO-137's outcome is `inconclusive`
(its own preflight), so the lane beside WO-071 is empty and WO-090 fills it.
WO-142, WO-140 and WO-079 write product 07 before WO-090 measures it.

**Amendments.** WO-084: a measured Cost line; its check moves from `npm test`
to the document suite, because the stand-down keeps document checks out of
the product gate (receipt 017 carried this as a known issue); its write-back
names every current Resolutions reference instead of a `CLAUDE.md` section
that no longer has one; and headings stay byte-identical, because a receipt
addresses a planning pass by the hash of its ledger heading
(`scripts/lib/plan-subject.mjs` `planningPasses`). WO-090: a measured Cost
line, the placement, the re-observed gap and the no-rise criterion.

## 5. Decisions of this pass

Each names its source and its reopening condition. Decisions 4, 6 and 8, and
the open status of the recovery wedge in decision 12, were superseded the
same day by the operator's answers (§10).

1. **One cleanup order, WO-142, first in the queue, paired with WO-084.**
   Source: the dispatch; §2 and §3. Reopen: the executor's first day shows
   the breadth is wrong (split A and C from B and D), or more than six rows
   need returning.
2. **The register is settled and its refill is WO-142 row A1.** Source:
   product 07 §Candidate — follow-up register settlement; §9. Reopen:
   untriaged rows pass fifty after WO-142 closes.
3. **WO-084 and WO-090 move; WO-085 to WO-089 hold.** Source: §4. Reopen:
   WO-079 lands (WO-086); a phrase copy is observed to differ (WO-088); a
   planning pass rewrites WO-085 and WO-089.
4. **WO-138 becomes a single entry behind the pair that borrows its slot,
   and activates only on a `ready` readiness row.** WO-137 closed
   `inconclusive` (a measured live row; no attributable no-egress boundary);
   WO-138's preflight keeps it queued on that outcome and WO-110's order
   says its activation does not wait. The named next experiment, an egress
   boundary over the runner's lifetime
   (`docs/discovery/local-runner-2026-09-18.md`), is not drafted here: the
   2026-09-17 reversal clause gives the operator the decision whether local
   inference stays on the horizon. Reopen: that decision, or a readiness row
   that says `ready`.
5. **The operating mode stays as it is.** The 2026-09-17 pass set this
   decision for the checkpoint after WO-136's close. WO-136 closed
   `inconclusive`: forty launches reached thirty-eight cells, and missing
   attempts, prompt telemetry and revocation ordering prevent qualifying a
   new mode (the ledger's WO-136 outcome section). No observed failure of the
   current modes is recorded since. Reopen: R2, or an observed unattended
   effect that the current modes admitted and the matrix says a mode would
   have refused.
6. **Three operator-prioritized ideations stay open and are not drafted,
   because each needs one operator answer an order cannot guess.**
   Out-of-project file effects as an explicit grant (2026-09-18): which
   outside roots are always admitted (the system temporary root and a
   session scratch directory are written by every planning pass, this one
   included), and whether an ungranted outside write is refused or asked.
   Reversible permission-mode trials (2026-09-17): which mode to try and for
   how many orders; WO-136 landed without a mode to recommend. A bounded
   Tinkerer / Scientist experiment (2026-09-11, carried through four passes
   unselected): which linked mechanic it biases first. Reopen: the operator's
   answers; the next planning pass reads these three first.
7. **A probe script may be invoked by path.** Two final reviews asked
   planning to settle once whether rule 5 of product 07 §Research and
   guided-operator work orders requires an npm `probe:` alias. It does not:
   an order names the probe script and its command; an alias is added only
   when a second order reuses the probe. WO-142 row C10 writes the sentence.
   Reopen: a probe run that a reader could not reproduce from its order.
8. **The gate-duration observation is recorded and nothing is allocated.**
   Seventeen final-review gates since 2026-09-16: 303 to 1,178 s, median
   793 s, sixteen above the 360 s reopening threshold; the `fastGateMs` ceiling
   reads 120 s with no acceptance. The cause per gate is not analysed and a
   cleanup order is the wrong place to change the gate. Reopen: the next
   planning pass starts from a per-suite breakdown of those rows; the
   operator decides whether `fastGateMs` is raised with a reason or retired.
9. **The admission-and-observation slice is not filed although its filing
   condition is met.** Two lanes have closed eight orders since 2026-09-17
   against a condition of four
   (`docs/planning/concurrent-work-orders-plan.md` §Later slices). Queue age
   and completion rate have no consumer while the operator dispatches each
   order by hand; the resident's portfolio (WO-100) is the first consumer.
   Reopen: WO-100's activation.
10. **The concept registry stays deferred.** Its source asked the next
    planning session to decide (2026-09-07); no order on this horizon
    consumes a concept record. Reopen: the pattern workshop (WO-091 to
    WO-095) reaches activation, where authorable patterns are the first
    batch the proposal names.
11. **Carry-ins for queued orders are catalog preflight notes, not order
    edits.** WO-056: state whether host deadlines are the only stall bound
    (the kernel's Await timeouts decode and are never evaluated), whether a
    repair writer may edit the test its re-verification runs, and record the
    first real-model observation of the rewritten writer prompt and of the
    writer launch without the auto-memory flag. WO-079: evidence editions
    belong in the integration checklist, and merges made with hooks bypassed
    need a supported path. WO-074: criterion 5 asks for a version refusal the
    stand-down removed. WO-066: `roundLimit` lives on the repair's original,
    not on a work-order field. WO-103: the audit under-links a caller-error
    refusal and its oracle has no such cell. WO-110: remove the "until
    WO-110" string in the actor catalog and fix the two recorded probe-client
    defects before reusing the clients. Source: the final reviews named in
    the map's catalog rows. Reopen: an activation that ignores its row.
12. **What did not fit is nominated, not dropped.** Eighteen items are
    recorded in the map's new section for this pass's returns, each with its
    observation and a reopening condition. Seventeen are disposed `deferred`;
    the append-lock recovery wedge, the one return on the critical path, is
    `open`, so it is on the first page of the next feed (§6).

## 6. What was left out, and why

Not cleanup, each recorded as a map candidate: the append-lock recovery
wedge after a kill (WO-068 FINAL-001 F1), which gates `runtime.resident`
level 2 and needs its own order — the only item here on the critical path;
deriving the harness runtime pin list from the import closure; the three
recorded `reactor.ts` items for the next order that opens the file; the
gate's code identity ignoring untracked sources; the process meter counting
a worker audit as a verifier and starting its windows differently per
harness; a forward-only home-path screen for new reports and a second
sign-off-exempt author identity (both operator decisions); profile ids that
trail the installed CLIs (a live re-probe); unmeasured growth costs in the
index and the console collector; the inert Seiri evidence gate and the
reactor's two beacon discriminators (semantic-hash and replay-sensitive); the
mutation survivors and the `--check` outside the gate; the one-time WO-043
migration path; the subagent counter's refund, lock and amendment-correction
decisions; the digest pin dropped by `work-candidates-v1`; retention for
never-current evidence editions and the Codex session-identity join; the
GitHub Release backfill decision for v0.2.0 to v0.3.1; a transitive reactor
purity check; and five observations no survey could check. Role-text
efficiency, the operator's reserved later pass, stays on its existing record
(WO-054-D006), deferred.

Left alone by policy: 608 checkpoint refs, eight integration refs and six
stashes for closed orders are preservation records, and no retention rule
exists; an operator decision only. Absolute home paths in immutable reports
stay as written.

## 7. Declined alternatives — the NoOp register of this pass

1. _Do nothing._ The feed passes four hundred entries within a day at the
   observed rate, each pass keeps selecting nothing from it, and the unowned
   nominations stay unowned. Declined. Reverse: never; the operator budgeted
   the pass.
2. _Several cleanup orders by surface._ Declined: §3. Reverse: decision 1's
   reopening condition.
3. _A standing rule that every order takes one nominated item._ It is the
   conditional boy-scout rule that produced the unexercised items of §1.
   Declined. Reverse: a closed order observed exercising a conditional item
   it did not have to.
4. _Have planning passes read final reviews._ A pass that re-reads 190
   reports is this pass; it cost eight surveys. The cheaper fix is at the
   source: a reviewer's nomination becomes a decision record with a named
   follow-up, which WO-142 row A1 makes the feed's admission rule. Declined
   as a planning duty. Reverse: a nomination found in a final review and in
   no record after WO-142.
5. _Move all seven documentation orders._ Five are stale, colliding or
   already automated (§4). Declined. Reverse: decision 3's conditions.
6. _Fold WO-084 to WO-090 into WO-142._ Judged contracts with their own
   criteria; one order that cannot close until seven structural moves pass
   is the partial-completion trap. Declined. Reverse: none recorded.
7. _Draft the out-of-project grant order now._ The operator set it for
   priority, and a fifth refusal at the hook boundary written without the
   two answers decision 6 names would guess at the operator's own files.
   Declined for this pass. Reverse: the answers.
8. _Edit the six queued orders that file a one-sentence README duty._ One
   sentence in product 07 §Documentation freshness (WO-142 row C1) gives the
   duty its reading without changing six judged contracts. Declined.
   Reverse: the block passes fifteen sentences again after WO-142.
9. _Prune Git checkpoint refs and stashes._ Preservation is policy
   (CLAUDE.md; the playbook). Declined. Reverse: an operator retention rule.

**Goal alignment.** Mission: operator flow. The pass spends one lane pair on
work that is off the critical path, which is the seeking-the-wrong-goal
risk; the bound is one budgeted pair, no delivery order displaced, and rows
B7 (the verifier's unstated summary bound) and B4 (the refuter's lost
results) sit directly ahead of WO-056 and of every later planning pass.
Commons: the register, the guide and the ledger are shared reads that every
order grew and none accounted for; A1, WO-090 and WO-084 are the accounting.
Drift to low performance: four written reopening conditions fired unnoticed
(§1); the pass records each, and the structural answer, an observer for
reopening conditions, is not proposed because no evidence yet shows a cheap
one. Escalation and policy resistance: WO-142 adds no gate, hook or recurring
step, and WO-084's check moves out of the product gate. Rule beating: the
`returned` state could close the order without the work, so it is capped at
six, barred from starred rows, and each fixed row needs a check that fails
when its subject is reverted. Shifting the burden: row A4 and the B3 read
list remove two recurring operator rescues. Success to the successful: the
held documentation orders are not protected by their age; two are marked for
rewrite. Naive interventionism: `reactor.ts`, worker inputs and semantic
hashes are fenced off, and B3, the one row that touches an enforcement
boundary, may be returned and judged alone at the operator's word.

## 8. Reversal conditions for this plan

Reopen at a planning pass when: WO-142's executor returns more than six rows
or stops on a starred row; untriaged rows pass fifty after WO-142;
a nomination is found in a final review and in no record after WO-142;
WO-084's move changes a planning-pass id; WO-090's measurement does not fall
for every role; the operator answers any of decision 6's three questions or
decides the local-inference horizon; or a second kill wedges the resident
store before the recovery order exists.

## 9. Evidence of this pass

- Entry: clean `main` at `3b3533f8` (v0.31.1); canonical status showed WO-137
  closed; `npm run plan -- start outstanding-cleanup`; register revision
  `1f71df9f…`, 399 entries, 371 pending (364 untriaged, 4 invalidated, 1
  open, 2 deferred).
- Surveys: eight read-only background agents, no descendants, 78 to 182 tool
  calls each; reports retained in the session's scratch directory, outside
  the repository.
- Hand checks: `wc -l` on the guide (1,772), the roadmap (1,674) and
  `scenario.ts` (750); the ledger's 31 sections below line 6115; the four
  phrase-list copies; the seventeen `FinalReviewCompleted` gate durations
  read from `docs/control/orders/*.jsonl`; `measureColdStarts`'s inputs by
  `wc -c` (20,849; 17,891; 19,109; 12,437; 13,509); `.runtime/harness` (27
  entries, 80 MB) and `.git/dotln/suite-success` (96 MB); the thirteen order
  rows named in WO-142's observed gap.
- Register after settlement: 417 entries (the 18 returns added), 389 rows
  disposed by this pass through `npm run plan -- followups --apply`; none
  untriaged; five open (the planner-startup measurement, the authority
  candidate carrying two operator-prioritized ideations, the gate-duration
  reopening, the Tinkerer experiment, the append-lock recovery wedge) and 76
  deferred with reopening conditions.
- Not run: any code suite (a document-only pass) and any live model.

## 10. Second pass, same day — the operator's answers

After the first handoff the operator answered the open decisions and
corrected the pass. Captured verbatim in the same ignored intake note.

**Corrections the operator made, and what changed.** The handoff compared a
ceiling in milliseconds with durations in seconds; every duration in this
pass's documents is now in seconds. It listed `fastGateMs` and the
"append-lock recovery wedge" as decisions without saying what they are; both
are stated plainly below. It told the operator that the one critical-path
item waited for the next planning pass while a planning pass was open; a pass
plans what it finds, so the item is an order now. It read WO-137 as a blocker
where the operator saw a success; the operator's reading is the better one
for what the next order needs, and the record below says why.

1. **Outside-project writes need a grant from a role or support
   ([WO-144](../work-orders/WO-144-outside-project-write-grant.md)).** The
   operator's answers settle the two open questions of the 2026-09-18
   ideation: the grant lives on specific roles or supports; temporary and
   scratch roots may be common; a save into the operator's project, document
   or desktop folders is refused without specific authorization or direction;
   work-stream-facing roles of the enterprise starter declare their own
   outside roots when they are written. The order reuses the extractor and
   path resolution WO-135 added, so it adds one refusal and no classifier,
   and it states its width honestly: known destinations only; an opaque
   program stays under host permissions. Reopen: a legitimate write refused
   in a real session, or an outside write the journal shows admitted without
   a grant.
2. **No permission-mode trial is filed.** The 2026-09-17 ideation proposed
   trying harness permission modes across a few orders. The operator's
   answer: the sandbox is relaxed for throughput only, and the direction is
   machinery in roles and supports that makes dangerous activity
   deterministically impossible. WO-144 is the first such mechanism.
   Reopen: the operator asks for a recorded comparison of modes.
3. **The first Tinkerer experiment is economy
   ([WO-145](../work-orders/WO-145-tinkerer-economy-experiment.md)).** The
   operator's answer: consider the aspects of quality from _Zen and the Art
   of Motorcycle Maintenance_, starting with efficiency and speed. The book
   names thirteen aspects; economy is the one that matches. One optional
   executor support, one experiment per order inside 900 s, three trial
   orders, a reading fixed before the trials. Reopen: the third trial
   order's record.
4. **Local models: WO-138 activates on WO-137's successful live row.**
   WO-137 loaded the pinned model, completed inference, passed the schema
   and tool round trip, produced a byte-identical determinism triple and
   stopped a cancelled request within five seconds. Its label is
   `inconclusive` for one reason: the session ran with networking permitted,
   so it could not prove the runner sends nothing off the machine
   ("no-egress"). That proof matters before a local role reads private
   material. WO-138's inputs are committed public material and a seeded
   scratch repository, so the proof does not bear on it; the order is
   amended, keeps its slot beside WO-071, and qualifies no private-input
   role. Bulk read-only triage, the work this pass paid 1,852,818 remote
   tokens for, is nominated in the roadmap as the next local role to test.
   Reopen: a local role that would read private material, which needs the
   no-egress experiment first.
5. **The 120 s gate ceiling is unset; the gate's duration stays an open
   candidate.** `fastGateMs` was WO-126's budget for a fast test gate. WO-132
   removed that gate and kept one full product gate per order, and the
   metric has read that full gate ever since: 303 to 1,178 s across the
   seventeen final reviews since 2026-09-16, median 793 s, against a 120 s
   ceiling nobody enforced and no acceptance ever covered. The ceiling
   compared two different things, so it is unset in
   `docs/control/budgets.json` with a dated source sentence. Whether the
   13-minute median can come down is a real question this pass cannot plan
   honestly: the gate rows it could read carry totals and no per-suite
   durations, and an order written without them would guess. Reopen: a
   per-suite breakdown of one recorded gate.
6. **The resident's lock recovery is an order
   ([WO-143](../work-orders/WO-143-resident-lock-recovery.md)).** In plain
   terms: every time the always-on resident touches its store it first makes
   a marker directory, does its checks, and removes the marker. If the
   process is killed in the 0.004 to 0.017 s while the marker exists, the
   marker stays, nothing records whose it was, and every later start refuses
   until a person deletes it. The resident passes through that window
   several times per tick, so an unattended resident will eventually stop
   for good this way, and the capability table will not call
   `runtime.resident` dependable until it is closed under test. The order
   makes the marker name its owner so a dead owner's marker is reclaimed
   after the same inspection a dead owner's lock already gets. Reopen: WO-111's
   first unattended hour.

**Sequence.** WO-143 and WO-144 pair directly after the cleanup pair: their
surfaces are disjoint and both follow WO-142 in files it also edits. WO-145
pairs with WO-090 after WO-140 and WO-056, so the delivery lane waits one
added slot, not two. WO-138 returns to its slot beside WO-071.

**Goal alignment.** WO-143 is critical-path work the first pass wrongly left
open. WO-144 answers an operator priority with the smallest mechanism that
makes the recorded incident impossible, and adds a refusal against the
stand-down's grain; the bound is the existing extractor, a fail-open guard
and an inventory before any default. WO-145 adds cost with no removal named
in advance, under a dated operator acceptance, capped at 900 s per order and
ended by a reading fixed beforehand. The WO-138 amendment removes a
precondition that guarded a claim the pilot never makes. NoOp for each: the
resident stays one unlucky kill from a manual repair; the next stray redirect
lands wherever it points; the Tinkerer request enters a fifth pass
unselected; local-model testing waits on a proof it does not need.

**Evidence of the second pass.** `packages/skeleton/src/worker-store.ts`
(`acquire`: the guard has no owner; `host.lock` records a process id and is
probed with signal zero); WO-068 FINAL-001 §F1 and §O2;
`packages/skeleton/src/harness-host.ts` `planningWriteRefusal` (outside paths
are skipped today); `docs/discovery/local-runner-2026-09-18.md` §Boundary
and claim limits; `scripts/lib/meta.mjs` (`fastGateMs` reads the last passing
`npm test` row) and WO-126's definition of the fast gate; the seventeen
`FinalReviewCompleted` gate durations; the book's list of aspects, checked
against a published quotation. One planner inference was corrected while
drafting: `host.lock` records a process id only, not a start identity.
Register after the second pass: 417 entries, none untriaged, two open (the
planner-startup measurement and the gate-duration candidate) and 75
deferred with reopening conditions.

