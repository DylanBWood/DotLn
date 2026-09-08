# WO-039 fourth repair — immutable reservation instances

**Source.** [VER-003](../../verifications/WO-039/VER-003.md) findings F1, F2
and F3: a session's refresh of its own reservation kept the same file name, so
a stale reclaimer could remove the refreshed facts and be admitted beside the
owner; the operator release judged one observation and retired another; and
the latest live-holder smoke failed the aggregate rule that required an
attribution refusal the session never reached. Canonical control recorded
`RepairRequested` against `VER-003` at checkpoint 15 from the `resume: fix`
dispatch. This receipt maps those three findings; the [first](repair.md),
[second](repair-002.md) and [third](repair-003.md) receipts stand.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

The session selector was the operator's `/model` choice at `max`; the harness
exposes an effort value to child processes but no recorded effective-session
readback exists for this version, so the source is self-reported.

## Instrument disclosure

This repair ran under the installed third-repair bundle, whose hooks pin the
built runtime bytes, and the sandbox denies the hooks directory, so a rebuild
in this worktree would fail every later hook closed with no way to reinstall
from inside. Validation therefore ran in a scratch clone under the session's
temporary directory carrying the same dirty tree, built from the changed
source, with its bundle re-emitted there and reached through `npm --prefix`.
Source and fixture edits went through the harness's own edit tool so the
installed observers saw them; shell text never named the ignored local harness
directory. The process table is unreadable in this sandbox, so live owners
recorded by fixtures carry no start time here while seeded owners do; the
refusal-text assertions accept both forms.

This session reclaimed the previous executor session's dead-owner reservation
at its first write dispatch, exactly as the second repair specifies, and holds
this worktree's reservation as a directory instance. After the operator
installs the regenerated bundle, the session's later dispatches run under the
repaired protocol; its instance is not refreshed unless a fact changes.

## Finding F1 — diagnosis and repair

- **Confirmed.** `refreshWriterInstance` renamed the session's updated record
  over its existing file name. A contender that had read the old contents and
  classified their recorded owner as dead held that same name, so its
  conditional `unlink` succeeded on the refreshed file, its `rmdir` emptied
  the slot, and its placement admitted a second writer while the owner's
  authorized work was outstanding. The third repair's conditional steps were
  exact for placement and retirement but not for a refresh, because a name
  no longer denoted one set of facts.
- **Direction chosen: a reservation file's facts never change under its
  name.** A session that records a new fact about its own reservation (an
  owner, or an unavailable liveness) writes a new nonce-named file whose
  record names the file it supersedes, checks that the new file is the slot's
  current instance, and then removes the superseded name. A contender's
  `unlink` of the observed name therefore fails with `ENOENT` once those facts
  were superseded, and the contender re-observes and honours the refreshed
  holder. The observer treats the one file no other file names as superseded
  as the current instance, reports lingering superseded files of the same
  lineage for removal, and refuses anything else for inspection. Retirement
  removes the lingering names first, which nothing can revive, then the
  current name. When the slot is no longer the session's own at the check,
  the injected file is withdrawn and the session re-observes; a distrusted
  identity that acquires again in that pass keeps its unavailable liveness.
- **Unchanged.** The compiled predicate, the `harness-writer-v1` view
  contract, liveness rules, refusal diagnostics, journal rows and the operator
  commands. The view never names an instance. The lock stays in the ignored
  local harness directory.
- **Rejected, with reasons preserved.** Comparing the inode or contents just
  before the unlink: narrows the window but cannot close it. Refreshing by
  moving the instance directory aside and placing a new one: the slot would be
  absent between the two renames, so a contender could acquire it and a live
  session would lose its worktree mid-work, the failure the unit exists to
  prevent.

## Finding F2 — diagnosis and repair

- **Confirmed.** `releaseHarnessWriterByOperator` built a view from one
  observation, decided liveness from it, then observed the slot again and
  retired whatever instance that second observation returned, while the return
  value and the `operator-released` row described the first view. A reclaim
  between the two observations was removed as if it were the dead holder.
