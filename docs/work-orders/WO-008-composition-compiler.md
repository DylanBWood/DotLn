# WO-008 — Composition compiler v1, v0.3.0

**Model:** any capable model.
**Depends on:** WO-003 complete.

**Cites (read these sections):** 06-roadmap.md v0.3.0; 02-domain-model.md
(LoadoutGraph, Active mechanic, Support facet, Link/link group, Identity,
Role, Phenotype, PolarAxis, AuthorityEnvelope); 03-architecture.md
§Composition system (the four compile steps and the nine-level precedence);
01-principles.md Principle 13; 04-interfaces.md (round-trip laws in the
preamble; §RPG view item tooltip anatomy — the visible payoff);
05-pattern-library.md §5S (the Seiri link group being compiled).

**Objective:** LoadoutGraph + support facets + link type-checking +
deterministic precedence + compiled-diff preview (CLI). The Seiri link group
compiles to heterogeneous mechanisms with per-support declared cost, replacing
WO-003's hand-assembled loadout object (explicitly non-normative for exactly
this moment).

**Scope discipline (one step at a time):**
- *Types* for the full LoadoutGraph per the domain model; *compile semantics*
  only for what the Seiri link group and the walking-skeleton scenario
  consume. The rest arrives on contact at the rungs that consume it.
- View equivalence across exactly {code DSL, function table, statechart
  JSON} (the roadmap's minimum set); further views are v0.7.0's.
- PolarAxis ships as types; its evaluation compiles only if the Seiri compile
  consumes it — otherwise policy inputs stay opaque, as in WO-002.
- Presentation is CLI text plus the tooltip rendering; no interactive UI.

**Constraints:** the compiler is pure — zero runtime dependencies, no I/O
(ADR-0002 §3); new `packages/compiler/` in the existing npm workspace; kernel
changes only for gaps this rung exposes, each noted in the result; new
dev-deps only with an ADR-0002 §Amendments note.

**Acceptance criteria (all required)**
1. An incompatible link fails at compile time with the SUPPORT INACTIVE
   diagnosis naming the exact missing capability and concrete corrections
   (03 §Composition step 2) — never "hope the model figures it out".
2. Equipping/unequipping changes the running program, and
   `semanticHash(normalize(compile(view)))` equality proves view equivalence
   across the three views; `decode(encode(x)) = normalize(x)` holds per
   editable view.
3. A constructed conflict resolves by the nine-level precedence with the
   winner visible in the trace; conflicting hard supports reject the
   composition with an explanation; a non-commuting support pair is rejected
   or demands an explicit pipeline (Principle 13).
4. Per-support declared cost is emitted: mechanism type, prompt tokens
   (usually 0), runtime cost, extra episodes.
5. The compiled-diff preview renders as the RPG item tooltip (GRANTS /
   RESTRICTIONS / OBLIGATION / PASSIVE / PULSE / INTERRUPT), not only CLI
   text.
6. The WO-003 scenario re-runs with the compiled Seiri loadout in place of
   the hand-assembled object and produces identical decision traces; any
   delta is itemized and justified in the result.

**Write-back duty:** the pinned LoadoutGraph/support/link payload shapes, the
semanticHash definition, and the normalize contract go into 02-domain-model.md
and 04-interfaces.md in the same change; ledger duty applies.

**Evidence gate:** test output captured; every criterion mapped to a named
test; the semantic-hash equality and the tooltip rendering captured verbatim.

**Non-goals:** drag-and-drop or console UI (v0.7.0/v0.8.0); 5S set bonuses
and the Marquet autonomy computation (v0.8.0); the feedback compiler
(v0.6.0); real workers; saved-build invocation; rating projections.
