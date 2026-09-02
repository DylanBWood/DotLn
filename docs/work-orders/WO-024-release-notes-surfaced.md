# WO-024 — Release notes surfaced: reviewed layered notes in the tag and a GitHub Release from the validated tag, v0.3.2

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.3.2`, a tagging patch above the latest
published `v0.3.1` — deliberately not the no-release path, because this order's
own release close is the first real drive of the mechanism it ships.
Publication and lifecycle tooling only; no exported runtime capability.
Activation on 2026-09-02 accidentally retained the planner placeholder in this
heading and paragraph. The executor forward-corrected that preflight miss to
the work-order map's second consecutive patch target without replaying or
editing the append-only activation event. Publication remains subject to
independent verification, final review, operator merge, and a fresh
operator-authorized release close.
**Nomination provenance:** the operator's 2026-09-02 planning session after the
`v0.3.0` close ("we just released v0.3.0 but no release notes were
generated"). Planner-synthesized draft: the operator's message is preserved
locally as a compaction-safety capture in ignored intake
(`docs/intake/notes/WO-024-WO-026-release-surfaces-planning-2026-09-02.md`)
and is not a direct draft. The identifier is an opaque stable reference, not a
priority or an activation decision. The clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** `main` at or after `v0.3.0`. WO-013 merged is recommended
because both orders edit `scripts/test-release.sh` and
`scripts/test-worktree.sh`; hunk overlap is not a semantic dependency. Land
before WO-018 so its consolidation absorbs one shape of `scripts/release.mjs`;
if the operator prefers to land it after WO-018, activation restates the
deliverables against the shared `scripts/lib/` helpers.

**Cites (read these sections):** 06-roadmap.md §Release boundary (the
annotated tag is the immutable record; the layered patch-notes paragraph);
08-publication-compiler.md §Release-note edition (the five-section editorial
contract) and §Authority and honesty rules 5–6 (generated prose is reviewed
output; lossy editions identify themselves); 07-execution-guide.md §Operator
resume phrases (the narrow external-effect authority of `release close`) and
§Workflow closeout and releases; `docs/releases/README.md`;
`docs/final-reviews/README.md` (the passing report includes the PR body);
docs/lineage/idea-ledger.md "Layered, editorial patch notes" and "Cut the first
source release at the reviewed walking-skeleton boundary" (§WO-003 expanded
ideation batch 001); `scripts/release.mjs` (`baseManifest`, `changedSubjects`,
`criticalNotes`, `tagMessage`, `ensureExistingRelease`, `publishTag`, `close`);
`scripts/worktree.mjs` publish (the `gh` preflight and the contained body-file
rule); `docs/final-reviews/WO-007/PR.md` as the shape of the reviewed prose
this order builds on.

**Objective:** Make every published release readable where a reader looks, from
prose a reviewer already wrote. The annotated tag stays the one immutable
record. Its layered notes stop being a paste of the work order's Objective plus
raw commit subjects and become the five-section release-note edition assembled
from reviewed notes files merged since the previous release; the same edition
is published as a GitHub Release on the validated tag under the existing
release-close phrase; and a local command renders any published release's
notes and manifest without network.

**Observed problem (dated 2026-09-02):**

- `v0.3.0` was tagged today. The repository has zero GitHub Releases (the
  public releases API returns an empty list) while the tags page shows five
  annotated tags. The notes exist only inside each tag object: a reader must
  run `git cat-file -p v0.3.0` or open the tag's own page, and nothing lists
  published releases with the work orders they contain.
- The generated notes are mechanical, not editorial. `Visible payoff` is the
  work order's `**Objective:**` paragraph verbatim (`v0.2.3`'s begins lowercase,
  "make the release manifest derive…", because WO-015's does); `Changes` is
  `git log --format=%s` over the tag range, so `v0.2.3` lists six subjects
  including two merge-commit duplicates of the same titles and the planning
  commit "Plan WO-015 release cadence parser recovery"; `Known limitations` is
  the `**Non-goals:**` paragraph. None of the five sections 08 specifies
  (release overview, read before upgrading, substantive changes by area,
  progressive polish, evidence and compatibility) exists as such.
- Every passing final review already writes a reviewed, committed, contained PR
  body (`docs/final-reviews/WO-NNN/PR.md`: "What this merges", "Evidence",
  "Verification trail", "Known open items"). That is the editorial content the
  notes lack, it lives inside the tagged commit, and the `v0.3.0` manifest
  already lists `docs/final-reviews/WO-007/PR.md` under `reviewArtifacts`. The
  reviewer is the actor with the whole verification sequence in view; release
  close is the actor with the manifest. Neither hands its half to the other.
- The `docs/releases/README.md` contract says forward notes live in the tag and
  stops there: no index, no render command, no visible surface.

**Design (scope discipline):**

- **Reviewed notes are an artifact of final review.** A passing final review
  writes `docs/final-reviews/WO-NNN/RELEASE-NOTES.md` beside `FINAL-NNN.md`
  and `PR.md`, with exactly the five 08 headings in order: `## Release
  overview`, `## Read before upgrading`, `## Substantive changes`,
  `## Progressive polish`, `## Evidence and compatibility`. A section with
  nothing to say contains the literal line `None.`; it is never omitted. The
  overview and read-before-upgrading sections must be non-empty. The prose
  describes changed behavior by product area, never commit or filename trivia;
  compression is editorial, never evasive — nothing that affects semantics,
  saved data, compatibility, authority, security, recovery, or an operator's
  required action may hide in progressive polish. The file is reviewed output
  under the existing final-review wording lane; it is not generated. It is
  written for every passing review, including no-release orders, because their
  notes ride the next tag that contains them (`v0.2.2` carried WO-101).
