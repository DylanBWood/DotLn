# WO-081 — Board Workstreams section: the actor board's Work panel renders workstreams over the same data the index groups, as an additive view-model extension with regenerated fixture expectations (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. An additive `uifa-board-v1` extension in
`packages/console`. Assigned at activation under the standing opt-out
default.
**Cost:** adds one section to the actor board's Work panel over the index's
workstream grouping, one fixture case with its pinned inputs and expected
outputs, the console's minor release, and at most 200 bytes in product 04.
Removes nothing that runs today: the board shows orders, not outcomes.
Re-mints: none; no path under `packages/console` is a registered evidence
source, and the release label the console's minor release writes into
`package-lock.json` is normalized out of every edition's projection
(`evidenceSourceContent` in `packages/skeleton/src/evidence-editions.mjs`;
`feedbackSourceFile` in `packages/skeleton/src/feedback-audit.ts`).
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-034's board half, cut into a bounded child at
the operator's 2026-09-08 correction. Amended by the 2026-09-28 planning
pass, which re-observed the order on `main` at `5f3849ec`: the fixture
workstream arrives as a new case so the existing cases keep their inputs,
the extension adds no schema field, the write-backs are bounded, the final
criterion names both gates, and register row FUP-0126 (the workstream
application, allocated to WO-080 to WO-083) is carried here
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-080 merged (the data it renders); WO-032 merged (the
board; closed, `v0.14.0`).
**Recommended placement:** in the serial run, directly after WO-080, its
hard dependency. This order edits `packages/console` (the Work panel's
projection, one fixture case, the README, and `package.json` for the minor
release), product 04 and the decisions file; WO-082, after it, adds a
fixture suite and edits product 12. Disjoint files. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-080",
    "relation": "hard",
    "reason": "the data it renders"
  },
  {
    "workOrderId": "WO-032",
    "relation": "satisfied-by-release",
    "release": "v0.14.0",
    "reason": "the board it extends"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 04-interfaces.md §Plural UI hosts, one
projection contract and §Actor board v0; 13-uifa-roles.md §UIFA showrunner;
`packages/console/README.md` (§Contract for another UI host);
`packages/console/src/work.ts` (`projectWork`);
`packages/console/src/text-sources.ts` (`parseWorkOrderIndex`);
`packages/console/uifa-board-v1.schema.json` (the section definition);
`packages/console/fixtures/manifest.json` (the five cases and their pinned
inputs); `docs/control/doc-ceilings.json`.

**Objective:** The Work panel gains a Workstreams section listing each
workstream's members with repository, base, phase, verdict, integration
state and staleness, from the index's data; the view model's extension is
additive and the recorded fixture expectations regenerate through the
existing command.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The board knows orders, not outcomes: the Work panel's five sections
  (`work-order-index`, `orders`, `worktrees`, `releases`, `usage`) hold
  none that groups orders, and `workstreamId` appears in the console only
  as the event scope that keys acceptance matrices in the Actors panel.
- The Work panel turns every field line of an index row into a cell, and
  the fixture manifest pins each case's inputs by SHA-256; the `control`
  case reads the pinned `workOrderIndex` input, so a workstream added to
  that input would change that case's existing sections too.
- `uifa-board-v1.schema.json` closes every object; a section is one element
  of a panel's `sections` array, with a free-form `id`.
- The console is component `0.3.1`; since the board shipped it has gained
  the runtime-status host and the resident command client.
- Product 04 holds 59,662 bytes under a ceiling of 60,856 at `5f3849ec`;
  the executor re-measures at its base.

**Design (scope discipline):**

- One section; no new panel; the text sources the board parses remain the
  pinned index text.
- The fixture workstream arrives as a new case with its own pinned index
  input. The five existing cases keep their pinned inputs, so their
  expected outputs change only by the new section: empty where the case's
  index holds no workstream, `unavailable` where the case has no index.
- The section is one more element of the Work panel's `sections` array, so
  the schema is unchanged; a new field on a view, panel, section or row
  would change the schema and is not part of this order.
- An index without a workstream grouping gives an empty section; an absent
  index, or a grouping the adapter cannot parse, makes the section
  `unavailable`, as for every other source.
- **Declined alternatives, recorded:** a separate workstream page; a
  workstream added to the `control` case's pinned index (it changes that
  case's existing sections; reopen if the pinned index is re-recorded for
  another reason).

**Deliverables:** the extension, the render, the new fixture case with
regenerated expectations, the write-backs below.

**Acceptance criteria (all required)**

1. A new fixture case, whose pinned index input holds the fixture
   workstream, renders the Workstreams section with every column and the
   stale mark. The five existing cases (`wo009`, `selfhost`, `control`,
   `refutations`, `missing`) keep their pinned inputs byte-identical, and
   their expected outputs differ from the base only by the new section.
2. The extension is additive: every case's view validates against the
   unchanged `uifa-board-v1.schema.json`, and a view without the section
   still renders in the text and HTML hosts.
3. Write-backs land, each in place with no dated paragraph: 04 §Actor board
   v0 (the section; at most 200 bytes added, against 1,194 bytes of
   headroom on 2026-09-28; WO-116, WO-117, WO-083, WO-092 and WO-094 also
   write 04, so the executor re-measures the headroom at its base, and
   where the bound does not fit it consolidates the section it edits in the
   same change; a ceiling is raised only by a planning-document decision);
   the console README §Contract for another UI host (the Work panel's row);
   the decisions file; the publication locks refreshed.
4. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts and the new case's expected
outputs; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because `docs/product/04-interfaces.md` is a
declared source of registrations, and again at final review. No live row.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** console v1; drag-equip authoring; any other panel; a new
schema field.

**Operator-review assumptions**

1. The showrunner is the consumer; the section is read-only.
