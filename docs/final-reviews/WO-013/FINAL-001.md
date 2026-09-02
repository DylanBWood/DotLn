# WO-013 final review FINAL-001

**Subject:** branch `wo-013`, worktree `DotLn-wo013`, uncommitted working tree,
2026-09-02. `HEAD` and `origin/main` are both
`df67601751cf2946f9e2b53dcb8650abb2e3d4fd`, the planning commit above the
published `v0.3.0` boundary (`3ea2704`); the branch carries no local commits,
so the entire subject is the dirty tree. At review open: twelve tracked
modifications (115 insertions / 54 deletions against `HEAD`, including the two
`docs/control` files) plus three untracked files — `scripts/test-temp-root.sh`
(233 lines), `scripts/test-fixture-temp-root.sh` (361), and
`docs/verifications/WO-013/VER-001.md` (504). The subject is exactly the tree
VER-001 passed: every deliverable blob — the six modified suites, the two new
scripts, `package.json`, the three documentation surfaces, and VER-001 itself
from the moment it existed — carries the identical hash in
`refs/dotln/checkpoint/WO-013/2` (implementation-ready), `/3` (verify
allocation), `/4` (verdict), and the working tree (§Dispatch and subject
integrity). This review adds this report, its PR body, one bounded wording
correction (§Corrections applied), and the lifecycle's own events.
**Authority:** `docs/work-orders/WO-013-portable-fixture-temp-roots.md` —
objective, observed problem, six scope clauses, deliverables, ten acceptance
criteria, evidence gate, write-back duty, and non-goals. Its H1 and
release-classification paragraph were amended by the executor during the order
(§Adjudications, item 1); the objective, scope clauses, deliverables, acceptance
criteria, evidence gate, write-back duty, and non-goals are byte-identical to
the activated text (one hunk, `@@ -1,17 +1,18 @@`). No ideation breakout was
opened in this order, so the work order carries no receipt and none is owed; the
control log records activation, implementation-ready, one verification, and this
review, with no repair episode.
**Prior reports:** `VER-001` (pass; no findings; nine criteria confirmed in
full, AC8's in-sandbox half confirmed and its outside-sandbox half disclosed as
not reproducible under harness policy; three observations). Complete sequence:
one report.
**Reviewer:** Claude Fable 5.1 (`claude-fable-5-1`), **effort `max`**, in Claude
Code 2.1.258 under the recorded `acceptEdits` plus sandboxed-Bash auto-allow
posture; macOS 15.6 (darwin 24.6.0, arm64), bash 3.2.57(1)-release
(`/bin/bash`), node v22.2.0, npm 10.8.0, git 2.55.0, Prettier 3.9.6. WO-013
permits any capable model. Every command in this report ran first-hand from this
worktree inside the sandbox; nothing is quoted from the executor's or verifier's
transcripts. No subagents were used.

**Verdict: WO-013 passes.** The defect the order was cut for is gone: the
unchanged `npm test` exits 0 from this worktree inside the sandbox that still
denies the pre-change `mktemp`, with no relocation, no mirror, and no approval
prompt. All ten acceptance criteria are met on first-hand evidence, with AC8's
outside-sandbox half carried as a disclosed limitation of both independent
episodes rather than a defect. Five independently written probes that never
invoke the new fixture suite re-derived criteria 2–6 across the six real suites
(84 suite × base cells, 19 direct guard cases, 10 signal runs, 2 mid-run guard
trips, one precious-tree check; every sentinel intact, zero residue), and a
mutation drill shows the fixture suite catches each of ten single-point breaks
of the guard. One bounded wording correction was applied. Nothing
acceptance-relevant was changed by this review.

## Self-referential instruments — disclosure

07-execution-guide.md §Discipline requires naming the instruments that are part
of the deliverable under judgment.

1. **`scripts/test-fixture-temp-root.sh` and `scripts/test-temp-root.sh` are
   both deliverable and evidence.** The fixture suite's 33 `PASS` lines are the
   executor's proof for criteria 2–6, and the helper is sourced by every other
   suite, so a green `npm test` is partly the helper certifying itself.
   Mitigation: probes A–E below source the helper directly or drive the six
   real suites end-to-end and never call the fixture suite; probe F inverts the
   relationship and treats the fixture suite as the subject, asking whether it
   fails when the guard is broken.
2. **`scripts/test-release.sh` is the fixture suite's signal target and is
   itself a modified subject.** Probe C delivers `INT` and `TERM` to the five
   other suites instead.
