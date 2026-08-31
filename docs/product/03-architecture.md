# Architecture

## Layer diagram

```
┌────────────────────────────────────────────────────────────────┐
│ Source corpus                                                  │
│ incidents · prompts · notes · books · exemplars · transcripts  │
│ (policy-controlled; verbatim preserved locally; see §Corpus)   │
└──────────────────────────────┬─────────────────────────────────┘
                               │ classify / normalize / preserve provenance
┌──────────────────────────────▼─────────────────────────────────┐
│ Pattern & feedback compiler ("Forge")                          │
│ FeedbackUnits · PatternDefinitions · support facets · loadouts │
└──────────────────────────────┬─────────────────────────────────┘
                               │ normalized IR (LoadoutGraph + Programs)
┌──────────────────────────────▼─────────────────────────────────┐
│ Pure control kernel                                            │
│ reactors · statecharts · function tables · cadence · policy    │
│ (state, event, env) → state' + intents + continuation + trace  │
└──────────────────────────────┬─────────────────────────────────┘
                               │ authorized commands (outbox, commandId)
┌──────────────────────────────▼─────────────────────────────────┐
│ Effect adapters                                                │
│ model executors (claude / codex / fake) · human · shell · git  │
│ browser/Playwright · test runners · source adapters (tickets)  │
└──────────────────────────────┬─────────────────────────────────┘
                               │ typed result events (EventEnvelope)
┌──────────────────────────────▼─────────────────────────────────┐
│ Event store & evidence graph ("Chronicle")                     │
│ episodes · artifacts · provenance · evaluations · lineage      │
└──────────────────────────────┬─────────────────────────────────┘
                               │ projections (pure)
┌──────────────────────────────▼─────────────────────────────────┐
│ Isomorphic & projective interfaces                             │
│ RPG/links · pattern cards · statecharts · tables · timelines   │
│ terminal CLI · web console — both invoke the same commands     │
└────────────────────────────────────────────────────────────────┘
```

Naming: plain names (kernel, compiler, event store) are canonical in code and
docs. The flavor names — Forge (compiler), Compendium (pattern library), Chronicle
(events/lineage), Atlas (repos/workstreams), Simulacrum (simulation lab) — are
an available *skin*, consistent with the transmog philosophy (swappable presentation over identical mechanics; defined in 04-interfaces). Never let a
flavor name be the only name.

## Platform and instance boundary

DotLn core provides the common legos:

- event, decision, Program, Cadence, continuation, and projection contracts;
- deterministic composition, conflict precedence, replay, provenance, and
  mechanics inspection;
- authority, evidence, audit, and adapter interfaces;
- versioning and portability rules for definitions and accumulated history.

A DotLn implementation supplies the local secret sauce:

- workstream and artifact schemas;
- source and effect integrations;
- security policy, authority envelopes, audit/retention policy, and logging
  configuration;
- identity, role, personality, pattern, active, support, loadout, and team
  definitions—including which versions are currently in use and in what
  combinations;
- evaluators, exemplars, feedback units, domain vocabulary, and presentation.

Audit and resilience remain configurable local doctrine but compile through a
shared record vocabulary. The detailed audience, record-property, fidelity,
visualization, persistence, recovery, backup/DR, and privacy design space is
mapped in [`09-audit-resilience-privacy.md`](09-audit-resilience-privacy.md).

The boundary is architectural: instance definitions compile through public
IR and ports and remain visible to the build inspector. They must not require
private branches or special cases in the kernel. Conversely, the core does not
silently ship the author's preferred organization as universal defaults.
Starter packs may bundle the founding patterns, but installation, activation,
and inheritance are explicit and removable.

Portability target: an implementation can export its definitions and policy
history separately from secrets and raw protected sources, then load them on a
compatible DotLn runtime with the same semantic hashes. Whether workstream
events themselves move is a separate retention and sovereignty decision.

### Package ecosystem and marketplaces

Portable instance content implies packages and catalogs. A public marketplace
is one catalog adapter; filesystem packages, Git repositories, private
registries, and organization-curated catalogs are peers. Marketplace presence
never becomes an ontological dependency or a mark of trust.

