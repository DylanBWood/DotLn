# WO-143 implementation evidence

Dispatch: `resume: next`, 2026-09-19. Subject: the uncommitted `wo-143` worktree.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

The resident now recovers complete dead-owner acquisition guards without an
operator. The guard atomically links a prepared owner directory; immutable
successor claims serialize recovery, and a canonical-target check prevents a
delayed claimant from touching a successor. Host-lock owner publication is also
atomic. Positive replay precedes reclaim after excluding an incumbent writer;
the append guard inspects the actual resident log. Polling stops taking the
append lock after issuing a kill and still records the eventual outcome.

Decisions and corrections: [D001 and D002](decisions.md). Independent
verification and final review remain separate dispatches.

## Acceptance evidence

| Criterion | Executed evidence at the focused-check cutoff |
| --- | --- |
| 1 — deterministic once/loop crashes and thirty rounds | `resident.test.ts` plus `fixtures/resident-lock-process.ts`: 344 startup filesystem boundaries across lifetime/append and fresh/reclaim cases; 68 more during a subprocess-dispatched episode's polling acquisition. Every restart preserves prior event bytes and records the in-flight episode lost once. Thirty successive kill/restart rounds per mode end with an openable store. |
| 2 — refusal and serialization | Alive, missing, partial, malformed, symlinked, dangling and foreign guard owners refuse with the existing message and inspection path; snapshots stay unchanged. Two subprocesses paused before the same claim yield exactly one reclaim and one writer. A delayed claimant really links into a retired target, then refuses without unlinking its live successor. |
| 3 — released-store compatibility | `wo143-released-events.jsonl` was generated with the tagged `v0.32.0` WorkerStore and one durable event. Exact log bytes survive with the legacy `{pid}` lock present or absent. A released ownerless guard directory still refuses unchanged and names its path. |
| 4 — no post-kill polling acquisitions | A pending actor result remains unresolved while the clock advances and presence changes the log: neither trigger acquires another polling lock. Result completion acquires exactly one final-outcome transaction. |
| 5 — write-backs | Skeleton README, product 03, dated capability reassessment and decisions file. Product source locks are refreshed and publication checks pass. Level 2 is an executor-supported staged assessment awaiting independent judgment; WO-111 remains the unattended-hour observation. |
| 6 — checks and dependencies | Focused source inventory, malformed-store and resident checks pass. No new dependency or event/schema change. Product gate: 21/21 suites; document gate: 19/19 suites; whitespace check clean. |

Focused runs: the original resident and malformed-store selection passed 81
checks in 5.48 s. The first five new groups passed in 171.07 s, comprising the
344-boundary matrix (138.54 s), sixty restart rounds (31.75 s), conservative
refusals, preserved torn-state evidence, and post-kill counting. Concurrent and
delayed-claimant fixtures passed in 0.42 s. The running-episode matrix passed
68 crash boundaries in 33.37 s. The final decoder read inventory and tripwire
pass 2/2; the final refusal/concurrency selection also passes.

[Fixture transcripts](fixture-transcripts.md) retain the focused crash outputs
and final gate summaries. `npm test` passed 21 suites / 65 fresh tasks in
246.82 s, including the skeleton suite in 244.31 s, at
`2026-09-19T17:59:25.612Z`. Its code identity is
`60b1232823ebde601fb807c059d0d554b51696f4486d22eeca3df417493b413f`,
unchanged at handoff inspection. `npm run test:docs` passed 19/19 in 15.43 s
after the capability-table header correction. Publication, release surfaces,
generated harness and the selected source-pinned evidence checks pass.
`git diff --check` is clean. This supplies executor evidence for all six
criteria; independent judgment and the reviewer's own product gate remain open.

The instrumentation pauses after each completed Node filesystem call used by
acquisition, including preparation, publication, claim, lock replacement and
retirement. The parent sends real SIGKILL to a real ResidentHost subprocess;
there are no production crash hooks. Calls internal to readFileSync only read;
partial writes inside writeFileSync affect unpublished private files; recursive
cleanup is after canonical unlink. These internal-call windows therefore share
the tested recovery state. This is stronger than racing the original window,
without claiming a syscall tracer observed every kernel call. The live actor
in the polling fixture is a deterministic adapter inside the real resident;
existing native script/CLI fixtures retain their separate process evidence.

## Compatibility and limits

Only skeleton advances to `0.28.1`, staging application `v0.32.1` under the
existing patch classification above local `v0.32.0`. Kernel, compiler and console versions, the dependency set, event bytes, owner `{pid}` host-lock shape and publication controls
remain unchanged. The generated harness reflects its skeleton runtime version.
Authority evidence is refreshed here; unchanged artifact and verification
editions retain their existing passing checks. The selected feedback edition
is [revision 002](feedback-002/feedback.json), with a separate live verifier.
The first source became stale after its completed audit and is not selected.

Only ESRCH establishes death. PID reuse and signal-probe uncertainty still
refuse; this is a local filesystem/process-crash contract, not a power-loss,
network-filesystem or hostile same-user guarantee. Torn logs and unpublished
result receipts still require inspection. Private unpublished/retired owner
directories can survive a kill but grant no ownership and never block reopening;
no automatic residue deletion or new recurring procedure is added. Older
binaries conservatively refuse a new abandoned guard. The first unattended hour
in WO-111 reopens the runtime reliability assessment.

Two read-only agents reviewed the ownership proof and test discrimination;
only the parent wrote this worktree. Three read-only feedback verifier episodes
bring explicit fan-out to five with no descendants, under cap 20. Available
native session usage is recorded at handoff in ignored receipts and the
response; cost remains unknown. Partial verifier counters are not a session
total. Crash coverage increases the resident suite's wall time substantially;
the two superseded live audits add avoidable cost, as recorded in D002.
