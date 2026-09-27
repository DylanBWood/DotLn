# WO-171 implementation evidence

Recorded 2026-09-27 for `resume: next` by the executor session (Claude Code,
`claude-opus-5-5`, effort xhigh). This is the executor's result, ready for
independent verification; it is not a verification verdict or a final review.
The repair of [VER-001](../../verifications/WO-171/VER-001.md) F1 was recorded
the same day for `resume: fix` by a second Claude Code session (`claude-opus-5-5`,
effort xhigh); see [Repair](#repair-ver-001-f1).
Local paths are written as `<worktree>`, `<main checkout>`, `<system-temp>` and
`<session-scratch>`.

## Delivered

`scripts/lib/harness-prune.mjs` plans once per apply. The retention rules keep
their text, their order and their failure modes. Each now lives in a judgment
for one candidate, which the plan enumerates and the pre-delete check calls
again for that candidate alone
([D002](decisions.md#wo-171-d002--one-plan-and-a-pre-delete-check-that-re-judges-only-its-candidate)).
Publication is one `gh release list` and one `git ls-remote --refs --tags
origin` per plan, joined to the local release records
([D003](decisions.md#wo-171-d003--publication-is-one-release-listing-and-one-tag-listing-joined-per-order)).
A lane holding a usage copy stays retained until the order's committed
`meta.json` names that copy's SHA-256
([D004](decisions.md#wo-171-d004--a-lane-holding-a-usage-copy-waits-for-a-committed-snapshot-that-carries-it)).
Bound resident stores already follow their lane
([D005](decisions.md#wo-171-d005--a-bound-resident-store-follows-its-lane-with-no-code-change)).
Byte proofs are now published whole by a link, so a stopped apply never leaves
a partial proof that blocks the next one
([D007](decisions.md#wo-171-d007--what-a-stopped-apply-resumes-from-one-repair-and-what-stays-boarded)).

| Criterion | Evidence |
| --- | --- |
| 1 | `WO-171 one apply plans once and asks each order's publication at most once`: four lanes and two stashes are removed. A preload counts the plan's listing of the retained directory (1), and the injectable is asked once per order, an unpublished lane included. It fails against the `4c34b332` module (7 plans, 34 asks) and against a mutant that re-plans per candidate with a shared publication observation (`actual: 7, expected: 1`) |
| 2 | `WO-171 one apply issues one release listing and one tag listing whatever the number of orders`: nine orders, then three; fake `gh` (honouring `--limit`, default 30, thirty newer unrelated Releases first) and fake remote. Each invocation issues exactly `gh release list` and `git ls-remote --refs --tags origin`. The `4c34b332` preview issued 8 `gh release view` and 8 `git ls-remote` calls; a mutant without `--limit` also fails |
| 3 | `WO-171 an apply stopped after two deletions resumes and keeps the first byte proofs`: a real SIGTERM after the second lane; the next apply removes two lanes and two stashes; the first two proofs are byte-identical. `WO-171 a stop before a byte proof is published leaves nothing a rerun refuses` pins the proof repair |
| 4 | `WO-171 a candidate changed between the plan and its deletion is refused whole`: a lane changed after the plan is refused with `Prune subject changed; retained docs/control/local/retained/WO-902`; its bytes are intact and no proof is written for it |
| 5 | `WO-171 a lane holding a usage copy is retained until a committed snapshot carries it`: no snapshot, a whole-meter snapshot, a committed link and an uncommitted snapshot all retain; a committed snapshot naming the copy's SHA-256 releases. It fails against `4c34b332` and against a mutant that releases on any committed blob. `WO-171 a collision-preserved usage copy keeps its lane until the snapshot names it` (repair, [D013](decisions.md#wo-171-d013--usage-retention-follows-preservations-collision-names)): copies that worktree preservation named `.from-WO-NNN` or `.from-WO-NNN-<n>` on the file or its `process` directory stay retained until the snapshot names every digest. It fails against the module VER-001 judged |
| 6 | `WO-171 a bound resident store follows its retained lane into the byte proof` |
| 7 | [D006](decisions.md#wo-171-d006--the-listing-on-the-operators-host-before-and-after): 68,229 ms before and 16,400 ms after on the operator's main checkout, both read-only; no apply was run |
| 8 | Product 07 §Candidate — local lane retention, edited in place (+151 bytes); decisions D001 to D013; the two provenance rows stay allocated for the close ([D009](decisions.md#wo-171-d009--register-rows-allocated-to-this-order)) |
| 9 | Gate results below |

## Counted observations

| Observation | `4c34b332` module | This order |
| --- | --- | --- |
| Plans in one apply of four lanes and two stashes | 7 | 1 |
| Publication asks in that apply, an unpublished lane included | 34 | 7, one per order |
| `gh` calls, preview of nine orders | 8 `release view` | 1 `release list` |
| `git ls-remote` calls, preview of nine orders | 8 | 1 |
| Listing on the operator's main checkout | 68,229 ms, 199 candidates | 16,400 ms, 126 candidates |
| Orders whose release the new join agrees with | — | 89 of 89 |

The listing now keeps 73 lanes (45,647,143 bytes) for their usage copies. That
includes WO-043, whose committed whole-meter snapshot of 2026-09-11 holds 8 of
the lane's 50 usage rows. The other 41 retentions have the same reasons as
before. The stash inventory takes about 14.8 s of the 16.4 s
([D001](decisions.md#wo-171-d001--economy-experiment-where-the-new-listing-spends-its-time)).

## Review before handoff

Three read-only reviewers, one lens each, returned nine findings naming seven
distinct issues
([D010](decisions.md#wo-171-d010--independent-review-of-the-change-and-its-dispositions)).
Five were fixed, each with a fixture that fails without the fix. One is
recorded as decided (the release is observed once per apply) and one is
boarded below. The blocking one: my first usage rule released a lane when any
`meta.json` blob existed at HEAD, which would have removed WO-043's lane and 42
rows found nowhere else. My first context also read the global observations
lazily, so a malformed gate marker or writer-event log no longer stopped the
plan.

## Fixture transcripts

This order's module, `node --test --test-name-pattern "WO-171|WO-142 D1|WO-142 repair D1|WO-160" scripts/test-harness.mjs`:

```text
✔ WO-142 D1 prune previews without writes, preserves live files and keeps deleted-lane byte proofs (220.763333ms)
✔ WO-142 D1 target receipts and stopped live or unknown readers retain their files (346.627166ms)
✔ WO-142 D1 malformed installed manifests never establish absent snapshot ownership (209.518541ms)
✔ WO-142 D1 publication proof binds the origin repository despite ambient GH targets (958.266625ms)
✔ WO-142 D1 snapshot package links are inventoried without traversal while unsafe links and lanes stay retained (63.049958ms)
✔ WO-142 repair D1 Claude current session survives a stale finished owner (80.766209ms)
✔ WO-160 prune removes a sole published stash with recovery bytes and permits the next stash (210.626875ms)
✔ WO-160 prune inventories only published integration stashes and resolves shifted selectors (689.151417ms)
✔ WO-160 prune removes packed stash refs without resurrecting entries (428.828375ms)
✔ WO-160 prune rewrites an expired reflog prefix like Git stash drop (189.775667ms)
✔ WO-160 non-top prune retains stashes during concurrent pack-refs pruning (7788.288916ms)
✔ WO-171 one apply plans once and asks each order's publication at most once (348.318958ms)
✔ WO-171 one apply issues one release listing and one tag listing whatever the number of orders (2714.421708ms)
✔ WO-171 an apply stopped after two deletions resumes and keeps the first byte proofs (402.748291ms)
✔ WO-171 a candidate changed between the plan and its deletion is refused whole (222.149334ms)
✔ WO-171 a lane holding a usage copy is retained until a committed snapshot carries it (353.605042ms)
✔ WO-171 a bound resident store follows its retained lane into the byte proof (45.581542ms)
✔ WO-171 an unreadable global observation still stops the plan (57.883875ms)
✔ WO-171 a stop before a byte proof is published leaves nothing a rerun refuses (387.107666ms)
ℹ tests 19
ℹ pass 19
ℹ fail 0
```

The eight WO-171 fixtures against the `4c34b332` module, this order's first
version (saved before the review) and three mutants of the final module. Each ran in a scratch tree under `<session-scratch>` that
holds the module under test beside links to this worktree's other files; the
module is identical at `4c34b332` and at this order's base `894be584`:

| Fixture | `4c34b332` | first version | re-plan mutant | releases-on-blob mutant | no-`--limit` mutant |
| --- | --- | --- | --- | --- | --- |
| plans once | ✖ (7 plans, 34 asks) | ✔ | ✖ (7 plans) | ✔ | not run |
| one listing of each | ✖ (`view`) | ✔ | ✔ | ✔ | ✖ |
| stopped after two deletions | ✔ | ✔ | ✔ | ✔ | not run |
| changed candidate refused | ✔ | ✔ | ✔ | ✔ | not run |
| usage copy carried | ✖ | ✖ | ✔ | ✖ | not run |
| resident store | ✔ | ✔ | ✔ | ✔ | not run |
| unreadable global stops | ✔ | ✖ | ✔ | ✔ | not run |
| stop before proof published | ✖ (no stop reached) | ✖ | ✔ | ✔ | not run |

Criteria 3, 4 and 6, and the unreadable-global case, describe behaviour the old
module already had. The order does not require them to fail against it; they
pin that the new structure keeps it.

## Repair (VER-001 F1)

VER-001 found that the usage guard matched only `process/usage.jsonl`.
Worktree preservation, however, names a colliding file or directory
`<name>.from-WO-NNN[-n]`. The guard now accepts that suffix on either
component, any number of times; D004's digest rule is unchanged
([D013](decisions.md#wo-171-d013--usage-retention-follows-preservations-collision-names)).
The new fixture gets its names from the real `reconcileWorktreeMaterial`
call: `process/usage.jsonl.from-WO-921`, `process/usage.jsonl.from-WO-921-2`,
`process.from-WO-922/usage.jsonl` and `process.from-WO-923-2/usage.jsonl`.
`scripts/test-runner.mjs` now declares `scripts/lib/intake-reconciliation.mjs`
as a `harness-fixtures` source.

Against the module VER-001 judged, the fixture fails at its first listing.
WO-922 and WO-923, whose only usage copies carry a suffix, are candidates with
no snapshot at all, which is broader than VER-001's reproduction. On the
repaired module, `node --test --test-name-pattern "WO-171" scripts/test-harness.mjs`
gives the result below. It was run before Prettier reformatted the fixture;
the repair's review gate then ran `harness-fixtures` on the formatted source:

```text
✔ WO-171 one apply plans once and asks each order's publication at most once (357.537167ms)
✔ WO-171 one apply issues one release listing and one tag listing whatever the number of orders (2865.918292ms)
✔ WO-171 an apply stopped after two deletions resumes and keeps the first byte proofs (421.04625ms)
✔ WO-171 a candidate changed between the plan and its deletion is refused whole (219.955667ms)
✔ WO-171 a lane holding a usage copy is retained until a committed snapshot carries it (341.493333ms)
✔ WO-171 a collision-preserved usage copy keeps its lane until the snapshot names it (476.182083ms)
✔ WO-171 a bound resident store follows its retained lane into the byte proof (47.584208ms)
✔ WO-171 an unreadable global observation still stops the plan (61.006916ms)
✔ WO-171 a stop before a byte proof is published leaves nothing a rerun refuses (400.115375ms)
ℹ tests 9
ℹ pass 9
ℹ fail 0
```

A read-only `find` over the main checkout's retained lanes during the repair
found 75 canonical usage copies and none with a suffix, so the repair retains
no additional lane there today. No apply was run.

## Boarded, not fixed

| Follow-up | Decision | Subject | Proposed disposition |
| --- | --- | --- | --- |
| FUP-dc6c139003bd4b89 | [D004](decisions.md#wo-171-d004--a-lane-holding-a-usage-copy-waits-for-a-committed-snapshot-that-carries-it) | WO-170's per-order snapshot must name the SHA-256 of each usage copy it carries, written after the order's last usage row, or the prune keeps the lane | allocate to WO-170 |
| FUP-e62c63344f52405f | [D007](decisions.md#wo-171-d007--what-a-stopped-apply-resumes-from-one-repair-and-what-stays-boarded) | A stash drop stopped while it holds its locks, after its recovery snapshot, or between its reflog and ref installs needs the operator (`scripts/lib/stash-drop.mjs`, outside this order's files) | deferred, D007's condition |

## Limits

- Publication is observed once per apply, so a Release withdrawn while an apply runs is not seen by that apply ([D002](decisions.md#wo-171-d002--one-plan-and-a-pre-delete-check-that-re-judges-only-its-candidate)).
- The release listing is capped at 10,000 Releases; an order whose Release falls outside it stays retained ([D003](decisions.md#wo-171-d003--publication-is-one-release-listing-and-one-tag-listing-joined-per-order)).
- Until WO-170 writes snapshots that name their usage copies, every lane holding one stays retained ([D004](decisions.md#wo-171-d004--a-lane-holding-a-usage-copy-waits-for-a-committed-snapshot-that-carries-it)).

## Gate

| Check | Implementation (`resume: next`) | Repair (`resume: fix`) |
| --- | --- | --- |
| `npm test -- --review` | 31 passed, 0 failed, 565.97 s, 75 fresh tasks; recorded 2026-09-27T17:13:19Z. `harness-fixtures`, the machinery suite that declares `scripts/lib/harness-prune.mjs`, passed in 248.39 s | 32 passed, 0 failed, 631.88 s, 76 fresh tasks; recorded 2026-09-27T18:04:15Z. `harness-fixtures` passed in 299.04 s |
| `npm run test:docs` | 23 passed, 0 failed | 23 passed, 0 failed: 32.58 s after formatting, and 33.22 s after these evidence edits. The first run failed only on the format check of the new fixture, and eight suites that need it were skipped; Prettier fixed the file before both passing gates |
| `npm run publication:check` | both editions current after their locks followed product 06 and 07 | no product document edited |
| `npm run release -- prepare --local` | `WO-171 target v0.52.6 remains current`; the PR body's process meter written | `WO-171 target v0.52.6 remains current`; the PR body rewritten |
| `git diff --check` | clean | clean |
| Dependencies | `package.json` and the lockfile unchanged | unchanged |

Each gate ran on the final source of its dispatch. The evidence files, the
decisions index and the work-order index were completed after it, as reports
may be.
