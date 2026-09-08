# WO-068 — Resident host: one offline local process per launchpad folds the log, evaluates compiled cadences against a recorded clock, observes operator presence, and dispatches actor episodes of several kinds when a policy allows, stopping on return and resuming idempotently after a restart (version assigned at activation)

**Model:** any capable model for the host and fixtures; the live rows in
WO-099 use the actual harnesses. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new skeleton host and command, one
reactor slice, and an actor catalog with three kinds; no event schema
version change (new types under schema 1). Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the vision's first sentence (a local-first,
model-agnostic compiler and runtime) and the operator's 2026-09-08
mid-pass direction: the predecessor is a harness left open with crons; the
successor is an offline application that does the same with richer policies
and several actor kinds (agents, the two CLIs, local models, humans,
scripts). Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-067 merged (the policy whose cadences and phases this
host evaluates); WO-050 merged (the reserved slice this host's state lives
in; the recorded reactor-split condition); WO-009 merged (the transports and
worker store it dispatches through; satisfied at `v0.10.0`).
**Recommended placement:** immediately after WO-067 and WO-050; it adds
`packages/skeleton/src/resident-host.ts`, the `dotln resident` command, one
slice fold, and the actor catalog. A recommendation, not a dependency
token.

**Cites (read these sections):** 00-vision.md §The one-paragraph story;
01-principles.md Principle 2 (deterministic core; time is an input) and
Principle 15; 02-domain-model.md §Events and decisions (Cadence; `now` as
kernel environment) and §Actors and episodes; 03-architecture.md
§Operator-presence policy, §Session lifecycle & resilience and §Runtime
primitive catalogs (harness, orchestration, transport and execution
environment as separate rows); ADR-0007; `packages/kernel/src/core.ts`
(`KernelEnv.now`, cadences); `packages/skeleton/src/worker-host.ts`,
`worker-store.ts`, `worker-transport.ts`; `docs/discovery/local-inference.md`
(WO-027's probe, as the local-model reference).

**Objective:** `dotln resident` runs as one process per launchpad under an
exclusive lock: it folds the log into state, samples the wall clock and
records each sample as an event so that cadence evaluation is a pure
function of the log, observes operator presence from declared signals (an
explicit `resume: away` and `resume: back`; a heartbeat the compiled hooks
touch on each governed tool call; an idle threshold from the policy),
enters and advances presence phases per WO-067, and, when a cadence fires
in a phase that allows it, dispatches one actor episode through the actor
catalog: `cli-worker` (the two CLI transports), `script` (a declared
deterministic command with a declared effect class, run in the confined
worktree) or `human-handoff` (a decision packet written for the operator,
after which the resident waits); it dispatches nothing after the operator
returns, resumes from the log after a restart without repeating a dispatch,
and runs with no network of its own.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Every host runs when a command invokes it; nothing evaluates a cadence
  against time, observes presence, or dispatches without an operator
  present. The predecessor's crons do this from inside a harness; DotLn's
  runtime does not yet exist as a process.
- Cadences exist in the kernel and in the Entropy Reducer's compiled
  program; no consumer fires them.

**Design (scope discipline):**

- The clock is an input: `ClockSampled { at }` events are appended by the
  resident on each tick, and every cadence decision replays from them;
  replay of a resident log is byte-identical with the fake clock.
- Presence is a fold over `OperatorPresenceObserved { signal, at }` events
  from the three signal kinds; the policy's idle threshold derives
  `away`; return cancels per WO-067.
- The actor catalog is a typed table: kind, transport or command, effect
  class, availability probe; an unavailable actor yields a NoOp with the
  reason, never a fallback to another kind.
- `script` actors run under the execution environment's writable surface
  with their declared effect class checked against the phase envelope by
  `authorize`; `human-handoff` writes the packet under the control local
  directory and appends `HandoffRequested`.
- The lock and restart follow the worker store's exclusive-host pattern.
- **Declined alternatives, recorded:** the harness's own scheduler as the
  runtime (the product must run offline and harness-agnostic; a harness
  schedule is at most a launcher for this process, recorded by WO-044's
  rows); a daemon with its own network; a fallback between actor kinds.

**Deliverables:** the host and command, the events and slice fold, the
actor catalog with the three kinds, fixtures with a fake clock and doubles,
the write-backs below.

**Acceptance criteria (all required)**

1. With a fake clock and a fixture policy, the resident fires a cadence in
   the smallest phase and dispatches a double `cli-worker` episode; a
   `resume: back` before the next tick cancels further dispatch and the
   in-flight double is handled per the phase; the log replays
   byte-identically.
2. A restart mid-episode resumes from the log and does not dispatch a
   second episode; a second resident against the same launchpad refuses on
   the lock.
3. A `script` actor with an effect class outside the phase envelope is
   refused by `authorize` and recorded; inside it, it runs in the confined
   worktree and its result is an event.
4. A `human-handoff` writes the decision packet, appends the event, and the
   resident dispatches nothing until an answer event arrives.
5. An unavailable actor kind yields a NoOp event with the reason and no
   fallback dispatch.
6. Write-backs land: 03 §Operator-presence policy (the resident) and
   §Runtime primitive catalogs (the actor catalog), 02 §Actors and episodes
   (the events), README "What runs today" (one sentence), skeleton README
   runbook, ledger entry; the capability table gains a dated
   `runtime.resident` row at the fixture-evidenced level.
7. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** the mission check episode (WO-099); work derivation and the
portfolio (WO-100); the local-model transport (WO-110); the unattended live
proof (WO-111); any UI.

**Operator-review assumptions**

1. Three actor kinds are enough for the first resident; `local-model` joins
   through WO-110 and further kinds through the catalog.
2. The heartbeat signal is written by the compiled hooks, which is a
   generated-configuration change recorded in the bundle manifest.
