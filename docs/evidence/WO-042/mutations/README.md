# WO-042 mutation reproduction: historical record

Marked historical on 2026-09-27 by WO-163
([WO-163-D008](../../WO-163/decisions.md#wo-163-d008--the-wo-042-mutation-reproduction-is-kept-as-a-historical-record)),
which closes
[WO-142-D008](../../WO-142/decisions.md#wo-142-d008--board-up-the-retained-wo-042-mutation-tools-broken-check).
This note is the only file added here. [`reproduce.log`](reproduce.log) and
[`summary.json`](summary.json) keep the bytes WO-042 committed on 2026-09-09.

## What the record is

One observation of fixture snapshot `8590be3c`, taken at Node v22.2.0 and
TypeScript 5.4.5: two green baselines of 328 package tests, and two mutants
each killed by one named test. The snapshot is a temporary fixture commit, not
a commit on any branch.

## Why it is no longer reproduced

- `--check` compared 178 recorded files with the current tree: every package
  file, the lockfile, the mutation instrument and the tool itself. It failed at
  the first later edit to any of them, on 2026-09-10. On 2026-09-27 the same
  selection held 330 files, 57 of them unchanged.
- `--write` could not rerun the observation. The instrument's campaign names
  `packages/skeleton/src/beacon-v3-fs.mjs`, which moved to `packages/beacons` on
  2026-09-25. A rerun would also replace this closed order's record.
- A regenerated record would pass only until the next edit to any of those
  files, and no gate runs the check.

## Separately observed package coverage

WO-163 VER-001 on 2026-09-28 found the two killing tests named in
`summary.json` active in the package suite, in
[`authority.test.ts`](../../../../packages/compiler/test/authority.test.ts),
and observed them pass in `npm test -- --review`. That dated observation is
separate from the historical tool's lexical check.

## What the tool does now

`node scripts/authority-mutation-evidence.mjs --check` verifies the record
against itself: the transcript hash, both baselines and both kills. It then
checks that each recorded killing-test title occurs in package test source,
and fails if a title is absent. A title in a comment also satisfies this
lexical check; it does not establish active test coverage. Last it reports how
far the executable subject has moved. An exit of 0 establishes the record's
internal consistency and title presence, without rerunning WO-042's mutation
comparison. `--write` is retired; the last version that carried it
is at commit `7315f7b9`. The reproduction commands in the
[order's evidence](../README.md) are the ones WO-042 ran and are kept as
written.
