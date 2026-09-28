# WO-093 — The 5S mechanics as data: Seiton, Seisō, Seiketsu, Shitsuke and Safety join Seiri as typed active mechanics with their terms, seeds, envelopes and tooltip collections, compiling alone and together in one group (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Five mechanic definitions in the
skeleton's loadouts. Assigned at activation under the standing opt-out
default.
**Cost:** adds five active-mechanic definitions as data under
`packages/skeleton/src/loadouts/`, each with its term, translation, kanji,
RPG title, tags, WorkOrder seed, envelope and tooltip collections; a
six-active group that compiles them with Seiri; fixtures pinning each
tooltip; a field-by-field comparison with the Entropy Reducer's Shine and
Standardize; at most 400 bytes in product 05. Removes nothing that runs
today. WO-094 declares a hard dependency on it. Re-mints: none while the
definitions live in a new module that no registered evidence source
imports; if reuse edits `packages/skeleton/src/loadouts/entropy-reducer.ts`
(a common source of every evidence inventory), or a registered source
imports the new module (the import check then requires registering or
excluding it in `scripts/lib/evidence-sources.mjs`), each edition that
stales is re-minted deterministically. The skeleton release moves the
console's exact skeleton pin. No file the feedback verifier judges is
edited, so no live episode. Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** WO-037's "the 5S set as data" item, cut into a
bounded child at the operator's 2026-09-08 correction; product 05 §5S / 6S
— the maintenance organism. Planner-synthesized draft. Opaque identifier,
not a priority. Clean-room screen: no stop condition. Register row
FUP-0024, the critical-path plan's deferred pattern-workshop entry, is
allocated to WO-091 to WO-095 by the 2026-09-19 cleanup pass and reopens
if one of them is withdrawn. Amended by the 2026-09-28 planning pass,
which re-observed the order on `main` at `5f3849ec`: the Entropy
Reducer's pieces are named as they stand, the terms product 05 does not
give become the executor's cited proposals, and the divergence record and
both gates are explicit
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-091 merged (the six mechanics compile in one group).
**Recommended placement:** after WO-092 and before WO-094 in the serial run
(`docs/planning/sequence.md`), not beside WO-092: both move component
versions, the lockfile and the console's pins. This order edits
`packages/skeleton/src/loadouts/` (a new module, and `entropy-reducer.ts`
only if reuse needs an export), their tests and fixtures, product 05 and
the console's skeleton pin. WO-094, next, adds the set to the same module
and also writes product 05. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-091",
    "relation": "hard",
    "reason": "the six mechanics compile in one group"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 05-pattern-library.md §5S / 6S — the
maintenance organism (the pieces; Sustain kept a candidate; the portfolio
vocabulary); 04-interfaces.md §RPG / Path-of-Exile view (item tooltip
anatomy); `packages/skeleton/src/loadouts/entropy-reducer.ts` (the
`seiso-shine` active and the `entropy-reducer.seiketsu-standardize`
support to reuse); `packages/compiler/src/seiri.ts`;
`packages/skeleton/src/portfolio.ts` (`PORTFOLIO_MECHANICS`; read, not
edited); `docs/planning/work-order-map.md` §Candidates — returns from the
Entropy Reducer pass (recorded 2026-09-22) (Sustain on a cadence);
`scripts/lib/evidence-sources.mjs` (the import check);
`docs/control/doc-ceilings.json`.

**Objective:** Define the five mechanics with canonical term, translation,
kanji, secondary RPG title, tags, WorkOrder seed, envelope and tooltip
collections following 05: Shine makes cleaning double as inspection,
Standardize turns a recurring repair into a proposed test, rule, hook or
script, Sustain is the cadence, Safety is the parallel guard region; Shine
and Standardize reuse the Entropy Reducer's definitions where semantics
coincide and record any divergence; each compiles alone with a pinned
tooltip, and all six compile in one group.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Seiton, Shitsuke and Safety exist as prose only: no definition of them
  exists under `packages/`.
- Seiri is the compiler package's active (`packages/compiler/src/seiri.ts`).
  Seisō is the Entropy Reducer's active `seiso-shine`, at version 3 since
  WO-165, built inside `entropyReducerLoadout` and not exported on its
  own; Seiketsu is the exported support facet
  `entropy-reducer.seiketsu-standardize`, not an active
  (`packages/skeleton/src/loadouts/entropy-reducer.ts`).
