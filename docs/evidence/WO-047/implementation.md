# WO-047 implementation evidence

**Actor attestation:** {"harness":"codex","harnessVersion":"0.154.0","model":"unknown","effort":"unknown","source":"installed-cli-observed; effective-model-and-effort-unavailable"}

Dispatch: `resume: next`, 2026-09-15. Executor evidence; independent work-order
verification and final review retain their separate operator dispatches.

Repair update: VER-001 F1 identified incomplete publication derivatives in this
delivery. [Repair evidence](repair-001.md) records their correction and the
operator's hold before returning to verification; the original results below
retain their implementation cutoff.

## Delivered behavior

`replay` accepts an optional `(state, event)` environment projector. Each step
projects current pre-step state, samples its RNG and policy once, rejects a
non-finite explicitly projected RNG, and supplies its own event time and caller
predicate registry. Extra untyped callback fields cannot override them. The
exported `defaultEnvironmentProjection` retains the reserved-key fallback,
policy omission/null behavior and raw numeric behavior when no callback is
supplied. Environment property order and complete Decision bytes are preserved.

The skeleton owns `projectRuntimeEnvironment`. All eight runtime replay calls
in scenario, verification, feedback and beacon recovery, plus two evidence-script
calls, pass it explicitly. Product 02 and both component READMEs document the
contract. No event framing, hash preimage, authorization or cadence semantics
change. Typed state slices remain WO-050.

## Evidence and acceptance coverage

[Replay identity transcript](replay-identity.tap): **134 tests passed**, zero failures. It covers the complete kernel
suite, scenario fixtures and authorized/refused beacon sweeps. The scenario
helpers compare each live/replayed variant with omitted and explicit projections:
base, negative, crash recovery, removed support, changed cadence identifiers and
six tampered payloads. Six preserved streams compare complete ReplayResult values
and serialized decisions: WO-003 oracle, current demo, worker recovery,
independent verification, feedback audit and feedback verifier. The original
WO-003 trace oracle also matches exactly.

Kernel regressions cover nested RNG and policy, deterministic seeded draws,
current-state/event inputs at every step, empty logs, non-finite rejection,
replay-owned time/predicates, legacy environment bytes and single-sample output
validation. A module-source test confines reserved application-state lookups to
the default projector; KernelEnv fields and trace names remain legitimate uses.
See WO-047-D001 for that interpretation of criterion 3.

The read-only advisory agent identified the repeated-accessor read and a missing
end-to-end legacy non-finite probe. Both now have regression coverage. The first
focused run had one failure at the pre-existing scenario source-length bound;
two blank separators were removed, preserving the bound and all behavior. No
suppression, dependency or weakened assertion was added.

Artifact and verification generators pass against their existing immutable
editions: four artifact outputs and four verification outputs remain unchanged.
The semantic-hash inventory and frozen oracle are unchanged. Fresh authority and
feedback editions are selected under WO-047. The 24-surface generated harness
check passes with refreshed runtime pins.

Live evidence command:
`DOTLN_LIVE_WORKERS=1 node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo047 --transport codex-cli-exec --model gpt-6-astra --effort max`.
The real CLI verifier completed. `scripts/feedback-evidence.mjs --record-selfhost`
recorded the audited and independently verified streams. Ten regressions pass,
ten removal failures are observed, and the acceptance matrix is complete.
The reported 1,192 fewer instruction bytes apply to the matched feedback
projection, not total execution savings. No native live-hook episode is claimed.

## Release, scope and measurement

Local preparation stages application v0.22.0, kernel 0.5.0 and skeleton 0.18.2.
Compiler and console versions remain unchanged; the skeleton's existing kernel
dependency is updated. The local tag snapshot ends at v0.21.1. Decisions and the
generated decisions index discharge the order's inherited ledger duty; product
02, READMEs and the dated roadmap addendum carry the write-backs.

The adjacent queue is empty at revision 0. This executor is the sole registered
writer; its advisory worker performed read-only analysis. Effective parent model
and effort readback are unavailable and are recorded as unknown. The repository
default is gpt-6-astra/max, not an effective-session observation. Installed CLI
observation: codex-cli 0.154.0. The live verifier was explicitly launched with
gpt-6-astra/max. Entry total tokens were unknown, source unavailable, scope
dispatch, cutoff 2026-09-16T00:17:01.962Z. Final usage stays in ignored receipts
and the handoff; no total-cost reduction is claimed.

## Final gate

`npm test` passed **19 suites / 62 fresh tasks**, zero failures, in **256.13
seconds**. `git diff --check` passed. The gate ran after all application source,
component metadata, generated pins and evidence were final. Subsequent edits
record results and the lifecycle handoff only.

The promised outcome is demonstrated: applications own replay environment
projection while existing fixture decisions and bytes remain unchanged. All
implementation obligations and write-backs are discharged. `implementation-ready`
records the canonical handoff; independent verification and final review remain
separate dispatches.
