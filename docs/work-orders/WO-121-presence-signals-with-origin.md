# WO-121 — Presence signals with origin: human presence, actor liveness and task progress are distinct signals, a resident-launched actor's tool calls never imply the operator's return, and return cancels only discretionary work (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One event shape, the hook heartbeat with
origin, and the resident's presence fold; the committed bundle regenerates.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 4): the first draft's heartbeat on every governed tool
call could not tell a worker's hook traffic from a human, and cancellation
on return was too broad. Planner-synthesized draft; the capture's hash is in
the ledger section of that date. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-068 merged (the resident whose presence fold this
defines); WO-067 merged (the policy's discretionary-phase scope for
cancellation).
**Recommended placement:** immediately after WO-068; it edits the resident's
presence fold, the generated hooks' heartbeat, and the loadout policy
fixtures. A recommendation, not a dependency token.

**Cites (read these sections):** ADR-0007; 03-architecture.md
§Operator-presence policy and §Candidate — progressive absence authority
and return readiness (return races); `packages/compiler/src/harness.ts`
(the hook text); `docs/work-orders/WO-067-presence-policy-compiled.md`
(`cancel-on-return`).

**Objective:** `OperatorPresenceObserved { signal, origin, at }` where
`origin` is `human` (an explicit `away`/`back`, or a heartbeat from a
session the resident did not launch), `actor` (a heartbeat from a
resident-launched session, carrying the episode id) or `task` (progress
events); the resident derives `away` from human-origin signals and the
policy's idle threshold only; actor heartbeats feed liveness and stall
detection, never presence; on return the resident cancels only phases the
policy marks discretionary, and an explicitly requested foreground task
continues under its own authority.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No presence signal exists; the first resident draft would have stopped
  its own work on its worker's first tool call.

**Design (scope discipline):**

- The generated hooks write the heartbeat with the session's origin, which
  the resident stamps into the launched session's environment; a session
  without the stamp is human by default.
- **Declined alternatives, recorded:** inferring presence from process
  tables; treating any activity as presence.

**Deliverables:** the event shape, the hook change, the fold, fixtures, the
regenerated bundle, the write-backs below.

**Acceptance criteria (all required)**

1. With a fake clock, a stream of actor-origin heartbeats never ends an
   `away` phase, while one human-origin signal does; both are pinned
   fixtures.
2. On return, a discretionary in-flight episode is handled per the phase and
   an explicitly requested foreground task continues to completion (fixture).
3. A stalled actor (no heartbeat within its budget) is detected as a
   liveness failure, not as a presence change.
4. The regenerated bundle differs from the base only in the heartbeat hook
   and pins; `harness check` passes; the WO-039 hook fixtures pass.
5. Write-backs land: 03 §Operator-presence policy (the three origins), ADR-0007
   §Amendments (a dated note), ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency; a fresh
   feedback evidence edition because generated hooks changed.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the actor kinds (WO-122); authenticated presence.

**Operator-review assumptions**

1. A session without the resident's stamp is human by default.
