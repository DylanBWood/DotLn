# WO-072 FINAL-001 — final review

**Verdict:** pass. WO-072 gives a registered target repository a work-order lifecycle: `worktree start` creates the target's worktree at the declared base under the configured parent with WO-049's target-worker bundle and the launchpad's order worktree beside it; `resume` commands run from the target select the order through the launchpad by physical identity and write reports only there; `release close` ends a target order with a `no-release` disposition, removes the bundle, the merged worktree and branch, and creates no tag in either repository. All six criteria hold at the integrated subject. The verification sequence is complete: VER-001 failed on a launchpad-spelling regression and an exit-0 plain-text `status --json`, the repair closed both, and VER-002 passed. One finding, F1, is a follow-up in the declared surfaces that breaks no criterion and no behavior `main` had: a target close that meets ignored material outside the bundle refuses with every ignored file listed and no remedy ([D010](../../evidence/WO-072/decisions.md#wo-072-d010--final-review-pass-final-001-board-the-target-closes-ignored-material-refusal-which-lists-every-file-and-names-no-remedy), FUP-00b15d92d53011b2).

**Subject:** [`docs/work-orders/WO-072-target-worktree-lifecycle.md`](../../work-orders/WO-072-target-worktree-lifecycle.md) on branch `wo-072`, uncommitted over `main` at `0aee17a9bfcf3012586915b5477ec9de19c56e49`. `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all name that commit, so integration merged nothing ([D009](../../evidence/WO-072/decisions.md#wo-072-d009)).

- The gate code identity is `4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414`, the identity VER-002 passed and the executor's review row covers. `gateCandidates` returned it after integration and again after `npm run format`. This review edited no code byte.
- The recorded `reportHash` of VER-001 and VER-002 each equals the report's current SHA-256.
- The order differs from `main` only in its heading's version label, `(v0.75.0)`. The six criteria are the original text.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. This session ran every probe and check the verdict rests on, so no worker was needed.

**Process cost:** entry 93018 tokens; handoff 3640418 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 59cd263f-e6c2-4670-90ae-ca9d64557dca`.

- Entry was observed at 2026-10-11T23:18:35.564Z.
- Handoff was observed at 23:34:01.642Z, after 70 steps and 69 commands. It counts 3,357,335 cached input, 225,370 cache-write, 708 uncached input and 57,005 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context. The sample predates the document gate, the result transition, the commit series and the publish.
- Reasoning tokens and dollar cost are unavailable.
- Wall clock to handoff was about 16 minutes. The review gate at the unchanged identity took 6.24 s; the fixture suite took 29 s and the one new probe 4 s.
- Tradeoff: the 24-minute fresh product gate was not rerun. The code identity is unchanged from the executor's passing review row and VER-002, and the order names `npm test -- --review` at final review, which this review ran: it reused the passing tasks and ran `format` fresh. A fresh gate would have added no evidence about paths this review did not already run through the suite and its probe.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-072/FINAL-001.md`.

Read in full: the order, with its known issues and carry-ins; VER-001 and VER-002; this order's D001 to D009; `handoff.md`, `self-review.md` and `meta.json`; the executor's `PR.md` draft (a meter block only); product 07 §Verification review and attack and §Independent workflows and integration; product 08 §PRs and commits and §Release-note edition; the five reader profiles; the 2026-09-28 planning document §10, the 2026-10-07 machinery reset's WO-072 passage, receipt 044's WO-072 judgment and the 2026-10-11 standard pass's WO-072 rows.

Reviewed: the complete implementation diff (`scripts/worktree.mjs`, `scripts/resume.mjs`, `scripts/release.mjs`, `scripts/test-runner.mjs`) and the three new files (`scripts/lib/target-worktrees.mjs`, `scripts/lib/target-worktree-close.mjs`, `scripts/test-target-worktree.mjs`); the write-back diffs to product 07, `docs/PLAYBOOK.md`, `README.md`, the order heading, the publication lock, the decisions index and the register. Cross-checked against the diff: `loadConfig` and `findLaunchpad` in `scripts/lib/config.mjs`, `removeMergedBranch` in `scripts/lib/git.mjs`, the target bundle's path set and instruction text in `scripts/lib/harness.mjs` and `packages/compiler/src/harness.ts`, the plain-start fixture in `scripts/test-configuration-root.mjs`, and `gateCandidates` in `scripts/lib/gate-reuse.mjs`.

