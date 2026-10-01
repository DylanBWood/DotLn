# WO-182 — FINAL-001

**Verdict:** pass. All five criteria are met against the original order. The evidence is VER-001's probes, my own reading of the full diff and a fresh product gate on the integrated tree. `main` had moved to WO-177 (`v0.61.3`), so I integrated it. Upstream touched none of this order's sources, so VER-001's judgments carry forward, and `v0.62.0` stays the target. I board two seams that the runs requiring readiness inherit, in [D006](../../evidence/WO-182/decisions.md#wo-182-d006--final-review-pass-and-two-seams-the-required-runs-inherit). The one that matters most: nothing writes `delivery-preparation.json` yet, so a run with `--require-deliverable-ready` refuses on three items until a producer exists.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 83149 tokens; handoff 12432095 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-182 and allocated this path. The actor values are this session's:
- Claude Code 2.1.287, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage d6e24313-bbfc-4f89-9c1c-1bbaaf96d62f`. The entry sample was observed at 2026-10-01T20:59:05.933Z and the handoff sample at 2026-10-01T21:21:52.911Z (90 steps, 78 commands), before this report was filed. Both are cumulative transcript counters; 12,178,210 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. The largest wall-clock cost was the product gate (903.77 s). Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted worktree over base `1d00bc58af32ecfcc6080e21a62179709bf5efe7`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-182/VER-001.md) passed, and no repair followed. No ideation breakout receipt applies, because the evidence folder holds none. The order's text changed only in its title, where the version placeholder became `v0.62.0` (D003). No scope expansion was recorded. `npm run plan -- check` exits 0 on the integrated tree.

Integration. `origin/main` and tag `v0.61.3` named `855450ea`, four commits past the executor's base. `git diff --name-only 1d00bc58 855450ea` lists 25 files: WO-177's entropy-review and three probe modules with their tests, `scripts/test-resident-bind.mjs`, WO-177's records and two documents, the README's release line and four generated projections. The only paths both sides changed were the README and three generated projections. `npm run worktree -- integrate WO-182`:
- checkpointed `/6` and retained the include-untracked stash `1f5b9a00` (`WO-182 integrate 2026-10-01`);
- fast-forwarded the uncommitted branch with no authored conflict and regenerated the projections;
- left `v0.62.0` current. Neither side changed a package version, manifest or generated hook, so no component version collides.

`docs/intake/` holds only `.gitkeep` files, so no intake backup was needed. After integration, `git diff refs/dotln/checkpoint/WO-182/5` over this order's six changed scripts and product 03 is empty. The untracked fixture `scripts/fixtures/target-publish/readiness.mjs` hashes to the checkpoint's blob `721b5c9a`. [D005](../../evidence/WO-182/decisions.md#wo-182-d005) records both bases and the carried-forward claims.

I reviewed:
- the order, and its cited sources: product 03 §DeliveryAdapter, WO-064's D008 and D009 through the existing `acceptanceStatuses` binding, the WO-180, WO-181 and WO-123 orders for the events and the composition that read them, and product 08 §PRs and commits;
- the handoff, the artifact contract, D001–D004 and VER-001 in full;
- the full diff:
  - `scripts/lib/github-body.mjs`: `deliveryContractHash`, `deliverableReady` and its fourteen rows, and the new body section with known items;
  - `scripts/lib/target-publish.mjs`: the request keys, `verificationArtifacts` replacing the matrix projection, `acceptanceArtifacts`, `readDeliveryPreparation`, `readinessArtifacts` and the refusal's position in `publishTargetOrder`;
  - `scripts/worktree.mjs`'s argument check and usage, and `scripts/work-orders.mjs`'s catalog line;
  - both test files and the new pure fixture;
  - the README, product 03 and the generated publication locks, index and decisions rows.

The diff matches the order's design. The evaluator is pure, reads typed host projections and accepts no verdicts. Each row names its artifact or its reason. The visual item can be not applicable only when a bound matrix declares no visual criterion. The refusal comes after `authorizePublication` and the local `observeTarget` read, and before `publication.acquire()`, `ensureGh`, the push and `gh pr create`. The launchpad's own `worktree publish` branch is untouched.

Two behavior changes reach beyond the flag, and both fail closed. They go to the release notes, not to a finding:
- A malformed `delivery-preparation.json` refuses even an operator publish without the flag.
- Replacing `projectAcceptanceEvidenceMatrices` with `verificationArtifacts` adds a live `host.lock` refusal. That refusal also reaches `pushRepairedHead`, the review loop's repaired-head push. Its existing cases in `scripts/test-target-publish.mjs` pass in this review's gate.

The selection of streams and the subject-revision filter are the old projection's own.

Code quality. The WO-112 and WO-118 catalog lines are a hard-coded pair of identifiers in `renderIndex`. D001 chose that to avoid editing two authority documents. It is legible, and it is the only such special case. If `worktree publish --target <request> --require-deliverable-ready` has the flag in the request's position, the flag is read as the request path, and the publish fails reading that file. Both are harmless and left as they are.

Clean-room screen: I searched the staged diff against `855450ea`, excluding the generated index, register and control projection, and every new evidence, verification and control file. The search covered user paths, account identities, URLs, token and key shapes, and private keys, and found no match. The fixture's identifiers are synthetic (`fixture-ready`, `github.com/fixture/target`, repeated-letter commit identifiers). No lint or type suppression directive was added in source, tests or fixtures.

## Criteria

**Criterion 1:** met. `WO-182 AC1/AC2` evaluates the pure fixture and gets fourteen distinct `evidenced` rows, each of whose references resolves in the fixture's store. `WO-182 AC1: missing baseline/review` yields `absent` rows naming `BaselineWitnessed` and `ReviewCompleted`. WO-180 and WO-181 define those two events, so the names point at their producers. A `behavior` claim type yields visual `not-applicable` with its reason, and a missing matrix yields `absent`, never `not-applicable`. VER-001's probe P1 resolved all 21 references of a replayed publication against the real fixture stores, each to the named event type. Its P2 turned 24 further mutations into `absent` rows. The limit VER-001 states holds: all fourteen evidenced, visual included, is shown on the projection only.

**Criterion 2:** met. The body always carries `## Deliverable-ready`, one result line and the table. `WO-182 AC1/AC2` asserts the section, fourteen `| evidenced |` cells, every escaped reference, zero GitHub profile failures and an outward-lint `pass` against `docs/control/outward-vocabulary.json`. The publisher tests run the launchpad's real `lintArtifacts` before the `gh` double. The WO-064 lint test lost its `$` anchor because a local term `baseline` now also matches the fixed row names. The refusal it asserts is unchanged.

