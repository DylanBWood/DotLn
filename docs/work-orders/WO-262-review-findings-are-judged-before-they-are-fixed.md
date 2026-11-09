# WO-262 — Review findings are judged before they are fixed: the ladder's briefs admit a blocking finding only on an input a writer produces or a leak, the executor records its judgment of each finding as typed fields before writing a fix, and the document check refuses a fix recorded against its own judgment

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. One admission rule in the canonical
review brief of every kind and round; one rule in the executor's role text;
one optional typed field on a decision record with its check. Assigned at
activation under the standing opt-out default.
**Cost:** adds, in `scripts/lib/review-worker.mjs`, the admission rule in
the brief's preamble; in `packages/skeleton/src/loadouts/contributor.ts`
(the executor), the judgment rule, measured against the cold-start ceiling
under the standing route; in `scripts/docs-check.mjs`, the shape and the
one refusal for a decision record's `reviewFindings` array, recurring work
in the document gate over records it already parses (unmeasured, and
measured by this order as the `docs-check` task's time before and after);
cases in the suites the Preflight names; product 07, the kit guide and the
decisions. Removes these states: a finding fixed because a reviewer marked
it blocking; a second parser written for a spelling no writer produces and
reverted hours later; thirteen of one order's twenty findings each adding
parsing and cases for inputs outside what its writers produce; a round's
record that says what was fixed and not why. Tokens and wall-clock: unknown
until this order's handoff records them. Re-mints: the role oracle edition,
deterministically (`contributor.ts` is a registered evidence source);
`packages/skeleton/src/change-review-protocol.ts` is in
`FEEDBACK_SOURCE_PATHS` and this order leaves it unchanged, so no live
feedback episode is owed. Steps: the executor's, below.
**Nomination provenance:** the operator's direction during WO-259 that the
executor's adoption of review findings without judgment be marked critical
and reviewed at the next planning session
([WO-259-D022](../evidence/WO-259/decisions.md#wo-259-d022), ignored
captures SHA-256
`7f326f7487ede475fe6c7d7cb4d65985568f45b3bd135a57c483154909b45b73` and
`177daeeeb3c7514471d5eb40b0ea6a5f37163a1e45b22d74e764f13d24b26dd8`;
FUP-6fe1262fb31292b3); the reviewer's admission rule that order boarded
([WO-259-D021](../evidence/WO-259/decisions.md#wo-259-d021),
FUP-67944ed9c85b7199); the operator's dispatch of 2026-11-08 (ignored
capture SHA-256
`a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`), item 4.
**Depends on:** WO-250 (closed, v0.111.0) and WO-255 (closed: the ladder,
the review helper and its briefs this order adds a rule to); WO-244
(active: it edits `scripts/lib/review-worker.mjs` and
`packages/skeleton/src/loadouts/contributor.ts`, which this order edits
after its merge); WO-261 (open: it edits the same role file first).
**Recommended placement:** fourth, after WO-261. The rule itself is in
force from this order's pass, which wrote it into product 07 §Verification
review and attack and into the handoff step of the orders it filed; this
order carries the rule into the brief and the role text and gives the
record its typed form.
**Cites (read these sections):** product 07 §Verification review and attack
(the routes, the supported-input rule for a verifier's blocking finding and
the ladder); `scripts/lib/review-worker.mjs` (the canonical brief and its
preamble); `packages/skeleton/src/loadouts/contributor.ts` (the executor's
review sentences); `scripts/docs-check.mjs` (how a decision record's JSON
is read, `requestedQuotes` as the neighbor that reads a typed field);
[WO-259-D016 to D022](../evidence/WO-259/decisions.md) (the four rounds).

**Objective:** A review finding changes code only after someone has said
which writer produces the input it names, whether the failure admits
something wrong or refuses something valid, and what the fix costs. The
reviewer is told what blocks; the executor writes that judgment down in a
form a check and a later reader can read; and a fix that contradicts its
own recorded judgment does not pass the document gate.

**Observed gap (dated 2026-11-08 at `main` `13e8d47eb`, v0.122.0):**

- Product 07 §Verification review and attack gives the verifier an
  admission rule (a blocking finding names the criterion and the supported
  input that reproduces it; a constructed input outside the supported
  vocabulary is a follow-up) and gives the ladder's later rounds one (a new
  finding is admitted only when it breaks a criterion or behavior `main`
  had). Round one had none: at the base its sentence read that the executor
  fixes or records every distinct finding, and the installed executor root
  reads `Fix or record every finding`, with nothing on how to choose.
- WO-259 ran four review rounds and twenty findings. Thirteen were defects
  of hand-written readers on inputs outside what the kit's writers or an
  author's ordinary text produce (WO-259-D021 lists them), and each fix
  added parsing and cases. In round 4 the executor wrote a second JSON
  reader for an escaped key spelling because the reviewer had marked the
  finding blocking, and reverted it after the operator objected
  (WO-259-D021, D022). The order's implementation phase ran 7 h 1 min
  against a 1 h 39 min median over the control record.
- The fork reports the same shape after starter v0.120.1: one order's
  implementation at more than twice its median with nineteen findings in
  round one (its block after v0.122.0, item 7).
- A round's decision record names each finding and its fix in prose. No
  field says which writer produces the input or which way the failure
  falls, so neither a check nor the final reviewer can tell a judged fix
  from an obeyed one.

**Design (scope discipline):**

- One standard for every reviewer: the verifier's supported-input rule
  applies to the ladder from round one. A finding blocks when it names the
  criterion it fails and an input the kit's writers or an author's ordinary
  text produce, or a leak (a copy, a broken link or a wrong pass admitted),
  or behavior `main` had with the probe that shows it. Anything else is
  reported as a recorded finding. Rejected: a separate, looser rule for
  round one (the axis is where the cost was: round one is where WO-259's
  thirteen and the fork's nineteen arrived).
- The judgment is the executor's and is written before the fix: for each
  finding, the writer that produces the input (or `none`), the failure's
  direction (`open` when something wrong is admitted, `closed` when
  something valid is refused with a plain remedy), the fix's cost in the
  executor's words, and the disposition. An open failure is fixed. A closed
  failure on a real writer's input is fixed. A closed failure on an input
  no writer produces is recorded with no code. A parsed structure
  (`JSON.parse` rows, the pinned Markdown parser's tree) is preferred to a
  new scanner of source text.
- The record is typed fields in the round's decision, read with the JSON
  reader the document check already uses. Rejected: a new report field in
  the review protocol (the axis is cost: `change-review-protocol.ts` is
  feedback-judged, so that route owes a live episode, and the judgment is
  the executor's, not the reviewer's). Rejected: a prose rule alone (the
  axis is the record of 2026-11-08: the sentence that the remaining
  judgment is the executor's was already in product 07 and was not
  applied). Rejected: a scanner that matches a round's report against the
  decisions (the axis is the operator's objection itself: it would be one
  more hand-written reader of Markdown).
- The code WO-259 wrote for such inputs stays. This order's pass decided
  that (its planning document, §NoOps): the HTML link reading closes an
  open failure with a shared decoder, and removing the two closed cases in
  `requestedQuotes` would cost a change and its review for inputs no
  writer produces.

**Execution plan (the executor follows these steps in order; observed at `13e8d47eb`, 2026-11-08):**

1. `scripts/lib/review-worker.mjs`: the canonical brief's preamble, for
   every kind and every round, states the admission rule of the Design's
   first item and asks each finding to say which writer produces its input
   or that it found none. Check: `npm test -- --only plan-refutation` and
   the review-worker cases (`node scripts/harness.mjs bounded -- node --test
   scripts/test-review-worker.mjs`).
2. `packages/skeleton/src/loadouts/contributor.ts` (the executor): replace
   the clause that reads `Fix or record every finding` in the installed
   executor root with the judgment rule of the Design's second item, naming the
   `reviewFindings` field of the round's decision and saying that a
   reviewer's label is the reviewer's claim. Measure the executor root
   against its ceiling under the standing route. Check: `npm test -- --only
   process-debt` and `npm test -- --only compiler`.
3. `scripts/docs-check.mjs`: where a current decision record's JSON is
   read, admit an optional `reviewFindings` array whose entries carry `id`,
   `writer` (a nonempty string, `none` when no writer produces the input),
   `failure` (`open` or `closed`), `cost` (a string) and `disposition`
   (`fixed` or `recorded`); refuse a malformed entry by decision and
   field, and refuse an entry with `writer` `none`, `failure` `closed` and
   `disposition` `fixed`, saying that such a finding is recorded and not
   fixed. A record without the field passes, as every record filed before
   this order does. Record the `docs-check` task's time before and after.
   Check: `npm test -- --only docs-check-fixtures`.
4. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: product 07 §Verification review and attack (the
   field's name and the check, beside the rule the pass wrote); the kit
   guide §Planning in this instance or the section that describes an
   order's review ladder to an instance, whichever states it today;
   `docs/evidence/WO-262/decisions.md`. Then the handoff sequence of
   product 07 §Discipline. This order's own rounds are recorded with the
   field it adds.

**Deliverables:** the brief's rule; the executor's rule; the typed field
with its shape check and its one refusal; the cases; the write-backs and
the decisions, whose own round records use the field.

**Acceptance criteria (all required)**

1. `npm run worker -- review --kind criteria --host claude --order WO-262
   --dry-run`, and the same for `design`, `consistency` and `combined`,
   each prints a brief whose preamble carries the admission rule's
   sentence, and a `--round 2 --recheck <report> --dry-run` brief carries
   it too.
2. Every installed executor root under `.claude/skills/` and
   `.agents/skills/` carries the judgment rule naming `reviewFindings`, and
   no installed root carries the clause `Fix or record every finding`;
   `npm run meta -- --check` reports no ceiling breach without a recorded
   acceptance.
3. In the document fixture, `node scripts/docs-check.mjs` passes a current
   decision record whose `reviewFindings` holds one `open` and `fixed`
   entry and one `closed`, `none` and `recorded` entry; fails, naming the
   decision and the field, on an entry whose `failure` reads another word;
   fails, naming the decision and the entry, on a `closed`, `none` and
   `fixed` entry; and passes a record with no such field.
4. Each review round this order runs is recorded in
   `docs/evidence/WO-262/decisions.md` with a `reviewFindings` entry for
   every finding its reports list, which `node scripts/docs-check.mjs`
   accepts.
5. Product 07 §Verification review and attack names the field and its
   check beside the rule and links this order's decisions. Check:
   `npm run test:docs`.
6. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only plan-refutation` for step 1;
`npm test -- --only process-debt` and `npm test -- --only compiler` for
step 2; `npm test -- --only docs-check-fixtures` for step 3; the structural
phase; the complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-262/`: the four dry-run
preambles of criterion 1; the role root's measured bytes; criterion 3's
four outputs; the task's two timings; `npm run resume -- status --json`
after `implementation-ready`.

**Write-back duty:** as listed in step 4 and criterion 5; sources and
reopening conditions in `docs/evidence/WO-262/decisions.md`.

**Known issues and carry-ins:**

- FUP-6fe1262fb31292b3 (WO-259-D022) and FUP-67944ed9c85b7199
  (WO-259-D021): this order is their allocation.
- FUP-eed385be08e5bdd9 (WO-226-D022): this order re-mints the role oracle,
  which is that row's condition; the executor reads the row and does its
  work within the Boy Scout bound or records why not.
- The cold-start rows (FUP-89b7b9f657765e83 and its five neighbors) stay
  deferred: step 2 replaces a sentence and may add bytes, and the standing
  route records the measured root.
- Criterion 4 needs at least one review round; a ladder that ends with
  three clean round-one reviews records an empty array for each report and
  says so.
- A reviewer on the other host reads the same brief through the review
  helper, so no second text is kept in step.

**Non-goals:** removing the readers WO-259 added; a field in the review
protocol or a reviewer's report; a check that reads a report's prose;
changing the ladder's rounds, the fifty-line figure or the cap; the
verifier's and the final reviewer's routes, which already bind a blocking
finding to a criterion and a supported input.

**Operator-review assumptions:** that the three questions of WO-259-D022
(the writer, the failure's direction and the cost) are the judgment the
operator asked for, recorded before a fix and not after; that a closed
failure on an input no writer produces is recorded without code, as that
decision proposed; that the final reviewer reads the field as it reads any
decision and returns a fix that contradicts it, with no further machinery;
and that the fork's cycle figures are as it reported them.
