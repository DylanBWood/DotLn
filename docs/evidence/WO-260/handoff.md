# WO-260 handoff: implementation and the repair of VER-002

WO-260 (the kit runs on Git 2.31.0) ran on branch `wo-260` over `main` at
`9adc11723`. Release target: v0.122.1
([D014](decisions.md#wo-260-d014)). `@dotln/skeleton` goes from 0.89.0 to
0.90.0. The decisions are D001 to D036 in [decisions.md](decisions.md). The
branch has no commits; it commits at final review. The repaired candidate's
code identity is
`00cad38aa337787a27655fd20543fb4fe7eb4692ff1b0db51987e8027cf647c9`.

Read first:

- [VER-002](../../verifications/WO-260/VER-002.md) failed criterion 4 on
  separate double-quoted assignments whose apostrophes could hide the Git
  command between them. D033 repairs the word boundary; D034 preserves a
  written long-option name when its value contains a dollar; D035 keeps
  dollar-bearing assignment values together while exposing command
  substitutions. The report's reproducer, both review variations and the
  current complete gate pass. The final combined review found nothing new
  ([D036](decisions.md#wo-260-d036--the-final-review-and-complete-gate-close-this-repair)).
- [VER-001](../../verifications/WO-260/VER-001.md)'s earlier quoted-hash
  failure remains covered. This repair changes only the surface reader,
  its regression test and their documentation; the compatibility call sites
  retain the original implementation.
- During the repair the operator directed that it not grow into another
  hand-written parser. The reader stays regular expressions over lines. The
  module header of `scripts/lib/git-surface.mjs` states the rule it follows
  and what it leaves out. FUP-d7ca8a89d9313a2b decides whether an existing
  parser should replace it
  ([D027](decisions.md#wo-260-d027--a-hash-starts-a-shell-comment-only-where-it-begins-a-word-the-reading-stays-regular-expressions-with-its-other-limits-stated)).
- This host would not build a real Git 2.31.0
  ([D013](decisions.md#wo-260-d013--no-real-git-2310-ran-here-criterion-5s-fallback-applies)).
  The below-floor shim is the evidence here. The real-binary test is the
  operator's work laptop, after the release.

## Criteria

**Criterion 1:** met. The complete run `npm test -- --review` at the code
identity above (recorded 2026-11-09T19:40:41.414Z; 0 h 52 min) ran
`runner-fixtures` fresh, and it exited 0.

`scripts/test-git-floor.mjs` has fourteen cases, all included in that fresh
passing suite. [below-floor-cases.txt](below-floor-cases.txt) retains the
prior repair's output; [repair-002-gates.json](repair-002-gates.json) binds
this repair's current coverage. The fourteenth case now includes 45 shell
texts, also run independently by the combined review worker. The shim:

- reports `git version 2.31.0`;
- refuses `check-attr --source`, `ls-tree --format`, `worktree list -z` and
  `fsck --no-references`, exiting 129 with Git's own message;
- prints `rev-parse --show-ref-format` back;
- drops `GIT_CONFIG_GLOBAL` and `GIT_CONFIG_SYSTEM`.

With the shim's directory first on the path:

- `gateCodeIdentity` at a committed revision returns the same identity as
  the host's Git and as the clean tree.
- `readTrackedTextAtHead` returns committed bytes, and refuses a path that
  is untracked, linked or absent.
- `validateTargetRecordsCommit`, `readTargetRecord` and
  `assertPlanningBasePath` (the base check in `publishTargetPlanning`)
  accept a regular committed blob and refuse a 100755 one.
- The `main-intake` grant finds the main checkout from a linked worktree.
- `dropInventoriedStash` reads a files backend and drops the entry.
- `verify` admits a sound source-change candidate.
- No setting planted in the real home reaches the authority probe's Git,
  its payload's push, or the Git children of its launched harness.

Eleven reverted-fix runs, recorded after the implementation's round 1, show
each call-site case failing with its fix reverted
([reverted-arms.json](reverted-arms.json);
[D003](decisions.md#wo-260-d003--the-below-floor-shim-and-its-cases-and-what-they-prove),
[D018](decisions.md#wo-260-d018--correction-the-launched-harnesss-git-children-are-isolated-on-every-git)).
The repair touched none of those call sites.

**Criterion 2:** met. `package.json` sets `engines.git` to `>=2.31.0`. With
Git reporting `git version 2.31.0` or `git version 2.31.0.windows.1`,
`node scripts/harness.mjs check` exits 0 and `npm test -- --only host`
passes. With `git version 2.30.9`, each exits 1 and names both `>=2.31.0`
and `2.30.9` ([criterion-2-floor.txt](criterion-2-floor.txt);
[D010](decisions.md#wo-260-d010--the-git-floor-is-git-2310-and-wo-258-d009-is-superseded)).

That record dates from 2026-11-09 03:52 UTC, at an earlier code identity.
This repair changes neither the floor reader (`scripts/lib/node-engines.mjs`)
nor `package.json`. At the repaired identity, the complete run checked the
floor two ways:

- `runner-fixtures` ran the Git floor case. It admits 2.31.0, a
  Windows-suffixed 2.31.0 and an Apple-suffixed 2.39.3, and refuses 2.30.9
  and 1.99.9, naming the floor and the version read.
- The `host` task passed on this host's Git 2.55.0.

The separate version-spoofed `harness check` and host-only runs were not
repeated in this repair; their earlier CLI evidence is retained alongside
the fresh boundary case above. A failing host-only run would displace the
complete run's passing host row.

**Criterion 3:** met. The complete run's `release:case:git_floor` exited 0
at the repaired identity, which means `bash scripts/test-release.sh --case
git_floor` passes. Under a Git that rejects `check-attr --source`, the
release close's dry run writes the reviewer-gate manifest with the reviewed
code identity. A Git that fails `check-attr` for another reason stops the
close with class `host-runtime`
([D005](decisions.md#wo-260-d005--the-classification-at-a-revision-reads-a-temporary-index)).

**Criterion 4:** met. The complete run's `git-surface` task exits 0 on
this candidate. The current fixture case checks 45 shell texts in both a
shell file and a script written from a JavaScript string. A real `sh`, or
`bash` for ANSI-C quoting, with a stand-in Git supplies the argument oracle:
39 texts pass the option to Git and six omit it. The check refuses all 37
texts with a statically written option name, naming `ls-tree --format` and
the carrier's file and line. The two runtime-name controls remain unknown,
as the documented static boundary requires; the six absence/comment
controls are admitted.

The original VER-002 pairing reproducer passes all twelve carrier/control
readings, and its additional 53-text corpus passes 106 readings
([repair-002.json](repair-002.json)). The review's literal-dollar option
finding passes all ten readings after D034
([repair-002-dollar-after.json](repair-002-dollar-after.json)). The
round-two literal-dollar assignment finding passes all six readings after
D035, retaining host-Git exit 0 and shim exit 129
([repair-002-assignment-dollar-after.json](repair-002-assignment-dollar-after.json)).
The final combined reviewer independently ran the current shell-oracle
case and held both fixes. A comparison against the round-two reader loses
no corpus reading outside the two changed source files and retains 488
forms. The earlier comparison with the round-one reader adds 25 readings
of the already recorded `git --git-dir`, with none lost.

The existing fixture tests also reject a record floor different from
`engines.git`, naming both versions. The fresh launchpad export suite
passes its assertion that the exported kit does not name the core-only
`git-surface` task. The module header, kit guide and product 07 state the
reading's limits; the broader parser question remains on
FUP-d7ca8a89d9313a2b. No new surface form or parser dependency was added.

**Criterion 5:** met through the order's explicit host-behavior fallback.
No real Git 2.31.0 binary ran in this repair. The earlier source-build denial
and the permitted shim fallback remain recorded in
[D013](decisions.md#wo-260-d013--no-real-git-2310-ran-here-criterion-5s-fallback-applies).
VER-002's bounded inventory found Git 2.55.0 and Apple Git 2.50.1, with no
2.31.0 binary; that was not an exhaustive disk search. The denied build was
not retried. Actual old-Git behavior, including the `core.fsmonitor=false`
carry-in, remains untested here; criterion 1 supplies the shim evidence.

**Criterion 6:** met. The kit guide's §First steps gives the floor as Git
2.31.0 and says what it rests on. It also says that an instance on an older
Git lowers `engines.git` in its own `package.json` and reports what failed,
and that core's gate refuses a new Git form its static reading finds.
§What runs here, and what does not links
[D010](decisions.md#wo-260-d010--the-git-floor-is-git-2310-and-wo-258-d009-is-superseded).

`grep -rn '2\.40' docs/KIT.md docs/product` prints one line,
`docs/product/07-execution-guide.md:2190`. That planning rule recounts that
WO-258 declared a Git floor of 2.40; it states no current floor.
`npm run test:docs` runs once after this handoff's last edit, and completion
consumes its row for the candidate tree.

**Criterion 7:** met. `npm test -- --review` passed at the identity above,
recorded 2026-11-09T19:40:41.414Z: all 46 required suites and 122 fresh
tasks passed in 0 h 52 min, with no reused or unrun suite. A current
`coveringGateCheck` consumes that exact row and confirms every Preflight
suite. The review selection covers the plain `npm test` selection.
[repair-002-gates.json](repair-002-gates.json) records the identity, coverage
and task results. `npm run test:docs` runs after the final authored document
edit, and `repair-complete` consumes its passing row as well as this complete
row; the completion transition runs no gate.

## Review

self-review: found 2; fixed 2; recorded 0; rounds 3; unreviewed 0 lines (no source changed after the final combined review; the executor owns these post-pass handoff and decision write-backs)

This VER-002 repair used Codex `spawn_agent` reviewers, selected model
`gpt-6.1-sol` and effort `max`, as the executor skill requires for a dispatch
that names no worker override. Four independent workers were launched;
the criteria worker was re-tasked for round two. One additional clarification
is counted conservatively as a worker use: six budgeted uses against the
cap of 20. The harness's unhooked counter reports zero observed launches;
it does not establish that no workers ran. Effective worker effort was not
independently read back.

Reports are in `docs/control/local/reviews/WO-260/repair-4/`. Round one
reviewed the whole branch change; round two rechecked the fixed criteria
finding and the whole change; round three carried all three briefs over
the delta since round two. Design and consistency had no findings requiring
a round-two recheck.

| Round | Reviewed tree | Reports | Found | Result |
| --- | --- | --- | --- | --- |
| 1 | `80d63058` | `round-1-criteria.md`, `round-1-design.md`, `round-1-consistency.md` | 1 | The literal-dollar option finding was judged and fixed in D034; design and consistency found none. |
| 2 | `64668e22` | `round-2-criteria.md` | 1 | The first fix held; the literal-dollar assignment finding was judged and fixed in D035. |
| 3 | `970f9fd7` | `round-3-combined.md` | 0 | Both fixes held; the 45-text shell-oracle case passed; no code delta remained. |

The consistency and combined reports contain their `Traced consumers`
tables, including generated pages and fixture manifests, with executed
commands distinguished from retained evidence. No reviewer ran after the
complete gate. The gate's candidate tree exactly matches the final reviewed
tree. The outcome matches the requested bounded repair; the remaining
parser limits stay on their existing follow-up.

### Earlier VER-001 repair and implementation reviews

Prior repair counts: found 16; fixed 13; recorded 3; rounds 3; unreviewed 52 lines (round 3's two fixes after its reviewed tree `88bd90c6`: one alternative in each of two patterns, the comments and header they reword, and four test texts; the executor judged them by the fourteenth case, every shell text of the three rounds against `sh` or `bash`, VER-001's reproducer and the tree's reading, as D031 records)

The VER-001 repair's ladder ran on Claude `dotln-worker` agents (`claude-opus-5-5`
as the worker definition pins it; no effort readback). Round 1 launched three
fresh workers. Round 2 re-tasked each of them with its own report. Round 3
launched one fresh combined worker. The reports are in
`docs/control/local/reviews/WO-260/repair-3/`:

| Round | Reviewed tree | Reports | Found | Result |
| --- | --- | --- | --- | --- |
| 1 | `15260671` | `round-1-criteria.md` 2, `round-1-design.md` 5, `round-1-consistency.md` 4 (with its Traced consumers table) | 11 | Judged before any fix ([D029](decisions.md#wo-260-d029--the-repairs-round-1-eleven-findings-judged-before-any-was-fixed)); 9 fixed (consistency F1 transferred to criteria F1); design F3 and F4 recorded |
| 2 | `d687d373` | `round-2-criteria.md` 1, `round-2-design.md` 2, `round-2-consistency.md` 0 | 3 | Every round-1 fix held; the two regressions of round 1's pattern admitted under criterion 4 and fixed; design F2 recorded ([D030](decisions.md#wo-260-d030--the-repairs-round-2-every-fix-held-two-regressions-of-round-1s-pattern-judged-and-fixed)) |
| 3 | `88bd90c6` | `round-3-combined.md` | 2 | Both round-2 fixes held; both findings admitted under criterion 4 and fixed; the executor judged the last delta ([D031](decisions.md#wo-260-d031--the-repairs-round-3-the-last-one-more-pairing-fix-the-comment-reader-reads--and-the-executor-judges-the-final-delta)) |

The executor's judgment of the last delta: the fourteenth case passes, and
it fails with round 3's reviewed reader restored (and with round 2's, and
with the reader VER-001 judged). Across the 40 shell texts the three rounds
raised, each judged by `sh` or `bash`, the final reader agrees with the
shell on 40, round 3's on 32 and round 2's on 33, in a shell file and in a
string alike. Outside the two changed files, this tree's reading is the same
as round 3's tree's (10,239 findings and 488 forms here). Against the
reader VER-001 judged, and outside those two files, the only reading added
is `commit -m` at `scripts/test-worktree.sh:433`, a recorded form; nothing
is lost.

Recorded, not fixed:

- Design round 1 F3: fail the check on a recorded form the reading no longer
  finds. It would change the check's contract; FUP-d7ca8a89d9313a2b carries
  it.
- Design round 1 F4: the four surface cases repeat their fixture setup.
  Maintenance only.
- Design round 2 F2: build the three word patterns from named fragments, and
  state the invariant behind the unreachable `Math.max` clamp in
  `shellLines` instead of clamping. Maintenance only.
- Round 2's consistency notes, none admitted:
  - D027's evidence names the fourteenth case by its earlier title. D027 is
    a dated record.
  - The runner's one-line protection text for `git-surface` keeps its
    unqualified summary.
  - A program named by a defaulted expansion (`"${GIT:-git}"`) is a run-time
    argument.

The implementation's own ladder, before VER-001, ran on nine Codex workers,
`gpt-6-astra` at effort `max`, through `npm run worker -- review --host
codex --model astra`, as the operator directed
([D002](decisions.md#wo-260-d002--the-review-ladder-runs-on-gpt-6-astra-workers)).
It found 17 and fixed 17 over three rounds and two repairs of failed
complete runs:

| Round | Reviewed tree | Reports | Found | Result |
| --- | --- | --- | --- | --- |
| 1 | `eae50ab5` | `round-1-criteria.md` 3, `round-1-design.md` 2, `round-1-consistency.md` 6 | 11 | Fixed ([D017](decisions.md#wo-260-d017--round-1s-eleven-findings-judged-before-they-were-fixed), [D018](decisions.md#wo-260-d018--correction-the-launched-harnesss-git-children-are-isolated-on-every-git)) |
| 2 | `dea3bd4f` | `round-2-criteria.md` 2, `round-2-design.md` 0, `round-2-consistency.md` 1 | 3 | Fixed ([D019](decisions.md#wo-260-d019--round-2s-three-admitted-findings-judged-before-they-were-fixed)) |
| 3 | `862ca811` | `round-3-combined.md` | 2 | Fixed ([D020](decisions.md#wo-260-d020--round-3s-two-findings-judged-and-fixed-the-executor-judges-the-last-delta)) |
| Repair 1, round 3 | `0e12a316` | `repair-1/round-3-combined.md` | 1 | Fixed ([D021](decisions.md#wo-260-d021--the-first-complete-run-failed-on-a-fixture-that-pinned-six-structural-tasks-repaired), [D022](decisions.md#wo-260-d022--the-repairs-review-found-one-more-continuation-case-the-executor-judges-the-last-delta)) |
| Repair 2, round 3 | `73dff9b5` | `repair-2/round-3-combined.md` | 0 | Nothing to fix ([D023](decisions.md#wo-260-d023--the-second-complete-run-failed-on-the-floor-tests-own-helper-use-repaired)) |

## Evidence

The order's evidence gate, item by item:

| Item | Where |
| --- | --- |
| The below-floor cases' output under the shim | [below-floor-cases.txt](below-floor-cases.txt), the prior repair's fourteen-case output with local paths redacted; [repair-002-gates.json](repair-002-gates.json) adds this repair's fresh runner-fixtures coverage; the earlier thirteen-case text stays in `refs/dotln/checkpoint/WO-260/5` |
| Step 3's two timings | [D005](decisions.md#wo-260-d005--the-classification-at-a-revision-reads-a-temporary-index) |
| The time of step 10's task | [D011](decisions.md#wo-260-d011--the-recorded-git-surface-and-its-core-only-check); also exit 0 in the complete run |
| Step 6's feedback reading | [D008](decisions.md#wo-260-d008--fsck-runs-once-without---no-references-on-a-git-that-lacks-it-and-the-edit-owes-a-live-feedback-episode) and [D015](decisions.md#wo-260-d015--the-feedback-edition-is-re-minted-from-one-live-self-host-episode); the live edition is `feedback-001/`, with the authority edition in `authority/001/` beside it |
| Step 8's list of fixtures that kept the real home for a non-Git child | [D009](decisions.md#wo-260-d009--a-fixtures-git-is-isolated-by-a-home-inside-the-fixture) (one: the authority probe's harness launch), corrected by [D018](decisions.md#wo-260-d018--correction-the-launched-harnesss-git-children-are-isolated-on-every-git) |
| Step 8's suites run under the shim | [below-floor-suites.txt](below-floor-suites.txt) and [D016](decisions.md#wo-260-d016--step-8s-runs-under-the-below-floor-git-found-two-defects-and-one-load-sensitive-bound) |
| Step 11's record | [D013](decisions.md#wo-260-d013--no-real-git-2310-ran-here-criterion-5s-fallback-applies) |
| `npm run resume -- status --json` after `implementation-ready` | Read after completion and reported in the completion response, not filed ([D024](decisions.md#wo-260-d024--the-status-after-implementation-ready-is-read-and-reported-not-filed)) |

The criterion evidence and the decisions are in this directory as well:
[criterion-2-floor.txt](criterion-2-floor.txt),
[reverted-arms.json](reverted-arms.json) and [meta.json](meta.json). The
verifier's own files ([verification-001-surface.mjs](verification-001-surface.mjs),
[verification-001-probes.mjs](verification-001-probes.mjs),
[verification-001-floor.mjs](verification-001-floor.mjs) and
[verification-001.json](verification-001.json)) are unchanged.

The release stays v0.122.1, a patch. The repair changed launchpad scripts,
their test and documents, and no package component, so no version moves.

## Follow-ups and the queue

- FUP-d7ca8a89d9313a2b, from
  [D027](decisions.md#wo-260-d027--a-hash-starts-a-shell-comment-only-where-it-begins-a-word-the-reading-stays-regular-expressions-with-its-other-limits-stated),
  widened by D029's reopening observation: the shell shapes the regular
  expressions leave out, and whether an existing maintained parser, never a
  hand-written one, should read them. D034 discharges the static long-option
  name with an expanding value; its remaining shapes stay open. The worktree
  queue's `adjacent-0001` is deferred to it.
- FUP-c052a580e9f69291, from
  [D028](decisions.md#wo-260-d028--a-fix-answers-a-verification-failure-in-proportion-the-rule-is-carried-to-wo-262),
  at the operator's request: WO-262 extends its judgment rule to a
  verification failure, so a fix repairs the failing case and its class in
  proportion and re-engineers only where the larger change is shown better.
  It names WO-262; allocating it into that order's text is a planning act.

- FUP-3cc8812a22cb1395, from D032, is settled by D033-D036 and this repair's
  current evidence. Independent verification can reopen it on a reproduced
  supported miss.
- `adjacent-0002` records the literal-dollar option repair. Its focused
  regression and complete gate passed; it is marked completed after the
  final document gate also passes, using those three executed results.

## Attestation and usage

**Executor (this repair):** Codex CLI 0.167.0, model `gpt-6-astra`, selected
effort `max`, source `codex-session-readback`. The order recommends `xhigh`;
this records the actual selected value. Actor attestation:
`{"harness":"codex-cli","harnessVersion":"0.167.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}`.

**Reviewers (this repair):** four `codex-spawn-agent` launches with
`gpt-6.1-sol` at `max`, one round-two recheck and one clarification counted
conservatively: six uses. The preceding repair used Claude workers, and the
implementation used Codex Astra workers, as the retained historical review
section records.

**Usage observation:** source `codex-transcript-counter`, scope this dispatch,
cutoff 2026-11-09T19:40:44.303Z. Entry observation was 59,526 total tokens at
2026-11-09T18:08:02.024Z. At this cutoff:

- Total: 23,158,478 tokens; input 23,063,574, including 22,783,360 cached
  input; output 94,904, including 35,372 reasoning output. These are
  cumulative request counters, not unique source bytes. Dollar cost is
  unknown.
- Activity: 155 observed steps; command count unavailable.
- Standing: 1 h 33 min of the 8 h 0 min bound; one complete run of the
  allowed 20. That run took 0 h 52 min. Focused probes supplied the missing
  variations; the single fresh complete run established current coverage.
- Worker usage is the explicit six-use accounting above. The host's zero
  observed admissions has an unknown uncounted remainder and is not used
  as evidence of zero actual launches.

Final counters remain in the ignored receipt and completion response. The
repair has no commit or publication; independent verification is the next
phase after `RepairCompleted` is recorded.
