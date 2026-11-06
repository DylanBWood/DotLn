# WO-257 repair handoff

**Date:** 2026-11-06. **Dispatch:** `resume: fix`.

The repair closes VER-001 F1 and F2: merging preserves the table vocabulary
accepted by validation, and every merged finding has a unique identity that a
later review can reference. Both transport and recorded-part filing validate
the merged result. The independent review also found and repaired two bounded
issues in this order: criterion history after a failed final review, and the
feature registry's missing regeneration notice. Decisions D041 and D042 record
the evidence, alternatives and reopening conditions.

The [earlier implementation handoff](implementation-handoff.md) is preserved
unchanged as a dated record. [VER-001](../../verifications/WO-257/VER-001.md)
remains the immutable failed judgment of the earlier implementation. The
criterion lines below judge the repaired candidate; the new gate evidence is
identified under criterion 20.

## Criteria

**Criterion 1:** met. `renderMetaTable` renders one sentence beginning "Against WO-997, the previous closed order:" listing wall clock, tokens, USD, commands, steps, bound stops and bound acceptances once each (`scripts/test-process-debt.mjs`, the subject meter case; process-debt). D004.

**Criterion 2:** met. The emitted planner root carries the no-update sentence naming a journaled `planning:` or `ideation:` dispatch and a pending entropy review or refutation dispatch; `node scripts/launchpad.mjs update --finish` under a planted planning row is refused naming the operator's in-session request, admitted with `--operator-request --capture <file> --capture-hash sha256:<digest>`, journaled and recorded in the sibling receipt (`scripts/test-launchpad-update.mjs`; launchpad); `harness check` passes in the generated preflight. D005.

**Criterion 3:** met. A fixture export without `documents.json` reaches `README.md` and its linked pages through the `front-page` default, and `How to start: README.md.` counts as a link (`scripts/test-docs-check.mjs` WO-257 case; docs-check-fixtures). D008.

**Criterion 4:** met. The release-notice fixture checks the declared generated-page renderer table, its rendering-function closure, shared regeneration commands, settings triggers and the source-only case. The repair adds the feature registry, whose words appear in FEATURES.md, and a registry-only expectation for `npm run meta` (`scripts/test-release-preparation.mjs`; complete gate, release-preparation). D009, D034–D036 and D042. D036's broader import-classification follow-up remains separate.

**Criterion 5:** met. The target-subject receipt renders `<tmp>/…`, labels the planning branch, names the uninstalled copy, refuses the planted summary naming the line, passes docs-check, and the correction route keeps the retained original and rebinds the hashes (`scripts/test-entropy-review.mjs` criterion 5 case; plan-refutation). D010.

**Criterion 6:** met. A record filed by `target-records` ends with one provenance line naming the launchpad by its release display name (screened as its own surface, advisory when unset), the launchpad tree at filing (kept in the pending operation, so a retry writes the same bytes) and the record's path there, against which its relative links resolve (`scripts/test-target-worktree-publish.mjs`; target-worktree). D011, D031.

**Criterion 7:** met. The export fixture without product 00 passes `npm run plan -- check` between an order change and the receipt, and a product 00 present at a receipt's revision and removed by a later commit is refused by the committed judgment as a changed input by name, not by a thrown read (`scripts/test-launchpad-planning.mjs`; launchpad-planning). D012, D035, D036.

**Criterion 8:** met. The index fixture retains the executor's ordinal beside later met, waived and defective judgments. Its added lifecycle sequence preserves the later verification through a failed final review and repair dispatch, then requires a newer verification for a fresh handoff (`scripts/test-work-orders.mjs`; complete gate, work-orders-fixtures). The independent round-2 probe also covers interleaved legacy events, separate control segments and reactivation. D013 and D042.

**Criterion 9:** met. Bootstrap in a fixture clone with a registered target and no mapping prints the diagnostic naming the places read (this checkout, the primary checkout, the main worktree) before any check fails, a linked worktree whose committed configuration registers the target reads the primary checkout's mapping, and a malformed mapping is named (`scripts/test-launchpad-export.mjs`; launchpad). D014, D031, D034.

**Criterion 10:** met. A valid header plus a malformed duplicate is refused naming both lines, and a header whose value is followed by a note, by text at a word boundary, or sits on the line after the label is read by main's expression anchored at each counted label (`scripts/test-target-worktree-release.mjs` four criterion 10 cases; target-worktree). D015, D034, D035, D036.

**Criterion 11:** met. The block fixture journals `planning:`, class `direction`, role `planner` at the dispatch line; the same text without the block the same; prose then a quoted dispatch none; the embedded Codex reader agrees; `harnessWorkerWords` reads `fable` after the block; a `<task-notification>` opening is journaled as `leadingElement` (`packages/compiler/test/harness.test.ts` WO-257 case; compiler; `scripts/test-harness.mjs` WO-226 rows; harness-fixtures). D016, with the cause corrected in D002.

