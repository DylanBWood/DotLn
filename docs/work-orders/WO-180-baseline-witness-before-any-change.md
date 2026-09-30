# WO-180 — Baseline witness before any change: a blinded episode on the sealed base snapshot reproduces the defect or walks the adjacent behavior a story names, records typed baseline evidence the verifier later compares against the candidate, and records honest non-reproduction as an environment limitation, never a pass (version assigned at activation)

**Model:** any capable model; the live rows run the actual local harnesses
as the episode's actor. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** minor. One new episode kind in the skeleton's
verification protocol and host, one evidence subject on matrix rows, one
control event; no change to the compiler's claim types (WO-058's) and no
gate step. Assigned at activation under the standing opt-out default.
**Cost:** adds a `baseline` episode to `packages/skeleton/src/verification-protocol.ts`
and the verification host (`VerificationHost`, the `worktree-snapshot`
subject WO-054 records as the base), a `subject: baseline` label on
host-run witness rows, one `BaselineWitnessed` event with the reproduced
or not-reproduced outcome and its environment limitation, fixtures on the
synthetic repository WO-056 used, two live rows (one per harness) on that
repository, and at most 400 bytes in product 03 §VerificationAdapter
edited in place. Removes: the step the roadmap's vertical promises and no
order lands ("Live Witness baseline: reproduce before changing; preserve
baseline evidence", product 06 §Source-to-deliverable vertical; product
03 §VerificationAdapter), so that a repair verified only against the
candidate can pass on a test that never failed on the base. Re-mints:
`verification-protocol.ts` is a registered evidence source, so the
editions it stales are re-minted deterministically; the executor checks
`FEEDBACK_SOURCE_PATHS` and runs one live feedback episode only if a
judged feedback source changes. Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** the operator's message of 2026-09-30 asking
whether product orders are missing after five machinery passes, captured
in ignored intake (SHA-256 in the ledger section); this pass's product
coverage check ([planning document](../planning/standard-pass-2026-09-30.md)
§7): the roadmap's vertical names this step, product 03 defines it, and no
queued order carries it (WO-112 and WO-123 compose SourceBundle,
StoryContract, surfaces, the source-change episode, browser witnesses,
verification and repair, commits, the pull request and the post-PR loop;
`grep` of the queued orders finds no baseline or reproduction step).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
public product text and repository records; no stop condition.
**Depends on:** WO-058 merged (both edit `verification-protocol.ts`; the
claim types land first); WO-054 merged (the sealed base and candidate
snapshots; closed); WO-056 merged (the live blinded loop this episode
joins; closed).
**Recommended placement:** paired with WO-176 in the third slot, the
delivery lane. This order edits `packages/skeleton/src/verification-protocol.ts`,
the verification host, its fixtures and product 03; WO-176 edits
`scripts/lib/paths.mjs`, `scripts/lib/intake-reconciliation.mjs`,
`scripts/worktree.mjs`, `scripts/release.mjs` and
`scripts/lib/lifecycle-evidence.mjs`. Disjoint files and no hard edge. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-058",
    "relation": "hard",
    "reason": "both edit packages/skeleton/src/verification-protocol.ts; the claim types land first"
  },
  {
    "workOrderId": "WO-054",
    "relation": "satisfied-by-close",
    "reason": "the sealed base and candidate snapshots the episode runs on"
  },
  {
    "workOrderId": "WO-056",
    "relation": "satisfied-by-close",
    "reason": "the live blinded verification loop this episode precedes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 03 §VerificationAdapter (the
Baseline first paragraph and the dual workflows), §DeliveryAdapter (the
`reproduced baseline` item); product 06 §Application version pending —
Source-to-deliverable vertical; `packages/skeleton/src/verification-protocol.ts`
(`findingContract`, the evidence worker request, the admission rules);
the verification host and `prepareWorktreeVerification` (WO-054, the
`VerificationOpened` baseline and candidate subjects); `packages/compiler/src/verification.ts`
(`VerificationFinding`, the matrix rows: read only, no claim type
changes); `docs/evidence/WO-054/implementation.md`;
`docs/evidence/WO-056/README.md` (the live rows' shape and the synthetic
repository); `docs/work-orders/WO-123-vertical-composition.md`
(the composition that sequences this episode); `docs/work-orders/WO-058-visual-and-network-claim-types.md`
(the surface shared).

