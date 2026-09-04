# Architecture

**Status:** target architecture. The `v0.2.0` baseline implements the pure
kernel, JSONL-backed deterministic fake walking skeleton, and its projections;
compiler, real-worker, native verification, durable adapter persistence, and
console layers below remain planned unless a section explicitly says otherwise.
See the roadmap for their evidence gates.

The diagram below is the author's reference topology. Platform contracts make
its modules composable; an implementation that omits durable history, replay,
verification, or another module declares that capability absent rather than
silently inheriting the whole stack.

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
- deterministic composition and declared conflict-resolution machinery;
- authority, evidence, audit, and adapter interfaces;
- optional provenance, replay, and mechanics-inspection mechanisms;
- versioning and portability rules for definitions and accumulated history.

A DotLn implementation supplies the local secret sauce:

- workstream and artifact schemas;
- source and effect integrations;
- security policy, authority envelopes, audit/retention policy, and logging
  configuration;
- which platform mechanisms are hard, advisory, replaced, or absent, together
  with the implementation's conflict precedence and capability claims;
- identity, role, personality, pattern, active, support, loadout, and team
  definitions—including which versions are currently in use and in what
  combinations;
- evaluators, exemplars, feedback units, domain vocabulary, and presentation.

A platform mechanism is not active instance doctrine. Its shared contract says
what the mechanism means when an implementation declares or equips it; it does
not make the author's choice mandatory. The current repository must therefore
label both layers even while their code and documentation remain colocated:

| Concern           | DotLn platform supplies                                  | Author's personal implementation chooses                  | Another owner may choose                                        |
| ----------------- | -------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| authority         | effect vocabulary, regime interfaces, guards, inspection | scoped envelopes and explicit presence-policy transitions | standing or owner-direct pass-through authority, broader grants |
| outcome assurance | claim classes, evidence and verifier contracts           | evidence before `done` plus independent verification      | owner-accepted or explicitly unverified execution               |
| history           | event, retention, replay, and audit mechanisms           | append-only records and replayable decisions              | reduced/no retention and an absent replay capability            |
| source treatment  | composable promotion-policy vocabulary                   | the locked Clean Room build used by this repository       | a different source policy or no promotion mechanic              |
| warnings and risk | inspectable policy and capability projections            | conservative defaults and named approval boundaries       | advisory or suppressed warnings and accepted operational risk   |

The third column is binding here; it is not platform conformance. The fourth is
not implemented by this table. ADR-0006 records the boundary, ADR-0007 makes
presence a policy input with no universal direction, and both leave the
physical package split to representative implementation evidence.

Audit and resilience remain configurable local doctrine but compile through a
shared record vocabulary. The detailed audience, record-property, fidelity,
visualization, persistence, recovery, backup/DR, and privacy design space is
mapped in [`09-audit-resilience-privacy.md`](09-audit-resilience-privacy.md).

The boundary is architectural: instance definitions that cross a declared
interchange compile through public IR and ports and expose the semantics that
contract requires. An implementation with the rich inspection capability keeps
them visible to its build inspector; a private implementation may omit that UI.
They must not require private branches or special cases in the kernel.
Conversely, the core does not silently ship the author's preferred organization
as universal defaults. Starter packs may bundle the founding patterns, but
installation, activation, and inheritance are explicit and removable.

Portability target: an implementation can export its definitions and policy
history separately from secrets and raw protected sources, then load them on a
compatible DotLn runtime with the same semantic hashes. Whether workstream
events themselves move is a separate retention and sovereignty decision.

### Candidate — owner-sovereign implementation profile

“Owner-sovereign” is the working label, not a selected public name. An
implementation may offer an owner-controlled profile with deliberately
permissive DotLn policy. The owner can classify a rule as hard, advisory, or
absent; select a strict envelope, standing grant, or owner-direct authority
regime; remove repeat confirmations; accept unverified outcomes; and disable or
reduce retention, audit, and replay. The profile is not required to ship
preconfigured or active, and the author's personal implementation does not adopt
it merely because the platform can express it.

Three concerns stay separate in its eventual design. **Instance doctrine** says
which rules participate and at what strength. **Authority regime** says what
constitutes permission for an effect. Optional **risk acceptance** records that
the owner saw or suppressed a warning; it is neither permission nor evidence
that an effect was safe. A direct owner command may combine a doctrine change,
grant, and dispatch only if the chosen implementation defines that compound
operation explicitly rather than inferring it from forceful prose.

