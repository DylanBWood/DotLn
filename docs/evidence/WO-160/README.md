# WO-160 implementation evidence

Dispatch: `resume: next`, 2026-09-25. Executor: codex-cli 0.157.0,
gpt-6-astra, ultra (recorded as xhigh with workflows), from Codex session
readback. The root remained the sole writer; three read-only inspection
agents were reused. [Decisions](decisions.md) record the choices and the
operator-authorized item-8 scope expansion (D011).

Repair dispatch: `resume: fix`, 2026-09-25, against [VER-001](../../verifications/WO-160/VER-001.md). The repair executor is codex-cli 0.157.0, gpt-6-sol, ultra (xhigh with workflows) from session readback. One writer and two read-only reviewers were used, with no descendants. D014 records the four fixes and D015 the non-blocking observation dispositions.

## Acceptance evidence

| Item | Implementation and executable evidence |
| --- | --- |
| 1. Amendment withdrawal | `scripts/test-plan-refutation.mjs` checks named unmatched rows, hash-bound withdrawal, preserved history, repeated withdrawal, reauthorization after withdrawal, approve A → approve B → reapprove A, and a WO-159-shaped legacy row with a later strict execution appendix. Planning-log row 25 withdraws WO-111 row 22; rows 24 and 26 bind the authorized WO-160 scope. Current `npm run plan -- check` passes. |
| 2. Entropy selection | `scripts/test-entropy-review.mjs` checks selection and retained legacy bytes. Current `npm run entropy -- subject` reports `latestFiledReview: REVIEW-003` and a fresh-review action because no filed review remains both refuted and undisposed; no undefined path is emitted. `entropy check` passes and still names the REVIEW-001/REFUTATION-001 pre-mechanism pair. |
| 3. Release output | The `prepare_independent` case in `scripts/test-release.sh` compares the message with actual changed files, including PR-meter-only writes and a genuine unchanged case. `scripts/test-release-preparation.mjs` checks returned paths and idempotence. Initial local preparation reported v0.50.0; the VER-002 repair retimed it to v0.51.0 and listed all four changed paths (D020). |
| 4. Evidence JSONL | `scripts/test-runner.test.mjs` admits an evidence-only declaration without a kernel-registry edit and rejects escaping targets and empty explanations. The shared reader serves registrations and the kernel census. WO-111's two declarations now live in `docs/evidence/WO-111/jsonl.json`. |
| 5. Integration | `scripts/test-worktree-integration.mjs` checks the repairing phase, recorded preservation/merge identities, hooks that would reject a commit, conflict continuation and clean-tree adoption of the integration's own stash. Its nine tests passed in the isolated run and again in the full gate. Product 07 documents the helper's admitted phases and commits. |
| 6. Document failures | `scripts/test-runner.test.mjs` checks explicit and default bases, introduced/inherited labels, retained red status, persisted document rows, and unknown results for unavailable comparisons, launch errors and missing glob inputs. |
| 7. Stash pruning | `scripts/test-harness.mjs` checks preview, published-order eligibility, retained unpublished/unnamed stashes, index/untracked byte inventories, shifted selectors, lock contention, invalid UTF-8 and preserved trailing spaces. Loose and packed-ref cases check removal, recovery snapshots, packed-file mode, last-entry behavior, retained entries, and subsequent stash creation. Failed lock or identity checks before recovery leave no new byte inventory. Unsupported ref backends are previewed as retained. |
| 8. Own writes | `scripts/test-process-debt.mjs` checks named-tool write credit, foreign edits inside a later read-only tool window and before explicit observe, an explicitly failed Write, and the delivered-read fallback for an opaque shell output. The observer records a read receipt only for a changed named destination when no tool failure was reported. A same-target race inside that tool window remains unproven by snapshots (D014/D015). |
| 9. Document advisory | `scripts/test-process-debt.mjs` checks missing, stale, passing, later-failing, partial and unexecuted document rows, plus an unreadable per-tree archive on both completion actions. Completion consults the latest exact-tree row and remains advisory when that archive is unreadable. |

