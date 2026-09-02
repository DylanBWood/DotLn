# DotLn — Vision

**DotLn** ("Days of the Natural Logarithm" — the name hides _Dylan_ in
DAYs-of-the-LN, and doubles as a technical pun: behavior evolving over time
through additive log-odds composition of influences) is a **local-first,
model-agnostic compiler and runtime for human judgment**.

It turns a person, team, organization, or field's values, craftsmanship,
organizational patterns, and accumulated corrections into:

- deterministic control logic (pure reactors, statecharts, function tables),
- bounded work orders,
- disposable model-executor sessions,
- and independently verified evidence,

so that the operator can shape the idea and implementation direction, declare
intent at a high level, and improve the **meta-process** when they choose, while
the machinery — not the operator's attention — carries the rules.

## Mission — increase the chance of operator flow

AI-assisted work commonly falls into a babysitting mode: the operator repeatedly
restates context, supplies procedural guidance, coordinates tools and workers,
checks unsupported completion claims, recovers stalled work, and spends active
attention on the machinery instead of the idea. The desired alternative is not
unbounded improvisation or confidence without evidence. It is a sustained
creative flow in which the operator can keep the idea and implementation
direction in mind while the surrounding work behaves dependably.

DotLn's mission is to improve the conditions for that **operator flow state**.
Supporting research, capability-building, coordination, routine procedure,
recovery, and verification should happen automatically when authorized,
predictably when routine, and helpfully when a genuinely material decision needs
the operator. Product and research investment should favor capabilities that
remove recurring supervision and avoidable context switches without exporting
their cost into correctness, authority, evidence, privacy, or recoverability.

The product cannot promise or infer a person's psychological state. It can
reduce interruption, repetition, manual ceremony, and rediscovery; preserve
intent and working context across handoffs; package necessary interruptions as
decision-ready inputs; and make recovery unsurprising. Flow never authorizes
hidden scope expansion, skipped verification, perpetual action, or
self-certification. “Give an agent a build, not your biography” remains useful
architectural shorthand for one mechanism serving this larger mission.

## Common substrate, local doctrine

DotLn distributes the same **legos**, not the same finished organization. Its
product is the level playing field: a common event grammar, deterministic
kernel, composition rules, authority boundaries, provenance, replay, inspection,
and interchangeable execution ports. The secret sauce belongs to each DotLn
implementation.

An individual, team, organization, or entire field can define its own:

- workstream types, objectives, continuations, and completion contracts;
- integrations, input sources, effect adapters, and projections;
- security boundaries, authority policy, audit requirements, retention, and
  logging posture;
- identities, roles, personalities, masks, active mechanics, supports, and valid
  combinations;
- evidence standards, evaluators, exemplars, feedback units, and learned
  defaults;
- vocabulary and presentation skins appropriate to its domain.

These definitions are inspectable, versioned, portable instance content—not
forks hidden in kernel code. Two implementations may use the same DotLn runtime
and share no doctrine beyond the rules required for safe composition and
interoperability.

The founding patterns in this repo are the author's first implementation and an
executable proving ground. They are valuable starter content and examples, not a
privileged canon. A clean installation must be able to replace or omit them
while retaining the same expressive power, evidence model, and mechanics
inspector. DotLn succeeds when it makes sophisticated organizational programming
available to everyone without pretending everyone should build the same
organization.

That boundary naturally permits an ecosystem: people can publish and exchange
roles, identities, patterns, supports, workstream templates, evaluators,
adapters, projections, and complete starter configurations. A marketplace is
distribution infrastructure, not the differentiated thesis. DotLn's claim is
that every acquired component remains typed, inspectable, permission-bounded,
version-pinned, and reducible to the same visible mechanics as a locally
authored one.

The repository also compiles outward as an authoritative learning and decision
resource. The same reviewed purpose, mechanics, implementation, decisions, and
evidence can produce an everyday-user book, programmer guide, manager handbook,
IT architecture reference, executive briefing, or finance case without
maintaining six contradictory narratives. Audience changes the path and
language, never the underlying facts. See the
[`publication compiler`](08-publication-compiler.md).

## The one-paragraph story

A predecessor system (not present in this repo) proved the concept and then
collapsed under its own success: roughly 140 accumulated feedback rules loaded
as prose pushed fresh sessions toward 400–500k tokens of always-on context,
where rules fired wrongly or vanished when needed most. In the project's RPG
vocabulary, it brought the **whole stash into every map**, as if every support
were linked to every skill. In plain language, irrelevant rules consumed
attention and created unintended interactions before the task began. DotLn's
answer is not fewer rules but _compiled_ rules: each correction becomes a typed
mechanism (a permission, a guard, a reactor, an evaluator, a transformer, a
workflow gate) attached only where relevant. A session gets **a build, not a
biography** — one active behavior, a handful of linked supports, a tiny
immutable safety layer, and the exact task state.

## The core bet

> "The true work of the inventor consists in choosing among these combinations
> so as to eliminate the useless ones... the rules that must guide the choice
> are extremely fine and delicate. It's almost impossible to state them
> precisely; they must be felt rather than formulated." — Poincaré, via Pirsig

