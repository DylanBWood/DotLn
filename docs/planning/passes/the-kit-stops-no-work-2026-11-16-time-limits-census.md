# Census of fixed time limits in the DotLn kit

Record of the [2026-11-16 planning pass](the-kit-stops-no-work-2026-11-16.md): a research worker's
report on the kit's fixed time limits, kept as the worker returned it, except that quotation marks were taken
off the passages that name the operator beside a quoted phrase, which the
document gate reads as quoting the operator. It is
that worker's reading of the tree at `38c333ab2`, not the pass's judgment;
the pass's document says which of its statements the pass checked and what
it decided from them. A statement it marks unverified is unverified.

Read-only research, 2026-11-16, repository `the DotLn checkout`,
branch `planning/2026-11-16-the-kit-stops-no-work`, HEAD `38c333ab2`. Nothing
was run except read-only greps, file reads, small read-only scan scripts in the
scratch directory and one in-process import of
`scripts/test-runner.mjs` to print its suite table. No test, gate or probe was
started. Rows A01-A17, B, C, D01-D15, D17, D21-D23 and E (except E25-E26)
were read in context; their effects are as read unless marked
**unverified**. D16, D18-D20 and E25-E26 were identified from the command
spawned beside each bound. Rows A18-A50 (test
files and fixtures) and D24-D38 (probes) were located by grep: each value is
the matched line, and the purpose was read on spot-checked lines (for example
`test-drive.mjs:2756, 5252`, `test-derived-orders.mjs:618`), not site by
site.

## How shipping was determined

`scripts/launchpad.mjs` builds the export's file list (the same list the
starter refresh uses: `scripts/lib/starter-refresh.mjs:713-720` calls
`exportKit` / `planKitUpdate` from `launchpad.mjs`).

- `KIT_FILES.trees` (`launchpad.mjs:274-275`): the whole `scripts` tree,
  `packages/beacons`, and three package test-fixture trees. Excluded files
  (`launchpad.mjs:287-300`): `scripts/test-runner.test.mjs`,
  `scripts/test-gate-deadlines.mjs`, `scripts/test-host-guard.test.mjs` (+ its
  fixture-inputs), `scripts/test-instance-history.mjs`, four
  `scripts/fixtures/instance-with-history/*` files and
  `scripts/fixtures/wo138-local-role-qualification.json`.
- `BUILD_FREE_MODULES` (`launchpad.mjs:243-269`): ships these package sources
  as source, among them `packages/skeleton/src/gate-deadlines.mjs`,
  `gate-evidence.mjs`, `evidence-editions.mjs`, `writer-teardown.mjs`,
  `test-selection.mjs`, `packages/compiler/src/codex-continuation.mjs`.
- `RUNTIME_PACKAGES` kernel, compiler, skeleton, console
  (`launchpad.mjs:135-143`, used at 756-757 and 988): their compiled
  `dist/src` and `dist/test` ship; TypeScript source does not. So every
  `packages/{kernel,compiler,skeleton,console}/src/*.ts` limit below ships as
  compiled JavaScript. `packages/browser-evidence` is not carried.
- `TEST_SUPPORT_FILES` (`launchpad.mjs:149-162`): the only `corpus/` files
  that ship are `corpus/harness/id-corpus-lib.mjs`, `wo101-support.mjs`,
  `wo101-id-corpus.test.mjs`, `corpus/manifests/WO-101.json`, two id vector
  files, and `corpus/mutation/enumerate.mjs`, `mutate.mjs`,
  `wo108-selftest.test.mjs`.
- `.claude/hooks/*.mjs` and `.claude/settings.json` are not copied; the
  export runs its own `harness emit`, which writes them from the compiled
  compiler (`test-runner.mjs:695`, the `launchpad` row's `protects` text;
  `launchpad.mjs:1029`). Their timeouts therefore reach every instance.

"Ships" below means: in an exported instance and in the starter.

## Search boundary

Searched: `scripts/**` (all `.mjs`, `.sh`, `.py`), `packages/{beacons,
browser-evidence,compiler,console,kernel,skeleton}/src`, `corpus/harness`,
`corpus/mutation`, `.claude/hooks`, `.claude/settings.json`,
`.claude/settings.local.json`, `.codex/hooks.json`, `scripts/kit/*`,
`docs/control/budgets.json`, `dotln.config.json`. Patterns: `timeoutMs`,
`timeout:`, `timeout =`, `_TIMEOUT`, `TIMEOUT_`, `AbortSignal.timeout`,
`killSignal`, `--test-timeout` (no occurrence anywhere), `budgetMs`, `maxMs`,
`wallClock`, `deadlineLimit`, `startDeadline`, `Date.now() + N`,
`const deadline`, `Atomics.wait`, `setTimeout(`, named `*_MS`/`*Ms`
constants, bounded retry loops, and timing assertions in tests (a multi-line
scan for `assert.*` over elapsed/duration values compared with a constant).

Not searched: `packages/*/test` (core-only rows; one assertion found
incidentally, `packages/compiler/test/source-bundle.test.ts:780`, `< 5000 ms`),
`node_modules`, `dist` output (derived from the searched sources),
`docs/control/local/` (forbidden), sibling repositories. Not counted as limits
(they never fail anything): progress heartbeats (`test-runner.mjs:1440`
15 s; `host-lanes.mjs:295` 30 s wait message), polling intervals
(`test-runner.mjs:3183` 500 ms; budgets `memory.signalIntervalMs` /
`footprintIntervalMs`, which are instance-settable sampling periods),
retention ages in `budgets.json` `retention.*` (prune eligibility),
`harness-host.ts:4254` (2 s file-time precision), kernel `Cadence` `maxMs`
(product semantics), `harness-prune.mjs:1234` (1 s context re-read), and
fixture *data* that merely asserts a value (e.g. `wallClockMs` literals in
`test-dispatch-bound.mjs`, `test-off-ramps.mjs`, `test-process-debt.mjs`).

## Counts

Rows are limit entries; a grouped row (same file, same purpose) lists every
line and is counted by its sites in the second column.

| Class | Rows | Sites | Rows shipped | Instance can change (file/env it owns) |
| --- | ---: | ---: | ---: | --- |
| A gate runner, suite and test-case limits | 50 | 152 | 48 | 0 |
| B lifecycle and command limits | 36 | 42 | 36 | 3 (B06, B07, B19) |
| C hook limits | 18 | 21 (C01 alone stands for 11 registrations) | 18 | 0 |
| D worker and external CLI launch limits | 37 | 113 | 37 | 1 (D23) |
| E other | 34 | 56 | 33 | 2 (E31 advisory, E32 read by nothing that enforces) |
| **Total** | **175** | **384** | **172** | **6 rows yes / 169 rows no** |

Four further rows can be raised only by a per-invocation command-line flag
(not a file the instance owns): B02 `--timeout`, B05 `--timeout-seconds`, B14
`--fetch-timeout`, B27 `--slow`. They are counted under "no".

Suite-deadline rows the instance meets on its default selections: A01-A05,
A07, A08 (kit-verify and the eight `test:docs` document rows), A12, A14,
A15-A16 (inside A02). None is settable.

## Class A: gate runner (suites, structural children, test cases)

The suite timer: `executeSuite` (`scripts/test-runner.mjs:1205-1735`) starts a
deadline record (`:1258`) and a timer (`:1421-1425`); on expiry it marks
`timedOut`, sends SIGTERM to the task's process group, SIGKILL 1 s later and
force-finishes 100 ms after that (`:1399-1408`); the row gets exit code 1,
`failureKind: "timeout"` and "Suite X timed out after …" (`:1709-1734`). The
bound passed is `row.timeoutMs ?? 900_000` (`:3284`; also `:1208`, `:1983`).
No instance setting, environment variable or multiplier reaches it.

