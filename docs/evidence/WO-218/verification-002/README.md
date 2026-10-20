# WO-218 VER-002 probe evidence

Subject: code identity `6b809fff4a6b533c8fe347d184f0a155f6557e4375af712666206ed5da1ee7b0`, checkout HEAD `a66981acfcb4c451f9ef0417c2625ef809e4dc72`. The judged tree is checkpoint `refs/dotln/checkpoint/WO-218/7`, the verify dispatch; the repair completed at checkpoint 6. The implementation was not edited. In quoted output, `<copy>` stands for the disposable copy and `<tmp>` for the system temporary directory.

## Control replay

`control-replay.mjs` (SHA-256 `b62d0214ac449093246ac2d7f3e0878d6c5f344d2b8b9ff23ac90588622744e5`) replays one control of [repair-controls.json](../repair-controls.json) in a disposable copy of the subject. The copy is built as follows:

1. Clone this repository locally at `a66981ac` into session scratch, with its push URL blocked.
2. Overlay every modified and every untracked, non-ignored file of the subject.
3. Copy `node_modules` with its workspace links.
4. Run `npm run build`.

The copy's `gateCodeIdentity` and `gateTreeHash` equal the subject's (`6b809fff…`, `019854f0…`).

Run from the repository root, one process at a time:

```sh
node docs/evidence/WO-218/verification-002/control-replay.mjs <copy> <control-id> [pos,neg]
```

- The positive arm runs the copy as it stands.
- The negative arm applies the control's recorded reversion and nothing else.
- Each arm's command runs under the copy's own `node scripts/harness.mjs bounded --`.
- The control's equal-arm setup applies to both arms.
- Every changed byte is restored afterwards. A TypeScript change is rebuilt before its arm and after its restore.

The replay itself ran from session scratch on 2026-10-20 between 15:30Z and 15:55Z. It used a working copy of this script with the same apply, restore and rebuild logic. This saved file differs only in taking the copy and log paths as arguments, and in its failure-line extraction. Run as saved, it reproduced `r39-null-observation` (positive exit 0, negative exit 1, the same deep-equal failure) and `raw-gh` (negative exit 1, `gh pr view 7` admitted, as recorded).

The record uses six reversion kinds:

- literal `old`/`new` with a count (81 controls);
- main's whole file (`baseFile`: six already-met controls, r09 and r18-planning-body);
- a regular expression (r27, f2-03), whose reconstruction yields each recorded after-hash;
- appended text (r19-shared-git-primitives);
- a copied file (r20);
- main's whole function renamed and appended (`baseFunction`: raw-git, raw-gh, raw-npm). Its reconstruction yields the recorded intermediate hash `8e4d453c5740df41f6ecba8e3498a8cd271deaa27c7fa7cc2fd52d560ac8ace0` from the recorded starting hash `f913bec3…`, which is the subject's.

