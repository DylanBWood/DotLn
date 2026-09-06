# WO-031 implementation evidence

WO-031 adds `resume usage [--json]` and optional opaque account labels. It
prepares application `v0.10.1` above `v0.10.0`; component versions and runtime
schemas are unchanged. The [ideation receipt](ideation.md) is part of the same
verification subject and records the separate publication-guidance change.

**Actor:** Codex CLI 0.153.4; GPT-6 Astra, max effort, operator-attested selection.
The CLI version was observed locally; there is no effective-session readback.

## Behavior and evidence

The existing multi-order reader owns every source segment. A shared phase-pairing
helper serves latest-attempt status and all-attempt usage. The usage command
reads no Git history, checkpoints, provider data, or private mapping; both output
forms leave control events, current.md, and Beacons unchanged. Completion actors
carry a label only when the flag or shell default supplies one. Historical
events remain untouched; missing labels project `not-applicable`.

| Criterion                                                      | Executable evidence                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Three orders, actor/phase grouping, retry and unknown endpoint | `scripts/test-resume.sh` checks exact totals and every actor and work-order group, then independently parses the text form into those records. Its fixture has two harnesses, two models, two labels, different versions/efforts, a failed verification and retry, a missing endpoint, a negative span, a zero span and an incomplete final review. |
| Read-only output                                               | The fixture runs both CLI forms and the direct dispatcher, compares every segment and a deliberately stale current.md with `cmp`, rejects unsupported arguments without mutation, and refuses any attempted subprocess during the direct observation.                                                                                               |
| Labels and shell default                                       | Eleven invalid forms, missing/duplicate flags and an invalid environment default refuse before append. Both accepted labels, environment fallback, explicit override, and all four completion paths run through the actual dispatcher.                                                                                                              |
| Historical absence and projections                             | Tests keep an omitted field absent in stored events, check `not-applicable` in usage/status/current, check a present label in the index, and enforce labelled report-header parity.                                                                                                                                                                 |
| Private mapping                                                | Instrumented filesystem calls during usage refuse any access to the synthetic private lane. `git check-ignore` succeeds for its mapping path. Production scripts contain no private-mapping path lookup.                                                                                                                                            |
| Documentation                                                  | Product 02/03/06/07/09, the playbook, documentation map, root release claim, planning map and ledger are updated. Publication locks and the work-order index are regenerated.                                                                                                                                                                       |
| Compatibility and full gate                                    | The existing timing regressions cover latest completed attempts, in-flight retries, reactivation, legacy absence and backward clocks. The release-surface check accepts `v0.10.1` and unchanged component versions. The full repository gate is recorded below after execution.                                                                     |

The [fixture transcript](resume-fixtures.txt) records the successful focused
suite. The usage report is itself a WO-031 deliverable; its output alone is not
the correctness oracle. The explicit synthetic expectations and existing timing
regressions independently check its pairing and totals. The lifecycle completion
command also uses the modified resume helper, whose normal and refused paths
are exercised by the repository's real-Git fixtures.

## Activation-log observation

The [JSON report](usage-at-activation.json) and [text report](usage-at-activation.txt)
describe the log before this executor's completion event. The
[source record](control-at-activation.json) pins the segment event counts and
SHA-256 values. Regenerating usage before the completion transition reproduced
the first raw report byte for byte. The saved JSON uses repository formatting;
its parsed content is the same report.

Across 26 orders, the report contains 88 completed attempts, 20 with both
timestamps and 68 with an unknown endpoint. The known signed spans sum to
77,936,313 ms (about 21.65 hours). They include waiting and interruptions;
concurrent spans can overlap, and completion actors are attested claims.

| Actor with known time   | Harness version | Effort | Attempts | Known signed ms | Unknown attempts |
| ----------------------- | --------------- | ------ | -------: | --------------: | ---------------: |
| GPT-6 Astra / Codex CLI | 0.153.4         | max    |        2 |      14,240,465 |                0 |
| GPT-6 Astra / Codex CLI | 0.153.2         | max    |        5 |      47,584,884 |                1 |
| Opus / Claude Code      | 2.1.261         | max    |        7 |       6,797,902 |                0 |
| Fable / Claude Code     | 2.1.261         | max    |        7 |       9,313,062 |                0 |

These rows combine phases for readability; the linked reports preserve the
exact model strings, every actor/phase group, each work order, and the remaining
67 attempts whose durations are all unknown. Forty-four historical completions
also lack an actor attestation. All activation-log labels are `not-applicable`.
The active WO-031 has zero completed attempts in this snapshot. No clock recovery,
token count, price, cost, attention estimate, or account identity is supplied.

## Handoff

`DOTLN_ACCOUNT_LABEL=a1 npm test` passed with exit 0: formatting, all shell
suites, the usage/label fixtures, publication coverage for 228 headings and both
edition locks, index freshness, the clean TypeScript rebuild, 236 package tests,
eight identity-corpus tests, and four frozen artifact checks. The fixture suites
clear inherited account labels and explicitly supply their own actors; this run
checks that an operator's shell default does not contaminate unrelated evidence.
The release-surface check and `git diff --check` passed. No dependency was added.

The source includes the operator's continuation default: finish ideation and
continue the active work through the evidence gate to ready to verify. The
publication changes are a separate coherent commit from the usage implementation
when the final reviewer commits the reviewed series. Independent verification,
final review, and publication retain their existing roles.
