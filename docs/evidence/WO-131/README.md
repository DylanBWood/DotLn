# WO-131 implementation evidence

## Accepted fresh gate

The final forced-fresh host gate passed all 37 aggregate suites and all 79
scheduled tasks at tree `ee5b5829982a98d9ff2fb5f234ccf08ee19864d3`:

| Observation | Result |
| --- | ---: |
| Recorded | 2026-09-14T14:04:29.611Z |
| Full elapsed | 801.849 s |
| Fresh / reused tasks | 79 / 0 |
| Aggregate task work | 1,458.937 s |
| Critical path | 800.388 s |
| Aggregate suites | 37 passed / 0 failed |

This is inside the operator's 805-second ceiling. It retained every suite,
case and task. WO-130's eight passing fresh observations ranged from 780.365 to
811.264 seconds with a 797.118-second median and 78 tasks. WO-131 therefore
adds one task and finishes 4.731 seconds (0.6 percent) above that median while
remaining inside the accepted host band. The cold gate is not the principal
throughput return.

The bounded planning reader reduced its isolated fixture task from 230.92 to
77.81 seconds (153.11 seconds, 66.3 percent). In the accepted full gate,
planning ran beside process-debt and completed in 130.848 seconds while
process-debt completed in 200.360 seconds. This removed planning from the
reported critical path. Aggregate task work was 378.046 seconds (20.6 percent)
below the retained 1,836.983-second comparable pre-reader profile despite the
overlap's contention.

## Reuse payoff

Before the last scheduler-only change, a complete forced-fresh gate passed in
820.885 seconds at tree `1be8ba9d1b0baceb5e76ea831ca35fcfc346ac20`.
Its immediate ordinary retry passed the same 37 suites in 38.357 seconds by
executing 10 live or preparation tasks and reusing 69 immutable task
certificates. That saved 782.528 seconds (13.042 minutes), a 95.3 percent
elapsed reduction and 21.4x speedup for the later gate.

The pre-change WO-130 composed observations executed 32 and reused 46 tasks;
their five passing elapsed times ranged from 398.712 to 432.311 seconds, with
a 409.653-second median. Against that median, WO-131's 38.357-second identical
tree composition saved 371.296 seconds (6.188 minutes), a 90.6 percent
reduction. That result was followed by both required real executions:

| Transition | Tree | Elapsed | Fresh / reused | Result |
| --- | --- | ---: | ---: | ---: |
| Added this evidence and regenerated the work-order index | `1fe382902f77e8256557da8e6c375d30fa69e57c` | 57.403 s | 17 / 62 | 37 passed / 0 failed |
| Same tree under distinct `CLAUDE_PID`, `GIT_SSH_COMMAND` and `TMPDIR` values | `1fe382902f77e8256557da8e6c375d30fa69e57c` | 57.413 s | 17 / 62 | 37 passed / 0 failed |

Every expensive fixture reused the accepted fresh certificate in both runs.
The 57.408-second mean saves 352.245 seconds (5.871 minutes) against the
WO-130 composed median, an 86.0 percent reduction and 7.14x speedup. The fresh
tasks are the build, preparation, live checks and current document/evidence
checks; their exact names are retained in `gate-performance.json`.

## Throughput, operating expense and inventory

- Proof inventory remains 37 aggregate suites, 79 scheduled tasks and every
  pre-existing case. No test was deleted, combined or skipped by declaration.
- The accepted cold gate physically executed all 79 tasks. The demonstrated
  identical-tree composition physically executed 10 and reused 69, reducing
  repeated task execution inventory by 87.3 percent.
- A representative successful lifecycle now physically executes 113 tasks:
  79 in its fresh gate and 17 in each of two document-transition gates. The
  WO-130 baseline executes 142: 78 fresh and 32 in each composition. That is 29
  fewer executions (20.4 percent) despite WO-131 carrying one more task.
- The direct comparable cold profile reduced aggregate task work from
  1,836.983 to 1,458.937 seconds, a 20.6 percent operating-work reduction.
- A representative three-gate lifecycle is 916.665 seconds (15.278 minutes):
  the 801.849-second fresh row plus both 57-second compositions. Using WO-130's
  797.118-second fresh median and two 409.653-second composed medians gives
  1,616.424 seconds (26.940 minutes). WO-131 saves 699.759 seconds (11.663
  minutes) per successful work order, a 43.3 percent reduction and 1.76x
  throughput. This uses observed repository baselines instead of the older
  unverified 36-minute estimate.

## Measurement investment

The implementation retained failed and superseded attempts instead of hiding
them. Through the final changed-session measurement, the explicitly recorded
WO-131 full-gate and measurement invocations consumed 6,625.898 seconds
(110.432 minutes): failed or diagnostic fresh attempts, passing profiles, the
earlier document and cross-session probes, the same-tree reuse proof, the
25.430-second final preflight refusal, the accepted 801.849-second gate and the
two final 57-second compositions. This is gross gate investment, not total
operator labor and not all weekend work.

At the measured 352.245-second document-transition saving, gross gate
investment breaks even after 18.81 later phase gates. At two such gates per
successful lifecycle and the measured 699.759-second lifecycle saving, it
breaks even after 9.47 successful work orders. Separately, the retained WO-125
through WO-130 archive contains 125 attributed full-gate attempts totaling
56,872.004 seconds; 45 failed rows account for 19,327.633 seconds. Those
historical costs explain the operator's emergency investment but are not
attributed as WO-131 implementation cost.

