# WO-236 executor handoff

Dispatch: `resume: next`, 2026-10-28. The implementation adds the executor's
registered-target write grant and consistent launchpad-based host instructions.
Application target: v0.101.0; compiler 0.32.0; skeleton 0.71.0. Console remains
0.5.0 with updated exact workspace pins. No dependency was added.

**Criterion 1:** met — The compiler admits `target-worktree` with provenance and no `root`, renders its effect and emits the grant. The compiler and generated-artifact checks passed in the complete run.

**Criterion 2:** met — [controls.json](controls.json) records identical Edit, Write and literal-redirect requests: base admission fails in all three; head admission passes with `contributor.target-worktree` provenance. Hook protocol exits are separately recorded. Harness fixtures passed.

**Criterion 3:** met — The generated-hook matrix covers sibling, clone, parent, other roles, missing/duplicate registration, other launchpad, invalid phase, canonical fallback and missing status. Refusals retain WO-144 and the required WO-168 explanation. Harness fixtures passed.

**Criterion 4:** met — Existing refusal and old-grant cases remain, alongside the additive compiler, hook and writer-envelope assertions. Harness fixtures, authority grants and skeleton passed.

**Criterion 5:** met — Claude, Codex, Copilot and target Next instructions use the registered launchpad; Codex adds the target. Local-origin and GitHub cases, including the second release-output consumer, passed. [D003](decisions.md#wo-236-d003--host-sessions-start-in-the-launchpad) records the directory evidence.

**Criterion 6:** met — The security write-back describes the sixth kind and its binding. The generated-hook matrix exercises Copilot's native write path under the reused registration. Harness fixtures passed; live external-host execution was not performed.

**Criterion 7:** met — [cold-start.json](cold-start.json) records all twelve installed roots. Both executor roots grow from 30,857 to 30,874 bytes; other roles are unchanged. Effective accepted ceilings are respected without a budget edit. The WO-236 oracle retains WO-233 and its historical chain; process-debt and generated checks passed.

**Criterion 8:** met — Product 03, product 07, security and kit README write-backs agree. `npm run publication:check` passed, including 255/255 heading coverage and both publication source-lock checks.

**Criterion 9:** met, conditional on the final document gate — `npm test -- --review` passed at the code identity below; `git diff --check` passed and the lockfile adds no dependency. This judgment is effective only after `npm run test:docs` passes for the final document bytes. `implementation-ready` must consume both passing rows before handoff.

The complete run recorded at 2026-10-28T17:15:23.769Z exited 0: 41 suites
passed, none failed, 107 fresh tasks, 2,118,646 ms. Code identity:
`d11731e16f92f4b054e3f4b6ca545145c7990629c748b7182657e293790002e8`.
The first three complete attempts remain failed/stopped evidence, as recorded
in D010, D012 and D015; their passing subsets are not the completion claim.
The runner and its evidence waiter both exited 0; no monitor remains running.

self-review: found 10; fixed 10; recorded 0

| Review | Found | Fixed | Recorded | Report |
| --- | ---: | ---: | ---: | --- |
| Criteria adversary | 2 | 2 | 0 | [criteria-adversary.md](criteria-adversary.md) |
| Design improver | 1 | 1 | 0 | [design-improver.md](design-improver.md) |
| Consistency reviewer | 5 | 5 | 0 | [consistency-review.md](consistency-review.md) |
| Gate-discovered expectation defects | 3 | 3 | 0 | D010, D012, D015 |

The criteria and design reviews share one launch defect, so eleven observations
represent ten distinct defects. All three workers were fresh
`codex-spawn-agent` workers, requested `gpt-6.1-sol` / `max`, with no descendants.
The same consistency reviewer checked the final write-backs and all twelve FUP
dispositions before the document gate, with no open findings in its inspected
scope. Its bounded coverage and withdrawn completeness claim remain explicit.

All twelve operator-raised issues have stable FUP records in the
[register](../../planning/followups.json), sourced by D014 and D016–D026.
Eleven are deferred; `FUP-a58dc4c969ee9c62` is allocated to WO-088. Their proposed
process and documentation changes were not implemented. [D027](decisions.md#wo-236-d027--operator-directed-fup-disposition-and-unchanged-execution-scope)
records that boundary. The outcome matches the original WO-236 scope and this
later direction.

Earlier integration-helper calls took in nothing; [D014](decisions.md#wo-236-d014--explicit-integration-authority-and-gate-isolation)
records the operator's objection and requires explicit direction before any
further integration. No further integration was run. Other worktrees and
recovery references were preserved. No branch commit, push or publication was
performed.

Root attestation: `codex-cli` 0.165.0, `gpt-6.1-sol`, effort `max`, source
`codex-session-readback`. Usage was unavailable at entry. The handoff usage
reader now reports available counters from `codex-transcript-counter`, scope
`dispatch`, cutoff 2026-10-28T17:15:38.954Z; monetary cost remains unavailable.
Final counters stay in ignored receipts and the response. Its zero observed
subagent count does not replace the three explicitly recorded worker launches;
unobserved remainder is unknown.
