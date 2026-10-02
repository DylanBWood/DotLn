# WO-179

The operator kept correcting the roles on the same few things: asking a routine question instead of settling it, acting on a misread aim, claiming a cause from a partial search, handing the operator a command to run, polling a running gate, rerunning a gate already green at the same code, and retrying past a provider refusal. WO-172's survey traced each of these to a theme and its episodes. This pull request lands WO-179. Those corrections are now in the text every role reads at cold start, in both harnesses. The verify and final-review briefings carry three more rules. And a verifier no longer reruns a product gate the executor already recorded green at the same code identity.

- **Ten shared rules in every role.** Settle routine version, waiver, regeneration and reinstall questions within authority. State the reading of an operator message's aim before acting. Name the command and output behind a claim, and the boundary of a partial search. Request authority through the host flow. Give the operator copy-paste-runnable commands and purposeful questions. Answer a stale gate row by running the gate, never by rewinding bytes. Stop owned monitors before recording a result. Stop after a second consecutive provider safeguard refusal. Wait on a gate through its completion signal, never by polling. Name the source tried before writing `unknown`. Each rule's theme and episode IDs are in [D003](../../evidence/WO-179/decisions.md#wo-179-d003).
- **Briefings.** Verify and final review now say three things. A repairable defect inside the order's declared surfaces is repaired in the order and may fail a criterion it breaks, while one outside both criteria and surfaces is boarded. A question, complaint or stale operator message does not stop, narrow or widen the work. A met criterion that names `npm test` or `npm run test:docs` stands on that gate's row or an inline run.
- **Verifier consumes the gate row.** The verifier's unconditional product-gate step is gone. It consumes the executor's passing `npm test` row when the code identity matches and runs the gate only to reproduce a finding or on a changed identity. The reviewer keeps its gate.
- **A met gate claim needs its row.** `verification-result` now applies WO-173's claim check, through the same criterion-to-gate mapping the executor's completion uses. A report that judges an `npm test` criterion met with no passing row at the subject refuses and names the criterion. A `test:docs` claim runs the document gate inline.
- **Release close and executor.** Release close reports a cleanup blocker or host denial once, with the exact remedy (`--material`, `!` or a `/permissions` retry). It then finishes what remains without repeating publication or deciding on material by itself. The executor declares each scratch repository it creates with `npm run worktree -- material`.
- **Write-backs.** Product 07 §Discipline gains the repair boundary and the routine-question rule in place (355 bytes). Release close's cold start grew to 17,170 bytes, and its ceiling is raised to 21,266 under the standing route, with the rules named. The six register rows the survey routed here are settled.

**Version.** Integrated over `v0.63.0` (`aa770898`), so application `v0.63.1` is a patch. Skeleton goes from 0.49.1 to 0.49.2 and harness runtime from 0.34.1 to 0.34.2, and the console's skeleton pin follows. The authority evidence edition is re-minted on the integrated source as WO-179 revision 002. No dependency is added.

**Validation.** `npm test -- --review` passed on the integrated tree: 39 suites, 0 failed, 897.62 s, at code identity `005044189e4dd3c32a56b5547f021f6c022cc77777d41089b25198bafa8df6b4`. `npm run test:docs` passes. [VER-001](../../verifications/WO-179/VER-001.md) failed because the compact release-close projection dropped eight shared rules and the remedy. The repair added a test over every emitted role, and [VER-002](../../verifications/WO-179/VER-002.md) passed and showed that the test catches that omission. [FINAL-001](FINAL-001.md) passed after integrating main, re-minting the authority edition and rerunning the claim-check fixture, with its negative control against `b51a58a8`, on the integrated tree.

**Known limits.**
- The rules are instructions. Only the `verification-result` claim check enforces anything, and whether the operator's interventions on these themes fall is not yet measured.
- A worktree's review selection is computed against the moving `origin/main`, so a sibling's merge can demand a full review rerun at an unchanged identity. That happened twice in this order. It is boarded as [D015](../../evidence/WO-179/decisions.md#wo-179-d015--verification-a-siblings-merge-widens-the-review-selection-at-an-unchanged-identity) for the next order that edits the runner's selection.
- The verifier role no longer carries the host-confinement fallback text; the runner prints the confined command itself.
- Every role's cold start grew by 1,082 to 1,585 bytes over `v0.63.0`. That is the order's declared cost, recorded with its reopening condition in [D017](../../evidence/WO-179/decisions.md#wo-179-d017--final-review).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T23:43:32.080Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-105 | 9,351,472 (Δ unavailable) / 3 | 4,580,821 (Δ unavailable) | 3 (Δ unavailable) / 19,100 (Δ unavailable) | 44,067,562 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 3 (Δ unavailable) |
| WO-178 | 12,691,894 (Δ 3,340,422) / 6 | 2,740,715 (Δ -1,840,106) | 4 (Δ 1) / 87,371 (Δ 68,271) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -3) |
| WO-177 | 2,898,257 (Δ -9,793,637) / 3 | 421,171 (Δ -2,319,544) | 4 (Δ 0) / 36,300 (Δ -51,071) | 14,343,231 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-182 | 5,812,601 (Δ 2,914,344) / 3 | 1,677,566 (Δ 1,256,395) | 3 (Δ -1) / 16,668 (Δ -19,632) | 18,764,996 (Δ 4,421,765) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-061 | 5,072,289 (Δ -740,312) / 3 | 838,316 (Δ -839,250) | 4 (Δ 1) / 40,444 (Δ 23,776) | 24,874,201 (Δ 6,109,205) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-179 | 9,807,467 (Δ 4,735,178) / 4 | 3,400,549 (Δ 2,562,233) | 4 (Δ 0) / 75,390 (Δ 34,946) | 40,662,068 (Δ 15,787,867) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-179/executor | 8,112,374 (4,315,259) | unavailable (unavailable) | unavailable (unavailable) | 22,873,818 (10,776,250) | 193 (116) | unavailable (unavailable) / 1,019 |
| WO-179/verifier | 1,695,093 (1,248,280) | 68,154 (6,640) | 126 (83) | 17,702,840 (10,980,811) | 136 (82) | unavailable (unavailable) / unavailable |
| WO-179/reviewer | 7,928 (-820,433) | unavailable (unavailable) | 33 (-24) | 85,410 (-5,969,194) | 35 (-25) | unavailable (unavailable) / unavailable |
| WO-179/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-179/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-179/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
