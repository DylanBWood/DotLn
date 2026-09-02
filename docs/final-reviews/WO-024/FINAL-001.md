# WO-024 final review FINAL-001

**Subject:** branch `wo-024`, worktree `DotLn-wo024`, uncommitted working tree,
2026-09-02. `HEAD` and `origin/main` are both
`c1ea2ed856f8d7b99848c7658f9ace3345667db4`, the WO-013 merge published as
annotated `v0.3.1`; the branch carries no local commits, so the entire subject
is the dirty tree. At review open, before this review's own transition:
twenty-one tracked modifications (1600 insertions / 154 deletions against
`HEAD`, including the two `docs/control` files) plus three untracked paths —
`scripts/release-notes.mjs` (192 lines), `scripts/github-repository.mjs` (84),
and `docs/verifications/WO-024/VER-001.md`. The subject is exactly the tree
VER-001 passed: every deliverable blob carries the identical hash in
`refs/dotln/checkpoint/WO-024/2` (implementation-ready), `/3` (verify
allocation), `/4` (verdict), and the working tree (§Dispatch and subject
integrity). This review adds this report, its PR body, this order's
`RELEASE-NOTES.md`, one bounded wording correction (§Corrections applied), and
the lifecycle's own events.
**Authority:** `docs/work-orders/WO-024-release-notes-surfaced.md` — objective,
observed problem, seven design clauses, five deliverables, eight acceptance
criteria, evidence gate, closeout, and non-goals. Three hunks differ from the
activated text (`@@ -1 +1 @@`, `@@ -6,6 +6,10 @@`, `@@ -230,5 +234,6 @@`): the
H1 and release-classification paragraph, and the closeout's backfill sentence
(§Adjudications, item 2). The objective, observed problem, design, deliverables,
acceptance criteria, evidence gate, and non-goals are byte-identical to the
activated text. No ideation breakout was opened, so no receipt is owed; the
control log records activation, implementation-ready, one verification, and
this review, with no repair episode.
**Prior reports:** `VER-001` (pass; all eight criteria confirmed first-hand;
five observations for the final reviewer; no findings). Complete sequence: one
report.
**Reviewer:** Claude Fable 5.1 (`claude-fable-5-1`), **effort `max`**, in Claude
Code 2.1.259 under the recorded sandboxed-Bash auto-allow posture; macOS 15.6
(darwin 24.6.0, arm64), node v22.2.0, npm 10.8.0, git 2.55.0, Prettier 3.9.6,
TypeScript 5.4.5. WO-024 permits any capable model as reviewer. Every command
in this report ran first-hand from this worktree inside the sandbox; nothing is
quoted from the executor's or verifier's transcripts. No subagents were used.

**Verdict: WO-024 passes.** The defect the order was cut for is gone: the tag's
human layer is a five-section edition assembled from reviewed prose, the same
layer is projected as a GitHub Release under the existing release-close phrase,
and `notes` and `list` render published records offline. All eight acceptance
criteria are met on first-hand evidence. Beyond re-running the executor's
suites, this review re-derived the criteria with four instruments of its own
that the suites cannot substitute for: a 36-input parser probe, a merge-history
release fixture with five scenarios the executor's linear fixtures cannot
express, a ten-case `worktree publish` probe, and a dry run of the operator's
own future command on the real tree against a scratch origin, which published
annotated `v0.3.2` and re-derived it byte for byte on rerun. A fourteen-mutant
drill shows the executor's suites catch twelve single-point breaks; the two
survivors are documented test thinness, one of which the merge-history probe
catches. One bounded wording correction was applied. Nothing
acceptance-relevant was changed by this review.

## Self-referential instruments — disclosure

07-execution-guide.md §Discipline requires naming the instruments that are part
of the deliverable under judgment.

1. **`scripts/test-release.sh` and `scripts/test-worktree.sh` are both
   deliverable and evidence** for criteria 1–5, and their `gh` stub is the
   only witness to the GitHub Release path. Mitigation: probes A–C and the dry
   run below are written by this session and assert properties the suites do
   not (first-parent order under real merges, forward enforcement after the
   contract activates, modified and deleted notes, the real tree); the drill
   inverts the relationship and asks whether the suites fail when the code is
   broken.
2. **`scripts/release-notes.mjs` sits on both sides**: `worktree publish` and
   `release close` validate with the same parser. Probe A drives it in
   isolation, probe C through `publish`, probe B and the dry run through
   `close`; all agree.
3. **`scripts/resume.mjs` allocated this report's path** and appended
   `FinalReviewRequested`. It is under judgment only for a one-string
   `release-close` message change, inspected before use; it is a fail-loud
   append-only log with a regenerated projection.
4. **This order's own release close is the first real drive of the mechanism it
   ships** (AC7). That drive is the operator's post-merge action. The dry run
   below is the closest a pre-merge session can come to it without touching
   `origin` or `gh`: it exercised the real code on the real tree against a
   scratch bare origin and stubs. Nothing in this session performed or implied
   a release or a Release against the real repository.
