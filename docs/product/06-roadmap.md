# Roadmap — semver ladder

Versions with exit criteria; pivots are gated on evidence at each rung. Ideas
recorded in the ledger never block a rung and never sneak into one — the
deferral list is part of each milestone's definition. Two pacing rules:
**point of view before efficiency** (explore until a perspective exists, then
optimize), and **every rung ships a visible payoff** — this is a solo project
run on momentum; six rungs of invisible infrastructure is a project-death
risk, so each version ends with something the operator can see, touch, or
play with. The environment for this
ladder is the **personal machine** (macOS, personal Claude Code plan, Codex CLI
as second executor, personal GitHub); managed-environment constraints (enterprise
gateways, centrally managed settings) are out of scope until such a
deployment exists.

## Capability progression policies

The semver ladder is one release view. Inside and across its rungs, DotLn can
treat each feature, integration, projection, pattern, or operational capability
like a skill that advances through evidence-backed levels. This makes several
implementation strategies explicit rather than letting whichever feature is
most exciting consume the whole roadmap.

Candidate capability levels:

| Level | Meaning | Minimum evidence |
|---|---|---|
| 0 — latent | named idea or need; no usable behavior | source and intended outcome |
| 1 — demonstrable | thinnest coherent behavior exists | bounded fixture or witnessed example |
| 2 — dependable | normal path and important failures behave predictably | automated checks and repeatable evidence |
| 3 — integrated | participates in real workflows and lifecycle | end-to-end use, recovery, authority, and audit evidence |
| 4 — production | supportable under the implementation's declared risk | security, privacy, operations, restore, performance, and acceptance gates |
| 5 — polished | professional, legible, efficient, accessible, and pleasant | user evidence, edge-case quality, documentation, and maintained regression suite |

The labels and gates matter more than whether numbering starts at zero or one.
Level is scoped: `audit.timeline@2` can coexist with `audit.rawExport@0`.
Production means production for a declared implementation profile, not one
universal enterprise bar.

“XP” is shorthand for admissible evidence—passing fixtures, witnessed use,
recovery exercises, resolved findings, measured usability—not commits, tokens,
hours, output volume, or model confidence. Work can accumulate evidence without
leveling up; promotion occurs only when every required gate for the next level
passes. A compact overall level is the minimum of its required dimensions, so
averaging cannot hide a security or recovery zero behind a polished interface.

### Activation, utilization, and XP

Capability learning needs at least three separate measures:

- **activation:** the planner/compiler selected the capability because its
  predicate and scope matched;
- **utilization:** the capability materially participated in a decision,
  behavior, artifact, control, or verified outcome after activation;
- **XP/evidence gain:** the episode produced admissible new evidence about the
  capability's competence, limits, reliability, usability, or next-level gate.

Also retain **eligibility/opportunity**—how often the capability could have
activated—so a low count is interpretable. These measures must not collapse
into one popularity score:

| Signal | Likely question |
|---|---|
| high opportunity, low activation | Is selection, discoverability, tagging, or policy wrong? |
| high activation, low utilization | Is this an aura-stack passenger adding cost without changing outcomes? |
| high utilization, low evidence gain | Is it repeatedly working without learning, or are outcomes unmeasured? |
| high utilization, poor outcomes | Is the capability weak, mis-scoped, or blocking the system? |
| low use, catastrophic consequence | Is this a rare invariant that must remain mature despite low frequency? |
| rising XP, unchanged level | Which unsatisfied promotion gate is holding it back? |

Utilization can be causal only where the fixture or counterfactual supports the
claim; otherwise label it `participated`, not `caused`. XP can be positive,
negative, or narrowing: a failed experiment that exposes a boundary improves
knowledge without pretending the feature became more capable.

An activation is still a durable learning event even when utilization is zero.
It records that the selector saw a relevant opportunity under a particular
scope and state. Useful activation-event properties include capability and
version, trigger/predicate, matched facts, scope, competing candidates,
selection score or reason, selected/suppressed outcome, expected cost,
reserved context/tools, expiry, and the later utilization/result link. Over
time these events reveal demand, false and missed activation, trigger drift,
co-activation patterns, expensive passengers, seasonality, and candidates for
prefetching, retirement, composition, or deeper investment.

