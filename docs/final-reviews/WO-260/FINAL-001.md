# WO-260 final review — FINAL-001

**Verdict:** pass

**Subject:** the WO-260 working tree over `9adc11723fdf9a5f2e3d52d3ee37d342b6fdddaa`, which is `main`, `origin/main` and the activation base alike; code identity `00cad38aa337787a27655fd20543fb4fe7eb4692ff1b0db51987e8027cf647c9`, the identity of the complete review row recorded 2026-11-09T19:40:41.414Z and of [VER-003](../../verifications/WO-260/VER-003.md)'s subject, computed here before this review wrote anything and again after its last write (unchanged). This review changed no source and no standing document. It wrote this report, `PR.md` and `RELEASE-NOTES.md` beside it, [one probe](../../evidence/WO-260/final-review-001-corpus.mjs) with [its observation record](../../evidence/WO-260/final-review-001.json), and decisions D038 to D041, and it refreshed the generated indexes through their commands.

**Actor:** Claude Code 2.1.321 (this session's own version, read from its environment), `claude-fable-5-2` at effort `max`, read from `CLAUDE_EFFORT` in the session: the selected effort, not the effective one. The order recommends high for the reviewer; this records the actual selection. No worker, subagent or model launch was made: zero uses of the cap's twenty.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.321","model":"claude-fable-5-2","effort":"max","source":"claude-session-readback"}

**Process cost:** entry 103925 tokens; handoff 56239154 tokens; source claude-transcript-message-usage

Both readings are dispatch-scoped and count requests, cached input included; the entry reading was taken at 2026-11-09T20:52:36Z and the handoff reading at 2026-11-09T21:28:48Z, before the document gate and the result. Of the handoff total, 55,535,531 tokens are cached input and 166,929 are output; reasoning tokens and dollar cost are unknown (counter unavailable). The dispatch stood at 0 h 36 min of its 8 h 0 min bound at the handoff reading, with no complete run started. Final counters stay in the ignored receipt and the response. Reusing the complete row at the integrated identity saved a second complete run, 0 h 52 min the last time, which would have exercised nothing the row did not; the reproductions below took about 0 h 3 min of process time in all and are what this review adds to it.

## Dispatch and what was read

Dispatch: `resume: final review`, recorded by the session hook as `FinalReviewRequested` at 2026-11-09T20:52:25.048Z through VER-003, allocating `docs/final-reviews/WO-260/FINAL-001.md` with the cost line required and checkpointing `refs/dotln/checkpoint/WO-260/13`; the harness ran the dispatch once and this session did not repeat it. Read: canonical status (phase final-review, legal action `final-review-result`, no bound acceptance, waiver, defect, correction or override record, the dependency on WO-258 control-closed); the whole [order](../../work-orders/WO-260-the-kit-runs-on-git-2-31.md); [VER-001](../../verifications/WO-260/VER-001.md), [VER-002](../../verifications/WO-260/VER-002.md) and [VER-003](../../verifications/WO-260/VER-003.md); the [handoff](../../evidence/WO-260/handoff.md) and every [decision](../../evidence/WO-260/decisions.md), D001 to D037; [planning receipt 066](../../planning/refutations/2026-11-09-planning-e5d09eea5c7031a4-066.md); product 07 §Verification review and attack and §Retained planning follow-ups, and product 08 §PRs and commits and §Release-note edition; the order's control log; and the whole diff over the base: 69 changed files (1,175 insertions, 634 deletions) and 44 added ones, among them `scripts/lib/git-surface.mjs`, the below-floor Git and the fourteen cases of `scripts/test-git-floor.mjs` read whole.

## Integration and identity

`npm run worktree -- integrate WO-260` fetched origin's `main`, found the worktree not behind it and took in nothing; `HEAD` and `origin/main` both name `9adc1172…` afterwards, and the branch carries no commit of its own. It printed the owed checks, `npm test -- --review` and `npm run test:docs`. WO-244 is still active in its own worktree and has not merged, so this order is the first of the two to reach final review and integrates nothing of it.

The complete review row recorded 2026-11-09T19:40:41.414Z stands at the integrated identity: gate selection review, exit 0, 46 required suites, 122 tasks, every one executed and none reused, 0 h 52 min, candidate tree `970f9fd7…`. `coveringGateCheck` returns it for the current identity with no Preflight suite missing, and no failed `npm test` row follows it there. So no complete run was started here. Product rows are reused by code identity, which leaves documents out, so the review also compared documents with that run's tree: the kit guide, product 07, product 08, the playbook and the README are byte-identical to it, and the seven tracked documents that differ are the control projection and log, this order's decisions and handoff, and three generated indexes. No guide byte therefore rests on a product pass that did not read it, and this review edited none.

## Reproductions

Each ran in this session under `node scripts/harness.mjs bounded --`, one process at a time, outside any gate, at the subject identity. The [observation record](../../evidence/WO-260/final-review-001.json) keeps the commands and results.

| Check | Result |
| --- | --- |
| [VER-001's reproducer](../../evidence/WO-260/verification-001-surface.mjs) (a hash inside a quoted filename) | exit 0: the check now exits 1 naming `ls-tree --format (scripts/tool.sh:2)` |
| [VER-002's reproducer](../../evidence/WO-260/verification-002-pairing.mjs) (apostrophes in two quoted assignments) | exit 0: all twelve carrier and control readings as expected |
| `node --test scripts/test-git-floor.mjs` | 14 passed, 0 failed, 12.9 s; the floor Git reads `git version 2.31.0`; 8,856 repository paths and 6 fixture paths classified alike by `check-attr --source` and the temporary index |
| [The floor's two entry points](../../evidence/WO-260/verification-003-floor.mjs) under four version lines | `harness check` and the `host` task's own command each admit 2.31.0, 2.31.0.windows.1 and 2.39.3 (Apple Git-146), and each exits 1 on 2.30.9 naming `>=2.31.0` and `2.30.9` |
| `bash scripts/test-release.sh --case git_floor` | passed, 5.7 s |
| `node scripts/structural-checks.mjs git-surface` | exit 0, 1.3 s |
| The record against the tree, read in process | 10,306 readings and 488 forms; 474 recorded and 14 scoped; no recorded form the tree no longer names, no form the record lacks, no scoped path that does not name its form |
| The export case of `scripts/test-launchpad-export.mjs` that lists the kit's selections | passed, 2 min 47 s; it asserts the lists name no `git-surface` |
| [The gate-row probe](../../evidence/WO-260/verification-003-gates.mjs) | the review row above covers the current identity |
| `grep -rn '2\.40' docs/KIT.md docs/product` | one line, product 07 line 2190 |
| [The corpus observation](../../evidence/WO-260/final-review-001-corpus.mjs) | exit 0; finding F1 below |
| `npm run release -- check-surfaces --local` | every line PASS after one correction to this review's own texts: release block v0.122.1 against the latest local tag v0.122.0; `@dotln/skeleton` 0.90.0 where its source changed and the five other components unchanged; the stored body and the release notes in profile |
| `npm run publication:check` | PASS; the two tables of contents' 29 and 45 linked sections current |
| `node scripts/docs-check.mjs` | PASS, 0 failures; verbatim screen: 53 changed files against this worktree's 5 captures, a 12-word window, 0 shared runs |
| `node scripts/terms.mjs branch` | local-terms list present; 118 changed files screened, 0 findings |
| `npm run format:check`, `git diff --check` | clean |

Not run here: `npm test -- --only host` under a Git that reports 2.30.9. A refused selection records a failing `host` row at this identity, which would displace the complete row's. The `host` task's own command and `harness check` ran instead, and the executor's [exact-command record](../../evidence/WO-260/criterion-2-floor.txt) stands: `git diff` against the implementation-ready checkpoint is empty for the floor's judgment, its three callers and `package.json`.

## The verification sequence

| Report | Verdict | Actor | Findings |
| --- | --- | --- | --- |
| VER-001 | fail | Codex CLI 0.167.0, gpt-6-astra, max | F1 blocking, criterion 4: a `#` inside a quoted shell filename hid a later `ls-tree --format` from the surface check |
| VER-002 | fail | Codex CLI 0.167.0, gpt-6-astra, max | F1 blocking, criterion 4: apostrophes in two separate double-quoted assignments hid the Git command between them |
| VER-003 | pass | Claude Code 2.1.319, claude-opus-5-5, max | F1 follow-up: a `GIT_*` name written as a shorthand property is not named (FUP-0122789e67993b48) |

Both blockers were repaired under the operator's direction that the repair not grow into a hand-written parser ([D027](../../evidence/WO-260/decisions.md#wo-260-d027--a-hash-starts-a-shell-comment-only-where-it-begins-a-word-the-reading-stays-regular-expressions-with-its-other-limits-stated), [D033](../../evidence/WO-260/decisions.md#wo-260-d033--a-quoted-literal-assignment-ends-at-a-shell-separator)), and both reproducers pass here. The three reports attacked the shell reading at length: VER-003 alone judged 299 readings across four carriers with a real shell as the oracle. This review did not repeat that attack. It read what the three held constant: which directories the check lists (F1), and the premise written beside the `fsck` fallback (F2).

## The planning receipt

[Receipt 066](../../planning/refutations/2026-11-09-planning-e5d09eea5c7031a4-066.md) judged WO-260 aligned with findings and no hold, with six known issues. Each was read against the candidate.

1. The binding evidence is a stand-in Git that models six forms. It stands as the order wrote it: no Git 2.31.0 is on this host, the build was denied ([D013](../../evidence/WO-260/decisions.md#wo-260-d013--no-real-git-2310-ran-here-criterion-5s-fallback-applies)), and the first run on a host with that Git is the real-binary evidence. The issue's reopening condition stays open for that report.
2. The surface check passes once a form is recorded. [D011](../../evidence/WO-260/decisions.md#wo-260-d011--the-recorded-git-surface-and-its-core-only-check) records how the first record was confirmed: 450 forms matched Git 2.31.0's manual, 14 were confirmed by hand with the file and line read, and the rest were scoped. This review read all 14 scoped entries against their files; each newer form is confined to a test that plants it, compares it or admits its refusal, to command text Git never runs, to a call with a fallback, or to a fixture that also moves its home.
3. No criterion pinned that the new classification equals the old one. The case the executor added compares `check-attr --source` with the temporary index over this repository's 8,856 paths, and it passed here; [D005](../../evidence/WO-260/decisions.md#wo-260-d005--the-classification-at-a-revision-reads-a-temporary-index) records equal identities at five revisions.
4. With the floor lowered, an unmodeled form fails at its call site and not at `harness check`. Accepted as planned; nothing in the candidate changes it.
5. Whether running the kit on that host fits the clean-room scope is the operator's judgment, and the receipt confers no decision. Its reopening condition is not met: a scan of the 113 changed and added paths finds no host name, account name, home path or configuration from any host, and the order's records name the laptop only by its Git version.
6. The order names a host and not an outcome. [D001](../../evidence/WO-260/decisions.md#wo-260-d001--the-outcome-is-the-operators-test-cycles-on-a-git-2310-host) names the outcome: the operator's test cycles on that host.

## Review of the change

The six replacements do what the order's design says, in place and without a version switch. `codeAttributes` builds its index in an owned temporary root and removes it on every exit; the working-tree branch is the code `main` had. `gitTreeEntry` reads `ls-tree -z`'s default output for a literal path and returns null for an absent one, and each of its four callers keeps its refusal. `mainCheckoutIntake` takes the first line only when the record's `HEAD` or `bare` line follows. `refStorageBackend` reads Git's exit 1 for an absent key as the files backend and throws on any other failure. The `fsck` fallback retries only on exit 129. `isolatedGitEnvironment` gives a fixture a home of its own and still names `GIT_CONFIG_GLOBAL` for a Git that reads it.

Standing documents. The kit guide's first steps replace the floor's sentences with the present floor, what it rests on and the instance's route, and its section on what runs here links [D010](../../evidence/WO-260/decisions.md#wo-260-d010--the-git-floor-is-git-2310-and-wo-258-d009-is-superseded) and gains the core-only row. Product 07's structural paragraph now states core's seventh task and that a Git below the floor puts `host` first. Each is a replacement in the affected paragraph with its decision linked; neither adds a dated account. Product 07 line 2190 recounts the floor WO-258 declared, as the planning pass wrote it, and states no current floor.

Expected data and generated surfaces. Each changed expectation has its cause in the decisions: the floor case and the release case (the order's step 9, D005 and D010), the stash message (D017), the handoff fixture's structural list (D021), the helper-reuse entry (D023) and the export assertion (D011). The seventeen changed files of the installed harness differ only in digests, snapshot paths and the skeleton's version. The feedback edition is the live episode's ([D015](../../evidence/WO-260/decisions.md#wo-260-d015--the-feedback-edition-is-re-minted-from-one-live-self-host-episode)), and the console fixtures follow it. The authority edition carries WO-259's transcript by reference under this order; no decision named that re-mint, and its cause is the one the order's Cost line states, two registered evidence sources changed.

The order's evidence gate lists a status reading filed after implementation-ready. [D024](../../evidence/WO-260/decisions.md#wo-260-d024--the-status-after-implementation-ready-is-read-and-reported-not-filed) reports it instead of filing it; the transition is in the control log this review read, and no criterion names the file, so the reading stands.

## Findings

**F1, follow-up, escape. The surface check does not read the script files the kit carries under `corpus/`.** `readGitSurface` lists the files under `scripts/` and `packages/`. The kit also carries six script files as test support (`TEST_SUPPORT_FILES` in `scripts/launchpad.mjs`), and two of them call Git. Read with the check's own reader, the six name thirteen forms: twelve are recorded, and `apply --unidiff-zero` is not. Git 2.31.0's manual documents that option, so the candidate names nothing above the floor there. What stays open is the gate: a newer form added to one of those files would pass core's check and reach an instance, and the kit guide's sentence that each form the kit's scripts and tests name is recorded overstates the record by that one form. Criterion 4's four clauses hold, and `main` had no check, so this is a follow-up. It is an escape: the two directories were in the verified subject and inside each verification's scope. [D039](../../evidence/WO-260/decisions.md#wo-260-d039--the-surface-check-does-not-read-the-kits-corpus-scripts-boarded) boards it as FUP-0c05d0b507dcd53f; the guide is left as the complete run judged it, for the reason given under Integration and identity.

**F2, follow-up, escape. The `fsck` fallback's stated premise is wider than Git's record.** The comment over the call, the note of the scoped `fsck --no-references` entry and D008 say that a Git lacking the option checks no reference database. Git 2.48.0's release notes say `git fsck` learned to warn on curiously formatted ref contents, and the planning record dates the option to Git 2.50. So on Git 2.48 and 2.49 at least, `fsck` checks references and cannot be told to skip it; there the fallback also checks the shared reference database and can refuse a sound candidate on it. That fails closed, `main` refused every candidate on those Gits, and at the floor the premise holds: Git 2.31.0's manual uses references as heads only when no object is given. No criterion names those versions. It is an escape for the same reason as F1. [D040](../../evidence/WO-260/decisions.md#wo-260-d040--the-fsck-fallbacks-premise-is-wider-than-gits-record-boarded) boards it as FUP-7fe71f232887391b: the comment is in a judged feedback source and the note in the recorded surface file, so correcting either would move the identity for a wording change.

<!-- dotln-findings:start -->
[
  {
    "id": "F1",
    "route": "follow-up",
    "class": "escape",
    "summary": "The Git surface check lists scripts/ and packages/ only, so the six script files the kit carries under corpus/ are unread; their forms are at or below the floor and one, apply --unidiff-zero, is unrecorded."
  },
  {
    "id": "F2",
    "route": "follow-up",
    "class": "escape",
    "summary": "The fsck fallback's comment and record note say a Git without --no-references checks no references, which does not hold for Git 2.48 and 2.49, where the fallback also checks the shared references."
  }
]
<!-- dotln-findings:end -->

## Criterion judgments

**Criterion 1:** met. `npm test -- --only runner-fixtures` stands on the complete row, which ran the suite fresh with exit 0. The fourteen cases of `scripts/test-git-floor.mjs` passed again here. The first shows the stand-in Git refusing `check-attr --source`, `ls-tree --format`, `worktree list -z` and `fsck --no-references` with exit 129 and Git's words, echoing `rev-parse --show-ref-format`, and reading neither configuration variable. With it first on the path, `gateCodeIdentity` at a revision equals the host Git's and the clean tree's; `readTrackedTextAtHead` returns committed bytes and refuses an untracked, linked or absent path; the two record readers and the planning base check accept a regular blob and refuse a 100755 one; the main-intake grant resolves from a linked worktree; `dropInventoriedStash` reads a files backend and drops the entry; `verify` admits a sound candidate; and neither the probe's Git, its payload's push nor its launched harness's Git children read a setting planted in a home the case stands in for the real one.

**Criterion 2:** met. `package.json` declares `engines.git` `>=2.31.0`. Under a Git whose version line is spoofed, `node scripts/harness.mjs check` and the `host` task's own command admit `git version 2.31.0` and `git version 2.31.0.windows.1` and exit 1 on `git version 2.30.9`, naming `>=2.31.0` and `2.30.9`. The `npm test -- --only host` form of the clause stands on the executor's exact-command record over sources unchanged since, and on the complete row's `host` task and floor case.

**Criterion 3:** met. `bash scripts/test-release.sh --case git_floor` passed here: a release close's dry run under a Git that rejects `check-attr --source` writes its manifest with the reviewed code identity, and a failing `check-attr` still stops the close as the host's runtime.

**Criterion 4:** met. `node scripts/structural-checks.mjs git-surface` exits 0 on the candidate. In the fixture tree of the floor cases a script that gains `ls-tree --format` makes it exit 1 naming the pair with `scripts/tool.mjs:3`, and a record floor of `>=2.40.0` beside `engines.git` `>=2.31.0` makes it exit 1 naming both. The export case passed here and asserts the exported kit's lists name no `git-surface`. Both earlier blockers reproduce as repaired. F1 concerns files outside the directories the criterion's check reads and none of its clauses.

**Criterion 5:** met through its stated fallback. No Git 2.31.0 binary ran. A bounded inventory here finds Git 2.55.0 first on the path, Apple's 2.50.1 and 2.54.0, Homebrew's cellar holding 2.55.0 only, and an earlier session's scratch holding Git 2.31.0's manual text with no binary; it is not an exhaustive disk search. The handoff says the host holds none and names the denial ([D013](../../evidence/WO-260/decisions.md#wo-260-d013--no-real-git-2310-ran-here-criterion-5s-fallback-applies)), and criterion 1's evidence stands as the fallback the criterion names. Behavior only a real binary shows, the `core.fsmonitor=false` reading included, stays untested here.

**Criterion 6:** met. The kit guide's first steps state the floor as Git 2.31.0, the two forms it rests on, and that an instance on an older Git lowers `engines.git` in its own `package.json` and reports what failed; its section on what runs here links D010, and the anchor resolves. The named search prints only product 07 line 2190, a recounting that states no current floor, and a wider search of the README, the kit's templates and both skill roots finds none. `npm run test:docs` stands on the row this review ran after its last document edit.

**Criterion 7:** met. `npm test -- --review` passed at this identity: the row of 2026-11-09T19:40:41.414Z, 46 suites and 122 tasks, all executed, which the integration left current. The review selection covers the plain `npm test` selection. `npm run test:docs` passed for the candidate tree after this review's last document edit, and the result transition consumes both rows.

## Follow-ups and the register

Five follow-ups leave with this order. Two are this review's: FUP-0c05d0b507dcd53f (F1, D039) and FUP-7fe71f232887391b (F2, D040). Three were already boarded: FUP-d7ca8a89d9313a2b, whether an existing parser should read the shell shapes the regular expressions leave out (D027); FUP-0122789e67993b48, the shorthand property (D037); and FUP-c052a580e9f69291, the rule that a fix answers a verification failure in proportion, carried to WO-262 (D028). All five are the planning pass's to triage.

`npm run plan -- followups --touching` listed 30 of 275 pending rows before this review's two. One was disposed and the rest left as matched ([D041](../../evidence/WO-260/decisions.md#wo-260-d041--one-register-row-is-deferred-again-with-its-condition-named)). FUP-1fa649b8d330505b is deferred again because its condition occurred a fourth time: this order's first complete run failed on a fixture's hand-written list of the six structural tasks that the consistency reviews had not traced ([D021](../../evidence/WO-260/decisions.md#wo-260-d021--the-first-complete-run-failed-on-a-fixture-that-pinned-six-structural-tasks-repaired)).

## Release surfaces

Release: patch, v0.122.1 above v0.122.0 ([D014](../../evidence/WO-260/decisions.md#wo-260-d014)); `@dotln/skeleton` 0.89.0 to 0.90.0 for the three skeleton sources the order changed, with the console's pin and the lockfile. [PR.md](PR.md) holds the reviewed body and [RELEASE-NOTES.md](RELEASE-NOTES.md) the five sections. Publication on this pass commits the reviewed state, pushes `wo-260` and opens its pull request; it merges nothing.

## Process corrections

Five corrections were in this review's own apparatus and none is a product finding; the [observation record](../../evidence/WO-260/final-review-001.json) keeps them. One read-only search held an unquoted pattern that matched no file, so the shell ran none of it, and it was repeated with the pattern quoted. A first look for Git 2.31.0's source in an earlier session's scratch found only the manual text, so the two manual readings cited here come from that text and no source reading is claimed. The corpus probe first ran from session scratch with a plain temporary directory; the filed probe uses the repository's fixture-root helper and ran again from its committed path. The first release surface check failed on this review's release notes, where a command written with an angle-bracket placeholder reads as raw HTML; the placeholder was removed there and in the pull-request body before the check passed. And a check of generated artifacts was first asked of `npm run sync` with a flag it does not take; it printed its usage and changed nothing.

## Outcome

The outcome matches the dispatch: an acceptance judgment at the tested identity, with the integration, the release surfaces and the register settled. Every criterion holds on evidence run or consumed here. The two defects the review met are reproduced, decided and boarded with their reopening conditions; neither is left as a sentence in this report alone. What no session here can show is a real Git 2.31.0, and the report says so wherever a claim would otherwise reach past the stand-in.
