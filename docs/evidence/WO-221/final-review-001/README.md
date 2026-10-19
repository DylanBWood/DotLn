# WO-221 FINAL-001 probe evidence

Subject: code identity `104d1bf29eb45e2b238c3d3b918d1c6f4d58efb608762adcb3dfed41f152310b`, checkout HEAD `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`, after `npm run worktree -- integrate WO-221` merged nothing (both bases `8bbdcbff`). The reviewer did not edit the implementation. The probe imports the repository's own `scripts/lib/target-worktrees.mjs`, writes only under a fresh directory in the system temporary root and removes it; it reaches no host, forge or registry.

Run from the repository root:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/final-review-001/shared-rules-probe.mjs
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/final-review-001/probes.mjs base-large-ignored-tree
```

`probes.mjs` builds its mode from the target-worktree suite's fixture helpers in a generated copy under system temp, as the VER-002 probes do. It asserts the behavior Design C and criterion 6 prescribe, so its exit 1 below is the reproduced blocking defect, not a passing check.

| Probe | Started (2026-10-19 UTC) | Exit | Bounded duration | Observation |
| --- | --- | --- | --- | --- |
| `probes.mjs base-large-ignored-tree` | 09:22:49 | 1 | 13.6 s | The clone's base checkout holds 20,000 files, 1,340,000 bytes of paths, under a `node_modules` the fetched tree ignores and the class declares disposable. `release close --publish` exits 1 with `target clone base main cannot close: base ignore judgment unavailable; source retained. Fix what Git reports`; the tree remains, the base does not move and the target worktree remains. The judgment's `git check-ignore --no-index --stdin` runs through `spawnSync` with no `maxBuffer`, so Node's 1 MiB default kills it, while the candidate list is capped at 16 MiB. Main's `closeClean` listed the base with `--exclude-standard`, so main's close completed this state. FINAL-001 F1, blocking. |
| `shared-rules-probe` | 08:57:46 | 0 | 0.066 s | Two orders of one registered repository write their literal rules under `hostRules: "literal"`. The first write adds 11 Claude rules, 5 of them the `gh pr ... --repo` rules that name the repository and no order. The second order's sidecar records 3 rules (its two pushes and its helper) and none of the 5 `gh pr` rules, because `writeOrderHostRules` records only the rules its own write added. Removing the first order's rules, as its release close does, leaves 3 rules: the second order's two pushes and its helper, and 0 `gh pr` rules. FINAL-001 F15. |

The probe prints the observation as JSON: `rulesBefore` 11, `ghRulesBefore` 5, `secondSidecarRules` 3, `secondSidecarHoldsGhRules` false, `rulesAfterFirstClose` 3, `ghRulesAfterFirstClose` 0, `secondOrderPushRulesRemain` 2. The same run from the session scratch directory at 08:50 UTC, before the file was saved here, printed the same values.

The reviewer also reran seven saved verification probes at this subject between 08:46:19 and 08:47:44 UTC, one process at a time under the bounded wrapper: `verification-001/admission.mjs` (exit 0), `verification-001/probes.mjs close-preignored-env` (exit 0: close refuses, `.env` retained, target and base unchanged), `verification-001/probes.mjs fallback-optout-rewrite` (exit 0: the rewrite refuses and writes nothing), `verification-002/probes.mjs release-tag-moved-forward` (exit 0: the moved tag refuses, the restored tag completes with one Release at the recorded commit), `verification-002/probes.mjs base-info-exclude-env` (exit 0: refused as not clean, material retained), `verification-002/probes.mjs literal-dirty-main` (exit 0: VER-002 F1 reproduced) and `verification-002/harness-check-stale.mjs` (exit 0: the stale line prints with its remedy). The saved VER-001 gate audit found the complete review row at the subject identity before the integration (08:42:26 UTC) and after it (08:53 UTC).

Two independent read-only `dotln-worker` reviewers read the diff after the integration (08:55 UTC): one over the trust admission and the publication paths, one over the close, the releases, the starter refresh and the gate process. Their reports are summarized in FINAL-001; the second named the large-tree judgment, which this reviewer then reproduced above. See [FINAL-001](../../../final-reviews/WO-221/FINAL-001.md) for the verdict and [D038](../decisions.md#wo-221-d038--final-review-fail-final-001-at-the-integrated-subject-the-base-ignore-judgment-dies-on-a-populated-ignored-tree-and-nineteen-follow-ups-are-boarded) for the blocking finding and the boarded follow-ups.
