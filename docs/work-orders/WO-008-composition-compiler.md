# WO-008 — Composition compiler v1, v0.4.0

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.4.0` minor — adds the backwards-compatible
composition compiler and its inspectable projections.
**Depends on:** WO-003 complete.

**Cites (read these sections):** 06-roadmap.md v0.4.0; 02-domain-model.md
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
  JSON} (the roadmap's minimum set); further views are v0.8.0's.
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

**Non-goals:** drag-and-drop or console UI (v0.8.0/v0.9.0); 5S set bonuses
and the Marquet autonomy computation (v0.9.0); the feedback compiler
(v0.7.0); real workers; saved-build invocation; rating projections.

## Implementation evidence receipt — 2026-09-03

**Implementation subject:** `packages/compiler/` now provides the pure
`@dotln/compiler` v0.1.0 package with the full public LoadoutGraph type boundary,
canonical normalization, three editable-view codecs, deterministic semantic
hashing, four-step compilation, structured diagnostics, conflict traces,
heterogeneous emissions, per-support costs, and tooltip rendering. Compiler v1
deliberately lowers one active mechanic, at most one participating link group,
and at most one explicit pipeline in that group. It rejects wildcard authority
patterns, unknown precedence layers, non-finite JSON numbers, multiplier
overflow, multiple participating groups or pipelines, and undeclared
non-commuting order rather than inventing semantics.

The skeleton now stores the complete Seiri `LoadoutGraph` and obtains its
WorkOrder, authority envelope, cadence and cancellation identifiers,
statechart guard, and verification subject from the compiled program. Equipping
or unequipping a support therefore changes the program the live reactor
consumes. `@dotln/skeleton` advances from 0.3.2 to 0.4.0 and adds only the local
`@dotln/compiler` 0.1.0 dependency. There are no new external runtime or
development dependencies, and no kernel source or `@dotln/kernel` 0.2.0 version
change.

**Acceptance map:**

1. `WO-008 AC1 incompatible link emits exact SUPPORT INACTIVE diagnosis,
   missing capability, and concrete corrections` pins the complete diagnostic
   and rendered correction text; `WO-008 AC1 supplying the named capability
   activates the same link` proves the correction is executable.
2. `WO-008 AC2 code DSL round-trip equals normalize`, `function table
   round-trip equals normalize`, and `statechart JSON round-trip equals
   normalize` pin all three codec laws. The normalization, equal-hash,
   semantic-edit, equip/unequip, live-reactor, and compiled-cadence tests prove
   canonical equivalence is neither constant nor detached from execution.
3. `WO-008 AC3 a constructed nine-way conflict exposes the safety winner and
   full precedence trace` and `every adjacent precedence pair selects the
   higher level` pin the entire ordering independently of the implementation.
   Named tests also prove effective authority reaches the kernel, hard and
   declared conflicts reject, an explicit pipeline governs transforms,
   commuting permutations normalize identically, and wildcard claims,
   pipeline-id-controlled inter-pipeline order, unknown layers, undeclared
   cross-group order, and unordered non-commuting pairs reject.
4. `WO-008 AC4 every compiled Seiri support emits exact mechanism,
   prompt-token, runtime, and extra-episode costs` pins every support; `WO-008
   AC4 Seiri lowers to heterogeneous mechanism types` prevents a flattened
   mechanism fiction.
5. `WO-008 AC5 equipped diff renders the exact Seiri / Sort / 整理 RPG item
   tooltip`, `unequip preview is a real compiled reversal`, and the two exact
   CLI tests pin the visible payoff and additive section order.
6. `WO-008 AC6 the running scenario consumes the compiled Seiri loadout` pins
   the compiled Seiri program's shape (denied effects, schedule id,
   verification subject, five-support manifest) and binds the reactor's
   `compileWorkOrder` to the compiled program; it does not run the scenario.
   The running integration is proved by `WO-008 AC6 compiled Seiri matches the
   frozen WO-003 decision traces exactly`, which compares every live trace to
   the pre-edit fixture, together with the two AC2 tests that fail when the
   compiled cadence identifiers or the equipped support set are severed.

**Baseline and itemized delta:** The pre-edit baseline was commit `0344439`.
Its root `npm test` passed 110/110 before implementation. Before replacing the
provisional loadout, all 21 decision traces were captured in
`packages/skeleton/fixtures/wo003-decision-traces.json`; the fixture file is
`sha256:ec53d1c841de5486cf656694228c83f67e8549993d0ac63c187d10728707a173`
and its parsed compact JSON is
`sha256:ef9789a1708c9098f9847636a6b6906fa3f1dbd11f14cc65ea31024b86e21205`.
The compiled run produces the same compact trace digest and all 21 values pass
deep equality, so the required decision-trace delta is zero.

The event timeline remains 21 entries in the same order, the WorkOrder remains
semantically deep-equal to the pre-compiler object, and the visible default CLI
remains 26 lines and 888 bytes. Its digest intentionally changes from
`sha256:25a406b0d441660bd71d29b138c8594db100b6f4e0ee55708bf88a294a63befe`
to `sha256:88e66d23edfcf14b7d0fc783f43552eaa75332efebc458f8ecbbcf9191b929ff`
only because the required banner moves from v0.3.2 to v0.4.0: substituting the
old version in current output reconstructs the baseline digest exactly.

Two serialized internal surfaces intentionally change. Full Decision JSON moves
from
`sha256:fffb59601712588926bcb762280344cfb7fd1d423c62a098ec9f8e23971715e9`
to `sha256:262000b2104fe1d0c55b807ca62ebba1ef4b0fe5bc30249e27a251eafd65626c`;
the JSONL log grows from 8,805 to 17,661 bytes and now hashes to
`sha256:9827759ee0a126e8c6f1aa14d2e3abc10cef23d9702e0b0e570157179af64829`.
That delta is the intended replacement itself: `LoadoutEquipped` and subsequent
runtime state carry the complete typed graph instead of the four-field
placeholder, and compiled objects use canonical property ordering. No event
count, type, or order, decision trace, WorkOrder meaning, candidate, refusal,
verification result, or glyph changes beyond those itemized payload-shape and
property-order differences.

**View-equivalence capture (`npm run skeleton -- --compiled-diff`):**

```text
code-dsl=fnv1a64:9ca8d0229c6bd8db
function-table=fnv1a64:9ca8d0229c6bd8db
statechart-json=fnv1a64:9ca8d0229c6bd8db
views=equivalent
```

**Compiled tooltip capture (same invocation):**

```text
Seiri / Sort / 整理
The Evidence-Bound Sort — COMPILED DIFF

