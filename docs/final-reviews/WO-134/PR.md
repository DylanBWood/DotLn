# :bug: Keep same-day planning reviews on the current pass

Planning refutation now selects the sole unjudged pass on the latest enforced date, or follows the latest planning receipt when those passes are already judged. Both transports share the rule, so swapping ledger sections no longer sends a review back to an earlier pass. Direct requests also keep their pass identity when consecutive reviews have identical subjects; older saved requests remain fileable.

The regression covers both ledger orders, both transports, introduction exemptions, historical receipts and saved-request preservation. Multiple unjudged passes on the same date report ambiguity; out-of-date-order receipt workflows remain a documented reopening condition. No dependency, package version, receipt format or continuation rule changes.

Validation: `npm test -- --review` passed all 20 suites in 395.49 s, including the planning-refutation fixtures; `npm run test:docs` passed all 17 suites. The live gate accepts all 15 historical receipts, and `git diff --check` is clean. [FINAL-001](https://github.com/DylanBWood/DotLn/blob/wo-134/docs/final-reviews/WO-134/FINAL-001.md) and [VER-001](https://github.com/DylanBWood/DotLn/blob/wo-134/docs/verifications/WO-134/VER-001.md) record the evidence and limits. Release target: v0.23.0 under the existing patch classification.

<!-- dotln-process-meter:start -->
| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-048 | 4,307,685 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-050 | 4,410,135 (Δ 102,450) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-047 | 8,432,250 (Δ 4,022,115) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-133 | 10,116,902 (Δ 1,684,652) / 6 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 2 (Δ 2) |
| WO-068 | 5,982,167 (Δ -4,134,735) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ -2) |
| WO-134 | 2,510,378 (Δ -3,471,789) / 2 | 739,965 (Δ unavailable) | 3 (Δ unavailable) / 17,645 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 669 (Δ unavailable) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-134/executor | 1,495,725 (-2,197,043) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 669 |
| WO-134/verifier | 1,014,653 (-60,370) | 67,262 (unavailable) | 55 (unavailable) | 13,284,489 (unavailable) | 119 (unavailable) | unavailable (unavailable) / unavailable |
| WO-134/reviewer | 104 (-1,214,272) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-134/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-134/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-134/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
