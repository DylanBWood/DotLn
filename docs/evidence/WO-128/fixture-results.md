# WO-128 fixture observations

Commands ran in the selected worktree on the operator's host. Local detailed
logs are ignored; this retained projection records test outcomes and the
diagnosed failures without private paths or transient process identifiers.

| Command / observation                                                                                      | Result                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial isolated `test-plan-refutation.mjs --fixtures-only`                                                | 23/25 passed; two cost-table fixtures copied live nonempty budget acceptances while declaring empty synthetic acceptances. This was a data mismatch, not a timeout.             |
| Same command after the approved bounded fixture repair                                                     | 25/25 passed, 120,842.5 ms; repeated in the explicit timing baseline, 114,157 ms, passed. Production freshness checks unchanged.                                                |
| Initial runner probe with temporary `NODE_OPTIONS` instrumentation                                         | Failed reuse assertions because unknown startup adapters deliberately disable reuse. Invalid as a neutral runner baseline; retained as D003's correction.                       |
| Targeted ordinary runner/reuse checks                                                                      | One fixture expected a serial result to reuse across a changed shared load policy. Corrected the fixture's comparison to the same declared policy; the policy remains an input. |
| `node --test scripts/test-gate-deadlines.mjs scripts/test-runner.test.mjs scripts/test-suite-evidence.mjs` | 34/34 passed in 29,411.4 ms after that correction.                                                                                                                              |
| Expanded ordinary `runner-fixtures` timing task, including release-template and deadline fixtures          | Passed in 31,181 ms; no preload or startup exception.                                                                                                                           |
| `node --test scripts/test-gate-deadlines.mjs`, final eight cases                                           | 8/8 passed in 1,086.6 ms.                                                                                                                                                       |
| Ten explicit standalone timing tasks                                                                       | 10/10 passed. Exact intervals and 4,540 numeric deadline observations are projected in [isolated-baselines.json](isolated-baselines.json).                                      |

The final eight deadline cases exercise finite declaration validation, a slow
manual-clock barrier at eightfold declared load, current-peer readback after
the peer set changes, a real slow child that completes within its derived
bound, a hung child that exits zero on TERM but still fails the task, async and
sync process timeout boundaries, and an offline scheduling trace. Measurement
acceptance rejects a reused task, source drift and fewer than five attempts.
Existing harness process-boundary and barrier fixtures still execute generated
processes; the two synthetic planning fixes do not alter runtime validation.

[Filtered TAP transcripts](fixture-transcripts.txt) preserve the emitted case
names and result counters for the planning repair, final deadline cases,
harness and expanded runner fixtures. Full output remains local.

The supplementary baseline first stopped at `worktree` in 1,448 ms. Its shell
trace established a missing `gate-deadlines.mjs` module in the minimal fixture
copy. After adding that dependency to `test-beacon-fixture.mjs`, the task passed
in 49,309 ms. [All isolated observations](all-isolated-baselines.json) preserve
the failed attempt and passing observations for every one of the full gate's
78 tasks, plus the beacon-contention and discovery probes.

The current authority edition checks four unchanged programs and 27 bundle
comparisons. The fresh feedback edition checks ten present/removal pairs and
retains its independent read-only Codex CLI audit: two criteria complete,
86,809 result-envelope tokens, requested `gpt-6-astra` at `max`. This helper
audit does not replace the separate WO-128 verification dispatch. Artifact
identity and verification evidence remain current in their historical editions.

The fresh fast gate first found the beacon CLI test's separate source-copy
omission (118,792 ms; 11 passing tasks and one module-resolution failure).
After that copy was repaired, a 16,680 ms preflight stopped on the stale
planning index. Refreshing the owned projection produced a fully fresh
`npm test` pass: 12/12 tasks, zero reuse, **115,681 ms**.

The [first shared series](shared-series-001.json) preserves four complete
passes followed by one `fixture-temp-root` failure. The fifth run reached its
15,000 ms cleanup deadline after creating the root and sending `SIGINT` only
to the shell. The signal diagnostic names the current three peers and host
load 0.498352 per CPU. Both formerly exclusive suites had already passed.

The quiet-host reproduction held a foreground child: shell-only `SIGINT`
did not complete after 250 ms; signaling the owned process group returned
exit 130 in 1.719 ms. The real release suite now exposes a test-only ready
handshake after installing its existing cleanup traps and starting a waiting
foreground child. The fixture signals its separate process group, retaining
the 15-second bound, exit 130/143 assertions and exact root-residue checks.
Mutating only the signal back to shell-only delivery reproduces the full
15-second failure (`root=true`, `sent=true`), with group cleanup on timeout.
The repaired standalone probe passes both signals; its deadline observations
are 49.030 ms and 48.325 ms. [Signal evidence](signal-cleanup.json) retains
those exact observations. The new five-run count starts after this repair.

For the final eight deadline cases, the isolated async and sync 50 ms timeout
tests took 52.042 ms and 52.538 ms respectively. These are whole-case TAP
durations, not inner-call timings. The earlier async baseline used the
`inline:spawn:50` label; the corrected caller label is explicit in the shared
series. The beacon smoke baseline appears as a supplementary standalone task,
while the same timer appears under `skeleton` in the shared gate.

After the signal protocol repair, another fully fresh `npm test` passed all
12 tasks with zero reuse in 113.87 seconds, before the replacement series.

The first canonical final gate then passed 36/37 suites with 32 fresh and
46 reused tasks (367,202 ms runner wall-clock; 367,963 ms at the harness
boundary). The current-planning check rejected the executor's dated
`Execution record` heading: the existing continuation contract requires that
heading literally. The diff check passed. Moving the date into the body
repairs the write-back without changing the measured implementation or the
validator. [D009](decisions.md#wo-128-d009) records the correction; the
canonical command is rerun after refreshing the owned projections.
