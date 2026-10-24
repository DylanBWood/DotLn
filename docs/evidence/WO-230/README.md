# WO-230 execution evidence

The `resume: next` dispatch on 2026-10-24 selected WO-230. The executor is
Codex CLI 0.164.0, gpt-6-astra at max effort, from the canonical session
readback. The cited implementation, tests, product sections and the fork's
WO-013 D008, D009 and FINAL-001 F1 were read before the change.

The baseline probe ran the original target-worktree fixture with the order
fast-forwarded to the clone's later main commit, then added `reviewed.txt`,
passed fixture verification and published to its local forge. It returned
two Change rows: `later.txt` and `reviewed.txt`. Only the latter belongs to the
order. The bounded probe exited 0 in 4,683 ms on 2026-10-24 at 18:58:35 UTC;
its temporary repositories were removed by `withFixture`. The probe lives in
session scratch as `wo230-baseline.mjs`; no real forge was used.

The corrected integrated arm publishes one row, `reviewed.txt`; the paired
activation-base arm with the same working tree still publishes two. The final
records case has six paths against its merge base and only four against its
parent, demonstrating why the parent loses the reviewed target change.
[controls.json](controls.json) records the counts and refusal, retry, path and
body controls. The third complete review passed at 2026-10-24T20:14:11.199Z,
exit 0, in 1558.394 seconds, with 105 fresh tasks,
0 reused tasks and no unrun tasks.

[gate-runs.json](gate-runs.json) preserves the two failed complete attempts
and the passing complete row. D006 records the first failure's generated
input boundary repair; D007 records the second failure's omitted fixture
input and its passing bounded reproduction. Neither failed run is treated as
a complete pass. [self-review.md](self-review.md) records the two independent
workers, their duplicate finding, the fix and their zero residual findings.
See [decisions.md](decisions.md) for tradeoffs and reopening conditions, and
[handoff.md](handoff.md) for the criterion judgments and final document-gate
requirement.

The final review of 2026-10-24, [FINAL-001](../../final-reviews/WO-230/FINAL-001.md), integrated `main` and took in nothing ([D008](decisions.md#wo-230-d008)), reread the diff and reran the six publish cases, the body case and the plan-refutation suite at the integrated tree, and passed with no finding of its own ([D009](decisions.md#wo-230-d009--final-review-pass-at-the-integrated-identity-the-three-matched-register-rows-stay-as-they-are)). The release surfaces are [PR.md](../../final-reviews/WO-230/PR.md) and [RELEASE-NOTES.md](../../final-reviews/WO-230/RELEASE-NOTES.md).
