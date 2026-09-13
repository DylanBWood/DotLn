# WO-128 diagnosis and deadline inventory

The operator's `resume: next` selected the complete WO-128 deliverable. The
later instruction to continue the bounded fixture repair approved the two
synthetic planning-input corrections; it did not change the gate criteria.
All sources are this project's retained metadata, public repository files and
the cited review reports. No private intake was used.

## Twelve failed fresh gates

[Historical rows](historical-gates.json) retain all twelve observations, each
failed task's duration and interval, its reconstructed overlapping tasks, the
deadline-site observation and the available isolated comparison. Overlap is an
inference from start/end intervals, not an original scheduler observation. A
task can overlap more than three different peers over its lifetime without
exceeding a four-task cap at any instant.

| Recorded UTC    | Failed task or gate condition                              | Task duration under load, ms | Deadline finding                                                                            |
| --------------- | ---------------------------------------------------------- | ---------------------------: | ------------------------------------------------------------------------------------------- |
| Sep 11 03:20:02 | runner-fixtures                                            |                       58,381 | Unknown; detailed log disposed                                                              |
| Sep 11 03:56:28 | harness-fixtures                                           |                       62,373 | Unknown; detailed log disposed                                                              |
| Sep 11 06:08:28 | console; plan-refutation:current                           |              86,568; 100,197 | Console budget consistent with symptom; planning site unknown                               |
| Sep 11 17:19:03 | Input tree changed                                         |                 Gate 608,853 | Identity failure, not a deadline; overwritten task statuses cannot identify another failure |
| Sep 11 22:52:32 | Input tree changed; console symptom independently reported | Gate 651,645; console 89,925 | Identity failure plus VER-001 O6's console observation                                      |
| Sep 12 02:25:15 | plan-refutation:current                                    |                      104,257 | Unknown; detailed log disposed                                                              |
| Sep 12 03:29:35 | harness-fixtures                                           |                      142,452 | Unknown; detailed log disposed                                                              |
| Sep 12 12:48:55 | console                                                    |                       92,421 | Budget consistent with symptom; no explicit timeout in retained report                      |
| Sep 12 13:29:59 | console                                                    |                       91,398 | Same console signature                                                                      |
| Sep 12 14:10:29 | console                                                    |                       91,994 | Same console signature                                                                      |
| Sep 12 14:51:29 | console                                                    |                       92,059 | Same console signature                                                                      |
| Sep 12 15:39:37 | console                                                    |                       91,688 | Same console signature                                                                      |

The reports distinguish whole-suite, host-collection-test and individual
command time. [VER-001 O6](../../verifications/WO-125/VER-001.md) reports the
test passing alone in 23.2 s. [VER-003 O3](../../verifications/WO-125/VER-003.md)
measured `release:list` alone at 17.2 s and the test at 25.5 s, while explicitly
stating that neither failed log names a timeout. Those are the historical
console comparisons, not measurements of the other tasks. Historical isolated
durations for the unknown sites are unavailable; new measurements are labeled
separately. WO-127's previously diagnosed synchronous stdin stall remains
repaired; these missing logs do not establish another instance of that stall.

The exact twelve aggregate rows total **8,385,737 ms**. The authority's 8,387 s
is an approximate planning figure. Likewise the retained
[16:08Z comparison](prior-cold-gate.json) is 476,304 ms, with 1,229,204 ms of
task time. Its two exclusive tasks occupy 197,875 ms; the planning pass's 206 s
concurrency-one span also includes time between tasks. These are different
measurements, not interchangeable totals.

## Declared load and diagnostics

The runner allows at most four shared tasks or one isolated task. It passes
the class, concurrency and a load factor of twice the slot count to each
child. The collector uses `max(60000, 17200 × factor)` milliseconds: 137,600 ms
at four slots, preserving the standalone 60,000 ms floor. The current isolated
collector's slowest command was 10,480.5 ms; retaining the earlier 17,200 ms
observation avoids fitting the bound to the faster current host sample.

Other finite bounds retain their values under the scheduler's peer cap unless
the table names a derived bound. A normalized one-minute host load above two,
or a current peer count exceeding the class, is labeled
`outside-declared-load`. Other hits are `deadline-hit-cause-unestablished`:
elapsed time alone cannot distinguish a defect from contention. A hit retains
its site, task, bound, monotonic elapsed duration, UTC interval, load declaration,
current task peers and host-load observation. A missing peer observation is
explicitly unavailable. Command text, environment values, raw process identities
and private paths are not diagnostic fields. Collection retains the same fixed
read-only command set and `GIT_OPTIONAL_LOCKS=0`.

