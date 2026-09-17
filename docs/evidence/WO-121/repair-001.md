# WO-121 repair 001 — release fixture maintenance race

Dispatch: `resume: fix`, 2026-09-17. Failure source:
[VER-001 F1](../../verifications/WO-121/VER-001.md). Executor: Codex CLI
0.154.0, GPT-6 Astra, ultra (normalized xhigh with subagent workflows), source
`codex-session-readback`. One writable root; one read-only delegated review.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

The release fixture disables automatic maintenance in its disposable origin,
main and integrator repositories before they acquire data. The origin also
disables post-receive maintenance. Shared template copies inherit these settings.
All release assertions and clone failure diagnostics remain. Production release
code, presence behavior, generated hooks and component versions do not change
in this repair. [D004](decisions.md#wo-121-d004) records the choice and alternatives.

The baseline reproduced the failure in `runtime-close-matching`. Git Trace2
established the following ordering in that synthetic fixture:

| UTC on 2026-09-17 | Observed event |
| --- | --- |
| 00:46:24.727 | The branch push's receive-pack child starts detached repacking |
| 00:46:24.730 | The integrator's local clone starts |
| 00:46:24.819 | The clone fails copying an object that disappeared |
| 00:46:24.825 | The source repack exits successfully |

The local raw trace is `.runtime/wo121-repair/baseline-trace.jsonl`; it remains
ignored. These observations strengthen VER-001's automatic-maintenance diagnosis.
They do not establish pre-existence by running `main`; that remains an inference
from the earlier diagnostic-only diff.

The operator selected removal of VER-001 O2's redundant authorization assertion.
The assertion constructed its request, envelope and context from literals and
never consumed return state. It and its unused import are removed. The diagnostic
now reports the resident's observed kill/completion result. The negative away
stream, return state, cancellation count and completed actor checks remain,
including both return signals and all three dispositions.

| Executed check | Result |
| --- | --- |
| Baseline `bash scripts/test-release.sh --case runtime_refresh` | Exit 1, reproduced F1 with traced overlap |
| Repaired `bash scripts/test-release.sh --case runtime_refresh` | Exit 0; all six scenarios, fresh repositories |
| `bash scripts/test-release.sh --prepare-template <local-template>` then `--case runtime_refresh --template <local-template>` | Both exit 0; all six scenarios using copied repositories |
| Trace2 starts across repaired fresh run | 12 clones, zero maintenance and zero repack processes |
| Trace2 starts across template preparation and copied run | 7 clones, zero maintenance and zero repack processes |
| Baseline trace comparison | 4 clones, 20 maintenance and 4 repack processes before failure |
| `npm run build --silent` | Exit 0 |
| `node --test packages/skeleton/dist/test/presence-signals.test.js`, sandboxed | 6 pass, 1 native-probe skip, 0 failures |
| Same presence command outside the enclosing sandbox | 7 pass, 0 skips, 0 failures |
| `node scripts/harness.mjs check` | Exit 0, 28 generated surfaces |
| `node scripts/feedback-evidence.mjs --check` | Exit 0, current edition remains valid |
| `npm run release -- prepare --local` | Exit 0, staged v0.26.0 remains current; no files changed |
| `bash -n scripts/test-release.sh`; `git diff --check` | Both exit 0 |
| `npm test`, outside the enclosing sandbox | Exit 0; 19 suites passed, 0 failed; 63 fresh tasks; 408.06 seconds |

The repaired logs are under `.runtime/wo121-repair/`. The full repository gate
passes, including `release:case:runtime_refresh` and the skeleton's native
probes. The read-only review found no defects in the bounded repair. This
discharges F1 and the selected O2 cleanup; independent re-verification remains
the next dispatch. The lifecycle result has its separate final cutoff. The native
gate requires an outside-sandbox runner for the existing WO-068 probes noted in
VER-001 L1. Feedback edition 002 remains current because this repair changes no
generated hooks or evidence source inputs. No dependency or component bump is
needed for these test-only changes. No commit or publication is part of this
dispatch.

Entry process-cost counters were unavailable at 00:45:13.286Z, scope dispatch;
tokens, commands, steps and cost are unknown. Final available counters belong in
the ignored usage receipt and handoff. Repeating the targeted scenarios was
necessary to cover both fixture construction paths; no cost reduction is claimed.