## Limits

Measurements ran on the operator's host on 2026-09-14. Workload, source and
host contention differ between rows as stated. Wall time includes the build,
fixture preparation and live checks; aggregate task work sums overlapping
scheduler durations and therefore can exceed elapsed time. The release-close
post-merge observation remains the separately authorized closeout role's duty.

## Repair, 2026-09-14

VER-001 failed the order on F1: every row above was recorded in a session
where the kernel read denial was available, and amendment 13 had made declared
suite reuse conditional on that denial, which no sandboxed Claude or Codex
role session on this host can start. The verifier's first later-phase gate at
a document-only delta therefore ran 807.236 s with 79 fresh and 0 reused
tasks. Two conditions the rows above did not state (F3): the 57.403 s and
57.413 s rows required the available denial, and the changed-session row
varied `CLAUDE_PID`, `GIT_SSH_COMMAND` and `TMPDIR` inside one shell; it was
not a second role session. The repair removed the denial condition (D019),
made the replica PATH canonical so that a per-shell entry cannot fork a key
(D020), made a fresh explanation name the changed environment variables, and
bounded the success cache. The engineering review under amendment 17 is in
[engineering-review.md](engineering-review.md).

Repair rows, all in one sandboxed Claude Code session with the probe answering
`host refused sandbox startup` and every declared suite executing in its
replica:

| Gate | Tree | Elapsed | Fresh / reused | Result |
| --- | --- | ---: | ---: | --- |
| Verifier's later-phase gate before the repair (VER-001 F1, candidate execution) | `0fa17674d9a4aec7663268e4a6c90af7aa1386b7` | 807.236 s | 79 / 0 | 37 passed |
| First attempt: `authority-evidence` preflight stale after the operator regenerated the hooks; revision 007 recorded | `338e49d1b3d71f032225a56948f9cd264bd7a073` | 27.472 s | 14 / 0 | 13 passed / 24 skipped |
| Second attempt: fresh, 63 replicas, one fixture still asserted the withdrawn spawn refusal | `01613db3c2ffe7926c96649983a721e89819ea60` | 547.973 s | 79 / 0 | 36 passed / 1 failed |
| Accepted fresh: 59 replicas; the four package suites reused the previous attempt | `0adcc393a773f6ba5b9b956d66f2eaba3dc31e02` | 513.023 s | 75 / 4 | 37 passed / 0 failed |
| Document-only composition after this evidence write, sandboxed (criterion 4) | `4dd64c8a865caac429cebf15995e4a537d88d805` | 63.389 s | 17 / 62 | 37 passed / 0 failed |

The accepted fresh row executed 914.437 s of aggregate task work on a
511.392 s critical path; the longest tasks were harness-fixtures (142 s),
runner-fixtures (122 s), process-debt (119 s) and the planning fixture (65 s).
Its wall-clock is below WO-130's 780–811 s fresh band and the 807.236 s
candidate-tree run in the same kind of session. That difference is consistent
with the per-process sandbox wrapper no longer applying, but it was not
isolated and no speedup is claimed for it.

Cross-session reuse in this session: the four reused tasks are the package
suites whose declarations exclude `scripts/`, carried from the failed second
attempt; every fixture suite declares the whole `scripts/` directory, so the
fixture correction re-keyed them. The composition after this evidence write,
the document-only row of criterion 4 in a sandboxed session, passed in
63.389 s with 17 fresh and 62 reused tasks: the build, release preparation,
the live checks and the current-tree checks, the same fresh set as the
57.403 s row recorded with the denial available. Against the 807.236 s the
same class of session paid before the repair, that is 743.847 s (92.1
percent) saved per later-phase gate. The second-role-session row of criteria 7 and 11 is the
next verification's first gate: at unchanged declared bytes it should
re-execute only the build, preparation, the live checks and the current-tree
checks, 17 fresh and 62 reused, and the runner now names the variable if the
environment class misses.

Success cache: 1,909 records and 154 MB had accumulated in 38 hours with no
bound; each suite now keeps its newest 24 records, and the cache stood at
1,664 records and 111 MB after these gates.

Gate investment for the repair through the accepted fresh row: 27.472 s,
547.973 s and 513.023 s, 1,088.468 s in total, plus the document gates below.

## Independent cross-role observation

VER-002's first gate in a distinct sandboxed verifier session passed all 37 suites in **62.377 seconds**, with 17 fresh and 62 reused tasks, at `f7347d1667708707487357237396136d6e7117b5` (2026-09-14T16:44:19.840Z). Kernel denial was unavailable. Every cacheable declared suite reused; the fresh set contains only build, preparation, live checks and current-tree checks. The row is retained as `independentVerification` in [gate-performance.json](gate-performance.json), copied from the host receipt after checking it against [VER-002](../../verifications/WO-131/VER-002.md). This closes that report's F1 recording gap; the earlier same-shell proxy remains labeled as such.

Against VER-001's comparable 807.236-second later-phase gate, the independent gate saved **744.859 seconds (92.27 percent)**. Against WO-130's 409.653-second composed median, it saved 347.276 seconds (84.77 percent). The pre-merge evidence does not claim the separately authorized post-merge release-close observation.

The final-review correction [D022](decisions.md#wo-131-d022) ends recursive report updates after the final gate. These figures have the cutoff above. Final-review gate timings and later usage remain in the ignored host receipts and the final response; recording them does not require rewriting this file and running another gate.
