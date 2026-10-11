---
{
  "release": "v0.73.1",
  "surface": "prBody",
  "variant": "balanced",
  "profile": {
    "audience": "contributor",
    "density": "account",
    "identifiers": "where they help",
    "machineDetail": "summarized",
    "voice": "plain"
  },
  "sourceNotes": [
    "These are historical publication samples, not new validation of the release. The PR says verifications 1–4 met every criterion while the release notes say VER-004 failed criterion 2. The progressive-polish paragraph labels 0.35.1 as skeleton; component metadata distinguishes skeleton 0.57.1 and harness host 0.35.1. Each record retains its published source and the comparison judges preservation within each surface."
  ],
  "facts": [
    {
      "id": "application-version",
      "anchor": "v0.73.1"
    },
    {
      "id": "previous-version",
      "anchor": "v0.73.0"
    },
    {
      "id": "snapshot-start",
      "anchor": "sharedRefs.start"
    },
    {
      "id": "snapshot-end",
      "anchor": "sharedRefs.end"
    },
    {
      "id": "remote-branch",
      "anchor": "origin/main"
    },
    {
      "id": "dotln-ref-count",
      "anchor": "refs/dotln/"
    },
    {
      "id": "diagnostic-line",
      "anchor": "shared refs moved:"
    },
    {
      "id": "reader-path",
      "anchor": "packages/skeleton/src/gate-evidence.mjs"
    },
    {
      "id": "runner-path",
      "anchor": "scripts/test-runner.mjs"
    },
    {
      "id": "snapshot-comparison",
      "anchor": "sharedRefChanges"
    },
    {
      "id": "observed-absence",
      "anchor": "absent"
    },
    {
      "id": "failed-read",
      "anchor": "unreadable"
    },
    {
      "id": "damaged-ref-source",
      "anchor": "packed-refs"
    },
    {
      "id": "missing-baseline",
      "anchor": "baseline"
    },
    {
      "id": "correlation-limit",
      "anchor": "correlation"
    },
    {
      "id": "harness-command",
      "anchor": "node scripts/harness.mjs evidence"
    },
    {
      "id": "damage-matrix",
      "anchor": "72-gate"
    },
    {
      "id": "document-check",
      "anchor": "npm run test:docs"
    },
    {
      "id": "document-duration",
      "anchor": "122.59 s"
    },
    {
      "id": "review-check",
      "anchor": "npm test -- --review"
    },
    {
      "id": "fresh-new-cases",
      "anchor": "13.16 s"
    },
    {
      "id": "fresh-executor-duration",
      "anchor": "1,731.7 s"
    },
    {
      "id": "runner-cost",
      "anchor": "126.5 s"
    },
    {
      "id": "skeleton-version",
      "anchor": "0.57.1"
    },
    {
      "id": "host-version",
      "anchor": "0.35.1"
    },
    {
      "id": "reopening-threshold",
      "anchor": "27.2 s"
    },
    {
      "id": "real-tag-count",
      "anchor": "153"
    },
    {
      "id": "real-reader-duration",
      "anchor": "41.6 ms"
    },
    {
      "id": "process-cutoff",
      "anchor": "2026-10-10T01:18:50.328Z"
    },
    {
      "id": "process-collection",
      "anchor": "npm run meta"
    },
    {
      "id": "unavailable-observations",
      "anchor": "43"
    },
    {
      "id": "gate-record-duration",
      "anchor": "7821"
    },
    {
      "id": "gate-record-time",
      "anchor": "2026-10-10T01:25:59.569Z"
    }
  ]
}
---

# Shared refs on failed worktree gates

