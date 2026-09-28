# WO-172 — Failures reach planning: `plan failures` lists the failed judgments, repairs, corrections and off-ramps since the last pass from the public record, `plan start` prints their counts, the meter carries each order's failed judgments and the process-health line says how many first verifications failed, and the direction count reads what the operator did (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. One read-only command family over
records that already exist, one block in `plan start`, four counted
fields in the meter and one reader in its direction count; no control
event, register schema, gate step or refusal. Assigned at activation under
the standing opt-out default.
**Cost:** adds `npm run plan -- failures` (a bounded page of the failed
judgments, repairs, corrections, off-ramp events and execution amendments
recorded in a window, with `--since`, `--until`, `--all` and
`--export <file>`), one block of at most 1 KB in `plan start` with the
window's counts and the number of orders closed since the latest filed
Entropy Reducer review, four per-order fields and one eight-order summary
in the meter, a reader in `operatorDirections`, the paraphrase of the
decision dispatch fields that hold the operator's words (a pattern search
finds fifteen candidates at the base), and one sentence in product 07's
planning procedure. Removes: the hand count the
2026-09-28 pass paid to see what failed (fourteen throwaway scripts and
eight read-only surveys: 2,880,914 tokens and 453 tool uses by the harness
readback of the agent tasks); the blind spot itself, since no instrument a
pass reads at entry counts a failed judgment, a repair or a correction
while the record holds 96, 99 and 56; a process-health line that reads
"0 reopen candidates" beside 23 failed first verifications in 29 orders;
a direction count that WO-170's final review found to read 71 of 871
dispatches while 165 others name the operator after `resume:` (D019);
the register row eight dispositions kept open (FUP-71fc2efc208f597a).
Re-mints: none (`scripts/refute-plan.mjs`,
`scripts/lib/meta.mjs` and the new module are not registered evidence
sources; `docs/evidence/*/decisions.md` is not one either). Wall-clock,
tokens and context bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's 2026-09-28 direction during the
planning pass (about a hundred failures across the phases, planning among
them for not noticing, to be addressed; they should all have been
documented), captured in ignored intake (SHA-256 in the ledger section);
this pass's count of the control logs and decision records
([planning document](../planning/failures-across-phases-2026-09-28.md)
§2, §7 and §8) and its [inventory](../planning/failure-inventory-2026-09-28.md);
register rows FUP-80a2f11e1e0874d8 (WO-170 D019), FUP-71fc2efc208f597a
(WO-085 D004), FUP-abfdb650f125a77f (WO-151 D007) and
FUP-ba35c0b5ae47cfb8. Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: the command prints identifiers, dates and
counts and never a decision's or a report's text; no stop condition.
**Depends on:** WO-167 merged (product 07 holds 9 bytes of headroom until
the fold lowers and resets its ceiling); WO-170 merged (the per-order
snapshot and the direction count this order extends; closed, v0.52.8);
WO-169 merged (the feed's page bound and export destination rule this
order reuses; closed, v0.52.4).
**Recommended placement:** paired with WO-065 in the third slot, after
WO-116 and WO-173. This order edits `scripts/refute-plan.mjs`,
`scripts/lib/meta.mjs`, one new module under `scripts/lib/`, their
fixtures, dispatch fields of closed orders' decisions under
`docs/evidence/`, the planning section of product 07 and
`docs/planning/sequence.md`; WO-065 edits a different new module under
`scripts/lib/`, `scripts/worktree.mjs`, `scripts/test-target-publish.mjs`
and product 02. Disjoint files; neither depends on the other; neither
re-mints for the other. It follows WO-173 because both write one sentence
into product 07. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "product 07 has 9 bytes of headroom until the fold resets its ceiling"
  },
  {
    "workOrderId": "WO-170",
    "relation": "satisfied-by-close",
    "reason": "the per-order snapshot and the direction count this order extends"
  },
  {
    "workOrderId": "WO-169",
    "relation": "satisfied-by-close",
    "reason": "the feed's page bound and export destination rule"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§2, §7, §8 and §10; `scripts/refute-plan.mjs` (`start`, `followups`);
`scripts/lib/planning-followups.mjs` (the page bound, the cursor and
`exportDestination`); `scripts/lib/control-time.mjs`
(`completedPhaseAttempts`); `scripts/lib/meta.mjs` (the per-order
`metrics`, `trapRows`, `operatorDirections`, the process-health line and
`--plan-cost`); `docs/control/resume.jsonl` and `docs/control/orders/`;
`docs/control/plan-refutations.jsonl`; `docs/evidence/WO-170/decisions.md`
D019; `docs/evidence/WO-085/decisions.md` D004 and
`docs/evidence/WO-153/decisions.md` D008; `scripts/docs-check.mjs`
(`validDispatch`, the dispatch fingerprints of `doc-baseline.json`);
07-execution-guide.md §Operator-opened planning pass;
`docs/planning/followups.md`.

**Objective:** a planning pass is shown what failed since the pass before
it (each failed report by path, each repair, each correction, each
off-ramp and each execution amendment) by one command over the public
record, sees the counts when it opens, and reads the same counts per order
in the meter; the operator's directions are counted from what the operator
did.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`):**

- The control logs record 214 verifications and 128 final reviews, 96 of
  them failed, and 99 repairs, across 117 orders; the first verification
  failed in 54 orders, and in 23 of the 29 made ready since 2026-09-22.
  `resume status` prints each order's latest verdict and "0 reopen
  candidates"; the generated index marks every closed order
  final-reviewed; the planning cost table's 46 rows hold no metrics and
  its five trap series count no judgment; `plan start` prints the
  register's first page.
- 56 decisions record a correction. Two name a follow-up, so 54 never
  entered the register, which admits a decision by its `followup`.
- `operatorDirections` counts 71 of 871 dispatches; 165 others in 44
  orders name the operator after `resume:` (WO-170 D019).
- 228 of the 928 decision dispatch fields name the operator. A pattern
  search finds fifteen that may hold the operator's words: six carry a
  quotation of 25 characters or more and nine continue in lower case
  after a colon, three of those nine being the control phrase itself
  (WO-049 D002, D005 and D006). The latest candidate is dated
  2026-09-25, before the dispatch check landed (WO-085, 2026-09-26). A
  pattern cannot tell a paraphrase from a quotation; a reader can.
- The latest filed Entropy Reducer review ended at 2026-09-25T01:32Z;
  sixteen orders have passed final review since, and nothing says so when
  a pass opens (WO-151 D007).

**Design (scope discipline):**

- One new module folds the older control log, the order segments, the
  planning control log and the structured decisions into a list of items:
  `failed-judgment` (order, report id, phase, recorded time, report path,
  the judge's attested harness, model and effort), `repair` (order, the
  report it answers, recorded time), `correction` (decision id, date, the
  phase its dispatch names), `off-ramp` (event type, order, recorded
  time) and `amendment` (order, decision id, recorded time, withdrawn or
  not; an overridden hold by its receipt). A correction is a decision
  whose `kind` is `correction` or that carries a `misread` field. An item
  prints identifiers, dates and paths, never the text of a report or a
  decision. A decision carries a date and no time, so it belongs to a
  window when its date lies between the window's first and last day,
  both included.
- `plan failures` prints one page under the feed's bound (8 KB), newest
  first, with the window, the counts and a `next` cursor. The default
  window opens at the completion time of the latest planning receipt;
  `--since <time>` and `--until <time>` bound it and `--all` removes the
  lower bound. `--export <file>` writes every item of the window under
  the destination rule `followups --export` uses. An item whose event
  carries no time is listed as `recordedAt: unknown` and belongs to
  `--all` only.
- Counts, for the window and for the whole record: failed verifications,
  failed final reviews, repairs, orders made ready, orders whose first
  verification failed, corrections, off-ramp events, amendments. When
  the local gate index exists the page adds the number of failed gate
  rows per order, labeled local and counted only.
- `plan start` prints the window's counts, the command and the number of
  orders whose final review passed since the latest filed Entropy
  Reducer review ended. It suggests nothing and schedules nothing.
- The meter's per-order metrics gain `failedVerifications`,
  `failedFinalReviews`, `repairs` and `recordedCorrections`, read from
  the control fold and the decisions, so an order whose journals are gone
  still has them. The process-health line and the cost table gain one
  summary: in how many of the last eight closed orders the first
  verification failed. No threshold, trap rule or reopen candidate is
  added.
- `operatorDirections` also counts a lifecycle dispatch that names an
  operator step (a correction, a direction, a scope expansion, an
  override, a takeover or an answer) after its `resume:` prefix. The
  executor first files a hand classification of every decision dispatch
  that names the operator; the reader is judged against it.
- The hand classification reads every dispatch that names the operator,
  so the same reading lists the fields that hold the operator's words,
  beginning from the fifteen candidates. Each listed field is
  paraphrased in place under the dispatch check's rule (a control prefix
  and at most 240 characters on one line). The comparison the executor
  files names each decision, the SHA-256 of the field before and the
  field after; it never holds the earlier text. This is the correction
  route for a closed order's decision record: the field changes, the
  decision and its evidence do not.
- **Declined alternatives, recorded:** admitting every correction to the
  register (a correction is a record of what changed, and 54 rows a
  month would refill the feed the 2026-09-19 pass emptied; the feed
  lists them and the pass decides which pattern needs a row); a
  threshold that holds planning or activation (the meter measures and a
  pass decides; product 07 §Goal-aligned decisions); attempts in the
  generated index (the console parses its pinned text; the map's
  preserved candidate for JSON forms reopens first); a required
  structured field for operator steps (a new duty on every decision,
  where the reader costs none; reopened by criterion 5's fallback).

**Deliverables:** the module and the command; the `plan start` block;
the meter's fields and summary; the direction reader and its hand
classification; the paraphrased fields and their comparison; fixtures;
the write-backs below.

**Acceptance criteria (all required)**

1. With `--all --until 2026-09-28T04:00:00.000Z` on this repository the
   command counts 86 failed verifications, 10 failed final reviews, 99
   repairs, 117 orders made ready with 54 failed first verifications, 56
   corrections, one waiver, 25 execution amendments with one withdrawal
   and three overridden holds, the figures of the inventory at
   `5f3849ec`. A difference is reported with the item that causes it,
   and the executor records which count is right. A fixture record
   holding one item of each kind, one event without a time and one
   decision with a `misread` field and no `kind` proves each count, the
   `unknown` time and the page bound.
2. The default window opens at the latest planning receipt's completion
   time. `plan start` prints the window's counts and the command in at
   most 1 KB, prints zero counts for an empty window, and still opens the
   branch when the counts cannot be computed, with one line saying why.
3. `plan start` prints the number of orders whose final review passed
   since the latest filed Entropy Reducer review ended; a fixture with no
   filed review prints `unknown`.
4. `npm run meta` gives each closed order the four fields, including an
   order with no retained journal; the cost table stays within its 64 KB
   bound; the process-health line and the table say in how many of the
   last eight closed orders the first verification failed; a fixture
   with fewer than eight closed orders states the number it counted.
5. The hand classification lists every decision dispatch that names the
   operator, with the class the executor read. The reader agrees with it
   on at least 95 of every 100 dispatches and each disagreement is
   listed. Below that agreement the reader is not shipped, the count
   stays as WO-170 left it, and the classification returns to planning
   as this order's decision with its follow-up.
6. The executor lists every dispatch field it judges to hold the
   operator's words and states its judgment of each of the fifteen
   candidates, a candidate it leaves unchanged with the reason. Each
   listed field passes the dispatch check after the change; the
   comparison names each changed decision with both digests;
   `npm run meta` regenerates the decisions index; the register rows
   whose source revision moved are listed for the final review. The
   claim is the executor's reading of the 228 fields, recorded, not that
   no quotation remains anywhere in the record.
7. Write-backs land: product 07 §Operator-opened planning pass gains, in
   place, the sentence that a standard pass reads `plan failures` and
   disposes what it lists (at most 400 bytes added to product 07);
   `docs/planning/sequence.md` loses the interim paragraph the
   2026-09-28 pass wrote; `docs/planning/followups.md` names the command
   in one sentence; the decisions file; publication locks where product
   07 changed.
8. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the command's output on this
repository for criterion 1; the hand classification; the comparison;
`npm run test:docs`; `npm test -- --review` at final review. No live row.

**Write-back duty:** as listed in criterion 7. Record corrections the
same day as what was misread, meant and changed.

**Non-goals:** classifying a failure's cause (a planner's reading, as the
inventory is); any refusal, hold, threshold or schedule; the register's
collector; the generated index and `resume status`; release close's
record of its own outcome and the retention of failed gate output (map
candidates of the 2026-09-28 pass); rewording any part of a decision
other than a listed dispatch field; any filed report.

**Operator-review assumptions**

1. Counting is enough: a pass that sees the failed reports reads them,
   and no gate has to make it.
2. A closed order's decision may have its dispatch field paraphrased by
   a later order when the change is recorded by digest; the rest of the
   record stays as filed.
3. Ninety-five in a hundred is the agreement at which a reader may
   replace a hand count; the operator may set another figure at review.
