# WO-091 — The full 5S equipment set: the Repo Gardener equips all six 5S pieces, with multi-active link groups under a visible six-link budget, the additive `sets` collection and the five 5S set bonuses compiling to emissions listed armed or dark while every pinned hash holds, and a second deterministic scenario with live and replay identity and a `--compiled-diff --loadout` render of each piece and the set (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Front page:** README.md
**Release classification:** minor. One compiler minor (multi-active
lowering, an additive `sets` graph collection under schema version 1 with
its arming listing, a set-summary render) and one skeleton minor (five
mechanic definitions, the 5S set and its bonuses as data, a second scenario,
a CLI selector); existing programs keep their hashes. Assigned at activation
under the standing opt-out default.
**Cost:** adds, in `packages/compiler`: multi-active lowering in
`src/compile.ts` with a per-active list and a link-budget signal for a
multi-active group beyond six links, both additive program fields omitted
when absent (`src/types.ts`); an optional `sets` collection with its
normalization (`src/normalize.ts`), its codecs in the three editable views
(`src/views.ts`), its diagnostics and the lowering of an armed bonus's
emissions (`src/compile.ts`), and a listing of each bonus armed or dark
inside the compiled program; `renderSetSummary` (`src/render.ts`). In
`packages/skeleton`: the five remaining 5S mechanics, the six-piece group,
the 5S set with five bonuses and a typed Safety predicate, as data
(`src/loadouts/five-s.ts`, new); a second deterministic scenario
(`src/full-set-scenario.ts`, new) and the reactor's fold of four bonus
behaviors (`src/reactor.ts`); a `--loadout <id>` selector for
`--compiled-diff` (`src/cli.ts`). Five new test files, one trace fixture and
cases in two existing test files; in-place write-backs to products 02, 04,
05, 06 and 10 (the merged orders estimated about 900, 400, 600, 200 and 400
bytes; planning document §11 sets the ceilings), one README sentence
rewritten in place, the compiler README's deferred list, the `portfolio.ts`
comment and one appended capability-table section. Removes: the refusal of
every graph that holds more than one active, which keeps the 5S set from
compiling; the absence of any set definition, bonus emission or arming
listing; the prose-only status of Seiton, Shitsuke and Safety; product 05's
statement that set bonuses are planned work; the single Seiri-only scenario;
the absence of any set render. Re-mints: one compiler and one skeleton
release label where the five merged orders moved three of each; one console
re-pin, one self-host fixture re-record (WO-154 D011; WO-162 D011 and D012)
and one harness-bundle regeneration; one deterministic re-mint of each
edition selected in `docs/evidence/current.json`, because the edited
compiler sources, `reactor.ts` and `portfolio.ts` are common evidence
sources (`scripts/lib/evidence-sources.mjs`; a release label alone changes
no compared source content, since `packages/skeleton/src/evidence-editions.mjs`
projects component versions out of the manifests, the lockfile and
`COMPILER_PACKAGE_VERSION`);
and one feedback edition, minted from the one live feedback self-host
episode a `reactor.ts` change owes, or carried if `reactor.ts` stays
unchanged, since `reactor.ts`, the lockfile, the skeleton manifest and
`packages/compiler/src/artifact-identity.ts` are judged files
(`FEEDBACK_SOURCE_PATHS`, `packages/skeleton/src/feedback-audit.ts` line 15).
The merged orders planned two carries and one live episode; one live
episode or one carry remains. Merge saving: four order
cycles, each an activation, a verification, a final review and a release
close with its full gate runs; since receipt 044 a closed order paid 2.29
full runs and 61 minutes of full gate, and phase medians are 16.9 minutes
for verification and 24.8 for final review (planning document §12).
Wall-clock: the order's own is unknown until run; the executor records the
re-mint cascade's elapsed wall-clock apart from the code work (criterion
13). Context bytes: one order file of about 63,000 bytes replaces five
totalling 77,573, and each role reads one order instead of five. Commands:
one CLI selector added; no npm script. Tokens: unknown until run. Steps: 36
in one order instead of 44 across five, with one handoff, one Preflight
line and one full gate run before handoff.
**Nomination provenance:** WO-037's design items, each cut into a bounded
child at the operator's 2026-09-08 correction: multi-active link groups
(its first item; the ledger entry on shared supports across multiple actives),
the set definitions, the 5S set as data (product 05 §5S / 6S — the
maintenance organism), the bonuses, and the scenario and tooltip items.
Planner-synthesized drafts. Opaque identifier, not a priority. Clean-room
screen: no stop condition. Register row FUP-0024, the critical-path plan's
deferred pattern-workshop entry, was allocated to the five children by the
2026-09-19 cleanup pass and is carried here; it reopens if this order is
withdrawn. The 2026-09-28 planning pass re-observed each child on `main` at
`5f3849ec` and amended it
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10): pinned hashes named as they stand and a non-refusing budget signal;
a bonus given a support's list of emissions, with its lowering and listing
inside the semantic hash; the Entropy Reducer's pieces named, unstated
terms made the executor's cited proposals; the unisolable hash claim
replaced by the compiled emissions; the console's pins and label-bound
fixtures made to follow the releases and the live episode placed in the
executor's session; in each, the re-mints and both gates. The 2026-10-07
pass wrote the execution plans at `bd437eb2`; the 2026-10-10 and 2026-10-11
passes amended the scenario and render part. Merged by the 2026-10-13
standard planning pass under the operator's sizing direction (planning
document §12), from WO-091, WO-092, WO-093, WO-094 and WO-095.
**Depends on:** WO-008 merged (compiler v1; satisfied at `v0.4.0`); WO-016
merged (one reactor; satisfied at `v0.3.6`); WO-023 merged (the Entropy
Reducer; satisfied at `v0.5.0`); WO-029 merged (artifact identity;
satisfied at `v0.9.0`); WO-032 merged (the board renders the set through
the compiler render; satisfied at `v0.14.0`); WO-042, reference only (the
Safety piece's deny at safety-invariants remains legal; closed,
`v0.16.0`). The dated planning deferral until WO-053 is met: WO-053 passed
final review on 2026-09-18 (closed, `v0.29.3`). No queued order.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-008",
    "relation": "satisfied-by-release",
    "release": "v0.4.0",
    "reason": "compiler v1"
  },
  {
    "workOrderId": "WO-016",
    "relation": "satisfied-by-release",
    "release": "v0.3.6",
    "reason": "one reactor"
  },
  {
    "workOrderId": "WO-023",
    "relation": "satisfied-by-release",
    "release": "v0.5.0",
    "reason": "Shine and Standardize inside the Entropy Reducer"
  },
  {
    "workOrderId": "WO-029",
    "relation": "satisfied-by-release",
    "release": "v0.9.0",
    "reason": "artifact identity per component"
  },
  {
    "workOrderId": "WO-032",
    "relation": "satisfied-by-release",
    "release": "v0.14.0",
    "reason": "the board renders the set through the compiler render"
  },
  {
    "workOrderId": "WO-042",
    "relation": "reference-only",
    "reason": "the Safety piece's deny at safety-invariants remains legal"
  },
  {
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "Horizon 2 does not advance the missing work loop",
    "until": "WO-053"
  }
]
<!-- dotln-dependencies:end -->

**Recommended placement:** after WO-088 and before WO-096 in the serial queue
(position 16 after the 2026-10-21 pass placed four fork-unblocking orders
first; the operator keeps core's next thirty orders serial, planning document
§12.4): §12.4 puts the full 5S set, among the earliest
ideas still unbuilt, ahead of the rule migration. WO-096, after it, edits
the compiler package, products 02 and 10, the console's pins and self-host
fixtures and the harness bundle that this order's releases move, and
rebases on them. A recommendation, not a dependency token.

