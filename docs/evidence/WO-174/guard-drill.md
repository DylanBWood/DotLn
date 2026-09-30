# WO-174 guard and direct-coverage negative controls

Observed 2026-09-30T17:15:05.482Z; executor base dd141ad16dbd60e39ffb5afab21df57689cf4b79. The base runner and runner-test sources byte-match the nominated feb7a92e1d41d6db3259f98b31521601686bbe04 sources (git diff of those two paths is empty). Copies and raw logs remain in session scratch. Paths below are normalized.

The product fixture is a Git repository with tracked docs/probe.md and a Node test named named docs read fixture that calls readFileSync on it. executeSuite is called with product: true and packageTest: true.

| Runner | Task exit | Test itself |
| --- | ---: | --- |
| Base, matching feb7a92e | 0 | passed |
| Guarded implementation | 1 | passed; runner rejected its read |

```text
✔ named docs read fixture (0.735583ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 45.360875

Product read guard: 2 excluded-input observations (<session-scratch>/guard-drill/docs/control/local/harness/runner/product-reads/product-probe-<run>.jsonl)
Product read guard: <root> > named docs read fixture reads docs/probe.md (readFileSync); tag the case [document]
Product read guard: <root> > named docs read fixture reads docs/probe.md (openSync); tag the case [document]
```

A scratch Node fixture asserts that the base runner must reject this read; node --test --test-reporter=tap <session-scratch>/negative-fixtures.test.mjs exits 1 with both negative-control tests failing. Its guard assertion proves the new fixture fails on the old source rather than merely printing a difference:

```text
# Subtest: WO-174 docs read fixture against the unchanged nominated runner source
not ok 1 - WO-174 docs read fixture against the unchanged nominated runner source
  ---
  duration_ms: 79.03275
  type: 'test'
  location: '<session-scratch>/negative-fixtures.test.mjs:7:1'
  failureType: 'testCodeFailure'
  error: |-
    A product task reading docs/probe.md must fail; the old source returns zero

    0 !== 1

  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 1
  actual: 0
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file://<session-scratch>/negative-fixtures.test.mjs:9:9)
    process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    async Test.run (node:internal/test_runner/test:1409:7)
    async startSubtestAfterBootstrap (node:internal/test_runner/harness:387:3)
  ...
```

The direct-coverage assertion against the same base lists reports 73 uncovered suite/path pairs; the repaired table has 0. Its failure includes:

```text
harness-fixtures: uncovered packages/compiler/src/artifact-identity.ts
harness-fixtures: uncovered packages/compiler/src/index.ts
harness-fixtures: uncovered packages/compiler/src/operator-control.mjs
harness-fixtures: uncovered packages/skeleton/src/gate-deadlines.mjs
harness-fixtures: uncovered scripts/bootstrap.mjs
harness-fixtures: uncovered scripts/harness-entry.mjs
harness-fixtures: uncovered scripts/harness.mjs
harness-fixtures: uncovered scripts/lib/evidence-preparation.mjs
harness-fixtures: uncovered scripts/lib/gate-evidence.mjs
harness-fixtures: uncovered scripts/lib/terms.mjs
harness-fixtures: uncovered scripts/release.mjs
harness-fixtures: uncovered scripts/test-fixture-temporary.mjs
process-debt: uncovered packages/compiler/src/feedback.ts
process-debt: uncovered packages/compiler/src/index.ts
process-debt: uncovered packages/compiler/src/operator-control.mjs
process-debt: uncovered packages/skeleton/src/feedback-boundary.ts
process-debt: uncovered packages/skeleton/src/feedback-selfhost.ts
process-debt: uncovered packages/skeleton/src/gate-deadlines.mjs
process-debt: uncovered packages/skeleton/src/harness-command.ts
process-debt: uncovered packages/skeleton/src/observed-facts.ts
process-debt: uncovered packages/skeleton/src/writer-teardown.mjs
process-debt: uncovered scripts/bootstrap.mjs
process-debt: uncovered scripts/harness-context.mjs
process-debt: uncovered scripts/harness.mjs
process-debt: uncovered scripts/lib/adjacent-queue.mjs
process-debt: uncovered scripts/lib/gate-evidence.mjs
process-debt: uncovered scripts/lib/harness.mjs
process-debt: uncovered scripts/lib/plan-receipts.mjs
process-debt: uncovered scripts/meta.mjs
process-debt: uncovered scripts/operator-control.mjs
process-debt: uncovered scripts/refute-plan.mjs
process-debt: uncovered scripts/release.mjs
process-debt: uncovered scripts/resume.mjs
process-debt: uncovered scripts/test-beacon-fixture.mjs
process-debt: uncovered scripts/test-fixture-temporary.mjs
meta: uncovered scripts/lib/executor-handoff.mjs
meta: uncovered scripts/lib/plan-subject.mjs
```

The actual runner fixtures additionally check uncovered entry/direct-import/literal-spawn inputs, blank versus reasoned exclusions, all six required fs forms, async/nested attribution, root Markdown, .agents, .claude, generated attributes and inherited Node children. Their complete run is recorded by the final review gate. Scope: direct entry files, runtime relative imports and literal first-party script paths in entry code; transitive imports and paths built at run time are outside this check.
