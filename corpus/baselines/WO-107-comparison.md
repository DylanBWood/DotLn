# WO-107 baseline comparison

Provisional, non-normative observations. Two executions on one host; descriptive overlap and variance only. No verdicts, thresholds, confidence intervals or significance claims. All measured repetitions, including outliers and failures, are retained. Quantiles use linear interpolation; standard deviation uses the population divisor N.

Base: `2bae7d407af2d5d07d16c5b15dc63134e277eabd`. Pinned source inventory: `5ce30da15ec3e47f5af343333f6ed6d3480e9c456f5a72385e97b83dee486b97`.

The second execution includes the operator-authorized WO-107-D007 classification entry for the newly created observations file. Runtime implementations and test assertions remain pinned; corpus inventory differs. Collector provenance/preflight/reporting changed after the first execution. The archived first collector and current collector have byte-identical scenario bodies, measurement functions, command runner, schedule, statistics and watchdog. This disclosed metadata difference remains a comparability limitation.

## Environment and boundary-sampled load

Environment: `{"os":{"platform":"darwin","release":"27.0.0","arch":"arm64"},"cpus":{"count":16,"availableParallelism":16,"models":["Apple M3 Max"]},"toolchain":{"node":"v26.9.0","npm":"11.19.1","tsc":"Version 7.0.2"},"lockfileSha256":"67e703c0bd6e32e8fe783736a28c8cc3a0bba5e7923be6c5ca5aa34dc5ae2b90","safety":{"intervalMs":250,"aggregateRssBytes":8589934592,"additionalSwapMiB":512,"maxProcesses":100,"deadlineMs":7200000,"nodeHeap":"unchanged Node default; no NODE_OPTIONS injection"}}`

Load and memory below are boundary samples, not distributions or peaks. Occupancy is a memory-pressure proxy; native macOS pressure levels (1 normal, 2 warning, 4 critical) and swap use are recorded at the same boundaries. CPU and memory resource distributions describe the harness process only; child-process wall time is included, child CPU/memory is unknown.

Execution 1: seed `wo107-base-a-20261002`, 2026-10-02T01:03:27.417Z to 2026-10-02T01:25:16.510Z.

Collector protocol: `feada88b7313d88268cf944257b879acb3d1492dc1651b649a44c37fbe3d2ba4`. Classification overlay: `null`.

Run boundaries: `{"before":{"kind":"boundary-sample","at":"2026-10-02T01:03:27.418Z","loadavg":[7.01416015625,4.20654296875,4.61328125],"freeMemoryBytes":4071718912,"totalMemoryBytes":51539607552,"usedMemoryFraction":0.9209982554117838,"processMemory":{"rss":120487936,"heapTotal":33423360,"heapUsed":15440864,"external":2692272,"arrayBuffers":143763},"nativeMemory":{"swapUsedMiB":1491.06,"memoryPressure":1},"pressureInterpretation":"occupancy proxy plus macOS pressure level and swap boundary samples"},"after":{"kind":"boundary-sample","at":"2026-10-02T01:25:16.509Z","loadavg":[6.3505859375,7.8173828125,6.89892578125],"freeMemoryBytes":5375606784,"totalMemoryBytes":51539607552,"usedMemoryFraction":0.8956995010375977,"processMemory":{"rss":205979648,"heapTotal":97976320,"heapUsed":33434912,"external":2966070,"arrayBuffers":485620},"nativeMemory":{"swapUsedMiB":1491.06,"memoryPressure":1},"pressureInterpretation":"occupancy proxy plus macOS pressure level and swap boundary samples"}}`

Execution 2: seed `wo107-base-b-20261002`, 2026-10-02T01:41:16.846Z to 2026-10-02T02:01:27.800Z.

Collector protocol: `1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd`. Classification overlay: `{"decision":"WO-107-D007","path":"packages/kernel/test/fixtures/jsonl-protocols.json","addedPath":"corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl","declaration":"WO-107 provisional profiling observations; validated by corpus/harness/wo107-schema.test.mjs","baseSha256":"51c064626464be838010cb0605f09520279cb69239bec48dd2cdd44ba4c8e8aa","currentSha256":"335e66e7d907abf7f3ef54cbb606a9bccb6853886adfb31533a97ca02891156a"}`.

Run boundaries: `{"before":{"kind":"boundary-sample","at":"2026-10-02T01:41:16.846Z","loadavg":[4.078125,4.4033203125,5.13427734375],"freeMemoryBytes":4192665600,"totalMemoryBytes":51539607552,"usedMemoryFraction":0.9186515808105469,"processMemory":{"rss":142458880,"heapTotal":53870592,"heapUsed":35491992,"external":5076510,"arrayBuffers":2528001},"nativeMemory":{"swapUsedMiB":1483.06,"memoryPressure":1},"pressureInterpretation":"occupancy proxy plus macOS pressure level and swap boundary samples"},"after":{"kind":"boundary-sample","at":"2026-10-02T02:01:27.799Z","loadavg":[3.546875,4.4873046875,4.74658203125],"freeMemoryBytes":1071431680,"totalMemoryBytes":51539607552,"usedMemoryFraction":0.9792114893595377,"processMemory":{"rss":197230592,"heapTotal":100352000,"heapUsed":46559336,"external":4643083,"arrayBuffers":2162633},"nativeMemory":{"swapUsedMiB":1483.06,"memoryPressure":1},"pressureInterpretation":"occupancy proxy plus macOS pressure level and swap boundary samples"}}`

## replay/64

Kernel replay over generated valid events with a synthetic counting reactor; fixture generation and decoding excluded.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.563042 | 0.566125 | 0.649375 | 0.895742 | 1.158542 | 0.69744922 | 0.18326922 |
| 2 | 9 | 0.516042 | 0.555334 | 0.60125 | 0.7134834 | 0.756917 | 0.61865289 | 0.075510651 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.6425 | -0.133333 | -0.017666 | 0.107542 | 0.193875 | -0.078796333 | 0.19821571 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.563625 | 0.567 | 0.650625 | 0.8977756 | 1.160042 | 0.69856956 | 0.18361566 |
| 2 | 9 | 0.516667 | 0.555708 | 0.602041 | 0.71555 | 0.75775 | 0.619611 | 0.075907279 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.643375 | -0.133958 | -0.017875 | 0.107125 | 0.194125 | -0.078958556 | 0.19868725 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.565 | 0.566 | 0.662 | 1.1714 | 1.513 | 0.77866667 | 0.3039587 |
| 2 | 9 | 0.518 | 0.553 | 0.62 | 0.8228 | 0.842 | 0.64711111 | 0.11183862 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.995 | -0.209 | -0.022 | 0.18 | 0.277 | -0.13155556 | 0.32388079 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.03 | 0.0468 | 0.062 | 0.024444444 | 0.021623604 |
| 2 | 9 | 0.001 | 0.001 | 0.02 | 0.0446 | 0.071 | 0.023222222 | 0.023049598 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.061 | -0.027 | 0 | 0.036 | 0.07 | -0.0012222222 | 0.031604813 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151126020 | 160923650 | 198524930 | 205586430 | 205717500 | 182053550 | 22485846 |
| 2 | 9 | 152338430 | 157532160 | 159973380 | 196424500 | 196804610 | 173790550 | 20045427 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -53379072 | -40992768 | -4161536 | 35880960 | 45678592 | -8262997.3 | 30123619 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15343168 | 20992008 | 30620928 | 47731517 | 47921264 | 31445995 | 12321123 |
| 2 | 9 | 17485896 | 25991912 | 34013328 | 38507133 | 42129296 | 31238398 | 7793701.8 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -30435368 | -10679208 | -673048 | 19162784 | 26786128 | -207596.44 | 14579158 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -26623448 | -1509048 | -563808 | 6825380.8 | 6828248 | -1403383.1 | 10423661 |
| 2 | 9 | -9867248 | -1510144 | 6824016 | 6825380.8 | 6828728 | 1266516.4 | 6810431.6 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -16695496 | -8321752 | 80 | 16756200 | 33452176 | 2669899.6 | 12451292 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 14141913 | 23489606 | 25230414 | 29025216 | 29099073 | 24732049 | 4840287.5 |
| 2 | 9 | 21645702 | 24534622 | 27249896 | 30130685 | 31749354 | 26868539 | 3173587.5 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -7453370.3 | -1843903.5 | 923188.06 | 9987257.5 | 17607441 | 2136489.5 | 5787921.9 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 129712128 → 137805824 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152141824 → 152190976 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3984982016 → 3986882560 | 0.92268117 → 0.9226443 | 160907264 → 160923648 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 166117376 → 166117376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4052828160 → 4052828160 | 0.92136478 → 0.92136478 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199000064 → 199000064 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199655424 → 199671808 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.3505859 / 7.8173828 / 6.8989258 → 6.3505859 / 7.8173828 / 6.8989258 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205717504 → 205717504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4087726080 → 4076863488 | 0.92068768 → 0.92089844 | 114507776 → 122339328 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 138444800 → 138444800 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152338432 → 152338432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157532160 → 157532160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157679616 → 157679616 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195510272 → 195510272 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## decodeLog/64

Decode complete generated JSONL; envelope and payload validation included.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15.068333 | 15.12 | 15.372417 | 15.625617 | 15.790417 | 15.35906 | 0.23359645 |
| 2 | 9 | 14.41175 | 14.475708 | 14.603458 | 15.155542 | 15.233209 | 14.717269 | 0.28662637 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.378667 | -0.911667 | -0.649041 | -0.15525 | 0.164876 | -0.64179167 | 0.36975935 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15.070084 | 15.122459 | 15.374875 | 15.629425 | 15.793958 | 15.361546 | 0.23412765 |
| 2 | 9 | 14.412417 | 14.476375 | 14.60425 | 15.157158 | 15.236958 | 14.718676 | 0.28732499 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.381541 | -0.913499 | -0.650875 | -0.1565 | 0.166874 | -0.64287044 | 0.37063649 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15.097 | 15.432 | 15.486 | 15.6886 | 15.867 | 15.499444 | 0.19836281 |
| 2 | 9 | 14.362 | 14.52 | 14.679 | 15.1946 | 15.529 | 14.770222 | 0.34390657 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.505 | -1.015 | -0.795 | -0.115 | 0.432 | -0.72922222 | 0.39701326 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.029 | 0.056 | 0.084 | 0.1636 | 0.17 | 0.097222222 | 0.049461046 |
| 2 | 9 | 0.039 | 0.049 | 0.074 | 0.1358 | 0.139 | 0.087555556 | 0.03840171 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.131 | -0.045 | -0.01 | 0.078 | 0.11 | -0.0096666667 | 0.062618579 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 130727940 | 151879680 | 160923650 | 205556940 | 205570050 | 173644910 | 27039642 |
| 2 | 9 | 130301950 | 158793730 | 160759810 | 196460540 | 196984830 | 171857240 | 23329961 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75268096 | -30621696 | -2588672 | 44449792 | 66256896 | -1787676.4 | 35713153 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 17370216 | 22635632 | 38441712 | 51668955 | 52455880 | 35752807 | 12635873 |
| 2 | 9 | 20366008 | 23071528 | 30897464 | 54514363 | 55001736 | 33592269 | 12453795 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -32089872 | -16888064 | -1781760 | 19104184 | 37631520 | -2160537.8 | 17741541 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -4960800 | 165416 | 333392 | 478126.4 | 561256 | -240021.33 | 1674165.3 |
| 2 | 9 | -4832104 | 129568 | 242440 | 435720 | 495528 | -656355.56 | 1842362.8 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -5393360 | -318816 | -65728 | 353976 | 5456328 | -416334.22 | 2489403.6 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1037591.3 | 1057697.6 | 1065805.1 | 1087200.3 | 1087313.4 | 1066977.8 | 16164.612 |
| 2 | 9 | 1075544.9 | 1101167.8 | 1121926.1 | 1133128.9 | 1136850.1 | 1113666.9 | 21407.685 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -11768.491 | 27778.304 | 48229.313 | 79152.556 | 99258.795 | 46689.185 | 26825.057 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 126238720 → 126304256 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142032896 → 142032896 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 160923648 → 160923648 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 130727936 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3757670400 → 3865657344 | 0.9270916 → 0.92499638 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198901760 → 198918144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205488128 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156549120 → 156565504 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 158793728 → 158793728 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 160759808 → 160759808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196165632 → 196165632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196984832 → 196984832 | 1 → 1 | 1483.06 → 1483.06 | completed |

## encodeLog/64

Encode generated event objects to complete JSONL.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.530375 | 2.549875 | 2.597833 | 2.7949164 | 3.02275 | 2.6455416 | 0.14663535 |
| 2 | 9 | 2.401833 | 2.483208 | 2.515333 | 2.620725 | 2.694125 | 2.5162174 | 0.085999796 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.620917 | -0.196 | -0.099167 | 0.0525 | 0.16375 | -0.12932411 | 0.1699938 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.530834 | 2.550459 | 2.598709 | 2.7980004 | 3.023834 | 2.6467782 | 0.14700615 |
| 2 | 9 | 2.402334 | 2.483541 | 2.525416 | 2.6215414 | 2.695375 | 2.5184303 | 0.086185547 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.6215 | -0.196375 | -0.090126 | 0.052624 | 0.164541 | -0.12834789 | 0.17040762 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.532 | 2.566 | 2.616 | 2.9928 | 3.116 | 2.6916667 | 0.19365949 |
| 2 | 9 | 2.396 | 2.479 | 2.613 | 3.0328 | 3.084 | 2.707 | 0.26935561 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.72 | -0.186 | -0.057 | 0.454 | 0.552 | 0.015333333 | 0.33174756 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.015 | 0.1208 | 0.404 | 0.059666667 | 0.12288929 |
| 2 | 9 | 0.001 | 0.012 | 0.028 | 0.0464 | 0.072 | 0.026777778 | 0.021332176 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.403 | -0.017 | 0.004 | 0.039 | 0.071 | -0.032888889 | 0.12472706 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151126020 | 157040640 | 193576960 | 205560220 | 205586430 | 181711300 | 23015860 |
| 2 | 9 | 130301950 | 152387580 | 192741380 | 196598170 | 197214210 | 174680750 | 24399137 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75284480 | -33783808 | -7864320 | 41615360 | 46088192 | -7030556.4 | 33541731 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 18313552 | 20767520 | 38178856 | 56072864 | 56713408 | 36607612 | 15993779 |
| 2 | 9 | 18933696 | 23710000 | 31024080 | 46834374 | 53456896 | 31774460 | 10642491 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -37779712 | -22313656 | -2202480 | 15285520 | 35143344 | -4833152 | 19211027 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -9110656 | -760336 | 7525776 | 7532974.4 | 7540424 | 2988450.7 | 6778389.8 |
| 2 | 9 | -29543592 | -800520 | 7501272 | 7520216 | 7527416 | -2167777.8 | 14098668 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -37084016 | -8329840 | -18144 | 15903120 | 16638072 | -5156228.4 | 15643497 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 5420229.9 | 6185461.1 | 6306794.9 | 6448706.6 | 6474929.6 | 6210473.2 | 314533.41 |
| 2 | 9 | 6081380.8 | 6477381.9 | 6513650.5 | 6814365.7 | 6821456.8 | 6518839.3 | 218988.38 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -393548.82 | 71499.688 | 247060.31 | 837435.11 | 1401226.9 | 308366.06 | 383258.63 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 146931712 → 146931712 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 146325504 → 146325504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152403968 → 152403968 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 166117376 → 166117376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 157040640 → 157040640 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 185892864 → 193576960 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198918144 → 198918144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 122994688 → 122994688 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152338432 → 152338432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 192741376 → 192741376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195346432 → 195346432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## replay/1024

