# WO-236 independent design review

Worker: `codex-spawn-agent`, fresh `design_improver`; requested model
`gpt-6.1-sol`, effort `max`. Returned 2026-10-28 during `resume: next`.
The worker verified cwd/Git root and read the order and current diff.
Review was read-only: no suite, generator, lifecycle transition or write,
and no descendant.

Found 1; fixed 1; recorded 0; unresolved 0.

**D1 — Medium, fixed.**
[hostLaunchLines](../../../scripts/worktree.mjs) coupled basic executor
launch instructions to GitHub publication URL parsing. Target start
supports local origins, so that dependency suppressed otherwise useful
instructions. The final edit always renders the three host launches and
confines selector-dependent publication text and literal-rule writes to
their guarded branches. The worker re-read the edit and judged it a
bounded, maintainable correction. The criterion and fixture implications
were transferred to `criteria_adversary` as C1, rather than reviewed twice
under the design brief.

No further design changes were recommended for the compiler contract,
contributor declarations or registered-target resolver. The revised
withheld diagnostic in
[harness-host.ts](../../../packages/skeleton/src/harness-host.ts) affects
refusal explanation without altering grant selection.

Disposition: [D009](decisions.md#wo-236-d009). Executable validation was
still pending at the worker's cutoff. D1 and criteria C1 name one distinct
defect; both reviewers accepted the same source remedy.
