# WO-160 — The machinery WO-111 exposed, fixed in one order: an amendment row can be withdrawn and an unmatched one is reported, `entropy subject` skips pre-mechanism receipts, `release prepare` says what it wrote, evidence JSONL registers beside its evidence, the integrate helper makes its own hookless commits and runs in a repair phase, a document-gate failure is labeled introduced or inherited, integration stashes are prunable, and an actor's own write counts as its read (v0.51.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The planning control log gains one
event type, `plan`, `worktree`, `harness prune` and the document runner gain
flags, and the registrations check reads a docs-side declaration; the operator-authorized item-8 observer change in `harness-host.ts` and
its affected generated/evidence refresh are the only package-source exception. Assigned at activation
under the standing opt-out default.
**Cost:** adds, across the nine items below, `PlanExecutionAmendmentWithdrawn`
and `amend-order --withdraw`; a reported (not silent) unmatched amendment
row in the continuation gate; a pre-mechanism filter in `unconsumedReview`;
a truthful `release prepare` message; a per-order evidence JSONL
declaration the registrations check reads; hookless preservation and merge
commits made by the integrate helper with their shas in the receipt, a
recorded phase, and stash adoption on a clean tree; `test:docs --against
<rev>` with an `introduced | inherited` label per failure; integration
stashes in `harness prune`; the own-write-counts-as-read rule in the
completion evidence check; one fixture per item. Removes: the orphaned
`plan-refutations.jsonl` row 22 that `plan check` passes only by failing to
match (WO-111 D019); the `undefined` paths and the unconsumable REVIEW-001
that `npm run entropy -- subject` printed on 2026-09-25; the false "no
files changed" line the WO-111 executor repeated (D010, D012); the
kernel-fixture edit every evidence-only order needs for a non-envelope
stream (WO-111 F3b); four reviewer-typed `core.hooksPath=/dev/null
--no-verify` commits (WO-064, WO-135, WO-136, WO-157) and three repair-phase
integrations with no rule (WO-045, WO-099, WO-142); the seven "inherited,
not a finding" judgments made by hand (WO-047, WO-052, WO-068, WO-110,
WO-131, WO-135, WO-151); eighteen retained integration stashes on
2026-09-25; the "outputs not read at current bytes" advisory on every
completion event (WO-111 control events 4, 8, 12, 14). D011 authorizes
the registered observer-source change and its affected authority evidence
refresh. Wall-clock, tokens and
context bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's 2026-09-25 dispatch ("fix
whatever nonsense occurred in wo-111 with your machinery nonsense"),
captured verbatim in ignored intake (SHA-256 in the ledger section), read
as the category "every DotLn machinery defect WO-111 exposed", which sets
aside the one-seam convention for this order as WO-157's authorization did
on 2026-09-22; the forensic reconstruction in the planning document §2
(fourteen failures classified, fifteen machinery items); the
`entropy subject` observation of this pass. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-157 merged (the integrate helper's intent-to-add refusal
and stash naming this order extends; closed, v0.45.0); WO-156 merged (the
sub-second plan check the inherited-failure rerun relies on; closed,
v0.46.2).
**Recommended placement:** paired with WO-161 directly after WO-158 and
WO-159. This order edits `scripts/lib/plan-receipts.mjs`,
`plan-continuation.mjs`, `entropy-review.mjs`, `release.mjs`,
`check-registrations.mjs`, `worktree-integration.mjs`, `test-runner.mjs`,
`harness-prune.mjs`, `lifecycle-evidence.mjs` and their fixtures; WO-161
edits the loadout and hook generators, the playbook, the security note, an
ADR and `test-process-debt.mjs`. D011 introduces shared generated/evidence
surfaces and fixture overlap; integration must reconcile those independently
validated subjects. Neither order depends on the other. A recommendation,
not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-157",
    "relation": "satisfied-by-close",
    "reason": "the integrate helper's intent-to-add refusal and stash naming this order extends"
  },
  {
    "workOrderId": "WO-156",
    "relation": "satisfied-by-close",
    "reason": "the sub-second plan check the inherited-failure rerun relies on"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/planning/off-ramps-5s-entropy-2026-09-25.md` §2 (the WO-111
reconstruction) and §5 (this order's items); `scripts/lib/plan-continuation.mjs`
lines 240–258 (the `amendments.find` that silently skips an unmatched row);
`scripts/lib/plan-receipts.mjs` (the `PlanExecutionAmended` writer and
validator); `docs/control/plan-refutations.jsonl` line 22;
`docs/evidence/WO-111/decisions.md` D010, D012, D017, D019;
`scripts/lib/entropy-review.mjs` `unconsumedReview` (the disposed set keyed
by `receiptId`, which pre-mechanism receipts lack) and the WO-151 record
that `REVIEW-001*` and `REFUTATION-001*` are pre-mechanism;
`scripts/release.mjs` lines 2016–2052 (the PR meter rewrite and the
`plan.edits`-only message); `scripts/check-registrations.mjs` and
`packages/kernel/test/fixtures/jsonl-protocols.json` (the two WO-111
entries); `docs/verifications/WO-111/VER-001.md` lines 268–282;
`scripts/lib/worktree-integration.mjs` lines 453–521 (stash push, apply,
never drop) and product 07 §Independent workflows and integration;
`docs/final-reviews/WO-136/FINAL-001.md` lines 298–306 (the hookless
commit habit, limit L4); `docs/evidence/WO-099/decisions.md` D028 and
`docs/evidence/WO-142/decisions.md` D010 (repair-phase integrations);
`docs/final-reviews/WO-135/FINAL-001.md` lines 196–222 and
`docs/final-reviews/WO-052/FINAL-001.md` lines 26–56 (gate red for an
outside cause); `scripts/lib/harness-prune.mjs`; `scripts/lib/lifecycle-evidence.mjs`
lines 87–90; `docs/control/orders/WO-111.jsonl`.

**Objective:** the nine defects the WO-111 cycle met in DotLn's own
machinery are fixed at their seam with a fixture each, so the next order
that meets one runs a command instead of improvising.

**Observed gap (dated 2026-09-25, `main` at `fa9957f1`):**

1. `plan-refutations.jsonl` line 22 binds an `orderHash` that exists in no
   checkpoint or commit; `plan-continuation.mjs` finds no match and treats
   the order as unchanged, so the gate passes by accident and nothing can
   record that the row is superseded (D019 says so in prose only).
2. `npm run entropy -- subject` names `REVIEW-001` (2026-09-04, no
   `receiptId`, no `EntropyReviewFiled` event) as the review to consume and
   prints `docs/instance/entropy-reducer/runs/undefined.md` for both paths;
   a disposal cannot clear it because the disposed set is keyed by the
   missing field. Its seven findings were repaired inside WO-023.
3. `release prepare --local` prints "remains current; no files changed"
   while rewriting the PR process-meter block (VER-001 m7).
4. Two WO-111 evidence streams needed entries in
   `packages/kernel/test/fixtures/jsonl-protocols.json`, a package-area
   edit inside an order whose text forbade one; each verifier had to rule
   it "test fixture, not runtime".
5. Reviewers typed `git -c core.hooksPath=/dev/null commit --no-verify`
   for preservation and merge commits in four orders because the hooks
   contend with their own rewrite; three orders integrated `main` during
   a repair phase with no rule saying so; `--continue` cannot adopt the
   integration's own stash on a clean tree (FUP-fd5f7c2b91095343).
6. A document-gate failure whose cause is on `main` ("red regardless of
   this PR") was judged by hand seven times; nothing labels it.
7. `git stash list` holds eighteen entries, ten of them named
   `WO-NNN integrate <date>` for published orders; nothing prunes them.
8. `lifecycle-evidence.mjs` lines 87–90 warn "outputs not read at current
   bytes" on every completion event for the file the actor just wrote.
9. `npm test` excludes the document suites, so an executor's green
   criterion reached verification with `test:docs` red (VER-001 B3).

**Design (scope discipline):**

- Item 1: `npm run plan -- amend-order WO-NNN --withdraw <row-ordinal>
  "<reason>"` appends `PlanExecutionAmendmentWithdrawn` binding the row's
  hashes; the continuation gate treats a withdrawn row as inert and reports
  an unmatched, un-withdrawn row by work order and ordinal instead of
  skipping it. Under this order the executor withdraws row 22 with D019 as
  the reason (an authorized planning-log append, not a rewrite).
- Item 2: `unconsumedReview` considers only reviews with an
  `EntropyReviewFiled` event; the output never carries `undefined`; `check`
  still verifies the pre-mechanism pair's bytes.
- Item 3: the message lists each file `release prepare` wrote.
- Item 4: a per-order `docs/evidence/WO-NNN/jsonl.json` (or a line the
  executor chooses in the evidence README) declares non-envelope streams;
  the registrations check reads it; the kernel fixture keeps protocol
  streams; the two WO-111 entries move.
- Item 5: the helper makes the preservation and merge commits itself with
  hooks disabled through its own `-c` flags and records the shas in the
  receipt; it is admitted in `repairing` and `final-review` and records the
  phase; `--continue` on a clean tree adopts the stash named for this
  integration. Product 07 §Independent workflows gains the sentence.
- Item 6: `npm run test:docs -- --against <rev>` reruns each failing check
  at `<rev>` (the merge base with `main` by default) and prints
  `introduced` or `inherited` per failure; the final-review report cites
  the label; an `inherited` label is an observation for the planner, never
  a repair.
- Item 7: `harness prune` lists integration stashes whose order has a
  published release on origin and, with `--apply`, drops them after
  writing the same bytes inventory it keeps for lanes.
- Item 8: a required output the session itself wrote last counts as read
  at those bytes.
- Item 9: the completion evidence check names the latest `test:docs` row
  for the current tree and prints an advisory when it is missing or red
  (advisory, per the WO-131 direction that completion never blocks on
  gate rows).
- **Declined alternatives, recorded:** rewriting row 22 (immutable log);
  deleting `REVIEW-001*` (pre-mechanism evidence keeps its bytes); folding
  `test:docs` into `npm test` (the product gate's duration is the reviewer's
  cost; the advisory is enough); dropping stashes at integration time
  (the reviewer skill's "never drop a stash" stands until publication).

**Deliverables:** the nine items with fixtures; the row 22 withdrawal; the
product 07 sentence; decisions per item.

**Acceptance criteria (all required)**

1. `amend-order --withdraw` appends the event; `plan check` passes with
   row 22 withdrawn and fails, naming the row, on a fixture log with an
   unmatched un-withdrawn row.
2. `entropy subject` on the current tree names REVIEW-003 or a later
   review, never a pre-mechanism one, and carries no `undefined`; `entropy
   check` still passes.
3. `release prepare` names every file it wrote; a fixture asserts the
   message against the files.
4. An evidence-only fixture order with a non-envelope stream passes
   `check-registrations` with no kernel fixture change; the two WO-111
   entries live beside their evidence.
5. The integrate helper's commits are made by the helper with hooks off,
   their shas in the receipt; a fixture runs it in `repairing`; `--continue`
   adopts its own stash on a clean tree (FUP-fd5f7c2b91095343 closes).
6. `test:docs -- --against` labels a fixture failure `inherited` when the
   same check fails at the base and `introduced` otherwise.
7. `harness prune` lists the published-order stashes with byte totals and
   removes only those under `--apply`, with the inventory written first;
   unpublished and unnamed stashes are retained with a reason.
8. A completion whose required outputs were last written by the session
   emits no read advisory; one whose output was changed by another writer
   still does.
9. `implementation-ready` prints the `test:docs` advisory on a fixture
   with no passing row and stays silent with one.
10. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
    new dependency; package source changes are limited to item 8's observer
    and the required component-version/evidence refresh (WO-160-D011).

**Evidence gate:** fixture transcripts; the row 22 withdrawal event;
`npm test` at final review. No live row.

**Write-back duty:** decisions per item; the product 07 sentence; at
close, FUP-fd5f7c2b91095343 and FUP-dcadda81305b4fb7 retargeted through
the adjacent queue.

**Non-goals:** the lifecycle events (WO-158); the Codex launcher
(WO-159); the console collection cost (WO-164); any change to what a gate
judges; deleting historical stashes without the inventory.

**Operator-review assumptions**

1. The operator's "fix whatever nonsense" authorizes the cross-seam bundle
   in the WO-157 shape; the executor may still split an item into a
   follow-up order if a seam turns out larger than its fixture.
2. Withdrawing row 22 is an authorized planning-log append under D019, not
   a new scope grant.

## Execution record

2026-09-25: the operator authorized the observer fix and required evidence
refresh after reviewing the missing write-time hash evidence. WO-160-D011
records this bounded exception to the package-source and edition fences; all
nine behaviors remain required.
