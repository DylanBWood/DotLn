# WO-164 FINAL-002 — final review

**Verdict:** pass. WO-164 asked that console collection issue a constant number of processes whatever the order and release counts, with byte-identical output, so the board and the document gate return to the few-second band and stay there. The subject does that. On this review's tree, with 114 orders and 105 annotated tags, `collectSources` took 2.14 and 2.17 s with the cache removed and 0.63 and 0.65 s warm, against 21.2 s before. The original `release list` and the new cold and warm listings printed the same 106 lines. `resume status --all --json` equalled the original per-order output string for string for all 114 orders. This review's `npm test -- --review` passed all 34 selected suites at the code identity VER-003 judged. FINAL-001's three findings are repaired and VER-003 judged the repair. This review changed no source. It paraphrased two operator messages the repair had recorded word for word, completed the integration record, and disposed every follow-up row the change touches ([D017](../../evidence/WO-164/decisions.md#wo-164-d017--final-review-passes-paraphrases-two-operator-messages-before-commit-and-disposes-the-rows)).

**Subject:** [`docs/work-orders/WO-164-constant-process-console-collection.md`](../../work-orders/WO-164-constant-process-console-collection.md) on branch `wo-164`, uncommitted over `main` at `371b7a08e1d9213e55e9c087785126abd3457057`. `git ls-remote origin refs/heads/main`, `origin/main` after a fetch, local `main`, the merge base and `HEAD` all name `371b7a08`, so no integration was due. The dispatch checkpoint is `refs/dotln/checkpoint/WO-164/16` (`c75b4745`).

- The recorded `reportHash` values of VER-001 (`sha256:0a7b5aaa…`), VER-002 (`sha256:d529fdc6…`), VER-003 (`sha256:3b85a956…`) and FINAL-001 (`sha256:cf5d124b…`) equal the reports' current SHA-256.
- The order's text differs from `main` only in its heading's `(v0.52.7)` label, written by release preparation; the six criteria are the original ones.
- VER-003 judged checkpoint 14 onward. From checkpoint 13 (`RepairCompleted`) to checkpoint 16, only control projections, VER-003, the register and two wording edits in D013 and D016 changed. From checkpoint 16 to the working tree at entry, only `docs/control/current.md`, `docs/control/orders/WO-164.jsonl` and `docs/work-orders/README.md` changed. No source byte changed after the repair's last gate.
- The gate code identity at entry, computed with `gateCodeIdentity`, is `310096b93b4d75d5f66aef87b0256f832c3918edd14676ebbc5932d3e8f42cf0`, the identity of the repair's passing review gate and of VER-003's judgment. The two new source files are staged.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.283","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version is from `claude --version`, and the model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value read by this session; it is the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the root cap of 20 with 0 observed at entry. FINAL-001's helper had already run the differential listing tests over synthetic histories, and the repair's changes since then are small enough to read whole. None was spawned.

