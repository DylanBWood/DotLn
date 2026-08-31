# Interfaces — the isomorphic views

One normalized program; an **open-ended, increasing** set of equivalent views
(the set is extensible by design — an operator nuance, not a fixed list). Editable views satisfy round-trip laws: `decode(encode(x)) =
normalize(x)`; equivalence is provable by `semanticHash(normalize(compile(view)))`
equality; operational equivalence is testable (same normalized program + state
+ event + seed → same decision). Views that can't satisfy this (narrative,
animation) are *labeled* lossy projections with a mechanics inspector one
click away.

## Terminal first, console equal

The terminal is a complete control surface; the web console invokes the same
commands against the same state machine ("the UI is not a second
implementation of the workflow"). **Input is welcome at any length.** Rambling is a feature, not a failure mode:
a ten-paragraph dump of wants, warnings, references, and past failures is
high-density intent data — preserved verbatim per corpus policy, compiled down
to typed workstreams and WorkOrders. Verbose judgment in; terse receipts out.
The canonical *acknowledgment* is the **fire-and-forget receipt**: DotLn
answers with one compact receipt (workstream id, repo + base commit, captured
source revision, authority checklist ✓/✗, current state, "operator input
required: none") and the operator walks away.

**Interruptions arrive only as decision packets** (conflict, current behavior,
lettered options, recommendation + rationale, impact of waiting), and only
under the six materiality conditions: (1) material product ambiguity —
interpretations materially change user-visible behavior, contracts, security,
or scope; (2) authority expansion needed; (3) architecture with future cost;
(4) missing access; (5) contradictory evidence; (6) a non-converging or
negative-expected-value continuation. Everything else resolves silently, in
order, from: source history → current app behavior → code and tests → related
work → repo conventions — proceeding when the choice is local, reversible,
behavior-consistent, and documentable as an assumption. The never-ask list:
"should I run the unit test / start localhost / read the attachment" are
already dictated by the loadout and state machine and must never surface
(Principle 6).

**The operator stays in the fun loop.** Hand-authoring identities, patterns,
and agent definitions via the reviewed-markdown workflow (proposed changes as
one syntax-highlighted document to read and shape) is a first-class permanent
path — the compiler accepts hand-written sources and never requires the GUI.
Automating that layer is explicitly out of bounds: it is the fun part.

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
  disposable episode, loot = reusable artifacts, XP = evaluated history, zone
  = repo/worktree, respawn = fresh session from external state, companion =
  watcher/sidecar.
- **Sockets & links are the composition editor** (see architecture): active
  gems + support gems, tag compatibility, socket colors as optional behavior
  families (RED effect / GREEN sense-flow / BLUE thought / WHITE adapter),
  six-link composition budget, auras with visible reservation cost, Vaal
  skills as evidence-gated authority escalation, gem maturity/corruption as
  the policy lifecycle. PoE support names give the interaction-pattern
  vocabulary (fork = competing branches, spell echo = bounded repeat, unleash
  = accumulate-then-burst, cast-when-damage-taken = failure-triggered reactor,
  totem/minion = delegation...).
- **Item tooltip anatomy**: original term + kanji header (Seiri / Sort / 整理;
  RPG title secondary), GRANTS / RESTRICTIONS / OBLIGATION / PASSIVE
  (activation condition) / PULSE (cadence) / INTERRUPT (cancellation); a view
  flipper cycles RPG ↔ business ↔ formal ↔ statechart ↔ code ↔ observed
  performance.
- **Build inspector ("Path of Building for organizations")**: click any
  behavior → full derivation from base + identity + role + items + supports +
  environment to effective result, conflict winners, per-support true cost,
  context reservation, observed outcome history. Honest status effects only (a
  429 debuff shows the real backoff timer). Rarity encodes provenance/scope,
  never power. Equipping shows the exact compiled diff before confirming.
- **Set bonuses compile to real mechanics** (the 5S set: 2/5 canonical-home
  proposals … 6S destructive-change gates), visibly arming and darkening with
  the actual state machine.

- **Saved builds are the default invocation path.** For normal work the
  operator never drags gems: episodes start from a saved build with
  task-conditional supports auto-activated (visual defect → visual witness;
  shared primitive touched → verify-all-consumers). The loadout surface exists
  for understanding and override, not clerical work.

## Semantic zoom

One continuous drill-down that never loses selection: Character → Item →
Tactics (statechart) → Function table → Code → Proof & History (raw events,
semantic hash, tests, lineage). Cross-highlighting: selecting an item lights
its statechart region, table rows, cadence, events, and compiled instructions.
Edits propagate bidirectionally through the IR (change the 20-minute pulse in
the rhythm editor → tooltip updates; unequip → transitions and permissions
vanish from the running program).

## Agent projection (the sparse twin)

Every state the human views richly also renders as a deliberately **sparse,
machine-facing projection**: one current assignment, one context capsule, a
few statechart-gated actions, one result form — token-budgeted by design,
whether rendered as a page, CLI output, or file. Never force an agent to parse
an 80-row dashboard; never let it see an action the current state makes
illegal (gated affordances, 03 §agentic core).

## Glyph system (visual prototype zero)

The operator's own emoji + Tailwind experiment is the seed: one base glyph +
composable CSS treatments = a zero-asset parametric icon system, and a visual
functional program that parallels gem links. Standard visual grammar: reduced
opacity = dormant; near-transparent = speculative/counterfactual/historical;
blur = uncertain/stale; red silhouette (text-transparent + text-shadow trick) =
blocking failure; sepia/grayscale = deprecated; inversion = adversarial stance;
rotation = phase change; horizontal mirror = semantic opposite; vertical flip =
died/failed; glow = urgency/authority; ghost copies = fan-out/lineage; scale =
escalation. Rules: canonical state decides, a pure `projectAgentVisual(snapshot)`
renders (CSS never decides behavior); typed `GlyphVisualState` in the domain,
CSS custom properties at the edge — never Tailwind class strings in domain
state; **motion means transition** (stable state is calm; nothing jiggles
idly); accessibility is first-class (prefers-reduced-motion, aria-hidden
decoration, sr-only equivalents for every visual state — visuals are never the
only channel). Semantic supports ≠ cosmetic projections: you equip
"Evidence-Bound", never "blue glow".

## Transmog

Renderer-agnostic `AgentVisualSpec` (baseActor, equipment, statuses, links,
aura, activity, opacity, orientation, motion) consumed by swappable skins:
Native Emoji (first), DotLn glyphs, SVG minis, Red Panda Workshop, Transforming
Robots, Commedia Stage, Plain Professional, Developer/Diagnostic. Skins change
appearance only — literal semantic transmog.

## Replay

Because every view is a projection of the event log, the whole interface is
scrubbable: a timeline slider replays spawns/despawns, ghost incarnations,
links lighting, supports arming, failures flipping glyphs, work products
traveling, continuations as unfilled paths, the Watcher narrating at the edge.
This answers "what is DotLn doing?" without reading transcripts — and it is
the same machinery Horizon 3 uses for counterfactual comparison (run-orbs — each replayed run rendered as one
scrubbable object with its parameter dials — with
parameter dials, side by side; find first divergence).

## Physical channel

Index cards are a legitimate authoring frontend (they already worked once);
a physical-card importer maps them to the IR. The magnetic-LED-whiteboard
wish is recorded as the ambient-display end state; the "living index card"
(a movable card that can pulse, equip, ghost, split, replay) is its digital
form.
