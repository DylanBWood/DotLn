# WO-296 — A criterion returned twice is re-cut by a planner and judged by a refuter, and the operator adjudicates none (version assigned at activation)

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-293",
    "relation": "satisfied-by-close",
    "reason": "the count of a criterion's returns and the fix briefing's line that names its routes, which this order's trigger and briefing line are written against"
  },
  {
    "workOrderId": "WO-295",
    "relation": "satisfied-by-close",
    "reason": "the refuter's answer for one criterion, which is the judgment a re-cut is bound by"
  }
]
<!-- dotln-dependencies:end -->

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. A criterion of a running order that two
verifications have returned is re-cut by a fresh planner worker and judged
by a fresh refuter, and an amendment that judgment admits binds with no
recorded authorization of the operator's. The operator reads each re-cut
on the order's status and withdraws one with the command the kit has. It
is a feature, `recut-returned-criterion`, on unless a root turns it off.
No stop is added: the re-cut command declines what does not match the
judgment it was given, as `amend-order` declines now. Assigned at
activation under the standing opt-out default.
**Cost:** adds one command of three steps, one feature and its default,
one line of an order's status and one of the fix briefing, two worker uses
for each re-cut against the session's cap, whose tokens are unknown until
run, one changed sentence of a shared rule and about twelve cases. Removes
the operator's adjudication of a criterion that proves wrong while its
order runs: WO-288's criterion 23 was returned by ten of its eleven
verifications, no route but repair was weighed for it, and its ten repairs
took 48 h 6 min. `packages/skeleton/src/loadouts/contributor.ts` is a
registered evidence source: the editions it stales are re-minted with
`npm run sync`. No file of `FEEDBACK_SOURCE_PATHS` is edited. The changed
rule reaches six roots, four of them over their cold-start ceilings in
WO-288's worktree on 2026-11-23, so the executor records each root's bytes
before and after and removes at least what it adds; a root over its
ceiling at handoff is named there with its measure and boarded as a
follow-up, as product 07's Discipline has it. One complete review run at
handoff. Wall-clock, tokens and steps are unknown until run.
**Nomination provenance:** two messages the operator sent on 2026-11-23
while the planning pass ran (ignored captures SHA-256
`1873874c50d48842066af140d3a18d11680c5ebf45b325b63574bd07615eb4f7` and
`002461b05862d9020f0b43e0437564256a3d7454b6674e16b9a6ae5598a81631`): the
operator does not see why criteria that were judged are left to the
operator to adjudicate and to update by hand, and directs that this is the
planner's and the refuter's work.
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#who-judges-a-criterion)
holds the reading, and
[the study of WO-288's eleven verifications](../planning/passes/the-kit-keeps-working-2026-11-23-wo-288-loop-study.md)
the case.
**Depends on:** WO-293 and WO-295, as the block above types them.
**Recommended placement:** seventh, after WO-295 and before WO-294.

**Objective:** When a criterion of a running order comes back from a second
verification, the two roles that set an order's bar look at it again: a
planner worker re-cuts it or says it stands, and a refuter judges the
re-cut, both fresh and neither the session doing the work. An amendment
they admit binds, and the order goes on. No session asks the operator to
waive, cut or amend a criterion. The operator reads what was re-cut and
may undo it.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- Once an order is judged, no session may change a criterion, by design:
  the session doing the work does not lower its own bar. Three routes are
  left. A defect record is the verifier's or the reviewer's, in the five
  classes of `DEFECT_CLASSES` (`scripts/lib/control.mjs`). A waiver is
  recorded from the operator's words. An amendment is bound by
  `npm run plan -- amend-order <WO-NNN> <WO-NNN-DNNN> <reason>` to a
  recorded decision and a reason that the roles' text makes the operator's
  authorization (`amendPlanOrder` in `scripts/lib/plan-receipts.mjs`).
- So a criterion that proves wrong and fits no class waits for the
  operator. WO-288's criterion 23 failed in ten of eleven verifications, at
  a new site each time. No waiver, defect record or amendment was weighed
  for it, and none of the five classes describes it
  ([the study](../planning/passes/the-kit-keeps-working-2026-11-23-wo-288-loop-study.md)).
- The shared rule `own-decisions`
  (`packages/skeleton/src/loadouts/contributor.ts`, author layer) tells
  every role not to ask the operator to change criteria, while nothing but
  the operator's word changes one.
- WO-293 counts a criterion's returns and has the fix briefing name three
  routes at the second: the defect record, the cut of a part and the
  amendment. The last two are the operator's.

**Design (scope discipline):**

- **The trigger is the second return.** WO-293's count reaches two when two
  verifications have judged the same criterion unmet or named it as a
  blocking finding's basis. The fix briefing's line for that criterion then
  names the re-cut command.
- **Three steps, one command.** The first prints a brief for a planner
  worker: the criterion's text, each report's findings against it with
  their bases, the order's objective and non-goals, the screens and the
  defect classes, and the form of the answer. The worker answers one of
  two ways: the criterion stands, with the reason; or an amended text for
  that criterion, with what it no longer requires. The second step writes
  an amended text into the order's file under the criterion's number and
  prints the refuter's prompt for the order as amended. The third files the
  refuter's judgment and binds the amendment, or declines. The command's
  form is the executor's.
- **The command writes the text.** The session that holds the order
  launches both workers from the worker table and hands each answer to the
  command. It writes no byte of the criterion, and the third step compares
  the criterion in the order's file with the text the refuter judged.
- **One criterion, under its number.** A re-cut changes that criterion's
  text and nothing else of the order: it may narrow the criterion to named
  cases, set them out as a table, or give it the command that settles it.
  What the amended text no longer requires is filed as a follow-up row
  with its reproduction, so nothing is dropped unseen. The objective, the
  non-goals, the parts and every other criterion stay the operator's to
  change, and the cut of a part stays the operator's word.
- **The refuter judges why the bar moves.** Its question for a re-cut is
  WO-295's question put to the criterion as filed and as amended: whether
  the filed text fits a defect class, and whether the amended text still
  requires what the order's objective names. An amendment of a criterion
  that the work simply fails, or one that drops what the objective
  requires, is held, and nothing binds.
- **Once.** A criterion is re-cut once in an order. After that the routes
  are the defect record and the operator's word.
- **The operator is told and can undo it.** The order's status lists each
  re-cut criterion with the command that withdraws it,
  `npm run plan -- amend-order <WO-NNN> --withdraw <row-ordinal> <reason>`,
  which the kit has.
- **A feature, on unless turned off.** `recut-returned-criterion` is a row
  of the features page, in core and in an instance, with
  `"features": {"recut-returned-criterion": false}` as the line that turns
  it off. Off, the fix briefing names the routes WO-293 leaves, and the
  command declines and names the feature.
- **Nobody asks.** The rule `own-decisions`, under its id and in the
  author's layer, says that a criterion two verifications have returned
  goes to a re-cut and that no session asks the operator for a waiver, a
  cut or an amendment. A waiver stays what the operator may give unasked.

Rejected:

- _Letting the verifier amend the criterion it returned._ It differs on who
  moves the bar. A verifier that rewrites what it judges is the executor's
  problem moved one seat. A planner worker and a refuter, both fresh, are
  the two roles that set the bar in the first place.
- _A re-cut at the first return._ It differs on when the criterion is
  doubted and not the work. By the record most first failures are of sound
  criteria: of the last eight orders that ran, five failed their first
  verification, and none of the five rested on a clause later waived or
  recorded defective
  ([the census](../planning/passes/the-kit-keeps-working-2026-11-23-criteria-census.md)).
- _A planning pass for each returned criterion._ It differs on who must
  start it and what it judges. A pass is opened by the operator and has
  its whole subject judged, where one criterion is in doubt.
- _A re-cut of an order's objective, non-goals or parts._ It differs on
  what may change without the operator. Those are the order's scope.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** The plan is to be read against WO-293's and
WO-295's merged text. A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `scripts/lib/feature-registry.mjs`: the feature
   `recut-returned-criterion`, on by default. Check: a case in
   `scripts/test-features.mjs` that reads the row from the features page of
   a root that makes no election.
2. `scripts/refute-plan.mjs` and `scripts/lib/plan-receipts.mjs`: the first
   step, which prints the brief and the answer's form for an active order's
   criterion from the control log's verification reports. Check: a case in
   `scripts/test-plan-refutation.mjs` with a fixture order whose log holds
   two failed verifications of criterion 3.
3. The same two files: the second step, which writes an amended text under
   the criterion's number and prints the refuter's prompt, and which
   changes no byte where the answer is that the criterion stands. Check:
   one case for each.
4. `scripts/lib/plan-receipts.mjs`, beside `amendPlanOrder`: the third
   step, which binds on the refuter's receipt in place of a recorded
   decision, compares the criterion's text with the text judged, and
   declines a second re-cut of a criterion. Check: one case for each
   remaining row of criterion 2's table, and one for criterion 3.
5. `scripts/resume.mjs` and `scripts/lib/criteria-status.mjs`: the status
   line for a re-cut criterion with its withdrawal command; the fix
   briefing's line at a second return; and, in the briefing line that gives
   the routes for a criterion the executor recorded unmet, the sentence on
   an amendment, which names the re-cut beside the operator's words. Check:
   three cases in `scripts/test-resume.sh`'s fixture.
6. `packages/skeleton/src/loadouts/contributor.ts`: the rule
   `own-decisions` as the Design's last bullet says. Check: a case in
   `scripts/test-harness.mjs` that reads the six emitted roots.
7. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`.
8. Write-backs: `docs/product/07-execution-guide.md`, "Operator recovery
   controls" (the re-cut beside the waiver and the defect record, and the
   withdrawal) "Verification review and attack" (what a second return leads to)
   and the tenth rule of "The queue form" (a criterion returned twice goes
   to a re-cut, and the cut of a part is still recommended to the
   operator); `docs/KIT.md`, "A criterion nothing can meet, waivers and
   retractions", "What each feature does" and "The feature table".
9. The handoff sequence of §Discipline.

**Deliverables:** the feature; the command's three steps; the binding on a
refuter's receipt and its refusals; the status and briefing lines; the
rule's sentence; the cases; the write-backs.

**Acceptance criteria (all required)**

1. For a fixture order whose control log holds two failed verifications
   that each returned criterion 3, the re-cut command's first step prints a
   brief for criterion 3 that holds each of the two reports' findings
   against it (`npm test -- --only plan-refutation`).
2. With the feature on, the re-cut command does what this table says, and
   no row needs a decision that records an authorization
   (`npm test -- --only plan-refutation`).

   | What the command is given | The command |
   | --- | --- |
   | a planner worker's answer that the criterion stands | changes no byte of the order |
   | a planner worker's amended text | prints a refuter's prompt that asks whether the criterion as filed fits a defect class and whether the amended text still requires what the order's objective names |
   | a refuter's receipt for that text that holds nothing for the order | binds the amendment, so that `npm run plan -- check` admits the amended order |
   | a refuter's receipt for that text with a hold for the order | declines with a message that names the hold |
   | an order whose criterion differs from the text the refuter's receipt judged | declines with a message that names the criterion |

3. The re-cut command declines a criterion already re-cut once in the same
   order, with a message that names the defect record and the operator's
   amendment as what is left, and declines a criterion that the order's
   control log records defective, with a message that names that record
   (`npm test -- --only plan-refutation`).
4. The order's status lists each re-cut criterion with the command that
   withdraws it (`npm test -- --only resume`).
5. For the fixture of criterion 1, with the feature on, the fix briefing's
   line for criterion 3 names the re-cut command
   (`npm test -- --only resume`).
6. The feature's election does what this table says
   (`npm test -- --only configuration-root`;
   `npm test -- --only plan-refutation`).

   | The root's election | The result |
   | --- | --- |
   | none | `npm run features -- list` shows the feature on, in core and in an exported instance |
   | `"features": {"recut-returned-criterion": false}` | the re-cut command declines with a message that names the feature |

7. The rule `own-decisions`, in each of the six emitted roots that carry
   the shared rules (`dotln-executor`, `dotln-verifier`, `dotln-reviewer`,
   `dotln-release-close`, `dotln-planner`, `dotln-refuter`), says that a
   criterion two verifications have returned goes to a re-cut and not to
   the operator (`npm test -- --only harness-fixtures`).
8. The briefing line that gives the routes for a criterion the executor
   recorded unmet says that an amendment is bound by the operator's words
   or by a re-cut (`npm test -- --only resume`).
9. Each of these two places of `docs/product/07-execution-guide.md` names
   the re-cut as where a criterion two verifications have returned goes:
   "Operator recovery controls", and the tenth rule of "The queue form"
   (`npm run test:docs`).
10. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only plan-refutation`,
`npm test -- --only resume`, `npm test -- --only harness-fixtures`,
`npm test -- --only configuration-root`, `npm test -- --only skeleton`.

**Evidence gate:** under `docs/evidence/WO-296/`: the decisions, with the
command's final form, the brief of one real criterion printed from core's
record, and each changed root's bytes before and after; the handoff.

**Write-back duty:** as step 8 lists. The release's Read before upgrading
says that a criterion returned twice is now re-cut without the operator's
word, names the command that withdraws a re-cut and the line that turns
the feature off.

**Known issues and carry-ins:**

- The session that holds the order has an interest in a lower bar and is
  the one that starts the re-cut. What bounds it is that the command prints
  the brief and writes the text, and that a refuter judges the result.
  Reopen: an order closes with a re-cut criterion, and a later order or
  review finds that what the re-cut dropped was required by the order's
  objective.
- That the planner worker and the refuter of a re-cut are fresh is attested
  by the session that launched them, as a refuter's independence is now. A
  hook counts their launches under Claude Code, and nothing verifies it
  under Codex.
- With the feature off, criterion 6 reads the command and not the fix
  briefing, whose line is then the one WO-293 leaves.
- A re-cut reads two returns of one criterion by its number. Since a re-cut
  keeps the number and adds no criterion, the numbers of an order's
  criteria do not move under it; an amendment the operator authorizes may
  still move them.
- A waiver the operator gives unasked is recorded as it is now.

**Non-goals:** a change to an order's objective, non-goals, parts or steps
without the operator; the cut of a part; the waiver command; the
verifier's and the reviewer's defect records, which are WO-293's; the
refutation of a planning pass, which is WO-295's; a re-cut at a first
return; a count that ends a repair loop; a criterion added by a re-cut.

**Operator-review assumptions:** a criterion of a running order may change
without the operator's recorded word when a fresh planner worker re-cut it
and a fresh refuter judged it; the operator learns of it from the order's
status and not from a question; a criterion is re-cut once; and the
feature is on by default, in an instance as in core.
