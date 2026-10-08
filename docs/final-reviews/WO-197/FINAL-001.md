# WO-197 FINAL-001 — final review

**Verdict:** pass. WO-197 asked that three gate tasks that had grown past their thirty-day medians be brought back at their cause, each repaired case carry a bound on its own duration, and the vertical suite's slowest cases be named. This review judged the six criteria against the subject integrated with `main` at `fdb205c1`, which had not moved since activation. Criteria 3 to 6 are met. Criteria 1 and 2 are unmet, and the operator waived them at ordinals 5 and 6. Both capture hashes still match their events, so this review judges them from the record and does not put them back to the operator. Nothing blocking was found, and the findings block is empty. This review made no source edit. The code identity stays `1641987c5cc467978750209176252c09c126cd9f1a17b7eeecc5e5be40ba5aa8`, which both verifications judged.

**Subject:** [`docs/work-orders/WO-197-slow-suites-back-to-their-medians.md`](../../work-orders/WO-197-slow-suites-back-to-their-medians.md) on branch `wo-197`, uncommitted. `HEAD`, the order's base and the fetched `main` are all `fdb205c1eaedbde7b4ad810746a8411e7410e016`. The dispatch checkpoint is `refs/dotln/checkpoint/WO-197/11` (`b5433398`) and the integration checkpoint is `/12`.

- The reports: the recorded `reportHash` of VER-001 and VER-002 each equals the report's current SHA-256 (`3be06167…` and `ae6b2d22…`).
- The order: it differs from `main` only in its heading's version label, `(v0.69.1)` in place of `(version assigned at activation)`, which `release prepare` wrote (D003).
- Ideation: no ideation breakout receipt applies, and the evidence folder holds none.
- Carried bytes: a full-tree comparison through a temporary index against checkpoints 11 and 12 differs only in documents. Every source byte VER-002 judged is carried unchanged, and `gateCodeIdentity`, run bounded, returns the same identity.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.293","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice during the review. The harness version comes from `claude --version`. The model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` as this session read it, which is the selected effort, not the effective one. The order recommends `reviewer any`.

Subagent plan, stated before any spawn: none, against a `subagentCap` of 20 with 0 observed at entry. The reviewer procedure spawns a worker only to reproduce a named claim, and every claim this verdict rests on was reproducible in this session. The counter at handoff reads 0 subagents, exact-observed, with 20 remaining and an unknown uncounted remainder.

**Process cost:** entry 88590 tokens; handoff 13309027 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage bd10fdd5-d07f-4ecd-9a48-e7fe7257c8ac`.

- Entry was observed at 2026-10-08T00:13:22.072Z.
- Handoff was observed at 2026-10-08T00:27:38.779Z, after the product gate and before this report's final document gate and the result transition. It counts 13,048,632 cached input, 209,913 cache-write, 164 uncached input and 50,318 output tokens over 86 steps and 83 commands.
- Both readings count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- The largest wait was the document gate, 114.53 s. The review gate composed at the unchanged code identity in 7.41 s, against 1,477.586 s for the executor's fresh run there. The rest went to the integration and its affected checks, three `plan conditions` runs of about 31 s each, reading and short probes.

## Goal-aligned judgment

- **Rule beating:** VER-002's pass was not taken as the verdict. This review read the whole source diff again, reproduced the listing counts, the bound counts and the removed assertion lines itself, and judged the integrated subject with its own gates. A waiver changes the obligation, not the evidence, so criteria 1 and 2 stay `unmet, waived by <ordinal>`.
- **Re-litigating an off-ramp:** both waivers have matching capture hashes, so this review judged them from the record.
- **Closing a register row that still holds:** the order's three gate-task conditions no longer all hold, but a fourth condition on the same row, `gate-task:worktree`, now holds. So that row returns to planning instead of being settled.
- **NoOp:** without merging, every fresh review gate keeps paying about 451 s more task time in these three suites, and their next growth would again surface only as a suite total.

