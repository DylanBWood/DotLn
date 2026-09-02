# Roadmap — application release ladder

Application versions with exit criteria; pivots are gated on evidence at each
rung. Ideas recorded in the ledger never block a rung and never sneak into one —
the deferral list is part of each milestone's definition. Two pacing rules:
**point of view before efficiency** (explore until a perspective exists, then
optimize), and **every rung ships a visible payoff** — this is a solo project
run on momentum; six rungs of invisible infrastructure is a project-death risk,
so each version ends with something the operator can see, touch, or play with.
The environment for this ladder is the **personal machine** (macOS, personal
Claude Code plan, Codex CLI as second executor, personal GitHub);
managed-environment constraints (enterprise gateways, centrally managed
settings) are out of scope until such a deployment exists.

## Release boundary

The sole `vX.Y.Z` in a current work-order heading is its planned **application
release**, not its work-order number, package version, schema version, or
conceptual insertion point. An unpublished target may be retimed only by
explicit operator authorization and a dated migration note; when that changes
active scope or acceptance, the work order and its independent review subject
change with it. A published tag may not move. Begin source releases when a rung
produces a reproducible artifact that another build, saved configuration, or
compatibility rule can name. The first useful boundary was `v0.2.0`: after
WO-003 received passing final review, its PR was merged, and the exact merged
commit passed the full evidence gate, an annotated Git tag and immutable release
manifest were created. Never tag the feature branch or an unreviewed commit.

### 2026-08-31 forward retiming

WO-004 through WO-011 were drafted before `v0.2.0` was published. Three belated
foundation tasks were inserted at conceptual pre-release positions
`v0.0.2`–`v0.0.4`, and WO-007 was called `v0.2.1`; those planning labels then
looked like backwards application releases when the work orders were executed
numerically. Current and pending plans are retimed onto one monotonic
application sequence:

| Work order / milestone                         | Superseded planning label | Application release target |
| ---------------------------------------------- | ------------------------: | -------------------------: |
| WO-004 — environment and lifecycle corrections |                  `v0.0.2` |                   `v0.2.1` |
| WO-005 — capability evidence table             |                  `v0.0.3` |                   `v0.2.2` |
| WO-006 — documentation-publication bootstrap   |                  `v0.0.4` |                   `v0.2.3` |
| WO-007 — audit-record baseline                 |                  `v0.2.1` |                   `v0.3.0` |
| WO-008 — composition compiler                  |                  `v0.3.0` |                   `v0.4.0` |
| WO-009 — real disposable worker                |                  `v0.4.0` |                   `v0.5.0` |
| WO-010 — independent verification              |                  `v0.5.0` |                   `v0.6.0` |
| WO-011 — feedback compiler                     |                  `v0.6.0` |                   `v0.7.0` |
| projections and console                        |                  `v0.7.0` |                   `v0.8.0` |
| pattern workshop                               |                  `v0.8.0` |                   `v0.9.0` |
| source-to-deliverable vertical                 |                  `v0.9.0` |                  `v0.10.0` |

This is a forward-only planning correction. The `v0.2.0` tag, its manifest,
immutable verification/final-review reports, component versions, schema
versions, and earlier ledger entries remain historical truth. The `v0.2.x`
maintenance line is intentionally narrow: WO-004 corrects evidence and lifecycle
behavior, WO-005 inventories existing evidence, and WO-006 proves a
documentation-publication loop without extending the exported application
runtime. If execution expands one of those scopes into public runtime
capability, its release target must be reclassified before implementation.

The manifest records the Git commit, application release, package/component
versions, supported schema and artifact ranges, transformation-set version (or
explicitly `none`), evidence commands/results, evaluable and deferred cadence
kinds, toolchain, and known limitations. A release may initially be source-only.
Publishing npm packages, executables, containers, or hosted artifacts is a
separate projection selected only when a consumer needs it; a Git tag must not
imply those channels exist.

The hand-closed `v0.2.0` manifest and notes under `docs/releases/` remain their
immutable historical projection. For later releases, the annotated tag message
is the immutable location for both the canonical JSON manifest and layered
notes. The generator starts from `docs/releases/tag-manifest.template.json`; the
validator re-derives its fields from the tagged source, control state, installed
toolchain, and observed evidence before any tag ref is created. This order is
deliberate: **the tag names the reviewed merged commit, and its annotation
carries the record**. A tracked manifest committed after the tag would describe
a different commit; committing one before the tag would require guessing its own
commit identity.

