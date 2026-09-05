# WO-009 executor evidence — 2026-09-05

The source prepares application `v0.10.0`, skeleton `0.9.0`, above published
`v0.9.0` (`002593f`). Kernel `0.2.1` and compiler `0.3.0` are unchanged. This
is executor evidence; independent verification and publication remain separate
dispatches. Executor: Codex CLI `0.153.4`, GPT-6 Astra, effort `max`,
`operator-attested` under the standing execution-guide default. This is not
effective-session readback.

The [final live receipt](live.json) records two authenticated invocations using
the actual transports on a nonsandboxed runner. Both returned the sole eligible
candidate, passed the existing fake verifier, replayed the complete Decision
sequence identically, and removed their verified detached worktree. A separate
`dotln status` process observed one running episode and one pending command
without changing the store. The final envelopes were 346 bytes for Claude and
334 bytes for Codex. Raw harness transcripts, authentication, provider session
ids and personal paths are absent from these evidence artifacts.

| Acceptance criterion                                          | Named executable evidence                                                                                                                                                                                                                                 | Outcome                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC1 — one real executor in the 13-step demo; compact envelope | `WO-009 AC1/4 one process replaces only the executor; status is read-only and replay is identical` in [worker.test.ts](../../../packages/skeleton/test/worker.test.ts); both entries in [live.json](live.json)                                            | One eligible candidate; structural deletion refusal, fake verification and operator-return cancellation retained. Only the six-field envelope reaches stdout.                                                                                                                                                                                                                                      |
| AC2 — canonical rows 2, 4, 6                                  | `WO-009 row 2 crash after effect before result persist…`, `WO-009 row 4 a result after authority expiry…`, and `WO-009 row 6 SIGKILL…` in [worker.test.ts](../../../packages/skeleton/test/worker.test.ts); [deterministic transcript](deterministic.txt) | Row 2 queries a durable receipt without another model dispatch or double application. Row 4 persists `WorkerResultObserved`, traces the expired authority and quarantines without candidate mutation or outbox acknowledgement. Row 6 retains WorkOrder/continuation/pending command and recovers a fresh episode. The live Claude run also witnesses kill, lease expiry and successful episode 2. |
| AC3 — deterministic worktree lifecycle                        | `WO-009 AC3 deterministic real-Git create, verified cwd/base, collision and dirty cleanup refusal`; row 6; live cleanup receipts                                                                                                                          | Real detached Git create/reuse, exact cwd/base/common repository checks, dirty-file retention and clean removal. No force cleanup.                                                                                                                                                                                                                                                                 |
| AC4 — live status                                             | AC1/4 test plus each live receipt's `inFlight` record                                                                                                                                                                                                     | Separate process observes running/pending/lease timestamps; store bytes stay unchanged. Missing-store status creates no files.                                                                                                                                                                                                                                                                     |
| AC5 — no silent model substitution in either direction        | `WO-009 AC5 missing models fail closed in both directions and both transports; diagnostics stay private`                                                                                                                                                  | Synthetic CLI peers reject required-higher and required-lower selections, exactly one launch each, no fallback flag or retry selection; command remains pending. This proves adapter behavior, not provider-side model identity.                                                                                                                                                                   |
| AC6 — observed canonical launch shape                         | `WO-009 AC6 canonical launch shapes…`; [host probe](host-probe.json); both final live invocations                                                                                                                                                         | Claude `2.1.261` accepts explicit model/high effort, project/local settings, memory disabled, no session persistence and schema output. Codex `0.153.4` accepts explicit model, ignored user config, ephemeral/schema output and restricted profile; effort is `unknown`. Effective model and effort remain unknown for both.                                                                      |

Additional regressions cover incomplete envelopes with partial evidence, invalid
correlation/schema, nonzero exits carrying success-shaped output, stale and
duplicate observations, old/drifted equips refusing before adapter dispatch,
delayed heartbeat/result lease fencing, restart from a durable result prefix,
concurrent dead-host lock reclamation, and abandoned guard/torn-log refusal.
The existing fake scenario checks retain rows 1, 3 and 5 and the frozen semantic
trace. [deterministic.txt](deterministic.txt) contains the 35-test targeted run;
[full-suite.txt](full-suite.txt) captures the successful `npm test` gate: 236
workspace tests, 8 identity-corpus tests, the delivery/lifecycle shell fixtures,
publication coverage and edition freshness, generated-index validation, and
the unchanged WO-029 artifact evidence. An initial full run stopped on stale
edition source locks; both outlines and their locks were updated before this
passing run. A final build confirms reuse of the kernel's canonical receipt and
envelope types, with emitted worker-protocol bytes unchanged from the tested run.

The bounded [probe script](../../../scripts/probe-worker-hosts.mjs) reads only
installed versions/help and synthetic sandbox fixtures. The Codex named profile
allowed its mounted read, denied an unmounted sibling read, and denied a write
inside the read mount. Actual model access is narrower still: the host supplies
the synthetic inventory and disables model tools, memory, ambient instructions,
MCP, apps, plugins and delegation. The authenticated CLI broker still has its
own runtime/authentication access; hostile same-user brokers and general
environment provisioning are outside this profile. No account settings changed.

Earlier attempts are retained in [live-diagnostic.json](live-diagnostic.json)
and [claude-diagnostic.json](claude-diagnostic.json). One lacked sufficiently
specific failure diagnostics; another exposed an executor-added invalid
cross-field restriction on blocked envelopes. The restriction was removed,
partial results now remain unapplied evidence, and the prompt clarifies the
executor inspection phase. A first kill/recovery attempt also failed result
validation before these structured diagnostic receipts existed. These failures
do not count as passes; the final receipt above was rerun after the recovery
and lease fixes. Synthetic diagnostics contain a private-output sentinel that
tests prove never enters the canonical store.

The store uses one exclusive writer, fsynced JSONL appends and immutable result
receipts. Recovery of read-only inspection is idempotent; arbitrary external
writes, a durable background scheduler, real verifier episodes, SQLite,
general mounts and model benchmarking remain outside WO-009. Beacon claims
remain self-reported and never refresh host liveness. An abandoned acquisition
guard or torn log fails closed for inspection. The [runbook](../../../packages/skeleton/README.md#disposable-workers)
gives the exact demo/status, recovery, probe and live-gate commands.

Write-back covers domain 02, architecture 03, roadmap 06, compatibility 10,
roles 13, package/root entry points, the dated discovery addendum, planning map,
capability reassessment, publication heading index and both edition outlines/locks,
and appended ledger receipt. No new dependencies or
kernel/compiler changes were needed. The release assignment and exact heartbeat,
lease and deadline policy complete previously unassigned details within the
work order's authorized scope.
