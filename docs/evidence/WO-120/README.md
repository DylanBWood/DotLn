# WO-120 implementation evidence

Dispatch: `resume: next`. Executor: Codex CLI 0.155.1, gpt-6-astra, xhigh,
from active-session readback. The final product gate passed;
independent verification and final review remain separate dispatches.

The materializer accepts a complete compiler `WorkOrder` and a stable public
provenance key, allocates within the configured `WO-NNN` pool, writes a stable
authority, and activates through the ordinary resume command. `dotln intent`
files the same shape without activation. Index, selected control status and
runtime status expose the same identity and provenance. The input compiled
object is unchanged; downstream compilation uses the returned identity.

| Required claim | Executable evidence |
| --- | --- |
| Authority shape, typed dependencies, index and status | `compiled order materializes, activates and shares index, status and lifecycle`; asserts actual relative index links, provenance, and active phase |
| Same lifecycle | That fixture runs implementation-ready, failing verification, repair, passing re-verification and final-review closure in its disposable repository; a retry leaves the closed order closed |
| Deterministic replay, collision refusal and exhaustion | Allocation replay/missing-draft recovery, changed-contract retry refusal, two child processes with distinct and identical keys, configured roots/range/exhaustion |
| Draft-only intent | Real built `dotln intent` invocation, hostile Markdown rendered as prose, only an allocation event, review edits followed by explicit activation |
| Resident restart | A compiled fixture obtains a derived identity; a real ResidentHost starts, closes and restarts from saved configuration; recompilation and materializer retry retain that identity |
| Existing controls | Typed blockers prevent activation; malformed sections/provenance and symlink destinations refuse; handwritten IDs are skipped and retain their bytes |
| Write-backs | Product 06 navigation and identity; product 07 resume phrases/configuration; publication coverage and source locks; [decisions](decisions.md) plus generated decision index discharge this pre-2026-09-09 order's ledger duty |

[Focused transcript](derived-orders.txt): 11 tests passed. Existing configuration
fixtures (13 tests), work-order index fixtures (21 tests) and the resume suite
passed. The standalone resume command used `env -u CODEX_THREAD_ID`, matching
the canonical runner's isolation of live-session metadata.

`npm run plan -- check`, `npm run publication:check`, local release preparation
and release-surface checks passed. The plan check recognizes the authorized
release assignment. Harness and all four recorded-evidence checks passed; no
historical evidence edition needed replacement. `git diff --check` and formatting
passed before the product gate.

`npm test -- --review` passed: 32 suites, zero failures, 76 fresh tasks in
564.97 seconds. Source: the canonical runner transcript and its `npm test`
host-gate receipt, recorded at 2026-09-22T01:48:55.108Z. The transcript is retained
locally at `docs/control/local/wo120-npm-test-final.log`. This includes the new
derived-order suite, compiler, kernel, skeleton, console and affected control
machinery. The earlier stopped run recorded no passing check (D004).

The final `npm run test:docs` gate also passed: 19 suites, zero failures,
19 fresh tasks in 29.34 seconds, including formatting, publication, planning,
release surfaces and recorded-evidence checks. Its local transcript is
`docs/control/local/wo120-docs-test.log`. Current authored outputs were inspected;
generated indexes were checked through their canonical generators and gates.

Release: application `v0.41.0`, skeleton `0.35.0`; the console dependency pin
follows skeleton. No new dependency. No change to compiler/kernel behavior or
semantic-hash preimages. Package publication controls remain in place.

Limits: allocation serialization is local to one shared launchpad, not a
cross-checkout distributed guarantee. Generated records are public-material
contracts; callers must not supply private paths, secrets or employer material.
Automatic derivation and the UI remain the explicitly separate WO-100/WO-115
consumers. Missing unactivated files can be recovered from the allocation;
missing activated authorities require recovery of their reviewed bytes. The
resident evidence uses a synthetic local fixture and no model or external service.

Goal-alignment outcome: the observed fixtures remove the missing identity and
lifecycle bridge for those consumers while preserving dependency refusal,
human review of intent drafts, handwritten identity, and restart recovery.
No runtime derivation, distributed allocation, token saving or optimization
improvement is claimed. See D001–D004 for alternatives and reopening conditions.
