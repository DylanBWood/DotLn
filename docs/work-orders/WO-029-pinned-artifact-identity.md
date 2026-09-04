# WO-029 — Pinned artifact identity: bind an equipped compilation to its consuming decisions (version assigned at activation)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: minor. It adds a compiler identity record and a fail-closed runtime
receipt to the author's personal implementation; it does not change the hash
algorithm or claim cryptographic authenticity.
**Nomination provenance:** the operator's 2026-09-04 WO-023 ideation breakout
about static compiled identity and runtime membership checks, followed by an ad
hoc Fable planning response and an independent repository audit. The unedited
material is preserved locally at
`docs/intake/notes/WO-023-expanded-ideation-2026-09-04.md`; this draft is a
Shape-First synthesis, not copied dispatch prose. The clean-room screen found
no employer code, configuration, identifier, internal service, credential,
private identifier, or other stop condition. Opaque identifier, not priority.
**Depends on:** WO-008 and WO-016 merged (satisfied: the compiler and one pure
reactor host are the subject); WO-023 merged (its second compiled identity is a
required fixture and its overlapping skeleton changes land first); WO-101's
independent FNV-1a-64 oracle remains available. Recommended after WO-023 and
before WO-009; the latter is the first out-of-process submitter that can consume
the receipt, but this order does not expand WO-009.

