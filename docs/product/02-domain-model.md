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

| Term                   | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**              | Anything that can receive commands and emit events: a model session, a human, a script, a browser worker, a test runner. Interchangeable per Principle 1.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Episode**            | One bounded incarnation of an actor: receives one WorkOrder, operates in one repo/worktree, emits a typed result + evidence refs, terminates. Continue-vs-replace is policy: replace on role change, repeated failed approaches, twice-corrected misunderstanding, context full of irrelevant logs, or when canonical state outdates the conversation.                                                                                                                                                                                                                                                                                                                                      |
| **WorkOrder**          | Compiled context capsule: objective, acceptance criteria, known facts, decisions, constraints, non-goals, repo + base commit, allowed/prohibited operations, required evidence, output contract. Compiled from authoritative state — never handcrafted.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **ProductSuggestion**  | Non-authoritative request for a possible product or maintenance change, submitted by a human or agent with observed problem/opportunity, scope, evidence refs, affected users/systems, expected value, uncertainty, risks, alternatives, duplication hints, and urgency rationale. It may be clustered, rejected, deferred, or promoted, but cannot authorize work or masquerade as a WorkOrder.                                                                                                                                                                                                                                                                                            |
| **WorkOrderTransport** | The dispatch port. The bounded Node contract is `dispatch(request, now) → { receipt, completed, alive, kill }`: separate promises for a `CommandReceipt` and validated result, with host-only process handles. The request contains the persisted command, compiled WorkOrder and pinned environment, model/effort, physical episode and declared read mount. `ClaudeCliPrintWorkOrderTransport` and `CodexCliExecWorkOrderTransport` implement disposable inspection and WO-010 verification/repair snapshot profiles; the deterministic fake remains first-class. Result types are selected by the request. Broader transports remain planned. See 03 §Ports for canonical launch shapes. |
| **Result envelope**    | The deliberately tiny structured return (`workOrderId, episodeId, status, resultId, summary, requiresHuman`). Inspection status is `completed`, `blocked`, or `failed`; completion is a worker self-report, and `requiresHuman` independently records whether an operator decision is needed. The host retains typed results and evidence in its store and returns only this envelope to the dispatching session.                                                                                                                                                                                                                                                                           |

In prose, a “task” remains a bounded unit realized as a WorkOrder. Planned
background-session, subagent, workflow, SDK, browser-driven and human transport
adapters remain empirically selected per environment (Principle 15).

The WO-009 runtime records each physical incarnation as `WorkerAttemptStarted`,
followed by acceptance, host-observed heartbeats, and completion, interruption,
lease expiry, or quarantine. The WorkOrder, continuation and stable command
survive a physical episode. A 1,000 ms heartbeat renews a 5,000 ms lease only
while it is still valid; each invocation has a 180,000 ms deadline. Stored
timestamps and explicit expiry events drive the read-only `dotln status`
projection. A lifecycle Beacon or a worker claim is not heartbeat evidence.

`WorkerResultObserved` records a completed result before the shared reactor
checks its pinned compilation, authority, presence and worker lease. Only an
admitted observation becomes `CommandResult` and closes the outbox entry.
Quarantined observations and incomplete envelopes preserve the pending command;
partial typed evidence remains available without becoming accepted candidates.
Recovery may query an immutable completed-result receipt in a fresh episode,
retaining the original producing episode id. The profile permits only a
host-read synthetic inventory and no model tools or repository writes.

Candidate plurality adds three related records without changing the meaning of
Episode or Result envelope:

| Candidate term         | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SubjectSnapshot**    | The immutable comparison-input key for a cohort: mode, WorkOrder id plus exact content hash/revision, base commit/tree, criteria, input evidence bundle, loadout, and relevant environment contract. A verification or critique snapshot also pins the exact candidate diff/artifact it evaluates. An implementation-variant snapshot instead pins the shared request and base; each opinion result names its distinct produced artifact. “Again” means a new episode over this same input key; canonical time and the event log still advance. A different key starts a different cohort. |
| **OpinionCohort**      | A finite set of result envelopes over one SubjectSnapshot, correlated by a cohort id and governed by mode (`replicate`, `panel`, `critique`, `implementation-variant`, or `verification`), visibility/blinding, minimum completion, maximum total and concurrency, aggregate resource ceiling, deadline, cancellation, and stop policy. Each opinion retains a unique command, episode, result, actor attestation, and disposition; a mutating result also retains its produced artifact ref and hash.                                                                                     |
| **AdjudicationPacket** | A sealed, lossless projection over a cohort: admitted and excluded result refs with reasons, exact/structural duplicate clusters, agreement and conflict relations, hard-gate outcomes, unresolved dissent, optional synthesis, and the separately authorized adjudicator's route. It never replaces raw results, treats volume as authority, or permits a late result to mutate the sealed input set. Selecting or combining implementation artifacts materializes a new verification SubjectSnapshot and carries no inherited verification evidence.                                     |

