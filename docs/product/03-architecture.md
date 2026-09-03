# Architecture

**Status:** target architecture. The `v0.2.0` baseline implements the pure
kernel, JSONL-backed deterministic fake walking skeleton, and its projections;
compiler, real-worker, native verification, durable adapter persistence, and
console layers below remain planned unless a section explicitly says otherwise.
See the roadmap for their evidence gates.

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
docs. The flavor names — Forge (compiler), Compendium (pattern library),
Chronicle (events/lineage), Atlas (repos/workstreams), Simulacrum (simulation
lab) — are an available _skin_, consistent with the transmog philosophy
(swappable presentation over identical mechanics; defined in 04-interfaces).
Never let a flavor name be the only name.

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

The boundary is architectural: instance definitions compile through public IR
and ports and remain visible to the build inspector. They must not require
private branches or special cases in the kernel. Conversely, the core does not
silently ship the author's preferred organization as universal defaults. Starter
packs may bundle the founding patterns, but installation, activation, and
inheritance are explicit and removable.

Portability target: an implementation can export its definitions and policy
history separately from secrets and raw protected sources, then load them on a
compatible DotLn runtime with the same semantic hashes. Whether workstream
events themselves move is a separate retention and sovereignty decision.

### Package ecosystem and marketplaces

Portable instance content implies packages and catalogs. A public marketplace is
one catalog adapter; filesystem packages, Git repositories, private registries,
and organization-curated catalogs are peers. Marketplace presence never becomes
an ontological dependency or a mark of trust.

Package families may include:

- definition packs: identities, roles, personalities, patterns, actives,
  supports, PolarAxes, loadouts, teams, and domain vocabulary;
- workflow packs: workstream templates, Programs, Cadences, schemas, evidence
  requirements, and completion contracts;
- evaluation packs: evaluators, exemplars, comparison sets, regression fixtures,
  and feedback units;
- integration packs: source adapters, effect adapters, transports, and
  projections;
- agent enablement packs: runtime-specific skills, command wrappers, schemas,
  and orientation resources that teach agents how to participate in DotLn and in
  a particular implementation;
- presentation packs: views, skins, glyph vocabularies, and reports that do not
  alter semantics;
- starter implementations: reviewed combinations of the above, with no
  privileged status over hand-authored local definitions.

Trust classes remain separate. Data-only definitions that compile through the IR
are not equivalent to executable adapters with network, filesystem, model, or
credential access. Every package declares its content kind, semantic version,
DotLn compatibility, dependencies, requested capabilities, authority effects,
prompt/context cost, runtime cost, provenance, and verification evidence.
Executable code receives a visibly higher installation and review burden.

Distribution never implies activation. The flow is **discover → inspect →
resolve dependencies → preview compiled effects and requested permissions →
install pinned version → explicitly equip/activate in scope**. Updates create
new versions and a semantic diff; replay retains the exact historical version.
Revocation prevents future activation without rewriting past events.

#### Community builds and sandbox promotion

A **CommunityBuild** is a portable, content-addressed manifest over pinned
package versions and their composition—not a copy of another implementation's
event history, credentials, or protected sources. It may describe one active
with supports, an individual loadout, a team topology, a workstream template, or
a complete starter implementation.

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
context/runtime cost, verification evidence, and the exact compiled diff against
a selected local build.

Mix-and-match is structural: drag, link, substitute, disable, or fork
components, then re-run tag compatibility, commutativity, precedence, budget,
and authority checks. The editor explains why a combination is inactive,
rejected, or behavior-changing. It never merges opaque prompt blobs and hopes
the model reconciles them.

Community content enters a sandbox with no credentials, network, destructive
tools, live adapters, or write access by default. The sandbox uses fake adapters
and explicit fixtures; access to a redacted local replay is a separate operator
grant. Executable integration packs remain isolated from definition-only content
and require their higher trust review even inside a composed build.

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
- author and validate identities, roles, actives, supports, PolarAxes, patterns,
  workstream templates, and loadouts;
- preview a package's semantic diff, permissions, costs, and compatibility;
- run an implementation's prescribed verification and return its typed result;
- contribute, fork, install, equip, update, or revoke packages through the
  implementation's chosen catalog policy.

Coordination skills may cover:

- typed speech acts and result-envelope etiquette;
- claiming, handing off, delegating, joining, leaving, and replacing episodes;
- blackboard participation and event-subscription conventions;
- evidence exchange, dissent, conflict declaration, and escalation;
- topology-specific duties for planner, maker, verifier, watcher, mediator, or
  other locally defined roles;
