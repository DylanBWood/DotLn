# WO-298 — A reviewed branch that was never pushed is named, and an instance's publish is not refused over a sign-off (version assigned at activation)

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-288",
    "relation": "planning-deferral",
    "date": "2026-11-25",
    "reason": "a port of WO-288's publication fixes that starts only if that order is held, and is withdrawn once a release close ships them",
    "until": "WO-288"
  }
]
<!-- dotln-dependencies:end -->

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. A drive of an order whose final review
has passed stops as `awaiting-publish`, naming the branch and its publish
command, where the reviewed branch was never pushed. The reviewer's root
says that a declined publish is not tried again. The contributor sign-off
becomes a stop an owner sets: core refuses as before, and an instance is
advised and its publish goes on. No stop is added that an instance cannot
lower. Assigned at activation under the standing opt-out default.
**Cost:** adds one local read of a remote-tracking ref for each reviewed
branch at a drive's stop, one reason a drive ends with, one sentence in
the reviewer's root, one word in the router's list of stops, one row of
the table of stops and its judgment in the publish, and about nine cases.
Removes the publish refusal an instance meets on its own commits, and the
drive's account that tells an operator to merge a branch nobody pushed.
`scripts/lib/drive-route.mjs`, `scripts/worktree.mjs`,
`packages/skeleton/src/stops.mjs` and
`packages/skeleton/src/loadouts/contributor.ts` are registered evidence
sources: the editions they stale are re-minted with `npm run sync`. No file
of `FEEDBACK_SOURCE_PATHS` is edited. One complete review run at handoff.
Wall-clock, tokens and steps are unknown until run.
**Nomination provenance:** the operator's direction of 2026-11-19 on what
his work instance met, built as Part F of WO-288 and unshipped while that
order did not close. The room the operator convened on 2026-11-25 filed
this port in reserve
([the room's plan](../planning/passes/data-is-the-record-2026-11-25.md#the-rooms-plan)).
**Depends on:** WO-288, as the block above types it.
**Recommended placement:** in reserve under Not now. It becomes the next
order if WO-288 is held, and it is withdrawn as superseded once a release
close has shipped WO-288's own Part F.

**Objective:** An operator whose order passed final review is told the
truth about where its branch is: a branch that was never pushed is named
with the command that publishes it, and nothing tells him to merge what
is not there. A reviewer whose publish a stop or the host declined says so
and stops trying. An instance publishes its own commits without being
refused for a sign-off rule that is core's.

**Observed gap (dated 2026-11-25 at `main` `77b5fc11e`, v1.4.0):**

- A final review records its pass, which closes the order, and publishes
  after it, and the publish records nothing. The drive's route
  (`scripts/lib/drive-route.mjs`) reads a closed order that is not merged
  as `awaiting-merge` and tells the operator to merge the reviewed pull
  request, whether or not any branch was pushed.
- The reviewer's root has no sentence on a publish that a stop or the host
  declines, and the router's root lists `awaiting-merge`,
  `awaiting-plan-approval` and `awaiting-close` among a drive's stops.
- `npm run worktree -- publish` fails every commit whose author the root
  does not name as its own and that carries no sign-off
  (`contributionSignoffRules` in `scripts/lib/contributions.mjs`). A new
  instance names no author, its owner included, so its own commits are
  refused. The rule has no row in the table of stops
  (`packages/skeleton/src/stops.mjs`), so an owner cannot set its level.
- WO-288's worktree holds a built version of all three, verified met at
  its fifteenth verification (its criteria 34, 35 and 41). That version's
  route reads through `childLimit`, a function of that order's Part D
  which `main` does not have, and it grew to cover publication states its
  verifiers constructed. This order ports the three behaviors and not that
  code.

**Design (scope discipline):**

- **Two states, read locally.** For a closed order that is not merged, the
  route asks of each reviewed branch (the order's, and a target order's
  target branch) whether the clone's remote-tracking ref for it exists and
  equals the branch's tip. Where one does not, the drive stops as
  `awaiting-publish`: its account names each such branch and the command
  that publishes it, and does not speak of a merge. Where all do, it stops
  as `awaiting-merge`, as today. The read is Git's own answer for a ref
  (`git rev-parse --verify`), bounded by the ten seconds the route's other
  reads on `main` use, and it fetches nothing.
- **What it does not decide stays as it is.** A clone with no `origin`, a
  read that fails or times out, a draft pull request and any other
  publication state leave the route at `awaiting-merge`, as today, and are
  known issues below.
- **The reviewer does not try a declined publish again.** The reviewer's
  rule gains the sentence WO-288's worktree holds:

  ```text
  A publish that a stop or the host declines is not tried again, in that form or another: say what declined it, in its own words, and the publish command for the operator to run, then end the turn.
  ```

  The router's list of the stops a drive ends on gains `awaiting-publish`.
- **The sign-off is a stop an owner sets.** `contribution-signoff` is a
  row of the table of stops, of the class that guards the kit's own
  record. At `refuse`, core's level, a publish with a commit that fails
  the rule is refused before the push, as today. At `advise`, an
  instance's level, the publish goes on with one advisory; a root that
  names no author of its own is told so in one line and has no commit
  judged. At `off` nothing is judged.
- **What returns this order.** A scenario below that fails by its command,
  or a required suite that fails at the tree's identity, reproduced alone
  where possible and under the recorded concurrency and limits where the
  failure depends on them; on input a kit writer produces or a documented
  command's contract admits, in what this order adds or alters, a wrong
  result accepted or a record lost or misfiled; a regression against
  `main` on such input; a breach of the clean-room floor or of an
  authority or credential boundary. Anything else a verifier, a reviewer
  or a reader finds is recorded as a follow-up with its reopening
  condition. A check that did not run neither passes nor returns. This is
  the room's rule, stated here as a trial.
- **How the criteria read.** Each criterion is one behavior with its supported input, its command and
  its scenarios, and its control says what fails at the base.

Rejected:

- _Copying WO-288's route._ It differs on what `main` can carry and on
  what the criterion claims: that code needs Part D's limits table, and it
  answers publication states no criterion lists.
- _A fetch before the read._ It differs on what a drive's stop may cost
  and depend on: a network call at every stop, and a new way to fail.
- _Admitting the publish command in a driven worker's lane._ It differs on
  whose boundary moves: which stop declined an instance's publish was not
  established from core, and the lane's list is a boundary of its own.

**Execution plan (the executor follows these steps in order; observed at
`77b5fc11e`, 2026-11-25):** A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names. Before step 1 the executor writes the cases of
criteria 1 to 4 and runs each alone: every row whose control says it fails
at the base fails there, and one that does not goes back to planning with
its output.

1. `scripts/lib/drive-route.mjs`: the read of each reviewed branch's
   remote-tracking ref, the stop `awaiting-publish` and its account.
   Check: three cases in `scripts/test-drive.mjs` (an order's branch never
   pushed; a target branch never pushed; both pushed).
2. `packages/skeleton/src/loadouts/contributor.ts`: the reviewer's
   sentence, and `awaiting-publish` in the router's list of stops. Check:
   the case of `scripts/test-harness.mjs` that reads the emitted bundle.
3. `packages/skeleton/src/stops.mjs`: the row `contribution-signoff`.
   `scripts/lib/contributions.mjs`: the judgment of a publish at the row's
   level. `scripts/worktree.mjs`: the publish asks that judgment before
   the push. Check: four cases in `scripts/test-configuration-root.mjs`,
   one for each row of criterion 3.
4. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`:
   the emitted roots, the features page and the editions the sources
   stale.
5. Write-backs: `docs/KIT.md`, "When a routed run stops" (the stop
   `awaiting-publish` and what the operator types) and its account of the
   table of stops (the sign-off row and its levels);
   `docs/product/07-execution-guide.md`, the passage on a drive's stops.
6. The handoff sequence of §Discipline: the complete run,
   `npm run test:docs`, `implementation-ready`.

**Deliverables:** the route's read and its stop; the reviewer's sentence
and the router's list; the row, its judgment and the publish's use of it;
the cases; the emitted bundle and the features page; the write-backs.

**Acceptance criteria (all required)**

1. A drive of an order whose final review has passed says whether its
   reviewed branches were pushed. Supported input: a fixture order closed
   by a passing final review, in a clone with an `origin`. Command:
   `npm test -- --only harness-fixtures`, the cases of
   `scripts/test-drive.mjs`.

   | Given | Then |
   | --- | --- |
   | the order's branch has no remote-tracking ref | the drive stops as `awaiting-publish`, and its account names that branch and `npm run worktree -- publish`, and does not hold `merge` |
   | a target order whose target branch has no remote-tracking ref | the drive stops as `awaiting-publish`, and its account names that branch and the target's publish command, and does not hold `merge` |
   | each reviewed branch's remote-tracking ref equals its tip | the drive stops as `awaiting-merge` |

   Control: the first two rows fail at the base, which stops as
   `awaiting-merge`. The third passes there and must still pass; it fails
   under the planted fault that the route always stops as
   `awaiting-publish`.

2. The emitted roots carry the reviewer's sentence and the router's stop.
   Command: `npm test -- --only harness-fixtures`, the case of
   `scripts/test-harness.mjs` that reads the emitted bundle.

   | Given | Then |
   | --- | --- |
   | the emitted `dotln-reviewer` root in each host directory the kit emits | each holds `A publish that a stop or the host declines is not tried again` |
   | the emitted `dotln-router` root in each host directory | each holds `awaiting-publish` |

   Control: both rows fail at the base.

3. A publish follows the level its root gives the stop
   `contribution-signoff`. Supported input: a branch holding one commit by
   an author the root does not name as its own, with no sign-off. Command:
   `npm test -- --only configuration-root`.

   | Given | Then |
   | --- | --- |
   | the stop at `refuse` | `npm run worktree -- publish` exits non-zero before any push, and its output names the stop |
   | the stop at `advise`, in a root that names an author of its own | the publish goes on, and its output holds one advisory that names the stop |
   | the stop at `advise`, in a root that names no author of its own | the publish goes on, its output holds one line saying the root names no author, and no commit is judged |
   | the stop at `off` | the publish goes on, and its output holds nothing of the rule |

   Control: the first row passes at the base and must still pass. The
   other three fail there, where the publish refuses whatever the root's
   level.

4. The table of stops holds the row. Command:
   `npm test -- --only configuration-root`.

   | Given | Then |
   | --- | --- |
   | `npm run features -- list` in core's root | its table of stops holds `contribution-signoff` at `refuse` |
   | the same command in an exported instance's root | the row is at `advise` |

   Control: both rows fail at the base, where the table has no such row.

5. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`,
`npm test -- --only configuration-root`, `npm test -- --only launchpad`,
`npm test -- --only process-debt`.

**Evidence gate:** under `docs/evidence/WO-298/`: the decisions, with each
control's failing output at the base and the account the drive prints in
each row of criterion 1; the handoff.

**Write-back duty:** as step 5 lists. The release's Read before upgrading
says that a drive now names a reviewed branch that was never pushed, that
an instance's publish is advised and no longer refused over the sign-off,
and how an owner sets that stop to `refuse`.

**Known issues and carry-ins:**

- This order is a reserve. It starts only if WO-288 is held, and it is withdrawn as superseded once a release close has shipped that order's Part F. If WO-288's close is still in hand when a pass reads this entry, it stays under Not now.
- The route decides two states and leaves the rest as it finds them: a clone with no `origin`, a failed or slow read, a draft, a branch pushed and then moved. WO-288's verifiers built each of those, and its code for them is in that order's worktree. Reopen: an operator is told to merge a branch that one of those states explains.
- The read is of the clone's remote-tracking ref, so a branch pushed from another clone reads as never pushed until this clone fetches. Reopen: an operator reports that account for a branch that was pushed.
- What refused the work instance's publish was laid to the sign-off from the operator's words and the kit's source; no line of that refusal was read. Reopen: an instance on this release still has its publish refused.
- The generated account of the kit's stops follows the table, so the count it states changes with this row.
- The criteria are written in the form the room of 2026-11-25 agreed, as a trial judged over the next five deliveries. Reopen: this order is returned on a reading of a criterion, or a row whose control says it fails at the base passes there.

**Non-goals:** any publication state beyond the two; a fetch; the release
preparation's decision title, the update's finish and the follow-ups
command's usage, which are WO-288's criteria 37 to 39; the day's figure,
which is WO-297's; the publish command in a driven worker's lane; what the
sign-off rule requires of a commit.

**Operator-review assumptions:** an instance's level for the sign-off stop
is `advise`; a reviewed branch counts as pushed when this clone's
remote-tracking ref equals its tip.
