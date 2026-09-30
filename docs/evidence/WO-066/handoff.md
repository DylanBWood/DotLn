# WO-066 executor handoff

Implemented the bounded post-PR continuation for automated review comments and
mapped failing checks. `npm run worktree -- resolve-pr --request <file>` consumes
the recorded PR and observations, persists executable-subset commands, and
enters the existing RepairHost with one round per item. Original-contract
verification precedes a granted push. Thread disposition uses the original
publication authority; a later observer event establishes resolution. Human
comments, unknown mappings and refused content retain human control.

Evidence is fixture-qualified for the loop: triage, writer and verifier doubles,
real local Git and fake gh. The separate required feedback self-host audit is
live-qualified. The post-PR loop's live operation remains WO-112's work.

**Criterion 1:** met — [fixture transcript](fixture-transcript.txt), accepted automated thread and mapped CI failure cases: fresh worker, complete original-contract matrix before push, PR branch updated, granted thread disposition, and recorded resolved/successful state at the repaired head.
**Criterion 2:** met — the transcript covers structured rejection with evidence references, outside path and unmapped check NeedsHuman, human comments without dispatch/disposition, refused comment typed stop with its identifier, and failed verification without push.
**Criterion 3:** met — the late-comment case observes and selects a newly arriving item; kill after the recorded push resumes one writer and one push without reprompting; a local resolved bit without a new observer record cannot complete an item.
**Criterion 4:** met — missing repo.push and pr.thread.resolve grants refuse before gh; a real foreign-root commit refuses ancestry; one failed repair exhausts without a second writer. [D001](decisions.md#wo-066-d001) records RepairOriginal.roundLimit rather than a WorkOrder field. The additional pure derivation case refuses foreign revision/evidence, invalid line, unnamed command, outside surface and round 1.
**Criterion 5:** met — signed-header positive control invokes the planted signature program on ordinary git log; guarded publication never invokes it. A mismatched origin refuses before gh or push. Every publication-host target-root read uses the hook, fsmonitor and signature overrides; the request's canonical repositoryId binds publication.
**Criterion 6:** met — the confinement fixture demonstrates network access, common-Git write and outside read without confinement, then their refusal through both the focused host runner and the exact writer shell command. [D003](decisions.md#wo-066-d003) records the Claude permission settings and the limits of direct filesystem confinement, native allowlist qualification and process/IPC access.
**Criterion 7:** met — [first Claude state digests](claude-state.json) and [current audit digests](claude-state-002.json) record this executor's two required-audit launches, the second after the source correction. User settings and canonical project registry digests are unchanged before/after; user-local settings are absent. No contents are retained. D006 and [D009](decisions.md#wo-066-d009) record the observations' limits.
**Criterion 8:** met — product 02 adds 361 bytes across its existing publication and repair paragraphs; product 06 adds 91 in its existing pipeline sentence. Measured base headroom is 2243 and 800 bytes respectively; no ceiling changes. Publication locks were refreshed and publication:check passes. [D005](decisions.md#wo-066-d005) records the measurements.
**Criterion 9:** met — current authority, artifact-identity and verification editions are WO-066/002; the harness was re-emitted and checked. [feedback-002](feedback-002/edition.json) records a new live self-host audit after the final judged-source edit using Claude Code 2.1.285, claude-opus-5-5, xhigh; independent verdicts pass both criteria with zero findings. Console selfhost JSON/terminal/HTML are re-pinned. D005, D006 and D009 record configuration and generation/check evidence; immutable revision 001 is preserved.
**Criterion 10:** met — [canonical validation receipts](validation.json) record npm test -- --review: 39 checks, 83 fresh tasks, zero failures in 677.35 s; npm run test:docs: 23 fresh checks, zero failures in 17.01 s. Both rows match code identity 73acb7520bba8e9698c5ad7285a26a04efdfc07d0d6dc318a509fc8b7fd52fa9. git diff --check HEAD passes over all staged and unstaged changes; no dependency was added.

The host-owned request contains schemaVersion 1, targetRequest, repairInput,
children, workOrderId and PR number, plus judgments keyed by observed item ID
and checkTests keyed by check name. Relative file paths resolve beside the
request. The target publication request now requires repositoryId as canonical
HOST/OWNER/REPO. The repair input is the original WO-055 contract/baseline/subject
plus explicit source/verifier transport, model and effort; its original writer,
authority, contract and tests must match the recorded publisher before dispatch.
Actual CLI worker launch requires DOTLN_LIVE_WORKERS=1. Recovery reuses the same
request and child stores; changing pinned judgments or mappings refuses drift.

Application v0.57.0 is prepared locally; skeleton moves from 0.45.2 to 0.46.0.
Other component source versions stay unchanged and the console's exact dependency
pin follows skeleton. No new external dependency. The small adjacent README
correction changes its documented feedback verifier cap from $3 to the source's
$5; adjacent-0001 is completed at queue revision 5, with the passing
[docs check](adjacent-docs-check.txt). [Cleanup scan](repository-cleanup.json)
finds no nested repository in the worktree or granted session scratch.

Limits: effect receipts cover the tested interruption after a recorded push.
Remote effects and local receipts are not atomic, so a rejection reply could
repeat if killed between posting and receipt. Native Claude allowlist matching
of the complex sandbox-profile spelling is not live-qualified; the shell command
and host permission route are fixture-qualified. This is not a whole-worker
sandbox. The live feedback audit judges its registered sources, which exclude
the script-side post-PR loop. See D003 and D006 for exact boundaries.

Executor: Codex CLI 0.159.2, gpt-6.1-sol, effort max, source
codex-session-readback. Root usage is available from the codex-transcript-counter,
scoped to this dispatch; cost is unknown. Final counters remain in the ignored
usage receipt and the operator response, with their observation cutoff.
