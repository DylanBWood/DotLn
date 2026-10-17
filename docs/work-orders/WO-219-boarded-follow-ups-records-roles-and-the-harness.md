# WO-219 — Boarded follow-ups, batch 3: lifecycle records, attestation, role text, hooks, the harness and planning machinery: every one of the 40 register rows listed below is fixed with a fixture case or declined with its recorded reason, the register shows it, and a row only the operator can decide leaves as an operator packet (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** assigned at activation from the fixes made (patch
unless a fix changes a command, flag, schema or refusal, which the decisions
name; then minor). A declined row changes no behavior.
**Cost:** adds the fixes and fixture cases the listed rows need, across
`scripts/resume.mjs`, `scripts/lib/handoff-ledger.mjs`, `scripts/lib/verification-briefing.mjs`, `scripts/lib/review-findings.mjs`, `scripts/lib/comment-labels.mjs`, `scripts/lib/plan-receipts.mjs`, `scripts/lib/planning-followups.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, `packages/skeleton/src/harness-host.ts`, `packages/kernel/src/core.ts`, `packages/kernel/src/store.ts`, `packages/compiler/src/source-bundle.ts`, the hooks under `.claude/hooks/` and the fixtures the rows name; unknown until each row is triaged, and the README records
the per-row command and case. Removes 40 pending rows from the
register, which at the base holds 281 pending rows, 130 of them decision
rows boarded by closed orders across 53 orders (the oldest from WO-054,
2026-09-18), 88 of them follow-ups boarded in the week of 2026-10-13 to
2026-10-17 alone; the rule that "the next order that edits the surface"
takes a row delivered none of these 40 (each still pending at
`7b8206f4`). Wall-clock: one triage per row plus the fixes; unknown until
run. Context bytes: this order's row list is read once. Commands: none
added. Tokens: unknown until run. Steps: 18. Re-mints: the
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
**Depends on:** WO-218 placed before it (reference only; no hard edge).
**Recommended placement:** position 4 of the serial queue, after WO-218; the operator may interleave the four batches with the focus orders by one sequence edit.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-218",
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
the pending count rose from 247 to 281. The 40 rows of this
batch name lifecycle records, attestation, role text, hooks, the harness and planning machinery:

- FUP-0132 (deferred): WO-126-D005: Finish the specified file-level authored-output contract and record its remaining migration cost. Nominate change-range review with an exact unchanged-byte proof for a later planning comp ([source](../evidence/WO-126/decisions.md#wo-126-d005))
- FUP-06da3d34e379e3c1 (deferred): WO-056-D008: Planner: the verifier's own diagnosis has no durable field. claude-live-2's refused result named the cause precisely and the repair worker would never have seen it. Weigh an analysis fiel ([source](../evidence/WO-056/decisions.md#wo-056-d008--operator-scope-expansion-repair-both-runtime-defects-in-this-order))
- FUP-1315c82ef74fb832 (deferred): WO-187-D052: Planning, low priority unless a condition occurs. (1) scripts/resume.mjs and scripts/lib/verification-briefing.mjs: build the verify briefing before appending VerificationRequested, or tu ([source](../evidence/WO-187/decisions.md#wo-187-d052--pass-the-integrated-subject-and-board-seven-low-findings))
- FUP-151541120435fd15 (deferred): WO-142-D015: Extend the AC3 reserved-state coupling check so an optional-chained read such as (context.state as { policy?: unknown } \| undefined)?.policy inside packages/kernel/src/core.ts fails it, w ([source](../evidence/WO-142/decisions.md#wo-142-d015--board-up-the-optional-chaining-gap-in-the-kernel-coupling-tripwire-met-during-ver-002))
- FUP-16a4af39c710459b (deferred): WO-186-D039: Planning, with the operator, decides how a Claude Code role records that Ultracode was on, now that it is a mode beside effort there: whether scripts/resume.mjs parseActor still accepts t ([source](../evidence/WO-186/decisions.md#wo-186-d039--attest-the-selected-effort-ultracode-is-a-mode-beside-it))
- FUP-2f0974e3d5d5063a (deferred): WO-099-D008: The tinkerer-economy support was not equipped in this dispatch's briefing although WO-145 D001 selected WO-099 as a trial; equip it explicitly on the next trial dispatch, or record here t ([source](../evidence/WO-099/decisions.md#wo-099-d008))
- FUP-2f1b441dc2c37776 (deferred): WO-178-D006: The typed prompt row records the hook observation time, UTF-8 digest and byte count, prefix class and lifecycle scope, never message text. UserPromptSubmit has no documented route field:  ([source](../evidence/WO-178/decisions.md#wo-178-d006--observation-coverage-and-bounded-paraphrases))
- FUP-33173b7f87004a9c (deferred): WO-168-D015: Planner, low priority, with D009's standing-text pass: product 07's destination-adapter paragraph and docs/AI-HARNESS-SECURITY.md do not say that a command word after an &> operand makes  ([source](../evidence/WO-168/decisions.md#wo-168-d015--repair-of-ver-001-f1-and-f2--followed-by-words-and-zshs--word))
- FUP-3f9d788f4d8c89ac (deferred): WO-187-D034: Tolerate common self-review forms (emphasised counts, a code-formatted label, a parenthetical worker before the colon) in scripts/lib/handoff-ledger.mjs. In scripts/lib/review-findings.mj ([source](../evidence/WO-187/decisions.md#wo-187-d034--board-the-remaining-low-reader-advisory-and-planning-count-observations))
- FUP-4c4ad5ef3c88547f (deferred): WO-188-D048: Planning, low priority: (1) scripts/lib/comment-labels.mjs FINDING_LABEL: the bare letter-and-number alternative (a capital F, N, R, B, A or M followed by one or two digits) refuses ordin ([source](../evidence/WO-188/decisions.md#wo-188-d048--final-review-five-low-findings-of-the-host-and-document-gate-review-worker-boarded))
- FUP-50a41e39f51a3e01 (deferred): WO-090-D006: Planning: design an explicit executor route for an authorized edit to the goal standard that requires fresh planning refutation before final review. The present exact-text binding plus co ([source](../evidence/WO-090/decisions.md#wo-090-d006--operator-authorized-local-commits-refresh-the-planning-judgment))
- FUP-5d191eb1b77b3431 (deferred): WO-056-D005: Planner: weigh one bounded order over the verification and repair hosts. (a) Record RepairSnapshotPrepared without a physical path, or outside the verification child log, so a re-verifica ([source](../evidence/WO-056/decisions.md#wo-056-d005--adversarial-pass-bind-facts-to-the-log-make-the-replay-guard-sensitive-always-file))
- FUP-6004455b998fa646 (deferred): WO-144-D009: Planner: the order's own cost line ('removes the recorded incident class') and criterion 2's label ('the recorded incident's shape') remain broader than what ships, because the incident's ([source](../evidence/WO-144/decisions.md#wo-144-d009--judge-a-literal-redirect-on-any-program-state-what-stays-unjudged))
- FUP-64a7f9adb355d94e (deferred): WO-144-D008: Planner (continues D007): decide whether the four root-bound refusals judge away from the worktree root. Their stand-down is now journaled by every hook, so an inventory can count how oft ([source](../evidence/WO-144/decisions.md#wo-144-d008--judge-outside-writes-from-any-working-directory-keep-hook-rows-in-the-hooks-own-project))
- FUP-67a07b670440cf5a (deferred): WO-187-D045: Judge, over the first measured final reviews, whether a findings-block problem in a field that does not enter the count (id shape, route, summary) should be named and counted rather than  ([source](../evidence/WO-187/decisions.md#wo-187-d045--fix-nine-self-review-findings-record-three-and-board-the-strict-validation-choice))
- FUP-71a27b368d93f135 (deferred): WO-056-D002: Planner: nominate a bounded order that lets a source-change worker run a path-free named test under the Codex writer profile (for example an admitted PATH entry for the host's Node direct ([source](../evidence/WO-056/decisions.md#wo-056-d002--keep-the-capsule-public-safe-by-construction-never-edit-hashed-bytes))
- FUP-75563edf56be23b5 (deferred): WO-142-D005: Next planning session: authorize append serialization/live-replay compatibility in packages/kernel/src/store.ts and ac2-replay-store.test.ts. Choose canonical decoded return values or exp ([source](../evidence/WO-142/decisions.md#wo-142-d005--defer-the-pre-existing-append-serialization-divergence))
- FUP-76e02136ac324240 (deferred): WO-144-D007: Planner: nominate a bounded order for the shared root-cwd precondition. Decide whether the writer, live-gate, planning-branch and subagent refusals should judge when the session's working ([source](../evidence/WO-144/decisions.md#wo-144-d007--fail-final-review-on-a-live-admitted-outside-write-board-the-shared-root-cwd-precondition))
- FUP-7c909f0880237fba (deferred): WO-188-D001: Planning: make the Tinkerer support modify the executor phase it is linked to, as product 02 defines a support facet, and decide the same for the other prompt-only executor supports. Leve ([source](../evidence/WO-188/decisions.md#wo-188-d001--note-for-planning-the-tinkerer-support-does-not-modify-the-phase-it-is-linked-to))
- FUP-7fd69f3bda6fa326 (deferred): WO-178-D005: Next planning pass, with FUP-d90c46abf5658272 and FUP-01e80ba5ce62c72a: decide a durable cache for failed results with no classified diagnostic and prune interrupted .shell-claim/.prepare ([source](../evidence/WO-178/decisions.md#wo-178-d005--carry-in-remedies-and-retained-limits))
- FUP-9625ca888d7d08f5 (deferred): WO-162-D016: Planner: decide how a wrong execution amendment is corrected. Today a PlanExecutionAmended row whose decision text later changes can be neither withdrawn nor superseded, because checkPlan ([source](../evidence/WO-162/decisions.md#wo-162-d016))
- FUP-a6cf30a8b7bc4a83 (deferred): WO-172-D014: Decide how an attestation records ultracode now that it no longer implies an effort: a supplied ultra, ultra code or ultracode spelling maps to xhigh with mode subagents in scripts/resume ([source](../evidence/WO-172/decisions.md#wo-172-d014--release-v0541-and-the-attestation-with-ultracode-independent-of-effort))
- FUP-a91115fda9b70272 (deferred): WO-140-D008: Planner: replayed decisions for a verification workstream each carry the full pinned capsule, so a stored live stream costs about 1.7 MB per event to replay and compare; 330 events is 1.1 ([source](../evidence/WO-140/decisions.md#wo-140-d008--repair-the-stored-stream-test-that-a-long-live-verifier-episode-pushed-past-the-engines-string-limit))
- FUP-acfe4bfda716d8fb (deferred): WO-158-D008: Next order that touches usage or meta attribution: decide whether resume usage, meta and the console board apply RecordCorrected values; today only status, current.md and the index do. ([source](../evidence/WO-158/decisions.md#wo-158-d008))
- FUP-afc1bd32fa034417 (deferred): WO-060-D004: Planner: a later minor of the SourceBundle screen could declare two more shapes, each named today as the v1 screen's limit in packages/compiler/src/source-bundle.ts and product 03 §Ports: ([source](../evidence/WO-060/decisions.md#wo-060-d004--the-screens-declared-set-each-pattern-from-its-public-source))
- FUP-b3454d6ce3594ef3 (deferred): WO-172-D006: Decide whether the reader's count stands or the structured operator-step field returns: the reader agrees with the hand classification on 238 of 241 fields at the base but with an indepen ([source](../evidence/WO-172/decisions.md#wo-172-d006--the-direction-reader-judged-against-a-hand-classification-filed-first))
- FUP-b789b81160c008ea (deferred): WO-162-D006: Decide acceptance of C1 and Unicode separators when text crosses handoff and mission interfaces; retain map candidate 2 and its observed-late-refusal reopening condition until a real tran ([source](../evidence/WO-162/decisions.md#wo-162-d006))
- FUP-beb13d8d099d2917 (deferred): WO-154-D003: Planner: file the receipt-subject group of WO-154 as its own patch order: scripts/lib/plan-receipts.mjs stores each sequenced order by identity and hash, rebuilt from the committed subjec ([source](../evidence/WO-154/decisions.md#wo-154-d003--the-receipt-subject-group-becomes-its-own-patch-order))
- FUP-c5438ef80c397cf0 (deferred): WO-169-D012: Planner: decide a bounded representation or explicit input-size refusal for followups --touching when its query terms alone outgrow the 8 KB page and continuation. Reproduce 500 distinct  ([source](../evidence/WO-169/decisions.md#wo-169-d012--board-a-large-touching-querys-page-limit))
- FUP-c8ec65f056105759 (deferred): WO-118-D020: Machinery planner: let an authorized story writeback compose with other admitted vision continuations. Prove a vision citation relocation against the current vision with the authorized st ([source](../evidence/WO-118/decisions.md#wo-118-d020--final-review-follow-up-an-authorized-story-writeback-does-not-compose-with-a-vision-citation-relocation))
- FUP-c95ffe4a84e49cbb (deferred): WO-187-D047: Assess two bounded design improvements: (1) in scripts/lib/verification-briefing.mjs, advise when a newer receipt's matching order row has missing or non-array findings, without treating  ([source](../evidence/WO-187/decisions.md#wo-187-d047--judge-the-fresh-adversary-against-the-filed-receipt-contract-and-board-two-design-follow-ups))
- FUP-ca628adcc713c0b8 (deferred): WO-115-D026: Control fold hardening, low, for the planner: the RecordCorrected fold checks a productGate binding's declared subject type but not the event at that ordinal, so a hand-appended binding d ([source](../evidence/WO-115/decisions.md#wo-115-d026--repair-the-gate-identity-and-bind-a-product-gate-by-correction-at-the-operators-direction))
- FUP-d4493f4251e69c87 (deferred): WO-188-D009: An enqueue row that carries the message text and no recorded command mode is attributed to the operator (promptRoute reads commandMode on queue-operation rows and no record shows the fiel ([source](../evidence/WO-188/decisions.md#wo-188-d009--item-7-a-host-task-notification-is-journaled-with-its-own-source-and-is-not-an-operator-message))
- FUP-dc58e92c5cafc732 (deferred): WO-087-D011: Planning: reconcile canonical worker context with continuation source dependencies. Cause: the full What DotLn is not section is hashed while only its bullets are sent to the worker; capa ([source](../evidence/WO-087/decisions.md#wo-087-d011))
- FUP-dc6c139003bd4b89 (deferred): WO-171-D004: WO-170: record in each per-order snapshot the SHA-256 of every retained usage copy it carries (for example usageCopies: [{path, sha256}]), and write or refresh the snapshot after the orde ([source](../evidence/WO-171/decisions.md#wo-171-d004--a-lane-holding-a-usage-copy-waits-for-a-committed-snapshot-that-carries-it))
- FUP-e835d826e9af5417 (deferred): WO-187-D042: Make explicit in the verifier root (packages/skeleton/src/loadouts/contributor.ts) and product 07 §Verification review and attack that a design-level defect in the order's declared surfac ([source](../evidence/WO-187/decisions.md#wo-187-d042--ver-004-verifier-process-failures))
- FUP-e96e0676a5c34f98 (deferred): WO-163-D020: Operator, low priority, before final review: confirm that WO-163's criterion 4 waiver, recorded by the executor session's helper, satisfies the authorization. If not, record a disposition ([source](../evidence/WO-163/decisions.md#wo-163-d020--the-criterion-4-waiver-stands-its-recorder-was-the-executor-sessions-helper))
- FUP-ebaa803e38670545 (deferred): WO-184-D040: Reviewer and verifier role text: judge a confinement or security-boundary finding by the recorded rule and repair it defensively, never by working out circumvention paths; after one refus ([source](../evidence/WO-184/decisions.md#wo-184-d040--hard-error-the-first-final-review-session-looped-on-refusals-and-forced-a-restart))
- FUP-fd05316b6030ef73 (deferred): WO-168-D009: Planner, low priority, one pass over the standing text: state the Codex dispatch reservation in docs/product/02-domain-model.md (the sentence Codex carries the same duties as role text in ([source](../evidence/WO-168/decisions.md#wo-168-d009--item-7-the-standing-sentences))
- FUP-b3c1a8260bca40b7 (untriaged): WO-210-D039: VER005-META-1: In the next verifier-process revision, specify bounded result projection and aggregate read budgets before emitting audit or repository output, with a check for nested… ([source](../evidence/WO-210/decisions.md#wo-210-d039--verification-meta-failures-excessive-context-consumption-and-omitted-logging-commitment))

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
delivery; the record shows 40 rows that no later order took);
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
   operator packet of the same id in `docs/evidence/WO-219/handoff.md`;
   no listed row is `untriaged`, `open` or `allocated`.
2. Every `settled` row's disposition reason names a decision in
   `docs/evidence/WO-219/decisions.md` whose `evidence` names the
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
   (step 17); `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; each re-mint and, where a judged
   source changed, the live feedback episode recorded.

