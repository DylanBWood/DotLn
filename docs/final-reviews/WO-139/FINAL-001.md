# WO-139 FINAL-001 — Final review

**Verdict: fail.** The observed admission accounting and the two authorized scope expansions are supported by the existing verification and current checks, but F1 leaves the new cap behavior outside the installed runtime identity and F2 fails the required review gate. Return these bounded findings through repair and independent verification before publication.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.0","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

## Subject and integration

Reviewed [WO-139](../../work-orders/WO-139-subagent-cap.md), its cited source and product sections, the complete [VER-001](../../verifications/WO-139/VER-001.md) sequence, the full authored source/test diff and generated-surface checks, and [D001–D005](../../evidence/WO-139/decisions.md). The operator dispatch was `resume: final review`; it allocated this report at 2026-09-18T16:14:37Z. The D002 and D005 expansions are judged under their recorded operator authority; their originating messages are not independently available in this review.

The verified and fetched upstream bases are both `494e6825ae4c249da97671379c26d4a38a84b153`. The package/script tree equals verification checkpoint `refs/dotln/checkpoint/WO-139/4`; this reviewer made no implementation changes. No merge, conflict resolution, release retime or new verification artifact was necessary. Five intended new source/test files were staged for the review gate. Original evidence and recovery refs remain intact.

The lifecycle, usage and harness-check instruments are part of the reviewed change. Independent scratch probes below use byte comparisons and imported behavior to test the generated runtime rather than treating its own green check as sufficient. No native helper or live probe agents were spawned during this review.

## F1 — P2: Pin the newly imported cap module in the installed runtime

**Affected claim:** criterion 5's regenerated bundle/manifest and harness check, together with the runtime freshness supplied by WO-133. [`harness-host.ts:78`](../../../packages/skeleton/src/harness-host.ts) introduces a static import of `./subagent-budget.js`, but [`scripts/lib/harness.mjs:85`](../../../scripts/lib/harness.mjs) omits that module from `runtimeFiles`. Snapshot identity, reuse, drift checking and `harness check` all depend on that list.

**Observed:** in an isolated copy, emit a bundle, change only the built cap module's default from 20 to 21, then emit and check again. The snapshot identity stays unchanged, `harness check` passes all 28 surfaces, the built module returns 21, and the installed hook module still returns 20. In a second isolated installation, deleting only the snapshot's cap module still leaves `harness check` green; the generated permission hook then returns a runtime-unavailable advisory without a denial. The original worktree's module and snapshot currently match; the finding is the reproduced failure of regeneration and drift detection for this new dependency.

**Expected:** a cap-module change must change the runtime identity and install its current bytes; a missing or altered required snapshot module must be detected by the existing integrity checks. Include this module in the pinned runtime declaration, regenerate the affected bundle/evidence surfaces, and add a focused regression for module-only drift and a missing snapshot module. Preserve the documented advisory fallback and the four-refusal boundary.

**Evidence:** [runtime regeneration probe](../../evidence/WO-139/final-review-runtime-pin-probe.json), [missing-module probe](../../evidence/WO-139/final-review-runtime-missing-probe.json), and [reproduction commands](../../evidence/WO-139/final-review-runtime-reproduction.md). Both probes ran against disposable local copies without changing this subject's runtime or settings.

## F2 — P2: Reconcile the two failing process-debt regression contracts

The required review gate fails `process-debt`. A focused rerun of `node --test --test-name-pattern='WO-132 spawn and classification advisories|WO-132 all four completions' scripts/test-process-debt.mjs` independently reproduced both failures (0 passed, 2 failed, exit 1).

At [`scripts/test-process-debt.mjs:493`](../../../scripts/test-process-debt.mjs), the test expects the later unclassified-tool advisory to be suppressed, but it is delivered. The new substring-based cause selection at [`harness-host.ts:3179`](../../../packages/skeleton/src/harness-host.ts) puts the existing “Remote subagents” classification advisory into a subagent-budget bucket. Consequently it no longer consumes the classification marker used by the next unclassified tool. This is a source-supported explanation of the observed assertion failure; use explicit budget-advisory provenance so unrelated classification messages retain their intended throttle semantics, then assert the result.

