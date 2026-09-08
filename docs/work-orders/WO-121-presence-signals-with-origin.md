# WO-121 — Presence signals with origin: human presence, actor liveness and task progress are distinct signals, tool activity from any session never implies the operator's return whichever process launched it, and return cancels only discretionary work (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One event shape, the hook heartbeat with
its event kind and origin, and the resident's presence fold; the committed
bundle regenerates. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 4): the first draft's heartbeat on every governed tool
call could not tell a worker's hook traffic from a human, and cancellation
on return was too broad; and the second refutation receipt of this pass
([2026-09-08-critical-path-003](../planning/refutations/2026-09-08-critical-path-003.md),
hold on criterion 1): the revised draft made the launch path the evidence
of a person's presence, so an operator-launched worker that kept working
after `away` could end the away phase. Planner-synthesized draft; the
captures' hashes are in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-068 merged (the resident whose presence fold this
defines); WO-067 merged (the policy's discretionary-phase scope for
cancellation); WO-044 merged (the rows that say which hook events a
scripted prompt fires in each launch mode).
**Recommended placement:** immediately after WO-068; it edits the resident's
presence fold, the generated hooks' heartbeat, and the loadout policy
fixtures. A recommendation, not a dependency token.

**Cites (read these sections):** ADR-0007; 03-architecture.md
§Operator-presence policy and §Candidate — progressive absence authority
and return readiness (return races); `packages/compiler/src/harness.ts`
(the hook text; the four hook events); `docs/work-orders/WO-067-presence-policy-compiled.md`
(`cancel-on-return`); `docs/work-orders/WO-044-writing-worker-harness-truth.md`
(the scripted-prompt rows).

**Objective:** `OperatorPresenceObserved { signal, origin, at }` where
`origin` is `human` (an explicit `away` or `back` command, from the terminal
or the console, or an interaction heartbeat: a prompt a person submits in a
session the resident did not launch), `actor` (an activity heartbeat, that
is a tool call, a tool result or a stop, from any session whichever process
launched it, carrying the episode id when the resident launched the session
and the session id otherwise; every heartbeat of a resident-launched
session, including its scripted prompt, is `actor`) or `task` (progress
events); the classifier is a pure function of the signal's hook event kind
and the resident's stamp and never reads the launch path or the process
table; the resident derives `away` from human-origin signals and the
policy's idle threshold only; actor heartbeats feed liveness and stall
detection, never presence; on return the resident cancels only phases the
policy marks discretionary, and an explicitly requested foreground task
continues under its own authority.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No presence signal exists; the first resident draft would have stopped
  its own work on its worker's first tool call, and the revised draft would
  have ended `away` on the first tool call of a worker the operator had
  launched before leaving.

**Design (scope discipline):**

- The generated hooks write a heartbeat carrying the hook event kind:
  `UserPromptSubmit` is an interaction heartbeat; `PreToolUse`,
  `PostToolUse` and `Stop` are activity heartbeats. A session the resident
  launched carries the resident's stamp with its episode id in its
  environment, and every heartbeat from it is `actor`. An unstamped
  session's activity heartbeats are `actor` with its session id and no
  episode; only its interaction heartbeats are `human`.
- Where a harness's non-interactive launch fires the interaction event for a
  scripted prompt, WO-044's rows say so; the resident treats an unstamped
  session's prompt as `actor` when the row makes a non-interactive session
  detectable, and where it does not, the explicit `away` and `back` commands
  are the only human-origin signals for that harness and the idle threshold
  applies to them. The rule fails toward `actor`; presence is never
  inferred.
- **Declined alternatives, recorded:** inferring presence from process
  tables or input devices; treating any activity as presence; the launch
  path as presence evidence (an operator-launched worker keeps working after
  the operator leaves).

**Deliverables:** the event shape, the hook change, the fold, fixtures, the
regenerated bundle, the write-backs below.

**Acceptance criteria (all required)**

1. With a fake clock, after an explicit `away`, a stream of activity
   heartbeats from a resident-launched worker (stamped, with its episode id)
   and from an operator-launched autonomous worker (unstamped, its tool
   calls, tool results and stops) never ends the `away` phase and never
   triggers cancel-on-return: a negative fixture asserts that no phase
   change and no cancellation are recorded. An explicit `back`, and
   separately an interaction heartbeat from an unstamped session (a
   submitted prompt), each end `away`; a stamped session's scripted prompt
   does not. A fixture proves the classifier is a pure function of the
   event kind and the stamp by feeding the same signals with the launch
   path swapped and asserting identical decisions. All pinned fixtures.
2. On return, a discretionary in-flight episode is handled per the phase and
   an explicitly requested foreground task continues to completion (fixture).
3. A stalled actor (no heartbeat within its budget) is detected as a
   liveness failure, not as a presence change.
4. The regenerated bundle differs from the base only in the heartbeat hooks
   and pins; `harness check` passes; the WO-039 hook fixtures pass.
5. Write-backs land: 03 §Operator-presence policy (the three origins and the
   event-kind rule), ADR-0007 §Amendments (a dated note), ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency; a fresh
   feedback evidence edition because generated hooks changed.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the actor kinds (WO-122); authenticated presence; inferring
presence from process tables, input devices or launch paths.

**Operator-review assumptions**

1. A prompt a person submits in an unstamped session is the
   human-interaction signal; where a harness cannot tell a scripted prompt
   from a typed one, only explicit `away` and `back` count as human in that
   harness.