**Criterion 12:** met. The planning fixtures cover measured briefs, document batching, one merged result, missing-batch refusal, recorded parts bound to the plan and brief digest, pointers, the single-worker case and `--since`. The repair regression exercises Items and Traced consumers through both transport and recorded-part filing, preserving alternate headings, column order and extra evidence cells. Multiple long IDs compete with short IDs appearing before and after them and across batches; the final result validates and a subsequent review addresses every finding (`scripts/test-review-worker.mjs`; complete gate, plan-refutation). Both VER-001 reproductions pass after failing before the repair. The criteria reviewer independently passed four batches with 24 mixed IDs and a round-999 recheck. D017, D031, D034–D035 and D041.

**Criterion 13:** met. The separate-track fixture's subject lists the two open members after the sequenced orders under `subject.separateTrack`, the receipt validates after a member closes (the fold read at the receipt's revision), a receipt filed before the key keeps its subject, `amend-order` on one member is admitted; the closed member and the other workstream's order are not added (`scripts/test-plan-refutation.mjs` criterion 13 cases; plan-refutation); the export fixture's `plan refute` prompt names both members after WO-001 (`scripts/test-launchpad-planning.mjs`; launchpad-planning). D018, D031.

**Criterion 14:** met. A rules-recorded entry whose row is only in a retained lane passes with and without `order`; an entry with no row is refused naming the live directory and the retained lanes (`scripts/test-plan-refutation.mjs` rules case; plan-refutation). D019.

**Criterion 15:** met. `status` on an edited `current.md` warns naming `npm run resume -- status --refresh`; the refresh rewrites the file, appends no event and prints the same status; the next `status` prints no warning (`scripts/test-resume.sh`; resume). D020.

**Criterion 16:** met. A front page linking a decision record passes the entry-point check; the same link from Start here fails naming the record (`scripts/test-docs-check.mjs` WO-257 case; docs-check-fixtures). D021.

**Criterion 17:** met. The emitted `.claude/settings.json` and the Copilot settings carry `Bash(node scripts/worktree.mjs publish *)` beside WO-246's two rules; `harness check` passes; a release changing the settings emitter prints the new-session line (`scripts/test-harness.mjs` 'three publish helpers'; harness-fixtures; `scripts/test-release-preparation.mjs`; release-preparation). D022.

**Criterion 18:** met. README retains the Map link to `docs/README.md` and the public/private starter routes in Try it. The unchanged front-page content retains the earlier document-check evidence; the current document gate is recorded under criterion 20. The unchanged entry-point implementation and its fixtures are covered by the complete gate; the earlier `plan documents` observation is retained in the implementation handoff. D023.

**Criterion 19:** met. The kit guide and product 07 describe the delivered fixes, including semantic batch columns, unique recheckable finding IDs and verification chronology. `npm run publication:check` passed after synchronization: all 256 headings indexed, both voice projections current. D008–D010, D017–D027, D041 and D042.

**Criterion 20:** met. After D043, `npm test -- --review` passed all 46 suites with 0 failures and 120 fresh tasks in 0 h 44 min, started 2026-11-06T17:56:09.158Z and recorded 2026-11-06T18:40:18.711Z. The row binds tree `ad9aacc6f0ec9c361fe4ed848f444d065fcfa16d` and code identity `0649d31c43b5e01cd8b0a61086fa5bdcbb93b74372fd885dd208ab385c73b3b8`; code identity and build output were unchanged throughout the run, with no skipped required suites. `npm run test:docs` then passed all 27 suites and 27 fresh tasks in 0 h 2 min, recorded 2026-11-06T18:43:24.406Z, at the same code identity. Its tree is `a693398957b37e7c290db9e0ad0ee52dc2873cff`; its document tree `b957bb2b4a8a05310c15aac9d09abfd18189b35e` excludes this order's evidence directory, so these final handoff entries retain that row. The earlier complete run passed in 0 h 46 min, but its following document gate exposed the historical comparison repaired in D043. Both fresh rows cover the corrected candidate. `git diff --check` passed. The lockfile changes only internal workspace versions and pins, with no new dependency.

## Repair evidence and independent reviews

Before editing, the two bounded tests in `ver-001/probes.mjs` reproduced the
reported missing table cells and duplicate `b1.F1` IDs. After editing, both
passed. The new regression goes beyond those examples and covers both filing
routes and both table types. The complete `scripts/test-review-worker.mjs`
file passed all 32 tests under the bounded wrapper. The criterion-history
fixture suite passed all 36 tests through `scripts/test-work-orders.sh`, and
the focused release-notice test passed. The first full gate validated the
reviewed code together. The document gate exposed the historical comparison
corrected in D043; all seven focused document-comparison tests passed after
that repair. The second complete gate in criterion 20 covers the final code
and test sources.

