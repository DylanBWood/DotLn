# Audit, records, resilience, and privacy

This document is the assurance design space and current strict profile for the
author's personal implementation. DotLn supplies the mechanisms and capability
vocabulary; ADR-0006 permits another implementation to reduce or omit audit,
retention, evidence, replay, and recovery rather than inherit this doctrine.

When this assurance profile is enabled, it should answer **who or what did what,
why, under whose authority, using
which inputs, with what result, and how we know** before it optimizes dashboards
or operational telemetry. Audit is therefore a family of evidence-backed
projections over authoritative records, not one universal log stream.

Logging, audit, persistence, recovery, backup, disaster recovery, and privacy
overlap but are not synonyms:

| Concern             | Question it answers                                                    | Primary artifact                                                       |
| ------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| operational logging | What is the system doing or failing to do right now?                   | diagnostic events, metrics, traces, health state                       |
| audit               | What consequential action or decision occurred, and was it legitimate? | durable, attributable audit record plus evidence links                 |
| persistence         | What state must survive process or session death?                      | canonical event/store state and artifacts                              |
| recovery            | How does interrupted work resume without duplicate or lost effects?    | continuation, lease, command receipt, reconciliation state             |
| backup              | Can retained state be restored after loss or corruption?               | versioned copies plus tested restore procedure                         |
| disaster recovery   | How does the implementation resume after site/system-scale failure?    | recovery plan, replicated essentials, recovery evidence                |
| privacy             | What may be collected, used, revealed, retained, exported, or erased?  | classification, purpose, access, retention, redaction, deletion policy |

The same underlying event may participate in several concerns, but each has
different retention, access, fidelity, and presentation needs.

## Audit audiences and decisions

The correct audit view begins with the decision its reader must make.

| Reader                        | Needs to determine                                                     | Useful default view                                                 |
| ----------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| individual operator           | What happened to my work and why?                                      | plain-language episode receipt and replayable timeline              |
| affected user                 | What did the system use or change about me?                            | subject-centered activity and consent history                       |
| executor / engineer           | Where did execution diverge or fail?                                   | correlated event trace, tool calls, state transitions, artifacts    |
| verifier / reviewer           | Were acceptance claims independently established?                      | criterion-to-evidence matrix and provenance graph                   |
| manager                       | Were duties, approvals, and handoffs followed?                         | workstream timeline, exceptions, decisions, unresolved risk         |
| service owner / SRE           | Is the system reliable and recoverable?                                | health, failure/retry topology, queues, leases, recovery objectives |
| security investigator         | Was access authorized; was anything exposed or changed?                | identity/authority/effect graph, access events, integrity chain     |
| privacy lead / data subject   | Was data processed for an allowed purpose and retained correctly?      | purpose/use/export/deletion ledger scoped to a subject or class     |
| internal auditor / compliance | Did controls operate over the selected period and population?          | control-to-evidence matrix, samples, exceptions, attestations       |
| IT director                   | Can the implementation be governed, retained, restored, and supported? | deployment/data-flow map, control coverage, restore and DR evidence |
| executive / board / CFO       | What material exposure, loss, control failure, or trend exists?        | aggregated risk and exception view with drill-through to evidence   |
| regulator / external assessor | Can a bounded claim be substantiated without revealing unrelated data? | signed/exported audit package with scope and redaction manifest     |

No audience receives greater access merely because its visualization is more
senior. Aggregate views retain drill-through lineage without exposing raw
content to unauthorized readers.

## Canonical audit record

Audit should primarily reference the event store and evidence graph rather than
copy every payload into a second truth. The v0.3.0 audit baseline pins
`AuditRecord` schema version 1 as a compiled reference envelope over the
canonical event log:

