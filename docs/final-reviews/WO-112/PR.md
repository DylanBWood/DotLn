# WO-112

`dotln vertical` now takes a GitHub issue to a reviewed pull request without anyone tending it, and a witnessed run on a personal scratch repository shows it. Its own intake episode classifies the screened issue, governed workers change, test and commit, the generated pull request opens, the loop waits for the automated reviewer's check, and a triage episode accepts and repairs or rejects with evidence each automated comment before resolving its thread. Two scenarios ran end to end, one with every episode on Claude and one with every episode on Codex, and all eight items of v1's loop scored observed-met. This is WO-112, the evidence WO-118 waits on.

**What the vertical gained.** An issue configured with `intake: "model"` is classified by a tool-less model episode whose return the host validates against the exact spans it sent; supplied classifications still work and still win. Unsupplied automated review items get a triage episode: an inline item is accepted with a criterion and evidence, then repaired and re-verified, or rejected with evidence; a review body with no thread is acknowledged or left to a human, recorded as `ReviewBodyJudged`. `awaitChecks` names the review check runs to wait for after publication. Each invocation judges at most eight review bodies; a retryable episode failure is retried with the resident's capped backoff, while a host preparation failure stops with its reason.

**What every source writer gained.** Before launch the host persists the shared repository's refs, symbolic targets and alternates; after the writer stops it refuses, and preserves, any unexplained change, never restoring over another actor's work. Host Git ignores replace refs and the commit graph, the effect must be one commit with the host's message, recovery of an unreceipted attempt requires evidence that the writer's process group has ended, and a saved receipt replays even in older logs. The Codex writer now commits inside Codex's own sandbox through a named profile: read its toolchain and the shared Git metadata, write its own gitdir and the shared objects, refs and logs, from a linked worktree only.

**Read before merging.** Two recovery defects in the vertical are boarded at the operator's override, not repaired. A writer outlives a terminal interrupt of `dotln vertical` (D060), and a writer launched through the vertical records no process group, so after a crash or interrupt the next run seals the issue `refused` even when the writer finished cleanly (D065, FINAL-001 F1). VER-007 and FINAL-001 are passes the operator directed under `operator override:`, not measured passes. Shared object bytes remain writable by the Codex writer (D033), and a judgment that fails identically is retried at full cost (D061). An older DotLn reader refuses a vertical store holding `ReviewBodyJudged` or a `double` assessment producer. The skeleton moves 0.53.1 → 0.54.0 and the application target is v0.68.0; no dependency is added.

**Validation.** A fresh `npm test -- --review` at the reviewed code identity passed 38 of 38 suites with 88 fresh tasks in 1,860 s, and `npm run test:docs` passes in the result transition. Six verifications failed before the seventh: VER-001 on executor-scripted intake and triage labelled as model judgments, which the scope expansion repaired in the composition, and VER-002 to VER-006 on integrity and recovery defects in the new host checks and judgment episodes. Details: [FINAL-001](FINAL-001.md), [VER-007](../../verifications/WO-112/VER-007.md), [the scratch proof](../../evidence/WO-112/README.md), [decisions](../../evidence/WO-112/decisions.md), [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-07T04:13:52.203Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-185 | 70,773,751 (Δ unavailable) / 10 | 8,545,143 (Δ unavailable) | 3 (Δ unavailable) / 30,932 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 4 (Δ unavailable) | 2 (Δ unavailable) |
| WO-195 | 20,414,389 (Δ -50,359,362) / 5 | 4,507,949 (Δ -4,037,194) | 4 (Δ 1) / 65,846 (Δ 34,914) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -3) | 5 (Δ 3) |
| WO-186 | 55,250,955 (Δ 34,836,566) / 8 | 20,388,505 (Δ 15,880,556) | 13 (Δ 9) / 163,932 (Δ 98,086) | 331,235,803 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 8 (Δ 7) | 3 (Δ -2) |
| WO-123 | 48,979,236 (Δ -6,271,719) / 11 | 4,558,664 (Δ -15,829,841) | 2 (Δ -11) / 13,988 (Δ -149,944) | 233,314,215 (Δ -97,921,588) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -6) | 1 (Δ -2) |
| WO-187 | 34,222,529 (Δ -14,756,707) / 11 | 7,377,103 (Δ 2,818,439) | 16 (Δ 14) / 179,356 (Δ 165,368) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 4) | 5 (Δ 4) |
| WO-112 | 63,165,767 (Δ 28,943,238) / 12 | 22,407,039 (Δ 15,029,936) | 46 (Δ 30) / 828,397 (Δ 649,041) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 5 (Δ -1) | 18 (Δ 13) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-112/executor | 55,512,631 (33,826,314) | 366,779 (22,540) | 1,125 (843) | unavailable (unavailable) | 1,262 (892) | unavailable (unavailable) / 1,019 |
| WO-112/verifier | 7,653,136 (-1,057,804) | 155,603 (-39,751) | 494 (128) | 85,108,813 (12,409,128) | 553 (136) | unavailable (unavailable) / unavailable |
| WO-112/reviewer | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-112/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-112/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-112/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
