# WO-281: the reader's record

Step 6 of the order's execution plan, recorded on 2026-11-15 for the
operator's review. One fresh worker, given none of this session's
conversation and nothing about the order, answered the ten tasks of
[tasks.md](tasks.md) twice: from the kit guide as the base holds it and from
the guide as the candidate held it. Its report follows this page's first
section whole, as it returned it.

A second fresh worker read the candidate again on 2026-11-16, alone and as
it stood after both rounds of review, because the text the first reader
answered from was changed before a copy of it was kept
([D024](decisions.md#wo-281-d024--the-third-meta-critics-three-points-each-checked-and-accepted-a-planned-fix-recorded-as-made-the-cost-of-the-serial-suites-weighed-too-late-and-a-readers-text-changed-before-a-copy-of-it-was-kept)).
Its report is this page's last part, under
[The second reading](#the-second-reading).

## What was read, and how

- **The reader.** One `dotln-worker`, the instance's `default` worker for
  Claude, launched by this session at 21:37:37 UTC; its transcript names
  `claude-opus-5-5`. It returned at 21:47:28 UTC. The host's notice counted
  58 tool uses; its transcript holds 65 calls, 16 of whose results carry a
  refusal by the harness.
- **Text A, the base.** `docs/KIT.md` at `5edc7798b`, 2,765 lines.
- **Text B, the candidate.** `docs/KIT.md` in the working tree, 4,247 lines,
  SHA-256 `0ebb0b6a6a8022603d45c4fd578eed1df095c3a511b1298dbd0e566061ae38b3`.
  The reader could not compute the hash: this session's focused suites were
  running, and the harness admits only reads from a worktree while a gate
  runs there. The executor's inventory had read that hash at 21:33 UTC, no
  write to the file was possible from 21:36 UTC until the suites were
  stopped at 21:59 UTC, and the hash read then was the same.
- **The brief.** The two texts, the tasks file's two sections, the order of
  reading (Text A first for odd-numbered tasks, Text B first for even), what
  to record for each answer and the form of the report. It was told to use
  the guide's text alone, and not `docs/OPERATOR.md`, other documents, code
  or what it knew.
- **How it read, by its transcript.** Not a task at a time. It read both
  texts in long runs before it wrote: the base's lines 1 to 595, the
  candidate, the base's 750 to 1210, the candidate again, then the base's
  1210 to 2765. It kept the brief's order when locating and writing each
  answer, by its own note. So no task was answered from one text before the
  other had been seen, and the comparison is that of a reader who knew both
  ([D016](decisions.md#wo-281-d016--correction-three-records-stated-more-than-their-evidence-held-how-the-reader-read-how-many-order-files-the-lists-figure-covers-and-what-the-critic-ran-on)).
- **Limits the reader names.** Knowing one text helped it read the other; it
  gives effort as the number of places read and no minutes; and it read the
  raw Markdown, where the comments above the marked command blocks are
  visible.
- **What the gates cost it.** The brief asked it to save a copy of the base
  and to hash the candidate, which a worktree under a gate refuses; it tried
  the hash seven times and waited on the gate three times before going on
  without it.

## What the executor changed after it

The candidate has changed since the reader read it. Each change answers a
line of the report and is in the guide the review ladder reads:

- A subsection of First steps, Run and close an order, with the start, the
  three phrases, the repair phrase, the drive, the merge and the close as
  numbered steps in the page's visible text; the table at the guide's head
  and the section's list name it. The report found that neither named
  running an order, and that fresh sessions, `resume: fix`, `drive:` and the
  close's effects were written only in comments a rendered page hides.
- Under Take a starter update, the commands that keep this instance's bytes
  for a file both sides changed, which were in a comment alone.
- Under Run the first pass, the session's steps through the costs, the
  refutation, the checks and the publish, and that the operator merges the
  pass's pull request with a merge commit.
- The sentence on a release close's `--publish` command, moved from core's
  update of the starter to the steps of a close.
- A sentence at the guide's head on the comments above marked blocks, whose
  step numbers are those of `docs/OPERATOR.md`.
- A link from a review launch's `--model` option to where a worker's model
  is set, and two words: a context entry is stopped on, where the candidate
  said held.

Left as the report found them, because the base does not state them and
this order adds no fact to the guide: a remedy for each class of a stopped
close, the retry command's exact text, whether an entry of the terms list
is matched without regard to case, an example of a registration, and what
the body of an update's pull request holds.

---

*Method notes.* **Hash: not checked.** The harness refused `shasum` because the parent's gate runs were live: one wait cleared a run, then another run held the worktree, and each later attempt met a new run. `wc -l` reads 4,247 lines for Text B, which matches the stated count, but I could not compute the SHA-256. So I cannot say whether it matched. **Text A was not saved to scratch.** Writes there were refused for the same reason. I read Text A as `git --no-pager show 5edc7798b:docs/KIT.md | sed -n` instead, and it reads 2,765 lines. **Reading order.** I listed both texts' headings first and read the relevant regions of each before writing. I kept the odd/even order when locating and writing each answer, but knowing one text helped me read the other, so the second text read for each task had an advantage. **Time.** I did not time each task, so effort is given as the number of places read. **Raw file.** I read the raw Markdown. Several answers depend on `<!-- operator-commands … -->` HTML comments, which a rendered view hides. Each answer says where that applies.

# Answers from Text A

## 1. From the starter's URL and an empty private repository to a working instance
1. **Answer.**
   1. Skip `gh repo create`: the repository exists. Then run `git clone --no-tags <starter url> <name>` and `cd <name>`.
   2. Run `node scripts/doctor.mjs`. You should see one row for each thing the kit needs of the host: what it observed, met or not, what depends on it and the remedy. It refuses nothing. For any `unmet` row, apply the remedy and run it again (this advice is in the hidden comment). The kit needs:
      - Node 24.15+ or 26, and Git 2.31.0+;
      - a C compiler;
      - `gh` signed in;
      - merge commits allowed in the repository.
   3. Point the remotes at the right places:
      - `git remote rename origin upstream`
      - `git config remote.upstream.tagOpt --no-tags`
      - `git remote add origin <private url>`
      - `git push -u origin main`
   4. Run `node scripts/bootstrap.mjs`. It does setup steps 2 and 3: `npm ci`, then the emit.
   5. Run `node scripts/harness.mjs check`. It should pass and report `local-terms list: unavailable`.
   6. Register the terms list:
      - `mkdir -p docs/control/local`
      - `cp scripts/kit/terms.example.txt docs/control/local/terms.txt`
      - Replace the example's entries with your own.
      - Run `npm run terms -- check CLAUDE.md README.md`. You should see `local-terms list: present` with the entries in each class, 2 files screened and the lines found, and no `FAIL` line.
   7. Optionally copy `dotln.config.example.json` to `dotln.config.json`. This is needed only to elect a feature or move a document root.
   8. Tell the session in `main` to start WO-001 in its own worktree. It runs `npm run worktree -- start WO-001 docs/work-orders/WO-001-environment-truth.md` and creates a sibling worktree on `wo-001`. The hidden comment says to look for `Carried the local-terms list into`.
   9. Open a session in `wo-001`. That session:
      - runs `npm run resume -- status`;
      - runs `npm run meta`;
      - enters `resume: next`.
   Until bootstrap has run, each hook reports `snapshot-missing`.
2. **Sections.**
   - First steps (91–593): doctor paragraph 93–123, recipe 160–189 (comment 163), steps 207–534.
   - Inside step 4: registration block 277–282 and the status line 285–290.
   - Step 5 at 468, step 6 at 498, step 7 at 509.
3. **How found.** The heading list (First steps has no subsections), then reading through. 4 places.
4. **Unsure or not found.**
   - It does not say whether the existing empty repository must be truly empty for `git push -u` to work.
   - It does not say who types step 7's commands, the operator or the session ("It runs …").
   - It does not say where "working" ends: after `harness check`, or after WO-001.
5. **Slowed or misled.**
   - Step 4 runs 235 lines (232–467). It moves on to target registration, publish checks, records, `hostRules` and disposable globs, so steps 5–7 are buried behind it.
   - The host-access paragraph (191–205) sits between the recipe and the steps.
   - The hidden comment points to "step 1" and other step numbers that do not match the guide's own numbering.

## 2. Names kept out of every commit, one of them also an ordinary word
1. **Answer.**
   - **Where the list goes:** `docs/control/local/terms.txt`, one entry a line. Git ignores the directory. Copy the list from `scripts/kit/terms.example.txt`.
   - **A name that must never appear:** put it under a line holding only `refuse:`, or write `refuse: <entry>` on its own line.
   - **The ordinary word:** put it under `context:`. An unmarked line outside every section is also context, and `review:` reads as `context:`.
   - **Other rules:**
     - An entry listed in both classes refuses.
     - `#` begins a comment, at a line's start or after a space.
     - A marked line with no letter or digit after its marker makes the list refuse, naming that line.
   - **How an entry is matched:** as a writer spells it. Its letters and digits are joined across spaces, line breaks, hyphens, dashes, periods, underscores, apostrophes, slashes and Markdown marks, but never across braces, brackets, pipes, backslashes, quotation marks or operators.
   - **A line a branch adds that holds a `refuse` entry:**
     - `node scripts/terms.mjs branch` and the `terms` task of `npm run test:docs` print `FAIL <file>:<line>: a local term in refuse mode` on stderr, never the term, and exit nonzero.
     - The gate stays stopped until the line changes, "hyphen or no hyphen".
     - The publish helpers for a planning branch, a kit update and an order branch refuse before any push.
   - **A line holding a `context` entry:**
     - The screen prints `CONTEXT <file>:<line>: a local term in context mode` and passes.
     - The stage at hand reads each listed line: the executor before its handoff, the verifier, the final reviewer, and a planning pass before its publish. It leaves the ordinary use alone, rewords a line that names the product, and states how many lines it read.
     - Publish helpers print the line and proceed.
     - A target order's publish lists context terms and refuses until `--confirm-terms`.
2. **Sections.**
   - First steps, step 4: 232–254 (classes and syntax), 256–271 (example), 292–322 (worked example), 325–350 (absent list and where it is applied), 395–402 (target publish).
   - Document quality, the `terms` task (2718–2734).
3. **How found.** Searched for `terms.txt` and `refuse:`, then read through step 4. 3 places.
4. **Unsure or not found.**
   - Case-sensitivity is not stated. The example matches "harbor" against `Harbor`, so I infer it ignores case.
   - It does not say what happens to commit messages.
5. **Slowed or misled.**
   - The syntax rules are one 23-line paragraph.
   - "A `context` entry never refuses" (about 240) is unqualified. It is later contradicted at 400–402, where a target publish refuses until confirmed.

## 3. The first planning pass
1. **Answer.**
   1. Commit the export and install dependencies. Register the terms list: without it the publish refuses.
   2. In a Claude Code session on clean `main`, type `planning: first pass` as a message of its own.
   3. The session runs `npm run plan -- start first-pass`. This creates the planning branch, reads the follow-up feed and writes the planning document with its standard headings. Its `Rules recorded` block starts empty.
   4. It drafts the instance's orders and sequence, records a dated pass in `docs/lineage/idea-ledger.md`, and reads and appends to `FOR-CORE.md`.
   5. It records costs with `npm run meta -- --plan-cost`, commits the subject and the cost table, and has one background worker refute them.
   6. It files the judgment with `npm run plan -- receipt …` and checks it with `npm run plan -- check`.
   7. Before handing off it runs `node scripts/docs-check.mjs`, `npm run publication:check`, `npm run reader -- check` and `npm run test:docs`.
   8. It ends with `node scripts/refute-plan.mjs publish --title … --body-file …` (or `npm run plan -- publish`). This lints the title and body, pushes `planning/<date>-<slug>`, opens a ready pull request against `main` and prints its URL.
   9. You merge it with a merge commit. This is said only in the hidden comment.
   - **What it produces:** the planning branch, the planning document, the orders, the sequence, a ledger entry, a cost table, a refutation receipt and a pull request.
2. **Sections.** Planning in this instance (750–1052):
   - opening paragraph 752–768;
   - comment and phrase 770–773;
   - `FOR-CORE.md` 876–895;
   - command bullets 905–978, with the hand-off checks at 946–948 and the publish at 954–978.
3. **How found.** Heading list, then reading through. 3 places.
4. **Unsure or not found.**
   - Whether WO-001 should run first is said only in the comment ("can run before this pass").
   - The merge method for the pull request is stated only in the hidden comment.
   - Who writes the title and body is not stated.
5. **Slowed or misled.**
   - Six paragraphs on other topics (unactivated orders, captures, initiatives, pacing, updates, `FOR-CORE.md`) sit between the start and the commands.
   - The hand-off checks hide inside the work-order index bullet, after a CommonMark digression.
   - The comment's "(step 3)", "(step 5)" and "step 1" do not resolve in this guide.

## 4. Running a filed order from start to release
1. **Answer.**
   1. From clean `main`, run `npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-<slug>.md`. It makes the sibling folder `<name>-woNNN` and prepares it.
   2. In a Claude Code session there, type `resume: next`.
   3. Once that finishes, type `resume: verify` in a fresh session.
   4. Then type `resume: final review` in a fresh session. It reviews and opens the pull request. The seeded WO-001 is `v0.1.0`, and `npm run release -- prepare --local` assigns later versions.
   5. If a verification or final review fails, type `resume: fix`, then verify and final review again.
   6. Or type `drive: WO-NNN` in `main`, which runs the phases and stops for your merge.
   7. `resume: status` tells you where the order stands at any time.
   8. **The merge:** merge the instance's pull request with a merge commit, never squash or rebase, because release close needs the branch in `origin/main`'s history. A target's pull request merges by its team's method.
   9. In a session on `main`, type `resume: release close`. It updates `main`, publishes the tag and the Release, and removes the worktree and the branch.
   Steps 3–6 and the close's effects are said only in the hidden comments.
2. **Sections.**
   - First steps: step 7's merge paragraph (530–534), run-order comment and blocks (536–546), close comment and block (548–551).
   - Releases in this instance (1117–1151).
3. **How found.** Searched for `resume: verify`. 2 places.
4. **Unsure or not found.** It does not say who runs release preparation, or when a target order's publish happens in this sequence.
5. **Slowed or misled.**
   - No visible text introduces the run-order blocks. They follow step 7 bare.
   - The merge rule lives inside the WO-001 step.

## 5. Taking a newer starter release, and a file both sides changed
1. **Answer.**
   1. Read the release's "Read before upgrading" (said in the hidden comment). Take the update on your own word: tell a plain session in `main`, or type the lines yourself. Under a `planning:` dispatch it refuses unless `--operator-request …` is recorded or `features.auto-update-upstream` is elected.
   2. Preview it. Nothing changes:
      - `git config remote.upstream.tagOpt --no-tags`
      - `git fetch --no-tags upstream`
      - `git worktree add --detach .runtime/upstream-preview upstream/main`
      - `node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main`
      - `git worktree remove .runtime/upstream-preview`
      For a named release, fetch its tag into `refs/upstream-releases/vX` instead.
   3. Read the preview:
      - floor lines for Node and Git;
      - `both changed: <path>` rows, or `instance files both sides changed: none`;
      - the kit rows (`replace`, `add`, `remove`, `unchanged`, `refused`, `re-emitted`) and the declared actions.
   4. From clean `main`, run `git switch -c chore/starter-update` and `git merge upstream/main`.
   5. For each `both changed:` file, run `git checkout main -- <path>`. If Git does not know the path, run `git rm <path>`. If the merge stops on `.claude/harness-manifest.json`, run `git checkout main -- .claude/harness-manifest.json`. This step is in the hidden comment only.
   6. Regenerate and commit: `node scripts/harness.mjs emit`, `node scripts/lineage.mjs index`, `npm run sync`, `git add -A`, `git commit -m "Take the starter update"`.
   7. Publish: `node scripts/launchpad.mjs update --publish --from upstream/main --title "<title>" --body-file <path>`. It refuses until the update is whole, then pushes, opens the pull request and prints its URL.
   8. Merge the pull request with a merge commit.
   9. Run `git switch main` and `node scripts/launchpad.mjs update --finish`. It fast-forwards and runs bootstrap. Past its time bound it prints the lines to finish by hand.
   - **A file both sides changed:**
     - Keep this instance's bytes.
     - If the tip does not hold them, the publish refuses, naming `git checkout <commit> -- <path>` or `--take <path>` (printed as `taken: <path>`).
     - Special cases: `main` merged into the branch afterwards; both sides changed since; an earlier squash-merged update.
2. **Sections.** Taking upstream updates (2031–2375):
   - instance procedure 2156–2173;
   - preview block 2175–2182;
   - preview rows 2184–2206 and 2226–2250;
   - named release 2208–2224;
   - steps in prose 2252–2289;
   - both-changed rule 2291–2311;
   - merge and finish 2313–2329;
   - blocks 2331–2346.
   - Also the v1.0.0 notes (2110–2154).
3. **How found.** The heading, then reading through. 6 passages.
4. **Unsure or not found.**
   - What the body file should hold is not stated.
   - What to do with a `refused` kit file in an instance: the "resolve by hand" advice is in core's own update passage.
5. **Slowed or misled.**
   - The section opens with core's own update of the starter (2047–2108), which an instance must not run.
   - The second and third command blocks come about 150 lines after the preview block, after the prose.
   - The per-file checkout instruction is hidden.

## 6. Registering a team's repository with no record committed there
1. **Answer.**
   1. A planning pass files a registration order from the values you state (only the hidden comment says to ask for one). It covers:
      - the entry under `repositories` in `dotln.config.json`: a `gate` of named argv commands with timeouts and plain and review selections, an optional `documentationRoot`, and `"records": "instance"`;
      - the profile `docs/repositories/<id>.md`;
      - `docs/control/outward-vocabulary.json`, whose `reviewTerms` may be empty;
      - your grant in `packages/skeleton/loadouts/grants.json`.
   2. Its executor commits these files and records the clone with `npm run worktree -- clone <id> <absolute-path>`. The order's **Preflight:** line names only instance suites.
   3. Merge that order first, before any target order starts.
   4. `worktree start` for a later target order reads the registration from `main`.
   - With `instance`, the order, its decisions and its reports stay in the instance, and nothing is committed in the target.
   - The value is read from `main`.
   - An order whose records were already filed stays filed in the target.
2. **Sections.**
   - Step 4 (350–372, comment 391–394, records 412–428).
   - Step 5 (468–489).
   - Working as a team (1181–1187).
3. **How found.** Searched for `records` and "register". 3 places.
4. **Unsure or not found.**
   - There is no JSON example of a registration.
   - It does not say how the registration order gets filed; the visible text says only that "an instance order's executor commits both".
5. **Slowed or misled.** Registration is split across the terms-list step and the configuration step.

## 7. A reviewed target order's publish
1. **Answer.** Run from the launchpad root: `node scripts/worktree.mjs publish WO-NNN --target-worktree --branch <type>/<slug> --title <title> --body-file <committed-reviewed-body-path> [--confirm-terms sha256:<digest>]`.
   - **What it checks before it pushes:** the branch, the commits, the title and the composed body (the reviewed prose, the Change table and the target checks).
     - Launchpad identifiers (`WO-NNN`, `WO-NNN-DNNN`, `FUP-<16 hex>`, `VER-NNN`, `FINAL-NNN`, `REVIEW-NNN`, `WS-NNN`) refuse.
     - `refuse:` terms refuse.
     - Review words and context terms are listed, and the publish refuses until they are confirmed.
     - A refusal names the line, the part of the body and the added path. Private matches are redacted.
     - An absent terms list refuses.
     - With `records: target`, the records must be committed and filed (`npm run resume -- target-records`) first.
     - With `records: instance`, it publishes at the reviewed commit and refuses if the target's HEAD differs.
     - Only the node spelling is admitted.
   - **When it stops on a word:** read each listed line, then rerun with `--confirm-terms sha256:<digest>` using the printed digest. The confirmation is logged in the publication log and the session journal.
2. **Sections.**
   - Step 4: 395–428 (checks, session form, records) and 428–450 (the hook and `--draft`).
   - 325–329 (absent list).
3. **How found.** Searched for `confirm-terms`. 2 places.
4. **Unsure or not found.**
   - Who runs it: implied to be the reviewer.
   - Whether rewording a line changes the digest is not stated.
5. **Slowed or misled.** It is all one paragraph inside a setup step.

## 8. A release close that stopped, and a squashed, edited target merge
1. **Answer.**
   - **Find out why:**
     - The close names what it found (hidden comment).
     - It records `blocker: { class, step, message }`. The summary names the class, one of 11, at one of the 7 timed steps.
     - `plan failures` counts blockers.
     - The close receipt records candidates, removals, retentions and blockers.
   - **What it keeps:**
     - The same retry command.
     - The worktree, if the journal move failed (a cleanup blocker; the retry merges into `docs/control/local/retained/<WO>/harness/`).
     - A target's temporary-root ledger, written back if the removal stops.
     - Roots left aside as `dotln-removing-<token>`, finished by the next prune.
     - Inventory sidecars, kept for retries.
   - **Finish:**
     1. Mend what it named.
     2. Type `resume: release close` again in `main`. It never publishes a Release twice.
     The guide also says "a release close runs its printed `--publish` command once".
   - **A squash edited at the merge:** nothing matches, and the close refuses with the source kept, naming `--merged-as <commit>`. Rerun the printed close with the id of the target base commit that carries the change. It checks that the commit is in the fetched base, came after the branch, and touches a changed path, then prints the subject and proceeds. You take the judgment.
2. **Sections.**
   - Close comment (548).
   - Owned cleanup (2416–2513, as one paragraph).
   - Releases (1117–1151).
   - Taking upstream updates (2040–2045).
   - Hooks (1544–1553).
3. **How found.** Searched for "blocker", "squash" and "release close". 5 places.
4. **Unsure or not found.**
   - There is no remedy for each blocker class.
   - The exact retry command is not printed.
   - It does not say whether `--merged-as` goes with the phrase or with a script.
5. **Slowed or misled.**
   - The blocker text is in the middle of a roughly 110-line paragraph.
   - The `--publish` hint sits under the updates section.

## 9. Running a script of mine after every edit
1. **Answer.**
   1. Put the script under `extensions/`, for example `extensions/hooks/after-edit.mjs`. The kit never touches that root.
   2. Register it in the committed `.claude/settings.instance.json` under `hooks.PostToolUse`:
      - `matcher` set to `"Edit|Write"`;
      - a hook with `type: "command"`;
      - `command` set to `node "${DOTLN_LAUNCHPAD:-$CLAUDE_PROJECT_DIR}/extensions/hooks/after-edit.mjs"`;
      - `timeout` set to 30.
   3. Run `node scripts/harness.mjs emit`, which merges the fragment, then `check`.
   4. For a target worktree already standing, also run `emit --target <worktree>`.
   - Never edit `.claude/settings.json`.
   - **Events allowed:** `PermissionDenied`, `PostToolUse`, `PostToolUseFailure`, `SessionStart`, `Stop`.
   - **Events not allowed:** `PreToolUse`, because a rewritten call bypasses the guards; `SubagentStop`, because it would override the kit's refusal of a worker's stop; `UserPromptSubmit`, because it can block prompts, `analysis:` included.
   - **When the kit updates:** an update plans the merged settings as this instance's own emit, `launchpad.mjs verify` counts them as written by it, and the update branch's emit merges the fragment again. The merge only adds.
   - You own the hook's tests.
2. **Sections.**
   - Extending this instance (1904–1985).
   - Hooks, "Your own hooks" (1612–1618).
   - Kit files (1683–1687).
3. **How found.** The heading. 2 places.
4. **Unsure or not found.** Whether the fragment is a kit file or an instance file: it is not in the instance list, and the kit list names the bundle under `.claude/`.
5. **Slowed or misled.** The update sentence is in the middle of a bold-led paragraph.

## 10. Reviews on a model other than the kit's
1. **Answer.**
   1. Choose how reviews get the model. `npm run worker -- review` without `--model` runs the `default` worker. Either:
      - rebind `default` in the `workers` section of `dotln.config.json`, for example `"default": {"claude": "<model>", "codex": "<model>"}` (this also changes every driven phase); or
      - define your own worker, for example `night-review` with a model and an effort, and launch with `--model night-review` or close a dispatch line with it.
   2. A model that is not among the six kit models goes as a row in `dotln.models.json`: `schemaVersion: 1`, and `models.<name>` with `provider`, `id`, `effort` and `family`. A row with a kit model's name replaces that row.
   3. Edit on `main` or in an order's worktree, never on a planning branch.
   4. Afterwards run `node scripts/harness.mjs emit` (which rewrites `.claude/agents/`) and `check`.
   5. To see what a launch will use:
      - `npm run worker -- list` shows the table and where each value was written;
      - `npm run worker -- show <name>` shows how this session launches it, and marks a Claude session launch as not exact;
      - `npm run worker -- review … --dry-run` prints the command line and the brief.
2. **Sections.**
   - What runs here (1224–1245).
   - Kit files and instance files (1722–1817).
3. **How found.** Searched for "model". 2 places.
4. **Unsure or not found.** There is no `review` worker. Whether the executor's own review ladder honours a worker named on the dispatch line is not stated.
5. **Slowed or misled.** There are no headings. The content is a bold-led run of about 95 lines.

# Answers from Text B

## 1. From the starter's URL and an empty private repository to a working instance
1. **Answer.** The same steps and outcomes as Text A §1: clone, `doctor`, remotes, push, `bootstrap`, `harness check` reporting `local-terms list: unavailable`, the terms list giving `present` with counts, optional configuration, WO-001's start, and the `wo-001` session with `resume: next`. Text B lists the needs one bullet each: Node, Git, a C compiler, `gh`, merge commits and the platform.
2. **Sections.**
   - What the host needs (72–174).
   - Start a private repository (176–211; comment 182, block 183–194).
   - The setup, step by step (213–306).
   - Register the list (385–426).
   - When the list is empty or absent (465–472).
3. **How found.** The top table (row 16), then the "In this section" list. 4 places, close together.
4. **Unsure or not found.** The same as A: whether the repository must be empty, who types step 7's commands, and where "working" ends.
5. **Slowed or misled.**
   - The hidden comment's step numbers do not match.
   - Step 4 is now three lines that link to the terms subsection, so steps 5–7 follow at once.

## 2. Names kept out of every commit
1. **Answer.** The same as Text A §2, with one addition. Two routes into a registered target hold a context entry:
   - a target order's publish lists the match and waits for `--confirm-terms`;
   - `npm run plan -- target-publish` refuses the match with no confirmation, so the line must be reworded.
2. **Sections.** The local-terms list (334–493):
   - two classes 340–355;
   - written 357–370;
   - matched 372–383;
   - register 385–426;
   - worked example 428–463;
   - empty or absent 465–472;
   - where applied 474–493.
   - Also Publish a pass into a target (1638–1639).
3. **How found.** The table row, then the section list. 1 subsection, which links to the other 2.
4. **Unsure or not found.** Case-sensitivity is still unstated.
5. **Slowed or misled.** "Two routes … hold it": the reader has to work out that "hold" means "stop".

## 3. The first planning pass
1. **Answer.** The same as Text A §3. Text B gives the session's first four actions as a numbered list.
2. **Sections.**
   - Run the first pass (1127–1145).
   - The commands a pass runs (1370–1440; checks block 1424–1430).
   - Publish the pass (1469–1510).
   - What core should hear (1329–1368).
3. **How found.** The table row, then the section list. 3 places.
4. **Unsure or not found.** The merge method for the pass's pull request is still only in the hidden comment.
5. **Slowed or misled.**
   - The comment's step numbers do not match.
   - Refutation, receipt and cost appear as unordered bullet groups rather than continuing the numbered steps.

## 4. Running a filed order from start to release
1. **Answer.** The same as Text A §4.
2. **Sections.**
   - The setup, step by step (308–332).
   - How an order's pull requests merge (1761–1815).
   - Versions (1729–1744).
   - Working as a team (1824–1863).
3. **How found.** The table pointed to Releases for the merge. The commands themselves were found by searching for `resume: verify`. 2–3 places.
4. **Unsure or not found.**
   - Fresh sessions, `resume: fix`, `drive:` and the close's effects are still only in hidden comments.
   - Who runs release preparation is not stated.
5. **Slowed or misled.** Neither the table nor the First steps section list names "run an order". The commands are the tail of the setup subsection, though a visible sentence (308–309) now introduces them.

## 5. Taking a newer starter release
1. **Answer.** The same as Text A §5. Text B gives five numbered steps (preview; read; branch, merge, keep, regenerate, publish; merge; finish), with each command block placed inside its step.
2. **Sections.**
   - Take a starter update (3089–3222).
   - What the preview shows (3224–3294).
   - What the update's publish checks (3296–3333).
   - A file both sides changed (3335–3372).
   - Preview a named starter release (3374–3386).
   - An instance older than v1.0.0 (3388–3450).
3. **How found.** The table row ("Take a newer release"), then the section list. 3 adjacent subsections.
4. **Unsure or not found.**
   - The body file's content is not stated.
   - `git checkout main -- <path>` and `git rm` are still only in the hidden comment. The visible step 3.3 says "keeps this instance's bytes".
5. **Slowed or misled.** Little. Core's own update now comes last and is labelled "Read this in core".

## 6. Registering a team's repository with no record committed there
1. **Answer.** The same as Text A §6.
2. **Sections.**
   - Register another repository (551–621).
   - The configuration file (510–534; the `records` table 520–523).
   - Working as a team (1837–1844).
   - Where the order's records go (663–689).
3. **How found.** The table row, then the section list. 3 places.
4. **Unsure or not found.** There is still no JSON example. The profile's form is only linked (repositories/README.md).
5. **Slowed or misled.** None of note. The opening (553–556) says outright that a planning pass files the registration order.

## 7. A reviewed target order's publish
1. **Answer.** The same as Text A §7. Text B also says plainly that the reviewer's session runs the publish and the operator merges the pull request it opens (625–628). A three-row table gives what each check finds and what the publish does.
2. **Sections.**
   - Publish a target order's change (623–745).
   - The two classes (345–355).
   - Empty or absent (469–472).
3. **How found.** The table row, then the section list. 1 subsection.
4. **Unsure or not found.** Whether rewording a line changes the digest.
5. **Slowed or misled.** None.

## 8. A release close that stopped, and a squashed, edited target merge
1. **Answer.** The same as Text A §8.
2. **Sections.**
   - The steps of a close, and a close that stops (3784–3814).
   - What a close keeps (3735–3750).
   - What a close removes from a target (3752–3782).
   - Ownership markers (3861–3869).
   - How a prune judges (3729–3733).
   - How an order's pull requests merge (1792–1810).
   - The writer reservation (2359–2370).
   - At release close (3572–3579).
3. **How found.** The table row ("what cleanup removes and keeps"), then the section list. A second table row ("how each pull request must merge") led to the squash rules. 5 places.
4. **Unsure or not found.** There is still no remedy for each blocker class, and still no exact retry command.
5. **Slowed or misled.** "At release close" sits under "Core's own update of the starter", where a reader of this task would not look.

## 9. Running a script of mine after every edit
1. **Answer.** The same as Text A §9. Text B gives the three forbidden events as a table with the reason for each.
2. **Sections.**
   - Your hooks and permission rules (2909–3013).
   - Hooks, "Your own hooks" (2457–2465).
   - Settings and host rules (2572–2584).
3. **How found.** The table row, then the section list. 1 section.
4. **Unsure or not found.** The fragment's kit or instance status is still unstated.
5. **Slowed or misled.** None.

## 10. Reviews on a model other than the kit's
1. **Answer.** The same as Text A §10.
2. **Sections.**
   - What each worker runs (2638–2661), Bind a worker (2663–2682), Add or replace a model (2684–2721), What the configuration refuses (2723–2741), Name a worker at a launch (2743–2755), How a launch reaches its model (2757–2772).
   - Launch a review (1916–1946; option table 1930–1939).
3. **How found.** The table row ("choose what each worker runs"), then the section list. 2 sections.
4. **Unsure or not found.** The same gap as A: there is no review-only worker.
5. **Slowed or misled.** The launch options and the worker configuration sit in different sections, joined only through `worker -- list`.

# Comparison
1. **Setup:** B was easier. It has subsections, and step 4 shrinks from 235 lines to a pointer. The facts are the same.
2. **Terms list:** B was easier. It also states a fact A lacks: `plan -- target-publish` refuses a context term and has no confirmation (B 345–355 and 1638–1639). A says a context entry "never refuses" (about line 240) and contradicts itself at 400–402.
3. **First planning pass:** B was easier, with a numbered "the session then" list and the publish in its own subsection. The facts are the same, and in both texts the merge method is hidden.
4. **Running an order:** about even. Both keep the key steps in HTML comments. B adds one visible lead-in sentence and a merge table. Neither texts' entry points name "run an order".
5. **Starter update:** B was much easier: five steps with their blocks inline and core's update last. A begins with core's update and splits the blocks about 150 lines from the preview. In both, the per-file checkout instruction is hidden.
6. **Registering a repository:** B was easier. Its visible text says a planning pass files the registration order, which A says only in a comment. B also has a `records` table.
7. **Target publish:** B was easier. It names who runs the publish (B 625–628), which A only implies, and gives the checks as a table.
8. **Stopped release close:** B was slightly easier, with named subsections and the blocker classes listed. The facts are the same, and both scatter what is kept across five places.
9. **Hooks:** B was easier, with a table of the three events. The facts are the same.
10. **Review model:** B was easier, with subsections. The facts are the same, and neither says how to switch only reviews without naming a worker at each launch.
Other differences:
   - B's License says three third-party files are bundled. A's License says none, which contradicts A's own kit-files passage.
   - B adds the documentation-map seed rule (1542–1545, 3462–3465).

# The reader's view
- **A** has 16 top-level headings and no table at the top. Every task meant searching and reading long paragraphs. First steps' step 4 and the cleanup section are walls of text, and the updates section puts core's procedure before the instance's.
- **B's** "To | Read" table and each section's "In this section" list reached the right subsection on the first try for 9 of the 10 tasks. Task 4 was the exception: the table points to Releases, but the commands sit at the tail of the setup subsection.
- **B's** numbered steps, with command blocks inside them (updates, first pass, registration), made the procedures followable.
- **Both texts** keep needed operator instructions only in HTML comments, which a rendered page hides: fresh sessions, `resume: fix`, `drive:`, merging a pass with a merge commit, and the per-file `git checkout main --`.
- **Both texts'** comments cite "step 1", "step 3" and "step 5", which do not match the guide's own numbering.
- **Both texts** leave gaps: no remedy for each close-blocker class, no exact retry command, case-sensitivity of terms unstated, no JSON example of a registration, and whether `.claude/settings.instance.json` is a kit file or an instance file.
- **B's** remaining hindrances are cross-section scatter for tasks 8 and 10, and "At release close" filed under core's update.

## The second reading

Recorded on 2026-11-16 (UTC), after round two of the review ladder and
before the complete run.

- **The reader.** One fresh `dotln-worker`, given none of this session's
  conversation, launched at 00:02:39 UTC; its transcript names
  `claude-opus-5-5`. It returned at 00:06:53 UTC after 27 tool calls, none
  refused: no gate was running.
- **The text.** `docs/KIT.md` in the working tree, 4,365 lines, SHA-256
  `2787606d26f649eb427762bb1b7767b657e187ecc088a573d366da5f8c624ba7`, Git
  blob `5e61a637f6f3b776711959d2d0326e17c12ff37c`. The executor read both
  values before the launch, wrote the blob to the repository's object store
  and kept a copy of the bytes in session scratch; the reader computed the
  same two values itself, and the hash was the same after it returned. The
  guide has not been edited since: the tree the complete run reads holds
  this blob, and `git hash-object docs/KIT.md` there prints its id.
- **The brief.** The candidate alone, and the numbered list of
  [tasks.md](tasks.md); no base text, no other document and no code. It was
  told to take the tasks one at a time, to find each answer from the top of
  the document as a person would, to read the page as rendered (a comment is
  not on the page) and, for each task, to give the answer, the headings
  used, how many places it read, what it did not find and what was hard to
  follow.
- **How it read, by its transcript.** A task at a time: the guide's first
  150 lines and its heading lines once, then the passages for each task in
  the tasks' order, nineteen reads in all, the longest 180 lines.
- **What it is and is not.** It is one reader's cold reading of the final
  text. It is no comparison: this reader never saw the base, so the base's
  answers remain those of the first reader above, who knew both texts.
- **What the executor did with it.** Nothing in the guide: an edit would
  change the text the answers were given from. Each thing the reader did
  not find or found hard is left for planning
  ([D026](decisions.md#wo-281-d026--the-second-reading-of-the-candidate-one-fresh-reader-the-final-text-alone-its-bytes-kept-and-what-it-could-not-find-left-to-planning)).

The report follows whole, as the reader returned it, but for the trailing
spaces of two blank lines, which Git's whitespace check refuses.

# Report: ten questions answered from `docs/KIT.md`

## The text read

```
2787606d26f649eb427762bb1b7767b657e187ecc088a573d366da5f8c624ba7  docs/KIT.md
5e61a637f6f3b776711959d2d0326e17c12ff37c
    4365 docs/KIT.md
```

How I found things: I started from the "To | Read" table at the top and from each section's "In this section" list. I also printed the document's heading lines (`grep -n '^#'`) once, the way a reader would use a rendered table of contents. I read the tasks list (lines 14–44 of `docs/evidence/WO-281/tasks.md`) and nothing else of that file.

## 1. New instance from the starter

**Answer:**
1. Skip the recipe's `gh repo create <org>/<name> --private` line, because your empty private repository already exists. Then type:
   ```sh
   git clone --no-tags <starter url> <name>
   cd <name>
   node scripts/doctor.mjs
   git remote rename origin upstream
   git config remote.upstream.tagOpt --no-tags
   git remote add origin <private url>
   git push -u origin main
   node scripts/bootstrap.mjs
   node scripts/harness.mjs check
   ```
   - `doctor` prints one row for each thing the kit needs of the host. Each row says what it saw, whether the need is met, what depends on it and the fix. It refuses nothing, so read the rows.
   - After this, `harness check` passes and reports `local-terms list: unavailable`.
   - The clone skips setup step 1, and bootstrap plus check do steps 2 and 3. Go on from step 4.
2. Step 4, register the local-terms list:
   ```sh
   mkdir -p docs/control/local
   cp scripts/kit/terms.example.txt docs/control/local/terms.txt
   npm run terms -- check CLAUDE.md README.md
   ```
   Replace the example's entries with your own and run the last line again. It should print `local-terms list: present` with the count in each class, the files screened and the lines found. A `FAIL` line names a file and line that hold a `refuse:` entry.
3. Step 5 is optional: copy `dotln.config.example.json` to `dotln.config.json` only if you elect a feature or move a document root.
4. Step 6:
   - Commit what changed and push `main` to `origin`.
   - Tell the instance's session "Start WO-001 in its own worktree." It runs `npm run worktree -- start WO-001 docs/work-orders/WO-001-environment-truth.md`, which creates the sibling worktree on `wo-001`.
5. Step 7: open a session in the `wo-001` worktree. That session:
   - registers the terms list if the worktree has none;
   - runs `npm run resume -- status`;
   - runs `npm run meta`;
   - enters `resume: next`.

**Where:** the "To | Read" table; First steps; The host report; Start a private repository from the starter; The setup, step by step; The local-terms list → Register the list.

**Places read:** 3. These were The host report, the stretch from Start a private repository through The setup, step by step, and Register the list. The top table was used only to find them.

**Not found:**
- The document never says what counts as a "working instance", or what you see once the whole setup has worked. The visible signs are only the two terms-list status lines and "`harness check` then passes".
- The recipe's own summary of what to look for and what to do on failure is only in an HTML comment. That covers "look for one row … `unmet` … apply the remedy … if the terms check prints `FAIL`, reword the line". Part of it is repeated in visible text (doctor's rows and remedy, the `unavailable`/`present` lines). The instruction to rerun doctor after a fix is comment-only.

**Hard to follow:**
- *Start a private repository from the starter*: "the recipe does not replace step 4's local-terms list or step 7's `npm run meta`, so the numbered steps continue from step 4". I had to read it twice to see that "does not replace" means "does not do".
- *Start a private repository from the starter*: "the last two lines do steps 2 and 3" needed counting back through the block.
- *The setup, step by step*, step 6: it says to *tell the session* "Start WO-001 in its own worktree", then gives an `npm run worktree -- start …` command. I could not tell whether I type that command or the session runs it. "The session started in `main` writes no other file in that worktree" added to the doubt.
- *The setup, step by step*, step 7: it lists what "that session" does, ending "Enters `resume: next`". It is unclear whether I must type `resume: next` or anything else.
- The recipe assumes you are creating the repository (`gh repo create`). Nothing says to skip that line when the repository already exists.

## 2. Keeping names out of commits

**Answer:**
- **Where the list goes:** `docs/control/local/terms.txt`, one entry a line. Git ignores the directory.
- **How to write each kind:**
  - Put a name that must never appear under a `refuse:` line.
  - Put a name that is also an ordinary word under a `context:` line.
  - A mode word alone on a line opens a section that runs until the next one. A single line can also carry its own marker, as in `refuse: <entry>`.
  - An unmarked line outside every section counts as context. `review:` is read as `context:`. An entry in both classes refuses.
  - `#` at a line's start, or after a space, starts a comment.
  - The example shows `refuse:` / `Project Lantern` / `build.lantern.example` and `context:` / `Harbor`.
- **A branch line holding a refuse entry:**
  - `node scripts/terms.mjs branch` (and `npm run test:docs`'s terms task) prints `FAIL <file>:<line>: a local term in refuse mode` on stderr and exits nonzero.
  - That stops the gate until the line changes ("hyphen or no hyphen").
  - The publish helpers refuse before anything is pushed. The refusal names file, line and mode, never the term.
- **A branch line holding a context entry:**
  - The screen prints `CONTEXT <file>:<line>: a local term in context mode` and passes. A publish prints it and proceeds.
  - The executor, verifier, final reviewer and a planning pass each read every listed line beside its entry, reword a line that names the listed thing, and state how many they read.
  - Two exceptions apply in a registered target. A target order's publish lists the match and waits for the reviewer's confirmation. A planning pass's `npm run plan -- target-publish` refuses it outright, so the line must be reworded.
- Matching joins letter and digit runs across spaces, hyphens, periods and similar characters, but not across braces, brackets, pipes, backslashes, quotation marks or operators.

**Where:** The local-terms list; The two classes; How the list is written; How an entry is matched; Register the list; What a screen prints: a worked example; Where the list is applied.

**Places read:** 1 (one contiguous section).

**Not found:** nothing.

**Hard to follow:**
- *How an entry is matched*: "and across the characters the entry itself carries between its runs" took two reads.
- *How the list is written*: "Only those three words before a colon are markers" sent me back to count which three words (refuse, context, review).

## 3. First planning pass

**Answer:**
- Commit the export and install the pinned dependencies first.
- Then, in a session on the instance's clean `main`, type:
  ```text
  planning: first pass
  ```
- The session then:
  1. runs `npm run plan -- start first-pass`, which creates the planning branch, reads the follow-up feed and writes the planning document;
  2. drafts the instance's orders and sequence;
  3. records the dated pass in `docs/lineage/idea-ledger.md`;
  4. commits the planning subject, records costs and commits the cost table;
  5. has one background worker refute the pass, then files and checks the receipt;
  6. runs the four pre-handoff checks;
  7. publishes.
- **How it ends:** the publish (`node scripts/refute-plan.mjs publish --title <title> --body-file <path>`, or `npm run plan -- publish`):
  - lints the title and body;
  - pushes the `planning/<date>-<slug>` branch to `origin`;
  - opens a ready pull request against `main` and prints its URL.

  The operator merges it with a merge commit.
- The publish refuses on a refuse-mode term, an absent local-terms list or AI attribution. A context-mode match is printed and does not stop it.

**Where:** Planning in this instance; Run the first pass; Publish the pass. I also used "When the list is empty or absent", read for question 2.

**Places read:** 2.

**Not found:**
- What to do when the publish refuses is only in an HTML comment: register the list and ask the session to publish again, or ask it to reword the named line.
- That WO-001 may run before this pass is also comment-only.
- "Look for the pull request's URL when the pass ends" is comment-only, though the visible text does say the publish prints the URL.
- The visible "Run the first pass" text does not say the terms list must be registered first. That follows only from Publish the pass and the local-terms section.

**Hard to follow:**
- *Run the first pass*: "Commit the export and install its pinned dependencies first". A clone from the starter has no export to commit, and I was unsure whether this means setup steps 1–3, the clone recipe, or both.
- *Run the first pass*: "files the receipt and checks it", "Both stay fixed through receipt filing" and "the four checks that come before a handoff" name things this subsection does not explain. It defers to The commands a pass runs, which I did not need to answer the question.

## 4. Running an order to release

**Answer:**
1. From clean `main`, start the order in its own sibling worktree `<name>-woNNN`:
   ```sh
   npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-<slug>.md
   ```
2. Open a Claude Code session in that folder. Type these one at a time, each as its own message, in a fresh session once the previous phase has finished:
   ```text
   resume: next
   resume: verify
   resume: final review
   ```
   - `resume: next` does the work, `verify` checks it independently, and `final review` reviews it and opens the pull request.
   - If verification or final review fails, type `resume: fix` in the worktree, then `resume: verify` and `resume: final review` again.
   - `resume: status` shows where the order stands.
   - Alternatively, type `drive: WO-NNN` in a session in `main`. It runs the phases in fresh sessions and stops for your merge.
3. Merge the pull request.
   - In the instance's own repository it must be a merge commit, never a squash or rebase, because release close needs the order's branch in `origin/main`'s history.
   - A registered target's pull request merges by that team's method. The close recognises a merge commit, fast-forward, squash or rebase.
4. In a session in the instance's `main`, type:
   ```text
   resume: release close
   ```
   It updates `main`, publishes the tag and Release, and removes the worktree and branch. If it stops, fix what it names and type the phrase again.

**Where:** Run and close an order; How an order's pull requests merge (in Releases in this instance).

**Places read:** 2.

**Not found:**
- What to look for after each step is comment-only, and the visible text defers it to OPERATOR.md. The comment covers `Carried the local-terms list into` / `No local-terms list`, the tag and Release appearing, and the sibling folder disappearing.
- That a retried close never publishes a Release twice is also comment-only.

**Hard to follow:**
- *Run and close an order*, step 2: "in a fresh session once the phase before it has finished". I read it twice to decide whether all three phrases go in one session or each in a new one. I concluded each is new.
- It does not say whether `resume: fix` also needs a fresh session.

## 5. Taking a newer starter release

**Answer:**
- First read the release's "Read before upgrading". An instance older than v1.0.0 first does what that subsection lists.
- The session takes the update on the operator's word, never inside a planning pass.

1. **Preview, which changes nothing:**
   ```sh
   git config remote.upstream.tagOpt --no-tags
   git fetch --no-tags upstream
   git worktree add --detach .runtime/upstream-preview upstream/main
   node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main
   git worktree remove .runtime/upstream-preview
   ```
   - For one named release, fetch its tag into a non-tag ref and use that ref in place of `upstream/main` here, in the merge and in `--from`:
     ```sh
     git fetch --no-tags upstream refs/tags/v0.85.0:refs/upstream-releases/v0.85.0
     git worktree add --detach .runtime/upstream-preview refs/upstream-releases/v0.85.0
     node .runtime/upstream-preview/scripts/launchpad.mjs preview --from refs/upstream-releases/v0.85.0
     git worktree remove .runtime/upstream-preview
     ```
   - If an interrupted preview left the folder behind, run `git worktree remove --force .runtime/upstream-preview` or `git worktree prune`.
2. **Read the preview,** above all each `both changed: <path>` row and each `refused` kit file. `instance files both sides changed: none` means there are none. The preview also prints a line for each host floor (Node or Git version) the new release needs that this host does not meet.
3. **Take it on a branch:**
   ```sh
   git switch -c chore/starter-update
   git merge upstream/main
   ```
   Stop here and settle the both-changed files (see the end of this answer). Then go on:
   ```sh
   node scripts/harness.mjs emit
   node scripts/lineage.mjs index
   npm run sync
   git add -A
   git commit -m "Take the starter update"
   node scripts/launchpad.mjs update --publish --from upstream/main --title "<title>" --body-file <path>
   ```
   The publish refuses on `main`, off a `chore/<slug>` branch, with uncommitted changes, or until the update is whole. It then pushes and opens a pull request, printing its URL.
4. **Merge the pull request with a merge commit.**
5. **Finish:**
   ```sh
   git switch main
   node scripts/launchpad.mjs update --finish
   ```
   - If the finish passes its time bound, the by-hand finish is `git fetch origin main`, `git merge --ff-only origin/main`, `node scripts/bootstrap.mjs`.

**A file both sides changed:** keep this instance's bytes, whether or not the merge stopped on it.
- Run `git checkout main -- <path>`.
- If that says the path matches no file known to Git, this instance deleted it, so run `git rm <path>`.
- If the merge stops on `.claude/harness-manifest.json`, run `git checkout main -- .claude/harness-manifest.json`. The emit rewrites it.
- If the publish later finds such a file without this instance's bytes, it refuses and offers two ways on:
  - the printed `git checkout <commit> -- <path>`;
  - `--take <path>`, to keep the merged bytes on purpose (printed as `taken: <path>`).
- A file both the branch and `main` changed since has to be set by hand and taken.

**Where:** Taking upstream updates; Take a starter update; What the preview shows (Floors this host does not meet, Instance files both sides changed); What the update's publish checks; A file both sides changed; Preview a named starter release.

**Places read:** 4 subsections, in one contiguous stretch: Take a starter update; What the preview shows; What the update's publish checks with A file both sides changed; Preview a named starter release.

**Not found:**
- Where "the release's Read before upgrading" lives is not said.
- What to say to the session to start the update is not given in visible text. The comment says "tell a plain session in `main` to take the starter update, or type these lines yourself"; the visible text says only "The session previews it".
- What goes in the publish's `--title` and `--body-file` is not said.

**Hard to follow:**
- *Take a starter update*, step 3: the command block runs straight through from `git merge` to the publish. The required pause, and the `git checkout main -- <path>` / `git rm <path>` lines, are only in the prose above and below it, not in the block. A reader copying the block would skip them.
- When the merge has stopped on a conflict, nothing says plainly that the following `git add -A` / `git commit` concludes that merge. I had to infer it from "the merge commit held them, or a later commit put them back" in A file both sides changed.
- *Take a starter update*: the voice switches between "The session previews it" / "the session: creates …" and commands a person types, which left me unsure who runs them.

## 6. Registering a team's repository

**Answer:**
- Register the repository before the first order that changes it.
- A planning pass files a registration order from the values you state. Ask for:
  - the repository's entry under `repositories` in `dotln.config.json`;
  - its profile `docs/repositories/<id>.md`;
  - `docs/control/outward-vocabulary.json` with `reviewTerms`;
  - an operator grant naming the repository in `packages/skeleton/loadouts/grants.json`.
- For a team's application repository, set `"records": "instance"` in the entry, beside its `gate` and optional `documentationRoot`. Order, decisions and reports then stay in this instance and nothing of them is committed in the target. The default `target` would file every order's records into the team's repository.
- The value is read from the instance's `main`. An order whose records were already filed keeps them in the target.
- The registration order's executor records the clone:
  ```sh
  npm run worktree -- clone <id> <absolute-path>
  ```
- Merge the registration order first, before any target order starts. Publication reads the grant and profile from `main`. A later `worktree start` reads the merged registration.

**Where:** The configuration file → A registered repository; Register another repository → What target publication needs, How the registration lands.

**Places read:** 2 (contiguous).

**Not found:**
- The phrase or form for asking a planning pass to file a registration order is missing. The visible text says only "filed by a planning pass from the values the operator states". The clearer instruction, "ask a planning pass to file its registration order … ask for `"records": "instance"`", is only in an HTML comment.
- There is no example of a `repositories` entry, its `gate` shape, or the grant's form in `grants.json`.
- "If a plan check, a document gate or bootstrap names a repository whose clone is not recorded, run this command" is comment-only. A related bullet under Start a private repository is visible.

**Hard to follow:**
- *How the registration lands*, step 1: "Its executor commits both files on the operator's stated values, retaining that word and its SHA-256 in ignored intake". I was unclear what "that word" refers to. "writes the ignored local-terms list from the terms the operator states" was unexpected here.
- *How the registration lands*, step 2: "It accepts an id that the running checkout's own configuration or siblings declaration declares" took two reads. It is also unclear whether I or the executor run the clone command.

## 7. Publishing a target order

**Answer:**
- The reviewer's session runs the publish from the launchpad root after final review.
  1. Commit the instance records on the order branch.
  2. With `records: target`, run `npm run resume -- target-records`. With `instance` there is no records step.
  3. Run:
     ```sh
     node scripts/worktree.mjs publish WO-NNN --target-worktree --branch <type>/<slug> --title <title> --body-file <committed-reviewed-body-path> [--confirm-terms sha256:<digest>]
     ```
- **What it checks:** it reads the branch, commits, title and composed body (reviewed prose, generated Change table, target checks) and applies three checks:
  - launchpad identifiers (`WO-NNN`, `WO-NNN-DNNN`, `FUP-<16 hex>`, `VER-NNN`, `FINAL-NNN`, `REVIEW-NNN`, `WS-NNN`): refuses;
  - `refuse:` terms of the local-terms list: refuses;
  - review words (`reviewTerms` of the outward vocabulary) and context-mode terms: lists each and refuses until confirmed.
- **Other refusals:**
  - Refusals name the line, the part of the body and, for a Change row, the path. A private term's matched text stays redacted.
  - With `instance`, it refuses to leave the reviewed commit behind if the target's HEAD differs.
  - An absent local-terms list refuses it.
  - Only the node spelling runs; `npm run worktree -- publish` is withheld.
- **When it stops on a word:** read each listed line, then run the publish again with `--confirm-terms sha256:<digest>`, using the digest the refusal printed. The confirmation is recorded in the publication log and session journal.
- The pull request then merges by the target team's method.

**Where:** Publish a target order's change; What the publish checks; Confirm the listed words; Where the order's records go; Which forms of the command run. Also The two classes and When the list is empty or absent, both in The local-terms list.

**Places read:** 2 (the target-publish section and the local-terms section already read).

**Not found:**
- That the operator does not type this publish is said only in an HTML comment ("the reviewer's session runs a target order's publish; the operator does not type it").
- What to do when a listed line really names the listed thing (reword before confirming) is not said in this section. Only the general stage rule in "Where the list is applied" covers it.
- That these checks run before the push is not said explicitly for the target publish. The local-terms table says it for "an order branch".

**Hard to follow:**
- *Confirm the listed words*: "The reviewer reads each listed line, then runs the publish again". I was unsure whether "the reviewer" means me or the reviewer session, so I did not know whether I act or watch.

## 8. A release close that stopped

**Answer:**
- **Why it stopped:**
  - A close that stops records `blocker: { class, step, message }`, and its summary names the class.
  - The classes are `undeclared-ignored-material`, `not-clean`, `writer-held`, `preservation-refused`, `declared-root-unreadable`, `host-denied`, `base-fetch`, `foreign-tag`, `starter-refresh`, `publication`, `other`.
  - The close receipt records candidates, removals, retentions and blockers. `plan failures` counts blockers by class and order.
- **What it has kept:**
  - A blocker keeps the same close retry command.
  - A held writer stops the close before anything is moved or deleted.
  - A failed move of session records keeps the worktree as a cleanup blocker with the retry command, and a retry merges into the lane.
  - Session journals and states move to `docs/control/local/retained/<WO>/harness/`, and a target's harness records move into the same lane.
  - The target's temporary-root ledger is written back if its removal stops.
- **How to finish:**
  1. Read the blocker's class, step and message.
  2. Settle what the message names. For `writer-held` see The writer reservation; for `undeclared-ignored-material` in a target see What a close removes from a target, and remove undeclared output from this launchpad session by the target's path.
  3. Run the same close again from the instance's `main` by typing `resume: release close` again.
- **If the team squashed the target's pull request and edited it at the merge:** nothing matches.
  1. The close refuses with the source retained, naming `--merged-as <commit>`.
  2. Run the printed close again with the id of the base commit that carries the change.
  3. The close checks that the commit is in the fetched base, came after the branch left it and touches a path the change touches. It then prints the commit's subject and proceeds.

  The person naming the commit takes the judgment that it carries the change. `drive: WO-NNN` stops for this attended close.

**Where:** Run and close an order (step 4); The steps of a close, and a close that stops; What a close keeps of an order's sessions; What a close removes from a target; How a prune judges and removes (the close receipt sentence); How an order's pull requests merge.

**Places read:** 5.

**Not found:**
- Where the blocker record and the close receipt are kept, so you can look at them, is not said.
- The exact spelling of the `plan failures` command is not given here.
- There is no single statement of "what a stopped close has kept". I assembled it from three subsections.
- That a retry checks an existing Release and never publishes twice is only in an HTML comment.
- How to find the id of the base commit that carries the edited squash is not said.

**Hard to follow:**
- *How an order's pull requests merge*: "Run the printed close again with the id of the base commit". The rest of the document has me type the phrase `resume: release close`. I could not tell whether I now run a printed command myself in a terminal, or how `--merged-as` reaches the phrase.
- *The steps of a close, and a close that stops*: the opening paragraph ("runs its printed `--publish` command once … prepares the verified carried runtime in a child process … Publication and retry controls remain the same") took two reads. It was unclear what "the same" compares to.

## 9. A hook after every edit

**Answer:**
1. Write the script under `extensions/`, for example `extensions/hooks/after-edit.mjs`. No kit file is or will be under that root.
2. Register it in the committed fragment `.claude/settings.instance.json`. The example:
   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Edit|Write",
           "hooks": [
             {
               "type": "command",
               "command": "node \"${DOTLN_LAUNCHPAD:-$CLAUDE_PROJECT_DIR}/extensions/hooks/after-edit.mjs\"",
               "timeout": 30
             }
           ]
         }
       ]
     },
     "permissions": { "deny": ["Bash(extensions/tools/deploy *)"] }
   }
   ```
   - Hooks may go only under `PermissionDenied`, `PostToolUse`, `PostToolUseFailure`, `SessionStart` and `Stop`.
   - Commit the script and the fragment.
3. Run `node scripts/harness.mjs emit`, then `node scripts/harness.mjs check`.
4. For a target worktree that already stands, run `node scripts/harness.mjs emit --target <worktree>`. In an attended target session, export `DOTLN_LAUNCHPAD` as this instance's root.

**Events your hook may not use:** `PreToolUse`, `SubagentStop`, `UserPromptSubmit`. Emit refuses anything outside the allowed shape and names the key.

**When the kit updates:**
- An update plans nothing under `extensions/`, and emit writes nothing there.
- The generated `.claude/settings.json` is a kit file a re-emit rewrites. The fragment is this instance's own, and emit merges it in after the kit's entries, only adding.
- An update plans the merged settings as this instance's own emit, and `launchpad.mjs verify` counts them as its own. The update branch's `node scripts/harness.mjs emit` re-merges the fragment.
- A hook written straight into the generated settings is what breaks.

**Where:** Extending this instance; The root that is yours: `extensions/`; Your hooks and permission rules; What the fragment may hold; The three events a hook may not use; Running your hooks; Settings and host rules (in Kit files and instance files). Also Take a starter update, read for question 5.

**Places read:** 2: Extending this instance and Settings and host rules.

**Not found:** The document never says in one sentence that an update leaves `.claude/settings.instance.json` itself untouched. I inferred it from the Settings table, which classes it apart from the kit files a re-emit rewrites, and from "An update therefore plans the merged settings as this instance's own emit".

**Hard to follow:** *Your hooks and permission rules*: "An update therefore plans the merged settings as this instance's own emit". I read it twice to work out what happens to my hook on an update.

## 10. A different model for reviews

**Answer:**
- **What to edit:** the `workers` section of `dotln.config.json`. Copy it from `dotln.config.example.json` if you have none.
  - The `default` worker runs a launch that names nothing and every driven phase except independent verification. Rebinding it changes all of those, final review included.
  - `verifier` runs driven verification.
  - A worker of your own, with an optional description and per-provider model or `{ "model": …, "effort": … }`, runs only where you name it.
  - Example:
    ```json
    "workers": {
      "default": { "claude": "opus", "codex": "sol" },
      "advanced": { "claude": "fable", "codex": "astra" },
      "night-review": {
        "description": "Reviews that run unattended.",
        "codex": { "model": "astra", "effort": "high" }
      }
    }
    ```
  - For a model the kit does not list, or a newer id, add or replace a row in `dotln.models.json`, which updates never touch:
    ```json
    {
      "schemaVersion": 1,
      "models": {
        "small": { "provider": "claude", "id": "<the exact id>", "effort": "high", "family": "<the family>" }
      },
      "prices": {}
    }
    ```
  - Edit on `main` or in an order's worktree, not on a planning branch.
- **What to run afterwards:** `node scripts/harness.mjs emit`. `node scripts/harness.mjs check` then compares against the two files.
- **To name your worker at a launch:**
  - Use `--model <name>` (and `--effort`) on `npm run worker -- review`, `npm run plan -- refute` or `npm run entropy -- review`.
  - A dispatch line may close with the name, as in `resume: next night-review`.
- **To see what a launch will use:**
  - `npm run worker -- list` prints every name, what it runs and where each value was written.
  - `npm run worker -- show <name>` prints what one name runs and how this session launches it. It marks a Claude-session launch as not exact, since the host resolves family and effort to a model.
  - `--dry-run` on the review launch prints the command line and brief.
  - Afterwards, the attestation records the model id and effort.

**Where:** What each worker runs; Bind a worker to a model; Add or replace a model; Apply a worker or model change; What the configuration refuses; Name a worker at a launch; How a launch reaches its model; Review workers → Launch a review.

**Places read:** 2: What each worker runs (contiguous) and Launch a review.

**Not found:**
- No worker is named for "reviews". The document does not say which worker the final review or the review helper uses beyond "`default` … every driven phase but independent verification" and "Without `--model` and `--effort` the launch runs the `default` worker". How to change only the reviews and not all other phases is not stated.
- That a dispatch-line worker name works with `resume: final review` is not shown. Only `resume: next night-review` is.

**Hard to follow:**
- *How a launch reaches its model*, Claude session row: "The one `dotln-worker` definition, as it stands for the model that definition holds and otherwise with the model's family and effort, which the host resolves to a model". I read it three times and am still unsure when the launch is exact.
- *What each worker runs*: "the effort it runs at where a launch names none and, for Claude, the model family a session's own launch takes" took two reads.

## Overall

The top "To | Read" table and each section's "In this section" list made it quick to find the right place. Commands are in copyable blocks, and some questions (2, 9 and 10) are answered within one section.

The document was harder to act on in three ways:
- The operator-facing parts of several answers are only in HTML comments, while the visible text defers to OPERATOR.md. That covers what to look for, what to do when a step fails, who types a command, and the words to give a session. It mattered most in questions 1, 3, 4, 6, 7 and 8.
- The text often shifts between "the session does" and "type", so I was frequently unsure whether a command was mine to run (questions 1, 5, 6, 7, 8).
- Unexplained terms (receipt, lane, blocker class, printed close, fold) and answers spread over several subsections, as in questions 5 and 8, meant extra reading. In question 5, a pause that matters sits outside the command block it applies to.
