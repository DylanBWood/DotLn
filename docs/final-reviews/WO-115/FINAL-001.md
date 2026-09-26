# WO-115 — FINAL-001

**Verdict:** fail. Original criterion 5 remains unmet: neither complete product gate on the integrated subject passed. The prior queue-loss finding and mixed-revision integration-fixture finding remain resolved.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.157.1","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

**Process cost:** entry 37743 tokens; handoff 11213406 tokens; source codex-transcript-counter

Scope: this root dispatch, entry cutoff 2026-09-26T03:52:42.866Z and report-preparation cutoff 2026-09-26T04:14:33.795Z. These are cumulative transcript counters including repeated and cached input, not unique context or a dollar estimate. Dollar cost and child token totals are unknown. Explicit accounting is two read-only reviewers, both reused, no descendants, against cap 20. Harness observations report zero admissions with unknown uncounted remainder; that is not a claim that no agents ran. Later counters stay in ignored receipts and the handoff response.

## Subject and integration

The reviewed subject is the uncommitted WO-115 implementation integrated from base `af401170e0c9f197e9f6a1cd2cf1ea26d4d5c2e4` onto fetched main `f73b7e184b38de9cab97b4e86c718b6006f6b19d`. Both final-review gate runs record code identity `356a17786393d4a5e8bdfd3bc68a637b8553e10c244eb0f527c3b3e1f323f72d`. No implementation or test source was changed during review. The root was the sole writer; two read-only reviewers examined transport/replay and contract/authority, then integration and the watcher observation.

The canonical integration helper preserved checkpoint `refs/dotln/checkpoint/WO-115/14` and named stash `WO-115 integrate 2026-09-26` (`d820b3080a64a46e26160431fdbb6d0357c0064e`). It fast-forwarded the branch and retained the uncommitted subject. No ignored intake was present. Authored conflicts were `docs/evidence/current.json`, `docs/product/06-roadmap.md`, `package-lock.json`, `packages/console/package.json` and `packages/skeleton/package.json`. Resolutions retained both roadmap entries, upstream Beacon workspace/imports and feedback evidence, and the existing WO-115 component versions and lockfile pins. Application v0.52.0 remains the next minor above integrated v0.51.1; skeleton 0.44.0 and console 0.3.0 remain valid additive bumps. No dependency was added by this order.

