# WO-203 repair review

The repair uses two separate executor passes, with no workers launched. The
two-worker rule is for implementation-ready; this dispatch records
repair-complete. The original implementation's worker reports remain in
[self-review.md](self-review.md).

Criteria pass: compared VER-001's repair rules with the changed planner,
renderer and action loop. The planner preserves each mutation kind, refusal
reason, retained hash and interrupted-update branch. Only revision rendering
uses the byte comparisons to count unchanged paths. The bounded fixture
passes all 14 cases, including an identical revision, converged additions and
removals, and the unchanged-upstream local-edit annotation. Both core preview
opt-in states still match the following update and preserve the protected
trees. Each incompatible manual action has a reason and subsequent valid
actions remain visible; both core --apply forms still refuse before writing.
Found 0 additional findings in the criteria pass.

Design pass: reviewed the new hash metadata, the shared row classifier and
the per-action checkpoint. Every staged action failure restores its draft,
rename count and write map; successful hypothetical actions continue to
inform later assessments. Per-action configuration validation occurs only
in report-only mode, preserving actual apply's final-draft validation. The
fixture's invalid-default case followed by a valid default tests that
rollback, rather than only the missing-phrase symptom. A further source pass
found one reference-sharing defect: an object-valued incoming default was
assigned directly to the mutable draft, so a failed nested action altered
the declaration printed in the preview even after draft rollback. The
bounded [action-value-before.log](action-value-before.log) reproduced it.
D013 and adjacent-0002 record the one-assignment isolation fix and the
additional fetched-starter assertion. The same bounded probe passes after
the fix in [action-value-after.log](action-value-after.log). A second finding
was in the fixture: the occupied-destination action named the `orders` root
with the `workOrders` source path, so it exercised a source-root mismatch.
The declaration and assertion now name `workOrders`, matching the checked
configuration mapping and exercising the occupied destination. The README states the manifest
comparison boundary and the distinction between manual reporting and actual
application.

Evidence: [repair-targeted.log](repair-targeted.log), bounded exit 0 at
2026-10-12T22:14:12.582Z; 14 passed, 0 failed; 108,449 ms. The final required
gate rows are recorded in the repaired [handoff.md](handoff.md).

The final focused fixture passes all 14 cases in
[repair-targeted-final.log](repair-targeted-final.log), ended
2026-10-12T22:28:47.624Z in 109,290 ms. Both design findings are fixed: the
object-valued declaration remains unchanged after later hypothetical edits,
and the correctly declared rename now reaches its occupied destination.

self-review: found 2; fixed 2; recorded 0

The required review then encountered one validation timeout in the main
vertical file; all other 35 suites passed. The canonical failed row remains
in [repair-review-failed.json](repair-review-failed.json). D014 records the
bounded dispatch repair and adjacent-0002's revision 2: complementary
statement/workflow tasks retain every case, the product guard, the existing
deadline and the two-task concurrency bound. The actual dispatch and
aggregate-refusal fixtures pass in
[vertical-partition-fixtures.log](vertical-partition-fixtures.log).

The final review gate passes at code identity
`4de390c177f92ce4bb932ad47a79b8d3f592bed430674a702d377ce47958f7d1`:
36 suites, 91 fresh tasks, zero failures, recorded
2026-10-13T00:00:37.363Z. Both main-file partitions and the judgment/recovery
tasks pass within their unchanged bounds, each with zero excluded product-record
reads. The current documentation gate also passes. Canonical references and
criterion judgments are in [checks.json](checks.json) and
[handoff.md](handoff.md); adjacent-0002 is completed.
