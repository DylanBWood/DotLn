# WO-213 repair handoff

This repair answers VER-006 by the operator's direction rather than by another
binder fix: every change related to criteria 15 to 19, the 2026-10-16
validation-system expansion, is undone and nothing older is
([D072](decisions.md#wo-213-d072)). The code was rebuilt at its bytes before the
expansion and checked against the code identity of the last gate rows recorded
before it; one declaration the expansion had replaced was added. The order,
product 07, the executor's generated guidance and the authority selection
(revision 005) returned with the code, and the order's amendment is bound to
D072 in the planning log. [The expansion's history](validation-expansion-history.md)
gives planning one account of every idea, attempt, measurement and failure.

VER-006's three findings concern criteria 16, 17 and 19, which have left the
order. The class they share, a task result carried or refused on the strength
of an inferred input binding, is closed by removing per-task binding: the
restored code holds the rule that a complete product claim rests only on a
complete `npm test -- --review` row at the current whole-code identity, that
no single-suite or task result carries across a code change, and that the
reuse reader binds no environment and no document or lifecycle projection.
The base cases that hold it are in `scripts/test-runner.test.mjs`: code
identity follows tracked source and dependency bytes across processes and
revisions (line 3024); stopped, partial, timed-out and failed observations
never reuse and untracked edits invalidate (line 4963); a later failed gate
displaces older passes and a carried result is never evidence (line 5287).
No new case was added: new code would go beyond the operator's undo and
change the identity the complete gate below ran at.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.302","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

## Criterion judgments

**Criterion 1:** met — `suite:docs-check-fixtures` passed at code identity b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3 (2026-10-17T12:37:09.498Z) and `npm run test:docs` passes the record-screen fixtures and the real document check; `scripts/lib/private-paths.mjs` and `scripts/docs-check.mjs` are unchanged by the undo.

**Criterion 2:** met — [record-baseline.mjs](record-baseline.mjs), [baseline-proof.json](baseline-proof.json) and [final-probe.json](final-probe.json) retain the 291 fingerprints in 37 record files with the 128 original entries unchanged; `npm run test:docs` passes and no historical allowance was added.

**Criterion 3:** met — `npm test -- --review` passed fresh at that identity (2026-10-17T14:06:48.986Z) including the register projection, in-place correction, stale-then-current sync, protected-history refusal and symmetric union fixtures; `suite:process-debt` (12:40:46.898Z) and `suite:worktree-integration` (12:45:58.339Z) passed; the register module is unchanged by the undo.

**Criterion 4:** met — [register-correction.json](register-correction.json) still records the one summary change; FUP-de6162b279f66709 keeps one revision and stays deferred; `npm run test:docs` runs `npm run meta -- --check` green. This repair added D072, its index row and register dispositions only.

**Criterion 5:** met — `suite:plan-refutation` (12:48:02.790Z) and `npm test -- --review` pass the receipt and event-writer refusals, unchanged bytes after refusal and placeholder filing; the receipt writers are unchanged by the undo.

**Criterion 6:** met — `suite:target-worktree` (12:58:08.827Z) and `npm test -- --review` pass the target-record and planning-publication refusals before any write, commit, append or remote call; the target writers are unchanged.

**Criterion 7:** met — [before.json](before.json), [after.json](after.json) and the README measurements are unchanged; D002 to D006 and D024 record the rule's class, the declined full pattern, the baseline justification, the projection correction and both screens' reach.

**Criterion 8:** met — docs/README.md §Map and product 09 §Privacy and minimization are unchanged since the last verification; product 07 returned to its text before the expansion; `npm run publication:check` reports both editions current and `npm run test:docs` passes.

**Criterion 9:** met — `npm test -- --review` passed fresh at code identity b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3 (46 suites, 103 tasks, 0 failed, 2976.26 s, 2026-10-17T14:06:48.986Z) and `npm run test:docs` passed; `git diff --check` is clean; no line this repair added names a home path; no dependency was added.

**Criterion 10:** met — `npm test -- --review` passes the kit selection, runtime-digest and exported-instance cases (runner-fixtures, launchpad); `suite:runner-fixtures` (13:00:11.312Z) and `suite:launchpad` (13:12:01.229Z) passed; the instance selection code is byte-identical to its state before the expansion.

**Criterion 11:** met — `npm test -- --review` passes the selection, first-order and exported-instance scenarios with drift and invalid-record refusals; `suite:launchpad-planning` (13:17:07.280Z) passed; the starter instructions are unchanged.

**Criterion 12:** met — `npm test -- --review` and `npm run test:docs` pass the integration regeneration, dispatch binding, reader default, meter lookup and seed-amendment cases; none of their sources changed in the undo.

**Criterion 13:** met — [host-wait-diagnosis.json](host-wait-diagnosis.json) stands; `npm test -- --review` passes the host-lane wait, heartbeat and callback cases.

**Criterion 14:** met — `npm test -- --review` passes the release-name preparation, publication, history, reader and refresh cases; none of their sources changed in the undo.

## Executed evidence

The order's Preflight suites, plus `runner-fixtures`, `launchpad` and `launchpad-planning`, ran one at a time under the bounded wrapper and passed at the current identity between 2026-10-17T12:36:08Z and 13:17:07Z: configuration-root 14.1 s, docs-check-fixtures 41.5 s, process-debt 213.7 s, worktree-integration 308.6 s, meta 5.5 s, docs-check 26.8 s, plan-refutation 86.9 s, plan 4.8 s, target-worktree 597.3 s, runner-fixtures 120.3 s, launchpad 397.4 s and launchpad-planning 303.1 s. The complete `npm test -- --review` then passed fresh: 46 suites, 103 tasks, 0 failed, 2976.26 s, identityUnchanged and buildOutputUnchanged true, evidence `host-gate:b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3:npm test`. Its longest tasks were target-worktree 668.4 s, two vertical files 573.3 s and 557.6 s, launchpad-planning 444.5 s and launchpad 380.6 s.

Before the gates, the isolated machinery coverage case reproduced D039's recorded failure at the restored code and passed after the declaration; `node scripts/harness.mjs check` reported 34 generated surfaces; the four edition checks passed with authority 005 selected; `npm run plan -- check` and `npm run publication:check` passed. After the gate, release preparation reported the v0.83.0 target current and the code identity unchanged. Document, register and index edits after the gate leave that identity unchanged.

## Review and queue disposition

At the operator's request, seventeen read-only `dotln-worker` agents of the twenty-worker budget checked the undo and researched the history (pinned to claude-opus-5-5 at xhigh by definition; Claude Code gives no effective-effort readback for a subagent): thirteen verifiers in batches and four researchers. No verifier found criteria 1 to 14 behaviour, a pre-expansion repair or an instance-validation fix lost. Their findings and dispositions:

1. D072 counted four generated console fixtures among the code paths: corrected to 20 code files with the generated outputs explained.
2. The rebuilt tree object was not named: recorded in D072.
3. Three fixes of older behaviour made under the expansion's authority (D042, D064's lexer guard, D055's future-finish rule) were withdrawn without record: named in D072 and routed to planning in its follow-up.
4. Sixteen register rows from D039 to D072 were undisposed or settled on withdrawn mechanisms: disposed against D072, the two D072-derived rows again after its correction.
5. The evidence README named authority 009 and described the expansion as current: corrected, with a withdrawn-section note and an undo section.
6. This handoff described the fifth repair: rewritten.
7. `runner-fixtures`, `launchpad` and `launchpad-planning` had no run at the restored code: run and passed before the complete gate.
8. D072 quoted the operator verbatim: paraphrased.
9. The history file stated reviewer and gate outcomes before they were in: updated with the final results.
10. One verifier disputed D072's 5,578 and 793 line counts: kept, because `git diff --shortstat` and `--numstat` over the 20 code files both give those figures.
11. One verifier asked for an explicit operator ruling on withdrawing D042: kept withdrawn under the operator's direction to undo every change related to the new gate and testing criteria, and named in the summary to the operator for veto.

Recorded and left as they are: two unreferenced expansion-era runtime snapshots under the ignored `.runtime/harness`, which the harness prunes as obsolete; the expansion's task-contract key file in the host state directory outside the repository, which no restored code reads; the retained probe scripts that import removed modules; and main's move to 68f58127, which final review integrates.

The adjacent queue stands at revision 180 with no running or next item; this repair added none. D072's follow-up is the planning carrier FUP-201956913dc8ea85, deferred.

## Outcome and limits

The outcome matches the operator's aim: the expansion is gone, the code equals its pre-expansion bytes plus one declaration, nothing of criteria 1 to 14 was lost, and planning has one account of the attempts. The restored flow's cost is the problem the expansion tried to solve: about 85 minutes of gate time for one clean pass, with nine of the twelve preflight suites running a second time inside the complete gate. Usage at the last readback: 34,797,696 total tokens (34,143,127 cached input, 482,565 cache-write, 252 uncached input, 171,752 output) from claude-transcript-message-usage at dispatch scope, observed 2026-10-17T14:08:41.181Z; reasoning tokens and cost are unavailable; subagents 17 of 20 (exact-observed). Verification and final review remain separate dispatches.