Results ([replay-results.json](replay-results.json) holds each negative arm's first failure line):

- All 91 controls reproduced their recorded outcome.
- In 80 isolated reversions, three adequacy controls and one containment control, the negative arm exits 1 on the recorded assertion.
- In the seven already-met controls, main's module passes the current case (exit 0).
- 22 positive arms were run here, and each exits 0. The complete review row at this identity covers the rest.

Three setup checks, each run without its setup and with the reversion:

- `r19-submodule-quote` and `r44-ancestral-local` only add an explicit failure message to a shell `grep` under `set -euo pipefail`. The committed cases exit 1 without that setup.
- `f1-15-order-rules` removes the earlier raw-rule assertion to reach the F15 assertion. Without the setup, the committed case fails earlier, at `scripts/test-target-worktree-start.mjs:1073`.

| Control | Rows (findings) | Suite | Mode | Positive exit | Negative exit |
| --- | --- | --- | --- | ---: | ---: |
| `r01-identity` | 1 | configuration-root | isolated-reversion | — | 1 |
| `r02-ancestors` | 2 | harness-fixtures | isolated-reversion | — | 1 |
| `r05-stash-continuation` | 5 | worktree-integration | isolated-reversion | — | 1 |
| `r06-navigation` | 6, 22 | harness-fixtures | isolated-reversion | — | 1 |
| `r07-original-objects` | 7 | launchpad | isolated-reversion | — | 1 |
| `r08-markers` | 8 | harness-fixtures | isolated-reversion | — | 1 |
| `r09-seed-class` | 9 | configuration-root | isolated-reversion | — | 1 |
| `r10-link-hosts` | 10 | configuration-root | isolated-reversion | — | 1 |
| `r11-configured-git` | 11 | harness-fixtures | isolated-reversion | — | 1 |
| `r13-carried-receipt` | 13 | siblings-fixtures | isolated-reversion | — | 1 |
| `r14-build-none` | 14 | harness-fixtures | isolated-reversion | — | 1 |
| `r15-encoded-links` | 15 | target-worktree | isolated-reversion | — | 1 |
| `r17-publication-declaration` | 17 | configuration-root | isolated-reversion | 0 | 1 |
| `r18-moved-decisions` | 18 | target-worktree | isolated-reversion | — | 1 |
| `r19-protected-retry` | 19 | release | isolated-reversion | 0 | 1 |
| `r19-reserved-case` | 19 | launchpad | isolated-reversion | 0 | 1 |
| `r19-linked-remedy` | 19 | worktree-integration | isolated-reversion | 0 | 1 |
| `r19-advisory-first` | 19 | worktree-integration | isolated-reversion | 0 | 1 |
| `r19-submodule-quote` | 19 | release | isolated-reversion | 0 | 1 |
| `r19-shared-git-primitives` | 19 | worktree-integration | isolated-reversion | 0 | 1 |
| `r20-shared-composition` | 20 | launchpad | isolated-reversion | 0 | 1 |
| `r21-narrowing-grants` | 21 | harness-fixtures | isolated-reversion | — | 1 |
| `r23-moved-main` | 23 | release | isolated-reversion | — | 1 |
| `r23-foreign-tag` | 23 | release | isolated-reversion | — | 1 |
| `r23-serialized-close` | 23 | release | isolated-reversion | — | 1 |
| `r25-stash-proof` | 25 | worktree-integration | isolated-reversion | — | 1 |
| `r26-nested-links` | 26 | target-worktree | isolated-reversion | — | 1 |
| `r27-other-launchpad` | 27 | target-worktree | isolated-reversion | — | 1 |
| `r29-rebase-guard` | 29 | target-worktree | isolated-reversion | — | 1 |
| `r29-stale-lock` | 29 | target-worktree | isolated-reversion | — | 1 |
| `r29-local-paths` | 29 | target-worktree | isolated-reversion | — | 1 |
| `r29-large-fence` | 29 | outward-lint | isolated-reversion | — | 1 |
| `r32-recovery-instructions` | 32 | launchpad-planning | isolated-reversion | — | 1 |
| `r35-settings-preflight` | 35 | target-worktree | isolated-reversion | — | 1 |
| `r36-rules-cleanliness` | 36 | target-worktree | isolated-reversion | — | 1 |
| `r37-path-overflow` | 37 | target-worktree | isolated-reversion | — | 1 |
| `r38-write-access` | 38 | target-worktree | isolated-reversion | — | 1 |
| `r39-null-observation` | 39 | target-worktree | isolated-reversion | 0 | 1 |
| `r40-moved-status` | 40 | target-worktree | isolated-reversion | — | 1 |
| `r41-instance-history` | 41 | work-orders-fixtures | isolated-reversion | — | 1 |
| `r42-gitmoji` | 42 | outward-lint | isolated-reversion | — | 1 |
| `r43-release-display` | 43 | target-worktree | isolated-reversion | — | 1 |
| `r44-starter-baseline` | 44 | launchpad-planning | isolated-reversion | 0 | 1 |
| `r45-base-policy` | 45 | target-worktree | isolated-reversion | — | 1 |
| `am-close-refusals` | 33 (FINAL-001 F10, FINAL-001 F11, FINAL-001 F19) | target-worktree | already-met-at-base | 0 | 0 |
| `am-large-ignore` | 33 (FINAL-001 F1) | target-worktree | already-met-at-base | 0 | 0 |
| `am-complete-bound` | 33 (FINAL-001 F20) | harness-fixtures | already-met-at-base | 0 | 0 |
| `f1-02-origin` | 33 (FINAL-001 F2) | harness-fixtures | isolated-reversion | — | 1 |
| `f1-03-package-closure` | 33 (FINAL-001 F3) | harness-fixtures | isolated-reversion | — | 1 |
| `f1-04-profile` | 33 (FINAL-001 F4) | harness-fixtures | isolated-reversion | — | 1 |
| `raw-git` | 33 (FINAL-001 F5) | harness-fixtures | isolated-reversion | — | 1 |
| `raw-gh` | 34 (FINAL-002 F7) | harness-fixtures | isolated-reversion | — | 1 |
| `raw-npm` | 33 (FINAL-001 F3) | harness-fixtures | isolated-reversion | — | 1 |
| `f1-06-next-version` | 33 (FINAL-001 F6) | target-worktree | isolated-reversion | — | 1 |
| `f1-07-ambiguous-push` | 33 (FINAL-001 F7) | target-worktree | isolated-reversion | — | 1 |
| `f1-08-recorded-origin` | 33 (FINAL-001 F8) | target-worktree | isolated-reversion | — | 1 |
| `f1-09-draft-commit` | 33 (FINAL-001 F9) | target-worktree | isolated-reversion | — | 1 |
| `f1-12-body` | 33 (FINAL-001 F12) | target-worktree | isolated-reversion | — | 1 |
| `f1-13-literal-rules` | 33 (FINAL-001 F13) | target-worktree | isolated-reversion | — | 1 |
| `f1-15-order-rules` | 33 (FINAL-001 F15) | target-worktree | isolated-reversion | — | 1 |
| `f2-08-gh-prefix` | 34 (FINAL-002 F8) | target-worktree | isolated-reversion | — | 1 |
| `f1-14-rewrite-origin` | 33 (FINAL-001 F14) | target-worktree | isolated-reversion | — | 1 |
| `f1-16-sidecar-path` | 33 (FINAL-001 F16) | target-worktree | isolated-reversion | — | 1 |
| `f1-16-removal-journal` | 33 (FINAL-001 F16) | target-worktree | isolated-reversion | — | 1 |
| `f1-17-receipt` | 33 (FINAL-001 F17) | target-worktree | isolated-reversion | — | 1 |
| `f1-18-gh-preflight` | 33 (FINAL-001 F18) | launchpad | isolated-reversion | — | 1 |
| `f1-18-preview` | 33 (FINAL-001 F18) | launchpad | isolated-reversion | — | 1 |
| `f2-01-path-names` | 34 (FINAL-002 F1) | target-worktree | isolated-reversion | — | 1 |
| `f2-02-planned` | 34 (FINAL-002 F2) | target-worktree | isolated-reversion | 0 | 1 |
| `f2-03-streaming` | 34 (FINAL-002 F3) | target-worktree | isolated-reversion | — | 1 |
| `f2-04-tag-preflight` | 34 (FINAL-002 F4) | launchpad | isolated-reversion | — | 1 |
| `f2-05-symlink` | 34 (FINAL-002 F5) | target-worktree | isolated-reversion | — | 1 |
| `f2-05-git-case` | 34, 38 (FINAL-002 F5) | configuration-root | isolated-reversion | — | 1 |
| `f2-06-registry` | 34 (FINAL-002 F6) | harness-fixtures | isolated-reversion | — | 1 |
| `f2-09-control-root` | 34 (FINAL-002 F9) | harness-fixtures | isolated-reversion | — | 1 |
| `f2-10-draft-origin` | 34 (FINAL-002 F10) | target-worktree | isolated-reversion | — | 1 |
| `f2-11-partial-row` | 34 (FINAL-002 F11) | resume | isolated-reversion | — | 1 |
| `f2-12-selection` | 34 (FINAL-002 F12) | resume | adequacy-control-of-existing-guard | 0 | 1 |
| `f2-12-executed` | 34 (FINAL-002 F12) | resume | adequacy-control-of-existing-guard | 0 | 1 |
| `f2-13-moved-head` | 34 (FINAL-002 F13) | target-worktree | isolated-reversion | — | 1 |
| `am-delayed-stub` | 5 | worktree-integration | already-met-at-base | 0 | 0 |
| `am-real-writer` | 12 | release | already-met-at-base | 0 | 0 |
| `am-stale-holder` | 29 | target-worktree | already-met-at-base | 0 | 0 |
| `r29-unmerged-remedy` | 29 | target-worktree | isolated-reversion | — | 1 |
| `am-nested-whitespace` | 19 | worktree-integration | already-met-at-base | 0 | 0 |
| `r18-commit-lint` | 18 | target-worktree | isolated-reversion | — | 1 |
| `r18-planning-body` | 18 | target-worktree | isolated-reversion | — | 1 |
| `r30-temp-containment` | 30 | launchpad | fixture-containment-control | 0 | 1 |
| `r31-temporary-retry` | 31 | launchpad | isolated-reversion | — | 1 |
| `r31-cleanup-privacy` | 31 | launchpad | adequacy-control-of-existing-guard | 0 | 1 |
| `r44-ancestral-local` | 44 | release | isolated-reversion | — | 1 |

## Historical-id dependency refusal (F1)

`dependency-probe.mjs` (SHA-256 `9f6a3688edcfa1ddb183ac40a843328d5018b64be2d6ec70786adc792d2e934c`) reads one order whose typed block makes `WO-001` a `hard` dependency through three readers:

- `parseDependencies`;
- `parseHeader`, the work-orders index and planning reader;
- `readDependencies`, the activation and status reader, in a scratch root carrying the same configuration.

It ran against this checkout and against a `git archive` of `a66981ac`'s `scripts`, `packages` and `package.json`:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-218/verification-002/dependency-probe.mjs . subject
node scripts/harness.mjs bounded -- node docs/evidence/WO-218/verification-002/dependency-probe.mjs <main archive> main
```

```text
subject parseDependencies: admitted [{"workOrderId":"WO-001","relation":"hard","reason":"probe"}]
subject parseHeader (index and planning reader): admitted [{"workOrderId":"WO-001","relation":"hard","reason":"probe"}]
subject historical ids: ["WO-001","WO-002"]
subject readDependencies (activation and status reader): refused docs/work-orders/WO-990-probe.md: historical id cannot be a hard or satisfied dependency; offending entry {"workOrderId":"WO-001","relation":"hard","reason":"probe"}
main parseDependencies: refused docs/work-orders/WO-990-probe.md: dependencies historical id cannot be a hard or satisfied dependency; offending entry {"workOrderId":"WO-001","relation":"hard","reason":"probe"}
main parseHeader (index and planning reader): refused docs/work-orders/WO-990-probe.md: dependencies historical id cannot be a hard or satisfied dependency; offending entry {"workOrderId":"WO-001","relation":"hard","reason":"probe"}
main historical ids: ["WO-001","WO-002"]
main readDependencies (activation and status reader): refused docs/work-orders/WO-990-probe.md: dependencies historical id cannot be a hard or satisfied dependency; offending entry {"workOrderId":"WO-001","relation":"hard","reason":"probe"}
```
