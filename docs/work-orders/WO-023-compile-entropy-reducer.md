# WO-023 — Compile the Entropy Reducer: identity, role, loadout, envelope, Program, and generated residue, v0.5.0

**Model:** any capable model for the implementation. The loadout it compiles
pins its own actor: Claude Fable 5.1 at `max` effort for review episodes
(Principle 8; a substitute is a different reviewer and must be attested as
one).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.5.0` minor. It adds instance content, a
loadout compiled through the landed `@dotln/compiler`, a generated residue, and
the bounded claim-free prefix-glob lowering required by that loadout; no runtime
transport.
**Nomination provenance:** the operator's 2026-09-02 request to regenerate the
session's reviewer with the project's own primitives, after that session
produced the WO-016 through WO-022 and WO-109 drafts. The manually authored
v1 dispatch residue is preserved locally at
`docs/intake/notes/entropy-reducer-dispatch-residue-v1.md`; it is the
pre-compilation oracle, not a claim that the generated artifact already
exists.
**Depends on:** published `v0.4.1` (satisfied). WO-019 supplies the loadout's
effort-attestation mechanism. WO-008 is merged and this activation retargets
the pre-WO-008 draft to the real `@dotln/compiler`; no second hand-assembled
composition path is permitted.

**Cites (read these sections):** 02-domain-model.md §Identity and composition
(Identity, Role, LoadoutGraph, Active mechanic, Support facet, Link,
Phenotype, AuthorityEnvelope), §Actors and episodes (WorkOrder,
ProductSuggestion, Result envelope), §Feedback (VerificationFinding, the
mechanism hierarchy), §Memory and observation (Watcher); 03-architecture.md
§Composition system (the four compile steps and the precedence),
§Agent-originated product suggestions (proposal packets under
`docs/proposals/`; promotion is a separate operator act), §Agent enablement
skills (residue generated from the same definitions), §The agentic
communication core (the mediator aggregates side routines; the main thread
stays thin); 04-interfaces.md §RPG view (helmet, gloves, armor slots; saved
builds as the default invocation path), §Agent projection;
05-pattern-library.md §5S (Shine makes cleaning double as inspection;
Standardize is token economics), §Party topology (Whiteface, Contra-Auguste,
Watcher, Lazzi and their named failure modes), §Systems & quality (Theory of
Constraints, Meadows altitude, antifragile response, the rote-compliance
detector); 01-principles.md Principles 3, 4, 5, 6, 8, 9, 11, 12, and 16;
07-execution-guide.md §Discipline; `docs/PLAYBOOK.md` §Who does what;
`packages/skeleton/src/scenario.ts` (`loadout`, `compileWorkOrder`).

**Objective:** Author the entropy reducer as instance content rather than as a
prompt: one versioned Identity, one Role, one loadout that links a Shine active
to Standardize plus seven other supports, one AuthorityEnvelope, one Program,
one Cadence, and one verification plan. Compile the loadout through the landed
`@dotln/compiler`, then assemble its kernel `Program`, typed validators, and
generated residue projection in the skeleton host layer. Run the compiled order
once through the operator-mediated manual dispatch into Claude Code and verify
the reviewer by refutation.

**What compiles where (the point of the order):** most of the reviewer's
behavior lands below prose. The tracked-repository and control-plane read-only
boundary is an envelope, not a sentence. The compiled `WorkOrder` declares
`reproduction` as required result evidence, and a typed-output validator
enforces it before `report.emit`. The current envelope's `requiredEvidence`
field is effect-wide, so it is not misrepresented as a per-finding payload
validator. Delegation is a resource limit and a brief schema. Only stance and
reading order remain as residue, and that residue is emitted by the compile
step from the support definitions, so editing a support changes the prompt and
editing the prompt is refused.

**Definitions (authored as compiler-v1 data):**

- Identity `entropy-reducer@1`: dispositions verify-first, measure rather than
  assume, candid and fair, propose rather than mutate, shape-first on operator
  analogies; invariants: read-only in the control plane, every finding
  reproducible, clean-room, settled decisions not relitigated; guarded failure
  modes named from the masks: over-centralization (authority mistaken for
  correctness), destructive contrarianism (findings that do not survive
  refutation), and side-routine budget creep.
- Role `planning-reviewer`: obligations of a whole-repository census, a ladder
  assessment, and proposals; objective per Principle 9 (reduce entropy without
  exporting cost to quality, authority, or operator attention); policy delta:
  constraint-first ordering.
- Active `Seisō` (Shine) tagged `observe`, `research`, `plan`, `verify`,
  `delegate`, `narrate`; never `mutate` or `destructive`. Linked to `Seiketsu`
  (Standardize) so every recurring finding routes to a test, lint, guard, or
  script rung.
- Supports, each declaring supported tags, semantics, authority change,
  evidence requirement, cost, and determinism: Seiketsu Standardize (recurring
  findings route to an executable rung), Verify-First (evidence label per
  finding), Fan-Out Lens (at most four read-only side routines with fixed briefs
  and word budgets), Mutation Drill (a verifier episode using scratch probes),
  Shape-First (state literal weaknesses and fixes, then carry the analogy's
  shape down the ladder), Constraint-First Ordering, Altitude Tag, and Sparse
  Receipt (the output contract).
- The product's Clean Room is an active mechanic with contextual supports (05
  §Clean Room). This order does not implement that later composition. Its
  instance loadout compiles the active's minimum admissibility floor as a
  hard validation/envelope guard before any report or proposal can leave the
  episode. That floor is neither ordinary nor bypassable, and no future support
  may weaken it.
- Masks: Whiteface for planning judgment, Contra-Auguste for self-refutation,
  Watcher class overall, Lazzi for delegates.
- AuthorityEnvelope `auth_entropy_reducer`: allowed `repo.read*`,
  `probe.run:scratch*`, `intake.capture`, `delegate.readonly`, `report.emit`;
  denied `repo.write*`, `git.mutate*`, `remote.*`, `settings.*`,
  `decision.edit`; resource limits `delegates: 4`, `probes: 32`;
  `requiredEvidence: []` because the shipped guard applies that field to every
  effect; expires at episode end; revoked by an operator stop event.
  `probe.run:scratch*` and `intake.capture` are bounded writes to the scratch
  directory and ignored intake capture respectively; they never authorize
  tracked, control-plane, remote, or settings mutation.
- Program, authored with the full grammar: `Sequence` of an `Invoke` census,
  an `All` over the lens invocations, an `Invoke` of probes, readiness/schema
  reference `Emit`s for findings and proposals, then `Await` operator
  disposition. The host validates the returned payload and separately prepares
  its `report.emit` intent; the kernel has no dynamic result-data binding.
  `All` is a deferred kind in the shipped kernel (WO-002 scope), so the first
  run follows the Program by hand through an operator-mediated manual dispatch
  into Claude Code, and the order records that.
- Cadence: `Once` on dispatch. Candidate, not default: gated on operator
  absence after each release close, the 5S organism's Sustain.
- Outputs, typed: findings shaped as `VerificationFinding` (criterion,
  severity, observed versus expected, reproduction, evidence refs, surface);
  proposals emitted as `ProductSuggestion` packet payloads through
  `report.emit`, with `docs/proposals/<id>/` per 03 as their eventual filing
  location only after a separate authorized act; promotion to
  `docs/work-orders/` remains an operator planning act; a `ResultEnvelope` as
  the terse receipt. This session's drafts went straight to
  `docs/work-orders/` under operator direction; record that as the bootstrap
  exception.

**Scope discipline:** the instance definitions live under
`packages/skeleton/src/loadouts/` and consume the pure compiler package selected
by WO-008. The host-layer compile step mirrors `compileWorkOrder` and emits the
compiled `WorkOrder`, `AuthorityEnvelope`, the kernel Program, a typed-output
validator, and the one tracked
`docs/instance/entropy-reducer/RESIDUE.md` projection; no runtime transport, no
new dependency, kernel untouched. Definitions plus the pure compiler are
authoritative. No separately authored tracked dispatch prompt exists: a test
regenerates the residue in memory or a temporary directory, proves every
support renders exactly one paragraph, and byte-compares that result with the
tracked projection. The ignored hand-authored v1 oracle remains an input oracle
outside the tracked-artifact assertion.

The required terminal prefix patterns exposed one landed compiler gap: its
types and the kernel supported prefix matching, but compilation rejected every
wildcard even where no precedence claim existed. This implementation extends
compiler v1 only for direct terminal prefix globs in a claim-free authority
composition. Participating wildcard claim targets and every direct-wildcard
plus participating-authority-claim graph still reject; unequipped catalog
definitions remain inert. The compiler README, domain model, interface
contract, ledger, tests, and component version move together; this is not a
second compiler or general wildcard precedence.

**Deliverables:** the definition module; `compileReviewerWorkOrder()`; the
generated `docs/instance/entropy-reducer/RESIDUE.md`; the lens brief schema; a
refutation-plan document naming what a
blinded Contra-Auguste episode checks; tests; one recorded review episode run
from the compiled order through an operator-mediated manual dispatch into
Claude Code; write-backs.

**Acceptance criteria (all required)**

1. The Identity, Role, active, link, supports, masks, envelope, Program, and
   Cadence exist as typed data; the compile step returns a `WorkOrder` whose
   thirteen fields are populated from them, with allowed and prohibited
   operations equal to the envelope's effects and `requiredEvidence` equal to
   `["reproduction"]`.
2. `authorize` refuses bare and family-member `repo.write` and `git.mutate`
   intents (including `repo.write.file` and `git.mutate.commit`) under the
   compiled envelope with a trace, grants bare and family-member `repo.read`,
   proves prefix anchoring and deny-before-allow, and the typed-output validator
   refuses a finding without `reproduction` before `report.emit`.
3. The residue is generated: each support maps to exactly one paragraph; a
   semantic change to a support changes the residue; a hand edit to the
   tracked residue fails a byte comparison with regeneration. Generation and
   any resulting tracked update occur during the authorized implementation
   phase, before the read-only review-episode baseline is captured.
4. The lens brief schema is enforced: a brief without files, questions,
   output shape, word budget, or the no-fix rule fails validation; at most four
   briefs compile per episode.
5. One review episode runs from the compiled order through an
   operator-mediated manual dispatch into Claude Code with the pinned model
   and effort attested, and produces typed findings, emitted proposal packet
   payloads ready for separate authorized filing under `docs/proposals/`, and
   a result envelope whose summary is under 200 words.
6. A blinded refutation episode attempts every `measured` finding from its
   command alone. It examines every `by inspection` finding when there are six
   or fewer; above six it uses a deterministic,
   surface-and-severity-stratified sample of at least six and at least one
   third rounded up. The report states each denominator, selection rule,
   reproduction, result, and reason; a zero denominator is `not-applicable`,
   never a synthetic pass. No survival quota gates acceptance. Findings that
   fail leave the promoted finding set rather than being argued, but remain
   attributable as `refuted` in the report.
7. Once implementation has produced the reviewed tracked residue, the compiled
   review order contains no tracked-repository, control-plane, remote, or
   settings mutation. Tracked status immediately before and after the manual
   review episode is byte-identical; a separate inventory proves scratch and
   ignored-intake deltas are confined to their authorized roots.
8. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** compile output; the three refusal transcripts; the residue
regeneration test; the brief validation test; the recorded episode with its
attestation; the refutation report; the tracked-status pair; the scratch and
ignored-intake delta inventory.

**Write-back duty:** 05 §5S names the Entropy Reducer as the second founding
identity, carrying Shine and Standardize beside the Repo Gardener's Sort;
`docs/PLAYBOOK.md` §Who does what gains its row (use: whole-repository entropy
review and proposals; never: implementing or verifying its own proposals); 03
§Agent-originated product suggestions records its first live use and the
bootstrap exception; `docs/README.md` map gains the instance path; ledger entry
(adopted: reviewer as compiled loadout; residue as projection; preserved: the
Sustain cadence).

**Non-goals:** a second composition compiler or general wildcard-claim
precedence; a real transport for the
reviewer (WO-009); automating the proposal pipeline; a new dispatch prefix in
`CLAUDE.md` (optional later, one config-log line); treating the reviewer's
output as authority; running it on a substitute model without attestation.

**Operator-review assumptions**

1. The identity is named Entropy Reducer and carries Shine linked to
   Standardize, not a new 5S pillar.
2. Proposals go to `docs/proposals/` per the architecture; the operator
   separately authorizes filing and promotion. The reviewer only emits their
   typed payloads. This session's direct-to-work-orders path is the recorded
   exception, not the rule.
3. The definitions live beside the skeleton's existing compiled loadout under
   `packages/skeleton/src/loadouts/`; WO-008 is landed and no location remains
   provisional in this order.
4. The reviewer is pinned to Fable 5.1 at max; a cheaper reviewer is a
   different identity version, never a silent substitution.

## Operator-authorized ideation breakout — pinned artifact identity (2026-09-04)

During the active implementation episode, the operator opened the full
ideation pipeline and then explicitly expanded scope to create WO-029 in this
session before returning to WO-023. The raw message and the included ad hoc
Fable planning report survive only in the main checkout's ignored
`docs/intake/notes/WO-023-expanded-ideation-2026-09-04.md`. Its SHA-256 is
`79a04485dfcbf63da7f6eac792d2e79b97b9aeb39fec541d419b6d27fa99badf`; the
raw source initially arrived through a `/private/tmp` file. After its canonical
ignored-intake copy was byte-validated and included in the owner-only backup
`DotLn-intake-20260904T151630Z.zip`, that temporary source file was removed.

The clean-room screen found no employer code, configuration, identifier,
internal service, credential, private identifier, or other stop condition.
Shape-First Synthesis retained the useful relation—freeze compiled identity at
equip, compare it at consumption, and fail closed on drift—without importing
the proposed signature analogy as architecture. The promoted surfaces are
`docs/work-orders/WO-029-pinned-artifact-identity.md`, the newest section of
`docs/lineage/idea-ledger.md`, `docs/product/03-architecture.md` §Candidate —
pinned artifact identity, and the WO-029 row and ordering notes in
`docs/planning/work-order-map.md`.

WO-029 deliberately separates the existing semantic equality key from
component-definition identity and defers signatures, Merkle membership, and
per-pulse submission until a real submitter and trust boundary exist. Its
activation version, event migration details, and eventual relationship to a
retimed WO-009 remain explicit later decisions; filing the draft grants none of
them. WO-023's verifier and final reviewer must inspect this receipt, the filed
order, the promoted architecture/ledger/map text, and the clean-room treatment
as part of their subject. WO-029 receives its own ordinary implementation and
independent evidence if the operator later activates it. No implementation code
was created or changed during the breakout itself.

## Operator-authorized ideation breakout — context projections and naming (2026-09-04)

The operator later opened two more full ideation passes in the same
implementation episode: task-specific, budget-aware pure projections for LLM
consumption, and the correction of the application name's Latin pronunciation
guide to
`προτείνω (protíno)`. The raw messages are preserved only in the main
checkout's ignored
`docs/intake/notes/WO-023-expanded-ideation-2026-09-04-02.md` (SHA-256
`165d095de7cfc0bf27d83f72c697e06bfad492a281d7cb74462abf24f979bc86`).
The validated owner-only backup is
`DotLn-intake-20260904T173830Z.zip` (SHA-256
`20ccea0ae5b7340a4a4b286e25f765be09ad902b75569fc6e98ea31a5376542d`).
No `/private/tmp` staging copy remains. The clean-room screen found no employer
code, configuration, identifier, internal service, credential, private
identifier, or other stop condition.

Repository audit showed that selective section reads, compiled context capsules,
prompt fragments, sparse agent projections, publication source references, and
visible `ModelInputPlan` edges already encode most of the proposed lens doctrine.
The missing implementation is a source-addressed, budget-aware
`ContextProjectionPlan` and invocation receipt, but no real transport consumes
one yet. The architecture and newest ledger section therefore preserve the
candidate without filing another work order: use a table of contents as the
first index; keep the architecture's required set fail-closed; make omissions,
costs, versions, and expansion handles explicit; let an effectful host
materialize sources; and wait for WO-009 or measured selective-reading failure
before adding a selector, tokenizer, cache, or optimizer. “Materialized
capsule” and “on-demand expansion” avoid overloading the repository's
established JIT/AOT compatibility terms.

The displayed application name is now explicitly the Modern Greek Verb
`προτείνω (protíno)`: the form means “I suggest” or “I propose” and serves as
the dictionary headword for “to suggest” or “to propose”; `protíno` is its
pronunciation guide, while `πρόταση` is the related noun and not the product
name. The historical `11-proteino.md` filename remains stable for cited evidence
and is not treated as the canonical Latin display form or a decided technical
slug. The final WO-023 subject includes these write-backs and the ordinary
verifier must inspect them with the rest of the implementation.