- **The release assembles; it does not author.** At close, the edition for
  `vX.Y.Z` is the concatenation, in first-parent commit order, of every
  `RELEASE-NOTES.md` added or modified in `previousRelease..HEAD`, one
  subsection per work order, followed by a machine-derived "Evidence and
  compatibility" block from the manifest (application and component versions,
  schema ranges, cadence kinds, evidence rows, review lineage, changed-file
  count, distribution). The existing `criticalNotes` heuristics remain and are
  appended to "Read before upgrading" under an explicit "derived from the diff"
  label, after the reviewer's items. A work order in the range with no notes
  file (closed before this order landed) renders under a labeled fallback —
  "no reviewed notes for WO-NNN (predates WO-024); commit subjects:" — never
  silently dropped and never a refusal. That is the time-indexed migration the
  execution guide requires.
- **The tag remains the record.** The tag annotation's human layer is the
  assembled edition; the canonical JSON manifest block follows unchanged.
  `ensureExistingRelease` continues to prove an existing tag's annotation
  equals the regenerated message byte for byte, so the edition must be
  deterministically re-derivable from the tagged tree. Either keep manifest
  `schemaVersion` 1 and derive the edition at validation time, or bump the
  template to `schemaVersion` 2 with a `notes.sources` field listing the
  consumed paths; if bumped, `manifest-from-tag` and `ensureExistingRelease`
  must still accept version-1 tags (`v0.2.1` through `v0.3.0`), and the result
  states which path was chosen and why.
- **The GitHub Release is a projection, published under the same phrase.**
  Under `--publish`, `gh` availability and authentication are preflighted
  before `git mktag`, mirroring `worktree publish`; a preflight failure refuses
  with no tag. After the tag push succeeds, the command creates the GitHub
  Release for that tag (`--verify-tag`; title `DotLn vX.Y.Z`; body = the
  edition's human layer plus a one-line pointer to
  `npm run release -- notes vX.Y.Z` and `manifest-from-tag`; the JSON block is
  not pasted into the body; not a draft; no assets). A failure after the tag
  push is reported as "tag published; GitHub Release not created; rerun the
  same command", exits non-zero, and touches no tag; the rerun's equal-version
  path creates the missing Release and refuses a body mismatch by printing the
  first differing line, never editing a published Release silently. This is a
  bounded widening of release-close authority: it may now create the GitHub
  Release that projects the validated tag's notes; it still never pushes
  `main`, publishes packages, binaries, containers, or hosted artifacts, or
  changes repository settings.
