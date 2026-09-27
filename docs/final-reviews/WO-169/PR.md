# WO-169

A follow-up deferred until "the next order that edits" a file was never shown to that order. The 2026-09-27 planning pass counted four such seams opened by nine closed orders, with each row still at its deferral. Planning passes also read the register through throwaway scripts because the feed pages at eight rows and clips reasons, and they disposed rows one request file and one revision at a time. Separately, the integrate helper printed `Regenerated:` lines over a tree that still held conflict markers, nine integration records carry a doubled full stop, a script change could reach `main` without selecting the suite that scans scripts, and the meter called an unset ceiling "unavailable".

This pull request lands WO-169. A pending row that names a changed file or the active order is now counted for the executor at completion and listed by one command for the planner and the final review. The register can be exported whole and disposed in one batch, integration generates only once authored conflicts are staged, a changed script selects the suite that scans scripts, and the meter calls an unset ceiling unset.

- **`npm run plan -- followups --touching`, given paths or `WO-NNN` identifiers or nothing.** It lists the pending rows whose source text, decision `followup` or `reopenWhen`, or latest disposition names a given or changed path, a trailing part of it, or an order. With no argument it reads the worktree's changes against the merge base with `main` (committed, deleted, both names of a renamed file, untracked) and the active order. It is a textual match and says so. Rows keep the feed's shape and 8 KB page and add the terms that matched.
- **One completion advisory.** `implementation-ready` and `repair-complete` print the count, the command and the rule: fix a row inside the Boy Scout bound or record it as left, never widen the order; the final review disposes each listed row through the feed. It reads the register without a lock or a write and never refuses a completion.
- **`followups --export FILE [--all]`.** It writes every pending row whole, with its disposition history, to a file under the system temporary directory or the ignored local control lane, and prints only counts, revision and path. The ordinary feed pages are unchanged.
- **`followups --apply` takes an array.** The requests share one expected revision and apply in order under one lock, each judged against the state the earlier ones leave. The register is written once, and a refusal names the request's index and writes nothing. The single-request form is unchanged.
- **`worktree integrate` waits for authored conflicts.** While an unmerged path or an untracked stash collision remains, it prints the conflicts and one pending line, and runs no generator, checks list or stub until `--continue`. The decision stub writes the release message as one line with one full stop.
- **`scripts/` is the configuration-root suite's declared source**, so `npm test -- --review` selects it for any changed script. The suite takes about 2.8 s.
- **The meter's drift rows read `ceiling unset`** for a role with no ceiling.

**What a reviewer should know.**

- **The match is textual.** On this order's own diff it returned 16 rows, four of them false matches on a shared document name or a generated projection. A row that names its seam in other words is missed; D009's replay missed three meter rows for WO-160 that name release preparation in prose ([D002](../../evidence/WO-169/decisions.md#wo-169-d002--the-match-is-textual-and-aligned-on-path-components), [D009](../../evidence/WO-169/decisions.md#wo-169-d009--the-replay-receipt-032-asked-for)).
- **Four minor edges are boarded, not fixed** ([D014](../../evidence/WO-169/decisions.md#wo-169-d014--final-review-board-three-minor-feed-defects-and-correct-one-limit-claim)). A relative link (`../product/03-architecture.md`) is not matched on the full path. Without `main` the advisory's command refuses. An export can create a missing reserved lane file such as `terms.txt`, which a linked worktree's lane lacks. The other-checkout test ignores git's exit status. D014 also corrects D002's claim that no register row holds a relative link.
- **Untracked scripts select no machinery suite until staged** ([D007](../../evidence/WO-169/decisions.md#wo-169-d007--the-configuration-root-suite-declares-scripts)). This gap predates the order; the reviewer's gate stages new source first.
- **A 500-term explicit `--touching` query overflows the page** ([D012](../../evidence/WO-169/decisions.md#wo-169-d012--board-a-large-touching-querys-page-limit)). Split the terms.

**How the review went.** A Claude Code executor implemented the order with nine read-only helpers and fixed eighteen of their findings before handoff (D001 to D011). [VER-001](../../verifications/WO-169/VER-001.md), run in Codex, passed all eight criteria, boarded the page overflow (D012) and preserved a red plain gate row where the unchanged WO-143 resident matrix hit its deadline (D013). [FINAL-001](FINAL-001.md) ran each new feed form live on this worktree's register. It exported 134 pending rows with the feed pages byte-identical before and after, refused two ungranted destinations, and disposed the sixteen rows its own `--touching` run returned in one batch under one revision, following the executor's proposal wherever D011 made one. Two read-only reviewers found no blocking or major defect. The reviewer ran `npm run test:docs` five times where two would have done, rerunning a failed gate to read output it had truncated and rerunning a passing gate after each small record edit; [D015](../../evidence/WO-169/decisions.md#wo-169-d015--the-final-review-ran-the-document-gate-five-times-where-two-would-have-done) records the runs and completes FINAL-001's account of them.

**Validation.** The reviewer's `npm test -- --review` on the staged subject passed **34 passed, 0 failed, 398.07 s, 78 fresh tasks, exit 0** at code identity `0aaf8b4ce119c3702d64dd04a9479d698ade3b33a4ec8bf15eed31bca4e3374c`, the identity VER-001 judged, and that row binds the released bytes. `npm run test:docs` passed after the review records were written; `harness check` passes with 31 generated surfaces; `publication:check`, `release check-surfaces --local` and `meta --check` pass. `git diff --check` is clean, no dependency is added and the diff adds no suppression.

This prepares application `v0.52.4` as a patch over `v0.52.3` (`4c34b332`), the classification the order declared. No package source changes, so no component version moves and no evidence edition is re-minted.

Full evidence: [decisions D001 to D015](../../evidence/WO-169/decisions.md), the [implementation record](../../evidence/WO-169/README.md), the [fixture transcripts](../../evidence/WO-169/fixtures.txt), the [replay](../../evidence/WO-169/touching-replay.json), [VER-001](../../verifications/WO-169/VER-001.md), the [final review](FINAL-001.md) and [the order](../../work-orders/WO-169-followups-reach-their-seam.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-27T14:44:59.233Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-070 | 8,380,589 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-115 | 22,293,818 (Δ 13,913,229) / 15 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-165 | 6,509,729 (Δ -15,784,089) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-085 | 13,343,986 (Δ 6,834,257) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-166 | 12,280,995 (Δ -1,062,991) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-169 | 6,682,061 (Δ -5,598,934) / 2 | 1,973,797 (Δ unavailable) | 3 (Δ unavailable) / 68,213 (Δ unavailable) | 107,051,970 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ 1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-169/executor | 5,160,519 (-253,269) | 1,585,034 (unavailable) | 610 (unavailable) | 80,784,378 (unavailable) | 1,015 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-169/verifier | 1,521,542 (-3,978,596) | unavailable (unavailable) | unavailable (unavailable) | 12,928,855 (unavailable) | 98 (unavailable) | unavailable (unavailable) / unavailable |
| WO-169/reviewer | 1,318,203 (-48,866) | 112,509 (unavailable) | 186 (unavailable) | 13,338,737 (unavailable) | 212 (unavailable) | unavailable (unavailable) / unavailable |
| WO-169/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-169/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-169/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
