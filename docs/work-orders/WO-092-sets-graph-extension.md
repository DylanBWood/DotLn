# WO-092 — The `sets` graph extension: an additive collection names a set's member actives and piece-count bonuses, the three views round-trip it, and the compiled inspection lists each bonus armed or dark (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. An additive graph collection under
schema version 1. Assigned at activation under the standing opt-out
default.
**Cost:** adds an optional `sets` collection to the graph type
(`packages/compiler/src/types.ts`), its normalization (`normalize.ts`), its
codecs in the three editable views (`views.ts`) and its lowering
(`compile.ts`): at its piece count a bonus's emissions are lowered into the
program, and the compiled inspection lists each bonus armed or dark in a
field omitted for a graph without `sets`; fixtures; at most 500 bytes in
product 02, 200 in product 04 and 200 in product 10. Removes nothing that
runs today; no set definition exists. WO-094 declares a hard dependency on
it. Re-mints: deterministic, each edition selected in
`docs/evidence/current.json` whose check the four compiler sources or
`packages/compiler/package.json` stale; the compiler release moves the
policy hash the console binds, so the feedback edition is carried
(`feedback-evidence --carry`), the console is re-pinned, the four console
self-host fixtures that record that hash follow the label (WO-154 D011;
WO-162 D011 and D012) and the harness bundle is regenerated; in the files
the feedback verifier judges only the release label moves, so no live
episode. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-037's set-definitions item, cut into a
bounded child at the operator's 2026-09-08 correction. Planner-synthesized
draft. Opaque identifier, not a priority. Clean-room screen: no stop
condition. Register row FUP-0024, the critical-path plan's deferred
pattern-workshop entry, is allocated to WO-091 to WO-095 by the 2026-09-19
cleanup pass and reopens if one of them is withdrawn. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: a bonus carries a list of emissions as a support does, the
lowering of an armed bonus is placed here with its listing inside the
semantic hash, and the re-mints and both gates are named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-091 merged (a set's members are several actives in one
group).
**Recommended placement:** after WO-091 and before WO-093 in the serial run
(`docs/planning/sequence.md`). This order edits
`packages/compiler/src/types.ts`, `normalize.ts`, `views.ts` and
`compile.ts`, their tests and fixtures, products 02, 04 and 10, the
console's pins and the self-host fixtures the release moves, and the
harness bundle. WO-091, before it, edits `compile.ts` and products 02 and
10; WO-093, next, moves the console's skeleton pin. A recommendation, not
a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-091",
    "relation": "hard",
    "reason": "a set's members are several actives in one group"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 04-interfaces.md §RPG / Path-of-Exile
view (set bonuses) and §Editable-view v1 normalization and semantic hash;
02-domain-model.md §LoadoutGraph v1 payload contract (the field list, said
to match the compiler's export); 10-ir-compatibility.md §Invariants and
§Separate version axes; `packages/compiler/src/types.ts`
(`SupportEmission`, a support's `emissions` list, the fields omitted when
empty), `views.ts`, `normalize.ts` (`semanticHash` over the whole
program), `compile.ts`; `scripts/lib/evidence-sources.mjs`;
`docs/evidence/WO-154/decisions.md` D011 and
`docs/evidence/WO-162/decisions.md` D011 and D012;
`docs/control/doc-ceilings.json`; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Add an optional `sets` collection: a set names member active
ids and bonuses, each with a piece count and a list of emissions of
existing kinds, as a support's `emissions` is; absent normalizes to empty;
the three editable views encode and decode it; a bonus is armed when at
least its piece count of members is equipped, and an armed bonus's
emissions are lowered into the program; the compiled inspection lists
each bonus armed or dark with the arming count; no bonus semantics for
the 5S set here (a fixture set).

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No set definition, bonus emission or arming inspection exists: no
  compiler source declares a `sets` key, and no compiler or skeleton source
  holds bonus or arming code.
- A support and an ambient effect each carry a list of emissions of the
  kinds `SupportEmission` declares (`packages/compiler/src/types.ts`).
- The semantic hash covers the whole compiled program, its inspection
  included (`packages/compiler/src/normalize.ts`); `grants` and `presence`
  are omitted when empty so that existing programs keep their bytes.
- WO-094, which depends on this order, gives two of its five bonuses two
  emissions each, and its placement edits the set definition and compiler
  fixtures, not compiler sources, so the lowering it relies on is this
  order's.

**Design (scope discipline):**

- Additive: a graph without `sets` compiles to the same bytes, because the
  listing field is omitted when the graph holds no set.
- A bonus carries a list of emissions of existing kinds, as a support
  does; a bonus with two emissions is one bonus.
- The lowering is here: at its piece count a bonus's emissions are lowered
  as a linked support's are; one piece short, none are. WO-094 supplies
  the 5S bonuses as data.
- The listing is part of the compiled program, so of its semantic hash: a
  graph with a set hashes differently from the same graph without one,
  and arming changes the listing. No criterion compares hashes to isolate
  an emission.
- A set naming an active the graph does not hold, a piece count below one
  or above the set's member count, and an emission of a kind
  `SupportEmission` does not declare each refuse as INVALID GRAPH naming
  the set; the decoder admits nothing it cannot read.
- **Declined alternatives, recorded:** one emission per bonus, so that a
  two-emission bonus becomes two bonuses at one piece count (seven entries
  for five thresholds, and a bonus shaped unlike a support; reopen when a
  consumer needs a bonus addressable by one emission); a listing outside
  the hashed program (the order names the compiled inspection, which the
  hash covers; reopen when a consumer needs arming state outside the
  semantic hash); leaving the lowering to WO-094 (its placement edits no
  compiler source; reopen if WO-094 is rewritten to own compiler work).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07; the per-active field WO-091 adds is read at the base):**

