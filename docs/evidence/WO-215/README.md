# WO-215 — Starter refresh evidence

## Base observation

Dispatch: `resume: next`, 2026-10-13. Before implementation,
`git ls-tree -r --name-only HEAD docs/evidence/siblings` returned no path;
the generated starter entry in `docs/siblings/README.md` said "not evidenced"
for every receipt-derived field. `git for-each-ref refs/replace` returned
no ref.

At 2026-10-13T20:24Z, a bounded read-only `git ls-remote` and fetch into a
disposable bare repository observed the public starter's `main` at
`bc9133e932a00d33c15bc5289d683b8078f51ee4`: one commit, subject "Initial
commit", with an empty tree. No initial paths or `KIT-MANIFEST.json` exist.
This matches the planner's 2026-10-13T18:57Z observation. The scratch
repository was removed; no remote write occurred.

The latest fresh `launchpad` case in main's recorded gate rows lasted
350,967 ms (started 2026-10-13T11:40:43.324Z, finished
2026-10-13T11:46:34.300Z, gate recorded 2026-10-13T11:58:03.830Z; exit 0).
Source: `readGateChecks`, selecting executed, non-reused `launchpad` cases.
The work-order checkout had no gate row at entry.

## Local-remote refresh measurement

A bounded focused run of `node --test --test-name-pattern='starter (refresh publishes|staged tree)'
scripts/test-launchpad.mjs` passed at 2026-10-13T21:20:34Z (20,894 ms Node
process; 17,013 ms refresh body; 71 ms staged-filter body). Every GitHub fixture
URL resolves through fixture-global Git configuration to a local bare repository;
no test uses a network remote. The suite adds three kit preparations: first
export, update and failed verification. Cleanup retries, collision, current and
refusal cases prepare no kit.

| Case | Wall ms |
| --- | ---: |
| First export | 3,595 |
| Initial dirty / ahead / misbound | 63 / 163 / 75 |
| Initial file-directory collision | 175 |
| Update with cleanup fault | 4,446 |
| Cleanup recovery | 359 |
| Current / behind | 333 / 357 |
| Tracked / untracked dirty | 67 / 68 |
| Ahead / diverged | 320 / 334 |
| Wrong repository / wrong owner | 85 / 91 |
| Missing checkout / non-root / wrong branch | 51 / 60 / 64 |
| Main past tag / later starter manifest | 59 / 364 |
| No declaration / dry-run preview | 35 / 345 |
| Failed verification: missing floor | 1,797 |

| Published path | Preparation | Update | Verification | Commit | Push |
| --- | ---: | ---: | ---: | ---: | ---: |
| First export (ms) | 1,224 | 166 | 397 | 47 | 528 |
| Update with cleanup fault (ms) | 1,277 | 155 | 462 | 80 | 291 |

The remaining case time includes admission, fetch, receipt and cleanup work.
The transport comparison's checkout-configured arm exits 128 after a longer
local URL rewrite redirects the same bound URL to a missing fixture remote;
the host-owned lane succeeds using the fixture-global mapping. This supports
D003's choice without relying on network behavior.

## Executed preflights and corrections

The required preflights through step 10 passed: siblings-fixtures,
target-worktree, launchpad (existing and expanded), target-publish,
configuration-root, release, process-debt, launchpad-planning, worktree,
harness-fixtures, siblings, harness, harness-context and launchpad-docs.
The exact gate rows retain identities and durations. The shared floor
regression also passed independently under the bounded wrapper.

Early document checks exposed the unstaged release assignment and then stale
indexes; release preparation, work-order index and meta generation corrected
them before the base document check passed. New fixture failures were a target
record assertion using the default root in a non-default-root fixture, a duplicate
receipt helper name, and a test clone lacking its uncommitted registry input;
the fixtures were corrected and their affected suites passed. No acceptance
assertion was removed. D006 records the product defect found by the missing-floor
case and its shared-boundary correction.

The build and emit generated 34 harness surfaces. `npm run harness -- check`
passed. Authority revision 001 was minted under this order after the old
bundle-diff check reported stale output. Feedback and harness edition checks
passed and retain their historical live evidence; no live episode is claimed.
Publication source locks were refreshed from `check-publication --print-locks`
after the authorized product write-backs; `npm run publication:check` passed.

Step 11's authority-evidence, feedback-evidence, harness-evidence and
evidence-sources preflights passed. Runner-fixtures initially exposed its
explicit release-case inventory missing `starter_refresh`; the inventory was
updated to include that case and the rerun passed. This added input is
`scripts/test-release-fixtures.mjs`; it verifies fixture coverage rather than
changing release behavior.

