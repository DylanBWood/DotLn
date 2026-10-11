# WO-078 — VER-002 repair

The operator dispatched `resume: fix` for
[WO-078](../../work-orders/WO-078-sibling-registry.md), whose failure source is
[VER-002 F1](../../verifications/WO-078/VER-002.md#f1--blocking-the-checks-expected-version-still-comes-from-a-generated-file).
The repair validates captured tag names against this repository's Git before
using them as expected versions. An exact tag must point at its receipt
commit; a nearest tag must point at that commit or an ancestor. A refusal
names the configured observation file and writes neither generated output.

The earlier repair's claim that a separate generated file was independent
evidence was wrong. The verifier's probe, rerun before this repair, accepted
an invented tag after both generated files were edited. Git validation now
establishes the tag relationship instead of trusting agreement between those
files. [D012](decisions.md#wo-078-d012--repair-captured-versions-must-be-git-tags-at-or-below-the-receipt-commit)
records the evidence, correction, rejected choices and reopening conditions.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.1","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback","accountLabel":"not-applicable"}

## Reproduction and regressions

The same immutable verifier probe ran through
`node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-002-probe.mjs`
before and after the repair. It creates and removes its own synthetic
repository under the system temporary directory.

| Probe case | Before, 17:12:52 UTC | After, 17:15:53 UTC |
| --- | ---: | ---: |
| Baseline check | 0 | 0 |
| A: page-only invented version | 1 | 1 |
| B: observation-only invented version | 1 | 1 |
| C: coordinated page and observation invention | 0 | 1 |
| C': ordinary generation restores both files | yes | yes |
| D: coordinated null observation | 0 | 0 |
| E: untouched page after a later tag | 0, unchanged | 0, unchanged |
| F: coordinated substitution of a real tag at the commit | 0 | 0 |
| G: leftover receipt temporary | 1 | 1 |

Case C now emits no stdout and names `tag-observations.json`, the recorded
tag and its invalid relationship to the receipt commit. Its subject stays
forged after refusal; the declaration and receipt remain byte-identical.
`reproducedF1` changed from `true` to `false`. Cases D and F retain the
verifier's stated limits: an older null observation and a real tag at the
same commit can be valid historical observations.

`node scripts/harness.mjs bounded -- node --test scripts/test-siblings.mjs`
passed 15 tests with 0 failed at 17:15:40.699 UTC, taking 9,914 ms. The two
new cases cover the coordinated invention and the relationship class:
a real lightweight tag at a different receipt commit, a real future tag
used as nearest, an invented nearest tag, and a revision expression all
refuse without changing either generated output. Existing annotated-tag,
later-tag, page-only edit, malformed observation, relocated root and
generation-recovery checks still pass. Removing a captured tag now refuses
until ordinary generation refreshes the pair; the existing later-tag test
proves that behavior before testing a separate embedded-record corruption.

The passing fixture recorded generator wall-clock of 38 ms with no receipts
and 104 ms with two receipts; table sizes were 1,897 and 3,134 bytes. These
are local fixture measurements, not an estimate of removed operator work.
The removed manual manifest/build lookup remains one sibling-checkout read
per sibling per occasion, with wall-clock unmeasured as D003 records.

## Review and passing gates

No agent was launched for this repair. A separate correctness pass reviewed
the repaired source and regressions against all four criteria, including
validation before rendering, missing-commit coverage, refusal without writes,
and preservation of older genuine observations. A separate maintainability
pass reviewed the same source: validation stays in one private helper,
receipt shapes and commands are unchanged, and each commit's facts are
cached by the existing path. Each pass found 0 additional findings.
These are the executor's own passes, not independent worker judgments.

self-review: found 0; fixed 0; recorded 0 — separate-pass repair review.
The original implementation's two worker reports and dispositions remain
in [self-review.md](self-review.md). Independent verification remains its
own dispatch.

`npm run release -- prepare --local` retained application target v0.74.2
(patch); `package.json`, `package-lock.json` and component sources are
unchanged. No component version bump is required.

Both required gates passed at code identity
`08345dada9b32b66aea18810ab01be4c591fc200e234d231d6acc2e06c4f4faa`.

| Command | Recorded at (UTC) | Result | Duration |
| --- | --- | --- | ---: |
| `npm run test:docs` | 2026-10-11T17:21:21.037Z | 33 passed, 0 failed, 33 fresh tasks | 103,848 ms |
| `npm test -- --review` | 2026-10-11T17:45:57.365Z | 38 suites passed, 0 failed, 90 fresh tasks | 1,464,642 ms |

The canonical gate rows report `executed: true`, `exitCode: 0`,
`identityUnchanged: true` and `buildOutputUnchanged: true`. The review row
includes launchpad at 127,986 ms and siblings-fixtures at 12,731 ms.
The executor made no repository edits or agent launches during either gate;
the gates wrote their own build outputs and receipts. Both evidence waiters
exited on completion and no repair-started background task remains.

The added check performs at most two Git tag-list reads per known receipt
commit with non-null observations, cached through the existing commit facts.
That work closes the invented-version class while retaining older genuine
observations. No end-to-end performance saving is claimed: these gates judge
the repaired behavior, and the earlier passing gate did not close this class.

FUP-1e8ba454d811954f is settled through the follow-up helper with D012 and
these regression observations. The adjacent queue is empty at revision 0.
The repository scan found no nested repository outside intake, dependency
and build directories; the fixture repositories were removed by their suites.
Goal alignment matched the requested repair. No criterion was changed or
waived. The [handoff](handoff.md) judges each original criterion; independent
re-verification and final review remain separate dispatches.
