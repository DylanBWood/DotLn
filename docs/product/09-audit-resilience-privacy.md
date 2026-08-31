# Audit, records, resilience, and privacy

DotLn should answer **who or what did what, why, under whose authority, using
which inputs, with what result, and how we know** before it optimizes dashboards
or operational telemetry. Audit is therefore a family of evidence-backed
projections over authoritative records, not one universal log stream.

Logging, audit, persistence, recovery, backup, disaster recovery, and privacy
overlap but are not synonyms:

| Concern | Question it answers | Primary artifact |
|---|---|---|
| operational logging | What is the system doing or failing to do right now? | diagnostic events, metrics, traces, health state |
| audit | What consequential action or decision occurred, and was it legitimate? | durable, attributable audit record plus evidence links |
| persistence | What state must survive process or session death? | canonical event/store state and artifacts |
| recovery | How does interrupted work resume without duplicate or lost effects? | continuation, lease, command receipt, reconciliation state |
| backup | Can retained state be restored after loss or corruption? | versioned copies plus tested restore procedure |
| disaster recovery | How does the implementation resume after site/system-scale failure? | recovery plan, replicated essentials, recovery evidence |
| privacy | What may be collected, used, revealed, retained, exported, or erased? | classification, purpose, access, retention, redaction, deletion policy |

The same underlying event may participate in several concerns, but each has
different retention, access, fidelity, and presentation needs.

## Audit audiences and decisions

The correct audit view begins with the decision its reader must make.

| Reader | Needs to determine | Useful default view |
|---|---|---|
| individual operator | What happened to my work and why? | plain-language episode receipt and replayable timeline |
| affected user | What did the system use or change about me? | subject-centered activity and consent history |
| executor / engineer | Where did execution diverge or fail? | correlated event trace, tool calls, state transitions, artifacts |
| verifier / reviewer | Were acceptance claims independently established? | criterion-to-evidence matrix and provenance graph |
| manager | Were duties, approvals, and handoffs followed? | workstream timeline, exceptions, decisions, unresolved risk |
| service owner / SRE | Is the system reliable and recoverable? | health, failure/retry topology, queues, leases, recovery objectives |
| security investigator | Was access authorized; was anything exposed or changed? | identity/authority/effect graph, access events, integrity chain |
| privacy lead / data subject | Was data processed for an allowed purpose and retained correctly? | purpose/use/export/deletion ledger scoped to a subject or class |
| internal auditor / compliance | Did controls operate over the selected period and population? | control-to-evidence matrix, samples, exceptions, attestations |
| IT director | Can the implementation be governed, retained, restored, and supported? | deployment/data-flow map, control coverage, restore and DR evidence |
| executive / board / CFO | What material exposure, loss, control failure, or trend exists? | aggregated risk and exception view with drill-through to evidence |
| regulator / external assessor | Can a bounded claim be substantiated without revealing unrelated data? | signed/exported audit package with scope and redaction manifest |

No audience receives greater access merely because its visualization is more
senior. Aggregate views retain drill-through lineage without exposing raw
content to unauthorized readers.

## Canonical audit record

Audit should primarily reference the event store and evidence graph rather
than copy every payload into a second truth. A candidate envelope is (note:
`occurredAt`/`recordedAt` are ISO strings here while the pinned EventEnvelope
uses numeric log time — reconcile the two representations when this envelope
is pinned):

```ts
type AuditRecord = {
  recordId: string;
  schemaVersion: string;
  occurredAt: string;
  recordedAt: string;
  actor: { actorId: string; kind: string; episodeId?: string };
  subjectRefs: string[];
  action: string;
  resourceRefs: string[];
  workstreamId?: string;
  correlationId: string;
  causationId?: string;
  objectiveRef?: string;
  workOrderRef?: string;
  authority: {
    envelopeRef?: string;
    decision: "allowed" | "denied" | "not-required";
    approverRefs?: string[];
    policyRefs: string[];
  };
  inputRefs: string[];
  outputRefs: string[];
  evidenceRefs: string[];
  result: "succeeded" | "failed" | "partial" | "cancelled" | "unknown";
  effect: { type: string; targetRef?: string; reversible?: boolean };
  runtime?: { adapter: string; model?: string; version?: string };
  dataClasses: string[];
  purposeRefs: string[];
  retentionClass: string;
  integrity: { previousHash?: string; contentHash: string };
  redactionState: "none" | "masked" | "sealed" | "removed-by-policy";
};
```

