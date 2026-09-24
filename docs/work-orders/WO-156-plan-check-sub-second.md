# WO-156 — plan check in the sub-second band: the work-order path pattern is built once per call instead of once per committed path per sequence order, the planning subject is byte-identical, and the two plan tasks in `test:docs` stop costing about 25 s each (v0.46.2)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A path-pattern hoist and fewer Git launches in the planning check, plus bounded text-normalization reuse in receipt comparisons, with
regressions; no contract, schema, gate step or role-text change.
`scripts/lib/plan-subject.mjs` is not a registered evidence source, so no
edition re-mints. Assigned at activation under the standing opt-out default.
**Cost:** one pattern built per call, existing bounded immutable Git caches
and batch reads reused, a normalization cache capped at 512 entries and
1 MiB of string storage, and regressions bounding file-system calls and Git
launches. No new runner task or dependency. Removes, measured on 2026-09-22 at `4bf626f4`: 16.46 s
of `node scripts/refute-plan.mjs check` (20.54 s at the review, 19.66 s at
the refutation; 3,879,656 `statSync` calls and 212 spawns), paid twice in
every `npm run test:docs` (`plan` 23.49 s and `plan-refutation-current`
23.60 s on 2026-09-22 against a 28 to 33 s gate), which every planning pass
and every final review runs. Wall-clock, tokens and context bytes of the
order itself are unknown until run.
**Nomination provenance:** REVIEW-002 finding ER2-004 (minor, measured,
survived REFUTATION-003, accepted 2026-09-22), whose refutation traced 99.9%
of stack samples to `cacheKey` under `loadConfig` under `rootPattern`,
called from the `Array.filter` callback in `scripts/lib/plan-subject.mjs`.
Planner-synthesized in the 2026-09-22 REVIEW-002 pass, first as a boy-scout
nomination on WO-064 and then filed as an order when the operator directed
that closed entries leave the sequence; both dispatches are captured
verbatim in ignored intake (SHA-256 in the ledger section). Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-135 merged (the planning-gate corrections that shaped the
current subject builder; closed, v0.29.4).
**Recommended placement:** paired with WO-155 directly after WO-153 and
WO-154 and before WO-111 and WO-114. It edits `scripts/lib/plan-subject.mjs`
and `scripts/test-plan-refutation.mjs`; WO-155 edits the bundle generator,
the generated skills and the harness-context scripts. The two share no file
and neither depends on the other; this order re-mints nothing. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-135",
    "relation": "satisfied-by-close",
    "reason": "the planning-gate corrections that shaped the subject builder this order speeds up"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/instance/entropy-reducer/runs/REVIEW-002.md` (ER2-004: the timing,
the `statSync` and spawn counts, the CPU profile shares) and
`docs/instance/entropy-reducer/runs/REFUTATION-003.md` (the stack-sampled
cause and the unpatched timing); `scripts/lib/plan-subject.mjs` lines
301–320 (the sequence guard, the per-id `committed.paths.filter` that
builds a `RegExp` through `rootPattern` for every committed path);
`scripts/lib/config.mjs` lines 429–455 (`cacheKey` stats the configuration
file on every `loadConfig`, by design, so the shared parsed result stays
honest); `scripts/refute-plan.mjs` (`check`: `syncFollowups` then
`checkPlanGate`); `scripts/test-runner.mjs` (the `plan` and
`plan-refutation-current` tasks); 07-execution-guide.md §Discipline,
Automate recurring procedure, and §Candidate — cold-gate structural cuts
(the row this measurement joins).

**Objective:** `plan check` and `plan subject` produce byte-identical output
to today on the same tree and finish in under 2 s on the operator's host,
with the per-path configuration load removed from the subject builder's
inner loop; the two plan tasks in `test:docs` show the reduction.

**Observed gap (dated 2026-09-22, `main` at `4bf626f4`):**

- `/usr/bin/time -p node scripts/refute-plan.mjs check`: real 16.46 s, user
  13.99 s, sys 2.56 s, exit 0; the other document checks run under 1 s
  (`work-orders index --check` 0.88 s, `meta --check` 0.55 s,
  `check-publication` 0.14 s at the review).
- The refutation's stack sample placed 3,886 of 3,890 samples at
  `cacheKey` (`config.mjs:432`) under `loadConfig`, `docRelative` and
  `rootPattern`, called from `plan-subject.mjs:311` inside the
  `committed.paths.filter` at line 309, once per committed path (about
  3,000) per sequence order (100), which is the 3.9 million `statSync`
  calls.
- `test:docs` on 2026-09-22 ran `plan` 23.49 s and `plan-refutation-current`
  23.60 s inside a 28.34 s gate.

**Operator scope expansion (2026-09-24):** Add the Git-launch reduction to
WO-156, bind this amendment with `npm run plan -- amend-order`, then repair
and re-verify. Authorization and bounded paths are recorded in WO-156-D005.
A second operator authorization adds a bounded cache for the unchanged pure
NFKC/whitespace normalization in receipt comparisons (WO-156-D006).

**Design (scope discipline):**

- Build the work-order path pattern once per call of the subject builder
  (or once per sequence id, outside the filter) and reuse it inside the
  filter. Reduce repeated Git launches in `scripts/lib/plan-subject.mjs` and
  `scripts/lib/plan-receipts.mjs` by batching committed reads and reusing
  successfully resolved immutable commit identities. Preserve validation,
  workspace observations, mutable revision freshness, and existing cache
  bounds. Cache repeated receipt normalization by the exact input string,
  preserving NFKC, whitespace folding and missing-value behavior; bound entry
  count and retained string bytes, and bypass oversized inputs. Change nothing
  in `loadConfig`,
  whose per-call stat is a recorded design choice for a process that may
  gain or lose its configuration mid-run.
- The regression drives the fixture sequence through the subject builder
  with `statSync` counted and asserts a bound well under the current
  millions (the executor records the measured figure and picks a bound
  with margin); a second assertion compares the subject JSON before and
  after on the fixture tree.
- Record the after timing of `plan check` and of the two `test:docs` tasks
  on the operator's host in the decisions. The authorized Git-launch
  reduction must bring `plan check` under 2 s; record launch counts and
  regressions that fail on the prior implementation.
- **Declined alternatives, recorded:** memoizing `loadConfig` without its
  stat (removes the honesty the comment names); batching the Git spawns
  was initially deferred, then authorized after VER-001 measured 240 launches; a boy-scout
  nomination on WO-064 (withdrawn the same day at the operator's direction
  that findings become orders).

**Deliverables:** the hoist; the Git-launch reduction; the regressions; the timing record; the
write-backs in criterion 4.

**Acceptance criteria (all required)**

1. `plan subject` and `plan check` output is byte-identical before and
   after on the same tree (recorded by hash in the decisions), and the
   plan-refutation suite passes unchanged.
2. `node scripts/refute-plan.mjs check` completes in under 2 s wall-clock
   on the operator's host, recorded with the before figure; the `plan` and
   `plan-refutation-current` task durations in `test:docs` are recorded
   before and after.
3. The regression bounds the `statSync` calls the fixture sequence makes
   and fails against the original source. A Git-launch regression fails
   against the pre-repair source and covers fresh mutable revisions, immutable
   content reuse, and committed receipt tampering. Normalization regressions
   preserve Unicode/whitespace results and exercise cache hits, eviction,
   changed inputs and the oversized-input bypass.
4. The decisions record sources, the measured figures and the reopening
   condition; the cold-gate candidate in product 07 gains the after figure.
5. `npm test` green; `git diff --check` clean; no new dependency; the
   regression's effect on the gate step count reported.

**Evidence gate:** the regression transcript; the timing record; `npm test`
once at final review. No live row.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; product 07's cold-gate candidate gains the measurement; the
ledger is reserved for planning synthesis.

**Non-goals:** the configuration cache's design; Git writes or changes to
Git reads outside the planning subject/receipt path; the test runner's task
selection or parallelism; any other document
check.

**Operator-review assumptions**

1. A patch with no live row is right for a pure performance change whose
   correctness criterion is byte-identical output.