**Criterion 3:** met. In `WO-182 AC3: one absent item names its gap`, exactly one unresolved ambiguity makes the flagged publish exit 1 with `deliverable-ready evidence absent: No unresolved material ambiguity` and nothing else. `refusedBeforeRemote` asserts zero `gh` calls, no remote branch and no publication store. The same store without the flag publishes through the double (three `gh` calls), and its body reads `not ready; 1 item absent.` with twelve evidenced rows and visual not-applicable. A replayed, fully evidenced store passes with the flag. Stale preparation and forged producer actors refuse before any remote call. D006's first seam concerns a repeat after a recorded publication, which makes no remote call, so it does not contradict this criterion.

**Criterion 4:** met. Product 03 §DeliveryAdapter gains one sentence in place: 259 bytes measured with `Buffer.byteLength`, within 400. `docs/evidence/WO-182/decisions.md` holds D001–D006, and the decisions index lists all six. The generated WO-112 and WO-118 catalog rows each read `Delivery: target publication requires worktree publish WO-NNN --target <request> --require-deliverable-ready (WO-182)`.

**Criterion 5:** met. This review's `npm test -- --review` passed 34 of 34 on the integrated tree (see Executed checks). `npm run test:docs` passes with the final-review records in place. `git diff --check` is clean. No manifest or lockfile changed, so no dependency was added. No lint or type suppression directive was added.

## Boarded seams

D006 boards two seams, with one follow-up for planning before WO-123 activates (register row `FUP-68937a5651fb775a`, untriaged):
1. **From source, not executed: a flagged repeat reads as success.** `publishTargetOrder` returns an already recorded `PullRequestOpened` before it evaluates readiness. So `--require-deliverable-ready` for a head an operator already opened without the flag exits 0 with "Already published …; nothing pushed", even when items were absent. That call opens nothing. A run that takes the exit status as readiness would still be wrong. The fix changes WO-064's idempotent repeat for every caller, so it belongs to the composition, not to a bounded cleanup.
2. **Read from source: no producer writes the preparation file.** Ambiguity, tests/build/lint and the monitored loop read only an owner-written `delivery-preparation.json`. It must carry `deliveryContractHash`, which no command line prints, and the source host's `diffHash`. Tests/build/lint has no not-applicable route. Until a producer exists, every run with the flag refuses on those three items. The WO-112 and WO-118 catalog rows name the flag but not the file.

