# WO-011 — Feedback compiler v1 (v0.13.0)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The omitted activation target is completed
on 2026-09-06 as v0.13.0 above published v0.12.0 under the roadmap's retiming. Adds backwards-compatible
FeedbackUnit compilation and the first bounded self-hosted path.
**Depends on:** WO-010 complete; WO-004's startup-context accounting (the
baseline for the measured-reduction exit criterion); WO-009's transports (the
self-hosted step).

**Cites (read these sections):** 06-roadmap.md §v0.13.0 —
Feedback compiler v1 (the ten units are
enumerated there — that list is this order's whole inventory);
02-domain-model.md §Feedback (FeedbackUnit, Mechanism hierarchy, Gem
maturity, Semantic correction events); 01-principles.md Principles 5 and 7;
ADR-0001 §Decision (the strangler experiment this rung finally gives a vehicle);
docs/PLAYBOOK.md ("note it — that's a future compiled feedback unit").

**Objective:** Author and compile the ten representative FeedbackUnits the
roadmap names, from this repo's own ledger and incident history (not any
external rule stack) — each with mechanism per the hierarchy, regression
fixture, and maturity stats — plus the first self-hosted step: one DotLn work
order for this repo itself compiled, dispatched, executed, and verified by
DotLn.

**Scope discipline (one step at a time):**
- Exactly the ten units the roadmap lists; no eleventh, however tempting.
- Mechanism choice happens on contact with the real shapes, always the
  cheapest sufficient rung of the hierarchy — prose is the ninth choice, not
  the first (Principle 5).
- The self-hosted step is one work order end to end with the operator
  watching — not a general self-hosting switchover.

**Constraints:** compiled mechanisms respect the existing purity boundaries
(guards/reactors pure; hooks/permissions at the edge); no config mutation of
safety boundaries unless the unit's mechanism is explicitly authorized and
logged per the execution-guide rule; new dependencies only via ADR-0002
§Amendments.

**Acceptance criteria (all required)**
1. Each unit carries the full FeedbackUnit shape (incident provenance,
   undesired/desired observable behavior, scope, trigger, mechanism,
   enforcement, required evidence, regression fixtures, conflicts,
   supersedes, retirement condition).
2. Each unit's regression fixture fails when its mechanism is removed.
3. Startup-context reduction vs. prose equivalents is measured against the
   WO-004 accounting baseline, method stated.
4. The self-hosted step: one work order for this repo travels compile →
   dispatch → execute → verify inside DotLn, with evidence (ADR-0001's
   strangler experiment gets its vehicle).
5. The fail-conservative correction reactor triggers on semantic correction
   events, never on surface language, and a false positive only tightens
   behavior.

**Write-back duty:** compiled-unit residue and any transformed feedback ideas
go into 02-domain-model.md §Feedback and the ledger; any execution-guide duty
a unit absorbs is noted there (the strangler loop in action).

**Evidence gate:** fixture runs captured with mechanism present and removed;
the context-reduction measurement; the witnessed self-hosted run; every
criterion mapped to a named test or witnessed run.

**Non-goals:** the full pattern shelf; more than ten units; console surfaces
(the projections-and-console rung); autonomy-rung computation and set bonuses
(the pattern-workshop rung); replacing the
operator playbook wholesale.

**Additional incident source (2026-09-05):** the
[WO-031 publication correction](../evidence/WO-031/ideation.md) supplies a
regression case for the existing anti-oscillation unit. Rejecting verbose titles
must preserve useful specificity without inventing a numeric limit; rejecting
that limit must not restore the original verbosity. This adds evidence for one
of the ten units, not another unit or an implementation claim.

## Ideation breakout receipt — 2026-09-06

**Authority and source:** operator ideation, two clarifications, and the
backup-reference correction during `resume: next`. Clean Room with Shape-First
Synthesis and public vocabulary; no direct-filing exception. The ideation is
preserved in main's ignored `docs/intake/notes/wo-011-expanded-ideation-2026-09-06.md`;
main was resolved through the worktree registry and the staged capture compared
byte for byte before removal. No intake reconciliation remains pending.
Canonical intake and promoted documents establish provenance; temporary local
backups are not review or evidence dependencies.

**Decisions and surfaces:**
- Product 03's platform/instance boundary records optional Playwright/Context7
  integrations and sibling-repository intentions. No paid account or particular
  documentation adapter becomes a DotLn user prerequisite.
- The proposed pilot uses DotLn to help build Enterprise Starter, forks the
  starter as a coordination repo, and routes work orders to multiple targets.
  During that trial, Angular changes go through the fork. Product 12 records
  the workflow evidence needed. This is one personal/synthetic simulation of an
  organization user's needs, not a canonical topology or a fork of core.
- Product 03's corpus policy treats artifact count as an observation, not a
  defect. A healthy structure needs no intervention. Clearer organization,
  explicit archives, consolidation, and other alternatives remain available
  where they solve a demonstrated problem while preserving useful history and
  references. Product 07 links that policy and excludes disposable backup names
  from durable receipts.
- The planning map preserves these optional follow-ons without allocating work.
  The ledger section “2026-09-06 WO-011 optional consumers and artifact
  maintenance” records the ideas and subsequent corrections append-only.

**Review and limits:** the verifier and final reviewer must inspect this receipt,
products 03/07/12, the planning map, and the new ledger entries for source
traceability, intent fidelity, settled-decision consistency, links, and generated
source freshness. Repository contents and integration effectiveness remain
unverified; installations and purposes are operator-reported. Authentication,
licensing, starter update strategy, and pilot scope remain open. This breakout
changes documentation only; it adds no eleventh FeedbackUnit, sibling-repo
implementation, retention migration, or settings mutation. The existing
anti-oscillation unit can use these corrections as further incident evidence.
