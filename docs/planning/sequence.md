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
  page is their record. A member of a workstream marked `track: separate`
  is listed under Workstreams by the generated index and needs no entry
  here; a proposal the operator retires before activation leaves the live
  roots for `docs/retired/` with its bytes intact.
- **Order size.** One subsystem's chain of work is one order with one
  outcome; the binding cost is the full gate run and the fixed cycle every
  order pays. Unrelated subsystems are not bundled. Reopen when the full
  run's median falls to half its 24.9 minutes, or when merged orders fail
  first verification more often than five of eight.
- **Placement.** The operator places an order by one sequence edit; the
  order of everything the operator did not place is the planner's.
- **Hosts.** The kit runs on Git 2.31.0, the Git on the operator's work
  laptop (operator direction, 2026-11-08, ignored capture SHA-256
  `a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`). An
  order that declares or raises a host floor names every host the record
  shows and refuses none of them
  ([product 07's host-refusal screen](../product/07-execution-guide.md#operator-opened-planning-pass)).
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
orders. The operator's private instance on a constrained managed host clones
the starter, never this repository, and carries what it needs into core
through the operator's own planning prompts in generic terms (operator
direction, 2026-10-30); no stream of work in this repository depends on it.

## The order, serial

- WO-260: the kit runs on Git 2.31.0: the six Git forms above it replaced
  at their call sites (the classification at a committed revision, the
  tree-entry reads of an order's publish and a target order's records, the
  main checkout's intake grant, the stash backend, the source-change
  admission and the fixtures' isolated configuration), the declared floor
  at the work laptop's Git, a core-only recorded Git surface and a
  below-floor shim with its cases (the operator's item 2 of 2026-11-08, ignored
  capture SHA-256
  `a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`;
  WO-258-D009's reopening condition); first, ahead of the active WO-244,
  because every gate refuses the operator's work laptop today. Its call
  sites are disjoint from WO-244's planning machinery apart from separate
  hunks of four files, so the operator may dispatch it beside the active
  order, and the second of the two to reach final review integrates the
  first.
- WO-244: paired planning passes and the synthesis pass as a routine (the
  operator's direction of 2026-10-30): the dispatch labels, the blindness
  refusals, the pair record and `plan synthesize`, and the reviewed route
  (the operator's fourth message of 2026-10-31): `plan review` running the
  executor's three reviewer types through WO-250's helper before the
  refuter, with WO-255's capture flag for the criteria review; active
  since 2026-11-08, second.
- WO-261: an instance's update keeps its own files: the update publish
  refusing a merge that rewrote a file the instance had changed, with a
  per-path admission and a preview section; the words screen leaving out a
  session sub-root; a tag fetch refused against a remote set to bring none;
  a kit launch counted in every spelling (the fork's block after starter
  v0.122.0, items 2, 5 and 8; WO-258-D035); third, after WO-244, whose role
  and hook files it edits.
- WO-262: review findings are judged before they are fixed: the admission
  rule in every review brief, the executor's judgment as typed fields in
  the round's decision and the document check's one refusal (the
  operator's direction during WO-259, WO-259-D021 and D022); fourth, after
  WO-261, which edits the same role file. The rule itself is in force from
  product 07 as this pass wrote it.
- WO-263: the complete run takes its exclusive suites in one convoy: the
  four exclusive rows share the strongest lead among them, so heavy work
  drains for them once; a suite that failed last still leads; the
  target-worktree group starts its longest file first; WO-222's overlap
  lever reassessed from a same-source pair of complete runs (the operator's
  item 4 of 2026-11-08; WO-222-D015's reopening condition; the cold-gate
  candidate); fifth, because it shortens every later final review and
  stops nothing today.
- WO-083: the real run from the operator's instance, after the router so
  the measured run is driven the way the operator will drive orders.
- WO-207: an instance's kit updates: rollback, the extension point and the
  build channel; the planner's source seam for an instance's own tracker
  script is its carry-in.
- WO-193: an instance's requests reach core's intake.
- WO-183: an intent enters the resident's loop.
- WO-088: planning documents as checked contracts, with pass registration
  out of the idea ledger and the retired header for an order that never
  activated.
- WO-091 (the full 5S set), WO-096 (rule migration), WO-014 (the
  approval-burden baseline).

<!-- dotln-work-order-sequence:start -->
- WO-260 — The kit runs on Git 2.31.0
- WO-244 — Paired planning passes and the synthesis pass
- WO-261 — An instance's update keeps its own files
- WO-262 — Review findings are judged before they are fixed
- WO-263 — The complete run takes its exclusive suites in one convoy
- WO-083 — The real run from the operator's instance
- WO-207 — An instance's kit updates: rollback, extension point and build channel
- WO-193 — An instance's capability requests to core
- WO-183 — Intent declaration and the stranger test
- WO-088 — Planning documents as checked contracts
- WO-091 — The full 5S set on the Repo Gardener
- WO-096 — Feedback rule migration
- WO-014 — Approval-burden baseline
<!-- dotln-work-order-sequence:end -->
