# WO-261 — An instance's update keeps its own files: the update publish refuses a merge that rewrote a file both the instance and the starter had changed, the preview lists those files before the merge, and a kit worker launch is counted in every spelling

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. One refusal in `update --publish` with a
per-path admission; one section in the update preview; the launch
recognizer reading a flag after the script name. Assigned at activation
under the standing opt-out default.
**Cost:** adds, in `scripts/launchpad.mjs` (`publishUpdate`'s `ready` and
`previewFromRevision`), the reading of files both sides of an update merge
changed, recurring work in each update publish and preview (four Git reads
of two trees' differences; unmeasured, and measured by this order on the
update fixture); in `packages/skeleton/src/harness-host.ts`
(`kitWorkerLaunch`), the launch recognizer's flag position; cases in the
suites the Preflight names; the kit guide and the decisions. Removes these
states: an instance's closed order and budgets rewritten by an update merge
with no notice; seed conflicts resolved by reading alone; a worker launch
that the cap never counted. Tokens and wall-clock: unknown until this
order's handoff records them. Re-mints: the editions
`packages/skeleton/src/harness-host.ts` stales, deterministically; no file
in `FEEDBACK_SOURCE_PATHS` changes, so no live feedback episode is owed.
`scripts/launchpad.mjs` and `packages/skeleton/src/harness-host.ts` are
declared sources of machinery suites, so the final criterion names
`npm test -- --review`. Steps: the executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-08 (ignored
capture SHA-256
`a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`): item 4
and the DotLn-Enterprise-Starter fork's block after starter v0.122.0, item
2; [WO-258-D035](../evidence/WO-258/decisions.md#wo-258-d035)
(FUP-973464a1fa408976); the operator's statement of 2026-11-09 that an
instance's own work must live side by side with regular updates from core
(ignored capture SHA-256
`9006bd8cbcdabb5647594adb6893150aaff9e5a8ee74260a4e890e9cba3d69ae`), under
which [the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md)
kept the update rule and the launch count and declined the session
sub-root and the tag-fetch refusal.
**Depends on:** WO-258 (closed, v0.121.0: the starter refresh whose seed
changes an instance's merge meets); WO-260 (closed, v0.122.1: the recorded
Git surface this order's Git forms are checked against); WO-265 (open: it
edits `previewFromRevision` first).
**Recommended placement:** seventh, after WO-265: both are met at an
instance's next update, and the work instance takes updates regularly.
**Cites (read these sections):** `scripts/launchpad.mjs` (`publishUpdate`,
`kitProvenance`, `previewFromRevision`); `scripts/lib/starter-refresh.mjs`
and `scripts/lib/starter-seeds.mjs` (the seed rules, read only);
`scripts/lib/git-surface.json`; `packages/skeleton/src/harness-host.ts` (`kitWorkerLaunch`);
`packages/skeleton/src/test-selection.mjs` (`npmScriptArgs`, read only: it
has two other callers and is a declared source of six suite rows); the kit
guide §Taking upstream
updates, §Opting in to instance actions and §Kit files and instance files.

**Objective:** An update never changes a file its instance had changed
without the session and the operator seeing which, before the merge and
again before the publish, and every spelling of a kit worker launch counts
against the cap.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- The update merge. The kit guide §Opting in to instance actions says an
  update leaves instance files byte-identical by default, which holds for
  `export --update` and not for the route §Taking upstream updates gives an
  instance: a Git merge of the starter's revision. WO-258's starter refresh
  added seeds the starter lacked and rewrote the seeded first order, so the
  fork's merge of v0.121.0 and v0.122.0 met three conflicts in files it
  already had (the front page, the configuration file and the lineage
  index) and two merges Git made silently: the refreshed template text
  into the fork's closed first order, and the template's router ceiling
  into the fork's budgets. The fork's planner found and reversed both by
  reading the diff. `publishUpdate`'s `ready` (`scripts/launchpad.mjs`)
  proves the provenance files, `harness check` and the lineage index, and
  reads no instance file. Every instance cloned before a seed changes
  meets the same merge at its next update, and an instance that builds its
  own material beside the kit meets it more often.
- The launch count. `kitWorkerLaunch` does not recognize `npm run worker
  --silent -- review`: `npmScriptArgs` leaves a flag that follows the
  script name ahead of the separator, so the word it compares is not
  `review`. WO-258's executor session ran ten workers and the hook counted
  seven (WO-258-D035).

**Design (scope discipline):**

- The rule is about files both sides changed. For a path the incoming
  manifest does not list: when the instance changed it since the merge
  base and the starter changed it too (or both added it with different
  bytes), the merge commit must hold the instance's bytes; a path only the
  starter changed flows in as Git merges it, and a new path arrives.
  Rejected: pinning every instance file to the instance's bytes (the axis
  is what an instance wants: an untouched seed should follow the starter,
  and a retired seed should leave). Rejected: one sentence in the guide
  alone (the axis is who catches it: the fork caught two silent merges by
  reading, and the next session may not). Rejected: a starter refresh that
  leaves a seed alone unless the starter still holds the export's own bytes
  (the axis is where the collision is: the starter's history still changes
  the path, and the instance's merge is what meets it).
- Judged at the update's own merge commit, by the incoming launchpad, so
  the first update that brings this order is already protected. That
  commit is the one on the branch with the starter's incoming revision,
  the one the provenance names, as a parent; the instance's side is its
  other parent, whichever position it holds. Later commits on the branch
  (the re-emit, the lineage index, the features page) and a later merge of
  `main` into the branch are not update merges and are not judged, so the
  restore the refusal prints never puts the starter's bytes over the
  instance's. `--take <path>` admits one named path whose
  starter bytes the operator wants; the publish prints each taken path.
- The preview shows the same paths before the merge, under a line that
  says to keep the instance's bytes when merging.
- Two items of the 2026-11-08 design are declined. A sub-root of intake
  for a session's own drafts would open an unscreened place inside the one
  root the words screen exists to read; a session's drafts and a tool's
  output belong outside intake, which the kit guide now says. A hook
  refusal of an explicit tag fetch would fire only on a hooked host and
  add a clause to every role's refusal sentence, while the guide already
  gives the plain fetch.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/launchpad.mjs`: beside `kitProvenance`, a function that takes
   a merge commit and returns the paths, outside the incoming
   `KIT-MANIFEST.json`'s list, that differ between the merge base and each
   parent (or that both parents added with different bytes) and whose bytes in the merge commit differ from the instance's side. `publishUpdate`'s
   `ready` calls it for the merge commit on the branch that has the
   incoming starter revision as a parent, with the other parent as the
   instance's side, and refuses, naming each path, the command that
   restores it from that parent and `--take <path>`; `update --publish` accepts `--take` and
   prints each taken path. Every Git form it uses exists in Git 2.31.0
   (`scripts/lib/git-surface.json` gains its pairs). Record the reading's
   time on the update fixture. Check: `npm test -- --only launchpad`.
2. `scripts/launchpad.mjs` (`previewFromRevision`'s output): a section
   listing the files both this instance and the starter changed since
   their merge base, outside the incoming manifest, under a line that says
   to keep the instance's bytes when merging. Check: `npm test -- --only
   launchpad`.
3. `packages/skeleton/src/harness-host.ts` (`kitWorkerLaunch`): read past
   npm's own flags between the script name and the separator before
   comparing the subcommand, so that a kit launch whose npm flag follows
   the script name is counted as the plain spelling is, with a case per
   spelling; `npmScriptArgs` in `packages/skeleton/src/test-selection.mjs`
   and its other callers are unchanged. Check:
   `npm test -- --only harness-fixtures`.
4. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §Taking upstream updates (the merge
   keeps the instance's bytes for a file both sides changed, the refusal,
   `--take` and the preview's section; a closed order's text is restored,
   never merged) and §Opting in to instance actions (which update route
   its first sentence describes); `docs/evidence/WO-261/decisions.md`.
   Then the handoff sequence of product 07 §Discipline.

**Deliverables:** the both-sides reading with the publish refusal, `--take`
and the preview's section; the launch recognizer's cases; the write-backs
and the decisions.

**Acceptance criteria (all required)**

1. In the update fixture, with a seeded order and `docs/control/budgets.json`
   changed by both the instance and the incoming revision since their merge
   base and a merge commit that carries Git's merged bytes for both,
   `node scripts/launchpad.mjs update --publish --title <title> --body-file
   <path>` refuses before any push, naming both paths, the restore command
   and `--take`. After the merge commit holds the instance's bytes for both
   paths, the same command proceeds. With `--take` naming one of the two
   and the other restored, it proceeds and prints the taken path. A file only the incoming revision changed, a file only it added and a kit
   file
   the incoming manifest lists are never named. With `main` merged into the
   update branch after the update's own merge, the same commit is judged,
   the same paths are named and the restore command names the instance's
   side.
2. In the same fixture, `node <incoming>/scripts/launchpad.mjs preview
   --from <revision>` lists both paths in the section step 2 adds and lists
   none of the files criterion 1 says are never named.
3. The hook counts one use for each of `npm run worker -- review`,
   `npm run --silent worker -- review`, `npm run worker --silent -- review`
   and `node scripts/worker.mjs review`.
4. The kit guide states steps 1 and 2 in the sections step 4 names, each
   linking this order's decisions. The verifier reads the
   named section; `npm run test:docs` judges its links and form.
5. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only launchpad` for steps 1 and 2;
`npm test -- --only harness-fixtures` for step 3; the structural phase; the
complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-261/`: criterion 1's three
publish outputs and criterion 2's preview; the reading's time on the
update fixture; the hook's four counts of criterion 3; `npm run resume --
status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 4 and criterion 4; sources and
reopening conditions in `docs/evidence/WO-261/decisions.md`.

**Known issues and carry-ins:**

- FUP-973464a1fa408976 (WO-258-D035): the launch recognizer, step 3.
- The fork's merge is not reproducible here beyond the fixture: the fork
  reported the five paths and what it did, and the update fixture carries
  one conflicting pair and one silently merged pair as its reproduction.
- An instance that already took v0.121.0 or v0.122.0 by merge before this
  order may hold the two silent merges the fork found; this order's release
  notes say how to read for them (the first order's text and the budgets
  file against the commit before that update's merge), and no check
  rewrites history.
- Two merge bases (a criss-cross history) are read at the first one Git
  names; the decisions record whether the update fixture can produce the
  case, and the refusal names the base it used.
- The kit's own `package.json` and lockfile are kit files that Git merges
  line by line, so an instance that adds a script entry or a dependency to
  them meets a merge there; WO-267 gives an instance a root of its own for
  both, and this order does not judge those two files.
- FUP-7de23c426e329c34 (WO-258-D014, the older rendering of a starter's
  documentation index) stays deferred: this order does not edit the starter
  refresh's seed rules.
- The tag-fetch refusal reopens when a hand deletion of fetched tags is
  reported again from a hooked host; the session sub-root reopens when a
  session's drafts are found under intake after the kit guide's sentence
  shipped.
- From this pass's first refutation: The order does not say what happens
  when the update's merge base cannot be read, as in a shallow or grafted
  clone: refuse before any push, naming the cause and the remedy, never
  proceed in silence, and add the case.

**Non-goals:** changing the starter refresh; resolving a merge for the
session; restoring a file automatically; a sub-root the words screen leaves
out; a sentence in every role's text; a refusal of a fetch; the route of a
released order.

**Operator-review assumptions:** that an instance wants an untouched seed
to follow the starter and a file it changed to stay its own, so the rule
turns on both sides having changed the path; that `--take` is the
operator's choice, made by naming the path; and that the fork's reports are
as written, since its checkout is read here only as evidence of what an
instance holds.
