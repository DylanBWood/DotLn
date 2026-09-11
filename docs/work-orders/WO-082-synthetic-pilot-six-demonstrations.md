# WO-082 — Synthetic pilot: product 12's six demonstrations pass as automated fixtures over a real-Git launchpad with three target repositories (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Fixtures and evidence. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** WO-034's synthetic pilot, cut into a bounded
child at the operator's 2026-09-08 correction. Planner-synthesized draft.
Opaque identifier, not a priority. Clean-room screen: synthetic fixtures
only.
**Depends on:** WO-080 merged (the workstream the fixture exercises);
WO-072 merged (target worktrees from a launchpad); WO-075 merged (a fixture
launchpad exported with its build).
**Recommended placement:** after WO-080; it adds a real-Git fixture suite.
A recommendation, not a dependency token.

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
and what must be proved (the six demonstrations);
`docs/work-orders/WO-034-cross-repository-workstream-pilot.md` (the
umbrella's wording).

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

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- None of the six demonstrations has a fixture.

**Design (scope discipline):**

- Each demonstration is one named fixture with its own assertion; partial
  delivery is visible with its next safe action.
- **Declined alternatives, recorded:** a live run here (WO-083).

**Deliverables:** the fixture suite, the write-backs below.

**Acceptance criteria (all required)**

1. Each of the six demonstrations has a passing fixture; the fixtures prove
   that a green member check cannot make a stale or failing sibling green,
   that partial delivery is visible with its next safe action, and that an
   unrelated member continues when one repository is blocked.
2. Write-backs land: 12 (the demonstrations' status), ledger entry.
3. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 2.

**Non-goals:** the real run (WO-083); runtime transports as executors.

**Operator-review assumptions**

1. Synthetic fixtures are evidence for the mechanics, never for usefulness.
