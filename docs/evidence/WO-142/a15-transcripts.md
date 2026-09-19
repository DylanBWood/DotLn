# A15 causal fixture transcripts

All cases ran in disposable synthetic local repositories with mocked GitHub
and bare fixture remotes. No real publication occurred. Positive commands used
`env -u CODEX_THREAD_ID` to match the runner’s isolation, then `bash` with the
named script. Each counterfactual was applied only in an external copy; every
negative below exited 1 at its intended assertion. These are selected assertion
excerpts, with host paths omitted; no claim is made that a setup failure killed
a mutant.

| Item | Positive command (exit 0) | Reverted subject | Observed negative excerpt (exit 1) |
| --- | --- | --- | --- |
| BK-1 archive boundary | `bash scripts/test-backup-intake.sh` | Archive `docs` instead of `docs/intake`. | Exact archive list contains unexpected `docs/outside.txt`. |
| BK-2 byte fidelity | Same | Strip newlines before archive, then restore source. | `note.txt differ: char 6, line 1` from `cmp`. |
| BK-4 disposable exclusion | Same | Remove zip’s `.DS_Store` exclusion. | Exact archive list contains unexpected `docs/intake/.DS_Store`. |
| BK-8 filename counting | Same | Restore original backup-intake source. | `Created … (5 files)`; expected `(4 files)` for four files including a newline name. |
| All checkpoint transitions | `bash scripts/test-checkpoint.sh` | Omit FinalReviewCompleted checkpoint fields. | `15 !== 16` distinct checkpoint refs; current run proves 16 refs/all eight event kinds and sentinel bytes. |
| AC19 reopen source | `bash scripts/test-resume.sh` | Reopen from latest verification instead of requesting finding. | actual `VER-003`, expected `FINAL-002`. |
| Executed privacy canary | Same | Omit filesystem-wrapper synchronization. | `privacy canary must intercept the dispatcher filesystem reads`, actual false. |
| First-parent history | `bash scripts/test-release.sh --case edition` | Remove `rev-list --first-parent`. | Required merge-only fallback subject assertion fails; real branch merges present in fixture. |
| NUL filenames | `bash scripts/test-release.sh --case firstrelease` | Split NUL-delimited filenames on newline as well. | Manifest no longer includes exact newline-containing filename. |
| Release metadata | `bash scripts/test-release.sh --case success` | Disable metadata value guard while keeping shape check. | `error: mismatched GitHub Release name accepted`. Current case separately rejects title/draft/prerelease/assets. |
| Complete remote refs | Same | Add unexpected branch push to fixture remote. | Actual refs include `refs/heads/unexpected-fixture`; expected set is exactly main, wo-099, v0.2.0, v0.2.1. |
| Private body absence | `bash scripts/test-worktree.sh` | Append working-tree private body after committed-body profile check. | Committed-body positive passes, then `error: private working body leaked`. |

The same positive worktree fixture also retains a newline-containing intake
path and checks its deliberately JSON-quoted diagnostic; filesystem assertions
use the original path bytes. Release success and first-release fixtures cover
tracked and ignored newline names. Backup extraction uses the host’s documented
`unzip -^` option to preserve control characters in filenames.

The helper inspected the external reversion patches and full raw logs; the
root reviewed the proposals and selected assertion transcripts. Public selected
evidence is this table; recurring tests remain
in their existing suites. Each archive case, the canary, source-mismatch,
checkpoint coverage, first-parent history, all-ref comparison, NUL filename
handling and private-body assertion has its own observed failing subject.
