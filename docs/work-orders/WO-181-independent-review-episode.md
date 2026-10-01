# WO-181 — Independent review episode: a blinded, read-only episode distinct from the behavior verifier judges the candidate diff against the contract and the repository's conventions, returns typed findings under the finding contract, never edits the branch, and its minor suggestions never widen scope (v0.61.0)

**Model:** any capable model; the live rows run the actual local harnesses
as the reviewer. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** minor. One new episode kind and one finding
class in the skeleton's verification protocol, one control event, one
route into bounded repair; no gate step. Assigned at activation under the
standing opt-out default.
**Cost:** adds a `review` episode to `packages/skeleton/src/verification-protocol.ts`
and its host (a read-only snapshot of the candidate, the contract, the
diff and the repository's declared conventions; no narrative from the
implementer), a `review` class on `VerificationFinding` rows with
severities `blocking`, `should`, `nit`, one `ReviewCompleted` event, the
route of `blocking` findings into WO-055's bounded repair and of the rest
into the deliverable body as known items, fixtures, two live rows (one
per harness) on WO-056's synthetic repository, and at most 400 bytes in
product 03 §VerificationAdapter in place. Removes: the second independent
judgment the roadmap's vertical promises and no order lands ("blinded
behavior verification and independent code review, two separate
episodes"), so that today the only judge of a candidate is the behavior
verifier and maintainability, scope and repository-native form are judged
by nobody. Re-mints: `verification-protocol.ts` is a registered evidence
source (deterministic re-mint; a live feedback episode only if a judged
feedback source changes). Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** the operator's message of 2026-09-30 (are
product orders missing?), captured in ignored intake (SHA-256 in the
ledger section); this pass's product coverage check ([planning document](../planning/standard-pass-2026-09-30.md)
§7): product 03 §VerificationAdapter ("Verification and review are
separate independent episodes: the reviewer reports findings, may not
silently rewrite the branch, and its minor suggestions never auto-expand
scope"), product 06's vertical, and no queued order naming a review
episode (this pass's search). Planner-synthesized. Opaque identifier, not
a priority. Clean-room screen: public product text; no stop condition.
**Depends on:** WO-180 merged (the same protocol surface; the baseline
rows the reviewer reads); WO-058 merged (the same surface; the claim
types); WO-055 merged (bounded repair the blocking findings route to;
closed); WO-056 merged (the blinded live loop; closed).
**Recommended placement:** paired with WO-178 in the fourth slot, the
delivery lane. This order edits `packages/skeleton/src/verification-protocol.ts`,
its host, fixtures and product 03; WO-178 edits
`packages/skeleton/src/harness-host.ts`, `scripts/refute-plan.mjs`,
`scripts/lib/plan-failures.mjs`, `scripts/docs-check.mjs` and
`scripts/work-orders.mjs`. Disjoint files and no hard edge. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-180",
    "relation": "hard",
    "reason": "the same protocol surface and the baseline rows the reviewer reads"
  },
  {
    "workOrderId": "WO-058",
    "relation": "hard",
    "reason": "both edit packages/skeleton/src/verification-protocol.ts; the claim types land first"
  },
  {
    "workOrderId": "WO-055",
    "relation": "satisfied-by-close",
    "reason": "bounded repair, where blocking findings route"
  },
  {
    "workOrderId": "WO-056",
    "relation": "satisfied-by-close",
    "reason": "the blinded live loop the review joins"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 03 §VerificationAdapter (the
separate-episodes sentence), §DeliveryAdapter (the `independent
verification and review` and `final diff read` items); product 06's
vertical; `packages/skeleton/src/verification-protocol.ts`
(`findingContract`, the evidence worker request, the blinding of the
implementer's narrative); `packages/compiler/src/verification.ts`
(`VerificationFinding`); `docs/evidence/WO-056/README.md` (the finding
contract the host enforces, the two live rows); `docs/evidence/WO-055/implementation.md`
(bounded repair's input); `docs/work-orders/WO-123-vertical-composition.md`;
`docs/work-orders/WO-066-review-comment-resolution-loop.md` (the
post-PR loop the review's known items must not duplicate).

**Objective:** after behavior verification passes, a second blinded
episode, a different session from the verifier's and the implementer's,
reads the sealed candidate, the diff, the StoryContract, the baseline and
candidate rows and the repository's declared conventions, and returns
typed `review` findings: `blocking` (a maintainability, scope or
convention defect that must be repaired before delivery), `should` and
`nit` (recorded in the deliverable body as known items, never repaired
without the operator). It edits nothing.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. Product 03 names the two judgments as separate independent episodes;
   product 06's vertical lists "blinded behavior verification and
   independent code review (two separate episodes)". WO-010, WO-054,
   WO-055 and WO-056 landed verification and repair; no order lands the
   review episode, and WO-112's objective composes verification and
   repair only.
2. The finding contract exists and is enforced on the verifier
   (`findingContract`, WO-056's first failed attempts found it had never
   been told to the verifier); a review that returns findings under the
   same contract needs no second vocabulary.
3. WO-066's post-PR loop resolves automated review comments from the
   forge; nothing reviews the candidate before the pull request.

**Design (scope discipline):** one episode kind, `review`, over the
sealed candidate snapshot with the same blinding as verification (no
implementer narrative; the contract, the diff, the rows and the
repository's declared conventions, read from a conventions file or the
class documents WO-073 will own, absent today and recorded as absent);
findings under the existing contract with class `review` and one of
three severities; `ReviewCompleted` records the counts and identities;
the composition (WO-123) routes `blocking` findings to bounded repair
(WO-055) and re-verification, and hands `should` and `nit` rows to the
deliverable body (WO-182) as known items; the reviewer cannot write to
the snapshot (the host's read-only permissions, checked as WO-054 checks
them). Declined: merging review into the verifier's episode (product 03
separates them; the verifier answers "does it work", the reviewer "is
this the right implementation to ship"); an auto-applied nit (scope
expansion, forbidden by product 03); a reviewer that runs the product
gate (it reads rows).

**Deliverables:** the episode kind, the finding class and severities, the
event, the routes with fixtures; two live rows; the product 03
write-back; the decisions.

**Operator scope expansion (2026-10-01; WO-181-D008):** prepare the pinned
Playwright headless Chromium automatically in the existing bootstrap for
future worktrees, before printing a ready/launch handoff. Use the installed
lockfile-pinned CLI and the same cache the browser suite selects; retain
explicit cache overrides. A setup failure preserves the checkout and names
the retry. Prove a fresh worktree, cache reuse and failed-setup behavior.
Do not retrofit existing worktrees or turn unavailable browser evidence into
a passing gate. Bounded surfaces: `scripts/bootstrap.mjs`, its tests in
`scripts/test-process-debt.mjs`, fresh-worktree evidence in
`docs/evidence/WO-181/`, package setup instructions and product 07's existing
bootstrap paragraph; update the catalog carrier and publication locks.

**Acceptance criteria (all required)**

1. On WO-056's synthetic repository with a repaired candidate carrying one
   planted convention defect (a name outside the repository's declared
   convention) and one planted scope defect (a changed file the contract
   never names), the review episode returns one `blocking` finding for
   each with the rule each must hold; a fixture asserts both and the
   absence of any write to the snapshot.
2. A fixture in which the reviewer's result carries a file edit or a
   diff is refused by the admission rules with the reason named.
3. The composition double routes a `blocking` finding to bounded repair
   and re-verification and a `should` finding to the deliverable body's
   known items; the double asserts no repair is dispatched for `should`
   or `nit`.
4. Two live rows, one per harness, on the synthetic repository, recorded
   in `docs/evidence/WO-181/` with the session identities showing the
   reviewer's session differs from the verifier's and the implementer's;
   a harness unavailable to the executor is recorded as such with the
   pending row named.
5. Write-backs: product 03 §VerificationAdapter, one sentence in place
   within 400 bytes; `docs/evidence/WO-181/decisions.md`; the decisions
   index; WO-123's catalog row names the step.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.
7. Future worktree bootstrap prepares its pinned headless Chromium before
   readiness without a separate operator install step; a fresh-worktree
   executable proof launches it, a cached retry succeeds without a download,
   cache overrides retain their selection, and a failed preparation cannot
   advertise readiness. Existing worktrees are not retrofitted.

**Evidence gate:** the fixtures of criteria 1 to 3; the live rows;
`npm test -- --review` before `implementation-ready`; the editions
re-minted deterministically; a live feedback episode only if a judged
feedback source changes.

**Write-back duty:** product 03, in place; the order's decisions.

**Non-goals:** the baseline episode (WO-180); the deliverable body
(WO-182); a conventions file or repository class document (WO-073; absent
conventions are recorded as absent, and the reviewer judges against the
contract and the diff alone); resolving forge review comments (WO-066);
any change to what the behavior verifier may fail.

**Operator-review assumptions**

1. A reviewer that only reports, with `blocking` routed to the same
   bounded repair the verifier uses, is the separation product 03 asks
   for; the reviewer's session identity is the evidence of independence.
2. Without a declared conventions source the review judges scope and
   contract fit; convention findings wait for WO-073's documents, and
   the order records that limit.
