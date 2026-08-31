# Founding pattern library

Deeply implement a small number of patterns before broadly implementing many.
Each pattern ships with its three synchronized lenses (familiar / formal /
code) compiled from one PatternDefinition — a typed contributor of statechart
fragments, policies, cadences, permissions, transforms, completion gates,
metrics, failure modes, and counter-patterns with validScopes. **A pattern is
not a prompt snippet**; the generated prompt is one downstream artifact.

## 5S / 6S — the maintenance organism

Sort (Seiri) · Set in Order (Seiton) · Shine (Seisō) · Standardize (Seiketsu) ·
Sustain (Shitsuke) · Safety. A recurring statechart with Safety as a parallel
region: Sort classifies with evidence and never deletes at first authority;
Shine makes cleaning double as inspection; **Standardize is token economics**
(a recurring repair becomes a test/lint/hook/script — the system stops paying
model tokens for solved problems); Sustain is the cadence. As equipment: the
slotted 5S set with compiled set bonuses. The launch narrative: "the 5S applied
to your repo, for free, automatically — constant, ever-present, never in the
way: cleaners, fixers, tool builders, bridge makers, gap pluggers, auditors,
referees."

**Repo Gardener** is the founding identity that carries this set: dispositions
— patient, evidence-bound, propose-don't-destroy; invariants — no deletion
authority at base rank, every candidate carries evidence, active only while
the operator is absent, stops on return, re-evaluates on a pulse. It is the
walking skeleton's character (WO-003) and the v0.8.0 drag-equip target.

## Leadership & autonomy — Marquet

- **Ladder of Leadership**, 7 rungs, each a *paired speech act* (worker/leader):
  1 "Tell me what to do / I'll tell you what to do" → 2 "I think / What do you
  think" → 3 "I recommend" → 4 "I request permission to" → 5 **"I intend to"**
  → 6 "I've done" → 7 "I've been doing". This is a typed communication
  protocol, not a trait: an episode's autonomy level *is* the grammar of its
  messages. Rungs 6–7 are the operator-absent act-then-report modes.
- **Control = f(competence, clarity)**: the autonomy rung is computed from
  competence evidence (eval history) and mission clarity (spec quality) plus
  risk and reversibility — never set statically, never raised by elapsed
  absence. "Empowerment by itself is not a program."
- Talent trees: Leading Self / Leading Others / Leading the Business as
  slow-changing dispositional branches, distinct from swappable equipment.

## SMART & exploration contracts

SMART is a **readiness guard, never a gate on trivial ops** — validation
happens at exactly four points: workstream creation, promotion from
exploration to execution, worker dispatch, and verification-plan creation.
The pipeline: vague idea → exploration contract → evidence gathered →
execution-ready goal → SMART validation → dispatch. A vague objective is not
rejected; it is tiered (Unformed Rumor → Exploration Contract → Defined →
SMART-Validated → Execution-Ready → Verified Complete) and exploratory work is
legitimately unmeasurable in advance. Should there be a pre-tool hook that
enforces a SMART goal? Only at those four points.

## Communication — mitigated speech

Six-level voice enum: Command · Crew Obligation · Crew Suggestion · Query ·
Preference · Hint. A pure selector chooses voice from risk, urgency,
confidence, authority gap, reversibility, and cost of misunderstanding.
Linguistic force is strictly separate from actual authority (a Command voice
cannot create authority; a safety warning must never ship as a Hint —
especially when the operator is absent and no one is there to decode hints).

## Decision policies — Algorithms to Live By

Optimal Stopping (bounded search termination; the blackjack-bounded-loss
shape) · Explore/Exploit ("when in doubt, run the something-new behavior") ·
Caching (LRU over environment data, prompts, tool results) · Scheduling
(shortest-job/earliest-deadline; work release paced to the constraint) ·
Controlled Randomness (explicit RNG state; A/B losers may appeal with a
randomized boost) · Overfitting Resistance (simpler rules predict better —
aimed at the rules library itself) · **Computational Kindness** (the mission
statement: reduce the other party's cognitive load — the operator's above all).

## Systems & quality