Kernel replay over generated valid events with a synthetic counting reactor; fixture generation and decoding excluded.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.570958 | 0.578167 | 0.596 | 1.0478498 | 2.114417 | 0.79306022 | 0.47241059 |
| 2 | 9 | 0.503708 | 0.549708 | 0.577417 | 1.0083332 | 1.087834 | 0.68375922 | 0.19859438 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.610709 | -0.107416 | -0.031084 | 0.410291 | 0.516876 | -0.109301 | 0.51245634 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.571792 | 0.578958 | 0.59775 | 1.0489248 | 2.115792 | 0.79424989 | 0.47247229 |
| 2 | 9 | 0.504125 | 0.550083 | 0.577958 | 1.0089584 | 1.088792 | 0.68448144 | 0.19870674 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.611667 | -0.106792 | -0.031667 | 0.410042 | 0.517 | -0.10976844 | 0.51255676 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.573 | 0.589 | 0.624 | 1.33 | 3.43 | 0.958 | 0.87767648 |
| 2 | 9 | 0.504 | 0.55 | 0.783 | 0.98 | 0.988 | 0.73366667 | 0.18597431 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -2.926 | -0.1 | -0.019 | 0.364 | 0.415 | -0.22433333 | 0.89716356 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.002 | 0.006 | 0.1052 | 0.134 | 0.036777778 | 0.048535846 |
| 2 | 9 | 0.001 | 0.001 | 0.004 | 0.1216 | 0.36 | 0.056111111 | 0.11002671 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.133 | -0.038 | -0.001 | 0.226 | 0.359 | 0.019333333 | 0.12025641 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151109630 | 151535620 | 160825340 | 205556940 | 205570050 | 175840370 | 24047737 |
| 2 | 9 | 130301950 | 159825920 | 159973380 | 196424500 | 196804610 | 172372420 | 22616108 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75268096 | -30523392 | -2195456 | 44777472 | 45694976 | -3467946.7 | 33011847 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16808480 | 23562272 | 36150112 | 62397168 | 65104624 | 36955071 | 15757200 |
| 2 | 9 | 20327464 | 25272328 | 34001224 | 50146314 | 52630480 | 33512933 | 10765505 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -44777160 | -15235576 | -2379160 | 17696536 | 35822000 | -3442137.8 | 19083643 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -26338888 | 6941864 | 6945224 | 6959584 | 6971456 | 2636977.8 | 10388996 |
| 2 | 9 | -9444024 | -1188168 | 6942136 | 7138251.2 | 7866424 | 2502841.8 | 6884288 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -16415480 | -8133392 | -3088 | 16894864 | 34205312 | -134136 | 12462932 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 7748708 | 22652017 | 27489933 | 28465091 | 28695631 | 24345906 | 6420092.9 |
| 2 | 9 | 15061121 | 24212832 | 28374641 | 30862522 | 32526781 | 25630400 | 5840746.7 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -13634509 | -4091346.1 | 1560814.8 | 9874764.4 | 24778073 | 1284494.2 | 8679396 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 4074012672 → 4074012672 | 0.92095375 → 0.92095375 | 121339904 → 121454592 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 146325504 → 146325504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 160808960 → 160825344 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4106649600 → 4101718016 | 0.92032051 → 0.9204162 | 151109632 → 151109632 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151191552 → 151191552 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 149438464 → 151535616 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198983680 → 199000064 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199475200 → 199475200 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 158744576 → 158744576 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159825920 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 126107648 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159825920 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193216512 → 193232896 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196313088 → 196313088 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## decodeLog/1024

Decode complete generated JSONL; envelope and payload validation included.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15.759 | 15.846917 | 16.092208 | 17.178775 | 17.202875 | 16.274093 | 0.53464683 |
| 2 | 9 | 15.00175 | 15.182459 | 15.196875 | 16.673 | 16.911667 | 15.632296 | 0.68406676 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -2.201125 | -1.099499 | -0.680917 | 0.735541 | 1.152667 | -0.64179633 | 0.86821343 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15.760209 | 15.848833 | 16.094625 | 17.181684 | 17.207583 | 16.27675 | 0.53525603 |
| 2 | 9 | 15.002875 | 15.18425 | 15.198083 | 16.675008 | 16.914042 | 15.633833 | 0.68429266 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -2.204708 | -1.100208 | -0.682501 | 0.734666 | 1.153833 | -0.64291678 | 0.86876664 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15.796 | 15.938 | 16.484 | 17.7554 | 18.229 | 16.664111 | 0.80048075 |
| 2 | 9 | 15.186 | 15.371 | 15.377 | 17.228 | 17.364 | 15.945333 | 0.83245287 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -3.043 | -1.305 | -0.729 | 0.931 | 1.568 | -0.71877778 | 1.1548797 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.064 | 0.125 | 0.157 | 0.3116 | 0.414 | 0.17988889 | 0.10307111 |
| 2 | 9 | 0.073 | 0.106 | 0.127 | 0.485 | 0.529 | 0.22022222 | 0.16632283 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.341 | -0.067 | -0.008 | 0.349 | 0.465 | 0.040333333 | 0.19567048 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151044100 | 158302210 | 166100990 | 205560220 | 205586430 | 178112280 | 23503210 |
| 2 | 9 | 126107650 | 157548540 | 159973380 | 196598170 | 197214210 | 171005270 | 24352876 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -79478784 | -39288832 | -6881280 | 38912000 | 46170112 | -7107015.1 | 33844696 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20500808 | 24025408 | 36743656 | 56036843 | 57652952 | 37627789 | 14775624 |
| 2 | 9 | 21212328 | 28440192 | 32985848 | 42094245 | 47001976 | 32559348 | 7587384.1 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -36440624 | -20640304 | -3438488 | 15005024 | 26501168 | -5068440.9 | 16609861 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -10971048 | -2781832 | 840352 | 3408254.4 | 3679416 | -721487.11 | 4378327.4 |
| 2 | 9 | 745840 | 818168 | 902944 | 1308857.6 | 1600928 | 1026616.9 | 264853.05 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -2933576 | -810424 | 66392 | 11716888 | 12571976 | 1748104 | 4386330.8 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 952398.94 | 996325.99 | 1018132.5 | 1038083.9 | 1039659.9 | 1007813.1 | 32259.632 |
| 2 | 9 | 968798.64 | 1014133.3 | 1078116.4 | 1084342.1 | 1092139.3 | 1050024.3 | 44291.772 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -70861.236 | 14728.966 | 46234.878 | 124099.92 | 139740.31 | 42211.23 | 54794.57 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 111329280 → 126156800 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 151502848 → 151502848 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3997155328 → 3991584768 | 0.92244498 → 0.92255306 | 160874496 → 160907264 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 166100992 → 166100992 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151109632 → 151191552 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151044096 → 151044096 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205045760 → 205062144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 151666688 → 151666688 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123125760 → 132939776 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 151011328 → 151420928 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159825920 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1106591744 → 1100283904 | 0.97852929 → 0.97865168 | 122699776 → 126107648 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157532160 → 157548544 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 194953216 → 194953216 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## encodeLog/1024

Encode generated event objects to complete JSONL.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.487291 | 2.569875 | 2.587625 | 2.8599502 | 2.907083 | 2.6630509 | 0.14107625 |
| 2 | 9 | 2.448708 | 2.478041 | 2.643041 | 2.8322996 | 3.037166 | 2.6492961 | 0.1797883 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.458375 | -0.143584 | -0.029166 | 0.250541 | 0.549875 | -0.013754778 | 0.22853083 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.488125 | 2.570458 | 2.588625 | 2.8623328 | 2.909 | 2.6643332 | 0.14162786 |
| 2 | 9 | 2.44975 | 2.4785 | 2.643709 | 2.8337418 | 3.038709 | 2.650227 | 0.18007416 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.45925 | -0.144916 | -0.029208 | 0.250084 | 0.550584 | -0.014106222 | 0.22909639 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.49 | 2.523 | 2.575 | 3.0124 | 3.042 | 2.6724444 | 0.20136319 |
| 2 | 9 | 2.42 | 2.46 | 2.542 | 2.7274 | 3.209 | 2.5933333 | 0.22698801 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.622 | -0.214 | -0.063 | 0.167 | 0.719 | -0.079111111 | 0.30343153 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.016 | 0.049 | 0.188 | 0.272 | 0.080333333 | 0.085206938 |
| 2 | 9 | 0.001 | 0.002 | 0.159 | 0.2436 | 0.314 | 0.12255556 | 0.10737899 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.271 | -0.047 | 0.034 | 0.21 | 0.313 | 0.042222222 | 0.13707833 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 134135810 | 151617540 | 159809540 | 205560220 | 205586430 | 173309950 | 26956411 |
| 2 | 9 | 151027710 | 154091520 | 193101820 | 196506420 | 196755460 | 177451460 | 20371610 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -54558720 | -9289728 | -589824 | 45137920 | 62619648 | 4141511.1 | 33788321 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20412080 | 22571088 | 41802496 | 53340763 | 60097480 | 38954634 | 14025601 |
| 2 | 9 | 24787408 | 25816968 | 33770176 | 51295458 | 54644264 | 35585153 | 10732224 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35310072 | -17015088 | -1955088 | 18919000 | 34232184 | -3369480.9 | 17660638 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -9144608 | 1040560 | 7566032 | 7579673.6 | 7580448 | 4046266.7 | 5600546.3 |
| 2 | 9 | -28031952 | 3659872 | 7567928 | 7578086.4 | 7580256 | 2572654.2 | 10995289 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35612400 | -3905888 | 1392 | 8497504 | 16724864 | -1473612.4 | 12339469 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 5635890 | 5879513.7 | 6331674.8 | 6498982.7 | 6587086.1 | 6169214.8 | 318733.29 |
| 2 | 9 | 5394502.6 | 5995882.2 | 6198920.1 | 6670369.3 | 6690875.4 | 6211601 | 403597.63 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1192583.5 | -335792.58 | 78156.707 | 754850.92 | 1054985.4 | 42386.125 | 514278.09 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 143671296 → 146718720 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142082048 → 145276928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152469504 → 153124864 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 130727936 → 134135808 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151191552 → 151617536 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 149127168 → 151044096 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158318592 → 159809536 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 151699456 → 154533888 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153354240 → 156549120 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 151420928 → 153567232 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3633676288 → 3624517632 | 0.9294974 → 0.9296751 | 152387584 → 154091520 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 147619840 → 151027712 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157777920 → 160759808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 192888832 → 193101824 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196296704 → 196296704 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196755456 → 196755456 | 1 → 1 | 1483.06 → 1483.06 | completed |

## replay/8192

Kernel replay over generated valid events with a synthetic counting reactor; fixture generation and decoding excluded.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.551167 | 0.578625 | 0.803292 | 1.3483414 | 1.847375 | 0.92038422 | 0.39411643 |
| 2 | 9 | 0.518041 | 0.559333 | 0.565875 | 1.011167 | 1.068667 | 0.71654622 | 0.20517976 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.329334 | -0.389792 | -0.087791 | 0.275126 | 0.5175 | -0.203838 | 0.44432701 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.552459 | 0.579459 | 0.805292 | 1.3495414 | 1.848875 | 0.92155111 | 0.39422776 |
| 2 | 9 | 0.518333 | 0.559667 | 0.566667 | 1.0130256 | 1.070792 | 0.71743078 | 0.20572084 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.330542 | -0.390417 | -0.087792 | 0.275751 | 0.518333 | -0.20412033 | 0.44467583 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.554 | 0.58 | 1.143 | 1.9604 | 3.07 | 1.2541111 | 0.75967134 |
| 2 | 9 | 0.519 | 0.56 | 0.568 | 1.503 | 1.771 | 0.91666667 | 0.44777772 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -2.551 | -0.759 | -0.137 | 0.619 | 1.217 | -0.33744444 | 0.88181939 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.011 | 0.058 | 0.2142 | 0.339 | 0.093777778 | 0.10335137 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.099 | 0.207 | 0.042888889 | 0.063872172 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.338 | -0.106 | -0.043 | 0.071 | 0.206 | -0.050888889 | 0.12149552 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 130727940 | 151846910 | 198524930 | 205560220 | 205586430 | 178700290 | 27977298 |
| 2 | 9 | 152338430 | 157532160 | 159973380 | 196490040 | 196804610 | 173994440 | 19867715 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -53248000 | -41320448 | -3571712 | 44564480 | 66076672 | -4705848.9 | 34314069 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 18090416 | 24947056 | 31383592 | 54350130 | 57181944 | 33313592 | 12834312 |
| 2 | 9 | 20725504 | 29180832 | 32848608 | 44722093 | 49369504 | 33451580 | 9209897.2 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -36456440 | -10212192 | 2173872 | 18613184 | 31279088 | 137988.44 | 15796891 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -26421800 | -24214080 | 52472 | 6968614.4 | 7005184 | -5666673.8 | 14060141 |
| 2 | 9 | -30276752 | -3678352 | 6957304 | 7006782.4 | 7023832 | -311250.67 | 11824279 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -37281936 | -2872464 | 2619848 | 31845320 | 33445632 | 5355423.1 | 18371204 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 8868800.3 | 15284167 | 20396070 | 28623668 | 29726018 | 20564346 | 6925586.6 |
| 2 | 9 | 15331249 | 19490260 | 28953391 | 31620737 | 31626840 | 24657184 | 6329979.1 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -14394769 | -905809.95 | 3278759.7 | 16335044 | 22758040 | 4092838 | 9382557.5 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 147374080 → 147570688 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142065664 → 142082048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3997564928 → 3995451392 | 0.92243703 → 0.92247804 | 160825344 → 160874496 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 130727936 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4052828160 → 4052828160 | 0.92136478 → 0.92136478 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 193921024 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199000064 → 199000064 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205062144 → 205062144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 151666688 → 151683072 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152338432 → 152338432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 154091520 → 154091520 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157532160 → 157532160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157679616 → 157679616 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 194953216 → 194953216 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196165632 → 196165632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## decodeLog/8192

Decode complete generated JSONL; envelope and payload validation included.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16.771209 | 16.888417 | 17.92625 | 20.068601 | 21.357167 | 18.225445 | 1.5073036 |
| 2 | 9 | 16.117292 | 16.303916 | 16.486666 | 18.197059 | 18.344125 | 16.937097 | 0.82766786 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -5.239875 | -2.624876 | -0.944168 | 0.916916 | 1.572916 | -1.2883477 | 1.7195925 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16.77475 | 16.8905 | 17.927875 | 20.071983 | 21.359583 | 18.228254 | 1.5074997 |
| 2 | 9 | 16.118708 | 16.304792 | 16.490208 | 18.199425 | 18.347792 | 16.939357 | 0.8281157 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -5.240875 | -2.626833 | -0.945666 | 0.915959 | 1.573042 | -1.2888978 | 1.71998 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 17.569 | 18.059 | 19.509 | 25.3238 | 37.815 | 21.549 | 5.9720872 |
| 2 | 9 | 16.639 | 17.271 | 17.754 | 21.3352 | 29.472 | 19.034556 | 3.7711288 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -21.176 | -4.193 | -1.666 | 1.732 | 11.903 | -2.5144444 | 7.0630899 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.09 | 0.151 | 0.184 | 0.5948 | 0.722 | 0.29144444 | 0.21213995 |
| 2 | 9 | 0.061 | 0.104 | 0.123 | 0.8312 | 1.26 | 0.337 | 0.3864462 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.661 | -0.135 | -0.038 | 0.634 | 1.17 | 0.045555556 | 0.44084467 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 135217150 | 153829380 | 162021380 | 205180110 | 205586430 | 174125510 | 26257940 |
| 2 | 9 | 139214850 | 159301630 | 175783940 | 196598170 | 197214210 | 175070320 | 20804415 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -66371584 | -22806528 | -2588672 | 43384832 | 61997056 | 944810.67 | 33500793 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 22032568 | 26643016 | 33407224 | 47792818 | 50206040 | 34868409 | 9436557.8 |
| 2 | 9 | 28397376 | 33862704 | 35270392 | 52239822 | 54135304 | 38762147 | 8529485.9 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -21808664 | -6190136 | 4554800 | 21599848 | 32102736 | 3893737.8 | 12720092 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -12833456 | 574864 | 2459880 | 4140422.4 | 4597696 | 694947.56 | 4976833.7 |
| 2 | 9 | -4561480 | 423216 | 1739696 | 6176424 | 8979560 | 2170289.8 | 3613643 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -9159176 | -2079240 | 322616 | 8440408 | 21813016 | 1475342.2 | 6150389.4 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 767142.95 | 846760.27 | 913966.95 | 974351.94 | 976912.28 | 904769.7 | 70375.396 |
| 2 | 9 | 893146.99 | 926271.16 | 993772.79 | 1009445.6 | 1016547.9 | 969583.19 | 45835.003 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -83765.29 | 14055.54 | 52545.335 | 175193.57 | 249405 | 64813.49 | 83985.379 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 126304256 → 129712128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 145276928 → 145653760 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 153124864 → 153829376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 134184960 → 135217152 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 157040640 → 157040640 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 149438464 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 159809536 → 162021376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199032832 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199671808 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 4.078125 / 4.4033203 / 5.1342773 → 4.078125 / 4.4033203 / 5.1342773 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 143753216 → 147472384 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 138444800 → 149159936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156696576 → 156778496 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159252480 → 159301632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 135495680 → 139214848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 161808384 → 159711232 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 175783936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196116480 → 196165632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## encodeLog/8192

Encode generated event objects to complete JSONL.

