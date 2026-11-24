# WO-295 — The refuter judges whether each criterion can be settled, and a planning pass repairs what it holds (version assigned at activation)

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-293",
    "relation": "satisfied-by-close",
    "reason": "the sixth defect class, `open-set`, which a finding on a criterion may name"
  }
]
<!-- dotln-dependencies:end -->

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. The one independent judgment a planning
pass already has also answers, for every criterion of every order it
judges, whether a verifier can settle it. A criterion the refuter finds no
candidate can meet as written holds the pass until the planner repairs it.
The receipt command reads the new answers as it reads the rest of a result
and declines one that leaves a criterion unanswered. Nothing changes in an
order's execution, in core or in an instance, and no stop is added.
Assigned at activation under the standing opt-out default.
**Cost:** adds a fifth answer to each refutation, whose tokens are unknown
until run; one new version of the result with its validation; one kind of hold;
one sentence of role text; about eight cases. Removes the criteria review
a pass runs beside its refutation, which took 0 h 11 min and 18.0 million
tokens in the pass that filed this order, and the later adjudication of
criteria that should not have been filed: core's control logs hold 5
waivers and 5 defect records, and one more criterion, WO-111's second, was
waived in prose before the waiver had an event. Of those 11 a screen in
force at filing named 4 that no reading caught.
`packages/skeleton/src/plan-refutation-protocol.ts` is in
`FEEDBACK_SOURCE_PATHS`, so the order owes the feedback re-mint and one
live feedback self-host episode, run after the step that edits it.
`packages/skeleton/src/loadouts/contributor.ts` is a registered evidence
source: the editions it stales are re-minted with `npm run sync`. On `main`
the planner's root stands 12 bytes under its cold-start ceiling, and in
WO-288's worktree, measured on 2026-11-23, 263 bytes over. So the executor
records the root's bytes before and after and removes at least what it
adds; a root over its ceiling at handoff is named there with its measure
and boarded as a follow-up, as product 07's Discipline has it. One complete
review run at handoff. Wall-clock, tokens and steps are unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-23,
item 5 (ignored capture SHA-256
`0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270`), and two
messages sent while the pass ran (ignored captures SHA-256
`1873874c50d48842066af140d3a18d11680c5ebf45b325b63574bd07615eb4f7` and
`002461b05862d9020f0b43e0437564256a3d7454b6674e16b9a6ae5598a81631`): the
operator is asked to waive criteria on every order and puts that down to
the planning that wrote them, does not see why texts that were judged
leave the adjudication of criteria to the operator, and directs that this
is the planner's and the refuter's work.
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#who-judges-a-criterion)
holds the reading, and
[its census](../planning/passes/the-kit-keeps-working-2026-11-23-criteria-census.md)
the counts.
**Depends on:** WO-293, as the block above types it.
**Recommended placement:** sixth, after WO-293. Until it lands, a planning
pass runs the criteria review beside its refutation, as the execution
guide says from the pass that filed this order.

**Objective:** Whether each criterion of an order can be met and settled is
judged before the order is filed, by the independent refuter, inside the
one judgment a pass already has. A criterion no candidate could meet as
written holds the pass, and the planner repairs it there. The operator is
not asked about it later.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- The refuter is asked four things of each order, and none is about its
  criteria: which critical-path gate it unblocks and its NoOp cost, how the
  eight system traps apply, whether its Cost line removes more than it
  adds, and how its failure degrades
  (`packages/skeleton/src/loadouts/plan-refuter.ts`). The result holds a
  field for each of the four and a list of findings
  (`packages/skeleton/src/plan-refutation-protocol.ts`).
- A finding already names one criterion, a hold on it stops the pass, and
  the planner's disposition binds that criterion and the order's Cost line
  (`addressedHolds` and `disposePlanHold` in
  `scripts/lib/plan-receipts.mjs`). The route for a criterion the refuter
  rejects exists; the question that would send a criterion down it does
  not.