The normal path writes diagnostics only on hits. The explicitly requested
measurement uses `DOTLN_GATE_MEASURE_DEADLINES=1` to record successful calls
locally as well. Public evidence contains numeric per-site summaries, while
the local per-call records remain available during this worktree's lifetime.
Intentional timeout tests remain passing negative evidence, not gate failures.

## Reachable wall-clock inventory

[Initial isolated baselines](isolated-baselines.json) record the ten affected
standalone tasks. [Complete baselines](all-isolated-baselines.json) add the
remaining tasks and two supplementary probes: 78/78 full-gate tasks pass,
with 5,032 observations across 179 task/site groups. Each entry records the
measured maximum and p95; no unobserved duration is invented. The five-run
series adds the same site summaries under the declared shared load. Sites
that share a source family, operation and bound are grouped; manual barriers
and semantic timers have explicit names. All bounds below are milliseconds.

| Source / fixed deadline                                                                  |                                          Isolated maximum observed | Treatment under the gate                                                                          |
| ---------------------------------------------------------------------------------------- | -----------------------------------------------------------------: | ------------------------------------------------------------------------------------------------- |
| `collect.ts`, every fixed read-only command, 60,000                                      |                   Current 10,480.5; earlier release listing 17,200 | Derived from the conservative measured baseline and declared factor                               |
| `test-harness.mjs`, synchronous generated-hook invocation, 20,000                        |                                                              482.6 | `max(20000, 1000 × factor)`; shared cap; no invocation replaced by an in-process test             |
| Same file, chunked-stdin async process, 20,000                                           |                                                              105.0 | Same derived floor; explicit timeout observation                                                  |
| Same file, held interleave barrier and parent await barrier, 20,000 each                 |                                                       252.5; 119.1 | Same floor; monotonic checked barrier, unchanged coordination protocol                            |
| Same file, three gate-guard tests, 300,000                                               |                                                           41,475.2 | Shared cap; test abort is recorded                                                                |
| `harness-host.ts`, Git and lifecycle subprocesses, 10,000                                |                                         146.9 across both families | Shared cap; explicit timed-process observer                                                       |
| Same file, process scan and version probes, 5,000                                        |                                                              106.8 | Shared cap                                                                                        |
| Same file, lock-owner probe, 1,000                                                       |                                                              138.3 | Shared cap                                                                                        |
| Same file, full-check child, 900,000; diff check, 150,000                                |                               20,521.0; 40.6 in gate-guard doubles | Shared cap; real host completion remains bounded separately                                       |
| `gate-evidence.mjs`, process-owner probe, 1,000                                          |                                                               89.0 | Shared cap                                                                                        |
| Same file, record-lock acquisition, 5,000                                                |                                                               0.74 | Shared cap; acquisition deadline emits its own diagnostic                                         |
| `feedback-boundary.ts`, Git, 5,000                                                       |                                                               61.9 | Shared cap                                                                                        |
| `feedback-audit.ts`, Git, 5,000; regression child, 30,000                                |                                                        45.5; 474.2 | Shared cap                                                                                        |
| `feedback-selfhost.ts`, three Git calls, 5,000                                           |                                                               41.7 | Shared cap                                                                                        |
| `worker-worktree.ts`, Git, 15,000                                                        |                                                               69.3 | Shared cap                                                                                        |
| `worker-demo.ts`, Git, 15,000                                                            |                                                               67.8 | Shared cap                                                                                        |
| `verification-demo.ts`, Git, 15,000 and 5,000                                            |                                                         64.9; 60.4 | Shared cap                                                                                        |
| `worker-transport.ts`, CLI version, 5,000                                                |                                          138.7 in planning fixture | Shared cap                                                                                        |
| Same file, ordinary worker lifetime, 180,000                                             |                                        1,012.5 in skeleton doubles | Semantic timer unchanged; shared cap and explicit hit observation                                 |
| Same file, plan-refutation lifetime, 1,200,000                                           |                39.5 in real CLI-entry/synthetic-executable fixture | Semantic timer unchanged; shared cap                                                              |
| Same file, feedback verifier lifetime, 600,000                                           | Not executed by the ordinary gate; live audit is separate evidence | Retained semantic timer; observer covers live use                                                 |
| `suite-evidence.mjs`, tool versions and npm configuration, 5,000                         |                                                              132.2 | Shared cap; startup-adapter refusal unchanged                                                     |
| `license-surfaces.mjs`, npm dry-run child, 30,000                                        |                                                              461.8 | Shared cap; real dry runs retained                                                                |
| `test-process-debt.mjs`, transcript helper, 10,000                                       |                                                              129.8 | Shared cap                                                                                        |
| `feedback-fixtures.test.ts`, Git, 5,000                                                  |                                                               66.0 | Shared cap                                                                                        |
| `beacon-fs.test.ts`, observer test, 15,000; acknowledgement wait, 2,000                  |                                                         81.9; 0.13 | Shared cap; each failure path records a hit                                                       |
| `benchmark-beacon-contention.mjs`, reader round, 30,000                                  |                                    27.7 in the supplementary smoke | Shared cap; same worker limit and timer                                                           |
| `test-fixture-temp-root.sh`, signal readiness and cleanup, 15,000                        |                   Current 49.030 and 48.325; retired protocol 73.7 | Shared cap; explicit readiness and owned-group signal; unchanged deadline and exit/residue checks |
| `test-runner.mjs`, task watchdog, 900,000                                                |               Per-task standalone durations in the baseline record | Shared cap, except isolated build; no automatic retry                                             |
| Runner timeout fixtures, 35; ordinary process/progress fixtures, 1,000                   |                       Intentional hit 37.2; passing 41.9 and 145.7 | Behavior under test; bounds preserved, slow-load and hang doubles added                           |
| New observer fixtures, manual 800; slow child 2,000; hung child 500; async/sync child 50 |           Simulated and real-process assertions in fixture results | Negative evidence deliberately hits; current peers and nonzero timeout result asserted            |
| `mutation/mutate.mjs`, dynamic policy timeout (200 in gate self-test)                    |                                              Intentional hit 200.8 | Semantic cancellation unchanged, descendant containment asserted; shared cap                      |
| `discover.mjs`, version/help, 5,000 each                                                 |         31.4 in the supplementary real probe; gate injects doubles | Fixed finite options preserved; explicit observer covers real use                                 |

