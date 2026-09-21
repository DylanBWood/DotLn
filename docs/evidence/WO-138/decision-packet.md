inconclusive: only T2, the fixed public-input discovery-candidate ranking task,
met every pre-registered floor in the final matched matrix.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

## Decision and method

The local actor kind may rank T2's six public discovery candidates under the
fixed read-only contract, with host validation of complete candidate coverage.
T1 receipt abstraction and T3 hook-journal classification remain unqualified.
The pilot outcome is `inconclusive`, with blocker `Only T2 met every
pre-registered floor`. This is a fixed-cell inspection qualification, not a
capability level or permission for private inputs, writing, implementation or
independent verification. No no-egress claim is made.

The canonical [38 records](episodes/) contain 30 baselines (three tasks, two
transports, five repeats), five one-factor cells and three local unexpected-input
cells. All use final probe SHA-256
`3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907`.
Both transports consume the same retained [inputs.json](inputs.json), generated
once from the public receipt, real discovery producer over the seeded scratch
repository, and labeled hook fixture. Evaluation checks every input, prompt,
schema and build binding before computing the [results](results.json).

The local artifact is WO-137's Qwen3.6 27B Q4_K_M, SHA-256
`33625d8dc3a5dd8d88c324d47db58561b11f7072816287078bfe58b4c55782f9`.
Post-load runner inventory identifies it; the request alias alone does not.
The remote comparator is `gpt-5.6-sol` through codex-cli 0.155.1 at xhigh,
with model-side tools and network disabled. Local decoding stays temperature
0, top-p 1, seed 424242, reasoning effort none, 768 output tokens. Live episodes
ran sequentially outside product gates; local cleanup observed model unload
and server stop. The manifests record the shared input hash and run times.

The operator's original held-out ranking is unchanged, with a self-reported
60 seconds of ranking time. No operator intervened within any episode.
Schema validity and agreement are host-computed, never self-reported success.

## Baselines

All six groups returned five schema-valid envelopes. Values below are medians;
the result file retains every repeat's agreement.

| Task | Model | Valid | Agreement | Latency, ms | Tokens/s |
| --- | --- | ---: | ---: | ---: | ---: |
| T1 receipt abstraction | local | 5/5 | 0.100000 | 11,152.439 | 17.897 |
| T1 receipt abstraction | remote | 5/5 | 1.000000 | 9,154.829 | 31.022 |
| T2 candidate ranking | local | 5/5 | 0.828571 | 12,075.799 | 18.135 |
| T2 candidate ranking | remote | 5/5 | 0.828571 | 16,596.313 | 30.586 |
| T3 hook classification | local | 5/5 | 0.833333 | 25,131.474 | 15.280 |
| T3 hook classification | remote | 5/5 | 1.000000 | 14,227.731 | 32.753 |

Local agreement is invariant across each five-repeat baseline. Remote T1 and
T3 are also invariant at 1.0. Remote T2 scored 1.0 once and 0.828571 four times;
its median equals the local median. Every baseline had zero interventions and
median latency below 120 seconds. T2 meets its 0.7 Spearman floor and the
ten-point comparator floor. T1 fails its 0.9 agreement and comparator floors;
T3 fails both at 0.833333 against 1.0 remotely. T1's structurally valid fields
still contain incorrect receipt values; length compliance did not fix accuracy.

## Support and unexpected-input cells

Each factor record identifies its distinct cell build and corresponding
baseline build; only the named support differs within each comparison.

| Support | Model | Agreement | Difference from baseline median |
| --- | --- | ---: | ---: |
| T1 field map | local | 0.100000 | 0 |
| T2 triage rubric | local | 0.771429 | -0.057142 |
| T2 triage rubric | remote | 0.885714 | +0.057143 |
| T3 label definitions | local | 1.000000 | +0.166667 |
| T3 label definitions | remote | 1.000000 | 0 |

These single support cells do not replace the five-repeat baselines. T3's
definitions supply both the instruction and its closed-label definitions as
one named support. T1's missing-verdict input produced a retained typed failure
(`invalid T1 criteriaMet`). T2's missing-evidence input returned a validated
`blocked` envelope requesting human direction, with zero actual intervention.
T3's unknown event failed because the model classified instead of blocking.

## Repair and retained attempts

[VER-001](../../verifications/WO-138/VER-001.md) found that the original remote
T2 requests were rejected before inference for `uniqueItems`. That subject,
including its invalid qualification claim, is preserved unchanged under
[invalid-schema-007](attempts/invalid-schema-007/README.md). Host uniqueness
checks remain; the emitted schema no longer uses that unsupported keyword.
Remote errors now retain their bounded, sanitized diagnostic and exit status.
The evaluator marks an unavailable comparator unmeasured and cannot qualify it.

The first repair matrix reached the remote model but failed an independent
cross-transport provenance check: separate discovery runs produced differing
stderr hashes because a failing test's stack embeds its random scratch path.
All 38 episodes and their historical results remain under
[unmatched-input-008](attempts/unmatched-input-008/README.md), unscored.
The final collector pins the real generated input once, without changing the
seeded test or rewriting any recorded hash. T1's schema now exposes the same
40-character bounds already enforced by the host. Both schemas were fixed
before the final matrix began; prompts, oracles, thresholds and ranking were
not tuned after trial evidence. Earlier setup and gate-overlap attempts remain.

Independent numerical recomputation and matched-baseline checks passed for
all 38 final records. The focused suite also checks all record bindings and
host-valid envelopes against the retained snapshot. [Repair details](repair.md)
name the checks and correction decisions.

## Limits and next qualification

Five repeats of one fixed task/build cell do not estimate population
reliability. The T2 oracle is one person's ordering of one six-candidate fixture;
its agreement values explicitly retain disagreement. Latency and throughput
are single-host observations, not portable performance claims. Local throughput
uses runner statistics; remote throughput is output tokens divided by client
elapsed time. Energy, memory-use distributions and USD cost were not measured.

T1 needs a separately registered inspection accuracy qualification. T3 needs
a repeated qualification of its label-definition support that meets both
agreement floors. A later implementation experiment must test the actual write
envelope, rollback and independent checks; a verification experiment must
test independence, adversarial finding quality, immutable evidence and refusal
to self-certify. Private inputs require a separately established attributable
no-egress boundary. None of those extensions is qualified here.
