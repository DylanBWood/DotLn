# WO-204 — Source-writer containment and requests: the source writer cannot damage the operator's repository, because its command grants stay revoked through host cleanup failures, its Git configuration cannot change the bytes the host after-tests or the commit verification judges, and it commits into a private object store the host imports from after admission; a writer's request ends its step in a typed hold the vertical records as `NeedsHuman`; the Codex writer's Git grants are requalified live at the installed Codex CLI; and the Claude writer's launch environment, which gains the private object store and the same two Git configuration pairs, is requalified live at the installed Claude CLI (v0.99.0)

**Model:** any capable model. The live Codex writer qualification runs on
Codex `gpt-6.1-sol` at `max`; the live Claude writer requalification runs
on Claude Code `claude-opus-5-5` at `xhigh`; the one live feedback episode runs on Codex
`gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`
(07-execution-guide.md §Model-specific notes). State the model and effort
actually run.
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor.

This is the highest of the four merged orders
(the object-store and writer-request parts were minor; the revocation and
Git-interpretation parts patch). The source writer's
object authority changes (a private object store per episode, a host-owned
import after admission, writer access without the shared `objects`, `refs`
and `logs`); source-change admission gains the writer-request rule, which
the vertical records as `NeedsHuman`; the writer's launch environment gains
the two object-directory variables and two Git configuration pairs
(rerere and automatic maintenance off), for both transports; the host gains the records `CommandCleanupFailed` and
`CandidateImported`. The writer protocol's commit step keeps its shape; no
command changes. Assigned at activation under the standing opt-out default.
**Cost:** adds, under `packages/skeleton/`: in `src/source-change-command.ts`
independent, absence-tolerant removals with a recorded outcome; in
`src/source-change-host.ts` the reordered settlement, the restart
re-attempt, the host-owned import before the episode branch and ref update,
and the writer-request rule with its reason constant; in
`src/source-change-worktree.ts` the committed-tree clean check (index flags
refused) and a private object directory per episode on a detached
worktree; in `src/verification-worktree.ts` the host's writer-resistant Git
argument set on its local helper; in `src/worker-transport.ts` the two
object-directory variables for both transports, Codex access without the
shared `objects`, `refs` and `logs`, and two Git configuration pairs in the
Codex environment table and in the Claude writer's launch environment;
only on step 30's trigger, one sentence in
`src/worker-protocol.ts` `writerPrompt` (feedback-judged,
`feedback-audit.ts` line 60; a registered evidence source,
`scripts/lib/evidence-sources.mjs` line 96); fixture fault injection and
planting helpers, writer behaviors in `fixtures/writer-cli.mjs`, and cases
in `source-change-host`, `-integrity` and `-confinement`,
`verification-worktree` and `writer` tests. Outside the package: the hold
mapping in `scripts/lib/vertical-primitives.mjs`, envelope settings in
`scripts/fixtures/vertical/writer.mjs`, cases in `scripts/test-vertical.mjs`
and `scripts/test-vertical.recovery.mjs`, the retained counterexample run as
a case, and two qualification probes, each with its helper test and
record, under `docs/evidence/WO-204/`: the Codex writer's, and the Claude
writer's, which the 2026-10-13 pass's second round added because steps 13
and 18 change that writer's launch environment (product 07 §Research and
guided-operator work orders item 5). Removes: the three boundaries WO-112 left (D043: an
unlink error that bypasses the `WorkerInterrupted` and integrity records and
a revocation flag that can claim an effect that did not happen; D044: a
clean porcelain status taken as proof of committed bytes, and verification
reads a writer's Git configuration, replace refs or commit graph could
steer; D033: a writer that can write existing shared objects while the
observer inventories none of their bytes, and the narrowed claim standing in
for shared-repository preservation); WO-118-D019 F2 (admission that never
reads `status` or `requiresHuman`), F3 (the `rr-cache` write, detached
maintenance and the commit's exit 128 under the `dotln-writer` grants) and
F5 (the untested operator path of a killed writer); and the planning map's
candidate 5, FUP-42ef16541a8893b9 (the Claude writer's `rr-cache` and
detached maintenance in the shared repository on a host with rerere
enabled). The merge removes three
order cycles: three activations, verifications, final reviews and release
closes, each with its full gate runs (planning document §12: since receipt
044, 2.29 full review-gate runs and 61 minutes of full gate per closed
order; verification's median phase 16.9 minutes, final review's 24.8), and
three of the four feedback re-mints and live feedback self-host episodes the
four orders owed. Wall-clock: the skeleton suite grows by the matrices and
cases (against its 289.9 s thirty-day median) and the vertical suite by its
cases (the vertical task read 725.851 s at WO-199's repair gate), both
recorded at handoff; one `cat-file` per tracked path per clean check and one
`git fetch` per admitted candidate, each measured on the vertical fixture;
one live Codex writer episode, about 115 s at the WO-118 witnessed run's
measure (its source store's `WorkerAttemptStarted` `evt_12` to
`SourceChangeProcessStopped` `evt_130`), at most two; the model-free sandbox
phase, unmeasured; one live Claude writer episode, about 38 s at the
admitted live Claude episode of WO-053's five (`docs/evidence/WO-053/claude-schema.json`:
its child run 38,223 ms, claude 2.1.274, `claude-fable-5` at `xhigh`,
2026-09-17), at most two; one live feedback self-host episode, 77.3 s at WO-199's
(18:52:31.049Z to 18:53:48.335Z, `gpt-6.1-sol`/`max`). Context bytes:
unknown until run; product 03 changes in place (two sentences in §Session
lifecycle & resilience; a clause, the Codex writer sentence and one envelope
sentence in §Ports) and one skeleton README sentence. Commands: two probe
scripts named by path, the Codex probe (steps 29 and 30) and the Claude
probe (step 31), no npm alias (first use of each). Tokens: each live writer
episode's from its transport's usage observation, recorded in its probe's
record (the Claude episode's from the result envelope, as WO-053 recorded
it), each Claude episode also capped at USD 3.00 by the writer launch's own
`--max-budget-usd` (`worker-transport.ts` line 917); the feedback
episode's as its edition records them; the executor's own are unknown.
Steps: 34 in place of the four orders' 44 (9, 8, 10 and 17, counting
lettered steps): one re-mint, write-back and handoff step instead of four
each, one recovery-probe step instead of two, and the Git-interpretation
part's `HOST_GIT` import step folded into its helper step; the Claude
writer requalification (step 31) is the one step beyond the constituents'.
Re-mints:
`verification-worktree.ts`, `worker-transport.ts`,
`source-change-command.ts`, `source-change-host.ts` and
`source-change-worktree.ts` are judged by the feedback verifier
(`FEEDBACK_SOURCE_PATHS`, lines 58, 59, 63, 64 and 71), so the feedback
edition is re-minted once and one live feedback self-host episode runs after
the last judged-source edit (step 32; product 07 §Operator-opened planning
pass); all are registered evidence sources (`evidence-sources.mjs` lines 49,
50, 59, 86 and 88), so the authority, artifact-identity and verification
editions they stale are re-minted deterministically;
`source-change-command.ts` is a declared source of the `harness-probe`
machinery suite, `worker-transport.ts` of `harness-probe`,
`harness-fixtures` and `plan-refutation`, and the two vertical test files of
`runner-fixtures` (`scripts/test-runner.mjs` lines 154, 169, 204, 261, 324
and 326, read as text), so `npm test -- --review` runs before handoff.
**Nomination provenance:** WO-204, WO-205 and WO-206: operator direction of
2026-10-11, item (c) of the three-repository route dispatch (ignored
capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`): the
three WO-112 source-writer boundaries become orders, not written
acceptances, before WO-083 touches the operator's repository. Sources:
WO-112 D043 and FUP-6b6274b0176af00d (VER-004's lower F3); WO-112 D044 and
FUP-7777b9f12644e560 (VER-004's lower F4), with VER-004's executed probe
(skip-worktree set, empty status, different bytes) and VER-003's F1 (a
writer-planted commit graph showed the host an honest tree) as the observed
counterexamples; WO-112 D033 and FUP-fadd2376e82a909e, whose followup asks
planning to compare a private non-shared writer object store with host
admission against a files-only writer with a host-owned commit (this order
records that comparison in its Design and builds the first), with D033's
executed counterexample (an independent sibling commit's unique blob
deleted by the writer after the candidate completed, with the observer
reporting `observed`) as its second evidence item. WO-212: the 2026-10-13
standard planning pass, base `main` at `6dbd8771`
([planning document](../planning/standard-pass-2026-10-13.md) §5), from
WO-118's final review follow-up WO-118-D019 (F2, F3 and F5, addressed to
the planner) and its register row FUP-6c444dbf9a4d92bb;
FUP-c842faafbe34c7da (WO-112-D008, reopened by WO-118's final review) and
FUP-7f40c3911091d5ad (WO-112-D017) disposed by that pass as its
duplicates, because WO-112-D017's reopening condition (a live Codex writer
fails to commit through these grants) occurred in substance in every
WO-118 run (D019). Amended by the 2026-10-13 standard pass at `6dbd8771`
(planning document §6; the Known issues record what changed). Merged by the
2026-10-13 standard planning pass under the operator's sizing direction
(planning document §12): WO-205, WO-206 and WO-212 ran one after another on
this order's subsystem (each edits `source-change-host.ts`; WO-212
requalified the grants WO-206 rewrites), so WO-204 carries all four with
every obligation. The pass's second round added the Claude writer's live
requalification (step 31, criterion 23), which no merged order planned
although the object-store part changes that writer's launch environment
(product 07 §Research and guided-operator work orders item 5). Because
that change meets the reopening condition of the planning map's candidate
5 (§Candidates — returns from the standard pass, recorded 2026-10-13;
register row FUP-42ef16541a8893b9), the planner folded the candidate in:
the Claude writer takes the Codex writer's two Git configuration pairs,
and the same probe requalifies them.
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
a scratch writer and scratch repositories only; no employer material,
nothing of any instance.
**Depends on:** WO-112 merged (closed: the source-change host, command,
worktree, verification worktree and writer with its `dotln-writer` grants
this order repairs, and the D017 qualification it repeats); WO-199 merged
(closed, v0.69.2: the recovery through a recorded process group the restart
cases rely on); WO-118 merged (closed, v0.80.0: the interrupted-writer
branch, WO-118-D003, whose operator path this order tests, and the D019
findings it carries). No queued order.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-112",
    "relation": "satisfied-by-close",
    "reason": "the source-change host, command, worktree, verification worktree and writer with its dotln-writer grants this order repairs, and the D017 qualification it repeats"
  },
  {
    "workOrderId": "WO-199",
    "relation": "satisfied-by-close",
    "reason": "recovery through a recorded process group, which the restart cases rely on"
  },
  {
    "workOrderId": "WO-118",
    "relation": "satisfied-by-close",
    "reason": "the interrupted-writer branch whose operator path this order tests, and the D019 findings it carries"
  }
]
<!-- dotln-dependencies:end -->

**Recommended placement:** position 5 of the serial queue (the operator
keeps core's next thirty orders serial; planning document §12.4), after
WO-080 and before WO-192, because WO-083's activation needs the
source-writer boundaries this order closes closed before its run touches
the operator's repository. A recommendation, not a dependency token.

**Cites (read these sections):** 02-domain-model.md §Actors and episodes
(the result envelope row) and §Independent verification v1 (`requiresHuman`
holds a continuation; an explicit attention request yields `NeedsHuman`,
never success); 03-architecture.md §Ports (the source revision guard, the
verification contract and the writer passage) and §Session lifecycle &
resilience (the source-writer boundary, its confinement and recovery);
07-execution-guide.md §Operator-opened planning pass (the re-mint duties;
the executor's own steps and live episodes; the live-run surfaces),
§Research and guided-operator work orders items 4 and 5 (probe code and live
harness launches), §Model-specific notes and §Preflight before the full
gate; 09-audit-resilience-privacy.md (the record vocabulary the import
step's events join); `docs/evidence/WO-112/decisions.md` D008 (226-250),
D014 (418-450), D016 (479-522), D017 (524-550), D022 (replace refs), D027
(concurrent shared-repository activity refused), D033 (the boundary, the
three rejected options and the followup), D034 (VER-003 F1, the commit
graph and its import hazard), D040, D043 (the diagnosed ordering and the
four rejected shortcuts), D044 and D047 to D050 (the triage repair that left
the D043 boundary); `docs/evidence/WO-112/shared-object-counterexample.mjs`
(the retained probe); `docs/verifications/WO-112/VER-004.md` F3 and F4;
`docs/evidence/WO-118/decisions.md` D019 (lines 573-609) and D003 (68-103);
under `packages/skeleton/src/`, at the anchors the gap and the steps give:
`source-change-command.ts` (the returned cleanup), `source-change-host.ts`
(the `afterResult` option at 81, called at 1006; `record` at 223, `recoverTermination` at 588, `checkIntegrity` at 661,
`refuse` at 721, `run()` from 770 with its recovery block at 802-813, the run
loop from 920, the admission block at 1007-1040, the catch at 1014-1064 and
the publish step),
`source-change-worktree.ts` (`HOST_GIT`, worktree creation, `verify()`,
`sharedState()`, `clean()`), `verification-worktree.ts` (its three
snapshot readers and local Git helper), `worker-transport.ts`
(`runWorkerProcess`'s close handler at 214-232, `sourceChangeArgs` with
its Claude branch from 904, `--max-budget-usd` at 917 and `--output-format
json` at 926, the dispatch's launch `env` at 1408, `codexWriterAccess`;
the two writer accesses),
`feedback-selfhost.ts` (`runFeedbackSelfhost` at 101 and its
`VerificationHost` at 361: why the Claude requalification is its own
probe), `worker-protocol.ts`
(`writerResultSchema`, `parseWriterResult`, `writerPrompt` at 485; the
writer's commit step), `vertical-host.ts`, `dotln.ts` (120-152),
`repair-host.ts` (413-420) and `portfolio-host.ts` (217-226, 340-346);
`scripts/lib/vertical-runtime.mjs` (`runVerticalIssue` from 622, its launch
observer and host at 777-803); `scripts/lib/vertical-primitives.mjs`
(`held` at 58, the source-change step at 553-585, the repair step at
700-745); the skeleton tests and fixtures the steps name, with
`source-change-host.test.ts` (62-264) and `writer.test.ts` (`scratch()` at
109, the canonical shapes case at 405); `scripts/test-vertical.recovery.mjs`
(50-175, 169-401, 432-514); `scripts/test-vertical.mjs` (310);
`scripts/fixtures/vertical/writer.mjs`; `docs/evidence/WO-053/fixture.mjs`
and `claude-schema.json` (its admitted live Claude source change);
`docs/planning/work-order-map.md` §Candidates — returns from the standard
pass (recorded 2026-10-13), item 5 (FUP-42ef16541a8893b9).

**Objective:** The source writer cannot damage the operator's repository,
and a writer's request reaches the operator. The writer's owned command
route and profile are removed by two independent, absence-tolerant
removals; a failed removal is a typed cleanup outcome naming the surviving
path; admission and after-tests refuse while any grant survives; settlement,
`WorkerInterrupted` and integrity are recorded before the cleanup's result
is judged; a restart removes the survivors and admits. Before the focused
after-tests the worktree is judged against the committed tree (a
`skip-worktree` or `assume-unchanged` entry, or a byte or mode differing
from the committed blob, refuses naming the path; nothing is restored), and
the verification worktree reads Git under the host's writer-resistant
argument set, so hidden modified, deleted and executable-bit files never
reach after-testing or publication and a planted configuration, replace ref
or commit graph cannot change what verification judges. The writer commits
on a detached worktree into a private object store, reading the shared
store through a read-only alternate with no write access to the shared
`objects`, `refs` or `logs`; after admission the host imports the
candidate's objects and only then creates the episode branch and updates
refs; the retained counterexample fails against the writer's access;
candidates still publish; a crash between import and ref update recovers
idempotently; concurrent `git gc` or `repack` neither loses data nor yields
an unjustified success. A writer that reports `status` other than
`completed`, or `requiresHuman`, ends its step `writer-requested-attention`
after the integrity and worktree checks, a rerun or restart keeps that end,
and the vertical records `NeedsHuman` with the request in its receipt. The
Codex writer's Git runs with rerere and automatic maintenance off, so its
`git commit -F` exits 0 under the `dotln-writer` grants while the shared Git
directory stays unwritable, requalified live at the installed Codex CLI on a
target with rerere enabled and packed refs, with denials read from the
host's own log. The Claude writer's launch environment carries the two
object-directory variables and the same two Git configuration pairs,
requalified live at the installed Claude CLI on a target with rerere
enabled: its commit lands in the private store, not the shared one, no
`rr-cache` and no maintenance write appears in the shared repository, and
the host imports and observes the commit. `dotln vertical` with a writer killed before commit exits 1
with a pending continuation, and a rerun completes the step with exactly one
commit. Ordinary recovery stays valid throughout.

**Observed gap:**

Cleanup revocation (dated 2026-10-11, `main` at `82b7fdb7`; diagnosed
2026-10-06 in WO-112 D043; the cited sources unchanged at `6dbd8771`,
2026-10-13):

- `source-change-command.ts`'s returned cleanup unlinks the profile before
  the route (lines 77 to 119) with no tolerance for an already absent file:
  a profile removed by an earlier partial cleanup makes the second attempt
  throw before the route is touched.
- `source-change-host.ts` sets `commandsLive` false only after cleanup
  returns (lines 926 to 930); its catch calls cleanup before
  `checkIntegrity` and the `WorkerInterrupted` record (lines 1014 to 1064),
  so an unlink error bypasses both records; `finally` tries cleanup again.
- The host settles the process before cleanup on both paths, and recovery of
  an unreceipted prior attempt calls `recoverTermination` and
  `checkIntegrity` before further work (lines 588 and 803 to 804); these
  explain VER-004's lower classification and do not cure the missing
  evidence.

Git interpretation (dated 2026-10-11, `main` at `82b7fdb7`; diagnosed
2026-10-06 in WO-112 D044; the cited sources unchanged at `6dbd8771`):

- `SourceChangeWorktree.clean()` (`source-change-worktree.ts` line 395) uses
  `status --porcelain --untracked-files=all`; the source host runs its
  focused after-tests after that check. VER-004's probe set `skip-worktree`
  on a modified file and observed an empty status with different bytes.
- `prepareWorktreeVerification` (`verification-worktree.ts` line 392)
  compares every admitted worktree file's bytes and mode with its committed
  blob and refuses drift before publication; its local Git helper uses no
  `HOST_GIT` flags, so hooks, fsmonitor, replace refs and the commit graph
  are a writer's to configure there.
- VER-003 F1 (D034): a writer-planted commit graph showed the host's Git an
  honest tree while the real tree changed a file outside the declared
  surfaces; the host-side repair set `core.commitGraph=false` for the host's
  reads, not for the verification helper.

Shared objects (dated 2026-10-11, `main` at `82b7fdb7`; diagnosed
2026-10-06 in WO-112 D033; re-observed at `6dbd8771`, 2026-10-13):

- `codexWriterAccess` (`worker-transport.ts` line 993) grants write access
  to the common objects directory; `sharedState()`
  (`source-change-worktree.ts` line 239) records only the common path, refs
  and the exact alternates bytes, never object bytes.
- The executed counterexample: an independent sibling commit's unique blob,
  deleted by the writer after the candidate completed, left the status
  `observed` and `SourceChangeObserved` recorded while `git cat-file` could
  no longer read the blob (D033, bounded 1.792 s, 2026-10-06T15:40:53Z). The
  probe is retained as `docs/evidence/WO-112/shared-object-counterexample.mjs`;
  this order runs it as a case.
- WO-112 narrowed its claim to unchanged shared refs and alternates; nothing
  claims preservation of existing shared objects today.
- The writer's worktree is created with `worktree add -b <branch>` (lines 196
  to 204) and `verify()` requires that branch checked out (line 215), so the
  writer's own commit moves `refs/heads/<branch>` in the shared refs
  namespace (receipt 044's known issue, true in source at `6dbd8771`).
- D027 refuses concurrent shared-repository activity as a recorded tradeoff;
  maintenance concurrency (gc, repack) during an episode has no case.

All three WO-112 boundaries: no host unlink failure, index-flag or
configuration counterexample has reached these paths in a live run (the
rows' reopening observations); the defects are known from source review and
the executed probes of D033, VER-003 and VER-004. WO-083's activation
preflight requires them disposed by a closed order before the run touches
the operator's repository (WO-083 criterion 1, amended 2026-10-11).

Writer requests, the Codex writer's Git grants and the operator path (dated
2026-10-13 at `main` `6dbd8771`):

- F2, admission ignores the writer's request.
  `source-change-host.ts` records `WorkerResultObserved` with the whole
  envelope (lines 1007-1012), then admits on integrity (lines 1013-1016),
  worktree verification (1017-1021), the effect (1022-1026, refusing
  `worker-returned-no-commit`), the observed-commit match (1027-1036) and
  the observation (1037-1040). `git grep` finds no `requiresHuman` or
  `envelope.status` in that file, in `scripts/lib/vertical-primitives.mjs`
  or in `repair-host.ts`. The writer schema requires `status` in
  `completed`, `blocked`, `failed` and a boolean `requiresHuman`
  (`worker-protocol.ts` `writerResultSchema`, line 373; `parseWriterResult`,
  line 407), and the prompt tells the writer to report them
  (`writerPrompt`'s `outputInstructions`, line 523). Other hosts stop on the
  request: verification goes to `attention` (`verification-fold.ts` line
  289; `reactor.ts` lines 2274 and 2328), and the portfolio's verdict fails
  on human escalation even when host evidence passes (`portfolio-host.ts`
  lines 340-346; `scripts/test-portfolio.mjs` line 800). WO-118-D019 F2: in
  every WO-118 starter run each native source writer that returned reported
  `blocked` with `requiresHuman` true, and each step was admitted.
- F3, the commit command fails under the grants. `codexWriterAccess`
  (`worker-transport.ts` lines 993-1052) grants read on `~/.gitconfig` and
  the common directory (lines 1028-1029) and write on the worktree's gitdir
  and the common `objects`, `refs` and `logs` (lines 1030-1034);
  `writer.test.ts` lines 580-584 pin the common directory as never
  writable. `sourceChangeArgs` sets `shell_environment_policy.inherit="none"`
  and an environment table holding only `PATH` (lines 969-972), so the
  writer's Git takes rerere and maintenance from the host's configuration.
  WO-118-D019 F3: codex-cli-exec 0.162.1 writers reported `git commit` exit
  128 after denials on `.git/packed-refs.lock` and `.git/rr-cache`, with the
  commit landed; WO-112-D017 qualified the grants at 0.160.0 with
  `codex sandbox -P dotln-writer --log-denials`.
- F3 reproduced while drafting (2026-10-13, this host, `git version 2.55.0`,
  `git config --show-scope --get rerere.enabled` reporting `global true`;
  scratch repositories outside the checkout; the grant shape emulated by
  POSIX permissions, a common directory without write permission beside
  writable `objects`, `refs` and `logs`, not Codex's sandbox): in a linked
  worktree `git commit` printed `error: Unable to create
  '<common>/packed-refs.lock': Permission denied`, updated the branch, then
  failed `fatal: could not create directory '<common>/rr-cache'` and exited
  128 with the commit landed, D019's shape. With `GIT_CONFIG_COUNT=2`,
  `rerere.enabled=false` and `maintenance.auto=false` in the environment the
  same commit exited 0, no `rr-cache` was created and no child process
  started; the `packed-refs.lock` error remained and was not fatal, with and
  without a `packed-refs` file. `GIT_TRACE_REFS` placed it in a second ref
  transaction's prepare after the HEAD and branch update; without
  `maintenance.auto=false`, Trace2 showed the commit starting `git
  maintenance run --auto --quiet --detach`. Inference from these
  observations and git-config(1) at 2.55.0 (`rerere.enabled`;
  `maintenance.auto`; `maintenance.autoDetach`, detaching by default): the
  `rr-cache` write and the exit 128 are rerere's; the lock attempt belongs
  to the commit itself and no configuration removes it; automatic
  maintenance would otherwise run detached from the writer's command.
- Denials are not read from the host. Product 03 §Ports records
  `observedDenials` as `unavailable` for Codex; no source under `scripts/`
  or `packages/skeleton/src/` reads the macOS unified log (`git grep` for
  `log show`, `log stream` and `log-denials` finds none); D014 and D017 read
  denials only through `codex sandbox --log-denials` at 0.160.0.
- F5, the operator path is untested. `vertical-host.ts` lines 216-227 keep
  an interrupted source-change pending when `active(true)` admits a launch;
  `runVerticalIssue` passes the operator path such an observer (lines
  777-803); `dotln.ts` prints a paused continuation and sets exit code 1
  (lines 141-152); a writer that dies by a signal rejects with
  `WorkerFailure("interrupted")` (`worker-transport.ts` lines 223-225). The
  recovery suite covers the resident path in five modes (lines 169-401), a
  direct `VerticalHost` (403-430) and host signals through the real CLI
  (432-514); `steps()` wraps `runVerticalIssue` (lines 120-131), but no case
  kills the writer itself on the operator path. The fixture writer kills
  itself before commit when `interruptWriter` is `before-commit`
  (`scripts/fixtures/vertical/writer.mjs` lines 9-10).

**Design (scope discipline):**

- **One admission sequence in `run()`.** Each rule keeps its part's place:
  settlement; `WorkerResultObserved` or `WorkerInterrupted` and the
  integrity result before cleanup and its outcome; a surviving grant refuses
  before any admission or after-test; the hold after the integrity and
  worktree checks, before the effect read, the observed-commit check, the
  committed-tree clean check and after-tests, the import, the branch, the
  ref update and the receipt. The recovery block keeps that order for a
  prior attempt. The matrices assert the record order.

Revocation (WO-112 D043):

- Two removals, each tolerant of absence, each attempted whatever the other
  did; errors collected, never swallowed: `cleanup()` returns
  `{ removed: string[], survived: { path, code }[] }` and the host records
  `CommandCleanupFailed { path, code }` for each survivor.
- Revocation is a fact, not a flag: `commandsLive` becomes false only when
  no owned file survives; while any survives, admission and the focused
  after-tests refuse with the typed reason `command-route-live` naming the
  path, the episode ends in that refusal rather than a pass, and a restart's
  `recoverTermination` re-attempts the survivors' removal and admits only
  when none survives.
- Faults are injected through the fixture (an `unlink` override per path
  and per call count), never by changing host permissions in the test tree;
  both writer accesses of `worker-transport.ts` run the same matrix.
- **Declined alternatives, recorded (D043's four, carried):** ignoring
  cleanup errors or marking commands revoked before removal (admission could
  continue with a live route); exists checks alone (one retry fixed,
  persistent failure and record ordering not); treating the resident's
  triage retry as the fix (a different boundary); a NoOp without a
  registered action (the operator's direction is the action).

Git interpretation (WO-112 D044):

- Refuse, never repair: a flagged index entry or a byte or mode that differs
  from the committed blob is a typed refusal naming the path; no candidate
  file is restored and no flag is cleared (D044's first rejected option).
- One Git interpretation for both consumers: the writer-resistant argument
  set `HOST_GIT`, already exported by `source-change-worktree.ts` (line 37)
  and used by its own Git calls, is imported by the verification worktree's
  helper as well, so a planted `core.hooksPath`, `core.fsmonitor`, replace
  ref or commit graph changes neither judgment.
- The clean check reads the flags with `git ls-files -v` and compares bytes
  and mode against `HEAD`'s tree for every tracked path (deleted files
  included), under the shared argument set; untracked files keep today's
  rule. The helper's commit, tree and blob reads are audited against the
  argument set by planted cases, and ordinary recovery is asserted to stay
  valid under the new check.
- **Declined alternatives, recorded (D044's, carried):** clearing index
  flags or restoring files (changes the candidate; can discard work);
  rejecting `skip-worktree` alone (`assume-unchanged` and the helper's own
  interpretation need their cases); widening into every Git consumer (one
  bounded qualification of the source and verification byte binding, not a
  universal claim).

Object store (WO-112 D033):

- **The comparison D033 asked for, recorded here.** A private non-shared
  writer object store with host admission keeps the writer protocol's commit
  step, keeps attribution and crash recovery where they are, removes writer
  authority over existing shared objects by construction (the writer's
  process never holds a writable handle on the shared store), and costs one
  host-side import per admitted candidate. A files-only writer with a
  host-owned commit removes the same authority but moves committing,
  attribution, interruption evidence and recovery into the host, changes the
  writer protocol for both transports, and needs live harness qualification
  (D033's second rejected option). The first is chosen; the second is the
  reopening alternative if the import proves unsound.
- **Private store, read-only alternate.** Git reads `GIT_OBJECT_DIRECTORY`
  and `GIT_ALTERNATE_OBJECT_DIRECTORIES` only from the environment (git(1)),
  so worktree creation creates a private object directory under the
  episode's confinement and records it, and the writer's launch environment
  carries both variables for each transport (the private store, and the
  shared store as the alternate). The fixtures pin the launch argument that
  carries them; whether the Codex sandbox passes them into the writer's
  shell is observed by this order's live phase (step 30, criterion 22), and
  whether the installed Claude CLI passes them into the shell its Bash tool
  runs by the Claude probe (step 31, criterion 23). The
  Codex writer's access does not include the shared store's directory. The
  Claude writer commits through the allowlisted `git add -A` and `git commit
  -F` of `sourceChangeArgs` with no operating-system sandbox around the
  commit; step 13 names the mechanism that refuses its write to the shared
  `objects/` directory (its permission allowlist or the bundle's
  outside-write refusal) and the confinement case exercises it. The
  writer's commits land in the private store.
- **No shared ref names an unimported object.** The worktree is detached at
  the base commit, so the writer's commit moves no shared ref; `verify()`
  and the observed-commit check read the detached HEAD and the recorded
  branch name; after the import the host creates the branch at the admitted
  commit (`git update-ref refs/heads/<branch> <commit>`) before the publish
  step, so the writer needs no write access to the shared `refs` and
  `logs`. The writer still runs `git commit`.
- **Host-owned import after admission.** The host fetches from the private
  store under step 10's shared argument set (the commit graph off, so an
  imported graph cannot steer later reads), verifies the imported tree
  equals the admitted tree, and only then creates the branch and moves the
  refs the publish step moves today; a failed import is a typed stop naming
  the object. The import is repeatable, and the private store is kept until
  the receipt is written, so a crash before or after it recovers by
  importing again. Concurrent `gc` or `repack` cannot remove the candidate's
  objects (not in the shared store until import) or lose existing ones to
  the writer; after import the host re-verifies the admitted commit's
  objects before success. Every host Git read before the import (`verify`, `cleanAgainstCommit`, the
  effect and the observed-commit check) runs `HOST_GIT` with
  `GIT_OBJECT_DIRECTORY` set to the private store and
  `GIT_ALTERNATE_OBJECT_DIRECTORIES` to the shared objects, because the
  candidate exists only in the private store until import; the import's
  reading side sees the private store and its writing side writes the shared
  store without those variables (for example `git pack-objects --revs` under
  the private environment piped to `git index-pack --stdin` in the shared
  repository); steps 12 and 14 name the environment of each read and a case
  asserts each read and the import (the 2026-10-21 pass).
- **Inventory stays bounded.** No repository-size object scan (D033's first
  rejected option); `sharedState()` keeps recording the common path, refs
  and alternates.
- **Declined alternatives, recorded:** hashing every loose and packed object
  (unbounded, fights repack); moving committing into the host now (the
  comparison above; reopen if the import is unsound); keeping the broad
  shared-state claim with a NoOp (the operator's direction is the action).

Requests and the Codex writer's grants (WO-118-D019):

- **A hold, not a host-verified supersession.** The host cannot know what a
  writer's request is about: its only description is the writer's free-text
  `summary` (at most 320 characters, `worker-protocol.ts` line 398), and
  deciding that an observation answered it would mean reading that prose,
  which no criterion may require and which would let a writer's text steer
  admission. Every other host already stops on the request (the gap's F2
  item), and product 02 §Independent verification v1 says an explicit
  attention request yields `NeedsHuman`, never success. With F3 repaired,
  the WO-118 cause of the requests, the commit's exit 128, is gone
  (inference from D019: each writer's uncertainty was whether its commit
  landed). Reopen when writers keep requesting attention for a cause the
  host can verify from a typed field rather than prose.
- **The hold's form.** `source-change-host.ts` exports
  `WRITER_REQUESTED_ATTENTION = "writer-requested-attention"` and ends the
  step through its existing `refuse()` with that reason: a durable
  `SourceChangeRefused` that every rerun replays, recorded after
  `WorkerResultObserved`, which already carries the writer's `status` and
  `requiresHuman`. Each consumer keeps its own vocabulary: the vertical's
  source-change step maps this reason to `held(...)`, so the receipt's
  result is `NeedsHuman` and the resident projects
  `intent-needs-human:source-change` (the projection
  `scripts/test-vertical.recovery.mjs` lines 364-399 assert); `RepairHost`
  already turns every source refusal into `NeedsHuman` with the reason as
  `offending` (`repair-host.ts` lines 415-420), and the vertical's repair
  step already holds on any repair that does not complete
  (`vertical-primitives.mjs` lines 727-731); the portfolio already records a
  refused change with its reason (`portfolio-host.ts` line 226). None of
  those three files changes.
- **Where it is decided.** After the integrity and worktree checks (a
  shared-state change still refuses first) and before the effect read, the
  observed-commit check, the after-test, the receipt and the import: a held
  candidate's objects never reach the shared store and no episode branch is
  created. A writer that reports `blocked` without a commit now ends
  `writer-requested-attention` rather than `worker-returned-no-commit`
  (WO-112-D008's first refusal shape); a `completed` writer without a
  commit still ends `worker-returned-no-commit`.
- **Recovery keeps the hold.** In `run()`'s recovery block, after the
  integrity and worktree checks, the host reads the last
  `WorkerResultObserved` of the prior attempt and refuses the same way when
  it requested attention, before any effect read or redispatch. A host
  killed before `WorkerResultObserved` is recorded leaves no envelope (a
  known issue below).
- **The receipt.** The vertical's `NeedsHuman` value carries the refusal and
  `writer: { episodeId, status, requiresHuman }` read from the source
  store's last `WorkerResultObserved`; never the `summary`, which stays in
  the store.
- **Neutralize the writer's Git writes; grant nothing new.** The Codex
  writer's environment table gains `GIT_CONFIG_COUNT` with
  `rerere.enabled=false` and `maintenance.auto=false` (git-config(1),
  ENVIRONMENT: these override configuration files and yield only to `git
  -c`). The grants step 13 leaves are otherwise unchanged: no grant names
  the common directory itself, `packed-refs`, `packed-refs.lock` or
  `rr-cache`. For the Codex writer this is a convenience, not the
  boundary: a writer that overrides it with `git -c` meets the same
  denials.
- **`packed-refs.lock` stays refused.** The commit's own second ref
  transaction attempts it and tolerates the refusal (the gap); the probe
  records it as the one expected denial under the repository's Git
  directories, with its count.
- **The Claude writer takes the same two pairs.** Its commit runs outside
  a write sandbox, so on a host with rerere enabled it would create
  `<common>/rr-cache` and may start detached maintenance in the shared
  repository (inference from the 2026-10-13 reproduction, not observed
  under Claude; `sharedState()` inventories refs and alternates only). That
  is the planning map's candidate 5 (§Candidates — returns from the
  standard pass, recorded 2026-10-13; FUP-42ef16541a8893b9), which this
  order carries because step 13 already changes that writer's launch
  environment. Step 18 adds `GIT_CONFIG_COUNT=2`, `GIT_CONFIG_KEY_0=rerere.enabled`,
  `GIT_CONFIG_VALUE_0=false`, `GIT_CONFIG_KEY_1=maintenance.auto` and
  `GIT_CONFIG_VALUE_1=false` to the Claude writer's launch environment,
  the same mechanism and values as the Codex table, beside step 13's
  object directories. The command text does not change, so the allowlist,
  which names the exact commit command (`worker-transport.ts` line 922),
  is unchanged. For this writer the pairs are what keeps rerere and
  automatic maintenance out of the shared repository; the allowlist admits
  no `git -c` form of the commit that could override them (inference from
  its exact-pattern entries, line 922). The Claude probe (step 31)
  requalifies them live.
- **The live qualification is the executor's own episode** (product 07
  §Operator-opened planning pass and §Research and guided-operator work
  orders items 4 and 5): a probe script invoked by path, never in `npm
  test`, with no operator authorization and its cost accepted (Cost). Phase
  `sandbox`, model-free, on a scratch target with `rerere.enabled true` and
  packed refs: the exact permission and environment arguments
  `canonicalWorkerArgs("codex-cli-exec", ...)` emits for a request on its
  linked worktree (never a hand-written copy), under `codex sandbox` with
  the flags D014 and D017 recorded (`-P dotln-writer --log-denials`,
  confirmed against `codex sandbox --help` at the installed CLI), run the
  commit, the commit without the `GIT_CONFIG_*` pairs (the reproduction),
  the three file creations and the network attempt criterion 21 lists; the
  network attempt is a TCP connection with a bounded timeout to an RFC 5737
  documentation address, also run outside the sandbox (inference: Seatbelt
  refuses with a permission error, while the unsandboxed attempt times out
  or finds the address unreachable). The probe's reader of Sandbox denial
  lines from the macOS unified log (`/usr/bin/log`) over the phase's window
  is calibrated by listing the control denials `--log-denials` printed; if
  the installed CLI no longer offers the subcommand, the record says so with
  the CLI version and the reader is calibrated with a write denied by
  `/usr/bin/sandbox-exec`, the confinement the host's own focused test uses
  (`source-change-worktree.ts` line 593). Phase `live`: one
  `SourceChangeHost` episode on a fresh scratch target of the same shape,
  through the real `CodexCliExecWorkOrderTransport` with `gpt-6.1-sol` at
  `max`, a one-line work order (change `fixture.txt` so `node
  fixture-test.mjs` passes), a usage callback, and a wrapping process runner
  that keeps only Codex's `command_execution` items' commands and exit codes
  from the event stream (the shape `scripts/lib/writing-worker-probe.mjs`
  lines 486-500 reads), built as WO-053's live evidence fixture builds its
  episode (`docs/evidence/WO-053/fixture.mjs`: `compileFixture` from line 54
  for the compiled scratch work order, `episode` from line 261 for the
  transport, runner and usage callback). Budget: at most two episodes; the
  second runs only after the first's cause is recorded in the decisions,
  and, when that cause is step 30's trigger, after step 30's sentence; when
  the record shows the object-directory variables did not reach the
  writer's shell, the order stops for a decision with that record; if both
  episodes fail, the executor stops before handoff with the record and a
  decision naming the cause.
- **The Claude writer's requalification is its own bounded probe.** Step 13
  puts `GIT_OBJECT_DIRECTORY` and `GIT_ALTERNATE_OBJECT_DIRECTORIES`, and step
  18 the two Git configuration pairs, into the Claude writer's launch
  environment, a transport and authority change that
  product 07 §Research and guided-operator work orders item 5 makes a
  live-requalification trigger. The fixtures pin only the environment the
  host passes, and `fixtures/writer-cli.mjs` is not the Claude CLI, so
  whether the installed CLI hands those variables to the shell its Bash tool
  runs `git commit -F` in is observable only live. It cannot fold into the
  one live feedback episode: that episode (`dotln feedback-audit`, through
  `runFeedbackSelfhost`, `feedback-selfhost.ts` line 101) drives a
  `VerificationHost` with a verifier transport (line 361) and never launches
  `SourceChangeHost` or the writer arguments of `sourceChangeArgs`; and
  product 07 §Operator-opened planning pass collapses only the feedback
  episode and the re-mint when orders merge, not a requalification. Nor can
  it fold into the Codex probe, whose phases run the Codex transport only.
  So it is a probe of its own, invoked by path and never in `npm test`
  (item 5), the executor's own episode with its cost accepted (Cost):
  `docs/evidence/WO-204/claude-writer-qualification.mjs` runs one
  `SourceChangeHost` episode on a fresh scratch target of the Codex live
  phase's shape (rerere enabled, packed refs), through the real
  `ClaudeCliPrintWorkOrderTransport` with `claude-opus-5-5` at `xhigh`
  (product 07 §Model-specific notes), the same one-line work order and a
  usage callback, built as WO-053's fixture builds its Claude episodes
  (`docs/evidence/WO-053/fixture.mjs`, `episode` from line 261). At the
  host's `afterResult` point (after settlement, before `WorkerResultObserved`)
  the probe reads the writer's commit at the worktree's detached HEAD and
  records whether it is readable from the episode's private store and
  whether it is absent from the shared store read without alternates. At
  the same point, after a bounded settle interval the record states, it
  compares the shared Git directory with the snapshot it took when the
  writer's process started (`SourceChangeProcessStarted`, through the
  host's `onEvent`, `source-change-host.ts` line 83): no `<common>/rr-cache`
  exists, and no path outside the episode's own worktree administrative
  directory (and its private store, if that lies there) was created,
  removed or changed, which covers any write
  automatic maintenance would make in the shared repository; any such path
  is recorded by name. The host then runs on, and the probe reads
  `CandidateImported` and `SourceChangeObserved`. The Claude
  writer's `--output-format json` result carries no per-command exit
  status (`worker-transport.ts` line 926), so the record judges the commit
  by where its objects are and by the host's observation. Budget: at most
  two episodes, each under the launch's USD 3.00 cap, the second only after
  the first's cause is recorded in the decisions; when the record shows
  the commit in the shared store or absent from the private store, or any
  write in the shared Git directory, the order stops for a decision with
  that record (a finding against step 13's or step 18's Claude launch
  environment); if both episodes fail, the executor stops
  before handoff with the record and a decision naming the cause.
- **One live segment.** The order owes one feedback re-mint and one live
  feedback self-host episode, and both writer requalifications are planned
  before them: the Codex sandbox phase, then the Codex live phase within its
  budget, then the Claude probe within its budget, then, because a live
  phase may make the last judged-source edit (step 30's sentence, or a
  repair that a stop decision admits), the re-mint and the one self-host
  episode (step 32). The feedback episode discharges neither
  requalification.
- **Live-run surfaces, at `6dbd8771`.** The real Codex transport with its
  default runner (`worker-transport.ts` lines 1476-1494, the runner default
  at line 1331): exists, run live in WO-118's starter runs at codex-cli-exec
  0.162.1 (D019). A `SourceChangeHost` driven directly by an evidence script
  with a real transport: exists and was run live by WO-053
  (`docs/evidence/WO-053/fixture.mjs`; product 03 §Ports cites its clean
  live source changes). Codex's JSON `command_execution` items with
  `exit_code`: read by WO-044's probe. `codex sandbox --log-denials`: run at
  0.160.0 (D014, D017), unverified at the installed CLI, with the fallback
  above. A unified-log reader: absent; step 27 builds it and step 29
  calibrates it. The private store and the import record: absent at
  `6dbd8771`; steps 12 to 14 build them before the live phase. A Codex login
  on the host: present for WO-118's runs on 2026-10-13; if absent at
  activation, the probe records `unavailable` and the executor stops before
  handoff, an operator login being the only remedy. The real Claude
  transport driving a `SourceChangeHost` from an evidence script: exists
  and was run live by WO-053 (`docs/evidence/WO-053/claude-schema.json`,
  claude 2.1.274, 2026-09-17, observed), before any private store existed.
  The `afterResult` hook the Claude probe reads at: exists
  (`source-change-host.ts` lines 81 and 1006) and WO-053's fixture uses it.
  The Claude CLI's passage of its launch environment into its Bash tool's
  shell: never observed; it is this probe's question. A Claude login for
  `claude --print` on the host: not checked by this pass; if absent at
  activation, the Claude probe records `unavailable` and the executor stops
  before handoff, with the same single remedy.
- **Privacy.** Both probes write only relativized paths (`<scratch>`,
  `<common>`, `<gitdir>`, `<store>`, `<home>`), exit codes, counts, the CLI
  version, model, effort, wall-clock and token usage; never a raw log, a
  transcript, a summary or a process identifier.
- **F5 through the real CLI.** `dotln vertical` calls `runVerticalIssue`
  (`dotln.ts` line 124) and owns the exit code, so the case runs the CLI
  with the recovery suite's preload doubles (`cli()`, lines 50-90) and the
  fixture writer killed before commit.
- **Declined alternatives, recorded:** a distinct `held` outcome with a new
  `SourceChangeHeld` event (a fourth state in the source slice the reactor
  replays, `source-change-state.ts` `sourceChangeEventTypes` line 44, and
  edits to `repair-host.ts` and `portfolio-host.ts`, when every consumer
  already ends a refused step; reopen when a consumer must resume a held
  step on an operator's answer); admitting and flagging (the candidate would
  be verified and published although the writer asked for a human); granting
  `<common>/rr-cache` (a shared directory `sharedState()` never inventories,
  `source-change-worktree.ts` line 239, and maintenance stays detached);
  granting `<common>/packed-refs.lock` (a stale lock left by a writer would
  wedge the host's and every other user's ref updates; the commit exits 0
  without it); a writable common directory (hooks and config, D017); a
  host-written `GIT_CONFIG_GLOBAL` (drops the identity the commit reads from
  `~/.gitconfig`); `-c` arguments on the commit (changes the exact command
  the Claude allowlist and the prompt name); `gc.auto=0` (the commit's only
  automatic run is `git maintenance run --auto`, which
  `maintenance.auto=false` stops).

**Execution plan (the executor follows these steps in order; steps 1 and 3
to 16 observed at `82b7fdb7`, 2026-10-11, and re-observed at `6dbd8771`,
2026-10-13, steps 12 to 14 amended then; steps 2 and 17 to 34 observed at
`6dbd8771`, step 31 added by the pass's second round from the working
tree, whose sources equal `6dbd8771`'s; each step re-reads what earlier
steps moved):**

1. Counterexample first, at the base
   (`packages/skeleton/test/source-change-integrity.test.ts`): run the
   retained probe,
   `node scripts/harness.mjs bounded -- node docs/evidence/WO-112/shared-object-counterexample.mjs`,
   and record its result in the decisions; then the file gains the same
   scenario as a case (an independent sibling commit, a writer episode that
   deletes the sibling's unique blob after the candidate completes, the deletion running inside the writer double's own process, never in
   `afterResult`, under the access step 13 gives that transport (for Codex, a
   `/usr/bin/sandbox-exec` profile emulating `codexWriterAccess`'s grants,
   darwin only, the case skipping elsewhere and saying so; for Claude, the
   mechanism step 13 names), with the emulation recorded in the decisions,
   assertion that the blob survives and the episode does not report
   `observed`); it fails until step 14. Check: `npm run build && node --test
   packages/skeleton/dist/test/source-change-integrity.test.js` (suite
   `skeleton`).
2. The operator path, at the base (`scripts/test-vertical.recovery.mjs`): a
   case after the WO-199 CLI case (line 432): fixture settings
   `interruptWriter: "before-commit"` (as lines 180-185 set them) and preload
   settings without `sleep`; `cli(f, settings)` exits 1 printing `kind`
   `pending` and `pendingStep` `source-change`; the source store holds one
   `WorkerAttemptStarted` and a `WorkerInterrupted` with reason
   `interrupted` and no `signal`; the writer's recorded group is gone; with
   the fixture settings restored and the preload clock advanced as at line
   499, a rerun exits 0 with terminal `resolved`, two `WorkerAttemptStarted`
   under one `commandId`, one `SourceChangeRequested` and `git rev-list
   --count main..fix/intent-<key>` equal to 1 (as lines 329-339). It covers
   a gap and is expected to pass at the base; if it fails there, the
   executor records the observed cause in a decision, and a defect in the
   operator path is repaired in this order (`vertical-host.ts` lines 216-227
   or `vertical-runtime.mjs` lines 777-783) so it keeps the step pending as
   the resident path does. It must keep passing through the later steps,
   which change the recovery it enters. Check: `npm run build && node --test
   --test-name-pattern='WO-204' scripts/test-vertical.recovery.mjs` (suite
   `vertical`).
3. `packages/skeleton/test/source-change-fixture.ts`: an injectable
   `unlink` (per path, per call count, persistent or once) and a reader of
   the recorded event order. Check: the fixture's own self-test case,
   `npm run build && node --test
   packages/skeleton/dist/test/source-change-host.test.js` (suite
   `skeleton`).
4. `packages/skeleton/src/source-change-command.ts`: the returned cleanup
   (lines 70 to 120) becomes two independent removals (`removeOwned(path)`
   tolerating `ENOENT`), returns `{ removed, survived }` and never throws for
   a removal failure. Check: a unit case in `source-change-host.test.ts` for
   a profile already absent (route still removed, nothing thrown), by step
   3's command (suites `skeleton`, `harness-probe`).
5. `packages/skeleton/src/source-change-host.ts`, the run loop (lines 920 to
   1070): settle the process, record `WorkerInterrupted` and the integrity
   result, then call cleanup; record `CommandCleanupFailed` per survivor;
   `commandsLive` false only when `survived` is empty; admission and the
   focused after-tests refuse with `command-route-live` naming the path
   while any survivor exists. Check: the step 7 matrix (suite `skeleton`).
6. `packages/skeleton/src/source-change-host.ts`, `recoverTermination`
   (line 588): re-attempt removal of the prior attempt's survivors and refuse
   admission until none survives. Check: the step 7 restart case.
7. `packages/skeleton/test/source-change-host.test.ts` and
   `source-change-integrity.test.ts`: the matrix: partial earlier removal;
   profile fails then route; route fails then profile; persistent failure;
   restart recovery; no after-test or admission with a live grant; each for
   both writer accesses; each asserting the record order (settlement,
   interruption where applicable, integrity, cleanup outcome). Check:
   `npm run build && node --test
   packages/skeleton/dist/test/source-change-host.test.js
   packages/skeleton/dist/test/source-change-integrity.test.js` (suite
   `skeleton`).
8. `packages/skeleton/test/verification-worktree-fixture.ts`: helpers that
   plant each interpretation (a replace ref, a commit graph, a hooks path)
   and each hidden file state. Check: the fixture's self-test (suite
   `skeleton`).
9. `packages/skeleton/src/source-change-worktree.ts`: `clean()` (line 395)
   becomes `cleanAgainstCommit()`, and its callers (`source-change-host.ts`
   lines 843 and 852; `effect()`) take the new name: run `git ls-files -v`
   under the argument set and refuse any `S` or `h` entry naming the path;
   compare each tracked path's bytes and mode with `git cat-file` of
   `HEAD`'s blob (deleted paths refuse); keep the untracked-files rule; no
   write to the worktree. Check: cases in `source-change-host.test.ts`
   planting a `skip-worktree` modified file, an `assume-unchanged` deleted
   file and an executable-bit change, each refused before any after-test
   runs (suite `skeleton`).
10. `packages/skeleton/src/verification-worktree.ts`: import `HOST_GIT` from
    `./source-change-worktree.js` (exported at line 37); the local Git
    helper takes it, and `assertWorktreeSnapshot` (line 126),
    `prepareWorktreeVerification` (line 392) and
    `prepareInterruptibleWorktreeVerification` (line 405) read commit, tree
    and blob through it. Check: cases in
    `packages/skeleton/test/verification-worktree.test.ts` planting a
    replace ref, a commit graph and a hooks path and asserting the judged
    commit, tree and blob hashes equal those read with
    `--no-replace-objects -c core.commitGraph=false` in a clean clone
    (suites `skeleton`, `evidence-sources`: the import joins two registered
    sources).
11. Recovery under the new check (`source-change-host.test.ts`): a case that
    runs an unreceipted prior attempt's recovery and a clean candidate
    through the new check and passes. Check: step 9's command (suite
    `skeleton`).
12. `packages/skeleton/src/source-change-worktree.ts`, worktree creation
    (lines 196 to 204): create the private object directory under the
    episode's confinement and add the worktree on a detached HEAD at the
    base commit (`worktree add --detach`), recording the private store's
    path and the requested branch name in the worktree's state; `verify()`
    (line 215) checks the detached HEAD and the recorded name instead of a
    checked-out branch; `sharedState()` unchanged. Check: a case that
    commits in the worktree with the two variables set and finds the
    objects in the private store and not in the shared one, and no shared
    ref moved (suites `skeleton`, `vertical`). The host's own reads of the worktree before import (`verify()` and the
    callers of `sharedState()`) run with the two variables set to the private
    store and the shared objects, and the case asserts the environment of each
    read.
13. `packages/skeleton/src/worker-transport.ts`: the writer's launch
    environment for each transport carries `GIT_OBJECT_DIRECTORY` and
    `GIT_ALTERNATE_OBJECT_DIRECTORIES` (for Codex, in the
    `shell_environment_policy.set` table beside `PATH`);
    `codexWriterAccess` (line 993) excludes the shared `objects/`, `refs`
    and `logs` and includes the private store; for the Claude transport,
    the decisions name the mechanism that refuses a write to the shared
    `objects/` directory (the `sourceChangeArgs` allowlist at lines 897 to
    931 or the bundle's outside-write refusal). Check: the confinement
    cases in `source-change-confinement.test.ts` assert a write to the
    shared store from the writer is refused under each transport's
    mechanism, and a pinned shape case in `writer.test.ts`'s canonical
    shapes case (line 405) asserts that the `shell_environment_policy.set`
    argument `canonicalWorkerArgs("codex-cli-exec", …)` emits carries both
    variables beside `PATH`: `npm run build && node --test
    packages/skeleton/dist/test/source-change-confinement.test.js
    packages/skeleton/dist/test/writer.test.js` (suites `skeleton`,
    `harness-probe`, `harness-fixtures`, `plan-refutation`).
14. `packages/skeleton/src/source-change-host.ts`, after admission: import the candidate from the private store into the shared store with a
    reader that sees the private store (`GIT_OBJECT_DIRECTORY`,
    `GIT_ALTERNATE_OBJECT_DIRECTORIES`) and a writer that does not (for
    example `git pack-objects --revs` piped to `git index-pack --stdin` in the
    shared repository), under the writer-resistant argument set, the
    pre-import reads (`verify`, `cleanAgainstCommit`, the effect and the
    observed-commit check) running with those variables set, verify the imported tree equals the
    admitted tree, record `CandidateImported { commit, objects }`, create
    the episode branch at the admitted commit, then the existing ref
    update; a failed import is a typed stop with reason `import` naming the
    object, moving no ref. Check: the publish cases in
    `source-change-host.test.ts` pass with the import step, and step 1's
    counterexample case passes (suites `skeleton`, `vertical`).
15. Recovery (`source-change-host.test.ts`): cases for a crash after import
    before the ref update (re-import is a no-op, the ref is updated once)
    and a crash before import (import from the retained private store),
    using the host's existing recovery entry (`recoverTermination`,
    `checkIntegrity`). Check: `node --test
    packages/skeleton/dist/test/source-change-host.test.js` (suite
    `skeleton`).
16. Maintenance concurrency (`source-change-host.test.ts`): cases that run
    `git gc --prune=now` and `git repack -ad` on the shared store between
    the writer's commit and the import, and between the import and the ref
    update, asserting no object loss and no success without the
    re-verification passing. Check: step 15's command.
17. `packages/skeleton/test/writer.test.ts`, reproduction first: in
    `scratch()`'s linked worktree (line 109), set `rerere.enabled true` in
    the repository's own configuration and pack its refs, remove write
    permission from the common directory (restored in `finally`; the case
    skips under uid 0, where permissions do not bind), prepare the private
    object store the table names as step 12's case does, and run `git add
    -A` and `git commit -F <message>` with the environment parsed from the
    `shell_environment_policy.set=` argument of
    `canonicalWorkerArgs("codex-cli-exec", ...)`, the identity variables the
    file's `git` helper sets, `commit.gpgsign false` in the repository's
    configuration (so a host's signing setting cannot start a child) and
    `GIT_TRACE2_EVENT` to a scratch file: exit 0, no `<common>/rr-cache`, no
    `child_start` event for `git maintenance`. Then the same with the
    table's `GIT_CONFIG_*` pairs removed: exit 128 and no
    `<common>/rr-cache` (the base behavior). Then the Claude form, in a
    fresh `scratch()` linked worktree with `rerere.enabled true` and packed
    refs whose common directory stays writable (no write sandbox surrounds
    the Claude commit): the same two commands with the environment a
    capturing runner receives from `ClaudeCliPrintWorkOrderTransport` for a
    writer request, the identity variables, `commit.gpgsign false` and
    `GIT_TRACE2_EVENT`: exit 0, no `<common>/rr-cache`, no `child_start`
    event for `git maintenance`. Both forms fail until step 18. Check:
    `npm run build && node --test packages/skeleton/dist/test/writer.test.js`
    (suite `skeleton`).
18. `packages/skeleton/src/worker-transport.ts` `sourceChangeArgs` (the
    environment table, line 972 at `6dbd8771`): append `GIT_CONFIG_COUNT`
    and the pairs `rerere.enabled`=`false` and `maintenance.auto`=`false`.
    For the Claude transport, the same mechanism and values,
    `GIT_CONFIG_COUNT=2`, `GIT_CONFIG_KEY_0=rerere.enabled`,
    `GIT_CONFIG_VALUE_0=false`, `GIT_CONFIG_KEY_1=maintenance.auto` and
    `GIT_CONFIG_VALUE_1=false`, join the writer's launch environment where
    step 13 puts the object directories (the dispatch's `env`, line 1408 at
    `6dbd8771`), replacing any inherited `GIT_CONFIG_*` entries
    (FUP-42ef16541a8893b9). `codexWriterAccess` and the Claude
    `--allowedTools` value unchanged. Check: both forms of the step 17 case
    pass (suites `skeleton`, `harness-probe`, `harness-fixtures`,
    `plan-refutation`).
19. `packages/skeleton/test/writer.test.ts`, the canonical shapes case (line
    405): assert the table holds the two pairs beside `PATH` and step 13's
    object-directory variables (beside the existing match at lines
    588-595); assert no grant names the common directory, `packed-refs`,
    `packed-refs.lock` or `rr-cache` (beside lines 580-584); the grant set
    step 13 pins and the Claude `--allowedTools` value unchanged; and the
    Claude writer's launch environment, as a capturing runner receives it
    for a writer request, holds the same five `GIT_CONFIG_*` variables
    beside step 13's object directories. Check: step 17's command.
20. `packages/skeleton/fixtures/writer-cli.mjs`: behaviors `commit-blocked`
    (commits; `blocked`, `requiresHuman` true), `commit-attention` (commits;
    `completed`, `requiresHuman` true), `commit-failed` (commits; `failed`,
    `requiresHuman` false) and `blocked` (no commit; `blocked`,
    `requiresHuman` true), through the existing `commit-` branch (line 25)
    and envelope (lines 50-57). Check: the step 21 cases (suite `skeleton`).
21. `packages/skeleton/test/source-change-host.test.ts`: for both transports
    (the loop at line 62), each step 20 behavior ends `{ status: "refused",
    refusal: { reason: "writer-requested-attention" } }`, with
    `SourceChangeRefused` after `WorkerResultObserved` and
    `SourceChangeIntegrityChecked`, no `SourceChangeObserved`, no
    `CandidateImported`, no saved receipt, for the `commit-` behaviors a
    commit left unadmitted in the episode's private store with no episode
    branch created, and a rerun returning the same outcome with the launch
    count unchanged; `commit` is still observed. A recovery case on the
    WO-199 subprocess pattern (lines 173-230) kills the host from `onEvent`
    when `WorkerResultObserved` is recorded for `commit-blocked`; the rerun
    refuses `writer-requested-attention` with one launch. They fail until
    step 22. Check: `npm run build && node --test
    packages/skeleton/dist/test/source-change-host.test.js` (suite
    `skeleton`).
22. `packages/skeleton/src/source-change-host.ts` `run()`: export the reason
    constant; after the worktree check (lines 1017-1021 at the base) and
    before the effect check (line 1022), `return
    this.refuse(WRITER_REQUESTED_ATTENTION)` when `result.envelope.status !==
    "completed"` or `result.envelope.requiresHuman`; in the recovery block
    (lines 802-813), after the integrity and worktree checks, the same
    refusal when the prior attempt's last `WorkerResultObserved` envelope
    requested attention. Check: the step 21 cases pass; the WO-052 and
    WO-199 cases in the same file and this order's cases of steps 7, 9, 11,
    14, 15 and 16 still pass (suites `skeleton`, `vertical`).
23. `scripts/fixtures/vertical/writer.mjs`: settings `sourceEnvelope` and
    `repairEnvelope` (`{ status, requiresHuman }`) applied to the envelope
    (lines 35-42) for a non-repair and a repair work order (the `_repair_`
    test, lines 11-14). Check: the step 24 case (suite `vertical`).
24. `scripts/test-vertical.mjs`: a case after the WO-123 repair case (line
    310): (a) through `runVerticalIssue` with `sourceEnvelope`
    `blocked`/true, the vertical ends terminal `NeedsHuman` at
    `source-change`, its last receipt's value carrying `refusal.reason`
    `writer-requested-attention` and `writer` with the episode, `blocked` and
    `true`, no `summary` key, and no later step dispatched; (b) with
    `plantReview` and `repairEnvelope` `blocked`/true, the vertical ends
    terminal `NeedsHuman` at `repair`, and the repair's child source store
    records `SourceChangeRefused` `writer-requested-attention`. Part (a)
    fails until step 25. Check: `npm run build && node --test
    --test-name-pattern='WO-204' scripts/test-vertical.mjs` (suites
    `vertical`, `runner-fixtures`).
25. `scripts/lib/vertical-primitives.mjs`, the source-change step (lines
    566-574): a refusal whose reason is the imported
    `WRITER_REQUESTED_ATTENTION` returns `held("source writer requested
    attention", { refusal, writer })`, `writer` read from
    `decodeLog(host.options.store.read())`'s last `WorkerResultObserved`;
    every other refusal unchanged; the repair step unchanged. Check: the
    step 24 case passes (suite `vertical`).
26. The vertical's recovery probe passes at the repaired subject: `node
    scripts/harness.mjs bounded -- node
    docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`; the two
    transports' confinement cases of step 13 pass.
27. `docs/evidence/WO-204/codex-writer-qualification.mjs`, new (this step
    creates the directory if activation has not): the probe of the Design,
    two phases (`--phase sandbox`, `--phase live`), each writing its block
    of `docs/evidence/WO-204/codex-writer-qualification.json` and exiting
    nonzero when an expectation fails; importing only built
    `packages/*/dist/` modules, as WO-053's fixture does. Check: step 28.
28. `docs/evidence/WO-204/codex-writer-qualification.test.mjs`, new: the
    probe's pure helpers (the `command_execution` exit extraction, the
    Sandbox denial-line parser and its classification, path relativization
    and `<home>` substitution) on synthetic inputs. Check: `node --test
    docs/evidence/WO-204/codex-writer-qualification.test.mjs`.
29. Sandbox phase: `npm run build && node scripts/harness.mjs bounded --
    node docs/evidence/WO-204/codex-writer-qualification.mjs --phase
    sandbox`. Check: the record's `sandbox` block meets criterion 21.
30. Live phase, within the Design's budget: `node scripts/harness.mjs
    bounded -- node docs/evidence/WO-204/codex-writer-qualification.mjs
    --phase live`. If the first episode's writer reports `blocked`, `failed`
    or `requiresHuman` while its `git commit` exited 0, then before the
    second episode `packages/skeleton/src/worker-protocol.ts`
    `writerPrompt`'s `outputInstructions` (line 523) gains one sentence: the
    commit command's exit status reports the commit, and Git's report of a
    refused lock in the shared repository is the host's to check.
    Otherwise that file is not edited. Check: the record's `live` block
    meets criterion 22; when the sentence lands, step 17's command (suite
    `skeleton`).
31. The Claude writer's live requalification, after step 30 and before
    step 32: `docs/evidence/WO-204/claude-writer-qualification.mjs`, new,
    the probe of the Design's Claude bullet, writing
    `docs/evidence/WO-204/claude-writer-qualification.json` and exiting
    nonzero when an expectation fails, importing only built
    `packages/*/dist/` modules, as WO-053's fixture does; and
    `docs/evidence/WO-204/claude-writer-qualification.test.mjs`, new, its
    pure helpers (the object-location classification, path relativization
    and `<home>` substitution) on synthetic inputs. Run, within the Design's
    budget: `npm run build && node scripts/harness.mjs bounded -- node
    docs/evidence/WO-204/claude-writer-qualification.mjs`. Check: `node
    --test docs/evidence/WO-204/claude-writer-qualification.test.mjs`; the
    record meets criterion 23.
32. Re-mints and the one live feedback episode, after the last
    judged-source edit: `npm run build`; `npm run evidence:feedback --
    --write --edition WO-204 --revision 001`; the live feedback self-host as
    `scripts/feedback-evidence.mjs` usage prints (`--record-selfhost
    <store>`), on the pinned transport; `node scripts/authority-evidence.mjs
    --write`, `node scripts/artifact-identity-evidence.mjs --write`, `node
    scripts/verification-evidence.mjs --write`; check each with `--check`
    (suites `feedback-evidence`, `authority-evidence`, `artifact-evidence`,
    `verification-evidence`).
33. Write-backs (each heading re-read at the base):
    `docs/product/03-architecture.md` §"## Session lifecycle & resilience":
    one sentence on the settlement order and the surviving-grant refusal,
    and the writer's object authority (a private store, a host-owned import
    after admission) replacing the narrowed shared-state sentence WO-112
    left, both in place; §"## Ports (what keeps work-flavored verticals
    pluggable)": one clause on the source revision guard's byte binding
    (the worktree is judged against the committed tree under the host's Git
    interpretation), the Codex writer sentence naming the grants step 13
    leaves and the environment's Git configuration (rerere and automatic
    maintenance off), one clause on the Claude writer's launch environment
    (the object directories and the same Git configuration), and one
    sentence in the envelope paragraph (a source
    writer's `status` other than `completed`, or `requiresHuman`, ends its
    step `writer-requested-attention` and the vertical records
    `NeedsHuman`), all in place. `packages/skeleton/README.md`
    §"## Source-change host (WO-052)": the results sentence names the new
    refusal. `docs/evidence/WO-204/decisions.md`: the counterexample's base
    result; the object-store comparison as a decision with the reopening
    alternative; the Claude writer's refusal mechanism; the hold over a
    supersession with its reopening condition; neutralizing over granting,
    with `packed-refs.lock` kept refused, and the same pairs for the Claude
    writer; the Claude writer's requalification as a dated discovery row
    with its shared-repository comparison; the Codex writer's qualification as the dated discovery
    row product 07 §Research and guided-operator work orders item 5 asks
    for, answering WO-112-D017's reopening. `npm run meta`; `npm run plan --
    followups --sync`, dispose FUP-6c444dbf9a4d92bb onto the Codex
    qualification's decision and FUP-42ef16541a8893b9 onto the Claude
    requalification's; the deterministic re-mints recorded
    (`docs/evidence/current.json`); `node scripts/lineage.mjs index
    --check`; `node scripts/check-publication.mjs --print-locks`; `npm run
    publication:check`.
34. Handoff: finish source edits; `npm run format` and `npm run sync` for
    stale generated artifacts; start one `npm test -- --review` in the
    background, never under the bounded wrapper (declared machinery sources
    change), and await it with `node scripts/harness.mjs evidence --wait`;
    after it passes, complete `docs/evidence/WO-204/handoff.md`; run `npm run
    test:docs` once after the last document edit; then `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline, revised 2026-10-19;
    corrected by the 2026-10-21 pass).

**Acceptance criteria (all required)**

1. A profile already removed by an earlier partial cleanup leaves the route
   removed, the revocation recorded and nothing thrown (fixture).
2. With the profile's removal failing and then the route's, and with the
   route's failing and then the profile's, the other removal is attempted,
   each failure is recorded as `CommandCleanupFailed` naming the path, and
   admission and the focused after-tests refuse with a typed reason while
   the survivor exists; the records show settlement, `WorkerInterrupted`
   where the episode was interrupted, and the integrity result before the
   cleanup outcome (fixture, both orders, both writer accesses).
3. Under persistent removal failure the episode ends in the typed refusal
   naming the surviving path, never in a pass or an `observed` status
   (fixture).
4. After a restart, recovery removes the prior attempt's survivors and
   admits only when none survives (fixture).
5. No case of the cleanup matrix reaches an after-test or an admission while
   any grant survives (fixture assertion over every case).
6. A `skip-worktree` or `assume-unchanged` index entry on a modified,
   deleted or executable-bit-changed tracked file refuses before any focused
   after-test runs, with a typed reason naming the path; no candidate file
   is restored and no flag is cleared (fixture, each case).
7. A tracked file whose bytes or mode differ from the committed blob without
   any index flag refuses the same way; a clean candidate passes (fixture).
8. With a replace ref, a commit graph or a hooks path planted by the writer,
   the commit, tree and blob hashes the verification worktree judges equal
   those read in a clean clone with replace refs and the commit graph
   disabled; publication of such a candidate is refused when its real tree
   differs from the judged tree (fixture).
9. Ordinary recovery of an unreceipted prior attempt passes under the new
   check (fixture).
10. The D033 counterexample, committed as a case, fails at the base and
    passes at the repaired subject: the independent sibling blob survives
    the writer's deletion attempt, which is refused by the writer's access attempted inside the writer double's own process under the transport's
    emulated access (step 1), never from the host's `afterResult`,,
    and the episode does not report `observed`.
11. A writer's commits land in the private object store and not in the
    shared one; a write to the shared `objects/` directory from the writer
    is refused for both transports (confinement cases).
12. After admission the host imports the candidate's objects, verifies the
    imported tree equals the admitted tree and records `CandidateImported`
    before creating the episode branch or updating any ref; no shared ref
    names an object absent from the shared store at any point of the
    episode, including between the writer's commit and the import; an
    import whose tree differs is a typed stop naming the object and moves no
    ref; the candidate publishes as before.
13. A crash after import and before the ref update, and a crash before
    import, each recover with one ref update and no duplicate import record
    (fixture).
14. `git gc --prune=now` and `git repack -ad` on the shared store during an
    episode lose no object and produce no success without the
    re-verification passing (fixture).
15. With the Codex writer's launch environment, `git commit -F` in a linked
    worktree whose repository enables rerere and whose common directory is
    not writable exits 0, creates no `<common>/rr-cache` and starts no `git
    maintenance` child; with that environment's `GIT_CONFIG_*` pairs removed
    it exits 128 (fixture; fails before step 18; skipped only under uid 0).
    With the Claude writer's launch environment, the same commit in a
    linked worktree whose repository enables rerere and whose common
    directory is writable exits 0, creates no `<common>/rr-cache` and starts
    no `git maintenance` child (fixture; fails before step 18).
16. The Claude writer's launch environment carries `GIT_OBJECT_DIRECTORY`,
    `GIT_ALTERNATE_OBJECT_DIRECTORIES` and the same `GIT_CONFIG_COUNT`,
    `rerere.enabled=false` and `maintenance.auto=false` (pins; criterion 23
    observes them live). The Codex writer's environment table carries `GIT_OBJECT_DIRECTORY` and
    `GIT_ALTERNATE_OBJECT_DIRECTORIES` beside `PATH` (the launch argument
    only; criterion 22 observes them in the writer's shell) and
    `rerere.enabled=false` and `maintenance.auto=false` through
    `GIT_CONFIG_COUNT`; no `dotln-writer` grant names the common directory,
    `packed-refs`, `packed-refs.lock` or `rr-cache`; the grant set step 13
    pins (the private store in place of the shared `objects`, `refs` and
    `logs`), `network.enabled=false`, `PATH` and the Claude `--allowedTools`
    value hold (pins).
17. For both transports, a writer that reports `blocked`, `failed` or
    `requiresHuman`, with or without a commit, ends `refused` with reason
    `writer-requested-attention`, recorded after `WorkerResultObserved` and
    the integrity check and before any effect read, observed-commit check,
    after-test, receipt, `CandidateImported` or episode branch; a rerun
    returns the same outcome without a dispatch; a `completed` writer
    without the request is admitted as before, and a `completed` writer
    without a commit still ends `worker-returned-no-commit`. A host killed
    after `WorkerResultObserved` is recorded with such an envelope refuses
    the same way on rerun, with no second dispatch and no admission
    (fixtures).
18. Through `runVerticalIssue`, a source writer reporting `blocked` with
    `requiresHuman` ends the vertical `NeedsHuman` at `source-change` with
    the refusal and the writer's episode, status and `requiresHuman` in its
    receipt and no `summary`; a repair writer doing the same ends it
    `NeedsHuman` at `repair` with the child source store recording
    `writer-requested-attention`; other source refusals still end `refused`
    (fixture).
19. `dotln vertical` with the fixture writer killed before commit exits 1
    printing a pending continuation at `source-change`, with
    `WorkerInterrupted` reason `interrupted` and no signal; a rerun exits 0
    resolved with two writer attempts under one command, one
    `SourceChangeRequested` and exactly one commit on the intent branch
    (fixture, at the repaired subject).
20. The vertical's recovery probe passes at the repaired subject, and both
    transports' confinement cases pass.
21. The Codex probe's `sandbox` record, at the installed Codex CLI and under the
    launch's own permission and environment arguments, on a target with
    rerere enabled and packed refs: `git add -A` and `git commit -F` exit 0;
    creating a file in `<common>`, in `<common>/hooks` and outside the
    scratch root is denied; the network attempt fails with an error code
    the unsandboxed attempt does not produce, both recorded; the commit
    without the `GIT_CONFIG_*` pairs is recorded with its exit status and
    denials; the unified-log reader lists every control denial
    `--log-denials` printed (or, where the subcommand is absent, the record
    names the CLI version and the `sandbox-exec` calibration).
22. The Codex probe's `live` record, within at most two episodes (a second only
    after the first's cause is recorded in the decisions, and, when that
    cause is step 30's trigger, after step 30's sentence): one Codex writer
    episode on `gpt-6.1-sol` at `max` through `SourceChangeHost` on a target
    with rerere enabled and packed refs returns `completed` with
    `requiresHuman` false; Codex's event stream records the `git commit -F`
    command with exit code 0; the host records `CandidateImported` and then
    `SourceChangeObserved`, which together with that exit code is this
    order's live observation that the Codex sandbox passed
    `GIT_OBJECT_DIRECTORY` and `GIT_ALTERNATE_OBJECT_DIRECTORIES` into the
    writer's shell (the writer holds no write access to the shared objects);
    the calibrated reader over the writer's process window
    (`SourceChangeProcessStarted` to `SourceChangeProcessStopped`) names no
    denied path under the scratch repository's common directory, gitdir,
    private store or worktree other than `<common>/packed-refs.lock`, whose
    count is recorded; the record carries the CLI version, model, effort,
    wall-clock and token usage, and no home-directory path.
23. The Claude probe's record, within at most two episodes (a second only
    after the first's cause is recorded in the decisions): one Claude writer
    episode on `claude-opus-5-5` at `xhigh` through `SourceChangeHost` and
    the real `ClaudeCliPrintWorkOrderTransport`, on a target with rerere
    enabled and packed refs, returns `completed` with `requiresHuman` false;
    at the host's `afterResult` point the writer's commit is readable from
    the episode's private store and absent from the shared store read
    without alternates, which is this order's live observation that the
    installed Claude CLI passed `GIT_OBJECT_DIRECTORY` and
    `GIT_ALTERNATE_OBJECT_DIRECTORIES` to the writer's `git commit`; at the
    same point, after the settle interval the record states, no `rr-cache`
    and no maintenance write appear in the shared repository: against the
    snapshot taken at `SourceChangeProcessStarted`, no `<common>/rr-cache`
    exists and no path in the shared Git directory outside the episode's
    own worktree administrative directory (and its private store, if that
    lies there) was created, removed or changed, which is this order's live
    observation that the CLI also passed the Git
    configuration pairs; the host then records `CandidateImported` and
    `SourceChangeObserved`; the record carries the CLI version, model,
    effort, wall-clock and token usage, and no home-directory path.
24. Write-backs land as step 33 lists them, each in place with no dated
    paragraph: product 03 §Session lifecycle & resilience (the settlement
    order with the surviving-grant refusal and the writer's object authority,
    a private store and a host-owned import after admission, replacing the
    narrowed shared-state sentence; no sentence count binds it) and §Ports (the clause, the Codex writer sentence, the Claude writer
    clause and the writer-request sentence); the skeleton README sentence;
    the decisions file with every record step 33 names; FUP-6c444dbf9a4d92bb
    disposed onto the Codex qualification's decision and
    FUP-42ef16541a8893b9 onto the Claude requalification's; the
    deterministic re-mints recorded;
    the publication locks refreshed. No byte figure binds these write-backs.
25. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
    clean; no new dependency; the feedback edition re-minted once
    (`--edition WO-204 --revision 001`) and the one live feedback self-host
    episode run after the last judged-source edit, its edition checking
    current; the authority, artifact-identity and verification editions
    re-minted deterministically and checking current.

**Deliverables:** the revocation (independent removals, recorded outcome,
reordered settlement, restart re-attempt) with its fault injection and
matrix; the shared argument set, the committed-tree clean check and the
helper's writer-resistant reads with their planted cases; the committed
counterexample, the private store on a detached worktree, writer access
without the shared store, the host-owned import and its record, with the
recovery and maintenance cases; the writer-request rule and its recovery,
the vertical's hold mapping, both writers' Git configuration pairs and
their fixtures and cases; the operator-path case; the Codex and Claude
probes, their tests and their records; the re-minted editions and the one live feedback episode; the
write-backs below.

**Preflight:** `npm test -- --only skeleton` for steps 1 and 3–22,
`npm test -- --only harness-probe` for steps 4, 13 and 18,
`npm test -- --only harness-fixtures` and
`npm test -- --only plan-refutation` for steps 13 and 18,
`npm test -- --only evidence-sources` for step 10,
`npm test -- --only vertical` for steps 2, 12, 14 and 22–25,
`npm test -- --only runner-fixtures` for steps 2 and 24,
`npm test -- --only skeleton` for step 30 when its sentence lands,
`npm test -- --only feedback-evidence`,
`npm test -- --only authority-evidence`,
`npm test -- --only artifact-evidence` and
`npm test -- --only verification-evidence` for step 32, and
`npm run test:docs` when a document changes (steps 27 to 33), each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the matrices, planted cases and counterexample under
`node --test`; the confinement cases for both transports; the operator-path
and vertical cases; the recovery probe; the two probes' helper tests; the
Codex probe's `sandbox` and `live` records and the Claude probe's record;
the feedback edition's check and the other editions' checks; `npm run
test:docs`; `npm test -- --review` before `implementation-ready` (declared machinery
sources change); final review reuses the passing complete row at the
integrated code identity when one exists (product 07 §Preflight before the
full gate). The live rows: the
Codex writer episode or episodes, the Claude writer episode or episodes and
the one feedback self-host episode.

**Write-back duty:** as listed in criterion 24.

**Known issues and carry-ins:**

- Merged 2026-10-13 (planning document §12): one feedback re-mint and one
  live feedback episode replace the four the constituents owed (planning
  document §6 found the 2026-10-11 Costs of the revocation,
  Git-interpretation and object-store parts denying the feedback-judged
  sources they edit, as WO-199 already treated `source-change-host.ts`).
- FUP-6b6274b0176af00d (WO-112 D043), FUP-7777b9f12644e560 (WO-112 D044)
  and FUP-fadd2376e82a909e (WO-112 D033) are allocated here at the
  operator's direction. Their reopening observations (a host unlink
  failure; an index-flag or configuration counterexample reaching these
  paths live) have not occurred, and the matrix and planted cases stand in
  for them; the D033 row's followup asked for the design comparison, which
  the Design records and the decisions file binds.