Beginning with `v0.3.2`, every passing final review supplies a five-section
reviewed notes artifact, including for no-release work orders. Release close
assembles all notes merged since the preceding tag in first-parent order, labels
older work orders with a time-indexed commit-subject fallback, appends
manifest-derived evidence and compatibility, and keeps that edition in the
annotated tag. After the validated tag push, the same human layer is projected
as a GitHub Release; the projection never replaces the tag's immutable JSON
record and is recovered by rerunning close rather than silently edited.

Patch releases contain compatible corrections, documentation, and evidence
improvements; minor releases add backwards-compatible application capability;
breaking public contracts require the next major boundary even before 1.0 unless
an explicitly experimental surface says otherwise. Historical tags and manifests
are immutable. Never move a tag to make the past resemble the present; issue a
new patch release. Do not invent a retroactive `v0.1.0` tag unless its exact
reviewed commit and evidence can be reconstructed. Tag creation and remote
publication remain explicit operator actions.

Release closeout is the final workflow task after PR merge, not an activity
hidden inside final review. The guarded close command finishes the merged
worktree/branch, fast-forwards the clean main checkout to `origin/main`, and
requires the closed control state to name the same work order. At a new SemVer
boundary it runs `npm ci` before evidence, proves tracked files remain
unchanged, reruns the declared evidence, builds and validates the manifest and
notes, and creates/pushes only the annotated tag when its explicit publish form
was authorized. It never pushes `main`. The `resume: release close` phrase is
that explicit tag-publication authorization. Without it, the raw command still
performs guarded closeout and validation but withholds tag creation and
publication. If any guarded release-close check refuses before tag creation —
including declared evidence, manifest derivation or validation, or another
release gate — do not tag. The lifecycle should grow a first-class
**fix-in-place** recovery for such a failure: preserve the interrupted release
obligation and target, open and activate a bounded patch work order from current
`origin/main`, drive it through the ordinary implementation, independent
verification, final review, and merge gates, then resume the interrupted
closeout. “In place” means continuity of the parent closeout episode, not
editing `main`, reusing a removed worktree, bypassing review, or carrying
tag-publication authority into the patch. WO-012 and WO-015 are reference cases
for the current manual composition of those steps; neither adds the still-future
durable command/event surface or repeated-failure semantics.

An application target in a work-order heading that is strictly below the latest
release is a successful no-release closeout, leaving clean `main` in the closed,
between-work-orders state rather than publishing backwards. An equal version is
idempotent only when the existing validated annotated tag names that exact
commit; any conflict refuses. An operator who deliberately defers an otherwise
eligible release records the reason in a reviewed durable artifact; absence of a
tag alone must not leave the milestone's publication state ambiguous.

Each published release also carries layered patch notes. Lead with the release's
visible payoff and a short explanation of why it matters; isolate breaking,
migration, compatibility, security, data-loss, authority, and operator-action
items where they cannot be missed; then group substantive changes by product
area. Collapse low-signal repetition into honest aggregate lines such as
progressive copy, fixture, diagnostic, or visual polish instead of narrating
every touched file. The aggregate must not conceal a behavioral, schema,
compatibility, safety, or recovery change. Link detailed evidence and manifests
for readers who need the full trace.

## Work-order navigation and identity (candidate)

The current control projection answers one narrow question: given the single
active work-order slot and its phase, which lifecycle transitions are legal now?
It does not answer which backlog order should be activated after close. The
release ladder, hard dependency graph, adjacent evidence/corpus work, and
operator preference are distinct planning inputs and must not be collapsed into
the next integer.

Keep three answers visible:

1. **Workflow legal next:** the transition allowed for the active slot, such as
   verify, repair, or final review.
2. **Eligible now:** every candidate whose hard dependencies, activation
   prerequisites, authority, environment, and exclusive-resource constraints are
   satisfied.
3. **Recommended next:** the eligible choice selected by an explicit planning
   policy or by the operator, with the reason and alternatives retained.

Existing `WO-NNN` identifiers are stable, opaque references. They do not encode
priority, roadmap position, or family, and numeric gaps carry no meaning. The
completed/drafted WO-10x orders therefore remain addressable under their current
IDs; mainline work never has to “catch up,” and activated or historically cited
orders are not renumbered. Future grouping belongs in explicit metadata and
views, not reserved number ranges.

A provisional planning row should be able to show:

`id | title | purpose/track | planning state | lifecycle evidence | hard dependencies | activation prerequisites | eligibility reason | recommended rank/reason | execution role | model/effort/environment constraints | affected surfaces | release relation`.

Lifecycle evidence remains derived from the control log, numbered verification
and final-review artifacts, merge evidence, and release/no-release records—not a
manually asserted `complete: true`. “Implemented,” “verified,” “final-reviewed,”
“merged,” and “released/no-release” are different boundaries. Likewise, worker
role is distinct from model, effort, harness, and required capabilities;
dependency is distinct from a preflight such as version assignment,
authentication, provisioned dependencies, or a quiet-machine window.

