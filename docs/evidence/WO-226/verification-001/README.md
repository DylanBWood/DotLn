# WO-226 VER-001 probes and observations

These probes back [VER-001](../../../verifications/WO-226/VER-001.md). Each
ran from the root of the order's worktree at code identity
`3054312198bbe46571a9bac7da6441678812d40879c25eec468fb5f16cff3241`, under
`node scripts/harness.mjs bounded --`, one process at a time, on 2026-10-22
UTC. The probes read the repository and write only to the session's
temporary directory. No implementation file was edited or reverted. The two
saved scripts carry this worktree's absolute path; run them from a copy
with that path changed.

## Reproduced suites and cases

| Probe | Command | Exit | Observation |
| --- | --- | --- | --- |
| Hook fixtures | `npm test -- --only harness-fixtures` | 0 | Suite row recorded 10:30:01Z, 321.8 s; `harness-fixtures` PASS 290.74 s; structural rows `declarations`, `generated`, `host` and `build` PASS. Covers the WO-195 core recovery case, the WO-221 admission case with its WO-226 field controls, the near-miss case, the pasted-prefix case and the two-worker pin case. |
| Export recovery, entry and finish | `node --test --test-name-pattern 'WO-226' scripts/test-launchpad-export.mjs` | 0 | 1 test, pass, 10.98 s, finished 10:30:33Z. |
| Update finish | `node --test --test-name-pattern 'WO-226' scripts/test-launchpad-update.mjs` | 0 | 1 test, pass, 6.6 s, finished 10:31:16Z. |
| Kit refresh and role oracle | `node --test --test-name-pattern 'WO-226\|bounded role wording\|WO-145 optional economy' scripts/test-process-debt.mjs scripts/test-gate-followups.mjs` | 0 | 4 tests, pass, 0.5 s, finished 10:31:16Z. |
| Direct receipts | `node scripts/test-plan-refutation.mjs --fixtures-only` | 0 | 44.6 s, finished 10:33:32Z; the WO-226 worker-type case passes. |

## Checks

| Check | Command | Exit | Observation |
| --- | --- | --- | --- |
| Formatting | `npm run format:check` | 0 | All matched files formatted; 6.6 s, 10:15:42Z. |
| Whitespace | `git diff --check` | 0 | Clean. |
| Generated surfaces | `node scripts/harness.mjs check` | 0 | 35 generated surfaces; local-terms list present; 10:23:07Z. |
| Publication | `npm run publication:check` | 0 | 29 and 45 linked source sections current; bootstrap checks PASS. |
| Meta | `npm run meta -- --check` | 0 | Advisory lines: `coldStartBytes.reviewer: 28,913; ceiling 28884; breach` for both installed roots; 2 budget breaches named; the check passes. |
| Authority edition | `node scripts/authority-evidence.mjs --check` | 0 | 38 bundle comparisons verified. |
| Harness edition | `node scripts/harness-evidence.mjs --check` | 0 | 35 current generated surfaces, 55 surfaces checked. |
| Feedback edition | `node scripts/feedback-evidence.mjs --check` | 0 | Ten passing regressions and ten removal failures verified. |
| Receipt usage | `node scripts/refute-plan.mjs receipt` | 1 | Usage names `--worker-type dotln-worker\|dotln-worker-fable\|codex-spawn-agent`. |
| Finish refusal on this worktree | `node scripts/launchpad.mjs update --finish` | 1 | `update --finish requires main; current checkout is wo-226`; the 84 changed paths and HEAD `55699291` unchanged before and after. `--finish --bogus` prints the usage line. |

## Gate rows at the subject

`gate-rows.mjs` computes the working tree's code identity through
`gateCodeIdentity` and reads the rows through `gateCandidates` and
`preflightRows`. At entry it printed identity
`3054312198bbe46571a9bac7da6441678812d40879c25eec468fb5f16cff3241`, one
`npm test` row (`review` selection, recorded 2026-10-22T04:47:12.952Z,
exit 0, 1,581,147 ms, 41 required suites, fresh) and one `npm run test:docs`
row (`document` selection, recorded 04:52:43.369Z, exit 0, 147,236 ms, tree
`aa4f16d5`). No `--only` suite row existed at the identity before this
verification; the complete row covers them.