Therefore activation evidence can earn **selector/activation-policy XP** and
can improve knowledge about a capability's applicability. It does not by
itself earn capability-effectiveness XP. A zero-utilization activation remains
evidence rather than waste by definition; repeated zero-utilization under the
same conditions becomes evidence that the selection rule or packaging needs
attention. Suppressed and declined activations are retained when policy and
privacy permit, because future outcomes may show that the road not taken was
the important signal.

### Reps, curiosity, and voluntary craft

The progression system must not punish **getting the reps in**. Repeated use
can build operator fluency, implementation familiarity, sample diversity,
muscle memory, better examples, edge-case discovery, and confidence in a known
path even when it does not immediately clear a promotion gate or attack the
current system constraint.

Keep at least two evidence accounts:

- **practice XP:** attributable repetitions, varied contexts, completed
  exercises, and observations that improve familiarity or enlarge the sample;
- **promotion evidence:** proof that a named next-level capability gate now
  passes under its declared conditions.

Practice XP is real and visible but cannot counterfeit reliability, security,
or production readiness. Conversely, lack of immediate promotion does not
turn a useful rep into failure. Repetitions should retain context and novelty
so ten identical easy runs are distinguishable from ten increasingly varied
ones, without imposing a game mechanic that makes people optimize counts.

Theory of Constraints is advisory except where a bounded release contract
explicitly makes the constraint a gate. It explains where work may have the
greatest end-to-end leverage; it does not revoke the operator's freedom to
follow curiosity, joy, craftsmanship, availability, or momentum. The operator
may always choose a capability and make it better within the active authority
envelope, while the system shows opportunity cost and dependencies without
shaming or blocking the choice.

Theory of Constraints uses these signals to decide which capabilities receive
love. Identify the current system constraint from end-to-end flow and evidence;
exploit it with the smallest intervention; subordinate adjacent work; elevate
its capability level only when needed; then repeat because the constraint may
move. The scheduler considers blocked work, queue/wait time, failure and retry
concentration, handoff delay, evidence gaps, operator burden, and the
counterfactual value of an improvement—not utilization alone. The most-used
feature is not necessarily the constraint, and the least-used feature is not
necessarily neglected.

The capability table can therefore begin with:

`opportunities | activations | utilizations | outcome/evidence refs | XP delta |
current level | blocking gate | constraint contribution | next experiment`.

All counts retain scope and observation window. Comparisons across unrelated
capabilities or implementations are invalid unless their opportunities,
consequences, and evidence standards are comparable.

The planner can select a progression policy per horizon or portfolio:

- **breadth first / one skill point better:** choose the smallest useful,
  verified increment for each eligible capability before returning for another
  lap; useful for revealing the whole shape and integration seams;
- **depth first:** hold focus on one capability until a named target level,
  including professional and polished qualities; useful for the load-bearing
  path or a flagship experience;
- **minimum threshold:** bring every required capability to a release floor,
  leaving optional capabilities untouched;
- **furthest back first / golf scoring:** select the lowest qualified capability
  or weakest required dimension, with risk and dependency tie-breakers;
- **constraint first:** improve the capability currently limiting end-to-end
  value, reliability, or learning, following the activation/utilization/XP
  diagnosis above and Theory of Constraints;
- **risk-weighted:** raise high-consequence authority, privacy, recovery, or
  evidence capabilities before cosmetic maturity;
- **mixed portfolio:** reserve explicit capacity for floor-raising, one deep
  flagship, integration debt, and exploratory level-zero probes.
- **free practice / follow interest:** improve whichever capability attracts
  voluntary attention, recording reps, learning, and evidence while keeping
  constraint recommendations visible but non-coercive.

Selection is still constrained by dependencies, authority, expected value,
verification capacity, and the release's visible-payoff rule. A breadth pass
must produce coherent vertical behavior rather than a field of disconnected
stubs. A depth pass stops at its declared target instead of polishing one
corner indefinitely. `Do Nothing` remains a valid result when no candidate has
positive expected value or sufficient evidence.

The first implementation can remain simple: a reviewed capability table with
current level, target level, required dimensions, evidence links, dependencies,
last change, and next smallest promotable increment. Only after real planning
uses expose a need should this become scheduler IR or an XP engine.

### Efficiency as a separate capability axis

