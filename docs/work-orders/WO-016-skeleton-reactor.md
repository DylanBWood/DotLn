# WO-016 — Skeleton reactor: one decider, driven live and by replay, v0.3.6

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.3.6`, a tagging patch above the latest
published `v0.3.5`. It is a compatible correction and evidence improvement to
the v0.3.0 skeleton and adds no exported runtime capability. Activation on
2026-09-03 accidentally retained the planner placeholder in this heading and
paragraph. The executor forward-corrected that preflight miss to the work-order
map's next compatible application patch without replaying or editing the
append-only activation event. Publication remains subject to independent
verification, final review, operator merge, and a fresh operator-authorized
release close.
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

## Ideation breakout receipt — 2026-09-03

**Authority:** During the active implementation episode, the operator opened a
complete `ideation:` breakout for an ambient world-simulation application and a
later commander-mediated strategy application, then explicitly preauthorized
continuation of WO-016 after the intake pipeline. A same-batch follow-up added
behavior rules for apparently inert world objects. This authorizes the
documentation promotion below. It adds no skeleton or kernel implementation
scope and changes none of WO-016's objective, stages, acceptance criteria, or
pre-breakout evidence.

**Raw batch and source treatment:**
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md` preserves the
operator message unedited as ignored local source material. The repository's
saved public destination loadout was applied: locked employer/secret exclusion,
Shape-First Synthesis, public vocabulary, provenance, and breakout review. The
committed surfaces preserve the self-running-world, targeted natural-language
intervention, future-behavior observation, commander-option, operator-riff, and
tactical-play-out shapes, then generalize the follow-up's concrete prop example
into capability-based object targeting and a replayable temporal rule. They do
so without copying either raw message, the abrasive example, or the illustrative
trigger wording. No Direct Draft Fidelity exception was requested or used. The
clean-room screen found no employer code, configuration, identifier, internal
service, managed-host detail, credential, private identifier, or other stop
condition.

**Promoted surfaces:**

- `docs/lineage/idea-ledger.md` §WO-016 ideation breakout — running worlds and
  commander-mediated tactics records autonomous modeled continuity, natural
  speech as intervention data, the later commander-mediated strategy shape,
  and separate tactical lineage.
- `docs/product/11-proteino.md` makes `προτείνω` part of the intended first
  application cohort, clarifies continuity and unsanitized delivery-style data,
  adds the candidate commander-mediated tactical loop, and records that
  addressable non-cognitive objects may receive compatible temporal behavior
  rules without becoming resident minds.
- `docs/product/10-ir-compatibility.md` keeps the strategy generality test at
  the application boundary and rejects an animate-only toolbox assumption,
  while `docs/product/06-roadmap.md` records the operator's application
  sequencing without moving a platform rung or selecting a date.
- `docs/publication/audience-status-index.md` classifies the new candidate
  section as vision; the affected software-engineer edition source lock is
  refreshed from its unchanged audience selection.

**Scope effect:** This breakout creates no running world, resident, commander,
tactic, object rule, trigger, effect, event kind, `Actor`, `Identity`, `Program`,
authority grant, UI, adapter, helper, or work-order allocation. Its use of
“self-running” means autonomous modeled continuity, not an always-on process or
wall-clock guarantee. Simulation results remain scoped to declared runs;
linguistic force does not manufacture authority, consent, compatibility, or
rule installation; and displayed interpretation never claims private thought.
The pre-existing implementation diff and Stage 1/Stage 2 captures remain the
implementation evidence subject for WO-016.

**Version, schema, and executable effects:** The v0.3.6 release
classification, component/schema/artifact versions, dependencies, authority
rules, sequence, and executable surfaces do not change. No simulator,
background service, world clock, resident/entity/commander/tactic schema, RTS
engine, object taxonomy, rule grammar, renderer, or model is selected or
implemented.

