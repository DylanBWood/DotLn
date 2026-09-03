# WO-016 — Skeleton reactor: one decider, driven live and by replay (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Before
`resume -- activate`, rewrite this H1 to carry exactly one strict `vX.Y.Z` and
pin the close disposition. Expected class: patch. It is a compatible correction
and evidence improvement to the v0.3.0 skeleton and adds no exported runtime
capability; the honest no-release path is acceptable.
**Nomination provenance:** the operator's 2026-09-02 entropy review of the
repository; created as a draft under operator direction. The identifier is an
opaque stable reference, not a priority or an activation decision.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The same message was first preserved
in ignored intake only as a compaction-safety copy, so its earlier filesystem
timestamp does not make it the source of an agent-authored synthesis. Both
artifacts descend from one operator-authored filing instruction. The operator
confirmed that direction during VER-001 repair; the clean-room screen found no
employer, credential, internal-service, or other stop condition.
**Depends on:** WO-007 merged. Its three audit projections over the demo log
are this order's regression oracle. WO-017 merged is recommended but not
required; if it has landed, the reactor consumes the corrected guard.
Recommended before WO-008: the composition compiler's acceptance criterion 6
re-runs the scenario with a compiled loadout and needs one decider to swap it
into, not two hand-mirrored scripts.

**Cites (read these sections):** 02-domain-model.md §Events and decisions
(Reactor, Decision, DecisionTrace, EventEnvelope `causationId` and
`correlationId`, the reserved `rngState` and `policy` state keys);
03-architecture.md §The agentic communication core (the decomposition rule)
and §Session lifecycle & resilience ("Row 5 scope at v0.1.0"); 06-roadmap.md
v0.2.0 (exit: live and replayed runs produce identical traces);
01-principles.md Principles 2, 3, 6, and 11;
`docs/work-orders/WO-003-walking-skeleton.md` (the 13-step scenario);
`docs/verifications/WO-003/VER-002.md` §Carried forward from VER-001;
`docs/planning/capability-table.md` rows `skeleton.fake-vertical` and
`projection.skeleton-cli`.

**Objective:** Make the walking skeleton an instance of the kernel loop. One
pure `Reactor<RuntimeState>` produces every Decision the 13-step scenario
makes; the live run is host code that feeds events through that reactor and
executes its intents against the fakes; replay is the kernel's own `replay()`
over the same reactor. The v0.2.0 claim "same log, same decisions" becomes a
structural property instead of an agreement between two hand-written scripts.

**Observed problem (dated 2026-09-02):** `Reactor` and `replay()` are used only
by kernel tests. `packages/skeleton/src/scenario.ts` sequences the scenario
imperatively in `runScenario` (about 215 lines) and re-derives the same
decisions in a separately hand-written `replayScenario` (about 140 lines) that
branches on event type. The identity test in
`packages/skeleton/test/scenario.test.ts` compares only `traces` and
`timeline`. Seven independent mutations of `replayScenario` (wrong
`decisionIndex`, `now := 0`, dropped evidence, empty deletion paths, forced
`verified`, forged `workOrder`, emptied `candidates`) leave it green. Six
payload tampers (candidates, `accepted`, `workOrder`, refusal reason, cancelled
schedule ids, persisted effect) leave both `traces` and `timeline`
byte-identical, because the recorded trace strings depend only on the sequence
of event types. The trace-tamper test cannot fail: `replayScenario` never reads
`DecisionRecorded`. `replayScenario` returns `adapterEffects`,
`adapterDispatches`, `recoveredCommands`, and `activeScheduleIds` as constant
stubs that nothing compares, and its `fixture` parameter is unused. The
skeleton never sets `causationId`, which is why WO-007's audit fold labels the
refusal grouping `derived-same-episode-time-adjacency` instead of reading a
canonical link. These are the carried WO-003 VER-001 findings plus the
producer-side cause of WO-007's heuristic.

