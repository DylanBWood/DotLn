# WO-267 — An instance builds its own tools beside the kit and keeps them across updates: one root the kit never ships into, scans or emits into, a committed settings fragment that emit merges, a configuration section the kit leaves to the instance, a versioned status output, and a section of the kit guide that says where each kind of extension goes

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. One reserved root; one optional settings
fragment merged at emit; one configuration section the kit does not read;
a version field on one JSON output; a section of the kit guide. An
instance that uses none of them emits and gates as today. Assigned at
activation under the standing opt-out default.
**Cost:** adds, in `scripts/launchpad.mjs` (`KIT_FILES`, `kitPath`), the
reserved root and its case; in `scripts/lib/harness.mjs` (emit and check),
the merge of `.claude/settings.instance.json`, recurring work in each emit
and check (one file read and one merge; unmeasured, and measured by this
order on the harness fixture); in `scripts/lib/config.mjs`
(`SECTION_KEYS`), the `extensions` section; in `scripts/resume.mjs`
(`statusProjection`'s JSON output), a `schemaVersion`; in
`scripts/lib/closeout-scope.mjs`, the classification of the reserved
root; cases in the suites the Preflight names; the kit guide, product 07
and the decisions. Removes these states: an owner's hook or permission
rule living only in an ignored, unversioned file; an owner's script
failing the gate because of where it was put; an owner's settings refused
as an unknown configuration section; an owner's tool reading a status
output with no version to check. Tokens and wall-clock: unknown until
this order's handoff records them. Re-mints: the editions the registered
sources this order edits stale, deterministically; no file in
`FEEDBACK_SOURCE_PATHS` changes, so no live feedback episode is owed. The
files this order edits are declared sources of machinery suites, so the
final criterion names `npm test -- --review`. Steps: the executor's,
below.
**Nomination provenance:** the operator's statement of 2026-11-09 that an
instance must be extendable with private implementations and still take
updates from core regularly, with an issue-tracker reader that prepares a
planning session's input as the example (ignored capture SHA-256
`9006bd8cbcdabb5647594adb6893150aaff9e5a8ee74260a4e890e9cba3d69ae`); the
extension point of WO-207, which
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md)
takes out of that order and recuts without its loader.
**Depends on:** WO-261 (open: an update that keeps the files an instance
changed is what makes an instance's own material safe to build).
**Recommended placement:** eighth, after WO-266. The work instance's owner
starts building private tools as soon as it runs.
**Cites (read these sections):** `scripts/launchpad.mjs` (`KIT_FILES`,
`kitPath`, the export's refusal of a kit path an instance file occupies);
`scripts/lib/harness.mjs` (the emit's writes, `walkOwned`, the check's
drift comparison); `scripts/lib/config.mjs` (`SECTION_KEYS`,
`requireKnownKeys`); `scripts/resume.mjs` (`statusProjection`,
`CONTROL_LOG_SCHEMA_VERSION`); `scripts/lib/closeout-scope.mjs`;
`scripts/lib/temporary-root-declarations.mjs` (the three trees it walks);
`packages/skeleton/src/runtime-inputs.mjs` (`isKitRoot`,
`hasPackageSources`); `scripts/lib/verbatim-screen.mjs` (`capturePaths`);
the kit guide §Kit files and instance files, §Hooks, §Planning in this
instance and §Taking upstream updates; product 07 §Workflow closeout and
releases (what a release's Read before upgrading says).

**Objective:** The owner of an instance writes whatever tools the instance
needs in a place the kit guarantees it will never touch, commits the
instance's own hooks and permission rules, keeps the tools' settings in
the instance's configuration, reads the kit's state through an output
that says its version, and finds all of that in one section of the kit
guide. Nothing here adds a loader: the kit does not run an instance's
tools, and core does not learn what they are.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Ownership is already by manifest. The kit guide says that everything the
  manifest does not list is the instance's, `KIT_FILES` and `kitPath` in
  `scripts/launchpad.mjs` define the kit's paths, and an update is a Git
  merge that leaves other paths alone. An owner's files survive updates
  today.
- Nothing says where to put them, and natural places fail. A file under
  `.claude/hooks/` makes `harness check` report `harness drift: unexpected`
  and stops emit from replacing an obsolete path there.
  `.claude/settings.json` is written whole by emit and compared byte for
  byte by check, so a hook or a permission rule an owner adds is lost or
  reported. A script under `scripts/`, `packages/` or `corpus/` is read by
  the temporary-root declarations check, which walks those three trees. A
  `packages/<name>/tsconfig.json` makes `hasPackageSources` true, so
  `isKitRoot` turns false and the instance behaves as core. A skill or an
  agent definition named `dotln-*` collides with the generated ones.
- A committed hook has no home. The kit guide's route for an owner's hook
  is `.claude/settings.local.json`, which the seeded ignore rules keep out
  of Git.
- An owner's settings have no home. `requireKnownKeys` refuses a
  configuration section outside `SECTION_KEYS`.
- A change outside the kit's trees owes the wrong checks. The closeout
  selection classifies a path under an unknown root as `unknown`, which
  owes a complete run that tests nothing in it.
- Nothing is declared stable. `npm run resume -- status --json` prints
  `statusProjection` with no version field; the control log's envelope
  has one. A release's Read before upgrading covers changed renderers and
  the settings emitter and promises nothing about an output a tool reads.
- A planning source needs no machinery and has one hazard. A planner reads
  what the dispatch names; a tool's output placed under the intake root is
  read by the words screen as the operator's words, which is how the fork
  failed seventeen lines on files its own sessions had written.
- More comes back than blocks. The pasted block an instance pass writes
  for core carried six to nine items a pass in the three passes before
  this one, each answered that none blocked the instance's next order.

**Design (scope discipline):**

- One root, `extensions/`, is the instance's by guarantee: no kit path may
  begin with it, the kit's scanners and emit do not enter it, the format
  task does not judge it, and the closeout selection classifies a change
  there as the instance's own, owing the document gate and whatever test
  command the order names in its criteria. Rejected: telling an owner to
  use any path the manifest does not list (the axis is the guarantee: a
  later kit release may add a path anywhere else, and the scanners walk
  whole trees). Rejected: the loader WO-207 designed, with adapter kinds
  the kit imports and a declared suite for each (the axis is who runs the
  tool: for the planning case the order itself says no machinery is
  needed, and a loader makes core define what an instance may build).
- The owner's hooks and permission rules are a committed fragment,
  `.claude/settings.instance.json`, that emit merges into the settings it
  writes, for the launchpad and for a target worktree alike, since most of
  an instance's tool calls run in a target worktree and the compiler emits
  that worktree's settings apart. Check includes the fragment in what it
  compares, and the manifest's prediction, the update plan and `verifyKit`
  take it as they take the host elections, so merged settings are neither
  a local modification nor a difference. The merge only adds: a fragment
  entry that would remove or replace an entry the kit emits is refused, so
  the kit's refusals stay as emitted.
- The owner's settings live under an `extensions` section of
  `dotln.config.json`, which the kit requires to be an object and
  otherwise does not read.
- The outputs a tool may rely on are few and named: the control log
  through the kernel's decoder, which already carries a schema version;
  `npm run resume -- status --json`, which gains one; and the usage report
  of WO-266. The kit guide lists them, and a release that changes one says
  so in its Read before upgrading.
- The rest is placement, written once in the kit guide: an owner's skills,
  agents and commands beside the generated ones under any name that does
  not begin `dotln-`; an owner's standing rules in the root instruction
  file outside the generated block; an owner's dependencies in a package
  of their own under the root, with its own lockfile, never in the kit's;
  an owner's tests named by the order that changes them; a target's checks
  in its registration's gate; and a tool that prepares planning input
  writing outside the intake root, the dispatch naming its file.
- What an instance sends core is what blocks it. The kit guide and product
  07 say that an instance pass sends an item only when it blocks the
  instance's next order and has no working route, and keeps the rest in
  its own record; the 2026-11-09 pass wrote that rule, and this order
  links it from the new section.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/launchpad.mjs` (`KIT_FILES`, `kitPath`): export the reserved
   root's name, have `kitPath` answer false for every path under it, and
   refuse an export whose manifest would list one. Check: `npm test --
   --only launchpad`, with a case that no manifest path lies under the
   root.
2. `scripts/lib/closeout-scope.mjs`: classify a changed path under the
   reserved root as the instance's own, owing no kit suite;
   `scripts/test-runner.mjs` (the `format` row's command or its ignore
   list): leave the root out. Check: `npm test -- --only
   runner-fixtures` and `npm test -- --only target-worktree`, whose files
   hold that module's cases.
3. `scripts/lib/harness.mjs` (the emit's settings write and the check's
   comparison) with the target worktree's emission that
   `packages/compiler/src/harness.ts` (`lowerTargetWorker`) feeds: when
   `.claude/settings.instance.json` exists, merge its hooks after the kit's
   for each event and its permission rules into the kit's lists, in the
   launchpad's settings and in a target worktree's, refuse a fragment that
   names a key the merge does not define or that would remove or replace
   an emitted entry, and compare the merged result in check.
   `scripts/launchpad.mjs` (`expectedHarnessBundle`, `planUpdate`,
   `verifyKit`): each takes the fragment, so the merged settings are
   neither refused as locally modified nor reported as differing. Record emit's and check's time on the harness fixture before and after.
   Check: `npm test -- --only harness-fixtures` and `npm test -- --only
   launchpad`.
4. `scripts/lib/config.mjs` (`SECTION_KEYS` and the validation): admit an
   `extensions` section that must be an object and is returned unread.
   Check: `npm test -- --only configuration-root`.
5. `scripts/resume.mjs` (the `status --json` output): add a
   `schemaVersion` to the printed projection. Check: `npm test -- --only
   resume`.
6. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide (a new section on extending an
   instance, after §Kit files and instance files, stating the root's
   guarantee, the fragment, the configuration section, the listed outputs
   and each placement rule of the Design, and linking the rule on what an
   instance sends core; §Hooks, where the ignored local file is today's
   only route); `scripts/test-launchpad-export.mjs` (the kit guide's
   heading list gains the section, with its cause named in the
   decisions); product 07 §Workflow closeout and releases (a release that
   changes a listed output says so in its Read before upgrading);
   `docs/evidence/WO-267/decisions.md`. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the reserved root with its guard; the closeout
classification and the format exclusion; the settings fragment's merge
and its refusals; the configuration section; the status output's version;
the kit guide's section; the cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. No path the kit's manifest lists lies under `extensions/`, the kit-path
   predicate answers false for a path there, and an export whose file
   list names one is refused naming the path.
2. In the export fixture with these files under `extensions/` (a script
   that creates a temporary directory, a source file the formatter would
   rewrite, a `package.json` with its lockfile, and a JSON Lines file),
   `npm test`, `node scripts/harness.mjs emit` and `node
   scripts/harness.mjs check` all pass, and the instance remains a kit
   root.
3. With `.claude/settings.instance.json` declaring one hook and one
   permission rule, emit writes a `.claude/settings.json` that holds every
   entry the kit emits without it and both of the fragment's, and check
   passes; with the fragment removed, emit restores the bytes emitted at
   the base; a fragment that would remove or replace an emitted entry, or that names a
   key the merge does not define, is refused by emit naming the key. A
   target worktree's emitted settings hold the fragment's hook and rule as
   the launchpad's do, and in the update fixture the merged settings are
   not shown as locally modified by the update plan nor as differing by
   `node scripts/launchpad.mjs verify`.
4. A `dotln.config.json` whose `extensions` is an object loads with that
   object returned as written, and one whose `extensions` is not an object
   is refused naming the section.
5. `npm run resume -- status --json` prints a `schemaVersion`.
6. An order whose change lies only under `extensions/` is classified by
   the closeout selection as owing no kit suite.
7. The kit guide has the section step 6 names, stating the guarantee, the
   fragment, the configuration section, the listed outputs and each
   placement rule, and linking this order's decisions; product 07 states
   the release rule. The verifier reads the
   named section; `npm run test:docs` judges its links and form.
8. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only launchpad` for step 1; `npm test --
--only runner-fixtures` and `npm test -- --only target-worktree` for step
2; `npm test -- --only harness-fixtures` for
step 3; `npm test -- --only configuration-root` for step 4; `npm test --
--only resume` for step 5; `npm test -- --only launchpad-docs` for step
6; the structural phase; the complete run with `npm test -- --review` at
final review.

**Evidence gate:** under `docs/evidence/WO-267/`: criterion 2's four
outputs; the merged settings and the two refusals of criterion 3 with
emit's and check's times before and after; the status output's first
lines; `npm run resume -- status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 6 and criterion 7; sources and
reopening conditions in `docs/evidence/WO-267/decisions.md`.

**Known issues and carry-ins:**

- An owner's tool that imports a kit module by path depends on a file the
  next release may move; the section says so and lists the outputs a tool
  may rely on instead. A wider stable surface waits for an owner's tool
  that needs one, named in a block to core.
- Whether a session in an order's worktree loads the main checkout's
  ignored local settings is unknown; the committed fragment, merged into
  the launchpad's settings and a target worktree's alike, makes the
  question moot for hooks an owner wants everywhere.
- An instance that already keeps tools elsewhere keeps working; the
  section says which placements break and that moving them under the root
  is the owner's choice.
- A declared planning source that a planning pass runs itself, in place of
  the dispatch naming a file, reopens when an owner's reader exists and
  naming the file is the friction.
- The words screen still reads every file under the intake root; a tool or
  a session that writes there meets it.

**Non-goals:** a loader, an adapter interface or a registry of an
instance's tools; running an instance's tests in the kit's gate; a
callback from a lifecycle step; an instance's own document kinds or order
sections; changing which paths are kit files; anything that lets a
fragment weaken an emitted refusal.

**Operator-review assumptions:** that a guaranteed root and written
placement rules serve an owner better than a loader core would have to
define; that a committed settings fragment which can only add is the
right power to give an instance; that three listed outputs are enough to
start with; and that the kit should know nothing of what an owner builds
there.
