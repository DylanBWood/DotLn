# WO-291 — A target order starts from its base branch's tip, and its heading claims no version (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. An order against a registered repository
names the repository alone and starts from the tip of that repository's
base branch at the moment it starts; a commit in the line stays admitted
and pins the base. A target order's heading carries no version placeholder,
and the planning check's refusal of changed order bytes names the line and
both ways out. No stop is added: the start gains one advisory, one existing
refusal gains words, and an activation of an unpinned order that has no
started worktree to take its base from fails naming `worktree start`.
Assigned at activation under the standing opt-out default.
**Cost:** adds one fetch of the target clone's base branch to a target
order's start, bounded by a row of the table of limits and never a stop;
one admitted form of the `Repository:` line and its readers' handling of
it; one advisory; about eleven cases. Removes the amendment an
instance's operator authorizes today each time an order's pinned base has
gone stale, and the hand edit of a heading that says a version is coming.
`scripts/resume.mjs`, `scripts/worktree.mjs`, `scripts/work-orders.mjs`,
`scripts/lib/target-worktrees.mjs` and `scripts/lib/plan-receipts.mjs` are
declared sources of the `harness-fixtures` or `plan-refutation` suite. No
file of `FEEDBACK_SOURCE_PATHS` is edited. One complete review run at
handoff. The fetch's measured time on core's host is recorded in the
decisions before and after; wall-clock, tokens and steps are otherwise
unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-23,
items 4 and 6 (ignored captures SHA-256
`0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270` and
`a7e16cc14c8cf5800a2a39201e312a69072b09aff9854b2bcef345cff3ed2247`): the
work instance's new worktrees start from its repository's first commit,
and a session there edited by hand a heading that still said a version
would be assigned.
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#where-a-target-orders-worktree-starts)
read both against the code. The pass of 2026-11-25 re-screened the criteria
to the form the room agreed
([the room's plan](../planning/passes/data-is-the-record-2026-11-25.md#the-rooms-plan)).
**Depends on:** none.
**Recommended placement:** after WO-297 and WO-288's one bounded attempt.
It depends on neither. Every target order an instance starts meets the
first half.

**Objective:** An instance's planner writes which repository an order
changes and nothing about commits. When the order starts, its worktree
stands on what the repository's base branch holds then, the control log
records that commit, and every later step reads the recorded commit as it
does today. A planner who needs a named commit can still write one. A
target order's heading says nothing that will never happen, and a session
that changed an order's judged bytes is told which line and how to put it
right.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- The base is written into the order.
  `scripts/lib/work-order-repository.mjs` admits one form of the line,
  `**Repository:** <id> @ <40-or-64-hex-base-commit>`, and refuses any
  other as malformed. `targetStartPlan` in
  `scripts/lib/target-worktrees.mjs` verifies that commit and returns it,
  `startTargetWorktree` in `scripts/worktree.mjs` creates the target
  worktree there, and the activation in `scripts/resume.mjs` records it.
- The same start fetches `origin main` and fast-forwards for the
  launchpad's own worktree (`scripts/worktree.mjs`, the `start` action) and
  does nothing of the kind for the target's clone.
- No document a planner reads says which commit to write. Product 07 gives
  the form (§Where the control plane finds its documents); `docs/KIT.md`,
  the planner's root, `docs/work-orders/TEMPLATE.md`, `docs/workstreams/README.md`
  and `docs/repositories/README.md` do not mention it. Boundary: those five
  and product 07 were read.
- So each order of a wave carries whatever commit was current when the pass
  wrote it, and an order filed while the repository held one commit starts
  there however far the base branch has moved. The line is among the
  order's judged bytes, so bringing it up to date is an amendment
  (`executionAppendix` in `scripts/lib/plan-continuation.mjs` refuses
  "existing work-order bytes changed"), which needs the operator's
  authorization each time.
- Readers of the declared commit, each read on 2026-11-23:

  | Reader | What it does with the declared commit | Under this order |
  | --- | --- | --- |
  | `scripts/lib/work-order-repository.mjs`, `parseRepositoryDeclaration` | requires it | admits the line without it |
  | `scripts/lib/target-worktrees.mjs`, `targetStartPlan` | verifies it and makes it the start's base | resolves the base branch's tip when the line has none |
  | `scripts/worktree.mjs`, `readStartAuthority` in `start` | passes the declaration to the plan | fetches the clone's base branch first |
  | `scripts/resume.mjs`, activation | records it as `baseCommit` | records the base the start resolved |
  | `scripts/resume.mjs`, withdrawal of an order never activated | records it with the repository's id | records the id alone when the line has no commit |
  | `scripts/work-orders.mjs`, the index | compares it with the control state and prints it | compares the id alone when the line has none, and prints the base branch's name until activation |
  | `scripts/lib/work-order-workstream.mjs`, the board | shows it as the member's base | shows the recorded commit once activated |
  | `scripts/lib/closeout-scope.mjs` | reads the declaration to know the order has a target | unchanged, reads the id |
  | `scripts/lib/plan-receipts.mjs`, `targetOrderPathAdvisories` | reads the declaration to know the order has a target | unchanged, reads the id |
  | `scripts/lib/derived-contract.mjs` | writes the pinned form for a derived order | kept: a derived contract is compiled against a named commit |

- Readers of the recorded commit (the control state's `baseCommit` and the
  registry entry's) are kept as they are, because what is recorded stays a
  full commit: `scripts/lib/control.mjs`, `boundTargetWorktree` in
  `target-worktrees.mjs`, `scripts/lib/target-gate.mjs`,
  `scripts/lib/target-publish.mjs`, `scripts/lib/target-commit-lint.mjs`,
  `scripts/lib/target-worktree-close.mjs`, `scripts/lib/target-repair.mjs`,
  `scripts/lib/closeout-scope.mjs`, `scripts/lib/drive-route.mjs`,
  `scripts/lib/review-worker.mjs`, `scripts/lib/github-body.mjs`,
  `scripts/release.mjs` and the status projections of `scripts/resume.mjs`.
  `scripts/lib/control.mjs` requires an event to carry the id and the
  commit together, which the withdrawal above must be admitted against.
- The heading. `docs/work-orders/TEMPLATE.md` and
  `scripts/lib/derived-contract.mjs` end every order's heading with
  "(version assigned at activation)". For a target order
  `npm run release -- prepare --local` prints "target order records no
  release; no files changed" (`scripts/release.mjs`) and assigns nothing,
  so the heading says for the order's whole life that a version is coming.
  A heading filed with no placeholder is already admitted
  (`releaseAssignment` in `plan-continuation.mjs`).
- The way out. `releaseAssignment` admits one change to a judged heading,
  a `(vX.Y.Z)` label in the placeholder's place. Any other edit is refused
  as "planning pass needs a receipt matching the current subject: existing
  work-order bytes changed", which names neither the file's line nor a
  route, and reads as a request for a new planning pass.

**Design (scope discipline):**

- **Two forms of one line.** `**Repository:** <id>` means the tip of the
  registered repository's base branch when the order starts.
  `**Repository:** <id> @ <commit>` means that commit. The start resolves
  the first to a commit once, records it where it records the pinned one
  today (the pending start, the registry entry, the activation event), and
  nothing downstream can tell the two apart.
- **The start fetches, and a failed fetch stops nothing.** Before it
  resolves the tip the start fetches the base branch from the clone's
  `origin`, under a row of the table of limits. Where the fetch fails or
  the clone has no remote, it uses the tip the clone already holds and
  prints one advisory with that commit's date.
- **A pin is taken as written.** A pinned order starts at its commit
  whatever the base branch has done since, as today.
- **The index shows what is known.** Before activation an unpinned order's
  base reads as the base branch's name; after it, the recorded commit.
- **No promise in a target order's heading.** The template and the derived
  contract write a target order's heading without the placeholder, and
  `release prepare` on a target order says the heading stays as filed. An
  order already filed with the placeholder keeps it and nothing reads it as
  an error.
- **The refusal of changed bytes names its routes.** It prints the order's
  path and the first changed line, and says: restore the judged line, or
  record the operator's authorization and run `npm run plan -- amend-order`.
- **What returns this order.** A scenario below that fails by its command,
  or a required suite that fails at the tree's identity and again when run
  alone; on input a kit writer produces or a documented command admits, a
  wrong result accepted, a record lost or misfiled, or a regression
  against `main`; a breach of the clean-room floor or of an authority or
  credential boundary. Anything else a verifier, a reviewer or a reader
  finds is recorded as a follow-up with its reopening condition. A check
  that did not run withholds a pass. This is the room's rule, stated here
  as a trial.
- **How the criteria read.** Each criterion is one behavior with its supported input, its command and
  its scenarios, and its control says what fails at the base. The unpinned
  line is `**Repository:** <id>` and the pinned line is
  `**Repository:** <id> @ <commit>`.

Rejected:

- *Activation rewrites the line with the resolved commit*, as it writes a
  version into a self order's heading. It differs on where the resolved
  base is recorded, the control log or the order's text. Rewriting adds a
  second kind of admitted change to judged bytes, and the control log
  already holds the base for every reader that needs it.
- *The pin stays and the planner refreshes each order before it starts.*
  It differs on who keeps the base current, the kit or the operator: each
  refresh is an amendment the operator must authorize, which is the cost
  this order removes.
- *Refusing a start whose pin is behind, or warning of it.* It differs on
  whether the kit judges a line the planner wrote on purpose. A pin is
  what a planner writes to start from a named commit, and the unpinned
  form is there for every other order.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names. Before step 1 the executor writes the cases of
criteria 1 to 9 and runs each alone: every row whose control says it fails
at the base fails there, and one that does not goes back to planning with
its output.

1. `scripts/lib/work-order-repository.mjs`, `parseRepositoryDeclaration`:
   admit the line with an id alone and return no `baseCommit` for it; the
   refusal of a malformed line names both forms. Check: two cases in
   `scripts/test-work-orders.sh`'s fixture, or a new case beside the
   reader's existing ones.
2. `scripts/lib/target-worktrees.mjs`, `targetStartPlan`: for a declaration
   with no commit, resolve the tip of the registered `baseBranch` in the
   clone (the remote-tracking ref where the clone has an `origin`, the
   local branch where it has none) and return it as `baseCommit`, with a
   field that says it was resolved. Check: a case in
   `scripts/test-target-worktree-start.mjs`.
3. `packages/skeleton/src/time-limits.mjs`: one row for the start's fetch
   of a target clone, with its figure and what it bounds. Check: the
   table's own case.
4. `scripts/worktree.mjs`, the `start` action: before `readStartAuthority`
   resolves a target plan, fetch the base branch from the clone's `origin`
   under that row; on failure print one advisory naming the commit and its date and go on.
   Check: two cases in `scripts/test-target-worktree-start.mjs` (tip moved;
   fetch fails).
5. `scripts/resume.mjs`, activation: for an order whose line has no commit,
   record the base of the order's registered target worktree, which the
   start writes before it activates; where no such entry exists, refuse
   and name `worktree start`. Check: a case in
   `scripts/test-target-worktree-start.mjs` that reads the activation
   event.
6. `scripts/resume.mjs`, the withdrawal of an order never activated, and
   `scripts/lib/control.mjs`, the event's validation: a withdrawal of an
   unpinned order records the repository's id alone. Check: a case in
   `scripts/test-resume.sh`'s fixture.
7. `scripts/work-orders.mjs`, the index, and
   `scripts/lib/work-order-workstream.mjs`, the board: the identity
   comparison reads the id alone for an unpinned header; the base column
   reads the base branch's name before activation and the recorded commit
   after. Check: a case in `scripts/test-work-orders.sh`'s fixture.
8. `scripts/lib/derived-contract.mjs`: a derived order with a repository
   gets a heading with no placeholder. Check: the derived-orders case that
   reads the written heading.
9. `scripts/release.mjs`, the target branch of `prepare`: the line it
   prints adds that the order's heading stays as filed. Check: a case in
   `scripts/test-release-preparation.mjs`.
10. `scripts/lib/plan-continuation.mjs`, `executionAppendix` and
    `requireSamePlan`: the refusal for changed order bytes carries the
    order's path, the first changed line's number and the two routes.
    Check: a case in `scripts/test-plan-refutation.mjs` with a fixture
    order whose heading was edited to a label that is not a version.
11. Write-backs: `docs/product/07-execution-guide.md`, "Where the control
    plane finds its documents" (the two forms, what each means, when to
    pin); `docs/KIT.md`, "How a session reaches the target" (where a target
    worktree starts) and "Planning in this instance" (how a pass files an
    order against a registered repository); `docs/work-orders/TEMPLATE.md` (the `Repository:`
    line in its default form, and a target order's heading);
    `docs/workstreams/README.md` and `scripts/kit/workstream.template.md`
    (what the board's base column shows).
12. The handoff sequence of §Discipline.

**Deliverables:** the admitted form and its readers; the fetch, its row and
its advisory; the heading's two writers and the prepare line; the
refusal's words; the cases; the write-backs.

**Acceptance criteria (all required)**

1. `worktree start` of a fixture target order starts its worktree at the
   commit this table gives. Supported input: a registered repository's
   clone and an order carrying either line. Command:
   `npm test -- --only target-worktree`.

   | Given | Then |
   | --- | --- |
   | the unpinned line, and the clone's `origin` holding two commits on the base branch that the clone lacks | the worktree's `HEAD` is `origin`'s base-branch tip after the fetch |
   | the unpinned line, and a fetch of `origin` that exits non-zero | `HEAD` is the clone's remote-tracking base branch as it stood before the start |
   | the unpinned line, and a clone with no `origin` | `HEAD` is the clone's local base branch |
   | the pinned line, and the base branch moved past that commit | `HEAD` is that commit |

   Control: the first three rows fail at the base, where the unpinned line
   is refused as malformed. The fourth passes there and must still pass; it
   fails under the planted fault that the start resolves the tip whatever
   the line holds.

2. The start records the commit it resolved. Command:
   `npm test -- --only target-worktree`.

   | Given | Then |
   | --- | --- |
   | the first row of criterion 1 | the activation event's base commit and the registry entry's base each equal that tip |

   Control: the row fails at the base.

3. A start that cannot fetch says so once and goes on. Command:
   `npm test -- --only target-worktree`.

   | Given | Then |
   | --- | --- |
   | the second row of criterion 1 | the start exits 0 and prints exactly one advisory line, which holds the start commit's full id and its committer date in ISO 8601 |
   | the third row of criterion 1 | the same |
   | the first row of criterion 1 | the start prints no such line |

   Control: the first two rows fail at the base. The third fails under the
   planted fault that the advisory prints on every start.

4. The board's base column shows what is known. Command:
   `npm test -- --only work-orders-fixtures`.

   | Given | Then |
   | --- | --- |
   | an open member order with the unpinned line | the column shows the registered base branch's name |
   | a member order activated from the unpinned line | it shows the commit its activation recorded |
   | an open member order with the pinned line | it shows the commit the line names |
   | a member order activated from the pinned line | it shows the commit its activation recorded |

   Control: the first two rows fail at the base. The last two pass there
   and must still pass.

5. A never-activated order is withdrawn with what its line declared.
   Command: `npm test -- --only resume`.

   | Given | Then |
   | --- | --- |
   | a never-activated order with the unpinned line, and `npm run resume -- withdraw` | it exits 0, and the control log's withdrawal event holds the repository's id and no base commit |
   | a never-activated order with the pinned line, and the same command | the event holds the id and the commit |

   Control: the first row fails at the base. The second passes there and
   must still pass.

6. A derived order against a repository is written with no version
   placeholder. Command: `npm test -- --only derived-orders`.

   | Given | Then |
   | --- | --- |
   | a derived contract for a registered repository | the heading the kit writes for its order does not hold `(version assigned at activation)` |
   | a fixture target order whose heading has no placeholder, and `worktree start` (`npm test -- --only target-worktree`) | the start exits 0 and the control log holds its activation event |

   Control: the first row fails at the base. The second passes there and
   must still pass.

7. `release prepare` on a target order changes nothing and says so.
   Command: `npm test -- --only release-preparation`.

   | Given | Then |
   | --- | --- |
   | a target order's worktree, and `npm run release -- prepare --local` | it exits 0, `git status --porcelain` prints nothing afterwards, and the output holds `target order records no release; no files changed` and `the order's heading stays as filed` |

   Control: the row fails at the base on the second text.

8. The refusal of changed order bytes names the line and both routes.
   Command: `npm test -- --only plan-refutation`.

   | Given | Then |
   | --- | --- |
   | a fixture order whose judged heading was edited to a label that is not a version, and `npm run plan -- check` | it refuses, and its message holds the order's path, the changed line's number, the instruction to restore the judged line and `npm run plan -- amend-order` |

   Control: the row fails at the base, where the message names neither the
   line nor a route.

9. A malformed line is refused with both forms named. Command:
   `npm test -- --only work-orders-fixtures`.

   | Given | Then |
   | --- | --- |
   | an order whose line is `**Repository:** <id> @ abc` | the reader refuses, and its message holds `**Repository:** <id>` and `**Repository:** <id> @ <40-or-64-hex-base-commit>` |

   Control: the row fails at the base, where the message names one form.

10. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only target-worktree`,
`npm test -- --only work-orders-fixtures`, `npm test -- --only resume`,
`npm test -- --only release-preparation`,
`npm test -- --only plan-refutation`, `npm test -- --only harness-fixtures`,
`npm test -- --only derived-orders`, `npm test -- --only instance-history`.

**Evidence gate:** under `docs/evidence/WO-291/`: the decisions, with the
fetch's measured time before and after and each reader of the table above
as built; the handoff.

**Write-back duty:** as step 11 lists. The release's Read before upgrading
says that an order already filed with a commit keeps it and starts there,
that a new order needs none, and that a heading filed with the placeholder
is left as it is.

**Known issues and carry-ins:**

- The Cost line gives no count of the amendments a stale pin has cost, while the fetch runs at every target start. Reopen: a count over an instance's last ten target orders shows fewer than two such amendments.
- With the unpinned form the default, the state a pass and its refuter judged is no longer the state an order starts on, and what the pin used to show at the start shows only in execution. Reopen: a verification of an unpinned order finds a file or function a criterion names absent at the recorded base.
- The `instance-history` suite must admit an instance's existing pinned
  orders and their records unchanged; the order widens what is admitted
  and tightens nothing.
- A clone whose `origin` needs credentials the session lacks takes the failed-fetch path of criterion 1's second row. Whether to offer the operator the
  fetch is not decided here.
- A self order's heading keeps its placeholder, which the activation does
  replace.
- The criteria are written in the form the room of 2026-11-25 agreed, as a trial judged over the next five deliveries. What product 07 says of the two forms of the line is a write-back and no criterion, since no command settles a document's prose. Reopen: this order is returned on a reading of a criterion, or a row whose control says it fails at the base passes there.

**Non-goals:** changing what any later step computes from the recorded
base; rebasing or refreshing a worktree that has already started; a
refusal of a stale pin; the version assignment of a self order; rewriting
any filed order; the target's publish, gate or close.

**Operator-review assumptions:** the unpinned form is the default a
planner writes; a start that cannot fetch goes on from what the clone
holds; and an order already filed with the placeholder in a target order's
heading is left alone.