- The screens for criteria are the planner's own to apply (product 07,
  "Operator-opened planning pass"). Of the 11 criteria that ended waived or
  defective, a screen in force at filing named 4, and none of the 4 was
  caught
  ([the census](../planning/passes/the-kit-keeps-working-2026-11-23-criteria-census.md)).
- An independent reading of criteria exists as a helper a pass may run,
  `npm run worker -- review --kind criteria --subject planning`. The pass
  that filed this order ran it on six orders it had just written. It found
  fourteen defects, one of them blocking, and the refuter's four questions
  ask for none of them.
- The kit holds one closed list of the ways a criterion can be written so
  that no candidate meets it, `DEFECT_CLASSES` in `scripts/lib/control.mjs`.
  It is read when a verifier or a reviewer records a defect in a running
  order, and by nothing at planning.

**Design (scope discipline):**

- **A fifth answer for every order.** For each criterion the refuter says
  whether a verifier can settle it on the candidate by the command it
  names. The answer is `settleable`, or `defective` with one class of
  `DEFECT_CLASSES` and the criterion's own words that show it. The refuter
  reads the order's file for this, and the code a criterion names where the
  answer turns on it. The subject and its hash are as they are.
- **A new version of the result.** The answer is a field of a new version
  of the refuter's result. A receipt filed under the version `main` holds,
  `plan-goal-review-v1`, is read by that version's own rules and verifies
  as it does now; the protocol already keeps an older version's reader
  beside the current one. Every filed receipt is validated again at each
  plan check, so a field added to the version in use would fail them all.
- **A defective criterion holds the pass.** The receipt files it as a hold
  on that criterion, which is answered as a hold is now: the planner
  rewrites the criterion and records the disposition, which binds that
  criterion and the Cost line.
- **Every criterion is answered.** The receipt command declines a result
  that skips a criterion of a judged order, or that calls one defective
  without a class of the list, and names the order and the criterion, so
  the worker restates its result.
- **What holds nothing.** A doubt that fits no class is a known issue with
  its reopening condition, as any finding is. Wording that the screens
  name, two behaviors in one criterion or more than ten criteria, stays the
  planner's to weigh and the index check's to advise on.
- **One list.** The classes are read from the kit's one list. A second copy
  of them in the protocol is a defect.

Rejected:

- _A criteria reviewer as a required step beside the refuter._ It differs
  on how many independent judgments a pass pays for. The operator's
  direction puts the judgment with the planner and the refuter, and one
  judgment that answers five questions costs one worker and one receipt.
- _A hold for every criterion a screen names._ It differs on what stops a
  pass. Most criteria the census read hold more than one behavior, and a
  pass held on each would loop on its refutation as an order loops on its
  verification. A class names a criterion nothing can meet; a screen names
  one that is harder to judge.
- _Judging the criteria at an order's first verification._ It differs on
  when the defect is found. By then the order is active, its criteria are
  frozen and only the operator's word changes one.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** The plan is to be read against WO-293's merged
text. A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `packages/skeleton/src/loadouts/plan-refuter.ts`: the fifth question in
   the refuter's work order, and the same question wherever the four are
   repeated (`scripts/authority-evidence.mjs` holds them). Check: a case in
   `scripts/test-plan-refutation.mjs` that reads the printed prompt.
2. `packages/skeleton/src/plan-refutation-protocol.ts`: a new version of the result with an answer for each criterion, read
   beside the version `main` holds; the output instruction that asks for
   it; and the validation of criterion 3's table. Check: one case for each row, with
   the fake transport, in `scripts/test-plan-refutation.mjs`.
3. `scripts/lib/plan-receipts.mjs`, `addressedHolds`: a criterion the
   result calls defective is a hold on that criterion. Check: a case in
   `scripts/test-plan-refutation.mjs` that files such a result and reads
   the receipt's holds.