From WO-030, each order owns one append-only control segment (or its unchanged
legacy-log location), and the shared fold keeps lifecycle legality and evidence
independent while selection chooses which order to inspect.

The resume control log pins an actor attestation on each completion event as
`{ harness, harnessVersion, model, effort, raw?, source, accountLabel? }`. `effort` is one of
`low | medium | high | xhigh | max | unknown`; `raw` preserves an unrecognized
label when present; and `source` is `self-reported | harness-readback |
operator-attested`. This record is control-plane evidence and does not enlarge
the Result envelope. A self-report proves only that the control log received a
claim attributed to that actor, not independent authorship or the unobserved
effective setting; the source label prevents that claim from being laundered
into readback. WO-009's runtime attempt event separately records transport,
harness version, selected model and effort with `selectionSource: host-launch`;
`effectiveModel` and `effectiveEffort` remain `unknown`. Those host launch
claims do not expand the control actor attestation or the Result envelope.
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
WO-031 adds the opt-in opaque `accountLabel`, supplied by `--account-label` or
`DOTLN_ACCOUNT_LABEL`; absence projects `not-applicable`, while its meaning stays
in an ignored operator-maintained file that scripts never read.
From WO-028, optional control-event `recordedAt` records the host's UTC append
time, independently of kernel `occurredAt`; append order alone determines
lifecycle state, and historical absence remains valid under schema version 1.

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

The first perception-slot support facets are below. A sense is a compiled,
authorized and mounted capability; the codebook is a skill/reference and grants
nothing. A Watcher projects already admitted records, while a sense controls
which metadata can enter an episode in the first place.

| Sense support | Required host capability                                          | Evidence and measured context cost                                                                                        |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Beacon Sight  | `beacons.individual.metadata` from an individual mount/path grant | `BeaconObserved`; one context line per sweep, at most twelve addresses; individual v1/v2/v3 fields and whole-second mtime |
| Fine Spectrum | `beacons.individual.metadata`                                     | `BeaconObserved`; one additional context line per sweep; sub-second mtime, only when linked                               |
| Composition   | `beacons.group.metadata` from a group mount/path grant            | `BeaconObserved`; one additional context line per sweep; one phase-group codeword, only when linked                       |

All three supports carry the `observe` tag, occupy the perception container,
declare no authority changes and emit zero prompt fragments. Line costs are
measured rendering costs, not estimated tokens or universal latency claims.
Beacon Sight is required for the sweep active; missing mounts report SUPPORT
INACTIVE with the exact missing capability and a structured correction.
Fine and group channels that are not equipped say `not-sensed`, including when
the underlying file might be absent. An equipped sense can separately observe
an absent expected file.

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

