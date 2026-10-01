# WO-181

Until now the behavior verifier was the only judge of a candidate, so a change whose tests pass was never judged for scope or for the repository's declared conventions. This pull request lands WO-181. After behavior verification passes, a separate `review` episode reads the sealed candidate in a fresh process, with no tools and no implementer narrative, and returns typed findings as `ReviewCompleted`. It cannot edit the branch, and only a blocking finding can start a repair.

- **One more episode kind on the existing host.** The driver opens with `reviewConventionsPath` naming an unchanged sealed file, or `null` to record that no conventions are declared. Once every criterion is verified with no attention request, the stream moves to `review` and dispatches a fresh physical episode on WO-054's sealed snapshot and `VerificationHost`. The request carries the contract, the pinned diff, the base and candidate rows and the admitted behavior evaluations. A stream opened without the field keeps the verification-only path, and failed behavior never dispatches a reviewer.
- **Findings under the existing contract.** `VerificationFinding` gains `class: review` with severities `blocking`, `should` and `nit`. `expected` holds the rule and `observed` the violation. Each finding cites a rule source (the contract or the declared conventions file) and an observation source (the diff or a sealed file). `ReviewCompleted` records the findings, their counts and the reviewer, verifier and implementer episode identities; behavior acceptance rows are unchanged.
- **Closed admission.** A result carrying `edits`, `patch`, `diff`, `files` or `replacements` is refused with `review cannot return edits or diff`. So are behavior verdicts, foreign paths, a convention reference when none is declared, and a result produced under a verifier's or implementer's identity. A forged or edited `ReviewCompleted` fails replay.
- **Routing.** `routeReview` gives each blocking finding to the existing `RepairHost` with one round, no new grants and the criterion's named tests, followed by a fresh verifier over the original contract. `should` and `nit` findings become `knownItems` for WO-182's deliverable body and dispatch nothing. A reviewer's attention request, or a blocking finding on a path outside the original surfaces, returns `NeedsHuman`, so a scope finding cannot widen repair authority.