The first increment is a dated, human-readable map in
`docs/planning/work-order-map.md`. It is an explicitly provisional projection,
not scheduler IR. Use should reveal whether a later bounded work order should
standardize metadata in work-order documents, create a separate registry, parse
the documents, or generate dependency and eligibility views. Do not pin that
schema or allocator before the pilot exposes its actual consumers and drift
risks.

## Capability progression policies

The application ladder is one release view. Inside and across its rungs, DotLn
can treat each feature, integration, projection, pattern, or operational
capability like a skill that advances through evidence-backed levels. This makes
several implementation strategies explicit rather than letting whichever feature
is most exciting consume the whole roadmap.

Candidate capability levels:

| Level            | Meaning                                                    | Minimum evidence                                                                 |
| ---------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 0 — latent       | named idea or need; no usable behavior                     | source and intended outcome                                                      |
| 1 — demonstrable | thinnest coherent behavior exists                          | bounded fixture or witnessed example                                             |
| 2 — dependable   | normal path and important failures behave predictably      | automated checks and repeatable evidence                                         |
| 3 — integrated   | participates in real workflows and lifecycle               | end-to-end use, recovery, authority, and audit evidence                          |
| 4 — production   | supportable under the implementation's declared risk       | security, privacy, operations, restore, performance, and acceptance gates        |
| 5 — polished     | professional, legible, efficient, accessible, and pleasant | user evidence, edge-case quality, documentation, and maintained regression suite |

The labels and gates matter more than whether numbering starts at zero or one.
Level is scoped: `audit.timeline@2` can coexist with `audit.rawExport@0`.
Production means production for a declared implementation profile, not one
universal enterprise bar.

“XP” is shorthand for admissible evidence—passing fixtures, witnessed use,
recovery exercises, resolved findings, measured usability—not commits, tokens,
hours, output volume, or model confidence. Work can accumulate evidence without
leveling up; promotion occurs only when every required gate for the next level
passes. A compact overall level is the minimum of its required dimensions, so
averaging cannot hide a security or recovery zero behind a polished interface.

### Activation, utilization, and XP

Capability learning needs at least three separate measures:

- **activation:** the planner/compiler selected the capability because its
  predicate and scope matched;
- **utilization:** the capability materially participated in a decision,
  behavior, artifact, control, or verified outcome after activation;
- **XP/evidence gain:** the episode produced admissible new evidence about the
  capability's competence, limits, reliability, usability, or next-level gate.

Also retain **eligibility/opportunity**—how often the capability could have
activated—so a low count is interpretable. These measures must not collapse into
one popularity score:

| Signal                              | Likely question                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| high opportunity, low activation    | Is selection, discoverability, tagging, or policy wrong?                         |
| high activation, low utilization    | Did we bring part of the whole stash into this map without changing the outcome? |
| high utilization, low evidence gain | Is it repeatedly working without learning, or are outcomes unmeasured?           |
| high utilization, poor outcomes     | Is the capability weak, mis-scoped, or blocking the system?                      |
| low use, catastrophic consequence   | Is this a rare invariant that must remain mature despite low frequency?          |
| rising XP, unchanged level          | Which unsatisfied promotion gate is holding it back?                             |

Utilization can be causal only where the fixture or counterfactual supports the
claim; otherwise label it `participated`, not `caused`. XP can be positive,
negative, or narrowing: a failed experiment that exposes a boundary improves
knowledge without pretending the feature became more capable.

An activation is still a durable learning event even when utilization is zero.
It records that the selector saw a relevant opportunity under a particular scope
and state. Useful activation-event properties include capability and version,
trigger/predicate, matched facts, scope, competing candidates, selection score
or reason, selected/suppressed outcome, expected cost, reserved context/tools,
expiry, and the later utilization/result link. Over time these events reveal
demand, false and missed activation, trigger drift, co-activation patterns,
unused loadout weight, seasonality, and candidates for prefetching, retirement,
composition, or deeper investment.

Therefore activation evidence can earn **selector/activation-policy XP** and can
improve knowledge about a capability's applicability. It does not by itself earn
capability-effectiveness XP. A zero-utilization activation remains evidence
rather than waste by definition; repeated zero-utilization under the same
conditions becomes evidence that the selection rule or packaging needs
attention. Suppressed and declined activations are retained when policy and
privacy permit, because future outcomes may show that the road not taken was the
important signal.

### Reps, curiosity, and voluntary craft

The progression system must not punish **getting the reps in**. Repeated use can
build operator fluency, implementation familiarity, sample diversity, muscle
memory, better examples, edge-case discovery, and confidence in a known path
even when it does not immediately clear a promotion gate or attack the current
system constraint.