At [`scripts/test-process-debt.mjs:909`](../../../scripts/test-process-debt.mjs), the old `/^Observed facts/` assertion rejects the newly prepended `Subagents: 0/20` line even though the observed-facts section remains. Update this fixture to check both sections and retain its no-denial/release assertions, as the corresponding harness fixture was updated. These are bounded regressions of this change, not evidence that completion now blocks.

**Evidence:** [focused failure summary](../../evidence/WO-139/final-review-process-regressions.json). The raw focused and full-gate transcripts remain in ignored reviewer diagnostics. Criterion 7 and the standing final-review gate remain unsatisfied until the affected fixtures and a fresh `npm test -- --review` pass.

## Acceptance and verification observations

| Criterion / scope | Final-review assessment |
| --- | --- |
| 1 — identity probe | Probe 2's 22 events share the root identity; direct-child identity matches the returned Agent identity and workflow children have distinct identities. The record retains launch-selector and coverage limits. |
| 2–4 — accounting, refusal and reporting | Source and fixtures cover cap 3, exhausted Workflow, null/default/zero, repeated calls, unavailable state, attributed children, exact result joins, minimum overlap and concurrent admissions. Stop and usage expose the unknown remainder. |
| 5 — generated integration | Batching text and four-refusal write-backs are present; ordinary generation checks pass, but F1 disproves complete runtime dependency coverage. |
| 6 — admission limits | The decisions table and product candidate retain late and unobserved paths and Codex's role-text-only enforcement. |
| 7 — regression gate and dependencies | `npm test -- --review`: 31 suites passed, 1 failed (`process-debt`, two assertions); 1159.32 seconds. Whitespace checks pass; lockfile changes are internal component versions only, with no new dependency. |
| D002 — planning amendment/history repair | The current planning check accepts the exact WO-053 amendment and preserved capability reassessment. Its fixtures test changed bindings, containment, historical preservation and unchanged independent holds. |
| D005 — writer handoff | The real lifecycle fixture passes executor/fix completion, failed pre-append validation, post-append index failure and preservation of another holder. |

VER-001's O1–O6 remain non-blocking observations, not new implementation authority. O1's `SubagentStart` events are present in probe 2 and may inform the existing total-cap candidate; refusal at that event is untested. O2's multiline release normalizer has a theoretical second-H1 ambiguity without an observed current order using it. O3 and O4 identify inaccurate documentation: `PlanExecutionAmended` binds an agent-written decision but has no actor field, and non-criterion byte-change errors do not always name an order. The record should describe that actual provenance and diagnostic limit. O5's observer join has unit/live evidence but no generated PostToolUse integration assertion. O6's older byte measurement and doubled conjunctions are cosmetic. Product 07 also overstates foreground probe evidence when saying Agent joins occur only after completion; VER-001 observed an immediate background result.

## Goal and handoff

The existing D001–D005 rationale remains applicable: resource accounting and automatic ownership handoff reduce recurring operator supervision on the path to independently verified execution. F1 directly undermines that benefit by letting reviewed behavior differ from installed behavior. Policy resistance and rule beating favor checking the runtime actually consumed; drift and wrong-goal risks rule out accepting a green generator check as the outcome. Commons, escalation and burden shifting favor one bounded repair instead of an additional recurring manual check. Success-to-the-successful gives the existing pin list no exemption. Under Naive Interventionism, preserve useful spawning, recovery and advisory fallback; NoOp leaves the demonstrated stale-runtime route open. The missing pin and failed regression contracts require bounded repair; neither expands total-cap coverage.

The current planning continuation check passes; the two F1 probes and the focused F2 failures were reproduced independently. Usage totals are unavailable (source unavailable, dispatch scope); final counters and timings remain in ignored receipts and the handoff response. No token or cost savings are inferred. Publication drafts are retained beside this report with the failed review clearly marked. No branch commit, push, PR creation, tag or release was performed. The next legal dispatch after this failure is `resume: fix`.
