# WO-219 — Boarded follow-ups, batch 3: lifecycle records, attestation, role text, hooks, the harness and planning machinery: every one of the 50 register rows listed below is fixed with a fixture case or declined with its recorded reason, the register shows it, and a row only the operator can decide leaves as an operator packet (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** assigned at activation from the fixes made (patch
unless a fix changes a command, flag, schema or refusal, which the decisions
name; then minor). A declined row changes no behavior.
**Cost:** adds the fixes and fixture cases the listed rows need, across
`scripts/resume.mjs`, `scripts/lib/handoff-ledger.mjs`, `scripts/lib/verification-briefing.mjs`, `scripts/lib/review-findings.mjs`, `scripts/lib/comment-labels.mjs`, `scripts/lib/plan-receipts.mjs`, `scripts/lib/planning-followups.mjs`, `scripts/lib/planning-conditions.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, `packages/skeleton/src/harness-host.ts`, `packages/kernel/src/core.ts`, `packages/kernel/src/store.ts`, `packages/compiler/src/source-bundle.ts`, the hooks under `.claude/hooks/`, for the row the 2026-10-19 fork-requests pass added `scripts/work-orders.mjs` (`index --check`) and `scripts/test-runner.mjs` (`--list`), for the four rows the 2026-10-20 entropy pass added from WO-218's close `scripts/lib/dependencies.mjs`, `scripts/test-work-orders.mjs`, `scripts/lib/target-publish.mjs`, `scripts/lib/target-worktree-close.mjs`, `scripts/lib/gate-reuse.mjs`, `scripts/lib/starter-refresh.mjs`, `scripts/lib/release-tags.mjs`, `scripts/release.mjs`, `scripts/lib/config.mjs`, `scripts/lib/worktree-integration.mjs`, `scripts/lib/harness.mjs` and the kit floor template under `scripts/kit/`, for its two REVIEW-007 rows `scripts/lib/entropy-review.mjs`, `scripts/test-entropy-review.mjs`, `docs/instance/entropy-reducer/README.md`, `scripts/docs-check.mjs` and `scripts/test-docs-check.mjs`, and the fixtures the rows name; unknown until each row is triaged, and the README records
the per-row command and case. Removes no pending rows: the listed rows were allocated at filing and already
count as closed (WO-218 D056), and the README records the register's pending
count before and after; at `7b8206f4` the register held 281 pending rows, 130
of them decision rows boarded by closed orders across 53 orders (the oldest
from WO-054, 2026-09-18), 88 of them follow-ups boarded in the week of
2026-10-13 to 2026-10-17 alone, and the rule that "the next order that edits
the surface" takes a row had delivered none of the 40 rows listed at filing
(corrected by the 2026-10-21 pass). Wall-clock: one triage per row plus the fixes; unknown until
run. Context bytes: this order's row list is read once. Commands: none
added. Tokens: unknown until run. Steps: 27. Re-mints: the
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
([planning document](../planning/standard-pass-2026-10-19.md) §6): two
planning-machinery defects the operator's instance recorded in its
2026-10-18 planning document. Amended again by the 2026-10-19
fork-requests pass ([planning document](../planning/fork-requests-2026-10-19.md)
§5): the Preflight-token check the fork's 2026-10-19 document asks for.
Amended again by the 2026-10-20 entropy pass ([planning
document](../planning/entropy-review-007-2026-10-20.md) §6): four rows
WO-218's own verification and final review boarded, taken here because
their subsystem closed with WO-218; criterion 2's control evidence and the
objective's count sentence, from WO-218 D056; and the two accepted
REVIEW-007 findings (the frozen copy's route home; the operator-word
advisory), as steps 22 and 23.
Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: repository records and the fork's committed
planning document only.
**Depends on:** WO-218 closed on 2026-10-20 as v0.87.0 (reference only; no hard edge).
**Recommended placement:** position 5 of the serial queue, after the four orders the 2026-10-21 pass filed for the fork's return to a working state (WO-226, WO-227, WO-225 and WO-229); WO-217 closed as v0.89.0 on 2026-10-21; the operator may interleave the two remaining batches with the focus orders by one sequence edit.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-218",
    "relation": "reference-only",
    "reason": "closed before this batch (v0.87.0, 2026-10-20); no hard edge"
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
No row is left `untriaged`, `open` or `allocated`. The listed rows were
`allocated` to this order when it was filed, and the register counts an
allocated row as closed, so the pending count does not fall by them; the
README records the count before and after and claims no fall (WO-218
D056: 158 before and after its application).

**Observed gap (dated 2026-10-17, main at `7b8206f4`):** the register
holds 281 pending rows, 130 of them decision rows boarded by closed orders
(`npm run plan -- followups --export`): each was met by a verifier or
reviewer, recorded under product 07's boarded-defect rule, and deferred to
"the next order that edits these surfaces", a planning pass or a repair
that never came; the oldest listed below dates from 2026-09-18. In the week
of 2026-10-13 to 2026-10-17, seven final reviews boarded 88 follow-ups and
the pending count rose from 247 to 281. The 41 rows of this
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
- FUP-b0418fa8b09362be (untriaged): the 2026-10-18 pass's candidate 1: post-close records have a home a pull request carries: `override-record` admits only open phases (`scripts/resume.mjs` line 284), so the override at WO-216's release close had no event and the hook's advisory sent the record to the order's tracked decisions file, which clean `main` cannot carry; the shape is an ignored pending lane under the control root, as the sibling receipt uses, that `override-record` writes at a closed order and the next `worktree start` carries into its reviewed change ([source](../planning/work-order-map.md#candidates--returns-from-the-fork-observations-pass-recorded-2026-10-18))

**Added by the 2026-10-19 pass (main at `f577979e`):** two rows from the
operator's instance's dated requests to core (its 2026-10-18 planning
document, §10, read on the operator's machine), both planning machinery:

- FUP-10996fedecfde047 (untriaged): plan conditions decidable in an exported instance. ([source](../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19))
- FUP-dadc66e1f81f83a5 (untriaged): followups --apply and the host scratchpad. ([source](../planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19))

**Added by the 2026-10-19 fork-requests pass (main at `f0c3f5f6`):** one
row from the operator's instance's requests of 2026-10-19 (its §10 item
3), planning machinery:

- FUP-2304d46e6feb711b (untriaged): Preflight tokens checked against the runner's declared suites. ([source](../planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass))

**Added by the 2026-10-20 entropy pass (main at `e4c46109`):** four rows
WO-218's own verification and final review boarded (D059, D062, D063 and
D064), taken here because WO-218 closed as v0.87.0 on 2026-10-20 with no
later batch on its subsystem, and because the fork's target orders cross
three of them at their next close (the target publish and close, the
release close and the starter); the decisions are the authority on each
repair rule and each names its reproduction:

- FUP-27e0c0fff9cedb75 (untriaged): WO-218-D059: The next order that edits scripts/lib/dependencies.mjs or scripts/work-orders.mjs, or a WO-218 repair if one happens; low priority. Rule a repair must hold: every reader main's parser… ([source](../evidence/WO-218/decisions.md#wo-218-d059--ver-002-pass-the-repair-holds-and-the-historical-id-dependency-refusal-no-longer-reaches-the-index-or-the-planning-readers))
- FUP-eacf4e6eb0b39fbe (untriaged): WO-218-D062: WO-219, which edits packages/skeleton/src/harness-host.ts next, or the next order that edits registeredTargetAdmission, scripts/lib/target-publish.mjs,… ([source](../evidence/WO-218/decisions.md#wo-218-d062))
- FUP-4018cf3118ea113e (untriaged): WO-218-D063: The next order that edits scripts/lib/starter-refresh.mjs or scripts/release.mjs. Rules a repair must hold: (F16) in the already-current branch the tag lands on the starter commit that… ([source](../evidence/WO-218/decisions.md#wo-218-d063))
- FUP-4fe22d2e0c8d843d (untriaged): WO-218-D064: The next order that edits scripts/lib/worktree-integration.mjs or scripts/lib/harness.mjs. Rules a repair must hold: (F21) --stash-applied lists or refuses stash paths with no trace in… ([source](../evidence/WO-218/decisions.md#wo-218-d064))

**Added by the same pass from REVIEW-007** (its two accepted findings,
both measured and both survivors of REFUTATION-008; the planning
machinery this batch owns):

- FUP-568da2f2b62ee478 (untriaged): ER7-001 — the frozen review copy keeps the operator's checkout as `origin`, so a push from it rewrites refs the receipt's witnesses cannot see (major). ([source](../planning/entropy-reviews/REVIEW-007.md#candidates--accepted-entropy-reducer-findings-review-review-007-recorded-2026-10-20))
- FUP-46deeb2483a9c28d (untriaged): ER7-002 — WO-188-D015's reopening condition occurred and the operator-word advisory cannot separate attributed speech from incidental quote characters (minor). ([source](../planning/entropy-reviews/REVIEW-007.md#candidates--accepted-entropy-reducer-findings-review-review-007-recorded-2026-10-20))

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
delivery; the record shows 41 rows that no later order took);
resolving by declining (axis: honesty of the triage; at most one third of
the listed rows may be declined, and each decline carries its NoOp reason
and reversal condition); a fifth batch for the four rows WO-218's close
boarded on its own subsystem (axis: the fixed cycle; four rows, three of which the fork crossed at its WO-006 target close on
2026-10-21 (DotLn-Angular v0.1.0, starter v0.88.0) and crosses again at its
next target close, against a cycle WO-218 paid
at 9.7 phase hours).

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
   fixture file, the case name and the control that shows the case
   failing with only that row's fix reverted and passing with it, recorded
   in `docs/evidence/WO-219/repair-controls.json` in the shape WO-218's
   repair filed (per control: the rows, the suite and command, the
   reversion by path, both arms' exit codes and the verdict), that case
   running under a suite the Preflight line names; or, for a row the
   current source already meets, names the command run at the base and
   its output. A row whose recorded ask is only a document sentence (steps 5 and 14) is
   settled by a decision naming the changed file, its section heading at the
   base and the change, checked by `npm run test:docs`; no fixture case or
   control is owed for it (receipt 050; the 2026-10-21 pass). A case that also passes at the base, or with the row's fix
   reverted, settles nothing (WO-218 VER-001 F1: three of five named cases
   passed at the base; D055's 91 paired controls were the repair, which
   VER-002 replayed whole).
3. Every `declined` row's disposition reason records what harm exists now,
   the evidence read and the reversal condition; the declined rows are at
   most one third of the rows listed. A row that asks planning to nominate an order is declined to planning with
   its reason, never designed by the executor; the after table counts operator
   packets beside declines against the one-third cap (receipt 048).
4. `npm run plan -- followups --touching` over this order's changed files
   (its default, from the worktree) lists no row of this order's list that is still pending other than a row
   deferred under criterion 1, which the README names with its operator
   packet; a row of another batch or a candidate row it lists is left as it is
   and named in the README (rewritten by the 2026-10-19 pass from receipt
   046's known issue, and by the 2026-10-21 pass for the deferred-row case,
   because the register counts `deferred` as pending and `--touching` lists
   it).
5. The README holds the before and after tables of step 1 and the
   after-table step, with the register's pending count before and after.
6. Write-backs land in place where a fix changed a product statement
   (step 26); `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; each re-mint and, where a judged
   source changed, the live feedback episode recorded.

