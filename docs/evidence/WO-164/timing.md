# WO-164 timing record and regression transcript

Operator's host, 2026-09-27: macOS (Darwin 24.6.0), 16 CPUs, Node v26.9.0,
Git 2.55.0. Load averages ranged from 4 to 11 across the runs. The activation
tree is `894be584` plus the dispatch's control files, with 113 order ids in the
control log and 104 local annotated DotLn release tags. Absolute host paths are
written as `<worktree>` and `<scratch>`. The scratch scripts are not tracked:
`time-collect.mjs` times `collectSources` with the ER3-002 reproduction's
`execFileSync` patch, and `census.mjs` counts node processes through an
`--import` logger and Git spawns through a PATH shim.

## Before and after

| Measurement | Before | After, warm cache | After, cold cache |
| --- | --- | --- | --- |
| `collectSources` (ms) | 21,192; 21,173 | 662; 653; 645 | 6,261; 6,165 |
| its status processes (ms) | 113 forks: 14,709; 14,719 | 1 fold: 209–223 | 1 fold: 220; 226 |
| its `release list` (ms) | 6,093; 6,070 | 54–58 | 5,667; 5,565 |
| node processes per collection | 116 | 4 | 4 |
| Git spawns per collection | 1,457 | 12 | — |
| `console board --json` (ms, same tree) | 22,783 | 822 | 6,588 |
| `console-docs` in `test:docs` (s) | 22.50 | 1.58 | 8.21 |
| `npm run test:docs` (s) | 31.42 | 13.10 | 17.58 |

Before: `collectSources` on the activation tree; the Git census ran under the
counting shim (25,209 ms instrumented). The board's before figure is the
same-tree run of the original sources below; on the activation tree the board
took 21,300 and 21,180 ms. After: final sources. Cold means
`docs/control/local/cache/release-list.json` was removed first.

## Byte identity (criterion 1)

`<scratch>/swap-board.sh` puts the original versions of the six changed
sources (`git show HEAD:<path>`) in place, removes the new cache module,
builds, and renders `console board --json`. It then restores and byte-checks
every file, builds, removes the cache and renders twice more.

```text
same-base        22783 ms 43c2fe35edf94c55a84745c6b571e1541287745acc1e4c99190e3d3a8a138a02 6444755
restored
same-after-cold   6588 ms 43c2fe35edf94c55a84745c6b571e1541287745acc1e4c99190e3d3a8a138a02 6444755
same-after-warm    822 ms 43c2fe35edf94c55a84745c6b571e1541287745acc1e4c99190e3d3a8a138a02 6444755
```

`release list` on the real tree: the original script (from `git archive HEAD
scripts packages`, run with `DOTLN_LAUNCHPAD=<worktree>`), the new cold listing
and the new warm listing each print sha256
`273ea687117b3f0c586aa8b6a104b56fcd943cddfd485c17e8a5749bc299706a` (105 lines).
Under the Git shim they spawn 1,167, 962 and 3 Git processes; the warm three
are `for-each-ref`, `check-ignore` and `rev-parse`.

`resume status --all --json` on the real tree (`<scratch>/compare-status.mjs`):

```text
{"label":"claude-env","orders":113,"allBytes":2583929,"allMs":227,"eachMs":15461,"mismatched":[],"sorted":true,"session":true,"unchanged":true}
{"label":"no-session-env","orders":113,"allBytes":2564493,"allMs":234,"eachMs":15341,"mismatched":[],"sorted":true,"session":false,"unchanged":true}
```

## Spawn census

Before, the activation tree:

```text
nodeProcesses 116: resume.mjs status --json 113; resume.mjs usage --json 1; worktree.mjs constellation 1; release.mjs list 1
gitSpawns 1457: cat-file 508; ls-tree 287; rev-parse 146; diff 143; symbolic-ref 113; log 113; rev-list 104; for-each-ref 21; tag 20; worktree 1; diff-tree 1
```

After, final sources, warm cache:

```text
nodeProcesses 4: resume.mjs status --all 1; resume.mjs usage --json 1; worktree.mjs constellation 1; release.mjs list 1
gitSpawns 12: rev-parse 3; for-each-ref 2; cat-file 2; symbolic-ref 1; log 1; tag 1; worktree 1; check-ignore 1
```

## Regressions (criteria 3 and 4)

`node --test packages/console/dist/test/collect.test.js`, final sources:

```text
✔ WO-164 console collection spawns a constant number of processes and Git reads only new or moved tags (9085.8805ms)
ℹ node/Git spawns: cold 5 orders 4 tags 4/41; warm 4/8; four new tags 4/37; warm 9 orders 8 tags 4/8
```

`node scripts/test-control-segments.mjs <scratch>/csroot`, final sources:

```text
  ✔ WO-164 status --all --json returns every order's per-order object and appends nothing
ℹ pass 11
ℹ fail 0
```

Against the original sources (`<scratch>/against-original.sh`: the original
versions of the changed sources in place, the new tests kept, a build; then a
restore with a byte check of every file):

```text
console regression exit=1
  AssertionError [ERR_ASSERTION]: <fixture>/repo/scripts/resume.mjs status
    actual: 8,
    expected: 4,
control-segments exit=1
  ✖ WO-164 status --all --json returns every order's per-order object and appends nothing
  AssertionError [ERR_ASSERTION]: error: ambiguous work-order selection; open orders: WO-900, WO-901, WO-903; use --work-order WO-NNN
restored and verified
```

Mutation check of the final console regression. One line of new logic is
changed at a time, the built test is run, and the file is restored with a
byte check:

```text
previous-object guard: FAILS (detected) ... v0.1.4 ... WO-913,WO-914
history-view bypass: FAILS (detected) ... warm Git set
replace refs ignored: FAILS (detected) ... v0.1.6 ... WO-915,WO-916
ignore check: FAILS (detected) ... Expected values to be strictly equal
code digest: FAILS (detected) ... records retired
shared release set: FAILS (detected) ... warm Git set
all mutations restored
```

## Gates on the final tree

```text
npm test: 28 passed; 0 failed; 319.09 s; 72 fresh tasks (console 25.31 s, resume 36.79 s, 46 release cases)
suite:process-debt: 2 passed; 0 failed; 79.57 s; 2 fresh tasks
npm run test:docs: 23 passed; 0 failed; 12.96 s; 23 fresh tasks (console-docs 1.44 s)
npm run release -- check-surfaces --local: every surface passes
git diff --check: clean
```
