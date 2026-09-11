# WO-062 — GitHub Issue source adapter: a read-only skeleton adapter over the GitHub CLI turns one issue and its discussion into a SourceBundle with a revision id, screened before it is stored (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model; the live smoke is operator-run against a
personal public repository. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new external adapter in the skeleton
over the existing GitHub CLI helpers; read-only. Assigned at activation
under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
G, the adapter slice), cut as a bounded order at the operator's same-day
correction. Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
the fixture issue lives in a personal public repository; no tracker name or
private artifact enters the repository.
**Depends on:** WO-060 merged (the bundle shape it produces).
**Recommended placement:** after WO-060, in any free lane; it edits
`packages/skeleton/src/` (a new source adapter) and reuses the `gh` helper
and stub the release tooling already has. A recommendation, not a
dependency token.

**Cites (read these sections):** 03-architecture.md §Ports (`SourceAdapter`);
ADR-0002 Decision 2; 09-audit-resilience-privacy.md §Privacy and
minimization; `scripts/github-repository.mjs` (the GitHub helper and its stub used by `worktree publish`); `packages/compiler/src/` (the source-bundle module).

**Objective:** `fetchIssueBundle(repo, number)` reads an issue's body,
comments, edit history where the API exposes it, and image references
through `gh` in JSON mode, maps them into a `SourceBundle` with the issue's
last-updated timestamp as the revision id and authors reduced to role labels,
passes the WO-060 screen, and stores the bundle by hash; a second fetch of an
unchanged issue yields the same hash.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No adapter reads a tracked-work artifact; the vertical would start from a
  hand-typed contract.

**Design (scope discipline):**

- Fixtures use recorded `gh` JSON through the existing stub; no network in
  tests; the live smoke uses one issue the operator files in a personal
  public repository.
- Author roles: the issue author is `reporter`; any account matching a
  declared automation pattern is `automation`; every other commenter is
  `reviewer`.
- **Declined alternatives, recorded:** the REST API directly (the CLI
  helper and stub exist); any enterprise tracker (outside core by
  decision).

**Deliverables:** the adapter, recorded fixtures, a live smoke record, the
write-backs below.

**Acceptance criteria (all required)**

1. Over recorded JSON, the adapter produces a bundle that decodes, whose
   spans resolve, and whose hash is stable across two runs.
2. A recorded issue containing a secret-shaped token is refused by the
   screen before storage, with the span.
3. A live smoke against a personal public repository issue produces a bundle
   and a second fetch reproduces its hash; the record reduces identifiers to
   shapes.
4. Write-backs land: 03 §Ports (the first adapter), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the smoke record; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** writing to issues; pull-request comments (WO-065); the
enterprise tracker; the StoryContract (WO-061).

**Operator-review assumptions**

1. The live smoke is operator-run with their own authentication outside the
   sandbox.
