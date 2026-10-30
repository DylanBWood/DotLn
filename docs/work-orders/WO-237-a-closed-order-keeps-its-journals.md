# WO-237 — Keep closed-order journals and safely remove generated build staging (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. One retention class with its seed and
template, one step inside the close's worktree removal with its record
field, two readers extended; no new command, no new operator phrase.
Assigned at activation under the standing opt-out default.
**Cost:** adds a bounded stale-build recovery path and its negative controls, plus `closed-journal` to `DEFAULT_RETENTION` in
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
kit README. Removes: the loss, at every release close, of the order's hook
judgments, host denials, dispatch rows, operator-message rows and gate index
(the fork's executor could not read the earlier target orders' journals on
2026-10-28; `plan failures` counts denials and interventions from the
current checkout's journals only, so a closed order contributes none).
Wall-clock: one directory move per close (milliseconds; WO-192's worktree
holds four journals of 368 KB; main's 242 journals of two months are 63 MB;
the gate captures that make a harness directory large keep their own
classes and do not move). Context bytes: this file. Commands: none new;
`harness prune` reports the class. Tokens: unknown until run. Steps: ten, including two added cleanup steps. The recovery path's before/after close cost is unknown until measured; it must retain WO-239's scoped census. The previous milliseconds estimate for journal movement is an estimate, not measured evidence.
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
**Amendment (2026-10-30):** operator item 8 in the
[planning pass](../planning/portable-config-assisted-2026-10-30.md) identifies
a cleanup defect on the same owned-root subsystem. The local WO-239 close
record shows six generated `.runtime/build-*` directories rejected because
the recorded device differed although ledger tokens and inodes matched.
Their verified removal and close retry succeeded; the cause of device drift
is unknown. Preserve journals, not build staging. No failed or closed report
is rewritten. The fork's item 6 confirms why journals are needed: WO-019's
close lost its session-level grant observations and any unrecorded timings.

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
retained session. Nothing is committed and no worktree is kept. Generated
build staging is disposed of through normal ownership checks or the narrowly
verified recovery below; a stale device binding does not turn builds into
operator material.

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
- **Live-run surfaces at the base.** The owned-root helper and the prune
  with its classes: exist (WO-233). The retained lane per order with the
  removal proof: exists (`worktree-removal.mjs`). The close record's
  cleanup rows: exist. A journal move: absent. A retained-lane read in
  either reader: absent.

The added cleanup design preserves the normal token/device/inode binding for
all ordinary deletion. A narrow build-staging recovery rechecks the exact
registered path, owner token, physical containment, current user, staging
shape, owner process birth/liveness and absence of an active writer/gate under
the teardown lock, then removes only proven regenerable staging without
following child symlinks. An unknown owner, unexpected file or raced identity
remains a concrete refusal; it never becomes an offer to save builds. Reject
ignoring device checks globally and reject moving all rejected roots to
scratch. Record the reason for retention separately from operator material.
No conclusion about why the operating system changed device identity is
required or claimed.

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
   Check: `npm test -- --only harness-fixtures`; `npm test -- --only
   fixture-temp-root`.
4. `scripts/lib/plan-failures.mjs` (750 to 770): read the retained lanes
   beside the checkout's directory, attribute rows to the lane's order,
   and report `retainedJournals` (lanes, files, unreadable). Check: `npm
   test -- --only plan-refutation`.
5. `scripts/harness.mjs usage` with `packages/skeleton/src/usage-observation.mjs`:
   a session digest found in a retained lane is read from there with
   `source` naming the lane. Check: `npm test -- --only harness-fixtures`.
6. `scripts/test-instance-history.mjs`: an updated instance's close moves
   its journals into the lane under the class. Check: `npm test -- --only
   instance-history`.
7. `packages/skeleton/src/temporary-root-records.mjs` with
   `scripts/lib/temporary-roots.mjs`, `scripts/lib/temporary-prune.mjs` and
   `scripts/lib/worktree-removal.mjs`: add the narrowly verified build-staging
   recovery above at close, using `scripts/build.mjs`'s actual staging shape.
   Keep ordinary owner binding strict and close discovery scoped. Check:
   `npm test -- --only fixture-temp-root` and `npm test -- --only release`.
8. `scripts/test-temporary-roots.mjs` and `scripts/test-release.sh`: reproduce
   the six-root device-only mismatch with dead owners and record a before
   control with the recovery disabled. Successful recovery removes builds and
   preserves journals/intake; changed inode/token, unknown or live owner,
   active gate, replacement race, symlinked root, unexpected operator file
   and foreign checkout refuse safely. A retry is idempotent. Measure close
   costs before/after, including the refusal path. Check the same two suites.
9. Write-backs: product 07 §Workflow closeout and releases (what moves,
   what stays, the lane, the class and the seed; build staging is disposable
   and an ownership refusal triggers bounded diagnosis, not a preservation offer; that the lane is ignored
   local material); `scripts/kit/README.client.md` §Owned cleanup and
   retention (the key and the seed); `docs/evidence/WO-237/decisions.md`;
   `npm run meta`; `node scripts/lineage.mjs index --check`; `npm run
   publication:check`.
10. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-237/handoff.md`; `npm run
   test:docs` once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the class, its seed and template; the move inside the
close with its record field; the prune's judgment of the lane; the two
readers extended; the bounded build-staging recovery and refusal diagnostics;
the cases and paired controls; the write-backs.

**Acceptance criteria (all required)**

1. `DEFAULT_RETENTION`, `docs/control/budgets.json` and the kit template
   carry `closed-journal` with the seed of 720 hours; `readBudgets` admits
   it; an export made before this order passes `npm run meta` after an
   update and reads the default.
2. A fixture release close moves the listed entries of the worktree's
   harness directory into `docs/control/local/retained/<WO>/harness/` with
   an owner record of the class before the worktree is removed, leaves the
   capture directories behind, and records `journals: { lane, files, bytes
   }` on the cleanup row and in `release-close.json`; the paired control at
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
8. The close removes a registered generated build-staging root in the
   device-only mismatch fixture after the recovery checks in steps 7 and 8,
   records the verification and disposal, and never archives or offers that
   build output for preservation. Every unsafe/unknown case in step 8 remains
   refused without deletion; ordinary owner binding remains strict, close
   discovery stays scoped and the retry is idempotent. The paired control
   fails without the recovery and records both exits. Measured before/after
   close cost and the unknown cause of the original device change are stated.
9. `npm test`, `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only fixture-temp-root` and `npm test --
--only process-debt` for steps 1, 3, 7 and 8; `npm test -- --only launchpad` for
step 1; `npm test -- --only release` for steps 2, 7 and 8; `npm test -- --only
harness-fixtures` for steps 3 and 5; `npm test -- --only plan-refutation` for step
4; `npm test -- --only instance-history` for step 6; `npm test -- --only
configuration-root` for every script step; `npm run test:docs` when a
document changes; each under `node scripts/harness.mjs bounded --`; then
one `npm test -- --review` (07-execution-guide.md §Preflight before the
full gate).

**Evidence gate:** the cases and controls of criteria 1 to 8; the
deterministic re-mints of any edition the runtime sources stale; `npm test
-- --review` before `implementation-ready`, final review reusing the
passing complete row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 9 and criteria 7 and 8.

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
