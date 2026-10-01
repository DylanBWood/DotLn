# WO-105

The event store and crash recovery promise that a truncated log either decodes to its exact surviving prefix or fails loudly. Until now that promise had boundary tests but no persistent record a later store swap could be checked against. This pull request lands WO-105, an evidence-only corpus. It cuts seven logs at every byte offset (72,345 cuts), and it drives the shipped crash recovery at every byte of the demo's persisted crash opening (16,554 runs). No cut yields a silent third outcome, and no runtime finding was raised.

- **Store lane.** Generated LF logs of 0, 1, 8 and 64 events (with escaped newlines, multibyte text, correlation and causation chains and repeated command results), the retained CRLF and depth-12000 anomalies, and the canonical demo log. Each cut is classified against a prefix computed independently of `decodeLog`: 117 line-boundary cuts decode to exactly the true prefix, and 72,228 mid-line cuts fail loudly. Round-trip and append-numbering laws hold over every fixture and a 512-append chain. CRLF decodes to the same events as LF, and the 12,000-level payload decodes; both keep run-twice `replay` and `replayOutbox` determinism.
- **Skeleton lane.** Every offset calls `runScenario` with `crashAfterPersist` and a `recoveryLogTransform` that cuts the persisted log. The 12 line-boundary cuts recover, recompute their pending commands from the surviving log, make at most one effect for the command ID and keep live/replay trace identity. The other 16,542 fail loudly with the decoder's own error and no effect. Complete CRLF and depth-12000 mutations recover with one effect.
- **Golden demo and tree families.** The canonical demo's 28 decision traces, event log and glyph scene are committed with their exact regeneration command at base `2b1af1ab`. Four seeded repo-tree families (3 to 12 files, chains, cycles, orphans, every classification, 0 to 3 planted candidates) carry non-normative structural ground truth, pass their validator, regenerate byte for byte and show distinct live signatures.

**One registration outside `corpus/`.** With the operator's approval, `packages/kernel/test/fixtures/jsonl-protocols.json` gains one entry declaring `corpus/manifests/WO-105-observations.jsonl` as classified observations, so the document gate's event-stream check skips it ([D010](../../evidence/WO-105/decisions.md#wo-105-d010)). No decoder, test implementation, package or dependency changes, and nothing joins `npm test`.

**The lane must run at its base for now.** The corpus pins the demo's bytes and its oracle hashes at `2b1af1ab`. Since then `@dotln/compiler` moved to 0.22.0, whose version string the demo carries 23 times, and WO-181 changed `reactor.ts`. On `main` both sweeps still cover every offset with identical classifications and every invariant holds, but the golden `--check`, both sweep commands and 3 of the 11 corpus tests exit nonzero on those hashes. [D012](../../evidence/WO-105/decisions.md#wo-105-d012--final-review-the-corpuss-byte-pins-are-keyed-to-its-base-and-fail-on-later-main) records the evidence and boards the lane's after-base rule to `FUP-d093f77bd927f9dc`.

**Integration and version.** The order was executed on `v0.60.2` and integrated over WO-102's `v0.60.3` and WO-181's `v0.61.0`. WO-102 had already released `v0.60.3`, the version this order prepared, so application `v0.61.1` is a patch. No component version or edition changes.

**Validation.** `npm test -- --review` passed on the integrated tree at code identity `a20520b5…`: 30 suites, 0 failed, 1,108.32 s. The store and tree `--check` are byte-identical there, and `npm run test:docs` passes. [VER-001](../../verifications/WO-105/VER-001.md) passed all seven criteria at the base with three independent probes, and [FINAL-001](FINAL-001.md) passed.

**Known limits.** Per-command effect attribution is proven only for the declared shapes, which hold at most one command ID. Crash shapes outside the declared set are untested.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T18:23:02.864Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-180 | 5,518,304 (Δ unavailable) / 3 | 1,695,186 (Δ unavailable) | 3 (Δ unavailable) / 18,410 (Δ unavailable) | 48,716,481 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-176 | 41,822,452 (Δ 36,304,148) / 6 | 4,013,405 (Δ 2,318,219) | 4 (Δ 1) / 64,961 (Δ 46,551) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 2) | 3 (Δ 3) |
| WO-103 | 5,080,866 (Δ -36,741,586) / 3 | 1,414,182 (Δ -2,599,223) | 6 (Δ 2) / 89,134 (Δ 24,173) | 38,256,997 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 1 (Δ -2) |
| WO-102 | 6,903,085 (Δ 1,822,219) / 3 | 1,414,302 (Δ 120) | 3 (Δ -3) / 16,084 (Δ -73,050) | 37,366,239 (Δ -890,758) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 0) | 2 (Δ 1) |
| WO-181 | 6,364,541 (Δ -538,544) / 3 | 1,788,507 (Δ 374,205) | 4 (Δ 1) / 45,954 (Δ 29,870) | 40,317,429 (Δ 2,951,190) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -1) | 1 (Δ -1) |
| WO-105 | 7,329,265 (Δ 964,724) / 2 | 4,580,821 (Δ 2,792,314) | 3 (Δ -1) / 19,100 (Δ -26,854) | 44,067,562 (Δ 3,750,133) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 3 (Δ 2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-105/executor | 6,646,406 (2,585,282) | unavailable (unavailable) | unavailable (unavailable) | 28,983,835 (2,277,439) | 222 (50) | unavailable (unavailable) / 1,019 |
| WO-105/verifier | 682,859 (75,581) | 7,838 (-128,596) | 55 (-7) | 7,162,253 (-6,359,520) | 59 (-25) | unavailable (unavailable) / unavailable |
| WO-105/reviewer | 1,580,880 (-115,259) | 29,932 (-199,264) | 69 (-11) | 7,921,474 (7,832,214) | 79 (-48) | unavailable (unavailable) / unavailable |
| WO-105/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-105/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-105/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
