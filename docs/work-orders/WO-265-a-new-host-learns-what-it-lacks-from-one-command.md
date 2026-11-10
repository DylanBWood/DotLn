# WO-265 — A new host learns what it lacks from one command: `node scripts/doctor.mjs` reports every host assumption at once before the first install, an instance's host check is sized to the tasks an instance runs, an update's preview judges the incoming floors against the host it runs on, and the kit guide names the compiler, the forge tool and the hosts the kit is exercised on

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. One new read-only command; one host
check relaxed in a kit root; one advisory line in the update preview; one
clearer compiler error; one seeded attributes file; the kit guide's first
steps. No refusal is added or tightened. Assigned at activation under the
standing opt-out default.
**Cost:** adds `scripts/doctor.mjs` and `scripts/lib/host-doctor.mjs`; in
`scripts/structural-checks.mjs` (`checkHost`) and
`scripts/lib/host-resources.mjs` (`largestTaskPeakRss`), the carried-task
reading of the peak in a kit root; in `scripts/launchpad.mjs`
(`previewFromRevision`), recurring work in each update preview (one read of
the incoming `package.json` at the revision and two version judgments;
unmeasured, and measured by this order on the update fixture); in
`scripts/lib/host-resources.mjs` (`nativeCompiler`, `nativeBinary`), a
remedy in the compile error; `scripts/kit/gitattributes.template` and its
entry in `KIT_TEMPLATE_FILES`; cases in the suites the Preflight names; the
kit guide and the decisions. Removes these states: a host learning one
unmet assumption per refused gate; an instance's gate refused on a machine
whose per-lane memory is below the peak of a core-only suite it never runs;
an update taken into a host its floors refuse, found at the next gate; a
compiler error with no remedy. Tokens and wall-clock: unknown until this
order's handoff records them. Re-mints: the editions
`scripts/lib/host-resources.mjs` stales, deterministically (it is a
registered evidence source); no file in `FEEDBACK_SOURCE_PATHS` changes, so
no live feedback episode is owed. `scripts/structural-checks.mjs`,
`scripts/lib/host-resources.mjs` and `scripts/launchpad.mjs` are declared
sources of machinery suites, so the final criterion names `npm test --
--review`. Steps: the executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-09 (ignored
capture SHA-256
`7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7`), item 1,
its fourth goal (the starter working across environments, the work laptop
first), and the operator's statement of the same day that the work
instance's use is the mission of the next months (ignored captures SHA-256
`b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb` and
`04a12c3c90a61336651b1910af75c11abaa3c990c3e18427b3b8fa8efb33e3e3`); the
host-refusal screen of product 07 §Operator-opened planning pass, written
after v0.121.0 refused the work laptop at every gate.
**Depends on:** WO-260 (closed, v0.122.1: the Git floor and its judgment
this order's command reports); WO-258 (closed: the starter refresh that
adds a seed a starter lacked). No open order.
**Recommended placement:** fifth, the first of the work instance's orders:
every later release that reaches the work laptop is taken through this
order's preview, and a second machine (a teammate's) meets the kit through
this order's command.
**Cites (read these sections):** `scripts/lib/node-engines.mjs`
(`judgeRunningNode`, `judgeRunningGit`); `scripts/structural-checks.mjs`
(`checkHost`); `scripts/lib/host-resources.mjs` (`hostLaneCapacity`,
`largestTaskPeakRss`, `nativeCompiler`, `nativeBinary`);
`scripts/lib/gate-scheduling-baseline.json` (`taskPeaks`, `taskSamples`);
`scripts/test-runner.mjs` (the suite rows' `kit` property);
`scripts/launchpad.mjs` (`previewFromRevision`, `KIT_TEMPLATE_FILES`, the
export's `addSeed` calls); `scripts/lib/starter-refresh.mjs` (the seed
rules, read only); `scripts/lib/github-repository.mjs` (the origin parse and the `gh`
proof); `scripts/bootstrap.mjs`; the kit guide §First steps and §Taking
upstream updates; `scripts/kit/first-order.template.md`.

**Objective:** A person on a machine the kit has never run on runs one
command before installing anything and reads, in one table, every
assumption the kit makes of that host and which are unmet, with the remedy
for each. An instance's gate is not refused for memory a core-only suite
needs. An update's preview says, before the merge, that the incoming
release's floors refuse this host. Nothing in this order refuses a host.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- One refusal at a time. `requireDeclaredNode` in `scripts/harness.mjs`
  throws on the Node floor before it judges Git, and the host task of
  `scripts/structural-checks.mjs` prints Node, Git and memory but runs
  inside a gate, after `npm ci`. No command reports the assumptions
  together, and the kit guide §First steps declares Node and Git only.
- The record of the work laptop is its Git version. v0.121.0 declared a
  Git floor of 2.40 and refused that laptop at every gate until v0.122.1
  lowered the floor to its Git 2.31.0 (WO-260). Nothing committed states
  its platform, memory, compiler, forge or model account, so the
  host-refusal screen can judge a refusal only against Git.
- The instance's host check is sized by a suite instances never run.
  `checkHost` refuses when the per-lane budget is below
  `largestTaskPeakRss()`, which reads the three `taskPeaks` rows of
  `scripts/lib/gate-scheduling-baseline.json`; all three are
  `runner-fixtures` (1,509,638,144 bytes at the largest), a row
  `scripts/test-runner.mjs` marks core-only. Lanes are half the logical
  processors up to eight (`hostLaneCapacity`) and the budget is half of
  physical memory divided by the lanes, so a machine with 16 GB and twelve
  logical processors has 1,431,655,765 bytes a lane and is refused, while
  the same memory with eight processors passes.
- The update preview does not judge floors. `previewFromRevision` in
  `scripts/launchpad.mjs` compares manifests and reads no `engines` value,
  so an instance learns that an incoming release refuses its host at the
  first gate after the merge.
- The compiler is required and undeclared. Every suite launches through
  `taskLauncher`, which compiles `scripts/lib/host-lock.c` on first use
  with `nativeCompiler()` (`/usr/bin/xcrun` and clang on macOS, `cc`
  elsewhere); a host without it gets the tool's raw error.
- No attributes file ships. `verifyKit` hashes working-tree bytes, and a
  Git configured to convert line endings at checkout changes them; the
  export writes no `.gitattributes`.
- Every committed run of the kit is on macOS. The scripts carry Linux
  branches that no gate has exercised, and native Windows has no route for
  the symlinked `AGENTS.md`, the lock helper or the process readings.

**Design (scope discipline):**

- The command is read-only, runs before `npm ci` and below both floors, and
  reports rows, never a single verdict: for each assumption the observed
  value, whether it is met, unmet or unknown, the kit behavior that
  depends on it and the remedy. It imports Node's own modules and the
  build-free library modules only, so it needs no installed dependency and
  no compiled runtime. It exits 1 when a row is unmet and 0 otherwise, and
  `--json` prints the same rows. Rejected: a `doctor` subcommand of
  `scripts/harness.mjs` (the axis is when it can run: that entry imports
  the compiled runtime, which a fresh clone gains only at bootstrap).
  Rejected: extending the seeded first order to ask the same questions
  (the axis is who runs it and when: an agent inside a session that
  already needs a passing gate).
- The rows are the assumptions the kit's code makes today, each with the
  function that judges it already: the Node floor and the Git floor
  (`judgeRunningNode`, `judgeRunningGit`); the native compiler (a compile
  of the lock helper into a temporary directory); the per-lane memory
  budget against the carried peak (`checkHost`'s own arithmetic); symlink
  creation in a temporary directory; the effective line-ending conversion
  of the clone; the origin as a forge the publish helpers accept and the
  forge tool's presence; the platform, as exercised, designed for or
  unsupported; and the presence and version of each agent CLI, reported
  and never judged. The doctor and the host task call the same functions, the per-lane
  comparison among them once step 3 has moved it into the library, so the
  two cannot disagree.
- The output is generic. It prints versions, counts, sizes and yes or no,
  and no host name, user name or absolute path, so an operator can paste
  it into a planning dispatch from a managed machine.
- In a kit root the host check takes its peak over the tasks that root's
  gate carries. Core keeps its present sizing. Rejected: lowering the
  baseline for every root (the axis is what the check protects: core's
  complete run does need the larger peak).
- The preview prints one line for each incoming floor this host does not
  meet, above its file sections, and still prints the plan. It refuses
  nothing: the operator may be previewing on one machine for another.
- The attributes seed disables line-ending conversion for the instance's
  tree and is a seed: a new export carries it, the starter refresh adds it
  to a starter that lacks one, and an instance that has its own keeps it.
- This order names every host the record shows, as the host-refusal screen
  asks. On this repository's host (macOS, sixteen logical processors,
  51,539,607,552 bytes of memory, Git 2.55.0, Node 26.9.0) the command
  reports every row met and the host check is unchanged, because the
  carried-task reading applies in a kit root only. On the operator's work
  laptop (Git 2.31.0; nothing else recorded) the command reports what is
  there, the host check can only admit a gate it refuses today, and the
  preview can only add a line.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/lib/host-doctor.mjs` (new): a function that takes injected
   facts (versions, processor count, memory, a compiler runner, a symlink
   probe, a Git configuration reader, an origin URL, a tool lookup, and the host
   name, user name and home directory its output must not carry) with
   the running host's as defaults and returns the rows of the Design's
   second item, calling `judgeRunningNode`, `judgeRunningGit`,
   `nativeCompiler`, `hostLaneCapacity` and the peak reading of step 3.
   Its cases join `checkHost`'s in `scripts/test-runner.test.mjs`, one of
   them asserting that the doctor's imports are Node's own modules and the
   named build-free library modules and nothing else, and
   `scripts/test-runner.mjs` gains the new modules in the source
   declarations of the rows that load them. Check: `npm test -- --only
   runner-fixtures`.
2. `scripts/doctor.mjs` (new): the entry that prints the table or, with
   `--json`, the rows, and sets the exit code; it imports nothing outside Node's modules and `scripts/lib/`, and it
   judges the running Node before it loads any other module of the kit,
   so that a Node too old to load one still prints its row. `scripts/launchpad.mjs` (the kit's
   file list and the generated `package.json`): the two files ship and the
   instance gains `npm run doctor`. Check: in the export fixture, before
   any install, `node scripts/doctor.mjs` runs (`npm test -- --only
   launchpad`).
3. `scripts/lib/host-resources.mjs` (`largestTaskPeakRss` and a new
   exported comparison) and `scripts/structural-checks.mjs` (`checkHost`):
   move the per-lane comparison and its remedy text, written inline in
   `checkHost` today, into the library so that the host task and the
   doctor call one function; in a kit root, read the peak over the
   baseline's samples of the tasks that root's gate carries; in core, as
   today. Check: `npm test -- --only runner-fixtures`, whose
   file holds `checkHost`'s cases, with a sample of 16 GB and twelve
   processors injected as `checkHost` takes its facts today.
4. `scripts/launchpad.mjs` (`previewFromRevision`): read `engines` from
   the incoming revision's `package.json`, judge each floor against the
   running Node and Git with the functions of step 1, and print one line
   per unmet floor naming the floor and this host's version. Record the
   reading's time on the update fixture. Check: `npm test -- --only
   launchpad`.
5. `scripts/lib/host-resources.mjs` (`nativeCompiler`, `nativeBinary`): a
   failure to find or run the compiler throws an error that names the
   compiler it tried, what the kit needs it for and the remedy for the
   platform, keeping the tool's own message. Check: `npm test -- --only
   runner-fixtures`, with a case that injects a failing compiler.
6. `scripts/kit/gitattributes.template` (new) and `scripts/launchpad.mjs`
   (`KIT_TEMPLATE_FILES` and the export's `addSeed` calls, beside the
   `.gitignore` seed): a new export writes `.gitattributes` from the template as a seed;
   `scripts/lib/starter-seeds.mjs` (`seeds` and `exportSeedPaths`, the
   lists the export is checked against and the starter refresh reads)
   names it, so the refresh adds it to a starter that has none and leaves
   one that exists. Check: `npm test
   -- --only launchpad`.
7. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §First steps (the command as the first
   step, the compiler, the forge tool and the merge policy release close
   needs, and the three statements about hosts: macOS exercised, Linux and
   WSL2 designed for and not exercised, native Windows unsupported),
   §Taking upstream updates (the preview's floor lines);
   `scripts/kit/first-order.template.md` (the first order records the
   command's `--json` output in the instance, in place of the host
   questions it asks today); `docs/evidence/WO-265/decisions.md`. Then the
   handoff sequence of product 07 §Discipline.

**Deliverables:** the command and its library; the kit-root host check;
the preview's floor lines; the compiler error; the attributes seed; the
cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. In the export fixture, before any install and with no compiled runtime
   loaded, `node scripts/doctor.mjs` prints one row for each assumption of
   the Design's second item with its observed value, its verdict, the
   behavior that depends on it and a remedy, and `--json` prints the same
   rows.
2. With a Node below `engines.node`, a Git below `engines.git` and a
   compiler that fails all injected at once, the rows report all three
   unmet in one run and the command exits 1; with every assumption met it
   exits 0; a fact the command cannot read is reported unknown and does not change
   the exit code; and with a Node below the floor injected and
   `scripts/lib/host-doctor.mjs` replaced in the fixture by a file that
   fails to load, the command still prints the Node row with the floor
   and exits 1.
3. With a host name, a user name and a home directory injected, no output
   of the command, table or JSON, contains any of the three.
4. In a kit root, the host task passes on an injected host of 16 GB and
   twelve logical processors; in core, the same injected host is refused
   with the per-lane shortfall it names today.
5. In the update fixture, `node <incoming>/scripts/launchpad.mjs preview
   --from <revision>` prints a line naming the floor and this host's
   version when the incoming `engines.git` is above the running Git, and
   the same for Node; with both floors met it prints no such line; in
   both cases it prints its plan.
6. With a compiler that cannot be run, the error raised when a suite first
   needs the lock helper names the compiler tried and the platform's
   remedy.
7. A fresh export holds a `.gitattributes` equal to the template; the
   starter refresh adds it to a starter that lacks it and leaves a
   starter's own file byte-identical.
8. The kit guide §First steps names the command, the compiler, the forge
   tool, the merge policy and the three host statements, and §Taking
   upstream updates names the preview's floor lines, each linking this
   order's decisions. The verifier reads the
   named section; `npm run test:docs` judges its links and form.
9. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only runner-fixtures` for steps 1, 3 and 5;
`npm test -- --only launchpad` for steps 2, 4 and 6; the structural
phase; the complete run with
`npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-265/`: the command's table and
JSON on this host; criterion 2's three outputs; the kit-root and core host
task outputs of criterion 4; the two previews of criterion 5 with the
reading's time; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 7 and criterion 8; sources and
reopening conditions in `docs/evidence/WO-265/decisions.md`.

**Known issues and carry-ins:**

- The command reports what the kit can read. Whether hooks fire under a
  managed settings policy, which model identifiers an account accepts and
  whether a network route reaches the forge and the package registry are
  observed only by a session on that machine; the 2026-11-09 pass asks the
  operator for those observations in generic terms, and a row for any of
  them is added when a session can read it.
- The host task still exits 1 on one memory-pressure sample at `warning`;
  that behavior is unchanged here and is recorded for the pass that reads
  an instance's refusal on it.
- The forge row reports the tool's presence and the origin's shape. It
  does not call the forge, so authentication and the repository's allowed
  merge methods stay with the publish helpers' own proofs.
- Linux, WSL2 and Windows are stated, not exercised: this order adds no
  run on any of them, and continuous integration on a second platform
  needs the operator's authorization.
- A starter whose Git already converted line endings before the seed
  arrives keeps its working tree as it is; the release's Read before
  upgrading names the one command that renormalizes it.

**Non-goals:** any new or tightened refusal; a model or effort election
for an instance (the pass that reads the work laptop's observation decides
it); detecting hooks blocked by a managed policy; continuous integration;
support for native Windows; the memory-pressure sample rule; the Git
surface check.

**Operator-review assumptions:** that a report which refuses nothing is
what a new host needs first, and that the existing gates remain the
refusals; that output free of host names, user names and paths may be
pasted from a managed machine into a planning dispatch; that an instance's
gate should be sized by the tasks it runs; and that stating Linux and WSL2
as unexercised and native Windows as unsupported is the true state today.