**Cites (read these sections):** 02-domain-model.md §LoadoutGraph v1
payload contract (the field list, said to match the compiler's export; the
sentence "Compiler v1 lowers exactly one active mechanic, at most one
participating link group, and at most one explicit pipeline in that group"
within its §Authority grants and trusted admission) and §Identity and
composition (the six-link default budget); 03-architecture.md §Composition
system (precedence, commutativity, pipelines); 04-interfaces.md §RPG /
Path-of-Exile view (set bonuses; item tooltip anatomy) and §Editable-view
v1 normalization and semantic hash; 05-pattern-library.md §5S / 6S — the
maintenance organism (the pieces; Sustain kept a candidate; the portfolio
vocabulary) and the status paragraph under the document's title (set
bonuses as planned work); 06-roadmap.md §Application version pending —
Pattern workshop v1 (the compiler-side slice); 07-execution-guide.md
§Preflight before the full gate; 10-ir-compatibility.md §Invariants and
§Separate version axes; `README.md` §What runs today (WO-189's marked range)
and §The game is not decoration; `packages/compiler/src/types.ts`
(`Container`, `ExplicitPipeline`, `CompiledProgram`, `CompileResult`,
`SupportEmission`, the fields omitted when empty), `compile.ts`,
`normalize.ts` (`semanticHash` over the whole program), `views.ts`,
`render.ts` (`renderCompiledDiff`, `renderViewHashes`), `seiri.ts` and
`authority.ts` (the WO-042 floor); `packages/compiler/test/artifact-identity.test.ts`;
`packages/skeleton/src/loadouts/entropy-reducer.ts` (the `seiso-shine`
active and the `entropy-reducer.seiketsu-standardize` support to reuse);
`packages/skeleton/src/portfolio.ts` (`PORTFOLIO_MECHANICS`; read; only its
comment is corrected); `packages/skeleton/src/cli.ts` (`--compiled-diff`),
`console-commands.ts` (`skeleton.compiled-diff`), `scenario.ts` and
`reactor.ts`; `packages/skeleton/test/scenario.test.ts` and the frozen
WO-003 oracle it reads, `packages/skeleton/fixtures/wo003-decision-traces.json`
(the 13-step scenario); `packages/skeleton/test/cli.test.ts` (the pinned CLI
output); `packages/console/src/collect.ts` (the board's loadout
collection); `scripts/release.mjs` (the component-version and workspace-pin
rules); `scripts/lib/evidence-sources.mjs` (the import check);
`docs/evidence/WO-154/decisions.md` D011 and
`docs/evidence/WO-162/decisions.md` D011 and D012 (what a compiler release
owes); `docs/evidence/WO-147/decisions.md` D010 (a live feedback self-host
audit); `docs/planning/capability-table.md` with
`scripts/lib/plan-continuation.mjs` (`reassessments`: the appended section
form); `docs/planning/work-order-map.md` §Candidates — returns from the
Entropy Reducer pass (recorded 2026-09-22) (Sustain on a cadence);
`docs/control/doc-ceilings.json`;
`docs/work-orders/WO-037-five-s-equipment-set.md` (the superseded umbrella;
history only); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; the [2026-10-13 planning document](../planning/standard-pass-2026-10-13.md)
§12 (the merge).

**Objective:** The Repo Gardener equips the full six-piece 5S set. One link
group may hold several actives sharing linked supports: each keeps its own
WorkOrder seed, envelope and claims; a shared support's emissions,
precedence and commutativity apply per active; a non-commuting pair still
needs an explicit pipeline; a multi-active group beyond six links compiles
and carries a visible signal naming the decomposition question;
single-active programs normalize and hash exactly as before. An optional
`sets` collection names member active ids and bonuses, each with a piece
count and a list of emissions of existing kinds, as a support's `emissions`
is; absent normalizes to empty; the three editable views encode and decode
it; a bonus is armed when at least its piece count of members is equipped,
an armed bonus's emissions are lowered, and the compiled inspection lists
each bonus armed or dark with the arming count. Seiton, Seisō, Seiketsu,
Shitsuke and Safety join Seiri with canonical term, translation, kanji,
secondary RPG title, tags, WorkOrder seed, envelope and tooltip collections
following 05 (Shine makes cleaning double as inspection, Standardize turns a
recurring repair into a proposed test, rule, hook or script, Sustain is the
cadence, Safety is the parallel guard region), reusing the Entropy Reducer's
Shine and Standardize where semantics coincide and recording any
divergence; each compiles alone with a pinned tooltip, and all six compile
in one group. The set's five bonuses: at two pieces every Sort candidate
carries a proposed canonical home (evidence-schema); at three every cleanup
invokes an integrity check (verifier episode); at four a recurring repair
proposes a standardization (evidence field and work-order obligation); at
five the cycle schedules its own bounded reevaluation (a cadence in the
evaluable subset); at six, with Safety, a destructive change is legal only
with isolation, evidence, independent verification and explicit approval
(permission guard plus statechart gate), which the Gardener's base rank
refuses. Beside the frozen 13-step scenario, a full-set scenario equips all
six pieces against the deterministic fakes, live and replay produce
identical complete Decisions, and `--compiled-diff --loadout <id>` renders
each piece's tooltip and the set summary with each bonus armed or dark and
the three view hashes.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`; items marked re-checked were read again on
2026-10-13 at `6dbd8771`):**

- Compiler v1 refuses a graph that holds other than one active, more than
  one participating link group, or more than one explicit pipeline in it
  (`packages/compiler/src/compile.ts`, lines 555–581 at `5f3849ec`;
  re-checked, unchanged). The 5S set needs several actives in one group;
  two 5S actives exist, in two programs: Seiri in
  `packages/compiler/src/seiri.ts` and Seisō in the Entropy Reducer, where
  Seiketsu is a support, not an active.
- The single-active Entropy Reducer already links eight supports in one
  group, in a container whose `socketBudget` equals that count
  (`packages/skeleton/src/loadouts/entropy-reducer.ts`). A group larger than
  its container's `socketBudget` refuses as INVALID GRAPH.
- Every compile diagnostic refuses: a successful `CompileResult` carries an
  empty `diagnostics` tuple (`compile.ts`; `types.ts`). A diagnostic at
  seven links refuses the eight-link Entropy Reducer if applied to every
  group, and every multi-active group over six if applied to those alone.
- An `ExplicitPipeline` names a link group, not an active; the program
  fields added since v1, `grants` and `presence`, are omitted when empty so
  existing programs keep their bytes (`types.ts`).
- The Entropy Reducer's pinned hash is `fnv1a64:e3505eb7f111ba22`
  (`packages/compiler/fixtures/wo029-identities.json`); WO-091 as filed named
  `fnv1a64:c5ddbca75f1c4cee`, which WO-142, WO-100 and WO-165 moved. Seiri's
  `fnv1a64:9ca8d0229c6bd8db` is unchanged, and three Contributor builds, the
  Plan Refuter, the Mission Check and the reviewer work order are pinned too
  (`packages/skeleton/test/`). Re-checked: every value holds; the
  Contributor literals moved to lines 380, 399 and 410 of
  `executor-supports.test.ts`.
- No set definition, bonus emission or arming inspection exists: no
  compiler source declares a `sets` key, and no compiler or skeleton source
  holds bonus or arming code (re-checked). A support and an ambient effect
  each carry a list of emissions of the kinds `SupportEmission` declares,
  among them the kinds the bonuses name: `evidence-schema`,
  `verifier-episode`, `work-order`, `cadence`, `permission-guard` and
  `statechart-gate` (`types.ts`).
- The semantic hash covers the whole compiled program, its inspection
  included (`packages/compiler/src/normalize.ts`), so a listing of bonuses
  inside the program enters the hash of a graph that defines a set, and
  arming adds one equipped piece. The bonuses item as first filed asked a
  fixture to show that an emission changes the hash only when armed, which
  no pair of graphs isolates.
- Seiton, Shitsuke and Safety exist as prose only: no definition of them
  exists under `packages/`. Seisō is the Entropy Reducer's active
  `seiso-shine`, at version 3 since WO-165, built inside
  `entropyReducerLoadout` and not exported on its own; Seiketsu is the
  exported support facet `entropy-reducer.seiketsu-standardize`, not an
  active.
- Product 04's tooltip anatomy gives Seiri's header (Seiri / Sort / 整理),
  and the Entropy Reducer holds Seisō's (清掃, "The Entropy-Reducing
  Shine"); no product document gives a kanji or an RPG title for Seiton,
  Seiketsu, Shitsuke or Safety, and product 05 names Safety in English only.
- The portfolio vocabulary admits `sort`, `shine` and `standardize`
  (`packages/skeleton/src/portfolio.ts`); its source comment and product 05
  say the remaining pieces join it as they compile (re-checked:
  `portfolio.ts` lines 24 to 26, product 05 §5S / 6S), and two
  tests use `seiton` as their refused example
  (`packages/skeleton/test/portfolio.test.ts`, `scripts/test-portfolio.mjs`).
- Product 05 keeps Sustain a candidate until an observed cadence justifies
  it; the candidate is the Entropy Reducer's review on a cadence during
  operator absence (the planning map's candidates recorded 2026-09-22). Six
  actives in one group that share two supports make twelve links, beyond
  the six-link default.
- No set bonus is implemented. Product 04 states the bonuses as a mechanic
  ("Set bonuses compile to real mechanics"), product 05's status paragraph
  lists set bonuses as planned work, the compiler README lists them as
  deferred, and the root README said they "are meant to compile".
  Re-checked: WO-189's rewrite (closed, `v0.74.1`) removed the root
  README's set-bonus lines; product 04, product 05 and
  `packages/compiler/README.md` lines 113 to 114 still hold theirs.
- One scenario: `packages/skeleton/src/scenario.ts` exports one
  `runScenario`, which the CLI runs, and it imports the reactor's Seiri-bound
  loadout and constants (`packages/skeleton/src/reactor.ts`). The scenario
  item as first filed said "one shelf entry"; no code or document defines
  the term, and
  nine loadout modules exist under `packages/skeleton/src/loadouts/`
  (re-checked: nine).
- Nothing renders a set: `--compiled-diff` compiles and renders the three
  Seiri views only (`packages/skeleton/src/cli.ts`), and `render.ts` has no
  set or bonus output. The console contract's `skeleton.compiled-diff` fixes
  that leading argument and leaves the rest of the grammar to the terminal
  parser (`packages/skeleton/src/console-commands.ts`).
- The board collects every loadout export from the reactor and
  `packages/skeleton/src/loadouts/` (`packages/console/src/collect.ts`), so a
  new loadout needs no console source edit. But
  `packages/console/package.json` pins the compiler and the skeleton
  exactly (0.19.4 and 0.44.3 at `5f3849ec`; re-checked at `6dbd8771`: 0.27.0
  and 0.58.1; at `926b8234`: compiler 0.29.0, skeleton 0.64.0, console 0.4.4),
  the release check requires each pin to equal the workspace version and a
  changed `src` to carry a new component version (`scripts/release.mjs`),
  and four console self-host fixtures follow a compiler release (WO-162
  D011 and D012). The scenario item as first filed forbade any edit under
  `packages/console`, which these rules make impossible once `render.ts`
  changes.
- Between planning receipts the capability table admits a new row only as
  an appended section headed `## WO-NNN dated addition (YYYY-MM-DD)` or
  `dated reassessment` (`scripts/lib/plan-continuation.mjs`).
- Product 06 §Application version pending — Pattern workshop v1 still
  places WO-037 in wave 4 beside the migration's second batch (re-checked).

**Design (scope discipline):**

- Multi-active lowering. The floor from WO-042 applies per active.
  Commutativity is judged per active: two supports linked to one active
  that do not commute need an explicit pipeline. That pipeline is the
  group's, since a pipeline names a group and v1 still lowers at most one
  per group; it orders the pair for every active that links both.
- The six-link budget is visible, not a cap (assumption 1), so its signal
  is not a diagnostic. It applies to a group with more than one active and
  more than six links; a program with one active carries none, so the
  Entropy Reducer and every other single-active program keep their bytes.
  The container's `socketBudget` stays the cap it is today. The signal is an
  additive program field, omitted when absent as `grants` and `presence` are
  (assumption 2).
- A graph the widened lowering cannot place refuses with a diagnostic
  naming the group or active (step 2 adds the names; the refusals give
  counts only today): links in more than one participating group, or two
  explicit pipelines in the group. No active is dropped from a program that
  compiles.
- Sets. Additive: a graph without `sets` compiles to the same bytes,
  because the listing field is omitted when the graph holds no set. A bonus
  carries a list of emissions of existing kinds, as a support does; a bonus
  with two emissions is one bonus. At its piece count a bonus's emissions
  are lowered as a linked support's are; one piece short, none are. The
  listing is part of the compiled program, so of its semantic hash: a graph
  with a set hashes differently from the same graph without one, and arming
  changes the listing; no criterion compares hashes to isolate an emission,
  and a bonus is proved on the compiled program's emissions and listing.
- A set naming an active the graph does not hold, a piece count below one
  or above the set's member count, and an emission of a kind
  `SupportEmission` does not declare each refuse as INVALID GRAPH naming
  the set; the decoder admits nothing it cannot read.
- The 5S mechanics. Definitions are data. Shitsuke compiles its cadence as
  data and nothing schedules it at runtime: the Entropy Reducer's review on a cadence
  stays the map's candidate, and product 05's statements that Sustain stays
  a candidate remain true of that runtime cadence. The six-piece group sits
  in a container whose `socketBudget` admits its links and carries the
  budget signal when it holds more than six. Standardize is an active here
  and a support in the Entropy Reducer; that difference is recorded with
  every other field-level one. A term, translation, kanji or RPG title that
  product 05 does not give is the executor's, with a public source cited
  where one exists and the choice recorded in the decisions file
  (assumption 5). The portfolio vocabulary is not extended (assumption 6).
- The bonuses. The gate is the deliverable; the authority is not, and the
  Repo Gardener's base rank holds no deletion authority. The
  bonuses are data in the `sets` list form: the four-piece bonus lowers an
  evidence-schema field and a work-order obligation, the six-piece bonus a
  permission guard and a statechart gate; each remains one of the five. The
  compiler files no ProductSuggestion for the four-piece bonus's
  standardization proposal. The Safety gate compiles and refuses in the
  fixture; it
  refuses as well when isolation, evidence, independent verification or
  explicit approval is absent or does not decode.
- The scenario and render. The 13-step oracle is untouched; live and replay
  run through the one shared reactor. The full-set scenario's fake executor
  returns candidates with proposed homes, the integrity check runs as a fake
  verifier episode, a repeated repair yields a standardization proposal in
  evidence, the reevaluation cadence fires and is cancelled on operator
  return, and the destructive gate refuses. The set summary's bonus states
  come from the compiled program's listing. The board renders the set
  through the same render; the console's `package.json` pins and the
  self-host fixtures that follow the compiler label move with the release,
  as the release check requires; nothing else under `packages/console`
  changes, and a board change, if one proves necessary, is a separate small
  follow-on.
- The capability row is an appended `## WO-091 dated addition (YYYY-MM-DD)`
  section, the form the continuation check admits; a later planning
  boundary folds it (WO-088, which carries the fold, runs before this order).
- **Declined alternatives, recorded:** a new schema version; a blocking
  over-budget diagnostic at seven links (it caps multi-active groups, which
  assumption 1 excludes, and applied to every group it refuses the Entropy
  Reducer that criterion 1 keeps; reopen when a planning document makes the
  budget a cap); an advisory beside a successful `CompileResult`, outside
  the hashed program (it changes the result type for every consumer; reopen
  when a consumer needs the signal outside the hashed program); one emission
  per bonus, so that a two-emission bonus becomes two bonuses at one piece
  count (seven entries for five thresholds, and a bonus shaped unlike a
  support; reopen when a consumer needs a bonus addressable by one
  emission); a listing outside the hashed program (the compiled inspection
  is hashed; reopen when a consumer needs arming state outside the semantic
  hash); a hash comparison per bonus (the listing and the added piece change
  the hash by themselves; reopen when a fixture pair can hold the listing
  constant); forking Shine silently; a row edited into the capability
  inventory (the plan check refuses a rewritten row between receipts;
  reopen when a planning pass folds the table); a console source edit (the
  collection is dynamic and the contract passes the selector through; reopen
  when a board change proves necessary).

**Execution plan (the executor follows these steps in order; observed at
`bd437eb2`, 2026-10-07; source anchors re-checked at `6dbd8771`,
2026-10-13, and unchanged unless a step says so):**

1. `packages/compiler/src/types.ts`: `DEFAULT_LINK_BUDGET = 6`;
   `CompiledActive { activeMechanicId; linkedSupportFacetIds; semantics; workOrder; authorityEnvelope; effectiveClaims; inspection }`;
   `LinkBudgetSignal { linkGroupId; linkCount; defaultBudget; question }`; optional
   `CompiledProgram.actives?` and `linkBudget?`, both omitted for one active (decided
   2026-10-07; a shared support's emissions are listed per active, since each active's
   lowering is independent). `SUPPORT_EMISSION_KINDS` (the eight kinds,
   `satisfies readonly SupportEmission["kind"][]`; the tree has no runtime list, so an
   undeclared kind can be refused by name); `SetBonus { bonusId; pieceCount; emissions }`;
   `EquipmentSet { setId; version; name; memberActiveMechanicIds; bonuses }`;
   `LoadoutGraph.sets?`; `CompiledSetBonus { setId; bonusId; pieceCount; equippedPieces; state: "armed" | "dark" }`;
   `CompiledProgram.setBonuses?` (omitted without sets); `FunctionTableRow` kind `"set"`;
   `StatechartJsonView.context.sets?`; compiled emission records gain an optional
   `setBonusId` beside `supportFacetId` (one or the other is required). Check:
   `node scripts/build.mjs`.
2. `packages/compiler/src/compile.ts` `graphDiagnostics` (starts line 431; the active-count
   refusal at 555): refuse only zero actives (`SEMANTICS UNSUPPORTED: no active mechanic`);
   keep the blocks at 565 and 575 byte-identical except that each refusal now names its
   `linkGroupId` or `activeMechanicId` (today both build
   `diagnostic("SEMANTICS UNSUPPORTED", msg)` with counts only). Check: the `compiler` row.
3. Same file: add `supportsLinkedTo(graph, activeMechanicId)` beside `supportsInGroup` (line
   223); `conflictDiagnostics` (245) and `resolveClaims` (322) iterate per active; the
   pipeline lookup stays by group. Check: the `compiler` row.
4. Same file `emitProgram` (line 763): move the per-active body into
   `lowerActive(graph, environment, active, supports, claims)`. One active: today's object
   unchanged. Several: the top-level `workOrder`, `authorityEnvelope`, `inspection` and
   `authorityExpiresAt` come from the first active by normalized id (decided 2026-10-07);
   `actives` lists each; `linkBudget` lists each group with more than one active and more
   than six links. Check: the `compiler` row.
5. Same file `compileLoadout` (line 1024): run `grantEnvelopeDiagnostics` and
   `inspectionAuthorityDiagnostics` (`authority.ts`) per `actives` entry; presence with
   several actives refuses `SEMANTICS UNSUPPORTED: presence with several actives` (decided
   2026-10-07). Check: the `compiler` row.
6. `packages/compiler/test/multi-active.test.ts` (new): "WO-091 three actives sharing two
   supports compile per active, no signal"; "WO-091 a non-commuting pair on one active needs
   the group pipeline"; "WO-091 a pair split across two actives needs none"; "WO-091 a seventh
   link in a seven-socket container carries the signal"; "WO-091 two groups and two pipelines
   refuse with the named diagnostics"; "WO-091 every active of a compiling fixture is in its
   program". Check: `node scripts/build.mjs && node --test packages/compiler/dist/test/multi-active.test.js`
   (the `compiler` row).
7. `packages/compiler/src/normalize.ts`: export `normalizeSets(values)` modelled on
   `normalizeAuthorityGrants` (line 349): throws `set "<setId>": ...` for a malformed field, a
   non-integer piece count or a kind outside `SUPPORT_EMISSION_KINDS`; sorts sets by `setId`,
   members sorted-unique, bonuses by `bonusId`, emissions by `emissionId` via
   `normalizeEmission` (line 199). In `normalizeLoadoutGraph` (line 417) add `setFields`,
   omitted when empty like `presenceFields` (line 412), so set-free view encodings stay
   byte-identical (decided 2026-10-07). Check: the `compiler` row.
8. `packages/compiler/src/views.ts`: `rowKindOrder` (line 11) gains `set: 14`;
   `functionTableFromLoadout` (62) emits set rows keyed by `setId`;
   `loadoutFromFunctionTable` (141) reads them; the statechart context carries `sets` when
   non-empty; `loadoutFromStatechartJson` (207) reads it. Check: the `compiler` row.
9. `packages/compiler/src/compile.ts`: in `graphDiagnostics`, `duplicateDiagnostics("set", ...)`
   and `invalid` naming the set for a member not in `activeMechanics` and for a piece count
   below 1 or above the member count. In `emitProgram`, a member is equipped when it has at
   least one link in a participating link group or is listed in a container's
   `activeMechanicIds` (WO-037's "equipped in the group"; decided 2026-10-07, so a held but
   unlinked member leaves a bonus dark); count equipped members per set; list every bonus in
   `setBonuses`; lower an armed bonus's emissions into the same arrays a linked support's
   reach (cadences, statechartGuards, schemas, hooks, verificationPlan, promptFragments,
   WorkOrder lists, permission lists), attributed by `setBonusId` and attached at the
   program top level; a bonus `permission-guard` passes the WO-042 floor (`authority.ts`
   lines 38 to 80) against every member active. Check: the `compiler` row.
10. `packages/compiler/test/sets.test.ts` (new): "WO-091 a graph with sets round-trips through
    three views and hashes equal"; "WO-091 a graph without sets keeps its bytes and hash";
    "WO-091 each fixture bonus is dark one piece short and armed at its count"; "WO-091 a
    two-emission bonus lowers both when armed"; "WO-091 an unknown member, piece count 0 or
    above members, and an undeclared kind refuse naming the set"; re-run the pinned-literal
    asserts of step 20. Check: `node scripts/build.mjs && node --test packages/compiler/dist/test/sets.test.js packages/compiler/dist/test/views.test.js`
    (the `compiler` row).
11. `packages/compiler/src/render.ts`: new export `renderSetSummary(program)` (the package
    index re-exports `./render.js` whole, `packages/compiler/src/index.ts` line 5, so it needs
    no index edit); the case "WO-091 set summary lists each bonus armed or dark" in
    `packages/compiler/test/tooltip.test.ts`. Check: the `compiler` row.
12. `packages/skeleton/src/loadouts/five-s.ts` (new). Imports `seiriLoadout` and types from
    `@dotln/compiler`; `entropyReducerLoadout` and `entropyReducerSupports` from
    `./entropy-reducer.js`. Reuse Shine's fields from
    `entropyReducerLoadout(expiresAt).activeMechanics[0]` and Standardize's from
    `entropyReducerSupports.standardize`, so `entropy-reducer.ts` stays unedited. Exports:
    `fiveSPieces` (five `ActiveMechanic` values; Shitsuke's cadence is a `cadence` emission
    only); the shared supports; `seitonLoadout`, `seisoLoadout`, `seiketsuLoadout`,
    `shitsukeLoadout`, `safetyLoadout`, `fiveSGroupLoadout`, each
    `(expiresAt: number) => LoadoutGraph`, and no other export whose name ends in `Loadout`
    except step 14's (the console calls every such export with one number and lists it live,
    `packages/console/src/builds.ts` lines 51 to 54); `FIVE_S_DIVERGENCES` as a typed array
    `{ piece, field, entropyReducer, fiveS }`. Supports (decided 2026-10-07; restated 2026-10-21): each piece links the
    Entropy Reducer's support of the same name where one exists, and all six
    share exactly two supports: `entropy-reducer.seiketsu-standardize` and one
    more the executor names by its `supportFacetId` from
    `entropyReducerSupports` (`entropy-reducer.ts` holds eight; `seiso-shine`
    links every one of them, so "the support Shine already links" named none),
    recording both in the mapping's JSON decision block per term `{ piece,
    field, value, source | "executor-chosen" }`; the six-piece group then
    holds twelve links, and the six-piece container's `socketBudget` is set to
    that link count. A 5S Shine field that differs from `seiso-shine` v3 takes
    a new version under the same id. Check: the `skeleton` row.
13. `packages/skeleton/test/five-s.test.ts` (new): "WO-091 Seiton compiles alone with its
    pinned tooltip" and the same for Seisō, Seiketsu, Shitsuke and Safety, each asserting the
    exact `renderCompiledDiff(undefined, program)` lines (term, translation, kanji, title,
    GRANTS, RESTRICTIONS, OBLIGATION, PASSIVE, PULSE, INTERRUPT, cost, hash); "WO-091 six
    pieces compile in one group with the budget signal"; "WO-091 divergences from the Entropy
    Reducer equal FIVE_S_DIVERGENCES" (recomputed field by field); "WO-091 equal fields are
    the Entropy Reducer's values" (`assert.strictEqual` on reused arrays). Check:
    `node scripts/build.mjs && node --test packages/skeleton/dist/test/five-s.test.js` (the
    `skeleton` row, outside confinement).
14. Same module `five-s.ts`: add `fiveSSet` with the six piece ids and five bonuses:
    `five-s.canonical-home` (2: `evidence-schema`), `five-s.integrity-check` (3:
    `verifier-episode`), `five-s.standardization` (4: `evidence-schema` and `work-order`),
    `five-s.reevaluation` (5: a `cadence` whose kind is in the kernel's
    `EVALUABLE_CADENCE_KINDS`, `packages/kernel/src/core.ts` line 61), `five-s.safety` (6: a
    `permission-guard` denying `repo.delete` and `repo.write`, the effects Seiri's tooltip
    restricts, plus a `statechart-gate`). Export `fiveSSetLoadout(expiresAt)`; build the k and
    k-1 piece graphs with a helper whose name does not end in `Loadout`. No ProductSuggestion
    is emitted. The Safety gate's preconditions are a typed predicate
    `five-s.safety.preconditions` v1 reading four typed state fields (isolation, evidence,
    independent verification, approval), registered beside the module in the skeleton's own
    predicate registry (decided 2026-10-07: no predicate in the tree reads them, and kernel
    `authorize` refuses on denial before it checks evidence, so without it the four
    absent-input fixtures would pass vacuously). Check: the `skeleton` row.
15. `packages/skeleton/test/five-s-bonuses.test.ts` (new): per bonus "WO-091 <bonusId> is dark
    one piece short and armed at its count" (its `setBonuses` state and the presence or
    absence of each emission id in the lowered arrays; two ids for the 4- and 6-piece
    bonuses); "WO-091 the Safety gate compiles and refuses the destructive change"
    (`authorize` from `@dotln/kernel` on the compiled `authorityEnvelope`,
    asserting `authorized === false`, the reason `authority revoked` (or
    `cannot evaluate revocation` where the predicate cannot evaluate an
    undecodable input), and that the compiled envelope's
    `revocationConditions` holds `five-s.safety.preconditions` v1); one test
    per absent or undecodable input, each supplying `state`, a `predicateEnv`
    registering the predicate and one `revokedBy` event whose type is not in
    the envelope's `revocationEventTypes`, so the predicate is evaluated
    before the bonus's denial and only it can refuse. Check: `node scripts/build.mjs && node --test packages/skeleton/dist/test/five-s-bonuses.test.js`
    (the `skeleton` row).
16. `packages/skeleton/src/reactor.ts`: accept the full-set program and fold the four bonus
    behaviors (the reactor binds `seiriLoadout` at line 395 and compiles under
    `seiriEnvironment` at 431; at `bd437eb2` no skeleton source interprets a compiled
    `verifier-episode` or `cadence` emission, so the planner expects this edit), keeping it to
    what the scenario needs (receipt 042's known issue). The WO-184 criterion-19 purity test
    ("transitive reactor purity has exactly two reasoned host exclusions",
    `scenario.test.ts` line 149) limits new imports. Check:
    `node --test packages/skeleton/dist/test/scenario.test.js` after `node scripts/build.mjs`
    (the `skeleton` row).
17. `packages/skeleton/src/full-set-scenario.ts` (new; decided 2026-10-07: a new module that no
    registered source imports, so `scenario.ts` stays unedited): exports
    `runFullSetScenario` and `replayFullSetScenario` beside the shape of `runScenario`
    (`scenario.ts` line 359); the result carries `bonusEvents` (bonus id, event type, sequence
    number) taken from Decisions, and the tests assert on it, never on the timeline text
    (prose-parsing screen). Check: `node scripts/build.mjs`.
18. `packages/skeleton/test/full-set-scenario.test.ts` (new) and one trace fixture under
    `packages/skeleton/fixtures/` (new): "WO-091 live and replay match every complete
    Decision", "each bonus fires once", "the Safety gate refuses the destructive change",
    "operator return cancels the cadence". Check:
    `node --test packages/skeleton/dist/test/full-set-scenario.test.js` after
    `node scripts/build.mjs` (the `skeleton` row); oracle:
    `git diff --exit-code <base> -- packages/skeleton/fixtures/wo003-decision-traces.json`.
19. `packages/skeleton/src/cli.ts`: accept `--loadout <id>` in the option loop (lines 44 to
    54), only with `--compiled-diff`; update the usage at line 52; the pinned case "WO-091
    --compiled-diff --loadout renders each piece and the set" in
    `packages/skeleton/test/cli.test.ts`; the four existing cases and the WO-142 refusal stay
    unchanged. Check: the `skeleton` row.
20. The pinned literals stay (anchors re-checked at `6dbd8771`): Seiri `9ca8d0229c6bd8db`
    (compiler tests `presence.test.ts` line 346, `tooltip.test.ts` 66 and 112 to 114,
    `views.test.ts` 203 to 205; skeleton `cli.test.ts` 27 to 29 and 75;
    `wo029-identities.json` line 6; `wo051-inspection-baseline.json` lines 121 and 329);
    Entropy Reducer `e3505eb7f111ba22` (`wo029-identities.json` line 66); Contributor
    `fcf61a6d699e7ffd`, `06245f5c581212f1`, `87aa6e1263d6d74d` (`executor-supports.test.ts`
    380, 399, 410); Plan Refuter `e9f7e0080fcb9810` and Mission Check `4c09a5d98f6bc433`
    (`entropy-reducer.test.ts` 46, 50); the reviewer order `ecb0eca5675332f7`
    (`entropy-reducer-artifacts.test.ts` 314; receipt `b81d0609ee2e9fed` line 262). Check:
    `git diff --exit-code <base> --` on the five frozen fixtures of criterion 1; the
    `compiler` and `skeleton` rows.
21. `packages/skeleton/src/portfolio.ts` lines 25 to 26: correct the comment that says Seiton
    and the rest join the vocabulary as they compile, stating which pieces compile and that
    the vocabulary stays `sort`, `shine` and `standardize` (assumption 6). It is a common
    evidence source (`scripts/lib/evidence-sources.mjs` line 112), so this edit precedes the
    re-mints of step 24. Check: the `comment-labels` row.
22. `scripts/lib/evidence-sources.mjs`, only if a registered source (for example
    `reactor.ts`) imports `five-s.ts` or `full-set-scenario.ts`: register that module or
    record its exclusion with a reason in `evidenceImportExclusions`, as the import check
    requires. Check: the `evidence-sources` row.
23. Labels, one compiler minor and one skeleton minor (at `926b8234`:
    compiler 0.29.0, skeleton 0.64.0, console 0.4.4; the executor reads the
    labels at its base): `packages/compiler/package.json` line 3,
    `COMPILER_PACKAGE_VERSION` (`packages/compiler/src/artifact-identity.ts` line 15),
    `packages/skeleton/package.json` line 3 and its compiler pin at line 18,
    `packages/console/package.json` lines 28 and 30, `package-lock.json` lines 480, 491, 493,
    509 and 513. Check: `npm run release -- check-surfaces --local` (the `release-surfaces`
    row).
24. Deterministic re-mints: `node scripts/build.mjs`; `node scripts/harness.mjs emit`; select
    edition WO-091 revision 001 for the authority, artifact-identity and verification kinds in
    `docs/evidence/current.json` (as WO-147 D010 did);
    `node scripts/authority-evidence.mjs --write --edition WO-091 --revision 001`;
    `node scripts/artifact-identity-evidence.mjs --write`;
    `node scripts/verification-evidence.mjs --write`; then each `--check` and
    `node scripts/harness.mjs check`. Check: the `authority-evidence`, `artifact-evidence`,
    `verification-evidence`, `harness` and `harness-evidence` rows.
25. The feedback edition, after the last edit to a judged source (steps 16 and 23). If
    `reactor.ts` changed: `npm run evidence:feedback -- --write --edition WO-091 --revision 001`,
    then one live feedback self-host episode on the harness the executor runs in (Claude Code
    `claude-opus-5-5` at `xhigh` or Codex `gpt-6.1-sol` at `max`), then
    `node scripts/feedback-evidence.mjs --record-selfhost <store> --edition WO-091 --revision 001`,
    and select it in `docs/evidence/current.json`. If `reactor.ts` is unchanged, only release labels move in judged files:
    `node scripts/feedback-evidence.mjs --carry <the feedback edition
    directory selected at the base> --edition WO-091 --revision 001`, then
    `node scripts/feedback-evidence.mjs --check --edition WO-091 --revision
    001`, and select feedback WO-091 revision 001 in
    `docs/evidence/current.json` before step 26. Check: the
    `feedback-evidence` row.
26. Console: `node scripts/console-fixtures.mjs --record-current-selfhost`, then `--check`;
    only the four console fixture files change, nothing under `packages/console/src/`.
    Check: the `console` row.
27. Product 02 §"### LoadoutGraph v1 payload contract": add `sets?: readonly EquipmentSetV1[];`
    to the `LoadoutGraphV1` block, with its shape and the normalization rule; in its
    §"#### Authority grants and trusted admission", rewrite the sentence beginning "Compiler v1
    lowers exactly one active mechanic" to the multi-active rule and the signal; both in
    place. Check: `npm run test:docs`.
28. Product 04 §"## RPG / Path-of-Exile view": the bullet beginning "**Set bonuses compile to
    real mechanics**" gains the collection and the armed or dark listing and names the five
    bonuses now implemented for the 5S set, the rest still planned, in place. Check:
    `npm run test:docs`.
29. Product 05: the status paragraph under the title (which lists set bonuses as planned
    work) and §"## 5S / 6S — the maintenance organism" (its sentences that call set bonuses
    planned, and the sentence beginning "Seiton and the remaining pieces join the
    vocabulary") state which pieces and bonuses compile and what remains prose, and keep
    Sustain's runtime cadence a candidate, in place. Check: `npm run test:docs`.
30. Product 06 §"## Application version pending — Pattern workshop v1" (found by name at the
    base): its second paragraph names the compiled slice instead of the "wave 4" clause, in
    place. Check: `npm run test:docs`.
31. Product 10 §"## Separate version axes": one sentence on the additive
    lowering fields and the `sets` collection under schema 1 and the compiler
    version, in place. Product 13 §"## Assistance the platform owes each
    role": the Engineer row moves "the 5S set as a multi-active link group
    with set bonuses" from Next planned rungs to Today, in place (read the row
    at the base; WO-096 also writes 13). Check: `npm run test:docs`.
32. `README.md` §"What runs today" (this order's `**Front page:**` field;
    WO-189's rules): one sentence inside the marked section, rewriting the
    Repo Gardener line in place and adding no line (the 2026-10-10 pass's
    headroom decision; the line budget in `docs/control/front-page.json`);
    and, in place in the Not-yet-built line, "composition beyond the Seiri
    subset" narrowed to what still does not compile (more than one
    participating link group, or an explicit pipeline per group), adding no
    line. Check: `npm run test:docs`.
33. `packages/compiler/README.md` lines 113 to 114: drop "multi-active lowering" and "set
    bonuses" from the deferred list. This path is outside `docs/` and root Markdown, so it is
    a code edit made before the handoff's full run. Check: `npm run test:docs`.
34. `docs/planning/capability-table.md`: append `## WO-091 dated addition (<date>)` with the
    header `Capability and scope | Current assessment | Evidence and remaining gate` and a
    `compiler.five-s-set` row. Check: `npm run test:docs`.