Application v0.73.1 is a patch over v0.73.0. Every gate row now records the shared refs a linked worktree saw, and a failed gate prints one line naming changes. This addresses the earlier failure after a sibling merged into `main`, when attribution took about an hour ([WO-179 D012](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-179/decisions.md#wo-179-d012--failure-unchecked-review-selection-and-unsupported-cause)); the snapshot stays outside code identity and the verdict.

The row carries `sharedRefs.start` and `sharedRefs.end`: the `origin/main` and `main` commit ids, the count and newest name of annotated `v*` tags, and the count of `refs/dotln/` refs. On failure, the runner compares this run's start with the end of the same check's previous row in that checkout, then its own start with its end. The result is one line such as `shared refs moved: since previous: origin/main 47a6c24d..0be5b31b; during run: tags +v9000.0.1 (count 0..1, newest absent..v9000.0.1)`. A passing row prints nothing.

**How reads and comparisons behave.** `readSharedRefs` in `packages/skeleton/src/gate-evidence.mjs` makes four Git reads through one non-throwing helper. A quiet `rev-parse` records `absent` when Git completes the read without finding a commit, including a missing, removed, dangling or non-commit ref; a ref hidden by file permissions also reads `absent` because Git reports it missing. A read Git cannot complete, such as exit 128 on damaged `packed-refs` or a launch failure, records `unreadable`; failed enumerations discard partial counts. In `scripts/test-runner.mjs`, `sharedRefChanges` compares structurally complete snapshots, names changes to and from `absent` (including a first push reported as `origin/main absent..0be5b31b`), and withholds only a field that is `unreadable` on either side. A guarded previous-row lookup supplies no baseline for a damaged history archive, a legacy row without a snapshot or a malformed earlier snapshot; start and end are still compared, and the failed row and summary still record. [D017](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-198/decisions.md#wo-198-d017--compare-observed-absence-and-withhold-only-unreadable-fields) explains the distinction.

**Read before merging.** The line reports correlation, not cause. Movement entirely between samples, or a tag or ref re-pointed under the same name without changing the counted fields, is outside the snapshot. When `npm test` fails under `node scripts/harness.mjs evidence`, the harness adds its own row without a snapshot after the runner's row, hiding the next since-previous delta after a ref move. That gap is boarded for the next order editing the writer ([D004](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded), FUP-f5f10101e717d59b).

**Validation and cost.** The [first](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/verifications/WO-198/VER-001.md) through [fourth verification](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/verifications/WO-198/VER-004.md) each reported the criteria met and failed on a diagnostic defect: a malformed earlier snapshot, damaged archive, unenumerable shared ref or withheld branch creation. Each defect was repaired at its cause with a regression. The [fifth verification](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/verifications/WO-198/VER-005.md) passed twelve branch-transition scenarios, a 72-gate damage matrix against `HEAD` and nine Git ref states. Final review found `main` at the order's base, so integration changed no judged byte; it reran all 17 new cases (17 of 17 in 13.16 s), matched direct Git on the real corpus (153 annotated tags, newest `v0.73.0`, all five values equal in 41.6 ms), and passed publication, harness, release-surface, document-ceiling, index and format checks. `npm run test:docs` passed 32 of 32 suites in 122.59 s. At code identity `a5923da7…`, `npm test -- --review` composed 38 passing suites in 7.82 s from the executor's passing fresh row at that identity (90 fresh tasks, 1,731.7 s, exit 0), with format preflight always fresh. The product-gate record marks `npm test` executed, exit 0, in 7821 ms, recorded at 2026-10-10T01:25:59.569Z; reports and release metadata may follow that reviewed tree without changing its code identity. See [FINAL-001](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/final-reviews/WO-198/FINAL-001.md) for the evidence.

The new `runner-fixtures` cases add about 13 s; the task's fresh review duration of 126.5 s exceeds the planning receipt's 27.2 s reopening threshold. That growth predates this order: `main` took 72 to 94 s on 2026-10-09 before activation. [D021](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning) records it for planning. Skeleton advances to 0.57.1 and the harness host to 0.35.1 for the diagnostic module and regenerated bundle; the console pin and lockfile follow, and no dependency is added.

**Recorded observations.** The process meter's cutoff is 2026-10-10T01:18:50.328Z. `npm run meta` collected canonical control events and recorded gate, usage and harness observations for the recent work and dispatch comparisons. The generated tables omit 43 unavailable observations as blank cells or rows: unavailable is not zero, and unset ceilings do not approve a future limit. The published product-gate record carries the full code identity, reviewed tree and evidence reference; see the [review evidence](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/final-reviews/WO-198/FINAL-001.md).