- bounded peer communication where the Program permits direct exchange;
- synchronization points, cancellation, heartbeat, and continuation handoff.

For a managed episode, DotLn may **preload** the negotiated participation and
coordination skills into the spawned agent. The preload is compiled from the
current WorkOrder, role, loadout, topology, implementation policy, runtime
profile, and authority envelope. It is minimal and episode-scoped: an isolated
worker does not receive team negotiation skills; a read-only watcher does not
receive mutation procedures; a verifier does not inherit the maker's narrative.

This is the skills-layer version of "a build, not a biography." Loading every
available coordination skill into every agent would send each one into every map
carrying the whole stash—as if every support were linked to every skill. In
plain language, irrelevant context would consume attention and widen the
interaction surface before the task began. Skills activate by tags, state,
relationship, and capability; their context cost is visible; expiry and removal
follow the episode lifecycle.

The repository's operator workflow should converge on the same model. Stable
DevEx intents such as `resume: status`, `resume: next`, `resume: verify`,
`resume: fix`, `resume: final review`, and `resume: release close` resolve
durable control state first, then load only the reviewed role skill needed for
that intent. The skill supplies procedure, input contract, artifact locations,
evidence obligations, and stopping rules; it does not duplicate phase state or
grant authority. Release close retains separate, narrow post-merge authority for
the annotated tag and its matching GitHub Release. This replaces large
autoloaded role explanations with on-demand, versioned protocol adapters while
preserving a CLI path for humans and runtimes that cannot load skills.

Skill delivery is incremental rather than a single rewrite: first define and
test the shared intent-to-transition contract, then package verifier and repair
skills, then final-review and lifecycle skills, and finally measure startup
context saved, invocation accuracy, and parity with the CLI. Until those work
orders land, the current resume resolver and durable docs remain authoritative.

#### Runtime primitive catalogs

An agent runtime is not merely a text-completion endpoint. Claude, Codex, and
future harnesses expose different native composition mechanisms. DotLn records
each as a versioned `RuntimePrimitiveCatalog` discovered from the actual
environment, then treats it as a compiler target.

The familiar brain-and-body projection is useful only if its losses stay
visible. The model is the replaceable **brain**; tools and effect adapters are
the **senses and hands**; the harness is the larger **body** that presents
context and tools and manages a model episode. Canonically, DotLn keeps these
responsibilities separate:

| Layer                      | Responsibility                                                                                                                                                                                     | Boundary                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| model                      | supplies inference, judgment, or generation inside an episode                                                                                                                                      | owns no durable identity, workflow state, authority, or evidence                            |
| harness                    | constructs immediate context; exposes and mediates tools, local memory/compaction, session lifecycle, permissions, and structured I/O                                                              | does not own the cross-episode workstream or make tool availability into authority          |
| orchestration / DotLn host | compiles WorkOrders and loadouts; selects actors, topology, runtime, transport, and environment; owns routing, joins, cancellation, retries, cadence, leases, outbox, evidence gates, and recovery | may lower choices into model- or harness-native mechanisms but cannot manufacture authority |
| `WorkOrderTransport`       | carries an order to an actor and returns its result envelope                                                                                                                                       | says how dispatch crosses a boundary, not where execution occurs or what it may affect      |
| execution environment      | supplies the observable process, filesystem, network, secret, device, resource, and teardown boundary                                                                                              | containment is neither task authority nor proof that a result is correct                    |

The essay-derived word **harness** is therefore deliberately narrower here than
“everything outside the weights.” A runtime vendor may bundle several rows in
one product; the build inspector and evidence model still separate them.

A Claude-oriented catalog may expose native forms for agent definitions,
subagents, skills, hooks, permissions, tool/MCP connections, commands,
workflows, worktrees, background execution, session lifecycle, structured
outputs, and context-loading rules. DotLn can use combinations of these
primitives to realize an implementation rather than flattening everything into
one prompt.

Illustrative lowering—not a pinned one-to-one mapping:

