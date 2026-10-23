# WO-227 execution evidence

## Baseline, 2026-10-22

Dispatch: `resume: next`. The selected order is WO-227 at base
`4dfb8052d670d0d9c363f9cf110cd9b8e73395fc` (`main` at activation; the
order's observed gap is dated at `926b8234`, five commits earlier, and every
cited line was re-read at this base). Harness Claude Code, model Fable 5.1,
selected effort `max` (`CLAUDE_EFFORT`); the order recommends `xhigh`.
Before any change, two probes ran under `node scripts/harness.mjs bounded --
node <probe>` from the session scratch directory, written as
`<tmp>/dotln/<session>/scratch/baseline/` below. No instance, intake or
employer data was read; the probes' launchpad root, vocabulary copy, local
list and target body are synthetic.

### The lint's three results on a fixture target body

`lint-probe.mjs` built a launchpad root holding a copy of
`docs/control/outward-vocabulary.json` and a one-term synthetic local list,
then linted this composed body (reviewed prose, a blank line, the generated
Change table as `targetChangeSection` renders it):

```markdown
# Result

Preserve reviewed behavior in the board fixture.

## Change

| Path | Added | Removed |
| --- | ---: | ---: |
| fixtures/launchpad-board-2026-10-21.json | 12 | 0 |
| docs/WO-006-notes.md | 3 | 0 |
| src/mask.ts | 1 | 1 |

3 files changed from base aaaa… to head bbbb….
```

Observed at the base:

- `checkOutwardArtifact` returned `status: refused` with two findings, both
  `vocabulary.launchpad`: `launchpad` at line 9 (the Change row naming
  `fixtures/launchpad-board-2026-10-21.json`) and `mask` at line 11 (the
  `src/mask.ts` row). `checks.launchpad` read `refused`; no finding carried
  a section or a path.
- `lintArtifacts` (the publish path) threw `target publish refused: outward
  lint: pr-body refused: vocabulary.launchpad (line 9), vocabulary.launchpad
  (line 11)`: the line numbers of generated rows, with nothing saying they
  are generated text. This is the shape the fork's WO-006 draft met as
  `vocabulary.launchpad (line 147)`.
- No rule judged a launchpad identifier: the body `Preserve
  docs/WO-006-notes.md and WO-006-D018, FUP-280abd447f789958, VER-001,
  FINAL-001, REVIEW-007, WS-001.` passed with no finding, and so did
  `Closes #4`.
- `validateOutwardVocabulary({ types: ["fix"], terms: [] })` threw `invalid
  outward vocabulary: require nonempty types and terms`; a file carrying
  `reviewTerms` instead of `terms` threw the same.
- `checkLocalTerms` on a present list holding only a comment threw
  `local-terms list is present but empty or malformed`; on the one-term list
  with no match it returned `{ "status": "present" }` and no count.

### The five merged bodies' meter positions

Read from the stored `docs/final-reviews/<order>/PR.md` of each merged pull
request; the order of each number comes from `git diff --name-only <merge>^1
<merge> -- docs/final-reviews`.

| Pull request | Order | Stored body lines | Meter block lines | First line |
| --- | --- | ---: | --- | --- |
| #223 | WO-221 | 32 | 11 to 32 (after the prose) | `# WO-221` |
| #225 | WO-222 | 30 | 3 to 24 (before the prose) | `# WO-222` |
| #227 | WO-218 | 32 | 3 to 24 (before the prose) | `# WO-218` |
| #230 | WO-223 | 32 | 3 to 24 (before the prose) | `# WO-223` |
| #231 | WO-217 | 34 | 3 to 24 (before the prose) | `# WO-217` |

WO-226's stored body (#233, merged after the order was filed) also carries
the block at lines 3 to 24. No stored body holds a product-gate block; the
publish step composes that block into the published body only.

### The target Release body of the fixture

`release-probe.mjs` reproduced the WO-221 release fixture's path
(`scripts/lib/target-worktree-fixture.mjs`: declared release policy,
`release.displayName` `Fixture Product`, the `release.close` grant, the
order header `**Target release classification:** minor` and an
`**Objective:**` paragraph, the records merge and the target merge) and ran
`release close WO-999 --publish`. It exited 0 in 6,961 ms and the fake forge
recorded:

- Release title `Fixture Product v0.1.0`.
- Release body, byte for byte: `WO-999 — target lifecycle fixture\n\nThe
  fixture's objective paragraph.\n\nClosed by WO-999; merged main at
  <merged commit>.\n`.
- Tag message: `Fixture Product v0.1.0\n\nWO-999 — target lifecycle
  fixture\n\nClosed by WO-999; merged main at <merged commit>.`.
- `publication.target` in the release-close record: `repositoryId`,
  `policy`, `outcome`, `tag`, `release`, `classification`, `latest`,
  `commit`, `origin`, `title` and `tagOutcome`; no body source and no body
  digest.

Neither the tag message nor the body passed through any outward lint at the
base (`scripts/release.mjs` calls none of `checkOutwardArtifact`,
`checkLocalTerms`, `privatePathLines` or `hasAiAttribution` on them).

## Validation, 2026-10-22

- `npm test -- --review`: pass at code identity
  `0de461f667890881a92d28c0267a7afd507efc346e3b844d2f75613036f318f9`,
  recorded `2026-10-22T16:40:11.292Z`, duration 1482679 ms, 40 required
  suites, 106 fresh tasks, zero reused and zero unrun suites, identity
  unchanged through the run. Three earlier complete rows failed on fixtures
  that predated this order's checks; their repairs are recorded in
  [D015](decisions.md#wo-227-d015) and the focused reruns of the four
  repaired suites passed before the final run.
- Paired controls: 17 pairs in [controls.json](controls.json), every case
  passing with the rule in place and its control passing at the base with
  only that rule reverted.
- `npm run meta -- --check`: pass. `git diff --check`: clean. No change
  under `.claude/skills`, `package.json` or `package-lock.json`.
- `npm run test:docs`: run after this record's last edit; its passing
  current-tree row is consumed by `implementation-ready`.
- Review: [self-review.md](self-review.md) records the two
  `dotln-worker-fable` reviews (found 24; fixed 20; recorded 4).
- Host effort at handoff: `xhigh` (CLAUDE_EFFORT, selected, not effective),
  read after the operator reopened the session; the baseline's `max` was
  the selection at activation.
- Judgments, attestation and limits: [handoff.md](handoff.md).