Units per sample: 16384 events. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.667958 | 2.745917 | 2.856541 | 3.32225 | 3.46375 | 2.927787 | 0.25835615 |
| 2 | 9 | 2.596 | 2.648792 | 2.675584 | 2.8708666 | 3.110333 | 2.7326667 | 0.14669848 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.86775 | -0.302583 | -0.140375 | 0.10825 | 0.442375 | -0.19512033 | 0.29709989 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.668666 | 2.746417 | 2.857375 | 3.3253004 | 3.464834 | 2.9289169 | 0.25885114 |
| 2 | 9 | 2.596334 | 2.649166 | 2.676542 | 2.871525 | 3.111625 | 2.7334677 | 0.14691855 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.8685 | -0.303043 | -0.140709 | 0.107833 | 0.442959 | -0.19544922 | 0.297639 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 2.67 | 2.733 | 2.777 | 3.5076 | 3.706 | 2.9812222 | 0.35115865 |
| 2 | 9 | 2.548 | 2.593 | 2.61 | 2.7916 | 2.938 | 2.6558889 | 0.11362066 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.158 | -0.541 | -0.172 | 0.022 | 0.268 | -0.32533333 | 0.36908271 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.005 | 0.057 | 0.282 | 0.354 | 0.12777778 | 0.12591953 |
| 2 | 9 | 0.002 | 0.012 | 0.059 | 0.2252 | 0.246 | 0.092888889 | 0.086712096 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.352 | -0.162 | -0.001 | 0.174 | 0.245 | -0.034888889 | 0.15288792 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 152469500 | 158285820 | 198524930 | 205507790 | 205586430 | 183049330 | 22353521 |
| 2 | 9 | 135462910 | 159252480 | 161808380 | 196493310 | 197214210 | 173319050 | 21715737 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -70123520 | -39272448 | -7749632 | 38027264 | 44744704 | -9730275.6 | 31164934 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 24332312 | 28096760 | 36417088 | 58812558 | 61779816 | 41414192 | 14141181 |
| 2 | 9 | 25672376 | 29131488 | 36175928 | 59891557 | 61803928 | 39727628 | 12763152 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -36107440 | -16826232 | 24112 | 25386840 | 37471616 | -1686564.4 | 19049175 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -22816280 | -6859584 | 862856 | 9201307.2 | 9211144 | -570378.67 | 10470088 |
| 2 | 9 | -6188840 | 9111432 | 9117320 | 9164758.4 | 9185520 | 6686335.1 | 5009665 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -15399984 | -51576 | 1563232 | 16627440 | 32001800 | 7256713.8 | 11606872 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 4730133.5 | 5551310.8 | 5735608.2 | 6077784.4 | 6141026.2 | 5636434.7 | 458900.49 |
| 2 | 9 | 5267603.2 | 5944759.2 | 6123522.9 | 6232902.8 | 6311248.1 | 6011483.4 | 296103.04 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -873423.03 | 61549.024 | 281651.6 | 1214625.6 | 1581114.5 | 375048.7 | 546137.96 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 121733120 → 125190144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 146325504 → 151502848 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152469504 → 152469504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 160940032 → 166100992 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 151879680 → 157040640 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151584768 → 158285824 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198983680 → 198983680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 204963840 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205488128 → 205488128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 4.078125 / 4.4033203 / 5.1342773 → 4.078125 / 4.4033203 / 5.1342773 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 147505152 → 150962176 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 132939776 → 138330112 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3981934592 → 3979460608 | 0.9227403 → 0.9227883 | 156991488 → 158728192 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 154091520 → 159252480 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 135462912 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 161808384 → 161808384 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193232896 → 194953216 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196165632 → 196165632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196313088 → 196313088 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Once

Once: evaluation over parameter, time, predicate and RNG grids.

Units per sample: 6000 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.088458 | 0.090792 | 0.095041 | 0.1069836 | 0.14075 | 0.098610889 | 0.015228636 |
| 2 | 9 | 0.07875 | 0.084375 | 0.085292 | 0.0936248 | 0.101792 | 0.086745333 | 0.0065944485 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.062 | -0.013333 | -0.009375 | 0.003125 | 0.013334 | -0.011865556 | 0.016595122 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.089334 | 0.091334 | 0.09725 | 0.107667 | 0.141667 | 0.099652889 | 0.015234431 |
| 2 | 9 | 0.079125 | 0.084917 | 0.085875 | 0.0939252 | 0.102458 | 0.087356444 | 0.006626312 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.062542 | -0.013417 | -0.009751 | 0.002458 | 0.013124 | -0.012296444 | 0.016613125 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.09 | 0.092 | 0.095 | 0.1012 | 0.106 | 0.096444444 | 0.0050356752 |
| 2 | 9 | 0.08 | 0.086 | 0.087 | 0.0942 | 0.103 | 0.088222222 | 0.0064252588 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.026 | -0.014 | -0.009 | 0.002 | 0.013 | -0.0082222222 | 0.0081634536 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.001 | 0.0118 | 0.039 | 0.006 | 0.011737878 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.002 | 0.002 | 0.0012222222 | 0.00041573971 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.038 | -0.002 | 0 | 0.001 | 0.001 | -0.0047777778 | 0.011745238 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151109630 | 158285820 | 176160770 | 205573320 | 205586430 | 178714850 | 22426954 |
| 2 | 9 | 130301950 | 152387580 | 192806910 | 196486760 | 197181440 | 174349430 | 24389949 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75284480 | -23773184 | -5898240 | 41353216 | 46071808 | -4365425.8 | 33133637 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15053568 | 24581000 | 38448560 | 53010027 | 55794168 | 36459709 | 13695583 |
| 2 | 9 | 20638440 | 24353456 | 40745312 | 57748902 | 62466176 | 40688477 | 15269039 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35155728 | -10309680 | 3315000 | 31988584 | 47412608 | 4228768 | 20511278 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 600304 | 600360 | 600864 | 603443.2 | 613568 | 602083.56 | 4067.9213 |
| 2 | 9 | 581096 | 600240 | 600632 | 600753.6 | 600760 | 598379.56 | 6114.3627 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -32472 | -672 | -184 | 384 | 456 | -3704 | 7343.9373 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 42628774 | 62069394 | 63130649 | 67172488 | 67828800 | 61946723 | 7168755.1 |
| 2 | 9 | 58943728 | 67384688 | 70346574 | 76062263 | 76190476 | 69545230 | 4983907.9 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -8885071.7 | 2586296.7 | 6840196.6 | 16314954 | 33561702 | 7598507.6 | 8731001.5 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 138903552 → 135659520 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142032896 → 142032896 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 160923648 → 160923648 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4115283968 → 4115431424 | 0.92015298 → 0.92015012 | 151109632 → 151109632 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3715383296 → 3720642560 | 0.92791208 → 0.92781003 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158285824 → 158285824 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 175554560 → 176160768 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 155025408 → 155025408 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123011072 → 123011072 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3538599936 → 3540320256 | 0.93134212 → 0.93130875 | 151011328 → 151011328 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 192806912 → 192806912 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193232896 → 193232896 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196116480 → 196116480 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196313088 → 196313088 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197181440 → 197181440 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/After

After: evaluation over parameter, time, predicate and RNG grids.

Units per sample: 6000 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.092709 | 0.095125 | 0.096333 | 0.1001166 | 0.111583 | 0.097393333 | 0.0052163585 |
| 2 | 9 | 0.083291 | 0.086958 | 0.088791 | 0.0947498 | 0.094917 | 0.089402778 | 0.0040296858 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.028292 | -0.010625 | -0.0075419998 | -0.00083299982 | 0.002208 | -0.0079905555 | 0.0065915676 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.0935 | 0.095708 | 0.096875 | 0.1011166 | 0.113083 | 0.098152778 | 0.0054678059 |
| 2 | 9 | 0.083667 | 0.087291 | 0.0895 | 0.0953586 | 0.095625 | 0.090004667 | 0.0040357907 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.029416 | -0.010875 | -0.007333 | -0.000833 | 0.002125 | -0.0081481111 | 0.0067959185 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.095 | 0.097 | 0.098 | 0.107 | 0.115 | 0.099888889 | 0.0060266896 |
| 2 | 9 | 0.084 | 0.087 | 0.09 | 0.0962 | 0.097 | 0.090555556 | 0.0042716406 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.031 | -0.013 | -0.008 | -0.001 | 0.002 | -0.0093333333 | 0.007387009 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0 | 0.001 | 0.001 | 0.0022 | 0.003 | 0.0013333333 | 0.00081649658 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.0012 | 0.002 | 0.0011111111 | 0.00031426968 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.002 | -0.001 | 0 | 0.001 | 0.002 | -0.00022222222 | 0.00087488976 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 149127170 | 158302210 | 160940030 | 205560220 | 205586430 | 177273060 | 24074285 |
| 2 | 9 | 130301950 | 156565500 | 159973380 | 196424500 | 196804610 | 171451280 | 23475351 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75284480 | -30638080 | -4374528 | 38502400 | 47677440 | -5821781.3 | 33625337 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16314728 | 21430936 | 30260616 | 43845312 | 49123840 | 31188204 | 10254814 |
| 2 | 9 | 20995760 | 26852032 | 30715120 | 39018493 | 54119376 | 31365517 | 9170037.9 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -28128080 | -9264856 | -53688 | 17058208 | 37804648 | 177313.78 | 13756846 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 600328 | 600352 | 600896 | 601505.6 | 603784 | 601040.89 | 1004.8235 |
| 2 | 9 | 600216 | 600264 | 600704 | 650555.2 | 849608 | 628198.22 | 78280.507 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -3568 | -640 | -144 | 245824 | 249280 | 27157.333 | 78286.956 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 53771632 | 61749995 | 62283953 | 64053229 | 64718636 | 61765364 | 2981312.5 |
| 2 | 9 | 63213123 | 64314196 | 67574416 | 71155640 | 72036595 | 67248660 | 3033839.7 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1505512.7 | 1655962.6 | 5290463.7 | 10286600 | 18264963 | 5483296.3 | 4253517.1 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 143671296 → 143671296 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142049280 → 142049280 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 160825344 → 160825344 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 160940032 → 160940032 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5683445760 → 5685166080 | 0.88972664 → 0.88969326 | 149127168 → 149127168 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198918144 → 198918144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205062144 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156565504 → 156565504 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195346432 → 195346432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Every

Every: evaluation over parameter, time, predicate and RNG grids.

Units per sample: 12000 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.264584 | 0.268542 | 0.272292 | 0.3505914 | 0.371625 | 0.29075933 | 0.037038246 |
| 2 | 9 | 0.226 | 0.228333 | 0.246458 | 0.3107916 | 0.536958 | 0.27188422 | 0.0942865 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.145625 | -0.050958 | -0.036709 | 0.165333 | 0.272374 | -0.018875111 | 0.10130042 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.265417 | 0.269042 | 0.273166 | 0.3510668 | 0.372166 | 0.29156011 | 0.036923604 |
| 2 | 9 | 0.226417 | 0.229041 | 0.247083 | 0.3118334 | 0.538167 | 0.27256489 | 0.094489653 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.145749 | -0.051625 | -0.037083 | 0.166001 | 0.27275 | -0.018995222 | 0.10144776 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.266 | 0.27 | 0.274 | 0.3762 | 0.397 | 0.29777778 | 0.046837254 |
| 2 | 9 | 0.227 | 0.23 | 0.248 | 0.3198 | 0.571 | 0.27688889 | 0.10451948 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.17 | -0.053 | -0.037 | 0.174 | 0.305 | -0.020888889 | 0.11453405 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0 | 0.001 | 0.001 | 0.0376 | 0.04 | 0.0094444444 | 0.015564283 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.012 | 0.052 | 0.0068888889 | 0.01595441 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.039 | -0.002 | 0 | 0.012 | 0.052 | -0.0025555556 | 0.022288789 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 149127170 | 157040640 | 198524930 | 205573320 | 205586430 | 181534720 | 23034780 |
| 2 | 9 | 148586500 | 157532160 | 159973380 | 196571960 | 197214210 | 173340900 | 20179907 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -56999936 | -39976960 | -6144000 | 39976960 | 48087040 | -8193820.4 | 30624006 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16730944 | 25539776 | 28547384 | 54256509 | 55371152 | 34582308 | 13522108 |
| 2 | 9 | 16136448 | 28387144 | 30387952 | 49575736 | 53371704 | 35268812 | 11781863 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -39234704 | -12330048 | 1346464 | 24824320 | 36640760 | 686504 | 17934874 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -32369904 | 1144328 | 1144592 | 1145028.8 | 1145048 | -2804766.2 | 10472021 |
| 2 | 9 | -7044232 | 1144320 | 1144784 | 1145140.8 | 1146248 | 234914.67 | 2573567 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -8189280 | -304 | -64 | 25325672 | 33516152 | 3039680.9 | 10783621 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 32290616 | 42908173 | 44070336 | 45127181 | 45354216 | 41850851 | 4557506 |
| 2 | 9 | 22348117 | 48184644 | 48689838 | 52747829 | 53097345 | 47254408 | 9070120.1 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -23006100 | 3619415.1 | 7306233.4 | 16399222 | 20806730 | 5403557.6 | 10150761 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 147570688 → 147587072 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 151535616 → 151535616 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 153124864 → 153124864 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 166117376 → 166117376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 157040640 → 157040640 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 149127168 → 149127168 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199442432 → 199458816 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151355392 → 151355392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 159285248 → 159285248 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 148586496 → 148586496 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157532160 → 157532160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193101824 → 193101824 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Burst

Burst: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.238542 | 0.247083 | 0.250334 | 0.256317 | 0.256417 | 0.249102 | 0.0058125663 |
| 2 | 9 | 0.21725 | 0.222333 | 0.255625 | 0.2630834 | 0.273417 | 0.24577778 | 0.019030407 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.039167 | -0.02475 | 0.003459 | 0.01975 | 0.034875 | -0.0033242222 | 0.0198983 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.239125 | 0.24825 | 0.25125 | 0.25735 | 0.25775 | 0.25005556 | 0.0060187623 |
| 2 | 9 | 0.217542 | 0.22275 | 0.256458 | 0.2642756 | 0.274542 | 0.24646767 | 0.019281517 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.040208 | -0.0255 | 0.003416 | 0.020459 | 0.035417 | -0.0035878889 | 0.020199069 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.239 | 0.249 | 0.252 | 0.2584 | 0.26 | 0.25133333 | 0.006394442 |
| 2 | 9 | 0.218 | 0.223 | 0.258 | 0.2658 | 0.277 | 0.24744444 | 0.019816442 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.042 | -0.026 | 0.003 | 0.02 | 0.038 | -0.0038888889 | 0.02082259 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.001 | 0.0044 | 0.006 | 0.0021111111 | 0.0016629588 |
| 2 | 9 | 0 | 0.001 | 0.001 | 0.002 | 0.002 | 0.0012222222 | 0.00062853936 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.006 | -0.001 | 0 | 0.001 | 0.001 | -0.00088888889 | 0.0017777778 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151846910 | 153272320 | 163708930 | 205560220 | 205586430 | 176670490 | 23380929 |
| 2 | 9 | 130301950 | 159285250 | 159973380 | 196575230 | 197230590 | 172022900 | 23225942 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75284480 | -33406976 | -3489792 | 42450944 | 45383680 | -4647594.7 | 32956216 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 23826672 | 29597240 | 31490488 | 60428314 | 60650880 | 37601069 | 12906030 |
| 2 | 9 | 19608224 | 27179904 | 29725800 | 46759045 | 48901880 | 33730251 | 9878164.6 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -41042656 | -11882264 | -2515360 | 16636256 | 25075208 | -3870818.7 | 16252500 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 213088 | 213368 | 213656 | 214059.2 | 214072 | 213642.67 | 369.52342 |
| 2 | 9 | 212992 | 213312 | 213552 | 213961.6 | 214032 | 213595.56 | 350.34177 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1080 | -456 | -96 | 664 | 944 | -47.111111 | 509.20223 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 779979.49 | 793128.34 | 798932.63 | 832275.18 | 838426.78 | 803327.26 | 19002.903 |
| 2 | 9 | 731483.41 | 775945.68 | 782396.09 | 904704.07 | 920598.39 | 818802.44 | 65435.212 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -106943.36 | -31178.307 | -10732.248 | 119572.09 | 140618.9 | 15475.176 | 68138.662 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 126173184 → 126173184 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 145276928 → 145276928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 153124864 → 153124864 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 153272320 → 153272320 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4086906880 → 4090675200 | 0.92070357 → 0.92063046 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 163708928 → 163708928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199000064 → 199000064 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375885312 → 5377867776 | 0.8956941 → 0.89565563 | 199639040 → 199639040 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 149159936 → 149159936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 159285248 → 159285248 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 154091520 → 154091520 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159825920 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1073446912 → 1071546368 | 0.97917239 → 0.97920926 | 195510272 → 195510272 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197230592 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Calendar

