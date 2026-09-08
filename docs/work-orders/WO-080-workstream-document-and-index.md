# WO-080 — Workstream document, field and index grouping: a launchpad holds one document per outcome, member orders declare it, and the index groups members with repository, base, phase, verdict, integration state and staleness (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A document convention, one metadata
field and an index projection; no event type. Assigned at activation under
the standing opt-out default.
**Nomination provenance:** WO-034's "workstream as a document plus
projections" item (index half), cut into a bounded child at the operator's
2026-09-08 correction. Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-071 merged (member orders name registered repositories).
**Recommended placement:** after WO-071, under the dated planning deferral;
it edits `scripts/work-orders.mjs` and adds `docs/workstreams/`. A
recommendation, not a dependency token.

**Cites (read these sections):** 12-workstream-application.md §One
workstream across repositories; 02-domain-model.md §Memory and observation
(Workstream); `docs/work-orders/WO-034-cross-repository-workstream-pilot.md`
(the umbrella's wording); `scripts/work-orders.mjs`.

**Objective:** `docs/workstreams/WS-NNN-<slug>.md` carries the outcome,
acceptance contract, member orders (each naming repository and base), the
dependency and compatibility plan and delivery states; an order may declare
`**Workstream:** WS-NNN`; the index groups members and shows repository,
base, phase, verdict and integration state, and marks a member stale when
its declared base is no longer the target's integration base; no control
event or schema changes.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- "Workstream" is vocabulary only; nothing groups orders into an outcome.

**Design (scope discipline):**

- Staleness follows the source-revision guard's shape as a projection.
- **Declined alternatives, recorded:** a `WorkstreamOpened` event (no
  consumer needs outcome-level legality yet).

**Deliverables:** the convention and template, the field, the index
grouping, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture workstream with three member orders across two registered
   repositories renders grouped in the index with every column derived only
   from headers, control segments and Git containment; no physical path
   appears.
2. A member whose declared base is behind the target's integration base is
   shown stale; a green member cannot make a stale sibling green.
3. Write-backs land: 12 (the document convention), 07 (the field), ledger
   entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the board (WO-081); the pilot (WO-082); events.

**Operator-review assumptions**

1. A document plus projections is enough for the first pilot.
