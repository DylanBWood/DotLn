# WO-086 evidence

The initial implementation observations below retain their original cutoff.
The repairs are recorded in the dated sections below.

Executor: `resume: next` on 2026-09-29, Claude Code 2.1.284, model
`claude-opus-5-5`, selected effort `max` read from `CLAUDE_EFFORT` (the order
recommends `xhigh` for the executor). Base: `main` at `3a68c517`, the commit
`v0.55.0` names. Target: application `v0.55.1`, assigned by
`npm run release -- prepare --local` ([WO-086-D001](decisions.md)). The
operator answered two questions during the dispatch; both answers are recorded
with their words ([D004](decisions.md), [D005](decisions.md)).

## What changed

| Item | Change | Decision | Fixture |
| --- | --- | --- | --- |
| Release history | `npm run release -- list --markdown` prints, and `--markdown --write` rewrites, the roadmap's generated table: one row per local annotated DotLn tag, joined to the orders its manifest names through the work-order index's reader, with the snapshot of the tags it records | D006 | `scripts/test-docs-check.mjs`: the table equals `release list` over four tags, one heading without a version, a manifest-free v0.2.0 |
| The table's check | The docs check holds the registered block to its recorded tags: a changed row or a hand-written receipt inside it refuses at its line, a recorded tag the checkout lacks or holds changed is named, a newer tag is reported | D006 | same file |
| Exemption | The Release boundary heading exempts nothing; the one registered block (`06-roadmap.md`, `dotln-release-history`) is exempt only as one ordered pair of top-level marker lines | D006 | unregistered pair; demoted, quoted and hidden terminating heading; malformed markers; BOM; a heading naming the marker |
| Collision record | `release prepare` changes the heading and README claim and records a collision once: in the integration decision while `worktree integrate` still has to write it, otherwise as its own decision; the stub waits for a failed preparation; `--integration` needs a pending integration; a conflicted record refuses with the path in every mode; a created record stays inside the repository; the meter is read before any edit | D007 | `scripts/test-release-preparation.mjs` (12), `scripts/test-worktree-integration.mjs`, `scripts/test-release.sh` case `prepare_independent` |
| Activation | `release prepare` assigns a missing target and records the base (operator answer) | D005 | same files |
| Notes | 66,037 bytes in six ranges moved byte for byte to [the release-history notes](../../planning/release-history-notes.md) | D008, D011 | SHA-256 per range, each found once |
| Standing policy and ceiling | The policy stays in 06 and counts; 06's ceiling is restated (operator answer; criterion 4 amended and bound by `plan amend-order`) | D004, D011 | docs check |
| Write-backs | Products 07 and 10, `docs/README.md`, the ceilings policy, the publication index and locks, the baseline | D009 | `npm run test:docs` |

## Measurements

| Surface | Before (base) | After |
| --- | --- | --- |
| 06 counted bytes | 90,074 (72,105 exempt by the heading) | 96,395 (31,279 exempt: the registered block) |
| 06 ceiling | 91,876 | 98,323 = ceil(96,395 × 1.02) |
| 06 lines | 2,340 | 1,612 |
| 07 counted bytes | 154,821 | 154,878 (ceiling 157,212) |
| 10 counted bytes | 25,603 | 25,744 (ceiling 25,825) |
| Table | none | 114 tags, about 50 ms to render or check |

## Gates at the subject

- `npm test -- --review`: 39 passed, 0 failed, 576.81 s, 83 fresh tasks, recorded 2026-09-29T18:20:12.827Z, code identity `72f5c2f8f239a02109af84626795d099195c14c7d4f3e9741a470444364ea2da`, `host-gate:72f5c2f8…:npm test`. The selection widened by eight machinery suites (evidence-sources, authority-evidence, harness-fixtures, harness, harness-evidence, artifact-evidence, verification-evidence, feedback-evidence) because WO-117 merged to main at `4d7c3319` during this dispatch and the review selection diffs against origin/main. Earlier rows at this code identity: `--again` after the review's fixes (31 passed, 327.71 s) and, before them at `c54c3e97…`, 31 passed in 325.71 s.
- `npm run test:docs`: 23 passed, 0 failed, 14.49 s (recorded 2026-09-29T18:03:19.885Z); it runs again inline at completion.
- Targeted runs: `node --test scripts/test-release-preparation.mjs` 12 of 12; `node --test scripts/test-docs-check.mjs` 29 of 29; `bash scripts/test-release.sh --case prepare_independent` passed; the integration fixtures named in D007 passed.
- `git diff --check` clean; `npm run publication:check` passes; `npm run plan -- check` passes with the amendment bound; `package.json` and `package-lock.json` unchanged.