Package families may include:

- definition packs: identities, roles, personalities, patterns, actives,
  supports, PolarAxes, loadouts, teams, and domain vocabulary;
- workflow packs: workstream templates, Programs, Cadences, schemas, evidence
  requirements, and completion contracts;
- evaluation packs: evaluators, exemplars, comparison sets, regression
  fixtures, and feedback units;
- integration packs: source adapters, effect adapters, transports, and
  projections;
- agent enablement packs: runtime-specific skills, command wrappers, schemas,
  and orientation resources that teach agents how to participate in DotLn and
  in a particular implementation;
- presentation packs: views, skins, glyph vocabularies, and reports that do
  not alter semantics;
- starter implementations: reviewed combinations of the above, with no
  privileged status over hand-authored local definitions.

Trust classes remain separate. Data-only definitions that compile through the
IR are not equivalent to executable adapters with network, filesystem, model,
or credential access. Every package declares its content kind, semantic
version, DotLn compatibility, dependencies, requested capabilities, authority
effects, prompt/context cost, runtime cost, provenance, and verification
evidence. Executable code receives a visibly higher installation and review
burden.

Distribution never implies activation. The flow is **discover → inspect →
resolve dependencies → preview compiled effects and requested permissions →
install pinned version → explicitly equip/activate in scope**. Updates create
new versions and a semantic diff; replay retains the exact historical version.
Revocation prevents future activation without rewriting past events.

#### Community builds and sandbox promotion

A **CommunityBuild** is a portable, content-addressed manifest over pinned
package versions and their composition—not a copy of another implementation's
event history, credentials, or protected sources. It may describe one active
with supports, an individual loadout, a team topology, a workstream template,
or a complete starter implementation.

The basic interaction must be easy:

```text
share file/link/code
→ resolve immutable manifest
→ preview mechanics + dependencies + permissions + costs
→ remix/fork components
→ sandbox against fixtures, synthetic events, or approved redacted replay
→ compare outcomes and first divergence
→ explicitly promote selected definitions into a scoped local version
```

Preview is useful without installation. It renders the build graph, semantic
hash, provenance, compatibility, inactive/missing capabilities, transitive
dependencies, conflicts, composition-order exceptions, authority effects,
context/runtime cost, verification evidence, and the exact compiled diff
against a selected local build.

Mix-and-match is structural: drag, link, substitute, disable, or fork
components, then re-run tag compatibility, commutativity, precedence, budget,
and authority checks. The editor explains why a combination is inactive,
rejected, or behavior-changing. It never merges opaque prompt blobs and hopes
the model reconciles them.

Community content enters a sandbox with no credentials, network, destructive
tools, live adapters, or write access by default. The sandbox uses fake
adapters and explicit fixtures; access to a redacted local replay is a separate
operator grant. Executable integration packs remain isolated from definition-
only content and require their higher trust review even inside a composed
build.

Promotion is selective and reversible. The operator can adopt the whole
manifest, cherry-pick components, retain a local fork, or extract only an idea.
Promotion records upstream provenance, the reviewed semantic diff, sandbox
evidence, local modifications, activated scope, and rollback version. Later
upstream updates appear as proposals, never automatic doctrine changes.

#### Agent enablement skills

An implementation may publish a reviewed set of skills for the agent runtimes
its members use. A skill is an adapter to DotLn's stable protocol and the
implementation's public definitions—not a second hidden behavior system.

The primary adoption case is **bring your own agent**. A person may arrive with
their own model, harness, tools, and execution environment, then download the
skill pack that lets that agent participate in a chosen DotLn implementation.
The participant does not need to adopt the implementation's model vendor or
replace its harness; it needs a compatible projection of the protocol,
definitions, schemas, and permitted interaction surface.

```text
agent runtime profile + implementation manifest + episode role
→ capability negotiation
→ minimal native skill bundle
→ conformance check
→ scoped participation
```

The runtime profile declares what the harness can load and enforce: skill
format, context limits, tool surface, structured-output support, lifecycle
controls, and available transports. Missing capabilities remain explicit; a
skill must never claim that prompt instructions substitute for an unavailable
permission, schema validator, background lifecycle, or transport.

