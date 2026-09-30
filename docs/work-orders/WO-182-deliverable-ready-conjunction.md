# WO-182 — Deliverable-ready conjunction: the fourteen items product 03 names are evaluated from artifacts before a target pull request opens, each with its evidence reference or its explicit absence, the generated body states the result, and a run that requires readiness refuses publication while an item is unevidenced (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** minor. One typed checklist evaluated in
target publication, one section of the generated body, one opt-in refusal
flag; no change to the launchpad's own publication, no gate step.
Assigned at activation under the standing opt-out default.
**Cost:** adds `deliverableReady(artifacts)` beside `acceptanceStatuses`
in `scripts/github-body.mjs`, evaluating the fourteen items from the
episode store (current source revision, explicit contract, no unresolved
material ambiguity, reproduced baseline, repo-native implementation, no
unexplained scope, tests/build/lint, live behavior walked, visual claims
visually inspected, every acceptance criterion evidenced, independent
verification and review, final diff read, grounded body, monitored loop)
as `evidenced <ref>`, `absent <reason>` or `not-applicable <reason>`; a
`Deliverable-ready` section of the generated body; a
`--require-deliverable-ready` flag on `worktree publish --target` that
refuses before the first remote call while any item is `absent`, naming
the items; fixtures; at most 400 bytes in product 03 §DeliveryAdapter in
place. Removes: the "deliverable-ready" judgment that today lives in
prose only, so that a pull request can open with an unreproduced baseline
or an unreviewed diff and nothing in the body says so (WO-064 D-record:
requiring a passing matrix before publishing was not in that order).
Re-mints: `scripts/github-body.mjs` and `scripts/lib/target-publish.mjs`
are declared machinery sources and not registered evidence sources; no
live episode. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's message of 2026-09-30 (are
product orders missing?), captured in ignored intake (SHA-256 in the
ledger section); this pass's product coverage check ([planning document](../planning/standard-pass-2026-09-30.md)
§7): product 03 §DeliveryAdapter's conjunction checklist, product 06's
vertical ("evidence-grounded PR on a personal repo (the deliverable-ready
conjunction checklist, 03 §DeliveryAdapter)"), WO-064's generated body
(contract, acceptance matrix or its stated absence, host test outcomes,
diff summary) and its decision not to require readiness, and no queued
order naming the conjunction (this pass's search). Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: public product
text; no stop condition.
**Depends on:** WO-181 merged (the `independent verification and review`
item reads a review episode's event); WO-064 merged (the generated body
and target publication; closed); WO-066 merged (the monitored loop the
last item names; closed).
**Recommended placement:** paired with WO-177 in the fifth slot, the
delivery lane. This order edits `scripts/github-body.mjs`,
`scripts/lib/target-publish.mjs`, their fixtures and product 03; WO-177
edits `scripts/lib/entropy-review.mjs`, the three probes and their
documents. Disjoint files and no hard edge. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-181",
    "relation": "hard",
    "reason": "the review item reads the review episode's event"
  },
  {
    "workOrderId": "WO-064",
    "relation": "satisfied-by-close",
    "reason": "the generated body and target publication this extends"
  },
  {
    "workOrderId": "WO-066",
    "relation": "satisfied-by-close",
    "reason": "the monitored post-PR loop the last item names"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 03 §DeliveryAdapter (the
checklist and the projection boundary), §VerificationAdapter (the
baseline and review episodes); product 06's vertical and its exit
sentence; `scripts/github-body.mjs` (`acceptanceStatuses`, the body
sections, the outward lint); `scripts/lib/target-publish.mjs` (the
refusals before the first remote call, the episode store reads);
`docs/evidence/WO-064/decisions.md` D008 and D009 (the matrix must carry
exactly the contract's criteria); `docs/work-orders/WO-180-*.md` and
`WO-181-*.md` (the events the items read); `docs/work-orders/WO-112-core-run-loop-proof.md`
and `WO-118-*.md` (the runs that require readiness);
`docs/work-orders/WO-066-review-comment-resolution-loop.md`.

**Objective:** "deliverable-ready" is a computed conjunction, not a
sentence: each of the fourteen items is read from the episode store's
artifacts and events, the pull request body carries the table with an
evidence reference per item, and the loop's runs (WO-112, WO-118) publish
only when the conjunction holds, while an operator-run publish without
the flag still opens the proposal with its gaps stated.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. Product 03 names fourteen items and says "no single passing signal is
   ever done"; the generated body carries four of them (contract, matrix,
   test outcomes, diff summary) and states nothing about the rest.
2. WO-064 declined to require a passing matrix before publishing (the
   pull request is a proposal the operator reviews); that decision is
   kept for an operator-run publish and does not answer the loop's runs,
   which need a readiness rule that is not the operator.
3. Four items have no artifact to read until WO-180 and WO-181 land
   (reproduced baseline; independent review; the others read existing
   events: the source revision guard of WO-066, the matrix of WO-064, the
   witnesses of WO-054 and WO-059, the final diff read of the reviewer's
   session).

**Design (scope discipline):** a pure function over the episode store's
artifacts returns fourteen typed rows; each item names the artifact or
event it reads and the reason it is absent or not applicable (a story
with no visual claim makes the visual item not-applicable, never
evidenced); the body's section renders the rows through the existing
outward lint (no internal vocabulary); the flag refuses before the first
remote call with the absent items named, as WO-064's refusals do; the
launchpad's own publication (`worktree publish` for a DotLn order) is
untouched. Declined: refusing every publish (WO-064's decision stands for
the operator's own publish); a single "ready" boolean without rows (the
rows are the evidence); reading narrative (the items read artifacts).

**Deliverables:** the function and its rows, the body section, the flag,
fixtures; the product 03 write-back; the decisions.

**Acceptance criteria (all required)**

1. A fixture episode store holding every artifact yields fourteen
   `evidenced` rows with references that resolve; a store lacking the
   baseline event and the review event yields `absent` rows naming
   WO-180's and WO-181's events; a story without visual claims yields
   `not-applicable` for the visual item with its reason.
2. The generated body carries the `Deliverable-ready` section with the
   rows, passes the outward lint, and states the conjunction's result in
   one line; a fixture asserts the body and its lint.
3. `worktree publish --target <request> --require-deliverable-ready` on a
   store with one `absent` item refuses before any remote call, naming
   the item; without the flag the same store publishes (in the fixture's
   deterministic double) with the gaps stated in the body.
4. Write-backs: product 03 §DeliveryAdapter, one sentence in place
   within 400 bytes; `docs/evidence/WO-182/decisions.md`; the decisions
   index; WO-112's and WO-118's catalog rows name the flag.
5. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1 to 3; `npm test -- --review`
before `implementation-ready` (both files are declared machinery
sources); no re-mint; no live row (the deterministic publish double, as
WO-064 used).

**Write-back duty:** product 03, in place; the order's decisions.

**Non-goals:** the launchpad's own publication; refusing an operator-run
publish; the baseline and review episodes themselves (WO-180, WO-181);
the post-PR loop's classification (WO-066); a target's own CI.

**Operator-review assumptions**

1. The loop's runs require readiness and an operator's own publish does
   not; the flag is the difference, and WO-112 and WO-118 name it.
2. An item with no artifact source yet reads `absent` with the event
   named, so the checklist is honest before every producer has landed.