Keep at least two evidence accounts:

- **practice XP:** attributable repetitions, varied contexts, completed
  exercises, and observations that improve familiarity or enlarge the sample;
- **promotion evidence:** proof that a named next-level capability gate now
  passes under its declared conditions.

Practice XP is real and visible but cannot counterfeit reliability, security, or
production readiness. Conversely, lack of immediate promotion does not turn a
useful rep into failure. Repetitions should retain context and novelty so ten
identical easy runs are distinguishable from ten increasingly varied ones,
without imposing a game mechanic that makes people optimize counts.

Theory of Constraints is advisory except where a bounded release contract
explicitly makes the constraint a gate. It explains where work may have the
greatest end-to-end leverage; it does not revoke the operator's freedom to
follow curiosity, joy, craftsmanship, availability, or momentum. The operator
may always choose a capability and make it better within the active authority
envelope, while the system shows opportunity cost and dependencies without
shaming or blocking the choice.

Theory of Constraints uses these signals to decide which capabilities receive
love. Identify the current system constraint from end-to-end flow and evidence;
exploit it with the smallest intervention; subordinate adjacent work; elevate
its capability level only when needed; then repeat because the constraint may
move. The scheduler considers blocked work, queue/wait time, failure and retry
concentration, handoff delay, evidence gaps, operator burden, and the
counterfactual value of an improvement—not utilization alone. The most-used
feature is not necessarily the constraint, and the least-used feature is not
necessarily neglected.

The capability table can therefore begin with:

`opportunities | activations | utilizations | outcome/evidence refs | XP delta | current level | blocking gate | constraint contribution | next experiment`.

All counts retain scope and observation window. Comparisons across unrelated
capabilities or implementations are invalid unless their opportunities,
consequences, and evidence standards are comparable.

The planner can select a progression policy per horizon or portfolio:

- **breadth first / one skill point better:** choose the smallest useful,
  verified increment for each eligible capability before returning for another
  lap; useful for revealing the whole shape and integration seams;
- **depth first:** hold focus on one capability until a named target level,
  including professional and polished qualities; useful for the load-bearing
  path or a flagship experience;
- **minimum threshold:** bring every required capability to a release floor,
  leaving optional capabilities untouched;
- **furthest back first / golf scoring:** select the lowest qualified capability
  or weakest required dimension, with risk and dependency tie-breakers;
- **constraint first:** improve the capability currently limiting end-to-end
  value, reliability, or learning, following the activation/utilization/XP
  diagnosis above and Theory of Constraints;
- **risk-weighted:** raise high-consequence authority, privacy, recovery, or
  evidence capabilities before cosmetic maturity;
- **mixed portfolio:** reserve explicit capacity for floor-raising, one deep
  flagship, integration debt, and exploratory level-zero probes.
- **free practice / follow interest:** improve whichever capability attracts
  voluntary attention, recording reps, learning, and evidence while keeping
  constraint recommendations visible but non-coercive.

Selection is still constrained by dependencies, authority, expected value,
verification capacity, and the release's visible-payoff rule. A breadth pass
must produce coherent vertical behavior rather than a field of disconnected
stubs. A depth pass stops at its declared target instead of polishing one corner
indefinitely. `Do Nothing` remains a valid result when no candidate has positive
expected value or sufficient evidence.

The first implementation can remain simple: a reviewed capability table with
current level, target level, required dimensions, evidence links, dependencies,
last change, and next smallest promotable increment. Only after real planning
uses expose a need should this become scheduler IR or an XP engine.

### Efficiency as a separate capability axis

Every skill, feature, domain, integration, workflow, projection, and role can
also carry an **efficiency profile**. Maturity asks whether it can satisfy its
contract; efficiency asks what resources a verified unit of useful outcome
requires under declared conditions. A mature capability can be inefficient, and
an efficient demo can still be immature.

Efficiency is not one number. Record a resource/outcome vector such as:

```ts
type EfficiencyObservation = {
  capabilityRef: string;
  scenarioRef: string;
  implementationRef: string;
  window: { from: string; to: string };
  opportunities: number;
  verifiedOutcomes: number;
  resources: {
    elapsedMs?: number;
    operatorAttentionMs?: number;
    modelTokens?: number;
    modelCalls?: number;
    toolCalls?: number;
    computeCost?: number;
    retryCount?: number;
    storageBytes?: number;
    energyEstimate?: number;
  };
  qualityRefs: string[];
  failureRefs: string[];
  authorityAndRiskRefs: string[];
  baselineRef?: string;
};
```

