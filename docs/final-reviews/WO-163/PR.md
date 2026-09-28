# WO-163

The top level of `scripts/` held three files that looked runnable but were only imported, and the library held one file with a command block. The tree also kept three planning inputs that nothing read. The follow-up register, about 1.7 MB of generated JSON, looked hand-written in diffs. And an evidence tool's `--check` had failed on every tree since 2026-09-10. Each was kept only because no one had decided otherwise.

This pull request lands WO-163, the first launchpad Sort and Set in order. Each item now leaves or changes through a recorded decision.

- **Three import-only scripts move into `scripts/lib/`.** `github-body.mjs` and `github-repository.mjs` move unchanged. `release-notes.mjs` changes only its configuration import. Five importers and four test fixtures follow. The release-note pattern in `scripts/release.mjs` matches both the old and new paths, so a published manifest spanning the move re-derives the note it recorded ([D002](../../evidence/WO-163/decisions.md#wo-163-d002--the-move-nine-files-follow-three-and-the-release-note-pattern-keeps-both-spellings)).
- **The library's command block becomes an entry point.** `scripts/test-release.sh` ran the block at four sites, so it moved, byte for byte, to `scripts/release-fixtures.mjs`, and the runner's `runner-fixtures` sources name it ([D003](../../evidence/WO-163/decisions.md#wo-163-d003--the-librarys-command-block-is-run-so-it-becomes-an-entry-point)).
- **Three one-shot planning inputs retire.** Each decision names the receipt that carries its entries, and Git history keeps the bytes. One live link in the work-order map was rewritten first ([D004](../../evidence/WO-163/decisions.md#wo-163-d004--three-one-shot-planning-inputs-retire-and-one-live-link-is-rewritten-first)).
- **The follow-up register is marked `dotln-generated`.** Its textual diff stays readable ([D006](../../evidence/WO-163/decisions.md#wo-163-d006--the-register-is-marked-generated-and-the-mark-does-not-show-in-a-diff-stat)).
- **The WO-042 mutation reproduction is kept as a historical record.** Its `--check` now verifies the record against itself and that the recorded killing-test titles occur in package test source, and it says that this is lexical presence, not active coverage. `--write` is retired, and the transcript and summary keep WO-042's bytes. This closes WO-142 D008 ([D008](../../evidence/WO-163/decisions.md#wo-163-d008--the-wo-042-mutation-reproduction-is-kept-as-a-historical-record), [D017](../../evidence/WO-163/decisions.md#wo-163-d017--repair-the-links-and-state-the-historical-checks-actual-guarantee)).
- **WO-099 D007 needed no new episode.** WO-099-D010 had already discharged it on 2026-09-20, and its register row was settled the next day ([D007](../../evidence/WO-163/decisions.md#wo-163-d007--wo-099-d007-was-discharged-on-2026-09-20-no-episode-is-run)).

**What a reviewer should know.**

- **Criterion 4 is unmet, waived by the operator at ordinal 6.** `git check-attr` reports the attribute set, but native `git diff --stat` does not annotate a custom attribute, and the planning receipt forbids a diff-disabling one. The operator waived that clause and kept readable textual diffs ([D018](../../evidence/WO-163/decisions.md#wo-163-d018--criterion-4-needs-an-authorized-off-ramp)).
- **WO-162 must fix one import when it integrates after this.** WO-162 adds `import … from "./lib/git.mjs"` to `scripts/github-repository.mjs`. After this rename, Git carries that line into `scripts/lib/github-repository.mjs` without a conflict, where it must read `./git.mjs`, or `scripts/worktree.mjs` and `scripts/release.mjs` stop loading. On 2026-09-28 D011 counted nine other script paths both orders edit ([D011](../../evidence/WO-163/decisions.md#wo-163-d011--boarded-the-sibling-order-edits-ten-of-the-same-scripts-one-of-them-a-file-this-order-moves), `FUP-7932ccddcde95d4f`).
- **Three links in closed WO-030 evidence now point into `scripts/lib/`.** A dated note beside the table says so, and the table keeps its historical labels and counts. The document baseline is unchanged ([D017](../../evidence/WO-163/decisions.md#wo-163-d017--repair-the-links-and-state-the-historical-checks-actual-guarantee)).
- **The release list cache now covers the three modules.** It hashes every module directly under `scripts/lib`, so a later edit to one of them retires cached release records, as it does for any library module (D002).
- **Two draft orders, WO-062 and WO-065, still cite the old `scripts/github-repository.mjs` path.** The planner amends them before activation ([D012](../../evidence/WO-163/decisions.md#wo-163-d012--boarded-two-orders-not-yet-activated-cite-an-old-path)).
- **The mutation instrument cannot run on a current commit.** It exhausts a 128 MiB buffer, and its campaign names a moved Beacon leaf. This is recorded for the planner, not fixed ([D009](../../evidence/WO-163/decisions.md#wo-163-d009--boarded-the-mutation-instrument-cannot-run-on-the-current-tree)).

**How the review went.** A Claude Code executor implemented the order, and three read-only reviewers and a skeptic corrected its record before handoff (D013). [VER-001](../../verifications/WO-163/VER-001.md), run in Codex, failed on two points. First, criterion 4's diff-stat clause was unmet. Second, three new document-baseline exceptions hid links the move had broken. A Codex repair pointed the links at the moved files, removed the exceptions, and narrowed the historical check's claim, and the operator waived criterion 4. [VER-002](../../verifications/WO-163/VER-002.md) passed criteria 1, 2, 3, 5 and 6 with criterion 4 waived. [FINAL-001](FINAL-001.md) read the full diff, re-ran the review gate, and retargeted WO-142 D008's register row.

**Validation.** The reviewer's `npm test -- --review` passed **32 passed, 0 failed, 569.08 s, 76 fresh tasks, exit 0**, at code identity `d7e3fc14…`, the tracked code VER-002 judged; that row binds the released bytes. The historical mutation check exits 0, `harness check` reports 31 generated surfaces, and the three discovery fixtures pass. `npm run test:docs`, `publication:check`, `harness check`, `meta --check` and `plan check` pass after the review records. `git diff --check` is clean, no dependency is added, and the diff adds no suppression.

This prepares application `v0.52.9` as a patch over `v0.52.8`, the classification the order declared. No package source changes, so no component version moves, and no edition is re-minted.

Full evidence: [decisions D001 to D021](../../evidence/WO-163/decisions.md), the [evidence README](../../evidence/WO-163/README.md) with the [grep transcripts](../../evidence/WO-163/greps.txt), [VER-001](../../verifications/WO-163/VER-001.md), [VER-002](../../verifications/WO-163/VER-002.md), the [final review](FINAL-001.md) and [the order](../../work-orders/WO-163-5s-sort-and-set-in-order.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-28T02:37:15.988Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-169 | 8,525,973 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 119,666,693 (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-168 | 12,862,796 (Δ 4,336,823) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 195,038,374 (Δ 75,371,681) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | unavailable (Δ unavailable) | 1 (Δ 1) |
| WO-171 | 8,494,635 (Δ -4,368,161) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 88,103,267 (Δ -106,935,107) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ -1) |
| WO-164 | 14,017,933 (Δ 5,523,298) / 8 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 158,352,146 (Δ 70,248,879) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-170 | 10,327,714 (Δ -3,690,219) / 5 | 3,837,634 (Δ unavailable) | 0 (Δ unavailable) / 0 (Δ unavailable) | 102,085,188 (Δ -56,266,958) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 4 (Δ unavailable) | 0 (Δ 0) |
| WO-163 | 9,180,285 (Δ -1,147,429) / 4 | 2,285,041 (Δ -1,552,593) | 23 (Δ 23) / 405,178 (Δ 405,178) | 62,130,267 (Δ -39,954,921) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -3) | 1 (Δ 1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-163/executor | 7,789,200 (1,321,417) | 1,022,812 (316,466) | 699 (-222) | 50,902,788 (-35,677,720) | 938 (-104) | unavailable (unavailable) / 1,019 |
| WO-163/verifier | 1,391,085 (-1,145,604) | 149 (unavailable) | 59 (unavailable) | 11,145,511 (1,204,143) | 64 (-26) | unavailable (unavailable) / unavailable |
| WO-163/reviewer | 11,105 (-1,312,137) | 39,355 (unavailable) | 66 (5) | 81,968 (-5,481,344) | 80 (17) | unavailable (unavailable) / unavailable |
| WO-163/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-163/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-163/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
