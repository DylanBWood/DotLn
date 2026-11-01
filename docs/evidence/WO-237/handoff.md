# WO-237 handoff

Attestation: Claude Code 2.1.316, `claude-opus-5-5`, effort `max` read from
`CLAUDE_EFFORT` (selected, not effective). The order recommends `xhigh` for the
executor; the session ran at the operator's `max`. One session on this order,
from the `resume: next` dispatch at 2026-11-01T14:08Z, continued across a
context compaction.

Code identity at handoff: `5a4b834539e42d6dbda4db3b86bfb352270b62ce5d3cc902bfec55e912bcf0c8`. Base: `main` at `9139d91e`, which did not
move during the order, so no integration is owed.

The order's decisions are in [decisions.md](decisions.md), its paired controls
in [controls.json](controls.json) (made by [controls.mjs](controls.mjs)), and
the independent reviews in [reviews.md](reviews.md).

## Criteria

**Criterion 1:** met. `closed-journal: 720` is in `DEFAULT_RETENTION`
(`packages/skeleton/src/temporary-root-records.mjs`),
`docs/control/budgets.json` and `scripts/kit/budgets.template.json`. The case
"retention seeds admit an older instance and reject invalid values"
(`scripts/test-temporary-roots.mjs`) reads 720 from all three and shows
`readBudgets` admitting it. "export update preserves ownership, validates
actions and keeps the exported resident" (`scripts/test-launchpad-update.mjs`)
updates an export whose budgets predate the key, runs its `scripts/meta.mjs`
green and reads 720 through its updated runtime
([D002](decisions.md#wo-237-d002--the-closed-journal-class-its-seed-and-readers-of-a-newer-budgets-file)).

**Criterion 2:** met. `release_case_success` (`scripts/test-release.sh`)
closes a fixture order. It finds the worktree's journal, state, `checks.json`
and suite record in `docs/control/local/retained/<WO>/harness/` under a
`closed-journal` owner record, with the capture directories left behind, and
`journals {lane, files, bytes}` on the cleanup row and in `release-close.json`.
`release_case_journal_failure` makes the move fail: the close keeps the
worktree, records `journals.outcome: failed` with the error and the retry
command, and leaves the published release untouched. "a cross-volume journal
move copies, and any other failure keeps the worktree's journals"
(`scripts/test-temporary-roots.mjs`) covers the EXDEV, EACCES and ENOSPC
arms. Control c01 records both arms: the base reads "journal lane after close:
absent" (exit 2), and this order lists the lane (exit 0)
([D001](decisions.md#wo-237-d001--a-closed-orders-journals-move-into-its-retained-lane)).

**Criterion 3:** met. "the prune judges a closed order's journal lane by its
class window and keeps its parent lane" removes a lane past 720 hours, keeps
one within it and one under `null`, and names `closed-journal` in the report.
Control c04 shows the order's lane waiting for the journal lane inside it. A
retried close merges into an existing lane in "a closed order's journals move
into its retained lane and a retried close merges into it" and "a retried
merge counts a log once, and a lane's links never take a write outside it".
Those cover merge records against a grown source, repeated rows, another
worktree's append between two attempts, an unpublished attempt, a torn record
and a first merge from another source. Control c06 shows a merge that consults
no record appending twice (D001,
[D003](decisions.md#wo-237-d003--the-prune-judges-a-journal-lane-by-its-class-and-the-orders-lane-waits-for-it)).

**Criterion 4:** met. "WO-237 a closed order's retained journals count for
that order, and the feed names the lanes and their window"
(`scripts/test-plan-refutation.mjs`) counts a retained journal's host denials
for the lane's order and reads `retainedJournals` in the feed, the page, the
export and the start block. The WO-172 case pins the export's field order with
`retainedJournals` in it
([D006](decisions.md#wo-237-d006--plan-failures-reads-the-lanes-the-start-blocks-bound-is-compact-and-unlimited-reads-as-unlimited)).

**Criterion 5:** met. "usage reads a closed order's session from its retained
lane and names that lane" (`scripts/test-harness.mjs`) reads a closed
session's counters from its host transcript through the lane and reports
`source: retained-lane:<lane>`
([D007](decisions.md#wo-237-d007--harness-usage-reads-a-closed-session-from-its-lane)).

**Criterion 6:** met. "a kit update preserves and admits the committed
instance history" (`scripts/test-instance-history.mjs`) closes an updated
instance's order and finds its journals in the lane under the
`closed-journal` class.

**Criterion 7:** met. Product 07 §Workflow closeout and releases, §Preflight
and §Operator recovery controls, and the kit README §Owned cleanup and
retention, state the lane, the class, the seed, what moves, what stays and
that the lane is ignored local material. `npm run publication:check` passed.

**Criterion 8:** met. "a renumbered device is re-stamped and judged by its
class and window like any root" removes a renumbered root past its window. It
ledgers `device-renumbered {recordedDevice, observedDevice}` before the marker
changes and re-stamps the current device. Control c02 shows the base retaining
that root with "Temporary owner record is invalid or the directory was
replaced", and c03 shows a changed inode still refused. "a renumbered device
never admits a replaced, foreign, live, protected or undeclared root" covers
the step 7 negatives and deletes nothing. That includes a replacement as late
as the removal itself (a directory or a link put in the root's place after its
identity was read is moved back, and a registered root reached through the
link is untouched) and a parent moved anywhere but its own aside. "plan
start's apply names what it removed when it stops partway" shows a parent that
refuses the removal leaving the root and its owner record intact. Control c05
shows the base's path-based removal emptying that root instead. "a device
transition is ledgered before the marker changes, and once" covers the
idempotent retry. The starter-refresh scratch check follows the rule in
"starter refresh publishes one verified commit and preserves every refusal
boundary" (`scripts/test-launchpad-update.mjs`)
([D004](decisions.md#wo-237-d004--a-root-is-its-token-and-its-inode)).

**Criterion 9:** met. `npm test -- --review` passed at the handoff identity
(`host-gate:5a4b834539e42d6dbda4db3b86bfb352270b62ce5d3cc902bfec55e912bcf0c8:npm test`, recorded 2026-11-01T19:33:17Z, 36 min 24 s, 45 suites, 115 fresh and 0 reused tasks, exit code 0, gate cleanup with 0 blockers). `npm run test:docs` runs after this handoff, before completion.
`git diff --check` is clean, and the only package changes are the skeleton's
version and the console's pin of it.

## Where this departs from the order

- **Codex reviewers.** The three independent reviewers were Codex sessions
  launched from this Claude session, not Claude `dotln-worker` agents, on the
  operator's direction (D011).
- **Unrechecked fixes.** On the operator's directions of 17:04Z and 17:53Z, the
  fixes after the fourth recheck went to the complete run without a further
  recheck. Only findings that bear on an acceptance criterion were fixed.
  [reviews.md](reviews.md) lists the four recorded findings, each a
  crash-recovery edge outside the criteria.
- **Five complete runs.** The first failed only on the WO-172 field-order pin.
  The second was stopped to apply the criteria adversary's blocking fixes. The
  third passed all 45 suites but exited 1 on one gate-cleanup blocker, an owner
  record this order's own test left in its fixture. The fourth was stopped
  under the operator's override. The fifth is the pass above. Before it, a
  focused `plan-refutation` run showed the cleanup blocker gone (0 blockers).
  The operator ended an `operator override:` session at 18:51Z; it stopped the
  fourth run and changed nothing else
  ([D012](decisions.md#wo-237-d012--the-operators-override-stopped-the-fourth-complete-run)).

## Reviews

self-review: found 59; fixed 55; recorded 4

The criteria adversary, the design improver and the consistency reviewer each
judged the implementation and every repair of their own findings in four
rechecks; [reviews.md](reviews.md) lists every round, finding and disposition.

## Usage

Dispatch standing at handoff: 5 h 25 min of 8 h 0 min; complete runs 5 of 20; within. Claude subagents: 0 of 20, counted exact-observed. The three reviewers were separate Codex sessions, 3 in all, launched by command rather than as Claude subagents; their own token use was not read back. Token counters from `node scripts/harness.mjs usage` at 2026-11-01T19:33:35Z: total 339,352,957 (input 1,372, cached input 336,881,297, cache write 1,548,965, output 921,323; reasoning tokens unavailable), source claude-transcript-message-usage, scope dispatch. Cost is unknown, since no counter reports it.

## Goal alignment

The outcome matches the order's objective. A closed order's session journals,
states, gate index and suite records move into main's retained lane under the
`closed-journal` class that the prune judges. Planning's failure counts and the
usage readback read them by order. A root on a renumbered volume is judged by
its token and inode. The carry-ins are closed: plan start applies the prune
(D005), and the start block is measured compact, with an unlimited ceiling
reading `unlimited` (D006). It departs from the procedure as listed above.
