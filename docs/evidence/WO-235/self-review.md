# WO-235 repair reviews for VER-004

Three fresh independent `dotln-worker` agents reviewed this repair of
[VER-004](../../verifications/WO-235/VER-004.md), in which the operator directed
removing everything this order adds for operator messages
([D063](decisions.md#wo-235-d063)). Each was launched once with the amended
order, VER-004, D063 and the dispatch checkpoint
`refs/dotln/checkpoint/WO-235/23` to diff against. Each was then rechecked and
asked to confirm the last fixes through the same agent. That used 3 of the
20-agent cap. No reviewer changed a working-tree file, ref or index entry; the
executor remained the sole writer. The criteria adversary ran bounded probes,
the design improver only read, and the consistency reviewer ran read-only plan,
register and index checks. In its final write-back check the consistency
reviewer also ran `git write-tree` by mistake, which added one loose tree object
under `.git/objects` and changed nothing else. Its final check of the handoff,
these counts, the amendment binding, the indexes and the publication locks found
every item consistent.

Counts are of distinct issues. A transfer that repeated another reviewer's own
finding is counted once, under the reviewer that raised it first.

| Reviewer | Found | Fixed | Recorded | Outcome |
| --- | ---: | ---: | ---: | --- |
| Criteria adversary | 8 | 5 | 3 | First pass, four, all fixed. The order still required the completion parity fixture the design improver had asked to delete; criteria 3 and 5 and step 3 now rest on source parity. D063 and the order had called VER-004's queued-words expectation closed; they now say it is withdrawn, and the fixture pins the new behavior. Operator-control precedence was undocumented and untested; it is now stated and pinned. Criterion 9 overclaimed Stop parity; it now names the runtime pins and the hedge exemption. Its transfer on `meta.mjs`'s case-insensitive prefix reading is recorded with no change, because every prefix splits that way on `main`. Recheck: an `operator override:` pair is not added, because leaving override appends lifecycle records that WO-158's fixture covers; the untracked `planning-document.mjs` link needs no change, because the document check resolves targets on disk. Confirm: the order's "contract-derived skeleton" wording, fixed. |
| Design improver | 25 | 18 | 7 | First pass, fourteen and three transfers. Fixed: the kit README layout and its dangling security reference; the architecture and product 05 paragraph order; product 07's leftover checklist sentence, its skeleton source and its dated sentences; the fragile completion parity fixture; the oracle chain, now one ordered list; the quality pass wording; the "distinct identity" phrase; and the drift row's alignment. Recorded with reasons: merging the history test, the role-rule list in `executor-supports.test.ts`, a prefix helper, reordering role procedures (it would re-mint every role hash for no behavior), `planning-document.mjs` branch parsing, a document-row test helper, and the opening-fence transfer (`main`'s rule for every prefix). Recheck: six text and test points, all fixed. Confirm: a `finally` that could mask a failure and two unwrapped paragraphs, fixed. |
| Consistency reviewer | 8 | 7 | 1 | First pass, six and one transfer. Fixed: the work-order map's WO-235 row and candidates 7, 11 and 12; D063's follow-up list; the retired reviewer and planner quality-pass raises; product 07's session-command row; the post-edit sync; and the security paragraph's placement after the six refusals. Recorded: the sequence title that still promises no operator direction is dropped stays with planning (D057, FUP-7d3d2e7566c8923e). Recheck: the stale meter snapshot, refreshed by release preparation. |

self-review: found 41; fixed 30; recorded 11

[WO-235-D063](decisions.md#wo-235-d063) records the removal, the withdrawn
VER-004 expectation, the retired budget raises and the follow-up
FUP-8331693069c2747d, which returns the operator-message follow-ups this order
no longer carries to planning. The recorded items are design choices or
planning-owned text, not defects left in the subject, except the sequence
title, which D063 names for the next planning pass.
