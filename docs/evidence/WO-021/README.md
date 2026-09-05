# WO-021 implementation evidence — 2026-09-05

This is executor evidence for the staged `v0.8.0` source, with skeleton
component `0.7.0`. Independent verification and final review remain separate.
The implementation changes the resume helper used to record its own readiness;
the isolated lifecycle and real-Git fixtures verify that instrument directly.
No employer material, raw intake, session capability, or private path is included.

## Implemented behavior and guard choice

Every appended lifecycle transition emits its folded phase, latest verdict,
latest attested effort, and host provenance into isolated public/verifier
directories. Read-only status/next leave Beacon inode, ctime, mtime, size, and
content unchanged. Optional projection failure preserves exactly one canonical
transition and reports a sanitized warning. One worktree owns each group cache;
readers do not repair it or write into another worktree.

Observe lowers to `observe.beacons.public` or `observe.beacons.verifier` through
the existing Act guard, with resource `beaconSweeps`. That reuses explicit
allow/deny, expiry, revocation, evidence, and resource rules while preserving
the semantic Observe intent and keeping all decisions in the pure reactor.
Kernel and compiler source remain unchanged. The host supplies the envelope;
observed Beacon values never enter its authority context.

The allowed path persists `BeaconSweepRequested`, `CommandPersisted`, exactly
one `BeaconObserved`, then `CommandResult`. The denied path persists the request
and `CommandRefused` with no Beacon read. Replay consumes the captured metadata
and event time, compares complete Decisions, and reproduces age glyphs.
The default threshold is 20 minutes, declared in the request. Nanosecond
metadata is retained at skew/staleness boundaries; malformed or unknown codes
cannot appear as a fresh valid state.

## Executable evidence

The focused nine-test suite passed after the normative-table and timestamp
changes. It reports:

```text
v2: 288 states; MAX_V2_CODE=1150; dense bytes=81833; all 104 v1 states retain meaning
group: 125970 vectors, no collisions; 12 members across all 8 phases; logical maximum=192763452654
stat: v2 size=81833 blocks=160; group size=192763452654 blocks=0; filesystem block=4096
12 actual member files -> group counts=2,2,2,2,1,1,1,1; group blocks=0
refused: 0 metadata reads, 1 CommandRefused, 0 BeaconObserved; authorized: 1 sweep, 1 BeaconObserved; complete decisions and glyph replay identical
Beacon sweep refused; CommandRefused recorded; no beacon metadata read.
authorized CLI: unreadable garbage beacon decoded; exactly one BeaconObserved; replay succeeded; lifecycle bytes unchanged
```

The [lifecycle fixture](../../../scripts/test-resume.sh) checks the emitted
phase/verdict/effort/time against folded status and `current.md` after every
transition. [Three-worktree tests](../../../scripts/test-control-beacons.mjs)
exercise a real Git set, unchanged read-only views, unreadable garbage,
absence, the verifier whitelist, separate random session capability/path,
wrong-session/wrong-order refusals, anchored disposal, and projection failure.
The broader worktree fixture removes a safely closed checkout with populated
Beacon cache and still refuses `docs/intake/dist/x.md`.

The [agent CLI test](../../../packages/skeleton/test/control-beacon-cli.test.ts)
denies directory access to prove the authorization check happens first; the
allowed case decodes a mode-000 file containing garbage and writes one replayable
observation to a mode-0600 log. The [pure suite](../../../packages/skeleton/test/control-beacon.test.ts)
also varies absence, age, and malformed state without changing the same
envelope's authority decision. WO-020's tests retain atomic replacement,
v1 interpretation, and live/replay file identity.

The full `npm test` gate passed: formatting, GitHub-body and temporary-root
fixtures, publication, intake backup, resume, checkpoint, worktree, release,
work-order index, a clean forced TypeScript build, all 196 package tests, and
all eight included corpus tests. There were zero failures or skips in both
Node test batches. `git diff --check` also passed. Kernel/compiler source is
byte-identical to the activation base; the lockfile changes only the skeleton
component version, with no added dependency. This does not claim independent
verification.

The actual three-worktree transcript below replaces only opaque synthetic
address hashes with `fixture-address`, as the test itself reports:

```text
Beacon fixture-address:fixture-address.beacon | active | unknown | unknown | host-projected | fresh | v2 | 8365 bytes
Beacon fixture-address:fixture-address.beacon | ready-to-verify | unknown | unknown | host-projected | fresh | v2 | 17597 bytes
Beacon fixture-address:fixture-address.beacon | verifying | unknown | unknown | host-projected | fresh | v2 | 26765 bytes
Group Beacon | active=1 ready-to-verify=1 verifying=1 needs-fix=0 repairing=0 verified=0 final-review=0 closed=0 | group-v1 | 55258 bytes (host cache; fresh)
PASS unreadable garbage content still decodes; missing expected worktree beacon is absent
PASS verifier contains only host records; two independent 256-bit names; restricted name appears only in the authorized active next briefing
PASS anchored Beacon disposal; protected intake and lookalike/nested paths still refuse
PASS filesystem projection failure records exactly one transition and warns without leaking restricted paths
```

## Fresh bounded storage observation

