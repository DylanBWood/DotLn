# WO-175 register write-back at close

These revision-1 source rows remain allocated to WO-175:

- ER4-003: `FUP-a7461ebe9627663d` — numeric reopening listing.
- ER4-004: `FUP-72adcb05563bb99b` — resolved predicates and honest count.
- ER4-007: `FUP-ae897de944b750d6` — sibling temporary root and cleanup.

The order schedules their retargeting at close. The closing actor reads the
current register and source revisions, then applies one canonical
`npm run plan -- followups --apply` batch: set each row to `settled`, with no
targets, citing the closed order and this evidence directory. Preserve their
existing reopening conditions. If judgment fails or the order is not closing,
leave the allocations live; never edit register JSON or apply a stale revision.

ER4-007's settled reason must state the evidence level: fake review/refutation
launches receive TMPDIR, receipts inventory it, read-only scratch cleanup
passes, and the canonically frozen portfolio suite passes 3/3. The first live
entropy review/refutation with this capability still belongs to the next
`planning: entropy reducer` receipt; this executor runs no live entropy episode
and grants no additional Codex sandbox access.

The already-open recurring gate-cost row `FUP-fb8cbeabbddef397` remains planning
input. A holding threshold is an observation, not an instruction to change its
source condition. WO-150-D003 remains a candidate until a later authorized
record explicitly reopens it. The two non-goal rows `FUP-e55e258d37cb3f20` and
`FUP-01e80ba5ce62c72a` keep their existing routes.
