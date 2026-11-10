# WO-262 — Review findings are judged before they are fixed, and a review is sized by what the record shows: the ladder's briefs admit a blocking finding only on an input a writer produces or a leak, the executor's root carries the judgment rule in place of fixing every finding, a fix dispatch repairs the class its report names and takes one combined review, an order's header sizes its first round, and a paired first round records which reviewers found what so that a later pass sets the default from it

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. One admission rule in the canonical
review brief of every kind and round; the executor's review rule replaced
in its role text; a fix dispatch's reviews reduced to one combined worker
over the repair; one optional header line that sizes an order's first
round, with a paired form whose findings are recorded in a typed array;
one table in the planning failures report. Assigned at activation under
the standing opt-out default.
**Cost:** adds, in `scripts/lib/review-worker.mjs` (`ladderRule` and the
brief's preamble), the admission rule in round one and, where a returned
report is refused for its form, the keeping of that report; in
`packages/skeleton/src/loadouts/contributor.ts` (the executor), the
judgment rule, the fix rule and the header's reading; in
`scripts/work-orders.mjs` (`parseHeader`), the header line; in
`scripts/docs-check.mjs`, the shape check of a decision's `roundFindings`
array, recurring work in the document gate over records it already parses
(unmeasured, and measured by this order as the `docs-check` task's time
before and after); in `scripts/lib/plan-failures.mjs`, the table of
paired rounds; in a paired order, one worker launch more in round one
than a full ladder spends; cases in the suites the Preflight names;
product 07, the kit guide and the decisions. Removes, from every fix
dispatch, the three round-one reviewers and the three rechecks a full
ladder spends (six of its seven worker uses), in core and in every
instance; from an order that declares `combined`, two of round one's
three workers; and these states: a finding fixed because a reviewer
marked it blocking; a second parser written for a spelling no writer
produces and reverted hours later; a one-pattern repair that drew eleven
findings from a fresh review of the whole order; the size of a review set
by a direction nobody could test. Tokens and wall-clock: unknown until
this order's handoff records them. Re-mints: the role oracle, by hand and once: a new baseline fixture under
`packages/skeleton/fixtures/` linked to the one before it, with its entry
in the chain that `scripts/test-process-debt.mjs`,
`scripts/test-gate-followups.mjs` and `scripts/test-runner.mjs` list
(WO-264 removes that chain after this order);
`packages/skeleton/src/change-review-protocol.ts` is in
`FEEDBACK_SOURCE_PATHS` and this order leaves it unchanged, so no live
feedback episode is owed. The files this order edits are declared sources
of machinery suites, so the final criterion names `npm test -- --review`.
Steps: the executor's, below.
**Nomination provenance:** the operator's direction during WO-259 that the
executor's adoption of review findings without judgment be marked critical
and reviewed at the next planning session
([WO-259-D022](../evidence/WO-259/decisions.md#wo-259-d022), ignored
captures SHA-256
`7f326f7487ede475fe6c7d7cb4d65985568f45b3bd135a57c483154909b45b73` and
`177daeeeb3c7514471d5eb40b0ea6a5f37163a1e45b22d74e764f13d24b26dd8`;
FUP-6fe1262fb31292b3); the reviewer's admission rule that order boarded
([WO-259-D021](../evidence/WO-259/decisions.md#wo-259-d021),
FUP-67944ed9c85b7199); the operator's direction during WO-260's repair that
a fix answers a verification failure in proportion to it
([WO-260-D028](../evidence/WO-260/decisions.md), FUP-c052a580e9f69291);
the operator's statement of 2026-11-09 that the number of reviewers is to
follow the evidence, whether that is many, few or none (ignored capture
SHA-256
`e1c8d0ae73fb667fbfa8aa82a58b9c6d054eaa53a521fd82a84bc8612e573237`); the
reading of the record's review findings by
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md),
which removed this order's document-check refusal and added the fix rule,
the header and the paired round.
**Depends on:** WO-250 (closed, v0.111.0) and WO-255 (closed: the ladder,
the review helper and its briefs this order adds a rule to). No open order.
**Recommended placement:** second. Every later order's reviews and repairs
run under it, in core and in an instance whose model budget is limited,
and every later order in this sequence is a paired round whose record
this order makes readable.
**Cites (read these sections):** product 07 §Verification review and attack
(the routes, the supported-input rule for a verifier's blocking finding and
the ladder); `scripts/lib/review-worker.mjs` (`ladderRule`, the canonical
brief and its preamble, the `combined` kind);
`packages/skeleton/src/loadouts/contributor.ts` (the executor's review
sentences and `reviewAdmissionRule`); `scripts/work-orders.mjs`
(`parseHeader`, the index's Open card); `scripts/docs-check.mjs` (how a
decision record's JSON is read); `scripts/lib/plan-failures.mjs`;
`scripts/lib/review-findings.mjs` (the findings block of a verification
and a final review, whose name this order's field must not take);
[WO-259-D016 to D022](../evidence/WO-259/decisions.md) (the four rounds);
[WO-260-D027 to D031](../evidence/WO-260/decisions.md) (a repair judged
before it was fixed, and the ladder it still ran).

**Objective:** A review finding changes code only after the executor has
said which writer produces the input it names, whether the failure admits
something wrong or refuses something valid, and what the fix costs. The
reviewer is told what blocks from round one. A fix dispatch repairs what
its failed report names and has that repair read once. An order's own
header says how large its first round is. And for the orders that follow
this one, the record holds, finding by finding, which reviewer found it
and what kind of finding it was, so that the question of how many
reviewers an order needs is answered by counting.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Round one carries no admission rule. `ladderRule` in
  `scripts/lib/review-worker.mjs` returns, for round one, only that the
  worker reviews the whole change against its base under its brief; the
  recheck and the combined round append the rule.
- The executor's role text says the opposite of the guide. Product 07
  §Verification review and attack has stated since 2026-11-08 that the
  executor judges every distinct finding before it fixes one;
  `packages/skeleton/src/loadouts/contributor.ts` and both installed
  executor roots read `Fix or record every finding`. Where the executor
  did read the rule it applied it: WO-260's handoff step cited the
  guide's paragraph, and its repair judged eleven round-one findings
  before fixing any (WO-260-D029).
- A fix pays the whole ladder again. That repair changed one reading of
  where a shell comment starts, and its ladder was three fresh reviewers
  over the whole order's change and two further rounds (WO-260-D029 to
  D031). During it the operator directed that a fix answer its failure in
  proportion (WO-260-D028). Over the committed control record, the median
  span from `RepairRequested` to `RepairCompleted` was 30 minutes in
  September (102 repairs), 71 in the first half of October (53), 84 in the
  second half (33) and 134 minutes in November (11).
- What reviewers find, by a review worker's reading of the committed
  decisions of nine orders from WO-236 to WO-260 (390 findings it could
  classify, 39 it could not; its own confidence medium, and not
  re-derived by the planner). About a fifth would have failed an
  acceptance criterion or broken behavior `main` had, two fifths were
  lesser defects a gate or a final review would have met, an eighth were
  improvements with no failure behind them, and a quarter named an input
  no writer produces, were wrong, or were recorded with no fix. By kind,
  the criteria reviewer's findings were of the first class most often,
  the consistency reviewer's were four fifths of the second class, and
  the design reviewer's were mostly of the last two. Of the first-class
  findings that rechecks and third rounds raised, about half were defects
  that an earlier fix made for a review had introduced.
- What the record cannot say. First verification failed in four of eight
  orders under two reviewers, two of eleven under three with unlimited
  rechecks and eight of fourteen under the ladder, differences that small
  samples and growing diffs do not separate. No order ran with no
  reviewer, and no whole change was ever read by one combined worker in
  place of three; on repairs under fifty lines, where one combined worker
  does run, it mostly found nothing.
- A full ladder spends seven worker uses (three round-one workers, three
  rechecks and one combined worker), and the same rule runs in every
  instance.
- A report refused for its form is lost with its findings. Where
  `recordedReportRefusal` refuses a returned report, the helper prints
  how many findings it held and records none of it. On 2026-11-09 two
  criteria reviews of this pass's own subject were refused for one word
  in the `## Items` table's disposition column; the lines counted 13 and
  9 findings and the lane kept neither report, so each was a worker use
  with nothing to read.

**Design (scope discipline):**

- One standard for every reviewer: the verifier's supported-input rule
  applies to the ladder from round one. A finding blocks when it names the
  criterion it fails and an input the kit's writers or an author's ordinary
  text produce, or a leak (a copy, a broken link or a wrong pass admitted),
  or behavior `main` had with the probe that shows it. Anything else is
  reported as a recorded finding. Rejected: a separate, looser rule for
  round one (the axis is where the cost was: round one is where WO-259's
  thirteen arrived).
- The judgment is the executor's and is written in the round's decision as
  the guide already says: the writer that produces the input or that none
  does, whether the failure is open or closed, and the fix's cost. An open
  failure is fixed. A closed failure on a real writer's input is fixed. A
  closed failure on an input no writer produces is recorded with no code.
  A parsed structure is preferred to a new scanner of source text.
  Rejected: a document-check refusal of a fix that contradicts its own
  judgment (the axis is what a check can tell: it could refuse only an
  entry that contradicts itself, so an executor that obeys a reviewer
  names a writer and passes).
- A fix dispatch answers its report. It repairs the failing case and the
  class the report names, and it redesigns only where recorded evidence
  shows the larger change is the better solution. Its review is one
  combined worker carrying the three briefs over the repair's change since
  the tree the failed report judged, under the admission rule. The first
  execution's ladder has read the whole change, the verifier named the
  failure with a reproducer, and the verifier reads the whole candidate
  again after the repair. Rejected: the full ladder on every fix (the axis
  is what each layer adds). Rejected: no review on a fix (the axis is
  risk: a repair is code no reviewer has read).
- An order sizes its own first round. A header line `**Review ladder:**`
  takes `full` (three reviewers, today's round, and the default when the
  line is absent), `combined` (one worker carrying the three briefs) or
  `paired`. The planner writes it and the operator reads it with the
  plan. Rejected: a threshold computed from the diff (the axis is who
  decides: the change's risk is the planner's reading of the order, known
  before a line is written). Rejected: a value for no review (the axis is
  the evidence: reviewers found defects of the first class in every order
  read, and no order without them exists to compare).
- A paired round is the measurement. Round one launches the three kinds
  and one combined worker on the same tree, none given another's report,
  before any fix. The executor records each distinct finding of that
  round in the round's decision as an entry of a `roundFindings` array:
  an identifier, the finders among `criteria`, `design`, `consistency`
  and `combined`, a class among `criterion` (fails an acceptance
  criterion with a supported input, or breaks behavior `main` had),
  `lesser` (a real defect a gate or a final review would meet),
  `improvement` and `none` (no writer produces the input, or the finding
  is wrong), and a disposition, `fixed` or `recorded`. It then fixes the
  union under the judgment rule. The document check reads the array's
  shape and nothing else; `npm run plan -- failures` counts, over the
  paired orders, the findings of each class that only the combined
  worker found, that only the three kinds found, and that both found,
  beside each order's first verification. Rejected: alternating `full`
  and `combined` between orders (the axis is fairness: two orders are
  never the same change, and a paired round compares both arms on one).
- The pass that reads fifteen paired rounds sets the default and retires
  `paired`. Until then every order in the sequence after this one
  declares it. The header is judged on open orders only, so a value
  retired later stays as written on the orders that closed with it.
- The code WO-259 wrote for inputs no writer produces stays, as the
  2026-11-08 pass decided.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/lib/review-worker.mjs` (`ladderRule` and the canonical brief's
   preamble): the round-one brief of every kind states the admission rule
   of the Design's first item and asks each finding to say which writer
   produces its input or that it found none; later rounds keep their rule. Where `recordedReportRefusal` refuses a
   returned report, write that report into the round's lane under a name
   that marks it refused and name the path in the refusal line; the round
   still records no report. Check: `npm test -- --only plan-refutation`,
   whose file loads the review-worker cases.
2. `packages/skeleton/src/loadouts/contributor.ts` (the executor's review
   sentences): replace the clause that reads `Fix or record every finding`
   with the judgment rule of the Design's second item, saying that a
   reviewer's label is the reviewer's claim and that the judgment is
   written in the round's decision.
   `packages/skeleton/test/executor-supports.test.ts`: the case that cuts
   the consistency brief out of the executor's text ends its match at the
   clause this step replaces; end it at the new sentence's opening. Mint
   the role baseline as the Cost line states, after step 4, when the
   executor's sentences are final. Check: `npm test -- --only skeleton`,
   `npm test -- --only process-debt` and `npm test -- --only compiler`.
3. `packages/skeleton/src/loadouts/contributor.ts` (the same sentences):
   state the fix rule of the Design's third item. On `resume: fix` the
   executor repairs the failing case and the class its failed report names,
   then runs one combined review over the repair's change since the tree
   that report judged (`npm run worker -- review --kind combined --since
   <tree>`, or one `dotln-worker` given the three briefs and that diff) and
   no other round. The sentence about a repair after a failed complete run
   inside an execution is unchanged. Check: `npm test -- --only
   process-debt` and `npm test -- --only compiler`.
4. `scripts/work-orders.mjs` (`parseHeader` and the index's Open card):
   read `**Review ladder:**` on an open order, refuse a value other than
   `full`, `combined` or `paired` there, and show the value on the card; a
   settled order's line is not judged;
   `packages/skeleton/src/loadouts/contributor.ts` (the same sentences):
   round one is one combined worker for `combined`, the three kinds and
   one combined worker each blind to the others for `paired`, and three
   reviewers otherwise, and a paired round's findings are recorded as the
   Design's fifth item states. Check: `npm test -- --only
   work-orders-fixtures`, `npm test -- --only process-debt` and `npm test
   -- --only compiler`.
5. `scripts/docs-check.mjs` (where a current decision record's JSON is
   read): admit an optional `roundFindings` array whose entries carry the
   five fields of the Design's fifth item with their admitted values, and
   refuse a malformed entry by decision and field; a record without the
   array passes. Record the `docs-check` task's time before and after.
   Check: `npm test -- --only docs-check-fixtures`.
6. `scripts/lib/plan-failures.mjs`: for each order whose header declares
   `paired` and whose decisions hold a `roundFindings` array, add to the
   report the counts of the Design's fifth item and the order's first
   verification verdict, and their sums. Check: `npm test -- --only
   plan-refutation`.
7. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: product 07 §Verification review and attack (the
   ladder paragraph: round one's admission rule is in the brief, the
   sentence that names this order as carrying a typed form goes, a fix
   dispatch's review is the one combined worker, an order's header sizes
   round one, and a paired round is recorded) and §Operator-opened
   planning pass (the header line among an order's fields, that
   `plan failures` reports the paired rounds, and that the pass reading
   fifteen of them sets the default); the kit guide's paragraph on an
   order's review ladder; `docs/evidence/WO-262/decisions.md`. Then the
   handoff sequence of product 07 §Discipline, with this order's own
   findings judged as the rule it carries states.

**Deliverables:** the brief's round-one rule; the refused report kept in
its lane; the executor's judgment rule
and fix rule; the header line with its three values; the typed array's
shape check; the paired rounds' table; the cases; the write-backs and the
decisions.

**Acceptance criteria (all required)**

1. `npm run worker -- review --kind criteria --host claude --order WO-262
   --dry-run`, and the same for `design`, `consistency` and `combined`,
   each prints a brief that carries the admission rule's sentence, and a
   `--round 2 --recheck <report> --dry-run` brief carries it too. In the
   review-worker case whose worker returns a criteria report with a
   disposition outside the three admitted, the lane holds that report
   under a name that marks it refused, the refusal line names its path,
   and the round has no recorded report.
2. Every installed executor root under `.claude/skills/` and
   `.agents/skills/` carries the judgment rule, and no installed root
   carries the clause `Fix or record every finding`. Check: the case of
   `packages/skeleton/test/executor-supports.test.ts` that reads the
   emitted executor root (`npm test -- --only skeleton`); `node
   scripts/harness.mjs check` shows the installed roots equal the emitted
   ones.
3. Every installed executor root states that a fix dispatch repairs the
   class its failed report names and runs one combined review over the
   repair's change since the tree that report judged, and no installed
   root says that a fix runs three round-one reviewers. Check: the same
   case and command as criterion 2.
4. Every installed executor root states the three sizes of round one and
   that a paired round's reviewers are blind to one another. `npm run
   work-orders -- index --check` passes on an order whose header carries
   the line with each of the three values and shows the value on that order's card, refuses any other value on an open
   order naming the order and the line, passes an open order whose header has no such line, which runs the full
   ladder, and passes a closed order's file whatever its line holds.
5. In the document fixture, `node scripts/docs-check.mjs` passes a current
   decision record whose `roundFindings` holds one entry of each class,
   fails naming the decision and the field on an entry whose class or
   finder is not an admitted value, and passes a record with no such
   array.
6. Given a fixture of two paired orders whose decisions hold
   `roundFindings`, `npm run plan -- failures` reports for each and in
   sum the findings of each class found by the combined worker alone, by
   the three kinds alone and by both, with each order's first
   verification verdict; an order that does not declare `paired`
   contributes nothing to that table.
7. Product 07 §Verification review and attack and the kit guide's ladder
   paragraph state the round-one rule, the fix dispatch's one review, the
   header line and the paired record, and link this order's decisions.
   The verifier reads the
   named section; `npm run test:docs` judges its links and form.
8. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only plan-refutation` for steps 1 and 6;
`npm test -- --only skeleton`, `npm test -- --only process-debt` and
`npm test -- --only compiler` for steps 2 to 4; `npm test -- --only work-orders-fixtures` for step 4;
`npm test -- --only docs-check-fixtures` for step 5; the structural
phase; the complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-262/`: the four dry-run briefs
of criterion 1 and the recheck brief; the executor root's review sentences
before and after; criterion 5's three outputs and the task's two timings;
the report of criterion 6; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 7 and criterion 7; sources and
reopening conditions in `docs/evidence/WO-262/decisions.md`.

**Known issues and carry-ins:**

- FUP-6fe1262fb31292b3 (WO-259-D022), FUP-67944ed9c85b7199 (WO-259-D021)
  and FUP-c052a580e9f69291 (WO-260-D028): this order is their allocation.
- FUP-eed385be08e5bdd9 (WO-226-D022, the role oracle and the gate
  follow-up cases) is allocated to WO-264, which removes the chain. This
  order mints one more baseline in it and does nothing else for that row.
- This order runs today's full ladder itself. Its own round one is not
  paired, since the paired round is what it builds.
- A finding's class is the executor's judgment, written before the
  verifier has spoken; the pass that reads the table also reads each
  order's verifier findings against it.
- The verifier reads the review reports before it attacks, so a
  verifier's finding is not independent of the reviewers; the table
  compares reviewers with one another and does not compare them with the
  verifier.
- Under Codex the launches of a paired round are the helper's, counted as
  the role text counts every launch.
- A reviewer on the other host reads the same brief through the review
  helper, so no second text is kept in step.
- A fix after a failed final review follows the same fix rule; the final
  reviewer's own reviews are not this order's subject.
- From this pass's first refutation: The executor now judges findings on
  its own change: the watch is the record's five-of-eight share of failed
  first verifications and any verification that fails on a finding the
  round's decision declined, which the pass that reads the paired rounds
  also reads.

**Non-goals:** a check that reads a decision's or a report's prose, or
that refuses a fix; a field in the review protocol; removing the readers
WO-259 added; the recheck and the third round of an execution's ladder, the
fifty-line figure for
a repair inside an execution, or the cap; a rule that sizes a review from
the diff; a value for no review; the verifier's and the final reviewer's
routes.

**Operator-review assumptions:** that the three questions of WO-259-D022
(the writer, the failure's direction and the cost) are the judgment the
operator asked for, written before a fix; that a fix after a failed
verification takes one combined review of the repair, the whole candidate
being verified again afterwards; that one more worker in round one, for
the orders of this sequence, is a fair price for a record that says
whether one reviewer finds what three do; and that fifteen paired rounds
are enough for a pass to set the default by.
