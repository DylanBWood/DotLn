# Principles (design axioms)

Numbered for citation from work orders and reviews. These are the load-bearing
constraints of this repository and the author's personal implementation;
changing one here requires a decision record that names the evidence. They are
not automatically the conformance policy for every implementation built with
the DotLn platform. ADR-0006 requires each reusable contract to be separated
from the instance doctrine that chooses whether and how to equip it.

Layer labels below are load-bearing: **platform contract** governs a declared
shared mechanism or interchange; **personal profile** is the author's selected
implementation doctrine; **repository governance** governs building this repo;
**mixed boundary** states how those layers meet.

1. **Architecture is interaction.** _Platform contract._ The core must make sense with people, index
   cards, timers, folders, and rules — the _analog completeness test_. If a core
   feature only works because an LLM improvises around missing semantics, it
   does not belong in the core grammar. Claude/Codex are adapters, never
   ontological dependencies.
2. **Deterministic core, nondeterministic edge.** _Platform contract._ Pure functions and statecharts
   decide _what should happen_; models, humans, shells, and browsers execute
   effects and return typed events. No hidden clock, ambient randomness, I/O, or
   model call inside a reactor.
3. **External memory beats transcript memory.** _Personal profile._ Workstreams, decisions,
   continuations, evidence, and identity versions live in the event store and
   survive session death. A session is an incarnation, not the agent's enduring
   self; the workflow remembers the worker, the worker never needs to remember
   the workflow.
4. **Fresh task-scoped sessions are normal.** _Personal profile._ The disposal unit is one coherent
   task or phase — not one turn. Orientation comes from a compiled WorkOrder
   plus the environment, never from a handcrafted giant prompt. The Twelve
   Days of Christmas analogy names cumulative replay cost: a session starting
   with a huge inherited context is like beginning the song on day five,
   already carrying the earlier verses' material before it can do new work.
   Durable history and the context admitted to this task are separate budgets.
5. **Configured hard constraints live outside the model.** _Personal profile._ In this personal
   implementation, permissions, hooks, worktree isolation, gated affordances,
   and deterministic checks enforce the constraints its owner chose to make
   hard. Prompt prose is the 9th and last mechanism choice, not the 1st. The
   platform supplies that lowering; another implementation may choose a
   different hard set or none.
6. **Evidence precedes this implementation's "done".** _Personal profile._ Claims are proven by the
   strongest available signal — tests, types, static analysis, DOM state,
   screenshots, network traces, independent review. A model saying "implemented
   successfully" is not evidence here. The platform keeps verified,
   owner-accepted, and unverified outcomes distinguishable; an owner may choose
   to run without a verification gate rather than inherit this one.
7. **Compiled feedback, explicit source treatment.** _Mixed boundary._ Corrections compile into the
   cheapest sufficient mechanism. When a source-lineage capability is equipped,
   derivatives carry source references under its declared retention policy. The
   author's personal profile additionally preserves scrubbed verbatim incidents
   with provenance (a summary can be regenerated from a source; a source cannot
   be reconstructed from a summary); another profile may deliberately discard
   that source after active use and declare the lineage unavailable.
8. **No silent model degradation.** _Personal profile._ The required model is a constraint, not an
   economy lever. Budget pressure changes timing, breadth, retries, or queueing
   — never the model, silently. Budgets vary by tranche (Probe / Sow / Commit /
   Verify / Recover — see domain model), with Verify protected.
9. **No local-optimum theater.** _Personal profile._ Throughput toward the goal, quality, operator
   burden, and bottleneck flow are the objectives. Agent utilization is not.
   _Activating_ a resource is not _utilizing_ it; output that outruns the
   binding constraint (usually operator judgment bandwidth) is inventory, not
   progress. Efficiency is a scoped resource vector per verified outcome, never
   a single utilization score. Improve the Pareto frontier without silently
   exporting cost into quality, authority, privacy, recoverability, or human
   attention.