5. **The reviewer authored `docs/final-reviews/WO-024/RELEASE-NOTES.md` and is
   also judging the contract it satisfies.** The contract (headings, `None.`,
   Markdown subset, refusal at publish) is the executor's deliverable; this
   review only wrote a file that meets it. The file was validated through the
   deliverable's own parser, through the dry run's real `close`, and is shown
   to the operator in the PR. Its editorial adequacy is the operator's to judge
   at merge.

## Dispatch and subject integrity

`docs/control/current.md` named WO-024 at phase `verified` with `final-review`
as the only legal action. Before invoking the transition I inspected the
`resume` mapping in `package.json` and the `scripts/resume.mjs` diff: one
message string, "This is tag authority only" widened to "This narrowly
authorizes the annotated tag and its matching GitHub Release", no control-flow
change. `npm run resume -- final-review` ran inside the ordinary sandbox with no
approval escalation, allocated `docs/final-reviews/WO-024/FINAL-001.md`, moved
the phase to `final-review`, and minted checkpoint
`ce4042eac5763d850eeea8343fbdb3c401a48208`
(`refs/dotln/checkpoint/WO-024/5`). `docs/control/resume.jsonl` is a strict
append over `HEAD`: zero removed lines, five WO-024 events added before this
report (`WorkOrderActivated`, `ImplementationReady`, `VerificationRequested`,
`VerificationCompleted`, `FinalReviewRequested`), plus the
`FinalReviewCompleted` the pass records.

No destructive git command ran in this worktree; nothing was restored from a
checkpoint; the shared repository's worktree list and stash were not touched.
The repository still has exactly six tags (`v0.2.0`–`v0.3.1`) and no refs
outside `refs/heads`, `refs/tags`, `refs/remotes`, and `refs/dotln`.

Blob identity of the subject across the lifecycle (first ten hex digits;
`git hash-object` of the working tree against `git ls-tree` of each checkpoint):

| Path                                                | working tree | checkpoint 2 | checkpoint 3 | checkpoint 4 |
| --------------------------------------------------- | ------------ | ------------ | ------------ | ------------ |
| `scripts/release.mjs`                               | `d0a8aeb65d` | same         | same         | same         |
| `scripts/release-notes.mjs`                         | `ef9e25ea80` | same         | same         | same         |
| `scripts/github-repository.mjs`                     | `ab03203fa0` | same         | same         | same         |
| `scripts/worktree.mjs`                              | `f0a3a2fe54` | same         | same         | same         |
| `scripts/resume.mjs`                                | `268b2b19b0` | same         | same         | same         |
| `scripts/test-release.sh`                           | `34dd375ce8` | same         | same         | same         |
| `scripts/test-worktree.sh`                          | `298b91d9b3` | same         | same         | same         |
| `docs/PLAYBOOK.md`                                  | `8d0b3403cb` | same         | same         | same         |
| `docs/README.md`                                    | `0c1d442d85` | same         | same         | same         |
| `docs/final-reviews/README.md`                      | `7b4b1125a0` | same         | same         | same         |
| `docs/lineage/idea-ledger.md`                       | `353768ea84` | same         | same         | same         |
| `docs/planning/work-order-map.md` (before §Corrections) | `25fc38c61b` | same     | same         | same         |
| `docs/product/03-architecture.md`                   | `5b42edc1ff` | same         | same         | same         |
| `docs/product/04-interfaces.md`                     | `34e7bd2ef9` | same         | same         | same         |
| `docs/product/06-roadmap.md`                        | `42dc21e0ce` | same         | same         | same         |
| `docs/product/07-execution-guide.md`                | `f76c22d44b` | same         | same         | same         |
| `docs/publication/everyday-ai-user-toc.md`          | `d3f6e684cd` | same         | same         | same         |
| `docs/publication/software-engineer-toc.md`         | `ceb990ea86` | same         | same         | same         |
| `docs/publication/staleness-demonstration.md`       | `25017126e6` | same         | same         | same         |
| `docs/releases/README.md`                           | `976581ac7b` | same         | same         | same         |
| `docs/work-orders/WO-024-release-notes-surfaced.md` | `c2345fab4d` | same         | same         | same         |
| `docs/verifications/WO-024/VER-001.md`              | `19dd2785fc` | absent       | absent       | same         |

The verifier changed nothing in the deliverable, and VER-001 has not changed
since its verdict was recorded.

## Final evidence summary

Every line below is output this session produced.

### The unchanged `npm test`, twice

Run from this worktree inside the sandbox before the probes and again after the
last file of this review was written:

```text
harness: Claude Code 2.1.259; macOS 15.6 arm64; node v22.2.0; npm 10.8.0; git 2.55.0
cwd: <worktree> (branch wo-024, HEAD c1ea2ed)
TMPDIR=/tmp/claude-501
residue before: dotln-final-mirror dotln-probe.D6dhna dotln-resume-test.K7YNMg
$ npm test
All matched files use Prettier code style!
… 33 PASS lines …
fixture temp-root tests passed
publication checker tests passed
backup-intake tests passed
resume tests passed
checkpoint tests passed
release-notes publish validation fixtures passed
GitHub PR target, authentication, and committed-body fixtures passed
worktree tests passed
release edition, GitHub projection, recovery, and historical backfill fixtures passed
release tests passed
# tests 77
# pass 77
# fail 0
npm test exit status: 0
residue after: dotln-final-mirror dotln-probe.D6dhna dotln-resume-test.K7YNMg
```