**Unresolved choices:** World, resident, entity, group, and commander models;
run/pause/pacing/catch-up/background-persistence semantics; whether proposition
content and delivery tone are independent mechanics; recipient and group
resolution; object instance/class/set addressability and capability discovery;
non-cognitive rule delivery, suggestion strength, equip, compatibility,
conflict, trigger identity/reach/count/order/reset/duplicate/lifetime, and
permitted-effect semantics; operator role; consent and influence modes; engine,
renderer, model, seed, replication, and evaluator policy; option count,
explanation, merge, free-form revision, feasibility, staleness, delegation,
order, acknowledgement, contingency, tactic lifetime, promotion, and debrief
semantics; whether the strategy loop is a sibling application, a `προτείνω`
mode, or a specialized activity; and exact release placement. None is silently
selected by this receipt.

**Required review and continuation:** Verification and final review must digest
this receipt, the named ledger entry, all three promoted product sections, the
publication classification and refreshed lock, and the local raw capture. They
check clean-room rewriting, traceability to operator intent, canonical
vocabulary, consistency with settled authority/replay/application boundaries,
internal links, absence of raw verbatim promotion, and that candidate mechanics
were not presented as implemented or scheduled. They must confirm the ongoing
world is a felt interaction shape rather than a daemon or real-time guarantee;
that abrasive language was not exact-filed; that commander suggestions remain
separate from authorized commands; that an apparently inert object is not
treated as sentient; that suggestion strength does not silently install a rule;
that temporal trigger behavior names its replay inputs rather than relying on
prompt magic; and that this documentation change did not alter WO-016 code,
acceptance, version, or captured evidence. With this receipt complete, the
operator's explicit authorization returns execution to WO-016.

## Documentation scope-expansion receipt — 2026-09-03

**Authority:** While WO-016 remained active, the operator explicitly expanded
the documentation scope to the repository front door and related explanatory
passages. The review rejects the existing README lead as an inadequate compact
statement of the product, corrects a mixed RPG analogy, and resolves an apparent
contradiction between felt judgment and formalization. The operator separately
nominated the already-public Barnes & Noble quotation as a possible README lead
and left its existing vision placement available. This authorizes the bounded
documentation changes below; it does not alter the reactor implementation,
acceptance criteria, or release classification.

**Source treatment and clean-room review:** The opening quotation is reused
verbatim from the operator-authored public passage already filed in
`docs/product/00-vision.md`; it remains there as well. The surrounding thesis
and explanatory corrections are newly synthesized from the live review rather
than copied from local intake. The displaced tagline is retained in lineage
rather than silently erased. Historical ledger entries and work-order receipts
that used the older analogy remain unchanged. No employer code, configuration,
identifier, internal service, credential, private identifier, or other
clean-room stop condition was present.

**Changed surfaces:** `README.md` now leads with the executable-shelf quotation
and immediately translates it into a compact product thesis. The README and
`docs/product/00-vision.md` use one fitted-loadout comparison: carrying gear for
every damage type when the encounter requires only cold resistance.
`docs/product/03-architecture.md` applies the same mapping to episode-scoped
coordination skills, and the diagnostic wording in `docs/product/06-roadmap.md`
now asks whether an unnecessary gear set was equipped. The vision's core bet
now treats formulations as tested constructions that progressively approach
felt judgment rather than claiming to exhaust it. The newest idea-ledger entry
records all three decisions and the displaced tagline.

**Version, schema, and executable effects:** None. This expansion introduces no
type, event, decision, program, runtime behavior, dependency, version change, or
new publication heading. It does not invalidate or broaden the staged CLI, log,
audit, test, or mutation evidence. Publication locks are refreshed only because
their selected vision and architecture source bytes changed.

**Required review:** Verification and final review must include this receipt,
the README lead and one-paragraph story, the vision's core-bet and
differentiated-interface passages, the architecture loadout paragraph, the
roadmap diagnostic, the newest ledger entry, and the refreshed publication
locks. They check that the lead is intelligible to a newcomer; the compact
thesis names an actual product rather than only a mood; the quote remains exact
and present in both authorized locations; the gear analogy preserves the scoped-
context point without switching to support links mid-comparison; the new
approximation language does not claim that felt judgment is exhaustively
formalizable; and no historical append-only record was rewritten.

## Implementation evidence receipt — 2026-09-03

