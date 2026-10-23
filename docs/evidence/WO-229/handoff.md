# WO-229 executor handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.164.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

Host-lane diagnostics distinguish this checkout, another checkout and an
unknown relation without exposing checkout paths. Gate rows and summaries
separate lane waiting from work, slow planning samples report both medians,
and `harness lanes` inspects the registry without changing it. The repair
preserves observed relations beyond the diagnostic cap and uses the
operator-authorized four-slot declarations request. Local exclusivity is
unchanged. Application v0.93.0 is prepared locally.

## Acceptance judgments

**Criterion 1:** met — the passing complete review includes the real waiting
gate, own nested holder, symlink alias and legacy-record fixtures in
`scripts/test-host-guard.test.mjs`. They check relation labels and omitted
checkout paths. The repaired long-wait probe reports zero path leaks in
output and recorded attribution. See [implementation evidence](README.md),
[repair controls](repair-controls.json) and [repair runs](repair-gate-runs.json).

**Criterion 2:** met — the timeline fixtures establish a 1,550 ms interval
union instead of a sum and `laneWaitMs + gapMs = waitMs`. Compact relation
changes survive the separate 32-entry diagnostic cap; long waits, 80
alternating relation changes, mixed holders, lock waiting, stopped gates and
a child joining after an overlap reservation are covered. Runner and planning
fixtures strip the new fields on reuse. The repaired real gate attributes
6,802 of 6,812 ms to another checkout, leaving 10 ms unobserved; the static
holder attributes 7,059 of 7,063 ms. The complete row records 1,157 ms total
lane wait and a critical-path split of 264 ms lane wait plus 162 ms gap,
totaling 426 ms. The summary omits zero-rounded figures while recorded
milliseconds remain unchanged. [Original controls](controls.json) and
[repair controls](repair-controls.json) retain the positive and negative
observations.

**Criterion 3:** met — planning fixtures bind each sample to its unique child
marker, ignore an unrelated candidate, and produce a 110 s wall median and
10 s execution median with contention marked. D001 chooses execution cost
for `holds`; the host context reports relation aggregates. Failed or timed-out
samples remain unavailable with retained contention when their row exists.
The planning suite passes in the complete repair review; the original
[paired controls](controls.json) retain the mutation that fails by counting
waiting as execution cost.

**Criterion 4:** met — the actual `node scripts/harness.mjs lanes` fixture
prints capacity and sanitized live-holder fields, leaves all registry bytes
unchanged, does not take the lock, and preserves stale records. Missing roots
are not created; an unprepared native census is reported unavailable. The
usage includes `lanes`. Host fixtures pass in the complete repair review;
the original read-only positive and negative arms remain in
[controls.json](controls.json).

**Criterion 5:** met — [structural-need.json](structural-need.json) contains
42 successful CPU/RSS/wall samples: three runs for seven tasks in each of core
and a fixture export. [Sizing](sizing.json) includes successful observations
from retained incomplete attempts. Against capacity eight, format requests
three slots; configuration-root, registrations, generated, host and kit
verification request two. Declarations requests its measured four under the
operator's explicit exception, recorded in D022, the amended order and
[sizing-repair.json](sizing-repair.json). Every structural task retains all
local lanes. The stronger [sibling comparison](repair-controls.json) records
2,079 ms document wait below the complete gate's longest task of 3,060 ms,
with two complete peers admitted after the document gate's last admission.
The full-capacity control waits 7,353 ms against a 3,068 ms longest task and
has no later complete admission. This fixture also passes in the complete
repair review. The original comparison did not establish the criterion;
its evidence is retained without that claim.

**Criterion 6:** met — `npm test -- --review` passed at
2026-10-23T12:44:05.000Z with 40 suites, 106 fresh tasks, zero failures and no
unrun tasks. The separate bounded `npm test -- --only evidence-sources`
passed at 2026-10-23T12:46:00.775Z with eight checks and no failures.
[Repair runs](repair-gate-runs.json) preserve both rows. The final current-tree
`npm run test:docs` row is consumed by repair completion; `git diff --check`
is clean. Package manifests and the lockfile are unchanged. Authority,
artifact-identity and verification remain WO-229 revision 001; feedback is
carried from WO-225/feedback-001, preserving the WO-217 audit. Sync and the
evidence-source check confirm those editions current. Product 07, the gate
architecture and kit instructions contain the write-backs; publication
checking passed.

## Review and corrections

self-review: found 6; fixed 6; recorded 0

Those counts describe the original implementation's two read-only
`codex-spawn-agent` workers, both `gpt-6.1-sol` at `max`, given only the order
and frozen diffs. The adversary reported two actionable findings; the improver
reported four, including two shared findings and one correction finding.
All were fixed, and both workers confirmed zero remaining findings.
[Their reports and controls](self-review.md) distinguish six worker reports
from four distinct implementation issues. No worker was spawned for this
repair; the executor reviewed the repair directly.

The repair closes both findings in the immutable VER-001 report. D021 keeps
attribution independent of diagnostic retention and clips it to each waiter's
own interval. Direct review additionally caught an overlap boundary that
could otherwise attribute an ended wait to a later child; its regression
passes. D022 records the operator-authorized sizing exception and the
stronger concurrency fixture. D023 completes the queued summary-rounding
repair. All three associated follow-ups are settled, and the adjacent queue
has no remaining item.

D024 records a sequencing error: the executor started the first repair
review before sync finished, stopped it canonically, confirmed sync's
successful completion, and ran the fresh passing review. The stopped attempt
is retained separately and supplies no passing evidence. The original
implementation's failed, stopped and passing attempts remain in
[gate-runs.json](gate-runs.json); repair attempts are in
[repair-gate-runs.json](repair-gate-runs.json).

## Outcome, cost and limits

The outcome matches the amended order: waiting is visible and excluded from
the planning cost judgment, while the operator still sees wall time. The
measured requests preserve local exclusivity and satisfy the unchanged wait
bound in the stronger finite workload. Keeping declarations at full capacity
reproduced the failure. The operator authorized its measured four-slot need;
no admission-order change was made.

The complete repair pass took 1,666,586 ms; the separate evidence-source gate
took 90,859 ms. The stopped review took 11,657 ms. These durations include
waiting; the complete pass used code identity
`8b8351e604dbfcd61436b9aea257adc9342e63e26bc36639611f3810ce288092`.
The subsequent report and decision-index edits do not change that identity.

Usage was read at handoff from `codex-transcript-counter`, dispatch scope,
with observation cutoff 2026-10-23T12:46:21.146Z. Final counters stay in the
ignored receipt and operator response; monetary cost is unknown. This repair
session spawned zero workers. Harness-observed admissions are also zero;
the unobserved remainder is unknown.

Relation unions can overlap when different relations are observed together;
the gate total counts each instant once. Unobserved time, registry-lock delay
and legacy records can remain unknown. Observed relations are retained past
the diagnostic cap, including on stop. Read-only native inspection requires
an already prepared reader. The 300 s planning budget still yields unavailable
samples on timeout without retry. Measurements are finite evidence, not a
worst-case or fairness guarantee; core kit verification uses the fixture
export because core has no kit manifest. No live feedback episode is owed,
and the resource-reader source used by that audit remains unchanged.

The measurement export and scratch repositories were removed; the final
material inventory found no disposable repository. All executor-started gate
commands and their evidence waiters finish before repair completion. No
separate monitor or worker remains. Independent verification and final review
remain separate dispatches.