| ID | Location | Sites | Value | What it bounds | When exceeded | Instance can change it today | Ships | Class |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| A01 | scripts/test-runner.mjs:554 | 1 | 30,000 ms | `format` structural task: `npm run format:check --silent` (Prettier over the checkout) | Killed as above; structural failure: every other task is recorded unexecuted with "Required format structural preflight failed…" and the gate returns (`:2104-2116`); `--keep-going` does not bypass (`:2087-2088`) | none | yes | A |
| A02 | scripts/test-runner.mjs:559 | 1 | 30,000 ms | `configuration-root` structural task: one `node --test` process over `scripts/test-configuration-root.mjs` and the `scripts/test-features.mjs` it imports (two of its cases are Git and lifecycle fixtures, part c) | Same as A01: all later tasks skipped with "Required configuration-root structural preflight failed. Repair the named failure and rerun this command." | none | yes | A |
| A03 | scripts/test-runner.mjs:564 | 1 | 30,000 ms | `registrations` structural task (`check-registrations.mjs`) | Same as A01 | none | yes | A |
| A04 | scripts/test-runner.mjs:568 | 1 | 30,000 ms | `declarations` structural task (`structural-checks.mjs declarations`, imports `test-runner.mjs` and expands tasks) | Same as A01 | none | yes | A |
| A05 | scripts/test-runner.mjs:572 | 1 | 120,000 ms | `generated` structural task: the generated-artifact checks run serially (`generated-artifacts.mjs:283-291`): 8 in an instance (runtime = `launchpad verify`, harness, meta, lineage, index, release-surfaces, siblings, publication), 17 in core | Same as A01 | none | yes | A |
| A06 | scripts/test-runner.mjs:577 | 1 | 30,000 ms | `git-surface` structural task (core only) | Same as A01 | none | file ships; task not run in an instance (`generated-artifacts.mjs:7-26`, row marked core-only) | A |
| A07 | scripts/test-runner.mjs:581 | 1 | 10,000 ms | `host` structural task: Node/Git engine judgment, memory-pressure sample, file-events daemon sample, lane memory; also where the dispatch bound refuses (`:3235-3262`) | Same as A01 | none | yes | A |
| A08 | scripts/test-runner.mjs:1208, :1983, :3284 | 1 | 900,000 ms default | Every row with no `timeoutMs`: in an instance `kit-verify` (`launchpad verify`, `:529-537`) and the `test:docs` rows license-surfaces, docs-check, terms, harness-context, plan-refutation-current, plan, reader-profiles, entropy; every `--only` row | Killed; a failed kit-verify returns before any later task (`:2130`); otherwise the first failure stops admission and the rest read "Not started after X failed" (`:2080-2083`, `:2225-2236`) unless `--keep-going` | none | yes | A |
| A09 | scripts/test-runner.mjs:2413 | 1 | 900,000 ms | Each file task of the expanded `launchpad` and `target-worktree` rows | As A08 | none | yes (target-worktree runnable by `--only` in an instance; launchpad core-only) | A |
| A10 | scripts/test-runner.mjs:1401-1408 | 1 | 1,000 ms then 100 ms | SIGTERM-to-SIGKILL escalation and forced finish after a timeout or stop | Process group SIGKILLed; row finished without its pipes | none | yes | A |
| A11 | scripts/test-runner.mjs:1188-1189, :1604-1616 | 1 | 50 × 20 ms | Wait for the host guard's incident record after an unexplained SIGKILL | Row classified without the record | none | yes | A |
| A12 | scripts/lib/generated-artifacts.mjs:38 (applied :160-172, :247) | 1 | 30,000 ms each | Each generated-artifact child check of A05 | spawnSync kills the child; row `timedOut`, exit 1, so A05 fails; `npm run sync` refuses to regenerate a timed-out artifact (`:185-187`) | none | yes | A |
| A13 | scripts/lib/generated-artifacts.mjs:54 (applied :279) | 1 | 120,000 ms | Core's runtime writer (the build) when the compiled runtime is stale | Build exit reported; structural check judges | none | file ships; core path only (`:273-274`) | A |
| A14 | scripts/license-surfaces.mjs:132 | 1 | 30,000 ms per manifest | `npm publish --dry-run --offline` per package manifest, serially, inside the `license-surfaces` row of `test:docs` | Rule false (`:148`), the row fails, the document gate stops admitting tasks | none | yes | A |
| A15 | scripts/test-configuration-root.mjs:270 | 1 | 5,000 ms | Case "WO-184 criterion 10: a configuration FIFO refuses promptly by path": a `node` child loading `config.mjs` | `run.status` null and `run.error` set: assertions `:274-277` fail the case | none | yes; runs in every instance selection | A |
| A16 | scripts/test-configuration-root.mjs:1889 | 1 | 300,000 ms case timeout | Case "worktree start and finish use the configured roots" | node:test fails the case; unreachable in a gate, where A02's 30 s fires first | none | yes | A |
| A17 | scripts/test-derived-orders.mjs:618 | 1 | 1,000 ms | Script-actor episode running `node -e` | Episode times out; case fails | none | yes (`--only derived-orders`) | A |
| A18 | scripts/test-work-orders.mjs:1292, 1314 | 2 | 12,000 ms | Fixture child commands | Case fails | none | yes (work-orders-fixtures, `--only`) | A |
| A19 | scripts/test-codex-continuation.mjs:70 | 1 | 15,000 ms | Fixture hook child | Case fails | none | yes (`--only`) | A |
| A20 | scripts/test-target-worktree-publish.mjs:122 | 1 | 60,000 ms | Fixture child | Case fails | none | yes (`--only target-worktree`) | A |
| A21 | scripts/test-target-worktree-start.mjs:86, 94, 98, 106, 114, 118, 126, 138, 142 | 9 | 5,000 ms (98: 150 ms, deliberate) | Fixture target-gate command declarations | Fixture gate command killed; case expectations | none | yes (`--only target-worktree`) | A |
| A22 | scripts/test-target-worktree-release.mjs:100 | 1 | 5,000 ms | Fixture target-gate command | As A21 | none | yes | A |
| A23 | scripts/lib/target-worktree-fixture.mjs:246 | 1 | 5,000 ms | Shared fixture target-gate command | As A21 | none | yes | A |
| A24 | scripts/test-portfolio.mjs:489; scripts/test-resident-bind.mjs:1278 | 2 | 20,000 ms | Actor specs for fixture discovery and probe scripts | Episode timeout; case fails | none | yes (`--only`) | A |
| A25 | scripts/test-drive.mjs:441, 2756, 2898, 2926, 2985, 3145, 3265, 3311, 3459, 3498, 3569, 3643, 3804, 3890, 3941, 3969, 4219, 4265, 4280, 4506, 4561, 4777, 5040, 5055, 5100, 5164, 5199, 5220, 5252, 5289 | 30 | 5,000 ms (2985: 10 s; 5040: 30 s; 5055: 15 s) | `launchPhase` bounds on fixture `node` workers (two spot-checked at 2756, 5252) | Worker killed; case fails | none | yes; row harness-fixtures is core-only | A |
| A26 | scripts/test-harness.mjs:432, 2244, 4157, 6522, 6576, 6579, 9679, 10079, 10322, 10407, 11277, 17276, 17384, 22862, 23296 | 15 | 30 s; deadlineLimit(1 s, 20 s); deadlineLimit(5 s, 60 s); 20 s; case 300 s; startDeadline 300 s; deadlineLimit 20 s (×5); deadlineLimit(1 s, 5 s); 20 s (×2) | Fixture children, hook barriers and one case | Case fails | none (deadlineLimit scales only by declared gate load) | yes; core-only row | A |
| A27 | scripts/test-harness.mjs:11093, 11228, 16283, 16750 | 4 | ≤ 2 × 16,300 ms; ≤ 2 × 8,100 ms; < 1,000 ms; < deadlineLimit(1,000, 10,000) | Timing assertions on measured durations | Assertion fails the case | none | yes; core-only row | A |
| A28 | scripts/test-temporary-roots.mjs:3555 | 1 | < budget + 250 ms | Timing assertion on a prune stop | Case fails | none | yes; core-only (via test-harness.mjs) | A |
| A29 | scripts/test-launchpad-update.mjs:512 | 1 | < 9,000 ms | Timing assertion on a read and fetch | Case fails | none | yes; core-only | A |
| A30 | scripts/test-gate-followups.mjs:284, 329, 403, 893, 1251, 1261, 1276 | 7 | 30 s default; 60 s; 30 s; workMs < durationMs - 100; case 120 s; 60 s; 60 s | Fixture children, one assertion, one case | Case fails | none | yes; core-only (via process-debt) | A |
| A31 | scripts/test-process-debt.mjs:3580, 3587, 10270, 11513, 11801, 11994, 12271, 14040 | 8 | 30 s, 30 s, 10 s, 20 s ×4, 30 s | Fixture children | Case fails | none | yes; core-only | A |
| A32 | scripts/test-sync.mjs:705 | 1 | 600,000 ms case timeout | "the real inventory checks stale artifacts…" | Case fails | none | yes; core-only | A |
| A33 | scripts/test-vertical.recovery.mjs:1278 | 1 | 60,000 ms case timeout | Browser witness cancellation case | Case fails | none | yes; core-only | A |
| A34 | scripts/test-vertical-judgment.mjs:362 | 1 | settle 60,000 ms | Fixture settle limit | Case expectation | none | yes; core-only | A |
| A35 | scripts/test-target-harness.mjs:132, 495, 544 | 3 | 10,000 ms | Fixture children | Case fails | none | yes; core-only | A |
| A36 | scripts/test-workstream-pilot.mjs:72, 251 | 2 | 240,000 ms; 5,000 ms | Fixture child; fixture target-gate command | Case fails | none | yes; core-only | A |
| A37 | scripts/test-authority-probe.mjs:51; scripts/test-harness-probe.mjs:512 | 2 | 20,000 ms; 30,000 ms | Fixture children | Case fails | none | yes; core-only | A |
| A38 | scripts/test-launchpad-export.mjs:820, 979 | 2 | 300,000 ms | Export and install children | Case fails | none | yes; core-only | A |
| A39 | scripts/test-docs-check.mjs:4140 | 1 | 2,000 ms | Fixture child | Case fails | none | yes; core-only | A |
| A40 | scripts/test-git-floor.mjs:541 | 1 | 20,000 ms | Fixture Git child | Case fails | none | yes; core-only (runner-fixtures) | A |
| A41 | scripts/test-review-worker.mjs:2174 | 1 | 60,000 ms | Fixture worker process | Case fails | none | yes; core-only | A |
| A42 | scripts/test-launchpad-planning.mjs:1904 | 1 | 5,000 ms | Fixture target-gate command | Case expectation | none | yes; core-only | A |
| A43 | scripts/lib/launchpad-fixture.mjs:604 | 1 | 300,000 ms | `npm ci --offline` of the warm export in launchpad fixtures | Fixture setup fails | none | yes; core-only rows | A |
| A44 | scripts/lib/copilot-qualification.mjs:78, 83 | 2 | 30,000 ms | Copilot qualification fixture children and Git | Fixture fails | none | yes | A |
| A45 | scripts/test-fixture-temp-root.sh:343 | 1 | 15,000 ms (startDeadline) | Signal-cleanup wait | Case fails | none | yes (`--only`, `--machinery`) | A |
| A46 | scripts/fixtures/vertical/recovery.mjs:73, 84; scripts/fixtures/authority-effect.mjs:29, 63, 113; scripts/fixtures/drive-live.mjs:214, 229 | 7 | 30 s; 5 s; 10 s; socket 3 s; 15 s; qualification timeout; 15 s | Fixture programs | Fixture reports failure | none | yes | A |
| A47 | scripts/probes/local-runner-smoke.test.mjs:69, 263; local-model-transport-smoke.test.mjs:107, 111; local-model-role-qualification.test.mjs:430; local-runner-load.test.mjs:126 | 6 | 50 ms; 40 ms; 500 ms; 2,000 ms; 5,000 ms; < 200 ms | Deliberate bounds against loopback doubles | Case fails | none | yes; local-runner-double core-only | A |
| A48 | corpus/mutation/wo108-selftest.test.mjs:299 | 1 | 200 ms | Self-test of mutate.mjs's timeout path | Case expectation | none | yes (TEST_SUPPORT_FILES) | A |
| A49 | scripts/test-runner.test.mjs:222, 901, 3450, 3723, 3759, 3815, 6430, 9124, 10324; scripts/test-gate-deadlines.mjs:161, 172; scripts/test-host-guard.test.mjs:335, 2413 | 13 | 60 s, < 5 s, 60 s, < 4 s, < 10 s, < 2.5 s, 120 s, < 60 s, 15 s; 50 ms ×2; < 5 s, 10 s | Fixture children and timing assertions | Case fails | none | **no** (KIT_FILES.excluded) | A |
| A50 | corpus/harness/wo107-schema.test.mjs:449, 470; corpus/harness/wo102-generators.test.mjs:344; corpus/harness/wo107-bounded.mjs:26, 37 | 5 | 30 s ×2; 20 s; 2 s ×2 | Corpus children | Case fails | none | **no** (not in TEST_SUPPORT_FILES) | A |

