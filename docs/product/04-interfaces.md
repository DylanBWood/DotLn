# Interfaces — the isomorphic views

**Status:** target interface contract. The `v0.2.0` baseline ships the CLI
timeline and zero-asset glyph scene only; the complete terminal control surface,
web/spatial console, editable equivalent views, replay UI, and build inspector
remain planned unless a section explicitly says otherwise.

These are capability contracts, not mandatory screens for every private DotLn
implementation. When an implementation declares an editable-view, projection,
inspection, history, or replay capability, the corresponding laws below bind
that surface. An implementation may omit a rich inspector or UI and must then
declare the capability absent rather than imply that the surface exists.

One normalized program; an **open-ended, increasing** set of equivalent views
(the set is extensible by design — an operator nuance, not a fixed list).
Editable views satisfy round-trip laws: `decode(encode(x)) = normalize(x)`;
equivalence is provable by `semanticHash(normalize(compile(view)))` equality;
operational equivalence is testable: the same normalized program, state, event,
and seed produce the same decision. Views that can't satisfy this (narrative,
animation) are _labeled_ lossy projections with a mechanics inspector one click
away.

### Editable-view v1 normalization and semantic hash

WO-008 ships exactly three editable representations: the typed code DSL, a
function table, and statechart JSON. Each is a complete representation of the
same `LoadoutGraphV1`, not a pointer to a separately authoritative graph. The
code DSL wraps a typed definition; the function table carries one keyed row per
graph node; statechart JSON separates identity/role/resources from the equipped
state without changing ownership of those values. Type names carrying a `V1`
suffix in this section follow the editorial convention of 02-domain-model.md
§LoadoutGraph v1 payload contract; `@dotln/compiler` exports them unsuffixed.

For each view, `encode` first applies that view's `normalize` and writes
canonical JSON; `decode` validates the view discriminator and schema version,
reconstructs the graph, and normalizes it. Therefore the executable law is
`decode(encode(x)) = normalize(x)`. Normalization recursively orders object keys
and canonicalizes set-like collections: component catalogs by component id,
links by link id, link groups by group id, function-table rows by row kind and
key, behavior tags, required capabilities, conflict ids, and component
references. It removes duplicate members only from collections declared
set-like. WorkOrder prose lists retain their declared order. Most importantly,
`ExplicitPipelineV1.orderedSupportFacetIds` retains both order and multiplicity;
normalization never turns a pipeline back into an unordered link set. Compile
applies order-sensitive support transforms in that declared order, including
repeated support ids; ordinary link order remains semantically inert.
Every numeric value must be finite JSON data; normalization maps negative zero
to zero, while a non-finite value is rejected before encoding or compilation.

`compile(view, environment)` reconstructs and normalizes `LoadoutGraphV1`, runs
the four composition steps, and returns either typed diagnostics or a normalized
`CompiledProgramV1`. The explicit environment contributes capability truth,
repository, and base commit. The successful program contains phenotype,
WorkOrder, AuthorityEnvelope, cadences, guards, schemas, hooks, verification
plan, prompt residue, per-support costs, resources, ambient declarations,
explicit pipelines, effective claims, component manifest, inspection data, and
conflict trace. Winning `authority.<effect>` claims are applied to the emitted
AuthorityEnvelope and WorkOrder operation lists rather than existing only as
trace prose. Compiler v1 rejects wildcard authority patterns rather than let a
broader losing pattern silently override an exact winner.
It never includes source-view formatting or a view name.

`semanticHash(normalize(compile(view)))` is the literal string `fnv1a64:` plus
the 16-digit lowercase FNV-1a-64 digest of the UTF-8 canonical-JSON bytes of the
entire normalized `CompiledProgramV1`. The digest is a deterministic semantic
equality key, not a cryptographic integrity or authenticity proof. Diagnostics
are not hashable programs. Any executable or declared-cost field in the compiled
program participates; whitespace, object insertion order, and set-like source
ordering do not. The Seiri fixture's code DSL, function table, and statechart
JSON all currently produce `fnv1a64:9ca8d0229c6bd8db`, while a changed objective
or an unequipped support produces a different program and digest.

