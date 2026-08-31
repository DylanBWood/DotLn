# Publication compiler — one source, many authoritative editions

DotLn's repository should be able to become an authoritative resource about
its purpose, vision, mechanics, implementation, operation, and consequences.
That resource is not one universal manual. It is a family of versioned
editions compiled from the same reviewed sources for different audiences and
decisions.

The book is a first-class output from the beginning, alongside ordinary
reference documentation. A book supplies a coherent path through the ideas;
reference docs supply precise lookup; runbooks supply action; generated API
and schema references supply implementation truth. None becomes an
independently maintained second source of truth.

## Source model

The publication compiler consumes only reviewed, classifiable repository
sources:

- product blueprint and principles for intent and settled semantics;
- ADRs and idea lineage for decisions, alternatives, and historical context;
- domain schemas, code, and tests for implemented behavior;
- work orders and verification artifacts for delivery evidence;
- discovery records for environment-qualified capability claims;
- operator-authored examples, diagrams, glossaries, and teaching material.

Gitignored intake may inspire a reviewed source but is never published or
quoted directly. Runtime state, credentials, private configuration, event
history, and implementation secrets are excluded unless an explicit export
policy produces a redacted artifact.

Each publishable claim should eventually carry enough metadata to select and
verify it: stable ID, topic, audience relevance, detail level, lifecycle
status, applicable version, source links, evidence class, sensitivity, and
last verification. Until structured claim records exist, headings and links
provide the bootstrap form of that graph.

## Audience editions

Audience selection changes sequence, vocabulary, examples, depth, and the
decisions emphasized. It must not change facts, limitations, permissions, or
evidence.

| Edition | Primary question | Emphasis |
|---|---|---|
| everyday AI user | What can I safely accomplish, and how do I know it worked? | intent, recipes, previews, consent, evidence, recovery, plain-language mechanics |
| software engineer | How do I extend, test, integrate, and debug it? | IR, kernel, adapters, skills, schemas, events, fixtures, compatibility, local development |
| team manager | How does this improve work without hiding judgment or removing accountability? | workstreams, roles, handoffs, decision packets, verification, coaching, adoption |
| IT director | Can this be deployed, governed, integrated, and supported? | architecture, identity, permissions, data flow, deployment modes, audit, retention, operations |
| VP of development | How does it change engineering-system throughput and risk? | portfolio flow, organizational design, quality system, platform strategy, rollout, leading evidence |
| CFO / finance leader | What value, exposure, and control does it create? | cost model, scenario ranges, risk, authorization, reversibility, auditability, investment gates |
| security / compliance | What can act, on what, under whose authority, with what record? | threat model, trust classes, secrets, provenance, policy enforcement, incident response |
| executive or board reader | Why now, what is differentiated, and what must be true? | thesis, strategic options, evidence, failure modes, milestones, governance |

These are starting profiles, not fixed personas. A field, organization, team,
or individual implementation can add its own vocabulary, policy overlays,
case studies, and editions without forking the publication engine.

## Publication manifest

An edition should be reproducible from a small manifest rather than assembled
by a long prompt. A future manifest can specify:

```yaml
edition: it-director
productVersion: 0.4.x
audience:
  role: it-director
  priorKnowledge: enterprise-technology
purpose: deployment-evaluation
formats: [book, reference-site, briefing]
includeTopics: [architecture, security, integrations, operations, audit]
detail: decision-grade
examples: sanitized
claimsAsOf: 2026-08-31
```

Compilation resolves source revisions, constructs an audience-specific
outline, renders the requested formats, attaches claim-to-source lineage, and
runs checks. A content hash identifies the source set; an edition version
identifies editorial structure. Updating either produces a semantic diff.

### Outline first; publication IR only as needed

The first useful planning artifact is an **edition outline**, not a new grand
ontology. It names the audience and decision, establishes the reading path,
selects repository sources, declares required status/evidence callouts, and
specifies outputs and acceptance checks. That can begin as reviewed Markdown.

If repeatability or traceability outgrows Markdown, promote only the stable
fields into a small `PublicationPlan`:

```ts
type PublicationPlan = {
  editionId: string;
  audience: AudienceProfile;
  purpose: string;
  sourceRevision: string;
  implementation?: ImplementationRef;
  sections: Array<{
    id: string;
    objective: string;
    sourceRefs: SourceRef[];
    requiredClaims: ClaimRef[];
    detail: DetailLevel;
  }>;
  outputs: OutputProfile[];
  acceptance: PublicationCheck[];
};
```