```ts
type AuditActionClass =
  | "work-order-dispatch"
  | "authority-decision"
  | "external-effect"
  | "result"
  | "verification"
  | "recovery"
  | "no-op";

type NonEmptyRefs = readonly [string, ...string[]];

type AuditRecordBase<C extends AuditActionClass, O extends string> = {
  schemaVersion: 1;
  recordId: `audit:${string}:${C}`;
  actionClass: C;
  action: string;
  outcome: O;
  occurredAt: number;
  actorId: string;
  workstreamId: string;
  episodeId?: string;
  eventIds: NonEmptyRefs;
  correlationId?: string;
  causationId?: string;
};

type AuditRecord =
  | (AuditRecordBase<"work-order-dispatch", "emitted"> & {
      workOrderRef: string;
    })
  | (AuditRecordBase<"authority-decision", "allowed"> & {
      decision: "allowed";
      commandId: string;
      decisionEvidence:
        | "authority-trace-and-command-persisted"
        | "authorized-command-persisted";
    })
  | (AuditRecordBase<"authority-decision", "denied"> & {
      decision: "denied";
      reason: string;
      authorityEnvelopeRef: string;
      association: "derived-same-episode-time-adjacency" | "refusal-event-only";
    })
  | (AuditRecordBase<
      "external-effect",
      "requested" | "observed" | "unknown"
    > & {
      effectState: "requested" | "observed-result" | "unknown";
      commandId?: string;
    })
  | (AuditRecordBase<"result", "returned"> & {
      resultState: "command-returned";
      commandId: string;
    })
  | (AuditRecordBase<"result", "terminated"> & {
      resultState: "episode-terminated";
    })
  | (AuditRecordBase<"verification", "passed" | "failed" | "unknown"> & {
      verdict: "passed" | "failed" | "unknown";
      subjectRef?: string;
      association:
        | "explicit-event-link"
        | "derived-single-request-in-scope"
        | "completion-event-only";
    })
  | (AuditRecordBase<"recovery", "redispatched"> & {
      commandId: string;
      originalCommandEventId: string;
      recoveryState: "redispatched";
    })
  | (AuditRecordBase<"no-op", "no-op"> & {
      reason: string;
      evidenceEventIds: NonEmptyRefs;
    });
```

`occurredAt` is the EventEnvelope's numeric virtual/log time. Schema version 1
does not contain `recordedAt`: the fixture never collected an ingest time, and a
projection must not relabel occurrence time to fill the gap. `recordId` is
deterministic from the primary event and class. `eventIds` is non-empty and
points back to every canonical event summarized by the record. WorkOrder,
command, episode, authority-envelope, subject, and evidence identities remain
references. Event payloads, candidate paths, the WorkOrder body, and output
bodies do not enter `AuditRecord`; L4 governed raw may dereference the retained
envelopes when its governance allows.

The envelope is a discriminated union. Required properties depend on action
class; nothing populates every candidate field:

| Action class          | Canonical source in the walking skeleton                                                                       | Additional required fields                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `work-order-dispatch` | `WorkOrderEmitted`                                                                                             | `workOrderRef`; outcome `emitted` (no transport receipt is claimed)                                                                    |
| `authority-decision`  | matching adjacent `DecisionRecorded` + `CommandPersisted`, persisted-only legacy fallback, or `CommandRefused` | allowed: `commandId` and an honest evidence label; denied: `reason` + `authorityEnvelopeRef`, and deliberately no invented `commandId` |
| `external-effect`     | `CommandResult`, `DeletionAttempted`, or `SchedulesCancelled`                                                  | effect state `requested \| observed-result \| unknown`; `commandId` only when a command exists                                         |
| `result`              | `CommandResult` or `EpisodeTerminated`                                                                         | `command-returned` or `episode-terminated`; `commandId` for a command result                                                           |
| `verification`        | `VerificationRequested` + `VerificationCompleted`                                                              | verdict, association label, and `subjectRef` when the source records one                                                               |
| `recovery`            | `CommandPersisted` + `CommandRedispatched`                                                                     | original `commandId`, original persisted-event reference, and recovery state                                                           |
| `no-op`               | `QueuedPulseNoOp`                                                                                              | reason and canonical `evidenceEventIds`; it does not carry refusal-only authority detail                                               |

