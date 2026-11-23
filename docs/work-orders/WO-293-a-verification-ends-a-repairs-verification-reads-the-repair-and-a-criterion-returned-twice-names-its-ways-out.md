# WO-293 — A verification ends: a repair's verification reads the repair, and a criterion returned twice names its ways out (version assigned at activation)

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-288",
    "relation": "satisfied-by-close",
    "reason": "its Part A and its frame change the verifier's and the reviewer's roots, which this order's steps are written against"
  }
]
<!-- dotln-dependencies:end -->

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. The verifier's own steps tell a
verification that follows a repair what to read, and its briefing gives it
the findings and the changed paths as data; a pass recorded by a session
that met refusals says so; a criterion that claims something of every
member of a set it does not list has a defect class; a criterion returned
by two verifications names the ways out the kit already has; a final
review fails on a blocking defect and does not become a repair; and the
criteria advisory reads two more kinds of wording. No refusal is added, in
core or in an instance: one advisory is added to the recording of a pass.
Assigned at activation under the standing opt-out default.
**Cost:** adds three sentences to the verifier's root and one to the
reviewer's, two blocks to the verify briefing, one line to the fix
briefing, one advisory, one defect class, seven advisory phrases and about
twelve cases. Removes the whole-change reading from every verification
after the first: WO-288's eleven verifications each read all of its
changed paths, 8 h 22 min and about 336 million tokens in sum by its
record, and its ten repairs took 48 h 6 min.
`packages/skeleton/src/loadouts/contributor.ts` is a registered evidence
source: the editions it stales are re-minted with `npm run sync`. No file
of `FEEDBACK_SOURCE_PATHS` is edited. The reviewer's and the planner's roots
stand 75 and 12 bytes under their accepted cold-start ceilings, so the
executor records each changed root's bytes before and after and removes
at least what it adds; a root that still passes its ceiling is named in
the handoff with its measure, and the standing route for a cold-start
acceptance applies. One complete review run at handoff.
Wall-clock, tokens and steps of this order are unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-23,
item 5 and its first message on the order then in progress (ignored
captures SHA-256
`0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270` and
`5d6bd373661f0b7225d59bf50243082a74c5df390ce3110c26c0f4815e63b433`).
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#why-wo-288-did-not-converge)
reads WO-288's record, with
[the study of its eleven verifications](../planning/passes/the-kit-keeps-working-2026-11-23-wo-288-loop-study.md),
[the census of criteria that ended unmet](../planning/passes/the-kit-keeps-working-2026-11-23-criteria-census.md)
and
[the critic of the critics](../planning/passes/the-kit-keeps-working-2026-11-23-critic-of-the-critics.md),
whose first and fourth recommendations this order carries.
**Depends on:** WO-288 (its Part A and its frame change the verifier's and
the reviewer's roots, which this order's steps are written against as
WO-288 leaves them).
**Recommended placement:** fifth. Its planning half, the screens a pass
applies before it files, is in force from the planning pass that filed it.

