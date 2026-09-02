# WO-017 — Kernel truthfulness: store codec, outbox ordering, authority guard, evidence hardening (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Release classification:** assigned by the planner at activation. Expected
class: patch. Compatible corrections to `@dotln/kernel` behavior at boundaries
no current test reaches, plus binding tests. Item 3e adds an optional field and
an optional context key; pre-1.0 the planner may prefer the next minor.
**Nomination provenance:** the operator's 2026-09-02 entropy review; opaque
identifier, not a priority.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The same message was first preserved
in ignored intake only as a compaction-safety copy, so its earlier filesystem
timestamp does not make it the source of an agent-authored synthesis. Both
artifacts descend from one operator-authored filing instruction. The operator
confirmed that direction during VER-001 repair; the clean-room screen found no
employer, credential, internal-service, or other stop condition.
**Depends on:** `main` at or after `v0.2.3`. Independent of WO-016; if both
are open, land this first so the skeleton reactor consumes the corrected guard.
Absorbs the malformed-line lane of WO-105 as fixes rather than a corpus.

**Cites (read these sections):** 02-domain-model.md §Events and decisions
(the Command row: outbox event types and dedup; the ID-scheme paragraph) and
§Identity and composition (the AuthorityEnvelope row); 03-architecture.md
§Session lifecycle & resilience (failure-injection matrix rows 1 and 3, the
outbox protocol); 01-principles.md Principles 2, 5, 6, and 10;
`docs/work-orders/WO-105-crash-shape-corpus.md` (malformed-line families);
`docs/work-orders/WO-108-mutation-probe.md`; 07-execution-guide.md
§Discipline ("a guard that does not guard").

**Objective:** Make four kernel boundaries behave loudly and provably where
they currently corrupt, ignore, or decorate, each with a test that binds.

**Observed problems (dated 2026-09-02, reproduced against the built kernel):**

1. Store codec corrupts on a partial tail. `appendEvent` on a log whose last
   line is an unterminated partial write, the shape a crash leaves, counts that
   line, assigns the next `evt_n`, and glues the new JSON onto it; `decodeLog`
   then throws. A blank interior line makes `decodeLog` throw and shifts every
   later `evt_n`. A whitespace-only log decodes to zero events but appends
   `evt_2`. `store.ts` is 24 lines; none of this is tested.
2. Out-of-order outbox leaves a completed command pending. A `CommandResult`
   that precedes its `CommandPersisted` in the log is traced `unknown` and
   dropped; `replayOutbox` then reports the command pending, so recovery would
   re-dispatch an already-executed command: the row-1 hazard.
3. Authority guard. (a) `now === expiresAt` is neither allowed nor refused by
   any test. (b) Refusal precedence is unpinned: swapping the expired and
   revoked arms survives the suite. (c) The reason chain is an eight-deep
   nested ternary whose order is the precedence the architecture says must be
   visible. (d) A successful authorization returns no `DecisionTrace`, so
   grants are invisible to audit; WO-007 derives "allowed" from
   `CommandPersisted`. (e) Revocation matches on event `type` only. The
   skeleton's `revocationEventTypes: ["OperatorPresenceChanged:return"]` can
   never match any event, and `authorize` with a real
   `OperatorPresenceChanged(returned)` in `revokedBy` still authorizes.
4. Evidence gaps measured by mutation: the deferred-kind throws in
   `stepProgram` and `evaluateCadence` can be replaced by silent returns;
   `Program.Sequence([])` is untested; `Every` accepts `NaN` and `Infinity`;
   `Backoff`'s binding `maxMs` clamp is pinned only by `<=`; `replay`'s
   `policy` promotion and `rngState` fallback are untested.

**Scope discipline:** one isolated, evidenced change stage per numbered item,
each with its tests; no worktree commit before final review. The 13-step event
count, ordering, and event types do not change. Item 3d records the granted
authority trace in the existing `DecisionRecorded` payload without adding an
event; item 3e repairs the envelope so the demo's revocation clause becomes
real. The result captures and itemizes every resulting log, decision, CLI, and
audit-projection delta, and proves every unlisted output byte identical. No new
dependencies. The kernel stays pure.

**Deliverables and acceptance criteria (all required)**

