# Proposed work-order sequence

The operator-authored sequence below is the single editable input to the
index and refutation subject. It grants no activation authority. This
document states the current order and the rules that shape it. The
rationale for each order is in [the planning map](work-order-map.md); the
record of how the list changed is the generated
[history page](../work-orders/HISTORY.md) and the dated planning documents
under this directory, which a pass writes and no one rewrites.

Planning entry returns the pending [follow-up register](followups.json) in
bounded pages; `npm run plan -- followups` gives its counts, source
pointers and continuation command. Untouched items persist across passes.

## Rules in force

- **Serial for now.** Core runs one order at a time for the next thirty
  orders from 2026-10-13 and parallelizes across repositories instead: the
  fork, DotLn-Angular and DotLn WoW Forever (operator direction,
  2026-10-13). Parallel orders stay the aim where they pay; when pairs
  return, two entries between blank lines are a lane pair (the delivery
  order first, a machinery or evidence order second, disjoint primary
  surfaces, no hard edge), one order at a time passes final review and
  release close, and the entries after the last pair run one at a time
  ([the map's tracks](work-order-map.md#tracks-and-dispatch-dimensions)).
  Reopen pairs when the thirtieth of those orders closes, or on the
  operator's word.
- **Every open order has a place in this list.** Closed and withdrawn
  entries leave the list at the next planning pass (WO-158); the history
  page is their record.
- **Order size.** One subsystem's chain of work is one order with one
  outcome; the binding cost is the full gate run and the fixed cycle every
  order pays. Unrelated subsystems are not bundled. Reopen when the full
  run's median falls to half its 24.9 minutes, or when merged orders fail
  first verification more often than five of eight.
- **Placement.** The operator places an order by one sequence edit; the
  order of everything the operator did not place is the planner's.
- **Early access.** The period below `v1.0.0` is early access (operator
  direction, 2026-09-30).

## Focus

**The starter, the operator's fork of it and DotLn-Angular, with a DotLn
UI** (operator direction, 2026-10-13). The win condition is progress in
core, the starter, the fork, DotLn-Angular and DotLn WoW Forever at the
same time, without babysitting, with feedback and bugs routed to where they
belong and acted on. The fork does its foundational Angular work, the UI
included, through its own planning passes and lifecycle; WO-083's run then
measures one bounded Angular order driven the way the operator will drive
orders. Work that mines or works with the predecessor, launchpad v1, is
WS-002 (`docs/workstreams/WS-002-predecessor-track.md`), apart from the
serial queue and blocked by nothing in it.

## The order, serial

- WO-235: no artifact shaped by its predecessor, no operator direction
  dropped, and every standing document holding state instead of story
  (the operator's corrections of 2026-10-26 and item 4.c of 2026-10-28);
  first, as the operator placed it.
- WO-239: release close prepares the runtime before it loads it and runs
  once; every release pays the close, and the order is small; second.
- WO-238: a document says what is so: the kinds contract, the reader
  binding, the read census and red tags, the kit's templates, the planning
  root and the execution guide (the operator's item 4 of 2026-10-28);
  third.
- WO-237: a closed order keeps its journals (the operator's question of
  2026-10-28 on the corrected unit); fourth.
- WO-192: the router, active with its worktree preserved, before WO-083 so
  the measured run is driven the way the operator will drive orders.
- WO-083: the real run from the operator's instance.
- WO-207: an instance's kit updates: rollback, the extension point and the
  build channel.
- WO-193: an instance's requests reach core's intake.
- WO-183: an intent enters the resident's loop.
- WO-088: planning documents as checked contracts, with pass registration
  out of the idea ledger.
- WO-091 (the full 5S set), WO-096 (rule migration), WO-014 (the
  approval-burden baseline).
- WS-002, apart from the queue: WO-228, the private predecessor map, which
  waits on WO-193's request route and on the operator running an instance
  where the predecessor is.

<!-- dotln-work-order-sequence:start -->
- WO-235 — No artifact is shaped by its predecessor and no operator direction is dropped
- WO-239 — Release close prepares before it loads and runs once
- WO-238 — A document says what is so
- WO-237 — A closed order keeps its journals
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
