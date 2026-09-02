## What this merges

WO-024, the `v0.3.2` patch work order: every published release becomes
readable where a reader looks, from prose a reviewer already wrote. The
annotated tag stays the one immutable record; its human layer is now the
five-section release-note edition assembled at close from reviewed notes
files, the same edition is projected as a GitHub Release on the validated tag
under the existing `resume: release close` phrase, and two local commands
render any published record without network access.

- **The defect:** the repository had six annotated tags and zero GitHub
  Releases; each tag's notes were a paste of the work order's Objective plus
  raw `git log` subjects, and nothing listed published releases with the work
  orders they contain.
- **Reviewed notes are a final-review artifact.** A passing review now commits
  `docs/final-reviews/WO-NNN/RELEASE-NOTES.md` beside `FINAL-NNN.md` and
  `PR.md` with exactly the five headings of the release-note edition, `None.`
  for a section with nothing to say, and a strict Markdown subset (no raw
  HTML, no HTML comments, no setext or non-column-one level-two headings, no
  reserved manifest marker lines). `worktree publish` validates the committed
  file before any push and refuses by defect and path. This order's own notes
  file is the first one, written by its final reviewer.
- **The release assembles; it does not author.** Release close walks
  `previousRelease..HEAD` in first-parent order, discovers passing work orders
  from the control-log events each commit appends, and renders, under each of
  the five sections, one subsection per work order with the reviewer's bytes
  unchanged; a work order closed before this contract renders under a labeled
  fallback with its first-parent commit subjects, while one merged after it
  must carry notes or the close refuses before any tag. Diff-derived notices
  follow the reviewer's items under a "Derived from the diff" label; a
  manifest-derived evidence block closes the edition. Manifest schema version
  1 is unchanged and the equal-version path still proves an existing tag
  re-derives byte for byte.
- **GitHub Release as a projection under the same phrase.** Under `--publish`,
  `gh` availability and authentication are preflighted before `git mktag`;
  after the tag push, the command creates the non-draft Release
  `DotLn vX.Y.Z` on the verified tag with the human layer plus a pointer to
  `notes` and `manifest-from-tag`. A post-tag failure exits non-zero naming the
  recoverable state; the rerun creates the missing Release or refuses at the
  first differing body line and never edits. Every `gh` call is pinned with
  `--repo` to the single GitHub target resolved from `origin`, with `GH_REPO`
  and `GH_HOST` scrubbed from the environment.
- **Local rendering and backfill.** `release notes vX.Y.Z`, `release list`,
  and the operator-only `release publish-notes vX.Y.Z` (time-indexed legacy
  label; refuses post-contract, lookalike, or local/origin-divergent tags). No
  backfill was performed by any agent.
- **`worktree publish` hardening** beyond the notes check: `gh auth status`
  preflight, `--repo` pinning with fetch/push agreement, environment scrub,
  and the PR body read from the committed tree rather than the working copy.
- **Docs:** execution guide, playbook, release records README, final-review
  README, roadmap release boundary, architecture, interfaces, ledger, and
  refreshed publication locks with the staleness recapture. The work order's
  heading carries `v0.3.2` (an activation preflight miss the executor
  forward-corrected and disclosed in place, adjudicated in FINAL-001).

## Evidence

Re-established first-hand at final review inside the Claude Code sandbox, not
inherited:

- `npm test` from this worktree: Prettier clean, all seven shell suites, `tsc`,
  77/77 node tests, exit 0, identical `dotln-*` residue before and after.
  `git diff --check` clean; `npm run publication:check` `CURRENT` for both
  editions with the recorded locks; `packages/`, `package.json`, and
  `package-lock.json` byte-identical to `origin/main`; no `.claude/` change.
- Subject integrity: every deliverable blob carries the identical hash in the
  implementation-ready, verify-allocation, and verdict checkpoints and the
  working tree; the control log is a strict append over `HEAD`.
- Authority grep over `scripts/`: `gh` is spawned from two sites behind
  wrappers that scrub the environment and pin `--repo`; the only subcommands
  are `--version`, `auth status`, `release view`, `release create`, and the
  pre-existing `pr create`; `git push` occurs twice (the `wo-NNN` branch; the
  tag object with `--no-follow-tags`); the local tag ref is written with an
  empty old value so it can never move.
- Real repository, offline: `release list` prints the six published tags with
  the correct work orders; `release notes v0.3.1` is byte-identical across two
  runs; `manifest-from-tag` parses `v0.2.1` through `v0.3.1` (schema 1) and
  refuses `v0.2.0` exactly as the pre-change script does.
