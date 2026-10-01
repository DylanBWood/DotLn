# WO-177 implementation handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.159.3","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

`resume: next` on 2026-10-01. Application target `v0.61.3`, patch above the
observed local baseline `v0.61.2`; component versions and dependencies are
unchanged. [Decisions](decisions.md) record scope, alternatives, the declined
economy experiment, evidence and reopening conditions. Effective model/effort
and model-performance differences remain unknown.

**Criterion 1:** met. The new `scripts/test-entropy-review.mjs` fixture drives `review --transport codex-cli-exec` without model/effort overrides through fake workers, and observes `gpt-6.1-sol`/`max` in launch arguments and the filed attestation; Claude remains `claude-opus-5-5`/`xhigh`. It also covers refutation, identity/source and unknown effective values. Replaying the Codex default row read from `b51a58a8` in an isolated process makes this same fixture fail with actual `gpt-6-sol` versus expected `gpt-6.1-sol`; this is a targeted historical-row replay, not a full historical-tree gate (D004).
**Criterion 2:** met. Writing-worker and authority defaults select Claude `claude-opus-5-5`/`xhigh` and Codex `gpt-6.1-sol`/`max`; the subagent probe's launch and actor record select Claude `claude-opus-5-5`/`xhigh`. Existing stub fixtures observe arguments and actor records, and the resident-binding rebind hint asserts `gpt-6.1-sol`. The focused four-file run passed 82 tests with 0 failures in 42.963 seconds (D004). Explicit low-effort experiment variants retain their existing selectors.
**Criterion 3:** met. [spawn-agent.md](spawn-agent.md) records both accepted calls in one bounded Codex CLI 0.159.3 session: explicit `model: gpt-6.1-sol`, `reasoning_effort: max`, `fork_turns: none`, and a call omitting model/effort. Each worker's own status reported `gpt-6.1-sol`/`max` from `codex-session-readback`; selected metadata is observed and effective execution is unknown. The in-place harness note carries this result.
**Criterion 4:** met. AI-HARNESS-SECURITY's launch paragraph and the reducer README name the new defaults in place; the harness readback section records the spawn result. Their measured growth is 375 and 85 bytes, within the 600/200-byte allowances. decisions.md and the generated decisions index contain D001–D005 (D005).
**Criterion 5:** met. `npm test -- --review` passed 33 suites, 0 failed, 78 fresh tasks in 421.171 seconds; `npm run test:docs` passed 24 checks, 0 failed in 38.676 seconds. Both passing rows bind code identity `99b0a04c498b8a0ee949746c8d88f23c139159632263e235844db7cb8b2b4e7c`, recorded at `2026-10-01T19:47:32.350Z` and `2026-10-01T19:48:33.229Z`. `git diff --check`, build and publication checks passed; package manifests, lockfile and package sources equal HEAD. The completion checks final document bytes inline (D005).

No adjacent queue item remains. Seven existing textual follow-up matches keep
their dispositions for the reasons in D005; this patch does not edit their
named implementation seams. The two probe workers spawned no descendants and
reported no writes. Actor-attested session count is two; the harness counter
reported zero observed admissions and an unknown uncounted remainder, so it is
not used as proof of zero workers. Final usage stays in ignored receipts and
the response. Independent verification and final review use their separate
dispatches.
