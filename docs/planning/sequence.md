# Proposed work-order sequence

The operator-authored sequence below is the single editable input to the
index and refutation subject. It grants no activation authority. For rationale see
[the planning map](work-order-map.md). Closed and withdrawn entries leave the
list at the next planning pass (operator direction, 2026-09-22; WO-158);
the generated work-order index is their record, and the map and archive keep their
rationale.

Planning entry returns the pending [follow-up register](followups.json) in
bounded pages. Use `npm run plan -- followups` for its current counts, source
pointers and continuation command; untouched items persist across passes.

Two entries between blank lines are a lane pair (operator direction,
2026-09-16; recut 2026-09-17; rule in
[the map](work-order-map.md#tracks-and-dispatch-dimensions)): two parallel
worktrees, the delivery order first and a machinery or evidence order
second, with disjoint primary surfaces and no hard edge between them; one
order at a time passes final review and release close. A single entry
between blank lines runs alone. The entries after the last pair run one at
a time. Parallel orders stay the aim where they pay, never serial order as a
standing rule (operator direction, 2026-10-13). For the next thirty core
orders, though, the operator runs core one order at a time and parallelizes
across repositories instead: the fork, DotLn-Angular and DotLn WoW Forever
(operator direction, 2026-10-13). This list is therefore one serial group.
Reopen pairs when the thirtieth of those orders closes, or on the operator's
word ([the 2026-10-13 standard pass](standard-pass-2026-10-13.md), §12.2).

Every open order has a place in this list
([2026-10-02 pass](standard-pass-2026-10-02.md)). The
[2026-10-11 route pass](three-repository-route-2026-10-11.md) cut the
delivery lane as the three-repository route the operator directed, in
dependency order; the [2026-10-13 standard pass](standard-pass-2026-10-13.md)
retired the seven orders of that route that had closed, and the
[2026-10-17 standard pass](standard-pass-2026-10-17.md) retires the three
it filed or placed first that have since closed: WO-215 (v0.81.0), WO-210
(v0.82.0) and WO-213 (v0.83.0); the
[2026-10-18 pass](fork-observations-2026-10-18.md) retires WO-216 (v0.84.0);
the [2026-10-19 pass](standard-pass-2026-10-19.md) retires WO-221 (v0.85.0);
the [2026-10-19 fork-requests pass](fork-requests-2026-10-19.md) retires
WO-222 (v0.86.0); the [2026-10-20 entropy pass](entropy-review-007-2026-10-20.md)
retires WO-218 (v0.87.0); the [2026-10-20 fork-answers
pass](fork-answers-and-entropy-targets-2026-10-20.md) retires nothing and
files WO-223 and WO-224; the [2026-10-21
pass](fork-notes-and-operator-questions-2026-10-21.md) retires WO-223
(v0.88.0) and WO-217 (v0.89.0), files WO-225 to WO-229, cuts WO-228 out of
WO-193 into the separate predecessor track (WS-002) and places the four
orders that unblock the operator's fork first; the
[2026-10-24 pass](intake-mining-run-routing-2026-10-24.md) retires WO-226
(v0.90.0), WO-227 (v0.91.0), WO-225 (v0.92.0), WO-229 (v0.93.0) and WO-219
(v0.94.0), files nothing, and takes in the 2026-10-22 intake mining run; the
[2026-10-24 second pass](target-publish-base-2026-10-24.md) retires WO-220
(v0.95.0) and WO-080 (v0.96.0), files WO-230 and places it first on the
operator's direction; the [2026-10-25 pass](fork-returns-and-review-lint-2026-10-25.md)
retires WO-230 (v0.96.1) and WO-224 (v0.97.0), files WO-231 and WO-232 and
places them first on the fork's blocker and the operator's direction.

**One focus: the starter, the operator's fork of it and DotLn-Angular,
with a DotLn UI** (operator direction, 2026-10-13). The win condition is
progress in core, the starter, the fork, DotLn-Angular and DotLn WoW Forever
at the same time, without babysitting, with feedback and bugs routed to
where they belong and acted on. The fork does its foundational Angular work,
the UI included, through its own planning passes and lifecycle as soon as it
can run and publish them (operator correction 3, 2026-10-11); WO-210
(closed) is the point at which it can. WO-083's run then measures one
bounded Angular order, not necessarily the repository's first change.

**The complete run fits the machine** (the 2026-10-19 pass): WO-222
closed on 2026-10-19 as v0.86.0, its three levers kept on the series (the
after median 1,668.5 s against 2,538.4 s before, a third sooner) and its
four boarded rows placed in WO-217 ([the fork-requests
pass](fork-requests-2026-10-19.md), §4). The fork's next target order,
which WO-221 was filed to make cost the operator its phrases and one
merge, has not run yet: the fork's 2026-10-19 pass sequences WO-010 and
WO-011 (the starter at v0.85.0 into its registration) before WO-005, and
the count is reread when WO-005 runs.

**The fork's blocker landed** (the 2026-10-20 entropy pass, §6). WO-218
closed on 2026-10-20 as v0.87.0: 39 of its 45 rows settled, each with a
paired control its second verification replayed, and 6 declined; the
fork's three requests are among the settled (a declared target release
titled by its display name, the starter's core-named tag kept out of an
instance's baseline, a judge-only base checkout at close). Its
verification and final review boarded four rows, which WO-219 takes, and
its first verification's finding on criterion 2 (three named cases passed
at the base) is written into the three remaining batches' criterion 2 as
the paired-control evidence class.

**The fork is running; four orders take its workarounds away** (the
2026-10-21 pass, §4 to §9). WO-223 landed (v0.88.0) and the fork took it as
its update #16 and closed its WO-012 the same day; its own sequence shows
WO-007 next and nothing waiting on core, so the fork proceeds: nothing filed
today blocks its next orders, and the pass labels each item a blocker or a
convenience with its working route (product 07 §Operator-opened planning
pass). What it
works around today goes first in core: WO-226 (an export's release close,
`worktree finish` and `npm run harness` prepare the carried runtime
instead of a build the export cannot run; one `update --finish`; the
registered-target admission judges the committed grant and the publication
fields, not whole-file bytes, and names a piped near miss; a dispatch
prefix inside a paste is read; a Fable 5.1 worker by operator request),
WO-227 (the outward lint as the operator intended it: launchpad identifiers
refused in a target's commits and pull requests, the word lists as review
items the reviewer confirms in context, an empty list admitted, the
generated Change-table path named apart from the prose, the pull-request
body's meter block kept last, the reviewed release notes on a target
Release), WO-225 (the console's host contracts: a path-free board, the two
schemas in the kit, a build-free console in an export, a collector that
reads an instance's segments, and the loopback's read routes for the
instance's browser shell) and WO-229 (a gate says who it waited for, with
the structural tasks' full-capacity requests measured). The operator's
request of 2026-10-20, the Entropy Reducer on a registered target
repository or a workstream's repositories, is WO-224, still after WO-080
(the workstream convention) and WO-219 (the frozen copy's guard).

**The predecessor track is apart** (the 2026-10-21 pass, §5; operator note
8). Work that mines or works with the predecessor, launchpad v1, which
exists only on the operator's work machine, is WS-002
(`docs/workstreams/WS-002-predecessor-track.md`): WO-228, the private
predecessor map cut out of WO-193, is its first member and the last group
below, labelled, until WO-080's index grouping takes a separate track out
of the serial list. Orders that test with the personal instance or
DotLn-Angular stay in the queue.

**Then the boarded follow-ups, in the three remaining batches** (the 2026-10-17 pass, on
the operator's direction that every boarded, follow-up and reopened row is
resolved by a work order). The register held 130 pending decision rows
boarded by closed orders across 53 orders, the oldest from 2026-09-18, 88
of them boarded in one week; the rule that the next order editing a surface
takes its rows delivered none. WO-217 to WO-220 cut them by subsystem (the
gate; the instance and publication; records, roles and the harness; the
resident and the vertical), each row fixed with a case or declined with its
reason, the register showing it; the 2026-10-18 pass added five rows, the
2026-10-19 pass twelve (WO-221's seven boarded rows and five of the
fork's requests) and the 2026-10-19 fork-requests pass eight (WO-222's
four boarded rows and four of the fork's requests); the 2026-10-20 entropy
pass adds WO-218's own four boarded rows to WO-219; WO-217 closed on
2026-10-21 (v0.89.0) and WO-219 on 2026-10-23 (v0.94.0). The operator may
interleave them with the focus orders by one sequence edit.

**Five closes, and the mining run taken in** (the 2026-10-24 pass). The
four orders that took the fork's workarounds away have all closed, WO-226
on 2026-10-22 and WO-227, WO-225 and WO-229 on 2026-10-23, and WO-219 closed
the same day; the fork took starter v0.93.0 in its own pass of 2026-10-23.
WO-220 is next. The operator's 2026-10-22 intake mining run, an unofficial
research run in ignored intake (`docs/intake/notes/2026-10-22-intake-mining-run/README.md`),
was taken in by [the 2026-10-24 pass](intake-mining-run-routing-2026-10-24.md),
which gave each of its 46 critical ideas one route, recorded the operator's
decisions on the run's open questions (that document's §10), filed no order,
and hands the instance a
planning prompt (its §9) that turns the run's UI designs into DotLn-Angular
orders in the instance's own pass, where the toolbox, the soldier scene, the
machinery view and the operator's digital twin are built.

**The fork's publish is unblocked first** (the 2026-10-24 second pass). WO-220
closed on 2026-10-24 as v0.95.0 and WO-080 the same day as v0.96.0. The
fork's WO-013, verified, cannot publish: the kit composes the pull request's
Change table from the order's activation base, and the fork's planning pass
had written DotLn-Angular's initial commit there as a stand-in for a
predecessor's merge commit that did not yet exist, so the table describes
515 files instead of the change's 83 and the outward lint refuses the
earlier orders' moved records in it. The operator chose a core fix taken
through a kit update over withdrawing the order (the fork's WO-013-D009)
and directed that the order go next. WO-230 computes the table, the
base-tree exemption and the no-change check from the merge base of the
subject and the target's base branch, names the activation base beside it,
and stops the plan gate advising renames of the kit's own evidence files.
It blocks the fork's next three orders by id (WO-013, WO-014 and WO-016
share the base); nothing else in the queue moves relative to its
neighbours.

**A release must not break the instance that takes it** (the 2026-10-25
pass; operator direction of 2026-10-25). WO-230 closed on 2026-10-24 as
v0.96.1 and WO-224 the same day as v0.97.0; the fork took v0.96.1 in its
second pass of 2026-10-24. Its WO-013, dispatched for its fix, is refused
again at `final-review-result pass`: the review-time lint still reads the
commits from the activation base and refuses two subjects merged on the
target's `main` that no one can repair (the DotLn-Angular fork's
FINAL-002). WO-231 moves that lint onto the described base WO-230 gave the
publish; it is the fork's blocker and goes first. The operator's direction
during this pass, that it is becoming routine for a starter release to
break and block every downstream consumer, is read against the fork's
record: four of its six updates since 2026-10-19 blocked the update or left
a gate red or a record damaged (v0.87.0's moved-record document check,
v0.88.0 and v0.93.0's red plan gate, v0.96.0's workstream field and the
amendment withdrawals it forced, v0.96.1's half fix), each a check core's
gate never ran against an instance with history. WO-232 commits a fixture
instance carrying those record shapes, updates it to the current kit in
every fresh core gate and runs the kit's own checks on it; it also admits
the leading Workstream field in the amendment binding, admits a closed
member without the field, and reads a self member's cells from `main`
(the fork's items 1 and 2 of 2026-10-24). It goes second, before WO-204,
because every later release pays for it otherwise. Nothing else moves
relative to its neighbours.

**WO-192's issues come first; the record's mechanisms follow** (the
2026-10-26 pass; operator dispatch of 2026-10-26 and its corrections). WO-231
closed on 2026-10-25 as v0.97.1, WO-232 as v0.98.0 and WO-204 on 2026-10-25
as v0.99.0; all three leave the list. WO-192, activated on 2026-10-25, ran
22.4 hours of executor wall clock without leaving `active`, was stopped
twice by the operator, and left its implementation uncommitted in its
worktree; its decisions D080, D081 and D083 record the residue (85
integration stashes, 41.30 GB; 641 session scratch trees, 9.7 GB) and the
churn that refused its own gate by host memory, and this pass measured
24,526 further fixture roots, 14 GB, in the system temp directory. The
operator's dispatch directs that these be fixed permanently for DotLn and
the forks with no cleanup run by hand, and the operator's corrections during
the pass direct that the mechanisms behind two further failures be built, in
that priority. Three orders go first: WO-233 (DotLn cleans up after itself:
the stash dropped at integration, every temporary root owned and judged, the
prune at release close, session end and gate end, the warm export fixture,
all in the kit), WO-234 (a dispatch cannot run away: wall-clock and
complete-run bounds the gate, the wrapper and the lifecycle refuse past,
with an acceptance on the record), then WO-235 (no artifact shaped by its
predecessor, every operator message answered, a correction heard at its
urgency). WO-192 stays active with its worktree preserved and resumes after
them; the operator may instead withdraw it (the pass's planning document
names both commands). The forks take WO-233 through the kit update, as
every release. Nothing else moves relative to its neighbours.

The order, serial:
- WO-233: DotLn cleans up after itself; WO-192's residue and churn fixed at
  the source and shipped in the kit; first.
- WO-234: a dispatch cannot run away; the bound WO-192's 22.4-hour dispatch
  lacked; second.
- WO-235: no artifact shaped by its predecessor and no operator direction
  dropped; the operator's corrections of 2026-10-26; third.
- WO-192: the router, active with its worktree preserved, before WO-083, so
  the measured run is driven the way the operator will drive orders
  (operator item k, 2026-10-11).
- WO-083: the real run.
- WO-207: rollback, the extension point for the fork's own features and
  supports, and the build channel (the 2026-10-11 order). It absorbed WO-208
  and WO-209.
- WO-193: the fork's requests reach core's intake, carrying the holes and
  bugs the operator finds. It absorbed WO-194; the private predecessor map
  is WO-228's, in the predecessor track.
- WO-183: an intent enters the resident's loop, with less babysitting.
- WO-088: planning documents as checked contracts, with pass registration
  moved out of the idea ledger. It absorbed WO-089 and WO-113.
- Then WO-091 (the full 5S set; it absorbed WO-092 to WO-095), WO-096 (rule
  migration; it absorbed WO-097 and WO-098) and WO-014.
- The predecessor track (WS-002), apart from the serial queue and blocked by
  nothing in it: WO-228, the private predecessor map, which waits on WO-193's
  request route and on the operator running an instance where the
  predecessor is.

Each merge joins orders on one subsystem that would have run one after
another, so their order cycles and full gate runs are paid once
([the 2026-10-13 standard pass](standard-pass-2026-10-13.md), §12.3).

The period below `v1.0.0` is early access (operator direction, 2026-09-30).
The order of everything the operator did not place is the planner's.

<!-- dotln-work-order-sequence:start -->
- WO-233 — DotLn cleans up after itself
- WO-234 — A dispatch cannot run away
- WO-235 — No artifact is shaped by its predecessor and no operator direction is dropped
- WO-192 — A router drives an order through its lifecycle
- WO-083 — The real run from the operator's instance
- WO-207 — An instance's kit updates: rollback, extension point and build channel
- WO-193 — An instance's capability requests to core
- WO-183 — Intent declaration and the stranger test
- WO-088 — Planning documents as checked contracts
- WO-091 — The full 5S set on the Repo Gardener
- WO-096 — Feedback rule migration
- WO-014 — Approval-burden baseline

- WO-228 — The private predecessor map (WS-002, the predecessor track)

<!-- dotln-work-order-sequence:end -->
