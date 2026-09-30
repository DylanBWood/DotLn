# WO-174 machinery-selection drill

Observed 2026-09-30T17:15:05.482Z; isolated base and implementation copies from dd141ad16dbd60e39ffb5afab21df57689cf4b79. The focused command is node --test --test-reporter=tap --test-name-pattern='WO-166 evidence wait exits' scripts/test-harness.mjs. It passes at the base (exit 0).

The exact mutant in scripts/harness.mjs changes:

```js
process.exitCode = status === "passed" ? 0 : status === "failed" ? 1 : 2;
// to
process.exitCode = status === "passed" ? 0 : 2;
```

Base declared-source selection misses harness-fixtures: configuration-root, harness, registrations. registrations is present because the preceding document drill remains in this disposable copy. The isolated single-file selections are separately recorded in costs.md.

With repaired declarations, node scripts/test-runner.mjs --review --list includes the suite that judges this behavior:

```text
configuration-root — protects: an absent dotln.config.json reproduces today's layout, a declared launchpad moves every document root and root derivation, and a malformed configuration refuses by path
harness-fixtures — protects: writer, gate, planning, agent-budget and outside-write refusals preserve their boundaries
harness — protects: installed hooks and role text match the generated harness bundle
process-debt — protects: process observations, follow-ups and lifecycle handoffs retain their sources
```

Running that selected suite's focused evidence-wait case on the mutant exits 1:

```text
# Subtest: WO-166 evidence wait exits for pass, failure, timeout and absent row
not ok 1 - WO-166 evidence wait exits for pass, failure, timeout and absent row
  ---
  duration_ms: 1811.428875
  type: 'test'
  location: '<session-scratch>/drill-current/scripts/test-harness.mjs:656:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:

    2 !== 1

  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 1
  actual: 2
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file://<session-scratch>/drill-current/scripts/test-harness.mjs:751:12)
    process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    async Test.run (node:internal/test_runner/test:1409:7)
    async startSubtestAfterBootstrap (node:internal/test_runner/harness:387:3)
  ...
1..1
# tests 1
# suites 0
```

The failed-row wait returns 2, and the test requires 1. The working harness file is unchanged; the mutant stays in scratch.
