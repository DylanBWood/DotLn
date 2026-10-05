# WO-186

A rerun of `npm test` now runs only the tasks whose latest recorded run at the same code identity did not pass. A new worktree whose code equals main's stands on main's passing row instead of repeating it. A role can write its own report while its product gate runs. Before this change, a rerun after one failed task, or after the selection grew, ran everything again: 14 such pairs recorded from 2026-09-27 took 8,384 s, of which only 9% to 36% of task time had no passing result. Five orders that changed only corpus or documents paid fifteen first gates, 10,129 s. The final reviewer's gate still runs every task fresh.

**Reuse per task, at one identity.** `npm test` composes a complete row from fresh and carried results, and each carried result names the row that executed it. A failed, stopped, timed-out or partial result is never carried. A later failed run of a task, in a gate or a single-suite, machinery or partial run, displaces an older pass, and so does a run in a row that failed an integrity check. The runner and the completion's claim check take each task's standing from one decision, which reads the worktree's own runs before main's. The build is carried only while its ignored output is the one the latest passing build recorded; when every pass is carried, nothing builds. `--again` and `--review` run every selected task fresh.

**What the identity covers.** Non-ignored untracked code enters the code identity by path and bytes, so editing an untracked source invalidates its rows and staging changes nothing. A symbolic source alias is refused. Five suites that read tracked documents the identity excludes now run in the fresh document gate: `license-surfaces`, `resume`, `resident-bind`, `local-runner-double` and `artifact-corpus`. The review selection diffs from the merge base, so a sibling's merge no longer widens it.

**Records while the gate runs.** During a plain product gate, the hook admits writes to the active order's own `docs/evidence`, `docs/verifications` and `docs/final-reviews` directories at the default document roots. Code, other orders' records, the control log and the success record stay refused, and document and review gates keep the full refusal. A product task that reads those record paths fails.

**The slow cases.** The lock matrix's eight cells run on private roots at concurrency four, with every assertion and the 120 s cell deadline kept. The integration fixtures clone without unrelated release tags, with the real generators kept. The harness case thought to have grown by 180 s was already fast, at 1.924 s; its gap was delayed result delivery, so the change repairs reporting and claims no saving. Each gate row now keeps every task's five slowest cases, the heartbeat names the running case, and `npm run plan -- conditions` lists the five longest tasks against their thirty-day medians and the plain gate against 360 s.

**Read before merging.** The five-refusals paragraph in `CLAUDE.md` and every role root now states the narrowed write admission, and the verifier's cold-start ceiling rises from 25,151 to 29,831 bytes by a dated acceptance. An identity that cannot be computed, or a main index that cannot be read, leaves an `npm test` claim recorded as stated with a `Gate index unavailable` advisory, as before for unreadable storage. A run that stops before its row is written displaces nothing. The document gate's median rose from 38.993 s to 66.690 s with the five moved suites, about 194 s more across an order's seven document gates. The plain gate's median across five after-phase runs is 422.027 s against 495.605 s before. The review gate's is 814.813 s against 506.452 s, on different selections. No whole-order saving is established. The compiler moves to 0.25.2, the skeleton to 0.52.3 and the host to 0.34.4, and no dependency is added.

**Validation.** A fresh `npm test -- --review` at the reviewed subject passed 36 of 36 suites with 86 fresh tasks and none reused in 934 s, and `npm run test:docs` passes. VER-001 and FINAL-001 each failed criterion 3 on a reuse path that could stand on an older pass after a later failure. The second repair made one decision serve the runner and the claim. VER-003's independent oracle then found no unsafe acceptance or carry in 4,200 random histories, against 231 unsafe claim acceptances in 600 histories on the earlier lookup. Five low items, including progress lines that never reach live output and an unreproduced index-read race, are boarded for planning. Details: [FINAL-002](FINAL-002.md), [VER-003](../../verifications/WO-186/VER-003.md), [decisions](../../evidence/WO-186/decisions.md), [costs](../../evidence/WO-186/costs.md), [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-05T21:08:33.465Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-107 | 7,947,102 (Δ unavailable) / 3 | 1,048,991 (Δ unavailable) | 3 (Δ unavailable) / 19,066 (Δ unavailable) | 32,030,699 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ unavailable) | 2 (Δ unavailable) |
| WO-062 | 5,453,733 (Δ -2,493,369) / 5 | 930,666 (Δ -118,325) | 3 (Δ 0) / 22,101 (Δ 3,035) | 31,952,166 (Δ -78,533) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 1 (Δ -1) |
| WO-184 | 54,181,702 (Δ 48,727,969) / 5 | 2,212,088 (Δ 1,281,422) | 4 (Δ 1) / 94,960 (Δ 72,859) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -1) |
| WO-185 | 70,773,751 (Δ 16,592,049) / 10 | 8,545,143 (Δ 6,333,055) | 3 (Δ -1) / 30,932 (Δ -64,028) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 4 (Δ 3) | 2 (Δ 2) |
| WO-195 | 20,414,389 (Δ -50,359,362) / 5 | 4,507,949 (Δ -4,037,194) | 4 (Δ 1) / 65,846 (Δ 34,914) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -3) | 5 (Δ 3) |
| WO-186 | 53,235,633 (Δ 32,821,244) / 7 | 20,388,505 (Δ 15,880,556) | 13 (Δ 9) / 163,932 (Δ 98,086) | 331,235,803 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 8 (Δ 7) | 3 (Δ -2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-186/executor | 45,605,007 (29,035,490) | 1,705,867 (unavailable) | 819 (unavailable) | 271,746,217 (unavailable) | 1,168 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-186/verifier | 5,205,955 (3,035,325) | 328,512 (228,097) | 630 (455) | 31,826,855 (5,749,620) | 665 (468) | unavailable (unavailable) / unavailable |
| WO-186/reviewer | 2,424,671 (750,429) | 1,575,113 (1,567,462) | 415 (322) | 27,662,731 (11,442,819) | 668 (567) | unavailable (unavailable) / unavailable |
| WO-186/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-186/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-186/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