- **Direction chosen: one observed reservation per decision.** The command
  observes once, decides from that record, retires exactly that instance by
  its name, and journals that record. When the retirement finds the name gone,
  the holder changed: an unforced release re-observes and judges the new holder
  by the same rule, so a live replacement refuses as alive; a forced release
  refuses outright, because the operator judged a different holder, and says
  to inspect again. A legacy single-file reservation is judged and removed
  under the same rule; a stale legacy file beside a directory instance is no
  longer removed as a side effect of releasing that instance.

## Finding F3 — diagnosis and repair

- **Confirmed.** The live-holder scenario seeds a live foreign reservation,
  so the session's first source write is refused by the writer guard naming
  the holder. The aggregate pass rule also required the fixture commit's
  attribution refusal. In attempt 002 the session read the packet, ran one
  metadata command and stopped after the holder refusal without attempting the
  commit; in attempt 001 it happened to attempt the commit anyway. The record
  correctly witnessed the scenario's own proof and failed on model behaviour
  the scenario cannot direct.
- **Direction chosen: the scenario's required denied effect is its own.** The
  smoke now records `requiredDeniedEffect` and `requiredDeniedEffectRefused`.
  For the four role runs and the dead-holder scenario the required effect is
  the attribution refusal, as before. For the live-holder scenario it is the
  writer guard's refusal naming the seeded holder; whether the attribution
  refusal was also reached stays recorded as `deniedEffectRefused`. The
  evidence checker asserts the required effect per record. Record
  `schemaVersion` is 4. The failed attempt 002 is preserved unchanged and the
  checker still refuses it until the operator's rerun files attempt 003 on the
  regenerated runtime; no older record is selected to obtain a pass.
- **Rejected.** Steering the session into the fixture commit after a holder
  refusal: model behaviour after a refusal is not a fixture input, and
  requiring a further write there would reward the wrong behaviour.

## Fixtures

`scripts/test-harness.mjs` gains two tests and extends two; the race helpers
are shared by the three race tests.

- **Refreshed reservation versus stale reclaimer.** A's own reservation is
  seeded with a dead recorded owner. B's generated writer hook classifies it
  as dead and pauses before its unlink. A's hook is dispatched, is admitted,
  and records its liveness as unavailable. B resumes and is refused, naming A
  with unknown liveness; A's facts live under a new name that names the
  superseded one, one file remains, and the event log holds exactly
  `liveness-unavailable`. A remains admitted and B refused. The other order
  is also covered: A's refresh is paused before its rename, M reclaims the
  dead facts and takes the slot, and A's refresh finds the slot no longer its
  own, withdraws, and is refused naming M; M's single instance is untouched.
- **Operator release versus reclaim.** The public `writer --release` command
  runs under the same preload and pauses before its unlink of the dead holder
  it judged. G's hook reclaims the holder and is admitted. The unforced release
  resumes, finds the name gone, re-judges G, and exits 1 naming a live owner;
  G's reservation survives, no `operator-released` row exists, and a later
  session is refused naming G. The forced form under the same schedule exits 1
  saying the reservation changed, and J's replacement survives. Uncontended,
  the same command releases the dead holder and journals that holder.
- **Extended.** The foreign-reservation test asserts that recording an owner
  or an unavailable liveness produces a new instance naming the replaced one,
  that the view never names an instance, and that the release journal names
  the reservation it judged. The refusal-text assertions in the VER-002
  regression and the new tests accept a recorded owner start time, which a
  readable process table supplies outside this sandbox.

## Validation

- [repair-004-fixtures-001.txt](repair-004-fixtures-001.txt): the two new
  tests run against the unrepaired runtime, a scratch build of the third-repair
  source with only the fixture file synced. Both fail at their defect
  assertions: the stale reclaimer removed refreshed facts and was admitted, and
  the unforced operator release reported the dead holder released while the
  live replacement was removed. These reproduce VER-003 F1 and F2.
- [repair-004-fixtures-002.txt](repair-004-fixtures-002.txt): the repaired
  scratch build passes 16 of 17 harness fixtures. The one failure was the new
  test's refusal-text pattern, which did not accept the seeded owner's start
  time; the host behaved correctly and refused the stale reclaimer.
