# WO-248 — The pull-request process table says what its reader can use: one table for the order under review, one value per cell, `unknown` spelled out, durations in hours and minutes, the previous-order comparison as one labelled sentence instead of a delta in every cell, and the six-order table and its blank cells out of the body (v0.111.1)

Until now the last block of every pull-request body carried two tables a reviewer could not use: a ten-column Work table for the last five closed orders and the active one, and a nine-column Dispatch table whose cells held a value and an unlabelled delta against an unnamed previous order (`2 h 18 min (Δ -7 h 6 min)`, wrapped one word per line in the viewer), blank cells where a value was unobserved, a combined USD-and-declared-prompt-tokens cell reading `/ 768` on every row, and a footer counting fifty-odd omissions. Core's #258 and the fork's WO-025 body read the same, and the operator's screenshot of the fork's table is the evidence that the blank reads as nothing and the delta as a negative duration.

Now `renderMetaTable` takes the subject order from its two callers in `release.mjs` (`release prepare` and the regenerated body) and renders one table for that order alone: a row per dispatch role and eight columns (dispatch, wall clock, tokens, USD, commands, steps, bound stops, bound acceptances), each cell one figure or the word `unknown`, every duration as `N h M min`. Below the table, one sentence per metric known on both sides names the comparison and its reference: `Against WO-250, the previous closed order: wall clock 4 h 18 min less.` The reference is the latest closed order before the subject in the collector's selection, never an open order, and no sentence is written when no closed order precedes the subject or either figure is unknown. The Work table, the per-cell deltas, the declared prompt tokens and the omission footer leave the body; `npm run meta` prints every metric with its labelled previous-order delta exactly as before, with the new block for the latest open order in place of the old tables. The block at the bottom of this body is the first stored one rendered this way.

What a reviewer should know. A stored body of an order open when this lands keeps the old block until its next `release prepare` rewrites it, as WO-249's and WO-251's did at the verifier's regeneration probe; closed orders' bodies are records and are not rewritten. Every body still carries a row for each of the seven dispatch roles, so release-close, planner, refuter and router read `unknown` in all five value cells in a closed order's body, which a reader cannot tell from an unobserved dispatch; the verifier boarded that with its repair rule ([D004](../../evidence/WO-248/decisions.md#wo-248-d004), `FUP-225e0993974f3f4b`) and the review leaves it boarded rather than change the renderer after the complete run. Product 08 §PRs and commits still described the old block; the review rewrote that sentence to the block as built ([D006](../../evidence/WO-248/decisions.md#wo-248-d006)). Integration took in WO-250 (`main` moved from `91a730ac` to `e6aaeecc`) with no authored conflict and retimed the release from `v0.110.1` to `v0.111.1`, since WO-250's release took `v0.111.0` ([D005](../../evidence/WO-248/decisions.md#wo-248-d005)); no package, lockfile or component version changes, and `scripts/lib/github-body.mjs` and `withMeterBlockLast` are untouched.

Validation: the complete `npm test -- --review` run at the integrated code identity `a007550b…` passed on 2026-11-02 (43 suites, 116 fresh tasks, none failing, 0 h 41 min, exit 0), after the executor's run at the pre-integration identity `f6b51efe…` had passed with 43 suites and 116 fresh tasks; [VER-001](../../verifications/WO-248/VER-001.md) passed all six criteria on four probe families over the real control corpus, constructed edges, two stored bodies and main's terminal text, and lists the one boarded follow-up; [FINAL-001](FINAL-001.md) accepted the integrated subject after rerunning the verifier's probe script and three single tests on it, and lists two findings, one boarded and one fixed in the review. Decisions are in [decisions.md](../../evidence/WO-248/decisions.md); the executor's account is the [handoff](../../evidence/WO-248/handoff.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-02T22:31:54.866Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-248/executor | 0 h 48 min | 12,719,677 | unknown | unknown | 87 | 0 | 0 |
| WO-248/verifier | 0 h 13 min | 10,060,179 | unknown | 69 | 79 | 0 | 0 |
| WO-248/reviewer | 0 h 51 min | 5,652,923 | unknown | 80 | 87 | 0 | 0 |
| WO-248/release-close | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-248/planner | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-248/refuter | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-248/router | unknown | unknown | unknown | unknown | unknown | 0 | 0 |

Against WO-250, the previous closed order: wall clock 4 h 18 min less.

Against WO-250, the previous closed order: tokens 307,329,860 fewer.

Against WO-250, the previous closed order: commands 685 fewer.

Against WO-250, the previous closed order: steps 1,006 fewer.

Against WO-250, the previous closed order: bound stops unchanged (0 difference).

Against WO-250, the previous closed order: bound acceptances unchanged (0 difference).

<!-- dotln-process-meter:end -->
