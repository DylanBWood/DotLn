# WO-197

The publication, integration and harness test suites now spend less time rebuilding the same fixtures and starting the same processes. Every assertion they made is kept. In a fresh review gate, compared with WO-196's last one, the publication suite fell from 357.1 s to 129.8 s, the integration suite from 301.5 s to 181.0 s and the harness suite from 392.9 s to 289.5 s. Together that is 451 s less task time, from one gate sample on each side. Each of the 42 repaired cases now fails if it takes more than twice its measured duration, so the next growth shows up at the case that grew.

**Runtime.** The one product change is the compiler's `fnv1a64`. It now keeps the 64-bit state as two 32-bit words instead of BigInt. The FNV prime is 256 · 2^32 + 435, so every intermediate stays below 2^42, where `Number` arithmetic is exact. The output is identical: a new compiler test compares it with a BigInt reference over every UTF-16 code unit and 1,000 seeded random strings, and verification found no mismatch over 116,788 more inputs and three published vectors. In the executor's measurement it ran about four times faster. Generated hooks that validate their pinned runtime had spent 18 to 20 ms per process in it. The compiler moves to 0.25.5, so the generated hooks and harness manifest point at a new runtime snapshot.

**Tests.** Publication cases that share a configuration restore one authentic, completed episode instead of rebuilding it. Each restore is checked against a digest of every file, link and mode, and callbacks from an earlier case refuse to act on it. Review cases replay GitHub GraphQL in process through the same handler the executable replay runs. Two cases keep the real process boundary. Guard-only review cases start from an observed pull request in a real event store and fail if they reach a repair, push or disposition. Ten integration continuation cases clone a small seed and run stub generators that assert their arguments and stage order on every pass. Two cases still run every real generator. The harness live-gate matrices evaluate requests through the pinned runtime's real `runHarnessHook` entry in process. Each hook still runs refused and admitted requests through its generated process, and two matrices require those results to equal the in-process ones.

**Read before merging.** Two of the order's six criteria are unmet and were waived by the operator. Criterion 1 asked for the case behind each suite's first growth, but no retained gate row before 2026-10-05 records per-case timing. Criterion 2 asked each suite to run at or below its thirty-day median plus one quarter. Publication took 129.847 s against 22.254 s, and integration took 181.029 s in the gate against 156.976 s (134.598 s alone). Harness met its 326.779 s ceiling. Planning holds the baseline re-measure (FUP-edf3b0375b7c0eda). The new duration bounds can fail a suite on a heavily loaded host; in the order's fresh gate the slowest bounded cases used at most about 0.54 of their bounds. Application v0.69.1 is a patch release with compiler 0.25.4 → 0.25.5. No dependency is added.

**Validation.** The executor's fresh `npm test -- --review` at the reviewed code identity passed 35 suites with 85 fresh tasks in 1,477.586 s. This review's gate at the same identity reused those tasks, ran `format` fresh and passed 35 of 35 in 7.41 s. `npm run test:docs` passes 29 of 29. VER-001 failed criteria 1 and 2 and judged criteria 3 to 6 met. After the operator's waivers, VER-002 passed, and this final review found nothing further. Main had not moved, so integration changed only documents. Details: [FINAL-001](FINAL-001.md), [VER-001](../../verifications/WO-197/VER-001.md), [VER-002](../../verifications/WO-197/VER-002.md), [decisions](../../evidence/WO-197/decisions.md), [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-08T00:14:12.500Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-186 | 55,250,955 (Δ unavailable) / 8 | 20,388,505 (Δ unavailable) | 13 (Δ unavailable) / 163,932 (Δ unavailable) | 331,235,803 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 8 (Δ unavailable) | 3 (Δ unavailable) |
| WO-123 | 48,979,236 (Δ -6,271,719) / 11 | 4,558,664 (Δ -15,829,841) | 2 (Δ -11) / 13,988 (Δ -149,944) | 233,314,215 (Δ -97,921,588) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -6) | 1 (Δ -2) |
| WO-187 | 34,222,529 (Δ -14,756,707) / 11 | 7,377,103 (Δ 2,818,439) | 16 (Δ 14) / 179,356 (Δ 165,368) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 4) | 5 (Δ 4) |
| WO-112 | 73,614,052 (Δ 39,391,523) / 15 | 22,407,039 (Δ 15,029,936) | 46 (Δ 30) / 828,397 (Δ 649,041) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 5 (Δ -1) | 22 (Δ 17) |
| WO-196 | 14,904,655 (Δ -58,709,397) / 5 | 5,202,112 (Δ -17,204,927) | 4 (Δ -42) / 69,822 (Δ -758,575) | 88,914,669 (Δ unavailable) / unavailable (Δ unavailable) | 768 (Δ -251) | 2 (Δ -3) | 0 (Δ -22) |
| WO-197 | 18,123,224 (Δ 3,218,569) / 4 | 1,484,836 (Δ -3,717,276) | 3 (Δ -1) / 28,282 (Δ -41,540) | 82,761,669 (Δ -6,153,000) / unavailable (Δ unavailable) | 768 (Δ 0) | 3 (Δ 1) | 4 (Δ 4) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-197/executor | 15,767,756 (6,149,777) | unavailable (unavailable) | unavailable (unavailable) | 60,639,826 (14,828,453) | 459 (165) | unavailable (unavailable) / 768 |
| WO-197/verifier | 2,355,468 (-262,488) | 91,466 (-48,048) | 130 (-49) | 22,033,253 (-9,253,310) | 148 (-56) | unavailable (unavailable) / unavailable |
| WO-197/reviewer | 8,749 (-2,659,971) | unavailable (unavailable) | 18 (-58) | 88,590 (-11,728,143) | 19 (-68) | unavailable (unavailable) / unavailable |
| WO-197/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-197/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-197/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