The three `dotln-*` entries beneath the session base are pre-existing residue
from sessions dated 2026-09-01, listed and left alone; the probes' own owned
roots were removed by their traps.

The suites' `gh` stub transcripts, as emitted by my run: the release suite
shows `--version`, `auth status --hostname github.com`, `release view …`, then
exactly one `release create v0.2.1 --repo github.com/dotln-fixture/edition
--verify-tag --title DotLn v0.2.1 --notes-file <temporary-release-body>`; a
second close produces `view` only; the `v0.2.0` backfill produces one `create`.
The worktree suite shows `--version`, `auth status --hostname github.com`, then
one `pr create --repo github.com/dotln-fixture/worktree --head wo-099 --base
main --title ':sparkles: fixture' --body-file <committed-PR-body>`.

### Static checks

- `git diff --check`: clean, before and after the correction and the added
  artifacts. `npm run format:check`: clean (inside both `npm test` runs and
  standalone after the correction).
- `packages/` is byte-identical to `origin/main` (empty diff, no untracked
  files); `package.json` and `package-lock.json` are unchanged; no tracked,
  untracked, or ignored `.claude/` change.
- `npm run publication:check`: `CURRENT` for both editions; `--print-locks`
  emits exactly the two hashes recorded in the two TOC files and in
  `docs/publication/staleness-demonstration.md` §10.
- AC6 grep over `scripts/`: `gh` is spawned from exactly two sites
  (`release.mjs:1132`, `worktree.mjs:49`), each behind a wrapper that deletes
  `GH_REPO`/`GH_HOST` and receives the `--repo` target resolved from `origin`;
  the argument vectors are `--version`, `auth status --hostname <host>`,
  `release view`, `release create`, and the pre-existing `pr create`; no
  `release edit`, `release delete`, `release upload`, `api`, or `repo` call
  exists. `git push` occurs at `worktree.mjs:268` (`origin wo-NNN`) and
  `release.mjs:1286` (`<object>:refs/tags/<tag>` with `--no-follow-tags`, no
  force). `release.mjs:1296` writes the local tag ref with an empty old value,
  so an existing ref can never be moved. `main` is only ever fetched and
  fast-forwarded locally.
- Clean-room sweep over every changed and new file (URLs, e-mail shapes,
  internal-domain suffixes, commercial tracker names, gateway/VPN vocabulary,
  absolute home paths): only the public origin and the `dotln-fixture`
  placeholders.

### Real repository, offline

- `npm run release -- list` prints the six published tags with commit,
  application version, and work orders (`v0.2.2` → `WO-101,WO-005`, `v0.2.3`
  → `WO-006,WO-015`, `v0.3.1` → `WO-013`); no network access.
- `npm run release -- notes v0.3.1` renders the existing mechanical layer and
  is byte-identical across two runs (`sha256 b856b6ce…`).
- `npm run release -- manifest-from-tag` parses `v0.2.1` through `v0.3.1`
  (all `schemaVersion` 1). It refuses `v0.2.0` with "does not contain a DotLn
  release manifest" — and so does the pre-change `scripts/release.mjs` from
  `origin/main`, run from a scratch clone: `v0.2.0` is the hand-closed release
  whose record lives in `docs/releases/`, never a manifest-bearing tag. AC3's
  requirement is `v0.3.0`, which parses.
- The real `origin` (`https://github.com/DylanBWood/DotLn.git` for fetch and
  push) resolves under the new GitHub-target rule to
  `github.com/DylanBWood/DotLn`, so the operator's close will not be refused on
  the origin shape.

## Independent re-derivation

Four instruments and a drill, all written by this session into its scratchpad.
Probes B and C reuse the executor suites' fixture scaffolding (repository,
stub, and helper functions) but none of their scenarios or assertions.

### Probe A — the parser with 36 inputs of my own (36/36)

Chosen to sit beside, not on, VER-001's nineteen: fence edge cases (a tilde
fence hiding `##`; a four-backtick fence not closed by three; a three-backtick
fence closed by four; a backtick fence whose info string contains a backtick,
which CommonMark does not treat as a fence; an unclosed fence, which hides
later headings and is refused as "missing required heading"), heading
tolerance (trailing spaces, a tab or two spaces after `##`, a lowercase or
Cyrillic-lookalike name refused as extra, a non-breaking space refused as
missing), conservative false positives that are documented rather than
defects (`if a <b then c` refused as raw HTML; an HTML comment inside inline
code refused; a single `-` under text refused as setext), correct acceptances
(autolinks in angle brackets, `x < y and y > z`, a thematic break after a
blank line, `##foo` as text, CRLF, `None.` with trailing whitespace, a section
that is only a fenced block, a `None.`-only overview), and marker handling (a
reserved marker line inside a fence still refused; an indented marker line
allowed, which is safe because the tag reader anchors on the last column-one
marker). A level-one heading inside a section is accepted (Observations, 5).

