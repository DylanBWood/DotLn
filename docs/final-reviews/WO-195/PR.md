# WO-195

A Claude release close now finishes in the session the operator dispatched. It publishes the tag and Release, removes the worktree and its directory, and deletes the merged branch, so the operator no longer runs the command themselves. In 6 of the 12 Claude closes recorded from 2026-10-01 to 2026-10-03, the operator had to: in 5 the auto-mode classifier denied the publish, and in WO-184 cleanup stopped partway. A planning pass now ends with its branch pushed and its `:memo:` pull request open.

**The admission reaches the close.** After a merge changes the pinned runtime, the `resume: release close` prompt used to land in the generated hook's fallback, which records no dispatch, so the admission never fired. The fallback now rebuilds and re-emits main's runtime under the writer lock, with no live gate, then replays the normal hook once. The normal dispatch and admission then judge the same facts as before: a recorded release-close dispatch for that order, main as the working directory, and canonical status listing `release-close`. A missing or unreadable fact withholds admission with an advisory that names it, and a typed correction also withholds it. The prompt hook's timeout rises from 15 s to 600 s for this one hook.

**One spelling, short output.** One exported builder prints the helper command for the resume briefing, the `worktree publish` handoff, the material command and every blocker retry, and fixtures run each printed command through the admission. `release close` now prints a summary of a few hundred bytes (512, 763 and 347 bytes for the fixture's publish, dry run and retry) in place of 305 to 342 KB. The full output goes to a retained report the summary names.

**Cleanup completes.** After material preservation, the close records a removal receipt and restores write permission on owned directories inside the subject, without following links. Removal is judged from both Git's list and the disk. A directory Git has already dropped stays a blocker until a re-run verifies its receipt, and the same command then removes it. The merged branch is deleted in the run that removes the worktree, and a dry run prints that deletion. A close whose cleanup is blocked keeps the session's writer so that session can retry.

**Read before merging.** The release-close role now says the close is done when the tag and Release exist, no worktree or directory remains for the order and `git branch --list wo-NNN` is empty. A cleanup blocker is finished in the session by re-running the same command, and a host denial is retried once through the permission flow before the operator gets the command for `!`. Material dispositions stay the operator's, and teardown is never forced. A retry after `main` moves still refuses (FUP-da471832071118c7). No live Claude close ran inside the order: this order's own close from merged `main` is the first. The compiler moves to 0.25.1 and the skeleton to 0.52.2, and no dependency is added.

**Validation.** A fresh `npm test -- --review` at the reviewed subject passed 41 of 41 suites with 91 fresh tasks in 860 s, and `npm run test:docs` passes. Fixtures for criteria 1, 2 and 4 fail against `efe62994` and pass here. VER-001 failed on one stdout line that bypassed the retained report in a no-release close, with three cleanup findings. The repair settled all four, and VER-002 passed. Details: [FINAL-001](FINAL-001.md), [VER-002](../../verifications/WO-195/VER-002.md), [decisions](../../evidence/WO-195/decisions.md), [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-04T16:22:32.954Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-124 | 3,692,949 (Δ unavailable) / 3 | 446,025 (Δ unavailable) | 3 (Δ unavailable) / 13,211 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ unavailable) | 0 (Δ unavailable) |
| WO-107 | 7,947,102 (Δ 4,254,153) / 3 | 1,048,991 (Δ 602,966) | 3 (Δ 0) / 19,066 (Δ 5,855) | 32,030,699 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -2) | 2 (Δ 2) |
| WO-062 | 5,453,733 (Δ -2,493,369) / 5 | 930,666 (Δ -118,325) | 3 (Δ 0) / 22,101 (Δ 3,035) | 31,952,166 (Δ -78,533) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 1 (Δ -1) |
| WO-184 | 54,181,702 (Δ 48,727,969) / 5 | 2,212,088 (Δ 1,281,422) | 4 (Δ 1) / 94,960 (Δ 72,859) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -1) |
| WO-185 | 70,773,751 (Δ 16,592,049) / 10 | 8,545,143 (Δ 6,333,055) | 3 (Δ -1) / 30,932 (Δ -64,028) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 4 (Δ 3) | 2 (Δ 2) |
| WO-195 | 18,740,147 (Δ -52,033,604) / 4 | 4,507,949 (Δ -4,037,194) | 4 (Δ 1) / 65,846 (Δ 34,914) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -3) | 5 (Δ 3) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-195/executor | 16,569,517 (-45,540,040) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-195/verifier | 2,170,630 (-3,171,037) | 100,415 (-117,656) | 175 (-184) | 26,077,235 (-18,874,239) | 197 (-203) | unavailable (unavailable) / unavailable |
| WO-195/reviewer | 879,662 (-2,442,865) | 7,651 (-294,720) | 93 (-242) | 16,219,912 (-10,846,136) | 101 (-282) | unavailable (unavailable) / unavailable |
| WO-195/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-195/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-195/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
