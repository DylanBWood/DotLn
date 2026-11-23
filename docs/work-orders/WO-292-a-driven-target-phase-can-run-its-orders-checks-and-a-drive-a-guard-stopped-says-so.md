# WO-292 — A driven target phase can run its order's checks, and a drive a guard stopped says so (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. A registered target worktree's guards
follow the launchpad's levels after every emit, a session in a target
worktree may read with the Read tool what the launchpad's own guard lets it
read, a drive whose worker was refused by a guard stops at once and names
the stop, and a session whose journal lies in an order's target lane gets
its usage read back. No refusal is added: one stop of the drive,
`guard-refused`, replaces a second dispatch into the same refusal, and it
is a lifecycle command declining its own job, a record row an instance
sets. Assigned at activation under the standing opt-out default.
**Cost:** adds one emit of each registered target worktree's guards to the
launchpad's emit, whose measured time is recorded in the decisions before
and after; one read rule in the target guard; one stop of the drive and its
account lines; one lane to the usage reader; about nine cases. Removes the
second driven attempt of a phase a guard refuses, which ends in the same
refusal as the first. `packages/skeleton/src/harness-host.ts` and
`packages/skeleton/src/loadouts/contributor.ts` are registered evidence
sources: the editions they stale are re-minted with `npm run sync`. No file
of `FEEDBACK_SOURCE_PATHS` is edited. One complete review run at handoff.
**Nomination provenance:** the operator's planning dispatch of 2026-11-23,
item 2 (ignored capture SHA-256
`0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270`), with
the work instance's own account of an order against a target, kept whole
in the ignored planning lane (SHA-256
`2d7648457fe0f52aa2ef9992805b21cf471cab27cf993712661f5e5ba584c16c`).
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#what-a-driven-target-order-meets)
checked each of its claims about the kit against this repository, and
[the check](../planning/passes/the-kit-keeps-working-2026-11-23-instance-claims-check.md)
is its record.
**Depends on:** WO-288 (its Part F changes the drive's stops and the
router's list of them, which this order adds one to).
**Recommended placement:** fourth. An instance on v1.4.0 has a route today
(the emit named in the pass's answer to it); this order makes that route
the kit's own.

**Objective:** An instance drives an order against a registered repository
and its executor, verifier and reviewer can run what the order names. The
guards in the target worktree answer at the levels the instance's owner
set, with no command the owner must remember to run after an update. Where
a guard still refuses and the phase cannot finish, the drive stops on the
first attempt and its account names the stop and the line that lowers it.
A verification or a review run there reports what it cost.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- A drive starts every phase of a target order but the close in the target
  worktree. `resolveOrderWorktrees` in `scripts/lib/order-worktrees.mjs`
  sets `cwd` to the target whenever the order has one, and
  `scripts/lib/drive-route.mjs` and `scripts/lib/drive-session.mjs` carry it
  to the launch, whatever the role. `docs/KIT.md`, "How a session reaches
  the target", describes sessions started in the launchpad and says
  nothing of a drive.
- A session started there runs under the target bundle's guard
  (`runTargetHarnessHook` in `packages/skeleton/src/harness-host.ts`). At
  v1.1.0 every judgment of that guard refused; since v1.4.0 each is a stop
  at its level, and the record rows advise in an instance
  (`packages/skeleton/src/stops.mjs`).
- The guards carry the levels of their own last emit, and a worktree an
  earlier kit installed recorded none. `docs/KIT.md` says so under the
  target guard's rules: such a worktree "is named by neither" `emit` nor
  `check` "until its next emit". An instance that takes v1.4.0 with a
  target worktree already started therefore keeps the refusals of the kit
  that installed it, and no command tells its owner (boarded as item 7 of
  WO-287-D084's follow-up).
- The Read tool is still refused there at every level for a path outside
  the order's recorded roots and the session's scratch: the target guard
  classes it as the user-settings effect (`harness-host.ts`, the target
  hook's outside effect). A shell `cat` of the same file is admitted
  ([the check](../planning/passes/the-kit-keeps-working-2026-11-23-instance-claims-check.md),
  claim 1).
- A phase a guard refuses is dispatched twice. An attempt that ends without
  its phase's completion counts as incomplete (`driveLoop` in
  `scripts/lib/drive-session.mjs`), the drive dispatches again, and at two
  it stops as `incomplete-bound`, whose text says "Two workers ended
  without recording this phase's completion. Repair the cause and run its
  phrase yourself" (`scripts/lib/drive-route.mjs`). The attempt's record
  holds the refusing stops and their counts
  (`scripts/lib/drive-stream.mjs`), and the stop names none of them.
- A session in a target worktree journals under the launchpad's
  `docs/control/local/harness/targets/` lane, and `harness usage` reads the
  launchpad's own lane alone, so a verification or a final review driven
  there records its process cost as unknown with the cause `no-session`.
  Core accepted the gap for the drive's first release (WO-192-D097).

**Design (scope discipline):**

- **The launchpad's emit brings every registered target worktree's guards
  current.** After it writes the launchpad's own bundle, `emit` writes each
  registered target worktree's guards at the root's levels and prints each
  worktree it wrote. A worktree that is gone is skipped with its path. The
  kit already runs `emit` when an update is finished, so an update needs no
  further step.
- **A read is a read.** In the target guard a Read-tool call is judged as
  the launchpad's guard judges it: admitted, except for the credential and
  user-settings paths the work rows protect, which stay refused.
- **A drive stops where the guard stopped it.** When an attempt ends
  without its phase's completion and its record holds a guard's refusal,
  the drive stops as `guard-refused` on that attempt. The stop and
  `drive why` name each refusing stop with the line that changes its level.
  An attempt that ends unfinished with no refusal keeps today's two
  attempts and `incomplete-bound`.
- **Usage follows the session.** `harness usage <session>` looks for the
  session in the order's target lane when the launchpad's own lane does not
  hold it.

Rejected:

- *Starting a target order's driven phases in the launchpad*, as an
  attended session starts. It differs on which guard a driven worker runs
  under. The drive's route into the target was qualified with its own
  hooks (WO-192), two host behaviors the other route rests on are
  unobserved (whether a print session started with an added directory loads
  that directory's hooks, and whether the target gate runs from the
  launchpad), and since v1.4.0 the target's guards advise on what stopped
  the instance. The planning pass keeps the other route as a register row.
- *Naming a behind worktree and leaving the emit to the owner*, as
  WO-287-D084 proposed. It differs on who brings the guards current: a
  command the owner must remember after each update is the kind of step
  this instance has already missed.
- *Checking at filing that the target lane admits each command an order
  names.* It differs on when a refusal is found. With the guards at the
  owner's levels the lane refuses little, so the check would mostly print
  nothing; it stays a register row.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** The plan is to be read against WO-288's merged text for the drive's files. A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `scripts/lib/harness.mjs`, the emit: after the launchpad's own bundle,
   call `emitTargetHarness` for each path `registeredTargetWorktrees`
   returns that exists, at the root's levels, and print each. Check: a case
   in `scripts/test-target-worktree-start.mjs` with a target worktree whose
   installed guards record no levels.
2. `packages/skeleton/src/harness-host.ts`, `runTargetHarnessHook`: a
   Read-tool call takes the read judgment the launchpad's hook gives it;
   the credential and user-settings rows are judged before it and stay.
   Check: two cases in `scripts/test-target-worktree-start.mjs` (a file
   under the main checkout is admitted; a credential path is refused).
3. `scripts/lib/drive-session.mjs`, `driveLoop`: an attempt that did not
   finish its phase and whose record holds a refusal ends the drive with
   the stop `guard-refused` and the refusing stops' ids. Check: a case in
   `scripts/test-drive.mjs`.
4. `scripts/lib/drive-route.mjs`: the stop's entry and text, beside
   `incomplete-bound`. Check: the same case reads the text.
5. `scripts/lib/drive-account.mjs`, `endedBy` and `nextStep`: for
   `guard-refused`, each stop's id and the configuration line that changes
   its level. Check: a case in `scripts/test-drive.mjs` that reads
   `drive why`.
6. `packages/skeleton/src/loadouts/contributor.ts`, the router's root: the
   list of stops gains `guard-refused`. Check: the case of
   `scripts/test-harness.mjs` that reads the router's emitted root.
7. `packages/skeleton/src/harness-host.ts`, `measureHarnessUsage`: when the
   launchpad's lane holds no journal for the session, read the lanes under
   `docs/control/local/harness/targets/`. Check: a case in
   `scripts/test-harness.mjs` with a session journaled in a target lane.
8. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`.
9. Write-backs: `docs/KIT.md`, "How a session reaches the target" (where a
   drive starts each phase, and under which guards), the target guard's
   rules (the emit brings every registered worktree current; the sentence
   that an earlier kit's worktree is named by no command is replaced) and
   "When a routed run stops" (the new stop; while this section is open,
   restore the statement WO-287-D079 boards, that the account never prints
   a command's operands, a reason a host printed or a worker's output);
   `docs/product/07-execution-guide.md`, "Operator resume phrases" (the
   drive's stops).
10. The handoff sequence of §Discipline.

**Deliverables:** the emit's loop; the read rule; the stop, its text and
its account; the usage reader's second lane; the cases; the write-backs.

**Acceptance criteria (all required)**

1. With a fixture launchpad at an instance's levels and a registered target
   worktree whose installed guards record no levels,
   `node scripts/harness.mjs emit` run in the launchpad prints that
   worktree's path, and its guards then answer a call the root advises on
   with an advisory (`npm test -- --only target-worktree`).
2. From a session in a target worktree, the Read tool's read of a file
   under the launchpad's main checkout is admitted, and its read of a
   credential path the work rows name is refused
   (`npm test -- --only target-worktree`).
3. A driven attempt that ends without its phase's completion and whose
   record holds a guard's refusal stops the drive as `guard-refused`, and
   the drive starts no second attempt of that phase
   (`npm test -- --only harness-fixtures`).
4. For that stop, `node scripts/drive.mjs why WO-NNN` prints each refusing
   stop's id and the line of `dotln.config.json` that changes its level
   (`npm test -- --only harness-fixtures`).
5. A driven attempt that ends without its phase's completion and holds no
   refusal is dispatched once more and then stops as `incomplete-bound`
   (`npm test -- --only harness-fixtures`).
6. `node scripts/harness.mjs usage <session>` for a session whose journal
   lies in an order's target lane prints that session's counts and not the
   cause `no-session` (`npm test -- --only harness-fixtures`).
7. `docs/KIT.md` under "How a session reaches the target" says that a drive
   starts each phase but the close in the target worktree, under its
   guards, and that the launchpad's emit brings those guards to the root's
   levels (`npm run test:docs`).
8. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only target-worktree`,
`npm test -- --only harness-fixtures`, `npm test -- --only launchpad`,
`npm test -- --only skeleton`.

**Evidence gate:** under `docs/evidence/WO-292/`: the decisions, with the
emit's measured time before and after on core's host and on the fixture
with one and with three registered worktrees; the drive record and the
`why` output of criterion 3's fixture; the handoff.

**Write-back duty:** as step 9 lists. The release's Read before upgrading
says that the emit which finishes an update now writes each registered
target worktree's guards, so an instance need not run the target emit by
hand.

**Known issues and carry-ins:**

- The other nine items of WO-287-D084's follow-up stay boarded
  (FUP-558ef58d7a128b96); this order takes the seventh.
- Starting a driven target phase in the launchpad, and a filing-time check
  of the commands a target order names, are register rows of the pass.
- A host's own denial of a driven worker's call is not a guard's refusal
  and keeps today's route (FUP-747cfe30de394892).
- The register row this order settles in part: FUP-54b3c0389e21ee0d
  (WO-287-D079), by step 9.

**Non-goals:** where a drive starts a phase; what any guard judges, beyond
the Read tool's reads; the levels themselves; the verifier's verdict and
what it must show (WO-293); the dispatch bound's reading of idle time; the
drive's attended or in-session modes; a host's permission prompts.

**Operator-review assumptions:** the launchpad's emit may write into a
registered target worktree's guard files without being asked each time;
and a guard's refusal ends a drive on the first attempt.
