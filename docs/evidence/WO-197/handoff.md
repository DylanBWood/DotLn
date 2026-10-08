# WO-197 executor handoff

The implementation removes repeated setup and process work while preserving
the tested behavior. Publication's passing standalone run falls from
319.076 s to 110.683 s (65.3%); integration falls from 239.160 s to
134.598 s (43.7%). These are observed samples with recorded host loads.
Both implementation gates pass. Criteria 1 and 2 remain factually unmet as
detailed below; the operator's canonical waivers now cover both obligations.
This repair reconciles that disposition and preserves the verified subject.

Repair dispatch: `resume: fix`, recorded at 2026-10-07T23:35:34.733Z.
[D015](decisions.md#wo-197-d015--resolve-the-verification-findings-through-the-recorded-operator-waivers)
resolves VER-001 F1 and F2 through the `CriterionWaived` events in
[the control log](../../control/orders/WO-197.jsonl), lines 5 and 6.
The bounded entry probe in [repair-validation.json](repair-validation.json)
matches both waiver capture hashes and the unchanged code identity. VER-001
judged criteria 3 through 6 met and found no other defect. This repair changes
the handoff, decision and generated records; it creates no new source change.

The synchronized D014 follow-up `FUP-da00a7d62cf18603` is settled at source
revision 3 by the recorded operator off-ramps. `npm run plan -- check` passes
with 41 receipts and 30 passes. A bounded material inventory returns `[]`;
this repair needs no scratch-repository declaration.

The repair's handoff observations in [repair-validation.json](repair-validation.json)
record `npm run test:docs` passing all 29 fresh tasks in 113.151 s at
2026-10-07T23:43:50.252Z and `npm test -- --review` passing all 35 reported
suites in 7.250 s at 2026-10-07T23:44:09.733Z. The review row composes one
fresh formatting task and 84 passing tasks from the verified implementation
row. It supplies correctness evidence at the same code identity; the timing
table below retains the original fresh measurements. The handoff probe
again matches both waiver captures and the unchanged subject. `git diff
--check` is clean. Completion checks the final document record inline.

Final code identity:
`1641987c5cc467978750209176252c09c126cd9f1a17b7eeecc5e5be40ba5aa8`.
The three final alone runs and both gate rows name this identity. The final
gate observations are in [gate-summary.json](gate-summary.json), with
canonical references, exact task rows, concurrency and sampled host loads.

| Task | Thirty-day median | Required ceiling | Final alone | Own fresh review gate | Timing judgment |
| --- | ---: | ---: | ---: | ---: | --- |
| target-publish | 17.803 s | 22.254 s | 110.683 s | 129.847 s | Misses both |
| worktree-integration | 125.581 s | 156.976 s | 134.598 s | 181.029 s | Meets alone; misses gate |
| harness-fixtures | 261.423 s | 326.779 s | 285.816 s | 289.515 s | Meets both |

**Criterion 1:** unmet — operator-waived by the canonical event at 2026-10-07T23:33:14.916Z; its capture hash matches in [repair-validation.json](repair-validation.json). [task-durations.json](task-durations.json) preserves all 1,124 available matching historical rows since 2026-09-07, including the first crossings and all available case timings. [D001](decisions.md#wo-197-d001--read-the-historical-rows-before-choosing-repairs) records the actual commit-window queries. Every first crossing predates retained per-case timing, so the required case and causal commit-range attribution cannot be established from the available record.

**Criterion 2:** unmet — operator-waived by the canonical event at 2026-10-07T23:34:18.795Z; its capture hash matches in [repair-validation.json](repair-validation.json). The table records both required observations at the final code identity. Publication exceeds 22.254 s in both runs; integration exceeds 156.976 s in the gate; harness meets 326.779 s in both. [D013](decisions.md#wo-197-d013--record-the-final-subjects-gains-and-remaining-limits) records exact figures and load/concurrency evidence without attributing the misses solely to load.

**Criterion 3:** met — all 42 repaired parent cases carry twice-measured duration bounds: 27 publication, 10 integration and 5 harness. [measurements.json](measurements.json) retains three passing cold invocations for each, plus final full-suite and gate passes. The bounds include fixture cleanup. Declaration-time checks and matching/renamed controls prevent silent loss of a bound after a test rename. Existing asserted behavior remains; both independent reviews and their repair reviews found no behavior defect.

**Criterion 4:** met — [vertical-timing.md](vertical-timing.md) records the required bounded spec-reporter run, all 196 passing tests, the three slowest cases and their actual work. Their clocks already advance without wall-clock backoff sleeps, so no vertical case qualifies for the order's timer-repair exception. The final gate separately passes vertical in 837.799 s.

**Criterion 5:** met — [D005](decisions.md#wo-197-d005--preserve-hash-outputs-while-removing-per-byte-bigint-work) records the measured runtime FNV cost and adjacent-0001's exact two-word arithmetic repair. A separate BigInt oracle and fixed identities pass, including 1,007 differential inputs. Queue revision 5 completes the repair with all three declared checks. Compiler patch 0.25.5 and its existing workspace pins are prepared; authority, artifact-identity, verification and feedback all select WO-197 edition 001 and pass their checks.

**Criterion 6:** met — `npm run test:docs` passes 29 fresh tasks in 110.399 s at 2026-10-07T21:16:11.868Z; `npm test -- --review` passes 35 reported suites / 85 fresh tasks in 1477.586 s at 2026-10-07T21:42:47.615Z. Both canonical rows record exit 0, no reused tasks, unchanged identity and unchanged build output. `git diff --check` passes. The package-lock comparison adds no dependency; only the compiler version and its existing workspace pins change. Completion rechecks the final document surface inline.

The 16-CPU host's final alone-run 1/5/15-minute loads were
5.358/5.916/6.318 → 5.825/5.983/6.296 for publication,
5.825/5.983/6.296 → 7.416/6.684/6.534 for integration, and
7.416/6.684/6.534 → 6.611/6.309/6.362 for harness. The gate's nearest
before/after sample brackets were 10.280/10.188/8.123 →
11.791/10.875/8.706, 12.826/10.720/8.370 → 10.933/10.907/8.904, and
5.378/5.827/6.123 → 11.016/6.977/6.440, respectively. These are sampled
brackets, not exact task-boundary readings. Publication and integration
each start alongside three gate peers; harness reserves all four lanes.
This association is recorded without claiming a controlled causal estimate.
The interrupted entry harness run is excluded from speedup percentages.

The adopted changes are the full harness runtime entry for decision
matrices with retained generated-process checks; real event-store guard
fixtures; authentic publication seed reuse with contamination and ownership
controls; focused integration generators with real Git/release/recovery
boundaries and retained real-generator cases; the verification-opening
fixture boundary; and exact faster FNV arithmetic.
[D004–D012](decisions.md#wo-197-d004--repair-the-test-architecture-after-the-operator-correction)
retain the public precedents, measurements and boundary checks. No external
implementation or new testing library is imported. Completed-repair caching,
publication/observer adapters and Git batching were evaluated or bounded and
declined with reasons. The Git batch has an executed real-HEAD freshness
counterexample; its static passing tests are not presented as equivalence.

self-review: found 1; fixed 1; recorded 0 — [criteria adversary](adversary.md): 0/0/0; [design improver](improver.md): 1/1/0. The one optional P3 protects bound registration; both workers reviewed the repair and reported zero new findings.

The implementation's two fresh reviewers received only the work order and complete diff,
then the two-file repair diff. Three earlier research workers plus these
two reviewers are five explicit admissions, with no descendants, below
the configured cap of 20. Supplied worker model/effort: gpt-6.1-sol/max;
effective provider settings were not independently observed. Codex's
automatic admission count is incomplete and is not used to replace this
explicit count. The executor alone wrote this worktree. This repair starts
zero agents; the prior self-review counts and reports remain the
implementation's evidence.

Goal alignment: the broader search produced implemented, measured changes
and an evidence-backed record of rejected alternatives. The complete
historical-attribution and aggregate-timing claims remain unmet; the repair
matches the operator's recorded disposition by applying their waivers.
D002's FUP-edf3b0375b7c0eda stays open for planning; the order's original
carry-ins remain for final-review disposition. Criteria 1 and 2 are
operator-waived in the canonical record; criteria 3 through 6 remain required.
Local release preparation targets v0.69.1. The material inventory is empty;
no scratch repository remains inside the worktree. Experiment files remain
in canonical session scratch. No background monitor remains.

Implementation attestation read from its session briefing on
2026-10-07T21:43:09.293Z: codex-cli 0.161.0, gpt-6-astra, max,
codex-session-readback. Repair attestation from the current dispatch briefing:
codex-cli 0.161.0, gpt-6.1-sol, max, codex-session-readback.
Final process-cost counters belong in the ignored
usage receipt and response, with their observed source, scope and cutoff.
Verification and final review remain separate dispatches.
