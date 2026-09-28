# WO-167 FINAL-001 — final review

**Verdict:** pass. WO-167 asked that product 07's dated amendment paragraphs be folded into the sentences they amend with citations, its nine candidates moved to the planning map, every cited heading kept resolvable with a check that can fail, and its ceiling lowered to the result. The subject folds all 33 standalone dated paragraphs and the eleven dated Discipline leads, moves the nine candidates under their slugs with register duplicates, lowers the ceiling from 188,399 to 157,212 bytes over a guide of 154,129, and, after [VER-001](../../verifications/WO-167/VER-001.md) failed criterion 2, makes `harness-context --check` refuse an unresolved installed read. [VER-002](../../verifications/WO-167/VER-002.md) passed all six criteria on the integrated subject. This review read the full subject diff against the original order, completed the integration record [D012](../../evidence/WO-167/decisions.md#wo-167-d012), disposed twelve register rows and ran the review gate once. It changed no source and no product document.

**Subject:** [`docs/work-orders/WO-167-execution-guide-folded.md`](../../work-orders/WO-167-execution-guide-folded.md) on branch `wo-167` at `49de2a30` plus the working tree, over activation base `ddb58d26`. `49de2a30` merges `main` at `0f3498a6` (WO-060, `v0.53.0`) into the branch's four operator-authorized commits (`76979cc2`, `2f508b69`, `b1745981`, `8541e0d4`; D008, D009); `git ls-remote origin refs/heads/main`, local `main` and the merge base all name `0f3498a6`, so the subject already contains current `main` and no further integration was needed at review. The dispatch checkpoint is `refs/dotln/checkpoint/WO-167/10` (`bcd7f31a`).

- The recorded `reportHash` of VER-001 (`sha256:812b5f07…`) and VER-002 (`sha256:8e4022d1…`) each equal the report's current SHA-256.
- The order's text differs from `main` only in its heading's release label, `(v0.53.1)`. The six criteria are the original ones.
- Product 07, the planning map, the doc ceilings and baseline, the audience-status index and product 05 are byte-identical between `ddb58d26` and `0f3498a6`, so the landing count D007 recorded is the count on the integrated tree.
- What this review wrote is documents and local state only: D012's completion, the register dispositions and their request file, the refreshed indexes, meter snapshot and PR meter block, this report, the PR body and the release notes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.284","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no other choice about the verdict. The harness version is what `claude --version` reports in this session (2.1.284). The model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value read by this session: the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the cap of 20 with 0 observed at entry (exact-observed). Two independent verifiers had already read every fold row against the base; this review's own reading was the whole diff and the source changes, which one reader can hold.