The independent adversary found two issues and the improver found one. Both then identified the same additional post-commit journal failure window. D008
records all four unique fixes and their executable evidence. Both workers received
only the order and diff, ran as Codex gpt-6.1-sol at max, and wrote no repository
file. The research worker was reused for cleanup recovery analysis; explicit
worker count is three against the configured cap of twenty.

The final focused replay passed at 2026-10-13T21:24:31Z: two tests, 21,589 ms
Node process. It also covers a filter restoring the prior committed blob and
recovery from the recorded tree/parent when the post-commit journal write is
missing. Both workers' focused resolution passes reported no remaining finding;
see self-review.md. `inventoryMaterial` returned an empty array: no nested
scratch repository remained in this worktree.

The first full review gate exposed a stale current role oracle in process-debt:
it still selected the pre-change release-close hashes from the WO-191 snapshot.
D010 records the new linked WO-215 snapshot; every historical snapshot stays
byte-exact and every other role hash is unchanged. Added inputs are
`packages/skeleton/fixtures/wo215-role-baseline.json` and
`scripts/test-process-debt.mjs`. The earlier process-debt preflight ran before
the contributor write-back; this failure was observed after that write-back.

## First fresh review gate and performance watch

The first `npm test -- --review` finished at 2026-10-13T21:54:48Z: 39 suites
passed, one failed (the role oracle corrected in D010), 96 fresh tasks, no
reuse, 1,626.780 seconds. This run is not passing completion evidence.

Launchpad passed in 387.576 seconds against the entry reading of 350.967
seconds. Its 6.291% share of slot-weighted work is below 15%; it is absent
from the recorded critical path and shorter than the longest vertical member
(446.176 seconds). Gate task span was 1,626.391 seconds; slot-weighted work
over four lanes gives 1,540.217 seconds, a 5.595% difference below 10%.
None of FUP-b531e850b70f6d4e's current reopening conditions occurred. D009 and
[gate-cost.json](gate-cost.json) preserve the exact record and judgment.

The corrected snapshot's focused test passed, followed by the complete
process-debt preflight at 2026-10-13T21:57:40Z (98.27 seconds for the task;
99.32 seconds for its gate). Both passed without changing a historical file.


## Passing fresh review and handoff

The second `npm test -- --review` passed at 2026-10-13T22:27:09.680Z:
40 suites, zero failures, 96 fresh tasks, no reuse, 1,611.724 seconds.
Its source and build identities remained unchanged throughout the run.
The preceding `npm run test:docs` passed all 35 tasks at
2026-10-13T22:00:07.194Z in 101.575 seconds.

Launchpad took 383.163 seconds against the 350.967-second entry reading.
It contributed 6.285% of slot-weighted work, was absent from the critical
path and remained shorter than the longest vertical member (441.926 seconds).
Task span was 1,611.411 seconds against a four-lane bound of 1,524.018 seconds,
a 5.734% excess below 10%. None of the performance watch's three current
reopening conditions occurred. Both full runs remain in gate-cost.json;
D009 retains the existing watch without inferring a causal runtime change.

## VER-001 repair

Dispatch: `resume: fix`, 2026-10-13. D012 corrects the earlier handoff's
unsupported judgments of criteria 6 and 11: the release-close dispatch row
omitted the starter effect, and a preview taken before main's fast-forward
returned a false skip. The row now names the effect; publishing previews
judge the proposed merged head, run the starter checks and retain real
close's HEAD/tag guards. Non-publishing previews produce no starter row
on both the new-release and existing-release paths.

D013 and adjacent-0002 complete the three related follow-ups. Pending refresh
and validated cleanup rows report `preview`; current remains current.
Cleanup previews validate ownership without deletion. A remapped checkout
refuses with a repository-relative ignored-record location and the route to
restore the original checkout, finish cleanup, then record the replacement.
The registry preamble now names the starter-refresh receipts the next
`worktree start` carries into evidence.

One fresh pinned read-only worker assessed the class and was reused to review
the applied change. It found no new implementation bug and recommended one
coverage addition: the non-publishing existing-release preview. That case
was added before the preflights. The module fixture also adds a real tag
mismatch and checks genuinely current previews, remapped cleanup refusals
and a changed scratch inode. The update's same preparation and pushed commit
still supply cleanup recovery; exactly three preparations remain.

The first 19 distinct repair preflights named by the order passed at code identity
`db7aa935f90f475c31c43788b7d2502c909638deb58d7a3066f8f529e396f92d`,
from 2026-10-13T23:22:08.706Z to 2026-10-13T23:51:38.139Z
(1,769.433 seconds including bounded supervision and waiting).
[Repair check rows](repair-checks.json) preserve each command, identity,
time and evidence reference without machine-local diagnostics. The launchpad
task took 456.713 seconds in its single-suite preflight, and the expanded
release `starter_refresh` case passed in 24.73 seconds. These single-suite
readings are kept separate from D009's fresh review-gate comparisons.

