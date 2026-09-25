# WO-164 — Constant-process console collection: one status fold returns every order, `release list` caches per-tag results by tag object id, and the board and the document gate stop growing by a second a day (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. A batched form of `resume status`, a
per-tag cache in `release list`, and the console collector calling both;
output byte-identical; no contract, schema, gate step or role-text change.
Assigned at activation under the standing opt-out default.
**Cost:** adds `npm run resume --silent -- status --all --json` (every
order's full status from one fold in one process), a per-tag result cache
in `release list` keyed by the immutable tag object id, the collector's
use of both, and regressions bounding process and Git spawn counts.
Removes, measured by REVIEW-003 on the frozen subject at `fa9957f1`:
101 sequential `node scripts/resume.mjs status --json --work-order` forks
per collection (12.8–13.3 s at about 0.12 s each) and one `release list`
of 5.2–5.6 s through 1,050 Git spawns (about eleven per tag across 93
tags, linear in tag count: 24 tags 1.48 s, 93 tags 5.63 s); together
18.4–19.1 s of `collectSources`, 19.73 s for `console board --json`, and
20.06 s of the 24.81 s `npm run test:docs` gate that every planning pass
and final review runs, now the gate's critical path since WO-156 cut the
plan tasks to under 2 s. Neither `packages/console/src/collect.ts`,
`scripts/resume.mjs` nor `scripts/release.mjs` is a registered evidence
source; no edition re-mints. Wall-clock, tokens and context bytes of the
order itself are unknown until run.
**Nomination provenance:** REVIEW-003 finding ER3-002 (major, measured,
survived REFUTATION-004) and its packet
`constant-process-console-collection`, accepted by the 2026-09-25 planning
pass; register row FUP-7f9a27e6ed6c44b3 (deferred 2026-09-19 with the
reopening observation "a measured console collection above ten seconds",
now observed). Planner-synthesized. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-114 merged (the runtime status projection the board
renders beside; closed, v0.47.0); WO-156 merged (the plan-check cut that
made this the gate's critical path; closed, v0.46.2).
**Recommended placement:** paired with WO-165 directly after WO-070 and
WO-115 and before WO-162 and WO-163. This order edits the console
collector, the status command and the release listing; WO-165 edits the
Entropy Reducer loadout and its receipt rendering. Disjoint files; neither
depends on the other; only WO-165 re-mints. Because WO-158 adds dispatches
to `scripts/resume.mjs` and WO-160 edits `scripts/release.mjs`, this order
runs after both close. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-114",
    "relation": "satisfied-by-close",
    "reason": "the runtime status projection the board renders beside"
  },
  {
    "workOrderId": "WO-156",
    "relation": "satisfied-by-close",
    "reason": "the plan-check cut that made console collection the document gate's critical path"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/instance/entropy-reducer/runs/REVIEW-003.md` (ER3-002: the
measurements, the spawn census and the reproduction command) and
`REFUTATION-004.md`; `packages/console/src/collect.ts` lines 117–139
(one status fork per order in the control log; 934 events);
`scripts/resume.mjs` (`status --json --work-order`; the fold in
`scripts/lib/control.mjs`); `scripts/release.mjs` (`list`);
`packages/console/test/board.test.ts` line 992 (the 19.65 s document
test); `scripts/test-runner.mjs` (the `console-docs` task);
`docs/planning/work-order-map.md` §Candidates — returns from the cleanup
pass, item 9 (the deferred row); 07-execution-guide.md §Candidate —
cold-gate structural cuts.

**Objective:** console collection issues a constant number of processes
regardless of order and release counts, with byte-identical output, so
the board and the document gate return to the few-second band and stay
there as history grows.

**Observed gap (dated 2026-09-25, `main` at `fa9957f1`):** the Cost
line's measurements, reproduced by the refuter on the frozen subject. On
2026-09-19 the same path was recorded unmeasured and deferred; a full gate
had already failed under load and was answered with a deadline change.

**Design (scope discipline):**

- `resume status --all --json` folds every order's segment once in one
  process and returns the same per-order objects `status --json
  --work-order` returns, in a deterministic order; the single-order form
  is unchanged.
- `release list` caches each tag's derived record under the tag object id
  in the existing ignored local lane, so an unchanged tag costs no Git
  spawn on the next call; a moved or new tag recomputes.
- The collector calls the batched status once and the cached listing
  once; the regression bounds process spawns to a constant and Git
  spawns to the number of new tags on a fixture with many orders and
  tags, failing against the prior implementation; a second assertion
  diffs the board JSON before and after.
- Record the before and after timing of `console board --json`,
  `collectSources` and the `console-docs` task on the operator's host in
  the decisions; product 07's cold-gate candidate gains the after figure.
- **Declined alternatives, recorded:** raising the gate deadline again
  (the earlier answer to the same growth); moving the board test out of
  the document gate (hides the cost); caching status by mtime (the fold
  is cheap once in-process; the forks were the cost).

**Deliverables:** the batched status; the tag cache; the collector
change; the regressions; the timing record.

**Acceptance criteria (all required)**

1. `console board --json` output is byte-identical before and after on
   the same tree (hash recorded in the decisions).
2. `collectSources` on the operator's host completes in under 3 s with the
   current 100-plus orders and 90-plus tags, recorded beside the before
   figure; the `console-docs` task duration in `test:docs` is recorded
   before and after.
3. The regression bounds process spawns per collection to a constant and
   Git spawns to the new-tag count, and fails against the original source.
4. `resume status --all --json` returns the same objects as the per-order
   form for every order (a fixture compares them) and appends nothing.
5. The decisions record the figures and the reopening condition; the
   cold-gate candidate in product 07 gains the after figure;
   FUP-7f9a27e6ed6c44b3 is retargeted at close.
6. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the regression transcript; the timing record; `npm test`
at final review. No live row.

**Write-back duty:** decisions; product 07's cold-gate candidate; the
register row.

**Non-goals:** the work-order index's per-tag reads (measured separately;
reopen if `work-orders index` exceeds ten seconds); the board's rendering;
the document gate's task selection; the runtime status projection.

**Operator-review assumptions**

1. A patch with no live row is right for a performance change whose
   correctness criterion is byte-identical output.