3. **`scripts/resume.mjs` allocated this report's path** and appended the
   `FinalReviewRequested` event. It is not under judgment: AC9 requires it
   byte-identical to `origin/main`, confirmed by `git diff --quiet` before use,
   and it is a fail-loud instrument (append-only log, regenerated projection).

## Dispatch and subject integrity

`docs/control/current.md` named WO-013 at phase `verified` with `final-review`
as the only legal action. `npm run resume -- final-review` ran inside the
ordinary sandbox with no approval escalation, allocated
`docs/final-reviews/WO-013/FINAL-001.md`, moved the phase to `final-review`,
and minted checkpoint `97cf19c5ff6533f569e8c6030872e55ad604f9c8`
(`refs/dotln/checkpoint/WO-013/5`). `docs/control/resume.jsonl` is a strict
append over `HEAD`: zero removed lines, six WO-013 events added
(`WorkOrderActivated`, `ImplementationReady`, `VerificationRequested`,
`VerificationCompleted`, `FinalReviewRequested`, and — after this report — the
`FinalReviewCompleted` the pass records).

No destructive git command ran in this worktree; nothing was restored from a
checkpoint. `git status --porcelain` was identical before and after the entire
probe programme, apart from the control files the transition wrote and the
artifacts this review adds.

Blob identity of the subject across the lifecycle (first ten hex digits;
`git hash-object` of the working tree against `git ls-tree` of each checkpoint):

| Path                                                     | working tree | checkpoint 2 | checkpoint 3 | checkpoint 4 |
| -------------------------------------------------------- | ------------ | ------------ | ------------ | ------------ |
| `scripts/test-temp-root.sh`                              | `ff9249d7ab` | same         | same         | same         |
| `scripts/test-fixture-temp-root.sh`                      | `926508168b` | same         | same         | same         |
| `scripts/test-backup-intake.sh`                          | `08aac257b5` | same         | same         | same         |
| `scripts/test-checkpoint.sh`                             | `7fae9d00b4` | same         | same         | same         |
| `scripts/test-publication.sh`                            | `aea5d8d7a2` | same         | same         | same         |
| `scripts/test-release.sh`                                | `134a4cbc98` | same         | same         | same         |
| `scripts/test-resume.sh`                                 | `46fd89aeba` | same         | same         | same         |
| `scripts/test-worktree.sh`                               | `fd5f19976c` | same         | same         | same         |
| `package.json`                                           | `74f2e0c21c` | same         | same         | same         |
| `docs/AI-HARNESS-SECURITY.md`                            | `24a4b1e1ab` | same         | same         | same         |
| `docs/planning/work-order-map.md` (before §Corrections)  | `8fa0169759` | same         | same         | same         |
| `docs/work-orders/WO-013-portable-fixture-temp-roots.md` | `e6dc353724` | same         | same         | same         |
| `docs/verifications/WO-013/VER-001.md`                   | `f85f276a96` | absent       | absent       | same         |

The verifier changed nothing in the deliverable, and VER-001 has not changed
since its verdict was recorded.

## Final evidence summary

Every line below is output this session produced.

### The defect, live, and the unchanged `npm test`

The sandbox's session base is `$TMPDIR` = `/tmp/claude-501`, physically
`/private/tmp/claude-501`, and `/tmp` is a symbolic link to `private/tmp`. The
exact pre-change operation still fails here:

```text
$ mktemp -d /private/tmp/dotln-publication-test.XXXXXX
mktemp: mkdtemp failed on /private/tmp/dotln-publication-test.BJsThP: Operation not permitted
exit: 1
```

With the change in place, the unchanged `npm test` from this worktree, twice
(both runs fully green; the exit status line of the first was lost to a shell
wrapper mistake of mine, not to the suite, and the second captures it):

```text
harness: Claude Code 2.1.258 (Claude Code); macOS 15.6 arm64; GNU bash, version 3.2.57(1)-release
cwd: <worktree> (branch wo-013, HEAD df67601)
TMPDIR=/tmp/claude-501 (physical: /private/tmp/claude-501)
residue before: [dotln-final-mirror dotln-probe.D6dhna dotln-resume-test.K7YNMg ]
$ npm test
All matched files use Prettier code style!
… 33 PASS lines …
fixture temp-root tests passed
publication checker tests passed
backup-intake tests passed
resume tests passed
checkpoint tests passed
worktree tests passed
release tests passed
# tests 77
# pass 77
# fail 0
npm test exit status: 0
```