## First-line variations

`prompt-line.mjs` calls the compiled `harnessPromptLine` and
`harnessPromptIntent`. Observed (index, first content line, intent):

| Prompt | Index | Text | Intent |
| --- | --- | --- | --- |
| blank, ```` ``` ````, blank, `planning: refute`, ```` ``` ```` | 3 | `planning: refute` | `planning: refute` |
| ```` ```text ````, `resume: verify`, fence | 1 | `resume: verify` | `resume: verify` |
| ```` ```planning: refute ```` then `body` | 1 | `body` | `body` |
| four-backtick fence then `resume: verify` | 0 | ```` ```` ```` | not a dispatch |
| `~~~` then `resume: verify` | 0 | `~~~` | not a dispatch |
| CRLF fence, `resume: verify fable`, fence | 1 | `resume: verify fable` | `resume: verify` |
| `<pasted_content id="1">` then `planning: refute` | 0 | `<pasted_content id="1">` | not a dispatch |
| fence, `operator override: recovery`, fence | 1 | `operator override: recovery` | that line |
| `notes` then `resume: verify` | 0 | `notes` | not a dispatch |
| `resume: verify fable 5.1` | 0 | the line | `resume: verify` |
| `resume: verify fable 5.2` | 0 | the line | not a dispatch |
| `resume: verify fablex` | 0 | the line | not a dispatch |
| `resume: verify fable; do x` | 0 | the line | `resume: verify` |
| `planning: refute full fable 5.1; scope` | 0 | the line | `planning: refute full` |
| two newlines only | 3 | empty | empty |
| empty | 1 | empty | empty |

## Installed role bytes

`wc -c` on `CLAUDE.md` (6,872) and the installed skills: executor 22,260
(29,132 total), verifier 19,012 (25,884), reviewer 22,041 (28,913),
release-close 11,123 (17,995), planner 12,032 (18,904), refuter 10,846
(17,718). Each total equals `role-costs.json`; the reviewer exceeds its
28,884-byte ceiling by 29 bytes.

## The 2026-10-21 paste in the main checkout's journal

The session journal whose file name begins `8fe3a6e1` under the main
checkout's `docs/control/local/harness/` holds `OperatorMessageObserved`
rows: 2026-10-21T23:09:46.564Z, 21,641 bytes, `prefix: null`, `role:
unknown`; 23:10:14.267Z, 21,679 bytes, the same; 23:42:36.362Z, 9 bytes,
`prefix: "planning:"`. The rows keep a SHA-256 digest and a byte count,
not the text, so the paste's framing is not recoverable from them.

## Lockfile

`git diff package-lock.json` adds or removes no `node_modules/` entry: six
insertions and six deletions, all version pins (compiler 0.30.0, skeleton
0.65.0, console 0.4.5).

## Checkpoint comparison

`checkpoint-compare.mjs` hashes every regular file of
`refs/dotln/checkpoint/WO-226/3` (7,025 entries) against the working tree
with `git hash-object` and lists the paths present here and absent there.
Run before this verification's report and evidence were written, it found
no missing file, seven changed paths and four extra paths. Six of the
changed paths are the verify dispatch's projections (`docs/control/current.md`,
`docs/control/orders/WO-226.jsonl`, `docs/work-orders/README.md`) and this
verification's writes (`docs/evidence/WO-226/decisions.md`,
`docs/lineage/decisions-index.md`, `docs/planning/followups.json`); the
seventh, `AGENTS.md`, is a symlink to `CLAUDE.md` in both trees (mode
`120000`) that the first run hashed by its target. The saved script skips
symlinks. The four extra paths are this directory's three files at that
time and the report.
