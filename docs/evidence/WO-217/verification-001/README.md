# WO-217 VER-001 — probe evidence

These files support [VER-001](../../../verifications/WO-217/VER-001.md). They were written by the verifier and change no implementation byte.

## Control replay

[`control-replay.mjs`](control-replay.mjs) replays one control of [`repair-controls.json`](../repair-controls.json) in disposable copies:

- The subject copy is a local clone of `a54f8d65` in session scratch, with its push URL blocked. It carries every modified and untracked, non-ignored file of the subject (`git ls-files -m -o --exclude-standard`) and a copy of `node_modules`, and was built with `npm run build`. Its `gateCodeIdentity` is `2cd81e4c8286ba58ba899a3eafc38ee59945749cfb68f20f5c8c759ef275c9f8`, the subject's. It was the same after all 70 replays, so every reverted byte was restored.
- The base copy is a built clone of `a54f8d65` with no changes. A base-met control runs there after copying in only the test files its `testSetup` names (`scripts/test-verifier-gate-claims.mjs`, `scripts/test-gate-followups.mjs`) and the order's `control-fixture.mjs`.
- Every command ran serially under that copy's own `node scripts/harness.mjs bounded --`.
- `finish-copy-output` runs with its recorded setup: `CODEX_THREAD_ID` omitted and `DOTLN_GATE_CHILD=1`.

[`replay-results.json`](replay-results.json) has the outcome for each control, with temporary and home paths removed. 70 of 70 controls reproduce:

- 61 isolated reversions exit 0 with the fix and 1 with only the recorded reversion applied. Every `node --test` positive arm ran at least one test, so none of them passes by matching no test name.
- 9 base-met commands exit 0 against the exact base implementation.

Two literal reversions, `checkpoint-subject` and `release-close-classification`, no longer match their files. `npm run format` reformatted the replaced text after the controls were recorded. [`formatted-reversions.json`](formatted-reversions.json) holds the recorded old text after prettier, with the recorded new text unchanged. In the current file, each formatted old text occurs exactly once. Both controls reproduce with it.

The negative arms whose failure line reads like a child-process exception were read in the full log. Each fails on the row's own assertion:

- `stopped-lookup`: the stop-row validation;
- `inherited-entry-retry`: the missing lease entry;
- `registration-remedies`: the `npm run sync` remedy text;
- `withdrawal-kind`: `launch` where `registration-cleanup` was expected.

`skills-format` fails on its message: without the format check, its synthetic profile is refused later, by the pinned-runtime check.

## Sync stale-report probes (F1)

[`sync-stale-probe.mjs`](sync-stale-probe.mjs) makes line 3 of `docs/siblings/README.md` stale in a disposable root. It prints the siblings check's output and that root's own `checkArtifact` result, then its `syncArtifacts` rows for the siblings artifact alone, and restores the README's bytes. In both copies the check prints `error: docs/siblings/README.md is stale at line 3; run node scripts/siblings.mjs index`.

- Subject copy: `checkArtifact` gives `stale false`, and sync refuses: `siblings unknown -> unknown refused check did not report stale; repair the check before regenerating`.
- Base copy (`a54f8d65`): sync runs the writer: `siblings stale -> current regenerated`, and the README returns to its original bytes.

[`stale-classification-probe.mjs`](stale-classification-probe.mjs) feeds each checker's own stale wording to the subject's `checkArtifact` through its injectable runner. Nothing runs and nothing is written.

| Artifact | Message | Classified stale |
| --- | --- | --- |
| siblings | `… is stale at line N; run node scripts/siblings.mjs index` | no |
| siblings | `…: the <id> entry records manifest hash …; run node scripts/siblings.mjs index` | no |
| index | `… is stale at line N; run npm run work-orders -- index` | yes |
| index | `…: missing or malformed tag snapshot; run npm run work-orders -- index` | no |
| meta | `Decisions index is stale; run npm run meta` | yes |
| lineage | `Stale …; run node scripts/lineage.mjs index` | yes |
| harness | `harness drift: …` | yes |

## Other probes

Each probe below ran in this checkout or its disposable copies under `node scripts/harness.mjs bounded --`. The output is quoted in VER-001.

- `npm run plan -- followups --show <id>` for each of the 58 listed rows.
- `npm run plan -- followups --touching`.
- `npm run meta -- --check`, `npm run format:check`, `git diff --check` and `node scripts/feedback-evidence.mjs --check`.
- The suite of each control's file, read from the suite table in `scripts/test-runner.mjs` and from the complete row's per-suite slowest-case files.
- The new `gateCriticalPath` duration refusal, applied to every recorded row in this worktree's gate index and in main's (3,232 rows with timelines). No task records more work than its span.
- `lightSuiteNames` on the real `scripts/lib/gate-scheduling-baseline.json`: 99 samples, one per task. The all-samples rule selects the same set as the previous latest-sample rule.
- The stale-report patterns in `scripts/lib/generated-artifacts.mjs`, compared with the messages that each regenerable artifact's checker prints (F1, above).
- `operatorDirections` from `scripts/lib/meta.mjs`, applied to this order's decision dispatch labels (VER-001 F4).