- FUP-6c444dbf9a4d92bb (WO-118-D019 F2, F3 and F5) is allocated here.
  FUP-c842faafbe34c7da and FUP-7f40c3911091d5ad are disposed by the
  2026-10-13 pass as its duplicates; WO-112-D017's other reopening
  conditions (a Codex release changing the metadata-protection rule; a
  host's node or git outside the grants) stay in force through that
  disposition.
- Receipt 044's two Git-interpretation known issues, carried by the
  2026-10-13 standard pass (planning document §6), which re-observed the
  order at `6dbd8771` and found its cited sources unchanged since
  `82b7fdb7`: the objective refuses any skip-worktree or assume-unchanged
  entry while criterion 6 covers flagged entries on changed files, and a
  sparse checkout carries skip-worktree on unmodified out-of-cone entries
  (reopen when a target repository profile or governed worktree uses sparse
  checkout and the check refuses a candidate whose only flagged entries are
  unmodified out-of-cone paths); and the whole-tree comparison is measured
  only on the skeleton fixture (reopen when a vertical or WO-083 receipt
  records the comparison taking longer per episode than the focused
  after-tests on the same target). Neither has occurred: no sparse checkout
  appears in a repository profile, the configuration or the skeleton
  sources.
- 2026-10-13 standard pass (planning document §6): receipt 044's
  object-store known issue (the writer's commit moves a shared branch ref
  before import, so "only then updates the refs" and the import criterion
  could not both hold) is true in source and resolved in the text: the
  detached worktree and the branch created after import (steps 12 and 14);
  the object directories in the launch environment, which Git alone reads;
  the Claude writer's mechanism named by step 13; the machinery suites the
  three `worker-transport.ts` declares.
- The fixtures pin only the launch argument that carries
  `GIT_OBJECT_DIRECTORY` and `GIT_ALTERNATE_OBJECT_DIRECTORIES` (step 13,
  criterion 16). Whether the installed Codex CLI passes them into the
  writer's shell is observed by this order's live phase (step 30, criterion
  22: the commit exits 0 and the host records `CandidateImported` and
  `SourceChangeObserved`); a failure there is a finding against this
  order's grants, and the order stops for a decision with that record.
- WO-118-D003's in-resident retry is not changed here. `vertical-host.ts`
  (lines 216-227) keeps an interrupted source-change pending under the same
  command and leaves termination and recovery to the source host, so a
  retry on either path re-enters `run()`'s recovery block
  (`source-change-host.ts` lines 802-813), which steps 6 and 22 change; the
  resident path's five modes stay in the recovery suite
  (`scripts/test-vertical.recovery.mjs` lines 169-401), and step 2 adds the
  operator path (criterion 19). D003 itself leaves the cleanup and
  surviving-grant obligations here, and the resident's triage retry stays a
  non-goal (WO-112 D043).
- Line numbers are `6dbd8771`'s. Steps 3 to 16 edit `run()`,
  `recoverTermination`, `sourceChangeArgs` and `codexWriterAccess` before
  steps 17 to 30 do, so the executor re-reads each at its step. Because
  step 12 changes how the writer's commit reaches the shared refs (a
  detached HEAD; the host creates the branch after import), criterion 22
  still admits only `packed-refs.lock` as a denial, and any other denial is
  a finding recorded against this order's grants.