Lenses, and why:

- Correctness and tests: the change is lifecycle state, path identity and teardown, and the verification sequence turned on path identity.
- Operator flow: three new commands, a printed handoff, a retry path and a refusal set.
- Authority and private data: physical paths must stay in ignored state and out of target commits.
- Release surfaces: final review is acceptance, and this order ships a minor release.

Integration: `npm run worktree -- integrate WO-072` fetched `main` equal to the base, retained its named stash, re-applied the work and regenerated only documents. D009 records the carried-forward claims and the affected checks, all of which pass. No authored conflict arose, and no component version collides: local tags end at v0.74.3 and origin lists no v0.75.0.

Disclosure: an instrument under review also recorded this work. `scripts/resume.mjs` is in the subject and recorded this dispatch; it will record the result. Its selection block is inert in this checkout, which has no `dotln.config.json` and no target registry.

## Criterion judgments

**Criterion 1:** met

- This review's bounded run of `scripts/test-target-worktree.mjs` (2026-10-11T23:23:57Z to 23:24:26Z, exit 0) passed criterion 1: the target starts at the declared base and not the later commit, the authority profile JSON is echoed, `checkTargetHarness` counts the bundle's seven files, `git status --porcelain` is empty after the emit, and two commits (one after `git add -A`) list no DotLn control, work-order, evidence or harness path.
- The control segment holds no fixture path. VER-002 reproduced the same with its own probe, and VER-001 attributed each bundle file to the clone's `info/exclude`.

**Criterion 2:** met

- The suite passed criterion 2 and both repair spelling tests in this review's run. Both routes, the order launchpad's scripts and `DOTLN_LAUNCHPAD` with `main`'s scripts, select the order from the target and from a subdirectory of it through physical, symlink, chained-symlink, case-variant and volume-alias spellings; verification and final-review reports land under the launchpad's configured roots; the target has no `records/` directory and a clean status.
- From unlisted directories, the four actions select no order and say so with exit 0; `status --json` exits 1 with the sentence on stderr and an empty stdout. The control segment is byte-identical afterwards. A target switched to another branch refuses.
- VER-002 added the base-against-current runs for the self route, 24 of 24 spellings selecting in both. VER-002's F1 (the target's no-selection sentence under `main`'s scripts) stands as the boarded follow-up FUP-f82660a8edb23a4d and affects neither declared route.

**Criterion 3:** met

- The suite's criterion 3 case passed in this review's run and reported a case-insensitive volume, so the variant-case parent refusal ran rather than being skipped. Each refusal (no clone recorded, not a Git top level, spelling differs from filesystem identity) leaves no `wo-999` branch in either repository, no target or launchpad worktree and no registry file.
- The umbrella and name-collision cases passed as well. VER-001 probe C and VER-002's unit probe cover a hand-edited clone map, a missing parent and the four alias spellings of `physicalDirectory`.

**Criterion 4:** met

- The suite passed criterion 4 in this review's run: an unmerged target refuses on `merge-base --is-ancestor` and keeps the bundle and both worktrees; the dry run reports `would-remove`; the publish removes both worktrees and both `wo-999` branches; the retained record carries `publication.outcome` `no-release`, `tag` null, `targetCleanup` `removed` and `cleanup` `clean`; `git tag --list` is empty in both repositories; the repeat succeeds.
- VER-002 adds `git ls-remote --tags origin` empty for both repositories, the surviving unrelated `feature` branch and the clone left on `main`.
- F1 below is a refusal in this path on an input the criterion's declared set does not include; the criterion is judged against that set.

**Criterion 5:** met

- Product 07 §Where the control plane finds its documents holds one undated paragraph on the target worktree, the registry, physical selection identity, the unregistered JSON refusal and reports in the launchpad; §Workflow closeout and releases holds the undated no-release close paragraph. `docs/PLAYBOOK.md` §The loop, per work order has the target loop in step 2. D002 holds the WO-064-D001 and D004 dispositions and the WO-071-D001 and D002 recheck. The publication lock changed, and `npm run publication:check` reports both editions `CURRENT` (45 and 29 linked source sections).
- Product 07 grew by 672 bytes against the order's estimate of at most 500; ceilings are planning's since the 2026-10-07 pass, and the document check raised no advisory.

