# WO-164 repair of VER-001 F1

Operator dispatch: `resume: fix`, 2026-09-27. The original order and
[VER-001](../../verifications/WO-164/VER-001.md) remain the obligation and
immutable finding. D006's warm-only reading was incorrect: criterion 2
includes the first call after a code change or in a new worktree.
[D008–D009](decisions.md#wo-164-d008--repair-the-cold-derivation-and-correct-the-timing-interpretation)
record the correction, alternatives, goal alignment and reopening condition.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.157.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

**Process cost:** entry 50,973 tokens; source codex-transcript-counter, dispatch
scope, cutoff 2026-09-27T17:43:07.083Z. Handoff counters belong in the ignored
harness receipt and response; USD cost is unavailable. No subagents were
spawned in this repair. D001's existing economy experiment is retained.

## Change

Only `scripts/release.mjs` and the existing console collection regression
change executable behavior for this repair. Missing tag ranges still use
Git's first-parent reachability query per range. The same query now returns
parents; unique commit and parent control views are read together, through
the existing validated reader, in groups of at most sixteen. Release-note
diffs use explicit commit/first-parent pairs in bounded, NUL-framed batches.
Individual reads remain the fallback if an aggregate read fails. Per-commit
attribution retains completed-review events before sorted changed-note ids;
each range retains chronological order and deduplication. The publishing
path, cache format and warm-cache identity rules are preserved.

## Measured outcome

Operator host, Node v26.9.0, 113 orders and 104 release tags. Each direct
collection runs in a fresh Node process. Literal cold means removing only
`docs/control/local/cache/release-list.json` before the call.

| Measurement | Pre-repair cold | Repaired cold | Repaired warm |
| --- | --- | --- | --- |
| `collectSources`, ms | 6,261; 6,165 (original record); 5,845 (verifier proxy) | 2,468; 2,427 | 665 |
| `console board --json`, ms | 6,898 | 2,727 | 825 |
| `release list`, ms | 6,134 | 1,935 | 64 |
| `console-docs` in document gate, s | 8.21 | 3.53 | 1.57 |
| Full document gate, s | 17.58 | 13.37 | 13.86 |

The verifier's unchanged `GIT_GRAFT_FILE=/dev/null` proxy takes 2,409 ms
and returns the same release hash. The original pre-WO-164 collection
was 21.2 s; its document task was 22.50 s of a 31.42 s gate. All original
figures remain in [timing.md](timing.md). These are host measurements,
not a guarantee for arbitrary future history or host contention.

The same-tree board comparison redirects only the release-list child to a
scratch copy of the pre-repair script for its before run. It uses the same
repository documents, built console, library sources and fixed observation
time for all three runs. All return 6,456,826 identical bytes, SHA-256
`4007e8014e00b3cac2174c7b21a68c1a0bed38a69e7ebb0492690c54890c08f0`.
The release listing returns 6,707 identical bytes in each mode, SHA-256
`273ea687117b3f0c586aa8b6a104b56fcd943cddfd485c17e8a5749bc299706a`,
also matching the original implementation record. The first scratch-copy
attempt lacked its package imports and produced an unavailable source; it
was discarded and rerun with those dependencies supplied.

## Regression and verification

The console collection test passes (9.34 s). The fixture counts four Node
processes throughout; cold five-order/four-tag collection uses 20 Git
processes, four new tags use 20, and warm calls with either five or nine
orders use eight. The strengthened test run with the pre-repair release
script injected only into its disposable fixture fails: 41 cold Git
processes exceed the bound of 20. No worktree source was swapped.

The same test checks moved tags, replacement history, corrupt/ignored cache
handling, board projection equivalence, a twenty-commit range, a side-parent
previous tag and first-parent merge attribution, unusual NUL-framed paths,
aggregate-read failure fallback and refusal of rewritten control bytes.
During test construction the injected blob fault initially also rejected
individual reads, and an empty rewritten segment hit missing activation
before append-only validation; those probes were corrected to isolate the
intended failures before the passing run.

Executed checks: build; focused console regression; release surface check;
planning check; publication freshness check; cold `npm run test:docs`
(23 suites passed, zero failed, 23 fresh tasks in 13.37 s); and `npm test`
(28 suites passed, zero failed, 72 fresh tasks in 343.24 s). The full gate
includes the console regression and release fixtures. `git diff --check`
is clean. No new dependency or suppression was introduced.

The final document check after the write-backs also passes: 23 suites,
zero failures, 23 fresh tasks in 13.86 s, with `console-docs` at 1.57 s warm.

The product guide records the repaired figures and its engineering edition
source lock is refreshed. The register retains the cold-gate candidate
`FUP-b8a329d9970b8206` and the verifier finding `FUP-d68bd29cf96864f1`
allocated to WO-164 for independent re-verification and close disposition.
The adjacent-work queue is empty at revision zero.

## Remaining lifecycle work

Independent re-verification and final review are separate dispatches. The
existing close-stage follow-up retargeting remains assigned to final review.
No criterion is waived and the failed verification report is unchanged.
