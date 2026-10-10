## Release overview

This release makes a worktree's gate say what it saw. Git worktrees share tags, branches and `refs/dotln/`, so a sibling's merge into `main` or a release tag is visible to a gate the moment it lands; until now nothing on a gate row recorded those refs, and a suite that passed in a worktree and failed after a merge cost the operator about an hour of attribution. Every gate row now carries a `sharedRefs` record with the `origin/main` and `main` commit ids, the count and newest name of the annotated `v*` tags and the count of `refs/dotln/` refs, read once at gate start and once after the last task. When a task fails, the runner prints one `shared refs moved:` line naming each field that changed since the same check's previous row in that checkout or during the run; a passing row prints nothing. The visible changes:
- `sharedRefs.start` and `sharedRefs.end` on every row the runner records, including single-suite and composed runs; a missing branch reads `absent`, a read Git cannot complete reads `unreadable`, and neither throws.
- One diagnostic line on a failed gate, `shared refs moved: since previous: …; during run: …`, with tags spelled `tags +<name> (count a..b, newest x..y)`.
- A `runner-fixtures` case that runs a linked worktree's document and plain gates, lands a commit, an annotated tag and a push on `main` in between, and shows every task with the same result and the second rows carrying the new snapshot.
- One paragraph in product 07 §Independent workflows and integration stating the rule.

The release is for the operator running orders in parallel worktrees and for the verifier and reviewer who read a failed gate row.

## Read before upgrading

