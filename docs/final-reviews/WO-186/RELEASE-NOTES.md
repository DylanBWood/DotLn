## Release overview

This release makes gate time follow the change. A rerun of `npm test` runs only the tasks with no passing result at the same code identity and composes a complete row from fresh and carried results. A new worktree whose code equals main's stands on main's passing row. A role can write its own report, verification or review while its product gate runs. The visible changes:
- A rerun after one failed task runs that task alone, and every carried result names the row that executed it.
- Untracked code is part of the code identity, so an untracked edit invalidates reuse and staging changes nothing.
- Gate rows keep each task's five slowest cases, and planning lists the five longest tasks against their thirty-day medians.

The release is for operators and agents who run `npm test` in a DotLn worktree. The final reviewer's gate still runs every task fresh.

## Read before upgrading

- **The write refusal is narrower.** During a plain product gate the hook admits writes to the active order's own `docs/evidence`, `docs/verifications` and `docs/final-reviews` directories at the default document roots. Everything else stays refused, and document and review gates keep the full refusal. A product task that reads those record paths fails. The five-refusals paragraph in `CLAUDE.md` and every generated role root states the new rule.
- **Reuse is per task.** `npm test` runs only the selected tasks whose latest recorded run at the identity is not a pass. A later failed run, or a run in a row that failed an integrity check, displaces an older pass. The runner and the completion's claim check share that decision, and the worktree's own runs decide before main's. `--again` and `--review` run everything fresh.
- **The identity changed.** Non-ignored untracked code enters it by path and bytes, and a symbolic source alias is refused.
- **Five suites moved to the document gate.** `license-surfaces`, `resume`, `resident-bind`, `local-runner-double` and `artifact-corpus` read tracked documents the identity excludes. They now run in the fresh document gate, whose median rose from 38.993 s to 66.690 s.
- **Proof limits are stated.** An uncomputable identity or an unreadable main index leaves an `npm test` claim recorded as stated with a `Gate index unavailable` advisory. A run that stops before its row is written displaces nothing.
- **The verifier's cold-start ceiling** rises from 25,151 to 29,831 bytes by a dated acceptance. The executor stands at 29,237 of 29,246.
- **Component versions.** The compiler moves 0.25.1 → 0.25.2, the skeleton 0.52.2 → 0.52.3 and the host 0.34.3 → 0.34.4, and the console pins the compiler and skeleton exactly. No dependency is added.

## Substantive changes

**Task-level reuse.** A gate composes a complete row from fresh results and passes carried from rows at the same code identity, each naming its source row, identity, date and location. Passing tasks from a failed attempt may be carried only when that attempt ended at the identity it started with and kept its attested build output. The build is carried only while its ignored output matches the digest the latest passing build recorded. Changed output at gate end fails the row, and with no task to run nothing builds.

**Main's rows from a worktree.** With no row of its own at the identity, a worktree reads main's index read-only through the Git worktree registration. A pass it carried from main is checked against main's latest execution at each later lookup.

**Review selection.** Machinery suites are selected by changes from the merge base, with renames disabled and paths read NUL-delimited. When the base or the untracked listing is unavailable, every machinery suite is selected.

**Slow cases repaired at their cause.** The lock matrix's eight cells run concurrently on private roots, with all twelve assertions and the 120 s cell deadline kept. The integration fixtures clone with `--no-tags --single-branch`. The harness case thought to have grown by 180 s was already fast; the gap was delayed result delivery. Five-run medians before and after: harness case 1.924 → 1.758 s, skeleton task 355.779 → 229.754 s, integration task 307.349 → 226.064 s. Skeleton and integration stay above the 200 s and 150 s figures, and their remaining time is profiled to the assertions that need it.

**Visible growth.** Each task's five slowest cases are kept on the gate row. A synchronous marker lets the heartbeat name the running case. `npm run plan -- conditions` holds a task whose latest run exceeds its thirty-day median by half, and shows the plain gate's median against 360 s.

## Progressive polish

Product 07 §Discipline, the README's test paragraph and refusal sentence, and `docs/AI-HARNESS-SECURITY.md` state the new rules in place. Fixtures cover composed rows from a second shell and session, failed, stopped, timed-out and partial results, row-integrity failures, a failed single-suite run in a fresh linked worktree, sixteen history arrangements, untracked edits and staging, the merge-base selection, write admission and refusal, and the read guard's root, ancestor, copy, descriptor and default-open forms. The authority, artifact-identity, verification and feedback evidence editions are re-minted, and the harness bundle is re-emitted.

## Evidence and compatibility

Application `v0.66.3` is a patch release over `v0.66.2`, built from WO-186 on `main` at `2816c773`. The compiler moves 0.25.1 → 0.25.2 and the skeleton 0.52.2 → 0.52.3. Kernel sources are unchanged. The console's exact pins and its regenerated expected fixtures move, and no dependency was added.

The verification sequence:
- [VER-001](../../verifications/WO-186/VER-001.md) failed on criterion 3: a composed row could report a pass against build output made at another identity, and an older pass survived a later failure. It also sent eight lower findings to the repair.
- [VER-002](../../verifications/WO-186/VER-002.md) passed after the repair.
- [FINAL-001](FINAL-001.md) failed on criterion 3: in a worktree standing on main's row, the claim check accepted main's pass after the worktree's own run of a task failed.
- [VER-003](../../verifications/WO-186/VER-003.md) passed after the second repair, which made one decision serve the runner and the claim check.
- [FINAL-002](FINAL-002.md) passed.

A fresh `npm test -- --review` at the reviewed subject passed 36 of 36 suites with 86 fresh tasks in 934 s, and `npm run test:docs` passes. The plain gate's median across five after-phase runs is 422.027 s against 495.605 s before. The review gate's is 814.813 s against 506.452 s, on different selections. No whole-order saving is established.

Known limitations:
- The integration and harness suites' own case-ended lines never reach live progress. A parent test and its subtests share the five-slowest slots. These and three other low items are boarded for planning (WO-186 D047).
- The skeleton's whole-row `findGateCheck` keeps its earlier rule (D038).
- The read guard does not observe shell, Git or native reads, and other untracked inputs the identity excludes stay outside its inventory until staged.
- Reuse frequency over future orders is unmeasured. The fifty-order model in D046 is conditional.

Details are in the [decisions](../../evidence/WO-186/decisions.md), the [cost record](../../evidence/WO-186/costs.md) and the [handoff](../../evidence/WO-186/handoff.md).
