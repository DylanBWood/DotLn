## Release overview

Collecting the actor board no longer costs one process per order and about eleven Git calls per release tag, so the board and the document gate stop growing by about a second a day. Console collection now starts four processes whatever the number of orders and tags. One `resume status --all --json` call folds every order's status in one process, and `release list` keeps each tag's derived row in an ignored local cache keyed by the tag's object id. On the operator's host with 114 orders and 105 release tags, `collectSources` takes about 2.2 s on a cold cache and 0.6 s warm, against 21.2 s before. The board's output bytes are unchanged.

## Read before upgrading

No action is required. The first `release list` in a new worktree, or after any change to `scripts/release.mjs` or `scripts/lib/`, derives every tag once (about 1.6 s on the operator's host) and writes `docs/control/local/cache/release-list.json`; later listings read only new or moved tags. The cache is used only while Git reports its path ignored and history is plain, with no shallow boundary, graft or replace ref; otherwise the listing is computed uncached, as before. `harness prune` lists the file as retained and never removes it, and subject teardown disposes of it.

If the batched status call fails, the board falls back to one status call per order and names that source `resume:status--json#per-order-fallback`. That path is as slow as before but complete. `release list` now reads range ends through `refs/tags/`, so a branch or other ref that shares a tag's name no longer changes a row. A DotLn-headlined tag whose manifest carries a non-array `notes.changedFiles` still fails the whole listing when its range is empty, as it did before this release; it is recorded as a follow-up.

## Substantive changes

**Status.** `npm run resume -- status --all --json` returns every order's `status --json --work-order` object, in id order, from one fold that reads the release set once. It appends nothing, and the single-order and text forms are unchanged.

**Release listing.** A tag's row is reused while its tag object, the previous release's tag object, the listing code and the configured roots are unchanged. The cold derivation is batched: one first-parent range read per tag, historical control views read once in groups of 16, and release-note membership from one `diff-tree --stdin` per 16 commits, each with a per-item fallback when an aggregate read overflows. Rows and attribution order are unchanged.

**Console.** The board's host collector makes one status call and one listing call, checks that the returned order ids equal the control log's, and falls back per order only when the fold fails.

## Progressive polish

A console regression counts real Node and Git processes through a logger and a Git shim, on a fixture whose orders and tags double, and compares the board with the per-order forms and an uncached listing. Fixtures cover moved tags, replace grafts, merges, aggregate-read overflow, non-array manifests, the fallback, the append-only refusal, the new prune row and the cache's disposable classification. Product 03 and 07 describe the cache, its prune row and the measured figures.

## Evidence and compatibility

Application `v0.52.7` is a patch over `v0.52.6`. `@dotln/console` moves from `0.3.0` to `0.3.1`; no other component, dependency, control-event schema, gate step, contract or edition changes. On one tree, the original `release list` and the new cold and warm listings print the same 106 lines, and `status --all --json` equals the original per-order output for all 114 orders. `console-docs` in the document gate fell from 22.50 s to 3.53 s cold and about 1.4 s warm. Independent verification failed once on the first, uncached collection (5.8 to 6.3 s) and passed after the repair; the first final review failed on a machinery suite the default gate did not select, and the second passed after that repair and a fresh verification. The final review's `npm test -- --review` passed 34 suites, 0 failed, in 637.99 s. Known limits: the cold margin under the three-second bound is about 0.8 s on the operator's host and shrinks as history grows; the batched status output grows with the square of the order count (2.6 MB at 114 orders); and the empty-range manifest case above is unchanged.
