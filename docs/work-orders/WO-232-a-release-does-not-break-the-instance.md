# WO-232 — A starter release does not break the instance that takes it: core's gate updates a committed fixture instance carrying the record shapes the fork's updates met (a closed order with a bound amendment and a later Workstream field, a workstream with closed self members, records moved into a target, a target order at a stand-in base) to the current kit and runs the kit's own checks on it; the amendment binding admits a leading Workstream field; the workstream check admits a closed member without one; a self member's cells read the launchpad's main; and the rule that a kit check admits what the previous release admitted is written where releases are (v0.98.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. A new product suite and committed
fixture, one admission in the plan gate's amendment binding, one admission
in the workstream check, one changed reading in the index, and one product
rule; no new command, event or state field. Assigned at activation under the
standing opt-out default.
**Cost:** adds, under `scripts/fixtures/instance-with-history/`, one Git
bundle of an exported instance with records plus its generator and shape
manifest; one product suite (`instance-history`, core-only) in
`scripts/test-runner.mjs` with its test file; in
`scripts/lib/plan-continuation.mjs`, the leading-field normalization in
`executionAmendmentSource`; in `scripts/lib/work-order-workstream.mjs`, the
closed-member admission with its advisory; in `scripts/work-orders.mjs`,
`readTargetFacts` reading a `self` member's base from the launchpad's base
branch; cases in `scripts/test-plan-refutation.mjs` and
`scripts/test-work-orders.mjs`; sentences in products 07 and 12, the
convention README and the kit seed; decisions. Removes the pattern the
operator named on 2026-10-25: four of the fork's six starter updates since
2026-10-19 blocked an update or left a gate red or a record damaged (the
Observed gap). Re-mints: none known; no edition names these files as a
source (a read of `scripts/lib/evidence-sources.mjs` and the harness
manifest at `0027d9c1`); the executor runs `npm run sync` and `node
scripts/harness.mjs check` before handoff and records the result.
Wall-clock: one more product suite per fresh gate, budgeted at the clone,
one kit update and four checks, which the executor measures and records
against the 328.6 s plain-gate median (`plan conditions`, 2026-10-24); the
generator runs on demand, never at the gate. Context bytes: this file,
about 27,000. Steps: 11.
**Nomination provenance:** the operator's mid-turn direction of
2026-10-25T00:04Z during the planning pass (ignored capture SHA-256
`40b671e9178bdef0bbdf809e2c442fbdccf1d8d09471290a5ce9675464bf22be`): it
is becoming routine for starter updates to break and block every downstream
consumer, and that is unacceptable; the fork's items 1 and 2 of 2026-10-24
(the same capture) are the two latest instances. Filed by the
[2026-10-25 pass](../planning/fork-returns-and-review-lint-2026-10-25.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition; the fork is the operator's own project, and this order
copies nothing from its record beyond order ids, commit ids, counts and
generic terms.
**Depends on:** WO-080 (closed, v0.96.0: the workstream convention, the
check and the index's self reading this order corrects), WO-226 (closed,
v0.90.0: `update --finish` and the export's carried runtime, which the
fixture's update exercises), WO-219 (closed, v0.94.0: the amendment reader
through the control binding, D061). No open order edits these files.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-080",
    "relation": "satisfied-by-close",
    "reason": "the workstream check, the Workstream field and the self member's index reading this order admits and corrects"
  },
  {
    "workOrderId": "WO-226",
    "relation": "satisfied-by-close",
    "reason": "the kit update the fixture instance takes at every fresh gate"
  },
  {
    "workOrderId": "WO-219",
    "relation": "reference-only",
    "reason": "D061's amendment reader is one of the field repairs the fixture's moved-record shape preserves"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Workflow closeout and releases
(the kit update paragraph at 1775 to 1792: "Generated control/planning
records and opted-in instance actions remain unchanged"; the
`kit.applyInstanceActions` sentence at 702), §Operator resume phrases (the
Workstream field at 766 to 770), §Operator-opened planning pass item 5
(instance requests and the Read before upgrading rule); product 12 §The
convention (238 to 246); `docs/workstreams/README.md` (the `self` sentence,
"its base is the launchpad HEAD observed at refresh"; the missing-field
sentence); `scripts/kit/workstream.template.md` 20 to 27;
`scripts/lib/work-order-workstream.mjs` (`parseWorkstreamDeclaration` 13 to
28; the member check 73 to 95, the refusal at 80 to 83);
`scripts/work-orders.mjs` (`readTargetFacts` 526 to 599, the `self` base at
559 to 560 reading `HEAD`, the integration reading 561 to 577);
`scripts/lib/plan-continuation.mjs` (`executionAmendmentSource` 291 to 311,
`executionAmendmentMatch` 313 to 340, the release-classification admission
at 761 to 785 as the precedent for an exact non-criterion admission);
`scripts/lib/plan-receipts.mjs` (`requireMatchedAmendments` 1414 to 1447,
`amendPlanOrder` 1451 to 1470 and its judged-horizon check);
`scripts/lib/plan-subject.mjs` 361 (the judged orders are the sequenced
entries, so a closed order leaves the horizon and its binding can only be
withdrawn); `scripts/launchpad.mjs` (`readKitActions` 1586 to 1650, the
three action kinds; `planInstanceActions` 1664 to 1830; the preview's
instance-actions note 2171 to 2195; `updateKit` 2009; `update --finish`
2085 to 2140); `scripts/test-launchpad-planning.mjs` (the fresh-instance
case at 222; "an instance exported at v0.81.0 takes this release by its
README's procedure" at 1865 to 2100, the archive, export and forge double);
`scripts/test-workstream-pilot.mjs` (the builders `start`, `resume`,
`close`, `mergeRecords` 106 to 170; the four demonstrations 323 to 416);
`scripts/test-workstream-index-fixture.mjs` (`createWorkstreamIndexFixture`
59); `scripts/lib/target-worktree-fixture.mjs` (the declared base and the
later commit 114 to 127); `scripts/test-runner.mjs` (the `launchpad`,
`workstream-pilot` and `launchpad-planning` rows 1043 to 1079 and their
core-only kit scope; `machinerySources` 134); `docs/final-reviews/WO-080/RELEASE-NOTES.md`
§Read before upgrading (the predicted refusal of the fork's WO-011 and
WO-012); `docs/evidence/WO-080/decisions.md` D015 (the self member's rule);
the fork's `docs/planning/standard-pass-v0-96-1-2026-10-24.md` §2 and the
four earlier update passes named in the Observed gap (read-only, on the
operator's machine).

**Objective:** A kit release meets an instance's accumulated records in
core's gate before an instance meets them in the field:

- **A fixture instance with history, committed.** Under
  `scripts/fixtures/instance-with-history/`, a Git bundle of an exported
  instance whose history holds the record shapes instances have reported
  refused or damaged, with a manifest naming each shape and the field report
  it stands for, and a generator that rebuilds the bundle with the current
  kit's commands on demand. The first shapes: (a) a closed order with a
  bound execution amendment whose text later gained a leading
  `**Workstream:**` line (the fork's WO-011 and WO-012, 2026-10-24); (b) a
  workstream document whose members are two closed `self` orders and one
  target member (the fork's interim WS-001); (c) an order whose decisions
  `target-records` moved into a target (the fork's WO-004 and WO-006, whose
  moved records failed the document check at v0.87.0 and the plan gate at
  v0.93.0); (d) a target order activated at a base its base branch has since
  passed (the fork's WO-013). The list grows by one shape for each field
  refusal an instance reports, the planning pass's duty.
- **The gate takes the release as an instance would.** A core-only product
  suite clones the bundle, applies the current kit with `launchpad export
  --update <dir> --apply` on an update branch, and runs the instance's own
  checks there: `npm run sync`, `npm run work-orders -- index --check`,
  `npm run plan -- check`, the document check, and `npm run work-orders --
  index` from that branch. A refusal fails the suite naming the check and
  the record; a `self` member read as anything but `current` fails it.
- **The amendment binding admits a leading field.** `executionAmendmentSource`
  normalizes away a leading `**Workstream:** WS-NNN` line the filed order
  lacked, so adding the field to a closed order after its amendment was
  bound leaves the binding matched and the plan gate green, with no
  withdrawal; any other changed byte fails as today.
- **The workstream check admits a closed member without the field.** A
  document member whose order is closed and declares no `**Workstream:**`
  line is admitted with one advisory naming the order and the field; an
  open member without it still refuses as today, and a declared field
  without a document, or a declaring order absent from the members, still
  refuses.
- **A self member's cells describe the member.** `readTargetFacts` reads a
  `self` member's base from the launchpad's `refs/heads/<baseBranch>`, never
  the running checkout's `HEAD`, so a refresh from any branch records the
  member `current`, stale `no`, and a planning or update branch carries no
  false mark into `main` (FUP-2811605b8e865d2d's rule).
- **The rule is written where releases are.** Product 07 states, in the kit
  update paragraph and the release notes convention, that a kit check added
  or tightened in a release admits the records the previous release
  admitted, or the release is held until it does; the fixture suite is that
  check; a Read before upgrading line never asks an instance to edit a
  closed record by hand.

**Observed gap (dated 2026-10-25 at `main` `0027d9c1`; the fork's record read on this machine, read-only):**

- Four of the fork's six starter updates since 2026-10-19 blocked the update
  or left a gate red or a record damaged. v0.87.0 (2026-10-20): the document
  check failed on `docs/evidence/WO-004/decisions.md: document is not a
  readable regular file`, because the release's `readDecisions` returned
  decisions `target-records` had moved into DotLn-Angular while the check
  still read the launchpad path; the update stayed a draft until v0.88.0
  carried the repair (the fork's 2026-10-20 and 2026-10-21 passes). v0.88.0
  and v0.93.0 (2026-10-21 to 2026-10-23): the document check failed on five
  lines of WO-006's close records and `plan check` failed with `execution
  amendment decision must be a contained regular file`, because
  `amendmentDecision` required a decisions file the same move had taken
  away; the fork's plan gate stayed red on `main` until v0.94.0 (WO-219
  D061; the fork's 2026-10-23 pass, §2 and §4). v0.96.0 (2026-10-24): `npm
  run sync` refused the index with `WS-001: WO-011 must declare
  **Workstream:** WS-001 in its order`, the refusal the release notes
  predicted and left to the instance; the one-line field made the plan gate
  refuse `unmatched execution amendment WO-011 row 1`, then `WO-012 row 3`,
  and the fork withdrew both bindings to merge (its 2026-10-24 second pass,
  §2; its request block, item 1). v0.96.1 (2026-10-24): the release filed to
  unblock WO-013 left the final-review lint on the activation base (WO-231).
  v0.85.0 and v0.94.0 needed no repair.
- Core's gate meets none of these records. Its instance cases export a fresh
  kit (`test-launchpad-planning.mjs` 222), replay the README's update
  procedure from a v0.81.0 export whose seeds are three files
  (`scripts/fixtures/legacy-v0.81.0`; the case at 1865), and build
  workstreams in a fresh pilot (`test-workstream-pilot.mjs`); no case holds
  a closed order with a bound amendment, a workstream document over closed
  members, a moved record or a target order at a stand-in base, so a check
  that refuses one of them passes every fresh core gate and meets the shape
  first in the fork, after the release.
- The amendment binding has no exit but withdrawal for a closed order.
  `requireMatchedAmendments` (1414 to 1447) compares the committed order at
  the receipt's revision with the current file through
  `executionAmendmentSource`, which normalizes only the release label (291
  to 311); a later judged receipt can absorb a change, but the judged orders
  are the sequenced entries (`plan-subject.mjs` 361) and a closed order
  leaves the sequence at the next pass, so `amend-order` refuses it
  ("requires an order in the current judged horizon", 1466 to 1470) and the
  gate's message offers "withdraw it explicitly or restore its approved
  bytes" (1445). A one-line metadata field therefore costs an operator's
  bound authorization its binding. The release-classification admission
  (761 to 785) is the precedent for admitting one exact non-criterion
  change.
- The workstream check refuses by name a member whose order declares no
  field (80 to 83), closed or open; the convention README and the kit seed
  say "A missing field refuses with the order id and field to add". For a
  closed order the field can change nothing about scope, and the document
  already names the member.
- `readTargetFacts` reads a `self` member's base as `commit(clone, "HEAD")`
  (559 to 560) and its target as `refs/heads/<baseBranch>`; from a branch
  one commit past `main` the member reads `diverged`, stale `yes` (the
  fork's item 2; WO-080-D015, deferred as FUP-2811605b8e865d2d to the next
  order that edits `readTargetFacts`). `index --check` reuses the recorded
  facts, so a pass that regenerates after its first commit carries the mark
  into `main` at merge; the convention README's `self` sentence states the
  checkout-dependent reading as the rule.
- The kit's instance actions (`readKitActions` 1586 to 1650) know three
  kinds, `rename-root`, `add-config-field` and `change-phrase`, all on kit
  configuration and roots; none edits an instance's records, and product 07
  says they remain unchanged (1778). The preview prints "No instance
  actions declared." for every release the fork took.

**Design (scope discipline):**

- A committed bundle, generated on demand. The suite clones a bundle and
  updates it; it does not build the previous release's kit and replay
  lifecycles at every gate. Rejected: generating the instance from the
  previous tag at gate time, as the v0.81.0 case archives and exports
  (axis: gate wall-clock; four lifecycles with target records cost minutes
  per gate, and the `target-worktree` task already holds its reopening
  condition at 611 s). An older bundle taking a newer kit is the stricter
  test, which is what the fork did from v0.94.0 to v0.96.1; the generator
  reruns when the shape list grows, and the bundle's bytes are recorded in
  the decisions. The executor chooses the bundle's content (the records and
  manifest with the kit files, or the records alone with the kit applied on
  top) and records the choice with the bundle's size.
- Admit, do not migrate records. A kit check that would refuse a record the
  previous release admitted admits it (with an advisory where the record is
  short of the new rule), rather than the kit editing the instance's
  records. Rejected: a new instance action kind that adds the Workstream
  field to member orders (axis: the kit's write authority over an
  instance's own documents; product 07 holds generated records and records
  outside opted-in actions unchanged, and the operator's record is the
  instance's). Recorded as a candidate with its reopening condition in the
  planning map.
- The leading field is the one admission. Only a leading `**Workstream:**
  WS-NNN` line the filed order lacked is normalized away; a changed
  criterion, objective, dependency block or any other byte still fails, and
  `amend-order` keeps its horizon rule. Rejected: admitting every leading
  metadata field (axis: `**Repository:**` and `**Effort:**` change what an
  order binds; the Workstream field changes only grouping).
- Closed members are admitted by the document. For a closed order the
  document is the authority for membership and the field adds nothing a
  gate can act on; the advisory keeps the mirror visible. Rejected:
  admitting an open member without the field (axis: an open order's
  membership drives the index's stale mark and the board; the field is the
  declaration).
- A self member sits on the base branch. A launchpad order branches from
  `main` and integrates it; its honest base is the base branch's tip, so
  the cells read `current` wherever the refresh runs. Rejected: reading the
  activation base from the control log (axis: every closed self member
  would read `behind` forever, which says nothing an operator can act on).
- The rule has teeth in the gate, not in prose. Product 07's sentence names
  the suite as the check; a release that needs a record change an admission
  cannot give is held until the pass that files it decides the migration.

**Deliverables:** the bundle, manifest and generator; the suite and its
runner row; the amendment admission; the closed-member admission; the self
member's reading; the convention, kit-seed, product 07 and product 12
sentences; `docs/evidence/WO-232/README.md`, `controls.json` and
`decisions.md`.

**Acceptance criteria (all required)**

1. `scripts/fixtures/instance-with-history/` holds a Git bundle, a manifest
   naming each shape and the field report it stands for, and a generator
   (`generate.mjs`) that rebuilds the bundle with the current kit's
   commands; the bundle's history holds at least shapes (a) to (d) of the
   Objective, each verifiable from the clone by one named command recorded
   in `docs/evidence/WO-232/README.md` (the amendment event and the field;
   the workstream document and its closed members; the moved decisions'
   binding; the target order's base behind its base branch).
2. A core-only product suite `instance-history` in `scripts/test-runner.mjs`
   clones the bundle, applies the current kit on an update branch with
   `launchpad export --update <dir> --apply`, and in the instance runs `npm
   run sync`, `npm run work-orders -- index --check`, `npm run plan --
   check`, the document check and `npm run work-orders -- index` from the
   update branch; it passes at handoff, and a refusal fails it naming the
   check and the record. The paired control: the same suite at the base
   fails on `unmatched execution amendment` for shape (a) and records the
   self members `diverged`; both arms' exit codes in
   `docs/evidence/WO-232/controls.json`. The suite's fresh-gate wall-clock
   is recorded in the decisions.
3. `requireMatchedAmendments` admits a leading `**Workstream:** WS-NNN` line
   added to an order after its amendment was bound and the filed order
   lacked it; a changed criterion, objective, dependency block or Cost line
   on the same order still fails naming the order; `amend-order` on an order
   outside the current judged horizon still refuses. Cases in
   `scripts/test-plan-refutation.mjs`.
4. `readWorkstreams` admits a closed member whose order declares no
   `**Workstream:**` line with one advisory naming the order and the field,
   and still refuses an open member without it, a declared field without a
   document, and a declaring order absent from the members. Cases in
   `scripts/test-work-orders.mjs`.
5. `readTargetFacts` reads a `self` member's base from the launchpad's
   `refs/heads/<baseBranch>`: `npm run work-orders -- index` run from a
   branch one commit past `main` records the member `current`, stale `no`,
   with the base equal to `main`'s tip; the paired control at the base
   records `diverged`, stale `yes`; the convention README, the kit seed,
   product 07 (766 to 770) and product 12 (238 to 246) state the reading.
   FUP-2811605b8e865d2d is settled by this case.
6. Product 07's kit update paragraph (§Workflow closeout and releases, 1775
   to 1792) states the rule: a kit check added or tightened in a release
   admits the records the previous release admitted or the release is held
   until it does, the `instance-history` suite is that check, and a Read
   before upgrading line never asks an instance to edit a closed record by
   hand; `npm run publication:check`, `npm run test:docs` and `npm test --
   --review` pass at handoff.
7. This order's own Read before upgrading names the self member's changed
   reading, the two admissions and the suite, and asks no record edit of
   any instance.

**Preflight:** `npm test -- --only plan-refutation` for step 5; `npm test --
--only work-orders-fixtures` and `npm test -- --only index` for steps 6 and
7; `npm test -- --only launchpad` and `npm test -- --only launchpad-planning`
for steps 2 to 4 and 8, and the new `instance-history` row by its own `--only`
token once step 4 declares it (the index check resolves tokens against the
checkout, so the new row is named here in prose and in step 4); `npm test --
--only configuration-root` for every script step; `npm run test:docs` when a
document changes; each under `node scripts/harness.mjs bounded --` for the
steps that edit their declared sources; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Execution plan (the executor follows these steps in order; observed at `0027d9c1`, 2026-10-25):**

1. `docs/evidence/WO-232/README.md` (new): record the four field reports the
   shapes stand for, from the fork's passes named in the Observed gap, and
   the base measurement of criterion 2's control once the bundle exists.
2. `scripts/fixtures/instance-with-history/generate.mjs` (new): export the
   current kit into scratch (as `test-launchpad-planning.mjs` 222 and
   `test-workstream-pilot.mjs` 106 to 170 do), build shapes (a) to (d) with
   the kit's own commands (activate, amend through `amend-order` with a
   recorded decision, close, a workstream document over closed `self`
   members and a target member, `target-records` into a target, a target
   order at a declared base the target's `main` then passes), add the
   Workstream field to the closed amended order after the binding, commit,
   and write the bundle and `manifest.json`; the generator refuses to run
   inside a gate.
3. `scripts/fixtures/instance-with-history/instance.bundle` and
   `manifest.json` (new): the generator's output, committed.
4. `scripts/test-instance-history.mjs` (new) and the `instance-history` row
   in `scripts/test-runner.mjs` (core-only, product, with the `launchpad`
   row's kit scope and build settings): clone, update, the five checks of
   criterion 2, the failure naming.
5. `scripts/lib/plan-continuation.mjs`: `executionAmendmentSource` normalizes
   the leading field as criterion 3 says; `scripts/test-plan-refutation.mjs`:
   the cases of criterion 3.
6. `scripts/lib/work-order-workstream.mjs`: the closed-member admission and
   advisory of criterion 4 (`readWorkstreams` 73 to 95, with the orders'
   phases supplied by the caller as the index already reads them);
   `scripts/test-work-orders.mjs`: the cases.
7. `scripts/work-orders.mjs`: `readTargetFacts` reads the `self` base from
   `refs/heads/<baseBranch>` (559 to 560); `scripts/test-work-orders.mjs`:
   the branch case and its paired control, recorded in `controls.json`.
8. Run the suite at the base with steps 5 to 7 reverted (the control of
   criterion 2) and at the head; record both in `controls.json`.
9. `docs/workstreams/README.md`, `scripts/kit/workstream.template.md`,
   product 07 (766 to 770 and 1775 to 1792) and product 12 (238 to 246):
   the sentences of criteria 5 and 6; `npm run publication:check`.
10. `docs/evidence/WO-232/decisions.md`: the bundle's content and bytes, the
    suite's wall-clock, the admit-not-migrate decision, the shapes' field
    reports.
11. `npm run sync`, `node scripts/harness.mjs check`, `npm run meta`, `npm
    run test:docs`, `npm test -- --review`; handoff.

**Evidence gate:** the Preflight suites; the paired controls of steps 7 and
8 recorded in `docs/evidence/WO-232/controls.json`; `npm run test:docs`;
`npm test -- --review`. No live model run and no publish against a real
forge: the fixture forge stands in, as it does for the v0.81.0 case.

**Write-back duty:** criteria 5 and 6 and step 9.

**Known issues and carry-ins:**

- FUP-2811605b8e865d2d (WO-080-D015): allocated here; settled by criterion
  5's case.
- The bundle is one past state; a shape an instance reports after this order
  closes is the next planning pass's row and the generator's rerun. Reopen
  when an instance reports a refusal on a record shape the manifest lacks.
- Product 12 measures 27,447 bytes against a 27,463-byte ceiling at filing;
  the planning pass of 2026-10-25 resets the ceiling to the measured bytes
  plus one tenth so the write-back fits (ceilings are planning's alone).
- A kit action that edits instance records is declined (the Design); reopen
  when a release needs a record field no admission can grandfather.

**Non-goals:** a new instance action kind or any kit write to an instance's
records; grandfathering an open member without the field; rebinding or
rewriting any amendment event; a change to the sequence rule that closed
orders leave the judged horizon; building the previous release's kit at
gate time; the final-review lint (WO-231).

**Operator-review assumptions**

1. An instance's records are its own; a release that cannot read them is
   held in core, not repaired downstream.
2. The gate pays one more product suite per fresh run; the executor records
   its wall-clock and the planner reads it against the plain-gate median.
3. The fork's withdrawn amendments of 2026-10-24 stand as its record; this
   order asks the fork to change nothing.
