---
{
  "release": "v0.73.1",
  "surface": "releasePage",
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
    },
    {
      "id": "source-commit",
      "anchor": "c676909066d278c92cacd94d998a42a8fb5d4a9a"
    },
    {
      "id": "workspace-version",
      "anchor": "unversioned"
    },
    {
      "id": "beacons-version",
      "anchor": "0.1.1"
    },
    {
      "id": "browser-evidence-version",
      "anchor": "0.1.0"
    },
    {
      "id": "compiler-version",
      "anchor": "0.26.0"
    },
    {
      "id": "console-version",
      "anchor": "0.4.2"
    },
    {
      "id": "kernel-version",
      "anchor": "0.6.0"
    },
    {
      "id": "event-schema",
      "anchor": "eventEnvelope"
    },
    {
      "id": "control-schema",
      "anchor": "controlLog"
    },
    {
      "id": "configuration-schema",
      "anchor": "artifactConfiguration"
    },
    {
      "id": "evaluable-cadence",
      "anchor": "Backoff"
    },
    {
      "id": "deferred-cadence",
      "anchor": "Repeat"
    },
    {
      "id": "changed-file-count",
      "anchor": "109"
    },
    {
      "id": "source-distribution",
      "anchor": "source-only"
    },
    {
      "id": "branch-scope",
      "anchor": "judges only what its branch can see"
    }
  ]
}
---

DotLn v0.73.1

## Release overview

A worktree's gate judges only what its branch can see.

Application v0.73.1 makes a worktree's gate record the shared refs it saw and name changes when a task fails. It serves the operator running parallel worktrees and the verifier and reviewer reading failed rows. Worktrees share tags, branches and `refs/dotln/`; a sibling merge into `main` or a release tag is visible as soon as it lands. Until now a gate row did not record those refs, and attribution after a previously passing suite failed following a merge cost about an hour.

Every runner row, including single-suite and composed runs, now has `sharedRefs.start` and `sharedRefs.end`. Each snapshot holds the `origin/main` and `main` commit ids, the count and newest name of annotated `v*` tags, and the count of `refs/dotln/` refs. The runner reads them at gate start and after the last task. A failed gate prints one `shared refs moved:` line for changes since the same check's previous row in that checkout and during the run; a passing row prints nothing. A tag change can read `tags +v9000.0.1 (count 0..1, newest absent..v9000.0.1)`.

The linked-worktree fixture runs document and plain gates, lands a commit, annotated tag and push on `main` between runs, and confirms the same task results with the new refs on the second rows. Product 07 §Independent workflows and integration states the rule in place.

## Read before upgrading

- **Judge cause separately.** The line reports correlation, not cause. It misses movement wholly between samples, and a tag or `refs/dotln/` ref re-pointed under the same name while the counted fields stay unchanged ([D002](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d002)).
- **Distinguish the two read results.** `absent` means a completed read found no commit: missing, removed, dangling or non-commit refs, including a ref Git reports missing because of file permissions. `unreadable` means Git could not complete the read, such as exit 128 on damaged `packed-refs` or a launch failure. It is never a count, suppresses only its own field's comparison, and never changes the gate's exit code, row or summary ([D017](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d017--compare-observed-absence-and-withhold-only-unreadable-fields)).
- **A missing baseline stays missing.** A legacy row without a snapshot, a malformed earlier snapshot or a damaged history archive supplies no since-previous baseline. The run's start and end are still compared and the failed row still records.
- **The harness host-row gap remains.** A failed `npm test` under `node scripts/harness.mjs evidence` is followed by the command's own row without a snapshot, so the next failure after a ref move has no since-previous delta. Repair is boarded for the next order editing `runHarnessEvidenceChecks` ([D004](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded), FUP-f5f10101e717d59b).
- **The fixture uses three tasks.** The sibling-merge case runs three fixture tasks rather than the live suites. No task flipped, supporting gate independence in that fixture; it does not prove that every live task ignores shared refs. The next live flip is what the delta line attributes.
- **Versions advance together.** Application v0.73.1 is a patch over v0.73.0. Skeleton moves from 0.57.0 to 0.57.1 and the harness host from 0.35.0 to 0.35.1 for the diagnostic module and regenerated hook bundle; the console pin and lockfile follow. No dependency is added.

### Derived from the diff

The machine-classified notices follow the reviewed upgrade notes: this is a source-only release, with no package, binary, container or hosted artifact published. Component version metadata changed, so inspect the manifest's separate version axes. The locked dependency graph changed; the release manifest records the reviewer's `npm test` evidence for this code identity.

## Substantive changes

`packages/skeleton/src/gate-evidence.mjs` exports `readSharedRefs(root)`. One non-throwing helper makes four Git reads: `rev-parse --verify --quiet` on the `^{commit}` peel of `refs/remotes/origin/main` and `refs/heads/main`, plus `for-each-ref` for `refs/tags/v*` and `refs/dotln/`. Exit 0 keeps the branch commit, exit 1 records `absent`, and any other exit or launch failure records `unreadable`. Tags are ordered by tagger date with full name breaking ties; lightweight tags are excluded. A failed enumeration marks its fields `unreadable` and discards partial output. The strict `git()` helper for tree and code identity is unchanged.

