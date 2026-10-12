# WO-202 implementation handoff

The exported instance now runs the planning command surface with its own seeds
and records. Absent core inputs are named; declared inputs retain validation.
Application target: **v0.78.0**. No component source or dependency changed.

**Criterion 1:** met — [commands.json](commands.json) preserves 29 base invocations before product fixes, their exits, output heads and observed input paths. D002 and each row's `fix` distinguish ten product failures from two supplementary fixture-invocation errors.
**Criterion 2:** met — [commands-final.json](commands-final.json) records 31 successful invocations. `scripts/test-launchpad-planning.mjs` asserts the real planning branch, instance-derived canonical prompt, synthetic planning receipt and check, initial absence of an entropy review, fake review and both receipt pairs. The final review includes its passing 33.15-second task from the same code identity.
**Criterion 3:** met — `launchpad` passes its manifest-exclusion and update-preservation assertions for all five new instance seeds. The update fixture replaces their contents with sentinels and verifies the bytes survive. The final review includes the passing 323.62-second launchpad task.
**Criterion 4:** met — the export fixture asserts no-editions and no-reader-records success, while a partial edition declaration still fails. `scripts/test-reader.mjs` proves an absent immutable tag names the release, object and restoring fetch, then verifies after fetching; malformed score entries cannot append partial records. Reader fixtures pass in `npm run test:docs`.
**Criterion 5:** met — the manifest-listed client README has the planning commands, seed ownership, unavailable inputs and installed planner-to-refuter dispatch. The launchpad gate also checks its declared supported and unavailable suite inventory.
**Criterion 6:** met — product 07 and product 12 cite the final observations in place; the publication lock is refreshed and `publication:check` passes. [Decisions](decisions.md) D004 records the empty-fold warning and reader carry-ins. D005 records the default-export qualification and retains the non-default-root remainder under `FUP-cb5c3b3e7d0b0c0d`; adjacent-0001 is deferred to that identifier. The lineage and decision indexes pass.
**Criterion 7:** met — `npm run format` passed; `npm run test:docs` passed all 35 suites; `npm test -- --review` passed all 38 required suites; `git diff --check` passed. Package manifests and the lockfile have no diff.

The passing document gate was recorded at 2026-10-12T15:17:45.389Z
(100.122 seconds). The passing full review was recorded at
2026-10-12T15:21:52.139Z (236.176 seconds). Both bind code identity
`5da914ad2b8b2032c6347690f4ad78e0212585af709ccba85cdfaaa1859f9ebe`.
The full review used the runner's ordinary composition: two fresh tasks
(format and skeleton), 88 previously passing tasks at that same identity,
covering 38 suites. It did not bypass a failed task.

D007 records the first review's obsolete negative assertions and incomplete
source declarations, all repaired. D008 records the second review's one
supervisor readiness timeout. That exact case passed in isolation without
source changes, and the full skeleton suite then passed in the final review
(229.886 seconds). Its cause remains unknown under
`FUP-3b39865f91df30a7`; no timer or assertion was relaxed.

self-review: found 3; fixed 3; recorded 0

[Both fresh worker reports and dispositions](self-review.md) account for one
criterion-adversary finding and two design findings (two distinct issues).
A reused design-worker review of D007's repair found zero new issues.
Session total: four read-only workers, zero descendants, against a cap of 20.

Executor: Codex CLI 0.162.1, `gpt-6-astra`, selected effort `ultra`
(normalized xhigh with workflows), source `codex-session-readback`.
Final usage is read from the dispatch counter and reported separately; it is
not embedded as a moving value in this report.

The outcome matches D002's goal-alignment choice: independent instance
planning works without copying core goals, records or history. Evidence is
fixture-only: no live refutation/entropy provider or actual publishing release
close is claimed. Separate tool roots and relocated document roots remain the
explicit D005 follow-up. No branch commit, push or publication was performed.
