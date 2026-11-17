# WO-284 — An instance sets every time limit of its gate in one file, the kit's own figures leave room for a slower machine, and a tree that is already green is not run again (v1.3.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. Every time limit that can end or fail a
gate run or a bounded probe is a row of one table, and a file the instance
owns raises any of them, scales all of them or turns all of them off; the
kit's figures are set with room for a machine several times slower than
core's; an instance's gate loads the instance's configuration and no
longer runs the kit's own configuration cases; the closeout selection says
when a complete run is already satisfied, and the runner starts no forced
complete run at an identity that is already green without a stated
reason; the seeded first order keeps a terms list that is present. No
refusal is added to an instance. Assigned at activation under the standing
opt-out default.
**Cost:** adds one build-free table of the gate path's time limits with
its resolver, an instance-owned file and its seed, a listing command,
about thirty-five call sites that read the table, one core-only case that
a file on the gate path names no time limit outside the table, the
closeout selection's read of the gate index, the runner's answer to a
forced rerun, one sentence in two role steps and one in the seeded first
order, with fifteen to twenty-five cases (estimates, not bounds). The
export fixture already runs an exported instance's document gate; it runs
that gate at one third of every figure, so no run is added, and its
duration before and after is recorded in the decisions. It removes: the
stop the work instance is in, where every gate selection fails on one
fixed figure; the kit's own configuration cases from every gate run of an
instance (12.0 s on core's host under load on 2026-11-16, over 30 s on the
work laptop); and, in core, a complete run repeated at an identity that
already holds a passing one (four such rows in the last three orders; the
two the record times took 0 h 47 min and 0 h 51 min).
`scripts/lib/host-resources.mjs` is a judged feedback source: the order
owes the feedback re-mint and one live feedback self-host episode, run
after the step that edits it. `packages/skeleton/src/loadouts/contributor.ts`
is a registered evidence source: the editions it stales are re-minted with
`npm run sync`. One complete review run at final review. Tokens and steps
are unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-16
(journal digest
`babcf9a61812f0d17b80b3f0ae08c7a2022282f864b056d4cdcf5e745d9f9c58`), items
2, 4 and 5: every time limit a test or check carries goes into a second
configuration file an instance can raise or ignore; no complete gate after
a change to documents alone; and the work instance's entries for core, of
which the fourth stops its next order and the second is the seeded first
order's terms list. Register rows allocated here: FUP-915d215fcc824d1a
(WO-282-D024, critical as the operator classed it), FUP-8cfdf28d91a0d2b7
(WO-277-D028, the generated checks' fixed 30 s), FUP-bd0e52a14e35c026
(WO-277-D019, a suite near its 15 min bound) and FUP-858a24b8de5b5313
(WO-277-D007, the seeded order's item 4). Clean-room screen: the instance's
entries name the kit's own files and commands and nothing of its codebase.
**Depends on:** none.
**Recommended placement:** first. The work instance cannot pass a gate
until its release.
**Cites (read these sections):** the census of this pass,
`docs/planning/passes/the-kit-stops-no-work-2026-11-16-time-limits-census.md`
(rows A01 to A16, B03 to B05, B24 and E01 to E13 are the gate path);
`scripts/test-runner.mjs` (the suite table, `executeSuite`, the structural
loop, the argument parser's `--again`); `scripts/lib/generated-artifacts.mjs`
(`STRUCTURAL_TASKS`, `runArtifactCommand`); `scripts/lib/closeout-scope.mjs`
(`closeoutCommands`, `closeoutText`); `scripts/lib/gate-reuse.mjs`
(`coveringTaskResults`); `packages/skeleton/src/gate-evidence.mjs`
(`gateCodeIdentity`, `readGateChecks`); `scripts/lib/host-resources.mjs`;
`scripts/lib/host-guard-state.mjs`; `scripts/lib/bounded-command.mjs`;
`scripts/license-surfaces.mjs`; `scripts/test-configuration-root.mjs`;
`scripts/structural-checks.mjs`; `scripts/kit/first-order.template.md`;
`scripts/test-launchpad-export.mjs` (the exported instance's document
gate); WO-282-D024, WO-277-D018, WO-277-D019 and WO-277-D028; product 07
§Discipline (the handoff sequence).
**Objective:** An instance's owner opens one file, sees every time limit
that can end or fail a gate run, and raises one, multiplies all of them or
turns them all off; a limit that is passed says its key and that file. The
kit's own figures let an instance pass its gate untouched on a machine
three times slower than core's, and core's gate shows that at every
release. An instance's gate checks the instance's configuration and does
not run the kit's tests of its own code. A session is told that a complete
run is already satisfied when a passing one stands at the code identity,
and a forced complete run there starts only with a reason the row keeps.

**Observed gap (dated 2026-11-16 at `main` `38c333ab2`, v1.2.0):**

1. The work instance, on kit v1.1.0, reported on 2026-11-16 that
   `npm run test:docs` failed twice with the `configuration-root` suite
   timed out and every later task skipped as `Required configuration-root
   structural preflight failed`; run alone the suite passed every case it
   ran in just over its limit; each of the other thirteen tasks passed on
   its own (the instance's entry, kept in this pass's ignored planning
   lane, SHA-256
   `52da24a4eace50fda009650138c2cdb364b993ac62909e3481b95ae25ae44654`).
2. The limit is a constant: `timeoutMs: 30_000` on that row
   (`scripts/test-runner.mjs` 559), as are the other structural rows' (554
   to 581: 30 s, 30 s, 30 s, 120 s, 30 s and 10 s) and the 900 s every other
   row gets (1208, 1983, 3284). `executeSuite` passes the figure to
   `startDeadline`, and no setting, environment variable or multiplier
   reaches it; the deadline module calls itself "not a host-speed detector"
   (`packages/skeleton/src/gate-deadlines.mjs` 6 to 8).
3. A structural row that fails, a timed-out one included, fails every task
   after it without running it, and `--keep-going` does not apply
   (`scripts/test-runner.mjs` 2087 to 2118).
4. `configuration-root` is the kit's own test file,
   `scripts/test-configuration-root.mjs`: the configuration loader's cases
   and two fixture lifecycles that create Git repositories and run about
   fifteen lifecycle commands (1592 to 1885; 1887 to 2067). The second
   carries a 300 s bound of its own (1889) that can never apply inside the
   suite's 30 s. Every selection of an instance runs it (`STRUCTURAL_TASKS`,
   `scripts/lib/generated-artifacts.mjs` 7 to 14; `docs/KIT.md` §The
   gates), although `kit-verify` already compares those scripts with the
   kit's manifest.
5. On core's host the suite took 12.0 s alone on 2026-11-16, under a load
   average of 5.5 on 16 processors, and 5.2, 6.8 and 8.75 s in earlier
   records (the census, §c). The work laptop took over 30 s: at least two
   and a half times this host's time that day.
6. A research worker of this pass read every fixed time limit: 175 rows
   over 384 code sites, six of which anything an instance sets can change,
   none on a gate's path. Its ranking of what a slower host meets next is
   the format row (30 s), the generated checks (120 s for the row and 30 s
   for each child, `generated-artifacts.mjs` 38), the host row (10 s), the
   native process census and descriptor capture (2 s each, where one miss
   fails every running task, `scripts/lib/host-resources.mjs` 498 and 456),
   the host guard's startup (5 s, `scripts/lib/host-guard-state.mjs` 79),
   the native helpers' compile (5 s and 30 s, `host-resources.mjs` 254 and
   289) and the license check's dry runs (30 s each,
   `scripts/license-surfaces.mjs` 132).