Calendar: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.235209 | 0.243292 | 0.250625 | 0.253725 | 0.257125 | 0.24720389 | 0.0067593214 |
| 2 | 9 | 0.231666 | 0.234292 | 0.24625 | 0.2516086 | 0.260875 | 0.24346289 | 0.0088786353 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.025459 | -0.011084 | -0.0043749998 | 0.01025 | 0.025666 | -0.0037409999 | 0.01115879 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.236125 | 0.243708 | 0.251333 | 0.2551414 | 0.258875 | 0.24812967 | 0.0070279184 |
| 2 | 9 | 0.232 | 0.235167 | 0.247583 | 0.2525244 | 0.261458 | 0.24421289 | 0.008931281 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.026875 | -0.011624 | -0.00425 | 0.010707 | 0.025333 | -0.0039167778 | 0.011364832 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.237 | 0.245 | 0.254 | 0.2626 | 0.269 | 0.25144444 | 0.0095581392 |
| 2 | 9 | 0.227 | 0.235 | 0.248 | 0.2532 | 0.262 | 0.24344444 | 0.010552631 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.042 | -0.019 | -0.007 | 0.01 | 0.025 | -0.008 | 0.014237839 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.001 | 0.0022 | 0.003 | 0.0014444444 | 0.00068493489 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.0046 | 0.015 | 0.0028888889 | 0.0043061828 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.002 | 0 | 0 | 0.012 | 0.014 | 0.0014444444 | 0.0043603149 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 130727940 | 151879680 | 158302210 | 205596260 | 205766660 | 172734690 | 27660709 |
| 2 | 9 | 126107650 | 156696580 | 159973380 | 196571960 | 197214210 | 170852350 | 24185664 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -79659008 | -32194560 | -2424832 | 44777472 | 66486272 | -1882339.6 | 36743178 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 17647640 | 25814800 | 30536744 | 60433918 | 60668024 | 35598738 | 14746561 |
| 2 | 9 | 21447560 | 25593800 | 34207400 | 47300448 | 47420384 | 33722405 | 9278025.2 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -39220464 | -13104928 | 762600 | 18295080 | 29772744 | -1876332.4 | 17422480 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 213096 | 213328 | 213632 | 213688 | 213784 | 213503.11 | 216.42573 |
| 2 | 9 | 213024 | 213376 | 213504 | 219579.2 | 242792 | 216705.78 | 9225.4618 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -760 | -256 | -8 | 29008 | 29696 | 3202.6667 | 9228.0001 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 777831.79 | 794306.41 | 798004.99 | 839399.96 | 850307.6 | 809660.61 | 22383.739 |
| 2 | 9 | 766650.69 | 806451.61 | 812182.74 | 856788.5 | 863311.84 | 822561.64 | 29669.897 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -83656.904 | -13159.568 | 14177.753 | 62731.037 | 85480.043 | 12901.03 | 37166.309 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 4074012672 → 4074012672 | 0.92095375 → 0.92095375 | 121028608 → 121028608 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 146325504 → 146325504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152436736 → 152436736 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 130727936 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151044096 → 151044096 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5380718592 → 5378179072 | 0.89560032 → 0.89564959 | 199639040 → 199639040 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.3505859 / 7.8173828 / 6.8989258 → 6.3505859 / 7.8173828 / 6.8989258 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205750272 → 205766656 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4136599552 → 4134125568 | 0.91973941 → 0.91978741 | 151666688 → 151666688 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 149159936 → 149159936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156696576 → 156696576 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 154091520 → 154091520 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 126107648 → 126107648 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157761536 → 157761536 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193118208 → 193118208 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196296704 → 196296704 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Window

Window: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.238959 | 0.246959 | 0.253542 | 0.2564832 | 0.258416 | 0.25075467 | 0.0060791839 |
| 2 | 9 | 0.235833 | 0.246834 | 0.247833 | 0.3226504 | 0.556916 | 0.28324544 | 0.097049574 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.022583 | -0.0081249999 | -0.00045799999 | 0.2985 | 0.317957 | 0.032490778 | 0.097239787 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.240167 | 0.247291 | 0.254666 | 0.2578 | 0.259 | 0.25171744 | 0.0061739369 |
| 2 | 9 | 0.236416 | 0.247584 | 0.24875 | 0.3232756 | 0.558042 | 0.28387978 | 0.097219608 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.022584 | -0.00875 | -0.001 | 0.299042 | 0.317875 | 0.032162333 | 0.097415449 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.242 | 0.248 | 0.257 | 0.2608 | 0.264 | 0.25388889 | 0.006983225 |
| 2 | 9 | 0.237 | 0.248 | 0.25 | 0.4426 | 1.149 | 0.35022222 | 0.28251245 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.027 | -0.01 | -0.003 | 0.885 | 0.907 | 0.096333333 | 0.28259874 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.001 | 0.0024 | 0.004 | 0.0016666667 | 0.00094280904 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.017 | 0.077 | 0.0096666667 | 0.023809429 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.003 | -0.001 | 0 | 0.073 | 0.076 | 0.008 | 0.023828088 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 134184960 | 151846910 | 198524930 | 205504510 | 205570050 | 178474550 | 26789224 |
| 2 | 9 | 130301950 | 159301630 | 192806910 | 196411390 | 196739070 | 175649220 | 23134725 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75268096 | -30638080 | -3883008 | 44711936 | 62554112 | -2825329.8 | 35396017 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20887144 | 24684736 | 41019360 | 59315786 | 59895376 | 39454888 | 15493915 |
| 2 | 9 | 20360792 | 23145288 | 36271352 | 48699422 | 55518008 | 35865324 | 11857107 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -39534584 | -18643680 | -3726272 | 22310040 | 34630864 | -3589563.6 | 19510315 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 213368 | 213480 | 213648 | 215412.8 | 221032 | 214440.89 | 2337.8606 |
| 2 | 9 | -14630784 | 212992 | 213408 | 219796.8 | 243080 | -1432635.6 | 4666259.3 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -14851816 | -752 | -328 | 22048 | 29712 | -1647076.4 | 4666259.9 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 773945.89 | 782142.13 | 788823.94 | 824253.02 | 836963.66 | 798069.07 | 19669.262 |
| 2 | 9 | 359120.59 | 777326.93 | 806995.03 | 827143.99 | 848057.74 | 754491.65 | 141844.04 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -477843.08 | -29153.757 | 1468.7838 | 39773.425 | 74111.85 | -43577.42 | 143201.3 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 126238720 → 126238720 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142082048 → 142082048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 160940032 → 160940032 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 134184960 → 134184960 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4052828160 → 4052828160 | 0.92136478 → 0.92136478 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199458816 → 199475200 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205488128 → 205488128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151339008 → 151355392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123125760 → 123125760 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156614656 → 156614656 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159301632 → 159301632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159711232 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 192806912 → 192806912 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193118208 → 193118208 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195837952 → 195837952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196739072 → 196739072 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/While

While: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.237208 | 0.243667 | 0.245 | 0.2609836 | 0.26475 | 0.24872222 | 0.0090540444 |
| 2 | 9 | 0.220542 | 0.222833 | 0.232959 | 0.2562914 | 0.259625 | 0.23634733 | 0.014137202 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.044208 | -0.024333 | -0.014375 | 0.011791 | 0.022417 | -0.012374889 | 0.016787978 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.237958 | 0.244083 | 0.245584 | 0.2626334 | 0.265667 | 0.249574 | 0.0093219447 |
| 2 | 9 | 0.220917 | 0.223542 | 0.233292 | 0.2567164 | 0.26025 | 0.23682422 | 0.014161416 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.04475 | -0.0245 | -0.014958 | 0.01175 | 0.022292 | -0.012749778 | 0.016954184 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.239 | 0.244 | 0.246 | 0.2648 | 0.268 | 0.25077778 | 0.0098067752 |
| 2 | 9 | 0.222 | 0.224 | 0.23 | 0.2578 | 0.261 | 0.23588889 | 0.014090536 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.046 | -0.025 | -0.017 | 0.011 | 0.022 | -0.014888889 | 0.017167296 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.001 | 0.002 | 0.002 | 0.0013333333 | 0.00047140452 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.0046 | 0.015 | 0.0027777778 | 0.00434045 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.001 | 0 | 0 | 0.013 | 0.014 | 0.0014444444 | 0.0043659739 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151109630 | 153829380 | 198524930 | 205176830 | 205570050 | 180356890 | 23952304 |
| 2 | 9 | 126107650 | 156565500 | 159973380 | 196506420 | 197214210 | 170994350 | 24326739 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -79462400 | -39829504 | -4096000 | 43139072 | 46104576 | -9362545.8 | 34139466 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15330040 | 31129400 | 39611240 | 54130197 | 58893416 | 40534800 | 13539011 |
| 2 | 9 | 22040360 | 25603440 | 28990496 | 36274830 | 39192008 | 29614827 | 5455626.8 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -36853056 | -23461560 | -11643072 | 8062608 | 23861968 | -10919973 | 14596872 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 213072 | 213312 | 213640 | 213859.2 | 214000 | 213526.22 | 308.61475 |
| 2 | 9 | 213104 | 213296 | 213488 | 219576 | 242872 | 216678.22 | 9262.6518 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -896 | -344 | -88 | 28872 | 29800 | 3152 | 9267.7916 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 755429.65 | 778713.1 | 816326.53 | 838670.38 | 843141.88 | 805158.54 | 28819.681 |
| 2 | 9 | 770341.84 | 818273.69 | 858520.17 | 906583.81 | 906856.74 | 849190.39 | 49834.653 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -72800.045 | 1807.1919 | 49622.292 | 124979.92 | 151427.09 | 44031.848 | 57567.931 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 147210240 → 147210240 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152207360 → 152207360 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 153829376 → 153829376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4112220160 → 4106158080 | 0.92021243 → 0.92033005 | 151109632 → 151109632 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 154533888 → 154533888 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156565504 → 156565504 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 126107648 → 126107648 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Until

Until: evaluation over parameter, time, predicate and RNG grids.

Units per sample: 4000 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.378334 | 0.393083 | 0.395541 | 0.4055584 | 0.406792 | 0.39498144 | 0.0086043901 |
| 2 | 9 | 0.344375 | 0.365333 | 0.375042 | 0.4252834 | 0.601417 | 0.39392589 | 0.074509372 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.062417 | -0.032459 | -0.020791 | 0.194625 | 0.223083 | -0.0010555555 | 0.075004547 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.379417 | 0.393625 | 0.397667 | 0.406408 | 0.408708 | 0.39597689 | 0.0087908594 |
| 2 | 9 | 0.344958 | 0.366125 | 0.375833 | 0.4259 | 0.602 | 0.39458789 | 0.074491672 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.06375 | -0.033667 | -0.022375 | 0.193292 | 0.222583 | -0.001389 | 0.075008589 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.381 | 0.395 | 0.399 | 0.407 | 0.411 | 0.39733333 | 0.0089814624 |
| 2 | 9 | 0.346 | 0.366 | 0.377 | 0.4306 | 0.625 | 0.39766667 | 0.081441185 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.065 | -0.035 | -0.023 | 0.214 | 0.244 | 0.00033333333 | 0.081934934 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.001 | 0.0022 | 0.003 | 0.0013333333 | 0.00066666667 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.0072 | 0.02 | 0.0034444444 | 0.0059275461 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.002 | 0 | 0 | 0.017 | 0.019 | 0.0021111111 | 0.005964918 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 130727940 | 151879680 | 198524930 | 205560220 | 205586430 | 178126850 | 27480581 |
| 2 | 9 | 139378690 | 158793730 | 159973380 | 196490040 | 196804610 | 172468910 | 21414119 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -66207744 | -39731200 | -4243456 | 44433408 | 66076672 | -5657941.3 | 34838869 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16815120 | 21563064 | 33465024 | 52023110 | 55041280 | 34523123 | 13676220 |
| 2 | 9 | 20033656 | 26335496 | 28918912 | 47368110 | 49964232 | 31266247 | 9647744.9 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35007624 | -17114256 | -2885256 | 16499208 | 33149112 | -3256875.6 | 16736726 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1000408 | 1000464 | 1000920 | 1000969.6 | 1000976 | 1000746.7 | 240.88725 |
| 2 | 9 | -15449728 | 1000328 | 1000688 | 1000897.6 | 1000904 | -827172.44 | 5169854.1 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -16450704 | -616 | -104 | 432 | 496 | -1827919.1 | 5169854.1 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 9833035.1 | 10027174 | 10112732 | 10444244 | 10572669 | 10131926 | 223511.8 |
| 2 | 9 | 6650959.3 | 10535576 | 10665472 | 11564926 | 11615245 | 10415239 | 1389353 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -3921709.3 | 359608.09 | 561050.85 | 1496840.2 | 1782210 | 283313.01 | 1407216.9 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 135659520 → 135659520 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 146325504 → 146325504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 160825344 → 160825344 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864494080 → 3858792448 | 0.92501895 → 0.92512957 | 130727936 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3723689984 → 3739140096 | 0.92775091 → 0.92745113 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 151699456 → 151699456 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 138444800 → 138444800 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 158744576 → 158793728 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 139378688 → 139378688 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193118208 → 193118208 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Gate

Gate: evaluation over parameter, time, predicate and RNG grids.

Units per sample: 4000 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.375625 | 0.390042 | 0.392833 | 0.4223412 | 0.468542 | 0.40075456 | 0.026006536 |
| 2 | 9 | 0.340375 | 0.383125 | 0.388541 | 0.51105 | 0.53875 | 0.419699 | 0.067749572 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.128167 | -0.03525 | 0.0032919999 | 0.127959 | 0.163125 | 0.018944444 | 0.072569583 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.376 | 0.390542 | 0.3945 | 0.4233336 | 0.4695 | 0.40172689 | 0.026054647 |
| 2 | 9 | 0.341041 | 0.383625 | 0.389583 | 0.512233 | 0.540333 | 0.42057378 | 0.067917161 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.128459 | -0.034959 | 0.002792 | 0.128541 | 0.164333 | 0.018846889 | 0.072743285 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.377 | 0.392 | 0.396 | 0.4262 | 0.487 | 0.40422222 | 0.030752697 |
| 2 | 9 | 0.342 | 0.385 | 0.391 | 0.7284 | 0.822 | 0.48144444 | 0.16489668 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.145 | -0.035 | -0.003 | 0.335 | 0.445 | 0.077222222 | 0.1677398 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.002 | 0.0122 | 0.033 | 0.0058888889 | 0.0097916568 |
| 2 | 9 | 0.001 | 0.001 | 0.004 | 0.0348 | 0.038 | 0.014444444 | 0.014727986 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.032 | -0.001 | 0.002 | 0.033 | 0.037 | 0.0085555556 | 0.017685874 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 130727940 | 151191550 | 158302210 | 205560220 | 205586430 | 173208010 | 28324615 |
| 2 | 9 | 151027710 | 158793730 | 175783940 | 196490040 | 196804610 | 176386500 | 18796360 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -54558720 | -10076160 | -98304 | 45170688 | 66076672 | 3178496 | 33993926 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20499656 | 27587400 | 30587448 | 53874216 | 58715432 | 34583912 | 12166754 |
| 2 | 9 | 20084424 | 26006848 | 30038048 | 39745205 | 39893768 | 29891329 | 6791938.3 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -38631008 | -11515856 | -1580552 | 10113584 | 19394112 | -4692583.1 | 13934143 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -7349688 | 1000360 | 1000880 | 1000990.4 | 1001048 | 72910.222 | 2624284.8 |
| 2 | 9 | -32466536 | 1000312 | 1000880 | 1048347.2 | 1215432 | -4467745.8 | 11085520 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -33467584 | -624 | -24 | 215072 | 8565120 | -4540656 | 11391910 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 8537121.5 | 9902019.5 | 10182444 | 10554539 | 10648918 | 10019104 | 585818.6 |
| 2 | 9 | 7424594 | 8298755.2 | 10294924 | 11744844 | 11751744 | 9769442 | 1491080.5 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -3224324.5 | -1875038.6 | -90487.09 | 1757802.3 | 3214622.9 | -249662.44 | 1602031.4 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 137871360 → 138870784 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 151535616 → 151535616 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152207360 → 152207360 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 130727936 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151191552 → 151191552 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205062144 → 205062144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123092992 → 123125760 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 158793728 → 158793728 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159301632 → 159301632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 151027712 → 151027712 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157548544 → 157548544 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 175783936 → 175783936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1069645824 → 1068580864 | 0.97924614 → 0.9792668 | 195510272 → 195510272 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196296704 → 196296704 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Sequence

Sequence: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.233375 | 0.244584 | 0.261542 | 0.3058 | 0.4655 | 0.27577322 | 0.068100518 |
| 2 | 9 | 0.219417 | 0.22575 | 0.236833 | 0.272158 | 0.273458 | 0.24376389 | 0.021025652 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.246083 | -0.037125 | -0.013958 | 0.022833 | 0.040083 | -0.032009333 | 0.071272426 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.234 | 0.245292 | 0.262875 | 0.3065084 | 0.466542 | 0.27693533 | 0.068130641 |
| 2 | 9 | 0.22 | 0.226291 | 0.237416 | 0.2730414 | 0.274875 | 0.24456 | 0.021298673 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.246542 | -0.038625 | -0.014292 | 0.023249 | 0.040875 | -0.032375333 | 0.071382195 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.235 | 0.246 | 0.265 | 0.5722 | 0.609 | 0.32666667 | 0.13955962 |
| 2 | 9 | 0.221 | 0.227 | 0.239 | 0.2744 | 0.276 | 0.24555556 | 0.021685177 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.388 | -0.046 | -0.019 | 0.025 | 0.041 | -0.081111111 | 0.14123433 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.002 | 0.0132 | 0.046 | 0.007 | 0.01384036 |
| 2 | 9 | 0.001 | 0.001 | 0.002 | 0.002 | 0.002 | 0.0015555556 | 0.00049690399 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.045 | -0.002 | 0 | 0.001 | 0.001 | -0.0054444444 | 0.013849277 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151109630 | 151879680 | 158302210 | 205504510 | 205570050 | 174992040 | 24795372 |
| 2 | 9 | 147619840 | 159252480 | 159973380 | 196575230 | 197230590 | 173750500 | 20420309 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -57950208 | -10682368 | -2572288 | 44449792 | 46120960 | -1241543.1 | 32121636 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 14390168 | 22323440 | 30191736 | 60326125 | 60947104 | 36690975 | 16422388 |
| 2 | 9 | 19671848 | 24793448 | 26887416 | 44082379 | 46498840 | 30852491 | 9706564.3 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -41275256 | -18596920 | -3276584 | 20026744 | 32108672 | -5838484.4 | 19076484 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -16343808 | 213072 | 213408 | 213811.2 | 214112 | -1626190.2 | 5203463.7 |
| 2 | 9 | 212992 | 213024 | 213504 | 213568 | 213728 | 213360.89 | 263.48622 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1120 | -384 | -80 | 16556800 | 16557536 | 1839551.1 | 5203463.7 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 429645.54 | 758653.39 | 764695.54 | 855524.1 | 856989.82 | 754816.14 | 121081.33 |
| 2 | 9 | 731373.74 | 747895.61 | 844476.91 | 900998.64 | 911506.4 | 826463.76 | 69612.626 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -125616.08 | -20859.453 | 47632.43 | 301728.2 | 481860.86 | 71647.613 | 139666.05 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 126173184 → 126173184 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142032896 → 142032896 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152207360 → 152387584 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4117069824 → 4108337152 | 0.92011833 → 0.92028777 | 151109632 → 151109632 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205488128 → 205488128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 151699456 → 151699456 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156549120 → 156549120 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152338432 → 152338432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159252480 → 159252480 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 147619840 → 147619840 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196395008 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197230592 → 197230592 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Merge

