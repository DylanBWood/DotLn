# Proposed work-order sequence

The operator-authored sequence below is the single editable input to the
index and refutation subject. It grants no activation authority. For rationale see
[the planning map](work-order-map.md). Closed and withdrawn entries leave the
list at the next planning pass (operator direction, 2026-09-22; WO-158); the
generated work-order index is their record, and the map and archive keep their
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
a time.

Every open order has a place in this list
([2026-10-02 pass](standard-pass-2026-10-02.md)). The machinery reset
([2026-10-07 pass](machinery-reset-2026-10-07.md)) ran WO-196 first and cut
six pairs on the orders' primary source files; five of those pairs and
WO-196 closed between 2026-10-07 and 2026-10-10 and leave the list here
([2026-10-10 entropy pass](entropy-review-006-2026-10-10.md) §6). WO-078
and WO-191 are the pair that remains; both depend on nothing queued. WO-072
runs alone because every machinery order shares `resume.mjs`,
`release.mjs` or `worktree.mjs` with it. WO-200, filed from REVIEW-006,
pairs with WO-076: it depends on no queued order, and WO-076 is the first
delivery order that does not edit `scripts/test-runner.mjs`, which WO-078
and WO-072 both edit. WO-118 follows WO-199, WO-075 and WO-076. WO-192,
WO-193 and WO-194 follow WO-118, the loop from a starter instance: the
operator asked for them once the starter exists, and the product exit does
not wait behind them. Nothing in WO-192 depends on the export, so it may
move into the machinery lane at the operator's word. WO-088 and WO-089
stay near the end under their 2026-09-19 holds; WO-088's gap was absent
for a fourth pass on 2026-10-10 and it stays for the operator to withdraw.
WO-014 is last but one until a pass finds approval friction recorded as
the constraint. WO-083 is last: it needs the operator's fork on the
operator's own machine, where DotLn may not be installed for some time
(operator direction, 2026-10-07), and nothing before it needs that. The
period below `v1.0.0` is early access (operator direction, 2026-09-30).
The order of everything after the first pair is the planner's, as the
operator said on 2026-10-07.

<!-- dotln-work-order-sequence:start -->
- WO-078 — Sibling registry and export receipts
- WO-191 — Reader profiles for published text

- WO-072 — Target worktree lifecycle

- WO-076 — Instance build overlay
- WO-200 — Pinned collector bytes are watched where they change

- WO-118 — The resident-owned loop from a starter instance
- WO-192 — A router drives an order through its lifecycle
- WO-193 — Capability requests from an instance
- WO-194 — Private predecessor map
- WO-183 — Intent declaration and the stranger test
- WO-113 — Work-order files are stable contracts
- WO-080 — Workstream document and index grouping
- WO-081 — Board Workstreams section
- WO-082 — Synthetic pilot
- WO-096 — Migration ledger
- WO-097 — Rule migration batch 1a
- WO-098 — Rule migration batch 1b
- WO-091 — Multi-active link groups
- WO-092 — The sets graph extension
- WO-093 — The 5S mechanics as data
- WO-094 — Set bonuses lowered
- WO-095 — Full-set scenario and set tooltip render
- WO-089 — Capability table fold
- WO-088 — One source for the phrase table
- WO-014 — Approval-burden baseline
- WO-083 — The real run from the operator's launchpad instance

<!-- dotln-work-order-sequence:end -->