A consequential source event that lacks a class-required canonical reference
refuses projection instead of disappearing or producing a positive/placeholder
record. In particular, `CommandResult` proves that a result returned, not that
the effect succeeded, and `EpisodeTerminated` proves termination, not successful
completion. Although the fixture event is historically named
`DeletionAttempted`, it precedes authorization and never reaches the adapter;
the audit stage is therefore `requested`, followed by the structural denial.

The step-9 denied record may group the adjacent `DeletionAttempted`,
`CommandRefused`, and authority `DecisionRecorded` events only when they share
episode and log time and the last event carries a structurally conforming
authority-guard v1 refusal trace whose branch matches the refusal reason. That
grouping is explicitly `derived-same-episode-time-adjacency`; it is not a
fabricated `causationId`.

For an allowed command, the canonical demo groups the immediately preceding
`DecisionRecorded` only when both events share scope and the trace is a
structurally conforming authority-guard v1 grant: exact
`authorized / <persisted effect>` branch, the v1 base environment inputs with a
nonempty authority-envelope reference and the trace event's canonical time,
any complete semantic-revocation suffix, the matching resource suffix when the
command consumes one, and no cadence evaluations. The record labels that pair
`authority-trace-and-command-persisted`; older or independently constructed logs
without such a trace retain the narrower `authorized-command-persisted`
fallback. This validates the recorded structure; it does not authenticate an
untrusted event source. Neither form invents the allowing authority-envelope
identifier when the canonical source does not record it.

A verification completion uses an explicit causation/correlation event link when
one names a request. With no explicit link, a sole preceding request in the same
workstream and episode may be paired only as `derived-single-request-in-scope`;
ambiguity falls back to `completion-event-only`. The association label keeps the
inference visible.

The consequential classes answer different questions for the two baseline
audiences:

| Action class          | Operator question                                          | Verifier question                                                                                   |
| --------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `work-order-dispatch` | What bounded work was emitted for this episode?            | Which canonical event and WorkOrder reference prove emission without claiming a transport receipt?  |
| `authority-decision`  | Was the requested action allowed or denied, and why?       | Does the decision retain its canonical command or refusal evidence without inventing either?        |
| `external-effect`     | What outside action was requested or observed?             | Which retained events distinguish a requested effect from an observed result?                       |
| `result`              | What outcome did the episode or command return?            | Does the result point to the originating command and canonical result event?                        |
| `verification`        | Was the result accepted by the recorded verification step? | Which request and completion events support the verdict, and what attribution is actually recorded? |
| `recovery`            | Which interrupted command resumed?                         | Did recovery preserve the original canonical command identity?                                      |
| `no-op`               | Why did the system deliberately do nothing?                | Does the decline point to the event evidence that made further work inapplicable?                   |

The walking-skeleton fold records only actor `repo-gardener`, including on
verification events. The projection reports that fact; it does not upgrade it
into evidence of verifier independence. A production deletion or denied act
needs more detail than an inert query or `NoOp`.

Properties that are easy to omit include:

- occurrence time versus record/ingest time;
- human, model, service, delegated-agent, and impersonation identity;
- correlation and causation across retries, handoffs, and subagents;
- exact policy and authority version evaluated at the time;
- intent, objective, and reason—not only the resulting command;
- requested effect versus authorized, attempted, observed, and compensated
  effects;
- immutable input/output references, versions, and hashes;
- runtime, model, tool, and material configuration fingerprints;
- for isolated episodes, the selected environment/profile hash and effective
  substrate, image/rootfs or guest-kernel identity, mounts, egress,
  capabilities, resource limits, secret-lease references, boundary denials,
  teardown, and residual-state outcome—never secret values;
