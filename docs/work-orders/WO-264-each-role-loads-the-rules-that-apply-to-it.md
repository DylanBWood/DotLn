# WO-264 — Each role loads the rules that apply to it: a shared rule names the roles it binds, a planning pass reaches its refutation without a second skill, the verifier's and the reviewer's section of the guide no longer carries the executor's ladder mechanics, the meter counts the reads a role is told to make, and a role-text edit is checked by regeneration and a rule table in place of a chain of hash baselines

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. The generated role roots change in
every instance at its next emit; no command, refusal or lifecycle step
changes; one sentence naming a command that does not exist leaves six
roots. Assigned at activation under the standing opt-out default.
**Cost:** adds, in `packages/skeleton/src/loadouts/contributor.ts`, an
identifier and a list of roles on each shared rule and the filter that
applies it; in `scripts/refute-plan.mjs` (`refute`), the parent's steps
printed with the prompt; one second-level heading in product 07; in
`scripts/lib/process-budget.mjs` (`measureColdStarts`), the bytes of the
fixed sections a root's `Read:` lines name, reported beside the installed
bytes; a rule-table case in `packages/skeleton/test/executor-supports.test.ts`.
Removes the 62 `*role-baseline*.json` fixtures under
`packages/skeleton/fixtures/` (253,148 bytes), `scripts/check-role-oracle.mjs`,
the structural task `role-oracle`, the chain case in
`scripts/test-process-debt.mjs` and the sentence assertions in
`packages/skeleton/test/executor-supports.test.ts` (100 `assert.match` and
`assert.doesNotMatch` calls today); from a planning pass, the refuter skill
it loads on top of its own (20,936 bytes); from the verifier's and the
reviewer's mandated reading, the ladder's mechanics (measured by this
order; the section is 33,168 bytes today); from a `planning:` pass, the
ideation section (9,317 bytes); and from each root, the shared rules that
bind no command, phase or host of that role (measured by this order; the
six lifecycle roots share 17,334 identical bytes today). Recurring work:
none added to a gate, a hook, a prune or a close; the structural phase
loses the `role-oracle` task. Tokens and wall-clock: unknown until this
order's handoff records them. Re-mints: the editions that
`packages/skeleton/src/loadouts/contributor.ts` and
`packages/compiler/src/harness.ts` stale, deterministically (`npm run
sync`), and the evidence registration that names the baseline fixtures
leaves with them; a compiler release owes the deterministic
`feedback-evidence --carry` and a console re-pin; no file in
`FEEDBACK_SOURCE_PATHS` changes beyond a component release label, so no
live feedback episode is owed. The files this order edits are declared
sources of machinery suites, so the final criterion names `npm test --
--review`. Steps: the executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-09 (ignored
capture SHA-256
`7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7`), item 1,
its first and third goals (less context per phase and role skill; accurate
and helpful role skills), which is the efficiency pass that
[WO-054-D006](../evidence/WO-054/decisions.md#wo-054-d006) and
FUP-f1c7a256bec46737 reserved for the operator to open; the role-text
economy candidate (FUP-c1086ab57c145bac) and the cold-start rows boarded by
twelve orders from WO-217 to WO-257, allocated by
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md).
**Depends on:** WO-262, WO-268, WO-270 and WO-271 (open: each edits role
sentences in `contributor.ts` first, and this order composes them as it
finds them, giving each sentence the roles its order named).
**Recommended placement:** tenth, after the nine orders the work instance
waits on. Every later dispatch, in core and in an instance, loads the
roots this order emits.
**Cites (read these sections):** `packages/skeleton/src/loadouts/contributor.ts`
(`operatorControls`, `sessionBoundaries`, `sharedCorrections`, the role
list's composition and `targetRoles`); `packages/compiler/src/harness.ts`
(the skill body's emission); `scripts/lib/harness-context.mjs`
(`sectionRange`, `readDirectives`, `directedReads`, `countReads`);
`scripts/lib/process-budget.mjs` (`coldStartPaths`, `measureColdStarts`,
`budgetVerdict`); `scripts/refute-plan.mjs` (`refute`);
`scripts/test-process-debt.mjs` (the case `scripts/check-role-oracle.mjs`
names); `scripts/lib/generated-artifacts.mjs` (the `role-oracle` task);
`packages/skeleton/src/harness-host.ts` (`kitWorkerLaunch`); product 07
§Verification review and attack, §Operator-opened planning pass and
§Discipline (the cold-start paragraph); `docs/control/budgets.json`.

**Objective:** A role's root holds the rules that bind that role, the
reading it is told to do is the reading it needs, both are counted
together, and a role sentence can be changed by editing it and
regenerating.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Six roots carry one block. The executor, verifier, reviewer,
  release-close, planner and refuter skills share 17,334 bytes of
  identical lines: 46% of the executor's 37,932 bytes and 83% of the
  refuter's 20,931. The lines that are a role's own are 12,215 bytes for
  the executor, 8,260 for the reviewer, 6,340 for the planner, 5,614 for
  the verifier, 4,636 for release close and 3,120 for the refuter.
  `contributor.ts` prepends `operatorControls`, `sessionBoundaries` and
  `sharedCorrections` to every role but the router and `targetRoles`
  inserts thirteen more rules the same way; the router's branch is the
  only filter.
- Some of those rules govern nothing a role that carries them does. The
  dispatch-bounds paragraph (1,087 bytes) is in the planner, refuter and
  release-close roots, whose bounds in `docs/control/budgets.json` are all
  unset. The browser-verification paragraph (596 bytes) and the
  expected-data rule (325 bytes) are in the planner and the refuter, which
  change no product code. The worker-launch paragraph (1,996 bytes) and
  the fan-out paragraph (1,059 bytes) are in all six, release close
  included; which roles they bind is for this order's table to settle.
- A planning pass loads two skills. The planner root tells the pass to
  load the refuter skill after committing its subject; 17,811 of that
  skill's bytes repeat lines the pass already holds, and its own three
  paragraphs are 3,120 bytes.
- The meter counts a part. `coldStartPaths` measures the root instruction
  file and the skill. The planner's root also names §Operator-opened
  planning pass (53,900 bytes), §Operator-opened ideation mode (9,317
  bytes, read on a `planning:` pass too) and the sequence: 102,776 bytes
  before the refuter skill and 123,712 with it, against a metered 31,536.
  The verifier and the reviewer are each told to read §Verification review
  and attack (33,168 bytes), most of which, from the paragraph that opens
  with every execution and fix running its reviews as a ladder, is the
  executor's procedure for launching, recording and rechecking reviewers.
- Six roots name a command that does not exist. The shared worker
  paragraph says `npm run plan -- review` counts three uses;
  `scripts/refute-plan.mjs` has no `review` command. It is the parked
  WO-244's deliverable, and `kitWorkerLaunch` counts a launch of it.
- A role-text edit is recorded three times. Each order that changes a role
  sentence mints a new baseline file holding the hashes of all fourteen
  roots and a link to the baseline before it, extends the chain case in
  `scripts/test-process-debt.mjs`, and edits the sentence assertions in
  `packages/skeleton/test/executor-supports.test.ts`; the twelve most
  recent baselines arrived in twelve separate order commits. The generated roots are
  already compared with the committed ones by `node scripts/harness.mjs
  check`.
- The ceilings recorded growth. The executor's ceiling in
  `docs/control/budgets.json` moved from 20,480 bytes to 51,226 between
  2026-09-18 and 2026-11-06 through five acceptances, each the measured
  root plus 4,096, and twelve orders boarded the same optimization as a
  follow-up.

**Design (scope discipline):**

- A shared rule is a record with an identifier and the roles it binds, and
  the composition gives a role the rules that name it, as the router's
  branch does for one role today. A rule that binds a role stays whole: no
  sentence is reworded to save bytes. A rule leaves a role only when that
  role never reaches the command, phase or host the rule governs, and the
  executor records the rule-by-role table with that reason for each
  omission. Rejected: shortening the shared rules for every role (the axis
  is risk: the standing direction is that a reviewed rule stays whole, and
  rewording is where a duty is lost). Rejected: moving the shared rules
  into a document each role reads on demand (the axis is reliability: a
  rule behind a read is a rule a session may not load, and scoping removes
  bytes without making any binding rule conditional).
- The parent's refutation steps are printed by `npm run plan -- refute`
  with the prompt it already prints, and the planner root names that
  command instead of a skill to load. The refuter root stays for a session
  dispatched with `planning: refute`. Rejected: folding the refuter's
  paragraphs into the planner root (the axis is when the text loads: every
  planning and ideation session would carry what only its last step
  uses).
- The ladder's mechanics move under their own second-level heading in
  product 07, so the section the verifier's and the reviewer's roots name
  keeps the routes, the admission rule and the blocking standard, and
  links the new section once. The planner's ideation read becomes a
  sentence conditional on an `ideation:` entry. No paragraph is rewritten
  by this order; a later quality pass on a section is the operator's to
  ask for.
- The meter reports two numbers for a role, the installed bytes it counts
  today and the bytes of the fixed sections the root's `Read:` lines name,
  and judges only the first against the ceilings. The ceilings, their
  acceptances and the standing route are unchanged.
- The check on role text is regeneration plus the table. `harness check`
  already refuses a committed root that differs from the emitted one; a
  case derives, from the rule records, which rules each emitted root must
  hold exactly once and which it must not hold, so the test follows the
  table and pins no sentence. The baseline chain, its checker and the
  sentence assertions leave; Git history holds every earlier root.
  Rejected: keeping the newest baseline as a single pin (the axis is what
  it adds: a hash of the emitted roots fails on every edit and names
  nothing the regeneration check does not).
- The sentence about `npm run plan -- review` leaves the roots with the
  hook arm that counts it and that arm's case. WO-244's parked work
  carries all three and restores them if it lands.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `packages/skeleton/test/executor-supports.test.ts`: add the case that
   reads the loadout's shared rules and asserts, for every role and both
   skill roots, that each rule naming the role appears exactly once in the
   emitted root and each rule not naming it does not appear; at this step
   every rule names every lifecycle role, so the case passes on the
   present roots. Remove the assertions that match a sentence of a root's
   prose, keeping those that assert structure (the role count, the
   router's exclusions, one occurrence of a rule). Check: `npm test --
   --only skeleton`.
2. `scripts/test-process-debt.mjs` (the case `scripts/check-role-oracle.mjs`
   names and its helpers), `scripts/check-role-oracle.mjs`,
   `scripts/lib/generated-artifacts.mjs` (the `role-oracle` task),
   `scripts/test-gate-followups.mjs` (the baseline chain it lists),
   `scripts/test-runner.mjs` and `scripts/lib/evidence-sources.mjs` (their
   lists of those files) and `packages/skeleton/fixtures/` (the
   `*role-baseline*.json` files): remove the chain, its checker, its task
   and its fixtures, and keep or add among the harness cases one in which
   a committed skill root edited by hand makes `node scripts/harness.mjs
   check` fail.
   Check: `npm test -- --only process-debt` and `npm test -- --only
   harness-fixtures`.
3. `packages/skeleton/src/loadouts/contributor.ts` (`operatorControls`,
   `sessionBoundaries`, `sharedCorrections` and the rules `targetRoles`
   inserts): give each shared rule an identifier and its roles, and
   compose each role from the rules that name it. Write the rule-by-role
   table into `docs/evidence/WO-264/decisions.md` with the reason for each
   omission. Check: `npm test -- --only skeleton` and `npm test -- --only
   compiler`.
4. `packages/skeleton/src/loadouts/contributor.ts` (the shared worker
   paragraph) and `packages/skeleton/src/harness-host.ts`
   (`kitWorkerLaunch`), with the case in `scripts/test-harness.mjs` that
   counts it: remove the clause that names `npm run plan -- review` and
   the arm that counts that launch. Check: `npm test -- --only
   harness-fixtures`.
5. `scripts/refute-plan.mjs` (`refute`): print, with the prompt and the
   schema, the parent's steps the refuter root states today (one fresh
   background worker given only the prompt, the result and statement saved
   in ignored files, `npm run plan -- receipt` and the dispositions).
   `packages/skeleton/src/loadouts/contributor.ts` (the planner): the
   refutation step names that command and no skill. Check: `npm test --
   --only plan-refutation`.
6. `docs/product/07-execution-guide.md`: move the paragraphs of
   §Verification review and attack from the one that opens with every
   execution and fix running its reviews as a ladder through the review
   helper's flags and reports under a new second-level heading placed
   after that section, leave one linking sentence in their place, and
   update each link in a standing document that points at the moved text;
   `packages/skeleton/src/loadouts/contributor.ts` (the planner's `Read:`
   lines): the ideation section is read for an `ideation:` entry. Check:
   `npm run test:docs` and `node scripts/harness-context.mjs --check`.
7. `scripts/lib/process-budget.mjs` (`measureColdStarts`) with
   `scripts/lib/harness-context.mjs` (`readDirectives`, `sectionRange`):
   for each role, add the bytes of the files and sections its root's
   `Read:` lines name outright, leaving selectors that begin with `@`
   uncounted, and have `npm run meta` print both numbers. Check: `npm test
   -- --only process-debt`.
8. `node scripts/harness.mjs emit`, then the write-backs, each replacing
   the sentence now wrong and linking this order's decisions: product 07
   §Discipline (the cold-start paragraph: what the meter reports and that
   a role edit is checked by regeneration and the rule table) and
   §Operator-opened planning pass (the refutation is reached through the
   command); the kit guide where it describes the generated roots;
   `docs/evidence/WO-264/decisions.md`, with each root's installed bytes
   and fixed reads before and after. Then the handoff sequence of product
   07 §Discipline.

**Deliverables:** the rule records with their roles and the filter; the
rule-table case; the regeneration case; the removal of the baseline chain;
the refutation steps printed by the command; the ladder's own section and
the conditional ideation read; the meter's second number; the write-backs
and the decisions with the before and after measurements.

**Acceptance criteria (all required)**

1. For every role and both skill roots, the emitted root holds exactly
   once each shared rule whose record names that role and holds no shared
   rule whose record does not, by the case that derives both from the rule
   records. Check: `npm test -- --only skeleton`.
2. No installed root of the planner, the refuter or release close holds
   the dispatch-bounds paragraph, and every installed root of the
   executor, the verifier and the reviewer holds it. Check: `node
   scripts/harness.mjs check` and the case of criterion 1.
3. With a committed skill root changed by hand, `node scripts/harness.mjs
   check` fails naming that root; `packages/skeleton/fixtures/` holds no
   `*role-baseline*.json`, `scripts/check-role-oracle.mjs` is absent, and
   the structural phase lists no `role-oracle` task.
4. No installed root names `npm run plan -- review`, and the hook counts
   no worker use for that command.
5. The installed planner roots name no skill to load for the refutation,
   and `npm run plan -- refute` prints the parent's steps, naming `npm run
   plan -- receipt`, with the prompt. The installed refuter roots still
   carry the refuter's procedure.
6. In product 07, the section the verifier's and the reviewer's `Read:`
   lines name does not contain the review helper's `--kind` flags, the
   section that holds them is a second-level section of its own that the
   first links, and the installed planner roots name the ideation section
   only for an `ideation:` entry. Check: `npm run test:docs`.
7. `npm run meta` prints, for each role, its installed bytes and the bytes
   of the fixed reads its root names, and the planner's second number
   includes §Operator-opened planning pass and the sequence.
8. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only skeleton` for steps 1 and 3;
`npm test -- --only process-debt` for steps 2 and 7; `npm test -- --only
harness-fixtures` for steps 2 and 4; `npm test -- --only compiler` for step
3; `npm test -- --only plan-refutation` for step 5; the structural phase;
the complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-264/`: the rule-by-role table;
each role's installed bytes and fixed reads before and after; the failing
`harness check` of criterion 3; the output of `npm run plan -- refute`'s
steps; `npm run resume -- status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 8 and criteria 6 and 7; sources and
reopening conditions in `docs/evidence/WO-264/decisions.md`.

**Known issues and carry-ins:**

- FUP-f1c7a256bec46737, FUP-c1086ab57c145bac and the cold-start rows
  boarded by WO-217, WO-219, WO-238, WO-243, WO-246, WO-249, WO-251,
  WO-253, WO-254, WO-255 (two) and WO-257: this order is their
  allocation.
- The executor's root changes least under role scoping, because most
  shared rules do bind it. Its own 12,215 bytes, the support paragraphs
  the dispatch briefing also summarizes and the ladder sentences the guide
  also states are not reduced here; the decisions record what the table
  shows, and a later pass reads that measurement.
- Text the Claude hooks deliver at their trigger (the quality-pass
  paragraph, the question rule) stays in both skill roots, which remain
  byte-identical to each other; a root that differs by host is a separate
  decision.
- The ceilings in `docs/control/budgets.json` stay as recorded, so after
  this order each role's root sits well under an acceptance made for a
  larger one. The pass that reads this order's measurements decides
  whether a ceiling is restated at the measured root.
- The planning section a planner must read is 53,900 bytes and is not
  shortened here; the operator's `quality pass:` on that section is the
  existing route.
- An instance receives the new roots at its next emit after the update;
  the release's Read before upgrading says that the roots change and that
  no instance action follows.

**Non-goals:** rewording any rule; a root that differs between the Claude
and Codex skill directories; changing a ceiling, an acceptance or the
standing cold-start route; rewriting a section of product 07; the root
instruction file's generated block; the router's root; the support
paragraphs of the executor.

**Operator-review assumptions:** that a rule may leave a role's root when
that role never reaches what the rule governs, with the table of those
omissions reviewed in this order's decisions; that Git history is a
sufficient record of earlier role text, so the chain of baselines may be
removed; that a planning pass may take its refutation steps from the
command's output instead of from a skill; and that reporting the mandated
reads beside the installed bytes, without judging them against a ceiling,
is the first step wanted.
