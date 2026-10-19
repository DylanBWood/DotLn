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
the [2026-10-19 pass](standard-pass-2026-10-19.md) retires WO-221 (v0.85.0).

**One focus: the starter, the operator's fork of it and DotLn-Angular,
with a DotLn UI** (operator direction, 2026-10-13). The win condition is
progress in core, the starter, the fork, DotLn-Angular and DotLn WoW Forever
at the same time, without babysitting, with feedback and bugs routed to
where they belong and acted on. The fork does its foundational Angular work,
the UI included, through its own planning passes and lifecycle as soon as it
can run and publish them (operator correction 3, 2026-10-11); WO-210
(closed) is the point at which it can. WO-083's run then measures one
bounded Angular order, not necessarily the repository's first change.

**One order first: the complete run fits the machine** (the 2026-10-19
pass). WO-221 closed on 2026-10-19 as v0.85.0 and paid fifteen complete
runs in its window, the three passing ones at 37 to 46 minutes on four
lanes of a sixteen-processor machine with 1.76 lanes busy on average; its
D019 measured the levers and deferred them to a planned order. WO-222
takes the lanes from the host under a memory budget per lane, lets light
suites run beside the three exclusive suites, splits the `target-worktree`
suite into file lanes, and keeps each lever only on before-and-after
timelines ([the planning document](standard-pass-2026-10-19.md), §4). It
runs first because every later order pays the complete run several times.
The fork's next target order, which WO-221 was filed to make cost the
operator its phrases and one merge, has not run yet: the fork's 2026-10-18
pass waits for the upgrade order that takes the starter at v0.85.0, and the
count is reread when it runs.

**Then the boarded follow-ups, in four batches** (the 2026-10-17 pass, on
the operator's direction that every boarded, follow-up and reopened row is
resolved by a work order). The register held 130 pending decision rows
boarded by closed orders across 53 orders, the oldest from 2026-09-18, 88
of them boarded in one week; the rule that the next order editing a surface
takes its rows delivered none. WO-217 to WO-220 cut them by subsystem (the
gate; the instance and publication; records, roles and the harness; the
resident and the vertical), each row fixed with a case or declined with its
reason, the register showing it; the 2026-10-18 pass added five rows and
the 2026-10-19 pass twelve (WO-221's seven boarded rows and five of the
fork's requests). The operator may interleave them with the
focus orders by one sequence edit.

The order, serial:
- WO-222: the complete run fits the machine: lanes from the host under a
  memory budget per lane, light suites beside the exclusive three, the
  `target-worktree` suite as file lanes, each kept on before-and-after
  timelines.
- WO-217: boarded follow-ups, batch 1: the gate, the runner, the host guard,
  gate evidence and the fixtures (35 rows).
- WO-218: boarded follow-ups, batch 2: the instance lifecycle, export and
  kit, publication, release close, the starter, worktrees and the
  target-order lifecycle (42 rows).
- WO-219: boarded follow-ups, batch 3: lifecycle records, attestation, role
  text, hooks, the harness and planning machinery (43 rows).
- WO-220: boarded follow-ups, batch 4: the resident, the vertical, the
  console, intake and triage, audit, the corpus lanes and the kernel's
  admission (20 rows).
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
- WO-222 — The complete run fits the machine
- WO-217 — Boarded follow-ups, batch 1: the gate
- WO-218 — Boarded follow-ups, batch 2: the instance and publication
- WO-219 — Boarded follow-ups, batch 3: records, roles and the harness
- WO-220 — Boarded follow-ups, batch 4: the resident and the vertical
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
