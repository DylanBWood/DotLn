# WO-025 — Version-bearing surfaces: the front door names the release of the source it is in, checked before merge and at close (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Before
`resume -- activate`, rewrite this H1 to carry exactly one strict `vX.Y.Z`.
Expected class: a patch strictly above the latest published tag, so the
close-time gate is exercised by this order's own close. Documentation and
lifecycle tooling plus one component-version correction; no exported runtime
capability.
**Nomination provenance:** the operator's 2026-09-02 planning session after the
`v0.3.0` close ("the front page readme always seems to be a version behind"),
together with `docs/final-reviews/WO-007/FINAL-001.md` §Candidates considered
and not sustained (the reviewer predicted the root README would read stale once
`v0.3.0` was tagged and classified the refresh as follow-on documentation) and
its §Remaining deviations (the CLI banner prints `@dotln/skeleton v0.2.0`).
Planner-synthesized draft; the operator's message is preserved locally as a
compaction-safety capture in ignored intake
(`docs/intake/notes/WO-024-WO-026-release-surfaces-planning-2026-09-02.md`).
Opaque identifier, not a priority. The clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** `main` at or after `v0.3.0`. WO-013 merged is recommended
(shell-suite hunks). WO-024 merged is recommended so this order's checks join
the same `worktree publish` and `release close` preflights rather than adding a
second preflight shape; if activated before WO-024, activation restates
deliverable 2 accordingly. Land before WO-018 for the reason WO-024 gives, or
restate against `scripts/lib/` if after it.

