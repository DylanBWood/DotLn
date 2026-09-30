# WO-175 — A numeric reopening condition reports itself: planning entry lists the ones that hold, the meter's reopen-candidate count is computed or absent, and a review worker's temporary files stay inside its episode (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. One read-only listing at planning
entry, one refusal when decisions are read, one environment value and one
inventory in the review dispatch; no gate step, no refusal of a handoff,
no control-event schema and no change to what a review may judge.
Assigned at activation under the standing opt-out default.
**Cost:** adds `npm run plan -- conditions` (a table of at most twelve
probes, under 60 s in total on the operator's host, run on demand and by
no gate), one block of at most 1 KB in `plan start` with the count that
hold, one refusal in the meter's decision reader, one directory and one
inventory per review or refutation episode, and one sentence in the
review instructions. Removes: a process-health line that prints "0 reopen
candidates" whatever the state (the repository's only metric predicate,
WO-150-D003, holds at 26,903 bytes against 24,576 and is not listed); the
hand measurement by which two consecutive reviews found recorded
thresholds already exceeded (REVIEW-003 ER3-002; three in REVIEW-004); and
a review's choice between temporary files its receipt cannot see and a
product gate it cannot measure (REVIEW-004 ran `npm test` for 383.58 s to
four failures that were artifacts of a temporary root nested in the
copy). Re-mints: `packages/skeleton/src/entropy-review-protocol.ts`
carries the instruction sentence and is a judged feedback source and a
registered source of all five editions, so this order owes their
deterministic re-mint, the console re-pin, and one live feedback
self-host episode in the executor's session if the feedback edition's
judged behavior changes (WO-154 D001); `scripts/lib/meta.mjs`,
`scripts/refute-plan.mjs` and `scripts/lib/entropy-review.mjs` are not
registered evidence sources. Wall-clock, tokens and context bytes of the
order itself are unknown until run.
**Nomination provenance:** the operator's dispatch `planning: entropy
reducer` of 2026-09-30, captured in ignored intake (SHA-256 in the ledger
section); [REVIEW-004](../instance/entropy-reducer/runs/REVIEW-004.md)
findings ER4-003, ER4-004 and ER4-007, which survived their blinded
refutation, and the filed packet
`reopen-conditions-evaluated-at-planning-entry` as design record
([planning document](../planning/entropy-review-004-2026-09-30.md) §4 and
§5). Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: repository records only; no stop condition.
**Depends on:** WO-172 merged (`plan failures` and the block `plan start`
prints, which this order's listing sits beside; closed, v0.56.2); WO-165
merged (the review route this order's dispatch change keeps; closed,
v0.52.1).
**Recommended placement:** paired with WO-059 in the second slot. This
order edits `scripts/lib/meta.mjs`, `scripts/refute-plan.mjs`, a new
module under `scripts/lib/`, `scripts/lib/entropy-review.mjs`,
`packages/skeleton/src/entropy-review-protocol.ts`, their fixtures and the
editions; WO-059 adds `packages/browser-evidence/` and edits
`package-lock.json`, `scripts/test-runner.mjs`, `docs/LEGAL.md` and
product 03. Disjoint files and no hard edge. Both re-mint, so the second
integration re-mints once more, deterministically. A recommendation, not
a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-172",
    "relation": "satisfied-by-close",
    "reason": "plan failures and the counts plan start prints"
  },
  {
    "workOrderId": "WO-165",
    "relation": "satisfied-by-close",
    "reason": "the review route and its compiled authority"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/meta.mjs` (`readDecisions`,
the `reopenWhen` shape check; `collectMeta`, the `reopenCandidates`
filter that reads `row.metrics[condition.metric]`; `metaHealth`);
`docs/evidence/WO-150/decisions.md` D003; `docs/control/budgets.json`;
`scripts/refute-plan.mjs` (`start`, `failures`);
`scripts/lib/planning-followups.mjs`; `docs/planning/followups.md`;
`scripts/lib/entropy-review.mjs` (`freezeSubject`, `scratchLane`,
`runEpisode`, the confinement record and `witnessSentence`);
`packages/skeleton/src/entropy-review-protocol.ts` (the output
instructions); `packages/skeleton/src/worker-transport.ts` (the launch
environment, read only); `docs/instance/entropy-reducer/README.md` §What
the reviewer may run; `docs/evidence/WO-156/decisions.md` D008 and D010;
`docs/evidence/WO-086/decisions.md` D006; register rows
FUP-8a4e201d861208ad, FUP-be1103fbfdd14653 and FUP-7f9a27e6ed6c44b3;
REVIEW-004 ER4-003, ER4-004 and ER4-007; the packet under
`docs/proposals/`.

