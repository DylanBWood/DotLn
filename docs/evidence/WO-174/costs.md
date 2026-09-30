# WO-174 cost record

Base dd141ad16dbd60e39ffb5afab21df57689cf4b79; corrected machinery observations completed 2026-09-30T17:49:45.713Z. Source: session-scratch costs.json, selection-before.json, selection-after.json, console-final-cost.json and the canonical fresh gate rows. No duration below is inferred from suite count.

## Three single-file selections

The before/after tables call the unchanged changedMachinery selector with the base/current runner declarations on an isolated Git fixture. Each trial changes only one tracked path. This separates source-list selection from the many files changed by the implementation. The tiny fixture's commit is synthetic; it is not the executor's base. The matching suite bodies are then actually executed from freshly built base/current scratch copies, at concurrency 2.

| Changed file | Before suites | Before sum seconds | After suites | After sum seconds |
| --- | --- | ---: | --- | ---: |
| scripts/harness.mjs | configuration-root, harness | 3.536 | configuration-root, harness-fixtures, harness, process-debt | 506.071 |
| scripts/lib/meta.mjs | configuration-root, process-debt, meta | 98.011 | configuration-root, process-debt, meta | 132.987 |
| packages/skeleton/src/worker-transport.ts | harness-probe, authority-evidence, harness-fixtures, harness-evidence, plan-refutation, artifact-evidence, verification-evidence, feedback-evidence | 393.832 | harness-probe, authority-evidence, harness-fixtures, harness-evidence, plan-refutation, artifact-evidence, verification-evidence, feedback-evidence | 485.774 |

These are sums of observed selected-suite durations, not the wall time of an entire product review gate. The two unchanged selections have different measured times because host load and fixture timing vary; no selector increase is claimed for them. The current timing run overlapped other executable validation in this session, so this is a cost observation, not a controlled performance regression estimate.

| Machinery suite | Base seconds | Current seconds |
| --- | ---: | ---: |
| harness | 0.181 | 0.189 |
| harness-evidence | 0.375 | 0.394 |
| authority-evidence | 0.658 | 0.700 |
| artifact-evidence | 0.238 | 0.247 |
| verification-evidence | 1.159 | 1.155 |
| meta | 1.339 | 1.421 |
| feedback-evidence | 2.798 | 2.815 |
| harness-fixtures | 288.269 | 374.316 |
| process-debt | 93.317 | 128.085 |
| configuration-root | 3.355 | 3.481 |
| plan-refutation | 46.369 | 49.968 |
| harness-probe | 53.966 | 56.179 |

For scripts/harness.mjs the selected-duration sum increases by 502.535 seconds, above 120. Named exclusions that would remove the added work are harness-fixtures -> scripts/harness.mjs and process-debt -> scripts/harness.mjs. Applying both would leave configuration-root and harness, adding only 0.134 seconds in these observations. Neither is applied: the first restores the proven evidence-wait hole; the second would exclude a direct literal input which process-debt executes for output-read/usage/lifecycle behavior. Shared transport/configuration helpers retain their four separately reasoned exclusions. This cost fails no work-order criterion.

The first base process-debt timing failed one session-status case because its clean clone inherited the work/WO-174 branch name but not its uncommitted activation. Detaching that scratch HEAD at the same base commit and repeating only that suite passed; the failed 93.138-second observation is excluded above. The first current continuation skipped its build after that assertion aborted the loop; missing-dist preflights and dependency-blocked tasks are also excluded. The explicitly built repeat passed every selected suite. Both failed probes and all source copies are preserved in scratch.

## Final console preload comparison

Same final console product row and document skip, sequential without/with the preload; completed 2026-09-30T17:51:48.019Z.

| Guard | Exit | Seconds |
| --- | ---: | ---: |
| off | 0 | 15.619 |
| on | 0 | 15.868 |

Observed overhead 0.249 seconds. One paired observation is not a recurring performance guarantee. The earlier prototype pair was 15.539/15.867 seconds; the final pair above follows the reduced-child-environment correction. Token cost of these individual command runs is unknown.

## Both gates and retagging

| Gate | Before seconds | Before cutoff | After seconds | After cutoff |
| --- | ---: | --- | ---: | --- |
| Product review | 402.242 | 2026-09-30T16:39:48.820Z | 396.299 | 2026-09-30T17:58:19.775Z |
| Document | 16.144 | 2026-09-30T16:45:47.884Z | 36.323 | 2026-09-30T18:01:02.328Z |

The complete passing document baseline follows classified local release preparation. The initial 13.409-second document failure on the activation version placeholder and stopped gates are not baseline passes. The first post-change product row, 421.268 seconds, failed only the guard's literal log-root check; its corrected passing row is above. These observed gate differences include selection, moved cases, documentation volume and host timing, and are not attributed wholly to the preload.

| Package | Existing cases moved |
| --- | ---: |
| kernel | 2 |
| compiler | 0 |
| skeleton | 22 |
| console | 19 |

Console's 19 includes five unchanged manifest-enumerated cases under one new tagged parent; the other 14 receive the tag directly. Forty-three existing cases move in total. Assertions are retained; lazy receipt/manifest loading prevents excluded module-setup reads in product tasks. Kernel gains kernel-docs. Compiler's observed run has no excluded read and gains only the shared skip pattern. Product 07 Discipline adds 333 bytes (156718 to 157051), within 400. No dependency is added.