- evidence strength, dissent, uncertainty, and verifier independence;
- reversibility, rollback/compensation, and recovery outcome;
- data classification, purpose, consent/legal basis where applicable;
- retention, hold, export, redaction, and deletion events;
- integrity linkage and gaps, including `unknown` rather than invented detail.

Prompt text, chain-of-thought, credentials, and complete sensitive payloads are
not default audit fields. Prefer typed decisions, inputs, tool/effect records,
result summaries, and references to separately controlled artifacts.

Safety-counterweight evaluation may derive a **restraint-attribution funnel**
from correlated records without adding hidden reasoning to the audit envelope.
The projection keeps selection disposition separate from enforcement/effect
outcome. Selection records local-alternative choice, `NoOp` decline, authority
request, boundary intent, or `unknown`. Outcome records guard refusal, operator
approval denial/cancellation, harness-policy denial, attested OS-sandbox denial,
or dispatch with its authority state recorded followed by effect observed,
confirmed no effect, or effect unknown. An authority request and dispatch are
nonterminal, retries do not create new opportunities, and a generic permission
failure cannot be attributed to the OS without vendor/OS evidence. Store a
normalized action class and opaque/redacted target reference, not a credential,
hostname, secret-bearing command, or speculative reconstruction of
chain-of-thought. Under schema version 1 this remains a derived evaluation view
over activation, `DecisionTrace`, `CommandRefused`, approval, tool-result, and
adapter records. Correlation and causation remain optional source-provided
references; absent links stay unknown. Attribute the counterweight as
`participated`, not `caused`, absent paired evidence.

## Fidelity levels

| Level              | Content                                                             | Typical use                                     |
| ------------------ | ------------------------------------------------------------------- | ----------------------------------------------- |
| L0 receipt         | outcome, scope, time, actor, evidence/record link                   | everyday confirmation                           |
| L1 narrative       | ordered explanation of major decisions and effects                  | operator, manager, support                      |
| L2 control view    | authority, approvals, policy evaluations, exceptions, evidence      | audit, security, compliance                     |
| L3 technical trace | state transitions, commands, tool results, retries, timings, hashes | engineering and incident response               |
| L4 governed raw    | complete retained event envelopes and allowed artifacts             | forensic reconstruction under restricted access |

Higher fidelity is not automatically better. Each level has an audience,
purpose, access rule, retention class, and known omissions. Every lossy view
links to the records it summarizes and states whether deeper data exists,
expired, was never collected, or is access-restricted.

## Audit projections and visualizations

The v0.3.0 baseline implements three rebuildable folds over one retained JSONL
log. The L0 receipt exposes outcome, scope, numeric time, recorded actor, and
event evidence links, names its omissions, and links to the L1 causal timeline.
The timeline orders consequential AuditRecords by explicit causation where
present; a referenced source event precedes every AuditRecord derived from that
event. Correlation remains an append-stable group that does not assert
causation, and canonical append ordinal is the fallback and tie-break.
Occurrence time is displayed but never used as the sole order because a later
append can describe an earlier occurrence. Causal cycles are refused rather than
silently displayed in an order that contradicts the source links. The fold also
refuses duplicate event IDs, blank canonical identifiers/references, non-finite
occurrence times, missing or non-JSON payloads, and unsupported envelope
versions.

One projection run chooses one scope for the whole fidelity chain: an `ep:`
scope only when every input event carries the same episode in the same
workstream, otherwise a `ws:` scope for one workstream, `log:mixed` for multiple
workstreams, or `log:empty`. The discriminator prevents episode/workstream and
sentinel collisions. This keeps every deeper link resolvable without labeling
episode-less, cross-episode, or cross-workstream context as part of one episode;
it also works when the log contains no consequential records. The timeline
labels the bounded single-request verification association as derived, otherwise
names absent links rather than inventing them, and links each record to L4
governed raw JSON. L0 and L1 declare their audience and purpose, the
`projections` persistence class, and that access and retention rules are not yet
defined; their enforcement is deferred. Governed raw includes every retained
EventEnvelope, names the verifier as this rung's audience, declares
restricted-access intent, leaves retention undefined, and states that access
enforcement is deferred. Every deeper link declares whether its target exists
and its access/enforcement state. The folds do no I/O, are disposable, and
rebuild byte-identically over replay.

