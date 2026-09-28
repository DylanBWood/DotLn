# WO-092 — The `sets` graph extension: an additive collection names a set's member actives and piece-count bonuses, the three views round-trip it, and the compiled inspection lists each bonus armed or dark (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
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
   the payload listing, and the normalization rule; at most 500 bytes
   added, against 2,776 bytes of headroom on 2026-09-28), 04 §RPG /
   Path-of-Exile view (the set-bonus bullet: the collection and the armed
   or dark listing; at most 200 bytes, against 1,194) and 10 §Separate
   version axes (the additive collection; at most 200 bytes, against
   507). WO-091, WO-065, WO-066, WO-058 and WO-098 also write 02; WO-116,
   WO-117, WO-081, WO-083 and WO-094 also write 04; WO-060, WO-086,
   WO-091, WO-058 and WO-076 also write 10; so the executor re-measures
   the headroom at its base; where the bound does not fit, it consolidates
   the section it edits in the same change; a ceiling is raised only by a
   planning-document decision. The decisions file; the publication locks
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

**Non-goals:** the 5S bonuses (WO-094); the render (WO-095); arming state
outside the semantic hash.

**Operator-review assumptions**

1. Additive under schema 1.