**Preflight:** `npm test -- --only resume` and `npm test -- --only worktree` for the lifecycle, off-ramp and record-lane steps;
`npm test -- --only harness`, `npm test -- --only harness-context` and `npm test -- --only harness-fixtures` for the hook and harness steps;
`npm test -- --only process-debt` for the host-guard steps;
`npm test -- --only plan-refutation` and `npm test -- --only launchpad-planning` for the planning-machinery steps;
`npm test -- --only skeleton` for the loadout step;
`npm test -- --only work-orders-fixtures` and `npm test -- --only runner-fixtures` for the Preflight-token step;
`npm test -- --only work-orders-fixtures` for the dependency-refusal step;
`npm test -- --only harness-fixtures`, `npm test -- --only target-publish`, `npm test -- --only target-worktree` and `npm test -- --only runner-fixtures` for the target-lifecycle step;
`npm test -- --only release`, `npm test -- --only siblings-fixtures`, `npm test -- --only release-preparation` and `npm test -- --only launchpad` for the release-close and starter step;
`npm test -- --only worktree-integration` and `npm test -- --only harness` for the integration and floor step;
`npm test -- --only plan-refutation` and `npm test -- --only entropy` for the frozen-subject step;
`npm test -- --only docs-check-fixtures` and `npm test -- --only docs-check` for the operator-word step;
`npm test -- --only kernel` for the kernel steps (4 and 8); `npm test -- --only compiler` for the SourceBundle step (10); `npm test -- --only comment-labels-fixtures` for the comment-label step (7); `npm test -- --only console` and `npm test -- --only meta` for a step-2 row whose fix edits `packages/console` or the meta reader (added by the 2026-10-21 pass from receipt 050); `npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then the handoff gate the executor's role text names at
the base (explicit tokens added by the 2026-10-18 pass, FUP-17266e5072d4a25a).

**Execution plan (the executor follows these steps in order; observed at `7b8206f4`, 2026-10-17; step 16 added by the 2026-10-19 pass, observed at `f577979e`):**

1. `docs/evidence/WO-219/README.md` (new): at the base, each listed row's id, its latest disposition and date, the surfaces it names and the commands the executor ran to reproduce it, written before any fix. Check: the README lists every row of this order.
2. The file each row's source decision names, among `scripts/resume.mjs`, `scripts/lib/handoff-ledger.mjs`, `scripts/lib/verification-briefing.mjs`, `scripts/lib/review-findings.mjs`, `scripts/lib/plan-receipts.mjs`, `scripts/lib/planning-followups.mjs`, `scripts/lib/planning-conditions.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, `packages/skeleton/src/harness-host.ts`, the hooks under `.claude/hooks/`, `packages/console/src/` and `scripts/lib/meta.mjs`, taken one file at a time in the shape of steps 3 to 14, each naming its function or export and its Preflight suite in the decisions; a row whose source names no file (a planning or operator question) goes to step 24's decisions as a decline to planning with its reason or as an operator packet (rows FUP-0132, FUP-06da3d34e379e3c1, FUP-2f0974e3d5d5063a, FUP-2f1b441dc2c37776, FUP-50a41e39f51a3e01, FUP-5d191eb1b77b3431, FUP-6004455b998fa646, FUP-64a7f9adb355d94e, FUP-67a07b670440cf5a, FUP-71a27b368d93f135, FUP-76e02136ac324240, FUP-7c909f0880237fba, FUP-7fd69f3bda6fa326, FUP-9625ca888d7d08f5, FUP-a91115fda9b70272, FUP-acfe4bfda716d8fb, FUP-b3454d6ce3594ef3, FUP-b789b81160c008ea, FUP-c5438ef80c397cf0, FUP-c8ec65f056105759, FUP-ca628adcc713c0b8, FUP-d4493f4251e69c87, FUP-dc58e92c5cafc732, FUP-dc6c139003bd4b89, FUP-e96e0676a5c34f98, FUP-ebaa803e38670545, FUP-b3c1a8260bca40b7): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
3. `scripts/resume.mjs` (rows FUP-1315c82ef74fb832, FUP-16a4af39c710459b): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
4. `packages/kernel/src/core.ts` (rows FUP-151541120435fd15): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
5. `docs/AI-HARNESS-SECURITY.md` (rows FUP-33173b7f87004a9c): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
6. `scripts/lib/handoff-ledger.mjs` (rows FUP-3f9d788f4d8c89ac): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
7. `scripts/lib/comment-labels.mjs` (rows FUP-4c4ad5ef3c88547f): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
8. `packages/kernel/src/store.ts` (rows FUP-75563edf56be23b5): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
9. `scripts/resume.mjs` (`parseActor`; rows FUP-a6cf30a8b7bc4a83): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
10. `packages/compiler/src/source-bundle.ts` (rows FUP-afc1bd32fa034417): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
11. `scripts/lib/plan-receipts.mjs` (rows FUP-beb13d8d099d2917): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
12. `scripts/lib/verification-briefing.mjs` (rows FUP-c95ffe4a84e49cbb): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
13. `packages/skeleton/src/loadouts/contributor.ts` (rows FUP-e835d826e9af5417): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
14. `docs/product/02-domain-model.md` (rows FUP-fd05316b6030ef73): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`kernel` for steps 4 and 8, `compiler` for step 10, `comment-labels-fixtures` for step 7, `resume` for steps 3 and 9), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
15. `scripts/resume.mjs` (`override-record`, `openPhases`) and `scripts/worktree.mjs` (`start`; rows FUP-b0418fa8b09362be): admit `override-record` at a closed order by writing the record into an ignored pending lane under the control root, and have the next `worktree start` carry the lane's records into the new order worktree's control segment and regenerate the projection there, as the sibling receipt is carried; a case that records an override after a fixture close and finds the event in the next order's segment. A malformed or unreadable pending lane leaves the record in place, prints an advisory naming the lane, and the start proceeds; a case covers it (receipt 048). Check: `npm test -- --only resume` and `npm test -- --only worktree`.
16. `scripts/lib/planning-conditions.mjs` and `scripts/lib/planning-followups.mjs` (the `--apply` destination rule; rows FUP-10996fedecfde047, FUP-dadc66e1f81f83a5): in an exported instance the conditions table leaves out rows whose source is core-only or reads instance-scoped sources, and a gate-task hold needs at least three samples before it holds; `--apply` accepts a request file from the session's granted scratchpad when the session identity is known, or names the control-lane path in its refusal; each with a kit fixture. Check: `npm test -- --only plan-refutation` and `npm test -- --only launchpad-planning`, under `node scripts/harness.mjs bounded --`.
17. `scripts/work-orders.mjs` (`index --check`) and `scripts/test-runner.mjs` (`--list`; row FUP-2304d46e6feb711b): the check reads each open order's `**Preflight:**` field (`readPreflightSuites` in `scripts/lib/handoff-ledger.mjs`) and resolves every `npm test -- --only <suite>` token against the runner's declared `suites` of the same checkout, product and machinery alike, failing with the order id and the token for a name the runner would refuse (closed orders exempt); `--list --review` prints the machinery suites so an instance can read the set it declares; a kit fixture whose instance order names a core-only suite fails the check in the instance and the same order passes in core. Core's fifteen open orders name no undeclared token at `f0c3f5f6` (the 2026-10-19 fork-requests pass §5), so the failing case is the fixture's. Check: `npm test -- --only work-orders-fixtures`, `npm test -- --only runner-fixtures` and `npm test -- --only launchpad-planning`, under `node scripts/harness.mjs bounded --`.
18. `scripts/lib/dependencies.mjs` (`parseDependencies`, `readDependencies`), `scripts/work-orders.mjs` (`parseHeader`) and `scripts/test-work-orders.mjs` (row FUP-27e0c0fff9cedb75: WO-218 D059 with D064's correction): every reader main's parser refused in keeps refusing a hard, satisfied-by-release or satisfied-by-close dependency on an id the instance declares in `historicalWorkOrders` (`parseHeader`, and with it the work-orders index and the planning subject, receipt and failure readers, the dependency migration and derived contracts), the set read from that instance's configuration and an instance declaring none refusing none; the assertion main's test made through the index reader is restored and an activation case covers `readDependencies`; the reproduction is `node scripts/harness.mjs bounded -- node docs/evidence/WO-218/verification-002/dependency-probe.mjs . subject`. Check: `npm test -- --only work-orders-fixtures`, under `node scripts/harness.mjs bounded --`.
19. `packages/skeleton/src/harness-host.ts` (`registeredTargetAdmission`), `scripts/lib/target-publish.mjs` (`publishTargetDraft`), `scripts/lib/target-worktree-close.mjs` (`deleteDisposable`, the target listings and the judge-only scan) and `scripts/lib/gate-reuse.mjs` (`preflightRows`; row FUP-eacf4e6eb0b39fbe: WO-218 D062): (F13) every module the admitted helper process loads is bound to main's committed bytes, dist and node_modules included, or the helper runs from main's checkout, and the closure is judged under the same committed-bytes rule as the configuration and grants rather than against a movable ref, with one withheld case per vector (a planted node_modules package, a modified dist, a moved ref); (F14) any head this order's publication store recorded is a valid lease for a same-tree retry and the refusal prints a runnable remedy, with a case that retries a corrected title after a failed edit; (F15) a deletion failure refuses naming the checkout role, the relative directory, the remedy and the rerun command and deletes nothing further, and the 16 MiB listing refusals name the role and the rerun command without "Fix what Git reports", with cases that plant an immutable file and an oversized listing; (F20) a passing partial structural row neither replaces nor revokes in `preflightRows`, so the implementation-ready Preflight route passes after a focused run, with a case that fails without the fix. Check: `npm test -- --only harness-fixtures`, `npm test -- --only target-publish`, `npm test -- --only target-worktree` and `npm test -- --only runner-fixtures`, under `node scripts/harness.mjs bounded --`; the `harness-host.ts` edit re-mints the editions it is a registered source of and regenerates the bundle through `npm run sync`.
20. `scripts/lib/starter-refresh.mjs` (`refreshOne`), `scripts/lib/release-tags.mjs` (`isStarterTag`, `releaseAnnotations`), `scripts/release.mjs` (`main`'s close-history archives, `close`, `check-surfaces --local`) and `scripts/lib/config.mjs` (`validateLinkHosts`; row FUP-4018cf3118ea113e: WO-218 D063): (F16) in the already-current branch the tag lands on the starter commit that refreshed to head, the earliest ancestor of the tip whose committed `KIT-MANIFEST.json` names head and tag, never on a later non-refresh commit, with a case that puts a non-refresh commit above the refresh commit; (F17) a readable prior record is never recorded as unreadable, an archive write failure is a visible refusal or advisory that keeps the parsed history, a history failure keeps `previousAttempts` as parsed and never nests the prior bytes, and the refusal names the archive by its relative path and prints a completable route to re-anchor the history from the retained record, with cases for an unwritable attempts directory and a missing archive retried several times with the record size bounded; (F18) a close of a declared-release registration records `publication.target` before any judgment can refuse, never prints the no-release line for it, and files a refusal before any tag push as publication, with a case that refuses at the base judgment and asserts the first line, the blocker action and the receipt; (F19) the tag annotations are read once with the same exclusion and `r44-starter-baseline` still fails without it, `release prepare` passes the ancestral observation, and the `linkHosts` refusal reports the declared index, with `*` and host:port cases. Check: `npm test -- --only release`, `npm test -- --only siblings-fixtures`, `npm test -- --only release-preparation` and `npm test -- --only launchpad`, under `node scripts/harness.mjs bounded --`.
21. `scripts/lib/worktree-integration.mjs` (`--continue --stash-applied`) and `scripts/lib/harness.mjs` (`checkHarness`, the `build: none` emit) with the kit floor template under `scripts/kit/` (row FUP-4fe22d2e0c8d843d: WO-218 D064): (F21) `--stash-applied` lists or refuses stash paths with no trace in the tree and records each collision for explicit acknowledgement, its messages naming the commands to run, with a refusal-arm case for a reverted tree and one for an unresolved collision; (F22) a `build: none` emit leaves a floor that names no generated surface it removed, in core's floor and the kit template alike, and the drift message for a missing disclosure names the disclosure to add, with a case that emits both floors. Check: `npm test -- --only worktree-integration` and `npm test -- --only harness`, under `node scripts/harness.mjs bounded --`.
22. `scripts/lib/entropy-review.mjs` (`freezeSubject`; the confinement records of `fileEntropyReview` and `fileEntropyRefutation`), `scripts/test-entropy-review.mjs` and `docs/instance/entropy-reducer/README.md` §What the reviewer may run (row FUP-568da2f2b62ee478: ER7-001 and its packet `frozen-subject-has-no-route-home`): the frozen copy has no route back to its source: `freezeSubject` removes `origin` (or sets its push URL to a refusing value) right after the clone and refuses to hand off a copy with a configured remote; the confinement record digests the source's refs (`git for-each-ref`) before and after the episode beside the tracked-status and untracked-listing witnesses, refuses a changed digest on the HEAD route and records it on the explicit-commit route, where the operator's own ref changes are legitimate; fixtures cover a push attempt from the copy and a moved source ref on each route; the README's "instructed and then checked" sentence names the refs digest and drops the interim sentence the 2026-10-20 pass added. Check: `npm test -- --only plan-refutation` and `npm test -- --only entropy`, under `node scripts/harness.mjs bounded --`.
23. `scripts/docs-check.mjs` (`attributedWords`, the operator-word advisory and its summary line) and `scripts/test-docs-check.mjs` (row FUP-46deeb2483a9c28d: ER7-002 and its packet `operator-word-reopen-observable`): the advisory separates attributed speech from incidental quote characters (a quote inside a JSON block or a code span, a quoted document term) and prints its current count by class, so a planning entry reads WO-188-D015's reopening condition without classifying rows by hand; negative-control fixtures for each incidental class and a positive control for a quoted reply without a digest; the advisory stays advisory and the typed `operatorQuote` refusal is unchanged (WO-188-D015's decision), and the baseline's existing keys are not re-fingerprinted. Check: `npm test -- --only docs-check-fixtures` and `npm test -- --only docs-check`, under `node scripts/harness.mjs bounded --`.
24. `docs/evidence/WO-219/decisions.md`: one decision per disposed row or per cluster of rows fixed together, each naming the row ids, the chosen option, the rejected option, the fixture case or the decline reason, and the reversal condition; an operator packet for each row only the operator can decide, with its reopening condition naming this order's pull request. Then `npm run meta`. Check: `npm run meta -- --check`.
25. `docs/evidence/WO-219/README.md`: the after table (each row's final status, the case or reason, the command, the control) and the register's pending count before and after (`npm run plan -- followups`), with `docs/evidence/WO-219/repair-controls.json` written as each row is settled (criterion 2). Check: the README holds both tables and every settled row has a control.
26. Write-backs, in place, only where a row's fix changes what a product document states (the row's source decision names the document and section; re-read the heading at the base). Check: `npm run test:docs`.
27. Handoff: finish source edits; `npm run format` and `npm run sync` for stale generated artifacts; start one `npm test -- --review` in the background, never under the bounded wrapper, and await it with `node scripts/harness.mjs evidence --wait`; after it passes, complete `docs/evidence/WO-219/handoff.md`; run `npm run test:docs` once after the last document edit; then `npm run resume -- implementation-ready <flags>` (the sequence product 07 §Discipline revised on 2026-10-19; corrected by the 2026-10-21 pass).

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
- From receipts 046 and 047, moved here from the catalog row by the
  2026-10-19 pass: the order edits `scripts/lib/planning-followups.mjs`,
  which implements the `followups --show` and `--touching` reads its own
  criteria 1 and 4 use, so the executor changes no semantics of
  `touchingFollowups`, `followupStatus` or the status sets and records the
  base implementation's output on the same register (criterion 1);
  `packages/kernel/src/core.ts` is also WO-220's surface, so whichever runs
  first leaves the other's core.ts rows pending with a note (criterion 4);
  the role text and hooks it edits sit near the cold-start ceilings
  (executor 28,822 of 29,246 and reviewer 28,603 of 28,884 at `926b8234`, 2026-10-21; the executor re-measures at its base), so a cold-start breach follows `docs/control/budgets.json`'s standing
  direction of 2026-09-17: each role-text fix first names any text it removes
  without losing a reviewed rule (receipts 048 and 049); where none can go,
  the ceiling is raised in the same change to the measured bytes plus one 4 KB
  step with the rule named, or a dated acceptance at this order is recorded
  there and is the reopening observation, never trimmed around (criterion 7;
  the 2026-10-21 pass corrected the earlier clause "never by a raise", which
  contradicted that direction); the compiled
  subject carries no row ids (criterion 1); the inflow continues
  (criterion 1); the one-third cap is a quota on judgment (criterion 3); a
  settled row's case is shown failing with only its fix reverted, now
  criterion 2's own text (the 2026-10-20 pass);
  criterion 4's original form could not be met, and the 2026-10-19 pass
  rewrote it.
- WO-221 closed on 2026-10-19 after editing `harness-host.ts` and
  `contributor.ts`; WO-218 took WO-221's admission follow-ups in
  `registeredTargetAdmission` and closed on 2026-10-20 as v0.87.0, so this
  batch rebases on it; its own final review boarded D062's four admission
  and target-lifecycle findings, which step 19 takes.
- The four WO-218 rows (steps 18 to 21) are the one exception to one
  subsystem per batch: their subsystem's batch closed with no successor
  before WO-083's run, which crosses the target publish and close, the
  release close and the starter in the operator's fork; each decision
  names its reproduction under the bounded wrapper, and a rule the base no
  longer reproduces is declined with the output that shows it. The release
  and starter cases run in a disposable clone, never against origin. The executor reads the fork's committed WO-006 records
  (`docs/evidence/WO-006/host-qualification.md` in the operator's instance)
  for any observation of F13 to F19 before reproducing them (the 2026-10-21
  pass).
- The two REVIEW-007 rows (steps 22 and 23): the refs digest records
  rather than refuses on the explicit-commit route, because the operator
  may move refs while a review of a named commit runs; a fixture never
  pushes to a real remote; the operator-word advisory keeps D015's
  decision (advisory, with the typed refusal unchanged) and the
  records it names are not rewritten.
- The two fork rows are the operator's instance's reports, read from its
  committed planning document; a row the base does not reproduce is declined
  with the output that shows it.
- The Preflight-token row (the 2026-10-19 fork-requests pass): `--list`
  prints the plain selection only (34 product suites in core) and the
  machinery suites are reachable by `--only` alone, so the check resolves
  against the `suites` export, never against `--list`'s text; the kit
  drops 39 core-only suites, which is where a stale token bites.
- WO-217 (v0.89.0) and WO-223 (v0.88.0) closed after this order's last
  amendment (the 2026-10-21 pass). WO-217 rewrote
  `scripts/lib/gate-reuse.mjs`, moving the partial-row rule F20 names into
  `latestGateExecution` in `packages/skeleton/src/gate-evidence.mjs`, a
  registered source of several evidence editions whose edit owes the
  deterministic re-mint, and edited `harness-host.ts`, `contributor.ts`,
  `scripts/resume.mjs` and `scripts/release.mjs`; WO-223 edited
  `harness-host.ts`, `scripts/lib/target-publish.mjs`, `scripts/worktree.mjs`
  and `operatorWordFindings` in `scripts/docs-check.mjs` (step 23's file). The
  executor re-reads these at its base and reproduces F20 against
  `gate-evidence.mjs`.
- Receipt 048 (2026-10-19), written in by the 2026-10-21 pass: a row that asks
  planning to nominate an order is declined to planning, never designed by the
  executor, and the after table counts operator packets beside declines
  against the cap (criterion 3); six listed rows are candidate rows
  (FUP-b0418fa8b09362be, FUP-10996fedecfde047, FUP-dadc66e1f81f83a5,
  FUP-2304d46e6feb711b, FUP-568da2f2b62ee478, FUP-46deeb2483a9c28d), so the
  Non-goals exclude only unlisted candidates; a malformed pending lane is an
  advisory at `worktree start` (step 15).
- Receipt 049 (2026-10-19), written in by the 2026-10-21 pass: each fix to a
  hook, the register's validation or the kernel's replay identity records in
  its decision the base admission or replay output it keeps (criterion 2); a
  stalled batch leaves its rows allocated and invisible to `--touching`
  (criterion 1); the README names at activation the WO-192 router and WO-083
  lifecycle surfaces these rows sit on (criterion 1); a ceiling acceptance
  dated at this order is the reopening observation (criterion 7).
- Receipt 050 (2026-10-20), written in by the 2026-10-21 pass: three
  amendments grew the order from 41 to 50 rows across two named exceptions,
  against the Design's rejection of a verifier reading fifty surfaces
  (criterion 1); 28 of the 41 original excerpts open as planning or operator
  decisions and operator packets are uncapped (criterion 1);
  FUP-75563edf56be23b5 changes append serialization in
  `packages/kernel/src/store.ts`, so its cases replay every stored log fixture
  identically or the row is declined (criterion 2); steps 5 and 14 are
  documentation-only and settle under criterion 2's document clause;
  FUP-6004455b998fa646's remaining asks (an adapter for expansion-spelled
  redirects; the reviewer cold-start ceiling) are planning decisions, declined
  to planning with their reason or deferred as operator packets;
  FUP-ebaa803e38670545 and FUP-e835d826e9af5417 add verifier and reviewer role
  text against 281 bytes of reviewer headroom at `926b8234`, under the ceiling
  route of the receipts 046 and 047 bullet.

**Non-goals:** candidate rows of the register not listed above (ideas with
reopening conditions, 151 at the base), which planning disposes; rows of the
other batch (WO-220); new features beyond what a row asks; rewriting any filed
report.

**Operator-review assumptions**

1. At most one third of a batch's rows may be declined.
2. A row only the operator can decide leaves as an operator packet rather
   than blocking the batch.
3. The two remaining batches (WO-219, then WO-220) sit before WO-080; the
   operator may interleave them with the focus orders.
