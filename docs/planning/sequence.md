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

- WO-240: Node 24 beside Node 26, so the starter runs where the operator's
  other host runs it, and the private-clone recipe in the kit README; first,
  because the clone comes next and the order is small.
- WO-247: WO-192's immediate follow-up (the operator's waiver note of
  2026-10-31, ignored capture SHA-256 `2aee1c8dd856039ee1865d27b4578d5bb146fa8ab767049c3fadd3f5bca81966`:
  the Codex close refusal seems solvable and needs an immediate
  follow-up): the declined close's reason retained and diagnosed, a drive
  that finishes or stops with a next step, live receipts bound to code
  identity, the ten criterion-17 items, the publication fixture that cannot
  reach a real host, the sandbox election, both hosts requalified; second,
  behind the one-day order the clone waits on, which is the planner's
  reading of "immediate" against the operator's placement of WO-240 the day
  before; the operator moves it first with one edit.
- WO-237: a closed order keeps its journals, and a temporary root survives a
  reboot's device renumbering (the operator's item 8 of 2026-10-30: WO-239's
  close refused six of its own build directories); third, small and live,
  and it now carries the `plan start` block bound that refused the
  2026-10-31 pass's entry.
- WO-245: the kit's guide becomes `docs/KIT.md`, a kit file, and the front
  page is the instance's, seeded once and never fought over (the operator's
  item 1 of 2026-10-31, ignored capture SHA-256 `be49aeb50d95aac99a5dace4ca1aa8b4aa8a719f9e1a947fe5884be00e838180`);
  fourth, small, and the fork's quality pass waits on it.
- WO-248: the pull-request process table says what its reader can use (the
  operator's third message of 2026-10-31, ignored capture SHA-256
  `52d78604680f1938af0e1489cbb5dec00b496f54df7188dc2fe9c4adc4c838b7`);
  fifth, small and visible on every pull request in core and the instances.
- WO-238: a document says what is so: the kinds contract, the reader
  binding, the read census and red tags, the kit's templates, the planning
  root and the execution guide; sixth, after WO-245 moved the kit guide it
  edits.
- WO-241: the features file: `dotln.config.json` says by name what an
  instance elects, a registry says what each feature is and whose, a
  generated page renders it; seventh, because plan-first reads it.
- WO-242: plan-first mode: the plan, the conversation and the proposal
  before anything is implemented, the operator's approval as a typed event
  the hook enforces; eighth; its router step lands against WO-192's merged
  router.
- WO-243: closeout checks follow the repositories an order changed, one
  selection read by the role text, the integrate helper and completion (the
  fork's item 3 of 2026-10-30); ninth, small and a convenience for the fork.
- WO-244: paired planning passes and the synthesis pass as a routine (the
  operator's direction of 2026-10-30): the dispatch labels, the blindness
  refusals, the pair record and `plan synthesize`; tenth.
- WO-246: the launchpad's own pull requests opened by a helper on origin's
  repository, the title lint admitting core's own form, the `gh` refusal in
  a fork clone (the fork's items 6 and 9 of 2026-10-30); eleventh, after
  WO-244 whose `gh` judgment it extends; a convenience with a working route
  today (`gh repo set-default`).
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
- WO-240 — Node 24 beside Node 26, and the private-clone recipe
- WO-247 — A driven Codex order finishes
- WO-237 — A closed order keeps its journals, and a temporary root survives a reboot
- WO-245 — The kit's guide is a kit file and the front page is the instance's
- WO-248 — The pull-request table says what its reader can use
- WO-238 — A document says what is so
- WO-241 — The features file
- WO-242 — Plan-first mode
- WO-243 — Closeout checks follow the repositories an order changed
- WO-244 — Paired planning passes and the synthesis pass
- WO-246 — The launchpad's own pull requests
- WO-083 — The real run from the operator's instance
- WO-207 — An instance's kit updates: rollback, extension point and build channel
- WO-193 — An instance's capability requests to core
- WO-183 — Intent declaration and the stranger test
- WO-088 — Planning documents as checked contracts
- WO-091 — The full 5S set on the Repo Gardener
- WO-096 — Feedback rule migration
- WO-014 — Approval-burden baseline
<!-- dotln-work-order-sequence:end -->