**Process cost:** entry 81441 tokens; handoff 23167514 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 60dd8a0c-3722-471e-9353-6ef4673c5ca6`. The entry reading was observed at 2026-09-27T19:55:27.102Z. The handoff reading was observed at 20:17:51.883Z, after the gates, the record edits, the register batch, PR.md and the release notes, and before this report's final `test:docs` and the result transition. It counts 22,791,392 cached input, 280,450 cache-write, 240 uncached input and 95,432 output tokens over 138 steps and 113 commands. Both readings count reused cached input. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The harness counted no subagent, exact-observed, 20 of the cap of 20 remaining. The largest wait was this review's gate (637.99 s), during which the harness refused repository writes; I drafted this report, D017 and the publication text in the session scratch directory meanwhile. Against FINAL-001 (18.4 million tokens, one 176 thousand-token helper, a 636 s gate), this review used no helper and more steps, mostly for the register batch and the record corrections. Tradeoff: re-running the review gate cost about 11 minutes of wall-clock that the repair's row at the same identity would have avoided; it bought an observation at final review, which the order's evidence gate names, and it found nothing new.

## Goal-aligned judgment

The order sits on the critical path of every planning pass and final review: at activation the document gate ran 31.42 s, 22.50 s of it this collection, growing about a second a day. The question for this review was whether the speedup ships intact through a green binding gate, with the board's inputs unchanged, and whether the order's records are fit to commit.

- **Rule beating:** FINAL-001 failed because green default gates stood in for the review selection. This review ran `npm test -- --review` itself rather than resting on the repair's row at the same identity.
- **Seeking the wrong goal and drift to low performance:** criterion 2 was judged on the first, uncached collection against the unchanged three-second bound, as VER-001 required.
- **Policy resistance and fixes that fail:** the fold keeps the per-order objects, the listing keeps its refusals, and the fallback is labeled rather than silent (fixture and same-tree comparisons).
- **Tragedy of the commons:** the cache is one ignored 29 KB file per checkout. The two verbatim operator messages would have entered the shared public record against the operator's standing correction; they are paraphrased before commit.
- **Escalation:** no gate step, command family or role text is added. The role-text cause of the verbatim quotes goes to the existing row for the next planning pass.
- **Success to the successful:** the repair's passing gate and VER-003's pass were read as evidence, not as this review's result.
- **Shifting the burden to the intervenor:** the allocated rows are disposed here, where this order's records place the duty, not left to a close step that does not perform it.
- **Naive Interventionism** bounds this review's own edits: wording in three uncommitted paragraphs, the integration record and the register. No source file changed.
- **NoOp** would leave the 21-second collection on `main`, still growing, or commit the operator's messages word for word.

## Criteria

- **Criterion 1:** met. On this tree at 2026-09-27T20:00:52Z, the original `release list` (a `git archive HEAD` copy of `scripts` and `packages` run with `DOTLN_LAUNCHPAD`), the new cold listing and the new warm listing each printed SHA-256 `2481906d740370d873f36f4d0fb92163e2e7debbd83772688aa674b4c755e21d`, 106 lines, the hash the repair recorded after the merge. `status --all --json` equals the original per-order output for all 114 orders (criterion 4). `collectSources` returned that release hash and 114 statuses under `resume:status--json`, cold and warm, with no unavailable source. The collector changes only how those two sources are obtained, so the board follows from them (inference from `collect.ts`). The console fixture, in this review's gate, compares the board projected from the original per-order forms and an uncached listing with the batched and cached one. VER-002 rendered the board five ways at a frozen clock, the original collector included, with one hash. This review did not re-render the original board after the merge.
- **Criterion 2:** met. On this host (114 orders, 105 annotated tags, 1-minute load 4.0 to 6.1), fresh Node processes timed `collectSources` at 2,140 and 2,170 ms with the cache file removed and 631 and 651 ms warm. Before: 21,192 and 21,173 ms in the executor's record ([timing.md](../../evidence/WO-164/timing.md)). `console-docs` was 22.50 s before, 3.53 s cold and 1.57 s warm after the first repair ([repair.md](../../evidence/WO-164/repair.md)), and 1.43 s warm in this review's document gate. The cold margin is about 0.8 s and shrinks with history; D009 and D014 reopen at three seconds.
- **Criterion 3:** met. The console regression passed inside this review's gate. Its census holds four Node processes when orders and tags double, eight Git processes warm, and at most 12 Git processes more for four new tags on the one-commit-per-tag fixture. VER-002 showed it failing against the original sources (8 status processes where 4 are allowed) and the pre-repair listing (41 cold Git processes against a bound of 20). The repair showed it failing against the checkpoint-11 listing and collector. A new range of many commits costs one tree read per unique revision, as VER-001 and VER-002 recorded.
- **Criterion 4:** met. This review compared `status --all --json` with `main`'s `status --json --work-order` for all 114 orders, with and without session variables: string-equal, ids sorted, in 217 and 231 ms against 14,698 and 14,781 ms of forks. The control segments, `resume.jsonl` and `current.md` hashed the same before and after. The control-segments fixture, which compares three orders including a release edge with and without a session and refuses three argument forms, passed inside this review's gate.
- **Criterion 5:** met. D001 to D017, [timing.md](../../evidence/WO-164/timing.md), [repair.md](../../evidence/WO-164/repair.md) and [repair-final-001.md](../../evidence/WO-164/repair-final-001.md) record the figures, hashes and reopening conditions. Product 07's cold-gate candidate carries the after figure: 2.43 to 2.47 s cold and 0.67 s warm at 113 orders, the repair's measurement before the merge. This review retargeted `FUP-7f9a27e6ed6c44b3` to the order's reopening conditions (Rows).
- **Criterion 6:** met. This review's `npm test -- --review` on the staged subject passed: 34 passed, 0 failed, 637.99 s, 78 fresh tasks, exit 0, recorded 2026-09-27T20:12:44.597Z at code identity `310096b93b4d75d5f66aef87b0256f832c3918edd14676ebbc5932d3e8f42cf0`, tree `9f7c7962`. It includes `configuration-root` (4.11 s), which FINAL-001's gate failed, `console` (25.16 s), `resume` (35.62 s) and `harness-fixtures` (246.00 s). `npm run test:docs` passed 23 suites, 0 failed, in 12.40 s after the record edits and D017 (20:15:08Z), and again after this report was written (Checks). `git diff --check` is clean. The package manifest and lockfile change only `@dotln/console` from 0.3.0 to 0.3.1, so no dependency is added, and no added line introduces a lint, type or format suppression.

## Ideation receipt

The ideation receipt is planning receipt 028 ([receipt](../../planning/refutations/2026-09-25-planning-cb4e4076b7ec0078-028.md)), which judged WO-164 `aligned-with-findings` with three known issues. FINAL-001 found none disposed (D011). [D014](../../evidence/WO-164/decisions.md#wo-164-d014--receipt-028s-three-known-issues-two-implemented-one-stated-from-dated-measurements) now disposes all three, and this review checked each against the subject.

1. **No runtime fallback (criterion 4):** implemented. `collect.ts` falls back to one `status --json --work-order` per order when the fold fails or returns different ids, under the ref `resume:status--json#per-order-fallback`, and reports the fold's failure if the fallback fails too. The console fixture injects a fold failure and checks the ref, the per-order objects and the board's source row. Every collection in this review used the fold. Reopening observation not met.
2. **Storage and `harness prune` (criterion 3):** the cache sits in the ignored local lane and is read or written only while Git reports it ignored, so it is never a gate input (`gateInputPath`). `harness prune` lists it as a retained `release-list-cache` row and never removes it; the prune fixture passed in this review's gate. No guard refusal named the cache during this review's gates. Reopening observation not met.
3. **Growth rate (criterion 2):** stated from dated measurements: 1.05 to 1.41 s a day from REVIEW-003's 18.4 to 19.1 s on 2026-09-25 to 21.2 s on 2026-09-27, matching about six orders and six tags a day. The receipt's reopening observation, two dated measurements on the unmodified source, is what D014 cites.

