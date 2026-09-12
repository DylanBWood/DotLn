# WO-130 — Every reusable suite declares the inputs it reads, validated by executing it in a replica that holds only those inputs, so a document-only change composes the full gate from prior successes (version assigned at activation)

**Model:** any capable model; the measured composed gate runs on the
operator's machine. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Test infrastructure and local gate
evidence: a declaration table, a validation mode and a runner refusal; no
exported runtime capability or contract changes. Assigned at activation under
the standing opt-out default.
**Cost:** adds one replica execution per declared suite whenever its
declaration, the validator or the suite's own source changes (bounded to that
suite's duration, never per gate) and one declaration line per suite. Removes
the whole-tree suite executions from every document-only gate: on
2026-09-11/12 the composed gates after a report write ran 32 fresh tasks in
243–419 s while identical-tree reruns ran 10 fresh tasks in 41–47 s; with
WO-129 the gate after every transition joins this class (five of WO-125's ten
fresh runs, 3,876 s). Steps, commands and tokens per phase are unchanged.
**Nomination provenance:** the operator's 2026-09-12 planning dispatch
relaying a second model's plan for proof-carrying gates, whose "explicit
per-suite dependencies" and "hermetic or observed execution" defenses this
order lowers into a declaration table checked by replica execution rather
than a sandbox, syscall tracing or doubled shadow gates; WO-126-D009, which
chose conservative whole-tree reuse for unknown scopes because no mechanism
checked a declaration's completeness. Planner-synthesized draft; the dispatch
is preserved verbatim in the pass's ignored capture. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-129 merged (the per-suite key model, the shared cache and
the miss explanations this order's declarations and validator build on).
**Recommended placement:** third of the three gate orders, after WO-129 in
the same serial lane; it edits `scripts/lib/suite-evidence.mjs`,
`scripts/test-runner.mjs`, `scripts/test-suite-evidence.mjs`,
`scripts/test-process-debt.mjs` and product 07. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-129",
    "relation": "hard",
    "reason": "the per-suite key model, the shared cache and the miss explanations that the declarations and the validator build on"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (process
budget; gate execution and reuse; write once, run once); §Goal-aligned
decisions; `scripts/lib/suite-evidence.mjs` (`scopes`, `suiteScope`,
`suiteInputHash`); `scripts/test-runner.mjs` (`suites`, `expandSuiteTasks`);
`scripts/lib/gate-evidence.mjs` (`gateInstalledInputRoots`, `gateInputPath`);
`scripts/lib/release-fixtures.mjs` (the sealed template copy, the pattern for
a replica seal); `docs/evidence/WO-126/decisions.md` (D009);
`docs/evidence/WO-129/decisions.md` (once filed).

**Objective:** Every task the runner may reuse declares the candidate paths
(documents and source) and the Git state it reads, or retains whole-tree
scope with a recorded reason. A validation mode executes each declared suite
in a replica checkout that holds only its declared inputs, the installed roots
and its declared Git state; a suite that fails there has an invalid
declaration, and the runner refuses to reuse it until the declaration
changes. A document-only change, such as a verification report with its
control event, checkpoint and regenerated index, composes the full gate from
prior successes and re-executes only the build, preparation, the live checks
and the document checks whose declared inputs changed.

**Observed gap (dated 2026-09-12, `main` at `baa7a9e`):**

- `suite-evidence.mjs` declares document scopes for six names (`kernel`,
  `compiler`, `skeleton`, `worktree`, `plan-refutation:fixtures`,
  `process-debt`) and the release cases (`:86–107`); `expandSuiteTasks` gives
  every other task `reuse: "tree"`, so its key selects every candidate file,
  documents included (`test-runner.mjs:455–466`, `suite-evidence.mjs:368–389`).
  The whole-tree tasks include `resume` (67–106 s), `harness-fixtures`
  (134–160 s), `console` (47–92 s), `work-orders-fixtures` (47–89 s),
  `runner-fixtures`, `plan-refutation:current`, `checkpoint`, `github-body`,
  `release-preparation`, `license-fixtures`, `publication-fixtures`,
  `backup-intake`, `fixture-temp-root`, `adjacent-queue`, `authority-grants`,
  `artifact-corpus`, `mutation`, the document checks (`format`, `index`,
  `publication`, `plan`) and the evidence checks (`authority-evidence`,
  `artifact-evidence`, `verification-evidence`, `feedback-evidence`).
- Measured: the composed gates after a report write on 2026-09-11/12 took
  243.5, 246.9, 371.5, 413.6 and 418.7 s with 32 fresh and 46 reused tasks;
  identical-tree reruns took 40.6, 40.8, 46.9 and 42.1 s with 10 fresh and 68
  reused. The difference is the whole-tree class re-executing for bytes it
  never read.
