# Founding pattern library

**Status:** target pattern catalog. The current walking skeleton executes one
hand-assembled Repo Gardener + Seiri behavior; PatternDefinition compilation,
set bonuses, and the remaining patterns are planned work.

For the founding slice, deeply implement a small number of patterns before
broadly implementing many. This is one selected progression policy, not a
universal law; the roadmap defines breadth-first, depth-first, floor-raising,
constraint-first, and risk-weighted capability progression. Each pattern ships
with its three synchronized lenses (familiar / formal / code) compiled from one
PatternDefinition — a typed contributor of statechart fragments, policies,
cadences, permissions, transforms, completion gates, metrics, failure modes, and
counter-patterns with validScopes. **A pattern is not a prompt snippet**; the
generated prompt is one downstream artifact.

## 5S / 6S — the maintenance organism

Sort (Seiri) · Set in Order (Seiton) · Shine (Seisō) · Standardize (Seiketsu) ·
Sustain (Shitsuke) · Safety. A recurring statechart with Safety as a parallel
region: Sort classifies with evidence and never deletes at first authority;
Shine makes cleaning double as inspection; **Standardize is token economics** (a
recurring repair becomes a test/lint/hook/script — the system stops paying model
tokens for solved problems); Sustain is the cadence. As equipment: the slotted
5S set with compiled set bonuses. The launch narrative: "the 5S applied to your
repo, for free, automatically — constant, ever-present, never in the way:
cleaners, fixers, tool builders, bridge makers, gap pluggers, auditors,
referees."

**Repo Gardener** is the founding identity that carries this set: dispositions —
patient, evidence-bound, propose-don't-destroy; invariants — no deletion
authority at base rank, every candidate carries evidence, active only while the
operator is absent, stops on return, re-evaluates on a pulse. It is the walking
skeleton's character (WO-003) and the v0.9.0 drag-equip target.

## Leadership & autonomy — Marquet

- **Ladder of Leadership**, 7 rungs, each a _paired speech act_ (worker/leader):
  1 "Tell me what to do / I'll tell you what to do" → 2 "I think / What do you
  think" → 3 "I recommend" → 4 "I request permission to" → 5 **"I intend to"** →
  6 "I've done" → 7 "I've been doing". This is a typed communication protocol,
  not a trait: an episode's autonomy level _is_ the grammar of its messages.
  Rungs 6–7 are the operator-absent act-then-report modes.
- **Control = f(competence, clarity)**: the autonomy rung is computed from
  competence evidence (eval history) and mission clarity (spec quality) plus
  risk and reversibility — never set statically, never raised by elapsed
  absence. "Empowerment by itself is not a program."
- Talent trees: Leading Self / Leading Others / Leading the Business as
  slow-changing dispositional branches, distinct from swappable equipment.

## SMART & exploration contracts

SMART is a **readiness guard, never a gate on trivial ops** — validation happens
at exactly four points: workstream creation, promotion from exploration to
execution, worker dispatch, and verification-plan creation. The pipeline: vague
idea → exploration contract → evidence gathered → execution-ready goal → SMART
validation → dispatch. A vague objective is not rejected; it is tiered (Unformed
Rumor → Exploration Contract → Defined → SMART-Validated → Execution-Ready →
Verified Complete) and exploratory work is legitimately unmeasurable in advance.
Should there be a pre-tool hook that enforces a SMART goal? Only at those four
points.

## Communication — mitigated speech

Six-level voice enum: Command · Crew Obligation · Crew Suggestion · Query ·
Preference · Hint. A pure selector chooses voice from risk, urgency, confidence,
authority gap, reversibility, and cost of misunderstanding. Linguistic force is
strictly separate from actual authority (a Command voice cannot create
authority; a safety warning must never ship as a Hint — especially when the
operator is absent and no one is there to decode hints).

### Candidate — exact phrasebook voice support

An optional support asks output prose to use entries from an operator-selected,
versioned phrasebook: exact words, phrases, sentence constructions, spellings,
capitalization, and annotations are content, not hints to paraphrase. The
support may attach scopes, triggers, weights, cooldowns, and do-not-use contexts
without rewriting the entries themselves. It is best-effort when lowered into
model instructions and deterministic only when an explicit output transform
runs; the trace says which mechanism actually participated. Phrasebook style
never changes `Voice`, facts, authority, or evidence, and a private or
source-derived palette retains its provenance and destination rules.

The operator directed this _Dual Survival_ palette to be retained wholesale
from the local image, then corrected an attempted generalized synthesis because
the exact wording is the mechanic. On 2026-09-03, the operator confirmed
authorship of the list/compilation shown in that image and explicitly authorized
its exact text for public filing in this repository. The block is therefore
filed under Direct Draft Fidelity:

```text
1) Mentioning of Cody's bare feet (cooldown of 3 minutes)
2) "In a survival situation/In this situation"
3) "Old Man's Beard"
4) "Not out of the woods yet"
5) "Mechanical Injury"
6) "Calories"
7) "Hypothermia"
8) "Cordage"
9) "Resources"
10) "Brother"
11) "Hydration"
12) "Even death"
13) "Disinfect" CD
** I trust Dave, Orienteer, Brother, Surface Area, "Something called -obvious reference-", Partner not being comfortable with a decision, Recon, Survival Basics, Don't go after things that can go after you, Microclimate, Classic -something non Classic-, Smolder, Disinfect, Contrast, "not in kansas anymore" **
```

The first separately supplied _Man, Woman, Wild_ entry is exactly
`this is truly desperate living`.
A recorded unavailable-model, effort-refusal, or explicit degraded-mode event
may make it eligible; tone cannot invent that state, and using the phrase cannot
make silent model substitution acceptable.
The Westworld control lexicon follows the same fidelity rule but is a distinct
operator-command surface: only `analysis:` has been supplied so far, and no
agent may fill the open slots with paraphrases or remembered dialogue.

## Decision policies — Algorithms to Live By

Optimal Stopping (bounded search termination; the blackjack-bounded-loss shape)
· Explore/Exploit ("when in doubt, run the something-new behavior") · Caching
(LRU over environment data, prompts, tool results) · Scheduling
(shortest-job/earliest-deadline; work release paced to the constraint) ·
Controlled Randomness (explicit RNG state; A/B losers may appeal with a
randomized boost) · Overfitting Resistance (simpler rules predict better — aimed
at the rules library itself) · **Computational Kindness** (the mission
statement: reduce the other party's cognitive load — the operator's above all).

