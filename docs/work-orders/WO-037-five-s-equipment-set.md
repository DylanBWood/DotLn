# WO-037 — Pattern workshop, compiler side: the 5S equipment set compiles as a multi-active link group with set bonuses (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Umbrella record (2026-09-08):** superseded whole by bounded children at the operator's same-day correction of the critical-path planning pass; not activatable. Its obligations are carried by WO-091 (multi-active link groups), WO-092 (the `sets` graph extension), WO-093 (the 5S mechanics as data), WO-094 (set bonuses lowered) and WO-095 (the full-set scenario and set tooltip render). The text below is preserved as the record the children cite; nothing in it grants activation.

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds compiler and skeleton capability
(multi-active link groups, set definitions, set-bonus lowering, a second
deterministic scenario) while keeping every existing compiled program's
semantic hash and the frozen WO-003 trace oracle byte-identical. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-06 planning pass, from the operator's
statement that "the real meat & potatoes of the vision starts becoming
sharper" and the roadmap's Pattern workshop v1 rung, which the pass names as
the wave after the visible loop. The founding corpus supplies the shape:
5S as a slotted equipment set, set bonuses that compile to real mechanics,
shared supports across several actives under one policy boundary, the
six-link composition budget, and Standardize as token economics (ledger
§Chat 004, §Chat 006, §Chat 002). Planner-synthesized draft; the unedited
dispatch is preserved locally in
`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`. Opaque
identifier, not a priority. The clean-room screen found no stop condition.
**Depends on:** WO-008 merged (compiler v1; satisfied at `v0.4.0`); WO-016
merged (one reactor for live and replay; satisfied at `v0.3.6`); WO-023
merged (Shine and Standardize compiled inside the Entropy Reducer; satisfied
at `v0.5.0`); WO-029 merged (artifact identity per component; satisfied at
`v0.9.0`); WO-011 merged (the feedback contract beside the loadout contract;
satisfied at `v0.13.0`).
**Recommended placement:** wave 4 in the redirected horizon, beside the
migration's second batch, after WO-032 merges so the board renders the set
through the compiler's tooltip render without a console change. Its primary
surfaces (`packages/compiler`, the skeleton's loadouts, scenario, and
reactor) are disjoint from WO-033, WO-034, WO-035, and WO-040's feedback
module; it must not edit `packages/console`. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-091",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-091.",
    "by": "WO-091"
  },
  {
    "workOrderId": "WO-092",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-092.",
    "by": "WO-092"
  },
  {
    "workOrderId": "WO-093",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-093.",
    "by": "WO-093"
  },
  {
    "workOrderId": "WO-094",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-094.",
    "by": "WO-094"
  },
  {
    "workOrderId": "WO-095",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-095.",
    "by": "WO-095"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 05-pattern-library.md §Founding pattern
library (deeply implement a small number of patterns; a pattern is not a
prompt snippet) and §5S / 6S — the maintenance organism; 02-domain-model.md
§Identity and composition (LoadoutGraph as a graph; link groups; the six-link
budget) and §LoadoutGraph v1 payload contract ("Compiler v1 lowers exactly
one active mechanic, at most one participating link group"; additive
normalization rules); 03-architecture.md §Composition system (the nine-level
precedence; commutativity; explicit pipelines) and §Pinned artifact identity;
04-interfaces.md §RPG / Path-of-Exile view (set bonuses compile to real
mechanics; item tooltip anatomy; saved builds as the default invocation path)
and §Editable-view v1 normalization and semantic hash; 06-roadmap.md
§Application version pending — Pattern workshop v1; 10-ir-compatibility.md
§Separate version axes and §Invariants; 01-principles.md Principles 1, 11,
13, and 16; the ledger entries "5S as a slotted equipment set", "Set bonuses
compile to real mechanics", "Shared supports across multiple actives",
"Six-link as default composition budget", "Standardize as token economics",
and "Vaal skill = evidence-gated authority escalation";
`packages/compiler/src/compile.ts`, `seiri.ts`, `normalize.ts`, `render.ts`;
`packages/skeleton/src/reactor.ts`, `scenario.ts`,
`loadouts/entropy-reducer.ts`; `corpus/mutation/findings-WO-108.md` (compiler
survivors to keep in view).

**Objective:** Make the founding pattern executable as a set: the five S
actives and Safety compile in one link group with shared supports;
piece-count set bonuses compile to statechart gates, evidence obligations,
verifier episodes, and cadences that visibly arm and go dark with the real
state machine; the Repo Gardener equips the full set in a second
deterministic skeleton scenario with live and replay identity; every piece
and the set itself render as item tooltips with declared cost and semantic
hashes; and every existing compiled program keeps its exact hash.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- Compiler v1 lowers exactly one active mechanic and at most one
  participating link group (02 §LoadoutGraph v1). The founding 5S set needs
  several actives sharing supports under one policy boundary, which the
  ledger's "Shared supports across multiple actives" entry names as the
  middle ground between per-agent duplication and global rules.
- Of the six S, only Seiri (the walking skeleton) and Seisō with a linked
  Seiketsu (inside the Entropy Reducer) are compiled; Seiton, Shitsuke, and
  Safety exist as prose in 05. Set bonuses are "meant to compile" (04) and
  "planned" (05); no set definition, bonus emission, or arming fixture
  exists.
- The tooltip renders one item's grants, restrictions, obligation, passive,
  pulse, interrupt, and cost; nothing renders a set or shows a bonus as armed
  or dark.
- The differentiated thesis, "the shelf compiles", has exactly one shelf
  entry running; the console the phase-two horizon builds would have one
  build to show.

**Design (scope discipline):**

- **Multi-active link groups.** Extend compiler lowering so one link group
  may hold several active mechanics that share linked supports. Each active
  keeps its own WorkOrder seed, envelope, and claims; a shared support's
  emissions apply per active; the nine-level precedence and the commutativity
  rule apply per active exactly as today, and a non-commuting pair still
  requires an explicit pipeline or rejects. The six-link budget stays a
  visible budget, not a hard cap; a group beyond it emits a diagnostic naming
  the decomposition question. Programs that contain one active normalize and
  hash exactly as before: the Seiri fixture keeps `fnv1a64:9ca8d0229c6bd8db`
  and the Entropy Reducer keeps `fnv1a64:c5ddbca75f1c4cee`.
- **Set definitions.** Add an optional, additive `sets` collection to the
  graph: a set names its member active ids and a list of bonuses, each with a
  piece count and one emission of an existing kind (`evidence-schema`,
  `statechart-gate`, `verifier-episode`, `cadence`, `permission-guard`,
  `work-order`). Absent `sets` normalizes to empty, so schema version 1
  remains valid and every existing view round-trips unchanged; the three
  editable views encode and decode sets. A bonus is armed when at least its
  piece count of members is equipped in the group; the compiled program's
  inspection data lists each bonus as armed or dark with the count that would
  arm it.
- **The 5S set as data.** Seiton / Set in Order, Seisō / Shine, Seiketsu /
  Standardize, Shitsuke / Sustain, and Safety join Seiri as typed active
  mechanics with their canonical term, translation, kanji, secondary RPG
  title, tags, WorkOrder seed, envelope, and tooltip collections, following
  05 §5S / 6S: Shine makes cleaning double as inspection, Standardize turns a
  recurring repair into a proposed test, rule, hook, or script, Sustain is the
  cadence, Safety is the parallel guard region. Shine and Standardize reuse
  the Entropy Reducer's compiled definitions where their semantics coincide
  and record any divergence rather than forking silently.
- **Set bonuses, lowered.** Two of five: every Sort candidate carries a
  proposed canonical home (evidence-schema requirement). Three of five: every
  cleanup invokes an integrity check (verifier episode). Four of five: a
  recurring repair proposes a standardization (an evidence-schema field and a
  work-order obligation; no ProductSuggestion is filed by the compiler). Five
  of five: the cycle schedules its own bounded reevaluation (a cadence
  emission using the evaluable subset). Six pieces, Safety equipped: a
  destructive change is legal only with isolation, evidence, independent
  verification, and explicit approval (a permission guard plus statechart
  gate); the Repo Gardener's base rank still holds no deletion authority, so
  the gate compiles and refuses in the fixture, and evidence-gated escalation
  stays a preserved candidate.
- **Second skeleton scenario.** Beside the frozen 13-step scenario, a
  full-set scenario equips all six pieces on the Repo Gardener against the
  deterministic fakes: the fake executor returns candidates with proposed
  homes, the integrity check runs as a fake verifier episode, a repeated
  repair yields a standardization proposal in evidence, the reevaluation
  cadence fires and is cancelled on operator return, and the destructive
  gate refuses. Live and replay produce identical complete Decisions through
  the one shared reactor; the 13-step oracle is untouched.
- **Tooltips and the board.** `npm run skeleton -- --compiled-diff` gains a
  `--loadout <id>` selector; each piece renders its tooltip, and the set
  renders a summary with each bonus armed or dark and the three view hashes.
  The board (WO-032) renders shipped loadouts through the same compiler
  render, so the set appears without a console edit; if a board change proves
  necessary it is a separate small follow-on.
- **Declined alternatives, recorded:** a new schema version for the graph
  (an additive optional collection suffices under 10's invariants); compiling
  the drag-equip authoring surface here (console v1); granting real deletion
  authority to reach the sixth bonus (the gate is the deliverable, the
  authority is not).

**Deliverables:** the multi-active lowering; the `sets` graph extension and
its three view codecs; the six 5S definitions; the bonus emissions and arming
inspection; the second scenario and its fixtures; the `--loadout` tooltip
render; the write-backs below.

**Acceptance criteria (all required)**

1. The Seiri and Entropy Reducer programs compile to exactly their current
   semantic hashes and artifact identities; the frozen WO-003 trace oracle
   and the WO-029 CLI fixture are byte-identical; every existing compiler,
   skeleton, and corpus test passes unchanged.
2. A fixture group with three actives sharing two supports compiles with
   per-active emissions, refuses a non-commuting pair without a pipeline,
   accepts it with one, and emits the over-budget diagnostic at seven links;
   the three editable views of a graph with `sets` round-trip and hash equal.
3. For each of the five bonuses, a fixture proves it is dark with one fewer
   piece equipped and armed at its count, and that its emission changes the
   compiled program (a different semantic hash) only when armed.
4. The full-set scenario runs live and from replay with identical complete
   Decisions and semantic projections, exercises every bonus once, refuses
   the destructive change, and cancels the reevaluation cadence on operator
   return; the 13-step scenario's output is unchanged.
5. The tooltip render pins each piece's original term, translation, kanji,
   RPG title, GRANTS, RESTRICTIONS, OBLIGATION, PASSIVE, PULSE, INTERRUPT, and
   declared cost, and the set summary pins each bonus's state; both are pinned
   as fixtures.
6. Write-backs land: 02 §LoadoutGraph v1 payload contract (the additive
   `sets` collection and multi-active lowering, with the exact normalization
   rule); 04 §RPG view (set bonuses implemented for this set; the rest still
   planned); 05 §5S / 6S (which pieces are compiled and what remains prose);
   06 §Pattern workshop v1 (compiler-side slice named); 10 §Separate version
   axes (the additive change and the compiler package version); README "What
   runs today"; a dated capability-table row for `compiler.five-s-set` at
   level 1; publication index rows and both edition locks; ledger entry.
7. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged.

**Evidence gate:** the fixture transcripts for criteria 1 through 5;
`npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** the drag-equip authoring surface or any console change (the
recorded wave-5 candidate "Console parity contract and drag-equip
authoring" in the planning map's preserved candidates, to be filed by the
next planning pass once this order and WO-032 have merged); saved or
community builds; the Marquet ladder as a typed protocol, the
mitigated-speech voice selector, and the rest of the founding shelf (the
recorded candidate "Pattern workshop v1, remaining shelf entries" in the
planning map's preserved candidates, one entry per order after this one);
real deletion or
escalation authority; προτείνω; changing the kernel; a new graph schema
version.

**Operator-review assumptions**

1. The 5S set is the first shelf entry to compile in full, and its member
   names and bonus semantics follow 05 §5S / 6S.
2. The `sets` extension is additive under schema version 1.
3. The second scenario stands beside the frozen 13-step oracle rather than
   replacing it.
4. The board renders the set through the existing compiler render; any
   console change is a separate follow-on.