**Criterion 6:** met

- `npm test -- --review`: the executor's row at code identity `4c2df81b…` passed 35 suites with 87 fresh tasks (2026-10-11T22:59:12.601Z, exit 0). This review's run at the same identity (23:30:54Z to 23:31:01Z) reused those tasks, ran `format` fresh and passed 35 of 35 in 6.24 s.
- `npm run test:docs` ran inline at this report (under Executed checks).
- `git diff --check` is clean before and after integration. No change to `package.json`, `package-lock.json` or any package manifest; no suppression directive was added.

## Findings

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "A target close that meets ignored material outside the bundle refuses with every ignored file listed and no remedy, while git worktree remove removes the same worktree; a target with installed dependencies cannot close without a hand cleanup the message does not describe"}
]
<!-- dotln-findings:end -->

**F1 — the ignored-material close refusal lists every file and names no remedy (follow-up, escape).**

- Reproduction, under `node scripts/harness.mjs bounded` from the suite's own fixture (23:26:45Z to 23:26:49Z, exit 0): after `worktree start`, the target commits a `.gitignore` ignoring `deps/` and holds `deps/pkg/a.js`, `b.js` and `c.js`; `git status --porcelain` is empty; both `wo-999` branches are merged. `release close WO-999 --dry-run` and `--publish` each exit 1 with `target has ignored material; source retained: deps/pkg/a.js, deps/pkg/b.js, deps/pkg/c.js`. Both worktrees, the bundle and the files remain. `git -C <clone> worktree remove <target>` then exits 0 and removes the worktree.
- Cause: `scripts/lib/target-worktree-close.mjs` lists `git ls-files --others --ignored --exclude-standard` without `--directory`, filters the bundle's owned paths and joins the rest into the error, which names no remedy. For a code repository with installed dependencies the list is every file under them.
- Route: follow-up. Criterion 4 is judged against its declared set and holds; `main` had no target close. D003 decided the conservative refusal and names retained-material reconciliation as its reopening condition, so whether a close may remove ignored material as Git does is planning's choice. The follow-up in D010 keeps D003's refusal, asks for a per-directory list and a named remedy, and names the alternative.
- Class: escape. VER-002 lists the repair diff as `target-worktrees.mjs`, `resume.mjs`, the test file and product 07, so the close module is unchanged since VER-001's subject and the defect was present in both verified subjects. Criterion 4's attack with the real corpus instead of a fixture and the operator-flow lens were in verification's instructed scope; VER-001 probe D varied tracked dirt and neither verification varied ignored material.
- Not fixed here: a reviewer never writes a behavioral fix and certifies it.

## Register

`npm run plan -- followups --touching --work-order WO-072` matched 24 pending rows at revision `220a6f92…` by textual match, 25 after D010 minted FUP-00b15d92d53011b2 at `99d350f3…`. This review read every row across the four pages. One `followups --apply` batch of two requests moved the register to `2f4f85f1…`.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-a5c6ac8cb40bd52a (WO-185-D016) | deferred again | Its condition occurred by its letter: the order's design adds the `clone` action to the `scripts/worktree.mjs` dispatch with its own argument check, which also runs after `mainWorktree(toolRoot)`; `clone` writes `main`'s clone map, so for it only the first error shown changes when no worktree is on `main`. The `publish --target` ordering the row names is unchanged, no criterion depends on it, and the fix is behavioral code the reviewer may not write. |
| FUP-1315c82ef74fb832 (WO-187-D052) | deferred again | Its condition "the next order that edits `scripts/resume.mjs`" occurred. The order adds the registered-target selection block to `run` and changes nothing else there; item 1's verify-briefing order of operations and items 2 to 5 are untouched, both verify dispatches recorded without error, and this review classed its finding from product 07's definitions. |

The other rows are textual matches whose seams this change did not open and whose conditions did not occur: among them, FUP-51c310284c2fea17 names the `resume.mjs` dispatch release, which the selection block does not touch; FUP-da471832071118c7 names `ensureExistingRelease`, unchanged, where the close reads only `previousAttempts`; FUP-e821aa2ced3aa111 and FUP-e8f5399db33d0b5a name runner paths the one-line suite registration does not open; FUP-67a07b670440cf5a asks whether a findings block records unmeasured, and this block is one well-formed array. FUP-f82660a8edb23a4d (D008) and FUP-00b15d92d53011b2 (D010) are this order's own boards and stay for planning. The carried-in FUP-bd3e66761dc301ed's worktree half is fixed and tested (D004); the kit-seed half stays with the row, as the order directs.

