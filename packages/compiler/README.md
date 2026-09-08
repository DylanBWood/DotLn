# `@dotln/compiler` v0.7.0

The pure DotLn composition compiler. It has zero runtime dependencies and no
I/O: callers pass a `LoadoutGraph` plus an explicit environment and receive a
compiled program plus a separate `ArtifactIdentityV1`, or inspectable diagnostics. The skeleton CLI is the current
host adapter that prints its projections.

## What v1 compiles

The public type surface covers the full graph boundary: `Identity`, `Role`,
`Container`, `ActiveMechanic`, `SupportFacet`, `Link`, `LinkGroup`,
`ExplicitPipeline`, `AmbientEffect`, `ResourceModel`, `Phenotype`, `PolarAxis`,
and `AuthorityEnvelope`. Executable lowering is deliberately narrower: one
active mechanic, at most one participating link group, at most one explicit
pipeline in that group, and the emissions exercised by the Repo Gardener +
Seiri scenario, the Entropy Reducer review loadout and the Beacon perception
loadout.

`compileLoadout` performs the four composition steps in order:

1. normalize identity, role, linked supports, and the typed-but-opaque axes into
   a phenotype;
2. type-check component references, tags, and required capabilities;
3. reject declared/hard/non-commuting conflicts or resolve soft claims through
   the declared nine-level precedence into effective claims (with authority
   winners applied to the runtime envelope and WorkOrder operations); and
4. emit the WorkOrder, permissions, schemas, cadence, statechart guards,
   verification episodes, prompt residue, manifest, trace, and per-support
   costs.

An incompatible support returns `SUPPORT INACTIVE`, the exact missing
capability or tag family, and concrete structured corrections. It is never
silently dropped.

`beaconSenses`, `beaconSenseLoadout` and `compileBeaconSenses` expose the first
perception supports: Beacon Sight, Fine Spectrum and Composition. They consume
host-derived `beacons.individual.metadata` / `beacons.group.metadata`
capabilities, declare no authority change, and emit `BeaconObserved` schemas.
The sweep active requires Beacon Sight. Each linked channel declares one
measured context line per bounded sweep and zero prompt fragments; the
skeleton host owns permission enforcement, mounted reads and sparse affordances.

Compiler v1 accepts exact authority and operation names plus direct terminal
prefix globs such as `repo.read*` when the participating graph has no
`authority.*` claims. Participating wildcard claim targets and any graph that
combines a direct wildcard with a participating authority claim reject, because
the kernel's broad matching cannot represent a safe exact-effect exception
chosen by precedence; unequipped catalog definitions remain inert.

## Views and semantic identity

The editable v1 views are code DSL (`defineLoadout`), function table, and
statechart JSON. Each has an explicit codec and normalizer. Object-key order and
set-like graph order are non-semantic; WorkOrder prose order and
`ExplicitPipeline.orderedSupportFacetIds` remain semantic. The hash is
`fnv1a64:` plus the 16-digit lowercase FNV-1a-64 digest of the UTF-8 canonical
JSON encoding of the normalized compiled program.

For the shipped Seiri fixture all three views compile to:

```text
fnv1a64:9ca8d0229c6bd8db
```

## Artifact identity v1

