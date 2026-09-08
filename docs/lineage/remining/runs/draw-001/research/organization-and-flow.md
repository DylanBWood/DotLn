# Organization and flow — detailed idea records

Research date: 2026-09-07. OF-01–OF-08 preserve separate proposals, experiments
and counterarguments. They apply public organizational/systems ideas to DotLn;
they do not establish organizational patterns as software correctness laws.

## Sources and actual access

- **Team Topologies**, Matthew Skelton and Manuel Pais. Second edition,
  September 23, 2025, 304 pages. Inspected the publisher/distributor description,
  authors' 2020 mini-book (especially printed pages 10–17 and 45–47), current
  concepts and platform explanation. The mini-book collects six articles; it is
  not the complete book. New second-edition cases were not inspected.
  [Edition](https://www.simonandschuster.net/books/Team-Topologies-2nd-Edition/Matthew-Skelton/9781966280002),
  [mini-book](https://teamtopologies.com/s/Organization-Dynamics-with-Team-Topologies-Mini-book-MB80.pdf),
  [concepts](https://teamtopologies.com/key-concepts),
  [platform explanation](https://teamtopologies.squarespace.com/key-concepts-content/what-is-a-thinnest-viable-platform-tvp).
- **Thinking in Systems**, Donella Meadows, edited by Diana Wright, Chelsea
  Green, December 5, 2008. Inspected the publisher record, nine-page draft on
  stocks/flows, intervention essay and official book-related excerpt. The draft
  is marked as such; its numbering is not published-book chapter numbering.
  No full-book reading. [Edition](https://www.chelseagreen.com/product/thinking-in-systems/),
  [draft](https://donellameadows.org/wp-content/userfiles/bathtubs101.pdf),
  [interventions](https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/),
  [working with systems](https://donellameadows.org/dancing-with-systems/).
- **The Goal**, Eliyahu M. Goldratt and Jeff Cox, first published 1984.
  Researched the 30th Anniversary publisher record, Goldratt's retrospective
  letter, official description and Goldratt Research Labs' focusing steps.
  Moderate conceptual coverage; no complete novel/TOC reading. The publisher
  says this edition adds focusing steps and an essay; its account of retained
  cases differs from the marketing page. Prefer the publisher on edition
  contents. [Edition](https://northriverpress.com/the-goal-30th-anniversary-edition/),
  [Goldratt letter](https://www.toc-goldratt.com/index.php?cont=796),
  [focusing steps](https://www.goldrattresearchlabs.com/introduction-to-toc),
  [description](https://www.toc-goldratt.com/en/product/the-goal-a-process-of-ongoing-improvement).
- **The Phoenix Project**, Gene Kim, Kevin Behr, George Spafford, original 2013. Publisher lists fourth edition, September 3, 2024. Inspected publisher
  description/summary and a substantial 2013 Gene Kim interview transcript.
  Search exposed an older anniversary excerpt's chapter-seven passage; direct
  retrieval returned 403. Do not treat it as a full sample or current-edition
  text. [Edition](https://itrevolution.com/product/the-phoenix-project/),
  [summary](https://itrevolution.com/articles/10-minute-summary-of-the-phoenix-project/),
  [Kim interview](https://www.sei.cmu.edu/documents/4876/2013_016_100_58540.pdf),
  [older excerpt](https://itrevolution.com/wp-content/uploads/2022/06/TPP5_excerpt.pdf).

## OF-01 — Change admission at an observed constraint

**Source meaning.** TOC identifies a constraint, uses existing capacity,
aligns other work, expands capacity and reassesses. Phoenix transfers this to
IT work release. Meadows supplies the counterlens: a bottleneck is a hypothesis
within a chosen boundary, not a person's permanent identity.
[Focusing steps](https://www.goldrattresearchlabs.com/introduction-to-toc),
[Phoenix excerpt, page 91](https://itrevolution.com/wp-content/uploads/2022/06/TPP5_excerpt.pdf).

**Application and scene.** Four workers finish drafts needing decisions. Four
more start while existing proposals become stale. An application experiment
compares eager admission with a limit on unfinished outcomes using existing
scheduling facilities. A review queue may instead reflect unclear proposals or
repeated defects; scheduling cannot repair every cause.

**Experiment and falsifier.** Hold workload fixed; compare accepted outcomes,
waiting age, rework and operator attention. Include an urgent item and a moved
constraint. Better completion without starvation or authority bypass passes;
mere worker utilization does not. Start with an evidence card and manual trial,
not autonomous optimization.

**Audit.** This is already a detailed roadmap candidate separating open tracks,
admitted orders, active steps and useful throughput (`06-roadmap.md:499`). No
monitor/automatic pause is implemented. Current usage aggregates signed elapsed
time including waiting/interruptions (`scripts/lib/control-usage.mjs:33`);
it cannot infer queue wait. WO-028/030 supply foundations; WO-034 excludes
admission. Independent workflows must continue independently.

## OF-02 — Deliver learning where the next decision occurs

**Source meaning.** Meadows distinguishes information access from parameter
changes. Phoenix's second way brings operational learning upstream and places
knowledge where work happens. Wider distribution can also create irrelevant
rules and suppress valid behavior.
[Information structure](https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/),
[Kim interview, pages 6–7](https://www.sei.cmu.edu/documents/4876/2013_016_100_58540.pdf).

**Application and scene.** A correction about premature completion reaches the
ledger, but a fresh worker repeats the mistake. Make the correction a scoped,
inspectable change in inputs or acceptance conditions, with applicability,
evidence and version. Compiler, profile and application policy are the likely
destinations; existing platform authority remains the boundary.

**Experiment and falsifier.** Show failing before-case, passing fresh-worker
after-case, unaffected neighboring case and a trace to the originating
correction. Filing or shorter prose alone is not success. A correction that
prevents legitimate behavior is too broad.

**Audit.** Ten compiled feedback units, typed monotone corrections, causal
removal fixtures and live audit evidence exist. Audit evidence is bounded to
equipped audit boundaries (`docs/evidence/WO-011/README.md:113`). WO-039 already
owns actual-session harness lowering; WO-040 owns the first migration batch.
WO-041 records the still-manual continuing correction route
(`docs/evidence/WO-041/README.md:19`). The additional seed is one new correction
through candidate, fixture, compiled target, governed-session observation and
an explicit retirement decision for superseded prose. Count false activations
as well as prevention. A 2,393-byte reduction is not measured token/time savings.

## OF-03 — Make hidden recovery work visible

**Source meaning.** Phoenix distinguishes business projects, internal projects,
changes and unplanned work; fragile changes can create recovery that crowds out
fragility reduction. These teaching categories need not be mutually exclusive
event types. [Publisher summary](https://itrevolution.com/articles/10-minute-summary-of-the-phoenix-project/),
[Kim interview, pages 1–2](https://www.sei.cmu.edu/documents/4876/2013_016_100_58540.pdf).

**Application and scene.** A completed research task conceals malformed
artifacts, lost decisions and repeated operator explanations. Connect repair
episodes to the outcome in a read-only projection. A change may deliver a
project and repair an incident; preserve ambiguity rather than forcing labels.

**Experiment and falsifier.** Manually audit one complete workstream before
building a dashboard. Separate useful work, waiting, correction and recovery;
remove one recurring cause, then compare recurrence and operator repair effort.
A lower count of unplanned labels without less repair is not improvement.

**Audit and route.** Existing elapsed-time records do not establish active work,
waiting or causality. Extend a bounded WO-034 trial with observed repair evidence;
do not claim the desired measurement already exists or create an unsupported
universal taxonomy.

## OF-04 — Preserve ownership; choose how collaborators interact

**Source meaning.** Team Topologies distinguishes temporary joint discovery,
service consumption and facilitation. Discoverable team interfaces explain
ownership, priorities, practices and communication. Stable human teams have
relationships/tacit knowledge that disposable processes do not acquire by
naming. [Concepts](https://teamtopologies.com/key-concepts),
[mini-book, pages 46–47](https://teamtopologies.com/s/Organization-Dynamics-with-Team-Topologies-Mini-book-MB80.pdf).

**Application and scene.** A workstream retains outcome, questions, evidence and
authority as workers change. A specialist helps discover, supplies a bounded
result or teaches a reusable pattern. Treat these as application conventions
and runtime configuration, not new actor classes or compulsory team types.

**Experiment and falsifier.** Replace a worker midway; its successor must find
the next action and complete without operator reconstruction. Retire an assisting
specialist after its contribution. Count omissions and repeated explanations.
Tag one handoff with collaboration, service or facilitation and its exit
condition; test whether the relationship reduces repeated coordination.

**Audit.** Product 12 owns durable outcomes; WO-033/034 already plan launchpad and
workstream projections, including revisions, acceptance, dependencies and stale
claims (`WO-034:83,95`). The team inspector promises typed handoff links
(`04-interfaces.md:540`). Interaction-mode/exit annotations are the book-derived
extension. Start with authored pilot metadata, without a new hierarchy,
scheduler or lifecycle event.

## OF-05 — Judge a platform by the burden it removes

**Source meaning.** Team Topologies treats excessive cognitive demands as a
limit on ownership. A viable platform can be a page saying which services to
use and how. Human cognitive burden does not directly measure model tokens.
[Mini-book, pages 10–17](https://teamtopologies.com/s/Organization-Dynamics-with-Team-Topologies-Mini-book-MB80.pdf),
[platform explanation](https://teamtopologies.squarespace.com/key-concepts-content/what-is-a-thinnest-viable-platform-tvp).

**Application and scene.** On return, show material changes, required judgment
and the next legal action with accessible evidence. The operator should not
need compiler/scheduler knowledge to resume. Hidden consequential state can
make a smaller screen harder to use; minimal screen area is not the outcome.

**Experiment and falsifier.** Test a return and an interruption without builder
explanation. Measure correct decisions, mistakes, missing information and time
spent reconstructing context. Add machinery only when a simpler implementation
cannot deliver the experience. Optional profile preferences govern presentation.

**Audit.** Product 12 explicitly promises checkpoint/changes/decisions/next
action (`12-workstream-application.md:56`). WO-032 supplies a read-only historical
snapshot; legal actions cannot be invoked (`packages/console/src/work.ts:87`).
WO-034 already specifies return-time comparison, measured from session end to
status availability (`WO-034:209`). Add a distinct comprehension trial timed
from opening the return view, including wrong actions and stale evidence.
Use the planned consumer shell rather than inventing a parallel console.

## OF-06 — Account for evidence delay before intervening again

**Source meaning.** Stocks retain history; feedback delay relative to change
rate can cause oscillation. Buffers can decouple varying flows. Faster feedback
is compatible with a measured response, not maximum reaction frequency.
[Draft, pages 7–8](https://donellameadows.org/wp-content/userfiles/bathtubs101.pdf),
[delay discussion](https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/).

**Application and scene.** A delayed result triggers retries, which add
congestion, followed by another policy change before the original observation
arrives. Several unobserved corrections can create the same problem. Use
explicit pending evidence in runtime policy, promotion and operator attention.

**Experiment and falsifier.** Vary result delays. Compare immediate repeated
intervention with a policy accounting for pending results; count duplicate work,
reversals, completion and missed urgent failures. Replay explains a sequence;
it does not prove an optimal delay. A simple timing workshop can compare timely
versus delayed feedback and smooth versus bursty arrivals under the same goal.

**Audit.** Attention candidates already include why-now, decision, evidence,
recommendation, safe default, waiting impact and independent work
(`04-interfaces.md:119`). ADR-0007 separates presence, budget, authority and
capability. Extend WO-034's avoidable-interruption trial with a material
question, an answerable question and a delayed answer that becomes stale.
The book-derived delay/disturbance lesson is new content for the existing
workshop, not a universal control law or inferred psychological score.

## OF-07 — Make workshop hypotheses compete

**Source meaning.** Meadows calls for explicit, challengeable models and
revision through experiment. Goldratt's question-led discovery and retrospective
letter distinguish agreement with principles from correct application.
[Meadows excerpt](https://donellameadows.org/dancing-with-systems/),
[Goal description](https://www.toc-goldratt.com/en/product/the-goal-a-process-of-ongoing-improvement),
[Goldratt letter](https://www.toc-goldratt.com/index.php?cont=796).

**Application and scene.** One hypothesis blames review capacity; another blames
inactionable proposals. Each predicts an observable difference before running
the scenario. Preserve the losing explanation. Agent persona variety is not
independent evidence; an elegant account can fit a trace without being causal.

**Experiment and falsifier.** Two hypotheses, shared fixture, discriminating
observation and held-out case. A valid result may be inconclusive. Deterministic
fixtures establish behavior under declared assumptions; fresh model runs need
variability reporting. Reject a workshop that only produces convincing stories.

**Audit and route.** WO-037 plans multi-active lowering and a second deterministic
scenario, while excluding drag-equip, community builds and other shelf content
(`WO-037:191`). Add a specific delay-and-disturbance lesson and falsifiable
explanations to the workshop/consumer follow-on; do not treat the board as an
already implemented experimental editor.

## OF-08 — Preserve outcomes and disqualifiers beside metrics

**Source meaning.** Goldratt contrasts local cost thinking and system throughput;
Meadows warns against favoring measurable quantities or optimizing parts at the
whole's expense. A single aggregate goal can conceal incompatible preferences
or displaced costs, while an exhaustive scorecard can itself become work.
[Goldratt letter](https://www.toc-goldratt.com/index.php?cont=796),
[Meadows excerpt](https://donellameadows.org/dancing-with-systems/).

**Application and scene.** A policy improves completed-task count by favoring
easy work or mislabeling unresolved decisions. Another reduces visible errors
by becoming too hesitant. Define useful outcomes and a few disqualifying
failures at application level; explicit preference tradeoffs belong in profiles.

**Experiment and falsifier.** Include a candidate that improves the headline
metric while worsening acceptance or unresolved work. The evaluation must reject
it and expose the tradeoff. Preserve authority and evidence requirements instead
of blending them into an actor score. Report completion, quality and repair
cost without pretending that one quantity captures the operator's judgment.

**Route.** This is evaluation discipline across the admission, correction,
consumer-return and temporal-comparison experiments. It does not demand a new
kernel measure or autonomous policy optimizer.

## Combined seeds and research limits

Retain four concrete combinations: one correction reaching a fresh worker;
one workstream resumable without reconstruction; one measured admission trial
after a constraint diagnosis; and one workshop experiment that can invalidate
its favored pattern. The first two largely have existing order homes. The
continuing correction path and book-derived experimental lessons refine the
remaining application work.

Phoenix and The Goal are related lineage, not independent votes; Kim explicitly
describes that influence (interview page 5). Author cases motivate hypotheses,
not universal effect sizes. Human cognition is not a token budget. Recorded
replay is not proof of real-world counterfactual behavior. No mandatory team
enums, autonomous organizational redesign, self-modifying authority or general
causal-model engine is justified by this pass. These records retain alternative
experiments while requiring concrete evidence before architectural adoption.
