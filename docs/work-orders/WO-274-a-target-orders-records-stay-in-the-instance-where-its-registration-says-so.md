# WO-274 — A target order's records stay in the instance where its registration says so: a repository's registration names where its orders' records are filed, an order against a repository that keeps them in the instance publishes the reviewed commit with no records commit in the target, and the kit guide tells a team's instance to keep them

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. One optional key in a repository's
registration; where it is set to `instance`, one lifecycle step is not
offered, two publish checks do not require it and the target's pull
request head is the reviewed commit. A registration without the key
files records into the target as today. Assigned at activation under the
standing opt-out default.
**Cost:** adds, in `scripts/lib/config.mjs` (`REPOSITORY_KEYS`, the
registration's validation and `planFirstDirectory`), a `records` key and
its reading; in `scripts/resume.mjs` (the legal actions of a closed
target order, the `target-records` action and the final-review pass
message), `scripts/worktree.mjs` (the order publish's check for
`TargetRecordsCommitted`) and `scripts/lib/target-publish.mjs` (the same
check and the head it publishes), the reading of that key; in
`scripts/work-orders.mjs` (the index card), a line saying where the
records are; one sentence of the reviewer's target-order rule in
`packages/skeleton/src/loadouts/contributor.ts`; cases in the suites the
Preflight names; the kit guide, product 07 and the decisions. Removes
this state: every order against a team's application repository
committing its order text, decisions and verification and final-review
reports into that repository's documentation root, under that team's
code review, with no setting that keeps them out. No recurring work is
added to a gate, a hook, a prune or a close. Tokens and wall-clock:
unknown until this order's handoff records them. Re-mints: the
reviewer's generated skill, from the one rule sentence; the executor
names any other edition `npm run sync` reports. The files this order
edits are declared sources of machinery suites, so the final criterion
names `npm test -- --review`. Steps: the executor's, below.
**Nomination provenance:** the operator's statements of 2026-11-09 that
teammates will work one shared instance against the team's application
repository (ignored captures SHA-256
`b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb` and
`5cefd88d081917cbab4665ed7b5488385108bb63ad8f4f2d3775f9c523c6e64f`); the
reviews of
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md),
which found that every target order files its records into the target
with no way to keep them in the instance; and the pass's own decision
that a repository whose team did not ask for those records does not
receive them. The pass first returned that decision to the operator, who
sent it back as the planner's to make (ignored capture SHA-256
`355b53d3b72345212e9f3696cdfe898b602009b9ccdced48b7fcdd11e1c0303a`).
**Depends on:** WO-072 (closed: the target worktree lifecycle); WO-210
(closed: the records route into a target) and WO-213 (closed: its
private-path screen); WO-264 (open: the reviewer's rule this order edits
is a rule record after it); WO-269 (open: it edits the same kit guide
section and the target's close first).
**Recommended placement:** eleventh, after WO-269. The first order a team
runs against its application repository meets it.
**Cites (read these sections):** `scripts/lib/config.mjs`
(`REPOSITORY_KEYS`, the registration's validation, `planFirstDirectory`);
`scripts/lib/target-records.mjs` (`commitTargetRecords`,
`removeMovedTargetRecords`, `validateTargetRecordsCommit`);
`scripts/lib/target-worktrees.mjs` (`targetRecordSources`,
`targetRecordsUnfinished`); `scripts/lib/target-record-reader.mjs`
(`targetRecordReference`, `readTargetRecord`); `scripts/resume.mjs` (the
legal actions of a closed order, `recoveryActions`, `reportReference`,
the `final-review-result` message and the `target-records` action);
`scripts/worktree.mjs` (the order publish, where a target order without
`TargetRecordsCommitted` is refused, moved records are refused as
additions, and the closing line says where the records live);
`scripts/lib/target-publish.mjs` (the target publish, from the check for
`TargetRecordsCommitted` to the published head);
`scripts/work-orders.mjs` (the index card's `records`);
`scripts/lib/control.mjs` (the fold of `TargetRecordsCommitted`);
`packages/skeleton/src/loadouts/contributor.ts` (the reviewer's
target-order rule); the kit guide §First steps (a target's registration,
its publish and the records step); product 07 §Operator resume phrases,
§Where the control plane finds its documents and §Workflow closeout and
releases.

**Objective:** The owner of an instance decides, for each registered
repository, whether its orders' records are filed into that repository or
stay in the instance. An order against a repository that keeps them in
the instance goes from a passing final review to its two published pull
requests and its close with nothing of the order's records committed in
the target, and its records are in the instance's own record as a
launchpad order's are.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Records move into the target, always. After a target order's final
  review passes, `npm run resume -- target-records` copies the order and
  moves its decisions and filed reports under the target's
  `documentationRoot` as one records-only commit, and removes the moved
  sources from the launchpad (`commitTargetRecords`,
  `removeMovedTargetRecords`). Both publishes require it: the order
  publish in `scripts/worktree.mjs` refuses a target order whose
  committed control has no `TargetRecordsCommitted`, and the target
  publish in `scripts/lib/target-publish.mjs` refuses likewise.
- The target's pull request head is the records commit. The target
  publish refuses when the target's HEAD differs from the records commit,
  validates that commit as a records-only child of the reviewed one, and
  publishes it as the branch head. A target's reviewers therefore read
  the change and the kit's records in one pull request.
- A registration cannot say otherwise. `REPOSITORY_KEYS` in
  `scripts/lib/config.mjs` has `documentationRoot` and no key for where
  records are filed.
- Plan-first files are born in the target. Where an instance elects
  plan-first (off by default), `planFirstDirectory` puts a target order's
  plan, proposal and conversation under the target's documentation root.
- Whom the route fits: WO-210 built it for an exported instance's
  registered repository and its text names no team. Inference, from the
  operator's account of the work instance: a team's application
  repository is another case, since its reviewers read each pull request,
  the records are this kit's process and not their product, and nobody
  there asked for them.
- Readers of the committed state, each of which already handles an order
  that has no records in a target: `reportReference` in
  `scripts/resume.mjs` and `targetRecordReference` in
  `scripts/lib/target-record-reader.mjs` return nothing without the
  binding, and the index card prints the launchpad paths of the reports
  when `records` is absent.

**Design (scope discipline):**

- A registration says where records go. `repositories.<id>.records` takes
  `target` (the default when absent, and today's behavior) or `instance`.
  Rejected: an instance-wide setting (the axis is granularity: one
  instance may register a repository of its owner's and a team's
  application repository). Rejected: filing into a separate branch of the
  target (the axis is the gap: the records would still be in the team's
  repository). Rejected: changing the default to `instance` (the axis is
  who pays: every instance that files into its own repository would
  change behavior at an update).
- With `instance`, the records are not moved. The `target-records` step is
  not offered and not required; the order's records stay where a
  launchpad order's stay and are published by the instance's records pull
  request; the target publish takes the reviewed commit as the head and
  refuses when the target's HEAD differs from it; a target order's
  plan-first files are born under the instance's evidence root.
- With `target`, nothing changes.
- Committed state decides an order in flight. An order whose records were
  already filed into the target publishes them as at the base whatever
  the registration now says, and says so in one line; an order whose
  registration changes to `target` before its records are filed is
  offered the step again. Rejected: recording the value at activation and
  refusing a later change (the axis is the route out: a refusal after the
  records commit exists leaves an order that neither value publishes).

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/lib/config.mjs` (`REPOSITORY_KEYS` and the registration's
   validation): admit `records` with the two values, refuse any other
   naming the key, and return `target` when it is absent. Check: `npm
   test -- --only configuration-root`.
2. `scripts/resume.mjs` (`legalActions`, the `target-records` action and
   the `final-review-result` pass message): for an order whose repository
   keeps records in the instance and whose committed state holds no
   records binding, offer no `target-records` step, refuse the action
   naming the setting, and have the pass message name the two publishes
   without the records step. Check: `npm test -- --only resume` and `npm
   test -- --only target-worktree`.
3. `scripts/worktree.mjs` (the order publish) and
   `scripts/lib/target-publish.mjs` (the target publish): where the
   repository keeps records in the instance and no records binding is
   committed, the order publish proceeds without
   `TargetRecordsCommitted` and without the moved-records check and
   prints that the records are in this instance; the target publish takes
   the reviewed commit wherever it now takes the records commit (the HEAD
   comparison, the described base, the tree comparison, the change list
   and the published head) and skips `validateTargetRecordsCommit`. Where
   a records binding is committed, both proceed as at the base and the
   order publish prints the one line of the Design's third decision.
   Check: `npm test -- --only target-publish` and `npm test -- --only
   target-worktree`.
4. `scripts/lib/config.mjs` (`planFirstDirectory`): for a target order
   whose repository keeps records in the instance, return the instance's
   evidence directory as for a launchpad order. Check: `npm test --
   --only harness-fixtures`.
5. `scripts/work-orders.mjs` (the index card): for a closed target order
   with no records binding whose repository keeps records in the
   instance, print that its records are in this instance. Check: `npm
   test -- --only work-orders-fixtures`.
6. `packages/skeleton/src/loadouts/contributor.ts` (the reviewer's
   target-order rule): say that the records step and the commit of the
   moved records' removal apply where the registration files records into
   the target, and that otherwise the reviewer commits the instance
   records and runs the two publishes. Then `npm run sync`. Check: `npm
   test -- --only skeleton`.
7. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §First steps (the registration's
   `records` key beside `documentationRoot`, the publish paragraph that
   names the records step, and that an instance working a team's
   application repository sets `instance`) and the team section WO-269
   adds; product 07 §Operator resume phrases, §Where the control plane
   finds its documents and §Workflow closeout and releases (the records
   step and the plan-first directory are the registration's);
   `docs/evidence/WO-274/decisions.md`. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the registration key; the lifecycle's and the two
publishes' reading of it; the plan-first directory; the index card; the
reviewer's rule; the cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. A registration with `records` set to `instance` or `target` loads, one
   with any other value is refused naming the key, and one without the
   key behaves as `target`.
2. In the target fixture with a repository registered `instance`, an
   order that has passed its final review is offered no `target-records`
   step, `npm run resume -- target-records` is refused naming the
   setting, and the order's publish and the target's publish both
   proceed. The target's published head is the commit the final review
   bound and its tree holds none of the paths `targetRecordSources` names
   for the order; the instance's records branch holds the order's text,
   decisions and reports.
3. In the same fixture with the repository registered `target`, the same
   order is offered the step, both publishes refuse without it and
   proceed with it, and the published head is the records commit, as at
   the base.
4. An order whose records were filed into the target under `target`
   publishes them after its registration changes to `instance`, and the
   order publish prints that its records are in the target at that
   commit.
5. With plan-first elected, a target order's plan-first directory is under
   the instance's evidence root where its repository is registered
   `instance`, and under the target's documentation root where it is
   registered `target`.
6. The index card of each order in criteria 2 and 3 says where its
   records are.
7. The emitted reviewer root states the records step as the
   registration's, by the rule-record case of the skeleton suite (`npm
   test -- --only skeleton`), and `node scripts/harness.mjs check` shows
   the installed roots equal the emitted ones.
8. The kit guide states the key, its two values and the value an instance
   working a team's application repository sets, and links this order's
   decisions. The verifier reads the
   named section; `npm run test:docs` judges its links and form.
9. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only configuration-root` for step 1;
`npm test -- --only resume` for step 2; `npm test -- --only
target-worktree` for steps 2 and 3; `npm test -- --only target-publish`
for step 3; `npm test -- --only harness-fixtures` for step 4; `npm test
-- --only work-orders-fixtures` for step 5; `npm test -- --only skeleton`
for step 6; the structural phase; the complete run with `npm test --
--review` at final review.

**Evidence gate:** under `docs/evidence/WO-274/`: the outputs of criteria
2 to 5; the two index cards; the listing of the target branch and the
records branch after criterion 2; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 7 and criterion 8; sources and
reopening conditions in `docs/evidence/WO-274/decisions.md`.

**Known issues and carry-ins:**

- FUP-0eaffdb4df49ad52 (a target order's records kept in the instance):
  this order is its allocation.
- An order whose records stay in the instance leaves the target's
  reviewers with the change and its pull request's description; the
  description still passes the outward lint and names no launchpad
  identifier.
- A target-scoped planning pass (`npm run plan -- target-publish`) still
  writes planning documents into the target. It runs only when its
  operator runs it, and this order leaves it alone.
- The records of an order already filed into a target stay there. This
  order moves nothing back.
- A target release declared in a registration reads tags in the target and
  is unchanged by where records go.

**Non-goals:** changing the default; moving records already filed; a third
destination; filing some kinds of record and not others; the
target-scoped planning publication; any change to the outward lint or to
what a target's pull request description may say.

**Operator-review assumptions:** that a team's application repository
should not receive this kit's process records unless its owners want
them; that the instance's own record is a sufficient home for them; and
that leaving the default as it is, with the recommendation in the kit
guide, is right for the instances that exist.