4. `packages/skeleton/src/loadouts/contributor.ts`: the planner's sentence of criterion 5. Check: a case in `scripts/test-harness.mjs` that reads
   the emitted planner's root.
5. The feedback re-mint and one live feedback self-host episode, then
   `node scripts/harness.mjs emit`, `npm run sync` and `npm run meta`.
6. One refutation of a planning subject that `main` holds, run with the new
   question by a worker from the worker table: its result and what it held
   go in the decisions.
7. Write-backs: `docs/product/07-execution-guide.md`, "Operator-opened
   planning pass" (the refuter's judgment covers the criteria; the sentence
   on the criteria review a pass runs beside its refutation goes);
   `docs/planning/refutations/README.md` (what a refutation answers).
8. The handoff sequence of §Discipline.

**Deliverables:** the fifth question; the result's answer and its
validation; the hold; the planner's sentence; the cases; the feedback
edition; one real refutation's record; the write-backs.

**Acceptance criteria (all required)**

1. The prompt that `npm run plan -- refute` prints asks, for every judged
   order, whether a verifier can settle each criterion by the command it
   names (`npm test -- --only plan-refutation`).
2. The result schema in that prompt is of the new version and requires an
   answer for each criterion of each judged order
   (`npm test -- --only plan-refutation`).
3. `npm run plan -- receipt` treats a result of the new version as this
   table says, for each criterion of a judged order
   (`npm test -- --only plan-refutation`).

   | The result | The receipt |
   | --- | --- |
   | calls the criterion settleable | is filed with no hold for it |
   | calls it defective and names a class of `DEFECT_CLASSES` | is filed with a hold on that criterion |
   | calls it defective and names no class, or one that is not in the list | is declined with a message that names the criterion |
   | holds no answer for it | is declined with a message that names the criterion |

4. A receipt filed under `plan-goal-review-v1` still verifies:
   `npm run plan -- check` admits a fixture chain that holds one
   (`npm test -- --only plan-refutation`).
5. The emitted planner's root says that the refutation judges whether each
   criterion can be settled (`npm test -- --only harness-fixtures`).
6. `docs/product/07-execution-guide.md` under "Operator-opened planning
   pass" says that the refuter judges whether each criterion can be settled
   (`npm run test:docs`).
7. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only plan-refutation`,
`npm test -- --only harness-fixtures`, `npm test -- --only skeleton`,
`npm test -- --only feedback-evidence`.

**Evidence gate:** under `docs/evidence/WO-295/`: the decisions, with the
fifth question's wording, the real refutation of step 6 with what it held,
and the planner's root's bytes before and after; the feedback edition and
the live episode's record, or its recorded absence with the host's reason;
the handoff.

**Write-back duty:** as step 7 lists. The release's Read before upgrading
says that a refutation now judges criteria and may hold a pass on one.

**Known issues and carry-ins:**

- A refuter that holds on criteria can loop a planning pass as a verifier
  looped an order. What bounds it is that a hold names a class of a closed
  list and the criterion's own words. Reopen: a pass takes more than two
  refutations because of holds on criteria.
- A disposition binds one criterion and the Cost line. A repair that
  divides a criterion in two changes more than that, and the pass then has
  the corrected subject judged once more, as the guide's rule for an open
  planning branch has it.
- The refuter judges from text. A criterion that reads as settleable and
  proves wrong on the candidate is WO-296's.
- The census found the classes `bookkeeping`, `later-phase`, `absent-input`
  and `host-behavior` never recorded in core. How often a refuter will name
  one at planning is unknown until run.

**Non-goals:** any change to a running order's criteria, which is WO-296's;
the verifier's and the reviewer's defect records; a new class; a hold for a
screen's wording; the four questions the refuter answers now; the criteria
review helper, which stays for a pass that wants it.

**Operator-review assumptions:** a finding of the refuter on a criterion
holds a planning pass as a finding on direction does; the classes it may
name are the kit's one list; and the separate criteria review stops being
a step of a pass when this order lands.
