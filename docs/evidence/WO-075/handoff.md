# WO-075 — Repair handoff for VER-001-F1

Dispatch: `resume: fix`. The export now establishes commit provenance by
comparing tracked build/emit inputs with the named commit's blobs and walking
actual package inputs independently of Git ignore traversal. Hidden tracked
changes, ignored compilable additions, missing inputs and nonregular inputs
refuse before the build or destination creation. Git status supplies additional
diagnostics. [Repair evidence](repair-f1.md), [D015](decisions.md#wo-075-d015--repair-f1-by-checking-committed-blobs-and-actual-package-paths)
and [D016](decisions.md#wo-075-d016--adjacent-fixture-codex-writer-owner-modes)
record the correction and the adjacent Codex fixture assertion repair. The
filed VER-001 and prior implementation evidence are preserved.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.0","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

The current passing review's code identity is
`a5cefbc4cc6eaea828e04709bcc091d8f119f47ce98718b24b90dced79ca139d`.
[repair-f1-gates.json](repair-f1-gates.json) records the host gate rows, source
hashes, targeted commands and cutoffs. The original live-smoke and cold-start
records below are carried forward: this repair changes neither the runtime,
compiled hook implementation, kit floor nor role skills.

**Criterion 1:** met — the fresh `launchpad` review row passes in 46.805 s, including the clean named-commit rebuild with byte and path-set equality, manifest hashes, correct `packages/<name>/dist/src/` layout and omitted package TypeScript source. The six targeted guard cases pass, and the complete bounded export suite passes 21 tests with 0 failures. Regressions change compiled source, root build configuration and an emit input under both `assume-unchanged` and `skip-worktree`, remove a tracked source under `skip-worktree`, introduce nested ignored source/test paths with spaces, and replace a tracked source with a same-byte symlink. Each mismatch names the input and leaves the destination absent; harmless ignored `.DS_Store` remains admitted. [repair-f1.md](repair-f1.md) and [repair-f1-gates.json](repair-f1-gates.json) supply current evidence; [export-run.md](export-run.md) retains the original 270-file rebuild comparison. D015 corrects the earlier status-only equality claim.

**Criterion 2:** met — the current export suite checks the export's own `node scripts/harness.mjs check`, refuses a one-byte emitted-surface drift, and scans every manifest-listed hook for absolute import specifiers, including static imports, dynamic imports and `new URL` forms. The scanner's refusal controls and relative snapshot imports pass. The clean export emits and checks its own bundle; the current full review's `launchpad` row passes. [repair-f1-gates.json](repair-f1-gates.json) and the original [export-run.md](export-run.md) are the evidence.

**Criterion 3:** met — preserved executor smoke [harness-live/writer-foreign-live-001.json](harness-live/writer-foreign-live-001.json) records an actual generated-hook writer-isolation refusal and role resolution by `resume: next`; [harness-live/executor-001.json](harness-live/executor-001.json) records role resolution and an attribution advisory delegated to host permissions. The smoke actor was Claude Code 2.1.295, launch selector `claude-fable-5` at `xhigh`, with `xhigh` effort observed. Both records report observer finished, no attempted read outside the directed set, bundle equality and export-owned harness check exit 0; process ids, start times and paths are shapes. These are the original one-host smokes, not new repair episodes; their runtime and hook sources are unchanged.

**Criterion 4:** met — preserved [cold-start.json](cold-start.json) names export commit `f6cd1d588565bb5a8c344573722d1d6046566203`: all twelve role/root measurements are 41 bytes below core, with byte-identical skills (export `CLAUDE.md` 6,832 bytes; core 6,873). The repair does not edit either floor or the role skills. The current `npm run test:docs` passing row includes `launchpad-docs`, which freshly asserts the per-role inequality against this checkout.

**Criterion 5:** met — [D006](decisions.md#wo-075-d006--fup-a058e82c0bbd9b6d-deferred) retains the reasoned deferral of FUP-a058e82c0bbd9b6d and its disposed register row. `packages/skeleton/src/usage-observation.mjs` is unchanged, so the criterion's conditional live feedback episode is not owed.

**Criterion 6:** met — product 03 §Platform and instance boundary states the byte comparison and actual package walk in place, without a dated paragraph; its measured 179,381 bytes remain below the 194,488 ceiling. `docs/LEGAL.md` §Current state retains the 2026-10-09 runtime observation and terms; the capability table retains its `WO-075 dated addition (2026-10-09)` and `launchpad.starter` at 1 — demonstrable. Decisions D001–D016 and the generated decisions index are current. Both publication source locks were refreshed after the product correction; `npm run publication:check` reports CURRENT (254/254 and 29/45 source sections).

**Criterion 7:** met — re-mints none: registered runtime/compiler sources, `package.json` and `package-lock.json` are unchanged, and the document gate freshly checks all four current evidence editions retained in [edition-checks.json](edition-checks.json). `npm run format` succeeds; `npm run test:docs` passes 30 suites, 0 failures in 93.555 s (2026-10-09T14:42:48.486Z); `npm test -- --review` passes 39 suites, 0 failures, 89 fresh tasks and 0 reused tasks in 1,401.767 s (2026-10-09T15:06:19.586Z), including launchpad and configuration-root, at the current code identity. `git diff --check` is clean; no dependency was added. [repair-f1-gates.json](repair-f1-gates.json) records those passing rows. Canonical completion performs its additional inline document check.

self-review: found 41; fixed 39; recorded 2 — preserved prior implementation
reviews: [criteria adversary](adversary.md) 13/12/1 and [design improver](improver.md)
28/27/1. Their recorded limits remain D009 (shared running install for rebuilds)
and D008 (hand-written Read directives). These reports and counts are not fresh
repair-worker reviews. This repair used zero new workers; the executor's
separate criterion and design passes are recorded in D015 and D016. VER-001-F1
and the encountered fixture assertion are both repaired; no new unresolved
finding is left only in prose. The original four workers are prior-dispatch
history; this dispatch's explicit worker count is 0 of the configured cap 20.

Goal alignment matched D015: actual inputs establish provenance even when
status is empty; the operator's index flags and ignore rules need no alteration.
The NoOp would leave local compiled bytes labelled with an unchanged commit.
The bounded two-arm comparison judged the same 392 tracked inputs and the same
mismatches: direct blob comparison 38.403 ms, archive/extract comparison 97.878 ms
and 7,731,200 materialized archive bytes. This is input-access evidence, not an
end-to-end export speed claim.

The first repair review exposed the adjacent fixture's thread-only ownership
assertion. It was explicitly stopped at 654.6 s and recorded no passing check;
the isolated case independently reproduced `codex-host` versus `thread`. The
runtime already defines both modes. The repaired fixture verifies the intended
thread's actor identity, reservation and each mode's liveness/process shape.
The isolated case and complete export suite pass; the full review was rerun
from the format step. Adjacent queue revision 9 has no running or next item:
adjacent-0002 is completed; adjacent-0001 remains deferred onto
FUP-749c959a41178a3b. D015 reopens D014 and settles FUP-5d17b4e440f612e9 with the
executed repair evidence. FUP-44639ec9a751d8d1 (D008) remains recorded. Release
preparation retains v0.71.0; no component change requires a bump.

Limits: original live evidence covers one host and the recorded smoke model
(WO-177 owns that pin); non-writer feedback judgments remain advisories under
WO-133. No fork has run its own full gate on the carried runtime; that retains
FUP-8fb7ae17dd0fad5b. D009's install-sharing limit is unchanged. Fixture
repositories are transient under the system temporary root and removed by the
suite; no scratch repository was created inside this worktree. The authored
comparison script uses the canonical ignored session scratch. The gates and
waiters started by this dispatch have exited; no branch commit or publication
occurred. A passing repair handoff leaves re-verification and final review to
separate dispatches.

Process cost: usage is read at handoff through the canonical session command;
final counters, their source, scope and cutoff stay in ignored receipts and the
response. Unavailable counters and USD remain unknown. No new subagent was
started in this repair.
