# WO-002 — Pure kernel package, v0.1.0

**Model:** any capable model.
**Depends on:** WO-001 complete (workspace choice consumes its evidence).

**Objective:** Implement the deterministic core per
`docs/product/02-domain-model.md` (Events and decisions; the Program grammar
block including the conditions-as-data rule and namespacing; Actors and
episodes for WorkOrder/AuthorityEnvelope shapes) and
`docs/product/03-architecture.md` §Session lifecycle & resilience (the
canonical failure-injection matrix). Deliverables: events + EventEnvelope
(including the `Comparison` event type), immutable state, reactors,
Decision/DecisionTrace/Schedule, intents (incl. NoOp with
reason/evidence/reevaluation), **AuthorityEnvelope + the command-authorization
guard** (intent → envelope check → refusal event), continuations, cadence with
virtual time, explicit RNG state, append-only JSONL event store + replay.

**Scope discipline (one step at a time):**
- *Types* for the full Program grammar and all 14 Cadence constructors.
- *Evaluation semantics* only for: Program `Done, Emit, Invoke, Await,
  Sequence, Guard`; Cadence `Once, After, Every, Until, Gate, Backoff`.
  `Calendar` evaluation is deferred by design (calendar arithmetic under
  virtual time is a rabbit hole no current test exercises); the rest arrive
  on contact at the rungs that consume them.
- Failure-injection rows **1, 3, 5** of the canonical matrix (03-architecture
  — expected outcomes are specified there). Rows 2, 4, 6 land at v0.4.0.

**Constraints**
- TypeScript, strict; **zero runtime dependencies** in the kernel package.
  Dev-deps for build/test are fine — record them in ADR-0002 §Amendments.
- No I/O, no Date.now/Math.random inside kernel source — time and RNG state
  enter via the explicit environment, which is a pure projection of the log
  (see domain model). The JSONL "store" inside the kernel is a pure log value
  + codec; the filesystem appender is harness/CLI code (node:fs permitted
  there), living under `packages/kernel/harness/` — excluded from the
  zero-deps/no-I/O rule.
- Layout: root `package.json` with `workspaces: ["packages/*"]`;
  `packages/kernel/`. Prefer npm if WO-001 observed it; simplest observed
  manager otherwise.
- IDs per the domain model: commandId kernel-computed by hash; eventId
  edge-assigned at the store boundary.

**Acceptance criteria (all required)**
1. Reactor purity: property test — same (state, event, env) ⇒ identical
   Decision including trace.
2. Replay: an event log replays to the identical final state and identical
   decision sequence, consulting nothing outside the log.
3. Cadence: virtual-time tests for Every, Gate, and Backoff (jitter drawn
   from explicit RNG state), with cancellation via Until; Once and After
   covered incidentally. Tested set = the semantics list above.
4. Continuations: a three-step Invoke/Await program survives serialize →
   deserialize → resume; conditions are data (predicate registry refs), never
   closures.
5. Failure-injection rows 1, 3, 5 pass with the expected outcomes specified
   in the canonical matrix.
6. Authorization guard: a command outside its AuthorityEnvelope produces a
   refusal event with trace — structurally, not by prompt politeness.
7. `packages/kernel/README.md` maps each exported type to its domain-model
   entry.

**Write-back duty:** the pinned EventEnvelope schema, Program payload shapes,
predicate-registry design, and ID scheme go back into 02-domain-model.md in
the same change (ledger duty applies). The doc must not rot against the code.

**Evidence gate:** test run output captured in the result; every criterion
mapped to a named test.

**Non-goals:** adapters, model calls, UI, SQLite, the pattern compiler,
LoadoutGraph (v0.3.0 — keep policy/loadout inputs to reactors as opaque typed
parameters), rating projections over Comparison events (the event type ships;
the fold comes later).

## 2026-08-31 roadmap retiming note

This completed order retains its original future pointers as time-indexed
planning history. The current application targets are `v0.4.0` for
LoadoutGraph/composition and `v0.5.0` for failure-matrix rows 2, 4, and 6; see
the roadmap's dated forward-retiming table. Its implemented `v0.1.0` scope and
evidence are unchanged.
