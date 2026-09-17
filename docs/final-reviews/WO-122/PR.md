# :sparkles: The resident launches workers and waits for human decisions

The resident can now launch a declared inspection or source-change CLI worker while the operator is away. It records the worker's origin, launch claims and validated result without treating a completion claim as independent verification. A human handoff writes a durable question, holds that work order across restart, and resumes its current continuation after an explicit valid answer.

Both the resident phase and the writer request must authorize the operation. An unavailable detached-launch row produces a named NoOp. The Codex writer also retains its native code-mode host, correcting the tool-host failure found by the live fixture; inspection arguments keep their baseline.

The integrated actor/writer tests pass 20/20. The [final review](FINAL-001.md) records the reviewer product gate and the evidence carried forward from [VER-001](../../verifications/WO-122/VER-001.md). The [live row](../../evidence/WO-122/live.json) proves a real launch and validated envelope; the worker reported blocked because Node was unavailable in its tool environment, while separate host checks observed the edit, passing test and commit. This does not claim the stronger WO-053 source-change proof.

Merged main at `352ada5` is incorporated. Application v0.29.0 and skeleton 0.25.0 retain the minor classification after WO-052 published the previously staged versions. Existing script declarations remain supported, and no third-party dependency is added. [Release notes](RELEASE-NOTES.md) describe the local-store and compatibility limits.

<!-- dotln-process-meter:start -->
| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-051 | 5,027,157 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-049 | 12,413,364 (Δ 7,386,207) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 669 (Δ unavailable) | 3 (Δ 3) |
| WO-119 | 5,587,715 (Δ -6,825,649) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ -3) |
| WO-121 | 7,541,368 (Δ 1,953,653) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-052 | 44,949,279 (Δ 37,407,911) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-122 | 42,797,656 (Δ -2,151,623) / 2 | 2,510,689 (Δ unavailable) | 3 (Δ unavailable) / 25,493 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 669 (Δ unavailable) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-122/executor | 41,791,689 (1,433,785) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 669 |
| WO-122/verifier | 1,005,967 (-1,004,169) | 705,634 (unavailable) | 186 (unavailable) | 10,448,934 (unavailable) | 368 (unavailable) | unavailable (unavailable) / unavailable |
| WO-122/reviewer | 35,075 (-2,546,164) | unavailable (unavailable) | unavailable (unavailable) | 52,256 (unavailable) | 1 (unavailable) | unavailable (unavailable) / unavailable |
| WO-122/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-122/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-122/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
