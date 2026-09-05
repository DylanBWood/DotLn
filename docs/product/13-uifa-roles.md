# UIFA roles — five human roles around an agentic platform

**Status:** operator-opened role vocabulary, 2026-09-05. The five role names
below are adopted for immediate use in the author's personal implementation and
in how the author describes the work to other people. The operator confirmed
the set on 2026-09-05: `product lead` was chosen over the first proposal
`product owner`, `showrunner` was retained, and the other three stand as given.
The operator remains open to stickier names; a rename lands as a dated note here
and in the ledger. This document names human jobs; it introduces no new Actor primitive, does not change
the domain model's `Role` (temporary obligations, permissions, objectives, and
policy deltas attached to an actor), and prescribes no organization. Another
DotLn implementation may define different human roles or none, under
[common substrate, local doctrine](00-vision.md#common-substrate-local-doctrine).

## Why name the humans

UIFA, the proposed spoken name for the Actor UI direction, stands for User
Interfaces for Actors. Actors include people, model sessions, scripts, browser
workers, and test runners. The software actors already have names in this
blueprint: identities, roles, loadouts, verifiers, watchers. The people did not,
beyond “the operator” and the founding note's two-role sketch of a product
person and an architect-plus-scrum-master.

Naming the human roles matters because people and models bring different prior
associations to the same material. A person who has run a kitchen, a ward, a
classroom, or a release train recognizes a working shape before any model has
been told to look for it, and notices when a plausible-looking mechanism would
not survive contact with that world. That judgment is the part of the system the
platform cannot compile away. It is where an implementation's secret sauce
lives, and the platform's job is to give each of these people a treasure trove
of assistance, ahead of time and in the moment, without taking the authorship
from them.

## The five roles

| Role                  | Owns                                                                                                                              | Produces                                                                                                               | The question they keep asking                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **UIFA product lead** | The domain's future state: what the work should become, described at flowchart grade by someone who knows its screens and rhythms | A vision that is transcribed, synthesized, and stored as durable product understanding                                 | “Is this still the thing we mean?”                                                |
| **UIFA showrunner**   | Sequencing, capacity, and closure across parallel workflows; what shipped in each release and with what evidence                  | Bounded work orders, a recommended order, activation decisions, release dispositions                                   | “What is active, what is blocked, what closed, and what did the release contain?” |
| **UIFA engineer**     | The hand-crafted actor experience: identities, roles, supports, link groups, cadences, and temporal structures                    | Compiled loadouts and reusable compositions built from legos or custom pieces, not from a model's guess at the mapping | “Does this composition express the behavior I mean, and what does it cost?”       |
| **UIFA tester**       | Whether a proposed shape, role, or support does what it should in the circumstances that matter                                   | Scenarios, expected behaviors, replayed comparisons, and findings about the shape, not about the software              | “In this situation, does the equipped behavior do the right thing?”               |
| **UIFA devops**       | The machinery that makes the machinery: compilers, control plane, generators, evidence gates, and their tests                     | Executable mechanisms that remove recurring procedure and keep judgment at the point that needs it                     | “Which repeated step can become a checked mechanism next?”                        |

### UIFA product lead

The founding note called this person “product-oriented, with SME-level screen
knowledge, doing flowchart-grade future-state definition.” They do not write
mechanisms. They keep sharpening and re-communicating a vision, and the platform
transcribes, synthesizes, and stores it the way this repository's own intake →
synthesis → product-doc pipeline stores the author's. Their assistance is memory
and fidelity: the ledger that never loses an intermediate idea, the shape-first
synthesis that preserves a relationship rather than a literal detail, and
projections that show what the fleet made of their words.

The first proposal was _product owner_. The operator chose _lead_ on
2026-09-05 because _owner_ already means the person who owns a DotLn
implementation, and a title should not borrow a word the blueprint uses for
something else.

### UIFA showrunner

Architect plus scrum master. The showrunner turns the vision into bounded,
sequenced, verifiable work and ships what the fleet makes. Their questions are
answered by evidence, never by a checklist someone remembered to tick: which
orders are active and in which phase, which are blocked and on what, what a
release contained, and what the next legal action is. Today that is the
[generated work-order index](../work-orders/README.md), the
[planning map](../planning/work-order-map.md), the control status, and the
release records. The concurrent-workflow plan, control-plane beacons, and a
shared status view are this role's next tooling. The candidate
[whole-or-split planning view](06-roadmap.md#candidate--whole-or-split-work-orders-under-one-umbrella)
adds smaller reviewable increments under one outcome, with dependencies deciding
which children can proceed together.

Why _showrunner_: the title already means one person who holds the creative
architecture of a season and runs its production schedule, and who is judged by
what actually airs. The operator confirmed it on 2026-09-05; **UIFA conductor**
is the recorded alternative that was not taken.

### UIFA engineer

The engineer hand-crafts the actor experience. They compose identities, roles,
active mechanics, supports, and link groups; they shape temporal structure with
cadences and phases; they decide whether a piece comes from the shared legos or
is a custom composition. The point of the role is that a person, not a model,
makes that mapping. Their assistance is the compiler: the exact compiled diff,
the tooltip that prints every support's mechanism and declared cost, the
semantic hash that proves two views are the same program, and the workshop that
lets a build be remixed against fixtures before it is promoted.

### UIFA tester

The tester does not test DotLn, and does not test whether a user interface
works. They test whether a proposed shape, role, or support does what it should
in the appropriate circumstances. Much of that is automatable, and should be:
replay, deterministic fixtures, verifier episodes, paired counterfactual runs.
The person stays because duplication of a scenario and understanding of a
behavior are different things. A tester invents the situations a model would not
think to try, validates the outcome themselves, and turns the interesting cases
into scenarios the automation can repeat forever. Their findings are about the
shape, and they feed the feedback compiler, opinion cohorts, and the
counterfactual scoreboard.

### UIFA devops

What the operator does today. Devops builds the machinery that creates the
machinery: the control plane and its resume phrases, the composition compiler,
generators and projections, evidence gates, release close, and the tests that
make each of those fail loudly. The role's measure is the repeated work and
coordination it removes, not the amount of machinery it adds.

## Candidate — security, identity, logs, and traceability responsibilities

**2026-09-05 operator ideation:** extend the human-role vocabulary to cover
security, authentication and authorization, operational logs, and traceability.
These responsibilities need an accountable human perspective and useful
assistance. Whether they become one additional role, several hats, or explicit
responsibilities within existing roles remains open; the five confirmed names
above remain the adopted set.

| Concern          | Human judgment                                                                                                       | Assistance to develop                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Security         | Which resources and boundaries need protection, and which failure scenarios matter in this implementation?           | Boundary and exposure views, proposed control changes, and adversarial scenarios tied to their evidence |
| Authentication   | Which actor or principal is making this claim, and what establishes that identity?                                   | Identity provenance and an honest distinction between claimed and established identity                  |
| Authorization    | Which effects may that actor perform on which resources, under which grant and conditions?                           | Effective authority previews and explanations of allowed or refused actions                             |
| Operational logs | What is happening or failing now, and where should investigation begin?                                              | Correlated diagnostics, useful filters, and visible gaps or stale observations                          |
| Traceability     | How does this request connect to a decision, its authority, the resulting effects, and the evidence for the outcome? | Navigable provenance across orders, episodes, artifacts, verification, and releases                     |

This builds on the distinctions in
[audit, records, resilience, and privacy](09-audit-resilience-privacy.md).
Operational diagnostics do not by themselves establish authorization or prove an
acceptance claim. Traceability should reference authoritative records and expose
missing links, with access, retention, and disclosure governed by the chosen
privacy profile. A role title does not grant access to every record or confer
effect authority. These remain implementation-selected responsibilities under
the platform/instance distinction, with this repository's existing boundaries
still in force.

Ahead-of-time assistance could prepare identity and authority maps, evidence
coverage views, and reusable scenarios; assistance in the moment could explain a
refusal, trace an effect, or identify missing evidence. The engineer composes
the relevant behavior, the tester probes its scenarios, devops builds the
mechanisms, and the showrunner carries findings into work and release decisions.
The added human perspective owns the questions and judgments rather than
absorbing all those jobs.

One assurance hat or a boundary/identity hat paired with a logs/traceability hat
are possible groupings from this synthesis, not selected titles. Names,
responsibility boundaries, overlap with existing hats, and representative
day-to-day scenarios need further ideation. This proposal adds no Actor
primitive, permission grant, mandatory approval step, or implementation work
order.

## Humans stay in the loop

Each role should have both **ahead-of-time** assistance and **just-in-time**
assistance. Ahead of time: compiled guards and schemas, generated projections,
corpora and fixtures, published codebooks, reviewed patterns to reuse. In the
moment: the next legal action, the compiled consequence of the change being
made, the cost a support would add, the first divergence between two runs, and
the history of what earlier compositions did at this point. Both kinds exist to
keep the person in flow, which is the reference implementation's mission.

People in these roles want two things at once. They want to document, reuse, and
explain concepts, so the platform keeps a durable, addressable record. They also
want ad hoc freedom to play and explore, so sandbox and preview surfaces must be
unmistakable and cheap, and nothing tried there can invoke a live integration.
Treating exploration as a first-class mode, rather than as undocumented use of
the production path, is what keeps the secret sauce with the people.

## One person, several hats

Roles are hats, not headcount. A single person may wear all five in an
afternoon. The operator's own description is “a user-interface-for-actors
programmer, a UIFA programmer: mostly UIFA devops plus UIFA showrunner, dabbling
in everything UIFA.” Saying it that way, out loud, to people outside the project
is the point of naming the roles now. The names can be revised; the ledger keeps
every earlier version.

## The same five roles in other domains

Corporate software is one instance, not the template. The roles describe a
division of judgment that appears wherever people direct work they do not
perform with their own hands.

| Domain              | Product lead                                                   | Showrunner                                                                               | Engineer                                                                     | Tester                                                                               | Devops                                                                                      |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Restaurant kitchen  | The chef who defines the menu and the standard of a plate      | The expediter calling the pass, sequencing tickets, checking each plate before it leaves | The cook who designs a station's mise en place and hand-offs                 | The person who tastes the dish under rush conditions and writes down what breaks     | Whoever builds the ticket rail, the timers, and the prep lists that run without being asked |
| Hospital ward       | The clinician who defines the care pathway                     | The charge nurse running the shift: beds, handoffs, escalation                           | The person who designs the checklists, order sets, and handoff scripts       | The simulation lead who runs mock codes and rare presentations                       | The team that builds the protocol tooling and its safety checks                             |
| Film and television | The creator who holds what the story is                        | The showrunner: season architecture plus the production schedule                         | The department head who designs how a scene is actually made                 | Test screenings, table reads, and continuity checks                                  | The pipeline crew: dailies, asset tracking, render farm, delivery gates                     |
| Classroom           | The teacher-of-record who owns the learning goals              | The one who sequences units, groups, and assessments across a term                       | The person who designs an activity, a routine, or a classroom norm           | The colleague who tries the lesson with a different group and reports where it fails | Whoever builds the shared templates, gradebook automation, and substitute plans             |
| Farm cooperative    | The grower who knows the land and what it should yield         | The operations lead running planting, harvest, and market windows                        | The person who designs a rotation, an irrigation schedule, or a crew routine | Whoever trials a change on one plot before the whole farm adopts it                  | Whoever builds the sensors, the logs, and the equipment checks                              |
| Orchestra           | The composer, or the artistic director who chooses the program | The conductor: tempo, entrances, and what the ensemble ships on the night                | The section principal who works out bowings and phrasing                     | The rehearsal where a passage is tried under performance conditions                  | The librarian and stage crew whose parts, stands, and cues are simply there                 |
| Basketball team     | The general manager who defines what the team should be        | The head coach: rotations, timeouts, and what the season actually produces               | The assistant who designs a set, a press, or a practice structure            | The scout team that runs the opponent's plays against the plan                       | The video and analytics staff whose clips and reports arrive before they are asked for      |
| Open-source project | The maintainer who holds the project's purpose                 | The release manager sequencing milestones and deciding what ships                        | The contributor who designs an API, a workflow, or a contribution guide      | The person who reproduces bugs and writes the regression cases                       | Whoever builds CI, release automation, and the bots                                         |

The point of the table is not that these titles are interchangeable across
industries. It is that every domain already has people doing each kind of
judgment, and those people already know a feature of the app.

## Assistance the platform owes each role

The roles are a lens over the existing roadmap rather than new scope. Each row
names what exists today and which planned rung serves the role next.

| Role         | Today                                                                                                                                     | Next planned rungs                                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Product lead | The intake → clean-room synthesis → ledger → product-doc pipeline; the append-only idea ledger; the publication editions                  | The workstream application journeys (12); `προτείνω`'s prose-as-action authoring (11)                                                        |
| Showrunner   | The generated work-order index, the planning map, control status with elapsed phases, release notes in annotated tags and GitHub Releases | Concurrent control state and paired lanes (WO-030); control-plane beacons (WO-021); an actor usage projection (WO-031); a shared status view |
| Engineer     | LoadoutGraph v1, three equivalent editable views, the compiled diff and tooltip with declared costs, the compiled Entropy Reducer loadout | Pattern workshop v1 and the community build workshop; the candidate multi-dimensional authorship assistance (04)                             |
| Tester       | Deterministic replay and fixtures, verifier episodes, the corpus track, the walking skeleton's scenario                                   | Independent verification over real workers (WO-010); the feedback compiler (WO-011); opinion cohorts; `προτείνω`'s paired counterfactuals    |
| Devops       | `resume`, `worktree`, `release`, `work-orders`, the publication checker, the evidence suites                                              | Real disposable workers (WO-009); Senses (WO-022); every automation candidate the execution guide's recurring-procedure rule surfaces        |

## What this does not decide

- No new Actor primitive, event type, or schema. A role name in a report is
  prose until a consumer needs it as data.
- No change to the domain model's `Role`, which remains an actor's temporary
  obligations and permissions.
- No organization chart, headcount, or approval layer. A profile that wants
  fewer hats declares that, exactly as it declares an absent verifier.
- Names can still change. The operator confirmed this set on 2026-09-05 and
  remains open to stickier ones; a rename is the operator's call and lands as
  a dated note here and in the ledger.
