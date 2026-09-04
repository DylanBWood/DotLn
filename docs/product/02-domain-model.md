# Domain model

The canonical target vocabulary. Every view, doc, and code identifier uses these
terms exactly when that concept is implemented. `@dotln/kernel` 0.1.0
established the event/decision core at the `v0.1.0` application milestone and
first entered a tagged source release at `v0.2.0`. Component version 0.2.0,
staged for application `v0.3.5`, extends that implemented subset with the strict
store, authority, trace, and evaluable-kind boundaries recorded below; its
public definitions live in `packages/kernel/src/types.ts`. Later rows remain
specified targets until their named roadmap rung promotes them into code.

## Events and decisions (the kernel loop)

| Term               | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event**          | An immutable observation that occurred. The only way anything enters the system.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **EventEnvelope**  | Identity wrapper: `schemaVersion, eventId, type, occurredAt, actorId, workstreamId, episodeId, correlationId, causationId, payload`. Enables idempotency, correlation, replay.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Reactor**        | A pure function `(state, event, env) → Decision`. No hidden clock, RNG, I/O, or model call. **`env` is a pure projection of the log**: clock ticks, presence changes (`OperatorPresenceChanged` away/returned), and resource-pressure changes enter the system as events; post-draw RNG state is carried in kernel state; replay never consults anything outside the log. Reactor purity is an author obligation the kernel does not enforce at runtime: the kernel's own functions consult no ambient source (pinned by poisoning tests), but a reactor that reaches for `Date.now()` silently breaks replay identity. `replay` projects `env` from state by reserved key: the RNG seed must live at the state field `rngState` (any other name replays as `0`), and a state field named `policy` is promoted into `env.policy`.                        |
| **Decision**       | `{ state', intents[], continuation?, schedules[], trace }`. `decideProgram` populates `continuation` with the residual Program after each step; other deciders may omit it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **DecisionTrace**  | Normative minimum: reactor id + version, matched rule/branch path, env inputs consumed, cadence evaluations performed. The trace explains _why_ — reproducible even though model output isn't.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Schedule**       | A cadence bound to an emission: `{ scheduleId (stable), cadence, eventToEmit, cancelOn }`. `eventToEmit` is an event draft without `eventId`; the store boundary assigns that identity.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Intent**         | A proposed side effect, not yet authorized. `Act \| Wait \| Observe \| NoOp` — where NoOp carries reason, evidence, reevaluation cadence, and the condition that would make action useful.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Command**        | An authorized effect sent to an adapter, carrying a stable `commandId` (outbox protocol; duplicate delivery is ignored deterministically). ID discipline: `commandId = hash(namespace-tagged nonempty episodeId or workstreamId, decisionIndex, intentIndex)` — kernel-computed, deterministic; `eventId` is edge-assigned at the store boundary (monotonic per log), never kernel-computed. The outbox protocol's pinned event types are `CommandPersisted` (an authorized command reached the log), `CommandResult` (an adapter's result, matched on `payload.commandId`), and `CommandRefused` (the authorization guard's structural refusal). Replay retains a result that precedes its persist, completes the command when the persist arrives, and traces `result / preceded-persist`; it never presents the already-completed command as pending. |
| **CommandReceipt** | The transport's acknowledgment of an accepted dispatch: `{ commandId, transport, acceptedAt }` — an event like everything else.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Continuation**   | A serializable description of what remains after a result arrives — the residual Program after each step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Cadence**        | Temporal-algebra AST: `Once \| After \| Every \| Burst \| Calendar \| Window \| While \| Until \| Gate \| Sequence \| Merge \| Race \| Repeat \| Backoff`. Cadences are _derived from state_ (`cadenceFor(state, ctx)`), never orphan cron jobs. Marble/Morse notation is a projection and test language, not the stored syntax.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

The workflow grammar (continuation-shaped):

```
Program ::= Done | Emit | Invoke | Await | Sequence | Choose
          | All | Race | Guard | Repeat | Compensate
```