**Preflight:** `resume`, `harness`, `harness-context`, `harness-fixtures`, `process-debt`, `plan-refutation`, `launchpad-planning` and `skeleton`, each as `npm test -- --only <suite>` under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources, and `npm run test:docs` when a document changes; then the
handoff gate the executor's role text names at the base.

**Execution plan (the executor follows these steps in order; observed at `7b8206f4`, 2026-10-17):**

1. `docs/evidence/WO-219/README.md` (new): at the base, each listed row's id, its latest disposition and date, the surfaces it names and the commands the executor ran to reproduce it, written before any fix. Check: the README lists every row of this order.
2. the surfaces the row's decision names (rows FUP-0132, FUP-06da3d34e379e3c1, FUP-2f0974e3d5d5063a, FUP-2f1b441dc2c37776, FUP-50a41e39f51a3e01, FUP-5d191eb1b77b3431, FUP-6004455b998fa646, FUP-64a7f9adb355d94e, FUP-67a07b670440cf5a, FUP-71a27b368d93f135, FUP-76e02136ac324240, FUP-7c909f0880237fba, FUP-7fd69f3bda6fa326, FUP-9625ca888d7d08f5, FUP-a91115fda9b70272, FUP-acfe4bfda716d8fb, FUP-b3454d6ce3594ef3, FUP-b789b81160c008ea, FUP-c5438ef80c397cf0, FUP-c8ec65f056105759, FUP-ca628adcc713c0b8, FUP-d4493f4251e69c87, FUP-dc58e92c5cafc732, FUP-dc6c139003bd4b89, FUP-e96e0676a5c34f98, FUP-ebaa803e38670545, FUP-b3c1a8260bca40b7): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
3. `scripts/resume.mjs` (rows FUP-1315c82ef74fb832, FUP-16a4af39c710459b): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
4. `packages/kernel/src/core.ts` (rows FUP-151541120435fd15): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
5. `docs/AI-HARNESS-SECURITY.md` (rows FUP-33173b7f87004a9c): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
6. `scripts/lib/handoff-ledger.mjs` (rows FUP-3f9d788f4d8c89ac): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
7. `scripts/lib/comment-labels.mjs` (rows FUP-4c4ad5ef3c88547f): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
8. `packages/kernel/src/store.ts` (rows FUP-75563edf56be23b5): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
9. `scripts/resume` (rows FUP-a6cf30a8b7bc4a83): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
10. `packages/compiler/src/source-bundle.ts` (rows FUP-afc1bd32fa034417): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
11. `scripts/lib/plan-receipts.mjs` (rows FUP-beb13d8d099d2917): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
12. `scripts/lib/verification-briefing.mjs` (rows FUP-c95ffe4a84e49cbb): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
13. `packages/skeleton/src/loadouts/contributor.ts` (rows FUP-e835d826e9af5417): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
14. `docs/product/02-domain-model.md` (rows FUP-fd05316b6030ef73): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that declares the file (`npm test -- --review --list` names it), under `node scripts/harness.mjs bounded --`.
15. `docs/evidence/WO-219/decisions.md`: one decision per disposed row or per cluster of rows fixed together, each naming the row ids, the chosen option, the rejected option, the fixture case or the decline reason, and the reversal condition; an operator packet for each row only the operator can decide, with its reopening condition naming this order's pull request. Then `npm run meta`. Check: `npm run meta -- --check`.
16. `docs/evidence/WO-219/README.md`: the after table (each row's final status, the case or reason, the command) and the register's pending count before and after (`npm run plan -- followups`). Check: the README holds both tables.
17. Write-backs, in place, only where a row's fix changes what a product document states (the row's source decision names the document and section; re-read the heading at the base). Check: `npm run test:docs`.
18. Handoff: `npm run format`; `npm run test:docs`; the gate the executor's role text names at the base (the order's Preflight suites, then the handoff gate; `npm test -- --review` where a declared machinery source changed); complete `docs/evidence/WO-219/handoff.md`; `npm run resume -- implementation-ready <flags>`.

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
