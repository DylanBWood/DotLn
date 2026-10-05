# WO-186 FINAL-002 — final review

**Verdict:** pass. WO-186 asked that gate time follow the change. That means three slow cases repaired at their cause, a rerun that runs only the tasks with no passing result at the code identity, a fresh worktree that reads main's row, an identity that covers untracked code, and a role that writes its own records while its product gate runs. This review judged the original order's eleven criteria, as D020 amended them, against the subject repaired after FINAL-001, and all eleven are met. FINAL-001's F1 is closed as a class: the runner and the completion's claim check now take each task's standing from one decision, and a review agent traced F1's exact arrangement through it. A fresh `npm test -- --review` at the reviewed code identity passed 36 of 36 suites with 86 fresh tasks and none reused. This review changed no source. It boards five low items under one follow-up ([D047](../../evidence/WO-186/decisions.md#wo-186-d047--final-review-pass-at-the-repaired-identity-five-low-items-boarded-with-one-follow-up)), none of which breaks a criterion, and it applied the close dispositions in one register batch.

**Subject:** [`docs/work-orders/WO-186-gate-time-follows-the-change.md`](../../work-orders/WO-186-gate-time-follows-the-change.md) on branch `wo-186`, uncommitted over `main` at `2816c773008c66b8ab0ac4a0fd73c21b7df9f2d0`. The dispatch checkpoint is `refs/dotln/checkpoint/WO-186/15` (`55a4e337`).

- **The base:** `git ls-remote origin refs/heads/main`, `origin/main`, local `main`, the merge base and `HEAD` all name `2816c773`, so no integration was due and the helper was not run.
- **The reports:** the SHA-256 of VER-001, VER-002, VER-003 and FINAL-001 each appears once in `docs/control/orders/WO-186.jsonl`, on its result event.
- **The order:** it differs from `main` in its heading's version label, `(v0.66.3)`, and in D020's operator-directed amendment of the objective and criteria 1 and 9, which `docs/control/plan-refutations.jsonl` records as `PlanExecutionAmended`. This review judged the amended text.
- **The identity:** the gate code identity is `3743c14b5afa554cf2517c23833d0bb807cc204f1ac9f637adcebbc9f1bcd718` at dispatch and after the gate, the identity VER-003 judged. The three new sources (`scripts/lib/case-marker.mjs`, `scripts/lib/case-reporter.mjs`, `packages/skeleton/fixtures/wo186-role-baseline.json`) were already staged by FINAL-001, and no other untracked source exists outside the order's records.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.289","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` as this session read it; it is the selected effort, not the effective one. The order recommends `reviewer any`. Disclosure: this is the model family and model of VER-001's and VER-003's verifiers. FINAL-001 and the first repair were `claude-fable-5-1`; the implementation and the second repair were Codex models.

Subagent plan, stated before the first spawn: two read-only review agents against the cap of 20, with 0 observed at entry and no descendants. One took reuse, identity and the claim check; the other took write admission, the read guard, case timing, planning conditions, test integrity and generated text. Each was told to change nothing and to run no suite; the live review gate refused their writes in any case. They reported 216,927 and 266,031 tokens.

**Process cost:** entry 86262 tokens; handoff 16242543 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 496dad67-3db9-40d2-a304-66fa35684f4d`.

- Entry was observed at 2026-10-05T20:37:57.539Z.
- Handoff was observed at 21:08:39.943Z, after D047, the register batch, this report's text, the PR body and the release notes, and before the document gate and the result transition. It counts 15,899,759 cached input, 257,935 cache-write, 186 uncached input and 84,663 output tokens over 104 steps and 85 commands. The counter reports 2 subagents, exact-observed, with 18 of 20 remaining.
- Both readings count reused cached input, so they do not measure live context. The subagents' tokens above are outside this total. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- The largest wait was the fresh gate, 934.361 s. Its critical path waited 297 ms for host lanes.

## Goal-aligned judgment

The mission contribution is less waiting on gates without less trust in a recorded result. A role may now skip a task because a pass is on record at the same code, so the question for this review was the one FINAL-001 failed on: is every skipped task backed by a pass that the latest run at the identity still supports?

- **Rule beating:** the repair's own sixteen-cell table is fixture-shaped. VER-003 tested the rule with an oracle written outside the subject over 4,200 random histories, and its control found 231 unsafe acceptances on the pre-repair lookup. This review also checked one claim that rested on an untested path, VER-003's sentence about the integration suite's progress line, against the live transcript. It was wrong in detail but not in what criterion 2 requires (D047 item 1).
- **Success to the successful:** three verifications and two earlier review gates did not replace the fresh gate the order names at final review.
- **Drift to low performance:** each boarded item is a register row with a condition, not a report sentence.
- **Shifting the burden:** the follow-up hands planning a reproduction or a labelled inference for each item.
- **Escalation and the tragedy of the commons:** a third repair cycle for items that break no criterion and cannot put a false pass on `main` would cost a repair, a verification and another gate of about 15 minutes. This review spent one fresh gate and two read-only agents instead.
- **Policy resistance:** no refusal, identity rule or dependency changes in this review.
- **Seeking the wrong goal:** no speed saving is credited. The record shows a lower plain-gate median and a higher document-gate median, and no whole-order saving is established.
- **Naive Interventionism:** no source edit. The only writes are D047, the register batch and the publication texts.
- **NoOp:** without a pass, `main` keeps full reruns at an unchanged identity, full first gates in worktrees whose code equals main's, and refused record writes during a product gate.

## What this review read

- **The order, FINAL-001, VER-001 (head and findings), VER-002, VER-003, the handoff, D041 to D046, `close-register.md` and the draft `PR.md`.**
- **The repair delta** against checkpoint 9 in `scripts/lib/gate-reuse.mjs`, `scripts/lib/product-read-guard.mjs` and `scripts/test-runner.mjs`, and in full `latestExecution`, `decidingExecution` and `decidingPass`, the progress capture loop and the reporter flags in `executeSuite`.
- **The cited sources:** the stand-down's rule 10, the cross-process proof record, product 07 §Discipline's reuse paragraph and §Retained planning follow-ups, product 08 §PRs and commits and §Release-note edition, `readGateChecks` and `recordGateChecks`, and the version, lock-file, README, `CLAUDE.md` and budget diffs.
- **By the two agents:** every other changed source and test file against `main`. Each finding below that rests on an agent's reading says so.

## Criteria

**Criterion 1:** met. The repair changes none of the three cases or their tests. D003, D004, D005 and D024 record the causes, and the five-run medians stand as FINAL-001 recomputed them by hand: the harness case 1.924 → 1.758 s, the skeleton task 355.779 → 229.754 s and the integration task 307.349 → 226.064 s. Skeleton and integration miss 200 s and 150 s, and `costs.md` with `final-case-profiles.json` supplies the profile the criterion admits instead. An agent compared the test diffs with `main`. Every removed assertion line of the lock matrix reappears in its concurrent form, and the 120 s cell deadline and the failing-cell fixture are unchanged. The new child limits (10 s, 1 MiB) match the old `spawnSync` defaults. In this review's gate, single observations: skeleton 232.759 s, integration 245.683 s, and the harness case is not among `harness-fixtures`' five slowest cases, the fifth of which took 11.678 s.

**Criterion 2:** met. All 86 tasks in this review's row carry one to five slowest cases. The case reporter's end events put each case's duration on the row. Live progress showed each integration case's TAP subtest line as the case ended: the heartbeat at 15.0 s names the fast-forward case, entered 14.9 s before, and its subtest line arrives at 16.3 s. The suite's own `PROGRESS integration case ended` line never reached live progress: 0 of 21 cases in this gate's transcript. It is printed from inside `node:test`, so it reaches the runner as a TAP comment, which the forwarding pattern at `test-runner.mjs:1234` does not match. VER-003 said it "is still forwarded"; that is inaccurate for this suite. D047 item 1 boards it.

**Criterion 3:** met. FINAL-001's F1 is repaired.

- **The decision:** `decidingExecution` (`gate-reuse.mjs:267-282`) is now the one decision for the runner's carried results and the claim check's displaced tasks (`:376-391`).
- **F1's arrangement:** a worktree with no `npm test` row, then a failed `--only beta`. `latestExecution` returns that failure from its other-check branch, so main is never consulted, `own` is the failed row and beta is displaced for both readers. The agent traced this path.
- **The class:** VER-003's independent oracle found no unsafe acceptance or carry in 4,200 random histories, against 231 claim violations in 600 histories on the pre-repair lookup.
- **The criterion's own clauses:** `runner-fixtures` passed in this review's gate (65.891 s), with the composed-row, second-shell, failed, stopped and partial fixtures and the FINAL-001 regression and table. `--review` ran every task fresh: 86 executed and 0 reused.

**Criterion 4:** met. The identity is unchanged with the new sources staged, and the untracked-edit, staging, symbolic-alias and `docs/LEGAL.md` fixtures passed in the gate. D007 and D013 route the eight suites WO-174 D013 actually names (the order says seven): five to the fresh document gate and three keyed by the vocabulary. D033 and D045, and product 07, state which inputs remain outside the identity.

**Criterion 5:** met. "WO-186 a fresh worktree reads main's passes without modifying main, while a changed source runs" passed in the gate, with the FINAL-001 failure-and-recovery case beside it. An agent confirmed that `consultableMain` and `readGateChecks` only read, and that `recordGateChecks` writes the worktree's own path.

**Criterion 6:** met. The sibling-advance fixture passed in the gate. `changedMachinery` diffs from `git merge-base HEAD origin/main` with `--no-renames -z`, falls back to `main`, and selects every machinery suite when the base or the untracked listing is unavailable.

**Criterion 7:** met. The generated-hook live-gate fixture and the read-guard fixtures passed in the gate. An agent read the admission: it applies only while every live run is a product gate, in an admitted phase, for a `WO-\d{3}` order at the default document roots. The written and resolved paths must lie inside the order's directory, and symlink, hard-link, `..` and case aliases fail. During this review's mixed review gate the hook refused each command this review submitted outside its read-only list, as product 07 states for review gates. The narrowed five-refusals sentence is byte-identical in the generator, `CLAUDE.md` and all twelve role roots, and the old "during a live npm test" wording appears in none of them.

**Criterion 8:** met. `npm run plan -- conditions`, run here under the bounded wrapper in 25.1 s, lists the five longest tasks of this review's gate against their earlier thirty-day medians:

| Task | This gate | Median | Holds above | Holds |
| --- | ---: | ---: | ---: | --- |
| `harness-fixtures` | 333.977 s | 252.13 s | 378.195 s | no |
| `worktree-integration` | 245.683 s | 122.449 s | 183.674 s | yes |
| `skeleton` | 232.759 s | 294.859 s | 442.289 s | no |
| `target-publish` | 153.562 s | 15.199 s | 22.799 s | yes |
| `worktree` | 125.595 s | 84.38 s | 126.57 s | no |

It shows the plain gate's thirty-day median, 294.876 s, against 360 s. The listing prints thresholds as raw floats, which is cosmetic.

**Criterion 9:** met. The repair changed no measurement. The plain medians 495.605 → 422.027 s and the review medians 506.452 → 814.813 s stand, on different selections for the review gate, as the records say. `costs.md` reconciles each Cost-line item, books no hypothetical saving and, after D045, separates the failed review gates (1,235.443 s) from the earlier outer timeout (900.119 s). `replay-affected.mjs` and its output for thirty orders are kept. D046's fifty-order model is labelled conditional. At the reviewed identity the timings are single review gates: the repair's 932.703 s and this review's 934.361 s.

**Criterion 10:** met. Product 07 §Discipline states, in place and with no dated paragraph: task reuse, the shared worktree-first decision, integrity displacement, the no-row boundary for unpersisted runs, the storage-unavailable advisory, the identity's coverage, the main lookup, the merge-base selection and the narrowed refusal. The generated sentence, README's test paragraph and refusal sentence, and the security document agree with it. The register rows the provenance names are retargeted by this review's batch below, as `close-register.md` specifies. The publication suite runs in the document gate.

**Criterion 11:** met.

- `npm test -- --review` passed as recorded under Executed checks.
- `npm run test:docs` passed at this subject with D047, the register batch, this report, `PR.md` and `RELEASE-NOTES.md` in place: 29 passed, 0 failed, 66.062 s, 29 fresh tasks, recorded 2026-10-05T21:10:03.497Z at code identity `3743c14b…`. The result transition runs it again inline.
- `git diff --check` and `git diff --cached --check` are clean.
- The package changes are the compiler 0.25.1 → 0.25.2 and skeleton 0.52.2 → 0.52.3 versions, the host version constant 0.34.3 → 0.34.4, the console's exact pins and the lock file's version lines. No dependency is added.
- The agents found no new `eslint-disable`, `@ts-ignore`, `@ts-expect-error` or `@ts-nocheck` in the diff or the staged files.

## Boarded items (D047, FUP-5094b24d6d68d2e4)

None breaks a criterion, and the review gate always runs fresh, so none can put a false pass on `main`. Each fix is new behavioural code, which a reviewer does not write and certify. Even the comment edit changes the code identity and needs another full gate.

1. **The case-ended lines are not live.** Confirmed in this gate's transcript, as under criterion 2. The same applies to `scripts/test-harness.mjs`'s harness case line.
2. **A parent test and its subtests share the five slowest slots.** Confirmed by an agent's reading: `case-reporter.mjs` emits every `test:complete` except the file's own, and the runner drops `nesting`. The lock-matrix parent and its cells can fill the skeleton task's five slots.
3. **A stale fixture comment.** `scripts/test-runner.test.mjs:435-436` says a failed row never satisfies the lookup; passing tasks from a failed row whose identity held now carry, and the fixture's failed row sets `identityUnchanged: false`.
4. **A lock-free index read, by inference.** `readGateChecks` reads the archives and then the hot file without the writer's lock, while `recordGateChecks` moves its oldest hot row into an archive and then replaces the hot file (`gate-evidence.mjs:827-918`). A read between the two can miss that row. If it were a task's latest failure at the identity, an older archived pass would decide. Since this order, a worktree reads main's index this way while main may be recording. Not reproduced.
5. **Globs are untested.** The read guard wraps neither `fs.glob` nor `fs.globSync`, and whether Node's internal reads under them reach the wrapped forms is unknown.

The agents raised two more items, each already disposed. A run that ends before its row is written displaces nothing; D045 states that bound and product 07 says it in place. `findGateCheck` keeps the whole-row rule; D038 and FUP-5e52eb500e395237 hold it for planning.

## Register

`npm run plan -- followups --touching --work-order WO-186` returned 28 rows over four pages at register revision `ce5babf2…` (143 paths and WO-186, 181 pending). D047's follow-up then synced as FUP-5094b24d6d68d2e4, untriaged for planning, at revision `ead0b8b6…`. One `followups --apply` batch disposed fourteen rows, and the register moved to `fcedb48f9303b178fd9ac85035dfbae18dee9e8c7ad3bda8bb49b36968d9ced4`. Seven of the rows are allocated to WO-186 and so absent from the pending feed. Each reason cites this report and the close register.

| Row | Disposition recorded | Why |
| --- | --- | --- |
| FUP-a9a0591a63757bf2 | settled | Task reuse, as `close-register.md` specifies; one shared task-standing decision (D044). |
| FUP-7629e03c6573f5cb | settled | Untracked code in the identity; staging preserves it. |
| FUP-71602ec08bc81e9d | settled | The duplicate of the row above. |
| FUP-986fa3905beb0695 | settled | Merge-base review selection. |
| FUP-5cc91ab6105d2eeb | settled | Composed rows name their sources; forced-fresh rows record why. |
| FUP-b28b870422a74166 | open | The excluded-input remainder (D033, D045). |
| FUP-331423b3559f5cfa | open | D005 disproves the 180 s premise; the remaining selected-suite cost goes to planning. |
| FUP-e96221b106cd136a | open | The after-phase plain median, 422.027 s, is above 360. |
| FUP-fb8cbeabbddef397 | open | The document gate's median rose to 66.690 s. |
| FUP-77efd30be6cab5c1 | open | Its plain-gate condition occurred on the same figure; the replay half has not. |
| FUP-3d6a8147368bdf1c | deferred, condition narrowed to gate-run liveness | This order edits `gate-evidence.mjs` but not marker liveness; main's null-birth marker of 2026-09-16 remains, pid 43275 absent. |
| FUP-e821aa2ced3aa111 | deferred, same condition | The reporter is added to `node --test` commands only, not to suites started through `node()`. |
| FUP-e8f5399db33d0b5a | deferred, same condition | This order opens the runner but none of the five named guard and runner paths. |
| FUP-f1c7a256bec46737 | open, kept with a new measurement | Executor 29,237 of 29,246; verifier 25,735 of 29,831 after D016's acceptance. |

The other rows were textual matches whose seams this change did not open and whose conditions did not occur, so they are left as they are.
- FUP-adf6621e7f958dd8: `authority.json` copies are 5.55% of tracked and pending evidence bytes, against a 10% condition, and `authority-evidence.mjs` is unchanged.
- FUP-bf51ac5cd8143d98: `gateTreeHash` is unchanged.
- FUP-bfab19adc5e5eac1: four deadline diagnostics were hit with no failure, and none is a deadline loss.
- FUP-895692b9939c8181: the reviewer ran twice for this release, but no operator request for its cost column is recorded.
- FUP-04ec9fa011f39d93: this review's gate met no deterministic failure.
- The rest: FUP-0132, FUP-0804477ea9d640a7, FUP-33173b7f87004a9c, FUP-4b70089b028849f0, FUP-4f8cd7989607ad3f, FUP-7fd69f3bda6fa326, FUP-8cfd3ff52146a016, FUP-acfe4bfda716d8fb, FUP-b3454d6ce3594ef3, FUP-d0a9719cc2e4ec55, FUP-ec72b2ea596bdc75 and FUP-fd05316b6030ef73.
- The order's own planning rows stay untriaged for planning: FUP-0c10689747f83675 (D033), FUP-16a4af39c710459b (D039), FUP-511b5a41d831fe83 (D036), FUP-5e52eb500e395237 (D038) and FUP-5094b24d6d68d2e4 (D047).

## Integration and carry-ins

- **Integration:** none due. Both bases are `2816c773`. `git ls-remote --tags origin v0.66.3` returns nothing, so the version does not collide.
- **Receipt 038:** its reopening condition did not occur. Every task ran fresh and passed at the identity whose row the repair recorded and VER-003 consumed.
- **D038 and D039** keep their planning owners.
- **`npm run meta`** reports one reopen candidate, WO-150-D003 (executor cold start above 24,576 bytes). It predates this order; the executor's own ceiling is 29,246 and this order adds 780 bytes within it.

## Verification sequence

1. **Activation:** 2026-10-05T00:55:22Z, checkpoint 1.
2. **Implementation** (Codex CLI 0.160.0, `gpt-6-astra`, max, `codex-session-readback`): `ImplementationReady` at 09:43:51Z, checkpoint 2. D001 to D030, including D020's operator-directed amendment.
3. **[VER-001](../../verifications/WO-186/VER-001.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh, subagents): fail at 14:36:46Z on criterion 3 (F1), with R1 to R8 to the repair (D031) and D032 boarded.
4. **Repair** (Claude Code 2.1.289, `claude-fable-5-1`, xhigh): requested 14:38:20Z, completed 17:37:35Z, checkpoint 6. D033 to D040.
5. **[VER-002](../../verifications/WO-186/VER-002.md)** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): pass at 17:56:21Z.
6. **[FINAL-001](FINAL-001.md)** (Claude Code 2.1.289, `claude-fable-5-1`, xhigh): fail at 18:48:12Z on criterion 3 (F1), with R1 to R3 and D042's items to the repair. D041 and D042.
7. **Repair** (Codex CLI 0.160.0, `gpt-6.1-sol`, max, `codex-session-readback`): requested 18:49:46Z, completed 19:42:06Z, checkpoint 12. D043 to D046.
8. **[VER-003](../../verifications/WO-186/VER-003.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): pass at 19:58:47Z.
9. **This review** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): dispatched 20:37:47Z, checkpoint 15. D047.

## Executed checks

Every probe outside the gate was read-only or ran under `node scripts/harness.mjs bounded`. Transcripts are in this session's DotLn scratch.

- **State:** `npm run resume --silent -- status --json`, `node scripts/harness.mjs writer --show`, usage at entry and handoff, `git ls-remote` for `main` and the `v0.66.3` tag.
- **Hashes and identity:** each report's SHA-256 against the control log, and `gateCodeIdentity` at dispatch and after the gate.
- **Product gate:** `npm test -- --review`, recorded 2026-10-05T20:54:41.767Z at code identity `3743c14b…`, tree `179275a7`. Exit 0, forced fresh (`freshReason: review`), 36 suites, 86 tasks executed, none reused or failed, `identityUnchanged` and `buildOutputUnchanged` true, 934.361 s. Its transcript has no `not ok` line.
- **Document gate:** `npm run test:docs`, as criterion 11 records.
- **Criterion 2:** counts of case-ended and `worktree-integration` progress lines in the gate transcript.
- **Criterion 8:** `npm run plan -- conditions`, bounded.
- **Register:** the four `followups --touching` pages, `--show` for the fourteen rows, `followups --sync` and the `--apply` batch; `node scripts/harness-context.mjs --check`; the `authority.json` byte share; main's live-gate marker directory.
- **Write-backs:** `npm run meta`, and the sentence comparison across the generator, `CLAUDE.md` and the role roots, by an agent.

Not re-run: the planted-defect controls, the assertion inventories, the second-process proofs, the replay and VER-003's random-history probe. Each stands on its recorded run, and the fixtures that pin them ran in this gate.

## Observations with no finding

- **No lane wait this time.** FINAL-001's gate waited 385.587 s for lanes another worktree held; this one waited 297 ms. That is the parallel-workflow variance D020 says to retain, not an effect of this order.
- **Four deadline diagnostics, no failure.** One 300 ms worker-transport deadline in `skeleton` and three fixture deadlines in `runner-fixtures`, each `deadline-hit-cause-unestablished`, the same count FINAL-001 saw.
- **Two statistics for one threshold.** The conditions listing holds the thirty-day median of all fresh plain gates (294.876 s) below 360 s, while the close register reads this order's after-phase median (422.027 s) as above it. Both are recorded; the register reasons name which one decided.
- **A slight loosening in one fixture.** `test-process-debt.mjs` strips the guard-registration advisory before comparing two briefings, as D040 records. It mirrors the existing beacon-warning strip.

## Publication

The verdict is pass, so this review prepares [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md), records `final-review-result pass`, commits the reviewed state and runs `npm run worktree -- publish WO-186` with that title and body. It does not merge, push `main` or publish a release.
