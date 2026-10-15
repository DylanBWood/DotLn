# WO-210 — FINAL-003

**Verdict:** pass. All twenty-eight criteria hold at the integrated subject, code identity `0c0748d762645dd71479a88a61bfd0ea76cc648c295d16efeb993af54a4b9b11`, the identity [VER-005](../../verifications/WO-210/VER-005.md) judged and the executor's fresh `npm test -- --review` row passed; integration took in nothing ([D041](../../evidence/WO-210/decisions.md#wo-210-d041--final-review-the-third-integration-took-in-nothing-every-acceptance-claim-carried-forward)). FINAL-002's blocking F1 is repaired at its cause, and VER-005 probed the repair in both close modes. Three read-only reviewers compared the fourth repair's lifecycle and text code and the whole subject's core release path with `main`; they found no regression of a behavior `main` had in a route the product supports. Six low follow-ups are boarded with their repair rules ([D042](../../evidence/WO-210/decisions.md#wo-210-d042--final-review-pass-final-003-six-low-follow-ups-boarded-none-breaks-a-behavior-main-had)); none breaks a criterion.

Reviewer: Claude Code 2.1.300 (`claude --version`), model `claude-opus-5-5`, effort max from the `CLAUDE_EFFORT` session readback (selected, not effective). The order recommends xhigh for the reviewer; the operator selected max for this session, and the attestation records the selected value. No USD cap was enforced and dollar cost is unknown.

Subagent plan, stated before the first spawn: at most four of the `subagentCap` of 20, three read-only `dotln-worker` reviewers and one refuter. The reviewers covered the close, records, gate and resume code; the lint, body, discovery, lineage and seed code with the README; and the core release path. The refuter was not spawned: midway through the review the operator directed the review back to its outcome, and each item's route followed from the reviewers' probes, one Git guard probe and the Design's text. The usage readback observed 3 admissions against the cap (exact-observed, 17 remaining). The workers' own counters, which the session counter does not include, add 883,161 tokens over 333 tool uses (309,491, 279,307 and 294,363).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.300","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}
**Process cost:** entry 92740 tokens; handoff 32985582 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 7e08a254-56fd-4332-b23c-cf7820c7c53f`. Entry was observed at 2026-10-15T12:55:40.505Z; handoff was observed at 2026-10-15T13:33:31.865Z after 146 steps and 103 commands, after the integration, the affected checks, the three reviewers, the Git guard probe, D041, D042, the release surfaces and the draft of this report, and before the document gate, the composed review gate and the result transition; it counts 32,398,472 cached input, 438,599 cache-write, 250 uncached input and 148,261 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context; reasoning tokens and dollar cost are unavailable. Final counters after the result transition stay in the ignored receipts and the response. Tradeoff: the review gate composes its row from the executor's fresh tasks at the unchanged identity instead of rerunning forty-three minutes of passing work, and the reviewers attacked the fourth repair's diff and the core path rather than re-reading paths four verifications and two reviews had judged.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-210/FINAL-003.md`.

Read: the order whole, with its Design, execution plan, criteria, known issues, non-goals and operator-review assumptions; VER-005 whole and the verdicts and findings of VER-001 to VER-004, FINAL-001 and FINAL-002; D034 to D041 and FINAL-002's basis for each finding; the handoff's criterion lines and its fourth-repair section; the control log; product 07 §Verification review and attack, §Independent workflows and integration and the Adjacent Repair passage; product 08 §PRs and commits and §Release-note edition; the four reader profiles and their balanced examples; planning receipt 045's WO-210 judgment.

Reviewed: the fourth repair's implementation diff against FINAL-002's checkpoint (`refs/dotln/checkpoint/WO-210/22` to `/28`) in the close, Git, Finder-metadata, resume, target-worktree, gate, ledger, queue, lineage and launchpad modules, and its product 07 hunks; the three reviewers covered the rest of that diff and the whole subject's core paths against `main`. The order's own report and finding labels appear nowhere in code.

Integration: `npm run worktree -- integrate WO-210` found `main` and `origin/main` at the base (`3b5e29e4`, the v0.81.0 release). It checkpointed the work (`refs/dotln/checkpoint/WO-210/28`), retained its named stash `e5573469…`, needed no intake backup, and regenerated projections only. `gateCodeIdentity` reads `0c0748d7…` before and after. No component version collides: local tags end at v0.81.0, and `check-surfaces --local` reports the release block v0.82.0 over v0.81.0 with every component's source unchanged. No registered evidence source changes, so no re-mint and no live episode is owed.

Lenses: regressions of behavior `main` had, because FINAL-001 and FINAL-002 each failed on one and the fourth repair changed shared helpers (`scripts/lib/git.mjs`, `scripts/resume.mjs`, the starter refresh's redaction); the repair rules D036 and D038 stated for FINAL-002's findings; and the core path this order's own publication and release close take after merge.

Disclosure: instruments under review also recorded this work. `scripts/worktree.mjs` ran the integration, `scripts/release.mjs` the surface check, `scripts/work-orders.mjs` the index and `scripts/resume.mjs` records this result. Each was also judged directly: the reviewers ran both trees' modules on scratch repositories and the real control corpus.

## Known issues and the ideation receipt

- No ideation receipt exists: `docs/evidence/WO-210/` holds no `ideation.md`. The nomination provenance is the [2026-10-13 standard planning pass](../../planning/standard-pass-2026-10-13.md) §4, §5 and §12, judged in [planning receipt 045](../../planning/refutations/2026-10-13-planning-4f74762e1dd466b6-045.md) as aligned with three known issues.
- **Receipt 045, criterion 17 (role text names launchpad `npm test` until WO-192):** not occurred; no live target order has run, and the target briefings, pass message and refusal hints now print every command in the launchpad-qualified form.
- **Receipt 045, criterion 18 (a squash or rebase merge leaves the records commit unreachable):** not occurred; a non-goal that the playbook, the client README and the release notes state.
- **Receipt 045, criterion 24 (suite growth):** recorded, not bounded. In the fourth repair's fresh row, `target-worktree` took 437.4 s and `launchpad-planning` 170.5 s of task time, against 27.8 s and 33.2 s before this order. `launchpad` took 691.0 s, and wall time was 2,552.1 s. The judgment stays with planning as FUP-92711a92e1d05874 ([D013](../../evidence/WO-210/decisions.md#wo-210-d013--verification-the-target-suites-growth-recorded-for-the-planning-receipts-criterion24-condition)); no case was dropped.
- **Allocated follow-ups:** FUP-a065bc5b99e40660, FUP-3cceac0fff2dba94, FUP-a272d577fd351b43, FUP-00b15d92d53011b2 and FUP-a5c6ac8cb40bd52a stay settled (D010, D023). FUP-06de60fa5d19fe5a stays deferred as the order's explicit non-goal.
- **The order's other known issues** are not occurred:
  - no live target run;
  - no self release close in an export;
  - records not re-gated;
  - no namespace for record paths;
  - the private-path screen is WO-213's;
  - the resident's class checks.
- **Depends on:** WO-072, WO-201, WO-202, WO-064, WO-066 and WO-118, all closed; status reports each met.

## Earlier findings

- **VER-001 to VER-004 and FINAL-001:** settled as FINAL-002 recorded; carried on unchanged paths.
- **FINAL-002 F1: repaired** ([D036](../../evidence/WO-210/decisions.md#wo-210-d036--repair-the-closes-base-checkout-selection-and-fifteen-boarded-follow-ups-defer-three-new-scope-findings)). An entry counts as the base checkout only while its directory holds this clone's checkout of the base. Under any other entry the close never moves the branch: it closes when no move is needed and otherwise refuses naming the entry and its remedy. VER-005 probed a moved locked checkout in both modes, and the lifecycle reviewer's matrix closes every stale kind when the base is synced, as `main` did.
- **FINAL-002 F2 to F15 and F17: repaired** (D036, [D038](../../evidence/WO-210/decisions.md#wo-210-d038--refuse-by-path-a-seed-copy-the-refresh-cannot-complete-with-reopen-d028s-never-blocks-reading)). The lifecycle reviewer confirmed F5, F6, F7 and F15 at their lines. The text reviewer confirmed:
  - F2 to F4 by running the lineage step in a fork of the refreshed starter;
  - F8 and F10 on a v0.81.0 export;
  - F12, F13 and F17 over every named form;
  - F14 on the installed CLIs' real help.
- **F16, F18 and F19:** deferred to planning (D036, FUP-69bd004155a6ec30).
- **VER-005 F1 (the README's pre-restoration status check): boarded** ([D040](../../evidence/WO-210/decisions.md#wo-210-d040--verification-board-the-pre-restoration-status-instruction), FUP-fd6bb22a13e561e4). VER-005's two process failures are recorded in [D039](../../evidence/WO-210/decisions.md#wo-210-d039--verification-meta-failures-excessive-context-consumption-and-omitted-logging-commitment).

## Criterion judgments

**Criterion 1:** met — the baseline probe and D001 hold every pre-change non-PASS line with its cause; the export case asserts no FAIL line after the change (consumed gate), and VER-005 P2 passed the surfaces on v0.81.0's recovered order.

**Criterion 2:** met — `license-fixtures` covers the absent pins in the work tree and at a revision, declared, pinless and symlinked files and unchanged non-kit lines (consumed gate); the core reviewer found `licenseSurfaceRules` identical on both trees in core.

**Criterion 3:** met — the export prepares `v0.1.0` from the seeds, passes both surface reads, declares core's pins and asserts the zero-marker remedy (consumed gate; VER-005 P2).

**Criterion 4:** met — the export closes the versionless WO-002 with its no-release line and both refusals; the core reviewer's 64 `releaseBlockRule` cases match `main` for self orders (consumed gate).

**Criterion 5:** met — the kit carries the template byte-identical, `previewReleaseManifest` returns `v0.1.0` with core's schema version, and D002 lists close's later reads (consumed gate).

**Criterion 6:** met — the kit goal standard composes the rule blocks and purpose with its refusals in the export; the core reviewer rebuilt all 45 historical refutation subject hashes identically on both trees, and §Goal-aligned decisions is byte-identical to `main`.

**Criterion 7:** met — the two rows carry no `kit:` line and the export and runner cases name rows that stay core-only (consumed gate); the core reviewer found the core selection otherwise unchanged.

**Criterion 8:** met — the seven forms refuse with spans in every kind and the generator's sentences pass; the readiness table and `deliverableReady` hash identically at checkpoints 22 and 28. Across 2,479 lint runs over every published body and commit, non-runtime findings are identical on both trees (consumed gate; text reviewer).

**Criterion 9:** met — `targetChangeSection` is exported and the pinned episode-body part passes unchanged (consumed gate).

**Criterion 10:** met — both launchpad routes bind `targetSubject` and `targetGate` with every refusal and fold check; the refusal lists entries without porcelain prefixes and renames whole (consumed gate; lifecycle reviewer).

**Criterion 11:** met — the publication matrix covers every refusal, including a grant or profile committed on the order branch alone, before any remote call; it pushes exactly the records commit with an idempotent rerun (consumed gate).

**Criterion 12:** met — the close lists `deps/` once with the exact remedy, retries after removal, and refuses dirty, divergent and failed-fetch bases with refs unchanged. The lifecycle reviewer's matrix shows the subject closing every state `main` closed except the refusals the Design names, plus F1 below, whose refusal is the Design's own fetch route (consumed gate; lifecycle reviewer; Git guard probe).

**Criterion 13:** met — the route case gates, reviews, records, publishes, merges both branches and lets release close fetch and fast-forward the base itself, with no tag (consumed gate).

**Criterion 14:** met — the one export drives WO-002 through both publications without notes or a launchpad row, keeps WO-001's notes refusal, closes `no-release` and shows the index links (consumed gate).

**Criterion 15:** met — the configuration suite covers the gate and root schema, refusals and paths; target briefings print every command launchpad-qualified, and self briefings are byte-identical, since `briefingCommands` and `targetBriefing` return a self order's text unchanged (consumed gate; lifecycle and core reviewers).

**Criterion 16:** met — the runner records per-command and selection rows, failing on a non-zero exit, a timeout or a mutation and refusing an undeclared gate (consumed gate).

**Criterion 17:** met — target claims stand only on target rows, and a malformed index refuses by name with the rerun; self claims are unchanged and never touch the target gate (consumed gate; lifecycle and core reviewers).

**Criterion 18:** met — `target-records` writes and commits the set with hashes and fold checks; it stays legal while a receipt or moved source remains and names the rerun (consumed gate; VER-005 P1; lifecycle reviewer).

**Criterion 19:** met — the records branch publishes on unchanged code identity, or with the reviewer row when the identity changed, and refuses without the event or with a moved path; a self order keeps its row and notes, and the core reviewer found the self publish's refusals unchanged in content (consumed gate).

**Criterion 20:** met — the card names the repository, the records commit and each record path with ordinals, and no local decisions link (consumed gate).

**Criterion 21:** met — the planning publication commits, pushes, opens, logs, cleans up and refuses before any remote call as listed (consumed gate).

**Criterion 22:** met — the manifest-listed README states the release, planning, target and selection content the criterion lists; VER-005 F1's sequencing note is outside the required statements.

**Criterion 23:** met — the write-backs are in place; the fourth repair's product 07 hunks state the base-checkout and update rules the code holds; the locks are current, and §Goal-aligned decisions is unedited.

**Criterion 24:** met — the executor's fresh review row at this identity passed (44 suite results, 100 fresh tasks, 2,552.1 s). This review's composed row and document gate are under Executed checks. `git diff --check` is clean, and the package manifests and lockfile equal `main`'s. No re-mint or live episode is owed.

**Criterion 25:** met — Finder metadata is disposable at both routes. Tracked changes, non-regular metadata and unrelated material still refuse, and an unreadable or unsearchable non-ignored directory refuses by relative path (consumed gate; VER-005 P4).

**Criterion 26:** met — the seed planner rewrites only proven copies; the text reviewer's v0.81.0 export refreshed its README and first-order seed, then reported current. Customized working copies of unchanged templates publish, while copies the refresh could not use refuse by path (D038; consumed gate).

**Criterion 27:** met — the v0.81.0 case runs v0.81.0's own runtime through the update and recovery with every record intact and the surfaces passing (consumed gate; VER-005 P2).

**Criterion 28:** met — the README assigns update and recovery to the instance's sessions, and the operator types phrases and merges pull requests.

## Findings

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "With a gone worktree entry holding a clone base that already contains the order branch and origin's base moved on, the close refuses where main's close, which never fetched, closed; D036's 'loses nothing main closed' is wrong for this state"},
  {"id": "F2", "route": "follow-up", "class": "escape", "summary": "The publishing close moves an unchecked-out base with update-ref, skipping Git's guard for a worktree that is rebasing it"},
  {"id": "F3", "route": "follow-up", "class": "escape", "summary": "A stale writer-transition lock refuses the close naming an absolute temporary path and no rerun command"},
  {"id": "F4", "route": "follow-up", "class": "escape", "summary": "The shared path redaction no longer masks a local path inside a file:// URL or after a colon in starter refresh's quoted Git text"},
  {"id": "F5", "route": "follow-up", "class": "escape", "summary": "The unmerged-branch close refusal quotes Git's command line and names no condition or rerun command"},
  {"id": "F6", "route": "follow-up", "class": "escape", "summary": "The body lint's rendered view overflows the call stack on a single code block of about 124,500 characters or more"}
]
<!-- dotln-findings:end -->

None is blocking. No finding leaves a criterion unmet, and none breaks a behavior `main` had in a route the product supports:

- **F1 (lifecycle reviewer A1)** is the Design's own route. The Design moves an unchecked-out base with `git fetch origin <base>:<base>`, and Git refuses that fetch while any registered entry holds the branch. I reproduced the refusal in a scratch clone: `fatal: refusing to fetch into branch 'refs/heads/main' checked out at '<scratch>/held'`, exit 128. So the named refusal with its remedy is the designed outcome; the error is D036's rationale sentence, corrected in D042.
- **F2, F3 and F5** concern new close behavior, which `main` did not have.
- **F4** needs a `file://` URL rewrite on a push that goes to a GitHub URL, and it prints only locally.
- **F6** needs a code block no published body approaches.

Each is reproduced by the reviewers' probes named in D042. Each is boarded there with its repair rule for the next order that edits these files. All six were present in the verified subject, so they are classed `escape`.

## Register

`npm run plan -- followups --touching --work-order WO-210` matched 57 pending rows of 261 at revision `1ec3f27c…`, read over seven pages. Since FINAL-002, the fourth repair settled FUP-5682890b65853e70 (D033's README sentence) and FUP-92963ad2ed30089d (D035). It minted FUP-69bd004155a6ec30 (D036) and reopened FUP-13d9674e38ef3b49 (D028, through D038). VER-005 minted FUP-b3c1a8260bca40b7 (D039) and FUP-fd6bb22a13e561e4 (D040). Each is this order's own row, left for planning with its recorded condition.

- **FUP-2518166a22767f47** (gate suites inherit `DOTLN_LAUNCHPAD`) is closer to its condition: target briefings now print the document gate in the `DOTLN_LAUNCHPAD=… node …/test-runner.mjs --document` form. But the condition did not occur. The one document suite that would act outside its fixture under that variable, `resume`, is core-only. Core registers no repository, since it has no `dotln.config.json`. The suites a kit carries act on the launchpad itself or set their own variable.
- **The other 50 matched rows** are textual matches whose seams this change did not open and whose conditions did not occur, as FINAL-002 judged them.

No register batch was applied. After D042 was recorded, `npm run meta` minted FUP-0674090dc3c1e64d for its six follow-ups, untriaged for the next order that edits those files. It also reported two standing reopen candidates, WO-150-D003 (executor cold-start bytes 28,112, Δ 0) and shifting-the-burden-to-the-intervenor (five corrections and nine directions on this order); neither count is used for a decision here.

## Observations (not findings)

- **Core path (core reviewer):**
  - the self publish now reads the reviewer gate before the sign-off and `gh` checks, so the first refusal reported changes when both fail;
  - the review selection's machinery sources only grow;
  - `main`'s register check calls the new register stale, by D008's design;
  - starter refresh's scan now refuses a non-regular `.DS_Store` or an unreadable non-ignored directory in the starter checkout, which criterion 25 and D029 intend;
  - `main`'s fold refuses the new `TargetRecordsCommitted` event type, which only target segments carry.
- **Lifecycle reviewer's variants U and W:** a base checkout the close cannot inspect, and a base checkout holding a DotLn writer reservation, each refuse where `main` never touched the base. Both are refusals the Design implies once the close mutates the base.

## Release surfaces

`PR.md` and `RELEASE-NOTES.md` are rewritten from FINAL-002's drafts for:

- the fourth repair, VER-005 and this review;
- the base-checkout, seed-copy, lint, discovery and lineage rules;
- the current gate figures;
- the deferred items.

Both pass the GitHub body profile in `check-surfaces --local`. Every relative link resolves against the stored files. Release preparation keeps `v0.82.0` under the minor classification with no component bump and no dependency change.

Proposed title: `:sparkles: Exported instances can now publish and release their own orders, including orders that change a registered repository`.

## Executed checks

Checks ran under `node scripts/harness.mjs bounded`, one process at a time, where noted. Times are 2026-10-15 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage` at entry (not bounded) | 12:55:40 | 0 | 92,740 tokens, 0 subagents |
| `npm run worktree -- integrate WO-210` (not bounded) | 12:58 | 0 | no-op merge; checkpoint `refs/dotln/checkpoint/WO-210/28`; stash `e5573469…` retained; D041 stub |
| `gateCodeIdentity`; gate rows at it; full-tree comparison with the checkpoint (not bounded) | 12:59 | 0 | `0c0748d7…` before and after; the executor's review row and the document rows; only the stub, meter, PR meter and index row changed |
| Bounded: `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local`, `node scripts/lineage.mjs index --check`, `node scripts/work-orders.mjs index --check`, `node scripts/siblings.mjs index --check`, `node scripts/check-publication.mjs --print-locks`, `npm run format:check`, `git diff --check`, `git diff --cached --check` | 13:03:44–13:03:56 | 0 each | 255/255 headings and both editions current; 34 surfaces; 57 PASS and no FAIL with v0.82.0 over v0.81.0; 172 sections; indexes, registry and locks current; formatted; clean |
| Register listing, seven pages (not bounded) | 13:12 | 0 | 57 matched of 261 pending |
| Three read-only `dotln-worker` reviewers, probes bounded in their scratch | 13:02–13:24 | 0 | lifecycle 5 items (309,491 tokens, 22.0 min); text 1 item (279,307 tokens, 20.6 min); core 0 items and 5 observations (294,363 tokens, 21.5 min) |
| Git guard probe in the session scratch (not bounded) | 13:29 | 0 | fetch into a branch a prunable entry holds: exit 128, refused |
| `node scripts/harness.mjs usage` at handoff (not bounded) | 13:33:31 | 0 | 32,985,582 tokens; 3 subagents observed, 17 remaining |
| `npm run meta` (not bounded) | 13:33 | 0 | D041 and D042 indexed; FUP-0674090dc3c1e64d minted for D042; two standing reopen candidates reported |
| `npm run format`; `npm run test:docs` (not bounded) | 13:34:04–13:35:56 | 0 | 35 passed, 0 failed, 110.43 s, 35 fresh tasks; recorded 2026-10-15T13:35:56.156Z at `0c0748d7…` |
| `npm test -- --review` (not bounded) | 13:36:01–13:36:11 | 0 | 44 suite results, 0 failed, 7.69 s; composed: one fresh task (`format`, the always-fresh preflight) and 99 reused from the executor's fresh row of 12:18:59.814Z at the same identity; `identityUnchanged` and `buildOutputUnchanged`; recorded 2026-10-15T13:36:11.852Z, evidence `host-gate:0c0748d7…:npm test` |
| These rows filled; `npm run format`; the result transition with its inline document gate (not bounded) | 13:37– | – | recorded after this table's last edit |

Repository writes: this report; D041's completion and D042; `PR.md` and `RELEASE-NOTES.md`; and the regenerated projections, indexes, locks and meter that the integration, `npm run meta` and the result transition produced. No behavioral source was edited. Probes and logs stayed in the session scratch.

## Goal alignment

- **Traps:**
  - treating every function-level difference from `main` as a regression without asking whether a supported route reaches it;
  - waving A1 through on the order's momentum instead of checking whether the Design itself refuses there;
  - spending a refuter pass on items the evidence already routes;
  - rerunning a forty-three-minute gate at an unchanged identity;
  - writing a behavioral fix and certifying it.
- **NoOp:** failing the order a third time for six low items would buy a fifth repair cycle for defects no supported route reaches, while the fork's work waits on this release.
- **Outcome:** matched. The criteria were judged from the consumed gate, VER-005's probes and the reviewers' comparisons with `main`, and the one candidate regression was settled by a direct Git probe against the Design's text. The six items are boarded with repair rules, and the order passes.
