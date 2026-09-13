# WO-128 execution evidence

The two synthetic planning-budget fixtures now declare their own empty
acceptances. The production freshness validator is unchanged. The complete
WO-128 implementation also supplies declared gate load classes, deadline
observations, a load-derived read-only collector bound and task concurrency
traces. Both formerly exclusive suites remain shared after five consecutive
fresh full passes on the operator's host.

## Acceptance evidence

| Criterion                              | Evidence and outcome                                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — twelve historical failures         | [Diagnosis](diagnosis.md#twelve-failed-fresh-gates) and [retained rows](historical-gates.json) list every task, interval, inferred overlap and available solo comparison. Disposed deadline sites remain unknown.                                                                                                                                                                   |
| 2 — reachable deadlines                | [Inventory](diagnosis.md#reachable-wall-clock-inventory), [all standalone baselines](all-isolated-baselines.json), [signal repair](signal-cleanup.json), and [per-site shared comparisons](deadline-comparison.json). Eight observer/slow-double cases pass; semantic timeouts remain deliberate negative cases.                                                                    |
| 3 — task concurrency and critical path | Every measured gate has 78 current task intervals, start peers, predecessor edges and an offline checked critical path. [Fixture results](fixture-results.md) and [filtered TAP](fixture-transcripts.txt) preserve assertions.                                                                                                                                                      |
| 4 — exclusivity decision               | [Series 002](shared-series-002.json) passes all five under the shared cap of four. The flags are removed; the isolated class remains available. [D008](decisions.md#wo-128-d008) records the decision and reversal condition.                                                                                                                                                       |
| 5 — five first-pass fresh gates        | All five runs execute 78 tasks, reuse zero, and pass outside the sandbox on unchanged source/configuration. The checker validates the series. [Series 001](shared-series-001.json) remains failed evidence; a quiet-host negative control justified the signal repair and restart.                                                                                                  |
| 6 — write-backs and checks             | Product 07 records the shared decision and cold-gate trace; decisions/index, FUP-0054's preserved disposition lineage and the order's execution record link this evidence. Fresh npm test passes 12/12 with zero reuse (113,874 ms). The final full gate and diff check are enforced by the canonical evidence command and implementation-ready transition. No dependency is added. |

## Fresh full measurements

| Run | Wall-clock, ms | Fresh tasks | Reused tasks | Result |
| --- | -------------: | ----------: | -----------: | ------ |
| 1   |        689,520 |          78 |            0 | Pass   |
| 2   |        692,702 |          78 |            0 | Pass   |
| 3   |        694,561 |          78 |            0 | Pass   |
| 4   |        697,079 |          78 |            0 | Pass   |
| 5   |        699,430 |          78 |            0 | Pass   |

The median is 694,561 ms versus the retained prior 476,304 ms gate,
45.8% longer. These changed-source observations do not isolate the cost of
measurement or scheduling. There is no speedup claim. Successful-call timing
is enabled only for measurement; normal execution records deadline hits.
Each accepted run contains only the four expected negative-test hits.

[VER-001 F2](../../verifications/WO-128/VER-001.md#findings) isolates the
scheduling cost on one source: the same 78 tasks ran in 462.3 s with the two
hook suites exclusive against 666.5 s shared, so removing the flags costs about
204 s per fresh gate rather than saving the 206 s the order's Cost line
predicted. Criterion 4 prescribes the removal;
[D010](decisions.md#wo-128-d010) records the open operator decision.

The failed first series cost 3,450,874 ms; the accepted series costs
3,473,292 ms, 115.40 minutes combined. Both useful work and waiting
count. Targeted baselines, fresh fast gates, the required live feedback audit
and final canonical gate are additional work, recorded on their own surfaces.

## Scope, provenance and handoff

The signal repair uses explicit readiness after the real release-suite cleanup
traps are installed and signals only the fixture's owned process group. The
15-second bound, signal exit statuses and residue assertions remain. The
negative control establishes a sufficient defect, while the failed historical
shell's precise foreground state was not captured. [D007](decisions.md#wo-128-d007)
preserves that distinction and the rejected alternatives.

The executor is Codex CLI 0.154.0, GPT-6 Astra at max, operator-attested from
the repository default and exposed host metadata; this is not effective-session
model readback. The local usage adapter records codex-transcript-counter,
dispatch scope. The first successful entry observation was 430,396 total
tokens after bootstrap; it is an observation, not a zero-cost starting point.
The pre-gate observation at 22:16:07Z records 41,163,137 total tokens, including
40,151,936 cached input tokens. This is the adapter's dispatch counter,
including useful work and waiting; it is not an incremental billing claim.
The later handoff measurement and phase costs are kept by the canonical usage meter.
The source-pinned read-only feedback audit reports 86,809 result-envelope
tokens separately and does not substitute for formal WO-128 verification.
No unmeasured token or dollar totals are inferred.

Local release preparation assigns application v0.17.3, skeleton 0.15.3 and
console 0.1.5; compiler and kernel versions retain their existing values.
Authority and feedback evidence use new immutable WO-128 editions, preserving
the historical editions. Publication locks and generated harness projections
are refreshed through their existing checks. No branch commit, publication,
push or pull request is part of this execution. Formal verification remains
the separate `resume: verify` dispatch.
