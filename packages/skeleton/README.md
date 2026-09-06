# `@dotln/skeleton` 0.10.0

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

Component `0.6.0` shipped in application release `v0.6.0`: the optional
Beacon edge emits exact metadata projections and a separately labeled fake
executor claim. Kernel, compiler, reactor, and audit projection code are
unchanged; the default stdout changes only the package-version banner.

Component `0.7.0` shipped in application release `v0.8.0`: lifecycle v2
Beacons, bounded phase-group files, guarded recorded sweeps, and replayed age
glyphs join the existing edge. Kernel/compiler source and dependencies remain
unchanged. The ordinary fake scenario still changes stdout only at its version
banner; Beacon glyphs appear only when observation events are present.

Component `0.8.0` is staged for application release `v0.9.0`: equip payload v2 pins a separate compiler artifact identity, all compiled consumers share a fail-closed comparison, and L0/governed-raw views project the receipt. The event envelope and compiled-program contract remain version 1; the compiler package advances separately to `0.3.0`. The new default timeline is pinned in `fixtures/wo029-cli.txt`; the WO-003 trace oracle and WO-020 CLI fixture remain historical artifacts.

Component `0.9.0` is staged for application release `v0.10.0`, above published
`v0.9.0`: two real disposable CLI transports share the deterministic demo's
executor seam, backed by a durable JSONL host, explicit leases, safe worktree
recovery and read-only status. Compiler `0.3.0` and kernel `0.2.1` are unchanged.

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

`LiveReactorDriver.equip(graph, environment, at)` is the host factory. Successful equips record `{ payloadVersion: 2, graph, artifactIdentity }`; failed compilation records `ArtifactCompilationRefused` and a decision instead. `feed` rejects caller-supplied legacy equip shapes. Before any new external input, `ensureIdentityEnforcement(at)` appends exactly one canonical `ArtifactIdentityEnforcementStarted` with `{ payloadVersion: 1 }`. Restoring a log is read-only; the next input performs the cutover. A legacy graph may replay before that boundary, with identity unavailable, but cannot originate later compiled decisions until an explicit v2 re-equip.

The reactor starts with no authority. It recomputes an equip before storing its graph, pin, environment, and authority together. `withEquippedArtifact` owns every later compile/compare, including cadence, WorkOrder, authority, continuation, verification, and recovery dispatch. The host persists one `DecisionRecorded` per consuming decision with the exact pinned semantic hash, compiler contract/package versions, and equip-event reference. The recovery request is checked before adapter dispatch; replay never calls an adapter. Refused or incomplete replay returns `workOrder: null` when no WorkOrder was emitted.

Refusals are `ArtifactIdentityUnavailable`, `ArtifactIdentityInvalid`, `ArtifactIdentityDrift`, `ArtifactCompilationRefused`, and `UnknownScheduleRefused`. Their version-1 payloads carry reason, source/equip references, pinned and observed identities when available, drift axes, and typed diagnostics. The host persists the inert refusal continuation automatically. Identity failures remove usable authority and require re-equip; an unknown schedule leaves the valid equip intact. A pulse has no issuance stamp: an old pulse whose id is reused after re-equip remains indistinguishable. This is deterministic agreement, not authenticity, collision resistance, or proof against hidden adapter effects or a writer replacing graph and pin together.

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
links. Structural refusals now prefer a scoped canonical source link and its matching authority trace, retaining the labeled adjacency fallback for unlinked historical input. The L0 and governed-raw `artifactIdentity` section shows successful recorded comparisons, unverified equip claims, historical unavailable identities, and each refusal through canonical event links. Full environment inputs, definition hashes, and diagnostics remain in governed raw. Cryptographic integrity, authenticity, and outer-confinement evidence remain unavailable; the existing Beacon action codebook is unchanged.

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

## Disposable workers

The opt-in demo replaces only the fixture executor with one real CLI episode.
The inventory is synthetic and mounted as a host-read projection; models have
no tools and cannot write the repository. The verifier and other demo actors
remain deterministic fakes. A completed worker envelope is a self-report;
the fake verifier still checks the candidate and deletion remains refused.