This profile can remove DotLn's own intervention controls, not controls outside
DotLn. A provider model may refuse an input, a harness or operating system may
deny an effect, and a destination may impose its own policy. A capability
projection, when the implementation exposes one, reports the observed boundary
instead of promising absolute capability. Likewise, disabling history is a
valid owner choice; an interface cannot offer replay unless history exists.

Open choices: owner identity, authentication, recovery and transfer; single-
versus multi-owner precedence; the resource domain the owner controls; standing
and wildcard grants; profile activation, persistence, visibility, export, and
revocation; whether a direct command atomically authorizes and dispatches; full
history erasure versus a deletion marker; package governance prerequisites;
provider/local-model selection; and the minimum declarations needed for
interoperability. No mode, schema, wildcard, UI phrase, or release is selected.

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
credential access. Every package offered through this interoperability surface
declares its content kind, semantic version, DotLn compatibility, dependencies,
requested capabilities, authority effects, prompt/context cost, runtime cost,
provenance, verification disposition, and evidence if any. Executable code
receives a visibly higher installation and review burden in the author's
assurance profile.

Distribution never implies activation. The flow is **discover → inspect →
resolve dependencies → preview compiled effects and requested permissions →
install pinned version → explicitly equip/activate in scope**. Updates create
new versions and a semantic diff. When replay/history is equipped, it retains
the exact historical version. Revocation prevents future activation without
rewriting any retained past events.

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
context/runtime cost, verification disposition and evidence if any, and the
exact compiled diff against a selected local build.

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
available coordination skill into every agent would send each one into every
map carrying the whole stash — as if it needed gear for every damage type when
the episode called only for cold resistance. In plain language, irrelevant
context would consume attention and widen the interaction surface before the
task began. Skills activate by tags, state, relationship, and capability; their
context cost is visible; expiry and removal follow the episode lifecycle.

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

#### Candidate — contributed execution pool

A person may contribute otherwise-unused model capacity without lending an
account or moving credentials into DotLn. The candidate would offer a bounded,
model-specific WorkOrder from an already reviewed eligible queue; the
participant claims it, runs it locally through their own harness and provider
relationship, and returns the patch, typed result, evidence, and actor
attestation through a pull request. The contribution remains untrusted input:
source-revision guards, path and authority limits, automated checks, independent
verification, and operator merge authority apply exactly as they do to local
work. Provider eligibility and terms are environment truth to recheck, never an
assumption encoded by the pool.

Capacity is a scoped, expiring resource signal, not a reason to invent work or
manufacture priority. A replenishing allowance can make an already-useful task
cheaper; unused capacity is preferable to output that outruns review or evidence
integration.
Canonical WorkOrders and external pull requests use destination vocabulary,
transfer no provider access, and never claim that several subscriptions form
one shared account or authority envelope.

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

| Layer                      | Responsibility                                                                                                                                                                                                     | Boundary                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| model                      | supplies inference, judgment, or generation inside an episode                                                                                                                                                      | owns no durable identity, workflow state, authority, or evidence                                                                    |
| harness                    | constructs immediate context; exposes and mediates tools, local memory/compaction, session lifecycle, permissions, and structured I/O                                                                              | does not own the cross-episode workstream or make tool availability into authority                                                  |
| orchestration / DotLn host | compiles WorkOrders and loadouts; selects actors, topology, runtime, transport, and environment; owns routing and any equipped joins, cancellation, retries, cadence, leases, outbox, evidence gates, and recovery | may lower choices into model- or harness-native mechanisms but cannot manufacture capability or authority under the selected regime |
| `WorkOrderTransport`       | carries an order to an actor and returns its result envelope                                                                                                                                                       | says how dispatch crosses a boundary, not where execution occurs or what it may affect                                              |
| execution environment      | supplies the observable process, filesystem, network, secret, device, resource, and teardown boundary                                                                                                              | containment is neither task authority nor proof that a result is correct                                                            |

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
declared mechanism, compilation reports the missing capability, selects an explicitly
approved adapter or weaker labeled projection, or rejects the build. It never
silently moves a hard rule into prompt prose.

