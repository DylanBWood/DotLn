# Architecture and games — breadth addendum

Research date: 2026-09-07. AGA-01–AGA-35 preserve distinct alternatives and leads
that the first eight concepts bundled together or omitted. These are original
DotLn hypotheses, not findings that the repository lacks their machinery.
The reader performed no new browsing for this addendum. Ranking must preserve
these records even when several feed one experiment or remain deferred.

## Substantively grounded alternatives

### AGA-01 — Package a contract separately from interchangeable implementations

Separated Interface places an interface apart from its implementations so
dependencies can point toward the contract.
[Fowler catalog](https://martinfowler.com/eaaCatalog/separatedInterface.html).
The temporal lab, ordinary execution and a simulated device could consume a
shared observation/action contract with different implementations. This is
distinct from an application Service Layer (AG-01). Substitute a recorded-result
adapter for a live adapter without changing policy. Reject an abstraction that
only renames existing types or conceals capabilities that are not shared.

### AGA-02 — Let local and remote operations have different physical interfaces

Fowler's 2014 distribution article is a later supplement, not the original book.
Network latency, failure and granularity affect design.
[Article](https://martinfowler.com/articles/distributed-objects-microservices.html).
Preserve a logical operation while allowing a remote adapter to batch requests
and return pending state. Inject delay/unavailability into a simulated-device
operation and inspect authoring, cancellation and progress. Local-to-remote
substitution must not be represented as behaviorally transparent.

### AGA-03 — Keep a predetermined route as a positive alternative

Process Manager contrasts dynamic coordination with a Routing Slip when the
sequence is known, and warns about coordination overhead/bottlenecks.
[Entry](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ProcessManager.html).
Express a linear workshop recipe as an ordinary sequence. Then add a branch
whose next step depends on its result. Identify the exact new requirement that
needs more coordination. A known recipe is an option, not merely a prohibition
against a universal manager (AG-05).

### AGA-04 — Preserve five distinct ways to finish a collection

The consulted Aggregator entry identifies five completion alternatives.
[Entry](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Aggregator.html).
Run each against the same trace; compare selection, completion time, cost and
late-result treatment. These are choices in a join design, not five mandatory
kernel additions (AG-04).

| Stable alternative                                | Original experiment                                       | Distinction to retain                                                                 |
| ------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| AGA-04a: all expected contributions               | Require three distinct artifacts; omit one                | Membership/absence matters; a count can conceal a missing role                        |
| AGA-04b: collection deadline                      | Inspect evidence available at a chosen virtual time       | Closing partial collection does not mean every contribution succeeded                 |
| AGA-04c: first arrival                            | Compare a fast acceptable answer with slower alternatives | Fastest expresses latency preference, not best quality                                |
| AGA-04d: quality threshold plus deadline fallback | Use deterministic fixture scores and a declared threshold | Score meaning/provenance belongs to the policy; unsupported self-rating is inadequate |
| AGA-04e: explicit closing event                   | End a round by operator action or a prerequisite event    | Event closure differs from predicting the event with a timer                          |

### AGA-05 — Bound resequencing and its downstream obligation

Resequencer buffers related messages and depends on an order-preserving next
channel. [Entry](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Resequencer.html).
Show arrival, prerequisite and intentionally ordered output separately. Deliver
1, 3, 2; repeat with 2 missing. Compare an ordered consumer with an unordered
collector. Declare the sequence boundary and missing-element behavior. Do not
retroactively reorder the accepted event log (AG-04).

### AGA-06 — Distinguish transactions from temporary delivery ownership

Transactional Client describes committed send/receive boundaries; its current
website also contrasts a visibility timeout with transactional messaging. The
modern example is not evidence from the 2003 edition.
[Entry](https://www.enterpriseintegrationpatterns.com/patterns/messaging/TransactionalClient.html).
Adapter capability records can separate durable recording, temporary ownership,
acknowledgment and effect idempotency. Run two fake transports with different
redelivery behavior; the lab must show their distinct recovery behavior instead
of labeling both transactional (AG-03).

### AGA-07 — Retain evidence after an action expires

Message Expiration discusses unusable messages and dispositions such as ignore,
drop or alternate routing.
[Entry](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageExpiration.html).
Action authority, proposal usefulness and historical retention can have different
lifetimes. Expire an action, then inspect its evidence in a comparison without
re-enabling it. This supplements existing stale-result machinery (AG-02).

### AGA-08 — Make a pattern catalog an authoring vocabulary

The author-maintained EIP catalog names patterns and their relationships.
[Catalog](https://www.enterpriseintegrationpatterns.com/patterns/messaging/).
A workshop card can contain situation, parameters, expected trace, failure
example, alternatives and executable fixture. Let the operator compare two
completion cards on one trace and explain their difference without code.
The product is a usable behavioral example; implementing every named pattern is
not a prerequisite.

### Millington grounding for AGA-09–AGA-18

The previously inspected introductory sections 1.2–1.3 and 2.1–2.4 discuss group
and individual control, hybrid simulation, algorithms/representation, world
interfaces, replaceable behaviors, authoring effort, selective execution,
environmental failures and accidental teaching. These motivate the following
independent experiments. They are stronger grounding than the later
contents-only leads. [Third-edition preview](https://api.pageplace.de/preview/DT0400.9781351053297_A36789489/preview-9781351053297_A36789489.pdf).

### AGA-09 — Vary group instructions separately from individual policy

Give a troop one group objective while members retain local conditions and
permitted actions. Hold ten individual policies fixed and change only the group
instruction; then reverse the intervention. Compare coordination. Ten visible
actors do not imply ten independent planners or one all-controlling planner.

### AGA-10 — Declare simulation granularity as a model choice

Preserve explicit individuals, aggregate behavior and hybrid models as options.
Start with ten toys. At larger scale compare aggregate behavior with selected
explicit actors and record divergence. Aggregation changes the simulation model;
it cannot silently replace detailed execution while claiming identical history.
The experiment does not establish validity for real human communities.

### AGA-11 — Diagnose policy, supporting data and world representation separately

The same visible failure can come from a policy, lookup structure or incomplete
represented world. Make three fixtures with those distinct causes. Require the
inspector to locate the faulty input/transformation, not simply label behavior
wrong. Different causes imply different fixes.

### AGA-12 — Develop the complete experience with replaceable placeholder actors

Toy, recorded-output and model-backed controllers can implement a bounded actor
contract. Complete author → run → inspect → change → compare with a deterministic
placeholder, then substitute recorded model results. Expose unsupported
capabilities; interchangeable implementations need not promise identical behavior.

### AGA-13 — Measure the effort of authoring behavior data

Moving logic into data may just relocate programming. Ask the operator to change
one timing rule across ten actors, add an exception and compare old behavior.
Measure edits, errors and time. This is a separate quality criterion from
runtime correctness and execution cost.

### AGA-14 — Allow editing surfaces suited to different structures

Compare a visual branching representation with compact text for complicated
matching expressions. Give both the same policy/exceptions and test edit accuracy
and explanation. A visual lab need not force every condition into boxes. An
internal graph is not itself a usable graphical editor (AG-06).

### AGA-15 — Separate a decision, its actuation and observed confirmation

Have a toy, worker or device request a state change while an adapter delays,
rejects or partially performs it. Show requested action and observed completion
as distinct states. Animation is not evidence that an external effect occurred.

### AGA-16 — Treat environment and adapter changes as candidate fixes

A correct destination may be unreachable; a requested device capability may be
unavailable. Compare changing world constraints, adapter and controller. Record
which removes the failure before making the controller more sophisticated.
This is a distinct intervention from AG-07's observation comparison.

### AGA-17 — Detect an unintended rule taught by feedback

Apply one narrow correction and inspect unrelated scenes before adoption.
Make scope and exceptions editable. Accidental generalization is a specific
authoring failure even with explicit feedback. Reuse typed correction/adoption
boundaries; automatic learning is not presumed (AG-06).

### AGA-18 — Decouple display refresh from evaluation frequency

Keep ten actors visible while evaluating only actors whose declared inputs or
deadlines require it. Compare with evaluation on every display step. Report
invocations, decisions and timing differences. First establish semantic
preservation for the supported policies; lower invocation count alone is not
success.

## Contents-only leads: detailed reading is the reopening condition

AGA-19–AGA-35 were discovered in contents, not substantive algorithm chapters.
Their algorithms, correctness and suitability remain uninspected. Chapter
numbers follow the actual third-edition
[preview](https://api.pageplace.de/preview/DT0400.9781351053297_A36789489/preview-9781351053297_A36789489.pdf);
later tooling/genre contents also appeared in the
[licensed listing](https://www.oreilly.com/library/view/ai-for-games/9781351053280/).
The experiments below are original admission proposals, not source claims.

### AGA-19 — Compare scheduling choices (10.1)

Keep interruption, load balancing, hierarchy and priorities individually
recoverable. Give ten synthetic actors unequal work and urgency within a fixed
budget; compare latency, starvation, cancellation and reproducibility. Read the
chapter before choosing an algorithm; add-a-scheduler is insufficiently specific.

### AGA-20 — Expose useful partial results under bounded work (10.2)

Anytime algorithms are a lead. Use deterministic search with an inspectable
candidate after each bounded step; stop at several budgets and show quality
versus effort. Arbitrary model calls are not assumed to expose valid partial
answers or equivalent interruption.

### AGA-21 — Separate three kinds of reduced detail (10.3)

Scheduling, behavioral and group detail are distinct. Vary evaluation frequency,
policy simplification and aggregation independently. Identify cost changes
versus changed modeled behavior instead of one unlabeled performance switch.

### AGA-22 — Compare polling with change events (11.1)

Feed a simulated sensor through periodic samples and explicit events. Include a
brief change between polls, delayed event and duplicate event. Compare actual
observations. This can make timing authoring visible before choosing a
production messaging framework.

### AGA-23 — Vary observation delivery separately from world truth (11)

Event management, actor communication and sensing are separate leads. Vary
sensor availability, delivery delay and actor messages independently. This
extends AG-07 toward delivery mechanics without exposing unsensed information.

### AGA-24 — Declare available objects and actions (12.3)

Give toy, worker and device skins different capabilities. Reject an impossible
authored action before execution and explain the missing capability. Measure how
much portability survives explicit differences.

### AGA-25 — Choose editor, script and implementation language independently (12–13)

Encode one policy as existing compiled data and as a bounded expression. Compare
validation, round trips, diagnostics and versioning. Preserve using the existing
representation as an alternative to inventing a DSL. No framework or language
selection follows from the contents.

### AGA-26 — Inspect an actor across a process boundary (12.4)

Remote debugging is a lead. Run a synthetic actor elsewhere while inspecting
recorded inputs/actions/outcomes. Prove useful inspection without colocation;
specify control separately from observation.

### AGA-27 — Compare decision representations (5)

Decision trees, state machines and behavior trees remain alternatives. First
express a bounded behavior with the supported grammar. Admit another structure
when it improves required authoring, understanding or execution. A contents
entry does not provide implementation guidance.

### AGA-28 — Search a tiny synthetic adversarial space (9)

Minimax, MCTS, evaluation functions and iterative deepening are distinct leads.
Use a fully specified tiny game with fixed actions/measurable outcomes; compare
search with a simple policy. Keep this apart from claims about realistic people,
organizations or general model planning.

### AGA-29 — Reuse equivalent explored states (9)

Transposition tables/hashing suggest a deterministic toy-search comparison:
fresh exploration versus a cache keyed by complete relevant state and policy
version. Change an observation or rule to test invalidation. Caching does not
make fresh stochastic model calls deterministic.

### AGA-30 — Select a known routine instead of planning anew (9.6, 14.5)

Opening books, set plays and playbooks are leads. Author small troop routines
with preconditions and expected traces. Compare selecting/parameterizing a
routine with constructing behavior anew; show where a routine stops fitting.
The workshop can become a library of tested starting behaviors.

### AGA-31 — Test whether the operator learns to predict behavior (15.1)

After a correction, ask for predictions on unseen synthetic scenes and compare
execution. Authoring should improve anticipation, not only pass its own fixtures.
This is distinct from AGA-17's correction-scope correctness.

### AGA-32 — Explore collective behavior from simple local interactions (15.2)

Flocking, herding, stability and ecosystem design are leads. Give ten toys a
few local rules; change one parameter and compare centralized instructions.
Retain oscillation, deadlock and initial-condition sensitivity as outcomes. This
is a toy interaction experiment, not evidence about real social dynamics.

### AGA-33 — Resolve incompatible action proposals explicitly (3.4)

Blending, priorities and arbitration are distinct options. Equip two behaviors
requesting incompatible actions; compare declared priority with a meaningful
combination rule. Permissions/authority cannot be averaged like movement vectors.
Reconcile this application question with existing multi-active work.

### AGA-34 — Let capabilities constrain action realization (3.8)

Motor control/capability-sensitive behavior are leads. Apply an intended action
to different movement limits or supported device states. Separate same goal,
same policy and same physical execution. Portability is more precise than a
changed visual skin.

### AGA-35 — Reassign roles and formation slots (3.7)

Formation, slot assignment and roles are leads. Give ten toys a formation task,
remove a participant and change a capability. Inspect explicit reassignment.
Spatial coordination differs from collecting ten results; a general join alone
does not establish a formation algorithm.

## Provenance retained

Book access was partial. Introductory architectural discussion has stronger
grounding than chapter-title leads. Current EIP examples may postdate the book.
The author's [aicore repository](https://github.com/idmillington/aicore) identifies
obsolete first-edition code, not third-edition reference code. Edition/chapter
corrections in the core record remain in force.
