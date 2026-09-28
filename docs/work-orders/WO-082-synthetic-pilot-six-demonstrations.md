# WO-082 — Synthetic pilot: product 12's six demonstrations pass as automated fixtures over a real-Git launchpad with three target repositories (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Fixtures and evidence. Assigned at
activation under the standing opt-out default.
**Cost:** adds one real-Git fixture suite that builds three target
repositories (service, client, documentation) and a launchpad exported by
WO-074 and WO-075, six named demonstration fixtures over one workstream,
the suite's row in `scripts/test-runner.mjs`, and at most 200 bytes in
product 12. Removes nothing that runs today: no demonstration has a
fixture. It unblocks WO-083, which depends on it. Re-mints: none; the
suite, its fixtures and `scripts/test-runner.mjs` are not registered
evidence sources. A suite in the product gate counts against the
stand-down plan's reversal condition, a fresh `npm test` above six minutes
on the operator's host, so the executor records the suite's wall-clock.
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-034's synthetic pilot, cut into a bounded
child at the operator's 2026-09-08 correction. Amended by the 2026-09-28
planning pass, which re-observed the order on `main` at `5f3849ec`: the
collision demonstration follows product 12's one writer per worktree, the
fixtures' claims declare their set, the write-back is bounded, the final
criterion names both gates, and register rows FUP-0050 (the synthetic
pilot), FUP-0070 (the sibling workflow pilot) and FUP-0126 (the workstream
application), each allocated to this order among others, are carried here
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: synthetic fixtures only.
**Depends on:** WO-080 merged (the workstream the fixture exercises);
WO-072 merged (target worktrees from a launchpad); WO-075 merged (a fixture
launchpad exported with its build).
**Recommended placement:** in the serial run, after WO-081 and two entries
after WO-080, its hard dependency; WO-072 and WO-075 sit earlier. This
order adds a real-Git fixture suite and its row in
`scripts/test-runner.mjs`, and edits product 12 and the decisions file;
WO-080 before it and WO-083 after it also edit product 12. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-080",
    "relation": "hard",
    "reason": "the workstream the fixture exercises"
  },
  {
    "workOrderId": "WO-072",
    "relation": "hard",
    "reason": "target worktrees from a launchpad"
  },
  {
    "workOrderId": "WO-075",
    "relation": "hard",
    "reason": "a fixture launchpad exported with its build"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 12-workstream-application.md §What exists
and what must be proved (the six demonstrations) and §One workstream across
repositories (two workstreams on one repository);
`packages/skeleton/src/loadouts/feedback.ts` (the writer unit, version 2);
`docs/planning/machinery-stand-down-2026-09-15.md` §8;
`docs/control/doc-ceilings.json`;
`docs/work-orders/WO-034-cross-repository-workstream-pilot.md` (history:
the umbrella's wording); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** A real-Git fixture builds three target repositories
(service, client, documentation) and a launchpad exported by WO-074 and
WO-075; one workstream with three member orders exercises: a
single-repository task; a cross-repository task whose client member
proceeds against a pinned contract fixture while the service member lands
first; a material source-revision change marking dependent member claims
stale without restarting unrelated members; two workstreams colliding on
one repository, refused by the one-writer rule and surfaced as coordination
work; an unavailable execution edge shown blocked with the manual handoff
named; and a session restart in a target worktree resuming from
`resume: next` under the emitted bundle.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- None of the six demonstrations has a fixture, and no workstream document
  exists.
- Pieces the demonstrations reuse have landed since: registered targets
  (WO-071, `v0.38.0`), the target-worktree harness bundle (WO-049,
  `v0.25.0`), the
  first live external source change (WO-053, `v0.29.3`) and the target
  publish path (WO-064, `v0.43.0`). The workstream grouping (WO-080),
  target worktrees (WO-072) and the exported launchpad (WO-074, WO-075) are
  queued.
- Product 12 lets two workstreams touch one repository with one writer per
  worktree, and the writer unit refuses a second writer into an occupied
  worktree on any branch; it does not refuse two workstreams that hold
  separate worktrees.
- Product 12 holds 17,997 bytes under a ceiling of 18,357 at `5f3849ec`;
  the executor re-measures at its base.

**Design (scope discipline):**

- Each demonstration is one named fixture with its own assertion; partial
  delivery is visible with its next safe action.
- The collision demonstration follows product 12: two workstreams keep
  separate worktrees of one repository. The fixture dispatches a second
  writer into the worktree the other workstream's member holds and shows it
  refused by the one-writer-per-worktree rule, and it shows a shared-file
  conflict between the two members, each in its own worktree, surfaced as
  coordination work before integration.
- The unavailable execution edge is a registered repository whose path is
  absent, shown blocked with the manual handoff named.
- **Declined alternatives, recorded:** a live run here (WO-083); two
  workstreams writing one worktree as the whole collision (product 12 gives
  each workstream its own worktree; reopen if product 12 changes that
  profile).

**Deliverables:** the fixture suite, the write-backs below.

**Acceptance criteria (all required)**

1. Each of the six demonstrations is one named fixture with its own
   assertion, and each passes. Within those fixtures, a member whose check
   is green leaves a stale or failing sibling stale or failing, partial
   delivery is shown with its next safe action, and an unrelated member
   continues while one repository is blocked. The criterion is judged
   against the declared set; a case outside it is a follow-up, not a
   failure.
2. Write-backs land, each in place with no dated paragraph: 12 §What exists
   and what must be proved (the demonstrations' status; at most 200 bytes
   added, against 360 bytes of headroom on 2026-09-28; WO-061, WO-112,
   WO-118, WO-080 and WO-083 also write 12, so the executor re-measures the
   headroom at its base, and where the bound does not fit it consolidates
   the section it edits in the same change; a ceiling is raised only by a
   planning-document decision); the decisions file; the publication locks
   refreshed.
3. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts with the suite's wall-clock;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `scripts/test-runner.mjs` is a declared source of runner-fixtures
and registrations, and again at final review. No live row.

**Write-back duty:** as listed in criterion 2.

**Non-goals:** the real run (WO-083); runtime transports as executors.

**Operator-review assumptions**

1. Synthetic fixtures are evidence for the mechanics, never for usefulness.