- **Theory of Constraints**: the five focusing steps as an executable control
  loop (identify → exploit → subordinate → elevate → repeat), the four X/Y
  building blocks as dependency primitives for topology type-checking,
  activation ≠ utilization as the metric law, and the migrating-constraint
  rule (re-identify every cycle: the constraint may be tokens, model
  capability, evaluation throughput — or the operator's review bandwidth,
  which is the market that absorbs agent output). The red/green tag lesson:
  priority policies are themselves policies that can starve flows — test them
  counterfactually.
- **Meadows leverage levels**: tag every mechanism and every piece of feedback
  with its intervention altitude (12 parameters → … → 8 negative feedback →
  6 information flows → 5 rules → 4 self-organization → 3 goals → 2 paradigm);
  bias compilation upward over time.
- **Antifragile response**: incident → test/monitor/tool. Robust = perturbation
  absorbed; antifragile = missing invariant exposed and a new
  test/monitor/tool created. The sandbox-only Chaos agent exists to *earn*
  these classifications; it never degrades authoritative data.
- **Gumption-trap removal**: the 7-category taxonomy of motivation-draining
  friction (external setback, miscommunication, tooling, ambiguity,
  distraction, procrastination-loop, deadline pressure) as the negative-signal
  event vocabulary; dedicated lazzi (bounded side routines — see §Party topology) reduce them.
- **Quality (Pirsig)**: aspects stay loosely defined but each pairs with a
  concrete improving technique (unity↔outline, authority↔footnotes...), and
  rote letter-fulfillment without the goal is worthless — the charter for
  evaluator design and the rote-compliance detector. Evaluators reproduce the
  operator's judgments only to the degree they share the operator's analogues
  (context, exemplars, compiled feedback) — and must escalate out-of-
  distribution work instead of guessing.

## Party topology — commedia dell'arte (the masks)

The commedia roles are internally called **masks** (relationship-shaped, worn
not owned): Whiteface (planner/rule-keeper; failure mode: over-centralization, mistaking
authority for correctness) · Auguste (maker/improviser; scope drift,
enthusiastic breakage) · Contra-Auguste (bounded falsifier; destructive
contrarianism, loss of shared truth) · Watcher (read-only narrative
projection) · Lazzi (bounded, interruptible side routines with tight budgets,
explicit cancellation, no authority over the main objective). These are
*relational* roles — a Whiteface only means something in relation to the
others — and optional topology, never truth; the labels never leak into
external artifacts. Class taxonomy for scenario templates: Vecchi
(constraint-holders) / Zanni (resourceful fixers) / Innamorati (goal-carriers).

## The Eye Dr Test — pairwise preference

Familiar lens: the optometrist's "better like this… or like this?" Formal
lens: pairwise preference aggregation (Bradley-Terry family; Elo is its online
approximation) — the same foundation as RLHF reward models and arena-style
model rankings. Code lens: a pure fold over `Comparison` events (see domain
model) — comparisons are source of truth, ratings are replaceable projections.

Mechanics: the matchmaker picks the next pair to bisect remaining uncertainty
(closest ratings, highest variance) — each question chosen like the
optometrist's; "about the same" is a result (the just-noticeable-difference
floor) and an optimal-stopping signal. Ratings are scoped (per task class /
repo / dimension), windowed, and carry uncertainty; per-judge and
per-dimension ratings are kept separate (disagreement is data — preferences go
intransitive across quality dimensions). Judges accrue agreement-with-operator
ratings and earn deference only in-distribution. Guards against gaming:
randomized presentation order, blinded judging, verbosity controls, the
rote-compliance detector. Scope limit: Eye Dr ranking lives below hard
constraints in the composition precedence — a guard-violating candidate is
rejected, never ranked. Status: operator hypothesis with strong external
precedent, adopted in non-forcing form — comparisons recordable from v0.1.0,
tournament machinery only when evidence accrues.

## Rhythm patterns

Double Dutch (guarded opportunity window: watch → detect opening → prepare →
bounded action window → exit before interference → resume watching) · sow/reap
tension (~1/3 research fan-out, bounded execution, with every behavior paired
to its opposite via PolarAxes) · the operator-absence utility curve per action
(peak, break-even, negative — "too much reorganization in the ten minutes you
got up for coffee").