This is not a demand that every action populate every field. Required
properties depend on action class. A help lookup does not need the record
weight of a production deletion; a denied attempt may need more security
detail than a successful inert query.

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
- evidence strength, dissent, uncertainty, and verifier independence;
- reversibility, rollback/compensation, and recovery outcome;
- data classification, purpose, consent/legal basis where applicable;
- retention, hold, export, redaction, and deletion events;
- integrity linkage and gaps, including `unknown` rather than invented detail.

Prompt text, chain-of-thought, credentials, and complete sensitive payloads are
not default audit fields. Prefer typed decisions, inputs, tool/effect records,
result summaries, and references to separately controlled artifacts.

## Fidelity levels

| Level | Content | Typical use |
|---|---|---|
| L0 receipt | outcome, scope, time, actor, evidence/record link | everyday confirmation |
| L1 narrative | ordered explanation of major decisions and effects | operator, manager, support |
| L2 control view | authority, approvals, policy evaluations, exceptions, evidence | audit, security, compliance |
| L3 technical trace | state transitions, commands, tool results, retries, timings, hashes | engineering and incident response |
| L4 governed raw | complete retained event envelopes and allowed artifacts | forensic reconstruction under restricted access |

Higher fidelity is not automatically better. Each level has an audience,
purpose, access rule, retention class, and known omissions. Every lossy view
links to the records it summarizes and states whether deeper data exists,
expired, was never collected, or is access-restricted.

## Audit projections and visualizations

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

Filters include time, implementation, workstream, episode, actor, role,
subject, action/effect, resource, policy, authority decision, evidence status,
data class, purpose, retention class, runtime/model, result, severity, and
correlation/causation chain. Saved filters are views, never hidden policy.

## Persistence and recovery classes

| Class | Examples | Recovery posture |
|---|---|---|
| canonical | event log, definitions, authority/policy versions, continuations | transactional append, integrity checks, tested point-in-time restore |
| effect coordination | command receipts, idempotency keys, leases, outbox/inbox | recover before redispatch; reconcile ambiguous effects |
| evidence | test results, findings, source hashes, approvals | immutable references, staleness propagation, retention by claim/risk |
| artifacts | code, documents, media, exports | content-address or version; regenerate where provably possible |
| projections | Markdown, dashboards, indexes, ratings, narratives | disposable and rebuildable from canonical sources |
| diagnostics | verbose traces, debug logs, metrics | short-lived by default; sampled and separately access-controlled |
| secrets | credentials, tokens, private keys | dedicated secret store; never event payload or unprotected backup |

Recovery distinguishes **known-not-applied**, **known-applied**, **ambiguous**,
and **compensated** effects. A restart replays state, reconciles outstanding
commands, preserves the original correlation chain, and records recovery as
new events; it never edits history to make the run look clean.

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

Every implementation declares recovery point objective, recovery time
objective, retention, backup frequency, encryption/key ownership, residency,
restore prerequisites, and the date/result of its last restore and disaster
exercise. “Backups configured” is not evidence until restoration succeeds.

## Privacy and minimization

Auditability can conflict with privacy if “record everything” becomes the
default. DotLn should instead apply:

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
cryptographically rendering inaccessible the sensitive payload. Hashes are
not automatically anonymous when the input space can be guessed.

## Policy dimensions implementations can customize

Each implementation can define audited action classes and required properties;
diagnostic verbosity and sampling; access to fields, views, and exports;
evidence sufficiency; integrity and signing; storage, residency, encryption,
and key ownership; retention, deletion, holds, and archival; backup, RPO/RTO,
restore, and DR cadence; privacy purposes and subject handling; alerts,
exceptions, attestations; and interoperability/export schemas.

These are local doctrine compiled through shared DotLn contracts. A personal
implementation and a regulated organization receive the same legos without
pretending they need the same control burden.

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
7. only then add organizational dashboards, regulatory mappings, replication,
   or specialized archives demanded by an implementation.