**Process cost:** entry 84941 tokens; handoff 18349360 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 2b146276-9733-4048-ae5e-65c210158672`. The entry reading was observed at 2026-09-28T18:44:43.907Z, before the order was read. The handoff reading was observed at 2026-09-28T19:05:19.081Z, after D012, the register dispositions, the PR body, the release notes and this report's judgment text were written and before `test:docs` and the result transition; it counts 18,040,443 tokens of reused cached input, 114 steps and 94 commands. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The harness counted 0 subagents, exact-observed, 20 of the cap of 20 remaining. The largest wait was the review gate, 636.58 s, during which repository writes are refused; this report and the PR and release texts were drafted in session scratch beside it and every repository write followed it.

## Goal-aligned judgment

The fold is not on the critical-path table, but it is the prerequisite of every queued order that writes product 07: at `5f3849ec` the guide had 9 bytes of headroom, and receipt 034 names eleven queued writers, including WO-123 (gate V's head), WO-113 (gate B) and WO-080 (gate P). The questions for this review were whether a rule changed meaning on the way into a citation, whether the proof criterion 2 names can now fail, and whether the code the repair added stays inside what the recorded authority admits.

- **Rule beating** was VER-001's finding: a green `--check` stood for a resolution it never ran. It is closed. `unresolvedInstalledReads` uses the same `readDirectives` and `sectionRange` as the harness library, over both skill roots and all six roles, and the regression fails on the unrepaired script. The fold itself is judged by meaning, not bytes: the fold table and both verifiers' tables give every paragraph's carrying sentence.
- **Policy resistance:** the emptied docs-check baseline and the lowered ceiling pull the same way as the fold; the only guard that got stricter, `--check`, refuses only an unresolved read, while budget advisories stay advisory as WO-155 decided.
- **Drift to low performance:** the ceiling at landing plus two per cent is the rule every other product document follows. Receipt 034's second known issue stands: 3,083 bytes of headroom against about 4,000 declared by the queued writers is a planning decision, and the evidence README records it.
- **Tragedy of the commons:** every cold-start reader pays less. Measured by the executor with `sectionRange`: §Goal-aligned decisions, read by five roles, falls from 5,952 to 5,854 bytes; the planner's three sections from 33,940 to 32,660; a whole-guide read from 188,390 to 154,129. The map grows by the moved text, outside any role's directed reads. This answers receipt 034's first known issue.
- **Escalation and shifting the burden:** the two integration fixes remove refusals the next integrating order would have met; each admits only what the design already names bookkeeping and keeps every other refusal (below).
- **Success to the successful and seeking the wrong goal:** bytes are the proxy and no rule was cut to reach them; the one sentence whose meaning changes is `--check`'s description, rewritten to match the repaired command in the same 104 bytes.
- **Naive Interventionism:** the refusal `--check` adds can block a heading rename, which is its purpose; the fix is to change the skill's anchor in the same change. The release-retiming admission cannot hide a body edit, which the regression shows.
- **NoOp** keeps the standstill for eleven writers and the reconciliation cost at every cold start.

## Source changes

The order is documentation only; the subject nonetheless changes three scripts, each under a recorded route, and I read each against its tests.

- **`scripts/harness-context.mjs`** (D011, VER-001 F1's first route). `--check` adds `unresolvedInstalledReads(root)`: for each of `.claude/skills` and `.agents/skills` and each of the six `dispatchKinds`, it reads `CLAUDE.md` and the role's skill, expands `@skills/` to that root, skips task selectors (`@work-order` and the rest), refuses an absolute or `..` path, and resolves each file and anchor with `sectionRange`. A skill file that does not exist is skipped as a measurement unknown, but a floor `Read[role]:` of it is a failure; `scripts/lib/harness.mjs` always emits both roots, so an installed launchpad has both. Standard output is unchanged; the exit code alone carries the refusal.
- **`scripts/lib/plan-continuation.mjs`** (D013). `releaseAssignment` now also accepts a title whose judged form ends in a space and a strict `(vX.Y.Z)` label, when the new title has the same stem and one strict label; it reports `release-retiming` with `from`. The regression refuses a dropped label, a missing space, a leading-zero version, a second label, a renamed stem and a body edit beside a valid retime. Product 07 §Independent workflows already names a version collision retime as bookkeeping; before this, `plan amend-order` normalized labels away and no route existed (D013 evidence).
- **`scripts/lib/worktree-integration.mjs`** (D013). On `--continue` only, the phase and order path fall back to the receipt's recorded values when the control log is absent (it travels in the integration's own stash); the receipt now records `workOrderPath`, and the README release-block projection uses it when the log is unavailable. A first invocation still requires a readable phase. Older receipts without `workOrderPath` behave as before.

None of the three adds a dependency, a lint or type suppression, or a new command, flag or event.

## Criteria

**Criterion 1:** met

Product 07 has zero `## Candidate` headings and zero bold spans holding a date anywhere (my `grep` counts on the current file). The [fold table](../../evidence/WO-167/fold-table.md) has 33 rows, one per standalone dated paragraph at the base, each with its carrying sentence and a citation that keeps the paragraph's date; VER-001 and VER-002 each carry their own row for all 33 with a rule-unchanged judgment, and both read the eleven Discipline leads and the dated span at base line 2315 separately. I read the whole word diff of product 07 against `main`: every hunk is a dated lead turned into a citation, a history paragraph reduced to a citation line, the platform-first sentence kept for the refuter (D004), or the `--check` sentence (D011). I compared the removed candidate block with the map's nine sections: the differences are the status-word leads with citations, the rebased links and the explicit product 07 references D004 lists.

**Criterion 2:** met

`node scripts/harness-context.mjs --check` exits 0 on the subject and, in the regression that ran in this review's gate, exits 1 naming `Unresolved required section` for a renamed cited heading and `Unresolved required file` for a missing floor-read skill. `node scripts/docs-check.mjs` reports 0 failures and `npm run publication:check` reports 267/267 product headings indexed with both editions current. The audience-status index has no candidate row. The executor's list of product 07 headings cited by the 52 open orders is identical before and after with none moved; VER-002 independently resolved 42 citations from 51 open orders. The two work orders whose text still names a product 07 candidate, WO-137 and WO-164, are closed records, and historical decision records keep their original links.

**Criterion 3:** met

[`register-duplicates.json`](../../evidence/WO-167/register-duplicates.json) holds the nine `--apply` requests; VER-002 parsed each against the register and found the base history an exact prefix and the final disposition `duplicate` to a present map row. Pending counts are recorded in the evidence README (149 at base; 163, 154 and 155 through the steps). The integrated register holds 719 rows: all 709 of `main` and all 717 of the branch, none missing and none whose revisions or dispositions diverge from either side (my row comparison).

