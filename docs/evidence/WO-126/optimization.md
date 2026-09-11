# WO-126 gate efficiency observation

The operator expanded `resume: fix` to implement the four improvements described
in [WO-126-D009](decisions.md#wo-126-d009). All four are implemented. Through
the canonical npm entry point, the cold full gate passed in 476.255 seconds
against the 522.052-second baseline, an 8.8% reduction in this observation.
Warm composition passed in 189.470 seconds, 63.7% below the cold baseline.
The canonical cold fast gate passed in 110.852 seconds under the unchanged
120-second budget. The [canonical results](invocation-results.json) retain
the actual commands, trees, dates, coverage and observation costs.

| Canonical observation            | Wall seconds | Fresh tasks | Reused tasks | Passing suite owners |
| -------------------------------- | -----------: | ----------: | -----------: | -------------------: |
| Before expansion, full           |      522.052 |          37 |            0 |                   37 |
| After expansion, full, `--fresh` |      476.255 |          78 |            0 |                   37 |
| After expansion, full, warm      |      189.470 |          32 |           46 |                   37 |
| After expansion, fast, `--fresh` |      110.852 |          12 |            0 |                   12 |

These are single observations on one host, not isolated causal measurements or
a performance guarantee. The final implementation includes the invocation
correction below. The canonical cold release parent took 454.211 seconds,
including scheduling gaps; template preparation took 1.850 seconds, the case
execution window was 217.905 seconds, and concurrent closeout was the longest
case at 101.985 seconds. All forty release cases passed. The two canonical cold
input observations cost 1.356 seconds combined (about 0.28% of gate wall time),
each reading 1,634 files and 206,905,612 bytes with twelve direct probes.

Every invocation reruns live and unreviewed checks. This costs more than the
previous aggregate-only hit on an identical tree; the targeted saving is reuse
across changed trees when a suite's declared inputs remain unchanged. The warm
measurement above uses the same tree and environment after the cold run; the
final handoff separately requires an aggregate after these document write-backs.

## Initial direct observations

The earlier direct runner measurements below remain historical observations.
The later harness check exposed a material invocation difference; their 46.6%
cold comparison is superseded by the 8.8% canonical comparison above. These
initial observations do not isolate savings from the implementation changes.

| Observation                      | Wall seconds | Fresh tasks | Reused tasks | Passing suite owners |
| -------------------------------- | -----------: | ----------: | -----------: | -------------------: |
| Before expansion, full           |      522.052 |          37 |            0 |                   37 |
| After expansion, full, `--fresh` |      278.991 |          78 |            0 |                   37 |
| After expansion, full, warm      |      114.977 |          32 |           46 |                   37 |
| After expansion, fast, `--fresh` |       70.332 |          12 |            0 |                   12 |
| After expansion, fast, warm      |       22.723 |           9 |            3 |                   12 |

The after-expansion rows above use direct Node invocation; the baseline uses
`npm run test:full`. The expanded full gate has more schedulable tasks because the release and
planning suites now expose their independent parts. Every original suite owner
remains required. The direct fast cold measurement is below the unchanged
120-second budget; the required npm and harness paths must also pass. Warm
reuse is not substituted for cold proof. Cold means evidence reuse
was disabled, not that the operating system's filesystem caches were cleared.
The [baseline](optimization-baseline.json) and [results](optimization-results.json)
retain the public tree, execution time, suite and case identities, and timings.
The results precede this receipt's write; final lifecycle evidence must identify
the later handoff tree separately.

## Implemented changes and retained coverage

- **Evidence reuse:** eligible suites declare reviewed, conservative input
  groups covering code, tests, helpers, configuration and their document inputs.
  Installed dependencies, compiled outputs, toolchain, environment and Git
  context participate in input observation. Unsupported scopes and live checks
  execute again. A content-addressed successful result retains its original
  tree, execution identity and duration; the new aggregate marks reuse and
  requires complete coverage at the exact current tree. Input changes during
  execution, failures, missing evidence and invalid cache records cannot pass.
- **Scheduling:** all 39 existing release scenarios remain, with preflight as
  the fortieth named case. They run under the same global limit of four child
  tasks, after immutable setup. Package tests retain their exclusive group and
  file concurrency limit of two. The planning fixture and current-document
  checks are separate tasks, both still required.
- **Fixture cost:** one sealed template supplies independent writable copies,
  including the needed ignored runtime, without hard links. Each case retains
  its own Git state and mutable files. Publication-refusal behavior in unrelated
  lifecycle cases uses a local fixture adapter; the license scenario and
  dedicated license fixtures still exercise real npm. The standalone release
  script retains its sequential mode and an explicit `--real-npm` option.
- **Progress:** named starts, bounded case reports, heartbeats and completion
  timings are emitted while processes run. Failure and timeout diagnostics
  remain available; successful stdout is not copied into evidence metadata.

In the initial direct cold observation, the release parent took 270.146 seconds including scheduling gaps. Template
preparation took 1.132 seconds; the interval from first case start to final case
finish was 122.680 seconds. The longest case was concurrent closeout at 67.021
seconds. The baseline's 499.958-second release parent has no per-case profile,
so those intervals are not interchangeable. Concurrent durations must not be
summed as gate wall time.

## Validation, added cost and limits

The initial nineteen focused tests passed across `test-runner.test.mjs`,
`test-suite-evidence.mjs` and `test-release-fixtures.mjs`; the full cold gate
also executed all 37 suite owners and all 40 release cases successfully. The
regressions cover relevant source, test, helper, configuration, dependency,
environment and document invalidation; path additions, deletion and renaming;
unrelated-document reuse and conservative fallback; missing, corrupt, failing
or unexecuted cache records; original execution provenance; full aggregation;
mid-run changes; case inventory, isolation, preparation failure, concurrency,
timeouts and progress delivered before process completion.

An intermediate 407.786-second trial exposed a command-delivery mistake:
`node --test` did not pass the planning script's split flags through on this
host. Both tasks therefore ran the whole planning suite. That trial is excluded
from the comparison. The final invocation runs the script directly with each
flag, and an executable regression checks argument delivery.

The initial direct cold full gate's two input observations took 1.188 seconds combined
(about 0.43% of gate wall time). Each observed 1,631 explicit file reads,
206,812,839 bytes and 12 direct commands. This includes tool and configuration
file hashing; it excludes subprocess-internal I/O, CPU attribution and cache
lookup/write overhead. The JSON retains the corresponding observations for
every measured mode. Environment and configuration values and their local
fingerprints are not exported. No token-cost or memory saving was measured.

The broad code input groups deliberately invalidate more than a minimal
dependency graph. Adding a suite requires review before narrower reuse is
enabled; source and shared helper changes already invalidate eligible suites.
Live and unreviewed checks still dominate part of the warm run. The cache is
local derived evidence; `--fresh` remains the explicit fresh-execution path.
Disable or widen an affected reuse scope if an invalidation counterexample
appears. Reconsider setup sharing or scheduling if a consequential case is lost,
fixtures interfere, or measured maintenance and observation cost exceed the
saved time. No new dependency or higher fast-gate budget was introduced.

## Invocation correction

The subsequent required `npm run harness -- evidence` timed out its `npm test`
child after 150.010 seconds. The skeleton suite alone took about 116.36 seconds,
versus 50.18 in the direct cold fast observation. That failed execution is
retained in [invocation-probe.json](invocation-probe.json); the earlier direct
run is not evidence that the wrapper met its budget.

The nested npm probe observed 45 `PATH` entries, with 30 unique entries. For
twelve Git lookups per condition, the median was 60.73 ms inherited, 39.76 ms
after exact deduplication and 60.47 ms after restoring the inherited value.
The runner now keeps each exact entry's first occurrence. It does not reorder
entries, drop nonexistent directories, resolve away relative/current-directory
entries, change the chosen toolchain, or modify the operator's environment.
The regression executes competing tools, removes the first executable to test
fallback, creates a formerly absent directory to test later discovery, and
checks current-directory and relative resolution. All twenty focused tests
pass. The small lookup probe identifies a cost; canonical gate measurements
are required separately. [WO-126-D010](decisions.md#wo-126-d010) records this
correction and the rejected broader alternatives.