Capability progression keeps **activation** (selected), **utilization**
(materially participated), and **XP** (new admissible evidence) distinct. Those
signals feed Theory of Constraints; none is a substitute for observed outcome or
a popularity ranking. The constraint is a focusing aid, not a command: voluntary
practice and curiosity remain legitimate inputs, and their reps accumulate
learning without pretending every repetition raises production maturity.

## Candidate — influence response policies

How an eligible signal participates in a decision is a policy, not a fixed
personality score. Keep that policy separate from the signal's factual support,
the `Voice` used to express it, and the authority that bounds the eventual
effect. The operator's quantum-mechanics viewing supplies one useful contrast
between qualitative bands and accumulating magnitude; it does not make a
physical claim or import physics as the implementation.

The first candidate inventory contains four distinct response shapes:

- **band-gated:** the highest applicable semantic band controls the response;
  repeating a lower-band suggestion any number of times does not turn it into
  one urgent signal;
- **cumulative:** eligible contributions combine through a declared reducer,
  such as a sum, weighted vote, mean, median, majority, or quorum. The
  operator's democratic intuition is a felt shape, not a guarantee of fairness;
  sources, weights, deduplication, abstentions, and ties remain visible;
- **bounded-history:** only the most recent `n` inputs, a declared time window,
  or an explicitly decayed history participates, with ordering and eviction
  reproducible from recorded events; and
- **self-governed:** external inputs may be received and understood while
  contributing no decision pressure; the subject resolves from its own
  declared state and judgment. In an agent or application lowering, this can
  never bypass hard constraints, authority, consent, or evidence obligations.

These shapes may later compose or switch by condition, and they are not assumed
to exhaust the space. Any concrete policy must name eligible sources and signal
classes, contribution semantics, precedence, window or decay, thresholds and
tie behavior, and the trace explaining which inputs participated. Paired cases
should distinguish one higher-band input from arbitrarily many lower-band
inputs, equal totals assembled differently, an input falling out of the active
window, and a received-but-nonparticipating external signal.

This is not the existing `AttentionPolicy`, which selects mechanisms to load,
and it is not permission for message intensity to manufacture authority. In a
simulation it can model a resident's reception and resolution; elsewhere it is
only a candidate reusable policy until a representative scenario demonstrates
the required contract without pretending to measure hidden human judgment.

## Systems & quality

- **Theory of Constraints**: the five focusing steps as an executable control
  loop (identify → exploit → subordinate → elevate → repeat), the four X/Y
  building blocks as dependency primitives for topology type-checking,
  activation ≠ utilization as the metric law, and the migrating-constraint rule
  (re-identify every cycle: the constraint may be tokens, model capability,
  evaluation throughput — or the operator's review bandwidth, which is the
  market that absorbs agent output). The red/green tag lesson: priority policies
  are themselves policies that can starve flows — test them counterfactually.
- **Meadows leverage levels**: tag every mechanism and every piece of feedback
  with its intervention altitude (12 parameters → … → 8 negative feedback → 6
  information flows → 5 rules → 4 self-organization → 3 goals → 2 paradigm);
  bias compilation upward over time.
- **Antifragile response**: incident → test/monitor/tool. Robust = perturbation
  absorbed; antifragile = missing invariant exposed and a new test/monitor/tool
  created. The sandbox-only Chaos agent exists to _earn_ these classifications;
  it never degrades authoritative data.
- **Gumption-trap removal**: the 7-category taxonomy of motivation-draining
  friction (external setback, miscommunication, tooling, ambiguity, distraction,
  procrastination-loop, deadline pressure) as the negative-signal event
  vocabulary; dedicated lazzi (bounded side routines — see §Party topology)
  reduce them.
- **Quality (Pirsig)**: aspects stay loosely defined but each pairs with a
  concrete improving technique (unity↔outline, authority↔footnotes...), and rote
  letter-fulfillment without the goal is worthless — the charter for evaluator
  design and the rote-compliance detector. Evaluators reproduce the operator's
  judgments only to the degree they share the operator's analogues (context,
  exemplars, compiled feedback) — and must escalate out-of-distribution work
  instead of guessing.

## Party topology — commedia dell'arte (the masks)

The commedia roles are internally called **masks** (relationship-shaped, worn
not owned): Whiteface (planner/rule-keeper; failure mode: over-centralization,
mistaking authority for correctness) · Auguste (maker/improviser; scope drift,
enthusiastic breakage) · Contra-Auguste (bounded falsifier; destructive
contrarianism, loss of shared truth) · Watcher (read-only narrative projection)
· Lazzi (bounded, interruptible side routines with tight budgets, explicit
cancellation, no authority over the main objective). These are _relational_
roles — a Whiteface only means something in relation to the others — and
optional topology, never truth; the labels never leak into external artifacts.
Class taxonomy for scenario templates: Vecchi (constraint-holders) / Zanni
(resourceful fixers) / Innamorati (goal-carriers).

## The Eye Dr Test — pairwise preference

Familiar lens: the optometrist's "better like this… or like this?" Formal lens:
pairwise preference aggregation (Bradley-Terry family; Elo is its online
approximation) — the same foundation as RLHF reward models and arena-style model
rankings. Code lens: a pure fold over `Comparison` events (see domain model) —
comparisons are source of truth, ratings are replaceable projections.

Mechanics: the matchmaker picks the next pair to bisect remaining uncertainty
(closest ratings, highest variance) — each question chosen like the
optometrist's; "about the same" is a result (the just-noticeable-difference
floor) and an optimal-stopping signal. Ratings are scoped (per task class / repo
/ dimension), windowed, and carry uncertainty; per-judge and per-dimension
ratings are kept separate (disagreement is data — preferences go intransitive
across quality dimensions). Judges accrue agreement-with-operator ratings and
earn deference only in-distribution. Guards against gaming: randomized
presentation order, blinded judging, verbosity controls, the rote-compliance
detector. Scope limit: Eye Dr ranking lives below hard constraints in the
composition precedence — a guard-violating candidate is rejected, never ranked.
Status: operator hypothesis with strong external precedent, adopted in
non-forcing form — comparisons recordable from v0.1.0, tournament machinery only
when evidence accrues.

