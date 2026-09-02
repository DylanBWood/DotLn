## Release overview

Every published DotLn release is now readable where a reader looks. The
annotated tag's human layer is a five-section release-note edition assembled
from prose a final reviewer already wrote, the same edition is published as a
GitHub Release on the validated tag, and two local commands render any
published release's notes and manifest without network access. This release is
the first one cut by that mechanism, so its own notes and its GitHub Release
are the first real drive of what it ships. Audience: operators closing
releases, reviewers writing the reviewed package, and readers of the GitHub
Releases page.

## Read before upgrading

- **Final-review package contract.** Beginning with this release, a passing
  final review commits `docs/final-reviews/WO-NNN/RELEASE-NOTES.md` beside its
  report and PR body, with exactly the five required level-two headings in
  order and no blank section, even for a no-release work order. `worktree
  publish` refuses before any push when that file is missing or malformed.
  Reviews completed before this release legitimately lack the file and receive
  a labeled fallback at release time.
- **Release-close authority widened by one action.** `npm run release -- close
  WO-NNN --publish` now also creates the matching GitHub Release after the
  annotated tag push succeeds. It still never pushes `main`, moves or edits a
  tag, edits a published Release, publishes packages, binaries, containers, or
  hosted artifacts, or changes repository settings.
- **GitHub CLI is preflighted at release close.** Under `--publish`, `gh`
  availability and authentication are checked before the tag object is created;
  a preflight failure refuses with no tag anywhere. Run the close where `gh` can
  read its configuration.
- **Recoverable post-tag state.** If Release creation fails after the tag push,
  the command exits non-zero with "tag published; GitHub Release not created;
  rerun the same command". The rerun validates the immutable tag byte for byte,
  creates the missing Release, or refuses at the first differing body line; it
  never edits a tag or a Release.
- **Origin must name one GitHub repository.** Publish and release close resolve
  the `origin` fetch and push URLs to a single `HOST/OWNER/REPO` target and pin
  every `gh` call to it; `GH_REPO` and `GH_HOST` in the environment are
  ignored. An origin whose fetch and push targets disagree, or that is not a
  plain GitHub HTTPS or SSH URL, refuses before any mutation.
- **Historical GitHub Releases are not backfilled by this release.** Tags
  `v0.2.0` through `v0.3.1` remain without a GitHub Release until the operator
  runs `npm run release -- publish-notes vX.Y.Z` per tag or records a
  deliberate decision not to.

## Substantive changes

- **Release record.** The tag annotation's human layer is the assembled
  edition: under each of the five sections, one subsection per work order
  merged since the previous release, in first-parent commit order; diff-derived
  notices follow the reviewer-authored items under an explicit "Derived from
  the diff" label; a manifest-derived evidence and compatibility block closes
  the edition. A work order that predates this contract renders under a labeled
  fallback with its first-parent commit subjects rather than being dropped or
  refused; a work order merged after it must carry reviewed notes or the close
  refuses before any tag. The canonical JSON manifest block below the markers
  is unchanged at schema version 1, so `manifest-from-tag` and the
  equal-version re-validation still accept every earlier manifest-bearing tag.
- **GitHub Release projection.** After the tag push, release close creates a
  non-draft, non-prerelease GitHub Release titled `DotLn vX.Y.Z` on the verified
  tag whose body is the human layer plus a pointer to the two local commands;
  the JSON manifest is never pasted into it. An existing Release is accepted
  only when its title, flags, assets, and body match.
- **Local rendering.** `npm run release -- notes vX.Y.Z` prints a published
  tag's human layer and `npm run release -- list` prints every local DotLn
  release tag with its commit, application version, and included work orders;
  neither uses the network.
- **Historical backfill command.** `npm run release -- publish-notes vX.Y.Z`,
  operator-run from the main checkout, creates the GitHub Release for a tag that
  predates this contract from that tag's existing human layer verbatim under a
  time-indexed label; it refuses tags at or after the contract, lookalike
  non-DotLn tags, and any tag that differs between local and origin.
- **Release-close guards.** A target version blocked by an existing nested tag
  name is refused before evidence runs, and a latest published tag missing from
  the local checkout is fetched instead of failing the ancestor check.
- **Final-review publication.** `worktree publish` validates the committed
  notes file and reads the PR body from the committed tree rather than the
  working copy, preflights `gh` authentication, and pins the pull request to the
  resolved origin repository.
- **Process documentation.** The execution guide, playbook, release records
  README, final-review README, roadmap release boundary, architecture, and
  interfaces documents name the widened authority, the recovery path, the notes
  contract, and the offline commands; the ledger records the adopted design and
  the publication locks were refreshed with their staleness recapture.

## Progressive polish

- The release and worktree test suites gained a `gh` stub that records every
  invocation and refuses ambient repository overrides, plus fixtures for the
  edition, projection, recovery, backfill, and notes-validation paths.
- Release-close messages now name the GitHub Release outcome alongside the tag.

## Evidence and compatibility

- Source: the reviewed `wo-024` branch merged into `main` above `v0.3.1`; the
  exact commit and manifest are in the annotated tag and in the machine-derived
  block that follows these notes.
- Verification: `docs/verifications/WO-024/VER-001.md` (pass; eight criteria
  confirmed first-hand) and `docs/final-reviews/WO-024/FINAL-001.md` (pass;
  independent parser, edition, and publish probes plus a mutation drill).
- Compatibility: manifest schema version 1 is unchanged; no compatibility
  field, cadence extraction, evidence command, or anything under `packages/`
  changed; no dependency was added, since `gh` was already required to publish
  pull requests.
- Known limitations: GitHub's stored Release body could not be exercised
  against the real API from the review sandbox, so a spurious body-mismatch
  refusal on a redundant rerun of an already-created Release is possible if
  GitHub normalizes line endings or trailing newlines; it would be reported,
  never edited. Reviewer-authored level-three headings share a level with the
  machine-generated subsection headings. The release-time notes check runs
  after the evidence gate; the refusal at `worktree publish` is the primary
  guard.