No permission prompt appeared, no allow rule was accepted, no mirror or relocated
copy was used, and the `test` chain in `package.json` was not edited for the
run. This is the observable state change WO-013 was cut to produce: WO-006's
VER-001 through VER-003 and FINAL-001, and WO-007's FINAL-001, each disclosed a
relocated mirror; **this report discloses no such deviation.**

### Residue bracketing the whole episode

`dotln-*` entries directly beneath the resolved base, before the first
`npm test` and after the last probe and the removal of this review's own lab
directory:

```text
BEFORE: dotln-final-mirror, dotln-probe.D6dhna, dotln-resume-test.K7YNMg   (3)
AFTER:  dotln-final-mirror, dotln-probe.D6dhna, dotln-resume-test.K7YNMg   (3)
```

Identical, and identical to VER-001's listing. The three are pre-existing
residue from sessions dated 2026-09-01 and are recorded as an observation, not
deleted, as the evidence gate requires. Separately, 74 `dotln-*` entries remain
under `/private/tmp` from sessions predating this order; none was touched. This
review's probe lab (`dotln-wo013-final-lab`, created by this session beneath the
session base) was removed by this session at the end; it appears in neither
listing.

### Static checks

- `git diff --check`: clean before and after the correction.
- `npm run format:check`: clean (inside `npm test`, and re-run standalone after
  the correction).
- AC1: `grep -rn /private/tmp scripts/` returns nothing; the only temporary
  bases in `scripts/*.sh` are the six identical `tmp_base="${TMPDIR:-/tmp}"`
  lines at line 6 of each suite.
