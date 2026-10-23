# WO-193 decisions

## WO-193-D001 — Stage the future suite until it is registered

```json
{
  "id": "WO-193-D001",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 required current-declaration Preflight integration repair",
  "decision": "Stage only the future request entry in this order's Preflight field until step 4 registers its real suite. The active WO-219 step 17 requires every open order's Preflight tokens to resolve against the current checkout, so a command for a suite this order has yet to implement is not a current executable declaration. Retain step 4 byte for byte: it still creates scripts/test-request.mjs, registers nodeTests(\"request\", ...) and requires both request and runner-fixtures checks. Preflight now explicitly requires adding the request suite's single-suite command when it is registered, before handoff. All acceptance criteria, Cost, design, implementation steps and scope remain unchanged. Bind this necessary metadata repair through plan amend-order because planning continuation compares the complete order bytes; it grants no scope expansion, planning verdict, hold disposition or claim that the request feature exists.",
  "evidence": [
    "WO-219 step 17 requires work-orders index --check to validate every open order against this checkout's actual suites; the root execution of npm run sync refused WO-193: Preflight suite request is not declared.",
    "WO-193 step 4 introduces scripts/test-request.mjs and nodeTests(\"request\", \"scripts/test-request.mjs\", { protects }); its two literal checks are npm test -- --only request and npm test -- --only runner-fixtures. The old Preflight itself called this the suite step 4 registers. Current scripts/test-runner.mjs contains no request declaration.",
    "This edit is confined to the Preflight field. Step 4, criteria 1–10, Cost, Objective, Non-goals and every other order byte are preserved. The new Preflight sentence obliges the future executor to add the suite's explicit command after registration; it does not excuse either step-4 check.",
    "scripts/lib/plan-subject.mjs planOrderHash covers title, objective, criteria, non-goals and optional Cost, but scripts/lib/plan-continuation.mjs executionAmendmentSource preserves the entire order except the release label and checkPlanContinuation rejects changed existing bytes without a matched amendment. Preflight metadata is not a continuation exception.",
    "WO-216-D012 used the same plan amend-order route for a necessary Preflight normalization with unchanged criteria and scope. Product 07, the continuing-work gate paragraph, requires a decision owned by the affected order and an amendment bound to the latest judged horizon. Receipt 2026-10-22-planning-5bb6c2ac729c3e47-052 includes WO-193. At preparation, WO-193 had no decisions.md or prior PlanExecutionAmended row."
  ],
  "rejected": [
    {
      "option": "Skip future suites, grandfather WO-193, or validate only activated orders in the checker",
      "reason": "WO-219 step 17 requires the same current declaration check for every open order. An exception would weaken that implemented requirement."
    },
    {
      "option": "Register an empty request suite now or implement WO-193's request feature during WO-219",
      "reason": "An empty declaration would invent coverage. The real request implementation and its tests are expressly WO-193 step 4 work."
    },
    {
      "option": "Delete the request testing obligation from WO-193",
      "reason": "The repair only stages the current metadata inventory. Step 4 keeps both exact checks and the Preflight field now requires reinserting the real suite command upon registration."
    },
    {
      "option": "Treat the edit as unbound metadata, mutate the historical receipt, or add a broad Preflight normalization exception",
      "reason": "The current continuation gate binds complete order bytes and established precedent uses a bounded amendment. No parser or historical-judgment changes are needed."
    }
  ],
  "reopenWhen": "WO-193 step 4 registers request: add its exact single-suite command to Preflight and run both required checks before handoff. Reopen sooner if any other undeclared open-order token is encountered or the amendment would alter anything outside this bounded metadata repair."
}
```