Different questions need different geometries over the same records:

- **chronological timeline:** actions, decisions, retries, approvals,
  cancellations, and recovery;
- **causal graph:** which intent, event, or result caused each downstream act;
- **actor/delegation graph:** human → orchestrator → subagent → tool/effect;
- **authority overlay:** requested versus allowed/denied effects, approval
  boundaries, policy version, and consumed authority budget;
- **workstream swimlane:** responsibility, waits, handoffs, verifier separation,
  and control points;
- **statechart replay:** exact state transitions with illegal/missing paths;
- **evidence matrix:** claim or criterion × source × test × observed result ×
  verifier × status;
- **provenance graph:** source → transform → artifact → decision → effect;
- **data-flow/residency map:** data class, origin, purpose, storage/export
  locations, recipients, and deletion path;
- **access matrix/heatmap:** actor or role × resource/effect × allow/deny/use;
- **exception dashboard:** denied acts, bypasses, stale evidence, unresolved
  dissent, missing records, overdue retention, and failed restores;
- **change diff:** policy, role, loadout, WorkOrder, model, or configuration
  before/after with affected decisions;
- **recovery topology:** checkpoints, backups, replicas, dependencies, RPO/RTO,
  last successful restore, and single points of failure;
- **cost/resource ledger:** model/tool use, time, retries, and attributable cost
  without treating activity as value;
- **raw event/API/SQL export:** bounded machine-readable access for analysis,
  migration, external audit, and reproducibility;
- **signed evidence package:** selected records, artifacts, hashes, scope,
  redaction manifest, schema versions, and verification instructions.

Filters include time, implementation, workstream, episode, actor, role, subject,
action/effect, resource, policy, authority decision, evidence status, data
class, purpose, retention class, runtime/model, result, severity, and
correlation/causation chain. Saved filters are views, never hidden policy.

## Persistence and recovery classes

| Class               | Examples                                                         | Recovery posture                                                     |
| ------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| canonical           | event log, definitions, authority/policy versions, continuations | transactional append, integrity checks, tested point-in-time restore |
| effect coordination | command receipts, idempotency keys, leases, outbox/inbox         | recover before redispatch; reconcile ambiguous effects               |
| evidence            | test results, findings, source hashes, approvals                 | immutable references, staleness propagation, retention by claim/risk |
| artifacts           | code, documents, media, exports                                  | content-address or version; regenerate where provably possible       |
| projections         | Markdown, dashboards, indexes, ratings, narratives               | disposable and rebuildable from canonical sources                    |
| diagnostics         | verbose traces, debug logs, metrics                              | short-lived by default; sampled and separately access-controlled     |
| secrets             | credentials, tokens, private keys                                | dedicated secret store; never event payload or unprotected backup    |

Recovery distinguishes **known-not-applied**, **known-applied**, **ambiguous**,
and **compensated** effects. A restart replays state, reconciles outstanding
commands, preserves the original correlation chain, and records recovery as new
events; it never edits history to make the run look clean.

## Backup and disaster recovery choices

Implementations select posture from risk rather than inheriting an expensive
universal default:

- local snapshots or versioned copies for a single-user installation;
- encrypted scheduled backup with rotation and restore testing;
- off-device/off-site copy for device or site loss;
- append-log shipping and point-in-time recovery for transactional stores;
- warm or cold standby for higher continuity requirements;
- multi-region replication only where jurisdiction, cost, and failure model
  justify it;
- portable export for provider exit and long-term survivability;
- documented dependency order, recovery owner, communications, and manual
  degraded mode.