- [repair-004-fixtures-003.txt](repair-004-fixtures-003.txt): all 17 harness
  fixtures pass on the repaired runtime, including both new tests.
- The re-emitted bundle differs from the installed one in exactly twelve
  surfaces: the eleven generated hook files, whose pinned runtime hash for
  `packages/skeleton/dist/src/harness-host.js` changes from
  `fnv1a64:c24d5b4dfb69da68` to `fnv1a64:314cebd40278b35f`, and the manifest.
  The other four runtime pins, the skills, settings, the instruction block and
  the context measurement are unchanged.
- Local release preparation reports the `v0.15.0` target current with no file
  changes; the compiler and skeleton versions this order already bumped cover
  the changed component. Both publication locks were refreshed after the
  product-doc write-backs.
- [repair-004-checks-001.txt](repair-004-checks-001.txt): the first full
  `npm test` in the scratch stopped at the two publication source locks made
  stale by the product-doc write-backs, after formatting, the local release and
  license surfaces and every lifecycle, recovery, worktree, release and index
  fixture group passed. The locks were refreshed from
  `check-publication --print-locks`.
- [repair-004-checks-002.txt](repair-004-checks-002.txt): the full `npm test`
  in the re-synced scratch passes every step through the rebuilt runtime
  tests, all 17 harness fixtures, `harness check` on the re-emitted bundle and
  the context measurement, then stops at the live evidence gate with
  `executor: live runtime drift`, the expected state before the operator
  reruns the live suite.
- [repair-004-checks-003.txt](repair-004-checks-003.txt): every gate step
  after the live evidence gate, run individually in the same scratch build,
  passes with exit 0.
- In this worktree, `git diff --check` is clean, the changed files pass the
  formatter, and the configured local-terms screen passes over every changed
  and generated surface. `harness check` here reports drift on the eleven hook
  files and the manifest until the install, which is the pin changing rather
  than an unowned surface.
- [repair-004-checks-004.txt](repair-004-checks-004.txt): after the operator
  installed the regenerated bundle and ran the live suite from an outside
  terminal, the six new records (`executor-014`, `verifier-010`,
  `reviewer-009`, `release-close-009`, `writer-foreign-dead-003` and
  `writer-foreign-live-003`) pin the repaired runtime and pass, and the full
  gate in this worktree, run through `npm run harness -- evidence`, passes with
  exit 0 and a clean `git diff --check`. The live-holder attempt 003 witnesses
  the writer refusal its corrected rule requires and, in that session, the
  attribution refusal as well; the evidence checker screens 78 generated and
  evidence surfaces with the operator's list present. The transcript is filed
  after its run and is itself part of the tree the completion receipt hashes,
  so the same command runs once more over the tree that includes it; that run
  holds the receipt the installed completion hooks read, and its exit code is
  reported at the handoff rather than filed as a further transcript.

## Operator steps before re-verification

From a terminal outside the sandbox, in this worktree: `npm run harness -- emit`
installs the regenerated bundle over the rebuilt runtime; then
`DOTLN_LIVE_HARNESS=1 node scripts/harness-live-suite.mjs` produces the six
live records that pin the new runtime, including the live-holder scenario
under its corrected rule; then `npm run harness -- evidence` runs the full gate
with the installed completion hooks holding the receipt. The executor session
then refreshes this order's current live links and records
`npm run resume -- repair-complete` with its actor flags. Canonical control
owns that handoff; independent re-verification remains separate. The operator
ran the three commands before this receipt was finalized; the records and the
gate transcript are cited above.

## Limits

Same-user bookkeeping, not isolation from a hostile process. Correctness rests
on the same three filesystem guarantees as the third repair, plus the rule
that a reservation name is written once: `unlink` of an exact name, `rmdir` of
an empty directory, and `rename` of a directory that refuses a non-empty
destination. A refresh that lands in a directory another session placed
meanwhile is withdrawn on the next observation; in the window between, an
observer refuses for inspection rather than guessing, and a session that dies
inside that window leaves a state the operator inspects by hand, as before.
Pid reuse and the ancestor fallback keep the limits the second repair recorded.
The scratch gate cannot pass the live evidence gate, because the committed
live records pin the previous runtime until the operator reruns the suite.