Successful `compileLoadout` and `compileEditableView` results also carry `artifactIdentity`: schema version `1`, `compilerContractVersion` (the program's unchanged `compilerVersion: "1"`), `compilerPackageVersion: "0.6.0"`, `semanticHash`, the exact `compilationEnvironment`, `authorityExpiresAt`, and `componentDefinitions`. The package version is a pure source constant tested against `package.json`; compilation performs no manifest I/O.

Each definition record contains only `(componentKind, componentId, version)`, `hashScheme: "dotln-component-definition-fnv1a64-v1"`, and `definitionHash`. Its tuples equal the participating component manifest exactly: active mechanics, linked supports, and declared ambient effects. Unlinked catalog entries do not acquire a participation receipt. Link groups and mechanism types remain manifest projections.

The exact definition-hash preimage is the UTF-8 canonical JSON of `{ domain: "dotln:component-definition:v1", componentKind, definition }`, where `definition` is the matching node of `normalizeLoadoutGraph(source)`. Object keys sort lexically; declared set-like collections normalize as before; ordered prose and pipelines retain their meaning. The output is `fnv1a64:` followed by 16 lowercase hex digits. The fixed Unicode ambient vector in `test/artifact-identity.test.ts` hashes to `fnv1a64:3a5e415be9582bed`; every fixture entry is cross-checked through WO-101's independent no-BigInt FNV implementation.

This record sits outside `CompiledProgram`, so neither new provenance metadata nor the compiler package version silently changes the semantic-hash preimage. A support-name edit changes its definition identity while leaving compiled semantics alone. The pinned Entropy Reducer fixture, at `/fixture/repository`, base `fixture-base`, and authority expiry `11000`, retains `fnv1a64:c5ddbca75f1c4cee`. Repository and base commit enter the compiled WorkOrder; authority expiry comes from the raw active definition. Moving a graph to another repository path changes its whole-program hash but not its definition hashes and requires an explicit new equip receipt.

Both hashes are deterministic equality keys. They are not collision-resistant identifiers, integrity proofs, signatures, or authenticity guarantees. The skeleton's comparison policy is the author's personal profile, not mandatory platform doctrine.

Run `npm run skeleton -- --compiled-diff` from the repository root for the
three-view equality receipt and the exact RPG item tooltip. Run
`npm run test --workspace @dotln/compiler` for the focused compiler suite.

## Blinded verification capsules

`compileVerificationTask(workOrderId, criteria, subject, finding?)` positively constructs a `verification-v1` capsule: criteria, pinned revision/diff, explicit host-read repository files and witnesses, and the compiled WorkOrder. The optional full blocking finding selects a focused repair role. Nested fields are copied by name, so extra implementer narratives, transcripts or result objects cannot enter the compiled context. `assertVerificationTask` compares the complete capsule with fresh compilation before dispatch and result admission.

The capsule pins compiler package version and an `inputHash` over canonical JSON of all its other fields. It is a deterministic equality key, with the same non-cryptographic limits as the existing FNV keys. It is separate from `CompiledProgram` and `ArtifactIdentityV1`; existing loadout semantic hashes do not change. `changedVerificationSurfaces` compares exact source bytes and `affectedVerificationCriteria` selects criteria whose declared dependencies intersect the change, conservatively selecting every criterion for an unknown surface. The skeleton owns physical reads, transport output validation, authority, events and repair application. See the [domain contract](../../docs/product/02-domain-model.md#independent-verification-v1) and [acceptance tests](test/verification.test.ts).

## Feedback units

`compileFeedbackUnits` lowers the declared `feedback-v1` unit shape into a
bounded handler inventory with an inspectable mechanism rung and a canonical
policy equality key. It validates source treatment, required fields, duplicate
handlers, conflicts, and supersession. `evaluateFeedback` checks host facts;
`applyFeedbackCorrection` computes a pure monotone correction transition;
`feedbackMaturity` keeps fixture and live observations separate.
`compileFeedbackAudit` produces the bounded repository audit WorkOrder.
The personal ten-unit catalog is host content, not an automatically equipped
platform rule set. See the [contract](../../docs/product/02-domain-model.md#feedback-compiler-v1)
and [tests](test/feedback.test.ts).

PolarAxis evaluation, multi-active lowering, saved builds, compatibility
migration, set bonuses, and interactive editing remain deferred. Their types do
not imply executable support.

## Harness target

`lowerToHarness` accepts a separate `harness-v1` program wrapper, compiled
feedback, the matching compiled authority envelope and an observed profile.
It returns origin-addressed files, their manifest and unavailable-capability
residue. It performs no I/O and changes no existing loadout semantic hash.
Profiles with hooks bind the built feedback boundary and host bytes; an
unobserved capability never becomes an emitted enforcement claim. See the
[harness contract](../../docs/product/02-domain-model.md#harness-compiler-v1)
and [target fixtures](test/harness.test.ts).