[LangGraph's JavaScript overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
describes it as a low-level orchestration framework/runtime for durable,
stateful graphs that may mix deterministic and model-driven steps. It is the
first named **accommodation probe**, not a selected DotLn dependency or a
replacement ontology. A future fixture may compare a pure TypeScript reference
execution with a LangGraph lowering for continuation, persistence, interruption,
cancellation, replay, and typed results. The normalized Program and every
history, authority, semantic-hash, and evidence contract declared by the
fixture remain authoritative; vendor checkpoint or graph state does not
silently become canonical state.

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

Skills may improve discoverability and ergonomics but cannot enforce a declared
hard rule by themselves. Equipped permissions, guards, validation,
persistence, and replay mechanisms remain below the skill layer. An agent
without a convenience skill can still participate through the protocol; an
agent with a persuasive skill gains no authority beyond the implementation's
selected regime.

The marketplace's useful quality signals are evidence-bound: compatibility
tests, reproducible fixtures, observed activation history, false-activation
rate, security review, maintainer provenance, and agreement with the local
operator in the relevant domain. Downloads, stars, rarity, persuasive copy, and
visual polish never confer authority. An implementation may maintain its own
allowlist, fork any definition, or prohibit remote packages entirely.

**Decomposition rule:** many bounded machines — one per task, episode,
workstream, maintenance cycle — communicating through events. Never one
statechart containing every actor, timer, and tab.

**The reference host:** the author's minimal local control-plane process owns
the kernel loop and its equipped store, outbox, lease expiry, cadence firing,
and worker spawning. It stays alive across model-session death, rate limits,
crashes, and network loss. An implementation that omits persistence does not
claim this recovery behavior.

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
never widens an authority envelope. In the author's assurance profile, an
isolated worker's output remains self-reported until an independent verifier
accepts it; another profile may accept it only under an explicit unverified or
owner-accepted disposition.

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

### Candidate — opinion cohorts and sealed adjudication

The Additional Opinion candidate is an inner controller around an
episode-producing stage, not a literal replay of that stage's outer lifecycle
transition. While a cohort is open, the controller may dispatch another peer
episode against one immutable subject snapshot or seal the cohort and continue.
Activation, authority grants, completion recording, destructive effects,
publication and release close, and adjudication itself are ineligible: repeating
those edges could duplicate effects or manufacture authority. Compatibility
requires a frozen comparable subject, a typed result, finite resource and stop
bounds, and a declared adjudication route.

The likely lowering is Invoke/Await under a collect-all `Program.All`-shaped
join, with timeout and partial-result policy explicit in the continuation.
`Program.All` is grammar-only and deferred in the current kernel; this candidate
cannot claim executable cohort joins until a later runtime implements and tests
that semantics. `Program.Race` is wrong when a fast result must not erase
minority findings.
Every intentional repeat receives a new command and episode id under one cohort
correlation id, so command-delivery deduplication remains intact. Failed,
cancelled, timed-out, duplicate, invalid, stale, and late results each retain a
disposition; none becomes a negative vote or silently disappears. A cohort seal
freezes the admitted input ids. An adjudicator retry may be idempotent over that
sealed input set, but cannot reopen collection.

The reduction path is ordered because its operations do not generally commute:
validate subject/schema/integrity → apply hard constraints and evidence gates →
normalize and fingerprint → cluster duplicates without dropping provenance →
construct agreement and conflict relations → optionally synthesize →
adjudicate. The reducer emits a compact decision packet plus references to every
input, exclusion, duplicate cluster, and unresolved dissent. Filter and quorum
decide eligibility or when to stop collecting, never what is true. Adjudication
is a separate role and authority; it cannot turn repeated support into wider
scope or let a majority overrule a supported blocking finding.

For verification, a sealed adjudication has only the existing `fix` or `final
review` downstream routes. For implementation alternatives, the cohort snapshot
pins the shared request and base while each result pins its own produced
artifact. Adjudication selects one artifact, materializes a verification
snapshot for that exact result, and sends it to the independent-verification
gate, or rejects/routes the work for repair; it cannot skip verification.
Combining candidate patches creates a new artifact and verification subject and
therefore stales prior candidate evidence. A post-fix cohort gets a new identity
and snapshot rather than reopening the sealed cohort.

Each mutating implementation alternative starts from the same pinned base in a
different branch and worktree, with one writable agent per worktree. The
work-order branch remains the single integration/control branch. A separately
authorized integrator selects or constructs the canonical candidate, then
re-runs evidence on it. Read-only evaluators may address the same immutable Git
object, but separate snapshots are the safe default when builds, tools, or
report creation write locally. Workers never merge their local control logs; a
single host-owned recorder serializes typed result envelopes into canonical
state. This is required until the event store has transactional multi-writer
support, and remains a useful ownership boundary afterward.

Current resume control v1 implements none of these cohort events or legal
actions. A later schema must represent the cohort policy, frozen subject,
opinion ids and attempts, actor attestations and visibility mode, pending and
completed counts, seal, adjudication packet, and downstream route; every strict
reader must migrate together because unknown events deliberately fail closed.

## Composition system

The first personal implementation's LoadoutGraph (see domain model) is compiled
per episode. The platform exposes declared precedence and conflict checking; the
nine-level ordering below is this implementation's profile, not a hidden kernel
constant:

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
optional payload-observation support is linked to that data path. In the
personal profile, required data-minimized authority, command, and result receipts
remain higher-precedence evidence and cannot be unequipped. Another
implementation may omit that assurance capability rather than inheriting it; its
manifest then cannot claim the corresponding receipt or replay behavior. A local
execution receipt binds one invocation to the compiled manifest and
transformation versions. The pure transform subgraph proves its mapping for
declared inputs; adapter evidence proves the effectful invocation; an outer
capability boundary and independent evidence are still required to rule out
undeclared side effects when an implementation makes that negative claim.

### Candidate — pinned artifact identity

The author's personal implementation should close the smallest missing half of
that receipt before its first out-of-process worker. A successful equip records
a `payloadVersion: 2` equip shape and schema-v1 artifact identity in the
append-only log: the compiler contract and package versions, the existing
whole-program semantic hash, and separate, domain-labeled definition hashes
correlated by each participating manifest entry's `(componentKind,
componentId, version)` tuple. Later decisions that consume a recompiled program
compare against the pin and either reference it in their durable trace or fail
closed with a typed refusal. Historical payloads without the discriminator
remain replayable and visibly `unavailable`. Before extending such a log, the
host appends an idempotent `ArtifactIdentityEnforcementStarted` boundary; past
that boundary an unavailable state refuses program consumption until a v2
re-equip. A compiler diagnostic becomes evidence rather than an exception
escaping replay.

The two identities answer different questions. `semanticHash` remains equality
of normalized compiled behavior. A component definition hash identifies the
normalized source definition that participated and stays outside that semantic
preimage, so otherwise inert source metadata does not silently become runtime
semantics. Both may use the existing FNV-1a implementation with independent
cross-check vectors, but neither is a signature, a uniqueness guarantee, an
authenticity proof, or protection against a writer who can replace both source
and pin.

This is an optional platform mechanism equipped by the author's profile, not a
checkpoint every DotLn core must impose. Per-effect or per-pulse component
submission, membership proofs, Merkle structures, and signing wait for a real
submitter and trust boundary: the first out-of-process worker can echo the
whole-program pin, while a non-author build or external principal would supply
the evidence needed to decide whether key ownership is worth its cost. WO-029
owns the bounded pin-and-compare slice; it must not claim those deferred
assurances.

The author's Clean Room is the first explicit source-promotion active built from
this shape. Its employer/secret boundary compiles as a locked safety guard
inside that mechanic and is mandatory for this repository, while linked
supports select a source-treatment strategy and add destination or assurance
checks. Rewrite, shape-first synthesis, and direct-draft fidelity do not
commute, so this implementation's compiler accepts exactly one of them or an
explicit ordered pipeline; it never treats them as an unordered bag. A
destination may require particular assurance supports, and a missing or
conflicting requirement renders the active inactive with the reason visible.
Increased review depth can only narrow promotion or add evidence within this
profile, never convert a blocked source into clearance.

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

### First live Entropy Reducer use

The current [operator guide](../instance/entropy-reducer/README.md) dispatches
this compiled loadout through a separate Fable 5.1 `max` session. It names
subject freezing, per-operation authority, new receipt IDs, output validation,
blinded refutation, and operator disposition as manual host duties. No resume
action or automatic launcher is implied. The 2026-09-04 analogy correction is
an explicit dispatch instruction pending a versioned correction to the typed
Shape-First support; the shipped residue and old run remain historical truth.

WO-023 ran the first compiled Entropy Reducer as a read-only implementation
review over a frozen scratch subject. The pinned Fable reviewer returned seven
findings and one non-authoritative proposal payload; a fresh blinded Fable
episode received only finding IDs and reproduction commands or inspection
steps, and all seven findings survived. The implementation repaired them before
requesting independent lifecycle verification. The tracked repository and
control status were byte-identical across both episodes, and the only scratch
delta was ignored build output from the review episode.

The proposal payload was retained in the run receipt but not filed: review and
refutation had no proposal-promotion authority. WO-029 reached
`docs/work-orders/` only because the operator separately opened ideation and
explicitly authorized a direct draft during WO-023. That direct-to-work-order
path is a recorded bootstrap exception, not reviewer self-promotion and not the
normal proposal pipeline.

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

**Control-time migration (2026-09-04, WO-028):** new control events carry
optional `recordedAt`, the host wall-clock time at append in UTC with
millisecond precision and a trailing `Z`. It is the record/ingest milestone,
not kernel `EventEnvelope.occurredAt`. Schema version remains `1`; historical
absence is valid. A malformed present timestamp refuses before log append and
at fold with its ordinal. Lifecycle legality and checkpoint advertisement use
append order alone, including when valid timestamps run backwards.

`status --json` exposes the latest event's `recordedAt` (`null` if absent) and
`elapsed`: the latest completed attempt of each phase in the current order,
keyed by `implementation`, `verification`, `repair`, and `finalReview`.
Endpoints are activation/readiness, verification request/completion, repair
request/completion, and final-review request/completion. A value is the signed
endpoint difference in milliseconds, or `"unknown"` if either endpoint lacks
time. A retry retains the preceding completed value until it completes; a new
activation clears the entries. These are not summed attempts, live timers, or
measurements of model work or operator attention. Negative values expose clock
regression rather than repairing it. `current.md` renders the same values and
uses `unknown` for an absent latest timestamp.

`npm run resume --silent -- times` emits a read-only JSON observation, one line
per event in append order, labeled `recordedAt`,
`recovered-from-local-checkpoint-ref`, or `unknown`. Only an event's named
local checkpoint commit may recover its missing time; a missing ref, wrong
scope/type, or recorded-SHA mismatch refuses without partial output. Recovered
committer dates have second precision even though normalized UTC displays
`.000`. Recovery does not feed phase durations or rewrite the canonical log.
The dated [activation observation](../discovery/control-event-times-2026-09-04.json)
contains 135 events: 120 recovered from 120 local refs, 15 unknown, and none
with a recorded append time. Those refs remain unpushed; the observation keeps
their time evidence portable without publishing their checkpoint objects.

This repository deliberately publishes timing in its public control profile,
as it already publishes commit dates. The optional field lets a stricter
profile omit timing or derive a bucketed/delayed public observation with that
loss of fidelity disclosed; emitted values must still satisfy the timestamp
contract. This migration adds no token, cost, attention, or other private-lane
telemetry and does not backfill old events.

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

  | #   | Injection                                     | Expected outcome                                                                                                                                                                                                                                                                          | Required by |
  | --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
  | 1   | Crash after command persist, before dispatch  | Restart finds the pending command via replay and re-dispatches; no duplicate effects (adapter dedups by commandId). If a reordered log presents its result before its persist, replay retains the orphan result and completes on persist with `result / preceded-persist`, never pending. | v0.1.0      |
  | 2   | Crash after effect, before result persist     | Command remains pending; recovery re-queries or re-dispatches idempotently; never double-applies                                                                                                                                                                                          | WO-009      |
  | 3   | Duplicate result event                        | Second delivery ignored deterministically (commandId); state unchanged; trace records the dedup                                                                                                                                                                                           | v0.1.0      |
  | 4   | Result after authority expiry                 | Event is persisted (it happened); reactor decides quarantine/NoOp with trace naming the expired envelope; payload causes no state mutation                                                                                                                                                | WO-009      |
  | 5   | Operator-return racing a queued cadence pulse | The already-queued pulse is processed, but its guard re-evaluates presence and decides NoOp-with-trace; future pulses cancel                                                                                                                                                              | v0.1.0      |
  | 6   | Interruption mid-episode (network loss, kill) | Lease expires; continuation + work order recoverable; a fresh episode resumes or a recovery episode inspects                                                                                                                                                                              | WO-009      |

  Without these, "offline-capable" is a slogan.

  Row 5 scope at v0.1.0 (pinned by WO-002's repair): the kernel's contribution
  is the pure guard — `guardQueuedPulse` re-evaluates presence through the
  predicate registry for a pulse the runtime has already dequeued, and its
  Decision _declares_ the NoOp-with-trace and the future schedule ids to cancel.
  Like every kernel Decision it performs nothing: queue ownership, event-sourced
  presence (`OperatorPresenceChanged` folded into state), and executed
  cancellation belong to the scheduler runtime that arrives with WO-009 and rows
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
  remote, both as explicit stages, or neither; the personal implementation's
  compiler intersects that choice with its equipped authority and source-
  treatment guards and displays each crossing and any resulting deficit.
  A candidate hybrid route uses deterministic parsing first, a bounded local
  model for fallible tags/associations and candidate WorkOrder/context-capsule
  derivation, then a remote model for only the approved complex episode. Any
  equipped authority gates still control dispatch. Derived metadata remains
  sensitive and provenance-bearing; a downstream request for more context
  creates another visible input edge rather than widening disclosure silently.
  **Candidate — source-addressed context projections.** A future transport may
  lower a WorkOrder into a neutral, pure `ContextProjectionPlan` over an
  explicit ordered section plan, already-loaded source bytes, the compiled
  role/loadout/authority, a runtime profile, and a declared budget. Its output
  names required, selected, and omitted references; exact byte/word counts;
  source and transform versions; capability lost by omission; and visible
  expansion handles. The objective, acceptance criteria, applicable settled
  decisions, constraints, non-goals, authority, required evidence, and output
  contract fail closed when they cannot fit; no hidden retrieval,
  summarizer, or tokenizer is smuggled into the word _pure_. The effectful host
  resolves files and records the exact bytes sent. A table of contents is the
  cheap source index for this selector, not a substitute for the selection and
  receipt boundary. Stable blocks may later be materialized while task-specific
  expansion stays on demand; JIT/AOT remains compatibility vocabulary. No new
  work order is warranted before a real WorkOrderTransport supplies context
  limits, serialization/tokenizer evidence, and a measured selective-reading
  failure or cost.
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
- `VerificationAdapter`: when equipped, claim-typed evidence (visual claim →
  rendered-image check; network claim → trace; state claim → DOM/store read),
  recorded into the workstream's AcceptanceEvidenceMatrix. The author's
  assurance profile requires this port and the rules that follow; another
  profile may instead expose an explicit self-reported, owner-accepted, or
  unverified disposition. **Baseline first (Live Witness)**:
  before any change, an episode runs the current base branch and reproduces the
  defect (or walks adjacent behavior for a new story), preserving baseline
  evidence; honest non-reproduction is recorded as an environment limitation,
  never faked. Defects and stories run dual workflows (reproduce → root-cause →
  failing regression evidence → repair, vs. understand → define observable
  behavior → tests/mocks → implement). Evidence is typed: mocked-client proof
  (labeled synthetic fixtures, AC-mapped) never counts as live-integration
  proof. In that assurance profile, verifier episodes are **blinded** from the
  implementer's narrative; the implementer never certifies its own work.
  Verification ("does it work?") and review ("is this the right implementation
  to maintain and ship?") are **separate independent episodes** — the reviewer
  reports findings, may not silently rewrite the branch, and its minor
  suggestions never auto-expand scope.
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

Presence and elapsed time are versioned policy inputs, not a fixed monotone
restriction. A declared `PresencePolicy` may independently transform attention
priority, work-scope budget, or effect authority from recorded events; external
capability is observed, never created. No declaration means hold, not automatic
growth or decay. Every transition names its source grant, event predicate,
stage, active window, ceiling, and stop/reset/replenishment behavior.

The current Repo Gardener fixture is deliberately narrow: while the operator is
away it ranks a bounded Seiri inspection, retains a no-deletion envelope, and
cancels future pulses on return. That proves one guard and return race. It does
not select a universal platform direction or the author's eventual personal
profile.

### Candidate — progressive absence authority and return readiness

The author's candidate profile keeps foreground intent first while present and
favors bounded housekeeping during absence because low-disruption cleanup can
reduce return-time reorientation. Per-action
`U(a,t) = Benefit − Risk − Disruption − OpportunityCost`, the sow/reap ratio,
and Double Dutch windows can rank eligible work without silently granting it.

Separately, the owner may preauthorize a progressive scope and effect-authority
schedule that grows by recorded stage, peaks within a declared ceiling, and
stops, resets, or loops on selected events. **Blackjack +3** is the working lens
for a candidate explicit progressive-stakes subgame rather than a decorative
metaphor; its deal, `+3`, stake, loss, unlock, cap, and reset rules remain open.
The inspector must show attention, work scope, effect authority, and external
capability as four tracks, including the current tranche and grant source.

Representative fixtures must distinguish a ranking-only change, a larger work
budget with unchanged effect set, a staged authority grant, a return/reset
race, a loop that replenishes without ratcheting past its cap, and an authorized
high-impact effect whose adapter remains unavailable or externally denied.

At work-order scale, the same policy may activate an opted-in unattended
portfolio. Small eligible orders inside standing authority can rank first;
larger orders enter only through explicit preauthorization and remain optional
when capacity permits. The portfolio policy, not silence, defines activation,
slot count, ordering, stop, pause, return, and replenishment behavior. Selecting
an order is still distinct from authorizing its effects.

## Corpus policy

`docs/intake/` (gitignored) holds raw material; committed docs are synthesized.
Structure for growth: `corpus/sanitized/` (git-eligible), `corpus/fixtures/`
(minimized regression cases), `corpus/manifests/` (hashes, provenance,
retention), local-only raw layer. When corpus retention is equipped,
transcript-handling policies are explicit and inspectable per episode:
verbatim-local / encrypted / scrubbed / summary / expiring /
excluded-from-learning. Verbatim-with-scrubbing is the author's
personal-profile default—sources regenerate summaries, never the reverse. A
different implementation may omit retained source and declare lineage or
regeneration unavailable.

For the current repository workflow, the main control-plane checkout's ignored
`docs/intake/` is the intended surviving raw source. A relative capture made
inside a work-order worktree exists only there: Git, checkpoints, stashes, and
the PR do not carry it. `npm run backup:intake` archives only the checkout where
it runs and provides a local snapshot, not reconciliation or later
discoverability. Until a helper exists, such a staged note must be backed up and
manually reconciled into the main intake before its worktree can be removed;
normal closeout refuses rather than deleting it.

Storage reconciliation and semantic reconciliation are different. Moving raw
bytes into the surviving store does not update the ledger or blueprint. The
`ideation:` pipeline and its receipt record that interpretation; a later raw
addition opens a new ideation or re-mining pass rather than silently mutating a
prior conclusion.

### Candidate — canonical private intake reconciliation

A small intake control should resolve one canonical private store independent
of the caller's worktree and expose capture, path, status, backup, and reconcile
operations. The initial store can be the main checkout's ignored intake; a
configured external store may later replace it without changing committed
source references.

Reconciliation needs a repository lock, NUL-safe enumeration, path and symlink
checks, private byte hashes, atomic no-overwrite copying, identical-file
deduplication, hard refusal on divergent path collisions, verified owner-only
backup in a trusted configured destination, and source removal only after a
recoverable canonical copy exists. Interrupted runs must always leave at least
one complete source. A private manifest maps opaque capture ids to canonical
bytes and synthesis receipts without printing raw content or filenames into
public control artifacts. Worktree close should name this operation explicitly;
a local ZIP by itself is not proof of reconciliation.

## Learning loop

In the author's assurance profile, every episode records governed references or
classes for its loadout version, work-order identity and source revision,
model/runtime configuration, planned input edges, tool events, artifacts, Git
state, evidence, duration, resource use, retry behavior, human rework, and
outcome. Values appear only when the selected local/private/public policy
permits their destination and retention; raw inputs, credentials, resolved
targets, and unrelated context are excluded by default. An implementation that
omits this history also omits history-dependent learning and replay claims. In
this history-equipped profile, the controller learns which topology per task class, which patterns
activate usefully, when to stop researching, how much verification is warranted,
which feedback units are dead/redundant/conflicting/overfit. In this profile,
identity updates are versioned proposals gated by replay/sandbox evaluation. Two flywheel modes:
retrospective grading, and the predict-then-score variant (register hypotheses,
watch which come true, at what timescale). Surfacing is exception-driven: once a
rule is reliable, conforming events stop deserving operator attention; watchers
surface the exceptions.