**Cites (read these sections):** 06-roadmap.md §Release boundary (the sole H1
version is the application release target, pinned at activation; a published
tag may not move); 10-ir-compatibility.md §Separate version axes;
08-publication-compiler.md §Authority and honesty rules 1–2 (traceable;
implementation status cannot blur); 07-execution-guide.md §Discipline ("Prefer
forward-only enforcement", "Time-index the standard"); `docs/releases/README.md`;
`scripts/release.mjs` (`workOrderAuthority`, `packageVersions`, `changedFiles`,
`publishedTag`, `latestVersion`, `close`); `scripts/worktree.mjs` publish;
`README.md` §What runs today; `packages/skeleton/src/cli.ts:12`;
`docs/final-reviews/WO-007/PR.md` §Known open items (the sentence "until
release close assigns `v0.3.0`", which names a step that does not exist).

**Objective:** Make every statement of "which release is this" on a public
surface a fact that is derived from, or checked against, release truth at the
two moments that matter — before the reviewed branch is pushed and before the
tag is cut — so the front door cannot be a version behind at the moment a tag
names it, and a component's version cannot stay frozen while its source moves.

**Observed problem (dated 2026-09-02):**

- `README.md:59` reads "The published boundary at the start of WO-007 is
  `v0.2.3`." and `:130`–`:133` "The next rung after `v0.2.3` is audit
  projections … This checkout contains that rung under review; it is not part
  of the published boundary named above." `v0.3.0` was tagged today from a
  commit containing exactly that text, so the repository's front page describes
  the previous release. The cause is structural: the README has only ever been
  edited inside work-order branches (WO-003, WO-004, WO-006, WO-007) before the
  release existed; `release close` pushes a tag and no commit; `main` is
  PR-only. Nothing after the tag can correct the front page without a second
  PR, which WO-004 deliberately rejected. The sentence was time-indexed ("at
  the start of WO-007") precisely so it would be true at merge, which is why
  the WO-007 review did not sustain it as a defect. The fix is to state the
  release of the source, not the boundary before it, and to check that claim.
- `packages/skeleton/package.json` is `0.2.0` and `packages/kernel/package.json`
  is `0.1.0`. The skeleton gained `audit.ts` in `v0.3.0` and its version did
  not move; the `v0.3.0` manifest faithfully records
  `"@dotln/skeleton": "0.2.0"`. `packages/skeleton/src/cli.ts:12` prints a
  hardcoded `@dotln/skeleton v0.2.0` banner that reads neither `package.json`
  nor the release. WO-007's PR body deferred the number to "release close",
  which assigns nothing; no actor owns component versions.
- Time-indexed claims elsewhere are honest and out of scope:
  `docs/publication/audience-status-index.md:147` and
  `docs/publication/base-outline.md:79` are anchored to a locked source base
  revision, and `packages/skeleton/README.md` says "first shipped in `v0.2.0`".
  The executor lists every surface that asserts currency without an anchor and
  either brings it under the block rule below or time-indexes it.

**Design (scope discipline):**

- **One block, one claim.** The README gains one delimited block, for example
  between `<!-- DOTLN-RELEASE-BEGIN -->` and `<!-- DOTLN-RELEASE-END -->`, that
  states the release of the source it is in ("This source is DotLn `vX.Y.Z`"),
  carries the version-bound "what runs today" sentences, and points at the
  GitHub Releases page and `npm run release -- notes`. Exactly one strict
  `vX.Y.Z` inside the block. The executor rewrites §What runs today so that no
  sentence outside the block asserts a current boundary; historical mentions
  ("first shipped in `v0.2.0`") stay. The verifier reads the whole README for
  that property; the tool checks only the block.
- **The expected version is release truth, not the latest tag.** Expected =
  the work order's H1 target when it is strictly above the latest published
  annotated tag; otherwise the latest published tag (a no-release work order
  leaves the block alone). Before merge the block therefore names the version
  the tag will carry; between merge and tag it is ahead by minutes, by design;
  and a refused close opens a patch work order that carries the same version,
  so the claim never goes wrong. Both inputs already exist:
  `workOrderAuthority` reads the H1 and `publishedTag`/`latestVersion` read
  origin.
- **Component versions move with their source.** For each `packages/<name>/`,
  if any path under `packages/<name>/src/` differs between the previous
  release's commit and HEAD, then `packages/<name>/package.json` `version` must
  differ from the previous release manifest's `versions.components[name]`. The
  reverse is not enforced. The banner derives from `package.json` at runtime
  (the skeleton reads its own manifest with `node:fs`; no dependency) so it can
  never disagree again. One explicit correction is in scope with a dated note:
  skeleton `0.2.0` → `0.3.0`, recording the audit module that shipped in
  `v0.3.0`, under forward-only enforcement; the kernel stays `0.1.0` and its
  source is untouched.
- **Two gates, one check.** `release check-surfaces` is a read-only subcommand
  that prints one PASS or FAIL line per rule with observed and expected values
  and exits non-zero on any FAIL. `worktree publish` runs it after the phase
  gate and before the push; `release close` runs it after `updateMainAndFinish`
  and before `npm ci`. It is not added to `npm test`, which must stay
  tag-state-independent; the verifier runs it by hand.
- Do not touch `packages/kernel/src`, `packages/skeleton/src` beyond the banner
  line, the manifest schema, cadence extraction, the evidence command list, or
  the publication editions' locked base revisions.

**Deliverables:**

1. `README.md` §What runs today rewritten around the release block, and any
   other currency-asserting surface the executor's census finds brought under
   the rule or time-indexed.
2. `check-surfaces` in `scripts/release.mjs` and its two call sites
   (`worktree publish`, `release close`).
3. Fixtures in `scripts/test-release.sh` and `scripts/test-worktree.sh`.
4. The banner derived from the package version, the skeleton version
   correction with its dated note, and the one `packages/skeleton/README.md`
   sentence that follows from it.
5. Write-backs: 07-execution-guide.md §Workflow closeout and releases (the two
   gates; updating the README block is the executor's duty whenever the planner
   pins a tagging version); `docs/PLAYBOOK.md` steps 1 and 5;
   `docs/releases/README.md`; 06-roadmap.md §Release boundary (the
   component-version rule); 10-ir-compatibility.md §Separate version axes (one
   sentence: the component axis moves when the component's source moves);
   ledger entry. Product-doc edits stale the publication locks; refresh them
   and append the staleness recapture as WO-007 did.

**Acceptance criteria (all required)**

1. Block. `README.md` contains exactly one release block with exactly one
   strict version, stating the release of the source; zero, two, or malformed
   blocks refuse; a version outside the block is ignored by the tool; the
   verifier confirms no sentence outside the block asserts a current boundary.
2. Expected-version rule, in fixtures: target above the latest tag and block
   equal to the target → PASS; block equal to the previous tag → FAIL naming
   both values; target below the latest tag and block equal to the latest →
   PASS; target below the latest and block equal to the target → FAIL; no tags
   at all and block equal to the target → PASS.
3. Component rule, in fixtures: `src` changed and version unchanged → FAIL
   naming the package and both versions; `src` changed and version changed →
   PASS; `src` unchanged and version unchanged → PASS; a change only under
   `packages/<name>/test/` or the package README requires no bump.
4. Gates. `worktree publish` with a failing check pushes nothing and opens no
   PR; `release close` with a failing check refuses after synchronization and
   before `npm ci`, and creates no tag; the existing success fixtures pass with
   a correct block and versions; refusal output is the check's report verbatim.
5. Banner. `npm run skeleton` prints the version read from
   `packages/skeleton/package.json`; a test binds it; the skeleton package
   version is `0.3.0` with the dated note; the kernel version is unchanged and
   `packages/kernel/src` is byte-identical (`cmp`).
6. Self-referential instrument. This order's own README block names its
   assigned version and its own `check-surfaces` passes in the worktree before
   publish; the final reviewer discloses the instrument per
   07-execution-guide.md §Discipline; the order's release close is the first
   close-time drive of the gate.
7. Write-backs landed. The WO-007 PR body's obsolete sentence is not edited
   (immutable); the roadmap paragraph now says who owns each version axis.
8. `npm test` green; `git diff --check` clean; no new dependency; no `.claude/`
   change; manifest schema unchanged.

**Evidence gate:** fixture transcripts for criteria 2–4; `check-surfaces`
output on this worktree; the `npm run skeleton` banner line; `npm test`;
`git diff --check`; `cmp` of the kernel source before and after.

**Closeout:** ordinary. After the operator merges, a fresh
`resume: release close` evaluates this order's target; the README's release
block is provably current at that tag for the first time.

**Non-goals:** generating the README from the manifest; a post-tag README PR; a
version badge or hosted status; changing the locked publication editions' base
revisions or their dated claims; bumping the kernel without a source change;
enforcing "no bump without a source change"; a `version` field in the root
`package.json` (the application version stays in the tag and the H1; record
the question as a candidate); WO-024's notes; WO-018's consolidation.