Merge: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.23725 | 0.242375 | 0.252333 | 0.2628832 | 0.269084 | 0.25186122 | 0.01019769 |
| 2 | 9 | 0.221917 | 0.224917 | 0.231375 | 0.2561166 | 0.259083 | 0.23753233 | 0.013474036 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.047167 | -0.027708 | -0.014 | 0.0082909998 | 0.021833 | -0.014328889 | 0.016898004 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.23825 | 0.242917 | 0.252959 | 0.2640922 | 0.270625 | 0.25296767 | 0.01052672 |
| 2 | 9 | 0.222667 | 0.225292 | 0.232292 | 0.256625 | 0.259625 | 0.238162 | 0.013448896 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.047958 | -0.028208 | -0.01475 | 0.0085 | 0.021375 | -0.014805667 | 0.017078777 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.24 | 0.244 | 0.254 | 0.2658 | 0.273 | 0.25444444 | 0.010914935 |
| 2 | 9 | 0.224 | 0.225 | 0.233 | 0.256 | 0.264 | 0.23888889 | 0.013923956 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.049 | -0.029 | -0.016 | 0.009 | 0.024 | -0.015555556 | 0.017692155 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.001 | 0.002 | 0.002 | 0.0014444444 | 0.00049690399 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.004 | 0.008 | 0.0022222222 | 0.0021487866 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.001 | 0 | 0 | 0.006 | 0.007 | 0.00077777778 | 0.0022054926 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 149127170 | 152207360 | 158318590 | 205504510 | 205570050 | 174935610 | 24765361 |
| 2 | 9 | 126107650 | 159285250 | 193101820 | 196516250 | 196804610 | 175108550 | 24627036 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -79462400 | -23019520 | -2670592 | 43974656 | 47677440 | 172942.22 | 34925836 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20132808 | 26841944 | 34159568 | 43290302 | 51272056 | 33808024 | 9389556.7 |
| 2 | 9 | 17157616 | 26589176 | 28663248 | 46976411 | 50733992 | 31381566 | 10224209 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -34114440 | -12134608 | -2975192 | 16574424 | 30601184 | -2426457.8 | 13881578 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 213104 | 213384 | 213648 | 215564.8 | 221312 | 214400.89 | 2458.7807 |
| 2 | 9 | 213008 | 213472 | 213504 | 213856 | 214112 | 213546.67 | 292.67806 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -8304 | -376 | -72 | 456 | 1008 | -854.22222 | 2476.1388 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 743262.33 | 775443.26 | 792603.42 | 838287.16 | 842992.62 | 795392.47 | 32236.802 |
| 2 | 9 | 771953.39 | 809035.31 | 864397.62 | 895599.93 | 901237.85 | 844658.9 | 47069.018 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -71039.234 | 7718.754 | 51019.432 | 123909.81 | 157975.52 | 49266.433 | 57050.012 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 147210240 → 147210240 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142082048 → 142082048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152207360 → 152207360 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 153272320 → 153272320 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5661868032 → 5659394048 | 0.8901453 → 0.8901933 | 149127168 → 149127168 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158318592 → 158318592 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199475200 → 199475200 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205488128 → 205488128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 4.078125 / 4.4033203 / 5.1342773 → 4.078125 / 4.4033203 / 5.1342773 | 4189618176 → 4187144192 | 0.91871071 → 0.91875871 | 142671872 → 142671872 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123011072 → 123011072 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 159285248 → 159285248 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3629924352 → 3631759360 | 0.9295702 → 0.92953459 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 126107648 → 126107648 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 160759808 → 160759808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193101824 → 193101824 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071972352 → 1071431680 | 0.979201 → 0.97921149 | 195510272 → 195510272 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Race

Race: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.234083 | 0.246875 | 0.249833 | 0.2634172 | 0.27275 | 0.25118522 | 0.010492151 |
| 2 | 9 | 0.218625 | 0.233333 | 0.242208 | 0.2759084 | 0.311042 | 0.24954622 | 0.026204535 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.054125 | -0.022 | -0.0076250001 | 0.038292 | 0.076959 | -0.001639 | 0.028226989 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.234583 | 0.247959 | 0.251083 | 0.264609 | 0.273209 | 0.25213422 | 0.010599548 |
| 2 | 9 | 0.219333 | 0.233917 | 0.242583 | 0.2766916 | 0.311958 | 0.25021744 | 0.026277905 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.053876 | -0.022417 | -0.008249 | 0.038749 | 0.077375 | -0.0019167778 | 0.028335114 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.235 | 0.249 | 0.252 | 0.26 | 0.264 | 0.25133333 | 0.0081513462 |
| 2 | 9 | 0.22 | 0.235 | 0.244 | 0.32 | 0.524 | 0.27466667 | 0.089355719 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.044 | -0.019 | -0.006 | 0.26 | 0.289 | 0.023333333 | 0.089726746 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.002 | 0.0052 | 0.018 | 0.0033333333 | 0.0052068331 |
| 2 | 9 | 0.001 | 0.001 | 0.001 | 0.0078 | 0.031 | 0.0044444444 | 0.0093939828 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.017 | -0.001 | 0 | 0.013 | 0.03 | 0.0011111111 | 0.010740485 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 134135810 | 151846910 | 193855490 | 205176830 | 205570050 | 176947200 | 27144922 |
| 2 | 9 | 147505150 | 158744580 | 159973380 | 196414670 | 196755460 | 173408260 | 20492537 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -58064896 | -39321600 | -3145728 | 44482560 | 62619648 | -3538944 | 34011628 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20630648 | 25925824 | 39336056 | 52035043 | 56189008 | 37460589 | 13027524 |
| 2 | 9 | 17026448 | 25127376 | 26998512 | 35607890 | 41233720 | 27607798 | 6575312.8 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -39162560 | -22281304 | -10620808 | 8025336 | 20603072 | -9852791.1 | 14592844 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 213088 | 213560 | 213648 | 218336 | 235328 | 216054.22 | 6820.1467 |
| 2 | 9 | -1847200 | 212992 | 213480 | 220412.8 | 242768 | -12224.889 | 648826.13 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -2082528 | -984 | -408 | 7440 | 29680 | -228279.11 | 648861.97 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 733272.23 | 783671.42 | 800534.76 | 833062.69 | 854397.8 | 797592.91 | 32792.26 |
| 2 | 9 | 642999.98 | 771953.39 | 825736.56 | 894863.81 | 914808.46 | 809514.87 | 77299.294 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -211397.82 | -32742.818 | 25201.8 | 110112.25 | 181536.23 | 11921.958 | 83967.333 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4281204736 → 4278730752 | 0.9169337 → 0.9169817 | 111312896 → 111329280 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 146325504 → 146325504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152387584 → 152403968 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 134135808 → 134135808 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4052828160 → 4052828160 | 0.92136478 → 0.92136478 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151044096 → 151044096 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 193642496 → 193855488 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199475200 → 199475200 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 155025408 → 155025408 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123011072 → 123011072 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 158744576 → 158744576 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 147505152 → 147505152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 151027712 → 151027712 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 194985984 → 194985984 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196755456 → 196755456 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Repeat

Repeat: expected deferred-evaluation rejection over parameter, time, predicate and RNG grids.

Units per sample: 200 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.241583 | 0.24825 | 0.248709 | 0.259025 | 0.266125 | 0.25084278 | 0.0065648225 |
| 2 | 9 | 0.22225 | 0.229916 | 0.239958 | 0.24955 | 0.26425 | 0.23811089 | 0.01173766 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.043875 | -0.020292 | -0.01325 | 0.0042919999 | 0.022667 | -0.012731889 | 0.013448775 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.2425 | 0.248792 | 0.249709 | 0.2604004 | 0.267834 | 0.25183356 | 0.0068348623 |
| 2 | 9 | 0.222542 | 0.230375 | 0.240625 | 0.2505002 | 0.264833 | 0.23877789 | 0.011864746 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.045292 | -0.021083 | -0.013875 | 0.004417 | 0.022333 | -0.013055667 | 0.013692609 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.244 | 0.249 | 0.251 | 0.263 | 0.271 | 0.25255556 | 0.0080430938 |
| 2 | 9 | 0.223 | 0.231 | 0.242 | 0.2516 | 0.266 | 0.23977778 | 0.012126901 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.048 | -0.021 | -0.013 | 0.004 | 0.022 | -0.012777778 | 0.014551738 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.002 | 0.0054 | 0.007 | 0.0025555556 | 0.0019499921 |
| 2 | 9 | 0 | 0.001 | 0.001 | 0.0012 | 0.002 | 0.001 | 0.00047140452 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.007 | -0.002 | -0.001 | 0 | 0.001 | -0.0015555556 | 0.0020061633 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 134135810 | 151846910 | 159809540 | 205556940 | 205570050 | 173961670 | 27575960 |
| 2 | 9 | 135462910 | 151011330 | 159973380 | 196506420 | 196755460 | 170834150 | 23455439 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -70107136 | -24346624 | -4341760 | 44449792 | 62619648 | -3127523.6 | 36202088 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20906888 | 25373400 | 32402496 | 50134266 | 55909216 | 35807296 | 11991040 |
| 2 | 9 | 17795728 | 26313672 | 29137472 | 37548958 | 52041080 | 30134776 | 9133985.3 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -38113488 | -16908144 | -3868136 | 11212912 | 31134192 | -5672520 | 15073644 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 213072 | 213080 | 213648 | 213862.4 | 214048 | 213514.67 | 342.41495 |
| 2 | 9 | 212992 | 213472 | 213496 | 213670.4 | 213856 | 213485.33 | 217.62353 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1056 | -288 | -88 | 480 | 784 | -29.333333 | 405.71911 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 751526.54 | 801468.29 | 804152.64 | 810517.41 | 827872.82 | 797842.94 | 20290.868 |
| 2 | 9 | 756859.03 | 827300.93 | 833479.19 | 880708.45 | 899887.51 | 841914.61 | 40029.78 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -71013.787 | 21661.454 | 48040.866 | 95734.87 | 148360.98 | 44071.668 | 44878.755 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 143638528 → 143671296 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142032896 → 142032896 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 153124864 → 153124864 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 134135808 → 134135808 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4052828160 → 4052828160 | 0.92136478 → 0.92136478 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 159809536 → 159809536 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199426048 → 199426048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205062144 → 205062144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 138444800 → 138444800 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3542188032 → 3539927040 | 0.93127251 → 0.93131638 | 151011328 → 151011328 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 147505152 → 147505152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 135462912 → 135462912 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 194985984 → 194985984 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196755456 → 196755456 | 1 → 1 | 1483.06 → 1483.06 | completed |

## evaluateCadence/Backoff

Backoff: evaluation over parameter, time, predicate and RNG grids.

Units per sample: 18000 calls. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.74375 | 0.764375 | 0.768792 | 0.7974914 | 0.862125 | 0.77809722 | 0.031809328 |
| 2 | 9 | 0.696041 | 0.71125 | 0.729875 | 0.8333996 | 0.898834 | 0.75449522 | 0.062410573 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.166084 | -0.067084 | -0.038959 | 0.073291 | 0.155084 | -0.023602 | 0.070049361 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.74425 | 0.764833 | 0.772375 | 0.8001914 | 0.863125 | 0.77933322 | 0.031912259 |
| 2 | 9 | 0.696542 | 0.711583 | 0.730125 | 0.8343334 | 0.901167 | 0.75520367 | 0.062928419 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.166583 | -0.067292 | -0.04225 | 0.073375 | 0.156917 | -0.024129556 | 0.070557624 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.743 | 0.76 | 0.771 | 0.805 | 0.869 | 0.77933333 | 0.034669872 |
| 2 | 9 | 0.704 | 0.712 | 0.738 | 0.8828 | 0.898 | 0.77355556 | 0.07225589 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.165 | -0.057 | -0.031 | 0.118 | 0.155 | -0.0057777778 | 0.080143082 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.003 | 0.0188 | 0.038 | 0.0072222222 | 0.011554487 |
| 2 | 9 | 0.001 | 0.003 | 0.004 | 0.029 | 0.037 | 0.012 | 0.012319812 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.037 | -0.001 | 0.002 | 0.026 | 0.036 | 0.0047777778 | 0.016890351 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151126020 | 152403970 | 198524930 | 205180110 | 205586430 | 181653050 | 23978800 |
| 2 | 9 | 130301950 | 154091520 | 159973380 | 196503140 | 196739070 | 171039860 | 23651020 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75284480 | -44433408 | -8617984 | 43696128 | 45613056 | -10613191 | 33680166 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 22690840 | 28156920 | 35332680 | 55241709 | 58617280 | 39616489 | 13365865 |
| 2 | 9 | 22923208 | 23402432 | 33650392 | 47844710 | 49905056 | 35032254 | 10105286 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35694072 | -17674280 | -4492760 | 18495688 | 27214216 | -4584234.7 | 16755989 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -614952 | 3512936 | 3513128 | 3513516.8 | 3513600 | 3054560.9 | 1297368.7 |
| 2 | 9 | -4776528 | 3512752 | 3513240 | 3514465.6 | 3516040 | 1926888.9 | 3017605.7 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -8290128 | -744 | -176 | 3104 | 4130992 | -1127672 | 3284678.1 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20878643 | 23043687 | 23413355 | 23832486 | 24201681 | 23169403 | 882590.42 |
| 2 | 9 | 20025945 | 23442598 | 24661757 | 25603698 | 25860546 | 24006516 | 1812355.5 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -4175735.9 | -106053.32 | 1248402.2 | 2734227 | 4981902.7 | 837113.29 | 2015836.9 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3577135104 → 3574677504 | 0.93059444 → 0.93064213 | 121569280 → 121733120 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 151502848 → 151519232 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152403968 → 152403968 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 166100992 → 166100992 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3721281536 → 3706372096 | 0.92779764 → 0.92808692 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151044096 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199114752 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205062144 → 205062144 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 4.078125 / 4.4033203 / 5.1342773 → 4.078125 / 4.4033203 / 5.1342773 | 4194385920 → 4191911936 | 0.9186182 → 0.9186662 | 142557184 → 142671872 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123011072 → 123076608 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 153567232 → 153567232 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 154091520 → 154091520 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157679616 → 157679616 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 194985984 → 194985984 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196739072 → 196739072 | 1 → 1 | 1483.06 → 1483.06 | completed |

## stableHash/empty

stableHash UTF-8 input class empty; encoding included.

Units per sample: 10000 hashes. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1.385792 | 1.411 | 1.420917 | 1.5590168 | 1.643584 | 1.4587363 | 0.077628236 |
| 2 | 9 | 1.284 | 1.3365 | 1.399708 | 1.474516 | 1.533916 | 1.3943144 | 0.076616142 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.359584 | -0.127 | -0.065209 | 0.068999 | 0.148124 | -0.064421889 | 0.10906959 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1.38625 | 1.412042 | 1.421667 | 1.5602002 | 1.646333 | 1.4596944 | 0.078156844 |
| 2 | 9 | 1.284459 | 1.337042 | 1.400417 | 1.4757332 | 1.535666 | 1.3951113 | 0.076940494 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.361874 | -0.127583 | -0.064875 | 0.070374 | 0.149416 | -0.064583111 | 0.10967375 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1.387 | 1.413 | 1.422 | 1.6736 | 2.112 | 1.5246667 | 0.21630277 |
| 2 | 9 | 1.278 | 1.337 | 1.402 | 1.6582 | 1.927 | 1.4614444 | 0.18672446 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.834 | -0.148 | -0.063 | 0.204 | 0.54 | -0.063222222 | 0.28574974 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.01 | 0.049 | 0.069 | 0.018555556 | 0.022490053 |
| 2 | 9 | 0.001 | 0.001 | 0.012 | 0.0516 | 0.078 | 0.02 | 0.024317346 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.068 | -0.014 | 0 | 0.044 | 0.077 | 0.0014444444 | 0.03312304 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151126020 | 152420350 | 166117380 | 205560220 | 205586430 | 176601320 | 23548266 |
| 2 | 9 | 135495680 | 152387580 | 159825920 | 196424500 | 196804610 | 170770430 | 23485643 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -70090752 | -30621696 | -4374528 | 43679744 | 45678592 | -5830883.6 | 33258025 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15523408 | 25530880 | 29524936 | 40742582 | 51529520 | 30482214 | 10544403 |
| 2 | 9 | 18811288 | 25808816 | 27632320 | 48383432 | 58411336 | 32116774 | 11956399 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -32718232 | -8975568 | -154536 | 22107408 | 42887928 | 1634560 | 15941766 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -30708064 | -5675240 | 2776872 | 2777476.8 | 2777528 | -3735200 | 11000149 |
| 2 | 9 | -35805512 | 714744 | 2776840 | 2777296 | 2777360 | -3598889.8 | 12504114 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -38583040 | -2062128 | -184 | 16674240 | 33485424 | 136310.22 | 16654013 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 6084264.6 | 6826325.3 | 7037708.7 | 7114294.2 | 7216090.1 | 6873366.9 | 340817.76 |
| 2 | 9 | 6519261.8 | 6852835.4 | 7144347.2 | 7670143.9 | 7788162 | 7193457.9 | 391360.76 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -696828.34 | -71742.9 | 318021.94 | 979750.63 | 1703897.4 | 320091.07 | 518960.49 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 142098432 → 143360000 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 145899520 → 146325504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152403968 → 152420352 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 166117376 → 166117376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199000064 → 199000064 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199426048 → 199426048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 154533888 → 155025408 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152338432 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1520353280 → 1522139136 | 0.97050126 → 0.97046661 | 147505152 → 147505152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 135462912 → 135495680 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157548544 → 157679616 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159825920 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195346432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195559424 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196313088 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## stableHash/ascii-short

