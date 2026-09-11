# WO-124 — Impact surfaces derivation: the implementation order's surfaces and tests are derived from the contract, the repository profile and a worktree snapshot, labeled by origin, with a confidence gate that hands off instead of guessing (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the derivation; the inference slot is a
labeled double in tests. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One pure derivation in the compiler
package plus a snapshot reader in the skeleton. Assigned at activation
under the standing opt-out default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 1): the loop proof required the operator to supply
reviewed surfaces, so one intent could not suffice. Planner-synthesized
draft; the capture's hash is in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-061 merged (the contract it reads); WO-054 merged (the
worktree snapshot shape it reads).
**Recommended placement:** after WO-061; it adds the derivation to the
compiler's story-contract module and a snapshot index to the skeleton. A
recommendation, not a dependency token.

**Cites (read these sections):** 06-roadmap.md §Application version pending
— Source-to-deliverable vertical (the impact map); 03-architecture.md §Ports
(the cartographer stub); `docs/work-orders/WO-061-story-contract-compile.md`;
`docs/work-orders/WO-073-repository-class-and-profile.md` (the profile's
demonstrated architecture and commands).

**Objective:** `deriveSurfaces(contract, profile, snapshotIndex)` returns
`{ surfaces[], tests[], origin per entry, confidence }`: paths named in
the contract's statements resolve against the snapshot (`rule`); the
profile's demonstrated architecture maps requirement nouns to directories
(`rule`); a supplied inference list may add entries (`inferred`, with
rationale); below a declared confidence, the result is `NeedsHuman` with the
candidate list, never a guess; the derived order's surfaces are the union
and its tests are the profile's commands scoped to those surfaces.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No impact map exists; surfaces would be typed by hand.

**Design (scope discipline):**

- Pure over its inputs; the snapshot index is a path list with sizes and
  hashes.
- **Declined alternatives, recorded:** a model choosing surfaces freely;
  widening surfaces on contact.

**Deliverables:** the derivation, the index reader, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. Over fixture contracts and a fixture snapshot, rule-origin surfaces are
   pinned; an inferred entry is labeled with its rationale; a contract with
   no resolvable path yields `NeedsHuman` with candidates.
2. The derived tests are the profile's commands scoped to the surfaces;
   the result is byte-identical across runs with the same inputs.
3. Write-backs land: 06 (the impact-map candidate allocated), 03 §Ports,
   ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** executing anything; a full dependency graph of the target.

**Operator-review assumptions**

1. A hand-off below the confidence gate is the right default for the first
   runs.