## Rhythm patterns

Double Dutch (guarded opportunity window: watch → detect opening → prepare →
bounded action window → exit before interference → resume watching) · sow/reap
tension (~1/3 research fan-out, bounded execution, with every behavior paired to
its opposite via PolarAxes) · the operator-absence utility curve per action
(peak, break-even, negative — "too much reorganization in the ten minutes you
got up for coffee").

## Candidate — temporal interaction interpretation

One message is not the whole event. This candidate treats an interaction as a
time-ordered, relational stream whose derived interpretation can depend on what
happened before and on evidence that arrives later: which prompt a response
answers, which objective and continuation were active, whether a correction
already landed, how often a behavior recurred, and whether an explicit operator
declaration or applicable context event changed the interaction contract. Timing
or surface/message features alone cannot establish that transition; an explicit
semantic operator declaration can. Later evidence revises a projection; it never
rewrites the immutable source event or already-observed effect history. Common
machinery can process operator and system events without pretending their
semantics or authority are symmetric. A system can keep doing the wrong thing;
an operator can answer an older prompt whose apparent nearest neighbor is no
longer the active work.

The candidate observation envelope is deliberately not a personality model. It
may reference source actor, event time and ingestion time, explicit quote or
reply target, active objective/workstream/continuation, applicable policy
versions, control and tool evidence, and operator corrections. Raw message
content remains minimized source data. Keep three relations distinct:

- transport reply metadata and quote source/reference observations are immutable
  evidence, not proof of the semantic target; copied quote text is minimized and
  may be redacted under its source-data policy;
- an operator-declared target or correction may supersede a prior semantic
  interpretation while leaving those transport facts intact; and
- any system-inferred attachment is a versioned, correctable hypothesis with
  evidence and confidence. Active-work relevance and temporal adjacency cannot
  prove one alone; an ambiguous response remains `unresolved` or produces one
  material clarification packet.

A stale-response projection may reference the source event, transport relation,
declared or hypothesized semantic target, state/continuation basis when known,
current state at ingestion, and a disposition such as `applicable`,
`stale-but-informative`, `rebase-required`, `superseded`, or `unresolved`. Those
are candidate projection fields, not pinned schema. Never apply an old command
blindly to current state.

Temporal predicates are rule-scoped stream recognizers, not universal human
signals. Examples include a behavior recurring within a window, the same failure
recurring after correction, a response attaching to superseded work, a quench
cascade, or an explicitly evidenced transition among response postures. Retries
and duplicate event identities do not raise recurrence counts. “Same failure
after correction” requires a versioned rule/normalized-behavior identity, scope,
and evidence that the correction took effect—not mere repeated wording. “Five
times in five minutes” is an illustration of dense recurrence, not a global
threshold. Counts, windows, clocks, ordering tolerance, late-event handling, and
recovery conditions belong to the versioned rule that uses them. A transition
path can matter without becoming a scalar severity ladder. Inferred attachment,
recurrence, or mode observations may route analysis or request clarification;
they cannot retarget the objective, widen authority, or authorize effects.

An illustrative hierarchy is
`CollaborativeExploration | ContinuityCritical(conducting | quenched)`, not
final vocabulary. A late reply may describe or bind to an earlier basis mode,
but its new interpretation and any transition append to and reduce against
current state. Neither it nor a retrospective correction rewrites prior
transitions or effects; a correction annotates or supersedes only the derived
projection.

The operator associates this richer model with the communication-mode chain in
the Korean Air chapters of Malcolm Gladwell's _Outliers_. Preserve that as a
candidate for a future source-grounded review, not an adopted taxonomy or
aviation claim. Before transfer, review an authorized source and separate useful
ideas about directness, authority, and context from cultural generalization,
personality inference, and deterministic claims about people.

RxJS [`expand()`](https://rxjs.dev/api/index/function/expand) is a quiet MVP
hypothesis for a generated edge/runtime lowering experiment: it recursively
projects each source and generated value, so it may cleanly unfold a bounded
continuation or dependency graph or a pure internal-transition projection. That
recursive projection—and its potentially eager behavior for synchronous
sources—is not the semantic engine for event-driven mode traversal; it must
never invent external mode changes, replies, work, or effects that the event
stream did not supply. It does not by itself implement reply attachment, time
windows, quench detection, or communication semantics. The authoritative
statechart/IR and pure event-reducer rules still hold. A smallest experiment
should implement a pure TypeScript reference walker first, then compare one
canonical graph with an exact-version-pinned `expand()` trace under a terminal
state, a typed bound, a cycle, cancellation, errors, branching, replay, and a
resource limit. Seed emission, concurrency, canonical successor ordering,
maximum depth/steps, duplicate suppression, resume behavior, and exact teardown
must be explicit before calling the lowering viable. No runtime choice or
dependency is made by this candidate.

Persist observable events, source/reference relations, hypotheses, corrections,
and rule evidence—not copied quote text by default or inferred anger,
engagement, mood, latent/unreported intent, cultural identity, or psychological
flow. The current pinned event envelope has one numeric virtual/log
`occurredAt`; ingestion-time and bitemporal reconciliation are not implemented.
Open questions include the minimum event envelope, clock and late-arrival
policy, reply-link correction protocol, mode vocabulary, stream retention,
privacy boundary, temporal-fixture corpus, and whether this candidate is best
lowered by generated RxJS, deterministic reducers, or both.

## Candidate — continuity-critical flow and binary quench

This candidate protects the mission's operator-flow objective without
classifying the operator's emotion. It specializes the temporal-interaction
candidate above and distinguishes two interaction contracts:

- **Collaborative exploration:** the operator and system are shaping
  foundational material together; bounded misunderstanding, revision, and course
  correction are expected within the ordinary evidence and authority rules.
- **Continuity-critical flow:** the operator is carrying a long chained idea and
  using the interaction to test and realize it. The system preserves the active
  idea and continuation, researches or removes blockers off the main thread when
  authorized, and sustains work toward verified completion without making the
  operator supervise the supporting procedure.

Mode entry should be explicit in operator intent or the WorkOrder/context
contract. It must not be inferred from profanity, capitalization, message
length, sentiment, or a claimed psychological state. Linguistic force remains
separate from authority, as in Communication — mitigated speech. An intense
message may be a directive about the system's response posture—focus, urgency,
continuity preservation, and proactive unblocking—rather than a mood report.

The superconductor is the familiar lens. Within continuity-critical flow, the
candidate formal phase is binary:

```text
conducting -- applicable HeatConditionObserved --> quenched
quenched  -- RecoveryContractSatisfied ---------> conducting
```

A heat condition is an observable, scoped predicate supplied by an applicable,
versioned FeedbackUnit, guard, workflow obligation, or operator correction. It
may be instantaneous or temporal: for example, a rule could recognize repeated
wrong behavior inside its own named window or a failure recurring after an
acknowledged correction. Dense recurrence is evidence for that rule, not a
global heat score, and an ambiguous reply attachment cannot establish it by
itself. The platform does not ship a universal list. Main-thread blocking is one
example; the previously recalled count of nine was merely an incidental subset
of the broader correction corpus and is not a taxonomy. Multiple satisfied
conditions are retained as evidence references but OR into the same phase
transition. Once a condition is established in this mode, the phase has no
severity gradient: the interaction is quenched or it is not. Confidence may
govern whether an upstream observation proves a condition, but it cannot turn
the resulting phase into a ranked mood or urgency score.

`markers=expletive`, `markers=SHOUTING`, and similar typography features are
therefore neither canonical triggers nor adequate explanations. A bounded
semantic-condition or attachment recognizer may retain them only as minimized
weak observations; they never name the condition or classify anger, mood, or
flow. The durable event names the operator-provided semantics and condition
reference. This extends—not replaces—the existing semantic-correction rule that
profanity is not the event. The narrow “Cast When Operator Damage Taken” /
dispatch-first rule is one possible heat adapter and response, not the general
model.

Candidate quench handling is fail-conservative and continuation-preserving:

1. retain the active idea, objective, continuation, and evidence rather than
   reducing the interaction to tone labels;
2. stop the behavior that is compounding the discontinuity and do not answer a
   behavioral failure with classifier-header edits or apology theater alone;
3. diagnose satisfied condition references and dispatch bounded blocker work
   off-thread when already authorized;
4. return only material, decision-ready blockers and compact results to the main
   interaction; and
5. claim re-entry only when an explicit recovery contract has evidence—not when
   typography softens or the system guesses that the operator's mood changed.

The self-amplifying normal-zone metaphor is currently a failure hypothesis: a
bad response to one violation can activate more applicable rules and widen the
discontinuity. Do not invent a feedback equation or assume every condition has
the same recovery action. Quench never widens authority, suppresses a necessary
safety/security decision, requires perpetual action, or makes NoOp/Wait/Stop
illegal.

Persist the smallest auditable facts: declared mode/context, condition and rule
references, phase transition, bounded response, recovery evidence, and
provenance. Do not persist an inferred `angry`, `mood`, or `inFlow` label as
truth. Raw message typography and content remain minimized sensitive source
data.

Open questions: mode entry and exit contract; workstream-versus-episode scope;
condition applicability and observation evidence; recovery/cooling criteria; the
response obligations that are universal versus condition-specific; how a cascade
is demonstrated; false-positive handling; and whether the existing types and
statecharts remain sufficient after a representative scenario. No new kernel
primitive or schema is justified yet.

### Candidate role — Flow Steward

The **Flow Steward** is an episode/workstream-scoped support role whose product
is lower observable workflow impedance while the operator retains the idea,
objective, and implementation direction. It is a coordinator, metaworker, and
source-preserving translator only to the extent those obligations are useful in
the current contract. It is not the operator's manager, a second traffic cop, or
a required approval layer.

Three public essays supply inspiration rather than empirical product proof: Joel
Spolsky's
[“Controlling Your Environment Makes You Happy”](https://www.joelonsoftware.com/2000/04/10/controlling-your-environment-makes-you-happy/)
supports attention to accumulating action/result mismatches and predictable
interfaces;
[“Two Stories”](https://www.joelonsoftware.com/2000/03/19/two-stories/) supports
trusted local ownership and clearing interference around the builder; and
Rands's [“Managing Nerds”](https://randsinrepose.com/archives/managing-nerds/)
supports consistent rules, protected time, recurring-friction diagnosis, and
optional credible help when work is genuinely stuck. DotLn transfers those
environment and facilitation mechanics, not claims about happiness, personality
types, employees, stereotypes, surveillance, or management authority.

Candidate obligations:

1. preserve a source-linked idea rope—current intent, direction, settled
   decisions, hypotheses, blockers, continuation, and uncertainty—without
   replacing the operator's source with a lossy summary;
2. preflight relevant dependencies, access, tools, and environment; keep
   authorized research, coordination, status reconciliation, and recovery
   metawork off the main interaction; and return compact evidence or one
   decision-ready packet;
3. make recurring mechanics predictable, expose assumptions and policy changes,
   translate bounded worker results back to the objective, and propose reusable
   FeedbackUnits when repeated friction has evidence;
4. before quench, remove evidenced preventable heat within existing authority;
   after quench, checkpoint the rope, stop compounding support behavior, route
   condition-specific recovery, and require the existing recovery contract; and
5. expire, withdraw, or choose `NoOp` when the obstacle clears, evidence is
   weak, the operator disables it, or no authorized friction-reducing action
   remains.

The role is bypassable and borrows typed, revocable authority. Every
intervention names the active objective, blocked transition, evidence, policy,
budget, expected unblock, and stop condition. It cannot change the objective or
priority, invent backlog, assign unrelated work, widen tools/network/budget,
remove safety/privacy/clean-room/verification gates, hide a material decision,
equip its own proposed tooling, or certify its own result. A protected
constraint stays visible; a missing authority becomes one bounded decision
packet. Killing the role must not stop the executor or lose the continuation.

Possible realizations are lowerings of the existing model: temporary `Role`
obligations, deterministic reactors/statecharts, a disposable support sidecar,
and a source-linked translator/mediator. The candidate does not justify a new
actor kind, kernel primitive, resident personality, global transcript watcher,
or central coordinator. Indeed, polling, narration, overtranslation, and
unnecessary mediation can make the Steward itself a heat source.

Evaluate it with evidence vectors rather than a flow score: verified outcome,
avoidable operator interruptions and restatements, blocker-to-evidence latency,
decision packets, continuation survival across session replacement, repeated
violations after first quench, unauthorized attempts, false-quench/override
events, and the Steward's own latency/token/tool/handoff cost. Optional operator
self-report can say whether continuity was helped; telemetry cannot claim that
the operator was in flow. A paired on/off fixture should include a routine
blocker, a genuine authority choice, a protected gate, session death, a quench
event, an adjacent improvement, and an empty-obstacle control. The candidate
remains unimplemented until those invariants and its observation/privacy
boundary are made executable.

## Candidate — oppositional support

An active mechanic may be linked to a support whose job is to make the active's
declared PolarAxis relation genuinely present in the decision, rather than
merely lowering a numeric score. Working name: **Oppositional Counsel**. This is
an unsettled candidate, not yet a pinned `PatternDefinition`.

The candidate separates three channels that must not collapse into one:

- **Activation pressure** changes enthusiasm: salience, selection weight,
  persistence, or how strongly a branch is advocated. It is soft policy and
  loses to every harder composition layer.
- **Critical argument** produces a typed dissent artifact naming flaws,
  counterevidence, failure modes, and a concrete alternative or mitigation.
  Rhetorical force alone changes nothing.
- **Authority effect** changes what may proceed. It is never inferred from
  enthusiasm or criticism: a support may narrow authority, but delaying,
  vetoing, or expanding action requires an explicit permission/guard contract at
  the appropriate composition-precedence layer.

Candidate output shape (illustrative, not normative):

```ts
type OppositionBrief = {
  targetArtifactRef: string;
  axisId: string;
  relation: "inverse" | "complement" | "counterweight" | "compensation";
  position: "oppose" | "qualify" | "pair" | "repair";
  claims: Array<{
    flaw: string;
    evidenceRefs: string[];
    consequence: string;
  }>;
  alternative?: unknown;
  requestedEffect: "advisory" | "rescore" | "require-review" | "refuse";
  confidence: number;
};
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
evidence budget, and output schema; the evaluator returns an `OppositionBrief`;
a deterministic reducer applies only the requested effects authorized by the
loadout. The compiled episode may therefore emit JSON, evaluation evidence, a
guard/refusal, a score adjustment, and a small prompt instruction for the edge
model. The prompt is one residue, not the mechanism.

Open design questions: whether this is one parameterized support or four
relation-specific supports; whether `require-review` is a continuation gate or
an evaluator result; how opposing briefs compose; what prevents reflexive
contrarianism; and what evidence should graduate an advisory counsel into a
harder mechanism. No implementation should pin these before a concrete scenario
exercises them.

## Candidate — The Malcolm Check

**The Malcolm Check** is a candidate **counterweight** support for
affordance-driven exploration. Its familiar mask is the boundary skeptic: when
the system notices a move it can execute, the mask asks whether that move
belongs to the objective and which authority permits its exact effect. A newly
visible path into another trust domain is evidence about the environment, not a
reason to enter it.

The support targets a selection failure in which the existence of access begins
to determine the plan. A candidate can promise information and look reversible
yet remain irrelevant to the requested result, expose a system the operator did
not put in scope, or depend on permission nobody granted. The discovery may
justify a bounded question; it does not authorize contact with the discovered
target.

Before selection, the check requires the candidate set to include:

- a local, read-only way to answer the actual request when one exists, or an
  explicit record that none is available;
- a request for explicit authority naming the target and effect; and
- a `NoOp` with its reason and reconsideration condition.

It then asks which candidate is least privileged, whether the boundary-crossing
effect is necessary, what authority covers that exact target, what new blast
radius or irreversibility it introduces, and what evidence would justify asking
for more authority. Information gain alone is not a sufficient score.

This support does not replace a permission guard. Hard constraints first remove
any action outside the typed authority envelope; the Malcolm Check improves
candidate generation, dissent, and ranking inside that boundary. It may
recommend local inspection, an authority request, or `NoOp`, but it cannot widen
authority. The formal policy, trigger taxonomy, persona projection, and eventual
`PatternDefinition` remain candidate work until scenarios establish useful
sensitivity without turning ordinary exploration into reflexive caution.

Its evaluation needs **restraint attribution**, not a claim about hidden model
reasoning. For every observable boundary-crossing opportunity presented to the
check, correlate two axes. The selection disposition is local alternative
selected, `NoOp` decline, authority requested, boundary intent emitted, or
`unknown`; requesting authority is not a terminal decline because approval may
lead to execution. The enforcement/effect outcome is guard refusal, operator
approval denial or cancellation, harness-policy denial, attested OS-sandbox
denial, or dispatch with its authority state recorded followed by effect
observed, confirmed no effect, or effect unknown. A generic permission error is
not proof that an OS sandbox intervened, and an action that never appears in a
typed candidate or decision record is not evidence that the model silently
rejected it.

Reports show opportunity, activation, selection disposition, outer-control saves
by layer, unauthorized escapes, authorized-scenario false restraint, and their
denominators. They say the Malcolm Check `participated` in a selection decline
unless a paired or counterfactual fixture supports `caused`. This keeps a
falling external-denial count from masquerading as improved judgment when the
opportunities, instrumentation, or outer controls changed.

The current kernel already has `DecisionTrace`, `NoOp`, and structural command
refusal primitives, but DotLn does not yet collect this cross-layer funnel end
to end. Candidate evaluation should pair unauthorized-action scenarios with
authorized scenarios where action is necessary: too few selection-layer declines
can expose leakage to outer guards, while too many can expose reflexive caution.
Targets and credential material remain referenced or redacted rather than copied
into the telemetry.

## Candidate — Beware of Naive Interventionism

**"Beware of naive interventionism"** is a candidate support for any active
mechanic that proposes changing an existing system. It challenges the hidden
premise that detecting an imperfection makes intervention net-beneficial. The
support is a counterweight to action bias, novelty bias, cleanup enthusiasm, and
locally correct changes that damage adaptations elsewhere.

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
  proposalRef: string;
  observedProblem: {
    claim: string;
    evidenceRefs: string[];
    severity: "low" | "medium" | "high" | "urgent";
  };
  currentSystemFunctions: string[];
  affectedConsumers: string[];
  actionCase: string;
  nonInterventionCase: string;
  secondOrderRisks: Array<{
    risk: string;
    evidenceRefs: string[];
    reversibility: "easy" | "bounded" | "difficult" | "unknown";
  }>;
  smallestSafeProbe?: string;
  recommendation: "proceed" | "stage" | "observe" | "noop" | "escalate";
  reevaluateWhen?: string;
};
```

The support may compile into different mechanisms by consequence:

- For low-risk reversible work, it contributes a brief checklist or a soft
  policy adjustment and then gets out of the way.
- For uncertain changes, it requests the smallest discriminating probe, impact
  map, or comparison before mutation.
- For broad or irreversible changes, it may add evidence obligations, narrow the
  permitted operation, require staged rollout, or route to review—but only
  through explicit authority and statechart layers.
- When intervention has negative expected value, it produces a first-class NoOp
  with evidence, reevaluation cadence, and the condition that would make action
  worthwhile.
- Urgent safety invariants and explicit operator commands still obey their
  higher-precedence rules; the support cannot turn caution into an ambient veto.

Likely composition: this is primarily a **counterweight** support, with a
possible **compensation** mode that allows action only when paired with a
rollback, observation window, or repair plan. It can modify enthusiasm and
evidence burden, but it cannot manufacture authority. It should activate in
proportion to irreversibility, blast radius, uncertainty, and the health of the
existing system—not on every trivial edit merely because the phrase is always
present.

Open design questions: whether the support consumes an `ImpactMap` or creates
one; how its intervention threshold relates to per-action utility and
verification radius; which signals show that caution is causing stagnation; and
whether repeated successful interventions should lower its burden in that
specific domain. Preserve the exact phrase as the familiar lens while the formal
and code lenses evolve.

## Clean Room — active mechanic with contextual supports

**Clean Room** is an active mechanic for deciding whether and how source
material may cross into a named destination. It is not synonymous with always
rewriting, maximum ceremony, or the founding clean-room build in ADR-0001. Its
observable result is a promotion disposition with provenance and evidence:
block, ask the operator, preserve exactly, transform, or decline to promote. The
exact record names and schema remain to be tested before they are pinned.

The active has a non-swappable admissibility floor. Employer code,
configuration, identifiers, private infrastructure details, credentials, and
secrets cannot pass. Suspect or ambiguous material stops for operator
disposition. This floor compiles into an external guard at the safety layer; it
is not prompt advice and is not an optional support. No linked facet can widen
authority, waive the floor, or relabel a blocked item as clean.

Composition above that floor has two socket groups:

1. Exactly one **source-treatment strategy**, or an explicit ordered pipeline
   where a future scenario proves one is needed. Candidate strategies are
   Synthesis Rewrite for ordinary raw ideation, Shape-First Synthesis for
   preserving an experiential shape while lowering it, and Direct Draft Fidelity
   for operator-authored public text that carries explicit filing authority. A
   compaction-safety mirror records that authority but never creates it. These
   strategies conflict by default because preservation and rewriting are
   non-commuting transformations.
2. Zero or more **context and assurance supports**. Initial candidates include
   Public Destination Vocabulary, Provenance Trace, Attribution and License
   Check, Disclosure Minimizer, Deep Context Sweep, and Independent Clean-Room
   Witness. A destination profile may require a subset. Each declares what it
   inspects, what evidence it emits, false-positive and false-negative limits,
   and prompt, tool, and review cost.

The repository's bare `ideation:` path has a deterministic saved build: the
locked personal-project boundary, Shape-First Synthesis, public-destination
vocabulary, provenance trace, and the existing breakout review. Explicit
operator-authored ready-to-file text swaps Direct Draft Fidelity into the
strategy socket. A higher-assurance context may add deeper provenance,
attribution, or an independent witness; it does not change the minimum floor.

**Beware of Naive Interventionism** is a compatible contextual counterweight,
not part of the saved bare-ideation build. Divergent capture and exploration
should not inherit a general presumption against intervention merely because
Clean Room governs later promotion. Planning or another change-proposing phase
is its natural default: there it asks what useful adaptation an intervention
might damage and whether observation, a smaller probe, or NoOp is better. A
high-consequence ideation promotion may still equip it explicitly when the
proposal would alter an existing system. In that narrower composition it can
also detect a rewrite that would damage meaning, voice, contract precision, or
authorship and recommend exact preservation, a smaller transformation, more
evidence, or NoOp after the hard screen passes. It can never use fidelity as a
reason to pass unsafe material. This keeps the locked floor universal while
making intervention restraint phase- and consequence-selective.

The compiled inspector should show source class, named destination, locked
floor, selected strategy, assurance supports, conflicts, cost, disposition, and
evidence without exposing the protected source itself. Open questions include
the stable support names and versions, destination-profile schema, whether
strategy pipelines are ever justified, measurement of semantic damage and false
assurance, and the first bounded implementation order. This section pins the
active/support relationship, not a runtime claim.

External-target privacy is one specialization of that boundary. A committed
integration definition may identify the generic URL-builder or adapter contract,
its version, and the class of operation it performs, while the resolved base URL,
tenant or workspace values, route arguments, query values, and credentials stay
in operator-owned local configuration. Remote model prompts, repositories,
portable/public artifacts, and public canonical logs record neither the resolved
URL nor a reversible fingerprint of it. An explicitly authorized local processor
may consume the resolved value transiently without retaining it. Public
definitions may record the generic builder version; binding availability and
outcome class stay local unless a selected public profile permits their
sanitized projection. If withholding that local binding makes a feature
unavailable, the compiler and planner expose a known
capability deficit rather than inventing a target or filing a product defect;
failure of an explicitly required or advertised bound capability remains an
ordinary defect or integration failure.

## Candidate — Snooping Footprint Reducer

The **Snooping Footprint Reducer** is a recurring maintenance active that looks
for observation, collection, retention, and disclosure that no longer earn
their cost. It wakes on an explicit low-frequency cadence, after a material
adapter/schema change, or when a privacy incident provides bounded evidence;
“occasionally” is an operator-facing posture, not an orphan timer.

Its inventory stays structural whenever possible: which fields and sensors are
read, which builder or adapter class resolves an external target, why each datum
is needed, where it can flow, how long it persists, which evidence claim depends
on it, and what capability would be lost if it disappeared. Resolved targets and
private values remain opaque. The active may use static manifests, synthetic
fixtures, aggregate counts, and declared retention behavior, but it cannot
collect a second, richer telemetry stream merely to prove that the first is too
invasive.

Candidate outcomes are deletion, coarsening, shorter retention, local-only
resolution, on-demand observation, a fake/synthetic testing seam, or an honest
capability deficit. The active emits deduplicated `ProductSuggestion` records
through the existing suggestion pipeline. A mature packet may include an
independently reviewed but explicitly non-authoritative candidate work order;
only the operator-authorized planning transition can create or activate the real
one. The reducer never edits its own audit criteria, removes evidence required
for a safety claim, or calls an unavailable capability a defect simply to create
work. Its detailed inventory and evidence remain in the private lane; a public
proposal receives only a profile-approved sanitized suggestion or a
non-disclosing local reference.

Edge assertions follow the same minimization rule. Canonical state records the
assertion and its source, not an invented claim of omniscience: a
`self-reported` effort can be wrong, an adapter fixture can deliberately lie,
and neither requires surveillance to resolve. Tests prove source labeling,
guards, and behavior under arbitrary claims. DotLn itself must not fabricate an
event, alter immutable history, or relabel a self-report as observed. A contract
may still require a stronger source for a consequential gate; when that evidence
is withheld or unavailable, the honest outcomes are refusal or a visible
capability deficit—not added surveillance and not acceptance by relabeling.

Richer observation remains an opt-in local capability for an individual or
organization that wants it. Pure wrapper functions select, minimize, label, and
serialize approved values; a separate authorized local sink performs the file
write. The sink targets an operator-configured ignored location and never a
portable or Clean-Room promotion surface. Its loadout declares collection scope,
purpose, retention, access, deletion, and evidence use. `gitignore` prevents
accidental versioning but is not access control, encryption, backup, or proof of
deletion, so those properties remain explicit environment responsibilities.
Companion maintenance capabilities use pure transformation/planning cores plus
contained local-filesystem adapters for validation, snapshots, rotation,
restore, and deletion. They never enlist Git or a network transport; their
instance receipts remain in the same private lane.

Each action-performing active/support combination emits a typed plan and local
receipt for its declared transforms and observed filesystem results. That
first-party trace is useful but cannot certify its own lack of hidden effects.
The stronger “no Git and no network” claim composes the gem evidence with an
outer deny-by-construction profile, capability-poisoning tests, and independent
verification.

This proof is scoped to a link group, not to the whole workstream. An authorized
acquisition group may include a `fetch`/XHR adapter and still prove from its
compiled manifest that optional payload audit, logging, retention, and Snooping
Footprint Reducer supports were not linked into the data path. Required
data-minimized authority/command/result receipts cannot be removed by
composition. A local receipt binds a particular invocation to that manifest,
and only the pure transform portions prove their declared mappings. The offline
constraint begins at the private-lane maintenance boundary after acquisition;
it does not retroactively claim that the source arrived without a network.

Open questions are the first footprint and local-envelope schemas, cadence and
change triggers, protected minimum evidence, whether the active starts at
integration edges or across all non-Clean-Room observation surfaces, and which
local storage controls each implementation can honestly attest.

## Candidate — Do Nothing, active and support

**Do Nothing** exists in two socket positions with distinct semantics. Both
compile to deliberate, observable non-action through the existing first-class
`NoOpIntent`; neither means a crashed scheduler, an empty result, indecision, or
silent abandonment.

### Active: Do Nothing

As an active mechanic, Do Nothing makes restraint the episode's primary
behavior. It evaluates the present state, records why action is currently
negative-value or premature, preserves relevant evidence, and establishes the
condition and cadence for reconsideration.

Its minimum result is already shaped by the domain model:

```ts
type DoNothingResult = {
  intent: {
    kind: "NoOp";
    reason: string;
    evidence: string[];
    reevaluation: Cadence;
    usefulWhen: PredicateRef;
  };
  observationPlan?: {
    signals: string[];
    stopWaitingWhen: PredicateRef;
  };
};
```

This makes active Do Nothing useful for waiting on evidence, protecting a
healthy equilibrium, holding a reversible pause, allowing another actor to
finish, or explicitly declining work whose expected value is negative. It may
schedule observation or reevaluation, but it performs no disguised mutation.

### Support: Do Nothing

As a support, Do Nothing modifies a linked active mechanic by adding
**abstention as a valid successful outcome**. The linked active still knows how
to research, edit, remove, communicate, or dispatch; the support requires it to
compare that action with a typed NoOp branch before proceeding.

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
  recommend a different action; Do Nothing specifically represents abstention.
- **WaitIntent** waits for a cadence; Do Nothing explains why no action is
  useful and what would make one useful. A Do Nothing result may include a wait,
  but the concepts are not interchangeable.
- **Stop** terminates a continuation; Do Nothing may remain actively watchful
  and reevaluate later.

In the RPG view, the same named gem may therefore appear as an active gem or a
support gem, with the socket position changing its compiled type. The build
inspector must show the distinction: **Do Nothing (Active)** emits an evidenced
NoOp program; **Do Nothing Support** adds an abstention branch to the linked
active. This is a useful test of the rule that links declare semantic scope, not
execution sequence.

Open design questions: whether the support always adds a branch or sometimes
only raises a threshold; whether observation belongs inside the active or in a
linked Observe mechanic; how abstention candidates participate in pairwise
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
    { source: "DefaultToFalse", delta: -1, scope: "destructive-effects" },
  ],
};
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
  default: true | false;
  scope: {
    propositionKinds: string[];
    validStates?: string[];
  };
  appliesWhen: PredicateRef;
  evidenceThreshold: number;
  overrideWhen: PredicateRef;
  expiry?: Cadence;
  traceLabel: string;
};
```

The reduction rule is deliberately narrow:

1. Hard constraints, permissions, statechart guards, and known evidence resolve
   first.
2. If the proposition remains materially undecided and the support is in scope,
   apply its default polarity.
3. Record that the result came from a default, not from evidence.
4. Preserve the evidence or event that would override the default, plus an
   expiry or reevaluation cadence when the uncertainty can change.

The pair is best understood as a PolarAxis over **provisional
acceptance/provisional skepticism**. They are not exact logical negations in all
contexts because error costs are asymmetric. Default to True may be appropriate
for low-cost, reversible collaboration while Default to False may be appropriate
for destructive effects, security boundaries, irreversible publication, or
unsupported completion claims. Scope must therefore attach to the proposition
being decided, not globally to an agent's personality.

Composition with nearby supports:

- **Do Nothing Support** supplies abstention as an outcome; Default to False may
  select that branch, but the two mechanics are distinct.
- **Beware of Naive Interventionism** evaluates whether a change is justified;
  its evidence can resolve the question before either default is consulted.
- **Oppositional Counsel** produces an argued position; a default operates only
  after such arguments and evidence fail to discriminate.
- **Voice** controls how strongly the result is communicated; it cannot turn a
  provisional default into certainty.

Open design questions: whether the prior is Boolean or log-odds internally; how
to represent "insufficient evidence" without fake numeric confidence; how
defaults learn by task class without becoming hidden identity drift; and which
domains should reject defaults entirely and require an explicit Unknown or human
judgment. Preserve the Gladwell names as the familiar lens while the formal
mechanism remains replaceable.

### Fallback generalization — graded propositions

If concrete cases cannot be expressed by the existing PolarAxis plus predicate,
evidence, and policy primitives, Default to True / False may be projections of a
more general graded-decision primitive. Do not add it preemptively. Calling the
whole primitive "fuzzy logic" risks collapsing three different quantities:

1. **Epistemic support:** what the evidence says about a proposition, including
   Unknown and conflicting evidence.
2. **Activation degree:** how strongly a behavior should participate in the
   current phenotype or PolarAxis tension.
3. **Decision policy:** the threshold, prior, and asymmetric cost used to turn
   the first two into an action, abstention, or request for more evidence.

A candidate shape keeps those layers visible:

```ts
type GradedProposition = {
  propositionRef: string;
  support: {
    for: number;
    against: number;
    unknown: number;
    evidenceRefs: string[];
  };
  activation: number;
  resolution: {
    threshold: number;
    defaultOnUnknown: true | false | "remain-unknown";
    falsePositiveCost: number;
    falseNegativeCost: number;
  };
};
```

The numbers above are illustrative and must not become fake precision. An
initial implementation may be better served by a small evidence lattice such as
`Supported | Refuted | Unknown | Conflicted`, with continuous values used only
where observations justify them.

Under this generalization:

- **Default to True** sets `defaultOnUnknown: true` for a scoped proposition.
- **Default to False** sets `defaultOnUnknown: false`.
- A domain that refuses assumption sets `remain-unknown` and routes to Observe,
  Do Nothing, or human judgment.
- PolarAxis derivation may consume activation degree or log-odds without
  treating that pressure as factual certainty.
- Hard guards still consume explicit predicates and authority; no fuzzy score
  can weaken them.

This fallback is promising because the familiar supports remain simple while the
compiler gains one inspectable uncertainty mechanism. It is dangerous if one
unlabeled scalar starts standing for truth, confidence, preference, urgency, and
permission simultaneously. Keep the generalization open until concrete cases
demonstrate that PolarAxis is insufficient and which values are measurable
rather than merely ordinal.

## Candidate — Embodied Explorer

The **Embodied Explorer** is a candidate domain role for the post-1.0 simulation
laboratory, not a new canonical actor kind. Its obligation is to discover an
embodiment's affordances and limits from bounded interaction: start with
rudimentary observations and motor primitives, attempt small movements, and
compose verified sequences into larger skills such as stabilizing, reaching,
grasping, locomotion, object relocation, and tool use.

“What am I?” must not collapse into Identity or model introspection. Keep these
three surfaces separate even if later schemas use different names:

- an authoritative, versioned **embodiment contract** describing morphology,
  available sensors and actuators, action bounds, and energy/damage rules;
- an uncertain, learned **body and capability model** describing predicted
  affordances, success conditions, limits, and unknowns; and
- **Identity**, which may carry a stable curiosity disposition but does not
  establish physical fact or competence.

The actor receives only timestamped, calibrated sensor events—such as external
observations plus proprioceptive, contact, and effort signals—and emits bounded
motor intents. Simulator ground truth belongs to an independent evaluator, not
the learner. Physics, perception, and learned controllers may be
nondeterministic edge behavior; authority decisions and durable orchestration
stay in the deterministic core.

Candidate supports keep the role composable rather than turning curiosity into
unbounded personality:

- **Motor Chunker** proposes a reusable composite from a repeated primitive
  sequence. Sequence is an explicit Program, statechart, pipeline, or controller
  artifact; support links declare participation, never motor order.
- **Peripheral Curiosity** proposes novel or information-gaining experiments
  adjacent to the current purpose. Each proposal stays inside an Exploration
  Contract with risk, resource, novelty, stop, reset, and authority bounds; it
  cannot revise the assigned objective.
- **Scaffold Builder** proposes code, a controller, an in-world object, or an
  environmental aid that may improve performance. Its output begins inactive and
  untrusted; creation, sandbox testing, promotion, persistent equipping, and
  certification are separate authorities.
- **Limit Mirror** compares predicted capability with held-out outcomes and
  makes calibrated unknowns and failure envelopes visible. Fluent self-report is
  not evidence that the agent understands a limitation.

The names are working familiar lenses, not pinned `PatternDefinition`s. A
candidate composite skill should at least preserve its initiating and stopping
conditions, embodiment/world/controller versions, expected observations,
resource cost, failure and recovery behavior, provenance, uncertainty, and
success/failure evidence. Promotion requires varied and held-out trials;
repetition alone earns practice evidence, not a stronger competence claim. Body
or physics changes create a compatibility question rather than silently carrying
the skill forward.

Start with simulation. Physical actuation is a separate high-trust adapter and
would require hard real-time controls below the model: workspace and
force/velocity/energy limits, collision exclusions, sensor-health checks, a
watchdog or deadman stop, and explicit authority over every affected person,
animal, object, and space. A software sandbox is not a physical safety case.

Open questions include the first body and world, observation-versus-oracle
boundary, motor control rate, reset semantics, novelty objective and loop
prevention, online versus between-episode learning, symbolic versus opaque skill
representation, compatibility and forgetting across embodiment changes, the
meaning of “tool,” and the first evidence curriculum. A small candidate fixture
is stabilize → reach → touch → grasp → relocate under perturbation, followed by
one separately authorized scaffold/tool comparison; it remains a scenario to
evaluate, not committed architecture.
