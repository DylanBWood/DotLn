# WO-046 — The executable program grammar is a type: `ExecutableProgramV1` is what the stepper accepts, continuations decode against it, and a deferred kind fails at decode rather than mid-episode (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The kernel's `stepProgram` narrows its
parameter type and `deserializeContinuation` is replaced by a typed decoder;
that is a public kernel API change under `0.x` semantics (kernel package
minor). The full `Program` grammar, the event schema and every hash preimage
are unchanged. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
C1, second bounded order), cut at the operator's same-day correction. The
audit's P1 "public grammar larger than the executable grammar" is verified:
the subset is an exported constant and a corpus, not a type. Planner-
synthesized draft; captures and hashes in the ledger section of that date.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-101 merged (the Program corpus that enumerates the
executable kinds; satisfied at `v0.2.2`); WO-017 merged (the evaluable-kind
boundaries; satisfied at `v0.3.5`).
**Recommended placement:** any free lane; it edits `packages/kernel/src/types.ts`,
`core.ts`, kernel tests, the WO-101 corpus harness, and the skeleton call
sites that type continuations. Sequence it after WO-045 lands or beside it
with a merge of the shared kernel files. A recommendation, not a dependency
token.

**Cites (read these sections):** 02-domain-model.md §Events and decisions
(the workflow grammar and the pinned Program payloads); 06-roadmap.md §v0.1.0
(types for the full grammar, evaluation for the subset); 10-ir-compatibility.md
§Invariants; `packages/kernel/src/core.ts` (`EVALUABLE_PROGRAM_KINDS`,
`stepProgram`, `serializeContinuation`, `deserializeContinuation`);
`packages/kernel/src/types.ts` (`Program`); `corpus/harness/wo101-program-corpus.test.mjs`;
`packages/kernel/test/ac4-continuations.test.ts`;
`packages/skeleton/src/reactor.ts` (continuation consumers).

**Objective:** Split the executable subset from the full grammar at the type
level: `ExecutableProgramV1` is Done, Emit, Invoke, Await, Guard and
Sequence with children constrained recursively to the same type;
`stepProgram` and `decideProgram` accept only it; `EVALUABLE_PROGRAM_KINDS`
is derived from it; `decodeContinuation(value: unknown)` returns a typed
result and refuses any deferred kind or malformed node with a path, so a
persisted continuation that the runtime cannot execute is rejected when it is
read, never after dispatch.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `stepProgram(program: Program.T, ...)` accepts every kind and throws
  `Program <kind> evaluation is deferred` for Choose, All, Race, Repeat and
  Compensate (`core.ts:147-234`); the subset lives only in the exported
  constant (`core.ts:139-146`) and the corpus.
- `deserializeContinuation` is `JSON.parse(value) as Program.T`
  (`core.ts:270-271`); its only callers are kernel tests, but persisted
  continuations inside event payloads carry the same untyped shape.

**Design (scope discipline):**

- `Program.T` stays the authoring grammar. `ExecutableProgramV1` is a
  narrowed union whose `Guard` and `Sequence` children are
  `ExecutableProgramV1`; a compile-time test asserts that the constant equals
  the union's kinds.
- `decodeContinuation` validates recursively (kind, required payload fields,
  command shape for Invoke, pattern shape for Await, predicate references as
  `{ registryId, version, params? }`), returning `DecodeResult` from WO-045's
  shape or an equivalent local one if WO-045 has not landed; `serializeContinuation`
  is unchanged.
- The skeleton's persisted continuation payloads (verification and worker
  continuations in `reactor.ts`) are read through `decodeContinuation` at
  fold time.
- **Declined alternatives, recorded:** implementing the deferred kinds (a
  later rung with a consumer; `Program.All` is named by the opinion-cohort
  candidate); generics over the child type for every node (over-engineering
  for six kinds); keeping the cast and adding a runtime check inside
  `stepProgram` (the failure would still be mid-episode).

**Deliverables:** the type, the decoder, the corpus and tests, the skeleton
call-site change, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture continuation of each deferred kind (Choose, All, Race, Repeat,
   Compensate) refuses at `decodeContinuation` with the kind and path; a
   nested deferred child inside a Sequence refuses with the child's path.
2. Every executable fixture round-trips: `decodeContinuation(serializeContinuation(p))`
   equals `p` for the WO-101 corpus and the kernel continuation tests, and
   `stepProgram` over the decoded value produces the recorded steps.
3. The WO-101 corpus enumerates the executable kinds from the type, and a
   test fails if the union and the constant diverge.
4. The demo scenario, the WO-003 oracle and every skeleton fixture replay
   byte-identically; no semantic hash or artifact identity changes.
5. Write-backs land: 02 §Events and decisions (the executable grammar named
   as a type; the decoder), kernel README, the capability table's
   `program.evaluable-subset` row reassessed, ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle differs only in runtime pins if the skeleton's built
   reactor bytes change, with a fresh feedback evidence edition in that case.

**Evidence gate:** the fixture transcripts; `npm test`; any evidence edition
the changed runtime requires.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** evaluating any deferred kind; the event-log codec (WO-045);
the replay projector (WO-047); changing `Program.T`'s authoring shape or the
domain model's grammar.

**Operator-review assumptions**

1. Narrowing `stepProgram`'s parameter is acceptable as a kernel minor bump;
   no consumer outside this repository exists.