Base skills may cover:

- orient to one current WorkOrder and its permitted operations;
- claim, heartbeat, pause, resume, or complete an episode;
- inspect the active loadout, compiled mechanics, authority, and evidence gate;
- emit schema-valid events, artifacts, result envelopes, and evidence refs;
- inspect a timeline, continuation, failure, or first divergence without
  ingesting the entire workstream;
- author and validate identities, roles, actives, supports, PolarAxes,
  patterns, workstream templates, and loadouts;
- preview a package's semantic diff, permissions, costs, and compatibility;
- run an implementation's prescribed verification and return its typed result;
- contribute, fork, install, equip, update, or revoke packages through the
  implementation's chosen catalog policy.

Coordination skills may cover:

- typed speech acts and result-envelope etiquette;
- claiming, handing off, delegating, joining, leaving, and replacing episodes;
- blackboard participation and event-subscription conventions;
- evidence exchange, dissent, conflict declaration, and escalation;
- topology-specific duties for planner, maker, verifier, watcher, mediator,
  or other locally defined roles;
- bounded peer communication where the Program permits direct exchange;
- synchronization points, cancellation, heartbeat, and continuation handoff.

For a managed episode, DotLn may **preload** the negotiated participation and
coordination skills into the spawned agent. The preload is compiled from the
current WorkOrder, role, loadout, topology, implementation policy, runtime
profile, and authority envelope. It is minimal and episode-scoped: an isolated
worker does not receive team negotiation skills; a read-only watcher does not
receive mutation procedures; a verifier does not inherit the maker's
narrative.

This is the skills-layer version of "a build, not a biography." Loading every
available coordination skill into every agent would reproduce the aura-stacker
failure in a new format. Skills activate by tags, state, relationship, and
capability; their context cost is visible; expiry and removal follow the
episode lifecycle.

#### Runtime primitive catalogs

An agent runtime is not merely a text-completion endpoint. Claude, Codex, and
future harnesses expose different native composition mechanisms. DotLn records
each as a versioned `RuntimePrimitiveCatalog` discovered from the actual
environment, then treats it as a compiler target.

A Claude-oriented catalog may expose native forms for agent definitions,
subagents, skills, hooks, permissions, tool/MCP connections, commands,
workflows, worktrees, background execution, session lifecycle, structured
outputs, and context-loading rules. DotLn can use combinations of these
primitives to realize an implementation rather than flattening everything into
one prompt.

Illustrative lowering—not a pinned one-to-one mapping:

| DotLn semantic mechanism | Possible Claude-native realization |
|---|---|
| Role or topology position | scoped agent/subagent definition |
| Active or support residue | selected skill plus structured input/output |
| Hard safety invariant | permission boundary or reviewed hook |
| Source/effect integration | constrained tool or MCP connection |
| WorkOrder | task-scoped context and output schema |
| Disposable episode | fresh/resumed/forked session with explicit lifecycle |
| Independent verification | isolated verifier agent with separate context |
| Cadence/lifecycle transition | workflow or host-owned background dispatch |
| Evidence/result contract | structured output validated before append |

The compiler may combine primitives: one organizational support could produce
a skill for judgment, a hook for enforcement, an output schema for evidence,
and a verifier episode for the acceptance gate. The build inspector shows all
lowered artifacts together and names which semantics remain at the DotLn host.

Other runtimes receive their own catalogs and lowerings. Semantic equivalence
is judged at the normalized DotLn contract and observable decision/event level,
not by requiring identical native features. When a runtime cannot realize a
mechanism, compilation reports the missing capability, selects an explicitly
approved adapter or weaker labeled projection, or rejects the build. It never
silently moves a hard rule into prompt prose.

This creates a marketplace layer for **runtime recipes**: reusable, tested ways
to implement a DotLn mechanic with a particular runtime's native primitives.
Recipes declare runtime/version compatibility, semantic coverage, costs,
required capabilities, conformance fixtures, and known loss. They can improve
as the runtime evolves without changing the implementation's canonical roles,
workflows, or doctrine.

