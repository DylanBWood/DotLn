# WO-199

An interrupted or crashed `dotln vertical` now stops its writer and resumes the same issue on the next run, instead of sealing it `refused`. Before this change, a writer launched through the vertical recorded no process group, so recovery after a host crash threw and the issue was sealed `refused`. Ctrl-C stopped only the host while the model writer kept editing the governed worktree. A host refusal after the writer's result was recorded as `WorkerInterrupted transport-failed`. WO-112's final review recorded all three, and its recovery probe reproduced the first. Each is repaired with regressions.

**Recovery.** The vertical's transport wrapper exposes the writer's process group as soon as the launch returns it. `SourceChangeProcessStarted` records that group, the transport and, for native writers, the group leader's birth identity. Native writers wait at an exec gate (`host-lock --supervise`, compiled from `scripts/lib/host-lock.c`) until that record is durable, so a host that dies before recording admits no writer. The supervisor stays the group leader until the writer ends, reports its exit status on a private pipe, then stops any remaining group members, even after the host has died. On rerun, recovery stops a surviving writer group only when the recorded identity proves ownership, including descendants that outlived the leader. Otherwise it refuses to signal. The direct transport and the vertical now read the same record.

**Interrupts.** `dotln vertical` handles SIGINT, SIGTERM and SIGHUP. It forwards the signal to the live writer group, waits up to 10 s with a SIGKILL escalation at 9 s, records `WorkerInterrupted` with the signal and exits 130, 143 or 129. Every other in-flight judgment, triage, repair verifier, intake episode and timed wait ends at once. A pending signal takes precedence over a synchronous child's returned data and errors. A focused test, Git read or snapshot witness killed by the operator's Ctrl-C never becomes an observation, refusal, unreadable-integrity finding or receipt. The step stays pending, and the rerun re-tests the writer's existing commit without spending another writer dispatch. A 15 s backstop ends the command if a wait the signal does not reach is still running. In the run that receives a writer's result, host checks that refuse it record `SourceChangeRefused` with a `host-admission-*` reason naming the check.

**Read before merging.** Native writers now need a C compiler at first use of each helper version: `clang` with `xcrun` on macOS, `cc` elsewhere. The skeleton README names this prerequisite. A synchronous child already in flight still returns before the signal is handled: up to 15 s for a Git command, 180 s for a focused test and 30 s per snapshot witness test. Two interrupted writer dispatches exhaust the step's existing two-dispatch budget. Three gaps stay boarded, with their repair rules. A rerun's re-observation of an unreceipted result records no typed refusal (D015, FUP-49c4a5f7176252e7). The witnesses step's browser scenario does not stop on the signal (D011, FUP-88c339c51cfc1933). Identical judgment retries remain unbounded (WO-112 D061). Linux was not exercised.

**Validation.** The agreed WO-112 recovery probe now records groups for `crash-vertical` and `crash-direct` and recovers both `observed`, and `revoke-vertical` records the stop and the interruption. FINAL-001's post-result probe exits 130, 143 and 129 within 12 ms of a group-wide signal. It leaves source-change pending with no observation or receipt, and the rerun resolves with a passing test. The executor's fresh `npm test -- --review` at the reviewed code identity passed 38 suite groups, with 88 fresh tasks, in 1,307.615 s. This review's gate at the same identity reused those tasks, ran `format` fresh and passed 38 of 38 in 5.72 s. `npm run test:docs` passes 29 of 29. The live feedback episode ran on `codex-cli-exec` (`gpt-6.1-sol`, `max`) after the last judged-source edit, and every evidence edition checks current. VER-001 and FINAL-001 failed on signal-handling defects, and their repairs closed them. VER-002, VER-003 and FINAL-002 passed, and this final review corrected one README sentence. Main had not moved, so integration changed only documents. Details: [FINAL-002](https://github.com/DylanBWood/DotLn/blob/0cc97dc8569189a928f6dfb80945ffe5788cb1d0/docs/final-reviews/WO-199/FINAL-002.md), [VER-003](https://github.com/DylanBWood/DotLn/blob/0cc97dc8569189a928f6dfb80945ffe5788cb1d0/docs/verifications/WO-199/VER-003.md), [FINAL-001](https://github.com/DylanBWood/DotLn/blob/0cc97dc8569189a928f6dfb80945ffe5788cb1d0/docs/final-reviews/WO-199/FINAL-001.md), [decisions](https://github.com/DylanBWood/DotLn/blob/0cc97dc8569189a928f6dfb80945ffe5788cb1d0/docs/evidence/WO-199/decisions.md).

Application v0.69.2; skeleton 0.55.0 → 0.55.1, and the console pins it. No dependency is added.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-09T08:56:55.242Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-187 | 34,222,529 / 11 | 7,377,103 | 16 / 179,356 |  /  | 1,019 | 6 | 5 |
| WO-112 | 73,614,052 (Δ 39,391,523) / 15 | 22,407,039 (Δ 15,029,936) | 46 (Δ 30) / 828,397 (Δ 649,041) |  /  | 1,019 (Δ 0) | 5 (Δ -1) | 22 (Δ 17) |
| WO-196 | 14,904,655 (Δ -58,709,397) / 5 | 5,202,112 (Δ -17,204,927) | 4 (Δ -42) / 69,822 (Δ -758,575) | 88,914,669 /  | 768 (Δ -251) | 2 (Δ -3) | 0 (Δ -22) |
| WO-197 | 19,049,648 (Δ 4,144,993) / 5 | 1,484,836 (Δ -3,717,276) | 3 (Δ -1) / 28,282 (Δ -41,540) | 82,761,669 (Δ -6,153,000) /  | 768 (Δ 0) | 3 (Δ 1) | 4 (Δ 4) |
| WO-199 | 29,582,201 (Δ 10,532,553) / 8 | 5,878,530 (Δ 4,393,694) | 6 (Δ 3) / 46,146 (Δ 17,864) | 158,505,935 (Δ 75,744,266) /  | 768 (Δ 0) | 3 (Δ 0) | 0 (Δ -4) |
| WO-188 | 34,952,234 (Δ 5,370,033) / 6 | 6,217,091 (Δ 338,561) | 11 (Δ 5) / 181,912 (Δ 135,766) | 187,280,356 (Δ 28,774,421) /  | 768 (Δ 0) | 2 (Δ -1) | 0 (Δ 0) |

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-188/executor | 26,342,016 (Δ 4,170,902) | 587,213 (Δ 330,839) | 2,406 (Δ 1,961) | 145,322,026 (Δ 55,428,759) | 2,489 (Δ 2,013) |  / 768 |
| WO-188/verifier | 8,610,218 (Δ 4,364,526) |  |  | 41,958,330 (Δ 688,183) | 311 (Δ 93) |  /  |

49 unavailable observations omitted as blank cells or rows; unavailable is not zero; unset ceilings are not approvals of a future limit.

<!-- dotln-process-meter:end -->
