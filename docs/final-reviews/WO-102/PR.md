# WO-102

The root suite pins selected cadence classes. Until now nothing compared the kernel's scheduling and retry formula with an independent implementation across a declared grid, or pinned it with regenerable golden vectors. This pull request lands WO-102, a seeded corpus that sweeps 69,389 declared cases across the six cadence kinds the kernel evaluates. It replays each through the shipped `evaluateCadence` and checks it against an independent reimplementation. Everything agrees and no finding arose. The pin is the formula `v0.60.0` shipped, a drift and porting alarm, not conformance to an external specification.

- **Boundaries.** `Once` before, at and after `at`. `After` with zero, unit, ordinary and huge delays. `Every` with `startAt` present and absent (the key omitted, so the evaluator's `?? 0` applies), unit and huge intervals, seven timing cells including the alignment fixed points, and the shipped throw for NaN, ±Infinity, 0 and −1 intervals. At `startAt` the next tick is `startAt + intervalMs`.
- **Composition.** `Gate` and `Until` alternate to depth 6 under every truth assignment, over a versioned predicate registry frozen in the manifest. Each vector pins the trace, the null-versus-due outcome and the exact predicate call order.
- **Backoff and the LCG.** 63,360 cells over initial delay, factor, attempt, cap, jitter, eleven RNG states and `now`. The sweep checks determinism, `0 ≤ delay ≤ maxMs`, exact RNG threading and agreement with a reference that uses BigInt arithmetic modulo 2^32 and repeated multiplication. A hand-computed vector gives the same delay, 602, in both implementations.
- **Purity.** The whole grid is evaluated again with `Date.now` and `Math.random` replaced by throwing functions, and it matches.

**The lane.** New files only, under `corpus/fixtures/cadence/`, `corpus/harness/` and `corpus/manifests/`. No kernel, package, dependency or existing corpus file changes, and nothing joins `npm test`. The manifest lists the three commands: `npm run build`, `node corpus/harness/generate-cadence-corpus.mjs --seed wo102-seed-20261001 --check` and `node --test corpus/harness/wo102-*.test.mjs`. The `--check` rebuilds every shard and the manifest byte for byte. The 2,265 committed vectors (11 shards, 1,898,287 bytes, within the 2 MiB budget) hold `Once`, `After` and `Every` in full and a seed-ranked 512 for each other kind. Every class label is represented, and the corpus tests check the full set. The eight deferred kinds stay pinned only by WO-017's root-suite test.

**Integration.** The order was executed on `v0.60.0` (`ee9b9db9`). `main` fast-forwarded to `2b1af1ab`, over WO-176's `v0.60.1` and WO-103's `v0.60.2`, which changed no kernel, package or WO-102 file. The patch target was retimed from `v0.60.1` to `v0.60.3` ([D008](../../evidence/WO-102/decisions.md#wo-102-d008)). The borrowed browser cache the executor's gate used had disappeared with the WO-176 worktree, so the pinned browser was installed into this worktree's ignored cache at the operator's direction ([D009](../../evidence/WO-102/decisions.md#wo-102-d009)).

**Validation.** `npm test -- --review` passed on the integrated tree at code identity `7c2ec23a…`: 30 suites, 0 failed, 435.72 s. On the same tree, the seeded `--check` is byte-identical and the 21 corpus tests pass, with counts matching the manifest. `npm run test:docs` passes. [VER-001](../../verifications/WO-102/VER-001.md) passed all six criteria and planted 12 drifts in a copy of the formula; the sweep flagged all 12. [FINAL-001](FINAL-001.md) passed.

**Review conduct: red flag.** During final review I ran an extra, unbounded mutation probe on the operator's machine, and the operator saw memory use reach 500 GB and still climbing. The probe was killed, produced no result, and nothing above rests on it. [D010](../../evidence/WO-102/decisions.md#wo-102-d010) records the failure and routes a follow-up to bound the harness's memory use when a drift fires.

**Known limits.**
- **Domain.** The corpus covers the declared finite grid only: unsigned 32-bit RNG states and finite, nonnegative Backoff parameters. No deferred kind appears nested inside `Gate` or `Until`.
- **Lane.** The corpus runs on its own commands, not in `npm test`. A changed kernel formula fails those commands, not the root gate. Until D010's follow-up lands, run the lane against a changed kernel only under a memory cap.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T16:09:49.933Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-175 | 8,027,049 (Δ unavailable) / 3 | 3,483,168 (Δ unavailable) | 4 (Δ unavailable) / 61,796 (Δ unavailable) | 52,710,657 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ unavailable) | 0 (Δ unavailable) |
| WO-059 | 13,869,681 (Δ 5,842,632) / 8 | 3,716,930 (Δ 233,762) | 3 (Δ -1) / 23,786 (Δ -38,010) | 77,033,040 (Δ 24,322,383) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-180 | 5,518,304 (Δ -8,351,377) / 3 | 1,695,186 (Δ -2,021,744) | 3 (Δ 0) / 18,410 (Δ -5,376) | 48,716,481 (Δ -28,316,559) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-176 | 41,822,452 (Δ 36,304,148) / 6 | 4,013,405 (Δ 2,318,219) | 4 (Δ 1) / 64,961 (Δ 46,551) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 2) | 3 (Δ 3) |
| WO-103 | 5,080,866 (Δ -36,741,586) / 3 | 1,414,182 (Δ -2,599,223) | 6 (Δ 2) / 89,134 (Δ 24,173) | 38,256,997 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 1 (Δ -2) |
| WO-102 | 3,059,418 (Δ -2,021,448) / 2 | 1,414,302 (Δ 120) | 3 (Δ -3) / 16,084 (Δ -73,050) | 37,366,239 (Δ -890,758) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 0) | 2 (Δ 1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-102/executor | 2,652,513 (15,166) | unavailable (unavailable) | unavailable (unavailable) | 13,724,525 (1,461,223) | 122 (23) | unavailable (unavailable) / 1,019 |
| WO-102/verifier | 406,905 (-23,533) | 18,377 (-74,514) | 37 (5) | 4,083,849 (-125,958) | 41 (-2) | unavailable (unavailable) / unavailable |
| WO-102/reviewer | 1,294,510 (-718,571) | 87,482 (81,513) | 135 (4) | 19,557,865 (-2,226,023) | 172 (13) | unavailable (unavailable) / unavailable |
| WO-102/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-102/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-102/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
