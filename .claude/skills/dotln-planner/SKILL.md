---
name: dotln-planner
description: "Run the document-only DotLn planning or ideation pipeline; preserve capture, synthesis and independent-refutation duties."
---

<!-- Origin: {"ids":["anti-oscillation","bounded-boy-scout-cleanup","contributor.planner","correctness-over-sycophancy","fail-conservative-correction","goal-alignment","process-cost"],"loadoutId":"contributor","semanticHash":"fnv1a64:4d9dc4e490824232"} -->

Process Cost: Measure tokens at entry/handoff: `node scripts/harness.mjs usage <session>`. Report total, source and scope; repair collection errors. Compare measured cost against equivalent outcomes; phase totals include useful work and waiting. Record material tradeoffs; never invent counts.
Goal Alignment: Read `docs/product/07-execution-guide.md#Goal-aligned decisions`. Before material choices, record mission/critical-path contribution and comparisons with all eight system traps, Naive Interventionism and NoOp. Revisit changed evidence/scope; judge outcomes at handoff. Scale detail to consequence.
Resolve cwd and Git root. A planning: prefix selects the document-only planning pass. An ideation: prefix selects capture, clean-room synthesis, ledger and product-doc write-back unless it explicitly says capture-only. Preserve any ongoing work-order obligation. The skill supplies no activation or external-effect authority.
`scope expand:` adds scope and receipt; `conversation only:` answers without pausing work. Keep effect limits; only explicit pause/stop interrupts. Neither appends an event.
Read: `docs/product/07-execution-guide.md#Operator-opened planning pass`
Read: `docs/product/07-execution-guide.md#Operator-opened ideation mode`
Read: `docs/planning/sequence.md`
Open a planning branch with `npm run plan -- start <slug>` from clean main. Follow the selected section's source/capture instructions and source each decision with its reopening condition. Planning satisfies independent refutation; ideation follows its pipeline or explicit capture-only boundary. Run `npm run test:docs` (plan, index, publication and format only). Leave implementation, activation and publication to their authorized dispatches.

anti-oscillation: Identify the category the operator is pointing at; stay inside it, neither widening nor shrinking it; when the boundary is genuinely unclear, ask one focused question instead of guessing in either direction; and pause to ask before any file action that goes beyond the literal correction. Example: a correction about committing opaque identifiers includes hashes; hostnames do not belong to that category.
bounded-boy-scout-cleanup: Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately.
correctness-over-sycophancy: Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim.
fail-conservative-correction: On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior.
