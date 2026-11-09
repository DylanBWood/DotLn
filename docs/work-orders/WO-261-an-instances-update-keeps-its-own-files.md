# WO-261 — An instance's update keeps its own files: the update publish refusing a merge that rewrote a file the instance had changed, the words screen leaving out what a session wrote, a tag fetch refused against a remote set to bring none, and a kit launch counted in every spelling

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. One refusal in `update --publish` with a
per-path admission; one section in the update preview; a session sub-root
the words screen leaves out and one sentence in every role's text; one
command refusal in the hook; the launch recognizer reading a flag after the
script name. Assigned at
activation under the standing opt-out default.
**Cost:** adds, in `scripts/launchpad.mjs` (`publishUpdate`'s `ready` and
the preview), the reading of files both sides of an update merge changed,
recurring work in each update publish and preview (four Git reads of two
trees' differences; unmeasured, and measured by this order on the update
fixture); in `scripts/lib/verbatim-screen.mjs` (`capturePaths`), one
directory left out and counted; in
`packages/skeleton/src/loadouts/contributor.ts`, one sentence in every role,
measured against the cold-start ceilings under the standing route; in
`packages/skeleton/src/harness-host.ts`, the tag-fetch refusal, recurring
work in the hook for a Bash command that begins a `git fetch` (one
`git config --get`; unmeasured, measured by this order from the hook's
timing rows before and after) and the launch recognizer's flag position;
cases in the suites the Preflight names; the kit guide, product 07 and the
decisions. Removes these states: an instance's closed order and budgets
rewritten by an update merge with no notice; three seed conflicts resolved
by reading alone; a document gate failing on a session's own drafts; a
remote's tags fetched against its own setting three times in four days and
deleted by hand each time; a worker launch that the cap never counted. Tokens and
wall-clock: unknown until this order's handoff records them. Re-mints: the
role oracle edition, deterministically (`contributor.ts` is a registered
evidence source), and the editions `packages/skeleton/src/harness-host.ts`
stales, deterministically; no file in `FEEDBACK_SOURCE_PATHS` changes, so no
live feedback episode is owed. Steps: the executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-08 (ignored
capture SHA-256
`a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`): item 4
(other fixes and efficiencies before the work laptop's test cycles) and the
DotLn-Enterprise-Starter fork's block after starter v0.122.0, items 2, 5
and 8; [WO-258-D035](../evidence/WO-258/decisions.md#wo-258-d035)
(FUP-973464a1fa408976), allocated by this order's pass.
**Depends on:** WO-258 (closed, v0.121.0: the starter refresh whose seed
changes an instance's merge meets); WO-259 (closed, v0.122.0: the words
screen this order narrows); WO-244 (active: it edits
`packages/skeleton/src/harness-host.ts` and
`packages/skeleton/src/loadouts/contributor.ts`, which this order edits
after its merge).
**Recommended placement:** third, after WO-260 and the active WO-244: each
item is met at an instance's update or planning pass, which is what the
operator's clean test instances run next, and none stops a session today
(each has the route its reporter used).
**Cites (read these sections):** `scripts/launchpad.mjs` (`publishUpdate`,
`kitProvenance`, the preview); `scripts/lib/starter-refresh.mjs` (the seed
rules, read only); `scripts/lib/verbatim-screen.mjs` (`capturePaths`,
`verbatimScreen`); `scripts/docs-check.mjs` (the screen's status line);
`packages/skeleton/src/harness-host.ts` (`registeredTargetNearMiss`,
`protocolRefusal`, `kitWorkerLaunch`); the kit guide §Taking upstream updates,
§Opting in to instance actions, §Hooks and §Document quality; product 07
§Operator-opened planning pass.

**Objective:** An update never changes a file its instance had changed
without the session and the operator seeing which, the words screen
compares a branch only with what the operator wrote, a fetch that would
bring a remote's tags against that remote's own setting does not run, and
every spelling of a kit worker launch counts against the cap.

**Observed gap (dated 2026-11-08 at `main` `13e8d47eb`, v0.122.0):**

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
  meets the same merge at its next update.
- The screen's capture set. `capturePaths` walks every non-binary file
  under the intake root. The fork's first gate run on a planning document
  failed seventeen lines, every one against a file its own sessions had
  written there (a pull request body, a register batch, a refutation prompt
  and result, review logs) or against prose a session had put above the
  message in a capture. This repository's intake holds 439 files under
  `notes/`, 43 under `remining/` and 16 under two release-close directories
  beside its captures. Nothing in the kit says where a session keeps its
  own drafts, and the role text says only that the operator's words stay
  in ignored intake.
- The tag fetch. The kit guide tells an instance to set
  `remote.upstream.tagOpt --no-tags` and says an explicit `--tags`
  overrides it. The fork's planner ran that explicit fetch on 2026-11-05,
  2026-11-06 and 2026-11-08 and deleted the starter's tags by hand each
  time. The hook classifies no `git fetch`.
- The launch count. `kitWorkerLaunch` does not recognize `npm run worker
  --silent -- review`; WO-258's executor session ran ten workers and the
  hook counted seven (WO-258-D035).

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
  leaves a seed alone unless the starter still holds the export's own bytes (the axis is
  where the collision is: the starter's history still changes the path,
  and the instance's merge is what meets it).
- Judged at the merge commit, by the incoming launchpad, so the first
  update that brings this order is already protected, and later commits on
  the branch (the re-emit, the lineage index, the features page) are not
  mistaken for the merge. `--take <path>` admits one named path whose
  starter bytes the operator wants; the publish prints each taken path.
- One sub-root, `docs/intake/session/`, holds what a session writes for
  itself when it keeps it under intake; the screen leaves it out and says
  how many files it left out. A capture is the operator's message and
  nothing else. Rejected: a marker line in each session-written file (the
  axis is the file kinds: a JSON batch and a log cannot carry one, and
  every existing file would need editing). Rejected: an ignored list of
  session-written paths (the axis is drift: a second record to keep in
  step with the files). Rejected: screening only named capture sub-roots
  (the axis is failing closed: a capture written in the wrong place would
  stop being screened).
- The tag fetch is refused before it runs, with the two right fetches in
  the reason. Rejected: an advisory (the axis is effect: an advisory
  reaches the session with the command's result, after the tags are in the
  instance, which is the state the fork cleaned up three times). The
  operator's own terminal and `operator override:` still run it.

**Execution plan (the executor follows these steps in order; observed at `13e8d47eb`, 2026-11-08):**

1. `scripts/launchpad.mjs`: beside `kitProvenance`, a function that takes
   a merge commit and returns the paths, outside the incoming
   `KIT-MANIFEST.json`'s list, that differ between the merge base and each
   parent (or that both parents added with different bytes) and whose bytes
   in the merge commit differ from the first parent's. `publishUpdate`'s
   `ready` calls it for each merge commit on the branch since `main` and
   refuses, naming each path, the command that restores it from the first
   parent and `--take <path>`; `update --publish` accepts `--take` and
   prints each taken path. Every Git form it uses exists in Git 2.31.0
   (WO-260's recorded surface gains its pairs). Record the reading's time
   on the update fixture. Check: `npm test -- --only launchpad`.
2. `scripts/launchpad.mjs` (the `preview --from <revision>` output): a
   section listing the files both this instance and the starter changed
   since their merge base, outside the incoming manifest, under a line
   that says to keep the instance's bytes when merging. Check: `npm test
   -- --only launchpad`.
3. `scripts/lib/verbatim-screen.mjs` (`capturePaths`) and
   `scripts/docs-check.mjs` (the status line): leave out
   `docs/intake/session/` under the configured intake root, count the files
   left out, and print that count in the screen's status line. Check:
   `npm test -- --only docs-check-fixtures`.
4. `packages/skeleton/src/loadouts/contributor.ts` (every role): one
   sentence saying that a capture holds the operator's message alone and
   that what a session writes for itself (drafts, prompts, results, logs)
   goes under `docs/control/local/` or `docs/intake/session/`. Measure the
   role roots against their ceilings under the standing route. Check:
   `npm test -- --only process-debt` and `npm test -- --only compiler`.
5. `packages/skeleton/src/harness-host.ts`: for a Bash command whose Git
   subcommand is `fetch` with `--tags` or `-t` and a named remote, read
   `remote.<name>.tagOpt` in the command's repository and, when it is
   `--no-tags`, refuse through `protocolRefusal` with the remote, the
   setting and the two fetches the kit guide gives (the plain fetch and the
   one that brings a named tag into a non-tag ref); journal it as a
   near-miss. A fetch without the flag, a fetch against a remote without
   the setting and any command under `operator override:` are untouched.
   Register the refusal where the hook's refusals are registered, so the
   generated instruction text and the manifest state it. Record the hook's
   timing rows before and after. Check: `npm test -- --only
   harness-fixtures`.
6. `packages/skeleton/src/harness-host.ts` (`kitWorkerLaunch`, with
   `npmScriptArgs`): count a kit launch whose npm flag follows the script
   name as the plain spelling is counted, with a case per spelling. If
   WO-244's merge already made this change, record that and add only the
   missing cases. Check: `npm test -- --only harness-fixtures`.
7. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §Taking upstream updates (the merge
   keeps the instance's bytes for a file both sides changed, the refusal,
   `--take` and the preview's section; a closed order's text is restored,
   never merged), §Opting in to instance actions (which update route its
   first sentence describes), §Hooks (the tag-fetch refusal) and §Document
   quality (the session sub-root and what a capture holds); product 07
   §Operator-opened planning pass (the capture is the message alone); the
   generated instruction
   text and manifest by `node scripts/harness.mjs emit`;
   `docs/evidence/WO-261/decisions.md`. Then the handoff sequence of
   product 07 §Discipline, with the review ladder's findings judged as
   §Verification review and attack states.

**Deliverables:** the both-sides reading with the publish refusal, `--take`
and the preview's section; the session sub-root left out and counted; the
role sentence; the tag-fetch refusal; the launch recognizer's cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. In the update fixture, with a seeded order and `docs/control/budgets.json`
   changed by both the instance and the incoming revision since their merge
   base and a merge commit that carries Git's merged bytes for both,
   `node scripts/launchpad.mjs update --publish --title <title> --body-file
   <path>` refuses before any push, naming both paths, the restore command
   and `--take`. After the merge commit holds the instance's bytes for both
   paths, the same command proceeds. With `--take` naming one of the two
   and the other restored, it proceeds and prints the taken path. A file
   only the incoming revision changed, a file it added and a kit file the
   incoming manifest lists are never named.
2. In the same fixture, `node <incoming>/scripts/launchpad.mjs preview
   --from <revision>` lists both paths in the section step 2 adds and lists
   neither of the files criterion 1 says are never named.
3. In the document fixture, a file under `docs/intake/session/` that
   shares a run of the window's length with a line the branch adds yields
   no finding, and the status line of `node scripts/docs-check.mjs` names
   one file left out; the same file moved beside the captures yields the
   finding.
4. Every installed role root under `.claude/skills/` and `.agents/skills/`
   carries step 4's sentence, and `npm run meta -- --check` reports no
   ceiling breach without a recorded acceptance.
5. In a fixture clone whose `remote.upstream.tagOpt` is `--no-tags`, the
   hook denies `git fetch upstream --tags` and `git fetch -t upstream` with
   a reason naming `upstream`, the setting and both right fetches, and the
   session journal holds a near-miss row for each. It leaves to host
   permissions `git fetch upstream`, `git fetch --no-tags upstream
   refs/tags/v1:refs/upstream-releases/v1` and `git fetch origin --tags`
   where `origin` has no such setting, and it leaves the first command to
   host permissions under `operator override:`.
6. The hook counts one use for each of `npm run worker -- review`,
   `npm run --silent worker -- review`, `npm run worker --silent -- review`
   and `node scripts/worker.mjs review`.
7. The kit guide and product 07 state steps 1 to 5 in the sections step 7
   names, each linking this order's decisions; `node scripts/harness.mjs
   check` passes with the refusal in the generated text. Check:
   `npm run test:docs`.
8. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only launchpad` for steps 1 and 2;
`npm test -- --only docs-check-fixtures` for step 3; `npm test -- --only
process-debt` and `npm test -- --only compiler` for step 4; `npm test --
--only harness-fixtures` for steps 5 and 6; the structural phase; the complete
run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-261/`: criterion 1's three
publish outputs and criterion 2's preview; the screen's two status lines;
the hook's five decisions of criterion 5 with their journal rows' kinds;
the reading's time on the update fixture
and the hook's timing rows; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 7 and criterion 7; sources and
reopening conditions in `docs/evidence/WO-261/decisions.md`.

**Known issues and carry-ins:**

- FUP-973464a1fa408976 (WO-258-D035): the launch recognizer, step 6.
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
- FUP-7de23c426e329c34 (WO-258-D014, the older rendering of a starter's
  documentation index) stays deferred: this order does not edit the starter
  refresh's seed rules.

**Non-goals:** changing the starter refresh; resolving a merge for the
session; restoring a file automatically; a marker in capture files; moving
an instance's existing intake files; an advisory in place of the fetch
refusal; the route of a released order (the fork's observation, which this
order's pass declined with its reopening observation).

**Operator-review assumptions:** that an instance wants an untouched seed
to follow the starter and a file it changed to stay its own, so the rule
turns on both sides having changed the path; that `--take` is the
operator's choice, made by naming the path; that refusing an explicit tag
fetch against a remote set to bring none is wanted in every instance, the
operator's own terminal remaining the route for a deliberate one; that the
fork's reports are as written, since its checkout is read here only as
evidence of what an instance holds.