- **The line is correlation, not cause.** A named move says a shared ref changed between two samples; whether that change failed the task is the reader's judgment. Movement wholly between two samples, and a tag or `refs/dotln/` ref re-pointed under the same name with the counted fields unchanged, is outside this snapshot ([D002](../../evidence/WO-198/decisions.md#wo-198-d002)).
- **`absent` and `unreadable` mean different things.** `absent` is a completed read that found no commit: a missing, removed, dangling or non-commit ref, including one Git cannot read for file permissions. `unreadable` is a read Git could not complete, such as exit 128 on a damaged `packed-refs` file or a launch failure; it is never a count, withholds only its own field's comparison, and never changes the gate's exit code, row or summary ([D017](../../evidence/WO-198/decisions.md#wo-198-d017--compare-observed-absence-and-withhold-only-unreadable-fields)).
- **Baselines are never invented.** A legacy row without a snapshot, a structurally malformed earlier snapshot or a damaged gate-history archive supplies no since-previous baseline; the run's own start and end are still compared, and the failed row is still recorded.
- **Known limit: the harness evidence command's host row.** When `npm test` fails under `node scripts/harness.mjs evidence`, the command records its own `npm test` row without a snapshot after the runner's row, so the next failure after a ref move prints no since-previous delta. Boarded for the next order that edits `runHarnessEvidenceChecks` ([D004](../../evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded), FUP-f5f10101e717d59b).
- **Known limit: the reduced fixture table.** The sibling-merge case runs three fixture tasks, not the live suites; no task flipped, which guards the gate's independence from shared refs but does not prove every live task ignores them. The next live flip is what the delta line attributes.
- **Component versions.** Application v0.73.1 is a patch over v0.73.0. Skeleton advances from 0.57.0 to 0.57.1 and the harness host from 0.35.0 to 0.35.1 for the diagnostic module and its regenerated hook bundle; the console pin and the lockfile follow; no dependency is added.

## Substantive changes

**The reader.** `packages/skeleton/src/gate-evidence.mjs` exports `readSharedRefs(root)`, which makes four Git reads through one non-throwing helper: `rev-parse --verify --quiet <ref>^{commit}` for `refs/remotes/origin/main` and `refs/heads/main` (exit 0 keeps the commit, exit 1 records `absent`, any other exit or launch failure records `unreadable`), `for-each-ref` over `refs/tags/v*` sorted by tagger date with the full name breaking ties and lightweight tags excluded, and `for-each-ref` over `refs/dotln/`; a failed enumeration records `unreadable` for its fields and discards partial output. The strict `git()` helper that computes tree and code identity is unchanged.

**The row and the line.** `scripts/test-runner.mjs` reads the snapshot before the preflight stage and again inside the row literal after the last task, and puts `sharedRefs: { start, end }` on the row. Exported `completeSharedRefs` validates a snapshot's structure (string branch fields, a tags object with a safe-integer or `unreadable` count and a string newest, a safe-integer or `unreadable` ref count); exported `sharedRefChanges` compares two complete snapshots field by field, names a change to or from `absent`, withholds only an `unreadable` field, and spells a tag change `tags +<name> (count a..b, newest x..y)` when the count rose and the newest changed. On a non-zero exit, the failure block selects the latest earlier row of the same check inside a catch, so an unreadable or malformed history supplies no baseline, then prints one line joining the since-previous and during-run changes before recording the row.

**Gate rows.** `scripts/test-runner.test.mjs` gains seventeen WO-198 cases: the sibling-merge fixture with a bare origin and a linked worktree on `wo-900`; the forced-failure line; movement during a failed run and a return to the previous value; a legacy, an incomplete and a malformed earlier snapshot; a damaged archive and an unselectable archived timestamp; a direct validator matrix of 21 malformed shapes; unreadable tags before and during passing and failing linked-worktree gates; `origin/main` created between two failed gates; and direct Git classification of missing, dangling, non-commit and unreadable refs.

## Progressive polish

Product 07 §Independent workflows and integration gains the rule in three sentences, in place; the authority, artifact-identity and verification evidence editions are re-minted at `docs/evidence/WO-198/*/004` with revisions 001 to 003 retained and WO-073's feedback edition carried; the harness bundle and manifest are regenerated for skeleton 0.35.1; the software-engineer publication source lock is refreshed; the README's release claim reads v0.73.1.

## Evidence and compatibility

Application `v0.73.1` is a patch over `v0.73.0`, built from WO-198 integrated with `main` at `bb84ae82`, which is also the order's base; integration changed no judged byte ([D020](../../evidence/WO-198/decisions.md#wo-198-d020)). Skeleton 0.57.1 replaces 0.57.0 and the harness host 0.35.1 replaces 0.35.0; no other component changes and no dependency is added. The additive `sharedRefs` field is diagnostic metadata on gate rows; every existing reader of those rows passes in the review gate.

The verification sequence:
- [VER-001](../../verifications/WO-198/VER-001.md) failed on a malformed earlier snapshot that crashed a failed gate before it recorded, and boarded the harness evidence command's snapshot-less host row.
- [VER-002](../../verifications/WO-198/VER-002.md) confirmed that repair and failed on a damaged gate-history archive that stopped a failed gate from recording.
- [VER-003](../../verifications/WO-198/VER-003.md) confirmed that repair and failed on a shared ref Git could not enumerate, which made the snapshot throw where `main`'s gate passed.
- [VER-004](../../verifications/WO-198/VER-004.md) confirmed that repair across a 72-gate damage matrix and failed criterion 2 on a comparison that never named a branch created or removed.
- [VER-005](../../verifications/WO-198/VER-005.md) passed: twelve branch-transition scenarios, the damage matrix against `HEAD` and nine Git ref states, with no new defect.
- [FINAL-001](FINAL-001.md) passed at the integrated tree: the 17 WO-198 cases fresh under the bounded runner (17 of 17 in 13.16 s), the reader equal to direct Git on the real corpus, the affected checks, `npm run test:docs` at 32 of 32 in 122.59 s, and `npm test -- --review` composed at the unchanged identity `a5923da7…` from the executor's fresh row (90 fresh tasks, 1,731.7 s).

Known limitations:
- The harness evidence command's snapshot-less host row hides the next since-previous delta ([D004](../../evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded), FUP-f5f10101e717d59b).
- The `runner-fixtures` task's fresh duration (126.5 s in the review row) is above the planning receipt's reopening threshold; the growth predates this order and the 17 new cases cost about 13 s in isolation ([D021](../../evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning), FUP-8bac5e3bddd12494).
- Coverage is one macOS host with Git 2.55.0 and Node 26; no live sibling merge into this repository's `main` was exercised during a gate.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-198/decisions.md) and the [handoff](../../evidence/WO-198/handoff.md).