## Class B: lifecycle and command limits

| ID | Location | Sites | Value | What it bounds | When exceeded | Instance can change it today | Ships | Class |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| B01 | scripts/sync.mjs:125 | 1 | 120,000 ms | `npm run sync`: the format check and write | That artifact reported unavailable; not regenerated | none | yes | B |
| B02 | scripts/harness.mjs:268-292 | 1 | 1,200 s default, 3,600 s maximum | `harness evidence --wait` on the worktree's active gate | Prints `{"run":null}`, exit 2 | per-invocation `--timeout <seconds>` only | yes | B |
| B03 | packages/skeleton/src/harness-host.ts:5023 | 2 | 900,000 ms (`npm test`); 150,000 ms (`git diff --check`) | `node scripts/harness.mjs evidence`: the final-evidence gate it spawns | Child killed; check fails; evidence exit 1 (`harness.mjs:370-375`) | none | yes (compiled skeleton) | B |
| B04 | packages/skeleton/src/gate-evidence.mjs:425, 465-468 | 1 | 20,000 ms | `harness evidence --stop`: wait for active gate runs to end | "Stop requested; still running…" (`harness.mjs:330-334`) | none | yes (build-free module) | B |
| B05 | scripts/lib/bounded-command.mjs:18, 71-74 | 2 | 900,000 ms default; 21,600,000 ms for a complete selection | `node scripts/harness.mjs bounded -- <cmd>` (the probe wrapper); also the target gate (B06) | Task killed (A10 path), `failureKind: timeout`, exit 1 | per-invocation `--timeout-seconds 1..21600` only (`:37-52`) | yes | B |
| B06 | scripts/lib/config.mjs:808-820 (applied scripts/lib/target-gate.mjs:152-154) | 1 | per command, required | A target repository's gate commands | Bounded-command timeout; row exit 1 | **yes**: `dotln.config.json` `repositories.<id>.gate.commands.<name>.timeoutMs` (positive safe integer, required) | yes | B |
| B07 | scripts/lib/process-budget.mjs:117-155, 199-219; enforced scripts/lib/dispatch-bound.mjs:392-418, 452-503 | 1 | `"local-median"` = max(4 × local median of completed phase attempts, 8 h); template `scripts/kit/budgets.template.json` sets it for executor, repair, verifier, reviewer | Worked time (elapsed less idle) of a role dispatch | `DOTLN_DISPATCH_BOUND` refusal of a complete gate (`test-runner.mjs:3235-3262`), a bounded probe (`bounded-command.mjs:58-59`) and a worker launch; stop recorded | **yes**: `docs/control/budgets.json` `dispatches.<role>.wallClockMs` (number, `null`, or `"local-median"`); one dispatch via `npm run resume -- accept-overrun wallClockMs --ceiling <value\|unlimited>`; the 4× and 8 h are fixed | yes | B |
| B08 | scripts/lib/dispatch-bound.mjs:187 | 1 | 10 min | Idle-gap threshold: only gaps after a turn end longer than this are subtracted from worked time | Shorter gaps count toward B07 | none | yes | B |
| B10 | scripts/lib/drive-session.mjs:70 | 1 | 30,000 ms | Drive's canonical `resume status --json` read | "canonical status refused" | none | yes | B |
| B11 | scripts/lib/drive-session.mjs:1041 | 1 | 1,000 ms | Acquiring the per-order drive host lock (spawn of the host-lock helper and flock) | Refusal "Another drive of WO-NNN is already running in this launchpad" (`:1088-1092`) | none | yes | B |
| B12 | scripts/lib/drive-route.mjs:237, 247 | 2 | 10,000 ms | Git merge-base and show for the drive route | false / thrown | none | yes | B |
| B13 | scripts/lib/drive-route.mjs:507, 510 | 2 | 60,000 ms; 300,000 ms | Merged-base remote lookup and history fetch | Fetch failure named in the stop | none | yes | B |
| B14 | scripts/lib/github-repository.mjs:297 (used :404-410, launchpad.mjs:3356-3376) | 1 | 600,000 ms | Fetch through a host lane (`launchpad update --finish`, close fetches) | Refusal with `boundMs`: "update --finish refused: reading origin main passed its bound…" | per-invocation `launchpad update --finish --fetch-timeout <seconds>` only (`launchpad.mjs:3543-3553`) | yes | B |
| B15 | scripts/lib/github-repository.mjs:300 (used launchpad-publish.mjs:164) | 1 | 60,000 ms | Remote branch-tip read by the publish helper and the drive lookup | Publish refused | none | yes | B |
| B16 | scripts/release.mjs:745 | 1 | 60,000 ms | Release close: `git ls-remote origin main` reachability | `closeBlocker("host-denied")` refusal | none | yes | B |
| B17 | scripts/lib/release-close-handoff.mjs:34 | 1 | 20,000 ms | Origin tag read for the close's kind | Kind `self-undecided` (degrades) | none | yes | B |
| B18 | scripts/lib/dispatch-bound.mjs:728 | 1 | 60,000 ms | Pending release-close recording (`resume release-close` child) | Not recorded; refusal text | none | yes | B |
| B19 | scripts/lib/temporary-prune-summary.mjs:12 (read :54-70; applied refute-plan.mjs:495, release.mjs:2948, harness-prune.mjs:1273) | 1 | 1,800,000 ms | Routine prune at plan start and release close | Prune stops between items, prints what remains; the command continues | **yes**: `budgets.json` `prune.startBudgetMs` (`null` = no bound; invalid = default with advisory) | yes | B |
| B20 | scripts/lib/temporary-prune.mjs:78 | 1 | 1,000 ms | Progress floor of a bounded prune | — | none | yes | B |
| B21 | scripts/lib/harness-prune.mjs:180 | 1 | 60,000 ms | `gh release list` in the prune | "release listing unavailable" | none | yes | B |
| B22 | scripts/lib/harness-prune.mjs:445 | 1 | 10,000 ms | `lsof` open-path observation | null; legacy roots kept | none | yes | B |
| B23 | scripts/work-orders.mjs:636 | 1 | 10,000 ms | Target-fact Git reads during index generation | Facts `unknown` | none | yes | B |
| B24 | scripts/work-orders.mjs:1453 | 1 | 30,000 ms | `work-orders index --check` reading Preflight suites (child imports `test-runner.mjs`) when orders declare Preflight tokens | Throws "Preflight suites cannot be read…"; the index check, and so A05, fails | none | yes | B |
| B25 | scripts/lib/work-order-cards.mjs:75, 87-88 | 1 | 120,000 ms, SIGKILL | Resident/console card read (`work-orders index --json`) | Work orders reported unavailable | none | yes | B |
| B26 | scripts/resume.mjs:1555; scripts/lib/area-notes.mjs:257 | 1 | 10,000 ms total | Commits-since counts in the resume briefing's area notes | `unknown` | none | yes | B |
| B27 | scripts/lib/planning-conditions.mjs:516, 563 | 1 | 55,000 ms (300,000 with `--slow`) | Planning-conditions listing | Remaining rows "listing wall budget exhausted" | per-invocation `--slow` only | yes | B |
| B28 | scripts/discover.mjs:80, 90 | 2 | 5,000 ms each | `npm run discover`: harness `--version` and `--help` | Throws "Harness version probe failed" / "Harness selector probe failed" | none | yes | B |
| B29 | scripts/lib/host-doctor.mjs:52-56 (used :90, :185) | 1 | 10,000 ms | `npm run doctor`: Git reads and agent-CLI `--version` | ETIMEDOUT rethrown (`:186-188`); downstream handling **unverified** | none | yes | B |
| B30 | scripts/lib/paths.mjs:269 | 1 | 5,000 ms | Nested repository inspection (scratch judgment) | Throws "Repository inspection failed" | none | yes | B |
| B31 | scripts/lib/worktree-material.mjs:211 | 1 | 5,000 ms | Nested repository facts for removal records | null | none | yes | B |
| B32 | scripts/lib/target-worktrees.mjs:47 | 1 | 5,000 ms | `/bin/pwd -P` identity at target worktree start/selection | Refusal "directory is unreadable" | none | yes | B |
| B33 | scripts/lib/vertical-runtime.mjs:132 | 1 | 5,000 ms | Directory identity in the vertical | undefined; caller's handling **unverified** | none | yes | B |
| B34 | scripts/lib/harness.mjs:1162, 1172 | 2 | 10,000 ms | Target harness emit: `git check-ignore` | "target ignore observation unavailable" | none | yes | B |
| B35 | scripts/lib/executor-handoff.mjs:112 | 1 | 60,000 ms | Codex dispatch writer reservation child | Throws | none | yes | B |
| B36 | scripts/lib/vertical-primitives.mjs:76, 273-315 | 1 | 900,000 ms (poll 15,000 ms) | Vertical: wait for declared automated review checks | Unsettled "did not finish" | none (only a caller-passed `external.settle`) | yes | B |
| B37 | packages/skeleton/src/discovery.ts:328-329 | 1 | 5,000 ms, SIGKILL | Product discovery check commands (the case WO-280 investigates) | "check did not complete within its bound" | none | yes (compiled skeleton) | B |