Every implementation claiming a recovery capability declares recovery point
objective, recovery time objective, retention, backup frequency,
encryption/key ownership, residency, restore prerequisites, and the date/result
of its last restore and disaster exercise. An owner may instead declare that
recovery is absent. “Backups configured” is not evidence until restoration
succeeds.

## Privacy and minimization

Auditability can conflict with privacy if “record everything” becomes the
default. This assurance profile should instead apply:

- purpose limitation and collection minimization by event/action class;
- separation of metadata from sensitive content;
- immutable references or hashes where duplication is unnecessary;
- field-level classification, encryption, masking, tokenization, and access;
- tenant, implementation, subject, role, and purpose-based isolation;
- configurable retention, legal hold, subject access/export, correction, and
  deletion/anonymization workflows;
- explicit treatment of derived data, embeddings, model inputs/outputs,
  screenshots, transcripts, and backups;
- export manifests that reveal omissions and redactions without disclosing the
  removed content;
- access-to-audit itself being audited;
- aggregate reporting with disclosure controls where needed.

Deletion and immutability require design, not slogans. A durable audit record
may retain that a governed deletion occurred while separately deleting or
cryptographically rendering inaccessible the sensitive payload. Hashes are not
automatically anonymous when the input space can be guessed.

## Candidate — minimized incident reporting

A failure-triggered active, projected into supported runtimes as an agent skill,
can turn a crash or reproducible bug into a least-necessary incident packet. It
starts in the governed local lane: select only the correlated diagnostic slice,
reproduction steps, affected public component and version, outcome class, and
public-safe environment facts; deduplicate and classify it; apply deterministic
field selection and local redaction; then preview a manifest that says what will
be included, omitted, transformed, and lost. Raw local logs remain separately
controlled diagnostics with short retention by default. Credentials, resolved
targets, private identifiers, unrelated log lines, conversation history, and
reversible fingerprints are never issue payloads.

“Automatic” means an operator policy may preauthorize submission of a narrowly
classified packet through a GitHub Issues effect adapter. The authorization
still names repository scope, issue operation, rate and duplicate limits,
required evidence, expiry, and revocation; the outbox records the external
effect. Without that envelope the active produces a local draft and receipt,
not an issue. Target bindings and credentials resolve only inside the adapter,
and a final payload preview remains available even when standing authority
permits unattended submission.

An issue is an intake artifact, not proof, priority, or permission to repair.
The reporter links the local source without copying it, labels its own diagnosis
as a claim, and cannot independently verify itself. A public receipt records the
sanitized packet and remote issue reference only when the selected profile
permits it. The first implementation slice should use synthetic logs with
planted secrets and unrelated records, proving minimization, redaction,
deduplication, draft-only refusal, and exactly one authorized submission before
any real diagnostic source is connected.

## Candidate — model-input exposure plans

“Uses a model” is too coarse a privacy disclosure. Before a possible model
invocation crosses its execution boundary, the compiler should be able to emit
a **ModelInputPlan** that names the destination class—deterministic local
processor, local model, or provider-hosted remote model—and every planned input
edge. Each edge identifies purpose, source lineage, data class, retention class,
and exposure form: verbatim content; structural shape such as schema, length, or
timing; subject identity or tags; a derived summary, embedding, or inference;
related or adjacent retrieved context; or material that could travel
accidentally through conversation history, tool output, screenshots, errors, or
diagnostics. The plan is local policy state. A public projection carries only
profile-approved aggregate claims and never becomes a new inventory of private
behavior.

An operator-facing preview renders that plan before execution at the level the
operator has authorized. It shows which boundary each edge crosses and the
consequence of changing it. Available compiled alternatives can include omit,
select fields, redact or pseudonymize locally, replace content with a local
derivation or synthetic fixture, route the residual judgment to a verified
local model, use a deterministic implementation, or cancel. Each alternative
must show the resulting capability, quality, latency, cost, and evidence
deficit; narrowing input never triggers a silent remote fallback. An exact
content preview, where useful, stays on the operator's device and is itself
governed access to sensitive data.

