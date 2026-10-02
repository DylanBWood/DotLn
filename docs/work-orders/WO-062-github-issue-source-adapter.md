# WO-062 — GitHub Issue source adapter: a read-only skeleton adapter over the GitHub CLI turns one issue and its discussion into a SourceBundle with a revision id, screened before it is stored (v0.65.0)

**Model:** any capable model; the executor runs the live smoke against a
public repository's issue. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new external adapter in the skeleton
over the GitHub CLI helper's `executeGh`; read-only. Assigned at activation
under the standing opt-out default.
**Cost:** adds one adapter module in `packages/skeleton/src/` that reads
through `executeGh` and `parseGitHubTarget` of
`scripts/lib/github-repository.mjs`, fixtures over recorded JSON replayed
through a fake `gh`, a smoke script and its record with identifiers
reduced to shapes, and at most 300 bytes in product 03. Removes: no code
reads a tracked-work artifact, so the vertical starts from a hand-written
contract. WO-123 depends on it. Re-mints: none; the adapter is a new
module no registered source imports, and neither the helper nor the
fixtures are registered evidence sources or sources the feedback verifier
judges (`scripts/lib/evidence-sources.mjs` and
`packages/skeleton/src/feedback-audit.ts` at `5f3849ec`). Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
G, the adapter slice), cut as a bounded order at the operator's same-day
correction. Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
the fixture issue lives in a personal public repository; no tracker name or
private artifact enters the repository. Amended by the 2026-09-28 planning
pass, which re-observed the order on `main` at `5f3849ec`: the helper's
path and the exports the adapter reuses are named, each body and comment
passes WO-060's declared screen with the forge host as the allowlist, the
store is named, the live smoke is the executor's, the register's
exposure-plan question is carried in and the final criterion names both
gates ([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-060 merged (the bundle shape it produces, with the
screen and the allowlist it takes at decode time).
**Recommended placement:** fifth of the serial run, after WO-124 and before
WO-123, which depends on it. This order edits a new adapter module in
`packages/skeleton/src/`, its fixtures in the skeleton's tests, a smoke
script and record under this order's evidence directory, and product 03
§Ports; WO-060, WO-059 and WO-124 write that section before it. It reads
`scripts/lib/github-repository.mjs` without editing it, as WO-065 does. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-060",
    "relation": "hard",
    "reason": "the bundle shape it produces"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Ports (`SourceAdapter`);
ADR-0002 Decision 2; 09-audit-resilience-privacy.md §Privacy and
minimization and §Candidate — model-input exposure plans;
`scripts/lib/github-repository.mjs` (`executeGh`, `parseGitHubTarget`,
`ensureGh`); `scripts/test-target-publish.mjs` (the fake `gh` a fixture
writes inline); `packages/skeleton/src/dotln.ts` (the kit bridge to script
modules); `docs/work-orders/WO-060-source-bundle-contract.md` (the bundle,
the screen's declared set and allowlist, the role labels);
`docs/work-orders/WO-065-pull-request-state-observation.md` (the same
screen applied to each comment); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `fetchIssueBundle(repo, number)` reads an issue's body,
comments, edit history where the API exposes it, and image references
through `gh` in JSON mode, maps them into a `SourceBundle` with the issue's
last-updated timestamp as the revision id and authors reduced to role labels,
passes the WO-060 screen, and stores the bundle by hash; a second fetch of an
unchanged issue yields the same hash.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No code reads a tracked-work artifact: the `gh` calls under `scripts/`
  are `--version`, `auth status`, `pr create`, `release view`,
  `release create` and `release list`, and the one story contract the
  runtime reads is a hand-written file the mission check loads.
- The GitHub helper is `scripts/lib/github-repository.mjs`, where WO-163
  moved it. `executeGh` runs `gh` with `GH_REPO` and `GH_HOST` removed;
  `parseGitHubTarget` reads a repository URL into its host and its
  `HOST/OWNER/REPO` selector; `ensureGh` resolves its target from a local
  checkout's `origin` and words its refusals for a remote mutation.
- No stub file sits beside the helper: each fixture that needs `gh` writes
  a fake one inline, and none replays recorded JSON or answers an issue
  read.
- No module under `packages/*/src` imports a file under `scripts/`
  statically; `packages/skeleton/src/dotln.ts` reaches two script modules
  at run time through its kit bridge.
- WO-060's screen, as amended, refuses the secret shapes it declares and
  every declared URL form whose host is not on an allowlist supplied at
  decode time; an empty allowlist refuses every URL form.
- The register defers FUP-0113, model-input exposure plans, until this
  order activates, as the first order to bring external source text
  toward a model input.

**Design (scope discipline):**

- Fixtures use recorded `gh` JSON replayed through a fake `gh` each fixture
  writes inline, as `scripts/test-target-publish.mjs` does; no network in
  tests; the live smoke uses one issue the operator files in a personal
  public repository.
- The adapter parses its repository argument with `parseGitHubTarget` and
  reads through `executeGh`, reached as `dotln.ts`'s kit bridge reaches
  script modules. It does not call `ensureGh`, which needs a local checkout
  and words a mutation; `gh` absent or unauthenticated refuses with a
  read-only reason.
- The adapter declares the `gh` fields it reads; a declared field the
  response lacks is recorded absent, never defaulted, and edit history is
  recorded only from a declared field that carries it.
- Each section and discussion entry is screened as a one-entry bundle
  through WO-060's screen, with the forge host of the repository argument
  as the whole allowlist. An item the screen refuses is left out of the
  bundle and recorded beside it with its id, the shape and the span,
  without its text; the other items form the bundle, which decodes. A
  string the screen cannot classify passes, which is WO-060's stated
  limit. A consumer treats a recorded refusal as a typed stop naming the
  item.
- Input the adapter cannot read refuses with the reason and stores
  nothing: `gh` output that does not decode (with the field's path) and a
  failing `gh`.
- The bundle is stored as its canonical bytes under its hash in a
  directory the caller names, with the refusal record beside it.
- Author roles: the issue author is `reporter`; any account matching a
  declared automation pattern is `automation`; every other commenter is
  `reviewer`.
- Register carry-in: FUP-0113 (09 §Candidate — model-input exposure plans)
  reopens at this order's activation, and the decisions record whether a
  `ModelInputPlan` is part of the adapter's contract. The default is that
  it is not, because the adapter sends nothing to a model.
- **Declined alternatives, recorded:** the REST API directly (the CLI
  helper exists); any enterprise tracker (outside core by decision);
  `ensureGh` (reopen when the adapter needs a local checkout); keeping a
  refused item's text in any form.

**Deliverables:** the adapter, recorded fixtures, a smoke script and its
live record, the write-backs below.

**Acceptance criteria (all required)**

1. Over recorded JSON replayed through a fake `gh`, the adapter produces a
   bundle that decodes, whose spans resolve, and whose hash is stable
   across two runs; an issue that links only to the forge host is stored
   with its text.
2. For each secret shape and each URL form WO-060's screen declares, a
   recorded issue body or comment holding it is left out of the bundle and
   recorded with its id, the shape and the span, and a search of the store
   for the fixture's string finds nothing; the issue's other items form a
   bundle that decodes. The criterion is judged against WO-060's declared
   set; a shape outside it is a follow-up, not a failure.
3. `gh` absent, unauthenticated or failing, and output that does not
   decode, each refuse with the reason (the decode refusal names the
   field's path) and store nothing; a declared field the response lacks is
   recorded absent.
4. The executor's live smoke against an issue in a public repository
   (the scratch repository of WO-064's smoke where it holds one) produces
   a bundle, and a second fetch reproduces its hash; the record reduces
   identifiers to shapes.
5. Write-backs land, each in place with no dated paragraph: 03 §Ports, in
   the `SourceAdapter` bullet (the first adapter and its allowlist; at most
   300 bytes added, against 3,284 bytes of headroom on 2026-09-28; WO-060,
   WO-059 and WO-124 write the same section before this order, so the
   executor re-measures the headroom at its base, and where the bound does
   not fit it consolidates the section it edits in the same change; a
   ceiling is raised only by a planning-document decision); the decisions
   file, with the FUP-0113 reading; the publication locks refreshed.
6. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the fixture transcripts; the smoke record; `npm test`
and `npm run test:docs` before `implementation-ready` and at final review.
The live row is the executor's smoke.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** writing to issues; pull-request comments (WO-065); the
enterprise tracker; the StoryContract (WO-061); a secret outside WO-060's
declared set; a local checkout of the repository; a `ModelInputPlan`.

**Operator-review assumptions**

1. The executor runs the live smoke with the host's authenticated `gh`;
   it reads and writes nothing on the forge.
2. The forge host is the whole default allowlist: an item holding a link or
   an image reference to any other host is left out and recorded refused
   until a later order admits more hosts.
3. The adapter stays a skeleton module and reaches the helper through the
   kit bridge; placing it beside the helper in `scripts/lib/`, as WO-065
   places its observer, is the operator's alternative.
4. A `ModelInputPlan` is not part of the adapter's contract (FUP-0113).
