# Base DotLn publication outline

Source base revision: `f2a4b232e1868691398964433c7e373fca4b84bb`

The base revision identifies the committed snapshot from which this shared
source set was selected. It is provenance, not a claim that later source bytes
still equal that commit. Each edition's SHA-256 source lock pins the exact
current linked heading subtrees used by that edition.

This reviewed Markdown outline is the common publication substrate. It is not a
rendered edition and does not create a second source of truth. Audience editions
may change sequence, vocabulary, examples, and depth, but every material
statement remains linked to the shared source set below.

## Publication purpose

Explain DotLn's point of view, mechanics, reference implementation, operating
boundaries, and evidence without blurring what is envisioned, specified,
planned, implemented, or verified. Each edition must help its reader make a
named decision and must provide a direct route back to mechanics.

## Shared source set

The bootstrap editions may cite only these blueprint documents, each present at
the source base revision above:

- [Vision](../product/00-vision.md#dotln--vision)
- [Principles](../product/01-principles.md#principles-design-axioms)
- [Domain model](../product/02-domain-model.md#domain-model)
- [Architecture](../product/03-architecture.md#architecture)
- [Interfaces](../product/04-interfaces.md#interfaces--the-isomorphic-views)
- [Pattern library](../product/05-pattern-library.md#founding-pattern-library)
- [Roadmap](../product/06-roadmap.md#roadmap--application-release-ladder)
- [Execution guide](../product/07-execution-guide.md#execution-guide--for-any-model-session-working-in-this-repo)
- [Publication compiler](../product/08-publication-compiler.md#publication-compiler--one-source-many-authoritative-editions)
- [Audit, records, resilience, and privacy](../product/09-audit-resilience-privacy.md#audit-records-resilience-and-privacy)
- [IR verification, lineage, and compatibility](../product/10-ir-compatibility.md#ir-verification-lineage-and-compatibility)

Work orders, code, tests, decisions, discovery, and verification artifacts can
later supply narrower evidence links. They do not replace the blueprint claim
links in this bootstrap.

## Common content spine

1. **Founding point of view.** Establish the mission, the problem, the common
   substrate, the core bet, and explicit exclusions. Start from the
   [Vision](../product/00-vision.md#dotln--vision), including its operator-flow
   mission, then
   [Common substrate, local doctrine](../product/00-vision.md#common-substrate-local-doctrine),
   [The core bet](../product/00-vision.md#the-core-bet), and
   [What DotLn is not](../product/00-vision.md#what-dotln-is-not).
2. **Invariants and vocabulary.** Introduce the design axioms before relying on
   them, then name the event/decision loop, actors, identity, feedback, and
   memory from
   [Principles](../product/01-principles.md#principles-design-axioms) and the
   [Domain model](../product/02-domain-model.md#domain-model).
3. **Interaction and authority.** Explain previews, consent, equivalent
   projections, sparse agent context, and inspectable mechanics from
   [Terminal first, console equal](../product/04-interfaces.md#terminal-first-console-equal)
   and
   [Agent projection](../product/04-interfaces.md#agent-projection-the-sparse-twin).
4. **System shape and extension boundary.** Show the deterministic core,
   nondeterministic edge, package/instance boundary, composition, lifecycle,
   ports, and learning loop from the
   [Layer diagram](../product/03-architecture.md#layer-diagram) and
   [Platform and instance boundary](../product/03-architecture.md#platform-and-instance-boundary).
5. **Reusable doctrine.** Present patterns as versioned mechanics with
   synchronized human, formal, and code lenses. Separate the founding catalog
   from explicitly labeled candidates in the
   [Founding pattern library](../product/05-pattern-library.md#founding-pattern-library).
6. **Evidence, records, and recovery.** Explain why completion claims require
   evidence and how audit, fidelity, persistence, recovery, privacy, and
   projections remain distinct. Use
   [Authority and honesty rules](../product/08-publication-compiler.md#authority-and-honesty-rules)
   and
   [Audit, records, resilience, and privacy](../product/09-audit-resilience-privacy.md#audit-records-resilience-and-privacy).
7. **Reference implementation and honest status.** Identify the implemented
   baseline separately from target architecture and later milestones. At this
   source base revision the roadmap has reached the reviewed `v0.2.2` source
   boundary; later rungs remain planned until their own evidence gates pass.
   Cite
   [v0.2.2 — Capability table v1](../product/06-roadmap.md#v022--capability-table-v1---wo-005)
   and the status notes at
   [Architecture](../product/03-architecture.md#architecture) and
   [Interfaces](../product/04-interfaces.md#interfaces--the-isomorphic-views).
8. **Durability and compatibility.** Explain verification, version axes,
   transformation lineage, mechanic availability, and portable sharing from
   [IR verification, lineage, and compatibility](../product/10-ir-compatibility.md#ir-verification-lineage-and-compatibility).
9. **How the publication stays honest.** Label the edition as a lossy
   projection, preserve source links, expose its source base revision and
   current source lock, and run the heading-linked staleness check described by
   the
   [Publication compiler](../product/08-publication-compiler.md#publication-compiler--one-source-many-authoritative-editions).

## Required callouts in every edition

- Use only `vision`, `specified`, `planned`, `implemented`, `verified`,
  `blocked`, or `deprecated` for lifecycle status.
- State which claims describe a target and which describe the reference
  implementation at the source base revision.
- Keep limitations, permissions, and evidence strength unchanged across
  audiences.
- Label compressed narrative as lossy and link to the mechanics it compresses.
- Exclude gitignored intake, runtime state, credentials, private configuration,
  event history, and implementation secrets.

## Outline acceptance checks

An edition is ready to render only when its audience and decision are named, all
material claims link to the shared source set, status callouts use the fixed
vocabulary, implementation-specific material comes from a reviewed overlay,
links resolve at the source base revision, and the staleness checker says the
edition's current-source lock matches.