The helper regenerated harness, control, indexes, publication locks and selected console fixtures. Package conflict markers initially prevented a build; after resolution, the local installation needed the newly integrated Beacon workspace link. Refreshing local dependencies with lifecycle scripts disabled resolved that, and `worktree integrate --continue` completed. Authority revision WO-115/002 records the integrated bundle: its authority JSON is byte-identical to WO-115/001 and upstream WO-070/001, while bundle differences are edition wording and digests. Feedback retains WO-070/001 with unchanged judged behavior. VER-001 through VER-003 and both WO-115/001 authority files remain byte-identical to checkpoint 14. [D016](../../evidence/WO-115/decisions.md#wo-115-d016) records the integration and carried claims; earlier verdicts are not represented as judgments of these new bytes.

## Verification sequence

- [VER-001](../../verifications/WO-115/VER-001.md) failed for queued-request loss (F1) and the full gate's mixed-revision fixture limitation.
- [VER-002](../../verifications/WO-115/VER-002.md) resolved F1 with the repaired fixture and an independent two-heartbeat socket probe; it failed solely on the remaining fixture-coherence gate finding G1.
- [VER-003](../../verifications/WO-115/VER-003.md) independently passed after the bounded fixture repair. Its complete 27-suite gate judged its recorded pre-integration subject. It does not discharge the current gate failure.

The complete subject diff, current authored evidence, original order, selected product sections, relevant terminal parsers, new sources and existing tests were reviewed. Generated hook changes against integrated HEAD are digest-only; source comparison found no added lint or type suppression. The pre-2026-09-09 ledger duty is discharged through the decisions record and index; there is no separate ideation receipt selected for this order.

## Acceptance judgment

**Criterion 1:** met

The fresh retry's complete console suite passed in 25.146 seconds. It exercises all 23 command IDs directly and over loopback using phase-independent parser refusals, comparing exit code and exact stdout/stderr bytes and checking unchanged control/domain events. Successful reads, compiled diff, presence changes, text-host invocation and queued results also pass. Fixed Node entrypoints, argv, cwd and sanitized console-child environment retain the terminal implementation without a shell. Successful lifecycle, intent, bind and emit pairs remain unexecuted; their parity is supported by shared dispatch plus refusal coverage, as D009 and VER-003 disclose. Neither reviewer found a new contract defect.

**Criterion 2:** met

The same passing suite covers unknown commands, missing/wrong tokens, foreign Origin and Host, malformed/oversized requests, classification refusals and current compiled-envelope denials. Source inspection confirms loopback binding, owner-only descriptor storage and reuse of the terminal classifier/decider. Console refusals retain exit 1, empty stdout and the documented error line. A real second OS account and browser shell were not exercised; local-user isolation rests on mode/ownership checks and token-refusal fixtures.

**Criterion 3:** met

The current console fixtures pass console-actor receipts, digest-checked replay, incomplete admitted invocations, interrupted commands, queued departure and orderly shutdown. Headers and keepalive precede serialized admission; queued callers no longer disappear under ordinary disconnect/shutdown. Replay does not rerun effects. The previous independent heartbeat probe remains historical evidence on unchanged console source, not a new probe here. Crash-durable queue admission, arbitrary client deadlines and unlimited duration are not established; queued requests remain in memory until their lane turn.

**Criterion 4:** met

Product 04, product 07, console/skeleton READMEs, decisions and index satisfy the write-backs. The planning map already allocates the contract half to WO-115. Unsupported saved-build selection, equip preview and portfolio declaration remain documented exclusions. Publication and harness checks passed after integration. The seven resolved WO-115 follow-up rows were settled through the canonical API with evidence and reopening conditions; the current findings are separately recorded.

**Criterion 5:** unmet

`git diff --check` passed and manifest/lockfile inspection shows no new dependency. However, `npm test -- --review` exited 1 (35/36 suites passed, 80 fresh tasks, 664.821 seconds, cutoff 2026-09-26T04:06:20.583Z), and the fresh complete `npm test` retry also exited 1 (27/28 suites passed, 72 fresh tasks, 418.999 seconds, cutoff 2026-09-26T04:14:11.764Z). The integrated Beacon workspace accounts for the additional product suite relative to VER-003. Both rows have the same code identity. No waiver applies.

## F1 — No passing integrated product gate

**Severity:** medium (P2), acceptance/evidence blocker. **Criterion:** 5. **Expected:** an executed, complete passing `npm test` on the integrated subject. **Observed:** two failed complete runs with different deadline failures. Root causes remain unestablished; this is not a proven console-command defect and not a synthetic pass assembled from successful suites in different runs.

The expanded run failed `WO-114 text host refreshes after atomic replacement` in `packages/console/test/runtime-status.test.ts:194–219`: `status watch timed out` at the existing 2,000 ms deadline. The canonical output is `docs/control/local/harness/check-output/e403695bfd399d5492c007df0aa4fa61678d49a3c89c0e1bfeb1b11711252f46.log`. The test directly invokes unchanged `watchRuntimeStatus` in a private temporary directory; it does not exercise new transport code. One isolated rerun passed in 10.070 ms (2,042.473 ms total process duration), and the later full console suite passed. Those observations do not establish load, missed notification or test instrumentation as the cause. [D017](../../evidence/WO-115/decisions.md#wo-115-d017--preserve-the-unchanged-watcher-timeout-and-obtain-fresh-product-evidence) and `FUP-47287cef595c25e5` retain the watcher follow-up.

The complete product retry failed `WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers` in `packages/skeleton/test/resident.test.ts:775–860`. The canonical output is `docs/control/local/harness/check-output/e893ad876f411b4bc88466be3d1559c978cae5912c42acbd2436c0ef794b80d8.log`: test 224 reports `testTimeoutFailure`, `test timed out after 240000ms`, measured duration 241,525.447167 ms. Six acquisition/reclaim categories report completion before the deadline; the subsequent thirty-round kill/restart case passes. The test is unchanged, but resident host/store dependencies are touched by WO-115, so a runtime impact is not ruled out. The expanded run's skeleton suite passed; the retry's console and integration suites passed. Neither full row is green.

**Reproduction:** from this integrated worktree, run `npm test -- --review` for the first selection or `npm test` for the complete product selection. The watcher-only diagnostic is `node --test --test-name-pattern='text host refreshes after atomic replacement' packages/console/dist/test/runtime-status.test.js`. Preserve the two canonical failure logs and their timestamps. The observed failures may not reproduce on every run; a passing focused check alone cannot satisfy criterion 5.

**Repair target:** investigate notification/recovery behavior, instrumentation and resource effects from the recorded evidence; make only bounded, evidence-backed changes while preserving assertions and the original criteria. Obtain a fresh complete passing product gate and independent verification. Do not reopen the resolved queue-loss or fixture-base defects merely because this integrated gate failed. Do not increase deadlines solely to obtain green output. [D018](../../evidence/WO-115/decisions.md#wo-115-d018--final-review-fails-the-integrated-product-gate) records this required follow-up as `FUP-db0a2c8b8a05d4ae`.

## Goal judgment and handoff

D016–D018 compare the mission and Gate U contribution with all eight system traps, Naive Interventionism and NoOp. The observed console behavior supports the intended shared command boundary, but current complete release evidence remains inadequate. Two batched reviews, one expanded gate, one focused diagnostic and one complete product retry yielded a concrete bounded repair target; no cost saving or timing root cause is claimed. The generated harness and resident store also recorded this work, so their receipts are not independent proof of their own correctness.

After filing the report, `npm run test:docs` passed all 21 suites in 27.59 seconds. Planning, publication and `git diff --check` also passed. The watcher follow-up is canonically linked as a duplicate of the open combined repair follow-up; the seven earlier resolved rows stay settled. These document checks do not discharge the failed product gate.

Record final-review failure and hand off `resume: fix`. Preserve the integrated work, all prior reports, checkpoints and stash. No publication artifacts or branch commits are prepared as a passing release; publication remains contingent on repaired and independently verified evidence.
