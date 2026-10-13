# WO-203 repair handoff

VER-001's two blocking rules and its boarded clarification are repaired.
Revision previews distinguish unchanged kit paths, retain kit and action rows
when a manual action is incompatible, and label a locally modified refusal
whose incoming hash is unchanged upstream. The outcome matches the order's
inspect-before-update goal. Application release v0.79.0 is prepared locally;
component runtime versions and dependencies are unchanged.

The prior executor handoff incorrectly judged criterion 3 met from the presence
of a changed path's row. It did not establish the changed set or report
incompatible actions. [VER-001](../../verifications/WO-203/VER-001.md) and
[decisions.md](decisions.md) D012 record that error, the checked evidence and
the implemented correction. The filed verification remains unchanged.

**Criterion 1:** met — both core preview opt-in states report every kit path, refusal reason and retained hash, declared actions, incoming commit/tag, declared build snapshots and proposed receipt. The fixture compares every destination byte, including Git/runtime state and symlinks, and both sibling-record trees; all remain equal and no new pending journal is written. The current review gate's launchpad suite passes in 480,677 ms; [repair-targeted-final.log](repair-targeted-final.log) retains the focused assertions.

**Criterion 2:** met — `planKitUpdate`, `applyKitUpdate` and their `updateKit` composition use one planned value, and `renderUpdatePlan` renders both outputs. The fixture compares 880 preview and following-update plan rows in each opt-in state. The current full launchpad suite passes these assertions.

**Criterion 3:** met — the fetched-starter fixture distinguishes changed and unchanged kit paths, reports zero byte changes for an identical revision, and covers already-converged replacements/additions and absent removals. Local edits and occupied new paths retain refusal/collision rows; unchanged-upstream local edits carry the clarification. Missing or ambiguous phrases, an invalid configuration default and an occupied rename destination produce individual manual-action reasons without suppressing kit rows or later valid actions. Incoming object-valued declarations remain intact. The fixture also covers missing/malformed root and revision manifests and byte preservation. Both actual core `--apply` forms still refuse incompatible actions before writing. These assertions pass in [repair-targeted-final.log](repair-targeted-final.log) and the current full launchpad suite.

**Criterion 4:** met — the manifest-carried client README documents both preview forms, preview-before-update, each output field, unchanged revision rows, individual incompatible manual actions, no destination/sibling writes and no preview receipt. It states the source-build and manifest-comparison boundaries. The README shipping fixture and documentation gate pass.

**Criterion 5:** met — product 03 and product 12 contain the in-place clauses and evidence links; publication locks and the decisions index are current. D004 disposes the three allocated carry-ins: determinable missing inputs refuse before building, post-manifest failures report destination/receipt state, and shared validators remove duplicate logic. FUP-584d6021928bdfdb is settled; generated-path preflight remains deferred as FUP-dc79b4b1065bf66e. D012–D014 record the repair choices. D011, reopened D002 and reopened D010 are settled on their minted follow-ups. Publication and lineage checks pass.

**Criterion 6:** met — `npm test -- --review` passed 36 suites and 91 fresh tasks, zero failures, in 2,137.999 seconds, recorded 2026-10-13T00:00:37.363Z. `npm run test:docs` passed 35 fresh tasks, zero failures, in 133.780 seconds, recorded 2026-10-12T23:24:37.797Z. Both recorded unchanged code identity and build output. `git diff --check` is clean; package manifests and the lockfile have no diff. [checks.json](checks.json) retains the canonical gate references, cutoffs and task results. Completion runs the document gate again after the final authored reports.

Passing code identity:
`4de390c177f92ce4bb932ad47a79b8d3f592bed430674a702d377ce47958f7d1`.

self-review: found 2; fixed 2; recorded 0

The repair used separate executor criteria and design passes, with zero workers
launched. The criteria pass found zero additional findings. The design pass
found and fixed declaration-value aliasing and a mismatched fixture root; its
scope, before/after probe and dispositions are in
[repair-review.md](repair-review.md). D013 records both corrections. The original
implementation's independent workers found one issue and fixed it; their actual
counts and read-only scope remain in [self-review.md](self-review.md).

The required review also encountered a validation timeout: the large main
vertical file exhausted its task clock. The failed canonical row remains in
[repair-review-failed.json](repair-review-failed.json), and D014 records the
bounded dispatch repair. Complementary statement/workflow tasks retain the
main file's cases; judgment and recovery remain separate tasks. All retain the
900-second bound, product guards and two reserved slots, admitting at most two
vertical tasks together. Missing, duplicate, unexecuted, failed and timed-out
members still fail aggregation. The real dispatch and aggregate-refusal
fixtures pass in [vertical-partition-fixtures.log](vertical-partition-fixtures.log),
and the complete runner suite passes.

The final four vertical tasks passed: statements 566.246 seconds, workflow
361.423 seconds, judgment 558.337 seconds and recovery 382.468 seconds. Each
recorded zero excluded product-record reads. Adjacent queue revision 18 records
adjacent-0002 revision 2 completed with all five required passing checks; the
previous adjacent-0001 remains completed and there is no next queued item.
FUP-59e4ca45614477fd settles the reopened dispatch decision on this full result.
No stopped or failed attempt supplies a passing claim.

Limits: a core preview may build the source runtime. Revision preview covers
manifest paths and conservative update judgments; it does not execute or
predict Git's exact three-way merge. Build snapshots are declared harness
metadata, not verification of current runtime bytes. Generated incoming paths
still require a build before an absence refusal until an authoritative
pre-build inventory exists; the final check preserves destination and sibling
state on refusal. D004 names that cost follow-up's reopening condition.

Final authored outputs were read; generated logs and projections were reviewed
through their executed checks. The worktree scan found no nested repositories
outside intake. No branch commit or publication was performed. Re-verification
and final review remain separate lifecycle roles.

Attestation: `codex-cli` 0.162.1; model `gpt-6.1-sol`; effort `max`;
source `codex-session-readback`, from the resumed role briefing. The usage
readback's available total, source, scope and cutoff are reported at handoff;
final counters remain in the ignored receipt and response.
