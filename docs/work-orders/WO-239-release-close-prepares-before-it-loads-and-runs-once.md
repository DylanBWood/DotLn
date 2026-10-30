# WO-239 — Release close prepares before it loads and runs once: the helper builds or prepares the runtime in a child process before any built module is imported, one publish invocation closes an order, the census at close is bounded to what the close owns, integration happens at the lifecycle's named points and never during a live gate, and the close record says where its minutes went (v0.103.1)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** patch. The close helper's bootstrap order, a
bounded census scope, counts in place of path lists on two ignored records,
an additive `steps` field on the close record, two guards in the integrate
helper and two role sentences; no new operator phrase and no schema change
on a committed record. Assigned at activation under the standing opt-out
default.
**Cost:** adds, in `scripts/release.mjs`: a runtime preparation at the
`close` command's entry, run in a child process before `executorWriterRelease`
(3924) and `close()` (3943) import any `packages/*/dist` module, replacing
the three in-`close()` calls of `ensureReleaseRuntime` (3318, 3346, 3445)
with assertions; a `steps` array on the close record (`name`, `startedAt`,
`finishedAt`, `durationMs`) written around prerequisites, runtime, worktree
removal, publication, starter refresh, prune and record; the prune call
(2502 to 2506) under a `close` scope; the retained-material advisory as
counts by class with a `--list-material` flag for paths. In
`scripts/lib/harness-prune.mjs`: `scope: "close"`, judging the closing
order's owned roots, main's retained lane and the temporary roots this
checkout owns, leaving the global walk to `harness prune` and the
session-end prune. In `scripts/lib/worktree-removal.mjs`: the retained
material recorded as counts and a digest, paths behind the flag. In
`scripts/lib/worktree-integration.mjs`: a refusal while a gate holds a
lane for the worktree or `main`, and a return before any stash when `main`
is already an ancestor of `HEAD`. In `packages/skeleton/src/loadouts/contributor.ts`:
one release-close sentence (run the printed command once; preview only for
a prerequisite in doubt) and one executor sentence (integrate `main` at
the lifecycle's named points only, never during a live gate). In
`scripts/lib/plan-failures.mjs`: `localReleaseCloses` reports the median
total and the slowest step over the last eight closes. Cases in
`scripts/test-release.sh`, `scripts/test-worktree-integration.mjs`,
`scripts/test-worktree.sh`, `scripts/test-fixture-temp-root.sh`,
`scripts/test-harness.mjs` and `scripts/test-process-debt.mjs`; sentences
in product 07 §Workflow closeout and releases and §Independent workflows
and integration, and in the kit README. Removes: the stale in-process
compiler at close (two refused starter refreshes and two fresh-process
retries on 2026-10-28), the default preview invocation, two of the three
census walks a close paid (186.9 s each at 5,633 retained roots, measured
by the filing pass), and the 800 KB transcript line. Wall-clock: a close
from 16 to 19 minutes end to end (two invocations and a retry) to one
invocation of about two minutes, an inference from the filing pass's
measurements until the steps record reads it. Context bytes: this file;
two role roots grow by one sentence each, recorded before and after.
Commands: none new for the operator; `--dry-run` and `harness prune`
stay. Tokens: unknown until run. Steps: 9. Re-mints: `contributor.ts` is a
registered evidence source, so the edition it stales is re-minted
deterministically and no live feedback episode is owed; `release.mjs`,
`harness-prune.mjs` and `worktree-integration.mjs` are declared sources of
machinery suites, so `npm test -- --review` runs before handoff; the role
oracle is re-minted.
**Nomination provenance:** the operator's dispatch of 2026-10-28, items 1
and 1.a (capture SHA-256
`1fd328b01272d8b90a6ca2cc1beca9e71d5d2473d20026390899082c03c13141`); the
retained close records of WO-236 and WO-234 and the WO-234 session's
`release-close-decisions.md` (the stale-compiler inference, confirmed by
the fresh-process retry); WO-233-D046 (the deferred census question);
WO-236-D014 (the operator's objection to integration without a separate
instruction and during a full gate). Filed by the
[2026-10-28 document-contract pass](../planning/document-contract-and-release-close-2026-10-28.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-233 (closed, v0.100.0: the prune, its census and the
owned roots), WO-234 (closed, v0.102.0: the dispatch bounds a close runs
under), WO-226 (closed, v0.90.0: the carried-runtime preparation a kit root
uses, `scripts/lib/release-kit-runtime.mjs`).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-233",
    "relation": "satisfied-by-close",
    "reason": "the prune, its census and the owned temporary roots the close scope judges"
  },
  {
    "workOrderId": "WO-234",
    "relation": "satisfied-by-close",
    "reason": "the dispatch bounds under which a close runs; the steps record sits beside them"
  },
  {
    "workOrderId": "WO-226",
    "relation": "satisfied-by-close",
    "reason": "the carried-runtime preparation a kit root uses in place of a build"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/release.mjs`: `ensureReleaseRuntime`
(1815 to 1853; `npm run build` at 1844; the carried-runtime branch at 1831),
its call sites inside `close()` (3166; 3318, 3346, 3445), the writer release
at 3924 before `close()` at 3943, the prune at 2502 to 2506 and the
transcript advisory it writes; `scripts/lib/executor-handoff.mjs` 31 (the
dynamic import of `packages/skeleton/dist/src/harness-host.js`);
`scripts/launchpad.mjs` 900 (`expectedHarnessBundle`, which imports
`./lib/harness.mjs` after the build); `scripts/lib/harness.mjs` 54 (the
static import of `packages/compiler/dist/src/index.js`) and 338
(`COMPILER_PACKAGE_VERSION` in the predicted bundle);
`packages/compiler/src/harness.ts` 363 (the grant-contract refusal WO-236's
close met); `scripts/lib/harness-prune.mjs` 1083 (`pruneHarness`, the lane
lock) and its census; `scripts/lib/worktree-integration.mjs` 657
("Integration took in nothing: the worktree is not behind main.");
`packages/skeleton/src/harness-host.ts` 6786 (`pruneCompletedHarnessSession`);
`scripts/lib/plan-failures.mjs` (`localReleaseCloses`); product 07
§Workflow closeout and releases and §Independent workflows and integration;
the filing pass's document §3 (the two closes' six invocations and the
three measurements).

**Objective:** a close that is one command, correct the first time, and
accountable for its minutes.

- **The runtime is current before anything loads it.** The `close` entry
  prepares the runtime (a build, or the carried runtime's preparation in a
  kit root) in a child process and only then imports the writer release
  and the close; the compiler the prediction uses is the compiler the
  export's fresh emit uses.
- **One invocation closes an order.** The release-close role runs the
  printed `--publish` command once; `--dry-run` stays available for a
  prerequisite in doubt (egress, a foreign tag) and is not a standing first
  step.
- **The census at close is bounded.** The close judges the roots the
  closing order owns, main's retained lane and this checkout's temporary
  roots; the global walk stays where it was, at `harness prune` and the
  session-end prune.
- **Integration happens at named points.** `worktree integrate` refuses
  while a gate holds a lane for the worktree or `main`, returns before any
  stash when there is nothing to take in, and the executor's role text
  names the points at which it integrates (product 07 §Independent
  workflows and integration), never during a live gate and never on its
  own initiative inside a handoff.
- **The close says where its minutes went.** The close record carries one
  timed row per step; `plan failures` reports the median total and the
  slowest step over the last eight closes, so the next planning pass reads
  a figure instead of inferring one.

**Observed gap (dated 2026-10-28 at `main` `7b0a5b5c`):**

- Two closes on 2026-10-28, three invocations each. WO-236 (v0.101.0):
  preview 4 min 22 s; publish 8 min 34 s, tag and Release published,
  starter refresh refused ("harness contract: outside-write grant needs a
  closed kind, source and operator absolute root"); retry 4 min 57 s,
  refreshed. WO-234 (v0.102.0): preview 4 min 1 s; publish 5 min 22 s,
  refused ("the export's harness emit differs from the bundle core's
  compiled packages predicted: .claude/hooks/commit-msg.mjs"); retry 4 min
  51 s, refreshed. End to end 19 min 17 s and 16 min 24 s (the retained
  close records, ignored lane).
- The cause of both refusals: the process loads the compiler before the
  helper rebuilds it. `executorWriterRelease` (3924) imports
  `harness-host.js`, which imports the compiler; `ensureReleaseRuntime`
  runs later inside `close()`; Node keeps the loaded module, so
  `expectedHarnessBundle`'s "imported after the build" `harness.mjs` gets
  the old compiler and the old `COMPILER_PACKAGE_VERSION`, while the
  export's fresh emit runs the new one. Both merges changed the compiler.
  The fresh-process retry passed both times (the WO-234 session's close
  decisions record the inference and the confirmation).
- The helper records step timings for the starter refresh only
  (preparation 2.4 s, update 0.2 s, verification 0.6 s, commit 0.02 s,
  push 1.8 s, tag 3.1 s). Measured by the filing pass under the bounded
  wrapper on `main`: `node scripts/harness.mjs prune` (the census the
  close runs) 186.9 s over 5,633 retained roots, 4,690 of them gate
  fixtures under the system temp directory; `npm run build` 1.0 s with
  nothing to rebuild; `npm run license-surfaces` 1.9 s. The census ran in
  all six invocations.
- The transcript's first line lists every retained ignored path (about
  800 KB per invocation); the worktree-removal record is 4.4 to 6.7 MB.
- `worktree integrate` was invoked by WO-236's executor before complete
  runs and while the refs were equal; each call returned "took in
  nothing" after creating its stash and merge scratch (WO-236-D014); no
  guard refuses it during a live gate.

**Design (scope discipline):**

- **A child process, not a reordered import.** The runtime is prepared in
  a child before the parent imports anything built. Rejected: moving every
  built import to after the build inside one process (axis: module
  identity; a cached ES module cannot be reloaded, and the import graph
  through `resume.mjs` and the libraries is wide). Rejected: cache-busting
  query strings on import URLs (axis: the hooks' pinned snapshot and the
  fixtures import by plain URL; a query string forks identity inside one
  process).
- **Scope the census; do not cache it.** Rejected: a cached global census
  (axis: correctness of the retention judgment; a cache can retain a root
  whose owner has died since the walk). The global walk keeps its two
  homes.
- **Role text says once; the flag stays.** Rejected: removing `--dry-run`
  (axis: a preview has a use when egress or a foreign tag is in doubt).
- **Refuse on the lane holders the prune already reads.** Rejected: a new
  live-gate state flag (axis: one source of truth for "a gate is running";
  `pruneHarness` refuses on the same observation).
- **Counts on the records, paths on request.** Rejected: dropping the
  retained-material list (axis: a cleanup blocker needs the paths; the flag
  prints them).
- **Live-run surfaces at the base.** `ensureReleaseRuntime`: exists. The
  starter refresh timings: exist. The prune's scope option: absent. The
  steps record, the integrate guards, the two sentences: absent.

**Execution plan (the executor follows these steps in order; observed at `7b0a5b5c`, 2026-10-28):**

1. `scripts/release.mjs` (the `close` command's entry, before 3924): a
   `prepareRuntimeBeforeLoad(root)` that runs `node scripts/build.mjs` (or
   `scripts/lib/release-kit-runtime.mjs` in a kit root) in a child process
   when `harnessRuntimeCause(root)` reports a cause or the built runtime is
   older than `main`'s source identity, and only then proceeds to the
   writer release and `close()`; the three in-`close()` calls become
   assertions that throw naming the entry. Check: `npm test -- --only
   release`.
2. `scripts/release.mjs` `close()`: `record.steps`, one timed row per step
   named in the Cost line; `formatPruneReport` unchanged. Check: `npm test
   -- --only release`.
3. `scripts/lib/harness-prune.mjs` `pruneHarness`: `scope: "close"` with
   `preserveOrders` as today; the global walk under `scope: "all"`
   unchanged; the session-end prune unchanged. Check: `npm test -- --only
   fixture-temp-root`.
4. `scripts/release.mjs` 2502 and `scripts/lib/worktree-removal.mjs`: the
   close passes `scope: "close"`; the advisory and the record carry counts
   by class and a digest of the path list; `--list-material` prints the
   paths. Check: `npm test -- --only release`; `npm test -- --only
   worktree`.
5. `scripts/lib/worktree-integration.mjs` (the `integrate` entry near 645):
   refuse while a lane holder names the worktree or `main`, printing the
   holder and the retry; return before any stash or scratch when `git
   merge-base --is-ancestor main HEAD` holds, printing the existing line at
   657. Check: `npm test -- --only worktree-integration`.
6. `packages/skeleton/src/loadouts/contributor.ts`: the release-close
   sentence and the executor sentence; `npm run build && node
   scripts/harness.mjs emit`; the role oracle fixture re-minted with its
   chain intact; the decisions record each root's cold-start bytes before
   and after. Check: `npm run harness -- check`; `npm test -- --only
   harness`; `npm test -- --only process-debt`.
7. `scripts/lib/plan-failures.mjs` `localReleaseCloses`: the median total
   and the slowest step over the last eight close records that carry
   `steps`; older records counted as before. Check: `npm test -- --only
   plan-refutation`.
8. `docs/evidence/WO-239/controls.json`: the stale-compiler control, a
   fixture launchpad whose `main` source changes the compiler version after
   its installed `dist`: at the base the close's prediction differs from
   the fresh emit and the refresh is refused; at the head the entry
   prepares first and the refresh passes; both arms' exit codes recorded.
   Check: `npm test -- --only release`.
9. Write-backs: product 07 §Workflow closeout and releases (the bootstrap
   order, one invocation, the bounded census, the steps record and its
   reader in `plan failures`), §Independent workflows and integration (the
   two guards and the named points); the kit README (Taking upstream
   updates; Owned cleanup and retention). Then handoff: `npm run format`
   and `npm run sync`; one `npm test -- --review` in the background,
   awaited with `node scripts/harness.mjs evidence --wait`;
   `docs/evidence/WO-239/handoff.md`; `npm run test:docs`; `npm run resume
   -- implementation-ready <flags>` (product 07 §Discipline). Check: `npm
   run publication:check`.

**Deliverables:** the pre-load runtime preparation; the steps record and
its `plan failures` reader; the bounded close census; counts on the
advisory and the removal record with the paths flag; the two integrate
guards; the two role sentences and the re-minted oracle; the controls; the
write-backs.

**Acceptance criteria (all required)**

1. A close whose `main` carries source newer than its built runtime
   prepares the runtime in a child process before any `packages/*/dist`
   module is imported by the close process; the control of step 8 refuses
   at the base and passes at the head, both arms' exit codes in
   `docs/evidence/WO-239/controls.json`.
2. The close record carries `steps` with one row per step of the Cost line
   and its duration; `plan failures` `localReleaseCloses` reports the median
   total and the slowest step over the last eight closes that carry it.
3. The census at close judges the closing order's owned roots, main's
   retained lane and this checkout's temporary roots only; a fixture with
   one thousand foreign gate-fixture roots is not walked at close and is
   walked by `harness prune`, with both counts recorded.
4. The transcript's retained-material advisory and the removal record
   carry counts by class and a digest; `--list-material` prints the paths;
   a fixture with two thousand ignored files produces a transcript without
   a path list.
5. `worktree integrate` refuses while a gate holds a lane for the worktree
   or `main`, naming the holder, and returns before any stash or scratch
   when `main` is an ancestor of `HEAD` (`git stash list` unchanged, no
   scratch root created); the paired control at the base creates the
   stash; both arms' exit codes in `controls.json`.
6. The release-close and executor roots carry the two sentences; the role
   oracle pins them with its chain intact; the handoff printed after final
   review names one `--publish` command with `--dry-run` as an option for a
   prerequisite in doubt.
7. Product 07 and the kit README state the mechanism as built (step 9);
   `npm run publication:check`, `npm test -- --review`, `npm test` and
   `npm run test:docs` green; `git diff --check` clean; no new dependency.

**Preflight:** `npm test -- --only release` for steps 1, 2, 4 and 8; `npm
test -- --only fixture-temp-root` for step 3; `npm test -- --only
worktree` and `npm test -- --only worktree-integration` for steps 4 and 5;
`npm test -- --only harness` and `npm test -- --only process-debt` for
step 6; `npm test -- --only plan-refutation` for step 7; `npm test --
--only configuration-root` for every script step; `npm run test:docs` when
a document changes; each under `node scripts/harness.mjs bounded --`; then
one `npm test -- --review` (07-execution-guide.md §Preflight before the
full gate).

**Evidence gate:** the controls of criteria 1 and 5; the deterministic
re-mint of the `contributor.ts` edition; the re-minted role oracle; `npm
test -- --review` before `implementation-ready`, final review reusing the
passing complete row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 9 and criterion 7.

**Known issues and carry-ins:**
- WO-233-D046 (FUP-0287986e9f873e20): the census-scope half is taken here
  for the close; writer-protection scope and empty owned containers stay
  deferred on the row (reopen: the scoped close census retains an expired
  root the global walk would have removed).
- WO-236-D014 (FUP-591b694d5c307e54): taken whole (reopen: an executor
  integrates during a live gate after the guard lands, or a legitimate
  integration at a named point is refused).
- The fork runs the kit's `release.mjs`; its closes get this fix with the
  release that carries this order. Until then a refused starter refresh is
  re-run as printed, in a fresh process, as both core closes of 2026-10-28
  were (reopen: a fresh-process retry reproduces the mismatch).
- The build's own duration at a close is unmeasured (1.0 s on `main` with
  nothing to rebuild); the steps record measures it from the first close
  after this order.

**Non-goals:** changing what the close publishes or how it validates a
tag; removing `--dry-run`; changing retention classes or windows; the
journals lane (WO-237); the semantics of the global prune; the dispatch
bounds (WO-234).

**Operator-review assumptions:** that one invocation by default is the
operator's intent ("if this is unavoidable, that's fine but i want to make
sure it isn't"); that a bounded census at close is acceptable because the
global walk still runs at `harness prune` and session end; that the
integrate guards match the objection recorded in WO-236-D014.
