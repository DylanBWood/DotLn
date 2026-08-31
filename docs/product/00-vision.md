# DotLn — Vision

**DotLn** ("Days of the Natural Logarithm" — the name hides *Dylan* in
DAYs-of-the-LN, and doubles as a technical pun: behavior evolving over time
through additive log-odds composition of influences) is a **local-first,
model-agnostic compiler and runtime for human judgment**.

It turns a person, team, organization, or field's values, craftsmanship,
organizational patterns, and accumulated corrections into:

- deterministic control logic (pure reactors, statecharts, function tables),
- bounded work orders,
- disposable model-executor sessions,
- and independently verified evidence,

so that the operator declares intent at a high level and improves the
**meta-process**, while the machinery — not the operator's attention — carries
the rules.

## Common substrate, local doctrine

DotLn distributes the same **legos**, not the same finished organization. Its
product is the level playing field: a common event grammar, deterministic
kernel, composition rules, authority boundaries, provenance, replay,
inspection, and interchangeable execution ports. The secret sauce belongs to
each DotLn implementation.

An individual, team, organization, or entire field can define its own:

- workstream types, objectives, continuations, and completion contracts;
- integrations, input sources, effect adapters, and projections;
- security boundaries, authority policy, audit requirements, retention, and
  logging posture;
- identities, roles, personalities, masks, active mechanics, supports, and
  valid combinations;
- evidence standards, evaluators, exemplars, feedback units, and learned
  defaults;
- vocabulary and presentation skins appropriate to its domain.

These definitions are inspectable, versioned, portable instance content—not
forks hidden in kernel code. Two implementations may use the same DotLn
runtime and share no doctrine beyond the rules required for safe composition
and interoperability.

The founding patterns in this repo are the author's first implementation and
an executable proving ground. They are valuable starter content and examples,
not a privileged canon. A clean installation must be able to replace or omit
them while retaining the same expressive power, evidence model, and mechanics
inspector. DotLn succeeds when it makes sophisticated organizational
programming available to everyone without pretending everyone should build
the same organization.

That boundary naturally permits an ecosystem: people can publish and exchange
roles, identities, patterns, supports, workstream templates, evaluators,
adapters, projections, and complete starter configurations. A marketplace is
distribution infrastructure, not the differentiated thesis. DotLn's claim is
that every acquired component remains typed, inspectable, permission-bounded,
version-pinned, and reducible to the same visible mechanics as a locally
authored one.

The repository also compiles outward as an authoritative learning and
decision resource. The same reviewed purpose, mechanics, implementation,
decisions, and evidence can produce an everyday-user book, programmer guide,
manager handbook, IT architecture reference, executive briefing, or finance
case without maintaining six contradictory narratives. Audience changes the
path and language, never the underlying facts. See the
[`publication compiler`](08-publication-compiler.md).

## The one-paragraph story

A predecessor system (not present in this repo) proved the concept and then
collapsed under its own success: ~140 accumulated feedback rules loaded as
prose pushed every fresh session to ~400-500k tokens of always-on context,
where rules fired wrongly or vanished when needed most. The diagnosis, in the project's own RPG vocabulary: an **aura
stacker** — every rule reserved as a permanent global aura before entering any
map. DotLn's answer is not fewer rules but *compiled* rules: each correction
becomes a typed mechanism (a permission, a guard, a reactor, an evaluator, a
transformer, a workflow gate) attached only where relevant. A session gets **a
build, not a biography** — one active behavior, a handful of linked supports, a
tiny immutable safety layer, and the exact task state.

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

## The differentiated interface

DotLn's second thesis is about *authoring*, not running:

> "I will take the entire Business, Leadership, and Personal Development shelf
> at Barnes & Noble and just map them to different agent / subagent
> communication structures... at once anyone who has read those books is an
> expert in some feature of the app — and it turns all those books into
> programming books overnight."

The analogies are not documentation — **the analogies are the ways you mix and
match the agents**. Every pattern (5S, the Ladder of Leadership, mitigated
speech, Theory of Constraints, commedia dell'arte roles, the Algorithms-to-
Live-By policies) compiles into exact mechanics, and the same compiled program
renders through an open-ended set of isomorphically equivalent views: an RPG
character with a Path-of-Exile-style socket-and-link build, a business pattern
card, a statechart, a function table, a marble/Morse temporal track, a
TypeScript DSL, an event timeline. Friendly metaphors are authoring languages,
never camouflage: every view either provably compiles to the same normalized
program or is labeled a lossy projection with the exact mechanics one click
away.

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
  describe what this system structurally *is* — an event log that replays the
  system that produced it, a feedback compiler whose rules govern the reviewer
  who wrote them, an identity version that evaluates its own successor; and
  formal systems reasoning about themselves is the kernel's purity and replay
  contract. Unmined seams are recorded in the idea ledger rather than
  pre-emptively architected here.