(B09 was moved to D23. The drive record that carries the applied bound, `drive-session.mjs:565, 791`, is not a separate limit. IDs are not renumbered.)

## Class C: hook limits

| ID | Location | Sites | Value | What it bounds | When exceeded | Instance can change it today | Ships | Class |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| C01 | packages/compiler/src/harness.ts:1618-1622 → .claude/settings.json:50, 60, 70, 75, 87, 97, 109, 120, 132, 154, 165 | 1 generator (11 registrations) | 15 s | Every Claude hook: PreToolUse (4 hooks), PostToolUse (2), PermissionDenied, SubagentStop, PostToolUseFailure, SessionStart, Stop. Copilot reuses this registration | The host cancels the hook. Effect is host-defined; the repository records Copilot's reference as "hook timeouts as fail-open" (docs/AI-HARNESS-SECURITY.md:1045-1046); Claude Code's behavior is **unverified** here | none (an instance fragment may add its own hooks with their own `timeout`, scripts/lib/build-overlay.mjs:324-338, but cannot change these) | yes (emitted) | C |
| C02 | packages/compiler/src/harness.ts:1618-1622 → .claude/settings.json:143 | 1 | 600 s | UserPromptSubmit `session.mjs` (room for C05) | As C01 | none | yes (emitted) | C |
| C03 | packages/compiler/src/harness.ts:1674 → .codex/hooks.json | 1 | 30 s | Codex continuation hooks (PostCompact, SessionStart, Stop, UserPromptSubmit) when Codex is elected | As C01 | none | yes (emitted when elected) | C |
| C04 | packages/compiler/src/harness.ts:1968 | 1 | 15 s | Target-worker PreToolUse hooks in a target worktree | As C01 | none | yes (emitted) | C |
| C05 | packages/compiler/src/harness.ts:251, 312 (embedded in every hook bundle, e.g. .claude/hooks/session.mjs:831, 892) | 2 | 120,000 ms per child (up to four children); 30,000 ms replay | Stale-main release-close recovery inside the UserPromptSubmit hook | Advisory "Release-close preparation withheld…"; no dispatch | none | yes (emitted) | C |
| C06 | packages/skeleton/src/harness-host.ts:893 | 1 | 10,000 ms | Hook Git observations | Throws "Git host observation unavailable"; hook's handling **unverified** | none | yes (compiled) | C |
| C07 | packages/skeleton/src/harness-host.ts:1052 | 1 | 10,000 ms | `resume status --json` from a hook | Non-zero result; handling **unverified** | none | yes | C |
| C08 | packages/skeleton/src/harness-host.ts:1154 | 1 | 10,000 ms | `resume briefing` from a hook | Briefing unavailable (**unverified**) | none | yes | C |
| C09 | packages/skeleton/src/harness-host.ts:1436 | 1 | 12,000 ms | Lifecycle command the prompt hook runs for a dispatch phrase (`resume <action>`) | Lifecycle result failure (**unverified**) | none | yes | C |
| C10 | packages/skeleton/src/harness-host.ts:2451 | 1 | 10,000 ms | `git config` read for the `gh` fork refusal | Throws | none | yes | C |
| C11 | packages/skeleton/src/harness-host.ts:2938 | 1 | 10,000 ms | `git check-ignore` screen of `--body-file` | Withheld | none | yes | C |
| C12 | packages/skeleton/src/harness-host.ts:2997 | 1 | 5,000 ms | `ps` process table | Empty table = unknown | none | yes | C |
| C13 | packages/skeleton/src/harness-host.ts:3063 | 1 | 1,000 ms | `lsof` on the verified claude ancestor | Executable path unresolved | none | yes | C |
| C14 | packages/skeleton/src/harness-host.ts:3095 | 1 | 5,000 ms | `claude --version` for the session readback | Version unavailable | none | yes | C |
| C15 | packages/skeleton/src/harness-host.ts:6286 | 1 | 10,000 ms | Order-worktree grant child | "recorded order worktree roots unavailable"; that grant withheld | none | yes | C |
| C16 | packages/skeleton/src/harness-host.ts:7861 | 1 | 12,000 ms | `operator override: off` acceptance recording | Not recorded (**unverified**) | none | yes | C |
| C17 | packages/skeleton/src/subagent-budget.ts:227-238 | 1 | 50 × 10 ms | Subagent counter lock | Throws "counter lock busy or abandoned" | none | yes | C |
| C18 | packages/compiler/src/codex-continuation.mjs:119, 392, 422 | 3 | 3,000; 15,000; 3,000 ms | Codex continuation hook: Git root, `resume status`, writer child | Lane null / continuation skipped | none | yes (build-free) | C |

## Class D: worker and external CLI launch limits