**Implementation subject:** `packages/skeleton/src/reactor.ts` exports the pure
typed `seiriReactor`; its only import is `@dotln/kernel`. A source-wide scan
finds every call to `evaluateCadence`, `authorize`, `decideProgram`, and
`guardQueuedPulse` in that file and none elsewhere under
`packages/skeleton/src/`. The live host owns the fakes, scheduler, append loop,
and effect execution. `replayScenario` is decode plus the kernel's `replay()`
and state projection, with no event-type branch or fixture input. `audit.ts` is
byte-unchanged. `scenario.ts` is 506 lines versus 748 on `main`, a reduction of
242 lines. No dependency was added; the changed skeleton source advances the
component from `0.3.1` to `0.3.2`.

**Two-stage output capture:** The retained scratch root is
`/private/tmp/dotln-wo016.Xq04pt`. Stage 1 is byte-identical to its pre-change
baseline by `cmp` for all four named surfaces:

- default CLI: 26 lines, 888 bytes,
  `sha256:a27376e24c663aad9b597b3121b9d98c1a244d1b6da07b5f3452c67d2730874e`;
- `--audit` CLI: 1,027 lines, 28,866 bytes,
  `sha256:e928623bc8b02ddb7886dd1ae602ac84fee6d8b9e5f9d2897fb42d37014b89d7`;
- JSONL log: 21 lines, 8,050 bytes,
  `sha256:6090a8e3b6a6d141c1c5c79dd46742c10f6a2a9ca3ade2a9be4d2021a71ab11f`;
- three audit projections: 999 lines, 27,976 bytes,
  `sha256:76c92943c5299afbeb69a54a8f07dac593c4e80b0e04517ed77ec76ef2785a65`.

The Stage 1 patch and reactor-only patch are retained beside those captures.
Stage 2 leaves the default CLI byte-identical except for its version banner,
which the mandated component bump moves from `v0.3.1` to `v0.3.2`; normalizing
that banner reproduces the Stage 1 digest exactly. Its linked log is 21 lines
and 8,805 bytes
(`sha256:44f92c9061c3d0080c1718e7856a5b90c368189b2f92fbc49e84bac107ab22e2`),
its audit projection is 1,054 lines and 29,797 bytes
(`sha256:45f12c35ed5a4df75bc01cb88c5b2dd49224136666a6e5fc2f0320ce972de5a4`),
and the additive `--audit` CLI is 1,082 lines and 30,687 bytes
(`sha256:b6fbb9c64d23aa9c49e89637ab5d3313fb7f1c56c7199961e4feccc4988b39cd`).
Restoring each changed Stage 2 link field to its baseline value reconstructs
both the baseline log and audit bytes exactly by `cmp`.

**Itemized Stage 2 audit delta:** A structural comparison reports byte-equal
receipt output; identical event ids, types, and payload bytes; identical audit
record ids and timeline ordinals; 17 newly present event causation ids and 11
newly present event correlation ids; ten timeline records gaining causes and
six gaining correlations; unchanged omission declarations; and governed-raw
changes confined to the two link fields. The sole non-link value change is
`audit:evt_16:verification.association`, from
`derived-single-request-in-scope` to `explicit-event-link`. The existing
`evt_5` group remains the work-order/authority pair; the command group expands
from its external-effect/result pair to include the deletion attempt, refusal,
episode result, and verification; and `evt_18` adds the queued-pulse no-op and
cancellation-effect pair. The comparison script and reconstructed baseline-link
artifacts are retained in the stage scratch root.

**Mutation drill:** All thirteen mutants compiled successfully and were killed
by their named tests. Replay-side evidence is split between
`/private/tmp/dotln-wo016-r1-r3.ia5tz7/evidence` and
`/private/tmp/wo016-r4-r7.lmWUXW/evidence`:

- a replay-only wrong-decision-index equivalent that derives a different
  command id, a replay-only `now := 0`, dropped authorization evidence (the
  recorded `authorizationEvidence` state projection, as `R3.patch` shows; the
  `authorize()`-argument variant is an equivalent mutant because `auth_seiri`
  declares `requiredEvidence: []` and the refusal fires on `effect denied`),
  empty deletion paths, forged projected work order, and empty projected
  candidates each fail `WO-016 AC3 live and replay match every complete
  Decision and semantic projection`;