stableHash UTF-8 input class ascii-short; encoding included.

Units per sample: 10000 hashes. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 7.045917 | 7.187833 | 7.261167 | 7.8057334 | 7.851667 | 7.399051 | 0.28230083 |
| 2 | 9 | 6.857959 | 6.881958 | 6.932042 | 7.0036752 | 7.009708 | 6.9338566 | 0.055879696 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.993708 | -0.767292 | -0.330374 | -0.163959 | -0.036209 | -0.46519444 | 0.28777821 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 7.047291 | 7.188833 | 7.263458 | 7.8078 | 7.853 | 7.4008287 | 0.28243504 |
| 2 | 9 | 6.858916 | 6.883 | 6.934167 | 7.005108 | 7.010708 | 6.9349073 | 0.05594745 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.994084 | -0.767417 | -0.330751 | -0.164291 | -0.036583 | -0.46592133 | 0.28792303 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 7.149 | 7.496 | 7.634 | 8.101 | 8.165 | 7.6986667 | 0.33174153 |
| 2 | 9 | 6.923 | 7.074 | 7.151 | 7.3072 | 7.468 | 7.155 | 0.15685804 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.242 | -0.843 | -0.54 | -0.055 | 0.319 | -0.54366667 | 0.36695625 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.038 | 0.045 | 0.105 | 0.3256 | 0.616 | 0.16355556 | 0.17577581 |
| 2 | 9 | 0.019 | 0.032 | 0.045 | 0.0696 | 0.092 | 0.050111111 | 0.021573875 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.597 | -0.167 | -0.041 | 0.022 | 0.054 | -0.11344444 | 0.1770948 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 134135810 | 158302210 | 185827330 | 205504510 | 205570050 | 177560690 | 25673501 |
| 2 | 9 | 130301950 | 156696580 | 159973380 | 196519530 | 196820990 | 171038040 | 23391450 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75268096 | -39010304 | -4112384 | 38518784 | 62685184 | -6522652.4 | 34731665 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15007064 | 20726488 | 31850344 | 48435094 | 48877584 | 34017333 | 12817776 |
| 2 | 9 | 16881432 | 25288600 | 34651576 | 46701397 | 50882472 | 32692747 | 10350284 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -31996152 | -13210768 | -2425192 | 20659752 | 35875408 | -1324586.7 | 16474944 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -7898272 | -7795016 | -7576176 | -245587.2 | 313888 | -5416252.4 | 3338003.3 |
| 2 | 9 | -7792040 | -7779856 | 581360 | 12320197 | 25657784 | 1537057.8 | 10754400 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -8105928 | -21528 | 2860744 | 25343896 | 33556056 | 6953310.2 | 11260524 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1273614.9 | 1307317.7 | 1377189.1 | 1401385.4 | 1419261.7 | 1353462.9 | 50817.165 |
| 2 | 9 | 1426592.9 | 1432305.7 | 1442576.4 | 1456666.4 | 1458159.8 | 1442292.5 | 11623.684 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | 7331.2678 | 43379.939 | 67016.661 | 165980.72 | 184544.89 | 88829.608 | 52129.592 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4281761792 → 4279484416 | 0.91692289 → 0.91696707 | 107724800 → 111312896 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152125440 → 152141824 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 160808960 → 160808960 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 134135808 → 134135808 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5682970624 → 5672419328 | 0.88973586 → 0.88994058 | 149127168 → 149127168 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 176226304 → 185827328 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198918144 → 198983680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 199802880 → 199802880 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205488128 → 205488128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151355392 → 151502848 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 122994688 → 123011072 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156614656 → 156696576 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3637903360 → 3632136192 | 0.92941538 → 0.92952728 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157679616 → 157761536 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193118208 → 193118208 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195821568 → 195837952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196820992 | 1 → 1 | 1483.06 → 1483.06 | completed |

## stableHash/unicode

stableHash UTF-8 input class unicode; encoding included.

Units per sample: 10000 hashes. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 6.831625 | 6.95575 | 7.063542 | 7.3398836 | 7.86975 | 7.1231574 | 0.28931417 |
| 2 | 9 | 6.704709 | 6.76225 | 6.81875 | 7.5388 | 7.9835 | 7.0107269 | 0.40007875 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.165041 | -0.324834 | -0.181874 | 0.596 | 1.151875 | -0.11243056 | 0.49372633 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 6.832333 | 6.957334 | 7.064875 | 7.342167 | 7.872167 | 7.1250696 | 0.2896931 |
| 2 | 9 | 6.705542 | 6.762542 | 6.819459 | 7.5405662 | 7.984167 | 7.0117223 | 0.40020188 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.166625 | -0.325042 | -0.182166 | 0.597333 | 1.151834 | -0.11334722 | 0.49404822 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 6.822 | 7.171 | 7.246 | 7.5444 | 7.578 | 7.2623333 | 0.27099815 |
| 2 | 9 | 6.754 | 6.791 | 7.04 | 7.5106 | 7.745 | 7.1115556 | 0.33833288 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.824 | -0.457 | -0.135 | 0.499 | 0.923 | -0.15077778 | 0.43348487 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.038 | 0.05 | 0.2192 | 0.704 | 0.12588889 | 0.20627083 |
| 2 | 9 | 0.009 | 0.061 | 0.082 | 0.43 | 1.15 | 0.20744444 | 0.33891923 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.695 | -0.019 | 0.023 | 0.446 | 1.149 | 0.081555556 | 0.39675421 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 149438460 | 153272320 | 175505410 | 205212880 | 205750270 | 177799170 | 23136175 |
| 2 | 9 | 130301950 | 152338430 | 192741380 | 196598170 | 197214210 | 173939830 | 25096810 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75448320 | -22970368 | -4341760 | 43302912 | 47775744 | -3859342.2 | 34134037 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 15651328 | 29131008 | 38092856 | 58102346 | 58105520 | 40196011 | 14782071 |
| 2 | 9 | 18034184 | 24421776 | 26134960 | 45137205 | 56938888 | 29597288 | 11624008 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -40071336 | -28995856 | -10455496 | 11986032 | 41287560 | -10598723 | 18804977 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -15007056 | -9840824 | 6936256 | 23577373 | 23577840 | 5413456.9 | 14615673 |
| 2 | 9 | -9916368 | -9870280 | -9825008 | 10264699 | 23577192 | -2172902.2 | 10803494 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -33494208 | -22930944 | -8328400 | 16566640 | 38584248 | -7586359.1 | 18175076 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1270688.4 | 1390627.2 | 1415720.3 | 1454435.3 | 1463780.6 | 1406044.5 | 53543.736 |
| 2 | 9 | 1252583.5 | 1438616.1 | 1466544.5 | 1482993.1 | 1491489 | 1430665.5 | 75064.942 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -211197.13 | -2508.4675 | 39390.083 | 100861.87 | 220800.65 | 24621.087 | 92204.54 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 146931712 → 147210240 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 145653760 → 145899520 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 160825344 → 160825344 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 153255936 → 153272320 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4092903424 → 4074012672 | 0.92058722 → 0.92095375 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 149438464 → 149438464 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 163708928 → 175505408 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199000064 → 199000064 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199475200 → 199475200 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.3505859 / 7.8173828 / 6.8989258 → 6.3505859 / 7.8173828 / 6.8989258 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205717504 → 205750272 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4074569728 → 4076470272 | 0.92094294 → 0.92090607 | 122404864 → 122585088 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 138379264 → 138444800 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152338432 → 152338432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1520713728 → 1518452736 | 0.97049427 → 0.97053814 | 147505152 → 147505152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157761536 → 157777920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 175783936 → 192741376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 194985984 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195837952 → 196116480 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196444160 → 196444160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197214208 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## stableHash/ascii-4096

stableHash UTF-8 input class ascii-4096; encoding included.

Units per sample: 100 hashes. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 9.887708 | 9.953042 | 10.016834 | 10.506283 | 10.879917 | 10.140662 | 0.30112092 |
| 2 | 9 | 9.543416 | 9.587875 | 9.628167 | 9.9439252 | 10.128458 | 9.7187777 | 0.18414112 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.336501 | -0.525833 | -0.370792 | -0.022417 | 0.24075 | -0.42188444 | 0.35296142 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 9.889083 | 9.954416 | 10.020042 | 10.50885 | 10.883917 | 10.14318 | 0.30152788 |
| 2 | 9 | 9.544083 | 9.588625 | 9.628667 | 9.9450414 | 10.130875 | 9.7197037 | 0.18464445 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.339834 | -0.526834 | -0.371541 | -0.023875 | 0.241792 | -0.42347678 | 0.35357126 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 9.922 | 9.995 | 10.09 | 10.5172 | 10.706 | 10.193556 | 0.25485513 |
| 2 | 9 | 9.573 | 9.622 | 9.852 | 10.0726 | 10.127 | 9.8054444 | 0.1936303 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.133 | -0.582 | -0.352 | 0.037 | 0.205 | -0.38811111 | 0.32006847 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.032 | 0.055 | 0.092 | 0.3824 | 0.768 | 0.17344444 | 0.2218198 |
| 2 | 9 | 0.023 | 0.073 | 0.084 | 0.1672 | 0.208 | 0.099444444 | 0.053711392 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.745 | -0.069 | -0.006 | 0.102 | 0.176 | -0.074 | 0.22823001 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151191550 | 153255940 | 158302210 | 205556940 | 205570050 | 175925930 | 23925521 |
| 2 | 9 | 130301950 | 158744580 | 159973380 | 196506420 | 197214210 | 172416110 | 23061705 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75268096 | -28000256 | -2048000 | 43073536 | 46022656 | -3509816.9 | 33230600 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16550520 | 35095400 | 36343640 | 53827147 | 60855160 | 38978154 | 12156866 |
| 2 | 9 | 21925176 | 28699880 | 32386544 | 46771722 | 51391024 | 34878067 | 8774205.9 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -38929984 | -13383456 | -4425552 | 15836024 | 34840504 | -4100087.1 | 14992534 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -7537792 | 4126296 | 9202496 | 9364176 | 9766800 | 4983727.1 | 6875687.6 |
| 2 | 9 | -25481520 | -7500152 | 5661088 | 9240352 | 9269632 | -1523465.8 | 13523482 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35248320 | -16718248 | -533768 | 13198880 | 16807424 | -6507192.9 | 15171013 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 9191.2466 | 9854.7256 | 9983.1943 | 10087.06 | 10113.567 | 9869.6113 | 280.35897 |
| 2 | 9 | 9873.1712 | 10162.301 | 10386.193 | 10444.456 | 10478.428 | 10292.978 | 190.97605 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -240.39605 | 260.77317 | 388.78278 | 874.9326 | 1287.1817 | 423.36641 | 339.22412 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 125190144 → 142098432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 151535616 → 151535616 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152436736 → 152469504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 144457728 → 153255936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151191552 → 151191552 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158285824 → 158285824 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199131136 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199426048 → 199442432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151502848 → 151650304 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 123125760 → 123125760 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 158744576 → 158744576 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159825920 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157532160 → 157532160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195346432 → 195510272 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196296704 → 196313088 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197181440 → 197214208 | 1 → 1 | 1483.06 → 1483.06 | completed |

## commandId/workstream

commandId workstream identities with varying decision and intent indices.

Units per sample: 5000 ids. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 3.897625 | 3.944459 | 4.012083 | 4.188858 | 4.291458 | 4.0422823 | 0.11819306 |
| 2 | 9 | 3.79925 | 3.815667 | 3.964917 | 4.340683 | 4.628083 | 4.0237177 | 0.26086437 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.492208 | -0.199958 | -0.086375 | 0.371208 | 0.730458 | -0.018564667 | 0.28639103 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 3.898167 | 3.945166 | 4.01525 | 4.1911002 | 4.292333 | 4.043574 | 0.11839446 |
| 2 | 9 | 3.7995 | 3.816083 | 3.965375 | 4.341617 | 4.628917 | 4.0244168 | 0.2610777 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.492833 | -0.200417 | -0.0875 | 0.371625 | 0.73075 | -0.019157222 | 0.28666847 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 3.876 | 4.013 | 4.066 | 4.4766 | 4.511 | 4.1782222 | 0.23048826 |
| 2 | 9 | 3.755 | 3.816 | 4.136 | 4.6294 | 4.699 | 4.1358889 | 0.32203811 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.756 | -0.311 | -0.066 | 0.555 | 0.823 | -0.042333333 | 0.39602195 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.005 | 0.024 | 0.033 | 0.0854 | 0.091 | 0.043222222 | 0.030301367 |
| 2 | 9 | 0.001 | 0.03 | 0.037 | 0.2316 | 0.63 | 0.10977778 | 0.18707799 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.09 | -0.031 | 0.006 | 0.539 | 0.625 | 0.066555556 | 0.18951608 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 134135810 | 151879680 | 198524930 | 205504510 | 205570050 | 178105000 | 28104312 |
| 2 | 9 | 147505150 | 157548540 | 159973380 | 196424500 | 196804610 | 172896710 | 20985316 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -58064896 | -40976384 | -3620864 | 44531712 | 62668800 | -5208291.6 | 35074718 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 18701960 | 26523944 | 30418928 | 53374168 | 55789656 | 33194345 | 12235030 |
| 2 | 9 | 17519488 | 24119032 | 28686672 | 54775178 | 55572624 | 33902281 | 13178438 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -38270168 | -9805776 | -485808 | 25101168 | 36870664 | 707936 | 17982413 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -27738112 | -19052200 | -2208400 | 14433200 | 14433200 | -3465552.9 | 15526576 |
| 2 | 9 | -19202616 | -2284848 | -837232 | 14432746 | 14432848 | 1311024.9 | 10769494 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -33635816 | -14002008 | 55600 | 33484776 | 42170960 | 4776577.8 | 18895940 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 1165105.2 | 1221622.9 | 1246235.4 | 1275026.1 | 1282832.5 | 1237960.3 | 35424.289 |
| 2 | 9 | 1080360.9 | 1215633.1 | 1261060.4 | 1315829.8 | 1316049.2 | 1247499.6 | 75215.896 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -202471.58 | -30602.295 | 27554.392 | 95955.253 | 150944.03 | 9539.3305 | 83140.311 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 4076060672 → 4070899712 | 0.92091401 → 0.92101415 | 120602624 → 121028608 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 145276928 → 145276928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152207360 → 152207360 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 134135808 → 134135808 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151044096 → 151044096 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199114752 → 199131136 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 204963840 → 204963840 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205488128 → 205488128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 4.078125 / 4.4033203 / 5.1342773 → 4.078125 / 4.4033203 / 5.1342773 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 143343616 → 143736832 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 149159936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3976921088 → 3978821632 | 0.92283758 → 0.9228007 | 158728192 → 158728192 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 147505152 → 147505152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 139378688 → 148586496 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 157548544 → 157548544 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195559424 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196804608 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## commandId/episode

commandId episode identities with varying decision and intent indices.