## Independent review

An eight-agent read-only review (four dimensions, each finding put to an
adversarial verifier) ran during this dispatch against the pre-fix subject.
It confirmed two blocking findings: a retime landing on a continuation after a
failed preparation was recorded nowhere, and WO-011's activation completion
stayed in 06 because notes were selected by label. It also confirmed minor
ones: an unguarded `--integration`, a current target reading a conflicted
record, a created record not checked for containment, marker text in a heading
breaking the block, v0.2.0's components, a second read of every tag, an
unstaged new module, and four inaccurate decision sentences. Each is fixed or
corrected, with its fixture or its decision (D007, D011). Three findings were
refuted by their verifier. The sibling-lane transition and two document gaps
are boarded as FUP-b86a71ffd5b1e334, FUP-439252e49f6381fc and
FUP-2855ce1f2ac2005a (D012, D010, D013).

## Process cost

Entry: 99,742 total tokens. Handoff: 96,431,956 total tokens (inputTokens 392, cachedInputTokens 95,317,440, cacheWriteInputTokens 749,460, outputTokens 364,664; reasoning tokens and cost unavailable). Source `claude-transcript-message-usage`, scope dispatch, observed 2026-09-29T18:20:54.052Z. Subagents: 13 of the cap of 20, exact-observed (a five-reader map and an eight-agent review). Cached input dominates the total; the two workflows' 3.4 million subagent tokens are reported by the workflow tool, not by this counter. Waiting: three review gates (325.71 s, 327.71 s and 576.81 s) and two document gates of about 14.5 s.

## Observations and limits

- The order says `release prepare` writes the target "into the activation
  event (as today)". No activation event has ever carried a target, and adding
  one changes the event schema this patch excludes ([D005](decisions.md)).
- The table is regenerated by `npm run release -- list --markdown --write`,
  and nothing runs it on a schedule. The docs check reports a newer tag and
  never fails a sibling's gate on it ([D006](decisions.md)).
- WO-117 and WO-172 wrote roadmap notes under the old duty. Whichever lane
  lands second resolves 06 as D012 records.
- The economy experiment was named after the first code edits of this
  dispatch, not before them ([D002](decisions.md)).

## Integrated repair — 2026-09-29

