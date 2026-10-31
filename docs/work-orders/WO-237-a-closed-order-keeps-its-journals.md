# WO-237 — A closed order keeps its journals: release close moves the worktree's session journals, session state and gate index into main's retained lane for the order under a `closed-journal` retention class the prune judges, and planning's failure counts and the usage readback read them by order; and a temporary root whose volume was renumbered by a reboot is judged by its token and inode instead of refused (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. One retention class with its seed and
template, one step inside the close's worktree removal with its record
field, two readers extended; no new command, no new operator phrase.
Assigned at activation under the standing opt-out default.
**Cost:** adds `closed-journal` to `DEFAULT_RETENTION` in
`packages/skeleton/src/temporary-root-records.mjs` and the seed to
`docs/control/budgets.json` and `scripts/kit/budgets.template.json`, the
move in the close's worktree removal (`scripts/release.mjs` around 2290 to
2330 with `scripts/lib/worktree-removal.mjs`), the `journals` field of the
cleanup row and `release-close.json`, the retained-lane read in
`scripts/lib/plan-failures.mjs` and in the usage readback (`scripts/harness.mjs
usage` with `packages/skeleton/src/usage-observation.mjs`), cases in
`scripts/test-release.sh`, `scripts/test-temporary-roots.mjs`,
`scripts/test-plan-refutation.mjs`, `scripts/test-harness.mjs` and
`scripts/test-instance-history.mjs`, and sentences in product 07 and the
kit README; and, from the operator's item 8 of 2026-10-30, the identity rule in
`readTemporaryOwner` and `writeTemporaryOwner`
(`packages/skeleton/src/temporary-root-records.mjs` 362 to 376),
`applyTemporaryCandidate` (`scripts/lib/temporary-prune.mjs` 557) and the
scratch-repository check of `scripts/lib/starter-refresh.mjs` (423): the
token and the inode identify a root, a changed device number is re-stamped
and ledgered as `device-renumbered`, with the fixture, its paired control and
cases in `scripts/test-temporary-roots.mjs` and `scripts/test-fixture-temp-root.sh`.
Removes the close's refusal of its own regenerable roots after a reboot (six
build directories at WO-239's close on 2026-10-30), and the loss, at every release close, of the order's hook
judgments, host denials, dispatch rows, operator-message rows and gate index
(the fork's executor could not read the earlier target orders' journals on
2026-10-28; `plan failures` counts denials and interventions from the
current checkout's journals only, so a closed order contributes none).
Wall-clock: one directory move per close (milliseconds; WO-192's worktree
holds four journals of 368 KB; main's 242 journals of two months are 63 MB;
the gate captures that make a harness directory large keep their own
classes and do not move). Context bytes: this file. Commands: none new;
`harness prune` reports the class. Tokens: unknown until run. Steps: 8.
Re-mints: `temporary-root-records.mjs` and `usage-observation.mjs` are
runtime sources; the executor checks `scripts/lib/evidence-sources.mjs` at
activation and re-mints deterministically any edition they stale; none is a
file the feedback verifier judges, so no live feedback episode;
`release.mjs`, `harness-prune.mjs` and `plan-failures.mjs` are declared
sources of machinery suites, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's second message of the 2026-10-28
dispatch (the pass's capture in ignored intake, SHA-256 recorded in the
planning document's first section): that the logs of earlier orders'
worktrees are removed when those orders close is bad, that worktrees should
likely be kept fourteen to thirty days before automatic removal, and that
the pass make sure that assumption is correct; the fork's executor's
observation the message quotes; the pass's verification (the planning
document's section on the journal question): the concern holds, the unit
is wrong, and the journals are the thing to keep. Filed by the
[2026-10-28 pass](../planning/target-write-grant-and-fork-block-2026-10-28.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-233 (closed, v0.100.0: the owner records, the retention
classes in the budgets file, the prune at release close and the close
record's `prune` field this order extends), WO-178 (closed: `plan start`
and `plan failures` counting local closes, denials and interventions from
the journals), WO-139 (closed: the session journal and the usage readback).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-233",
    "relation": "satisfied-by-close",
    "reason": "the owner records, the retention classes, the prune at release close and the close record this order extends"
  },
  {
    "workOrderId": "WO-178",
    "relation": "satisfied-by-close",
    "reason": "plan start and plan failures counting local closes, denials and interventions from the journals"
  },
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the session journal and the usage readback this order lets read from a retained lane"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Workflow closeout and
releases (the prune at release close, `release-close.json`'s `prune` field,
"its directory is gone") and §Operator-opened planning pass item 2 (`plan
start` and `plan failures` counts); `packages/skeleton/src/harness-host.ts`
(`harnessStateDirectory` 476 to 481: the journal lives under the checkout's
`docs/control/local/harness/`; `statePath` 485; the session journal at
1054); `scripts/lib/plan-failures.mjs` (the journal read at 750 to 770 from
`dirname(checksPath(root))`, the current checkout only); `scripts/release.mjs`
(the cleanup rows and `preservationReceipt` at 2290 to 2330; the meter
snapshot "written only where the order's session journals are" at 4086 to
4094); `scripts/lib/worktree-removal.mjs` (the removal proof and the
retained lane `docs/control/local/retained/<WO>/`);
`packages/skeleton/src/temporary-root-records.mjs` (`DEFAULT_RETENTION` 66
to 74, hours, `null` keeps; `validateRetention` 113 to 125, a closed key
set); `scripts/lib/process-budget.mjs` (`readBudgets` 15 to 19);
`docs/control/local/retained/WO-233/release-close.json` (the shape a close
records: `cleanup.worktrees[]` with `outcome` and `preservationReceipt`);
`docs/control/budgets.json` (`retention`); `scripts/kit/README.client.md`
§Owned cleanup and retention.

**Objective:** When an order closes, the information its sessions produced
survives the worktree for a window the operator owns. Release close moves
the worktree's session journals, session state files and gate index into
`docs/control/local/retained/<WO>/harness/` under main as an owned root of
class `closed-journal` (seed 720 hours; `null` keeps; `0` removes at the
next prune), records the move on the close record, and leaves the gate
captures to the classes they already have; the prune judges the lane as it
judges every owned root; `plan failures` counts a closed order's rows from
the lane, attributed to the order; `harness usage <session>` reads a
retained session. Nothing is committed and no worktree is kept.

**Observed gap (dated 2026-10-28 at `main` `2b872abc`):**

- The session journal and state live under the checkout's
  `docs/control/local/harness/` (`harnessStateDirectory`, 476 to 481): the
  journal `<session digest>.jsonl` (dispatch rows, tool-call judgments,
  outside-write rows, registered-target admissions, host denials, operator
  messages), the session state `<session digest>.json`, `checks.json` (the
  gate index), `suite-success/`, `deadlines/`, and the gate's captures
  (`runner/`, `check-history/`, `check-output/`), `targets/` and
  `excludes/`.
- Release close removes the worktree ("its directory is gone"; the WO-233
  close record: `cleanup.worktrees[0].outcome: "removed"` with a
  preservation receipt for operator material only, `worktree-removal.mjs`)
  and then runs the prune (product 07 §Workflow closeout). Nothing moves
  the journals first; the only carry is the meter snapshot
  `docs/evidence/<WO>/meta.json`, written at release preparation from the
  worktree's journals (4086 to 4094) and holding usage by role, not the
  rows.
- `plan failures` reads journals from `dirname(checksPath(root))`, the
  current checkout's harness directory (750 to 770); its denial and
  intervention counts therefore cover main's sessions and the sessions of
  worktrees that still exist, never a closed order's.
- The fork's WO-019 executor, asked on 2026-10-28 whether a Claude Code
  session had ever edited a target worktree, had one journal row to read
  (its own refusal) because the earlier orders' worktrees were removed at
  their closes; it answered from the committed attestations instead, which
  record the harness per phase and not the hook's judgments.
- Sizes on this machine: the fork's WO-019 launchpad harness directory 604
  KB; WO-192's worktree four journals of 368 KB inside a 1.2 GB harness
  directory whose `runner/` holds 1.1 GB of gate captures; main's 242
  journals 63 MB with `check-history/` 375 MB and `check-output/` 25 MB
  beside them; the whole WO-192 worktree 2.1 GB and the fork's target
  worktree 1.3 GB. The captures already carry retention classes
  (`gate-fixture-passed` 0, `gate-fixture-failed` 24, `worker-capture` 1,
  `legacy-backfill` 48 hours; `coordination` `null`); the journals carry
  none and are the smallest part.
- `validateRetention` refuses a key outside `DEFAULT_RETENTION` (113 to
  125), so the class is a kit change that reaches every instance with the
  update, its seed read as a default where the instance's budgets file
  lacks the key.
- The operator's item 8 of 2026-10-30: WO-239's release close, the first
  close after the host rebooted (boot time 2026-10-29 16:24 local by
  `sysctl kern.boottime`; WO-239 activated at 14:23Z that day, so its
  implementation spanned the reboot), refused six retained build
  directories whose owner records matched their ledger tokens and current
  inode numbers but not the current device number, and the role text sent
  the operator to the preservation route for regenerable output.
  `readTemporaryOwner` throws "Temporary owner record is invalid or the
  directory was replaced" when `info.dev !== record.device` (362 to 366),
  `writeTemporaryOwner` throws "identity changed" on the same comparison
  (375), `applyTemporaryCandidate` refuses a legacy root the same way
  (`temporary-prune.mjs` 557) and the prune's judgment retains the root
  with the thrown message (497); every owner record created on this host
  after the reboot carries device 16777234 (seven session-scratch records
  read on 2026-10-30, all matching). The inference, with that evidence: a
  volume's device number is assigned at mount and a reboot can renumber it,
  so a record older than the boot fails the comparison although the
  directory, its inode and the token file inside it are unchanged. The
  pre-reboot number is not observable in a surviving owner record; the
  close's own retained record
  (`docs/control/local/retained/WO-239/stale-build-cleanup.json`, ignored)
  names the six roots, `.runtime/build-*` under the WO-239 worktree with
  recorded device 16777233 against the observed 16777234, tokens and inodes
  matching and owners dead, their verified removal under the teardown lock
  after the operator's correction, and the retried close with no remaining
  blocker; nothing waits on the operator, and the one-step renumbering is
  consistent with the reboot inference.
- The fork's item 6 of 2026-10-30 (DotLn-Enterprise-Starter, dylanwoodconsulting):
  WO-019's release close of 2026-10-29 removed its worktrees and with them
  the session journals that would have carried the first granted target
  write and the latency WO-236-D029 asks about; the fork's row waits for
  the release that carries this order.

**Design (scope discipline):**

- **Move the small things, leave the large ones to their classes.** Before
  `git worktree remove`, the close moves `*.jsonl`, the session `*.json`
  states, `checks.json`, `suite-success/` and `deadlines/` from the
  worktree's harness directory into `docs/control/local/retained/<WO>/harness/`
  under main, created through the owned-root helper with class
  `closed-journal`, the order and the close as its owner; `runner/`,
  `check-history/`, `check-output/`, `targets/`, `excludes/`, `writer/`
  and the `started` markers stay where they are and fall with the worktree
  or with their own classes. The cleanup row and `release-close.json` gain
  `journals: { lane, files, bytes }`; a retried close finds the lane and
  merges into it. Rejected: keeping the worktree for a window (axis: the
  worktree is 1.3 to 2.1 GB on this machine, nearly all of it gate
  captures, build output and installed packages that regenerate; WO-233
  was filed on the operator's direction to stop exactly that residue; the
  information asked for is a few hundred kilobytes of journal). Rejected:
  committing the journals into `docs/evidence/<WO>/` (axis: they hold host
  paths, session ids and operator-message digests and are local
  observation, as the harness directory is ignored today). Rejected: a
  default of `null` (axis: 63 MB of journals accrued on main alone in two
  months; the operator owns the number and the seed is the window the
  operator named).
- **The prune already knows how.** The lane is an owned root with a class
  and a creation time; the existing judgment removes it past its window,
  keeps it under `null`, and names the class in its report; nothing new is
  scheduled.
- **Two readers, no new reader.** `plan failures` reads
  `docs/control/local/harness/` and every
  `docs/control/local/retained/WO-NNN/harness/` lane, attributing a lane's
  rows to its order and reporting `retainedJournals` in its counts; `harness
  usage <session>` resolves a session digest in a retained lane and names
  the lane as its source. Rejected: a new index or browser over retained
  journals (axis: no consumer asked for one; the two named readers are the
  ones that lose data today).
- **A root is its token and its inode.** The owner record's `token` is the
  proof a directory is the one that was created (fixture copies exclude the
  marker and seeds keep it out of Git, product 07 §Preflight before the full
  gate), and the inode says the directory was not replaced on its volume;
  the device number is recorded for diagnosis and, when it differs, is
  re-stamped into the record with a `device-renumbered` ledger row carrying
  both numbers, never a refusal. Rejected: comparing the device number
  strictly (axis: a reboot renumbers volumes while the inode and the token
  prove identity; the strict rule turned regenerable build output into an
  operator preservation question at WO-239's close). Rejected: recording
  the boot time and re-stamping every record at the first command after a
  boot (axis: a walk over every owned root at boot against one lazy
  re-stamp when a record is read). Rejected: dropping the device number
  from the record (axis: the diagnosis of a replaced directory on another
  volume still wants both numbers in the ledger). Rejected: a recovery path
  for build staging only, keeping the strict device comparison for every
  other class (the other pass of 2026-10-30's design, axis: it fixes the one
  class that was refused and leaves gate fixtures, session scratch and warm
  caches created before a reboot to refuse at the next close after one; its
  negative cases are taken instead, below).
- **Live-run surfaces at the base.** The owned-root helper and the prune
  with its classes: exist (WO-233). The retained lane per order with the
  removal proof: exists (`worktree-removal.mjs`). The close record's
  cleanup rows: exist. A journal move: absent. A retained-lane read in
  either reader: absent.

**Execution plan (the executor follows these steps in order; observed at `2b872abc`, 2026-10-28):**

1. `packages/skeleton/src/temporary-root-records.mjs` `DEFAULT_RETENTION`
   (66 to 74): `"closed-journal": 720`; `docs/control/budgets.json` and
   `scripts/kit/budgets.template.json` `retention` blocks gain the key with
   the seed; `validateRetention` admits it; an export made before this
   order reads the default. Check: `npm test -- --only fixture-temp-root`;
   `npm test -- --only process-debt`; `npm test -- --only launchpad` (the
   update case).
2. `scripts/lib/worktree-removal.mjs` and the close's cleanup in
   `scripts/release.mjs` (2290 to 2330): before the subject is removed, the
   listed entries move into the retained lane created through the
   owned-root helper with class `closed-journal`; the cleanup row and
   `release-close.json` record `journals: { lane, files, bytes }`; an
   existing lane is merged, never overwritten; a move that fails is a
   cleanup blocker with the close's retry command, as the prune's refusal
   is. Check: `npm test -- --only release`; the close cases of
   `scripts/test-release.sh`.
3. `scripts/lib/harness-prune.mjs`: the lane is judged as an owned root
   of its class; `null` keeps; the report names the class and the lane.
   Check: `npm test -- --only harness`; `npm test -- --only
   fixture-temp-root`.
4. `scripts/lib/plan-failures.mjs` (750 to 770): read the retained lanes
   beside the checkout's directory, attribute rows to the lane's order,
   and report `retainedJournals` (lanes, files, unreadable). Check: `npm
   test -- --only plan-refutation`.
5. `scripts/harness.mjs usage` with `packages/skeleton/src/usage-observation.mjs`:
   a session digest found in a retained lane is read from there with
   `source` naming the lane. Check: `npm test -- --only harness`.
6. `scripts/test-instance-history.mjs`: an updated instance's close moves
   its journals into the lane under the class. Check: `npm test -- --only
   instance-history`.
7. `packages/skeleton/src/temporary-root-records.mjs` `readTemporaryOwner`
   (330 to 368) and `writeTemporaryOwner` (371 to 381): the identity check
   compares `info.ino` with `record.inode` and the token file's presence;
   a differing `info.dev` re-stamps `record.device` through
   `writeTemporaryOwner` and ledgers `device-renumbered` with the old and
   new numbers; `scripts/lib/temporary-prune.mjs` `applyTemporaryCandidate`
   (557) and `scripts/lib/starter-refresh.mjs` (423) follow the same rule.
   Fixture: an owner record whose `device` differs from the directory's
   current one with the same inode and token is judged by its class and
   window at the current tree; the paired control at the base retains it
   with "Temporary owner record is invalid or the directory was replaced";
   the negative cases refuse and delete nothing: a different inode (a real
   replacement), a token that does not match the ledger, a live or unknown
   owner, an active gate or writer, a replacement race (the inode changes
   between the read and the act), a symlinked root, an unexpected file the
   class does not declare, and a root outside the registered checkouts; a
   retried judgment is idempotent; both arms' exit codes in
   `docs/evidence/WO-237/controls.json`. The
   re-stamp's cost is one record write per renumbered root at first read,
   measured in the fixture and recorded. Check: `npm test -- --only
   fixture-temp-root`; `npm test -- --only harness`; `npm test -- --only
   release` (the starter-refresh case).
8. Write-backs: product 07 §Workflow closeout and releases (what moves,
   what stays, the lane, the class and the seed; that the lane is ignored
   local material); `scripts/kit/README.client.md` §Owned cleanup and
   retention (the key and the seed); `docs/evidence/WO-237/decisions.md`;
   `npm run meta`; `node scripts/lineage.mjs index --check`; `npm run
   publication:check`.
9. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-237/handoff.md`; `npm run
   test:docs` once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the class, its seed and template; the move inside the
close with its record field; the prune's judgment of the lane; the two
readers extended; the identity rule that survives a reboot with its
control; the cases and the paired controls; the write-backs.

**Acceptance criteria (all required)**

1. `DEFAULT_RETENTION`, `docs/control/budgets.json` and the kit template
   carry `closed-journal` with the seed of 720 hours; `readBudgets` admits
   it; an export made before this order passes `npm run meta` after an
   update and reads the default.
2. A fixture release close moves the listed entries of the worktree's
   harness directory into `docs/control/local/retained/<WO>/harness/` with
   an owner record of the class before the worktree is removed, leaves the
   capture directories behind, and records `journals: { lane, files, bytes
   }` on the cleanup row and in `release-close.json`; a move that fails (a
   cross-device rename, a permission denial, a full disk) is the close's
   existing cleanup blocker: the worktree is not removed, the row records
   `journals.outcome: failed` with the error and the retry command, and the
   published release is untouched; the paired control at
   the base shows the journals gone after the close; both arms' exit codes
   and the lane listing are recorded in `docs/evidence/WO-237/controls.json`.
3. The prune removes a retained lane past its window, keeps one within it
   and keeps one under `null`, naming the class in its report; a retried
   close merges into an existing lane.
4. `plan failures` counts a closed order's rows from its lane, attributed
   to the order, and reports `retainedJournals`; a fixture record with one
   host denial in a retained journal appears in the counts.
5. `harness usage <session>` reads a session whose journal is in a
   retained lane and names the lane as its source.
6. The instance-history suite shows an updated instance's close moving its
   journals into the lane under the class.
7. Product 07 and the kit README state the lane, the class, the seed, what
   moves and what stays; `npm run publication:check` is green.
8. A temporary root whose owner record carries a device number other than
   the directory's current one, with the same inode and token, is judged by
   its class and window like any other root: the fixture at the current
   tree removes it past its window, the paired control at the base retains
   with "Temporary owner record is invalid or the directory was
   replaced", the ledger carries a `device-renumbered` row with both
   numbers, the re-stamped record carries the current number, and both
   arms' exit codes are in `docs/evidence/WO-237/controls.json`; the
   negative cases of step 7 (a different inode, a mismatched token, a live
   or unknown owner, an active gate or writer, a replacement race, a
   symlinked root, an undeclared file, a root outside the registered
   checkouts) refuse and delete nothing, and a retry is idempotent; the
   starter-refresh scratch check follows the same rule in its case.
9. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only fixture-temp-root` and `npm test --
--only process-debt` for steps 1 and 3; `npm test -- --only launchpad` for
step 1; `npm test -- --only release` for step 2; `npm test -- --only
harness` for steps 3 and 5; `npm test -- --only plan-refutation` for step
4; `npm test -- --only instance-history` for step 6; `npm test -- --only
fixture-temp-root`, `npm test -- --only harness` and `npm test -- --only
release` for step 7; `npm test -- --only
configuration-root` for every script step; `npm run test:docs` when a
document changes; each under `node scripts/harness.mjs bounded --`; then
one `npm test -- --review` (07-execution-guide.md §Preflight before the
full gate).

**Evidence gate:** the cases and controls of criteria 1 to 8; the
deterministic re-mints of any edition the runtime sources stale; `npm test
-- --review` before `implementation-ready`, final review reusing the
passing complete row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 8 and criterion 7.

**Known issues and carry-ins:**
- The journals hold host paths, session ids and operator-message digests;
  the retained lane is ignored local material as the harness directory is,
  never committed; the kit README says so (reopen: a reader asks for a
  committed form, which is a planning question about evidence editions).
- The target worktree keeps no journals of its own; its bookkeeping under
  the launchpad's `targets/` stays with its existing handling, and a
  target close moves nothing (reopen: a target bundle starts journaling
  into the target).
- The operator's words named fourteen to thirty days; the seed is 720 hours
  and the key is the operator's to change in the budgets file (reopen: the
  operator sets another window, or a retained lane is pruned before a pass
  that needed it read it).
- The meter snapshot `docs/evidence/<WO>/meta.json` stays the committed
  summary; this order changes neither it nor its writer (reopen: a pass
  needs a committed figure the snapshot lacks).
- Carry-in (WO-239-D020, FUP-69af2e1da022aa7a): routine apply-mode cleanup
  of expired temporary roots outside a close's scope has no home now that a
  close prunes only its own scope and the session-end prune never walked
  the system temporary directory; today only an explicit `harness prune
  --apply` removes them. This order measures the census cost at each
  candidate home (session end, `plan start`, a scheduled run) before
  choosing one, keeps the close bounded, and records the measurements and
  the choice in its decisions (reopen: expired roots accumulate past a
  retention window without a run that removes them, or a chosen home adds
  more than its measured cost to the step it joins).
- The device-number rule changes `readTemporaryOwner`, which every hook,
  gate, prune and meter reads; the re-stamp writes only inside the owner
  file of a directory the record already names (reopen: a re-stamp is
  observed on a directory whose inode changed, which this order's rule
  must refuse).
- Carry-in (the 2026-10-31 pass, whose entry `plan start` refused):
  `failuresAtStart` (`scripts/lib/plan-failures.mjs` 1245 to 1293) asserts
  its block at or under 1,024 bytes of pretty-printed JSON after clipping
  only its two string fields; the window since receipt 060 carried three
  off-ramp kinds (`offRampEvents` with `CriterionWaived`,
  `DispatchBoundAccepted` and `OperatorOverrideRecorded`), the block went
  over the bound, and the branch stayed shut against WO-172's rule that a
  count never keeps it shut (the pass opened its branch and wrote its
  skeleton by hand, as the fork's pass of 2026-10-30 did under WO-088's
  known issue). This order, which edits the same file for the retained
  lanes, measures the block compact (or raises the bound to the measured
  shape plus one half) and reports an overrun as one line in the block
  instead of refusing, with a case in `scripts/test-plan-refutation.mjs`
  (reopen: `plan start` refuses on the block again).
- Carry-in (the fork's item 2 of 2026-10-30): an acceptance recorded with
  `--ceiling unlimited` is stored as `ceiling: null` (`scripts/resume.mjs`
  1946) and `plan failures` passes it through (`boundAcceptances`,
  `plan-failures.mjs` 1087), so a reader has to know null means unlimited;
  this order renders it as `unlimited` in the feed and the start block, with
  a case in `scripts/test-plan-refutation.mjs` (reopen: a reader of the feed
  still meets a null ceiling).

**Non-goals:** keeping worktrees for any window; committing journals;
changing the gate captures' classes or the prune's schedule; a new reader,
index or browser over retained journals; Codex or Copilot session
differences (the move is host-agnostic); the fork's own records.

**Operator-review assumptions:** the operator asked that the assumption
"keep worktrees fourteen to thirty days" be checked; the pass's reading is
that the information is worth keeping and the worktree is the wrong unit,
so this order keeps the journals for thirty days by default and keeps no
worktree; if the operator reads the window or the unit differently, the
budgets key and this order's sequence position are theirs to change.