## Executed checks

The initial implementation source gate, later judged by VER-001, completed on 2026-09-25 at 17:30:35 UTC:

```text
npm test -- --review
npm test: 36 passed; 0 failed; 619.91 s; 80 fresh tasks
codeIdentity: 9a5ad644fba8dec158c9b8410895f5c6b4641fb1db09faafdf4b98cc39d9290f
treeHash: 84effac543dd53b7fabe88d1eaa1dbed5501c8cd
evidenceRef: host-gate:9a5ad644fba8dec158c9b8410895f5c6b4641fb1db09faafdf4b98cc39d9290f:npm test

npm run test:docs
npm run test:docs: 21 passed; 0 failed; 25.70 s; 21 fresh tasks

git diff --check
exit 0
```

The initial implementation review gate included current authority, generated harness, feedback,
registrations, release, planning, runner, process-debt and integration checks.
The document gate includes publication, formatting, indexes and current
planning/entropy checks. After this report and the owned projections are
finalized, the document gate is rerun so completion observes the final
current tree. Its final row and cutoff remain in the local gate receipts.
Detailed run logs are retained in ignored `docs/control/local/wo160/`.

The earlier complete product run had 35 passing suites and one failing suite
in 584.46 seconds. The ranged-read fixture's foreign edit mistakenly grew
from 52,000 to 68,000 bytes, crossing the 65,536-byte read cap. The correction
uses different content of the original size; the focused three-case rerun
and the initial implementation gate above pass. Three earlier partial gate starts were
explicitly stopped before changes; they recorded no passing gate. These
runs establish correctness, not a measured future time or token saving.

## Release, evidence and limits

Application v0.51.0 retains the order's minor classification after local
release preparation observed the sibling's v0.50.0 tag (D020). Skeleton
0.42.0 → 0.42.1 is the compatible observer fix; its console pin and both
lockfile entries follow. There is no new external dependency. Other component
versions and the independent harness-host protocol version are unchanged.

The generated harness was emitted from the approved observer source.
[authority/001/authority.json](authority/001/authority.json) and [authority/001/bundle-diff.json](authority/001/bundle-diff.json)
form the repair's selected authority edition. The unversioned edition remains
the original implementation evidence. The existing selected feedback
edition and console fixture evidence pass their current-source checks;
no new live feedback episode was needed or claimed.

An inherited label establishes failure recurrence at the base, not common
causation or a waiver. The isolated base checkout uses its own workspace
sources/build output and shares installed external dependencies. Missing
inputs or failed setup produce an unknown comparison while current failure
status stays red.

Stash pruning supports Git's files ref backend with a regular loose or packed
stash ref and a regular reflog. It retains unsupported or ambiguous subjects, checks publication
and ownership again before apply, and writes the blob byte inventory before
removal. It also saves the preceding ref/reflog and packed-ref bytes and
preserves the packed file mode. The multi-file update is recoverable, not
crash-atomic: interruption can leave stale locks or mismatched files requiring
the saved snapshot. No real retained integration stash was
pruned, and no project integration or branch commit was made in this execution.

## VER-001 repair product gate

The repaired source passed `npm test -- --review` on 2026-09-25 at 18:37:31 UTC: 36 suites passed, 0 failed, 80 fresh tasks, 579.93 seconds. The code identity is `f6b48917c74ccd506ea8769bd638f61336a4f96e19ea154457217a861546998b`; the ignored gate row's evidence reference is `host-gate:f6b48917c74ccd506ea8769bd638f61336a4f96e19ea154457217a861546998b:npm test`. The focused legacy, packed stash, and process-debt regressions passed before that gate. `npm run harness -- check`, the selected authority check, `npm run plan -- check`, `npm run entropy -- check`, `npm run release -- check-surfaces --local`, `npm run publication:check` and `git diff --check` passed on the repaired tree before the product gate.

