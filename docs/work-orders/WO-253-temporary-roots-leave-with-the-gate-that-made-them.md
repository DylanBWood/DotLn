# WO-253 — Temporary roots leave with the gate that made them, and a prune is a bounded step: a passed suite's fixture roots are removed when the suite ends, a kit-owned expired root is removed on its marker without reading its bytes, one process-table read serves a whole prune, `plan start` and release close run the prune as a bounded step with per-root progress and a truthful partial outcome, a restricted entry inside a kit-owned root is repaired or retained and never a close blocker, and both commands print where their minutes went (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. The prune's judgment of a kit-owned root
changes from a byte inventory to its owner record; the test runner removes
what it made; two commands gain a bounded step and a timing line. No
registration key moves; an instance that declared nothing closes as before,
faster. Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/test-runner.mjs`, the removal of every
gate-fixture root a passed suite registered under the run's gate id
(`withTemporaryOwner` at 3142 and the gate id at 1822 to 1833 already name
the owner; the record's `fixtureOwner.gateId` and `suite` name the suite),
at the suite's end, by `removeTemporaryPath`, with a failed suite's roots
kept under today's 24-hour `gate-fixture-failed` retention
(`packages/skeleton/src/temporary-root-records.mjs` 86 to 97); in
`scripts/license-surfaces.mjs` (102, whose `dryRunRules` already removes its
scratch root in a `finally` at 151) and `scripts/test-license-surfaces.mjs`
the maker of the 1,433 `dotln-license-surfaces-*` roots this host held on
2026-11-03 found and made to remove what it makes; in
`scripts/lib/harness-prune.mjs` a judgment of a kit-owned root
(`gate-fixture`, `warm-fixture`, `worker-capture`, `session-scratch`) by its
owner record (token, inode, class, outcome, `endedAt`) with no byte read,
`pruneInventory`'s SHA-256 of every regular file (86 to 130) run only for a
root the plan will delete whose class keeps the byte proof (a
`closed-journal` lane past its retention), never for a root the plan
retains, so a recordless or malformed root is retained without being read; in
`packages/skeleton/src/temporary-root-records.mjs` and
`scripts/lib/harness-prune.mjs` one process-table read per prune passed to
every liveness judgment (`temporaryProcessTable` at 231 to 249 and
`readHostSnapshot` at `harness-prune.mjs` 434 each read a host snapshot on
every call; `retireTemporaryLedger` 1095 and `pruneSessionTemporaryRoots`
1300 take one per call, and which call repeats per candidate is the
executor's to find: this pass's `plan start` showed `ps -axo
pid=,ppid=,lstart=,comm=` as the prune's child in six of six one-second
samples at 23:45Z); in `scripts/lib/temporary-prune-summary.mjs` and
`scripts/refute-plan.mjs` (`start`, 440 to 445) the routine prune as a
bounded step: a wall budget from `docs/control/budgets.json`
(`prune.startBudgetMs`, default 60,000) checked between roots and inside an
inventory or deletion, after which the prune stops (an inventory cut short
retains its root with reason `budget`), prints `removed N; remaining M;
next <root>` and the partial outcome, and the command goes on; `harness prune --apply` resumes from the remainder;
in `scripts/release.mjs` (2743 to 2763 and 4347) the close's prune scoped to
the closed order's own roots (its gate id, its worktree's session scratch)
with the host-wide remainder left to `plan start`'s bounded step, and the
`prune` step row carrying `removed`, `remaining` and `stoppedAt`; in
`scripts/lib/harness-prune.mjs` a restricted entry (a directory without
owner read or search permission, or a file without owner read) inside a
kit-owned root repaired by `chmod u+rwx` before removal, and when that
fails the root retained with reason `restricted-entry` and the path, never
thrown as a close blocker; and in `plan start` and the close a printed
timing line per startup step (failures, reader scores, conditions, census,
prune, branch) in hours and minutes. Removes: a `plan start` of 0 h 17 min to its
branch and skeleton on 2026-11-03 (23:30:04Z to 23:47:00Z, 1,015 s by the
host's task observation; `ps` then showed the same process alive 0 h 25
min after its start; the prune removed 465 of 5,988 roots), the fork's `plan start` of 0 h 9 min in the prune
(its item 3 of 2026-11-03), a release close whose publication took 0 h 2
min (WO-241, 22:41 to 22:43Z) and whose prune stopped on "cannot scan a
restricted temporary test-fixture directory" and then ran 0 h 16 min
host-wide before the session stopped it (the Codex rollout of
2026-11-03T17:41 local, 22:43Z to 23:10Z), 5,987 `dotln-*` roots under the
system temporary directory within 48 hours of their creation (none older)
holding at least 20.8 GB, and a `plan conditions` that cannot measure the
document gate (`ETIMEDOUT`, 2026-11-03). Wall-clock: the removal at a
suite's end is one `rm` per root the suite made; the marker judgment is a
record read; the bounded step is at most its budget; measured before and
after in the decisions from this pass's figures and the order's own
`plan start`, `npm test -- --review` and close. Context bytes: this file,
about 19,000; the release-close and planner roots grow by one sentence
each, measured against their ceilings under the standing route. Commands:
none new (`harness prune --apply` resumes). Tokens: unknown until run.
Steps: 10. Re-mints: `temporary-root-records.mjs` is a runtime source the
executor checks against `scripts/lib/evidence-sources.mjs` at activation and
re-mints deterministically where an edition is staled;
`scripts/lib/temporary-prune.mjs` and `temporary-prune-summary.mjs` are
not registered evidence sources (`scripts/lib/evidence-sources.mjs`
excludes both and assigns their behavior to the harness, runner, planning,
update and release fixtures: the consistency reviewer's F10 of
2026-11-04); no feedback-judged source changes, so no live feedback episode; `scripts/release.mjs`,
`scripts/test-runner.mjs` and `scripts/refute-plan.mjs` are declared
machinery sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's items 9, 19, 20, 21 and 22 of
the 2026-11-03 planning dispatch (release close issues at every pass; a
close over 20 minutes; temporary data not removed; planning unable to
create a branch and the close unable to close; thousands of retained test
fixtures; WO-241's close blocked), relayed with the fork's item 3 of its
first block of 2026-11-03 (a bounded or separable startup cleanup with
per-root progress and truthful partial outcomes), captured in ignored
intake `docs/intake/planning-dispatch-2026-11-03-recurring-failures.md`,
SHA-256 `4c7e47a6548004d909128fdfcc346663fc419280b798d00abec73d7ffb180f83`.
Filed by the
[2026-11-03 pass](../planning/passes/recurring-failures-and-queue-drain-2026-11-03.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-252 (closed, v0.112.0: the close's blocker classes and
the prune sentence this order keeps); WO-239 (closed: the close's timed
steps this order adds a row to); WO-233 (closed: the retention classes).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-252",
    "relation": "satisfied-by-close",
    "reason": "the close record's blocker classes and the role's prune sentence this order keeps and scopes"
  },
  {
    "workOrderId": "WO-239",
    "relation": "satisfied-by-close",
    "reason": "the release close's timed steps this order adds the prune row's fields to"
  },
  {
    "workOrderId": "WO-233",
    "relation": "satisfied-by-close",
    "reason": "the retention classes and the owned-resource prune this order makes cheap"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/harness-prune.mjs`
