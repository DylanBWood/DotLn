# WO-166 repair after VER-001

Dispatch: `resume: fix`, with operator scope expansion `scope expand: merge main in`.
Subject: the uncommitted WO-166 repair on integrated `origin/main` at
`9cd8465c3ed52d530e1ee55f66d2b4e9c5c060a7`. VER-001 remains immutable and judges
its original subject. This report records executor evidence; independent
verification and final review remain separate dispatches.

## Repair

| Finding | Change and evidence |
| --- | --- |
| F1 | `evidence --wait` uses a current-tree outcome for an awaited run before applying the row timestamp guard. The regression drives two real evidence invocations on one fixture tree, starts the waiter while the second marker is live, and verifies exit 0 with unchanged cached rows. Missing-row, failed-outcome and timeout cases remain covered. |
| F2 | A release-close briefing from the subject leaves main unreserved and directs a new main session to run the release-close dispatch there. The linked-worktree regression drives both dispatches with different session identities, then releases the main actor through the real completion callback. The original same-session and foreign-holder tests remain. |
| F3 | An unbuilt release-close runtime with a reservation reports the affected checkout, retained ownership and the build command. The surfaceclose regression proves this refusal precedes publication or a build, and ownership remains. |
| F4 | Product 07's stale-writer candidate incorporates the behavior in its existing paragraphs, without a new dated header, allocation claim or phase qualifier. |
| F5 | A live-owner dispatch refusal names `writer --release --force`; the operator-release refusal includes the holder, owner, reservation time and age. Both are asserted in the fixture. Thread-owner recovery remains unforced. |
| F6 | The complete surfaceclose failure report is compared exactly, including the single retained-writer advisory. An initial exact comparison revealed that advisory as the only difference; D012 records the diagnosis. |
| F7 | All generated roles explicitly say to run the wait command in the background under Claude Code. The two-sentence constant is 350 UTF-8 bytes, within 400. |
| F8 | Outcome-observation I/O errors produce an advisory without changing the primary gate exit code. A real directory-creation failure is injected after a pass and after a failure; their exit codes stay 0 and 1, and markers are released. |

Decisions D009–D013 record scope, alternatives, the correction to D001/D004,
integration and the F6 output diagnosis. The existing D002 economy experiment
remains declined; no second experiment or saving is claimed. Adjacent item `adjacent-0001` is completed at queue revision 5 after the full process fixture suite passed; no queued item remains. Repair follow-up `FUP-a27067d36a3d6c91` is settled with re-verification as its reopening condition. The original three closeout register rows remain for retargeting
at close. D008's publication-fixture and transitional-runtime limits remain
on `FUP-8cfd3ff52146a016`: this repair tests real linked-worktree dispatch and
release callbacks, while `release.mjs` publication completion still uses the
existing synthetic writer adapter. No live publication or live feedback episode
was run.

## Integration and release

`worktree integrate WO-166` fast-forwarded the base from `6a5c323d` to `9cd8465c`
with no authored conflicts, then reapplied the uncommitted work. Recovery remains
at `refs/dotln/checkpoint/WO-166/6` and the named stash
`WO-166 integrate 2026-09-26` (`d9cb331ea21cbfa6462b3dc79c18b024f80693e6`).
D011 names regenerated projections and carried-forward claims. No WO-166
criterion changed. WO-085's product-document bounds and link checks pass on
all 15 product documents.

The helper retimed the unpublished patch from v0.52.2 to v0.52.3. Compiler
0.19.2 and skeleton 0.44.2 remain valid patch bumps against the integrated
v0.52.2 release; exact workspace pins agree. Local release preparation and
surface checks pass. No implementation branch commit or publication was made.

The selected authority evidence is WO-166/005. Artifact identity WO-166/001,
verification WO-166/001 and carried feedback WO-166/002 still pass; their
bytes and earlier authority revisions are preserved. The console's five fixture
views pass. `cold-start-repair.json` compares against integrated v0.52.2:
executor 26,110, verifier 22,913, reviewer 23,995, release-close 15,019,
planner 17,167 and refuter 16,742 bytes. Both skill roots retain every verdict
(`within`, with the refuter ceiling `unset`); the new role text adds 38 bytes
over the original WO-166 implementation.

## Validation

Focused harness regressions: 5 passed, 0 failed (12.93 s). The surfaceclose
regression passes after adding its exact expected advisory. Harness generation
checks all 31 surfaces. Authority, artifact identity, verification and carried
feedback checks pass. Publication source locks, console fixtures, local release
surfaces, product-document bounds and `git diff --check` pass.

The first document gate passed 23 suites with 0 failures in 30.63 s. The first
integrated review gate passed harness-fixtures (226.15 s), then exposed four
outdated process fixtures. It was stopped through `evidence --stop` after
307.7 s; no complete gate row or pass is claimed. D013 records the bounded
adjacent repair, explicitly confirmed by the operator: a new WO-166 role oracle
chained to the unchanged WO-161 snapshot, missing-runtime refusal before lifecycle
writes, independent actor cleanup and an observation failure injected after
reservation, and a Claude hook fixture isolated from the parent's Codex identity
with current refusal diagnostics. The focused rerun passes all five selected
tests in 10.72 s.

The final `npm test -- --review` passed 40 suites, 0 failed, 84 fresh tasks in
613.10 s. The process fixture suite passed in 73.39 s. Its complete gate row was
recorded 2026-09-26T22:51:37.763Z at tree
`a3adb56359bd9574c4f55ec12f0c84acf166a845`, code identity
`5165f355497d94cc37746af935adb690673f009e94f9cfcbcf5b6adfe9c37e04`, evidence
`host-gate:5165f355497d94cc37746af935adb690673f009e94f9cfcbcf5b6adfe9c37e04:npm test`.
Subsequent changes record these results and follow-up dispositions; no product
source changed. The final document-gate result stays in the ignored check rows
and is reported at handoff. The promised outcome is supported by passing cached
wait, separate-session ownership and failure-path regressions on integrated main;
independent verification remains required.

## Actor and process cost

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.157.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

**Process cost:** entry 47,516 total tokens; source codex-transcript-counter;
scope dispatch; cutoff 2026-09-26T22:23:31.275Z. Final counters stay in ignored
receipts and the handoff response. Dollar cost is unknown. No subagents were
spawned; the root is the only writer. `writer --show` after repair dispatch
reported this session's live Codex host reservation. `repair-complete` must
release it, followed by a read-only observation at handoff.

Additional inputs: the canonical integration helper and product 07 integration
contract; `docs-check.mjs` from integrated WO-085; publication-lock and release
preparation helpers; existing follow-up disposition schema; current evidence
selection and cold-start measurement helpers. Source changes and authored
outputs were read before handoff; generated surfaces use their producer/check
evidence. Final review must not treat this executor report as its own judgment.
