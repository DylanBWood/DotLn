# Standard planning pass with 5S and the operator's notes, 2026-10-02

Document-only planning pass on branch
`planning/2026-10-02-standard-5s-operator-notes` from clean `main` at
`08845c71` (the REVIEW-005 pass merged; WO-062 published as v0.65.0).
Between work orders. Every figure names its source; a value nobody
observed is written as unknown.

## 1. What was asked, and the subject

The operator's dispatch, `planning: standard planning + 5s + personal
notes`, and one mid-turn message carrying the notes (both captured
verbatim in ignored intake,
`docs/intake/notes/2026-10-02-standard-5s-operator-notes-planning.md`,
SHA-256
`bcf6ad611c4c07ea5169d23143705455a99bc0619872779c6cce63b7dc8e081a`).
The notes are a list kept over the previous day; the operator says some
items may be out of date and asks that each be judged against the
repository as it stands. Paraphrased, in the order given:

1. A first-class router one level below how the operator works today: a
   top-level session that only routes, spawning one sub-agent workflow
   per lifecycle phase, serially, through release close; it resumes
   failed or interrupted phases, hands the phase workers nothing, and
   each phase worker carries its own sub-agent cap. Needed once the
   enterprise starter exists, for a constrained managed host where only
   the main thread is metered.
2. Stop comments that cite process identifiers instead of explaining
   code.
3. The front-page README keeps gaining appended status text. It is what
   most visitors read; it must be excellent, and it is probably too
   long. Much of it is liked.
4. The operator's messages still appear verbatim in the repository,
   though this may already be fixed.
5. Are the system-trap and goal-alignment passages written before the
   work, or afterwards to justify it?
6. Final reviews fail and return to repair too often. Verification
   should also audit the implementation, look for edge cases and ways
   to game it, and suggest improvements; final review should rarely
   find something new. An executor might spawn at least one adversarial
   or improving reviewer even without the multi-agent mode.
7. A corpus order ran a test whose memory use grew without bound until
   the machine reported it was out of memory. No order may be able to do
   that.
8. The work-order index, roadmap and sequence should show only future
   work, all of it, in one sensible order.
9. A change anywhere re-runs tests everywhere, and every session waits
   on gates. Fix or reduce this without lowering coverage, with thought
   and without another stop-gap; if this is already the best available,
   say so. Final review may always run everything.
10. File at least one order that combines many small items, each with
    its change and its criterion stated; plan it with extra care. Larger
    self-contained orders may be filed too.
11. No "economy decision" so far has been interesting, and there is no
    reason for one at the start of an order before any alternative can
    be seen.
12. The operator is supervising terminals and supplying planning input
    more than before; several axes are moving the wrong way while the
    critical ones are not moving.
13. Byte figures in acceptance criteria must rest on something.
14. The list was kept over a day; weigh it against the current state.
15. From a private fork of the starter on a constrained managed host: a
    standard way to ask core for a capability, answered in this
    repository and returned through the update path; and a way to map
    the capabilities and rules of `v1` and its intermediate generation
    onto the fork without that material leaving it.
16. That host meters only the main thread. Use that. The fork must also
    be at least as capable as `v1`.
17. A deliberate, adjustable way to make pull requests, commit
    messages, release notes and public documents a pleasure to read:
    named dimensions, example renderings, a committed choice per
    release, per surface.

Subject: `npm run plan -- failures` since receipt 037 and the lifetime
record; `plan conditions`; the register at revision `009497ee…` (854
rows, 225 pending: 13 open, 2 needs-review, 57 untriaged, 153 deferred),
read whole from `followups --export`; the sequence of 26 queued orders;
the gate index (10,256 rows, 2026-09-09 to 2026-10-02) and 109 per-order
meter snapshots; 160 final-review and 259 verification events with the
reports they name; the role skills and their compiled source; the
runner; the README and its history; the tree for the 5S inventory;
products 03, 05, 06, 07, 10 and 12 where the notes touch them.

Fan-out against the cap of twenty, each step stated before its spawn:
seven read-only research workers and one refuter planned at entry
(review funnel, gates, decision records, 5S, public surfaces, starter
and orchestration, the memory incident); two more workers added to
re-observe every candidate item of the combined orders at `HEAD`; one
documentation lookup. Agents ran on `opus`; the root's selected effort
was `max`, so they inherited `max` and not the guide's `xhigh` (§14).

How to read the rest: §2 is the standard pass's entry reading. §3 to §8
take the notes by subject, each with what the record shows and what the
pass decided. §9 and §10 are the two combined orders, item by item. §11
is the 5S inventory. §12 to §19 are the register, the orders and
sequence, cost, what was declined, the ceilings, goal alignment, what
would reverse a decision, and the independent review.

## 2. What failed since the last pass, and the conditions that hold

`plan failures` over the window since receipt 037 (2026-10-02T04:12Z):
no failed verification, no failed final review, no repair. Four
corrections fall in it, all from decisions merged just before:

| Decision | What it was | Route |
| --- | --- | --- |
| WO-062 D004 | The executor corrected its own type narrowing and an incomplete experiment record | None; the experiment record's form is one more cost of the rule §6 changes |
| WO-062 D008 | The verifier failed VER-001 on a defect inside the order's surfaces: the fixture was invented from a misread of the forge's data | The in-surface rule working as intended; the cause (a fixture standing in for real input) is an attack axis in WO-187 |
| WO-062 D011 | The repair's design | None |
| WO-124 D015 | An absolute home path removed from two transcripts; policy asked of the planner | WO-188 item 12 |

The lifetime record: 99 failed verifications, 13 failed final reviews,
115 repairs, 146 orders made ready, 63 failed first verifications, 128
corrections, 2 waivers, 37 execution amendments, 3 overridden holds.

`plan conditions` (22.389 s) reports two conditions holding and two not
measured:

| Condition | Value | Disposition |
| --- | --- | --- |
| Tracked evidence added since Monday | 12,523,596 bytes against 10,000,000 | Re-deferred by the REVIEW-005 pass earlier the same day; the same week, nothing new to decide |
| Executor cold-start bytes | 28,290 against a predicate of 24,576 (the ceiling in force is 29,246) | The efficiency redesign is the operator's reserved pass; the row stays open and is reported to the operator. WO-188 item 22 removes the 1,173-byte experiment paragraph; WO-187 adds sentences |
| Document gate and document check medians | not measured at entry (`--slow` not run) | Read from recorded rows instead: 38.2 s median in October (§4) |

The meter's per-order snapshots cover one week well. Week of 2026-09-28:
31 orders, 75.4 hours of recorded phase time, 16.6 hours of gates (22%),
8 failed verifications, 3 failed final reviews, 10 repairs, 1.32
recorded operator corrections and 1.00 recorded directions per order.
Earlier weeks hold one or two snapshots each, so the meter shows no
trend.

On note 12, the record can neither confirm nor refute that supervision
has grown: the prompt journal that counts operator messages began on
2026-10-01. What it does show is where the operator's time goes, and
those are the causes the orders below take: every order needs at least
four phrases typed into separate sessions (§8); thirteen failed final
reviews cost a median 1.8 hours each from failure to pass (§3); gates
are 22.5% of phase time and a session cannot write its records while one
runs (§4); and this is the fourth planning pass in three days.

## 3. Final reviews that fail, and what verification is asked to do

Thirteen final reviews have failed, one per order, on eighteen blocking
findings (control events and the reports they name).

- Fourteen of the eighteen were already in the subject the last passing
  verification judged. Three arose because `main` moved after
  verification; one was latent in shared code and surfaced on the
  integrated tree.
- Of the fourteen, eight sat in an area the verifier examined with
  probes narrower than the reviewer's (a kill path probed only with a
  correct record; writes probed only from the worktree root; one prefix
  token and never two; the fixture's layout and not the corpus's). Six
  sat where the verifier ran nothing: four machinery suites only
  `npm test -- --review` selects, two release-surface rules.
- The reviewer found them by its review gate (4), a gate timeout (1),
  its own probes (5), an adversarial sub-agent (2) and the
  release-surface check (2). Three reviewers wrote that their own
  reading had passed over what the sub-agent found.
- The weekly rate is flat: 8%, 11% and 10% of first final reviews since
  2026-09-14. 2026-10-01 is the outlier, three of twelve, on a day when
  one of twelve first verifications failed against 23 of 30 in the six
  days before. Why that day differs is not established.
- Passing final reviews find things too: 33 of the last 40 orders had
  items boarded or fixed by the reviewer (about 71 boarded in 27 orders,
  21 fixed in 12).
- Verifiers do more than rerun tests: of the 40 most recent reports 39
  ran probes of their own and 37 ran adversarial or evidence-integrity
  checks. Three said anything about design or maintainability.
- The verifier's written duty is one sentence about the acceptance
  criteria. Nothing asks it to review the implementation, attack it or
  propose anything; the executor's text has no self-review step. The
  reviewer is fed planning duties the verifier is not.
- A re-verification carries untouched criteria forward; one failing
  defect entered with a repair.

Decision: [WO-187](../work-orders/WO-187-verification-attacks-and-reviews.md).
The operator's mapping is taken as given: the executor is development,
verification is the pull-request review and the attack, final review is
acceptance, release close is production. Verification gains three duties
in a fixed order (attack along named variations; review the whole diff
with three routes for a finding; one fresh adversary), a re-verification
re-derives what a repair touches, and the sentence that stopped two
verifiers probing on 2026-10-01 is completed. The executor runs one
fresh adversary before each completion. Final review keeps every duty it
has and classes each finding as an escape, an integration finding or new
scope; planning counts escapes per final review. Spawned workers run a
generated definition with the pinned model and effort.

What this does not promise: a longer verification (median 842 s now) and
one more sub-agent per completion are the price, and the escape count is
the test. Three of the eighteen findings came from `main` moving and no
verifier duty reaches those.

## 4. Gates

The question in note 9 has a measured answer in two parts.

**Selecting suites by what a change affects is not the lever.** A
replay of the last thirty merged orders, each against the import and
literal-path closure of every product task at `HEAD`:

| Reading of "affected" | Median share of task time still affected | Mean | Orders fully affected |
| --- | --- | --- | --- |
| One literal hop, version literals normalised (closest reading) | 99% | 74% | 6 of 30 |
| Imports only (an unsound lower bound) | 76% | 64% | 6 of 30 |

The wall-clock floor stays at the 341 s skeleton suite in 23 to 25 of
the thirty. The graph is tangled in three places, not everywhere: seven
shell suites copy all of `scripts/` (421 s, 34% of task time); one suite
is dominated by one case of about 170 to 190 s; one clones the whole
committed repository (287 s). Five orders that touched only corpus or
documents would have skipped almost everything, but only if results were
shared across worktrees. Every earlier reuse layer (four orders in
September) failed on a key that was either too broad to hit or unsound,
and was removed.

**Three things are recoverable now**, from the gate index:

- An order pays a median of three fresh product gates (1,660 s) and
  seven document gates (201 s); gates are 22.5% of phase time since
  whole-row reuse shipped.
- The plain gate's median grew from 252 s (2026-09-15) to 327 s (since
  2026-09-26) and 492 s in October (three rows); the review gate with
  the two exclusive suites from 639 s to 838 s. Suites grew from 19 to
  29. Three cases carry most of the growth: the lock matrix in the
  skeleton suite (about 170 s); one harness case that took 2.77 s on
  2026-09-08 and about 158 to 193 s on 2026-10-01, cause unknown; the
  integration suite, 135 s on 2026-09-29 and 279 s the next day, cause
  unknown.
- Reruns: fourteen reruns at an unchanged identity after a failed row or
  a grown selection cost 8,384 s, where running only what lacks a
  passing result would run 9% to 36% of the task time. Sixteen more
  repeated an identity already green and covered (8,555 s). Forty of 97
  runs overlapped another order's gate.
- Soundness gaps that make a reused row unsafe today: the identity
  ignores untracked code; seven script suites read documents the
  identity excludes; the review selection is taken against a moving
  branch tip.
- While a gate runs, a session may not write its own decisions or
  report.

Decision: [WO-186](../work-orders/WO-186-gate-time-follows-the-change.md).
The three slow cases repaired at their cause, with per-case durations on
the rows so the next one is seen; reuse per task at one code identity,
with a second-process proof for every reuse path, the rule the
September stand-down set; an identity that covers every byte that runs;
main's rows read from a worktree; selection against the merge base;
writes to the active order's own record directories admitted while its
gate runs; two conditions listed at planning entry. Final review and
`--again` run everything, as the operator allows.

This is not the best the gates can be, and the pass does not claim it
will be after WO-186. It is what the measurements support building. The
per-task memo, the shell suites' copying and lane packing are declined
with reopening tests (§15); the replay script is kept as evidence so the
next pass can rerun it.

The document gate: 38.2 s median in October against 25.1 s since
2026-09-26. The growth is the document-tagged console and skeleton cases
WO-174 moved (26.0 s and 20.7 s in parallel lanes); the document check
is 11.1 s. No order is filed for it.

## 5. The memory incident

Recorded in WO-102 D010 and WO-105 D006, and reconstructed read-only.

- During WO-102's final review on 2026-10-01 the reviewer ran a mutation
  probe nothing required, by hand, with no bound: `node --test` over the
  three WO-102 corpus test files against planted kernel drifts. Single
  test processes reached 24 to 27 GiB resident. The operator reported
  the machine's total far higher and climbing.
- No mechanism stopped it. The executor of another order, in another
  worktree, noticed and signalled the processes.
- The likely mechanism (an inference, not measured): a failing strict
  deep comparison of a very large collection against an empty one makes
  the test runner's assertion build a line diff whose working memory
  grows with every edit level, outside the managed heap, so a heap limit
  does not bound it.
- A second event the same day is unattributed: one `node` process at a
  388.56 GiB footprint with 4.9 GiB resident. No gate or session command
  matches it, and it may not be this repository's.
- Containment today is a 900 s wall clock per suite inside `npm test`.
  Nothing bounds memory, process count, or gates across worktrees; a
  command an agent runs directly is unbounded; a runner that dies leaves
  its suites running; the two existing watchdogs read resident size,
  which the second event shows can be a hundredth of the footprint.

Decision: [WO-185](../work-orders/WO-185-no-order-can-exhaust-the-host.md).
A guard that runs outside the agent, measures footprint, and stops the
offending process group, never the agent; budgets as shares of the
host's physical memory with a measured basis; the runner's own budgets,
signal handling and survivor sweep; one guard and one lane count per
user on the host, shared by every clone; a bounded wrapper for any probe run outside a gate, with the
role sentence that names it; bounded assertions in the corpus tests that
can produce the diff. The guard is the part that does not depend on an
agent choosing to use it.

Until WO-185 lands the only protection is a rule a role reads. The
standing instruction file is the operator's, so the pass proposes the
sentence in its report and does not add it.

## 6. Decision records: goal alignment, experiments, byte figures

**Goal alignment (note 5).** Over the 25 most recently closed orders:

- Timing from the repository alone: the analysis is absent at activation
  and present at `implementation-ready` in all 25; one is demonstrably
  written after the work (it cites later decisions and measured
  results); for 24 the order within that window (median 61 minutes) is
  unknown. A research worker also read local session-log metadata
  (timestamps, paths and keyword counts) to order the first trap
  analysis against the first code edit; a deeper pass was refused by the
  host's permission classifier and not retried, and the derived files
  were deleted. That ordering is reported to the operator and is not
  used here.
- Content: 24 address all eight lenses; 21 restate constraints the order
  already sets; 3 tie a lens to a safeguard the order lacked; none
  chose NoOp or cut scope. The lens is most visibly useful later, in
  repair and verification choices.
- Planning passes: two of the last five record a decline or reshaping a
  lens caused.

So the passages are mostly not written afterwards, as far as the
repository can show, and mostly do not change the work either.

**Experiments (note 11).** 64 records, one for every order since the
support became default equipment: 33 declined and 31 run; 15 adopted
something, 8 of those measuring both arms; 4 state a per-order
wall-clock effect. Codex executors declined 30 of 38 and Claude Code ran
23 of 26. Since 2026-09-30, 17 of 21 are declines. The rule asks for the
experiment before implementation, and the median record is written 5.7
minutes after activation. What the adopted ones taught is real (focused
tests while iterating, one Git process in place of many, minimal
fixtures); the declines are the cost of asking before any fork is in
view. The reopening test WO-150 set for its own default was never read
by a pass; this one read it.

Decision: WO-188 item 22 replaces both sentences. A lens is written when
it changes what the role will do, with the NoOp, and nothing is written
when none applies. An experiment is run when the work shows two credible
ways that differ on a named axis, and an order may name one.

**Byte figures (note 13).** Three mechanisms carry them:

| Figure | How it was derived | What happened |
| --- | --- | --- |
| Document ceilings | The document's size on the landing day plus two per cent | Product 07 used its headroom in 25 hours and again in three days; four document-gate failures; three orders hit it on 2026-10-01 |
| Cold-start budgets | Round initial values, then measured size plus 4,096 | Advisory; eight order acceptances and three planning acceptances |
| "At most N bytes" in a criterion | The planner's division of the headroom of 2026-09-28 among queued orders | Forty figures in 24 queued orders, now larger than the headroom they cite |

At least 29 records in 19 closed orders were caused by a byte bound: a
verification failure, a waived criterion, repairs, corrections,
acceptances.

Decision: three planning rules, added in place to product 07, and the
ceilings reset on the new basis (§16). A criterion says what a
write-back states and where, without a count. A pass that files or keeps
a write-back to a bounded document sets that document's ceiling to cover
it. A duty an order owes beyond its criteria is written in that order,
under `Known issues and carry-ins`, where the verify briefing will print
it; a known issue from the pass's own receipt goes on the order's
catalog row until a later pass amends the order, because a judged order
is frozen. The bound stays, as the operator asked; its basis is now the
plan.

## 7. Public surfaces: the front page, operator words, the lists, published text

**The front page (note 3).** 37,717 bytes; 4,841 on 2026-08-31. 138 of
181 merged pull requests changed it. The release block was pruned to
2,927 and then 2,613 bytes and is 7,894 today, about 46 sentences
against a fifteen-sentence rule nothing checks. The causes are rules: the
playbook makes the block part of every versioned order, `release
prepare` refuses without its version line, and five queued orders name a
front-page write-back. About 10,400 bytes are receipts and tooling
detail. Decision: [WO-189](../work-orders/WO-189-front-page.md): an
inventory, three complete candidates scored by fresh readers, the
operator's choice, a release block of one generated line, and a check
that refuses an order's edit unless its criteria name the page. A third
prune under the same rules is declined; two regrew.

**Operator words (note 4).** Mostly fixed. No intake-sourced line
entered a tracked file after 2026-09-29, and the eight merges after
WO-178 add no line matching the quotation patterns. Three decisions
committed operator wording after the earlier fixes and before WO-178,
and lie outside its inventory (WO-102, WO-140, WO-181). The check is
advisory and does not read JSON fields such as `evidence`, reports or
planning documents. Decision: WO-188 item 13 widens it, makes a new
unattributed quotation a refusal at completion, and paraphrases those
three. Operator-authored public wording kept by direction stays.

**The lists (note 8).** The index is 685,899 bytes: the queue is 2,209,
closed cards 309,934, a hidden tag record 284,852. Open cards print in
identifier order. Six superseded umbrella records and WO-014 are listed
as other open work. The roadmap's first pending rung follows 63,915
bytes of history, and 25 of 26 sequenced orders appear nowhere in it.
Decision: [WO-190](../work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md).
In this pass the sequence file's prose is cut to its live rules, lane
pairs return, and WO-014 takes the last place so that no open order
sits beside the list.

**Published text (note 17).** Ten recent pull-request bodies: median
7,955 characters, 39% machine-generated, with 74 to 81 cells reading
`unavailable`; relative links that do not resolve on the forge (inferred
from URL resolution, not from a loaded page); one order title printed
five times on each Release page. Defects go to WO-188 item 24. Taste
goes to [WO-191](../work-orders/WO-191-reader-profiles.md): a committed
profile per surface over five named dimensions, an examples library to
choose from, guidance printed where the text is written, and a score
from fresh readers collected at planning passes. Nothing is refused or
rewritten because of a profile, which is the pass's answer to the
operator's caution about intervening naively. A scheduled polish job is
declined until two profile revisions have scores that differ.

## 8. The starter instance: a router, requests to core, a private predecessor map

What is planned today: the export kit and its runtime (WO-074, WO-075),
target worktrees and profiles (WO-072, WO-073), the instance's build
overlay (WO-076), the update (WO-077), receipts (WO-078), then the
resident-owned loop from a starter (WO-118). The starter repository is
named in product 03; its current contents were not read. The settled
rules hold: an instance's content never flows back to core, and a work
deployment gets its own decision record in the instance.

What no order covers: a router for this repository's own role lifecycle
(the resident and the portfolio drive target orders through runtime
actors, not role sessions); a route from an instance's need to core's
planning; a place for an instance's private record of what its
predecessors did.

- [WO-192](../work-orders/WO-192-router-drives-an-order.md). One phrase,
  `drive: WO-NNN`, selects a router that reads the canonical status and
  starts a fresh worker for the one routable action with the phrase as
  its whole prompt. The worker runs its own dispatch and records its own
  completion. Identity, writer reservation and sub-agent budget are kept
  per worker. The design rests on host behavior read from documentation
  on 2026-10-02 and not yet probed here, so the order's first criterion
  is the probe, and one separate session per phase is the named
  fallback. What a constrained managed host meters is the instance's
  first-order question and is not recorded here.
- [WO-193](../work-orders/WO-193-instance-capability-requests.md). A
  request is a generic statement the instance's operator writes or reads
  and marks ready. The route is `none` until that operator sets it;
  `manual` prints the text to file from wherever is allowed; `direct`
  files an issue under a grant. Planning here reads labelled issues into
  register candidates through the screened issue reader. The update's
  note tells the instance which requests a release answered.
- [WO-194](../work-orders/WO-194-private-predecessor-map.md). A row per
  predecessor behavior: its generation, a generic statement, a private
  source reference, a mapping status, and what in the instance carries
  it. A report says when a generation is fully carried. Core ships the
  command, the schema and seed rows it already states publicly; every
  fixture is synthetic. An unmapped row can open a request holding its
  generic statement and nothing else.

Placement: after WO-118, the loop from a starter instance, so that the
product exit does not wait behind them (§19, §20); the notes ask for
them once the starter exists. WO-192 depends on nothing in
the export and would also end the operator's own phase-by-phase dispatch
here, so it can move into the machinery lane after WO-188 at the
operator's word (§18).

## 9. Seams before the vertical

WO-123 composes primitives that have all closed. Their reviews boarded
items with a deadline of WO-123's activation, and the reactor it must
edit is 99,655 of the 100,000 characters the verification capsule
admits. Two workers re-observed every item at `08845c71`; all are still
present. [WO-184](../work-orders/WO-184-seams-before-the-vertical.md)
settles them in one order, because they share one deterministic re-mint
of the five editions and one live feedback episode. WO-123 now depends
on it.

| Item | Source | Change |
| --- | --- | --- |
| 1 to 3 | WO-124 D014 | A derivation with no surface is a NeedsHuman; only rule coverage counts; the noun boundary includes the hyphen |
| 4 to 6 | WO-061 D011, D010 | A whitespace-only image span derives no statement; duplicate relation entries are deduplicated; a reply follows the first later entry by another role |
| 7 | WO-065 D014 | Response values reused as forge arguments are validated; a fixed error reason; text the screen cannot process is contained |
| 8 | WO-182 D006 | A flagged publish repeat re-evaluates readiness; a not-applicable reading for the checks row |
| 9 | WO-066 D011, D014 | Four outcome defects of the review loop |
| 10 | WO-114 D013 | A configuration path that is not a regular file is refused without blocking |
| 11 | map item, 2026-09-19 | An unreachable guard deleted; three decider-free regions moved byte for byte to a leaf module; one untyped payload typed; the reactor at most 92,000 characters |
| 12, 13 | WO-181 D014 | A review-enabled stream re-verifies every criterion after an in-stream repair; the verifier is told a review follows, with three live attempts that must all pass |
| 14 | WO-058 D010 | The claim-type enum narrowed to the capsule's own |
| 15 | WO-066 D012 | A host-owned sandbox profile file; no asterisk in the admitted command text |
| 16 | WO-175 D012, D013 | The prompt's joining space; the temporary directory in the worker's environment only |
| 17 | WO-159 D010 | The episode supervisor stops its process group on a signal |
| 18 | WO-099 D027 | An answered unknown names the incomplete capsule |
| 19 | map item; WO-181 D012 | A transitive purity check with two reasoned exclusions; a review-failure fixture |

Kept out of WO-184, each with its home: the machine-login and link-host
declaration is decided here and written into WO-073 as a criterion (a
registration may declare both; default empty; classing and storage
change, trust does not). The struck-span reading, the control-character
rule, the unread repair-plan list and the review context without
surfaces are recorded in WO-123's `Known issues and carry-ins`.

WO-123 is amended: the dependency; the continuation in its own module;
the delivery-preparation step and its not-applicable route; the baseline
class read from the story contract and recorded with its source; one
retry and then a typed stop when a review fails; criteria without byte
figures; and every duty its catalog row held moved into the order.

## 10. The combined machinery order, item by item

[WO-188](../work-orders/WO-188-boarded-machinery-items.md) answers note
10. Each item was re-observed at `08845c71` with its file and line, has
its own criterion, and ends as fixed, not reproduced, or returned with
the reason. They are combined because they share one re-mint of the
editions, one bundle re-emit and one review gate.

| Item | Source | Change |
| --- | --- | --- |
| 1 | WO-176 D035, D033 | A nested repository in an order's worktree is scratch unless under intake or a declared submodule; removed by the executor, the reviewer and release close, in that order of preference |
| 2 | WO-178 D012, D023 | One builder for the release-close command, in the admitted spelling |
| 3 | WO-176 D034 c, d, e | Tag outcome set before the preflight; material blockers carry the admitted command; hooks disabled in nested Git calls |
| 4 | WO-176 D037 a, d, e, f | No forced removal over a submodule link; `already-published` recorded; a remedy for a dirty derived worktree; the close record exists before flags are parsed |
| 5 | WO-171 D014 | The prune removes a partial proof beside a whole one |
| 6 | WO-178 D013 | No close admission under a typed-correction state |
| 7 | WO-178 D014 | A host task notification is not counted as an operator message |
| 8 | WO-172 D033 | The failed-command event registered, after observing the third harness |
| 9 | WO-172 D009 | A dispatch-named operator correction counts as a correction |
| 10 | WO-178 D021 | Provenance keys unique within a file |
| 11 | WO-086 D024 (5, 7) | A removed release-history block and an unreadable annotation fail the check |
| 12 | WO-124 D015 | A forward-only screen for absolute home paths; a relative subject path in entropy runs |
| 13 | WO-085 D004 | The operator-word check widened and made a refusal for new text; three decisions paraphrased |
| 14 | WO-086 D024 (1 to 4) | Four release-preparation hardenings |
| 15 | WO-174 D014 | The integration fixture overlays the console package |
| 16 | WO-164 D013 | `release list` survives a changed-file list that is not an array |
| 17 | WO-169 D014 | Four feed edges |
| 18 | WO-107 D011 | The whitespace check reads untracked files, with exemptions by attribute |
| 19 | WO-177 D006 | The remaining live launch default pinned |
| 20 | WO-157 D040 | The binding check compares the profile identifier |
| 21 | 5S, this pass | Two helper duplicates that returned are removed, and the test asserts their absence |
| 22 | notes 5 and 11 | The experiment and goal-alignment sentences (§6) |
| 23 | note 2; WO-173 D016 | The comment rule, a check against a baseline, and the cleanup in files that owe no re-mint |
| 24 | note 17 | The pull-request body's meter table, absolute links, the Release title once |

Decided without code: planning entry keeps measuring the timed
conditions (WO-175 D015, confirmed); a read guard that cannot load fails
its task (WO-174 D020, confirmed); the receipt recognizer is not widened
(WO-086 D013); the guard's logs get no retention rule (WO-174 D022; main
holds none); the class-wide fixture sweep is declined (WO-157 D016; the
reopened instance was fixed).

On note 2: 565 of 3,336 comment blocks cite a process identifier, 16.9%
against 13.7% a week earlier, and no rule says what a comment is for.
The rule is the role sentence; the check refuses a report-local label or
a leading order identifier in a new or changed comment; the cleanup
covers every file that is in no evidence edition. Lines in registered
files stay in the baseline until an order re-mints the file, because a
comment-only edit to such a file stales its editions and one of them is
judged. Seventy per cent of test names carry an identifier; names are
left alone and recorded as a candidate.

## 11. 5S inventory

Re-measured against the inventory of 2026-09-25 (`fa9957f1`), 7.3 days
earlier. Base values were recomputed with today's commands.

| S | Measure | Base | Today | Disposition |
| --- | --- | --- | --- | --- |
| Sort | Unreferenced scripts; library modules nothing imports; test files not wired | 0; 0; 0 | 0; 0; 0 | None |
| Sort | Tracked bytes | 200.7 MB | 241.9 MB (+20.6%) | Watch; evidence is 68.4% |
| Sort | Evidence added in the week | 79.9 MB the week before | 16.1 MB | The 10 MB condition holds; re-deferred this morning, unchanged |
| Sort | Code lines | 176,748 | 234,673 (+33%) | Watch |
| Sort | Corpus test files in no gate | 3 | 12 of 14 | Candidate 10; WO-185 bounds their failure path |
| Sort | Open orders outside the sequence | 7 | 0 after this pass (WO-014 last); six umbrellas until WO-190 | Done here and in WO-190 |
| Sort | Local lanes | 136 MB | 170 MB; check history and journals have no pruner | Candidate 5 |
| Sort | Stashes; runtime snapshots | 18; not measured | 29; 21 | The operator's prune apply; reported |
| Set in order | Files the documentation map does not name | 5 (added then) | 8 at file level | Added by hand in this pass |
| Set in order | Non-test files in the `test-*` namespace | 6 | 9 | Left; the earlier allocation of four renames was lost and is declined (§15) |
| Set in order | Top-level planning files | 31 | 37 (38 with this document) against a reopening figure of 40 | Watch; existing candidate |
| Set in order | Product documents' headroom | not applicable | 45 bytes in 07, 70 in 06 before this pass | §16 |
| Shine | Marker comments; commented-out code | 0; 0 | 0; 0 | None |
| Shine | Comment blocks citing a process identifier | 13.7% | 16.9% | WO-188 item 23 |
| Shine | Test names citing one | 66.6% | 70.1% | Candidate 6 |
| Shine | Stale statements met | not measured | The front page's map and horizon; one sentence in product 07 | WO-189; corrected here |
| Standardize | Root-discovery families; entry points that parse arguments their own way; test-naming families | 6; 45; 6 | 6; 49; 7 | Watch; none converged, none filed |
| Standardize | Helper duplicates | removed by WO-162 | Two returned | WO-188 item 21 |
| Standardize | Git wrappers in the skeleton | 10 | 10 | Candidate 7 |
| Sustain | Checks that guard these conditions | none for orphans, the map, comments or duplicates | the same | WO-188 adds two (comments, duplicates); the map check stays declined |

## 12. The register

At entry: 854 rows, 225 pending (13 open, 2 needs-review, 57 untriaged,
153 deferred). The pass read every active row and the deferred rows its
orders touch, and applied one batch of 101 dispositions: 58 allocated,
30 deferred, 8 settled, 5 declined.

| Target | Rows |
| --- | --- |
| WO-184 | 19 |
| WO-188 | 24 |
| WO-186 | 7 |
| WO-123 | 4 (three shared with WO-184) |
| WO-187 | 3 |
| WO-073, WO-185, WO-189, WO-192 | 1 each |
| WO-080 to WO-083 | 1, re-recorded |

After: 864 rows, 167 pending, none untriaged and none awaiting review.
One row stays open: the executor's cold-start redesign, reserved by the
operator. Ten rows are this pass's own candidates, each deferred with
its reopening condition.

Rows whose reopening condition had occurred and that this pass did not
turn into work, with the reason on each row: the documentation map's
missing files (added by hand; a check stays declined); retained lanes
waiting for a usage snapshot (33 of 35 by a read-only replication; the
copies are kept); the corpus scripts' lexical entry guards (four now);
the document gate's latency (measured, deferred behind the product
gate).

## 13. Orders filed and amended, and the sequence

| Order | Track | Class | Lane | Hard dependencies in the queue |
| --- | --- | --- | --- | --- |
| WO-184 seams before the vertical | delivery | minor | pair 1 | none |
| WO-185 host guard | machinery | patch | pair 1 | none |
| WO-186 gate time | machinery | patch | pair 2 | WO-185 |
| WO-187 verification | machinery | patch | pair 3 | none |
| WO-188 boarded machinery items | machinery | minor | pair 4 | WO-187 |
| WO-189 front page | machinery | patch | pair 5, or a third lane at any time | none |
| WO-190 index and roadmap | machinery | patch | pair 6 | none |
| WO-191 reader profiles | machinery | patch | pair 7 | WO-188 |
| WO-192 router | delivery | minor | after WO-118 | WO-187 |
| WO-193 capability requests | delivery | minor | after WO-192 | WO-074, WO-077, WO-078 |
| WO-194 predecessor map | delivery | minor | after WO-193 | WO-074, WO-076, WO-193 |

Amended: WO-123 (§9); WO-073 (the registration's two declarations as
criterion 4, byte figures removed, its duties gathered); WO-014 (placed
last in the sequence, with the condition under which it moves up).

The sequence: seven lane pairs, the delivery order first in each
(WO-184, WO-123, WO-112, WO-074, WO-075, WO-072, WO-073), a machinery
order beside it (WO-185 to WO-191 in number order), then the serial run
from WO-076, in which WO-118 precedes the three instance orders. No pair holds a hard edge. Shared files inside a pair are
secondary and named in each order's placement paragraph: WO-072 and
WO-190 both edit `scripts/resume.mjs`; WO-073 and
WO-191 both add sentences to the loadout source.

Seven of the eleven new orders are machinery. The stand-down of
2026-09-15 was called because machinery had displaced product work for
five days, so the cost is stated plainly: one delivery order, WO-184,
now precedes the vertical, and seven machinery orders ride beside
delivery orders without blocking any. The three instance orders are
product work the operator directed for after the export.

Edits made in this pass, in place: product 07 (the three planning rules;
the sentence that said the product gate runs the release-surface check,
which the document gate does); product 06 (the launchpad rung names the
three instance orders, operator direction of this date); product 05 (the
reading of the 64 experiment records); the documentation map (eight
files); `docs/control/doc-ceilings.json` (§16).

## 14. Evidence and cost of this pass

- Agents: nine research workers and one documentation lookup, ten of
  the cap of twenty, plus one refuter after the subject commit. Their
  recorded durations: 1,453 s, 2,034 s, 1,186 s, 1,068 s, 1,999 s,
  1,614 s, 1,839 s, 1,700 s, 1,818 s and 547 s.
- Effort: the guide pins spawned Claude agents at `xhigh`. This root
  ran at `max` and its workers inherited it, because the spawning tool
  sets a model and no effort. That is the reopening condition of the
  register row on per-agent effort, and WO-187 takes it.
- Usage observed for this dispatch at 2026-10-02T05:16Z, from the
  session transcript: 58,163,834 tokens in total, of which 56,993,781
  cached input and 283,012 output; cost unknown (no counter). The
  handoff reading is in the pass's response and its ignored receipt.
- Commands: `plan start`, `plan failures`, `plan conditions`,
  `followups` (export, sync, one apply); read-only scripts over the gate
  index, the control segments and the tree; no code suite; the document
  gate.
- Not done: `plan conditions --slow`; `harness prune`; any probe of the
  host's agent mechanics (WO-192's first criterion); any read of the
  starter repository; any measurement of the memory mechanism (WO-185's
  confirmation run is the bounded place for it).

## 15. Declined, with reopening conditions

| Declined | Why | Reopen |
| --- | --- | --- |
| A result memo per gate task | The replay: 99% of task time affected for the median order | After WO-186, the replay shows the median below 60%, or the plain gate stays above 360 s |
| Narrowing what the shell suites copy | Pays only with the memo | The memo reopens |
| A cache for the document gate | 201 s an order against 1,660 s for the product gate | The gate's median passes 60 s |
| A review phase between verification and final review | A fifth dispatch for the operator to route | Ten orders after WO-187 show no fall in escapes |
| A third prune of the front page under the same rules | Two regrew threefold in twelve days | not applicable; WO-189 replaces the rules |
| A scheduled polish job for published text | Nothing yet says which direction is better | Two profile revisions have scores that differ |
| Rewriting forty byte figures in 24 queued orders | The ceilings now cover them | A role trims reviewed text citing one, or a write-back fails a ceiling |
| A completeness check for the documentation map | One hand correction a week | A later inventory again finds five or more missing files |
| Consolidating products 02, 03 and 05 | The delivery lane is full; the ceiling basis is fixed first | A second raise within a week for any of them |
| The four `test-*` renames whose allocation was lost | Suites and documents reference the names; no harm recorded | A reader is misled by one |
| A sweep of identifiers from comments in registered sources | A comment-only edit stales editions; one file is judged | An order re-mints the file |
| Correcting home paths in immutable reports | An off-ramp per report for a path already public | The operator asks |
| A collector change for the register | 5 of 107 pending decision rows lack follow-up text | Untriaged rows at entry pass 100 |
| Orders for two quarantined corpus findings | No queued order touches the kernel's admission or the audit projection | A recorded run produces either input |
| A port for an instance-owned source adapter | No instance exists to say which source | A request asks for it |
| Retention for check history and journals | 95 MiB of local state; nothing fails | The local lane passes 500 MB |

## 16. Document ceilings set from declared write-backs

The decision this section records, cited by
`docs/control/doc-ceilings.json`: a ceiling is the document's measured
size at this pass plus the write-backs the pass and its queued orders
declare for it. Figures for orders filed earlier are the ones their
criteria state. Figures for this pass's orders are the planner's
estimate of the content each criterion names, at about 150 to 250 bytes
a sentence; they are estimates, and a later pass corrects them the same
way.

| Document | Bytes now | Queued write-backs | Ceiling |
| --- | --- | --- | --- |
| 02 domain model | 149,450 | 1,300 (WO-091, WO-092, WO-097, WO-098) | 150,750 |
| 03 architecture | 174,757 | 2,050 (WO-073, WO-074, WO-075, WO-123: 1,300; WO-184: 400; WO-193: 350) | 176,807 |
| 04 interfaces | 60,482 | 800 (WO-081, WO-083, WO-092, WO-094) | 61,282 |
| 05 pattern library | 135,256 | 1,100 (WO-093, WO-094: 600; WO-188: 250; WO-192: 250) | 136,356 |
| 06 roadmap | 41,108 | 1,250 (WO-083, WO-095, WO-096, WO-098, WO-112: 1,100; WO-190: 150) | 42,358 |
| 07 execution guide | 157,957 | 8,250 (WO-072, WO-073, WO-077, WO-078, WO-080, WO-088, WO-113, WO-123: 2,900; WO-185: 600; WO-186: 700; WO-187: 1,500; WO-188: 1,300; WO-189: 150; WO-190: 150; WO-192: 800; WO-193: 150) | 166,207 |
| 10 IR compatibility | 25,665 | 950 (WO-076, WO-091, WO-092, WO-097: 800; WO-194: 150) | 26,615 |
| 12 workstream application | 18,164 | 1,850 (WO-080, WO-082, WO-083, WO-112, WO-118: 1,100; WO-193: 350; WO-194: 400) | 20,014 |

"Bytes now" includes this pass's own edits at the time the ceilings were
set: 399 bytes in 07, 403 in 06 and 315 in 05. A later wording
correction in this pass added 118 bytes to 07 (158,075), inside the same
ceiling. Unchanged, because their headroom already covers what is
queued: 00 (WO-118, 250 of 545), 08 (WO-191, 300 of 371), 13 (WO-083 and
WO-098, 400 of 523), and 01, 09 and both 11 files, which have no queued
write-back.

Product 07 may grow by 5.2% under this ceiling. That is the sum of what
the queue plans to say in it, shown here so it can be challenged; the
consolidation that would shrink it is deferred (§15).

## 17. Goal alignment

Mission: a person declares a bounded intent and receives a verified
result without supervising the process. The critical path to that is
WO-123, WO-112, the export, WO-118 and WO-183. This pass adds one order
to that path (WO-184, before WO-123) and places the rest beside it.

Lenses that changed a choice:

- **Naive interventionism and NoOp.** Seventeen notes could have become
  seventeen mechanisms. The NoOp was weighed for each, and sixteen
  alternatives are declined in §15. Where a mechanism is filed it
  replaces a rule that failed in the record (the front page's prose
  rule, the pre-registered experiment, the two-per-cent ceiling) rather
  than adding beside it. WO-191 refuses nothing.
- **Seeking the wrong goal.** "Affected" selection was the named remedy
  for gate time; the replay was run before any order was written, and
  the remedy was not filed. Reader scores and byte figures are kept as
  measures, never as gates on prose.
- **Shifting the burden to the intervenor.** The record shows the
  operator carrying handoffs, catching what verification missed and
  stopping a runaway process by reporting it. WO-192, WO-187 and WO-185
  move each of those to the system.
- **Rule beating.** A count on prose invites trimming (the earlier
  decision on the front page said so); WO-189 bounds by ownership and
  the operator's own choice of length. WO-188's comment check uses a
  baseline, so it cannot be met by deleting history. WO-187 classes
  findings at final review, where the verifier cannot grade itself.
- **Drift to low performance.** A final-review failure rate of about
  10% had become ordinary. The escape count makes it a number a pass
  reads.
- **Success to the successful.** Machinery has displaced delivery
  before. Every pair leads with a delivery order; the cost is stated in
  §13.
- **Tragedy of the commons.** Host memory and the sub-agent budget are
  shared and were unowned; WO-185 and WO-192 give each a bound per user.

Escalation and policy resistance were considered and changed nothing in
this pass.

Outcome judged at handoff: the pass filed more orders than a NoOp-first
reading would prefer. Each rests on a measurement taken in the pass, and
the four that carry the most risk of being wrong (WO-186, WO-187,
WO-189, WO-192) each name the observation that would show it.

## 18. What would reverse these decisions

| Decision | Reversed or reopened by |
| --- | --- |
| WO-184 before WO-123 | The operator prefers the vertical first; then items 11 to 13 and 15 still precede any reactor edit or live writer |
| WO-185's guard and budgets | Its confirmation run shows normal gates near a budget, or the guard kills a healthy process |
| WO-186's task-level reuse | A second process cannot prove a reuse path sound; the replay after it shows no fall in gate time |
| WO-187's verifier duties | Ten orders show no fall in escapes, or verification's median more than doubles |
| The scratch rule (WO-188 item 1) | A repository the operator wanted kept is removed on any path; the verifier attacks this first |
| The experiment and lens sentences | Ten orders record no experiment at all, or a material choice is made with no lens named |
| WO-189's ownership check | A queued order's front-page sentence is refused, or the operator wants orders to keep writing the page |
| WO-190's two pages | A reader of the console's work view loses a link it had |
| WO-191's profiles | The operator finds the examples do not differ in a way that matters |
| WO-192 after WO-118 | The operator moves it into the machinery lane after WO-188; nothing in it depends on the export |
| WO-192's design | Its probe shows the host does not expose what the design needs; the fallback is delivered |
| WO-193's default of `none` | not applicable; the route is the instance operator's to set |
| The machine-login and link-host declaration (WO-073) | The operator wants no declared exceptions to the screen; then the criterion is removed and the loop keeps stopping on such items |
| Ceilings from declared write-backs | A product document grows past its ceiling's plan without a pass saying why |

Questions that are the operator's, reported with the pass: whether the
session-log metadata reading is admissible; where WO-192 sits; the
reserved cold-start pass; a safety sentence for unbounded probes in the
standing instructions until WO-185 lands; the prune apply over 21
snapshots and 29 stashes. The operator answered the question of the
prepared amendments by directing them (§20).

## 19. Independent review

Receipt 038 (`2026-10-02-planning-e72192f0c60b6f96-038`). One fresh
worker with no inherited conversation read only the canonical prompt
that `npm run plan -- refute` prints, rendered into files with nothing
added, and judged the fourteen changed orders and the sequence. Plan
verdict: aligned-with-findings, no hold. Twelve orders are aligned with
findings and two aligned (WO-189, WO-190); 24 unchanged verdicts are
carried by hash. The worker ran 1,377 s; dispatch to filed receipt took
1,621.6 s.

Its twenty findings are known issues, each with a reopening observation.
They are carried on the orders' catalog rows in the map.

An error of this pass, corrected. The planner first edited the judged
orders and the sequence to repair fourteen of the findings, reading the
rule "dispositions settle repairs without another judgment" as leave to
repair. The plan check refused: a judged order and the sequence are
frozen by the pass's one judgment; only a hold's disposition or an
operator-authorized amendment changes judged text; and a second judgment
needs changed observed evidence (`scripts/lib/plan-continuation.mjs`;
`requireChangedPlanEvidence` in `scripts/lib/plan-receipts.mjs`). The
receipt has no hold, so nothing can be disposed. The edits were reverted
to the judged bytes. The repair commit, `c3226ebc`, stays in this
branch's history, and the table says what each amendment is, for the
pass that next amends these orders. Six findings need no amendment.

| Finding | Amendment prepared, or why none |
| --- | --- |
| WO-184 criterion 13: one passing live attempt in three would meet it, the rate the order cites as the defect | Three live attempts, and all must pass |
| WO-184 criterion 19: two host imports stay inside the reactor's import closure | None; recorded with its reopening observation |
| WO-185 criterion 4: the guard and the lanes cover one repository while the title promises the machine | One guard and one lane count per user on the host; a fixture with two clones |
| WO-185 criterion 7: the bounded wrapper against the rule on allow lists | None; the wrapper is added to no allow list, and WO-014 measures with it present |
| WO-123 criterion 1: the fixture's starting draft names `repo: self` and asks for human review | The criterion says what the Design already says: the portfolio entry supplies the target, and the admission record states why the review constraint does not apply |
| WO-186 criterion 3: the environment a reused row came from is outside the identity | None; the reviewer's full run is the backstop |
| WO-187 criterion 6: one more cold-start ceiling raise (the verifier has 363 bytes of headroom) | The duty sentence is replaced, the detail is read at verify time, and no new acceptance is allowed |
| WO-187 criterion 4: an unclassed finding could block recording a final review | Counted as unclassed and advised, never refused |
| WO-188 criterion 1: release close removes a repository whose commits may exist nowhere else | The rule stays, by the operator's amendment of WO-176; the close record names the head commit and whether a remote held it |
| WO-188 criterion 23: a comment sentence in every role root | The executor's root only; each root's bytes recorded; no new acceptance |
| WO-188 criterion 13: four new refusals and no count of bypasses | None; recorded |
| WO-073 criterion 3: a registration without a profile would be refused | A profile is declared per registration, and one that declares none activates as today |
| WO-073 criterion 2: cold-start figures from 2026-09-28 | The figures re-read on this date |
| WO-191 criterion 6: a reader agent at every pass, for three corrections none later than 2026-09-09 | The reader runs after a profile change or at the operator's word |
| WO-191 criterion 5: the score is an agent's retrieval, not the operator's taste | None; the operator's corrections are kept beside the score |
| WO-192 criterion 6: no bound on a driven session's total sub-agents | A ceiling for a driven session |
| WO-192 criterion 3: two generators of agent definitions in one file | One generator and one check rule |
| WO-193 and WO-194 criterion 4: instance orders ahead of the product exit | The sequence: WO-118 ahead of WO-192, WO-193 and WO-194 |
| WO-014 criterion 3: commitments made before any baseline shows a burden | None; the pass that reaches it re-observes the gap first |

Two of the amendments touch the head pair. WO-184 and WO-185 are the
first orders the sequence offers, so the amendment pass, or an
operator's scope expansion at activation, comes before them. §20
records that pass.

## 20. Operator answer: the amendments applied

After the first report the operator asked what the reported decisions
required, and then dispatched
`planning: apply the receipt 038 amendments on this branch` (captured in
ignored intake,
`docs/intake/notes/2026-10-02-receipt-038-amendments-planning.md`,
SHA-256
`22b8af28fb783cdf27b559c2f2a694481508f428191d45c12242ade3e187e5d9`).
An operator's answer opens a new pass on the same branch with its own
judgment, as on 2026-09-27; the ledger carries its section.

Entry reading: `plan failures` since receipt 038 shows no failed
verification, final review or repair, and the same four corrections §2
routed. Nothing in the queue was activated between the passes.

Applied, from the repair commit the first pass prepared (`c3226ebc`):
the fourteen amendments of the §19 table, to WO-014, WO-073, WO-123,
WO-184, WO-185, WO-186, WO-187, WO-188, WO-191, WO-192, WO-193 and
WO-194 and to the sequence, where WO-118 now precedes WO-192, WO-193
and WO-194. All twenty of receipt 038's known issues are written in
those orders under `Known issues and carry-ins`, six as they stood, and
the catalog rows point there. §5, §8, §9, §13 and §18 above are brought
in line with the amended text.

Left at their defaults, because the operator's answer named only the
amendments: WO-192 stays in the serial run and is not moved into the
machinery lane; no sentence is added to the standing instructions; the
planner's three recorded assumptions (scratch repositories, home paths,
machine-login declarations) stand; the session-log reading stays out of
the repository.

One candidate is recorded in the map, as item 11 of this date's
section: the planner's role sentence on repairs after a judgment reads
as leave to repair, which is how the first pass came to edit judged
text. It is a role-text change and waits for an order that edits the
planner procedure.

Receipt 039 (`2026-10-02-planning-9471b224202aeb77-039`) is the amended
subject's judgment. A second fresh worker with no inherited
conversation read only the canonical prompt, rendered as before, and
judged the eight orders whose judged text changed (WO-184, WO-185,
WO-123, WO-187, WO-188, WO-073, WO-191 and WO-192) and the sequence.
Plan verdict: aligned-with-findings, no hold; all eight are aligned with
findings; 30 unchanged verdicts are carried by hash. The worker ran
1,260 s and used 302,683 tokens; dispatch to filed receipt took
1,337.3 s.

Its twenty-three findings are known issues, each with a reopening
observation. This is the pass's own judgment, so no judged text is
edited after it: the findings are on the eight orders' catalog rows in
the map. The ones a later pass or an executor should weigh first:

- WO-185: one guard serves every clone while each clone keeps its own
  budget file, so whose figures apply is unstated; a tree the resident
  launches before any session has dispatched has no started guard; a
  live lane holder that has stalled keeps every gate on the host
  waiting.
- WO-073: its criterion 2 still allows a cold-start ceiling raise of
  the kind WO-187 and WO-188 now forbid themselves.
- WO-192: the router is a second lifecycle driver beside the resident,
  and its new root has no cold-start ceiling.
- WO-184: no arm of criterion 13 shows a behavior defect still failing
  verification with the review notice present.
- WO-188: release close removes a repository an earlier completion
  declared kept; the record keeps evidence of the loss, not the
  content.

The register after this pass: 865 rows, 168 pending (167 deferred and
the one open row), none untriaged; the new candidate is deferred with
its reopening condition.

Cost of this pass: one sub-agent (twelve of the cap of twenty used in
the session); no code suite; the document gate.
