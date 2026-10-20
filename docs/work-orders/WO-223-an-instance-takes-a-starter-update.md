# WO-223 — An instance with moved target records takes a starter update and publishes under it without a step the kit did not name: docs-check reads a moved decisions record through its binding, the moved-record reader finds the clone mapping from any worktree of the launchpad, the sign-off rule names its declaration before the first commit, the two admission advisories and the kit README spell the admitted helpers, and the commit lint names its limit (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. One document-gate repair (a moved
decisions row read through its immutable binding), one reader fallback (the
primary checkout before the main-branch worktree), one `worktree start`
advisory, three message texts (the sign-off refusal, the release-close
advisory, the commit-lint refusal) and the kit README's spelling of the
admitted publish helper. No existing refusal weakens and no admission
widens. Assigned at activation under the standing opt-out default.
**Cost:** adds the moved-row read in `scripts/docs-check.mjs` (`checkDocs`,
the decisions loop) and `scripts/lib/meta.mjs` (`readDecisions`); the
primary-checkout lookup in `scripts/lib/target-record-reader.mjs`
(`readTargetRecord`) and the arrangement named by `mainWorktree`'s refusal
in `scripts/lib/git.mjs`; the advisory in `scripts/worktree.mjs` (`start`)
and the declaration named in `scripts/lib/contributions.mjs`
(`contributionSignoffRules`); the expected spelling in
`packages/skeleton/src/harness-host.ts` (`releaseCloseAdmission`); the limit
in `scripts/lib/target-commit-lint.mjs` (`lintReviewedTargetCommits`) and the
publish-time refusal in `scripts/lib/target-publish.mjs`; cases in the
fixtures of the Preflight suites; the kit README and product 07 sentences
the write-backs step names. Removes the states the gap records: an
instance with moved target records whose document gate fails at v0.87.0
before any instance change (the operator's fork holds its update as a draft
pull request for this reason); an instance whose gates run only from a
worktree with `main` checked out that also holds the clone mapping; a
launchpad publish refused on a sign-off rule no earlier surface named; a
release-close helper withheld with no expected spelling (50 of 88
release-close attempts in this checkout's host observation logs, read by
kind only); a commit-lint refusal that names a rule and not its limit; a kit
README whose session form is the spelling the hook withholds. Re-mints:
`packages/skeleton/src/harness-host.ts` is a registered source of the
authority, harness and feedback editions (`scripts/lib/evidence-sources.mjs`
lines 165, 263 and 334), re-minted deterministically; no path of this order
is in `FEEDBACK_SOURCE_PATHS` (`packages/skeleton/src/feedback-audit.ts`
lines 15 to 79), so no live feedback episode is owed. `scripts/docs-check.mjs`,
`scripts/lib/meta.mjs`, `scripts/worktree.mjs`, `scripts/launchpad.mjs`,
`scripts/kit/` and `packages/skeleton/src/harness-host.ts` are declared
machinery sources (`machinerySources` in `scripts/test-runner.mjs`), so
`npm test -- --review` runs before handoff. Live episodes: none; the host's
behavior after a hook admission is the fork's WO-006 episode, outside this
order. Wall-clock: the document gate gains one blob read per moved
decisions row; the reader gains one `git rev-parse --git-common-dir` per
miss; `worktree start` gains one configuration read. Commands: none added;
one advisory line at `worktree start`. Context bytes: this file, about 28,000. Tokens: unknown until run. Steps: 10.
**Nomination provenance:** the operator's instance's planning pass of
2026-10-20 (`docs/planning/latest-upstream-and-core-answers-2026-10-20.md`
§4, §7, §11 and §12 of the fork, read on the operator's machine without a
write, its `main` at `60a1a76`), carried by the operator into the
`planning: standard planning pass +` dispatch of 2026-10-20 (ignored
capture, SHA-256
`794059fbb2ede05d959a20f2608863a7eb3293ffaefb7009c8407c71a51b15c3`), items
2 to 7. WO-218-D041's reopening condition ("a moved report stops
resolving") occurred in the fork's document gate at v0.87.0. Planner-synthesized by the
[2026-10-20 fork-answers pass](../planning/fork-answers-and-entropy-targets-2026-10-20.md).
Opaque identifier, not a priority. Clean-room screen: the fork is the
operator's own public instance and its target the public repository it is;
no target code, no employer material; the fixtures are the kit's.
**Depends on:** WO-218 (closed, v0.87.0: the moved-record readers, the
helper-only admission, the sign-off declaration and the pre-review commit
lint this order repairs or names); WO-221 (closed, v0.85.0: the admission
classes). WO-219 edits `packages/skeleton/src/harness-host.ts` (its step
19) with no typed edge; whichever runs second rebases on the first.
**Recommended placement:** position 1 of the serial queue, before WO-217:
the operator's instance holds starter v0.87.0 as a draft update pull
request until a starter release carries step 2, and every instance with
moved target records meets the same failure. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-218",
    "relation": "satisfied-by-close",
    "reason": "the moved-record readers, the helper-only admission, the sign-off declaration and the pre-review commit lint this order repairs or names"
  },
  {
    "workOrderId": "WO-221",
    "relation": "satisfied-by-close",
    "reason": "the two hook admission classes whose advisories this order makes name the expected spelling"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Workflow closeout
and releases (the exact helper, the registered-target admission paragraph),
§Operator resume phrases (the target publish row), §Where the control plane
finds its documents, §Independent workflows and integration, §Preflight
before the full gate; `docs/evidence/WO-218/decisions.md` D019 (the
pre-review commit lint), D041 (moved records through their binding), D042
(`contributions.operatorAuthor`), D062 (the helper-only admission);
`scripts/docs-check.mjs` (`checkDocs`, the decisions loop at line 448);
`scripts/lib/meta.mjs` (`readDecisions`, line 296);
`scripts/lib/target-record-reader.mjs` (`readTargetRecord`, lines 38 to
100; `movedDecisions`); `scripts/lib/git.mjs` (`mainWorktree`, line 231;
`releaseCloseCommand`, line 252); `scripts/lib/contributions.mjs`;
`scripts/worktree.mjs` (`publish`, line 1231; `start`);
`packages/skeleton/src/harness-host.ts` (`releaseCloseAdmission`, lines
1231 to 1300; `registeredTargetAdmission`, line 1585);
`scripts/lib/target-commit-lint.mjs`; `scripts/lib/outward-lint.mjs`
(`subjectLengthLimit`, line 7; `subject.length`, line 586);
`scripts/kit/README.client.md` (the paragraph beginning "The session form
is"); `scripts/launchpad.mjs` (`readKitActions`, line 1572);
`scripts/test-target-worktree-publish.mjs` (the case "moved decisions and
reports resolve from the bound immutable target commit", line 1610); the
[2026-10-20 planning document](../planning/fork-answers-and-entropy-targets-2026-10-20.md)
§4.

**Objective:** An exported instance that has moved an order's records into
its registered target takes a starter release at or above v0.87.0 and runs
its gates, its launchpad publish and its target publish without a step the
kit did not name:

- **The document gate reads a moved decisions record through its binding.**
  `checkDocs` reads a moved row's text the way `readDecisions` already does,
  through the immutable repository, commit, path and hash binding, and
  checks its records; the plan, reader and entropy checks after it run. A
  local row is read as today.
- **The moved-record reader finds the clone mapping from any worktree of
  the launchpad.** `readTargetRecord` reads the ignored clone mapping from
  the running checkout, then from the launchpad's primary checkout (the
  worktree whose Git directory is `git rev-parse --git-common-dir`), then
  from the worktree that has `main` checked out; when none holds it, the
  refusal names the three places read and the arrangement that works. The
  kit README states that arrangement.
- **The sign-off rule names its declaration before the first commit.**
  `worktree start` of a launchpad order in an instance that declares no
  `contributions.operatorAuthor` prints one advisory: every commit on the
  branch needs a `Signed-off-by` trailer matching its author, or the
  instance declares the identity in its configuration as a reviewed
  change. The publish-time `FAIL contribution-signoff` line names the same
  two routes.
- **The two admission advisories and the kit README spell the admitted
  helpers.** The release-close advisory for a helper the hook does not
  admit byte for byte prints the expected spelling for the dispatched order
  (the `--publish` and `--dry-run` forms `releaseCloseCommand` prints) and
  the class of the mismatch (words after the helper, a shell operator or
  redirect, a material flag's quoting). The kit README's session form for
  a target publish is the node spelling the hook admits, with the npm form
  named as withheld.
- **The commit lint names its limit.** The pre-review refusal and the
  publish-time refusal on `subject.length` print the subject's length and
  the limit, read from `subjectLengthLimit`.

**Observed gap (dated 2026-10-20 at `main` `a6b68245`, with the fork's
observations of the same day at starter v0.85.0 and v0.87.0):**

*The document gate:*

- `readDecisions` (`scripts/lib/meta.mjs` line 296) merges `movedDecisions`
  into its rows and reads a moved row's text through `readTargetRecord`,
  keeping the launchpad path as `row.path`. `checkDocs`
  (`scripts/docs-check.mjs` line 448) then calls `readListed(root,
  row.path)` for every row and splits that text by heading; for a moved row
  the path is not a regular file. The fork's update branch at v0.87.0
  failed `docs-check` with `docs/evidence/WO-004/decisions.md: document is
  not a readable regular file (ENOENT)` before any instance change, and the
  `entropy`, `reader-profiles`, `plan` and `plan-refutation-current` checks
  were skipped after it (the fork's §4); the complete run passed 7 of 7 on
  the same branch. Core has no moved record, so its own gate is green; the
  moved-records case (`scripts/test-target-worktree-publish.mjs` line 1610)
  reads `readDecisions`, the decisions index and `status --json` and never
  runs `checkDocs`.

*The reader's arrangement:*

- `readTargetRecord` (`scripts/lib/target-record-reader.mjs` lines 56 to
  61) reads the clone mapping from the running checkout and, when it is
  absent, from `mainWorktree(root)`, which throws `no main-branch
  control-plane worktree found` when no worktree has `main` checked out
  (`scripts/lib/git.mjs` line 236). A secondary worktree never holds the
  ignored mapping; an instance whose primary checkout is on a planning
  branch and whose update branch is in a secondary worktree cannot run
  `npm run sync`, `docs-check` or the planning checks there. The fork ran
  its gates with the primary checkout on `main` beside the branch's
  worktree (its §4, "Gates in a secondary worktree"). The hook's own
  admission reads the mapping from the main-branch worktree by design
  (`registeredTargetAdmission`), which this order leaves alone.

*The sign-off rule:*

- `contributionSignoffRules` (`scripts/lib/contributions.mjs`) runs at the
  launchpad publish (`scripts/worktree.mjs` line 1231) over
  `origin/main..HEAD` and fails every commit whose author is not
  `contributions.operatorAuthor` and carries no matching trailer; its FAIL
  line names the trailer and `git commit --amend --signoff`, not the
  declaration. Nothing says so before the publish: `worktree start` prints
  no advisory, the update preview printed `No instance actions declared`
  (`scripts/kit/KIT-ACTIONS.json` holds `actions: []`, and `readKitActions`
  admits only `rename-root`, `add-config-field` and `change-phrase`, none of
  which can carry an identity the kit does not know), and the v0.87.0
  release notes name the key in prose. The fork read the rule at its
  source and declares the identity in its WO-012 before its first publish
  under v0.87.0 (its §4, "The sign-off rule"; its D2).

*The admission advisories and the README:*

- `releaseCloseAdmission` (`packages/skeleton/src/harness-host.ts` lines
  1231 to 1300) admits the helper only in `releaseCloseCommand`'s spelling
  (`scripts/lib/git.mjs` line 252: the quoted `process.execPath`, the quoted
  `scripts/release.mjs` of main, `close WO-NNN` and exactly `--publish`,
  `--dry-run` or `--publish` with canonical `--material` words) and
  otherwise journals `Release-close admission withheld: byte-exact helper
  spelling missing; host permissions decide.` The prefix (the node path,
  the script path and the order) must already match for that advisory to
  be reached, so every such row records a mismatch after the order word.
  This checkout's ignored host observation logs, read by kind only, hold 38
  admitted rows and 50 of these withheld rows; the fork's three closes
  (WO-001 on 2026-10-15, WO-011 and WO-005 on 2026-10-20) were all
  withheld and carried by host permissions (its §4 and §11). The advisory
  names neither the expected spelling nor what differed.
- `registeredTargetAdmission` (line 1585) withholds the npm spelling with
  `use the node spelling of worktree publish; raw git, gh and npm receive
  no registered-target admission` (line 1608), which does name the admitted
  form. The kit README still says "The session form is `npm run worktree
  -- publish WO-NNN --target-worktree …`" (`scripts/kit/README.client.md`
  line 147) six lines before it says the hook admits only the node
  spelling; the fork's instance profile repeated the npm form until its
  2026-10-20 pass rewrote it. Product 07's own sentences are this pass's
  write-back.

*The commit lint:*

- `lintReviewedTargetCommits` (`scripts/lib/target-commit-lint.mjs`) refuses
  before `final-review-result pass` naming only the rule ids
  (`subject.length`); the limit, 72, lives in
  `scripts/lib/outward-lint.mjs` line 7 and in no product document or role
  text. The fork's WO-005 final publish at v0.85.0 was refused at the
  outward lint on a 90-character subject before any push, and the operator
  published by hand (its §11); at v0.87.0 the pre-review lint catches the
  same subject before the pass is recorded (WO-218 D019, control
  `r18-commit-lint`), still without the number.

**Design (scope discipline):**

- *The moved row.* `readDecisions` already holds a moved row's text when it
  parses it; the loop in `checkDocs` takes the text from the same binding
  (`readTargetRecord` on the row's `targetRecord`) when `row.targetRecord`
  is set and from `readListed` otherwise, so the operator-word, dispatch
  and provenance checks run over moved records exactly as over local ones.
  Rejected: skipping moved rows in `checkDocs` (axis: coverage; v0.85.0
  skipped them and the checks never saw a moved decision); reading the
  target clone's working copy (axis: the immutable binding; the working
  copy is irrelevant by `readTargetRecord`'s contract).
- *The reader's lookup order.* Running checkout, primary checkout, main
  worktree. The primary checkout is where `worktree clone` is run in every
  recorded instance and where the mapping lives whatever branch it has
  checked out; the main-branch fallback stays for a layout whose primary
  checkout is not the control plane. The refusal names all three and the
  arrangement. Rejected: moving the mapping into the common Git directory
  (axis: ownership of local lanes; every ignored lane lives under the
  configured control root, and the hook reads main's lane); stating the
  arrangement in the README alone (axis: an instance's scratch worktree
  still cannot run its gates).
- *The declaration.* One advisory at `worktree start` and the FAIL line's
  text. Rejected: a kit action printed by the update preview (axis: the
  schema; an action kind that carries no value the kit can supply would be
  new, and the advisory reaches every instance at the moment before any
  commit); role text (axis: cold-start bytes; the executor root has 33 and
  the reviewer 85 bytes of headroom at receipt 050).
- *The advisories.* The release-close advisory prints the expected spelling
  and the mismatch class; the admitted forms are unchanged. Rejected:
  admitting a suffixed or piped helper (axis: the byte-exact rule WO-178
  chose; a redirect or pipe changes what the operator sees); comparing the
  node word by resolved binary rather than by text (axis: the same rule;
  the prefix already matches in every withheld row).
- *The limit.* The refusal prints length and limit from the one constant.
  Rejected: naming 72 in the reviewer role text (axis: cold-start bytes and
  the moment of use; the refusal arrives when the subject is written).

**Deliverables:** the fixes and cases of the steps; the decisions and
README; the kit README and product 07 write-backs.

**Acceptance criteria (all required)**

1. A kit fixture instance with a moved decisions record passes `checkDocs`
   (the `docs-check` task of its document gate) and the checks after it
   run; with only step 2's change reverted the same fixture fails naming
   the moved path as not a readable regular file; both arms are recorded in
   `docs/evidence/WO-223/repair-controls.json` in the shape WO-218's repair
   filed (per control: the suite and command, the reversion by path, both
   arms' exit codes and the verdict).
2. In a fixture launchpad whose primary checkout is on a branch other than
   `main` and whose secondary worktree runs the command, `readTargetRecord`
   returns the moved record and `npm run sync`'s meta artifact completes;
   with step 3's change reverted the same arrangement fails `no main-branch
   control-plane worktree found`; when no checkout holds the mapping the
   refusal names the three places read; both arms recorded as in
   criterion 1.
3. `worktree start` of a launchpad order in a fixture instance without
   `contributions.operatorAuthor` prints one advisory naming the key and
   the trailer, and prints none when the key is declared; the FAIL line of
   `contributionSignoffRules` names the key; a case per arm.
4. The release-close advisory for a helper with words after the order
   (a redirect, a pipe, a non-canonical material word) names the expected
   `--publish` and `--dry-run` spellings for the dispatched order and the
   mismatch class; the exact forms the hook admitted at the base are still
   admitted, each asserted by a case (receipt 049's rule for hooks: each
   fix records the base admission it keeps).
5. The pre-review and publish-time refusals on a 90-character subject name
   the length and the limit; a case asserts the text.
6. The kit README's session form is `node scripts/worktree.mjs publish
   WO-NNN --target-worktree …`, names the npm form as withheld and states
   the worktree arrangement the readers need; product 07's sentences land
   where step 9 names; `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; the three editions `harness-host.ts`
   is a registered source of re-minted deterministically.

**Preflight:** `npm test -- --only target-worktree` and `npm test -- --only docs-check-fixtures` for steps 2 and 3;
`npm test -- --only docs-check` for step 2;
`npm test -- --only launchpad` and `npm test -- --only launchpad-planning` for steps 4 and 9;
`npm test -- --only license-fixtures` and `npm test -- --only worktree` for step 5;
`npm test -- --only harness-fixtures` for step 6;
`npm test -- --only outward-lint` and `npm test -- --only target-publish` for step 7;
`npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then the handoff gate the executor's role text names at
the base.

**Execution plan (the executor follows these steps in order; observed at `a6b68245`, 2026-10-20):**

1. `docs/evidence/WO-223/README.md` (new): at the base, each of the five
   observations reproduced or restated in a kit fixture instance (the
   moved-records fixture of `scripts/test-target-worktree-publish.mjs` for
   the first two; the fixture launchpad of `scripts/test-launchpad-planning.mjs`
   for the third; the hook fixtures of `scripts/test-harness.mjs` for the
   fourth; `scripts/test-outward-lint.mjs` for the fifth), each with its
   command and exit code, written before any fix. Check: the README lists
   the five with their base outcomes.
2. `scripts/docs-check.mjs` (`checkDocs`, the decisions loop at line 448)
   and `scripts/lib/meta.mjs` (`readDecisions`, which exposes the moved
   row's binding as `targetRecord`): the loop reads a moved row's text
   through `readTargetRecord(root, state, record)` and a local row through
   `readListed`; the failure for an unreadable moved record names the
   binding (`<id>@<commit>:<path>`); a case in the moved-records fixture
   runs `checkDocs` over the fixture launchpad and asserts the pass, and
   the control (the base's `readListed` read) fails on the moved path.
   Check: `npm test -- --only target-worktree` and `npm test -- --only
   docs-check-fixtures`, under `node scripts/harness.mjs bounded --`.
3. `scripts/lib/target-record-reader.mjs` (`readTargetRecord`, the lookup
   at lines 56 to 61) and `scripts/lib/git.mjs` (`mainWorktree`'s refusal
   text, or a sibling `primaryWorktree(root)` the reader calls first): the
   mapping is read from the running checkout, then the primary checkout
   resolved through `git rev-parse --git-common-dir`, then the main-branch
   worktree; the refusal names the three and the arrangement; a case
   arranges the fixture launchpad with its primary checkout on a non-main
   branch and a secondary worktree running the read, and a second case
   removes the mapping everywhere and asserts the refusal text. Check:
   `npm test -- --only target-worktree`, under `node scripts/harness.mjs
   bounded --`.
4. `scripts/kit/README.client.md` (the paragraph beginning "The session
   form is" and the update route's gates paragraph): the session form is
   the node spelling with the npm form named as withheld, and one sentence
   states that the moved-record readers find the clone mapping in the
   running checkout, the primary checkout or a worktree on `main`, in
   that order. Check: `npm test -- --only launchpad` (the kit file is
   manifest-listed) and `npm run test:docs`.
5. `scripts/lib/contributions.mjs` (`contributionSignoffRules`' FAIL line)
   and `scripts/worktree.mjs` (`start`, after the worktree is created, for
   a launchpad order): the FAIL line names `contributions.operatorAuthor`
   beside the trailer route; `start` prints one advisory when the loaded
   configuration declares no `contributions.operatorAuthor`, and nothing
   when it does; cases for both arms in `scripts/test-license-surfaces.mjs`
   and the worktree fixtures. Check: `npm test -- --only license-fixtures`
   and `npm test -- --only worktree`, under `node scripts/harness.mjs
   bounded --`.
6. `packages/skeleton/src/harness-host.ts` (`releaseCloseAdmission`, the
   `byte-exact helper spelling missing` branch at line 1271): the advisory
   appends the expected `--publish` and `--dry-run` spellings for the
   dispatched order (built as `releaseCloseCommand` builds them) and the
   mismatch class; cases in `scripts/test-harness.mjs` for a redirected
   helper, a piped helper and a non-canonical material word, each
   asserting the advisory text, beside the existing admitted cases, which
   stay. Then `npm run sync` for the editions and the emitted hook bundle.
   Check: `npm test -- --only harness-fixtures`, under `node
   scripts/harness.mjs bounded --`; `npm run sync` leaves `npm run meta --
   --check` green.
7. `scripts/lib/target-commit-lint.mjs` (`lintReviewedTargetCommits`) and
   `scripts/lib/target-publish.mjs` (the outward-lint refusal before any
   push): a `subject.length` finding is printed as `subject.length: <n> of
   <limit> characters`, the limit imported from
   `scripts/lib/outward-lint.mjs`; a case with a 90-character subject in
   `scripts/test-outward-lint.mjs` and the target-publish fixtures asserts
   the text. Check: `npm test -- --only outward-lint` and `npm test --
   --only target-publish`, under `node scripts/harness.mjs bounded --`.
8. `docs/evidence/WO-223/decisions.md`: one decision per step with the
   chosen option, the rejected option, the case and the reversal
   condition; the controls of criteria 1 and 2 in
   `docs/evidence/WO-223/repair-controls.json`. Then `npm run meta`. Check:
   `npm run meta -- --check`.
9. Write-backs, in place: `docs/product/07-execution-guide.md` §Workflow
   closeout and releases (the paragraph beginning "Run the printed helper
   exactly as printed": the advisory names the expected spelling and the
   mismatch class) and §Where the control plane finds its documents (the
   paragraph beginning "Target orders pair a code worktree": the
   moved-record readers' lookup order); the kit README of step 4. Check:
   `npm run test:docs`.
10. Handoff: `npm run format`; `npm run test:docs`; the gate the
    executor's role text names at the base (the order's Preflight suites,
    then the handoff gate; `npm test -- --review`, because declared
    machinery sources changed); complete `docs/evidence/WO-223/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Evidence gate:** the Preflight suites; the controls of criteria 1 and 2;
`npm run test:docs`; the handoff gate. No model run.

**Write-back duty:** criterion 6 and step 9.

**Known issues and carry-ins:**

- WO-219 step 19 also edits `packages/skeleton/src/harness-host.ts`
  (`registeredTargetAdmission`); this order edits `releaseCloseAdmission`
  in the same file; whichever runs second rebases.
- The operator's instance takes the starter release this order produces
  into its draft update pull request, re-runs its gates and marks it ready
  (the fork's D1); nothing here edits the fork.
- The fork's three host-settings removals of 2026-10-20 are outside every
  repository and are not this order's; the host's behavior after a hook
  admission is observed by the fork's WO-006 episode, which rewrites
  WO-221's Claude Code qualification row again.
- FUP-da505c82f2262b8e (a second sign-off-exempt author identity, the
  GitHub "Update branch" commits) stays deferred; this order changes no
  rule of `contributionSignoffRules`, only its text.
- The register rows this pass minted for the five observations are
  allocated here by id; the planning document's §4 is the authority on
  what each asks.

**Non-goals:** the host's behavior after a hook admission; a new
kit-action kind; a redesign of the ignored local lanes or their home; the
register's redaction route; a second sign-off-exempt identity; any change
to which commands the two admissions admit; role-text changes.

**Operator-review assumptions**

1. The order runs first, before WO-217, so the fork's update can leave its
   draft state after one core release; the operator may move it by one
   sequence edit.
2. The fork takes the repaired starter release through its existing draft
   pull request, as its D1 planned.