(`pruneInventory` 86 to 130: the SHA-256 of every regular file;
`readHostSnapshot` at 434; `pruneUnderLock` 955 to 975, where each deletion
follows a re-check of that candidate alone; `readdirSync` walks at 872 to
892);
`packages/skeleton/src/temporary-root-records.mjs` (`DEFAULT_RETENTION` 86
to 97; `temporaryProcessTable` 231 to 249; `ownerAlive` 273 to 283;
`retireTemporaryLedger` 1095 to 1137 and `pruneSessionTemporaryRoots` 1300
to 1322, each reading one table per call; `temporaryOutcomeRecord` 1226 and
the outcome stamp at 1255 to 1270; `removeTemporaryPath`);
`scripts/test-runner.mjs` (the gate id at 1822 to 1833; `withTemporaryOwner`
at 1878 and 3142); `scripts/license-surfaces.mjs` 95 to 152 and `scripts/test-license-surfaces.mjs`;
`scripts/test-fixture-temporary.mjs` 14; `scripts/test-worktree-integration.mjs`
582; `scripts/test-runner.test.mjs` 4734; `scripts/test-release-preparation.mjs`
67; `scripts/refute-plan.mjs` (`start`, 407 to 470: failures, reader scores,
conditions, census, the prune with `apply: true`, then the branch);
`scripts/lib/temporary-prune-summary.mjs`; `scripts/release.mjs` (the `prune`
step at 2743 to 2763; the writer-release prune at 4347); product 07
§Workflow closeout and releases (the close-time prune) and §Operator
recovery controls (cleanup is the workflow's); the fork's item 3 of its
first block of 2026-11-03 in the nomination capture; this pass's
§Readings.

**Objective:** A planning pass opens its branch and a release close closes
in the minutes their publication and checks take, not in the minutes a
host-wide inventory takes; the temporary directory holds, between runs,
only failed suites' fixtures inside their retention and the lanes the kit
retains on purpose; a kit-owned root is removed by its record, not by
hashing its bytes; and when a prune cannot finish inside its budget, the
command says what it removed, what remains and how to resume, and goes on.

**Observed gap (dated 2026-11-03 at `main` `eb7c58ff6`, v0.114.0):**

- `plan start recurring-failures-and-queue-drain` ran from 23:30:04Z to
  23:47:00Z (1,015 s) by the host's task observation, and `ps` showed its
  process alive 0 h 25 min after its start. Its single process held the host lock and spawned
  `ps -axo pid=,ppid=,lstart=,comm=` in six of six one-second samples at
  23:45Z; no other child ran. The temporary directory held 5,987 `dotln-*`
  roots at 23:38Z and 5,523 at 23:47Z: 465 removed in about 17 minutes of
  the prune. `du` over the roots took longer than 120 s; the fifteen
  largest entries alone measured 20.8 GB (`dotln-fixture-temporary-*` at
  1.1 to 2.1 GB each, `dotln-integrate-test-*` at 957 MB). No root was
  older than 48 hours: the prune removes what expires, and the gates
  create roots faster than two prunes a day remove them.
- The roots by prefix at 23:38Z: `dotln-license-surfaces` 1,433
  (`scripts/license-surfaces.mjs` 102 creates a fixture root per
  `dryRunRules` call and removes it in a `finally` at 151, so the maker of
  the 1,433 is unknown: the `license-fixtures` suite or a killed run are
  the candidates), `dotln-task-reuse` 530
  (`scripts/test-runner.test.mjs` 4734), `dotln-release-preparation` 312,
  `dotln-wo185` 297, `dotln-case-markers` 246, `dotln-target-worktree` 137,
  `dotln-integrate-test` 117, `dotln-release-preview` 116. The gate-fixture
  class carries a zero-hour retention when the suite passed
  (`DEFAULT_RETENTION`), so each is removable the moment its suite ends;
  nothing removes it until a prune pays the inventory.
- `pruneInventory` (`harness-prune.mjs` 86 to 130) returns, for every
  regular file of a candidate root, its SHA-256 over the whole file. A
  prune of this host therefore reads the 20.8 GB and more before it
  removes anything. `temporaryProcessTable` (231) and `readHostSnapshot`
  (`harness-prune.mjs` 434) read a host snapshot on every call; the prune's
  process spawned `ps` once a second through this pass's `plan start`.
- WO-241's release close (the Codex rollout of 2026-11-03T17:41 local,
  session journal `e63df0b3…`): dispatched 22:41:39Z; both v0.114.0
  releases published, the starter refreshed and the worktree and branch
  removed by 22:43:32Z; then "Closeout is blocked by pruning: it cannot
  scan a restricted temporary test-fixture directory"; the session
  repaired the permission, started a host-wide prune at 22:54Z, reported
  0 h 12 min at 22:57Z, stopped it at 23:01Z ("I caused the delay ... 16
  minutes"), and at 23:10Z was deleting the closed order's fixtures by
  hand under the operator's words. Canonical status at 23:17Z still listed
  `release-close` as a legal next action for the closed order. No close
  record with a `prune` row exists for it under `docs/evidence/WO-241/`.
- WO-252 (closed, v0.112.0) made the close own the kit's residue and
  verified it on a fixture of a few roots; WO-239 timed the close's steps;
  neither criterion named a host with thousands of roots, and no
  verification ran one. The operator's item 9 names that gap: orders meant
  to fix the close pass their criteria and the close still fails. This
  order's criteria 1, 2 and 5 are therefore stated on a planted host of
  many roots, not on a fixture of three.
- `plan conditions --slow` ran 305 s on 2026-11-03 and could not measure
  the document gate (`ETIMEDOUT`) or docs-check (listing wall budget
  exhausted); `plan start` runs `conditionsAtStart` before the prune.
- The fork's item 3 of its first block of 2026-11-03: `plan start
  entropy-reducer` held routine prune for 0 h 9 min with filesystem
  inventory work holding all eight host lanes; the session stopped its
  own processes; no completed prune receipt exists.

**Design (scope discipline):**

- **The maker removes.** The test runner knows a suite's outcome and the
  gate id its roots were registered under; at the suite's end it removes
  the passed suite's roots itself, through `removeTemporaryPath`, and
  leaves a failed suite's roots to their 24-hour retention. A suite's own
  `t.after` cleanups stay. Rejected: a shorter retention (axis: the roots
  already expire at zero hours; what is missing is a remover that does not
  pay an inventory). Rejected: removing roots from the prune more often
  (axis: the prune's cost is the inventory, not its schedule).
- **The record is the proof.** A root the kit wrote carries its owner
  record with the token and inode WO-237 bound; that record, its class and
  its outcome decide removal. The byte inventory stays only for a lane the
  plan will delete, whose journals are the kit's evidence; a root the plan
  retains, including one whose record is missing or malformed, is never
  read (the design improver's F3 of 2026-11-04: hashing what stays is
  wasted work). Rejected: hashing a
  sample of files (axis: a partial proof proves nothing the record does
  not). Rejected: trusting the prefix (axis: WO-237's token-and-inode rule;
  a name is not ownership).
- **One snapshot per prune.** The process table is read once and passed
  to every liveness judgment; a root whose owner is alive is retained as
  today. Rejected: caching across prunes (axis: a stale table would retain
  a dead owner's root or remove a live one's).
- **A bounded step, resumable, truthful.** The routine prune at `plan
  start` runs under a wall budget checked between roots and inside an
  inventory or a deletion, so one large root cannot hold the pass past the
  budget; it stops, prints what it removed and what remains with the resume
  command, and the pass goes on;
  the close prunes the closed order's own roots and leaves the host-wide
  remainder to `plan start`. Rejected: moving the prune out of `plan start`
  entirely (axis: WO-237-D005 put the routine removal where the census is
  paid; a prune nobody runs is item 20 again). Rejected: a background
  prune (axis: a second writer-adjacent process the host guard would
  count; the operator's item 20 wants the removal to happen, not to be
  deferred).
- **A restricted entry is the kit's to repair.** A permission a test left
  on a kit-owned root is repaired by the owner before removal; a repair
  that fails retains the root with its reason. Rejected: a blocker class
  for it (axis: WO-252's blocker list names what the operator or a build
  left, not what the kit's own test left).
- **Minutes are printed.** Both commands print one line per startup step
  with its duration in hours and minutes, so the operator reads where a
  slow start went without a session's narration. Rejected: a new report
  file (axis: the close record already carries step rows; `plan start`
  prints).
- **Live-run surfaces at the base.** The owner records, the retention
  classes, the close's step rows, the gate id in the runner, the prune
  summary: exist. The suite-end removal, the record judgment, the single
  snapshot, the budget, the scoped close prune, the permission repair and
  the timing lines: absent.

**Execution plan (the executor follows these steps in order; observed at `eb7c58ff6`, 2026-11-03):**

1. `scripts/test-runner.mjs`: at each suite's end, remove the gate-fixture
   roots registered under the run's gate id and that suite's name when the
   suite passed (`fixtureOwner.gateId` and `suite` on the record; the
   ledger names the roots); keep a failed suite's roots; record the count
   removed on the suite's row. Check: `npm test -- --only runner-fixtures` under the
   bounded wrapper, with a case that plants two roots under a passing suite
   and one under a failing suite and asserts which remain.
2. `scripts/license-surfaces.mjs` (`dryRunRules`, 95 to 152) and
   `scripts/test-license-surfaces.mjs`: find which maker left 1,433
   `dotln-license-surfaces-*` roots (the `finally` at 151 removes the
   command's own) and make it remove what it makes; record the maker in the
   decisions. Check: `npm test -- --only license-fixtures` under the bounded
   wrapper leaves no `dotln-license-surfaces-*` root; `node
   scripts/harness.mjs bounded -- node scripts/license-surfaces.mjs` leaves
   none.
3. `scripts/lib/harness-prune.mjs`: a kit-owned root of class
   `gate-fixture`, `warm-fixture`, `worker-capture` or `session-scratch`
   with a readable record is judged and removed on the record (token,
   inode, class, outcome, `endedAt`, retention) with no file read;
   `pruneInventory` is called only for a `closed-journal` lane the plan
   will delete; a root the plan retains, including one whose record is
   missing or malformed, is never read; the
   report says which proof each removal used. Check: `npm test -- --only
   harness-fixtures` with a case that plants a kit-owned root holding an
   unreadable file and asserts its removal, and one that plants a lane and
   asserts the inventory ran.
4. `packages/skeleton/src/temporary-root-records.mjs`: one process-table
   read per prune, taken by the caller and passed to every `ownerAlive`;
   `temporaryProcessTable` keeps its per-call behavior for other callers.
   Check: `npm test -- --only fixture-temp-root`; a case counts the
   snapshot reads across a prune of ten roots and asserts one.
5. `scripts/lib/temporary-prune-summary.mjs` and `scripts/lib/harness-prune.mjs`:
   the bounded form (`budgetMs`): the prune stops between roots, or inside
   an inventory or deletion with that root retained as `budget`, once the
   budget is spent, returns `removed`, `remaining`, `stoppedAt` and the
   next root, and `formatPruneReport` prints `removed N; remaining M; resume
   with node scripts/harness.mjs prune --apply`; `harness prune --apply`
   without a budget finishes the remainder. `docs/control/budgets.json`
   gains `prune.startBudgetMs` (default 60,000 when unset). Check: `npm
   test -- --only harness-fixtures` with a one-millisecond budget over
   three expired roots asserting the partial report and the resume.
6. `scripts/refute-plan.mjs` (`start`): the routine prune runs with the
   budget; each startup step (failures, reader scores, conditions, census,
   prune, branch) prints `<step>: <h> h <m> min` after it completes.
   Check: `npm test -- --only plan-refutation`.
7. `scripts/release.mjs` (the `prune` step and the writer-release prune):
   the close prunes the closed order's own roots (the order's gate ids and
   its worktree's session scratch) and records `removed`, `remaining` and
   `stoppedAt` on the step row; the host-wide remainder is `plan start`'s;
   the close's printed summary names the remainder and the resume command.
   Check: `npm test -- --only release`; `bash scripts/test-release.sh
   --case success` under the bounded wrapper.
8. `scripts/lib/harness-prune.mjs`: a restricted entry inside a kit-owned
   root is repaired with `chmod u+rwx` (directories) or `u+rw` (files) by
   the owner before removal; a failed repair retains the root with reason
   `restricted-entry` and the path; neither throws. Check: `npm test --
   --only harness-fixtures` with a planted mode-000 directory.
9. Write-backs: product 07 §Workflow closeout and releases (the close's
   scope; the bounded routine prune; the timing lines) and §Operator
   recovery controls (the resume command); the kit guide §Owned cleanup
   and retention (the suite-end removal; the budget key);
   `docs/evidence/WO-253/decisions.md` (this pass's figures as the before;
   the order's own `plan start`, `npm test -- --review` root count before
   and after, and close as the after); re-mint any edition the runtime
   sources stale; `npm run meta`; `npm run publication:check`.
10. Handoff: integrate `main` first when it has moved (WO-233's rule);
    finish source edits; `npm run format` and `npm run sync`; the
    independent reviews the executor root requires; one `npm test --
    --review` in the background awaited with `node scripts/harness.mjs
    evidence --wait`; `docs/evidence/WO-253/handoff.md`; `npm run test:docs`
    once after the last document edit; `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the suite-end removal; the record judgment; the single
snapshot; the bounded step with its budget key and resume; the scoped close
prune and its row fields; the permission repair; the timing lines; the kit
guide and product 07.

**Acceptance criteria (all required)**

1. After `npm test -- --only runner-fixtures` passes under the bounded wrapper on a
   host where the suite planted roots under its gate id, no `gate-fixture`
   root registered under that gate id by a passed suite remains under the
   temporary directory, and a root a planted failing suite registered
   remains with its record's outcome `failed`.
2. `node scripts/harness.mjs prune --apply` on a planted set of kit-owned
   expired roots, one of them holding a file the owner cannot read and one
   holding a mode-000 directory, removes every planted root and its report
   names `record` as the proof for each; a planted root with no owner
   record is retained with its reason and no file of it is read (asserted
   by a planted unreadable file inside it); a planted `closed-journal` lane
   past its retention is removed after the inventory and one inside its
   retention is retained without an inventory.
3. A prune over a planted set of ten kit-owned roots reads the host process
   table once, asserted by the suite's counter on the snapshot reader; a
   routine prune over a planted backlog of two thousand expired kit-owned
   roots, each holding one small file, under a budget the fixture sets,
   stops inside the budget with the suite's counters reading zero byte
   inventories and one snapshot, its discovery of candidates bounded by the
   same budget, and a second run resumes from the remainder (the criteria
   adversary's F7 of 2026-11-04: the recorded stall was host-wide work done
   before any budget was checked).
4. `npm run plan -- start <slug>` on a fixture checkout with a planted set
   of expired roots and `prune.startBudgetMs` set to one millisecond prints
   `removed N; remaining M; resume with node scripts/harness.mjs prune
   --apply` with `M` above zero, retains as `budget` a planted large root whose
   inventory the budget cuts short, creates the branch and the pass document,
   and prints one `<step>: <h> h <m> min` line for each of failures, reader
   scores, conditions, census, prune and branch; the same command with the
   budget unset removes every expired root of a three-root fixture.
5. A release close in the release fixture, with roots planted under the
   closed order's gate id and roots planted under another gate id, removes
   the closed order's and leaves the others, records `removed`, `remaining`
   and `stoppedAt` on its `prune` step row, names the remainder and the
   resume command in its printed summary, and completes with no blocker; a
   planted mode-000 directory inside one of the closed order's roots does
   not stop the close.
6. `npm test -- --only license-fixtures` under the bounded wrapper and
   `node scripts/harness.mjs bounded -- node scripts/license-surfaces.mjs`
   each leave no `dotln-license-surfaces-*` root registered under their own
   gate id or process under the temporary directory, while a planted root
   of that prefix retained from an earlier failed suite inside its
   retention survives both (the criteria adversary's F8).
7. The kit guide and product 07 state the suite-end removal, the record
   proof, the bounded routine prune with its budget key and resume, the
   close's scope and the timing lines as built; `npm run publication:check`
   is green.
8. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only runner-fixtures` for step 1; `npm test -- --only
license-fixtures` for step 2; `npm test -- --only harness-fixtures` for
steps 3, 5 and 8; `npm test -- --only fixture-temp-root` for step 4; `npm
test -- --only plan-refutation` for step 6; `npm
test -- --only release` for step 7; `npm run test:docs` when a document
changes; each under `node scripts/harness.mjs bounded --`; then one `npm
test -- --review` (07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixtures of criteria 1 to 6; the order's own `plan
start` and close timings and the temporary-root count before and after its
complete run, recorded in the decisions; the deterministic re-mints of any
edition the runtime sources stale; `npm test -- --review` before
`implementation-ready`, final review reusing the passing complete row at the
integrated code identity when one exists.

**Write-back duty:** as listed in step 9 and criterion 7.

**Known issues and carry-ins:**

- WO-252's criterion 5 (the orphan root's marker proof) and its prune
  sentence stand; this order changes what the proof reads for a kit-owned
  root, not who runs the prune (reopen: a root removed on its record was
  not the kit's).
- A root a killed suite left with no outcome stamped keeps today's
  owner-death retention window; this order does not shorten it (reopen:
  such roots accumulate past a day's gate runs).
- `plan conditions`' document-gate probe timed out on 2026-11-03; this
  order prints the conditions step's duration and changes nothing in the
  probe (reopen: the printed conditions step exceeds the prune's after this
  order).
- The two sibling worktrees `../DotLn-wo242` and `../DotLn-wo243` exist for
  orders that are not active (`docs/control/orders/` has no file for
  either); `wo243` holds 56 modified files. They are the operator's or a
  stopped session's and this order does not touch them (reopen: an order's
  activation finds its worktree path occupied).

**Non-goals:** a shorter retention for failed suites; a background prune;
a change to WO-237's token-and-inode rule; the document-gate probe of `plan
conditions`; the sibling worktrees of unactivated orders.

**Operator-review assumptions:** that a passed suite's fixtures have no
value the moment the suite passes (the record keeps the suite's row; the
gate index keeps the result); that sixty seconds is the right default
budget for the routine prune at `plan start` and the operator will set
another in `budgets.json` if not; that the close's prune scoped to the
closed order's roots is what "the close prunes its own scope" (WO-252's
Design) meant. Reopen on the operator's word.
