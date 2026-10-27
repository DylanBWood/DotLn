# WO-233 — DotLn cleans up after itself: an integration drops its own stash when it completes, every temporary root carries an owner and a retention class the prune judges, the prune runs inside release close, session end and gate end instead of in the operator's hands, a complete review reuses a warm export fixture instead of a fresh install per run, and the kit carries all of it to every instance (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. New prune candidate kinds, a shared
temporary-root helper with a declarations check, retention keys in the
budgets file and its kit template, a prune step in release close, a
session-end prune in the hooks, a gate-end prune and a churn metric in the
runner, a warm export fixture, and one check in the instance-history suite;
no new operator phrase. Assigned at activation under the standing opt-out
default.
**Cost:** adds `scripts/lib/temporary-roots.mjs` (new; the owner record, the
class table and the ledger every temporary root is created through), the
`temporary-root`, `session-scratch` and legacy-backfill candidate kinds and
the host-lock serialization in `scripts/lib/harness-prune.mjs`, the stash
drop at completion in `scripts/lib/worktree-integration.mjs`, the prune step
and its record in `scripts/release.mjs`, the session-end prune in
`packages/skeleton/src/harness-host.ts`, the gate-end prune, the churn metric
and the fseventsd sample in `scripts/test-runner.mjs`, the warm export
fixture in `scripts/lib/launchpad-fixture.mjs` and
`scripts/test-launchpad-export.mjs`, `retention` keys in
`docs/control/budgets.json` and `scripts/kit/budgets.template.json`, one
case in `scripts/test-instance-history.mjs`, cases in `scripts/test-harness.mjs`,
`scripts/test-worktree-integration.mjs`, `scripts/test-release.mjs`,
`scripts/test-runner.test.mjs` and `scripts/test-launchpad-export.mjs`, a
declarations rule in `scripts/structural-checks.mjs`, the `active`
admission and the current-code route of `worktree integrate` in
`scripts/lib/worktree-integration.mjs` and `scripts/worktree.mjs` with cases in
`scripts/test-worktree-integration.mjs` and the executor root's integrate-first
sentence in `packages/skeleton/src/loadouts/contributor.ts` (amendment D001),
and sentences in product 07, the security document, the gate architecture
record and the kit README. Removes: the residue WO-192 measured and the operator removed by
hand on 2026-10-26 (85 integration stashes, 41.30 GB; 641 session scratch
trees, 9.7 GB) and the residue this pass measured that WO-192 did not (24,526
`dotln-*` roots in the system temp directory, 14 GB, the oldest from
2026-09-29); the `npm ci` every complete review pays per export fixture after
the first; the cleanup commands handed to the operator (WO-192-D081, D084);
the "Prune subject changed" refusal that stopped the operator's chain
when a session started a gate beside it (D084); and, for every order that
resumes behind `main`, the second complete review final review pays at the
integrated identity and the hand merge a stale worktree otherwise needs
(WO-192's last complete review ran 1,902.3 s; amendment D001). Wall-clock: the launchpad
suite loses its per-run installs (unmeasured until run; the export task read
164.231 s at WO-216's base and the whole plain gate's thirty-day median is
419.1 s against a 360 s threshold at `plan conditions` 2026-10-26); release
close gains one prune (seconds; the dry run on this machine judged 84.8 MB of
snapshot candidates in under a second); session end gains one prune of the
session's own trees. Context bytes: this file; product 07 grows by the
sentences of step 15. Commands: none new for the operator; `harness prune
[--apply]` keeps its spelling and gains the census. Tokens: unknown until
run. Steps: 17. Re-mints: `harness-host.ts` is a registered evidence source
(`scripts/lib/evidence-sources.mjs`), so the editions it stales are re-minted
deterministically; it is not a file the feedback verifier judges, so no live
feedback episode; `harness-prune.mjs`, `test-runner.mjs` and
`launchpad-fixture.mjs` are declared sources of machinery suites
(`scripts/test-runner.mjs` `machinerySources`), so `npm test -- --review`
runs before handoff. One role text change: the executor root's handoff step
gains the integrate-first sentence of step 16 (amendment D001), so
`contributor.ts` is edited, the role oracle re-minted and each root's
cold-start bytes recorded before and after; the executor root is already over
its ceiling, so the same change carries product 07's standing route (a dated
acceptance or an offsetting removal), never an advisory left across orders.
The release-close root is unchanged unless the executor finds a prune sentence
necessary, recorded the same way.
**Nomination provenance:** the operator's dispatch of 2026-10-26 (the pass's
capture in ignored intake, SHA-256
`6652d1057db77797fcba54da8d1998adb821528b42649a2d7d9a9c425bebbc72`, item 1:
WO-192's proposed fixes made permanent for DotLn and the forks, with no
cleanup run by the operator) and WO-192's own proposed fixes, recorded in its
preserved worktree (the sibling worktree `../DotLn-wo192`,
`docs/evidence/WO-192/decisions.md`, uncommitted at `main` `939af628`):
D080 (the retention defect and its follow-up), D081 (the fix must reach
exported instances through their update path), D083 (the churn reductions
and the host-memory refusal), D084 (the operator's record of the session's
failures), and D017 (owned processes end before cleanup). Filed by the
[2026-10-26 pass](../planning/wo192-fixes-and-example-drift-2026-10-26.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition; the forks are the operator's own repositories and this
order copies nothing from them beyond counts and generic terms.
**Depends on:** WO-232 (closed, v0.98.0: the instance-history suite and its
fixture instance, which step 13 extends), WO-226 (closed, v0.90.0:
`update --finish` and the export's carried runtime, through which an
instance takes this fix), WO-215 (closed, v0.81.0: release close's cleanup
and starter refresh, where the prune step runs), WO-229 (closed, v0.93.0:
the host-lane registry and the `host` structural task the gate-end prune and
the serialization use). WO-192 is reference-only: its decisions are this
order's sources and its worktree is preserved, uncommitted; nothing here
depends on its merge.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-232",
    "relation": "satisfied-by-close",
    "reason": "the instance-history suite and its committed fixture instance, in which step 13 proves an updated instance prunes its own residue"
  },
  {
    "workOrderId": "WO-226",
    "relation": "satisfied-by-close",
    "reason": "update --finish and the carried runtime, the path by which an exported instance takes this order's kit files"
  },
  {
    "workOrderId": "WO-215",
    "relation": "satisfied-by-close",
    "reason": "release close's cleanup and starter refresh, the step the prune joins"
  },
  {
    "workOrderId": "WO-229",
    "relation": "satisfied-by-close",
    "reason": "the host-lane registry and the host structural task the gate-end prune and the prune-gate serialization build on"
  },
  {
    "workOrderId": "WO-192",
    "relation": "reference-only",
    "reason": "its decisions D080, D081, D083, D084 and D017 are the sources; its worktree holds them uncommitted; nothing here waits on its merge"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Workflow closeout and releases
(the cleanup paragraphs: "Cleanup uses the recorded temporary parent and
filesystem identity"; "Publication refuses tracked dirt; cleanup is best
effort"), §Preflight before the full gate (the six structural tasks, host
admission at memory pressure, the lane registry), §Operator recovery
controls; `docs/architecture/gate-execution.md` (the maintained record an
order changing gate surfaces cites and updates); `scripts/lib/harness-prune.mjs`
(`pruneHarness` 845, `judgeStash` 701, the candidate kinds at 616, 697, 746
and 761, `pruneInventory` 64); `scripts/lib/stash-drop.mjs`
(`dropInventoriedStash` 23); `scripts/lib/worktree-integration.mjs` (the
stash made and retained at 611 to 652, the receipt's "Named stash retained"
at 389, the `applied` stage at 925 to 971); `scripts/release.mjs` (the close
action at 3763, the cleanup rows and blockers at 2330 to 2375);
`packages/skeleton/src/harness-host.ts` (`ensureHarnessSessionScratch` 4687;
the Stop hook's background-dispatch advisory at 5689);
`packages/skeleton/src/worker-transport.ts` (the output capture at 121 and
its removal at 240); `packages/skeleton/src/writer-teardown.mjs` (the
transition parent at 15 to 26); `scripts/test-runner.mjs` (the
`host-confinement` leftover check at 3491, which names and never removes;
the case-marker root at 1580; the lane and task records);
`scripts/lib/host-resources.mjs` (`DEFAULT_MEMORY` 28, the pressure sample
234 to 252, `withHostLock`); `scripts/lib/launchpad-fixture.mjs` (its
header: the bounded copy, the linked `node_modules`);
`scripts/test-launchpad-export.mjs` (the offline `npm ci` cases at 379 to
430, 574 and 1926); `scripts/test-instance-history.mjs` (WO-232's suite);
`scripts/kit/README.client.md`; `docs/control/budgets.json`
(`memory`, `unsetPolicy`); WO-192's decisions D080, D081, D083, D084 and
D017 in its worktree.

**Objective:** Nothing the lifecycle or the gate creates on a machine
outlives its use without a recorded owner and a retention class, and nothing
is ever handed to the operator to delete. An integration drops its own stash
when it completes; every temporary root is created through one helper that
records its owner, class and retention, and `harness prune` judges those
records; the prune runs where the lifecycle already runs, at release close,
at session end for the session's own trees and at gate end for the gate's
own fixtures, and its report is printed where a role would otherwise not
see it; a complete review reuses a warm export fixture keyed by the kit's
manifest and lockfile instead of installing into a fresh export per run,
and the gate records how many files it created and deleted and what the
host's file-event daemon weighed before and after; prune and gate serialize
under the host lock instead of refusing each other; read-only leftovers are
made writable before removal; and every piece ships in the kit, so an
instance that takes the release prunes its own residue and core's gate
proves it on the fixture instance with history. An active order whose
worktree is behind `main` integrates main by the main checkout's current code
before its handoff's complete run, so a stale worktree takes the current gate
and the row it records is the one final review reuses (amendment D001, the
operator's authorization of 2026-10-27).

**Observed gap (dated 2026-10-26 at `main` `939af628`; WO-192's worktree and this machine read on 2026-10-26T22:30Z to 22:36Z):**

- Integration stashes. `integrateWorktree` stashes the worktree's work
  before merging and keeps the stash as recovery ("Named stash retained",
  `scripts/lib/worktree-integration.mjs` 389; the stash made at 646 to 648);
  once the receipt reaches `applied` with nothing pending or remaining
  (957) nothing drops it. The stack is shared by every worktree of the
  repository (611). `harness prune` knows the kind (`judgeStash`,
  `harness-prune.mjs` 701) and nothing runs it: its only callers are the
  operator's command (`scripts/harness.mjs` 70) and the test file. WO-192's
  D080 read 75 integration-stash candidates totalling 41.30 GB and D081 85
  entries in this repository and 16 in the operator's instance; the operator
  dropped them by hand on 2026-10-26 (D081, D084) and `git stash list` read
  0 at 22:30Z. Nothing prevents the next integration from starting the
  stack again; WO-192's own final review will.
- Session scratch. `ensureHarnessSessionScratch` creates
  `<system-temp>/dotln/<digest>/scratch` per session (`harness-host.ts`
  4687); nothing removes it and prune lists no scratch kind (the kinds at
  616, 697, 746 and 761 are `release-list-cache`, `retained-lane`,
  `integration-stash` and the snapshots). D080 read 641 trees, 9.7 GB,
  243,654 files; the operator removed them by hand and the root read 16 KB
  at 22:30Z.
- Fixture roots, unrecorded by WO-192. The system temp directory held
  24,526 `dotln-*` directories totalling 14 GB at 22:33Z, the oldest dated
  2026-09-29 (`ls -d dotln* | wc -l`; `du -sch dotln*`): by family,
  `dotln-launchpad-*` 20 roots, 6.45 GB (export fixtures with their installed
  `node_modules`); `dotln-evidence-sources-*` 7, 1.66 GB;
  `dotln-wo004-generator*` 1, 1.51 GB; `dotln-wo056-*` 15,428, 1.48 GB;
  `dotln-integrate-test-*` 24, 1.13 GB; `dotln-planning-kit-*` 6, 0.93 GB;
  `dotln-source-host-*` 1,742 (`packages/skeleton/test/source-change-fixture.ts`
  104); `dotln-worker-schema-*` 3,311 and `dotln-worker-output-*` 3,318 empty
  capture directories (`worker-transport.ts` 121 and 1391; the capture is
  removed at 240 only when the process promise settles through that path;
  D076 counted 132 of them created during one session). About forty
  distinct `mkdtempSync(join(tmpdir(), "dotln-…"))` prefixes exist across
  `scripts/` and `packages/`; the runner looks only for
  `dotln-host-confinement-<tag>-` leftovers and removes nothing (3491).
  The shell suites already have the convention the Node sites lack:
  `scripts/test-temp-root.sh` creates a fixture root with a
  `.dotln-test-root-owner` marker and trap-installed cleanup
  (`create_test_temp_root` 61, the marker at 104), and the
  `fixture-temp-root` suite checks that cleanup stays inside the owned
  directory; no Node test, runtime site or prune reads that marker.
- Host memory. The `host` structural task refused a complete review twice
  on 2026-10-26 (D074, D083: `Host memory: warning; pressure=2;
  swapBytes=1148452864`), with `fseventsd` at 15.6 to 16.3 GB resident and
  the compressor at 15 GB while every DotLn process together held under 200
  MB (D080, D081); `fseventsd` grew 667 MiB in 67 minutes in which only one
  session's gates, build and sync ran (D081). Each complete review exports
  fresh kits and runs `npm ci` into them (`test-launchpad-export.mjs` 379 to
  430, 574, 1926; the fixture copy links the checkout's `node_modules` but
  the exports install their own), exports fresh instances and creates and
  deletes hundreds of fixture repositories; the gate records lanes and time
  and no count of files created or deleted (D083). Whether this churn is
  what grows `fseventsd` is unmeasured (D080).
- The operator ran the cleanup. `node scripts/harness.mjs prune --apply`
  was denied to the session by the host's auto-mode permission classifier
  (D081), so the stash drops and the scratch removal were handed to the
  operator as commands, delivered in the middle of a turn and repeated three
  times before arriving as one block (D084); the session then started a
  gate and a sync while the operator's prune ran, prune's "Prune subject
  changed" safety check refused, and the 85 stashes stayed (D084); the
  operator's `rm -rf` met `Permission denied` under `.runtime/snapshots` in
  a dead release-test fixture, because fixtures leave directories without
  write permission (D083). The operator's dispatch of this pass names the
  cost: about two hours of running scripts by hand.
- A stale worktree cannot take the fix. `worktree integrate` requires the
  order in `repairing` or `final-review` (`scripts/lib/worktree-integration.mjs`
  595 to 597) and the command's cwd to be the matching `wo-NNN` worktree root
  (20 to 26; `scripts/worktree.mjs` 716 to 724 passes `process.cwd()`), so an
  active order that waited while `main` moved cannot take main's code before
  its handoff run, pays a second complete review at final review because the
  integrated identity has no passing row, and a worktree whose own script
  predates a rule can never run that rule. WO-192's worktree at `939af628`,
  resumed after this order and two more close, is the case (amendment D001).
- The forks. `harness-prune.mjs` and `stash-drop.mjs` are kit files and
  present in `DotLn-Instance` and `DotLn-Enterprise-Starter` (read on this
  machine); no instance runs prune, and the instance held 16 stashes before
  the operator's cleanup (D081). The instance-history suite (WO-232) updates
  a fixture instance to the current kit at every fresh core gate and runs the
  kit's checks there; it does not integrate, close or prune.

**Design (scope discipline):**

- **Drop at the source, not later.** An integration drops its own stash as
  the last act of reaching `applied` with nothing pending, and the receipt
  records the drop; a continuation keeps the stash until then, because the
  stash is the recovery for an interrupted application. Rejected: dropping
  every integration stash at release close only (axis: the stack grows by
  one 0.55 to 0.65 GB entry per integration until the close, and a
  withdrawn or long-running order never closes).
- **One helper, one record, one judge.** Every temporary root in `scripts/`
  and `packages/` is created through `createTemporaryRoot(prefix, { class,
  owner })`, which writes `.dotln-owner.json` (class, pid and birth, the gate
  check id or the session digest, created-at, the class's retention), and
  `harness prune` judges `temporary-root` candidates from that record:
  owner dead, or the owning gate row recorded, and the class's retention
  window passed. The classes and their windows are keys in
  `docs/control/budgets.json` `retention` (gate fixture of a passing suite:
  0; of a failing suite: the diagnosis window; session scratch after the
  session's journal ends; worker capture after its process ends; warm
  fixture when its hash is stale); `null` keeps a class forever, as the
  budgets file reads `null` elsewhere. Untagged legacy `dotln-*` roots older
  than the longest window with no live owner, no live lane and no writer
  reservation naming them are candidates once, so the 24,526 existing roots
  go the same way. Rejected: age-only pruning without an owner record (axis:
  safety; a live gate's fixture older than the window would be removed).
  Rejected: leaving each test file's own teardown as the mechanism (axis:
  the 24,526 roots are what that mechanism leaves).
- **The prune runs where the lifecycle already runs.** Release close runs
  the prune after its worktree cleanup and records candidates, removals,
  retentions and blockers in the close record as cleanup rows are recorded
  today; `--dry-run` previews it. The Claude Stop hook and the Codex
  lifecycle completion prune the session's own scratch tree and its own
  worker captures when the session's dispatch has ended, never another
  session's. The gate removes its own passing suites' fixture roots after
  the row is recorded and tags a failed suite's roots with the diagnosis
  window. `plan start`, `worktree start` and `launchpad export --update
  --preview` print the prune report (candidates and bytes by kind), so the
  residue is visible before it is large. Rejected: a scheduler or a
  background daemon (axis: product 03's automation direction adds none;
  the lifecycle commands are the schedule, and a daemon is one more process
  to own). Rejected: a separate operator cleanup command as the fix (axis:
  the trap product 05 names as shifting the burden to the intervenor; the
  operator's dispatch forbids it).
- **No evasion of the host's permission decision.** `harness prune --apply`
  keeps its spelling for the operator; the order does not retry a denied
  form or route the drop through a test runner (D081). The prune reaches
  the stash and the roots through the commands the roles already run under
  the host's permission flow; the executor records, with the host page it
  read, which spelling the auto-mode classifier admits for the standalone
  command, and the generated settings carry an allow rule only for the
  spelling that page documents as admissible.
- **Serialize, do not refuse.** The prune takes the host lock
  (`withHostLock`, `host-resources.mjs`) for its apply phase; a gate's
  `host` task waits for it or refuses naming the prune, and a prune started
  while a gate holds lanes waits or refuses naming the gate, so an operator's
  chain and a session's gate never break each other mid-way. Read-only
  leftovers are made writable before removal, inside the prune's own root
  check (the existing "prune path outside its root" and symlink refusals
  stay).
- **Churn cut and measured.** The launchpad export suite keeps one warm
  export per (kit manifest hash, lockfile hash) under `.runtime/fixtures/`
  as a `warm-fixture` root and clones from it, linking the cached
  `node_modules`; the WO-074 offline-install case keeps its one fresh `npm
  ci`. The helper's ledger gives the runner `filesCreated`, `filesDeleted`
  and `bytesWritten` per gate row; the `host` task samples `fseventsd`
  resident bytes on macOS before the gate and the row records it, so the
  growth per complete review is read, not guessed. `.metadata_never_index`
  is written at the temp `dotln` root and under `.runtime/` on macOS (a
  no-op elsewhere). Rejected: lowering the host-memory admission to admit a
  warning (axis: D083's reason; it hides the condition that refused the
  gate). Rejected: changing the gate's temp layout before the measurement
  (axis: D080's reason; the cause is unmeasured).
- **The kit carries it.** Every changed file is a kit file or compiled into
  the runtime the kit carries; the instance-history suite performs a
  synthetic integrate and close in the updated fixture instance and asserts
  the prune reports zero `integration-stash` and zero stale
  `temporary-root` candidates afterwards, and the update preview prints the
  instance's report; the release's Read before upgrading names the retention
  keys an instance may edit and asks no record edit.
- **A stale worktree integrates by current code.** `integrate` is admitted
  for an order in `active` whose worktree's merge base is behind `main`; the
  main checkout's current `scripts/worktree.mjs` performs it against the
  order's registered worktree, resolved from `git worktree list --porcelain`
  by the order's branch, so the code that carries the rule does the merge
  and the worktree then carries main's code; the executor root says to
  integrate first when main has moved, resolve authorized conflicts, re-run
  format and sync, and only then start the one complete run. The form (a
  worktree argument from the main checkout, or main's script run by path
  from the worktree session) is the executor's, recorded with the hook's
  admission. Rejected: admitting integrate at every phase (axis: verification
  and final review judge a frozen subject). Rejected: a hand cherry-pick into
  the stale worktree (axis: the operator's hand, once per waiting worktree).
- **Live-run surfaces at the base.** Release close's cleanup rows: exist
  (`release.mjs` 2330 to 2375). The host lock: exists (`withHostLock`). The
  instance-history suite: exists (WO-232, v0.98.0). Prune's apply route in
  a Claude session under auto mode: refused once (D081), the admissible
  spelling unknown until step 14 reads the host page. `fseventsd` growth per
  gate: unmeasured. All others absent until this order.

**Execution plan (the executor follows these steps in order; observed at `939af628`, 2026-10-26):**

1. `docs/evidence/WO-233/README.md` (new): record the base on this machine
   before any change: `node scripts/harness.mjs prune` (dry run), `git stash
   list | wc -l`, and the temp-root census by prefix family (count, bytes,
   oldest mtime) from a script committed beside the README. Check: the
   README names each figure with its command.
2. `scripts/lib/temporary-roots.mjs` (new): the shell convention of
   `scripts/test-temp-root.sh` carried to Node and to the runtime, with one
   marker both read (the shell helper's `.dotln-test-root-owner` gains the
   same fields, or writes the JSON record beside it; the executor chooses
   and the `fixture-temp-root` suite keeps passing): `createTemporaryRoot(prefix, {
   class, owner })`, the owner record, `ownerAlive(record)` (pid and birth
   through `host-resources.mjs`'s process table; a gate owner through its
   recorded row), the class table read from `docs/control/budgets.json`
   `retention`, the ledger of created and removed entries the runner reads,
   and the `.metadata_never_index` marker. The TypeScript twin in
   `packages/skeleton/src/temporary-roots.ts` for the runtime's sites
   (`worker-transport.ts` 121 and 1391, `writer-teardown.mjs` 15 to 26,
   `harness-host.ts` 4687), exported from `dist` as `harness-host.js` is.
   Check: `npm test -- --only harness` (new cases).
3. `scripts/structural-checks.mjs` `declarations`: refuse a
   `mkdtempSync(join(tmpdir(), "dotln-` site in `scripts/` or
   `packages/*/src` outside the helper, naming the file; then move every site
   onto the helper (about forty prefixes; the test files under `scripts/`
   and `packages/*/test` through the same helper with class `gate-fixture`).
   Check: `npm test -- --only declarations`; `npm test -- --only
   fixture-temp-root`.
4. `scripts/lib/worktree-integration.mjs`: when the receipt reaches
   `applied` with nothing pending or remaining (957), drop the integration's
   own stash through `dropInventoriedStash` and record `stashDropped` with
   the stash id in the receipt; the "Named stash retained" line (389) says
   dropped; a continuation keeps it until then. Check: `npm test -- --only
   worktree-integration` (the stash count equal before and after a completed
   integration; the paired control at the base, both arms' exit codes in
   `docs/evidence/WO-233/controls.json`).
5. `scripts/lib/harness-prune.mjs`: the `temporary-root` and
   `session-scratch` kinds and the legacy backfill rule; the write-permission
   reset before removal; `withHostLock` around the apply phase and the
   lane-aware refusal naming the gate; the census block in the report.
   Check: `npm test -- --only harness` (a live-owner root is never a
   candidate; a dead-owner root past its window is; a `0o500` directory is
   removed; a prune beside a lane holder names it).
6. `scripts/release.mjs` (the close action at 3763; cleanup at 2330 to
   2375): after the worktree cleanup rows, `pruneHarness(root, { apply:
   !dryRun })`, its outcome in the close record (`prune: { candidates,
   removed, retained, blockers }`), a failure a cleanup blocker as today;
   `releaseCloseSummary` (449) prints it. Check: `npm test -- --only
   release`.
7. `packages/skeleton/src/harness-host.ts`: the Stop hook (the site at 5689)
   and the Codex lifecycle completion prune the session's own scratch tree
   and worker captures when no background dispatch is running and the writer
   is released; the hook prints what it removed; another session's tree is
   never touched. Check: `npm test -- --only harness-fixtures`; `npm test --
   --only skeleton`.
8. `scripts/test-runner.mjs`: after the row is recorded, remove the roots
   the gate's passing suites created (by the gate check id in their owner
   records) and tag a failed suite's roots with the diagnosis window; record
   `filesCreated`, `filesDeleted` and `bytesWritten` from the helper's
   ledger in the row beside lanes and time; the `host` task samples
   `fseventsd` resident bytes on macOS and records it. Check: `npm test --
   --only runner-fixtures`.
9. `scripts/lib/launchpad-fixture.mjs` and `scripts/test-launchpad-export.mjs`:
   the warm export under `.runtime/fixtures/launchpad/<manifest-and-lock
   hash>/` as a `warm-fixture` root; cases clone it and link its
   `node_modules`; the WO-074 criterion 1 case keeps the one fresh offline
   `npm ci`; a stale hash is a prune candidate. Check: `npm test -- --only
   launchpad` (the number of `npm ci` runs per complete run recorded in the
   decisions: before and after).
10. `docs/control/budgets.json` and `scripts/kit/budgets.template.json`:
    the `retention` keys with the seeds (gate fixture passing 0 h, failing
    24 h, session scratch 24 h after the session ends, worker capture 1 h,
    warm fixture until stale, legacy backfill 48 h), each `null`-admitting;
    `readBudgets` (`scripts/lib/process-budget.mjs` 14) validates them and
    reads an absent block as the seeds, so an export made before this order
    keeps `npm run meta`. Check: `npm test -- --only process-debt`; `npm
    test -- --only launchpad` (the update case).
11. `scripts/worktree.mjs` `start`, `scripts/refute-plan.mjs` `start` and
    `scripts/launchpad.mjs` `--preview`: print the prune report's kinds,
    counts and bytes. Check: `npm test -- --only worktree`; `npm test --
    --only plan-refutation`; `npm test -- --only launchpad-planning`.
12. `docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-144, 2026-09-19:
    the Stop hook's own-tree prune, what it never touches, and that the five
    refusals are unchanged. Check: `npm run publication:check`.
13. `scripts/test-instance-history.mjs`: in the updated fixture instance,
    perform a synthetic integrate and close and assert `harness prune`
    reports zero `integration-stash` and zero stale `temporary-root`
    candidates; assert the update preview prints the report; add the closed
    self member without the field to the manifest (FUP-912bcf619a547236, the
    carry-in). Check: `npm test -- --only instance-history`.
14. The standalone command's host form: read the host's permission page for
    the installed version, record which spelling of the prune the auto-mode
    classifier admits (`node scripts/harness.mjs prune --apply`, `npm run
    harness -- prune --apply`), add the generated settings allow rule only
    for a documented admissible spelling, and record the reading in the
    decisions with the page cited; run the backfill on this machine from the
    executor's session (`node scripts/harness.mjs prune`, then `--apply`),
    recording before and after; if the host denies the apply, record the
    exact denial and leave the backfill to this order's own release close
    (step 6), which the reviewer's close performs and records.
15. Write-backs: product 07 §Workflow closeout and releases (the close
    prunes and what the record shows), §Preflight before the full gate (the
    gate prunes its own fixtures, the warm export, the churn metric and the
    `fseventsd` sample), §Operator recovery controls (no cleanup is handed to
    the operator; the prune report at start); `docs/architecture/gate-execution.md`
    (the churn measurement beside the capacity record);
    `scripts/kit/README.client.md` (the retention keys, the close's prune,
    the Read before upgrading text); `docs/evidence/WO-233/decisions.md`;
    `npm run meta`; `node scripts/lineage.mjs index --check`; `node
    scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
16. `scripts/lib/worktree-integration.mjs` (the phase check at 595 and the
    root check at 20 to 26) and `scripts/worktree.mjs` (716): admit `active`
    when the worktree's merge base with `main` is behind main's tip; resolve
    the order's worktree from the main checkout by its branch when the cwd
    is not that worktree; a worktree not behind main integrates as today's
    "took in nothing". `packages/skeleton/src/loadouts/contributor.ts`
    `roleSteps.executor`, the full-gate step: integrate first when main has
    moved, then format, sync and the one complete run. Then `npm run build &&
    node scripts/harness.mjs emit`; the role oracle fixture
    `packages/skeleton/fixtures/wo233-role-baseline.json` with the chain
    intact; the decisions record each root's cold-start bytes before and
    after and the standing route for the executor root. Check: `npm test --
    --only worktree-integration` (a fixture worktree behind main integrated
    from the main checkout's code at `active`, and the worktree then holds
    main's newer file; the paired control at the base refuses with the phase
    message, both arms' exit codes in `controls.json`); `npm run harness --
    check`; `npm test -- --only process-debt`.
17. Handoff: finish source edits; `npm run format` and `npm run sync`; start
    one `npm test -- --review` in the background, never under the bounded
    wrapper, and await it with `node scripts/harness.mjs evidence --wait`;
    after it passes, complete `docs/evidence/WO-233/handoff.md`; `npm run
    test:docs` once after the last document edit; then `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the helper and its declarations check; the stash drop at
completion; the three candidate kinds, the permission reset and the host-lock
serialization in the prune; the prune step in release close, at session end
and at gate end; the prune report at start and in the update preview; the
retention keys and their template; the warm export fixture; the churn metric
and the `fseventsd` sample; the instance-history case; the base record, the
controls and the backfill record; the write-backs.

**Acceptance criteria (all required)**

1. A completed integration leaves the stash stack as it found it: after
   `npm run worktree -- integrate WO-NNN` reaches `applied` with nothing
   pending, `git stash list` has the same count as before and the receipt
   names the dropped stash; an interrupted application keeps the stash and
   the receipt says so; the paired control at the base shows one more
   entry, both arms' exit codes in `docs/evidence/WO-233/controls.json`.
2. Every temporary root under `scripts/` and `packages/*/src` and every
   test fixture root is created through the helper and carries an owner
   record with class, owner identity, created-at and retention; the
   `declarations` structural task refuses a raw `mkdtempSync` site naming
   the file; the `fixture-temp-root` suite passes.
3. `harness prune` lists `temporary-root` and `session-scratch` candidates
   by class with the owner's liveness and age; a root with a live owner, a
   live lane or a writer reservation naming it is never a candidate; a
   dead-owner root past its class window is; an untagged legacy `dotln-*`
   root older than the backfill window with no live owner is, once; a
   `0o500` leftover is removed after the permission reset; cases in
   `scripts/test-harness.mjs`.
4. `npm run release -- close` (and its `--dry-run`) runs the prune after its
   cleanup rows and the close record carries candidates, removals,
   retentions and blockers; a prune failure is a cleanup blocker with its
   retry command; the closed order's own integration stash is gone.
5. At session end the Claude Stop hook, and at lifecycle completion under
   Codex, the session's own scratch tree and worker captures are removed
   when no background dispatch is running and the writer is released, and
   another session's tree is untouched; fixtures cover a live sibling
   session and a running background dispatch.
6. After a gate records its row, the roots its passing suites created are
   gone and a failing suite's roots remain tagged with the diagnosis window;
   the row records `filesCreated`, `filesDeleted` and `bytesWritten`, and on
   macOS the `fseventsd` resident bytes the `host` task sampled; cases in
   `scripts/test-runner.test.mjs`.
7. A prune started beside a running gate waits or refuses naming the gate;
   a gate's `host` task started beside an applying prune waits or refuses
   naming the prune; neither leaves the other's subject changed; cases.
8. The launchpad export suite installs once per (manifest, lockfile) hash
   into a warm fixture and clones it afterwards; the WO-074 criterion 1 case
   still runs its fresh offline `npm ci`; the decisions record the `npm ci`
   count per complete run before and after and the suite's task time
   against the thirty-day median `plan conditions` reports at activation
   (419.1 s plain-gate median on 2026-10-26).
9. `.metadata_never_index` exists at the temp `dotln` root and under
   `.runtime/` on macOS after any helper call; the decisions record
   `fseventsd` resident bytes before and after one complete review on this
   machine (a measurement, with the condition for changing the gate's temp
   layout stated from it, not a pass mark).
10. `docs/control/budgets.json` and the kit template carry the `retention`
    keys; `readBudgets` validates them, reads an absent block as the seeds,
    and a launchpad export made before this order passes `npm run meta`
    after an update.
11. `plan start`, `worktree start` and `launchpad export --update --preview`
    print the prune report (kinds, counts, bytes).
12. The instance-history suite's updated fixture instance performs a
    synthetic integrate and close and `harness prune` reports zero
    `integration-stash` and zero stale `temporary-root` candidates there;
    the update preview prints the instance's report; the manifest gains the
    closed self member without the field (FUP-912bcf619a547236) with its
    check.
13. The base record (criterion 1's README) and the backfill record exist:
    this machine's census before and after the first apply, or the exact
    host denial and the reviewer's release-close prune record in its place;
    the executor ran the commands, not the operator.
14. `npm run worktree -- integrate WO-NNN` is admitted for an order in
    `active` whose worktree's merge base is behind `main`, performed by the
    main checkout's current code against the order's registered worktree
    when the cwd is not that worktree, after which the worktree holds main's
    code; a worktree not behind main integrates as a no-op; the executor
    root states the integrate-first duty before the handoff's complete run;
    the role oracle pins it; the decisions record the roots' bytes before
    and after with the standing route; the paired control at the base
    refuses with `integrate requires the selected order in repairing or
    final-review`, both arms' exit codes in `docs/evidence/WO-233/controls.json`.
15. Product 07, the security document, the gate architecture record and the
    kit README state the mechanism as built (step 15); the Read before
    upgrading names the retention keys and asks no record edit; `npm run
    publication:check`, `npm test -- --review` and `npm run test:docs`
    green; `git diff --check` clean; no new dependency.

**Preflight:** `npm test -- --only harness` for steps 2, 5 and 14;
`npm test -- --only declarations` and `npm test -- --only fixture-temp-root`
for step 3; `npm test -- --only worktree-integration` for steps 4 and 16;
`npm test -- --only release` for step 6; `npm test -- --only harness-fixtures`
and `npm test -- --only skeleton` for step 7; `npm test -- --only runner-fixtures`
for step 8; `npm test -- --only launchpad` for steps 9 and 10;
`npm test -- --only process-debt` for step 10; `npm test -- --only worktree`,
`npm test -- --only plan-refutation` and `npm test -- --only launchpad-planning`
for step 11; `npm test -- --only instance-history` for step 13;
`npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the base record and controls; the cases of criteria 1 to
12; the backfill or denial record of criterion 13; the integrate cases and
control of criterion 14; the re-minted role oracle; the deterministic
re-mints of the editions `harness-host.ts` and `contributor.ts` stale; `npm test -- --review` before
`implementation-ready`, final review reusing the passing complete row at the
integrated code identity when one exists.

**Write-back duty:** as listed in step 15 and criterion 15, and product 07
§Independent workflows and integration (the `active` admission and the
current-code route of step 16).

**Known issues and carry-ins:**
- Amendment D001 (2026-10-27; the operator's authorization in ignored
  capture SHA-256
  `2280c0555104abe9c811daf4efd4218f4d835b0eab50be56ff7afc78a6cb190a`;
  bound by `amend-order` against receipt 056): step 16 and criterion 14, the
  integrate rule; WO-192 is its first consumer (reopen: a resumed order's
  integrate from current code leaves a mixed runtime in the worktree, or an
  integrated identity's row is reused for a subject the integrate changed
  after the row was recorded).
- FUP-ca213b859ce6a36c (WO-192-D080), FUP-d925bbf866d1d43c (D081) and
  FUP-575e9e05f616d44c (D083) are this order's sources; their register rows
  live in WO-192's uncommitted worktree, not in `main`'s register, so the
  filing pass allocates them in prose and on its own candidate rows; the pass
  that follows WO-192's merge or withdrawal disposes the rows themselves
  (reopen: WO-192 merges or is withdrawn).
- FUP-e96221b106cd136a (the plain gate's thirty-day median at 419.1 s
  against 360 s, and the target-worktree task at 611.3 s) is allocated here
  for the export suite's share: criterion 8 records the suite's time before
  and after; the target-worktree task is not this order's (reopen: the
  plain-gate median stays above 360 s after this order closes).
- FUP-268c774fd159addb (WO-225-D021: a nested `node --test` child in the
  launchpad fixtures passing without running) is allocated here as a
  carry-in of step 9, which edits those fixtures: fix inside the Boy Scout
  bound or record it as left.
- FUP-912bcf619a547236 (WO-232-D008: the closed self member without the
  field in the history manifest) is step 13's carry-in.
- Owned processes: D017 made driven runs end their owned processes before
  cleanup; the computer-use helper processes and the empty worker-output
  directories D076 counted are covered by the capture class and the
  session-end prune, not by any new process ownership rule; descendant
  ownership through unobserved exits stays with FUP-d0a9719cc2e4ec55
  (reopen: a prune finds a live owner that is not a DotLn process).
- The host guard (`scripts/host-guard.mjs`) is shared per user and exits
  three seconds after its registrations empty (line 279 to 280); the one
  running during the filing pass was kept alive by that session's own
  registrations and is not residue; nothing here changes it.

**Non-goals:** changing what the host-memory admission refuses; a daemon or
scheduler; deleting anything outside the temp `dotln` roots, `.runtime/` and
the integration stash stack; changing the gate's temp layout before the
`fseventsd` measurement; the dispatch bounds of WO-234; WO-192's validation
order or router.
