# WO-094 — Set bonuses lowered: the five 5S bonuses compile to real emissions that arm at their piece counts and go dark one piece short, and the Safety gate compiles and refuses (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Bonus emissions over WO-092's
collection. Assigned at activation under the standing opt-out default.
**Cost:** adds the 5S set's five bonuses as data beside WO-093's mechanics
under `packages/skeleton/src/loadouts/` (at two, three, four and five
pieces, and at six with Safety; the four-piece and six-piece bonuses carry
two emissions each), fixtures proving each dark one piece short and armed
at its count, the Safety gate's refusal fixtures, and at most 200 bytes in
each of products 04 and 05. Removes the gap product 05's status paragraph
names: set bonuses are planned work. WO-095 declares a hard dependency on
it. Re-mints: none while the set lives in a module that no registered
evidence source imports; otherwise each edition that module stales,
re-minted deterministically after it is registered or excluded in
`scripts/lib/evidence-sources.mjs`. The lowering is WO-092's, so no
compiler source is edited; the skeleton release moves the console's exact
skeleton pin. No file the feedback verifier judges is edited, so no live
episode. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-037's bonuses item, cut into a bounded child
at the operator's 2026-09-08 correction. Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: no stop condition. Register
row FUP-0024, the critical-path plan's deferred pattern-workshop entry, is
allocated to WO-091 to WO-095 by the 2026-09-19 cleanup pass and reopens
if one of them is withdrawn. Amended by the 2026-09-28 planning pass,
which re-observed the order on `main` at `5f3849ec`: the hash claim no
fixture pair could isolate is replaced by the compiled emissions, the
two-emission bonuses stay five bonuses with the lowering in WO-092, and
the umbrella's rules and both gates are stated here
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-092 merged (bonus emissions live in the sets collection);
WO-093 merged (the pieces the bonuses count).
**Recommended placement:** after WO-093 and before WO-095 in the serial run
(`docs/planning/sequence.md`). This order edits the 5S set's definition
beside WO-093's mechanics under `packages/skeleton/src/loadouts/`, its
fixtures, and products 04 and 05; it edits no compiler source. WO-093,
before it, edits the same module and product 05; WO-095, next, renders the
set. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-092",
    "relation": "hard",
    "reason": "bonus emissions live in the sets collection"
  },
  {
    "workOrderId": "WO-093",
    "relation": "hard",
    "reason": "the pieces the bonuses count"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 05-pattern-library.md §5S / 6S — the
maintenance organism and the status paragraph under the document's title
(set bonuses as planned work); 04-interfaces.md §RPG / Path-of-Exile view
(the set-bonus bullet); `packages/compiler/src/types.ts` (the
`SupportEmission` kinds); `README.md` §The game is not decoration (set
bonuses "are meant to compile"); `docs/control/doc-ceilings.json`;
`docs/work-orders/WO-037-five-s-equipment-set.md` (the superseded
umbrella; history only); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Two of five: every Sort candidate carries a proposed
canonical home (evidence-schema); three: every cleanup invokes an integrity
check (verifier episode); four: a recurring repair proposes a
standardization (evidence field and work-order obligation); five: the cycle
schedules its own bounded reevaluation (a cadence in the evaluable subset);
six with Safety: a destructive change is legal only with isolation,
evidence, independent verification and explicit approval (permission guard
plus statechart gate), which the Gardener's base rank refuses.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No set bonus is implemented. Product 04 states the bonuses as a mechanic
  ("Set bonuses compile to real mechanics"), product 05's status paragraph
  lists set bonuses as planned work, the compiler README lists them as
  deferred, and the root README says they "are meant to compile", the
  phrase the order as filed quoted.
- The emission kinds the bonuses name exist: `evidence-schema`,
  `verifier-episode`, `work-order`, `cadence`, `permission-guard` and
  `statechart-gate` (`packages/compiler/src/types.ts`).
- The semantic hash covers the whole compiled program
  (`packages/compiler/src/normalize.ts`), and WO-092 lists each bonus
  armed or dark in it, so a dark bonus already enters the hash of a graph
  that defines it, and arming adds one equipped piece. The order as filed
  asked a fixture to show that an emission changes the hash only when
  armed, which no pair of graphs isolates.

**Design (scope discipline):**

- The gate is the deliverable; the authority is not.
- The bonuses are data in WO-092's list form: the four-piece bonus lowers
  an evidence-schema field and a work-order obligation, the six-piece
  bonus a permission guard and a statechart gate; each remains one of the
  five bonuses.
- The compiler files no ProductSuggestion for the four-piece bonus's
  standardization proposal.
- The Repo Gardener's base rank holds no deletion authority, so the Safety
  gate compiles and refuses in the fixture; it refuses as well when
  isolation, evidence, independent verification or explicit approval is
  absent or does not decode.
- A bonus is proved on the compiled program's emissions and listing, not
  on its hash.
- **Declined alternatives, recorded:** a hash comparison per bonus (the
  listing and the added piece change the hash by themselves; reopen when a
  fixture pair can hold the listing constant); seven one-emission bonus
  entries (WO-092's decision; reopen with it).

**Deliverables:** the bonuses, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. For each of the five bonuses, a fixture proves that one piece short of
   its count the compiled program lists it dark and holds none of its
   emissions, and at its count lists it armed and holds each of its
   emissions, two for the four-piece and six-piece bonuses.
2. The Safety gate compiles and refuses the destructive change in a
   fixture, and refuses it in fixtures where isolation, evidence,
   independent verification or explicit approval is absent or does not
   decode. The criterion is judged against the declared set; a case
   outside it is a follow-up, not a failure.
3. Write-backs land, each in place with no dated paragraph: 04 §RPG /
   Path-of-Exile view (the set-bonus bullet: the bonuses implemented for
   this set, the rest still planned; at most 200 bytes added, against
   1,194 bytes of headroom on 2026-09-28) and 05's status paragraph under
   the title and §5S / 6S — the maintenance organism, which call set
   bonuses planned (at most 200 bytes, against 2,544). WO-092, WO-116,
   WO-117, WO-081 and WO-083 also write 04, and WO-093 also writes 05, so
   the executor re-measures the headroom at its base; where the bound
   does not fit, it consolidates the section it edits in the same change;
   a ceiling is raised only by a planning-document decision. The
   decisions file; the publication locks refreshed.
4. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because every file
under `packages/skeleton/src/loadouts/` is a declared source of the
harness-fixtures and harness suites, and again at final review. No live
row.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the scenario and render (WO-095); real deletion authority;
compiler lowering (WO-092); a hash-level proof per bonus.

**Operator-review assumptions**

1. Evidence-gated escalation stays a preserved candidate.