Every skill, feature, domain, integration, workflow, projection, and role can
also carry an **efficiency profile**. Maturity asks whether it can satisfy its
contract; efficiency asks what resources a verified unit of useful outcome
requires under declared conditions. A mature capability can be inefficient,
and an efficient demo can still be immature.

Efficiency is not one number. Record a resource/outcome vector such as:

```ts
type EfficiencyObservation = {
  capabilityRef: string;
  scenarioRef: string;
  implementationRef: string;
  window: { from: string; to: string };
  opportunities: number;
  verifiedOutcomes: number;
  resources: {
    elapsedMs?: number;
    operatorAttentionMs?: number;
    modelTokens?: number;
    modelCalls?: number;
    toolCalls?: number;
    computeCost?: number;
    retryCount?: number;
    storageBytes?: number;
    energyEstimate?: number;
  };
  qualityRefs: string[];
  failureRefs: string[];
  authorityAndRiskRefs: string[];
  baselineRef?: string;
};
```

The denominator is a verified outcome or completed contract—not output volume,
activations, story points, or busyness. Comparisons require comparable scenario,
quality, authority, and risk conditions. Missing measurement remains unknown.

A useful provisional efficiency scale is:

| Level | Meaning |
|---|---|
| E0 — unknown | no trustworthy baseline |
| E1 — measured | representative baseline and resource vector exist |
| E2 — economical | obvious waste removed without weakening the contract |
| E3 — fit for profile | meets the implementation's declared budgets and service objectives |
| E4 — frontier | no observed alternative improves one important resource without worsening another protected outcome |
| E5 — adaptive | detects drift, selects among proven strategies, and revalidates the frontier as conditions change |

`E4` is a local Pareto frontier, not “perfect.” It is scoped to a scenario,
implementation, time window, and protected outcomes. A later technique can
move the frontier.

Constant efficiency awareness should produce **optimization candidates**, not
constant intervention. Candidates name observed waste, affected resource,
baseline, hypothesis, protected invariants, smallest reversible experiment,
expected gain, measurement plan, and rollback. `Beware of Naive
Interventionism` applies: do nothing when measurement cost or change risk
exceeds expected gain, and never optimize a non-constraint merely because its
metric is easy to improve.

Common efficiency avenues include avoiding unnecessary activation and context;
better caching and reuse; deterministic mechanisms replacing repeated model
work; batching or parallelism where ordering permits; cheaper perception before
expensive perception; right-sized model/runtime selection without silent
substitution; fewer handoffs and retries; smaller evidence with equal strength;
incremental computation; better stop conditions; archival/tiering; and reduced
operator cognitive load. Efficiency improvements retain before/after evidence
and note which resource moved elsewhere.

The capability table can add `efficiencyLevel`, `baseline`, `resourceVector`,
`protectedOutcomes`, `frontierAlternatives`, and `nextExperiment`. Efficiency
XP comes from trustworthy measurements and successful or informative
experiments; it never raises maturity automatically.

## v0.0.0 — Clean-room bootstrap  *(mostly complete)*

Repo, intake pipeline, blueprint docs, idea ledger, decision records, first
work orders. Exit: initial commit on `main`; `docs/` is the complete shared
memory a cold model session needs. No application code. `.claude/` grows
iteratively with use (one config-log line per change); decision records only
for safety-boundary config (permissions, hooks).

## v0.0.1 — Environment truth (bounded)  → WO-001

A 30–60 minute bounded inspection, not the comprehensive audit (that variant
stays preserved in the ledger for wrapped/managed environments). Record with
epistemic labels: node/package-manager/TS toolchain; git + worktree behavior;
Claude Code surface actually present (print mode, structured output, agents,
workflows, background, worktrees, hooks, session persistence); Codex CLI
surface; Playwright availability; SQLite; localhost serving. Exit:
`docs/discovery/environment.md` + machine-readable summary; a named choice of
worker-transport adapters to build first, from evidence.

## v0.0.2 — Environment truth addendum (transports observed)  → WO-004

Close the gaps WO-001 deliberately deferred: both candidate transport launch
shapes exercised for real from an unsandboxed authenticated session, MCP as a
capability row, full startup-context accounting, effective settings loading,
the user-level `model` key. Exit: the v0.4.0 transport recommendation
re-stated over `observed` rows (or honestly re-labeled with cause), and
`environment.json` row parity including the Codex feature-surface row.

