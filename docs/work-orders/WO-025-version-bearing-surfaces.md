# WO-025 — Version-bearing surfaces: the front door names the release of the source it is in, checked before merge and at close, v0.3.3

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.3.3`, the patch strictly above the latest
published tag (`v0.3.2`) observed at activation. The activation helper did not
perform the draft's required H1 rewrite; the executor forward-corrected the
authority before implementation. Documentation and lifecycle tooling, one
component-version correction, and the bounded presentation correction recorded
below; no exported runtime capability.
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

**Operator-authorized scope expansion (2026-09-02):** During the active
executor session, the operator reported that prior PR prose and the new release
template were forced to a narrow explicit width that looked especially poor on
a 4K ultrawide, and explicitly asked to expand this order. The repository census
found the shared cause on mutable documentation surfaces:
`.prettierrc.json` sets `printWidth: 80` together with `proseWrap: "always"`;
reviewed `PR.md` and `RELEASE-NOTES.md` artifacts are formatter-exempt but had
copied the same hard-wrapped convention by hand. This expansion removes forced
prose reflow from the shared formatter; a separate checked profile makes one
physical line per paragraph the forward final-review convention. Historical
PRs and immutable reviewed artifacts stay unchanged, and the operator did not
authorize editing remote PRs. The clean-room screen found no employer material,
credential, internal URL, private identifier, or other stop condition in the
report.

### Scope-expansion receipt

- **Authority and raw batch:** the operator's live message above explicitly
  widened active WO-025 and directed continued execution. Its unedited local
  capture is
  `docs/intake/notes/WO-025-expanded-ideation-2026-09-02.md`; the earlier
  release-surfaces planning capture remains separate provenance for the
  original order.
- **Clean-room treatment:** ordinary shape-first synthesis extracted the public
  presentation problem—repository-authored physical line breaks become visible
  breaks in GitHub PR/comment fields—without copying the raw phrasing into the
  public contract. The screen found no employer material, credential, private
  identifier, internal URL, or proprietary service detail. GitHub's public
  [line-break documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#line-breaks)
  and Prettier's public
  [`proseWrap` documentation](https://prettier.io/docs/options.html#prose-wrap)
  anchor the renderer and formatter behavior.
- **Promoted shared memory:** the exact ledger heading is `WO-025
  implementation and operator-expanded presentation scope (2026-09-02)`.
  Amendments land in 06-roadmap §Release boundary, 07-execution-guide
  §Workflow closeout and releases, 08-publication-compiler §Release-note
  edition, 10-ir-compatibility §Separate version axes, ADR-0002 §Amendments,
  the final-review convention, release guide, operator playbook, and provisional
  work-order map. `.prettierrc.json` changes only Markdown prose wrapping.
- **Executable subject:** `scripts/github-body.mjs`, its unit checks, and the
  publish/close fixture additions are implementation, not incidental ideation
  helpers. They join the original release-surface checker and both mutation
  gates as verifier subject.
- **Version and schema effects:** the application target remains the already
  assigned patch `v0.3.3`; skeleton's original-order component correction
  remains `0.3.0`; kernel remains `0.1.0`. Manifest schema 1, control-log schema
  1, kernel schemas, artifact versions, and transformation versions are
  unchanged.
- **Known limit and unresolved choice:** the repository can remove its own
  forced physical prose breaks but cannot control GitHub's page/container width.
  The dependency-free profile deliberately covers the supported final-review
  Markdown subset rather than claiming to be a complete Markdown parser. No
  decision about retroactively editing public PRs or immutable artifacts remains
  open: both are excluded. A future richer body grammar would require its own
  bounded work if the supported subset expands.
- **Required review:** the independent verifier and final reviewer must digest
  this receipt and raw-batch provenance, verify the clean-room transformation,
  execute the profile unit and mutation-boundary fixtures (including tables,
  indented and lazy continuations, hidden working-tree edits, and strict SemVer
  suffixes), confirm the two official behavior anchors still support the stated
  rationale, and prove historical final-review bytes are unchanged.

### Temporal-counterfactual ideation breakout receipt

- **Authority and raw batch:** during active execution the operator opened a
  second `ideation:` breakout to preserve a future question about time fidelity,
  event-level causality, counterfactual closure, and k-DOP-shaped reachability.
  The unedited local capture is
  `docs/intake/notes/WO-025-temporal-counterfactuals-2026-09-02.md`. The operator
  described it as work to look into later and subsequently explicitly
  preauthorized returning to WO-025 after this receipt; it is not an expansion
  of this order's implementation deliverables.
- **Clean-room treatment and grounding:** ordinary Shape-First Synthesis
  retained the frame-rate anecdote's temporal relationship and the bounding
  geometry analogy without treating either as literal architecture. The screen
  found personal/public material only: no employer code, configuration,
  identifier, service detail, credential, internal URL, or other stop
  condition. Lamport's public
  [event-ordering paper](https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/),
  [Klosowski et al.'s k-DOP paper](https://doi.org/10.1109/2945.675649), and
  Fujimoto's public
  [parallel discrete-event simulation survey](https://doi.org/10.1145/76738.76741)
  were used as technical orientation, not as product authority.
- **Promoted shared memory:** the exact new ledger heading is `WO-025 ideation
  breakout — temporal fidelity and bounded future reachability (2026-09-02)`.
  The candidate contract is recorded in 11-proteino §Candidate — time fidelity
  and bounded future reachability; 06-roadmap §Post-1.0 horizons gains only a
  catalog pointer; and the audience/status index classifies the new section as
  vision. No ADR or settled resolution changes.
- **Transformation and open questions:** execution throughput, modeled world
  time, observation availability, the record/ingest milestone, and append order
  remain distinct; authority-to-act is separate again. A counterfactual can
  claim closure only relative to its declared checkpoint, horizon,
  observations, versions, randomness, and exogenous-input policy. A k-DOP-like
  envelope `E` is preserved only as a conservative broad-phase hypothesis:
  target/query set `T` can be pruned only when `T ∩ E = ∅`; overlap means only
  “not ruled out.” It cannot
  enumerate all futures or establish certainty. A universal engine rate,
  prediction horizon, lower-bound causal lookahead, deadline-miss policy, event
  quantum, closure boundary, pruning representation, and soundness/refinement
  proof all remain unresolved.
- **Version, schema, and executable effects:** application target `v0.3.3`,
  component versions, manifest/control/kernel schemas, artifact and
  transformation versions, dependencies, code, acceptance criteria, and this
  order's evidence commands are unchanged by the breakout. No clock,
  simulator, geometry, pruning algorithm, or executable helper was selected or
  added.
- **Required review and continuation:** the independent verifier and final
  reviewer must digest this receipt and its raw provenance, confirm the
  synthesis preserves the operator's uncertainty, and ensure candidate claims
  are not presented as physical truth, real-world causal evidence, a real-time
  guarantee, or current implementation. They must confirm consistency with the
  existing explicit-clock replay contract, occurrence/append/causation
  distinctions, simulator boundary, and Horizon 1 scope. The operator's
  explicit continuation authorization returns execution to the pre-breakout
  WO-025 subject after these write-backs and publication locks are current.

**Cites (read these sections):** 06-roadmap.md §Release boundary (the sole H1
version is the application release target, pinned at activation; a published
tag may not move); 10-ir-compatibility.md §Separate version axes;
08-publication-compiler.md §Authority and honesty rules 1–2 (traceable;
implementation status cannot blur) and §Release-note edition;
07-execution-guide.md §Discipline ("Prefer forward-only enforcement",
"Time-index the standard"); `docs/final-reviews/README.md`;
ADR-0002 §Amendments; `docs/releases/README.md`;
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
- **Two gates, one check.** Bare `release check-surfaces` is a read-only preview
  of the working subject; it prints one PASS or FAIL line per rule with observed
  and expected values, consults origin tag truth, and exits non-zero on any
  FAIL. `worktree publish` and `release close` invoke its committed mode: state
  is folded from `HEAD:docs/control/resume.jsonl`, version-bearing bytes come
  from `HEAD`, and hidden working-tree/index hints cannot substitute for what
  will be pushed or tagged. Publish runs it after the closed-phase gate and
  before the push; close runs it after `updateMainAndFinish` and before `npm ci`.
  It is not added to `npm test`, which must stay tag-state-independent; the
  verifier runs the bare preview by hand.
- **Renderer-wrapped handoff prose, forward only.** Change the shared Markdown formatter
  from `proseWrap: "always"` to `proseWrap: "preserve"`; `printWidth` remains a
  code-formatting preference, not a prose viewport. Update the final-review
  contract and template so each new PR/release-note paragraph or list-item
  paragraph is authored on one logical source line and the reader's renderer
  owns visual wrapping. A shared, dependency-free GitHub-body profile rejects
  accidental soft wraps in the current work order's committed `PR.md` and
  `RELEASE-NOTES.md` before either publisher mutates a remote; it preserves
  semantic newlines for headings, paragraph boundaries, distinct list items,
  fenced/indented code, tables, and explicit Markdown hard breaks. Transport
  remains byte-exact rather than silently rewriting reviewed prose. Do not
  rewrite formatter-exempt historical `PR.md`, `RELEASE-NOTES.md`, verification,
  or final-review evidence, and do not apply the forward profile while
  re-deriving a historical tag. This removes repository-imposed 80-column
  breaks; it does not control GitHub's own page or container width. This order's
  eventual final-review package is the first forward example.
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
6. Presentation implementation and write-back: `.prettierrc.json` stops forcing
   Markdown prose to `printWidth`; a shared GitHub-body profile and publish/close
   call sites check current PR/release-note artifacts; and ADR-0002,
   `docs/final-reviews/README.md`, 08-publication-compiler.md, the release README,
   playbook, and execution guide explain the responsive authoring rule while
   historical final-review artifacts remain byte-identical.

**Acceptance criteria (all required)**

1. Block. `README.md` contains exactly one release block with exactly one
   strict version, stating the release of the source; zero, two, or malformed
   blocks, marker lines, or SemVer tokens refuse; a version outside the block is ignored by the tool; the
   verifier confirms no sentence outside the block asserts a current boundary.
2. Expected-version rule, in fixtures: target above the latest tag and block
   equal to the target → PASS; block equal to the previous tag → FAIL naming
   both values; target below the latest tag and block equal to the latest →
   PASS; target below the latest and block equal to the target → FAIL; no tags
   at all and block equal to the target → PASS.
3. Component rule, in fixtures: `src` changed and version unchanged → FAIL
   naming the package and both versions; `src` changed and version changed →
   PASS; `src` unchanged and version unchanged → PASS; a change only under
   `packages/<name>/test/` or the package README requires no bump; a newly added
   component receives a first-version baseline rather than an impossible
   missing-previous-version failure.
4. Gates. `worktree publish` with a failing check pushes nothing and opens no
   PR; `release close` with a failing check refuses after synchronization and
   before `npm ci`, and creates no tag; the existing success fixtures pass with
   a correct block and versions; refusal output is the check's report verbatim,
   including when close removed a linked merged worktree; hidden working bytes
   and a stale generated control projection cannot override the committed log
   or committed surfaces.
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
9. Renderer-wrapped handoff prose. The shared formatter preserves authorial Markdown line
   breaks instead of imposing the 80-column code width; its check passes without
   a corpus-wide prose rewrite. In profile fixtures, an ordinary paragraph and
   list-item paragraph longer than 80 characters remain one physical line and
   pass; an accidental soft wrap in either fails with artifact and line numbers;
   headings, blank boundaries, distinct bullets, fenced/indented code, tables,
   and explicit hard breaks pass. `worktree publish` refuses a wrapped committed
   PR or current notes before push/`gh`; release close refuses wrapped current
   notes before `npm ci`, tag, or `gh`. This order's `PR.md` and
   `RELEASE-NOTES.md` follow the profile, every historical formatter-exempt
   review artifact is byte-identical to `origin/main`, and historical-tag
   re-derivation remains accepted.

**Evidence gate:** fixture transcripts for criteria 2–4; `check-surfaces`
output on this worktree; the `npm run skeleton` banner line; `npm test`;
`git diff --check`; `cmp` of the kernel source before and after; a formatter
configuration assertion plus historical final-review-tree comparison for the
renderer-wrapped-prose expansion.

**Closeout:** ordinary. After the operator merges, a fresh
`resume: release close` evaluates this order's target; the README's release
block is provably current at that tag for the first time.

**Non-goals:** generating the README from the manifest; a post-tag README PR; a
version badge or hosted status; changing the locked publication editions' base
revisions or their dated claims; bumping the kernel without a source change;
enforcing "no bump without a source change"; a `version` field in the root
`package.json` (the application version stays in the tag and the H1; record
the question as a candidate); editing historical review artifacts or remote PR
bodies; changing code `printWidth`; WO-024's notes; WO-018's consolidation.
