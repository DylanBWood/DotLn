# WO-227 — Outward publication reads as the operator intended: launchpad identifiers are refused in a target's commits and pull requests, the public word list and each private term are review items the reviewer confirms in context rather than bans on English words, an empty list is admitted, a generated Change-table path is named apart from the reviewed prose, the pull-request body keeps the meter block last behind a structural check, and a target's Release carries the reviewed notes when its order names them (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. One refusal becomes a review item on
the operator's correction (`vocabulary.launchpad`, a token ban on listed
English words, becomes `vocabulary.review`, confirmed by the reviewer), one
refusal is added (`identifier.launchpad` for a target's outward artifacts),
the private list gains a per-term mode, two empty lists are admitted, the
publication record gains a recorded confirmation, the stored pull-request
body gains a structural check, and a target Release gains a header-named
body source. Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/lib/outward-lint.mjs`, the rule
`identifier.launchpad`, the `review` status with its matched words and the
`reviewTerms` key (`terms` read as an alias for one kit release); in
`scripts/lib/terms.mjs`, the per-term mode and the empty-list reading; in
`scripts/lib/target-publish.mjs`, the split lint of reviewed prose and
generated sections, the `--confirm-terms sha256:<digest>` flag and the
recorded confirmation; in `scripts/lib/plan-receipts.mjs`, an advisory over
a target order's named paths; in `scripts/release.mjs` and
`scripts/lib/github-body.mjs`, the meter block kept last and
`pullRequestBodyShapeFailures`; in `scripts/release.mjs`, the
`**Target release notes:**` header, the rendered notes body, its lint and
its bound digest; fixture cases in `scripts/test-outward-lint.mjs`,
`scripts/test-target-publish.mjs`, `scripts/test-github-body.mjs`,
`scripts/test-release.sh`, `scripts/test-target-worktree-release.mjs` and
`scripts/test-plan-refutation.mjs`; and the product 08, product 07, kit
README and `docs/README.md` sentences step 12 names. Removes: the refusal
of ordinary English words in a target's pull request (the operator's
instance met it as `vocabulary.launchpad (line 147)` on a fixture path and
on its target's own subject matter); the unexplained line number of that
refusal; the two non-empty-list requirements that made the operator write
a placeholder term; the thin target Release body the fork's operator called
unreadable; and the pull-request body shape that drifted across four
reviews with no rule changing. Re-mints: `scripts/release.mjs` is a
declared machinery source (`machinerySources`, `scripts/test-runner.mjs`),
so `npm test -- --review` runs before handoff; none of the files this
order edits is in `FEEDBACK_SOURCE_PATHS`
(`packages/skeleton/src/feedback-audit.ts`, read 2026-10-21) or in
`scripts/lib/evidence-sources.mjs`, so no edition re-mint and no live
feedback episode is owed unless a step edits such a file, in which case the
executor records the deterministic re-mint and runs the live episode on
Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`,
no authorization needed, cost accepted. Wall-clock and tokens: unknown
until run. Context bytes: this file, about 27,000. Steps: 13.
**Nomination provenance:** the operator's notes 3 (with 3.a and 3.b), 4
and 6.3 and 6.4 of the 2026-10-21 planning dispatch and the fork's first
kit-behavior question (ignored capture, SHA-256
`4db8e10536b76209745538e6f54f2563dc7d1b34645a2cba438fd14a7812bab6`); the
operator's two corrections of the same session (sibling capture, SHA-256
recorded in the planning document §1): the lint was for launchpad
identifiers, the private list on commit and pull-request text, and
DotLn-specific usage judged in context, never a ban on English words, and
a private term that is also an ordinary word is refused as the system's
name and not as the word; the fork's WO-006 record of its refused draft
(`docs/evidence/WO-006/host-qualification.md` in the operator's instance,
read without a write); WO-221-D006's reopening condition, which the fork's
request fires ("an instance wants the target Release to carry … a notes
file"); the 2026-10-21 pass's reading of the five latest merged
pull-request bodies (#223 prose first; #225, #227, #230 and #231 meter
first). Planner-synthesized by the [2026-10-21
pass](../planning/fork-notes-and-operator-questions-2026-10-21.md). Opaque
identifier, not a priority. Clean-room screen: the examples in the
operator's corrections are paraphrased without their names; the fixtures
are synthetic.
**Depends on:** WO-063 (closed: the outward lint and the two lists), WO-064
(closed: publication integration), WO-218 (closed, v0.87.0: the display
name and the pre-review commit lint), WO-221 (closed, v0.85.0: the target
Release and D006), WO-188 (closed: the meter block). WO-219 (role text,
hooks; step 17 holds the Preflight-token row) is referenced with no typed
edge; this order changes no role text.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-063",
    "relation": "satisfied-by-close",
    "reason": "the outward lint and the public and private lists this order re-reads"
  },
  {
    "workOrderId": "WO-064",
    "relation": "satisfied-by-close",
    "reason": "the publication integration that runs the lint before a remote effect"
  },
  {
    "workOrderId": "WO-218",
    "relation": "satisfied-by-close",
    "reason": "the display name and the pre-review commit lint the Release and shape checks sit beside"
  },
  {
    "workOrderId": "WO-221",
    "relation": "satisfied-by-close",
    "reason": "prepareTargetRelease and D006, whose reopening condition this order answers"
  },
  {
    "workOrderId": "WO-219",
    "relation": "reference-only",
    "reason": "role text stays unchanged here; WO-219 owns it"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Discipline (the Outward
artifacts bullet as the 2026-10-21 pass rewrote it, the Projection boundary
bullet, the No ratchet creep bullet's shape rule); product 07 §Workflow
closeout and releases (the target Release paragraphs, lines about 1808 to
1830); product 08 §PRs and commits and §Release-note edition; product 01
Principle 16; `docs/work-orders/WO-063-outward-artifact-lint.md` (the
observed gap, line 53); `docs/evidence/WO-063/decisions.md` (D001);
`docs/evidence/WO-221/decisions.md` (D006, lines 181 to 200);
`scripts/lib/outward-lint.mjs` (`validateOutwardVocabulary` lines 28 to 43,
`lintOutwardArtifact` line 548, the `vocabulary.launchpad` loop lines 638
to 656, `vocabulary.local` lines 663 to 687, `outwardArtifactKinds` line
1, `runtimeIdentifierForms` line 11); `scripts/lib/terms.mjs`
(`checkLocalTerms`); `scripts/lib/target-publish.mjs` (`lintArtifacts`
line 1671, the draft body at 998 to 1006, the final body at 1227 to 1237,
`publishTargetOrder` line 1795, `targetChanges` lines 703 to 726);
`scripts/lib/github-body.mjs` (`targetChangeSection` lines 1031 to 1046,
`githubBodyProfileFailures` line 424, `assertGitHubBodyProfile` line
1232, `literal` lines 515 to 519); `scripts/lib/plan-receipts.mjs`
(`checkPlanGate` lines 1587 to 1589); `scripts/lib/work-order-repository.mjs`
(`parseRepositoryDeclaration` line 8); `scripts/lib/handoff-ledger.mjs`
(the Preflight field regex, line 51); `scripts/release.mjs`
(`readWorkOrderAuthority` lines 524 to 559, `releaseEdition` lines 1726 to
1786, `regeneratedPullRequestBody` lines 1801 to 1821,
`prepareTargetRelease` lines 2523 to 2678 with the body at 2667 and the
tag message at 2646, the meter seeding at 3619 to 3657,
`githubBodyRule` lines 804 to 833); `scripts/lib/release-notes.mjs`
(`parseReleaseNotes` lines 199 to 258, `releaseNotesPathFor` line 10);
`scripts/lib/github-repository.mjs` (`ensureRelease` lines 324 to 397);
`scripts/worktree.mjs` (the publish branches at 1167, 1177 to 1233, 1260 to
1265, 1274); `scripts/lib/target-records.mjs` (the fixed records commit
message, lines 262 and 281); `scripts/kit/README.client.md` §First steps
step 4 (lines 122 to 146); `docs/publication/examples/prBody/balanced.md`
and `record.md`; `docs/README.md` lines 53 to 54; the [2026-10-21 planning
document](../planning/fork-notes-and-operator-questions-2026-10-21.md) §6
and §7.

**Objective:** An instance's reviewer publishes a target pull request, a
target Release and a launchpad pull request under checks that say what
they are for:

- **Identifiers never leave the launchpad.** A target's branch name,
  commit subjects, pull-request title and body carrying a launchpad
  identifier (`WO-NNN`, `WO-NNN-DNNN`, `FUP-<16 hex>`, `VER-NNN`,
  `FINAL-NNN`, `REVIEW-NNN`, `WS-NNN`) are refused naming the identifier
  and the rule; the kit's own records commit (its fixed message) and a
  `Closes #N` reference are not identifiers; a launchpad artifact keeps its
  convention (`# WO-NNN` titles).
- **Words are reviewed, not banned.** The public list (`reviewTerms`) and
  each private term marked `review` produce a `review` result that names
  the words (public) or the lines (private, never the term) and the
  section they sit in; the publish refuses until the reviewer passes
  `--confirm-terms sha256:<digest of the composed body>` after reading
  them, and the confirmation (digest, actor attestation, the count of
  matches) is recorded in the publication record and the journal. A
  private term marked `refuse` refuses as today. The English word alone
  never refuses anything.
- **Lists may be empty.** `reviewTerms: []` is a valid file, and a present
  local list with zero terms is `present` with a count of zero; an absent
  local list stays `unavailable` and refuses, as the floor requires.
- **Generated text is judged as generated text.** The Change table and the
  target-checks section are linted apart from the reviewed prose: an
  identifier or a `refuse` term in an added path refuses naming the path
  and the section; a review word in an added path joins the review list
  with its path; a path that already existed at the target's base is the
  target's own vocabulary and is not reported.
- **Planning warns early.** `plan check` lists, as an advisory, the paths a
  target order's Execution plan names that carry a review word or an
  identifier, so the order's author renames the file or lists the word
  deliberately before any draft publish.
- **The pull-request body has a shape.** `release prepare` and the
  regenerated body keep the meter block as the last block of the stored
  `PR.md`, after the prose, wherever it stood; `pullRequestBodyShapeFailures`
  refuses a stored body whose first non-blank line is not a level-one
  heading, that has no prose paragraph before the meter block or whose
  meter block is not last (the published body admits the product-gate
  block after it); it judges the current order's `PR.md` at publish and in
  `check-surfaces`, never a historical body; product 08 states the shape.
- **A target Release can carry the reviewed notes.** An order header
  `**Target release notes:** reviewed` makes the Release body the rendered
  five-section `RELEASE-NOTES.md` of that order at `sourceRevision` (the
  order title once under the overview, launchpad-relative links written as
  plain text or target-relative paths, the close line appended) and
  refuses, before any tag push, when the file is absent or fails
  `parseReleaseNotes`; `objective` or no header keeps today's text byte
  for byte. The tag message and the Release body of either source pass the
  outward lint (identifiers, modes, review confirmation), with the
  registered `release.displayName` exempt from the word checks; the body's
  digest is bound in `publication.target` so a retry compares the same
  bytes, and a recheck of a Release published with the legacy body admits
  it as `admittedTitles` admits the legacy title.

**Observed gap (dated 2026-10-21 at `main` `926b8234`):**

- `vocabulary.launchpad` refuses any outward artifact of a target
  publication containing a `terms` entry as a whole token or joined token
  run (`scripts/lib/outward-lint.mjs` lines 638 to 656); the committed list
  is `["DotLn","launchpad","gem","gems","mask","masks"]`; WO-063's PR body
  recorded the cost ("Apply the mask layer" refuses) and D001 reopens on a
  legitimate target false positive. The fork's WO-006 draft was refused at
  `pr-body refused: vocabulary.launchpad (line 147)`, a row of the
  generated Change table naming a fixture `launchpad-board-2026-10-21.json`;
  the refusal does not say that the line is generated text.
  `validateOutwardVocabulary` (lines 28 to 43) refuses an empty `terms`
  array; `checkLocalTerms` (`scripts/lib/terms.mjs` lines 23 to 24)
  refuses a present but empty list. The operator set the instance's list
  to one placeholder to publish.
- No rule refuses a launchpad identifier in a target artifact:
  `runtimeIdentifierForms` (line 11) covers `source-event:`, `evt_` and
  the like; the `comment-labels` suite covers code comments in the
  launchpad; nothing covers `WO-NNN-DNNN` in a target pull request.
- `targetChangeSection` (`scripts/lib/github-body.mjs` lines 1031 to 1046)
  is appended to the reviewed body and the whole is linted as one
  `pr-body` (`target-publish.mjs` lines 999 and 1228); `checkPlanGate`
  observes only the local-terms status and nothing parses an order's
  Execution plan (`git grep -i "execution plan"` over scripts, packages,
  `.claude` and `.agents` returns nothing).
- `release prepare` replaces an existing meter block in place and appends
  it only when absent (`scripts/release.mjs` lines 3646 to 3651);
  `regeneratedPullRequestBody` does the same (lines 1810 to 1815); no check
  judges a title line, prose before the meter or the meter's position
  (`githubBodyProfileFailures` checks soft wrap and relative links only);
  product 08 §PRs and commits states no structural rule. Merged PR #223
  has prose first and the meter at line 11; #225, #227, #230 and #231 have
  the meter at line 3 and no bold lead-in; each `PR.md` was committed once.
- A target Release body is `${authority.title}\n\n${authority.objective}\n\nClosed by …`
  (`scripts/release.mjs` line 2667); the tag message carries the title and
  the close line (line 2646); neither is linted (`release.mjs` calls none
  of `checkOutwardArtifact`, `checkLocalTerms`, `privatePathLines`,
  `hasAiAttribution`); `outwardArtifactKinds` has no release kind. The
  published DotLn-Angular v0.1.0 body is three paragraphs: the order
  heading, the objective, the close line. `RELEASE-NOTES.md` is neither
  moved nor bound by the records action (`target-worktrees.mjs` lines 129
  to 202) and `worktree publish` skips its requirement for a target order
  (`worktree.mjs` lines 1177 to 1209). WO-221-D006 rejected the notes as
  the target body and reopens when an instance wants them; the fork asked
  on 2026-10-21.

**Design (scope discipline):**

- *Three checks, and the operator's correction as their reading.* The lint
  refuses what cannot be read in context (launchpad identifiers, `refuse`
  private terms) and reviews what can (the public words, `review` private
  terms); the reviewer's confirmation is a recorded act, so the floor that
  nothing leaves unread holds without a ban. Rejected: keeping
  `vocabulary.launchpad` as a refusal (axis: the operator's correction; a
  word is not a leak); removing the public list altogether (axis: the
  instance that publishes into an employer's repository still wants its
  reviewer told which DotLn words appear).
- *A mode per private term, review by default.* An unmarked line is a
  `review` term; a line marked `refuse:` (the exact marker is the
  executor's, documented in the kit README and refused when malformed) is
  refused as today; the lint never prints a private term, only its file,
  line and mode. Rejected: capitalization heuristics for "used as a name"
  (axis: sentence starts and acronyms; the operator judges context);
  `refuse` by default (axis: the correction says the ordinary-word case is
  the common one).
- *Confirmation is a digest, not a flag alone.* `--confirm-terms
  sha256:<digest>` names the composed body it confirms, so a body edited
  after reading is re-reviewed; the publication record holds the digest,
  the matches' count and the actor attestation; the journal row records
  the confirmation. Rejected: an environment variable or a bare `--yes`
  (axis: it confirms nothing in particular).
- *Generated sections are judged as their own kind.* The composed body is
  linted as reviewed prose plus generated sections with a section label in
  every finding; added paths are judged against the target's base tree
  (`git ls-tree` at `baseCommit`), so a target's existing `mask.ts` is not
  reported. Rejected: exempting generated sections entirely (axis: an added
  `WO-006-notes.md` in a target is a leak the identifier rule must catch).
- *Rename with an alias.* The key `reviewTerms` says what the list is;
  `terms` is read as the same list for one kit release and a file carrying
  both refuses; kit actions cannot migrate a JSON key
  (`scripts/launchpad.mjs` lines 1579 to 1583), so the alias is the
  migration. Rejected: a silent rename (axis: every instance's target
  publication would refuse until its operator edited the file).
- *The meter's owner keeps it last.* `release prepare` and the regenerated
  body move an existing block to the end; the shape check is structural
  (heading first, prose before the meter, meter last), never editorial
  (`docs/publication/examples/README.md` says no command refuses text for
  its style), and applies to the current order's stored `PR.md` only, so
  the four historical bodies stay as they are. Rejected: a seeded template
  with placeholders (axis: `release.mjs` lines 3639 to 3640, the meter
  never manufactures review prose); a check on bold lead-ins (axis: style).
- *The order names the Release's source.* `**Target release notes:**
  reviewed | objective`, the route WO-221-D006 reserved; `reviewed`
  requires the file and refuses an invalid one before any tag push, so the
  body never depends silently on a file's presence. Links in the notes are
  launchpad-relative and resolve nowhere in the target, so the renderer
  writes them as plain text, or as the moved record's target path when the
  binding names it. Rejected: moving `RELEASE-NOTES.md` into the target as
  a bound record (axis: the records binding's shape and every target order
  carrying notes it does not publish); editing a published Release (axis:
  product 07's immutability rule in three places; v0.1.0 keeps its body);
  taking the Release title from the notes (axis: existing Releases keep
  their titles).

**Deliverables:** the three rules and the two modes; the confirmation flag
and record; the split lint; the planning advisory; the meter placement and
the shape check; the target notes header, renderer, lint and bound digest;
fixtures; decisions; the write-backs.

**Acceptance criteria (all required)**

1. For a target publication, `lintOutwardArtifact` refuses a branch name,
   commit subject, pull-request title or body carrying each identifier form
   (`WO-006`, `WO-006-D018`, `FUP-280abd447f789958`, `VER-001`,
   `FINAL-001`, `REVIEW-007`, `WS-001`) under `identifier.launchpad`,
   naming the identifier, the rule and the line; the kit's fixed records
   commit message and a body line `Closes #4` pass; a launchpad artifact
   with `# WO-006` as its title passes; a case per form, each paired with a
   control that passes at the base with only this rule reverted.
2. A target body containing a `reviewTerms` word returns status `review`
   with the words, their lines and their section (reviewed prose or a named
   generated section) and refuses nothing; `publishTargetDraft` and
   `publishTargetWorktree` refuse that body without `--confirm-terms` and
   proceed with `--confirm-terms sha256:<digest of the composed body>`,
   recording the digest, the match count and the actor attestation in the
   publication record and in the journal; a stale digest refuses; a file
   with `reviewTerms: []` is valid and reports zero; a file with both
   `terms` and `reviewTerms` refuses; `terms` alone is read as the review
   list with an advisory naming the new key.
3. A private term marked `refuse:` refuses by file, line and mode without
   printing the term; an unmarked term is `review` and follows criterion
   2's confirmation; a present list with zero terms is `present` with
   count 0 and refuses nothing; an absent list is `unavailable` and refuses
   the publish as today; a malformed marker refuses naming the line.
4. In a fixture target whose base holds `src/mask.ts`, a draft that adds
   `fixtures/launchpad-board.json` and `docs/WO-006-notes.md` and edits
   `src/mask.ts`: the Change table's `WO-006-notes.md` refuses under
   `identifier.launchpad` naming the path and the section; the
   `launchpad-board.json` row joins the review list with its path; the
   `mask.ts` row is not reported; the reviewed prose is judged separately.
5. `npm run plan -- check` on a fixture target order whose Execution plan
   names `` `fixtures/gem-board.json` `` prints one advisory naming the
   path and the word and refuses nothing; a launchpad order with the same
   path prints none.
6. `release prepare` on a `PR.md` whose meter block sits between the
   heading and the prose moves it after the last prose paragraph and
   changes no other byte; `regeneratedPullRequestBody` does the same;
   `pullRequestBodyShapeFailures` refuses a stored body whose first
   non-blank line is not a level-one heading, one with no prose paragraph
   before the meter block, and one whose meter block is not the last block,
   and admits the published body's product-gate block after it; `worktree
   publish` for the current order and `check-surfaces` run the check on
   that order's `PR.md` only, and the five historical bodies named in the
   observed gap are not judged by any gate.
7. In the target release fixture, an order with `**Target release notes:**
   reviewed` and a valid `RELEASE-NOTES.md` publishes a Release whose body
   is the rendered five-section edition with the order title once under
   the overview, launchpad-relative links written as plain text or the
   moved record's target path, and the close line last; with the header
   absent or `objective` the body equals the fixture's recorded legacy text
   byte for byte; with `reviewed` and a missing or invalid file the close
   refuses before any tag push, naming the file; the tag message and the
   body pass the outward lint under the instance vocabulary and local
   terms with `release.displayName` exempt, a review match requiring the
   recorded confirmation; a retry after the notes changed refuses on the
   bound digest; a recheck of a Release published with the legacy body
   reports `existing`.
8. Product 08 §PRs and commits states the stored body's shape (heading
   first, prose, the meter block last, the product-gate block after it in
   the published body) and the review semantics of the three checks, and
   its §Release-note edition names the target header; product 07
   §Workflow closeout and releases names the header, the lint and the bound
   digest and its Outward artifacts bullet reads as the mechanism now
   works; the kit README's §First steps step 4 states the three checks,
   the per-term marker, the empty lists and the confirmation flag;
   `docs/README.md` lines 53 to 54 name `reviewTerms`; `npm run meta --
   --check` passes.
9. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency; no role text changed.

**Preflight:** `npm test -- --only outward-lint` for steps 2 and 3;
`npm test -- --only target-publish` and `npm test -- --only github-body` for
steps 4 and 7; `npm test -- --only plan-refutation` for step 5; `npm test --
--only release` and `npm test -- --only worktree` for steps 7 and 8;
`npm test -- --only target-worktree` for step 9; `npm test -- --only
launchpad` for the kit README; `npm test -- --only configuration-root` for
every script step; `npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then one `npm test -- --review` (07-execution-guide.md
§Preflight before the full gate).

**Execution plan (the executor follows these steps in order; observed at `926b8234`, 2026-10-21):**

1. `docs/evidence/WO-227/README.md` (new): at the base, the lint's three
   results on a fixture target body (the refusal text, the line, the
   section it sits in), the five merged bodies' meter positions, the
   target Release body of the fixture, written before any change. Check:
   the README names the base behavior with the commands run.
2. `scripts/lib/outward-lint.mjs` (`validateOutwardVocabulary`,
   `lintOutwardArtifact`, the term loop at lines 638 to 656): the
   `reviewTerms` key with `terms` as an alias and both refused; an empty
   array valid; the term loop produces `vocabulary.review` findings that
   never refuse and a `review` status carrying the words and lines; the
   rule `identifier.launchpad` for target artifacts (a `target: true`
   option the publish passes), matching the forms of criterion 1 as whole
   tokens, exempting a `Closes #N` reference; a section label on every
   finding when the caller supplies section offsets. Check: `npm test --
   --only outward-lint`.
3. `scripts/lib/terms.mjs` (`checkLocalTerms`): the per-term mode from the
   line marker, `review` unmarked; findings carry file, line and mode and
   never the term; a present empty list returns `{ status: "present",
   terms: 0 }`; a malformed marker throws naming the line. Check: `npm
   test -- --only outward-lint`.
4. `scripts/lib/target-publish.mjs` (`lintArtifacts`, `publishTargetDraft`
   at 998 to 1006, `publishTargetWorktree` at 1227 to 1237,
   `publishTargetOrder` at 1795) and `scripts/lib/github-body.mjs`
   (`targetChangeSection`): the composed body is linted with section
   offsets (reviewed prose, Change table, target checks); added paths are
   judged against `git ls-tree -r <baseCommit>` of the target; the
   `--confirm-terms sha256:<digest>` option is parsed in `scripts/worktree.mjs`
   publish and threaded through; a `review` status without a matching
   digest refuses naming the matches and the flag; the publication record
   (`docs/control/local/…` target publication log) and the journal row
   carry `{ confirmedDigest, matches, attestation }`. Check: `npm test --
   --only target-publish`; `npm test -- --only github-body`; `npm test --
   --only worktree`.
5. `scripts/lib/plan-receipts.mjs` (`checkPlanGate`): for each target order
   (`parseRepositoryDeclaration`), the backticked paths of the
   `**Execution plan …:**` field (an extractor on the model of
   `scripts/lib/handoff-ledger.mjs` line 51) are matched against the
   review list and the identifier forms through a shared matcher extracted
   from `outward-lint.mjs`; matches print one advisory per path and refuse
   nothing. Check: `npm test -- --only plan-refutation`.
6. `scripts/release.mjs` (the meter seeding at 3641 to 3651 and
   `regeneratedPullRequestBody` at 1803 to 1821): an existing block is
   removed from its place and appended after the last prose paragraph;
   `scripts/lib/github-body.mjs` gains `pullRequestBodyShapeFailures`
   beside `githubBodyProfileFailures` with the three structural rules and
   the published-body allowance; `scripts/worktree.mjs` publish (1167,
   1274) and `release.mjs` `githubBodyRule` (804 to 833) call it for the
   current order's `PR.md` only. Check: `npm test -- --only release`; `npm
   test -- --only github-body`; `npm test -- --only worktree`.
7. `scripts/release.mjs` (`prepareTargetRelease`, a header parser beside
   `targetReleaseClassification` at 2503 to 2516, `readWorkOrderAuthority`):
   the `**Target release notes:**` header; under `reviewed`, read
   `RELEASE-NOTES.md` at `sourceRevision` through `optionalGitFile` and
   `parseReleaseNotes`, render the single-order edition (the order title
   once under the overview, links rewritten, the close line last), refuse
   before the tag push when absent or invalid; lint the tag message and the
   body with a new kind `release-body` (format rules of `pr-body`,
   `identifier.launchpad`, the modes, the review confirmation through the
   dispatched `--confirm-terms`, `release.displayName` exempt from the word
   checks); bind the body's digest in `publication.target` and compare on
   retry; `ensureRelease` admits the recorded legacy body on a recheck as
   it admits the legacy title. `scripts/worktree.mjs` (1177 to 1209): a
   target order whose header says `reviewed` requires and parses the notes
   at publish. Check: `npm test -- --only release`; `npm test -- --only
   target-worktree`; `npm test -- --only worktree`.
8. Fixtures for criteria 1 to 7 in `scripts/test-outward-lint.mjs`,
   `scripts/test-target-publish.mjs`, `scripts/test-github-body.mjs`,
   `scripts/test-plan-refutation.mjs`, `scripts/test-release.sh` and
   `scripts/test-target-worktree-release.mjs` (the fixture at 477 to 493
   gains the `reviewed` case and keeps the legacy case), each settled row
   paired with a control that fails at the base with only its change
   reverted, recorded in `docs/evidence/WO-227/controls.json` with both
   arms' exit codes. Check: the Preflight suites.
9. `scripts/kit/README.client.md` §First steps step 4 (lines 122 to 146):
   the three checks, the per-term marker, the empty lists, the
   confirmation flag and the `reviewTerms` key; `docs/README.md` lines 53
   to 54. Check: `npm test -- --only launchpad`.
10. `docs/evidence/WO-227/decisions.md`: one decision per step with the
    chosen option, the rejected option, the case and the reversal
    condition; the operator's two corrections cited by the planning
    document's sibling-capture digest. Then `npm run meta`. Check: `npm run
    meta -- --check`.
11. Re-mints: none expected (Cost); if a step edited a registered evidence
    source, point `docs/evidence/current.json` at WO-227 revision 001 for
    each stale kind and run the deterministic re-mint; record either
    outcome in the decisions. Check: `npm test -- --only evidence-sources`.
12. Write-backs, in place, each heading re-read at the base: product 08
    §"## PRs and commits" (the stored body's shape beside the meter
    sentence at lines 307 to 310; the review semantics; a sentence that
    the balanced example predates the meter block) and §"Release-note
    edition" (the target header); product 07 §"## Workflow closeout and
    releases" (the target Release paragraphs at lines about 1808 to 1830:
    the header, the lint, the bound digest) and §"## Discipline" (the
    Outward artifacts bullet: the mechanism as it now works); `npm run
    publication:check`. Check: `npm run test:docs`.
13. Handoff: `npm run format`; `npm run test:docs`; `npm test -- --review`
    (a declared machinery source changed); complete
    `docs/evidence/WO-227/handoff.md`; `npm run resume --
    implementation-ready <flags>`.

**Evidence gate:** the Preflight suites; the paired controls of step 8;
`npm run test:docs`; `npm test -- --review`. No live model run: every case
runs on fixtures; the first live confirmation is the fork's next target
publish under the carrying starter release.

**Write-back duty:** criterion 8 and steps 9 and 12.

**Known issues and carry-ins:**

- The operator's corrections of 2026-10-21 are the authority for turning a
  refusal into a review item; the planning document §6 records them and
  their capture digest, and product 07's Outward artifacts bullet already
  states the reading. The verifier judges criterion 2 against that
  bullet, not against WO-063's PR body.
- The confirmation flag is a reviewer-role act under the host's
  permissions; whether a work fork's host admits the publish helper at all
  is WO-226's and the WO-221 qualification's question, not this order's.
- The identifier forms are the launchpad's own (criterion 1); an
  instance that mints other identifier shapes lists them in its
  `reviewTerms` or asks for the form through WO-193's route.
- WO-221-D006's reopening condition fired on 2026-10-21 (the fork's
  request for the reviewed notes on a target Release); this order is its
  disposition. The published DotLn-Angular v0.1.0 keeps its body (product
  07's immutability rule); a later Release of that target carries the
  notes once its order says `reviewed`.
- The balanced `prBody` example shows no meter block (its "Recorded
  observations" paragraph describes the meter in prose) and the reader
  comparison binds to the examples' hashes; this order states the shape in
  product 08 and leaves the example as a historical sample.
- `release.displayName` may itself contain a review word (the fork's
  `DotLn Angular`); the exemption of the registered display name is why
  the lint can run over a target Release at all.

**Non-goals:** changing role text; editing a published Release; moving
`RELEASE-NOTES.md` into a target repository; a dictionary or capitalization
heuristic for "used as a name"; rewriting the four historical pull-request
bodies; changing the local list's location or its redaction; a lint of
launchpad pull-request text for words (the launchpad's own vocabulary is
its own).

**Operator-review assumptions**

1. A review match is confirmed by the reviewer role reading the named lines
   and passing the digest; the operator reads the confirmation in the
   publication record and may set any private term to `refuse`.
2. `reviewTerms` may be empty; the instance decides what its reviewer is
   told about.
3. A target order says `reviewed` when its reviewer writes release notes;
   otherwise the Release keeps today's text.
4. The meter block's place is the end of the stored body; the shape check
   judges structure only.