**Objective:** A repair loop ends when the criteria hold. The verification
that follows a repair reproduces what the last one found and reads what the
repair changed, and does not sweep the whole change again. A verifier that
could not run a criterion's check does not call the criterion met. A
criterion no reading can settle is recorded as such by the verifier, at its
own authority, the second time it comes back, and the repairing session is
told which ways out exist. A final review that finds a blocking defect
hands it back at the cost of one report.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- The rule exists and the role does not carry it. Product 07, "Verification
  review and attack", says that a re-verification re-derives the criteria
  whose surfaces the repair's diff touches, reproduces the repaired
  findings and carries untouched claims, "so a repair loop ends when the
  criteria hold". The verifier's emitted step 2
  (`packages/skeleton/src/loadouts/contributor.ts`, the verifier's steps)
  says at every dispatch: "attack each criterion with your own probes,
  review the implementation". A search of the emitted verifier root for
  re-verification, the repair's diff or untouched claims finds nothing.
- The queue form says the opposite. Its ninth rule (product 07, "The queue
  form", and each order of the form) has the verifier read "with one worker
  for each part and one for what the parts share, and then" send "workers
  over whatever files those left unread", with no exception for a
  verification after a repair. WO-288's eleventh verification used ten
  readers over all 726 changed paths. The planning pass corrects the rule's
  text; the role's steps are this order's.
- WO-288 by its record: eleven verifications, 76 blocking findings, per
  round 16, 13, 7, 3, 5, 9, 4, 4, 3, 5, 7, with no fall after the fourth.
  Criterion 23 failed in ten of them at a new site each time, criterion 34
  in eight at a new state each time, and sixteen findings were regressions
  a repair introduced. Two of its own reports say a judgment of the handoff
  alone would have passed all 41 criteria. No waiver, defect record or
  amendment was used; a defect record was proposed and declined four times
  because none of the five classes fits a property claimed of every site.
- A pass needs no check to have run. `verification-result pass` in
  `scripts/resume.mjs` compares the report with the control log through
  `judgeReport` in `scripts/lib/off-ramps.mjs`, which refuses an unmet
  criterion without a waiver or a defect and requires a line for each
  standing defect record. It does not read the session's refused calls, and
  an instance's verification passed from a lane whose own report said it
  could not run the order's named checks
  ([the check](../planning/passes/the-kit-keeps-working-2026-11-23-instance-claims-check.md),
  claim 4).
- The briefing of a repair shows which criteria are unmet
  (`renderCriteriaStatus` in `scripts/lib/criteria-status.mjs`) and not how
  often each has come back, and names no way out but another repair.
- The reviewer's step 4 (`contributor.ts`, the reviewer's steps) ends
  "Otherwise finish substantive fixes". WO-287's final review repaired
  eight defects in the review, on the review's model and budget, and the
  operator's correction is WO-287-D091, an untriaged register row
  (FUP-67b1b6cf60bba81f).
- The criteria advisory (`criteriaAdvisories` in `scripts/work-orders.mjs`)
  reads figures with digits and a list of words. It printed nothing for
  WO-288's criterion 27, whose figure is the word "half", nor for WO-287's
  criterion 4, which held that existing cases "pass unchanged" while
  another criterion changed the text one of them pins.

**Design (scope discipline):**

- **The verifier's step says which verification this is.** A first
  verification attacks each criterion, as today. A verification after a
  repair reproduces each blocking finding of the latest report, re-derives
  the criteria whose surfaces the repair changed and carries the others
  with the evidence they had. The rule bounds what it looks for and not what counts: a defect it
  meets outside those that breaks no criterion is a follow-up, and one
  that shows a criterion unmet, or that the change breaks on a supported
  input something `main` did, blocks as at a first verification. An order in parts is read with a reader for
  each part at its first verification and at its final review.
- **The briefing gives the scope as data.** For a verification after a
  repair it prints the latest report's blocking findings, each with its
  basis and its reproduction's path, and the paths that differ between the
  checkpoint that report judged and the one now handed over. Where a checkpoint cannot be read it says `unavailable` and names the ref,
  and the verification then reads every criterion as a first one does.
- **A check that did not run is not a pass.** The verifier's rules say so:
  its criterion is unmet, with the refusal as evidence, or defective where
  no candidate could have run it. When a session that records a pass met a
  guard's refusal or a host's denial, the recording prints one advisory
  with the count and the stops' ids and records the verdict.
- **A sixth class, `open-set`.** A criterion that claims a property of
  every member of a set, and names neither the members nor a check that
  fails closed on a member it cannot place, is judged on the members its
  named cases and lists cover. The verifier records it with
  `npm run resume -- defect <criterion> --class open-set`, and a member
  found later is a follow-up with its reproduction.
- **The second return names the ways out.** The fix briefing's criteria
  line shows how many verifications have returned each criterion. At two it
  names the routes: a defect record, which is the verifier's or the
  reviewer's to make; and a cut of the part or an amendment of the
  criterion, which are the operator's word.
- **A final review fails on what it finds.** A blocking defect the
  reviewer's own reading reproduces fails the review and goes to a repair
  dispatch, unless its fix is one bounded edit with its case.
- **Two more readings of the advisory.** A figure in words and a pin of an
  existing test each print the advisory line, from a closed list of
  phrases.

Rejected:

- *Refusing a pass whose session met a refusal.* It differs on whether the
  recording command stops. A refusal there is often beside the point of
  every criterion, and a stop that guards the kit's record advises in an
  instance in any case; the sentence in the verifier's rules is what
  changes the verdict.
- *A cap on the number of verifications.* It differs on what ends the loop,
  a count or the criteria. The drive already stops at three failures, and a
  count would have ended WO-288 with its fix for an instance unshipped.
- *An advisory for every universal word* ("every", "each", "no"). It
  differs on precision: 46% of the criteria of the last eight orders hold
  one, so the line would print for nearly half of all criteria and be read
  by no one. The planning screen and the defect class carry it.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** The plan is to be read against WO-288's merged text, which moves the lines of `contributor.ts` this plan names. A step's check is
one case run under `node scripts/harness.mjs bounded -- node --test
--test-name-pattern`; no suite runs alone before the order's one complete
run except to reproduce a failure that run names.

1. `packages/skeleton/src/loadouts/contributor.ts`, the verifier's steps
   and rules: step 2 as the Design's first bullet says, and the sentence on
   a check that did not run. Check: a case in `scripts/test-harness.mjs`
   that reads the emitted verifier root.
2. `contributor.ts`, the reviewer's step 4: as the Design says. Check: the
   same file's case for the reviewer's root.
3. `scripts/lib/control.mjs`, `DEFECT_CLASSES`: add `open-set`; the usage
   line of `defect` in `scripts/resume.mjs` follows it. Then `contributor.ts`, the shared rule that names the classes, for every
   role that carries it, and the planner's procedure line that screens
   criteria against them. Check: a case in `scripts/test-resume.sh`'s fixture
   that records a defect of the class and reads the projection.
4. `scripts/resume.mjs`, the verify briefing: for an order whose log holds
   a failed verification and a completed repair after it, print the two
   blocks of the Design's second bullet, the findings read with
   `readFindingsBlock` and the paths with a diff of the two events'
   `checkpointRef`. Check: a case in `scripts/test-resume.sh`'s fixture.
5. `scripts/resume.mjs`, `verification-result` and `final-review-result`:
   on a pass, read the recording session's refused calls as
   `phaseSessionReadback` reads them and print the advisory. Check: a case
   in `scripts/test-harness.mjs` with a journal that holds one refusal.
6. `scripts/lib/criteria-status.mjs`, `renderCriteriaStatus`: count, for
   each criterion, the verifications whose report judged it unmet or named
   it as a blocking finding's basis, and at two add the routes. Check: a
   case beside the renderer's existing ones.
7. `scripts/work-orders.mjs`, `criteriaAdvisories`: the phrases
   `pass unchanged`, `as before`, `as today`, `half`, `twice`, `double` and
   `percent`. Check: a case in `scripts/test-work-orders.sh`'s fixture for
   one phrase of each kind.
8. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`.
9. Write-backs: `docs/product/07-execution-guide.md`, "Verification review
   and attack" (the sixth class beside the five; the advisory at a pass;
   that the role now carries the re-verification rule), "Operator-opened
   planning pass" (the class list of the screens and the advisory's
   phrases) and "Operator recovery controls" (the `defect` command's
   classes); `docs/KIT.md`, "A criterion nothing can meet, waivers and
   retractions" (the sixth class).
10. The handoff sequence of §Discipline.

**Deliverables:** the verifier's and the reviewer's steps; the class; the
two briefing blocks; the advisory at a pass; the criteria line; the
advisory's phrases; the cases; the write-backs.

**Acceptance criteria (all required)**

1. The emitted verifier's root tells a verification that follows a repair
   to reproduce the latest report's blocking findings, to re-derive the
   criteria whose surfaces the repair changed, and to carry each other
   criterion with its evidence unless it observes that criterion unmet; and
   to read every criterion where its briefing gives no changed paths
   (`npm test -- --only harness-fixtures`).
2. For a fixture order with a failed verification and a completed repair,
   the verify briefing prints that report's blocking findings, each with
   its basis and reproduction path, and the paths that differ between the
   two checkpoints (`npm test -- --only resume`).
3. The emitted verifier's root says that a criterion whose named check did
   not run is unmet, or defective where no candidate could have run it
   (`npm test -- --only harness-fixtures`).
4. `npm run resume -- verification-result pass`, run by a session whose
   journal holds a guard's refusal, prints one advisory with the count and
   the stop's id and records the verdict
   (`npm test -- --only harness-fixtures`).
5. `npm run resume -- defect <criterion> --class open-set --evidence <text>`
   records the defect, and the order's status shows the criterion as
   defective of that class (`npm test -- --only resume`).
6. For a fixture order whose log holds two failed verifications that each
   judged criterion 3 unmet, the fix briefing's criteria line shows the
   count for criterion 3 and names the defect record, the cut of a part and
   the amendment as its routes (`npm test -- --only resume`).
7. The emitted reviewer's root has a final review fail on a blocking defect
   its own reading reproduces, unless the fix is one bounded edit with its
   case (`npm test -- --only harness-fixtures`).
8. `npm run work-orders -- index --check` prints a `criteria advisory` line
   for an open order's criterion that holds any of `pass unchanged`,
   `as before`, `as today`, `half`, `twice`, `double` or `percent`
   (`npm test -- --only work-orders-fixtures`).
9. Each of these five places lists six defect classes, `open-set` among
   them: the emitted planner's root, the emitted verifier's root, the
   emitted reviewer's root, the usage line of `npm run resume -- defect`,
   and product 07 under "Verification review and attack"
   (`npm test -- --only harness-fixtures`; `npm run test:docs`).
10. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`,
`npm test -- --only resume`, `npm test -- --only work-orders-fixtures`,
`npm test -- --only plan-refutation`, `npm test -- --only instance-history`,
`npm test -- --only skeleton`.

**Evidence gate:** under `docs/evidence/WO-293/`: the decisions, with the
two briefings' output for criterion 2's and criterion 6's fixtures; the
handoff.

**Write-back duty:** as step 9 lists. The release's Read before upgrading
says that a verifier's dispatch after a repair now reads the repair, and
names the sixth class.

**Known issues and carry-ins:**

- A verification after a repair carries a criterion whose surfaces the repair did not touch, so a regression that reaches it through a module several parts share passes on carried evidence, and the complete run is what guards it. Sixteen of WO-288's findings were of that kind. Reopen: a final review or a later verification finds unmet a criterion that the verification before it carried, where the repair's diff did not touch that criterion's named surface.
- The `open-set` class lets an order close without a property claimed of every site. It is recorded and visible, and it is also the shortest way out of a long loop. Reopen: an order closes with such a record and a later order or review lists the sites and finds the property false at one of them.
- Named boy-scout item, beside step 6's file:
  `npm run plan -- failures` refuses with "one failure item exceeds the
  planning page budget" at `bc761ad9c`, where its largest item is 242
  bytes: the page's own summary blocks have outgrown the 8,192 bytes that
  `bounded` in `scripts/lib/planning-followups.mjs` allows, so the command
  every planning pass reads first prints nothing and only its `--export`
  form works. Page the summary, or print its counts and name the export.
- Named boy-scout item, same command family: no command prints the current
  session's operator-message rows (when recorded, bytes, digest and class),
  which a pass needs for its capture table and for a rule it records; this
  pass read the journal by hand (FUP-a3866623326095c5, item 2).
- Criteria an operator's direction adds during execution are read by the
  index check's advisory like any active order's, and by no planning
  screen. The executor's sentence for that is not in this order.
- The register rows this order settles: FUP-67b1b6cf60bba81f
  (WO-287-D091); item 2 of FUP-a3866623326095c5 if the second boy-scout
  item is done.

**Non-goals:** a count that ends a repair loop; a refusal of any verdict;
what makes a finding blocking, which product 07 states and this order does
not change; the critic's charter, cadence and register rows, which are
WO-288's Part A; the planning screens themselves, which the pass that
filed this order wrote; the review ladder's size.

**Operator-review assumptions:** the verifier may record an `open-set`
defect at its own authority, as it records the five; and a final review
that reproduces a blocking defect fails back to a repair even when the fix
looks small, one bounded edit excepted.
