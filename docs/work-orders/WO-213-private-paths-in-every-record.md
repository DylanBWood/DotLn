# WO-213 — Private paths stay out of every committed record: a new line that names an absolute home path in a JSON, JSONL, log or text record under the document roots fails the document check as Markdown already does, the follow-up register projects `<home>` in place of a home path and rewrites the one stored revision that holds one, the planning-receipt helper refuses a private path before it writes, and records bound for a registered target's documentation root pass the same screen before they are committed there (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. The document check refuses a new class
of line (a home path in a non-Markdown record), so an instance whose own
committed records hold one fails `npm run test:docs` after taking the
update until its next order's executor corrects them on the operator's
dispatch; `npm run plan -- receipt`, the
hold, disposition and amendment commands, WO-210's `resume target-records`
and `plan target-publish` refuse an input they accepted before; the
register's stored text changes once. No schema, command or
flag changes. Assigned at activation under the standing opt-out default.
**Cost:** adds `scripts/lib/private-paths.mjs` (the private-path pattern
moved unchanged out of `scripts/docs-check.mjs` lines 514-515, its
home-directory alternative, the record extensions, a per-file rule and a
`<home>` substitution); a record listing and a per-type rule in
`scripts/docs-check.mjs` (`recordFiles`, `homePathFindings`, `checkDocs`);
the record lines that hold a home path today as fingerprints in
`docs/control/doc-baseline.json` `homePaths` (291 lines in 37 files at
`6dbd8771` once the register is rewritten); the substitution in
`scripts/lib/planning-followups.mjs` (`collectFollowupSources`, `projected`,
`retained`, `unionFollowups`); pre-write screens in
`scripts/lib/plan-receipts.mjs` (`writePlanReceipt` and the four event
appends); pre-write screens in WO-210's `scripts/lib/target-records.mjs`
(the records-only commit) and `scripts/lib/target-planning.mjs` (the
target-scoped planning publication); fixtures in `scripts/test-docs-check.mjs`,
`scripts/test-process-debt.mjs`, `scripts/test-worktree-integration.mjs`,
`scripts/test-plan-refutation.mjs` and `scripts/test-target-worktree.mjs`; one
retained evidence script.
Removes the Markdown-only reach of the screen (the first limit WO-188 D014
records), the register's one stored copy of a home path, the
hand-baseline route receipt 044's statement line took (`d28fcac0`), and the
chance that a record carries a home path into a public target repository
(DotLn-Angular is public, product 12 §One workstream across repositories).
Wall-clock: docs-check reads every record file under the roots on each run;
at `6dbd8771` that is 3,544 files and 206.9 MB, which a whole-file test
before line splitting read in 255 to 277 ms warm and 922 ms cold across
this drafting worker's three rounds (host load average about 7 on 16
CPUs); the executor measures docs-check before and after (steps 1 and 14);
the target screens add one whole-text test per record a target receives.
Commands: none added; seven existing write paths refuse one more input
class. Context bytes: the baseline grows by the fingerprints above (about
24 KB by estimate); no document a session reads at cold start grows except
by the two write-back sentences. Tokens: unknown until run. Steps: one
retained evidence script and one register sync the order runs once.
Re-mints: none. `scripts/docs-check.mjs`, `planning-followups.mjs`,
`plan-receipts.mjs`, the new module and WO-210's two target modules are
neither registered evidence
sources (`scripts/lib/evidence-sources.mjs`) nor feedback-judged files
(`FEEDBACK_SOURCE_PATHS`, `packages/skeleton/src/feedback-audit.ts` line
15); the new module stays out of `scripts/lib/helpers.mjs` and
`scripts/lib/terms.mjs`, which are registered (evidence-sources.mjs lines
119, 178 and 346). The three changed sources are declared machinery sources
(`scripts/test-runner.mjs` lines 117, 119, 124, 265 and 378), so
`npm test -- --review` runs before handoff.
**Nomination provenance:** the 2026-10-13 standard planning pass
([planning document](../planning/standard-pass-2026-10-13.md) §5, the
WO-213 row): the forward-only screen WO-188 built reads Markdown only,
and ten JSON, log and text evidence files carrying the operator's absolute
home path were committed after it landed, against the in-force policy (WO-188
operator-review assumption 7, settled on FUP-af65972e5491da22 onto WO-188
D014) and the operator's standing instruction never to commit private
identifiers. Carries FUP-589c1d588cb302a9 (WO-118 D014's followup: the
WO-187 records and the register row derived from WO-187 D043 hold the path;
decide on correction and on JSON coverage) and FUP-7e0490f3c107e919 (the
receipt helper screens local terms and not private paths). Rewrites the
stored summary of FUP-de6162b279f66709 without changing its disposition.
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no path value appears in this order or may appear in its evidence; fixtures
use synthetic names such as the home directory of a `fixture-user` account,
as `scripts/test-docs-check.mjs` line 1441 already does; this order names
them in words, because its own Markdown meets the screen it extends.
Amended by the same pass under the operator's 2026-10-13 sizing direction
(planning document §12): the queue is serial, so the placement names its
position; the **Preflight:** line is added; the provenance cites §5's row;
the write-back step regenerates the decisions index. Amended in a second
round by the same pass under the operator's 2026-10-13 direction that a
target repository keeps its own records (planning document §12.8): the
records WO-210 writes into a registered target's documentation root, and a
target-scoped pass's planning and product documents, pass the same screen
before they are committed there (steps 12 and 13, criterion 6), so WO-210 is
a typed hard edge.
**Depends on:** WO-188 merged (closed, v0.71.0: the screen, the baseline
shape and the policy this order extends); WO-210 merged (queued, placed
directly before this order: the records-only commit and the target-scoped
planning publication whose writes this order screens).
**Recommended placement:** position 3 of the serial queue (planning
document §12), after WO-210 and before WO-080: it screens the records WO-210
first writes into a public target, so it follows WO-210 directly, and it
precedes every later order so the record screen holds for the evidence each
of them files. This order edits
`scripts/lib/private-paths.mjs` (new), `scripts/docs-check.mjs`,
`scripts/lib/planning-followups.mjs`, `scripts/lib/plan-receipts.mjs`,
WO-210's `scripts/lib/target-records.mjs` and `scripts/lib/target-planning.mjs`,
five test files, `docs/control/doc-baseline.json`, `docs/planning/followups.json`
(by its own sync), `docs/README.md` and product 09. WO-193 later edits
`collectFollowupSources` and `scripts/test-plan-refutation.mjs` and rebases
on this order. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-188",
    "relation": "satisfied-by-close",
    "reason": "the forward-only home-path screen, its fingerprint baseline and the records policy this order extends to non-Markdown records"
  },
  {
    "workOrderId": "WO-210",
    "relation": "hard",
    "reason": "the records-only commit and the target-scoped planning publication whose writes into a registered target's documentation root this order screens"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Documentation
freshness and ownership (write-backs edit the sentence in place) and
§Preflight before the full gate (the **Preflight:** line below);
09-audit-resilience-privacy.md §Privacy and minimization; `docs/README.md`
§Map, the document-gate paragraph (lines 81 to 104, the activation-baseline
sentence at lines 94 to 96); `docs/work-orders/WO-188-boarded-machinery-items.md`
item 12 (lines 193 to 197), criterion 12 (lines 420 to 424) and
operator-review assumption 7 (lines 574 to 577);
`docs/evidence/WO-188/decisions.md` D014 (lines 319 to 337, with its stated
limits); `docs/evidence/WO-118/decisions.md` D014 (lines 405 to 430);
`scripts/docs-check.mjs` (`markdownFiles` lines 209 to 237, the private-path
pattern and `homePathFindings` lines 511 to 530, the baseline validation in
`checkDocs` lines 1473 to 1487, the fingerprint loop lines 1590 to 1606);
`docs/control/doc-baseline.json` `homePaths`;
`scripts/lib/planning-followups.mjs` (`collectFollowupSources` and its
`add` lines 91 to 117, `followupStatus` lines 211 to 218, `validate` lines
219 to 313, `retained` lines 324 to 338, `unionFollowups` lines 352 to 380,
`projected` lines 401 to 436, `syncFollowups` lines 461 to 481);
`scripts/lib/worktree-integration.mjs` `resolveProjections` (lines 201 to
235: the union runs on a register conflict); `scripts/refute-plan.mjs`
(`followups --sync` lines 235 to 239, `receipt --statement` lines 375 to
391); `scripts/lib/plan-receipts.mjs` (`writePlanReceipt` lines 764 to 846
with its local-terms screens at lines 798 to 804 and 826 to 829, the event
appends at lines 1162 to 1172, 1217 to 1227, 1349 to 1356 and 1471 to 1481,
`validateReceipt` line 189); `scripts/lib/entropy-review.mjs`
(`entropyScratchLane` lines 317 to 318, `subjectRecord` lines 373 to 380,
`fileReceipt` lines 814 to 866); `scripts/test-runner.mjs` line 1560 (a task
record's `productReadLog`); `scripts/lib/machinery-coverage.mjs`
(`uncoveredMachinerySources`); the fixtures at
`scripts/test-docs-check.mjs` lines 264 and 1436 to 1495,
`scripts/test-process-debt.mjs` line 6327,
`scripts/test-worktree-integration.mjs` lines 1228 to 1246 and
`scripts/test-plan-refutation.mjs` lines 2048 to 2084. Second round: the
[planning document](../planning/standard-pass-2026-10-13.md) §12.8;
`docs/work-orders/WO-210-instance-orders-reach-release-close.md` Design (the
records-only commit and the target-scoped planning publication, with their
local-terms screens) and its steps 44 and 54, which create
`scripts/lib/target-records.mjs` and `scripts/lib/target-planning.mjs`;
`scripts/test-target-worktree.mjs` (WO-072's real-Git fixture, which WO-210
extends).

**Objective:** No new committed record under the document roots names an
absolute home path. A new or edited line that names one in a JSON, JSONL,
log or text file under a configured document root fails
`node scripts/docs-check.mjs` at its file and line without printing the path,
against a fingerprint baseline of the lines that hold one today, exactly as
Markdown lines already do; the follow-up register projects `<home>` in place
of a home-directory path in a source's title and summary and rewrites, once
and in place, the one stored revision that holds one; and the planning
receipt helper refuses, before it writes, a receipt or an event that would
fail that check. A record WO-210 writes into a registered target's
documentation root (an order's file, decisions and reports, or a
target-scoped pass's planning and product documents) passes the same
per-type rule before it is written or committed there, so no home path
reaches a target repository through the workflow. Existing filed records
stay as written.

**Observed gap (dated 2026-10-13 at main `6dbd8771`):**

- The screen reads Markdown only. `markdownFiles` keeps a file only when it
  ends in `.md` (`scripts/docs-check.mjs` line 230); `homePathFindings`
  (lines 516 to 530) reads those files; `checkDocs` passes the same list
  (lines 1487 and 1596). WO-188 D014 records the limit ("the screen reads
  Markdown under the configured document roots", decisions.md line 336).
- `git grep -c -F "$HOME/"` over `6dbd8771` (counts only) finds the literal
  home prefix in 112 tracked files: 74 Markdown files (88 lines), every one
  among the 128 Markdown files `homePaths` declares (219 lines), and 38
  non-Markdown files, all under `docs/`: 29 `.json` (263 lines), 5 `.log`
  (21 lines), 4 `.txt` (8 lines), no `.jsonl`. Ten of the 38 were added
  after the screen's commit `1aea2dea` (2026-10-09): WO-189 at `1154daa7`
  (two), WO-198 at `5b5ae945` (one), WO-200 at `a37a1bb3` (three) and
  WO-203 at `1c915c1c` (four), against assumption 7 ("New records never
  carry an absolute home path", WO-188 order line 574).
- The home-directory alternative of the pattern (`/Users/<name>` or
  `/home/<name>`) matches exactly those 38 files and 292 lines among
  `.json`, `.jsonl`, `.log` and `.txt` under the roots. The full pattern,
  which also matches private temporary paths, matches 75 such files and 479
  lines; 187 lines (55 `.json`, 112 `.txt`, 20 `.log`) hold only a
  temporary-directory path. Some of those are written by a command: an
  Entropy Reducer receipt records its frozen copy's absolute temporary path
  in `subject.scratchRepository` ("which filing reopens",
  `scripts/lib/entropy-review.mjs` lines 377 to 380, under the system
  temporary directory per `entropyScratchLane`, lines 317 to 318), and the
  two receipts filed after the screen (REVIEW-006 and REFUTATION-007,
  `515794ee`, 2026-10-10) carry such paths in three fields and no home
  path. WO-188 D014 lists this as a known limit.
- The register holds the path in one place: FUP-de6162b279f66709's only
  stored revision's `summary`, projected from WO-187 D043 by
  `collectFollowupSources`' `add`, which stores `compact(body, 700)` with no
  substitution (`scripts/lib/planning-followups.mjs` lines 109 to 113). A
  hand edit cannot hold: `projected` appends a revision whenever the last
  stored one differs from the source (lines 419 to 420); `retained` refuses
  a committed revision that was rewritten (lines 324 to 338); every register
  command first runs a check-mode sync that refuses "register is stale"
  (lines 471 to 475); a union refuses divergent revisions (lines 355 to
  361). An appended revision would keep the path in revision 1 and turn the
  row `needs-review` (`followupStatus`, lines 211 to 218).
- Fourteen planning receipts' JSON hold a private path: twelve in
  `episode.statement` (ten home paths, two temporary paths) and two in
  copied order criteria (temporary paths). `writePlanReceipt` screens only
  the local-terms list before writing (lines 798 to 804 and 826 to 829,
  writes at 835 to 843), so receipt 044's statement line reached an
  immutable record and was declared historical by hand (`d28fcac0`,
  FUP-7e0490f3c107e919). The four event appends to
  `docs/control/plan-refutations.jsonl` (lines 1162, 1217, 1349 and 1471)
  screen only local terms too.
- WO-118 D014 routed the WO-187 records and the derived register row to
  the planner and rejected correcting WO-187's records inside WO-118
  (decisions.md lines 405 to 430).
- From WO-210 (placed directly before this order), the order's file,
  decisions and reports of a target order, and a target-scoped pass's
  planning and product documents, are committed into a registered target's
  documentation root, a public repository for DotLn-Angular (product 12 §One
  workstream across repositories); at `6dbd8771` no such route exists, and
  WO-210 screens those writes with the local-terms list only (its Design).
  Raw evidence stays in the instance (planning document §12.8).

**Design (scope discipline):**

- **One rule, two classes, one baseline.** A new module,
  `scripts/lib/private-paths.mjs`, holds the existing private-path pattern
  (unchanged; the fixture at `scripts/test-docs-check.mjs` lines 1460 to
  1478 pins its nine forms) and its home-directory alternative. Markdown
  keeps the full pattern and its message. A `.json`, `.jsonl`, `.log` or
  `.txt` file under a configured document root is screened for the
  home-directory alternative only. Both share the `homePaths` map, the
  per-file counted multiset and the fingerprint (`hash(normalized(line))`)
  that Markdown uses today, so the baseline's shape, validation (lines
  1473 to 1486) and the kit's seeded baseline (no `homePaths` key, read as
  empty) are unchanged.
- **Why records refuse home paths and not temporary paths.** The in-force
  policy is about the home path (assumption 7); the account name is the
  private identifier. Temporary paths are written by a command into
  hash-chained receipts (the Entropy Reducer subject above) and appear in
  187 record lines today (55 `.json`, 112 `.txt`, 20 `.log`); refusing
  them would refuse the next `planning: entropy reducer` filing after its
  immutable write. Declined: the full pattern over records (reopen when
  an operator decision names temporary paths as private in records, with
  the entropy subject's temporary path removed first).
- **Which files.** Tracked and untracked, non-ignored files with one of the
  four extensions under a configured document root (never the repository
  root, whose `package.json` and similar are not records), excluding the
  intake and `control/local` roots, listed the way `markdownFiles` lists
  Markdown. Declined: every text file under the roots (evidence probes
  `.mjs`, `.sh`, `.tap`, `.diff` and extensionless pin files hold no
  home-directory line at `6dbd8771`, and probes build fixture paths
  legitimately).
- **Cost.** Each file's text is tested whole before it is split into lines;
  only a matching file is split. The executor records the measured cost;
  ER4-005 (FUP-fb8cbeabbddef397) is the standing concern that a recurring
  gate grows with closed history.
- **The baseline is computed from the base, never written by a command.**
  A retained evidence script prints the fingerprints of record lines that
  match and are identical in the base commit's blobs, and refuses a
  matching line absent at the base; the executor merges its output.
  Declined: a baseline-writing command (D014's reopening condition names
  the hazard of admitting a new line; a command makes that one step);
  correcting the filed records (assumption 7; the ten post-screen files are
  filed evidence of closed orders and are named in the decision as the
  breach).
- **The register substitutes by pattern, at projection.** `add` passes the
  compacted title and summary through the substitution; the substitution
  never lengthens a string (`<home>` is six characters, every match at
  least seven), so `validate`'s 200- and 700-character bounds (lines 258
  to 259) hold. The source hash stays the digest of the raw body (line
  110), so source identity and revision count do not change. Substituting
  by pattern keeps the projection identical on every host; using the
  running host's home directory is declined because two hosts would
  project different bytes and the check-mode sync would flap.
- **The one stored revision is rewritten in place, by sync.** `projected`
  maps every stored revision's title and summary through the substitution
  before comparing, so the first sync after the change rewrites
  FUP-de6162b279f66709's revision 1 and appends nothing; `retained` admits
  a stored revision equal to the substitution of its committed form and
  still refuses every other change; `unionFollowups` substitutes on both
  sides before comparing, so integrating a branch that still holds the raw
  revision resolves to the rewritten one. `validate` and `committedState`
  are unchanged, so the committed register reads before the rewrite.
  Declined: a hand edit (re-projected and refused as stale); appending a
  revision (keeps the path, flips the row to `needs-review`); a one-shot
  migration command (a command for one use). The register is a projection,
  not a filed record, so this rewrite does not reach assumption 7.
- **The receipt helper refuses before it writes; it never redacts.** Beside
  each local-terms screen in `plan-receipts.mjs` whose text is then
  written, the same text is screened with the rule of the file it lands in
  (`receipt.md` by the Markdown rule, `receipt.json` as written and the
  JSONL event line by the record rule). The statement is the parent's
  attested text and the result is hash-frozen, so a silent redaction is
  declined; the refusal names the part and line and the placeholder, and
  the parent rewrites its statement. Reading paths are untouched:
  `validateReceipt`, `readReceipts` and `checkPlanGate` still accept the
  committed receipts that hold a path. Declined here: the same screen in
  the Entropy Reducer's `fileReceipt` (lines 814 to 866), whose two
  post-screen receipts hold no home path (reopen when an entropy receipt
  line fails the record rule), and a `persist` screen in the register (the
  document check covers `docs/planning/followups.json` before any commit).
- **Records bound for a target root take the same rule, before the
  write.** WO-210's records action (`scripts/lib/target-records.mjs`) and
  planning publication (`scripts/lib/target-planning.mjs`) screen each file
  they would write into the target with `privatePathLines(name, text)`
  beside their local-terms screen: Markdown (every record kind an order
  carries, and the planning and product documents) under the full pattern,
  a record extension under the home-directory rule, any other type
  unscreened as under the roots. A match refuses before anything is written
  in the target or committed and before any event is appended, naming the
  record's path under the root and the line, never the path text; the
  refusal names the placeholder remedy, and the role rewrites its own record
  in the order launchpad (a refusal, never a redaction, as for receipts).
  The target root is not a configured document root of the instance, so
  `docs-check` does not reach it; the screen at the write is the only one.
- **Placement of the shared code.** Not `scripts/docs-check.mjs` (it loads
  Prettier's Markdown parser at import, line 33, which the register and
  receipt commands do not need) and not `helpers.mjs` or `terms.mjs`
  (registered evidence sources; a change would re-mint editions).

**Execution plan (the executor follows these steps in order; observed at `6dbd8771`, 2026-10-13):**

1. Base observation, no code: create `docs/evidence/WO-213/README.md` and
   record the per-type counts of record lines holding the literal home
   prefix at the base, as counts and repository-relative names only
   (`git grep -c -F "$HOME/" <base> -- . ':!*.md'`), and three timed runs of
   `node scripts/docs-check.mjs` (its PASS line names the declared
   historical home-path lines, 219 at `6dbd8771`). Check: at `6dbd8771`
   the counts are 38 files and 292 lines (29 `.json`/263, 5 `.log`/21,
   4 `.txt`/8, no `.jsonl`); the executor records its base's figures and no
   line text.
2. `scripts/lib/private-paths.mjs` (new; `scripts/lib/` exists): export
   `PRIVATE_PATH` (the pattern at `scripts/docs-check.mjs` lines 514 to 515,
   moved unchanged), `HOME_DIRECTORY` (its home-directory alternative with
   the same leading look-behind), `RECORD_EXTENSIONS` (`.json`, `.jsonl`,
   `.log`, `.txt`), `privatePathRule(name)` (Markdown: `PRIVATE_PATH`; a
   record extension: `HOME_DIRECTORY`; otherwise none),
   `privatePathLines(name, text)` (the 1-based lines the rule matches,
   testing the whole text first) and `withoutHomeDirectories(text)` (each
   home-directory match replaced by `<home>`). Test patterns carry no
   global flag, so no `lastIndex` state leaks between calls. The module
   names no document root (the `configuration-root` suite scans every
   non-test script, `scripts/test-runner.mjs` line 242) and its comments
   explain without report labels (the comment-label check runs in the
   document gate). Check: `node --check scripts/lib/private-paths.mjs`;
   behavior is checked in steps 4, 6, 7, 11 and 13.
3. `scripts/docs-check.mjs`: import the module and drop the local pattern;
   add `recordFiles(root)` beside `markdownFiles` (lines 209 to 237), with
   the same Git listing, keeping record-extension files under a configured
   document root only and excluding the intake and `control/local` roots;
   `homePathFindings` (lines 516 to 530) applies `privatePathRule(file)` per
   file and keeps its Markdown default; `checkDocs` gains a `records`
   option (default `recordFiles(root)`) and runs the fingerprint loop
   (lines 1592 to 1606) over Markdown and records against the same
   `homePaths`; a record failure reads `<file>:<line>: absolute home path
   in a record; write a repository-relative path or a placeholder such as
   <home>/ or <worktree>/` and never prints the path; the Markdown message
   is unchanged. Check: step 4.
4. `scripts/test-docs-check.mjs`: a test beside "a home or private
   temporary path in a document fails at its line; baselined lines pass
   until edited" (line 1436): a line naming a `fixture-user` home directory in a `.json`,
   `.jsonl`, `.log` and `.txt` file under the evidence root each fails at
   its line and the output never contains `fixture-user`; a `/tmp/` and a
   `/private/var/folders/` line in a record passes; a baselined record line
   passes and an edited or duplicated one fails; the same line in a `.json`
   at the repository root, under the intake root, under `control/local` or
   in a `.mjs` file under the evidence root is not read; one case under a
   configured document root (`fixture(t, roots)`, line 264); the existing
   Markdown cases pass unchanged. Check: `npm test -- --only
   docs-check-fixtures`.
5. `scripts/lib/planning-followups.mjs`: `add` (lines 109 to 113) passes
   the compacted title and summary through `withoutHomeDirectories`;
   `projected` (lines 401 to 436) maps every stored revision's title and
   summary through it before the comparison at line 419, so a stored
   revision holding a home path is rewritten in place and none is
   appended; `retained` (lines 324 to 338) also accepts a stored revision
   equal to the substitution of its committed form, and any other change
   still refuses with its message; `unionFollowups` (lines 352 to 380)
   substitutes on both sides' revisions before `longer` compares them;
   `validate`, `committedState` and `persist` are unchanged. Check: steps 6
   and 7.
6. `scripts/test-process-debt.mjs`: a test beside "follow-ups retain
   changed, removed and overlapping public sources without importing local
   prose" (line 6327): a decision source whose followup names
   a file `x` in a `fixture-user` home directory projects `<home>/x` in title and summary, and
   the same bytes with `HOME` set to another directory; a committed
   register whose stored revision holds the raw path is rewritten by
   `syncFollowups` with the same revision count, hash, ref, missing flag
   and dispositions and an unchanged `followupStatus`; a check-mode sync
   refuses as stale before that sync and passes after; a committed revision
   otherwise changed still refuses with "committed source or disposition
   history was removed or rewritten". The test imports
   `scripts/lib/planning-followups.mjs`, not the new module, so no
   machinery declaration changes (`uncoveredMachinerySources` reads a
   suite entry's direct imports). Check: `npm test -- --only process-debt`.
7. `scripts/test-worktree-integration.mjs`: extend "follow-up union
   preserves compatible histories and refuses divergent same-entry
   histories" (lines 1228 to 1246): a register holding the raw revision and
   one holding the rewritten revision union to the rewritten one in either
   order; a divergent revision still refuses with "divergent history".
   Check: `npm test -- --only worktree-integration`.
8. The order's own rewrite of the real register: run
   `npm run plan -- followups --sync` (`scripts/refute-plan.mjs` lines 235
   to 239) and record in the evidence README each entry whose stored
   revisions changed (at `6dbd8771`, FUP-de6162b279f66709 revision 1's
   summary only), with the field and the before and after length and
   SHA-256, never the text. Check: `git grep -c -F "$HOME/" --
   docs/planning/followups.json` finds no match;
   `npm run --silent plan -- followups --show FUP-de6162b279f66709` shows
   one source revision with its hash, ref and title unchanged and the same
   two dispositions, the last `deferred` at source revision 1;
   `npm run meta -- --check` passes.
9. `docs/evidence/WO-213/record-baseline.mjs` (new; the directory exists
   from step 1) and `docs/control/doc-baseline.json` `homePaths`: the
   script imports `recordFiles` and `homePathFindings` from
   `scripts/docs-check.mjs`, reads each matching file as committed at the
   base (`git show <base>:<path>`), prints as JSON the fingerprints of every
   record line the record rule matches that is identical at the base, with
   per-type counts, prints no line text, and exits 1 if a matching line is
   absent at the base. The executor merges the output into `homePaths`
   (existing entries byte-identical) and records the counts and, for each
   baselined file first committed after `1aea2dea`, that commit. Check:
   `node scripts/docs-check.mjs` passes with 0 failures (at `6dbd8771` the
   additions would be 291 lines in 37 files: 262 in 28 `.json`, 21 in 5
   `.log`, 8 in 4 `.txt`, and the PASS line 510 declared historical
   home-path lines; the executor records its base's figures).
10. `scripts/lib/plan-receipts.mjs`: beside each local-terms screen whose
    text is then written, a private-path screen through
    `privatePathLines`: in `writePlanReceipt` after line 829, the JSON as
    written (`prettyJson(receipt)`) under the record rule and the rendered
    Markdown under the Markdown rule; before the appends at lines 1166,
    1221, 1352 and 1475, the event's JSONL line under the record rule. A
    match throws before any write, naming the part (`receipt.md`,
    `receipt.json` or the event name) and line and the placeholder remedy,
    never the path. `validateReceipt` (line 189), `readReceipts` (line 695)
    and `checkPlanGate` (line 1552) are unchanged. Check: step 11.
11. `scripts/test-plan-refutation.mjs`: in the check "direct-session
    publication rejects dirty or stale planning subjects and screens
    session metadata" (lines 2048 to 2084), a statement naming
    a file in a `fixture-user` home directory and one naming a file under the
    macOS per-user temporary root each
    refuse with no receipt file and no history change, and the message
    does not contain `fixture-user`; a statement naming `<tmp>/x` files;
    and each of the four event writers (`overridePlanHold`,
    `disposePlanHold`, `amendPlanOrder`, `withdrawPlanAmendment`), reached
    through the fixture that already exercises it, refuses an event whose
    `reason` names a file in a `fixture-user` home directory with the overrides file's bytes
    unchanged. Check: `npm run build && node
    scripts/test-plan-refutation.mjs --fixtures-only`; `npm run plan --
    check` passes over the committed receipts.
12. `scripts/lib/target-records.mjs` and `scripts/lib/target-planning.mjs`
    (WO-210's): beside each local-terms screen, `privatePathLines` over each
    file's text under its own type's rule, before the first write into the
    target worktree, the commit and the `TargetRecordsCommitted` append; a
    match throws naming the record's path under the root, the line and the
    placeholder remedy, never the path. Check: step 13.
13. `scripts/test-target-worktree.mjs`: on WO-072's fixture as WO-210 left
    it, a decisions file naming a file in a `fixture-user` home directory and
    a verification report naming one under the macOS per-user temporary root
    each make `resume target-records` refuse with the target worktree, its
    branch and the order's control segment byte-identical and an output that
    never contains `fixture-user`; a planning document naming a file in a
    `fixture-user` home directory makes `plan target-publish` refuse with no
    commit, no push and the target origin's refs unchanged; the same records
    with `<home>/x` pass. Check: `npm test -- --only target-worktree`.
14. Measurement: three timed runs of `node scripts/docs-check.mjs` after the
    change, recorded beside step 1's with the record files' count and
    bytes. Check: the evidence README holds both sets.
15. Write-backs (each heading re-read at the base): `docs/README.md`
    §"## Map", the paragraph beginning "The document gate (`npm run
    test:docs`) runs": the sentence that links the activation baseline
    (`docs/control/doc-baseline.json`) and says it "identifies existing
    receipt labels, candidate headings, decision dispatch fingerprints and
    historical broken links; it is not regenerated to admit new violations"
    also names historical private-path lines, and one
    sentence states the rule (a new or edited line naming an absolute home
    path fails in Markdown and in a JSON, JSONL, log or text record under
    the document roots, a private temporary path fails in Markdown, and a
    repository-relative path or a placeholder is written instead);
    `docs/product/09-audit-resilience-privacy.md` §"## Privacy and
    minimization": one sentence, in place beside the WO-021 and WO-031
    paragraphs, that committed records name no absolute home path, the
    register substitutes `<home>`, the receipt helper refuses before it
    writes, records bound for a registered target's documentation root are
    screened before they are committed there, and existing records stay as
    written;
    `docs/evidence/WO-213/decisions.md`: the record rule's class with the
    declined full pattern and its evidence, why the baseline additions do
    not fire FUP-af65972e5491da22's reopening condition (every added line
    is in a file as committed before the base, in a type the screen did not
    read), the register rewrite as a projection correction, and the receipt
    screen's reach with the entropy exclusion and its trigger, and the
    target screen's reach (the two WO-210 write paths);
    `npm run meta` (the decisions index);
    `npm run publication:check`; `node scripts/check-publication.mjs
    --print-locks` if a locked section changed.
16. Handoff sequence: `npm run format`; `npm run test:docs`;
    `npm test -- --review`; complete `docs/evidence/WO-213/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the shared module; the record screen and its fixtures;
the record baseline and the script that computed it; the register
substitution, its rewrite of the stored revision and its fixtures; the
receipt and event screens and their fixtures; the target-root screens and
their fixtures; the measurements; the decisions; the write-backs below.

**Acceptance criteria (all required)**

1. `node scripts/docs-check.mjs` fails a new or edited line that names an
   absolute home-directory path (`/Users/<name>` or `/home/<name>`) in a
   `.json`, `.jsonl`, `.log` or `.txt` file, tracked or untracked and not
   ignored, under a configured document root (the repository root, the
   intake root and `control/local` excluded), at its file and line, with a
   message that never prints the path; a private temporary path in such a
   record passes; other file types under the roots are not read; Markdown
   keeps its rule, its message and its existing fixtures (step 4).
2. `docs/control/doc-baseline.json` `homePaths` gains fingerprints for
   exactly the record lines that hold a home-directory path in files as
   committed at the order's base, and for nothing else (the retained
   script's output reproduces the addition); every existing entry is
   byte-identical; `node scripts/docs-check.mjs` passes with 0 failures;
   the evidence records the counts per type and names each baselined file
   first committed after `1aea2dea` with its commit.
3. Register fixtures: a projected title and summary carry `<home>` in
   place of a home-directory path, by pattern, with the same bytes whatever
   the running host's home directory is; a stored revision holding one is
   rewritten in place by a sync with no appended revision and with its
   hash, ref, missing flag, dispositions and status unchanged; a check-mode
   sync refuses as stale before that sync and passes after; any other
   change to a committed revision still refuses; a union of the raw and the
   rewritten register yields the rewritten revision in either order, and a
   divergent revision still refuses (steps 6 and 7).
4. After the order's `npm run plan -- followups --sync`,
   `docs/planning/followups.json` holds no home-directory path;
   FUP-de6162b279f66709 keeps one source revision with its hash, ref and
   title unchanged and status `deferred`; every changed entry is listed in
   the evidence with lengths and SHA-256 and no text; `npm run meta --
   --check` passes.
5. `writePlanReceipt` refuses, before any write, a receipt whose rendered
   Markdown holds an absolute home or private temporary path (a session
   statement among them) or whose written JSON holds a home-directory path;
   each of the override, disposition, amendment and withdrawal appends to
   `docs/control/plan-refutations.jsonl` refuses an event whose text holds
   a home-directory path before appending (one fixture per writer); each
   refusal names the part and line and never the path; a placeholder
   statement files; `npm run plan -- check` passes over the committed
   receipts; the Entropy Reducer's filing is unchanged (step 11).
6. WO-210's `resume target-records` refuses, before any write into the
   target, any commit and any control append, a record whose Markdown holds
   an absolute home or private temporary path, and `plan target-publish`
   refuses, before any commit or remote call, a planning or product document
   that holds one (a record-type file: a home path); each refusal names the
   record's path under the documentation root and the line and never the
   path; the target worktree, its branches, the target origin's refs and the
   order's control segment are byte-identical after each refusal; the same
   records with a placeholder pass (step 13).
7. The evidence records docs-check's duration before and after (three runs
   each) with the record files' count and bytes; the decisions file records
   the record rule's class and the declined full pattern, why the baseline
   additions do not fire FUP-af65972e5491da22's reopening condition, the
   register rewrite as a projection correction, the receipt screen's reach
   and the target screen's reach. No duration binds this criterion.
8. Write-backs land in place with no dated paragraph: `docs/README.md`
   §Map's document-gate paragraph and product 09 §Privacy and
   minimization; publication locks refreshed if a locked section changed.
   No byte figure binds these write-backs.
9. No file the order adds or changes names an absolute home path
   (`git grep -c -F "$HOME/"` over the order's changed files finds none);
   `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only configuration-root` for step 2,
`npm test -- --only docs-check-fixtures` for steps 3–4,
`npm test -- --only process-debt` for steps 5–6,
`npm test -- --only worktree-integration` for step 7,
`npm test -- --only meta` for step 8, `npm test -- --only docs-check` for
step 9, `npm test -- --only plan-refutation` and `npm test -- --only plan`
for steps 10–11, `npm test -- --only target-worktree` for steps 12–13, and
`npm run test:docs` when a document changes (steps 1, 8, 9, 14 and 15), each
under `node scripts/harness.mjs bounded --`; then one
`npm test -- --review` (07-execution-guide.md §Preflight before the full
gate).

**Evidence gate:** the fixtures under `npm test -- --only
docs-check-fixtures`, `process-debt`, `worktree-integration` and
`target-worktree` and
`node scripts/test-plan-refutation.mjs --fixtures-only`; the real-tree runs
of `node scripts/docs-check.mjs` (its entry exists at `6dbd8771`, lines
1625 to 1652, and runs in every document gate) and of
`npm run plan -- followups --sync` (exists at `6dbd8771`,
`scripts/refute-plan.mjs` lines 235 to 239, and is run by every planning
pass; the in-place rewrite it performs is built by step 5); `npm run plan --
check`; `npm run meta -- --check`; `npm run test:docs`;
`npm test -- --review` before `implementation-ready` (declared machinery
sources change) and again at final review. No criterion needs a model run.
What the target fixtures traverse: WO-210's records action and planning
publication on WO-072's real-Git fixture, which exist once WO-210 has
closed (hard edge); neither exists at `6dbd8771`.

**Write-back duty:** as listed in criteria 7 and 8.

**Known issues and carry-ins:**

- FUP-589c1d588cb302a9 (WO-118 D014) is allocated here. Its two questions
  are answered: WO-187's records stay as written under assumption 7, and
  the refusal covers JSON and the other record types; the register row it
  names is corrected by step 8.
- FUP-7e0490f3c107e919 is allocated here: its route's first half is step
  10. Its second half (the parent hands a worker a `<tmp>/` placeholder) is
  role text this order does not change; the refusal names the placeholder.
  The refusal point is the same as the local-terms refusal's: a CLI
  refutation refused at filing is not kept, because
  `packages/skeleton/src/plan-refutation-host.ts` retains a return only
  when it is rejected inside the episode (lines 110 to 136) and removes the
  scratch directory once the episode returns (lines 137 to 138); the
  executor records this in the decisions file.
- FUP-de6162b279f66709 stays `deferred`: only its stored summary text
  changes; its source revision count does not, so neither does its status.
- FUP-af65972e5491da22 is settled (onto WO-188 D014) with the reopening
  condition "a later order baselines a new home-path line instead of
  fixing it". Every line this order baselines is in a file as committed
  before its base, in a type the screen never read; the decisions file says
  so, and the ten post-screen files are named there as the breach.
- FUP-9625ca888d7d08f5 reopens on "the next order that changes how
  `scripts/lib/plan-receipts.mjs` binds or withdraws an amendment". Step 10
  adds a refusal to the amendment and withdrawal appends and changes
  neither binding nor withdrawal semantics; the decisions file says so for
  the final review's judgment.
- A copied test-runner task record carries `productReadLog` as an absolute
  path (`scripts/test-runner.mjs` line 1560; WO-200's and WO-203's copied
  gate records hold it). After this order a later executor who copies one
  into its evidence meets the record rule and writes a placeholder; making
  the runner record it repository-relative is outside this order.
- ER4-005 (FUP-fb8cbeabbddef397): the screen now reads every record file on
  each run, so its cost grows with record bytes; step 14 records it.
- An instance that takes the update and holds its own committed records
  with a home path fails its document gate until the executor of its next
  order corrects them in place, on the operator's dispatch, recording it in
  its decisions; no instance command computes the fingerprints, so an
  instance does not declare them, and this order does not edit
  `scripts/kit/README.client.md` (WO-210 edits it).
- WO-210 closes before this order (hard edge). Any home-path line its own
  non-Markdown evidence carries is in a file as committed before this
  order's base, so step 9 declares it as it declares the ten post-screen
  files, and the decisions name it beside them as a breach of WO-188's
  assumption 7.
- Records an instance published into a target root before it took this
  order's release were screened by the local-terms list and the outward lint
  only (WO-210's known issue); this order does not reach back into a target's
  history. Reopen: a target's documentation root is found to hold an
  absolute home path.
- Line numbers cited here shift for WO-193, which later edits
  `collectFollowupSources`; it re-reads at its base.

**Non-goals:** correcting, rewriting or deleting any filed record (assumption
7) or Git history (earlier commits and any pushed remote keep the bytes);
refusing private temporary paths in records; the Entropy Reducer's filing,
the test runner's task record and the lifecycle commands' control logs
(no `.jsonl` line holds a home path at `6dbd8771`); package READMEs,
`/var/tmp`, `/root` and escaped forms (D014's other limits); a
baseline-writing command; the client README and any role skill text.

**Operator-review assumptions**

1. Records refuse the home-directory class only; private temporary paths
   stay a Markdown-only refusal, because they name no account and a
   command writes them into hash-chained receipts today.
2. The register's stored copy of a source summary is a projection, not a
   filed record; rewriting its one revision in place is a projection
   correction that assumption 7 does not forbid.
3. The ten record files committed after the screen landed stay as written
   and are declared historical by fingerprint, named in the decision as the
   breach of the policy; no history rewrite is attempted.
4. A refusal, not a redaction, is right for a receipt statement: the
   parent rewrites its own attested text.
5. Records bound for a registered target's documentation root take the same
   per-type rule as records under the instance's own roots, applied at
   WO-210's write into the target, and refuse rather than redact.