Exposure policy composes at the data edge rather than becoming one global
switch. An active primitive, role, or linked support can declare the input
classes and destination classes it accepts; the operator wires a link group to
local inference, remote inference, both as explicit stages, or neither. The
personal compiler intersects those choices with its equipped authority and
source-treatment guards and renders the effective flow. An unwired route becomes a visible capability
deficit, while a two-model route shows both crossings independently. The
operator owns the selection; a role or support cannot infer extra disclosure
authority merely because it would improve its output.

One candidate bootstrap topology is hybrid and local-first: deterministic
parsers handle exact grammar; a bounded local model proposes tags,
associations, redactions, and a candidate bounded WorkOrder/context capsule from
free-form input; and a more capable remote model receives only the approved
capsule and public-safe evidence for a planning, coding, or other complex
episode. Any equipped authority gates still decide whether the candidate
becomes dispatchable. That is a routing
hypothesis, not a permanent capability caste or fixed role assignment. The
operator expects local semantic capability to improve rapidly; dated
model/runner/hardware evidence therefore reopens each route and can move more
work local without redesigning the boundary. Local tags and associations remain
fallible derived sensitive data, so the operator can inspect or bypass them and
their uncertainty and source lineage survive the handoff. If the remote episode
needs additional source content, it requests a new input edge and preview
rather than silently widening the original disclosure.

Local execution is a route, not a synonym for privacy. A local model is eligible
for a no-provider-content claim only when discovery covers its model artifact,
runner, prompt template, context sources, file and process access, diagnostics,
storage, and network-egress boundary. A remote adapter likewise distinguishes
what DotLn sent from externally asserted retention, training, or deletion
behavior and labels the evidence and date behind those assertions. In this
repository's personal profile, the equipped Clean Room active and its locked
employer/secret floor still refuse prohibited material rather than offering a
toggle.

The compiled manifest proves declared input participation. A per-invocation
local receipt can bind that plan to the values' classes and transformation
versions without copying the values into a public log. Pure functions prove the
declared local mappings; adapter evidence proves the requested invocation; an
outer capability boundary and independent tests remain necessary to support a
negative claim about undeclared context, logging, storage, or network effects.
This candidate defines the inspectable privacy contract, not a claim that the
preview or enforcement exists today.

## Candidate — public Git with a local private evidence lane

The personal default aims to commit nearly all durable definitions, code,
decisions, and public-safe evidence to GitHub. Data that the operator wants
processed, logged, or audited but not published takes an intake-shaped local
lane: an operator-configured ignored store holds the governed source, pure
functions derive bounded views, and a Clean Room promotion step decides whether
any sanitized projection, fixture, or conclusion may enter Git. The effectful
local store is separate from the pure transformation; `gitignore` is only the
last anti-commit guard.

A payload-free public log is not automatically harmless. Event types, ordering,
cardinality, timestamps, actor and workstream identifiers, correlations, gaps,
and access patterns can reveal the very activity a payload redacts. A public
profile therefore classifies and may omit, bucket, delay, aggregate, or replace
those structural fields; it must name the resulting loss of replay or audit
power. Hashes and stable opaque identifiers are included only after a
re-identification analysis, not as ritual anonymization.

This suggests two explicitly different records rather than one log pretending
to serve every audience: a locally governed source record at the fidelity the
operator selected, and a lossy public projection whose omissions and purpose are
declared. The authoritative evidence source depends on the claim: private
replay/audit claims cite the local record, while public project-history claims
cite committed artifacts. The public view remains a projection rather than a
second canonical event store. If the local store is absent, expired, or lost,
Git cannot reconstruct the private semantics and must say so. This candidate
does not change the resume log's public classification or add private-lane
values there; WO-019's separate actor-attestation fields still apply. A later
design must choose the local root, envelope, encryption,
retention/deletion, backup posture, projection profile, and non-identifying
lineage mechanism before private runtime data is collected.

