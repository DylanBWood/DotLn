# WO-244 — Paired planning passes and the synthesis pass: the dispatch line carries a host label the pass checks against the host it runs on, a paired pass is refused the reads that would unblind it, `plan start` records the pair, `plan synthesize` compares the two branches and names the collisions, the synthesis role folds the other pass in and files the receipt on the base, and the losing pull request is closed with a comment naming the synthesis; and a reviewed standard pass runs the executor's three reviewer types as Codex workers through `plan review` after its subject is committed and before the refuter (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. Three dispatch labels and one new dispatch
phrase, one refusal class active only inside a labelled paired pass, one
record on `plan start`, two helpers that write only to the ignored lane
(`plan synthesize`, `plan review`), and the synthesis and reviewed-route
duties in the planner's role text; a pass without a label behaves as today. Assigned
at activation under the standing opt-out default.
**Cost:** adds, in the prompt hook's dispatch reading
(`packages/skeleton/src/harness-host.ts`, the `planning:` prefix classes
WO-226 records) the labels `gpt`, `fable` and `reviewed` and the phrase
`synth pass` with their `passKind` (`standard`, `paired`, `synthesis`,
`reviewed`) and `hostLabel` recorded in the dispatch row; in the planner role
(`packages/skeleton/src/loadouts/contributor.ts`) the host check (a label
naming the other host stops the pass and says so), the blindness duties and
the synthesis duties; in the hook's command judgment, one refusal active
while the session's dispatch is a paired pass: a command that lists
branches, refs or pull requests (`git branch -a`, `git branch -r`, `git log
--all`, `git for-each-ref`, `git show-ref`, `git ls-remote`, `gh pr list`,
`gh pr view`, `gh pr diff`, `gh api`), fetches, or names a `planning/` ref
other than the session's own branch, refused naming `planning: synth pass` and
`operator override:`; in `scripts/refute-plan.mjs`, `plan start` writing
the pair record (the date, the label, the branch) into the planning
document's dispatch section and the ignored local lane, and `plan
synthesize <branch-a> <branch-b>` (read-only) printing both branches'
changed files, the shared ones, the duplicate `WO-NNN` ids and receipt
numbers, each pass's receipt verdict and findings, and the base choice
inputs; `plan review`, which launches the executor's three reviewer types
(the criteria adversary, the design improver and the consistency reviewer,
as `packages/skeleton/src/loadouts/contributor.ts` defines them for the
executor) as Codex workers at the Codex pin through the `codex exec` form
the entropy review's `codex-cli-exec` transport uses
(`scripts/lib/entropy-review.mjs` 654; `codexExecArgv`,
`packages/skeleton/src/worker-transport.ts` 364), through WO-250's `npm run
worker -- review --subject planning` for each kind (WO-250 lands before
this order), read-only against the
committed subject, with canonical briefs rendered from the role text and
the subject's changed files, the three reports written to the ignored lane
and `review: <kind> found N` printed per reviewer with its elapsed time; the
reviewed route's duties in the planner's role text (commit, `plan review`,
integrate at the pass's judgment, record `self-review: found N; fixed N;
recorded N` in the planning document, commit, then `plan refute`); cases in
`scripts/test-harness.mjs`, `scripts/test-harness-fixtures` (the refusal),
`scripts/test-plan-refutation.mjs` (the helpers, the pair record, a fake
review transport as the entropy review's); product 07 §Paired passes and the synthesis pass stated as built;
the kit guide's planning section (`docs/KIT.md` after WO-245). Removes: the blindness held by promise
alone (today a paired pass stays blind only because its role text and the
operator say so), the by-hand comparison of two branches (today `git diff
--stat`, `gh pr view` and a reading, as the 2026-10-30 synthesis did), and
the unrecorded pairing (today nothing says which two passes were a pair).
Wall-clock: the refusal is one regular-expression match per judged command
inside a paired pass, measured before and after; the helper is a read of
two branches. Context bytes: this file, about 13,000; the planner root
grows by the paired and synthesis duties, measured against its ceiling
under the standing route. Commands: `plan synthesize` and `plan review`, new. Tokens:
unknown until run. Steps: 9. Re-mints: `harness-host.ts` and `contributor.ts` are
runtime sources the executor checks against `scripts/lib/evidence-sources.mjs`
at activation and re-mints deterministically where an edition is staled;
no feedback-judged source changes, so no live feedback episode;
`refute-plan.mjs`, `harness-host.ts` and `loadouts/contributor.ts` are
declared machinery sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's fourth, fifth and sixth messages
of the 2026-10-30 planning dispatch (ignored intake
`docs/intake/notes/planning-node24-features-config-plan-first-no-work-stream-2026-10-30-message-4.md`,
SHA-256 `ef80d5f9a2f826921495793bf20981e3bdf3f68fd785521a176f1b5623c34ebc`,
and the sixth message's capture named in the planning document): make the
two blind passes and a synthesis a routine; a simple dispatch form such as
`planning: standard gpt pass`; the synthesis started by hand; the order gpt,
then fable with the synthesis in that session. Filed by the
[2026-10-30 pass](../planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md),
whose own run is the routine's first instance (#256 on Codex, #257 on
Claude Code, the synthesis in the Claude session). The reviewed route: the
operator's fourth mid-turn message of the 2026-10-31 planning dispatch
(ignored intake
`docs/intake/notes/planning-kit-guide-home-fork-block-and-drive-returns-2026-10-31-message-4.md`,
SHA-256 `82dd33e4ea5ed1aa36e2bac3b6f785e8eb0270c6f4a48b22d9570bf5efa34293`): three routes, the normal
pass, a Codex pass followed by a blind Claude pass and a synthesis, and a
normal Fable pass that uses the three Codex reviewers before the
refutation; amended in by the
[2026-10-31 pass](../planning/kit-guide-home-fork-block-and-drive-returns-2026-10-31.md),
whose own run is the reviewed route's first instance. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-226 (closed: the prompt hook's first-content-line
dispatch reading this order extends with labels); WO-139 (closed: the
session journal's dispatch row the `passKind` and `hostLabel` join);
WO-041 (closed: the refutation receipt the synthesis pass files on the
base); WO-250 (the review helper `plan review` calls, with its planning
lane and argv, lands before this order); WO-249 (the five defect classes
the criteria adversary's planning brief carries land before this order).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-226",
    "relation": "satisfied-by-close",
    "reason": "the prompt hook's dispatch reading the labels and the synth phrase extend"
  },
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the session journal's dispatch row that records passKind and hostLabel"
  },
  {
    "workOrderId": "WO-041",
    "relation": "satisfied-by-close",
    "reason": "the receipt helper the synthesis pass files its new receipt with"
  },
  {
    "workOrderId": "WO-250",
    "relation": "satisfied-by-close",
    "reason": "the review helper, its planning lane and its argv that plan review calls"
  },
  {
    "workOrderId": "WO-249",
    "relation": "satisfied-by-close",
    "reason": "the five defect classes the criteria adversary's planning brief carries"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Operator-opened planning pass
(the dispatch reading: first content line, one prefix per message; WO-226)
and its §Paired passes and the synthesis pass (the rule as the 2026-10-30
pass wrote it); `packages/skeleton/src/harness-host.ts` (the `planning:`
dispatch classes and the `resume:` table near 802; the command judgment
that refuses literal redirects and known destinations, WO-135 and WO-144);
`packages/skeleton/src/loadouts/contributor.ts` (the planner's role text:
`plan start`, the refuter dispatch, the push and pull request);
`scripts/refute-plan.mjs` (`start` at 401: clean main, the skeleton, the
branch; `receipt`); `scripts/lib/planning-document.mjs` (the nine headings);
`docs/planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md`
§Dispatch and capture (what the blind pass did not read) and the section on
the consolidation (how the synthesis chose a base and folded the other
pass in).

**Objective:** The routine the operator described runs without relying on
anyone's memory: a dispatch line names its host and the pass refuses to run
on the other host; a paired pass cannot unblind itself by accident, because
the hook refuses the commands that would; `plan start` records which pass
this is; `plan synthesize` lays the two branches side by side with their
collisions named; the synthesis duties are role text every planner reads,
and the result is one receipt on one base branch and one closed pull
request with a comment that says where its ideas went.

**Observed gap (dated 2026-10-30 at `main` `4090d70d`):**

- The prompt hook reads a `planning:` dispatch from the first content line
  and records its prefix, class and role (WO-226); it reads no label after
  the phrase, so `planning: standard pass, gpt` is today an ordinary
  standard pass with trailing words the planner may or may not notice.
- Nothing refuses a planning session the reads that unblind it. The
  2026-10-30 Claude pass stayed blind by dropping the branch column of
  `git worktree list` and by not running `git branch -a`, `git fetch`,
  `git log --all` or `gh pr list`, and by not opening three ignored files
  whose names carried the date; it recorded that in its document. That is
  a promise, not a boundary.
- Two blind passes allocate from the same counters: both passes of
  2026-10-30 filed WO-240, WO-241 and WO-242 under different filenames and
  both filed receipt 059 under different hashes. The synthesis resolved the
  collision by keeping the base's ids and treating the other pass's orders
  as design inputs; nothing recorded that rule until product 07 did.
- The comparison was done by hand: `git diff --stat main...<branch>`,
  `gh pr view`, `git show <branch>:<path>` for each order and the planning
  document, and the receipts' JSON read with a one-off script.
- No record says which two passes were a pair. The ledger registrations
  and the pull requests name the day; the pairing is in the operator's
  head.
- The reviewed route has run once, by hand: the 2026-10-31 pass launched
  three `codex exec` workers (gpt-6.1-sol at `max`, read-only sandbox)
  with briefs it wrote itself in its ignored lane, 4 to 6 minutes each, and
  integrated their twenty findings (fifteen distinct) before refuting;
  nothing records the route, the briefs were the pass's own words, and the
  role text names no such step.

**Design (scope discipline):**

- **Labels, not a host switch.** The dispatch line's label records intent;
  the host is whatever CLI the operator opened, and the attestation already
  names it (`claude-code`, `codex-cli`, `copilot-cli`). A pass whose label
  names the other host stops before `plan start` and says which host it is
  on. Rejected: choosing a model from the dispatch (axis: no host lets a
  prompt switch the model; the label is checked, not obeyed).
- **Blindness as a refusal inside the pass.** While the session's dispatch
  row says `passKind: paired`, the hook refuses the commands the Cost lists,
  naming the two exits (`planning: synth pass` lifts it in the synthesis;
  `operator override:` lifts it for recovery); the refusal reads only the
  literal command, as every hook refusal does, so a program's own effects
  stay unobserved under host permissions and the role text keeps the duty.
  Rejected: a blind pass in a fresh clone without the other branch (axis:
  the remote has it; a clone is not a boundary either).
- **The pair is recorded where the pass is.** `plan start` writes the label,
  the date and the branch into the planning document's dispatch section
  and into the ignored lane, so `plan synthesize` can find the pair by date
  without being told. Rejected: a new control event (axis: a planning pass
  appends no lifecycle events; the document is its record).
- **The helper lays the branches side by side; the role judges.**
  `plan synthesize <a> <b>` is read-only: changed files per branch, shared
  files, duplicate ids and receipt numbers, each receipt's verdict, hold
  count and finding count, and the base-choice inputs (order bytes, steps,
  criteria counts). The judgment of what is better stays with the
  synthesis role. Rejected: a merge driver (axis: the two subjects differ
  in design, not in text; a textual merge of two WO-242s is nonsense).
- **One receipt on the base; the loser closed.** The synthesis pass files
  its receipt on the base branch with `--worker-type` as today, pushes, and
  closes the other pull request with a comment naming the synthesis pass
  and the base pull request; the losing branch stays as a record. The
  closing comment is an outward effect the `planning:` dispatch authorizes
  with the push and the pull request. Rejected: merging both (axis: the
  index refuses duplicate ids; the register and the sequence are one).
- **Three routes, one grammar.** A standard phrase runs as today; `, gpt`
  or `, fable` marks a paired pass; `, reviewed` marks a reviewed pass,
  which after committing its subject runs `plan review`, integrates the
  findings at the pass's judgment, records `self-review: found N; fixed N;
  recorded N` in its document, commits, and only then refutes. The
  reviewers are the executor's three, launched as Codex workers at the Codex
  pin because the operator's direction names that host and the role text
  already pins it; the briefs are canonical, rendered from the role text's
  three definitions and the subject's changed files, so a pass never
  writes its own. Rejected: the reviewers in place of the refuter (axis:
  the refuter is the pass's independent verification under the
  implementer-is-not-verifier rule, and the reviewers are the pass's own
  self-review, as the executor's are). Rejected: a reviewed paired pass
  (axis: a blind pass pays twice for the same findings; the synthesis pass
  may run `plan review` on the folded subject instead).
- **Live-run surfaces at the base.** The dispatch reading: exists. The
  command refusals and their exits: exist for other classes. The receipt
  helper: exists. The Codex exec transport: exists for the entropy review.
  The labels, the paired refusal, the pair record, the two helpers and the
  synthesis and reviewed duties: absent.

**Execution plan (the executor follows these steps in order; observed at `4090d70d`, 2026-10-30):**

1. `packages/skeleton/src/harness-host.ts` (the `planning:` dispatch
   reading, WO-226): parse `planning: <phrase>[, gpt|fable|reviewed]` and
   `planning: synth pass [<a> <b>]`; record `passKind` and `hostLabel` in
   the dispatch row; a quoted example on a later line stays prose. Check: `npm test --
   --only harness-fixtures`.
2. `packages/skeleton/src/harness-host.ts` (the command judgment): while
   the session's dispatch is `paired`, refuse the listed commands and any
   command naming a `planning/` ref other than the session's branch, naming
   the two exits; `synthesis` and `standard` passes are unaffected; the
   refusal's measured cost per judged command is recorded. Check: `npm
   test -- --only harness-fixtures`; `npm test -- --only harness`.
3. `scripts/refute-plan.mjs` (`start`): write the pair record (label, date,
   branch) into the planning document's dispatch section and the ignored
   lane `docs/control/local/planning-pairs/<date>.json`. Check: `npm test
   -- --only plan-refutation`.
4. `scripts/refute-plan.mjs` (`synthesize <a> <b>`, read-only; with no
   arguments the two most recent `planning/<today>-*` branches with open
   `:memo:` pull requests, read through the pair record): print the
   comparison the Design names; refuse when a branch is missing or the two
   are the same. Check: `npm test -- --only plan-refutation` (a fixture
   with two branches, duplicate ids and two receipts).
5. `packages/skeleton/src/loadouts/contributor.ts` (the planner's role
   text): the host check, the paired pass's blindness duties (what not to
   read; say what was not read), the synthesis duties as product 07
   §Paired passes and the synthesis pass states them (lift the blindness,
   judge both by one standard, name own errors, choose the base, fold with
   provenance, re-judge with a fresh refuter, push, close the other pull
   request with a comment), and the reviewed route's duties (commit, `plan
   review`, integrate, the self-review line, commit, `plan refute`). Check: `npm test -- --only harness` and `npm
   test -- --only harness-context` (the planner root against its ceiling
   under the standing route).
6. `scripts/refute-plan.mjs` (`receipt`) and the synthesis role: the
   receipt's statement names the synthesis and both source branches; the
   helper admits the new receipt on the base branch where the base's own
   receipt already stands (the continuing-work gate reads the newer
   receipt). Check: `npm test -- --only plan-refutation`.
7. `scripts/refute-plan.mjs` (`review`): refuses a workspace that differs
   from the committed subject; for each of the three kinds calls WO-250's
   helper (`npm run worker -- review --kind <kind> --host codex --subject
   planning --since main`: the canonical brief rendered from the role
   text's three reviewer definitions, the branch's planning document and
   its changed orders, the report in the helper's planning lane
   `docs/control/local/reviews/planning-<date>/`, the `WorkerLaunched` row
   and the counted use) in parallel; the criteria adversary's planning
   brief appends the criterion screens of product 07 §Operator-opened
   planning pass, WO-249's five defect classes among them, so a reviewer of
   orders never proposes a bookkeeping or later-phase clause (the fork's WO-021 criterion 9, which failed its
   VER-001 on 129 uncommitted paths, came from a criteria adversary's
   finding); prints `review: <kind> found N` with each worker's elapsed
   time, or that a worker returned no report; the fake transport serves the
   fixture. Check: `npm test -- --only plan-refutation`.
8. Write-backs: product 07 §Paired passes and the synthesis pass (stated as
   built: the labels, the refusal and its exits, the pair record, the
   helpers, the closing comment, the reviewed route); the kit guide (`docs/KIT.md` once WO-245 merges, otherwise
   `scripts/kit/README.client.md`) §Planning in this instance (the routine
   as an instance may run it);
   `docs/evidence/WO-244/decisions.md` (the measured refusal cost before
   and after; the planner root's bytes); re-mint any edition the runtime
   sources stale; `npm run meta`; `node scripts/lineage.mjs index --check`;
   `npm run publication:check`.
9. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-244/handoff.md`; `npm run test:docs`
   once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the labels and the synth phrase in the dispatch reading;
