# `@dotln/kernel` v0.5.0

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
| `Program`, `ExecutableProgramV1`, `ProgramStep`, `ProgramDecision`, `EVALUABLE_PROGRAM_KINDS`, `stepProgram`, `decideProgram`                        | Program grammar, residual Decision continuation, and its v0.1 evaluation subset                          |
| `serializeContinuation`, `decodeContinuation`                                                                            | Continuation                                                                                             |
| `PredicateRef`, `Predicate`, `predicate`                                                                                      | Conditions as data: the versioned predicate registry consulted by Cadence and Program guards             |
| `AuthorityEnvelope`, `authorize`, `AuthorizationResult`, `Refusal`                                                            | AuthorityEnvelope and structural command-authorization guard                                             |
| `WorkOrder`, `ResultEnvelope`                                                                                                 | WorkOrder and Result envelope                                                                            |
| `ReplayResult`, `JsonlLog`, `appendEvent`, `encodeLog`, `decodeLog`, `tryDecodeLog`, `DecodeResult`, `replay`, `defaultEnvironmentProjection`                                                 | Event store (append-only JSONL); eventId edge-assigned at the store boundary; deterministic replay       |
| `OutboxEntry`, `OutboxState`, `emptyOutbox`, `persistCommand`, `pendingCommands`, `replayOutbox`, `applyCommandResult`        | Command outbox protocol: replay recovery and deterministic duplicate-result dedup                        |
| `PresenceDecision`, `guardQueuedPulse`                                                                                        | Reactor guard for the operator-return race: NoOp Intent with evidence, plus future Schedule cancellation |

Cadence exports types for `Once`, `After`, `Every`, `Burst`, `Calendar`,
`Window`, `While`, `Until`, `Gate`, `Sequence`, `Merge`, `Race`, `Repeat`, and
`Backoff`. Evaluation is intentionally limited to `Once`, `After`, `Every`,
`Until`, `Gate`, and `Backoff`. Program exports all grammar nodes; evaluation is
intentionally limited to `Done`, `Emit`, `Invoke`, `Await`, `Sequence`, and
`Guard`. `CADENCE_KINDS` is the compile-time-exhaustive machine-readable source
for the complete Cadence root-kind union; the runtime constructors must match it
in both directions. `ExecutableProgramV1` recursively constrains every Program child to `Done`,
`Emit`, `Invoke`, `Await`, `Guard`, or `Sequence`. `stepProgram` and
`decideProgram` accept that type; their residuals remain executable. Constructor
overloads preserve executable types when supplied executable children while
`Program.T` retains the full authoring grammar. `EVALUABLE_PROGRAM_KINDS` is
compile-time exhaustive for the executable union. Cadence's evaluable list still
classifies root kinds only; nested deferred cadences remain deferred.

`decodeContinuation(value: unknown)` replaces `deserializeContinuation`. It
accepts serialized JSON or parsed JSON data and returns
`DecodeResult<ExecutableProgramV1>`. Failures include a code, JSON path and message;
all five deferred Program kinds fail at their `.kind` path, including nested
children. It validates required and optional fields, rejects unknown structural
fields, and checks EventDrafts, Act commands, patterns, predicate references and
full Cadence timeout shapes. Payloads and predicate params retain JSON data;
closures, cycles, accessors, inherited fields and non-finite numbers are refused.
Predicate registry availability is checked by execution. Await returns a wait;
decoding its full Cadence shape does not claim that cadence can be evaluated.
`serializeContinuation` retains its existing JSON.stringify bytes.

Component `0.4.0` narrows the executable API and adds continuation decoding. `tryDecodeLog` returns
`DecodeResult<readonly Event[]>`: either `{ ok: true, value }` or
`{ ok: false, code, path, message }`. Every envelope must have schema version 1,
sequential `evt_<n>` identity, required string fields, finite numeric time,
optional string IDs, a JSON payload, and no unknown envelope fields. Payload
scalars, null, arrays and objects remain valid; payload semantics belong to
reactors. The failure message names the physical line and JSON path.
`decodeLog` throws that message for existing callers; `appendEvent` validates
the existing log before assigning the next ID. Empty logs and newline-terminated
valid logs (including CRLF) retain their framing contract. No migration or
historical log rewriting occurs.

Run `npm test` at the repository root for the acceptance and failure-injection
suite.

Component `0.5.0` adds an optional fifth argument to
`replay(initial, events, reactor, predicates, projectEnvironment?)`.
The pure callback receives the current pre-step state and event and returns
`Omit<KernelEnv, "now" | "predicates">`: a finite `rngState` and optional `policy`.
Replay always supplies `now` from `event.occurredAt` and the caller's predicate
registry. A supplied projector with a non-finite RNG throws before the reactor.
Callback purity is the author's responsibility, just like reactor purity.

When omitted, `defaultEnvironmentProjection(state)` preserves the existing
fallback: read the top-level numeric `rngState`, otherwise use zero; promote
`policy` when present (including null). This legacy numeric check is unchanged.
Existing valid-JSON replays retain complete Decision bytes. Applications with
another state layout can project their own fields; the skeleton explicitly uses
`projectRuntimeEnvironment` across its scenario and recovery paths.
