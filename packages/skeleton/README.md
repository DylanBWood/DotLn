# `@dotln/skeleton` 0.4.0

The walking-skeleton component first shipped in application release `v0.2.0`.
Its component version was corrected forward from `0.2.0` to `0.3.0` on
2026-09-02 to record the audit projection module that shipped in application
release `v0.3.0`; published manifests remain historical truth.
The component advances to `0.3.1` in application release `v0.3.5`: the existing
grant decision slot now records the successful authority trace, and operator
return revokes inspection through a real predicate condition.
Component `0.3.2` is staged for application release `v0.3.6`: the live host and
JSONL replay now drive one pure `seiriReactor`, the full `Decision` sequence and
semantic projections match, and derived skeleton events carry canonical cause
and pulse-or-command correlation links.
Component `0.4.0` is staged for application release `v0.4.0`: the reactor now
consumes the pure composition compiler's normalized Seiri program. Five linked
supports emit the bounded WorkOrder, permission guard, evidence schema,
absent-only cadence/statechart guard, and verifier episode with declared cost.

The deterministic Repo Gardener + Seiri vertical. It compiles a typed
`LoadoutGraph` into a bounded `WorkOrder` and related runtime mechanisms, runs
them against a fake fixture-repository executor, structurally refuses deletion,
independently verifies candidates, handles operator return, and renders text
plus glyph projections from the JSONL event log.

`scenario.ts` owns the nondeterministic edge: fixture executor, verifier,
scheduler, append loop, and effect execution. Every appended event is stepped
through the same `Reactor<RuntimeState>` exported from `reactor.ts`.
`replayScenario(log)` decodes the log and calls the kernel's `replay()` with
that reactor; it does not reimplement the event branches or return adapter-only
state that replay cannot reconstruct.

Run from the repository root:

```sh
npm install
npm run skeleton
```

The command builds all three workspace packages, runs the deterministic scenario,
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
The causal timeline ordering and correlation groups consume producer-recorded
links where the current audit fold supports them. The structural-refusal
association still uses its labeled adjacency fallback; replacing that final
heuristic with the canonical cause is nominated as follow-on work. The audit
fold itself remains unchanged in this release.

Add `-- --compiled-diff` to print the three equivalent-view hashes and the
compiled RPG item tooltip. It names the exact grants, restrictions, obligation,
passive activation, pulse, interrupt, and per-support cost. The flag is additive
and composes deterministically with `--audit`.

The original numbered event timeline should include `CommandResult`, one
`DeletionAttempted` followed by `CommandRefused`, `VerificationCompleted`,
`QueuedPulseNoOp`, and `SchedulesCancelled`. The glyph line begins with
`🐛 Repo Gardener` and ends with `💤 faded/cancelled`.

Run the executable evidence suite with `npm test`. It covers complete
live-versus-replayed `Decision` identity, successful-grant evidence, semantic
payload tamper sensitivity, the rejected-verification fixture and its
`○ unverified` glyph, structural deletion refusal, executed scheduler
cancellation, exact default and `--audit` CLI output, and crash/restart
redispatch with adapter deduplication. The audit tests additionally pin
action-class questions and required references, exercise all three projections,
prove refusal visibility, canonical causal ordering, and correlation grouping,
and require byte-identical output over the live log, its re-encoded form, and
an independently re-run scenario log.

The v1 graph, support, link, normalization, and semantic-hash shapes are pinned
in `@dotln/compiler`; compile semantics remain intentionally bounded to Seiri.
The fake adapter deduplicates by the kernel-generated command id so crash
recovery can safely re-dispatch pending outbox commands.