The denominator is a verified outcome or completed contract—not output volume,
activations, story points, or busyness. Comparisons require comparable scenario,
quality, authority, and risk conditions. Missing measurement remains unknown.

A useful provisional efficiency scale is:

| Level                | Meaning                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| E0 — unknown         | no trustworthy baseline                                                                             |
| E1 — measured        | representative baseline and resource vector exist                                                   |
| E2 — economical      | obvious waste removed without weakening the contract                                                |
| E3 — fit for profile | meets the implementation's declared budgets and service objectives                                  |
| E4 — frontier        | no observed alternative improves one important resource without worsening another protected outcome |
| E5 — adaptive        | detects drift, selects among proven strategies, and revalidates the frontier as conditions change   |

`E4` is a local Pareto frontier, not “perfect.” It is scoped to a scenario,
implementation, time window, and protected outcomes. A later technique can move
the frontier.

Constant efficiency awareness should produce **optimization candidates**, not
constant intervention. Candidates name observed waste, affected resource,
baseline, hypothesis, protected invariants, smallest reversible experiment,
expected gain, measurement plan, and rollback. `Beware of Naive Interventionism`
applies: do nothing when measurement cost or change risk exceeds expected gain,
and never optimize a non-constraint merely because its metric is easy to
improve.

Common efficiency avenues include avoiding unnecessary activation and context;
better caching and reuse; deterministic mechanisms replacing repeated model
work; batching or parallelism where ordering permits; cheaper perception before
expensive perception; right-sized model/runtime selection without silent
substitution; fewer handoffs and retries; smaller evidence with equal strength;
incremental computation; better stop conditions; archival/tiering; and reduced
operator cognitive load. Efficiency improvements retain before/after evidence
and note which resource moved elsewhere.

### Counterfactual profiling work orders

An optimization candidate can compile into a bounded profiling work order so
candidate generation, implementation, measurement, and judgment do not blur
together. The work order pins an immutable baseline; one hypothesis or a bounded
candidate family; representative scenarios and fixtures; protected correctness,
quality, authority, and risk invariants; exact build, test, and benchmark
commands; the environment and toolchain profile; warm-up, repetition, and
run-order rules; the resource vector; decision thresholds; evidence paths; and
cleanup and rollback. The representation is intentionally executable by a
low-cost model because the important judgment has already been compiled into the
contract. Model assignment remains per work order and is never hardcoded.

The deterministic harness measures; models propose candidates and interpret
results. Every candidate runs in an isolated worktree or equivalent sandbox,
must pass the semantic and quality gate before comparison, and is never promoted
or merged automatically. Baseline and candidate runs are repeated and
interleaved or randomized where order can bias the result. Conclusions report
the distribution and uncertainty rather than treating one timing as truth.

Results are append-only, machine-readable observations linked to the exact
commits, scenarios, environment, and evidence. Retain regressions, failed
candidates, no-change results, and improvements that merely move cost to a
different resource. A generator may fan one reviewed optimization program into
many small profiling work orders for inexpensive executors, followed by a
comparison projection that shows protected outcomes, the resource frontier, and
first divergence. Candidate families may vary code, prompts, loadouts, models,
runtimes, or harness choices only when their authority and quality conditions
remain comparable. This is the concrete code-efficiency projection of the
graded-counterfactual-build idea in the lineage ledger, not permission to
optimize output volume or weaken the contract.

The capability table can add `efficiencyLevel`, `baseline`, `resourceVector`,
`protectedOutcomes`, `frontierAlternatives`, and `nextExperiment`. Efficiency XP
comes from trustworthy measurements and successful or informative experiments;
it never raises maturity automatically.

<!-- prettier-ignore -->
## v0.0.0 — Clean-room bootstrap  *(mostly complete)*

Repo, intake pipeline, blueprint docs, idea ledger, decision records, first work
orders. Exit: initial commit on `main`; `docs/` is the complete shared memory a
cold model session needs. No application code. `.claude/` grows iteratively with
use (one config-log line per change); decision records only for safety-boundary
config (permissions, hooks).

<!-- prettier-ignore -->
## v0.0.1 — Environment truth (bounded)  → WO-001

A 30–60 minute bounded inspection, not the comprehensive audit (that variant
stays preserved in the ledger for wrapped/managed environments). Record with
epistemic labels: node/package-manager/TS toolchain; git + worktree behavior;
Claude Code surface actually present (print mode, structured output, agents,
workflows, background, worktrees, hooks, session persistence); Codex CLI
surface; Playwright availability; SQLite; localhost serving. Exit:
`docs/discovery/environment.md` + machine-readable summary; a named choice of
worker-transport adapters to build first, from evidence.

<!-- prettier-ignore -->
## v0.1.0 — Pure kernel  → WO-002

