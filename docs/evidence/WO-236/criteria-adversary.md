# WO-236 independent criteria review

Worker: `codex-spawn-agent`, fresh `criteria_adversary`; requested model
`gpt-6.1-sol`, effort `max`. Returned 2026-10-28 during `resume: next`.
The worker verified cwd/Git root and reviewed the current order, diff and
selected untracked deliverables read-only. It ran no suite, probe,
generator, lifecycle transition or write, and spawned no descendant.

Found 2; source fixes reviewed 2; recorded 0; open findings 0.

1. **C1 — P1, criterion 5, fixed.** `hostLaunchLines` returned before
   printing session launches for local origins. The default target fixture
   creates a local bare remote, so the new Claude assertion could not pass.
   Basic launch instructions now always render and publication rules remain
   conditional. The worker re-read the local-origin assertions in
   [test-target-worktree-start.mjs](../../../scripts/test-target-worktree-start.mjs)
   and retained GitHub-rule coverage in its host-rule case, alongside
   [worktree.mjs](../../../scripts/worktree.mjs).
2. **C2 — P2, criterion 3, fixed.** Non-executor target writes were correctly
   denied but lacked the required WO-168 withheld-cause suffix. The
   [harness-host.ts](../../../packages/skeleton/src/harness-host.ts) fallback
   supplies that cause after existing physical-root explanations, granting
   no additional authority. The role matrix in
   [test-harness.mjs](../../../scripts/test-harness.mjs) asserts the refusal
   and suffix from one response. The worker re-read both remedies.

No additional concrete criteria defect or required regression gap was
found in the assigned scope. Compiler contract coverage, registry/phase
matrix, source-host case, Copilot native-path admission and the recorded
controls were inspected. At this review's cutoff the remedies were
source-reviewed; complete executable validation remained the executor's duty.

Disposition: [D009](decisions.md#wo-236-d009). C1 overlaps the design
review's D1 observation; it is one distinct defect.
