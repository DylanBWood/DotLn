# Domain model

The canonical vocabulary. Every view, doc, and code identifier uses these terms
exactly. The v0.1 kernel pins the structures below; its public definitions live
in `packages/kernel/src/types.ts`.

## Events and decisions (the kernel loop)

| Term | Meaning |
|---|---|
| **Event** | An immutable observation that occurred. The only way anything enters the system. |
| **EventEnvelope** | Identity wrapper: `schemaVersion, eventId, type, occurredAt, actorId, workstreamId, episodeId, correlationId, causationId, payload`. Enables idempotency, correlation, replay. |
| **Reactor** | A pure function `(state, event, env) → Decision`. No hidden clock, RNG, I/O, or model call. **`env` is a pure projection of the log**: clock ticks, presence changes (`OperatorPresenceChanged` away/returned), and resource-pressure changes enter the system as events; post-draw RNG state is carried in kernel state; replay never consults anything outside the log. Reactor purity is an author obligation the kernel does not enforce at runtime: the kernel's own functions consult no ambient source (pinned by poisoning tests), but a reactor that reaches for `Date.now()` silently breaks replay identity. `replay` projects `env` from state by reserved key: the RNG seed must live at the state field `rngState` (any other name replays as `0`), and a state field named `policy` is promoted into `env.policy`. |
| **Decision** | `{ state', intents[], continuation?, schedules[], trace }`. `decideProgram` populates `continuation` with the residual Program after each step; other deciders may omit it. |
| **DecisionTrace** | Normative minimum: reactor id + version, matched rule/branch path, env inputs consumed, cadence evaluations performed. The trace explains *why* — reproducible even though model output isn't. |
| **Schedule** | A cadence bound to an emission: `{ scheduleId (stable), cadence, eventToEmit, cancelOn }`. `eventToEmit` is an event draft without `eventId`; the store boundary assigns that identity. |
| **Intent** | A proposed side effect, not yet authorized. `Act | Wait | Observe | NoOp` — where NoOp carries reason, evidence, reevaluation cadence, and the condition that would make action useful. |
| **Command** | An authorized effect sent to an adapter, carrying a stable `commandId` (outbox protocol; duplicate delivery is ignored deterministically). ID discipline: `commandId = hash(namespace-tagged nonempty episodeId or workstreamId, decisionIndex, intentIndex)` — kernel-computed, deterministic; `eventId` is edge-assigned at the store boundary (monotonic per log), never kernel-computed. The outbox protocol's pinned event types are `CommandPersisted` (an authorized command reached the log), `CommandResult` (an adapter's result, matched on `payload.commandId`), and `CommandRefused` (the authorization guard's structural refusal). |
| **CommandReceipt** | The transport's acknowledgment of an accepted dispatch: `{ commandId, transport, acceptedAt }` — an event like everything else. |
| **Continuation** | A serializable description of what remains after a result arrives — the residual Program after each step. |
| **Cadence** | Temporal-algebra AST: `Once | After | Every | Burst | Calendar | Window | While | Until | Gate | Sequence | Merge | Race | Repeat | Backoff`. Cadences are *derived from state* (`cadenceFor(state, ctx)`), never orphan cron jobs. Marble/Morse notation is a projection and test language, not the stored syntax. |

The workflow grammar (continuation-shaped):

```
Program ::= Done | Emit | Invoke | Await | Sequence | Choose
          | All | Race | Guard | Repeat | Compensate
```

Normative payload minimums: `Emit(eventDraft, next)` · `Invoke(commandId, command,
continuationByResult)` · `Await(eventPattern matching on correlationId/
commandId + type, timeout: Cadence, next)` · `Choose(policyRef, alternatives)`
· `Guard(conditionRef, whenTrue, whenFalse)` · `Repeat(program, stopConditionRef)`
· `Compensate(program, compensation — scope: the paired program only)`.

**Conditions are data, never closures** (continuations must serialize): a
condition is a stable-id reference into a versioned registry of pure predicates,
parameterized by opaque JSON interpreted by that registered predicate. A
general expression AST is deferred until a consumer requires one.
Pinned predicate reference: `{ registryId: string, version: number, params?:
Record<string, JsonValue> }`. A `PredicateRegistry` maps `registryId`, then
numeric version, to a pure `(context, params) → boolean` implementation.
Serialized Programs contain only the reference and JSON parameters, never the
implementation. `EventPattern` is `{ type, correlationId?, commandId? }`;
`commandId` matching reads the `commandId` field in a result event's payload.

Pinned Program payloads use a discriminant `kind` and are exactly:
`Done {}`; `Emit { event, next }`; `Invoke { commandId, command,
continuationByResult: Record<string, Program> }`; `Await { pattern, timeout,
next }`; `Sequence/All/Race { programs }`; `Choose { policyRef,
alternatives }`; `Guard { conditionRef, whenTrue, whenFalse }`; `Repeat {
program, stopConditionRef }`; and `Compensate { program, compensation }`.
The compensation applies only to its paired `program`.

Pinned EventEnvelope schema version 1 is `{ schemaVersion: 1, eventId, type,
occurredAt, actorId, workstreamId, episodeId?, correlationId?, causationId?,
payload }`; timestamps are numeric virtual/log time and payload is JSON data.
The append boundary assigns monotonic-per-log `eventId` values `evt_<n>`.
The kernel computes `commandId` as `cmd_` plus the 16-hex-digit FNV-1a-64 hash
of `"ep:<episodeId>:<decisionIndex>:<intentIndex>"` when a non-empty
`episodeId` is present, else `"ws:<workstreamId>:<decisionIndex>:<intentIndex>"`.
The `ep:`/`ws:` namespace discriminator is load-bearing: without it, an
`episodeId` equal to any `workstreamId` collides with that workstream's
episode-less commands, and the outbox's idempotence guard then silently
swallows one of the two distinct commands. These exact inputs, UTF-8 byte
encoding, prefix, and hash algorithm are part of the v0.1 ID scheme. Empty
`episodeId` falls back to `workstreamId`.

Name collisions between the Cadence and Program grammars (`Sequence`, `Race`,
`Repeat`) are sanctioned: in code they live under `Cadence.*` and `Program.*`
namespaces; the bare term stays canonical in prose.

## Actors and episodes (the edge)

| Term | Meaning |
|---|---|
| **Actor** | Anything that can receive commands and emit events: a model session, a human, a script, a browser worker, a test runner. Interchangeable per Principle 1. |
| **Episode** | One bounded incarnation of an actor: receives one WorkOrder, operates in one repo/worktree, emits a typed result + evidence refs, terminates. Continue-vs-replace is policy: replace on role change, repeated failed approaches, twice-corrected misunderstanding, context full of irrelevant logs, or when canonical state outdates the conversation. |
| **WorkOrder** | Compiled context capsule: objective, acceptance criteria, known facts, decisions, constraints, non-goals, repo + base commit, allowed/prohibited operations, required evidence, output contract. Compiled from authoritative state — never handcrafted. |
| **ProductSuggestion** | Non-authoritative request for a possible product or maintenance change, submitted by a human or agent with observed problem/opportunity, scope, evidence refs, affected users/systems, expected value, uncertainty, risks, alternatives, duplication hints, and urgency rationale. It may be clustered, rejected, deferred, or promoted, but cannot authorize work or masquerade as a WorkOrder. |
| **WorkOrderTransport** | The dispatch port: `dispatch(order) → CommandReceipt`. Adapters: cli-print, cli-exec, background-session, subagent, workflow, sdk, browser-driven, human, fake — `cli-print` and `cli-exec` are the same one-shot bounded CLI mechanism as surfaced by Claude Code and Codex CLI respectively. Chosen empirically per environment (Principle 15). |
| **Result envelope** | The deliberately tiny structured return (`workOrderId, episodeId, status, resultId, summary, requiresHuman`) — "task" in prose always means a bounded unit of work realized as a WorkOrder; everything else stays in the store, referenced by id. The main thread receives only envelopes. |

## Identity and composition

| Term | Meaning |
|---|---|
| **Identity** | Versioned bundle of stable dispositions, invariants, update laws, lineage. Updates are proposed as new versions and evaluated — no silent drift. |
| **Role** | Temporary obligations, permissions, objectives, policy deltas. |
| **LoadoutGraph** | The compiled configuration for one episode — a **graph, not a list**: containers, active mechanics, support facets, links, ambient effects (auras, with visible reservation cost), resource model. |
| **Active mechanic** ("skill gem") | An atomic executable capability, workflow, or reactor, carrying tags (`observe, research, plan, mutate, communicate, verify, schedule, delegate, narrate, destructive`). |
| **Support facet** ("support gem") | A typed pure modifier of linked mechanics. Declares: supportedTags, semantics added/modified, authority changes, evidence requirements, resource multiplier, conflicts, and whether determinism is preserved. Incompatible links fail at compile time. Only a subset compile to prompt text; most compile to guards, schemas, permissions, verifier episodes — at zero episode-context cost, and each declares its true cost. |
| **Link / link group** | A link declares scope — *this support participates in this behavior's semantics* — never execution order (Principle 13). A link group is one compiled behavioral program. Six links is the default composition budget; a nine-link is a smell prompting decomposition. |
| **Phenotype** | The computed present behavior of an agent — prompt fragments, thresholds, permissions, cadence, budgets, stopping rules — derived per episode from stored ingredients. A session is one incarnation of a phenotype. |
| **PolarAxis** | A behavioral pair (research/execute, create/remove, challenge/support, continue/stop) tagged with relation type — inverse, complement, counterweight, compensation — plus baseline and factors. `deriveBehavior(...)` computes the active tension. Candidate default for soft-influence stacking (the project's namesake): each influence contributes an odds multiplier, `O_eff = O_base × ∏ rᵢ`; taking ln makes composition additive — identity + role + supports + environment + learning sum to current disposition. Hard-precedence layers never stack this way. |
| **AuthorityEnvelope** | Structural autonomy bound: allowed/denied effect patterns, resource limits, required evidence, expiresAt, revocation events. Effect patterns are exact strings or prefix globs ending in `*`. A successful authorization consumes one unit of its named resource and returns the updated envelope; callers persist/thread that value. Resource names must be own properties of `resourceLimits`. |
| **ObjectiveContract** | Typed, lexicographic definition of "optimal": desiredOutcome, hardConstraints, ordered priorities (safety > correctness > intent-fidelity > evidence > recoverability > operator-burden > throughput > cost), stopConditions, escalationConditions, acceptableUncertainty. |
| **Budget tranches** | Progressive budget stages per task: Probe (cheap existence/scope check) → Sow (research fan-out) → Commit (implementation grant) → Verify (a protected independent-verification reserve) → Recover (small retry/repair reserve). Distribution is deliberately uneven by task type. |
| **AttentionPolicy** | A pluggable policy slot deciding which mechanisms activate. **v1 baseline (the operator's own, measurable):** load the top ~50% of mechanisms by observed invocation frequency; factorize when the set outgrows the budget. Candidate default to beat empirically: priority = scope match × trigger confidence × consequence severity × evidence relevance × historical prevention value − context/tool cost. One hard rule regardless of policy: a rare catastrophic invariant always outranks a frequent preference — frequency alone is never activation authority. |
| **IR artifact** | Immutable, version-addressed configuration or behavioral definition carrying artifact kind, schema identity, provenance, and semantic hash. Application/runtime, schema, artifact, component, compiler/transformation-set, and environment-profile versions are separate axes; see 10-ir-compatibility.md. |
| **Compatibility plan** | Inspectable path from a source artifact and component set to a target runtime/environment. Each step names its transformation and whether execution is native, exact, adapted, lossy, emulated, inert, blocked, or unverified. The same definitions support JIT compatibility and AOT migration; neither silently overwrites the source. |

## Feedback

| Term | Meaning |
|---|---|
| **FeedbackUnit** | One normalized correction: originating incident (verbatim, with provenance), undesired/desired observable behavior, scope, trigger, mechanism, enforcement (`hard/soft/advisory`), required evidence, regression fixtures, conflicts, supersedes, retirement condition. |
| **Mechanism hierarchy** | Compile to the cheapest sufficient rung: (1) test/lint/type rule/script → (2) permission or pre-effect guard → (3) pure reactor → (4) deterministic transformer → (5) evaluator/independent verifier → (6) workflow/statechart gate → (7) on-demand skill/reference → (8) task-local prompt fragment → (9) globally loaded prose (last resort). |
| **Evaluation** | Evidence measuring an episode/artifact against explicit criteria. Carries exemplarRefs, dissentRefs, evidenceRefs, provenance. The kernel selects *which* evaluators apply; it never computes universal Quality itself. Disagreement is data, never averaged away into a scalar. |
| **Gem maturity** | Empirical stats per compiled unit: eligible episodes, activations, incidents prevented, false activations, overrides, current mechanism, next-maturity condition. "Awakened" = generalized, cross-repo, tested, low false-positive, deterministically enforced. A retired/immutable version ("corrupted gem") is kept for exact replay and must be forked, not edited. |
| **AcceptanceEvidenceMatrix** | The living operational spec of a workstream: rows of acceptance criterion × source evidence × code surface × automated test × live evidence × status. It evolves through the whole workstream (never a table pasted into the deliverable at the end); a criterion without sufficient evidence is incomplete; the blinded verifier completes it. |
| **VerificationFinding** | Typed verification failure: criterion, severity (blocking/major/minor), observed vs expected, reproduction steps, evidence refs, likely surface. Drives a focused repair WorkOrder in a fresh episode; substantive repair marks affected evidence stale. |
| **InterruptionPolicy** | When the operator may be interrupted — see the six materiality conditions in `04-interfaces.md` §Terminal first. |
| **Comparison** | The Eye Dr Test event payload: `{ itemA, itemB, dimension?, judge, result: itemA|itemB|draw, context, orderRandomized }`. Comparisons are source of truth; ratings (Elo/Glicko/Bradley-Terry) are pure-fold projections over the comparison stream — replaceable without losing anything. Judges themselves accrue agreement-with-operator ratings; "draw" is a result (the just-noticeable-difference floor), not a failure. Applies only below hard constraints in the composition precedence: a guard-violating candidate gets rejected, not ranked. |
| **Semantic correction events** | Typed operator signals (`OperatorCorrectionReceived, OperatorReportsRegression, OperatorRejectsUnsupportedAssumption, OperatorReportsRepeatedFailure`) — surface language (including profanity) is at most a weak classifier feature. The correction reactor is **fail-conservative**: a false positive only tightens behavior (freeze destructive authority, preserve evidence, prohibit scope expansion, dispatch diagnosis, no apology theater). |

## Memory and observation

| Term | Meaning |
|---|---|
| **Event store** | Append-only source of truth. Persistence progression: JSONL → SQLite (when transactionality/outbox matter). Markdown is a *generated projection*, never shared mutable truth. |
| **Evidence graph** | Artifacts, provenance, evaluations, lineage — relations are the durable truth, not raw outputs alone. |
| **Workstream** | A durable objective spanning tasks, sessions, repos, and time. Objectives carry a quality tier — Unformed Rumor → Exploration Contract → Defined → SMART-Validated → Execution-Ready → Verified Complete. A vague objective is never rejected: it is marked an exploration contract until enough facts exist to define measurable completion gates (see 05 §SMART). |
| **Watcher** | A read-only perspective: `narrative = project(EventLog, Perspective)`. Multiple watchers (architecture, quality, security, operator-intent) produce different narratives from the same events; none becomes canonical truth. |
| **Lineage** | Connected history of identity versions, episodes, outcomes, adaptations. "You are the sum of a connected lineage of agent variations and actions." |
| **Verification radius** | Pure function of (anomaly, dependency graph, confidence profile) → recheck scope: local / neighborhood / subsystem / full. |

## Formal grounding

The kernel loop is Powell's sequential-decision frame: state Sₜ, decision Xₜ,
exogenous information Wₜ₊₁ (events from the nondeterministic edge), transition
Sₜ₊₁ = Sᴹ(Sₜ, Xₜ, Wₜ₊₁), objective. DotLn's mechanisms map onto his four policy
classes (guards/reactors ≈ PFAs, evaluators ≈ CFAs/VFAs, planning episodes ≈
direct lookahead) — adopt this vocabulary when rigor is needed; practitioners'
finding that simple compiled policies beat intractable lookahead is exactly the
compile-the-feedback bet. Isomorphic views are Poincaré conventions: none more
true, each more convenient, all constrained to non-contradiction by compiling
from one normalized IR ("geometry is not true, it is advantageous").