The first provisional target catalog is the
[`Codex runtime target map`](../discovery/codex-runtime-map.md). It deliberately
separates locally observed availability, documented behavior, blocked probes,
and untested candidate lowerings. Discovery maps are evidence for the compiler;
they do not become portable ontology and are invalidated by runtime or host
changes until their conformance fixtures are rerun.

Implementation-specific skills can add domain vocabulary, source conventions,
artifact schemas, integrations, evaluators, and safe operating procedures.
They remain versioned instance content and declare the DotLn protocol version,
agent runtime, required capabilities, requested tools, authority implications,
context cost, and the definitions or schemas they project.

Whenever possible, skill schemas, reference material, and command help are
generated from the same instance definitions consumed by the compiler. A
Claude skill, Codex skill, human runbook, CLI help page, and sparse agent-facing
screen may be different projections of one contract. Their semantic hashes and
conformance fixtures should agree.

Skills may improve discoverability and ergonomics but cannot enforce a hard
rule by themselves. Permissions, guards, validation, persistence, and replay
remain below the skill layer. An agent without a convenience skill can still
participate through the protocol; an agent with a persuasive skill gains no
authority beyond its envelope.

The marketplace's useful quality signals are evidence-bound: compatibility
tests, reproducible fixtures, observed activation history, false-activation
rate, security review, maintainer provenance, and agreement with the local
operator in the relevant domain. Downloads, stars, rarity, persuasive copy,
and visual polish never confer authority. An implementation may maintain its
own allowlist, fork any definition, or prohibit remote packages entirely.

**Decomposition rule:** many bounded machines — one per task, episode,
workstream, maintenance cycle — communicating through events. Never one
statechart containing every actor, timer, and tab.

**The host:** a minimal local control-plane process owns the kernel loop, the
store, the outbox, lease expiry, cadence firing, and worker spawning — it is
what stays alive across model-session death, rate limits, crashes, and network
loss. No interactive session is ever the thing keeping work alive.

## The agentic communication core

This is the center of gravity of the personal build (operator directive). It is
redux/rxjs applied to agents, and it must satisfy the analog completeness test:

- The **traffic cop** (main interactive session, when one exists) is an
  *airlock*: it captures intent, emits typed **actions**, dispatches, receives
  result envelopes, and requests human judgment. It never explores repos,
  reads files at length, or holds history. Three-tier context firewall: worker
  contexts may be huge → the store keeps structured durable results → the main
  thread gets ids, status, conclusions.
- **Effects** (feedback agents) subscribe to the event stream by their own
  triggers, run *off-thread*, and may dispatch their own actions. Most are
  deterministic mechanisms; an LLM is invoked only where judgment is
  irreducible ("agentize the feedback" ≠ resident LLM agents).
- A **reducer/mediator** aggregates effect output (forkJoin-style or by
  timeout) and hands the traffic cop a compact script — so the traffic cop can
  stay feedback-agnostic, loading at most rule names + summaries.
- **Blackboard option**: agents need not converse directly; they can modify a
  shared environment whose current state determines which actions are legal
  (stigmergy). Statechart-gated affordances make illegal actions *absent*, not
  forbidden-by-prose — a page (or CLI) simply doesn't render a disabled Claim
  button. The browser is one strong rendering of this shared world; the shared
  world itself is the event store.
