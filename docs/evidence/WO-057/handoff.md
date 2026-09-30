# WO-057 executor handoff

Actor: Codex CLI `0.159.2`, `gpt-6.1-sol`, effort `max`, source `codex-session-readback`. Subject: [WO-057](../../work-orders/WO-057-browser-runtime-truth.md), application target `v0.56.4` (local-tag observation). Evidence: [browser runtime record](../../discovery/browser-runtime-2026-09-30.md), [JSON packet](../../discovery/browser-runtime-2026-09-30.json), [decisions](decisions.md).

**Criterion 1:** met — The record carries nine labeled rows with command shapes, including the executor's successful online package/browser installs and the unavailable filtering-proxy warmed-cache row. Two fresh confined browser processes produced equal PNG SHA-256 values, with the static fixture's exact bytes and SHA-256 recorded in the JSON.

**Criterion 2:** met — The `parent-sigkill` row records parent PID 14577 and browser PIDs 14578, 14579 and 14580 before SIGKILL; both named-PID process-table snapshots afterward were empty. This is one trial with programmed waits of 250 ms and an additional 1750 ms.

**Criterion 3:** met — The `launch-without-connected-server` row records a launchd-origin process with parent PID 1, a local browser launch and close, removal of CODEX_CI, CODEX_SESSION_ID, CODEX_THREAD_ID and CODEX_VERSION through env -i, and successful removal of its temporary launchd job. No harness was invoked or connected-server endpoint supplied; the native profile denied network.

**Criterion 4:** met — ADR-0002 Amendments names Playwright 1.63.0 and WO-059's planned packages/browser-evidence consumer outside the kernel and compiler. LEGAL Current state records the dated scratch observation and existing third-party inventory/distribution duty. The pinned legal hash declarations and all workspace manifests/lockfile remain unchanged.

**Criterion 5:** met — The dated environment.md addendum and this order's decisions are filed. environment.json remains byte-identical to its baseline, so no evidence edition is re-minted. Decisions and work-order indexes were generated through the canonical commands.

**Criterion 6:** met — npm test passed (28 passed, 0 failed, 72 fresh tasks, 409.73 seconds); npm run test:docs passed (23 fresh tasks, 0 failures); git diff --check passed. No runtime source or workspace dependency has changed. The canonical completion judges the passing product-gate row at the current code identity and runs the document gate inline.

The observation establishes the direct runtime's availability on one host/pin. It does not compare that architecture with Playwright MCP. Filtering-proxy installation remains unavailable. Screenshots cover one static fixture; cleanup and standalone operation each have one trial. Scratch downloads and original probes remain outside the repository for inspection; no bundled artifact is distributed.

Validation also ran an executable consistency check against the retained scratch data: exact package and lockfile pin, fixture and PNG hashes, attributed SIGKILL process tree, launchd parent/removed environment, binary notice hashes, protected workspace surfaces and sanitized packet paths all passed. `npm run publication:check` passed. The adjacent queue was observed at revision 0 with no items; no additional coding agent was used. Final usage counters are retained in ignored harness receipts and reported to the operator with their source, scope and cutoff.
