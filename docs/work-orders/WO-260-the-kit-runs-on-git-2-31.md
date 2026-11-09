# WO-260 — The kit runs on Git 2.31.0: the six Git forms above it replaced, the declared floor lowered to the operator's work laptop's Git, and a recorded Git surface that stops the next newer form at the gate

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** patch. The declared Git floor lowers from 2.40.0
to 2.31.0; six Git forms the kit calls are replaced by forms Git 2.31.0 has;
one core-only structural check and its recorded file; one shim fixture and
its cases; no instance action. Assigned at activation under the standing
opt-out default.
**Cost:** adds, in `scripts/lib/git.mjs`, one tree-entry reader and one
isolated-configuration environment; in `packages/skeleton/src/gate-evidence.mjs`
(`gateCodeIdentity`), a temporary index for the classification at a committed
revision, which is recurring work in every gate and close that computes an
identity at a revision (one `read-tree` and one `check-attr --cached` where
one `check-attr --source` ran; unmeasured today, and measured by this order as
that function's time before and after on this repository's tree, recorded in
the decisions); in `scripts/structural-checks.mjs`, the core-only Git surface
check, recurring work in core's structural phase (a scratch extractor of the
same reading ran in 0.91, 0.93 and 0.94 s over `scripts/` and `packages/` on
this host on 2026-11-08; the order records the check's own time); the recorded
surface file; the below-floor shim fixture and its cases, run by the
`runner-fixtures` suite; changed
call sites in the eight source files of steps 2 to 7 and the fixtures of
step 8. Removes these states: Git 2.31.0 to 2.39 refused by `harness check`,
`harness evidence` and every `npm test` selection; an order's publish unable
to read its own body; a release close stopped at the classification; a target
order's record and planning reads failing; the main-intake grant unresolved;
the stash prune stopped as an unsupported backend; the source-change
admission refusing every candidate; a probe, its fixture payload and eight
test files whose Git reads the developer's own configuration; one release
fixture case that expects the stop. Tokens and wall-clock: unknown until this order's handoff
records them. Re-mints: the editions `packages/skeleton/src/gate-evidence.mjs`
and `packages/skeleton/src/harness-host.ts` stale, deterministically (both
are registered evidence sources); `packages/skeleton/src/source-change-worktree.ts`
is in `FEEDBACK_SOURCE_PATHS`, so step 6 owes the feedback re-mint and one
live feedback self-host episode unless `npm run evidence:feedback` shows the
edition's judged behavior and the regenerated report unchanged (WO-154 D001),
which the executor establishes before deciding and records. Steps: the
executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-08 (ignored
capture SHA-256
`a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`), item 2:
the operator's work laptop runs Git 2.31.0 and the floor v0.121.0 declared
refuses it, which the operator classed as a hard block and recorded as a
standing rule (the planning document's `Rules recorded` block);
[WO-258-D009](../evidence/WO-258/decisions.md#wo-258-d009)'s own reopening
condition (a host below 2.40.0 that the operator needs), which that host met
on the day the decision was written; the private instance's block of
2026-11-07, item 2 (two of the six forms observed failing on Git 2.31,
ignored capture SHA-256
`123eb18018301f41fb4b107f0fb0ad53eb40eb38b13c75a906f588dc913c6cd6`).
**Depends on:** WO-258 (closed, v0.121.0: the floor judgment, its three
callers, the classification failure's message and the `host-runtime` blocker
class this order keeps and re-points).
**Recommended placement:** first, ahead of the active WO-244: the operator's
work laptop is refused by every gate today. Its call sites are disjoint from
WO-244's planning machinery except for separate hunks of
`packages/skeleton/src/harness-host.ts`, `scripts/test-runner.mjs`,
`scripts/test-harness.mjs` and the kit guide, so the operator may dispatch it
beside the active order; whichever reaches final review second takes the
other's merge through `worktree integrate`.
**Cites (read these sections):** `scripts/lib/node-engines.mjs`
(`declaredGitFloor`, `judgeGitRuntime`, `judgeRunningGit`);
`scripts/structural-checks.mjs` (`checkHost`); `scripts/harness.mjs`
(`requireDeclaredNode`); `packages/skeleton/src/gate-evidence.mjs`
(`gateCodeIdentity`); `scripts/worktree.mjs` (`readTrackedTextAtHead`);
`scripts/lib/target-records.mjs` (`validateTargetRecordsCommit`);
`scripts/lib/target-record-reader.mjs` (`readTargetRecord`);
`scripts/lib/target-planning.mjs` (`publishTargetPlanning`);
`packages/skeleton/src/harness-host.ts` (`outsideWriteResponse`, the
`main-intake` grant); `scripts/lib/stash-drop.mjs` (`dropInventoriedStash`);
`scripts/lib/harness-prune.mjs` (`pruneContext`);
`packages/skeleton/src/source-change-worktree.ts` (`verify`);
`scripts/lib/authority-probe.mjs` (`gitEnvironment`); the kit guide §First
steps and §What runs here, and what does not; product 07 §Operator-opened
planning pass (the host-refusal screen this order's pass recorded).

**Objective:** Every script, hook and fixture of the kit runs on Git 2.31.0,
the Git on the operator's work laptop. `package.json` declares that floor,
no call site names a Git form above it, and core's gate refuses a change
that adds one until someone has confirmed the form against that floor.

**Observed gap (dated 2026-11-08 at `main` `13e8d47eb`, v0.122.0):**

- The floor. `package.json` reads `engines.git` `>=2.40.0`.
  `scripts/harness.mjs` (`requireDeclaredNode`, for `check` and `evidence`),
  `scripts/structural-checks.mjs` (`checkHost`, the `host` task) and
  `scripts/test-runner.mjs` (the selection's leading refusal) each call
  `judgeRunningGit`, so on Git 2.31.0 every gate command refuses before it
  runs anything. WO-258's own evidence names that version as the refused
  case (`docs/evidence/WO-258/handoff.md`, criterion 5), and its decision
  rejected making the kit work there in favor of one refusal.
- The six forms. Each was read at its call site and checked against Git
  2.31.0's own manual sources (the `Documentation/` text of tag `v2.31.0`,
  fetched from the Git project's public repository into session scratch) and
  the release notes installed with Git 2.55.0. Git 2.31.0's manual names none
  of them:

  | Form | First release | Call sites | What happens on Git 2.31.0 |
  | --- | --- | --- | --- |
  | `check-attr --source=<revision>` | 2.40 | `gateCodeIdentity` | exit 129; the identity at a committed revision throws, so a release close stops at its classification |
  | `ls-tree --format=` | 2.36 | `readTrackedTextAtHead`; `validateTargetRecordsCommit`; `readTargetRecord`; `publishTargetPlanning` | exit 129; an order's publish reports its own body as not tracked, and a target order's record and planning reads refuse |
  | `worktree list --porcelain -z` | 2.36 | `outsideWriteResponse` (`main-intake`) | exit 129; the grant for the main checkout's intake does not resolve |
  | `rev-parse --show-ref-format` | absent from the 2.31.0 manual; present in 2.55.0's | `dropInventoriedStash`; `pruneContext` | an older `rev-parse` prints an unknown flag back and exits 0, so the backend reads as not `files` and the stash prune stops |
  | `fsck --no-references` | absent from the 2.31.0 manual; present in 2.55.0's | `verify` in `source-change-worktree.ts` | exit 129; every source-change candidate is refused |
  | `GIT_CONFIG_GLOBAL` | 2.32 | `gitEnvironment` in `authority-probe.mjs`; `scripts/fixtures/authority-effect.mjs`; `scripts/test-harness.mjs`; `scripts/test-launchpad-update.mjs`; `scripts/test-release.sh`; `scripts/test-target-publication-fixture.mjs`; `scripts/test-target-publish.mjs`; `scripts/test-target-worktree-close.mjs`; `scripts/test-target-worktree-publish.mjs`; `scripts/test-target-worktree-release.mjs` | ignored; the probe's and the fixtures' Git reads the developer's own global configuration, and a fixture that redirects its remote through that file reaches the real host name |

  The first, third and sixth entered between 2026-09-15 and 2026-09-19, the
  fourth on 2026-09-25, the second on 2026-10-15 and 2026-10-20 and the
  fifth on 2026-10-25 (`git log -S` on each string): six forms in six weeks,
  none noticed by a gate, because every gate here runs on Git 2.55.0.
- What the reading covers and does not. The method was static: an extractor
  listed 673 subcommand and option pairs, 43 `GIT_*` names and the
  configuration keys that `scripts/` and `packages/` name; each pair was
  compared with the 2.31.0 manual page of its subcommand, and format atoms,
  pretty placeholders, standard-input verbs and matched output text were
  read by hand. Arguments assembled at run time are outside a static
  reading. No Git 2.31.0 binary ran: this host holds Git 2.55.0, 2.54.0 and
  2.50.1 and no older one, and the planning session's attempt to build
  2.31.0 from the Git project's tarball was denied by the host's auto-mode
  classifier before any download. The instance's block reports two of the
  six forms failing on Git 2.31; which Git ran each other step of that
  instance's first cycle is unknown.
- One behavior difference that is not a failure, for the executor to confirm
  on a real binary: `-c core.fsmonitor=false` (in `nestedGitArgs`,
  `HOST_GIT_READ`, `HOST_GIT` and three call sites) is a boolean from Git
  2.36 on and a hook path before it, where Git runs a command named `false`,
  takes its failure as "everything may have changed" and scans in full. The
  result is the same and the cost is one process per index refresh.
- The tests that pin the stop: `scripts/test-runner.test.mjs` (the Git floor
  case asserts `>=2.40.0` and refuses 2.31.0 and an Apple-suffixed 2.39.3)
  and `scripts/test-release.sh` (`release_case_git_floor` expects a dry run
  stopped with class `host-runtime` under a Git without `--source`).

**Design (scope discipline):**

- Replace each form with one Git 2.31.0 has, in place, with no version
  switch: the code that runs on the laptop is the code every gate here runs.
  Rejected: branching on `git --version` at each site (the axis is what the
  gate proves: a branch taken only on an old Git is a branch no gate here
  executes, which is how these forms went unnoticed).
- The classification at a committed revision reads that revision's
  attributes through a temporary index (`GIT_INDEX_FILE`, `read-tree`,
  `check-attr --cached`). Rejected: a temporary checkout of the revision
  (the axis is cost and effect: a checkout writes every file, an index
  writes one). Rejected: reading `.gitattributes` with a parser of our own
  (the axis is fidelity: Git's own matcher answers, and a hand-written
  reader of attribute syntax is the kind of parser this repository has
  decided to stop adding).
- A fixture's Git is isolated by where its home is, which every Git honors,
  with `GIT_CONFIG_GLOBAL` kept beside it for a Git that reads it.
  Rejected: `GIT_CONFIG_COUNT` pairs alone (the axis is isolation: they add
  settings and do not stop a Git from reading the developer's own file,
  which on a managed host may rewrite URLs or sign commits).
- The floor stays a named refusal, at the version the gate has evidence
  for. Rejected: removing the judgment (the axis is the reader: a Git below
  2.31.0 fails inside `rev-parse --path-format` or the environment's
  configuration pairs with a message that names neither). An instance on an
  older Git lowers `engines.git` in its own `package.json`, as the kit guide
  will say; the line is the one declared place.
- A recorded Git surface, checked in core only. `scripts/lib/git-surface.json`
  lists every subcommand and option pair and every `GIT_*` name the kit's
  scripts and tests name, with the floor they were confirmed against; the
  check extracts the same reading from the tree and fails on a pair or name
  the record lacks, naming it and its file and line, so a new Git form
  becomes one reviewed line instead of a surprise on another host. Rejected:
  shipping the option list of Git 2.31.0's manual and deciding
  automatically (the axis is provenance: that list is derived from the Git
  project's GPL-licensed documentation, and whether to carry data derived
  from it is the operator's decision, not an order's). Rejected: running the
  check in an instance (the axis is ownership: the kit's scripts are
  authored and proven in core, and an instance's own scripts are not core's
  to refuse).
- Two kinds of evidence, named for what each proves. The below-floor shim
  is a Git that refuses the six forms the way Git 2.31.0 does; it proves
  the call sites no longer use them and that the cases would fail if one
  returned. A real Git 2.31.0 proves behavior the shim cannot know. The
  real binary is a host condition (criterion 5), and the operator's laptop
  is the standing instance of it.

**Execution plan (the executor follows these steps in order; observed at `13e8d47eb`, 2026-11-08):**

1. `scripts/fixtures/git-below-floor/git` (new; `scripts/fixtures/` exists)
   and `scripts/test-git-floor.mjs` (new), added to the files the
   `runner-fixtures` row of `scripts/test-runner.mjs`'s task table runs,
   with its sources declared. Its cases put the shim's directory first on
   the path themselves, or the directory `DOTLN_FLOOR_GIT` names when that
   variable is set (step 11). The shim runs the host's Git, except that it prints `git version 2.31.0`
   for `--version`, exits 129 with Git's unknown-option wording for
   `check-attr --source`, `ls-tree --format`, `worktree list` with `-z` and
   `fsck --no-references`, prints the flag back for
   `rev-parse --show-ref-format`, and removes `GIT_CONFIG_GLOBAL` and
   `GIT_CONFIG_SYSTEM` from the environment before it runs Git. The file's
   first cases prove each of those six behaviors of the shim itself. Check:
   `npm test -- --only runner-fixtures`.
2. `scripts/lib/git.mjs`: a new export that returns one tree entry's mode,
   type and object for a revision and a literal path from `ls-tree -z`'s
   default output, or null when the path is absent. `scripts/worktree.mjs`
   (`readTrackedTextAtHead`), `scripts/lib/target-records.mjs`
   (`validateTargetRecordsCommit`), `scripts/lib/target-record-reader.mjs`
   (`readTargetRecord`) and `scripts/lib/target-planning.mjs`
   (`publishTargetPlanning`) read through it, each keeping the refusal it
   prints today. Check: `npm test -- --only runner-fixtures` (each reader under
   the shim), `npm test -- --only worktree`, `npm test -- --only
   target-worktree` and `npm test -- --only target-publish`.
3. `packages/skeleton/src/gate-evidence.mjs` (`gateCodeIdentity`): at a
   committed revision, populate a temporary index from the revision under an
   owned temporary root, ask `check-attr --cached` with that index, and
   remove the root in every exit; the working-tree branch is unchanged, and
   the failure keeps WO-258's message and `host-runtime` class for a Git
   that fails for another reason. Record the function's time on this
   repository's tree before and after. Check: `npm test -- --only runner-fixtures`
   (the identity at a revision under the shim equals the identity the host's
   Git computes for that revision) and `npm test -- --only release`.
4. `packages/skeleton/src/harness-host.ts` (`outsideWriteResponse`, the
   `main-intake` case): read the main checkout from `worktree list
   --porcelain` without `-z`, as the other readers of that output do (two in
   this file, `scripts/lib/git.mjs` and `gate-evidence.mjs`), and leave the
   grant unresolved with its present cause when the first line is not a
   plain absolute path. Check:
   `npm test -- --only harness-fixtures`.
5. `scripts/lib/stash-drop.mjs` (`dropInventoriedStash`) and
   `scripts/lib/harness-prune.mjs` (`pruneContext`, `stashBackend`): read the
   reference backend from the repository's `extensions.refStorage`, absent or
   `files` meaning files, as `source-change-worktree.ts` already reads it.
   Check: `npm test -- --only runner-fixtures` and the prune cases of
   `npm test -- --only harness-fixtures`.
6. `packages/skeleton/src/source-change-worktree.ts` (`verify`): run `fsck`
   with `--no-references` and, when Git exits 129 on it, once without, since
   a Git that lacks the option checks no reference database either. Before
   editing, run `npm run evidence:feedback` and record whether this edit
   owes the live episode (Cost). Check: `npm test -- --only skeleton` and
   `npm test -- --only runner-fixtures`.
7. `scripts/lib/git.mjs`: a new export giving the environment that isolates
   a child Git's global and system configuration on every supported Git (a
   home directory and an XDG configuration home inside the caller's fixture
   root, the file at that home's `.gitconfig`, `GIT_CONFIG_NOSYSTEM`, and
   `GIT_CONFIG_GLOBAL` naming the same file). `scripts/lib/authority-probe.mjs`
   (`gitEnvironment`) and `scripts/fixtures/authority-effect.mjs` use it.
   Check: `npm test -- --only runner-fixtures` (a setting planted in the real
   home's Git configuration does not reach the probe's Git under the shim).
8. The eight test files of the Observed gap's last table row use step 7's
   export; where a fixture's other children need the real home (a stubbed
   `gh`, `npm`), the executor passes the redirected home only to the Git
   children and records which fixtures needed that. Check: each file's
   suite under the shim, by `PATH` (`npm test -- --only launchpad`,
   `--only target-worktree`, `--only target-publish`, `--only release`,
   `--only harness-fixtures`).
9. `package.json`: `engines.git` reads `>=2.31.0`.
   `scripts/lib/node-engines.mjs`: the comment over `GIT_FLOOR` names what
   the floor now rests on (`rev-parse --path-format` and the environment's
   configuration pairs, both of Git 2.31.0). `scripts/test-runner.test.mjs`
   (the Git floor case): admits 2.31.0, a Windows-suffixed 2.31.0 and an
   Apple-suffixed 2.39.3, refuses 2.30.9 and 1.99.9 naming the floor and the
   version read. `scripts/test-release.sh` (`release_case_git_floor`): under
   a Git without `--source` the dry run completes its classification. Check:
   `npm test -- --only runner-fixtures`, `npm test -- --only release` and
   `npm test -- --only host`.
10. `scripts/lib/git-surface.mjs` (new), `scripts/lib/git-surface.json`
    (new), `scripts/structural-checks.mjs` and `scripts/test-runner.mjs`'s
    task table: the extractor, the recorded surface with its `floor`, a
    `git-surface` structural task whose row is marked `kit: "core-only: …"`
    as the table's other core-only rows are, which fails naming each pair
    or name the record lacks and a record whose floor differs from
    `engines.git`, and a `--record` mode that rewrites the file from the
    tree. The message says to confirm the
    form against the floor's manual before recording it. Record the task's
    time. Check: `node scripts/structural-checks.mjs git-surface` and the
    suite's case that adds one form to a fixture tree.
11. Where a Git 2.31.0 binary exists on the executing host (criterion 5),
    run `DOTLN_FLOOR_GIT=<its directory> npm test -- --only runner-fixtures`
    and each other Preflight suite with that directory first on `PATH`, record `git --version` and each exit code,
    and repair what fails there under this order's objective. The recipe,
    untested on this host: fetch `git-2.31.0.tar.xz` and `sha256sums.asc`
    from the Git project's kernel.org directory, compare the digests, and
    build with `make prefix=<a directory under the system temporary root>
    NO_GETTEXT=1 NO_TCLTK=1 NO_PERL=1 NO_PYTHON=1 all install`. Building
    code from another source is the host's permission to give; a denial is
    recorded and criterion 5's fallback applies.
12. Write-backs, each replacing the sentence now wrong and linking this
    order's decisions: the kit guide §First steps (the floor, what it rests
    on, and that an instance on an older Git lowers the line in its own
    `package.json` and reports what failed) and §What runs here, and what
    does not (the floor's decision); product 07 §Workflow closeout and
    releases only if it states the classification's Git requirement;
    `docs/evidence/WO-260/decisions.md`, which supersedes WO-258-D009's
    floor and keeps D010's message and class. Then the handoff sequence of
    product 07 §Discipline, with the review ladder's findings judged as
    product 07 §Verification review and attack now states (the writer, the
    failure's direction and the fix's cost, before any fix).

**Deliverables:** the shim and its cases; the tree-entry reader
and its four callers; the temporary-index classification; the main-intake
reader; the backend reading; the `fsck` call; the isolated environment with
the probe and the fixtures on it; the floor at 2.31.0 with its two tests;
the recorded surface and its core-only check; the real-binary record or its
recorded absence; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. `npm test -- --only runner-fixtures` passes. The cases of
   `scripts/test-git-floor.mjs` show the shim refusing or echoing each of
   the six forms of the Observed gap as step 1 states, and, with the shim's
   directory first on the path: `gateCodeIdentity` at a committed revision returns
   the identity the host's Git returns for the same revision;
   `readTrackedTextAtHead` returns a committed file's bytes and refuses an
   untracked path; `validateTargetRecordsCommit`, `readTargetRecord` and
   `publishTargetPlanning`'s base check accept a regular committed blob and
   refuse another mode; the `main-intake` grant resolves the main checkout
   from a linked worktree; `dropInventoriedStash` reads a files backend and
   proceeds; `verify` admits a sound source-change candidate; and the
   authority probe's Git reads no setting planted in the real home's Git
   configuration.
2. `package.json` declares `engines.git` `>=2.31.0`. With a Git whose
   version line reads `git version 2.31.0` or `git version
   2.31.0.windows.1`, `node scripts/harness.mjs check` and `npm test --
   --only host` admit it; with `git version 2.30.9` each refuses, naming
   `>=2.31.0` and `2.30.9`.
3. `bash scripts/test-release.sh --case git_floor` passes with a release
   close's dry run completing its publication step's classification under a
   Git that rejects `check-attr --source`.
4. `node scripts/structural-checks.mjs git-surface` exits 0 on the
   candidate in this repository. In a fixture tree whose script gains
   `ls-tree --format`, it exits 1 naming that pair, the file and the line;
   with `scripts/lib/git-surface.json`'s floor set apart from `engines.git`
   it exits 1 naming both; and the export fixture's `npm test -- --list`
   does not name the task, as it names no other core-only row.
5. Where the executing host holds a Git 2.31.0 binary, the handoff records
   its `git --version` line and exit 0 for `DOTLN_FLOOR_GIT=<its directory>
   npm test -- --only runner-fixtures` and for each other suite the
   Preflight names, run with that directory first on `PATH`. Where the host holds none, the handoff says so, names
   the denial or the absence, and criterion 1's shim evidence stands as the
   fallback (host-behavior: an order cannot produce a host's permission to
   build another project's source).
6. The kit guide §First steps states the floor as Git 2.31.0, what it rests
   on and the instance's route on an older Git, and §What runs here, and
   what does not links this order's decision; no standing document states a
   2.40 floor. Check: `npm run test:docs` and `grep -rn '2\.40' docs/KIT.md
   docs/product`.
7. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only runner-fixtures` for steps 1 to 11;
`npm test -- --only worktree`, `npm test -- --only target-worktree` and
`npm test -- --only target-publish` for step 2; `npm test -- --only release`
for steps 3, 8 and 9; `npm test -- --only harness-fixtures` for steps 4, 5
and 8; `npm test -- --only skeleton` for step 6; `npm test -- --only
launchpad` for step 8; `npm test -- --only host` for step 9; the structural
phase; the complete run with `npm
test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-260/`: the below-floor cases'
output under the shim; the two timings of step 3 and the time of step 10's
task; step 6's feedback reading; step 8's list of fixtures that kept the
real home for a non-Git child; step 11's record (the version line and exit
codes, or the denial or absence); `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 12 and criterion 6; sources and
reopening conditions in `docs/evidence/WO-260/decisions.md`.

**Known issues and carry-ins:**

- The reading behind this order is static (Observed gap). A form built at
  run time, or a behavior that differs between Git releases without a
  different option, is found only on a real binary: step 11 on this host, or
  the operator's work laptop after the release. A failure the laptop
  instance reports on Git 2.31.0 after this order is a defect of this
  order's objective, repaired under the next order that takes it.
- `-c core.fsmonitor=false` on a Git before 2.36 (Observed gap): confirm on
  a real binary that no command fails and record the reading; changing the
  spelling is in scope only if a command fails.
- WO-244 is active and edits other hunks of `harness-host.ts`,
  `test-runner.mjs` and `test-harness.mjs`; the second of the two orders to
  reach final review integrates the first.
- `scripts/test-plan-refutation.mjs`'s WO-246 publish case is the one the
  instance saw fail on Git 2.31; it reaches the remote through the target
  publication fixture's environment, which step 8 changes. The executor
  runs that case under the shim and records the result.

**Non-goals:** supporting a Git below 2.31.0; a version switch at any call
site; changing which paths the classification excludes; a parser of
attribute files; the option list of Git's manual as shipped data; running
the surface check in an instance; changing `core.fsmonitor`'s spelling
without an observed failure; any change to the Node range.

**Operator-review assumptions:** that Git 2.31.0 is the oldest Git the
operator needs (the work laptop's), so the floor is that version and not
lower; that the laptop instance reports what it meets after the release,
since no session here reaches that host; that the surface record's
confirmation is a reviewer's reading of one line per new form, which a
record cannot make for itself; that the live feedback episode, if step 6
owes it, is accepted under the standing direction of 2026-09-28; and that a
real Git 2.31.0 on this host depends on the operator admitting the build
(host-behavior fallback: criterion 1's shim evidence and the laptop's own
gates).