The outcome matched: the three suites cost less and keep every assertion, each repaired case now guards its own duration, and the two unmet targets stay visible as waived.

## Criteria

- **Criterion 1:** unmet, waived by 5. [`task-durations.json`](../../evidence/WO-197/task-durations.json) lists 369 `target-publish`, 435 `worktree-integration` and 320 `harness-fixtures` rows since 2026-09-07. Only 53, 53 and 42 of them carry per-case durations, and the earliest of those is 2026-10-05T06:12:03.262Z. Each first threshold crossing is earlier: 2026-09-29T22:57:53.942Z, 2026-09-25T05:49:27.867Z and 2026-09-15T19:01:26.135Z. This review read those counts from the file itself, and they equal VER-001's reproduction against main's gate store. D001 records the commit-window queries and names no case for any first crossing, because none can be read. The waiver at ordinal 5 has capture hash `sha256:a7f94381…`, which equals the recomputed hash of the ignored capture.
- **Criterion 2:** unmet, waived by 6. This review read the order's fresh review row (2026-10-07T21:42:47.615Z, code identity `1641987c…`, exit 0) with `readGateChecks`. It records `target-publish` at 129.847 s against a 22.254 s ceiling, `worktree-integration` at 181.029 s against 156.976 s, and `harness-fixtures` at 289.515 s against 326.779 s. The alone runs at this identity are the executor's 110.683, 134.598 and 285.816 s, VER-001's 105.311 and 135.661 s, and VER-002's 286.755 s for harness. So publication misses both ways, integration misses only in the gate, and harness meets both. The waiver at ordinal 6 has capture hash `sha256:197ec601…`, which equals the recomputed hash. The same three tasks in WO-196's last fresh review gate took 357.116, 301.547 and 392.918 s.
- **Criterion 3:** met. The publication file registers 27 bounds and the integration file 10, each in a `repairedCaseMs` map. The harness file carries 5 inline bounds: one shared by the three WO-125 F3 modes, plus WO-132 and WO-158. Every bound is `performance.now() - started <= 2 * measured`, and in the two map files it runs in an `after` hook registered after the case, so fixture cleanup counts. In both map files a module-end `assert.deepEqual([...unregisteredCaseBounds], [])` fails the file if a bound names no declared case. `git diff -U0` over the three files removes exactly two assertion lines. Each is restated: the publish-status check moves into seed creation with added `PullRequestOpened` checks, and the post-release `permissions` check runs through the real entry for every write plus one generated-process check. VER-001 matched all 42 constants to cited measurements rounded up to 0.1 s and ran a time-scaling negative control in each file, and VER-002 repeated the constant match. No bound failed in any gate row at this identity.
- **Criterion 4:** met. [`vertical-timing.md`](../../evidence/WO-197/vertical-timing.md) names the three slowest of 196 cases, 31.662, 26.518 and 26.433 s, with what each waits on. The order changes neither vertical test file nor the vertical fixture, so no case was repaired, which is correct under the Design. VER-001 and VER-002 both scanned the three case bodies and the fixture clock and found no timer or sleep.
- **Criterion 5:** met. The one runtime change is `fnv1a64` in `packages/compiler/src/normalize.ts`, recorded as Adjacent Repair adjacent-0001 in D005, with the WO-132 live-gate matrix as the case that showed it. This review re-derived the arithmetic: with state `H·2^32 + L` and prime `256·2^32 + 435`, the new low word is `L·435 mod 2^32` and the new high word is `(H·435 + ⌊L·435 / 2^32⌋ + L·256) mod 2^32`. That is what the code computes, and the sum stays below 2^42. The compiler version constant, package manifests, lockfile pins, generated hooks and evidence editions follow from it. VER-002 found no mismatch over 116,788 inputs against a BigInt reference and the hook's embedded copy.
- **Criterion 6:** met. This review's `npm test -- --review` passed 35 of 35 suites in 7.41 s at code identity `1641987c…`, recorded 2026-10-08T00:27:31.311Z. It composed at the unchanged identity: `format` ran fresh (7.23 s) and 84 passing tasks were reused from the executor's fresh row of 2026-10-07T21:42:47.615Z, which passed 35 suites with 85 fresh tasks in 1,477.586 s. `npm run test:docs` passed 29 of 29 fresh tasks in 114.53 s before the gate, and `final-review-result` runs it again inline. `git diff --check` exits 0. No dependency is added: the root `package.json` is unchanged, and the lockfile and the compiler, console and skeleton manifests change only the compiler version and its two workspace pins.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