- `SourceChangeRefused` carries exactly `workOrderId` and `reason`
  (`source-change-state.ts` `decodeSourceRefusal`, line 158) and `refuse()`
  takes a reason only (`source-change-host.ts` line 721). Where a refusal
  here names a path or an object, the decisions record whether it travels
  in the reason or beside it (as `CommandCleanupFailed` carries the path),
  since a new payload field changes the shape every rerun replays
  (inference from those two lines).
- A host killed after the writer returns and before `WorkerResultObserved`
  is recorded (the WO-199 `after-commit` point, `afterResult` at line 1006)
  leaves no envelope: the host saves no writer result
  (`source-change-host.ts` has no `saveResult`), so the rerun admits on the
  host's own observation as today. Persisting the envelope before
  settlement is outside this order; reopen when a run loses a request in
  that window.
- The `packed-refs.lock` refusal remains on every Codex writer commit as a
  non-fatal, recorded denial; a Git release that makes it fatal reopens the
  grant decision.
- The Claude writer gains the two object-directory variables (step 13)
  and the two Git configuration pairs (step 18) in its launch environment.
  Product 07 §Research and guided-operator work orders item 5 names a
  transport or authority change as a live-requalification trigger, and no
  merged order planned a live Claude writer episode; the 2026-10-13 pass's
  second round added one as its own bounded probe (step 31, criterion 23),
  because the one live feedback episode runs a verifier through
  `VerificationHost` and never launches the writer (the Design's Claude
  bullet).
