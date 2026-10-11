---
{
  "release": "v0.73.1",
  "surface": "prBody",
  "variant": "reader",
  "profile": {
    "audience": "newcomer",
    "density": "account",
    "identifiers": "none in prose",
    "machineDetail": "linked",
    "voice": "warm"
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

# See what moved when a worktree gate fails

If a gate passes in one worktree and fails after a sibling merges into `main`, you can now see which shared refs moved. Earlier, finding that out took the operator about an hour; the [earlier investigation](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-179/decisions.md#wo-179-d012--failure-unchecked-review-selection-and-unsupported-cause) records it. Application v0.73.1, a patch over v0.73.0, saves the refs visible to each gate and adds a diagnostic line when a task fails. These snapshots do not enter code identity or the verdict, and a passing row prints nothing.

Each row saves `sharedRefs.start` and `sharedRefs.end`. They contain the `origin/main` and `main` commit ids, the count and newest name of annotated `v*` tags, and the count of `refs/dotln/` refs. On failure, the runner compares the start with the previous row's end for the same check in that checkout, then compares the current start and end. You can recognize the result by `shared refs moved:`, followed by changes since the previous check and during this run; an example is `shared refs moved: since previous: origin/main 47a6c24d..0be5b31b; during run: tags +v9000.0.1 (count 0..1, newest absent..v9000.0.1)`.

**Use the line as a clue.** A named move shows correlation; you still decide whether it caused the failure. The snapshot misses movement wholly between its samples, and a tag or ref re-pointed under the same name when the counted fields stay unchanged. There is also a [known gap](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded): a failed `npm test` under `node scripts/harness.mjs evidence` is followed by the harness's own row without a snapshot, so the next failure after a ref move has no since-previous delta. That gap is assigned to the next order that edits the writer.

**Missing and unreadable are different.** The snapshot reader, `readSharedRefs` in `packages/skeleton/src/gate-evidence.mjs`, uses four Git reads through one non-throwing helper. Its quiet `rev-parse` records `absent` when a completed read finds no commit, including missing, removed, dangling or non-commit refs; a ref hidden by file permissions also reads `absent` because Git reports it missing. It records `unreadable` when Git cannot complete the read, such as exit 128 on damaged `packed-refs` or a launch failure; failed enumerations discard partial counts. In `scripts/test-runner.mjs`, `sharedRefChanges` compares complete snapshot structures, recognizes movement to or from `absent`, and skips only a field unreadable on either side. A first push can therefore appear as `origin/main absent..0be5b31b`. A damaged history archive, an old row without a snapshot or a malformed earlier snapshot provides no previous baseline, but the run still compares its own start and end and records the failed row and summary. The [comparison explanation](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-198/decisions.md#wo-198-d017--compare-observed-absence-and-withhold-only-unreadable-fields) has the detail.

**What was checked.** The [first](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/verifications/WO-198/VER-001.md) through [fourth verification](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/verifications/WO-198/VER-004.md) reported the criteria met and each failed on one diagnostic defect: a malformed earlier snapshot, a damaged archive, a ref Git could not enumerate, or branch creation the comparison failed to name. Each was repaired at its cause and gained a regression. The [passing verification](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/verifications/WO-198/VER-005.md) covered twelve branch-transition scenarios, a 72-gate damage matrix against `HEAD` and nine Git ref states. Final review found `main` at the order's base, so integration changed no judged byte. It passed the 17 new cases in 13.16 s; matched all five snapshot values with direct Git on 153 annotated tags, newest `v0.73.0`, in 41.6 ms; and passed publication, harness, release-surface, document-ceiling, index and format checks. `npm run test:docs` passed all 32 suites in 122.59 s. `npm test -- --review` composed 38 passing suites in 7.82 s from the executor's passing fresh evidence at the same code identity (90 tasks, 1,731.7 s, exit 0), while running format preflight fresh. The product-gate record marks `npm test` executed with exit 0 in 7821 ms at 2026-10-10T01:25:59.569Z; reports and release metadata may follow that reviewed tree without changing its code identity. The [final review](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/final-reviews/WO-198/FINAL-001.md) provides the validation details; the published gate record carries the full code identity, reviewed tree and evidence reference.

The new `runner-fixtures` cases cost about 13 s. The task took 126.5 s fresh in the review row, above the planning receipt's 27.2 s reopening threshold; its growth predates this change, with `main` already taking 72 to 94 s on 2026-10-09 before activation. The [planning record](https://github.com/DylanBWood/DotLn/blob/b4cfb93adc836b8e0208d7001a7bf578ad2c6037/docs/evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning) tracks that cost. Skeleton advances to 0.57.1 and the harness host to 0.35.1 for the diagnostic module and regenerated bundle, with the console pin and lockfile updated; no dependency is added.

The process observations stop at 2026-10-10T01:18:50.328Z and come from canonical control events and recorded gate, usage and harness observations collected by `npm run meta`. The published recent-work and dispatch comparisons leave 43 unavailable observations blank or omit their rows. Read those as unknown values: unavailable is not zero, and an unset ceiling does not approve a future limit.
