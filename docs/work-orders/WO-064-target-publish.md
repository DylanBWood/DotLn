# WO-064 — Target publish: push a source-change branch and open its pull request on the target repository under an explicit remote grant with operator provenance, with a title and body generated from the contract, diff and evidence, never from narrative (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model; the live smoke is operator-run against a
scratch remote. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The first remote effect under compiled
authority: a publish path for target-worktree orders in the worktree helper
and a body generator over artifacts. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H, the publish slice, carved from WO-033 phase 2), cut as a bounded order at
the operator's same-day correction; the parity items "great PR body and
title". Planner-synthesized draft; captures and hashes in the ledger section
of that date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-052 merged (a branch to publish exists only after a
source-change episode); WO-063 merged (every outward artifact passes the
lint first); WO-042 merged (the remote effect runs under an explicit grant
with `operator` provenance).
**Recommended placement:** after WO-053's receipt, in any free lane; it
edits `scripts/worktree.mjs` (a target publish path), `scripts/github-body.mjs` (the body generator) and their fixtures. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-052",
    "relation": "hard",
    "reason": "a branch to publish exists only after a source-change episode"
  },
  {
    "workOrderId": "WO-063",
    "relation": "hard",
    "reason": "every outward artifact passes the lint before the remote effect"
  },
  {
    "workOrderId": "WO-042",
    "relation": "hard",
    "reason": "the remote effect runs under an explicit grant with operator provenance"
  },
  {
    "workOrderId": "WO-053",
    "relation": "reference-only",
    "reason": "the live branch it first publishes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Identity and
composition (AuthorityEnvelope; `repo.push`; grants with provenance after
WO-042); 03-architecture.md §Platform and instance boundary;
07-execution-guide.md §Workflow closeout and releases; `scripts/worktree.mjs`
(`publish`), `scripts/github-repository.mjs` (the helper and its stub), `scripts/github-body.mjs`, `scripts/test-github-body.mjs`;
`docs/work-orders/WO-033-compiled-starter-export.md` §Phase 2 (the
umbrella's original wording).

**Objective:** `worktree publish` for a target-worktree order pushes the
episode branch to the target's remote and opens the pull request through the
existing GitHub helpers only when the compiled WorkOrder's effective
envelope allows `repo.push` and `pr.open` through an `authorityGrants` entry
with `operator` provenance; the title and body are generated from the
StoryContract or WorkOrder contract, the diff summary and the acceptance
matrix; every artifact passes WO-063's lint; the receipt records the
pull-request identity as a shape.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `worktree publish` opens pull requests on this repository only; no path
  publishes a branch that a worker produced in another repository, and no
  remote effect has ever run under a compiled grant.

**Design (scope discipline):**

- The publish path reads the order's repository and branch from the
  `SourceChangeObserved` receipt, refuses without the grant, refuses a lint
  failure, pushes with the existing helper, opens the pull request with the
  generated body, and appends a `PullRequestOpened` event (number, head sha,
  repository id; no URL host beyond the repository id).
- The body generator is pure over artifacts and has no free-text input.
- **Declined alternatives, recorded:** merging or releasing on the target
  (never); a body written by the worker (narrative).

**Deliverables:** the publish path, the generator, the event, fixtures over
the `gh` stub, a live smoke record, the write-backs below.

**Acceptance criteria (all required)**

1. Over a fixture target and the `gh` stub, publish refuses without the
   grant, refuses on a lint failure naming the rule, and with both satisfied
   pushes and opens the pull request with a body generated from the
   artifacts (pinned fixture).
2. The generated body contains no launchpad vocabulary, no DotLn file path
   and no worker narrative, proven by the lint and a fixture grep.
3. A live smoke, operator-run against a scratch remote, records the pushed
   branch and the opened pull request as shapes.
4. Write-backs land: 07 §Workflow closeout and releases (target publish),
   02 (the event), ledger entry; the capability table gains a dated
   `delivery.pull-request` row.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the smoke record; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** observing the pull request (WO-065); merging; releases on the
target; per-repository release policy.

**Operator-review assumptions**

1. The grant is authored in the worker loadout by the operator for the
   target repository; the reviewer confirms its provenance value.