TypeScript, **zero runtime dependencies, no I/O**. Events + EventEnvelope
(including the Comparison event type), immutable state, reactors
`(state, event, env) → Decision`, continuations, cadence with virtual time,
explicit RNG state, decision traces, append-only JSONL store + replay. Scope is
what the walking skeleton consumes — _types_ for the full Program and Cadence
grammars, _evaluation semantics_ only for the subset WO-002 names; the rest
arrives on contact at later rungs (the domain model holds the target shape).
Exit criteria: rows 1, 3, 5 of the canonical failure-injection matrix
(03-architecture) pass at the kernel boundary. For row 5 the kernel declares
cancellation and NoOp; the walking skeleton proves those declarations in its
fake scheduler, while durable scheduler ownership for real workers arrives at
v0.5.0. Same event log ⇒ same controller transitions, provably. Visible proof:
the evidence suite inspects the structured replay decisions and `DecisionTrace`;
the first human-readable CLI projection arrives with `v0.2.0`. Deferred:
remaining grammar/matrix rows, every UI, every real adapter, the pattern
compiler.

<!-- prettier-ignore -->
## v0.2.0 — Walking skeleton (fake executor)  → WO-003

The Repo Gardener + Seiri vertical against a deterministic fake executor: create
inspection task → operator Present/Away → virtual 20-minute pulse → kernel emits
bounded WorkOrder → fake worker returns evidence-backed deletion _candidates_
(no deletion authority) → separate fake verifier accepts/rejects → Operator
Returned cancels pulses → replay reproduces the identical final state. CLI
projection + human-readable event timeline are the first views. Exit: the
13-step demo runs end-to-end twice — live and from replay — with identical
traces, **and the run renders as an emoji-glyph scene** (the operator's own
visual-prototype-zero: 🐛 gardener plus glyph states from the visual grammar,
printed to terminal or a static HTML page — zero assets, a pure projection of
the log). Deferred: real model calls, interactive web UI.

<!-- prettier-ignore -->
## v0.2.1 — Environment truth addendum and lifecycle corrections  → WO-004 + WO-012

Close the gaps WO-001 deliberately deferred: both candidate transport launch
shapes exercised for real from an unsandboxed authenticated session, MCP as a
capability row, full startup-context accounting, effective settings loading, the
user-level `model` key. Exit: the v0.5.0 transport recommendation re-stated over
`observed` rows (or honestly re-labeled with cause), and `environment.json` row
parity including the Codex feature-surface row. The operator-authorized
expansion also makes the worktree, review, repair, and release-close lifecycle
executable and restartable.

WO-004 merged after passing independent verification and final review, but
publication of its eligible release was deferred on 2026-09-01 when release
close misclassified a protected `docs/intake/` pathname containing U+202F as
contaminating ignored material. That failed close created no `v0.2.1` tag.
WO-012 repairs that release-gate defect; the tag is cut only when WO-012 closes
and carries both work orders.

<!-- prettier-ignore -->
## v0.2.2 — Capability table v1  → WO-005

The Capability-progression section's own "first implementation can remain
simple": a reviewed Markdown table — evidence-linked levels,
minimum-of-dimensions composites, `E0 — unknown` efficiency defaults, one
recorded progression policy. Exit: `docs/planning/capability-table.md` with
every non-latent row naming its blocking gate.

<!-- prettier-ignore -->
## v0.2.3 — Publication bootstrap  → WO-006

Steps 1–4 of the publication-compiler bootstrap (08): audience/status index over
the blueprint, base outline + implementation-overlay template, two sharply
different tables of contents from the same sources, one dual-voice sample, and a
demonstrated staleness loop. This anchors 08's "first-class output from the
beginning" on the ladder; further editions stay gated on this loop working.
Exit: `docs/publication/` exists and the staleness demonstration is captured.

During execution the operator expanded this patch rung with thirteen bounded
same-release additions, fully enumerated in WO-006: Malcolm Check synthesis and
the durable `ideation:` dispatch; Prettier; personal-harness guidance and
checkpoint diagnostics; observable restraint accounting; external rule-source
mapping; Embodied Explorer; work-order navigation; an unmined Team Topologies
research nomination; the operator-flow mission; binary quench; Flow Steward;
temporal interaction interpretation plus the bounded RxJS `expand()` hypothesis;
and the brain/hands, harness/orchestration, isolation, LangGraph-accommodation,
and foundation-first synthesis. These remain documentation, process, and
dev-tooling changes; they add no exported runtime capability and do not move the
release boundary.