Node `v22.2.0` on Darwin; temporary fixtures on the same device as the checkout.
`stat.blocks` is counted in 512-byte units; filesystem `blksize` is 4,096 bytes.
Only file-data allocation is counted, excluding inode and directory metadata.

| Family         |  Maximum code |   Logical bytes |   Observed allocated data | Declared bound                                               |
| -------------- | ------------: | --------------: | ------------------------: | ------------------------------------------------------------ |
| Individual v2  |         1,150 |          81,833 | 160 blocks = 81,920 bytes | Dense size rounded to a filesystem block                     |
| Phase-group v1 | 3,011,928,819 | 192,763,452,654 |                  0 blocks | At most one filesystem block when sparse support is observed |

The probe first checks a 64-KiB hole. Only a zero-block result permits probing
the group maximum. Without that observation, the ceiling is the reproduced
81,833-byte dense v2 maximum; small dense groups work and larger groups refuse
before allocation. The worst theoretical dense group is 192,763,453,440
allocated bytes at this block size, and is deliberately not allocated.
This is a tested ceiling for these codebooks, not the filesystem's maximum.
Unsafe host integers and over-ceiling sizes produce no destination file.

The twelve-member group uses all eight phases with counts
`2,2,2,2,1,1,1,1`. Individual v2 and group-v1 are separate families: the group
uses framing tag 3 only in its dedicated directory/decoder. Individual v3
remains unknown and available to WO-022. Per-file rename atomicity is retained;
there is no cross-directory snapshot or power-loss durability claim.

## Sequential scan comparison

[Machine-readable result](scan-costs.json), reproduced with
`node scripts/benchmark-beacon.mjs`. One process, five warmups, fifty measured
rounds, warmed local cache. Each full-status representation returns equal
observations; each synthetic set lives in one directory, not thousands of Git
worktrees. Timings exclude startup, fixture creation, discovery, and writes.

| Individual statuses per request | Metadata sweep median | Separate JSON median | Single JSON index median |
| ------------------------------: | --------------------: | -------------------: | -----------------------: |
|                               3 |             0.0573 ms |            0.0412 ms |                0.0116 ms |
|                              12 |             0.0960 ms |            0.1442 ms |                0.0181 ms |
|                             100 |             0.4535 ms |            1.1107 ms |                0.0727 ms |
|                           1,000 |             3.8813 ms |           11.1995 ms |                0.6972 ms |

At 1,000 members the dense Beacon files allocate 47,104,000 data bytes,
separate JSON 4,096,000, and the index 364,544. Padding has a real storage cost.
For the separate query of twelve-member phase counts only, one sparse group
metadata read has a 0.0026-ms median versus 0.0095 ms for compact JSON counts,
and the group allocates zero data blocks. The group omits individual identity,
verdict, effort, and provenance; it is not an equivalent full-status query.

## Bounded concurrent-reader comparison

[Machine-readable result](read-contention.json), reproduced with
`node scripts/benchmark-beacon-contention.mjs`. Each case serves 1,000 total
requests through one, two, or four worker threads with independent JS runtimes.
Each request retrieves all statuses; no writer runs during timing. Worker old
heaps are limited to 64 MiB and each case has a 30-second deadline. Startup and
five per-reader warmups are excluded; total time includes dispatch/completion
messages. There is one measured batch per case; p95 request latency and process
CPU time are retained in the JSON. The smoke form checks worker/result behavior
without rerunning this load in every test suite.

| Statuses per request | Readers | Time for 1,000 Beacon requests | Time for 1,000 JSON-index requests |
| -------------------: | ------: | -----------------------------: | ---------------------------------: |
|                   12 |       1 |                       85.04 ms |                           19.20 ms |
|                   12 |       2 |                       52.29 ms |                           10.92 ms |
|                   12 |       4 |                       30.61 ms |                            7.11 ms |
|                1,000 |       1 |                    3,847.99 ms |                          711.20 ms |
|                1,000 |       2 |                    2,233.95 ms |                          368.56 ms |
|                1,000 |       4 |                    1,324.58 ms |                          194.08 ms |

Both representations improve with more readers; the shared index remains
faster. This does not test 1,000 simultaneous processes, write contention,
cold cache, cross-machine access, or practical throughput under production load.
The 100/1,000-member tests exercise individual scaling beyond the group's
twelve-member bound. They do not enlarge that bound.

## Interpretation and preserved options

The evidence supports exact small projections, payload-free reads of denied
content, audience-specific host views, and sparse phase counts on this host.
It supplies no blanket advantage over compact indexes, no measured model-token
savings, and no operator usefulness verdict. The
[operator comparison](../../planning/beacon-usefulness-checkpoint.md) remains open.

The operator's function-table proposal is preserved in product 02: a decoded
state can select a versioned local table entry without encoding its full
behavior. An explicit new selector field needs its own bounded version.
Execution still requires authority. No function-dispatch benchmark was run.

The scan-privacy question is recorded in product 09 with Apple documentation:
status calls can be visible to privileged monitoring. No monitoring tool or
account setting was changed here. Cached local state and a shared observer can
reduce repeated source access, but are future design options. Same-user
filesystem access is not isolated by the random-directory mechanism, and
provenance labels are not authentication. The verifier whitelist prevents the
host writer from projecting narrative; it does not prove who wrote arbitrary
bytes reachable by a hostile peer.