| ID | Location | Sites | Value | What it bounds | When exceeded | Instance can change it today | Ships | Class |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| D01 | packages/skeleton/src/worker-protocol.ts:55 | 1 | 180,000 ms | Default worker episode (`WORKER_TIMEOUT_MS`) | `WorkerFailure("deadline-exceeded")`, process killed (worker-transport.ts:228-237) | none | yes (compiled) | D |
| D02 | packages/skeleton/src/worker-protocol.ts:53-54 | 2 | heartbeat 1,000 ms; lease 5,000 ms | Worker lease renewal | Status reads `lease-expired` (worker-status.ts:95-99) | none | yes | D |
| D03 | packages/skeleton/src/change-review-protocol.ts:53 | 1 | 3,600,000 ms | Change-review worker | deadline-exceeded | none | yes | D |
| D04 | packages/skeleton/src/entropy-review-protocol.ts:18, 22 | 2 | 2,400,000; 1,800,000 ms | Entropy review and refutation workers | deadline-exceeded | none | yes | D |
| D05 | packages/skeleton/src/plan-refutation-protocol.ts:134; loadouts/plan-refuter.ts:135 | 2 | 1,200,000 ms | Plan refutation worker and its authority window | deadline-exceeded / authority expiry | none | yes | D |
| D06 | packages/skeleton/src/verification-protocol.ts:100 | 1 | 600,000 ms | Feedback verifier worker | deadline-exceeded | none | yes | D |
| D07 | packages/skeleton/src/mission-check-protocol.ts:10; loadouts/mission-check.ts:128 | 2 | 600,000 ms | Mission-check worker and authority window | deadline-exceeded | none | yes | D |
| D08 | packages/skeleton/src/vertical-judgment-protocol.ts:21 | 1 | 600,000 ms | Vertical judgment worker | deadline-exceeded | none | yes | D |
| D09 | packages/skeleton/src/worker-transport.ts:215 | 1 | 9,000 ms | SIGTERM-to-SIGKILL escalation for a worker | SIGKILL | none | yes | D |
| D10 | packages/skeleton/src/worker-transport.ts:1270 | 1 | 5,000 ms | Git reads for writer workers | Caught fallback | none | yes | D |
| D11 | packages/skeleton/src/worker-transport.ts:1546 | 1 | 5,000 ms | Worker CLI `--version` | Advisory; launch continues | none | yes | D |
| D13 | packages/skeleton/src/actor-contract.ts:213-215 | 1 | ≤ 180,000 ms | Actor spec validation | Spec refused | none | yes | D |
| D14 | packages/skeleton/src/script-episode.ts:92 | 1 | spec's `timeoutMs` | Script-actor episode | `stop("timeout")` | caller-supplied in code; no instance key found | yes | D |
| D15 | packages/skeleton/src/local-model-transport.ts:224 | 1 | default 180,000 ms | Local model transport | deadline | constructor option; no shipped caller found | yes | D |
| D16 | packages/skeleton/src/source-change-worktree.ts:60, 281, 470, 599, 616, 645, 744, 791, 819, 868, 889, 991 (15 s); 161, 349, 933 (5 s); 557 (60 s); 1052 (180 s, sandbox-exec) | 17 | as listed | Source-change worker's Git, identity, `node` and sandboxed target check | Error; candidate refused / check failed | none | yes | D |
| D17 | packages/skeleton/src/source-change-host.ts:547-558, 661 | 2 | 10,000 ms | Source-change worker settlement | "source-change worker settlement timed out" | none | yes | D |
| D18 | packages/skeleton/src/source-change-command.ts:248, 264; source-change-environment.ts:26, 62 | 4 | 5,000 ms | Branch and identity reads | Refusal | none | yes | D |
| D19 | packages/skeleton/src/verification-worktree.ts:41, 181-182 | 2 | 15,000 ms; 30,000 ms SIGKILL | Verification worktree Git; sandboxed check | Fails | none | yes | D |
| D20 | packages/skeleton/src/worker-worktree.ts:10; portfolio-host.ts:112; mission-check-source.ts:139 | 3 | 15,000 ms | Git reads | Fails | none | yes | D |
| D21 | scripts/lib/drive-transport.mjs:264-269 | 1 | 5,000 ms | Wait for a driven native worker's end | "Native worker end is unobserved…" | none | yes | D |
| D22 | scripts/lib/drive-process.mjs:18 | 1 | 5,000 ms | Driven worker SIGTERM-to-SIGKILL | SIGKILL | none | yes | D |
| D23 | scripts/lib/drive-session.mjs:416-428; drive-transport.mjs:16-41, 141 | 1 | min(`drivenPhaseTimeoutMs`, role `wallClockMs`, `DOTLN_DRIVE_DEADLINE_AT`) | Each driven phase attempt (`node scripts/drive.mjs`) | `drive-deadline-exhausted` refusal; worker killed | **yes**: `budgets.json` `drivenPhaseTimeoutMs` (`null` = none, max 2,147,483,647), `dispatches.<role>.wallClockMs`; env `DOTLN_DRIVE_DEADLINE_AT` | yes | D |
| D24 | scripts/probe-worker-hosts.mjs:38 | 1 | 15,000 ms | `npm run probe:workers` help capture | Probe fails | none | yes | D |
| D25 | scripts/harness-probe.mjs:151, 220 | 2 | hook 10 s; 240,000 ms | Harness probe sessions | Probe fails | none | yes | D |
| D26 | scripts/harness-live-suite.mjs:52; scripts/harness-live-smoke.mjs:368 | 2 | 260,000; 240,000 ms | Live smokes | Fails | none | yes | D |
| D27 | scripts/probe-codex-effort.mjs:54 | 1 | 90,000 ms | Codex effort probe | Fails | none | yes | D |
| D28 | scripts/target-worker-smoke.mjs:146 | 1 | 180,000 ms | Target worker smoke | Fails | none | yes | D |
| D29 | scripts/lib/subagent-probe.mjs:26, 130 | 2 | 240,000 ms; hook 10 s | Probe sessions | Killed, `timedOut` | none | yes | D |
| D30 | scripts/lib/subagent-stop-probe.mjs:185 | 1 | hook 10 s | Probe settings | — | none | yes | D |
| D31 | scripts/lib/agent-identity-probe.mjs:110, 134, 218-246 | 3 | hook 10 s ×2; 300,000 ms | Probe settings and session | Killed | none | yes | D |
| D32 | scripts/lib/copilot-probe.mjs:217, 682, 711 | 3 | hook 10 s; 5,000; 240,000 ms | Copilot probe | Fails | none | yes | D |
| D33 | scripts/lib/writing-worker-probe.mjs:197, 220, 310, 363, 776, 840, 859, 894, 996, 1095, 1193, 1241, 1330 | 13 | hook 15 s ×2; 240 s; 240 s check; 120 s ×2; 20 s; 60 s; 5 s; 20 s; 180 s; 300 s; 120 s | Writing-worker probe | Fails | none | yes | D |
| D34 | scripts/lib/authority-probe.mjs:56-60, 131, 565, 636, 763, 889, 890, 927, 1469 | 9 | 120 min budget; 10 s; 120 s ×2; 5 s; 120 s + 30 s; 10 s; AbortSignal remaining | Authority probe | Fails | none | yes | D |
| D35 | scripts/probes/local-model-role-qualification.mjs:50, 1000, 1011, 1030, 1069, 1080, 1102, 1131, 1150, 1162, 1194 | 11 | 120 s; 30 s; 3 s ×2; 2 s; 10 s; 30 s; 120 s; 30 s ×2; 5 s | Local-model role qualification | Fails | none | yes | D |
| D36 | scripts/probes/local-model-transport-smoke.mjs:56, 87 | 2 | 2,000; 120,000 ms | Local-model transport smoke | Fails | none | yes | D |
| D37 | scripts/probes/local-runner-smoke.mjs:72, 198, 445, 453, 473, 490 | 6 | 30 s; 5 s idle wait; 2 s ×3; 30 s | Local runner smoke | Fails | none | yes | D |
| D38 | scripts/probes/local-runner-load.mjs:20, 67, 88, 205, 231, 301, 331 | 7 | 2 s ×5; run duration; min(...) | Local runner load | Fails | none | yes | D |

(D12 was moved to E34. `worker-transport.ts:148-150, 1612-1631` only selects among D01-D08 per request and is not counted separately. IDs are not renumbered.)

## Class E: other (host infrastructure, locks, evidence and console tooling)