Executor: Codex CLI 0.159.0, model `gpt-6.1-sol`, selected effort `ultra`
(normalized `xhigh`, mode `subagents`), source `codex-session-readback`.
The operator authorized `scope expand: merge main in` ([D016](decisions.md#wo-086-d016--operator-scope-integrate-main-during-repair));
the order amendment is bound in the planning log and `npm run plan -- check`
passed.

Canonical integration fast-forwarded original base `3a68c517` to fetched main
`4d7c3319`. Checkpoint `refs/dotln/checkpoint/WO-086/6` and the named stash are
retained. The sole authored conflict was product 06: main's WO-117 release
paragraph moved byte for byte into the archive, keeping its 741-byte hash
([D017](decisions.md#wo-086-d017--preserve-the-incoming-wo-117-release-note)).
The six original ranges also retain their exact hashes: seven ranges, 66,778
bytes total. Main's authored README text remains. The table now records 115
tags, including v0.56.0; counted 06 bytes stay 96,395, while the exempt block
is 31,537 bytes. Ceiling 98,323 stays unchanged. The integration decision
records v0.55.1 → v0.56.1 above baseline v0.56.0; no component changes were
required against that published baseline.

[VER-001 F1](../../verifications/WO-086/VER-001.md#f1--collision-provenance-is-lost-after-an-ancillary-output-fails)
is repaired by finishing ancillary meter/PR filesystem outputs before applying
the target edits ([D019](decisions.md#wo-086-d019--preserve-collision-inputs-through-ancillary-output-failures)).
A failure preserves the original collision inputs; continuation records their
complete outcome once. Core writes retain their existing rollback and the
printed changed-file order stays the same. The regression fixtures block the
PR parent with a regular file (EEXIST) and the PR file with a nonempty directory
(EISDIR). Both assert unchanged heading/README bytes and no decision on failure,
then exactly one original/replacement/baseline record on continuation. The
focused run passed 2/2 in 30.04 s. The initial empty-directory fixture vanished
during stash preservation and was corrected before the passing run. This
repair makes no process-crash or stdout-delivery guarantee.

Current evidence ([D020](decisions.md#wo-086-d020--integrated-repair-evidence-and-carried-forward-claims)):
`npm test -- --review` passed 31 suites, zero failures, 324.054 s, 75 fresh
tasks, at code identity `eb3e0a372c8dc0e5cbe2aa802545d982552552c3cad55bc7f1bee89adb832c44`,
recorded 2026-09-29T18:51:45.607Z. The selection is against integrated main;
the eight incoming sibling machinery suites no longer widen it to 39.
`npm run test:docs` passed 23 checks in 15.126 s at the same identity,
recorded 2026-09-29T18:45:58.318Z; completion checks the final document bytes
again. Publication locks, harness projections, local release surfaces and
`git diff --check` pass. The package manifests and lockfile equal integrated
HEAD. VER-001 is byte-identical to the integration checkpoint and stays an
immutable failed judgment of its original subject. Fresh independent
verification owns the next verdict.

One read-only agent reviewed diagnosis and final changes in two turns, with
no descendants; the root remained the sole writer. Explicit count: 1 of 20;
the harness observed zero admissions, so descendant coverage stays unknown.
Entry usage was 34,384 total tokens from `codex-transcript-counter`, scope
repair dispatch, cutoff 2026-09-29T18:41:02.667Z; dollar cost was unavailable.
Final usage stays in ignored receipts and the handoff response. No second
economy experiment was started: D002's existing experiment remains the one
for this order. The adjacent queue remains empty.

## Stub recovery repair — 2026-09-29

`resume: fix` repairs [VER-002 F2](../../verifications/WO-086/VER-002.md#f2--a-failed-integration-stub-after-a-successful-retime-loses-collision-provenance)
on the existing integrated base `4d7c3319`, application target `v0.56.1`.
Actor: Codex CLI 0.159.0, `gpt-6.1-sol`, selected effort `ultra`
(normalized `xhigh`, mode `subagents`), source `codex-session-readback`.
[D022](decisions.md#wo-086-d022--file-the-saved-preparation-outcome-before-preparing-again)
records the bounded sequence repair; [D023](decisions.md#wo-086-d023--f2-repair-evidence-and-handoff)
records its evidence and the correction to the earlier criterion 3 claim.

When the receipt has a successful preparation outcome and no integration
decision, continuation files that saved outcome first. A blocked stub withholds
further preparation, keeping the original transition and baseline. Once the
stub succeeds, ordinary preparation records any newer collision separately.
This uses the existing receipt and checkpoint marker; F1's output ordering,
core rollback, classification and product prose remain as before.

The three new regressions failed on the previous implementation in 43.625 s.
The [focused transcript](stub-recovery-fixtures.txt) records 8/8 passing WO-086
cases in 107.195 s before the final diagnostic extension. The final symlink
case also makes preparation fail with EISDIR after the saved stub is filed,
then verifies complete evidence, accurate pending messages and recovery without
a duplicate. The repeated blocked retry admits a newer colliding tag only
after the original record is filed: one integration decision for
v9000.0.1 → v9000.0.2 above baseline v9000.0.1, then one preparation decision
for v9000.0.2 → v9000.0.3 above baseline v9000.0.2.

The [final review-gate transcript](stub-recovery-review-gate.txt) covers those
final source and fixture bytes: 31 suites passed, zero failed, 359.026 s,
75 fresh tasks, recorded 2026-09-29T19:19:52.302Z at code identity
`db26626332e4b7b6264a3a87c2851db3fdd416aad073bb73a041b26d42471e52`.
The complete integration suite passed in 257.121 s. Fresh `npm run test:docs`
passed 23 checks in 14.932 s at the same identity, recorded
2026-09-29T19:21:09.403Z; completion checks final document bytes inline.
The preparation suite passed 12/12 in 1.639 s. Publication, planning,
harness projections and `git diff HEAD --check` pass.

All five criteria are judged on the current [handoff](handoff.md). The 115-row
table equals `release list --markdown`, with no missing/changed recorded tag or
newer tag report. All seven archived ranges still match D008/D017: 66,778
bytes, each occurring once in the archive and zero times in current 06.
Counted 06 bytes, its exemption and ceiling remain 96,395, 31,537 and 98,323.
Both failed verification reports equal checkpoint 9 byte for byte. Existing
integration recovery refs and stash are retained; final review still owns its
carried-forward assessment. Package manifests and lockfile equal integrated
HEAD. No process-interruption or partial-write guarantee is added.

One read-only agent was reused for three review turns without descendants;
the root remained the sole writer. Explicit count: one of cap 20. D002 remains
the order's one economy experiment. Entry usage: 45,618 tokens from
`codex-transcript-counter`, scope dispatch, cutoff 2026-09-29T19:06:08.822Z;
dollar cost unavailable. Final counters stay in ignored receipts and the
handoff response. The adjacent queue remains empty; D021's repair allocation
continues through fresh independent verification as FUP-221c4db9233b3476.
