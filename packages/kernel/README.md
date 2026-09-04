# `@dotln/kernel` v0.2.1

The deterministic, framework-free DotLn core. Kernel functions perform no I/O
and consult no ambient clock or randomness. Import the public API from
`@dotln/kernel`; `src/index.ts` is its complete export surface.

## Domain-model map

| Export                                                                                                                        | Domain-model entry                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `JsonPrimitive`, `JsonValue`                                                                                                  | JSON-safe value grammar for EventEnvelope payloads and kernel state                                      |
| `Event`, `EventDraft`, `Comparison`, `EventEnvelope`, `EventPattern`                                                          | Event, edge-assigned event identity, Comparison event, EventEnvelope, Await matching                     |
| `Reactor`, `KernelEnv`, `PredicateRegistry`                                                                                   | Reactor; environment as log projection; conditions-as-data registry                                      |
| `Decision`, `DecisionTrace`                                                                                                   | Decision, DecisionTrace                                                                                  |
| `Schedule`, `Cadence`, `CadenceResult`, `CADENCE_KINDS`, `EVALUABLE_CADENCE_KINDS`, `evaluateCadence` and all 14 constructors | Schedule, Cadence temporal-algebra AST and virtual-time evaluation                                       |
| `Intent`, `ActIntent`, `WaitIntent`, `ObserveIntent`, `NoOpIntent`                                                            | Intent (`Act \| Wait \| Observe \| NoOp`)                                                                |
| `Command`, `CommandReceipt`, `commandId`, `stableHash`                                                                        | Command, CommandReceipt, deterministic outbox identity                                                   |
| `Program`, `ProgramStep`, `ProgramDecision`, `EVALUABLE_PROGRAM_KINDS`, `stepProgram`, `decideProgram`                        | Program grammar, residual Decision continuation, and its v0.1 evaluation subset                          |
| `serializeContinuation`, `deserializeContinuation`                                                                            | Continuation                                                                                             |
| `PredicateRef`, `Predicate`, `predicate`                                                                                      | Conditions as data: the versioned predicate registry consulted by Cadence and Program guards             |
| `AuthorityEnvelope`, `authorize`, `AuthorizationResult`, `Refusal`                                                            | AuthorityEnvelope and structural command-authorization guard                                             |
| `WorkOrder`, `ResultEnvelope`                                                                                                 | WorkOrder and Result envelope                                                                            |
| `ReplayResult`, `JsonlLog`, `appendEvent`, `encodeLog`, `decodeLog`, `replay`                                                 | Event store (append-only JSONL); eventId edge-assigned at the store boundary; deterministic replay       |
| `OutboxEntry`, `OutboxState`, `emptyOutbox`, `persistCommand`, `pendingCommands`, `replayOutbox`, `applyCommandResult`        | Command outbox protocol: replay recovery and deterministic duplicate-result dedup                        |
| `PresenceDecision`, `guardQueuedPulse`                                                                                        | Reactor guard for the operator-return race: NoOp Intent with evidence, plus future Schedule cancellation |

Cadence exports types for `Once`, `After`, `Every`, `Burst`, `Calendar`,
`Window`, `While`, `Until`, `Gate`, `Sequence`, `Merge`, `Race`, `Repeat`, and
`Backoff`. Evaluation is intentionally limited to `Once`, `After`, `Every`,
`Until`, `Gate`, and `Backoff`. Program exports all grammar nodes; evaluation is
intentionally limited to `Done`, `Emit`, `Invoke`, `Await`, `Sequence`, and
`Guard`. `CADENCE_KINDS` is the compile-time-exhaustive machine-readable source
for the complete Cadence root-kind union; the runtime constructors must match it
in both directions. The two `EVALUABLE_*_KINDS` exports are the machine-readable
source for their exact subsets; kinds outside them fail loudly as deferred. The subset lists are
exact by root kind and shallow by shape: a listed combinator such as `Gate` or
`Sequence` still throws `is deferred` when it wraps an unlisted child, so a
consumer must not read membership as a promise about nested trees. A recursive
evaluable subset type is recorded as a candidate in the idea ledger.

Component `0.2.1` is staged for application release `v0.4.1`: the additive
`CADENCE_KINDS` data export lets release compatibility derive both cadence lists
from the built kernel while compile-time exhaustiveness and runtime constructor
checks bind it to `Cadence.T`.

Run `npm test` at the repository root for the acceptance and failure-injection
suite.
