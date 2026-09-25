# WO-158

Until now a session that met a situation the lifecycle had no route for improvised one. Records were corrected by hand after their event, `operator override:` was used with no record, and operator-owned steps were waived in prose. WO-111's criterion was amended, restored and left with an orphaned amendment row, with receipts still reading "no operator exception recorded". The 2026-09-25 planning catalog found these across 101 orders.

This pull request lands WO-158: four typed control events, each with its own `resume` command. Each command is refused outside its legal phases, and each event shows in `status --json`, `current.md` and the work-order index.

- **`waive`** records the operator's acceptance of an unmet criterion against a hash-bound capture of the operator's words. The order's own executor cannot record one.
- **`withdraw`** moves an order to a new terminal `withdrawn` phase (failed, superseded or abandoned) that claims no success. The index lists it under Closed, the sequence settles it like a closed order, and a typed dependency on it reads `unmet: withdrawn`.
- **`correct`** fixes a wrong attestation field, report path or checkpoint reference. It refuses a verdict and moves a report path only to the same bytes the verdict judged.
- **`override-record`** is appended by Claude's session hook when the operator types `operator override: off`, or printed as a command where the hook cannot run it.

A verification or final review records a waived criterion as `unmet, waived by K`, where K is the waiver event's ordinal, and both result transitions refuse a pass over an unwaived unmet criterion.

While an `npm test` gate is live, a fixed read-only list is now admitted stage by stage: `cat`, `head`, `tail`, `wc`, `ls`, `grep`, print-only `sed -n`, no-pager Git reads, and the writer and status helpers. Anything that redirects, chains a write or is unlisted is still refused, and the refusal names the list.

**What a reviewer should know.**

- **A withdrawal reaches `main` only by an operator merge.** `worktree publish` still requires a closed order ([D005](docs/evidence/WO-158/decisions.md#wo-158-d005), `FUP-3a0c4ea52f8d6d08`).
- **The executor refusal on `waive` is weaker under Codex,** which has no hook-made writer reservation. Removing the session variable from the command records the waiver with `recordingSession.role: unobserved` instead of refusing it.
- **The `CLAUDE_EFFORT` disagreement refusal applies only to the `claude-code` harness spelling.**
- **`current.md` shows a withdrawn order only on that order's own branch.** The last three items are recorded in [D029](docs/evidence/WO-158/decisions.md#wo-158-d029) (`FUP-7b4b41e2875f852d`).
- **A granted outside-write root swapped for a symlink carries the grant to its target.** WO-144's session scratch already had this class, and the new `host-scratchpad` root inherits it.
- **Repository hooks and `%G` pretty formats are not screened by the configured-program check.** This item and the symlink swap are recorded in [D028](docs/evidence/WO-158/decisions.md#wo-158-d028) (`FUP-6996e331536d4389`).
- **`git --no-pager status` under a configured fsmonitor is still admitted,** through the WO-142 metadata vocabulary (`FUP-9e2be6bfac0708fe`).
- **The operator directed the `host-scratchpad` grant** for the one scratchpad Claude Code prints per session ([D010](docs/evidence/WO-158/decisions.md#wo-158-d010)).
- **Not exercised:** Copilot and Codex hosts were not tested live, and no live episode was run.

**How the review went.** [VER-001](docs/verifications/WO-158/VER-001.md) failed four reproduced defects; the [repair](docs/evidence/WO-158/repair.md) fixed each with a regression, and [VER-002](docs/verifications/WO-158/VER-002.md) passed. [FINAL-001](docs/final-reviews/WO-158/FINAL-001.md) integrated WO-159 and retimed the skeleton to `0.42.0` after `v0.48.0` published `0.41.0` ([D026](docs/evidence/WO-158/decisions.md#wo-158-d026)). It then failed on a loop the pager repair had introduced: a second Git prefix token, as in the documented `git --no-pager --no-optional-locks`, hung every live-gate hook. [Repair 002](docs/evidence/WO-158/repair-002.md) fixed it in one line ([D030](docs/evidence/WO-158/decisions.md#wo-158-d030)), and [VER-003](docs/verifications/WO-158/VER-003.md) passed. [FINAL-002](docs/final-reviews/WO-158/FINAL-002.md) passed with its own probe of the built classifier and the product gate.

**Validation.** The reviewer's `npm test -- --review` on the staged tree passed **40 suites, 0 failed, 569.53 s, 84 fresh tasks, exit 0**, with no sandbox in force. It ran on tree `9bc23a93784bba406f381e096d47aa66f0aad87d` at code identity `50f0c0565cad8d08212c08f30db6b5e43a3ff58d0f8fcf9c65aa5ae54c578f41`, and that row binds the released bytes. The reviewer's classifier probe ran 1,062,930 Git command spellings against the installed runtime. Each returned within 0.4 ms, and none disagreed with the admission rule. `harness check` (31 surfaces), the cold-start check (every ceiling held; reviewer 23,780 of 24,576), `publication:check`, `plan check`, `release check-surfaces --local` (44 PASS) and the four edition checks all pass. `git diff --check` is clean. The lockfile changes only the two component versions and their pins, so no dependency was added.

This prepares application `v0.49.0` as a minor release over `v0.48.0` (`0c727915`). `@dotln/compiler` moves `0.18.0` → `0.19.0` and `@dotln/skeleton` `0.41.0` → `0.42.0`; kernel and console versions are unchanged. `docs/evidence/current.json` selects authority `WO-158/004`, artifact identity and verification `WO-158/001`, and feedback `WO-158/002`, which carries WO-159's live audit.

Full evidence: [decisions D001 to D030](docs/evidence/WO-158/decisions.md), the two repair records, the three verification reports, both final reviews and [the order](docs/work-orders/WO-158-lifecycle-off-ramps.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-25T16:16:53.799Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-155 | 3,673,185 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-156 | 6,375,647 (Δ 2,702,462) / 7 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-114 | 9,819,246 (Δ 3,443,599) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-111 | 13,529,831 (Δ 3,710,585) / 7 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-159 | 9,710,838 (Δ -3,818,993) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-158 | 15,374,942 (Δ 5,664,104) / 7 | 2,765,877 (Δ unavailable) | 0 (Δ unavailable) / 0 (Δ unavailable) | 182,244,789 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ 2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-158/executor | 11,107,832 (4,663,553) | 163,736 (unavailable) | 1,337 (unavailable) | 126,624,552 (unavailable) | 1,380 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-158/verifier | 2,506,626 (1,305,548) | 33,271 (unavailable) | 87 (unavailable) | 22,204,713 (unavailable) | 102 (unavailable) | unavailable (unavailable) / unavailable |
| WO-158/reviewer | 1,760,484 (-304,997) | 212,102 (unavailable) | 347 (unavailable) | 33,415,524 (unavailable) | 397 (unavailable) | unavailable (unavailable) / unavailable |
| WO-158/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-158/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-158/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