## Register

`npm run plan -- followups --touching --work-order WO-182` matched 13 pending rows at register revision `c614f5b9…`.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-57ecd19a26362b1c | WO-182 | left untriaged | WO-181-D012's fixture for a failed or missing review belongs to WO-123's composition. WO-182 supplies the absent review row that composition would receive, but the condition, the composition sequencing review, has not occurred. |
| FUP-a8ff3066b5663629 | WO-182 | left untriaged | WO-180-D013's seams for WO-123 name WO-182 only as a blocker. |
| FUP-65efad56c927c1f9, FUP-e7096aa6bde63c0e, FUP-dc1335f4d10f6a75 | `scripts/worktree.mjs` | left | WO-182 changes only the `publish --target` argument check and usage, not `removePreservedWorktree`, `finish`'s inventory or the integration fixture's overlay. |
| FUP-7f9a27e6ed6c44b3 | `scripts/work-orders.mjs` | left | One static catalog line; the index's per-tag reads are untouched and no growth threshold is observed. |
| The other seven | generated, evidence, product or README files | left | Textual matches only. |

`npm run meta` then synced D005 and D006. D006's follow-up created the untriaged row `FUP-68937a5651fb775a`.

## Executed checks

- Integration: `npm run worktree -- integrate WO-182`. Bases `1d00bc58` → `855450ea`, checkpoint `/6`, stash `1f5b9a00`, no authored conflicts.
- Printed affected checks on the integrated tree:
  - `node scripts/harness.mjs check`: exit 0, 32 generated surfaces.
  - `npm run publication:check`: exit 0, index coverage 253 of 253, both tables of contents current.
  - `npm run release -- check-surfaces --local`: exit 0.
- Final product row: `npm test -- --review`, recorded 2026-10-01T21:21:18.566Z, after the order's new fixture was staged.
  - 34 passed, 0 failed, 903.77 s, 79 fresh tasks.
  - Code identity `31d606746f81248b1ab29e4b7216091e1fe7f1362cf41b605d3f2038a3b14257`.
  - The row covers `github-body` (0.09 s) and `target-publish` (95.94 s), which run this order's tests. It also covers `work-orders-fixtures` (21.54 s), `worktree` (102.87 s), `harness-fixtures` (349.63 s), `skeleton` (344.34 s), `worktree-integration` (284.06 s) and the release and edition suites.
- `npm run test:docs`: 24 passed, 0 failed, 38.72 s, 24 fresh tasks. The first run refused the release notes' angle-bracket placeholders (`<request>`) as raw HTML in `release-surfaces`; I rewrote them as plain words, and the rerun passed, with this report, PR.md, RELEASE-NOTES.md, D005 and D006 in place. The result transition runs it again inline.
- `npm run plan -- check`: exit 0. `npm run meta`: D005 and D006 indexed; health line `no observed budget breach; … 1 reopen candidates` (WO-150-D003, as at earlier closes).
- Byte count of the product 03 sentence: 259 (`Buffer.byteLength`).
- Source checks: `git grep delivery-preparation` and `git grep deliveryContractHash` over `scripts` and `packages` find no writer of the preparation file outside the tests.
- Subject check: `git diff refs/dotln/checkpoint/WO-182/5` over the order's sources, and `git hash-object` of the untracked fixture, after integration.
- `git diff --check` and `git diff --cached --check`: clean.

Not re-run: VER-001's P1 resolver and P2 mutations. They read the same bytes, which are unchanged since the checkpoint it judged.

## Judgment and publication

D001 and D006 compare their choices with the mission, the eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- "Deliverable-ready" is now a computed conjunction with an evidence reference or a reason per item, in every target body.
- A run that requires readiness cannot open a pull request while an item is absent. This is shown in deterministic doubles, with zero remote calls.
- The operator's own proposal route is preserved, and it now states its gaps.
- The cost was this review's product gate and no live episode.

The two seams in D006 are where the benefit is still partial: the required runs cannot pass until a preparation producer exists, and a repeat must not be read as readiness.

Result route: `final-review-result pass`.