The repair document gate passed at 18:39:52 UTC on tree `b4cbe444f8f5b86d6f4a0a59b092fcc108ee04ba`: 21 suites passed, 0 failed, 21 fresh tasks, 28.02 seconds. Its row is retained in the ignored local gate archive. The final current-tree document row is rerun after this evidence write.

The adjacent queue at revision 38 records O1-O13, O15-O19 and the same-target authorship limit as `adjacent-0001` through `adjacent-0019`, each deferred to FUP-dd20beb6b16ea86c. O14 is covered by the new packed-ref fixture. The queue has no running or next item.

Independent verification and final review remain separate dispatches. The
order's close-stage write-back names FUP-fd5f7c2b91095343 and
FUP-dcadda81305b4fb7; these remain for final review.

## VER-002 repair

Dispatch: `resume: fix`, 2026-09-25. Executor: codex-cli 0.157.0,
gpt-6-astra, xhigh, source `codex-session-readback`. One writer; no subagents.
The failure source is [VER-002 F5](../../verifications/WO-160/VER-002.md).
D018–D020 record the repair, adjacent dispositions and local release retiming.

`stash-drop.mjs` now retains the packed stash row whenever entries remain,
and removes that row only for the last stash. The concurrent regression starts
real `git pack-refs --all --prune` with 30,000 loose fixture tags, suspends it
after packing and before pruning `refs/stash`, applies the helper to a published
bottom entry, then resumes Git. It asserts that Git actually removes the loose
stash ref, the packed bytes stay identical, the top ref resolves, and both the
unpublished and unnamed entries remain. The fixture failed before the fix
(`git rev-parse --verify refs/stash`, exit 128) and passes after it. This widens
and controls the reported interleaving; it does not measure its natural frequency.

O22 is also repaired: reflog rewriting starts with a null OID, including when an
expired prefix left a non-null predecessor. An identical disposable Git control
produces matching ref, reflog bytes and stash list. The comparison failed before
the initialization fix and passes after it. The five focused stash tests passed
in 9.00 seconds; their transcript is retained in ignored
`docs/control/local/wo160/repair-002-stashes.log`.

Queue revision 59 records O22 (`adjacent-0022`) completed. O20–O21 and O23–O28
are individually deferred to FUP-dd20beb6b16ea86c with their causes, intended
fixes, paths, checks and deferral reasons; no running or next item remains.
The error-path rollback, retry and provenance limits in those observations
remain recorded, without claiming they were fixed. No real stash was removed.

The repaired source passed `npm test`: 27 suites passed, 0 failed, 71 fresh
tasks, 289.94 seconds. This is the product selection; the affected harness
fixture suite separately passed through `npm run test:machinery -- --only
harness-fixtures`: build and the complete harness suite passed, 0 failures,
213.11 seconds (212.55 seconds in the harness suite). Product and focused transcripts are in
ignored `docs/control/local/wo160/repair-002-*.log`. Local release retiming
changed the roadmap section linked by the everyday edition; its source lock
was refreshed from `check-publication.mjs --print-locks` after reading that
two-line roadmap change. The other edition's lock stayed current.

The product gate recorded code identity
`60530a6049eefb763b8c1a2dc62aff76950890973e485cb7993be62a05b386e4`
at 2026-09-25T19:29:39.181Z. The final document-gate result is retained in
`docs/control/local/wo160/repair-002-documents.log` and its current-tree gate
row; it runs after this final evidence write. At handoff, retained-stash
reachability and Git-compatible reflog bytes are demonstrated by executed
regressions, matching D018/D019's intended outcome. The independent verifier
still owns the next acceptance judgment.

The first VER-002 repair document gate passed all 21 suites in 24.96 seconds.
Final readback then corrected the acceptance table's stale v0.50.0 present-tense
claim to distinguish initial preparation from D020's v0.51.0 retiming. The
document gate is rerun after that correction; the final receipt and transcript
remain the handoff evidence.
