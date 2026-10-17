# WO-216 — No gate fails late on bookkeeping: every gate and every handoff runs a structural phase first, in seconds, that checks formatting, source declarations and copied-fixture closures, the freshness of every generated artifact and the host's memory state, and stops at its first failure naming the one command that regenerates what is stale; a run stops starting tasks at its first failure; the complete gate runs once per order, fresh, at final review, while handoffs require the order's own Preflight suites; the launchpad suite runs as file lanes under their own deadlines; a stopped run records what finished (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. A new runner phase and `--keep-going`
flag; a new root script `npm run sync`; the executor and verifier completions
accept Preflight-suite rows in place of a complete row; `final-review-result
pass` requires a fresh complete review row; the launchpad suite becomes file
rows; stopped runs record a row. Other selections, `worktree publish` and
release close keep their behavior. Assigned at activation under the standing
opt-out default.
**Cost:** adds the structural phase and its rows, the sync command, the
fail-fast stop, the claim changes, the launchpad file rows, role text, an
oracle and fixtures. Removes, measured in this checkout's gate index since
receipt 045 (2026-10-13T19:35Z to 2026-10-17T18:00Z): of the seven complete
`npm test` failures, none found a product defect; two were formatting (6 s),
one the role-oracle snapshot not re-minted after a role-text change (failed
at minute 5.6, the run continued to 27.1), one a `machinerySources`
declaration missing (minute 22.2 of 41.3), one a fixture refusing under host
memory pressure (minute 21.2 of 38.1), two the launchpad suite at its 900 s
deadline (44.7 and 18.5 minute runs, once with four peers and once alone).
Of the seventeen `npm run test:docs` failures, fourteen were stale generated
artifacts (`meta` six, `release-surfaces` three, `index` one, evidence
editions three, `harness` two, the planning receipt one), five `docs-check`.
Complete runs: 33, eleven per closed order, median 1,689 s, 754 minutes;
one missing declaration surfaced after 1,420.4 s on 2026-10-16 (WO-213
D039) and a copied-fixture closure missed a file in a second run (D038).
Inference from the same rows: the structural phase would have failed each
bookkeeping run inside its first minute instead of at minutes 5.6 to 22.2,
the host precondition would have refused the pressure-dependent run before
it started, and the file lanes bound the launchpad cap to one file; the
complete gate falls from eleven runs per order to one fresh run at final
review plus the Preflight suites per handoff. Measured claim
(FUP-182984d482ca59ca), read by the next planning pass over the five closes
after this order's: instrument, the rows `readGateChecks` returns from
main's gate index; statistics, complete runs per closed order (baseline
11), structural-class failures inside runs longer than two minutes per
closed order (baseline 1.3: four over three orders) and gate task minutes
per closed order (baseline 545). Wall-clock: the structural phase's own
duration is unknown until step 16 measures it (the isolated coverage case
ran in about 19 s on 2026-10-16; `meta --check`, `index --check` and the
evidence checks are 0 to 3 s each in the rows above); a fail-fast run ends
at its first failure. Context bytes: role sentences replaced at about equal
length (`harness-context` bounds the cold start); product 07's section
body rewritten in place. Commands: one script and one flag. Tokens:
unknown until run. Steps: `npm run sync` joins the handoff sequence in
place of the separate regeneration commands. Re-mints: `contributor.ts` and
`harness-host.ts` are in the authority, feedback and harness inventories
(`scripts/lib/evidence-sources.mjs` lines 160 to 164, 258 to 262, 329 to
333), so each staled edition is re-minted deterministically and the bundle
re-emitted; neither is in `FEEDBACK_SOURCE_PATHS`
(`packages/skeleton/src/feedback-audit.ts` lines 15 to 78), so no live
feedback episode is owed; `gate-deadlines.mjs` (feedback-judged) and the
registered `gate-evidence.mjs` are untouched. `scripts/test-runner.mjs`,
`scripts/resume.mjs`, `scripts/lib/handoff-ledger.mjs`,
`scripts/lib/gate-reuse.mjs` and the loadouts directory are declared
machinery sources, so `npm test -- --review` is in the final criterion.
**Nomination provenance:** the 2026-10-17 standard planning pass
([planning document](../planning/standard-pass-2026-10-17.md) §4.5 and
§5), on the operator's direction of that day as the pass synthesizes it:
stop executors spending days per order on gates; look at why the complete
gates fail (a missing declaration, a sync that did not occur, found after
forty minutes) and fix that; read what WO-213's validation expansion tried
and improve on it. The expansion's own account
(`docs/evidence/WO-213/validation-expansion-history.md`) names the two
directions this order takes (§8 items 1 and 2) and the reuse approach it
does not (§6). Carries FUP-201956913dc8ea85, FUP-92bdaad7521fd511,
FUP-e96221b106cd136a and FUP-182984d482ca59ca. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: inputs are this repository's
code, records and gate index; fixtures are synthetic; no local path appears
here or in the evidence.
**Depends on:** WO-213 merged (closed, v0.83.0: the restored runner, gate
lookup and claim checks this order changes). No queued order; WO-192 is
reference only (Known issues).
**Recommended placement:** position 1 of the serial queue, before WO-080,
whose real-Git suite would otherwise join a gate that fails late.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-213",
    "relation": "satisfied-by-close",
    "reason": "the restored runner, gate lookup and claim checks this order changes, and the validation-expansion history it answers"
  },
  {
    "workOrderId": "WO-192",
    "relation": "reference-only",
    "reason": "queued after; its step 9 compiles the Preflight before the full gate section as this order leaves it"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Preflight before
the full gate, §Discipline (the handoff-sequence and Write once, run once
bullets), §Operator-opened planning pass (Standard artifacts);
`docs/evidence/WO-213/validation-expansion-history.md` §1, §5 to §8, §10,
§11; `docs/evidence/WO-213/decisions.md` D038, D039, D042, D055, D065,
D072; `docs/evidence/WO-215/decisions.md` D010 (the role oracle);
`docs/evidence/WO-210/decisions.md` (the 2026-10-14 declaration repair,
"dependency-coverage guard"); `scripts/test-runner.mjs` (`classifySuite`
584, `changedMachinery` 612, the task rows `node("release-surfaces", …)`
704, `node("index", …)` 835, `node("meta", …)` 1051, the per-suite
deadline `timeoutMs = 900_000` 1156, `scheduleSuites` 1730,
`expandSuiteTasks` 2044 and its vertical file rows 2049 to 2075, `runGate`
2239, `runGateChecks` 2287 to 2915, the stop controller 2557 to 2605);
`scripts/lib/gate-reuse.mjs` (92 to 428, `latestExecution` 250);
`scripts/lib/handoff-ledger.mjs` (`gateFields` 197, `requireGateClaims`
232 to 302); `scripts/lib/lifecycle-evidence.mjs` 125 to 137;
`scripts/resume.mjs` (`verificationBriefing` 1172, `final-review-result`
1674); `scripts/lib/machinery-coverage.mjs` (`uncoveredMachinerySources`,
`machinerySourceExclusions`); `scripts/lib/host-resources.mjs` (the
pressure sample, 184 to 216); `scripts/meta.mjs`, `scripts/lineage.mjs`,
`scripts/work-orders.mjs`, `scripts/release.mjs`, `scripts/harness.mjs`
(emit and check, 287 to 340; `evidence --stop`), `scripts/check-publication.mjs`
(`--print-locks`), `scripts/authority-evidence.mjs`,
`scripts/artifact-identity-evidence.mjs`, `scripts/verification-evidence.mjs`,
`scripts/harness-evidence.mjs`, `scripts/feedback-evidence.mjs` (`--write`,
`--check`, `--carry`); `packages/skeleton/src/loadouts/contributor.ts` (99
to 101, 143, 169, 577, the role steps); `scripts/test-runner.test.mjs`
(the coverage cases at 1141 to 1165, 2621); `scripts/test-verifier-gate-claims.mjs`;
`scripts/test-process-debt.mjs` (the oracle case 6471 to 6496);
`scripts/test-launchpad.mjs` (29 cases, 183,979 bytes); WO-192 lines 80 to
100 and its Preflight line.

**Objective:** No gate fails late on bookkeeping, and no order pays the
complete gate more than once. Every `npm test` selection and `npm run
test:docs` begins with a structural phase: formatting, the configuration and
registration rows, the declaration scan over every suite's sources and every
copied-fixture closure, the freshness check of every generated artifact, and
the host's memory pressure. A structural failure stops the run before any
suite starts and names `npm run sync` when a generated artifact is stale;
`npm run sync` regenerates every derived artifact that policy allows and
names what it refuses and why. A failed task stops the run from starting
more unless `--keep-going` is given. `implementation-ready` and
`repair-complete` require the structural phase, the order's Preflight suites
and the document gate at the current code identity, not a complete run;
`final-review-result pass` requires one fresh complete `npm test -- --review
--again` row recorded in that review. The launchpad suite runs as file rows
under their own deadlines. A stopped run records what finished and answers
no claim.

**Observed gap (dated 2026-10-17, main at `7b8206f4`):** the Cost line's
failure counts, from the gate index rows of this checkout. In source: the
executor completions require a passing complete row covering the review
selection (`requireGateClaims`, handoff-ledger.mjs line 302), after product
07's single-suite preflights, so every handoff pays preflight and complete
runs; `final-review-result pass` only advises when no row stands
(lifecycle-evidence.mjs line 136). `uncoveredMachinerySources` runs only
inside the `runner-fixtures` suite (test-runner.test.mjs line 1141), which
the 2026-10-14 run reached at minute 22; the copied-fixture closure of the
control-beacon CLI fixture is a hand-kept list (test-harness.mjs line 280,
D038). The generated artifacts each have a check and a writer in separate
commands (`meta --check`, `lineage index --check`, `work-orders index
--check`, `release list --markdown --write`, `harness emit` and `check`,
the five evidence scripts' `--write`, `--check` and `--carry`,
`check-publication.mjs --print-locks`), with no single regeneration command
and no check that runs them before a suite; the document gate runs them
behind the barrier after the suites it stubs. The runner's stop controller
(test-runner.mjs lines 2557 to 2605) aborts on a signal or a resource
failure, never on a failed task, so the 2026-10-13 run continued 21 minutes
after `process-debt` failed. `expandSuiteTasks` splits only `vertical` into
file rows (line 2049); `launchpad` is one 183,979-byte file with 29 cases
under one 900 s deadline, which it exceeded alone on 2026-10-15 (concurrency
1, host load 0.84 per CPU). A stop records nothing (line 2687; about 1,708 s
lost in one repair, history §5). `latestExecution` lets an impossible future
finish outrank a later failure (gate-reuse.mjs line 250; D055, withdrawn by
D072). The host pressure sample exists (host-resources.mjs lines 184 to
216) and is read by the memory monitor, not before a run starts.

**Design (scope discipline):**

- **Structural phase.** A fixed ordered list, `STRUCTURAL_TASKS`: `format`
  (check mode), `configuration-root`, `registrations`, `declarations` (new:
  `uncoveredMachinerySources` over the whole suite table plus every declared
  copied-fixture closure against its entry's direct imports), `generated`
  (new: `meta --check`, `lineage index --check`, `work-orders index
  --check`, `release-surfaces`, `harness check`, the role-oracle comparison
  the `process-debt` case makes, the five evidence `--check`s,
  `publication:check`), and `host` (new: the pressure sample; warning or
  critical refuses with the sampled values). Each is a task row with its own
  short deadline, recorded with its duration and exit code like any task,
  scheduled before the barrier of every selection (`npm test`, `--review`,
  `--only`, `--machinery`, `--document`); the document gate's existing
  copies of these rows run once, here. Rejected: a separate `npm run
  structural` command the role must remember (axis: where the check runs;
  the record shows roles forgetting the separate commands); running the
  phase in the document gate only (axis: coverage; the complete runs are
  where minutes are lost).
- **Fail-fast.** When any task fails, the scheduler starts no further task;
  running tasks finish and are recorded; the row lists `unrunSuites`; a
  structural failure additionally sets `stale` (the artifacts `generated`
  found stale) and the printed remedy is `npm run sync` for a stale
  artifact, the declaration and path for a declaration, and the sampled
  values for the host. `--keep-going` restores today's behavior. Rejected:
  fail-fast for structural tasks only (axis: wasted minutes; a product
  failure at minute 20 of 40 wastes the same twenty).
- **One regeneration command.** `scripts/sync.mjs` (`npm run sync`) runs,
  in dependency order and each only when its check reports stale: `npm run
  format`, `meta` (the decisions index and the register sync), `lineage
  index`, `work-orders index`, `release list --markdown --write`, `harness
  emit`, the authority, artifact-identity, verification and harness
  evidence `--write`, feedback `--carry` when only pins moved, and the
  publication locks for sections whose text changed as `--print-locks`
  prints them. It refuses, naming the route, what policy keeps manual: a
  role-oracle snapshot (needs the authorizing decision; D010's route), a
  feedback edition whose judged sources changed (needs the live episode),
  baseline fingerprints. It prints one table (artifact, before, after,
  action) and is idempotent: a second run changes nothing. Rejected:
  regenerating inside the gate (axis: authority; a check must never rewrite
  what it judges, history §8 risk 2).
- **The complete gate once.** Completion claims stand on the structural
  row, the `--only` rows of the suites the order's `**Preflight:**` line
  names (read by `readPreflightSuites`: every `--only <name>` token of that
  field) and the document gate row, each passing at the current code
  identity; a passing complete row covers them as today. `final-review-result
  pass` requires a fresh complete review row recorded after this review's
  `FinalReviewRequested` event, `reusedSuites: 0`. The verifier consumes the
  same rows and probes with `--only`. Rejected: reuse of passes across
  identities (axis: bookkeeping; history §6); the preflight-then-complete
  rule (axis: where the complete gate is paid).
- **Launchpad file lanes.** `scripts/test-launchpad.mjs` is split into files
  by its case groups (export and verify; update and refresh; seeds and
  staging), each a `launchpad:file:<basename>` row as `vertical` is split,
  two at a time, each under the 900 s deadline. Rejected: raising the
  deadline (axis: the cause; the suite grew past it alone).
- **Stopped runs and ordering.** A stop by request or signal after a task
  completed records a row with `stopped: true` and only the completed tasks;
  it answers no claim. `latestExecution` orders an execution finishing after
  its row's `recordedAt` at that `recordedAt` and `decidingPass` refuses it
  (D055).

**Deliverables:** the runner, sync, lookup, claim and role changes of steps
2 to 17 with their fixtures, oracle and re-mints; the split launchpad
files; the evidence README; decisions; write-backs.

**Acceptance criteria (all required)**

1. `npm test -- --list`, `--review --list`, `--only <suite> --list`,
   `--machinery --list` and `npm run test:docs --list` each print the six
   structural tasks first, in `STRUCTURAL_TASKS` order, before any suite;
   the document gate lists no second copy of `meta`, `index`,
   `release-surfaces`, `harness`, the evidence checks or `publication`
   (runner-fixtures).
2. `declarations` fails, before any suite starts, on a fixture table whose
   machinery suite omits a direct import, naming suite and path, and on a
   fixture whose copied-fixture closure omits a file its entry imports,
   naming fixture and file; the real inventory yields none (runner-fixtures).
3. `generated` fails, before any suite starts, when any one of the
   decisions index, lineage index, work-order index, release surfaces,
   harness bundle, role oracle, an evidence edition or a publication lock
   is stale in a fixture repository, naming each stale artifact, and the
   row holds them in `stale`; the printed remedy names `npm run sync`
   (runner-fixtures).
4. `host` fails before any suite starts when the pressure sample reads
   warning or critical (an injected sample in the fixture), naming the
   values; a normal sample passes (runner-fixtures).
5. With a fixture suite that fails, no task that had not started starts
   after the failure, running tasks finish and are recorded, and the row
   lists `unrunSuites`; with `--keep-going` every selected task runs
   (runner-fixtures).
6. `npm run sync` on a fixture repository with every artifact stale
   regenerates each in order and prints the table; a second run reports
   every artifact current and changes no byte; a stale role oracle, a
   feedback edition with changed judged sources and a baseline fingerprint
   are reported as refused with their route (a new `sync-fixtures` row,
   `scripts/test-sync.mjs`).
7. A run stopped by request, SIGINT, SIGTERM or SIGHUP after a task
   completed records one row with `stopped: true`, `stoppedBy`, exit code 1
   and only the completed tasks; a run stopped before any task completed
   records nothing; no `gate-reuse.mjs` lookup takes a pass from a stopped
   row; `scripts/harness.mjs` and `harness-host.ts` no longer say `records
   no check` (runner-fixtures).
8. A passing execution whose `finishedAt` is later than its row's
   `recordedAt` supplies no pass: a later failing execution decides
   (runner-fixtures).
9. `expandSuiteTasks` turns `launchpad` into one `launchpad:file:<basename>`
   row per file of the split suite, two at a time, each with its own
   deadline; `npm test -- --only launchpad` runs them all and the set of
   case names across the files equals the 29 names at the base
   (runner-fixtures; the README lists both sets).
10. `implementation-ready`, `repair-complete` and `verification-result`
    record when the structural row, every `--only` row of the suites the
    order's `**Preflight:**` line names and (when a document changed) the
    document gate row pass at the current code identity, carrying their
    evidenceRefs in `evidence.productGate`; each refuses, naming the
    missing or failed row, when one is absent, failed or at another
    identity; a passing complete row still covers them (resume).
11. For a launchpad order, `final-review-result pass` whose FINAL report
    records met a criterion naming `npm test` refuses, naming `npm test --
    --review --again`, unless a passing complete row with `gateSelection:
    "review"` and `reusedSuites: 0` at the current code identity was
    recorded after this review's `FinalReviewRequested` event, and records
    that row as `evidence.productGate`; a target order keeps its target gate
    (resume).
12. In both roots the executor skill names the structural phase, `npm run
    sync` and the Preflight suites before handoff and never the complete
    gate; the verifier skill names `npm test -- --only <suite>`; the
    reviewer skill names `npm test -- --review --again` started in the
    background after integration and awaited with `node scripts/harness.mjs
    evidence --wait`; `npm run harness -- check` and the `harness`,
    `harness-context` and `launchpad-docs` suites pass;
    `wo216-role-baseline.json` pins both support settings with the chain
    through `wo215-role-baseline.json` byte-exact (process-debt); each
    staled edition is re-minted and its check passes.
13. This order's own handoff rows (the structural row, its Preflight rows
    and the document gate) are the rows `implementation-ready` records; the
    README records the structural phase's wall-clock and each task's
    duration at the base and at handoff, and the split launchpad files'
    durations. No duration binds this criterion.
14. Write-backs land in place with no dated paragraph (step 18); the
    decisions of step 18 are recorded; `npm run meta -- --check` passes.
15. `npm test -- --review` and `npm run test:docs` green (at handoff and
    verification on this order's handoff rows, at final review on the fresh
    complete row, per criteria 10 and 11); `git diff --check` clean; no new
    dependency; `gate-deadlines.mjs` and both `gate-evidence.mjs` files
    unchanged.

**Preflight:** `npm test -- --only runner-fixtures` for steps 2 to 9,
`configuration-root` for every script step, `sync-fixtures` for step 7,
`resume` for steps 10 to 12, `harness`, `harness-context` and
`launchpad-docs` for step 13, `process-debt` for steps 14 and 15,
`launchpad` once after step 9 (its files change here), the four evidence
suites for step 16, each as `npm test -- --only <suite>` under `node
scripts/harness.mjs bounded --`, and `npm run test:docs` when a document
changes; then the handoff of step 19.

**Execution plan (the executor follows these steps in order; observed at `7b8206f4`, 2026-10-17):**

1. `docs/evidence/WO-216/README.md` (new): at the base, the seven complete
   failures and seventeen document failures with their root tasks and the
   minute each failed (from `readGateChecks`), three timed runs of each
   existing check the structural phase reuses, and the launchpad suite's 29
   case names. Check: the README holds them.
2. `scripts/lib/machinery-coverage.mjs`: export `copiedFixtureClosures(repo)`
   (each fixture that copies sources declares its set beside its entry; the
   control-beacon set moves out of `scripts/test-harness.mjs` line 280 into
   the declaration) and `uncoveredFixtureInputs(repo)`; keep
   `uncoveredMachinerySources`. Check: step 9.
3. `scripts/lib/host-resources.mjs`: export `pressureSample()` returning the
   sampled values and a level from the existing sample at lines 184 to 216.
   Check: step 9.
4. `scripts/test-runner.mjs`, structural rows: `STRUCTURAL_TASKS`
   (`format`, `configuration-root`, `registrations`, `declarations`,
   `generated`, `host`); `generated` composes the existing `meta`, `index`,
   `release-surfaces`, `harness`, evidence and `publication` rows (lines
   704, 835, 1051 and their siblings) and the role-oracle comparison, each
   kept as a task with its own deadline; `expandSuiteTasks` puts every
   structural row in every other task's `after` for every selection;
   `classifySuite` marks them `structural`. Check: step 9.
5. `scripts/test-runner.mjs`, fail-fast: `scheduleSuites` (line 1730) stops
   starting tasks after the first failed task unless `--keep-going` (parsed
   in `runGateChecks` beside `--only`, line 2326); the row gains
   `unrunSuites`, `stale` and `failedFirst`; the printed remedy per the
   Design. Check: step 9.
6. `scripts/test-runner.mjs`, stopped rows: on an interrupting signal (not
   a resource failure) `terminateGate` (line 2578) writes criterion 7's row
   synchronously from finished results, and a stop request writes it at the
   boundary; each stop message names the row when one was written. Check:
   step 9.
7. `scripts/sync.mjs` (new) and `package.json` `"sync"`: the Design's
   ordered regeneration with the table and the refusals; `scripts/test-sync.mjs`
   (new) and its `sync-fixtures` runner row declaring both as machinery
   sources. Check: `npm test -- --only sync-fixtures`.
8. `scripts/lib/gate-reuse.mjs`: `identityRows` drops rows with `stopped:
   true`; `latestExecution` (line 250) orders a future finish at its row's
   `recordedAt` and `decidingPass` refuses it; new `preflightRows(root,
   codeIdentity, suites)` returning the latest passing `--only` row per
   suite at the identity. Check: step 9.
9. `scripts/test-runner.test.mjs`: cases for criteria 1 to 9 with fixture
   tables, an injected pressure sample and synthetic rows; the coverage
   cases at 1141 to 1165 extend to closures; the WO-044 stop case keeps its
   assertions. Check: `npm test -- --only runner-fixtures`.
10. `scripts/test-launchpad.mjs`: split into `scripts/test-launchpad-export.mjs`,
    `scripts/test-launchpad-update.mjs` and `scripts/test-launchpad-seeds.mjs`
    by the case groups the Design names, shared helpers in
    `scripts/lib/launchpad-fixture.mjs`; `expandSuiteTasks` (line 2044)
    splits `launchpad` as it splits `vertical` (lines 2049 to 2075), two at
    a time; `machinerySources` and the suite row name the new files. Check:
    `npm test -- --only launchpad`; the case-name set equality in the README.
11. `scripts/lib/handoff-ledger.mjs`: export `readPreflightSuites(orderText)`
    (every `--only <name>` token of the `**Preflight:**` field); in
    `requireGateClaims` (232 to 302), when no complete row covers, product
    claims stand on the structural row, `preflightRows` for those suites and
    the document row, else refuse naming the missing one; `gateFields` (197)
    carries their evidenceRefs; new `requireFinalReviewGate(root, claims, {
    state, since })` for criterion 11. Check: step 12.
12. `scripts/lib/lifecycle-evidence.mjs` and `scripts/resume.mjs`:
    `requireLifecycleEvidence` takes `reviewGate`; `final-review-result pass`
    (line 1674) reads the FINAL report's claims, takes `since` from the
    latest `FinalReviewRequested` event and calls `requireFinalReviewGate`;
    `verificationBriefing` (line 1172) names the Preflight suites and their
    rows. `scripts/test-verifier-gate-claims.mjs`: cases for criteria 10 and
    11. Check: `npm test -- --only resume`.
13. `packages/skeleton/src/loadouts/contributor.ts`: `roleSteps.executor`
    runs the structural phase, `npm run sync` when it names a stale
    artifact, then the order's Preflight suites, then handoff, never the
    complete gate; `evidence` states criteria 10 and 11's rule; line 143 and
    `roleSteps.verifier` consume those rows and probe with `--only`;
    `productGate` (lines 99 to 101, the reviewer's) and `roleSteps.reviewer`
    start `npm test -- --review --again` in the background after integration,
    the last source edit and `npm run format`, await it with `node
    scripts/harness.mjs evidence --wait` and read meanwhile. Then `npm run
    build`; `npm run harness -- emit`. Check: `npm run harness -- check`;
    criterion 12's suites.
14. `packages/skeleton/fixtures/wo216-role-baseline.json` (new): the oracle
    in `wo215-role-baseline.json`'s shape, naming it with its SHA-256 as
    historical baseline. Check: step 15.
15. `scripts/test-process-debt.mjs`: the oracle case (line 6471) reads
    `wo216-role-baseline.json` and expects `wo215-role-baseline.json` as
    historical; the line 2861 assertion expects the new stop wording. Check:
    `npm test -- --only process-debt`.
16. `docs/evidence/WO-216/README.md`: the structural phase's measured
    wall-clock and per-task durations at handoff, the split launchpad files'
    durations, and the handoff rows' evidenceRefs. Check: the README holds
    them.
17. Re-mints: run each edition's check and re-mint each staled one with
    `npm run sync` (feedback by `--carry` when only pins moved). Check:
    `npm test -- --only authority-evidence`, `feedback-evidence`,
    `harness-evidence`, `evidence-sources`.
18. Write-backs (headings re-read at the base): product 07 "### Preflight
    before the full gate" (heading kept; the body becomes the structural
    phase, `npm run sync`, the Preflight suites before handoff, the complete
    gate once at final review, fail-fast and `--keep-going`, the stopped
    row, the launchpad file lanes, with the measurements); "## Discipline",
    bullets "**The handoff sequence (2026-10-07 pass).**" and "**Write once,
    run once (WO-132).**" (`npm run sync` in the sequence; each role's gate);
    "## Operator-opened planning pass", Standard artifacts: the machinery
    clause reads the Preflight suites as the handoff gate.
    `docs/evidence/WO-216/decisions.md`: each Design choice, the measured
    claim and its reversal (any statistic not below its baseline over the
    five closes), D055 as a boy-scout fix, D042 (the fixture's own pressure
    dependence) and D064 left. `npm run sync`; `npm run publication:check`.
    Check: `npm run test:docs`.
19. Handoff: `npm run format`; `npm run sync`; `npm run test:docs`; the
    structural phase and the Preflight suites (criterion 13); complete
    `docs/evidence/WO-216/handoff.md`; `npm run resume --
    implementation-ready <flags>`.

**Evidence gate:** the `runner-fixtures`, `sync-fixtures`, `resume`,
`launchpad` and `process-debt` fixtures; `npm run harness -- check`; this
order's handoff rows (criterion 13); `npm run test:docs`; one fresh `npm
test -- --review --again` at final review. No model run.

**Write-back duty:** as listed in criterion 14 and step 18.

**Known issues and carry-ins:**

- FUP-201956913dc8ea85: planning's answer to the expansion's goals
  (history §1): no late bookkeeping failures (the structural phase and
  fail-fast), no paying twice (the complete gate once, at final review),
  fast failure feedback (fail-fast and the Preflight suites), the complete
  gate kept as the final check. The expansion's reuse of passes across
  fixes (§6) is not taken: nothing is carried between runs.
- FUP-92bdaad7521fd511: both of D065's directions land (the structural
  phase; the regeneration command).
- FUP-e96221b106cd136a: the launchpad split is one structural cut; the
  rest of the critical path (vertical, skeleton, harness-fixtures) stays
  open for the next pass's reading of the rows this order records.
- FUP-182984d482ca59ca: the Cost line's instrument and statistics, read
  after five closes.
- WO-192 compiles §Preflight before the full gate as this order leaves it
  (its step 9 and Preflight line); no hard edge. Queued orders' Preflight
  lines ending with one complete run are read by step 18's rule.
- Withdrawn fixes not taken (history §10): D042's fixture change (the host
  precondition refuses the run instead; the fixture keeps its pressure
  dependence) and D064 (the lexer stalling on shell text, latent while
  `scripts/test-fixture-temp-root.sh` has no comment, now reached by every
  `declarations` run). Reopen D064 when a machinery shell entry gains a
  comment or a `declarations` run stalls.
- WO-213-D074's F2 (the runner's build row computed at module load) is
  taken within the Boy Scout bound in step 4 if the structural rows reach
  it, else recorded.
- A reviewer worker, a finding's fields and per-role worker caps were
  drafted by the same pass and declined by the operator; this order
  changes nothing about reviews.
- Line numbers above are observed at `7b8206f4`; the executor re-reads at
  its base.

**Non-goals:** carrying or reusing task results across identities; input
binding; a time-budgeted selection; splitting any suite other than
launchpad; target gates (`scripts/lib/target-gate.mjs`); `gate-deadlines.mjs`;
plain `npm test` composition (WO-186); `worktree publish` and release close;
reviews, findings and worker caps; minting a role oracle or a feedback
edition from the sync command.

**Operator-review assumptions**

1. Fail-fast is the default and `--keep-going` restores today's behavior.
2. The complete gate runs once per order, fresh, at final review; handoffs
   stand on the structural phase and the order's Preflight suites.
3. The `host` task refuses to start a run under warning or critical memory
   pressure rather than letting a fixture fail at minute 21.
4. `npm run sync` never mints a role oracle or a feedback edition that
   needs a live episode; it names the route instead.
5. The launchpad suite is split into three files by the case groups the
   Design names; the executor may choose a different grouping that keeps
   every case and the deadline per file.
