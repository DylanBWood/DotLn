---
{
  "release": "v0.73.1",
  "surface": "releaseNotes",
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
      "id": "reader-command",
      "anchor": "rev-parse --verify --quiet"
    },
    {
      "id": "commit-peel",
      "anchor": "^{commit}"
    },
    {
      "id": "tag-read",
      "anchor": "refs/tags/v*"
    },
    {
      "id": "snapshot-validator",
      "anchor": "completeSharedRefs"
    },
    {
      "id": "followup-owner",
      "anchor": "runHarnessEvidenceChecks"
    },
    {
      "id": "validator-matrix",
      "anchor": "21"
    },
    {
      "id": "retained-revisions",
      "anchor": "001 to 003"
    },
    {
      "id": "git-version",
      "anchor": "Git 2.55.0"
    },
    {
      "id": "node-version",
      "anchor": "Node 26"
    }
  ]
}
---

## Release overview

If you run orders in parallel worktrees, a failed gate now gives you a clearer trail to follow. Application v0.73.1 records the shared refs the gate saw and names the fields that moved. Worktrees share tags, branches and `refs/dotln/`, so a sibling's merge into `main` or a release tag becomes visible as soon as it lands. Previously those refs were missing from the gate row, and investigating a suite that passed before a merge and failed afterward took about an hour. The change also helps verifiers and reviewers read a failed row.

Every runner row, whether a single suite or a composed run, saves `sharedRefs.start` and `sharedRefs.end`. The snapshots contain the `origin/main` and `main` commit ids, the count and newest name of annotated `v*` tags, and the count of `refs/dotln/` refs. They are read at gate start and after the last task. A failed gate prints one `shared refs moved:` line comparing the start with the same check's previous row in that checkout, then comparing the current start and end. A tag example is `tags +v9000.0.1 (count 0..1, newest absent..v9000.0.1)`; a passing row prints nothing.

A linked-worktree fixture runs document and plain gates on either side of a commit, annotated tag and push on `main`. Every task keeps its result, and the second rows contain the new refs. The integration guidance now states that rule in place.

## Read before upgrading

- **Use the line to investigate.** It reports correlation; you decide whether the move caused the failure. It misses movement wholly between samples and a tag or `refs/dotln/` ref re-pointed under the same name when its counted fields stay unchanged. The [snapshot limits](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d002) explain the boundary.
- **Read missing and unreadable separately.** `absent` means a completed read found no commit, including missing, removed, dangling or non-commit refs and a ref Git reports missing because of file permissions. `unreadable` means Git could not finish, for example exit 128 on damaged `packed-refs` or a launch failure. It is never a count; it skips only that field's comparison and leaves the gate's exit code, row and summary intact. See the [read-result explanation](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d017--compare-observed-absence-and-withhold-only-unreadable-fields).
- **Old or damaged history gives no previous baseline.** A legacy row without a snapshot, a malformed earlier snapshot or a damaged history archive cannot supply the since-previous comparison. The gate still compares its own start and end and records the failed row.
- **One known gap remains.** After `npm test` fails under `node scripts/harness.mjs evidence`, the command writes its own row without a snapshot after the runner's row. The next failure after a ref move therefore has no since-previous delta. The [follow-up](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded) is assigned to the next order editing `runHarnessEvidenceChecks`.
- **The merge fixture is smaller than a live gate.** It runs three fixture tasks, not the live suites. None flipped, which supports independence in that fixture without proving it for every live task. The next live flip is what the delta line attributes.
- **Check the component versions.** Application v0.73.1 is a patch over v0.73.0. Skeleton moves from 0.57.0 to 0.57.1 and the harness host from 0.35.0 to 0.35.1 for the diagnostic module and regenerated hook bundle; the console pin and lockfile follow. No dependency is added.

## Substantive changes

