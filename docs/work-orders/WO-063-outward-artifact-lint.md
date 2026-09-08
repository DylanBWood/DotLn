# WO-063 — Outward-artifact lint: branch names, commit messages and pull-request text must have the conventional-commit shape and carry no launchpad vocabulary or local term before any remote effect (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Control-plane tooling: one lint in
`scripts/lib/` with fixtures; no runtime package change. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H, the lint slice), cut as a bounded order at the operator's same-day
correction; it carries the camouflage lint WO-033 phase 2 described and the
parity item "proper conventional commits". Planner-synthesized draft;
captures and hashes in the ledger section of that date. Opaque identifier,
not a priority. Clean-room screen: the committed vocabulary list names only
this repository's own public terms; the local-terms list stays local.
**Depends on:** WO-039 merged (the local-terms check this lint reuses;
closed).
**Recommended placement:** any free lane, before WO-064; it adds
`scripts/lib/outward-lint.mjs` and a committed vocabulary file beside it
(relocated by the configuration root, WO-069, when that lands). A
recommendation, not a dependency token.

**Cites (read these sections):** 01-principles.md Principle 16 (workplace
camouflage generalized); 03-architecture.md §Platform and instance boundary
(a target never sees a DotLn file or term); `CLAUDE.md` §Clean Room;
`scripts/lib/terms.mjs` (`checkLocalTerms`); `scripts/github-body.mjs` and its test; `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 2 (the two-part deny list, as the umbrella's original wording).

**Objective:** One pure `lintOutwardArtifact({ kind, text })` for branch
names, commit messages and pull-request titles and bodies: the
conventional-commit shape for commit subjects (`type(scope)?: summary`, a
declared type set, a length bound, a body separated by a blank line), a
branch-name pattern, and a two-part vocabulary deny: the committed launchpad
vocabulary (this repository's own public terms) and the operator's local
terms through the existing check, which reports `unavailable` when no list
is present rather than passing.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Nothing checks a commit message or pull-request text before it leaves the
  launchpad; the local-terms check runs over committed prose only.

**Design (scope discipline):**

- Pure function plus a CLI entry (`node scripts/outward-lint.mjs <kind>` over
  stdin) so hosts and hooks can call it; results name the rule and the
  offending span.
- **Declined alternatives, recorded:** a configurable rule language; running
  the lint as a Git hook in the target (the target must carry no DotLn
  file).

**Deliverables:** the lint, the vocabulary file, fixtures, the write-backs
below.

**Acceptance criteria (all required)**

1. Fixtures: a conforming commit subject passes; a missing type, an unknown
   type, an over-length subject and a missing blank line each refuse naming
   the rule; a conforming and a non-conforming branch name.
2. A body containing a launchpad vocabulary term refuses naming the term; a
   body containing a synthetic local term refuses when a fixture local list
   is present; with no local list the result is `unavailable` for that part
   and the committed part still runs.
3. Write-backs land: 07 §Discipline (one sentence), ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the publish path (WO-064); worker prompts; changing the
local-terms check.

**Operator-review assumptions**

1. The conventional-commit type set is the common one; the operator may
   narrow it by editing the committed file.
