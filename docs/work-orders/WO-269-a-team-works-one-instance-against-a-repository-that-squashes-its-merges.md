# WO-269 — A team works one instance against a repository that squashes its merges: a target order closes when its change is in the base by any merge method, the instance declares the authors whose commits are its own, and the kit guide gives the conventions by which one planner assigns orders to several people and settles the order they merge in

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. One check in a target order's close
admits a squash or a rebase merge and one named admission; one optional
list in the configuration; a section of the kit guide. An instance whose
target merges with merge commits and has one author closes as today.
Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/lib/target-worktree-close.mjs`
(`containsBranch`), the reading of the base for the order's change by
patch identity, recurring work in each target close whose branch is not
an ancestor of the base (one patch identity per base commit since the
merge base; unmeasured, and measured by this order on the target close
fixture), and the `--merged-as <commit>` admission; in
`scripts/lib/config.mjs` (`validateContributions`) and
`scripts/lib/contributions.mjs` (`contributionSignoffRules`), the
`authors` list; `scripts/lib/git-surface.json` gains the Git forms used;
cases in the suites the Preflight names; the kit guide and the decisions.
Removes these states: every order against a repository whose policy is
squash or rebase ending in the close's refusal; each teammate's commit
needing a sign-off trailer because the instance may declare one author; a
team learning the kit's one-person assumptions by meeting them. Tokens
and wall-clock: unknown until this order's handoff records them.
Re-mints: none expected; the executor names any edition `npm run sync`
reports. `scripts/lib/target-worktree-close.mjs` is a declared source of
machinery suites, so the final criterion names `npm test -- --review`.
Steps: the executor's, below.
**Nomination provenance:** the operator's statements of 2026-11-09 that
teammates will use the kit and that the first work arrangement is one
shared instance whose planning passes the operator runs, assigning orders
to teammates and settling the order they merge in (ignored captures
SHA-256 `b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb`
and `5cefd88d081917cbab4665ed7b5488385108bb63ad8f4f2d3775f9c523c6e64f`),
which is the reopening condition of FUP-1c36325905c52243 (one team fork,
many worktrees, parallel merges, recorded 2026-10-24), allocated by
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md).
**Depends on:** WO-072 (closed: the target worktree lifecycle); WO-260
(closed: the recorded Git surface). No open order.
**Recommended placement:** eleventh, after WO-268. The first order a teammate
closes against the team's repository meets it.
**Cites (read these sections):** `scripts/lib/target-worktree-close.mjs`
(`containsBranch` and the message that names the command to rerun);
`scripts/worktree.mjs` (the launchpad branch's own merged check, read
only); `scripts/lib/config.mjs` (`validateContributions`);
`scripts/lib/contributions.mjs` (`contributionSignoffRules`);
`scripts/lib/git-surface.json`; `scripts/lib/worktree-integration.mjs`
(what integrating main regenerates and unions); the kit guide §First steps (the merge-commit sentence and a target's
registration), §Kit files and instance files (the author declaration) and
§Releases in this instance; product 07
§Independent workflows and integration.

**Objective:** A target order closes once its reviewed change is in the
target's base branch, whether the team's repository merged it with a
merge commit, a squash or a rebase. The instance names the people whose
commits are its own. A team that shares one instance, with one person
planning and assigning, finds in the kit guide what each person does and
which of the kit's steps are one at a time.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- The close reads ancestry. `containsBranch` in
  `scripts/lib/target-worktree-close.mjs` runs `git merge-base
  --is-ancestor <order branch> origin/<base>` and refuses with `target
  branch … is not merged into origin/…; source retained` otherwise. A
  squash merge and a rebase merge put the change in the base under new
  commits, so the branch is never an ancestor and every order against
  such a repository ends at that refusal. The kit guide §First steps says
  the same of the instance's own repository, where the operator sets the
  merge method; a team's application repository has a policy the instance
  does not set.
- Of the eight ancestry checks in the lifecycle, one reads whether a
  target order's branch is merged: `containsBranch`. The others stay as
  they are and are not this order's subject: the base's own fast-forward
  in the same file; in `scripts/worktree.mjs` the integration check and
  the launchpad branch's merged check, which reads the instance's own
  repository; and in `scripts/release.mjs` the remote tag's ancestry, the
  target release's tag reach, main's fast-forward and the previous
  release tag's ancestry.
- One author is exempt. `validateContributions` admits only
  `operatorAuthor`, one identity; `contributionSignoffRules` passes a
  commit by that author or one carrying a matching `Signed-off-by`
  trailer. Every teammate's commit on a shared instance therefore needs
  the trailer, though the work is the instance's own.
- The code favors one operator per instance, and several people sharing
  one meet that in particular places: the writer reservation is per
  checkout and per machine, so nothing stops two people activating one
  order; an order in flight is uncommitted on one machine until its final
  review; a pass's rules are checked against the planner's own session
  journal; each clone needs its own local-terms list and its own intake;
  the next version is assigned above existing tags and retimed at
  integration; and one final review or close at a time is a discipline,
  not a gate. Per-order control segments and `worktree integrate`'s
  regeneration of the generated pages already let orders by different
  people integrate mechanically.

**Design (scope discipline):**

- Merged means the change is in the base. After fetching, the close
  accepts the order when its branch is an ancestor of the base, as today,
  or when the base holds the branch's change under other commits: one
  commit since the merge base whose patch identity equals that of the
  branch's whole change (a squash), or a patch-equal commit for each of
  the branch's commits (a rebase). It reads only Git, so it needs no
  forge and works on any. Rejected: asking the forge whether the pull
  request merged (the axis is what is proved: a merged pull request says
  nothing of which bytes landed, and the close's purpose is that the
  reviewed change is in the base). Rejected: requiring merge commits of
  the target (the axis is whose policy it is: the instance does not own
  the team's repository).
- A merge that changed the patch is admitted by name. When a squash was
  edited at merge, no identity matches and the close refuses as today,
  naming `--merged-as <commit>`; with it the close checks that the named
  commit is in the fetched base, proceeds and prints it. The person
  naming the commit takes the judgment that it carries the change.
- The instance's own repository keeps its rule. Its pull requests merge
  with merge commits, which the instance's owner sets, and no launchpad
  check changes.
- The instance declares its people. `contributions.authors` lists the
  identities whose commits are the instance's own, beside
  `operatorAuthor`; an author outside both still needs the trailer.
- The rest is convention, written once: one person plans, and a pass is
  merged before the next opens; an order is assigned before it is
  activated, the assignment noted where the team reads the plan, because
  a second clone that starts the same order activates it again and
  nothing detects that; one person carries an order from activation
  through its final review and runs its release close, because the close
  re-reads the reviewed gate row against the closing machine's installed
  runtime and cleans up only that clone's worktrees; one order at a time
  goes through final review, merge and close, in the order the planner
  sets, because an order closed while another's review merges cannot
  integrate again; the target's draft pull request after verification is
  where the planner reads a teammate's change before its final review;
  and each clone keeps its own local-terms list, intake and clone map.
  Rejected: a claim or a lock on an order in the shared repository (the
  axis is need: the planner assigns by hand, by the operator's
  statement, and a lock would be machinery for a collision nobody has
  reported).

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. A function of its own in a `scripts/lib/` module (new), with unit cases
   that need no close fixture: given a clone, an order branch and a
   fetched base, it answers whether the branch's change is in the base, by
   ancestry, by one base commit patch-equal to the branch's whole change,
   or by a patch-equal base commit for each of the branch's commits that
   is not itself a merge, and names the commits it matched.
   `scripts/lib/target-worktree-close.mjs` (`containsBranch`, the closure
   the close calls at both of its sites): call that function and accept on
   a match, printing the base commit or commits matched; otherwise refuse
   with today's message extended by `--merged-as <commit>`. The close command accepts
   `--merged-as`, verifies the commit is in the fetched base, and prints
   it. Every Git form used exists in Git 2.31.0, and
   `scripts/lib/git-surface.json` gains its pairs. Record the check's
   time on the fixture. Check: `npm test -- --only target-worktree`.
2. `scripts/lib/config.mjs` (`validateContributions`): admit `authors`, a
   list of distinct identities in the form `operatorAuthor` takes,
   refusing a malformed entry by index; `scripts/lib/contributions.mjs`
   (`contributionSignoffRules`): a commit by a listed author passes as the
   operator author's does. Check: `npm test -- --only configuration-root`
   and `npm test -- --only license-fixtures`, whose files hold the
   sign-off cases.
3. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide (a section on working as a team on
   one instance, stating the conventions of the Design's last item and
   which steps are one at a time; §First steps and §Releases in this instance, where the merge-commit
   sentence now distinguishes the instance's own repository from a target; §Kit files and instance files, where the
   author declaration gains the list); `scripts/test-launchpad-export.mjs`
   (the kit guide's heading list gains the section, with its cause named
   in the decisions); `scripts/kit/dotln.config.example.json` (the list,
   empty); product 07 §Independent workflows and integration (a target's
   merge method); `docs/evidence/WO-269/decisions.md`. Then the handoff
   sequence of product 07 §Discipline.

**Deliverables:** the close's reading of the base with its named
admission; the authors list; the kit guide's team section; the cases; the
write-backs and the decisions.

**Acceptance criteria (all required)**

1. In the target close fixture, with the order's whole change placed on
   the base as one new commit and the order branch not an ancestor of the
   base, the close proceeds and prints the base commit it matched; with
   each of the branch's commits replayed onto the base it proceeds
   likewise; with a merge commit it proceeds as today.
2. In the same fixture, with a base that does not hold the change, the
   close refuses with the source retained and its message names
   `--merged-as`; with `--merged-as` naming a commit in the fetched base
   it proceeds and prints that commit; with `--merged-as` naming a commit
   that is not in the base it refuses naming the commit.
3. With `contributions.authors` listing two identities, a commit by
   either passes the sign-off rule without a trailer, a commit by a third
   author fails without one and passes with one, and a malformed entry is
   refused when the configuration loads, naming its index.
4. The kit guide states the team conventions, the two repositories' merge
   methods and the author list, and links this order's decisions. The verifier reads the
   named section; `npm run test:docs` judges its links and form.
5. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only target-worktree` for step 1;
`npm test -- --only configuration-root` and `npm test -- --only
license-fixtures` for step 2; `npm test -- --only launchpad-docs` for
step 3; the structural
phase; the complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-269/`: the close's outputs for
criterion 1's three cases and criterion 2's three; the check's time on
the fixture; the sign-off outputs of criterion 3; `npm run resume --
status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 3 and criterion 4; sources and
reopening conditions in `docs/evidence/WO-269/decisions.md`.

