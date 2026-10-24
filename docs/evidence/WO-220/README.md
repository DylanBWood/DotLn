# WO-220 execution evidence

## Before

Observed 2026-10-24T05:21:43.913812+00:00; base `f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1`; activation `2026-10-24T05:19:10.126Z`; register revision `c7dcb59dd3e0489122e3652a5c15a53f8054de6d68d26980c114ed8e4ecd8eb2`. Pending rows: **178**. All twenty listed rows are allocated and already excluded from the pending count. No decrease by twenty will be claimed.

This table was written before any implementation fix. Source decisions were read in full. Restatements describe source inspection, not a passing regression; executed controls are recorded separately as they run.

| Row | Latest disposition | Source | Surfaces and baseline restatement |
| --- | --- | --- | --- |
| 1. FUP-06abc143a1c52367 | allocated, 2026-10-17T19:34:14.081Z | [wo-099-d016](../../evidence/WO-099/decisions.md#wo-099-d016) | `mission-check-source.ts; mission-check.test.ts`. Diff sections remain smallest-first; every omitted path holds the verdict. No declared generated-evidence selection policy. |
| 2. FUP-165f9860f8f32a67 | allocated, 2026-10-17T19:34:14.157Z | [wo-117-d007](../../evidence/WO-117/decisions.md#wo-117-d007) | `packages/console/src/live.ts; live.test.ts`. Each refresh reads and audit-projects the whole log; the event baseline is replaced even after failed decode; no freshness line is rendered. |
| 3. FUP-2341c85c58331f3e | allocated, 2026-10-17T19:34:14.233Z | [wo-103-d004](../../evidence/WO-103/decisions.md#wo-103-d004) | `audit.ts; wo103-authority.test.mjs`. Refusal linkage still requires an empty or complete semantic input suffix; partial truthful suffixes are excluded. |
| 4. FUP-2b9a8e696b38fb97 | allocated, 2026-10-17T19:34:14.308Z | [wo-118-d018--final-review-follow-up-live-status-misses-how-a-resident-owned-continuation-ends](../../evidence/WO-118/decisions.md#wo-118-d018--final-review-follow-up-live-status-misses-how-a-resident-owned-continuation-ends) | `runtime-status.ts; vertical-scheduling.ts; runtime-status.test.ts`. Projection retires only terminal settlements; expiry between steps has no matching settlement. Budget reads portfolio spending only. |
| 5. FUP-349058ac0342247d | allocated, 2026-10-17T19:34:14.384Z | [wo-138-d012--board-up-the-undeclared-t1-minimum-bound-named-by-ver-002-a1](../../evidence/WO-138/decisions.md#wo-138-d012--board-up-the-undeclared-t1-minimum-bound-named-by-ver-002-a1) | `scripts/probes/local-model-role-qualification.mjs`. Read the emitted T1 schema and requireString minimum before choosing the boundary correction. |
| 6. FUP-3d4b39cd4b2c4a08 | allocated, 2026-10-17T19:34:14.458Z | [wo-116-d008--observed-limit-a-resident-stores-own-events-are-context-to-the-fold](../../evidence/WO-116/decisions.md#wo-116-d008--observed-limit-a-resident-stores-own-events-are-context-to-the-fold) | `audit.ts; audit.test.ts`. Consequential action classes omit resident-owned events; omission wording still says fixture. |
| 7. FUP-49c4a5f7176252e7 | allocated, 2026-10-17T19:34:14.534Z | [wo-199-d015--verification-pass-ver-003-board-the-recovery-paths-untyped-host-refusal-which-a-refusal-coinciding-with-a-signal-now-reaches](../../evidence/WO-199/decisions.md#wo-199-d015--verification-pass-ver-003-board-the-recovery-paths-untyped-host-refusal-which-a-refusal-coinciding-with-a-signal-now-reaches) | `source-change-host.ts; source-change-host.test.ts`. Source decision identifies unguarded recovery effect/observe calls; compare with the dispatch admission catch. |
| 8. FUP-4f8cd7989607ad3f | allocated, 2026-10-17T19:34:14.610Z | [wo-142-d002--preserve-replay-behavior-when-returning-resident-noop-identity](../../evidence/WO-142/decisions.md#wo-142-d002--preserve-replay-behavior-when-returning-resident-noop-identity) | `resident-host.ts; resident-state.ts; resident.test.ts`. lastNoOp stores only reason; host compares the reason without phase or arm generation. |
| 9. FUP-5d48c4f3c2a3730d | allocated, 2026-10-17T19:34:14.687Z | [wo-112-d061--board-unbounded-retries-of-judgment-episodes-that-fail-identically](../../evidence/WO-112/decisions.md#wo-112-d061--board-unbounded-retries-of-judgment-episodes-that-fail-identically) | `vertical-judgment-host.ts; vertical-resident.ts`. Retryable failures exclude only invalid-result and profile-refused; deadline and budget failures are not subject-counted. |
| 10. FUP-7c269a184f75e742 | allocated, 2026-10-17T19:34:14.761Z | [wo-112-d046--board-five-lower-review-loop-and-resident-items-from-the-ver-005-adversary](../../evidence/WO-112/decisions.md#wo-112-d046--board-five-lower-review-loop-and-resident-items-from-the-ver-005-adversary) | `review-comment-loop.mjs; vertical-primitives.mjs; vertical-resident.ts`. Review bodies alone have an invocation count; cached prepared input is returned; continuation backoff resets on every normal return. |
| 11. FUP-88c339c51cfc1933 | allocated, 2026-10-17T19:34:14.836Z | [wo-199-d011--board-the-witnesses-steps-browser-scenario-which-the-abort-does-not-reach-and-whose-rerun-refuses-its-own-directory](../../evidence/WO-199/decisions.md#wo-199-d011--board-the-witnesses-steps-browser-scenario-which-the-abort-does-not-reach-and-whose-rerun-refuses-its-own-directory) | `vertical-primitives.mjs; packages/browser-evidence/src/index.ts`. Witness browser call supplies subjectRevision and directory, with no signal or recoverFrom. |
| 12. FUP-89e29438bd71c524 | allocated, 2026-10-17T19:34:14.911Z | [wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice](../../evidence/WO-189/decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice) | `scripts/docs-check.mjs; scripts/fixtures/front-page-corpus.json`. Restate the closed source decision and corpus limits; generated-block registration remains WO-088 carry-in. |
| 13. FUP-8f0561e50754114f | allocated, 2026-10-17T19:34:14.985Z | [wo-107-d010--final-review-the-lanes-own-checks-are-keyed-to-this-orders-bytes](../../evidence/WO-107/decisions.md#wo-107-d010--final-review-the-lanes-own-checks-are-keyed-to-this-orders-bytes) | `corpus/harness/profile.mjs; wo107-schema.test.mjs; wo107-records.mjs`. Live classification entry is already checked separately against historical bytes; second collector provenance still depends on live module bytes. |
| 14. FUP-b8440605da5a4eb2 | allocated, 2026-10-17T19:34:15.061Z | [wo-112-d047--close-the-ver-005-classes-at-their-origin-one-judgment-failure-rule-admission-gated-preparation-and-own-registration-recovery](../../evidence/WO-112/decisions.md#wo-112-d047--close-the-ver-005-classes-at-their-origin-one-judgment-failure-rule-admission-gated-preparation-and-own-registration-recovery) | `scripts/lib/vertical-judgment.mjs; vertical-runtime.mjs`. Replay result validation is unwrapped, so WorkerFailure invalid-result reaches episode-failure handling. |
| 15. FUP-bcd4724fca7bff7a | allocated, 2026-10-17T19:34:15.139Z | [wo-112-d053--board-the-preparation-retry-clock-choice-with-its-observed-contrast](../../evidence/WO-112/decisions.md#wo-112-d053--board-the-preparation-retry-clock-choice-with-its-observed-contrast) | `vertical-resident.ts; scripts/test-vertical.mjs`. Preparation retry deadline uses context.at; continuation uses now() after return. |
| 16. FUP-c1d4be019802be0d | allocated, 2026-10-17T19:34:15.219Z | [wo-103-d005](../../evidence/WO-103/decisions.md#wo-103-d005) | `packages/kernel/src/core.ts; wo103-outbox.test.mjs`. persistCommand accepts required-field omissions; replayOutbox invokes it after only a nonempty commandId check. |
| 17. FUP-d093f77bd927f9dc | allocated, 2026-10-17T19:34:15.295Z | [wo-105-d012--final-review-the-corpuss-byte-pins-are-keyed-to-its-base-and-fail-on-later-main](../../evidence/WO-105/decisions.md#wo-105-d012--final-review-the-corpuss-byte-pins-are-keyed-to-its-base-and-fail-on-later-main) | `corpus/harness/wo105-common.mjs; wo105-*.test.mjs`. Base and golden are fixed to 2b1af1ab; current runtime comparisons need explicit after-base treatment. |
| 18. FUP-d22dc57e754ba35c | allocated, 2026-10-17T19:34:15.369Z | [wo-103-d012--final-review-one-precedence-pair-the-declared-factorial-never-contests](../../evidence/WO-103/decisions.md#wo-103-d012--final-review-one-precedence-pair-the-declared-factorial-never-contests) | `corpus/harness/wo103-authority-lib.mjs; wo103-authority.test.mjs`. Read pattern levels and add an actual denied-and-not-allowed contest, preserving the recorded seed. |
| 19. FUP-e62d0d2771185a38 | allocated, 2026-10-17T19:34:15.443Z | [wo-065-d008](../../evidence/WO-065/decisions.md#wo-065-d008) | `docs/product/05-pattern-library.md; WO-065-D008`. The source ask is a cross-host personal delegation feature; its documentation did not authorize settings/runtime changes. |
| 20. FUP-eeb25ea9315438ad | allocated, 2026-10-17T19:34:15.520Z | [wo-118-d013--the-witnessed-run-carries-criteria-1-to-5](../../evidence/WO-118/decisions.md#wo-118-d013--the-witnessed-run-carries-criteria-1-to-5) | `resident-host.ts; vertical-resident.ts; runtime-status.ts`. Unbound portfolio execution produces ActorUnavailable after intent scheduling returns no work. |

Baseline inspection commands: `npm run plan -- followups --export <session-scratch>/wo220-base-followups.json --all`; full heading reads of the twenty source decisions; `rg -n` over the source/test paths listed above, followed by the named functions. Commands and outputs for executable claims appear in the after table and controls, never inferred from these reads.

WO-083 and WO-183 carry-ins: FUP-2b9a8e696b38fb97 and FUP-eeb25ea9315438ad govern resident intent completion visibility and the unbound portfolio actor. Their dispositions must reconcile WO-083’s earlier deferral of WO-118 D013/D018.

## After

Observed 2026-10-24T06:02:59.018745+00:00; register revision `2c0ee50fbbeffced34a02bd7fb6347f6446462322be8b974af8523c50c1aac69`. Pending rows: **178**, against **178** at activation. All twenty rows now have post-activation terminal dispositions: **14 settled, 6 declined, 0 deferred**. Their prior allocations already counted as closed; this batch claims no reduction by twenty. Metadata synchronization briefly reported 184 pending after refreshing six source-title excerpts; applying their current source revisions returned the count to 178. No source decision was rewritten.

The six declines retain their present harms, evidence and reopening conditions in D001, D002, D006, D009, D012 and D019. No operator-only choice or operator packet remains. WO-083 and WO-183 carry-ins are settled by D004 and D020; WO-088 retains its generated-block work, and WO-204 must preserve D007's typed recovery refusal.

| Row | Latest disposition | Decision and evidence |
| --- | --- | --- |
| 1. FUP-06abc143a1c52367 | declined, 2026-10-24T06:02:34.695Z | [WO-220-D001](decisions.md#wo-220-d001); Decline: harm, evidence and reopening condition in the linked decision. |
| 2. FUP-165f9860f8f32a67 | declined, 2026-10-24T06:02:34.799Z | [WO-220-D002](decisions.md#wo-220-d002); Decline: harm, evidence and reopening condition in the linked decision. |
| 3. FUP-2341c85c58331f3e | settled, 2026-10-24T06:02:34.899Z | [WO-220-D003](decisions.md#wo-220-d003); `audit-partial` |
| 4. FUP-2b9a8e696b38fb97 | settled, 2026-10-24T06:02:34.998Z | [WO-220-D004](decisions.md#wo-220-d004); `intent-status`, `budget-label` |
| 5. FUP-349058ac0342247d | settled, 2026-10-24T06:02:35.098Z | [WO-220-D005](decisions.md#wo-220-d005); `t1-minimum` |
| 6. FUP-3d4b39cd4b2c4a08 | declined, 2026-10-24T06:02:35.198Z | [WO-220-D006](decisions.md#wo-220-d006); Decline: harm, evidence and reopening condition in the linked decision. |
| 7. FUP-49c4a5f7176252e7 | settled, 2026-10-24T06:02:35.297Z | [WO-220-D007](decisions.md#wo-220-d007); `recovery-refusal` |
| 8. FUP-4f8cd7989607ad3f | settled, 2026-10-24T06:02:35.396Z | [WO-220-D008](decisions.md#wo-220-d008); `noop-identity` |
| 9. FUP-5d48c4f3c2a3730d | declined, 2026-10-24T06:02:35.495Z | [WO-220-D009](decisions.md#wo-220-d009); Decline: harm, evidence and reopening condition in the linked decision. |
| 10. FUP-7c269a184f75e742 | settled, 2026-10-24T06:02:35.593Z | [WO-220-D010](decisions.md#wo-220-d010); `review-triage`, `review-outward`, `review-rekey`, `repair-worktrees`, `repair-legacy-parent`, `cached-resolution`, `continuation-backoff`, `judgment-replay` |
| 11. FUP-88c339c51cfc1933 | settled, 2026-10-24T06:02:35.692Z | [WO-220-D011](decisions.md#wo-220-d011); `browser-signal`, `browser-recovery`, `browser-startup` |
| 12. FUP-89e29438bd71c524 | declined, 2026-10-24T06:02:35.791Z | [WO-220-D012](decisions.md#wo-220-d012); Decline: harm, evidence and reopening condition in the linked decision. |
| 13. FUP-8f0561e50754114f | settled, 2026-10-24T06:02:35.890Z | [WO-220-D013](decisions.md#wo-220-d013); `collector-archive`, `comparison-newline` |
| 14. FUP-b8440605da5a4eb2 | settled, 2026-10-24T06:02:35.988Z | [WO-220-D014](decisions.md#wo-220-d014); `judgment-replay` |
| 15. FUP-bcd4724fca7bff7a | settled, 2026-10-24T06:02:36.086Z | [WO-220-D015](decisions.md#wo-220-d015); `preparation-clock` |
| 16. FUP-c1d4be019802be0d | settled, 2026-10-24T06:02:36.181Z | [WO-220-D016](decisions.md#wo-220-d016); `command-persist`, `command-append`, `command-serialization` |
| 17. FUP-d093f77bd927f9dc | settled, 2026-10-24T06:02:36.275Z | [WO-220-D017](decisions.md#wo-220-d017); `corpus-after-base` |
| 18. FUP-d22dc57e754ba35c | settled, 2026-10-24T06:02:36.369Z | [WO-220-D018](decisions.md#wo-220-d018); `authority-contest` |
| 19. FUP-e62d0d2771185a38 | declined, 2026-10-24T06:02:36.462Z | [WO-220-D019](decisions.md#wo-220-d019); Decline: harm, evidence and reopening condition in the linked decision. |
| 20. FUP-eeb25ea9315438ad | settled, 2026-10-24T06:02:36.558Z | [WO-220-D020](decisions.md#wo-220-d020); `intent-only` |

Every selected row was read back with `npm run plan -- followups --show <id>`; [register-after.json](register-after.json) records the exact twenty invocations and latest dispositions.

### Executed paired controls

All 26 current positive arms exit 0 and all targeted reversion arms exit 1 in their named cases. The [control manifest](repair-controls.json) records exact commands, source hashes, snapshots, reversions, builds, case reports and log hashes. [control-replay.py](control-replay.py) replays one control in an isolated checkout; it never reverts the operator worktree. The legacy compatibility refinement was followed by rerunning both three-push controls and adding its own interrupted-run pair. The later historical-schema correction was followed by a fresh T1 positive/reversion pair at 07:13:06Z. Other controls retain their unchanged-source observations.

| Control | Suite | Case | Command |
| --- | --- | --- | --- |
| `audit-partial` | skeleton | audit links truthful partial revocation inputs without inventing missing inputs | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'audit links truthful partial' packages/skeleton/dist/test/audit.test.js` |
| `intent-status` | skeleton | resident expiry between steps shows one hold and terminal outcomes preserve the indexed phase | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'resident expiry between' packages/skeleton/dist/test/runtime-status.test.js` |
| `budget-label` | console | resident status labels the budget as portfolio-only beside an intent outcome | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'resident status labels' packages/console/dist/test/runtime-status.test.js` |
| `t1-minimum` | harness-probe | T1 emitted minimum and maximum match every receipt field's host validation | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'T1 emitted minimum' scripts/test-harness-probe.mjs` |
| `recovery-refusal` | skeleton | recovered unreceipted dirty commits close with a typed host admission refusal | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'recovered unreceipted dirty' packages/skeleton/dist/test/source-change-host.test.js` |
| `noop-identity` | skeleton | resident NoOp identity survives replay and distinguishes phase and rearm | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'resident NoOp identity' packages/skeleton/dist/test/resident.test.js` |
| `review-triage` | vertical | review invocation bounds combined inline and body triage before opening the next item | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'review invocation bounds combined' scripts/test-vertical-judgment.mjs` |
| `review-outward` | vertical | review invocation stops at its outward bound before disposing a further thread | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'review invocation stops at its outward' scripts/test-vertical-judgment.mjs` |
| `review-rekey` | vertical | three repair pushes rekey unchanged bodies without spending their eight-item allowance | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'three repair pushes' scripts/test-vertical-judgment.mjs` |
| `repair-worktrees` | vertical | three repair pushes rekey unchanged bodies without spending their eight-item allowance | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'three repair pushes' scripts/test-vertical-judgment.mjs` |
| `repair-legacy-parent` | skeleton | namespaced repair resumes a recorded legacy worktree without another writer | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'namespaced repair resumes' packages/skeleton/dist/test/repair.test.js` |
| `cached-resolution` | vertical | cached resolution input rebinds its observed head, contract and snapshot before triage | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'cached resolution input rebinds' scripts/test-vertical-judgment.mjs` |
| `continuation-backoff` | vertical | WO-112 continuation backoff survives a no-progress return, caps repeated failures and never defers authority expiry | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'continuation backoff survives' scripts/test-vertical-judgment.mjs` |
| `browser-signal` | vertical | browser witness cancellation closes owned processes and resumes in a fresh attempt directory | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'browser witness cancellation' scripts/test-vertical.recovery.mjs` |
| `browser-recovery` | vertical | browser witness cancellation closes owned processes and resumes in a fresh attempt directory | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'browser witness cancellation' scripts/test-vertical.recovery.mjs` |
| `collector-archive` | wo107-schema | harness classification exception is exact and both collector revisions preserve timed bytes | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'classification exception' corpus/harness/wo107-schema.test.mjs` |
| `comparison-newline` | wo107-schema | harness full dummy executions round-trip through schema and comparison | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'harness full dummy executions' corpus/harness/wo107-schema.test.mjs` |
| `judgment-replay` | vertical | stored intake result refusal is a bounded record fault with no new episode; stored triage result refusal ends needs-human and is never called an episode failure | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'stored intake result refusal\|stored triage result refusal' scripts/test-vertical-judgment.mjs` |
| `preparation-clock` | vertical | preparation retries cool down after short and slow failures, cap the delay and honor expiry | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'preparation retries cool' scripts/test-vertical.mjs` |
| `command-persist` | kernel | new command admission rejects malformed structure while old logs replay unchanged | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'new command admission' packages/kernel/dist/test/kernel.test.js` |
| `command-append` | kernel | new command admission rejects malformed structure while old logs replay unchanged | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'new command admission' packages/kernel/dist/test/kernel.test.js` |
| `command-serialization` | kernel | new command admission rejects malformed structure while old logs replay unchanged | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'new command admission' packages/kernel/dist/test/kernel.test.js` |
| `corpus-after-base` | node --test wo105-skeleton | WO-105 after-base reports identity drift but still rejects changed crash-shape pins | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'after-base reports' corpus/harness/wo105-skeleton.test.mjs` |
| `authority-contest` | node --test wo103-authority | authority factorial contests denial without allow and pins the expanded axes | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'authority factorial contests' corpus/harness/wo103-authority.test.mjs` |
| `intent-only` | vertical | intent-only residents skip an unbound portfolio actor but ordinary portfolios still report it | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'intent-only residents skip' scripts/test-vertical.mjs` |
| `browser-startup` | vertical | browser witness resumes a pre-launch directory without a process record | `node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern 'browser witness resumes a pre-launch' scripts/test-vertical.recovery.mjs` |

### Other pending seam matches

Observed 2026-10-24T07:13:34.504710+00:00, after the retained-schema correction and classification binding. The no-argument `npm run plan -- followups --touching` query returned 5 pending rows across 1 page(s); none is one of this order's twenty. These other-batch/candidate rows remain unchanged. The complete feed is [touching.json](touching.json).

| Identifier | Status | Source |
| --- | --- | --- |
| `FUP-268c774fd159addb` | deferred | docs/evidence/WO-225/decisions.md#wo-225-d021 |
| `FUP-848fd8e2ac941bc3` | deferred | docs/evidence/WO-226/decisions.md#wo-226-d023 |
| `FUP-ce1f662a6b966a2a` | deferred | docs/evidence/WO-225/decisions.md#wo-225-d022 |
| `FUP-d0a9719cc2e4ec55` | deferred | docs/evidence/WO-185/decisions.md#wo-185-d006--recorded-survivor-guarantee-limitation |
| `FUP-d2646e66a2dfdb40` | deferred | docs/evidence/WO-219/decisions.md#wo-219-d008--keep-the-historical-sweep-mismatch-separate-from-append-proof |

### Further validation

All 27 direct WO-103/WO-105 lane cases passed. Authority is selected at WO-220/002; artifact-identity, verification and feedback are selected at WO-220/001; the new live feedback audit completed with Codex gpt-6.1-sol at max. See [supplemental checks](supplemental-checks.json) and [source/edition inventory](evidence-source-inventory.json). The handoff records complete/document gate outcomes after execution; these controls alone do not claim a passing gate.

Owned isolated control checkout removed after its probes; recorded HEAD `f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1`. Full control logs remain in session scratch.

## Final review

Observed 2026-10-24T13:05Z at the integrated tree, code identity `881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6`; register revision `45a45d06237e91a4e18e9371d92cdd06a02b01f96866fdf1e60ec222d5b2349e`. Pending rows: **179**. The one row above the after count is VER-001's own follow-up, FUP-1330ac1551dff7d1 ([D032](decisions.md#wo-220-d032--ver-001-pass-board-the-retained-schema-recognitions-dependence-on-the-current-functions-source-text)), boarded after this order's register application; no reduction is claimed. The twenty listed rows read back unchanged: 14 settled and 6 declined, each after activation and on its row's latest source revision.

The no-argument `npm run plan -- followups --touching` query returned 6 pending rows on one page; none is one of this order's twenty, and each keeps its disposition ([D034](decisions.md#wo-220-d034--final-review-pass-at-the-integrated-identity-ver-001s-f1-stays-on-its-row)).

| Identifier | Status | Source | Final-review note |
| --- | --- | --- | --- |
| `FUP-1330ac1551dff7d1` | untriaged | docs/evidence/WO-220/decisions.md#wo-220-d032--ver-001-pass-board-the-retained-schema-recognitions-dependence-on-the-current-functions-source-text | VER-001's F1; stays on its row with its repair rule. |
| `FUP-268c774fd159addb` | deferred | docs/evidence/WO-225/decisions.md#wo-225-d021 | Its WO-220 activation clause occurred; criterion 4 leaves it as it is. |
| `FUP-848fd8e2ac941bc3` | deferred | docs/evidence/WO-226/decisions.md#wo-226-d023 | Its WO-220 activation clause occurred; criterion 4 leaves it as it is. |
| `FUP-ce1f662a6b966a2a` | deferred | docs/evidence/WO-225/decisions.md#wo-225-d022 | Its WO-220 activation clause occurred; criterion 4 leaves it as it is. |
| `FUP-d0a9719cc2e4ec55` | deferred | docs/evidence/WO-185/decisions.md#wo-185-d006--recorded-survivor-guarantee-limitation | Unchanged. |
| `FUP-d2646e66a2dfdb40` | deferred | docs/evidence/WO-219/decisions.md#wo-219-d008--keep-the-historical-sweep-mismatch-separate-from-append-proof | Unchanged; its canonical-demo mismatch is the compiler version label alone (D034). |

The five WO-103 and WO-105 lane files passed 27 of 27 again at this tree after `npm run build`, in 80.4 s under the bounded wrapper.
