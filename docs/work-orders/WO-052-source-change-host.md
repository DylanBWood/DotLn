# WO-052 — Source-change host: a worker episode in a governed target worktree is recorded as typed events with the commit identity as its effect receipt, so recovery is idempotent (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds one event family and one host
branch to the skeleton and one slice fold to the reactor; the event schema
version is unchanged (new types under schema 1), and no hash preimage moves.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
D2, the host slice), cut as a bounded order at the operator's same-day
correction. Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-050 merged (the reserved slice this branch fills; the
recorded reactor-split condition); WO-051 merged (the transport profile it
dispatches); WO-049 merged (the bundle it emits into the target worktree
before dispatch); WO-009 merged (worker store, leases, recovery; satisfied
at `v0.10.0`).
**Recommended placement:** after WO-049, WO-050 and WO-051; it edits
`packages/skeleton/src/reactor.ts` (one slice), a new
`source-change-host.ts`, `worker-store.ts` (the receipt) and product 02. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-050",
    "relation": "hard",
    "reason": "the recorded reactor-split condition: the slice exists before the branch"
  },
  {
    "workOrderId": "WO-051",
    "relation": "hard",
    "reason": "the transport profile it dispatches"
  },
  {
    "workOrderId": "WO-049",
    "relation": "hard",
    "reason": "the bundle it emits into the target worktree before dispatch"
  },
  {
    "workOrderId": "WO-009",
    "relation": "satisfied-by-release",
    "release": "v0.10.0",
    "reason": "worker store, leases and recovery"
  },
  {
    "workOrderId": "WO-045",
    "relation": "reference-only",
    "reason": "positive payload decoding shares WO-045's shape when it has landed"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Actors and episodes
(WorkerDispatched, WorkerResultObserved, quarantine) and §Events and
decisions (new types under schema 1); 03-architecture.md §Session lifecycle
& resilience (the disposable inspection host; leases; kill and recovery
rows) and §Platform and instance boundary; `packages/skeleton/src/worker-host.ts`
(the inspection host this order mirrors), `worker-store.ts`
(`saveResult`, receipts), `reactor.ts` (the reserved slice);
`docs/evidence/WO-009/README.md` (rows 2, 4 and 6: kill and recovery);
`docs/work-orders/WO-049-target-worktree-bundle.md` (`harness emit --out`).

**Objective:** Add the host that turns one compiled WorkOrder into one
source-change episode: create the target worktree from the declared base in
the target repository, emit the governed bundle into it (WO-049), record the
host's own pre-dispatch check of the focused test, dispatch the
`source-change-v1` worker (WO-051), observe the result and the worktree's
commit identity, record `SourceChangeRequested`, `SourceChangeObserved` and
`SourceChangeRefused` events in the reserved slice, persist the commit
identity as the effect receipt, and recover after a kill by that identity
without a second commit.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The inspection host records `WorkerDispatched` and `WorkerResultObserved`
  and has no effect receipt because its workers have no effects; a
  source-change episode's effect is a commit, which must be recorded so
  that recovery reads the repository rather than re-dispatching.
- No host creates a worktree in a repository other than this one; the
  worktree helper creates sibling worktrees of the launchpad only.

**Design (scope discipline):**

- `SourceChangeRequested { workOrderId, repo, baseCommit, branch, surfaces }`,
  `SourceChangeObserved { workOrderId, commit, branch, diffHash, testBefore, testAfter }`
  and `SourceChangeRefused { workOrderId, reason }` as new event types under
  schema 1, folded by the reserved slice from WO-050; payload shapes are
  positive-decoded (WO-045's shape if landed, a local decoder otherwise).
- The host: `git worktree add` from the declared base in the target
  repository under the configured worktree parent; `harness emit --out`
  with the launchpad runtime root; run the WorkOrder's focused test command
  and record its result as `testBefore`; dispatch; on result, read
  `observedCommit`, compute the diff hash against the base, run the focused
  test again as `testAfter`, and append `SourceChangeObserved`; on a result
  without a commit append `SourceChangeRefused`.
- Recovery: a lease that expired after `SourceChangeRequested` reads the
  worktree first; if a commit on the episode branch exists above the base,
  the host appends `SourceChangeObserved` from it and does not re-dispatch;
  otherwise it re-dispatches exactly once under the existing lease rules.
- The worktree is removed only by an explicit `finish` after the receipt is
  persisted; the tool never rebases, force-deletes or discards.
- **Declined alternatives, recorded:** pushing from the host (a remote effect
  is WO-064's); a generic effect-receipt framework (one receipt kind has one
  consumer); re-dispatching on every recovery (a second commit is the
  failure the receipt prevents).

**Deliverables:** the event types and slice fold; the host; the receipt in
the worker store; fixtures with a real-Git scratch target and process
doubles; the write-backs below.

**Acceptance criteria (all required)**

1. Against a real-Git scratch target with process doubles, one episode
   creates the worktree from the declared base, emits the bundle, records
   `testBefore` failing, receives a double's commit, records `testAfter`
   passing and `SourceChangeObserved` with the commit sha, branch and diff
   hash; the launchpad checkout's `HEAD` and tree hash and a sentinel
   directory beside the worktree are unchanged.
2. A kill after the double commits and before the result persists recovers
   by reading the branch and appends `SourceChangeObserved` without a second
   dispatch; a kill before the commit re-dispatches exactly once; both are
   fixtures in the lease and recovery suite.
3. A double that returns no commit yields `SourceChangeRefused` with the
   reason, and the worktree holds no commit above the base.
4. The reactor diff adds exactly one slice fold and touches no other slice
   (a recorded diff); every existing trace replays byte-identically.
5. Write-backs land: 02 §Actors and episodes (the three event types and the
   receipt rule), 03 §Session lifecycle & resilience (recovery by commit
   identity), skeleton README runbook, ledger entry; the capability table
   gains a dated `worker.source-change` row at the fixture-evidenced level.
6. `npm test` green; `git diff --check` clean; no new dependency; no schema
   version or hash preimage change; the regenerated bundle pins and a fresh
   feedback evidence edition because runtime source changed.

**Evidence gate:** the fixture transcripts; the reactor diff; `npm test`;
the evidence edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the live episode itself (WO-053); pushing or pull requests
(WO-064); verification over the worktree (WO-054); several repositories;
any UI.

**Operator-review assumptions**

1. New event types under schema 1 are additive and need no schema bump; the
   reviewer may require a schema note in product 02.
