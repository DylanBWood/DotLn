# Founding pattern library

**Status:** target pattern catalog. The current walking skeleton executes one
hand-assembled Repo Gardener + Seiri behavior; PatternDefinition compilation,
set bonuses, and the remaining patterns are planned work.

For the founding slice, deeply implement a small number of patterns before
broadly implementing many. This is one selected progression policy, not a
universal law; the roadmap defines breadth-first, depth-first, floor-raising,
constraint-first, and risk-weighted capability progression.
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
walking skeleton's character (WO-003) and the v0.9.0 drag-equip target.

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

Capability progression keeps **activation** (selected), **utilization**
(materially participated), and **XP** (new admissible evidence) distinct. Those
signals feed Theory of Constraints; none is a substitute for observed outcome
or a popularity ranking. The constraint is a focusing aid, not a command:
voluntary practice and curiosity remain legitimate inputs, and their reps
accumulate learning without pretending every repetition raises production
maturity.

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

## Candidate — oppositional support

An active mechanic may be linked to a support whose job is to make the active's
declared PolarAxis relation genuinely present in the decision, rather than
merely lowering a numeric score. Working name: **Oppositional Counsel**. This
is an unsettled candidate, not yet a pinned `PatternDefinition`.

The candidate separates three channels that must not collapse into one:

- **Activation pressure** changes enthusiasm: salience, selection weight,
  persistence, or how strongly a branch is advocated. It is soft policy and
  loses to every harder composition layer.
- **Critical argument** produces a typed dissent artifact naming flaws,
  counterevidence, failure modes, and a concrete alternative or mitigation.
  Rhetorical force alone changes nothing.
- **Authority effect** changes what may proceed. It is never inferred from
  enthusiasm or criticism: a support may narrow authority, but delaying,
  vetoing, or expanding action requires an explicit permission/guard contract
  at the appropriate composition-precedence layer.

Candidate output shape (illustrative, not normative):

```ts
type OppositionBrief = {
  targetArtifactRef: string
  axisId: string
  relation: "inverse" | "complement" | "counterweight" | "compensation"
  position: "oppose" | "qualify" | "pair" | "repair"
  claims: Array<{
    flaw: string
    evidenceRefs: string[]
    consequence: string
  }>
  alternative?: unknown
  requestedEffect: "advisory" | "rescore" | "require-review" | "refuse"
  confidence: number
}
```

The relation controls what the counsel is allowed to argue:

- **Inverse:** argue for a reversible undo or restoration, not generic
  negativity.
- **Complement:** expose what the active omits and propose the paired behavior;
  both may survive reduction.
- **Counterweight:** push against excess intensity or premature selection; it
  modifies policy pressure without claiming the opposite is universally true.
- **Compensation:** accept the active behavior conditionally and attach a
  repair, safeguard, or follow-up for its characteristic cost.

Likely compilation path: the active produces its normal typed candidate; this
support activates a bounded evaluator episode with the target, axis relation,
evidence budget, and output schema; the evaluator returns an
`OppositionBrief`; a deterministic reducer applies only the requested effects
authorized by the loadout. The compiled episode may therefore emit JSON,
evaluation evidence, a guard/refusal, a score adjustment, and a small prompt
instruction for the edge model. The prompt is one residue, not the mechanism.

Open design questions: whether this is one parameterized support or four
relation-specific supports; whether `require-review` is a continuation gate or
an evaluator result; how opposing briefs compose; what prevents reflexive
contrarianism; and what evidence should graduate an advisory counsel into a
harder mechanism. No implementation should pin these before a concrete
scenario exercises them.

## Candidate — Beware of Naive Interventionism

**"Beware of naive interventionism"** is a candidate support for any active
mechanic that proposes changing an existing system. It challenges the hidden
premise that detecting an imperfection makes intervention net-beneficial. The
support is a counterweight to action bias, novelty bias, cleanup enthusiasm,
and locally correct changes that damage adaptations elsewhere.

It asks for an explicit comparison between intervention and non-intervention:

- What observable harm exists now, and how strong is the evidence?
- What useful or compensating function might the current behavior serve?
- Which consumers, equilibria, or learned workflows depend on it?
- What are the likely second-order effects and failure radius of changing it?
- Is the intervention reversible, staged, measurable, and easy to stop?
- What happens if nothing is changed yet, and when should the question be
  revisited?

Candidate output shape (illustrative, not normative):

```ts
type InterventionBrief = {
  proposalRef: string
  observedProblem: {
    claim: string
    evidenceRefs: string[]
    severity: "low" | "medium" | "high" | "urgent"
  }
  currentSystemFunctions: string[]
  affectedConsumers: string[]
  actionCase: string
  nonInterventionCase: string
  secondOrderRisks: Array<{
    risk: string
    evidenceRefs: string[]
    reversibility: "easy" | "bounded" | "difficult" | "unknown"
  }>
  smallestSafeProbe?: string
  recommendation: "proceed" | "stage" | "observe" | "noop" | "escalate"
  reevaluateWhen?: string
}
```

The support may compile into different mechanisms by consequence:

