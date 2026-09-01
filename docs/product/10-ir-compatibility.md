# IR verification, lineage, and compatibility

DotLn configurations are durable behavioral artifacts, not disposable files
tied to the release that created them. A modern runtime should be able to
identify, explain, inspect, and—when semantics permit—run or migrate historical
artifacts without silently rewriting their source.

## Lightweight IR verifier

Provide one small verifier over the canonical JSON IR. Given an artifact, it
returns a structured result and a terse human projection answering:

- is the JSON structurally valid;
- which artifact kind and schema version it claims or most likely matches;
- which application/runtime releases can consume it natively;
- where validation failed, with JSON paths and actionable explanations;
- which migration or compatibility paths reach a requested target; and
- whether each path is exact, adapted, lossy, unavailable, or unverified.

The verification core must be deterministic, side-effect free, usable offline,
and independent of its delivery projection. CLI, library, executable, web paste
surface, and agent skill may all project the same result; this document does
not yet select which distributions ship first. Pasting unknown data never
implicitly migrates or executes it.

## Separate version axes

Do not collapse these identities into one version number:

- application/runtime version;
- IR schema version;
- artifact/configuration version;
- identity, active-mechanic, and support-facet versions;
- transformation-set/compiler version; and
- environment capability profile.

A `WO-NNN` identifier orders and names a unit of work; it is not another
version axis. The SemVer in a current work-order heading is its planned
application release target. While unpublished, it may be retimed only by
explicit operator authorization and a dated migration note, with any active
scope or acceptance impact carried into independent review. Once published,
the annotated application tag is immutable. Neither operation changes package,
schema, artifact, identity, or transformation versions by implication.

A release manifest records the schema ranges, component versions, and
transformation set supported by an application release. This permits the
verifier to answer “this artifact corresponds to the v0.4.3 era” without
pretending that every application release introduced exactly one schema.

Release manifests are created from the reviewed merged commit, not inferred
later from package numbers. They are immutable compatibility anchors even when
the release is source-only; distribution-channel metadata is additive and must
not be confused with the application, schema, or component version axes.
The historical `v0.2.0` files under `docs/releases/` retain their original
projection. Forward releases embed the generated JSON manifest in the
annotated tag message, so the exact commit and its compatibility record form
one immutable Git object graph without a self-referential manifest commit.
`docs/releases/tag-manifest.template.json` pins the field layout and the
release validator re-derives the source-owned fields before publication.

## Transformation graph

Schema and component changes form a directed graph of named, versioned
transformations. Each edge declares source and target, preconditions,
postconditions, semantic effect, reversibility, information loss, evidence,
and the verifier used after application. Paths are planned before execution
and remain inspectable. The historical source artifact is immutable.

Two execution modes share the same transformation definitions:

- **JIT compatibility:** retain the historical artifact, derive a compatibility
  plan for the current runtime, and optionally cache the compiled plan by
  source identity, target runtime, environment profile, and transformation-set
  identity.
- **AOT migration:** materialize a new artifact in the target representation,
  linked to its source and complete transformation path. Migration never
  overwrites the source.

The plan distinguishes faithful execution from approximation. Exact historical
semantics, modern adaptation, and lossy migration are different outcomes and
must never share an unqualified “compatible” label. Replay records the source
artifact and the actual transformation path that ran.

## Release-scoped mechanic availability

Availability is a relationship among a versioned active mechanic or support
facet, runtime release, schema range, environment capabilities, and evidence.
It is not monotonic: a mechanic may be usable, unavailable for several
releases, then usable again. A per-release boolean is an admissible projection,
not the canonical model; ranges and rules cover common cases and explicit
exceptions preserve on/off/on histories.

Candidate compatibility states are `active`, `inactive`, `incompatible`,
`deprecated`, `emulated`, `migratable`, `removed`, and `unknown`. The exact
enum remains provisional until implementation evidence requires it. Regardless
of representation, every non-active state must declare behavior when encountered:

- reject composition with an explanation;
- remain visible but inert;
- select a named compatible version;
- apply a named adapter or migration;
- use historical emulation;
- compile to a traced NoOp;
- require operator confirmation; or
- permit replay while prohibiting new composition.

Opening a historical loadout produces a compatibility plan. Requested mechanics
never disappear silently. The inspector shows which run natively, transform,
emulate, become inert, or block execution, with first semantic divergence and
support-link effects made visible.

## Portable and regenerable sharing

The durable requirement is a small, inspectable artifact that can be shared,
resolved offline when its content is present, and regenerated from authoritative
definitions. It may eventually appear as a manifest, copyable code, content
address, package, executable, repository workflow, or web generator. Transport
is deliberately unsettled. Any chosen projection must preserve artifact and
schema identity, provenance, compatibility requirements, and semantic hash;
a compact string must not become an opaque authority grant.

## Behavioral toolbox and game-AI horizon

The composition system may grow into a general workbench for inspectable
behavior: spawn blank actors, equip versioned algorithms, programming/design
patterns, data structures, active mechanics, and supports, then preview,
simulate, replay, compare, and find first divergence. Game AI is a valuable
future domain because sprites and agents can exercise the same Program,
Cadence, statechart, loadout, projection, and evidence concepts.

This is a horizon and generality test, not permission to put arbitrary pattern
names into the executable grammar. A toolbox item becomes executable only when
it has typed composition semantics, lifecycle and compatibility behavior,
observable state, and evidence. Whether game AI becomes a product vertical,
adapter, or analog-completeness suite remains open.

## Invariants

- Historical artifacts and component versions remain addressable and immutable.
- Validation, identification, planning, transformation, and execution are
  separate operations.
- No migration, substitution, deactivation, or semantic loss is silent.
- JIT and AOT results name their source, target, transformation path, and
  verifier evidence.
- Unknown compatibility fails visibly; it is not inferred from recency.
- Delivery format does not become canonical product semantics.