- Independent probes written by this review: the parser with 36 inputs of my
  own (36/36); a merge-history release fixture with five scenarios the
  executor's linear fixtures cannot express (legacy fallback listing only the
  first-parent merge subject, a work order merged after the contract refused
  before any tag or `gh release` call, a modified earlier notes file
  re-included, a no-release order's notes riding the next tag, a deleted
  notes file refused, and a byte-for-byte rerun of a two-work-order edition);
  `worktree publish` end to end with ten cases of my own (10/10).
- Dry run of the operator's future command: the reviewed tree with this
  order's notes, merged into a scratch `main` and pushed to a scratch origin,
  then `release close WO-024 --publish` with `gh` and `npm` stubs published
  annotated `v0.3.2`, created the stub Release with
  `--repo github.com/DylanBWood/DotLn --verify-tag --title "DotLn v0.3.2"`,
  and the rerun reported "already published; GitHub Release existing". The
  Release body equals the edition plus the pointer line, the tag annotation
  equals the edition plus the manifest block, and all five reviewed sections
  appear verbatim.
- Mutation drill in an isolated mirror: fourteen single-point mutations of the
  release, notes, and publish code; twelve fail the executor's suites; the
  first-parent mutant survives the suites (linear fixtures) but fails my
  merge-history probe; the existing-Release metadata check has no fixture and
  survives (test thinness, carried).
- Clean-room sweep over every changed and new file: nothing.

## Verification trail

- `docs/verifications/WO-024/VER-001.md` — pass; all eight criteria confirmed
  first-hand with the verifier's own parser, publish, and ordering probes;
  five observations for the final reviewer, none a defect.
- `docs/final-reviews/WO-024/FINAL-001.md` — pass; one bounded wording
  correction (the work-order map row); the heading-major edition shape, the
  executor's authority amendments, and the widened `worktree publish` scope
  ratified with reasons; VER-001's `v0.2.0` manifest claim corrected as an
  overstatement, not a regression; method, instruments, and the reviewer's
  own authorship of the notes file disclosed.

## Known open items

- **First real drive.** After merge, the separately authorized
  `resume: release close` runs `npm run release -- close WO-024 --publish`
  from the main checkout, outside the sandbox and where `gh` is authenticated
  for `github.com`. It cuts annotated `v0.3.2` and, for the first time, its
  GitHub Release. If Release creation fails after the tag push, rerun the same
  command. This PR performs no release action.
- **GitHub body normalization is unverified.** The sandbox cannot reach the
  real API, so whether GitHub preserves the trailing newline and `\n` line
  endings of a stored Release body is unproven; if it does not, a redundant
  rerun of an already-created Release would refuse with a body mismatch at the
  last or first line. That refusal reports and never edits; the creation path
  and the tag are unaffected.
- **Release-time notes check runs after the evidence gate.** A work order that
  reached `main` without notes is refused at close only after `npm ci` and the
  evidence commands; the earlier refusal at `worktree publish` is the primary
  guard. Cheap hardening: check `releaseNoteEntries` before `runEvidence`.
- **Test thinness, carried:** the existing-Release metadata check (title,
  draft, prerelease, assets) and first-parent ordering are implemented and
  documented but unbound by the suites; the review's merge-history probe is
  the only evidence for the latter. Candidates for WO-018's consolidation.
- **Editorial seams, carried:** a reviewer's level-three heading is
  indistinguishable in the rendered edition from the generated `### WO-NNN`,
  `### Derived from the diff`, and `### Machine-derived release evidence`
  headings (release membership is unaffected); a `None.`-only release overview
  passes the validator; a level-one heading inside a section is not refused;
  an earlier release's notes file modified in a later range is re-included in
  full by design.
- **Backfill disposition pending.** `v0.2.0` through `v0.3.1` have no GitHub
  Release; the operator either runs `npm run release -- publish-notes vX.Y.Z`
  per tag from the main checkout or records the decision not to in
  `docs/releases/README.md`.
- **Work-order map:** the WO-013 row still reads "awaiting operator merge and
  a fresh `v0.3.1` release close" although `v0.3.1` is published; pre-existing
  on `main` and outside this order, left for the next planning pass.
- **Executor model and effort** are not in a committed artifact (the same
  structural gap WO-013 and WO-015 recorded); the verifier's and reviewer's
  are in their report headers.
- Before `resume: release close`, if the main checkout's globally ignored,
  non-disposable `.claude/settings.local.json` is still present, move it out;
  the release-close gate refuses it by name.
