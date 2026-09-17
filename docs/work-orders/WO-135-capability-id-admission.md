# WO-135 — Capability-id admission: a dated addition may introduce a capability id that a judged order's own criteria already name, so filing an order no longer mandates an edit the plan gate refuses (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor any; verifier any; reviewer any.
**Release classification:** patch. One planning helper and its fixtures
change; no contract, schema, predicate, envelope or product document
changes. Assigned at activation under the standing opt-out default.
**Cost:** removes one purpose-built planning pass, one refutation dispatch
and one final-review diagnosis per capability-introducing order; it has cost
two of those in two days. It adds one branch in an existing helper and
fixtures to an existing suite, and no recurring step, check, receipt, hook,
key or ritual.

**Nomination provenance:** candidate 1 of
[the planning map](../planning/work-order-map.md#candidates--release-close-and-planning-dispatch-defects-recorded-2026-09-16),
recorded 2026-09-16 from the `runtime.resident` admission pass, whose stated
reopening condition was "the next order whose criteria name an unjudged id".
That order arrived one day later: the
[2026-09-17 `worker.source-change` admission pass](../lineage/idea-ledger.md)
files this one.

**Depends on:** nothing. It changes plan machinery already on `main`.

**Recommended placement:** before the next order whose write-back duty names
a capability id. A recommendation, not a dependency token.

**Cites (read these sections):** `scripts/lib/plan-continuation.mjs`
`reassessments` and `checkPlanContinuation`; `scripts/lib/plan-subject.mjs`
`buildPlanSubject` (the `standard.capabilities` and `orders` inputs);
`scripts/lib/plan-receipts.mjs` `checkPlanGate`;
`docs/final-reviews/WO-068/FINAL-001.md` §B1;
`docs/final-reviews/WO-052/FINAL-001.md` §B1;
`docs/evidence/WO-052/decisions.md` §WO-052-D005;
`docs/planning/capability-table.md` §Reading the table.

**Objective:** an appended `## WO-NNN dated addition (YYYY-MM-DD)` section may
introduce a capability id when, and only when, `WO-NNN` is an order in the
judged planning subject and that order's own judged criteria name the id. Every
other new id stays refused exactly as today, because it is a planning claim the
pass never judged.

**Observed gap (dated 2026-09-17, `main` at `6029a4c`):**

- `plan-continuation.mjs:94` refuses any capability id absent from the judged
  subject's `standard.capabilities`. A work order whose criteria require a
  capability row therefore mandates an edit the repository rejects by design:
  deleting the row fails the criterion, keeping it fails the gate, and no
  executor repair clears it.
- It has now happened twice in two consecutive capability-introducing orders.
  WO-068 recorded it as B1 and nominated two fixes; WO-052 hit the identical
  wall one day later. Each occurrence cost a final-review diagnosis, a
  purpose-built single-claim planning pass and a refutation dispatch, and each
  left a merge blocked on an operator chore.
- The id is not in fact unjudged. The filing order's full text — title,
  objective, criteria and non-goals — is inside the judged subject and its
  hash; the pass that judged the order judged the sentence that names the
  capability. Only the capability table's own row is new.

**Design (scope discipline):**

- Extend `reassessments` (or the function that replaces it) with one admitted
  form beside the existing dated reassessment: a dated addition whose ids are
  each named in the judged criteria text of the order the heading names. Reuse
  the subject the checker already holds; read no new file and add no new input
  to the subject hash.
- The heading's `WO-NNN` must be an order in the judged subject, the date must
  be valid as it is today, and every other rule on the appended region — no
  stray headings, nonempty observation cell, appended-only — is unchanged.
- An id no judged order's criteria name is refused with the existing message,
  because that is a genuine planning claim.
- **Declined alternatives, recorded:** admitting new ids through a planning
  pass per filing order (the status quo, one dispatch per order); making the
  unsatisfiable order unfilable by refusing at filing time, which moves the
  same chore earlier without removing it; widening the rule to any id named
  anywhere in an order, which would admit a non-goal or a cited example.

**Deliverables:** the admitted dated-addition form; its fixtures; the
candidate-1 disposition in the planning map.

**Acceptance criteria (all required)**

1. A dated addition whose id is named in the judged criteria of the order its
   heading names is admitted, and the receipt chain stays valid across it.
2. A dated addition naming an id that no judged order's criteria mention is
   refused, with the current message and no weakening of it.
3. A dated addition whose heading names an order absent from the judged subject
   is refused, as is one whose date or table shape breaks an existing rule.
4. The dated-reassessment form keeps its behaviour for already-known ids, and
   receipts 001 to 016 remain admissible with their judged subjects unchanged.
5. Replay fixtures over the two real cases: WO-068's `runtime.resident` section
   and WO-052's `worker.source-change` section are each admitted against the
   receipt that preceded their purpose-built pass, and each is refused when its
   filing order's criteria are stripped of the id.
6. `npm run test:docs` green, including `plan` and `plan-refutation-current`;
   `npm test` green; `git diff --check` clean; no new dependency; no capability
   id introduced by this order.

**Evidence gate:** the fixture transcripts; `npm test` once at final review,
recorded as the reviewer product-gate row.

**Write-back duty:** sources and reopening conditions in the order's decisions
record; dispose candidate 1 in the planning map. Introduce no capability id:
this order adds no capability.

**Non-goals:** changing receipt format, subject composition or the receipt
chain; changing how a genuinely new capability claim is judged; retroactively
editing filed receipts or the two purpose-built passes, which stay as the
record of what it cost; any capability-level promotion; any document
reorganization.

**Operator-review assumptions**

1. An id named in a judged order's criteria is judged, so admitting its table
   row is bookkeeping rather than a new planning claim. A reviewer may require
   that the rule read the criteria text only, and not the objective or the
   cited sections.
