# WO-081 — Board Workstreams section: the actor board's Work panel renders workstreams over the same data the index groups, as an additive view-model extension with regenerated fixture expectations (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. An additive `uifa-board-v1` extension in
`packages/console`. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** WO-034's board half, cut into a bounded child at
the operator's 2026-09-08 correction. Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-080 merged (the data it renders); WO-032 merged (the
board; satisfied at `v0.14.0`).
**Recommended placement:** after WO-080; it edits `packages/console` only.
A recommendation, not a dependency token.

**Cites (read these sections):** 04-interfaces.md §Plural UI hosts, one
projection contract and §Actor board v0; 13-uifa-roles.md §UIFA showrunner;
`packages/console/README.md`.

**Objective:** The Work panel gains a Workstreams section listing each
workstream's members with repository, base, phase, verdict, integration
state and staleness, from the index's data; the view model's extension is
additive and the recorded fixture expectations regenerate through the
existing command.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The board knows orders, not outcomes.

**Design (scope discipline):**

- One section; no new panel; the text sources the board parses remain the
  pinned index text.
- **Declined alternatives, recorded:** a separate workstream page.

**Deliverables:** the extension, the render, regenerated fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. The board renders the fixture workstream with every column and the stale
   mark; existing panels' fixture expectations are byte-identical apart from
   the new section.
2. The view-model extension validates as additive (a capsule without it
   still renders).
3. Write-backs land: 04 §Actor board v0 (the section), console README,
   ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** console v1; drag-equip authoring; any other panel.

**Operator-review assumptions**

1. The showrunner is the consumer; the section is read-only.