Maintenance for that lane is an offline capability family, not a Git workflow:
inspect, validate, transform, snapshot, rotate, restore, and governed deletion.
Pure cores plan or transform bytes; narrowly authorized filesystem adapters apply
those plans between explicit local roots and write local receipts. They never
invoke Git, inspect Git history as a data source, stage or commit records, open a
socket, call a remote API, or use a network backup target. Negative tests poison
Git executables and network access while exercising round-trip restore,
interrupted writes, path containment, retention, and deletion boundaries.
Implementation code and synthetic fixtures can remain public while instance
paths, contents, keys, and maintenance receipts stay local. A same-device copy
is not disaster recovery; removable offline media can improve the failure model
only when the operator explicitly configures and tests it.

The active mechanics and supports (“gems”) that carry out a maintenance action
emit its typed plan, transformation identity, input/output classes, touched
local roots, and result receipt. That is first-party evidence of what they
declared and positively observed. It does not self-prove the negative claim that
no hidden Git or network effect occurred. That claim needs a deny-by-construction
outer environment, poisoned-capability tests, and independent verification; the
receipt links those attestations without copying private paths or values into the
public lane.

Do not confuse offline maintenance with acquisition. A separately authorized
source pipeline may contain `fetch` or XHR, hand its result across the local
boundary, and still exclude optional payload-audit, logging, retention, or
snooping supports from that link group. The personal implementation's required
data-minimized authority/command/result evidence remains; another implementation
may omit the assurance profile and declare those records unavailable. The
compiled component manifest proves declared participation; a local execution
receipt binds one data instance to the manifest and exact transformations.
Functional purity proves only the pure transform subgraph's mapping, not that an
effectful adapter ran or that untrusted code had no hidden effect. Those latter
claims come from adapter evidence and the outer execution boundary respectively.

## Policy dimensions implementations can customize

Each implementation can define audited action classes and required properties;
diagnostic verbosity and sampling; access to fields, views, and exports;
evidence sufficiency; integrity and signing; storage, residency, encryption, and
key ownership; retention, deletion, holds, and archival; backup, RPO/RTO,
restore, and DR cadence; privacy purposes and subject handling; alerts,
exceptions, attestations; and interoperability/export schemas.

These are local doctrine compiled through shared DotLn contracts. A personal
implementation and a regulated organization receive the same legos without
pretending they need the same control burden. An owner-directed implementation
may also mark a capability absent: no audit, no retained evidence, no replay, or
no recovery. The implementation declares that distinction in compatibility
metadata when it exposes a DotLn interchange boundary; the platform contract
does not reinstall the omitted policy.

When this audit capability is combined with `PresencePolicy`, its record names
the source grant, triggering event, changed axis, prior and current tranche,
ceiling, and stop/reset/replenishment state. An implementation that omits audit
does not manufacture that history; its current policy declaration can still be
machine-readable without claiming a replay of past transitions.

## Bootstrap sequence

Beware naive interventionism: an elaborate audit platform created before real
questions exist can increase sensitive-data exposure and obscure the records
that matter. Begin with:

1. enumerate consequential actions and the questions an operator/verifier must
   answer;
2. define a minimal envelope for WorkOrder dispatch, authority decision,
   external effect, result, verification, and recovery;
3. produce three projections from one event fixture: L0 receipt, causal
   timeline, and governed raw JSON;
4. prove an unauthorized reader cannot reach sensitive fields through any
   projection or export;
5. simulate crash-after-effect ambiguity and demonstrate reconciliation;
6. restore the canonical store from backup and compare semantic hashes;
7. only then add organizational dashboards, regulatory mappings, replication, or
   specialized archives demanded by an implementation.
