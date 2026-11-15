# WO-278 — The review helper reads a report as written, a paired round is launched as one, and a worker in an instance probes what the instance runs (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. The review helper reads a report's
table anywhere in its section, launches a paired first round as one
command, refuses a first round that names a report and prints each launch's
base; the worker table's `show` reads the emitted definition; a direct
refutation receipt is filed under the worker types in use; the hook counts
three more kit launch commands; the bounded wrapper says a core-only suite
is not run in a kit root; the executor's root says which run takes
`--keep-going`. One refusal is added (a first-round launch naming a
report), keyed to no host property. Assigned at activation under the
standing opt-out default.
**Cost:** adds about 30 lines in the table reader and the merge, about 80
for the paired launch and its dry-run line, about 25 moved in the record
route, about 10 in the JSON return reader, about 30 in `worker show` and
`list`, about 10 in the receipt filing, about 15 in the hook's launch
matcher, about 30 in the bounded wrapper with one light module of the
runner's core-only marks, and a sentence each in the executor's root,
product 07 and the kit guide; ten to twelve cases (estimates, not bounds).
Each bounded probe in a kit root reads the runner's suite table once
(unmeasured; one import). It removes a refused round's lost record when a
sentence stands before its table (the instance's entry 4), two mis-launched
paired rounds of the kind WO-276-D080 and D117 record, a probe that fails
in an instance for a reason the change did not cause (the instance's entry
5), and a target order's executor typing a flag its gate refuses (entry 3).
One complete review run at final review. No judged feedback source is
edited, so no live feedback episode is owed; `packages/skeleton/src/harness-host.ts`
and `packages/skeleton/src/loadouts/contributor.ts` are registered sources
of the authority, feedback and harness editions, whose deterministic
re-mint `npm run sync` makes. Tokens and steps are unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-14
(journal digest
`90a23f1bbae9b79f3c760f130d682a0bf463281b37ab7c81d46eace1b1507603`) and
the instance's entries 3, 4 and 5 of that day (kept whole in the ignored
local planning lane, SHA-256
`47405c827aa3287adba12e61afbce893ba5834860747ba49aa87b2e5f9cc2655`),
evidence the operator carried, paraphrased here. Register rows allocated
here: FUP-c2ff437aee8cdb29 (WO-276-D118, whose own priority is before the
next order that declares the paired ladder is executed),
FUP-ba14f6042abb2d58 (WO-276-D114, item 7), FUP-556aa33ee7c4b0f7
(WO-276-D078, items 2 and 3), FUP-79439387f395813a (WO-276-D157, item 4),
FUP-45b8ce20b8b764d0 (WO-257-D044, whose condition occurred when WO-276
edited the split-round merge), FUP-c53447a63c6b1031 (WO-255-D046) and
FUP-2ce66cf6a0602982 (WO-250-D003). FUP-fddba57354445514 (a refused report
restated by the worker that wrote it) is read here and deferred again (see
Non-goals). Clean-room screen: the entries are in generic words and name
kit files only.
**Depends on:** WO-279 and WO-281 by placement only (WO-279 edits the same
launch path and WO-281 the guide); no hard edge.
**Recommended placement:** fifth, after WO-279 and before WO-280; its
paired launch serves every later order's first round.
**Cites (read these sections):** product 07 §Review helper and round
reports, §Preflight before the full gate; `docs/KIT.md` §What runs here,
and what does not; `scripts/lib/review-worker.mjs` (`tableUnder`,
`itemsTable`, `tracedConsumersRefusal`, `mergeBatchResults`, `roundPlan`,
`requireRoundInputs`, `recordAgentReview`, `readReturn`, `renderReviewBrief`,
the dry-run block of `runChangeReview`); `scripts/lib/worker-launch.mjs`
(`showWorker`, `listWorkerRows`); `scripts/lib/plan-direct.mjs`
(`fileDirectRefutation`); `packages/skeleton/src/harness-host.ts`
(`kitWorkerLaunch`); `scripts/lib/bounded-command.mjs`; `scripts/test-runner.mjs`
(`suites`, `isKitRoot`, the `kit:` marks); `scripts/lib/closeout-scope.mjs`;
`scripts/lib/plan-receipts.mjs` (`openOrderPreflightAdvisories`);
`packages/skeleton/src/loadouts/contributor.ts` (the executor's steps);
WO-276-D078, D114, D118, D157; WO-257-D044; WO-255-D046; WO-250-D003.
**Objective:** A review round's report is recorded when its table stands
anywhere in its section, and refused only with the reason the form holds; a
paired first round is launched by one command on one base and cannot be
recorded from launches that were not its first round; every launch prints
the base it takes; the worker table's `show` names the model the emitted
definition runs; a receipt is filed only under the worker types in use;
each kit command that launches a worker is counted; in an instance a bounded
probe of a suite the instance does not carry says so instead of failing, and
the review brief says which suites the instance carries; and a target
order's executor reruns its target gate after a failure with the command
that gate takes.

**Observed gap (dated 2026-11-14 at `main` `ed66a822c`, v1.0.0):**

1. `tableUnder` (`scripts/lib/review-worker.mjs` 1189 to 1210) takes only
   the block directly after the first matching top-level heading, so one
   sentence between `## Items` and its table reads as no table; a scratch
   call of the exported `itemsTable` returns "…and this report has none" for
   that shape, a `###` subheading before the table and a table further down
   the section. `mergeBatchResults` (1136 to 1158) drops such a batch's
   table without a word, so a split round's merged table loses its rows.
   The brief's template (`reportRules`, 763 to 791) never says the table
   must follow the heading directly. The instance's entry 4 lost a round's
   record this way.
2. `roundPlan` sets a round to the highest earlier one plus one (620) and,
   for a combined launch naming a report, takes that report's tree as its
   base (674 to 678); `requireRoundInputs` refuses only an explicit
   `--round 1` with `--recheck` (585 to 603); no command launches a paired
   round, and the dry run prints no round, base source or recheck mark
   (1863 to 1897). WO-276-D080 and D117 record two rounds launched wrongly
   for want of that.
3. `recordAgentReview` judges a round's Items table (2568 to 2588) before it
   decides the round is split (2632 to 2660), so a split round recorded
   without `--batch` is refused for its table, not told to name its batch
   (WO-276-D114 item 7); and the merge reads each part's tables from its
   report and refuses on that first (WO-257-D044).
4. Under `--format json`, `readReturn` refuses a whole record when any
   brace outside the selected result opens no parseable object, though
   product 07 and the kit guide admit a result with a preface or closing
   prose (WO-255-D046).
5. `showWorker` and `listWorkerRows` (`scripts/lib/worker-launch.mjs` 125
   to 180) call `sessionLaunch` without the emitted definition's pin, so
   between a table edit and the next emit `show` can print a launch as exact
   while `.claude/agents/dotln-worker.md` holds the earlier model
   (WO-276-D078 item 2). `fileDirectRefutation` (`scripts/lib/plan-direct.mjs`
   280 to 297) and the refute usage line admit the two retired types
   `dotln-worker-fable` and `dotln-worker-astra` (item 3).
6. The hook counts `worker … review` alone among kit launch commands
   (`kitWorkerLaunch`, `packages/skeleton/src/harness-host.ts` 532 to 575);
   `plan refute --transport` and `entropy review --transport` launch workers
   and are not counted (WO-250-D003).
7. In a kit root the plain gate runs the `harness` row and the document gate
   nine document rows (`scripts/test-runner.mjs` 553 to 821, 954), none of
   them a `node --test` file, and `closeout-scope.mjs` 122 drops core-only
   rows; `boundedCommand` (`scripts/lib/bounded-command.mjs` 20 to 101)
   never reads the suite table, and the review brief names no suite. The
   instance's entry 5: a worker's probe of `scripts/test-lineage.mjs`
   (`core-only: core idea ledger`) failed on an assertion over links only
   core has. `openOrderPreflightAdvisories` (`scripts/lib/plan-receipts.mjs`
   1833 to 1868) has no kit-root check (WO-276-D157 item 4).
8. The executor's root (`contributor.ts` 932, compiled into
   `.claude/skills/dotln-executor/SKILL.md` and `.agents/skills/…`), product
   07 (5548 to 5556) and the kit guide (1262 to 1270) say a fresh complete
   run after a failure takes `--keep-going`, and the target clause (917) does
   not except a target order, whose `node scripts/target-gate.mjs WO-NNN
   --review` refuses any other argument and already runs every declared
   command (the instance's entry 3).

**Design (scope discipline):**

- A required table is the first top-level table inside its section, up to
  the next heading of the same or a higher level, read through
  `markdownSections`; tables in quotations, lists, HTML or code stay
  outside, as the existing case requires. A section with no table is
  refused with that reason, distinct from a missing heading. The merge uses
  the same reader and refuses a batch with no table instead of dropping it.
  Rejected: refusing with a better message only (axis: outcome; the
  instance's round would still be lost).
- One command launches a paired first round: the three kinds and the
  combined worker on one base, naming no report, each journaled as round 1
  of that ladder and counted as four uses; a first-round launch naming a
  report is refused; every dry run prints the round, the base and where it
  came from. Rejected: a dry-run line only (axis: prevention; it shows a
  wrong base and records it anyway).
- `show` and `list` read the emitted worker definition's model and effort
  and say when an emit is owed; a receipt is filed under `dotln-worker` or
  `codex-spawn-agent` and an earlier receipt keeps reading.
- The core-only marks move to one light module the runner, the closeout
  scope, the preflight advisory and the bounded wrapper read. In a kit root,
  with the working directory the kit root itself, a bounded `node --test`
  of a core-only suite's file is not run: the wrapper prints the runner's
  reason and exits with a status of its own; in a registered target's
  directory the same path runs. Rejected: a skip that exits zero (axis:
  reading; a worker could read it as a pass).
- Wording only for `--keep-going`: it belongs to `npm test -- --review`; a
  target order's run after a failed target gate is the same target-gate
  command. Rejected: the target gate taking and ignoring the flag (axis:
  honesty; an ignored flag says the run does something it does not).

**Execution plan (the executor follows these steps in order; observed at
`ed66a822c`, 2026-11-14):**

1. `scripts/lib/review-worker.mjs` `tableUnder`, `itemsTable`,
   `tracedConsumersRefusal`, `mergeBatchResults`: the reader and refusals of
   the Design; cases in `scripts/test-review-worker.mjs` for a sentence, a
   subheading and a later table in the section, the merge of such a batch,
   and the existing quoted-table case unchanged. Check:
   `npm test -- --only plan-refutation`.
2. `scripts/lib/review-worker.mjs` `roundPlan`, `requireRoundInputs`, the
   dry-run block, and `scripts/worker.mjs` (the review arguments): the
   paired launch, the first-round refusal and the dry-run line; cases.
   Check: `npm test -- --only plan-refutation` and `npm test -- --only
   configuration-root`.
3. `scripts/lib/review-worker.mjs` `recordAgentReview` and the split-round
   merge: decide the split before judging the table, and judge the merged
   report from each part's body (WO-257-D044); `readReturn`: skip a brace
   that opens no object under `--format json`, still refusing two results;
   cases. Check: `npm test -- --only plan-refutation`.
4. `scripts/lib/worker-launch.mjs` `showWorker`, `listWorkerRows`: read the
   emitted definition's frontmatter and pass it as the pin; say when an emit
   is owed. `scripts/lib/plan-direct.mjs` `fileDirectRefutation` and the
   usage line in `scripts/refute-plan.mjs`: file under the types in use.
   Cases. Check: `npm test -- --only launchpad-planning` and `npm test --
   --only plan-refutation`.
5. `packages/skeleton/src/harness-host.ts` `kitWorkerLaunch`: count the
   paired launch as four uses and `plan refute --transport` and `entropy
   review --transport` as one each, none under `--dry-run`; the Codex
   charge in `admitCodexLaunch` likewise. Cases. Check: `npm test -- --only
   harness-fixtures` and `npm test -- --only process-debt`.
6. A light module of the runner's core-only marks (new, under
   `scripts/lib/`), read by `scripts/test-runner.mjs`,
   `scripts/lib/closeout-scope.mjs`, `scripts/lib/plan-receipts.mjs` and
   `scripts/lib/bounded-command.mjs`; the wrapper's behavior of the Design;
   the advisory leaves core-only rows out in a kit root. Cases in the runner
   fixtures and in `scripts/test-plan-refutation.mjs`. Check: `npm test --
   --only runner-fixtures`, `npm test -- --only harness-fixtures` and `npm
   test -- --only plan-refutation`.
7. `scripts/lib/review-worker.mjs` `renderReviewBrief`: in a kit root the
   brief names the suites the instance carries and says its gates run no
   `node --test` file. Case. Check: `npm test -- --only plan-refutation`.
8. `packages/skeleton/src/loadouts/contributor.ts` (the executor's step 8
   and the target clause): the `--keep-going` wording of the Design; then
   `node scripts/harness.mjs emit` and `npm run sync` (the roots and the
   editions). Check: `node scripts/harness.mjs check` and `npm test --
   --only harness-fixtures`.
9. Write-backs: product 07 §Review helper and round reports (the table
   rule, the paired launch, the dry-run line, the counted launches) and
   §Preflight before the full gate (the `--keep-going` sentence); `docs/KIT.md`
   §What runs here, and what does not (the wrapper's answer for a core-only
   suite, the `--keep-going` sentence); `docs/evidence/WO-278/decisions.md`
   and the regenerated decisions index. Then the handoff sequence of product
   07 §Discipline.

**Deliverables:** the table reader and merge; the paired launch, the
first-round refusal and the dry-run line; the record route's order and the
JSON reader; `show`, `list` and the receipt filing; the counted launches;
the core-only marks module, the wrapper's answer and the advisory; the
brief's suites; the executor's wording; the write-backs, decisions,
regenerated roots and editions.

**Acceptance criteria (all required)**

1. Under `npm test -- --only plan-refutation`: a criteria report whose
   `## Items` section holds a sentence, or a subheading, before its table is
   recorded with its items; a report whose Items section holds no table is
   refused with a reason that names the section and says it holds no table;
   the existing case "required report tables exclude code examples on both
   routes and a quoted table cannot shadow the real section" passes
   unchanged; and a split round whose batch table follows a sentence merges
   that batch's rows.
2. Under the same suite: the paired launch's dry run prints one line for
   each of its four launches with round 1, one base and that base's source,
   and naming no report; a first-round launch that names a report is
   refused naming the report; a later round's launch prints the base it
   takes; a split round recorded without `--batch` is told to record its
   batches; and a `--format json` return whose closing prose holds a brace
   that opens no object is recorded.
3. Under `npm test -- --only launchpad-planning`: with the worker table
   changed and no emit, `npm run worker -- show default` prints the emitted
   definition's model and says an emit is owed. Under `npm test -- --only
   plan-refutation`: a direct refutation receipt filed with
   `dotln-worker-fable` is refused naming the types accepted, and a receipt
   filed earlier with it still reads.
4. Under `npm test -- --only harness-fixtures`: the hook counts the paired
   launch as four uses and `npm run plan -- refute --transport fake` and
   `npm run entropy -- review --transport fake` as one each, and none of
   them under `--dry-run`.
5. Under `npm test -- --only runner-fixtures`: in an exported kit root,
   `node scripts/harness.mjs bounded -- node --test --test-name-pattern x
   scripts/test-lineage.mjs` prints that the suite is not run with the
   runner's core-only reason and exits nonzero with a status that differs
   from a failing test's; the same command in this repository runs the file;
   with a registered target's worktree as the working directory a file at
   that path runs. Under `npm test -- --only plan-refutation`: in a kit root
   the preflight advisory names no core-only suite, and the review brief
   names the suites the instance carries.
6. After `node scripts/harness.mjs emit`, `.claude/skills/dotln-executor/SKILL.md`,
   product 07 §Preflight before the full gate and `docs/KIT.md` say that
   `--keep-going` belongs to `npm test -- --review` and that a target order's
   run after a failed target gate is `node scripts/target-gate.mjs WO-NNN
   --review` again. Check: `node scripts/harness.mjs check` and
   `npm run test:docs`.
7. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only plan-refutation`, `npm test -- --only
configuration-root`, `npm test -- --only launchpad-planning`, `npm test --
--only harness-fixtures`, `npm test -- --only process-debt`, `npm test --
--only runner-fixtures`, `npm test -- --only harness-evidence`, `npm test --
--only authority-evidence`, `npm test -- --only feedback-evidence`, `npm
test -- --only registrations`, `npm test -- --only sync-fixtures` and `npm
test -- --only launchpad` for the steps that name them; the structural
phase; the complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-278/`: the instance's shape of
report recorded and the no-table refusal; the paired launch's dry-run lines;
the wrapper's output and exit status in a kit root and in this repository;
the hook's counts; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as step 9 lists; sources and reopening conditions in
`docs/evidence/WO-278/decisions.md`; the release's Read before upgrading
says that a report's table may follow text in its section, that a paired
first round has one command, and that a bounded probe of a core-only suite
in an instance is answered, not run.

**Known issues and carry-ins:**

- Until step 2 is in the candidate, this order's first round is launched as
  WO-276-D118 records: each kind and the combined worker with no
  `--recheck`, all on the same `--since` base, each dry run read first.
- The instance's round refused under v1.0.0 stays as its pass recorded it;
  this release reads such a report, it does not record one kept earlier.

**Non-goals:** restating a helper-launched report by the worker that wrote
it (FUP-fddba57354445514, deferred again: the one report the record shows
refused for its form was refused by the reader this order repairs, and a
restatement needs persisted host sessions and a judged transport source;
it reopens when a helper-launched report is refused for its form after this
release and its round is lost or paid again); worker kinds and cadences
(WO-279); the change-review protocol's output contract (WO-276-D182,
WO-279); a target order's review repair lane on a failed target gate
(FUP-06090c778cc07685, declined with its condition); the change review's
budget as instance configuration.

**Operator-review assumptions:** a table anywhere in the Items section,
subsections included, answers the dispatch; the paired launch's spelling is
the executor's, named in its decisions.
