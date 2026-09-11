# WO-095 — Full-set scenario and set tooltip render: the Repo Gardener equips all six pieces in a second deterministic scenario with live and replay identity, and `--compiled-diff --loadout` renders each piece and the set with its bonuses armed or dark (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A second scenario and a render selector.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-037's scenario and tooltip items, cut into a
bounded child at the operator's 2026-09-08 correction. Planner-synthesized
draft. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-094 merged (the bonuses the scenario exercises); WO-032
merged (the board renders through the compiler render; satisfied at
`v0.14.0`).
**Recommended placement:** last of the workshop children; it edits
`packages/skeleton/src/scenario.ts`, the CLI's `--compiled-diff`, and
`render.ts`. It must not edit `packages/console`. A recommendation, not a
dependency token.

**Cites (read these sections):** `packages/skeleton/test/scenario.test.ts`
(the frozen 13-step oracle); 04-interfaces.md §RPG view (tooltip anatomy);
`docs/work-orders/WO-037-five-s-equipment-set.md`.

**Objective:** Beside the frozen 13-step scenario, a full-set scenario
equips all six pieces against the deterministic fakes: candidates with
proposed homes, the integrity check as a fake verifier episode, a repeated
repair yielding a standardization proposal, the reevaluation cadence firing
and cancelled on operator return, the destructive gate refusing; live and
replay produce identical complete Decisions; `--compiled-diff --loadout <id>`
renders each piece's tooltip and the set summary with each bonus armed or
dark and the three view hashes.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- One scenario, one shelf entry; nothing renders a set.

**Design (scope discipline):**

- The 13-step oracle is untouched; the board renders the set through the
  same render without a console edit.

**Deliverables:** the scenario, the selector, the render, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. The full-set scenario runs live and from replay with identical complete
   Decisions and semantic projections, exercises every bonus once, refuses
   the destructive change, and cancels the cadence on operator return; the
   13-step output is unchanged.
2. The render pins each piece's tooltip and the set summary as fixtures.
3. Write-backs land: 06 §Pattern workshop v1 (the compiler-side slice), README
   "What runs today", a dated capability-table row `compiler.five-s-set`,
   ledger entry; publication locks.
4. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** drag-equip authoring; the console.

**Operator-review assumptions**

1. The second scenario stands beside the frozen oracle.