- Product 04's tooltip anatomy gives Seiri's header (Seiri / Sort / 整理),
  and the Entropy Reducer holds Seisō's (清掃, "The Entropy-Reducing
  Shine"); no product document gives a kanji or an RPG title for Seiton,
  Seiketsu, Shitsuke or Safety, and product 05 names Safety in English
  only.
- The portfolio vocabulary admits `sort`, `shine` and `standardize`
  (`packages/skeleton/src/portfolio.ts`); its source comment and product
  05 say the remaining pieces join it as this order compiles them, and
  two tests use `seiton` as their refused example
  (`packages/skeleton/test/portfolio.test.ts`, `scripts/test-portfolio.mjs`).
- Product 05 keeps Sustain a candidate until an observed cadence justifies
  it; the candidate is the Entropy Reducer's review on a cadence during
  operator absence (the planning map's candidates recorded 2026-09-22).
- Six actives in one group that share two supports make twelve links,
  beyond the six-link default whose signal WO-091 adds.

**Design (scope discipline):**

- Definitions are data; the Repo Gardener's base rank holds no deletion
  authority.
- Shitsuke compiles its cadence as data and nothing here schedules it: the
  Entropy Reducer's review on a cadence stays the map's candidate, and
  product 05's statements that Sustain stays a candidate remain true of
  that runtime cadence.
- The six-piece group sits in a container whose `socketBudget` admits its
  links and carries WO-091's budget signal when it holds more than six.
- Standardize is an active here and a support in the Entropy Reducer; that
  difference is recorded with every other field-level one.
- A term, translation, kanji or RPG title that product 05 does not give is
  the executor's, with a public source cited where one exists and the
  choice recorded in the decisions file (operator-review assumption 2).
- The portfolio vocabulary is not extended here (operator-review
  assumption 3).
- **Declined alternatives, recorded:** forking Shine silently.

**Deliverables:** the definitions, the six-piece group, fixtures, the
comparison, the write-backs below.

**Acceptance criteria (all required)**

1. Each of the five mechanics compiles alone with its tooltip pinned as a
   fixture (term, translation, kanji, RPG title, GRANTS, RESTRICTIONS,
   OBLIGATION, PASSIVE, PULSE, INTERRUPT, cost); all six compile in one
   group, in a container whose `socketBudget` admits their links, and the
   program carries WO-091's budget signal when the group holds more than
   six links. The decisions file cites the source of each term,
   translation, kanji and RPG title that product 05 does not give, or
   records that the executor chose it.
2. The decisions file compares the Shine and Standardize definitions with
   the Entropy Reducer's `seiso-shine` active and
   `entropy-reducer.seiketsu-standardize` support field by field and
   records each difference, at least that Standardize is a support there
   and an active here; a field recorded equal is reused from the Entropy
   Reducer's definition, not copied.
3. Write-backs land, in place with no dated paragraph: 05 §5S / 6S — the
   maintenance organism (which pieces are compiled and what remains
   prose, replacing the sentence that the remaining pieces join the
   portfolio vocabulary as this order compiles them; at most 400 bytes
   added, against 2,544 bytes of headroom on 2026-09-28; WO-094 also
   writes 05, so the executor re-measures the headroom at its base; where
   the bound does not fit, it consolidates the section it edits in the
   same change; a ceiling is raised only by a planning-document
   decision); the decisions file; the publication locks refreshed.
4. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the comparison; `npm run
test:docs`; `npm test -- --review` before `implementation-ready`, because
every file under `packages/skeleton/src/loadouts/` is a declared source of
the harness-fixtures and harness suites, and again at final review. No
live row.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** bonuses (WO-094); the scenario (WO-095); a scheduler or a
cadence run for Sustain; the portfolio vocabulary.

**Operator-review assumptions**

1. Names and semantics follow 05.
2. A term, kanji or RPG title that product 05 does not give is the
   executor's cited proposal, recorded in the decisions.
3. The portfolio vocabulary stays `sort`, `shine` and `standardize`.
   Product 05 and the comment in `packages/skeleton/src/portfolio.ts` say
   the new pieces join it as this order compiles them; extending it edits
   that registered source and its two tests and re-mints every edition.
   The order corrects product 05 and
   leaves the vocabulary, with its comment, to the order that extends it.
