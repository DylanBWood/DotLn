# WO-268 — What a session learns about a target is loaded by the next: a target's profile indexes area notes that state each rule with its evidence at a commit, the dispatch briefing of a target order names the profile, the notes and the order's workstream rules, a note older than the code it describes is flagged, and the kit guide gives the way to study a large codebase one bounded order at a time

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. A convention for area notes beside a
target's profile with one typed block the document gate reads; three
lines in a target order's dispatch briefing; one sentence in three roles;
a recipe in the kit guide. An instance with no area notes is briefed as
today plus the profile's path. Assigned at activation under the standing
opt-out default.
**Cost:** adds, in `scripts/resume.mjs` (`targetBriefing`), the profile's
path, the list of the target's area notes with each note's paths, commit
and count of target commits since, and the order's workstream document,
recurring work at each dispatch of a target order (one directory read and
one Git count per note; unmeasured, and measured by this order on the
target fixture); in `scripts/docs-check.mjs`, the shape check of a note's
typed block, recurring work in the document gate (unmeasured, and
measured by this order as the `docs-check` task's time before and after);
in `packages/skeleton/src/loadouts/contributor.ts`, one sentence in the
executor, the verifier and the reviewer; in
`scripts/kit/repository-profile.template.md`, the index and note
convention; cases in the suites the Preflight names; the kit guide,
product 12 and the decisions. Removes these states: a codebase's
unwritten rules relearned by each session or kept in a profile that grew
to tens of kilobytes; a workstream's rules that no role is told to read;
a recorded understanding with nothing to say it has aged. Tokens and
wall-clock: unknown until this order's handoff records them. Re-mints:
the editions the registered sources this order edits stale,
deterministically; no file in `FEEDBACK_SOURCE_PATHS` changes, so no live
feedback episode is owed. The files this order edits are declared sources
of machinery suites, so the final criterion names `npm test -- --review`.
Steps: the executor's, below.
**Nomination provenance:** the operator's statement of 2026-11-09 that
the work instance must study a large, multi-year codebase and keep that
understanding for later sessions (ignored capture SHA-256
`b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb`), which
is the reopening condition of FUP-67b423fdf450129c (research the existing
codebase before any order, recorded 2026-10-24), allocated by
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md).
**Depends on:** WO-072 and WO-236 (closed: the target worktree and the
executor's grant to write it); WO-264 (open: it makes each shared rule a
record that names its roles, and this order's sentence is such a record
naming three).
**Recommended placement:** ninth, after WO-267. It is the first of the
work instance's three jobs.
**Cites (read these sections):** `scripts/resume.mjs` (`targetBriefing`,
`executionBriefing`, `verificationBriefing`);
`scripts/kit/repository-profile.template.md` and `docs/repositories/README.md`
(core's fuller text of the same page); `scripts/lib/starter-seeds.mjs`
(the seed list); `scripts/kit/workstream.template.md` (`## Rules`);
`scripts/lib/work-order-workstream.mjs`; `scripts/docs-check.mjs` (how a
marker block's JSON is read); product 07 §Research and guided-operator
work orders; product 12 (the sentence that says a role loads its workstream document);
the kit guide §First steps (where a target is registered and its profile
written) and §Planning in this instance.

**Objective:** When a session studies part of a target, what it learned
is written as a short note that names the paths it covers, the commit it
was true at and each rule with the evidence for it, and every later
session that changes those paths is shown the note and told how many
commits have touched them since. A workstream's rules reach the roles
that work under it. An operator can have a large codebase studied area by
area, each area one bounded order, without any step that reads the whole
tree.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Nothing in the kit studies a target. `npm run discover` records the
  host's command-line tools. The skeleton's discovery is the resident's
  finder of work candidates and refuses a tree beyond 1,024 files. The
  Entropy Reducer on a registered repository is a debt review that reads
  the whole tree in one bounded episode and writes findings into the
  launchpad. What exists for understanding is the repository profile, one
  hand-written document per target with six sections that no program
  reads, and the research order, an ordinary order with method criteria
  and an outcome of `ready`, `negative` or `inconclusive`.
- A profile is one document. The fork's profile of its Angular target
  reached 31,692 bytes, a history of how it was checked included, before
  the template was rewritten around its `Current at:` field.
- A later session is pointed at the profile loosely. `targetBriefing` in
  `scripts/resume.mjs` says that repo-native authority includes the
  target's documentation root and the registered profile, without the
  profile's path; the role text says to read it on demand.
- A workstream's rules are loaded by nobody. The workstream template has a
  `## Rules` section, the fork keeps its coding rules there, product 12
  says a role loads the workstream document, and no role skill and no
  briefing names a workstream.
- Nothing reads `Current at:`. No code compares a profile's commit with
  the target's.
- The exported profile page lacks what core's has: the sentence on an
  observation order that authors the profile of an established repository
  and the section listing the target's own agent skills.

**Design (scope discipline):**

- The profile stays the entry and becomes an index. Beside
  `docs/repositories/<id>.md`, a directory `docs/repositories/<id>/` holds
  area notes, one Markdown file each. A note opens with a marked block of
  JSON that names the target paths it covers and the target commit it was
  written at; its prose states each rule the area follows with the file
  that shows it, the exceptions found and what is unknown. The block is
  the only part a program reads. Rejected: one larger profile with a
  section per area (the axis is loading: a session that changes one area
  would read all of them, which is how the fork's profile grew).
  Rejected: a catalog generated by scanning the tree (the axis is scale
  and meaning: a large tree yields thousands of rows, and a rule that is
  not written down is found by reading code, not by listing files).
- The briefing does the pointing. For a target order it prints the
  profile's path, each area note with its paths and commit and the number
  of target commits that touched those paths since, and, when the order
  declares a workstream, that document's path with its rules section
  named. One sentence in the executor's, the verifier's and the
  reviewer's text says to read the notes covering the paths the change
  touches before judging or changing them.
- Age is shown, never enforced. The count is an advisory in the briefing;
  a commit the clone does not hold prints `unknown`. Rejected: refusing
  work on a stale note (the axis is flow: a note two commits old is
  usually still right, and the session reading the code is the one that
  can tell).
- Notes are written by research orders, an area at a time. The kit guide
  gives the recipe: choose an area by its paths, bound the order's
  reading and spend, write or revise that area's note, and record what
  was not read. No step reads the whole target.
- The clean room is unchanged. Notes about a private target live in that
  target's instance and never in core.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/kit/repository-profile.template.md`: state the index and the
   area-note convention with the block's two fields, restore the
   observation-order sentence and the agent-skills section that
   `docs/repositories/README.md` carries, and give one worked note for an
   invented target. Check: `npm test -- --only launchpad`.
2. `scripts/docs-check.mjs` (where a marker block's JSON is read): for a
   file under a profile's directory, require the block with a non-empty
   list of paths and a commit, refusing a malformed one by file and field;
   a profile with no directory passes. Record the `docs-check` task's
   time before and after. Check: `npm test -- --only
   docs-check-fixtures`.
3. `scripts/resume.mjs` (`targetBriefing`): print the profile's path; for
   each area note of the order's repository its file, paths, commit and
   the count of commits in the registered clone that touched those paths
   since that commit, or `unknown`; and, when the order's header names a
   workstream, the workstream document's path and its rules section.
   Record the briefing's time on the target fixture before and after.
   Check: `npm test -- --only resume` and `npm test -- --only
   target-worktree`.
4. `packages/skeleton/src/loadouts/contributor.ts` (a shared rule record
   naming the executor, the verifier and the reviewer): one sentence, for
   a target order, to read
   the area notes that cover the paths the change touches and the
   workstream's rules the briefing names. Check: `npm test -- --only
   skeleton` and `npm test -- --only compiler`.
5. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §First steps, where a target is registered (the index and
   notes, and what the briefing prints), and §Planning in this instance
   (the recipe for studying a large target area by area with research
   orders), adding no second-level heading; product 12 (the
   sentence on the workstream document, which the briefing now makes
   true); product 07 §Research and guided-operator work orders (an area
   note as a research order's deliverable);
   `docs/evidence/WO-268/decisions.md`. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the template's convention and worked note; the block's
shape check; the briefing's lines; the role sentence; the recipe; the
cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. A fresh export's `docs/repositories/README.md` states the index, the
   area-note convention with the block's fields, the observation-order
   sentence and the agent-skills section.
2. In the document fixture, `node scripts/docs-check.mjs` passes a note
   whose block lists paths and a commit, fails naming the file and the
   field on a note whose block lacks either, and passes a profile that has
   no directory.
3. In the target fixture with a profile, two area notes and an order whose
   header names a workstream that has rules, the execution, verification
   and final-review briefings each print the profile's path, both notes
   with their paths and commits, and the workstream document's path.
4. In the same fixture, after two commits in the registered clone touch
   one note's paths, the briefing prints two for that note and zero for
   the other; with a note whose commit the clone does not hold it prints
   `unknown` for that note and the briefing completes.
5. Every installed root of the executor, the verifier and the reviewer
   carries step 4's sentence. Check: `node scripts/harness.mjs check`.
6. The kit guide states the convention, the briefing's lines and the
   recipe, product 12's sentence agrees with the briefing, and each links
   this order's decisions. Check: `npm run test:docs`.
7. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only launchpad` for step 1;
`npm test -- --only docs-check-fixtures` for step 2; `npm test -- --only
resume` and `npm test -- --only target-worktree` for step 3; `npm test --
--only skeleton` and `npm test -- --only compiler` for step 4; the
structural phase; the complete run with `npm test -- --review` at final
review.

**Evidence gate:** under `docs/evidence/WO-268/`: the three briefings of
criterion 3 and the two of criterion 4; criterion 2's outputs; the
briefing's and the `docs-check` task's times before and after; `npm run
resume -- status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 5 and criterion 6; sources and
reopening conditions in `docs/evidence/WO-268/decisions.md`.

**Known issues and carry-ins:**

- FUP-67b423fdf450129c: this order is its allocation for the kit's part;
  the study of a particular codebase is that instance's own orders.
- The briefing lists every note of the target. A target with very many
  notes makes a long briefing; selecting notes by an order's declared
  paths reopens when an instance reports the list as noise.
- How good a note is, is judged by the research order's verifier against
  that order's criteria. The document gate checks the block's shape and
  nothing in the prose.
- A target's dependencies on other repositories (the interfaces its code
  calls) are written in the note of the area that calls them; reading
  those repositories is a registration and an order of their own.
- The profile page is a seed. A new export carries the convention; an
  existing instance has its own copy of the page and meets the convention
  in the kit guide, and this order's release says in its Read before
  upgrading that the seeded page changed and where the new text is.
- The Entropy Reducer on a target stays what it is, a debt review; its
  findings may cite a note and do not write one.

**Non-goals:** a scanner or an index generated from the target's tree; a
refusal on an old note; reading a note's prose in a check; any change to
the Entropy Reducer or the skeleton's discovery; a role's unconditional
reading of every note; notes in core about any target.

**Operator-review assumptions:** that an area at a time, each a bounded
research order whose deliverable is a short note with evidence, is how a
large codebase is best learned under a limited budget; that showing a
note's age is enough without refusing on it; and that the dispatch
briefing, which every role reads, is the place to point from.