the paired refusal with its exits; the pair record; `plan synthesize`; `plan
review` with its canonical briefs and fake transport; the planner's paired,
synthesis and reviewed duties; the receipt statement form; the write-backs.

**Acceptance criteria (all required)**

1. The dispatch row of a session opened with `planning: standard pass, gpt`
   or `, fable` records `passKind: paired` and the label; `planning: synth
   pass` records `passKind: synthesis`; `planning: standard pass, reviewed`
   records `passKind: reviewed`; a bare `planning: standard pass` records
   `standard`; a quoted dispatch on a later line records nothing (fixtures).
2. The emitted planner root stops a pass whose label names the other host
   before `plan start`, naming the host the attestation records; the root
   carries the blindness and synthesis duties; `harness check` passes and
   the planner root's cold-start bytes are recorded against the ceiling.
3. In the harness fixture, during a `paired` dispatch, `git branch -a`, `gh
   pr list`, `gh pr view 256`, `git fetch origin`, `git show
   origin/planning/other:docs/x.md` and `git log --all` are refused naming
   `planning: synth pass` and `operator override:`; the same commands are
   admitted during `synthesis` and `standard` dispatches and after
   `operator override:`; the refusal's duration is recorded.
4. `plan start` under a labelled dispatch writes the pair record into the
   document's dispatch section and the ignored lane; `plan synthesize a b`
   on a fixture pair prints both branches' changed files, the shared files,
   the duplicate order ids and receipt numbers, each receipt's verdict and
   finding count, and the base-choice inputs, and refuses a missing or
   identical branch; with no arguments it resolves the pair by date.
