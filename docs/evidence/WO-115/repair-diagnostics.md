# WO-115 repair diagnostics

This receipt belongs to `resume: fix` after FINAL-001. It records fresh
observations on the integrated WO-115 worktree; neither earlier failed gate
row is converted to a pass.

## Resident acquisition matrix

FINAL-001's complete product retry timed out the WO-143 acquisition matrix at
240,000 ms after six of eight categories. Its log records no failed recovery
assertion before that deadline. A focused unchanged-source run of
`node --test --test-name-pattern='WO-143 once and loop restart at every acquisition filesystem boundary' packages/skeleton/dist/test/resident.test.js`
passed in 180,247 ms. The test-only crash child was then changed to skip
console loopback listen, descriptor sync and close while retaining the real
`ResidentHost.run`, native filesystem instrumentation and SIGKILL behavior. The
same focused command passed in 174,288 ms. Both passing runs reported all
eight 38-or-48-boundary categories, the exact event prefix, one Lost event and
a successful second restart in each category. These are single-run timings:
the approximately six-second difference is a modest observation, not proof
that console setup caused the 240-second failure.

The first full gate's skeleton suite lasted 336,917 ms and passed while the
console suite failed. The second full gate's skeleton suite lasted 415,470 ms
and failed. In both, the skeleton and console suites ran with three other
available scheduler peers; worktree integration overlapped them. This supports
resource contention as a possibility, without measuring CPU or event-loop
delay. The complete gate result on the repaired subject is recorded below.

## Shared status watcher

WO-115's expanded gate and WO-085's verifier gate independently failed the
same `WO-114 text host refreshes after atomic replacement` case at its 2,000 ms
status-watch deadline. The WO-085 console row ran while skeleton, worktree
integration and work-order fixtures were active. The watcher source and test
have identical SHA-256 bytes in main, WO-085, WO-115 and WO-165; the failure is
not attributed to WO-085's changed package. No event trace in either log
distinguishes a missed filesystem notification from delayed scheduling.
Node's official `fs.watch` documentation lists notification caveats, so the
repair adds a 250 ms status read alongside event notifications. The existing
JSON comparison suppresses duplicate callbacks, and the interval is unref'd
and cleared when the watcher closes. A new fixture replaces `fs.watch` with a
silent watcher; its atomic replacement was still observed in 251.701 ms.
`node --test packages/console/dist/test/runtime-status.test.js` passed all
seven cases in 878.681 ms, including the existing atomic-replacement case in
10.859 ms. This demonstrates fallback behavior when notifications are absent;
it does not establish which cause produced the historical 2,000 ms failures.
The reviewed fix should land once in WO-115; sibling worktrees
take it through their normal integration of main after this order passes.

## Complete repaired product gate

`node --test scripts/test-runner.test.mjs` passed all 41 scheduler cases in
14.895 s. The new admission assertion requires skeleton to hold all four
scheduler slots with no active peer. `npm test` then passed all 28 required
suites, 0 failures and 72 fresh tasks in 444,801 ms at
2026-09-26T04:46:43.785Z, code identity
`5444501048f6ea4a2dc1df1c4dff94df8022b5bb9cbd7ff89febbf47236227dd`.
The canonical gate row records skeleton alone for 295,465 ms and console
passing for 20,582 ms. The WO-143 acquisition matrix passed inside skeleton,
and the WO-114 watcher cases passed inside console. Console still ran beside
other shared suites, including worktree integration and work-order fixtures;
its success therefore does not depend on isolating the console suite.

The complete gate took 25,802 ms longer than the preceding 418,999 ms failed
retry, so this run establishes reliability at the repaired subject, not a
whole-gate speedup. The focused six-second fixture difference remains a
single-run observation and was retained. A single passing full gate does not
identify the historical timing cause or guarantee that unrelated host load
cannot affect later runs. The behavioral fallback is independently exercised
by the silent-watcher test.

Sources: `docs/final-reviews/WO-115/FINAL-001.md`, the two canonical local
check-output logs it names, `docs/control/local/harness/checks.json` (gate rows
recorded at 2026-09-26T04:06:20.583Z, 04:14:11.764Z and
04:46:43.785Z), WO-085's local
console failure log and check row recorded at 2026-09-26T04:12:45Z, the two
focused command results in this executor session, and
<https://nodejs.org/download/release/v26.5.1/docs/api/fs.html#caveats>.

## VER-004 controlled scheduling comparison

The [machine-readable comparison](scheduling-comparison.json) projects the
canonical complete `npm test` rows. Both ran sequentially in this worktree on
Node v26.9.0, macOS arm64, with 16 available CPUs and four scheduler lanes.
Snapshots cover 3,473 tracked and nonignored repository paths. Only
`scripts/test-runner.mjs` differed between starts: skeleton's `exclusive`
declaration changed from `false` to `true`. No snapshotted path changed during
either gate. The normalized snapshot digest is retained in the JSON; full
before/after maps and runner transcripts remain in the dispatch's ignored
scratch, and full result rows remain in the canonical local checks.

| Configuration | Complete gate | Skeleton | Console | Result |
| --- | ---: | ---: | ---: | --- |
| Shared, recorded 2026-09-26T13:58:11.009Z | 312.441 s | 309.511 s | 21.982 s | 28 suites passed; 72 fresh tasks |
| Exclusive, recorded 2026-09-26T14:05:46.756Z | 430.952 s | 286.508 s | 20.177 s | 28 suites passed; 72 fresh tasks |

Isolation made skeleton 23.003 seconds faster and the complete gate 118.511
seconds slower. Shared uses priority 80, one lane, up to three peers and load
factor 8; exclusive uses priority 200, all four lanes, no peers and factor 2.
The fixed 240-second acquisition-matrix deadline is unchanged. The final
implementation restores shared scheduling; the scheduler regression now checks
its overlap, priority, lanes and factor. The comparison runs selected the same
product suites; the machinery scheduler test was held identical between them
and was adjusted and run afterward (41 tests passed in 14.124 s).

These are single ordered samples with uncontrolled ambient host work, not a
statistical reliability claim or proof of the historical timeout cause. They
justify retaining the passing shared configuration and its lower measured gate
cost. Product 07 records this choice and its effects (D023).

## VER-004 watcher error cleanup

The new regression emits a watcher error without a close event, calls close,
atomically replaces the status file and then removes it. Before the fix it
failed after 304.910 ms with an unexpected changed callback. With poll cleanup
at the start of the error handler, all eight status tests passed in 1.512 s,
including both missing-notification recovery and no post-close callbacks.
The Node v26.9.0 runtime's own FSWatcher source confirms the modeled path:
an error closes and nulls the handle without emitting close, and close then
returns early. The public FSWatcher return type and notification fallback
remain. No dependency, timeout increase or assertion removal was added.

## Final VER-004 repair gate

After restoring the shared declaration and updating its machinery regression,
the final `npm test` passed all 28 suites and 72 fresh tasks in 311.970 seconds,
recorded at 2026-09-26T14:14:46.764Z, code identity
`bce54ec869793926a7d7db37d759d0e838daebe965ad1729a85982ea7b5b7949`.
Skeleton passed in 309.013 seconds and console in 22.094 seconds; both ran
shared. No snapshotted repository file changed during this gate. This final
gate verifies the handoff source; the preceding pair remains the controlled
comparison. The 41-case scheduler suite, eight-case status suite, publication,
planning, formatting and diff checks also passed.
