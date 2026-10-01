# WO-176 — FINAL-002

**Verdict:** pass, on the order as the operator amended it during this review. Release close now removes a scratch repository under `.runtime/` with the worktree, without stopping and without a declaration or flag. That is the case that stopped WO-117's close. The repository that close met was a clone with commits inside `.runtime/wo117-walkthrough/`; its own session log names it as the single blocker. I ran that exact shape through the subject. The repository was classified disposable, its two commits were bundled, and `git worktree remove` removed the worktree. On `main` at `b51a58a8` the same repository blocks.

**Subject:** [`docs/work-orders/WO-176-release-close-finishes-on-the-handoff.md`](../../work-orders/WO-176-release-close-finishes-on-the-handoff.md) on branch `wo-176`, uncommitted, on `main` at `ee9b9db9` (WO-180, v0.60.0). `origin/main` has not moved since FINAL-001's integration, so no integration was due. The dispatch checkpoint is `refs/dotln/checkpoint/WO-176/12`. The code identity is `d1c1a36288d1e3fd091b4610191df9d33f915c218d858d7607a35787f03302d9`, the same as VER-002's subject.
- **Verification sequence:** [VER-001](../../verifications/WO-176/VER-001.md) passed. [FINAL-001](FINAL-001.md) failed, then a repair ran. [VER-002](../../verifications/WO-176/VER-002.md) passed.
- **Amendment:** the operator rewrote the order's objective and criteria during this review ([D035](../../evidence/WO-176/decisions.md#wo-176-d035--operator-amendment-judge-the-order-on-deleting-scratch-repositories)). It is bound by `PlanExecutionAmended` at 2026-10-01T15:08:05.604Z (decision hash `4d30aa95…`). I judged the two amended criteria.
- **Ideation:** no ideation breakout receipt applies. The bounded adjacent repair ran through the adjacent-work queue, with the operator's recorded selection (D027).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 85799 tokens; handoff 19351865 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness. The actor values are this session's: Claude Code 2.1.286 from `claude --version`, model `claude-opus-5-5`, and effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective).

Cost scope: this dispatch, read with `node scripts/harness.mjs usage dae39df7-d2a9-4697-924f-f201d05c53aa`.
- **Entry:** observed at 2026-10-01T14:41:29.429Z.
- **Handoff:** observed at 15:08:16.265Z, after the amendment and D035–D037 and before this report. It covers 100 steps and 93 commands.
- **Breakdown:** 18,964,726 cached input, 287,450 cache-write, 194 uncached input and 99,495 output tokens.
- **Unavailable:** reasoning tokens and dollar cost, which means unknown, not zero.
- **Subagents:** the plan, stated before the first spawn, was two read-only reviewers out of 20. The readback observed 2, with 18 remaining. Their completion notices report 188,697 and 192,542 tokens of their own; whether the counter includes them is not stated, so they are named here and not added.

## Goal-aligned judgment

The mission this order serves is a release close that finishes, so the operator does not have to clear scratch material by hand. Its critical path is WO-117's case.
- **Seeking the wrong goal and rule beating.** FINAL-001, VER-002 and the first part of this review all judged the planner's preservation rules ("deleting an undeclared repository (never)"). Under those rules, removing a scratch repository's contents counted as a failure. The operator stated that those contents never matter (D035). I record that misreading as a correction (D036).
- **Shifting the burden.** A scratch repository should not reach the close at all. The executor or the reviewer should remove it first. That is follow-up `FUP-a1e36af45f68e3ac`.
- **Drift and escalation.** No further cycle is spent hardening preservation.
- **Policy resistance.** The amendment uses the WO-139 route.
- **Commons.** No source changed in this review.
- **Success to the successful.** The shipped declaration, `--material`, record and bundle machinery is not credited as the order's purpose. Its defects are boarded (D033, D034, D037).
- **Naive Interventionism.** I changed no implementation.
- **NoOp.** A NoOp would leave WO-117's case blocking every close that meets it.

## Criteria

**Criterion 1:** met.
- **Real case.** The blocker in the WO-117 close's Codex session log of 2026-09-29 (local only) was a nested repository with content inside `.runtime/wo117-walkthrough/`, classified other lane, with no "(commit state unknown)" suffix. So it was a standalone repository with commits. The walkthrough helper's own store beside it is a plain directory.
- **Exact-shape probe on the subject's modules.** A `git clone` with two commits at `.runtime/wo117-walkthrough/repo` in a linked worktree:
  - the completion row and the close row both read `disposable/lane`;
  - the reconciliation's recovery reads `bundled`, 2 commits;
  - `git worktree remove` without `--force` removed the worktree;
  - a clone of the bundle printed both commits.
  - The probe was then deleted.
