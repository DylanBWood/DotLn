# WO-218 — Boarded follow-ups, batch 2: the instance lifecycle, export and kit, publication, release close, the starter, worktrees and the target-order lifecycle: every one of the 45 register rows listed below is fixed with a fixture case or declined with its recorded reason, the register shows it, and a row only the operator can decide leaves as an operator packet (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** assigned at activation from the fixes made (patch
unless a fix changes a command, flag, schema or refusal, which the decisions
name; then minor). A declined row changes no behavior.
**Cost:** adds the fixes and fixture cases the listed rows need, across
`scripts/launchpad.mjs`, `scripts/lib/target-worktree-close.mjs`, `scripts/lib/target-worktrees.mjs`, `scripts/lib/starter-refresh.mjs`, `scripts/release.mjs`, `scripts/check-publication.mjs`, `scripts/lib/harness.mjs`, `scripts/lib/harness-runtime.mjs`, `scripts/lib/config.mjs`, `scripts/lib/stash-drop.mjs`, `scripts/worktree.mjs`, `scripts/kit/README.client.md`, and for the rows the 2026-10-19 pass added `packages/skeleton/src/harness-host.ts` (`registeredTargetAdmission` only), `scripts/lib/target-publish.mjs`, `scripts/lib/git.mjs`, `scripts/lib/gate-reuse.mjs`, `scripts/test-verifier-gate-claims.mjs`, `scripts/lib/dependencies.mjs`, `scripts/resume.mjs` (the status projection) and `scripts/lib/outward-lint.mjs`, for the rows the 2026-10-19 fork-requests pass added `scripts/lib/release-preparation.mjs` (`planReleasePreparation`'s local observation) beside `scripts/release.mjs` (`ancestralLocalTags`, `releaseBlockRule`, `publishTargetRelease`), `scripts/lib/config.mjs` (`validateRepositoryRelease`, the disposable declaration) and the base judgment of `scripts/lib/target-worktree-close.mjs`, and the fixtures the rows name; unknown until each row is triaged, and the README records
the per-row command and case. Removes 45 pending rows from the
register, which at the base holds 281 pending rows, 130 of them decision
rows boarded by closed orders across 53 orders (the oldest from WO-054,
2026-09-18), 88 of them follow-ups boarded in the week of 2026-10-13 to
2026-10-17 alone; the rule that "the next order that edits the surface"
takes a row delivered none of these 32 (each still pending at
`7b8206f4`). Wall-clock: one triage per row plus the fixes; unknown until
run. Context bytes: this order's row list is read once. Commands: none
added. Tokens: unknown until run. Steps: 31. Re-mints: the
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
the register's own excerpts. Amended by the 2026-10-19 standard pass
([planning document](../planning/standard-pass-2026-10-19.md) §5 and §6):
WO-221's seven boarded rows, holding 33 findings on the target-order
lifecycle this batch owns, and three kit defects the operator's instance
recorded in its 2026-10-18 planning document. Amended again by the
2026-10-19 fork-requests pass ([planning document](../planning/fork-requests-2026-10-19.md)
§5): three kit needs from the fork's 2026-10-19 planning document,
carried by the operator. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: repository records and the
fork's committed planning document only.
**Depends on:** WO-222 closed, v0.86.0 (reference only: its scheduler is the gate this batch's handoff runs under; no hard edge); moved to the head of the batches by the 2026-10-19 fork-requests pass (§8).
**Recommended placement:** position 1 of the serial queue, before WO-217 (the 2026-10-19 fork-requests pass §8: the fork's blocker and the surfaces its next orders cross); the operator may interleave the four batches with the focus orders by one sequence edit.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-222",
    "relation": "reference-only",
    "reason": "closed before this batch; its scheduler is the gate this batch's handoff runs under; no hard edge"
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

**Added by the 2026-10-19 pass (main at `f577979e`):** WO-221 closed on
2026-10-19 (v0.85.0) and boarded seven rows holding 33 findings on the
target-order lifecycle, the subsystem it built and this batch owns; the
operator's instance recorded three kit defects in its 2026-10-18 planning
document (§10 of that document, read on the operator's machine). The two
review rows carry their findings by number: FUP-3a4c476e4e8099bd holds
FINAL-001's F2 to F9 and F12 to F18 (F2 to F5 and the hook half of F12 in
`registeredTargetAdmission`; F6, F7, F8 and F17 in `scripts/release.mjs`;
F9 and the draft half of F12 in `scripts/lib/target-publish.mjs`; F13 to
F16 in the literal fallback across `scripts/lib/target-worktrees.mjs`,
`scripts/worktree.mjs` and `scripts/harness.mjs`; F18 in
`scripts/lib/starter-refresh.mjs`), and FUP-f64c4d8ab41f49d4 holds
FINAL-002's F1 to F13 (F1, F2, F3 and F5 in
`scripts/lib/target-worktree-close.mjs`; F4 in `starter-refresh.mjs`; F6,
F7 and F9 in `registeredTargetAdmission`; F8 in `target-worktrees.mjs`;
F10 and F13 in `target-publish.mjs`; F11 in `scripts/lib/gate-reuse.mjs`;
F12 in `scripts/test-verifier-gate-claims.mjs`). The ten rows:

- FUP-3a4c476e4e8099bd (deferred): WO-221-D038: FINAL-001 follow-ups for the WO-221 repair within the boy-scout bound, else for the next order that edits the named surface, each with a fixture that fails without the fix: withhold the… ([source](../evidence/WO-221/decisions.md#wo-221-d038--final-review-fail-final-001-at-the-integrated-subject-the-base-ignore-judgment-dies-on-a-populated-ignored-tree-and-nineteen-follow-ups-are-boarded))
- FUP-f64c4d8ab41f49d4 (untriaged): WO-221-D045: FINAL-002 follow-ups for the next order that edits the named surface, each with a fixture that fails without the fix: name each undeclared ignored base path by its full path, or by its… ([source](../evidence/WO-221/decisions.md#wo-221-d045--final-review-pass-final-002-at-the-integrated-subject-the-base-refusals-nested-path-naming-leads-thirteen-boarded-follow-ups))
- FUP-309c72a92ff260ce (untriaged): WO-221-D036: Literal-fallback follow-up VER-002 F2: validate .claude/settings.local.json and the order's sidecar before the first irreversible step of worktree start and release close, name the file… ([source](../evidence/WO-221/decisions.md#wo-221-d036--ver-002-follow-up-a-malformed-operator-settings-file-strands-start-and-close-after-their-irreversible-steps))
- FUP-fb62261f3877a5cb (untriaged): WO-221-D035: Literal-fallback follow-up VER-002 F1: a per-order Codex rules file must not make main unclean for worktree start. Ignore or excuse only DotLn-owned per-order rules files, for example… ([source](../evidence/WO-221/decisions.md#wo-221-d035--ver-002-follow-up-a-literal-fallback-order-leaves-main-unclean-for-the-next-start))
- FUP-cb738250f386b071 (untriaged): WO-221-D041: Next order editing scripts/lib/target-worktree-close.mjs or scripts/lib/git.mjs: when a path-list read overflows its buffer, refuse with a bounded message naming the checkout by role,… ([source](../evidence/WO-221/decisions.md#wo-221-d041--ver-003-follow-up-past-the-16-mib-candidate-ceiling-the-base-refusal-echoes-the-captured-path-list))
- FUP-4c9a576536de99ff (untriaged): WO-221-D042: Next order editing scripts/lib/target-worktree-close.mjs: before deleting declared output in either checkout, check write and search access on every directory that holds a listed file,… ([source](../evidence/WO-221/decisions.md#wo-221-d042--ver-003-follow-up-an-unwritable-declared-directory-stops-the-close-with-a-raw-error-after-part-of-the-declared-output-is-gone))
- FUP-f32886b04703d3db (untriaged): WO-221-D040: Take FINAL-001 F10, F11, F19 and F20 as the single bounded adjacent-0002 item. The scratch ignore repository disables init templates and global excludes, so only fetched .gitignore blobs… ([source](../evidence/WO-221/decisions.md#wo-221-d040--bounded-close-safeguards-and-truthful-deadline-text-remaining-review-findings-stay-boarded))
- FUP-3c5f5a2bdbe06c07 (untriaged): A target order's moved records still named by the status projection. ([source](../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19))
- FUP-47eb4d9bdf4cbfa1 (untriaged): Core's historical order ids hard-coded in the kit. ([source](../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19))
- FUP-98aeb43c543dfbaf (untriaged): The outward lint's title shape and a leading gitmoji in an instance. ([source](../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19))

**Added by the 2026-10-19 fork-requests pass (main at `f0c3f5f6`):** three
kit needs the operator's instance recorded in its 2026-10-19 planning
document (§10, carried by the operator into core's dispatch), each a
candidate of the map's fork-requests section with the code it names read
by that pass:

- FUP-806a8fccc51377b7 (untriaged): A display name for a declared target release. ([source](../planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass))
- FUP-a9fdacb0bbcdb97a (untriaged): The starter's core-named tags in an instance's local baseline. ([source](../planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass))
- FUP-4c243998cedd4597 (untriaged): A judge-only option for the base checkout at close. ([source](../planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass))

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
and reversal condition). A row that carries several findings (the two
WO-221 review rows) is settled when each finding has its case or its
recorded decline, the decision listing them per finding.

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
   (its default, from the worktree) lists no row of this order's list that
   is still pending; a row of another batch or a candidate row it lists is
   left as it is and named in the README (rewritten by the 2026-10-19 pass
   from receipt 046's known issue).
5. The README holds the before and after tables of step 1 and the
   after-table step, with the register's pending count before and after.
6. Write-backs land in place where a fix changed a product statement
   (step 30); `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; each re-mint and, where a judged
   source changed, the live feedback episode recorded.

**Preflight:** `npm test -- --only launchpad` and `npm test -- --only launchpad-planning` for the launchpad and kit steps;
`npm test -- --only target-worktree` and `npm test -- --only target-publish` for the target steps;
`npm test -- --only release` and `npm test -- --only siblings-fixtures` for the release-close and starter steps;
`npm test -- --only worktree` and `npm test -- --only worktree-integration` for the worktree steps;
`npm test -- --only harness` and `npm test -- --only publication` for the harness and publication steps;
`npm test -- --only harness-fixtures` for the admission step;
`npm test -- --only runner-fixtures` and `npm test -- --only resume` for the gate-claim and status-projection steps;
`npm test -- --only work-orders-fixtures` for the dependencies step;
`npm test -- --only outward-lint` for the lint step;
`npm test -- --only release-preparation` for the starter-tag step (with `release`, `siblings-fixtures` and `launchpad-planning` above);
`npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then the handoff gate the executor's role text names at
the base (explicit tokens added by the 2026-10-18 pass, FUP-17266e5072d4a25a).

**Execution plan (the executor follows these steps in order; observed at `7b8206f4`, 2026-10-17; steps 17 to 24 added by the 2026-10-19 pass, observed at `f577979e`):**

1. `docs/evidence/WO-218/README.md` (new): at the base, each listed row's id, its latest disposition and date, the surfaces it names and the commands the executor ran to reproduce it, written before any fix. Check: the README lists every row of this order.
2. the surfaces the row's decision names (rows FUP-0804477ea9d640a7, FUP-09a2fb517f0ffbc4, FUP-3a0c4ea52f8d6d08, FUP-406744f5e9966250, FUP-44639ec9a751d8d1, FUP-5c2082d9fc28dbbf, FUP-847826d3542ff249, FUP-a859aa6cad8f9c6c, FUP-cf950d70e66c50bf, FUP-d72bf62d3c82ca3f, FUP-dc79b4b1065bf66e, FUP-f2d7c420e0778cbe, FUP-fb2a080cc9b597d0, FUP-d8297b92b32c8304, FUP-eee6c2fa1ef76215): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
3. `scripts/release.mjs` (rows FUP-8cfd3ff52146a016, FUP-cc27c2c1a82fed2c, FUP-da471832071118c7; FUP-3a4c476e4e8099bd for F6, F7, F8 and F17 in `publishTargetRelease` and `releaseCloseSummary`; FUP-f32886b04703d3db for the unavailable-advisory line of `releaseCloseSummary`): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
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
14. `scripts/lib/target-worktrees.mjs` and `scripts/worktree.mjs` (rows FUP-f82660a8edb23a4d; FUP-3a4c476e4e8099bd for F13 to F16 in `codexRulesText`, `hostRuleTable`, `writeOrderHostRules`, `removeOrderHostRules` and `host-rules --rewrite`, with the swallowed stale-rule failure in `scripts/harness.mjs`; FUP-f64c4d8ab41f49d4 for F8; FUP-309c72a92ff260ce's start half and FUP-fb62261f3877a5cb): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
15. `scripts/lib/target-worktree-close.mjs` (rows FUP-0674090dc3c1e64d; FUP-f64c4d8ab41f49d4 for F1, F2, F3 and F5; FUP-cb738250f386b071 with `scripts/lib/git.mjs` (`runGitPathList`, `failureOf`); FUP-4c9a576536de99ff (`deleteDisposable`); FUP-f32886b04703d3db (the null-advisory aggregation D043 reopened); FUP-309c72a92ff260ce's close half): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
16. `scripts/kit/README.client.md` (rows FUP-fd6bb22a13e561e4): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
17. `packages/skeleton/src/harness-host.ts` (`registeredTargetAdmission`; rows FUP-3a4c476e4e8099bd for F2 to F5 and the hook half of F12, FUP-f64c4d8ab41f49d4 for F6, F7 and F9): read each finding at its source decision, reproduce it with the saved admission probe (`docs/evidence/WO-221/verification-001/admission.mjs`) or a new case in `scripts/test-harness.mjs`, then fix it (an entry without an origin withheld; the helper admission bound to its closure or to the node spelling alone; the registered authority profile judged as the publish helper judges it; the effective push URL judged; the admitted entry read from main's registry and bound to the clone map; `--repo` required on every gh form; the registry and publication paths resolved through the control root; `--body-file` realpathed with ignored and intake paths refused) with a case that fails without the fix, or decline it with the recorded reason. Check: `npm test -- --only harness-fixtures`, under `node scripts/harness.mjs bounded --`.
18. `scripts/lib/target-publish.mjs` (`publishTargetDraft`, `publishBoundTargetCommit`; rows FUP-3a4c476e4e8099bd for F9 and the draft half of F12, FUP-f64c4d8ab41f49d4 for F10 and F13): a deterministic draft commit or the pushed head recorded before gh runs; the draft reuse refused when the recorded repository differs from the current origin; a moved draft head refused naming the branch, the recorded head, the pull request and the remedy; each with its case. Check: `npm test -- --only target-publish`, under `node scripts/harness.mjs bounded --`.
19. `scripts/lib/starter-refresh.mjs` (`ensureSiblingRelease`; rows FUP-3a4c476e4e8099bd for F18, FUP-f64c4d8ab41f49d4 for F4): the gh preflight before the tag push, the refresh commit tagged in the already-current branch, the tag and Release previewed in a dry run, an existing sibling tag judged against the commit to be published before the push; each with its case. Check: `npm test -- --only siblings-fixtures` and `npm test -- --only release`, under `node scripts/harness.mjs bounded --`.
20. `scripts/lib/gate-reuse.mjs` (`latestExecution`, `decidingPass`, `preflightRows`) and `scripts/test-verifier-gate-claims.mjs` (rows FUP-f64c4d8ab41f49d4 for F11 and F12): a passing partial structural row no longer displaces a full row's pass and the remedy names the missing row; the negative final-review cases built from the same suite list as the passing one so each refusal depends on the property it names. Check: `npm test -- --only runner-fixtures` and `npm test -- --only resume`, under `node scripts/harness.mjs bounded --`.
21. `scripts/lib/dependencies.mjs` (`historicalDependencyIds`) and `scripts/work-orders.mjs` (rows FUP-47eb4d9bdf4cbfa1): the historical set read from the instance's configuration or its own closed orders, with a kit fixture whose instance holds neither WO-001 nor WO-002. Check: `npm test -- --only work-orders-fixtures` and `npm test -- --only launchpad-planning`, under `node scripts/harness.mjs bounded --`.
22. `scripts/resume.mjs` (the status projection and `target-records`; rows FUP-3c5f5a2bdbe06c07): a moved report resolved through the target record in `status --json` and `docs/control/current.md`, with a case that moves a fixture target order's reports and reads both. Check: `npm test -- --only resume` and `npm test -- --only launchpad-planning`, under `node scripts/harness.mjs bounded --`.
23. `scripts/lib/outward-lint.mjs` (rows FUP-98aeb43c543dfbaf): reproduce the fork's refusal of a title that opens with a gitmoji in a kit fixture; align the rule with core's own titles, or decline with the output that shows the fork's reading. Check: `npm test -- --only outward-lint`, under `node scripts/harness.mjs bounded --`.
24. `scripts/lib/config.mjs` (`validateRepositoryRelease`) and `scripts/release.mjs` (`publishTargetRelease`; row FUP-806a8fccc51377b7): admit `repositories.<id>.release.displayName` with the launchpad's shape and limit (`validReleaseDisplayName`, 64 characters, the same refusal text), defaulting to the registration id; the Release title becomes `<displayName> <tag>` and the tag message's first line the same, the order's title and the close line following as today; the `--dry-run` preview and the receipt print the title; a case in the split target-worktree release file for the configured and the default name, and a configuration case for the limit. Check: `npm test -- --only target-worktree`, `npm test -- --only release` and `npm test -- --only configuration-root`, under `node scripts/harness.mjs bounded --`.
25. `scripts/release.mjs` (`ancestralLocalTags`, the local form of `releaseBlockRule`), `scripts/lib/release-preparation.mjs` (the `local tags` observation) and `scripts/kit/README.client.md` §Taking upstream updates (row FUP-a9fdacb0bbcdb97a): a tag the starter refresh wrote (the annotated tag object whose message opens `Starter <tag>` with a `Core commit:` line, `ensureSiblingRelease` in `scripts/lib/starter-refresh.mjs`) is never an instance's local baseline, in `check-surfaces --local`, the instance's document gate and `release prepare --local`; the README's update route fetches with `--no-tags`, says to set `remote.upstream.tagOpt` once, and previews a named starter release through a non-tag ref; a kit fixture whose instance holds a starter tag reachable from HEAD above its own latest tag passes both commands at its own tag, and a case that a tag with another message still counts. Check: `npm test -- --only release`, `npm test -- --only release-preparation`, `npm test -- --only siblings-fixtures` and `npm test -- --only launchpad-planning`, under `node scripts/harness.mjs bounded --`.
26. `scripts/lib/target-worktree-close.mjs` (the base judgment, lines 369 to 426 and 497 at `f0c3f5f6`) and `scripts/lib/config.mjs` (the disposable declaration; row FUP-4c243998cedd4597): a registration option that keeps the base checkout's judgment (undeclared ignored material still refuses with the registration remedy) and deletes nothing there, the default unchanged; `release close --dry-run`, the receipt and the role text say which policy applied; a case per policy, both showing the target worktree's declared output deleted. Check: `npm test -- --only target-worktree` and `npm test -- --only configuration-root`, under `node scripts/harness.mjs bounded --`.
27. `docs/evidence/WO-218/README.md`: the per-finding table for the two WO-221 review rows (each finding, its surface, its case or its decline), kept beside the per-row tables of steps 1 and 29. Check: the README lists all 33 findings.
28. `docs/evidence/WO-218/decisions.md`: one decision per disposed row or per cluster of rows fixed together, each naming the row ids, the chosen option, the rejected option, the fixture case or the decline reason, and the reversal condition; an operator packet for each row only the operator can decide, with its reopening condition naming this order's pull request. Then `npm run meta`. Check: `npm run meta -- --check`.
29. `docs/evidence/WO-218/README.md`: the after table (each row's final status, the case or reason, the command) and the register's pending count before and after (`npm run plan -- followups`). Check: the README holds both tables.
30. Write-backs, in place, only where a row's fix changes what a product document states (the row's source decision names the document and section; re-read the heading at the base). Check: `npm run test:docs`.
31. Handoff: `npm run format`; `npm run test:docs`; the gate the executor's role text names at the base (the order's Preflight suites, then the handoff gate; `npm test -- --review` where a declared machinery source changed); complete `docs/evidence/WO-218/handoff.md`; `npm run resume -- implementation-ready <flags>`.

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
- The two WO-221 review rows carry 15 and 13 findings; each row is settled
  when every finding has its case or its recorded decline, and the decision
  lists them per finding (step 24's table).
- `harness-host.ts` is a registered source of the authority, feedback and
  harness editions (`scripts/lib/evidence-sources.mjs`), so the admission
  step re-mints each staled edition deterministically; receipt 047 read
  `FEEDBACK_SOURCE_PATHS` as naming none of these surfaces, which the
  executor re-reads at its base. WO-219 edits the same file after this
  batch and rebases on it.
- From receipt 046 (2026-10-17), moved here from the catalog row by the
  2026-10-19 pass: the compiled subject carries no row ids, so the refuter
  judged the batch's gate without them (criterion 1); this batch is the one
  WO-083 and WO-207 run through, so the README names which rows WO-083's
  run would hit (criterion 1); the inflow continues while the stock is taken
  (criterion 1); the decline cap is a quota, not a merit test (criterion 3);
  a fix in `scripts/release.mjs`, `scripts/check-publication.mjs` or
  `scripts/lib/target-worktree-close.mjs` leaves every existing refusal at
  least as strong (the monotone envelope, WO-042; criterion 2); criterion
  4's original form could not be met, and the 2026-10-19 pass rewrote it.
- The fork's three kit rows (FUP-3c5f5a2bdbe06c07, FUP-47eb4d9bdf4cbfa1,
  FUP-98aeb43c543dfbaf) are the operator's instance's reports, read from
  its committed planning document; a row the base does not reproduce is
  declined with the output that shows it.
- The three rows of the 2026-10-19 fork-requests pass: the display name
  names a Release title and a tag message, never a tag name, and a Release
  published before the key keeps its title (the kit never edits a
  published Release); the starter-tag rule reads the tag object the kit
  wrote, so a tag renamed or re-tagged by hand is outside it, and the
  instance's document gate runs `check-surfaces --local` on every run
  (`scripts/test-runner.mjs`), so the fixture runs that gate; the
  judge-only option keeps every refusal of the base judgment (the monotone
  envelope, WO-042) and changes only the deletion. The fork deleted the
  starter's v0.85.0 tag by hand on 2026-10-19 and the starter now also
  carries v0.86.0; the fork's next `git fetch upstream` without the remote
  option takes it again (an inference from the code).

**Non-goals:** candidate rows of the register (ideas with reopening
conditions, 151 at the base), which planning disposes; rows of the other
three batches; new features beyond what a row asks; rewriting any filed
report.

**Operator-review assumptions**

1. At most one third of a batch's rows may be declined.
2. A row only the operator can decide leaves as an operator packet rather
   than blocking the batch.
3. The four batches sit after WO-222 and before WO-080; the operator may
   interleave them with the focus orders.
4. WO-221's follow-ups are this batch's rows because the target-order
   lifecycle is its subsystem; the admission findings edit
   `registeredTargetAdmission` in `harness-host.ts` before WO-219 runs.
5. The three rows of the 2026-10-19 fork-requests pass are the operator's
   instance's requests of 2026-10-19, read from the operator's paste and
   the fork's committed document; the display name reaches the fork
   through the starter refresh at this batch's close and the fork's own
   update pull request, and the fork declares DotLn-Angular's releases
   only then (its D4).