- forced replay verification success fails `WO-016 AC7 a negative fixture stays
  unverified in live, replay, and glyph state`.

Each targeted invocation selected one test and produced only its intended
failure. R1, R2, and R4–R7 were independently restored byte-for-byte. The R3
scratch restore command was interrupted after its valid compile and kill, so
that isolated copy's final restoration is unverified; it never touched the
shared worktree, whose `scenario.ts` remains the pristine
`sha256:822634c0784af4c80af26baeb0f6f1fab1d16ed7276d6bd1937afe4e92b106e7`.

Payload evidence lives at
`/private/tmp/dotln-wo016-payload-mutants.k4kEEU/evidence`. Empty
`CommandResult.candidates`, false `VerificationCompleted.accepted`, a forged
`WorkOrderEmitted.workOrder`, a forged `CommandRefused.reason`, empty
`SchedulesCancelled.scheduleIds`, and a changed persisted command effect each
fail the correspondingly named child of `WO-016 AC4 semantic payload changes
alter the decision at their event`; the other five children pass in each run.
The restored control compiles and passes all 16 scenario tests, and the shared
source hashes match the pristine snapshot.

**Passing gates:** `npm test --workspace @dotln/skeleton` reports 29 tests
passed and zero failed. The final root `npm test` reports 110 tests passed and
zero failed after formatting, publication, intake-backup, resume, checkpoint,
worktree, and release fixture suites pass. `npm run skeleton` prints the exact
21-event sequence and ends `verified=true candidates=1`. The negative fixture
is pinned at `verified=false` and `○ unverified`. Publication coverage is
161/161 headings, with all 27 everyday-user and 42 software-engineer linked
source sections current. `release.mjs check-surfaces` passes the `v0.3.6`
release block, unchanged kernel `0.2.0`, changed skeleton `0.3.2`, and current
GitHub-body profile. `git diff --check` is clean.

**Known retained limit:** The audit fold can use the explicit verification
link, but its historical association fallback remains adjacency-based because
this order forbids modifying `audit.ts`. The capability reassessment therefore
keeps both named rows at level 1, and the work-order map carries an unallocated,
unversioned link-first audit-hardening candidate. Independent verification and
final review remain required before any release claim.

## Owner-sovereignty ideation breakout receipt — 2026-09-03

**Authority:** While WO-016 remained active, the operator opened a complete
`ideation:` breakout about an owner's freedom to select a permissive operating
posture, then immediately corrected the architectural level: authority,
evidence, replay, and Clean Room strictness are rules of the author's personal
implementation, not necessarily rules baked into the reusable DotLn platform.
Both layers will live in this repository. That correction governs this receipt
and authorizes the documentation promotion below; the operator's standing
instruction returns execution to WO-016 after intake.

