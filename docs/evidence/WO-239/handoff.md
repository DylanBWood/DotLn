# WO-239 implementation handoff

Status: implementation is complete, main 297bf4f1 is integrated at the operator's direction, and three integrated reviews have finished with nothing open. The complete review run passed at code identity `41629663fd2d2cc1514acf4074dbc36aa26d850745cd1fdff71bef9c2102b25d` (tree `d25c6a86b5b8945e0786a5acff8cdff049e826d3`): 44 passed, 0 failed, 0 h 33 min, 113 fresh tasks, recorded 2026-10-30T08:20:48Z. The run before it failed on one kit recovery case written for the base close order; [WO-239-D023](decisions.md#wo-239-d023--assert-the-closes-prerequisite-first-order-in-the-kit-recovery-case) records that failure and its repair.

What changed:

- **Close entry.** The close checks its source-only prerequisites, prepares any stale or missing runtime in a child process, and only then imports built code.
- **One invocation.** The printed publish command runs once.
- **Census scope.** The close census covers only the closing order's roots, main's retained lane and this checkout's temporary roots.
- **Timing.** Seven timed steps go on the close record, and `plan failures` reads them.
- **Compact output.** Retained-material output and removal receipts are compact; paths are behind `--list-material`.
- **Integration guards.** Integration refuses live lane holders and takes in nothing when it is not behind main.