### Probe B — a merge-history release fixture (5 scenarios, all as expected)

The executor's `edition` fixture and VER-001's probe E use linear histories,
so first-parent order is indistinguishable from topological order there. This
fixture merges every work order with `--no-ff` under a PR-style subject, as the
real repository does (every recent `main` commit has two parents).

- **B1 — contract activation inside the range, then forward enforcement.**
  Legacy WO-023 merged first (no notes), reviewed WO-024 merged second;
  `close WO-024 --publish` publishes `v0.2.1`. In all five sections
  `### WO-023` precedes `### WO-024`; the fallback lists exactly one subject —
  the merge commit's — and the branch-side `WO-023 candidate v0.2.1` does not
  appear; reviewer items precede `### Derived from the diff`, which precedes
  the source-only notice; the machine block is last; review lineage lists
  WO-024's `FINAL-001.md` and `RELEASE-NOTES.md`; `list` shows
  `WO-023,WO-024`. Then WO-025 merges after the contract with no notes file:
  `close WO-025 --publish` refuses with
  `docs/final-reviews/WO-025/RELEASE-NOTES.md: release-notes file is missing
  from HEAD`, no tag locally or remotely, no `gh release` call. (The `npm` stub
  log shows `ci` and `test` ran before the refusal — Observations, 2.)
- **B2 — an earlier release's notes file modified in range.** After `v0.2.1`
  (WO-024), WO-026's branch adds its own notes and appends a line to WO-024's;
  `v0.2.2` renders `### WO-026` then `### WO-024` in every section, the
  appended line and WO-024's overview are present, review lineage spans both
  work orders, `list` shows `WO-026,WO-024`. A rerun of `close WO-026
  --publish` reports "already published … GitHub Release existing" with the
  `create` count unchanged at one — byte-for-byte re-derivation of a
  two-work-order edition over merge commits.
- **B3 — a no-release order's notes ride the next tag.** WO-030 closes at
  `v0.1.9` ("below latest release v0.2.1; no release tag is due", no tag, no
  `gh` call beyond the earlier ones); WO-031 closes at `v0.2.2`; the edition
  carries `### WO-030` before `### WO-031` with both reviewers' prose and no
  fallback text, and does not re-include WO-024 from the previous release.
- **B5 — a deleted notes file refuses.** WO-033 removes WO-030's notes in its
  own commit; `close WO-033 --publish` refuses with
  `docs/final-reviews/WO-030/RELEASE-NOTES.md: release-notes file is missing
  from HEAD`, no tag, no `create`.

### Probe C — `worktree publish` end to end, ten cases of my own (10/10)

Each refusal names the path and leaves `refs/heads/wo-099` absent from the
bare origin; each acceptance passes notes validation and stops at the missing
`gh` preflight without pushing.

```text
CPASS refused: committed symlink at the notes path -> release-notes path is not a regular file
CPASS refused: unclosed fence hides later headings -> missing required heading "## Read before upgrading"
CPASS refused: four-backtick fence not closed by three backticks -> missing required heading "## Read before upgrading"
CPASS refused: prose that looks like a raw HTML tag -> raw HTML is not allowed in reviewed notes (line 3)
CPASS accepted: tilde fence hiding a level-two marker
CPASS accepted: level-one heading inside a section (not refused)
CPASS accepted: CRLF line endings
CPASS accepted: autolinks in angle brackets
CPASS refused: missing --title -> usage refusal precedes notes validation
CPASS accepted: well-formed notes (control)
```

### Dry run — the operator's future command on the real tree

A scratch bare origin and a scratch clone of this worktree; the reviewed tree
(tracked modifications plus every untracked non-ignored file, including this
order's `RELEASE-NOTES.md` and placeholder `FINAL-001.md`/`PR.md`) committed on
`wo-024`, the pass recorded through the real `resume.mjs final-review-result
pass` in the scratch, merged into scratch `main` with `--no-ff` under a
PR-style subject, and pushed with all six real tags. `origin` was renamed to
the real GitHub URL through an `insteadOf` rewrite; `gh` and `npm` were stubs;
`git` was the real binary behind the suites' `get-url` shim (needed because
`git remote get-url` returns the rewritten local path — the real origin has no
rewrite). Then, from the scratch `main` checkout:

```text
$ node scripts/release.mjs close WO-024 --publish
Running npm ci...
Running npm test...
Running node packages/skeleton/dist/src/cli.js...
Published annotated v0.3.2 (4f161a5f…) for cec1014e…; GitHub Release created. Main is clean and between work orders.
$ node scripts/release.mjs close WO-024 --publish
v0.3.2 is already published from cec1014e…; GitHub Release existing. Main is clean and between work orders.
```