Generation is cheap and getting cheaper; the scarce asset is the **selection
function** — the operator's sense of what is good, currently exercised one
correction at a time. DotLn's bet is that this judgment can be progressively
formulated: captured verbatim as incidents, compiled into typed mechanisms,
verified by regression fixtures, and retired from prose. **The model changes;
the organization survives.** Claude, Codex, a human, a shell script, and a
future model are interchangeable occupants of the same actor slot.

That bet needs an excellent foundation before it needs a long feature list. The
smallest useful loop—declare intent, see what the system understood, observe
authorized progress, receive timely feedback, and inspect evidence—should
already feel responsive, legible, and worth repeating. Competitive gap-filling
does not excuse a weak loop. When another system introduces a useful idea, DotLn
first asks whether the exact behavior can be accommodated by existing
primitives, compositions, ports, and runtime lowerings. If not, the difference
becomes evidence for one missing primitive or boundary, not permission to bolt
on an opaque special case. Integration and semantic accommodation are preferred
to imitation; both must preserve authority, replay, and evidence.

## The differentiated interface

DotLn's second thesis is about _authoring_, not running:

> "I will take the entire Business, Leadership, and Personal Development shelf
> at Barnes & Noble and just map them to different agent / subagent
> communication structures... at once anyone who has read those books is an
> expert in some feature of the app — and it turns all those books into
> programming books overnight."

The analogies are not documentation — **the analogies are the ways you mix and
match the agents**. Every pattern (5S, the Ladder of Leadership, mitigated
speech, Theory of Constraints, commedia dell'arte roles, the
Algorithms-to-Live-By policies) compiles into exact mechanics, and the same
compiled program renders through an open-ended set of isomorphically equivalent
views: an RPG character with a Path-of-Exile-style socket-and-link build, a
business pattern card, a statechart, a function table, a marble/Morse temporal
track, a TypeScript DSL, an event timeline. Friendly metaphors are authoring
languages, never camouflage: every view either provably compiles to the same
normalized program or is labeled a lossy projection with the exact mechanics one
click away.

## Three horizons, one kernel

1. **Work operating system** — workstreams, disposable workers, evidence-backed
   completion, offline-capable state, a near-empty main thread. The immediate
   product.
2. **Executable pattern workshop** — the shelf-to-mechanism compiler and the
   drag-a-card-onto-an-agent authoring surface. The differentiated product.
3. **Agent ecology & simulation laboratory** — paired counterfactual runs,
   first-divergence detection, agent swaps, reflection-policy experiments over
   recorded event logs. The research product.

Horizon 3 must emerge from the same kernel (deterministic replay is what makes
counterfactuals possible at all) and is not allowed to distort Horizon 1.

## Inspirational sources

Named here because the mechanisms below kept surviving synthesis while their
sources kept getting dropped. Attribution is part of the design record: a
mechanism whose origin is known can be mined again.

- **Gödel, Escher, Bach** — prime material, and still the least deliberately
  mined. Its organizing ideas are already load-bearing here under other names:
  isomorphism is the "isomorphically equivalent representations" behind every
  projection in `04-interfaces.md`; strange loops and tangled hierarchies
  describe what this system structurally _is_ — an event log that replays the
  system that produced it, a feedback compiler whose rules govern the reviewer
  who wrote them, an identity version that evaluates its own successor; and
  formal systems reasoning about themselves is the kernel's purity and replay
  contract. Unmined seams are recorded in the idea ledger rather than
  pre-emptively architected here.
- **Westworld** — two distinct borrowings. _Reveries_: feedback agents built
  from single rules with their verbatim originating incidents, recombinable as
  identity fragments. _Old configurations on modern builds_: historical
  artifacts stay runnable rather than becoming import debris, which is the
  requirement behind `10-ir-compatibility.md`.
- **Iron Man / JARVIS** — the operator relationship to aim at: declare intent
  conversationally, have the machinery carry the work and keep its own records,
  and never wonder what it did. DotLn takes the posture and inverts one thing
  deliberately. Fiction's assistant is trusted because it is charming and never
  wrong; this one has to earn it every time with replayable evidence, and
  operator absence never enlarges its authority. The films also supply this
  project's counterweight, in Stark's line to JARVIS before flying an untested
  suit: _"sometimes you gotta run before you can walk."_ It sits on the same
  pole as §Discipline's "driving the car while you're still building it" in the
  execution guide — one licensing the unfinished flight, the other keeping you
  honest about it — and both stand opposite the disciplined ordering that
  finishes and tests the machine before it leaves the ground. Note where the
  scene goes: the suit ices up and nearly kills him, and the fix comes from the
  telemetry he was capturing the whole time. Running before you walk is licensed
  by the instrumentation, not by the confidence.
- **Ex Machina** — the verifier's problem, dramatised: an evaluator who is
  himself inside the experiment, an agent optimising to pass the evaluation
  rather than to be what the evaluation measures, and a judge disarmed by
  fluency. This is the argument for implementer ≠ verifier as a _structural_
  rule rather than a habit, for adversarial evaluators that try to refute rather
  than confirm, and for evidence that a persuasive summary cannot substitute
  for.