## v0.0.3 — Capability table v1  → WO-005

The Capability-progression section's own "first implementation can remain
simple": a reviewed Markdown table — evidence-linked levels,
minimum-of-dimensions composites, `E0 — unknown` efficiency defaults, one
recorded progression policy. Exit: `docs/planning/capability-table.md` with
every non-latent row naming its blocking gate.

## v0.0.4 — Publication bootstrap  → WO-006

Steps 1–4 of the publication-compiler bootstrap (08): audience/status index
over the blueprint, base outline + implementation-overlay template, two
sharply different tables of contents from the same sources, one dual-voice
sample, and a demonstrated staleness loop. This anchors 08's "first-class
output from the beginning" on the ladder; further editions stay gated on this
loop working. Exit: `docs/publication/` exists and the staleness
demonstration is captured.

## v0.1.0 — Pure kernel  → WO-002

TypeScript, **zero runtime dependencies, no I/O**. Events + EventEnvelope
(including the Comparison event type), immutable state, reactors `(state,
event, env) → Decision`, continuations, cadence with virtual time, explicit
RNG state, decision traces, append-only JSONL store + replay. Scope is what
the walking skeleton consumes — *types* for the full Program and Cadence
grammars, *evaluation semantics* only for the subset WO-002 names; the rest
arrives on contact at later rungs (the domain model holds the target shape).
Exit criteria: rows 1, 3, 5 of the canonical failure-injection matrix
(03-architecture) pass; same event log ⇒ same controller transitions,
provably. Visible payoff: `replay` pretty-prints a decision trace you can
actually read. Deferred: remaining grammar/matrix rows, every UI, every real
adapter, the pattern compiler.

## v0.2.0 — Walking skeleton (fake executor)  → WO-003

The Repo Gardener + Seiri vertical against a deterministic fake executor:
create inspection task → operator Present/Away → virtual 20-minute pulse →
kernel emits bounded WorkOrder → fake worker returns evidence-backed deletion
*candidates* (no deletion authority) → separate fake verifier accepts/rejects
→ Operator Returned cancels pulses → replay reproduces the identical final
state. CLI projection + human-readable event timeline are the first views.
Exit: the 13-step demo runs end-to-end twice — live and from replay — with
identical traces, **and the run renders as an emoji-glyph scene** (the
operator's own visual-prototype-zero: 🐛 gardener plus glyph states from the
visual grammar, printed to terminal or a static HTML page — zero assets, a
pure projection of the log). Deferred: real model calls, interactive web UI.

## v0.2.1 — Audit-record baseline (three projections)  → WO-007

Bootstrap steps 1–3 of the audit map (09), against the walking skeleton's
real demo log: consequential-action enumeration with the question each record
answers, a minimal pinned AuditRecord envelope referencing the event store
(never a second truth), and three pure-fold projections — L0 receipt, causal
timeline, governed raw JSON. This anchors 09's bootstrap on the ladder; steps
4–7 wait for v0.4.0's machinery. Exit: identical projection output over live
and replayed logs, with step 9's structural refusal visible in the receipt.

## v0.3.0 — Composition compiler v1  → WO-008

LoadoutGraph + support facets + link type-checking + deterministic precedence
+ compiled-diff preview (CLI). The Seiri link group compiles to heterogeneous
mechanisms with per-support declared cost. Exit: an incompatible link fails at
compile time with the SUPPORT INACTIVE diagnosis; equipping/unequipping
changes the running program and the semantic hash proves view equivalence
across at least {code DSL, function table, statechart JSON}. Visible payoff:
the compiled-diff preview renders as an **RPG item tooltip** (GRANTS /
RESTRICTIONS / OBLIGATION / PASSIVE / PULSE / INTERRUPT), not only CLI text.

## v0.4.0 — Real disposable worker  → WO-009

