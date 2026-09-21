# WO-079 implementation — recoverable worktree integration

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

Dispatch: `resume: next`, 2026-09-20. The canonical selection was active WO-079
in its matching worktree. One registered coding writer performed this work.
No branch commit, push, PR, tag publication or lifecycle repair was performed.

`npm run worktree -- integrate WO-NNN` now preserves a canonical recovery
checkpoint and named include-untracked stash, fetches main and tags, fast-forwards
an uncommitted branch or starts a merge without rewriting reviewed commits,
applies the retained stash and regenerates owned projections. `--continue`
resumes after explicit authored resolution. The helper prints the affected
checks and appends a dated draft decision for the integrating reviewer; it
neither runs a product gate nor records acceptance or control events.

The existing checkpoint implementation is shared with resume. Current control
projection rendering is reused directly without dispatching a lifecycle action.
Harness output, index, meta, release preparation, publication lock computation
and console expected output all reuse existing producers. Mixed documents
re-merge authored content after masking only the generated fragment or release
version. The follow-up register unions by entry id with both compatible history
prefixes preserved. An incompatible same-entry history stays an authored
conflict, preserving source-revision meaning.

The product 07 checklist, PLAYBOOK concurrency procedure and generated reviewer
skills name the helper. D001–D004 and the decisions index discharge the order's
pre-2026-09-09 ledger substitution. Release preparation passed at `v0.37.1`;
skeleton alone advances to `0.33.1`, including its exact console dependency pin.
No third-party dependency changed.

## Executed evidence

- The real-Git fixture runs both fast-forward and reviewed-commit paths against
  a local origin and a merged sibling. It exercises conflicting harness
  manifests, harness fragments, publication locks, README release versions,
  decision indexes, console projections, an authored file, two follow-up
  additions and a colliding target. The actual build and generators run in
  these fixtures; harness, publication, index and console checks inspect the
  resulting bytes. All control segments remain byte-identical. Reviewed HEAD
  remains unchanged and MERGE_HEAD names the incoming base until the reviewer
  chooses to commit.
- The three required refusals preserve the tree, index, HEAD and recovery refs.
  Intake tests cover missing, stale and matching named archives. The unrelated
  third order varies between active and verifying. A further fixture preserves
  a colliding untracked stash file and requires explicit resolution before
  completion. Follow-up tests reject divergent same-entry histories.
- Final focused fixture run: six tests passed, zero failed in 38.85 s.
  Checkpoint regression: all 16 lifecycle recovery refs resolve. Release
  preparation: seven tests passed. These focused observations preceded the
  final source formatting and final gate below.
- Release surfaces and workspace pins pass; publication coverage is 272/272,
  with both editions current. `harness check` validates 31 generated surfaces.
  Planning check accepts the release assignment under the existing receipt.
- New immutable authority and feedback editions are selected. The authorized
  read-only live CLI verifier completed both feedback criteria; ten present
  mechanisms passed and all ten removal cases failed as expected. Artifact
  identity and verification evidence passed unchanged. The console selfhost
  fixture selects the new audit.

Final product gate: `npm test -- --review` passed all 30 selected suites,
zero failed, with 74 fresh tasks in 499.40 s. This includes the six integration
tests (53.90 s as a suite under the full run), the corrected process-debt
snapshot, product runtime suites and affected machinery checks. The final
run completed with exit status 0 after the last source edit and staging of
new source/fixture files.

One earlier `npm test -- --review` run was deliberately stopped at 76.3 s
before changing its source inputs; the gate recorded no check. Source review
found that a path heuristic could miss machinery changes in package code.
The helper now reuses the runner's declared `changedMachinery` selection, with
a focused positive package-source case and an unchanged-source negative case.
This is a correction within the deliverable, not a passing interrupted gate.

A subsequent review run reproduced one exact-role snapshot failure in the
process-debt suite and was stopped at 283.6 s before editing inputs. D004
records the correction: retain both old baselines and separately pin the
authorized WO-079 role bytes. The stopped run recorded no passing gate.

## Recovery and limits

The helper never pops/drops its stash or commits a merge. A reviewed branch's
authored merge conflict defers stash application; its local receipt names the
pending continuation. Untracked add/add collisions are reported explicitly,
with the original bytes retained in the stash's third parent; staging the
chosen content and `--continue` acknowledges that authored resolution.
Interrupted stash application or a failed merge preserves recovery material
and requires inspection rather than blindly applying twice. Ignored intake
stays outside Git and is not copied into reports.

The helper does not choose component compatibility, change the authored
console manifest's evidence selection, reissue immutable verification evidence
or decide whether acceptance claims carry forward. Those judgments remain with
the integrating reviewer. A failed generator remains pending, with exit status
1; no partial success is reported. Synthetic integration proves the mechanical
contract; no live parallel work-order merge was needed or performed, and no
production time-saving measurement is claimed.

Entry usage was unavailable after explicitly beginning the harness session:
source unavailable, dispatch scope, observation at 2026-09-20T23:21:46.246Z,
counter cutoff unknown. Final counters belong in ignored receipts and the
handoff response. One operator-authorized evidence verifier was launched;
collaboration agents and requested descendants: zero. The observed entry
subagent count was zero with cap 20; unobserved remainder was unknown.