| ID | Location | Sites | Value | What it bounds | When exceeded | Instance can change it today | Ships | Class |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| E01 | scripts/lib/host-resources.mjs:498 | 1 | 2,000 ms | Native process census (`host-footprint`) for every monitor sample and pressure sample (light and full) | Light census throws: every running task fails `monitor-unavailable` and is SIGKILLed (scripts/lib/process-monitor.mjs:48-56, test-runner.mjs:1796-1803); the `host` task fails | none | yes | E |
| E02 | scripts/lib/host-resources.mjs:315, 334 | 2 | 5,000 ms `top`; 2,000 ms `sysctl` | Footprint fallback after a full census fails | Fallback fails as E01; sysctl failures recorded unavailable | none | yes | E |
| E03 | scripts/lib/host-resources.mjs:147 | 1 | 2,000 ms | `getconf DARWIN_USER_TEMP_DIR` for the host state root (gate, probe, guard) | Throws; caller fails | none | yes | E |
| E04 | scripts/lib/host-resources.mjs:254 | 1 | 5,000 ms | `xcrun --show-sdk-path` before compiling a native helper (first use per host and per helper source digest) | `compilerFailure` thrown; `taskLauncher` throws; no gate task can start | none | yes | E |
| E05 | scripts/lib/host-resources.mjs:289 | 1 | 30,000 ms | `clang` compile of `host-lock` / `host-footprint` | As E04 | none | yes | E |
| E06 | scripts/lib/host-resources.mjs:456 | 1 | 2,000 ms | Descriptor capture at every task launch (`holdTaskDescriptors`, test-runner.mjs:1778) | Task fails `monitor-unavailable` before it runs (test-runner.mjs:1829-1833) | none | yes | E |
| E07 | scripts/lib/host-resources.mjs:562 | 1 | 3,000 ms | `ps` sample of the file-events daemon for the `host` task | Sample unavailable; judgment of unavailable **unverified** | none | yes | E |
| E08 | scripts/lib/host-lanes.mjs:193 | 1 | 2,000 ms | Lane-holder inspection reader | "Host process reader unavailable" | none | yes | E |
| E09 | scripts/lib/host-guard-state.mjs:79 | 1 | 5,000 ms | Host guard startup observation (`ensureHostGuard`, called by every gate and bounded probe) | Throws "Host guard startup observation unavailable"; the gate or probe fails before any task | none | yes | E |
| E10 | scripts/lib/host-guard-state.mjs:100 | 1 | 1,000 ms | SIGKILL of an unadopted guard child | SIGKILL | none | yes | E |
| E11 | scripts/lib/node-engines.mjs:114 | 1 | 10,000 ms | `git --version` | "Git did not run" refusal by the `host` task, `harness check`, `harness evidence` and every `npm test` selection (node-engines.mjs:139-145, test-runner.mjs:2839-2841) | none | yes | E |
| E12 | packages/skeleton/src/gate-evidence.mjs:1144-1157 | 1 | 5,000 ms | Gate-evidence record lock (`recordGateChecks`) | Throws "Deadline gate-evidence:record-lock hit…"; the row is not recorded | none | yes (build-free) | E |
| E13 | packages/skeleton/src/gate-evidence.mjs:493 | 1 | 1,000 ms | `ps -o lstart` of a gate owner | null; signal-0 fallback | none | yes | E |
| E14 | packages/skeleton/src/writer-teardown.mjs:33 | 1 | 5,000 ms | `ps -o stat` for writer-reservation liveness | Unknown; reservation preserved | none | yes (build-free) | E |
| E15 | packages/skeleton/src/evidence-editions.mjs:264, 356 | 2 | 5,000 ms | Git object-format and blob reads for evidence projections | Throws (**unverified** downstream) | none | yes (build-free) | E |
| E16 | scripts/lib/codex-background.mjs:58 | 1 | 3,000 ms | `ps` for Codex background work | Empty table | none | yes | E |
| E17 | packages/beacons/src/beacon-io.mjs:87 | 1 | 5,000 ms | `/bin/pwd -P` identity for Beacon writes | `BeaconDirectoryIdentityError` | none | yes | E |
| E18 | packages/beacons/src/control-codebook.mjs:40 | 1 | 20 min | Beacon age | Reads "stale" | none | yes | E |
| E19 | scripts/lib/entropy-review.mjs:106 | 1 | 24 h | Entropy episode authority window | Authority expires | none | yes | E |
| E20 | packages/console/src/collect.ts:138 | 1 | deadlineLimit(17,200, 60,000) = 60 s outside a gate | Console collection children | That source unavailable | none | yes (compiled) | E |
| E21 | packages/skeleton/src/resident-host.ts:48 | 1 | 60,000 ms | Console board snapshot | "board snapshot unavailable" | none | yes | E |
| E22 | packages/skeleton/src/console-loopback.ts:49, 52 | 2 | 2,000; 5,000 ms | Termination and pipe grace | Kill / close | none | yes | E |
| E23 | packages/skeleton/src/dotln.ts:102 | 1 | 15,000 ms | Vertical exit after a signal | `process.exit` | none | yes | E |
| E24 | packages/skeleton/src/actor-catalog.ts:24 | 1 | 2,000 ms | `sandbox-exec` availability probe | Unavailable | none | yes | E |
| E25 | packages/skeleton/src/feedback-selfhost.ts:109, 127, 139, 428, 485, 611; feedback-audit.ts:146, 238; feedback-boundary.ts:87 | 9 | 5 s (611 and audit 238: 30 s) | Feedback evidence tooling | Fails | none | yes (compiled) | E |
| E26 | packages/skeleton/src/verification-demo.ts:86, 109, 174; worker-demo.ts:45 | 4 | 15 s; 15 s; 5 s; 15 s | Demos | Fail | none | yes | E |
| E27 | corpus/mutation/mutate.mjs:115-147, 681, 778, 779 | 3 | per process; 120,000 ms; 2,700,000 ms run budget | Mutation evidence runs | Process killed; run stops | none | yes (TEST_SUPPORT_FILES) | E |
| E28 | scripts/evidence-resident-binding.mjs:29-31, 38 | 1 | 900,000 ms (+ cadence constants) | Resident binding evidence collector | Fails | none | yes | E |
| E29 | scripts/measure-lanes.mjs:119; scripts/measure-gates.mjs:219 | 2 | 150,000 ms; assertion `durationMs < timeoutMs` | Measurement tools | Fail | none | yes | E |
| E30 | scripts/benchmark-build-publication.mjs:82, 128; scripts/benchmark-beacon-contention.mjs:74, 121 | 4 | 5 s; 10 s; 30 s; promise deadline | Benchmarks | Fail | none | yes | E |
| E31 | scripts/lib/process-budget.mjs:229-237; scripts/lib/meta.mjs:2406-2418 | 1 | `limits.fastGateMs` (template `null`) | Per-open-order gate duration | Advisory only ("Advisory: process budget exceeded", process-budget.mjs:268-276) | **yes**: `budgets.json` `limits.fastGateMs` | yes | E |
| E32 | scripts/lib/process-budget.mjs:229-237 | 1 | `limits.passRefutationMs` (template `null`; core 120,000) | Validated only; grep found no enforcing reader | none observed | **yes** (key exists, read by nothing that enforces) | yes | E |
| E33 | packages/browser-evidence/src/processes.ts:12; index.ts:338, 374 | 3 | 5 s; 10 s ×2 | Browser evidence | Fail | none | **no** (package not carried) | E |
| E34 | packages/skeleton/src/worker-transport.ts:588-595 | 1 | 2 × max(D01-D08) = 4,800,000 ms | Age after which abandoned Codex episode homes are pruned | Removed | none | yes | E |

## Answers a to e

### a. The suite table and the structural skip

`node --input-type=module` import of `scripts/test-runner.mjs` printed the
82 declared rows; declaration lines are in the file.

| # | Suite | Decl. line | Phase / classes | In an instance | Core-only | timeoutMs | Bound applied |
|---|---|---|---|---|---|---|---|
| 1 | format | 548 | structural, document, preflight | every selection (structural) | no | 30000 | 30 s |
| 2 | configuration-root | 557 | structural, document, machinery | every selection (structural) | no | 30000 | 30 s |
| 3 | registrations | 563 | structural, document, machinery | every selection (structural) | no | 30000 | 30 s |
| 4 | declarations | 566 | structural, document | every selection (structural) | no | 30000 | 30 s |
| 5 | generated | 570 | structural, document | every selection (structural) | no | 120000 | 120 s |
| 6 | git-surface | 574 | structural, document | not carried | yes | 30000 | 30 s |
| 7 | host | 579 | structural, document | every selection (structural) | no | 10000 | 10 s |
| 8 | build | 584 | build, product | replaced by kit-verify (`launchpad verify`, no timeoutMs) | no | — | 900 s |
| 9 | release-surfaces | 589 | document, generated, preflight | dropped unless `--only` (judged inside `generated`) | no | — | 900 s |
| 10 | release-preparation | 596 | product | `--only` | no | — | 900 s |
| 11 | github-body | 597 | product | not carried | yes | — | 900 s |
| 12 | outward-lint | 600 | product | not carried | yes | — | 900 s |
| 13 | target-publish | 604 | product | not carried | yes | — | 900 s |
| 14 | target-worktree | 608 | product | `--only` (900 s per file, :2413) | no | — | 900 s |
| 15 | vertical | 622 | product | not carried | yes | — | 900 s |
| 16 | license-fixtures | 636 | product | not carried | yes | — | 900 s |
| 17 | license-surfaces | 639 | document, preflight | `test:docs` | no | — | 900 s |
| 18 | fixture-temp-root | 644 | machinery | `--only`, `--machinery` | no | — | 900 s |
| 19 | publication-fixtures | 645 | product | `--only` | no | — | 900 s |
| 20 | backup-intake | 646 | product | `--only` | no | — | 900 s |
| 21 | resume | 648 | product, preflight | not carried | yes | — | 900 s |
| 22 | resume-docs | 656 | document | not carried | yes | — | 900 s |
| 23 | launchpad | 663 | product | not carried | yes | — | 900 s |
| 24 | workstream-pilot | 697 | product | not carried | yes | — | 900 s |
| 25 | instance-history | 702 | product | not carried | yes | — | 900 s |
| 26 | launchpad-planning | 715 | machinery | not carried | yes | — | 900 s |
| 27 | launchpad-docs | 721 | document | not carried | yes | — | 900 s |
| 28 | beacon-portability | 728 | product | `--only` | no | — | 900 s |
| 29 | checkpoint | 735 | product | `--only` | no | — | 900 s |
| 30 | worktree | 737 | product | not carried | yes | — | 900 s |
| 31 | worktree-integration | 740 | product | not carried | yes | — | 900 s |
| 32 | release | 751 | product | not carried | yes | — | 900 s |
| 33 | work-orders-fixtures | 754 | product | `--only` | no | — | 900 s |
| 34 | publication | 755 | document, generated, preflight | dropped unless `--only` | no | — | 900 s |
| 35 | docs-check | 761 | document, preflight | `test:docs` | no | — | 900 s |
| 36 | terms | 771 | document, preflight | `test:docs` | no | — | 900 s |
| 37 | docs-check-fixtures | 779 | document | not carried | yes | — | 900 s |
| 38 | comment-labels | 786 | document, preflight | not carried | yes | — | 900 s |
| 39 | comment-labels-fixtures | 794 | document | not carried | yes | — | 900 s |
| 40 | index | 800 | document, generated, preflight | dropped unless `--only` | no | — | 900 s |
| 41 | siblings | 807 | document, generated, preflight | dropped unless `--only` | no | — | 900 s |
| 42 | siblings-fixtures | 815 | product | `--only` | no | — | 900 s |
| 43 | lineage | 820 | document, generated, preflight | dropped unless `--only` | no | — | 900 s |
| 44 | lineage-fixtures | 826 | document | not carried | yes | — | 900 s |
| 45-48 | kernel, compiler, skeleton, console | 831 | product | not carried | yes | — | 900 s |
| 49 | browser-evidence | 857 | product | not carried | yes | — | 900 s |
| 50-52 | kernel-docs, skeleton-docs, console-docs | 872 | document | not carried | yes | — | 900 s |
| 53 | adjacent-queue | 883 | product | `--only` | no | — | 900 s |
| 54 | evidence-sources | 884 | machinery | not carried | yes | — | 900 s |
| 55 | resident-bind | 887 | document | `--only` (no `instance` key) | no | — | 900 s |
| 56 | derived-orders | 890 | product | `--only` | no | — | 900 s |
| 57 | portfolio | 895 | product | `--only` | no | — | 900 s |
| 58 | codex-continuation | 903 | product | `--only` | no | — | 900 s |
| 59 | harness-probe | 904 | machinery | not carried | yes | — | 900 s |
| 60 | authority-grants | 915 | product | `--only` | no | — | 900 s |
| 61 | local-runner-double | 916 | document | not carried | yes | — | 900 s |
| 62 | authority-evidence | 936 | document, machinery, generated, preflight | not carried | yes | — | 900 s |
| 63 | harness-fixtures | 942 | machinery (3 shards) | not carried | yes | — | 900 s |
| 64 | harness | 953 | document, machinery, generated, preflight | dropped unless `--only` (`instance: "runtime"`, but generated) | no | — | 900 s |
| 65 | harness-context | 960 | document, machinery, preflight | `test:docs` | no | — | 900 s |
| 66 | harness-evidence | 967 | document, machinery, generated, preflight | not carried | yes | — | 900 s |
| 67 | plan-refutation | 972 | machinery | not carried | yes | — | 900 s |
| 68 | plan-refutation-current | 979 | document | `test:docs` | no | — | 900 s |
| 69 | wo107-schema | 984 | machinery | not carried | yes | — | 900 s |
| 70 | artifact-corpus | 988 | document | `--only` | no | — | 900 s |
| 71 | artifact-evidence | 991 | document, machinery, generated, preflight | not carried | yes | — | 900 s |
| 72 | verification-evidence | 997 | document, machinery, generated, preflight | not carried | yes | — | 900 s |
| 73 | feedback-evidence | 1003 | document, machinery, generated, preflight | not carried | yes | — | 900 s |
| 74 | mutation | 1009 | machinery | `--only`, `--machinery` | no | — | 900 s |
| 75 | runner-fixtures | 1010 | machinery | not carried | yes | — | 900 s |
| 76 | sync-fixtures | 1013 | machinery | not carried | yes | — | 900 s |
| 77 | process-debt | 1020 | machinery | not carried | yes | — | 900 s |
| 78 | meta | 1026 | document, machinery, generated, preflight | dropped unless `--only` | no | — | 900 s |
| 79 | plan | 1032 | document | `test:docs` | no | — | 900 s |
| 80 | reader-profiles | 1037 | document | `test:docs` | no | — | 900 s |
| 81 | reader-fixtures | 1044 | document | not carried | yes | — | 900 s |
| 82 | entropy | 1051 | document | `test:docs` | no | — | 900 s |