The integration, its retimed versions and its new role oracle are recorded in [WO-239-D019](decisions.md#wo-239-d019--integrate-mains-document-contract-release-retime-the-patch-and-chain-one-integration-oracle).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.314","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}

Two sessions worked on this order:

- **Claude Code session (attested above):** integrated main, ran the integrated reviews and both of today's complete runs. Its effort is the selected value read from `CLAUDE_EFFORT`, not the effective effort.
- **Earlier Codex session:** implemented the order through WO-239-D018, under the attestation recorded in the previous handoff revision (`codex-cli` 0.165.0, `gpt-6-astra`, effort `max`, `codex-session-readback`).

**Criterion 1:** met. [controls.json](controls.json) records the paired stale-compiler control:

- At the base, the close's prediction differs from the fresh emit, and the starter refresh is refused (exit 1).
- At the head, the entry builds in a child before any built import, and the first-invocation refresh passes (exit 0).

The complete row passed `release:case:stale_compiler`, and the kit recovery case now pins the prerequisite-first order. `release.mjs`'s static import graph (70 files) loads no `packages/*/dist` module.

**Criterion 2:** met. The close record's `steps` holds seven rows, each with its exclusive duration: prerequisites, runtime, worktree-removal, publication, starter-refresh, prune and record. `plan failures` reports the median total and the slowest step over the latest eight attempts that carry `steps`. The release and plan-refutation suites passed in the complete row.

**Criterion 3:** met. At close, the census reads 0 of 1,000 foreign gate-fixture roots; under `harness prune`'s global scope it reads all 1,000 ([controls.json](controls.json)). `fixture-temp-root` passed in the complete row, including the new case that binds a root through a symlinked checkout path.

One of the order's operator-review assumptions was partly false. It said the global walk "still runs at `harness prune` and session end", but the session-end prune never walked the system temporary directory.

- After this order, only an explicit `harness prune --apply` removes expired roots outside a close's scope.
- `plan start` still prints a read-only global census.
- [WO-239-D020](decisions.md#wo-239-d020--resolve-the-integrated-reviews-and-state-the-global-walk-as-built) records this, with follow-up FUP-69af2e1da022aa7a for planning to decide where routine cleanup belongs.
- [WO-239-D021](decisions.md#wo-239-d021--resolve-the-integrated-rechecks-and-correct-the-census-entries) records that none of WO-233-D046's reopening conditions occurred, apart from the start census cost that WO-239-D001 already resolved.

**Criterion 4:** met. The 2,000-file fixture's transcript carries no path list: the advisory is 198 bytes and the removal receipt 995 bytes, each with counts by class and a digest. `--list-material` prints the paths. `release:case:close_compact`, `release:case:removal_inventory` and the worktree suite passed in the complete row.

**Criterion 5:** met. [controls.json](controls.json) records the paired integration control:

- The baseline creates one real stash and exits 1 under its observer.
- The changed helper exits 0 and creates no stash or merge scratch.

A live lane holder in the worktree or in main's checkout is refused by name, including while a planning pass has the primary checkout off main. That planning-pass case is new. `worktree-integration` passed in the complete row.

**Criterion 6:** met. Both installed role roots carry the release-close one-invocation sentence and the executor's integration-points sentence.

- **Oracle:** `wo239-integration-role-baseline.json` pins all twelve roles at both economy settings. It chains to main's `wo235-removal` oracle and to this branch's `wo239` oracle.
- **Chain walk:** the oracle test follows every link, checking all 42 linked oracles and 80 digests, and requires every role oracle to stay reachable.
- **Handoff printers:** they name one `--publish` command, with `--dry-run` optional; `test-resume.sh` and `test-worktree.sh` pin that wording.
- **Suite:** `process-debt` passed in the complete row.

**Criterion 7:** met.

- **Write-backs:** product 07, the kit README and the PLAYBOOK state the mechanism as built, including the corrected global-walk and integration-order sentences.
- **Checks:** `npm run publication:check` passed under the bounded wrapper. `npm test -- --review` passed at the code identity above; that complete row also covers the structural row and the `npm test` claim. The `npm run test:docs` row follows this handoff, and `git diff --check` is clean.
- **Dependencies:** none added. Only skeleton's version and the console's exact pin to it changed.

Versions and sizes:

- **Release:** `v0.103.1`, retimed from `v0.102.1` above main's published `v0.103.0`.
- **Skeleton:** `0.73.1`, retimed from `0.72.1` above main's `0.73.0`, keeping this order's patch impact. The console's exact pin and the lockfile follow.
- **Unchanged packages:** compiler `0.33.0` and console `0.5.0`.
- **Root sizes:** both installed executor roots measure 36,500 bytes (+1,525 over main's 34,975), and both release-close roots 22,758 bytes (+101 over 22,657). These fit the accepted ceilings of 40,194 and 26,410 bytes.
- **Authority edition:** revision 005 is selected; 001 to 004 are retained.

`npm run meta` reports a drift-to-low-performance reopen candidate for executor cold-start bytes. WO-239-D019 records it for planning.

self-review: found 48; fixed 42; recorded 6

[reviews.md](reviews.md) records both review generations:

| Reviewer | Earlier Codex workers (found/fixed/recorded) | Integrated Claude `dotln-worker` agents (found/fixed/recorded) |
| --- | --- | --- |
| Criteria | 4/4/0 | 8/6/2 |
| Design | 1/1/0 | 15/13/2 |
| Consistency | 8/8/0 | 12/10/2 |

No finding is open. All three integrated reviewers finished on the final tree before the passing complete run and were not restarted after it.

Process cost:

- **Usage:** the final readback at 2026-10-30T08:21:43Z (source `claude-transcript-message-usage`, scope dispatch) counts 94,966,381 total tokens: input 558, cached input 94,109,434, cache write 572,804 and output 283,585. Reasoning tokens and cost are unknown.
- **Reviewers:** three Claude `dotln-worker` reviewers were launched, 3 of the 20-agent cap (exact-observed), with no descendants; rechecks went by message. Their pin is `claude-opus-5-5` at `xhigh`; their effective readback is unavailable. The host reported their own token counts as criteria 414,860, consistency 367,611 and design 255,909.
- **Standing:** dispatch standing is 17 h 57 min and 11 complete runs against an as-needed allowance, including the earlier Codex session.
- **Today's complete runs:** 0 h 25 min (failed) and 0 h 33 min (passed).

Goal alignment: the outcome matched the operator's direction. Main was integrated at the named lifecycle point, before format, sync and the handoff run, with no live gate. The order's objective holds as built, apart from the corrected session-end assumption above. Production close duration remains unmeasured until the first close after this order records its `steps`. Verification and final review remain separate dispatches.