- **End to end.** The release fixture's `lane` mode holds a one-commit repository at `.runtime/x` with no declaration. It previews `nested repository disposable` and publishes exactly once (`release create` counted 1). The record reads `clean`, `test ! -e` holds on the subject, and the recorded bundle clones. This passed in the gate row below.
- **Baseline.** VER-001 and VER-002 each ran `b51a58a8`'s `describeIgnoredMaterial` on that repository and got `disposable:false`. On `main`, `ensureNoIgnoredMaterial` blocks every non-disposable entry. `git diff b51a58a8 ee9b9db9 -- scripts/lib/paths.mjs` is empty.
- **Other lanes.** Build output, the harness and cache lanes and the beacon directories share the rule (`disposableRepositoryLane`, `scripts/lib/paths.mjs`).

**Criterion 2:** met.
- **Product gate.** `npm test -- --review` in this review reused the complete passing row at the unchanged code identity `d1c1a362…`: 39 suites, 0 failed, 801.58 s, recorded 2026-10-01T14:19:09.599Z. No suite started, and `gateCodeIdentity` recomputed in this review gives the same identity.
- **Document gate.** `npm run test:docs` ran after this report was filed; its result is in the session response, because filed bytes cannot carry it.
- **Diff checks.** `git diff --check` and `git diff --cached --check` are clean.
- **No new dependency.** `git diff HEAD -- package.json package-lock.json 'packages/*/package.json'` is empty.
- **No suppressions.** No added line carries a lint, type, format or shellcheck suppression.

## Findings

Neither reviewer, nor my own reading of the full subject diff, found a defect in criterion 1's path. The two read-only reviewers worked on a frozen clone, one on the completion and worktree side and one on the release close. Their findings concern the declaration, preservation and record machinery, which the amended order does not judge. [D037](../../evidence/WO-176/decisions.md#wo-176-d037--final-review-defects-in-the-shipped-machinery-the-amended-order-does-not-judge) boards them with `FUP-65efad56c927c1f9`:
- **(a) Forced removal.** It can remove a committed submodule's unpushed commits when an intake unit forces the removal. DotLn tracks no submodule.
- **(b) Keep declaration after a move.** A keep declaration does not survive a worktree move, so the `.runtime` repository is removed. I reproduced this at module level and through the reviewer's release probe. Under D035 this is the wanted result; it contradicts D030's wording.
- **(c)–(g)** An unread late declaration; refused and partial labels on published releases; remedies that cannot settle a dirty derived worktree; no record for a malformed close; a control-lane repository can be declared disposable.

FINAL-001 failed the order for removing a scratch repository, and this review began on the same premise. [D036](../../evidence/WO-176/decisions.md#wo-176-d036--correction-the-review-role-judged-scratch-deletion-as-data-loss) records that correction.

## Register

`npm run plan -- followups --touching` listed 25 pending rows by textual match.
- **Added by `npm run meta`.** It indexed D035–D037 and added `FUP-a1e36af45f68e3ac` (D035) and `FUP-65efad56c927c1f9` (D037).
- **Rows this repair settled.** VER-001's and FINAL-001's rows were settled by the repair (D032). Their remainders are carried by `FUP-da471832071118c7` (D029), `FUP-e7096aa6bde63c0e` (D033) and `FUP-03ccaaf4c2e6ad49` (D034).
- **Planner follow-up.** `FUP-a1e36af45f68e3ac` should also retarget D033's recovery scope and D034's word handling if the simplification removes that machinery.
- **The rest are left as they are.** They are textual matches on `release.mjs`, `paths.mjs`, `test-runner.mjs`, product 07 and generated files, and none of their conditions occurred.

## Executed checks

| Check | Result |
| --- | --- |
| `npm test -- --review` | reused passing complete row at `d1c1a362…`, 39 suites, 801.58 s; no suite started |
| WO-117 exact-shape probe (scratch, deleted after) | `disposable/lane`; 2 commits bundled; worktree removed; bundle clone holds both commits |
| F1 drift probe, FINAL-001's sequence | an empty repository that later gains a commit reads `undeclared` at close; a declaration voided by a later commit |
| Keep-after-move probe (module) and reviewer B's release probe | `preserve/declared` becomes `disposable/lane`; close exit 0, cleanup `clean` (D037 b) |
| `npm run release -- check-surfaces --local` | exit 0 |
| `npm run publication:check`, `node scripts/harness.mjs check` | pass; 31 generated surfaces |
| `git diff --check`, `git diff --cached --check` | clean |
| Product 07 cleanup paragraph | 624 to 664 bytes with its newline; guide 157,209 bytes, ceiling 157,212 |
| `npm run plan -- amend-order WO-176 WO-176-D035 …` | `PlanExecutionAmended` recorded |
| `npm run meta` | D035–D037 indexed; two register rows added; health line `1 reopen candidates` (WO-150-D003, as before) |

## Route

Record the pass, commit the reviewed state, push `wo-176` and open its PR. The merge and release close stay with the operator. All reviewer and probe scratch repositories built during this review are deleted.