- **Backfill is an operator-run command, not executor scope.** A new
  `release publish-notes vX.Y.Z` creates the GitHub Release for an
  already-published tag from that tag's existing human layer verbatim, under a
  time-indexed label ("notes as generated at close; predates WO-024's
  edition"); `v0.2.0` links its committed manifest and notes files. The
  executor tests it against a stub and never runs it against origin.
- **Local rendering, no network.** `release notes vX.Y.Z` prints a published
  tag's human layer; `release list` prints every annotated release tag with its
  commit, application version, and the work orders whose notes it contains.
  `docs/releases/README.md` explains both, links the GitHub Releases page, and
  keeps its no-committed-per-release-file rule.
- Do not change the compatibility fields of the manifest, tag selection or push
  logic, the evidence command list, cadence extraction (WO-015 and WO-018
  territory), or anything under `packages/`. No new dependency: `gh` is
  already required by `worktree publish`.

**Deliverables:**

1. `scripts/release.mjs`: notes-file validation shared with `worktree.mjs`;
   edition assembly; the fallback for legacy work orders; `gh` preflight and
   GitHub Release creation under `--publish`; equal-version recovery;
   `publish-notes`, `notes`, and `list` subcommands.
2. `scripts/worktree.mjs`: `publish` refuses, before any push, when the
   subject's `RELEASE-NOTES.md` is missing or malformed.
3. `scripts/test-release.sh` and `scripts/test-worktree.sh`: a `gh` stub on
   `PATH` (the existing `npm` stub is the precedent) that records every
   invocation to a log; the positive and negative fixtures named below.
4. `docs/final-reviews/README.md` (the notes file is part of the passing
   package, with the five headings and the `None.` rule), and this order's own
   `docs/final-reviews/WO-024/RELEASE-NOTES.md`, written by its final reviewer.
5. Write-backs: 07-execution-guide.md §Operator resume phrases (the
   `release close` row) and §Workflow closeout and releases (the authority
   sentence and the recoverable post-tag failure); `docs/PLAYBOOK.md` step 4
   (final review writes the notes) and §End-of-workflow release task;
   `docs/releases/README.md`; 06-roadmap.md §Release boundary (one paragraph:
   reviewed notes, assembled edition, projected Release); ledger entry.
   Product-doc edits stale the publication locks; refresh them and append the
   staleness recapture as WO-007 did.

**Acceptance criteria (all required)**

1. Notes-file contract. `worktree publish` refuses before pushing when
   `docs/final-reviews/WO-NNN/RELEASE-NOTES.md` is missing, has a missing,
   extra, duplicated, or misordered required heading, or has an empty
   `Release overview` or `Read before upgrading` section; each refusal names
   the defect and the path; the existing publish success case passes with a
   well-formed file. Every case is a `test-worktree.sh` fixture.
2. Assembly. In the release fixture, a range containing two work orders — one
   with a notes file and one without — yields an edition with one subsection
   per work order in first-parent commit order, the legacy work order under the
   labeled fallback with its commit subjects, the machine-derived evidence block
   last, and the `criticalNotes` lines under their "derived from the diff"
   label after the reviewer's items. Nothing human-written is dropped,
   reordered, or reflowed.
3. Determinism and record. Two assemblies of the same tree are byte-identical;
   the created tag's annotation equals the regenerated message; the existing
   idempotency, unrelated-tag, and no-tag-on-refusal cases stay green;
   `manifest-from-tag` on the real `v0.3.0` tag still parses. If the manifest
   schema is bumped, a version-1 fixture tag still validates through
   `ensureExistingRelease`.
4. GitHub Release. With the stub: no `gh release` invocation occurs before a
   successful tag push; exactly one `create` occurs per publish, with the
   expected tag, `--verify-tag`, title, and body file; a rerun creates none; a
   stub `create` failure after the push leaves the tag, exits non-zero with the
   documented message, and the rerun creates the Release; a stub `view`
   returning a different body refuses with the first differing line; a
   preflight failure (`gh` absent or unauthenticated) refuses before `mktag`
   with no tag anywhere.
5. `publish-notes vX.Y.Z` against a fixture tag creates one Release whose body
   is that tag's human layer verbatim under the time-indexed label;
   `notes vX.Y.Z` prints the same layer offline; `list` prints every annotated
   release tag with commit, version, and work orders; each is a fixture
   assertion.
6. Authority. No code path pushes `main`, moves a tag, or calls any `gh`
   subcommand beyond the preflight and the release `view`/`create` pair; a grep
   over `scripts/` proves it, and the guide and playbook sentences name the
   widened authority exactly.
7. Self-referential instrument. This order's own release close is the first
   real drive of the assembled edition and the GitHub Release; its final
   reviewer writes this order's notes file and discloses the instrument per
   07-execution-guide.md §Discipline. The operator's post-merge close is where
   that evidence lands; nothing in the executor's or verifier's session performs
   or implies a release or a Release.
8. `npm test` green; `git diff --check` clean; `packages/` byte-identical;
   `package.json` dependencies unchanged; no `.claude/` change.

**Evidence gate:** the fixture transcripts for criteria 1–5 with the `gh` stub
log; the assembled edition for the fixture range, captured; `npm test`;
`git diff --check`; the grep for criterion 6. The independent verifier reruns
the release and worktree suites and inspects the stub log rather than relying
on the executor transcript.

**Closeout:** after `FINAL-NNN` passes, the final reviewer publishes only the
WO-024 branch/PR under ordinary final-review authority, with this order's own
`RELEASE-NOTES.md` in the package. After the operator merges, a fresh
`resume: release close` authorizes `npm run release -- close WO-024 --publish`,
which must publish the annotated tag and, for the first time, its GitHub
Release. Historical GitHub Release backfill is optional operator follow-up. At
activation, the unprojected range is `v0.2.0` through `v0.3.1`; use
`npm run release -- publish-notes vX.Y.Z` from the main checkout, outside the
sandbox (where `gh` cannot read its configuration). Agents never run it. A
deliberate decision not to backfill is recorded in `docs/releases/README.md`;
silence is not a disposition.

**Non-goals:** committing a per-release file under `docs/releases/` (the
`v0.2.0` files remain the historical exception; the tag is the record and a
second release PR stays rejected); release assets, npm, binary, container, or
hosted distribution; editing or moving any existing tag; rewriting existing
`PR.md` files or historical final reviews; a model-drafted notes file for the
reviewer to edit (record as a candidate for the planning role); changing the
manifest's compatibility fields, cadence extraction, or the evidence command
list; WO-025's surface checks; WO-018's helper consolidation.