1. Store codec contract. A well-formed log is `""` or N lines, each a JSON
   object, each newline-terminated. `appendEvent` and `decodeLog` refuse any
   other shape with an error naming the offending line number; `eventId` is
   `evt_` followed by the well-formed line count plus one. Tests: partial
   tail, blank interior line, whitespace-only log, missing final newline, and
   a round-trip proving refusal is the only behavior change for well-formed
   logs. The domain model's Event store row records the contract.
2. Outbox ordering. `replayOutbox` treats a result that precedes its persist
   deterministically and never leaves that command pending. The simplest
   honest form remembers orphan results by `commandId` and completes the
   command on persist with trace `["result", "preceded-persist"]`. Test: a
   result-before-persist log yields zero pending commands and that trace.
3. Authority guard. (a) The `expiresAt` boundary is decided (recommend
   `now >= expiresAt` expires, treating expiry as an instant) and tested in
   both directions. (b) A precedence matrix test constructs envelopes where
   two or more refusal conditions hold and pins the reason for every adjacent
   pair. (c) The reason chain becomes an ordered list of named rules evaluated
   first-failing; its existing precedence behavior is unchanged except for the
   boundary in (a) and the semantic revocation path in (e). (d) The authorized
   branch returns a `trace` (`reactorId: "authority-guard"`, `branchPath:
   ["authorized", effect]`, env inputs, and the consumed resource), and the
   skeleton records it. (e) Revocation accepts conditions as data: an optional
   `revocationConditions: readonly PredicateRef[]` evaluated with the shipped
   `predicate()` semantics against each `revokedBy` event, with
   `revocationEventTypes` retained. `authorize` gains optional
   `state: JsonValue` and `predicateEnv: Omit<KernelEnv, "now">` context
   inputs. The condition path constructs the predicate's `KernelEnv` with the
   authorization context's existing `now` as the one canonical clock and the
   supplied rng state, predicates, and policy, so PredicateRefs retain their
   one registry and signature without introducing a second time input.
   Existing callers remain source-compatible, but a non-empty condition list
   with either input absent, an unknown registry/version, or an evaluation
   error refuses `cannot evaluate revocation` rather than authorizing or
   throwing. Tests pin any-condition × any-event matching, the state and
   canonical `now` visible to the predicate, the remaining env inputs, and the
   unknown-ref failure; the granted trace names the canonical time. The
   skeleton passes its `RuntimeState` and the clockless predicate env, uses a
   real condition, and proves an inspect intent is refused `authority revoked`
   after operator return.
4. Evidence hardening. Tests that one deferred Program kind and one deferred
   Cadence kind throw `is deferred`; `Sequence([])` steps to `Done`; `Every`
   refuses non-finite intervals; a binding `Backoff` clamp yields an exact
   `dueAt`; `replay` promotes `policy` and falls back `rngState` to 0. Export
   `EVALUABLE_CADENCE_KINDS` and `EVALUABLE_PROGRAM_KINDS` as data, with a test
   that every unlisted kind throws and every listed kind does not (WO-018
   consumes them for the release manifest).
5. Every item is mapped to a named test, and each item's mutation from the
   observed-problem list, applied in a scratch copy, now fails that test.
6. `npm test` green; the skeleton event count, ordering, and types are
   unchanged; the result itemizes and justifies every demo-output delta caused
   by items 3d and 3e and proves the remaining named outputs identical; the
   kernel README map covers every new export.

**Evidence gate:** test output; the per-item mutation drill; captured demo
output before and after, an itemized structural diff for the allowed 3d/3e
deltas, and `cmp` for every output declared unchanged; `git diff --check`
clean.

**Write-back duty:** 02-domain-model.md rows Event store, Command, and
AuthorityEnvelope; 03-architecture.md matrix row 1 gains the ordering clause;
kernel README map; ledger entry (transformed: revocation as data; adopted:
codec contract). Mark WO-105's malformed-line lane as absorbed here in its
draft and in the work-order map.

**Non-goals:** a filesystem appender or crash-recovery protocol (WO-009);
byte-offset truncation sweeps (WO-105's retired lane); evaluating deferred
kinds; the `Cadence.Evaluable` recursive subset type (record as a candidate);
changing the `commandId` or `eventId` schemes.
