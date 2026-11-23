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
both ways out. No refusal is added: the start gains one advisory, and one existing
refusal gains words. Assigned at activation under the standing
opt-out default.
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
read both against the code.
**Depends on:** none.
**Recommended placement:** second, beside WO-289, whose surfaces it does
not share. Every target order an instance starts meets the first half.

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
failure that run names.

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
   `scripts/test-resume.sh`'s fixture or the control reader's tests.
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

1. `worktree start` of a fixture order whose line is `**Repository:** <id>`
   creates the target worktree where this table says
   (`npm test -- --only target-worktree`).

   | The clone when the order starts | The worktree starts at |
   | --- | --- |
   | its `origin` holds two commits on the base branch that the clone lacks | the base branch's tip after the fetch |
   | the fetch of its `origin` fails | the base branch's tip as the clone holds it |

2. In the fixture of that table's first row, the activation event and the
   registry entry each record that tip as the base
   (`npm test -- --only target-worktree`).
3. Where the fetch fails, the start prints one advisory that names the date
   of the commit it starts at (`npm test -- --only target-worktree`).
4. The board's base column gives a member order's base as this table says
   (`npm test -- --only work-orders-fixtures`).

   | The order | Its base on the board |
   | --- | --- |
   | open, with the unpinned line | the registered base branch's name |
   | activated from the unpinned line | the commit its activation recorded |

5. A never-activated order with the unpinned line is withdrawn by
   `npm run resume -- withdraw` (`npm test -- --only resume`).
6. A fixture order against a target, filed with no version placeholder in
   its heading, activates (`npm test -- --only target-worktree`).
7. `npm run release -- prepare --local` in a target order's worktree prints
   that the order's heading stays as filed
   (`npm test -- --only release-preparation`).
8. With a fixture order whose judged heading was edited to a label that is
   not a version, `npm run plan -- check` refuses with the order's path,
   the changed line's number and both routes, restoring the judged line
   and `npm run plan -- amend-order`
   (`npm test -- --only plan-refutation`).
9. Product 07 under "Where the control plane finds its documents" states
   both forms of the line and that the unpinned one is the default
   (`npm run test:docs`).
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

**Non-goals:** changing what any later step computes from the recorded
base; rebasing or refreshing a worktree that has already started; a
refusal of a stale pin; the version assignment of a self order; rewriting
any filed order; the target's publish, gate or close.

**Operator-review assumptions:** the unpinned form is the default a
planner writes; a start that cannot fetch goes on from what the clone
holds; and an order already filed with the placeholder in a target order's
heading is left alone.