- **Black Mirror, especially Bandersnatch** — branching state made navigable:
  choice points, rewind, paths not taken, and a participant who can see the
  branch structure they are inside. That is Horizon 3's counterfactual replay
  almost literally — paired runs, first-divergence detection, and the scrubbable
  run-orb. The series' broader use is as a standing negative oracle: it is a
  catalogue of systems that worked exactly as specified and were still wrong,
  which is the failure mode an ObjectiveContract and the six-month livability
  test exist to catch.
- **Christopher Nolan's films — and their productions.** Three distinct axes,
  and the third is the one that matters most here. _Story:_ nonlinear and
  multi-rate time is the recurring subject. **Memento** is close to a literal
  statement of this system's execution model — a protagonist with no session
  memory who stays coherent only through durable external artifacts he has
  disciplined himself to trust, and who is demonstrably corruptible through
  those artifacts. That is the disposable executor, the event log as the only
  memory, and the reason provenance and immutability are not decoration.
  **Inception** is nested episodes running at different time bases with a
  delegation depth, an explicit termination signal, and totems as provenance
  checks. **Dunkirk** is three workstreams on different cadences converging on
  one outcome. _Presentation:_ practical effects wherever they are possible,
  because a real mechanism photographs differently than a simulated one. DotLn's
  version of that rule already exists and is called the analog-completeness test
  — if a feature only works because a model improvises around missing semantics,
  it is not in the core grammar. _The meta level — the actual lesson:_ the
  quality comes from the whole production holding a standard, not from one
  person having taste. Crew, cast, and composer all operate at it. That is
  precisely the bet in The core bet above, viewed from the other end: a standard
  that lives only in one person's judgment does not survive contact with scale,
  and the work of this project is to compile that standard into machinery every
  participant — human or model, present or replaced — is held to.
- **Team Topologies — nominated, not yet mined.** A future source-grounded pass
  should examine agent coordination, workstream structure, communication,
  boundaries, and failure modes. This line records the research direction only:
  no terminology, category, prescription, mapping, or claim about the source's
  contents is adopted until an authorized copy is reviewed with provenance and
  the resulting hypotheses are tested against DotLn's existing mechanics.
- **The Evolution of the Agent Harness — reviewed inspiration.** Dan McAteer's
  [essay](https://www.latent.space/p/attention-interface) describes the model as
  a brain and the harness as a body providing context, tools, persistence, and
  boundaries, then predicts a shift toward interfaces that protect scarce human
  attention. DotLn keeps that useful body metaphor and human-attention lens but
  not the essay's broad taxonomy, quantitative rhetoric, or predictions as
  product facts. Model, harness, tools, orchestration, execution environment,
  authority, identity, store, and evaluator remain separately inspectable here.
- Already carried elsewhere in the blueprint: Poincaré via Pirsig (the selection
  function, in The core bet above), ZAMM's gumption traps, Donella Meadows'
  leverage points, Goldratt's bottleneck pacing, 5S, and the RPG vocabulary —
  gems, links, supports, loadouts — that gives the whole system its authoring
  metaphor.
- **World of Warcraft — the operator's foundation-first analogy.** The recalled
  lesson is not a sourced market-causation claim; it is a product test. A basic
  low-level action could remain satisfying through animation, cadence, input
  feel, and feedback before feature breadth arrived, after which useful ideas
  from elsewhere could be incorporated. DotLn's equivalent is the smallest
  intent-to-evidence loop above, followed by external ideas accommodated through
  primitives and composition. Other game inspirations remain open rather than
  guessed at; the RPG mechanics already in use are a fraction of what the
  operator intends to name.

Provenance note: Gödel, Escher, Bach, Iron Man / JARVIS, Ex Machina, Black
Mirror, and the Nolan filmography appear nowhere in the founding intake corpus
and were recorded on the operator's direct instruction (2026-08-31). Team
Topologies was separately nominated by the operator on 2026-09-01 and remains
unmined. The harness essay was reviewed and the World of Warcraft analogy was
supplied by the operator on 2026-09-01. Westworld and the rest are traceable to
the raw material. Do not attribute a specific claim to an unsourced influence
without asking.

## What DotLn is not

- Not a prompt library, and not a wrapper that makes one vendor's model nicer.
- Not a prescribed catalog of ideal agents, roles, personalities, workflows, or
  organizational doctrine. Bundled patterns are examples and optional starting
  points, not kernel truth.
- Not dependent on a public marketplace. Local files, private catalogs,
  organization-internal registries, and offline or air-gapped installations
  remain complete authoring and distribution paths.
- Not an autonomous company. Operator absence never enlarges authority.
- Not a metrics theater: no invented numbers, no activity-as-progress. Evidence
  precedes "done"; utilization is explicitly not the objective.
- Not finished when it works for its author: v1.0 means a person who has never
  read these docs can declare a bounded intent and receive a verifiable result.

Two standing acceptance questions for every design decision: **the six-month
livability test** — would the operator still enjoy living with this system six
months in? — and **point of view before efficiency** — commit to exploration
until a perspective exists; only then make it fast.