10. **Authority transitions are explicit instance doctrine.** _Mixed boundary._ Repo
    conventions, roles, context factors, and experiments cannot leak globally
    by accident. The current executable fixture uses a typed envelope
    (allowed/denied effects, limits, required evidence, expiry, revocation
    events). An owner-authored PresencePolicy may preauthorize that authority to
    hold, shrink, grow progressively, peak, reset, or loop on recorded
    presence/time events; silence under a policy with no transition changes
    nothing. The platform makes regimes and transitions composable and
    inspectable rather than selecting one direction for every owner.
11. **Every pattern reveals its mechanics.** _Platform contract._ Lossy projections are labeled,
    and any declared interchange exposes the semantics needed to identify what
    was lost. In an implementation that equips the rich build inspector,
    "Inspect Mechanics" is one interaction away. Three kinds of stats are never
    blurred: declared mechanics, computed current attributes, empirical
    performance. No fake numbers, ever.
12. **New ideas extend or explicitly supersede; they never erase through
    recency.** _Repository governance._ The idea ledger is append-only; superseding requires naming what
    is superseded and why. (This is an operator directive, not a preference.)
13. **Links are scope, not sequence.** _Platform contract._ Composition declares which modifiers
    participate in a behavior's semantics — never execution order. Ordinary
    supports must commute; non-commuting transforms must become explicit
    pipelines, statechart fragments, or rejected links.
14. **Doing nothing is a decision, not the required end of absence.** _Mixed boundary._ NoOp is a
    first-class intent carrying a reason, evidence, a reevaluation cadence, and
    the condition that would make action useful. Each candidate unattended
    action has its own expected-value curve. The author's candidate housekeeping
    profile favors reversible, legible work to reduce return-time reorientation,
    while another declared policy may progressively widen scope or authority
    within a ceiling and then stop, reset, or loop.
15. **Environment truth before architecture.** _Repository governance._ Mechanism choices (worker
    transport, storage, UI stack) are outputs of empirical discovery on the
    actual machine, not of product documentation. Unknown is an acceptable
    finding; claims carry an epistemic label (observed / documented locally /
    documented officially — vendor documentation / untested / blocked / not
    found / ambiguous).
16. **Original terms stay primary — and the RPG skin stays on.** _Personal profile._ Seiri / Sort
    / 整理 keeps its name in the IR and everywhere canonical; the RPG rendering
    is nonetheless the _default presentation skin_ of the operator's own console
    — primacy is about canonicity, not about hiding the fun. Internal vocabulary
    (gems, masks, DotLn itself) never leaks into external artifacts — PRs,
    commits, and coworker-facing text follow the destination's conventions (the
    _workplace camouflage_ rule, generalized: projection boundaries are real
    boundaries).

17. **Repo-native.** _Platform integration contract._ In any target codebase, convention authority resides in
    that codebase's demonstrated architecture — captured in its RepoProfile —
    never in the model's training-set fashion. "Latest best practice" is not a
    reason to rewrite an established repository.

18. **Common legos, local secret sauce.** _Platform contract._ DotLn standardizes composable
    primitives, compiler and compatibility contracts, capability declarations,
    and inspection—not one mandatory safety or operating doctrine. Individuals,
    teams, organizations, and fields own their workstreams, integrations,
    sources, controls, identities, roles, personalities, combinations,
    authority, evidence, replay, retention, evaluators, and learned doctrine as
    versioned instance content. The author's strict personal loadout and bundled
    patterns are reference choices, never privileged kernel behavior. A
    mechanism's contract binds when that capability is declared or equipped; the
    platform does not silently equip it for every owner.

A closing note on altitude: each numbered principle states either a reusable
contract or a rule of this repository/personal profile as labeled; it is not an
unmarked universal policy bundle. Specific formulas in the domain model (the
AttentionPolicy candidate, log-odds stacking, per-action utility curves) are
**candidate defaults** — the learning loop must be able to replace them with
what empirically beats them.