**Objective:** a pass that opens sees, without measuring by hand, which
recorded numeric thresholds have been crossed; the meter never prints a
count it cannot compute; and a review can run the product suites while
its receipt accounts for every file it wrote.

**Observed gap (dated 2026-09-30, `main` at `feb7a92e`):**

1. Decision records hold 1,134 prose reopening conditions and one metric
   predicate (counted by this pass with the review's command). The
   predicate, WO-150-D003, names `coldStartBytes.executor`; the evaluator
   reads `row.metrics[condition.metric]` from order rows, which carry
   `coldStartBytes` and no per-role name (`meta.mjs` line 1735, read by
   this pass), so it can never hold and the health line reads "0 reopen
   candidates".
2. Three numeric conditions held at the subject with no evaluation of
   them anywhere: the plan check above 2 s (4.37 to 4.74 s in the review;
   4.74 and 4.78 s on the operator's host in this pass, with a review
   worker running); the generated release table five tags behind; WO-172's
   1,808,181 bytes under `docs/evidence` against a 1 MB condition, which
   WO-172's final review did record on a sibling row.
3. The launched review worker inherits the system temporary directory,
   outside its frozen copy; neither `scripts/lib/entropy-review.mjs`,
   `scripts/entropy.mjs` nor the transport names `TMPDIR` (zero matches,
   this pass). The receipt's witness covers the source repository's
   tracked status and untracked listing and the copy's inventory, and
   none of them sees that directory. With the temporary root placed
   inside the copy, product fixtures fail as nested checkouts.
4. The filing of REFUTATION-005 in this pass wrote the receipt and its
   control event and then exited 1 with `ENOTEMPTY` on the episode's
   scratch parent: a drill had left read-only fixture directories under
   the copy's `.runtime/tmp`, which the removal could not enter. The
   pending dispatch was cleared, `npm run entropy -- check` was green,
   and the six leftover files were removed by hand after a `chmod`.

**Design (scope discipline):**

- **The evaluator.** A predicate whose metric the meter cannot resolve is
  refused when decisions are read, naming the decision and the metric.
  Budget-row metrics resolve from the same measurement the budget line
  uses. A predicate that holds is a reopen candidate until a later
  decision records `reopens` for it, the register's existing form.
- **The listing.** A table in a new module: one row per condition with
  the register row or decision it belongs to, how it is measured and its
  threshold. The command prints each row's value, threshold and whether
  it holds, and says how many recorded conditions it does not evaluate.
  It refuses nothing and is part of no gate. A timing probe reports the
  median of three runs and the listing names the host as loaded or not
  only by what it measured.
- **The rows, and nothing else:** the plan check's wall time against 8 s
  (FUP-3dc0266d6b87b939 and FUP-ab1746dc9c595d95 as the 2026-09-30 pass
  re-disposed them; the 2 s of WO-156 D008 and D010 has occurred and is
  recorded there); release tags newer than the generated table against
  three (WO-086 D006); distinct blob bytes one order commits under
  `docs/evidence` against 1 MB in two consecutive orders, and tracked
  evidence bytes added in the current week against 10 MB
  (FUP-8a4e201d861208ad, FUP-be1103fbfdd14653); `collectSources` against
  3 s, a cold release listing against 10 s, `status --all --json` bytes
  against 32 MB and the work-order index against 10 s
  (FUP-7f9a27e6ed6c44b3); the document gate against 30 s and its
  docs-check task against 15 s (ER4-005's register row); and the metric
  predicates in decision records.
- **The review's temporary root.** The dispatch creates a directory
  beside the frozen copy inside the episode's scratch parent, gives it to
  the worker as its temporary directory, names it in the instructions as
  the only other writable place, inventories it with the copy and removes
  it with the scratch parent.
- **Declined alternatives, recorded:** requiring the predicate form for
  every new numeric condition (a rule with no reader until the listing
  exists; the order that follows this one may propose it with the
  listing's first month of output); evaluating prose (most of the 1,134
  are qualitative); a gate or a refusal on a condition that holds (a
  threshold is planning input, never a verdict); a probe that runs a
  model.

**Deliverables:** the refusal and the resolution in the meter; the table
module, the command and the `plan start` block; their fixtures; the
temporary root, its instruction sentence and its inventory; the re-mints;
the write-back.

**Acceptance criteria (all required)**

1. Reading a decision whose `reopenWhen` predicate names a metric the
   meter cannot resolve fails with the decision's id and the metric; the
   fixture fails against the source at `feb7a92e`.
2. `coldStartBytes.<role>` and `sequenceBytes` resolve; at the executor's
   base `node scripts/meta.mjs --check --json` lists WO-150-D003 among
   `reopenCandidates` if it still holds, and the health line's count
   equals that list's length. A fixture in which a later decision records
   `reopens` for a holding predicate no longer lists it.
3. `npm run plan -- conditions` prints one row for each condition named
   in the design, with its source id, measured value, threshold and
   whether it holds, and one line stating how many decision conditions
   and register rows it did not evaluate. It exits 0 whatever holds. A
   fixture refuses a table row whose source id resolves to no decision
   and no register row.
4. `plan start` prints the number of conditions that hold and the
   command, in at most 1 KB, beside the failures block.
5. The whole listing takes under 60 s on the operator's host; the
   decisions record the time and each row's value on the day. If it
   cannot, the executor records the slowest rows and moves them behind a
   flag; nothing else is cut.
6. A launched review and a launched refutation each receive a temporary
   directory that is inside the episode's scratch parent and outside the
   frozen copy; the fake-transport fixture shows the value the worker
   receives and the instruction that names it.
7. The receipt's confinement record states the temporary directory's
   path count and bytes after the episode, and its witness sentence says
   so; receipts filed before this order render byte for byte as they do
   today (`npm run entropy -- check` green).
8. Filing a receipt removes the episode's scratch parent when the worker
   left read-only directories in it (fixture). A removal that still
   fails is reported after the receipt as one line naming the leftover
   path, and the command exits 0 because the receipt is filed.
9. From a frozen copy made by the dispatch, with that temporary
   directory, `node --test scripts/test-portfolio.mjs` passes 3 of 3 (2
   of 3 failed in REVIEW-004 with the temporary root inside the copy).
   No live review episode is run by this order: the next
   `planning: entropy reducer` receipt is the live row, and until one
   exists the capability claim stays at the fixture's level.
10. Write-backs land: `docs/instance/entropy-reducer/README.md` §What the
   reviewer may run; `docs/planning/followups.md`, one sentence naming
   the command; product 07's planning procedure, one sentence within 200
   bytes; `docs/evidence/WO-175/decisions.md`; the decisions index; the
   register rows of ER4-003, ER4-004 and ER4-007 retargeted at close.
11. `npm test -- --review` and `npm run test:docs` green; the five
    editions and the console's pins current; `git diff --check` clean;
    no new dependency.

**Evidence gate:** the fixtures; the listing's output on the operator's
host; the portfolio suite's transcript from a frozen copy;
`npm test -- --review` before `implementation-ready`, because
`scripts/lib/meta.mjs`, `scripts/refute-plan.mjs` and
`scripts/lib/entropy-review.mjs` are declared sources of machinery
suites, and again at final review. A live feedback episode only under the
Cost line's condition.

**Write-back duty:** the documents of criterion 10; the order's decisions
with sources and reopening conditions. Record corrections the same day as
what was misread, meant and changed.

**Non-goals:** rewriting any existing decision's condition; a condition
the design does not name; acting on a condition that holds (the pass that
reads the listing decides); the review's tools, lenses or selection rule;
the Codex review route's sandbox; the rows FUP-e55e258d37cb3f20 and
FUP-01e80ba5ce62c72a, which the completion advisory shows the executor.

**Operator-review assumptions**

1. "More than a few releases" (WO-086 D006) is read as more than three.
2. WO-150-D003 will be listed on the day this order lands, since the
   executor's cold start was raised past 24,576 bytes by a dated
   acceptance; the pass that reads it records `reopens` or a new
   decision.
3. The review's temporary directory is a second writable root, stated in
   the instructions and inventoried; "nothing outside the working
   directory" becomes "nothing outside these two".