7. The fixed figures fail on core's own host under load. On 2026-11-15 two
   generated checks were refused at 30 s each and passed minutes later
   (WO-277-D028); a suite file ran 720 s of its 900 s (WO-277-D019) and
   835.6 s in this pass's reading of `npm run plan -- conditions`, which
   itself returned `unknown` for eight of its seventeen rows on its own
   55 s budget while four workers ran.
8. A complete run was started twice after a change to documents alone,
   for 0 h 47 min and 0 h 51 min, and `npm run plan -- failures` counts
   four gate rows at an identity already green in the last three orders.
   The runner reuses passing tasks at an identity unless `--again` or
   `--fresh` is given (`scripts/test-runner.mjs` 2725; 2861 to 2868), and
   each session gave `--again`. Each session's own record names what it
   went by. In WO-277's repair the runner's schedule line named the
   suites that read the changed pages as changed since the last gate row
   while it reused their rows (`scripts/test-runner.mjs` 3037 to 3041;
   WO-277-D018). In WO-282's final review two pending register rows
   proposed the rerun and the reviewer took WO-277's choice for the
   pattern (WO-282-D024). A third text says a run is owed and neither
   record shows that it was read: the closeout selection prints
   `The complete launchpad run is owed` in the briefing, after
   `worktree integrate` and at completion, whether or not a passing
   complete row stands at the code identity; by its own comment it
   "supplies no passing row" (`scripts/lib/closeout-scope.mjs` 13 to 14;
   487 to 505).