**Criterion 4:** met

Product 07 is 188,390 bytes and 2,617 lines at the base and 154,129 and 2,068 now (`wc`); `docs/control/doc-ceilings.json` gives 157,212 = ceil(154,129 × 1.02) with D007 as its decision. The staged index still holds the intermediate 154,312 / 157,399 / D011 entry from the repair's first wording; the working tree holds the final entry and the commit takes the working tree. The map is 381,012 bytes and 2,282 lines before and 412,672 and 2,780 after (evidence README, VER-002). Both publication locks are current.

**Criterion 5:** met

The ledger duty is discharged by the decisions file and its index rows, as the work-order index directs for an order filed before 2026-09-09. `docs/README.md` points at the whole guide and at surviving sections only. Product 05's one inbound link now targets the map.

**Criterion 6:** met

`npm test -- --review` passed: 35 passed, 0 failed, 636.58 s, 79 fresh tasks, exit 0, at code identity `5c516154…`, including the `harness-context`, `process-debt`, `plan-refutation` and `worktree-integration` suites that hold the three regressions (Checks). `npm run test:docs` passed after this report, the PR body and the release notes were written (Checks). `git diff --check` and `git diff --cached --check` are clean. No manifest or lockfile differs from `main`, so no dependency is added.

## Integration

The operator directed the merge during the repair (D013); `npm run worktree -- integrate WO-167` merged `0f3498a6` into `8541e0d4` as `49de2a30`, with checkpoint `refs/dotln/checkpoint/WO-167/6` and named stash `a177676d` retained. I completed [D012](../../evidence/WO-167/decisions.md#wo-167-d012). The authored resolutions are README's release line (retimed to `v0.53.1` over the `v0.53.0` tag) and product 06's two activation paragraphs plus WO-167's retiming paragraph; the register union is whole (criterion 3). Main's WO-060 change touches none of this order's surfaces. VER-002 judged the merged bytes, so no criterion judgment is carried across bases, and this review's gate ran on the integrated tree.

## Rows

`npm run plan -- followups --touching` returned ten rows at register revision `4abfb55d…`. D005 and D006 left two further rows to this review: the allocation of `FUP-40f361277410f64f` and product 05's Tinkerer / Scientist row. One batch through `followups --apply` disposed all twelve (register `e52a94b4…`, pending 157 to 155); each reason cites this report. The nine new map rows stay untriaged for the next planning pass, as D005 designed.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-dde0b0bf89f86cfc (D006) | harness-context.mjs, WO-167 | settled | D011 discharged it; the regression passed in this review's gate. |
| FUP-40f361277410f64f | allocated to WO-167 | settled | Its premise, a strict `--check` that fails on a moved heading, now holds. |
| FUP-fc4158d3207e495d | product 05 | settled at revision 12 | The revision is the inbound link retarget; no claim changes. |
| FUP-50a41e39f51a3e01 (WO-090-D006) | plan-continuation.mjs | open for planning | Its reopening observation occurred: WO-167 is the second execution order to need local commits and a refutation to edit the goal standard (D008). |
| FUP-00af89947ed9099f | plan-continuation.mjs | deferred, same condition | The dependency-migration path is untouched. |
| FUP-406744f5e9966250 (WO-169-D006) | worktree-integration.mjs | deferred, same condition | WO-167's integration met neither defect; D013 edits neither the stub nor the stash-apply stage. |
| FUP-50cda1c03ecd8ea8 | meta.json | deferred, same condition | The prune byte-proof writer is untouched. |
| FUP-56b599e15f97e666 | product 07 | deferred, same condition | `resident-state.ts` is unchanged. |
| FUP-acfe4bfda716d8fb | current.md | deferred, same condition | Generated projection only. |
| FUP-f1c7a256bec46737 (WO-054-D006) | product 07, harness-context.mjs | deferred, same condition | `--check`'s measurement is unchanged; every role profile is at delta 0 and the smallest headroom is the reviewer's 405 bytes, above 256. |
| FUP-fd05316b6030ef73 (WO-168-D009) | README.md, evidence README, product 07, index | deferred, same condition | The named product 07 sentence is unchanged by the fold. |
| FUP-7308cb30f71fb745 | WO-167 | deferred, same condition | Its condition, WO-167's close, falls at release close, not here. |

The worktree's adjacent queue: no items (`node scripts/adjacent-work.mjs list`).

## Findings

No finding is routed to repair, and no criterion fails.

- **The order's release classification says "Documentation only", and the subject changes three scripts.** Each change has a recorded route (VER-001's repair route; the operator's merge direction) and fresh verification in VER-002. Patch remains the right classification: each is a fix. The PR body and release notes state the code changes.
- **The integration fix changes what the planning gate admits.** A retime of a judged release label no longer needs a refutation. This is a narrow authority change, named in the release notes' Read-before-upgrading section; its reopening condition is in D013.
- **The staged index and the working tree differ in `doc-ceilings.json`.** The index holds the repair's first-wording entry; the reviewed working tree holds the final one, and the commits take the working tree.
- **The meter reports one standing budget breach**, `current/sequenceBytes`, on a file this order does not touch; it predates the order.

## Verification sequence

1. **Implementation** (executor, Claude Code 2.1.283, `claude-opus-5-5`, effort max, `claude-session-readback`): activated at 2026-09-28T15:40:41Z; `ImplementationReady` at 17:24:08Z, checkpoint 2. D001 to D010. Four operator-authorized local commits and planning receipt 034 (D008, D009).
2. **[VER-001](../../verifications/WO-167/VER-001.md)** (Codex CLI 0.158.0, `gpt-6-sol`, effort max, `codex-session-readback`): requested at 17:33:42Z; fail at 17:49:01Z, checkpoint 4. Criteria 1 and 3 to 6 met; criterion 2 unmet on F1, the heading check that could not fail.
3. **Repair** (executor, Claude Code 2.1.283, `claude-opus-5-5`, effort xhigh, `claude-session-readback`): requested at 17:50:18Z; completed at 18:23:53Z, checkpoint 7. D011 repairs F1; the operator directed the merge with main, and D012 and D013 record it and the two defects it met.
4. **[VER-002](../../verifications/WO-167/VER-002.md)** (Codex CLI 0.158.0, `gpt-6-sol`, effort max, `codex-session-readback`): requested at 18:27:24Z; pass at 18:43:25Z, checkpoint 9. All six criteria met on the integrated subject; F1 resolved.
5. **FINAL-001** (this report): dispatched at 18:44:35Z, checkpoint 10. No finding routed to repair.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, local `main`, merge base | all `0f3498a6`; integration done in the repair and completed in D012 |
| Tags | local and `origin` end at `v0.53.0`, on `0f3498a6`; `v0.53.1` is free on both |
| `npm test -- --review` | 35 passed, 0 failed, 636.58 s, 79 fresh tasks, exit 0; recorded 2026-09-28T19:02:01.738Z; code identity `5c516154…`, tree `e30991e8`; row `host-gate:5c5161546bb104cecae87d3261f6130bc41b2651f16bc564ccaf07202d300e53:npm test` |
| SHA-256 of VER-001 and VER-002 | each equals its recorded `reportHash` |
| Product 07 | 188,390 to 154,129 bytes and 2,617 to 2,068 lines (`wc`); ceiling 157,212; 0 `## Candidate` headings and 0 bold spans holding a date (`grep`) |
| `node scripts/harness-context.mjs --check` | exit 0; every role profile at delta 0; smallest headroom 405 bytes (reviewer) |
| `node scripts/docs-check.mjs` | 15 product documents, 412 declared historical link occurrences, 0 failures |
| `npm run publication:check` | 267/267 product headings indexed; 30 and 45 linked source sections match; bootstrap checks pass |
| `npm run harness -- check` | 31 generated surfaces; local-terms list unavailable |
| `node scripts/refute-plan.mjs check` | exit 0; WO-167 reported as `release-retiming` from `v0.52.11` to `v0.53.1` |
| `npm run release -- check-surfaces --local` | exit 0 |
| `npm run release -- prepare --local` | `v0.53.1` remains current; meter snapshot (3,790 bytes) and PR meter block refreshed |
| `npm run meta` | decisions index refreshed; one standing breach, `current/sequenceBytes` 13,965 against 8,192, outside this order |
| `npm run plan -- followups --touching`, then `--apply` of a 12-request batch | 10 rows at `4abfb55d…` and the 2 rows D005 and D006 left; all applied; register `e52a94b4…` |
| `node scripts/adjacent-work.mjs list` | no items |
| Manifests, lockfile, suppressions | no diff against `main` under `package.json`, `package-lock.json` or `packages/`; no added lint, type or format suppression under `scripts/` |
| `git diff --check`, `git diff --cached --check` | clean |
| `npm run test:docs` | 23 passed, 0 failed, 12.71 s, 23 fresh tasks, exit 0, after this report, the PR body and the release notes were written; a second run on the final bytes of this report also passed 23 of 23 |