Three fresh Codex workers, configured as gpt-6.1-sol at max effort, reviewed
the whole diff against `be65193081651565deb32596d1698d361d6e515d`. Round 1
reviewed tree `8be6c3903449e829e8e8075387faa89e53f1f12d`: criteria found C1,
consistency found F1, and design found no additional issue. Design transferred
its duplicate observation about the registry to consistency. Both findings
were fixed under D042. The same criteria and consistency workers rechecked
the fixes and the whole current change at tree
`9f255ac046924a7ea3b2cb7d79c6e6b2953d2a8b`; both held their prior findings and
returned no new findings. Design needed no recheck. Round 3 was unnecessary
because round 2 caused no code changes. No reviewer ran after the passing
complete gate. The executor subsequently judged the D043 test-only delta
exposed by the document gate; it preserves the old snapshot and independently
checks the added ordinal against its source event.

Reports:

- `docs/control/local/reviews/WO-257/repair-3/round-1-criteria.md`
- `docs/control/local/reviews/WO-257/repair-3/round-1-design.md`
- `docs/control/local/reviews/WO-257/repair-3/round-1-consistency.md`
- `docs/control/local/reviews/WO-257/repair-3/round-2-criteria.md`
- `docs/control/local/reviews/WO-257/repair-3/round-2-consistency.md`

self-review: found 2; fixed 2; recorded 0; rounds 2; unreviewed 28 lines of test source (D043: the executor judged the historical-comparison repair after the ladder and first passing complete run; fresh complete and document gates both passed).

The two original verification findings are additional to that self-review
count. This repair used three launches, two rechecks and two coordination
messages, counted conservatively as seven uses against the cap of 20. The
unhooked host counter reports zero observed launches; it is not substituted
for the manual count. Worker model and effort are configured labels, not an
effective-execution readback.

## Release, preservation and output checks

Local release preparation retained v0.119.0 and the implementation's existing
component versions. No new dependency was added. Main and HEAD were both
`be65193081651565deb32596d1698d361d6e515d` before the complete gate, so no
integration was needed. The adjacent-work queue was empty. No nested repository
was found outside intake. Formatting, synchronization and publication checks
passed before the complete run; synchronization found every generated output
current. The executor read the changed implementation, tests, standing-document
passages, decisions, review reports and current handoff. Generated output claims
use synchronization and gate evidence.

One publication check was initially run before synchronization completed and
reported stale projections; the subsequent check after synchronization passed.
The first attempt to file the round-2 criteria report omitted `--recheck` and
was refused without filing; the corrected command named the prior report and
recorded the worker's result. Neither setup error is presented as a product
failure. The later document failure was a missed historical-test consumer,
recorded and repaired under D043. One progress update conflated kit-action
opt-in with the operator's in-session update request. Inspection of
`scripts/test-launchpad-update.mjs` confirmed that the `--apply` case checks
kit actions, while the separate planning and entropy cases check the captured
update request; the next update corrected that distinction. No branch commit,
push, pull request or publication was performed.

## Limits and outcome

The two reported batch-merger failures and both review findings are repaired.
The outcome matches the repair's aim. The traps recorded in D041 were narrowing
accepted inputs to hide the failures and expanding this work into the shared
preamble limit; the repair does neither. The rejected no-op would have left
criterion 12 unmet.

The live provider route for batched reviews remains untested; both filing
routes and subsequent rechecks were exercised with local fixtures. No real
target publication or operator desktop session was used. VER-001 F3's aggregate
shared-input limit remains the follow-up in D039. D032, D036 and the earlier
implementation handoff retain the other deliberately deferred work. The older
`repair-1/round-4-combined` report remained unavailable, as VER-001 records;
this handoff does not claim to have read it.

## Attestation and process cost

Codex CLI 0.167.0, gpt-6-astra, selected effort max, source
`codex-session-readback`. This is the repair executor's current session
selection. The earlier implementation's Claude attestation belongs only to its
preserved handoff.

**Process cost:** entry 85382 tokens; handoff 43542860 tokens; source codex-transcript-counter

Observed at 2026-11-06T18:40:56.134Z, scope dispatch: 43,542,860 total tokens, including 42,872,064 cached input tokens; 323 recorded tool steps, with wrapped command count unavailable. Elapsed work and waiting: 1 h 51 min, including complete runs of 0 h 46 min and 0 h 44 min. The final complete run removed 2,450 temporary roots, retained one warm fixture under its owning protocol, and reported no cleanup blockers. Final counters after the handoff observation stay in ignored
receipts and the operator response. The transcript total includes repeated
cached input; USD cost is unavailable. The seven worker uses above delivered
two additional concrete fixes and independent confirmation of both. No new
live-provider comparison or token-cost estimate is claimed.
