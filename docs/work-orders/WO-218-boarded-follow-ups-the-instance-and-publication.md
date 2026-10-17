# WO-218 — Boarded follow-ups, batch 2: the instance lifecycle, export and kit, publication, release close, the starter and worktrees: every one of the 32 register rows listed below is fixed with a fixture case or declined with its recorded reason, the register shows it, and a row only the operator can decide leaves as an operator packet (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** assigned at activation from the fixes made (patch
unless a fix changes a command, flag, schema or refusal, which the decisions
name; then minor). A declined row changes no behavior.
**Cost:** adds the fixes and fixture cases the listed rows need, across
`scripts/launchpad.mjs`, `scripts/lib/target-worktree-close.mjs`, `scripts/lib/target-worktrees.mjs`, `scripts/lib/starter-refresh.mjs`, `scripts/release.mjs`, `scripts/check-publication.mjs`, `scripts/lib/harness.mjs`, `scripts/lib/harness-runtime.mjs`, `scripts/lib/config.mjs`, `scripts/lib/stash-drop.mjs`, `scripts/worktree.mjs`, `scripts/kit/README.client.md` and the fixtures the rows name; unknown until each row is triaged, and the README records
the per-row command and case. Removes 32 pending rows from the
register, which at the base holds 281 pending rows, 130 of them decision
rows boarded by closed orders across 53 orders (the oldest from WO-054,
2026-09-18), 88 of them follow-ups boarded in the week of 2026-10-13 to
2026-10-17 alone; the rule that "the next order that edits the surface"
takes a row delivered none of these 32 (each still pending at
`7b8206f4`). Wall-clock: one triage per row plus the fixes; unknown until
run. Context bytes: this order's row list is read once. Commands: none
added. Tokens: unknown until run. Steps: 20. Re-mints: the
executor checks each edited file against `scripts/lib/evidence-sources.mjs`
(a registered source owes its edition's deterministic re-mint) and
`FEEDBACK_SOURCE_PATHS` in `packages/skeleton/src/feedback-audit.ts` (an
edited judged source owes one live feedback self-host episode on Codex
`gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, no
authorization needed, cost accepted); any edited declared machinery source
(`machinerySources` in `scripts/test-runner.mjs`) puts `npm test --
--review` in the final criterion, which names it already.
**Nomination provenance:** the 2026-10-17 standard planning pass
([planning document](../planning/standard-pass-2026-10-17.md) §4.6 and
§5), on the operator's direction of that day as the pass synthesizes it:
work orders that resolve every boarded, follow-up and reopened row rather
than leaving them to the next order that edits the surface. This order is
one of four cut by subsystem from the register's 130 pending decision rows
(`npm run plan -- followups --export`, revision `d6462e4d…`); the rows are
the register's own excerpts. Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: repository records only.
**Depends on:** WO-217 placed before it (reference only; no hard edge).
**Recommended placement:** position 3 of the serial queue, after WO-217; the operator may interleave the four batches with the focus orders by one sequence edit.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-217",
    "relation": "reference-only",
    "reason": "placed before this batch in the serial queue; no hard edge"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (the
Adjacent Repair boundary and the boarded-defect rule), §Verification review
and attack (routes), §Operator-opened planning pass (Retained planning
follow-ups); `docs/planning/followups.md` (dispositions and `--apply`);
each listed row's source decision, in full; the fixtures the rows name.

**Objective:** Every row listed below ends in a terminal register
disposition recorded by this order: `settled` with a fixture case that
fails without the fix, or `declined` with the recorded reason, or, only for
a choice the operator alone can make, `deferred` with an operator packet
in the handoff and a reopening condition naming this order's pull request.
No row is left `untriaged`, `open` or `allocated`. The register's pending
count falls by the number of rows settled and declined.

**Observed gap (dated 2026-10-17, main at `7b8206f4`):** the register
holds 281 pending rows, 130 of them decision rows boarded by closed orders
(`npm run plan -- followups --export`): each was met by a verifier or
reviewer, recorded under product 07's boarded-defect rule, and deferred to
"the next order that edits these surfaces", a planning pass or a repair
that never came; the oldest listed below dates from 2026-09-18. In the week
of 2026-10-13 to 2026-10-17, seven final reviews boarded 88 follow-ups and
the pending count rose from 247 to 281. The 32 rows of this
batch name the instance lifecycle, export and kit, publication, release close, the starter and worktrees:

- FUP-06de60fa5d19fe5a (deferred): WO-074-D010: A fork's publish check should read its operator author identity from instance data rather than scripts/lib/contributions.mjs's constant, so the kit carries no instance identity in a… ([source](../evidence/WO-074/decisions.md#wo-074-d010--write-backs-carry-ins-and-the-kits-instance-identity))
- FUP-0804477ea9d640a7 (deferred): WO-168-D004: Planner, low priority, with the next order that edits the outside-write guard: only the final component of a session root is inspected, so an ancestor (<system-temp>/dotln/<key> or the ho ([source](../evidence/WO-168/decisions.md#wo-168-d004--item-2-a-granted-session-root-is-a-real-directory))
- FUP-09a2fb517f0ffbc4 (deferred): WO-158-D006: Next beacon codebook revision: add a withdrawn phase (or an explicit settled state) so a withdrawn order's beacon is current rather than stale. ([source](../evidence/WO-158/decisions.md#wo-158-d006))
- FUP-3a0c4ea52f8d6d08 (deferred): WO-158-D005: Next order that touches worktree lifecycle (WO-160 is the nearest): give a withdrawn order a publication and teardown route; worktree finish and publish require a closed order today, so a ([source](../evidence/WO-158/decisions.md#wo-158-d005))
- FUP-406744f5e9966250 (deferred): WO-169-D006: Two defects of worktree integrate that predate this order, met in review and left: the decision stub is written once per checkpoint, so a stub written on a pass whose release preparation  ([source](../evidence/WO-169/decisions.md#wo-169-d006--generation-waits-for-authored-conflicts-the-record-holds-the-release-message-as-one-line))
- FUP-44639ec9a751d8d1 (deferred): WO-075-D008: Emit the Start here Read[role] directives from the compiled Contributor bundle instead of hand-writing them in core's CLAUDE.md floor and the kit's CLAUDE.template.md, so the two floors c ([source](../evidence/WO-075/decisions.md#wo-075-d008--cold-start-bytes-inside-the-export))
- FUP-5c2082d9fc28dbbf (deferred): WO-075-D017: Launchpad export provenance reads ignore replace refs: run the export's commit reads (rev-parse, ls-tree, cat-file for kit sources and pinned build/emit inputs) with git --no-replace-obje ([source](../evidence/WO-075/decisions.md#wo-075-d017--verification-ver-002-provenance-reads-honor-git-replace-refs))
- FUP-620f25409f65f4aa (deferred): WO-076-D009: The next WO-076 repair, or the next order that edits scripts/lib/harness.mjs decodeBuildOverlay. Rule a repair must hold: overlay text that would reach a generated surface is refused befo ([source](../evidence/WO-076/decisions.md#wo-076-d009))
- FUP-785f679912b2f36c (deferred): WO-073-D011: Earlier registration generators declare their class: docs/evidence/WO-111/seed.mjs adds classes: { scratch: { checks: [], supports: [] } } beside its scratch registration (or an owning or ([source](../evidence/WO-073/decisions.md#wo-073-d011))
- FUP-815e8662408881f1 (deferred): WO-073-D010: Registration linkHosts validation matches the observer screen: scripts/lib/config.mjs refuses at load each repositories.<id>.linkHosts entry the source-bundle host allowlist would refuse  ([source](../evidence/WO-073/decisions.md#wo-073-d010))
- FUP-847826d3542ff249 (deferred): WO-168-D006: Planner, low priority, with the next order that edits the shell destination adapter or command effects: (a) invocationRedirects treats &> and &>> as one redirect, so the hook admits ls do ([source](../evidence/WO-168/decisions.md#wo-168-d006--item-4-four-argument-forms-one-spelling-two-git-conditions))
- FUP-8cfd3ff52146a016 (deferred): WO-166-D008: Planner: add a fixture that drives node scripts/release.mjs close --publish against the real harness-host runtime and the writer/ directory protocol in a linked subject/main pair, coverin ([source](../evidence/WO-166/decisions.md#wo-166-d008))
- FUP-94f789b2dcdd30e7 (deferred): WO-215-D020: Planning, or the next order that edits these surfaces; none blocks the first live refresh, which is this order's own release close. (F1, remainder) docs/product/04-interfaces.md's release ([source](../evidence/WO-215/decisions.md#wo-215-d020--final-review-pass-final-001-at-the-integrated-subject-two-register-rows-settled-the-orders-follow-ups-left-for-planning))
- FUP-9d397b57910ae6ed (deferred): WO-076-D011: The next WO-076 repair, or the next order that edits scripts/lib/harness-runtime.mjs or the build none manifest in scripts/lib/harness.mjs harnessInstallation. Rule a repair must hold: a  ([source](../evidence/WO-076/decisions.md#wo-076-d011))
- FUP-a859aa6cad8f9c6c (deferred): WO-188-D044: Publication destination encoding: a destination already percent-encoded in the source, such as file%281%29.md, is encoded again by encodeURI to file%25281%2529.md and addresses a differen ([source](../evidence/WO-188/decisions.md#wo-188-d044--repair-of-ver-003-f2-a-link-is-rewritten-only-where-the-parser-renders-one-at-the-destination-the-parser-renders))
- FUP-aa129ef63aeef2b1 (deferred): WO-210-D025: Planning: each manifest reader judges every entry against its own release's kit list (scripts/launchpad.mjs kitPath), with no list of retired paths. The README's update now always uses… ([source](../evidence/WO-210/decisions.md#wo-210-d025--take-this-release-in-an-older-instance-through-the-incoming-launchpad-and-an-update-pull-request))
- FUP-acdc329e47638889 (deferred): WO-202-D011: Distinguish an undeclared publication from a missing one in scripts/check-publication.mjs. Pass with 'publication: no editions declared' only when no publication declaration exists: no au ([source](../evidence/WO-202/decisions.md#wo-202-d011--verification-board-publicationchecks-absence-rule-which-does-not-distinguish-an-undeclared-instance-from-a-core-checkout-missing-its-editions))
- FUP-c9dc1abccd1f1a9d (deferred): WO-210-D029: Planning remainder from FINAL-001 and D027, six findings. F8: add a contained immutable record reader for targetRecords-bound repository/commit/path/hash, use it in scripts/lib/meta.mjs… ([source](../evidence/WO-210/decisions.md#wo-210-d029--repair-the-final-review-regressions-and-bounded-findings-retain-six-planning-follow-ups))
- FUP-cc27c2c1a82fed2c (deferred): WO-188-D049: Planning, low priority: (1) scripts/release.mjs finishPublishedWorktree: the disposable retry command names every material row of each kept worktree, so when an intake, linked-worktree or ([source](../evidence/WO-188/decisions.md#wo-188-d049--final-review-seven-low-findings-of-the-release-and-lifecycle-review-worker-boarded))
- FUP-cf950d70e66c50bf (deferred): WO-210-D030: FINAL-001 F21, deferred with D030's pre-build counterexample: move harnessInstructionBlock and composeHarnessInstruction, with their marker constants, into a dependency-free shared… ([source](../evidence/WO-210/decisions.md#wo-210-d030--keep-seed-preflight-independent-of-the-compiled-harness-defer-shared-composition))
- FUP-d5d0ef5cf034102e (deferred): WO-076-D008: The next WO-076 repair, or the next order that edits scripts/lib/harness.mjs decodeBuildOverlay or contributor.ts overlayContributor. Rule a repair must hold: an overlay narrowing that a  ([source](../evidence/WO-076/decisions.md#wo-076-d008))
- FUP-d72bf62d3c82ca3f (deferred): WO-076-D007: Planning, with FUP-44639ec9a751d8d1: the next order that edits harness emit or either hand-written floor. Rule a repair must hold: a build: none emit leaves an operating contract that nam ([source](../evidence/WO-076/decisions.md#wo-076-d007))
- FUP-da471832071118c7 (deferred): WO-176-D029: Next order editing scripts/release.mjs ensureExistingRelease or retained close history (priority medium): reproduce publication with material blocking cleanup, then move origin/main with  ([source](../evidence/WO-176/decisions.md#wo-176-d029--deferred-release-retry-and-history-contract))
- FUP-dc79b4b1065bf66e (deferred): WO-203-D004: If a future compiler or harness change exposes an authoritative incoming generated-path inventory before atomicBuild, use it in the update preflight to reject absent still-carried compile ([source](../evidence/WO-203/decisions.md#wo-203-d004--carry-in-dispositions-and-the-remaining-pre-build-bound))
- FUP-e62c63344f52405f (deferred): WO-171-D007: scripts/lib/stash-drop.mjs: a stopped drop leaves states a rerun cannot pass without the operator. They are the three lock files, a recovery snapshot that no longer matches once the reflo ([source](../evidence/WO-171/decisions.md#wo-171-d007--what-a-stopped-apply-resumes-from-one-repair-and-what-stays-boarded))
- FUP-f2d7c420e0778cbe (deferred): WO-188-D046: Publication nested-link normalization: handle nested rendered image ranges and prevent removing an inner link wrapper from exposing an unresolved outer link. Compare the parser's rendered ([source](../evidence/WO-188/decisions.md#wo-188-d046--verification-follow-up-rewriting-a-nested-destination-can-expose-another-rendered-link))
- FUP-f82660a8edb23a4d (deferred): WO-072-D008: WO-072 follow-up (operator flow, output accuracy). In scripts/lib/target-worktrees.mjs registeredOrder and the no-selection branch of scripts/resume.mjs run: when the selected launchpad's ([source](../evidence/WO-072/decisions.md#wo-072-d008--verification-pass-ver-001-f1-and-f2-repaired-the-targets-no-selection-message-is-a-follow-up))
- FUP-fb2a080cc9b597d0 (deferred): WO-188-D003: A bare repository, or an unreadable nested repository outside the control and intake lanes whose directory holds no other file, is invisible to the ls-files inventory and leaves with the  ([source](../evidence/WO-188/decisions.md#wo-188-d003--item-1-a-nested-repository-outside-intake-is-scratch-unless-the-tracked-tree-declares-it-the-close-removes-it-and-records-its-head))
- FUP-0674090dc3c1e64d (untriaged): WO-210-D042: Next order that edits these surfaces, low priority. (A1) scripts/lib/target-worktree-close.mjs: when a stale entry holds the base and the local base already contains the order branch,… ([source](../evidence/WO-210/decisions.md#wo-210-d042--final-review-pass-final-003-six-low-follow-ups-boarded-none-breaks-a-behavior-main-had))
- FUP-d8297b92b32c8304 (untriaged): WO-215-D018: WO-215 next repair, or the planning pass that disposes of these rows. (FU1, reopening D013) When a retained starter-refresh cleanup record names a checkout that no longer exists or is no  ([source](../evidence/WO-215/decisions.md#wo-215-d018--verification-pass-ver-001s-findings-are-repaired-and-two-follow-ups-are-boarded))
- FUP-eee6c2fa1ef76215 (untriaged): WO-215-D013: Complete the bounded follow-up class in the touched refresh and registry surfaces. Pending would-refresh and cleanup rows use preview; genuinely current rows retain current. Dry-run clean ([source](../evidence/WO-215/decisions.md#wo-215-d013--repair-pending-previews-preserve-cleanup-ownership-and-name-receipt-provenance))
- FUP-fd6bb22a13e561e4 (untriaged): WO-210-D040: VER005-DOC-1: When next editing scripts/kit/README.client.md First steps recovery, place the recorded-phase confirmation after stash restoration in wo-001, or explicitly describe the… ([source](../evidence/WO-210/decisions.md#wo-210-d040--verification-board-the-pre-restoration-status-instruction))

**Design (scope discipline):** one batch per subsystem, so verification
judges one set of surfaces and one Preflight line, and each batch's
executor holds one context. Each row is read at its source, reproduced or
restated against the current source, then fixed with a case or declined
with its reason; the register disposition is the record, applied through
the checked `--apply` route, never prose. A row the executor cannot decide
within this order's surfaces (an authority the operator holds, a product
choice the operator reserved) leaves as an operator packet, deferred with a
reopening condition naming this order's pull request. Rejected: one order
for all 130 rows (axis: one subsystem per order; a verifier reading fifty
surfaces); leaving the rows to the next order that edits each surface (axis:
delivery; the record shows 32 rows that no later order took);
resolving by declining (axis: honesty of the triage; at most one third of
the listed rows may be declined, and each decline carries its NoOp reason
and reversal condition).

**Deliverables:** the fixes and cases of the steps; the register
dispositions; the decisions and README; write-backs where a fix changes a
product statement.

**Acceptance criteria (all required)**

1. For every row id listed above, `npm run plan -- followups --show <id>`
   reports a latest disposition recorded at or after this order's
   activation with status `settled`, `declined` or `deferred`; a
   `deferred` one names this order's pull request in `reopenWhen` and an
   operator packet of the same id in `docs/evidence/WO-218/handoff.md`;
   no listed row is `untriaged`, `open` or `allocated`.
2. Every `settled` row's disposition reason names a decision in
   `docs/evidence/WO-218/decisions.md` whose `evidence` names the
   fixture file and case name that fails without the fix, and that case
   runs under a suite the Preflight line names; or, for a row the current
   source already meets, names the command run and its output.
3. Every `declined` row's disposition reason records what harm exists now,
   the evidence read and the reversal condition; the declined rows are at
   most one third of the rows listed.
4. `npm run plan -- followups --touching` over this order's changed files
   (its default, from the worktree) lists no row that was pending at this
   order's activation.
5. The README holds the before and after tables of step 1 and the
   after-table step, with the register's pending count before and after.
6. Write-backs land in place where a fix changed a product statement
   (step 19); `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; each re-mint and, where a judged
   source changed, the live feedback episode recorded.

**Preflight:** `launchpad`, `launchpad-planning`, `target-worktree`, `target-publish`, `release`, `worktree`, `worktree-integration`, `siblings-fixtures`, `harness` and `publication`, each as `npm test -- --only <suite>` under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources, and `npm run test:docs` when a document changes; then the
handoff gate the executor's role text names at the base.

**Execution plan (the executor follows these steps in order; observed at `7b8206f4`, 2026-10-17):**

1. `docs/evidence/WO-218/README.md` (new): at the base, each listed row's id, its latest disposition and date, the surfaces it names and the commands the executor ran to reproduce it, written before any fix. Check: the README lists every row of this order.
2. the surfaces the row's decision names (rows FUP-0804477ea9d640a7, FUP-09a2fb517f0ffbc4, FUP-3a0c4ea52f8d6d08, FUP-406744f5e9966250, FUP-44639ec9a751d8d1, FUP-5c2082d9fc28dbbf, FUP-847826d3542ff249, FUP-a859aa6cad8f9c6c, FUP-cf950d70e66c50bf, FUP-d72bf62d3c82ca3f, FUP-dc79b4b1065bf66e, FUP-f2d7c420e0778cbe, FUP-fb2a080cc9b597d0, FUP-d8297b92b32c8304, FUP-eee6c2fa1ef76215): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
3. `scripts/release.mjs` (rows FUP-8cfd3ff52146a016, FUP-cc27c2c1a82fed2c, FUP-da471832071118c7): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
4. `scripts/lib/harness.mjs` (rows FUP-620f25409f65f4aa, FUP-d5d0ef5cf034102e): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
5. `scripts/lib/contributions.mjs` (rows FUP-06de60fa5d19fe5a): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
6. `docs/evidence/WO-111/seed.mjs` (rows FUP-785f679912b2f36c): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
7. `scripts/lib/config.mjs` (rows FUP-815e8662408881f1): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
8. `docs/product/04-interfaces.md` (rows FUP-94f789b2dcdd30e7): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
9. `scripts/lib/harness-runtime.mjs` (rows FUP-9d397b57910ae6ed): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
10. `scripts/launchpad.mjs` (rows FUP-aa129ef63aeef2b1): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
11. `scripts/check-publication.mjs` (rows FUP-acdc329e47638889): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
12. `scripts/lib/meta.mjs` (rows FUP-c9dc1abccd1f1a9d): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
13. `scripts/lib/stash-drop.mjs` (rows FUP-e62c63344f52405f): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
14. `scripts/lib/target-worktrees.mjs` (rows FUP-f82660a8edb23a4d): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
15. `scripts/lib/target-worktree-close.mjs` (rows FUP-0674090dc3c1e64d): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
16. `scripts/kit/README.client.md` (rows FUP-fd6bb22a13e561e4): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
17. `docs/evidence/WO-218/decisions.md`: one decision per disposed row or per cluster of rows fixed together, each naming the row ids, the chosen option, the rejected option, the fixture case or the decline reason, and the reversal condition; an operator packet for each row only the operator can decide, with its reopening condition naming this order's pull request. Then `npm run meta`. Check: `npm run meta -- --check`.
18. `docs/evidence/WO-218/README.md`: the after table (each row's final status, the case or reason, the command) and the register's pending count before and after (`npm run plan -- followups`). Check: the README holds both tables.
19. Write-backs, in place, only where a row's fix changes what a product document states (the row's source decision names the document and section; re-read the heading at the base). Check: `npm run test:docs`.
20. Handoff: `npm run format`; `npm run test:docs`; the gate the executor's role text names at the base (the order's Preflight suites, then the handoff gate; `npm test -- --review` where a declared machinery source changed); complete `docs/evidence/WO-218/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Evidence gate:** the Preflight suites; the register dispositions
(`followups --show` per row); `npm run test:docs`; the handoff gate.
No model run.

**Write-back duty:** criterion 6 and the write-backs step.

**Known issues and carry-ins:**

- Every listed row is a carry-in by id; the source decisions are the
  authority on what each asks.
- A row that another batch's fix resolves first is settled here by
  reference to that batch's decision, with the command that shows it.
- Line numbers and paths in the rows are observed at their own dates; the
  executor re-reads at its base.

**Non-goals:** candidate rows of the register (ideas with reopening
conditions, 151 at the base), which planning disposes; rows of the other
three batches; new features beyond what a row asks; rewriting any filed
report.

**Operator-review assumptions**

1. At most one third of a batch's rows may be declined.
2. A row only the operator can decide leaves as an operator packet rather
   than blocking the batch.
3. The four batches sit after WO-216 and before WO-080; the operator may
   interleave them with the focus orders.
