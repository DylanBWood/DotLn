# WO-198 executor handoff

**Actor attestation:** codex-cli 0.162.0; gpt-6-astra; effort max;
source codex-session-readback. The order recommends xhigh; the actual session
selection is recorded without claiming effective-effort proof.

**Criterion 1:** met — `row-readback.json` contains start/end snapshots from the real format and runner-fixtures gates. The focused fixture transcript covers absent branches, annotated-only v tags and the four fields; snapshots stay outside code identity and verdict.
**Criterion 2:** met — `fixture-transcript.txt` records one failure-only delta for changes since the same check's previous local row and during the run, including movement back to the previous value. Passing and unchanged failing rows print no line; old rows supply no invented baseline.
**Criterion 3:** met — `npm test -- --only runner-fixtures` passed (78.59 s). The focused transcript shows document and plain tasks passing before and after the sibling commit and annotated tag push to a temporary bare origin, new snapshots, a passing composed run and the forced-failure diagnostic.
**Criterion 4:** met — no task flipped in the bounded reduced-table fixture. D002 records the output, the checked shared-state readers and the live-case limit; no reader repair was indicated.
**Criterion 5:** met — npm run test:docs passed 32 checks in 98.65 s; npm test -- --review passed 38 suites, 90 fresh tasks and zero failures in 1396.33 s at code identity e985b95a9c5f8e7f54e776a39fd3bee984148136747604aff369d9c13359eb1e. Product 07, publication locks and the three new immutable evidence editions are current; D003 records their individual passing checks. git diff --check is clean. Package changes are compatible patch labels and the existing workspace pin only; no new dependency.

self-review: found 0; fixed 0; recorded 0 — criteria adversary 0 and design
improver 0; both reports and the root's source-ordering check are in
[self-review.md](self-review.md).

The outcome matches the intended diagnostic scope. The line establishes
observed movement, not proof that movement caused the failure. The reduced
table does not cover every live task, and start/end samples cannot reveal
movement wholly between samples or tag/ref-target changes that leave the
counted fields unchanged. D002 names the reopening observation.

The release target is v0.72.1 (local tag baseline v0.72.0), skeleton 0.56.1,
and harness host 0.35.1. The existing console dependency pin follows skeleton.
Authority, artifact-identity and verification use WO-198 revision 001;
feedback retains its checked existing live audit. No scratch repository
remained in the worktree at the material inventory check. The adjacent queue
is empty at revision 0.

Process cost is recorded in ignored session observations and the final response;
token and dollar counters are not inferred from elapsed time.

The document row was recorded at 2026-10-09T18:36:53.303Z; the review row at
2026-10-09T19:00:19.368Z. All 4 runner rows observed at the current code
identity carry both snapshots. The required gates ran without repository edits
or new agent launches. Their start/end refs are preserved in
[row-readback.json](row-readback.json).