- AC7 scope: `git diff -U0` hunks for the six suites —
  `test-publication` `@@ -5 +5,7 @@` `@@ -13,8 +18,0 @@`;
  `test-backup-intake` `@@ -5 +5,7 @@` `@@ -10,8 +15,0 @@`;
  `test-resume` `@@ -5 +5,7 @@` `@@ -7,2 +12,0 @@`;
  `test-checkpoint` `@@ -5 +5,7 @@` `@@ -8,2 +13,0 @@`;
  `test-worktree` `@@ -5,3 +5,7 @@`; `test-release` `@@ -5,3 +5,7 @@`. Every
  hunk sits in the preamble; no assertion line moves. The three fenced
  `stat -f` sites are untouched (zero `stat -f` lines in the diff; now at
  `test-backup-intake.sh:25`, `test-resume.sh:105` and `:107`, matching
  VER-001's shifted line numbers).
- AC9: `scripts/resume.mjs`, `scripts/release.mjs`, `scripts/worktree.mjs`,
  `scripts/check-publication.mjs`, and `scripts/backup-intake.sh` are
  byte-identical to `origin/main` (`git diff --quiet origin/main --` each).
- AC10: `package.json` differs from `origin/main` in exactly one line, the
  `test` chain, which gains `bash scripts/test-fixture-temp-root.sh` ahead of
  the six suites; dependencies untouched. `git status` shows no `.claude/` or
  `docs/decisions/` path (the worktree's tracked `.claude/settings.json` is
  unchanged).
- Clean-room sweep over every changed and new file (a grep for URLs, e-mail
  shapes, internal-domain suffixes, commercial tracker names, gateway/VPN
  vocabulary, and absolute home paths): nothing. The runbook note sanitizes
  the session path as `[session-provided TMPDIR]`; VER-001 names only the
  sandbox base, not a home directory.

## Independent re-derivation

Six probes, all written by this session into its scratchpad and run against the
unmodified subject from a lab directory beneath the session base. Probes A–E
never invoke `scripts/test-fixture-temp-root.sh`.

### Probe A — the base matrix through all six real suites (84/84)

Each of the six suites × fourteen bases, with a sentinel file planted in the lab
before every run. `ok` requires exit 0 and no `dotln-*` residue beneath the
resolved base; `refuse` requires a non-zero exit and a stderr line that names
the rejected base. The messages, from `test-checkpoint` (identical in shape for
the other five):

| Base                        | Expected | Result | Message                                                               |
| --------------------------- | -------- | ------ | --------------------------------------------------------------------- |
| ordinary directory          | ok       | rc=0   | —                                                                     |
| directory with spaces       | ok       | rc=0   | —                                                                     |
| symlink to a directory      | ok       | rc=0   | —                                                                     |
| trailing `////`             | ok       | rc=0   | —                                                                     |
| nonexistent                 | refuse   | rc=1   | `rejected temporary base <lab>/nope: not an existing directory`       |
| a regular file              | refuse   | rc=1   | `rejected temporary base <lab>/not-a-dir: not an existing directory`  |
| unwritable (mode 500)       | refuse   | rc=1   | `rejected temporary base <lab>/unwritable: directory is not writable` |
| `/`                         | refuse   | rc=1   | `rejected temporary base /: filesystem root is not a fixture base`    |
| `.`                         | refuse   | rc=1   | `rejected temporary base .: path must be absolute`                    |
| `..`                        | refuse   | rc=1   | `rejected temporary base ..: path must be absolute`                   |
| `relative-base`             | refuse   | rc=1   | `rejected temporary base relative-base: path must be absolute`        |
| `<lab>/seg/../target`       | refuse   | rc=1   | `rejected temporary base <lab>/seg/../target: path is not a safe fixture base` |
| `TMPDIR=""`                 | refuse   | rc=1   | `rejected temporary base /tmp: directory is not writable`             |
| `TMPDIR` unset              | refuse   | rc=1   | `rejected temporary base /tmp: directory is not writable`             |

84 of 84 cells as expected; every sentinel survived; no `dotln-*` entry anywhere
under the lab afterwards. The last two rows are AC3's fallback: with `TMPDIR`
unset or empty the suites do select `/tmp`, and inside this sandbox that base is
unwritable, so they fail loudly and name it before creating anything.

### Probe B — the guard driven directly through the sourced helper (19/19)

Sourced `scripts/test-temp-root.sh`, resolved a symlinked base, created one
owned root, then planted decoys: a correctly named unowned sibling
(`dotln-probe-test.BBBBBB`), a wrong-named sibling, a same-shape directory under
a different parent, and a `BASE-SENTINEL` in the base, each holding a `keep`
file.

- the symlinked base resolves to its physical path; the root is created beneath
  that resolved path (AC2's "resolved form"); the ownership marker is written
  mode 600;
- eleven refusals, each with the guard's own message: empty root, the base
  itself, wrong basename, the unowned same-shape sibling (`refusing cleanup of
  unowned fixture root`), a different parent (`outside temporary base`), an
  unresolved symlink base (`refusing cleanup through changed temporary base`),
  a wrong prefix, a symlink standing where the owned root was, a replacement
  directory at the owned path without its marker, a tampered marker, and a
  second cleanup after the real one;
- every decoy and sentinel intact after all refusals;
- the one owned root, with nested content, removed exactly; the same-shape
  stranger and the base sentinel still present afterwards.

This is the ledger's adopted rule — cleanup authority follows provenance, never
filename familiarity — made executable: a correctly named stranger is refused.

### Probe C — `INT` and `TERM` on the suites the fixture never signals (10/10)

Started each of the five other suites as a job-controlled background process
(`set -m`, so it keeps default signal dispositions), polled at 10 ms until its
`dotln-<suite>-test.??????` root appeared, waited 50 ms, then signalled:

| Suite                | `INT` exit | `TERM` exit | Residue | Sentinel |
| -------------------- | ---------- | ----------- | ------- | -------- |
| `test-worktree`      | 130        | 143         | none    | intact   |
| `test-checkpoint`    | 130        | 143         | none    | intact   |
| `test-backup-intake` | 130        | 143         | none    | intact   |
| `test-resume`        | 130        | 143         | none    | intact   |
| `test-publication`   | 130        | 143         | none    | intact   |

VER-001's trap for future readers held: a background job in a plain
non-interactive shell has `SIGINT` ignored, so job control is required to
observe the 130s.

### Probe D — AC4's named behavior change, end-to-end (2/2)

The order requires `test-backup-intake.sh` and `test-publication.sh`, which
previously printed a refusal and exited 0, to fail closed. Each was started under
a controlled base; the moment its root appeared, the base was renamed away and a
same-named decoy directory planted at the original path:

```text
test-backup-intake   exit=1  decoy=intact  owned root under the moved base: present | error: refusing fixture-root cleanup without its ownership marker: …/dotln-intake-backup-test.4GIbbL
test-publication     exit=1  decoy=intact  owned root under the moved base: present | error: refusing unsafe fixture-root cleanup target …/dotln-publication-test.LXmX0z
```

Non-zero exit, nothing removed, in both. (The two messages differ because the
publication suite's next step had already replaced its view of the root by the
time the trap ran; both paths are refusals.)

### Probe E — a symlinked base over a directory of precious files (pass)

`TMPDIR` pointed at a symlink whose target held six files and a nested
subdirectory. After a full `test-checkpoint.sh` run (exit 0), the target's `find`
listing with per-file checksums is byte-identical, and no `dotln-*` residue
remains. An adversarial base cannot redirect cleanup outside the generated
directory (AC5).

### Probe F — mutation drill: does the fixture suite catch a broken guard?

Ten single-point mutations of `scripts/test-temp-root.sh`, each applied in an
isolated mirror (scripts, the tag-manifest template, `.gitignore`, and the two
kernel sources the release suite copies) and run through the mirror's own
`scripts/test-fixture-temp-root.sh` with a dedicated base and a sentinel
outside it. The unmutated control passes with all 33 `PASS` lines.

| Mutant                                   | Result | How the fixture suite failed                                                 |
| ---------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| M1 drop the parent-equals-base check     | caught | `different-parent` refusal case                                              |
| M2 drop the basename-shape check         | caught | `wrong-basename` refusal case                                                |
| M3 drop the in-process ownership check   | caught | `unowned-same-shape` case (the marker check refuses, but with the wrong reason) |
| M4 drop the marker-presence check        | caught | `replaced-root` case                                                         |
| M5 drop the marker-token comparison      | caught | `unsafe cleanup unexpectedly succeeded` at the changed-marker case           |
| M6 drop the `..`-segment rejection       | caught | `unsafe temporary base unexpectedly accepted`                                |
| M7 drop the `/` rejection                | caught | `filesystem-root` case (rejected for the wrong reason)                       |
| M8 exit with the suite's status on a cleanup refusal | caught | `unsafe EXIT trap` case expects exit 1                          |
| M9 remove the `INT` trap                 | caught | 15 s deadline, then `unexpected SIGINT result: … signal=SIGKILL`            |
| M10 `rm -rf` the base instead of the root | caught | first valid-base case: its sentinel is gone; the outside sentinel survived   |

M9 deserves a sentence: without the trap, bash does not die from a `SIGINT`
delivered while a foreground child that then exits normally is running, so the
release suite simply carried on and the fixture's deadline, not its exit-code
assertion, caught the mutant. The trap is load-bearing and the fixture detects
its absence; the detection route is the timeout. M10's over-broad delete was
contained to the mutant's dedicated base (which it destroyed, as expected); all
eleven outside sentinels survived.

## Verification-sequence soundness

VER-001 is the complete sequence. Time-indexed against the current process, it
meets every duty: it discloses its self-referential instruments, names its
model, effort, and harness, re-derives every fixture-covered criterion with
probes that do not use the fixture suite, states the AC8 limitation precisely
instead of inheriting it, records the executor's authority amendment as an
observation for this review rather than resolving it, and declares the ledger
skip. Its falsifiable claims re-checked here all hold: the `-U0` hunk ranges,
the shifted `stat -f` line numbers, the five `cmp` identities, the one-line
`package.json` diff, the three-entry residue listing (same names), the 74
entries under `/private/tmp`, the 33 `PASS` count, the harness version, and
bash 3.2.57. Its self-correction about `SIGINT` under non-interactive job
control is accurate and was needed here too. Its probe results are reproduced in
shape by probes A–D above with independently written code.

## Adjudications

### 1. The executor amended the work order's heading and release paragraph

The activated text carried the planner's placeholder in the H1 —
"(version assigned at activation)" — and a paragraph instructing the planner to
replace it with exactly one strict `vX.Y.Z` before `resume -- activate`.
Activation happened without that rewrite. The executor replaced the placeholder
with `v0.3.1`, rewrote the paragraph into a dated disclosure, and left the
append-only activation event alone (confirmed: `WorkOrderActivated` is
unchanged and the log removes nothing).

Assessed:

- **Necessary.** `scripts/release.mjs` reads the work order's first line and
  refuses release close unless it contains exactly one strict version. Left
  alone, the operator's eventual `resume: release close` would have thrown, and
  the correction would have had to happen then, with less review.
- **Correct on the merits.** The latest published tag is `v0.3.0`; the order
  itself names its class as a compatible test-infrastructure correction, which
  the roadmap's §Release boundary assigns to a patch; and the work-order map's
  suggested targets read "consecutive patches from `v0.3.1`". `v0.3.1` is the
  only value consistent with all three.
- **Scope-neutral.** One hunk; objective, scope clauses, deliverables,
  acceptance criteria, evidence gate, write-back duty, and non-goals are
  byte-identical to the activated text.
- **Authority-neutral.** The amendment fills a field the order designated for
  filling and that the lifecycle tooling requires; it grants the executor
  nothing. The release effect it enables still needs the operator's merge and a
  fresh, explicit `resume: release close` phrase, so the operator's authority
  over whether `v0.3.1` is cut is intact and is exercised at those two points.

Ruling: accepted as a disclosed, dated forward-correction of an activation
preflight miss, not a scope amendment; the general rule that executors do not
amend their own authority stands, and this case is tolerable only because all
four conditions above hold. The operator confirms the version by merging and by
the release-close phrase. Should the operator prefer another disposition, an
unpublished target may be retimed with explicit authorization and a dated
migration note (roadmap §Release boundary) without reopening this review, since
no scope or acceptance would change. **Hardening candidate:** `worktree start`
/ `resume activate` should refuse a work-order heading that `release.mjs` would
refuse at close; that check is one regular expression away and belongs with
WO-025's heading/version checks or a bounded lifecycle order.

### 2. AC8's outside-sandbox half

AC8 has two halves. The first — an unchanged `npm test` passing inside a
harness sandbox that permits only its supplied temporary root, with the
transcript captured with the harness name and version — is the reason the order
exists and is confirmed first-hand above (and, independently, in VER-001). The
second — "and also passes outside any sandbox" — cannot be reproduced by this
session or by the verifier: harness policy disables unsandboxed execution for
both. The evidence for it is the executor's runbook self-report (exit 0, 77/77,
empty before/after residue listings under a fresh owned base), every checkable
claim of which was accurate for VER-001 and again here.

Weighed: the code path is base-agnostic (nothing in the helper branches on
sandbox state; leaving the sandbox only makes more bases writable), the same
path was exercised across 84 suite × base cells and eleven fixture-suite
executions here, and the one behavior that differs unsandboxed — the
`TMPDIR`-unset fallback creating beneath `/private/tmp` — is the same
`mktemp`/guard/trap code proven everywhere else. Ruling: AC8 is met with a
disclosed limitation, not a defect; the missing artifact is one transcript.
One `npm test` from this worktree in a plain terminal closes it to the letter,
at the operator's option, before or after merge; it requires no other
re-verification.

## Corrections applied by this review

One correction, in the wording lane `docs/final-reviews/README.md` grants,
proven contained by diffing against checkpoint 5 and followed by a re-run of the
checks it could affect (`npm run format:check` and `git diff --check`, both
clean).

1. **`docs/planning/work-order-map.md`, the WO-013 catalog row.** Its evidence
   cell read "independent verification pending" — true when the executor wrote
   it, false at the moment it would be committed beside a passing VER-001 and
   this report. Following WO-007 FINAL-001 §Corrections item 1 and WO-015
   FINAL-001 F-1 (the same row class, corrected at final review for the same
   reason), the evidence cell now reads "`v0.3.1` tagging patch assigned;
   VER-001 pass; FINAL-001 pass; reviewed state committed and awaiting operator
   merge; `v0.3.1` remains unpublished pending a fresh release close; nominated
   at WO-006 FINAL-001" (with links), the preflight cell appends "operator merge
   and a fresh release close remain required", and the disposition cell reads
   "passed VER-001 and FINAL-001; awaiting operator merge and a fresh `v0.3.1`
   release close". Because the evidence column widened, the pinned formatter
   re-padded the table: `git diff` against checkpoint 5 shows 35 lines changed,
   while `git diff -w` shows exactly two — the separator rule, whose dashes
   lengthened with the column, and the WO-013 row. No other row's content
   changed. This discharges the order's write-back duty for the map
   ("moves from draft to its evidence state at close") as far as a pre-merge
   artifact can.

No other file was touched. VER-001, the work order, the runbook note, the six
suites, the two new scripts, and `package.json` are byte-identical to
checkpoint 5.

## Findings

**None blocking.** No acceptance criterion is unmet and no behavioral or
evidence defect was found. Observations, recorded and not scored:

1. **Executor model and effort are not in a committed artifact** (VER-001
   observation 2, carried). The runbook note names the final evidence session
   (Claude Sonnet 5, low effort) but not the executor's own configuration; the
   verifier's and this reviewer's are in their headers. WO-015 recorded the
   same gap; it is structural, and a control-log field is the natural home.
2. **The fixture suite asserts its environment before the unwritable case**
   (`test-fixture-temp-root.sh:154`–`:157`): if `chmod 500` does not make a
   directory unwritable — i.e. when run as root — the suite exits 1 with a
   named message rather than passing vacuously. Deliberate and correct; worth
   knowing before anyone runs `npm test` as root in CI.
3. **The `INT` trap's absence is detected through the fixture's deadline**
   (probe F, M9) rather than through its exit-code assertion, because bash
   survives a `SIGINT` that arrives while a normally-exiting foreground child
   runs. Detection is real; the route is the 15 s timeout. A cheap hardening
   would be a residue check that runs regardless of the node poller's outcome.
4. **A three-statement window** between `create_test_temp_root` and
   `install_test_temp_root_traps` exists in every suite; an interrupt landing
   there leaves the root behind. Microseconds wide, no repository or ignored
   material at risk, and the ownership marker would still identify the residue.
   Noted for completeness, not as a defect.
5. **Portability notes** (VER-001 observation 3, confirmed): every run here used
   macOS's `/bin/bash` 3.2.57 and the helper stays inside 3.2 features;
   `scripts/test-temp-root.sh` is a sourced library despite its `test-*.sh`
   name (running it directly is a harmless exit 0); the two new files are mode
   644 like `test-publication.sh` and `test-release.sh`, while four older suites
   are 755 — cosmetic, since the chain invokes all of them as `bash scripts/…`.
6. **Timing-sensitive fixture** (VER-001 caveat 3, confirmed): the signal cases
   poll at 10 ms with a 15 s deadline against `scripts/test-release.sh`. No
   drift across the three unmutated executions here (two full `npm test` runs
   and the drill's control) and VER-001's seven; a heavily loaded host remains
   the plausible future flake source.

### Candidates considered and not sustained

- *The shared helper hides each suite's guard from its reader* (scope clause
  5). Not sustained: each suite's preamble shows its base selection, its
  prefix, the creation call, the root assignment, and the trap installation by
  name; only the guard's implementation moved, and it is 233 lines a reader can
  open. The alternative — six copies of the registry, marker, and refusal
  logic — is what the clause's "reduces the duplicated safety logic" invites.
- *`.dotln-test-root-owner` could disturb a suite that enumerates its root.*
  Not sustained: the only enumeration is the pre-existing `case` guard at
  `test-release.sh:275`, which matches a path shape, not a listing; every suite
  is green.
- *Prettier would reject the new `.sh` files or the immutable reports.* Not
  sustained: `--ignore-unknown` skips shell scripts, and
  `docs/verifications/WO-*/` and `docs/final-reviews/WO-*/` are ignored;
  `format:check` is clean.

## Acceptance criteria

| #   | Criterion                                                       | Verdict | First-hand basis                                                                                                   |
| --- | --------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | No hardcoded `/private/tmp` or absolute temp base               | met     | `grep -rn /private/tmp scripts/` empty; only `${TMPDIR:-/tmp}` × 6                                                  |
| 2   | Honors valid `$TMPDIR` incl. spaces and symlink, resolved form   | met     | probe A (6 suites × 4 valid bases); probe B (physical placement beneath the resolved path)                          |
| 3   | Defined for unset/empty/missing/not-dir/unwritable, loud, named  | met     | probe A (6 suites × 6 refusal bases, each message names the base; fallback to `/tmp` observed and refused loudly)   |
| 4   | Cleanup fail-closed; removes only the generated root; six suites | met     | probe B (11 refusals, 1 exact removal); probe D (both formerly warn-and-continue suites exit 1, nothing removed)     |
| 5   | Adversarial base cannot redirect cleanup; sentinel fixtures      | met     | probes A, B, E — every sentinel and decoy survived; probe F M10 shows the fixture's own sentinels catch an over-broad delete |
| 6   | `INT`/`TERM`/exit traps leave no residue                         | met     | probe C (10 signal runs across 5 suites, exits 130/143, zero residue); probe D (refused EXIT trap leaves nothing)     |
| 7   | Each suite passes; diffs touch only the named lines              | met     | 7/7 in two `npm test` runs; `-U0` hunks confined to lines 5–20; `stat -f` sites untouched                            |
| 8   | Unchanged `npm test` passes in-sandbox and unsandboxed           | met, outside-sandbox half disclosed | in-sandbox: two green runs, exit 0, harness named and versioned; unsandboxed: executor self-report, see §Adjudications 2 |
| 9   | Five named scripts byte-identical                                | met     | `git diff --quiet origin/main --` each: identical                                                                   |
| 10  | No settings, allow rule, dependency, API, or schema              | met     | one-line `package.json` diff; no `.claude/` or `docs/decisions/` change; no persistent rule accepted in this session |

Scope clauses respected: base selection and guard only; `pwd -P`
normalization; every expansion quoted (probe A's space-containing base, VER-001's
probe E beyond it); the shared helper named in the result with its own negative
fixtures; the fail-closed change in the two suites named; the `stat -f` sites
untouched. Non-goals respected: no broad rewrite, no `stat -f` change, no runtime
change, no sandbox setting or persistent exception, no WO-006 artifact edited,
`scripts/resume.mjs` untouched.

## Remaining deviations and open questions

None requires a change to the subject.

- **AC8's outside-sandbox half** is carried on the executor's runbook
  self-report; one operator-run `npm test` outside the sandbox closes it
  (§Adjudications 2).
- **Publish step returned to the operator.** `npm run worktree -- publish`
  preflights `gh --version`, which exits non-zero in this sandbox because the
  GitHub CLI's configuration directory is read-denied, so the helper refuses
  before any push (fail closed; `gh --version` in this session fails the same
  way, `operation not permitted` reading the CLI's configuration file).
  The reviewed commit is made here; the operator runs the exact command from
  this worktree outside the sandbox, as for WO-006 and WO-007.
- **Ledger duty:** skipped as the work order declares and VER-001 confirmed —
  the deliverable implements the adopted fixture-hygiene rule more strictly
  (provenance-derived cleanup) without transforming it; `docs/lineage/` is
  untouched. No entry is owed for this review's one wording correction.
- **Release disposition:** WO-013 is `v0.3.1`, a patch above the published
  `v0.3.0`. After merge, the separately authorized `resume: release close`
  evaluates it and will re-run all merged evidence from the main checkout —
  now without any relocation; nothing here performs or implies a release
  action. If the main checkout's globally ignored, non-disposable
  `.claude/settings.local.json` is still present at that time, the release
  gate refuses it by name; move it out first.
- **Executor attribution gap** (observation 1) and the **activation preflight
  hardening candidate** (§Adjudications 1) are carried for a future process
  order.
- **Attribution:** the reviewed commit carries a plain subject and no
  attribution trailer, per the operator's standing rule and the repository's
  hand-authored history.

## Proposed PR

- **Title:** `:white_check_mark: WO-013: portable temporary roots for shell test fixtures`
  — the change lives entirely in test infrastructure (six suites, a shared
  test helper, a new fixture suite, and the `test` chain) with a runbook note;
  the repository reserves `:bug:` for defects in the tooling the product's
  operation depends on (WO-012, WO-015), and WO-101 is the test-lane precedent.
- **Body:** `docs/final-reviews/WO-013/PR.md`, committed alongside this report.

## Ready to merge — handoff

Closeout from here, per the playbook: `final-review-result pass` is recorded
before the reviewed commit (it also makes the map's "FINAL-001 pass" cell
true); the reviewed state is committed with a plain subject. The operator then
runs, from this worktree outside the sandbox:

```bash
npm run worktree -- publish WO-013 --title ':white_check_mark: WO-013: portable temporary roots for shell test fixtures' --body-file docs/final-reviews/WO-013/PR.md
```

The helper pushes only `wo-013`, opens the PR, and prints the release-close
handoff. The operator retains merge authority. After the merge, and only under a
fresh `resume: release close`, `npm run release -- close WO-013 --publish` runs
from the main checkout, reruns all merged evidence, and may cut annotated
`v0.3.1`.

## Method

Single reviewer, single session, no subagents. Read order: the execution
guide's dispatch and discipline sections, the control projection and log, the
work order, VER-001, the diff, both new scripts in full, the cited runbook and
ledger entry, and the WO-006 and WO-007 final reviews for the publish precedent.
Subject integrity was established through git object hashes, not through the
lifecycle script. Evidence was re-established first-hand: the live pre-change
failure, two full unchanged `npm test` runs with harness name and version, the
residue bracket, and the static checks. Criteria 2–6 were re-derived with five
probes written here that never call the fixture suite (84 + 19 + 10 + 2 + 1
cases, every case with a sentinel), and the fixture suite itself was judged by
a ten-mutant drill in an isolated mirror. The probe lab was created beneath the
session base by this session and removed by it; the three pre-existing residue
entries were listed before and after and left alone. The one correction was
applied after the evidence runs and the affected checks were re-run. Nothing was
restored from a checkpoint and no destructive git command was used.
