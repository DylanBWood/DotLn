# Part A: an instance's selection with advised tasks

Captured 2026-11-17T18:05:36Z by a script in session scratch: `runGate(["--document", "--serial"])` of `scripts/test-runner.mjs` over a small repository that holds the kit's manifest and no package sources, with a table of four tasks. The `format` row (a structural row) and the `index` row each print one line and exit 3; `kit-verify` and `after` pass. No stops section is set, so both failures meet a record stop at the instance's default level. Durations are printed as `<duration>`.

## What the selection printed

```text
ADVISED format <duration>
  [format] format: a record of the kit is out of date
  [format] ADVISORY this task failed (exit 3) and is recorded as advised. Stop gate-format advises in this root and the work goes on; it protects the form of documents and code: what the formatter would rewrite. "stops": { "gate-format": "refuse" } in dotln.config.json makes it refuse and "off" silences it.
PASS kit-verify <duration>
ADVISED index <duration>
  [index] index: a record of the kit is out of date
  [index] ADVISORY this task failed (exit 3) and is recorded as advised. Stop gate-index advises in this root and the work goes on; it protects the work-order index and its sequence kept current. "stops": { "gate-index": "refuse" } in dotln.config.json makes it refuse and "off" silences it.
PASS after <duration>
npm run test:docs: 4 passed (2 of them advised: format, index); 0 failed; <duration>; 4 fresh tasks
```

## What its row recorded

```json
{
  "checkId": "npm run test:docs",
  "exitCode": 0,
  "failedFirst": null,
  "advisedTasks": [
    {
      "name": "format",
      "stops": [
        "gate-format"
      ]
    },
    {
      "name": "index",
      "stops": [
        "gate-index"
      ]
    }
  ],
  "cases": [
    {
      "name": "kit-verify",
      "exitCode": 0,
      "executed": true
    },
    {
      "name": "format",
      "exitCode": 0,
      "executed": true,
      "advisedStops": [
        "gate-format"
      ],
      "advisedExitCode": 3,
      "output": "format: a record of the kit is out of date\n"
    },
    {
      "name": "index",
      "exitCode": 0,
      "executed": true,
      "advisedStops": [
        "gate-index"
      ],
      "advisedExitCode": 3,
      "output": "index: a record of the kit is out of date\n"
    },
    {
      "name": "after",
      "exitCode": 0,
      "executed": true
    }
  ]
}
```