| DotLn semantic mechanism     | Possible Claude-native realization                   |
| ---------------------------- | ---------------------------------------------------- |
| Role or topology position    | scoped agent/subagent definition                     |
| Active or support residue    | selected skill plus structured input/output          |
| Hard safety invariant        | permission boundary or reviewed hook                 |
| Source/effect integration    | constrained tool or MCP connection                   |
| WorkOrder                    | task-scoped context and output schema                |
| Disposable episode           | fresh/resumed/forked session with explicit lifecycle |
| Independent verification     | isolated verifier agent with separate context        |
| Cadence/lifecycle transition | workflow or host-owned background dispatch           |
| Evidence/result contract     | structured output validated before append            |

The compiler may combine primitives: one organizational support could produce a
skill for judgment, a hook for enforcement, an output schema for evidence, and a
verifier episode for the acceptance gate. The build inspector shows all lowered
artifacts together and names which semantics remain at the DotLn host.

Other runtimes receive their own catalogs and lowerings. Semantic equivalence is
judged at the normalized DotLn contract and observable decision/event level, not
by requiring identical native features. When a runtime cannot realize a
mechanism, compilation reports the missing capability, selects an explicitly
approved adapter or weaker labeled projection, or rejects the build. It never
silently moves a hard rule into prompt prose.

