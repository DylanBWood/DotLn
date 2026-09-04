# WO-011 — Feedback compiler v1 (ten units; application version assigned at activation)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor, with the application version assigned at
activation under the roadmap's 2026-09-04 retiming. Adds backwards-compatible
FeedbackUnit compilation and the first bounded self-hosted path.
**Depends on:** WO-010 complete; WO-004's startup-context accounting (the
baseline for the measured-reduction exit criterion); WO-009's transports (the
self-hosted step).

**Cites (read these sections):** 06-roadmap.md §Application version pending —
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