Units per sample: 5000 ids. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 4.438541 | 4.519708 | 4.590542 | 5.091175 | 5.395875 | 4.7115508 | 0.28957951 |
| 2 | 9 | 4.275292 | 4.317667 | 4.366083 | 4.694 | 5.231 | 4.4769443 | 0.28085457 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.120583 | -0.371083 | -0.206625 | 0.121209 | 0.792459 | -0.23460644 | 0.40340498 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 4.439167 | 4.520584 | 4.592083 | 5.0939084 | 5.400042 | 4.7133427 | 0.2905455 |
| 2 | 9 | 4.276458 | 4.318041 | 4.366667 | 4.6952336 | 5.2325 | 4.4777592 | 0.28113951 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.123584 | -0.373208 | -0.207084 | 0.12175 | 0.793333 | -0.23558344 | 0.40429706 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 4.433 | 4.667 | 4.765 | 5.5982 | 5.803 | 4.9125556 | 0.4291488 |
| 2 | 9 | 4.314 | 4.319 | 4.498 | 5.4706 | 7.173 | 4.805 | 0.86452466 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.489 | -0.502 | -0.274 | 1.37 | 2.74 | -0.10755556 | 0.96517956 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.006 | 0.035 | 0.046 | 0.3086 | 0.611 | 0.12266667 | 0.18357923 |
| 2 | 9 | 0.001 | 0.011 | 0.031 | 0.2102 | 0.707 | 0.10844444 | 0.21355931 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.61 | -0.045 | -0.015 | 0.096 | 0.701 | -0.014222222 | 0.28161838 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 144457730 | 153124860 | 163708930 | 205176830 | 205570050 | 175651040 | 24438873 |
| 2 | 9 | 152387580 | 159285250 | 193101820 | 196480200 | 196755460 | 178429040 | 19068186 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -53182464 | -10059776 | -2506752 | 43630592 | 52297728 | 2777998.2 | 30997649 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 26514352 | 29042976 | 31214352 | 40487998 | 48464728 | 33314773 | 6464590.8 |
| 2 | 9 | 21778880 | 28861496 | 30351000 | 43991563 | 47144952 | 33844492 | 8118650.3 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -26685848 | -5480120 | -181480 | 15778400 | 20630600 | 529718.22 | 10378026 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -16939448 | -16868000 | -156512 | 4785617.6 | 16552248 | -4455728.9 | 10724809 |
| 2 | 9 | -20530088 | -120048 | 162856 | 16552062 | 16552248 | 1392247.1 | 12962510 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -37082336 | -1963712 | 551312 | 33419968 | 33491696 | 5847976 | 16824036 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 926633.77 | 1057417.8 | 1089196 | 1112299.2 | 1126496.3 | 1064934.2 | 60486.224 |
| 2 | 9 | 955840.18 | 1110854.1 | 1145191.2 | 1161313 | 1169510.8 | 1120751.8 | 62545.154 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -170656.11 | 21658.13 | 52997.414 | 169917.57 | 242876.99 | 55817.602 | 87008.503 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 126173184 → 126238720 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 145276928 → 145276928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 153124864 → 153124864 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 135299072 → 144457728 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 3868655616 → 3868655616 | 0.9249382 → 0.9249382 | 151879680 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 162021376 → 163708928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199475200 → 199475200 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205078528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 4.078125 / 4.4033203 / 5.1342773 → 4.078125 / 4.4033203 / 5.1342773 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 142671872 → 143343616 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 138346496 → 138379264 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 159285248 → 159285248 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 148586496 → 157532160 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193101824 → 193101824 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195575808 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196739072 → 196755456 | 1 → 1 | 1483.06 → 1483.06 | completed |

## commandId/unicode

commandId unicode identities with varying decision and intent indices.

Units per sample: 5000 ids. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 3.923292 | 4.001166 | 4.028375 | 4.5048 | 5.267 | 4.1989351 | 0.39470618 |
| 2 | 9 | 3.78775 | 3.793625 | 3.92825 | 4.0066836 | 4.03725 | 3.8994167 | 0.098452203 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.47925 | -0.315208 | -0.195333 | 0.020834 | 0.113958 | -0.29951844 | 0.40679947 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 3.924333 | 4.002542 | 4.029333 | 4.5106752 | 5.268708 | 4.2010648 | 0.39503815 |
| 2 | 9 | 3.788417 | 3.79425 | 3.928917 | 4.0077332 | 4.038166 | 3.9002548 | 0.09875715 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.480291 | -0.321042 | -0.195834 | 0.020709 | 0.113833 | -0.30081 | 0.40719542 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 3.926 | 4.013 | 4.194 | 4.683 | 5.199 | 4.2966667 | 0.38120802 |
| 2 | 9 | 3.767 | 3.796 | 4.05 | 4.3434 | 4.417 | 4.0317778 | 0.24060608 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.432 | -0.517 | -0.21 | 0.301 | 0.491 | -0.26488889 | 0.45078913 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.036 | 0.041 | 0.378 | 1.538 | 0.20677778 | 0.47135591 |
| 2 | 9 | 0.001 | 0.001 | 0.032 | 0.0484 | 0.054 | 0.027 | 0.02002221 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.537 | -0.046 | -0.015 | 0.031 | 0.053 | -0.17977778 | 0.47178097 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 130727940 | 151846910 | 160808960 | 205556940 | 205570050 | 173428280 | 27260172 |
| 2 | 9 | 130301950 | 159301630 | 159973380 | 196539190 | 197050370 | 172521700 | 22857575 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75268096 | -30507008 | -2080768 | 45203456 | 66322432 | -906581.33 | 35575071 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 14630672 | 23105792 | 32127288 | 54533534 | 59619768 | 34053032 | 14185348 |
| 2 | 9 | 20604240 | 29461880 | 33935512 | 42619629 | 52766208 | 33570682 | 8648915.7 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -39015528 | -11335912 | 747568 | 19992024 | 38135536 | -482350.22 | 16614086 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -48677120 | -19915192 | -3086104 | 13512035 | 13512048 | -7047247.1 | 18661852 |
| 2 | 9 | -19970248 | -3190480 | -2879632 | 13512667 | 13513032 | 552264.89 | 13129858 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -33482296 | -8274968 | 206472 | 33517560 | 62190152 | 7599512 | 22817929 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 949307.01 | 1194826.5 | 1241195.3 | 1268679.9 | 1274439.9 | 1199667.5 | 94810.763 |
| 2 | 9 | 1238466.8 | 1253329.2 | 1272831.4 | 1319162.9 | 1320044.9 | 1283061.4 | 32413.037 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35973.156 | 18595.167 | 58502.659 | 289159.77 | 370737.88 | 83393.828 | 100198.23 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 143376384 → 143638528 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 151535616 → 151535616 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 178995200 → 160808960 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 130727936 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4077158400 → 4066754560 | 0.92089272 → 0.92109458 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5666537472 → 5660147712 | 0.8900547 → 0.89017868 | 149127168 → 149127168 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5379588096 → 5373509632 | 0.89562225 → 0.89574019 | 199639040 → 199655424 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205570048 → 205570048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151650304 → 151650304 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156549120 → 156549120 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3980460032 → 3978149888 | 0.92276891 → 0.92281373 | 158728192 → 158728192 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159301632 → 159301632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159825920 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 195018752 → 195018752 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196116480 → 196116480 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196411392 → 196411392 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196984832 → 197050368 | 1 → 1 | 1483.06 → 1483.06 | completed |

## commandId/long

commandId long identities with varying decision and intent indices.

Units per sample: 200 ids. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 4.954333 | 5.00625 | 5.185834 | 5.3202756 | 5.478042 | 5.1649584 | 0.15859861 |
| 2 | 9 | 4.84275 | 4.9 | 4.934625 | 5.0387916 | 5.044958 | 4.9455278 | 0.064824077 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.635292 | -0.343084 | -0.204208 | -0.0037909998 | 0.090625 | -0.21943067 | 0.17133499 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 4.955041 | 5.007 | 5.186833 | 5.3215664 | 5.4795 | 5.166296 | 0.1588752 |
| 2 | 9 | 4.843166 | 4.90075 | 4.935209 | 5.0399834 | 5.046417 | 4.9463936 | 0.065047386 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.636334 | -0.343667 | -0.204041 | -0.003583 | 0.091376 | -0.21990244 | 0.17167554 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 4.956 | 5.008 | 5.123 | 5.8076 | 7.726 | 5.408 | 0.82832723 |
| 2 | 9 | 4.866 | 4.889 | 4.937 | 5.161 | 5.217 | 4.9842222 | 0.11949596 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -2.86 | -0.349 | -0.142 | 0.099 | 0.261 | -0.42377778 | 0.83690219 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.001 | 0.001 | 0.032 | 0.1416 | 0.436 | 0.074222222 | 0.1301049 |
| 2 | 9 | 0.026 | 0.054 | 0.064 | 0.0806 | 0.103 | 0.060666667 | 0.021868293 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.41 | -0.004 | 0.028 | 0.069 | 0.102 | -0.013555556 | 0.13192993 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 151126020 | 160940030 | 198524930 | 205560220 | 205586430 | 183398860 | 21920471 |
| 2 | 9 | 130301950 | 159793150 | 192806910 | 196424500 | 196804610 | 175749350 | 23131309 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -75284480 | -38699008 | -6160384 | 41680896 | 45678592 | -7649507.6 | 31867922 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 20547128 | 28716760 | 47113520 | 60963154 | 63245304 | 43813293 | 14966553 |
| 2 | 9 | 19975360 | 26189768 | 32064984 | 52647547 | 54579304 | 34054742 | 11731307 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -43269944 | -25665392 | -8666000 | 13561016 | 34032176 | -9758551.1 | 19016342 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -15162496 | -3094048 | 5294928 | 21837886 | 21840568 | 7535179.6 | 14243884 |
| 2 | 9 | -15106344 | -11629552 | -3158496 | 21836123 | 21836136 | 101576 | 13541468 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -36946912 | -20401272 | -8453424 | 16855576 | 36998632 | -7433603.6 | 19653488 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 36509.395 | 37882.677 | 38566.603 | 40063.875 | 40368.704 | 38758.575 | 1176.0905 |
| 2 | 9 | 39643.541 | 39980.338 | 40529.929 | 40933.949 | 41298.849 | 40447.505 | 528.57499 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -725.16238 | 726.52427 | 1635.041 | 3416.1722 | 4789.4536 | 1688.9304 | 1289.4108 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 146718720 → 146931712 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 152190976 → 152207360 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4230643712 → 4224253952 | 0.91791471 → 0.91803869 | 171671552 → 178946048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 160940032 → 160940032 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151191552 → 151191552 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 151126016 → 151126016 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198524928 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199262208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199458816 → 199458816 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205553664 → 205553664 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205586432 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073996288 → 4075716608 | 0.92095407 → 0.92092069 | 122585088 → 122634240 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153337856 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156565504 → 156614656 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159301632 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 130301952 → 130301952 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159793152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 192741376 → 192806912 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193101824 → 193101824 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196165632 → 196165632 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196329472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196755456 → 196804608 | 1 → 1 | 1483.06 → 1483.06 | completed |

## skeleton/live

Full current canonical 13-step demo (28 persisted events), live; shipped deterministic fake transports, no model invocation.

Units per sample: 5 demos. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 62.3465 | 62.813792 | 64.496875 | 70.107925 | 71.219291 | 65.241241 | 3.0248729 |
| 2 | 9 | 60.708125 | 61.430041 | 61.626875 | 63.957125 | 67.032791 | 62.491907 | 1.7891537 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -10.511166 | -4.078167 | -2.311125 | 0.827374 | 4.686291 | -2.7493336 | 3.5143886 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 62.348417 | 62.816208 | 64.499583 | 70.112967 | 71.222333 | 65.245755 | 3.0253286 |
| 2 | 9 | 60.71025 | 61.431875 | 61.62925 | 63.959209 | 67.034875 | 62.49394 | 1.7892192 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -10.512083 | -4.094375 | -2.318042 | 0.826959 | 4.686458 | -2.7518147 | 3.5148141 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 62.611 | 63.165 | 66.224 | 75.786 | 76.486 | 67.601444 | 4.9999559 |
| 2 | 9 | 61.141 | 62.541 | 64.852 | 72.5966 | 74.075 | 65.915222 | 4.2973797 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -15.345 | -5.318 | -1.536 | 7.608 | 11.464 | -1.6862222 | 6.5929532 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.242 | 0.313 | 0.465 | 0.951 | 1.711 | 0.6 | 0.4282642 |
| 2 | 9 | 0.339 | 0.359 | 0.441 | 0.8132 | 1.674 | 0.57477778 | 0.39844637 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -1.372 | -0.212 | 0.026 | 0.356 | 1.432 | -0.025222222 | 0.58495276 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 130727940 | 158302210 | 160940030 | 205586430 | 205979650 | 174462290 | 26488821 |
| 2 | 9 | 147603460 | 159825920 | 161808380 | 196788220 | 196984830 | 174280250 | 19540591 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -58376192 | -13336576 | -1916928 | 38682624 | 66256896 | -182044.44 | 32916445 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16688624 | 23860424 | 35148704 | 50526179 | 60042608 | 34942535 | 12926566 |
| 2 | 9 | 20027928 | 26917136 | 29646240 | 47727181 | 54752960 | 35137805 | 11096867 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -40014680 | -10896208 | 2038504 | 22110312 | 38064336 | 195270.22 | 17036331 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -10232168 | -5070088 | -1718640 | 15840992 | 28151776 | 3173513.8 | 11522977 |
| 2 | 9 | -4973760 | -4883504 | -4042664 | 7405174.4 | 28346448 | 69936 | 10211494 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -33125536 | -16165280 | -1683344 | 12402024 | 38578616 | -3103577.8 | 15396545 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 70.205697 | 76.291763 | 77.523136 | 80.182217 | 80.196964 | 76.796731 | 3.4117912 |
| 2 | 9 | 74.59036 | 79.227112 | 81.133434 | 81.624455 | 82.361298 | 80.073114 | 2.1928413 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -5.6066039 | 1.1547225 | 2.8369255 | 9.7910236 | 12.155601 | 3.2763823 | 4.0557209 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 135659520 → 142000128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 151535616 → 152125440 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 160923648 → 160940032 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 130727936 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4052828160 → 3721494528 | 0.92136478 → 0.9277935 | 151846912 → 151879680 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 198524928 → 198901760 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5383192576 | 0.8901933 → 0.89555232 | 199475200 → 199639040 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205209600 → 205488128 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.3505859 / 7.8173828 / 6.8989258 → 6.3505859 / 7.8173828 / 6.8989258 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205766656 → 205979648 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4135829504 → 4135829504 | 0.91975435 → 0.91975435 | 155025408 → 181370880 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 153255936 → 153255936 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 156565504 → 156565504 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 159825920 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 147505152 → 147603456 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 160759808 → 161808384 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159973376 → 159973376 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 193118208 → 193200128 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195575808 → 195821568 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196460544 → 196739072 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196820992 → 196984832 | 1 → 1 | 1483.06 → 1483.06 | completed |

## skeleton/replay

Full current canonical 13-step demo (28 persisted events), replay; shipped deterministic fake transports, no model invocation.

Units per sample: 5 demos. Warm-ups per execution: 2; measured repetitions: 9.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 35.042292 | 35.432625 | 36.428708 | 39.30045 | 39.593916 | 36.895259 | 1.6565786 |
| 2 | 9 | 34.044042 | 34.257583 | 35.070583 | 37.190859 | 38.898959 | 35.521144 | 1.4919694 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -5.549874 | -2.766333 | -1.252833 | 1.331209 | 3.856667 | -1.3741154 | 2.2294002 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 35.044125 | 35.434459 | 36.430959 | 39.30315 | 39.597583 | 36.897787 | 1.6570517 |
| 2 | 9 | 34.045958 | 34.259875 | 35.072917 | 37.193875 | 38.903375 | 35.523583 | 1.4927575 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -5.551625 | -2.767416 | -1.253042 | 1.332041 | 3.85925 | -1.3742039 | 2.2302792 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 35.25 | 36.577 | 38.723 | 42.9786 | 45.473 | 39.445444 | 3.2789625 |
| 2 | 9 | 34.204 | 34.583 | 35.005 | 41.701 | 44.237 | 36.933667 | 3.3221953 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -11.269 | -6.566 | -2.164 | 3.512 | 8.987 | -2.5117778 | 4.6678235 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 0.206 | 0.32 | 0.366 | 0.6894 | 0.731 | 0.44077778 | 0.16879296 |
| 2 | 9 | 0.22 | 0.227 | 0.288 | 0.9366 | 1.035 | 0.42244444 | 0.2982531 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -0.511 | -0.235 | -0.087 | 0.58 | 0.829 | -0.018333333 | 0.34270392 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 134184960 | 158302210 | 160825340 | 205311180 | 205717500 | 175430770 | 26486546 |
| 2 | 9 | 122699780 | 159285250 | 192888830 | 196542460 | 197132290 | 174904660 | 25368541 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -83017728 | -12828672 | -3883008 | 43696128 | 62947328 | -526108.44 | 36675604 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 16068712 | 23443576 | 33826208 | 49645466 | 54794784 | 34464458 | 12743404 |
| 2 | 9 | 19275080 | 22379592 | 30865584 | 56267853 | 57939680 | 35358623 | 14042394 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -35519704 | -13551592 | 1018520 | 26674184 | 41870968 | 894165.33 | 18962679 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | -12801760 | -12651088 | -308976 | 8595022.4 | 20628840 | -1925070.2 | 10916661 |
| 2 | 9 | -12837688 | -12642048 | -2234872 | 20652493 | 20672960 | -471628.44 | 12980766 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -33466528 | -12447952 | 9040 | 20981936 | 33474720 | 1453441.8 | 16960949 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9 | 126.28203 | 129.71571 | 137.25439 | 141.5156 | 142.68473 | 135.78604 | 5.9548353 |
| 2 | 9 | 128.53814 | 138.45174 | 142.56963 | 146.40193 | 146.86858 | 140.99967 | 5.6817444 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 81 | -14.146587 | -0.11510199 | 5.0631804 | 17.119534 | 20.586549 | 5.2136259 | 8.2305701 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 3574677504 → 3574677504 | 0.93064213 → 0.93064213 | 147210240 → 147374080 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | warmup / 1 | 3.7250977 / 4.6401367 / 4.7709961 → 3.7250977 / 4.6401367 / 4.7709961 | 4280664064 → 4280664064 | 0.91694419 → 0.91694419 | 142000128 → 142032896 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 160825344 → 160825344 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 3864264704 | 0.9250234 → 0.9250234 | 134135808 → 134184960 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 4099686400 → 4099686400 | 0.92045561 → 0.92045561 | 151617536 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 3 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158285824 → 158302208 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 4 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 158302208 → 158318592 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 5 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5659394048 → 5659394048 | 0.8901933 → 0.8901933 | 199262208 → 199426048 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 6 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 204963840 → 205045760 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 7 | 6.2075195 / 7.8144531 / 6.8925781 → 6.2075195 / 7.8144531 / 6.8925781 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205078528 → 205209600 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 8 | 6.2075195 / 7.8144531 / 6.8925781 → 6.3505859 / 7.8173828 / 6.8989258 | 5375606784 → 5375606784 | 0.8956995 → 0.8956995 | 205586432 → 205717504 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 151650304 → 151666688 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | warmup / 1 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 4073357312 | 0.92096647 → 0.92096647 | 122634240 → 122994688 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 3979870208 → 3979870208 | 0.92278035 → 0.92278035 | 158842880 → 159285248 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3626516480 | 0.92963632 → 0.92963632 | 154091520 → 154091520 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1098792960 → 1104691200 | 0.97868061 → 0.97856617 | 122519552 → 122699776 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 3 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 159793152 → 159825920 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 4 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1097809920 → 1097809920 | 0.97869968 → 0.97869968 | 192806912 → 192888832 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 5 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 195510272 → 195543040 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 6 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196165632 → 196280320 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 7 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 196329472 → 196395008 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 8 | 3.546875 / 4.4873047 / 4.746582 → 3.546875 / 4.4873047 / 4.746582 | 1071431680 → 1071431680 | 0.97921149 → 0.97921149 | 197050368 → 197132288 | 1 → 1 | 1483.06 → 1483.06 | completed |

