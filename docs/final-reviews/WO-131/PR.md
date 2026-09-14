Gate successes now carry across role sessions, and a passing final gate ends report authoring. The independent verifier's later-phase gate fell from 807.236 to 62.377 seconds with all 62 cacheable declared tasks reused. Final timings and usage stay in local receipts and the response, so copying results into Markdown no longer starts another completion gate.

Remaining reusable suites declare files, Git shape and environment and run in replicas. Live and current-tree checks still execute. Optional kernel denial records whether protection applied; canonical PATH removes per-shell differences, and the success cache is bounded. Prompt submission and explicit recovery stay available when the repository or runtime is unhealthy, and new worktrees prepare their runtime before launch.

VER-002 passed after reproducing the repair independently. Final review closes its evidence-location gap and adds an executed regression proving all four completion actions collect final usage after one gate while report/source edits still invalidate evidence. The full gate and checked tree are bound by the final-review completion event. See [final review](docs/final-reviews/WO-131/FINAL-001.md), [measurements](docs/evidence/WO-131/gate-performance.json) and [release notes](docs/final-reviews/WO-131/RELEASE-NOTES.md).

The accepted limitation remains an absolute candidate path hard-coded in a suite when denial is unavailable. The live release-close measurement follows merge from a session started in main. No domain-event schema or dependency change is required.

The process meter below is a pre-gate snapshot. Later timings and handoff usage remain local; refreshing this snapshot after validation is not a completion requirement.

<!-- dotln-process-meter:start -->
| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-043 | 43,513,297 (Δ unavailable) / 7 | 5,124,955 (Δ unavailable) | 5 (Δ unavailable) / 26,780 (Δ unavailable) | 74,440,475 (Δ unavailable) / unavailable (Δ unavailable) | 658 (Δ unavailable) | 0 (Δ unavailable) |
| WO-125 | 31,446,483 (Δ -12,066,814) / 9 | unavailable (Δ unavailable) | 5 (Δ 0) / 33,021 (Δ 6,241) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-128 | 17,829,450 (Δ -13,617,033) / 3 | unavailable (Δ unavailable) | 11 (Δ 6) / 133,462 (Δ 100,441) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 3 (Δ 3) |
| WO-129 | 8,400,234 (Δ -9,429,216) / 5 | unavailable (Δ unavailable) | 6 (Δ -5) / 56,204 (Δ -77,258) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 2 (Δ -1) |
| WO-130 | 50,868,457 (Δ 42,468,223) / 9 | unavailable (Δ unavailable) | 3 (Δ -3) / 45,276 (Δ -10,928) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 4 (Δ 2) |
| WO-131 | 61,083,186 (Δ 10,214,729) / 4 | 4,972,964 (Δ unavailable) | 1 (Δ -2) / 28,727 (Δ -16,549) | 198,656,176 (Δ unavailable) / unavailable (Δ unavailable) | 657 (Δ unavailable) | 2 (Δ -2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-131/executor | 56,957,407 (13,375,935) | 405,250 (unavailable) | 175 (unavailable) | 146,650,248 (unavailable) | 256 (unavailable) | unavailable (unavailable) / 657 |
| WO-131/verifier | 4,125,779 (-1,612,846) | 422,133 (unavailable) | 178 (unavailable) | 48,524,353 (unavailable) | 247 (unavailable) | unavailable (unavailable) / unavailable |
| WO-131/reviewer | 389,804 (-1,158,556) | unavailable (unavailable) | unavailable (unavailable) | 3,481,575 (unavailable) | 28 (unavailable) | unavailable (unavailable) / unavailable |
| WO-131/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-131/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-131/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
