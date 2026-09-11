# WO-043 — FINAL-001

**Verdict:** PASS

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.268","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

Claude Code 2.1.268, observed with `claude --version`. The model is `claude-fable-5-1`, the exact model ID the session exposes. Effort `max` is the session's launch setting (`CLAUDE_EFFORT=max`), not an effective-session readback, so the source is self-reported. This session took no part in the implementation, the repairs or the verifications.

## Subject and inputs

Branch `wo-043` at base `36267f6`, which equals local and remote `main` at review time, so no integration was needed. The subject is uncommitted: 163 modified tracked files plus the new files under `docs/control/orders`, `docs/evidence`, `docs/verifications`, `docs/final-reviews`, `packages/skeleton` and `scripts/lib`. `FinalReviewRequested` was recorded at 2026-09-11T19:11:14.674Z (checkpoint `refs/dotln/checkpoint/WO-043/13`, `bdedd4f`). Between VER-003's subject and this one only control, the generated index and this review's outputs changed.

Reviewed: the original order with its dated execution record; every cited section (06 §Work-order navigation and identity, 07 §Operator resume phrases and §Discipline, the map's §Status boundaries and §Catalog, the lane rules, the 2026-09-04 activation comparison, the critical-path §Dependency graph and its JSON graph, `scripts/work-orders.mjs`, `scripts/resume.mjs`, `scripts/lib/release-records.mjs`, the two shell suites and `scripts/test-work-orders.mjs`); the full subject diff, including the generated harness bundle, console fixtures and evidence editions; VER-001, VER-002 and VER-003; the ideation receipt, both repair receipts and D001–D014; `package.json`; 08 §PRs and commits.

## Independent checks

- Every one of the 84 migrated open orders' diffs is one hunk with no removed line that inserts exactly one marker-delimited JSON array (a script over `git diff -U0`). With WO-043's own block that is 85, matching the migration receipt's 85 rows and 245 entries.
- WO-052, WO-084, WO-033, WO-036 and WO-043 blocks equal the seed graph's outgoing edges and umbrella annotations; WO-036 follows D002's later supersession by WO-126.
- The regenerated index says "blocked" on 57 lines, all under Open. WO-042 and every closed row render the labeled token view; WO-043's row projects both release entries met.
- `scripts/lib/dependencies.mjs` was read in full: relation-specific fields, refusals naming the path and entry, `hard` and `satisfied-by-close` requiring a `pass` verdict, release edges observed through `git tag --merged HEAD` over annotated DotLn tags, deferrals waiting for control closure, and the activation refusal thrown before `appendTransition`.
- Report bytes against checkpoints: VER-003 (`1f7e72a`) equals its completion checkpoint 12 and checkpoint 13. VER-001 (`580ddec`) equals checkpoints 5 and 13 and differs from checkpoint 4 by its token line; VER-002 (`eace486`) equals checkpoints 9, 10 and 13 and replaces the F2-only report at checkpoint 8. The operator authorized both edits, the evidence README discloses them, and neither verdict changed.
- `git diff --check` is clean on the review tree.

## Acceptance criteria

Criteria 1 through 5 hold. The parser and projection fixtures (index cases 14 to 16), the resume suite's dependency fixture and VER-001's independent activation probe cover every relation, every refusal, ancestry, staleness and status parity; the files behind them are unchanged since checkpoint 3 (VER-003). Activation refuses before any event or checkpoint and names the corrective action. Consumers (`release.mjs`, `worktree.mjs`, the console collector) still parse status. The migration matches the seed graph and the prose with the recorded exceptions, and the 40 closed and historical authorities are byte-identical to `main`.

Criterion 6 holds: products 06 and 07, the map, the lane rules, the playbook, the generated Sources and limits, D001–D004 with their index rows (the ledger duty discharged by substitution), the publication rows and both edition locks. The mixed navigation section stays `planned` (VER-001 F1, D005).

Criterion 7 holds under the execution record's authorized expansion of the `packages/` fence: no new dependency (the lockfile changes only workspace versions), no fixture control event outside its temporary root, and the gate below.

The expanded obligations hold as VER-002 and VER-003 found: the session-command contract in 07 and in all twelve generated role targets; mandatory measurement through one collector with completion refusal and Stop advice; executor duties and the queue printed on ordinary `next` and `fix` with completion refusing pending items; Process Cost and Goal Alignment projected once into all six roles in both harnesses through the additive role-set adapter, each removable independently; current-evidence selection through `docs/evidence/current.json`; Claude `2.1.268` in the transport profile; compiler `0.9.1`, skeleton `0.15.1`, console `0.1.4`, application `v0.17.1`. The locked floor equals `HEAD`.

## Gate

`npm run harness -- evidence` exited 0 on tree `72cba09` before this report existed: `npm run test:full` 37 passed, 0 failed, 620.69 s, 78 fresh and 0 reused tasks; `git diff --check` exit 0 (recorded 2026-09-11T19:23:35Z). The completion command records the run on the tree containing this report and the publication outputs.

## Observations (non-blocking)

1. The verifier meter row includes the operator-authorized live feedback audit worker (166,081 and 0 tokens, `claude-result-envelope`, recorded as `verifier` at 15:52Z during the first repair). The tokens are real but belong to a worker episode, not a lifecycle verification. Owner: the next planning pass, for a distinct dispatch kind or label for worker episodes.
2. Codex dispatch windows start at the explicit harness entry while Claude windows start at the first message; 887,976 and 879,894 tokens before the first two executor entries sit outside the meter (VER-003 observation 2). A uniform boundary is a planning decision.
3. The PR meter table names no observation cutoff of its own, so PR.md states the regeneration time of its block.
4. Cosmetic: a deferral to a candidate label renders "resolve candidate candidate: later", and the D014 line in the docs README config log sits below the 2026-09-05 entries.

## Goal alignment

WO-043 is enabling work on the path to the external-source runtime: machine-checked activation gating, dependable role instructions and measured cost. Passing sends it to publication with the residual accounting boundaries disclosed. Failing (the NoOp for this decision) would spend another executor and verifier cycle, which the meter puts at about 8.5 million and 10 to 14 million tokens, on observations that are policy choices or cosmetic; the escalation and commons lenses weigh against it. The verdict rests on the structural checks above, not on the green gate alone, so no weaker standard is normalized. Reopen if the operator defines dispatch usage as whole-session usage or a consumer needs worker-episode attribution.

## Costs and publication

Tokens, measured with `node scripts/harness.mjs usage` (source `claude-transcript-message-usage`, scope `dispatch`): 240,053 at entry; 1,879,137 before this report was written (78 steps, 77 commands). The completion action records the handoff figure. Cost is null; the transcript records no price. Runtime: the fresh gate took 620.69 s; the run on the report tree reuses unchanged suites.

The reviewed state is committed as three coherent commits (typed dependencies, the operator-authorized expansions, the lifecycle records) and published with `npm run worktree -- publish WO-043 --title <reviewed title> --body-file docs/final-reviews/WO-043/PR.md`. This session's sandbox denies the GitHub CLI its configuration, so the push and PR creation run outside it. Merge and release close remain the operator's.