Use an authenticated runner that permits child CLI execution. The observed
versions are Claude Code `2.1.261` and Codex CLI `0.153.4`; other versions refuse
until their canonical profile is re-probed. Each store pins its first model,
effort and transport. An unavailable model fails closed and leaves its command
pending. The following stores live under the gitignored `/.runtime/` root:

```sh
DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- demo --store .runtime/claude --transport claude-cli-print --model claude-sonnet-5 --effort high --beacons
DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- demo --store .runtime/codex --transport codex-cli-exec --model gpt-6-astra --effort unknown --beacons
```

Successful stdout is one six-field JSON envelope. Raw harness output is bounded
in private temporary capture and discarded. Typed results, receipts and canonical
events stay in the store; optional Beacons are projections plus a separately
labeled worker claim. CLI-owned authentication never enters the prompt or log.
Codex ignores user configuration and has no observed dedicated effort selector,
so this transport requires `unknown` even if the operator's own session has a
persisted effort setting. Launch claims are distinct from effective readback.

During a run, use a second terminal:

```sh
npm run dotln --silent -- status --store .runtime/claude
npm run dotln --silent -- status --store .runtime/claude --json
```

Status folds events only: episode phases, host heartbeat/lease timestamps,
pending commands and eight recent event headers. It neither checks the live
clock nor appends expiry events. The host checks process existence every second,
expires a missed five-second lease, and enforces a three-minute invocation
deadline. Process existence does not prove model progress.

After interruption, rerun the exact demo command once the lease has expired.
The host keeps the compiled WorkOrder, continuation, pending command and clean
detached worktree. Recovery either starts a new physical episode or queries the
durable completed-result receipt; it never silently changes the selected model.
A completed demo can be queried again without dispatch. Cleanup refuses dirty,
untracked or ignored files, changed bases, aliases and foreign worktrees. Torn
logs, invalid locks and an abandoned `host-lock-recovery` guard require inspection;
the command does not erase them. This is an idempotent read-only inspection
protocol, not a transaction mechanism for external writes.

The always-run suite launches synthetic subprocess peers and real Git worktrees;
it needs no authentication or model access. The separate live gate and bounded
capability probe are reproducible commands:

```sh
npm run probe:workers -- --sandbox
DOTLN_LIVE_WORKERS=1 npm run test:workers:live -- --claude-model claude-sonnet-5 --codex-model gpt-6-astra --evidence .runtime/live-evidence.json --kill-first
```

Create `.runtime` before using the live gate's evidence path if no demo has done
so. The gate forces one Claude termination, witnesses status from another CLI,
recovers a fresh episode, then runs Codex. See the
[acceptance evidence](../../docs/evidence/WO-009/README.md) for observed envelopes,
failure rows, launch controls and the boundary of this implementation.

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
`BeaconProjectionRecord`, with the episode's authority-decision denial count capped at
three. The separate artifact-identity receipts and refusals are not encoded by this v1 action codebook. One pure encoder derives its UTF-8 JSON, trailing-newline padding,
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

WO-009's real-worker liveness comes from host process checks and recorded leases;
its optional worker Beacon remains a separately labeled self-report. Neither Beacon milestone alone proves
the concept useful; the
[proposed operator comparison](../../docs/planning/beacon-usefulness-checkpoint.md)
remains a separate evidence step.

## Senses

Component `0.10.0` prepares application `v0.11.0`, with compiler `0.4.0` and
unchanged kernel `0.2.1`. Beacon Sight, Fine Spectrum and Composition compile
as ordinary perception supports. The host's `beacon-perception-v1` profile
provides finite metadata mounts and excludes narrative, write and model-tool
surfaces. Compilation and `projectBeaconSparseTwin` expose the same permission
decision used by `observeBeaconSweep`; a missing sense or grant yields a
recorded refusal with no Beacon read.

