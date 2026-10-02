# WO-107 executor handoff

Executor: Codex CLI 0.160.0, model `gpt-6-astra`, effort `max`, source
`codex-session-readback`. Test-evidence cutoff: 2026-10-02T02:25:38.668Z.
This is implementation evidence; independent verification and final review
remain separate dispatches. Local release preparation assigned v0.64.1.

**Criterion 1:** met — The [observation corpus](../../../corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl) contains all 36 scenarios from both declared seeds: 72 records, 612 measured samples and 138 warm-ups. Every record carries its source/protocol identity, environment, complete registry, distributions and run/invocation load boundaries.

**Criterion 2:** met — `node --test --test-concurrency=1 corpus/harness/wo107-schema.test.mjs` passed all 13 tests over the complete corpus, including schema, scheduling, retained statistics, command receipts, the exact classification exception, original-run byte retention and read-only comparison checks.

**Criterion 3:** met — The harness generated the [comparison](../../../corpus/baselines/WO-107-comparison.md) from the observations. `--compare --check` passed with unchanged observation/report bytes. The report presents all distributions, all pairwise descriptive differences and boundary load, with no performance verdict or threshold.

**Criterion 4:** met — The runner appends complete execution groups and refuses a previously recorded seed. Every declared measured repetition enters its statistics. The first 36 records retain SHA-256 `34226e64115c7dacc983677268e1c228448aee34907cf2a4cf292c01bbe14ccb`; the long first-run sample and failed classification attempt remain retained.

**Criterion 5:** met — All eight declared timing/resource metrics have count, min/p25/p50/p90/max, mean and population standard deviation. Raw samples accompany their distributions. Machine-load observations are explicitly boundary samples; CPU and heap/RSS describe the harness process, and child CPU/memory is explicitly unmeasured. See the [provisional schema](../../../corpus/baselines/SCHEMA-WO-107.md).

**Criterion 6:** met — [D001](decisions.md#wo-107-d001) records both seeds and counts before collection: two warm-ups/nine measured repetitions for function/demo scenarios, one warm-up/three measured repetitions for command scenarios. Existing-file changes are confined to lifecycle records and the exact registry entry authorized in [D007](decisions.md#wo-107-d007). Runtime implementations and test assertions remain at the pinned base.

**Criterion 7:** met — The final `npm run build`, read-only comparison check and all 13 harness/schema tests passed. `npm test -- --serial` passed 29 suites/74 fresh tasks; `npm run test:docs -- --serial` passed 24 suites/24 fresh tasks. `git diff --check` and the new harness files' formatting check passed. Package manifests, dependency lockfile and root test wiring are unchanged. The lifecycle completion performs its final document check inline.

The [run transcript](../../../corpus/manifests/runs/WO-107-2bae7d407af2d5d07d16c5b15dc63134e277eabd.log)
retains both executions, the failed attempt, comparison generation, and six
validation receipts with command, result, raw-output digest and watchdog
summary. The focused store-history test passed. Adjacent item `adjacent-0001`
is completed at queue revision 5 with all three required checks.

Product-gate evidence: `host-gate:43bb28f92fc0145167115d1f951502c8373edb44d7737e581eb4206756c0063f:npm test`,
recorded 2026-10-02T02:20:50.951Z, duration 1048.991 seconds. Document-gate
evidence uses the same code identity with check ID `npm run test:docs`,
recorded 2026-10-02T02:25:38.668Z, duration 77.749 seconds. The standalone
new harness suite supplies its own explicit execution evidence.

Observation SHA-256:
`d433c425636a8c481f4ba0d2a28b1fa9905b4892a28ab7a8fc58b4dd668fc08f`.
Comparison SHA-256:
`f7e19da1bb6f2b0457f0edea15c9b913789d72028b8c01334096b05624b81ff6`.
Transcript SHA-256 through the six validation receipts:
`b179ecc623853e659e874553cd5ed48cc3f7bb11b96ecb5fa19ac49853cdc4c9`.
The [initial source archive](../../../corpus/harness/wo107-initial-protocol/README.md)
binds the first collector revision; executable byte-parity checks bind its
timed code to the second. Both actual protocol hashes remain in the corpus.

Normal Node heap settings were retained. The external watchdog sampled the
owned process tree every 250 ms, with an 8 GiB aggregate RSS emergency stop
and the other conditions in D003. Campaign peaks were 1,131,249,664 and
1,129,332,736 bytes; the product-gate peak was 1,239,662,592 bytes. All three
recorded zero additional swap and no cutoff. These are sampled maxima, not
hard OS quotas; brief peaks or descendants that reparent between samples may
be missed. No mutation probe or automatic retry after a memory cutoff ran.

Interpretation remains limited by one host, three measured command repetitions,
ambient load, filesystem caches, retained collector state and the disclosed
classification/corpus-inventory difference between executions. The second
collector loads the prior records for append validation. The comparison makes
no claim of an identical workspace, isolated function allocation, statistical
significance or an efficiency-level promotion.

[D008](decisions.md#wo-107-d008) judges the outcome and six matched existing
follow-ups. FUP-0044's suggested activation trigger is visible to final review;
the presentation-surface candidate remains unallocated and outside this order.
The other matches retain their existing routes; no product-document or
unrelated implementation changes were made.
