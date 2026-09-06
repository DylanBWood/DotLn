# WO-011 executor evidence

This edition accompanies application `v0.13.0`, compiler `0.6.0`, and skeleton
`0.12.0`; kernel `0.2.1` is unchanged. The authority is
[WO-011](../../work-orders/WO-011-feedback-compiler.md). The
[ten-unit catalog](../../../packages/skeleton/src/loadouts/feedback.ts) retains
the full declarations and public incident references. There is no eleventh unit.
The skeleton reuses the pinned TypeScript parser at runtime under the
[ADR-0002 amendment](../../decisions/0002-kernel-first-agentic-core.md#amendments);
compiler and kernel keep zero runtime dependencies.

| Acceptance criterion                                                        | Executable evidence                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Complete FeedbackUnit shape and mechanism choice                         | `WO-011 compiler validates the complete unit and rejects drift, duplicates, unsupported lowering and co-equipped supersession` in [compiler tests](../../../packages/compiler/test/feedback.test.ts); each catalog entry supplies the cheapest-sufficient-rung rationale. `WO-011 maturity separates controlled fixtures from live use and refuses invented or duplicate observations` checks the observation fold. |
| 2. Every regression fails when its mechanism is removed                     | The ten `WO-011 regression <unitId>` tests in [boundary fixtures](../../../packages/skeleton/test/feedback-fixtures.test.ts), executed individually with and without that unit. [feedback.json](feedback.json) captures commands, assertion outcomes, and exit codes for all twenty subprocess runs.                                                                                                                |
| 3. Measured startup-context reduction                                       | `feedbackContextAccounting` in the [audit host](../../../packages/skeleton/src/feedback-audit.ts), its positive-reduction gate, and the self-host test's baseline/accounting assertions. The exact inputs and totals are in `feedback.json`.                                                                                                                                                                        |
| 4. One repository work order through compile, dispatch, execute, and verify | `WO-011 selfhost executes the real repository audit, recovers its saved result, and independently verifies once` in [host tests](../../../packages/skeleton/test/feedback-host.test.ts), plus the witnessed live audit and verification event streams described below.                                                                                                                                              |
| 5. Semantic correction only; false positives tighten                        | `WO-011 correction is pure, typed, idempotent, and monotonically tightens every semantic correction kind`, the `fail-conservative-correction` removal pair, and `WO-011 shared reactor dispatches a pinned audit, refuses expiry, and makes semantic correction a durable diagnosis request`. Ordinary messages and worker-authored correction events do not activate the reactor policy.                           |

## Regression and context observations

All ten mechanisms pass their isolated fixture with the mechanism present.
Removing only the selected unit produces one `ERR_ASSERTION` failure and exit
code 1, rather than a subprocess, build, or missing-fixture failure. The test-only
removal variable is read only by the fixture module. The attribution fixture
uses an actual temporary Git repository and commit-message hook. Writer facts
come from actual Git roots, and read receipts bind actual output bytes.

The WO-004 accounting method measures UTF-8 instruction-file bytes and physical
lines. Its recorded common baseline is two files, 79 lines, and 3,530 bytes.
Adding the ten prose equivalents yields 6,025 bytes; adding the compiled
profile's one-line residue yields 3,632 bytes: **2,393 fewer instruction bytes**.
This is a matched counterfactual projection. It does not measure effective
session tokens, total workflow cost, or the source/evidence capsule sent to the
verifier. Those larger inputs are outside this comparison.

Each unit has one selected fixture prevention episode, with zero live maturity
observations and no awakened claim. False-positive probes and internal
assertions are additional checks, not a sampled population from which to infer
field rates.

## Bounded self-hosted run

`dotln feedback-audit` compiles `WO-011-feedback-audit` for this repository's
pinned working source. The shared kernel reactor authorizes and persists one
read-only audit command. Its fixed host executor runs the twenty subprocess
checks, captures the report, and preserves the completed result for recovery.
The separate WO-010 verification host compiles a blinded capsule containing the
pinned source and host evidence, with two acceptance criteria. The base revision
is retained separately and its unexecuted audit is marked unavailable.

The live verifier uses Claude Code `2.1.263`, with launch selections
`claude-sonnet-5` and `max`. These are host-observed launch values; effective model
and effort remain `unknown`. Its mount is an empty Git repository and model
tools are disabled. It evaluates the supplied source and host witnesses; it
does not rerun the subprocesses itself or receive the implementation transcript.

The first live attempt exceeded the inherited three-minute process deadline and
left its command pending. The feedback profile now has a fixed ten-minute
deadline and a $3 Claude cap, recorded in its attempt event. Its changed source
requires a new pin and store; the earlier failed observation is not presented
as a successful run. Other worker profiles keep their previous limits. A second
live run completed against an intermediate source, but executor review exposed
a source-comment scanner defect: a quoted regex hid a subsequent suppression.
Parsed comment ranges replace that scanner, with regex/template/JSX regressions;
the final recorded run covers this corrected source.

The retained [audit stream](selfhost-audit.jsonl) contains one compiled,
persisted, executed audit command. The [verification stream](selfhost-verification.jsonl)
records an initial `invalid-result` refusal and recovery in
`ep_verifier_1_attempt_2`, which supplies host-admitted passing evaluations for
both `AC-causal-fixtures` and `AC-context`. The matrix is `complete`; neither
evaluation is stale. The rejected return's specific subcheck is not retained.
Recovery used the same host API with an allowlisted diagnostic observer on
transport failures, preserving the request, profile, and admission contract.
The saved audit was reused. No failed or superseded attempt supplies acceptance.

The final source pin is
`sha256:410d1f837cac558d3b2176a94e9f8cf616f4a6c9830b12ff9be972527f200c95`.
Including the report produces verifier subject
`sha256:6fb91aab163c29b8700145fc3b673f6c51b05c8e694196a9a9670844865cfb11`.
The report and event streams own these identities; this receipt is their review
entry point.

Final validation on 2026-09-06: `npm test` exited 0. All 281 runtime tests and
8 corpus tests passed, along with formatting, lifecycle/recovery/release helper
fixtures, publication/source-lock checks, the generated work-order index, and
the current artifact-identity, verification, and feedback evidence checks. The
feedback check reran all twenty present/removal subprocesses and validated the
retained live streams against this source and report. A clean
`npm ci --ignore-scripts --offline --no-audit --no-fund` also succeeded.

## Reproduction and limits

Build and regenerate the controlled evidence with
`npm run evidence:feedback -- --write`. The [skeleton runbook](../../../packages/skeleton/README.md#feedback-compiler-and-bounded-self-hosting)
gives the live command and recording command. Recording refuses a fake
transport, stale source/policy/report, or an incomplete matrix.
`npm run evidence:feedback -- --check` reruns every removal pair and validates
the retained live streams against the current source and report. Repeat a live
run only when a new source revision or unresolved observation requires it.

The current [artifact-identity edition](artifact-identity/semantic-hash-inventory.json)
and [verification edition](verification/matrix.json) are regenerated for compiler
`0.6.0`. Historical evidence and the frozen WO-003 trace oracle retain their
original bytes.

The compiler, host, fixtures, and evidence generator are instruments introduced
by this same work order. The live verifier is a separate physical episode, but
its observations still rely on those disclosed instruments. The later
independent repository verifier must review them and this receipt. This step
audits actual repository code with controlled fixtures; it does not switch
repository source-writing or the `resume` lifecycle over to DotLn.

Enforcement applies only at equipped host boundaries. Semantic facts still need
host/operator judgment, writer reservations need a lock spanning dispatch, and
read receipts witness delivery rather than comprehension. The source-comment
check uses pinned TypeScript token/comment ranges for JavaScript/TypeScript
source; it is not a general detector of weakened test/compiler configuration.
Attribution settings apply to
the selected invocation; the hook is installed only in its fixture repository.
The execution guide remains the rule carrier outside these equipped consumers.