- **Westworld** — two distinct borrowings. *Reveries*: feedback agents built
  from single rules with their verbatim originating incidents, recombinable as
  identity fragments. *Old configurations on modern builds*: historical
  artifacts stay runnable rather than becoming import debris, which is the
  requirement behind `10-ir-compatibility.md`.
- **Iron Man / JARVIS** — the operator relationship to aim at: declare intent
  conversationally, have the machinery carry the work and keep its own records,
  and never wonder what it did. DotLn takes the posture and inverts one thing
  deliberately. Fiction's assistant is trusted because it is charming and
  never wrong; this one has to earn it every time with replayable evidence, and
  operator absence never enlarges its authority.
  The films also supply this project's counterweight, in Stark's line to JARVIS
  before flying an untested suit: *"sometimes you gotta run before you can
  walk."* It sits on the same pole as §Discipline's "driving the car
  while you're still building it" in the execution guide — one licensing the
  unfinished flight, the other keeping you honest about it — and both stand
  opposite the disciplined ordering that finishes and tests the machine before
  it leaves the ground. Note
  where the scene goes: the suit ices up and nearly kills him, and the fix comes
  from the telemetry he was capturing the whole time. Running before you walk is
  licensed by the instrumentation, not by the confidence.
- **Ex Machina** — the verifier's problem, dramatised: an evaluator who is
  himself inside the experiment, an agent optimising to pass the evaluation
  rather than to be what the evaluation measures, and a judge disarmed by
  fluency. This is the argument for implementer ≠ verifier as a *structural*
  rule rather than a habit, for adversarial evaluators that try to refute
  rather than confirm, and for evidence that a persuasive summary cannot
  substitute for.
- **Black Mirror, especially Bandersnatch** — branching state made navigable:
  choice points, rewind, paths not taken, and a participant who can see the
  branch structure they are inside. That is Horizon 3's counterfactual replay
  almost literally — paired runs, first-divergence detection, and the
  scrubbable run-orb. The series' broader use is as a standing negative
  oracle: it is a catalogue of systems that worked exactly as specified and
  were still wrong, which is the failure mode an ObjectiveContract and the
  six-month livability test exist to catch.
- **Christopher Nolan's films — and their productions.** Three distinct axes,
  and the third is the one that matters most here.
  *Story:* nonlinear and multi-rate time is the recurring subject. **Memento**
  is close to a literal statement of this system's execution model — a
  protagonist with no session memory who stays coherent only through durable
  external artifacts he has disciplined himself to trust, and who is
  demonstrably corruptible through those artifacts. That is the disposable
  executor, the event log as the only memory, and the reason provenance and
  immutability are not decoration. **Inception** is nested episodes running at
  different time bases with a delegation depth, an explicit termination signal,
  and totems as provenance checks. **Dunkirk** is three workstreams on
  different cadences converging on one outcome.
  *Presentation:* practical effects wherever they are possible, because a real
  mechanism photographs differently than a simulated one. DotLn's version of
  that rule already exists and is called the analog-completeness test — if a
  feature only works because a model improvises around missing semantics, it is
  not in the core grammar.
  *The meta level — the actual lesson:* the quality comes from the whole
  production holding a standard, not from one person having taste. Crew,
  cast, and composer all operate at it. That is precisely the bet in The core
  bet above, viewed from the other end: a standard that lives only in one
  person's judgment does not survive contact with scale, and the work of this
  project is to compile that standard into machinery every participant — human
  or model, present or replaced — is held to.
- Already carried elsewhere in the blueprint: Poincaré via Pirsig (the
  selection function, in The core bet above), ZAMM's gumption traps, Donella
  Meadows' leverage points, Goldratt's bottleneck pacing, 5S, and the RPG
  vocabulary — gems, links, supports, loadouts — that gives the whole system
  its authoring metaphor.
- **Game inspirations: to be added by the operator.** Deliberately left open
  rather than guessed at; the RPG mechanics already in use are a fraction of
  what the operator intends to name.

Provenance note: Gödel, Escher, Bach, Iron Man / JARVIS, Ex Machina, Black
Mirror, and the Nolan filmography appear nowhere in the captured intake corpus
and are recorded on the operator's direct instruction (2026-08-31). Westworld and the rest are
traceable to the raw material. Do not attribute a specific claim to an
unsourced influence without asking.

## What DotLn is not

- Not a prompt library, and not a wrapper that makes one vendor's model nicer.
- Not a prescribed catalog of ideal agents, roles, personalities, workflows,
  or organizational doctrine. Bundled patterns are examples and optional
  starting points, not kernel truth.
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
