# WO-131 decisions

## WO-131-D001

```json
{
  "id": "WO-131-D001",
  "date": "2026-09-13",
  "dispatch": "Operator direction to finish the planning branch regardless of the refutation verdict, captured in ignored intake and attributed by the planning override event. This does not activate WO-131.",
  "decision": "Honor an existing attributed override when admitting later planning receipts. Preserve exact receipt/hash/hold addressing, chronology, immutable history and the requirement to answer each new hold separately. Retain the current independent HOLD and record the operator-authorized override. WO-130 remains merged and closed.",
  "evidence": [
    "docs/control/plan-refutations.jsonl",
    "docs/planning/refutations/2026-09-13-planning-dc998fb93c27e337-012.md",
    "scripts/test-plan-refutation.mjs: the prior implementation rejected later planning despite an existing operator override; the regression reproduced it."
  ],
  "rejected": [
    "NoOp leaves planning blocked despite the existing decision.",
    "Rewrite WO-130 or discard the finding: either would misrepresent the operator's scope or the independent judgment."
  ],
  "reopenWhen": "An override admits a different receipt or hold, applies retroactively, or permits an unanswered new hold through the gate."
}
```

The independent review repeated the absolute-path concern against WO-130.
Receipt 011 already has an operator override for that concern. Receipt
admission nevertheless demanded a change to its held criterion before allowing
the WO-131 planning update. A regression reproduced that failure. The bounded
repair makes admission honor the existing attributed override; it preserves
the historical finding, requires the override to predate the new receipt, and
leaves any new hold subject to its own operator decision. The current review's
hold is retained and the operator's instruction supplies its override.

This enables the next gate-reuse order on the route to the resident runtime and
the independently verified external-change loop. NoOp keeps planning blocked
despite the existing decision. Rewriting WO-130 would misrepresent the operator's
scope. Policy resistance, escalation, shifting the burden to the intervenor and
seeking the wrong goal favor removing this repeated bookkeeping obstacle.
Tragedy of the commons requires counting the failed review attempts, repair and
waiting as process cost. Drift to low performance and rule beating are checked
by preserving the verdict, exact override addresses, timing checks and immutable
history. Success to the successful gives the broken admission rule no special
claim to preservation. Naive Interventionism favors this reversible correction
to the existing reader and writer, with regression evidence, over changing the
reviewed work order or introducing another workflow.

Reopen if an override admits a different receipt or hold, applies retroactively,
or permits an unanswered new hold through the gate. No reduction in measured
process cost is claimed by this closeout.

## WO-131-D002

```json
{
  "id": "WO-131-D002",
  "date": "2026-09-13",
  "dispatch": "Operator correction after two failed external CLI refutations: planning sessions must use fresh background workers, as the completed third attempt did. The source instruction is captured in ignored intake.",
  "decision": "Dispatch one fresh background refuter without inherited conversation, supplying the canonical prompt, closed result schema and shared goal card. The parent remains the sole repository writer and files the frozen judgment through the receipt helper. Bare plan refute prints that prompt; --direct remains an alias. External transports require an explicit operator request, with no automatic fallback. Update the shared role source and regenerate both harnesses.",
  "evidence": [
    "docs/planning/refutations/2026-09-13-planning-dc998fb93c27e337-012.md",
    "First external attempt ended at its budget cap without a judgment; the second stopped at usage collection without filing a verdict. The background worker returned a completed independent judgment.",
    "docs/evidence/WO-131/authority/002",
    "scripts/test-plan-refutation.mjs: default dispatch, scoped JSON schema, full-scope compatibility and explicit-transport checks."
  ],
  "rejected": [
    "NoOp retains the failed external-launch route as the default.",
    "Automatic fallback to another paid CLI would repeat the operator's stated complaint.",
    "Give the worker the planner's conversation or let it file directly: this compromises the intended evidence boundary or sole-writer responsibility."
  ],
  "reopenWhen": "Worker availability or recorded outcomes show that the default prevents completed independent review."
}
```

This removes the observed external-launch detour while preserving independent
judgment and receipt validation. NoOp retains the two failed paths as defaults.
The D001 goal and trap comparison applies: commons cost, escalation and burden
shifting favor the worker; policy resistance and rule beating require an isolated
prompt, unchanged judgment and explicit overrides; outcome standards remain
unchanged. Naive Interventionism favors changing the shared role source and
default route while retaining explicitly requested transports. This is not a
claim that workers cost no tokens or that this single observation establishes
a comparative cost reduction. Reopen if worker availability or recorded outcomes
show that the default prevents completed independent review.

The shared skill behavior requires the skeleton component patch 0.15.10.
Authority edition 001 preserves the initial skill projection; edition 002 pins
the matching version and runtime projection. This planning correction creates
no application tag or Release and leaves WO-130's closed lifecycle intact.
