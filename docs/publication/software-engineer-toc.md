# Software-engineer edition — table of contents

Source base revision: `f2a4b232e1868691398964433c7e373fca4b84bb`

Source lock:
`sha256:d136c003cc6924df9b3a71c6bbd1fc80eb5d08bc8d1b33b3b77398c9accf3ec7`

The base revision identifies where this edition's source set was selected; every
link must resolve there. The lock pins the exact current bytes of the linked
heading subtrees and is the freshness authority.

**Reader decision:** Can I extend, test, integrate, and debug DotLn without
violating its semantics or authority boundary? This is a contract-first,
implementation-deep, lossy projection of the same
[base outline](base-outline.md).

## Module 1 — Establish the invariants

1. **Deterministic core, nondeterministic edge**
   - analog completeness, external memory, evidence gates, scoped authority
   - source: [Principles](../product/01-principles.md#principles-design-axioms)
2. **Canonical vocabulary and lifecycle state**
   - events, decisions, intents, programs, actors, episodes, continuations
   - sources:
     [Events and decisions](../product/02-domain-model.md#events-and-decisions-the-kernel-loop),
     [Actors and episodes](../product/02-domain-model.md#actors-and-episodes-the-edge)

## Module 2 — Normalize before executing

3. **Program algebra and pure reactor boundary**
   - decision variants, normalized programs, deterministic folds, effect return
   - sources:
     [Events and decisions](../product/02-domain-model.md#events-and-decisions-the-kernel-loop),
     [Formal grounding](../product/02-domain-model.md#formal-grounding)
4. **IR verification and independent version axes**
   - artifact detection, schema, mechanic, engine, content, and release versions
   - sources:
     [Lightweight IR verifier](../product/10-ir-compatibility.md#lightweight-ir-verifier),
     [Separate version axes](../product/10-ir-compatibility.md#separate-version-axes)
5. **Transformation lineage and compatibility planning**
   - source preservation, native/adapted/lossy paths, availability matrices
   - sources:
     [Transformation graph](../product/10-ir-compatibility.md#transformation-graph),
     [Release-scoped mechanic availability](../product/10-ir-compatibility.md#release-scoped-mechanic-availability)

## Module 3 — Place code on the correct side of the boundary

6. **Layers, packages, and instance-owned doctrine**
   - compiler/kernel/adapter/projection boundaries and extension ownership
   - sources: [Layer diagram](../product/03-architecture.md#layer-diagram),
     [Platform and instance boundary](../product/03-architecture.md#platform-and-instance-boundary),
     [Package ecosystem and marketplaces](../product/03-architecture.md#package-ecosystem-and-marketplaces)
7. **Composition without accidental execution order**
   - links, supports, transforms, conflicts, rejection, and explicit pipelines
   - sources:
     [Identity and composition](../product/02-domain-model.md#identity-and-composition),
     [Composition system](../product/03-architecture.md#composition-system)
8. **Ports, runtime catalogs, and execution boundaries**
   - executor, store, clock, authority, tracker, repository, target lowering,
     and attested isolation profiles
   - sources:
     [Runtime primitive catalogs](../product/03-architecture.md#runtime-primitive-catalogs),
     [Architecture](../product/03-architecture.md#architecture),
     [Ports](../product/03-architecture.md#ports-what-keeps-work-flavored-verticals-pluggable)

## Module 4 — Make lifecycle failure explicit

9. **Disposable sessions, continuations, and cadence races**
   - claim/heartbeat/complete transitions, restart shape, idempotency, NoOp
     trace
   - sources:
     [Session lifecycle and resilience](../product/03-architecture.md#session-lifecycle--resilience),
     [Operator-presence policy](../product/03-architecture.md#operator-presence-policy)
10. **Records, fidelity, persistence, and disaster recovery**
    - canonical audit envelope, projections, retention, backup, and restore
      class
    - sources:
      [Canonical audit record](../product/09-audit-resilience-privacy.md#canonical-audit-record),
      [Fidelity levels](../product/09-audit-resilience-privacy.md#fidelity-levels),
      [Backup and disaster recovery choices](../product/09-audit-resilience-privacy.md#backup-and-disaster-recovery-choices)

## Module 5 — Project one state without forking semantics

11. **Round-trip views, semantic hashes, and lossy inspectors**
    - editable equivalence versus narrative projection
    - sources:
      [Plural UI hosts, one projection contract](../product/04-interfaces.md#plural-ui-hosts-one-projection-contract),
      [Agent projection](../product/04-interfaces.md#agent-projection-the-sparse-twin)
12. **Replay, glyphs, and physical channels**
    - deterministic replay surfaces, visual encoding, and analog-complete views
    - sources:
      [Glyph system](../product/04-interfaces.md#glyph-system-visual-prototype-zero),
      [Replay](../product/04-interfaces.md#replay),
      [Physical channel](../product/04-interfaces.md#physical-channel)

## Module 6 — Compile doctrine and feedback

13. **Pattern definitions, candidates, and maturity**
    - synchronized lenses, support semantics, comparison data, and explicit
      candidates
    - sources:
      [Founding pattern library](../product/05-pattern-library.md#founding-pattern-library),
      [The Eye Dr Test](../product/05-pattern-library.md#the-eye-dr-test--pairwise-preference),
      [Candidate — Do Nothing](../product/05-pattern-library.md#candidate--do-nothing-active-and-support)
14. **Feedback compilation and corpus policy**
    - incident preservation, promotion gates, fixtures, and learning projections
    - sources: [Feedback](../product/02-domain-model.md#feedback),
      [Corpus policy](../product/03-architecture.md#corpus-policy),
      [Learning loop](../product/03-architecture.md#learning-loop)

## Module 7 — Verify the implementation and its explanations

15. **Evidence gates and workflow control**
    - dispatch, immutable verification, checkpoints, review, and release
      boundaries
    - sources:
      [Operator resume phrases](../product/07-execution-guide.md#operator-resume-phrases--how-you-get-dispatched),
      [Discipline](../product/07-execution-guide.md#discipline)
16. **Traceable publication projections**
    - source selection, audience invariants, status vocabulary, and stale
      detection
    - sources:
      [Source model](../product/08-publication-compiler.md#source-model),
      [Authority and honesty rules](../product/08-publication-compiler.md#authority-and-honesty-rules),
      [Bootstrap path](../product/08-publication-compiler.md#bootstrap-path)
17. **Implemented baseline versus target architecture**
    - current evidence, next gates, deferred surfaces, and compatibility
      promises
    - sources:
      [v0.2.2 — Capability table v1](../product/06-roadmap.md#v022--capability-table-v1---wo-005),
      [Architecture](../product/03-architecture.md#architecture),
      [IR invariants](../product/10-ir-compatibility.md#invariants)

## Engineering appendices

- normalized term and decision tables from the
  [Domain model](../product/02-domain-model.md#domain-model)
- adapter and projection contract checklist from
  [Interfaces](../product/04-interfaces.md#interfaces--the-isomorphic-views)
- mechanic compatibility matrix from
  [IR verification, lineage, and compatibility](../product/10-ir-compatibility.md#ir-verification-lineage-and-compatibility)
- source/status coverage from the
  [audience/status index](audience-status-index.md)