`renderBeaconPerception` emits one JSON line for the bounded individual set,
and one extra line each for equipped Fine Spectrum and Composition. Absent
supports say `not-sensed`; whole-second mtime cannot disclose the finer field.
The reader uses only status calls on the host's known basenames. It never
enumerates directories, opens content or reads xattrs. `MountedBeaconVerifier`
plugs into `runScenario` or `finishScenario` and completes the deterministic
verification episode using candidate paths, an independent inventory projection
and authorized Beacon fields; implementer summaries/evidence prose stay in the
host log. This does not add a native model verifier.

Individual v3 adds a non-secret 8-bit key epoch and a 16-bit keyed consistency
residue. Labels are `residue-matched`, `forged-provenance`, or
`unverifiable-provenance`; legacy versions remain `unauthenticated-legacy`.
The residue does not prove authorship or resist enumeration by an actor with
decoder/path access. A configured external `DOTLN_BEACON_KEY_FILE` selects v3
in the lifecycle emitter and keyed checks in the agent CLI. The key helpers
refuse repository paths and non-private files; rotation increments the epoch
and refuses at 255. Reopen a long-lived handle after rotation.

V3 is sparse-required: at most a 4,096-byte JSON prefix, then a logical zero
tail. Its entire 1,236,950,589,434-byte maximum is freshly probed on the target
device with at most eight 512-byte allocated blocks. The writer never densely
pads v3 or falls back after a failed premise. The existing individual v1/v2
encodings and separate phase-group family retain their meanings. See the
[normative codebook](../../docs/product/02-domain-model.md#beacon-codebook-v3--weak-keyed-provenance),
[host request/runbook](../../docs/product/07-execution-guide.md#operator-resume-phrases--how-you-get-dispatched),
and [WO-022 evidence](../../docs/evidence/WO-022/README.md).

## Control-plane Beacons

Every appended resume transition writes a dense v2 projection, or sparse v3
when the host explicitly supplies its external key, inside ignored
`.control-beacons/public/` and `verifier/`, with canonical transition mtime.
The verifier whitelist excludes claims and narrative. Optional session-specific
restricted projections are provisioned by the host; only the matching
capability-bearing `resume next` briefing discloses their separate random path.
Projection failure warns without undoing or repeating a recorded transition.

```sh
npm run worktree -- constellation
```

This read-only command prints lifecycle-ordered metadata from all worktrees,
then a group row. It reads no Beacon content and appends no event. Groups sum
at most twelve host-projected members; a missing/mismatched cache is labeled
as a group derived from this sweep. Individual v2 supports 288 states with a
maximum 81,833 dense logical bytes. The independent group family can reach
192,763,452,654 logical bytes with zero observed data blocks; emission verifies
at most one filesystem block. Dense hosts refuse groups beyond the freshly
reproduced logical ceiling. Never copy or open a huge sparse group as content.

```sh
npm run worktree -- constellation --agent <host-request.json> --log docs/observations/<name>.jsonl
```

After a current build, this form consumes an explicit host envelope, equipped
senses and metadata mount profile (see Senses above), and records
the Observe request through the pure reactor. The existing guard checks the
`observe.beacons.public` or `.verifier` effect before any Beacon metadata read.
Refusal yields no perception; allowance persists the command, one
`BeaconObserved`, then its result. Replay uses captured metadata and event time
to derive fresh/stale/absent/skew labels and the same glyph scene. The default
`Cadence.After` threshold is 20 minutes; a host request declares its own value.
See the [request/runbook contract](../../docs/product/07-execution-guide.md#operator-resume-phrases--how-you-get-dispatched)
and [normative data](../../docs/product/02-domain-model.md#beacon-codebook-v2--control-state).

The [evidence receipt](../../docs/evidence/WO-021/README.md) includes exhaustive
codebooks, permission/replay fixtures, bounded storage and read comparisons.
On the measured warm-cache full-status workload, a single JSON index stayed
faster than individual metadata sweeps with one, two, and four readers. This
does not measure a writer, a production workload, or operator usefulness.
Payload-free scans remain visible to sufficiently privileged OS monitoring;
same-user filesystem access and provenance spoofing are outside this boundary.