[LangGraph's JavaScript overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
describes it as a low-level orchestration framework/runtime for durable,
stateful graphs that may mix deterministic and model-driven steps. It is the
first named **accommodation probe**, not a selected DotLn dependency or a
replacement ontology. A future fixture may compare a pure TypeScript reference
execution with a LangGraph lowering for continuation, persistence, interruption,
cancellation, replay, and typed results. DotLn's normalized Program, event log,
authority envelope, semantic hash, and evidence gates remain authoritative;
vendor checkpoint or graph state does not silently become canonical state.

This creates a marketplace layer for **runtime recipes**: reusable, tested ways
to implement a DotLn mechanic with a particular runtime's native primitives.
Recipes declare runtime/version compatibility, semantic coverage, costs,
required capabilities, conformance fixtures, and known loss. They can improve as
the runtime evolves without changing the implementation's canonical roles,
workflows, or doctrine.

External innovation follows an accommodation test: decompose the behavior into
observable semantics, attempt an exact composition of current primitives and
ports, identify any irreducible missing primitive, and compare evidence across
the native and lowered paths. A successful adapter or recipe expands the
ecosystem without adding a special case to the kernel. A mismatch stays visible
as adapted, lossy, blocked, or unverified rather than being hidden behind a
feature-name match.

The first provisional target catalog is the
[`Codex runtime target map`](../discovery/codex-runtime-map.md). It deliberately
separates locally observed availability, documented behavior, blocked probes,
and untested candidate lowerings. Discovery maps are evidence for the compiler;
they do not become portable ontology and are invalidated by runtime or host
changes until their conformance fixtures are rerun.

Implementation-specific skills can add domain vocabulary, source conventions,
artifact schemas, integrations, evaluators, and safe operating procedures. They
remain versioned instance content and declare the DotLn protocol version, agent
runtime, required capabilities, requested tools, authority implications, context
cost, and the definitions or schemas they project.

Whenever possible, skill schemas, reference material, and command help are
generated from the same instance definitions consumed by the compiler. A Claude
skill, Codex skill, human runbook, CLI help page, and sparse agent-facing screen
may be different projections of one contract. Their semantic hashes and
conformance fixtures should agree.

Skills may improve discoverability and ergonomics but cannot enforce a hard rule
by themselves. Permissions, guards, validation, persistence, and replay remain
below the skill layer. An agent without a convenience skill can still
participate through the protocol; an agent with a persuasive skill gains no
authority beyond its envelope.

The marketplace's useful quality signals are evidence-bound: compatibility
tests, reproducible fixtures, observed activation history, false-activation
rate, security review, maintainer provenance, and agreement with the local
operator in the relevant domain. Downloads, stars, rarity, persuasive copy, and
visual polish never confer authority. An implementation may maintain its own
allowlist, fork any definition, or prohibit remote packages entirely.

**Decomposition rule:** many bounded machines — one per task, episode,
workstream, maintenance cycle — communicating through events. Never one
statechart containing every actor, timer, and tab.

**The host:** a minimal local control-plane process owns the kernel loop, the
store, the outbox, lease expiry, cadence firing, and worker spawning — it is
what stays alive across model-session death, rate limits, crashes, and network
loss. No interactive session is ever the thing keeping work alive.

## Candidate — isolated execution environments

DotLn may eventually select and attest an execution boundary per episode: the
current worktree plus harness sandbox, a hardened container runner (Docker is
one possible provider), a disposable VM or microVM, or another environment
proved by discovery. `ExecutionEnvironmentProfile` is a working name for the
selection record, not a pinned schema. It remains orthogonal to
`RuntimePrimitiveCatalog`, `WorkOrderTransport`, and `AuthorityEnvelope`.

A profile needs inspectable facts rather than one “stronger isolation” score:
substrate and provider versions; pinned image, root filesystem, guest kernel, or
template identity; source and base revision; mounts and writable surfaces;
network and egress; credential leases; available tools and devices; process,
CPU, memory, disk, and wall-clock limits; result extraction; logging and
attestation; and teardown/residual-state evidence. The host selects a profile
from the WorkOrder's risk and capability requirements, provisions it, stages the
least input, monitors/cancels/expires it, extracts a typed result, and destroys
it. The worker never controls the container daemon, hypervisor, or environment
provider.

A worktree separates Git writers and preserves provenance; it is not a
hostile-process security boundary. Docker's own
[container overview](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
distinguishes containers that share the host kernel from VMs with their own
guest kernel. Either can still expose dangerous mounts, egress, credentials,
resources, or control sockets, so its label alone proves nothing. Isolation
never widens an authority envelope and an isolated worker never certifies its
own output.

The first future probe is intentionally inert: a synthetic repository,
deterministic executor, no credentials, no live adapters, no network, explicit
mounts, bounded resources, a typed result channel, and teardown evidence. It
compares the current baseline, one hardened container profile, and a VM/microVM
profile only where local capability discovery supports them. Negative fixtures
cover forbidden filesystem and credential reads, egress, process/control-socket
access, write scope, resource exhaustion, timeout, cancellation, and post-run
residue; measurements cover startup, cache behavior, compatibility, cost, and
evidence quality. Two topologies remain open: put the whole harness inside the
boundary, or keep the model-side “brain” outside while only authorized “hands”
cross a structured tool-execution protocol. No runner, image, provider,
dependency, default, or expansion of WO-009 is selected here.

## The agentic communication core

This is the center of gravity of the personal build (operator directive). It is
redux/rxjs applied to agents, and it must satisfy the analog completeness test:

- The **traffic cop** (main interactive session, when one exists) is an
  _airlock_: it captures intent, emits typed **actions**, dispatches, receives
  result envelopes, and requests human judgment. It never explores repos, reads
  files at length, or holds history. Three-tier context firewall: worker
  contexts may be huge → the store keeps structured durable results → the main
  thread gets ids, status, conclusions.
- **Effects** (feedback agents) subscribe to the event stream by their own
  triggers, run _off-thread_, and may dispatch their own actions. Most are
  deterministic mechanisms; an LLM is invoked only where judgment is irreducible
  ("agentize the feedback" ≠ resident LLM agents).
- A **reducer/mediator** aggregates effect output (forkJoin-style or by timeout)
  and hands the traffic cop a compact script — so the traffic cop can stay
  feedback-agnostic, loading at most rule names + summaries.
- **Blackboard option**: agents need not converse directly; they can modify a
  shared environment whose current state determines which actions are legal
  (stigmergy). Statechart-gated affordances make illegal actions _absent_, not
  forbidden-by-prose — a page (or CLI) simply doesn't render a disabled Claim
  button. The browser is one strong rendering of this shared world; the shared
  world itself is the event store.
- **Bootstrap transport**: shared files in the repo are an acceptable first bus
  (that's how model harnesses fan out internally) but never canonical state —
  the append-only log is (lost-update and ordering hazards otherwise).

## Composition system

The LoadoutGraph (see domain model) is compiled per episode:

1. Resolve identity + role + applied patterns + environment → active tension
   (PolarAxes) and phenotype.
2. Type-check links: tags vs supportedTags, capability requirements (a
   Screenshot-Verification support without a browser renders SUPPORT INACTIVE
   with the exact missing capability and concrete corrections — never "hope the
   model figures it out").
3. Apply deterministic composition precedence on conflicts (visible, 9 levels):
   safety invariants > hard permissions > statechart guards > work-order
   obligations > resource budgets > policy scores/tensions > cadence > voice >
   visual skin. Conflicting hard supports reject the composition with an
   explanation. Commutativity is checked; non-commuting pairs must be explicit
   pipelines or rejected (Principle 13).
4. Emit: WorkOrder + permissions + hooks + schemas + cadences + verification
   plan + the (small) prompt fragment residue. Per-support cost is declared:
   mechanism type, prompt tokens (usually 0), runtime cost, extra episodes.

The emitted component manifest is also a participation proof for the compiled
chain. A data-acquisition active may legitimately include an authorized
`fetch`/XHR adapter while showing that no audit, logging, retention, or other
optional payload-observation support is linked to that data path. Required
data-minimized authority, command, and result receipts remain higher-precedence
evidence and cannot be unequipped. A local execution receipt binds one invocation
to the compiled manifest and transformation versions. The pure transform
subgraph proves its mapping for declared inputs; adapter evidence proves the
effectful invocation; an outer capability boundary and independent evidence are
still required to rule out undeclared side effects in an implementation.

Clean Room is the first explicit source-promotion active built from this shape.
Its employer/secret boundary compiles as a locked safety guard, while linked
supports select a source-treatment strategy and add destination or assurance
checks. Rewrite, shape-first synthesis, and direct-draft fidelity do not
commute, so the compiler accepts exactly one of them or an explicit ordered
pipeline; it never treats them as an unordered bag. A destination may require
particular assurance supports, and a missing or conflicting requirement renders
the active inactive with the reason visible. Increased review depth can only
narrow promotion or add evidence, never convert a blocked source into clearance.

Before type-checking a historical loadout, resolve its IR, mechanic, support,
runtime, and environment versions into a compatibility plan
(`10-ir-compatibility.md` §Transformation graph). Availability may be
non-monotonic across releases. Missing or inactive mechanics remain visible with
their declared fallback behavior; the compiler never silently drops a requested
component. Validation and planning are pure; JIT execution or AOT migration
occurs only after an explicit plan is accepted.

## Agent-originated product suggestions

At a mature rung, independent maintenance and 5S episodes may emit typed
`ProductSuggestion` records when repeated friction, waste, risk, or an unmet
opportunity survives their local authority boundary. Suggestion is a speech act,
not permission: the submitting agent cannot schedule its own proposal, expand a
work order, or manufacture priority through volume.

The suggestion pipeline normalizes and deduplicates records, links corroborating
and dissenting evidence, clusters common causes, checks settled decisions and
existing roadmap items, and applies explicit value/risk/novelty/effort filters.
Rejections and deferrals retain reason and lineage so the same weak request does
not repeatedly consume review. A product-planning role periodically examines the
small high-signal remainder—the operator's “pearls”—and proposes which
candidates deserve implementation. The role occupant is selected by the current
operating model; model assignment remains replaceable and is never embedded in
the semantic record.

The candidate Snooping Footprint Reducer is one recurring producer for this
pipeline. It inventories observation and retention structurally, emits
minimization suggestions, and may attach a reviewed but non-authoritative
candidate work order to a proposal packet. It receives no privilege to inspect
the private values or resolved targets it is trying to remove, and it cannot
promote or activate its own output. Detailed footprint evidence remains in the
private lane; only a profile-approved sanitized suggestion or non-disclosing
local reference may enter a public proposal.

Only an operator-authorized planning transition may promote a suggestion into a
real WorkOrder. Promotion records source suggestions, selection rationale,
alternatives, evidence, scope boundary, and the acceptance gate. Agents that
benefit from accepted changes do not verify their own proposal by default.

### Channel-plural intake, PR-backed registration

GitHub Issues, Discussions, pull requests, in-application forms, chat, and local
files are intake transports, not competing sources of authority. Use the
cheapest surface that matches the suggestion's maturity: an Issue or Discussion
can hold an unformed question and human conversation; a mature agent-authored
suggestion should arrive as a pull request so its claims, evidence, and proposed
scope can receive line review, automated checks, requested revisions, and an
immutable diff.

For this repository's bootstrap, such a pull request adds one normalized
proposal packet under `docs/proposals/<suggestion-id>/`, never directly under
`docs/work-orders/`. The packet contains the `ProductSuggestion`, source and
provenance, corroborating and dissenting evidence, alternatives, risks,
duplication hints, and optionally a clearly non-authoritative candidate work
order. Executable demonstrations or benchmarks are untrusted inputs and run
without repository secrets or write authority. The author may revise the packet
and may supply feasibility evidence, but that evidence cannot satisfy a later
work order's independent verification obligation.

Merging a proposal pull request means **registered for durable planning**, not
accepted for implementation, prioritized, scheduled, funded, or activated. A
closed, deferred, rejected, duplicated, or superseded proposal retains its
reason and fingerprint so volume cannot manufacture priority or repeatedly
consume review. GitHub remains a replaceable collaboration adapter; the
normalized proposal and eventual event-store record are the portable truth.

Promotion is a separate operator-authorized planning act. It selects from the
registered proposal, resolves its open choices, assigns the official identifier,
model and effort, base revision, authority envelope, scope and non-goals,
acceptance criteria, and independent evidence gate, then compiles the real file
under `docs/work-orders/`. A submitting agent may therefore do substantial
proposal work and survive a demanding review loop without ever issuing itself
execution authority.

## Session lifecycle & resilience

Resume control v1 uses an append-only JSONL control log
(`docs/control/resume.jsonl`) plus a generated human projection
(`docs/control/current.md`). A small deterministic resolver exposes the stable
intents status, next, fix, verify, final review, and release close; it resolves
the active work order, current phase, immutable verification sequence, next
legal transition, and required artifacts from durable state. Conversation-first
`resume:` phrases map to the same command surface. Release close is a guarded
post-merge lifecycle operation rather than a control-log transition. Internal
completion actions record executor readiness, verification, repair, and
final-review outcomes. The log
is canonical; the Markdown file is a disposable projection. One writable agent
per worktree serializes appends in v1; concurrent control-log writers are
deferred.

The operator surface also needs an always-legible runtime projection: remaining
context budget, active and completed delegated episodes, current phase, blocked
or awaiting-input state, and the next legal workflow action. A TUI status line,
agent drawer, CLI status view, and future console are projections of the same
typed state, not separate sources of truth. If a host cannot expose exact
context remaining or subagent telemetry, it must label the value unavailable or
estimated instead of implying continuous observability.

The operator worktree projection automates the reversible control-plane edges
around that state: start from a clean `main`, fetch and fast-forward the base,
create one sibling worktree/branch, and activate its WorkOrder; after a recorded
passing final review and clean commit, publish the branch and open a PR for the
operator to review and merge. Cleanup runs only after `origin/main` contains the
subject branch, then removes its worktree and safely deletes the merged branch.
Divergence, dirty state, missing closure, naming collisions, or an unmerged
branch refuse. The tool never rebases, force-deletes, auto-merges, or discards
changes.

- Statechart-first: `rate_limited`, `environment_blocked`, `operator_paused`,
  `interrupted` are lifecycle states, not failures. 429 → persist continuation →
  backoff cadence (jittered; never wake all waiters at once) → resume in a fresh
  session from the persisted WorkOrder.
- Outbox protocol: kernel decides → event + trace + continuation + command
  persist → adapter receives persisted command → result correlates by commandId
  → duplicates ignored deterministically → missing result leaves a recoverable
  pending command → restart replays to identical state.
- Leases + heartbeats for long workers; a vanished worker can never destroy a
  workstream.
- **Failure-injection matrix (canonical here; roadmap and work orders cite
  it).** Expected outcomes are part of the spec:

  | #   | Injection                                     | Expected outcome                                                                                                                           | Required by |
  | --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
  | 1   | Crash after command persist, before dispatch  | Restart finds the pending command via replay and re-dispatches; no duplicate effects (adapter dedups by commandId)                         | v0.1.0      |
  | 2   | Crash after effect, before result persist     | Command remains pending; recovery re-queries or re-dispatches idempotently; never double-applies                                           | v0.5.0      |
  | 3   | Duplicate result event                        | Second delivery ignored deterministically (commandId); state unchanged; trace records the dedup                                            | v0.1.0      |
  | 4   | Result after authority expiry                 | Event is persisted (it happened); reactor decides quarantine/NoOp with trace naming the expired envelope; payload causes no state mutation | v0.5.0      |
  | 5   | Operator-return racing a queued cadence pulse | The already-queued pulse is processed, but its guard re-evaluates presence and decides NoOp-with-trace; future pulses cancel               | v0.1.0      |
  | 6   | Interruption mid-episode (network loss, kill) | Lease expires; continuation + work order recoverable; a fresh episode resumes or a recovery episode inspects                               | v0.5.0      |

  Without these, "offline-capable" is a slogan.

  Row 5 scope at v0.1.0 (pinned by WO-002's repair): the kernel's contribution
  is the pure guard — `guardQueuedPulse` re-evaluates presence through the
  predicate registry for a pulse the runtime has already dequeued, and its
  Decision _declares_ the NoOp-with-trace and the future schedule ids to cancel.
  Like every kernel Decision it performs nothing: queue ownership, event-sourced
  presence (`OperatorPresenceChanged` folded into state), and executed
  cancellation belong to the scheduler runtime that arrives at v0.5.0 with rows
  2/4/6.

**Perception cost hierarchy** (distinct from Principle 6's evidence-strength
ordering — this ranks _reading_ cost, that ranks _proof_ strength): episodes
read the world via the cheapest exact representation first — structured state →
semantic DOM/accessibility tree → network/event data → screenshot → OCR.
Screenshots and OCR are perceptual tools for visual claims and pixel-trapped
text, never the default channel for state you own in structured form.

## Ports (what keeps work-flavored verticals pluggable)

- `SourceAdapter`: tracked-work artifact → immutable **SourceBundle** (rich-text
  semantics preserved as data — strikethrough, color, revision history, images
  with OCR-as-aid-never-truth; per-artifact convention inference; secrets stay
  in the adapter, never in prompts/logs/repo). A **StoryContract** is the typed
  interpretation compiled from a SourceBundle (purpose, current/desired
  behavior, acceptance criteria, examples, constraints, non-goals, assumptions,
  open questions, pinned source revision); an **ImpactMap** is the structured
  change-surface map a read-only cartographer episode produces (entry points,
  state ownership, shared consumers, existing tests, similar prior
  implementations) — never a prose repo summary. A **source revision guard**
  watches the artifact's revision: a material mid-cycle change invalidates
  exactly the downstream contract/plan/evidence derived from the changed
  portion. Enterprise ticket trackers are one future adapter; GitHub Issues is
  the nearer personal one.
- **Model input boundary**: every compiled model call can expose a local
  `ModelInputPlan` before invocation. It identifies the destination as a
  deterministic local processor, local model, or provider-hosted remote model
  and classifies each direct, derived, inferred, retrieved, adjacent, and
  accidentally co-travelling input edge. The operator can inspect the planned
  form—verbatim content, structure, subject/tag metadata, or a named local
  transform—and choose only compiled alternatives such as omission, field
  selection, local redaction/derivation, synthetic replacement, verified local
  inference, deterministic execution, or cancellation. The preview shows the
  capability and evidence lost by each choice; it never silently routes narrowed
  content to a remote fallback. Exact previews and invocation receipts stay in
  the governed local lane, while public projections reveal only
  profile-approved aggregate claims. A manifest proves declared participation,
  not the absence of hidden effects; provider assertions and local no-egress
  claims require separately sourced adapter and outer-boundary evidence. See
  09-audit-resilience-privacy.md §Candidate — model-input exposure plans.
  Exposure is a typed property of data edges on active primitives, roles, and
  linked supports, not a global mode. The operator may wire a group to local,
  remote, both as explicit stages, or neither; compilation intersects that
  choice with authority and Clean Room guards and displays each crossing and
  any resulting deficit.
  A candidate hybrid route uses deterministic parsing first, a bounded local
  model for fallible tags/associations and candidate WorkOrder/context-capsule
  derivation, then a remote model for only the approved complex episode. Existing authority gates still control dispatch. Derived metadata remains
  sensitive and provenance-bearing; a downstream request for more context
  creates another visible input edge rather than widening disclosure silently.
- **External target binding**: source and effect adapters expose a versioned,
  inspectable URL-builder contract and operation class without persisting the
  resolved target. Base URLs, tenant/workspace identifiers, route/query values,
  and credentials resolve only inside the authorized adapter from operator-owned
  local configuration; remote model prompts, portable/public artifacts,
  repositories, and public canonical logs receive neither the URL nor a
  reversible fingerprint. An explicitly authorized local processor may consume
  the resolved value transiently without persisting it. Public definitions may
  name the generic builder; binding availability and result class stay local
  unless the selected public profile permits a sanitized projection. Authorized
  local planning can inspect those local fields. A missing private binding
  renders the dependent capability visibly unavailable—a known
  deficit when intentionally accepted, not a target for the system to guess.
  An optional richer-evidence lane composes a pure value-wrapper with a separate
  authorized local-storage adapter. Only the latter performs I/O, into an
  operator-configured ignored location with explicit scope and retention;
  portable state records the capability and policy, never the local values or
  resolved path. An ignored path is an anti-commit guard, not a security
  boundary.
- **Repo registration**: a one-time read-only archaeologist episode produces a
  typed **RepoProfile** — commands (install/build/test/lint/format), local-app
  startup, branching/PR policy, environment authority, demonstrated architecture
  patterns. All later commands come from the profile. The **repo-native rule**:
  convention authority resides in the target codebase's demonstrated
  architecture, never in the model's training-set fashion.
- `WorkOrderTransport`: see domain model. The fake deterministic executor is a
  first-class adapter and ships first.
- `VerificationAdapter`: claim-typed evidence (visual claim → rendered-image
  check; network claim → trace; state claim → DOM/store read), recorded into the
  workstream's AcceptanceEvidenceMatrix. **Baseline first (Live Witness)**:
  before any change, an episode runs the current base branch and reproduces the
  defect (or walks adjacent behavior for a new story), preserving baseline
  evidence; honest non-reproduction is recorded as an environment limitation,
  never faked. Defects and stories run dual workflows (reproduce → root-cause →
  failing regression evidence → repair, vs. understand → define observable
  behavior → tests/mocks → implement). Evidence is typed: mocked-client proof
  (labeled synthetic fixtures, AC-mapped) never counts as live-integration
  proof. Verifier episodes are **blinded** from the implementer's narrative; the
  implementer never certifies its own work. Verification ("does it work?") and
  review ("is this the right implementation to maintain and ship?") are
  **separate independent episodes** — the reviewer reports findings, may not
  silently rewrite the branch, and its minor suggestions never auto-expand
  scope.
- `DeliveryAdapter`: PR/patch/report generation _from artifacts, not narrative_
  — the deliverable body is generated from the StoryContract, the actual diff,
  the completed AcceptanceEvidenceMatrix, and evidence refs. "Deliverable-ready"
  is an explicit conjunction checklist (current source revision, explicit
  contract, no unresolved material ambiguity, reproduced baseline, repo-native
  implementation, no unexplained scope, tests/build/lint, live behavior walked,
  visual claims visually inspected, every AC evidenced, independent verification
  and review, final diff read, grounded body, monitored loop) — no single
  passing signal is ever "done". Post-submission loop ownership: CI failures
  deterministically classified before any repair dispatch, review comments
  triaged by type, upstream source drift watched (revision guard) until a
  human-controlled terminal state. Projection boundary enforced: no internal
  vocabulary in external artifacts.

## Operator-presence policy

Presence changes the resource mix, never safety — safety is a lexicographic
precondition (ObjectiveContract ordering), and the lists below rank attention
among already-safe actions. Present: foreground intent > support > bounded
maintenance > exploration. Absent: safety > finish bounded work > entropy
reduction (the 5S organism) > proposals > research > NoOp when expected value
goes negative. Each candidate action has its own U(a,t) = Benefit − Risk −
Disruption − OpportunityCost; the sow/reap ratio (~1/3 research, bounded
execution windows, Double Dutch entry/exit) paces the cycle. Unattended work is
reversible, evidenced, and independently verified.

## Corpus policy

`docs/intake/` (gitignored) holds raw material; committed docs are synthesized.
Structure for growth: `corpus/sanitized/` (git-eligible), `corpus/fixtures/`
(minimized regression cases), `corpus/manifests/` (hashes, provenance,
retention), local-only raw layer. Transcript-handling policies are explicit and
inspectable per episode: verbatim-local / encrypted / scrubbed / summary /
expiring / excluded-from-learning. Verbatim-with-scrubbing is the default —
sources regenerate summaries, never the reverse.

## Learning loop

Every episode records governed references or classes for its loadout version,
work-order identity and source revision, model/runtime configuration, planned
input edges, tool events, artifacts, Git state, evidence, duration, resource
use, retry behavior, human rework, and outcome. Values appear only when the
selected local/private/public policy permits their destination and retention;
raw inputs, credentials, resolved targets, and unrelated context are excluded
by default. The system
learns at the _controller_ level: which topology per task class, which patterns
activate usefully, when to stop researching, how much verification is warranted,
which feedback units are dead/redundant/conflicting/overfit. Identity updates
are versioned proposals gated by replay/sandbox evaluation. Two flywheel modes:
retrospective grading, and the predict-then-score variant (register hypotheses,
watch which come true, at what timescale). Surfacing is exception-driven: once a
rule is reliable, conforming events stop deserving operator attention; watchers
surface the exceptions.
