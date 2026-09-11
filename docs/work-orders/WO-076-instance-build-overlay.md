# WO-076 — Instance build overlay: a fork's `build/overlay.json` composes over the kit's Contributor build to replace the identity, unequip units, narrow the envelope, widen it only by provenance-bearing grants, or declare no build (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. An overlay schema and its composition in
`harness emit`; no kit law change. Assigned at activation under the standing
opt-out default.
**Nomination provenance:** WO-033's "kit, instance, and the instance's
build overlay" item, cut into a bounded child at the operator's 2026-09-08
correction; the vision's rule that the platform prescribes no loadout.
Planner-synthesized draft. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-075 merged (the kit build the overlay composes over);
WO-042 merged (widening within the fork's posture is a provenance-bearing
grant).
**Recommended placement:** after WO-075; it edits `scripts/harness.mjs`,
`scripts/lib/harness.mjs` and the export's client README. A recommendation,
not a dependency token.

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
(the overlay item); 00-vision.md §Common substrate, local doctrine;
ADR-0006 Decisions 1 and 7 and §Amendments; 02-domain-model.md
§LoadoutGraph v1 payload contract (grants after WO-042);
`packages/compiler/src/harness.ts`.

**Objective:** `build/overlay.json` (instance-owned, never in the manifest)
declares the fork's registered repositories, classes, extra units, envelope
narrowings, grants with `operator` or `host-policy` provenance, an identity
replacement, unequipped units, or `build: none`; `harness emit` composes it
over the kit's Contributor build to produce the fork's own `.claude/`, and
`harness check` verifies the result; under `build: none` the emit produces
only the hand-written floor.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The Contributor build is starter content, not kit law, and nothing lets a
  fork own its build without editing kit files.

**Design (scope discipline):**

- Composition is deterministic and recorded in the manifest with the
  overlay's hash; widening beyond the kit build's base is only a grant
  under WO-042's floor.
- **Declined alternatives, recorded:** editing kit files in the fork (breaks
  update); an overlay that can bypass the floor.

**Deliverables:** the schema, the composition, fixtures, the client README
section, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture overlay that narrows the envelope re-emits to a bundle that
   differs from the kit's only where the overlay says (a recorded diff).
2. A second overlay that replaces the identity and unequips two units
   re-emits to a bundle carrying neither; a third that declares
   `build: none` re-emits to the floor alone with `harness check` passing.
3. An overlay that widens without a grant refuses with `AUTHORITY WIDENING`;
   with a grant it emits and the manifest records the provenance.
4. Write-backs land: the client README's first section, ADR-0006
   §Amendments (a dated note), 10 §Separate version axes (the overlay
   schema), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** update (WO-077); registration semantics (WO-071).

**Operator-review assumptions**

1. `host-policy` provenance is the fork's own harness posture; the reviewer
   checks that no overlay path bypasses the floor.