This review found no defect beyond what the verifications recorded, and neither verification recorded an in-surface defect. A scan of added lines in `scripts/` and `packages/` found no new lint or type suppression, `.only` or skipped test.

Notes, not findings:

- **Seeds live until process exit.** Publication seeds stay in the system temporary directory until the suite's `exit` handler runs. A run stopped by a signal leaves them behind, as a stopped run already left its current case's fixtures (VER-001).
- **One redundant guard check.** In `guardReviewScenario`, `calls()` returns the synthetic effect log, so the retained `assert.doesNotMatch(x.calls(), /mutation/)` is correct but redundant: the getter that would write that log already fails the case (VER-001).

## Integration

- `npm run backup:intake` archived the two ignored waiver captures to DotLn session scratch. `npm run worktree -- integrate WO-197 --intake-backup <that archive>` verified the archive, found `main` at `fdb205c1`, equal to the base, and stored preservation checkpoint `/12` and named stash `695b3726` (`WO-197 integrate 2026-10-08`). It merged nothing, re-applied the work and regenerated the projections. There were no authored conflicts, and both captures remain in place.
- No component version collides. The release target v0.69.1 stays above v0.69.0, the only `v0.69` tag, and `npm run release -- check-surfaces --local` passes.
- The printed affected checks all exit 0: `npm run publication:check`, `node scripts/harness.mjs check` (33 generated surfaces), `npm run release -- check-surfaces --local` and the integrated `npm test -- --review`. So does `npm run plan -- check` (41 receipts, 30 passes).
- [D016](../../evidence/WO-197/decisions.md#wo-197-d016--integrate-main-at-fdb205c1-during-final-review-nothing-upstream-moved) completes the draft integration record with the carried-forward claims.

## Register

`npm run plan -- followups --touching --work-order WO-197` returned 14 rows at revision `10838ec2…`, and this review read both pages. It read the two rows allocated to WO-197 with `--show`, since neither is listed as pending. One `followups --apply` batch of two requests moved the register to `00b49eab…`.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-e96221b106cd136a (cold-gate structural cuts) | returned to open | WO-197 took its three gate-task conditions. `plan conditions` on 2026-10-08 no longer holds `harness-fixtures` (289.515 s against 397.508 s) or `worktree-integration` (181.029 s against 188.898 s). `target-publish` fell to 129.847 s, which is still above its 26.705 s threshold. Criterion 2 is waived, and FUP-edf3b0375b7c0eda carries the baseline re-measure. A fourth condition, `gate-task:worktree`, now holds at 221.874 s against 128.139 s, but it was already 212.641 and 220.258 s in WO-196's gates and WO-197 did not touch that suite. The plain-gate median is 294.876 s, below 360. |
| FUP-331423b3559f5cfa (WO-174 D021) | settled | As allocated: `harness-fixtures` ran 289.515 s in the order's fresh gate against the 326.779 s ceiling, down from 399.784 s. Planning's reopening condition is kept: it runs above 326.779 s fresh after WO-197 merges. |

The other matched rows are left as they are, because the change matched them only textually (`measurements.json`, `scripts/test-harness.mjs`, `README.md`, `docs/control/current.md`, `docs/planning/followups.json`) or their conditions name files this order did not edit. FUP-edf3b0375b7c0eda (D002) stays open for planning, and D014's FUP-da00a7d62cf18603 was settled by the repair. `npm run meta` still prints `REOPEN WO-150-D003` for `coldStartBytes.executor > 24576`, which this order does not touch.

## Verification sequence

1. **Activation:** 2026-10-07T17:41:13Z, checkpoint 1.
2. **Implementation** (Codex CLI 0.161.0, `gpt-6-astra`, max): `ImplementationReady` at 21:51:28Z with criteria 1 and 2 recorded unmet. D001 to D013. The operator corrected the first no-change conclusion during execution (D004). Two fresh workers (`gpt-6.1-sol`, max, as supplied) reviewed at `implementation-ready`: the adversary found nothing and the improver found one optional item, which was fixed.
3. **[VER-001](../../verifications/WO-197/VER-001.md)** (Claude Code 2.1.293, `claude-opus-5-5`, xhigh): fail at 22:19:25Z on criteria 1 and 2 (F1, F2), with criteria 3 to 6 met (D014).
4. **Waivers:** the operator waived criterion 1 at 23:33:14Z (ordinal 5) and criterion 2 at 23:34:18Z (ordinal 6), recorded from a verifier-role session.
5. **Repair** (Codex CLI 0.161.0, `gpt-6.1-sol`, max): 23:35:34Z to 23:48:07Z. D015. Records only, no source change and no workers.
6. **[VER-002](../../verifications/WO-197/VER-002.md)** (Claude Code 2.1.293, `claude-opus-5-5`, xhigh): pass at 2026-10-08T00:07:41Z, with criteria 1 and 2 unmet and waived.
7. **This review** (Claude Code 2.1.293, `claude-opus-5-5`, xhigh): dispatched 00:13:14Z, checkpoint 11. D016.

The first verification failed on criteria the executor had already recorded unmet. No repair could meet them from the retained record and the measured work, and D014, with the order's operator-review assumption 1, named the waiver route that the operator took.

## Executed checks

Every probe outside the gates was read-only or ran under `node scripts/harness.mjs bounded`.

- **State:** `resume status --json`, `harness writer --show`, usage at entry and handoff, `git fetch origin main` and the base comparison.
- **Hashes:** the two report hashes and the two waiver capture hashes against their control events. The full tree, compared through a temporary index, against checkpoints 11 and 12. `gateCodeIdentity`, bounded.
- **Integration:** `npm run backup:intake`, `worktree integrate`, `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local` and `npm run plan -- check`.
- **Review:** the full source diff against `main`, by file. A scan of added lines for new suppressions, `.only` and skipped tests, which found none. The removed assertion lines. The bound registries and inline bounds. The listing's row and case counts. The gate rows for the three suites and the `worktree` task in this worktree and on main, read with `readGateChecks`.
- **Register:** `plan conditions`, the touching listing through every cursor, `--show` for both allocated rows, and the `--apply` batch.
- **Gates:** `npm run format` (no file changed); `npm run test:docs` (29 of 29, 114.53 s); `npm test -- --review` once, after the last source state, composed (35 of 35, 7.41 s); then `npm run test:docs` on the final documents through `final-review-result`.
- **Clean room:** a search of this order's evidence, verification and final-review records for home paths, host temporary paths, e-mail addresses and URLs found no employer material, credential, internal address, temporary path or e-mail address. The URLs are public primary sources the decisions cite. VER-001 and D014 each name the operator's own checkout path once, a form 180 lines on `main` already use.

## Limits

- Historical case timing before 2026-10-05 does not exist in the retained record, so the cause of each suite's first growth stays unknown.
- The before and after task figures are one gate sample each, taken at recorded host loads. They are not a controlled estimate.
- This review did not rerun the suites alone or the vertical diagnostic. Those figures stand on rows and measurements at this identity, or, for vertical, at the earlier diagnostic identity, with the vertical files unchanged.
- Worker effective effort and dollar cost are unobserved.
