# WO-272 — A tool call pays for the hooks that judge it: a hook that judges one kind of tool is registered for that kind, the presence heartbeat rides a process that already runs, the planning-branch refusal asks Git only about a write, and the authorship snapshot rehashes only the files whose state changed

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** patch. The emitted settings register two
hooks for fewer tools and no separate presence hooks; two internal
readings do less work. Every refusal stays as it is. A hook process that no longer runs
writes no journal row of its own; the rows that mark a tool call's start
and end stay. Assigned at activation under the standing opt-out default.
**Cost:** adds, in `packages/compiler/src/harness.ts` (the settings'
matchers and the presence hooks' emission), a matcher per unit and the
heartbeat's call inside the observer hooks; in
`packages/skeleton/src/harness-host.ts` (`planningWriteRefusal`,
`observeAuthorship`), a tool-kind test ahead of one Git call and a cache
of file states in the session's state; cases in the suites the Preflight
names; the kit guide and the decisions. Removes, from every tool call in
every session of core and of every instance, the recurring work this
order measures before and after from the order meter and the hooks'
timing rows: today eight hook processes start for each tool call; WO-260
ran 9,000 hook runs for 1,281,998 ms (a mean of 142 ms and a peak of
5,882 ms) and 2,752 authorship snapshots that read 26,039,166,267 bytes
in 256,185 ms. Tokens and wall-clock: unknown until this order's handoff
records them. Re-mints: the editions the registered sources this order
edits stale, deterministically; a compiler release owes the deterministic
`feedback-evidence --carry` and a console re-pin; no file in
`FEEDBACK_SOURCE_PATHS` changes, so no live feedback episode is owed. The
files this order edits are declared sources of machinery suites, so the
final criterion names `npm test -- --review`. Steps: the executor's,
below.
**Nomination provenance:** the operator's dispatch of 2026-11-09 (ignored
capture SHA-256
`7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7`), item 1,
second and fourth goals; the hook-timing follow-up of WO-236
(FUP-be6721fbdd4b6285); the review of the packages by
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md).
**Depends on:** WO-264 and WO-271 (open: both edit
`packages/skeleton/src/harness-host.ts` or the compiler's emission first).
**Recommended placement:** fifteenth, after WO-264 and WO-271, which edit
the same files. Every session on every host pays this on each tool call,
a managed laptop most of all, and nothing is stopped by it today.
**Cites (read these sections):** `.claude/settings.json` (the registered hooks and their matchers);
`packages/compiler/src/harness.ts` (where each hook is registered with the
matcher `.*`, where the four presence hooks are emitted, and
`lowerTargetWorker`, which emits a target worktree's own settings and
hooks); `packages/skeleton/src/harness-command.ts` (`harnessToolEffects`,
the table from each host's tool names to the kinds a unit judges); `packages/skeleton/src/presence-heartbeat.ts`;
`packages/skeleton/src/harness-host.ts` (`evaluateExistingHarnessHook`,
`planningWriteRefusal`, `observeAuthorship`, the pinned-file check and
the journal's read); the order meter's hook and authorship fields in
`docs/evidence/WO-260/meta.json`; the kit guide §Hooks.

**Objective:** A tool call starts only the hook processes that have
something to judge for that tool, none of them starts to do nothing, and
the work each does is in proportion to what changed since the call
before. Every refusal the hooks make today is made after this order,
for the same input, with the same words.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Eight processes a call. `.claude/settings.json` registers five
  `PreToolUse` hooks (`concurrent-work-requires-worktrees`,
  `no-attribution`, `permissions`, `write-observer` and
  `presence-pretooluse`) and three `PostToolUse` hooks
  (`no-lint-type-disables-as-fixes`, `read-observer` and
  `presence-posttooluse`), each for every tool: the compiler emits the
  matcher `.*` for all of them.
- A target worktree has hooks of its own. `lowerTargetWorker` emits a
  target worktree's settings apart, with its own presence hook and with
  its attribution and writer hooks on the matcher `.*`; most of a work
  instance's tool calls run there.
- One settings file serves more than one host. Copilot CLI loads the same
  emitted settings, and a host's shell tool is not always named as
  Claude's is: the attribution unit gathers its facts for two tool names.
- Four hooks exist to do nothing by default. The compiler emits a
  presence hook for each of four events in every installation, and
  `packages/skeleton/src/presence-heartbeat.ts` returns at once unless
  the resident's store is named in the environment.
- Two units judge one kind of tool. The pass's review read that the
  attribution unit gathers its facts only for a shell command and the
  lint-directive unit only for a file write; each still starts for a
  read. The executor confirms both from the units' own code before
  narrowing.
- One Git call runs for every tool. `planningWriteRefusal` runs `git
  symbolic-ref` to learn the branch before it has asked whether the tool
  writes, and `evaluateExistingHarnessHook` calls it in each hook kind.
- The authorship snapshot reads everything each time. `observeAuthorship`
  lists the changed and untracked files and hashes each one, before and
  after every writing tool; its cost therefore grows with the branch's
  diff. WO-260's 2,752 snapshots read 26 GB.
- The measured total. WO-260's meter records 9,000 hook runs in 1,281,998
  ms, about 21 minutes of the order, and each prompt's session hook takes
  about three seconds by the session journal of the pass that filed this
  order.

**Design (scope discipline):**

- Measure, then cut. The first step records the per-hook timing rows of a
  fixed sequence of tool calls on the harness fixture, and the last step
  records the same sequence again; the decisions hold both. Each cut stays whether or not the second reading shows it, since each
  removes a process or a call and adds none; the readings say what a tool
  call still costs.
- A unit's matcher is the tools it judges, by every name they go by. The
  loadout's unit states the kinds its facts read, the compiler builds the
  hook's matcher from every tool name `harnessToolEffects` maps to those
  kinds, on every host that reads the settings, and a unit that judges
  every tool keeps `.*`. The same holds in the settings emitted for a
  target worktree. Rejected: one
  dispatcher process per event that evaluates every unit (the axis is
  risk: it is the larger saving, and it moves every refusal's evaluation
  into new code at once; it is recorded as the candidate that follows
  this order's measurements).
- The heartbeat rides. A hook that already runs for an event calls the
  heartbeat, which still does nothing without a store: the observer hooks
  before and after a tool call, the session hook at a prompt and the
  finish hook at a stop. The presence hook files and their registrations
  leave, in the launchpad and in a target worktree.
- The planning-branch refusal asks whether the tool writes first, from
  the input it already holds, and calls Git only then.
- The authorship snapshot keeps, in the session's own state, the size,
  times and identity the file system reports for each file with the hash
  it computed, and rehashes a file only when one of those differs. The
  result recorded is the same. Rejected: sampling snapshots (the axis is
  the record: authorship is attributed from every write).
- Parity is the acceptance. Every refusal case of the harness suite
  passes unchanged, and this order adds no refusal and tightens none on
  any host.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. Before any edit, on the harness fixture, record the hooks' timing rows
   for a fixed sequence (a read, a search, a shell command, an edit, a
   write, each ten times) and keep them under
   `docs/evidence/WO-272/before.json` with the count of hook processes
   started. Confirm from the two units' code which tools each judges and
   record it. Check: the file holds a row for each registered hook.
2. `packages/compiler/src/harness.ts` (the hook registrations of the
   launchpad and of `lowerTargetWorker`) with the units' declarations in
   the loadout and `harnessToolEffects`: emit each unit's matcher from
   every tool name that maps to the kinds it judges, with a refusal case
   for each such name. Check: `npm test -- --only compiler` and `npm test --
   --only harness-fixtures`.
3. `packages/compiler/src/harness.ts` (the presence hooks' emission, in
   both places) and the hooks' entries in
   `packages/skeleton/src/harness-host.ts`: call the heartbeat from the
   observer hooks before and after a tool call, from the session hook at a
   prompt and from the finish hook at a stop, and emit no presence hook; `node scripts/harness.mjs emit` removes the four
   files as obsolete outputs. Check: `npm test -- --only harness-fixtures`
   and the presence cases in `npm test -- --only skeleton`.
4. `packages/skeleton/src/harness-host.ts` (`planningWriteRefusal`): test
   the tool's kind before the Git call. Check: `npm test -- --only
   harness-fixtures`, with a case that counts Git calls through the
   suite's stand-in Git.
5. `packages/skeleton/src/harness-host.ts` (`observeAuthorship`): keep and
   consult the file-state cache in the session's state. Check: `npm test
   -- --only harness-fixtures`, with a case that counts bytes read across
   two snapshots.
6. Repeat step 1's sequence on the candidate into
   `docs/evidence/WO-272/after.json`, and record both readings in the decisions with, for each cut, whether
   the second reading shows it.
7. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §Hooks (which hooks run for which
   tools, and that the heartbeat has no hook of its own);
   `docs/evidence/WO-272/decisions.md`. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the two readings; the per-unit matchers; the heartbeat
inside the observers; the tool-kind test; the file-state cache; the
cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. The emitted `.claude/settings.json` registers the attribution hook and
   the lint-directive hook only for the tool names that map to the kinds
   step 1 found each judges, registers no presence hook for any event, and
   `node scripts/harness.mjs check` passes; `.claude/hooks/` holds no
   presence hook file; and the settings emitted for a target worktree hold
   the same.
2. Every refusal case of `npm test -- --only harness-fixtures` that passed
   at the base passes unchanged, the attribution refusal fires for a shell
   command under each tool name that maps to its kind, the heartbeat's cases pass for each of the four events with a store
   named in the environment, and for a tool the two narrowed hooks no
   longer run for, the session journal holds the rows for the call's
   start and end that it holds at the base, which WO-271's reading of
   worked time takes.
3. For a read on a planning branch the hooks make no `git symbolic-ref`
   call, counted through the suite's stand-in Git, and a write outside
   the admitted paths on a planning branch is refused with the message it
   has at the base.
4. Two authorship snapshots with no file changed between them read no
   file's bytes the second time; after one file changes, the second
   snapshot reads that file alone and records the hash a full read
   records.
5. `docs/evidence/WO-272/before.json` and `after.json` hold the timing
   rows of the same sequence, and the decisions state both readings.
6. The kit guide §Hooks states which hooks run for which tools and links
   this order's decisions. The verifier reads the
   named section; `npm run test:docs` judges its links and form.
7. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only compiler` for step 2; `npm test --
--only harness-fixtures` for steps 2 to 5; `npm test -- --only skeleton`
for step 3; the structural phase; the complete run with `npm test --
--review` at final review.

**Evidence gate:** under `docs/evidence/WO-272/`: `before.json` and
`after.json`; the emitted settings; the Git-call and byte counts of
criteria 3 and 4; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 7 and criterion 6; sources and
reopening conditions in `docs/evidence/WO-272/decisions.md`.

**Known issues and carry-ins:**

- FUP-be6721fbdd4b6285 (WO-236-D029, the permission hook's median): this
  order is its allocation.
- Each remaining hook still loads the runtime's module graph, checks its
  pinned files and reads the session journal on every call. One process
  per event that evaluates every unit against shared facts is the larger
  cut; it follows this order's after-reading, which says what is left.
- The hook that imports the reactor for one authorization helper is
  unchanged: the reactor is a feedback source, and moving the helper owes
  a live episode this order does not take.
- A file whose content changes while its size, times and identity do not
  is not rehashed. The decisions record whether the suite can construct
  the case and what the snapshot then attributes.
- Whether the host runs one event's hooks in parallel decides how much of
  the saved process time is saved waiting; the two readings record
  elapsed time per call as well as process time.
- The session hook's own three seconds at each prompt are not this order's
  subject; it gains the heartbeat's call here and one read from WO-271,
  and the after-reading records its time.
- From this pass's first refutation: A tool name outside the matcher list
  would go unjudged where today every hook judges every call: build each
  matcher to leave out the tools the table knows to be reads, where the
  host's matcher can express that, so an unknown name is judged as today,
  and where it cannot, list every name the hosts document and record the
  gap.
- From this pass's first refutation: A tool the kind test cannot classify
  counts as a write, and a case says so.
- From this pass's first refutation: A same-size rewrite within one
  timestamp tick could keep a stale hash: key the cache on size,
  modification time, change time and inode, and read again any file whose
  times fall within the tick of the cache's own write.

**Non-goals:** a dispatcher that replaces the per-unit hooks; any change to a refusal, its words or its journal row; the session hook's
own work; moving code
out of the reactor; the pinned-file check; hooks under Codex or Copilot
beyond what the same emitted registration gives them.

**Operator-review assumptions:** that the four small cuts are worth
taking before the larger one, because each is measured and none moves a
refusal; that parity of every existing refusal case is the right bar;
and that the before and after readings on the fixture stand for a
session's cost.
