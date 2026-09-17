# WO-052 executor evidence

The implementation stages application `v0.28.0` and skeleton `0.24.0` under the
existing minor classification. Kernel/compiler packages, dependencies, event
schema and hash preimages are unchanged. Actor: Codex CLI `0.154.0`,
`gpt-6-astra`, effort `ultra` (xhigh, mode subagents), source
`codex-session-readback`. Independent verification and final review remain
separate dispatches.

The source host accepts one compiled WorkOrder and supplied authority, creates
the declared target branch/worktree, emits its governed bundle, records the
original focused test, and dispatches the existing source-change transport.
Git observations establish the commit, branch and binary diff SHA-256; the
worker's prose cannot supply them. A distinct immutable store receipt binds the
stable request and both test outcomes. The source slice alone receives the new
event family and that workstream's command/worker lifecycle. The recorded
[reactor diff](reactor.diff) contains no edits to existing slice folds.

| Requirement | Executable evidence | Observed result |
| --- | --- | --- |
| AC1 target lifecycle | `WO-052 AC1 claude` and `AC1 codex` in [source-change-host.test.ts](../../../packages/skeleton/test/source-change-host.test.ts) | Foreign real-Git worktree starts at the declared base, contains a governed bundle, fails the baseline test, receives the double's commit, passes the after-test and records the matching commit/branch/diff receipt. Launchpad HEAD/tree and neighboring sentinel are unchanged. Claude's double exercises all three emitted native guards. |
| AC2 commit recovery | Three `WO-052 AC2 real host SIGKILL` tests | Before-commit kill permits one recovery dispatch after lease expiry. After-commit kill reads Git with no second dispatch. After-receipt kill reuses the original test observations. Every recovered branch has exactly one commit above base and one SourceChangeObserved event. |
| AC3 refusal | `WO-052 AC3 no commit refuses` | Returned edits without a commit produce SourceChangeRefused; HEAD stays at base and explicit finish refuses to discard edits. |
| AC4 additive slice | [reactor-slices.test.ts](../../../packages/skeleton/test/reactor-slices.test.ts), `reactor-identity.mjs --check` | All 19 full historical Decision transcripts remain byte-identical. New payload malformed/cross-order/branch/terminal conflicts refuse. Other slices retain their state. |
| AC5 write-backs | Product 02 actors/events, 03 lifecycle, skeleton runbook, capability table and decisions index | Dated `worker.source-change` assessment is fixture-evidenced L1. The pre-2026-09-09 ledger duty uses [decisions.md](decisions.md) and its generated index row. |
| AC6 checks and evidence | [Targeted suite](targeted.tap), [additional boundaries](boundary.tap), [native route](route.tap), [purity/read inventory](inventory.tap); canonical product gate; selected evidence editions | The combined targeted run passed 97 tests, the added branch/surface and retry tests passed 2, the native-route check passed 1, and the corrected purity/read inventory passed 3, all with zero failures. The final gate is recorded separately at handoff. |

Additional fixtures cover changed request identity, malformed effect receipts,
dirty committed source, unowned ignored files, unmet authority evidence,
authority expiry, revoked/expired/dead-host command routes, appended shell
syntax, wrong cwd/branch/surfaces, terminal deduplication and retry exhaustion.
An effect observation with a failing after-test remains an observation, never
an independent verification pass. Unknown output is represented by a test
signal/error observation rather than invented success.

The [decisions](decisions.md) record the NoOp/trap comparison, the exact-command
integration and release choice. This implementation closes the fixture-level
host gap needed by WO-053. It adds no remote operation, general effect framework
or new operator approval step. No measured operator-efficiency improvement is
claimed. Entry counters were unavailable (dispatch scope, cutoff
2026-09-17T01:55:24.115Z); final counters remain in ignored receipts and the
handoff response.

Limits: the host and its compiled inputs are trusted. An expired lease alone
does not prove an orphan Codex process stopped, and exact command grants are
not OS isolation of arbitrary test scripts. The live source-change proof remains
WO-053. Worktree verification and remote publication remain WO-054/WO-064.
Interrupted preparation or partially completed explicit finish preserves work
but can require inspection; the tested recovery windows cover worker execution
and receipt persistence. No live writing worker was launched for these fixtures.

Evidence cutoff before the final product gate: the fresh WO-052 authority and
feedback revision `001` editions were generated against current source. The
existing read-only feedback audit completed with ten fixtures and a separate
Codex CLI verifier, launched as `gpt-6-astra` with `max` effort. Its audited and
verifier event streams are retained in [feedback-001/](feedback-001/); effective model
settings are not claimed from the launch selectors. Artifact-identity and
synthetic verification evidence still check byte-identically against the
selected WO-121 editions, so they remain selected. The console's current
selfhost fixtures were refreshed from the new recorded audit.
