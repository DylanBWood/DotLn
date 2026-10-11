# WO-072 repair handoff

Repaired VER-001 F1 and its adjacent F2 finding. Order selection now compares
physical launchpad directory identities, so alternate launchpad spellings select
the same self or registered-target order. An unregistered foreign directory's
`status --json` exits 1, with its explanation on stderr and no stdout. The
original target start, recovery and no-release close remain covered by the
passing full review. Local release preparation retains application v0.75.0;
no component version or dependency changed.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.1","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

**Criterion 1:** met — the target-worktree suite passed in the full review. Its real-Git fixture starts at the declared earlier commit, checks the ignored seven-file target-worker bundle and echoed authority profile, and verifies two clean target commits, including `git add -A`, contain no DotLn control, work-order, evidence or harness files.

**Criterion 2:** met — both declared launchpad routes passed. Status and lifecycle dispatches select the registered target branch; verification and final-review reports land only in the launchpad's configured roots. New regressions cover self and target directories and their subdirectories through physical, symlink, chained-symlink, case-variant and volume-alias launchpad spellings. A self order also selects with only a target registry. Unregistered Git and non-Git directories select no order, JSON status refuses with exit 1 and empty stdout, and control bytes stay unchanged. Branch drift still refuses.

**Criterion 3:** met — missing clone mapping, non-top-level clone and case-variant parent refuse before worktree, branch or registry creation. The full target-worktree suite passed; the bounded run observed a case-insensitive volume and exercised the parent-case refusal. Exact and case-only planned worktree collisions also refuse without a pending receipt. The repair retains physicalDirectory's exact-spelling creation checks.

**Criterion 4:** met — the full target-worktree suite passed the unmerged-target refusal, merged dry run, removal of the paired target and launchpad worktrees and branches, recorded no-release disposition, no tag in either repository, and idempotent retry.

**Criterion 5:** met — product 07's document-resolution and no-release close paragraphs and the playbook target loop are in place. The resolution paragraph now states physical launchpad identity and unregistered JSON refusal. D002 retains the WO-064/WO-071 dispositions; D007 records this repair's evidence, alternatives and reopening condition. Publication locks and generated indexes are current; `npm run publication:check` passed both editions.

**Criterion 6:** met — `npm run test:docs` passed all 35 tasks; `npm test -- --review` passed 35 suites and 87 fresh tasks at the identity below. `git diff --check` is clean. Neither package manifests nor the lockfile changed.

## Executed evidence

Code identity:
`4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414`.

| Command | Result | Duration | Recorded UTC |
| --- | --- | ---: | --- |
| `npm run test:docs` | 35 passed, 0 failed, 35 fresh tasks | 99.572 s | 2026-10-11T22:34:39.331Z |
| `npm test -- --review` | 35 passed, 0 failed, 87 fresh tasks | 1448.560 s | 2026-10-11T22:59:12.601Z |

Both rows report unchanged code identity and build output. The full gate is
recorded as `npm test`, with `gateSelection: review`; its target-worktree task
passed in 46.89 s. Evidence references:
`host-gate:4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414:npm run test:docs`
and
`host-gate:4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414:npm test`.

The new launchpad-spelling regressions failed 2/2 before the source repair
(2026-10-11T22:29:16.202Z) and passed 2/2 after it
(2026-10-11T22:29:44.854Z). The complete bounded target suite then passed
10/10, with no skips, in 27.822 s (2026-10-11T22:30:43.512Z). It exercised
case variants and a volume alias on this host. Chained aliases, subdirectories,
registry-only self selection, report ownership under aliased dispatch and the
JSON refusal checks extend the cases quoted by VER-001. This is macOS execution
evidence; no Linux or case-sensitive-host run is claimed.

## Review and disposition

The repair closes the reported class: navigation compares physical launchpad
identity at both selection boundaries; creation keeps its stricter spelling
checks. `findLaunchpad` precedence and the target branch binding remain in force.
The executor reviewed the repaired source and tests, then separately reviewed
the criterion coverage and final authored outputs. No additional defect was
identified in those bounded passes, and no worker was launched for this repair.

self-review: found 3; fixed 3; recorded 0

That line retains the original implementation review counts in
[self-review.md](self-review.md): criteria adversary 1/1/0, design improver
2/2/0. Those reviews preceded VER-001; they are not claimed as fresh reviews of
this repair. The original implementation used four read-only workers total;
this repair used zero.

[WO-072-D007](decisions.md#wo-072-d007--repair-launchpad-identity-and-unselected-json-status)
records the fix and rejected alternatives. NoOp would preserve the demonstrated
regression. Goal alignment matched the intended boundary: the repair changes
identity comparison and failure output without changing document ownership or
relaxing creation checks. The JSON repair is completed as adjacent-0002 at
queue revision 10; no queued work remains. The canonical register marks
FUP-57533538348d8f5f settled on the executed repair evidence. VER-001 remains
immutable, and independent re-verification is the next lifecycle judgment.

All fixture repositories created by the bounded runs were removed by their
cleanup. The repository scan outside dependencies and intake found only the
root worktree's `.git`. No separate background monitor was started; the canonical
evidence waiter exited with the passing full-gate row.

**Process cost:** source `codex-transcript-counter`, scope `dispatch`, handoff
sample cutoff 2026-10-11T22:59:12.707Z. Available counters remain in the ignored
usage receipts and the operator response; dollar cost and wrapped command count
are unavailable. No subagents were launched; the harness observed zero admissions
with an unknown uncounted remainder. The order required the full review; its
24-minute run dominates the elapsed repair time. The regression red/green runs
and bounded suite established the local behavior before that gate. No
comparison with an equivalent cheaper outcome is claimed.
