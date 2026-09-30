# WO-058 executor evidence

The executor extends `verification-v1` with `visual` and `network` claims and five optional witness kinds. Visual passes require a cited passing screenshot bound to the criterion; network passes require a cited passing request/response trace. A console error is a failing witness for its bound criterion and required check, including when the verifier omits it. Only an admitted verifier evaluation updates the existing matrix.

Executor readback: Codex CLI `0.159.2`, `gpt-6.1-sol`, effort `max`, source `codex-session-readback`. The locally assigned application target is `v0.58.0`; compiler `0.21.0` and skeleton `0.47.0` are compatible minor extensions. Kernel and console sources are unchanged. No dependency was added. Verification of this implementation and final review remain separate dispatches.

The shared [fixture data](../../../packages/compiler/fixtures/wo058-verification.json) and the compiler/skeleton `verification-witness.test.ts` suites require no browser. Their hashes and observations are explicitly synthetic; the contract binds the hashes in the capsule and does not authenticate captured content. Witness producers remain WO-059. The `worktree-snapshot` profile still admits live behavior claims and host-run tests only.

| Criterion | Executable observation |
| --- | --- |
| 1 | DOM/accessibility-only visual pass refuses `visual pass requires screenshot`; unverified leaves the row incomplete; a cited passing screenshot verifies. Omitting that screenshot still refuses. |
| 2 | Network pass without a cited passing trace refuses `network pass requires trace`; unverified leaves the row incomplete; a passing trace verifies. Cross-criterion evidence and unavailable traces refuse. |
| 3 | One console-error capture per criterion in a two-criterion scenario refuses cited and omitted-error passes, admits failures and leaves both rows failed. Implementer events cannot relabel either row. Info/warning and unrequired-check controls retain existing behavior. |
| 4 | Decode rejects unknown claim types and witness kinds with their paths. Absent witnesses emit no fields. Existing verification and snapshot suites pass unchanged, including WO-010/WO-011 historical replay and release-label/drift checks. |
| 5 | Product 02 changes in place by +721 bytes and product 10 by -79, inside their +800/+200 allowances and existing ceilings. Both publication locks are current. Decisions and index record the choices. |
| 6 | New immutable authority, artifact-identity and verification revisions `001`, deterministic harness refresh, and `feedback-001` from one live self-host episode; console self-host pins and expected outputs follow it. |
| 7 | `npm test -- --review`: 34 suites passed, zero failed, 405.96 s; `npm run test:docs`: 23 passed, zero failed, 15.88 s; `git diff --check` clean; kernel/dependencies unchanged. |

[witness-fixtures.tap](witness-fixtures.tap) records 13 passing focused tests with no failures or skips. The unchanged skeleton verification and worktree-snapshot suites separately passed all 35 tests. [Decisions](decisions.md) D004 records the contract-version decision; D005 and D008 record the edition refresh and live configuration. D007 records the stopped premature harness-gate calls; neither is a passing check.

The final [review transcript](review-gate.txt), [document transcript](doc-gate.txt) and [canonical gate rows](gate-records.json) retain the executed results. The completion command checks review coverage at the current code identity and runs the document gate inline after these report edits. The prior interrupted feedback assertion was rechecked in isolation after the edition was recorded and passed; the complete review gate also passes it.

The live feedback verifier used `codex-cli-exec`, CLI `0.159.2`, model `gpt-6.1-sol`, and `max`, with one recorded attempt. Its two feedback criteria reached verified and phase complete; the event span was 67,373 ms. The feedback check judges the current source, with ten passing regressions and ten removal failures. It is evidence of the feedback compiler, not of live visual/network capture. Its stream is retained by byte-exact references in [feedback-001](feedback-001/edition.json); the original ignored store is `.runtime/wo058-feedback-001`.

Reproduction:

```sh
npm run build
node --test packages/compiler/dist/test/verification-witness.test.js packages/skeleton/dist/test/verification-witness.test.js
node --test packages/compiler/dist/test/verification.test.js packages/skeleton/dist/test/verification.test.js packages/skeleton/dist/test/verification-worktree.test.js
npm test -- --review
npm run test:docs
git diff --check
```

The adjacent queue is empty. D006 records the eight existing textual follow-up matches on their current routes for final-review disposition. This receipt is executor evidence and does not replace independent verification.
