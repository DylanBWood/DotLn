# WO-166

Under Codex, nothing reserved the worktree's writer. The reservation lived only on the Claude hook path, while the role text every Codex session reads said DotLn reserves one writer per worktree and that completion releases it. Three Codex sessions since WO-155 met the gap mid-phase: two reserved by building a hook payload by hand and one handed off unreserved. Separately, no command waited for a live gate, and a Claude executor watched one with a log follower that never exits.

This pull request lands WO-166. A Codex session now holds the writer from its lifecycle dispatch to its completion without a step of its own, a refused session is told who holds the writer and how to release it, a session start reports an override left open in the same worktree, and a live gate is awaited with a command that exits with the recorded outcome.

- **Reserve at dispatch, release at completion.** The five Codex dispatches (`next`, `fix`, `verify`, `final-review`, `release-close`) reserve before they can append an event, so a foreign holder refuses the dispatch with the control log unchanged. `verification-result`, `final-review-result` and a successful `release close --publish` now release as `implementation-ready` and `repair-complete` already did, durable result first.
- **An owner that outlives the command.** The owner is the Codex host process found by walking the dispatch's ancestors, otherwise a pid-less `thread` owner with unknown liveness. The npm or node process that exits with the command is never the owner, and a holder without a live pid is never reclaimed as dead.
- **Refusals that diagnose themselves.** One function composes the Codex dispatch refusal, the Claude hook refusal and the operator-release refusal: actor prefix, owner, reservation time, age in seconds and the release command, with `--force` when the owner is alive.
- **`node scripts/harness.mjs evidence --wait`, with an optional `--timeout` in seconds.** It returns when no live gate marker remains and prints the newest check row for the current tree: exit 0 after a recorded pass, 1 after a recorded failure, 2 at the timeout or with no row. An invocation that reused cached rows is judged by its own recorded outcome. A live gate admits the command; under Claude Code it runs in the background.
- **Open-override advisory.** The operator-control state records the worktree it was opened in, and a later session start in that worktree prints one line naming the entry time. It appends no event, and an override opened in another worktree prints nothing.
- **Role text and editions.** Two sentences, 350 bytes, appear once in every generated skill; every cold-start verdict is unchanged. Authority WO-166/005, artifact identity WO-166/001, verification WO-166/001 and feedback WO-166/002 are selected, the last carrying the WO-070 live audit with no new episode.

**What a reviewer should know.**

- **Rebuild `main` before a Codex release-close dispatch there.** A runtime built before this merge lacks the reservation entry point, so the dispatch fails before any event ([D014](../../evidence/WO-166/decisions.md#wo-166-d014) B1), and it reads a pid-less owner as dead ([D008](../../evidence/WO-166/decisions.md#wo-166-d008)).
- **Release close is dispatched in `main`.** A briefing requested from the subject reserves nothing and directs a `main` session to dispatch and run the helper in that same session ([VER-001](../../verifications/WO-166/VER-001.md) F2, [D009](../../evidence/WO-166/decisions.md#wo-166-d009)).
- **A killed Codex session still needs the operator release.** A pid-less holder has no liveness to observe; the order names this as its non-goal, and the refusal now carries the age and the command.
- **An unbuilt runtime refuses a Codex dispatch.** Without the runtime a foreign holder cannot be judged; the refusal names `npm run build`.
- **The harness prints a session scratch path it never creates** ([D015](../../evidence/WO-166/decisions.md#wo-166-d015), high priority). The defect dates from WO-144 and is outside this order; the final review met it in use and boarded it with a named follow-up.
- **Three standing sentences do not yet name the Codex reservation** ([D016](../../evidence/WO-166/decisions.md#wo-166-d016)): the five-refusals paragraph, product 02's writer paragraph and product 07's index paragraph.

**How the review went.** A Codex session implemented the order (D001 to D006). [VER-001](../../verifications/WO-166/VER-001.md) failed it: the wait answered no row for a passed invocation whose rows were cached, and a release-close dispatch from the subject reserved `main` for a session that never completes there, with six smaller defects (F1 to F8, D007). The repair answered all eight with regressions, integrated `main` and repaired four process fixtures the integrated gate exposed (D009 to D013). [VER-002](../../verifications/WO-166/VER-002.md) passed all eight criteria and boarded three minor defects (D014). [FINAL-001](FINAL-001.md) read the authored diff, ran the review gate and awaited it with the new command, reproduced the refusal, reclaim, wait and advisory behaviour with its own probe, and read two real Codex dispatches in the worktree's writer journal reserving a `codex-host` owner and releasing at completion. It also records the reviewer's own errors in that session.

**Validation.** The reviewer's `npm test -- --review` on the subject passed **40 passed, 0 failed, 612.01 s, 84 fresh tasks, exit 0** at code identity `5165f355497d94cc37746af935adb690673f009e94f9cfcbcf5b6adfe9c37e04`, and that row binds the released bytes. `npm run test:docs` passed after the review records were written; `harness check` passes with 31 generated surfaces; the four edition checks, `publication:check`, `release check-surfaces --local` and `meta --check` pass. `git diff --check` is clean, no dependency is added and the diff adds no suppression.

This prepares application `v0.52.3` as a patch release over `v0.52.2` (`9cd8465c`), the classification the order declared; the staged `v0.52.2` target was retimed at the repair's integration. Compiler moves to 0.19.2 and skeleton to 0.44.2 with matching console pins.

Full evidence: [decisions D001 to D016](../../evidence/WO-166/decisions.md), the [implementation](../../evidence/WO-166/implementation.md) and [repair](../../evidence/WO-166/repair.md) records, the verification reports [VER-001](../../verifications/WO-166/VER-001.md) and [VER-002](../../verifications/WO-166/VER-002.md), the [final review](FINAL-001.md) and [the order](../../work-orders/WO-166-session-boundaries.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-26T23:42:13.266Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-160 | 13,450,485 (Δ unavailable) / 7 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-070 | 8,380,589 (Δ -5,069,896) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-115 | 22,293,818 (Δ 13,913,229) / 15 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-165 | 6,509,729 (Δ -15,784,089) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-085 | 13,343,986 (Δ 6,834,257) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-166 | 10,913,926 (Δ -2,430,060) / 4 | 2,167,250 (Δ unavailable) | 4 (Δ unavailable) / 67,793 (Δ unavailable) | 82,672,267 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-166/executor | 5,413,788 (765,502) | unavailable (unavailable) | unavailable (unavailable) | 52,837,626 (unavailable) | 346 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-166/verifier | 5,500,138 (-1,285,312) | 143,754 (unavailable) | 499 (unavailable) | 29,743,726 (unavailable) | 532 (unavailable) | unavailable (unavailable) / unavailable |
| WO-166/reviewer | 12,277 (-1,897,973) | 286,550 (unavailable) | 101 (unavailable) | 90,915 (unavailable) | 143 (unavailable) | unavailable (unavailable) / unavailable |
| WO-166/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-166/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-166/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