The plan-refutation fixture's 120,000 ms budget cases use injected dates, not
elapsed-wall-clock waits. The current planning check has no private wall-clock
deadline; its outer runner watchdog is the reachable bound. The mutation
driver's 120,000/300,000 ms experiment budgets are not activated by the gate's
self-test; the same observed process boundary covers them when explicitly run.
Compiler-generated hook metadata declares a 15-second external-host timeout,
but gate tests invoke generated hook processes directly under the harness
fixture's 20-second bound. External live smoke/probe tools and the build
publication benchmark are not gate children. Heartbeats, 1-second kill grace,
poll intervals and deliberate signal delays do not classify a gate failure and
are not hung-process budgets. Kernel logical cadence values are simulated
domain data, not wall-clock watchdogs.

## Recording and reproduction

`taskTimeline` contains each task's UTC start/end, concurrent peers at its
start, declared peer cap, class, load factor and scheduler predecessors.
`gateCriticalPath()` computes the longest observed scheduling chain from that
one serialized row, including visible wait gaps. It does not claim an ideal
packing lower bound. The runner fixture checks dependencies, lane ordering,
group ordering, shared overlap, isolated work and invalid timeline references.

Run `node scripts/measure-gates.mjs --run docs/evidence/WO-128/<new-series>.json`
outside the sandbox. It invokes exactly five consecutive
`npm run test:full -- --fresh` commands, freezes source between them, preserves
each attempt locally and stops at the first failure. It never retries a failed
suite. `--check <series>` verifies all five first-time passes, zero reuse,
complete task timelines, unchanged source, retained configuration and offline
critical-path calculations. The series is required evidence for the final
exclusivity disposition, not an assertion that arbitrary future host load is
safe.

## First shared series: diagnosed signal-fixture defect

[Series 001](shared-series-001.json) records four complete first-time passes
and a fifth-run failure in `fixture-temp-root`. Its 15,000 ms deadline fired
at 15,005.140 ms with the root already present and `SIGINT` sent to the shell.
The current peers were `release:case:concurrent`, `work-orders-fixtures` and
`adjacent-queue`; normalized host load was 0.498352. The diagnostic correctly
left the cause unestablished rather than labeling elapsed time a load failure.