9. The reviewer's and the executor's role steps say that report, control
   and generated-document changes keep the code identity and do not name
   an authored document; product 07 §Discipline has carried the whole rule
   since WO-282-D024, in a section no role's `Read:` line names.
10. The seeded first order tells its executor to create the private terms
    list from the example (`scripts/kit/first-order.template.md` 51 to 55),
    after the operator's commands have registered it and `worktree start`
    has carried it into the order's worktree, so an executor that follows
    the item replaces the operator's entries there (the instance's second
    entry; WO-277-D007).

**Design (scope discipline):**

- One table holds the kit's figure for every time limit on the gate path:
  a key, the figure, what it bounds and what a miss does. It is a
  build-free module, `packages/skeleton/src/time-limits.mjs`, so that the
  runner, the structural checks and the host modules read one source, and
  no site on that path keeps a figure of its own. The gate path is the
  census's rows A01 to A16, B03 to B05, B24 and E01 to E13: the suite
  rows, the generated checks, the license check's dry runs, the evidence
  and bounded-probe wrappers, the index check's child, and the host
  monitor, guard, helper-compile and record-lock bounds. Rejected: keeping
  each figure where it is and adding an override beside it (axis: one
  source; thirty-five sites that each read a setting drift, and a file
  that claims to list every limit cannot be checked against them).
- The instance's file is `time-limits.json` in the control root, seeded
  from `scripts/kit/time-limits.template.json`. It holds `enforce`
  (false: no limit of the table ends anything), `scale` (every figure is
  multiplied by it) and `limits`, an entry for every key. An entry holds
  `set`, which is the owner's own figure, `null` for that limit off, or
  `"kit"`; and `kit`, the kit's figure at the release that last wrote the
  file, which nothing reads. A key the owner has not set reads `"kit"` and
  follows the kit's figure through releases, so a release that raises a
  figure reaches every instance that had not set its own, and the owner
  still sees every limit and its number in one file. A value the resolver
  cannot use is named in one advisory and the kit's figure applies; no
  command stops for it. An instance without the file gets the kit's
  figures. `npm run limits` prints every key with what it bounds, the
  kit's figure, this root's figure and where it came from, and
  `npm run limits -- --write` writes the file with every key, keeping each
  `set` and refreshing each `kit`, so a release that adds a limit adds it
  to the file without a hand edit. Rejected: a file of figures alone
  (axis: an instance that set nothing would keep the day's figures when a
  release raises one).
  Rejected: more keys in `docs/control/budgets.json` (axis: the operator's
  direction names a second file, and that file already mixes five kinds of
  bound).
- A limit stays a limit: it ends a step that hangs. What changes is whose
  number it is and how much room it leaves. A figure on a path an
  instance runs is at least ten times the slowest passing time of its step
  in core's gate record of the thirty days before the order, and no suite
  row's is under five minutes. A row only core runs gets at least three
  times its slowest passing time, since core raises its own in its own
  file and a hung suite should not hold a complete run for hours. The
  decisions record each figure with the times it rests on.
  Rejected: limits that only advise in an instance (axis: the operator
  asked for limits an instance can raise or ignore, not for their removal,
  and a hung gate under an unattended session would then wait without
  end).
- Room is checked, not asserted: the export fixture, which already runs an
  exported instance's document gate, runs it with `scale` at one third, so
  a release whose instance gate needs more than a third of any figure on
  core's host fails core's gate before it ships. This is core's check of
  the starter and runs in no instance.
- A miss names itself: the failure of a timed-out row or child says the
  key, the figure that applied, the file and the command that lists the
  keys. A timed-out structural row is reported as time and not as a failed
  check.
