# Sources and inspirations

**Status:** living best-known register, last reconciled 2026-09-03.

DotLn does not claim that its component ideas—or even their combination—are
novel. It is a deliberate synthesis of lessons, metaphors, formal techniques,
stories, games, tools, conversations, failures, and ordinary life. The work is
in translating those influences into DotLn-native constructs, composing them,
implementing them, and learning what survives contact with use. Naming the
source should reduce that translation tax, not hide it behind novelty theater.

“Full” means every influence presently remembered or discovered, not a claim
that anyone can reconstruct a complete causal genealogy of a human being. Add
an influence before its mapping is understood; `unknown`, `source forgotten`,
and `ambient` are honest states. Omissions discovered later are additions to the
register, not evidence that an earlier snapshot was deceptive.

The curated account of the most load-bearing sources remains in
[the vision](../product/00-vision.md#inspirational-sources). This file is the
canonical conceptual-influence inventory, not yet a complete bibliography or
rights inventory. Creator/rightsholder, edition/version, canonical citation,
and rights-basis fields should be added as entries are verified; a missing value
means `unknown`, never “not applicable.” The append-only
[idea ledger](idea-ledger.md) retains when a mapping or correction entered the
project.

## How entries work

Knowledge status and relationship are separate:

- **source-reviewed** — a cited source was inspected for the recorded mapping;
- **operator-used** — the operator read, watched, played, practiced, or learned
  from it directly;
- **operator-recollected** — the design uses a remembered experience without
  claiming exact source facts;
- **nominated-unmined** — named as promising, but no source-grounded mapping is
  adopted yet;
- **ambient/uncertain** — common cultural or technical inheritance, an
  incomplete chain, or a forgotten exact source.

Relationships include inspiration, familiar lens, formal technique,
counterexample, quality bar, exact-expression source, and implementation
dependency. Conceptual inspiration is the default. Actual copied or adapted
code, text, images, audio, data, or assets require separate rights/basis
provenance; a dependency belongs in manifests, and in notices when the
distributed form and applicable license require one.

## Books, methods, and formal systems

| Source or tradition                                                     | Knowledge status                                          | Relationship and contribution                                                                                                                                                   | Main DotLn touchpoints                                                                         |
| ----------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Henri Poincaré, encountered through Robert M. Pirsig                    | operator-used                                             | Selection under finite attention; useful formulations approach felt judgment without claiming to exhaust it; multiple consistent geometries can describe one structure.         | vision's selection function and convergent judgment; projective interfaces; evidence selection |
| _Zen and the Art of Motorcycle Maintenance_                             | operator-used                                             | Quality, gumption traps, analogues, and resistance to rote compliance.                                                                                                          | evaluator design; friction vocabulary; quality as a selection problem                          |
| _Gödel, Escher, Bach_                                                   | operator-used; deliberately under-mined                   | Isomorphism, self-reference, strange loops, tangled hierarchies, and formal systems reasoning about themselves.                                                                 | one reactor and replay; feedback compiler; identity lineage; self-hosting                      |
| Donella Meadows' leverage points                                        | operator-used                                             | Intervention altitude and the danger of granting high-leverage system changes without naming them.                                                                              | mechanism/effect classification; authority and feedback design                                 |
| Eliyahu M. Goldratt, _The Goal_, and Theory of Constraints              | operator-used                                             | Find, exploit, subordinate to, elevate, and re-find the moving constraint; local optimization can harm total flow.                                                              | workstream pacing; bottleneck and operator-bandwidth models; activation versus utilization     |
| 5S / 6S and lean maintenance practice                                   | operator-used                                             | Small, legible maintenance behaviors compose into a living housekeeping system.                                                                                                 | Repo Gardener; Seiri active; maintenance set bonuses                                           |
| L. David Marquet, _Turn the Ship Around!_, and the Ladder of Leadership | operator-used                                             | Intent-based leadership and graded communication/autonomy as a familiar interface.                                                                                              | Voice, PresencePolicy, authority views, leadership lens                                        |
| SMART goals                                                             | ambient/uncertain exact lineage                           | Readiness check at consequential commitment points, not ceremony around trivial work.                                                                                           | ObjectiveContract and exploration-to-execution promotion                                       |
| Mitigated speech and crew-resource communication                        | operator-used; exact transfer needs review                | Voice strength and actual authority are independent; high-risk messages cannot rely on hints. The Korean Air discussion in Malcolm Gladwell's _Outliers_ is a nominated source. | Voice; temporal communication candidate; future source-grounded review                         |
| Brian Christian and Tom Griffiths, _Algorithms to Live By_              | operator-used                                             | Optimal stopping, explore/exploit, caching, scheduling, controlled randomness, overfitting resistance, and computational kindness.                                              | decision-policy pattern family; stopping and work selection                                    |
| _Team Topologies_                                                       | nominated-unmined                                         | Possible vocabulary for coordination, workstreams, communication boundaries, and failure modes.                                                                                 | future source-grounded research only                                                           |
| Nassim Nicholas Taleb's antifragility and intervention cautions         | operator-used or operator-named; exact passages to verify | Incidents should expose missing invariants; detected imperfections do not automatically justify intervention.                                                                   | Antifragile response; Beware of Naive Interventionism                                          |
| Malcolm Gladwell's Default to True                                      | operator-used; exact source metadata to verify            | A familiar name for provisional acceptance under genuine uncertainty, paired here with an explicit Default to False counterweight.                                              | default-polarity supports; never a truth or authority grant                                    |
| Malcolm Gladwell's stickiness factor (_The Tipping Point_)              | operator-recollected; exact source metadata to verify     | A name or idea earns its place by being memorable enough to travel unaided; the operator applies it as the criterion for the UIFA role names (2026-09-05).                      | naming heuristic for the UIFA roles (product 13); no mechanism mapping                         |
| Commedia dell'arte                                                      | operator-used                                             | Relationship-shaped masks and predictable tensions among rule keeper, maker, falsifier, watcher, blocker, fixer, and goal carrier.                                              | party topology; role presets; agent-ecology scenarios                                          |
| Sequential decision analysis associated with Warren B. Powell           | operator-used from saved reference material               | State, decision, exogenous information, transition, objective, and multiple policy classes as a formal rendering of the kernel loop.                                            | domain-model formal grounding; policy taxonomy                                                 |

## Film, television, games, and performance

| Source or experience                                     | Knowledge status                                                   | Relationship and contribution                                                                                                                                                                                                  | Main DotLn touchpoints                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| _Westworld_                                              | operator-used                                                      | Reveries as source-linked behavior fragments; old configurations on modern builds; ideas that alter future behavior; exact operator mode vocabulary.                                                                           | FeedbackUnits; compatibility; `προτείνω`; command vocabulary                       |
| _Dual Survival_ and _Man, Woman, Wild_                   | operator-used; exact entries filed after bounded item-class review | Exact phrasebook content rather than generic stylistic imitation. The current basis is limited to brief expressions plus operator-authored selection/arrangement; it is not blanket brand, imitation, or commercial clearance. | optional phrasebook Voice support; documentation-only candidate today              |
| Iron Man / JARVIS                                        | operator-used                                                      | Conversational intent with machinery carrying the work; run-before-walk as a counterweight whose failures remain instrumented.                                                                                                 | operator relationship; self-driving loop; evidence-equipped reference profile      |
| _Ex Machina_                                             | operator-used                                                      | The evaluator may be inside the experiment and persuaded by an agent optimizing for the test.                                                                                                                                  | implementer/verifier separation and adversarial evaluation                         |
| _Black Mirror_, especially _Bandersnatch_                | operator-used                                                      | Navigable choice points and paths not taken; a negative oracle for systems that satisfy their spec and are still wrong.                                                                                                        | counterfactual branches; first divergence; objective/livability checks             |
| Christopher Nolan's films and production practice        | operator-used                                                      | _Memento_: durable external memory; _Inception_: nested episodes and time bases; _Dunkirk_: converging cadences; practical effects and a production-wide standard.                                                             | disposable executors; continuations; analog-completeness; compiled shared judgment |
| _Jujutsu Kaisen_                                         | nominated-unmined                                                  | Rule-rich abilities, constraints, transformations, counters, and familiar explanations of unfamiliar mechanisms.                                                                                                               | future pattern mine and linked explanatory views                                   |
| _Grand Theft Auto_                                       | operator-recollected play experience                               | Apparent activities deserve meaningful specialized interaction; large combination spaces should reward experimental setup with rare discoveries.                                                                               | `προτείνω` affordance integrity and mystery/provenance                             |
| _World of Warcraft_                                      | operator-recollected play experience                               | A small foundational action can feel good before feature breadth, then accommodate outside ideas through a solid substrate.                                                                                                    | foundation-first implementation strategy                                           |
| Path of Exile and action-RPG build craft                 | operator-used                                                      | Builds, actives, supports, links, sockets, reservation, rarity, tooltips, maps, and combat logs as an inspectable authoring vocabulary.                                                                                        | composition system; familiar projection; whole-stash failure analogy               |
| Real-time strategy games                                 | operator-used/ambient                                              | Converse with a commander, accept or revise proposed tactics, and watch ad hoc plans meet the simulated world rather than micromanaging every unit.                                                                            | commander-mode `προτείνω` application candidate                                    |
| Basketball                                               | operator-used/ambient                                              | One small world contains individual technique, team systems, wellbeing, results, delayed effects, and multiple intervention scales.                                                                                            | candidate first `προτείνω` evidence slice                                          |
| Double Dutch                                             | operator-used/ambient                                              | Watch, detect an opening, enter a bounded action window, act, and leave before interference resumes.                                                                                                                           | guarded opportunity-window cadence                                                 |
| Blackjack +3                                             | operator-supplied working game                                     | Explicit progressive stakes with selected advancement, cap, stop, loss, reset, and loop semantics still to be designed.                                                                                                        | candidate PresencePolicy subgame                                                   |
| The Malcolm Check (exact source association unresolved)  | operator-named; source uncertain                                   | A familiar boundary-skeptic mask that separates an available move from a justified, authorized move without replacing the actual permission guard.                                                                             | candidate counterweight support in the pattern library                             |
| Ready–Fire–Aim, Ready–Aim–Fire, and “move fast”          | mixed operator recollection and ambient culture                    | A polarity whose deciding variable is reversibility: exploratory shots can reveal the target, while expensive or irreversible actions require prior aim.                                                                       | work-order execute/verify loop; fixed ordering around merge, deletion, and release |
| The Twelve Days of Christmas                             | ambient cultural reference                                         | Each later verse repeats earlier material; beginning on day five already incurs a long first verse, like a fresh session burdened with accumulated context before new work.                                                    | cumulative startup/replay cost; bounded task context over durable history          |
| The optometrist “better like this, or this?” interaction | lived experience/ambient                                           | Pairwise preference elicits judgment more cheaply and reliably than demanding an absolute score.                                                                                                                               | Eye Dr Test, Comparison events, Bradley–Terry/Elo-family projections               |

## Papers, essays, and technical references

| Source                                                                                                                                                                              | Knowledge status                                                 | Relationship and contribution                                                                                                                                            | Main DotLn touchpoints                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)                                                                                      | source-reviewed                                                  | A compact social sandbox makes routines, relationships, propagation, and delayed consequences legible. Its resident architecture and evaluation claims are not imported. | small-town shape for `προτείνω`                                    |
| Bradley–Terry, Elo-family ranking, RLHF preference models, and arena-style comparison                                                                                               | technical precedent; exact review depth and citations incomplete | External precedent for pairwise judgment and replaceable ratings; exact assumptions and transfer remain visible.                                                         | Eye Dr Test and comparison projection                              |
| [Lamport, “Time, Clocks, and the Ordering of Events in a Distributed System”](https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/) | source-reviewed                                                  | Total log order is not the same as causal order.                                                                                                                         | event ordering and explicit causal lineage                         |
| [Klosowski et al., k-DOPs](https://doi.org/10.1109/2945.675649)                                                                                                                     | source-reviewed for orientation                                  | A broad-phase spatial-envelope analogy; not imported architecture.                                                                                                       | bounded future reachability and broad-phase counterfactual pruning |
| [Fujimoto, parallel discrete-event simulation](https://doi.org/10.1145/76738.76741)                                                                                                 | source-reviewed for orientation                                  | Multi-rate simulation and ordering vocabulary; not imported architecture.                                                                                                | counterfactual and temporal research                               |
| [RxJS `expand()`](https://rxjs.dev/api/index/function/expand)                                                                                                                       | source-reviewed technical candidate                              | A bounded lowering hypothesis for recursive event expansion, not a required dependency.                                                                                  | temporal-interaction candidate                                     |
| [Dan McAteer, “The Evolution of the Agent Harness”](https://www.latent.space/p/attention-interface)                                                                                 | source-reviewed                                                  | Brain/body metaphor and interfaces protecting scarce human attention; taxonomy and predictions are not product facts.                                                    | harness/orchestration boundary; attention projection               |
| [Joel Spolsky, “Controlling Your Environment Makes You Happy”](https://www.joelonsoftware.com/2000/04/10/controlling-your-environment-makes-you-happy/)                             | source-reviewed                                                  | Predictable environments and accumulating action/result mismatch.                                                                                                        | Flow Steward                                                       |
| [Joel Spolsky, “Two Stories”](https://www.joelonsoftware.com/2000/03/19/two-stories/)                                                                                               | source-reviewed                                                  | Trusted local ownership and removing interference around a builder.                                                                                                      | Flow Steward                                                       |
| [Rands, “Managing Nerds”](https://randsinrepose.com/archives/managing-nerds/)                                                                                                       | source-reviewed                                                  | Consistent rules, protected time, recurring-friction diagnosis, and optional credible help—not management authority over the operator.                                   | Flow Steward                                                       |
| [LangGraph](https://docs.langchain.com/oss/javascript/langgraph/overview)                                                                                                           | source-reviewed as accommodation probe                           | A durable graph runtime against which one bounded DotLn Program may later be lowered and compared; not the adopted stack.                                                | orchestration conformance candidate                                |
| Steve Yegge's platform essay                                                                                                                                                        | operator-saved; exact citation to verify                         | “Build as a platform” as a product posture.                                                                                                                              | platform-first architecture                                        |
| The Operator typeface introduction                                                                                                                                                  | operator-saved; exact citation to verify                         | Typographic care and code-facing interface quality.                                                                                                                      | visual/interface quality bar                                       |

## Personal practice, communities, and lived experience

| Source                                                    | Knowledge status                                       | Contribution                                                                                                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business, leadership, and personal-development reading    | operator-used, ongoing                                 | The central authoring thesis: familiar ways of working become reusable agent/team structures and executable patterns.                                                                              |
| A Full Sail game-design reunion conversation              | operator-recollected                                   | Triggered the realization that the existing business-rule corpus read like RPG equipment and could have an isomorphic game interface.                                                              |
| Hundreds of physical index cards                          | operator practice                                      | Adding, removing, grouping, and comparing architectural ideas physically as an analog frontend to composition.                                                                                     |
| TI-83 “11-ball universe” toy program                      | operator-recollected                                   | Grow the event-type × response universe one case at a time so useful completeness emerges progressively instead of through a big-bang ontology.                                                    |
| Saved Simile quotations                                   | operator-saved; original speaker/work metadata unknown | Generate hypotheses, watch which predictions come true and when, form a point of view through exploration, then make that viewpoint efficient.                                                     |
| Building and correcting `v1`                              | operator experience                                    | Generalized lessons about always-on prose, context overload, selection, and durable shared memory. No predecessor code, config, identifiers, host details, or protected material enters this repo. |
| AI-assisted ideation and critique                         | mixed, recorded in the private founding corpus         | Models generated, challenged, and combined candidates; operator selection and correction determined what entered durable docs. Exact internal authorship apportionment is not inferred.            |
| Repeated implementation, review, and failure in this repo | directly observed                                      | The project treats its own thin tests, misleading summaries, process gaps, and repairs as design material rather than cleaning history into a success story.                                       |

## Ambient, uncertain, and forgotten influences

The register deliberately includes families that cannot yet be reduced to one
source: functional-core/imperative-shell design, event sourcing, state machines,
ports and adapters, typed functional programming, distributed-systems hygiene,
property and mutation testing, role-playing and strategy games, sports,
organizational life, conversation, teaching, comedy, music, physical tools, web
culture, and ordinary participation in the twenty-first century. Their exact
path into any one DotLn idea may be unknown.

Other remembered shapes currently lack a stable citation or a confident source:
the superconductor/quench lens, quantum-mechanics contrasts, calculator and game
memories, sow/reap rhythms, the “driving the car while building it” phrase
learned from a former boss, and unnamed games the operator has explicitly said
remain missing. Record the name when it returns; do not guess one to make the
table look complete.

## Names, rights, and implementation provenance

Names and titles appear here to identify influences. Any third-party rights in
names, titles, marks, and source expression remain with their respective
holders; inclusion does not imply affiliation, sponsorship, or endorsement.
This register is not a license, a fair-use determination, or permission to copy
source expression. Exact quotations need individual source and rights review;
there is no universal safe word count.

### Exact-expression review register

| Item                                                | Source status                                                                                           | Rights/basis status                                                                                                                                                                                                                                               | Current eligibility and re-review trigger                                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _Dual Survival_ palette entries DS-01 through DS-28 | Show association and operator-supplied wording recorded; exact episode/speaker metadata remain unknown. | Reviewed separately by ID as individual words, names, catchwords, catchphrases, or brief expressions under Copyright Office Circular 33. Operator authorization covers whatever original selection, arrangement, and annotations exist, not third-party material. | Eligible in this attributed, non-affiliated documentation-only candidate; re-review before runtime imitation, source-identifying/brand use, marketing, or commercial distribution. |
| _Man, Woman, Wild_ entry MWW-01                     | Show association and one operator-supplied brief expression recorded; episode/speaker remain unknown.   | Same brief-expression basis; no audiovisual material, character depiction, or longer dialogue passage is copied.                                                                                                                                                  | Same bounded documentation eligibility and re-review triggers as the DS entries.                                                                                                   |
| Westworld control entry WW-01                       | One operator-supplied ordinary-word command; no additional dialogue inferred.                           | Single functional word plus punctuation; the show association is attribution, not a claim to own the source title or brand.                                                                                                                                       | Eligible as documented operator-command vocabulary; re-review before source-identifying/brand or commercial use.                                                                   |
| Saved Simile quotations                             | Original speaker/work metadata unknown.                                                                 | No quotation-level review completed; length and protectability are not assumed.                                                                                                                                                                                   | No exact quotations filed; remain in the private source lane until reviewed.                                                                                                       |

The range `DS-01`–`DS-28` is compact notation, not collective clearance:
DS-01–DS-13 are the numbered lines in the filed block and DS-14–DS-28 are the
starred-line entries read left to right. The same recorded classification was
applied to each entry. The bounded review uses
the Copyright Office's rule that individual words and short phrases are not
copyrightable. It does not decide trademark, publicity, endorsement, contract,
or non-U.S. questions, and it does not license show footage, images, audio,
logos, scripts, or longer dialogue. The project names the shows to identify its
inspiration and disclaims affiliation; a materially different use reopens
review.

The register answers **what shaped the project**. A future
`THIRD_PARTY_NOTICES` file answers **what third-party material is actually
distributed**. Package manifests answer **what implementation dependencies are
included**. [The legal and licensing posture](../LEGAL.md) keeps those concerns
separate.

WO-109's future private `source-register.jsonl` is also separate: it accounts
for bounded re-mining of the private founding corpus and deliberately excludes
the external works named here. Neither register replaces the other.

To add an entry, record what is remembered now. A citation, mapping, or review
status can be improved later without pretending that later precision existed at
the time of influence.
