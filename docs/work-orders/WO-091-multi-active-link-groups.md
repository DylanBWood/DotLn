# WO-091 — Multi-active link groups: one link group may hold several active mechanics sharing linked supports, with per-active emissions, the commutativity rule per active, a visible six-link budget, and every existing hash unchanged (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Compiler lowering capability; existing
programs keep their hashes. Assigned at activation under the standing
opt-out default.
**Nomination provenance:** WO-037's first design item, cut into a bounded
child at the operator's 2026-09-08 correction; the ledger's "Shared
supports across multiple actives". Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-008 merged (compiler v1; satisfied at `v0.4.0`); WO-016
merged (one reactor; satisfied at `v0.3.6`); WO-023 merged (the Entropy
Reducer; satisfied at `v0.5.0`); WO-029 merged (artifact identity;
satisfied at `v0.9.0`). A dated planning deferral until WO-053 closes or
the operator waives it.
**Recommended placement:** first of the workshop children; it edits
`packages/compiler/src/compile.ts` and its fixtures. A recommendation, not
a dependency token.

**Cites (read these sections):** 02-domain-model.md §LoadoutGraph v1
payload contract ("exactly one active mechanic, at most one participating
link group"); 03-architecture.md §Composition system (precedence,
commutativity, pipelines); `docs/work-orders/WO-037-five-s-equipment-set.md`
(the umbrella's wording); `packages/compiler/src/compile.ts`.

**Objective:** Extend lowering so one link group may hold several actives
sharing linked supports: each active keeps its own WorkOrder seed, envelope
and claims; a shared support's emissions apply per active; precedence and
commutativity apply per active; a non-commuting pair still needs an explicit
pipeline; a group beyond six links emits a diagnostic naming the
decomposition question; single-active programs normalize and hash exactly
as before.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Compiler v1 lowers one active and one group; the 5S set needs several.

**Design (scope discipline):**

- The floor from WO-042 applies per active.
- **Declined alternatives, recorded:** a new schema version.

**Deliverables:** the lowering, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. Seiri keeps `fnv1a64:9ca8d0229c6bd8db`, the Entropy Reducer
   `fnv1a64:c5ddbca75f1c4cee`, the Contributor its pinned hash; the frozen
   oracle and the WO-029 fixture are byte-identical.
2. A fixture group with three actives sharing two supports compiles with
   per-active emissions, refuses a non-commuting pair without a pipeline,
   accepts it with one, and emits the over-budget diagnostic at seven links.
3. Write-backs land: 02 §LoadoutGraph v1 payload contract (the multi-active
   rule), 10 §Separate version axes, ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** sets (WO-092); the 5S mechanics (WO-093).

**Operator-review assumptions**

1. The six-link budget stays a visible budget, not a cap.
