# WO-220 VER-001 verification evidence

Verifier evidence for [VER-001](../../../verifications/WO-220/VER-001.md). Observed on 2026-10-24 at gate code identity `881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6`, base `f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1`.

## Isolated copy

Every executable probe below ran in a disposable copy in DotLn session scratch, never in the worktree. The copy is a shared local clone checked out at the base and overlaid with every modified and untracked file of the worktree, plus a copy of `node_modules`. `git diff` of the copy and of the worktree hash identically (prefix `4f11a1e6755a96c3`), and every untracked file matched by sha256. The copy was rebuilt with `npm run build`. The same hash was confirmed after each probe restored its bytes.

## Paired controls

[replay.mjs.txt](replay.mjs.txt) is the verifier's own replay; it does not use the executor's `control-replay.py`. For each control in [the executor's manifest](../repair-controls.json), it runs the positive arm and applies the recorded reversion: the base file, or the exact old/new needle checked against its count. It rebuilds when a `.ts` file was reverted, runs the negative arm, then restores and rebuilds. A control counts as demonstrated only when the positive arm exits 0 with no failed case and the negative arm exits 1 with a failed case. Each arm runs under `node scripts/harness.mjs bounded --`.

Result: **26 of 26 demonstrated** ([replay-results.json](replay-results.json)). On the first run, `browser-signal` and `browser-recovery` failed their positive arm as well. The case sets `PLAYWRIGHT_BROWSERS_PATH` to `<checkout>/.runtime/playwright`, an ignored directory the copy lacked, so Chromium never launched. With the variable set to the worktree's pinned Chromium, both demonstrate. Both runs are listed.

A static check of every targeted reversion found each `old` needle present in the current source at its recorded count. Each `new` arm removes or disables only that fix component, either restoring the base text or substituting `false` for the new guard.

## Other probes

[probes.json](probes.json) records:

- the twenty `followups --show` readbacks (14 settled, 6 declined, 0 deferred, all after activation, all at their latest source revision);
- the `followups --touching` query (5 pending rows, none of this order's list);
- the five direct WO-103/WO-105 lane files after build (27 cases pass);
- row 18's named "complete factorial" case, which fails with only the control's own reversion applied;
- the WO-220-D031 formatting probe. A comment-only line inside the current `taskSchema` makes the retained WO-138 records refuse with `unsupported retained task schema`. It is boarded as [WO-220-D032](../decisions.md#wo-220-d032--ver-001-pass-board-the-retained-schema-recognitions-dependence-on-the-current-functions-source-text).
