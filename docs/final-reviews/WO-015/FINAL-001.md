# WO-015 final review FINAL-001

**Subject:** branch `wo-015`, uncommitted working tree; review opened
2026-09-01, report written 2026-09-02. Base, `HEAD`, `origin/main`, and the
live remote `refs/heads/main` are all
`e696de63e71b628a719f993a88f2eaf6ac0bf80b`; the branch carries no local commits,
so the entire subject is the dirty tree. At review open: six tracked
modifications, 105 insertions / 51 deletions (92 / 43 excluding the two
`docs/control` files), plus the untracked 399-line
`docs/verifications/WO-015/VER-001.md`. This review adds this report, its PR
body, one bounded seven-line projection correction (§Corrections applied), and
the lifecycle's own events.
**Authority:** `docs/work-orders/WO-015-release-cadence-parser.md` — objective,
two-boundary scope fence, three deliverables, nine acceptance criteria, a
six-command evidence gate, closeout clause, and non-goals. Unmodified by this
review. WO-015 contains no ideation breakout receipt (grep for
receipt/ideation/breakout: no hits), and no ledger entry is owed (see
§Remaining deviations).
**Prior reports:** `VER-001` (pass, no findings, three observations) — the
only verification report.
**Inputs reviewed:** the work order end-to-end; VER-001 in full including its
observations and open questions; the complete diff and the untracked report;
the execution guide's resume, closeout, discipline, and model sections; the
final-review README; the cited roadmap release-boundary section and Principles
5, 7, and 10; WO-012 as process precedent; the WO-006 and WO-012 final reviews
as format and correction precedent; the control log, all five pre-review
checkpoints, and the clean-room boundary.
**Reviewer:** Claude Fable 5.1 at `ultracode` effort in Claude Code with
sandboxed Bash, fresh session dispatched by `resume: final review`. WO-015
permits any capable model.

**Verdict: WO-015 passes final review, with one bounded projection wording
correction applied.** All nine acceptance criteria hold on independent
re-derivation — by the shipped regex chain copied verbatim into a standalone
probe, by scratch-mirror reversion of each parser correction, and by a
TypeScript-compiler-API oracle that shares no code with the deliverable. The
evidence gate is green at every stage in this session. Thirty-seven candidate
findings were raised across five review lenses and a completeness critic; the
eight graded above note each went to three adversarial refuters. Two survived
at minor: a stale work-order-map projection, corrected here in the wording lane
the final-review README grants, and an off-by-range line citation inside the
immutable VER-001, corrected by citation in this report rather than by edit. A
third, the main checkout's own ignored settings file, survived as a handoff
instruction. Nothing touches code, a contract, acceptance behaviour, a schema,
compatibility, authority, or prior verification evidence, so the repair loop is
not triggered. The branch is ready for operator review and merge.

## Self-referential instruments — disclosure

Four instruments used by this review are themselves under judgment or outside
the committed record, and §Discipline requires saying so rather than trusting
them because they appeared to work.

1. **`scripts/release.mjs` and `scripts/test-release.sh` are both the
   deliverable and the instrument.** The cadence arrays this report certifies
   are produced by the changed `compatibility` function and pinned by the
   changed suite. I did not accept either's self-report: the regex chain was
   copied verbatim into a standalone probe and run against the canonical
   kernel sources; the parser lens proved its copy byte-identical to the repo's
   chain (29-line extraction, empty diff); the critic derived the same three
   arrays from the TypeScript AST with no shared code; and both parser
   corrections were reverted one at a time in scratch mirrors to watch a named
   assertion fail.
2. **`scripts/resume.mjs` allocated this report's path, minted the
   checkpoints, and will record the verdict.** It is not in the WO-015 diff
   (`git diff --stat HEAD -- scripts/resume.mjs` is empty), its failure mode is
   loud (append-only log with a regenerated projection), and the compliance lens
   folded the log independently without importing it and reproduced
   `docs/control/current.md` byte for byte.
