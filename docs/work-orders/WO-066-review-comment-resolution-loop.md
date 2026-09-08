# WO-066 — Review-comment resolution loop: each unresolved automated review comment or failing check derives a bounded repair, runs through a fresh worker, is pushed under the grant and re-observed, until every comment is resolved or recorded as needing a human (version assigned at activation)

**Model:** any capable model; the live episodes are operator-run. State the
model and effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One continuation over existing
primitives; one terminal event type. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H, the post-PR loop the audit omitted and the operator's parity checklist
names last), cut as a bounded order at the operator's same-day correction.
Planner-synthesized draft; captures and hashes in the ledger section of that
date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-065 merged (the observed comments and checks); WO-055
merged (the repair derivation and round limit it reuses).
**Recommended placement:** after WO-065; it edits `packages/skeleton/src/`
(the loop continuation) and product 06. A recommendation, not a dependency
token.

**Cites (read these sections):** 06-roadmap.md §Application version pending
— Source-to-deliverable vertical (comment triage; a human-controlled
terminal state); 02-domain-model.md §Independent verification v1;
`docs/work-orders/WO-055-repair-continuation.md` (the derivation);
`docs/work-orders/WO-064-target-publish.md` (the push under the grant).

**Objective:** For each `automated-review` or `ci-failure` item in the
latest `PullRequestStateObserved` event, derive a repair WorkOrder with
WO-055's derivation (surfaces from the comment's path and line or the
failing check's named files, the contract unchanged, one round per item),
dispatch a fresh source-change worker, push under WO-064's grant, re-observe
through WO-065, and continue until every item is `resolved` or the loop
appends `NeedsHuman` naming the item and reason; `human-review` items are
never auto-resolved; the loop is an executable-subset continuation.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The predecessor resolves automated review comments; DotLn has no loop
  after a pull request exists.

**Design (scope discipline):**

- Per-item round limit from the order (default one); a comment whose path is
  outside the order's declared surfaces yields `NeedsHuman` rather than a
  widened repair.
- **Declined alternatives, recorded:** replying to comments in prose (no
  outward narrative; resolution is the pushed change); resolving human
  comments.

**Deliverables:** the continuation, the event, fixtures over recorded
observations and doubles, the write-backs below.

**Acceptance criteria (all required)**

1. With doubles, two automated comments and one failing check are resolved
   in one round each, with each repair touching only the item's surfaces and
   each push recorded; the loop ends with no unresolved automated item.
2. A comment outside the declared surfaces ends in `NeedsHuman` with the
   reason; a human comment is never dispatched.
3. A kill between a push and the re-observation resumes the continuation
   without a second push.
4. Write-backs land: 06 (the post-PR loop sentence), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the live loop (part of WO-112); merging; replying in prose.

**Operator-review assumptions**

1. One round per comment is the right default for the first vertical.
