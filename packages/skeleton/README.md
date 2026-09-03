# `@dotln/skeleton` 0.3.1

The walking-skeleton component first shipped in application release `v0.2.0`.
Its component version was corrected forward from `0.2.0` to `0.3.0` on
2026-09-02 to record the audit projection module that shipped in application
release `v0.3.0`; published manifests remain historical truth.
The component advances to `0.3.1` in application release `v0.3.5`: the existing
grant decision slot now records the successful authority trace, and operator
return revokes inspection through a real predicate condition.

The deterministic Repo Gardener + Seiri vertical. It compiles a provisional,
hand-assembled loadout into a bounded `WorkOrder`, runs it against a fake
fixture-repository executor, structurally refuses deletion, independently
verifies candidates, handles operator return, and renders text plus glyph
projections from the JSONL event log.

Run from the repository root:

```sh
npm install
npm run skeleton
```

The command builds both workspace packages, runs the deterministic scenario,
then prints its numbered JSONL-derived event timeline and a one-line glyph
scene. The final receipt should be:

```text
verified=true candidates=1
```

Add `-- --audit` to capture the audit projections, introduced in v0.3.0, over
that same live log:

```sh
npm run skeleton -- --audit
```

The optional output contains the complete L0 receipt, causal timeline, and
governed raw JSON projection before the unchanged final receipt. L0 links to the
timeline, the timeline links to governed raw, and each lossy view names its
omissions. The raw view labels access as restricted intent with enforcement
deferred; it does not claim the access-control work deferred to a later rung.
The step-9 deletion entry shows `repo.delete`, `denied`, `auth_seiri`, and its
canonical event evidence without assigning a command ID to the refused intent.

The original numbered event timeline should include `CommandResult`, one
`DeletionAttempted` followed by `CommandRefused`, `VerificationCompleted`,
`QueuedPulseNoOp`, and `SchedulesCancelled`. The glyph line begins with
`🐛 Repo Gardener` and ends with `💤 faded/cancelled`.

Run the executable evidence suite with `npm test`. It covers
live-versus-replayed decision identity, successful-grant evidence, semantic
revocation after operator return, trace-tamper resistance, structural deletion
refusal, executed scheduler cancellation, and crash/restart redispatch with
adapter deduplication. The audit tests additionally pin action-class
questions and required references, exercise all three projections, prove refusal
visibility, causal ordering, and correlation grouping, and require
byte-identical output over the live log, its re-encoded form, and an
independently re-run scenario log.

The loadout shape is deliberately non-normative for v0.4.0. The fake adapter
deduplicates by the kernel-generated command id so crash recovery can safely
re-dispatch pending outbox commands.
