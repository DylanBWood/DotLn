# WO-132 repair 002 — VER-002 F1 and F2

Dispatch: `resume: fix`, failure source
[VER-002](../../verifications/WO-132/VER-002.md), recorded at
2026-09-15T14:35:12.242Z from checkpoint `refs/dotln/checkpoint/WO-132/9`.
This repair addresses F1 (blocking) and F2, its regression fixture. O1–O8 need
no repair and were not changed; the O7 record corrections are entered in
[WO-132-D006](decisions.md#wo-132-d006). The VER-001 repair is recorded in
[repair-validation.md](repair-validation.md) and is not edited. This session
was the sole registered writer of the worktree and spawned no analysis
worker. No branch commit, publication or lifecycle transition other than
`repair-complete` was performed.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.272","model":"claude-fable-5-1","effort":"xhigh","source":"self-reported"}

The harness version was observed with `claude --version`. The model and effort
are the session's `/model` selection as this session printed it (`Fable 5.1`,
`xhigh`); no effective-session readback is claimed.

## Defect and repair

`shellWritePaths` tokenized `>&word` as one word and matched it with the
plain-redirect pattern, recording `&word` as the destination. That spelling
escaped every gate-input rule, and under the repository's unanchored `dist/`
and `node_modules/` ignore lines it was classified as ignored scratch, so the
generated hooks admitted `>&`, `1>&` and `>>&` writes into `packages/*/dist`
and `./node_modules` during a live `npm test`. The same misparse refused
`ls 2>&-` as a write to `&-` (VER-002 O1). Before the change, bash wrote the
file for `>&a`, `1>&b` and `>& c`, and zsh also for `2>&e` and `>>&d`
(observed in scratch in both shells).

The adapter now handles descriptor-duplication output redirects before the
plain-redirect branch: `>&word`, `N>&word` and `>>&word` record `word` when
the operand is not a descriptor number, `-` records no destination, a spaced
operand is the next word, and a missing, expanded or wildcard operand stays
opaque. Input duplication (`<&word`), quoted forms, the admitted program list,
the flag allowlists and the writer reservation are unchanged.

Regression coverage: an adapter unit test in `scripts/test-process-debt.mjs`
pins eleven destination and no-destination parses and four opaque forms. The
criterion-9 live-gate fixture in `scripts/test-harness.mjs` now denies `>&`,
`1>&` and `>>&` into `packages/skeleton/dist` (relative and absolute), `>&`
into `./node_modules`, and the spaced `>& fixture.ts` form, and admits
`ls scripts 2>&-` and a `2>&1` pipeline, through all three generated hooks.
Payloads are judged, never executed.

## Checks

| Executed check | Result |
| --- | --- |
| Pre-repair adapter (checkpoint-9 source transpiled in scratch) on the subject commands | `["&packages/skeleton/dist/src/harness-command.js"]` for `>&`, `1>&` and `>>&`; `["&./node_modules/y"]`; `["&-"]` for `2>&-`; `["&"]` for the spaced forms |
| `npm run build` | Passed |
| `node --test --test-name-pattern='VER-002 F1' scripts/test-process-debt.mjs` | 1 passed |
| `node --test --test-name-pattern='WO-132 only the live product gate' scripts/test-harness.mjs` | 1 passed, 16.2 s |
| `node scripts/harness.mjs emit`, then `check` | 24 generated surfaces; the hook and manifest deltas are the refreshed build snapshot identity only. `emit` needed one run outside this session's sandbox, which denies writes under `.claude/hooks` |
| `node scripts/authority-evidence.mjs --check` at revision 001 | Stale `bundle-diff.json`, as the immutable-evidence procedure expects after an adapter change |
| `--write --edition WO-132 --revision 002`, selected in `docs/evidence/current.json`, then `--check` | Recorded and verified; revision 001 and the original authority files remain byte-identical |
| `npm run meta` | Decisions index carries WO-132-D006; process-health lines are advisory |
| `npm run release -- prepare --local` | v0.18.0 target remains current; no files changed |
| `npm run publication:check` | Software-engineer edition stale after the product 07 edit; its source lock refreshed to the checker's printed value; re-check passed with 45 linked source sections current |
| `node --test scripts/test-process-debt.mjs scripts/test-harness.mjs` | 90 passed, 0 failed, 325.2 s; both suites the adapter change touches, run in full |
| `npm run test:docs` | 17 passed, 0 failed, 113.82 s, 17 fresh tasks, after the work-order index refresh and concurrent with the two machinery suites below |
| `npm test` | 19 passed, 0 failed, 249.08 s; 62 fresh tasks, 0 reused; row recorded at 2026-09-15T14:55:33.976Z with code identity `dee83ba1012ce048ce7ec05cfb2834c744d5dbcaa71463b2067877396548a288` and exact tree `c92f235069b57f8c711fe87d44d05a93f92c2b92`; evidence reference `host-gate:dee83ba1012ce048ce7ec05cfb2834c744d5dbcaa71463b2067877396548a288:npm test`. Run alone after the machinery suites finished |
| `npm run format:check`; `git diff --check`; `git diff --cached --check` | Passed; clean; clean, re-run after the last record edit |

## Evidence limits

VER-001, VER-002 and the earlier WO-132 evidence stay historical observations
of their own source identities. The pre-repair observation above is the
checkpoint-9 adapter source compiled in a scratch directory, not a `main`
build of the hooks; pre-existence on `main` rests on VER-002's finding.
Independent re-verification and final review use their separate dispatches.
Process counters, when unavailable, are unknown rather than zero and remain in
ignored session receipts. The product row above was recorded by this
session's own `npm test`; the reviewer's single gate at final review remains
the release evidence, and this row does not substitute for it.
