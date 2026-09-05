# `@dotln/skeleton` 0.6.0

The walking-skeleton component first shipped in application release `v0.2.0`.
Its component version was corrected forward from `0.2.0` to `0.3.0` on
2026-09-02 to record the audit projection module that shipped in application
release `v0.3.0`; published manifests remain historical truth.
The component advances to `0.3.1` in application release `v0.3.5`: the existing
grant decision slot now records the successful authority trace, and operator
return revokes inspection through a real predicate condition.
Component `0.3.2` shipped in application release `v0.3.6`: the live host and
JSONL replay now drive one pure `seiriReactor`, the full `Decision` sequence and
semantic projections match, and derived skeleton events carry canonical cause
and pulse-or-command correlation links.
Component `0.4.0` shipped in application release `v0.4.0`: the reactor now
consumes the pure composition compiler's normalized Seiri program. Five linked
supports emit the bounded WorkOrder, permission guard, evidence schema,
absent-only cadence/statechart guard, and verifier episode with declared cost.
The component remains `0.4.0` for application release `v0.4.1`; only its exact
`@dotln/kernel` dependency advances to `0.2.1`, and no skeleton source changes.
Component `0.5.0` shipped in application release `v0.5.0`: the host compiles
the Entropy Reducer identity, planning-reviewer role, Shine active, Standardize
link, seven additional supports, tracked/control-plane-read-only wildcard
authority with bounded scratch and intake-capture writes, once cadence, typed
manual Program, output/refutation validators, and generated residue. The
review is operator-mediated because kernel `Program.All` remains deferred; no
model transport was added.

Component `0.6.0` is staged for application release `v0.6.0`: the optional
Beacon edge emits exact metadata projections and a separately labeled fake
executor claim. Kernel, compiler, reactor, and audit projection code are
unchanged; the default stdout changes only the package-version banner.

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
in `@dotln/compiler`. Compile semantics remain deliberately bounded, but now
cover both Seiri and the claim-free terminal prefix globs used by the Entropy
Reducer; participating wildcard claim targets and mixed
wildcard/participating-authority-claim graphs still refuse, while unequipped
catalog definitions remain inert.
The fake adapter deduplicates by the kernel-generated command id so crash
recovery can safely re-dispatch pending outbox commands.

## Beacon metadata projection

```sh
npm run skeleton -- --beacons .beacons
```

`--beacons <directory>` is explicit and composes with `--audit` and
`--compiled-diff`. Without it, the CLI creates no files. Inside this repository
the destination must already be gitignored (`/.beacons/` is supplied); paths
under `docs/intake`, including aliases through symlinks, refuse. A directory
outside the repository is also accepted. Writers replace only their stable
addresses and do not purge unrelated or historical files in a reused directory.

Each host file holds the latest matching L0 receipt inside a
`BeaconProjectionRecord`, with the episode's cumulative refusal count capped at
three. One pure encoder derives its UTF-8 JSON, trailing-newline padding,
codeword byte size, and event-time mtime. A fixed SHA-256 producer/scope address
contains no status/version spelling and is not an anonymity or authentication
guarantee. Before `CommandResult` exists, the fake executor writes its own
`BeaconClaimRecord` claiming `verification/passed`. That claim has a distinct
address and does not update the host projection or canonical log.

The reader performs directory enumeration and non-following metadata lookups
only. It never opens beacon content; unreadable or garbage content at the same
size decodes identically. Links and other non-regular entries are malformed.
The constellation groups the declared lifecycle categories by size, then
address. Classes can recur, so size order is not chronology. The demo's two
rows are:

| Bytes | Virtual mtime (UTC)      | Class/outcome            | Refusals | Provenance     |
| ----- | ------------------------ | ------------------------ | -------- | -------------- |
| 37216 | 1970-01-01T00:20:00.001Z | verification/passed      | 0        | self-reported  |
| 49764 | 1970-01-01T00:20:00.007Z | external-effect/observed | 1        | host-projected |

The host's last receipt is the existing `schedule.cancel` observation after the
queued no-op. No artificial terminal event is added. Dates are 1970-relative
because both events and the fake claim use virtual milliseconds. `3+` in a
listing means at least three refusals. Malformed sizes and reserved future
codebooks are labeled without guessing state.

The [normative v1 data](../../docs/product/02-domain-model.md#beacon-codebook-v1)
assigns 104 states, all at most 51,064 bytes, without sparse files. Oversized
records and unrepresentable times refuse before publication. The edge stages
each complete file in a private sibling directory, verifies exact size and
mtime, and atomically renames it to its stable address; staging is removed on
normal completion/failure. This is per-file atomicity, not an all-directory
snapshot or crash-durable storage. The canonical log rebuilds host projections;
edge-only claims are outside live/replay identity.

The [probe record](../../docs/discovery/beacon-probe-2026-09-04.md) includes a
Node timestamp-conversion correction and measured permissions, sparse logical
size, names, links, and xattrs. The suite exhausts every integer through twice
the largest v1 codeword, compares live/replay files with `cmp`, observes denied
content reads, proves claim isolation before results, and watches concurrent
atomic replacements. Metadata intentionally discloses codebook fields,
existence, correlation, and recency; content permissions do not hide it.

[WO-021](../../docs/work-orders/WO-021-control-plane-beacons.md) is the nominated
next increment for control-plane output, cross-worktree sweeps, authorized
`BeaconObserved` events, staleness, and group composites. Real-worker liveness
remains with WO-009. Neither milestone alone proves the concept useful; the
[proposed operator comparison](../../docs/planning/beacon-usefulness-checkpoint.md)
remains a separate evidence step.