The stub log: `--version`, `auth status --hostname github.com`, `release view
v0.3.2 --repo github.com/DylanBWood/DotLn …`, `release create v0.3.2 --repo
github.com/DylanBWood/DotLn --verify-tag --title DotLn v0.3.2 --notes-file
<temporary-release-body>`, then on the rerun preflight and `view` only. The
scratch origin gained exactly `refs/tags/v0.3.2` (an annotated tag object).
The 162-line edition has the five sections, one `### WO-024 — Release notes
surfaced: …, v0.3.2` subsection each, `### Derived from the diff` carrying the
two notices this diff earns (source-only; "Workflow authority, recovery, or
publication tooling changed"), and `### Machine-derived release evidence`
listing schema 1, the four evidence rows, four review artifacts
(`VER-001.md`, `FINAL-001.md`, `PR.md`, `RELEASE-NOTES.md`), and 27 changed
files. Checked by script: the Release body equals the edition plus the single
pointer line and contains no manifest block; the tag annotation equals the
edition plus the `DOTLN-MANIFEST-BEGIN/END` block; all five sections of the
committed notes file appear verbatim; `list` ends with `v0.3.2 … WO-024`;
`manifest-from-tag v0.3.2` validates. `git status` in the scratch was clean
afterwards. Nothing touched the real `origin` or a real `gh`.

### Mutation drill — does the suite catch a broken deliverable?

Fourteen single-point mutations of the mirror's `release.mjs`,
`release-notes.mjs`, `github-repository.mjs`, or `worktree.mjs`, each run
through the mirror's own `test-release.sh` and/or `test-worktree.sh`
(unmutated control: both green; 254 s total).

| Mutant                                                             | Suite    | Result                                                                                       |
| ------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------- |
| M1 `gh` preflight moved after the tag push                          | release  | caught (fails before the suite's first progress line; the missing-`gh` fixtures find a tag)  |
| M2 drop `--verify-tag`                                              | release  | caught (fails entering the `success` fixture, whose regex pins the create invocation)       |
| M3 stop scrubbing `GH_REPO`/`GH_HOST`                               | both     | caught: stub exits 65 ("ambient GH target leaked") in both suites                            |
| M4 body comparison never reports a difference                       | release  | caught: `mismatched GitHub Release body accepted`                                            |
| M5 no legacy fallback                                               | release  | caught: `WO-099/RELEASE-NOTES.md: release-notes file is missing from HEAD`                   |
| M6 drop `--first-parent` from the range walk                        | release  | **survived** the suite (linear fixtures); **caught by probe B** at "fallback lists exactly the one first-parent merge subject" |
| M7 drop the misordered-heading check                                | worktree | caught at the `required headings are misordered` fixture                                     |
| M8 any failed `release view` treated as not found                   | release  | caught: `failed GitHub Release lookup triggered success`                                     |
| M9 GitHub Release created before the tag push                       | release  | caught: `gh release ran before a successful tag push`                                        |
| M10 drop the existing-Release metadata check                        | release  | **survived**: no fixture returns a draft, prerelease, retitled, or asset-bearing Release      |
| M11 drop the nested-tag conflict check                              | release  | caught (fails before the first progress line; the `nestedtag` fixture expects a refusal)     |
| M12 accept an empty required section                                | worktree | caught at the `empty required section "## Release overview"` fixture                        |
| M13 `worktree publish` skips notes parsing                          | worktree | caught at the first malformed-notes fixture                                                  |
| M14 derived-from-the-diff label placed before reviewer items         | release  | caught by the edition fixture's ordering assertion                                           |

## Verification-sequence soundness

VER-001 is the complete sequence. Time-indexed against the current process it
meets every duty: it discloses its self-referential instruments, names its
model, effort, and harness, re-derives the fixture-covered criteria with
probes that do not reuse the executor's assertions, inspects the stub log
first-hand, records the executor's authority amendment as an observation for
this review rather than resolving it, and states the reason the manifest schema
was not bumped. Its falsifiable claims re-checked here hold — the code line
references (`worktree.mjs:216-258` and `:268`, `release.mjs:1132`, `:1286`,
`:1296`, `worktree.mjs:49`), the six tags and four ref namespaces, the 77/77
node tests, the `list` rows, the identical publication locks — with two
imprecisions, neither affecting a verdict: it says `manifest-from-tag` parses
"all five other real published tags (`v0.2.0`–`v0.3.1`)", but `v0.2.0` refuses
under both the new and the pre-change script and was never expected to parse
(AC3 names `v0.3.0`); and it counts "twenty" `test-worktree.sh` notes fixtures
where the suite has twenty-one refusals plus one acceptance. Its five
observations are each adjudicated below.

## Adjudications

### 1. The edition is heading-major; the order says "concatenation"

The design paragraph and AC2 describe "the concatenation … of every
`RELEASE-NOTES.md` … one subsection per work order, followed by a
machine-derived 'Evidence and compatibility' block". The implementation emits
the five sections once, each holding one subsection per work order. Ruling:
**ratified.** A literal concatenation of five-section files would produce N
copies of each `##` heading, which is not the five-section edition 08 §Release-note
edition specifies and would leave the order's own clause "appended to 'Read
before upgrading' … after the reviewer's items" with no single section to
attach to; "one subsection per work order" is satisfied exactly, in first-parent
order, with reviewer bytes unchanged (probes B and the dry run). The shape is
documented in `docs/releases/README.md` and 06-roadmap.md; this ruling records
the departure from the order's wording so a later reader does not rediscover
it.

### 2. The executor amended the work order's authority text

Three hunks against the activated text. (a) The H1's "(version assigned at
activation)" placeholder became `v0.3.2`. (b) The release-classification
paragraph became a dated disclosure of the activation miss. (c) The closeout's
backfill sentence changed from naming `v0.2.1`, `v0.2.2`, `v0.2.3`, and
`v0.3.0` to "Historical GitHub Release backfill is optional operator
follow-up. At activation, the unprojected range is `v0.2.0` through `v0.3.1`",
keeping the command, the outside-sandbox note, "Agents never run it", and
"silence is not a disposition".

Assessed: (a) and (b) are the WO-013 FINAL-001 §Adjudications 1 case exactly —
**necessary** (`scripts/release.mjs` refuses a heading without exactly one
strict version, and the dry run confirms the corrected heading is what makes
the close work), **correct on the merits** (`v0.3.1` is the latest tag locally
and on origin; the map names `v0.3.2` as the second consecutive patch target;
the order's own class is a tagging patch), **scope-neutral**, and
**authority-neutral** (the operator confirms the version by merging and again
by the fresh release-close phrase). (c) goes one step beyond filling a
designated placeholder: it edits a closeout sentence. Its content is a factual
correction — `v0.3.1` was published after the order was planned, and `v0.2.0`
was already inside the design's backfill scope ("`v0.2.0` links its committed
manifest and notes files") — and "optional" restates what the original already
implied by allowing a recorded decision not to backfill. It changes no
deliverable, criterion, non-goal, or authority.

Ruling: (a) and (b) accepted as a disclosed, dated forward-correction of an
activation preflight miss; (c) accepted as a factual closeout correction that
the executor disclosed in the work order, the ledger, and the map, and that
this review names explicitly so the operator ratifies it rather than absorbs
it. The general rule that executors do not amend their own authority stands.
The **activation-preflight hardening candidate** from WO-013 FINAL-001 is
carried again: this is the second consecutive order to activate with the
placeholder in place.

### 3. `worktree publish` gained more than Deliverable 2 named

Beyond the notes refusal: a `gh auth status` preflight, `--repo` pinning with
fetch/push agreement, `GH_REPO`/`GH_HOST` scrubbing, and reading the PR body
from `HEAD`. Ruling: **ratified under the bounded boy-scout policy.** The
design's "mirroring `worktree publish`" presumed an authentication preflight
that did not exist, so adding it makes the design true; the pinning and scrub
close a real path by which an ambient variable could redirect a PR or a
Release; the `HEAD` read matches the guide's "committed, contained PR body
file" contract and `ensureClean` runs first so the two sources cannot diverge
except through `assume-unchanged`, which the suite's committed-body fixture
covers. All are fixture-covered, low-risk, and inside the same subsystem; none
obscures the diff. Recorded as scope beyond the literal deliverable.

### 4. Reviewer-authored `###` headings are siblings of generated ones

Accepted as a known editorial seam; membership and `list` are derived from the
control log, never from headings (the executor's fixture and probe B both
carry a decoy `### WO-999` heading). Hardening candidate: refuse reviewer lines
matching the three generated shapes (`### WO-NNN — `, `### Derived from the
diff`, `### Machine-derived release evidence`); one regular expression in
`parseReleaseNotes`.

### 5. A `None.`-only `## Release overview` is accepted

AC1 says "empty", the validator refuses empty, and the README's "may never be
blank" matches the validator. Whether `None.` is an adequate overview is an
editorial judgment the README already places on the reviewer ("Visible payoff,
audience, and why this matters"). Ruling: criterion met as written; no change.

### 6. Modified notes of an already-released work order are re-included

Probe B2 shows a later range that modifies an earlier release's notes file
re-includes that work order's full notes in the new edition. This is the
order's letter ("every `RELEASE-NOTES.md` added or modified in
`previousRelease..HEAD`") and keeps the record honest (the reviewed bytes
changed, so the change is published), but a typo fix would republish an entire
work order. Ruling: correct against the order; flagged for the planner as an
editorial policy question, not a defect.

## Corrections applied by this review

One correction, in the wording lane `docs/final-reviews/README.md` grants,
proven contained by diffing against checkpoint 5 and followed by a re-run of
the checks it could affect (`npm run format:check`, `git diff --check`, and the
second full `npm test`, all clean).

1. **`docs/planning/work-order-map.md`, the WO-024 catalog row.** Its evidence
   cell read "active; … independent verification and final review remain
   required" — true when the executor wrote it, false beside a passing VER-001
   and this report. Following WO-013 FINAL-001 §Corrections item 1, the
   evidence cell now reads "`v0.3.2` tagging patch assigned after published
   `v0.3.1`; VER-001 pass; FINAL-001 pass; reviewed state committed and
   awaiting operator merge; `v0.3.2` remains unpublished pending a fresh
   release close, which is the first real drive of the assembled edition and
   GitHub Release; …" (with links), the preflight cell appends "operator merge
   and a fresh release close remain required", and the disposition cell reads
   "passed VER-001 and FINAL-001; awaiting operator merge and a fresh `v0.3.2`
   release close". The pinned formatter re-padded the table: `git diff`
   against checkpoint 5 shows 35 lines changed, `git diff -w` exactly two —
   the separator rule and the WO-024 row. No other row changed.

The three files this review adds — this report, `PR.md`, and
`RELEASE-NOTES.md` — are artifacts the process requires of a passing review,
not corrections. Every other path is byte-identical to checkpoint 5.

## Findings

**None blocking.** No acceptance criterion is unmet and no behavioral or
evidence defect was found. Observations, recorded and not scored:

1. **GitHub body normalization is unverified.** `firstDifferingLine` compares
   the stored Release body line by line against the regenerated body, which
   ends in a newline. The sandbox cannot reach the real API, so whether GitHub
   preserves that trailing newline and `\n` line endings is unproven. If it
   does not, only a *redundant* rerun of an already-created Release would
   refuse, at the last or first line; the refusal reports and never edits, and
   the tag and the creation path are unaffected. The operator's first rerun,
   if one is ever needed, is the moment this becomes known.
2. **The release-time notes check runs after the evidence gate.**
   `releaseNoteEntries` is reached from `baseManifest`, after `npm ci` and the
   evidence commands (probe B1's stub log shows `ci test` before the refusal).
   Defense in depth is intact because `worktree publish` refuses first; a
   cheap hardening is to derive the entries before `runEvidence`.
3. **Test thinness (drill M10, M6).** The existing-Release metadata refusal
   (title, draft, prerelease, assets) has no fixture; first-parent ordering
   has no discriminating fixture in the suite and rests on probe B here. Two
   fixtures close them; candidates for WO-018's consolidation.
4. **The map's WO-013 row is stale** ("awaiting operator merge and a fresh
   `v0.3.1` release close" though `v0.3.1` is published). Pre-existing on
   `main` and outside this order's rows; left for the next planning pass
   rather than widening this review's correction.
5. **A level-one heading inside a section is not refused** (probe A, probe C).
   The contract governs level-two headings only; a `#` line in reviewer prose
   would render as a top-level heading inside the edition. Cosmetic; note for
   the same regular expression as adjudication 4.
6. **`git remote get-url` returns `insteadOf`-rewritten URLs**, which is why
   both suites carry a `git` shim for that one subcommand. The real origin
   has no rewrite and resolves cleanly; an operator who adds one later would
   see the "exactly one matching GitHub HOST/OWNER/REPO" refusal.
7. **Executor model and effort are not in a committed artifact** (the WO-013
   and WO-015 gap, structural); the verifier's and this reviewer's are in
   their headers.

### Candidates considered and not sustained

- *The parser's conservative refusals (`a <b then`, inline-code HTML comments,
  a lone `-`) are defects.* Not sustained: each is documented in
  `docs/final-reviews/README.md` as a deliberate strict subset, each refusal
  names the line, and the fix is to write around it; a permissive parser would
  have to model CommonMark to be safe.
- *`reviewArtifacts` moving from a working-tree listing to `git ls-tree HEAD`
  changes existing manifests.* Not sustained: the equal-version path compares
  the stored annotation against a message regenerated from the *stored*
  manifest, so earlier tags' manifests are read, not recomputed; the dry run
  and probe B2 show the new listing is what a tagged tree actually contains.
- *An `insteadOf`-free real origin might still be refused by the stricter URL
  parser.* Not sustained: checked first-hand against the real fetch and push
  URLs.

## Acceptance criteria

| #   | Criterion                                                  | Verdict | First-hand basis                                                                                                                                  |
| --- | ---------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Notes-file contract refused before push, by defect and path | met     | probe C (10/10, branch never pushed); probe A (36/36); the suite's 21 refusal + 1 acceptance fixtures green; drill M7, M12, M13 caught              |
| 2   | Assembly order, fallback, derived label, machine block, verbatim | met | probe B1–B3 over real merges; dry run: 5/5 sections verbatim, label and block placed; drill M5, M14 caught; M6 caught by probe B                   |
| 3   | Determinism and record; legacy tags still parse            | met     | `notes` byte-identical twice; dry-run rerun and probe B2 rerun re-derive byte for byte; `manifest-from-tag` `v0.2.1`–`v0.3.1`; schema 1 unchanged  |
| 4   | GitHub Release only after push; one create; recovery; mismatch; preflight | met | suite transcripts; dry run's stub log; drill M1, M2, M4, M8, M9 caught; probe B1 no `create` on refusal                                            |
| 5   | `publish-notes`, `notes`, `list` fixture assertions        | met     | suite green; real-repo `list` and `notes`; dry-run `list` and `notes v0.3.2`                                                                       |
| 6   | Authority: no `main` push, no tag move, no other `gh` call; docs name it | met | AC6 grep above; guide, playbook, releases README, docs README, 03, 04 sentences read and matched                                                    |
| 7   | Self-referential instrument disclosed; no release performed | met     | six tags and four namespaces unchanged; no real `gh` run; `RELEASE-NOTES.md` written by this reviewer; disclosure above                            |
| 8   | `npm test`, `diff --check`, `packages/`, deps, `.claude/`  | met     | two green runs, exit 0; clean; byte-identical; unchanged; none                                                                                     |

Design clauses respected: notes file per passing review including no-release
orders (probe B3); assembly not authorship; schema 1 kept with the reason
recorded in the ledger; projection under the same phrase with preflight before
`mktag`; backfill operator-only and stub-tested; local rendering offline; no
compatibility, cadence, evidence-list, or `packages/` change; no new
dependency. Non-goals respected: no per-release file under `docs/releases/`,
no existing tag or historical review touched, no model-drafted notes for the
reviewer, no WO-025 or WO-018 scope.

## Remaining deviations and open questions

None requires a change to the subject.

- **Publish step returned to the operator.** `gh --version` in this session
  fails with `failed to read configuration: open ~/.config/gh/config.yml:
  operation not permitted`, so `npm run worktree -- publish` refuses at its
  preflight before any push (fail closed), as for WO-006, WO-007, and WO-013.
  The reviewed commit is made here; the operator runs the exact command from
  this worktree outside the sandbox.
- **First real drive.** After merge, the separately authorized
  `resume: release close` runs `npm run release -- close WO-024 --publish`
  from the main checkout, outside the sandbox and where `gh` is authenticated
  for `github.com`; it cuts annotated `v0.3.2` and its GitHub Release. If
  Release creation fails after the tag push, rerun the same command.
- **Backfill disposition** for `v0.2.0` through `v0.3.1` remains the
  operator's: run `publish-notes` per tag or record the decision not to.
- **Ledger duty:** discharged by the executor's entry; no entry is owed for
  this review's wording correction.
- **Attribution:** the reviewed commit carries a plain subject and no
  attribution trailer, per the operator's standing rule and the repository's
  hand-authored history.
- Before `resume: release close`, if the main checkout's globally ignored,
  non-disposable `.claude/settings.local.json` is still present, move it out;
  the release-close gate refuses it by name.

## Proposed PR

- **Title:** `:sparkles: WO-024: reviewed release notes in the tag and a GitHub Release from the validated tag`
  — a new publication capability (the edition, the projection, and the offline
  commands), the `:sparkles:` precedent being WO-004's release close.
- **Body:** `docs/final-reviews/WO-024/PR.md`, committed alongside this report
  and `RELEASE-NOTES.md`.

## Ready to merge — handoff

Closeout from here, per the playbook: `final-review-result pass` is recorded
before the reviewed commit (it also makes the map's "FINAL-001 pass" cell
true); the reviewed state is committed with a plain subject. The operator then
runs, from this worktree outside the sandbox:

```bash
npm run worktree -- publish WO-024 --title ':sparkles: WO-024: reviewed release notes in the tag and a GitHub Release from the validated tag' --body-file docs/final-reviews/WO-024/PR.md
```

The helper validates the committed `RELEASE-NOTES.md`, preflights `gh`, pushes
only `wo-024`, opens the PR pinned to `github.com/DylanBWood/DotLn`, and prints
the release-close handoff. The operator retains merge authority. After the
merge, and only under a fresh `resume: release close`,
`npm run release -- close WO-024 --publish` runs from the main checkout,
reruns all merged evidence, and may cut annotated `v0.3.2` with, for the first
time, its GitHub Release.

## Method

Single reviewer, single session, no subagents. Read order: the execution
guide's dispatch, closeout, and discipline sections, the control projection and
log, the work order, VER-001, the final-review and verification READMEs, the
WO-013 and WO-007 final reviews and PR bodies for the publish precedent and the
reviewed-prose shape, 08 §Release-note edition and §Authority and honesty
rules, then every changed file's diff and both new modules in full. Subject
integrity was established through git object hashes, not through the lifecycle
script. Evidence was re-established first-hand: two full `npm test` runs with
harness name and version, the static checks, the authority grep, the real
repository's offline commands, and the pre-change script's behavior from a
scratch clone. Criteria were re-derived with four instruments written here
(36 + 5 scenarios + 10 cases + the dry run) and the deliverable's suites were
judged by a fourteen-mutant drill in an isolated mirror. The scratch clones,
mirrors, and fixtures lived in the session scratchpad or in owned fixture roots
removed by their traps; the three pre-existing residue entries were listed
before and after and left alone. The one correction was applied after the
evidence runs and the affected checks were re-run. Nothing was restored from a
checkpoint, no destructive git command was used, and no real remote or `gh`
was touched.
