# WO-176 — FINAL-001

**Verdict:** fail. Criteria 1 and 3 are unmet. The close can delete an undeclared nested repository with content, which the order rules out as "never". At completion, `implementation-ready` records every nested repository's lane classification. At close, the helper replays those rows as explicit declarations, and an explicit row replaces the repository's current classification. A repository that was empty at completion is recorded disposable by the empty-scaffolding rule. If it gains a commit before the close, it is still treated as disposable and is removed with its commit. On the base, the same repository blocks the close. I reproduced this twice: with the modules `worktree finish` calls, and end to end through `release close --publish` in a scratch copy of the release fixture. A reviewer does not write and certify a behavioral fix, so the finding returns to repair ([D022](../../evidence/WO-176/decisions.md#wo-176-d022--final-review-finding-a-frozen-completion-row-deletes-an-undeclared-repository-that-gained-content)). Two more items are routed to the same repair. The catalog row's Receipt 036 duty, to bundle a repository before removing it, has no implementation or record ([D024](../../evidence/WO-176/decisions.md#wo-176-d024--final-review-finding-receipt-036s-catalog-duty-has-no-implementation-or-recorded-check)). Ten minor defects are recorded for the repair or a follow-up ([D023](../../evidence/WO-176/decisions.md#wo-176-d023--final-review-minor-defects-recorded-for-the-repair-or-a-follow-up)). The integration with `main` is complete and stays in the worktree for the repair ([D021](../../evidence/WO-176/decisions.md#wo-176-d021)).

**Subject:** [`docs/work-orders/WO-176-release-close-finishes-on-the-handoff.md`](../../work-orders/WO-176-release-close-finishes-on-the-handoff.md) on branch `wo-176`, uncommitted. The original base is `276db3e18406fc3c7a4aea7dabb4b9a0837255b0`. The integrated base is fetched `main` at `ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0` (WO-180, v0.60.0). The dispatch checkpoint is `refs/dotln/checkpoint/WO-176/5`, and the integration checkpoint is `/6`.
- The verification sequence is complete: [VER-001](../../verifications/WO-176/VER-001.md) passed, and no repair followed. Its bytes hash to the control log's `reportHash` (`69c44c47…`).
- Between VER-001's subject checkpoint `/3` and `/5`, only documents changed: VER-001, D019–D020, the control log and its projections, the decisions index and the register. No source file changed.
- The order's text differs from `main` only in its heading's version label. I judged the original six criteria.
- No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope expansion or amendment.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 85621 tokens; handoff 16277518 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-176 and allocated this path. The operator made no choice about the verdict. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Fan-out plan, stated before the first spawn: two read-only subagents out of the 20 available. One judged the worktree and completion side, the other the release-close side. Both read a frozen snapshot of the subject in this session's scratch, so the integration could not move what they judged. The harness observed 2 admissions with 18 remaining and no descendants. Their completion notices report 168,900 and 171,188 tokens of their own, over 1,010 s and 1,223 s. The counter does not say whether its totals include them, so they are named here and not added. I reproduced D022 myself before relying on it, and I checked each D023 item against the source before recording it.

Cost scope: this dispatch, read with `node scripts/harness.mjs usage 1a36e80a-e9e7-441a-8a38-78fb46757048`.
- **Entry:** observed at 2026-10-01T12:23:48.440Z.
- **Handoff:** observed at 12:48:55.223Z, after the decisions were written and before this report, `test:docs` and the result transition.
- **Handoff breakdown:** 103 steps and 94 commands; 15,959,543 cached input, 247,915 cache-write, 200 uncached input and 69,860 output tokens.
- **Unavailable:** reasoning tokens and dollar cost, which means unknown, not zero.

The largest waits were the product gate (782.32 s) and the two subagents. They ran concurrently with the integration and the gate. Tradeoff: the subagents' cost bought the verdict. My own read of the diff had passed over the frozen-row path.

## Goal-aligned judgment

WO-176 has no critical-path gate. It is product 07 closeout machinery. Its blocked outcome is a close that stops short, or one that leaves no readable record. Its premise is fail-conservative: the session never decides what happens to material of unknown provenance.

- **Seeking the wrong goal and rule beating** decided the verdict. The fixtures hold every repository's state fixed between completion and close. So they pass whether or not a recorded row still describes the repository the close removes. The goal is a close that never deletes an undeclared repository, not one that finishes more often.
- **Shifting the burden:** the machinery must notice that a repository changed after the handoff. The operator cannot be expected to know that the executor's row went stale.
- **Drift to low performance:** a passing verification and a green integrated gate do not lower the bar for a reproduced, irreversible deletion that the base refused.
- **Escalation and Naive Interventionism:** the remedy is bounded to how a committed row binds to a repository. The lane rule, the declaration command, the record and the `--material` flag stay as verified, and no gate or role text is added.
- **Policy resistance:** the repair uses the existing repair and verification route.
- **Tragedy of the commons:** the extra cost is one repair and one verification, spent on an irreversible path.
- **Success to the successful:** the committed handoff remains the executor's word. Only lane rows stop overriding the repository's current state.
- **NoOp** publishes nothing. Publishing as is would ship a close that can delete commits nobody declared disposable.

## Criteria

**Criterion 1:** unmet. The fixture cases hold:
- `.runtime/x` previews as disposable and leaves with the worktree in `release:case:material` lane mode.
- The other-lane repository blocks with the declare command in unknown mode.
- `docs/intake/x` is preserved as a unit.
- VER-001 showed that the first case fails on `main` at `b51a58a8`.

The criterion requires an other-lane nested repository with a commit to block. In D022's reachable state it does not block: it holds a commit and its own inventory reads undeclared, yet `finish` removes it. See [Finding F1](#finding-f1--a-frozen-completion-row-deletes-an-undeclared-repository-that-gained-content).

**Criterion 2:** met, carried forward from VER-001. The process-debt case runs the real `material` command and `implementation-ready`, then `repair-complete`. It records declared, lane and undeclared rows, names the undeclared repository with the declare command, and does not refuse. It passed in this review's gate. `resume.mjs` and `lifecycle-evidence.mjs` are unchanged since VER-001.

**Criterion 3:** unmet. The four fixture modes hold in this review's gate:
- declared disposable;
- declared preserve, with the unit answering `git show HEAD:saved.txt` from the retained lane;
- unknown;
- `unknown_keep`, which runs the record's exact command.

Each has exactly one `release create`. The criterion's undeclared clause says publication succeeds and the worktree stays. In my end-to-end drift case the repository had no declaration from the executor or the operator, and its current inventory read undeclared. The close published and then removed the worktree with the repository. Separately, with two undeclared repositories, the printed per-path commands never settle cleanup (D023 b).

**Criterion 4:** met, with record-accuracy limits. Every close attempt writes `release-close.json` in a `finally` block, with these fields:
- dispatch harness, session and source;
- publication outcome, tag, `tagOutcome`, Release and refusal;
- per-worktree cleanup;
- consumed material, overrides and blockers with commands;
- `dryRun`.

The material case asserts a dry run, clean closes, blocked closes and a three-attempt history; it passed in this gate. D023 records the limits:
- (c) a pushed tag without a Release is labelled refused;
- (d) record I/O can replace the close's error or exit status;
- (i) the dispatch assertion at `test-release.sh:1764` is vacuous;
- (j) `previousAttempts` grows without bound.

D020(a) already records spurious blocked rows. In the drift case the record calls a cleanup that deleted an undeclared repository `clean`.

**Criterion 5:** met, carried forward from VER-001. Main did not change product 07. The write-backs are:
- the §Workflow closeout and releases paragraph, edited in place (+28 bytes);
- the release-close row naming the record;
- D001–D020 with the index;
- `FUP-ecf9d3b703a0b7d9` allocated to WO-178's remaining work;
- `FUP-3a0c4ea52f8d6d08` deferred to an actual withdrawn branch.

D016's lane wording is inaccurate (D023 g).

**Criterion 6:** met on the integrated tree:
- `npm test -- --review`: 39 passed, 0 failed, 782.32 s, 84 fresh tasks, at code identity `4bfcb5f80ec024b4a980db64b9164f50218ed47600a2cf092fd1fe5ae2f9a6df`. `gateCodeIdentity` recomputed after the gate gives the same value.
- `npm run test:docs`: 24 passed, 0 failed, 35.35 s, with this report and D021–D024 in place (see Executed checks).
- `git diff --check` and `git diff --cached --check` are clean.
- `git diff ee9b9db9 -- package.json package-lock.json 'packages/*/package.json'` is empty.
- No added line carries a lint, type or format suppression.

## Finding F1 — a frozen completion row deletes an undeclared repository that gained content

**Class:** data loss, criteria 1 and 3 and the order's design ("deleting an undeclared repository (never)"). **Severity:** major; the deletion cannot be undone. **Route:** repair, then fresh verification ([D022](../../evidence/WO-176/decisions.md#wo-176-d022--final-review-finding-a-frozen-completion-row-deletes-an-undeclared-repository-that-gained-content)).

- **Mechanism.**
  - **What completion records.** `lifecycle-evidence.mjs:35` records `inventoryMaterial(root)`, so lane classifications enter the committed event.
  - **Rows become declarations.** `committedMaterial` returns every row. `finish` passes those rows and the overrides as declarations (`worktree.mjs:593-600`, `659-664`).
  - **A declaration overrides the current state.** In `inventoryMaterial`, an explicit row's disposition, source and reason replace the current classification (`worktree-material.mjs:104-120`).
  - **The row is trusted without a fresh look.** The reconciliation records a disposable row without inspecting the repository again (`intake-reconciliation.mjs:94-103`), and the ignored-material check treats it as reconciled (`worktree.mjs:89-92`).
  - **The trigger.** An empty repository outside intake is disposable at completion (`paths.mjs:272-281`). One with content in the other lane is not (`paths.mjs:282-293`).
- **Reproduction 1, modules.** `f1/probe.mjs` used the worktree's own modules on a linked worktree.
  - `scratch/x` was recorded `{disposable, lane, "empty … no commit"}`.
  - After a commit inside it, its own inventory read `undeclared`; with the recorded rows it read `disposable` again.
  - The preview listed it disposable, no blocker remained and the untracked guard was empty.
  - `git worktree remove` without `--force` deleted it.
- **Reproduction 2, end to end.** The drift case was composed into a scratch copy of `test-release.sh`; its WO-176 scripts are byte-identical to the worktree's.
  - `commit_candidate` recorded the completion while `scratch-material/x` was empty, then commit `c6de3c9` was made inside it.
  - `release_close WO-099 --publish` printed `nested repository disposable; removed with the worktree` and `Published annotated v0.2.1`.
  - Afterwards the subject and the repository were gone. The record said cleanup `clean`, with the stale reason.
- **Why the gates missed it.** No fixture changes a repository between completion and close. The read-only worktree subagent found the path; I reproduced it independently.
- **Rule a repair must hold.**
  - A committed row governs a repository only in the state it recorded.
  - A repository that changed since its completion row is judged by its current classification.
  - An other-lane repository with content and no applicable declaration blocks with its commands.
  - Regressions are required for the subject case and for D019's derived-worktree case, which is the same mechanism through settlement and broader than D019 states (D023 a).
- **Re-mint.** `paths.mjs` is a registered build-only edition source. The repair re-checks the deterministic editions if it changes `paths.mjs`.

## Other findings and VER-001's boarded items

**Receipt 036 ([D024](../../evidence/WO-176/decisions.md#wo-176-d024--final-review-finding-receipt-036s-catalog-duty-has-no-implementation-or-recorded-check)).** WO-176's row in `docs/planning/work-order-map.md` disposes of the refuter's known issue this way: "within the design the close bundles a repository whose commits no retained ref reaches into the retained lane before removing it, and the decisions record the check". The order's text and citations do not carry the duty. No source creates a bundle, and no decision mentions the receipt. The refuter's reopening condition holds in the order's own fixture: the material case's lane and disposable modes remove a one-commit repository. The repair either bundles before removal and records the check, or records the operator's decision to decline the duty.

**Minor, for the repair or a follow-up ([D023](../../evidence/WO-176/decisions.md#wo-176-d023--final-review-minor-defects-recorded-for-the-repair-or-a-follow-up)).**
- **(a)** D019 also covers lane rows, not only declared ones.
- **(b)** With several undeclared repositories, the per-path commands never settle cleanup. The release subagent reproduced this; I confirmed it in the source.
- **(c)** A pushed tag without a Release is recorded as refused, and a later retry is credited with the push.
- **(d)** The record's read and write can stop a close or change its exit status.
- **(e)** One derived worktree's inventory failure throws after the subject is removed.
- **(f)** The basename and beacon-stage file rules, and linked worktrees under `.runtime/`, now dispose of whole repositories. I reproduced the classification. It follows the order's literal lane rule but is not recorded.
- **(g)** D016 and a fixture comment name a "feedback lane" that does not exist.
- **(h)** After main moves, the printed retry refuses before cleanup. The check is the base's.
- **(i)** Fixture gaps.
- **(j)** `previousAttempts` is unbounded, and the record is read and written without a lock.

**VER-001's boarded items.** I agree with D019's data-loss classification and D020's accuracy findings. D019 understates its scope (D023 a). D022's repair opens the same seam, so D019's follow-up trigger will occur there.

## Register

`npm run plan -- followups --touching` listed 24 pending rows by textual match, at register revision `70e025d0…`. None names a seam this change opened, or a condition that occurred, beyond what D022–D024 now carry, so all are left as they are. `npm run meta` then added D022–D024's follow-ups as this order's rows (`FUP-1fa571564b4efa07`, `FUP-32e003236baffa9b`, `FUP-d6490bcc786a84b9`).

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-fac73cbaa42b9187 (D019), FUP-b954a9b6cb652a85 (D020) | this order's verifier rows | left | D022's repair opens their seams; D023 (a) widens D019's scope there. |
| FUP-3a0c4ea52f8d6d08, FUP-bf51ac5cd8143d98 | WO-176 | left | Criterion 5's retarget and D006's gate-tree limit stand; no withdrawn order is on a branch and no intake repository was present during this review's gate. |
| FUP-8cfd3ff52146a016 | `release.mjs`, `test-release.sh` | left | The real-runtime publish fixture stays the order's non-goal; no real close ran. |
| FUP-7629e03c6573f5cb | `test-runner.mjs` | left | `worktree-material.mjs` was staged before every gate, and this review's identity keys it, so no row missed a new source file. |
| FUP-adf6621e7f958dd8 (ER4-006) | WO-176 authority copy | left | `scripts/authority-evidence.mjs` is untouched. All `authority.json` files total 8,319,965 of 161,609,022 `docs/evidence` bytes (5.15%), an upper bound on the repeated copies and below 10%. |
| FUP-b7a66e7a4fa7ad20, FUP-e2cf2122a642d1e0, FUP-dc1335f4d10f6a75 | `release.mjs`, `worktree.mjs` | left | Release preparation, the integrate helper, the release listing and the integration fixture's regenerators are untouched. |
| FUP-4475529d727a4d25, FUP-e55e258d37cb3f20, FUP-b3454d6ce3594ef3 | `paths.mjs`, `lifecycle-evidence.mjs`, `test-process-debt.mjs` | left | Textual matches; the corpus entry guards, the follow-up feed and the reader's count are untouched. |
| FUP-f1c7a256bec46737, FUP-fb8cbeabbddef397, FUP-439252e49f6381fc, FUP-e34029d1192ce82e, FUP-56b599e15f97e666, FUP-fd05316b6030ef73 | product 07, runner, README | left | The guide shrinks by 10 bytes against `main`. The runner change adds one declared source. None of their conditions occurred. |
| FUP-5474f89208c6bb9f, FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb, FUP-1615e610542d4e33 | WO-176, meta, `current.md`, `checks.json` | left | Textual matches on generated or evidence files. |

## Integration with `main`

Main had moved by one merge, WO-180 (v0.60.0). The integration ran as follows:
- `npm run backup:intake` wrote a three-file archive to this session's scratch.
- `npm run worktree -- integrate WO-176 --intake-backup <archive>` checkpointed `/6` and kept the stash `11a49058…` (`WO-176 integrate 2026-10-01`).
- It fast-forwarded the uncommitted branch from `276db3e1` to `ee9b9db9`.

Two authored conflicts were resolved to main's bytes:
- **`scripts/test-worktree-integration.mjs`.** Both sides added the same browser-evidence and Playwright links, in a different order.
- **`docs/evidence/current.json`.** Main's WO-180 editions stay selected. Each of the four edition checks passes on the integrated tree. WO-176's revision 001 files equal WO-180's except the harness `bundle-diff.json`. `paths.mjs` is build-only for the editions that register it, so no re-mint is due.

`--continue` regenerated the runtime, the harness bundle, the control projection, the index, meta, the publication locks and the selected console fixtures. It retimed the release from v0.59.1 to v0.60.1 under the patch classification, with no component version change, and wrote the draft D021, which I completed. Main changed none of WO-176's source files or fixtures, so VER-001's criterion 1–5 evidence carries forward on unchanged bytes. F1 holds on both bases.

## Executed checks

| Check | Result |
| --- | --- |
| `npm test -- --review` (integrated tree) | 39 passed, 0 failed, 782.32 s, 84 fresh; identity `4bfcb5f8…`, recorded 2026-10-01T12:40:38.060Z; `worktree` 97.47 s, `release:case:material` 42.04 s, `worktree-integration` 268.53 s |
| `authority-evidence`, `artifact-identity-evidence`, `verification-evidence`, `feedback-evidence` `--check` (integrated) | all pass against main's selected editions |
| `npm run publication:check`, `node scripts/harness.mjs check` | pass; 31 generated surfaces |
| `npm run release -- check-surfaces --local` | exit 0, 57 PASS; tag observation local |
| `git diff --check`, `git diff --cached --check` | clean |
| F1 module probe (`f1/probe.mjs`) | `scratch/x` with a commit deleted by `git worktree remove` under the replayed row |
| F1 end-to-end drift case (`f1/drift-case.sh`) | published, then the subject and repository removed; record cleanup `clean` |
| D023 (f) classification probe (`f1/probe-f3.mjs`) | `*.tsbuildinfo`, beacon-stage and linked-worktree repositories inventoried disposable/lane; a plain one undeclared |
| `npm run meta`, twice | D021–D024 indexed; three follow-up rows added (`FUP-1fa571564b4efa07`, `FUP-32e003236baffa9b`, `FUP-d6490bcc786a84b9`). The second run, after I added D022's end-to-end evidence, gave D022's row a second source revision. Health line: `no observed budget breach … 1 reopen candidates` (WO-150-D003, as before) |
| `npm run test:docs` | first run: 14 passed, 10 failed, because the register was stale after that D022 edit (`meta` preflight). After the resync: 24 passed, 0 failed, 35.35 s, 24 fresh tasks, with this report and D021–D024 in place |

## Route

`resume: fix` repairs D022 under its rule. D024 and D023's items go into the same repair within its bound, and anything it leaves gets a named follow-up. A fresh verification then judges criteria 1 and 3 on the repaired subject. Nothing is committed, pushed or published by this review.