- FUP-42ef16541a8893b9 (the planning map's candidate 5, §Candidates —
  returns from the standard pass, recorded 2026-10-13: the Claude source
  writer on a host with rerere enabled) is allocated here by the planner's
  2026-10-13 decision. Its reopening condition, an order changing the
  Claude writer's launch environment, is met by this order's step 13, so
  the candidate is folded in: the Claude writer takes the Codex writer's
  two pairs (step 18; fixture, criterion 15), and the Claude probe asserts
  live that no `rr-cache` and no maintenance write appear in the shared
  repository on a rerere-enabled target (criterion 23). Its premise, that
  the Claude commit creates `<common>/rr-cache` and may start detached
  maintenance, is an inference from the 2026-10-13 reproduction, not
  observed under Claude. The probe's comparison names every changed path in
  the shared Git directory; a path that is neither rerere's nor
  maintenance's (for example a ref transaction of the commit itself) still
  stops the order for a decision, which records it.
- A CLI login (Codex or Claude) is credential entry on the host, not a
  change to any repository, and stays the operator's: no role handles
  credentials. The operator's 2026-10-13 direction (planning document
  §12.1) gives every repository change to a role; a login changes no
  repository, so it stays outside that direction and cannot be automated.
  Each probe records `unavailable` when its login is absent, and the
  executor stops before handoff.
