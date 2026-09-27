# WO-164

The actor board's host collection forked one `node scripts/resume.mjs status --json --work-order` per order in the control log and ran a `release list` that made about eleven Git calls per tag. On the operator's host on 2026-09-27, with 113 orders and 104 tags, `collectSources` took 21.2 s, and the document gate's `console-docs` task took 22.50 s of a 31.42 s gate. Both grew by about a second a day as orders and tags arrived, and the document gate runs at every planning pass and final review.

This pull request lands WO-164. Collection now starts four processes whatever the order and tag counts, with the board's output unchanged. On the reviewed tree (114 orders, 105 tags) `collectSources` takes about 2.2 s cold and 0.6 s warm.

- **One status fold.** `resume status --all --json` returns every order's `status --json --work-order` object, in id order, from one fold that reads the release set once. It appends nothing, and the single-order form is unchanged ([D003](../../evidence/WO-164/decisions.md#wo-164-d003--resume-status---all---json-and-the-collectors-one-call)).
- **Per-tag listing records.** `release list` keeps each tag's derived row in `docs/control/local/cache/release-list.json`, keyed by the tag object id and the previous release's tag object, and retired by any change to the listing code or configured roots. It is read and written only while Git reports the path ignored and history is plain ([D004](../../evidence/WO-164/decisions.md#wo-164-d004--the-release-listings-per-tag-records)).
- **A batched cold derivation.** The first listing in a worktree reads one first-parent range per tag, each historical control view once, and release-note membership in batches of 16 commits, with per-item fallbacks ([D008](../../evidence/WO-164/decisions.md#wo-164-d008--repair-the-cold-derivation-and-correct-the-timing-interpretation)). It takes about 1.6 s on the operator's host, against 5.8 s for the original listing.
- **A recorded fallback and a prune row.** A failed fold falls back to one status call per order under the source ref `resume:status--json#per-order-fallback`, and `harness prune` lists the cache as retained and never removes it ([D014](../../evidence/WO-164/decisions.md#wo-164-d014--receipt-028s-three-known-issues-two-implemented-one-stated-from-dated-measurements)).

**What a reviewer should know.**

- **The cold margin is under a second.** Criterion 2's three-second bound covers the first collection in a new worktree or after a listing-code change, measured at 2.14 to 2.20 s on the reviewed tree. It shrinks as history grows; D009 and D014 reopen the order's decisions when either cold or warm collection reaches three seconds.
- **One listing edge is unchanged, not fixed.** A DotLn-headlined tag on an empty range whose manifest carries a non-array `notes.changedFiles` fails the whole listing, in the original and new code alike. It is deferred with a follow-up ([D013](../../evidence/WO-164/decisions.md#wo-164-d013--repair-final-001-the-caches-root-derivation-and-the-listings-lazy-manifest-attribution)).
- **A ref sharing a tag's name no longer changes a row.** Range ends are read through `refs/tags/`, so the range and the cache key name the same objects ([D004](../../evidence/WO-164/decisions.md#wo-164-d004--the-release-listings-per-tag-records)).
- **The status output grows with the square of the order count.** Each object carries the whole order list, as the per-order contract requires: 2.6 MB at 114 orders, under a 256 MB collector bound; D003 reopens at 32 MB.

**How the review went.** A Claude Code executor implemented the order and ran a five-agent read-only review before handoff. [VER-001](../../verifications/WO-164/VER-001.md), run in Codex, failed criterion 2: the first, uncached collection took 5.8 to 6.3 s. The repair batched the cold derivation, and [VER-002](../../verifications/WO-164/VER-002.md) passed all six criteria with a five-way board comparison at a frozen clock, including the original collector. [FINAL-001](FINAL-001.md) failed criterion 6: its `npm test -- --review` gate ran the `configuration-root` machinery suite, which the default gate does not select, and that suite refused the new module's second root derivation. It also routed receipt 028's three known issues and an eager manifest read. The repair fixed all three, merged `main` (WO-171, v0.52.6) at the operator's direction, and ran the review selection itself. [VER-003](../../verifications/WO-164/VER-003.md) passed. [FINAL-002](FINAL-002.md) re-ran the review gate, repeated the same-tree listing and status comparisons, completed the integration record, paraphrased two operator messages the repair had recorded word for word, and disposed every follow-up row the change touches.

**Validation.** The reviewer's `npm test -- --review` on the staged subject passed **34 passed, 0 failed, 637.99 s, 78 fresh tasks, exit 0** at code identity `310096b93b4d75d5f66aef87b0256f832c3918edd14676ebbc5932d3e8f42cf0`, the identity VER-003 judged, and that row binds the released bytes. On the reviewed tree, the original `release list` (5,812 ms), the new cold listing (1,630 ms) and the new warm listing (114 ms) print the same 106 lines, SHA-256 `2481906d740370d873f36f4d0fb92163e2e7debbd83772688aa674b4c755e21d`. `status --all --json` equals the original per-order output string for string for all 114 orders, with and without session variables (217 to 231 ms against 14.7 s of forks), and leaves the control bytes unchanged. The console regression fails against the original sources and the pre-repair listing. `npm run test:docs` passed after the review records were written, and `harness check`, `publication:check`, `release check-surfaces --local` and `plan check` pass. `git diff --check` is clean, the only manifest change is `@dotln/console` 0.3.0 to 0.3.1, and the diff adds no suppression.

This prepares application `v0.52.7` as a patch over `v0.52.6`, the classification the order declared. No edition is re-minted.

Full evidence: [decisions D001 to D017](../../evidence/WO-164/decisions.md), the [timing record](../../evidence/WO-164/timing.md), the [first repair](../../evidence/WO-164/repair.md) and [the FINAL-001 repair](../../evidence/WO-164/repair-final-001.md), [VER-001](../../verifications/WO-164/VER-001.md), [VER-002](../../verifications/WO-164/VER-002.md), [VER-003](../../verifications/WO-164/VER-003.md), [FINAL-001](FINAL-001.md), [FINAL-002](FINAL-002.md) and [the order](../../work-orders/WO-164-constant-process-console-collection.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-27T19:20:53.647Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-085 | 13,343,986 (Δ unavailable) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-166 | 12,280,995 (Δ -1,062,991) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-169 | 8,525,973 (Δ -3,755,022) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-168 | 12,862,796 (Δ 4,336,823) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-171 | 8,494,635 (Δ -4,368,161) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-164 | 8,649,298 (Δ 154,663) / 5 | 2,593,617 (Δ unavailable) | 3 (Δ unavailable) / 18,640 (Δ unavailable) | 90,561,946 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 6 (Δ 6) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-164/executor | 5,257,658 (-75,929) | 289,900 (unavailable) | 560 (unavailable) | 57,016,201 (unavailable) | 634 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-164/verifier | 1,884,643 (173,718) | 33,200 (unavailable) | 67 (unavailable) | 13,160,400 (unavailable) | 76 (unavailable) | unavailable (unavailable) / unavailable |
| WO-164/reviewer | 1,506,997 (56,874) | 154,506 (unavailable) | 127 (unavailable) | 20,385,345 (unavailable) | 177 (unavailable) | unavailable (unavailable) / unavailable |
| WO-164/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-164/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-164/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
