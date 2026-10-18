# WO-217 — Boarded follow-ups, batch 1: the gate, the runner, the host guard, gate evidence and the fixtures: every one of the 35 register rows listed below is fixed with a fixture case or declined with its recorded reason, the register shows it, and a row only the operator can decide leaves as an operator packet (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** assigned at activation from the fixes made (patch
unless a fix changes a command, flag, schema or refusal, which the decisions
name; then minor). A declined row changes no behavior.
**Cost:** adds the fixes and fixture cases the listed rows need, across
`scripts/test-runner.mjs`, `scripts/lib/gate-reuse.mjs`, `scripts/lib/host-guard-state.mjs`, `scripts/host-guard.mjs`, `scripts/lib/machinery-coverage.mjs`, `packages/skeleton/src/observed-facts.ts`, `packages/skeleton/src/gate-evidence.mjs`, `scripts/lib/product-read-guard.mjs` and the fixtures the rows name; unknown until each row is triaged, and the README records
the per-row command and case. Removes 35 pending rows from the
register, which at the base holds 281 pending rows, 130 of them decision
rows boarded by closed orders across 53 orders (the oldest from WO-054,
2026-09-18), 88 of them follow-ups boarded in the week of 2026-10-13 to
2026-10-17 alone; the rule that "the next order that edits the surface"
takes a row delivered none of these 35 (each still pending at
`7b8206f4`). Wall-clock: one triage per row plus the fixes; unknown until
run. Context bytes: this order's row list is read once. Commands: none
added. Tokens: unknown until run. Steps: 15. Re-mints: the
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
**Depends on:** WO-216 merged (reference only: its structural phase and handoff rule are the gate this order's own handoff runs under; no hard edge).
**Recommended placement:** position 2 of the serial queue, after WO-216; the operator may interleave the four batches with the focus orders by one sequence edit.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-216",
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
the pending count rose from 247 to 281. The 35 rows of this
batch name the gate, the runner, the host guard, gate evidence and the fixtures:

- FUP-04ec9fa011f39d93 (deferred): WO-144-D010: Planner: (1) Executor and verifier procedure runs npm test without --review, which omits the machinery suites whose declared sources an order changed; here process-debt declares harness-h ([source](../evidence/WO-144/decisions.md#wo-144-d010--pass-final-review-after-an-in-review-test-repair-board-the-unrun-suite-and-two-width-edges))
- FUP-079f827e1b11eb1e (deferred): WO-188-D006: gateTreeHash refuses a subject that holds a committed submodule ('Submodule gate evidence needs an explicit adapter'), so an order that commits a gitlink cannot run its gate; gateCodeIden ([source](../evidence/WO-188/decisions.md#wo-188-d006--item-4-no-forced-removal-over-a-submodule-already-published-is-carried-a-dirty-derived-worktree-names-the-operator-the-record-exists-before-flags-parse))
- FUP-0c10689747f83675 (deferred): WO-186-D033: Repair R2 in the product read guard and settle R3 by stating the observed boundary. The guard now sees each call's options: at the repository root or an ancestor it records an own-record  ([source](../evidence/WO-186/decisions.md#wo-186-d033--repair-the-read-guards-root-and-ancestor-walks-state-the-copy-and-shell-boundary))
- FUP-0e424834e4030880 (deferred): WO-140-D001: Planner: WO-140's cost paragraph and criterion 3 say one of WO-121 VER-001's in-sandbox suite failures was the .claude/hooks/ denial; the receipt shows skeleton's nested sandbox-exec, and ([source](../evidence/WO-140/decisions.md#wo-140-d001--declare-from-the-receipts-skeleton-only-the-hooks-denial-is-the-probe-not-a-suite-cause))
- FUP-4475529d727a4d25 (deferred): WO-142-D009: Route corpus/mutation/mutate.mjs and corpus/harness/generator-runtime.mjs through the shared isMainModule realpath helper, with the existing symlink fixture pattern. Priority: low, becaus ([source](../evidence/WO-142/decisions.md#wo-142-d009--board-up-two-lexical-module-entry-guards-outside-row-a13s-ten-scripts))
- FUP-5094b24d6d68d2e4 (deferred): WO-186-D047: Planning, low priority, with the next order that opens the runner's case timing, the gate index reader or the product read guard: (1) make the integration and harness case-ended reports r ([source](../evidence/WO-186/decisions.md#wo-186-d047--final-review-pass-at-the-repaired-identity-five-low-items-boarded-with-one-follow-up))
- FUP-511b5a41d831fe83 (deferred): WO-186-D036: Planning weighs the document gate's 66.690 s median (FUP-fb8cbeabbddef397, returned to open at close) against the plain gate's reduction when it next routes document-reading suites, and j ([source](../evidence/WO-186/decisions.md#wo-186-d036--record-the-document-gates-rise-the-lane-peer-growth-and-the-harness-cases-after-median))
- FUP-51c310284c2fea17 (deferred): WO-168-D018: Planner, low priority, with the next order that edits observed-facts.ts (joined to WO-168-D010's follow-up): drop a contained gate identity only where each of its occurrences in the part  ([source](../evidence/WO-168/decisions.md#wo-168-d018--final-review-pass-and-board-one-hedge-edge-and-two-fixture-observations))
- FUP-5e52eb500e395237 (deferred): WO-186-D038: Planning decides whether findGateCheck and resume correct --set productGate adopt the rule the runner and the completion claim now hold (a complete row answers only while each of its task ([source](../evidence/WO-186/decisions.md#wo-186-d038--board-two-reuse-boundaries-the-repair-leaves-as-they-are))
- FUP-6125f53234c75af3 (deferred): WO-213-D024: Planning: decide whether the release, worktree and license fixtures may configure the committed public author identity scripts/lib/contributions.mjs exports as operatorAuthor or must use… ([source](../evidence/WO-213/decisions.md#wo-213-d024))
- FUP-642d7a4beaed2272 (deferred): WO-188-D045: Runner fixture under load: the scripts/test-runner.test.mjs case 'format preflight stops plain and review before product tasks, and stays fresh across document edits' once recorded a nest ([source](../evidence/WO-188/decisions.md#wo-188-d045--observation-the-runners-format-preflight-fixture-failed-once-under-the-full-review-gate-and-passed-alone))
- FUP-8bac5e3bddd12494 (deferred): WO-198-D021: Planning, with the next pass that judges WO-198's catalog row or WO-197's task-growth rule: the refutation receipt 041 criterion-3 known issue on WO-198 fired. The runner-fixtures fresh t ([source](../evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning))
- FUP-92711a92e1d05874 (deferred): WO-210-D013: Planning: judge criterion:24's reopening condition against these figures and the next counted order's elapsedPerCodeByte. Any reduction keeps every case, as the order's known issue… ([source](../evidence/WO-210/decisions.md#wo-210-d013--verification-the-target-suites-growth-recorded-for-the-planning-receipts-criterion24-condition))
- FUP-94bff00e748a26af (deferred): WO-168-D010: Planner, low priority, with the next order that edits observed-facts.ts: with only the full gate's row in scope, a hedge naming npm test -- --inside-sandbox still resolves to the full gat ([source](../evidence/WO-168/decisions.md#wo-168-d010--item-8-the-stranded-comment-and-the-hedge-match))
- FUP-984094128fe71900 (deferred): WO-200-D005: Assert the formatter's effective exclusion of every collector input. In the comment-labels ignore case (document gate, every run) and the schema pinned-bytes case, resolve each protocolLi ([source](../evidence/WO-200/decisions.md#wo-200-d005--verification-pass-ver-001-board-the-declaration-tests-textual-reading-of-the-formatter-ignore-list-which-a-negation-line-defeats))
- FUP-a566ba26ee9f909a (deferred): WO-191-D013: Planning, low priority: at the next pass, compare this review's fresh document-gate row (1,465.8 s of wall-clock for 223.3 s of task work, recorded 2026-10-11T17:47:41.090Z at code identi ([source](../evidence/WO-191/decisions.md#wo-191-d013))
- FUP-b28b870422a74166 (deferred): WO-174-D013: Planner: decide how product script suites that read excluded tracked inputs keep a reused npm test row true: license-surfaces (docs/LEGAL.md, also caught by release-surfaces in test:docs) ([source](../evidence/WO-174/decisions.md#wo-174-d013))
- FUP-bf51ac5cd8143d98 (deferred): WO-176-D006: Next order editing packages/skeleton/src/gate-evidence.mjs: define the candidate-tree treatment of a protected intake repository directory re-included by .gitignore. Reproduce with a one- ([source](../evidence/WO-176/decisions.md#wo-176-d006))
- FUP-c1a89d52cc314af9 (deferred): WO-185-D014: Decide how a live host guard started from older DotLn code yields to a checkout whose guard rule changed. ensureHostGuard (scripts/lib/host-guard-state.mjs) reuses any live guard regardle ([source](../evidence/WO-185/decisions.md#wo-185-d014--held-descriptor-watches-and-the-recycled-identity-correction))
- FUP-cb5c3b3e7d0b0c0d (deferred): WO-202-D005: Finish the non-default plane/kit root-resolution remainder of FUP-a058e82c0bbd9b6d: resolve the ignored local lane and the tool-root versus launchpad-root distinction for gate-evidence, w ([source](../evidence/WO-202/decisions.md#wo-202-d005))
- FUP-cb922b59e013dbf1 (deferred): WO-123-D017: Planner: nominate an order that keys the harness runtime snapshot on the full import closure of its listed files (or lists every transitive import and checks the list against that closure ([source](../evidence/WO-123/decisions.md#wo-123-d017--boarded-the-harness-runtime-snapshot-misses-unlisted-transitive-imports))
- FUP-cde72b7860c03c18 (deferred): WO-187-D021: Find why scripts/test-off-ramps.mjs's checkpoint correction case (around line 787) can see event 2 carrying refs/dotln/checkpoint/WO-099/1. Run the off-ramps fixture repeatedly in isolati ([source](../evidence/WO-187/decisions.md#wo-187-d021--board-an-intermittent-off-ramps-fixture-failure))
- FUP-d0a9719cc2e4ec55 (deferred): WO-185-D006: Establish complete ownership for descendants through unobserved intermediate exits, including ignored-wrapper bare commands; compare an inheritable ownership mechanism with an authorized  ([source](../evidence/WO-185/decisions.md#wo-185-d006--recorded-survivor-guarantee-limitation))
- FUP-d5605723a86254eb (deferred): WO-187-D023: Set maintenance.auto=false (git config in the fixture repository, or -c maintenance.auto=false on clone) in every test fixture that commits to a temporary Git repository and later removes ([source](../evidence/WO-187/decisions.md#wo-187-d023--guard-the-beacon-portability-fixture-against-gits-detached-repack-and-board-the-sweep))
- FUP-de6162b279f66709 (deferred): WO-187-D043: Make lifecycle recording independent of other worktrees' test lanes: a fail verdict records without waiting on an inline document gate (the met claim is recorded as stated with an advisor ([source](../evidence/WO-187/decisions.md#wo-187-d043--recording-a-verification-result-waits-on-another-worktrees-test-lanes))
- FUP-e18e6a5422109bfb (deferred): WO-118-D011: Machinery planner: a long-lived host guard can lose its guard.json record while it still holds guard.flock (observed 2026-10-13, cause unknown; one candidate is the operating system's cle ([source](../evidence/WO-118/decisions.md#wo-118-d011--repair-dispatch-run-the-witnessed-rerun-and-restore-the-host-guard))
- FUP-e821aa2ced3aa111 (deferred): WO-142-D017: At the next order opening these consumers: select TAP for remaining Node suites started through node() so progress counts appear (O2); replace deprecated openProject aliases in the three  ([source](../evidence/WO-142/decisions.md#wo-142-d017--retain-the-remaining-observation-improvements-with-explicit-scope))
- FUP-e86366edbc1d5289 (deferred): WO-112-D056: Diagnose the unlocalized intermittent WO-115 console-loopback TypeError: fetch failed observed in WO-112 repair 006's first document gate. Add sanitized failing-command and nested-cause d ([source](../evidence/WO-112/decisions.md#wo-112-d056--preserve-the-unlocalized-loopback-failure-and-recheck-the-same-source))
- FUP-e8f5399db33d0b5a (deferred): WO-185-D028: WO-185 residuals (guard and runner bookkeeping): in scripts/host-guard.mjs mark every revalidated-absent or protected member of a stopped candidate as handled, so one pass never writes a  ([source](../evidence/WO-185/decisions.md#wo-185-d028--ver-004-residual-low-severity-observations-in-the-repaired-guard-and-runner-left-with-a-follow-up))
- FUP-eafff4f96686f67d (deferred): WO-213-D025: Planning: decide whether an instance's runtime rows should take a product read guard whose exclusion set is narrowed to the active order's record roots, so an instance's plain gate can… ([source](../evidence/WO-213/decisions.md#wo-213-d025))
- FUP-f5f10101e717d59b (deferred): WO-198-D004: WO-198 resume: fix. (F1) sharedRefChanges must treat a snapshot that lacks originMain, main, a tags object with count and newest, or dotlnRefs as no baseline, the same as a legacy row wit ([source](../evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded))
- FUP-851cba3a914ab359 (untriaged): WO-216-D034: FINAL-002's packet, added by the 2026-10-18 pass: (F1) `worktree finish` applies the runner's `failedOutputOnly` to each copied row's `cases` and `taskTimeline` at every depth, so a close never lands passing output in main's live index (the operator's override of 2026-10-18 stripped 146 rows by hand); (F2) the transition and row-state cases FINAL-001 F17 listed for `scripts/test-verifier-gate-claims.mjs`; (F3) `scripts/sync.mjs` runs a writer only on a stale report and removes or names an orphan revision ([source](../evidence/WO-216/decisions.md#wo-216-d034--final-review-pass-final-002-at-the-integrated-subject-one-operator-packet-and-ten-follow-ups-two-corrected-in-this-review))
- FUP-9de14a69403e2b32 (untriaged): WO-216-D032: declare the five hand-kept copy sites (`scripts/test-configuration-root.mjs` twice, `scripts/test-concurrent-control.mjs`, `scripts/test-harness.mjs` twice) as copied-fixture closures so the structural phase checks them; added by the 2026-10-18 pass ([source](../evidence/WO-216/decisions.md#wo-216-d032--bounded-follow-ups-taken-in-this-repair-and-the-two-left-with-a-follow-up))
- FUP-fb8cbeabbddef397 (open): ER4-005: the cost of a recurring gate grows with closed history: docs-check parses every tracked Markdown file under the document roots on every run; returned to open by FINAL-001 (D027) when the resume suite passed 120 s in a fresh document gate; added by the 2026-10-18 pass ([source](../product/07-execution-guide.md#discipline))
- FUP-211986cdaa9f8c4f (open): the document gate's run count (125 runs in four days over three orders); returned to open by FINAL-001 (D027) when the gate's median exceeded 120 s at WO-216's rows; added by the 2026-10-18 pass ([source](../planning/work-order-map.md#candidates--returns-from-the-standard-pass-with-the-operators-comments-recorded-2026-10-17))

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
delivery; the record shows 35 rows that no later order took);
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
   operator packet of the same id in `docs/evidence/WO-217/handoff.md`;
   no listed row is `untriaged`, `open` or `allocated`.
2. Every `settled` row's disposition reason names a decision in
   `docs/evidence/WO-217/decisions.md` whose `evidence` names the
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
   (step 14); `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; each re-mint and, where a judged
   source changed, the live feedback episode recorded.

**Preflight:** `npm test -- --only runner-fixtures` for steps 2, 6, 12, 13 and 14;
`npm test -- --only harness-fixtures` for step 3;
`npm test -- --only process-debt` for steps 9 and 11;
`npm test -- --only configuration-root` for every script step;
`npm test -- --only resume` for step 10;
`npm test -- --only docs-check-fixtures` for step 14;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then the handoff gate the executor's role text names at
the base (explicit tokens added by the 2026-10-18 pass, FUP-17266e5072d4a25a).

**Execution plan (the executor follows these steps in order; observed at `7b8206f4`, 2026-10-17):**

1. `docs/evidence/WO-217/README.md` (new): at the base, each listed row's id, its latest disposition and date, the surfaces it names and the commands the executor ran to reproduce it, written before any fix. Check: the README lists every row of this order.
2. the surfaces the row's decision names (rows FUP-04ec9fa011f39d93, FUP-079f827e1b11eb1e, FUP-0c10689747f83675, FUP-5094b24d6d68d2e4, FUP-511b5a41d831fe83, FUP-51c310284c2fea17, FUP-5e52eb500e395237, FUP-8bac5e3bddd12494, FUP-92711a92e1d05874, FUP-94bff00e748a26af, FUP-984094128fe71900, FUP-a566ba26ee9f909a, FUP-cb5c3b3e7d0b0c0d, FUP-cb922b59e013dbf1, FUP-d0a9719cc2e4ec55, FUP-d5605723a86254eb, FUP-de6162b279f66709, FUP-e18e6a5422109bfb, FUP-e821aa2ced3aa111, FUP-e86366edbc1d5289, FUP-eafff4f96686f67d, FUP-f5f10101e717d59b): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
3. `.claude/hooks/` (rows FUP-0e424834e4030880): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
4. `corpus/mutation/mutate.mjs` (rows FUP-4475529d727a4d25): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
5. `scripts/lib/contributions.mjs` (rows FUP-6125f53234c75af3): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
6. `scripts/test-runner.test.mjs` (rows FUP-642d7a4beaed2272): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
7. `docs/LEGAL.md` (rows FUP-b28b870422a74166): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
8. `packages/skeleton/src/gate-evidence.mjs` (rows FUP-bf51ac5cd8143d98): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
9. `scripts/lib/host-guard-state.mjs` (rows FUP-c1a89d52cc314af9): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
10. `scripts/test-off-ramps.mjs` (rows FUP-cde72b7860c03c18): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
11. `scripts/host-guard.mjs` (rows FUP-e8f5399db33d0b5a): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
12. `scripts/worktree.mjs` (`finish`, the `recordGateChecks` copy; rows FUP-851cba3a914ab359): copy each row with `failedOutputOnly` applied to its `cases` and `taskTimeline` at every depth (WO-216-D031's rule at the copy), with a case that copies a passing row holding output and reads none in main's index; then the row's F2 cases in `scripts/test-verifier-gate-claims.mjs` and its F3 fix in `scripts/sync.mjs` (a writer only on a stale report; an orphan revision removed or named). Check: `npm test -- --only runner-fixtures` and the suites that declare the two files, under `node scripts/harness.mjs bounded --`.
13. `scripts/test-runner.mjs` (the copied-fixture closure declarations; rows FUP-9de14a69403e2b32): declare the five hand-kept copy sites so the structural phase checks them, with the case that fails when a copy drifts. Check: `npm test -- --only runner-fixtures`.
14. `scripts/docs-check.mjs` and the document selection in `scripts/test-runner.mjs` (rows FUP-fb8cbeabbddef397, FUP-211986cdaa9f8c4f): the parse cost that grows with closed history and the document gate's run count per order; fix each with a measured case (the three-gate medians before and after) or decline it with the measured reason. Check: `npm test -- --only docs-check-fixtures` and `npm run test:docs`.
15. `docs/evidence/WO-217/decisions.md`: one decision per disposed row or per cluster of rows fixed together, each naming the row ids, the chosen option, the rejected option, the fixture case or the decline reason, and the reversal condition; an operator packet for each row only the operator can decide, with its reopening condition naming this order's pull request. Then `npm run meta`. Check: `npm run meta -- --check`.
16. `docs/evidence/WO-217/README.md`: the after table (each row's final status, the case or reason, the command) and the register's pending count before and after (`npm run plan -- followups`). Check: the README holds both tables.
17. Write-backs, in place, only where a row's fix changes what a product document states (the row's source decision names the document and section; re-read the heading at the base). Check: `npm run test:docs`.
18. Handoff: `npm run format`; `npm run test:docs`; the gate the executor's role text names at the base (the order's Preflight suites, then the handoff gate; `npm test -- --review` where a declared machinery source changed); complete `docs/evidence/WO-217/handoff.md`; `npm run resume -- implementation-ready <flags>`.

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