- The byte comparison costs one `cat-file` per tracked path at each clean
  check and the import one `git fetch` per admitted candidate; the executor
  records each on the vertical fixture and, above one second, records the
  cause rather than sampling paths.
- The skeleton suite's duration (289.9 s thirty-day median on 2026-10-11)
  and the vertical task's (725.851 s at WO-199's repair gate) are recorded
  at handoff; growth above twice the thirty-day median is a decision, not a
  trimmed case.
- D027's refusal of concurrent shared-repository activity stays as
  recorded; maintenance concurrency is the case this order adds, not a
  change to that refusal.
- The files-only writer with a host-owned commit is the reopening
  alternative, recorded in the decisions with its trigger: the import proves
  unsound in a case this order cannot make pass.
- The probes' records must carry no home-directory path (WO-188 assumption
  7); since WO-213 (closed, v0.83.0) the document check fails a new absolute
  home path in a JSON, JSONL, log or text record under the document roots, so
  `npm run test:docs` screens both probe records (corrected by the 2026-10-21
  pass).

**Non-goals:** the resident's triage retry (a different boundary, D043);
changing host permissions in any fixture; a new command, or a new state in
the source-change slice the reactor replays (the hold is a refusal);
qualifying every Git consumer in the repository; restoring or repairing a
writer's candidate; changing what a verification judges beyond its Git
interpretation; a repository-size object inventory; moving committing into
the host, a files-only writer or a host-owned commit (the reopening
alternative); changing the writer protocol's commit step for either
transport; any claim about repositories the writer never touches; the
Claude writer's allowlist; Git configuration for either writer beyond the
two pairs; host-observed denial accounting in the writer envelope (`observedDenials`
stays `unavailable` for Codex); credential-read controls beyond the existing
read-root guard (`worker-transport.ts` lines 1036-1043); any new grant on
the shared Git directory; resuming a held step on an operator's answer;
persisting the writer result before settlement; reading the writer's
summary; WO-083's route; the resident live-status rows FUP-2b9a8e696b38fb97
and FUP-eeb25ea9315438ad; the portfolio observation schema.

