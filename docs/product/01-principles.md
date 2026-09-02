# Principles (design axioms)

Numbered for citation from work orders and reviews. These are the load-bearing
constraints; changing one requires a decision record that names the evidence.

1. **Architecture is interaction.** The core must make sense with people, index
   cards, timers, folders, and rules — the _analog completeness test_. If a core
   feature only works because an LLM improvises around missing semantics, it
   does not belong in the core grammar. Claude/Codex are adapters, never
   ontological dependencies.
2. **Deterministic core, nondeterministic edge.** Pure functions and statecharts
   decide _what should happen_; models, humans, shells, and browsers execute
   effects and return typed events. No hidden clock, ambient randomness, I/O, or
   model call inside a reactor.
3. **External memory beats transcript memory.** Workstreams, decisions,
   continuations, evidence, and identity versions live in the event store and
   survive session death. A session is an incarnation, not the agent's enduring
   self; the workflow remembers the worker, the worker never needs to remember
   the workflow.
4. **Fresh task-scoped sessions are normal.** The disposal unit is one coherent
   task or phase — not one turn. Orientation comes from a compiled WorkOrder
   plus the environment, never from a handcrafted giant prompt. (The 12 Days of
   Christmas rule: a replacement singer joining at day four needs the current
   verse, tempo, and score — not the transcript of every prior performance.)
5. **Hard constraints live outside the model.** Permissions, hooks, worktree
   isolation, gated affordances, and deterministic checks enforce invariants.
   Prompt prose is the 9th and last mechanism choice, not the 1st.
6. **Evidence precedes "done".** Claims are proven by the strongest available
   signal — tests, types, static analysis, DOM state, screenshots, network
   traces, independent review. A model saying "implemented successfully" is not
   evidence. Verification is a gate, never a question to the operator.
7. **Compiled feedback, preserved source.** Corrections are compiled into the
   cheapest sufficient mechanism, while verbatim incidents are preserved with
   provenance (a summary can be regenerated from a source; a source can never be
   reconstructed from a summary). Every derivative points back.
8. **No silent model degradation.** The required model is a constraint, not an
   economy lever. Budget pressure changes timing, breadth, retries, or queueing
   — never the model, silently. Budgets vary by tranche (Probe / Sow / Commit /
   Verify / Recover — see domain model), with Verify protected.
9. **No local-optimum theater.** Throughput toward the goal, quality, operator
   burden, and bottleneck flow are the objectives. Agent utilization is not.
   _Activating_ a resource is not _utilizing_ it; output that outruns the
   binding constraint (usually operator judgment bandwidth) is inventory, not
   progress. Efficiency is a scoped resource vector per verified outcome, never
   a single utilization score. Improve the Pareto frontier without silently
   exporting cost into quality, authority, privacy, recoverability, or human
   attention.
10. **Every intervention has scope and expiry.** Repo conventions, roles,
    context factors, and experiments cannot leak globally by accident. Authority
    is a typed envelope (allowed/denied effects, limits, required evidence,
    expiry, revocation events) — never a personality trait, and never enlarged
    by elapsed operator absence.
11. **Every pattern reveals its mechanics.** Lossy projections are labeled;
    "Inspect Mechanics" is always one click away. Three kinds of stats are never
    blurred: declared mechanics, computed current attributes, empirical
    performance. No fake numbers, ever.
12. **New ideas extend or explicitly supersede; they never erase through
    recency.** The idea ledger is append-only; superseding requires naming what
    is superseded and why. (This is an operator directive, not a preference.)
13. **Links are scope, not sequence.** Composition declares which modifiers
    participate in a behavior's semantics — never execution order. Ordinary
    supports must commute; non-commuting transforms must become explicit
    pipelines, statechart fragments, or rejected links.
14. **Doing nothing is a decision.** NoOp is a first-class intent carrying a
    reason, evidence, a reevaluation cadence, and the condition that would make
    action useful. Each candidate unattended action has its own expected-value
    curve; prolonged absence degrades toward read-only work and NoOp.
15. **Environment truth before architecture.** Mechanism choices (worker
    transport, storage, UI stack) are outputs of empirical discovery on the
    actual machine, not of product documentation. Unknown is an acceptable
    finding; claims carry an epistemic label (observed / documented locally /
    documented officially — vendor documentation / untested / blocked / not
    found / ambiguous).
16. **Original terms stay primary — and the RPG skin stays on.** Seiri / Sort
    / 整理 keeps its name in the IR and everywhere canonical; the RPG rendering
    is nonetheless the _default presentation skin_ of the operator's own console
    — primacy is about canonicity, not about hiding the fun. Internal vocabulary
    (gems, masks, DotLn itself) never leaks into external artifacts — PRs,
    commits, and coworker-facing text follow the destination's conventions (the
    _workplace camouflage_ rule, generalized: projection boundaries are real
    boundaries).

17. **Repo-native.** In any target codebase, convention authority resides in
    that codebase's demonstrated architecture — captured in its RepoProfile —
    never in the model's training-set fashion. "Latest best practice" is not a
    reason to rewrite an established repository.

18. **Common legos, local secret sauce.** DotLn standardizes the primitives,
    compiler contracts, safety boundaries, evidence, replay, and inspection
    needed to build an agentic organization; it does not standardize the
    organization itself. Individuals, teams, organizations, and fields own their
    workstreams, integrations, sources, controls, identities, roles,
    personalities, combinations, evaluators, and learned doctrine as versioned
    instance content. Bundled patterns are optional examples, never privileged
    kernel behavior.

A closing note on altitude: the numbered principles are invariants. Specific
formulas in the domain model (the AttentionPolicy candidate, log-odds stacking,
per-action utility curves) are **candidate defaults** — the learning loop must
be able to replace them with what empirically beats them.