Authority, feedback and harness edition preflights pass, so this repair
retains the selected editions and owes no new live episode. Publication
checks pass after refreshing the affected engineering source lock.
Product 07 measures 195,419 bytes under its 212,313-byte ceiling.
`release prepare --local` retained v0.81.0 and the existing changed-component
assignment. `git diff --check` passes.

The first repair document gate passed all 35 tasks at
2026-10-13T23:55:20.300Z in 127.48 seconds. Its exact canonical row is in
repair-checks.json. The queue records adjacent-0002 completed with the passing
launchpad, release, siblings and document evidence.

During the subsequent full review, the executor's bounded disclosure probe
established that retained cleanup paths and malformed ignored input excerpts
could escape refusal redaction. The review was stopped through the canonical
command, exited 1 and recorded no passing check. Its 659.3 seconds are work
and waiting, not completion evidence. D014 repairs the class: exact-state
path redaction, fixed parsing diagnostics, rejection of invalid record and
checkout types, and raw temporary-base redaction. The final focused starter
fixture passed both tests at 2026-10-14T00:20:40.767Z in 29.931 seconds.

Stopping that gate exposed a deliberately restricted fixture beacon that
blocked its exit trap after partial removal had lost the root marker. The
executor inspected and removed only that exact stopped-owned synthetic
residue. D015 adds release-only captured root/beacon identities and guarded
permission restoration before root cleanup. The final temporary-root suite
passed at 2026-10-14T00:24:23.203Z in 2.609 seconds: INT and TERM clean the owned
restricted beacon; a substituted beacon refuses while preserving the root,
marker and both objects. The ready JSON is published atomically. The driver
also catches assertions, terminates and reaps the child, and restores only
captured owned objects after a forced kill; synthetic assertion and stopped-child
cases prove both failure paths without leaving residue.

These source changes supersede the first repair gate identity. The queue's
adjacent-0003 groups the related privacy and cancellation repairs before
rerunning the required preflights, document gate and full review.

The second repair preflight attempt passed siblings-fixtures and target-worktree
at `d07713b7…`, then launchpad failed at 2026-10-14T00:33:45.665Z. Its three
in-kit gate selections and expanded refresh fixture passed. The staged-tree
positive assertion failed because ordinary `git add` retained an unchanged
file's earlier filtered blob after attributes were removed; the production
guard correctly refused those bytes. D016's bounded comparison reproduced the
cache condition and compared explicit renormalization with removing/re-adding
the index entry. The fixture now forces an old timestamp and explicitly
renormalizes; both rejection checks stay intact. Its focused test passed at
2026-10-14T00:36:57.519Z in 4.368 bounded seconds. Queue revision 23 starts the
same-path correction as adjacent-0003 revision 4; the failed attempt remains
historical and required validation restarts at the corrected identity.

All 19 required preflights passed at the corrected identity
`b9a1a58aaaf7ca03929669bc490d1d3f7a4f63ce019797e2e9b6b15b1a592ddc`,
from 2026-10-14T00:40:51.676Z to 2026-10-14T01:09:46.002Z,
in 1,734.326 seconds including bounded supervision and waiting.
repair-checks.json now keeps these current rows above both historical attempts
and the stopped full review. The launchpad task took 463.444 seconds in its
single-suite run; the expanded release starter case passed in 24.93 seconds.
The three selected editions' current preflights pass, so the repair retains
them and owes no new live feedback episode. The pinned worker's final driver
review found no further bug; its later staging review confirmed the fixture-only
correction and both preserved rejection checks.

The current document gate passed 35 tasks at
2026-10-14T01:16:27.290Z in 135.455 seconds. Queue
revision 24 records adjacent-0003 revision 4 completed with its five required
passing command references; no adjacent repair remains pending.

The current fresh review passes 41 suites with zero failures and 97 fresh tasks at 2026-10-14T01:56:35.799Z, in 2171.365 seconds. The preceding current document gate passes 35 tasks at 2026-10-14T01:16:27.290Z, in 135.455 seconds.
repair-checks.json preserves those exact canonical rows at the current identity.

The fresh review's launchpad task took 512.605 seconds,
6.133% of slot-weighted work. Its longest vertical member took
561.841 seconds; launchpad critical-path
membership is false. Span exceeded the four-lane slot-weighted
bound by 3.901%. D017 records the current conditions: span
false, share false, vertical false.
The existing performance watch remains deferred.
These concurrent measurements do not isolate a cause for the task reading.
No required verification or preparation was removed.