- No mechanism checks that a declaration is complete. WO-126-D009 chose
  whole-tree reuse for unknown scopes for that reason, and it was right to:
  an incomplete declaration reuses a stale success and reports a green gate
  for bytes no suite tested.

**Design (scope discipline):**

- A declaration names the candidate path patterns a suite reads (directories
  and files, documents and source) and its Git state from WO-129; the default
  for an undeclared task stays whole-tree. A declaration may narrow source
  paths too (a kernel test that never reads `scripts/`), but only where the
  replica proves it.
- The validation mode, `npm run test:full -- --validate-inputs [--only <suite>]`,
  builds a replica per declared suite: the declared candidate paths and the
  installed roots copied with clone-on-write where the filesystem supports it
  (`COPYFILE_FICLONE`, ordinary copy otherwise; no new dependency), and the
  declared Git state in a repository the suite can read; the suite runs there
  with the reviewed environment projection. A pass records the validated
  declaration keyed by declaration, validator and suite source, so it re-runs
  only on change; a failure marks the declaration invalid and the runner
  refuses reuse for that suite, naming it, until the declaration changes.
- A mutation matrix fixture changes one input at a time and asserts that
  exactly the expected suites miss; it extends WO-129's Git-state fixture to
  documents and source.
- **Declined alternatives, recorded:** a sandbox or syscall tracing (platform
  specific, heavy, and a second execution model beside the replica); test
  impact selection from a diff heuristic (the runner reuses whole-suite
  results by exact inputs and infers nothing); doubled shadow gates
  (a fresh gate after every composed one would restore the cost the order
  removes; the replica proves completeness once per declaration change
  instead); time-based expiry of evidence (a content-addressed success does
  not become false with age; a changed input does).

**Deliverables:** the declaration table; the validation mode and its records;
the runner refusal; the mutation matrix and composition fixtures; the
operator-host measurement; the write-backs.

**Acceptance criteria (all required)**

1. Every task the runner may reuse has a reviewed declaration of the candidate
   paths and Git state it reads, or an explicit whole-tree retention with its
   reason; the four document checks and the four evidence checks may retain
   whole-tree scope or declare directories.
2. `npm run test:full -- --validate-inputs [--only <suite>]` executes each
   declared suite in a replica holding only its declared inputs, the installed
   roots and its declared Git state; a suite that fails there marks its
   declaration invalid, the runner refuses reuse for it until the declaration
   changes and names the suite, and the validator's record is keyed by
   declaration, validator and suite source so it re-runs only on change; a
   fixture with a suite that reads an undeclared file proves the invalidation.
3. A mutation matrix fixture changes, one at a time, a declared document, an
   undeclared document, a declared source file, a source file outside a
   narrowed declaration, a declared ref and an environment key, and asserts
   that exactly the expected suites miss.
4. In the WO-129 three-role fixture, the gates after the verification report
   and after the final-review report re-execute only the build, preparation,
   the live checks and the document checks whose declared inputs changed; the
   fixture asserts the counts.
5. On the operator's host, a document-only change (a verification report, its
   control event and checkpoint, and the regenerated index) composes the full
   gate; the row and wall-clock are recorded in `docs/evidence/WO-130/`
   beside the 2026-09-11/12 composed rows (243–419 s) and identical-tree rows
   (41–47 s).
6. Write-backs land: 07 §Discipline (the gate execution and reuse bullet),
   `docs/evidence/WO-130/decisions.md` with dispatch sources and reopening
   conditions, the decisions index and the follow-up register; `npm test`
   green; `git diff --check` clean; no new dependency.

**Evidence gate:** `npm run harness -- evidence`; one complete
`--validate-inputs` run recorded in the evidence directory; the fixture
transcripts; the operator-host composed row of criterion 5.

**Write-back duty:** sources and reopening conditions in the order's decisions
file; the ledger is reserved for operator ideation and planning synthesis.
Record corrections the same day as what was misread, meant and changed.

**Non-goals:** deadlines and exclusivity (WO-128); the key model and the
cache (WO-129); deleting or merging tests; the cold-gate structural cuts
(07 §Candidate — cold-gate structural cuts); a remote cache; a sandbox or
tracing runtime.

**Operator-review assumptions**

1. The replica may use clone-on-write copies where the filesystem supports
   them; the validator is not part of every gate and runs when a declaration,
   the validator or a suite's source changes.
2. Whole-tree retention for the cheap document checks is acceptable when the
   measured composed gate meets criterion 5 without them; the order records
   which checks retain it and why.