GRANTS
+ Inventory every fixture path
+ Classify every fixture path
+ Analyze references
+ Propose deletion candidates

RESTRICTIONS
+ Do not mutate repository contents
+ Deletion remains operator-owned
+ Inspect only the bounded fixture repository

OBLIGATION
+ Attach inventory, classification, and reference evidence to every candidate
+ Independently verify proposed candidates

PASSIVE
+ Active only while the operator is absent

PULSE
+ Re-evaluate every 20 virtual minutes

INTERRUPT
+ Stop on operator return; queued pulses become a traced NoOp

COST
+ seiri.absence-cadence — statechart-gate; prompt=0 tokens; runtime=2 predicate-evaluations-per-pulse; episodes=0
+ seiri.evidence-capture — evidence-schema; prompt=0 tokens; runtime=1 schema-validations-per-result; episodes=0
+ seiri.independent-verification — verifier-episode; prompt=0 tokens; runtime=1 verifier-dispatches; episodes=1
+ seiri.read-only — permission-guard; prompt=0 tokens; runtime=1 guard-checks-per-effect; episodes=0
+ seiri.repo-scope — work-order; prompt=0 tokens; runtime=0 operations; episodes=0

SEMANTIC HASH
  before=none
  after=fnv1a64:9ca8d0229c6bd8db
```

**Passing gates:** The final root `npm test` passes 154 tests with zero failures
after formatting, publication, backup, resume, checkpoint, worktree, and release
fixture suites pass. The focused compiler plus skeleton run passes 73/73.
`npm run publication:check` reports 167/167 indexed product headings, three
identical claim links per voice, 27 current everyday-user source sections, and
42 current software-engineer source sections. The live
`npm run release -- check-surfaces` preflight observes the v0.4.0 release block,
latest published v0.3.6, compiler 0.1.0, unchanged kernel 0.2.0, changed skeleton
0.4.0, and a valid GitHub-body profile. `npm ls --all` is clean and
`git diff --check` is clean.

**Write-backs and limits:** The pinned graph, link, pipeline, and support shapes
and bounded v1 lowering contract are in `02-domain-model.md`; finite canonical
normalization, hash input, algorithm identifier, and view law are in
`04-interfaces.md`; the append-only lineage receipt records why these choices
were made. PolarAxis remains typed and preserved but unevaluated. Ambient-effect
execution, multiple active mechanics, multiple participating groups or
pipelines, wildcard authority lowering, saved builds, interactive UI, and the
other stated non-goals remain deferred. Independent verification and final
review are still required before a release claim.

## Final-review evidence corrections — 2026-09-03

FINAL-001 corrected one sentence of the receipt above so that its evidence
claims are reproducible from the delivered tree (VER-001 F1): acceptance-map
item 6 no longer says that `WO-008 AC6 the running scenario consumes the
compiled Seiri loadout` "proves the integration boundary". That test never
calls `runScenario`; its first assertion compares `compileWorkOrder(loadout)`
with `compileLoadoutProgram(loadout).workOrder`, and the running integration
is proved by the frozen-trace AC6 test and the two AC2 tests the item now
names. The final review's own mutation drill showed the compared assertion is
not dead: a reactor mutation that changes the emitted WorkOrder objective is
caught by that test and by no other (FINAL-001 §Mutation re-drill). No
acceptance criterion, captured digest, or code byte changed under this
correction.