**Objective:** before an implementation episode changes anything, a
blinded episode on the sealed base snapshot either reproduces the defect
the StoryContract names (the named test fails as described) or, for a new
story, runs the tests that exist on the touched surfaces and records
their outcome; its rows carry `subject: baseline`, `origin: host`,
`source: live`; the later verifier compares candidate rows with baseline
rows of the same test; and when the base cannot reproduce, the episode
records `not-reproduced` with the environment limitation, which the
composition treats as a typed stop for a defect story and as recorded
context for a new story.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. Product 03 §VerificationAdapter: "before any change, an episode runs
   the current base branch and reproduces the defect (or walks adjacent
   behavior for a new story), preserving baseline evidence; honest
   non-reproduction is recorded as an environment limitation, never
   faked." Product 06's vertical lists the step between the ImpactMap
   and the implementation episode.
2. WO-054's snapshot adapter records baseline and candidate subjects
   through `VerificationOpened`, and no episode runs on the baseline
   subject: WO-056's live rows verify the candidate; WO-112's objective
   and WO-123's composition name no baseline step; no queued order
   contains the words baseline, reproduce or live witness (this pass's
   search of `docs/work-orders/`).
3. Without it, a repair whose named test passes on the candidate is
   verified without evidence that the test failed on the base, and a
   defect the base does not reproduce is discovered after the change,
   not before.

**Design (scope discipline):** one episode kind, `baseline`, in the
existing protocol: it runs on the base subject of the sealed snapshot
under the same confinement and blinding as verification, executes the
contract's named tests (defect story: the failing regression evidence the
story names; new story: the existing tests of the surfaces WO-124
derives), and records each as a host-run witness row with
`subject: baseline`. One event, `BaselineWitnessed`, carries the outcome
(`reproduced`, `not-reproduced` with the limitation, `walked` for a new
story) and the rows' identity. The verifier's comparison is one added
rule: a candidate row whose baseline row of the same test did not fail,
for a defect story, is reported as a finding (the test did not witness
the defect). The composition (WO-123) sequences the episode after the
surfaces and before the implementation episode; a `not-reproduced`
outcome on a defect story is a typed stop there. Declined: a new claim
type in the compiler (WO-058's surface; the baseline is a subject label
on existing rows); running the baseline in the implementer's worktree (it
runs on the sealed base snapshot); faking reproduction by loosening the
test (the limitation is recorded).

**Deliverables:** the episode kind, the event, the subject label and the
comparison rule with fixtures; two live rows; the product 03 write-back;
the decisions.

**Acceptance criteria (all required)**

1. On WO-056's synthetic repository with its planted defect, the
   `baseline` episode on the sealed base records the named test failing
   with `subject: baseline`, `origin: host`, `source: live`, and
   `BaselineWitnessed` reads `reproduced`; on the repaired candidate the
   verifier's comparison reports no finding. A fixture asserts both.
2. With a story whose named test passes on the base, the episode records
   `not-reproduced` with a limitation text, and the composition's fixture
   (a double of WO-123's sequence) stops with a typed stop naming the
   story; for a story classed new, the episode records `walked` and the
   run continues.
3. A fixture in which the implementer's result supplies a baseline row
   is refused by the admission rules, as host-run rows are today.
4. Two live rows, one per harness (Claude Code and Codex as the episode's
   actor), on the synthetic repository, recorded in
   `docs/evidence/WO-180/` with the episode's confinement and the rows'
   identities; a harness unavailable to the executor is recorded as such
   with the pending row named.
5. Write-backs: product 03 §VerificationAdapter, one sentence in place
   naming the landed episode within 400 bytes;
   `docs/evidence/WO-180/decisions.md`; the decisions index; WO-123's
   catalog row names the step.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1 to 3; the live rows of
criterion 4; `npm test -- --review` before `implementation-ready`
(`verification-protocol.ts` is a declared machinery source); the editions
re-minted deterministically; a live feedback episode only if a judged
feedback source changes.

**Write-back duty:** product 03, in place; the order's decisions with
sources and reopening conditions.

**Non-goals:** the independent review episode (WO-181); the
deliverable-ready conjunction (WO-182); browser witnesses on the baseline
(WO-059's adapter may join later); any change to the compiler's claim
types or to what a verifier may fail; the composition itself (WO-123
sequences the episode).

**Operator-review assumptions**

1. The baseline runs on the sealed base snapshot WO-054 already records,
   so no new checkout or confinement is introduced.
2. Non-reproduction of a defect story stops the run before the change;
   the operator can waive that stop per run, and the waiver is recorded
   in the run's receipt.
