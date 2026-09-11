# WO-099 — Mission check: a cadence-driven read-only verifier episode judges whether the active work is still inside its contract and on the vision's theses, and a drift holds unattended dispatch until a human or a repair clears it; first proven unattended (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the episode contract and fixtures; the
live row uses the actual harness as the verifier, operator-run. State the
model and effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One episode kind, one event type, one
hold rule; no schema version change. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the operator's 2026-09-08 mid-pass description
of the predecessor's first cron ("are we sure we understand the goal and
we're on mission?"); the plan refuter (WO-041), whose judge shape over the
vision theses this episode reuses for running work. Planner-synthesized
draft; captures and hashes in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-068 merged (the resident that dispatches the episode on a
cadence); WO-041 merged (the judge shape over the theses; closed); WO-010
merged (the verifier episode contract; satisfied at `v0.12.0`).
**Recommended placement:** immediately after WO-068; it adds the episode
protocol, the event and the hold, and a `mission-check` cadence in the
Contributor build's presence policy. A recommendation, not a dependency
token.

**Cites (read these sections):** 00-vision.md (the thesis headings the
refuter judges) and §What DotLn is not; 02-domain-model.md §Independent
verification v1 and §Feedback (semantic correction events);
`scripts/lib/plan-subject.mjs` (the thesis surfaces); `packages/skeleton/src/plan-refutation-protocol.ts`
and `verification-protocol.ts` (the judge and verifier shapes);
`docs/work-orders/WO-068-resident-host.md`.

**Objective:** A `mission-check` episode receives the active WorkOrder's
contract (and its StoryContract when one exists), the current diff against
the base, the last N decisions, and the vision theses, and returns
`MissionCheckObserved { verdict: on-mission | drift | unknown, findings[] }`
where a finding names the contract clause or thesis and an evidence
reference; a `drift` verdict appends a semantic correction event and holds
every unattended dispatch until a human answer or a verified repair clears
it; the resident dispatches the episode on the policy's cadence; a planted
drift is caught in fixtures and, once, unattended.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The refuter judges planning passes against the theses; nothing judges
  running work, and nothing runs while the operator is away.

**Design (scope discipline):**

- The episode is read-only (inspection profile); its input is a capsule
  with a hash, like a verification capsule; the verifier never sees the
  implementer's narrative.
- The hold is a gate in the resident's slice: `dispatchHeld { reason }`
  until `HoldCleared` from a human answer or a verification pass over a
  repair.
- **Declined alternatives, recorded:** a free-text "are we on mission"
  prompt with no typed verdict; letting the implementer clear its own hold.

**Deliverables:** the protocol, the event and hold, the cadence in the
Contributor policy, fixtures with doubles, one operator-run unattended row,
the write-backs below.

**Acceptance criteria (all required)**

1. With doubles, a session whose diff edits a file outside the declared
   surfaces yields `drift` naming the clause; a contract clause changed
   mid-episode yields `drift` naming the clause; an on-contract diff yields
   `on-mission`; an unavailable verifier yields `unknown` and holds.
2. A `drift` verdict appends the correction event and the hold; a
   fixture dispatch during the hold is refused; a human answer or a passing
   re-verification clears it.
3. One operator-run row: the operator marks `away`, the resident fires the
   cadence, a live verifier judges a session with a planted drift, the drift
   is held, and the receipt is filed from an outside terminal with
   identifiers reduced to shapes.
4. Write-backs land: 02 §Feedback (the correction event's producer), 03
   §Operator-presence policy (the hold), ledger entry; the capability table's
   `runtime.resident` row reassessed to the live-evidenced level.
5. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; the unattended row; `npm test`;
the evidence edition.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** repairing drift automatically (WO-055 and WO-100 compose
that later); judging planning passes (the refuter); any source change.

**Operator-review assumptions**

1. The operator runs the unattended row outside the sandbox.
2. A run that fails records its receipt under this order's evidence and does not close the order; dependents wait for an observed success, and the operator may withdraw the order with a dated note.
