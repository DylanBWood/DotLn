# WO-189 — The front page is rewritten once from what it already says well, chosen by the operator from three candidates, and then guarded so that an order cannot append to it (v0.74.1)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. One document rewritten, one generated
line, one refusal in the document check, two rule sentences; no runtime
capability. Assigned at activation under the standing opt-out default.
**Cost:** adds a paragraph inventory of `README.md`, three complete
candidate front pages with a reader score each, the chosen one as the
new `README.md`, a release block that holds only the generated version
line (`scripts/lib/release-preparation.mjs`, `scripts/release.mjs`
`releaseBlockRule`), a refusal of README changes outside its generated
blocks for an order whose criteria do not name the file
(`scripts/docs-check.mjs`), and a sentence budget for the section that
says what runs. Removes: the release block's 7,894 bytes and about 46
sentences against a fifteen-sentence rule that only prose stated; the
duty that made 138 of 181 merged pull requests touch the front page;
about 10.4 KB of receipts and implementation inventory on the page most
visitors read; three stale statements (a map that lists three of six
packages, a console called read-only, a link to a plan of 2026-09-06 as
the way ahead). Re-mints: none; `scripts/release.mjs` is a declared
source of the harness-fixture and process-debt suites, so
`npm test -- --review` runs before handoff. Three writing episodes and
three reader episodes are sub-agent work of unmeasured cost. Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, item 3
(captured in ignored intake; SHA-256 in the ledger section of that
date), the third time the operator has raised it (the ledger's section
of 2026-09-28 on documents that only grow; WO-068's prune of
2026-09-16); register row FUP-84bc6f15abd1e45f, whose reopening
condition occurred when WO-086 closed without the README; WO-068 D004,
whose own reopening condition (the block passes fifteen sentences
again) has occurred; the 2026-10-02 planning pass's history of the file
([planning document](../planning/standard-pass-2026-10-02.md) §7).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: public text only; the epigraph is operator-authored public
wording kept by direction; no stop condition.
**Depends on:** WO-068 merged (the block and its markers; closed);
WO-086 merged (generated release history, which the page links instead
of repeating; closed).
**Recommended placement:** the machinery lane of the fifth pair, beside
WO-075; it has no dependency on any queued order and may run as a third
lane at any time. This order edits `README.md`,
`scripts/lib/release-preparation.mjs`, `scripts/release.mjs` (the
block rule), `scripts/lib/worktree-integration.mjs` (the block's merge
normalization), `scripts/docs-check.mjs`, `CONTRIBUTING.md` and package
READMEs where text moves, `docs/PLAYBOOK.md` and product 07. WO-188,
before it, edits `scripts/release.mjs` and `docs-check.mjs`. WO-112,
WO-118, WO-095, WO-098 and WO-088 name a README write-back in their
criteria and stay allowed to make it, within the budget this order
sets. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-068",
    "relation": "satisfied-by-close",
    "reason": "the release block, its markers and the fifteen-sentence rule this order replaces with a mechanism"
  },
  {
    "workOrderId": "WO-086",
    "relation": "satisfied-by-close",
    "reason": "the generated release history the front page links instead of restating"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `README.md` whole;
`docs/evidence/WO-068/decisions.md` D004;
`docs/lineage/idea-ledger.md`, the section of 2026-09-28 on product
documents that only grow; `docs/PLAYBOOK.md` (the sentence that makes
the README block part of every versioned order); product 07
§Documentation freshness and ownership and §Discipline (no ratchet
creep); product 08 §Audience editions; `scripts/lib/release-preparation.mjs`
(the version claim); `scripts/release.mjs` (`releaseBlockRule`);
`scripts/lib/worktree-integration.mjs` (the block's normalization);
`scripts/docs-check.mjs`; product 00 (the vision the page introduces);
the [2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§7.

**Objective:** A visitor who reads only the front page learns what
DotLn is, why it exists, what runs today and how to try it, in a length
they will finish, in the voice the page already has at its best. After
this order the page changes only when an order is filed to change it.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- `README.md` is 37,717 bytes in 643 lines; it was 4,841 bytes on
  2026-08-31. 138 of 181 merged pull requests changed it: 65 only the
  version line, 30 by appending a sentence to the release block, 43 with
  larger edits.
- The release block was pruned on 2026-09-16 (to 2,927 bytes) and on
  2026-09-19 (to 2,613 bytes) and is 7,894 bytes today, about 46
  sentences. Product 07 limits it to fifteen; nothing checks that. The
  check reads only the markers and one version.
- 30 sentences (5,528 bytes) carry a work-order identifier, a version, a
  date or a decision identifier; by a paragraph reading, about 10,400
  bytes (27.6%) are receipts, runner flags and toolchain detail.
- The causes are rules, not carelessness: the playbook makes the README
  block part of every order that takes a version; product 07 makes the
  executor own reader entry points; `release prepare` refuses unless the
  block's version matches; five queued orders name a README write-back
  in their criteria.
- The headline rule that fixed pull-request titles (a role sentence, the
  recent series printed beside the draft, no numeric limit) held the
  maximum and let the median drift from 15 to 18 or 19 words. A title
  has one author at one moment; the README block has three writers and
  none sees its size.
- Stale statements: the map names three of six packages and calls the
  console read-only; the horizon paragraph links the 2026-09-06 plan.

**Design (scope discipline):**

- **Inventory first.** Every paragraph of today's page is classed keep,
  move (naming the document that owns it) or cut (naming the document
  that already says it). Nothing leaves the repository: test, sandbox
  and toolchain detail moves to `CONTRIBUTING.md` or a package README;
  per-order receipts are already in release notes and are cut here.
- **Three candidates from the kept material**, each complete: about
  1,200, 2,000 and 3,000 words, differing in section order and in how
  "what runs today" is told. The parts the page does well stay in every
  candidate in their own words: the epigraph and thesis, why it exists,
  the loop, the bets, the game vocabulary, the horizons, the boundary,
  the name.
- **A reader check, written before the candidates.** Six questions with
  a key: what DotLn is; who it is for; what runs today; how to try it in
  one command; what is not built; where to read next. A fresh reader
  with only one candidate answers them; the answers are scored against
  the key and recorded.
- **The operator chooses.** The final review presents the three with
  their scores. If no choice is recorded by handoff, the shortest
  candidate with a full score is committed and the other two stay in the
  evidence for a later swap.
- **Then the page is owned.** The release block holds one generated
  line, the version claim, written by `release prepare`. "What runs
  today" is ordinary prose outside the markers with a sentence budget:
  the chosen candidate's count plus two. The document check refuses a
  change to `README.md` outside its generated blocks unless the active
  order's acceptance criteria name the file, and refuses a change that
  takes that section over its budget. The playbook and product 07 say
  that an order does not edit the front page; a capability the page
  should mention is proposed as one sentence in the order's evidence
  README, and a planning pass that finds two waiting files a front-page
  order.
- **Declined alternatives, recorded:** one more prune under the same
  rules (two prunes regrew threefold in twelve days); generating "what
  runs today" from release notes (it would read as a log, which is the
  complaint); a byte ceiling like the product documents' (a size bound
  invites trimming, WO-068 D004's objection; the bound here is ownership
  plus a count the operator chose by picking a candidate); stripping the
  version line from the page (release preparation and the merge
  normalization read it).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `docs/evidence/WO-189/inventory.json` (new) rows `{ id, sha256, class, destination, anchors[] }`,
   `inventory.md` rendered from it, and `inventory-check.mjs` asserting each literal anchor
   occurs in its destination (criterion 1 is judged on anchors, not on prose matching).
   Check: `node docs/evidence/WO-189/inventory-check.mjs`.
2. `reader-key.json` committed as a checkpoint before any candidate exists (`git log` order
   shows it).
3. `candidate-1200.md`, `candidate-2000.md`, `candidate-3000.md`; three reader runs launched
   outside the repository (the pinned CLI with cwd in an empty temporary directory, so no
   CLAUDE.md loads; model and effort readback recorded; a sub-agent spawned inside the
   repository receives CLAUDE.md and is not a stranger); scores persisted as
   `reader-scores.json` rows `{ candidate, question, quote, score, scorer, model, effort }`.
4. Moves: `CONTRIBUTING.md` and the package READMEs receive the moved paragraphs;
   `inventory-check` passes.
5. `README.md`: the chosen candidate (the operator picks at final review; fallback: the
   shortest candidate with a full score); the map names the six packages (beacons,
   browser-evidence, compiler, console, kernel, skeleton); remove the maintainer comment
   (lines 85 to 93); the release block is exactly one generated line; "What runs today" sits
   between `<!-- dotln-what-runs:start -->` and `<!-- dotln-what-runs:end -->` with one
   sentence per physical line, and the budget counts non-empty lines.
6. `scripts/lib/release-preparation.mjs` `planReleasePreparation`: write the block as the
   single line `This source prepares DotLn \`vX.Y.Z\`.`; `scripts/release.mjs`
   `releaseBlockRule` (line 488): FAIL on any other non-empty line between the markers. Check:
   `node --test scripts/test-release-preparation.mjs`; the `release-surfaces` row; the four
   tests that pin the wording (`scripts/test-worktree-integration.mjs` lines 123, 284, 679,
   1142; `scripts/test-release-preparation.mjs` line 46) updated.
7. `scripts/lib/worktree-integration.mjs` `mixedProjection` (line 125): logic unchanged; add a
   one-line-block merge case to `scripts/test-worktree-integration.mjs`.
8. `scripts/docs-check.mjs` new `frontPageFindings(root)`: base `git merge-base HEAD main`;
   diff `README.md` outside the generated blocks; the active order from branch `wo-NNN`; its
   typed `**Front page:** README.md` header field (the 2026-10-07 pass added it to WO-118,
   WO-095, WO-098 and WO-088; nothing reads the criteria's prose); the line budget. Fixtures
   in `scripts/test-docs-check.mjs` (`docs-check-fixtures`); the "fails against `08845c71`"
   case runs the fixture with `git show 08845c71:scripts/docs-check.mjs`.
9. The header-field reader: a small helper in `scripts/lib/` (new, `front-page-scope.mjs`)
   using `dependencyHeader`, so `scripts/work-orders.mjs` (WO-190's) stays untouched.
10. Write-backs: `docs/PLAYBOOK.md` §"## The loop, per work order" (replace the sentence at
    line 262 about the root README release block); product 07 §"## Documentation freshness and
    ownership" (replace the sentence about the fifteen-sentence write-back, in place);
    `docs/evidence/WO-189/decisions.md` with totals and scores; FUP-84bc6f15abd1e45f retargeted
    at close; locks via `node scripts/check-publication.mjs --print-locks`.
11. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-189/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the inventory; the reader key; three candidates with
scores; the chosen `README.md`; the moved text in its new homes; the
generated version line and its rule; the refusal and the budget with
fixtures; the two rule sentences.

**Acceptance criteria (all required)**

1. `docs/evidence/WO-189/inventory.md` classes every paragraph of the
   page at this order's base and names, for each moved or cut one, the
   document that holds it afterwards; a check script shows that every
   moved paragraph's facts are present there.
2. The reader key is committed before the candidates (shown by the
   checkpoint order); each candidate has six scored answers from a
   reader that was given that candidate and nothing else; the three
   candidates are complete documents under the evidence directory.
3. `README.md` is the chosen candidate, with the operator's choice or
   the fallback recorded. It holds no work-order identifier, decision
   identifier, date or version outside the generated line; its map
   names every package under `packages/`; every link resolves; every
   command it shows runs as written on this host.
4. `release prepare` writes exactly the one version line between the
   markers and changes nothing else in the file; the block rule refuses
   any other content between them; the integration normalization still
   reconciles the line across a merge. Fixtures cover each.
5. The document check refuses a README change outside the generated
   blocks when the active order's criteria do not name `README.md`,
   admits one when they do, and refuses a change that takes "What runs
   today" over its sentence budget; fixtures cover the three cases, and
   the first fails against `08845c71`.
6. `docs/PLAYBOOK.md` and product 07 §Documentation freshness and
   ownership each say, in place, that an order does not edit the front
   page and where a proposed sentence goes; the fifteen-sentence rule
   and the maintainer comment in the page are gone.
7. Write-backs: the decisions file with the inventory's totals and the
   scores; register row FUP-84bc6f15abd1e45f retargeted at close; the
   publication locks refreshed.
8. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the inventory, the key, the three candidates and
their scored answers; the fixtures of criteria 4 and 5;
`npm test -- --review` before `implementation-ready`, because
`scripts/release.mjs` is a declared machinery source, and again at final
review. No live row.

**Write-back duty:** as listed in criteria 6 and 7.

**Known issues and carry-ins:**
- 2026-10-07 pass: stale and corrected above: `README.md` is 39,030
  bytes in 661 lines; the release block is 8,535 bytes; 145 of 187
  first-parent merges changed the page; WO-112 is closed; WO-118's README
  sentence now goes into the marked "What runs today" section, not the
  release block (its criterion was amended by the pass); the wording
  "This source prepares DotLn" is pinned by the five tests named in step 6.
- Decided by the 2026-10-07 pass: the typed `**Front page:**` field;
  one sentence per line; the isolated reader launch; the fallback
  candidate. Reopen: the operator picks a candidate the scores rank
  lower.
- WO-188 item 14 edits `planReleasePreparation`, `decisionsConflicted`
  and `worktree-integration.mjs` `regenerate` before this order; the
  executor rebases over it and re-reads the line positions.

- WO-112, WO-118, WO-095 and WO-098 each fold one sentence into "What
  runs today", and WO-088 emits a generated phrase table between its
  own markers; the check admits them because their criteria name the
  file, and holds them to the budget.
- The line "This source prepares DotLn" names a version that may
  already be published; release preparation requires that wording, and
  it stays.
- The epigraph and the phrases the operator directed to be kept are
  operator-authored public wording; candidates keep them verbatim.

**Non-goals:** the product documents; the work-order index (WO-190);
pull-request and release-note style (WO-191); a recurring polish job; a
length rule on any other document.

**Operator-review assumptions**

1. The operator picks the candidate; the fallback is the shortest one
   that answers all six questions.
2. Text that leaves the page is moved, never deleted from the
   repository.
3. After this order an ordinary order cannot change the front page; the
   four queued orders that already promise a sentence keep that promise
   within the budget.
4. The budget for "What runs today" is the chosen candidate's sentence
   count plus two.
