# WO-068 — Resident host: one offline local process per launchpad folds the log, records each clock sample as an event, drives the compiled presence statechart, dispatches `script` actor episodes when a phase allows, and resumes idempotently after a kill or a restart, including as a single `--once` tick under an outside scheduler (version assigned at activation)

**Model:** any capable model for the host and fixtures; the live rows in
WO-099 use the actual harnesses. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any. Recommendations
(WO-132).
**Release classification:** minor. A new skeleton host and two commands,
one reactor slice with its fold, the actor catalog with its first kind, new
event types under schema 1; no compiler or kernel change is expected, and a
kernel change if one proves necessary is its own minor. Assigned at
activation under the standing opt-out default.
**Cost:** adds the process the operator runs, which is the product the
vision's first sentence names; one slice and fold, two commands, about 5 s
of fixture wall-clock with a fake clock and doubles; no receipt, hook or
gate. Removes nothing that exists in DotLn today; in the operator's practice
it replaces v1's harness-resident crons, and in the critical path it
unblocks gate R: WO-099, WO-100, WO-114, WO-115, WO-119, WO-121, WO-122 and
WO-123 hard-depend on it. Context bytes and tokens are unmeasured; the
executor records entry and handoff usage when available.
**Nomination provenance:** the vision's first sentence (a local-first,
model-agnostic compiler and runtime) and the operator's 2026-09-08 mid-pass
direction: the predecessor is a harness left open with crons; the successor
is an offline application that does the same with richer policies and
several actor kinds. Redesigned at the mandatory R1 checkpoint by the
2026-09-16 planning pass from rows C-U1, C-U2, C-U3, C-U5, C-U6, X-U1,
X-U3, X-U5 and X-U6 and from WO-067's compiled statechart, WO-050's slices
and WO-047's projector
([writing-worker-smoke-2026-09-14.md](../discovery/writing-worker-smoke-2026-09-14.md);
[the R1 replan document](../planning/r1-replan-2026-09-16.md) §1 and §2).
Planner-synthesized draft; captures and hashes in the ledger sections of
both dates. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-067 merged (the compiled statechart this host executes;
`v0.19.0`); WO-050 merged (the typed slices this host extends with its own;
`v0.21.2`); WO-044 merged (the unattended rows; `v0.17.7`); WO-009 merged
(the worker store's lock and lease rules it reuses; `v0.10.0`). All closed.
WO-047 and WO-046 are references (the replay projector; the executable
subset the `script` actor's program decodes against).
**Recommended placement:** lane pair with WO-133, whose surfaces are
disjoint. It adds `packages/skeleton/src/resident-host.ts` and
`actor-catalog.ts`, one slice and fold in `reactor.ts`, the `dotln resident`
and `dotln presence` commands in `dotln.ts`, and fixtures. It does not edit
`execution-environment.ts` (WO-051's surface in the next pair); the `script`
actor's surface is declared in the catalog. Presence signals with origin are
WO-121 and the `cli-worker` and `human-handoff` kinds are WO-122. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-067",
    "relation": "satisfied-by-close",
    "reason": "the compiled presence statechart whose cadences, guards and phases the host executes"
  },
  {
    "workOrderId": "WO-050",
    "relation": "satisfied-by-close",
    "reason": "the typed slices this host extends with a resident slice and fold"
  },
  {
    "workOrderId": "WO-044",
    "relation": "satisfied-by-close",
    "reason": "the unattended rows: no harness scheduler, detached launch with stored authentication, auto-denied requests without a terminal, kill leaves a recoverable worktree"
  },
  {
    "workOrderId": "WO-009",
    "relation": "satisfied-by-release",
    "release": "v0.10.0",
    "reason": "the worker store's exclusive lock and lease rules it reuses"
  },
  {
    "workOrderId": "WO-047",
    "relation": "reference-only",
    "reason": "the explicit replay projector the byte-identical replay uses"
  },
  {
    "workOrderId": "WO-046",
    "relation": "reference-only",
    "reason": "the executable program subset a script actor's continuation decodes against"
  },
  {
    "workOrderId": "WO-027",
    "relation": "reference-only",
    "reason": "the local-inference probe, as the fourth actor kind's reference"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 00-vision.md §The one-paragraph story;
01-principles.md Principle 2 (deterministic core; time is an input) and
Principle 15; 02-domain-model.md §Events and decisions (Cadence; `now` as
kernel environment; the replay projector), §Compiled presence policies and
§Actors and episodes; 03-architecture.md §Operator-presence policy (the
WO-067 compiled subset: `present`, phases, `expired`; `phase-ready`,
`returned`, `interrupt-phase`; `After(idleMs)`), §Session lifecycle &
resilience and §Runtime primitive catalogs; ADR-0007;
`packages/compiler/src/presence.ts` (`compilePresence`, the transitions and
guards) and `packages/compiler/test/presence.test.ts` (the fixture
interpreter that executes the emitted table with the real kernel cadence
and authorization functions); `packages/kernel/src/core.ts` (`KernelEnv.now`,
`evaluateCadence`, `authorize`); `packages/skeleton/src/reactor.ts`
(`OperatorPresenceChanged`, `presenceDecision`, `sliceEventTypes`,
`selectEventSlice`, `kernelStateFromRuntime`); `worker-store.ts`
(`acquire` and its inspection guard), `worker-host.ts`;
[writing-worker-smoke-2026-09-14.md](../discovery/writing-worker-smoke-2026-09-14.md)
rows C-U1 to C-U6, X-U1 to X-U6; `docs/discovery/local-inference.md`.

**Objective:** `dotln resident --store <dir> --policy <id> [--tick <ms> | --once]`
runs as one process per launchpad under an exclusive lock: it folds the log
into state, samples the wall clock and records each sample as a
`ClockSampled` event so that every cadence decision is a pure function of
the log, folds presence from explicit `OperatorPresenceChanged` events that
`dotln presence away|back --store <dir>` appends (WO-121 adds the
origin-bearing signals), executes WO-067's compiled statechart (enter the
first phase on the away edge, advance once on a verified episode success,
`expired` at the idle deadline, cancel pending cadences on return, interrupt
a discretionary in-flight episode marked `kill`), and, when a cadence fires
in a phase that allows it, dispatches one actor episode through the actor
catalog, whose first kind is `script` (a declared exact command with a
declared effect class, run in a declared worktree with a cleared
environment; the catalog also names `cli-worker`, `human-handoff` and
`local-model`, each `unavailable` with its reason until WO-122 and WO-110).
It dispatches no discretionary work after the operator returns, resumes
from the log after a kill or restart without repeating a dispatch, runs one
complete cycle and exits under `--once` so an outside scheduler can drive it,
and has no network of its own.

**Observed gap (dated 2026-09-16, `main` at `b7914ed`, v0.22.0):**

- Every host runs when a command invokes it. `OperatorPresenceChanged` and
  the `operator.away` predicate exist in the reactor, but only scenario
  fixtures append the event; nothing evaluates a cadence against time or
  dispatches without an operator present.
- WO-067 emits the statechart and proves it with a fixture interpreter in
  the compiler's tests; no host consumes it.
- `SkeletonState` (WO-050) holds walking, worker, verification and feedback
  slices and a reserved `sourceChange` slot; there is no resident slice.
- The record: neither CLI exposes a scheduler (C-U3, X-U3); a detached
  launch with stored authentication completes (C-U1, X-U1; lifetime
  unknown); a request without a terminal is auto-denied on Claude (C-U2); a
  SIGKILL mid-episode leaves an edited, uncommitted worktree from which a
  fresh episode recovers (C-U6, X-U6); three concurrent launches complete
  (C-U5, X-U5).

**Design (scope discipline):**

- The clock is an input: the resident appends `ClockSampled { at }` on each
  tick and every cadence decision replays from event time; replay through
  the explicit projector (WO-047) with a fake clock is byte-identical.
- Presence is the explicit event only in this order; WO-121 adds origin and
  signals. `dotln presence away|back` is the human-origin command.
- The statechart evaluator is WO-067's interpreter logic moved into the
  skeleton, executing the compiled transitions with the kernel's
  `evaluateCadence` and `authorize`; one implementation, not a second.
- The actor catalog is a typed table `{ kind, available(), run() }`; an
  unavailable kind yields an `ActorUnavailable` NoOp event with the reason
  and never a fallback to another kind.
- `script` actors run with `cwd` the declared worktree, a cleared
  environment, a bounded timeout and no network; the declared effect class
  is checked by `authorize` against the phase's effective envelope; output
  is reduced to a hash and a first line in the `ScriptEpisodeObserved`
  event.
- Idempotent dispatch: `ScriptEpisodeDispatched` is appended before the
  process starts with a deterministic episode id from (policy, phase,
  cadence, due time); a restart that finds a dispatched but unobserved
  episode records `ScriptEpisodeLost` and re-arms per the policy, never a
  second dispatch with that id.
- The lock and dead-owner reclaim follow the worker store's exclusive-host
  pattern with WO-048's inspection before reclaim. `--once` performs one
  fold, evaluate and dispatch cycle and exits; the loop mode repeats it on
  `--tick`. The log is the state, so a killed resident costs nothing.
- The `resident` slice joins `SkeletonState` (WO-050 pattern) with one fold
  selected by event type; serialized `RuntimeState` for existing logs is
  byte-identical because the slice is absent until a resident event appears.
- **Declined alternatives, recorded:** the harness's own scheduler as the
  runtime (none exists: C-U3, X-U3; a harness is at most a launcher); a
  daemon with its own network; a fallback between actor kinds; a second
  statechart interpreter.

**Deliverables:** the host and commands, the events and slice fold, the
actor catalog with the `script` kind, fixtures with a fake clock and
doubles, the write-backs below.

**Acceptance criteria (all required)**

1. With a fake clock and WO-067's three-phase fixture policy, the resident
   enters the first phase on `away`, fires its cadence and dispatches one
   `script` episode; a `back` before the next tick cancels further
   discretionary dispatch and the in-flight episode is handled per
   `inFlightOnReturn`, with both `kill` and `finish` exercised; the log
   replays byte-identically through the explicit projector.
2. A SIGKILL of the resident with a dispatched episode, then a restart,
   resumes from the log, records the lost or observed outcome and dispatches
   no second episode with that id; a second resident against the same store
   refuses on the lock; a dead owner is reclaimed after inspection.
3. A `script` actor whose effect class is outside the phase envelope is
   refused by `authorize` and recorded; inside it, it runs in the declared
   worktree with a cleared environment and its result is an event with
   reduced output.
4. An unavailable actor kind yields the NoOp event with the reason and no
   fallback dispatch.
5. `--once` from a fresh process performs one cycle and exits 0; two
   consecutive `--once` runs produce the same events as one two-tick loop
   run on the same fake clock.
6. With no policy activity for `idleMs`, the resident enters `expired`,
   cancels pending dispatch, and a `back` followed by a fresh `away` re-arms
   the first phase; repeated absence observations do not replenish.
7. Write-backs land: 03 §Operator-presence policy (the resident is the
   consuming host) and §Runtime primitive catalogs (the actor catalog row),
   02 §Actors and episodes (the events), README "What runs today" (one
   sentence), skeleton README runbook (`dotln resident`, `dotln presence`,
   a one-line outside-scheduler example), the capability table's dated
   `runtime.resident` row at the fixture-evidenced level, the decisions
   file.
8. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Admitted boy-scout item (2026-09-16 planning decision):** if this order
needs a line in `packages/skeleton/src/scenario.ts`, it extracts
`LiveReactorDriver` into `packages/skeleton/src/live-driver.ts` and the
WO-016 size bound follows the file that keeps the fixture tree; the bound is
not raised again (WO-047 D007's reopening).

**Evidence gate:** the fixture transcripts; `npm test` once at final
review; the evidence edition.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** origin-bearing presence signals and the heartbeat (WO-121);
the `cli-worker` and `human-handoff` kinds (WO-122); the mission check
episode (WO-099); work derivation and the portfolio (WO-100); the
local-model transport (WO-110); the unattended live proof (WO-111); any UI;
a launchd or systemd unit (the operator's host; the runbook shows one line).

**Operator-review assumptions**

1. One actor kind is enough for the resident's own proof; the others join
   through WO-110 and WO-122.
2. `--once` under an outside scheduler is an admitted launch mode, because
   neither harness exposes a scheduler (C-U3, X-U3) and the log is the
   state.
3. The resident runs from the launchpad checkout with a built runtime.