**Scope discipline (two evidenced change stages, in this order; no worktree
commit before final review):**

- Stage 1, reactor without changing a byte of output. Extract `seiriReactor`
  into `packages/skeleton/src/reactor.ts` (pure; imports only `@dotln/kernel`).
  `runScenario` keeps the fakes (executor, scheduler, verifier), the append
  loop, and intent execution, and contains no decision logic. `replayScenario`
  becomes `replay(initialState(), decodeLog(log), seiriReactor, predicates)`
  plus the projections, and returns only what replay can honestly reconstruct;
  no stubbed adapter fields. The JSONL log, the numbered timeline, the glyph
  scene, the final receipt, and WO-007's three audit projections are
  byte-identical to `main` before and after.
- Stage 2, canonical links. Every event the skeleton emits as a consequence
  of another carries `causationId`; `correlationId` names the pulse or command
  it belongs to where one exists. Audit output changes only in itemized,
  justified ways. `packages/skeleton/src/audit.ts` is not modified.
- The 13-step event sequence, event types, and payload shapes do not change.
  The kernel is modified only for gaps this order exposes, each noted in the
  result. `RuntimeState` keeps the reserved `rngState` and `policy` keys.
- Close the carried findings the rewrite makes free: the unused `fixture`
  parameter; automated `cli.ts` output coverage; one negative scenario
  outcome; `renderGlyphScene` deriving from folded state rather than
  event-type sniffing, or a stated reason to keep it.

**Deliverables:** `packages/skeleton/src/reactor.ts`; the rewritten
`scenario.ts`; the rewritten identity and tamper tests; a `cli.ts` output test;
a negative-outcome test; captured before and after CLI, log, and audit output;
the skeleton README updated.

**Acceptance criteria (all required)**

1. `seiriReactor` is exported with the kernel's `Reactor<RuntimeState>` type
   and is the only place `evaluateCadence`, `authorize`, `decideProgram`, and
   `guardQueuedPulse` are called in the skeleton (grep-proven in the result).
2. `replayScenario` calls the kernel's `replay()` and contains no per-event
   branching of its own; every field it returns is reconstructed from the log
   and the reactor, and none is a constant stub.
3. The identity test compares the complete decision sequence (`state`,
   `intents`, `continuation`, `schedules`, `trace`) live versus replayed, plus
   `timeline`, `glyphScene`, `workOrder`, `candidates`, and `verified`.
4. Each of the seven `replayScenario` mutations and six payload tampers
   listed above now fails a named test; the current trace-tamper test is
   replaced by one that must break when a decision input changes.
5. After stage 1, `cmp` proves the demo log, CLI stdout, and
   `renderAuditProjections` output identical to `main`.
6. After stage 2, every consequential event carries `causationId`; the
   result itemizes every audit-projection delta and shows that nothing changed
   except the presence of canonical links and any ordering they justify.
7. `npm run skeleton` still prints `verified=true candidates=1`; a negative
   fixture drives `verified=false` and `○ unverified`.
8. `cli.ts` has exact automated coverage for the default and `--audit` forms.
9. `scenario.ts` is smaller than on `main`; the result reports the line delta.

**Evidence gate:** captured before and after outputs with `cmp`; the mutation
drill (each listed mutation applied in a scratch copy, with its failing test
named); `npm test` green; `git diff --check` clean.

**Write-back duty:** capability-table rows `skeleton.fake-vertical` and
`projection.skeleton-cli` re-assessed against their blocking gates; skeleton
README; a ledger entry recording that the skeleton is now an instance of the
kernel loop rather than a script that calls kernel functions; nominate the
follow-on that lets WO-007's fold prefer canonical links over adjacency.

**Non-goals:** real transports (WO-009); the composition compiler (WO-008);
modifying `audit.ts`; new cadence or Program kinds; changing AuthorityEnvelope
semantics (WO-017); SQLite; any UI.
