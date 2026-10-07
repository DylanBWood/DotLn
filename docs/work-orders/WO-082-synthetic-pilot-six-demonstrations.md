# WO-082 — Synthetic pilot: product 12's six demonstrations pass as automated fixtures over a real-Git launchpad with three target repositories (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
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

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. Scope decided by the 2026-10-07 pass (the no-code screen): this order demonstrates D1
   (one member reaches closed from a target worktree), D2 (the client proceeds against the
   pinned contract fixture while the service lands first), the refusal half of D4 (an
   occupied worktree refuses a second writer) and D6 (a session restart resumes from
   `resume next` in the target worktree under the emitted bundle). D3 (stale marks that
   spread from a service change to dependent members), the conflict half of D4, D5 (a
   blocked target naming its manual handoff) and a workstream-level next safe action need
   capability no order supplies; they are candidates in the planning map (reopen when an
   order builds them) and are not criteria here.
2. `scripts/test-workstream-pilot.mjs` (new). Import `./test-fixture-temporary.mjs` first.
   Build the service, client and docs target repositories with `runGit`
   (`scripts/lib/git.mjs`); export a launchpad with WO-074's command (its exact invocation at
   the base); write `dotln.config.json` with three `repositories` entries copying the
   `registeredRepository` helper from `scripts/test-configuration-root.mjs` line 71; record
   the clones in WO-072's registry (`scripts/lib/target-worktrees.mjs`); author `WS-001` under
   the workstreams root and three member orders carrying `**Repository:** <id> @ <sha>` and
   `**Workstream:** WS-001` (WO-080's convention).
3. Same file, four named tests, each asserting on JSON, never on terminal text
   (prose-parsing screen): "WO-082 D1 single repository: one member reaches closed from a
   target worktree" (`phase` from `resume status --json` and the member's record entry);
   "WO-082 D2 cross repository: client proceeds against the pinned contract fixture while
   service lands first" (the client base commit holds the fixture blob through
   `git rev-parse <sha>:<path>`, and the service close precedes it); "WO-082 D4 two
   workstreams on one repository: an occupied worktree refuses a second writer" (seed a
   foreign reservation with `seedHarnessWriter` from `packages/skeleton/dist/src/harness-host.js`
   and spawn the worktree's `.claude/hooks/concurrent-work-requires-worktrees.mjs` with a
   PreToolUse Edit payload on stdin, following `scripts/test-harness.mjs` line 4097 and
   `invoke` at line 1040; expect `hookSpecificOutput.permissionDecision` deny); "WO-082 D6
   session restart resumes from resume next in the target worktree under the emitted bundle"
   (run `node <launchpad>/scripts/resume.mjs next` from the worktree and
   `node <launchpad>/scripts/harness.mjs check --target <worktree>`). Which members are
   dependent comes from WO-080's JSON `edges`. Check: `node --test scripts/test-workstream-pilot.mjs`.
4. `scripts/test-runner.mjs`: `nodeTests("workstream-pilot", "scripts/test-workstream-pilot.mjs", { protects: "product 12's demonstrations hold over a real-Git launchpad and three targets" })`,
   a product row (not in `machinerySources`, not `document`); decide `needs: OUTSIDE_CONFINEMENT`
   by one confined run (unknown whether the hooks nest `sandbox-exec`). Check:
   `npm test -- --list`; `/usr/bin/time -p npm test -- --only workstream-pilot` for the
   suite's wall-clock; one fresh `/usr/bin/time -p npm test` for the six-minute condition.
5. Write-backs: product 12 §"## What exists and what must be proved" (the demonstrations'
   status, naming the four shown and the four candidates, in place);
   `docs/evidence/WO-082/README.md` (new: fixture transcripts and wall-clock) and
   `docs/evidence/WO-082/decisions.md` (new); `npm run meta`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
6. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-082/handoff.md`; `npm run resume -- implementation-ready <flags>`.

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
   and what must be proved (the demonstrations' status, in place with no dated paragraph (ceilings are planning's since the 2026-10-07 pass);
   WO-118, WO-080, WO-083, WO-193 and WO-194 also write 12); the decisions
   file; the publication locks refreshed.
3. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts with the suite's wall-clock;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `scripts/test-runner.mjs` is a declared source of runner-fixtures
and registrations, and again at final review. No live row.

**Write-back duty:** as listed in criterion 2.

**Known issues and carry-ins:**

- 2026-10-07 pass: this order was classified "patch, fixtures and
  evidence" while four of its six demonstrations needed capability nothing
  supplies (the WO-112 pattern); the scope is narrowed to the four
  demonstrations the tree and its dependencies supply, and the other four
  are candidates in the planning map. Stale and corrected: product 12's
  figures; WO-061 and WO-112 closed; `scripts/test-runner.mjs` also
  selects `configuration-root`.
- Decided by the 2026-10-07 pass: assertions read JSON records and
  `resume status --json` fields (prose-parsing screen); the suite is a
  product row counted against the six-minute condition.
- Blocked on WO-074 and WO-075 (the export), WO-072 (registration,
  `worktree start` on a target) and WO-080 (the convention and record).

**Non-goals:** the real run (WO-083); runtime transports as executors.

**Operator-review assumptions**

1. Synthetic fixtures are evidence for the mechanics, never for usefulness.