This is a **projection plan over existing DotLn IR and reviewed repository
artifacts**, not a parallel representation of the product. Runtime semantics
continue to live in the normalized DotLn IR; implementation truth continues to
live in versioned definitions, code, tests, decisions, and evidence. The
publication layer adds selection, sequencing, audience, pedagogy, source
lineage, and rendering instructions—the information the runtime IR does not
and should not contain.

Do not introduce a finer-grained `Claim` IR until the first two editions prove
that heading- and artifact-level references cannot support reliable stale
detection or contradiction checks. An outline is allowed to be sufficient.

### Base publication and implementation overlays

The DotLn repository gets a base publication plan covering the common
substrate, founding point of view, reference implementation, and honest
implementation status. Each concrete DotLn implementation then supplies a
small overlay rather than rewriting that plan:

- implementation identity, audience extensions, and local vocabulary;
- installed components, runtime targets, integrations, and deployment shape;
- local workflows, roles, authority, security, audit, logging, and retention;
- implementation-specific examples, operating procedures, and evidence;
- exclusions, confidential sections, and export/redaction policy;
- source-version compatibility and local verification status.

Compiling `base plan + implementation overlay + audience profile` produces the
concrete edition. Shared explanations remain inherited and traceable; local
secret sauce stays local; divergence is explicit rather than copied into a
forked book.

### Planning, rendering, and checking roles

Publication follows the repository's existing separation of duties:

1. A **planning role** reads the authoritative sources and produces or updates
   the base outline, audience profiles, implementation-overlay template, and
   bounded publication work orders. The current occupant of each role lives in
   `PLAYBOOK.md`'s actor table, never here — models rotate; the roles survive
   them. The planning role also performs the end-of-work-order blueprint and
   lineage check.
2. An **execution role** receives one bounded plan and renders the concrete
   book, guide, implementation handbook, or other output. Any capable model
   can occupy this role when explicitly assigned; the model is a replaceable
   executor, not part of the publication format.
3. A **verification role** checks claim lineage, implementation-status labels,
   contradictions, omissions material to the audience, sensitive-content
   boundaries, links, and output quality. It should not merely proofread the
   prose it just produced.

The planner does not write every edition in one giant context, and executors
do not invent the outline while rendering. Work orders can be divided by
edition, part, or chapter, with a final assembly check over navigation,
terminology, cross-references, and shared claims.

## Authority and honesty rules

1. **Authoritative means traceable, not confident-sounding.** Every material
   claim links back to reviewed source and, where applicable, executable
   evidence.
2. **Implementation status cannot blur.** `vision`, `specified`, `planned`,
   `implemented`, `verified`, `blocked`, and `deprecated` remain visibly
   different in every edition.
3. **Audience adaptation cannot become spin.** A CFO edition may explain risk
   economically and a programmer edition mechanically, but neither may omit a
   material limitation relevant to its decision.
4. **Numbers need provenance.** Costs, savings, performance, adoption, and
   risk estimates state their method, range, date, and uncertainty; absent
   evidence stays unknown.
5. **Generated prose is reviewed output.** A model may propose structure and
   wording, but publication gates validate citations, terminology, sensitive
   content, contradictions, links, examples, and version applicability.
6. **Lossy editions identify themselves.** An executive brief or narrative
   book links to the mechanics and evidence it compresses.

## Product surface

The same compiler should support:

- a canonical multi-edition DotLn book;
- a conventional documentation site with tutorials, how-to guides, reference,
  and explanation;
- implementation-specific handbooks and onboarding paths;
- printable briefings, decision memos, training modules, and course material;
- role-aware in-product help generated from the exact installed build;
- agent-facing skills and runbooks derived from the same contracts.

Readers can switch audience lenses without losing their current topic. A
claim inspector shows the canonical source, implementation status, evidence,
other editions that use it, and what the current edition omitted. This is the
publication equivalent of DotLn's mechanics inspector.

## Bootstrap path

Do not begin with an elaborate content-management system. The first proof is:

1. tag the existing blueprint sections with a minimal audience/status index;
2. have the planning role produce the base DotLn outline, an implementation-
   overlay template, and two sharply different tables of contents from the
   same sources—an everyday AI-user book and a software-engineer book;
3. render one shared concept in both voices with identical claim links;
4. deliberately change a source claim and prove both editions become stale;
5. add manager, IT-director, VP-development, and CFO editions only after that
   traceability loop works.

The key test is not whether a model can rewrite a chapter. It is whether many
useful versions can evolve rapidly without contradiction, secret leakage, or
quiet divergence from the system they describe.
