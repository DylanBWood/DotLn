# WO-048 read-path inventory

Scope: `worker-store.ts`, `worker-host.ts`, `verification-host.ts`; recovery
callers `worker-demo.ts`, `verification-demo.ts` and the verifier in
`feedback-selfhost.ts`. Source observations are executor evidence for
`resume: next` on 2026-09-15.

The executable [manifest](../../../packages/skeleton/fixtures/worker-store-read-paths.json)
lists every direct filesystem byte read and JSON parse in the three named
modules. The [inventory test](../../../packages/skeleton/test/worker-read-inventory.test.ts)
walks their TypeScript syntax, checks the complete call-site set and requires
each raw read/parse to be inside a path-named decoder. Planted ordinary,
aliased and namespace reads demonstrate the tripwire. Adding a guarded read
also changes the manifest comparison and requires a reviewed inventory entry.

| Stored input / read site | Decoder and consumer | Refusal boundary |
| --- | --- | --- |
| `events.jsonl`; `WorkerStore.read` | `decodeLog` validates JSONL framing and closed event envelopes; errors include the file path and the codec's line/field diagnosis | Before replay; before acquisition changes the host lock |
| `events.jsonl`; `acquire` consumes decoded `CommandPersisted` payloads | Object checks and canonical string `cmd_…` keys; saved verification capsules run `assertVerificationTask`, recompiling contents and input hash | Before command keys form paths, receipt lookup or lock reclaim |
| `events.jsonl`; worker attempt/heartbeat/expiry payloads | Canonical command/episode IDs, finite lease expiry, required attempt selection strings | Before recovery trusts lease state |
| `host.lock`; `acquire` | JSON object with exactly `pid`, a positive safe integer; regular-file check; existing process-liveness test | Before dead-owner unlink or replacement |
| `cmd_….result.json`; `acquire` scan | Canonical filename, exact wrapper, lowercase 64-hex request key, object result and complete envelope, canonical producing episode, completed status, persisted-command membership; evidence results re-run `parseEvidenceResult` against the saved capsule | Before lock reclaim; all receipts require a successful contextual load during preflight |
| `cmd_….result.json`; `loadResult` | Same wrapper decoder, complete stable `workerRequestKey` equality, `parseTransportResult` against the reconstructed request; preserves independently validated producing episode | Before host redispatch/expiry events, transport invocation or result acceptance |
| `*.pending`; `acquire`, `loadResult`, `saveResult` | Presence refuses by path; bytes are never parsed or trusted as a result | Before dispatch/publication; no deletion of inspection evidence |
| File type / directory entry reads | `lstatSync`, `readdirSync`; regular files required, dangling symlinks observed rather than treated as missing | Before any byte read; abandoned acquisition guards retain their existing refusal |

`worker-host.ts` has no direct filesystem byte read or `JSON.parse`. Its
`preflight` builds the same stable inspection request as dispatch and calls
`store.loadResult` before recording the redispatch gate or lease expiry.
The demo replays the full log before acquisition and then reconstructs each
persisted inspection request at its original command boundary, including a
completed history whose current state no longer has a pending command.

`verification-host.ts` likewise has no direct filesystem byte read or
`JSON.parse`. `VerificationDriver` reads through `store.read` and replays the
existing reactor. `preflightVerificationRecovery` replays the full log with
the caller's workstream and validates every historical capsule/result against
the caller's model, effort, mount and optional feedback. Both the demo and
feedback verifier invoke it inside the store's acquisition guard. The host's
own `run` also loads its cached result before lease expiry can append an event.

Saved capsules are nested log values, not separate files. No new serialized
request or schema is introduced. Inspection fixtures and optional feedback
are not fully recoverable from a generic log alone: callers supply that pinned
context, and acquisition refuses any receipt if preflight did not successfully
validate its complete concrete request key. Generic verification acquisition
also checks the saved capsule/result before that contextual load. This is shape/correlation validation, not
authentication against a writer able to replace both state and evidence.

The recovery guarantee concerns malformed stored artifacts at entry under the
existing single-writer protocol. It does not add a transaction against an
uncooperative same-user process mutating files during a running host, or
validate arbitrary synthetic repository contents as a new filesystem schema.
Fixture inventory reads and verification witness reads keep their existing
mount/drift checks; worker transport scratch output keeps its existing
transport parser and exit-status validation.

The [corpus](../../../packages/skeleton/fixtures/worker-store-malformed.json)
draws truncated JSON, non-object, missing-field, foreign-field, wrong-version,
foreign-command/key and capsule-drift shapes from WO-105's families. Tests
seed actual persisted results using the shipped hosts, install an observed
dead-process lock, advance beyond the lease, then invoke public recovery.
Each rejection checks its path/shape, unchanged dispatch/result counters,
and every directory entry/file byte (including synthetic Git state). Additional
cases exercise malformed attempt tails, dangling symlinks and already-locked
host calls. Existing WO-009/WO-010 fixtures remain unchanged.