- In an instance the configuration row loads the instance's own
  configuration, roots and registrations and reports what the loader
  refuses; the kit's test file `scripts/test-configuration-root.mjs` stays
  core's structural row and is available in an instance by name
  (`npm test -- --only configuration-root`). Rejected: only raising that
  suite's figure (axis: what the row is for; an instance's gate would
  still spend its first half minute re-running tests of code whose bytes
  `kit-verify` has already compared).
- The closeout selection reads the gate index: where a passing complete
  review row stands at the current code identity it prints that the run
  is satisfied, with the row's time, and lists the document gate alone as
  owed. On a complete selection at such an identity `--again` or `--fresh`
  without `--reason <text>` prints the standing row and what a fresh run
  costs, runs nothing and exits 0; with a reason it runs and the row keeps
  the reason. The measurement tools pass theirs. An instance's selections
  reuse nothing and are not changed. Where a selection reuses a suite's
  row and every changed source of that suite is a document outside the
  code identity, the runner's schedule line stops calling the suite
  changed since the last gate row and names it as reused at that
  identity, which is what the runner then does. Rejected: a line of output alone
  (axis: what held; the reuse rule stood in the role text four times when
  a session gave `--again` twice).
- The reviewer's step 5 and the executor's step 8 each gain one sentence
  in place: an edit to documents alone, an authored document included,
  owes `npm run test:docs` and no complete run, and a pending follow-up
  row or an earlier order's choice changes no role's duty.
- The seeded first order's item 4 keeps a terms list that is present and
  creates one from the example only where none is.

**Execution plan (the executor follows these steps in order; observed at
`38c333ab2`, 2026-11-16).** A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `packages/skeleton/src/time-limits.mjs` (new; build-free): the table and
   `timeLimit(root, key)`, which applies the root's file;
   `scripts/launchpad.mjs` (`BUILD_FREE_MODULES`); the module's
   registration in `scripts/lib/evidence-sources.mjs` and in every fixture
   manifest that copies one of its importers, found by searching the
   `*.fixture-inputs.json` files for each importer (four copy
   `gate-evidence.mjs` or `host-resources.mjs` at `38c333ab2`:
   `scripts/test-harness.fixture-inputs.json`,
   `scripts/test-beacon-fixture.fixture-inputs.json`,
   `scripts/test-control-copy-sites.fixture-inputs.json` and
   `packages/skeleton/test/control-beacon-cli.fixture-inputs.json`),
   before the first re-mint;
   `scripts/kit/time-limits.template.json` (new) and the seed list that
   writes an instance's control files; `scripts/time-limits.mjs` (new: the
   listing and `--write`) and `package.json` (`limits`). Check: a case in
   `scripts/test-configuration-root.mjs` that a raised key, a `scale`, a
   `null` and `enforce: false` each resolve as the Design says, and that an
   unusable value is named once and the kit's figure applies.
