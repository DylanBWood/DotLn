# WO-185

On 2026-10-01 a probe over the corpus tests grew until the host ran out of memory. It stopped only when an agent in another worktree noticed and killed its processes. With this change, every process tree a DotLn session or gate starts runs under a memory budget measured as physical footprint, so memory held outside the heap and compressed memory both count. A tree that crosses its budget has its process group killed and is recorded as a typed `memory-budget` stop naming the process, the budget and the measured peak.

**Budgets.** A task may use one quarter of physical memory, a gate one half, and all DotLn-attributed trees together two thirds. The figures live in `docs/control/budgets.json` beside the measured peaks they rest on, and each budget is more than eleven times its peak.

**Guard.** Each role dispatch registers its agent session with one guard per user on the host, shared by all clones and worktrees. The guard stops what the runner never sees, such as a bare command an agent starts.

**Runner.** Each gate row records every task's peak footprint and the gate's. On an interrupt, termination or hang-up, the runner kills its task groups and records no row. A detached descendant that outlives its task is named and killed, and captured output keeps a bounded tail with the dropped byte count.

**Shared lanes.** Gates in every worktree and clone on the host share four lanes. A gate that has to wait prints whom it is waiting for.

**Probes.** `node scripts/harness.mjs bounded --`, followed by a command, runs that command with its arguments, environment and exit status unchanged, under the task budget. Every role is now told to run probes that way, one at a time.

**Corpus tests.** The `wo102` tests compare findings through a bounded helper: the total, the first 32 findings and a digest. With one planted drift, each file now fails in 3 to 4 s at under 300 MB of footprint.

**Read before merging.** The footprint census is a small native helper, compiled on first use, so a C compiler is required. It is exercised only on macOS. Sampling runs every second and takes a full footprint census every four seconds, so at the 2026-10-01 growth rate a tree can overshoot by a nominal 3.4 to 13.6 GiB before it is stopped. Supervision is not absolute containment: a process that drops every inherited mark before any observed ancestry edge can still escape (FUP-d0a9719cc2e4ec55). A guard already running keeps its starting code until it retires (FUP-c1a89d52cc314af9). Gates that used to overlap now wait for lanes. The skeleton moves to 0.52.1, and no dependency is added.

**Validation.** A fresh `npm test -- --review` at the reviewed subject passed 40 of 40 suites with 85 tasks in 852 s, and `npm run test:docs` passes. The final review reran FINAL-001's ledger-failure driver and wrapper commands and the planted drift, and the gate ran the nonfinite round-trip fixture; each behaved as its rule requires. Two verifications failed before VER-003 and VER-004 passed, and FINAL-001 failed before this review passed. Five low-severity bookkeeping items stay recorded with a follow-up. Details: [FINAL-002](FINAL-002.md), [VER-004](../../verifications/WO-185/VER-004.md), [decisions](../../evidence/WO-185/decisions.md), [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-04T14:22:54.086Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-179 | 11,332,268 (Δ unavailable) / 5 | 3,400,549 (Δ unavailable) | 4 (Δ unavailable) / 75,390 (Δ unavailable) | 40,662,068 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ unavailable) | 0 (Δ unavailable) |
| WO-124 | 3,692,949 (Δ -7,639,319) / 3 | 446,025 (Δ -2,954,524) | 3 (Δ -1) / 13,211 (Δ -62,179) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 2) | 0 (Δ 0) |
| WO-107 | 7,947,102 (Δ 4,254,153) / 3 | 1,048,991 (Δ 602,966) | 3 (Δ 0) / 19,066 (Δ 5,855) | 32,030,699 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -2) | 2 (Δ 2) |
| WO-062 | 5,453,733 (Δ -2,493,369) / 5 | 930,666 (Δ -118,325) | 3 (Δ 0) / 22,101 (Δ 3,035) | 31,952,166 (Δ -78,533) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 1 (Δ -1) |
| WO-184 | 54,181,702 (Δ 48,727,969) / 5 | 2,212,088 (Δ 1,281,422) | 4 (Δ 1) / 94,960 (Δ 72,859) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -1) |
| WO-185 | 68,967,543 (Δ 14,785,841) / 9 | 8,545,143 (Δ 6,333,055) | 3 (Δ -1) / 30,932 (Δ -64,028) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 4 (Δ 3) | 2 (Δ 2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-185/executor | 62,109,557 (13,643,535) | 400,295 (unavailable) | 214 (unavailable) | unavailable (unavailable) | 302 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-185/verifier | 5,341,667 (1,886,881) | 218,071 (-1,034) | 359 (-59) | 44,951,474 (33,460,166) | 400 (-70) | unavailable (unavailable) / unavailable |
| WO-185/reviewer | 1,516,319 (-744,575) | 302,371 (unavailable) | 335 (unavailable) | 27,066,048 (unavailable) | 383 (unavailable) | unavailable (unavailable) / unavailable |
| WO-185/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-185/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-185/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
