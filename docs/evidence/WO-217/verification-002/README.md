# WO-217 VER-002 — probe evidence

These files support [VER-002](../../../verifications/WO-217/VER-002.md). The verifier wrote them and changed no implementation byte. The subject's `gateCodeIdentity` was `8d059c13c38513e0a55b4d3e931b086a13e76ef465f05389750af8d82623604a` before and after every write here.

## Disposable copy

The copy is a local clone of `a54f8d65` in session scratch, with its push URL blocked. It carries every modified and untracked, non-ignored file of the subject (`git ls-files -m -o --exclude-standard`) and an APFS clone of `node_modules`, and was built with `npm run build`. Its `gateCodeIdentity` equals the subject's. It was the same after the control replay and after the sync probe, so every byte a probe changed was restored.

## Control replay

[`control-replay.mjs`](control-replay.mjs) replays each `isolated-reversion` control of [`repair-controls.json`](../repair-controls.json) in the copy, serially, each command under the copy's own `node scripts/harness.mjs bounded --`. The positive arm runs the copy as it stands. The negative arm applies the recorded reversion exactly as the record holds it, with its recorded match count, rebuilds packages around a `packages/` change, and restores every byte.

Unlike VER-001's driver, it applies no formatted override. VER-001 F2 found two literal reversions that no longer matched; this replay judges whether the corrected record applies to the subject as filed.

[`replay-results.json`](replay-results.json) holds each outcome, with temporary and home paths removed. 62 of 62 controls reproduce: each positive arm exits 0 and each negative arm exits 1.

- Every literal reversion matched its recorded count, including `checkpoint-subject` and `release-close-classification`.
- `sync-real-checker-reports` runs one test in each arm. The negative arm fails on the case's `stale` assertion (`expected: true, actual: false`).
- Three controls report no `node --test` counter. `correct-standing` and `checkpoint-subject` run `scripts/test-off-ramps.mjs` through `control-fixture.mjs`, a script with no case reports (22 s positive). `pr-draft-owner` runs `test-release.sh --case prepare_independent`, whose progress line reports the case passed.

The nine base-met controls were not rerun. Their inputs are the unchanged base `a54f8d65` and test files the repair did not edit (`scripts/test-gate-followups.mjs`, `scripts/test-verifier-gate-claims.mjs`, `control-fixture.mjs`), so VER-001's replay of them stands.

## Sync probe (VER-001 F1 repair)

[`sync-probe.mjs`](sync-probe.mjs) damages one generated input of the copy per scenario. For each, it runs the artifact's real checker, the copy's `checkArtifact` and a one-artifact `syncArtifacts`, then records whether the bytes came back and restores them. The scenarios were chosen apart from the executor's fixture. [`sync-probe-results.json`](sync-probe-results.json) holds the output.

| Scenario | Checker report | Stale | Sync | Bytes regenerated |
| --- | --- | --- | --- | --- |
| tag observation names `v0.83.0` at the `v0.84.0` commit | `…records tag "v0.83.0", which is not a Git tag at its receipt commit; run node scripts/siblings.mjs index` | yes | regenerated | yes |
| `docs/siblings/README.md` line 3 edited (VER-001's reproduction) | `…is stale at line 3; run node scripts/siblings.mjs index` | yes | regenerated | yes |
| `docs/work-orders/README.md` deleted | `…is stale at line 1; run npm run work-orders -- index` | yes | regenerated | yes |
| HISTORY tag snapshot JSON malformed inside its marker | `invalid JSON in docs/work-orders/HISTORY.md tag snapshot: …` | no | refused | no (expected) |
| latest sibling receipt corrupted | `invalid JSON in docs/evidence/siblings/…json: …` | no | refused | no (expected) |
| `npm run sync` over a stale siblings page | `siblings \| stale \| current \| regenerated` | — | CLI exit 0 | yes |

The two refusals are unreadable inputs, which the row's rule and VER-001's repair rule keep refused.

## Register readback

[`register-readback.mjs`](register-readback.mjs) runs `npm run plan -- followups --show` for every row id the order lists before its acceptance criteria (58) and for the four VER-001 follow-ups. It compares each latest disposition with the row's latest source revision and with `WorkOrderActivated`'s `recordedAt` (2026-10-21T01:48:45.360Z). It found 38 settled, 19 declined and 1 deferred listed rows, and 4 settled verification follow-ups. It reported no problems: every latest disposition is recorded after activation, at the row's latest revision, and every decline carries a `reopenWhen`.

## Other probes

Each ran in this checkout under `node scripts/harness.mjs bounded --`, or as a read of committed records. VER-002 quotes the output.

- `npm run plan -- followups --touching`, `npm run meta -- --check`, `npm run format:check`, `git diff --check` and `node scripts/feedback-evidence.mjs --check`.
- The gate rows at the subject identity, read with `readGateChecks` from `packages/skeleton/src/gate-evidence.mjs`.
- The suite of each control's file: `scripts/test-runner.mjs` suite declarations and the imports of `test-process-debt.mjs`, `test-harness.mjs` and `test-resume.sh`.
- The decision dispatch labels in `docs/evidence/WO-217/decisions.md`, tallied.
- The journal event behind the meter's one WO-217 correction, in `docs/control/local/harness/`.
