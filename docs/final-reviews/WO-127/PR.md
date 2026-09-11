# Unblock release close with automatic record preservation

Release close now archives retained worktree records automatically before teardown, including nested and empty directories. Copies live under main's ignored `docs/control/local/retained/WO-NNN/` lane, preserve collision versions, and leave main's active records intact. Dry runs show the complete plan; interrupted copies retain recoverable sources for retry.

Planning-cost evidence remains valid after execution-only commits and merges when its inputs are unchanged. Generated hooks now consume piped JSON asynchronously after tracing located a stalled synchronous read; real-process tests cover large, chunked UTF-8 and truncated input, alongside cross-commit and stale-byte receipts.

Canonical evidence prepares owned projections before checking the tree, and package tests wait for successful preflights. Unchanged projections are left untouched; immutable evidence, publication locks and release targets retain explicit review. [VER-002](https://github.com/DylanBWood/DotLn/blob/main/docs/verifications/WO-127/VER-002.md) passed all seven acceptance criteria and the 37-suite workload. [FINAL-002](https://github.com/DylanBWood/DotLn/blob/main/docs/final-reviews/WO-127/FINAL-002.md) records the complete review and final evidence. The pending v0.17.0 release remains source-only.

<!-- dotln-process-meter:start -->
| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-032 | 8,389,570 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-109 | 11,283,452 (Δ 2,893,882) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-039 | 70,213,998 (Δ 58,930,546) / 13 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-042 | 57,675,542 (Δ -12,538,456) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-126 | 70,535,089 (Δ 12,859,547) / 16 | 3,716,712 (Δ unavailable) | 6 (Δ unavailable) / 131,629 (Δ unavailable) | 128,922,679 (Δ unavailable) / unavailable (Δ unavailable) | 504 (Δ unavailable) | 6 (Δ 6) |
| WO-127 | 9,057,473 (Δ -61,477,616) / 5 | 3,065,806 (Δ -650,906) | 3 (Δ -3) / 11,632 (Δ -119,997) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 504 (Δ 0) | 3 (Δ -3) |

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-127/executor | 5,692,283 (-42,043,319) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 504 |
| WO-127/verifier | 1,740,071 (-18,930,250) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-127/reviewer | 1,625,119 (-504,047) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-127/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-127/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-127/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