## Observations (not findings)

- The start handoff ends with `codex` and `enter: resume: next` in the target, as the order's "same handoff as today" asks. The target bundle's instruction block names no resume route and the bundle carries no role skill or `AGENTS.md`, so what that phrase does in a Codex session there is untested; the handoff also prints the launchpad `status` command, which is the documented route. VER-001 recorded the same.
- Without `--publish` or `--dry-run`, a target close records `no-release`, removes nothing and, unlike the regular path, prints no command to run next. The output is truthful, and the playbook documents `--publish`.
- Plain `worktree start` now passes the new worktree to activation as `DOTLN_LAUNCHPAD` explicitly. The scripts' own checkout is that worktree, so the value is what `findLaunchpad` would have chosen; the plain-start fixture passes in the review row.
- The launchpad order worktree of a target order starts from a commit, not from `origin/main`, so its branch carries no upstream. `removeMergedBranch` handles either case, integration resolves `origin/main` by fetch, and publish pushes with `-u`.

## Release surfaces

`PR.md` carries the reviewed body above the meter the integration regenerated, written under product 08 §PRs and commits and the `prBody` profile: the resulting behavior first, then start, selection and close, the limits a reviewer acts on, and the validation with links relative to the body file. `RELEASE-NOTES.md` has the five sections of product 08 §Release-note edition, one physical line per prose paragraph. The proposed title is a headline with a gitmoji shortcode, sized by the change against the whole merged series and not by the previous title.

## Executed checks

Each probe ran alone under `node scripts/harness.mjs bounded`, at code identity `4c2df81b…`, against disposable system-temp fixtures that the fixture's own cleanup removed.

| Check | Window (2026-10-11, UTC) | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage <session>` at entry | 23:18:35 | 0 | 93,018 tokens, 0 subagents |
| `npm run worktree -- integrate WO-072` | 23:22 | 0 | no-op merge; D009 |
| `gateCandidates` for `npm test` and `npm run test:docs` | 23:23 | 0 | identity `4c2df81b…`; one passing review row |
| Bounded `node --test scripts/test-target-worktree.mjs` | 23:23:57–23:24:26 | 0 | 10 passed, 0 failed, 0 skipped; case variants and volume alias exercised |
| `npm run publication:check` | 23:24:26 | 0 | both editions `CURRENT`; bootstrap checks pass |
| `node scripts/harness.mjs check` | 23:24 | 0 | 34 generated surfaces |
| `npm run release -- check-surfaces --local` | 23:24:29 | 0 | pass |
| Bounded ignored-material close probe | 23:26:45–23:26:49 | 0 | F1 reproduced; plain `git worktree remove` exits 0 |
| `git diff --check` | 23:19 and 23:23 | 0 | clean |
| `npm run format`, then `npm test -- --review` | 23:30:48–23:31:01 | 0 | 35 passed, 0 failed, 6.24 s, 1 fresh task |
| `npm run plan -- followups --apply` (two re-deferrals) | 23:33 | 0 | register `2f4f85f1…` |
| `npm run format`, then `npm run test:docs` | pending at this line | | |

Repository writes: this report, `PR.md` and `RELEASE-NOTES.md`; D009's completion and D010; the two register dispositions; and the regenerated decisions index, register, meta and work-order projections. No implementation source was edited. The probe script stayed in the DotLn session scratch directory; its one in-repository copy, the ignored register request file, was removed after the apply.

Goal alignment:

- Traps: deferring to two passing verifications; widening F1 into D003's design choice; patching the judged close module in review; treating the register's fired conditions as noise.
- NoOp: failing would send a pre-existing, criterion-neutral message defect through a repair, a verification and a 24-minute gate with nothing at stake for the objective, and leave the three-repository route without its lifecycle.
- Outcome: matched. The criteria were judged from the suite and a new probe at the subject, F1 is reproduced and boarded with its repair rule and its planning alternative, the two fired register rows are re-disposed by name, and the reviewed work is preserved for the commit series.
