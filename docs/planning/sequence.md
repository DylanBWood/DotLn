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
orders. Private deployments own their plans and data. Core receives only the
operator's manually written generic requests.

## The order, serial

The [2026-10-30 pass](portable-config-assisted-2026-10-30.md) puts the requested
adoption path first: runtime compatibility, readable choices, then assisted
change review. Target check selection follows; journal retention and safe
disposable cleanup share the existing close subsystem. The router's active
worktree and obligation remain preserved. WO-235 and WO-239 are closed and
leave this list; the unactivated private-map proposal is retired, not passed.

<!-- dotln-work-order-sequence:start -->
- WO-240 — Run core and the starter on Node 24.15.0 and Node 26
- WO-241 — Make feature and loadout choices readable and effective
- WO-242 — Discuss and inspect a proposed change before applying it
- WO-243 — Select closeout checks for the repositories an order changes
- WO-237 — Keep closed journals and remove disposable build staging safely
- WO-238 — A document says what is so
- WO-192 — A router drives an order through its lifecycle
- WO-083 — The real run from the operator's instance
- WO-207 — An instance's kit updates: rollback, extension point and build channel
- WO-193 — An instance's capability requests to core
- WO-183 — Intent declaration and the stranger test
- WO-088 — Planning documents as checked contracts
- WO-091 — The full 5S set on the Repo Gardener
- WO-096 — Feedback rule migration
- WO-014 — Approval-burden baseline
<!-- dotln-work-order-sequence:end -->
