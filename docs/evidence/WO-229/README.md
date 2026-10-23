# WO-229 — host-lane visibility

## Base observation

At `62fa2676`, the bounded session-scratch `wo229-base.mjs` probe ran a
document fixture gate in one checkout behind a full-capacity lease in a
second checkout, sharing a temporary registry. It printed:

```text
WAIT host lanes for build: 5 ms; held by complete-fixture (4 slots, 158 ms old, owner alive, 0 task processes, 0 retained subleases)
npm run test:docs: 2 passed; 0 failed; 1.46 s; 2 fresh tasks
```

The row had `durationMs: 1461`, build `hostLaneWaitMs: 1172`, and
critical-path `workMs: 203`, `waitMs: 1186`, `durationMs: 1389`. It had no
`hostLaneWait`, `laneWaitMs`, `gapMs` or holder relation. The fixture paths
were omitted from this record. Its temporary repositories and guard were
removed after the probe.

The same probe called `planningConditions` with `slow: true` and the two
slow rows from `CONDITION_TABLE`, the document measurements used by
`npm run plan -- conditions --slow`. Both were unavailable (`probe exit 1`)
because the generated task refused the unprepared `release-surfaces`.
The retained rows at 05:04:59 and 05:05:41 UTC on 2026-10-23 name that
failure. The base method was “median of three fresh document gates”; its
host context said “load measured; other host activity unknown”. No passing
baseline median is claimed. The ordinary release preparation is the remedy.

`node scripts/harness.mjs` printed usage naming bounded, emit/check,
evidence, usage, read-output, prune and writer; no `lanes` action existed.

Commands: `node scripts/harness.mjs bounded -- node <session-scratch>/wo229-base.mjs`;
`node scripts/harness.mjs`; readback through `readGateChecks(process.cwd())`.
The ignored scratch JSON retains the bounded probe's full result.

## Implementation evidence

The bounded host controls exercise another checkout, a symlink alias of this
checkout, a nested own lease, legacy missing-worktree records, the actual
`lanes` CLI and a real waiting gate's summary and recorded row. Inspection
leaves registry bytes unchanged, including stale records; an absent registry
is not created and an unprepared native reader remains unavailable.

The arithmetic fixtures establish union rather than summation for concurrent
waits, unknown time before observations and during lock waiting, and
`laneWaitMs + gapMs = waitMs`. Runner and planning fixtures verify that reused
tasks lose attribution. Injected child rows produce a 110 s wall median and
a 10 s execution median, mark contention and judge the latter; failed and
stale rows remain unavailable. [Paired controls](controls.json) record three
passing positive controls and failing mutations for union arithmetic,
execution cost and read-only inspection.

[Structural measurements](structural-need.json) contain all 42 successful
CPU/RSS/wall observations. The two incomplete attempts are retained;
[size-requests.mjs](size-requests.mjs) includes their successful observations
in the conservative [sizing result](sizing.json). The capacity is eight.
Format requests three host slots; configuration-root, registrations, generated,
host and kit verification request two each. Declarations now requests its measured four slots under the
operator-authorized exception in D022. The original sizing record retains the
prior eight-slot result; [repair sizing](sizing-repair.json) records the exception. Every structural task retains all local lanes.

The [sibling-gate comparison](structural-admission.json) passed both arms.
The original measured requests reduced document wait from 3,050 ms to 2,108 ms,
but verification established that declarations waited until the complete gate
ended. That comparison did not establish criterion 5. The strengthened
[repair controls](repair-controls.json) retain staggered peers and require
further complete-gate admissions after the last document admission. This finite workload supplies evidence for request sizing, not a
fairness guarantee. Core kit-verification measurements use core's verifier
on the fixture export because core has no kit manifest.

Authority, artifact-identity and verification were re-minted as WO-229
revision 001 through their explicit generators. Feedback was carried from
WO-225/feedback-001, preserving the original WO-217 live audit; the final
implementation leaves that audit's resource-reader source unchanged. The
selected editions are checked by sync and the full gate.

The review corrections also retain active waits in stopped rows without
claiming that waiting tasks executed. A real signal fixture completes its
build, waits behind a sibling and records that wait at stop. Planning samples
carry a unique child marker; an unrelated candidate row cannot replace them.
`--check-only` was exercised separately and printed only the plan judgment.
The executor removed its measurement export (no commit) and found no nested
repositories outside the ignored intake and dependency directories.

The fourth complete review passed at 2026-10-23T07:18:59.781Z: 40 suites,
106 fresh tasks, no reuse, no unrun task and zero failures in 1,616,918 ms.
Its recorded lane-wait union is 1,040 ms, all unknown; critical-path lane wait
146 ms plus gap 157 ms equals the retained wait total of 303 ms.
[Gate attempts](gate-runs.json) retain the two failed runs, the canonically
stopped third run and the passing fourth run. D014 through D017 describe the
fixture repairs; the queued memory-fixture repair is completed with the
negative and positive evidence in [fixture controls](fixture-controls.json).

The first document gate after that review found two links targeting D002's
short anchor while its heading included descriptive text. The correction
keeps the description as a paragraph under the stable `WO-229-D002` heading.
Those document edits did not change the original review identity. The repair
changes source and has a new complete row at its own identity.

## Verification repair

The repair preserves checkout relation changes independently of the 32-entry
diagnostic history. Static and rotating holders remain attributable after
more than 32 observations. The real rotating-holder gate attributes 6,802 of
6,812 ms to another checkout; the static-holder acquisition attributes 7,059
of 7,063 ms. The remaining intervals are unobserved, and neither probe leaks
a checkout path. Additional regressions cover 80 alternating relation
changes, mixed holders, lock waiting, stop, and a later child after an overlap
reservation ends. Reuse strips the compact relation history as well.

With the operator-authorized four-slot declarations request, the strengthened
admission fixture records 2,079 ms document wait below a 3,060 ms longest
complete task, with two subsequent complete admissions. The full-capacity
control records 7,353 ms against 3,068 ms and no subsequent admission.
[Repair controls](repair-controls.json) preserve both arms and the original
failure reproductions. Summary formatting also omits zero-rounded totals
and parts without changing recorded milliseconds.

The complete repair review passed at 2026-10-23T12:44:05.000Z: 40 suites,
106 fresh tasks, zero failures and no unrun tasks in 1,666,586 ms. Its lane
wait is 1,157 ms; critical-path lane wait 264 ms plus gap 162 ms equals the
retained wait total of 426 ms. The separate bounded evidence-source gate
passed at 2026-10-23T12:46:00.775Z. [Repair gate attempts](repair-gate-runs.json)
also retain the canonically stopped first repair review, which began before
sync completed; D024 records the sequencing correction. It is not passing
evidence. The [handoff](handoff.md) supplies current criterion judgments.