1. `packages/compiler/src/types.ts`: `SUPPORT_EMISSION_KINDS` (the eight kinds,
   `satisfies readonly SupportEmission["kind"][]`; the tree has no runtime list, so an
   undeclared kind can be refused by name); `SetBonus { bonusId; pieceCount; emissions }`;
   `EquipmentSet { setId; version; name; memberActiveMechanicIds; bonuses }`;
   `LoadoutGraph.sets?`; `CompiledSetBonus { setId; bonusId; pieceCount; equippedPieces; state: "armed" | "dark" }`;
   `CompiledProgram.setBonuses?` (omitted without sets); `FunctionTableRow` kind `"set"`;
   `StatechartJsonView.context.sets?`; compiled emission records gain an optional
   `setBonusId` beside `supportFacetId` (one or the other is required). Check:
   `node scripts/build.mjs`.
2. `normalize.ts`: export `normalizeSets(values)` modelled on `normalizeAuthorityGrants`
   (line 349): throws `set "<setId>": ...` for a malformed field, a non-integer piece count
   or a kind outside `SUPPORT_EMISSION_KINDS`; sorts sets by `setId`, members sorted-unique,
   bonuses by `bonusId`, emissions by `emissionId` via `normalizeEmission`. In
   `normalizeLoadoutGraph` (line 417) add `setFields`, omitted when empty like
   `presenceFields` (line 412), so set-free view encodings stay byte-identical (decided
   2026-10-07).
3. `views.ts`: `rowKindOrder` gains `set: 14`; `functionTableFromLoadout` emits set rows keyed
   by `setId`; `loadoutFromFunctionTable` reads them; the statechart context carries `sets`
   when non-empty; `loadoutFromStatechartJson` reads it.
4. `compile.ts` `graphDiagnostics` (line 431): `duplicateDiagnostics("set", ...)`; `invalid`
   naming the set for a member not in `activeMechanics` and for a piece count below 1 or
   above the member count.
5. `compile.ts` `emitProgram` (line 763): a member is equipped when it has at least one link
   in a participating link group or is listed in a container's `activeMechanicIds` (WO-037's
   "equipped in the group"; decided 2026-10-07, so a held but unlinked member leaves a bonus
   dark); count equipped members per set; list every bonus in `setBonuses`; lower an armed
   bonus's emissions into the same arrays a linked support's reach (cadences,
   statechartGuards, schemas, hooks, verificationPlan, promptFragments, WorkOrder lists,
   permission lists), attributed by `setBonusId` and attached at the program top level; a
   bonus `permission-guard` passes the WO-042 floor (`authority.ts` lines 38 to 80) against
   every member active.