- For low-risk reversible work, it contributes a brief checklist or a soft
  policy adjustment and then gets out of the way.
- For uncertain changes, it requests the smallest discriminating probe,
  impact map, or comparison before mutation.
- For broad or irreversible changes, it may add evidence obligations, narrow
  the permitted operation, require staged rollout, or route to review—but only
  through explicit authority and statechart layers.
- When intervention has negative expected value, it produces a first-class
  NoOp with evidence, reevaluation cadence, and the condition that would make
  action worthwhile.
- Urgent safety invariants and explicit operator commands still obey their
  higher-precedence rules; the support cannot turn caution into an ambient
  veto.

Likely composition: this is primarily a **counterweight** support, with a
possible **compensation** mode that allows action only when paired with a
rollback, observation window, or repair plan. It can modify enthusiasm and
evidence burden, but it cannot manufacture authority. It should activate in
proportion to irreversibility, blast radius, uncertainty, and the health of the
existing system—not on every trivial edit merely because the phrase is always
present.

Open design questions: whether the support consumes an `ImpactMap` or creates
one; how its intervention threshold relates to per-action utility and
verification radius; which signals show that caution is causing stagnation;
and whether repeated successful interventions should lower its burden in that
specific domain. Preserve the exact phrase as the familiar lens while the
formal and code lenses evolve.

## Candidate — Do Nothing, active and support

**Do Nothing** exists in two socket positions with distinct semantics. Both
compile to deliberate, observable non-action through the existing first-class
`NoOpIntent`; neither means a crashed scheduler, an empty result, indecision,
or silent abandonment.

### Active: Do Nothing

As an active mechanic, Do Nothing makes restraint the episode's primary
behavior. It evaluates the present state, records why action is currently
negative-value or premature, preserves relevant evidence, and establishes the
condition and cadence for reconsideration.

Its minimum result is already shaped by the domain model:

```ts
type DoNothingResult = {
  intent: {
    kind: "NoOp"
    reason: string
    evidence: string[]
    reevaluation: Cadence
    usefulWhen: PredicateRef
  }
  observationPlan?: {
    signals: string[]
    stopWaitingWhen: PredicateRef
  }
}
```

This makes active Do Nothing useful for waiting on evidence, protecting a
healthy equilibrium, holding a reversible pause, allowing another actor to
finish, or explicitly declining work whose expected value is negative. It may
schedule observation or reevaluation, but it performs no disguised mutation.

### Support: Do Nothing

As a support, Do Nothing modifies a linked active mechanic by adding
**abstention as a valid successful outcome**. The linked active still knows how
to research, edit, remove, communicate, or dispatch; the support requires it
to compare that action with a typed NoOp branch before proceeding.

The support can contribute:

- a non-action candidate alongside the active's proposed action;
- a threshold below which the action reduces to NoOp;
- an obligation to state what evidence would reverse the abstention;
- a reevaluation cadence rather than an indefinite stall;
- a completion rule under which choosing not to act counts as a successful,
  evidenced decision.

It cannot silently remove the active's authority or make all thresholds
unreachable. Under composition precedence it ordinarily modifies policy,
stopping behavior, evidence obligations, and continuation shape. A hard veto
still requires a separate guard or permission rule.

### Relationship to nearby mechanics

- **NoOpIntent** is the canonical kernel-level result both forms use.
- **Beware of Naive Interventionism** is an evaluator/counterweight that asks
  whether intervention is justified; it may recommend Do Nothing, but it does
  not itself enact or maintain the pause.
- **Oppositional Counsel** argues a declared polar relation and may still
  recommend a different action; Do Nothing specifically represents
  abstention.
- **WaitIntent** waits for a cadence; Do Nothing explains why no action is
  useful and what would make one useful. A Do Nothing result may include a
  wait, but the concepts are not interchangeable.
- **Stop** terminates a continuation; Do Nothing may remain actively watchful
  and reevaluate later.

In the RPG view, the same named gem may therefore appear as an active gem or a
support gem, with the socket position changing its compiled type. The build
inspector must show the distinction: **Do Nothing (Active)** emits an evidenced
NoOp program; **Do Nothing Support** adds an abstention branch to the linked
active. This is a useful test of the rule that links declare semantic scope,
not execution sequence.

Open design questions: whether the support always adds a branch or sometimes
only raises a threshold; whether observation belongs inside the active or in
a linked Observe mechanic; how abstention candidates participate in pairwise
comparison; and what empirical signal detects a Do Nothing support that has
become chronic avoidance. The dual form is adopted as ideation; exact compiler
types remain unpinned until a scenario exercises both socket positions.

## Candidate — Default to True / Default to False

Gladwell's **Default to True** and its explicit polar counterpart **Default to
False** are candidate supports that tell a linked active how to resolve genuine
uncertainty after available evidence has been considered. They set a prior or
tie-break direction; they do not declare facts, create authority, or replace
verification.

**Leading implementation hypothesis:** no new primitive is required. Define a
PolarAxis such as `provisionalAcceptance ↔ provisionalSkepticism`, then compile
Default to True and Default to False as named supports contributing opposite,
scoped factors to that axis. The existing `deriveBehavior(...)` path resolves
identity baseline + role + supports + environment + history into the effective
tension; the support is the familiar lens over one contribution.

