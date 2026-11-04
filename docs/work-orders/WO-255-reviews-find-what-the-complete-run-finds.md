# WO-255 — Reviews find what the complete run finds: the planning reviews lane is keyed by branch so two passes on one day each get their reviews, a recheck reads the whole change again instead of the repair alone, the consistency review carries a traced-consumers table the helper refuses to record without, and the criteria adversary on a planning subject receives the operator's dispatch and answers item by item (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. One lane name, one recheck rule, one
required report section and one helper flag; WO-250's ladder keeps its
end and product 07's preflight rule is unchanged. Assigned at activation
under the standing opt-out default.
**Cost:** adds, in `scripts/lib/review-worker.mjs`, a planning lane named
by the branch (`reviewsLane` 175 to 185 names `planning-<date>`, so the
second pass of a day is refused its round 1 at `requireRoundInputs` 271 to
287: the operator's item 16 and the fork's item 9 of 2026-11-03), `--since
<tree>` admitting a fresh round 1 over a named base, a recheck brief that
confirms the earlier findings and reviews the whole current change against
the base again (`ladderRule` 289 to 299 today says "review nothing else",
which is why a recheck over a repair reports zero findings while the
complete run then fails: the operator's item 17), a `Traced consumers`
table required of every consistency report (changed contract, consumer by
path, the command run, the result), refused by `worker record` and by the
helper when absent or empty, with the kit's generated pages and the fixture
manifests as named rows the reviewer fills, and `--capture <file>` for a
planning subject's criteria review, which appends the operator's dispatch
capture to the brief and requires a per-item table (item, where the
subject acts on it or reviews it, or `missing`) in the report (the
operator's item 15: "make sure adversarial is given my prompt and it
checks to make sure each point has been acted on or reviewed"). Removes: a
same-day second pass with no reviews through the helper; a zero-findings
recheck over a repair; a consistency report that traced nothing and said so
nowhere; a reviewer that never read the dispatch it was meant to check.
Wall-clock: a recheck that reads the whole change costs a round's reading
again, bounded by WO-250's ladder; the table is the reviewer's own
commands; the capture is bytes appended to one brief; each measured before
and after in the decisions from the recheck rounds' durations. Context
bytes: this file, about 14,000; the executor root grows by the recheck
sentence, measured against its ceiling. Commands: none new (`--since` and
`--capture` are flags). Tokens: unknown until run. Steps: 7. Re-mints:
`contributor.ts` is a runtime source the executor checks at activation;
`scripts/lib/review-worker.mjs` is a declared machinery source, so `npm
test -- --review` runs before handoff; no feedback-judged source changes.
**Nomination provenance:** the operator's items 15, 16 and 17 of the
2026-11-03 planning dispatch and the fork's item 9 of its second block of
2026-11-03, captured in ignored intake
`docs/intake/planning-dispatch-2026-11-03-recurring-failures.md`, SHA-256
`4c7e47a6548004d909128fdfcc346663fc419280b798d00abec73d7ffb180f83`; WO-241-D004
(FUP-1398fcdb63df23d2: `worker record` accepting the actual host, model
and effort), WO-250-D015 (FUP-60ea250ef102cc46: prose reports with JSON
examples) and WO-250-D016 (FUP-2bcb656e4fc1e7f6: the review-provenance
remainder), allocated here. The operator's item 15 named the model for
this pass's own reviews ("GPT Astra 6 Max": the Codex model `gpt-6-astra`
at reasoning effort `max`, the id the operator's own Codex sessions run);
that is a one-time instruction the pass followed (its §Validation), not a
rule, and this order writes no pin. Filed by the
[2026-11-03 pass](../planning/passes/recurring-failures-and-queue-drain-2026-11-03.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-250 (closed, v0.111.0: the helper, the ladder and the
lane this order changes).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-250",
    "relation": "satisfied-by-close",
    "reason": "the review helper, its ladder, its lane and its record command this order changes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/review-worker.mjs`
(`REVIEW_USAGE` 56; `parseReviewArgs` 60 to 100; `resolveSubject` 104 to
131; `reviewsLane` 175 to 185; `requireRoundInputs` 271 to 287;
`ladderRule` 289 to 299; `renderReviewBrief` 307 to 345; `record` from
779); `packages/skeleton/src/loadouts/contributor.ts` (`reviewerBriefs`:
the consistency brief at 87, the criteria adversary at 83); product 07
§Discipline (the ladder) and §Paired passes and the synthesis pass (the
reviewed route); WO-250's order and FINAL-001; the operator's quoted
session text in item 17 of the nomination capture; this pass's
§Validation (its three Codex reviews and what the brief carried).

**Objective:** A recheck is a review, not a receipt for the repair; a
consistency report shows the consumers it traced and the commands it ran,
or it is not recorded; two passes on one day each get their reviews; and
the adversary that reads a planning pass reads the operator's words and
says, item by item, where each was acted on.

**Observed gap (dated 2026-11-03 at `main` `eb7c58ff6`, v0.114.0):**

- `reviewsLane` names a planning lane `planning-<YYYY-MM-DD>`; `requireRoundInputs`
  refuses a round 1 when the lane holds a prior report. The fork's second
  pass of 2026-11-03 could not run its three reviews through the helper
  and ran them under its filed order's subject; the operator's item 16.
- `ladderRule` for round 2 and later: "confirm or refute the fixes of the
  earlier findings listed below on the current tree, and review nothing
  else." The operator's quoted session (item 17): four findings in round
  1, zero in the rechecks that covered only each repair, then the complete
  run exposed missed fixture dependencies, an invalid runtime assumption,
  an outdated output assertion and a stale generated page after a kit
  update.
- The consistency brief (contributor.ts 87) asks the reviewer to trace
  each changed contract to every consumer and to report producer/consumer
  pairs; nothing in the helper or `worker record` requires that table in
  the report, so a report without it is recorded as a review.
- `renderReviewBrief` composes the worker definition, the brief, the
  subject and its diff; it has no input for the operator's dispatch. This
  pass ran its three reviews with the per-item table inside its own
  document, the only route the helper offers (§Validation).

**Design (scope discipline):**

- **The lane is the branch.** A planning subject's lane is
  `planning-<branch slug>`; `--since <tree>` admits a fresh round 1 over
  that base in any lane. Rejected: a lane per hour (axis: a pass is a
  branch, not a time).
- **A recheck is a round.** The recheck brief confirms the earlier
  findings and then reviews the whole current change against the base
  again; the ladder keeps WO-250's end (round 1, one recheck, one combined,
  the executor's judgment). Rejected: a recheck over the repair's diff only
  (axis: the repair's diff is where the zero-findings reports came from).
  Rejected: a complete gate run before round 1 so the reviewers read its
  result (axis: product 07 §Preflight before the full gate is the
  operator's standing rule on when the complete gate is paid, and the
  operator's item 17 asks the reviewers to find what the run finds, not
  for another run; the pass's NoOp records it, reopening on the operator's
  word).
- **A table or no report.** The consistency report's `Traced consumers`
  table is required by the helper and by `worker record`; the generated
  pages and the fixture manifests are named rows the reviewer fills with
  the command it ran. Rejected: trusting the brief (axis: the brief already
  asks; the record did not require).
- **The adversary reads the operator.** `--capture <file>` appends the
  dispatch capture to a planning subject's criteria brief and requires the
  per-item table. Rejected: a fourth reviewer kind (axis: the criteria
  adversary's question, "was each point acted on", is already its brief's
  question over criteria). The capture is ignored intake; the brief carries
  its bytes to the worker and the report carries no verbatim operator
  words, only the item numbers and the subject locations.
- **Live-run surfaces at the base.** The helper, the lane, the briefs,
  `worker record`: exist. The branch lane, the `--since` round 1, the
  whole-change recheck, the table, the capture flag: absent.

**Execution plan (the executor follows these steps in order; observed at `eb7c58ff6`, 2026-11-03):**

1. `scripts/lib/review-worker.mjs` (`reviewsLane`, `requireRoundInputs`):
   the planning lane by branch slug; `--since` admits a fresh round 1 in
   any lane and the record names the base. Check: `npm test -- --only
   review-worker` with two planning branches on one date each getting a
   round 1, and a `--since` round 1 in a lane with a prior report.
2. `scripts/lib/review-worker.mjs` (`ladderRule`): the recheck brief
   confirms the listed findings and reviews the whole current change
   against the base; the combined round unchanged. Check: `npm test --
   --only plan-refutation` asserting the round-2 brief text.
3. `scripts/lib/review-worker.mjs` (the report parse and `record`) and
   `packages/skeleton/src/loadouts/contributor.ts` (the consistency brief):
   the `Traced consumers` table (changed contract, consumer path, command,
   result) with named rows for the generated pages and the fixture
   manifests, required of a consistency report by the helper and by
   `worker record`, refused by name when absent or empty; the brief says
   so; `worker record` accepts the actual Agent host, model and effort
   (WO-241-D004) and preserves a prose report holding JSON examples
   (WO-250-D015). Check: `npm test -- --only plan-refutation` with a report
   lacking the table refused and one carrying it recorded; `npm test --
   --only harness-context`.
4. `scripts/lib/review-worker.mjs` (`parseReviewArgs`, `renderReviewBrief`,
   the report parse): `--capture <file>` for `--subject planning --kind
   criteria`: the file's bytes appended under `## The operator's dispatch`
   in the brief; the report's `## Items` table (item, location in the
   subject, `acted on` / `reviewed` / `missing`) required when the flag was
   given; the record names the capture's SHA-256, the brief's base and the
   report it answered (WO-250-D016), and never the capture's bytes. Check:
   `npm test -- --only plan-refutation` with a planted capture of three items
   and a report missing the table refused.
5. `packages/skeleton/src/loadouts/contributor.ts` (the executor's review
   sentences): the recheck reads the whole change; the consistency report's
   table; `npm run sync`; each root measured against its ceiling. Check:
   `npm test -- --only harness-context`.
6. Write-backs: product 07 §Discipline (the ladder's recheck; the table)
   and §Paired passes and the synthesis pass (the capture flag, which
   `plan review` passes for the criteria review once WO-244 lands, else the
   planner's role text names it); the kit guide §Reviews;
   `docs/evidence/WO-255/decisions.md` (the recheck rounds' findings
   counts and durations before and after over the next two orders); `npm
   run meta`; `npm run publication:check`.
7. Handoff: the sequence of WO-253 step 10, with
   `docs/evidence/WO-255/handoff.md`.

**Deliverables:** the branch lane and `--since` round 1; the whole-change
recheck; the traced-consumers table and its refusal; the capture flag and
the items table; product 07 and the kit guide.

**Acceptance criteria (all required)**

1. In the review-worker fixture, two planning branches checked out on the
   same date each run a round 1 criteria review through `npm run worker --
   review --kind criteria --host claude --subject planning --dry-run`, each
   naming its own lane by branch slug; a lane holding a round 1 report
   admits a fresh round 1 with `--since <tree>` and the record names that
   base.
2. The round 2 brief printed by `--dry-run --recheck <report>` says the
   worker confirms the listed findings and reviews the whole current
   change against the base; the combined round's text is unchanged.
3. `npm run worker -- record --kind consistency --from <report>` refuses a
   report without a `Traced consumers` table, naming the table, and
   records one whose table names the generated pages row and a fixture
   manifest row with the commands run; the helper applies the same
   refusal to a worker's returned report; `record` with `--host`, `--model`
   and `--effort` writes those values and preserves a prose report holding
   a JSON example.
4. `npm run worker -- review --kind criteria --host claude --subject
   planning --capture <file> --dry-run` prints a brief ending with the
   capture's text under `## The operator's dispatch`; `record` with the
   same flag refuses a report without the `## Items` table and records one
   with it, the record carrying the capture's SHA-256, the base and the
   answered report, and none of the capture's bytes.
5. The emitted executor root says a recheck reads the whole change and a
   consistency report carries the table; product 07 and the kit guide
   state the lane, the recheck, the table and the capture flag as built;
   `harness check` and `npm run publication:check` are green.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only plan-refutation` for steps 1 to 4; `npm
test -- --only harness-context` for steps 3 and 5; `npm run test:docs`
when a document changes; each under `node scripts/harness.mjs bounded --`;
then one `npm test -- --review` (07-execution-guide.md §Preflight before
the full gate).

**Evidence gate:** the fixtures of criteria 1 to 4; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete
row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 6 and criterion 5.

**Known issues and carry-ins:**

- WO-241-D004 (FUP-1398fcdb63df23d2), WO-250-D015 (FUP-60ea250ef102cc46)
  and WO-250-D016 (FUP-2bcb656e4fc1e7f6) are taken in steps 3 and 4
  (reopen: a recorded report names a model nobody ran; a JSON example is
  parsed as findings; a record cannot say which brief and base a report
  answered).
- WO-244 carries `plan review`; the capture flag lands in it when WO-244
  has merged, else in the planner's role text, and WO-244's row names this
  order's flag (reopen: `plan review` launches a planning criteria review
  without `--capture`).
- Until this order lands, a pass carries its per-item table in its own
  document so the reviewers read it as subject, and says so in
  §Validation; this pass did (reopen: a reviewer's report shows it never
  read the table).

**Non-goals:** a fourth reviewer kind; a complete gate run before round 1
or after every recheck; any model pin or host rule for reviews; removing
WO-250's ladder end; Codex message hooks.

**Operator-review assumptions:** that reading the whole change again at
the recheck is what "find those" asks of the reviewers (reopen: the
operator wants the recheck narrower); that the per-item table is the shape
the operator wants to read (reopen: the operator asks for another).