WO-006 merged after independent verification and final review. Its authorized
release close on 2026-09-01 then passed dependency installation, the declared
test evidence, and the built skeleton CLI before manifest derivation refused:
the cadence compatibility parser could not read the canonical Prettier-formatted
type union. No local or origin `v0.2.3` tag was created. WO-015 is the bounded
fix-in-place continuation of that interrupted release obligation. The target
remains unpublished until WO-015 completes its own ordinary verification, final
review, and merge, followed by a separately authorized release close.

<!-- prettier-ignore -->
## v0.3.0 — Audit-record baseline (three projections)  → WO-007

Bootstrap steps 1–3 of the audit map (09), against the walking skeleton's real
demo log: consequential-action enumeration with the question each record
answers, a minimal pinned AuditRecord envelope referencing the event store
(never a second truth), and three pure-fold projections — L0 receipt, causal
timeline, governed raw JSON. This anchors 09's bootstrap on the ladder; steps
4–7 wait for v0.5.0's machinery. Exit: identical projection output over live and
replayed logs, with step 9's structural refusal visible in the receipt.

<!-- prettier-ignore -->
## v0.4.0 — Composition compiler v1  → WO-008

LoadoutGraph with support facets, link type-checking, deterministic precedence,
and a CLI compiled-diff preview. The Seiri link group compiles to heterogeneous
mechanisms with per-support declared cost. Exit: an incompatible link fails at
compile time with the SUPPORT INACTIVE diagnosis; equipping/unequipping changes
the running program and the semantic hash proves view equivalence across at
least {code DSL, function table, statechart JSON}. Visible payoff: the
compiled-diff preview renders as an **RPG item tooltip** (GRANTS / RESTRICTIONS
/ OBLIGATION / PASSIVE / PULSE / INTERRUPT), not only CLI text.

<!-- prettier-ignore -->
## v0.5.0 — Real disposable worker  → WO-009

WorkOrderTransport adapters chosen from discovery through WO-004's observed
evidence — expected: Claude CLI print-mode with the canonical launch shape
(fresh bounded invocation, project+local settings only, **ambient/auto memory
disabled** — no harness-owned memory loads into a fresh episode; external memory
is deliberate — isolated worktree, explicit model and effort, no session
persistence, JSON schema output) and a Codex equivalent using only controls the
installed host exposes. If Codex still offers no effort selector, record
`unknown`; never invent a flag. Worktree lifecycle is deterministic (create,
verify cwd, clean up). Exit: one real episode replaces the fake executor in the
v0.2.0 demo and returns a compact result envelope; the main session's transcript
grows by only the envelope; a killed worker leaves a recoverable pending command
(matrix rows 2, 4, 6 pass here); **`dotln status` exists** — a live in-flight
projection of the store (running episodes, leases/heartbeats, pending commands,
recent events) so real workers never run blind. **No silent model substitution**
— unavailable model ⇒ queue or fail closed.

<!-- prettier-ignore -->
## v0.6.0 — Independent verification  → WO-010

Blinded verifier episodes; claim-typed evidence mapping; typed
VerificationFinding → focused repair continuation in a fresh episode;
substantive repair marks affected evidence stale. Exit: a deliberately-planted
defect is caught by the verifier, repaired via continuation, re-verified — and
the implementer episode never certifies itself.

Follow-on work orders should project the proven resume protocol as native,
on-demand agent skills rather than ambient role prose: (1) a shared typed
intent/transition contract and conformance fixtures, (2) verifier and repair
skills, and (3) final-review plus worktree-lifecycle skills. Each projection
must remain behaviorally equivalent to the CLI, refuse illegal transitions,
write the same immutable artifacts, and demonstrate measured startup-context
reduction. Runtime observability work should expose context remaining and the
delegation graph in a persistent TUI status projection when the host provides
those signals, with explicit unknown states otherwise. Exact release placement
waits on evidence from WO-009 and WO-010 rather than expanding those orders by
implication.

<!-- prettier-ignore -->
## v0.7.0 — Feedback compiler v1 (ten units)  → WO-011

Ten representative FeedbackUnits authored from the corpus (this repo's ledger,
not any external rule stack): anti-oscillation; correctness-over-sycophancy; the
fail-conservative correction reactor (semantic events, not profanity triggers);
verify-app-before-done; no-attribution (settings + commit-msg hook as defense in
depth, with a precise predicate); concurrent-work-requires-worktrees;
no-lint/type-disables-as-fixes; read-your-own-output; no-partial-completion;
bounded boy-scout cleanup. Each: mechanism per the hierarchy + regression
fixture + maturity stats. Exit: measured startup-context reduction vs. prose
equivalents; each unit's fixture fails when the mechanism is removed; **and the
first self-hosted step** — one DotLn work order for this repo itself is
compiled, dispatched, executed, and verified by DotLn (ADR-0001's strangler
experiment gets its vehicle).

