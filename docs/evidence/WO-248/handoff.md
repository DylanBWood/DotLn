# WO-248 implementation handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.166.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

The pull-request meter now renders its named order's dispatches in one
eight-column table. Cells contain a single value or `unknown`; durations use
hours and minutes. Named sentences below the table compare available order
totals with the latest closed predecessor. Both release callers pass their
subject explicitly. Detailed terminal metrics remain available.

The local application target is v0.110.1, assigned under the order's patch
classification. No component source, package version, lockfile or dependency
changed. Product 07, publication lock, decisions and generated indexes are
updated. [D002](decisions.md#wo-248-d002) records the design, its evidence and
reopening conditions.

**Criterion 1:** met — The passing process-debt fixture renders the exact eight-column header, one row per subject dispatch, single values, unknowns and observed zeroes; it checks two open orders and a selected closed subject, with no Work table or omission footer. The release meter fixture also checks the generated body's cells and subject isolation.

**Criterion 2:** met — The passing renderer fixture verifies one sentence for each of the seven comparable metrics, the latest closed predecessor's name and state, metric-specific units, no comparison with an intervening open order or later closed order, and omission when a prior closed order or either operand is unavailable.

**Criterion 3:** met — `npm run meta` printed the new subject table and retained the detailed metrics and labelled previous-order deltas. The complete gate's generated/meta check and process-debt suite passed, including the revised direction and closed-snapshot assertions.

**Criterion 4:** met — The passing release `meter_shape` case replaces an old block, preserves reviewed prose, keeps the new subject's block last and excludes a second open order. Regeneration uses that same subject. The release surface and github-body checks passed; `withMeterBlockLast` is unchanged.

**Criterion 5:** met — Product 07 §Discipline describes the block, comparison scope and terminal output. `npm run publication:check` passed after sync refreshed the source lock; the complete gate's generated/publication check passed too.

**Criterion 6:** met — `npm test -- --review` passed at the identity below; `git diff --check` is clean and no dependency changed. The final `npm run test:docs` row for this authored candidate is required and consumed by the implementation-ready transition; completion is recorded only after that row passes.

## Executed evidence

The complete review run passed all 43 required suites with 116 fresh tasks and
no unrun suites, in 0 h 36 min. It started at 2026-11-02T20:11:19.432Z and recorded
success at 2026-11-02T20:47:21.481Z. Code and build-output identities stayed
unchanged. The source identity is
`f6b51efe3c2ea29f7ed9c8e6d022f3845319bd6066143ecdfb5e5e46b2055250`;
[validation.json](validation.json) is a projection of the canonical host row.

Main and the worktree shared head
`91a730ac706a1933ebe9fb2c826455d8adffb4dc` before the gate; `HEAD..main` counted
zero commits. Main, origin/main and tags stayed unchanged during it. No
integration was needed. The gate's cleanup completed with zero blockers.
The default evidence waiter reached its 0 h 20 min timeout and returned
`{"run":null}`; a new waiter with a 1 h 0 min allowance observed the same
gate's passing result. This did not restart the gate. Both gate and waiter
processes exited successfully.

The three independent reviews and their rechecks are retained in
[self-review.md](self-review.md). The only finding was a missing direct test
dependency declaration; its focused regression failed before the repair and
passed afterward. All reviewers finished before the complete run.

self-review: found 1; fixed 1; recorded 0

The explicit count is three `codex-spawn-agent` workers, all requested at
`gpt-6.1-sol`/`max`, with no descendants. They were reused for rechecks. The
executor ran `gpt-6-astra`/`max`, as the current-session readback reports.

**Process cost:** Entry and handoff usage are available from
`node scripts/harness.mjs usage 01a19ddc-4701-7580-9256-d8b0b112b168`, source
`codex-transcript-counter`, scope `dispatch`. Final counters and their cutoff
remain in ignored observations and the response. USD is unavailable; worker
usage coverage is not established by the root's counter.

The outcome matches the intended rendering scope: no collector or metric
change, an explicit subject and reference, and missing values visible at the
point of reading. The adjacent-work queue is empty. A post-gate `.git` traversal
found no nested scratch repository. No branch commit or publication was made.

## Limits

GitHub wrapping depends on the reader's viewport; this order judges cell
contents, not pixels. The fork screenshot was unavailable in this checkout;
core PR #258 and the existing renderer independently established the defect.
Closed subjects outside the collector's existing selection are not fetched;
the renderer does not borrow another order's rows. Existing stored bodies
receive the new block on their next release preparation. These are the order's
recorded boundaries, not deferred findings.
