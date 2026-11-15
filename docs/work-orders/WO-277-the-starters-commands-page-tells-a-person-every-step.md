# WO-277 — The starter's commands page tells a person every step: the private terms list before anything publishes, what each step does and what to do when it fails (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** patch. The kit's commands page,
`docs/OPERATOR.md`, which every starter ships and `node
scripts/launchpad.mjs commands` prints, gains the private terms list's
commands in its first step and a short paragraph for each step written for
a person: what it does, what to look for and what to do when it fails. The
starter's front page names the page first, and the kit guide's first
paragraph says whom the guide serves and links the page. No code, no
refusal. Its release close refreshes the starter, which is how the page
reaches the work laptop. Assigned at activation under the standing opt-out
default.
**Cost:** edits the seven marker sentences and adds one marked block in
`docs/KIT.md`, regenerates `docs/OPERATOR.md` with its own command, and
edits the seed front page `scripts/kit/README.client.md` (estimates: about
4 KB of text). No judged feedback source and no registered evidence source
is edited. One complete review run at final review (42.0 min on 2026-11-11
after WO-276's Part D). It removes the hand-carried setup the operator met
on 2026-11-15: a page that skips the terms list, so that a first planning
pass following it fails at its publish, and a front page that never names
it. Tokens and steps are unknown until run.
**Nomination provenance:** the operator's mid-turn messages of the
2026-11-14 planning pass (journal digests
`845b95bdf75feceec8605e9bc1ef7c5fdd10ef6ed5ff7f1c8362e00f07df68e4`,
`5a972f912507703b16e5770aff0170b29e92ab3de64ac93077ef9ea80466c495`,
`3a2647d3cc590bbeeef6efff6ecda0d34a6d990851b665892a8079c8fb76537e`,
`525c43760cbdd6805778155b76b25713992affbcd970d74c39d87ae08dbd2c40`,
`8e63070ff3fb9d8583b8e0b0189b57045a6954bb7c370eac2c5f44083dd1b7f0` and
`d730afd6e44637f3b21c059d54ae88f928f15a08c93895c6970c3ebac47186d0`), in paraphrase: setting up the enterprise
starter on the work laptop, the operator could not find the commands that
bring an instance up; the page the kit has skips the private terms list;
the 2026-11-07 pass's section of commands is the form wanted; the commands
belong in a document in the starter; and the operator should not wait
behind several orders for it. Clean-room screen: core's own documents.
**Depends on:** none.
**Recommended placement:** first and alone, run as soon as this pass
merges: its release close is what puts the page in the starter.
**Cites (read these sections):** `docs/KIT.md` §First steps (the clone
recipe, step 4's private terms list, steps 6 and 7), §Planning in this
instance (the first pass), §Taking upstream updates (the take-release
blocks); `docs/OPERATOR.md`; `scripts/lib/operator-commands.mjs` (the step
table and the marker grammar: one comment line above a fenced block, the
step's sentence on exactly one of its blocks); `scripts/kit/README.client.md`;
the 2026-11-07 pass's section
[The operator's next cycle: the commands](../planning/passes/first-cycle-returns-and-host-elections-2026-11-07.md#the-operators-next-cycle-the-commands)
and this pass's section of the same kind
([the 2026-11-14 pass](../planning/passes/v1-0-0-instance-returns-and-followups-2026-11-14.md#the-operators-next-cycle-on-the-work-laptop-the-commands)),
which the operator named as the form and which is checked against the
starter at `cd8ea69`.
**Objective:** A person who clones the starter opens its front page, is
sent to `docs/OPERATOR.md`, and sets the instance up from it alone: the
first step holds the private terms list's commands after the clone and
before anything publishes; each of the seven steps opens with a short
paragraph saying what the step does, what to look for and what to do when
it fails, in the manner of the 2026-11-07 section; the first planning pass's
step says that WO-001, already in the starter's sequence, can run before
it; and the release step says which side to keep when the update's merge
stops on `.claude/harness-manifest.json`.

**Observed gap (dated 2026-11-14 at `main` `ed66a822c`, v1.0.0; the
starter at `cd8ea69`):**

1. `docs/OPERATOR.md` step 1 ends at `node scripts/harness.mjs check`, and
   step 2 is the first planning pass. The guide says after the same recipe
   that it "does not replace step 4's local-terms list" and that "an absent
   list is `unavailable` and refuses publication" (§First steps), so a first
   pass that follows the page fails at its publish. The operator, following
   this pass's first answer, which copied the page, was told to start the
   pass without the list.
2. Each step on the page is one sentence of the guide's register and its
   blocks (for example step 3's 85 words on worktrees, phases and drives);
   none says what a person should see or do when a command fails.
3. The starter's `README.md` (from `scripts/kit/README.client.md`) names
   the page nowhere and sends a reader to `docs/KIT.md`, 2,739 lines that
   open with an inventory of the kit's directories; the guide names the page
   in passing at line 148, inside §First steps, and at lines 1059 and 1632.
4. The update's merge can stop on `.claude/harness-manifest.json` for an
   instance with a host the starter lacks; the page's release step does not
   say to keep this instance's side (`git checkout main --
   .claude/harness-manifest.json`), the route an instance used on
   2026-11-14. WO-282 repairs the emit itself; until then the page carries
   the route.

**Design (scope discipline):**

- Keep the generator and its single source. The page stays generated from
  the guide's marked blocks; each step's words are its marker's sentence,
  which becomes a short paragraph written for a person (one line in the
  comment, as the grammar reads it). The commands stay the guide's blocks,
  so the page and the guide cannot drift. Rejected: a hand-written page or
  a typed source of fields (axis: time; either changes the generator and its
  checks, which a release the operator is waiting for does not need, and
  WO-281's rewrite of the guide is where the page's form is weighed again).
- The terms list's commands become a second marked block of the
  `new-instance` step, from §First steps step 4, so the page's first step
  holds them after the clone recipe. The step table is unchanged, so no
  code changes.
- The front page's first paragraph names `docs/OPERATOR.md` and `node
  scripts/launchpad.mjs commands` for a person, then the guide. The guide's
  first paragraph says it is the reference the kit's roles and reviewers
  work from and links the page for a person.

**Execution plan (the executor follows these steps in order; observed at
`ed66a822c`, 2026-11-14):**

1. `docs/KIT.md` §First steps step 4: the terms list's commands as a fenced
   block (`mkdir -p docs/control/local`, `cp scripts/kit/terms.example.txt
   docs/control/local/terms.txt`, `npm run terms -- check CLAUDE.md
   README.md`) under the marker `operator-commands new-instance`. Check:
   `node scripts/lib/operator-commands.mjs --check` fails naming the page as
   stale, as it should before step 3.
2. `docs/KIT.md`, the seven marker sentences (`new-instance` at the clone
   recipe, `first-pass`, `run-order`, `close-order`, `take-release`,
   `register-repository`, `tell-core`): each rewritten as a short paragraph
   for a person, after the 2026-11-14 pass's section: what the step does,
   what to look for, what to do when it fails; `new-instance` names the
   terms list and why it comes before anything publishes; `first-pass` says
   WO-001 can run first; `take-release` gives the manifest's route on a
   conflicted merge. And the guide's first paragraph as the Design says.
3. `node scripts/lib/operator-commands.mjs` regenerates `docs/OPERATOR.md`.
   Check: `node scripts/lib/operator-commands.mjs --check` and `npm test --
   --only sync-fixtures`.
4. `scripts/kit/README.client.md`: the first paragraph as the Design says.
   Check: `npm test -- --only launchpad` (the export fixture's README and
   page) and `npm test -- --only launchpad-planning`.
5. Write-backs: `docs/evidence/WO-277/decisions.md` and the regenerated
   decisions index; the release's notes say where the page is. Then the
   handoff sequence of product 07 §Discipline. Check: `npm test -- --only
   registrations` and `npm run test:docs`.

**Deliverables:** the seven step paragraphs and the terms block in the
guide; the regenerated page; the front page's and the guide's first
paragraphs; the decisions.

**Acceptance criteria (all required)**

1. `node scripts/lib/operator-commands.mjs --check` passes, and
   `docs/OPERATOR.md`'s step 1 holds the clone recipe's block and then a
   block with `mkdir -p docs/control/local`, `cp
   scripts/kit/terms.example.txt docs/control/local/terms.txt` and `npm run
   terms -- check CLAUDE.md README.md`, before the step of the first
   planning pass.
2. `node scripts/launchpad.mjs commands` prints a paragraph before each
   step's blocks; the first planning pass's step names `WO-001`; the
   release step names `git checkout main -- .claude/harness-manifest.json`.
   Whether each paragraph serves a person is the operator's reading at final
   review (Operator-review assumptions).
3. In the export fixture of `npm test -- --only launchpad`, the exported
   `README.md`'s first paragraph links `docs/OPERATOR.md`, the exported
   guide's first paragraph links `OPERATOR.md`, and `node
   scripts/launchpad.mjs commands` run in the export prints the terms list's
   block in step 1.
4. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only sync-fixtures`, `npm test -- --only
launchpad`, `npm test -- --only launchpad-planning` and `npm test -- --only
registrations`; the structural phase; the complete run with `npm test --
--review` at final review.

**Evidence gate:** under `docs/evidence/WO-277/`: the regenerated page;
`node scripts/launchpad.mjs commands` from the export fixture; `npm run
resume -- status --json` after `implementation-ready`.

**Write-back duty:** the decisions and the index; the release's Read before
upgrading says the page is the place to start and that an instance whose
front page is its own keeps it.

**Known issues and carry-ins:**

- Until WO-278 lands, the first round is launched as WO-276-D118 records:
  each kind and the combined worker with no `--recheck`, on one `--since`
  base, each dry run read first.
- The emit's own repair, the register's carry and the other update-path
  repairs are WO-282; the page carries the manifest's route until then.

**Non-goals:** any change to the generator, the step table or a check; the
guide's other sections (WO-281); the update's code (WO-282).

**Operator-review assumptions:** the operator reads the regenerated page at
final review against the 2026-11-07 pass's section; the step paragraphs are
written for a person setting up on a managed work machine.