A quiet-host waiting-child reproduction establishes a sufficient fixture
protocol defect: signaling only Bash can leave its foreground child running
and defer its trap. The original failing shell's precise foreground state was
not captured, so that historical mechanism is not proven. The explicit
handshake also removes the old assumption that a 50 ms delay means traps are ready. The
fixture now starts a separate process group, uses an explicit ready handshake
from a waiting foreground child after the real release-suite traps are
installed, and signals that owned group. Both expected exits and absence of
fixture residue remain assertions. The deadline remains 15,000 ms and is now
named `fixture-temp-root:signal-cleanup`, describing both readiness and exit.
The repaired standalone observations are 49.030 ms and 48.325 ms; the old
shell-only signal deterministically fails the same bound. See
[D007](decisions.md#wo-128-d007) and [the signal record](signal-cleanup.json).

This is a fixture protocol repair under criterion 5, not evidence that the
two already-finished hook suites need exclusivity. The failed series remains
intact. The replacement series below passes on the repaired source.

## Accepted shared series and deadline comparison

[Series 002](shared-series-002.json) passes five consecutive fresh full gates
outside the sandbox on the operator's host. Each executes all 78 tasks with
zero reused tasks on the same source and configuration. The two hook suites
remain shared. The series checker independently recomputes the serialized
critical paths and checks complete coverage, source identity and load policy.

| Run | Wall-clock, ms | Critical chain, ms | All task time, ms |
| --- | -------------: | -----------------: | ----------------: |
| 1   |        689,520 |            688,383 |         2,674,262 |
| 2   |        692,702 |            691,533 |         2,684,643 |
| 3   |        694,561 |            693,395 |         2,693,553 |
| 4   |        697,079 |            695,921 |         2,706,704 |
| 5   |        699,430 |            698,186 |         2,710,552 |

The exact prior gate was 476,304 ms. The new median is 694,561 ms,
45.8% longer; this is not a speedup.
Sources, fixture work and the enabled successful-call measurement differ,
so the comparison does not isolate the cost of scheduling or observation.
The measured benefit is five first-pass successes on this host, not proof of
performance on arbitrary hosts. Removal of exclusive scheduling is the outcome
criterion 4 prescribes, not a measured benefit:
[VER-001 F2](../../verifications/WO-128/VER-001.md#findings) ran the same 78
tasks on the same source in 462.3 s with the two hook suites exclusive against
666.5 s shared, about 204 s more per fresh gate.
[D010](decisions.md#wo-128-d010) records the open operator decision.

[Deadline comparison](deadline-comparison.json) preserves every site group's
standalone sample count, bounds and maximum, and each run's shared maximum,
hits, peers and host load. It reconciles 5,034 standalone observations
(including the two repaired signal samples) and 25,101 shared
observations without imputing missing samples. The collector maximum is
61751.335 ms under its 137,600 ms shared bound. Maximum observed
normalized host load is 0.755310 and no deadline has more than
three observed peers.

Each accepted run has exactly four intentional timeout hits: the mutation
200 ms case, runner 35 ms slow fixture, and async/sync observer 50 ms cases.
There are no other deadline hits. The repaired signal fixture passes in all
five runs. The unmatched comparison rows retain explicit source differences:
the supplementary beacon task maps to the same timer under skeleton; the
discovery real probe supplements the gate's injected doubles; the former
inline async label became a named observer site; the sync observer has its
separate whole-case TAP baseline; the retired signal protocol is preserved
beside its replacement. Missing per-call data is not a zero duration.

The first accepted row's observed chain is `build` → `publication` → `index` → `release:prepare` → `plan-refutation:fixtures` → `release:case:missinglocalprevious` → `release:case:stale_helpers` → `release:case:firstrelease` → `release:case:cached_evidence` → `fixture-temp-root` → `backup-intake` → `checkpoint` → `kernel` → `compiler` → `adjacent-queue` → `authority-grants` → `plan-refutation:current`.
Its task time is 688,379 ms plus 4 ms of visible
waiting, giving 688,383 ms. Its largest node is
`plan-refutation:fixtures` at 523,842 ms. This trace is an
observed scheduling chain, not a prediction of optimal packing. It is the
entry evidence for product 07's unallocated cold-gate structural candidate.
