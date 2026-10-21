# WO-217 — Gate follow-up evidence

## Baseline inventory

Captured before implementation on 2026-10-21, after `resume: next`. The register export reports **166 pending** at revision `a9564365d8dd4cfcdb65f1fc0d1a15bda242c0598b19c44ad75b00a5cde4819c`. Allocated rows do not count as pending; resolving this batch does not itself reduce that count. Existing control and sibling changes at entry are preserved.

The source decisions are read in full before their repairs. The table records each source and its latest disposition at the base. Source-reading commands are recorded now; executable reproductions and their outputs are added as each row is judged. No baseline pass is inferred from an earlier order.

| Row | Base disposition | Recorded at | Source / named surfaces | Base observation command |
| --- | --- | --- | --- | --- |
| FUP-04ec9fa011f39d93 | allocated | 2026-10-17T19:34:07.539Z | [WO-144-D010](../../evidence/WO-144/decisions.md#wo-144-d010--pass-final-review-after-an-in-review-test-repair-board-the-unrun-suite-and-two-width-edges); `docs/evidence/WO-143/decisions.md`, `docs/final-reviews/WO-144/FINAL-002.md`, `packages/skeleton/src/harness-host.ts`, `scripts/test-process-debt.mjs`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |
| FUP-079f827e1b11eb1e | allocated | 2026-10-17T19:34:07.600Z | [WO-188-D006](../../evidence/WO-188/decisions.md#wo-188-d006--item-4-no-forced-removal-over-a-submodule-already-published-is-carried-a-dirty-derived-worktree-names-the-operator-the-record-exists-before-flags-parse); `packages/skeleton/src/gate-evidence.mjs`, `scripts/release.mjs`, `scripts/test-process-debt.mjs`, `scripts/test-release.sh`, `scripts/worktree.mjs` | Source extraction with Python; disposition evidence below |
| FUP-0c10689747f83675 | allocated | 2026-10-17T19:34:07.661Z | [WO-186-D033](../../evidence/WO-186/decisions.md#wo-186-d033--repair-the-read-guards-root-and-ancestor-walks-state-the-copy-and-shell-boundary); `docs/LEGAL.md`, `docs/control/budgets.json`, `docs/evidence/WO-999/report.md`, `docs/releases/tag-manifest.template.json`, `packages/skeleton/test/codex-episode.test.ts`, `scripts/docs-check.mjs`, `scripts/test-helper-reuse.mjs`, `scripts/test-license-fixture.mjs`, `scripts/test-license-surfaces.mjs`, `scripts/test-process-debt.mjs`, `scripts/test-release.sh`, `scripts/test-runner.test.mjs`, `scripts/test-worktree.sh` | Source extraction with Python; disposition evidence below |
| FUP-0e424834e4030880 | allocated | 2026-10-17T19:34:07.721Z | [WO-140-D001](../../evidence/WO-140/decisions.md#wo-140-d001--declare-from-the-receipts-skeleton-only-the-hooks-denial-is-the-probe-not-a-suite-cause); `docs/final-reviews/WO-068/FINAL-001.md`, `docs/final-reviews/WO-121/FINAL-001.md`, `docs/verifications/WO-121/VER-001.md`, `docs/verifications/WO-134/VER-001.md`, `scripts/harness.mjs` | Source extraction with Python; disposition evidence below |
| FUP-4475529d727a4d25 | allocated | 2026-10-17T19:34:07.782Z | [WO-142-D009](../../evidence/WO-142/decisions.md#wo-142-d009--board-up-two-lexical-module-entry-guards-outside-row-a13s-ten-scripts); `corpus/harness/generator-runtime.mjs`, `corpus/mutation/mutate.mjs`, `docs/verifications/WO-142/VER-001.md`, `scripts/lib/paths.mjs` | Source extraction with Python; disposition evidence below |
| FUP-5094b24d6d68d2e4 | allocated | 2026-10-17T19:34:07.842Z | [WO-186-D047](../../evidence/WO-186/decisions.md#wo-186-d047--final-review-pass-at-the-repaired-identity-five-low-items-boarded-with-one-follow-up); `packages/skeleton/src/gate-evidence.mjs`, `scripts/lib/case-reporter.mjs`, `scripts/lib/product-read-guard.mjs`, `scripts/test-runner.mjs`, `scripts/test-runner.test.mjs` | Source extraction with Python; disposition evidence below |
| FUP-511b5a41d831fe83 | allocated | 2026-10-17T19:34:07.902Z | [WO-186-D036](../../evidence/WO-186/decisions.md#wo-186-d036--record-the-document-gates-rise-the-lane-peer-growth-and-the-harness-cases-after-median); See source section | Source extraction with Python; disposition evidence below |
| FUP-51c310284c2fea17 | allocated | 2026-10-17T19:34:07.962Z | [WO-168-D018](../../evidence/WO-168/decisions.md#wo-168-d018--final-review-pass-and-board-one-hedge-edge-and-two-fixture-observations); `packages/skeleton/src/observed-facts.ts`, `scripts/resume.mjs`, `scripts/test-fixture-temporary.mjs`, `scripts/test-harness.mjs` | Source extraction with Python; disposition evidence below |
| FUP-5e52eb500e395237 | allocated | 2026-10-17T19:34:08.023Z | [WO-186-D038](../../evidence/WO-186/decisions.md#wo-186-d038--board-two-reuse-boundaries-the-repair-leaves-as-they-are); `packages/skeleton/src/gate-evidence.mjs`, `packages/skeleton/src/harness-host.ts`, `scripts/build.mjs`, `scripts/lib/harness.mjs`, `scripts/lib/lifecycle-evidence.mjs`, `scripts/resume.mjs` | Source extraction with Python; disposition evidence below |
| FUP-6125f53234c75af3 | allocated | 2026-10-17T19:34:08.084Z | [WO-213-D024](../../evidence/WO-213/decisions.md#wo-213-d024); `docs/control/local/adjacent-work.json`, `scripts/docs-check.mjs`, `scripts/launchpad.mjs`, `scripts/lib/contributions.mjs`, `scripts/lib/control-store.mjs`, `scripts/lib/private-paths.mjs`, `scripts/reader.mjs`, `scripts/test-license-surfaces.mjs`, `scripts/test-runner.mjs`, `scripts/test-worktree.sh` | Source extraction with Python; disposition evidence below |
| FUP-642d7a4beaed2272 | allocated | 2026-10-17T19:34:08.146Z | [WO-188-D045](../../evidence/WO-188/decisions.md#wo-188-d045--observation-the-runners-format-preflight-fixture-failed-once-under-the-full-review-gate-and-passed-alone); `scripts/lib/github-body.mjs`, `scripts/test-github-body.mjs`, `scripts/test-runner.mjs`, `scripts/test-runner.test.mjs`, `scripts/test-worktree.sh` | Source extraction with Python; disposition evidence below |
| FUP-8bac5e3bddd12494 | allocated | 2026-10-17T19:34:08.207Z | [WO-198-D021](../../evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning); `docs/final-reviews/WO-198/PR.md`, `scripts/harness.mjs`, `scripts/test-runner.test.mjs` | Source extraction with Python; disposition evidence below |
| FUP-92711a92e1d05874 | allocated | 2026-10-17T19:34:08.268Z | [WO-210-D013](../../evidence/WO-210/decisions.md#wo-210-d013--verification-the-target-suites-growth-recorded-for-the-planning-receipts-criterion24-condition); See source section | Source extraction with Python; disposition evidence below |
| FUP-94bff00e748a26af | allocated | 2026-10-17T19:34:08.329Z | [WO-168-D010](../../evidence/WO-168/decisions.md#wo-168-d010--item-8-the-stranded-comment-and-the-hedge-match); `packages/skeleton/src/harness-command.ts`, `packages/skeleton/src/observed-facts.ts`, `scripts/test-observed-facts.mjs` | Source extraction with Python; disposition evidence below |
| FUP-984094128fe71900 | allocated | 2026-10-17T19:34:08.390Z | [WO-200-D005](../../evidence/WO-200/decisions.md#wo-200-d005--verification-pass-ver-001-board-the-declaration-tests-textual-reading-of-the-formatter-ignore-list-which-a-negation-line-defeats); `corpus/harness/profile.mjs`, `corpus/harness/wo107-schema.test.mjs`, `docs/evidence/WO-200/verification-001-variation-probe.mjs`, `scripts/test-comment-labels.mjs` | Source extraction with Python; disposition evidence below |
| FUP-a566ba26ee9f909a | allocated | 2026-10-17T19:34:08.452Z | [WO-191-D013](../../evidence/WO-191/decisions.md#wo-191-d013); `docs/control/orders/WO-191.json`, `docs/control/reader-profiles.json`, `scripts/lib/reader-profiles.mjs`, `scripts/reader.mjs` | Source extraction with Python; disposition evidence below |
| FUP-b28b870422a74166 | allocated | 2026-10-17T19:34:08.513Z | [WO-174-D013](../../evidence/WO-174/decisions.md#wo-174-d013); `corpus/manifests/WO-101.json`, `docs/LEGAL.md`, `docs/control/outward-vocabulary.json`, `docs/control/resume.json`, `docs/evidence/WO-030/legacy-fold.json`, `scripts/license-surfaces.mjs` | Source extraction with Python; disposition evidence below |
| FUP-bf51ac5cd8143d98 | allocated | 2026-10-17T19:34:08.575Z | [WO-176-D006](../../evidence/WO-176/decisions.md#wo-176-d006); `packages/skeleton/src/gate-evidence.mjs` | Source extraction with Python; disposition evidence below |
| FUP-c1a89d52cc314af9 | allocated | 2026-10-17T19:34:08.636Z | [WO-185-D014](../../evidence/WO-185/decisions.md#wo-185-d014--held-descriptor-watches-and-the-recycled-identity-correction); `docs/control/budgets.json`, `scripts/harness.mjs`, `scripts/lib/host-guard-state.mjs`, `scripts/test-host-guard.test.mjs` | Source extraction with Python; disposition evidence below |
| FUP-cb5c3b3e7d0b0c0d | allocated | 2026-10-17T19:34:08.698Z | [WO-202-D005](../../evidence/WO-202/decisions.md#wo-202-d005); `packages/compiler/src/codex-continuation.mjs`, `packages/skeleton/src/gate-evidence.mjs` | Source extraction with Python; disposition evidence below |
| FUP-cb922b59e013dbf1 | allocated | 2026-10-17T19:34:08.760Z | [WO-123-D017](../../evidence/WO-123/decisions.md#wo-123-d017--boarded-the-harness-runtime-snapshot-misses-unlisted-transitive-imports); `.claude/hooks/session.mjs`, `scripts/harness.mjs`, `scripts/lib/harness.mjs` | Source extraction with Python; disposition evidence below |
| FUP-cde72b7860c03c18 | allocated | 2026-10-17T19:34:08.822Z | [WO-187-D021](../../evidence/WO-187/decisions.md#wo-187-d021--board-an-intermittent-off-ramps-fixture-failure); `scripts/test-off-ramps.mjs` | Source extraction with Python; disposition evidence below |
| FUP-d0a9719cc2e4ec55 | allocated | 2026-10-17T19:34:08.884Z | [WO-185-D006](../../evidence/WO-185/decisions.md#wo-185-d006--recorded-survivor-guarantee-limitation); `scripts/host-guard.mjs`, `scripts/lib/host-resources.mjs`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |
| FUP-d5605723a86254eb | allocated | 2026-10-17T19:34:08.946Z | [WO-187-D023](../../evidence/WO-187/decisions.md#wo-187-d023--guard-the-beacon-portability-fixture-against-gits-detached-repack-and-board-the-sweep); `scripts/test-beacon-portability.mjs`, `scripts/test-runner.test.mjs` | Source extraction with Python; disposition evidence below |
| FUP-de6162b279f66709 | allocated | 2026-10-17T19:34:09.009Z | [WO-187-D043](../../evidence/WO-187/decisions.md#wo-187-d043--recording-a-verification-result-waits-on-another-worktrees-test-lanes); `scripts/lib/handoff-ledger.mjs`, `scripts/lib/host-lanes.mjs`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |
| FUP-e18e6a5422109bfb | allocated | 2026-10-17T19:34:09.071Z | [WO-118-D011](../../evidence/WO-118/decisions.md#wo-118-d011--repair-dispatch-run-the-witnessed-rerun-and-restore-the-host-guard); `scripts/test-host-guard.test.mjs` | Source extraction with Python; disposition evidence below |
| FUP-e821aa2ced3aa111 | allocated | 2026-10-17T19:34:09.135Z | [WO-142-D017](../../evidence/WO-142/decisions.md#wo-142-d017--retain-the-remaining-observation-improvements-with-explicit-scope); `docs/evidence/WO-142/repair-002.md`, `docs/verifications/WO-142/VER-002.md`, `packages/skeleton/src/feedback-audit.ts`, `scripts/lib/git.mjs`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |
| FUP-e86366edbc1d5289 | allocated | 2026-10-17T19:34:09.198Z | [WO-112-D056](../../evidence/WO-112/decisions.md#wo-112-d056--preserve-the-unlocalized-loopback-failure-and-recheck-the-same-source); `packages/console/test/console-commands.test.ts` | Source extraction with Python; disposition evidence below |
| FUP-e8f5399db33d0b5a | allocated | 2026-10-17T19:34:09.261Z | [WO-185-D028](../../evidence/WO-185/decisions.md#wo-185-d028--ver-004-residual-low-severity-observations-in-the-repaired-guard-and-runner-left-with-a-follow-up); `scripts/host-guard.mjs`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |
| FUP-eafff4f96686f67d | allocated | 2026-10-17T19:34:09.325Z | [WO-213-D025](../../evidence/WO-213/decisions.md#wo-213-d025); `scripts/kit/README.client.md`, `scripts/lib/harness.mjs`, `scripts/lib/product-read-guard.mjs`, `scripts/test-runner.mjs`, `scripts/test-runner.test.mjs` | Source extraction with Python; disposition evidence below |
| FUP-f5f10101e717d59b | allocated | 2026-10-17T19:34:09.388Z | [WO-198-D004](../../evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded); `packages/skeleton/src/harness-host.ts`, `scripts/harness.mjs`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |
| FUP-851cba3a914ab359 | allocated | 2026-10-18T16:14:45.344Z | [WO-216-D034](../../evidence/WO-216/decisions.md#wo-216-d034--final-review-pass-final-002-at-the-integrated-subject-one-operator-packet-and-ten-follow-ups-two-corrected-in-this-review); `docs/PLAYBOOK.md`, `docs/control/local/harness/checks.json`, `docs/product/07-execution-guide.md`, `packages/skeleton/src/harness-host.ts`, `scripts/harness.mjs`, `scripts/lib/document-failures.mjs`, `scripts/lib/release-preparation.mjs`, `scripts/release.mjs`, `scripts/sync.mjs`, `scripts/test-resume.sh`, `scripts/test-runner.mjs`, `scripts/test-target-worktree.mjs`, `scripts/test-verifier-gate-claims.mjs`, `scripts/test-worktree.mjs`, `scripts/worktree.mjs` | Source extraction with Python; disposition evidence below |
| FUP-9de14a69403e2b32 | allocated | 2026-10-18T16:14:45.431Z | [WO-216-D032](../../evidence/WO-216/decisions.md#wo-216-d032--bounded-follow-ups-taken-in-this-repair-and-the-two-left-with-a-follow-up); `scripts/fixtures/launchpad-cases.json`, `scripts/test-concurrent-control.mjs`, `scripts/test-configuration-root.mjs`, `scripts/test-harness.mjs` | Source extraction with Python; disposition evidence below |
| FUP-fb8cbeabbddef397 | allocated | 2026-10-18T16:14:45.516Z | [candidate](../../product/07-execution-guide.md#discipline); See source section | Source extraction with Python; disposition evidence below |
| FUP-211986cdaa9f8c4f | allocated | 2026-10-18T16:14:45.602Z | [candidate](../../planning/work-order-map.md#candidates--returns-from-the-standard-pass-with-the-operators-comments-recorded-2026-10-17); See source section | Source extraction with Python; disposition evidence below |
| FUP-16ba63c02aa91dfa | allocated | 2026-10-19T22:59:39.009Z | [WO-222-D021](../../evidence/WO-222/decisions.md#wo-222-d021--final-review-pass-final-001-at-the-integrated-subject-the-cross-gate-overlap-lease-leads-three-boarded-follow-ups); `docs/control/budgets.json`, `docs/evidence/WO-222/after.json`, `docs/final-reviews/WO-222/FINAL-001.md`, `docs/product/07-execution-guide.md`, `scripts/harness.mjs`, `scripts/host-guard.mjs`, `scripts/lib/host-guard-state.mjs`, `scripts/lib/host-lanes.mjs`, `scripts/lib/host-resources.mjs`, `scripts/structural-checks.mjs`, `scripts/test-runner.mjs`, `scripts/test-target-worktree.mjs` | Source extraction with Python; disposition evidence below |
| FUP-464d273fa299e979 | allocated | 2026-10-19T22:59:39.089Z | [WO-222-D009](../../evidence/WO-222/decisions.md#wo-222-d009); See source section | Source extraction with Python; disposition evidence below |
| FUP-66085a13c95d0f34 | allocated | 2026-10-19T22:59:39.166Z | [WO-222-D018](../../evidence/WO-222/decisions.md#wo-222-d018); `docs/evidence/WO-222/verification-001/probes.mjs`, `scripts/lib/bounded-command.mjs`, `scripts/lib/host-guard-state.mjs`, `scripts/lib/host-lanes.mjs`, `scripts/lib/host-resources.mjs`, `scripts/structural-checks.mjs`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |
| FUP-86d6b525c49adce8 | allocated | 2026-10-19T22:59:39.243Z | [WO-222-D019](../../evidence/WO-222/decisions.md#wo-222-d019); `docs/evidence/WO-222/after.json`, `docs/evidence/WO-222/before.json`, `docs/evidence/WO-222/verification-001/probes.mjs`, `scripts/lib/gate-scheduling-baseline.json`, `scripts/test-runner.mjs` | Source extraction with Python; disposition evidence below |

<!-- disposition-evidence:start -->

## Expanded baseline rows

These nineteen rows come from the same pre-implementation export; the operator added them after the changed-file query exposed them. The original 39 were allocated and outside the pending count. These nineteen were pending.

| Row | Base status | Last disposition at | Source |
| --- | --- | --- | --- |
| FUP-fa028783f3f6b17f | deferred | 2026-10-16T02:47:35.603Z | [Meter and closeout residue.](../../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-09-21) |
| FUP-3d6a8147368bdf1c | deferred | 2026-10-05T21:05:23.328Z | [A gate marker with no birth observation never expires.](../../planning/work-order-map.md#candidates--returns-from-the-onesie-twosie-pass-recorded-2026-09-27) |
| FUP-2518166a22767f47 | deferred | 2026-10-13T19:07:14.219Z | [Gate suites inherit DOTLN_LAUNCHPAD from the invoking environment.](../../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-13) |
| FUP-b202062fc3cbbbd7 | deferred | 2026-10-18T15:13:00.702Z | [A copied gate record carries an absolute read-log path.](../../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-13) |
| FUP-d40313eade76b8af | deferred | 2026-10-16T02:47:35.546Z | [A stale gate marker revived by a reused process id.](../../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-13) |
| FUP-182984d482ca59ca | deferred | 2026-10-20T20:18:30.397Z | [Measured claims: a judge-owned instrument, a symmetric baseline, per-component movement and the cold first-call row.](../../planning/work-order-map.md#candidates--returns-from-ideation-on-2026-10-16-recorded-2026-10-16) |
| FUP-a8cba0428eaf01a9 | deferred | 2026-10-18T16:14:46.114Z | [A final-review packet never names an override as an option.](../../planning/work-order-map.md#candidates--returns-from-the-fork-observations-pass-recorded-2026-10-18) |
| FUP-9cfc2253779e6c92 | deferred | 2026-10-20T20:18:31.146Z | [A retained log for a failed complete run.](../../planning/work-order-map.md#candidates--returns-from-the-entropy-pass-recorded-2026-10-20) |
| FUP-5f948dcc52e03082 | untriaged | No disposition | [WO-223-D018: The next order that edits scripts/lib/contributions.mjs. Name the declaration route in the FAIL line only when the instance declares no contributions.operatorAuthor, as the start…](../../evidence/WO-223/decisions.md#wo-223-d018) |
| FUP-e2152db6dd056b4a | untriaged | No disposition | [WO-223-D020: The next order that edits start or startTargetWorktree in scripts/worktree.mjs. Print the same one-line sign-off advisory after startTargetWorktree creates the launchpad worktree when…](../../evidence/WO-223/decisions.md#wo-223-d020) |
| FUP-f1c7a256bec46737 | open | 2026-10-20T20:18:30.609Z | [WO-054-D006: Raise the executor cold-start ceiling from 20,480 to 24,576 bytes and release-close from 12,288 to 16,384 bytes; record the measured rule growth and leave efficiency redesign for the oper](../../evidence/WO-054/decisions.md#wo-054-d006) |
| FUP-da505c82f2262b8e | deferred | 2026-09-19T01:20:05.548Z | [A second sign-off-exempt author identity.](../../planning/work-order-map.md#candidates--returns-from-the-cleanup-pass-recorded-2026-09-19) |
| FUP-ec72b2ea596bdc75 | deferred | 2026-10-03T16:13:47.243Z | [The planner's sentence on repairs after a judgment.](../../planning/work-order-map.md#candidates--returns-from-the-standard-pass-with-5s-and-the-operators-notes-recorded-2026-10-02) |
| FUP-6c4cc63ae71d02ad | untriaged | No disposition | [WO-223-D017: The next order that edits releaseCloseAdmission in packages/skeleton/src/harness-host.ts (WO-219 edits that file at its step 19). Classify a withheld suffix after removing the canonical…](../../evidence/WO-223/decisions.md#wo-223-d017) |
| FUP-4b70089b028849f0 | deferred | 2026-10-02T04:08:21.839Z | [ER5-002 — A deferred register row whose reopening condition has occurred is reopened or re-disposed by whoever observes the condition (the 2026-09-19 rule the 2026-09-30](../../planning/entropy-reviews/REVIEW-005.md#candidates--accepted-entropy-reducer-findings-review-review-005-recorded-2026-10-02) |
| FUP-8a4e201d861208ad | deferred | 2026-10-20T20:18:30.292Z | [Evidence-edition retention and the Codex session-identity join.](../../planning/work-order-map.md#candidates--returns-from-the-cleanup-pass-recorded-2026-09-19) |
| FUP-ea83176e777dd32f | deferred | 2026-10-17T19:34:07.300Z | [A target's own agent skills as convention input, and the open skills format declared.](../../planning/work-order-map.md#candidates--returns-from-ideation-on-2026-10-16-recorded-2026-10-16) |
| FUP-441469088613e52a | deferred | 2026-10-13T16:53:35.979Z | [Candidate — test the full rising and descending operator-absence curve](../../planning/full-absence-curve-experiment-2026-09-24.md#candidate--test-the-full-rising-and-descending-operator-absence-curve) |
| FUP-adf6621e7f958dd8 | deferred | 2026-09-30T14:01:27.072Z | [ER4-006 — Retained evidence links canonical inputs instead of copying them (docs/product/03-architecture.md §Corpus policy). WO-154 applied this to the self-host editions](../../planning/entropy-reviews/REVIEW-004.md#candidates--accepted-entropy-reducer-findings-review-review-004-recorded-2026-09-30) |

## Dispositions and executable controls

The table records 38 settled, 19 declined and one operator-deferred row. Nineteen is at most one third of 58. A decline chooses the documented NoOp and retains its known harm; it is not a claim of repair. The operator packet is FUP-d0a9719cc2e4ec55 in the handoff.

[Repair controls](repair-controls.json) record exact commands, base or scoped reversion, exit codes and log hashes. Each command ran serially through `node scripts/harness.mjs bounded --`; full-suite coverage remains the complete review gate’s duty.

| Row | Disposition | Decision and case or reason | Controls / base command |
| --- | --- | --- | --- |
| FUP-04ec9fa011f39d93 | declined | [WO-217-D004](decisions.md#wo-217-d004) — Keep complete-first executor handoff and decline expanding the shell redirect extractor into a partial shell interpreter. | Recorded NoOp / operator packet; no repair claimed |
| FUP-079f827e1b11eb1e | declined | [WO-217-D005](decisions.md#wo-217-d005) — Keep the explicit refusal for a committed submodule; do not add a partial gitlink adapter. | Recorded NoOp / operator packet; no repair claimed |
| FUP-0c10689747f83675 | settled | [WO-217-D006](decisions.md#wo-217-d006) — Retain the already implemented recursive read, watch, copy, blob and link observation boundaries. | `base-recursive-guard` |
| FUP-0e424834e4030880 | declined | [WO-217-D007](decisions.md#wo-217-d007) — Keep native sandbox cases visible as outside-sandbox work and preserve the closed WO-140 text with its existing correction. | Recorded NoOp / operator packet; no repair claimed |
| FUP-4475529d727a4d25 | settled | [WO-217-D008](decisions.md#wo-217-d008) — Use the shared physical module-entry guard for both corpus entry points. | `symlink-entry` |
| FUP-5094b24d6d68d2e4 | settled | [WO-217-D009](decisions.md#wo-217-d009) — Normalize TAP-quoted progress, read the hot index before archive enumeration, and observe glob reads. Keep parent tests in the five slowest observations. | `archive-rotation`, `tap-progress`, `glob-observation` |
| FUP-511b5a41d831fe83 | declined | [WO-217-D010](decisions.md#wo-217-d010) — Retain document-sensitive routing and the current lock-matrix concurrency; do not infer a new reservation from historical correlated timings. | Recorded NoOp / operator packet; no repair claimed |
| FUP-51c310284c2fea17 | settled | [WO-217-D011](decisions.md#wo-217-d011) — Match gate identity occurrences individually and retain writer ownership when append wrote its event before throwing. Keep the existing linked-root fixture. | `hedge-occurrences`, `append-after-write`, `base-linked-session-root`, `malformed-gate-identity` |
| FUP-5e52eb500e395237 | settled | [WO-217-D012](decisions.md#wo-217-d012) — Share the task-execution precedence policy between the runner, findGateCheck and typed product-gate correction. Retain the already complete runtime snapshot inventory. | `gate-standing`, `correct-standing`, `base-runtime-inventory`, `gate-self-validity`, `completion-self-validity`, `declared-suite-coverage` |
| FUP-6125f53234c75af3 | declined | [WO-217-D013](decisions.md#wo-217-d013) — Keep strict supplemental-journal parsing, instance-declared operator identity, and the current documented path and reader-profile widths. | Recorded NoOp / operator packet; no repair claimed |
| FUP-642d7a4beaed2272 | settled | [WO-217-D014](decisions.md#wo-217-d014) — Make an empty nested format result report its task timeline before the output assertion. | `empty-format-diagnostic` |
| FUP-8bac5e3bddd12494 | declined | [WO-217-D015](decisions.md#wo-217-d015) — Keep the historical runner-fixtures threshold as a warning; do not rebase it to make growth disappear. | Recorded NoOp / operator packet; no repair claimed |
| FUP-92711a92e1d05874 | declined | [WO-217-D016](decisions.md#wo-217-d016) — Retain the expanded launchpad and target-worktree case inventory and its bounded file scheduling. | Recorded NoOp / operator packet; no repair claimed |
| FUP-94bff00e748a26af | settled | [WO-217-D017](decisions.md#wo-217-d017) — Do not attribute a suffixed unknown command to a shorter known gate. | `hedge-occurrences`, `malformed-gate-identity`, `single-flag-identity`, `command-prefix-identity`, `nonnegative-gate-duration` |
| FUP-984094128fe71900 | settled | [WO-217-D018](decisions.md#wo-217-d018) — Check Prettier effective ignore behavior in both collector declarations. | `effective-ignore-comment`, `effective-ignore-corpus` |
| FUP-a566ba26ee9f909a | settled | [WO-217-D019](decisions.md#wo-217-d019) — Compute critical-path work from recorded task duration and leave lane waiting in wait time. | `timeline-wait` |
| FUP-b28b870422a74166 | declined | [WO-217-D020](decisions.md#wo-217-d020) — Keep document checks responsible for document inputs and product identity responsible for code and declared vocabulary; decline an unbounded admitted-input-list redesign. | Recorded NoOp / operator packet; no repair claimed |
| FUP-bf51ac5cd8143d98 | settled | [WO-217-D021](decisions.md#wo-217-d021) — Exclude only untracked directory entries under protected docs/intake from the candidate tree. | `private-intake` |
| FUP-c1a89d52cc314af9 | declined | [WO-217-D022](decisions.md#wo-217-d022) — Do not hot-swap a live guard merely because another checkout has different code. | Recorded NoOp / operator packet; no repair claimed |
| FUP-cb5c3b3e7d0b0c0d | declined | [WO-217-D023](decisions.md#wo-217-d023) — Retain the qualified colocated default export and decline claiming relocated build-free local-lane support. | Recorded NoOp / operator packet; no repair claimed |
| FUP-cb922b59e013dbf1 | settled | [WO-217-D024](decisions.md#wo-217-d024) — Retain full runtime-package inventory snapshots already implemented at the base. | `base-runtime-inventory` |
| FUP-cde72b7860c03c18 | settled | [WO-217-D025](decisions.md#wo-217-d025) — Use recorded checkpoint references rather than assuming event ordinals equal checkpoint numbers. | `checkpoint-subject` |
| FUP-d0a9719cc2e4ec55 | deferred | [WO-217-D026](decisions.md#wo-217-d026) — Retain the polling and descriptor ownership guard without claiming absolute descendant containment; present the operator-owned host mechanism choice on this order’s pull request. | Recorded NoOp / operator packet; no repair claimed |
| FUP-d5605723a86254eb | settled | [WO-217-D027](decisions.md#wo-217-d027) — Disable automatic Git maintenance on fixture commit and clone entry points. | `fixture-maintenance` |
| FUP-de6162b279f66709 | settled | [WO-217-D028](decisions.md#wo-217-d028) — Retain completion’s already implemented consumption of document evidence without an inline gate. | `base-completion-claims` |
| FUP-e18e6a5422109bfb | settled | [WO-217-D029](decisions.md#wo-217-d029) — Republish a missing live guard record under its held lock and retire unadopted startup children. | `guard-record` |
| FUP-e821aa2ced3aa111 | declined | [WO-217-D030](decisions.md#wo-217-d030) — Retain working aliases, bounded Git batches and strict effort spelling; decline speculative parser and transport rewrites. | Recorded NoOp / operator packet; no repair claimed |
| FUP-e86366edbc1d5289 | settled | [WO-217-D031](decisions.md#wo-217-d031) — Preserve sanitized command and nested error codes for console fetch failures without private token or argument material. | `nested-fetch-cause` |
| FUP-e8f5399db33d0b5a | settled | [WO-217-D032](decisions.md#wo-217-d032) — Retain one handled set for stopped members, preserve in-memory resource-stop classification, report cleanup signal errors and distinguish registration withdrawal. Retain validated inherited leases. | `handled-members`, `signal-in-memory`, `withdrawal-kind`, `cleanup-signals`, `base-inherited-lease`, `inherited-entry-retry` |
| FUP-eafff4f96686f67d | declined | [WO-217-D033](decisions.md#wo-217-d033) — Keep instance plain and review gates document-kind. | Recorded NoOp / operator packet; no repair claimed |
| FUP-f5f10101e717d59b | settled | [WO-217-D034](decisions.md#wo-217-d034) — Choose the latest comparable shared-ref snapshot rather than the latest wrapper row. | `shared-ref-predecessor`, `base-malformed-snapshots` |
| FUP-851cba3a914ab359 | settled | [WO-217-D035](decisions.md#wo-217-d035) — Sanitize copied evidence at every depth, classify sync failures before writing, retain named orphan revisions, and cover completion row states and the remaining bookkeeping clauses. | `copy-output`, `sync-classification`, `sync-real-checker-reports`, `kit-predecessor`, `doc-base-build`, `base-completion-claims`, `base-target-claims`, `base-terms-and-clone`, `sync-declarations`, `finish-copy-output`, `stopped-lookup` |
| FUP-9de14a69403e2b32 | settled | [WO-217-D036](decisions.md#wo-217-d036) — Make every named hand-copied control entry use a checked fixture-input declaration. | `copy-closure`, `registration-remedies` |
| FUP-fb8cbeabbddef397 | declined | [WO-217-D037](decisions.md#wo-217-d037) — Retain per-run Markdown parsing; decline a persistent parse cache without a demonstrated end-to-end saving. | Recorded NoOp / operator packet; no repair claimed |
| FUP-211986cdaa9f8c4f | settled | [WO-217-D038](decisions.md#wo-217-d038) — Retain the already implemented one explicit final document check and no inline completion check. | `base-completion-claims` |
| FUP-16ba63c02aa91dfa | settled | [WO-217-D039](decisions.md#wo-217-d039) — Hold full exclusive host capacity while lending overlap to nested light peers, state the conservative per-lane bare/session budget, and give the gate-share refusal remedy. | `exclusive-reservation`, `host-remedy`, `base-bare-group-budget` |
| FUP-464d273fa299e979 | declined | [WO-217-D040](decisions.md#wo-217-d040) — Decline a new-client-only fair queue while fixed-four clients publish no waiting intent. | Recorded NoOp / operator packet; no repair claimed |
| FUP-66085a13c95d0f34 | settled | [WO-217-D041](decisions.md#wo-217-d041) — Report malformed or invalid host capacity by record label, observed problem and a concrete repair route. | `capacity-diagnostic` |
| FUP-86d6b525c49adce8 | settled | [WO-217-D042](decisions.md#wo-217-d042) — Classify a task light only when every held sample meets both bounds. | `light-all-samples` |
| FUP-fa028783f3f6b17f | settled | [WO-217-D043](decisions.md#wo-217-d043) — Leave PR draft creation with the reviewer; release preparation updates a meter only in an existing draft and retains its separate snapshot. | `pr-draft-owner` |
| FUP-3d6a8147368bdf1c | settled | [WO-217-D044](decisions.md#wo-217-d044) — Reject a legacy active marker when the observed process was born after the marker. | `legacy-marker` |
| FUP-2518166a22767f47 | settled | [WO-217-D045](decisions.md#wo-217-d045) — Remove invoking DOTLN_LAUNCHPAD from fixture suite environments. | `launchpad-environment` |
| FUP-b202062fc3cbbbd7 | settled | [WO-217-D046](decisions.md#wo-217-d046) — Store product read logs relative to the gate repository. | `relative-read-log` |
| FUP-d40313eade76b8af | settled | [WO-217-D047](decisions.md#wo-217-d047) — Apply the same legacy marker birth comparison to the reused-PID candidate. | `legacy-marker` |
| FUP-182984d482ca59ca | declined | [WO-217-D048](decisions.md#wo-217-d048) — Decline calling an unfinished five-close study complete or imposing a universal benchmark recipe from it. Retain its three observed closes and current executor cutoff. | Recorded NoOp / operator packet; no repair claimed |
| FUP-a8cba0428eaf01a9 | settled | [WO-217-D049](decisions.md#wo-217-d049) — Make all reviewer packet options viable under ordinary authority and state a safe default. | `reviewer-packet` |
| FUP-9cfc2253779e6c92 | settled | [WO-217-D050](decisions.md#wo-217-d050) — Retain an addressed diagnostic for failed complete runs and carry its verified content when worktree finish copies evidence. | `complete-failure-log`, `copied-failure-log` |
| FUP-5f948dcc52e03082 | settled | [WO-217-D051](decisions.md#wo-217-d051) — Offer the operatorAuthor declaration remedy only when no author is declared. | `signoff-remedy` |
| FUP-e2152db6dd056b4a | settled | [WO-217-D052](decisions.md#wo-217-d052) — Print the same conditional sign-off advisory after target start creates its launchpad worktree. | `target-signoff` |
| FUP-f1c7a256bec46737 | settled | [WO-217-D053](decisions.md#wo-217-d053) — Shorten repeated role wording while preserving every duty, command, exception, authority limit and ceiling. | `bounded-role-efficiency` |
| FUP-da505c82f2262b8e | declined | [WO-217-D054](decisions.md#wo-217-d054) — Keep one instance-declared sign-off-exempt author and decline adding a second identity, as the operator chose. | Recorded NoOp / operator packet; no repair claimed |
| FUP-ec72b2ea596bdc75 | settled | [WO-217-D055](decisions.md#wo-217-d055) — Say explicitly that judgment reuse grants no authority to edit judged planning text. | `planner-repair-authority` |
| FUP-6c4cc63ae71d02ad | settled | [WO-217-D056](decisions.md#wo-217-d056) — Classify the remainder after canonical publish material arguments, identify dry-run material use, and display the host-permission boundary once. | `release-close-classification`, `release-close-single-advisory` |
| FUP-4b70089b028849f0 | declined | [WO-217-D057](decisions.md#wo-217-d057) — Decline a partial natural-language lifecycle-trigger parser; retain explicit re-disposition by the observer and state that unexamined conditions remain unknown. | Recorded NoOp / operator packet; no repair claimed |
| FUP-8a4e201d861208ad | declined | [WO-217-D058](decisions.md#wo-217-d058) — Retain immutable evidence and decline pruning or a new retention ceiling; retain the current explicit Codex thread-to-session readback. | Recorded NoOp / operator packet; no repair claimed |
| FUP-ea83176e777dd32f | settled | [WO-217-D066](decisions.md#wo-217-d066) — Declare the open Agent Skills format in runtime profiles, validate the generated native frontmatter, and name pinned target skills as convention inputs without effect authority. | `skills-format`, `skills-frontmatter` |
| FUP-441469088613e52a | declined | [WO-217-D068](decisions.md#wo-217-d068) — Decline adding or claiming a measured absence-curve allocator from the present starter; preserve the comparative experiment and its concrete reopening conditions. | Recorded NoOp / operator packet; no repair claimed |
| FUP-adf6621e7f958dd8 | settled | [WO-217-D069](decisions.md#wo-217-d069) — New authority revisions reference an unchanged canonical transcript by path, Git blob identity and byte count; checks resolve the transcript while historical full editions remain immutable. | `authority-reference-encoding`, `authority-cli-reference`, `authority-destination` |

The applied register readback below records the pending-count movement. The final measurements and validation section records the document samples and complete-run retention judgment.

<!-- disposition-evidence:end -->

<!-- register-readback:start -->

## Applied register readback

All 58 canonical `followups --show` commands passed. The terminal dispositions are 38 settled, 19 declined and one operator-deferred. The register held 166 pending rows at activation and holds 148 after this application: the nineteen added pending rows were resolved, while one originally allocated row became operator-deferred. The original 39 allocated rows were not part of the activation pending count.

The final changed-file query lists only FUP-d0a9719cc2e4ec55, which was allocated at activation and now carries the explicit operator packet. Thus no matching row pending at activation remains. [Readback receipts](register-readback.json) identify every command and result.

| Row | Before | After | Latest disposition at | Decision |
| --- | --- | --- | --- | --- |
| FUP-04ec9fa011f39d93 | allocated | declined | 2026-10-21T03:18:22.146Z | WO-217-D004 |
| FUP-079f827e1b11eb1e | allocated | declined | 2026-10-21T03:18:22.275Z | WO-217-D005 |
| FUP-0c10689747f83675 | allocated | settled | 2026-10-21T03:18:22.387Z | WO-217-D006 |
| FUP-0e424834e4030880 | allocated | declined | 2026-10-21T03:18:22.500Z | WO-217-D007 |
| FUP-4475529d727a4d25 | allocated | settled | 2026-10-21T03:18:22.610Z | WO-217-D008 |
| FUP-5094b24d6d68d2e4 | allocated | settled | 2026-10-21T03:18:22.725Z | WO-217-D009 |
| FUP-511b5a41d831fe83 | allocated | declined | 2026-10-21T03:18:22.843Z | WO-217-D010 |
| FUP-51c310284c2fea17 | allocated | settled | 2026-10-21T03:18:22.953Z | WO-217-D011 |
| FUP-5e52eb500e395237 | allocated | settled | 2026-10-21T03:18:23.063Z | WO-217-D012 |
| FUP-6125f53234c75af3 | allocated | declined | 2026-10-21T03:18:23.174Z | WO-217-D013 |
| FUP-642d7a4beaed2272 | allocated | settled | 2026-10-21T03:18:23.286Z | WO-217-D014 |
| FUP-8bac5e3bddd12494 | allocated | declined | 2026-10-21T03:18:23.394Z | WO-217-D015 |
| FUP-92711a92e1d05874 | allocated | declined | 2026-10-21T03:18:23.502Z | WO-217-D016 |
| FUP-94bff00e748a26af | allocated | settled | 2026-10-21T03:18:23.611Z | WO-217-D017 |
| FUP-984094128fe71900 | allocated | settled | 2026-10-21T03:18:23.721Z | WO-217-D018 |
| FUP-a566ba26ee9f909a | allocated | settled | 2026-10-21T03:18:23.827Z | WO-217-D019 |
| FUP-b28b870422a74166 | allocated | declined | 2026-10-21T03:18:23.929Z | WO-217-D020 |
| FUP-bf51ac5cd8143d98 | allocated | settled | 2026-10-21T03:18:24.030Z | WO-217-D021 |
| FUP-c1a89d52cc314af9 | allocated | declined | 2026-10-21T03:18:24.131Z | WO-217-D022 |
| FUP-cb5c3b3e7d0b0c0d | allocated | declined | 2026-10-21T03:18:24.237Z | WO-217-D023 |
| FUP-cb922b59e013dbf1 | allocated | settled | 2026-10-21T03:18:24.341Z | WO-217-D024 |
| FUP-cde72b7860c03c18 | allocated | settled | 2026-10-21T03:18:24.445Z | WO-217-D025 |
| FUP-d0a9719cc2e4ec55 | allocated | deferred | 2026-10-21T03:18:24.548Z | WO-217-D026 |
| FUP-d5605723a86254eb | allocated | settled | 2026-10-21T03:18:24.653Z | WO-217-D027 |
| FUP-de6162b279f66709 | allocated | settled | 2026-10-21T03:18:24.754Z | WO-217-D028 |
| FUP-e18e6a5422109bfb | allocated | settled | 2026-10-21T03:18:24.857Z | WO-217-D029 |
| FUP-e821aa2ced3aa111 | allocated | declined | 2026-10-21T03:18:24.959Z | WO-217-D030 |
| FUP-e86366edbc1d5289 | allocated | settled | 2026-10-21T03:18:25.062Z | WO-217-D031 |
| FUP-e8f5399db33d0b5a | allocated | settled | 2026-10-21T03:18:25.165Z | WO-217-D032 |
| FUP-eafff4f96686f67d | allocated | declined | 2026-10-21T03:18:25.268Z | WO-217-D033 |
| FUP-f5f10101e717d59b | allocated | settled | 2026-10-21T03:18:25.368Z | WO-217-D034 |
| FUP-851cba3a914ab359 | allocated | settled | 2026-10-21T03:18:25.465Z | WO-217-D035 |
| FUP-9de14a69403e2b32 | allocated | settled | 2026-10-21T03:18:25.564Z | WO-217-D036 |
| FUP-fb8cbeabbddef397 | allocated | declined | 2026-10-21T03:18:25.661Z | WO-217-D037 |
| FUP-211986cdaa9f8c4f | allocated | settled | 2026-10-21T03:18:25.759Z | WO-217-D038 |
| FUP-16ba63c02aa91dfa | allocated | settled | 2026-10-21T03:18:25.856Z | WO-217-D039 |
| FUP-464d273fa299e979 | allocated | declined | 2026-10-21T03:18:25.952Z | WO-217-D040 |
| FUP-66085a13c95d0f34 | allocated | settled | 2026-10-21T03:18:26.050Z | WO-217-D041 |
| FUP-86d6b525c49adce8 | allocated | settled | 2026-10-21T03:18:26.147Z | WO-217-D042 |
| FUP-fa028783f3f6b17f | deferred | settled | 2026-10-21T03:18:26.244Z | WO-217-D043 |
| FUP-3d6a8147368bdf1c | deferred | settled | 2026-10-21T03:18:26.342Z | WO-217-D044 |
| FUP-2518166a22767f47 | deferred | settled | 2026-10-21T03:18:26.443Z | WO-217-D045 |
| FUP-b202062fc3cbbbd7 | deferred | settled | 2026-10-21T03:18:26.543Z | WO-217-D046 |
| FUP-d40313eade76b8af | deferred | settled | 2026-10-21T03:18:26.643Z | WO-217-D047 |
| FUP-182984d482ca59ca | deferred | declined | 2026-10-21T03:18:26.742Z | WO-217-D048 |
| FUP-a8cba0428eaf01a9 | deferred | settled | 2026-10-21T03:18:26.842Z | WO-217-D049 |
| FUP-9cfc2253779e6c92 | deferred | settled | 2026-10-21T03:18:26.942Z | WO-217-D050 |
| FUP-5f948dcc52e03082 | untriaged | settled | 2026-10-21T03:18:27.042Z | WO-217-D051 |
| FUP-e2152db6dd056b4a | untriaged | settled | 2026-10-21T03:18:27.141Z | WO-217-D052 |
| FUP-f1c7a256bec46737 | open | settled | 2026-10-21T03:18:27.239Z | WO-217-D053 |
| FUP-da505c82f2262b8e | deferred | declined | 2026-10-21T03:18:27.337Z | WO-217-D054 |
| FUP-ec72b2ea596bdc75 | deferred | settled | 2026-10-21T03:18:27.434Z | WO-217-D055 |
| FUP-6c4cc63ae71d02ad | untriaged | settled | 2026-10-21T03:18:27.532Z | WO-217-D056 |
| FUP-4b70089b028849f0 | deferred | declined | 2026-10-21T03:21:45.914Z | WO-217-D057 |
| FUP-8a4e201d861208ad | deferred | declined | 2026-10-21T03:21:46.025Z | WO-217-D058 |
| FUP-ea83176e777dd32f | deferred | settled | 2026-10-21T03:30:48.020Z | WO-217-D066 |
| FUP-441469088613e52a | deferred | declined | 2026-10-21T03:44:29.797Z | WO-217-D068 |
| FUP-adf6621e7f958dd8 | deferred | settled | 2026-10-21T03:44:29.908Z | WO-217-D069 |

<!-- register-readback:end -->

## Final measurements and validation

`npm test -- --review --again --keep-going` passed at 2026-10-21T10:08:45.941Z in 1,608.746 s, code identity `2cd81e4c8286ba58ba899a3eafc38ee59945749cfb68f20f5c8c759ef275c9f8`, with 109 fresh tasks, zero reused suites and no unrun suites. `gate-runs.json` preserves every complete attempt and the successful current subject.

D080 predeclared three fresh complete passing reviews at the final identity, including the first after editing and retaining normal priority-history changes; all three enter the statistic. D081 preserves the earlier passing series at its historical identity and repeats the protocol after repairing the document fixture. The 3-sample current complete-run median is 1,589.498 s, within the order's unchanged 1,668.518 s threshold; the overlap and light-classification repairs therefore meet the retention condition. The historical baseline has three samples. This comparison supports retention at this subject and does not establish causal speedup or equal variance.

The three fresh document samples before and after are in `document-measurements.json`. Gate medians are 162.763 s before and 141.659 s after; summed task-work medians are 281.003 s and 265.053 s. Critical-path work medians are 151.022 s and 141.300 s, with waiting medians 11.766 s and 0.132 s. `docs-check` work medians are 24.424 s and 22.127 s; `resume` work medians are 93.273 s and 89.376 s. Each sample executes all 27 document tasks with zero reuse. The baseline is the earlier in-order subject, not the activation checkout. The first observations are retained and OS caches were not flushed. The six passing runs and the retained failed after-document attempt are measurement overhead, followed by the separate final handoff gate. D037 retains exact parsing; D038 retains completion without an inline gate. Neither is presented as a parse-cache speedup or a reduction in this order's total run count.

The final current-tree document gate is recorded by the implementation-ready event after the handoff is complete. [Executor handoff](handoff.md) records the criterion judgments, worker findings and the operator packet.

## Repair of VER-001

The `resume: fix` dispatch repairs F1 and the three bounded evidence follow-ups. [D087–D090](decisions.md#wo-217-d087) record the choices and same-day corrections. The immutable verification and its original evidence remain unchanged.

- F1: the classifier recognizes the inventory’s actual sibling-page, manifest-hash and generated tag-observation reports and the missing/malformed work-order tag snapshot. The 26-message compatibility case covers every regenerable checker; non-1 exits, timeouts, unavailable checks and unrelated failures retain refusal. The real inventory case regenerates the sibling and work-order outputs to their expected bytes.
- `sync-real-checker-reports` is the additional paired control: positive exit 0; reverting only the repaired diagnostic patterns gives exit 1 on the missing tag-snapshot assertion. [The control driver](sync-classification-control.mjs) reproduces both arms without reverting the worktree. The original 70 controls remain, for 62 paired controls and nine base proofs in total.
- F2: eleven suite labels now match the runner’s executing suites. The two pre-format reversions carry the verifier’s formatted text. A bounded current-source audit matched all 64 literal reversions across the 71 records; it does not claim to rerun their unchanged behavior.
- F3: the register retains the original 120 s document-median and twenty-runs-per-closed-order triggers. The observed 141.659 s median was reconsidered; the measured NoOp remains because parsing has no demonstrated whole-gate cache benefit. The threshold was not raised.
- F4: only the three decisions recording actual operator instructions retain operator-direction labels. `npm run meta` now reports three directions. The canonical amendment helper rebound the four affected planning decisions to the unchanged work order.

The six canonical dispositions applied at register revision `e84380b0156e745b6de7e5a1c116e921c60a8852870b8076af3eee732d111bb0`: all four verification follow-ups are settled; the two original performance rows retain declined/settled status with corrected numeric conditions. The initial 166-to-148 movement above remains historical. Verification added four rows (152 pending), and this repair settles those four. Current gate and register evidence is recorded in the handoff after validation.

## Current repair validation

The three fresh complete repair reviews at code identity 8d059c13c38513e0a55b4d3e931b086a13e76ef465f05389750af8d82623604a passed in 25 min 19 s, 25 min 3 s, 25 min 5 s; their median is 25 min 5 s, satisfying the unchanged limit recorded in gate-runs.json. Prose durations are rounded to whole seconds; that record retains the exact milliseconds. Each executed all 109 tasks across 44 required suites, with zero reuse, no unrun or stale suites, and unchanged source/build identities. Both the commands and canonical waiters exited 0. The last row is recorded at 2026-10-21T21:18:01.618Z. gate-runs.json retains every attempt, the first observation, normal priority history, all prior validation series, including the failed correctness and timing candidates. This establishes retention at the current subject, not a causal speedup or equal variance.

D092 retains the sync-fixture reduction and its failed timing series. D093 rejects the scheduling experiments. D094 records the native Git dispatcher, its paired real-case comparison, argument and local-transport parity, and the passing current-source target-close case. D095 restores the two source-rewriting fault injections exposed by the first native-dispatch review, asserts that each mutation applies, and records passing focused cases and ordinary-command parity. D096 rejects that repaired candidate's two-sample timing series and all higher-priority models. D097 records the larger vertical-fixture saving, its seventeen configuration and command checks, and the unselected cleanup-wrapper comparison. Every fixture case, real artifact check, full-inventory formatting check, deadline and scheduling rule remains. All unsuccessful repair candidates remain in the historical record; no unmeasured sample is claimed.

[The repair register readback](repair-register-readback.json) records all 58 original rows at their latest dispositions and all four verification follow-ups settled. The final document result is bound to the current-tree row consumed by repair completion.
