# WO-199

An interrupted or crashed `dotln vertical` now stops its writer and resumes the same issue on the next run, instead of sealing it `refused`. Before this change, a writer launched through the vertical recorded no process group, so recovery after a host crash threw and the issue was sealed `refused`. Ctrl-C stopped only the host while the model writer kept editing the governed worktree. A host refusal after the writer's result was recorded as `WorkerInterrupted transport-failed`. WO-112's final review recorded all three, and its recovery probe reproduced the first. Each is repaired with regressions.

**Recovery.** The vertical's transport wrapper exposes the writer's process group as soon as the launch returns it. `SourceChangeProcessStarted` records that group, the transport and, for native writers, the group leader's birth identity. Native writers wait at an exec gate (`host-lock --supervise`, compiled from `scripts/lib/host-lock.c`) until that record is durable, so a host that dies before recording admits no writer. The supervisor stays the group leader until the writer ends, reports its exit status on a private pipe, then stops any remaining group members, even after the host has died. On rerun, recovery stops a surviving writer group only when the recorded identity proves ownership, including descendants that outlived the leader. Otherwise it refuses to signal. The direct transport and the vertical now read the same record.

**Interrupts.** `dotln vertical` handles SIGINT, SIGTERM and SIGHUP. It forwards the signal to the live writer group, waits up to 10 s with a SIGKILL escalation at 9 s, records `WorkerInterrupted` with the signal and exits 130, 143 or 129. Every other in-flight judgment, triage, repair verifier, intake episode and timed wait ends at once. A pending signal takes precedence over a synchronous child's returned data and errors. A focused test, Git read or snapshot witness killed by the operator's Ctrl-C never becomes an observation, refusal, unreadable-integrity finding or receipt. The step stays pending, and the rerun re-tests the writer's existing commit without spending another writer dispatch. A 15 s backstop ends the command if a wait the signal does not reach is still running. In the run that receives a writer's result, host checks that refuse it record `SourceChangeRefused` with a `host-admission-*` reason naming the check.

**Read before merging.** Native writers now need a C compiler at first use of each helper version: `clang` with `xcrun` on macOS, `cc` elsewhere. The skeleton README names this prerequisite. A synchronous child already in flight still returns before the signal is handled: up to 15 s for a Git command, 180 s for a focused test and 30 s per snapshot witness test. Two interrupted writer dispatches exhaust the step's existing two-dispatch budget. Three gaps stay boarded, with their repair rules. A rerun's re-observation of an unreceipted result records no typed refusal (D015, FUP-49c4a5f7176252e7). The witnesses step's browser scenario does not stop on the signal (D011, FUP-88c339c51cfc1933). Identical judgment retries remain unbounded (WO-112 D061). Linux was not exercised.

**Validation.** The agreed WO-112 recovery probe now records groups for `crash-vertical` and `crash-direct` and recovers both `observed`, and `revoke-vertical` records the stop and the interruption. FINAL-001's post-result probe exits 130, 143 and 129 within 12 ms of a group-wide signal. It leaves source-change pending with no observation or receipt, and the rerun resolves with a passing test. The executor's fresh `npm test -- --review` at the reviewed code identity passed 38 suite groups, with 88 fresh tasks, in 1,307.615 s. This review's gate at the same identity reused those tasks, ran `format` fresh and passed 38 of 38 in 5.72 s. `npm run test:docs` passes 29 of 29. The live feedback episode ran on `codex-cli-exec` (`gpt-6.1-sol`, `max`) after the last judged-source edit, and every evidence edition checks current. VER-001 and FINAL-001 failed on signal-handling defects, and their repairs closed them. VER-002, VER-003 and FINAL-002 passed, and this final review corrected one README sentence. Main had not moved, so integration changed only documents. Details: [FINAL-002](FINAL-002.md), [VER-003](../../verifications/WO-199/VER-003.md), [FINAL-001](FINAL-001.md), [decisions](../../evidence/WO-199/decisions.md).

Application v0.69.2; skeleton 0.55.0 → 0.55.1, and the console pins it. No dependency is added.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-08T20:21:32.593Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-123 | 48,979,236 (Δ unavailable) / 11 | 4,558,664 (Δ unavailable) | 2 (Δ unavailable) / 13,988 (Δ unavailable) | 233,314,215 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ unavailable) | 1 (Δ unavailable) |
| WO-187 | 34,222,529 (Δ -14,756,707) / 11 | 7,377,103 (Δ 2,818,439) | 16 (Δ 14) / 179,356 (Δ 165,368) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 4) | 5 (Δ 4) |
| WO-112 | 73,614,052 (Δ 39,391,523) / 15 | 22,407,039 (Δ 15,029,936) | 46 (Δ 30) / 828,397 (Δ 649,041) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 5 (Δ -1) | 22 (Δ 17) |
| WO-196 | 14,904,655 (Δ -58,709,397) / 5 | 5,202,112 (Δ -17,204,927) | 4 (Δ -42) / 69,822 (Δ -758,575) | 88,914,669 (Δ unavailable) / unavailable (Δ unavailable) | 768 (Δ -251) | 2 (Δ -3) | 0 (Δ -22) |
| WO-197 | 19,049,648 (Δ 4,144,993) / 5 | 1,484,836 (Δ -3,717,276) | 3 (Δ -1) / 28,282 (Δ -41,540) | 82,761,669 (Δ -6,153,000) / unavailable (Δ unavailable) | 768 (Δ 0) | 3 (Δ 1) | 4 (Δ 4) |
| WO-199 | 28,197,672 (Δ 9,148,024) / 7 | 5,878,530 (Δ 4,393,694) | 6 (Δ 3) / 46,146 (Δ 17,864) | 158,505,935 (Δ 75,744,266) / unavailable (Δ unavailable) | 768 (Δ 0) | 3 (Δ 0) | 0 (Δ -4) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-199/executor | 22,171,114 (6,403,358) | 256,374 (unavailable) | 445 (unavailable) | 89,893,267 (29,253,441) | 476 (17) | unavailable (unavailable) / 768 |
| WO-199/verifier | 4,245,692 (1,890,224) | 190,794 (99,328) | 190 (60) | 41,270,147 (19,236,894) | 218 (70) | unavailable (unavailable) / unavailable |
| WO-199/reviewer | 1,780,866 (854,442) | 62,105 (unavailable) | 134 (116) | 27,342,521 (27,253,931) | 151 (132) | unavailable (unavailable) / unavailable |
| WO-199/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-199/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-199/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
