# WO-191 — What DotLn publishes is written to a committed reader profile per surface, chosen from examples and scored by fresh readers (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier high; reviewer any.
**Track:** machinery
**Release classification:** patch. One control file, one examples
library, one command with three forms, two prints at existing writing
moments, one reviewer sentence, one planner sentence; no refusal of any
text and no runtime capability. Assigned at activation under the
standing opt-out default.
**Cost:** adds `docs/control/reader-profiles.json` (five surfaces, five
dimensions, three positions each), an examples library under
`docs/publication/examples/`, `npm run reader -- profile|preview|score`
(`scripts/reader.mjs`), the profile's guidance printed by
`worktree publish` and `release prepare` beside the draft
(`scripts/worktree.mjs`, `scripts/release.mjs`), one sentence in the
reviewer role and one in the planner role
(`packages/skeleton/src/loadouts/contributor.ts`), a score file
(`docs/publication/reader-scores.jsonl`) and one line at `plan start`.
Removes: the operator's only present way to change how published text
reads, which is a correction after the fact repeated per surface (three
dated corrections on titles and commit style in product 08, on
2026-09-05, 2026-09-07 and 2026-09-09). A planning pass pays one reader
agent only after a profile changes and three releases have followed it,
or when the operator asks. Re-mints: `contributor.ts` is a
registered evidence source, so the editions it stales are re-minted
deterministically; it, `scripts/release.mjs` and `scripts/worktree.mjs`
are declared machinery sources, so `npm test -- --review` runs before
handoff; no file the feedback verifier judges changes. Cold-start bytes
of the reviewer and planner roots rise by one sentence each; the
acceptance route applies. The examples are sub-agent work of unmeasured
cost. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, item 17
(captured in ignored intake; SHA-256 in the ledger section of that
date); the 2026-10-02 planning pass's samples of merged pull requests,
release notes, Release pages and commit subjects
([planning document](../planning/standard-pass-2026-10-02.md) §7);
product 08 §Audience editions and §Publication manifest, the existing
ideas this order applies to DotLn's own surfaces. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: this repository's
public text only; no stop condition.
**Depends on:** WO-188 (its item 24 removes the unavailable meter rows,
the relative links and the repeated Release heading; the examples start
from the surfaces after that repair); WO-126 merged (the headline rule
and the series print this order generalizes; closed).
**Recommended placement:** the machinery lane of the seventh pair,
beside WO-073. This order edits `scripts/reader.mjs` (new),
`scripts/worktree.mjs`, `scripts/release.mjs`,
`packages/skeleton/src/loadouts/contributor.ts`,
`scripts/lib/plan-failures.mjs` (the `plan start` line), product 08 and
`docs/publication/`; WO-073 edits the configuration root, class and
profile documents. WO-187, WO-188 and WO-189 edit `contributor.ts`,
`release.mjs` or `worktree.mjs` before it. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-188",
    "relation": "hard",
    "reason": "item 24 repairs the pull-request body and Release page defects the examples would otherwise copy"
  },
  {
    "workOrderId": "WO-126",
    "relation": "satisfied-by-close",
    "reason": "the headline rule and the series print shown while a title is written"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 08 §Audience editions,
§Publication manifest, §PRs and commits and §Release-note edition;
`docs/publication/dual-voice-sample.md`; product 07 §Discipline (no
ratchet creep); `scripts/worktree.mjs` (the publish step's series
print); `scripts/release.mjs` (`releaseEdition`);
`scripts/lib/release-notes.mjs`; `scripts/lib/github-body.mjs`;
`packages/skeleton/src/loadouts/contributor.ts` (the reviewer's
headline sentence); `docs/evidence/WO-068/decisions.md` D004 (why a
machine limit on prose was declined); the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§7.

**Objective:** How DotLn's published text reads is a setting the
operator chooses from examples and can change, surface by surface, and
the record shows whether readers found what they came for after each
change.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- Ten recent pull-request bodies have a median of 7,955 characters, 39%
  of it machine-generated; release notes 6,770 characters with 19%
  identifiers, paths or hashes; Release pages 10,089 characters at the
  highest reading grade of the three. Ten recent commit subjects: six
  carry an identifier or version and eight are bookkeeping.
- The same sample holds sentences that read well (the first line of the
  release notes of WO-062 and of WO-179) and ones that do not (a
  validation sentence of five identifiers and hashes; a 24-word title).
  Nothing says which the operator wants where.
- Style is set by dated corrections in product 08, each fixing one
  surface after the fact. The one mechanism, the series print for
  titles, held the longest titles and let the median drift from 15 to
  18 or 19 words.
- Product 08 already describes audiences and a manifest with `audience`,
  `detail` and `examples` fields, and holds one two-voice sample. No
  role reads any of it when writing, and the loadouts carry no setting
  for prose.
- There is no measure of how published text reads: the meter records
  the subject's length and nothing else.

**Design (scope discipline):**

- **One profile per surface.** Surfaces: pull-request title,
  pull-request body, commit subject, release notes, Release page.
  Dimensions, each with three named positions: `audience` (maintainer,
  contributor, newcomer), `density` (headline, account, record),
  `identifiers` (none in prose, where they help, every claim),
  `machineDetail` (linked, summarized, inline), `voice` (plain, warm,
  expressive). `docs/control/reader-profiles.json` holds one position
  per dimension per surface. The file is the committed choice; the
  profile in force for a release is the file at that release's tag.
- **Examples before choices.** For one small real release chosen by the
  executor, each surface is written three times: `record` (as published
  today), `balanced` and `reader`, each naming its positions. Each
  dimension position also has a two-sentence illustration. `npm run
  reader -- preview <surface>` prints the examples side by side;
  `npm run reader -- profile <surface>` prints the guidance the
  committed profile compiles to and the nearest example's path.
- **Shown at the moment of writing.** `worktree publish` prints the
  title and body guidance beside the series print it already shows;
  `release prepare` prints the release-note guidance. The reviewer's
  role text says to read the profile for each surface it writes. Facts,
  limits, required sections and the attribution refusal are untouched:
  a profile changes order, vocabulary and depth, as product 08 says an
  audience may.
- **A score from fresh readers.** `npm run reader -- score` prints one
  canonical prompt covering the releases not yet scored (at most ten):
  a reader with only the published text answers four fixed questions
  per release (what changed for me; must I act; what is not covered;
  where is the evidence) by quoting the sentence that answers each or
  saying it is not there. `npm run reader -- score --record <file>`
  checks that every quotation is in the text, computes how far into the
  text each answer sat, and appends one row per release with the
  profile revision. `plan start` prints found answers and median
  position by profile revision. A planning pass runs the reader once
  when a profile revision has three or more unscored releases, or at the
  operator's word; a pass with no profile change since the last score
  runs none. A correction the operator gives on a surface is recorded
  beside that surface's score.
- **The operator chooses.** The final review presents the three
  examples per surface. Without a recorded choice the committed profile
  is `balanced` on every surface, and the examples stay for a later
  change. A later change is one edit to the control file in a planning
  pass, with `preview` to see it first.
- **Declined alternatives, recorded:** a check that refuses text by
  length, grade or identifier count (WO-068 D004: a machine limit on
  prose invites gaming; the measures are shown, never enforced); a
  recurring polish job that rewrites published surfaces (it edits
  reviewed text without a review, and nothing yet says which direction
  is better: reopen when two profile revisions have scores that
  differ); a profile per audience edition of the product documents
  (product 08's candidate; no reader of this order asked for it); the
  front page, order titles and code comments as surfaces (WO-189 and
  WO-188 own them; the control file can name them later).

**Deliverables:** the control file and its check; the examples library;
the command and its three forms; the two prints; the role sentences and
regenerated roots; the score file and the `plan start` line; fixtures;
the write-backs below.

**Acceptance criteria (all required)**

1. `docs/control/reader-profiles.json` names the five surfaces and one
   position per dimension for each; `npm run test:docs` refuses a
   fixture with an unknown surface, dimension or position and one with
   a missing surface.
2. The examples library holds, for one real release named in the
   decisions, three complete versions of each surface with their
   positions stated, and a two-sentence illustration for every position
   of every dimension; every version states the same facts and limits,
   shown by a reviewer-run comparison recorded in the evidence.
3. `npm run reader -- profile <surface>` prints the guidance and the
   nearest example's path for the committed profile, and
   `preview <surface>` prints the three examples; both refuse an unknown
   surface with the list of known ones; fixtures cover each.
4. `worktree publish` and `release prepare` print the guidance for
   their surfaces on fixture orders; neither refuses or rewrites any
   text because of a profile; their existing checks pass unchanged.
5. `npm run reader -- score` prints one prompt for the unscored
   releases, at most ten; `--record` refuses a result whose quotation
   is not in the published text and names it, appends one row per
   release carrying the profile revision read from that release's tag,
   and is idempotent for a release already scored; `plan start` prints
   the figures by revision over a fixture score file.
6. The generated reviewer root carries the profile sentence and the
   planner root the scoring sentence; `npm run harness -- check` is
   green; cold-start bytes of both roots are measured and recorded, and
   a ceiling met has a dated acceptance under the standing route.
7. One real scoring run over the ten most recent releases is recorded
   as the baseline row set, with the reader's model and effort.
8. Write-backs: product 08 §PRs and commits names the profile as where
   style is set and keeps its dated corrections as history; the
   decisions file with the operator's choice or the fallback; the
   decisions index; the publication locks refreshed.
9. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1 and 3 to 5; the examples
and their fact comparison; the baseline scoring run;
`npm test -- --review` before `implementation-ready`, because
`contributor.ts`, `scripts/release.mjs` and `scripts/worktree.mjs` are
declared machinery sources, and again at final review.

**Write-back duty:** as listed in criterion 8.

**Known issues and carry-ins:**

- Reading-grade figures in the planning document use a syllable
  heuristic; they compare samples with each other and are not a target.
- Whether relative links on Release and pull-request pages are broken
  was inferred from URL resolution, not from a loaded page; WO-188 item
  24 settles it before this order starts.
- A reader can quote a sentence that does not answer the question; the
  score is an indicator the operator reads beside the examples, never a
  gate.
- Receipt 038: the score measures what a fresh agent can find in the
  text, not the operator's taste, which stays the reference. Reopen if
  the operator corrects a surface's style while its score is unchanged
  or rising, or a profile change raises the score on text the operator
  rejects.
- Receipt 038: the corrections this order replaces were three, none
  after 2026-09-09, so the reader run is tied to a profile change and is
  not a standing cost on every pass. Reopen if passes record reader runs
  whose scores change no profile.

**Non-goals:** refusing or rewriting any published text; the product
documents' audience editions; the front page (WO-189); order titles
and code comments; changing what release notes must contain; a daily
or scheduled polish job.

**Operator-review assumptions**

1. Five surfaces and five three-position dimensions are enough to start;
   more are added by editing the control file.
2. The operator picks each surface's profile from the examples; without
   a pick the profile is `balanced`.
3. A score is collected by the planner after a profile change or at the
   operator's word, never by the final review, whose duties stay as they
   are.
4. No published text is ever refused or changed because of a profile or
   a score.
