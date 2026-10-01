# WO-182

Product 03 names fourteen conditions for "deliverable-ready" and says no single passing signal is ever done. Until now a target pull request's generated body carried four of them: contract, acceptance matrix, host test outcomes and diff summary. Nothing stated the rest, so a proposal could open over an unreproduced baseline or an unreviewed diff, and the unattended runs that are meant to publish on their own had no readiness rule except the operator. This pull request lands WO-182. `worktree publish WO-NNN --target <request>` now evaluates all fourteen items from the episode store's artifacts and writes them into a `Deliverable-ready` section of the body. Each item is evidenced with a reference, absent with a reason, or not applicable with a reason. `--require-deliverable-ready` refuses before any remote call while an item is absent. An operator publish without the flag still opens the proposal, with its gaps stated in the body, as WO-064 decided.

- **Evaluator.** `deliverableReady(artifacts)` in `scripts/lib/github-body.mjs` is pure over host-read artifacts and accepts no supplied verdicts. It binds every input to the original contract, base and candidate revision. The baseline must be a replayed `BaselineWitnessed` that came before the first worker attempt. The review must be a clear `ReviewCompleted` over the exact sealed diff. Reviewer, verifier and implementer episodes must differ. A story with no visual criteria makes the visual item not applicable, never evidenced.
- **Body.** One result line and a three-column table, rendered through the existing escaping and outward lint, with fixed reference aliases (`commit:`, `source-event:`, `baseline-event:`, `review-event:`, `verification:`, `delivery-preparation#/…`, body anchors) instead of private paths. A passing review's `should` and `nit` findings are listed as known items.
- **Publisher.** The request accepts optional `baselineStore` and `reviewStore`. Every evidence store is replayed through the verification reactor, and a live `host.lock` refuses. The refusal sits after the local Git reads and authority check, before the publication lock, GitHub authentication, push and `gh pr create`.
- **Preparation.** Ambiguity, tests/build/lint and the monitored loop read an optional owner-written `delivery-preparation.json`, bound to the work order, revision, contract hash and diff hash. A malformed file refuses even without the flag. A stale one leaves the three items absent.
- **Write-backs.** One sentence in product 03 §DeliveryAdapter (259 bytes), the README's target-publication paragraph, D001–D006 in the [decisions](../../evidence/WO-182/decisions.md), and the WO-112 and WO-118 catalog rows naming the flag.

**Integration and version.** The order was executed on `v0.61.2` (`1d00bc58`) and integrated over WO-177 (`v0.61.3`, `855450ea`) with no authored conflict. Upstream touched none of this order's sources, so the judged bytes are unchanged ([D005](../../evidence/WO-182/decisions.md#wo-182-d005)). Application `v0.62.0` is a minor release. No component version, dependency or evidence edition changes.

**Validation.** `npm test -- --review` passed on the integrated tree: 34 suites, 0 failed, 903.77 s, 79 fresh tasks, at code identity `31d606746f81248b1ab29e4b7216091e1fe7f1362cf41b605d3f2038a3b14257`. `npm run test:docs` passes. [VER-001](../../verifications/WO-182/VER-001.md) passed. It resolved all 21 references in a replayed publication against the real fixture stores, and turned 24 further mutations into absent rows with no false `evidenced`. [FINAL-001](FINAL-001.md) passed on the integrated tree.

**Known limits** ([D006](../../evidence/WO-182/decisions.md#wo-182-d006--final-review-pass-and-two-seams-the-required-runs-inherit)).
- **No preparation producer yet.** Nothing writes `delivery-preparation.json`, so a run with the flag refuses on ambiguity, tests/build/lint and the monitored loop until one does. Tests/build/lint has no not-applicable route. D006's follow-up asks planning to name the producer before WO-123 activates.
- **Repeat publish.** A flagged publish of a head already opened without the flag returns the recorded pull request with exit 0 and evaluates nothing.
- **Visual path.** All fourteen evidenced, visual included, is shown on the pure fixture only. The replayed stores reach thirteen plus visual not applicable.
- **Body text.** Every target body now carries the section. A private local-terms list containing one of its ordinary words ("baseline", "review", "lint") makes every target publish refuse at the lint.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T21:03:41.761Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-102 | 6,903,085 (Δ unavailable) / 3 | 1,414,302 (Δ unavailable) | 3 (Δ unavailable) / 16,084 (Δ unavailable) | 37,366,239 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ unavailable) | 2 (Δ unavailable) |
| WO-181 | 6,364,541 (Δ -538,544) / 3 | 1,788,507 (Δ 374,205) | 4 (Δ 1) / 45,954 (Δ 29,870) | 40,317,429 (Δ 2,951,190) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -1) | 1 (Δ -1) |
| WO-105 | 9,351,472 (Δ 2,986,931) / 3 | 4,580,821 (Δ 2,792,314) | 3 (Δ -1) / 19,100 (Δ -26,854) | 44,067,562 (Δ 3,750,133) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 3 (Δ 2) |
| WO-178 | 12,691,894 (Δ 3,340,422) / 6 | 2,740,715 (Δ -1,840,106) | 4 (Δ 1) / 87,371 (Δ 68,271) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -3) |
| WO-177 | 2,898,257 (Δ -9,793,637) / 3 | 421,171 (Δ -2,319,544) | 4 (Δ 0) / 36,300 (Δ -51,071) | 14,343,231 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-182 | 4,276,485 (Δ 1,378,228) / 2 | 1,677,566 (Δ 1,256,395) | 3 (Δ -1) / 16,668 (Δ -19,632) | 18,764,996 (Δ 4,421,765) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-182/executor | 3,065,923 (1,282,102) | unavailable (unavailable) | unavailable (unavailable) | 7,386,988 (821,408) | 60 (13) | unavailable (unavailable) / 1,019 |
| WO-182/verifier | 1,210,562 (656,649) | 41,030 (31,294) | 69 (0) | 11,294,859 (3,601,035) | 82 (8) | unavailable (unavailable) / unavailable |
| WO-182/reviewer | 8,621 (-551,902) | 14,058 (12,987) | 38 (-14) | 83,149 (-678) | 41 (-14) | unavailable (unavailable) / unavailable |
| WO-182/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-182/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-182/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