Instance selections, from the code (`test-runner.mjs:126-127`, `:2748-2794`)
and confirmed by `docs/KIT.md:2193-2199`: `npm test` and `npm test --
--review` run format, configuration-root, registrations, declarations,
generated, host, kit-verify; `npm run test:docs` adds license-surfaces,
docs-check, terms, harness-context, plan-refutation-current, plan,
reader-profiles, entropy. `--only X` runs the structural phase plus X.
Structural rows are never reused from an earlier pass
(`test-runner.mjs:2881`), and an instance selection reuses nothing
(`:2861-2868`).

The skip: the structural loop (`test-runner.mjs:2087-2117`) runs each
structural row serially with all lanes; on a non-zero exit (a timeout is
exit 1, `:1718-1725`) it finishes every task not yet finished as
`executed: false` with output `Required ${row.name} structural preflight
failed. ${row.name === "format" ? "Run npm run format, then rerun this
command." : "Repair the named failure and rerun this command."}` followed by
the failed row's output (`:2113`), and returns. The comment at `:2087-2088`
says a failed structural prerequisite is never bypassed by `--keep-going`; the
loop does not consult `keepGoing`.

### b. How budgets.json is read; existing scaling

Loaders (each reads `docPath(root, "control", "budgets.json")`):

- `readBudgets` (`scripts/lib/process-budget.mjs:103-253`): returns `null`
  when the file is absent. Requires `schemaVersion: 1`, `source`,
  `acceptances[]`. Validates `retention` (`validateRetention`),
  `subagentCap` and `drivenSessionCeiling` (null or non-negative safe
  integer), `drivenPhaseTimeoutMs` (null/undefined or 1..2,147,483,647),
  `spend.daily.{tokens,usd}` (`dailySpend`), `prune.startBudgetMs`
  (`pruneStartBudgetKey`), `dispatches.<role>.{tokens,costUsd,wallClockMs,
  completeRuns}` and `dispatches.executor.repair` for the seven roles
  (adding a router entry if absent), `limits.coldStartBytes.<role>`, and
  `limits.{fastGateMs, readCapBytes, sequenceBytes, prBodyBytes,
  passRefutationMs}`. `numberOrNull` (`:114-115`) admits `null` or a
  non-negative finite number; a missing `wallClockMs`/`completeRuns` becomes
  `null` (`:201`). `"local-median"` is resolved to max(4 × median of this
  instance's completed phase attempts, 8 h) (`:117-155`, `:202-216`).
- `memoryBudgets` (`scripts/lib/host-resources.mjs:167-207`) reads only
  `.memory` (`gateShare`, `hostShare`, `signalIntervalMs`,
  `footprintIntervalMs`, `outputTailBytes`) over defaults; ENOENT means
  defaults.
- `pruneStartBudget` (`scripts/lib/temporary-prune-summary.mjs:54-70`) reads
  only `prune.startBudgetMs`; a parse or shape error falls back to
  1,800,000 ms with an advisory.
- `paragraphWordsKey` (`process-budget.mjs:54-70`) is read by the document
  check only (`documents.paragraphWords`).

Treatment of `null`: no bound / unset everywhere it is checked —
`budgetVerdict` returns `unset` (`:256`), the dispatch standing drops a
`null` bound (`dispatch-bound.mjs:395`), `subagentCap: null` disables the cap
(`baseSubagentCap`, `dispatch-bound.mjs:86-87`; absent means 20),
`drivenPhaseTimeoutMs: null` means no phase timeout, `prune.startBudgetMs:
null` removes the prune bound, `documents.paragraphWords: null` turns the list
off.

Keys present today: core `docs/control/budgets.json` and the kit template
`scripts/kit/budgets.template.json` hold the same structure, except the
template has `spend.daily` and lacks `memory.basis`, `prune`, `documents`
and `decision`. No key bounds any gate suite, structural task, hook, worker
episode or host probe.

Scaling that exists:

1. `deadlineLimit(baselineMs, minimumMs, env)`
   (`packages/skeleton/src/gate-deadlines.mjs:35-49`) returns `minimumMs`
   standalone and max(minimum, baseline × 2 × concurrency) inside a gate task
   whose environment carries `DOTLN_GATE_LOAD_CLASS` (set by the runner,
   `scripts/lib/suite-evidence.mjs:94-97`). Its own comment: "A scheduler
   declaration, not a host-speed detector" (`:6-8`). Shipped callers: only
   `packages/console/src/collect.ts:138`; test callers in
   `scripts/test-harness.mjs`. The runner's suite deadlines do not use it.
2. The `"local-median"` dispatch wall clock adapts to the instance's own
   phase history (4× median, 8 h floor) — the only limit that grows on a
   slower host, and only after phases complete there.
3. Nothing else: no environment variable, configuration key or multiplier
   scales suite, case, hook, probe or child timeouts (grep for
   `TIMEOUT|DEADLINE|SCALE|MULTIPLIER|FACTOR` in `process.env` reads found only
   `DOTLN_DRIVE_DEADLINE_AT`, `DOTLN_GATE_MEASURE_DEADLINES` (logging) and the
   runner's own `DOTLN_GATE_LOAD_*`).

### c. Slow-by-construction cases

In `scripts/test-configuration-root.mjs` (whole file bounded by A02's 30 s):

- "a fixture launchpad with non-default roots drives the lifecycle"
  (`:1592-1885`): two `git init`s, a commit, a copy of
  `scripts/lib` and the control-copy fixture inputs, the Beacon fixture
  install, then about ten `node scripts/resume.mjs` processes (three refused
  `activate`s, `activate`, `implementation-ready`, `verify`,
  `verification-result`, `final-review`, `final-review-result`, `status
  --json`). No case timeout.
- "worktree start and finish use the configured roots" (`:1887-2067`, case
  timeout 300 s, moot): a bare origin, a clone, a commit and push, a copy of
  `scripts/lib`, `node scripts/worktree.mjs start` (creates a worktree and
  runs the fixture's bootstrap), five `resume.mjs` processes, a commit, a
  merge, a push, and `worktree.mjs finish`.

A static count of child launches per case (spawnSync / runGit / spawnGit /
lifecycle calls) puts these two far above the file's other cases, which are
mostly in-process loader checks; the next are "configured lineage and
planning consumers use the launchpad ledger" (`:1438`, five Git calls) and
"WO-073 criterion 3" (`:587`). `scripts/test-features.mjs`, imported into the
same process, launches no children.

Other test files with Git-repository or lifecycle fixtures (count of Git
init/clone/worktree-add spellings, then `resume.mjs` references):
`test-release.sh` 48/3, `test-harness.mjs` 46/30, `test-temporary-roots.mjs`
46/0, `test-worktree.sh` 41/10, `test-launchpad-planning.mjs` 33/3,
`test-worktree-integration.mjs` 24/1, `test-launchpad-update.mjs` 18/0,
`test-process-debt.mjs` 16/25, `test-target-worktree-close.mjs` 15/0,
`test-drive.mjs` 12/21, `test-configuration-root.mjs` 11/3,
`test-target-worktree-start.mjs` 10/9, `test-resume.sh` 6/55,
`test-checkpoint.sh` 2/13. Of these, only `test-configuration-root.mjs` is in
an instance's default selections; `test-target-worktree-*` and
`test-checkpoint.sh` are reachable by `--only`; the rest are core-only rows.

Dev-host timings on record: configuration-root 6.8 s ("25 of 25",
`docs/final-reviews/WO-252/FINAL-001.md:52`), 5.2 s
(`scripts/lib/gate-scheduling-baseline.json`, WO-222 samples), 8.75 s
(`docs/final-reviews/WO-075/FINAL-001.md:97`). Against 30 s that is 3.4× to
5.8× headroom on the development host.

### d. Does the document selection need configuration-root?

What runs: the structural phase is unconditional — `selected = [...structural,
...selected]` (`test-runner.mjs:2788-2794`) for every selection, document
included, and the six instance structural tasks run before the build and any
selected suite (`:2087-2117`). `classifySuite` marks every structural task
`document: true` (`:263-265`), so a document run counts it as its own.

What configuration-root checks (row `protects`, `:560-561`: "configuration
and control-plane source declarations hold before suites start"): the
`dotln.config.json` loader and its validation (roots, features,
repositories, target gate declarations, classes, follow-ups, contributions,
FIFO refusal), that no control-plane script under `scripts/` keeps a literal
document root or a second root derivation (`:1373`), and two end-to-end
lifecycle fixtures under non-default roots (part c). Its declared sources are
`scripts/` and `packages/skeleton/src/runtime-inputs.mjs`
(`scripts/lib/machinery-sources.mjs:331-336`), i.e. code, not documents.

Why it precedes a document-only run: WO-216-D004
(`docs/evidence/WO-216/decisions.md:83`) decided "Run format,
configuration-root, registrations, declarations, generated and host in that
order for every selection" so that no gate fails late on bookkeeping (the
order's title); product 07 §(structural phase)
(`docs/product/07-execution-guide.md:5524-5549`) restates it. Inference, not
a recorded decision: the document checks resolve every path through the
configuration loader (`docPath`), so a broken loader would misdirect them —
that justifies the loader cases, not the two lifecycle fixtures, whose
outcome no document check consumes. In an instance the scripts are kit files
whose bytes `kit-verify` checks against the manifest, so the configuration-root
cases re-test code that passed in core unless the instance changed a kit
file (inference from `launchpad.mjs:1606-1648`).

### e. Earlier things that stopped the work laptop or a fresh instance (committed documents only)

1. **Git floor above the laptop's Git.** v0.121.0 declared `engines.git
   >=2.40.0`; the laptop runs Git 2.31.0, so `harness check`, `harness
   evidence` and every `npm test` selection refused it — "the release made the
   laptop strictly worse" (`docs/planning/passes/git-2-31-support-and-fork-returns-2026-11-08.md:24-30, 38-72`),
   "refused the laptop for about 33 hours"
   (`whole-plan-and-codebase-review-2026-11-09.md:276`). Answered by
   **WO-260** (v0.122.1), which lowered the floor to 2.31.0 and replaced six
   Git forms (`docs/work-orders/WO-260-the-kit-runs-on-git-2-31.md:1, 26-58`).
2. **The first order called every harness and provider.** On a new
   instance's first cycle on the laptop (2026-11-09, starter v0.122.1) the
   first order looked for each agent harness and made test calls, and the
   discovery record then turned those hosts on
   (`whole-plan-and-codebase-review-2026-11-09.md:101-106`;
   `WO-275-…md:59-75, 96-117`). Filed as **WO-275**; its branch was removed
   and its scope carried by **WO-276** ("WO-261 to WO-275 are superseded by it
   and settled", `v1-0-0-instance-returns-and-followups-2026-11-14.md:29, 264`).
   Whether WO-276 delivered each WO-275 item was not checked (WO-276 is
   outside the assigned reading list).
3. **No page of commands to bring an instance up; the private terms list
   skipped.** Setting up the enterprise starter on the laptop the operator
   could not find the commands; the guide omitted the terms list, without
   which every publish refuses
   (`v1-0-0-instance-returns-and-followups-2026-11-14.md:31-34, 106-160`).
   Answered by **WO-277** (v1.0.1) (`WO-277-…md:28-56`).
4. **The host check sized an instance's gate by a core-only suite.**
   `checkHost` used a core-only suite's peak of 1,509,638,144 bytes, which
   "refuses a machine of 16 GB with twelve logical processors"; the update
   preview judged no floor; a C compiler is required and undeclared
   (`whole-plan-and-codebase-review-2026-11-09.md:271-279`). Filed as
   **WO-265** ("an instance's host check fits its own tasks; the preview
   judges incoming floors", same file `:343`), then superseded by WO-276
   (item 2's citation). The pass reads this from a portability review; it
   does not say the laptop was refused by it — **unknown** whether this one
   stopped the laptop.
5. Fresh-instance (not laptop-specific) blockers in the 2026-11-07 pass:
   planning refused an empty sequence (`buildPlanSubject` refuses fewer than
   one order) → WO-258 step 14; the router's cold-start root breached its
   template ceiling in every new instance → WO-258 step 13
   (`first-cycle-returns-and-host-elections-2026-11-07.md:169-184`).

Not startup stops: **WO-280** concerns a five-second discovery-check bound in
core's own complete run (`WO-280-…md:54-80`), with no laptop evidence;
**WO-282** removes hand repairs after an instance's update
(`WO-282-…md:22-26`). The untracked
`docs/planning/passes/the-kit-stops-no-work-2026-11-16.md` was not read
(uncommitted; excluded by the brief).

## The ten limits most likely to fail on a host two to three times slower

Ranking is an inference from the limit's position on the default path, the
consequence of a hit, and recorded dev-host durations where they exist. No
duration was measured on the laptop for this census.

1. **A02** configuration-root suite, 30 s (`test-runner.mjs:559`): observed
   failing on the laptop (the brief); dev 5.2-8.75 s; every selection.
2. **A01** format suite, 30 s (`:554`): dev 6.7 s (baseline) to 7.63 s
   (`WO-075/FINAL-001.md:97`), the same headroom class as A02; first in
   every selection; Prettier is CPU- and file-bound.
3. **A05/A12** generated, 120 s whole and 30 s per child
   (`:572`; `generated-artifacts.mjs:38`): eight serial `node` children in an
   instance, each re-reading the tree (`launchpad verify` hashes every
   manifest file); dev 15.2 s for core's 17 children (baseline).
4. **A07** host, 10 s (`:581`): one `node` start plus imports, a native
   census, `git --version`, `ps -A`; the tightest suite bound; the only
   dev timing found is 0.1 s in the WO-222 baseline samples; what that
   sample includes is **unverified**.
5. **E01/E06** native census and descriptor capture, 2 s
   (`host-resources.mjs:498`, `:456`): run at every task launch and every
   monitor sample; one hit fails every running task (`monitor-unavailable`),
   which in the structural phase stops the gate. No timing on record.
6. **C01 with C07/C09** hook bound 15 s
   (`packages/compiler/src/harness.ts:1618-1622`) containing 10-12 s
   `resume` children (`harness-host.ts:1052, 1436`): every tool call and
   session start loads the compiled skeleton and may spawn `node` children.
7. **E09** host guard startup, 5 s (`host-guard-state.mjs:79`): every gate
   and bounded probe when no guard runs (first gate after login or reboot).
8. **E04/E05** native helper compile: `xcrun --show-sdk-path` 5 s and clang
   30 s (`host-resources.mjs:254, 289`): once per host and per helper-source
   change (a kit update that edits `host-lock.c`/`host-footprint.c`); a hit
   stops the gate before any task.
9. **B28** discovery probes, 5 s each for `claude --version` and `--help`
   (`scripts/discover.mjs:80, 90`): the first order's discovery step.
10. **A14** license-surfaces, 30 s per `npm publish --dry-run`
    (`scripts/license-surfaces.mjs:132`): several serial npm cold starts in
    every `test:docs`.

Next in line: E12 gate-evidence record lock 5 s; A15 FIFO child 5 s (inside
A02); E11 `git --version` 10 s; B11 drive lock 1 s (misleading "another
drive is running" refusal); A17 1 s script actor (`--only derived-orders`);
B07 dispatch wall clock (instance-settable, and the only limit that adapts).

## Items not verified by reading

- Claude Code's behavior when a hook exceeds its `timeout` (C01-C04).
- Downstream handling in: C06-C09, C16, B29, B33, E07, E15.
- That WO-276 delivered WO-265's and WO-275's scopes.
- Per-check durations of the instance's eight `generated` children and of
  `host` on any host.
