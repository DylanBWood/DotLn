## Release overview

The kernel's scheduling and retry timing now have regenerable golden-vector evidence. A seeded corpus enumerates 69,389 declared cases across the six cadence kinds the kernel evaluates (`Once`, `After`, `Every`, `Gate`, `Until` and `Backoff`). It replays each through the shipped `evaluateCadence` and compares it with an independent reimplementation of the LCG draw and the Backoff formula. All of them agree, and no finding arose. The comparison pins the formula `v0.60.0` shipped, as a drift and porting alarm. It claims no conformance to an external specification, because `packages/kernel/src/core.ts` is the only specification. This release is for anyone who changes or ports the kernel's cadence evaluation: the sweep fails when the shipped timing drifts.

## Read before upgrading

- **No runtime change.** No package, contract, dependency or evidence edition changes. Every component keeps its version, and nothing joins `npm test`. The corpus runs on its own three commands, which its manifest lists.
- **The pin is the shipped formula.** A disagreement between the kernel and the reference means implementation drift or a harness bug, never a specification violation. The eight deferred kinds (`Burst`, `Calendar`, `Window`, `While`, `Sequence`, `Merge`, `Race` and `Repeat`) are not pinned again; WO-017's root-suite test still pins each as a throw.

## Substantive changes

**Boundary matrices.** `Once` is swept before, at and after `at`, and `After` with zero, unit, ordinary and huge delays. `Every` is swept with `startAt` present and absent; when it is absent the key is omitted from the AST and the evaluator's `?? 0` default applies. Each sweep covers unit and huge intervals and seven timing cells, including the alignment fixed points. At `startAt` the next tick is `startAt + intervalMs`: `Every(20, startAt 50)` evaluated at 50 is due at 70. NaN, ±Infinity, 0 and −1 intervals are pinned as the shipped throw.

**Composition.** `Gate` and `Until` alternate to depth 6 under every truth assignment. They draw on three predicate profiles of a versioned registry frozen in the manifest (params, state and event) and seven leaves. Each vector pins the trace string, the null-versus-due outcome and the exact predicate call order. Unknown predicate ids and versions are pinned too: under a closed outer `Gate` or a cancelling outer `Until` they short-circuit to null, and otherwise they throw.

**Backoff and the LCG.** 63,360 cells cross initial delay, factor, attempt, cap, jitter, eleven RNG states and `now`. The sweep checks determinism, `0 ≤ delay ≤ maxMs` and exact RNG threading. It also checks agreement with a reference that computes the LCG with BigInt arithmetic modulo 2^32 and the power by repeated multiplication. Four of the RNG states are chosen so that the draw lands on 0, the smallest step, the midpoint and the top of the range. A hand-computed vector (state 42, attempt 3, jitter 0.5) gives a delay of 602 in both implementations.

**Purity.** All 69,389 cases are evaluated a second time with `Date.now` and `Math.random` replaced by throwing functions, and they match their expected outcomes.

**Regeneration.** `node corpus/harness/generate-cadence-corpus.mjs --seed wo102-seed-20261001 --check` rebuilds every shard and the manifest byte for byte. It refuses an unmanifested shard or an unexpected findings file.

## Progressive polish

The corpus commits 2,265 vectors in 11 shards, 1,898,287 bytes within the declared 2 MiB budget. `Once`, `After` and `Every` are committed in full. `Gate`, `Until` and `Backoff` commit 512 seed-ranked vectors each, with every class label represented. The full set is regenerated and checked by the corpus tests. Shards use the existing `EventEnvelope` v1 JSONL framing, so the strict historical-stream codec validates them unchanged. The corpus also commits a manifest and one run transcript.

## Evidence and compatibility

Application `v0.60.3` is a patch release over `v0.60.2`, built from WO-102 on `main` at `2b1af1ab`. `@dotln/kernel` 0.6.0, `@dotln/skeleton` 0.48.0, `@dotln/compiler` 0.21.0, `@dotln/console` 0.4.0, `@dotln/beacons` 0.1.0 and `@dotln/browser-evidence` 0.1.0 are unchanged. The order was executed on `v0.60.0`. It was integrated over WO-176's `v0.60.1` and WO-103's `v0.60.2`, which changed no kernel, package or WO-102 file.

The verification sequence:
- [VER-001](../../verifications/WO-102/VER-001.md) passed all six criteria. It reproduced the `--check` and the 21 corpus tests and planted 12 drifts in a copy of the shipped formula; the sweep flagged all 12.
- [FINAL-001](FINAL-001.md) passed on the integrated tree.

`npm test -- --review` passed on the integrated tree at code identity `7c2ec23a820db32704c5a79ab297f283371b9df701a28826ca2323a090146a75`: 30 suites, 0 failed, 435.72 s. On the same tree, the seeded `--check` is byte-identical and the 21 corpus tests pass. `npm run test:docs` passes.

Known limitations:
- The corpus covers the declared finite grid only: unsigned 32-bit RNG states and finite, nonnegative Backoff parameters. It makes no claim about other numeric domains.
- No deferred kind appears nested inside `Gate` or `Until`.
- The corpus runs on its own commands and is not part of `npm test`.
- The harness's memory use when a drift fires has not been bounded. A final-review probe that ran it against mutated kernels without a memory cap coincided with memory use on the operator's machine reaching 500 GB and still climbing ([D010](../../evidence/WO-102/decisions.md#wo-102-d010)). Until that follow-up lands, run the lane against a changed kernel only under a memory cap.

Details are in the [manifest](../../../corpus/manifests/WO-102.json) and the [decisions](../../evidence/WO-102/decisions.md).
