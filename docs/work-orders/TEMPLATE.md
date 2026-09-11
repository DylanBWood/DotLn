# Work-order template

Use this template when filing a new `WO-NNN-<name>.md`. Replace the placeholders;
the opaque number is an identifier, not a priority.

```markdown
# WO-NNN — Reader outcome (version assigned at activation)

**Model:** Assigned model and role requirements.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** Classification and compatibility rationale.
**Cost:** What this process adds and removes in wall-clock, context bytes,
commands, tokens and steps; distinguish measured evidence from unavailable
values. Name a dated acceptance when adding cost without a removal.
**Nomination provenance:** Operator dispatch, source treatment and clean-room screen.
**Depends on:** Actual prerequisite or none.
**Recommended placement:** Recommendation and overlap evidence.
**Cites (read these sections):** Bounded source selectors.
**Objective:** Observable result.
**Observed gap (dated YYYY-MM-DD):** Evidence of the current behavior.
**Design (scope discipline):** Chosen approach, alternatives and reasons.
**Deliverables:** Bounded changed surfaces.
**Acceptance criteria (all required)**

1. Observable behavior and executable evidence.
2. Write-backs land in affected product docs and
   docs/evidence/WO-NNN/decisions.md; refresh the decisions index.
3. Required gates green and git diff --check clean.

**Evidence gate:** Exact commands and any bounded live demonstration.
**Write-back duty:** Sources and reopening conditions in the order's decisions
file; the ledger is reserved for operator ideation and planning synthesis.
Record corrections the same day as what was misread, meant and changed.
**Non-goals:** This order's scope exclusions; they are not product prohibitions.
**Operator-review assumptions:** Named unresolved choices.
```

A decision uses a fenced JSON entry with `id`, `date`, `dispatch`, `decision`,
`evidence`, `rejected`, `reopenWhen` and `kind`. A correction also supplies
`misread`, `meant` and `changed`. The generator rejects missing dispatch sources
or reopening conditions. See [WO-126's entries](../evidence/WO-126/decisions.md).
