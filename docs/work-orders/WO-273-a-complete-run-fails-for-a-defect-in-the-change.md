# WO-273 — A complete run fails for a defect in the change: the registries of case names and the per-case time bounds leave the suites, the console's self-host golden reads one fixed edition, and the vertical's statement wordings are judged in a table with one end-to-end run for each class

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** patch. Tests and fixtures only: two registry
files and their comparisons removed, one wrapper of time bounds removed,
one golden fixture's input fixed, one class of end-to-end cases moved to
a table over the function they exercise. No shipped behavior changes.
Assigned at activation under the standing opt-out default.
**Cost:** removes `scripts/fixtures/launchpad-cases.json` and
`scripts/fixtures/target-worktree-cases.json` with the cases in
`scripts/test-runner.test.mjs` that compare every case title with them;
the `repairedCaseMs` table and its `test` wrapper in
`scripts/test-target-publish.mjs`; the rule in `scripts/console-fixtures.mjs`
that the console's self-host case follow the current feedback edition,
and with it the re-recording of `packages/console/fixtures/expected/selfhost.*`
that most orders pay; and the full end-to-end loop that each statement
wording in `scripts/test-vertical.mjs` runs today. Adds one check that no
suite file declares a title twice; one fixed input for the self-host
case; one table of wordings in `packages/compiler/test/story-contract.test.ts`.
The complete run loses the vertical row's statement task as its longest
task outside the exclusive rows; the measured before and after go in the
decisions. No recurring work is added to a gate, a hook, a prune or a
close. Tokens and wall-clock: unknown until this order's handoff records
them. Re-mints: the console fixtures once, deterministically, at the
fixed edition; no file in `FEEDBACK_SOURCE_PATHS` changes, so no live
feedback episode is owed. `scripts/test-runner.mjs` is a declared source
of machinery suites, so the final criterion names `npm test -- --review`.
Steps: the executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-09 (ignored
capture SHA-256
`7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7`), item 1,
second goal (tests and gates fast and useful, brittle or overfitted tests
reconsidered); FUP-1fa649b8d330505b (a complete run failing on a
hand-written list its consistency review did not trace, deferred four
times); the test-suite review of
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md).
**Depends on:** WO-263 (open: it edits `scripts/test-runner.mjs` and
`scripts/test-runner.test.mjs` first and takes the complete run's
before-and-after reading this order's saving is read against).
**Recommended placement:** third, after WO-263. It removes the commonest
cause of a failed complete run in core for every order after it.
**Cites (read these sections):** `scripts/test-runner.test.mjs` (the case
titled for the launchpad files retaining their cases and its
target-worktree counterpart); `scripts/test-runner.mjs` (the source lists
that name the two registries, `VERTICAL_STATEMENT_PATTERN` and the
vertical row's expansion); `scripts/test-target-publish.mjs`
(`repairedCaseMs`, the local `test` wrapper);
`packages/skeleton/src/gate-deadlines.mjs` (`deadlineLimit`, read only);
`scripts/console-fixtures.mjs` (the assertion on
`manifest.inputs.maturity.path` and the `--check-current-selfhost` and
`--record-current-selfhost` modes); `scripts/lib/generated-artifacts.mjs`
(the `console-fixtures` artifact);
`packages/console/fixtures/manifest.json`;
`packages/console/test/board.test.ts` (the byte comparison and the
property checks); `scripts/test-vertical.mjs` (the statement cases);
`packages/compiler/src/story-contract.ts` (`compileStoryContract`);
`packages/compiler/test/story-contract.test.ts`.

**Objective:** A complete run in core stops failing because a list of
test titles, a time measured once or a fixture that tracks the latest
order no longer matches, and stops running a full end-to-end loop to
learn how a sentence is classified. What those tests protected is kept
by a check of the thing itself.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Complete runs fail on pins. The pass's review of the runner read the
  decisions from WO-200 onward that record a failed complete run and
  found a named cause in twenty-one; thirteen were a hand-written list, a
  hash or an expected output that a new module or a new test broke, three
  were repository lint rules, two were time bounds and about three were
  defects in the change. Each failed run is a complete run paid again, at
  about three quarters of an hour.
- Two registries pin every case title. `scripts/test-runner.test.mjs`
  compares the titles of the launchpad and target-worktree files with
  `scripts/fixtures/launchpad-cases.json` and
  `scripts/fixtures/target-worktree-cases.json`, so adding a test to
  those files fails the runner's own suite until the registry is edited.
  They were written to guard one file split.
- Twenty-six cases carry a time bound. `scripts/test-target-publish.mjs`
  wraps each case named in `repairedCaseMs` so that it fails when it runs
  longer than twice a duration measured once on this host.
- The console's self-host golden tracks the newest order.
  `scripts/console-fixtures.mjs` requires the case's input to be the
  current feedback edition, so each order that mints one re-records
  `packages/console/fixtures/expected/selfhost.json`, `.txt` and `.html`;
  those three files changed in 29 commits since 2026-10-15, and in
  WO-260's commit the change was the order's number, a build hash and an
  expiry.
- Sentence classification is tested end to end. The statement cases of
  `scripts/test-vertical.mjs` each build a full vertical fixture to judge
  one wording; the pass's review measured one at 2.55 seconds with 49 Git
  and 14 Node processes, and the row's statement task as the longest
  task outside the exclusive rows in WO-222's complete run. The function
  that classifies, `compileStoryContract`, is exported and has a unit
  file that holds none of those wordings.

**Design (scope discipline):**

- A registry of titles protects against a case vanishing in a file split.
  What it should protect is narrower and durable: that no suite file
  declares the same title twice, since a duplicated title is what makes a
  name pattern select the wrong case. That check stays, as a rule over
  the files; the registries and their comparisons leave. Rejected:
  generating the registries (the axis is purpose: a generated list pins
  nothing and still must be regenerated).
- A time bound belongs to a suite. Each suite keeps its deadline, which
  catches a hang; a bound on one case measured once on one host fails on
  a slower host and on a loaded one. Rejected: widening the factor (the
  axis is the same: any factor is a guess about another machine).
- The self-host case reads a fixed edition, copied beside the other
  cases' inputs, and is byte-compared as they are. The property checks
  the test already makes (valid schema, bounded width, safe markup, no
  dead link, evidence on every cell) also run on the current edition with
  no byte comparison, so the console is still exercised against live
  evidence. Rejected: dropping the self-host case (the axis is coverage:
  it is the one case built from a real order's evidence).
- The wordings move to a table over `compileStoryContract`: one row a
  wording, with the class and the judgment expected. The end-to-end file
  keeps one case for each statement class and outcome, so the path from a
  story to a judged run is still walked. The executor records the list of
  wordings at the base and the table's rows as evidence that none was
  dropped.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/test-runner.test.mjs`, `scripts/test-runner.mjs` (the source
   lists that name them) and `scripts/fixtures/`: remove the two
   registries and the comparisons with them, keep those cases' scheduling
   assertions, and add a case that fails when a suite file declares one
   title twice. Check: `npm test -- --only runner-fixtures`.
2. `scripts/test-target-publish.mjs`: remove `repairedCaseMs` and the
   wrapper, leaving each case's assertions and any deadline the case
   itself declares; record in the decisions the decision that added the
   table and what its bound was for. Check: `npm test -- --only
   target-publish`.
3. `packages/console/fixtures/` and `scripts/console-fixtures.mjs`: copy
   the edition the self-host case reads today into the fixtures' inputs,
   point the manifest at it, remove the rule that the input follow the
   current edition and the modes that check and re-record it, and record
   the expected files once. The other readers of those modes change with
   them: `scripts/lib/generated-artifacts.mjs` (the `console-fixtures`
   artifact's check and regenerate commands and its stale message),
   `scripts/test-sync.mjs` (the case that expects that message) and
   `scripts/lib/worktree-integration.mjs` (the regeneration at
   integration); `packages/console/test/board.test.ts`: run the
   property checks on the current edition as well, without a byte comparison. Check: `npm test -- --only console`, `npm test
   -- --only sync-fixtures` and `npm test -- --only worktree-integration`.
4. `packages/compiler/test/story-contract.test.ts` and
   `scripts/test-vertical.mjs`: record the statement cases' wordings at
   the base under `docs/evidence/WO-273/wordings.json`; add the table
   over `compileStoryContract` holding each; reduce the end-to-end file
   to one case for each statement class and outcome;
   `scripts/test-runner.mjs` (`VERTICAL_STATEMENT_PATTERN` and the
   vertical row's expansion): keep or merge the row's two tasks as the
   remaining cases warrant. Check: `npm test -- --only compiler` and
   `npm test -- --only vertical`.
5. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: product 07 §Preflight before the full gate and
   §Verification review and attack where they describe case inventories
   and pins a consistency reviewer traces;
   `docs/evidence/WO-273/decisions.md`, with the vertical row's task
   times before and after from this order's own gate rows. Then the
   handoff sequence of product 07 §Discipline.

**Deliverables:** the registries' removal with the duplicate-title case;
the time bounds' removal; the fixed self-host input with the property
checks on the current edition; the wording table and the reduced
end-to-end cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. `scripts/fixtures/` holds neither registry and no source file names
   one; a suite file that declares one title twice fails the
   duplicate-title case, naming the file and the title; `npm test --
   --only runner-fixtures` passes.
2. `scripts/test-target-publish.mjs` holds no per-case time bound, and
   `npm test -- --only target-publish` passes.
3. After a new feedback edition is minted in a scratch copy, `node
   scripts/console-fixtures.mjs --check` passes with the self-host
   expected files unchanged, and the console's property checks run on
   that new edition.
4. Every wording `docs/evidence/WO-273/wordings.json` lists is a row of
   the table in `packages/compiler/test/story-contract.test.ts` with its
   class and judgment, `scripts/test-vertical.mjs` keeps one end-to-end
   case for each statement class and outcome, and `npm test -- --only
   compiler` and `npm test -- --only vertical` pass.
5. Product 07 states that case titles are checked for duplicates and not
   against a registry, and links this order's decisions. Check:
   `npm run test:docs`.
6. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only runner-fixtures` for step 1;
`npm test -- --only target-publish` for step 2; `npm test -- --only console`, `npm test -- --only sync-fixtures` and
`npm test -- --only worktree-integration` for step 3; `npm test -- --only compiler` and `npm test --
--only vertical` for step 4; the structural phase; the complete run with
`npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-273/`: `wordings.json` and the
table's rows beside it; the duplicate-title case's failing output; the
console check after a new edition; the vertical row's task times before
and after; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 5 and criterion 5; sources and
reopening conditions in `docs/evidence/WO-273/decisions.md`.

**Known issues and carry-ins:**

- FUP-1fa649b8d330505b (WO-255-D022): this order is its allocation for
  the two registries; a third Traced consumers row in the consistency
  brief is declined with it, since the lists that row would trace leave.
- The chain of role baselines, the other large pin, leaves with WO-264.
- Hand-written lists of modules in `scripts/test-runner.mjs` and the
  fixture-input files still break when a module is added; deriving them
  from the import graph the coverage check already computes is recorded
  by the 2026-11-09 pass as a candidate, to be read after this order.
- A wording whose end-to-end case found a defect the table would not is
  kept end to end, and the decisions name it.
- The mutation self-test still runs in the gate though its campaign last
  ran on 2026-09-06; it is unchanged here.
- Wall-clock assertions elsewhere in the suites are listed in the
  decisions as the executor meets them and are not removed by this order.

**Non-goals:** any change to shipped code; the suites' deadlines; the
exclusive rows or the runner's schedule; the role baselines; deriving the
runner's source lists; the mutation corpus; tests of the repository's own
documents.

**Operator-review assumptions:** that a duplicate-title rule keeps what
the registries were for; that a case's own speed is not a property a
functional suite should assert; that one fixed self-host edition with
property checks on the live one is coverage enough; and that a table over
the classifier with one end-to-end case a class is the right balance for
the statement wordings.
