# WO-023 — Compile the Entropy Reducer: identity, role, loadout, envelope, Program, and generated residue (version assigned at activation)

**Model:** any capable model for the implementation. The loadout it compiles
pins its own actor: Claude Fable 5.1 at `max` effort for review episodes
(Principle 8; a substitute is a different reviewer and must be attested as
one).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: minor. It adds instance content, a hand-assembled compile step beside
WO-003's provisional loadout, and a generated residue; no runtime transport.
**Nomination provenance:** the operator's 2026-09-02 request to regenerate the
session's reviewer with the project's own primitives, after that session
produced the WO-016 through WO-022 and WO-109 drafts. The manually authored
v1 dispatch residue is preserved locally at
`docs/intake/notes/entropy-reducer-dispatch-residue-v1.md`; it is the
pre-compilation oracle, not a claim that the generated artifact already
exists.
**Depends on:** `main` at or after `v0.2.3`. WO-019 recommended so the
loadout's effort pin is attested. WO-008, when it lands, migrates this
hand-assembled loadout into the real compiler the way its criterion 6 migrates
the Seiri loadout; until then this order follows WO-003's precedent of a
provisional, non-normative object plus a `compile*` function.

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
to a Standardize link and its supports, one AuthorityEnvelope, one Program,
one Cadence, and one verification plan. Compile them with a hand-assembled
compile step into a kernel `WorkOrder`, an envelope, and a generated residue
file that is the dispatch prompt. Run the compiled order once through the
operator-mediated manual dispatch into Claude Code and verify the reviewer by
refutation.

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

**Definitions (authored as data, non-normative until WO-008):**

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
  evidence requirement, cost, and determinism: Verify-First (evidence label
  per finding), Fan-Out Lens (at most four read-only side routines with fixed
  briefs and word budgets), Mutation Drill (an evaluator over a scratch copy),
  Shape-First (state literal weaknesses and fixes, then carry the analogy's
  shape down the ladder), Constraint-First Ordering, Altitude Tag, and Sparse
  Receipt (the output contract).
- The product's Clean Room is an active mechanic with contextual supports (05
  §Clean Room). This order does not implement that later composition. Its
  provisional loadout compiles the active's minimum admissibility floor as a
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
  an `All` over the lens invocations, an `Invoke` of probes, `Emit` findings,
  `Emit` proposals, `Await` operator disposition. `All` is a deferred kind in
  the shipped kernel (WO-002 scope), so the first run follows the Program by
  hand through an operator-mediated manual dispatch into Claude Code, and the
  order records that.
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

**Scope discipline:** the definitions live beside the skeleton's provisional
loadout (`packages/skeleton/src/loadouts/`) until WO-008 decides the
instance-content location; the compile step mirrors `compileWorkOrder` and
emits `WorkOrder`, `AuthorityEnvelope`, the Program, a typed-output validator,
and the one tracked `docs/instance/entropy-reducer/RESIDUE.md` projection; no
runtime transport, no new dependency, kernel untouched. Definitions plus the
pure compiler are authoritative. No separately authored tracked dispatch prompt
exists: a test regenerates the residue in memory or a temporary directory,
proves every support renders exactly one paragraph, and byte-compares that
result with the tracked projection. The ignored hand-authored v1 oracle remains
an input oracle outside the tracked-artifact assertion.

**Deliverables:** the definition module; `compileReviewerWorkOrder()`; the
generated `docs/instance/entropy-reducer/RESIDUE.md` (path provisional until
WO-008); the lens brief schema; a refutation-plan document naming what a
blinded Contra-Auguste episode checks; tests; one recorded review episode run
from the compiled order through an operator-mediated manual dispatch into
Claude Code; write-backs.

**Acceptance criteria (all required)**

1. The Identity, Role, active, link, supports, masks, envelope, Program, and
   Cadence exist as typed data; the compile step returns a `WorkOrder` whose
   thirteen fields are populated from them, with allowed and prohibited
   operations equal to the envelope's effects and `requiredEvidence` equal to
   `["reproduction"]`.
2. `authorize` refuses a `repo.write` and a `git.mutate` intent under the
   compiled envelope with a trace and grants `repo.read`; the typed-output
   validator refuses a finding without `reproduction` before `report.emit`.
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

**Non-goals:** the composition compiler (WO-008); a real transport for the
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
3. The definitions live beside the skeleton's provisional loadout until
   WO-008 chooses the instance-content location.
4. The reviewer is pinned to Fable 5.1 at max; a cheaper reviewer is a
   different identity version, never a silent substitution.