`scripts/test-runner.mjs` takes its first snapshot before preflight and its second inside the row literal after the last task, then records `sharedRefs: { start, end }`. Exported `completeSharedRefs` requires string branch fields, a tags object with a safe-integer or `unreadable` count and string newest, and a safe-integer or `unreadable` ref count. Exported `sharedRefChanges` compares complete snapshots field by field, names transitions to or from `absent`, and suppresses only unreadable fields. When tag count rises and newest changes, it prints `tags +NEWEST (count a..b, newest x..y)`. On failure, a guarded lookup selects the latest earlier row for that check; unreadable or malformed history supplies no baseline. One line joins since-previous and during-run changes before the new row records.

`scripts/test-runner.test.mjs` adds seventeen cases: a bare origin and linked `wo-900` worktree for the sibling merge; a forced-failure line; changes during failure and a return to the earlier value; legacy, incomplete and malformed snapshots; a damaged archive and an unselectable archived timestamp; 21 malformed validator shapes; unreadable tags before and during passing and failing linked-worktree gates; `origin/main` created between failures; and direct Git classification of missing, dangling, non-commit and unreadable refs.

## Progressive polish

Product 07 gains the rule in three sentences. Authority, artifact-identity and verification evidence are re-minted at `docs/evidence/WO-198/*/004`, retaining revisions 001 to 003 and carrying WO-073's feedback edition. The harness bundle and manifest are regenerated for skeleton 0.35.1; the software-engineer publication source lock is refreshed, and the README's release claim becomes v0.73.1.

## Evidence and compatibility

The order was integrated with `main` at `bb84ae82`, also its base, and integration changed no judged byte ([D020](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d020)). Application `v0.73.1` replaces `v0.73.0`, Skeleton 0.57.1 replaces 0.57.0, and the harness host 0.35.1 replaces 0.35.0; no other component changes and no dependency is added. `sharedRefs` is additive diagnostic metadata, and every existing gate-row reader passes in the review gate.

- [VER-001](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-001.md) failed because a malformed earlier snapshot crashed a failed gate before it recorded; it also boarded the snapshot-less harness host row.
- [VER-002](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-002.md) confirmed that repair and failed on a damaged archive that prevented a failed row from recording.
- [VER-003](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-003.md) confirmed that repair and failed on a shared ref Git could not enumerate: the snapshot threw where `main` passed.
- [VER-004](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-004.md) confirmed that repair across a 72-gate damage matrix and failed criterion 2 because branch creation and removal were never named.
- [VER-005](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-005.md) passed twelve branch-transition scenarios, the damage matrix against `HEAD` and nine Git ref states, with no new defect.
- [FINAL-001](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/final-reviews/WO-198/FINAL-001.md) passed at the integrated tree: all 17 new cases fresh under the bounded runner in 13.16 s; the reader equal to direct Git on the real corpus; the affected checks; `npm run test:docs` at 32 of 32 in 122.59 s; and `npm test -- --review` composed at unchanged identity `a5923da7…` from the executor's fresh row of 90 tasks in 1,731.7 s.

The harness host-row gap still hides the next since-previous delta. The `runner-fixtures` fresh duration, 126.5 s, exceeds the planning receipt's reopening threshold; the growth predates this order and the new cases cost about 13 s in isolation ([D021](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning), FUP-8bac5e3bddd12494). Coverage is one macOS host with Git 2.55.0 and Node 26; no live sibling merge into this repository's `main` ran during a gate. See the [final review](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/final-reviews/WO-198/FINAL-001.md), [decisions](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/decisions.md) and [handoff](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/evidence/WO-198/handoff.md) for the full record.

### Machine-derived release evidence

The source is `v0.73.1` at `c676909066d278c92cacd94d998a42a8fb5d4a9a`; the previous release is `v0.73.0` and the application version is `v0.73.1`. The root workspace is unversioned. Component versions are `@dotln/beacons` 0.1.1, `@dotln/browser-evidence` 0.1.0, `@dotln/compiler` 0.26.0, `@dotln/console` 0.4.2, `@dotln/kernel` 0.6.0 and `@dotln/skeleton` 0.57.1.

Schema ranges are `eventEnvelope` 1 and `controlLog` 1; `ir`, `artifactConfiguration` and `transformationSet` have none. Evaluable cadence kinds are `Once`, `After`, `Every`, `Gate`, `Until` and `Backoff`; deferred kinds are `Burst`, `Calendar`, `Window`, `While`, `Sequence`, `Merge`, `Race` and `Repeat`.

The release evidence records `npm test` exit 0 with its output SHA-256, code identity, reviewed tree and merge tree. The [final review](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/final-reviews/WO-198/FINAL-001.md) carries the test evidence. The lineage includes the [first](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-001.md), [second](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-002.md), [third](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-003.md), [fourth](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-004.md) and [fifth verification](https://github.com/DylanBWood/DotLn/blob/c676909066d278c92cacd94d998a42a8fb5d4a9a/docs/verifications/WO-198/VER-005.md), that final review, `docs/final-reviews/WO-198/PR.md` and `docs/final-reviews/WO-198/RELEASE-NOTES.md`. The release changes 109 files; the canonical manifest embedded in the annotated tag contains the complete list. Distribution is source-only.