**Known issues and carry-ins:**

- FUP-1c36325905c52243: this order is its allocation for the close, the
  authors and the conventions. Several planners on one instance, a claim
  on an order and merging of control segments from several operators
  stay with that row.
- Moving an order in flight from one person's clone to another's, so that
  a second person continues it or the planner runs its final review, is
  not this order's subject; the 2026-11-09 pass records it as a candidate
  with the route its review found smallest, a pushed snapshot adopted at
  `verified` for final review.
- A squash that also carries other people's changes, or one edited at
  merge, matches no identity; `--merged-as` is its route and the decisions
  record how often the fixture's variants needed it.
- Every target order's records are committed into the target's
  documentation root, and the target's pull request carries them.
  [WO-274](WO-274-a-target-orders-records-stay-in-the-instance-where-its-registration-says-so.md),
  the next order, gives a registration the choice to keep them in the
  instance; this order's conventions say only where the planner looks.
- The identities in `contributions.authors` are committed in the
  instance's configuration, which is that instance's own repository.
- From this pass's first refutation: `--merged-as` admits any commit of
  the base: refuse a named commit that changes none of the paths the
  reviewed change touches, and print the named commit's subject before the
  close proceeds.
- From this pass's first refutation: Patch identity over a busy base is
  measured only on the fixture: print the count of base commits read at
  each close so an instance sees the cost.

**Non-goals:** any change to the launchpad's own merged checks or to
release close in the instance's repository; a forge call in the close; a
lock, a claim or an assignment record the kit reads; several planners on
one instance; moving an order between clones; where a target order's
records are filed.

**Operator-review assumptions:** that the team's application repository
may squash or rebase and the instance cannot change that; that the
change's patch being in the base is the right meaning of merged, with a
named admission when a merge altered it; that teammates' commits on the
shared instance are the instance's own and belong in a declared list;
and that assignment and merge order stay with the planner by hand for
now.
