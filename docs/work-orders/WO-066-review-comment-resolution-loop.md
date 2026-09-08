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
merged (the repair derivation and round limit it reuses); WO-054 merged
(verification of each repaired head before a push); WO-064 merged (the
grant under which the push and the disposition run).
**Recommended placement:** after WO-065; it edits `packages/skeleton/src/`
(the loop continuation) and product 06. A recommendation, not a dependency
token.

**Cites (read these sections):** 06-roadmap.md §Application version pending
— Source-to-deliverable vertical (comment triage; a human-controlled
terminal state); 02-domain-model.md §Independent verification v1;
`docs/work-orders/WO-055-repair-continuation.md` (the derivation);
`docs/work-orders/WO-064-target-publish.md` (the push under the grant).

**Objective:** For each `automated-review` or `ci-failure` item in the
latest `PullRequestStateObserved` event: triage it against the contract and
the diff into `accept` (a repair is warranted), `reject` (the suggestion is
incorrect or stale, with evidence references) or `NeedsHuman`; for an
accepted item derive a repair with WO-055's derivation (surfaces from the
comment's path and line or the failing check's named files, the contract
unchanged, one round per item), dispatch a fresh source-change worker,
verify the repaired head through WO-054 before any push, push under
WO-064's grant, apply the authorized external disposition on the thread
(`pr.thread.resolve`, or a recorded rejection with the evidence, through
the CLI helper under the grant), and re-observe through WO-065 until the
observed state is `resolved`; `human-review` items are never
auto-dispositioned; the loop is an executable-subset continuation that
resumes after an interruption without reprompting.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The predecessor resolves automated review comments; DotLn has no loop
  after a pull request exists.

**Design (scope discipline):**

- Per-item round limit from the order (default one); a comment whose path is
  outside the order's declared surfaces yields `NeedsHuman` rather than a
  widened repair.
- A rejection is a recorded disposition with evidence references, posted
  through the helper as the thread's disposition, never prose narrative.
- The observed `resolved` state comes from a fresh WO-065 observation after
  the disposition, never from the loop's own bookkeeping.
- **Declined alternatives, recorded:** narrative replies; resolving human
  comments; treating a pushed change as resolution.

**Deliverables:** the continuation, the event, fixtures over recorded
observations and doubles, the write-backs below.

**Acceptance criteria (all required)**

1. With doubles over recorded observations: a valid automated comment is
   accepted, repaired, verified (a WO-054 double records a pass before the
   push), pushed, dispositioned, and observed `resolved` from a recorded
   post-disposition observation; a failing check is handled the same way.
2. An incorrect suggestion is rejected with evidence references and its
   disposition recorded; a comment outside the declared surfaces ends in
   `NeedsHuman` with the reason; a human comment is never dispatched; a
   repair whose verification fails is not pushed.
3. A comment arriving after the pull request was created is picked up on
   the next observation; a kill between a push and the re-observation
   resumes the continuation without a second push or a reprompt.
4. A mock that flips a `resolved` bit without a post-disposition observation
   does not count as resolution (a negative fixture).
5. Write-backs land: 06 (the post-PR loop sentence), 02 (the disposition
   event), ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the live loop (part of WO-112); merging; replying in prose.

**Operator-review assumptions**

1. One round per comment is the right default for the first vertical.