**Cites (read these sections):** 01-principles.md Principles 2, 3, 5, 6, 11,
15, and 18; 02-domain-model.md §Identity and composition (`IR artifact`,
LoadoutGraph v1, component manifest, separate version axes), §Events and
decisions (`DecisionTrace`), and §Memory and observation; 03-architecture.md
§Composition system (component manifest as participation proof and local
execution receipt), §The agentic communication core, and §Platform and instance
boundary; 04-interfaces.md §Editable-view v1 normalization and semantic hash;
09-audit-resilience-privacy.md §Candidate — model-input exposure plans and
§Candidate — public Git with a local private evidence lane; 10-ir-compatibility.md
§Separate version axes; ADR-0002 §§Decision 1, 3, and 4; ADR-0006
§§Decision 1–3; `docs/work-orders/WO-101-program-and-hash-corpus.md` (the
independent no-BigInt FNV oracle, not that order's local non-goals);
`packages/compiler/src/{compile,normalize,types}.ts`;
`packages/skeleton/src/{scenario,reactor,audit}.ts`.

**Objective:** Equip the author's personal runtime with a forward-only pinned
artifact-identity mechanism. A successful compile returns a separate,
versioned identity record containing the existing whole-program semantic
equality key, the compiler contract version, the compiler package version, and
domain-separated definition digests for the active/linked/ambient entries in
the component manifest. The host records
that identity at equip time. Each later decision that consumes a recompiled
program compares it with the pin and either records the pin in its durable
receipt or emits a typed, inert refusal on drift or compile diagnostics.

**Observed gap (dated 2026-09-04, `v0.4.1`):**

- `compileLoadout` returns `fnv1a64:<16 hex>` over the normalized compiled
  program. It is deliberately a deterministic semantic-equality key, not a
  guaranteed unique value, integrity proof, signature, or authenticity proof.
  The skeleton wrapper discards it and keeps only the compiled program.
- `LoadoutEquipped` records the raw graph. Its handler stores that graph and
  compiled authority, but no semantic hash or compiler contract/package version. Three later
  program-consuming branches recompile the graph. A compiler change during
  replay or a state/graph drift has no runtime comparison with the identity
  minted at the original equip boundary.
- The component manifest proves which declared active, linked supports, and
  ambient effects participated, but an entry carries only kind, id, version,
  link group, and mechanism types. It cannot distinguish two definitions with
  the same entry metadata. Many meaningful body edits already change the
  whole-program semantic hash; the missing datum is component-level source
  identity and attribution, not whole-program drift detection.
- Compiler diagnostics are typed at the compiler boundary, then converted to
  thrown errors by the skeleton wrapper. Before any equip event, runtime state
  nevertheless contains authority compiled from the module's default loadout.
  An unknown schedule id is inert and traced only in memory as
  `unknown-schedule`; it has no explicit durable refusal or NoOp evidence.
- The audit projection truthfully says integrity hashes were never collected;
  an FNV equality key would not make that statement false. It also has no row
  for deterministic artifact identity or drift comparison. No loadout-drift
  incident is recorded, and there is no external component submitter yet. This
  is a missing execution-receipt mechanism, not an incident response or a
  reason to add cryptographic trust machinery.

**Design and scope discipline:**

- Add `ArtifactIdentityV1` beside, not inside, `CompiledProgramV1`. It carries
  `compilerContractVersion` (the current `CompiledProgram.compilerVersion` IR
  contract), `compilerPackageVersion` (the executing `@dotln/compiler` package
  implementation version), the existing `semanticHash`, and
  component-definition records correlated to manifest entries by the exact
  tuple `(componentKind, componentId, version)`. Each record carries that tuple,
  a hash-scheme/version label, and `definitionHash`; link-group and mechanism
  projections remain manifest data rather than becoming identity keys.
- A component definition hash is `fnv1a64:` over domain-separated canonical
  JSON of the normalized participating definition. Its exact preimage and
  domain tag are public and tested. It is a deterministic content-equality key,
  not a cryptographic or collision-resistant claim. Keeping it outside the
  compiled program preserves the settled meaning and preimage of
  `semanticHash`; previously non-emitted source metadata does not silently
  become executable semantics.
- Artifact receipts also preserve the exact compilation-environment preimage
  needed to reproduce the whole-program key. In compiler v1, `repo`, base
  commit, and authority expiry participate in the compiled program; moving an
  otherwise identical graph to a different repository path therefore changes
  `semanticHash` legitimately and requires a v2 re-equip. WO-029 does not
  silently redefine that settled preimage. Component-definition hashes remain
  definition-scoped and path-independent.
- Only successful compilation produces an artifact identity. The compiler and
  kernel remain pure and dependency-free. Cross-check fixed vectors through
  WO-101's independent no-BigInt implementation so the compiler is not the only
  oracle for the value it mints.
- Keep the event envelope at schema v1 and make the equip payload transition
  explicit: the canonical new `LoadoutEquipped` payload carries
  `payloadVersion: 2`, the raw graph, and `artifactIdentity` with
  `schemaVersion: 1`. Absence of `payloadVersion` is the only legacy-v1
  discriminator. Host factories after the cutover can mint only v2 and reject
  a caller-supplied legacy shape. The reactor stores the pin only after
  recomputation agrees. Every later branch that recompiles to emit a schedule,
  WorkOrder, command, authority decision, or verification request passes
  through one comparison helper. Its persisted `DecisionRecorded` trace names
  the pinned semantic hash and both compiler-version axes as environment
  inputs.
- A mismatch or compiler diagnostic becomes a typed refusal event and a traced
  decision with no effect, schedule, or widened authority. It never throws out
  of replay. Pre-equip authority is absent; a compiled consumer before a valid
  equip fails closed. The existing historical raw-payload shape remains
  replayable with identity labeled `unavailable`; forward-only enforcement does
  not fabricate a pin or invalidate old logs. To distinguish historical replay
  from extending one of those logs, the upgraded host appends one canonical
  `ArtifactIdentityEnforcementStarted` boundary before it accepts new external
  input. Pre-boundary legacy history retains its old semantics. After the
  boundary, an `unavailable` state may not originate a program-consuming
  decision: it emits `ArtifactIdentityUnavailable` with no effect until an
  explicit v2 re-equip succeeds. New logs begin with the same boundary. This
  logged cutover keeps replay deterministic and prevents compatibility from
  becoming an unpinned forward-execution mode.
- Replace the inert unknown-schedule branch with an explicit, durable NoOp or
  refusal. This catches an id not present in the current compilation. It does
  not detect a pre-re-equip pulse whose schedule id is reused; that requires an
  artifact stamp on the pulse and remains deferred.
- Project the pinned identity and each refusal in the appropriate audit layer,
  while retaining the honest statement that cryptographic integrity and
  authenticity data are not collected. This receipt proves deterministic
  agreement with declared compilation. It does not prove the absence of hidden
  adapter effects or resist a malicious author who can rewrite both graph and
  pin.

**Deliverables:** `ArtifactIdentityV1` and pure derivation in
`@dotln/compiler`; skeleton equip/compare/refusal integration; explicit
unknown-schedule handling; audit projections; deterministic compiler and
skeleton fixtures using both Seiri and Entropy Reducer; documentation and
lineage write-backs.

**Acceptance criteria (all required)**

1. Two successful compiles of each fixture emit byte-equal
   `ArtifactIdentityV1` values. The record's component keys equal the compiled
   manifest's participating `(componentKind, componentId, version)` tuples
   exactly. Source/property/set-like ordering
   does not change a definition hash; a meaningful body edit under an unchanged
   component id and version changes only the edited component's definition hash
   and the whole-program hash when that edit changes compiled semantics.
2. The component hash domain, canonical preimage, and scheme version are pinned
   in docs and tests. Fixed vectors agree with WO-101's independent no-BigInt
   FNV implementation. The existing `semanticHash` algorithm and normalized
   `CompiledProgram` preimage remain unchanged; exact Seiri and Entropy Reducer
   semantic hashes either remain byte-identical or any independently explained
   change fails this criterion. The receipt records the exact compilation-
   environment inputs needed to reproduce the program key. A path-relocation
   fixture changes only the environment-sensitive whole-program identity,
   leaves definition hashes unchanged, and demonstrates the required explicit
   re-equip.
3. A new host-generated `LoadoutEquipped` event carries `payloadVersion: 2`,
   the raw graph, and exact schema-v1 artifact identity. The sole host factory
   cannot emit the legacy shape after cutover. The reactor recomputes before
   accepting it, stores the pin and compiled authority together, and starts
   with no pre-equip authority. A graph paired with a stale pin produces a
   canonical typed refusal and no intent, schedule, or authority; changing
   graph and pin together is explicitly outside the assurance claim.
4. One helper owns every post-v2-equip recompile/compare path. Compile
   diagnostics, compiler-contract-version drift, compiler-package-version
   drift, semantic-hash drift, and component-definition drift each produce a
   schema-valid durable refusal plus a decision trace instead of throwing.
   Every successful program-consuming `DecisionRecorded` trace after the
   enforcement boundary names the exact pinned semantic hash and both
   compiler-version axes. Replay of the same log yields the same decisions and
   audit receipt.
5. Historical pre-WO-029 `LoadoutEquipped` payloads without `payloadVersion`
   still replay before the logged enforcement boundary, are labeled `artifact
   identity unavailable`, and receive no retroactive assurance. The upgraded
   host appends exactly one `ArtifactIdentityEnforcementStarted` before new
   external input; thereafter a legacy-derived state emits
   `ArtifactIdentityUnavailable` until a valid v2 re-equip. Tests prove the
   factory cannot mint legacy payloads, the boundary is idempotent, a legacy
   log cannot consume forward input past it, and replay remains deterministic.
   The frozen WO-003 trace oracle is not rewritten; a new post-WO-029 fixture
   or an explicit delta assertion carries the new trace fields.
6. An unknown schedule id emits a durable inert NoOp or typed refusal rather
   than an in-memory-only `unknown-schedule` observation. A test states that a
   reused id from an earlier equip is not detected without event stamping and
   remains outside this order.
7. L0 and governed-raw audit projections expose the equip identity and drift or
   compile-diagnostic refusal through canonical event references. They add an
   explicit deterministic equality/drift datum while continuing to report
   cryptographic integrity and authenticity as unavailable and to distinguish
   both from outer-confinement evidence.
8. `npm test` is green; `git diff --check` is clean; kernel/compiler retain no
   runtime dependency or I/O; no new dependency; package and application
   versions match the activation-time release decision.

**Evidence gate:** exact identity fixtures and independent-FNV comparison;
before/after semantic-hash inventory; stale-pin, diagnostic, version-drift,
component-drift, pre-equip, legacy-before-boundary, legacy-after-boundary,
duplicate-boundary, factory-shape, unknown-schedule, and rewritten-pair
negative transcripts; canonical log and audit receipt; unchanged frozen-oracle
digest plus the explicit post-WO-029 delta; full test output.

**Write-back duty:** 02-domain-model.md (`ArtifactIdentityV1`, its separation
from semantic identity, and version axes); 03-architecture.md §Composition
system (shipped personal-profile pin/receipt and its limits); 04-interfaces.md
§Editable-view v1 normalization and semantic hash (unchanged semantic preimage
plus separate definition identity); 09-audit-resilience-privacy.md (what the
local receipt proves and still cannot prove); compiler and skeleton READMEs;
`docs/planning/work-order-map.md` (status and the WO-009 handoff); ledger entry
that extends both “Semantic equality is canonical compiled-program equality”
and “Composition proves participation per pipeline, including deliberate
absence” without rewriting either.

**Non-goals:** changing the `semanticHash` algorithm or treating FNV as
collision-resistant; signatures, keys, certificates, Merkle trees, or an ADR
claim about cryptography; making this personal-profile gate universal platform
law; per-pulse or per-effect component submissions; detecting a stale event
whose reused id carries no issuance identity; worker-result echo or transport
changes (WO-009); verifier-artifact pinning (WO-010); saved/community-build
trust; claiming protection against a writer who can replace both source and
pin; rewriting historical logs or the frozen WO-003 oracle.

**Operator-review assumptions**

1. The useful near-term choice is a deterministic, forward-only receipt and
   drift refusal. It is not necessary for today's all-in-process trusted graph,
   but it is the smallest hook the first external worker can consume.
2. Component definition hashes are separate provenance identities, not members
   of the whole-program semantic-hash preimage. A future membership gate may use
   them only after a real component submitter and threat model exist.
3. Signing becomes worth reconsidering at the first non-author graph, external
   principal, or distribution boundary with key ownership and rotation
   requirements. Until then hash equality is the stronger honest description.
4. Scheduling this after WO-023 and before WO-009 minimizes overlap and gives
   the mechanism two compiled identities to prove it generalizes. Activation,
   version assignment, and any retiming of pinned roadmap releases remain
   separate operator acts.
