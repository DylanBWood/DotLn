# WO-141 implementation evidence

**Actor attestation:** harness `codex-cli`; harness version `0.154.0`;
model `gpt-6-astra`; effort `xhigh` (subagents; raw `ultra`);
source `codex-session-readback`.

Dispatch: `resume: next`. Implementation is in the selected `wo-141` worktree;
the parent is its sole writer. A read-only worker inspected integration and
attribution risks; this assistance is not independent verification.

The shared `observed-facts` runtime projects the current clock, journaled task
dispatches and last observed states, gate rows and dispatch usage. Stop records
a lexical hedge without a blocking decision, and the next prompt/lifecycle
boundary delivers its measurement once. Unknown quantities remain unmeasured.
The meter reads individual correction and hedge events, preserves their
recorded order and phase, and groups explicitly named judgment units.

| Obligation | Executable evidence |
| --- | --- |
| Observed facts and missing cause codes | `scripts/test-observed-facts.mjs`: clock, two tasks, two gate rows, partial counters and source |
| Known/unknown hedge, factual/unknown text, quote and fence exclusions | lexical fixtures, including dispatch at 14:06 and observation at 14:32 |
| Stop stays nonblocking and next boundary delivers once | direct boundary fixtures and generated hook integration in `scripts/test-harness.mjs` |
| Two typed corrections plus one hedge yield 3 | direct counter and `collectMeta` regression in `scripts/test-process-debt.mjs`, including session reuse across orders |
| Codex briefing/lifecycle path | `observedFactsReport` fixture selects the current transcript and scans final text plus command handoff |
| Bundle, documents and full gate | final command outcomes are recorded below; local gate receipts remain authoritative |

FUP-0130 was already allocated to WO-141 by its 2026-09-17 disposition; this
implementation supplies the per-order, per-phase and per-unit measurements it
requested. The security runbook's hook-boundary section and judgment-unit
wording remain unchanged. Application `v0.29.1` and skeleton `0.25.1` are staged as patches above
locally observed application `v0.29.0`; there is no new dependency.

The bounded adjacent repair changes three hook-wiring fixture assertions in
`scripts/test-process-debt.mjs`: presence observers return empty JSON while the
governance assertions remain. All three targeted checks passed. The operator
explicitly confirmed proceeding with this repair during implementation.

The read-only audit found false timing substitutions and loss of historical
correction counts. Regression fixtures now distinguish dispatch age from task
completion, gate duration from gate age or retry count, and retain only prior
snapshots explicitly derived from session journals. Configured correction-token
hooks also have a regression proving one count per prompt across both hooks
in either execution order. The session hook owns the standard token measurement;
the effect hook marks its matching journal record as already measured. A pure
source module supplies the counter to source-only lifecycle worktrees.

The new source helper is included in both explicit fixture copy lists, including
`scripts/test-beacon-fixture.mjs`. The beacon privacy fixture in
`scripts/test-control-beacons.mjs` now reads the labeled directory line from the
expanded briefing; all six of its checks pass. These are additional fixture
inputs for review. A Stop journal assertion now checks for exactly one pending
advisory alongside the facts block.

Authority and feedback revision 001 are recorded under this order and selected
by `docs/evidence/current.json`. The existing live Codex feedback verifier
completed its matrix with model `gpt-6-astra`, effort `xhigh`; the recorder checked
the exact current source/report bytes. Console selfhost JSON, terminal and HTML
snapshots were regenerated and checked. Earlier evidence editions remain intact.

The [decisions](decisions.md) describe alternatives and reopening conditions.
The [ideation receipt](ideation-permission-trial.md) adds the operator's
reversible permission-mode trial to the documentary verification subject.

Limits: this is lexical measurement, not semantic truth checking. Typed
`correction:` events and detected hedges are the observable floor, not a count
of all mistakes. Unit attribution uses explicit names. Task state is the last
recorded observation, not a liveness probe. Unsupported or absent task metadata
is unknown. Codex has no Stop hook: an assistant final answer emitted after the
last lifecycle command can be scanned only at a later boundary. Transcript
scanning streams bounded records; records above one MiB are not scanned. Raw phrases
and transcript-derived local identifiers remain in ignored journals, not this
evidence report. No new refusal or turn-holding behavior is introduced.

Validation cutoff: 2026-09-17T21:03:39.082Z, from the local product-gate receipt.
`npm test` passed all 19 suites with 63 fresh tasks; `git diff --check` is clean.
The scanner's ten fixtures passed, with the bounded lexical scan measured at
0.789 ms (a fixture measurement, not a bound for every transcript).

The full harness-fixture run passed 47 cases and exposed one obsolete Stop-output
assertion; the corrected case passed its focused rerun. The full process-debt
run passed 72 cases and exposed one missing source-helper copy; that corrected
case passed its focused rerun. The documentation sweep passed 15 checks and
exposed two planning checks affected by the execution-note format; both passed
after those notes were placed under the existing execution-record heading.
Authority, feedback, artifact, verification, harness, publication and console
document checks passed. These results are full sweeps plus focused repairs,
not a claim that every sweep was repeated after its fixture-only correction.

Earlier stopped or failed gate attempts are not passing evidence. One stop was
unnecessary: the executor misread the runner entry before checking the existing
test import. The import already wired the new fixtures, so no change was made.
Current source and authored text were reviewed; generated and oversized surfaces
use their diffs and generation/check evidence. Independent WO-141 verification
and final review remain separate dispatches.