3. **The review's own ability to run the shell suites came from an uncommitted
   file.** This session's sandbox permits writes under `/private/tmp/dotln-**`
   solely because the verifier-added, globally ignored
   `.claude/settings.local.json` in this worktree declares that allowance
   (VER-001 §Harness deviation). Neither the tracked `.claude/settings.json`,
   the user-level settings, nor the main checkout's local settings carry it.
   Every `npm test` and `bash scripts/test-release.sh` run in this review — the
   lead's and all five lenses' — depended on it, and VER-001 itself schedules
   the file for removal before closeout. No tracked file was touched to obtain
   any evidence; `.claude/settings.json` is byte-identical to `HEAD`. This is
   the WO-013 condition again and is not scored against WO-015. Because a
   sandbox allowance is a safety-boundary configuration, §Precedence requires
   the skipped §Discipline duty ("no config mutation of safety boundaries
   unless the work order authorizes it") to be recorded as an open question; it
   is, below. This review neither added nor removed that file.
4. **The review orchestration had a defect of its own.** The workflow script
   that fanned out the refuters passed promises where the harness expects
   thunks, so its aggregation step threw after the refuter agents had already
   run. All twenty-four refuters completed with a structured verdict; I
   recovered each verdict from the workflow journal by matching the finding
   embedded in that refuter's own transcript, and the tallies below are from
   those records, not from the failed aggregation. No agent's result was lost
   or inferred.

## Dispatch and subject integrity

`npm run resume -- final-review` allocated exactly
`docs/final-reviews/WO-015/FINAL-001.md` (the directory did not exist), advanced
the control state from `verified` to `final-review`, and minted checkpoint
`4189e6296f1af3a39daf95825aae1cccf5d85ee5` (`refs/dotln/checkpoint/WO-015/5`).
Checkpoint 5 differs from checkpoint 4 only in the two control files, and every
WO-015 checkpoint (1 through 5) is parented on `e696de6`.

- **Control log is a strict append.** The first 12,383 bytes (54 lines) of
  `docs/control/resume.jsonl` are byte-identical to `HEAD` under `cmp`; the
  file now has 59 lines; `git diff -U0` shows zero removed lines. The five
  WO-015 events form the legal path `WorkOrderActivated` →
  `ImplementationReady` → `VerificationRequested` → `VerificationCompleted`
  (pass) → `FinalReviewRequested`, each carrying the checkpoint SHA and ref that
  `git for-each-ref` reports. `docs/control/current.md` matches an independent
  fold of the log.
- **The verifier did not modify the subject.** `git diff --stat` from checkpoint
  2 (`ImplementationReady`) to checkpoint 4 (`VerificationCompleted`),
  excluding `docs/control` and `docs/verifications`, is empty. The four
  deliverable files under review are therefore the bytes the executor declared
  ready and the bytes VER-001 passed.
- **VER-001 is immutable.** Its SHA-256 is
  `33f7598fc8ee48c43903eedf556ee7ba3f79dadfb8f03d4a6cd0e2728748274b` on disk,
  and `cmp` against its copies in checkpoints 4 and 5 is silent.
- **The review fan-out modified nothing.** Before launching thirty agents I
  recorded the SHA-256 of `git diff --binary HEAD` (`aa8ed1e8…71cd5`), of the
  same diff excluding `docs/control` (`37b554a4…f009`), and of the porcelain
  status with untracked files (`aa6a0de0…7fda`). All three were identical after
  the fan-out completed, measured by me and separately by the critic. The only
  subject change in this episode is the map correction in §Corrections
  applied, made by the lead after the fan-out and after those measurements.

## Final evidence summary

Every item below was re-established in this session, not inherited.

- **Pre-fix four-result reproduction** against the canonical
  `packages/kernel/src/types.ts` and `core.ts`: old union match `ABSENT`;
  whitespace-tolerant union `Once, After, Every, Burst, Calendar, Window,
  While, Until, Gate, Sequence, Merge, Race, Repeat, Backoff` (14, source
  order, unique, all identifiers); old evaluator capture `["Once"]`; shipped
  `default:`-bounded capture `Once, After, Every, Gate, Until, Backoff` with
  `caseCount` 6 and switch indent two spaces; derived deferred `Burst,
  Calendar, Window, While, Sequence, Merge, Race, Repeat`. Byte-for-byte the
  work order's and VER-001's results.
- **Full unchanged `npm test`:** exit 0. Prettier `format:check` clean; the
  publication, backup-intake, resume, checkpoint, worktree, and release suites
  pass; `tsc -b --force` clean; `node --test` reports 68 tests, 68 pass, 0
  fail. The release suite printed `malformed cadence source refused before tag
  publication` and the exact six/eight arrays. The critic confirmed the log
  post-dates every subject file's modification time and that the tree it ran
  against hashes identically to the tree under review.
- **Static checks:** `git diff --check` clean; `node --check` on `release.mjs`
  and `bash -n` on `test-release.sh` clean; `npx prettier --check` clean on
  the roadmap, the map, the work order, VER-001, and `current.md`.
- **Reversion sensitivity (AC4), lead's own scratch mirrors** built from the
  eight files the suite reads (`scripts/*.mjs`, the suite, both kernel sources,
  the manifest template, `.gitignore`): the untouched mirror passes; reverting
  the union matcher to `export type T = ([^;]+);` fails at
  `scripts/test-release.sh:188` (`FAILED_AT_LINE 188: grep -Fq 'cannot derive
  cadence evaluator cases from source'`, because the run refuses with the
  `kinds` message instead); reverting the evaluator boundary to
  `([\s\S]+?)\n\s*\}` with the old extraction fails at `:187` with
  `error: malformed cadence source published`. The tests lens additionally
  showed both-reverted fails at `:188` and that mutating one expected array
  element raises an uncaught `AssertionError` that exits node non-zero and stops
  the shell. Note for future verifiers: `bash -x` cannot be used to trace this
  suite — its xtrace pollutes a `2>&1` capture and spuriously fails the
  dirty-checkout exact-message assertion; an `ERR` trap that prints `$LINENO`
  works.
- **Negative fixture is non-vacuous (AC5), positive control:** the same
  `cadencefailure` shape with the malformation omitted publishes, and its
  `GIT_TRACE` file (9,080 bytes, matching VER-001's figure) contains exactly
  `built-in: git mktag` and `git push --no-follow-tags origin
  <object>:refs/tags/v0.2.1`, with `v0.2.1` then present in the simulated
  origin. In the malformed run the trace is written (4,451 bytes, 27 built-ins
  per the tests lens), contains neither marker, the close exits non-zero with
  the expected message, and the origin's full `for-each-ref` listing is
  unchanged.
- **Fail-closed on every "missing structure" the scope fence names**, run by
  the critic with the chain sliced out of the working-tree `release.mjs` at run
  time: missing `Cadence` namespace, missing or renamed `Cadence.T` alias,
  empty union, duplicate member, missing `switch (cadence.kind)`, missing
  `default:` arm, and all case labels removed each refuse loudly with the
  documented message. Canonical source is accepted with the six/eight arrays.
- **Independent oracle (critic):** a derivation through the repository's
  TypeScript 5.4.5 compiler API — `ModuleDeclaration` →
  `TypeAliasDeclaration` → `UnionTypeNode` members, and the case labels of the
  top-level `SwitchStatement` in `evaluateCadence` — yields the identical
  14-member union, six evaluable, and eight deferred kinds, in order.
- **Toolchain:** node v22.2.0, npm 10.8.0, git 2.55.0, Prettier 3.9.6,
  TypeScript 5.4.5 — matching VER-001's header.

## Verification-sequence soundness

A single VER-001 pass with no findings is a sound basis for closure. Every
concrete citation in VER-001 was checked against the current files: the stub
`npm` at `test-release.sh:90`, the refusal assertions at `:187`–`:188`, the
`v9.9.9` guard at `:248`, `runEvidence`/`baseManifest`/`publishTag` at
`release.mjs:858`/`:861`/`:870`, the union at `types.ts:174–188`, the ledger's
effort-truth entry at `:475`, the `.prettierrc.json` defaults, the 68/68 count,
the 105/53 diff at verification time, and the three-plus/zero-minus control-log
delta at verification time are all exact. One range is not (see §Findings,
F-2). VER-001's disclosed "correction to my own analysis" does not contaminate
the evidence: the corrected chain of reasoning is independently true
(`runEvidence` precedes manifest construction; `evidenceCommands[1]` is
`npm test`; the suite copies live kernel source and asserts exact arrays, and a
relocated `default:` arm trips that assertion end-to-end, reproduced by the
tests lens with actual `["Once","After","Every"]`). VER-001's harness deviation
touched no tracked file and no checkpoint tree. Its unverified claim that
`tsc --strict` accepts the case-after-default shape was closed by the critic:
the variant compiles under the repository's compiler and is Prettier-stable, and
no ESLint configuration exists. VER-001's statement that twenty-three agents ran
is not verifiable from the repository and is not load-bearing.

## Corrections applied by this review

One correction, in the wording lane `docs/final-reviews/README.md` grants,
proven contained by diffing against checkpoint 5 and followed by a re-run of
the checks it could affect.

**`docs/planning/work-order-map.md`** — the "Legal now" bullet and the WO-015
catalog row said numbered independent verification and final review "have not
occurred" and "remain required". Both statements were true when the executor
wrote them and false at the moment they would be committed beside VER-001 and
this report. Three lenses raised it independently and nine of nine refuters
sustained it at minor. Following WO-006 FINAL-001 §Corrections item 1 — the
same block and the same kind of row, corrected at final review for the same
reason — the bullet now defers to the catalog row and the control projection
instead of naming lifecycle steps, and the row's evidence and preflight cells
now read "VER-001 pass; FINAL-001 pass; reviewed state committed and awaiting
operator merge; `v0.2.3` remains unpublished pending a fresh release close"
and "operator merge and a fresh release close remain required". The
recommendation cell is unchanged and still true. The change is seven lines
(`git diff refs/dotln/checkpoint/WO-015/5 -- docs/planning/work-order-map.md`:
7 insertions, 7 deletions), was re-printed through the pinned formatter, and
`npm run format:check` is green afterwards. The map declares itself "not
lifecycle or scope authority"; nothing in code, contract, acceptance behaviour,
schema, compatibility, authority, or prior evidence changed. As in WO-006, the
row's "FINAL-001 pass" cell is authored before the verdict event exists and is
made true by recording `final-review-result pass` before the reviewed commit;
the sequencing is disclosed here rather than hidden. The new FINAL-001 link
resolves once this report is in the same commit.

No other file was changed. The four deliverable files, VER-001, and the control
files are byte-identical to checkpoint 5 apart from the lifecycle's own events.

## Findings

Sustained after adversarial review. Grades follow the rubric blocking / major /
minor / note; none is blocking or major.

**F-1 (minor, corrected above): stale work-order-map projection.** See
§Corrections applied.

**F-2 (minor, recorded here; VER-001 is immutable): one VER-001 line-range
citation is off.** VER-001's AC6 row cites "`:248`–`:270` and `:318`–`:331`"
for five assertions. The first range correctly covers the `v9.9.9` unrelated-tag
guard (`:248`), the `cat-file -t v0.2.1 = tag` annotated check (`:264`), the
exact remote tag set (`:268`–`:269`), and the published object capture
(`:270`). The `already published` idempotency rerun is at `:272`–`:275` and the
seven-mutation `validate` loop (including the `cadence` mutation) at
`:293`–`:310`; `:312`–`:331` is the first-release Unicode fixture. Three
refuters confirmed no alternative numbering rescues the citation (the base file
is 323 lines with the loop at `:284`), and that the substantive claim — all
five assertions sit outside every diff hunk (`:55`–`:62`, `:171`–`:197`,
`:276`–`:292`) and still pass — is true. Readers of VER-001's AC6 row should
use the ranges given here.

**F-3 (minor, handoff instruction): the main checkout's own ignored
`.claude/settings.local.json` will refuse the release close first.** VER-001
§Required next actions names only this worktree's copy. But
`npm run release -- close WO-015 --publish` calls `ensureClean(main)` and then
`ensureNoIgnoredInfluence(main)` (`scripts/release.mjs:723`–`:725`) before it
ever spawns `worktree finish`, and the main checkout at
`/Users/dylanwood/Projects/DotLn` holds its own globally ignored, non-disposable
`.claude/settings.local.json` — confirmed read-only by me with the gate's own
`git ls-files --others --ignored --exclude-standard` filtered by its allow list,
which returns exactly that file. The close would refuse with `main checkout
contains ignored material that can contaminate release evidence:
.claude/settings.local.json`; after that is cleared, the worktree-finish gate
would refuse with `worktree contains ignored material and will not be removed:
.claude/settings.local.json (run npm run backup:intake or move it, then
retry)` until this worktree's copy is also moved out. The classification policy
is WO-004/WO-012 settled behaviour, pre-existing at base and outside WO-015's
scope; two of three refuters sustained the finding at minor as a handoff fact
and the scope refuter graded it note. Both files must be moved out of both
checkouts before the operator's `resume: release close`.

### Candidates refuted on adversarial review

Recorded so the operator can see what was considered and why it was rejected.
Each went to three refuters on distinct lenses (technical correctness, scope
and authority, reproducibility and evidence quality), each instructed to
default to refutation.

1. *A `case` clause after the trailing `default:` arm is silently classified
   deferred and survives the whole gate* (parser lens, graded minor) — refuted
   3/3 to note. The mechanism is real and was reproduced by the parser lens,
   the tests lens, the critic's AST oracle, and all three refuters: appending
   `case "Burst"` after `default:` leaves the arrays equal to the canonical
   six/eight, so the pin passes and `npm test` is green while a published
   manifest would call `Burst` deferred. It is VER-001 Observation 1. See
   §Adjudication below for why it is not scored against WO-015.
2. *The negative fixture's `mktag`/tag-push trace assertions have no
   `test -s` guard, so they would pass vacuously if the trace file were ever
   missing or empty* (tests lens, minor) — refuted 3/3 to note. Mechanically
   true (grep exits 2 or 1 inside an `if`, which `set -e` ignores), but today
   the trace is written and the markers are proven present in the positive
   control; the finding describes a hypothetical future regression of
   `execute()`'s environment handling, not a present defect, and the remedy is
   a test-code change outside this review's lane. Carried as a hardening
   candidate.
3. *The verifier's `.claude/settings.local.json` is "globally excluded", not
   "gitignored" as VER-001 says, and should be deleted before the reviewed
   commit* (compliance lens, minor) — refuted 3/3 to note. VER-001's operative
   statements (ignored, non-disposable, refuses removal, delete before
   closeout) are precise and verified; the file is in no checkpoint tree and
   altered no tracked file; the wording nuance is not a material error. This
   review deliberately leaves the file in place: it is a safety-boundary
   configuration the work order does not authorize any executor to mutate,
   VER-001 assigns its removal to the pre-close step, and F-3 makes the
   handoff instruction uniform (both checkouts, same step).

Twenty-nine further observations were graded note by their lenses and passed
through unrefuted by design; the lead spot-checked each against the files. The
ones worth carrying are listed under §Remaining deviations.

## Adjudication: VER-001 Observation 1 against "never accept a partial list"

This is the review's one real judgment call, and I record it so the call is
reviewable. The work order's scope bullet says: bound the evaluator capture "at
the switch's `default:` arm (or an equivalently explicit structural boundary)
rather than at an inner closing brace. Missing namespace, alias, switch,
default arm, or case set remains a loud refusal; never accept a partial list."
A reader could take the last clause to reach a *reordered* structure. I judge,
in agreement with VER-001 and all three refuters, that it does not, for four
reasons: the order prescribes the `default:` boundary by name and the
deliverable implements exactly that; the fail-closed clause enumerates *missing*
structures, and every one of them is proven to refuse loudly; every
reordered-structure variant requires editing `packages/kernel/`, which the
order forbids and which is byte-identical to `HEAD`, and no switch in the
kernel places a case after `default:`; and all nine acceptance criteria are
scored against canonical source, where the arrays are exactly right by three
independent methods. The gap is real for whichever future order implements a
deferred cadence, and the two-group remedy VER-001 proposes — capture through
the switch's own closing brace and count case labels across both groups — was
validated by the parser lens against the canonical, nested-switch, helper-
between, and `default: {` shapes while refusing every ordering variant.
Recommended for WO-102 or a bounded release-parser hardening order; not a
WO-015 repair, and not a final-review correction, because it changes code.

## Acceptance criteria

| #   | Criterion                                                                                   | Verdict | Evidence                                                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Fourteen `Cadence.T` members, once each, in source order                                    | met     | lead probe (verbatim chain), parser lens probe (chain proved byte-identical), critic AST oracle; union positions monotonic in `types.ts`                                                                                                              |
| 2   | Exactly the six implemented cases despite inner closing braces                              | met     | same three methods; the manifest extracted from a real simulated annotated tag carries the same six                                                                                                                                                |
| 3   | Deferred list is exactly the eight, in union order                                          | met     | same three methods; `assert.deepStrictEqual` in the suite                                                                                                                                                                                          |
| 4   | Fixtures use the shapes that reproduced the defect; reverting either correction fails a targeted assertion | met | canonical bytes are copied, not hand-built; lead mirrors: union reversion → `:188`, evaluator reversion → `:187`; tests lens: both → `:188`, array mutation → uncaught `AssertionError`                                                              |
| 5   | Malformed-source fixture refuses non-zero before `mktag`/push; origin unchanged             | met     | positive control proves the trace markers non-vacuous; malformed run exits non-zero with the named message, zero markers, origin listing unchanged; the critic proved every enumerated missing structure refuses                                    |
| 6   | Success fixture still creates one annotated tag, re-validates byte-for-byte, idempotent, no unrelated tag movement | met | assertions at `:248`–`:270`, `:272`–`:275`, `:293`–`:310` (corrected ranges, F-2) sit outside every hunk and pass in every run                                                                                                                       |
| 7   | `npm test` and `git diff --check` pass; verifier independently runs the targeted suite and records the arrays | met | both green in this session (68/68, exit 0; clean); VER-001 records the arrays and this report re-records them                                                                                                                                       |
| 8   | Diff limited to two code/test files and two projections; protected paths byte-identical     | met     | porcelain lists exactly the six paths plus VER-001; `git diff --stat HEAD` over `packages/`, `package.json`, `package-lock.json`, `docs/releases/`, `scripts/resume.mjs`, `scripts/worktree.mjs`, `scripts/check-publication.mjs`, WO-006 evidence, `docs/decisions/`, `docs/lineage/`, `.claude/settings.json` is empty; `release.mjs` hunks lie inside `compatibility` (lines 307–383) and mention no tag, push, evidence, or version text; the map correction is within the same file set |
| 9   | Roadmap says why `v0.2.3` was unpublished, names WO-015, implies no existing tag            | met     | the new paragraph names the manifest-derivation refusal after passing `npm ci`, the declared test evidence, and the built skeleton CLI, states "No local or origin `v0.2.3` tag was created", names WO-015 as the bounded fix-in-place continuation, and says the target "remains unpublished until…"; `v0.2.3` is absent from `git tag -l` and `git ls-remote --tags origin` |

## Remaining deviations and open questions

None requires a change to the subject.

- **Skipped safety-boundary duty, recorded under §Precedence.** The sandbox
  write allowance that let this review (and VER-001) run the unmodified suites
  lives in an uncommitted local settings file added with operator approval
  during verification. §Discipline forbids executors from mutating safety
  boundaries without work-order authority; the operator supplied that authority
  in-session, and this review neither extended nor removed it. WO-013 is the
  named home for the root cause; WO-014 carries the harness-posture
  reconciliation.
- **Open question (critic):** the 2026-09-01 WO-006 close fast-forwarded main
  at 22:26 and ran `npm ci` and `tsc` from the main checkout, yet that
  checkout's `.claude/settings.local.json` has birth and modification times of
  20:11 the same day and would refuse `ensureNoIgnoredInfluence` today. The
  timestamps are consistent with the file having been moved out and back with
  `mv`, which the helper's own message suggests; it cannot be reconciled from
  repository evidence and does not contradict the work order's failure
  provenance. It corroborates F-3.
- **Executor model, effort, and harness are not in any committed artifact**
  (VER-001 Observation 2; the work order's header asks for them, the
  execution guide asks for them "in your result"). The verifier's and this
  reviewer's configurations are in the respective report headers. The ledger's
  effort-truth entry already names the durable fixes; candidate for a process
  order.
- **Fixture coupling to live kernel source** (VER-001 Observation 3):
  implementing a deferred cadence in the ordinary position now fails the two
  exact-array assertions until they are updated. Deliberate pin; update, do not
  delete.
- **Shared refusal message:** "evaluator region not found", "switch not
  found", a missing `default:`, and a failed completeness guard all report
  `cannot derive cadence evaluator cases from source`. Splitting them is cheap
  hardening (VER-001 open question, confirmed by the parser lens).
- **Union reversion is pinned by a mute assertion:** the `:188` exact-message
  `grep -Fq` exits silently on failure, so a reader of a failed run sees only a
  non-zero exit. Correct but terse; a diagnostic message would help.
- **Trace assertions lack an existence guard** (refuted candidate 2): add
  `test -s "$cadence_trace"` after `:187` in a follow-on so the AC5 assertions
  fail closed if tracing ever stops reaching git.
- **Evaluator-region lookahead** requires the next top-level declaration after
  `evaluateCadence` to be exported (today `export interface ProgramStep`);
  otherwise extraction refuses loudly. Acceptable; noted so a future kernel
  edit is not surprised.
- **Malformation target:** the negative fixture removes the first four-space
  `default:` line in `core.ts`, which is `evaluateCadence`'s arm today and is
  guarded by the `process.exit(1)` if the replacement is a no-op. Fine now;
  would need re-targeting if an earlier switch appeared.
- **Attribution:** the reviewed commit carries a plain subject and no
  attribution trailer, per the operator's standing rule and the repository's
  hand-authored history; WO-012's merged branch commit (`8a790af`) carried a
  gitmoji in its subject, a pre-existing precedent deviation that is not
  rewritten.
- **Housekeeping (operator):** a worktree at `/Users/dylanwood/Projects/
  DotLn-wo006` remains on branch `plan-wo-015` (`30427f3`), whose content is
  already merged as `e696de6`. `release close WO-015` finishes only the
  `wo-015` worktree and never inspects it, so it does not block closeout;
  remove it and delete the branch from main when convenient.
- **Clean-room: pass, no violations.** Category sweep over the full diff,
  VER-001, and the work order (71 patterns across tracker/ALM product names,
  predecessor names, managed-host/gateway/employer terms, internal hostnames,
  non-public URLs, private identifiers, credentials): zero real hits; the three
  raw hits are a filename, an unchanged `process.env` fixture line, and
  VER-001's own boundary statement. `docs/intake/` holds only three `.gitkeep`
  files in this worktree.
- **Ledger:** no WO-015 entry exists at base or now, and none is owed. The
  roadmap's generalised sentence ("if any guarded release-close check refuses
  before tag creation … do not tag") stays inside the adopted ledger idea on a
  first-class fix-in-place recovery; the kernel and cadence semantics are
  untouched. WO-012's carried "reviewed merged commit" finding at
  `06-roadmap.md:75`–`:78` remains byte-identical, out of scope, and neither
  resolved nor contradicted by this edit.
- **Release:** tagging `v0.2.3` is a separately authorized post-merge action
  via `resume: release close`; nothing in this review performs or implies it.

## Proposed PR

- **Title:** `:bug: WO-015: release-manifest cadence parser repair` — the
  shortcode WO-012 used for the analogous release-gate patch; this defect
  blocked an authorized publication, so it is not the `:adhesive_bandage:`
  case.
- **Body:** `docs/final-reviews/WO-015/PR.md`, committed alongside this report.

## Ready to merge — handoff

Closeout from here, per the playbook: `final-review-result pass` is recorded
before the reviewed commit (it also makes the map's "FINAL-001 pass" cell
true); the reviewed state is committed with a plain subject. The publish helper
preflights `gh --version`, which exits 1 inside this session's sandbox because
the GitHub CLI's configuration directory is read-denied there, so the helper
refuses before any push (fail closed). The operator therefore runs, from this
worktree outside the sandbox:

```bash
npm run worktree -- publish WO-015 --title ':bug: WO-015: release-manifest cadence parser repair' --body-file docs/final-reviews/WO-015/PR.md
```

The helper pushes only `wo-015`, opens the PR, and prints the release-close
handoff. The operator retains merge authority. After the merge, and only under
a fresh `resume: release close`, `npm run release -- close WO-015 --publish`
runs from the main checkout; before that command, move both
`.claude/settings.local.json` files (main checkout and this worktree) out of
the repository (F-3), or the close refuses by name. The close reruns all merged
evidence and may cut annotated `v0.2.3` containing WO-006 plus this repair.

## Method

Review orchestrated as a thirty-agent workflow at `ultracode` effort: five
independent read-only lenses (parser correctness with twenty-five adversarial
source variants; test-suite adequacy with mirror reversions, a positive
control, and end-to-end variant runs; work-order compliance, byte-identity,
VER-001 citation audit, and an independent control-log fold; documentation
accuracy, projection currency, settled-decision consistency, and links;
clean-room sweep, conventions, and handoff preconditions read from the helpers'
code), three adversarial refuters per graded candidate (eight candidates,
twenty-four verdicts, recovered from the journal as disclosed above), and a
completeness critic that hunted for what the lenses had collectively not done
and closed each gap itself — the full-gate provenance check, the
TypeScript-AST oracle, the missing-structure refusals against the live chain,
the `tsc`/Prettier/ESLint claims, the non-goal checks against the live remote,
and the sandbox-allowance provenance. Every agent worked read-only against the
repository, in its own scratch directory, with mirrors for every mutation;
status and diff hashes were identical before and after. The lead reviewer
independently ran the full evidence gate, reproduced the four-result capture,
built four scratch mirrors for the reversion and positive-control runs, checked
VER-001's citations, the control-log append, the checkpoint deltas, and both
checkouts' ignored-material state first-hand, adjudicated Observation 1, and
applied and re-checked the one correction.