35. `docs/evidence/WO-091/decisions.md` (new): the pinned-literal list, the term provenance
    blocks, the Shine and Standardize comparison, each re-mint, the live configuration and the
    cascade's elapsed wall-clock; `node scripts/check-publication.mjs --print-locks` into both
    `docs/publication/*-toc.md` `Source lock:` lines; `npm run meta`;
    `npm run work-orders -- index`; `npm run publication:check`. Check: the `meta` row and
    `npm run test:docs`.
36. Handoff sequence: `npm run format`; the Preflight line; `npm run test:docs`;
    `npm test -- --review`; complete `docs/evidence/WO-091/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Acceptance criteria (all required)**

1. The semantic-hash literals that tests and fixtures under `packages/` pin
   at the order's base keep their values (at `5f3849ec`: Seiri, the Entropy
   Reducer, three Contributor builds, the Plan Refuter, the Mission Check,
   the reviewer work order); the executor lists each with its file in the
   decisions file. The frozen WO-003 oracle
   `packages/skeleton/fixtures/wo003-decision-traces.json` and the four
   WO-029 fixtures (`packages/skeleton/fixtures/wo029-cli.txt` and
   `wo029-legacy-scenario.jsonl`,
   `packages/compiler/fixtures/wo029-identities.json` and
   `wo029-entropy-reducer.json`) are byte-identical to the order's base;
   the identity test binds `compilerPackageVersion` to the running compiler,
   so the release label changes none of them. A graph without `sets`
   compiles to the same bytes and hash as before, and the existing
   expectations of `packages/skeleton/test/scenario.test.ts` and
   `cli.test.ts` hold unchanged. The criterion is judged against the
   declared set; a case outside it is a follow-up, not a failure.
2. A fixture group with three actives sharing two supports (six links)
   compiles with per-active emissions and no budget signal; a non-commuting
   pair linked to one active refuses without the group's explicit pipeline
   and compiles with it; the same group with a seventh link, in a container
   whose `socketBudget` admits seven, compiles and carries the signal with
   the link count, the six-link default and the decomposition question.
3. A fixture whose actives' links name two groups, and one with two
   explicit pipelines in the group, each refuse with the existing
   diagnostic, now naming the group or active; every active of a fixture
   that compiles appears in its program.
4. A fixture graph with `sets` round-trips through the three views and
   hashes equal.
5. For each fixture bonus, one piece short of its count the compiled
   program lists it dark with the arming count and holds none of its
   emissions; at its count it lists it armed and holds each of its
   emissions. One fixture bonus carries two emissions.
6. A set naming an unknown active, a bonus whose piece count is zero or
   above the set's member count, and a bonus emission of an undeclared kind
   each refuse with a diagnostic naming the set. The criterion is judged
   against the declared set; a case outside it is a follow-up, not a
   failure.
7. Each of the five mechanics compiles alone with its tooltip pinned as a
   fixture (term, translation, kanji, RPG title, GRANTS, RESTRICTIONS,
   OBLIGATION, PASSIVE, PULSE, INTERRUPT, cost); all six compile in one
   group, in a container whose `socketBudget` admits their links, and the
   program carries the budget signal when the group holds more than six
   links. The decisions file cites the source of each term, translation,
   kanji and RPG title that product 05 does not give, or records that the
   executor chose it.
8. The decisions file compares the Shine and Standardize definitions with
   the Entropy Reducer's `seiso-shine` active and
   `entropy-reducer.seiketsu-standardize` support field by field and records
   each difference, at least that Standardize is a support there and an
   active here; a field recorded equal is reused from the Entropy Reducer's
   definition, not copied.
9. For each of the five 5S bonuses, a fixture proves that one piece short of
   its count the compiled program lists it dark and holds none of its
   emissions, and at its count lists it armed and holds each of its
   emissions, two for the four-piece and six-piece bonuses.
10. The Safety gate compiles and refuses the destructive change in a
    fixture, and refuses it in fixtures where isolation, evidence,
    independent verification or explicit approval is absent or does not
    decode. The criterion is judged against the declared set; a case outside
    it is a follow-up, not a failure.
11. The full-set scenario runs live and from replay with identical complete
    Decisions and semantic projections, exercises every bonus once, refuses
    the destructive change, and cancels the cadence on operator return.
12. `--compiled-diff --loadout <id>` renders, and fixtures pin, each piece's
    original term, translation, kanji, RPG title, GRANTS, RESTRICTIONS,
    OBLIGATION, PASSIVE, PULSE, INTERRUPT and declared cost, and the set
    summary with each bonus armed or dark and the three view hashes.
13. Every edition selected in `docs/evidence/current.json` that an edited
    source stales is re-minted or, for the feedback edition with
    `reactor.ts` unchanged, carried; the console is re-pinned with its
    self-host fixtures and the harness bundle regenerated; one compiler and
    one skeleton release label move; nothing under `packages/console/src/`
    changes; the decisions file records each, with the cascade's elapsed
    wall-clock recorded apart from the code work, so a later pass can judge
    whether a render-only compiler release should pin differently.
14. If the order changes `packages/skeleton/src/reactor.ts`, the executor
    runs one live feedback self-host episode after its last edit to a judged
    source, on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5`
    at `xhigh` (the operator's 2026-09-28 and 2026-09-30 directions), and
    mints the feedback edition from it (the audit and
    `node scripts/feedback-evidence.mjs --record-selfhost`, as WO-147 D010
    records); the decisions file records which configuration ran. A repair
    that edits a judged source again runs another episode the same way. An
    unchanged `reactor.ts` meets the criterion.
15. Write-backs land, each in place with no dated paragraph (ceilings are
    planning's since the 2026-10-07 pass; a ceiling is raised only by a
    planning-document decision): 02 §LoadoutGraph v1 payload contract (the
    `sets` field, its shape and normalization rule in the payload listing,
    and the v1 lowering sentence stating the multi-active rule and the
    signal); 04 §RPG / Path-of-Exile view (the set-bonus bullet: the
    collection, the armed or dark listing, the bonuses implemented for this
    set and the rest still planned); 05's status paragraph under the title
    and §5S / 6S — the maintenance organism (which pieces and bonuses
    compile and what remains prose, replacing the sentences that call set
    bonuses planned and that say the remaining pieces join the portfolio
    vocabulary as they compile); 06 §Application version pending — Pattern
    workshop v1 (its second paragraph names the compiled slice instead of
    wave 4); 10 §Separate version axes (the additive lowering, the additive collection
    and the compiler version); 13 §Assistance the platform owes each role (the
    Engineer row's 5S set moved from Next planned rungs to Today). WO-096 also
    writes 02, 06, 10 and 13; WO-080 and WO-083 also write 04; WO-192 and
    WO-224 also write 05 (WO-224 the Entropy Reducer paragraph inside §5S /
    6S; read at the base); WO-083 and WO-183 also write 06; WO-193 also writes
    10. One sentence folded into
    README §What runs today, rewriting the Repo Gardener line in place and
    adding no line (WO-189's line budget in `docs/control/front-page.json`;
    the 2026-10-10 pass's headroom decision); the README's Not-yet-built line with "composition beyond the Seiri subset"
    narrowed to what still does not compile; the compiler README's deferred
    list without multi-active lowering and set bonuses; an appended
    `## WO-091 dated addition (YYYY-MM-DD)` section in the capability table
    assessing `compiler.five-s-set` at the level its evidence supports
    (level 1 — demonstrable is the target); the decisions file; the
    publication locks refreshed.
16. `npm test -- --review` and `npm run test:docs` green after the re-mints
    of criterion 13 (the authority, artifact-identity, verification and
    feedback editions, the console's self-host fixtures and the harness
    bundle) and, when `reactor.ts` changed, after the one live feedback
    episode of criterion 14; `git diff --check` clean; no new dependency;
    kernel unchanged.

**Deliverables:** the multi-active lowering and budget signal; the `sets`
collection, codecs, lowering and arming listing; the five mechanics, the
six-piece group and the comparison; the 5S set's five bonuses and the
Safety predicate; the full-set scenario, the reactor fold, the set-summary
render and the CLI selector; fixtures; the re-mints and, when owed, the live
episode record; the write-backs of criterion 15.

**Preflight:** `npm test -- --only build` for step 1,
`npm test -- --only compiler` for steps 2–11 and 20,
`npm test -- --only skeleton` for steps 12–20,
`npm test -- --only console-docs` for steps 12 and 14 (the board's host
collection reads every shipped loadout export),
`npm test -- --only comment-labels` for step 21,
`npm test -- --only evidence-sources` for step 22,
`npm test -- --only release-surfaces` for step 23,
`npm test -- --only authority-evidence`, `npm test -- --only artifact-evidence`,
`npm test -- --only verification-evidence`, `npm test -- --only harness` and
`npm test -- --only harness-evidence` for step 24,
`npm test -- --only feedback-evidence` for step 25,
`npm test -- --only console` for step 26, `npm test -- --only meta` for step
35 and `npm run test:docs` for steps 27–35, each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixture transcripts; the list of pinned literals;
the Shine and Standardize comparison; the live self-host record when
`reactor.ts` changed; `npm run test:docs`; the Preflight line, then
`npm test -- --review` once before `implementation-ready`, because
`packages/compiler/src/types.ts`, `normalize.ts`, `views.ts`, `compile.ts`
and `render.ts` and `packages/skeleton/src/reactor.ts` and `portfolio.ts`
are declared sources of the authority-, artifact-, verification-, feedback-
and harness-evidence suites, and every file under
`packages/skeleton/src/loadouts/` is a declared source of the
harness-fixtures and harness suites; final review reuses that run when the
code identity is unchanged, and pays a full run otherwise. The live row is
the executor's feedback self-host episode, owed only if `reactor.ts`
changes; the surfaces it traverses exist and have run: the feedback
edition `--write`, the live self-host audit (`dotln feedback-audit`, run
for WO-147 D010 on 2026-09-21) and `--record-selfhost`.

**Write-back duty:** as listed in criterion 15.

**Known issues and carry-ins:**

- 2026-10-13 standard pass (the merge): the five merged orders were one
  chain on the pattern workshop; their three compiler and three skeleton
  releases, five console re-pins, three self-host re-records, three bundle
  regenerations, two feedback carries and one live episode collapse into
  steps 23 to 26, and the two skeleton-only "nothing stales" checks into
  step 24. The `portfolio.ts` comment correction, a common evidence source,
  sat after the scenario part's re-mints and now precedes them (step 21).
  Re-checked at `6dbd8771`: the Contributor literals moved (step 20);
  Seiri's literal also sits at `wo051-inspection-baseline.json` line 329;
  the root README no longer names set bonuses (WO-189, closed `v0.74.1`),
  so of the README corrections the bonuses part deferred only the compiler
  README's remains; `renderSetSummary` needs no index edit; WO-188 (`v0.71.0`), WO-190 (`v0.71.1`) and WO-189 (`v0.74.1`), named as
  co-writers or blockers, are closed. The capability fold, now carried by
  WO-088, runs before this order, so this order's appended section waits for a
  later fold.
- 2026-10-11 standard pass (receipt 042's known issue): criterion 13
  records the re-mint cascade's elapsed share apart from the code work; the
  scenario stays out of `reactor.ts` where criterion 14 allows it.
- 2026-10-10 entropy pass (WO-189 D023): the old page's line references and
  the release block's rule comment left with WO-189's rewrite; this order's
  README sentence rewrites the Repo Gardener line in place and adds no
  line, so WO-118 kept one of the budget's two free lines and one stays
  spare.
- 2026-10-07 pass, stale and corrected: products 02, 04, 05, 06 and 10
  figures and co-writers; the claim that the existing refusals name the
  group or active (they give counts only; step 2 names them); the Cost
  lines omitted the version labels, the lockfile lines and the compiler
  README sentence; the Safety criterion could pass without testing anything
  (no predicate read the four inputs; step 14 adds one); WO-116, WO-117,
  WO-086, WO-087, WO-066, WO-061, WO-124 and WO-112 closed; the console
  pins; the README rule is WO-189's; "the reactor if the scenario needs it"
  became certain at `bd437eb2` (step 16), so the live episode is planned.
- Decided by the 2026-10-07 pass (each marked "decided 2026-10-07" in steps
  1, 4, 5, 7, 9, 12, 14 and 17, with the typed divergence array, term blocks
  and `bonusEvents` under the prose-parsing screen). Reopen the first-active
  top level when a consumer needs a merged top level; the top-level bonus
  attachment when a bonus must attach per member; the support mapping when a
  piece needs a support the Entropy Reducer lacks; the Safety predicate when
  the gate must read a fifth input.
- Receipt 036 known issue (2026-09-30): a renderer change moves the
  compiler release and the policy hash the console binds, tying policy
  identity to view code; a re-pinned hash with byte-identical normalized
  programs reopens the coupling.
- Receipt 041 known issues (2026-10-07): (a) precedence and commutativity
  apply per active, but an `ExplicitPipeline` names a link group, and more
  than one pipeline per group stays refused; if two actives in one group
  need opposite orders for the same pair of shared non-commuting supports,
  the graph cannot express it and refuses, so the per-active semantics are
  only partly delivered (criterion 2); reopen when the six-piece group or
  the full-set scenario needs two actives to order a shared non-commuting
  pair differently, or a fixture with that shape is refused. (b) Emissions,
  envelopes and claims are per active, but a set bonus is lowered into the
  program with no stated active, seed or envelope to attach to, and the
  Safety bonus's permission guard and statechart gate mean what the
  envelope they narrow means (criterion 5); reopen when the six-piece bonus
  fixture cannot name which active's envelope the permission guard applies
  to, or it lowers the guard to every active in the group with no recorded
  rule. (c) Seiketsu (Standardize) is a support in the Entropy Reducer and
  an active here; with two shapes for one term the same card can compile
  differently depending on the loadout, and criterion 8 records the
  difference without resolving it; reopen when a loadout equips both the
  Entropy Reducer's `seiketsu-standardize` support and this order's
  Standardize active and compiles conflicting or duplicated emissions. (d)
  Product 05 keeps Sustain a candidate until an observed cadence justifies
  it, and the product 05 write-back could drop that status (criterion 15);
  reopen when it removes Sustain's candidate status without citing an
  observed cadence. (e) Criterion 10 checks only refusals; no fixture has
  all four conditions present and the change admitted, so a gate that
  refuses everything would pass (rule beating); reopen when a fixture with
  all four conditions present and decodable is recorded and the gate
  refuses it, or the full-set scenario only ever exercises the refusing
  path.
- Receipt 042 known issue (2026-10-10): the re-mint cascade (editions, the
  feedback carry or mint, a console re-pin, four fixtures, the harness
  bundle, a live episode if `reactor.ts` changes) may cost more than the
  render it ships; reopen when the order's machinery share exceeds 0.443 or
  it runs a live episode because `reactor.ts` changed.
- Receipt 043 known issues (2026-10-11): no fixture pins a set summary with
  a bonus dark, since the scenario equips all six pieces (reopen when the
  fixtures pin no dark bonus, or a partial loadout's
  `--compiled-diff --loadout` shows a bonus armed one piece short); the
  recorded cascade wall-clock has no threshold or owner (reopen when it
  exceeds the scenario-and-render work's, or a first verification fails on a
  cascade item).
- Register row FUP-0024 (the critical-path plan's deferred pattern-workshop
  entry) is carried here.
- Receipt 045 known issues (2026-10-13), criterion 7: (a) the canonical
  six-piece set (twelve links) always carries the budget signal, so the
  reference composition ships with a standing decomposition question; reopen
  when the full-set scenario's compiled program carries the signal and the
  decisions record no answer to that question. (b) criterion 7 lets the
  executor choose a term, translation, kanji or RPG title product 05 does not
  give, against product 13's hand-crafted engineer compositions; reopen when
  the decisions file records an executor-chosen term, kanji or RPG title the
  operator has not confirmed.

**Non-goals:** more than one participating link group or explicit pipeline
per group; the budget as a cap; arming state outside the semantic hash; a
scheduler or a runtime cadence run for Sustain (the full-set scenario fires
the five-piece bonus's reevaluation cadence against deterministic fakes
only); extending the portfolio vocabulary; real deletion authority; a
hash-level proof per bonus; drag-equip authoring; any console source
change; a row edited into the capability inventory.

**Operator-review assumptions**

1. The six-link budget stays a visible budget, not a cap.
2. The budget signal is a field of a multi-active group's compiled program,
   so it enters that program's semantic hash while single-active programs
   keep their bytes.
3. The `sets` collection is additive under schema 1.
4. The 5S names and semantics follow product 05.
5. A term, kanji or RPG title that product 05 does not give is the
   executor's cited proposal, recorded in the decisions.
6. The portfolio vocabulary stays `sort`, `shine` and `standardize`.
   Extending it edits that registered source and its two tests and
   re-mints every edition; this order corrects product 05 and the comment
   in `packages/skeleton/src/portfolio.ts` that say the new pieces join it
   as they compile, and leaves the vocabulary to the order that extends it.
7. Evidence-gated escalation stays a preserved candidate.
8. The second scenario stands beside the frozen oracle.
9. No step is the operator's by hand: the executor runs every command and
   makes every commit, the release labels, the re-mints, the console
   re-pin and the live feedback episode included, and release close is its
   role's; the operator types the dispatch phrases and merges the pull
   request (operator direction, 2026-10-13; planning document §12.1).