2. `scripts/test-runner.mjs` (the suite table's `timeoutMs` values and the
   900 s default read the table; the timed-out message; the structural
   loop's message for a miss). Check: a case in
   `scripts/test-runner.test.mjs` with a fixture row that outlives a small
   figure: it fails naming its key and the file, passes with the key
   raised, and passes with `enforce` false.
3. `scripts/lib/generated-artifacts.mjs` (`runArtifactCommand` and the two
   figures), `scripts/sync.mjs`, `scripts/license-surfaces.mjs`,
   `scripts/lib/bounded-command.mjs`, `scripts/work-orders.mjs` (the index
   check's child) and `scripts/harness.mjs` with
   `packages/skeleton/src/harness-host.ts` (the evidence gate's bounds):
   each reads its key. Check: a case in `scripts/test-sync.mjs` that a
   generated check's miss names its key.
4. `scripts/lib/host-resources.mjs`, `scripts/lib/host-guard-state.mjs`,
   `scripts/lib/host-lanes.mjs`, `scripts/lib/node-engines.mjs` and
   `packages/skeleton/src/gate-evidence.mjs` (rows E01 to E13): each reads
   its key. Then the feedback re-mint and the live feedback self-host
   episode on the instance's `default` worker, as product 07 §Operator-opened
   planning pass requires of an order that edits a judged source. Check: a
   case in `scripts/test-host-guard.test.mjs` that the guard's startup
   observation uses the table's figure.
5. `scripts/lib/generated-artifacts.mjs` (`STRUCTURAL_TASKS` names a
   `configuration` row for an instance), `scripts/structural-checks.mjs`
   (the `configuration` argument: load this root's configuration and
   report), `scripts/test-runner.mjs` (the row, and
   `configuration-root` as a core structural row an instance runs by name
   alone) and `scripts/lib/gate-reuse.mjs` (`STRUCTURAL_SUITES`, the second
   list of structural rows, which a handoff reads and which names
   `configuration-root` today). Check: a case in
   `scripts/test-launchpad-export.mjs` that an exported instance's
   selections list `configuration` and not `configuration-root`, and the
   structural-list equality case of `scripts/test-runner.test.mjs`
   extended to an instance.
6. `scripts/test-launchpad-export.mjs` (the exported instance's document
   gate runs with `scale` at one third) and a core-only case, in
   `scripts/test-runner.test.mjs`, that no file on the gate path passes a
   time limit that is not read from the table. Check: that case.
7. `scripts/lib/closeout-scope.mjs` (`closeoutCommands`, `closeoutText`:
   the satisfied form) and `scripts/test-runner.mjs` (`--reason`, the
   forced selection's answer at an identity already green, and the
   schedule line's word for a suite whose changed sources are documents
   alone); `scripts/measure-gates.mjs` passes its reason. Check: a case in
   `scripts/test-runner.test.mjs` that a forced review selection at a green
   identity runs no task and exits 0, and runs with a reason that its row
   keeps.
8. `packages/skeleton/src/loadouts/contributor.ts` (the reviewer's step 5
   and the executor's step 8) and `scripts/kit/first-order.template.md`
   (item 4); then `node scripts/harness.mjs emit` and `npm run sync`.
   Check: `node scripts/harness.mjs check`.
9. Write-backs: `docs/KIT.md` §What the host needs (the limits file and
   what to do on a slow machine), §The gates (the configuration row, a
   miss's message, the satisfied closeout) and §Kit files and instance
   files (the file is the instance's); product 07 §Discipline (the handoff
   sequence names the satisfied form and `--reason`);
   `docs/evidence/WO-284/decisions.md` (each figure with the times it rests
   on) and the regenerated decisions index. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the table, the resolver, the instance's file with its
seed and the listing command; the gate path's sites reading the table; the
instance's configuration row; the export fixture's reduced-figure run and
the core-only case; the closeout selection's satisfied form and the
runner's answer to a forced rerun; the two role sentences and the seed's
item; the write-backs, decisions, the episode's record, regenerated roots
and editions.

**Acceptance criteria (all required)**

1. With no file, each limit of the table resolves to the kit's figure;
   with a key raised in `time-limits.json` the runner applies that figure
   to its row and the row's record names it; `scale` multiplies every
   figure; a key at `null` and `enforce: false` let a row that outlives
   its figure finish and pass; an unusable value is named in one advisory
   and the kit's figure applies (`npm test -- --only runner-fixtures` and
   `npm test -- --only configuration-root`).
2. A row or a child that is ended for time fails with a message naming its
   key, the figure that applied, the file and `npm run limits`; a
   structural row ended for time is reported as time (`npm test -- --only
   runner-fixtures`; `npm test -- --only sync-fixtures`).
3. `npm run limits` prints one row for every key of the table with what it
   bounds, the kit's figure, this root's figure and its source, and
   `npm run limits -- --write` writes a file holding every key and leaves a
   value the owner set as it was. After the kit's figure for a key changes,
   an instance whose entry reads `"kit"` applies the new figure, one that
   set a number keeps its number, and `--write` refreshes the entry's `kit`
   (`npm test -- --only configuration-root`).
4. No file on the gate path passes a time limit that is not read from the
   table, by a case that names each file it reads; the case runs in core
   alone (`npm test -- --only runner-fixtures`).
5. In the export fixture an instance's selections list a `configuration`
   row that loads the instance's own configuration, and
   `configuration-root` runs there only when named. With `scale` at one
   third, every task of the three selections the fixture runs in the
   exported instance (`npm test`, `npm run test:docs` and
   `npm test -- --review`) finishes inside its reduced figure. The case
   reads each task's own result and not the selection's exit alone, so a
   task ended for time fails it, and a fixture arm with a task that
   outlives its reduced figure shows the case failing
   (`npm test -- --only launchpad`).
6. Where a passing complete review row stands at the current code
   identity, the closeout selection the briefing and `worktree integrate`
   print says the complete run is satisfied, names the row's time and
   lists `npm run test:docs` alone as owed; where none stands, or the
   index cannot be read, it lists the complete run as before and exits as
   before (`npm test -- --only worktree-integration`).
7. On a review selection at an identity that holds a passing complete row,
   `--again` without `--reason` prints that row, runs no task and exits 0,
   and with `--reason <text>` runs and records the text on its row; a
   selection at an identity with no passing row is unchanged; and in a
   selection that reuses its row, the schedule line names a suite whose
   only changed sources are documents as reused at the code identity,
   not as changed (`npm test -- --only runner-fixtures`).
8. The emitted reviewer and executor roots carry the sentence that an edit
   to documents alone owes `npm run test:docs` and no complete run, and the
   seeded first order's item 4 keeps a present terms list, by cases that
   read the emitted roots and an exported first order
   (`npm test -- --only harness-fixtures`; `npm test -- --only launchpad`).
9. The feedback re-mint and the live episode are recorded under
   `docs/evidence/WO-284/`, or their recorded absence with the host's
   reason.
10. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only runner-fixtures`, `npm test -- --only
configuration-root`, `npm test -- --only sync-fixtures`, `npm test -- --only
launchpad`, `npm test -- --only worktree-integration`, `npm test -- --only
harness-fixtures`, `npm test -- --only feedback-evidence`, `npm test --
--only harness-evidence` and `npm test -- --only process-debt`, whose rows
the order's one complete run supplies; the structural phase; the complete
run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-284/`: the listing of an
instance fixture and of core; a timed-out row's message; the exported
instance's document gate at one third of every figure, with its duration
before and after; the closeout selection's two forms; the forced
selection's answer; the live episode's record. No status capture is asked
for: it holds the worktree's absolute path (WO-277-D014).

**Write-back duty:** as step 9 lists; the release's Read before upgrading
says, first, that `npm run limits -- --write` creates the file, that a
slow machine sets `scale`, and that an instance which edited
`scripts/test-runner.mjs` by hand to pass its gate takes the release's copy
of that file.

**Known issues and carry-ins:**

- The census's other 139 shipped rows, in lifecycle commands, hooks,
  worker launches, host tooling and the shipped test files' own fixtures,
  keep their figures until WO-288's Part D moves them into this table. An
  instance's report of one stopping it before that release reopens the
  placement. The discovery bound WO-280 traces is among them.
- A product case that reads a document (the export fixture's reading of
  the kit guide and the commands page, WO-277-D018) can turn red on a
  change to documents alone and is then met at the next complete run. The
  operator's rule stands; the remedy this pass prefers is to move such an
  assertion into the document gate, and a complete run that fails on a
  case whose only changed input is a document reopens it.
- The hook bound of 15 s and the lifecycle children inside it (the
  census's rows C01, C07 and C09) are not on the gate path and stay; they
  are the first candidates if a slower host reports a hook cancelled.
- Boy-scout item, from the work instance's first entry: the read census
  says of Claude Code that its hooks journal Bash rows
  (`scripts/lib/document-census.mjs`, the `coverage` text), while a file
  read through the shell is not counted. The line says so. One string and
  its case; no change to what is counted.
- Until WO-278's part lands, this order's first round is launched as
  WO-276-D118 records.

**Non-goals:** changing what a limit does when it is passed; a time limit
outside the gate path; a host-speed detector or a figure that adapts on
its own; any change to what an instance's document gate checks beyond the
configuration row; a complete run after a change to documents alone.

**Operator-review assumptions:** the second file is `time-limits.json`
beside the budgets file in the control root; limits stay enforced unless
the owner turns them off; tenfold room over core's slowest passing time
and a five-minute floor for a suite row are the kit's figures, checked at a
third on core's host; a forced complete run at a green identity needs a
stated reason in core, where the operator's rule is that none follows a
change to documents alone.
