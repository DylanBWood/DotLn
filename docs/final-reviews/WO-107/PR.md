# WO-107

DotLn compares what an order declares it will cost with what it actually costs, but that comparison has had no observed column: every efficiency cell in the capability table reads `E0 — unknown`. This pull request lands WO-107, an evidence-only baseline. A deterministic harness measured 36 scenarios at base `2bae7d40` in two complete executions, each with its own seeded run order. It keeps every warm-up, every measured sample and the machine load around each one. It reports distributions only: no verdict, threshold, optimization or efficiency level.

- **What was measured.** Kernel `replay`, `decodeLog` and `encodeLog` at 64, 1,024 and 8,192 events. `evaluateCadence` over parameter, time, predicate and RNG grids for all 14 constructors; the eight deferred kinds measure their rejection path. Four `stableHash` and four `commandId` input classes. The 13-step skeleton demo, live and from replay. The full `npm run build`, the kernel suite (13 files) and the skeleton suite (50 files). Each function and demo scenario ran 2 warm-ups and 9 measured repetitions per execution, and each command ran 1 and 3. Scenarios were shuffled and interleaved each round from seeds `wo107-base-a-20261002` and `wo107-base-b-20261002`.
- **What each record carries.** The base commit, a source inventory and the collector's protocol hash. The OS, the CPU and the Node, npm and tsc versions. The run order. Eight resource metrics, each with count, min, p25, p50, p90, max, mean and standard deviation over every measured repetition, outliers included. Load average, memory occupancy, macOS memory pressure and swap are sampled before and after every run and every invocation and labeled as boundary samples, so a later reader can reject a baseline recorded on a busy machine.
- **The comparison.** `profile.mjs --compare` generates [WO-107-comparison.md](../../../corpus/baselines/WO-107-comparison.md) from the observations. It sets the two executions side by side, with every pairwise difference between them. `--compare --check` reproduces it byte for byte and never touches the observations. For example, the skeleton suite's median was 313.8 s in the first execution and 300.8 s in the second, and the first execution's 381.8 s run is retained. The build and the kernel suite each took under a second.

**One registration outside `corpus/`.** With the operator's approval, `packages/kernel/test/fixtures/jsonl-protocols.json` gains one entry. It declares the observations file a non-event protocol, so the kernel's strict event-stream test does not misread it ([D007](../../evidence/WO-107/decisions.md#wo-107-d007)). The first execution ran before that entry existed and the second ran with it. Both collector revisions are recorded, and their timed code is byte-identical. No runtime, package or dependency changes, and nothing joins `npm test`.

**Some of the lane's own checks are keyed to this order's bytes.** `--compare --check` reads only the committed records, so runtime changes do not affect it. Three self-checks are keyed to this order's bytes:
- The classification self-test fails once a later order adds its own entry to that fixture.
- Any edit to the four collector modules makes `--compare --check` fail with `known collector revision`, because only the first collector revision is archived.
- The registry self-test runs the current kernel and skeleton.

[D010](../../evidence/WO-107/decisions.md#wo-107-d010--final-review-the-lanes-own-checks-are-keyed-to-this-orders-bytes) records the reproductions and boards this lane's after-base rule beside WO-105's, as `FUP-8f0561e50754114f`. [D011](../../evidence/WO-107/decisions.md#wo-107-d011--final-review-the-lifecycle-whitespace-check-never-reads-new-files) boards a lifecycle gap the review met, as `FUP-def7dd3b4f48a6fb`. The inline `git diff --check` never reads an order's new files. Once staged, this order's diff reports one blank line at the end of the generated report.

**Validation.** `npm test -- --review` passed at code identity `d04f565c…`: 30 suites, 0 failed, 420.10 s. `npm run test:docs` passes. [VER-001](../../verifications/WO-107/VER-001.md) independently rebuilt the run order from each seed and recomputed every recorded statistic, and passed all seven criteria. [FINAL-001](FINAL-001.md) passed.

**Known limits.** All measurements come from one host, with three measured repetitions per command. CPU and memory figures describe the harness process, and child-process CPU and memory are unmeasured. Filesystem caches and other applications were uncontrolled. The first execution started with a one-minute load average of 7.0 and 92% memory occupancy.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-02T02:44:10.334Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-177 | 2,898,257 (Δ unavailable) / 3 | 421,171 (Δ unavailable) | 4 (Δ unavailable) / 36,300 (Δ unavailable) | 14,343,231 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ unavailable) | 0 (Δ unavailable) |
| WO-182 | 5,812,601 (Δ 2,914,344) / 3 | 1,677,566 (Δ 1,256,395) | 3 (Δ -1) / 16,668 (Δ -19,632) | 18,764,996 (Δ 4,421,765) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-061 | 5,072,289 (Δ -740,312) / 3 | 838,316 (Δ -839,250) | 4 (Δ 1) / 40,444 (Δ 23,776) | 24,874,201 (Δ 6,109,205) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-179 | 11,332,268 (Δ 6,259,979) / 5 | 3,400,549 (Δ 2,562,233) | 4 (Δ 0) / 75,390 (Δ 34,946) | 40,662,068 (Δ 15,787,867) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-124 | 3,692,949 (Δ -7,639,319) / 3 | 446,025 (Δ -2,954,524) | 3 (Δ -1) / 13,211 (Δ -62,179) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 2) | 0 (Δ 0) |
| WO-107 | 6,829,989 (Δ 3,137,040) / 2 | 1,048,991 (Δ 602,966) | 3 (Δ 0) / 19,066 (Δ 5,855) | 32,030,699 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -2) | 2 (Δ 2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-107/executor | 6,333,719 (4,314,431) | unavailable (unavailable) | unavailable (unavailable) | 25,007,933 (unavailable) | 176 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-107/verifier | 496,270 (168,191) | unavailable (unavailable) | 51 (9) | 6,939,004 (2,325,852) | 54 (7) | unavailable (unavailable) / unavailable |
| WO-107/reviewer | 6,797 (-1,338,785) | unavailable (unavailable) | 21 (-11) | 83,762 (-893) | 22 (-11) | unavailable (unavailable) / unavailable |
| WO-107/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-107/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-107/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