```ts
const provisionalAcceptance: PolarAxis = {
  poles: ["accept", "question"],
  relation: "counterweight",
  baseline: 0,
  factors: [
    { source: "DefaultToTrue", delta: +1, scope: "reversible-collaboration" },
    { source: "DefaultToFalse", delta: -1, scope: "destructive-effects" }
  ]
}
```

This sketch is illustrative: the existing candidate log-odds composition may
encode the pressure instead of `delta`. What matters is that the inspector can
show each contribution, the effective tension, and which harder rule ultimately
won. The axis influences policy; it does not become a truth value.

- **Default to True** provisionally accepts, trusts, continues, or treats a
  proposition as satisfied when evidence does not discriminate. It favors
  cooperation, momentum, and lower friction while preserving later correction.
- **Default to False** provisionally rejects, distrusts, pauses, or treats a
  proposition as unsatisfied when evidence does not discriminate. It favors
  containment, verification, and avoiding false acceptance.

Both supports compile through the same parameterized mechanism:

```ts
type DefaultPolaritySupport = {
  default: true | false
  scope: {
    propositionKinds: string[]
    validStates?: string[]
  }
  appliesWhen: PredicateRef
  evidenceThreshold: number
  overrideWhen: PredicateRef
  expiry?: Cadence
  traceLabel: string
}
```

The reduction rule is deliberately narrow:

1. Hard constraints, permissions, statechart guards, and known evidence
   resolve first.
2. If the proposition remains materially undecided and the support is in
   scope, apply its default polarity.
3. Record that the result came from a default, not from evidence.
4. Preserve the evidence or event that would override the default, plus an
   expiry or reevaluation cadence when the uncertainty can change.

The pair is best understood as a PolarAxis over **provisional
acceptance/provisional skepticism**. They are not exact logical negations in
all contexts because error costs are asymmetric. Default to True may be
appropriate for low-cost, reversible collaboration while Default to False may
be appropriate for destructive effects, security boundaries, irreversible
publication, or unsupported completion claims. Scope must therefore attach to
the proposition being decided, not globally to an agent's personality.

Composition with nearby supports:

- **Do Nothing Support** supplies abstention as an outcome; Default to False
  may select that branch, but the two mechanics are distinct.
- **Beware of Naive Interventionism** evaluates whether a change is justified;
  its evidence can resolve the question before either default is consulted.
- **Oppositional Counsel** produces an argued position; a default operates only
  after such arguments and evidence fail to discriminate.
- **Voice** controls how strongly the result is communicated; it cannot turn a
  provisional default into certainty.

Open design questions: whether the prior is Boolean or log-odds internally;
how to represent "insufficient evidence" without fake numeric confidence; how
defaults learn by task class without becoming hidden identity drift; and which
domains should reject defaults entirely and require an explicit Unknown or
human judgment. Preserve the Gladwell names as the familiar lens while the
formal mechanism remains replaceable.

### Fallback generalization — graded propositions

If concrete cases cannot be expressed by the existing PolarAxis plus predicate,
evidence, and policy primitives, Default to True / False may be projections of
a more general graded-decision primitive. Do not add it preemptively. Calling
the whole primitive "fuzzy logic" risks collapsing
three different quantities:

1. **Epistemic support:** what the evidence says about a proposition, including
   Unknown and conflicting evidence.
2. **Activation degree:** how strongly a behavior should participate in the
   current phenotype or PolarAxis tension.
3. **Decision policy:** the threshold, prior, and asymmetric cost used to turn
   the first two into an action, abstention, or request for more evidence.

A candidate shape keeps those layers visible:

```ts
type GradedProposition = {
  propositionRef: string
  support: {
    for: number
    against: number
    unknown: number
    evidenceRefs: string[]
  }
  activation: number
  resolution: {
    threshold: number
    defaultOnUnknown: true | false | "remain-unknown"
    falsePositiveCost: number
    falseNegativeCost: number
  }
}
```

The numbers above are illustrative and must not become fake precision. An
initial implementation may be better served by a small evidence lattice such
as `Supported | Refuted | Unknown | Conflicted`, with continuous values used
only where observations justify them.

Under this generalization:

- **Default to True** sets `defaultOnUnknown: true` for a scoped proposition.
- **Default to False** sets `defaultOnUnknown: false`.
- A domain that refuses assumption sets `remain-unknown` and routes to Observe,
  Do Nothing, or human judgment.
- PolarAxis derivation may consume activation degree or log-odds without
  treating that pressure as factual certainty.
- Hard guards still consume explicit predicates and authority; no fuzzy score
  can weaken them.

This fallback is promising because the familiar supports remain simple while
the compiler gains one inspectable uncertainty mechanism. It is dangerous if one
unlabeled scalar starts standing for truth, confidence, preference, urgency,
and permission simultaneously. Keep the generalization open until concrete
cases demonstrate that PolarAxis is insufficient and which values are
measurable rather than merely ordinal.