## Findings

No finding fails a criterion. One record defect was corrected in place, and observations are recorded.

- **Corrected: two operator messages recorded word for word** ([D017](../../evidence/WO-164/decisions.md#wo-164-d017--final-review-passes-paraphrases-two-operator-messages-before-commit-and-disposes-the-rows)). The FINAL-001 repair quoted the operator's two `scope expand:` messages in D014's and D016's decision text and in repair-final-001.md, and the generated index copied D014's and D016's text. The operator's 2026-09-24 correction ([WO-153-D008](../../evidence/WO-153/decisions.md#wo-153-d008)) asks for the control prefix and a paraphrase. None of it was committed. This review paraphrased the three passages with the same meaning and regenerated the index; no claim, figure or reopening condition changed, and checkpoint 16 keeps the original bytes. The cause is role text, which is outside this order, so D017 records a reopening observation on WO-085-D004, whose row carries the sweep and the rule.
- **Observation: the closing subject meets the cold-gate row's reopening condition.** `FUP-b8a329d9970b8206`, the cold-gate candidate's row, reopens when 'the document gate's critical path exceeds ten seconds after WO-164 closes'. In this review's document gate the scheduled chain was `build` 0.55 s, `docs-check` 8.27 s, `console-docs` 1.43 s and `plan` 2.11 s, 12.40 s in all, because each second-stage task waits for every first-stage task. `console-docs` was 22.50 s of that chain at activation; `docs-check`, which this order's non-goals leave alone, now leads it. The row is set open for the next planning pass (Rows).
- **Observation: the fixture pins an engine message.** The console fixture asserts the empty-range manifest failure by the V8 text `flatMap is not a function`. A Node release that rewords it would fail the fixture without a behavior change. D013's follow-up, which removes that failure, removes the assertion with it.

## Rows

`npm run plan -- followups --touching`, run after D017 was synced, returned 16 rows at register revision `0f7859bf075d0866c1d6459ba4a1cd038f8122a756c086a9d78bc7dc3d7d3014` (36 paths and WO-164, 150 pending). The two rows allocated to WO-164 and not in the pending feed were added to the same batch. One `followups --apply` batch disposed 18 rows, and the register moved to `51d835a750a137b6e6765ebd07125078fc292a7d4b6bf32d49f907ff9f53e5de`. Each reason cites this report.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-71fc2efc208f597a | decisions, index | open, for the next document-maintenance pass | Its condition occurred: the repair quoted two operator messages (D017's reopening observation). |
| FUP-b8a329d9970b8206 | WO-164 (allocated, revised) | open, for the next planning pass | The closing subject's document-gate chain is 12.40 s, led by `docs-check`. |
| FUP-50cda1c03ecd8ea8 | harness-prune.mjs | deferred, condition narrowed to an edit of `usageRetention` | Its 'next order that edits harness-prune.mjs' occurred; the work waits on WO-170's digest field. |
| FUP-4475529d727a4d25 | paths.mjs | deferred, same condition | False match; the two corpus scripts are untouched. |
| FUP-51c310284c2fea17 | resume.mjs | deferred, same condition | Status form only; no observed-facts, fixture-root or dispatch-release change. |
| FUP-56b599e15f97e666 | product 07 | deferred, same condition | resident-state.ts untouched. |
| FUP-8cfd3ff52146a016 | release.mjs, test-harness.mjs | deferred, same condition | `release list` and one prune fixture; release close untouched. |
| FUP-acfe4bfda716d8fb | current.md | deferred, same condition | Generated projection; no usage or meta attribution change. |
| FUP-e55e258d37cb3f20 | product 03 | deferred, same condition | Local-lane paragraph only. |
| FUP-e62c63344f52405f | harness-prune.mjs | deferred, same condition | stash-drop.mjs untouched; no stopped apply observed. |
| FUP-f1c7a256bec46737 | product 07 | deferred, same condition | Every role within its ceiling; reviewer 24,171 of 24,576 bytes. |
| FUP-fd05316b6030ef73 | README, products 03 and 07, index | deferred, same condition | Writer text untouched. |
| FUP-e9bd0effe2b00f0e (D010) | release-list-cache.mjs, WO-164 | settled | `TOOL_ROOT` derivation; `configuration-root` passed in this gate. |
| FUP-6a9eb3c24f1ab9ea (D011) | WO-164 | settled | D014 disposes receipt 028; its regressions passed in this gate. |
| FUP-934cf5f4268029c8 (D012) | release.mjs, WO-164 | settled | Lazy manifest attribution; the fixture rows passed in this gate. |
| FUP-e2cf2122a642d1e0 (D013) | release-list-cache.mjs, WO-164 | deferred | Pre-existing empty-range failure; destination of `adjacent-0001`. |
| FUP-7f9a27e6ed6c44b3 (allocated) | not in the feed | deferred, retargeted | Criterion 5: the console half is answered; the work-order index half and the order's thresholds are carried. |
| FUP-d68bd29cf96864f1 (D007, allocated) | not in the feed | settled | The first collection measured 2.14 to 2.72 s in every measurement since the repair. |

## Integration record

[D015](../../evidence/WO-164/decisions.md#wo-164-d015), the draft the FINAL-001 repair's `worktree integrate` wrote, is completed. The branch fast-forwarded from `894be584` to `371b7a08` (WO-171, v0.52.6) with checkpoint 12 and named stash `4692cd22` retained. The three authored resolutions were checked: `scripts/lib/harness-prune.mjs` differs from `main` only by the added `judgeListingCache` judge and its one `record` call, so WO-171's single plan and pre-delete recheck are untouched; the roadmap keeps both activation notes; and the register keeps all 680 of `main`'s rows in `main`'s order, each with `main`'s revisions and dispositions as a prefix, and adds the five WO-164 rows. The retiming from v0.52.6 to v0.52.7 matches the published `v0.52.6` tag, and `@dotln/console` 0.3.1 stays valid because WO-171 changed no package source. No resolution changed a WO-164 criterion, behavior, contract or authority, and VER-003 judged the merged subject.

## Reviewer errors in this session

- One early command joined reads with `echo ====WT`. zsh expanded the `=` word and printed `===WT not found`, so the command exited 1 after its first read; FINAL-001 recorded the same expansion. The reads it needed had already printed.
- During the live gate the hook refused eight commands, none in an admitted form: three that wrote a `git show` copy to the session scratch directory (one through a shell variable, one prefixed with `cd`), three with unquoted globs, one ending in `cut`, and one chaining `git tag`. I reran each as an admitted read or after the gate; the register comparison waited for the gate.
- My first `followups --touching` summary printed 8 of the 16 rows because I did not follow the cursor; I read the second page before judging any row.
- One `echo "plan-check exit $?"` after a pipe reported `tail`'s status, not the plan check's; I reran `npm run plan -- check` alone (exit 0).
- The first `npm run test:docs` with the release notes written failed: 14 passed, 9 failed, 11.73 s. The notes profile in `release-surfaces` read `refs/tags/<name>` inside a code span as raw HTML, and eight dependent tasks failed on that preflight. I reworded the phrase in the notes and the PR body.

## Verification sequence

1. **Implementation** (executor, Claude Code 2.1.283, `claude-opus-5-5`, xhigh, `claude-session-readback`): `ImplementationReady` at 2026-09-27T17:25:22Z, checkpoint 2. D001 to D006; a five-agent read-only review before handoff.
2. **[VER-001](../../verifications/WO-164/VER-001.md)** (Codex CLI 0.157.1, `gpt-6-sol`, ultra recorded as xhigh with subagents): fail at 17:41:36Z on criterion 2; the first collection took 5.8 to 6.3 s. D007.
3. **Repair** (Codex CLI 0.157.1, `gpt-6-astra`, xhigh): 17:43:05Z to 18:02:02Z, checkpoints 5 and 6. D008 and D009 batch the cold derivation and correct D006's warm-only reading.
4. **[VER-002](../../verifications/WO-164/VER-002.md)** (Claude Code 2.1.283, `claude-opus-5-5`, xhigh): pass on all six criteria at 18:22:37Z, checkpoint 8.
5. **[FINAL-001](FINAL-001.md)** (Claude Code 2.1.283, `claude-opus-5-5`, xhigh): fail at 18:49:15Z, checkpoint 10. Criterion 6 failed on `configuration-root` (D010); receipt 028's dispositions (D011) and an eager manifest read (D012) were routed with it.
6. **Repair of FINAL-001** (Claude Code 2.1.283, `claude-opus-5-5`, xhigh): 18:50:02Z to 19:48:33Z, checkpoints 11 to 13. D013 fixes F1 and F3, D014 disposes receipt 028 under the operator's scope expansion, and D016 records the merge of `main` the operator asked for (integration draft D015). The final review-selection gate passed at code identity `310096b9…`.
7. **[VER-003](../../verifications/WO-164/VER-003.md)** (Codex CLI 0.157.1, `gpt-6-sol`, xhigh): pass on all six criteria at 19:54:41Z, checkpoint 15.
8. **FINAL-002** (this report): dispatched at 19:55:19Z, checkpoint 16.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, `origin/main` after a fetch, local `main`, merge base, `HEAD` | all `371b7a08`; no integration |
| Report hashes | VER-001 `0a7b5aaa…`, VER-002 `d529fdc6…`, VER-003 `3b85a956…` and FINAL-001 `cf5d124b…` equal their recorded `reportHash` |
| Working tree against checkpoint 16 | three control projections only; code identity `310096b9…` |
| `npm test -- --review` | 34 passed, 0 failed, 637.99 s, 78 fresh tasks, exit 0; recorded 2026-09-27T20:12:44.597Z; code identity `310096b9…`, tree `9f7c7962` |
| `release list` on this tree | original 5,812 ms, new cold 1,630 ms, new warm 114 ms; all `2481906d…`, 106 lines; regenerated cache equals the bytes found at entry |
| `collectSources`, fresh processes | cold 2,140; 2,170 ms; warm 631; 651 ms; 114 statuses under `resume:status--json`; no unavailable source |
| `status --all --json` against `main`'s per-order form, 114 orders | string-equal with the session (231 ms against 14,698 ms) and without (217 ms against 14,781 ms); ids sorted; control bytes unchanged |
| Register merge against `main` | 680 of 680 rows kept in order with `main`'s history as a prefix; 5 added, 2 extended |
| `git diff HEAD --stat` of `harness-prune.mjs` and the roadmap | additions only (30 and 11 lines) |
| `node scripts/harness-context.mjs --check` | every role within its ceiling; reviewer 24,171 of 24,576 |
| `npm run meta` | index refreshed; no verbatim operator message remains in WO-164's records or the index |
| `npm run plan -- followups --touching`, then `--apply` of an 18-request array | 16 rows at `0f7859bf…`; all 18 applied; register `51d835a7…` |
| `requirePlanningHandoffs` for WO-164 | `adjacent-0001` resolves to the live row `FUP-e2cf2122a642d1e0` |
| `npm run plan -- check`, `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local` | exit 0; both editions current; exit 0; 51 PASS |
| `git diff --check`, `git diff --cached --check`; manifests; added suppressions | clean; only `@dotln/console` 0.3.0 to 0.3.1; none |
| Harness journals naming `release-list.json` | none |
| `npm run test:docs` | 23 passed, 0 failed, 12.40 s at 20:15:08Z (`docs-check` 8.27 s, `console-docs` 1.43 s); with this report, PR.md and the release notes written, 23 passed, 0 failed, 12.41 s after the one failure under Reviewer errors; rerun after this row was filled in |

## Evidence gate, write-back, non-goals and assumptions

- **Evidence gate:** the regression transcript and the timing record are in [timing.md](../../evidence/WO-164/timing.md), [repair.md](../../evidence/WO-164/repair.md) and [repair-final-001.md](../../evidence/WO-164/repair-final-001.md). `npm test` at final review ran and passed (criterion 6). No live row, as the order states.
- **Write-back:** decisions D001 to D017, product 07's cold-gate candidate, and the register row `FUP-7f9a27e6ed6c44b3`, retargeted by this review.
- **Non-goals held:** the work-order index's per-tag reads, the board's rendering, the document gate's task selection and the runtime status projection are untouched. The work-order index's reopening condition, above ten seconds, is carried on the retargeted row.
- **Operator-review assumption:** a patch with no live row fits a performance change whose correctness criterion is byte identity. This review found no reason to change that.

## Handoff

This review records `final-review-result pass`, refreshes the index and commits the reviewed state in coherent commits with plain subjects. It then runs `npm run worktree -- publish WO-164` with the reviewed title, `:zap: Collect the console board in about two seconds instead of twenty, with a constant number of processes`, and the committed `docs/final-reviews/WO-164/PR.md`. That pushes the `wo-164` branch and opens its pull request. The operator's phrase authorizes nothing further: the merge, `main`, the `v0.52.7` tag and its Release stay with the operator and release close, which runs in the `main` checkout after the merge.