## v0.8.0 — Projections & console

Web console (UI framework and repository boundary decided _here_ by ADR with
representative evidence; Angular and its operator-fluent baseline are the
default conventional-shell candidate, Babylon.js is the spatial-view candidate,
and a plain workspace remains the default unless Nx proves enough measured value
and reliability to justify its weight — the kernel doesn't care). Synchronized
views: RPG loadout, statechart, function table, event timeline, and raw IR;
semantic-hash equality across editable views; glyph system with the visual
grammar; replay scrubber; the first full transmog skin beyond glyphs (Native
Emoji) — the friendly skin serves the teammate goal and does not wait for v1.0.
Terminal remains a complete control surface. Exit: the v0.2.0 demo watched
entirely from the console, then re-watched via replay; every animated element
opens its mechanics inspector.

## v0.9.0 — Pattern workshop v1

5S equipment set with compiled set bonuses; Marquet ladder as the operator-agent
protocol (autonomy rung computed, not set); mitigated-speech voice selector;
drag-and-drop equip with exact compiled diff preview. Exit: dragging Seiri onto
Repo Gardener in the console produces the same semantic hash as authoring the
equivalent link group in code.

## v0.10.0 — Source-to-deliverable vertical

Prove the ports with a personal-flavor vertical: GitHub Issue → SourceBundle →
StoryContract → RepoProfile + ImpactMap → **Live Witness baseline** (reproduce
before changing; preserve baseline evidence) → implementation episode → blinded
behavior verification **and** independent code review (two separate episodes) →
evidence-grounded PR on a personal repo (the deliverable-ready conjunction
checklist, 03 §DeliveryAdapter) → post-PR loop (CI classification, comment
triage, source revision guard). The enterprise-tracker adapter remains a future
optional plug-in — the promise generalizes to "any tracked-work artifact +
registered repo + named authority profile → independently verified deliverable."
Exit: one real issue travels the pipeline with operator interruptions only at
material decisions.

## v1.0.0 — Teammate-ready

A person who has never read these docs declares one bounded intent and receives
a verifiable result, without learning the taxonomy and without a giant
transcript. Exit: witnessed run by a non-author.

## Post-1.0 horizons

[`προτείνω`](11-proteino.md) is the operator-named flagship first-party
application horizon: a compact persistent community where long-form prose is a
targeted, inspectable intervention; residents may ignore, resist, misinterpret,
adopt, adapt, or relay it; and paired branches show what changed inside a
declared simulation. It joins the executable pattern workshop to the simulation
laboratory without promoting application content into the kernel. Calling it the
prospective flagship records ambition, not product evidence, release priority,
or permission to expand a current work order. A small basketball squad is a
candidate first proof, not a selected milestone.

The broader simulation catalog remains: paired counterfactuals, first-divergence
search, agent swaps, all-clone towns, reflection-question design, time-dilation,
recognition-beyond-identifiers, accuracy-vs-rationale decoupling, biographical
seeding, bounded-inconsistency generation, and length-scale attention
aggregation (the full catalog lives in the ledger's chat-005 entries; this list
is not exhaustive); an Embodied Explorer fixture that learns evidence-backed
composite skills from bounded sensorimotor primitives in a 3D simulator; the
full pattern shelf (Compendium skin); remaining transmog skins; physical-card
importer; hypothesis flywheel. All are gated on the same kernel, and no
application, simulation, or embodiment choice may distort Horizon 1.

Additional horizon: a lightweight offline-capable IR verifier; explicit
application/schema/artifact/component version lineage; inspectable JIT
compatibility and AOT migration of historical configurations; release-scoped,
non-monotonic active/support availability with declared inactive behavior; and a
general behavioral toolbox whose game-AI use tests whether actors, loadouts,
Programs, Cadences, preview, simulation, and replay genuinely generalize. See
10-ir-compatibility.md. Distribution as package, executable, cloneable repo, web
generator, or compact share code remains an evidence-driven choice.

Two unscheduled infrastructure probes share that same gate. An orchestration
conformance probe may lower one bounded Program through LangGraph and compare it
with the pure TypeScript reference at the decision/event boundary; this selects
no framework dependency. An isolated-execution probe may compare the current
worktree/harness baseline with hardened container and VM/microVM profiles where
local discovery proves them available; it selects no deployment default and does
not expand WO-009. Neither starts until the smallest intent-to-evidence loop is
responsive, legible, independently evidenced, and pleasant enough to repeat.
External feature breadth is then admitted through exact primitive composition,
an explicit adapter, or evidence for a genuinely missing primitive—not
competitive checklist accumulation.
