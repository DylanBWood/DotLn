# `@dotln/skeleton` 0.2.0

The walking-skeleton component first shipped in application release `v0.2.0`.

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

The timeline should include `CommandResult`, one `DeletionAttempted` followed
by `CommandRefused`, `VerificationCompleted`, `QueuedPulseNoOp`, and
`SchedulesCancelled`. The glyph line begins with `🐛 Repo Gardener` and ends
with `💤 faded/cancelled`.

Run the executable evidence suite with `npm test`. It covers live-versus-
replayed decision identity, trace-tamper resistance, structural deletion
refusal, executed scheduler cancellation, and crash/restart redispatch with
adapter deduplication.

The loadout shape is deliberately non-normative for v0.4.0. The fake adapter
deduplicates by the kernel-generated command id so crash recovery can safely
re-dispatch pending outbox commands.