A proposed [resource-pressure environment](03-architecture.md#candidate--resource-pressure-as-an-environmental-modifier)
would feed recorded budget consumption, reservations, and replenishment into
activation policy. A base task cost, a pressure-dependent admission modifier,
and remaining capacity are separate values. The current `ResourceModelV1`
declares capacities and reservations; it does not implement that dynamic policy,
resource metering, or ambient-effect execution.

Definitions in `supportFacets` form the available catalog; a support is equipped
only through a `LinkV1`. Link and link-group arrays are unordered scope data.
Only `ExplicitPipelineV1.orderedSupportFacetIds` carries transform order, and it
is required when linked transforms do not commute. Compiler v1 lowers exactly
one active mechanic, at most one participating link group, and at most one
explicit pipeline in that group; the broader graph types do not claim
multi-active, multi-group, multi-pipeline, or ambient-effect execution before a
consuming rung proves it.

### Artifact identity v1

WO-029 adds the exported `ArtifactIdentityV1` beside `CompiledProgram`, never inside its semantic-hash preimage. Successful compilation returns:

```ts
interface ArtifactIdentityV1 {
  readonly schemaVersion: 1;
  readonly compilerContractVersion: string;
  readonly compilerPackageVersion: string;
  readonly semanticHash: string;
  readonly compilationEnvironment: CompilationEnvironment;
  readonly authorityExpiresAt: number;
  readonly componentDefinitions: readonly ComponentDefinitionIdentityV1[];
}
interface ComponentDefinitionIdentityV1 {
  readonly componentKind:
    "active-mechanic" | "support-facet" | "ambient-effect";
  readonly componentId: string;
  readonly version: number;
  readonly hashScheme: "dotln-component-definition-fnv1a64-v1";
  readonly definitionHash: string;
}
```

The component tuples match the participating manifest exactly. Each digest identifies the matching normalized source definition, including otherwise un-emitted metadata; group and mechanism projections remain manifest fields. The exact public preimage and domain are pinned in [04](04-interfaces.md#editable-view-v1-normalization-and-semantic-hash). `compilationEnvironment` retains `environmentId`, numeric `version`, capability list, `repo`, and `baseCommit`; expiry is also retained explicitly and in the raw graph. These are equality receipts, not unique, cryptographic, or authenticated identities.

The personal host records `LoadoutEquipped` under EventEnvelope schema 1 with `{ payloadVersion: 2, graph, artifactIdentity }`. Only absence of `payloadVersion` identifies legacy-v1 payloads; any other unsupported value refuses. The reactor recomputes before accepting the pin and authority. Later compiled consumers record `artifactIdentity.semanticHash:<hash>`, `artifactIdentity.compilerContractVersion:<version>`, `artifactIdentity.compilerPackageVersion:<version>`, and `artifactIdentity.equippedEventId:<eventId>` in `DecisionTrace.envInputs`. Compilation diagnostics and drift produce typed inert events and a decision receipt.

`ArtifactIdentityEnforcementStarted` has `{ payloadVersion: 1 }` and marks the logged transition to new execution. Before it, historical raw equips replay with identity unavailable. After it, unavailable identity refuses until v2 re-equip; authority is absent before any valid equip. The boundary is idempotent. New factories cannot mint legacy equips, and recovery checks the pin before redispatch. This is the author's selected assurance profile, not a required platform capability for every owner.

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

The personal profile's anti-oscillation unit retains the desired behavior, the
rejected approaches and their reasons, and any explicit supersession. A proposed
correction is checked against that history before it replaces an approach;
examples alone cannot supply new hard constraints. Its decision-lineage guard
is implemented for equipped WO-011 feedback boundaries. Outside that host,
the execution guide still applies the judgment manually.

### Feedback compiler v1

WO-011 adds the separate `feedback-v1` contract in compiler `0.6.0` and skeleton
`0.12.0`. The [personal catalog](../../packages/skeleton/src/loadouts/feedback.ts)
contains exactly the roadmap's ten units. Each carries source references and
treatment, incident synthesis, observable undesired/desired behavior, scope,
trigger, mechanism and rationale, enforcement, required evidence, regression
fixtures, conflicts, supersession, retirement, and next-maturity conditions.
Scrubbed public incident accounts remain at their canonical references; this
does not promote ordinary raw intake verbatim or duplicate its source text.

`compileFeedbackUnits` validates and positively copies those declarations,
rejects unsupported handlers, conflicts and co-equipped superseded versions,
and lowers them to the declared handler/rung. Its `policyHash` covers canonical
compiled data, including retained definitions and the compiler package version.
It is an equality key, not authentication. An empty or reduced profile leaves
unequipped rules inactive; advisory findings do not become hard denials.
The saved personal profile makes all ten hard at their declared boundaries.

`evaluateFeedback` consumes host-derived facts for nine boundaries; the tenth,
`applyFeedbackCorrection`, consumes typed semantic correction events. The
shared `seiriReactor` retains the correction, narrows allowed effects, prevents
scope expansion, preserves evidence, and emits a diagnosis request. Ordinary
message content has no trigger path. A mistakenly classified correction only
tightens policy; it cannot restore effects or erase prior evidence.

The boundary adapter refuses the effect before invoking its callback. Host
facts include independent witnesses, executable check results, resolved Git
roots/writer reservations, source diffs, and reads bound to output hashes.
Semantic assessments such as desired-outcome preservation and low-risk cleanup
still require host/operator judgment. Worker prose cannot supply its own host
facts. Read receipts witness delivery of bytes, not comprehension. The current
suppression check compares host-parsed comment bodies from the exactly pinned
TypeScript parser; regex, template literals, and JSX text are distinguished from
actual directives. The parser is a skeleton dependency, loaded only for that
check; the pure compiler and kernel have none. This is not a
general detector of weakened compiler configuration or every way to game tests.

`feedbackMaturity` folds explicitly labeled fixture/live observations into
eligible episodes, activations, prevented incidents, false activations, and
overrides. Unobserved use has zero observations and no inferred rate. The
selected regression episodes do not establish broad field performance or
awakened maturity. Compiled versions retained in audit events support replay;
replacement creates a new version rather than editing a retained definition.

The bounded self-hosted consumer compiles `WO-011-feedback-audit`, authorizes
and persists its command, executes the fixed regression subprocesses against
this repository, then uses the WO-010 verifier host and a WO-009 transport for
a separate blinded episode. Source bytes and the report are pinned; the base
revision's unexecuted audit is honestly unavailable. The empty verifier mount
contains no ambient repository instructions. This audits actual repository
code with controlled fixtures; it does not implement general source-writing
workers or replace the manual repository verification lifecycle. The
[evidence receipt](../evidence/WO-011/README.md) records the run and limits.

### Independent verification v1

WO-010 pins the first executable verification contract in compiler `0.5.0` and skeleton `0.11.0`. This is a bounded realization of the Feedback terms above, with state and behavior claims. Visual/network evidence and comparison/rating consumers remain deferred.

- `AcceptanceCriterion` is `{ criterionId, description, claimType: "state" | "behavior", evidenceSource: "synthetic-fixture" | "live", codeSurfaces, requiredChecks }`. Surfaces include declared dependencies; each required check must have sufficient evidence before a pass.
- `VerificationEvidence` is `{ evidenceId, criterionId, checkId, claimType, source, subjectRevision, codeSurfaces, automatedTest: string | null, observed, expected, outcome: "pass" | "fail" | "unavailable", reproductionSteps }`. These are host witnesses, separate from model claims. State reads and behavior subprocess runs are distinct. A synthetic witness cannot satisfy a live criterion. An unavailable runner produces an honest unavailable witness and an unverified criterion. The baseline snapshot and its witnesses are preserved separately from candidate evidence and never certify the candidate.
- `Evaluation` is `{ criterionId, claimType, verdict: "pass" | "fail" | "unverified", evidenceRefs, exemplarRefs, dissentRefs }`. The last two arrays are explicitly empty until their consumers arrive. Matrix evaluations additionally carry `eventId`, the original producing `episodeId`, `subjectRevision`, `stale`, and host-derived `provenance: { kind: "host-admitted-verifier", commandId, inputHash }`. Worker prose cannot supply that provenance. Any adverse witness for a required check prevents a pass, even if the verifier omits its reference.
- `VerificationFinding` is `{ findingId, criterionId, severity: "blocking" | "major" | "minor", observed, expected, reproductionSteps, evidenceRefs, likelySurface }`. All prose fields and reference/surface lists are required and nonempty. References must belong to the failed criterion, the observed/expected pair must match an adverse host witness, and likely surfaces remain within that criterion's declared dependencies. Every failed evaluation needs a finding; every blocking finding projects a focused repair WorkOrder. Major/minor findings remain visible and require attention without automatically authorizing repair.

The pure compiler constructs `VerificationTask` with `contractVersion: "verification-v1"`, `compilerPackageVersion`, `inputHash`, role, WorkOrder, criteria, subject and optional finding. The subject is `{ repo, baseCommit, revision, diff, files: [{ path, contents }], evidence }`. Its repository access is an explicit host-read snapshot. Positive construction excludes extra implementer fields at every nested boundary; no original implementation WorkOrder, transcript, narrative or result prose is accepted as context. The equality key covers the complete capsule except itself, including source bytes, witnesses, criteria and compiler package version. It is not authentication. Recompilation drift refuses execution; a changed persisted capsule fails loudly during replay rather than silently substituting current compilation.

`VerificationOpened` starts the living matrix with baseline and candidate snapshots, criteria, implementer episode, a host authority envelope and a bounded repair count. `VerificationDispatchRequested` compiles a task; kernel `Program.Invoke`, `authorize` and the durable `CommandPersisted` outbox carry it to a WO-009 transport. The host stamps physical episodes and leases, validates the closed result schema, saves immutable completed receipts, and records `VerificationWorkerResultObserved`. Only a host-admitted verifier `CommandResult` with `verificationResultVersion: 1`, the matching command, producing episode, live lease and unchanged subject can update acceptance. The implementer has no event-writing tool, and its result schema cannot emit evaluations or events. An implementer-authored event, a forged role/result, an old revision, unsupported evidence or an expired grant cannot certify a criterion. The kernel's `VerificationContinuation` emission survives the physical episode. A completed repair result is only a proposal; it never certifies its own change. `requiresHuman` holds the continuation for attention.

`VerificationSubjectSubmitted` records the host-applied repair. **Substantive means any source-byte change in this version**, including formatting: the fold derives changed paths from before/after files rather than accepting an implementer-supplied impact list. It marks all prior evaluations on affected criteria stale. Unaffected rows retain their evidence and original subject revision. This is the initial verification-radius policy: intersect declared dependency surfaces; unknown surfaces select the full set. A subsequent verifier receives only incomplete, failed or stale criteria over the new pinned subject. Each blocking finding retains its compiled repair plan, but execution is serial: one focused repair, then fresh verification before any remaining finding is reconsidered. A passing recheck resolves old findings; a new conclusive failure supersedes them while preserving the new open finding. Exhausting the repair bound leaves `attention`, never a verified completion.

`projectAcceptanceEvidenceMatrices(events)` is a read-only kernel replay per workstream through the verification branch of the same typed `seiriReactor` used by the live host. Complete live/replayed Decisions are compared in the acceptance suite. Each matrix exposes the current subject revision and phase, baseline, immutable witnesses, finding history, derived staleness records, and rows of criterion × evaluation/evidence refs × status (`incomplete | verified | failed | stale`). There is no editable matrix file. Both `dotln status` formats query that same fold; JSON includes it under `acceptanceEvidenceMatrices`. The [recorded stale projection](../evidence/WO-010/stale-status.txt) shows the matrix during repair, and the [final projection](../evidence/WO-010/matrix.json) preserves old stale evaluations beside fresh passing evidence.

The shipped application host is `verification-snapshot-v1`: clean detached worktrees, no model tools, a synthetic file-selection repository, and host-applied declarative JSON policy repair. It executes only the pinned fixture interpreter; proposed source code is never run. Local subprocess doubles exercise both CLI wire formats. This proves the mechanism and synthetic behavior, with no claim of live model or live-integration verification. Broader repository providers, source-writing repairers, independent code review and post-PR loops remain separate rungs. The existing manual `resume: verify` / `resume: fix` loop remains the control-plane workflow for this repository.

## Memory and observation

| Term                    | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event store**         | Append-only source of truth. The JSONL codec accepts only the empty string or one or more JSON-object lines, each newline-terminated; decode and append refuse every other shape with the offending physical line number, and append assigns `evt_<well-formed line count + 1>`. Persistence progression: JSONL → SQLite (when transactionality/outbox matter). Markdown is a _generated projection_, never shared mutable truth.                                                                                     |
| **Evidence graph**      | Artifacts, provenance, evaluations, lineage — relations are the durable truth, not raw outputs alone.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Workstream**          | A durable objective spanning tasks, sessions, repos, and time. The author's maturity projection is Unformed Rumor → Exploration Contract → Defined → SMART-Validated → Execution-Ready → Verified Complete. Profiles without verification may instead expose an explicit owner-accepted, self-reported, unverified, or other declared terminal disposition. A vague objective is never rejected: it is marked an exploration contract until enough facts exist to define measurable completion gates (see 05 §SMART). |
| **Watcher**             | A read-only perspective: `narrative = project(EventLog, Perspective)`. Multiple watchers (architecture, quality, security, operator-intent) produce different narratives from the same events; none becomes canonical truth.                                                                                                                                                                                                                                                                                          |
| **Lineage**             | Connected history of identity versions, episodes, outcomes, adaptations. "You are the sum of a connected lineage of agent variations and actions."                                                                                                                                                                                                                                                                                                                                                                    |
| **Verification radius** | Pure function of (anomaly, dependency graph, confidence profile) → recheck scope: local / neighborhood / subsystem / full.                                                                                                                                                                                                                                                                                                                                                                                            |
| **Beacon**              | Rebuildable metadata projection or explicitly labeled emitter claim, addressed by a fixed non-state identifier. Size is a codeword; mtime is derivation/claim time; padded JSON holds the complete projection or claim record. Neither provenance label nor checksum authenticates the writer.                                                                                                                                                                                                                        |
| **BeaconCodebook**      | Versioned finite fields, ranks, radices, framing, and exact decoder. Unknown versions never inherit a known version's meaning. v1 is specified below; it is independent of application, package, and event-schema versions.                                                                                                                                                                                                                                                                                           |
| **BeaconObserved**      | Authorized perception event containing decoded metadata observations and the host's sweep time. WO-021 persists the guarded command before reading, then records one observation event; replay derives the same age labels from that event. Beacon state never supplies authority.                                                                                                                                                                                                                                    |

### Beacon codebook v1

The following JSON is normative data, mirrored and equality-tested against the
pure skeleton codebook. Rows are class rank, followed by outcome ranks; unused
outcome slots are malformed. Refusal `3` means at least three. The two reserved
future-version tags are recognizable framing codewords, not v1 states.

```json
{
  "version": 1,
  "base": 8192,
  "stride": 64,
  "checkMultiplier": 17,
  "checkOffset": 11,
  "versionRadix": 4,
  "outcomeRadix": 3,
  "refusalRadix": 4,
  "provenances": ["host-projected", "self-reported"],
  "classes": [
    ["work-order-dispatch", ["emitted"]],
    ["authority-decision", ["allowed", "denied"]],
    ["recovery", ["redispatched"]],
    ["result", ["returned", "terminated"]],
    ["verification", ["unknown", "failed", "passed"]],
    ["no-op", ["no-op"]],
    ["external-effect", ["requested", "unknown", "observed"]]
  ]
}
```

With class rank `a`, outcome rank `o`, refusal count `r`, provenance rank `p`,
and version `v`, `code = ((((a * 3 + o) * 4 + r) * 2 + p) * 4 + v)`;
`size = 8192 + code * 64 + ((code * 17 + 11) % 64)`. All arithmetic is integer
arithmetic. There are 104 v1 states; the largest code is 669 and its file is
51,064 bytes, densely padded. Decode checks framing before meaning: unsafe,
negative, fractional, below-base, or failed-check sizes are `malformed`;
version zero is reserved and malformed. Framed versions 2 and 3 return only
`unknown-codebook` and their version, without interpreting their higher digits.
This permits a future codebook to extend its field space. For version 1,
`code >= 672` and unassigned outcome slots are malformed. A future framed size
is a codeword for the acceptance test's framing exception, never a v1 round trip.

The declared class order groups dispatch, authority, recovery, result,
verification, no-op, and effects (including terminal cleanup). Classes can
recur; numerical order does not establish chronology. In the demo the latest
host receipt is `schedule.cancel`, `external-effect / observed`, after the
queued no-op. It sorts after the executor's earlier `verification / passed`
claim. No synthetic terminal receipt is added to the audit trail.

`BeaconProjectionRecord` contains `recordType: "beacon-projection"`,
`codebookVersion: 1`, `provenance: "host-projected"`, `refusalCount`, and
`receipt: L0ReceiptEntry`. The pure fold takes the existing audit/L0 projection
in append order, keeps the last receipt for each `(workstreamId, episodeId)`,
and counts its `authority-decision / denied` records, capped at three. Event
clock regression does not reorder the fold. A scope without an episode or
without a consequential receipt has no host beacon yet. The receipt is not
rewritten, and audit projections are unchanged.

`BeaconClaimRecord` instead contains `recordType: "beacon-claim"`,
`codebookVersion: 1`, `provenance: "self-reported"`, `scope` (workstream and
episode), `actor`, `claimedAt`, `actionClass`, `outcome`, and `refusalCount`.
The claim is not an L0 receipt. One pure record encoder derives codeword size,
UTF-8 JSON padded only with trailing newlines, and mtime from the receipt's
`time` or claim's `claimedAt`. Oversized JSON or an unrepresentable timestamp
refuses before filesystem mutation; changing the size to fit content would
change the state and is forbidden.

### Beacon codebook v2 — control state

WO-021 adds the following normative data, equality-tested against the pure
codebook. Array positions are ranks; the v1 episode codebook retains its meaning.

```json
{
  "version": 2,
  "phases": [
    "active",
    "ready-to-verify",
    "verifying",
    "needs-fix",
    "repairing",
    "verified",
    "final-review",
    "closed"
  ],
  "verdicts": ["unknown", "fail", "pass"],
  "efforts": ["unknown", "low", "medium", "high", "xhigh", "max"],
  "provenances": ["host-projected", "self-reported"],
  "phaseRadix": 8,
  "verdictRadix": 3,
  "effortRadix": 6,
  "provenanceRadix": 2,
  "versionRadix": 4
}
```

For phase `h`, latest verdict `v`, latest attested actor effort `e`, and
provenance `p`, `code = (((h * 3 + v) * 6 + e) * 2 + p) * 4 + 2`.
The v1 framing formula wraps that code unchanged. There are 288 states;
`MAX_V2_CODE = 1150`, `MAX_V2_LOGICAL_BYTES = 81833`. Arithmetic uses `bigint`.
The edge rejects an inexact Node size or one beyond its fresh bounded storage
probe before creating a file. Individual v2 files remain densely padded;
allocated data is bounded by the logical size rounded up to one filesystem
block (81,920 bytes at the observed 4,096-byte block size).

`ControlProjectionRecord` is a whitelist: `recordType:
"control-beacon-projection"`, `codebookVersion: 2`, `workOrderId`, `phase`,
`latestVerdict`, `effort`, `provenance: "host-projected"`, and canonical UTC
`recordedAt`. The latest folded attestation supplies effort, including
`unknown`; no actor is invented for an unattested transition. Padded JSON
contains only those fields; mtime is the appended transition's `recordedAt`.
The generic v1 writer cannot write into the reserved control tree. A
provenance label still does not authenticate arbitrary filesystem bytes.

**Preserved design option (2026-09-05 operator follow-up):** a decoded state
can select a richer entry in a locally held, versioned function table. That
indirection needs no additional Beacon bits when existing states are the keys.
An explicit function-ID field would instead need a newly bounded/versioned
codebook. Readers must share the table identity and meaning; selecting an entry
does not grant permission to execute it. No function-dispatch runtime or
performance benefit is claimed by WO-021's status-sweep measurements.

### Beacon codebook v3 — weak keyed provenance

WO-022 extends the individual control family with two finite digits. The
following data is normative and equality-tested against the pure codebook;
all inherited ranks retain the v2 array order above.

```json
{
  "version": 3,
  "inheritedVersion": 2,
  "fieldOrder": [
    "phase",
    "latestVerdict",
    "effort",
    "provenance",
    "keyEpoch",
    "authenticator"
  ],
  "phaseRadix": 8,
  "verdictRadix": 3,
  "effortRadix": 6,
  "provenanceRadix": 2,
  "epochRadix": 256,
  "authenticatorRadix": 65536,
  "versionRadix": 4,
  "maxCode": "19327352831",
  "maxLogicalBytes": "1236950589434",
  "maxAllocatedBlocks": "8",
  "maxPrefixBytes": 4096,
  "padding": "sparse-zero-tail"
}
```

Let `s = ((phase * 3 + verdict) * 6 + effort) * 2 + provenance`, epoch `k`
range over `0..255`, and authenticator `a` over `0..65535`. Then
`code = ((s * 256 + k) * 65536 + a) * 4 + 3`; the unchanged v1 framing
formula maps code to logical bytes. Arithmetic is `bigint` throughout.
There are `288 * 256 * 65536 = 4,831,838,208` field tuples.
`MAX_V3_CODE = 19,327,352,831` and
`MAX_V3_LOGICAL_BYTES = 1,236,950,589,434`.

**Injectivity proof over that entire product:** Euclidean division of
`size - 8192` by 64 recovers code because the check residue is strictly below 64. Division by 4 removes the version digit. Successive quotient/remainder
pairs at radices 65,536, 256, 2, 6, 3, and 8 recover exactly the original
bounded digits, so equal framed sizes imply equal tuples. Boundary tests and
all 65,536 residues for nine representative state/epoch pairs independently
exercise that inverse; the computed maximum equals the declared constants.

The host's 32-byte key lives in a mode-0600 regular file outside every Git
checkout. A residue is the first two bytes, big-endian, of HMAC-SHA-256 over
UTF-8 `dotln-beacon-v3`, NUL, the fixed Beacon basename, NUL, decimal `s`, NUL,
decimal epoch. Neither the key nor its path is an observation field. The
unsigned epoch is non-secret. Creation starts at zero; locked atomic rotation
increments it, replaces the current key file without retaining an old-key
file, and refuses at 255 before replacing any key or Beacon. A long-lived
host must reopen its key handle after rotation.

Beacon Sight labels v1/v2 `unauthenticated-legacy` without changing their
encoding or decoded fields. For v3, an unavailable key or non-current epoch
(including one never observed by the host) yields `unverifiable-provenance`;
a current-epoch mismatch yields `forged-provenance`; a match yields
`residue-matched`. These describe a weak keyed host-consistency and error
check, **not authorship, hostile-writer attribution, or enumeration resistance**.
The 16-bit space can be enumerated by someone with path and decoder access.
Mount/path permissions and the Observe guard remain the security boundary.
The same codebook state re-derived from canonical control records has the same
residue under the same key/epoch. Pure event replay checks arithmetic and
replays the recorded host check outcome; it never loads a secret to authenticate
its own evidence.

V3 content is bounded UTF-8 JSON plus a newline, followed by a logical zero
tail. Its whitelist is the v2 control record with version 3; the epoch and
authenticator occur only in the size codeword, never the prefix or filename.
It is **sparse-required**, never dense newline padding. Before
emission, `probeV3Storage` observes a small hole, exact Node integer conversion,
the maximum file, its bounded prefix, zero tail, exact mtime and atomic rename
on the destination device. `MAX_V3_ALLOCATED_BLOCKS = 8` counts 512-byte units;
the prefix is at most 4,096 bytes. Unsupported sparse, numeric, device, or
filesystem premises refuse before destination allocation; the host returns to
planning rather than changing channels. This is an observed codebook ceiling,
not a claim about the filesystem's theoretical maximum. See
[WO-022 evidence](../evidence/WO-022/README.md).

### Beacon group codebook v1 — phase counts

The phase-group family is separate from individual Beacon versions. Its
directory and dedicated decoder select the family. Since WO-022, framing tag
3 also identifies individual v3 in the individual family; a reader must never
guess the family from size alone. The legacy v1 decoder still reports tag 3
as unknown. This normative data is equality-tested too:

```json
{
  "family": "phase-group",
  "version": 1,
  "framingVersion": 3,
  "maxMembers": 12,
  "radix": 13,
  "versionRadix": 4
}
```

In v2 phase order, count `c[i]` contributes `c[i] * 13 ** i`.
`code = 4 * sum(c[i] * 13 ** i) + 3`, then the ordinary framing formula
produces size. Every digit is an integer in `0..12` and the total is at most 12. There are 125,970 valid vectors, exhaustively collision/round-trip tested.
`MAX_GROUP_CODE = 3011928819`, `MAX_GROUP_LOGICAL_BYTES = 192763452654`.
Only decoded host-projected v2/v3 observations enter the sum; verdict, effort,
claims, absent files, and malformed/unknown codewords contribute nothing.
Counts describe the swept metadata, including old observations; they do not
prove liveness or a simultaneous snapshot of every member.

The group file has no content payload. The fresh local probe observed the
maximum logical size with zero allocated data blocks. Sparse emission permits
at most one filesystem block. The theoretical dense bound is the maximum
logical size rounded up to a block: 192,763,453,440 bytes for 4,096-byte blocks.
A host without observed sparse support has only the reproduced 81,833-byte
logical ceiling: small groups are densely padded, larger groups refuse before
allocation. No hundreds-of-gigabytes dense probe is attempted. See the
[storage evidence](../evidence/WO-021/README.md).

### Beacon perception and age

An agent submits `Observe { subject: "control-beacons" }` with an explicit
host-supplied envelope, audience, evidence/revocations, and `staleAfterMs`.
The reactor lowers it to an `Act` effect `observe.beacons.public` or
`observe.beacons.verifier`, charging one `beaconSweeps` unit through the existing
authorization guard. This keeps the kernel byte-identical and gives the
consequential read the same deny, expiry, revocation, evidence, and resource
checks as other effects. The intent and codebook never manufacture a grant.

The edge appends `BeaconSweepRequested`, then either `CommandRefused` with
zero Beacon reads, or `CommandPersisted` before the first Beacon read,
exactly one `BeaconObserved`, and `CommandResult`. The observation contains
`commandId`, `sweptAt`, and observations with opaque `address`, decimal `size`,
`mtimeMs`, exact decimal `mtimeNs` when available, and the decoded result.
The event's `occurredAt` equals `sweptAt`; replay uses that recorded `env.now`.
Missing files retain null metadata and `absent`. Only the observations in the
event are replayed; replay never scans the current filesystem.

**WO-022 forward migration:** new sweep requests carry `perceptionVersion: 1`
and the compiled sense selection plus a path-free projection of the host mount
record. The physical environment and key stay at the edge. The reactor checks
the envelope and perception capability before emitting an intent; the sparse
twin uses that same decision to render zero or exactly one sweep action.
New observations also carry `perceptionVersion: 1`, a non-secret `keyEpoch`
at observation time (or null), and `groups` as the sensed group set or
`not-sensed`. Each individual has a `provenanceCheck` and a `fineSpectrum`
label. Without Fine Spectrum, `mtimeNs` is omitted and `mtimeMs` is rounded
down to a whole second before persistence or projection. Age then honestly
uses that coarse observation. The metadata reader performs only known-name
status calls, never enumeration, content or xattr reads. It verifies the
captured address set and rejects extra observation fields. Historical requests
without the new version keep the old v1/v2 decoder and full timestamp meaning;
new live input cannot use that legacy path.

Default `staleAfterMs` is 1,200,000 (20 minutes). For a valid decoded Beacon,
`mtime > sweptAt` is `clock-skew`; age greater than or equal to the declared
threshold is `stale`; otherwise it is `fresh`. The reactor records the
`Cadence.After` evaluation in its trace. Nanoseconds are retained for the
comparison; the millisecond cadence origin rounds upward to avoid declaring
a sub-millisecond observation stale early. Malformed and unknown codewords
stay flagged. Text glyphs render stale as blurred, missing as absent, and
skew as flagged. Observation age never changes a grant or lifecycle legality.

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
