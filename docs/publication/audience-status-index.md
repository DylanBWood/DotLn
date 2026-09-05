# Blueprint audience/status index

This bootstrap index covers every ATX heading in the current numbered
`docs/product/` blueprint. A row classifies the material claim made by that
section, not every future possibility mentioned beneath it. Mixed sections use
the least mature status that avoids presenting the whole section as more
complete than its material claims.

Audience tags are `everyday-ai-user` and `software-engineer`. Status is exactly
one of `vision`, `specified`, `planned`, `implemented`, `verified`, `blocked`,
or `deprecated`. No row is derived from or links to gitignored intake.

## 00 — Vision

| Section                                                                                                                 | Audiences                           | Status    |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- |
| [DotLn — Vision](../product/00-vision.md#dotln--vision)                                                                 | everyday-ai-user, software-engineer | vision    |
| [Mission — increase the chance of operator flow](../product/00-vision.md#mission--increase-the-chance-of-operator-flow) | everyday-ai-user, software-engineer | vision    |
| [Common substrate, local doctrine](../product/00-vision.md#common-substrate-local-doctrine)                             | everyday-ai-user, software-engineer | specified |
| [The one-paragraph story](../product/00-vision.md#the-one-paragraph-story)                                              | everyday-ai-user, software-engineer | vision    |
| [The core bet](../product/00-vision.md#the-core-bet)                                                                    | everyday-ai-user, software-engineer | vision    |
| [The differentiated interface](../product/00-vision.md#the-differentiated-interface)                                    | everyday-ai-user, software-engineer | vision    |
| [Shape-first synthesis](../product/00-vision.md#shape-first-synthesis)                                                  | everyday-ai-user, software-engineer | specified |
| [Three horizons, one kernel](../product/00-vision.md#three-horizons-one-kernel)                                         | everyday-ai-user, software-engineer | planned   |
| [Inspirational sources](../product/00-vision.md#inspirational-sources)                                                  | everyday-ai-user, software-engineer | vision    |
| [What DotLn is not](../product/00-vision.md#what-dotln-is-not)                                                          | everyday-ai-user, software-engineer | specified |

## 01 — Principles

| Section                                                                            | Audiences                           | Status    |
| ---------------------------------------------------------------------------------- | ----------------------------------- | --------- |
| [Principles (design axioms)](../product/01-principles.md#principles-design-axioms) | everyday-ai-user, software-engineer | specified |

## 02 — Domain model

| Section                                                                                                      | Audiences                           | Status      |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ----------- |
| [Domain model](../product/02-domain-model.md#domain-model)                                                   | software-engineer                   | specified   |
| [Events and decisions (the kernel loop)](../product/02-domain-model.md#events-and-decisions-the-kernel-loop) | everyday-ai-user, software-engineer | implemented |
| [Actors and episodes (the edge)](../product/02-domain-model.md#actors-and-episodes-the-edge)                 | everyday-ai-user, software-engineer | specified   |
| [Identity and composition](../product/02-domain-model.md#identity-and-composition)                           | everyday-ai-user, software-engineer | specified   |
| [LoadoutGraph v1 payload contract](../product/02-domain-model.md#loadoutgraph-v1-payload-contract)           | software-engineer                   | implemented |
| [Feedback](../product/02-domain-model.md#feedback)                                                           | everyday-ai-user, software-engineer | specified   |
| [Memory and observation](../product/02-domain-model.md#memory-and-observation)                               | everyday-ai-user, software-engineer | specified   |
| [Formal grounding](../product/02-domain-model.md#formal-grounding)                                           | software-engineer                   | specified   |

## 03 — Architecture

| Section                                                                                                                                                       | Audiences                           | Status      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| [Architecture](../product/03-architecture.md#architecture)                                                                                                    | everyday-ai-user, software-engineer | planned     |
| [Layer diagram](../product/03-architecture.md#layer-diagram)                                                                                                  | software-engineer                   | planned     |
| [Platform and instance boundary](../product/03-architecture.md#platform-and-instance-boundary)                                                                | everyday-ai-user, software-engineer | specified   |
| [Candidate — owner-sovereign implementation profile](../product/03-architecture.md#candidate--owner-sovereign-implementation-profile)                         | everyday-ai-user, software-engineer | vision      |
| [Package ecosystem and marketplaces](../product/03-architecture.md#package-ecosystem-and-marketplaces)                                                        | everyday-ai-user, software-engineer | planned     |
| [Community builds and sandbox promotion](../product/03-architecture.md#community-builds-and-sandbox-promotion)                                                | everyday-ai-user, software-engineer | planned     |
| [Agent enablement skills](../product/03-architecture.md#agent-enablement-skills)                                                                              | everyday-ai-user, software-engineer | planned     |
| [Candidate — contributed execution pool](../product/03-architecture.md#candidate--contributed-execution-pool)                                                 | everyday-ai-user, software-engineer | vision      |
| [Runtime primitive catalogs](../product/03-architecture.md#runtime-primitive-catalogs)                                                                        | software-engineer                   | planned     |
| [Candidate — isolated execution environments](../product/03-architecture.md#candidate--isolated-execution-environments)                                       | everyday-ai-user, software-engineer | vision      |
| [The agentic communication core](../product/03-architecture.md#the-agentic-communication-core)                                                                | software-engineer                   | planned     |
| [Candidate — opinion cohorts and sealed adjudication](../product/03-architecture.md#candidate--opinion-cohorts-and-sealed-adjudication)                       | everyday-ai-user, software-engineer | vision      |
| [Composition system](../product/03-architecture.md#composition-system)                                                                                        | software-engineer                   | planned     |
| [Candidate — pinned artifact identity](../product/03-architecture.md#candidate--pinned-artifact-identity)                                                     | everyday-ai-user, software-engineer | vision      |
| [Agent-originated product suggestions](../product/03-architecture.md#agent-originated-product-suggestions)                                                    | everyday-ai-user, software-engineer | planned     |
| [First live Entropy Reducer use](../product/03-architecture.md#first-live-entropy-reducer-use)                                                                | everyday-ai-user, software-engineer | implemented |
| [Channel-plural intake, PR-backed registration](../product/03-architecture.md#channel-plural-intake-pr-backed-registration)                                   | software-engineer                   | planned     |
| [Session lifecycle & resilience](../product/03-architecture.md#session-lifecycle--resilience)                                                                 | everyday-ai-user, software-engineer | planned     |
| [Ports (what keeps work-flavored verticals pluggable)](../product/03-architecture.md#ports-what-keeps-work-flavored-verticals-pluggable)                      | software-engineer                   | planned     |
| [Operator-presence policy](../product/03-architecture.md#operator-presence-policy)                                                                            | everyday-ai-user, software-engineer | specified   |
| [Candidate — progressive absence authority and return readiness](../product/03-architecture.md#candidate--progressive-absence-authority-and-return-readiness) | everyday-ai-user, software-engineer | vision      |
| [Corpus policy](../product/03-architecture.md#corpus-policy)                                                                                                  | everyday-ai-user, software-engineer | specified   |
| [Candidate — canonical private intake reconciliation](../product/03-architecture.md#candidate--canonical-private-intake-reconciliation)                       | everyday-ai-user, software-engineer | vision      |
| [Learning loop](../product/03-architecture.md#learning-loop)                                                                                                  | everyday-ai-user, software-engineer | planned     |

## 04 — Interfaces

| Section                                                                                                                          | Audiences                           | Status      |
| -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| [Interfaces — the isomorphic views](../product/04-interfaces.md#interfaces--the-isomorphic-views)                                | everyday-ai-user, software-engineer | planned     |
| [Editable-view v1 normalization and semantic hash](../product/04-interfaces.md#editable-view-v1-normalization-and-semantic-hash) | software-engineer                   | implemented |
| [Terminal first, console equal](../product/04-interfaces.md#terminal-first-console-equal)                                        | everyday-ai-user, software-engineer | planned     |
| [Candidate — workstream application](../product/04-interfaces.md#candidate--workstream-application)                              | everyday-ai-user, software-engineer | vision      |
| [Candidate — exact operator command vocabulary](../product/04-interfaces.md#candidate--exact-operator-command-vocabulary)        | everyday-ai-user, software-engineer | vision      |
| [`προτείνω` — prose as a world action](../product/04-interfaces.md#προτείνω--prose-as-a-world-action)                            | everyday-ai-user, software-engineer | vision      |
| [Plural UI hosts, one projection contract](../product/04-interfaces.md#plural-ui-hosts-one-projection-contract)                  | everyday-ai-user, software-engineer | planned     |
| [RPG / Path-of-Exile view](../product/04-interfaces.md#rpg--path-of-exile-view)                                                  | everyday-ai-user, software-engineer | planned     |
| [Semantic zoom](../product/04-interfaces.md#semantic-zoom)                                                                       | everyday-ai-user, software-engineer | planned     |
| [Community build workshop](../product/04-interfaces.md#community-build-workshop)                                                 | everyday-ai-user, software-engineer | planned     |
| [External rule-source mapping preview](../product/04-interfaces.md#external-rule-source-mapping-preview)                         | everyday-ai-user, software-engineer | vision      |
| [Suggestion and proposal review](../product/04-interfaces.md#suggestion-and-proposal-review)                                     | everyday-ai-user, software-engineer | planned     |
| [Agent projection (the sparse twin)](../product/04-interfaces.md#agent-projection-the-sparse-twin)                               | everyday-ai-user, software-engineer | planned     |
| [Glyph system (visual prototype zero)](../product/04-interfaces.md#glyph-system-visual-prototype-zero)                           | everyday-ai-user, software-engineer | planned     |
| [Transmog](../product/04-interfaces.md#transmog)                                                                                 | everyday-ai-user, software-engineer | planned     |
| [Replay](../product/04-interfaces.md#replay)                                                                                     | everyday-ai-user, software-engineer | planned     |
| [Physical channel](../product/04-interfaces.md#physical-channel)                                                                 | everyday-ai-user, software-engineer | planned     |

## 05 — Pattern library

| Section                                                                                                                                          | Audiences                           | Status  |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ------- |
| [Founding pattern library](../product/05-pattern-library.md#founding-pattern-library)                                                            | everyday-ai-user, software-engineer | planned |
| [5S / 6S — the maintenance organism](../product/05-pattern-library.md#5s--6s--the-maintenance-organism)                                          | everyday-ai-user, software-engineer | planned |
| [Leadership & autonomy — Marquet](../product/05-pattern-library.md#leadership--autonomy--marquet)                                                | everyday-ai-user, software-engineer | planned |
| [SMART & exploration contracts](../product/05-pattern-library.md#smart--exploration-contracts)                                                   | everyday-ai-user, software-engineer | planned |
| [Communication — mitigated speech](../product/05-pattern-library.md#communication--mitigated-speech)                                             | everyday-ai-user, software-engineer | planned |
| [Candidate — exact phrasebook voice support](../product/05-pattern-library.md#candidate--exact-phrasebook-voice-support)                         | everyday-ai-user, software-engineer | vision  |
| [Decision policies — Algorithms to Live By](../product/05-pattern-library.md#decision-policies--algorithms-to-live-by)                           | everyday-ai-user, software-engineer | planned |
| [Candidate — success under growth](../product/05-pattern-library.md#candidate--success-under-growth)                                             | everyday-ai-user, software-engineer | vision  |
| [Candidate — influence response policies](../product/05-pattern-library.md#candidate--influence-response-policies)                               | everyday-ai-user, software-engineer | vision  |
| [Systems & quality](../product/05-pattern-library.md#systems--quality)                                                                           | everyday-ai-user, software-engineer | planned |
| [Party topology — commedia dell'arte (the masks)](../product/05-pattern-library.md#party-topology--commedia-dellarte-the-masks)                  | everyday-ai-user, software-engineer | planned |
| [The Eye Dr Test — pairwise preference](../product/05-pattern-library.md#the-eye-dr-test--pairwise-preference)                                   | everyday-ai-user, software-engineer | planned |
| [Candidate — Additional Opinion](../product/05-pattern-library.md#candidate--additional-opinion)                                                 | everyday-ai-user, software-engineer | vision  |
| [Rhythm patterns](../product/05-pattern-library.md#rhythm-patterns)                                                                              | everyday-ai-user, software-engineer | planned |
| [Candidate — temporal interaction interpretation](../product/05-pattern-library.md#candidate--temporal-interaction-interpretation)               | everyday-ai-user, software-engineer | vision  |
| [Candidate — continuity-critical flow and binary quench](../product/05-pattern-library.md#candidate--continuity-critical-flow-and-binary-quench) | everyday-ai-user, software-engineer | vision  |
| [Candidate role — Flow Steward](../product/05-pattern-library.md#candidate-role--flow-steward)                                                   | everyday-ai-user, software-engineer | vision  |
| [Candidate — oppositional support](../product/05-pattern-library.md#candidate--oppositional-support)                                             | software-engineer                   | vision  |
| [Candidate — The Malcolm Check](../product/05-pattern-library.md#candidate--the-malcolm-check)                                                   | everyday-ai-user, software-engineer | vision  |
| [Candidate — Beware of Naive Interventionism](../product/05-pattern-library.md#candidate--beware-of-naive-interventionism)                       | software-engineer                   | vision  |
| [Clean Room — active mechanic with contextual supports](../product/05-pattern-library.md#clean-room--active-mechanic-with-contextual-supports)   | everyday-ai-user, software-engineer | vision  |
| [Candidate — Snooping Footprint Reducer](../product/05-pattern-library.md#candidate--snooping-footprint-reducer)                                 | everyday-ai-user, software-engineer | vision  |
| [Candidate — Do Nothing, active and support](../product/05-pattern-library.md#candidate--do-nothing-active-and-support)                          | everyday-ai-user, software-engineer | vision  |
| [Active: Do Nothing](../product/05-pattern-library.md#active-do-nothing)                                                                         | software-engineer                   | vision  |
| [Support: Do Nothing](../product/05-pattern-library.md#support-do-nothing)                                                                       | software-engineer                   | vision  |
| [Relationship to nearby mechanics](../product/05-pattern-library.md#relationship-to-nearby-mechanics)                                            | software-engineer                   | vision  |
| [Candidate — Default to True / Default to False](../product/05-pattern-library.md#candidate--default-to-true--default-to-false)                  | software-engineer                   | vision  |
| [Fallback generalization — graded propositions](../product/05-pattern-library.md#fallback-generalization--graded-propositions)                   | software-engineer                   | vision  |
| [Candidate — Embodied Explorer](../product/05-pattern-library.md#candidate--embodied-explorer)                                                   | everyday-ai-user, software-engineer | vision  |

## 06 — Roadmap

| Section                                                                                                                                                                                 | Audiences                           | Status      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| [Roadmap — application release ladder](../product/06-roadmap.md#roadmap--application-release-ladder)                                                                                    | everyday-ai-user, software-engineer | planned     |
| [Release boundary](../product/06-roadmap.md#release-boundary)                                                                                                                           | software-engineer                   | specified   |
| [2026-08-31 forward retiming](../product/06-roadmap.md#2026-08-31-forward-retiming)                                                                                                     | software-engineer                   | implemented |
| [2026-09-04 forward retiming — WO-023 occupies v0.5.0](../product/06-roadmap.md#2026-09-04-forward-retiming--wo-023-occupies-v050)                                                      | software-engineer                   | implemented |
| [Work-order navigation and identity (candidate)](../product/06-roadmap.md#work-order-navigation-and-identity-candidate)                                                                 | everyday-ai-user, software-engineer | planned     |
| [Candidate — unattended work-order portfolio](../product/06-roadmap.md#candidate--unattended-work-order-portfolio)                                                                      | everyday-ai-user, software-engineer | vision      |
| [Capability progression policies](../product/06-roadmap.md#capability-progression-policies)                                                                                             | everyday-ai-user, software-engineer | specified   |
| [Activation, utilization, and XP](../product/06-roadmap.md#activation-utilization-and-xp)                                                                                               | software-engineer                   | specified   |
| [Reps, curiosity, and voluntary craft](../product/06-roadmap.md#reps-curiosity-and-voluntary-craft)                                                                                     | everyday-ai-user, software-engineer | specified   |
| [Efficiency as a separate capability axis](../product/06-roadmap.md#efficiency-as-a-separate-capability-axis)                                                                           | software-engineer                   | specified   |
| [Candidate — bounded system baseline](../product/06-roadmap.md#candidate--bounded-system-baseline)                                                                                      | everyday-ai-user, software-engineer | vision      |
| [Counterfactual profiling work orders](../product/06-roadmap.md#counterfactual-profiling-work-orders)                                                                                   | software-engineer                   | specified   |
| [v0.0.0 — Clean-room bootstrap _(mostly complete)_](../product/06-roadmap.md#v000--clean-room-bootstrap--mostly-complete)                                                               | software-engineer                   | implemented |
| [v0.0.1 — Environment truth (bounded) → WO-001](../product/06-roadmap.md#v001--environment-truth-bounded---wo-001)                                                                      | software-engineer                   | implemented |
| [v0.1.0 — Pure kernel → WO-002](../product/06-roadmap.md#v010--pure-kernel---wo-002)                                                                                                    | software-engineer                   | implemented |
| [v0.2.0 — Walking skeleton (fake executor) → WO-003](../product/06-roadmap.md#v020--walking-skeleton-fake-executor---wo-003)                                                            | everyday-ai-user, software-engineer | verified    |
| [v0.2.1 — Environment truth addendum and lifecycle corrections → WO-004 + WO-012](../product/06-roadmap.md#v021--environment-truth-addendum-and-lifecycle-corrections---wo-004--wo-012) | software-engineer                   | verified    |
| [v0.2.2 — Capability table v1 → WO-005](../product/06-roadmap.md#v022--capability-table-v1---wo-005)                                                                                    | everyday-ai-user, software-engineer | verified    |
| [v0.2.3 — Publication bootstrap → WO-006](../product/06-roadmap.md#v023--publication-bootstrap---wo-006)                                                                                | everyday-ai-user, software-engineer | implemented |
| [v0.3.0 — Audit-record baseline (three projections) → WO-007](../product/06-roadmap.md#v030--audit-record-baseline-three-projections---wo-007)                                          | everyday-ai-user, software-engineer | verified    |
| [v0.4.0 — Composition compiler v1 → WO-008](../product/06-roadmap.md#v040--composition-compiler-v1---wo-008)                                                                            | everyday-ai-user, software-engineer | verified    |
| [v0.5.0 — Compiled Entropy Reducer → WO-023](../product/06-roadmap.md#v050--compiled-entropy-reducer---wo-023)                                                                          | everyday-ai-user, software-engineer | planned     |
| [Application version pending — Real disposable worker → WO-009](../product/06-roadmap.md#application-version-pending--real-disposable-worker---wo-009)                                  | everyday-ai-user, software-engineer | planned     |
| [Application version pending — Independent verification → WO-010](../product/06-roadmap.md#application-version-pending--independent-verification---wo-010)                              | everyday-ai-user, software-engineer | planned     |
| [Application version pending — Feedback compiler v1 (ten units) → WO-011](../product/06-roadmap.md#application-version-pending--feedback-compiler-v1-ten-units---wo-011)                | software-engineer                   | planned     |
| [Application version pending — Projections & console](../product/06-roadmap.md#application-version-pending--projections--console)                                                       | everyday-ai-user, software-engineer | planned     |
| [Application version pending — Pattern workshop v1](../product/06-roadmap.md#application-version-pending--pattern-workshop-v1)                                                          | everyday-ai-user, software-engineer | planned     |
| [Application version pending — Source-to-deliverable vertical](../product/06-roadmap.md#application-version-pending--source-to-deliverable-vertical)                                    | everyday-ai-user, software-engineer | planned     |
| [v1.0.0 — Teammate-ready](../product/06-roadmap.md#v100--teammate-ready)                                                                                                                | everyday-ai-user, software-engineer | planned     |
| [Post-1.0 horizons](../product/06-roadmap.md#post-10-horizons)                                                                                                                          | everyday-ai-user, software-engineer | vision      |

The `v0.2.1` row reflects the repository's tagged, independently reviewed state.
Its roadmap prose retains time-indexed pre-close history and must not be misread
as a current blocked verdict.

## 07 — Execution guide

| Section                                                                                                                                                      | Audiences         | Status      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ----------- |
| [Execution guide — for any model session working in this repo](../product/07-execution-guide.md#execution-guide--for-any-model-session-working-in-this-repo) | software-engineer | implemented |
| [Read order for a cold start](../product/07-execution-guide.md#read-order-for-a-cold-start)                                                                  | software-engineer | implemented |
| [Operator resume phrases — how you get dispatched](../product/07-execution-guide.md#operator-resume-phrases--how-you-get-dispatched)                         | software-engineer | verified    |
| [Operator-opened ideation mode](../product/07-execution-guide.md#operator-opened-ideation-mode)                                                              | software-engineer | specified   |
| [Ideation breakout receipt and verification](../product/07-execution-guide.md#ideation-breakout-receipt-and-verification)                                    | software-engineer | specified   |
| [Workflow closeout and releases](../product/07-execution-guide.md#workflow-closeout-and-releases)                                                            | software-engineer | verified    |
| [Discipline](../product/07-execution-guide.md#discipline)                                                                                                    | software-engineer | specified   |
| [Model-specific notes](../product/07-execution-guide.md#model-specific-notes)                                                                                | software-engineer | specified   |

## 08 — Publication compiler

| Section                                                                                                                                                              | Audiences                           | Status    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- |
| [Publication compiler — one source, many authoritative editions](../product/08-publication-compiler.md#publication-compiler--one-source-many-authoritative-editions) | everyday-ai-user, software-engineer | vision    |
| [Source model](../product/08-publication-compiler.md#source-model)                                                                                                   | everyday-ai-user, software-engineer | specified |
| [Audience editions](../product/08-publication-compiler.md#audience-editions)                                                                                         | everyday-ai-user, software-engineer | specified |
| [Publication manifest](../product/08-publication-compiler.md#publication-manifest)                                                                                   | software-engineer                   | vision    |
| [Outline first; publication IR only as needed](../product/08-publication-compiler.md#outline-first-publication-ir-only-as-needed)                                    | software-engineer                   | specified |
| [Base publication and implementation overlays](../product/08-publication-compiler.md#base-publication-and-implementation-overlays)                                   | software-engineer                   | specified |
| [Planning, rendering, and checking roles](../product/08-publication-compiler.md#planning-rendering-and-checking-roles)                                               | software-engineer                   | specified |
| [Authority and honesty rules](../product/08-publication-compiler.md#authority-and-honesty-rules)                                                                     | everyday-ai-user, software-engineer | specified |
| [Product surface](../product/08-publication-compiler.md#product-surface)                                                                                             | everyday-ai-user, software-engineer | vision    |
| [Release-note edition](../product/08-publication-compiler.md#release-note-edition)                                                                                   | everyday-ai-user, software-engineer | verified  |
| [Bootstrap path](../product/08-publication-compiler.md#bootstrap-path)                                                                                               | software-engineer                   | planned   |

## 09 — Audit, records, resilience, and privacy

| Section                                                                                                                                                         | Audiences                           | Status    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- |
| [Audit, records, resilience, and privacy](../product/09-audit-resilience-privacy.md#audit-records-resilience-and-privacy)                                       | everyday-ai-user, software-engineer | vision    |
| [Audit audiences and decisions](../product/09-audit-resilience-privacy.md#audit-audiences-and-decisions)                                                        | everyday-ai-user, software-engineer | specified |
| [Canonical audit record](../product/09-audit-resilience-privacy.md#canonical-audit-record)                                                                      | software-engineer                   | planned   |
| [Fidelity levels](../product/09-audit-resilience-privacy.md#fidelity-levels)                                                                                    | everyday-ai-user, software-engineer | specified |
| [Audit projections and visualizations](../product/09-audit-resilience-privacy.md#audit-projections-and-visualizations)                                          | everyday-ai-user, software-engineer | specified |
| [Persistence and recovery classes](../product/09-audit-resilience-privacy.md#persistence-and-recovery-classes)                                                  | everyday-ai-user, software-engineer | specified |
| [Backup and disaster recovery choices](../product/09-audit-resilience-privacy.md#backup-and-disaster-recovery-choices)                                          | everyday-ai-user, software-engineer | specified |
| [Privacy and minimization](../product/09-audit-resilience-privacy.md#privacy-and-minimization)                                                                  | everyday-ai-user, software-engineer | specified |
| [Candidate — minimized incident reporting](../product/09-audit-resilience-privacy.md#candidate--minimized-incident-reporting)                                   | everyday-ai-user, software-engineer | vision    |
| [Candidate — model-input exposure plans](../product/09-audit-resilience-privacy.md#candidate--model-input-exposure-plans)                                       | everyday-ai-user, software-engineer | vision    |
| [Candidate — public Git with a local private evidence lane](../product/09-audit-resilience-privacy.md#candidate--public-git-with-a-local-private-evidence-lane) | software-engineer                   | vision    |
| [Policy dimensions implementations can customize](../product/09-audit-resilience-privacy.md#policy-dimensions-implementations-can-customize)                    | software-engineer                   | specified |
| [Bootstrap sequence](../product/09-audit-resilience-privacy.md#bootstrap-sequence)                                                                              | software-engineer                   | planned   |

## 10 — IR compatibility

| Section                                                                                                                         | Audiences                           | Status    |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- |
| [IR verification, lineage, and compatibility](../product/10-ir-compatibility.md#ir-verification-lineage-and-compatibility)      | everyday-ai-user, software-engineer | vision    |
| [Lightweight IR verifier](../product/10-ir-compatibility.md#lightweight-ir-verifier)                                            | everyday-ai-user, software-engineer | vision    |
| [Separate version axes](../product/10-ir-compatibility.md#separate-version-axes)                                                | software-engineer                   | specified |
| [Transformation graph](../product/10-ir-compatibility.md#transformation-graph)                                                  | software-engineer                   | specified |
| [Candidate — external rule-source import plans](../product/10-ir-compatibility.md#candidate--external-rule-source-import-plans) | everyday-ai-user, software-engineer | vision    |
| [Release-scoped mechanic availability](../product/10-ir-compatibility.md#release-scoped-mechanic-availability)                  | everyday-ai-user, software-engineer | specified |
| [Portable and regenerable sharing](../product/10-ir-compatibility.md#portable-and-regenerable-sharing)                          | everyday-ai-user, software-engineer | vision    |
| [Behavioral toolbox and game-AI horizon](../product/10-ir-compatibility.md#behavioral-toolbox-and-game-ai-horizon)              | everyday-ai-user, software-engineer | vision    |
| [Invariants](../product/10-ir-compatibility.md#invariants)                                                                      | software-engineer                   | specified |

## 11 — `προτείνω`

| Section                                                                                                                                         | Audiences                           | Status    |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- |
| [`προτείνω` (protíno) — the first-party application thesis](../product/11-proteino.md#προτείνω-protíno--the-first-party-application-thesis)     | everyday-ai-user, software-engineer | vision    |
| [Shape before machinery](../product/11-proteino.md#shape-before-machinery)                                                                      | everyday-ai-user, software-engineer | specified |
| [The playable loop](../product/11-proteino.md#the-playable-loop)                                                                                | everyday-ai-user, software-engineer | vision    |
| [A world on DotLn, not a second DotLn world](../product/11-proteino.md#a-world-on-dotln-not-a-second-dotln-world)                               | everyday-ai-user, software-engineer | specified |
| [Candidate — recap-primed resident memory](../product/11-proteino.md#candidate--recap-primed-resident-memory)                                   | everyday-ai-user, software-engineer | vision    |
| [Intervention truth](../product/11-proteino.md#intervention-truth)                                                                              | everyday-ai-user, software-engineer | specified |
| [Ad hoc first, reusable on evidence](../product/11-proteino.md#ad-hoc-first-reusable-on-evidence)                                               | everyday-ai-user, software-engineer | specified |
| [Candidate — commander-mediated tactical play](../product/11-proteino.md#candidate--commander-mediated-tactical-play)                           | everyday-ai-user, software-engineer | vision    |
| [Books and personal styles become experiments](../product/11-proteino.md#books-and-personal-styles-become-experiments)                          | everyday-ai-user, software-engineer | vision    |
| [Counterfactuals are the scoreboard](../product/11-proteino.md#counterfactuals-are-the-scoreboard)                                              | everyday-ai-user, software-engineer | specified |
| [Candidate — time fidelity and bounded future reachability](../product/11-proteino.md#candidate--time-fidelity-and-bounded-future-reachability) | everyday-ai-user, software-engineer | vision    |
| [Candidate — behavior is not animate-only](../product/11-proteino.md#candidate--behavior-is-not-animate-only)                                   | everyday-ai-user, software-engineer | vision    |
| [Every apparent affordance tells the truth](../product/11-proteino.md#every-apparent-affordance-tells-the-truth)                                | everyday-ai-user, software-engineer | vision    |
| [Source shapes, not copied implementations](../product/11-proteino.md#source-shapes-not-copied-implementations)                                 | everyday-ai-user, software-engineer | vision    |
| [Candidate first evidence slice](../product/11-proteino.md#candidate-first-evidence-slice)                                                      | everyday-ai-user, software-engineer | vision    |
| [Unresolved product choices](../product/11-proteino.md#unresolved-product-choices)                                                              | everyday-ai-user, software-engineer | vision    |

## 12 — Workstream application

| Section                                                                                                                                             | Audiences                           | Status |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------ |
| [Workstream application — end-user workflow candidate](../product/12-workstream-application.md#workstream-application--end-user-workflow-candidate) | everyday-ai-user, software-engineer | vision |
| [Arriving at the desk](../product/12-workstream-application.md#arriving-at-the-desk)                                                                | everyday-ai-user, software-engineer | vision |
| [One outcome from request to return](../product/12-workstream-application.md#one-outcome-from-request-to-return)                                    | everyday-ai-user, software-engineer | vision |
| [Replacing a successful but costly workflow](../product/12-workstream-application.md#replacing-a-successful-but-costly-workflow)                    | everyday-ai-user, software-engineer | vision |
| [One workstream across repositories](../product/12-workstream-application.md#one-workstream-across-repositories)                                    | everyday-ai-user, software-engineer | vision |
| [What exists and what must be proved](../product/12-workstream-application.md#what-exists-and-what-must-be-proved)                                  | everyday-ai-user, software-engineer | vision |
| [Open product choices](../product/12-workstream-application.md#open-product-choices)                                                                | everyday-ai-user, software-engineer | vision |
