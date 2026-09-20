# `@dotln/skeleton`

For application v0.32.1 (WO-143), a killed resident can recover an abandoned
lock-acquisition guard after inspecting the store. Complete owner publication
and serialized dead-owner reclaim cover both lifetime and append locks. Live,
unreadable and legacy ownerless guards still refuse. The store error names the
guard path; the `dotln` commands print only their redacted refusal, so inspect
`host-lock-recovery` in the store and in its `.resident-append` directory.
[Crash fixtures](test/resident.test.ts) and
[implementation evidence](../../docs/evidence/WO-143/implementation.md) state
the tested boundary.

For application v0.28.0 (WO-052), a source-change host turns one compiled
WorkOrder into one governed branch worktree in a target repository: it emits
the bundle, records the focused test before and after, dispatches the
source-change transport, and saves the observed commit identity as an
immutable effect receipt so recovery reads Git instead of dispatching a second
writer. The runbook is [Source-change host (WO-052)](#source-change-host-wo-052).

For application v0.25.0 (WO-049), target-worker bundles use the launchpad's
immutable runtime and keep journals and writer reservations outside the target.
See [Target worktree bundle](#target-worktree-bundle).

For application v0.23.0 (WO-068), an operator-started resident host folds one
launchpad log, records every wall-clock sample and explicit presence change as
an event, and drives the compiled presence statechart through the interpreter
it now shares with the WO-067 fixtures. When a phase allows it, the host
dispatches one bounded `script` episode through the actor catalog; `cli-worker`,
`human-handoff` and `local-model` report their own reasons when unavailable and
never fall back to another kind. `dotln resident` and `dotln presence` are the two new
commands, `--once` runs one complete cycle for an outside scheduler, and a
restart records an unobserved episode lost rather than dispatching its identity
twice. The runbook is [Resident host](#resident-host).

For application v0.22.1 (WO-133), runtime advisories appear once per session and
cause, with silent PostToolUse observers and a SessionStart diagnostic. Release
close and worktree finish refresh stale pinned runtime bytes after advancing
main. All six roles preserve operator-supplied model and effort, and the shared
`src/version.ts` keeps release-only changes out of machinery suite selection.
The compiler prelude advances separately to `0.11.2`; contracts stay unchanged.

For application v0.22.0, every skeleton replay path passes `projectRuntimeEnvironment` from `reactor.ts`. The skeleton owns its RNG and policy state layout; complete decisions and serialized bytes remain identical to the kernel fallback.

For application v0.21.0, a persisted continuation is decoded before the reactor folds it. `seiriReactor` decodes `state.program` on every event and `verificationStateFromRuntime` decodes the stored verification continuation, so a deferred Program kind or a malformed node refuses with a code and JSON path, prefixed `runtime program:` or `verification continuation:`, before a command is dispatched or a result is consumed. The kernel type those reads produce is `ExecutableProgramV1`.

For application v0.20.0, hook input is positively decoded before ordinary host work. `decodeHarnessInput(value, expectedEvent?)` returns the kernel `DecodeResult` shape, validates every declared input field and the configured event, and retains unconsumed native metadata. `tool_name` is a string; `tool_input` and `tool_response` are objects. Invalid JSON and malformed fields use the event's existing protocol response with a code and JSON path. PreToolUse denies; prompt submission remains accepted with a diagnostic, and PostToolUse/Stop report the failure. The generated entry preserves valid `analysis:` and `operator override:` recovery even when the built runtime is unavailable.

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

Component `0.27.0` adds bounded source-writing repair (`WO-055`).
`deriveRepairOrder` in `src/repair.ts` resolves a finding against pinned host
witnesses, contains its paths and exact reproduction commands, and preserves the
original contract and effective authority. Exact expansions require a matching
host registry grant with WO-042 provenance. `RepairHost` in `src/repair-host.ts`
consumes that interface through a persisted executable program in the shared
reactor, with WO-052 source-change and WO-054 verification child stores.

The original order declares `roundLimit` (default two); exhaustion records the
last finding in `RepairExhausted` and leaves the next action to a human. Each
repair starts a fresh worker at the failing commit using `executionBaseCommit`,
while the original contract base stays unchanged. The host runs all derived
reproduction commands and re-verifies the complete original contract. A child
commit or prepared verification snapshot survives host death without another
repair dispatch. Stores and worktrees remain inspectable; cleanup is explicit.

Run `npm run build` then
`node --test packages/skeleton/dist/test/repair.test.js` for containment,
exact grants, one-round success, two-round exhaustion and actual host SIGKILL
fixtures. These use synthetic workers, real scratch commits and macOS confined
checks. This is not WO-056's live model loop. See
[WO-055 evidence](../../docs/evidence/WO-055/implementation.md).

## Reactor state slices

`reactor.ts` composes `SkeletonState` version 1 from typed walking-skeleton,
worker-episode, verification, feedback, resident and source-change slices.
Each event selects one fold
by its active workstream mode and event type; unknown observations stay in that
mode. WO-052 implements the reserved `sourceChange` slot with its pure fold.
Kernel deciders remain owned by the one exported `seiriReactor`.

The operator selected the existing flat `RuntimeState` as the public Decision
compatibility boundary. Pure adapters expose typed slices internally and write
only the selected slice back. The WO-050 extraction introduced no persisted
state or event changes; subsequent hosts add their own typed event contracts.
Hosts read exported selectors, including kernel predicate context. WO-047's
explicit replay projector has since landed and returns the same
`kernelStateFromRuntime` slice the live folds read, so public `rngState` and
`policy` stay at the top level and replay cannot drift from the live path.
The [WO-050 identity receipt](../../docs/evidence/WO-050/implementation.md)
compares complete Decisions and semantic projections without normalizing state.

## Resident host

WO-068 adds an operator-started local loop, independent of Contributor stages.
Its catalog runs declared scripts, CLI workers and human handoffs. It does not
derive or select work orders. The native script adapter requires macOS `sandbox-exec` and
refuses execution when that no-network boundary cannot start. No system daemon
or scheduler is installed.

Create a dedicated store directory and its `resident.json` containing:

```json
{
  "graph": "replace with your complete LoadoutGraph object",
  "environment": "replace with your CompilationEnvironment object",
  "policyId": "your.compiled.policy",
  "evidence": [],
  "actors": {
    "your-phase-id": {
      "kind": "script",
      "effect": "repo.inspect",
      "surface": "your-declared-surface",
      "resources": { "files": 1, "lines": 0, "tokens": 0 },
      "command": ["/absolute/path/to/executable", "literal-argument"],
      "cwd": "/absolute/path/to/worktree",
      "timeoutMs": 1000,
      "expectedStdoutSha256": "replace with the 64 lowercase hex digits of expected stdout"
    }
  }
}
```

This illustrates the shape; placeholder values are not executable. Supply one
actor for every phase, evidence required by the policy, and all scope/budget
resource keys, including zero amounts. The graph compiles before use; select
the same policy id at launch. Current live capabilities include `actor.script`,
`actor.cli-worker` and `actor.human-handoff`;
other required capabilities need a host binding and are refused by this CLI.
Arguments are passed literally without a shell. Scripts inherit no operator
environment or stdin; a language runtime may create its own environment keys.
The timeout is 1–180,000 ms, combined output is bounded to 65,536 bytes, and
only stdout's digest and first line (160 characters) enter the event log.
Use commands whose first line is appropriate to retain. Exit zero plus the
expected stdout hash is the bounded verification contract.

```sh
npm run build
node packages/skeleton/dist/src/dotln.js resident --store .runtime/my-resident --policy your.compiled.policy --tick 1000
node packages/skeleton/dist/src/dotln.js presence away --store .runtime/my-resident
node packages/skeleton/dist/src/dotln.js presence back --store .runtime/my-resident
```

An outside scheduler can invoke one cycle with:

```sh
node packages/skeleton/dist/src/dotln.js resident --store .runtime/my-resident --policy your.compiled.policy --once
```

`--once` waits for its bounded episode, records the outcome and exits. Loop
mode evaluates every tick after the previous episode drains. Return is observed
while an episode runs: `kill` terminates it; `finish` drains it without advancing
the reset policy. A new absence cannot overlap a finishing episode. Idle expiry
needs a fresh back/away edge. `SIGINT`/`SIGTERM` stop the loop after the bounded
cycle. SIGKILL leaves the log and worktree; restart inspects them, records an
unobserved episode lost and never dispatches that id twice. A complete dead-owner
lock-recovery guard is reclaimed after positive inspection. Torn logs, live or
unreadable owners, and legacy ownerless guard directories still refuse for
inspection without truncation. The store error names the refusing
`host-lock-recovery` path, but `dotln resident` and `dotln presence` print only
`worker host refused; inspect the store and declared environment before
retrying`. After that line, inspect `<store>/host-lock-recovery` and
`<store>/.resident-append/host-lock-recovery`. The guard is an atomic link to a prepared private owner directory; interrupted
preparation or cleanup may leave an unreferenced `.host-lock-*` directory, which
grants no ownership and does not prevent reopening. A recycled PID can still
look live and require inspection. This is local process-crash recovery, not a
power-loss or hostile same-user isolation guarantee. After actor cancellation,
polling takes no further append lock while waiting for the final outcome.

Configuration is immutable within a store; changing policy or scripts requires
a fresh store. Retain the old store for inspection. The store records paths and
commands supplied by its owner; use appropriate local storage. Resource
reservations and effect declarations are checked before execution; this adapter
does not measure actual file/line edits or replace source-change verification.
For `kind: "local-model"`, add `local: { endpoint, request }`: the endpoint is an
explicit `http://127.0.0.1:<port>` origin and the request is the existing
inspection `WorkerRequest`, whose effect must match the actor. Availability is
WO-110's declared `L-U1` row rather than a live probe, so an unavailable
endpoint yields a reasoned NoOp without contacting the operator's machine; the
shipped row is `unavailable`. One episode is one bounded HTTP request with no
child process and no supervisor, so cancellation ends it with the resident.
Writing and evidence requests are refused, and a local completion claim is never
independent verification. See the [availability row](../../docs/discovery/local-model-transport-2026-09-20.md).
The [fixtures](test/resident.test.ts) cover fake-clock replay and real local
process/network boundaries.

For `kind: "cli-worker"`, add `worker: { transport, request }`: transport is
`claude-cli-print` or `codex-cli-exec`; request is the existing `WorkerRequest`
or `WriterRequest` described below. The actor effect must match the request,
and its operations, reservations, evidence and expiry must fit the current
phase. Writer revocation event types must match the phase; conditional nested
revocation is not supported. Prepare the separate worktree and host-written
message before starting the resident. CLI authentication stays with the CLI.
The supervisor stamps the child, bounds the existing transport, and kills its
ordinary process group on resident death or cancellation. C-U1/X-U1 establish
the launch path, not authentication lifetime or hostile-process isolation.
`CliWorkerObserved` retains the envelope and launch claims, not raw output;
completion is a self-report and does not widen a presence phase.

For `kind: "human-handoff"`, add `handoff: { workOrderId, question, options,
evidenceRefs }`, where options are two to ten `{ id, label }` choices and
evidenceRefs is a nonempty array of local evidence references. Packets are
written under the resident store's `control/local/handoffs` directory. Read
the packet and submit the chosen option explicitly:

```sh
node packages/skeleton/dist/src/dotln.js handoff answer --store .runtime/my-resident --episode <packet-episode> --work-order <packet-order> --option <option-id>
```

The answer releases only that order's hold. Unknown, repeated or mismatched
answers refuse before append. A stale generation or expired policy cannot
resume from an old answer. The local store is the trust boundary; a model is
never selected to answer a handoff. The [WO-122 fixtures](test/resident-actors.test.ts)
exercise both request kinds, recovery and answers; its live row is collected
by `node scripts/evidence-resident-actors.mjs` on an authenticated runner that
permits outside-sandbox child CLI execution.

## Disposable workers

Recovery validates the log, lock, saved receipts, request keys and saved
verification capsules before reclaiming a dead host lock or dispatching. A
malformed file or leftover `.pending` result refuses with its path; preserve
the store and inspect that file before retrying. Pending bytes are never accepted
as a result or silently removed. Custom recovery callers must supply
`WorkerStore.acquire` with a read-only callback that calls `loadResult` with
each receipt's original request context. The shipped hosts reconstruct it from
the persisted command and caller's pinned fixture/model/mount. See the
[read-path inventory](../../docs/evidence/WO-048/read-paths.md).

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
logs, invalid locks and unreadable or ownerless `host-lock-recovery` guards
require inspection; the command does not erase them. A complete dead-owner
guard is reclaimed exclusively after the same positive store inspection as a
dead host lock. This is an idempotent read-only inspection
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

## Source-change transport profile

`WriterRequest` (`kind: "source-change"`) and `source-change-v1` add a bounded
writer branch to both CLI adapters. Inspection and Beacon profiles retain their
existing behavior. This API is the transport layer; it does not create target
worktrees, write commit messages or install target governance.

The host first supplies a compiled WorkOrder and authority envelope allowing
`repo.write` and `git.local`, with remote, credential, settings and sandbox
effects prohibited. `SOURCE_CHANGE_DENIED` names the required prohibitions;
every supplied allowance must stay local and non-conflicting. The transport
does not compile or grant this authority. The dispatching host still checks its
current expiry, revocations and resource budget.

Create the environment with `sourceChangeProfile({ worktree, worktreeParent,
launchpadCheckout, commitMessagePath })`. All paths must be canonical; the mount
must be a Git worktree root strictly within the parent, disjoint from the
launchpad. The host must already have written a regular message file inside the
worktree, with the target bundle's private-path exclusions in place. The returned
profile declares exactly one read-write mount and one writable surface.

Pass that profile and the WorkOrder, authority envelope, command (`Act` /
`repo.write`), artifact identity, episode, model/effort, cwd, `testCommand` and
`commitMessagePath` to either existing CLI transport. The test is one exact,
single-space-separated command; tokens admit letters, digits, `_`, `.`, `/`,
`-` and argument `=` only. The message path uses the same unquoted safe-path
alphabet without spaces or `=`. Shell operators, substitutions, quotes, wildcard
patterns and allowlist delimiters refuse. The declared command is host-owned
input, not proof that an arbitrary test program has no other effects.

Claude gets Edit/Write/Read and exactly three Bash patterns: the declared test,
`git add -A`, and `git commit -F <host message>`. Codex gets the `dotln-writer`
named workspace-write profile with network disabled and non-shell features
disabled. The prompt forbids changing `.claude/`, `.dotln/` or the message file.
It also explicitly authorizes bounded inspection of the assigned worktree:
native reads, or separately invoked literal read-only shell commands when
native read tools are unavailable. These instructions do not install a Codex
command classifier or expand Claude's three Bash patterns. A test may print
the diff for a Claude worker whose direct diff command is unavailable.
Tools-only Claude, Codex on-request approval and Codex hook expectations refuse
with C-W1, X-U2 and X-W3 respectively. Discovery-backed arrays and their limits
are in [the writing-worker record](../../docs/discovery/writing-worker-smoke-2026-09-14.md).

Claude's writer launch uses `--output-format json --json-schema <schema>` and
requires `structured_output`; display prose is never parsed as the result.
The target guard recognizes Claude's data-only `StructuredOutput` submission.
Codex retains its existing JSONL result path. The result retains the six-field envelope and adds host observations there:
`observedCommit` only when Git HEAD moved, and `observedDenials` (Claude's
reported denial-array count, or `unavailable` for Codex). Worker-supplied Git
identity is rejected. Completed prose with a dirty uncommitted tree remains
without a commit observation. `WorkerStore` retains those observations across
physical retries and rejects request-key drift. Raw vendor transcripts are not
returned. These observations do not establish correctness or confinement.

Run the process-double proof without a model or authentication:

```sh
npm run build
node --test packages/skeleton/dist/test/writer.test.js
```

WO-052 supplies the target host. [WO-053's live receipts](../../docs/evidence/WO-053/README.md)
show both installed writers fixing the synthetic module and a killed host
recovering one existing commit without redispatch. The sandbox alone did not
confine sibling writes in C-W6/X-W6; target governance and host checks remain
necessary. The successful sampled episodes do not establish universal confinement.

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
each complete file in a private sibling directory, verifies exact size and the
encoded millisecond with less than one microsecond of positive timestamp
conversion error, and atomically renames it to its stable address. Observers
retain the actual nanoseconds and age/skew comparisons; staging is removed on
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

## Independent verification

Component `0.11.0` prepares application `v0.12.0`, using compiler `0.5.0` and unchanged kernel `0.2.1`. A verification branch of the shared typed `seiriReactor` drives kernel programs, authorized durable commands, blinded verification, focused repair proposals and affected-evidence staleness. The host and kernel replay compare complete Decisions through that same branch. The established Seiri demo remains available.

Run a complete synthetic planted-defect loop, then inspect its store:

```sh
npm run build
node packages/skeleton/dist/src/dotln.js verify-demo --store .runtime/verification
node packages/skeleton/dist/src/dotln.js status --store .runtime/verification
node packages/skeleton/dist/src/dotln.js status --store .runtime/verification --json
```

The store lives under the gitignored `.runtime/` root like the disposable-worker stores above. Its path must be canonical: the worker host refuses a store whose resolved path differs from the path given, so on macOS `/tmp/...` (a symlink to `/private/tmp`) is refused while `/private/tmp/...` or a repository-relative directory is accepted. Use a new store directory for a new run; rerunning against the same completed store returns its compact envelope and makes no new invocation. The default `fake` transport needs no authentication or network. The host creates a synthetic repository, witnesses its baseline, plants a policy defect that includes a referenced file, and obtains a blocking finding. A fresh repairer proposes only the relevant JSON policy replacement. The host applies it, marks two affected criteria stale while preserving an unrelated row, and dispatches another blinded verifier. The event store retains all findings and old evidence. The final envelope reports an episode's completion; the matrix's `phase` and rows report acceptance.

`verify-demo` also accepts `--transport claude-cli-print|codex-cli-exec --model <required-model> --effort <level>` under the existing `DOTLN_LIVE_WORKERS=1` opt-in. This uses the WO-009 disposable launches, with the new `verification-snapshot-v1` capsule/schema and read mount. Both wire protocols are tested with local subprocess doubles in this work order; live model verification has not been witnessed. Codex effort remains `unknown` under the existing observed launch profile. The fixture and its evidence stay synthetic even when a real model judges them.

The host preserves the existing one-second heartbeat, five-second lease, three-minute transport deadline, serialized store writer and immutable completed-result cache. Interrupted work keeps its stable command; after lease expiry a new physical episode can retry. A saved result can be queried without another model invocation while retaining its original producing episode. Accepted-result/status and applied-repair/event crash windows recover without repeating the effect. Unknown model selection, capsule drift, dirty mounts and expired or revoked authority refuse; a worker requesting a human decision leaves the workstream at `attention`. The default repair bound is three applications.

This original adapter permits a fixed interpreter and validated JSON policy data only. It cannot apply arbitrary repository patches or execute proposed source. Claim types are state and behavior; explicit `synthetic-fixture`/`live` labels prevent fixture evidence from certifying integration. The event store is host-owned, not authenticated against a hostile same-user writer. The pure compiler and kernel retain zero runtime dependencies. The repository's manual independent verifier still judges this implementation; the runtime demo does not replace `resume: verify`.

The additive `worktree-snapshot` profile uses
`prepareWorktreeVerification` from `src/verification-worktree.ts`. Supply a
canonical committed target `worktree`, declared `baseCommit`, `observedCommit`,
public `repo` label, closed WorkOrder `contract`, mapped `criteria`/`tests`, and
a new `directory` beside the target. Contract fields are `workOrderId`,
`objective`, `acceptanceCriteria`, `constraints`, `nonGoals`, `requiredEvidence`;
the last list contains the exact named command strings. Test entries are
`{ criterionId, checkId, command }`. The return is `{ subject, snapshotPath,
testPaths }`. Prepare the baseline separately at the declared base, then feed
both subjects into the existing `VerificationOpened` event. `VerificationHost`
selects the new profile from the capsule and runs with `snapshotPath` as its
read mount. [The fixture](test/verification-worktree-fixture.ts) demonstrates
the complete WO-052-to-verifier handoff.

Only committed regular UTF-8 files are accepted: at most 100 files, 100,000 bytes
per file, and 100,000 diff characters. Git modes, source bytes, diff, contract and
commands enter the snapshot seal; witnesses enter the capsule hash. Extra fields
refuse with their path. The host runs each exact command in a separate fresh
copy using macOS `sandbox-exec`, a minimal environment, 30-second deadline and
64-KiB output bound. No shell quoting/interpolation or dependency installation
is supplied. Test copies may create caches but cannot change sealed inputs.
Missing confinement or interrupted execution produces unavailable evidence.
The verifier has no tools and cannot submit a host-test witness. Physical paths
can occur in raw test output; callers must apply their publication policy before
sharing it. Copies remain available for inspection; no automatic cleanup or
hostile-process containment is claimed. Source-writing repair and live model
verification remain WO-055/WO-056.

WO-056 states the finding contract to the verifier without changing it.
`evidenceResultSchema` limits a finding's `observed` and `expected` to the
strings of the adverse (`fail`) host witnesses and, in this profile, its
`reproductionSteps` to those witnesses' steps and the exact named commands. The
verifier's output instructions say the same and send its own diagnosis to the
envelope summary. `parseEvidenceResult` and `deriveRepairOrder` keep their
rules: before this, a live verifier's correct but descriptive finding was
refused as `finding observed versus expected`, because only a double that
copies the host's strings could know them. With no adverse witness the fields
stay free text, and the `verification-snapshot-v1` profile's steps are never
constrained. The Codex transport adds `--skip-git-repo-check` for this profile
only: its read mount is a files-only copy without Git metadata, which Codex
otherwise refuses before any model call. Inspection, writer and
`verification-snapshot-v1` launches keep their argument vectors. See the
[WO-056 evidence](../../docs/evidence/WO-056/README.md).

Evidence can be reproduced and checked mechanically:

```sh
npm run build
npm run evidence:verification -- --check
node --test packages/compiler/dist/test/verification.test.js packages/skeleton/dist/test/verification.test.js
```

See the [domain payload and matrix contract](../../docs/product/02-domain-model.md#independent-verification-v1) and [WO-010 acceptance mapping](../../docs/evidence/WO-010/README.md). `evidence:verification -- --write` regenerates the synthetic receipt after an intentional source change; `npm test` checks its exact bytes. Compiler-version or behavior changes select a new loadout identity or verification edition in [`docs/evidence/current.json`](../../docs/evidence/current.json), leaving prior receipts intact. The evidence scripts and gate read that selection.

## Feedback compiler and bounded self-hosting

Component `0.12.0` prepares application `v0.13.0` with compiler `0.6.0`.
The personal [ten-unit catalog](src/loadouts/feedback.ts) is compiled into
explicit boundary checks, with the semantic correction transition in the shared
reactor. `feedbackBoundary` checks host-derived facts before running an effect;
writer reservations must remain locked across observation and dispatch. A read
receipt witnesses delivered bytes, not whether the reader understood them.
The source-comment boundary uses the exactly pinned TypeScript `7.0.2` native
parser. It batches immutable before/after texts in a virtual project, closes
the parser after each boundary, and compares actual comment ranges; parser-version
drift refuses. Regex, template and JSX literal text cannot impersonate comments.
This host dependency is recorded in ADR-0002. The pure compiler and kernel
retain zero runtime dependencies.

Run the repeatable fixture evidence:

```sh
npm run evidence:feedback -- --write
```

This executes each named regression with its mechanism present and removed,
then records the matched instruction-byte comparison and fixture maturity
observations. The source pin covers the declared audit implementation and
fixture surfaces. WO-041 adds explicitly labeled `feedback-package-projection-v1`
capsules at logical `.feedback-source/` paths for the skeleton manifest and
package lock. They retain executable settings and dependency selections while
excluding only root/known-workspace release versions and license labels. Runtime
source, scripts, exports, publication controls, external dependency versions,
resolutions/integrity, and unknown metadata still invalidate the audit. The
separate release/license gates judge the omitted labels. This prevents an
unrelated release retiming or license-only integration from demanding another
live feedback run; it does not make behavioral evidence reusable after source
changes. Build before invoking the underlying JS APIs directly.

The self-hosted task is one read-only audit of this repo. Its executor is a fixed
local subprocess runner. A separate verifier receives the pinned source/report
capsule through an existing CLI transport, in an empty Git mount with model
file tools disabled. It does not receive this session's implementation narrative.

```sh
DOTLN_LIVE_WORKERS=1 npm run dotln -- feedback-audit --store .runtime/feedback-audit --transport claude-cli-print --model claude-sonnet-5 --effort max
npm run evidence:feedback -- --record-selfhost .runtime/feedback-audit
```

The root evidence command selects the feedback edition in [`docs/evidence/current.json`](../../docs/evidence/current.json). A compiler or declared source change can require a replacement edition; previous receipts remain historical bytes. The [actor board](../console/README.md) reads the same edition by default and pins it as its `selfhost` fixture case, because the reactor refuses an earlier edition's verifier stream as persisted compilation drift. `scripts/feedback-evidence.mjs --edition WO-NNN` selects a new edition; writing different bytes to an existing edition refuses. The logical report label inside the pinned verification capsule is unchanged.

Use an unused store for a new source revision. Reusing the same store resumes
only the same source, policy, and verifier selection; an already saved audit or
completed verification is not dispatched again.
`dotln status --store .runtime/feedback-audit/verifier` projects the
verification matrix from its canonical events. The store lives under the
gitignored `.runtime/` root and its path must be canonical: the host refuses
the verifier mount when its resolved path differs from the path given, so on
macOS `/tmp/...` (a symlink to `/private/tmp`) is refused after the audit has
already run, while `/private/tmp/...` or a repository-relative directory is
accepted. `--transport fake` exercises the deterministic path without
live-model claims and cannot be recorded as the witnessed live self-hosted run.
The default transport is fake; a live transport needs explicit model/effort and
`DOTLN_LIVE_WORKERS=1`, as in the existing demos.
The feedback verifier has a fixed ten-minute process deadline and a $3 Claude
budget cap, recorded with its attempt. The initial live source audit exceeded
the inherited three-minute bound; other worker profiles retain their existing
limits. An interrupted command stays pending and its next attempt is logged.

When the feedback profile is equipped on a Claude verification request, the
host emits command-scoped attribution settings (`commit` and `pr` empty,
`sessionUrl` false). The [official setting reference](https://code.claude.com/docs/en/settings-reference)
was retrieved with Context7 on 2026-09-06. No user/account/repository setting is
installed. `scripts/feedback-commit-msg.mjs` is the separate hook adapter; its
real-Git fixture installs it only in a temporary test repository. Missing builds
or an unreadable message fail the hook closed. The predicate rejects named AI
coauthor trailers and generated-with footers while allowing human coauthors and
ordinary descriptions of AI-related functionality. A host must explicitly
install the hook for its selected publication boundary.

The [WO-011 evidence receipt](../../docs/evidence/WO-011/README.md) owns the
acceptance mapping, measured limits, and source edition. Outside an equipped
host, the existing execution guide remains the manual rule carrier.

## Contributor harness

The [Contributor definition](src/loadouts/contributor.ts) equips the ten personal
feedback units, Clean Room and the sandboxed authority envelope. Build first,
then emit or check its project configuration:

```sh
npm run harness -- emit
npm run harness -- check
npm run harness -- emit --profile claude-code-2.1.263 --out /private/tmp/dotln-preview
npm run terms -- check CLAUDE.md docs/discovery/harness-smoke-2026-09-07.md
```

The default emits both observed profiles and one shared instruction block.
It preserves the hand-written floor, validates contained destinations before
writing, refuses unowned stale surfaces and never edits user settings. Native
sandbox and approval remain in force. The CLI only accepts Contributor today;
new saved builds need explicit adapter declarations and observed profiles.

The Codex contributor profile also emits `.codex/hooks.json`, a comment-only
project config and a source-only continuation hook. After compaction it restores
the saved work order and can request one immediate continuation if that same
owned task remains unfinished. It preserves explicit pause/recovery controls and
does not dispatch or release a writer. Review native hook trust with `/hooks`;
the checked Codex CLI 0.155.0 loads linked-worktree definitions from the root
checkout, so integration there is required for those worktrees. Emission never
overwrites unowned Codex configuration. See [behavior, native proof and activation
limits](../../docs/evidence/WO-054/codex-continuation.md). This separate observation
does not upgrade historical generic tool-hook or target-worker capabilities.

Claude hooks load the reviewed built runtime and refuse if its pinned bytes
differ. Permission checks use the shared reactor's authority owner, included in
those runtime pins. After a runtime edit, build and regenerate the bundle before a new
session. `npm run harness -- evidence` runs the fixed required checks and binds
their outcomes to current source; it cannot substitute for order-specific
acceptance evidence. Normal Stop checks require the canonical phase completion
and current-byte output read receipts. A failed verifier may complete a failure
report without falsely claiming passing application checks.

Read receipts can combine native Read ranges verified against one file hash.
For a file with oversized lines, invoke
`node scripts/harness.mjs read-output <path> --offset 0 --length 8192` directly.
Read the returned content, then continue with its `nextOffset` until it equals
`totalBytes`. The helper delivers UTF-8 chunks of Git-visible regular files;
it cannot create a receipt itself. Claude's PostToolUse observer verifies the
delivered stdout against current bytes, and admits a whole-file receipt only
after complete coverage at one hash. Missing-output refusals name every missing
path and a count. Direct output reads do not reserve a coding writer and retain
the native credential-path denials. This does not claim Codex hook support.

Output obligations are compared with the revision at session entry, so a final
review commit cannot hide files that still require read receipts. Bounded status
and index commands do not reserve a coding writer. Release close starts from
fresh `main`; its exact managed subject helper delegates to the existing guarded
lifecycle host only after canonical closure. That delegation does not authorize
ordinary source writes on `main` or replace the lifecycle host's effect checks.

Host receipts and writer reservations live in ignored `docs/control/local/harness`.
They are host observations, not worker-result prose or OS isolation from a
hostile same-user process. A session's reservation records its harness process
and is released only after the compiled completion predicates allow Stop. A
session that ends without that release leaves its reservation behind; the next
write dispatch reclaims it only when the recorded owner is dead, logging the
reclaim in the session journal and `writer-events.jsonl`. The reservation is a
`writer/` directory holding one nonce-named file. Recovery unlinks that exact
name, removes the instance only while it is empty, and renames a prepared
replacement only onto an absent or emptied slot, so two sessions reclaiming
the same dead holder admit exactly one writer and the loser records a
`retired` event when it emptied the instance but lost the placement. A
pre-repair `writer.json` is migrated when it is the session's own and
reclaimed when its owner is dead; it is never created. A live or unverifiable
holder keeps the reservation and the refusal names it. `node scripts/harness.mjs
writer --show` reports the holder without reserving; `writer --release [--force]`
is for an operator terminal outside a governed session and refuses a live owner
unless forced. The generated commit-message adapter
is available for a reviewed Git-hook installation; this command does not edit
Git configuration or install user/global hooks.

The operator-maintained `docs/control/local/terms.txt` stays ignored and never
enters a committed hash. Add known terms one per line and update the list over
time; an exhaustive inventory is not required. With no known terms, leave the
file absent: the screen reports `unavailable`, including in `npm test`, without
blocking readiness by itself or claiming a passed list-based screen. A present
but empty or malformed file refuses. The locked Clean Room boundary applies
regardless. No term, match text or private list is echoed; a refusing check prints
only file, line and count. Forks maintain their own list. The
[future UI item](../../docs/product/04-interfaces.md#candidate--private-exclusion-list-management)
covers viewing, adding and removing entries.

The [WO-039 receipt](../../docs/evidence/WO-039/README.md) names live versions,
context method, unconfirmed correction token and unavailable Codex enforcement.
The scratch scope bounds shell routes and skill selection while the generated
observer accounts for delivered file ranges through the final Stop. Current
smokes observe native Read attempts without enforcing the directed ranges and
fail on any out-of-set observed or attempted read. This is an instrument for the
bounded smoke, not a general parser for arbitrary shell effects.


## Target worktree bundle

From the launchpad root, after building:

```sh
npm run harness -- emit --target <worktree> --runtime-root <launchpad>
npm run harness -- check --target <worktree> --runtime-root <launchpad>
npm run harness -- remove --target <worktree> --runtime-root <launchpad>
```

The default profile is `target-worker-claude`; select `--profile
target-worker-codex` to install only `CLAUDE.local.md` and the manifest. A Codex
launch must explicitly read that instruction block. No Codex hook capability
is claimed. WO-051 supplied the launch profiles, WO-052 added host diff checks,
and [WO-053](../../docs/evidence/WO-053/README.md) observed both harnesses
commit a synthetic repair and Codex recover an existing commit after host kill.

Claude receives three PreToolUse guards (permission, writer, attribution),
settings deny rules and the local instruction block. Hook imports are absolute
file URLs into the pinned launchpad snapshot. Runtime or classification failures
refuse the tool. Bounded writes must stay inside the target and leave the bundle
intact. Opaque shell commands, including test scripts and Git commits, need a
host route; this profile does not claim universal shell containment. The
attribution adapter checks explicit commit messages independently. WO-052's host
issues a launchpad-side route for exactly the focused test, `git add -A`, and
`git commit -F <host-message-path>`. The permission hook checks its live host,
expiry, branch/base and message bytes; unmatched opaque commands still refuse.
WO-051's transport allowlist does not bypass the guard. The live source-change
proof is recorded in [WO-053](../../docs/evidence/WO-053/README.md).

Emit refuses unowned or tracked destination files, symlinks, incompatible
launchpad runtime bytes and target ignore rules that would expose the bundle.
It never merges existing settings. Every emitted path and `/.dotln/` goes into
the repository's local exclude; shared-worktree membership is serialized and
removal preserves surviving members and pre-existing exclude bytes. Another
launchpad's managed exclude refuses rather than merging ownership.

The manifest has only relative paths and hashes. Its own entry hashes the
payload list without that entry; the launchpad receipt hashes the whole manifest.
`check` verifies bytes, effective Git ignoring and runtime pins. `remove` refuses
modified owned files, preserves unrelated files and retains the launchpad's
runtime/journals. Empty target directories may remain. State is under
`docs/control/local/harness/targets/<digest-of-real-target-path>/`. Raw physical
paths are not copied into the manifest or installation receipt; only hook import
lines contain the runtime path. Checks bind local bytes, not hostile-user
isolation or authenticity.


## Source-change host (WO-052)

After `npm run build`, import `SourceChangeHost` from
`packages/skeleton/dist/src/source-change-host.js` and `WorkerStore` from
`worker-store.js`. Supply a compiled `workOrder`, its `artifactIdentity`,
`authorityEnvelope`, and already-established `authorityEvidence`; the host does
not compile Markdown or treat required evidence as observed evidence. Its
remaining options name one `branch`, relative file/directory `surfaces`, an
existing canonical `worktreeParent`, `launchpadCheckout`, exact `testCommand`,
host-authored `commitMessage`, `model`, `effort`, and one of the existing
source-change CLI transports. `repo.write`, `git.local`, `shell.run` and one
writer resource must be authorized; prohibited remote effects remain denied.

```js
const host = new SourceChangeHost({
  ...compiledContext,
  ...targetEpisodeConfiguration,
  store: new WorkerStore(episodeStoreDirectory),
  transport,
});
const outcome = await host.run();
// Inspect outcome and retain the worktree for the separate verifier.
// Only when explicitly finishing this episode:
host.finish();
```

`run()` creates the target branch from the declared base, emits the matching
target-worker bundle, records the host's baseline test, and dispatches. Test
commands are bounded argument vectors, with no shell interpolation. Results
are `observed` with a commit/diff/test receipt, or `refused` with a reason;
observation alone never claims verification. A returned worker without a commit
refuses and retains any edits. A failed after-test is recorded faithfully.
The host checks every changed path against `surfaces`, plus branch identity,
base ancestry, clean source and governance/message integrity.

To recover, construct the host with exactly the same configuration and store
and call `run()` again. A live host lock or unexpired worker lease refuses.
After expiry, a committed effect is read from Git without dispatch; a saved
receipt also preserves the original test observations. If no commit exists,
one recovery attempt is permitted with existing edits preserved. A further
interruption refuses with `recovery-dispatch-exhausted`. Stored malformed or
pending artifacts refuse before lock reclaim. Do not edit receipts to bypass
these checks.

`finish()` requires a saved receipt and observation and checks that the branch
still names that effect. It removes only owned bundle/message files and then
safely removes the clean worktree, retaining the branch. Unknown ignored files
and dirty state refuse. A kill during preparation or partial finish can leave
safe residue requiring inspection; no automatic discard or forced cleanup is
provided. Store leases and exact command routes do not establish general orphan
writer fencing or sandbox containment; [WO-053](../../docs/evidence/WO-053/README.md)
observed clean Claude/Codex episodes and killed-host recovery after worker exit,
without establishing fencing of a still-running orphan.

Fixture evidence, including real host SIGKILL and native emitted Claude guards:

```sh
node --test packages/skeleton/dist/test/source-change-host.test.js
node scripts/reactor-identity.mjs --check
```

## Executable discovery (WO-119)

After building, run `node packages/skeleton/dist/src/discovery-cli.js <canonical-target>`
from the launchpad, optionally followed by a target-relative profile path.
`discover(worktree, conventions)` is also available from `discovery.ts`.
The default profile is `.dotln/discovery.json`; a Markdown profile uses one
fenced `dotln-discovery` JSON block. Its fields are:

- `checks`: at most one `lint` and one `test`, each with absolute `argv` and
  target-relative file `paths` defining observed scope.
- `placements`: explicit `{ path, home }` rules; home must be unoccupied.
- `generated`: `{ path, referenceTokens }` declarations. The complete bounded
  text corpus, excluding that file, the selected profile and repair history,
  is scanned literally. Dependencies and Git metadata are excluded.
- `repairHistory`: a relative JSONL file whose rows are `{ eventId, repairId,
  paths }`. Two distinct events for the same repair and path set are recurring.

Without a profile, the npm CLI installed alongside Node runs package lint/test
scripts, including their pre/post hooks and lifecycle environment, with a cleared
inherited environment and a local tool PATH; scope is `package.json`, since the
producer does not invent implicated source paths. The optional default history
is `.dotln/repairs.jsonl`; placement/generated defaults are empty. A declared
non-npm package manager or unavailable npm requires explicit check conventions.
Checks run with `HOME` and `TMPDIR` set to the target root, so they may create
caches or temporary files there. Discovery disables Node’s binary compile cache
for these subprocesses and inventories the resulting bounded
tree again ([WO-119 review, O5](../../docs/final-reviews/WO-119/FINAL-001.md)).
Resolved placement sources and removed generated files cease producing candidates.

The fixture declaration in `fixtures/wo119-discovery/repository.json` shows the
wire shape. Limits: 1,024 files, 4 MiB total input, 4,096 directory entries,
16 levels, two checks of at most five seconds/64 KiB each, and 128 candidates.
Symlinks, special files, malformed declarations/history, incomplete scans and
failed launches refuse the episode. Binary reference corpora refuse rather than
claiming absence. Candidate size is file count, not a predicted repair size.

For the resident, declare the exact Node executable and built `discovery-cli.js`
path, followed by its canonical worktree (equal to actor `cwd`) and optional
profile path; set `outputContract: "work-candidates-v1"` instead of
`expectedStdoutSha256`. Retain the ordinary phase effect, surface, resource and
timeout declarations. The native supervisor recognizes only this exact producer
entry, runs its private bootstrap inside one no-network, target-write-confined
sandbox, and permits read-only tool/runtime resources. Public discovery callers
establish the same boundary per check. Native support is macOS sandbox-exec;
unsupported check execution refuses. No host permission settings change.

`ScriptEpisodeObserved.discovery` holds the bounded report and evidence; its
canonical stdout digest is validated during replay. Schema verification is not
independent verification of repairs or permission to execute them. The trusted
repo-command boundary does not claim isolation from hostile same-user processes
or a deliberately detached descendant; the outer script supervisor retains its
existing process-group deadline/return/death handling.