**Raw batch and source treatment:**
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md` preserves both
operator messages unedited as ignored local source material. The committed
surfaces use ordinary Shape-First Synthesis and do not promote the raw metaphor
for knowingly accepting operational risk. No Direct Draft Fidelity exception
was requested. The clean-room screen found no employer code, configuration,
identifier, internal service, credential, private identifier, or other stop
condition. The repository Clean Room remains binding while processing even the
idea that unrelated implementations may choose a different source policy.

**Promoted boundary and surfaces:**

- [ADR-0006](../decisions/0006-platform-mechanisms-instance-doctrine.md)
  separates reusable platform mechanisms from implementation doctrine, keeps
  the author's strict reference loadout binding here, and accepts a future
  owner-sovereign profile as legitimate instance content.
- `README.md`, principles, vision, domain model, architecture, interfaces,
  pattern library, roadmap, assurance design, IR compatibility, and
  `προτείνω` now label claims as platform contract, personal-instance doctrine,
  or another owner's optional profile where that distinction is material.
- The newest idea-ledger section preserves the correction as an adopted
  architectural decision. The audience index classifies the new architecture
  candidate as vision, and the work-order map nominates a follow-on without
  allocating or scheduling it.

The platform supplies typed mechanisms, capability declarations, compatibility
semantics, and inspection. An implementation decides which mechanisms are
hard, advisory, replaced, or absent. If it omits verification, history, or
replay, its projection says so instead of claiming the omitted guarantee. An
owner-controlled profile may remove DotLn-imposed restrictions only for the
resources and control plane it owns; it cannot promise to override provider,
harness, operating-system, destination, or service policy.

**Scope and executable effects:** This breakout adds no permissive mode,
wildcard authority, owner identity, authentication flow, settings toggle,
saved profile, schema, package split, adapter, command vocabulary, or runtime
behavior. It changes no dependency, component version, application release,
acceptance criterion, staged output, mutation result, or evidence hash. The
personal implementation's current security, authority, evidence, replay,
retention, review, and Clean Room posture is unchanged. ADR-0003 through
ADR-0005 remain local personal-harness choices; this receipt does not rewrite
their historical decisions.

**Unresolved choices:** The future profile's name; owner identity,
authentication, recovery, and transfer; single- and multi-owner precedence;
resource ownership; standing and wildcard grants; activation, persistence,
visibility, export, and revocation; whether doctrine change, authorization, and
dispatch can be one explicit operation; history erasure semantics; minimum
capability declarations; provider and local-model selection; and the eventual
directory, package, manifest, saved-build, and conformance-suite boundary. No
choice is implied by the word “sovereign.”

**Required review and continuation:** Verification and final review must digest
this receipt, ADR-0006, the newest ledger section, every promoted product-doc
passage, the README boundary, audience classification, refreshed publication
locks, and the unallocated map candidate. They check that strict repo rules
remain enforceable while no longer masquerading as universal platform law;
that a missing capability is labeled absent rather than degraded silently;
that risk acceptance is neither authority nor evidence; that external control
planes remain outside DotLn's promise; and that no executable bypass or package
split entered WO-016. With this receipt complete, the operator's explicit
continuation authority returns execution to the reactor work order.

## Presence and unattended-portfolio ideation correction receipt — 2026-09-03

**Authority and correction:** The operator continued the open `ideation:` batch
to reject a categorical “authority never grows while away” rule and restore the
founding upside-down curve, explicit Blackjack +3 progression, reset/loop, and
the possibility of deliberately preauthorized higher-impact effects. A further
refinement moved the old recurring-prompt workaround to eventual automatic
WorkOrder processing: start with eligible small orders already inside standing
authority, and treat larger preauthorized orders as optional capacity-permitting
candidates. The standing instruction then returns work to WO-016.

**Raw batch and clean-room treatment:** The ignored local source remains
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. The committed
synthesis does not promote a named review tool from the raw contrast and does
not use Direct Draft Fidelity. The screen found no employer code,
configuration, identifier, internal service, credential, private identifier,
or other stop condition.

**Promoted decision:** [ADR-0007](../decisions/0007-presence-is-a-policy-input.md)
defines presence as a policy input with no inherent direction. Attention
priority, work-scope budget, effect authority, and observed external capability
remain separate. A recorded, source-granted policy may hold, shrink, grow,
peak, step, stop, reset, or loop supported outputs inside its ceiling; no
declaration means hold, and policy cannot manufacture an unavailable external
capability. The ledger's resolution explicitly supersedes earlier categorical
no-growth clauses without rewriting them.

README, vision, principles, domain model, architecture, interfaces, pattern
library, roadmap, assurance, compatibility, and `προτείνω` now carry that
distinction where material. The roadmap and work-order map preserve an
unallocated unattended-portfolio candidate. Selection, activation,
authorization, capability, and completion remain different states.

**Executable boundary:** This documentation correction adds no PresencePolicy
schema or compiler, authority transition, scheduler, Blackjack rules, adapter,
automatic WorkOrder processor, wildcard grant, package, component version, or
runtime behavior. The skeleton's no-deletion and return-cancellation scenario
remains one conservative fixture. All WO-016 implementation evidence and hashes
remain about the same reactor subject.

**Review:** Verification and final review must confirm that no current fixture
is misrepresented as platform law; actual effect-authority growth is labeled
honestly; work budget does not silently grant effects; elapsed silence alone
does nothing; unavailable capability stays unavailable; and the follow-on is a
candidate rather than active execution authority.

## Intake-lifecycle ideation correction receipt — 2026-09-03

**Authority and measured answer:** The operator asked how ignored intake created
inside a work-order worktree can influence later work at all. Read-only
inspection confirmed the current raw batch exists only in this worktree and is
absent from the main checkout. Tracked synthesis travels through Git; ignored
raw bytes do not. `npm run backup:intake` archives only its caller's checkout,
and ordinary cleanup protects the note by refusing removal, but neither action
synchronizes it to main or registers it for later semantic reconciliation.

**Promoted surfaces:** The ledger records the distinction between storage
durability and semantic synthesis. Architecture and roadmap nominate one
private-store resolver with capture/status/reconcile operations, safe collision
handling, atomic verified copies, owner-only backup, and a private receipt
manifest. The execution guide, playbook, and docs index now say plainly that
reconciliation is manual until such a helper exists. The work-order map carries
the unallocated control candidate without assigning a number or sequence.

**Present obligation:** The active raw file stays protected in this worktree.
Before this worktree can be removed, it must be backed up and its bytes
reconciled into trusted surviving storage; a successful backup alone is not a
cleanup grant. No cross-worktree copy, removal, new helper, manifest, or storage
migration is performed by this receipt.

**Review:** Verification and final review must confirm the docs never imply Git,
checkpoint commits, stash, backup, or closeout transports ignored intake; that
manual reconciliation is described without pretending it already happened;
and that the future storage helper cannot weaken the repository's Clean Room
screen or auto-promote raw wording.

## Local-settings closeout ideation receipt — 2026-09-03

**Authority and diagnosis:** The operator asked to stop hearing about
`.claude/settings.local.json` on every `resume: release close`. Path metadata and
the release/worktree implementations were inspected without reading the local
file. The file is persistent operator-owned state in the main checkout, is
ignored through a user-global rule, and is not read by repository scripts or
tests. The release guard nevertheless rejects it unconditionally before
release classification. A subject-worktree copy presents a different risk:
cleanup would delete it, so the existing refusal is protective.

**Promoted correction:** The ledger, playbook, execution guide, and harness
security guide specify an exact-path asymmetric policy. WO-018's dated scope
clarification owns the executable change: add the exact root path to the repo
ignore contract and main-checkout release-influence allowance; retain
worktree-local refusal; test survival in both paths; preserve foreign ignored
and intake refusals. `.claude/**` is never allowed wholesale, settings are not
copied into evidence, and historical final reviews remain unchanged because
their warnings were true when written.

**Executable boundary and review:** WO-016 changes no `.gitignore`, release or
worktree script, settings file, fixture, dependency, version, or runtime
behavior. Until WO-018 lands, the warning remains expected. Reviewers confirm
that this routing does not silently declare personal settings disposable, does
not broaden the release evidence allowlist, and does not weaken
`docs/intake/dist/**` precedence protection.

## Sources, inspirations, and legal-posture ideation receipt — 2026-09-03

**Authority:** The operator continued the same open `ideation:` batch with two
requests: make the project's full intellectual inheritance explicit rather than
hiding familiar or possibly protected names behind DotLn-native abstractions,
and investigate licensing and other legal preparation while the repository is
still personal, noncommercial work. The standing continuation instruction
returns execution to WO-016 after this promotion.

**Raw batch and source treatment:** Both messages are preserved unedited in the
same ignored local batch. The public copy uses ordinary Shape-First Synthesis;
no Direct Draft Fidelity exception was requested. The clean-room screen found
no employer code, configuration, identifier, internal service, credential,
private identifier, or other stop condition. Public legal research used GitHub,
npm, the U.S. Copyright Office, USPTO, OSI, SPDX, Creative Commons, and the DCO
project as starting points; the resulting note expressly is not legal advice.

**Intellectual-provenance promotion:** New
`docs/lineage/inspirations.md` is the canonical best-known public register. It
begins with the non-novelty posture, distinguishes source-reviewed,
operator-used, recollected, nominated, and ambient knowledge, inventories every
currently discovered influence family, accepts unknown and unmapped entries,
and separates inspiration from copied expression, dependencies, licenses, and
third-party notices. The vision remains a curated narrative and links the full
register. README and docs map make it discoverable. ADR-0001's amendment narrows
its “authorship not worth proving” clause so internal forensic uncertainty
cannot erase known outside attribution or rights provenance.

**Legal-status promotion:** New `docs/LEGAL.md` records the observed interim
state: the repo has no project license and therefore is not presented as open
source; GitHub's service-level public-repository rights are separate; and no
permanent license is selected here. It compares no-license, MIT, Apache-2.0,
and custom/source-available directions at a high level, then gates outside
contributions, artifact distribution, hosted users/data, commercial use, and
serious brand investment on an explicit later decision. README and roadmap
surface the same status. The map nominates a bounded governance follow-on.

**Measured package gap and executable boundary:** Root and skeleton manifests
are private; `@dotln/kernel` lacks `private: true`, and no workspace declares
`UNLICENSED`. npm's own guidance recommends both for a private/unpublished
package that grants no usage rights. This receipt does not change a manifest,
add a `LICENSE`, copyright-holder string, SPDX expression, contribution policy,
notice file, privacy policy, package-publication guard, dependency, version, or
runtime. Those are deliberately held for an explicit license choice and tested
follow-on rather than smuggled into reactor work.

**Review:** Verification and final review must confirm that “full” means honest
best-known inventory rather than impossible omniscience; unknown attribution is
not guessed; protected clean-room sources remain excluded; named sources do not
become architecture or copied material merely by listing them; the register is
not confused with WO-109's private mining register; no-license is stated as the
current status rather than a forever choice; and no legal text claims to replace
professional advice.

## Post-ideation executor evidence addendum — 2026-09-03

The implementation subject did not change during the expanded ideation pass.
After the final synthesis and independent documentation audits:

- `npm test` passed 110/110 tests with zero failures, skips, or cancellations;
- `npm run skeleton` produced the canonical 21-event scenario with
  `verified=true candidates=1`;
- the publication checker covered 165/165 product headings and both audience
  projections matched their refreshed source locks;
- `node scripts/release.mjs check-surfaces` passed the `v0.3.6` release block,
  unchanged `@dotln/kernel` component, changed-and-bumped `@dotln/skeleton`
  component, and empty-current-final-review-body expectations; and
- `git diff --check` passed.

Two independent documentation passes then closed the remaining categorical
platform/profile wording, clean-room inheritance wording, legal-trigger
summaries, and exact-expression consistency. The source-associated phrasebook
retains its operator-authorized exact candidate under a bounded brief-expression
review; runtime, source-identifying/brand, marketing, and commercial uses remain
separate review triggers. No license, manifest guard, settings exception,
PresencePolicy runtime, intake reconciler, or simulation engine was implemented
inside WO-016.

The local ignored intake batch was backed up after its final legal note. Backup
is not reconciliation: the note remains a worktree-local source that must be
manually copied into the canonical private intake before worktree removal. This
packet is ready for the governed `implementation-ready` transition; independent
verification remains the next role.

## Final-review evidence corrections — 2026-09-03

FINAL-001 applied three wording corrections to the implementation evidence
receipt above, each re-measured first-hand before editing; the captured
evidence, code, acceptance criteria, versions, and prior verification are
untouched. (1) The Stage 2 audit-projection digest was recorded with 65 hex
characters, ending `…ce972de5a65`; the measured SHA-256 is the 64-character
value ending `…ce972de5a4`, which VER-001 and FINAL-001 both reproduced, and
the receipt now carries it (VER-001 F1). (2) "Stage 2 leaves the default CLI
byte-identical" was true when captured before the manifest bump and is false
for the delivered tree by one banner line; the receipt now names the version
banner exception (VER-001 F2). (3) The mutation drill's "dropped authorization
evidence" mutant now names its target, the recorded `authorizationEvidence`
projection, and records that the `authorize()`-argument variant is an
equivalent mutant under `requiredEvidence: []` (VER-001 F4). See
[FINAL-001](../final-reviews/WO-016/FINAL-001.md).
