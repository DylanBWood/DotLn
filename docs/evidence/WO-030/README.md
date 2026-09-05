# WO-030 executor evidence — concurrent control state

This is executor evidence for the staged WO-030 source, pending independent
verification and final review. Codex CLI `0.153.2`; model `gpt-6-astra`, effort
`max`, source `operator-attested` under the execution guide's dated default.
The CLI version was observed locally; the model/effort claim is not effective
session readback. No new dependency or exported package source changed.

## Compatibility baseline

[legacy-fold.json](legacy-fold.json) was captured before the implementation
changed. It records v0.6.0's `foldWorkOrders` over the actual 153-event legacy
log at activation, including WO-030's already-recorded activation. It contains
the input SHA-256 and the v0.6.0 fold implementation SHA-256. The automated
comparison checks that exact input prefix and every per-order state field.
WO-030 itself therefore continues appending to the legacy file.

[legacy-times.json](legacy-times.json) is the byte-exact pre-change
`npm run resume --silent -- times` observation. The updated command matched it
against the actual local refs before any new transition. The portable test
reproduces that observation using a Git stub restricted to the captured named
refs, recorded SHAs, and observed seconds: 120 recovered refs, 18 recorded
append times, and 15 unknown events. It does not fabricate or publish refs.
New segment events add `segment` and use local ordinals; legacy rows retain
their original fields and ordinals.

The activation index comparison changed only selected-order wording, segment
source/prefix descriptions, and the added per-tag segment inventories. Its
per-order lifecycle and release assessments did not change. Later differences
also reflect this order's documented implementation outcome and ordinary
generated lifecycle refreshes.

## Acceptance evidence

| Criteria   | Executable evidence                                                                                                                                                                                              | Observation                                                                                                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1, 4, 5, 7 | [Segment suite](../../../scripts/test-control-segments.mjs), [concurrency fixture](../../../scripts/test-concurrent-control.mjs)                                                                                 | Separate worktrees select their own order; readiness leaves the sibling segment/projection byte-identical; interleaved events remain attributable; legacy storage ownership is retained; main requires explicit selection with multiple open orders.   |
| 2          | [Segment suite](../../../scripts/test-control-segments.mjs)                                                                                                                                                      | Activation/file mismatch and foreign events identify path and ordinal; all 13 command forms refuse without altering control bytes. Duplicate storage ownership also refuses.                                                                           |
| 3          | [Legacy fold](legacy-fold.json), [times](legacy-times.json), [segment suite](../../../scripts/test-control-segments.mjs)                                                                                         | Immutable activation prefix, field-for-field baseline states, byte-identical timing observation, and original ordinal/source labels.                                                                                                                   |
| 6          | [Concurrency transcript](concurrency.txt), [fixture source](../../../scripts/test-concurrent-control.mjs)                                                                                                        | Real Git branches integrate serially; full states survive; WO-901 finishes and validates a no-publish release while WO-902 verifies; local fixture releases attribute WO-901 and WO-902 separately; an old-base third branch retains its prefix proof. |
| 7          | [Resume tests](../../../scripts/test-resume.sh), [checkpoint tests](../../../scripts/test-checkpoint.sh), [worktree tests](../../../scripts/test-worktree.sh), [release tests](../../../scripts/test-release.sh) | Every known in-flight order renders elapsed phases; checkpoint recovery remains scoped; lifecycle peers consume selected-order JSON fields from committed segments and never parse Markdown.                                                           |
| 8          | WO-030 outcome and cited product/playbook/planning write-backs                                                                                                                                                   | Current behavior and migration boundary are documented; first measured paired wave and independent review remain separate evidence.                                                                                                                    |
| 9          | Root `npm test`, `git diff --check`, script line-count table below                                                                                                                                               | Full gate recorded in the work-order outcome; package `src/` and dependencies unchanged; explicit Node types added to all three package tsconfigs.                                                                                                     |

The integration fixture uses the existing shell suite's owned temporary
repository, local bare origin, and deterministic npm/GitHub CLI stubs. Its
release gate exercises release machinery but does not claim real package
installation or network publication. Real repository `npm test` supplies the
actual build and test evidence. [segments.txt](segments.txt) records the focused
control checks, and the concurrency transcript includes the fixture Git log.

## Decisions and limits

Storage ownership lasts for the identity, including a legal reactivation of a
closed order; this reconciles per-order reactivation with the rule that an
order never spans files. The latest closed display uses a closed subject branch
or Git integration order, never timestamps; simultaneous introductions use
segment display order. Views show segments available in the checkout/revision,
not live unmerged sibling worktrees. There is no new workflow schema, lane
generator, admission control, or cross-worktree polling.

The resume, worktree, release, and index machinery being used for this order is
also part of its deliverable. Its executor evidence includes independent
baseline JSON, corruption/refusal checks, and real-Git fixture assertions;
using the new status or completion command alone is not correctness evidence.

## Script line counts against main

Counts include all `scripts/*.mjs` and `scripts/lib/*.mjs`, with new files
reported as zero on main. Tests are included; shell suites are outside this
requested count.

<!-- WO-030-LINE-COUNTS -->

Compared against main at `7c1ea72b244d57cb2eb4ef015076668ab99213f9`; counts are newline counts.

| Script                                                                              |     Main |   WO-030 |     Delta |
| ----------------------------------------------------------------------------------- | -------: | -------: | --------: |
| [scripts/check-publication.mjs](../../../scripts/check-publication.mjs)             |      614 |      614 |         0 |
| [scripts/github-body.mjs](../../../scripts/github-body.mjs)                         |      196 |      196 |         0 |
| [scripts/github-repository.mjs](../../../scripts/github-repository.mjs)             |       84 |       84 |         0 |
| [scripts/lib/control-store.mjs](../../../scripts/lib/control-store.mjs)             |        0 |      195 |      +195 |
| [scripts/lib/control-time.mjs](../../../scripts/lib/control-time.mjs)               |      135 |      135 |         0 |
| [scripts/lib/control.mjs](../../../scripts/lib/control.mjs)                         |      185 |      235 |       +50 |
| [scripts/lib/git.mjs](../../../scripts/lib/git.mjs)                                 |       80 |       80 |         0 |
| [scripts/lib/paths.mjs](../../../scripts/lib/paths.mjs)                             |       70 |       70 |         0 |
| [scripts/lib/release-records.mjs](../../../scripts/lib/release-records.mjs)         |      174 |      183 |        +9 |
| [scripts/release-notes.mjs](../../../scripts/release-notes.mjs)                     |      192 |      192 |         0 |
| [scripts/release.mjs](../../../scripts/release.mjs)                                 |     1758 |     1763 |        +5 |
| [scripts/resume.mjs](../../../scripts/resume.mjs)                                   |      878 |      984 |      +106 |
| [scripts/test-concurrent-control.mjs](../../../scripts/test-concurrent-control.mjs) |        0 |      403 |      +403 |
| [scripts/test-control-segments.mjs](../../../scripts/test-control-segments.mjs)     |        0 |      359 |      +359 |
| [scripts/test-github-body.mjs](../../../scripts/test-github-body.mjs)               |      135 |      135 |         0 |
| [scripts/test-work-orders.mjs](../../../scripts/test-work-orders.mjs)               |      688 |      777 |       +89 |
| [scripts/work-orders.mjs](../../../scripts/work-orders.mjs)                         |      502 |      511 |        +9 |
| [scripts/worktree.mjs](../../../scripts/worktree.mjs)                               |      310 |      311 |        +1 |
| **Total**                                                                           | **6001** | **7227** | **+1226** |