5. A synthesis receipt filed on a fixture base branch that already holds a
   receipt passes `plan check` as the newer receipt, and its statement names
   both source branches.
6. Product 07 and the kit guide state the routine and the reviewed route as
   built; `npm run publication:check` is green.
7. `plan review` on a fixture subject with the fake transport files three
   reports named by kind and prints three counts with elapsed times,
   refuses a workspace that differs from the committed subject, and reports
   a worker that returned no report; the emitted planner root carries the
   reviewed route's duties and `harness check` passes.
8. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only harness-fixtures` for steps 1 and 2;
`npm test -- --only harness` and `npm test -- --only harness-context` for
steps 2 and 5; `npm test -- --only plan-refutation` for steps 3, 4, 6 and 7;
`npm run test:docs` when a document changes; each under `node
scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixtures of criteria 1, 3, 4, 5 and 7; the deterministic
re-mints of any edition the runtime sources stale; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete
row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 8 and criterion 6.

**Known issues and carry-ins:**

- The refusal reads literal commands; a script that fetches or reads the
  other branch from inside a program is unobserved, as every hook refusal
  is under host permissions, and the role text carries that duty (reopen: a
  paired pass's document shows it read the other pass through a program).
- Two blind passes keep colliding on ids and receipt numbers by design; the
  synthesis resolves it. A per-pass id range was considered and declined
  (axis: the collision costs the synthesis one renumbering of the losing
  side's references and buys the passes nothing) (reopen: a synthesis
  reports the renumbering as its largest cost).
- The reviewers of the reviewed route run as Codex `exec` processes from
  whichever host the pass runs on, since `spawn_agent` is Codex's own
  primitive; their reports are the pass's self-review and not receipts, and
  the refutation receipt stays the pass's immutable record (reopen: the
  operator wants the reviews filed as receipts, or a pass runs the route
  without a Codex binary on the host). The launch is WO-250's helper, which
  counts each worker against the cap and lands before this order; the
  2026-10-31 pass and the fork's first pass of 2026-11-01 each ran the route
  with a launcher of their own in an ignored lane, the form this order
  replaces (reopen: a pass runs the route with a launcher outside the kit
  after this order lands).