## command/build

Full npm run build; shipped build stages a fresh forced TypeScript build, filesystem caches uncontrolled.

Units per sample: 1 commands. Warm-ups per execution: 1; measured repetitions: 3.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 705.22908 | 711.77765 | 718.32621 | 888.21511 | 930.68733 | 784.74754 | 103.33344 |
| 2 | 3 | 688.36858 | 689.97617 | 691.58375 | 692.37988 | 692.57892 | 690.84375 | 1.7967422 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -242.31875 | -238.10842 | -26.742458 | -13.446301 | -12.650168 | -93.903792 | 103.34906 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 705.2315 | 711.77996 | 718.32842 | 888.21828 | 930.69075 | 784.75022 | 103.33396 |
| 2 | 3 | 688.37104 | 689.97846 | 691.58587 | 692.38244 | 692.58158 | 690.84617 | 1.7967638 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -242.31971 | -238.10917 | -26.742542 | -13.446483 | -12.649917 | -93.904056 | 103.34958 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 0.732 | 1.0425 | 1.353 | 6.5346 | 7.83 | 3.305 | 3.2096863 |
| 2 | 3 | 0.809 | 1.112 | 1.415 | 9.267 | 11.23 | 4.4846667 | 4.7760828 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -7.021 | -0.544 | 0.077 | 10.0012 | 10.498 | 1.1796667 | 5.7543942 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 0.646 | 0.706 | 0.766 | 0.8884 | 0.919 | 0.777 | 0.11172287 |
| 2 | 3 | 0.677 | 0.721 | 0.765 | 0.9634 | 1.013 | 0.81833333 | 0.14226111 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -0.242 | -0.089 | 0.031 | 0.271 | 0.367 | 0.041333333 | 0.18088732 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 151846910 | 156327940 | 160808960 | 165055690 | 166117380 | 159591080 | 5889196.6 |
| 2 | 3 | 150077440 | 151232510 | 152387580 | 155926530 | 156811260 | 153092100 | 2793844.3 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -16039936 | -10731520 | -8421376 | 1425408 | 4964352 | -6498986.7 | 6518297.5 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 13508576 | 14420056 | 15331536 | 21905514 | 23549008 | 17463040 | 4367306.6 |
| 2 | 3 | 16111296 | 16169488 | 16227680 | 18549056 | 19129400 | 17156125 | 1396124.6 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -7437712 | -4419608 | 896144 | 4162456 | 5620824 | -306914.67 | 4585033.4 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | -7054720 | -3450000 | 154720 | 240531.2 | 261984 | -2212672 | 3424125 |
| 2 | 3 | -12064760 | -11045056 | -10025352 | -7451841.6 | -6808464 | -9632858.7 | 2163746.8 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -12326744 | -10287336 | -7070448 | -2327254.4 | 246256 | -7420186.7 | 4050485.4 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 1.0744747 | 1.2332999 | 1.3921252 | 1.4128082 | 1.417979 | 1.2948596 | 0.15619269 |
| 2 | 3 | 1.4438788 | 1.4449176 | 1.4459565 | 1.4513594 | 1.4527101 | 1.4475151 | 0.0037700686 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | 0.025899824 | 0.034731152 | 0.053831295 | 0.37283249 | 0.3782354 | 0.15265551 | 0.15623818 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 4074012672 → 4074012672 | 0.92095375 → 0.92095375 | 121028608 → 121339904 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 4224253952 | 0.91803869 → 0.91803869 | 160808960 → 160808960 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 3986882560 → 3986882560 | 0.9226443 → 0.9226443 | 166100992 → 166117376 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 13.395996 / 8.265625 / 6.1918945 → 15.045898 / 8.6923828 / 6.3544922 | 4099686400 → 4088119296 | 0.92045561 → 0.92068005 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4138450944 | 0.91875871 → 0.91970348 | 151666688 → 151666688 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 3.5185547 / 4.0400391 / 4.7529297 | 4073357312 → 3979902976 | 0.92096647 → 0.92277972 | 156778496 → 156811264 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3639869440 | 0.93128332 → 0.92937724 | 152387584 → 152387584 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1469562880 | 0.97046661 → 0.97148673 | 151027712 → 150077440 | 1 → 1 | 1483.06 → 1483.06 | completed |

## command/kernel

Complete kernel node:test suite, including document tests; file concurrency 2; all 13 files explicitly enumerated.

Units per sample: 1 commands. Warm-ups per execution: 1; measured repetitions: 3.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 833.8495 | 854.15052 | 874.45154 | 884.01514 | 886.40604 | 864.90236 | 22.49352 |
| 2 | 3 | 799.39854 | 802.65148 | 805.90442 | 812.47988 | 814.12375 | 806.47557 | 6.025092 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -87.0075 | -75.053 | -68.547126 | -26.301217 | -19.72575 | -58.426792 | 23.286481 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 833.8515 | 854.15323 | 874.45496 | 884.01846 | 886.40933 | 864.90526 | 22.494132 |
| 2 | 3 | 799.40117 | 802.65383 | 805.9065 | 812.48223 | 814.12617 | 806.47794 | 6.0250214 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -87.008168 | -75.053792 | -68.548458 | -26.301067 | -19.725333 | -58.42732 | 23.287054 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 3.424 | 4.2465 | 5.069 | 11.609 | 13.244 | 7.2456667 | 4.2942992 |
| 2 | 3 | 5.677 | 9.5395 | 13.402 | 14.758 | 15.097 | 11.392 | 4.0999329 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -7.567 | 0.608 | 2.253 | 10.357 | 11.673 | 4.1463333 | 5.9372094 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 3.02 | 3.6045 | 4.189 | 4.6114 | 4.717 | 3.9753333 | 0.70908031 |
| 2 | 3 | 4.621 | 4.7095 | 4.798 | 5.3636 | 5.505 | 4.9746667 | 0.3819008 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -0.096 | 0.432 | 0.788 | 1.9194 | 2.485 | 0.99933333 | 0.80538383 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 151109630 | 151478270 | 151846910 | 159029660 | 160825340 | 154593960 | 4416520.5 |
| 2 | 3 | 147619840 | 149979140 | 152338430 | 158315320 | 159809540 | 153255940 | 5018534.5 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -13205504 | -4227072 | -1015808 | 8110080 | 8699904 | -1338026.7 | 6685158.3 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 14086808 | 16029580 | 17972352 | 24864986 | 26588144 | 19549101 | 5224012.1 |
| 2 | 3 | 16301080 | 16438568 | 16576056 | 19995179 | 20849960 | 17909032 | 2082577.9 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -10287064 | -5738184 | -1396296 | 3654716.8 | 6763152 | -1640069.3 | 5623827.3 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | -13093744 | -6246960 | 599824 | 696368 | 720504 | -3924472 | 6483841.6 |
| 2 | 3 | -7163736 | -5488752 | -3813768 | -201384 | 701712 | -3425264 | 3222785.5 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -7884240 | -4534272 | -18792 | 10183072 | 13795456 | 499208 | 7240617.9 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 1.1281512 | 1.1358626 | 1.1435739 | 1.1881205 | 1.1992572 | 1.1569941 | 0.030540596 |
| 2 | 3 | 1.2283145 | 1.2345782 | 1.2408419 | 1.2489208 | 1.2509405 | 1.2400323 | 0.0092547476 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | 0.029057311 | 0.051683305 | 0.097267996 | 0.1147105 | 0.12278933 | 0.083038212 | 0.031912041 |

Observed min–max ranges are disjoint; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 7.0141602 / 4.206543 / 4.6132813 | 4074012672 → 3578101760 | 0.92095375 → 0.93057569 | 121470976 → 121569280 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.8491211 / 4.3330078 / 4.6069336 → 3.8491211 / 4.3330078 / 4.6069336 | 4224253952 → 3999531008 | 0.91803869 → 0.92239889 | 160825344 → 160825344 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 13.395996 / 8.265625 / 6.1918945 → 13.395996 / 8.265625 / 6.1918945 | 3864264704 → 4118380544 | 0.9250234 → 0.9200929 | 153272320 → 151109632 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 15.045898 / 8.6923828 / 6.3544922 | 4052828160 → 4052828160 | 0.92136478 → 0.92136478 | 151846912 → 151846912 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 4.078125 / 4.4033203 / 5.1342773 → 3.9916992 / 4.3798828 / 5.121582 | 4187144192 → 4187144192 | 0.91875871 → 0.91875871 | 150962176 → 151339008 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3541630976 → 3541630976 | 0.93128332 → 0.93128332 | 153567232 → 152338432 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 4.1738281 / 4.3266602 / 4.7045898 | 3626516480 → 3346333696 | 0.92963632 → 0.93507258 | 159825920 → 159809536 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.4824219 / 4.3212891 / 4.6518555 | 1522139136 → 1522139136 | 0.97046661 → 0.97046661 | 147603456 → 147619840 | 1 → 1 | 1483.06 → 1483.06 | completed |

## command/skeleton

Complete skeleton node:test suite, including document tests; file concurrency 2; all 50 files explicitly enumerated.

Units per sample: 1 commands. Warm-ups per execution: 1; measured repetitions: 3.

### wallMs

ms; complete invocation/batch, including awaited child

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 300833.45 | 307298.65 | 313763.84 | 368209.19 | 381820.53 | 332139.28 | 35524.351 |
| 2 | 3 | 298967.89 | 299886.98 | 300806.07 | 301568.56 | 301759.18 | 300511.05 | 1158.4748 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -82852.639 | -80061.356 | -12957.768 | 163.24304 | 925.72504 | -31628.227 | 35543.235 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### monotonicMs

ms; independent hrtime clock over the same invocation

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 300833.46 | 307298.65 | 313763.84 | 368209.2 | 381820.54 | 332139.28 | 35524.351 |
| 2 | 3 | 298967.9 | 299886.99 | 300806.08 | 301568.56 | 301759.18 | 300511.05 | 1158.4752 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -82852.641 | -80061.357 | -12957.767 | 163.24064 | 925.72254 | -31628.228 | 35543.235 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### supervisorUserCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 12.972 | 12.9955 | 13.019 | 21.4502 | 23.558 | 16.516333 | 4.9792472 |
| 2 | 3 | 13.383 | 13.719 | 14.055 | 15.1142 | 15.379 | 14.272333 | 0.82922829 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -10.175 | -8.179 | 0.411 | 2.3694 | 2.407 | -2.244 | 5.0478235 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorSystemCpuMs

ms; harness process only, excludes children

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 12.078 | 12.143 | 12.208 | 12.3984 | 12.446 | 12.244 | 0.15237673 |
| 2 | 3 | 12.105 | 12.3115 | 12.518 | 12.6044 | 12.626 | 12.416333 | 0.22451775 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -0.341 | 0.027 | 0.18 | 0.4616 | 0.548 | 0.17233333 | 0.27134275 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorRssAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 130727940 | 139927550 | 149127170 | 167149570 | 171655170 | 150503420 | 16736789 |
| 2 | 3 | 122519550 | 135012350 | 147505150 | 150310090 | 151011330 | 140345340 | 12685752 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -49135616 | -24150016 | -8208384 | 17478451 | 20283392 | -10158080 | 21001152 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapUsedAfterBytes

bytes; harness after boundary, not a peak

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 15742000 | 18059492 | 20376984 | 37122405 | 41308760 | 25809248 | 11121958 |
| 2 | 3 | 17316480 | 17932080 | 18547680 | 20552307 | 21053464 | 18972541 | 1554915.4 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -23992280 | -20255296 | -1829304 | 3306836.8 | 5311464 | -6836706.7 | 11230125 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### supervisorHeapDeltaBytes

bytes; signed after-minus-before, GC included

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 336360 | 1168660 | 2000960 | 6450502.4 | 7562888 | 3300069.3 | 3089923.5 |
| 2 | 3 | -7672160 | -3510608 | 650944 | 1916537.6 | 2232936 | -1596093.3 | 4344699 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -15235048 | -8008520 | -5329952 | 630982.4 | 1896576 | -4896162.7 | 5331419.7 |

Observed min–max ranges overlap; central p25–p90 ranges overlap.

### unitsPerSecond

scenario units / second, calculated per repetition

| Execution | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 0.0026190315 | 0.0029030709 | 0.0031871104 | 0.0032967008 | 0.0033240984 | 0.0030434134 | 0.00030525012 |
| 2 | 3 | 0.0033139009 | 0.0033191509 | 0.0033244009 | 0.0033407528 | 0.0033448408 | 0.0033277142 | 0.000012846596 |

Between-execution differences (execution 2 minus execution 1): all pairwise differences; correlated descriptive values, not independent samples or a confidence interval.

| Derived set | N | min | p25 | p50 | p90 | max | mean | stddev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All pairs | 9 | -0.00001019754 | 0.000020742358 | 0.00013729056 | 0.00070945742 | 0.00072580928 | 0.00028430077 | 0.00030552033 |

Observed min–max ranges overlap; central p25–p90 ranges are disjoint.

### Per-invocation boundary samples

Includes the labeled warm-up boundaries; the JSONL retains their resources separately from measured distributions.

| Execution | Phase / round | Load before → after (1/5/15 min) | Free bytes before → after | Used fraction before → after | Harness RSS before → after | Native pressure before → after | Swap MiB before → after | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | warmup / 0 | 7.0141602 / 4.206543 / 4.6132813 → 3.7250977 / 4.6401367 / 4.7709961 | 3574677504 → 4278321152 | 0.93064213 → 0.91698964 | 147587072 → 109363200 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 0 | 3.7250977 / 4.6401367 / 4.7709961 → 3.8491211 / 4.3330078 / 4.6069336 | 4280664064 → 4228923392 | 0.91694419 → 0.91794809 | 153829376 → 171655168 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 1 | 3.8491211 / 4.3330078 / 4.6069336 → 13.395996 / 8.265625 / 6.1918945 | 3986882560 → 3854974976 | 0.9226443 → 0.92520364 | 166117376 → 130727936 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 1 | measured / 2 | 15.045898 / 8.6923828 / 6.3544922 → 6.2075195 / 7.8144531 / 6.8925781 | 3868655616 → 5685657600 | 0.9249382 → 0.88968372 | 157040640 → 149127168 | 1 → 1 | 1491.06 → 1491.06 | completed |
| 2 | warmup / 0 | 3.9916992 / 4.3798828 / 5.121582 → 3.5185547 / 4.0400391 / 4.7529297 | 4135829504 → 4086005760 | 0.91975435 → 0.92072105 | 181485568 → 114409472 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 0 | 3.5185547 / 4.0400391 / 4.7529297 → 4.1738281 / 4.3266602 / 4.7045898 | 3979870208 → 3536699392 | 0.92278035 → 0.931379 | 159285248 → 151011328 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 1 | 4.1738281 / 4.3266602 / 4.7045898 → 3.4824219 / 4.3212891 / 4.6518555 | 3348824064 → 1518993408 | 0.93502426 → 0.97052765 | 159809536 → 147505152 | 1 → 1 | 1483.06 → 1483.06 | completed |
| 2 | measured / 2 | 3.4824219 / 4.3212891 / 4.6518555 → 3.546875 / 4.4873047 / 4.746582 | 1467645952 → 1098498048 | 0.97152392 → 0.97868633 | 150077440 → 122519552 | 1 → 1 | 1483.06 → 1483.06 | completed |

