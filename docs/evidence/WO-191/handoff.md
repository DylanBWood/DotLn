# WO-191 implementation handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.1","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

The five publication surfaces use the balanced fallback. `reader profile` prints
surface guidance and its nearest example; `preview` shows three complete
variants. Publication and ordinary release preparation print that guidance.
The internal integration preparation retains its outcome-only receipt.
Scores quote immutable Release text and retain its tag identity, tagged profile,
first Unicode quotation offset and position. Plan start summarizes scores by
revision and recommends one reader after three releases of a changed revision.

Application target: v0.74.2. Skeleton: 0.57.2, with the console dependency pin
updated. No added dependency, runtime capability or editorial publication
refusal. No branch commit or publication was performed.

The example release is v0.73.1. Fifteen variants retain the per-surface facts and
limits; the independent comparison is tied to their file hashes. Historical
source inconsistencies are disclosed, and the release-note record's relative
links are pinned to their original tagged destinations. The real fresh-reader
baseline covers the ten newest tags observed at execution, v0.74.1 through
v0.69.1. All forty answers have source quotations; their median position is
0.7030747352147324. These figures measure findability, not whether the quotation
answers well or whether the operator likes the prose. All ten historical
profile revisions are null because the control file did not yet exist.

self-review: found 5; fixed 5; recorded 0. Two fresh independent workers received
only the order and implementation diff. The criteria adversary found two
preservation omissions; the design improver found three score-validation or
selection defects. Both rechecked the repairs and reported zero pending
findings. Their counts and resolutions are in [self-review.json](self-review.json);
the actual per-surface verdict is in
[comparison.json](../../publication/examples/comparison.json).

Both workers were launch-selected gpt-6.1-sol at max, without effective readback.
The external baseline reader reports claude-opus-5-5 in modelUsage; xhigh was
launch-selected. It ran in an empty temporary directory with tools disabled;
[baseline-run.json](baseline-run.json) and [baseline-reader.json](baseline-reader.json)
retain the sanitized observation and answers. Four manual worker admissions
were used against the planned cap of twenty: examples, baseline reader and two
reviews. Rechecks reused workers. The handoff host readback observes zero
admissions and explicitly leaves the
uncounted remainder unknown; the four manual admissions remain the budget
account, rather than treating the host's displayed remainder as a fresh budget.

The cold-start measurements are CLAUDE.md plus the installed .agents skill:
planner 18,489 bytes against 24,576; reviewer 27,037 against 28,884. Neither
ceiling was reached. The authority, artifact-identity, verification and feedback
editions are selected at WO-191 revision 001; current harness generation and
check evidence cover the fifth edition.

Final executable evidence: `npm run format` passed; `npm run test:docs`
passed 34 checks in 97.631 s, recorded 2026-10-11T16:18:51.695Z.
`npm test -- --review --again` passed 39 suites, 91 fresh tasks and zero reused
tasks in 1428.326 s, recorded 2026-10-11T16:42:50.176Z.
Both rows have code identity `aea7bae9685587ee34e6c3ddd256222d42f252ac5efed2e6e008b2bf68c0a90b` and tree
`cc02d4eef9317c9edf7db6a0325dac4137f79d49`; identity and build output were unchanged.
The full gate's durable reference is `host-gate:aea7bae9685587ee34e6c3ddd256222d42f252ac5efed2e6e008b2bf68c0a90b:npm test`.
The final `git diff --check` is clean. The nested-repository inventory returned
an empty array; the adjacent queue remains revision 0 with no items.

Earlier review attempts stopped after 402.4 s, 630.9 s, 1715.3 s and 799.3 s;
none created a passing full-gate row. D006 records synthetic fixture inputs;
D007 preserves integration's outcome receipt; D008 fixes the test-helper
classification and planning output contract; D009 adds concrete suite coverage
descriptions. The fourth attempt also reported one shared-tag fixture failure
whose assertion diagnostic was outside the host output's retained window.
Its cause is unknown. The unchanged test subsequently passed in isolation and
in the complete runner suite and the final full review. That review used fresh
execution and retained its entire output. The interrupted vertical tests were
not diagnosed as failures.

**Criterion 1:** met — all five surfaces have exactly the five declared dimensions and valid positions; the balanced fallback is in the control file. The reader fixtures in `npm run test:docs` reject unknown surfaces, dimensions and positions and a missing surface.

**Criterion 2:** met — v0.73.1 supplies fifteen complete variants with positions, 122 literal fact anchors and fifteen two-sentence dimension-position illustrations. The criteria worker's repaired comparison passes all five surfaces; `comparison.json` binds its verdict to the example file hashes, and the document check validates that binding.

**Criterion 3:** met — profile prints guidance and the nearest example path; preview prints the three complete examples side by side. Reader fixtures cover both forms and their unknown-surface diagnostics with the known surface list.

**Criterion 4:** met — synthetic fixture orders show title/body guidance in worktree publish and release-note guidance in ordinary prepare, without profile-driven rewriting or refusal. The existing publication checks and real-Git integration assertions pass; internal integration preserves its outcome-only receipt.

**Criterion 5:** met — score selects at most ten unscored immutable releases, validates submitted and saved quotations and tagged profiles, rejects invalid metadata and is idempotent. Reader fixtures cover missing-profile revisions, first Unicode offsets, tag movement and due-revision selection. The planning fixture records real scores and checks the figures outside the unchanged 1 KB failures block; typed correction capture is fixture-covered.

**Criterion 6:** met — generated reviewer and planner roots contain their single added sentences; harness check passes. Measured cold-start bytes are planner 18,489/24,576 and reviewer 27,037/28,884. Neither ceiling is reached, so no acceptance or ceiling change is needed.

**Criterion 7:** met — the fresh external baseline reader scored the ten newest observed release tags. The ten recorded rows validate against immutable published text and retain null profile revisions with their historical absence reason. `baseline-run.json` records actual modelUsage and the launch-selected effort limitation.

**Criterion 8:** met — product 08 PRs and commits points to the control file and retains the dated corrections; decisions D001–D009 record the fallback, evidence, alternatives and reopening conditions. The decisions index and publication locks are refreshed; publication check passes.

**Criterion 9:** met — `npm run test:docs` and `npm test -- --review --again` pass at the recorded subject; `git diff --check` is clean. The package and lockfile diff adds no dependency.

Goal alignment: the outcome matches the authorized advisory-profile scope and
the order's balanced fallback. The no-op, prose-refusal and raw-JSON-hash
alternatives and their reasons are in [decisions.md](decisions.md). The bounded
hash comparison showed that key order changes a raw hash but not the canonical
choice revision, while a voice choice changes the revision. No adjacent item
or unresolved worker finding remains.

Process cost: entry counters were unavailable. At handoff the executor read
`harness usage` again and reports the available total, source, scope and cutoff
in the response; final session counters remain in ignored receipts. The root
CLI/model/effort come from the current-session briefing. No effective effort
readback is claimed for the workers.