- The fork's item 6 of 2026-11-01: under a disabled-feature list written
  for Codex CLI 0.154.0, CLI 0.166.0 answered every tool call with "code-mode
  host is disabled"; the kit's default worker argv disables the three
  features and only the entropy review's form keeps them, which WO-250's
  helper takes and confirms on 0.166.0, while this order's fixture uses the
  fake transport (reopen: `plan review` on a real host returns no report
  from every worker).
- A host label always means a paired pass, so a single pass the operator
  wants on a named host runs unlabelled; and the paired refusal covers
  every fetch, so a paired pass that needs current `main` takes `operator
  override:` for that one read (reopen: an override is recorded in a
  labelled pass that had no partner, or to fetch `origin main` inside a
  paired pass). Once WO-251 renders the refusals sentence from a list, this
  order adds its paired-pass refusal's row.
- The closing comment on the losing pull request is the one outward effect
  this order adds; it carries no attribution and names only the synthesis
  pass and the base pull request (reopen: the operator wants the losing
  branch deleted too, which this order does not do).

**Non-goals:** choosing a model from the dispatch line; running the two
passes from one session; merging two planning branches textually; deleting
the losing branch; a planning lifecycle event; changing the refuter; the
reviewers in place of the refuter; a reviewed paired pass.

**Operator-review assumptions:** that the default order is Codex first,
then Claude Code, with the synthesis in the Claude session after its own
receipt, and that a separate synthesis session is admitted when the
operator prefers it; that the labels are `gpt` and `fable` in whatever
position after the phrase, read case-insensitively; that the losing pull
request is closed, not merged and not deleted. Reopen the order of hosts or
the session choice on the operator's word.
