# WO-036 — Evidence runner: build first, run suites concurrently, report per case (version assigned at activation)

**Umbrella record (2026-09-09):** superseded whole by [WO-126](WO-126-process-debt.md) criterion 6 at the operator's emergency process-debt pass; not activatable. That criterion carries this order's runner, its `--only` and `--serial` forms, the `node:test` conversions and the measured receipt, and adds the numeric targets this order lacked (a fast gate under 120 s beside the full gate at the lifecycle transitions). The 2026-09-06 measurement below is the baseline that criterion cites; nothing in this record grants activation.

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Test infrastructure only; no exported
runtime capability. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** the 2026-09-06 planning pass, from the read-only
code sweep recorded in `docs/planning/phase-two-plan-2026-09-06.md`, which
measured the root evidence chain and found it the first thing that breaks
under the observed growth rate. Planner-synthesized draft; the unedited
dispatch is preserved locally in
`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`. Opaque
identifier, not a priority. The clean-room screen found no stop condition.
**Depends on:** WO-018 merged (the shell fixture helpers; satisfied at
`v0.4.1`); WO-013 merged (portable temp roots; satisfied at `v0.3.1`).
Independent of every other open order in primary surfaces except the root
`package.json` `test` entry, which each order also edits to register its
suite; that conflict is one line.
**Recommended placement:** a floating small order for any free lane, ideally
between wave 1 and wave 2 so wave 2 registers its suites with the runner. A
recommendation, not a dependency token.

**Cites (read these sections):** 07-execution-guide.md §Discipline (evidence
gates over prose; "a green runner over an absent suite is not evidence";
automate recurring procedure); 06-roadmap.md §Efficiency as a separate
capability axis; 05-pattern-library.md §Candidate — success under growth;
ADR-0002 Amendments (2026-09-05 dependency posture: Node built-ins first; no
ESLint; self-written checks); `docs/lineage/idea-ledger.md` §WO-002 closeout
additions ("A green runner over an absent suite is not evidence");
`package.json` (`test`), `scripts/test-temp-root.sh`,
`scripts/test-fixture-temp-root.sh`, `scripts/test-*.sh`,
`scripts/test-*.mjs`, `corpus/mutation/wo108-selftest.test.mjs`;
`docs/planning/phase-two-plan-2026-09-06.md` §Code sweep.

**Objective:** Make the root evidence gate faster to run, honest about
ordering, and legible per case, without weakening any check: one runner
builds first, runs independent suites concurrently under a bounded
parallelism, reports every case with a summary, and preserves the same
refusal semantics as today's serial chain.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`; measured by the
read-only sweep):**

- The root `test` script is a 23-step `&&` chain: eight bash suites, eight
  Node scripts, the formatter, a forced rebuild, three golden `--check`
  commands, and the mutation self-test. The first failure aborts; there is no
  per-case reporting and no summary.
- The forced package rebuild is step 15, after `scripts/test-worktree.sh`
  (step 9) has exercised `release.mjs`, which loads
  `packages/skeleton/dist/src/cli.js`; that suite runs against whatever
  build already exists. WO-033 carries the one-line reorder as a boy-scout
  item; this order makes the build-first rule structural.
- Measured wall time: package build 1.1 s; kernel 0.14 s (81 tests);
  compiler 0.18 s (56); skeleton 62 s wall and about 122 s CPU (144 tests,
  the top eight each 5–16 s because they spawn CLIs and Git); the
  work-orders shell suite 36 s; the resume and release suites are of similar
  size; the whole chain is about 6–10 minutes and entirely serial. At the
  observed growth rate the chain reaches 40 minutes within months, and every
  executor runs it many times per order.
- The bash suites use bare `assert` with no `test()` blocks, so a failure
  names a line, not a case, and no suite can be filtered.

**Design (scope discipline):**

- `scripts/test-runner.mjs` (Node built-ins only) replaces the chain: it
  runs the formatter check and the forced build first; then runs declared
  suites concurrently with a parallelism bound derived from CPU count, each
  suite in its own temp root as today; then the golden `--check` commands and
  the mutation self-test. Suite declarations live in one table in the runner
  (name, command, isolation, expected duration class). Output is one line per
  suite as it finishes and a final summary with pass/fail counts and wall
  time; any failure exits non-zero with the failing suite's captured output.
  `npm test` invokes the runner; `npm run test -- --only <suite>` filters;
  `--serial` reproduces today's ordering for debugging.
- Ordering and isolation are explicit: a suite that loads built output
  declares `needsBuild`, and the runner refuses to schedule it before the
  build; suites that share a process-global (the Git stash stack, `gh`
  stubs on PATH) declare a serialization group and never overlap.
- The Node test scripts under `scripts/test-*.mjs` convert to `node:test` so
  cases are named and reportable; the bash suites are left in place (they
  test CLI behavior) with a documented path to convert one per touching
  order.
- Nothing weakens: every command the chain ran still runs; the runner's own
  tests prove that a removed suite, a missing built test file, or an empty
  test glob fails the gate (the WO-002 lesson), and that a concurrent
  failure is reported, not swallowed.
- **Declined alternatives, recorded:** a third-party test orchestrator (the
  dependency posture); rewriting the bash suites wholesale (they are
  behavioral CLI tests; migrate on touch); dropping the mutation self-test or
  golden checks from the default gate.

**Deliverables:** the runner and its declaration table; the `node:test`
conversions; runner self-tests; the measured before/after wall time in the
evidence receipt; the write-backs below.

**Acceptance criteria (all required)**

1. `npm test` runs every command the previous chain ran (the runner's
   declaration table is compared against the previous `package.json` entry
   in a test), builds before any suite that declares `needsBuild`, and exits
   non-zero when any suite fails, when a declared built test glob matches
   nothing, or when a suite is removed from the table without a recorded
   reason.
2. Suites in a serialization group never overlap (a fixture with two
   deliberately colliding suites proves the group holds); independent suites
   overlap in the recorded timeline.
3. Measured wall time on the same host, same commit, is reported before and
   after with the method; the after value is lower, and the receipt names
   which suites dominate.
4. `--only` and `--serial` work; the summary names every suite with its
   status and duration.
5. Every converted Node script reports named cases under `node:test` and
   preserves its assertions (case count before and after recorded).
6. Write-backs land: 07 §Discipline evidence-gate sentence (how to run one
   suite; the build-first rule), README "What runs today" test paragraph,
   `docs/README.md`, ledger entry; publication index rows and locks if any
   product heading changed.
7. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the runner self-test transcripts; the before/after timing
receipt; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** a coverage tool; changing what any suite asserts; rewriting
bash suites; CI configuration; watch mode; removing the mutation self-test or
the golden checks from the default gate.

**Operator-review assumptions**

1. Concurrent suites are acceptable on the operator's machine at a bounded
   parallelism; `--serial` remains for a quiet-window reproduction.
2. The bash suites stay until an order touching one converts it.
3. Faster evidence is worth one small order now because every later order
   pays the chain repeatedly.
