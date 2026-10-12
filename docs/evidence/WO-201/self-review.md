# WO-201 executor self-review

Two fresh read-only workers each received only the work order and the prepared
diff. Both ran as `gpt-6.1-sol` with `max` effort. Neither wrote files or ran
tests. The prepared diff omitted the oversized generated work-order history;
the pending handoff and final gates were outside their review.

## Criteria adversary

Result: **1 finding; 1 fixed; 0 recorded open**.

Low severity: criterion 3 required byte growth in the decisions, while the
reviewed D001–D009 only pointed toward the measurement artifact. D010 now
records the actual whole-kit growth of 6,175,535 bytes and the net admitted
file-set growth of 6,146,821 bytes. The executor reread D010 and checked those
figures against `gate-in-kit.json`. The worker acknowledged the reported fix
but did not independently reread that addition.

The worker found that a declared skip for `--only <core-only-row>` follows
the order's selection rule; it did not request a new refusal.

## Design, simplicity and maintainability improver

Result: **0 findings; 0 fixed; 0 recorded open**.

The worker found no concrete defect within the order. It checked the shared
runner, verification before other tasks, fresh verification despite reuse,
exclusion/advisory delivery, and fixture assertions binding README lists to
observed selections. Passing fixture evidence was supplied by the diff;
the worker did not execute it.

## Disposition

self-review: found 1; fixed 1; recorded 0

Two earlier read-only input audits informed the suite inventory. An interim
audit found two implementation gaps, both repaired and tested before this
fresh review: successful verifier diagnostics were hidden, and an imported
gate could select its build row from the wrong repository (D007). These are
separate from the two fresh workers' counts above. Four workers were explicitly
spawned in this executor session; no descendants were requested or reported.

## Repair review — 2026-10-12

Executor separate-pass review of the repair against VER-001 and all seven
criteria; no workers were spawned for this repair. The initial worker reports
above remain the record of the implementation review.

The criteria pass checked that publication-fixtures is asserted independently
of the exclusion table, that all three observed selection lists and README
rows still agree, and that the remaining 45 exclusions cite clean evidence
with VER-001's stated limits. The design pass checked that only kit requests
for explicitly excluded suites take the new error path, before scheduling or
evidence recording, and that both throwing and list paths release their state.
No new defect was found in those passes.

Repair findings from VER-001: found 2; fixed 2; recorded 0.
Additional separate-pass findings: found 0; fixed 0; recorded 0.

Executed controls: two focused runner tests pass; three focused export tests
pass, including the actual npm CLI refusals for publication and runner-fixtures.
The first combined export attempt hit a monitor startup failure before the
command ran; its unchanged rerun passes (D016). Full gate evidence is recorded
in the final handoff. No suppression, dependency or component change was added.
