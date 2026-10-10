# WO-077

An existing export now takes core's kit updates with one command, `node scripts/launchpad.mjs export --update` followed by the export's path, run from a core checkout at the commit to take. The update requires the export's `KIT-MANIFEST.json`, replaces a kit file only when its bytes still match the prior manifest's hash, lists every locally edited kit file as `refused:` and keeps it at its prior hash, adds the kit's new files, removes dropped files only when they are unmodified, rewrites `UPSTREAM.md` and the manifest to the new commit, and prints the kit's dated instance actions and the instruction to re-run `node scripts/harness.mjs emit` inside the export. It refuses before any write when the manifest is absent or malformed, when a prior kit file is missing, unreadable, a directory or a symlink, or when a new kit path is already an instance file. Before this change nothing refreshed an export: a starter took core's improvements only by hand, and WO-078's sibling registry waits on this command.

**Instance actions are opt-in twice.** The kit now carries a typed `scripts/kit/KIT-ACTIONS.json` (schema 1, an empty list at this release) whose declared kinds are `rename-root`, `add-config-field` and `change-phrase`. Without opt-in the update prints each declared action with its date and leaves every instance file byte-identical. With `"kit": { "applyInstanceActions": true }` in the instance's `dotln.config.json` and `--apply` on the command line, the update performs the declared actions, prints one `applied:` or `preserved/already applied:` line per action, and refuses any kind or field outside the closed set before any write; `--apply` without the configuration opt-in refuses naming `dotln.config.json`. The exported `CLAUDE.md` is an instance file that a `change-phrase` action edits only under that opt-in, and the kit's contract template now says so ([D003](../../evidence/WO-077/decisions.md#wo-077-d003--opt-in-and-typed-mechanical-actions), [D006](../../evidence/WO-077/decisions.md#wo-077-d006--independent-review-and-contract-consistency)). The configuration loader gains the closed `kit` section with that one boolean, default false.

**Read before merging.** Refusal is the whole conflict story: a modified kit file is listed, kept at its prior hash and refused again on every later update until the instance resolves it by hand; there is no merge path, by the order's design ([D002](../../evidence/WO-077/decisions.md#wo-077-d002--preserve-kit-ownership-across-repeated-updates)). Three defects found by verification break no criterion and are boarded for the next order that edits `scripts/launchpad.mjs` ([D007](../../evidence/WO-077/decisions.md#wo-077-d007--verification-ver-001-pass-three-update-follow-ups-boarded), FUP-eaad73517ca2a395): a kit-declared `rename-root` can move an instance root into a kit tree such as `scripts/`; a kit file whose bytes already equal the incoming kit's is still refused as locally modified; and an update whose instance write fails after the kit writes cannot be retried, so the export is restored from Git. The update preflights every input and action but promises no crash-atomic transaction. Updates flow core to starter by this command and starter to forks by each fork's ordinary upstream merge; nothing refreshes a fork automatically.

**Validation.** [VER-001](../../verifications/WO-077/VER-001.md) passed every criterion over the real 596-file kit: an export with two edited kit files, an edited `CLAUDE.md`, `README.md` and work order and an overlay file updates with exactly the two edits refused and every other byte as expected, `harness emit` and `harness check` pass inside the updated export, nine malformed manifest shapes and four configuration shapes refuse before any write, the three action kinds take effect under opt-in and an undeclared kind refuses, and a running exported resident keeps its log, its derived `WO-900` identity and its armed cadence across an opted-in update. This review found `main` at the order's base, so integration changed no judged byte; it re-ran the executor's nine-case update fixture under the bounded runner (9 of 9 in 39.7 s) and the publication, harness, release-surface, document-ceiling, index and format checks. `npm run test:docs` passes 32 of 32 suites in 116.30 s at the integrated tree; `npm test -- --review` at code identity `43d2cf9c…` composes a passing row of 29 suites in 7.30 s from the executor's fresh row at the same identity (81 fresh tasks, 1,094.4 s, exit 0) plus the always-fresh format preflight. Details are in [FINAL-001](FINAL-001.md).

Application v0.74.0, a minor over v0.73.1: one command mode over the kit manifest and one configuration field. No component version changes and no dependency is added.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-10T13:43:19.651Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-188 | 45,120,571 / 9 | 7,770,554 | 13 / 219,325 | 201,144,864 /  | 768 | 4 | 0 |
| WO-190 | 16,674,127 (Δ -28,446,444) / 3 | 1,411,200 (Δ -6,359,354) | 34 (Δ 21) / 707,339 (Δ 488,014) | 51,538,743 (Δ -149,606,121) /  | 768 (Δ 0) | 1 (Δ -3) | 0 (Δ 0) |
| WO-075 | 22,435,591 (Δ 5,761,464) / 5 | 4,235,031 (Δ 2,823,831) | 22 (Δ -12) / 365,275 (Δ -342,064) | 99,012,820 (Δ 47,474,077) /  | 768 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-073 | 7,673,784 (Δ -14,761,807) / 3 | 1,534,475 (Δ -2,700,556) | 4 (Δ -18) / 37,979 (Δ -327,296) | 32,659,563 (Δ -66,353,257) /  | 768 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-198 | 20,778,594 (Δ 13,104,810) / 11 | 8,893,950 (Δ 7,359,475) | 4 (Δ 0) / 55,683 (Δ 17,704) | 138,036,224 (Δ 105,376,661) /  | 768 (Δ 0) | 4 (Δ 4) | 2 (Δ 2) |
| WO-077 | 3,954,524 (Δ -16,824,070) / 2 | 1,094,429 (Δ -7,799,521) | 4 (Δ 0) / 43,156 (Δ -12,527) | 18,857,896 (Δ -119,178,328) /  | 768 (Δ 0) | 0 (Δ -4) | 0 (Δ -2) |

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-077/executor | 3,007,266 (Δ -11,587,084) |  |  | 9,366,847 (Δ -83,784,022) | 97 (Δ -479) |  / 768 |
| WO-077/verifier | 947,258 (Δ -3,663,724) | 16,966 (Δ -353,313) | 62 (Δ -223) | 9,399,351 (Δ -35,342,590) | 66 (Δ -261) |  /  |
| WO-077/reviewer | 9,911 (Δ -1,563,351) |  | 46 (Δ -16) | 91,698 (Δ -51,716) | 47 (Δ -16) |  /  |

43 unavailable observations omitted as blank cells or rows; unavailable is not zero; unset ceilings are not approvals of a future limit.

<!-- dotln-process-meter:end -->