Normative payload minimums: `Emit(eventDraft, next)` ·
`Invoke(commandId, command, continuationByResult)` ·
`Await(eventPattern matching on correlationId or commandId plus type, timeout: Cadence, next)`
· `Choose(policyRef, alternatives)` · `Guard(conditionRef, whenTrue, whenFalse)`
· `Repeat(program, stopConditionRef)` ·
`Compensate(program, compensation — scope: the paired program only)`.

**Conditions are data, never closures** (continuations must serialize): a
condition is a stable-id reference into a versioned registry of pure predicates,
parameterized by opaque JSON interpreted by that registered predicate. A general
expression AST is deferred until a consumer requires one. Pinned predicate
reference:
`{ registryId: string, version: number, params?: Record<string, JsonValue> }`. A
`PredicateRegistry` maps `registryId`, then numeric version, to a pure
`(context, params) → boolean` implementation. Serialized Programs contain only
the reference and JSON parameters, never the implementation. `EventPattern` is
`{ type, correlationId?, commandId? }`; `commandId` matching reads the
`commandId` field in a result event's payload.

Pinned Program payloads use a discriminant `kind` and are exactly: `Done {}`;
`Emit { event, next }`;
`Invoke { commandId, command, continuationByResult: Record<string, Program> }`;
`Await { pattern, timeout, next }`; `Sequence/All/Race { programs }`;
`Choose { policyRef, alternatives }`;
`Guard { conditionRef, whenTrue, whenFalse }`;
`Repeat { program, stopConditionRef }`; and
`Compensate { program, compensation }`. The compensation applies only to its
paired `program`.

Pinned EventEnvelope schema version 1 is
`{ schemaVersion: 1, eventId, type, occurredAt, actorId, workstreamId, episodeId?, correlationId?, causationId?, payload }`;
timestamps are numeric virtual/log time and payload is JSON data. The append
boundary assigns monotonic-per-log `eventId` values `evt_<n>`. The kernel
computes `commandId` as `cmd_` plus the 16-hex-digit FNV-1a-64 hash of
`"ep:<episodeId>:<decisionIndex>:<intentIndex>"` when a non-empty `episodeId` is
present, else `"ws:<workstreamId>:<decisionIndex>:<intentIndex>"`. The
`ep:`/`ws:` namespace discriminator is load-bearing: without it, an `episodeId`
equal to any `workstreamId` collides with that workstream's episode-less
commands, and the outbox's idempotence guard then silently swallows one of the
two distinct commands. These exact inputs, UTF-8 byte encoding, prefix, and hash
algorithm are part of the v0.1 ID scheme. Empty `episodeId` falls back to
`workstreamId`.

Name collisions between the Cadence and Program grammars (`Sequence`, `Race`,
`Repeat`) are sanctioned: in code they live under `Cadence.*` and `Program.*`
namespaces; the bare term stays canonical in prose.

## Actors and episodes (the edge)

| Term                   | Meaning                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actor**              | Anything that can receive commands and emit events: a model session, a human, a script, a browser worker, a test runner. Interchangeable per Principle 1.                                                                                                                                                                                                                                        |
| **Episode**            | One bounded incarnation of an actor: receives one WorkOrder, operates in one repo/worktree, emits a typed result + evidence refs, terminates. Continue-vs-replace is policy: replace on role change, repeated failed approaches, twice-corrected misunderstanding, context full of irrelevant logs, or when canonical state outdates the conversation.                                           |
| **WorkOrder**          | Compiled context capsule: objective, acceptance criteria, known facts, decisions, constraints, non-goals, repo + base commit, allowed/prohibited operations, required evidence, output contract. Compiled from authoritative state — never handcrafted.                                                                                                                                          |
| **ProductSuggestion**  | Non-authoritative request for a possible product or maintenance change, submitted by a human or agent with observed problem/opportunity, scope, evidence refs, affected users/systems, expected value, uncertainty, risks, alternatives, duplication hints, and urgency rationale. It may be clustered, rejected, deferred, or promoted, but cannot authorize work or masquerade as a WorkOrder. |
| **WorkOrderTransport** | The dispatch port: `dispatch(order) → CommandReceipt`. Adapters: cli-print, cli-exec, background-session, subagent, workflow, sdk, browser-driven, human, fake — `cli-print` and `cli-exec` are the same one-shot bounded CLI mechanism as surfaced by Claude Code and Codex CLI respectively. Chosen empirically per environment (Principle 15).                                                |
| **Result envelope**    | The deliberately tiny structured return (`workOrderId, episodeId, status, resultId, summary, requiresHuman`) — "task" in prose always means a bounded unit of work realized as a WorkOrder; everything else stays in the store, referenced by id. The main thread receives only envelopes.                                                                                                       |

