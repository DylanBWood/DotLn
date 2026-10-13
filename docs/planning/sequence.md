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
dependency order, and the
[2026-10-13 standard pass](standard-pass-2026-10-13.md) retires the seven
orders of that route that have closed: WO-072 (v0.75.0), WO-076 (v0.76.0),
WO-200 (v0.76.1), WO-201 (v0.77.0), WO-202 (v0.78.0), WO-203 (v0.79.0) and
WO-118 (v0.80.0, the critical path's product exit).

**One focus: the starter, the operator's fork of it and DotLn-Angular,
with a DotLn UI** (operator direction, 2026-10-13). The win condition is
progress in core, the starter, the fork, DotLn-Angular and DotLn WoW Forever
at the same time, without babysitting, with feedback and bugs routed to
where they belong and acted on. The fork does its foundational Angular work,
the UI included, through its own planning passes and lifecycle as soon as it
can run and publish them (operator correction 3, 2026-10-11). WO-210 is the
point at which it can. WO-083's run then measures one bounded Angular order,
not necessarily the repository's first change.

The order, serial:
- WO-215: core's release close pushes each release into the starter, so
  every later release reaches the operator's fork's upstream on its own. The
  starter holds no export yet, so WO-215's own release close makes its first
  one. The fork is created from it, and opts into later updates through its
  own planning pass (WO-207).
- WO-210: the instance's own orders, including the Angular target order,
  publish and reach release close with target-native text. The target's own
  tests gate its orders, and the target keeps its own product documents,
  planning passes and order records. It absorbed WO-211 and WO-214.
- WO-213: private paths stay out of the public fork's committed records.
- WO-080: the workstream document the run holds, the board's Workstreams
  section and the synthetic pilot. It absorbed WO-081 and WO-082.
- WO-204: the source writer is made safe before WO-083. It absorbed WO-205,
  WO-206 and WO-212.
- WO-192: the router, before WO-083, so the measured run is driven the way
  the operator will drive orders (operator item k, 2026-10-11).
- WO-083: the real run.
- WO-207: rollback, the extension point for the fork's own features and
  supports, and the build channel (the 2026-10-11 order). It absorbed WO-208
  and WO-209.
- WO-193: the fork's requests reach core's intake, carrying the holes and
  bugs the operator finds. It also builds the private predecessor map a work
  fork starts from, the delta between the starter and v1. It absorbed
  WO-194.
- WO-183: an intent enters the resident's loop, with less babysitting.
- WO-088: planning documents as checked contracts, with pass registration
  moved out of the idea ledger. It absorbed WO-089 and WO-113.
- Then WO-091 (the full 5S set; it absorbed WO-092 to WO-095), WO-096 (rule
  migration; it absorbed WO-097 and WO-098) and WO-014.

Each merge joins orders on one subsystem that would have run one after
another, so their order cycles and full gate runs are paid once
([the 2026-10-13 standard pass](standard-pass-2026-10-13.md), §12.3).

The period below `v1.0.0` is early access (operator direction, 2026-09-30).
The order of everything the operator did not place is the planner's.

<!-- dotln-work-order-sequence:start -->
- WO-215 — Core's release close refreshes DotLn-Enterprise-Starter
- WO-210 — An instance's own orders publish and reach release close
- WO-213 — Private paths stay out of every committed record
- WO-080 — Workstreams: document, index, board section and synthetic pilot
- WO-204 — The source writer cannot damage the operator's repository
- WO-192 — A router drives an order through its lifecycle
- WO-083 — The real run from the operator's instance
- WO-207 — An instance's kit updates: rollback, extension point and build channel
- WO-193 — An instance's requests to core and its predecessor map
- WO-183 — Intent declaration and the stranger test
- WO-088 — Planning documents as checked contracts
- WO-091 — The full 5S set on the Repo Gardener
- WO-096 — Feedback rule migration
- WO-014 — Approval-burden baseline

<!-- dotln-work-order-sequence:end -->