The snapshot reader lives in `packages/skeleton/src/gate-evidence.mjs` as `readSharedRefs(root)`. It makes four Git reads through one non-throwing helper: `rev-parse --verify --quiet` on the `^{commit}` peel of `refs/remotes/origin/main` and `refs/heads/main`, then `for-each-ref` for `refs/tags/v*` and `refs/dotln/`. Exit 0 keeps a branch commit, exit 1 records `absent`, and other exits or launch failures record `unreadable`. Tagger date determines tag order, with the full name breaking ties; lightweight tags are excluded. A failed enumeration marks its fields unreadable and discards partial output. The strict `git()` helper for tree and code identity stays unchanged.

In `scripts/test-runner.mjs`, the runner samples before preflight and inside the row literal after the last task, then saves `sharedRefs: { start, end }`. The exported `completeSharedRefs` validator checks string branch fields, a tags object with a safe-integer or `unreadable` count and string newest, and a safe-integer or `unreadable` ref count. The exported `sharedRefChanges` compares complete snapshots one field at a time, names changes to or from `absent` and skips only unreadable fields. If tag count rises and newest changes, the output is `tags +NEWEST (count a..b, newest x..y)`. A guarded lookup takes the latest earlier row of that check on failure; unreadable or malformed history supplies no baseline. The runner joins since-previous and during-run changes in one line before recording the row.

The test runner gains seventeen cases. They cover the sibling merge with a bare origin and linked worktree; a forced failure; movement during failure and a return to the earlier value; legacy, incomplete and malformed snapshots; a damaged archive and an unselectable archived timestamp; 21 malformed validator shapes; unreadable tags before and during passing and failing linked-worktree gates; `origin/main` created between failures; and Git's classification of missing, dangling, non-commit and unreadable refs. The [final review](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/final-reviews/WO-198/FINAL-001.md) connects these cases to their evidence.

## Progressive polish

The integration guidance adds the rule in three sentences. Authority, artifact-identity and verification evidence are re-minted at revision 004, retaining revisions 001 to 003 and carrying the earlier feedback edition. The harness bundle and manifest are regenerated for skeleton 0.35.1; the software-engineer publication source lock is refreshed, and the README's release claim becomes v0.73.1. The [handoff](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/handoff.md) keeps the evidence paths with the work record.

## Evidence and compatibility

This patch was integrated with `main` at the order's own base, so integration changed no judged byte. The [integration record](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d020) keeps the commit id. Application `v0.73.1` replaces `v0.73.0`, Skeleton 0.57.1 replaces 0.57.0, and the harness host 0.35.1 replaces 0.35.0; no other component changes and no dependency is added. The `sharedRefs` field adds diagnostic metadata, and every existing gate-row reader passes in the review gate.

The evidence shows the repairs as well as the pass. The [first verification](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-001.md) failed on a malformed earlier snapshot that crashed a failed gate before it recorded, and tracked the snapshot-less harness row. The [second](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-002.md) confirmed that repair and failed on a damaged archive that prevented recording. The [third](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-003.md) confirmed the archive repair and failed on a ref Git could not enumerate, making the snapshot throw where `main` passed. The [fourth](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-004.md) confirmed the ref-read repair across a 72-gate damage matrix, then failed criterion 2 because branch creation and removal were never named. The [fifth](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-005.md) passed twelve branch-transition scenarios, the damage matrix against `HEAD` and nine Git ref states without a new defect.

The [final review](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/final-reviews/WO-198/FINAL-001.md) passed at the integrated tree: all 17 new cases ran fresh in 13.16 s under the bounded runner, the reader matched direct Git on the real corpus, the affected checks passed, and `npm run test:docs` passed all 32 suites in 122.59 s. `npm test -- --review` composed passing evidence at the unchanged code identity from the executor's fresh row of 90 tasks in 1,731.7 s; the linked review keeps that identity and the machine record.

The harness host-row gap still hides the next since-previous delta. The `runner-fixtures` task took 126.5 s fresh, above the planning receipt's reopening threshold; the growth predates this order and the new cases cost about 13 s in isolation. The [planning follow-up](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning) records it. Coverage is one macOS host with Git 2.55.0 and Node 26, and no live sibling merge into this repository's `main` was exercised during a gate. The [decisions](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md) and [handoff](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/handoff.md) retain the full record.