- **Bootstrap transport**: shared files in the repo are an acceptable first
  bus (that's how model harnesses fan out internally) but never canonical
  state — the append-only log is (lost-update and ordering hazards otherwise).

## Composition system

The LoadoutGraph (see domain model) is compiled per episode:

1. Resolve identity + role + applied patterns + environment → active tension
   (PolarAxes) and phenotype.
2. Type-check links: tags vs supportedTags, capability requirements (a
   Screenshot-Verification support without a browser renders SUPPORT INACTIVE
   with the exact missing capability and concrete corrections — never "hope
   the model figures it out").
3. Apply deterministic composition precedence on conflicts (visible, 9 levels):
   safety invariants > hard permissions > statechart guards > work-order
   obligations > resource budgets > policy scores/tensions > cadence > voice >
   visual skin. Conflicting hard supports reject the composition with an
   explanation. Commutativity is checked; non-commuting pairs must be explicit
   pipelines or rejected (Principle 13).
4. Emit: WorkOrder + permissions + hooks + schemas + cadences + verification
   plan + the (small) prompt fragment residue. Per-support cost is declared:
   mechanism type, prompt tokens (usually 0), runtime cost, extra episodes.

## Session lifecycle & resilience

- Statechart-first: `rate_limited`, `environment_blocked`, `operator_paused`,
  `interrupted` are lifecycle states, not failures. 429 → persist continuation
  → backoff cadence (jittered; never wake all waiters at once) → resume in a
  fresh session from the persisted WorkOrder.
- Outbox protocol: kernel decides → event + trace + continuation + command
  persist → adapter receives persisted command → result correlates by
  commandId → duplicates ignored deterministically → missing result leaves a
  recoverable pending command → restart replays to identical state.
- Leases + heartbeats for long workers; a vanished worker can never destroy a
  workstream.
- **Failure-injection matrix (canonical here; roadmap and work orders cite
  it).** Expected outcomes are part of the spec:
  | # | Injection | Expected outcome | Required by |
  |---|---|---|---|
  | 1 | Crash after command persist, before dispatch | Restart finds the pending command via replay and re-dispatches; no duplicate effects (adapter dedups by commandId) | v0.1.0 |
  | 2 | Crash after effect, before result persist | Command remains pending; recovery re-queries or re-dispatches idempotently; never double-applies | v0.4.0 |
  | 3 | Duplicate result event | Second delivery ignored deterministically (commandId); state unchanged; trace records the dedup | v0.1.0 |
  | 4 | Result after authority expiry | Event is persisted (it happened); reactor decides quarantine/NoOp with trace naming the expired envelope; payload causes no state mutation | v0.4.0 |
  | 5 | Operator-return racing a queued cadence pulse | The already-queued pulse is processed, but its guard re-evaluates presence and decides NoOp-with-trace; future pulses cancel | v0.1.0 |
  | 6 | Interruption mid-episode (network loss, kill) | Lease expires; continuation + work order recoverable; a fresh episode resumes or a recovery episode inspects | v0.4.0 |
  Without these, "offline-capable" is a slogan.

  Row 5 scope at v0.1.0 (pinned by WO-002's repair): the kernel's contribution
  is the pure guard — `guardQueuedPulse` re-evaluates presence through the
  predicate registry for a pulse the runtime has already dequeued, and its
  Decision *declares* the NoOp-with-trace and the future schedule ids to
  cancel. Like every kernel Decision it performs nothing: queue ownership,
  event-sourced presence (`OperatorPresenceChanged` folded into state), and
  executed cancellation belong to the scheduler runtime that arrives at
  v0.4.0 with rows 2/4/6.

**Perception cost hierarchy** (distinct from Principle 6's evidence-strength
ordering — this ranks *reading* cost, that ranks *proof* strength): episodes
read the world via the cheapest exact representation first — structured state →
semantic DOM/accessibility tree → network/event data → screenshot → OCR.
Screenshots and OCR are perceptual tools for visual claims and pixel-trapped
text, never the default channel for state you own in structured form.

## Ports (what keeps work-flavored verticals pluggable)

- `SourceAdapter`: tracked-work artifact → immutable **SourceBundle**
  (rich-text semantics preserved as data — strikethrough, color, revision
  history, images with OCR-as-aid-never-truth; per-artifact convention
  inference; secrets stay in the adapter, never in prompts/logs/repo). A
  **StoryContract** is the typed interpretation compiled from a SourceBundle
  (purpose, current/desired behavior, acceptance criteria, examples,
  constraints, non-goals, assumptions, open questions, pinned source
  revision); an **ImpactMap** is the structured change-surface map a read-only
  cartographer episode produces (entry points, state ownership, shared
  consumers, existing tests, similar prior implementations) — never a prose
  repo summary. A **source revision guard** watches the artifact's revision:
  a material mid-cycle change invalidates exactly the downstream
  contract/plan/evidence derived from the changed portion. Enterprise ticket
  trackers are one future adapter; GitHub Issues is the nearer personal one.
- **Repo registration**: a one-time read-only archaeologist episode produces a
  typed **RepoProfile** — commands (install/build/test/lint/format), local-app
  startup, branching/PR policy, environment authority, demonstrated
  architecture patterns. All later commands come from the profile. The
  **repo-native rule**: convention authority resides in the target codebase's
  demonstrated architecture, never in the model's training-set fashion.
- `WorkOrderTransport`: see domain model. The fake deterministic executor is a
  first-class adapter and ships first.
- `VerificationAdapter`: claim-typed evidence (visual claim → rendered-image
  check; network claim → trace; state claim → DOM/store read), recorded into
  the workstream's AcceptanceEvidenceMatrix. **Baseline first (Live Witness)**:
  before any change, an episode runs the current base branch and reproduces the
  defect (or walks adjacent behavior for a new story), preserving baseline
  evidence; honest non-reproduction is recorded as an environment limitation,
  never faked. Defects and stories run dual workflows (reproduce → root-cause →
  failing regression evidence → repair, vs. understand → define observable
  behavior → tests/mocks → implement). Evidence is typed: mocked-client proof
  (labeled synthetic fixtures, AC-mapped) never counts as live-integration
  proof. Verifier episodes are **blinded** from the implementer's narrative;
  the implementer never certifies its own work. Verification ("does it work?")
  and review ("is this the right implementation to maintain and ship?") are
  **separate independent episodes** — the reviewer reports findings, may not
  silently rewrite the branch, and its minor suggestions never auto-expand
  scope.
- `DeliveryAdapter`: PR/patch/report generation *from artifacts, not
  narrative* — the deliverable body is generated from the StoryContract, the
  actual diff, the completed AcceptanceEvidenceMatrix, and evidence refs.
  "Deliverable-ready" is an explicit conjunction checklist (current source
  revision, explicit contract, no unresolved material ambiguity, reproduced
  baseline, repo-native implementation, no unexplained scope, tests/build/
  lint, live behavior walked, visual claims visually inspected, every AC
  evidenced, independent verification and review, final diff read, grounded
  body, monitored loop) — no single passing signal is ever "done". Post-
  submission loop ownership: CI failures deterministically classified before
  any repair dispatch, review comments triaged by type, upstream source drift
  watched (revision guard) until a human-controlled terminal state. Projection
  boundary enforced: no internal vocabulary in external artifacts.

## Operator-presence policy

Presence changes the resource mix, never safety — safety is a lexicographic
precondition (ObjectiveContract ordering), and the lists below rank attention
among already-safe actions. Present: foreground intent > support > bounded
maintenance > exploration. Absent: safety > finish
bounded work > entropy reduction (the 5S organism) > proposals > research >
NoOp when expected value goes negative. Each candidate action has its own
U(a,t) = Benefit − Risk − Disruption − OpportunityCost; the sow/reap ratio
(~1/3 research, bounded execution windows, Double Dutch entry/exit) paces the
cycle. Unattended work is reversible, evidenced, and independently verified.

## Corpus policy

`docs/intake/` (gitignored) holds raw material; committed docs are synthesized.
Structure for growth: `corpus/sanitized/` (git-eligible), `corpus/fixtures/`
(minimized regression cases), `corpus/manifests/` (hashes, provenance,
retention), local-only raw layer. Transcript-handling policies are explicit
and inspectable per episode: verbatim-local / encrypted / scrubbed / summary /
expiring / excluded-from-learning. Verbatim-with-scrubbing is the default —
sources regenerate summaries, never the reverse.

## Learning loop

Every episode records: loadout version, work-order version, model + runtime
config, inputs, tool events, artifacts, git state, evidence, duration,
resource use, retry behavior, human rework, outcome class. The system learns
at the *controller* level: which topology per task class, which patterns
activate usefully, when to stop researching, how much verification is
warranted, which feedback units are dead/redundant/conflicting/overfit.
Identity updates are versioned proposals gated by replay/sandbox evaluation.
Two flywheel modes: retrospective grading, and the predict-then-score variant
(register hypotheses, watch which come true, at what timescale). Surfacing is
exception-driven: once a rule is reliable, conforming events stop deserving
operator attention; watchers surface the exceptions.
