# WO-125 implementation evidence

The [repair receipt](repair.md) records the subsequent VER-001 fixes, narrowed
gate-input protection, current fixtures and replacement evidence editions.
The implementation measurements below retain their original scope and date.

The Codex transport now forwards an explicitly requested `low`, `medium`,
`high`, `xhigh` or `max` as `-c model_reasoning_effort="<level>"` on observed
CLI `0.154.0`. `unknown` retains the original argument bytes on `0.153.4` and
`0.154.0`. An explicit level on the historical version refuses before spawning
and names the new discovery record. The existing host records requested effort
as a launch claim; effective model and effort remain `unknown`.

## Evidence

| Obligation                         | Executed evidence                                                                                                                                                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Five observed effort rows          | [Sanitized discovery](../../discovery/codex-effort-2026-09-11.json): five authenticated, schema-bound launches on `0.154.0`, requested `gpt-6-astra`, all exit 0 and `turn.completed`, no effort fields.                               |
| Exact forwarding and durable claim | `node --test packages/skeleton/dist/test/worker.test.js`: 18 passing tests, including each observed argument vector and each persisted `host-launch` claim.                                                                            |
| Preserve `unknown`                 | The [pre-change arguments](../../../packages/skeleton/fixtures/codex-unknown-args.json) match both admitted versions byte for byte. Existing vendor-process fixtures are unchanged.                                                    |
| Plan command at `max`              | `node --test scripts/test-plan-refutation.mjs`: 25 passing tests, including the actual CLI entry with `--transport codex-cli-exec --model gpt-6-astra --effort max` and a synthetic executable.                                        |
| Fresh feedback edition             | [Feedback](feedback/feedback.json): ten passing present regressions and ten failing removal tests; a live Codex `max` verification completed all acceptance rows. The audit and verifier event streams are retained beside the report. |
| Fresh authority bundle edition     | [Authority](authority.json) and [bundle comparison](bundle-diff.json): four unchanged programs, four widening refusals, nine runtime denials and 27 matching bundle comparisons.                                                       |
| Release preparation                | `npm run release -- prepare --local`: application `v0.17.2` above the observed local `v0.17.1` baseline; skeleton `0.15.2`; other components and contracts unchanged.                                                                  |
| Full gate                          | `npm run harness -- evidence`: 37 suites passed, zero failed, 613.10 seconds; 78 fresh tasks. This includes the fast-gate obligations. `git diff --check` passed.                                                                      |

The successful full gate was recorded at `2026-09-11T20:40:31.819Z`. The
canonical gate is rerun after final report preparation so the lifecycle handoff
binds the completed report bytes as well. The work-order verifier and final
reviewer are separate dispatches.

The first canonical gate passed 12 suites before stale publication locks and
authority bundle evidence stopped the remaining suites at preflight. Reviewing
the affected product sections justified refreshing the two edition locks; a
new WO-125 authority edition retains the earlier bundle observations. The
artifact-identity, verification and feedback checks already passed, so their
unchanged historical editions remain selected where applicable.

## Reproduction and limits

Build, then run `node scripts/probe-codex-effort.mjs --out
docs/discovery/<new-public-record>.json` on an authenticated runner outside the
parent sandbox. The script retains only positive, sanitized observations and
numeric usage. It refuses an existing destination. The five launches took
25,335 ms in aggregate and used 49,106 tokens from Codex result envelopes.
These are single synthetic observations per level, not evidence of reasoning
quality, effective settings or support on unobserved versions/models.

The source-pinned feedback run used
`DOTLN_LIVE_WORKERS=1 node packages/skeleton/dist/src/dotln.js feedback-audit
--store .runtime/wo125-feedback --transport codex-cli-exec --model gpt-6-astra
--effort max`. It consumed 84,184 result-envelope tokens. Its accounting appears
under the meter's verifier role because that helper attributes its model audit
there; it does not replace the independent WO-125 verifier.

[Decisions](decisions.md) record the mission contribution, all eight system
traps, NoOp and intervention risks, citation correction, exact observation and
release choice. Product 07, the runtime map, environment addendum and refutation
README carry the durable write-backs. The decisions index discharges this
pre-2026-09-09 order's former ledger duty.

The executor uses Codex CLI `0.154.0`, GPT-6 Astra at `max`, with source
`operator-attested` under the repository default; this is not effective-session
readback. The initial usage query had no post-entry counter and refused; a
subsequent query succeeded. Release preparation first rejected prose-only
decision entries; the same receipt was corrected to the established JSON shape
and preparation then passed. No test failure was hidden by changing a claim.

## Handoff assessment

The transport-selection goal is met: all five observed levels reach the process
and persisted launch claim, and the plan entry accepts `max`. The preserved
`unknown` bytes and existing authority restrictions address the intervention
risks recorded in D001. The full gate and fresh editions support the bounded
change; these observations do not establish a model-quality benefit or broaden
the version boundary. The eight-trap assessment remains applicable.

At `2026-09-11T20:40:37.343Z`, the executor meter reported 8,887,807 total tokens
from `codex-transcript-counter`, scope `dispatch`, including 8,619,008 cached
input tokens. The first successful checkpoint was 716,300 total tokens. These
counts include useful work, required output delivery, diagnosis and waiting;
the five probe and feedback-helper counts above are separate observations.
No equivalent completed alternative was measured, so there is no measured
efficiency comparison. The final report retry can reuse successful source
checks. The required broad checks and current-byte document delivery dominate
the process surrounding this small adapter change; that cost is recorded
without weakening the gate or claiming a saving.
