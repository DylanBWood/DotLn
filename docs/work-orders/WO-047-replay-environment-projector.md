# WO-047 — Replay takes an explicit environment projector: the kernel stops guessing where an application keeps its RNG state and policy (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch to minor. An optional parameter on
`replay` whose default reproduces today's documented behavior byte for byte;
the skeleton supplies its projector explicitly. Kernel package moves.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
C1, third bounded order), cut at the operator's same-day correction. The
audit's P1 is verified as a documented coupling, not a silent one: product 02
states that the RNG seed must live at `rngState` and any other name replays
as zero. Planner-synthesized draft; captures and hashes in the ledger section
of that date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-017 merged (the kernel truthfulness boundaries; satisfied
at `v0.3.5`); WO-016 merged (the single skeleton reactor that replay drives;
satisfied at `v0.3.6`).
**Recommended placement:** any free lane; it edits `packages/kernel/src/core.ts`
(`replay`), kernel tests, the skeleton's replay call sites, and product 02.
A recommendation, not a dependency token.

**Cites (read these sections):** 02-domain-model.md §Events and decisions
(the Reactor row: "`replay` projects `env` from state by reserved key");
01-principles.md Principle 2 (deterministic core; `env` is a projection of
the log); `packages/kernel/src/core.ts` (`replay`, `stateField`,
`KernelEnv`); `packages/kernel/test/ac2-replay-store.test.ts`;
`packages/skeleton/src/reactor.ts` and `scenario.ts` (replay consumers);
`packages/skeleton/test/scenario.test.ts` (live/replay identity).

**Objective:** Give `replay` an optional `projectEnvironment(state, event)`
parameter that returns the clockless environment for each step. When absent,
the kernel applies exactly today's documented projection (`rngState` by
reserved key, default zero; `policy` promoted when present) so every existing
replay is byte-identical; the skeleton passes its projector explicitly, so
the first typed state slice (WO-050) can store RNG and policy where it
chooses without the kernel guessing.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `replay` reads `rngState` and `policy` from the application state by
  literal key and defaults the RNG to zero (`core.ts:551-578`); product 02
  documents this as the contract, so it is deliberate, and it still couples
  the generic kernel to one state layout.
- A second state shape (the reactor's typed slices in WO-050) would have to
  keep those two keys at the top level or replay wrongly.

**Design (scope discipline):**

- `replay<S>(initial, events, reactor, predicates, projectEnvironment?)`
  where `projectEnvironment: (state: S, event: Event) => Omit<KernelEnv, "now" | "predicates">`.
  The default is the current key-based projection, extracted into an exported
  `defaultEnvironmentProjection` so the contract stays visible and testable.
- The skeleton's replay calls pass an explicit projector that reads its own
  state slice; a test proves the explicit and default projections agree on
  the current state shape.
- The domain model's Reactor row states the projector contract and keeps
  the reserved-key default as the documented fallback.
- **Declined alternatives, recorded:** persisting the environment in every
  event envelope (schema change, redundant with the log); removing the
  default (breaks every existing caller for no consumer); a global setter
  (hidden state in a pure kernel).

**Deliverables:** the parameter and default, tests, the skeleton projector,
the write-backs below.

**Acceptance criteria (all required)**

1. Replay of the demo log, the WO-003 oracle and every skeleton fixture is
   byte-identical with and without the explicit projector; complete Decision
   sequences compare equal.
2. A kernel fixture whose state keeps RNG under another key replays
   deterministically with a projector and replays with `rngState: 0` without
   one, exactly as the documented default says; a fixture projector that
   returns a non-finite RNG refuses.
3. The exported default projection is the only place the reserved keys
   appear in `core.ts`, proven by a test that greps the module.
4. Write-backs land: 02 §Events and decisions (the projector), kernel README,
   ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency; no change
   to any hash preimage; any bundle pin or feedback edition the changed
   runtime requires.

**Evidence gate:** the identity transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the typed state slices themselves (WO-050); event-log or
continuation decoding (WO-045, WO-046); any change to `authorize` or cadence.

**Operator-review assumptions**

1. The reserved-key default stays documented and supported; removing it is a
   later decision if no caller relies on it.