**Operator expansion: new worktrees arrive with their browser.** The operator reported meeting a missing pinned Chromium in every work order, and this order's first full gate reproduced it. Under the operator's scope expansion ([D008](../../evidence/WO-181/decisions.md#wo-181-d008--operator-expansion-prepare-future-worktrees)), `scripts/bootstrap.mjs` now runs the checkout's own Playwright CLI with `install chromium --only-shell` after `npm ci` and before the build, into the cache the browser suite selects. `worktree start` already runs bootstrap before its launch handoff, so a failed install stops there, keeps the checkout and names the retry. An explicit `PLAYWRIGHT_BROWSERS_PATH` is passed through unchanged. Existing worktrees are not retrofitted, and a missing browser still fails the browser suite. This is a separate commit.

**Left to the composition.** WO-123 sequences the episode; here a fixture double stands in for it, and no shipped flow opens a stream with review. Its open seams are recorded for the later orders. The host leaves a failed or timed-out review pending with no `ReviewCompleted`, and no fixture pins what a composition then does; the reviewer does not yet consume WO-124's derived surfaces ([D012](../../evidence/WO-181/decisions.md#wo-181-d012--verification-board-unrecorded-receipt-036-duties)). A behavior verifier that passes every criterion and asks for human attention holds the stream before the reviewer is dispatched; two live Claude verifier attempts did so over the very defects the review exists to judge, and the composition must decide how the two episodes divide that judgment ([D014](../../evidence/WO-181/decisions.md#wo-181-d014--final-review-pass-and-three-seams-the-composition-inherits)).

**Integration.** `main` had moved to WO-103 and WO-102 (`v0.60.2`, `v0.60.3`), which add corpus files and their records and touch nothing under `packages/` or `scripts/`. The branch fast-forwarded with no authored conflict, and `v0.61.0` remains the target ([D013](../../evidence/WO-181/decisions.md#wo-181-d013)).

**Versions and editions.** Application `v0.61.0` is a minor release over `v0.60.3`. `@dotln/compiler` is 0.22.0 and `@dotln/skeleton` 0.49.0; the console stays at 0.4.0 with its exact pins updated, and no dependency was added. The protocol is a registered evidence source and `reactor.ts` a judged feedback source, so the authority, artifact-identity, verification and feedback editions were re-minted as WO-181/002, the last from one live self-host audit on Codex `gpt-6.1-sol` at `max`. The console's self-host case and the Claude Code harness pins were regenerated. To keep `reactor.ts` inside the audit capsule's 100,000-character file bound, the verification state types moved to `verification.ts` and review construction to a new `review.ts` ([D004](../../evidence/WO-181/decisions.md#wo-181-d004)).

**Validation.** `npm test -- --review` passed on the integrated tree at code identity `2022b44f…`: 40 suites, 0 failed, 893.41 s. `npm run test:docs` passes. The live rows on WO-056's synthetic repository, [Codex](../../evidence/WO-181/codex-live-002.json) and [Claude Code](../../evidence/WO-181/claude-live-004.json), each returned both planted blocking findings with their rules, from a reviewer episode distinct from the verifier's and the implementer's, with the snapshot unchanged. The [bootstrap proof](../../evidence/WO-181/bootstrap-live-001.json) launched the pinned Chromium after a cold setup, a cached retry with the download host unreachable and a second worktree on an explicit cache. [VER-001](../../verifications/WO-181/VER-001.md) passed with seven review probes and a real bootstrap failure and retry. [FINAL-001](FINAL-001.md) passed.

**Known limits.**
- **Actors.** The implementer in every review proof is a process double on a synthetic repository. Model and effort are launch selections; effective values are unknown. The Claude row's behavior verifier is a live Codex session, because two Claude verifier attempts asked for human attention before review ([D006](../../evidence/WO-181/decisions.md#wo-181-d006)).
- **Independence.** It is evidenced by host-assigned episode identities on separate fresh processes; native harness session identifiers are not recorded.
- **Judgment.** A structurally valid finding is not proof that the reviewer read the rule correctly.
- **Setup.** A new worktree's first browser download needs a reachable download service unless a prepared cache is selected.
- **Headroom.** `reactor.ts` is 99,655 characters against the 100,000-character bound, so the next order that edits it must free space first.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T17:04:52.983Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-059 | 13,869,681 (Δ unavailable) / 8 | 3,716,930 (Δ unavailable) | 3 (Δ unavailable) / 23,786 (Δ unavailable) | 77,033,040 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-180 | 5,518,304 (Δ -8,351,377) / 3 | 1,695,186 (Δ -2,021,744) | 3 (Δ 0) / 18,410 (Δ -5,376) | 48,716,481 (Δ -28,316,559) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-176 | 41,822,452 (Δ 36,304,148) / 6 | 4,013,405 (Δ 2,318,219) | 4 (Δ 1) / 64,961 (Δ 46,551) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 2) | 3 (Δ 3) |
| WO-103 | 5,080,866 (Δ -36,741,586) / 3 | 1,414,182 (Δ -2,599,223) | 6 (Δ 2) / 89,134 (Δ 24,173) | 38,256,997 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 1 (Δ -2) |
| WO-102 | 6,903,085 (Δ 1,822,219) / 3 | 1,414,302 (Δ 120) | 3 (Δ -3) / 16,084 (Δ -73,050) | 37,366,239 (Δ -890,758) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 0) | 2 (Δ 1) |
| WO-181 | 4,668,402 (Δ -2,234,683) / 2 | 1,788,507 (Δ 374,205) | 4 (Δ 1) / 45,954 (Δ 29,870) | 40,317,429 (Δ 2,951,190) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -1) | 1 (Δ -1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-181/executor | 4,061,124 (1,408,611) | unavailable (unavailable) | unavailable (unavailable) | 26,706,396 (12,981,871) | 172 (50) | unavailable (unavailable) / 1,019 |
| WO-181/verifier | 607,278 (200,373) | 136,434 (118,057) | 62 (25) | 13,521,773 (9,437,924) | 84 (43) | unavailable (unavailable) / unavailable |
| WO-181/reviewer | 8,177 (-3,835,490) | 229,196 (141,714) | 80 (-55) | 89,260 (-19,468,605) | 127 (-45) | unavailable (unavailable) / unavailable |
| WO-181/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-181/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-181/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
