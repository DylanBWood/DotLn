# WO-174

A reused or publication-bound `npm test` row is keyed by a code identity that leaves out documentation and control records, so reports can be written without rerunning the gate. Product suites read those files anyway. REVIEW-004 changed one bold term in product 02: the identity stayed the same, a kernel case turned red, and no gate would have run it. It also found that `npm test -- --review` passed a mutant of `scripts/harness.mjs`, because the only suite that executes that script did not declare it. This pull request lands WO-174. It closes both gaps without changing the identity, the reuse rule or selection by declared sources.

- **Cases that read documentation run in the document gate.** The four product package tasks (kernel, compiler, console and skeleton) run under a read guard. It is a preload that records which tracked files each case reads through `node:fs`: the sync, promise and callback forms of `readFile`, `open` and `readdir`. It also records Node children that keep its options. A case outside the `[document]` tag that reads a path the identity excludes fails the task, and the output names the case and the path. The 43 existing cases that did so now carry the tag and run in `npm run test:docs`, which every handoff runs fresh: kernel 2, skeleton 22, console 19. Kernel gains a `kernel-docs` task. Compiler read nothing excluded and gains none. No assertion changed.
- **Review selects every suite that runs a changed script.** A runner fixture checks that each machinery suite's declared sources cover three things: its entry file, its direct relative imports and the first-party scripts it names by literal path. An exclusion with a written reason also counts. Seventy-three missing inputs were declared. Among them is `scripts/harness.mjs` for `harness-fixtures`, which now selects and fails on the REVIEW-004 mutant. Four shared helpers are excluded with reasons. Transitive imports and paths built at run time stay outside the check, and its output says so.
- **Fixtures load lazily.** The console test fixtures and the skeleton's historical receipt tools load inside their tagged cases, so importing a product test file reads nothing excluded. The console fixture generator reads the manifest when it runs and validates a newly pinned draft before writing it. Two new `[document]` regressions cover that.

**Cost.** A change to `scripts/harness.mjs` now also selects `harness-fixtures` and `process-debt` under `--review`. In the executor's measurement that adds about 500 s of suite time to such a review. The executor recorded the two exclusions that would remove it and why neither is applied. The document gate took 16 s before and 36 s after. The product review gate took 402 s before and 396 s after. The guard added 0.25 s to one paired console run.

**Validation.** `npm test -- --review` passed fresh on the tree integrated with `main` (32 suites, 0 failed), with zero excluded reads in each guarded package, and `npm run test:docs` passes. [VER-001](../../verifications/WO-174/VER-001.md) reproduced the guard fixture against the old runner and the documentation and harness drills. It failed the first subject on a missed consumer of a removed fixture export. [VER-002](../../verifications/WO-174/VER-002.md) verified the repair, including the integration suite on a committed copy. [FINAL-001](FINAL-001.md) records this review, the integration with `main` and the register dispositions.

**Known limits.** The guard sees Node file reads only, not reads by Git, shells or a Node child that drops its options. Product script suites outside the four package tasks are not guarded, and some read excluded inputs ([D013](../../evidence/WO-174/decisions.md#wo-174-d013)). The integration fixture still takes console files from the committed revision ([D014](../../evidence/WO-174/decisions.md#wo-174-d014)). Guard logs accumulate in ignored local storage. The cost increase above crosses the 120 s reopening figure the planning pass adopted. Each limit has a follow-up in the [decisions](../../evidence/WO-174/decisions.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-30T20:53:51.531Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-172 | 55,766,398 (Δ unavailable) / 11 | 4,036,347 (Δ unavailable) | 3 (Δ unavailable) / 28,017 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 6 (Δ unavailable) | 15 (Δ unavailable) |
| WO-087 | 5,168,783 (Δ -50,597,615) / 3 | 376,615 (Δ -3,659,732) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 13,325,126 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -6) | 1 (Δ -14) |
| WO-057 | 4,030,373 (Δ -1,138,410) / 3 | 409,734 (Δ 33,119) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 4,032,819 (Δ -9,292,307) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ -1) |
| WO-066 | 9,373,182 (Δ 5,342,809) / 3 | 1,378,543 (Δ 968,809) | 4 (Δ unavailable) / 53,758 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-058 | 5,014,086 (Δ -4,359,096) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-174 | 12,341,751 (Δ 7,327,665) / 4 | 2,384,620 (Δ unavailable) | 4 (Δ unavailable) / 59,879 (Δ unavailable) | 50,171,251 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-174/executor | 9,019,958 (5,991,312) | unavailable (unavailable) | unavailable (unavailable) | 21,788,938 (unavailable) | 157 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-174/verifier | 3,321,793 (2,399,443) | 71,163 (unavailable) | 161 (unavailable) | 28,247,978 (unavailable) | 190 (unavailable) | unavailable (unavailable) / unavailable |
| WO-174/reviewer | 10,858 (-1,052,232) | 47,377 (unavailable) | 45 (unavailable) | 134,335 (unavailable) | 47 (unavailable) | unavailable (unavailable) / unavailable |
| WO-174/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-174/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-174/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
