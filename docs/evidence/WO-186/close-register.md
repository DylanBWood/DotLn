# WO-186 register write-back at close

Criterion 10 schedules these dispositions at close. The executor leaves the
live allocations intact; this document is the closing actor's evidence and
instructions, not a claim that verification or release close has happened.
The procedure follows the existing WO-174 close-register record.

Read the current register and source revisions before applying one canonical
`npm run plan -- followups --apply` batch. Never edit the register JSON or use
a stale revision. If the order does not close, preserve its allocations.

| Register row | Judgment to apply when closing | Evidence and reopening condition |
| --- | --- | --- |
| FUP-a9a0591a63757bf2 | Settle the allocated task-reuse repair, with no targets. | The second-shell fixture composes the complete row from passing task results and runs only the failed task. Forced-fresh and reviewer runs remain required by design. Reopen if an ordinary rerun repeats a reusable task at the same identity. |
| FUP-7629e03c6573f5cb | Settle the untracked-input defect, with no targets. | The identity covers nonignored untracked code; edits invalidate the row and staging preserves the identity. Reopen if source bytes executed by a product task are absent from the identity or its guarded input contract. |
| FUP-71602ec08bc81e9d | Settle this duplicate of the preceding identity defect. | Preserve the same evidence and reopening condition. |
| FUP-986fa3905beb0695 | Settle the moving-review-base defect, with no targets. | The sibling-advance fixture leaves the selection and claim check unchanged; the worktree's own machinery change still widens it. Reopen if an upstream-only change alters that selection at unchanged worktree code. |
| FUP-5cc91ab6105d2eeb | Settle the allocated explanation and reuse repair, with no targets. | D006 and costs.md distinguish historically covered repeats, the former untracked-source rule, failed tasks, grown selection and explicit forced-fresh runs. Historical totals are exposure, not realized savings. Reopen for fresh same-identity repeats whose recorded reason does not explain why reuse was bypassed. |
| FUP-b28b870422a74166 | Return to open status, with no targets; do not settle. | D007/D013 route the eight named suites: five to the fresh document gate and three keyed by the vocabulary. Remainder (VER-001 R3, D033): copy sources are judged for records only, and shell commands and native tools are unobserved. `license-fixtures`, `worktree` and `release` copy `docs/LEGAL.md` through `scripts/test-license-fixture.mjs`; `release` also copies `docs/releases/tag-manifest.template.json` and `docs/control/budgets.json` with shell `cp`. A LEGAL pin edit still fails the document gate's `license-surfaces`. Preserve the separately open committed-input boundary, FUP-dc1335f4d10f6a75. Planning chooses a route per input: key it, author it in the fixture, or move the reading case. |
| FUP-331423b3559f5cfa | Return the unresolved cost question to open status, with no targets; do not settle a purported 180-second harness saving. | D005 disproves that case-duration premise: its original median was already 1.924 seconds. The original full-harness profile attributes cost to other assertion-bearing cases. Keep the correct machinery selection and the recorded 120-second reopening threshold; planning must judge the actual remaining selected-suite cost in costs.md. |
| FUP-e96221b106cd136a | Return the deferred cold-gate cost question to open status with no targets when this order closes. | The recorded trigger fires: the qualified five-observation after-phase plain median is 422.027 seconds, above 360. Return the measured build/release/integration critical path to planning, with the lane-peer growth costs.md records beside it (VER-001 R5, D036): summed release task time rose from 354.286 to 423.640 seconds and worktree from 100.477 to 118.962 when the lock matrix became concurrent, by inference from the recorded rows. Do not claim lane packing was changed by this order. |
| FUP-fb8cbeabbddef397 | Return the deferred document-gate cost question to open status, with no targets. | Its reopening condition has occurred (VER-001 R4, D036): the document gate's median is 66.690 seconds at this order's source (three rows, 62.149 to 67.380, 29 tasks) against 38.993 seconds over main's 140 passing October rows (24 tasks). `resume`, one of the five suites this order moved there, accounts for it: it takes 49.4 to 53.7 seconds and ends the critical path. The document check alone takes 11.787 to 12.872 seconds, under its 20-second condition. At seven document gates an order pays about 194 seconds more. |

The register's last read in this execution showed source revisions 1, 6, 1,
1, 2, 1, 1, 1 and 1 respectively in the table's order. These are provenance,
not permission to apply a future stale batch. Cite the closed WO-186 record,
measurements.json, repair-measurements.json, costs.md and this directory in
each disposition reason.

The repair's own dispatch applied five settlements to the register, each for a
row its decisions answer: FUP-b941a857143acff0 (D031, the repair itself),
FUP-ee77538e5276336e (D032, the security document's sentence), and the rows
minted when D033, D035 and D037 reopened D017, D006 and D009. Three rows the
repair minted stay open for planning and need no action at close: D036's
(the document gate and the lane-peer growth), D038's (the skeleton lookup and
the runtime snapshot) and D039's (how a Claude Code role records Ultracode).

The FINAL-001 repair applied its own canonical batch on 2026-10-05 at
19:39:21.509Z, register revision ce5babf2a5c45cd9c688c187e360fbbf7a368fe990fd742381aec8f2b1b31591:
FUP-ff62b8dd608794b0 (D041), FUP-3a2358223cd7864f (D042) and
FUP-7a67deb691d858ea (D035) settled. FUP-0c10689747f83675 (D033 source
revision 2) remains open for planning alongside the existing excluded-input
investigation. D044 to D046 and repair-final001-checks.json retain their
evidence and reopening conditions. This does not apply or alter the original
close-only allocation dispositions in the table above.