6. `packages/compiler/test/sets.test.ts` (new): "WO-092 a graph with sets round-trips through
   three views and hashes equal"; "WO-092 a graph without sets keeps its bytes and hash";
   "WO-092 each fixture bonus is dark one piece short and armed at its count"; "WO-092 a
   two-emission bonus lowers both when armed"; "WO-092 an unknown member, piece count 0 or
   above members, and an undeclared kind refuse naming the set"; re-run the pinned-literal
   asserts WO-091 lists. Check: `node scripts/build.mjs && node --test packages/compiler/dist/test/sets.test.js packages/compiler/dist/test/views.test.js`
   (the `compiler` row).
7. Labels and re-mints as WO-091 steps 8 and 9, edition WO-092 revision 001, carrying from
   the feedback edition selected at the base.
8. Write-backs: product 02 §"### LoadoutGraph v1 payload contract": add
   `sets?: readonly EquipmentSetV1[];` to the `LoadoutGraphV1` block (lines 286 to 302), its
   shape and the normalization rule, in place; product 04 §"## RPG / Path-of-Exile view": the
   bullet at lines 615 to 617 beginning "**Set bonuses compile to real mechanics**" gains the
   collection and the armed or dark listing; product 10 §"## Separate version axes": one
   sentence, `sets` additive under schema 1; `packages/compiler/README.md` lines 113 to 114:
   drop "set bonuses" from the deferred list; `docs/evidence/WO-092/decisions.md` (new);
   `node scripts/check-publication.mjs --print-locks` (both TOCs cite 02, 04 and 10);
   `npm run meta`; `npm run work-orders -- index`; `npm run publication:check`.
9. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-092/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the collection, codecs, lowering, arming inspection,
fixtures, the re-mints, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture graph with `sets` round-trips through the three views and
   hashes equal; a graph without `sets` compiles to the same bytes and
   hash as before, and the semantic-hash literals that tests and fixtures
   under `packages/` pin at the order's base keep their values.
2. For each fixture bonus, one piece short of its count the compiled
   program lists it dark with the arming count and holds none of its
   emissions; at its count it lists it armed and holds each of its
   emissions. One fixture bonus carries two emissions.
3. A set naming an unknown active, a bonus whose piece count is zero or
   above the set's member count, and a bonus emission of an undeclared
   kind each refuse with a diagnostic naming the set. The criterion is
   judged against the declared set; a case outside it is a follow-up, not
   a failure.
4. Write-backs land, each in place with no dated paragraph: 02
   §LoadoutGraph v1 payload contract (the `sets` field and its shape in
   the payload listing, and the normalization rule, in place with no dated paragraph (ceilings are planning's since the 2026-10-07 pass)), 04 §RPG /
   Path-of-Exile view (the set-bonus bullet: the collection and the armed
   or dark listing) and 10 §Separate version axes (the additive
   collection). WO-091, WO-097 and WO-098 also write 02; WO-081, WO-083
   and WO-094 also write 04; WO-076,
   WO-091, WO-097 and WO-194 also write 10. The decisions file; the publication locks
   refreshed.
5. Every edition the Cost line names is re-minted or carried, the console
   re-pinned with its self-host fixtures and the harness bundle
   regenerated; the decisions file records each.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`packages/compiler/src/types.ts`, `normalize.ts`, `views.ts` and
`compile.ts` are declared sources of the authority-, artifact-,
verification-, feedback- and harness-evidence suites, and again at final
review. No live row.

**Write-back duty:** as listed in criterion 4.

**Known issues and carry-ins:**

- 2026-10-07 pass: stale and corrected above: products 02, 04 and 10
  figures and co-writers; the Cost line omitted the compiler README line
  and the version labels.
- Decided by the 2026-10-07 pass: "equipped" is linked in a participating
  group or listed in a container (so the dark case exists); the emission
  kinds constant; `setBonusId` on lowered records; bonus guards pass the
  floor against every member and attach at the top level; absent `sets`
  normalizes by omission. Reopen: a bonus must attach per member.
- Blocked on WO-091 for the per-active program field and the multi-active
  fixture builder.

**Non-goals:** the 5S bonuses (WO-094); the render (WO-095); arming state
outside the semantic hash.

**Operator-review assumptions**

1. Additive under schema 1.
