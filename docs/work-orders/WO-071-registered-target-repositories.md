# WO-071 — Registered target repositories: a work order may declare a repository and base, the configuration registers each repository with an authority profile, and the compiled WorkOrder inherits that profile through the monotone floor (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A work-order metadata field, a
configuration section with semantics, and the control-plane compile of an
order's operation lists from a registered profile. Assigned at activation
under the standing opt-out default.
**Nomination provenance:** WO-033 phase 2 (registration and the authority
profile), cut into a bounded child at the operator's 2026-09-08 correction.
Planner-synthesized draft. Opaque identifier, not a priority. Clean-room
screen: the fixtures register scratch repositories only.
**Depends on:** WO-069 merged (the `repositories` section of the
configuration); WO-042 merged (the `registered-repository` grant provenance
and the floor the profile narrows through).
**Recommended placement:** after WO-069; it edits `scripts/lib/config.mjs`
(the repositories schema), `scripts/work-orders.mjs` (the field), and
`scripts/resume.mjs` (the activation event's repository fields). A
recommendation, not a dependency token.

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 2 (the umbrella's wording); 02-domain-model.md §Identity and
composition (AuthorityEnvelope; a registered repository's profile is one;
grants after WO-042); 12-workstream-application.md §One workstream across
repositories (each bounded order names its repository base);
09-audit-resilience-privacy.md §Privacy and minimization.

**Objective:** A work order may declare `**Repository:** <id> @ <base>` in
its leading metadata (absent means `self`); the configuration's
`repositories` entries carry `id`, declared base branch, worktree parent,
an opaque class name (WO-073 gives it meaning), and an authority profile as
an `AuthorityEnvelope`; the compiled WorkOrder for a target order inherits
that profile as narrowing of the loadout's base or as grants with
`registered-repository` provenance, never as silent widening; the activation
event records the repository id and base commit and no physical path.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No work-order field names which repository an order changes, although
  product 12 requires it and the domain model's WorkOrder carries `repo` and
  `baseCommit`; the founding "never push or open a pull request" rule is
  overridden per repository by hand.

**Design (scope discipline):**

- Field parser beside the existing header parser; the index shows the
  repository id; `activate` records id and base commit.
- The profile applies through WO-042's semantics: denies narrow; allows
  beyond the base are grants with `registered-repository` provenance and the
  repository's id as `repo`.
- **Declined alternatives, recorded:** a physical path in the order (paths
  stay in ignored local state); a per-order envelope override (the
  registration is the single place).

**Deliverables:** the field, the schema section, the activation fields, the
compile of the profile, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture order declaring a registered repository activates; the
   activation event and every projection show the repository id and base
   commit and no physical path; an order without the field is `self` and
   every existing fixture is byte-identical.
2. The compiled WorkOrder's allowed and prohibited operations equal the
   registered profile applied through the floor: a profile deny narrows; a
   profile allow beyond the base appears as a grant with
   `registered-repository` provenance; a profile that would widen without a
   grant refuses with `AUTHORITY WIDENING`.
3. An unknown repository id, a missing base, or a malformed profile refuses
   activation with the path.
4. Write-backs land: 07 §Operator resume phrases (`Repository:`), 12 §One
   workstream across repositories (the field), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** creating worktrees in the target (WO-072); classes and
profile documents (WO-073); publishing.

**Operator-review assumptions**

1. Registration lives in the committed configuration because repository ids
   and profiles are public; local paths never do.
