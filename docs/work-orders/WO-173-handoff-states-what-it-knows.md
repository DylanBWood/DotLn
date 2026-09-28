# WO-173 — A handoff states what it knows: the executor judges every criterion on one line before it hands off, a criterion it records met needs its named gate's passing row, a criterion it records unmet is shown to the operator and the judge at the next dispatch, a gate that already passed at the same code identity is not run again, and the resident's lock matrix gives each cell its own deadline (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. The two executor completions read one
report file and one gate row they did not read before and refuse a claim
the record contradicts; an unmet criterion is always admitted with its
reason, so no handoff is refused for a red gate. No control-event type,
verdict rule, off-ramp phase or gate step changes. Assigned at activation
under the standing opt-out default.
**Cost:** adds one file per order, `docs/evidence/WO-NNN/handoff.md`,
holding one criterion line per acceptance criterion in the forms the
verification report already uses; a check of that file at
`implementation-ready` and `repair-complete`; one run of the document
gate inside those two completions when a criterion recorded met names it
(12.8 s on the operator's host, measured 2026-09-28); one lookup of the
product gate's row at the current code identity; the unmet lines in the
completion event, in `resume status` and in the `verify` and
`final-review` briefings; a notice and an exit in `npm test` when the
same selection already passed at the same code identity, with `--again`
to run it; three sentences in the `fix`, `verify` and `final-review`
briefings; eight subtests where the resident's lock matrix is one; one
reworded completion advisory; one reworded sentence of role text.
Removes, by the record of 96 failed judgments read on 2026-09-28: the 24
whose every blocking finding an existing check would have shown before
handoff and the 13 handed off with a gap the executor had already
recorded, 27 judgments together and 25.2 h of judging and repair (12 of
the 33 judgments failed since 2026-09-22); the repeat of a gate a role
had already passed at the same code identity (344 s and 312.54 s
recorded by two verifiers, one run stopped by the operator); a deadline
that cancelled the lock matrix at two final reviews, each rerun
passing, and on which the retry of a third final review failed; 60 of
the 123 register dispositions seven final reviews wrote, each
re-deferring a row whose seam the change did not open; a completion
advisory that
says the document gate is missing whenever a report was written after
the gate ran. Re-mints: deterministic, the
authority, feedback and harness editions that
`packages/skeleton/src/loadouts/contributor.ts` stales and the
regenerated bundle; the feedback edition by carry, since that file is
not among the sources the feedback verifier judges; no live episode.
Wall-clock, tokens and context bytes of the order itself are unknown
until run.
**Nomination provenance:** the operator's 2026-09-28 direction during the
planning pass (the recorded failures to be addressed), captured in
ignored intake (SHA-256 in the ledger section); this pass's reading of
the 96 failed reports
([planning document](../planning/failures-across-phases-2026-09-28.md)
§5 and §7; [inventory](../planning/failure-inventory-2026-09-28.md));
the operator's corrections recorded as WO-162-D013, WO-163-D019 and
WO-163-D021; register rows FUP-1d57cbcb226d8f8a (WO-159 D020),
FUP-756224e6e2cbf35a (WO-163 D021), FUP-5a03cc13047c1dc4 (WO-169
D002) and FUP-b1163d128e371b7f (WO-169 D007). Planner-synthesized.
Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-167 merged (product 07 holds 9 bytes of headroom until
the fold resets its ceiling); WO-158 merged (the criterion line forms
and the waiver this order shows; closed, v0.49.0); WO-169 merged (the
completion advisory this order rewords; closed, v0.52.4); WO-166 merged
(the last order to edit the completions; closed, v0.52.3).
**Recommended placement:** paired with WO-116 in the second slot, after
WO-060 and WO-167. This order edits `scripts/resume.mjs`,
`scripts/lib/lifecycle-evidence.mjs`, `scripts/test-runner.mjs`,
`packages/skeleton/src/loadouts/contributor.ts`,
`packages/skeleton/test/resident.test.ts`, their fixtures,
`docs/planning/followups.md` and two sections of product 07; WO-116
edits `packages/skeleton/src/console-commands.ts`, `packages/console`
and product 09. Disjoint files; neither depends on the other; WO-116
edits no registered source, so only this order re-mints. WO-172 follows
it because both write one sentence into product 07. A recommendation,
not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "product 07 has 9 bytes of headroom until the fold resets its ceiling"
  },
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the criterion line forms and the waiver"
  },
  {
    "workOrderId": "WO-169",
    "relation": "satisfied-by-close",
    "reason": "the completion advisory this order rewords"
  },
  {
    "workOrderId": "WO-166",
    "relation": "satisfied-by-close",
    "reason": "the last order to edit the completion commands"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§5, §7, §10 and §13; `scripts/resume.mjs` (`implementation-ready`,
`repair-complete`, `verify`, `final-review`, `fix`, the status
projection, `declaredCriteria`); `scripts/lib/lifecycle-evidence.mjs`
(`requireLifecycleEvidence`); `scripts/lib/off-ramps.mjs`
(`criterionJudgments`, `criterionLineForms`);
`packages/skeleton/src/gate-evidence.mjs` (`findGateCheck`,
`gateCodeIdentity`, `readGateChecks`; read, not edited);
`scripts/test-runner.mjs` (the selection, `changedMachinery`, the
recorded row); `packages/skeleton/src/loadouts/contributor.ts` (the
paragraph that begins "Run checks that establish the work order's
claims"); `packages/skeleton/test/resident.test.ts` (the WO-143 matrix
test); `docs/planning/machinery-stand-down-2026-09-15.md` §4 and §8;
`docs/evidence/WO-162/decisions.md` D013;
`docs/evidence/WO-163/decisions.md` D019 to D021;
`docs/evidence/WO-159/decisions.md` D020;
`docs/evidence/WO-168/decisions.md` D013; `docs/planning/followups.md`;
07-execution-guide.md §Retained planning follow-ups and §Discipline.

**Objective:** when an executor hands work to a judge, the record says
for every acceptance criterion whether the executor holds it met and on
what, or unmet and why; a claim of met that names a gate stands on that
gate's passing row; the operator and the judge see an unmet criterion
at the next dispatch, while a waiver or an amendment can still spare
the cycle; nobody pays twice for the same gate at the same code; and
the lock matrix stops failing reviews for another lane's load.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`):**

- `implementation-ready` and `repair-complete` require no report. They
  run `git diff --check`, print advisories and append. The last six
  closed orders filed their executor reports under four names
  (`implementation.md`, `README.md`, `repair.md`,
  `repair-final-001.md`), and one filed none for its implementation.
- Of 184 blocking findings in 96 failed reports, an existing check
  would have shown 58 before handoff: re-reading the criterion list 17,
  running the criterion's own command 12, `npm run test:docs` 10,
  `npm test` 6, the review selection 6, the publication or release
  surface check 5, two others. In 24 reports that holds for every
  blocking finding.
- In 13 reports the executor had recorded the gap in its own decisions
  and handed off (WO-090, WO-152, WO-149, WO-138, WO-156, WO-111
  VER-002, WO-153, WO-164, WO-168, WO-163, WO-162, WO-115 VER-002,
  WO-121); nine of the 13 since 2026-09-22. Three ended in an operator
  waiver (WO-163), amendment (WO-162) or accepted deviation (WO-111)
  after the failed cycle, and two repairs needed an operator scope
  expansion (WO-153, WO-156).
- The completion advisory reads the document gate's row by tree hash,
  which every report write changes. WO-171's `RepairCompleted` carries
  "missing" 44 s after a passing document gate at another tree hash,
  and WO-164's first one 37 s after; WO-164's second completion, at the
  tree hash the gate had judged, carries none.
- The rolling index of the last 256 gate rows holds between 2 and 9
  product gate runs for each of the last ten orders, 16 to 75 minutes
  an order; three verifiers record a run that repeated a passing row at
  the same code identity.
- The WO-143 lock matrix runs eight cells under one 240 s deadline.
  Four records show it cancelled at that deadline (WO-114 VER-001,
  WO-159 D020, WO-115 FINAL-001, WO-168 D013), three of them followed
  by a passing rerun at the same code identity; the gate rows also hold
  the skeleton suite failing in both lanes 22 seconds apart on
  2026-09-27.
- `waive` is legal from `verifying` on, so a disclosed gap can be
  waived by the verifier's session from the operator's capture before
  any report is written; nothing tells either of them that a gap was
  disclosed.

**Design (scope discipline):**

- The ledger is `docs/evidence/WO-NNN/handoff.md`, resolved through the
  configured document root. It holds one line per criterion the order
  declares, in the forms `criterionJudgments` reads, followed on the
  same line by the evidence for met or the decision that records why
  for unmet. The executor rewrites it at each completion; the
  checkpoint the completion takes keeps each version.
- The completion refuses an absent ledger, a missing criterion, two
  lines for one criterion and a line for a criterion the order does not
  declare, naming the identifiers and the accepted forms. An order
  whose criteria cannot be read from its file is handed off with one
  advisory, as before this order.
- A criterion recorded met whose text names `npm run test:docs` makes
  the completion run the document gate once, after every other check
  and before it appends; a failure refuses the claim and prints the
  failing tasks. One whose text names `npm test` or
  `npm test -- --review` needs a passing row at the current code
  identity; for the review form the row's required suites include
  every machinery suite the change selects, and the change includes
  its untracked files, which `changedMachinery` omits today (WO-169
  D007). The completion prints the
  command and the choice: run it, or record the criterion unmet with
  the reason. A gate that cannot start, or a gate index that cannot be
  read, prints one advisory and the completion records.
- The completion event carries the identifiers recorded unmet.
  `resume status` lists them; the `verify` and `final-review` briefings
  list them with the two routes, a waiver recorded by that session from
  the operator's capture or an authorized amendment, and say that
  without either the criterion is judged as it stands.
- `npm test`, with or without `--review`, first looks for a passing,
  complete row of the same command at the current code identity whose
  required suites include the current selection's. When one exists it
  prints the row's time, duration and suite count and exits 0 without
  running; `--again` runs the gate. A changed code identity, a partial
  row and a failed row never satisfy the lookup.
- Briefing sentences, in the dispatch output and not in the role text:
  `fix` says a repair closes the class the finding names, states the
  rule the repaired code holds and adds a case the report did not
  quote; `verify` says a finding names its class and the rule a repair
  must hold, and that a defect outside what the order's criteria
  declare is boarded with its reproduction; `verify` and `final-review`
  say a recorded off-ramp whose capture hash matches is judged from the
  record and never put back to the operator.
- The lock matrix becomes eight subtests, one per cell, each with its
  own deadline. `packages/skeleton/src/gate-deadlines.mjs` is a source
  the feedback verifier judges and is not edited.
- The register advisory and `docs/planning/followups.md` say that the
  final review disposes a listed row whose seam the change opened or
  whose condition occurred, and leaves a row it only matched as it is.
- The role text's sentence on completion says what completion now does.
  The three roles share it, and the reviewer has 405 bytes of
  cold-start headroom, so the sentence grows by at most 150 bytes.
- **Declined alternatives, recorded:** refusing a handoff whose gate is
  red (the 2026-09-15 stand-down removed gate evidence from the
  transitions because every stage boundary missed it; a red gate is
  recorded as an unmet criterion and the judge decides); prose in the
  role text alone (the rule that an executor runs every required check
  before completing is already equipped as a unit, and 24 judgments
  failed on checks that were not run); changing the verdict rule so a
  constructed case cannot fail an order (the operator's to decide; the
  planning document §13 records the measurement and the smaller step,
  which is criteria that declare their set); making `waive` legal
  before verification is dispatched (an off-ramp's phases are a
  lifecycle rule and the verify dispatch is one command away); a
  separate order for the matrix (one test file would pay a whole
  lifecycle); per-suite reuse (removed on 2026-09-15 and not restored:
  this lookup reads the one row the publication already relies on).

**Deliverables:** the ledger check; the gate lookup and the inline
document gate; the disclosure in the event, the status and the
briefings; the `npm test` lookup and `--again`; the three briefing
sentences; the eight subtests; the reworded advisory and role sentence;
fixtures; the write-backs below.

**Acceptance criteria (all required)**

1. Both completions refuse, and append nothing, for an absent ledger, a
   ledger that omits a declared criterion, one that judges a criterion
   on two lines and one that names an undeclared criterion; each
   refusal names the identifiers and the accepted forms. A line inside
   a code fence is not read. A complete ledger records. An order file
   whose criteria cannot be read records with one advisory.
2. A criterion recorded met that names `npm run test:docs` records when
   the document gate passes and is refused with the failing tasks when
   it fails. One that names `npm test` or `npm test -- --review`
   records with a passing row at the current code identity and is
   refused without one, with a failed one, with a partial one, and, for
   the review form, with a row whose required suites lack a machinery
   suite the change selects, an untracked script that a suite declares
   among them. The same criteria recorded unmet record in every one of
   those cases. A gate that cannot start and a gate index that cannot
   be read each print one advisory and record.
3. A completion with a criterion recorded unmet writes its identifier
   into the event; `resume status` and the `verify` and `final-review`
   briefings list it with both routes. In a fixture the verifier's
   session records the waiver in phase `verifying`, the report judges
   the criterion `unmet, waived by` that ordinal, and a passing
   verification is recorded.
4. `npm test` at a code identity that holds a passing complete row of a
   selection that covers the current one prints that row and exits 0
   with no suite started; `--again` runs the selection; a changed
   source file, a failed row, a partial row and a plain row under
   `--review` each run the gate. The final review's publication check
   accepts the row it accepted before.
5. The three sentences appear in the named briefings, in fixtures that
   pin their text. No briefing grows by more than 400 bytes.
6. The lock matrix reports eight subtests. A fixture that delays one
   cell past its deadline fails that cell by name and runs the other
   seven; the executor records the matrix's duration alone and beside
   a second product gate on the operator's host. Under
   `packages/skeleton/src/` only `loadouts/contributor.ts` changes,
   apart from the release label that release preparation writes.
7. The completion advisory for the register states the reworded rule,
   and prints nothing about the document gate once the inline run
   replaces the tree-hash lookup.
8. Write-backs land, each in place: product 07 §Discipline (what the
   two completions check and the `--again` flag) and §Retained planning
   follow-ups (the reworded rule), at most 700 bytes added to product
   07; `docs/planning/followups.md`; the role sentence, with the
   cold-start totals of every role measured before and after and each
   verdict unchanged; the decisions file; publication locks.
9. The re-mints the Cost line names are recorded; `npm test -- --review`
   and `npm run test:docs` green; `git diff --check` clean; no new
   dependency. This order's own `handoff.md` judges these nine
   criteria.

**Evidence gate:** the fixture transcripts; the matrix durations; the
cold-start measurement; `npm run test:docs`; `npm test -- --review` at
final review. No live row.

**Write-back duty:** as listed in criterion 8. Record corrections the
same day as what was misread, meant and changed.

**Non-goals:** any change to a verdict rule, to a report's criterion
forms or to an off-ramp's legal phases; a gate requirement at
verification, final review or release close; `gate-evidence.mjs` and
`gate-deadlines.mjs`; proof that a criterion recorded met is met (the
judge's work; the ledger makes the claim explicit and checks only the
gates it names); the repair briefing's selection of findings; the
status-watcher deadline, which WO-115's repair addressed and which no
gate has failed since; the register's match rule (WO-169 D002: 11 of
123 dispositions named a generated projection, too few to pay for a
change).

**Operator-review assumptions**

1. A claim the record contradicts may be refused at a completion; a
   handoff may not. If a completion is observed refusing while its
   gate row exists, the check falls back to an advisory until repaired.
2. A row at the same code identity is the gate's evidence whoever ran
   it, as it already is for publication; a role that doubts the
   environment runs `--again` and says why.
3. A defect outside what the criteria declare is boarded, not failed.
   This narrows nothing the criteria claim; orders filed from
   2026-09-28 declare their set (planning document §10).
