# WO-288 decisions

## WO-288-D001 — Part E is added on the operator's direction after the judgment: the kit's own checks cost less than what they protect

```json
{
  "id": "WO-288-D001",
  "date": "2026-11-16",
  "dispatch": "planning: the 2026-11-16 pass, after receipt 070 was filed",
  "decision": "WO-288 gains Part E on the operator's direction, given after the order was judged: the kit's own checks are to cost less than what they protect. The pass's document gate had been stopped on a memory budget, the planner had reported the cause and set a choice before the operator, and the operator directed that what a pass finds goes into an order and is not handed back, that the operator is asked to do nothing, and that the pass be finished. This decision records that authorization and bounds it. In scope: Part E in the order's Release classification, Cost, Nomination provenance, Objective, fifth observed gap, Design, step 6, Deliverables, criteria E1 to E5 and Non-goals; a midpoint for a complete run, which the queue form asks of an order of more than four parts; the worker count that a fifth part's two readers add; the execution plan's label written with the colon the kit's reader takes; and the suites the Preflight field lacked for the part and for the plan as that reader now finds it. Out of scope: any other order's text, any criterion of Parts A to D, and the order's place in the sequence. The same direction covers one setting: the pass raises memory.gateShare in docs/control/budgets.json from 0.5 to 0.6, the owner's line that the kit's own check names when a task's measured peak outgrows its lane, so that the document gate can judge the tree the pass publishes. Part E is what makes that raise temporary.",
  "evidence": [
    "The operator's messages in ignored intake, paraphrased here: SHA-256 84972ad445b30ba70a2e3779715c0fa5981d2be767fe59a39e6b72c563de8302 (what is found goes into orders; nothing is asked of the operator), f28f3162dc886fac817246bf6a98f2e3f9156747cbd5962e69b371e606fd5e99 and 5786dba623acac3a69954a8c836684490fbcadae362e1847bcf6aa6f679ddc92 (the pass is to be finished)",
    "Measured on 2026-11-16, each by /usr/bin/time -l: node scripts/refute-plan.mjs check peaks at 1,990 MB over 34.5 s at main 38c333ab2 with 69 receipts and at 2,113 MB over 34.6 s on the pass's branch with 70; node scripts/work-orders.mjs index --json peaks at 789 MB over 5.7 s; the document cases of packages/console/dist/test/console-commands.test.js hold one process of 2,082 MB, in the case on a bound resident, and those of board.test.js one of 791 MB",
    "The gate record through readGateChecks: the console-docs task peaked at 3.01, 2.97, 3.04, 3.13 and 3.17 GiB in the pass's five full document gates that reached it, the last run with --serial, and at 2.93 GiB run alone; the host guard stopped it in four of the five on a task budget of 3,221,225,472 bytes; from 2026-11-04 to 2026-11-14 the task peaked at 0.64 to 2.25 GiB",
    "scripts/lib/host-resources.mjs 167 to 207: a task's budget is the host's memory times memory.gateShare over the recorded lane capacity; scripts/test-gate-followups.mjs 961 asserts the kit's message that memory.gateShare must be at least a figure",
    "Not established: where the planning check's memory goes, which was not profiled, and what the 2,082 MB process is, which was not traced; Part E's first step is that profile"
  ],
  "rejected": [
    {
      "option": "A new order for the cost, placed second",
      "reason": "A pass has one judgment, and a new order changes the judged horizon; the kit's route for an operator's direction after the judgment is an amendment of a judged order, and the order for core's own tooling is the one this belongs to."
    },
    {
      "option": "Publishing with the console task stopped",
      "reason": "The document gate would not then have judged the tree, and the same stop would meet the next pass."
    },
    {
      "option": "Leaving it as a candidate for the next pass",
      "reason": "The operator directed otherwise, and each pass adds a receipt to what the check rebuilds."
    }
  ],
  "reopenWhen": "Part E's profile shows the cost elsewhere than the receipts and the console's cases, or a document gate is stopped on the memory budget again before this order lands, which calls for the part to be cut out and run first."
}
```