Candidate plurality adds three related records without changing the meaning of
Episode or Result envelope:

| Candidate term         | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SubjectSnapshot**    | The immutable comparison-input key for a cohort: mode, WorkOrder id plus exact content hash/revision, base commit/tree, criteria, input evidence bundle, loadout, and relevant environment contract. A verification or critique snapshot also pins the exact candidate diff/artifact it evaluates. An implementation-variant snapshot instead pins the shared request and base; each opinion result names its distinct produced artifact. “Again” means a new episode over this same input key; canonical time and the event log still advance. A different key starts a different cohort. |
| **OpinionCohort**      | A finite set of result envelopes over one SubjectSnapshot, correlated by a cohort id and governed by mode (`replicate`, `panel`, `critique`, `implementation-variant`, or `verification`), visibility/blinding, minimum completion, maximum total and concurrency, aggregate resource ceiling, deadline, cancellation, and stop policy. Each opinion retains a unique command, episode, result, actor attestation, and disposition; a mutating result also retains its produced artifact ref and hash.                                                                                     |
| **AdjudicationPacket** | A sealed, lossless projection over a cohort: admitted and excluded result refs with reasons, exact/structural duplicate clusters, agreement and conflict relations, hard-gate outcomes, unresolved dissent, optional synthesis, and the separately authorized adjudicator's route. It never replaces raw results, treats volume as authority, or permits a late result to mutate the sealed input set. Selecting or combining implementation artifacts materializes a new verification SubjectSnapshot and carries no inherited verification evidence.                                     |

The resume control log pins an actor attestation on each completion event as
`{ harness, harnessVersion, model, effort, raw?, source }`. `effort` is one of
`low | medium | high | xhigh | max | unknown`; `raw` preserves an unrecognized
label when present; and `source` is `self-reported | harness-readback |
operator-attested`. This record is control-plane evidence and does not enlarge
the Result envelope. A self-report proves only that the control log received a
claim attributed to that actor, not independent authorship or the unobserved
effective setting; the source label prevents that claim from being laundered
into readback. It is a candidate payload component for runtime episode events
when WO-009 implements them, not a claim that those events exist today.
Recognized effort values require value-specific selector or
effective-readback evidence for the same harness version; a harness without it
must attest `unknown`. Actor values are single-line. `not-applicable` denotes a structurally absent harness/model field,
while `unknown` denotes an existing value that is unavailable. The conventional
unassisted-human record is `{ harness: "human", harnessVersion:
"not-applicable", model: "human", effort: "unknown", source:
"operator-attested" }`.
New activation events also carry `effortDeclarationValidated: true`. Its absence
marks pre-migration history rather than false, and does not weaken WO-019's own
strict declaration boundary.

## Identity and composition