## Terminal first, console equal

This section specifies the author's reference interface profile. The terminal
is a complete control surface; the web console invokes the same
commands against the same state machine ("the UI is not a second implementation
of the workflow"). **Input is welcome at any length.** Rambling is a feature,
not a failure mode: a ten-paragraph dump of wants, warnings, references, and
past failures is high-density intent data — preserved verbatim per corpus
policy, compiled down to typed workstreams and WorkOrders. Verbose judgment in;
terse receipts out. The canonical _acknowledgment_ is the **fire-and-forget
receipt**: DotLn answers with one compact receipt (workstream id, repo + base
commit, captured source revision, authority checklist ✓/✗, current state,
"operator input required: none") so the operator can continue the creative work
or walk away.

The interface objective is not merely low-friction throughput. It is to improve
the conditions in which the operator can remain in a genuine flow state: keep
the idea and implementation direction mentally present while DotLn carries the
supporting procedure. DotLn cannot detect or certify that psychological state,
but interface evaluation can observe the costs that repeatedly break it—context
restatement, avoidable interruptions, manual coordination, status polling,
recovery ceremony, and decisions presented without enough information to act.
Reducing those costs is a product outcome only while the authority, evidence,
privacy, and recoverability capabilities selected by this profile remain
intact.

**Interruptions arrive only as decision packets** (conflict, current behavior,
lettered options, recommendation + rationale, impact of waiting), and only under
the six materiality conditions: (1) material product ambiguity — interpretations
materially change user-visible behavior, contracts, security, or scope; (2)
authority expansion needed; (3) architecture with future cost; (4) missing
access; (5) contradictory evidence; (6) a non-converging or
negative-expected-value continuation. Everything else resolves without
interrupting the operator, while remaining inspectable, in order from: source
history → current app behavior → code and tests → related work → repo
conventions — proceeding when the choice is local, reversible,
behavior-consistent, and documentable as an assumption. The never-ask list:
"should I run the unit test / start localhost / read the attachment" are already
dictated by the loadout and state machine and must never surface (Principle 6).

This host-owned interruption policy plus its projection is the reference
implementation's candidate
**attention interface**: every interruption says why attention is required now,
the exact decision, evidence, recommendation, safe default, impact of waiting,
and what authorized work can continue. It is not the domain model's
mechanism-activation `AttentionPolicy`, a resident coordinator, or a model of
the operator's psychology; corrections may propose versioned policy changes but
never mutate interruption behavior silently.

When `PresencePolicy` is equipped, its inspector uses four tracks rather than
one autonomy score: attention priority, work-scope budget, effect authority,
and observed external capability. It shows the source grant, recorded trigger,
current tranche, active window, ceiling, and stop/reset/replenishment behavior.
A work-order portfolio separately shows which orders are eligible, optional,
selected, active, or blocked; selection never masquerades as authorization.

### Candidate — exact operator command vocabulary

The fourth Westworld-derived shape is a reserved vocabulary whose exact phrases
put the operator in deterministic control of an interaction mode. The wording
is part of the command identity, not flavor text to paraphrase. The first
operator-supplied token is exactly `analysis:`. It requests an inspectable,
evidence-backed analysis artifact or analysis-only episode; it does not promise
disclosure of a model's private chain-of-thought. The remaining Westworld
phrases stay as explicit empty slots until the operator supplies them or an
authorized source pass records their exact text—remembered approximations do not
compile.

Each exact phrase maps to a typed intent with declared legal source states,
role, scope (message, episode, or workstream), expiry or exit, precedence,
receipt, and state transition. Unknown phrases and illegal combinations refuse
loudly. Existing `resume:` and `ideation:` dispatches demonstrate the mechanism
but are not aliases that dilute the Westworld lexicon. Within the operator-owned
workflow, a command may pause automation, replace a pending conversational
intent, or bind the next mode and actions exactly. It cannot by itself bypass
the active implementation doctrine: this repository's personal profile still
applies its Clean Room, permission, evidence, and external-effect rules. A
future owner-sovereign profile may define an authenticated doctrine-change or
owner-direct command, but no activation phrase has been supplied or selected.
Every projection shows the exact active command and the exact phrase that exits
it.

**The operator stays in the idea and judgment loop.** Hand-authoring identities,
patterns, and agent definitions via the reviewed-markdown workflow (proposed
changes as one syntax-highlighted document to read and shape) is a first-class
permanent path — the compiler accepts hand-written sources and never requires
the GUI. Assisted proposals and compilation may carry surrounding procedure, but
the operator chooses whether shaping that layer directly is part of their
desired creative work.

## `προτείνω` — prose as a world action

The operator-named first-party application, specified in
[`11-proteino.md`](11-proteino.md), turns the long-form input contract into a
playable loop. The operator observes a small persistent community, selects one
resident or a meaningful set, and writes at any useful length. Selection
expresses intended recipients; prose supplies the intervention. The app holds
the source through active interpretation and delivery, retains it according to
the selected source/history policy, and exposes its derived propositions,
delivery force, recipient set, comparison subjects, scope, duration,
uncertainty, and constraints without forcing every thought to match an already-
published pattern. A person or group can receive an intervention whose subject
is a relationship, activity, or event pattern; recipient and subject are not one
field by assumption.

When the chosen assurance/history capabilities are equipped, the world view can
overlay delivered, ignored, refused, misinterpreted, tried, adopted, adapted,
abandoned, and relayed paths. Each visual mark opens the retained evidence
behind it: intended and derived interpretation, participating temporary or
reusable mechanics, resident decisions, events, evaluated outcomes, and branch
comparison. These are inspectable derivations, not claims to read hidden
thought. Before/after views label correlation; controlled paired runs and first
divergence support stronger simulation-scoped claims. A profile without those
capabilities labels the overlays unavailable.

An activity may replace the general world controls with a purpose-built
projection while keeping the same selection, commands, canonical state, and
every history, authority, and replay contract the chosen profile equips. An
apparently usable affordance must be meaningfully interactive or visibly
unavailable. When history and replay are equipped, uncommon reactions may
remain surprising before discovery but become seed/version-addressed and
inspectable afterward. Exact preview timing, resident implementation,
intervention artifact, renderer, first scenario, and flagship profile remain
open.

## Plural UI hosts, one projection contract

DotLn may have several simultaneous UI hosts: the complete terminal, a
conventional application shell, spatial or simulation views, and later forms
that are not known yet. A Babylon.js host is a promising candidate for the
spatial/RPG/simulation projection, while an Angular host is the operator's
familiar candidate for a conventional application shell. Neither is the
canonical application. Each consumes the same normalized view models, commands,
semantic hashes, and any history or authority projections the selected profile
declares. An absent capability stays visibly unavailable; no UI host may grow a
second workflow state machine or domain truth.

Framework selection remains local to the projection and is decided when the
corresponding UI work order has representative evidence. If Angular is chosen,
the operator-fluent evaluation baseline is Angular with Prettier, NgRx, RxJS,
Ramda, Ramda Adjunct, and Transloco or an equivalent message-catalog system.
That list records fluency and desired ergonomics, not dependencies already
selected. The evaluation must account for bundle, type, maintenance, and
interoperability costs instead of adopting every familiar library by default.
User-facing strings belong in the chosen localization/message system from the
start so localization and removal of hardcoded UI copy share one mechanism.

A clean plain workspace is the default repository structure. Nx remains an
option only if later evidence shows that its dependency graph, caching,
generators, or task orchestration solve a measured problem better than the
simpler workspace. No current repository evidence establishes test speed as an
Nx adoption reason. Reported daemon reliability concerns remain a cost
hypothesis to reproduce with representative local and CI fixtures before the
choice. Any Nx proposal must bound its ownership to the UI subtree unless
whole-repository evidence justifies more, and must prove reliable
daemon-disabled and CI operation. Either way, the pure kernel and schemas remain
framework-agnostic and usable without importing the UI toolchain. Shared
contracts must permit an Angular shell and Babylon.js canvas to coexist,
exchange selection and command intents, and render the same underlying state
without either owning the other.

## RPG / Path-of-Exile view

The RPG rendering is the **default presentation skin for the operator's own
console** — a typed, compositional authoring language whose objects happen to
look like characters, equipment, and quests. Original terms stay canonical in
the IR and in external artifacts (workplace camouflage); the RPG manner is how
the operator chose to see and touch them.

- **Loadout = build.** Character (identity), class/ascendancy (archetype /
  operating doctrine), equipment slots (armor = constraints & verification,
  helmet = perception, gloves = tools, boots = cadence/initiative, belt =
  memory/cache, amulet = invariants, rings = communication/data policies),
  stance, buffs/debuffs, cooldowns, mana = token budget, stamina = tool/clock
  budget, party = topology, quest = task, save point = continuation, summon =
  disposable episode, loot = reusable artifacts, XP = evaluated history, zone =
  repo/worktree, respawn = fresh session from external state, companion =
  watcher/sidecar.
- **Sockets & links are the composition editor** (see architecture): active
  gems + support gems, tag compatibility, socket colors as optional behavior
  families (RED effect / GREEN sense-flow / BLUE thought / WHITE adapter),
  six-link composition budget, auras with visible reservation cost, Vaal skills
  as evidence-gated authority escalation, gem maturity/corruption as the policy
  lifecycle. PoE support names give the interaction-pattern vocabulary (fork =
  competing branches, spell echo = bounded repeat, unleash =
  accumulate-then-burst, cast-when-damage-taken = failure-triggered reactor,
  totem/minion = delegation...).
- **Clean Room is an active gem, not a maximum-rigor toggle.** Its locked
  boundary facet is always visible; one linked strategy shows whether the source
  is rewritten, shape-first synthesized, or preserved as an explicitly
  authorized direct draft. Additional supports show destination context,
  provenance and review depth, their evidence, and their real cost. Swapping a
  support previews the exact handling change; the UI cannot unequip the locked
  employer/secret floor or present extra ceremony as extra safety by itself.
- **Item tooltip anatomy**: original term + kanji header (Seiri / Sort / 整理;
  RPG title secondary), GRANTS / RESTRICTIONS / OBLIGATION / PASSIVE (activation
  condition) / PULSE (cadence) / INTERRUPT (cancellation); a view flipper cycles
  RPG ↔ business ↔ formal ↔ statechart ↔ code ↔ observed performance.
- **Build inspector ("Path of Building for organizations")**: click any behavior
  → full derivation from base + identity + role + items + supports + environment
  to effective result, conflict winners, per-support true cost, context
  reservation, observed outcome history. Honest status effects only (a 429
  debuff shows the real backoff timer). Rarity encodes provenance/scope, never
  power. Equipping shows the exact compiled diff before confirming.
- **Set bonuses compile to real mechanics** (the 5S set: 2/5 canonical-home
  proposals … 6S destructive-change gates), visibly arming and darkening with
  the actual state machine.

- **Saved builds are the default invocation path.** For normal work the operator
  never drags gems: episodes start from a saved build with task-conditional
  supports auto-activated (visual defect → visual witness; shared primitive
  touched → verify-all-consumers). The loadout surface exists for understanding
  and override, not clerical work.

## Semantic zoom

One continuous drill-down that never loses selection: Character → Item → Tactics
(statechart) → Function table → Code → Proof & History (raw events, semantic
hash, tests, lineage). Cross-highlighting: selecting an item lights its
statechart region, table rows, cadence, events, and compiled instructions. Edits
propagate bidirectionally through the IR (change the 20-minute pulse in the
rhythm editor → tooltip updates; unequip → transitions and permissions vanish
from the running program).

## Community build workshop

Sharing uses a compact build file, link, or copyable code that resolves to an
immutable `CommunityBuild` manifest. Opening one enters **Preview**, never
Install: the current local build and community build appear side by side with
cross-highlighted additions, removals, substitutions, dependency changes,
permission requests, costs, evidence, and semantic hashes.

The operator can remix it like a build planner:

- drag individual actives, supports, roles, evaluators, or workstream pieces
  into a scratch loadout;
- swap equivalent components and immediately see compiled-effect changes;
- save named variants or fork the entire build without losing provenance;
- run variants against shared fixtures or approved local replay slices;
- compare timelines, outcomes, evidence, resource use, and first divergence;
- promote only the winning pieces to a reviewed local version.

Sandbox state is visually unmistakable and cannot invoke live integrations.
Missing capabilities and rejected combinations remain visible in place rather
than disappearing. A one-click "Inspect Mechanics" path exists at every level,
from the whole community implementation down to one support contribution.

Public discovery, private team sharing, filesystem exchange, and air-gapped
import all use the same manifest and preview flow. Social metadata may help
discovery, but the primary review surface is always mechanics and evidence—not
screenshots, popularity, or persuasive descriptions.

An artifact can also be pasted into a lightweight IR verifier. Before Preview,
it reports artifact/schema identity, native runtime range, validation failures,
and available JIT-compatibility or AOT-migration paths. Historical builds keep
their requested component versions; inactive, emulated, substituted, lossy, and
blocking mechanics remain visible. A share code or generated string is a
portable projection of the immutable manifest, never an authority grant or a
replacement for provenance (10-ir-compatibility.md).

### External rule-source mapping preview

A user-supplied rule source opens in Preview before DotLn proposes an import or
connection. The source construct and each candidate DotLn mapping appear side by
side with detected semantics, fact/data bindings, fidelity, authority and
data-movement effects, evidence, unresolved fields, and first divergence.
Alternative cards may propose native materialization, a delegated-evaluation
adapter, or a non-executable reference projection; none is selected merely
because the system generated it. Discovery and Preview do not mutate the source.
An accepted import may create an inactive local artifact; source write-back,
synchronization, and local activation require separate authority.

For public rule catalogs, the preview foregrounds provenance, license,
jurisdiction, effective date, official status, and update channel. For private
relational rule stores, schema discovery is read-only and the interface shows
which metadata or records would cross the adapter boundary before asking for
access. Unknown or source-specific behavior remains visible instead of being
rounded into a familiar-looking generic rule.

## Suggestion and proposal review

Potential work may begin in conversation—chat, a GitHub Issue or Discussion, or
an in-application suggestion surface—without forcing a complete work order from
the first thought. Once mature enough for structured review, the same idea
renders as a proposal pull request over a normalized in-repo packet. GitHub is
the first collaboration projection, not a semantic dependency.

The review surface shows the observed problem or opportunity, provenance,
corroborating and dissenting evidence, alternatives, risks, duplicates,
uncertainty, proposed scope, and any candidate work-order draft. It separates
author-supplied evidence from independent evidence still required after
promotion by the author's proposal workflow. Another profile may expose an
owner-accepted or unverified disposition instead. Reviewers can request changes,
register, defer, reject, mark a duplicate, or send the candidate to
operator-authorized planning; each action retains its reason and lineage when
that history capability is equipped.

The authority distinction must be impossible to miss: **merge proposal** means
“keep this as a durable planning candidate,” while **promote to WorkOrder** is a
separate operator action that compiles official scope and gates. Neither a
persuasive discussion nor a green proposal PR may activate work by itself.

## Agent projection (the sparse twin)

Every state the human views richly also renders as a deliberately **sparse,
machine-facing projection**: one current assignment, one context capsule, a few
statechart-gated actions, one result form — token-budgeted by design, whether
rendered as a page, CLI output, or file. Never force an agent to parse an 80-row
dashboard; never let it see an action the current state makes illegal (gated
affordances, 03 §agentic core).

Agent-runtime skills are another projection of this sparse twin. An
implementation may ship Claude, Codex, or future-runtime skills that expose its
current WorkOrder, definitions, schemas, commands, and evidence protocol in the
native ergonomics of that runtime. Skills should be generated or validated
against the same contracts as the CLI and agent-facing screen; they never become
the canonical home of permissions or organizational semantics.

The onboarding view supports bring-your-own agents: select or describe a model
and harness, inspect detected capabilities, choose an implementation and role,
then preview the exact participation/coordination skills DotLn will download or
preload. The preview shows why each skill is present, its context and tool cost,
what contract it projects, what capability it requires, and when it expires.
Operators can export the same negotiated bundle for a remotely managed agent
without exporting implementation secrets.

During a team episode, the inspector shows the coordination surface as actual
links: which agents can exchange which typed messages, which communicate only
through the blackboard, who may delegate or cancel, and which handoff schema is
active. Removing a role or ending the episode removes its preloaded skills;
coordination affordances do not linger as ambient prompt text.

The terminal projection keeps workflow state glanceable without requiring the
operator to interrogate every agent. Its compact status region shows context
remaining when the runtime exposes it, current WorkOrder and phase, delegated
episode counts by running/waiting/finished/failed, and whether operator input is
required. Expanding the agent view shows each episode's role, assignment,
heartbeat or last transition, evidence destination, and parent relationship.
Unknown telemetry is displayed as unknown, never synthesized from silence.

DevEx phrases are also skill selectors. Entering `resume: verify` (or status,
next, fix, final-review, or release-close) resolves the durable control state,
validates the intent, and loads the smallest native role skill on demand. The UI
previews what will load and why. Release close remains a separate guarded
post-merge operation with narrow authority for the annotated tag and its
matching GitHub Release. Every intent remains usable through the CLI, so
skill-capable hosts gain lower context cost rather than a different workflow.

The build inspector also exposes a **runtime lowering view**. Select Claude,
Codex, or another discovered runtime to see how the same semantic build maps to
native agents, skills, hooks, permissions, tools, schemas, sessions, and host
mechanisms. Cross-highlighting runs both ways: selecting a DotLn support lights
every native primitive that realizes it; selecting a hook or skill identifies
the semantic obligation it serves. Missing, substituted, and lossy mappings are
visually explicit and participate in compatibility checks.

## Glyph system (visual prototype zero)

The operator's own emoji + Tailwind experiment is the seed: one base glyph +
composable CSS treatments = a zero-asset parametric icon system, and a visual
functional program that parallels gem links. Standard visual grammar: reduced
opacity = dormant; near-transparent = speculative/counterfactual/historical;
blur = uncertain/stale; red silhouette (text-transparent + text-shadow trick) =
blocking failure; sepia/grayscale = deprecated; inversion = adversarial stance;
rotation = phase change; horizontal mirror = semantic opposite; vertical flip =
died/failed; glow = urgency/authority; ghost copies = fan-out/lineage; scale =
escalation. Rules: canonical state decides, a pure
`projectAgentVisual(snapshot)` renders (CSS never decides behavior); typed
`GlyphVisualState` in the domain, CSS custom properties at the edge — never
Tailwind class strings in domain state; **motion means transition** (stable
state is calm; nothing jiggles idly); accessibility is first-class
(prefers-reduced-motion, aria-hidden decoration, sr-only equivalents for every
visual state — visuals are never the only channel). Semantic supports ≠ cosmetic
projections: you equip "Evidence-Bound", never "blue glow".

## Transmog

Renderer-agnostic `AgentVisualSpec` (baseActor, equipment, statuses, links,
aura, activity, opacity, orientation, motion) consumed by swappable skins:
Native Emoji (first), DotLn glyphs, SVG minis, Red Panda Workshop, Transforming
Robots, Commedia Stage, Plain Professional, Developer/Diagnostic. Skins change
appearance only — literal semantic transmog.

## Replay

When history and replay are equipped, every compatible view can be projected
from the event log and the interface becomes scrubbable: a timeline slider
replays spawns/despawns, ghost incarnations, links lighting, supports arming,
failures flipping glyphs, work products traveling, continuations as unfilled
paths, and the Watcher narrating at the edge. This answers "what is DotLn
doing?" without reading transcripts and gives Horizon 3 its counterfactual
comparison surface: run-orbs rendered side by side with parameter dials and a
first-divergence view. An implementation without retained history does not
offer this surface.

## Physical channel

Index cards are a legitimate authoring frontend (they already worked once); a
physical-card importer maps them to the IR. The magnetic-LED-whiteboard wish is
recorded as the ambient-display end state; the "living index card" (a movable
card that can pulse, equip, ghost, split, replay) is its digital form.