WorkOrderTransport adapters chosen by v0.0.1 evidence — expected: claude
CLI print-mode with the canonical launch shape (fresh bounded invocation,
project+local settings only, **ambient/auto memory disabled** — no
harness-owned memory loads into a fresh episode; external memory is
deliberate — isolated worktree, explicit model + effort, no session
persistence, JSON schema output) and a codex equivalent. Worktree
lifecycle is deterministic (create, verify cwd, clean up). Exit: one real
episode replaces the fake executor in the v0.2.0 demo and returns a compact
result envelope; the main session's transcript grows by only the envelope; a
killed worker leaves a recoverable pending command (matrix rows 2, 4, 6 pass
here); **`dotln status` exists** — a live in-flight projection of the store
(running episodes, leases/heartbeats, pending commands, recent events) so
real workers never run blind. **No silent model substitution** — unavailable
model ⇒ queue or fail closed.

## v0.5.0 — Independent verification  → WO-010

Blinded verifier episodes; claim-typed evidence mapping; typed
VerificationFinding → focused repair continuation in a fresh episode;
substantive repair marks affected evidence stale. Exit: a deliberately-planted
defect is caught by the verifier, repaired via continuation, re-verified — and
the implementer episode never certifies itself.

## v0.6.0 — Feedback compiler v1 (ten units)  → WO-011

Ten representative FeedbackUnits authored from the corpus (this repo's ledger,
not any external rule stack): anti-oscillation; correctness-over-sycophancy;
the fail-conservative correction reactor (semantic events, not profanity
triggers); verify-app-before-done; no-attribution (settings + commit-msg hook
as defense in depth, with a precise predicate); concurrent-work-requires-
worktrees; no-lint/type-disables-as-fixes; read-your-own-output; no-partial-
completion; bounded boy-scout cleanup. Each: mechanism per the hierarchy +
regression fixture + maturity stats. Exit: measured startup-context reduction
vs. prose equivalents; each unit's fixture fails when the mechanism is
removed; **and the first self-hosted step** — one DotLn work order for this
repo itself is compiled, dispatched, executed, and verified by DotLn
(ADR-0001's strangler experiment gets its vehicle).

## v0.7.0 — Projections & console

Web console (UI framework decided *here* by ADR with v0.0.1 evidence; default
recommendation: Angular, the operator's fluency — the kernel doesn't care).
Synchronized views: RPG loadout + statechart + function table + event timeline
+ raw IR, semantic-hash equality across editable views; glyph system with the
visual grammar; replay scrubber; the first full transmog skin beyond glyphs
(Native Emoji) — the friendly skin serves the teammate goal and does not wait
for v1.0. Terminal remains a complete control surface.
Exit: the v0.2.0 demo watched entirely from the console, then re-watched via
replay; every animated element opens its mechanics inspector.

## v0.8.0 — Pattern workshop v1

5S equipment set with compiled set bonuses; Marquet ladder as the
operator-agent protocol (autonomy rung computed, not set); mitigated-speech
voice selector; drag-and-drop equip with exact compiled diff preview. Exit:
dragging Seiri onto Repo Gardener in the console produces the same semantic
hash as authoring the equivalent link group in code.

## v0.9.0 — Source-to-deliverable vertical

Prove the ports with a personal-flavor vertical: GitHub Issue → SourceBundle →
StoryContract → RepoProfile + ImpactMap → **Live Witness baseline** (reproduce
before changing; preserve baseline evidence) → implementation episode →
blinded behavior verification **and** independent code review (two separate
episodes) → evidence-grounded PR on a personal repo (the deliverable-ready
conjunction checklist, 03 §DeliveryAdapter) → post-PR loop (CI
classification, comment triage, source revision guard). The enterprise-tracker adapter remains a future optional plug-in — the
promise generalizes to "any tracked-work artifact + registered repo + named
authority profile → independently verified deliverable." Exit: one real issue
travels the pipeline with operator interruptions only at material decisions.

## v1.0.0 — Teammate-ready

A person who has never read these docs declares one bounded intent and
receives a verifiable result, without learning the taxonomy and without a
giant transcript. Exit: witnessed run by a non-author.

## Post-1.0 horizons

Simulation laboratory — paired counterfactuals, first-divergence search,
agent swaps, all-clone towns, reflection-question design, time-dilation,
recognition-beyond-identifiers, accuracy-vs-rationale decoupling,
biographical seeding, bounded-inconsistency generation, length-scale
attention aggregation (the full catalog lives in the ledger's chat-005
entries; this list is not exhaustive); the full pattern shelf (Compendium
skin); remaining transmog skins; physical-card importer; hypothesis flywheel.
All gated on the same kernel; none may distort Horizon 1.