| Term                              | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**                      | Versioned bundle of stable dispositions, invariants, update laws, lineage. Updates are proposed as new versions and evaluated — no silent drift.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Role**                          | Temporary obligations, permissions, objectives, policy deltas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **LoadoutGraph**                  | The compiled configuration for one episode — a **graph, not a list**: containers, active mechanics, support facets, links, ambient effects (auras, with visible reservation cost), resource model.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Active mechanic** ("skill gem") | An atomic executable capability, workflow, or reactor, carrying tags (`observe, research, plan, mutate, communicate, verify, schedule, delegate, narrate, destructive`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Support facet** ("support gem") | A typed pure modifier of linked mechanics. Declares: supportedTags, semantics added/modified, authority changes, evidence requirements, resource multiplier, conflicts, and whether determinism is preserved. Incompatible links fail at compile time. Only a subset compile to prompt text; most compile to guards, schemas, permissions, verifier episodes — at zero episode-context cost, and each declares its true cost.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Link / link group**             | A link declares scope — _this support participates in this behavior's semantics_ — never execution order (Principle 13). A link group is one compiled behavioral program. Six links is the default composition budget; a nine-link is a smell prompting decomposition.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Phenotype**                     | The computed present behavior of an agent — prompt fragments, thresholds, permissions, cadence, budgets, stopping rules — derived per episode from stored ingredients. A session is one incarnation of a phenotype.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **PolarAxis**                     | A behavioral pair (research/execute, create/remove, challenge/support, continue/stop) tagged with relation type — inverse, complement, counterweight, compensation — plus baseline and factors. `deriveBehavior(...)` computes the active tension. Candidate default for soft-influence stacking (the project's namesake): each influence contributes an odds multiplier, `O_eff = O_base × ∏ rᵢ`; taking ln makes composition additive — identity + role + supports + environment + learning sum to current disposition. Hard-precedence layers never stack this way.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **AuthorityEnvelope**             | Structural autonomy bound: allowed/denied effect patterns, effect-consumption limits, required evidence, exclusive `expiresAt`, revocation event types, and optional revocation `PredicateRef`s. These `resourceLimits` cap authorized effect consumption; they are not a WorkOrder's time, token, task, or work-volume budget. Effect patterns are exact strings or prefix globs ending in `*`; `now >= expiresAt` is expired. The guard evaluates named rules in a pinned first-failing order: invalid effect, expiry, unevaluable revocation, revocation, denial, absence from the allow list, missing evidence, then resource exhaustion. Every revocation condition is evaluated against every supplied revocation event through the shared predicate registry, using caller-supplied state and clockless environment plus the authorization context's `now` as the sole clock. Missing inputs, unknown references, or predicate errors fail closed as `cannot evaluate revocation`. A successful authorization returns its `DecisionTrace`, consumes one unit of its named resource, and returns the updated envelope; callers record the trace and persist/thread the envelope. Resource names must be own properties of `resourceLimits`. This is the personal implementation's current strict authority regime and a reusable platform mechanism, not the only authority regime an implementation may select. |
| **PresencePolicy** (candidate)    | Versioned instance doctrine mapping recorded presence, clock, threshold, outcome, return, and reset events into independent changes to attention priority, work-scope budget, and effect authority; external capability is observed, never produced. A transition declares its source grant, event predicate, stage, active window, ceiling, stop/reset, and replenishment/loop behavior. A policy may hold, shrink, grow, peak, step, stop, reset, or loop any supported output; absent a declared transition, that output holds. Selecting a broader `AuthorityEnvelope` is actual authority growth, while enlarging task/time/token/work volume alone is not. Exact schema and compiler support are deferred under ADR-0007.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **ObjectiveContract**             | Typed, lexicographic definition of "optimal": desiredOutcome, hardConstraints, ordered priorities, stopConditions, escalationConditions, acceptableUncertainty. The current personal baseline orders safety > correctness > intent-fidelity > evidence > recoverability > operator-burden > throughput > cost; the platform contract carries an implementation's declared order rather than imposing this one.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Budget tranches**               | The author's personal-profile default uses progressive budget stages per task: Probe (cheap existence/scope check) → Sow (research fan-out) → Commit (implementation grant) → Verify (a protected independent-verification reserve) → Recover (small retry/repair reserve). Distribution is deliberately uneven by task type. Another profile may declare a different tranche grammar or no independent-verification reserve.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **AttentionPolicy**               | A pluggable policy slot deciding which mechanisms activate. **v1 baseline (the operator's own, measurable):** load the top ~50% of mechanisms by observed invocation frequency; factorize when the set outgrows the budget. Candidate default to beat empirically: priority = scope match × trigger confidence × consequence severity × evidence relevance × historical prevention value − context/tool cost. One hard rule in that personal baseline is that a rare catastrophic invariant outranks a frequent preference; frequency alone is never activation authority there. This is not the operator-interruption or human-attention policy; that boundary remains `InterruptionPolicy` plus the interface's decision-packet contract. A later typed “attention interface” needs a distinct name and may not infer mood or flow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **IR artifact**                   | Immutable, version-addressed configuration or behavioral definition carrying artifact kind, schema identity, provenance, and semantic hash. Application/runtime, schema, artifact, component, compiler/transformation-set, and environment-profile versions are separate axes; see 10-ir-compatibility.md.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Compatibility plan**            | Inspectable path from a source artifact and component set to a target runtime/environment. Each step names its transformation and whether execution is native, exact, adapted, lossy, emulated, inert, blocked, or unverified. The same definitions support JIT compatibility and AOT migration; neither silently overwrites the source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### LoadoutGraph v1 payload contract

WO-008 pins the first serializable graph shape. Names ending in `Id` are stable
references within one graph; component definitions carry their own numeric
`version`. The `V1` suffix on the type names in this section is an editorial
marker for the `schemaVersion: 1` payload, not a delivered identifier:
`@dotln/compiler` exports the same shapes unsuffixed (`LoadoutGraph`,
`Container`, `Link`, `LinkGroup`, `ExplicitPipeline`, `SupportFacet`,
`SupportEmission`, `CompiledProgram`), and every field named here matches that
export. The complete payload is:

```ts
type LoadoutGraphV1 = {
  schemaVersion: 1;
  loadoutId: string;
  identity: IdentityV1;
  role: RoleV1;
  containers: readonly ContainerV1[];
  activeMechanics: readonly ActiveMechanicV1[];
  supportFacets: readonly SupportFacetV1[];
  links: readonly LinkV1[];
  linkGroups: readonly LinkGroupV1[];
  explicitPipelines: readonly ExplicitPipelineV1[];
  ambientEffects: readonly AmbientEffectV1[];
  resourceModel: ResourceModelV1;
  polarAxes: readonly PolarAxisV1[];
};

type ContainerV1 = {
  containerId: string;
  version: number;
  name: string;
  kind: "equipment" | "workspace" | "actor" | "custom";
  socketBudget: number;
  activeMechanicIds: readonly string[];
  supportFacetIds: readonly string[];
};

type LinkV1 = {
  linkId: string;
  linkGroupId: string;
  activeMechanicId: string;
  supportFacetId: string;
};

type LinkGroupV1 = {
  linkGroupId: string;
  containerId: string;
  linkIds: readonly string[];
};

type ExplicitPipelineV1 = {
  pipelineId: string;
  linkGroupId: string;
  orderedSupportFacetIds: readonly string[];
};
```

Links select scope and remain unordered. When a link group declares an explicit
pipeline, its `orderedSupportFacetIds` govern order-sensitive
`semanticsModified` transforms; a repeated id applies that transform again.
Linked commutative supports omitted from the pipeline apply afterward in
canonical support-id order. A non-commuting pair without a pipeline that names
both supports is rejected. Compiler v1 permits at most one explicit pipeline in
the participating link group, so pipeline identifiers never become an implicit
second ordering channel.

`IdentityV1` carries `identityId`, `version`, `name`, `dispositions`,
`invariants`, `updateLaws`, and `lineage`. `RoleV1` carries `roleId`, `version`,
`name`, `obligations`, `permissions`, `objectives`, and ordered `{ key, value }`
policy deltas. An `ActiveMechanicV1` carries `activeMechanicId`, `version`,
`name`, behavior `tags`, `requiredCapabilities`, base `semantics`, a complete
WorkOrder seed (all WorkOrder fields except environment-supplied `repo` and
`baseCommit`), an `AuthorityEnvelope`, and the six item-tooltip collections
under its canonical term, translation, kanji, and secondary RPG title.

The support payload is exact at this boundary:

```ts
type SupportFacetV1 = {
  supportFacetId: string;
  version: number;
  name: string;
  supportedTags: readonly BehaviorTag[];
  requiredCapabilities: readonly string[];
  semanticsAdded: readonly string[];
  semanticsModified: readonly { from: string; to: string }[];
  authorityChanges: readonly string[];
  evidenceRequirements: readonly string[];
  resourceMultiplier: number;
  conflictsWith: readonly string[];
  preservesDeterminism: boolean;
  commutativity: "commutative" | "requires-pipeline";
  emissions: readonly SupportEmissionV1[];
  claims: readonly {
    claimId: string;
    target: string;
    value: JsonValue;
    layer: PrecedenceLayer;
    hard: boolean;
  }[];
  cost: {
    mechanismType: SupportEmissionV1["kind"];
    promptTokens: number;
    runtimeCost: { quantity: number; unit: string };
    extraEpisodes: number;
  };
  inspection: Partial<{
    grants: readonly string[];
    restrictions: readonly string[];
    obligations: readonly string[];
    passive: readonly string[];
    pulse: readonly string[];
    interrupt: readonly string[];
  }>;
};
```

`SupportEmissionV1` is a closed discriminated union for this compiler version:
`work-order`, `permission-guard`, `evidence-schema`, `cadence`,
`statechart-gate`, `verifier-episode`, `hook`, or `prompt-fragment`. Each
emission carries an `emissionId` and its mechanism-specific data. Claims use the
declared nine-level `PrecedenceLayer` from the composition architecture; they
do not smuggle execution order into a link. The winner for each target is
emitted in `CompiledProgramV1.effectiveClaims`. A target beginning
`authority.` names the remaining effect id and accepts only `allow` or `deny`;
the winner rewrites the emitted AuthorityEnvelope and corresponding WorkOrder
operation lists so trace and runtime authorization cannot disagree. This
bounded compiler also accepts direct terminal prefix globs only when no linked
`authority.*` claim participates. Participating wildcard claim targets and
mixed wildcard/participating-authority-claim graphs reject until precedence can
preserve safe exceptions through broader patterns; unequipped catalog
definitions remain inert.

The remaining graph nodes are also explicit data. `AmbientEffectV1` carries an
id/version/name, scope, reservation-cost record, and emissions.
`ResourceModelV1` carries id/version, named capacities, and reservations shaped
as `{ reservationId, resource, quantity, sourceId }`. `PolarAxisV1` carries its
id/version, two poles, relation, baseline odds, and `{ sourceId,
oddsMultiplier }` factors. The v1 compiler preserves PolarAxis data in the
phenotype but does not evaluate it because the Seiri program does not consume
an axis.

Definitions in `supportFacets` form the available catalog; a support is equipped
only through a `LinkV1`. Link and link-group arrays are unordered scope data.
Only `ExplicitPipelineV1.orderedSupportFacetIds` carries transform order, and it
is required when linked transforms do not commute. Compiler v1 lowers exactly
one active mechanic, at most one participating link group, and at most one
explicit pipeline in that group; the broader graph types do not claim
multi-active, multi-group, multi-pipeline, or ambient-effect execution before a
consuming rung proves it.

## Feedback

| Term                           | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FeedbackUnit**               | One normalized correction: source reference and declared source treatment, undesired/desired observable behavior, scope, trigger, mechanism, enforcement (`hard/soft/advisory`), required evidence, regression fixtures, conflicts, supersedes, retirement condition. The author's personal profile retains the scrubbed originating incident verbatim with provenance; an implementation that omits retained lineage declares that capability unavailable.                                                                                                                                 |
| **Mechanism hierarchy**        | Compile to the cheapest sufficient rung: (1) test/lint/type rule/script → (2) permission or pre-effect guard → (3) pure reactor → (4) deterministic transformer → (5) evaluator/independent verifier → (6) workflow/statechart gate → (7) on-demand skill/reference → (8) task-local prompt fragment → (9) globally loaded prose (last resort).                                                                                                                                                                                                                                             |
| **Evaluation**                 | Evidence measuring an episode/artifact against explicit criteria. Carries exemplarRefs, dissentRefs, evidenceRefs, provenance. The kernel selects _which_ evaluators apply; it never computes universal Quality itself. Disagreement is data, never averaged away into a scalar.                                                                                                                                                                                                                                                                                                            |
| **Gem maturity**               | Empirical stats per compiled unit: eligible episodes, activations, incidents prevented, false activations, overrides, current mechanism, next-maturity condition. "Awakened" = generalized, cross-repo, tested, low false-positive, deterministically enforced. When retained history/replay is equipped, a retired immutable version ("corrupted gem") is kept for exact replay and must be forked, not edited; a profile without that capability declares the history unavailable.                                                                                                        |
| **AcceptanceEvidenceMatrix**   | The living operational spec of a workstream: rows of acceptance criterion × source evidence × code surface × automated test × live evidence × status. It evolves through the whole workstream (never a table pasted into the deliverable at the end); a criterion without sufficient evidence is incomplete; the blinded verifier completes it.                                                                                                                                                                                                                                             |
| **VerificationFinding**        | Typed verification failure: criterion, severity (blocking/major/minor), observed vs expected, reproduction steps, evidence refs, likely surface. Drives a focused repair WorkOrder in a fresh episode; substantive repair marks affected evidence stale.                                                                                                                                                                                                                                                                                                                                    |
| **InterruptionPolicy**         | When the operator may be interrupted — see the six materiality conditions in `04-interfaces.md` §Terminal first.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Comparison**                 | The Eye Dr Test event payload: `{ itemA, itemB, dimension?, judge, result: itemA \| itemB \| draw, context, orderRandomized }`. Comparisons are source of truth; ratings (Elo/Glicko/Bradley-Terry) are pure-fold projections over the comparison stream — replaceable without losing anything. Judges themselves accrue agreement-with-operator ratings; "draw" is a result (the just-noticeable-difference floor), not a failure. Applies only below hard constraints in the composition precedence: a guard-violating candidate gets rejected, not ranked.                               |
| **Semantic correction events** | Typed operator signals (`OperatorCorrectionReceived, OperatorReportsRegression, OperatorRejectsUnsupportedAssumption, OperatorReportsRepeatedFailure`) — surface language (including profanity) is at most a weak classifier feature. In the author's personal profile, the correction reactor is **fail-conservative**: a false positive only tightens behavior (freeze destructive authority, preserve evidence, prohibit scope expansion, dispatch diagnosis, no apology theater). Another profile must declare its selected correction policy rather than inheriting this one silently. |

## Memory and observation

| Term                    | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event store**         | Append-only source of truth. The JSONL codec accepts only the empty string or one or more JSON-object lines, each newline-terminated; decode and append refuse every other shape with the offending physical line number, and append assigns `evt_<well-formed line count + 1>`. Persistence progression: JSONL → SQLite (when transactionality/outbox matter). Markdown is a _generated projection_, never shared mutable truth.                                                                                     |
| **Evidence graph**      | Artifacts, provenance, evaluations, lineage — relations are the durable truth, not raw outputs alone.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Workstream**          | A durable objective spanning tasks, sessions, repos, and time. The author's maturity projection is Unformed Rumor → Exploration Contract → Defined → SMART-Validated → Execution-Ready → Verified Complete. Profiles without verification may instead expose an explicit owner-accepted, self-reported, unverified, or other declared terminal disposition. A vague objective is never rejected: it is marked an exploration contract until enough facts exist to define measurable completion gates (see 05 §SMART). |
| **Watcher**             | A read-only perspective: `narrative = project(EventLog, Perspective)`. Multiple watchers (architecture, quality, security, operator-intent) produce different narratives from the same events; none becomes canonical truth.                                                                                                                                                                                                                                                                                          |
| **Lineage**             | Connected history of identity versions, episodes, outcomes, adaptations. "You are the sum of a connected lineage of agent variations and actions."                                                                                                                                                                                                                                                                                                                                                                    |
| **Verification radius** | Pure function of (anomaly, dependency graph, confidence profile) → recheck scope: local / neighborhood / subsystem / full.                                                                                                                                                                                                                                                                                                                                                                                            |

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
