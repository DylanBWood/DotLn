# WO-277 handoff

WO-277, the starter's commands page for a person, on branch `wo-277` over
`main` at `b8591a730`. This handoff covers the implementation, handed off at
07:33 UTC on 2026-11-15, and its repair after
[VER-001](../../verifications/WO-277/VER-001.md), dispatched with `resume:
fix` at 14:59 UTC. Main has not moved (`git ls-remote origin
refs/heads/main` read `b8591a730770`, the merge base, at 06:33, 15:42 and
16:53 UTC), so nothing was integrated. Release target v1.0.1, a patch
([D001](decisions.md#wo-277-d001)); the repair's release preparation kept it
and changed only [meta.json](meta.json); no package version changes. Handoff
code identity `274d9bc7d57447f31227fc7a69cd769fb91065e4124205e4eb4bc2b389a4275e`,
the implementation's: the repair changed files under `docs/` alone, which
the identity leaves out. The decisions are D001 to D019 in
[decisions.md](decisions.md); D011 to D013 are the verifier's. The branch
holds no commit: it commits at final review.

Things for the verifier, the final reviewer and the operator to read first.

- The repair (§The repair of VER-001): the status capture's two location
  fields now read `<worktree>`, and the release step's paragraph gained a
  second recovery, for a file this instance deleted. The page changed in that
  one paragraph and nowhere else.
- The page says something the order's premise does not. The order and the
  2026-11-14 pass's section say every publish refuses without the private
  terms list. Read in the code, three do and an order's own publish does not:
  it prints that the files its branch changes were not screened and goes on.
  The page and the guide say that
  ([D003](decisions.md#wo-277-d003--what-the-page-says-of-an-absent-terms-list-is-what-each-publish-does-and-the-guides-sentence-beside-the-new-block-is-corrected-to-it)).
- The implementation added a test case the order's non-goals bar, and took it
  out on the meta critic's first point. The one test edit that remains is the
  front page seed's pinned hash, which the seed's change requires
  ([D009](decisions.md#wo-277-d009--round-2-confirms-every-fix-and-admits-nothing-the-first-critics-three-points-are-accepted-and-the-case-added-under-d004-comes-out),
  [D008](decisions.md#wo-277-d008--the-front-page-seeds-migration-an-unedited-front-page-takes-the-new-one-a-front-page-that-is-its-owners-is-kept-and-what-the-releases-read-before-upgrading-says)).
- Messages the executor wrote to the operator between tool calls are not in
  the host's transcript when they are longer than a short line, the notice
  that the account's mail address is in the transcript among them
  ([D010](decisions.md#wo-277-d010--correction-messages-the-executor-wrote-to-the-operator-between-tool-calls-are-not-in-the-hosts-transcript-the-notice-of-the-accounts-address-among-them)).

## The repair of VER-001

[VER-001](../../verifications/WO-277/VER-001.md) judged criteria 1 to 3 met
and failed criterion 4 on one blocking finding, F2, with a second finding,
F1, routed to a follow-up.

- **F2, the status capture's home paths**
  ([D014](decisions.md#wo-277-d014--the-repair-of-ver-001-the-status-capture-names-its-locations-by-the-kits-placeholder-and-every-line-this-order-writes-is-read-for-a-home-directory)).
  The capture of `npm run resume -- status --json` that the order's Evidence
  gate asks for held this worktree's absolute home path in `route.cwd` and
  `route.launchpad`, which the document gate refuses in a record. Both now
  read `<worktree>`, the kit's placeholder for the worktree root. Every other
  field is the capture's own, and the capture as first written stays in the
  local recovery refs `refs/dotln/checkpoint/WO-277/3` to `5`. The rule the
  repair holds: no line this order writes names a place on this machine by
  its home directory. [home-paths.mjs](repair-001/home-paths.mjs) reads that
  rule over every line this order adds, beyond the two lines the report
  quoted: with the gate's own rule for the file's type, then whatever the
  type (the scripts the gate's record rule does not read among them), then
  for the account's name alone. Its last run, after this file's last edit, is
  [home-paths.json](repair-001/home-paths.json). The capture escaped because
  it was written after the document gate's run; nothing in this directory is
  written after this repair's gate. That the completion and the gate do not
  read such lines themselves is a follow-up (`FUP-84e1fe3a9001289c`).
- **F1, a file this instance deleted**
  ([D015](decisions.md#wo-277-d015--ver-001s-f1-is-repaired-here-a-file-this-instance-deleted-is-kept-deleted-with-git-rm-read-against-the-publishs-own-judgment)).
  The release step told a person to keep this instance's side of every
  `both changed:` file with `git checkout main -- <path>`, which fails for a
  file this instance deleted. It is repaired here as adjacent work: where
  that checkout says the path did not match any file known to Git, `git rm
  <path>` keeps the file deleted.
  [deleted-file-recovery.mjs](repair-001/deleted-file-recovery.mjs) follows
  the paragraph in a synthetic history and holds the publish's own judgment
  of the update's merge to it
  ([its results](repair-001/deleted-file-recovery.json)). D012's follow-up
  keeps its row, `FUP-3285bd4a53c4c3e9`, which D015 reopens with the page's
  half done and the preview's half left to WO-282.
- **The queue**
  ([D016](decisions.md#wo-277-d016--correction-f1s-queue-item-was-recorded-after-its-edit)).
  F1's item, `adjacent-0002`, was queued after its edit. It was then
  announced, checked in and started, and its three checks were run again
  before it was completed.
- **The review**
  ([D017](decisions.md#wo-277-d017--the-repairs-one-combined-review-no-blocking-finding-d014s-stale-count-is-corrected-and-a-renamed-file-is-recorded-with-a-follow-up)).
  One combined review found no blocking finding. D014's stale count of lines
  is corrected; a file this instance renamed and the starter changed is
  recorded with a follow-up (`FUP-ed709688ea483bd1`) and its reproduction,
  [rename-note.mjs](repair-001/rename-note.mjs): the page's recovery meets two
  no-match errors there, and the update's code keeps the starter's change in
  the renamed file.
- **The complete run**
  ([D018](decisions.md#wo-277-d018--the-repairs-complete-run-reused-the-suites-that-read-the-page-so-it-is-run-again-in-full)).
  The first complete run of the repair reused the suites that read the page
  from the implementation's row, because the code identity leaves `docs/`
  out. It was run again in full with `--again`; the reuse is a follow-up
  (`FUP-3c5993936b048f5d`). That fresh run passed every suite that reads the
  page and failed one other, the target-worktree close file, on its 15 min
  deadline under the host's load
  ([D019](decisions.md#wo-277-d019--the-fresh-complete-run-failed-one-suite-on-its-deadline-under-the-hosts-load-the-row-is-composed-again-with-that-file-run-on-its-own)),
  a margin that is a follow-up too (`FUP-bd0e52a14e35c026`). The row
  criterion 4 cites composes the fresh run's passes with that file run again
  on its own.

## Criteria

**Criterion 1:** met. `node scripts/lib/operator-commands.mjs --check` prints `docs/OPERATOR.md is current` and exits 0 at the repaired tree (15:15 UTC), and `docs/OPERATOR.md` step 1 (heading at line 7) holds the clone recipe's block (lines 13 to 24) and then a block of `mkdir -p docs/control/local`, `cp scripts/kit/terms.example.txt docs/control/local/terms.txt` and `npm run terms -- check CLAUDE.md README.md` (lines 26 to 30), before `## 2. The first planning pass` (line 32); the repair changed step 5's paragraph alone. The sync-fixtures suite, whose case holds the page to the guide's rendering, ran on the repaired page and passed (D018, D019). [D006](decisions.md#wo-277-d006--the-page-as-built-seven-paragraphs-each-claim-read-where-the-kit-makes-it-true-the-terms-block-as-three-lines-and-the-manifests-route-in-the-release-steps-paragraph).

**Criterion 2:** met for what a command shows; the paragraphs' service to a person is the operator's reading at final review, as the criterion says. `node scripts/launchpad.mjs commands`, run in an export after the repair, prints the page byte for byte ([repair-001/export-commands.txt](repair-001/export-commands.txt), 8,973 bytes, SHA-256 `874635cc92db6456869a883d2117cd64781499d881a281002a7ca54f3f3c702c`, recorded 15:15 UTC by [repair-001/export-fixture.mjs](repair-001/export-fixture.mjs)): each of the seven steps opens with one paragraph before its blocks, the first planning pass's paragraph names `WO-001`, and the release step's paragraph names `git checkout main -- .claude/harness-manifest.json` and, since the repair, `git rm <path>` for a file this instance deleted ([D015](decisions.md#wo-277-d015--ver-001s-f1-is-repaired-here-a-file-this-instance-deleted-is-kept-deleted-with-git-rm-read-against-the-publishs-own-judgment)). The paragraphs are 188, 160, 196, 111, 220, 123 and 94 words; the release step's was 193 before the repair.

**Criterion 3:** met. In an export built by the launchpad suite's own fixture module, [repair-001/export-fixture.json](repair-001/export-fixture.json) records the exported `README.md`'s first paragraph with its link to `docs/OPERATOR.md`, the exported guide's first paragraph with its link to `OPERATOR.md`, and the page printed by `node scripts/launchpad.mjs commands` in the export equal to this checkout's page with the terms list's block after the clone recipe in step 1. The launchpad suite's three files ran on the repaired page and passed; their existing cases hold the exported front page equal to the seed, the exported guide to the manifest's hash and the page printed in an export to the checkout's, and no case of the suite names these three facts themselves ([D009](decisions.md#wo-277-d009--round-2-confirms-every-fix-and-admits-nothing-the-first-critics-three-points-are-accepted-and-the-case-added-under-d004-comes-out) and its follow-up).

**Criterion 4:** met. `npm test -- --review` passed as one complete run of the repaired tree: `npm test -- --review --keep-going`, 16:40:08 to 16:52:24 UTC, 0 h 12 min, 42 passed and 0 failed, exit 0 (`host-gate:274d9bc7d57447f31227fc7a69cd769fb91065e4124205e4eb4bc2b389a4275e:npm test`). The row composes 109 tasks' fresh executions of 15:48 to 16:35 UTC, run on the repaired page with `--again`, with 8 run again, the target-worktree close file among them, which had timed out in the fresh run under the host's load ([D018](decisions.md#wo-277-d018--the-repairs-complete-run-reused-the-suites-that-read-the-page-so-it-is-run-again-in-full), [D019](decisions.md#wo-277-d019--the-fresh-complete-run-failed-one-suite-on-its-deadline-under-the-hosts-load-the-row-is-composed-again-with-that-file-run-on-its-own)). That row is the plain `npm test` claim's too, since the review selection is the runner's full one and the closeout selection names no separate plain run. `npm run test:docs`: the passing row the completion consumes is the one run after this file's last edit, at the exact candidate tree; the failure VER-001 found, the status capture's lines 13 and 14, is repaired ([D014](decisions.md#wo-277-d014--the-repair-of-ver-001-the-status-capture-names-its-locations-by-the-kits-placeholder-and-every-line-this-order-writes-is-read-for-a-home-directory)).

## Gates

Every gate of this order's executor phases, in order, with the failures.
Times are the gate rows' own.

| Gate | Recorded (UTC) | Result |
| --- | --- | --- |
| `npm test -- --only sync-fixtures` | 05:17:13 | failed in the structural preflight (4 passed, 5 failed): the decisions index and the work-order index were stale, because the executor started the gate without `npm run sync` after release preparation; the command's pipe reported exit 0 ([D005](decisions.md#wo-277-d005--step-3s-suite-failed-twice-before-it-passed-once-on-the-executors-own-order-of-work-once-on-a-failure-main-has-held-since-the-planning-commit-which-the-roadmap-tables-writer-repairs)) |
| `npm test -- --only sync-fixtures` | 05:23:03 | failed one case (8 passed, 1 failed): a failure `main` has held since the planning commit `97ce00838`, repaired with `npm run release -- list --markdown --write` (D005) |
| `npm test -- --only sync-fixtures` | 05:36:53 | passed, 9 of 9 |
| `npm test -- --only launchpad` | 05:51:14 | passed, 9 of 9 (this row skips the document cases) |
| `npm test -- --only launchpad-planning` | 06:01:04 | passed, 9 of 9 |
| `npm test -- --only registrations` | 06:02:35 | passed, 8 of 8 |
| `npm test -- --review --keep-going` | 07:26:05 | passed: 42 passed, 0 failed, 117 fresh tasks, 0 h 38 min |
| `npm run test:docs` | 07:32:39 | passed: 29 passed, 0 failed, 29 fresh tasks, 0 h 2 min; the status capture was written after it (D014) |
| `npm test -- --review` (repair) | 15:43:45 | passed: 42 passed, 0 failed, 7 fresh tasks, 0 h 1 min; 110 tasks reused from the 07:26 row, the suites that read the page among them, so it is not the row criterion 4 cites (D018) |
| `npm test -- --review --again --keep-going` (repair) | 16:35:26 | failed: 41 passed, 1 failed, 117 fresh tasks, 0 h 47 min; the target-worktree close file timed out at its 15 min deadline under the host's load, and every suite that reads the page passed on the repaired page (D019) |
| `npm test -- --review --keep-going` (repair) | 16:52:24 | passed: 42 passed, 0 failed, 8 fresh tasks and 109 carried from the 16:35 run, 0 h 12 min; the close file passed on its own in 11 min; the row criterion 4 cites |
| `npm run test:docs` (repair) | after this file's last edit | the row the completion consumes; its time is in the gate ledger and the session's closing message |

The focused rows before 06:20 UTC ran on trees the review rounds then
changed; the complete runs are the rows the criteria stand on. In the
repair, single runs under the bounded wrapper, each outside any gate:
[deleted-file-recovery.mjs](repair-001/deleted-file-recovery.mjs) and
[export-fixture.mjs](repair-001/export-fixture.mjs) at 15:12 and again at
15:15 UTC after the queue item's start (D016),
[rename-note.mjs](repair-001/rename-note.mjs) at 15:39 UTC, and
[home-paths.mjs](repair-001/home-paths.mjs), last after this file's last
edit. The document gate's `launchpad-docs` task runs the document cases the
`launchpad` row skips, the pinned-seed case among them.

## Review

self-review: found 18; fixed 8; recorded 10; rounds 3; unreviewed 262 lines (the implementation's 50, a test case removed after round 2; the repair's 212, written after its one review, which a fix dispatch does not repeat: D014's corrected count, D017 to D019 and the rename note's probe; this file, the generated pages and the probes' result files are not counted)

- Round 1, paired, 06:04:19 to 06:18:51 UTC: four fresh `dotln-worker`
  workers of the table's `default` for Claude, launched together on one base
  (`b8591a730`) and one tree (`1699f95895ee`), each given the kit's round 1
  brief as its dry run printed it. The host's transcripts of the four name
  `claude-opus-5-5`; the effort `xhigh` is the generated definition's and was
  not read back. Reports: `round-1-criteria.md` (4 findings),
  `round-1-design.md` (8), `round-1-consistency.md` (3, one blocking) and
  `round-1-combined.md` (6, one blocking), in the ignored lane
  `docs/control/local/reviews/WO-277/since-2eb510c741e5/`. Twelve distinct
  findings, each judged in
  [D007](decisions.md#wo-277-d007--round-1-of-the-paired-ladder-twelve-distinct-findings-from-four-reviewers-one-of-them-a-stale-pin-that-fails-criterion-4-each-judged-before-any-fix)
  with its `roundFindings`: one of class criterion (the stale seed pin, found
  by the consistency reviewer and the combined worker), five lesser and six
  improvements.
- Round 2, the recheck, 06:26:04 to 06:37:25 UTC: the same four workers,
  resumed, on tree `b16e21c516be`. Reports `round-2-design.md`,
  `round-2-criteria.md`, `round-2-combined.md` and `round-2-consistency.md`
  in the same lane. Every fix held. Three new findings, none blocking and
  none admitted, recorded and not fixed, as the round's rule has it:
  1. The release step's route names the files both sides changed and the
     harness manifest, and gives no route for a merge that stops on any other
     file, such as a kit file the preview lists as `refused`. By the
     reviewer's inference from the guide, not run: in an instance whose
     earlier update was squash-merged, restoring every `both changed:` file
     from `main` drops the starter's change where the guide says to take the
     file (design).
  2. `git checkout main -- <path>` cannot keep an instance's deletion of a
     file the preview lists as changed on both sides (criteria). VER-001
     reproduced it as F1, and the repair fixed it (D015).
  3. D008's line for the release's notes says an instance with no list
     registers one by step 1's second block and does not say with its own
     entries. The section below words it so (combined).
- The repair's one combined review, which the helper numbers round 3,
  15:22:43 to 15:36:36 UTC: one fresh `dotln-worker` of the table's
  `default` for Claude on base `848c8f4a37b9`, the tree VER-001's completion
  records, and tree `d624754891f8`, given the helper's combined brief as its
  dry run printed it, with the parent's three notes after it. The host's
  transcript names `claude-opus-5-5`; the effort is the generated
  definition's and was not read back. Report `round-3-combined.md` in the
  ignored lane `docs/control/local/reviews/WO-277/repair-1/`: three
  findings, none blocking, each judged in
  [D017](decisions.md#wo-277-d017--the-repairs-one-combined-review-no-blocking-finding-d014s-stale-count-is-corrected-and-a-renamed-file-is-recorded-with-a-follow-up).
  R3-01, D014's stale count of lines, is fixed in D014; R3-03, this
  handoff's account of the page before the repair, is fixed by this handoff;
  R3-02, a file this instance renamed, is recorded with its follow-up.
- Fixed (8): R1-01 the pin, R1-02 the migration's record, R1-03 step 2's
  route, R1-04 the release step's route, R1-05 an owner for the manifest
  route's removal, R1-07 step 1's wording, R3-01 and R3-03. Recorded (10):
  R1-06, R1-08, R1-09, R1-10 and R1-12 as D007 has them, R1-11 because the
  case it improved was withdrawn, round 2's three, and R3-02. Round 2's
  second finding was recorded at round 2 and repaired later, after VER-001
  reproduced it.
- Worker uses: in the implementation, 4 launches and 4 re-tasks of the cap
  of 20, and one critic launch that no hook counts; in the repair, one
  `dotln-worker` launch, which `node scripts/harness.mjs usage` counts as 2
  uses of the cap of 20 (one Claude launch and one unattributed, most likely
  the review helper's dry run: an inference), with no re-task.

## The meta critic

On the operator's request of 05:04:38 UTC
([D002](decisions.md#wo-277-d002--the-operators-direction-the-meta-critic-runs-on-its-clock-on-gpt-6-astra-with-its-two-checks-repeated-and-one-account-address-kept-from-the-other-provider)),
the critic of `docs/evidence/WO-276/critic/` ran on its clock on the worker
`astra` (`gpt-6-astra` at max, by the launcher's own line). One launch:
06:16:20 to 06:29:30 UTC, report `critic-1.md` in the ignored reviews lane.
It read a copy of this worktree's transcripts in which the account's one mail
address was replaced by a placeholder; the operator had not been told of the
address when it launched (D010). Its three criticisms were given to the
operator whole at 06:32:01 UTC and all accepted (D009): a test case added
against the order's non-goal on the executor's own reading; a gate started
unprepared and an edit refused during a gate; and times in a record that did
not match the host's. The second launch, due 07:31:20 UTC, was not made: the
passing complete run was in at 07:26:05 UTC, which ends the clock, and its
timer was stopped. The repair ran no critic: the clock D002 records ended
with the implementation's complete run, and the repair's dispatch carried no
request for one.

## For the release's notes

The notes are the final review's to write (D008). What this order asks their
Read before upgrading to say:

- `docs/OPERATOR.md` is the place to start: the commands of each step with
  what to look for and what to do when one fails. `node scripts/launchpad.mjs
  commands` prints it, before any install.
- The starter's front page now names the page first. An instance whose front
  page is unchanged takes the new one in its update's merge; an instance
  whose front page is its own keeps it.
- The page puts the private terms list in its first step. An instance set up
  before this release that has no list registers one as step 1 says, with its
  own entries in place of the example's, before its next publish.
- When an update's merge meets a file this instance deleted and the starter
  changed, the page's release step keeps the deletion with `git rm <path>`.

At release close, read the starter refresh's row: the starter's front page at
`cd8ea69` is the unedited seed, so the refresh is expected to rewrite it; if
the row keeps it instead, the starter's front page needs its own change.

## Follow-ups

Register rows minted from this order's decisions:

- `FUP-493a210c3658ce32` (D003): an order's own publish goes on without a
  terms list where the other three publishes refuse.
- `FUP-2a3442fb0e568755` (D005): after every release close the sync suite's
  real-inventory case fails until the roadmap table's writer is run. This
  order's own tag recreates the state, so the next order's executor runs
  `npm run release -- list --markdown --write` before its first complete run
  until planning decides the lasting repair.
- `FUP-5621408816545b95` (D006): an owner for taking the harness manifest's
  route off the page once WO-282 repairs the emit.
- `FUP-858a24b8de5b5313` (D007): the seeded first order's item 4 says to
  create the terms list from the example, where the page registers it first
  and `worktree start` carries it.
- `FUP-d088964c0f58f42e` (D009): a regression case for the page's content,
  for the order that next changes the page; its text is
  [withdrawn-case.txt](withdrawn-case.txt). `FUP-0b9d1ba5052aa2b7` is the
  register's row for D004, which D009 reopens.
- `FUP-0cfd840f500b9874` (D010): what the host does with a long line written
  between tool calls, and what the role text should say about it.
- `FUP-3285bd4a53c4c3e9` (D012, the verifier's): the page's recovery for a
  deleted file. D015 reopens it with the page's half done; what remains is
  whether the preview's `both changed:` rows name such a file apart.
- `FUP-84e1fe3a9001289c` (D014): a record written into an order's own
  evidence after the document gate, and a script beside the evidence, both
  reach a commit without the gate reading them for home paths.
- `FUP-ed709688ea483bd1` (D017): a file this instance renamed and the starter
  changed is seen by neither the preview nor the publish, and the page's
  recovery meets two no-match errors for its old path.
- `FUP-3c5993936b048f5d` (D018): the runner reuses a suite's passing tasks
  at the same code identity although documents the suite declares among its
  sources changed since, so a change to the guide or the page after a
  complete run reaches no export or seed case before release.
- `FUP-bd0e52a14e35c026` (D019): the target-worktree close file runs near
  its 15 min deadline in a complete run, 720 s of 900 s at normal load, and
  times out when the host is a quarter slower.

The implementation's completion named 11 pending register rows that match
this change by text (`npm run plan -- followups --touching`, 07:34 UTC): the
seven rows of the implementation's decisions above (D003 to D010), and four
of earlier orders, none of them changed here and each left as it is for the
final review to dispose: `FUP-197d2df229999795` (WO-276-D120),
`FUP-2d104bb644bc094c` (WO-276-D074), `FUP-5e8613230ee9c07c` (WO-276-D156)
and `FUP-912adb42a652b75f` (WO-245-D005).

The follow-up queue (`npm run adjacent -- list`, revision 10): two items,
both completed. `adjacent-0001`, the roadmap table's writer, in the
implementation; `adjacent-0002`, the release step's recovery for a deleted
file, in the repair, queued after its edit as D016 records. Their
announcements and check-ins are the executor's own attestations.

## Where this execution left the order's text

- Release preparation ran before step 1, so that the page was generated
  once, at v1.0.1.
- The guide's sentence on an absent list, in First steps step 4 beside the
  new block, is corrected to what each publish does (D003).
- The roadmap's release table gained v1.0.0's row through its own writer,
  and `docs/control/release-history.json` records the table through v1.0.0
  (D005). Neither is in the order's deliverables.
- One line of `scripts/test-launchpad-export.mjs` changed: the seed's pin
  (D008). The order's release line says no code.
- The page's fixed opening still calls a step's paragraph its sentence; the
  generator is the order's non-goal (D006, R1-09).
- The release step's paragraph carries a recovery the order did not name,
  for a file this instance deleted (D015), which the verification's F1
  showed the page needs.

## Terms screen

`node scripts/terms.mjs branch` at 16:53 UTC, after the repair's complete
run: `local-terms list: present; entries: 0 refuse, 9 context; changed files
screened: 42; lines found: 0 refuse, 0 context`. It listed no line, so there
were none to read: 0 lines read. The implementation's screen at 07:27 UTC
listed none either. The screen runs again after this file's last edit,
before the document gate, whose `terms` task reads the branch as well.

## Goal alignment

The outcome matches the order's objective for the page, the front page and
the guide's first paragraph, and the repair's purpose: criterion 4's
document failure is repaired at its class, and the page's recovery holds for
a deleted file. In the implementation two traps named before the work held:
the criterion's suite row offered as evidence of facts it does not assert
(D004, answered first by a case and then, on the critic's point, by the
export's record and the suite's existing equalities), and a critic briefed
by the one it judges (D002: one string replaced over every file, counts
recorded). One trap was not named and was met: a step check trusted for more
than it runs, twice (D005 and D007). In the repair the traps named were
three. Rewriting a record: the verifier asked for the capture's locations to
be normalized, and the original stays in the recovery refs (D014). Writing a
record after the gate that judges it, the escape itself: nothing in this
directory is written after the repair's document gate. Widening the
repair: F1's fix stayed inside the order's own paragraph, and R3-02, which
would have changed the page after its one review, was recorded instead
(D017). One slip was met: F1's queue item was recorded after its edit
(D016). One count was stale: D014's, corrected on R3-01. And the trap the
implementation met came back in another form, a gate trusted for more than
it ran: the repair's first complete run carried the page's suites from a run
before the page changed, and it was run again in full (D018), where one
unrelated file then timed out under the host's load and was run again on
its own (D019).

## Attestation and usage

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.325","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}

This is the repair's. The effort is the session's selected value
(`CLAUDE_EFFORT`), not an effective readback; the version is the one the
session's hook observed. The implementation's attestation, Claude Code
2.1.325, `claude-fable-5-2` at `xhigh` from the same readback, is in the
order's event record.

**Process cost:** entry 159,576 tokens; handoff 52,353,988 tokens; source claude-transcript-message-usage

`node scripts/harness.mjs usage` for the repair's session, scope dispatch:
at entry, 15:00:05 UTC, 159,576 tokens; at this handoff, 16:53:30 UTC,
52,353,988 tokens in all (input 420; cached input 51,732,820; cache write
401,013; output 219,735); reasoning tokens and dollars unknown (no counter).
Dispatch standing 1 h 54 min of 8 h 0 min; complete runs 3 of 20. The
review worker, by the host's task notice: 187,809 tokens, 13 min 54 s, 78
tool uses. The implementation's session, as its handoff recorded it at
07:27:06 UTC: 77,832,067 tokens, 2 h 26 min of 8 h 0 min, one complete run.
Final counters stay in the ignored receipts and the closing message.

## Evidence in this directory

- [decisions.md](decisions.md): D001 to D019.
- [export-fixture.mjs](export-fixture.mjs), [export-fixture.json](export-fixture.json)
  and [export-commands.txt](export-commands.txt): the export's front page,
  guide and printed page, recorded with the launchpad suite's fixture at
  07:27 UTC, before the repair; the page they hold is the implementation's.
- [withdrawn-case.txt](withdrawn-case.txt): the case removed under D009.
- [status.json](status.json): `npm run resume -- status --json` after
  `implementation-ready`, which was recorded at 07:33 UTC (4 met, 0 unmet):
  phase `ready-to-verify`, next action `verify`, checkpoint
  `refs/dotln/checkpoint/WO-277/2`. Its two location fields read
  `<worktree>` since the repair (D014).
- `repair-001/`: the repair's records.
  [export-fixture.mjs](repair-001/export-fixture.mjs),
  [export-fixture.json](repair-001/export-fixture.json) and
  [export-commands.txt](repair-001/export-commands.txt), the same recording
  after the repair, whose printed page is the repaired page, byte for byte;
  [deleted-file-recovery.mjs](repair-001/deleted-file-recovery.mjs) and
  [its results](repair-001/deleted-file-recovery.json), the release step's
  recovery against the publish's own judgment (D015);
  [home-paths.mjs](repair-001/home-paths.mjs) and
  [its results](repair-001/home-paths.json), the rule of D014 over every line
  this order writes; [rename-note.mjs](repair-001/rename-note.mjs) and
  [its results](repair-001/rename-note.json), the case R3-02 records (D017).
- `verifier-001/`: the verifier's records for VER-001.