**Operator-review assumptions**

1. The fault matrix stands in for the unobserved host unlink failure; a
   later observed unlink failure is new evidence for a repair, not a reason
   to wait.
2. Both writer accesses are covered by the same revocation matrix; the
   order's live episodes are the Codex writer qualification, the Claude
   writer requalification and the one feedback self-host episode.
3. Refusing a flagged or drifted candidate, rather than repairing it, is the
   accepted behavior; the writer re-runs.
4. One shared argument set serves both Git consumers; a consumer that needs
   a different interpretation is a new decision, not an exception here.
5. A private object store with a host-owned import is the accepted
   mechanism; the files-only alternative waits for evidence that the import
   is unsound.
6. The retained probe is the counterexample; the test case reproduces its
   scenario inside the skeleton suite so the gate carries it.
7. A writer's request ends its source-change step; the host never decides
   from the writer's prose that its own observations answered it.
8. `packed-refs.lock` stays refused as a recorded, non-fatal denial rather
   than granted.
9. For the Codex writer, Git configuration in the environment is a
   convenience, not a boundary: the shared Git directory stays unwritable
   whatever the writer sets. For the Claude writer, whose commit runs
   outside a write sandbox, the two pairs are what keeps rerere and
   automatic maintenance out of the shared repository, and its exact
   commit allowlist is what keeps a `git -c` override out.
10. The live Codex writer qualification, the live Claude writer
    requalification and the live feedback episode are the executor's own
    episodes, run with no operator authorization and their cost accepted.
11. A requalification product 07 §Research and guided-operator work orders
    item 5 triggers is owed separately from the feedback episode; merging
    orders collapses only feedback episodes and re-mints.
