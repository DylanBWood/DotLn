# WO-098 — Rule migration batch 1b: six more units including one role-skill unit and one cadence unit complete the selection rule, the whole-set measurement is reported, and the batch template names batch two (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Six compiled units, the measurement and
the template, with the `feedback-v1` extension their rung-seven and cadence
units need and a compiler minor release. Assigned at activation under the
standing opt-out default.
**Cost:** adds six feedback units, one lowering to a role skill and one
cadence-shaped, with their incidents, fixtures, maturity stats and
lowering; the extension WO-097's assumption 2 takes, widened to a
rung-seven and a cadence handler kind; the whole-set measurement; the batch
template; at most 200 bytes each in products 02, 06 and 13; one sentence
in the root README; a capability-table row. Removes each hand-written
always-on sentence a new unit covers. Re-mints: the same sources as WO-097;
`packages/compiler/src/feedback.ts`,
`packages/skeleton/src/loadouts/feedback.ts`,
`packages/skeleton/src/feedback-boundary.ts`,
`packages/skeleton/src/feedback-selfhost.ts` and
`packages/skeleton/test/feedback-fixtures.test.ts` are judged by the
feedback verifier, so the executor runs one live feedback self-host
episode on Codex `gpt-6-sol` or Claude Code `claude-opus-5-5`, at `xhigh`,
which needs no authorization and whose cost is accepted; they,
`packages/compiler/src/harness.ts`, `packages/compiler/package.json` and
the loadout that holds a retired sentence are registered, so each other
edition they stale is re-minted deterministically; the compiler release
moves the policy hash the console binds, so the console's self-host
fixtures are re-pinned to the new edition (WO-154 D011; WO-162 D012).
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the second half of WO-040's batch one, cut into
a bounded child at the operator's 2026-09-08 correction. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: the selection, measurement and template rules are stated here,
the directed-load claim states what holds when a role's total does not
fall, the restatement search declares its set, the contract default is
named, the live episode is the executor's, the registered and judged
sources and both gates are named, and register row FUP-0025 (rule migration batch
one, allocated to WO-096 to WO-098 and WO-113) is carried here
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: applies with force.
**Depends on:** WO-097 merged (the first half's retirements and
bookkeeping).
**Recommended placement:** in the serial run, directly after WO-097; the
same surfaces, plus products 06 and 13, the root README and the capability
table. WO-091, after it, edits the compiler package and products 02 and 10.
A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-097",
    "relation": "hard",
    "reason": "the first half-batch's retirements and bookkeeping"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Feedback (the
mechanism hierarchy) and §Feedback compiler v1; 06-roadmap.md §Application
version pending — Harness lowering and rule migration → WO-039 + WO-040;
13-uifa-roles.md §Assistance the platform owes each role; `README.md` §What
runs today; `docs/work-orders/WO-096-migration-ledger.md` (the always-on set
and the selection rule); `docs/work-orders/WO-097-rule-migration-batch-1a.md`
(the unit, contract and retirement rules); `docs/evidence/WO-039/README.md`
(criterion 6's method); `scripts/harness-context.mjs` and
`scripts/lib/harness-context.mjs`; `packages/kernel/src/types.ts`
(`Cadence`); `packages/compiler/src/harness.ts` (the role-skill lowering);
`packages/skeleton/README.md` §Feedback compiler and bounded self-hosting;
`docs/control/budgets.json`; `docs/planning/capability-table.md`;
`docs/control/doc-ceilings.json`;
`docs/work-orders/WO-040-rule-migration-batch-one.md` (history: the
umbrella's rules, stated below as they now hold); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Six more units including at least one role-skill unit (rung
seven) and one cadence-shaped unit, so that across the twelve every
lowerable category has a member and at least eight sit at rung one or two;
at least one `reference` recorded beside them; the whole-set measurement
(shapes by status and governance mode before and after; every role's
directed-load total before and after, with what moved it; the list of
remaining sentences with reasons; the verifier's restatement search); the batch template recorded;
batch two's candidates named in the ledger.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The success metric the vision names has never been reported as a number:
  no count of shapes by status or governance mode exists, because no
  migration ledger exists. Two partial numbers do: WO-011's receipt reports
  2,393 fewer instruction bytes in a matched projection, and WO-039's
  criterion 6 method measures each role's directed load
  (`measureHarnessContext` in `scripts/harness-context.mjs`, exercised by
  the harness fixtures, where a role that is not lower is an advisory).
- Each equipped unit gives every role skill one generated line (ten lines,
  1,899 bytes in the executor skill at `5f3849ec`, about 190 bytes each),
  and a hook-lowered unit a residue line in the instruction file for the
  Codex profile, so twelve new units add text to every role's directed load
  before any sentence is retired. WO-167 folds the guide earlier in the
  sequence, so the load moves before this order's base; the executor
  re-measures at its base.
- No handler has rung seven and none carries a kernel `Cadence`; the
  rung-seven and cadence units need handler kinds the closed vocabulary
  lacks.
- The table under 13 §Assistance the platform owes each role names WO-040
  in the engineer and tester rows, and 06's harness-lowering rung says the
  Contributor holds the ten personal units.
- Products 02, 06 and 13 hold 2,776, 1,802 and 539 bytes of headroom at
  `5f3849ec`; WO-086 and WO-087 restructure 06 earlier in the sequence.

**Design (scope discipline):**

- The umbrella's measurement rules hold, directional and derived; they are
  stated here from WO-040 as they now hold.
- **Selection.** Across the twelve of WO-097 and this order, the selection
  rule WO-096 states holds; this half adds at least one unit lowering to a
  role skill at rung seven and one cadence-shaped unit (a wait, retry or
  stall threshold expressed as a kernel `Cadence`). At least one `reference`
  row is recorded beside them; a reference is not a unit, is not counted
  among the twelve and never counts as `mechanism`.
- **Units, contract and retirement** are as WO-097 states them: the full
  unit shape; the `feedback-v1` extension of its assumption 2, here also
  admitting a rung-seven and a cadence kind, each only where no existing
  kind fits; no new refusal; retirement from the always-on set WO-096
  declares, with pinned hashes and the reverse mapping; the cold-start
  ceiling rule of `docs/control/budgets.json`.
- **The whole-set measurement.** Shapes by status and governance mode at
  WO-097's activation base and after this order; every role's directed load
  by WO-039's criterion 6 method at both points; the hand-written always-on
  sentences that remain, each with why it could not be retired here; the
  verifier's restatement search over the always-on set WO-096 declares.
- **Directed load is reported, not required to fall.** The generated
  line each unit adds to every role skill counts in that role's load, so
  twelve units add text before any retirement. Each role's total is
  reported at both points with the bytes the units' generated text adds
  and the bytes the retirements remove; a role whose total rose is named
  with that split. The direction the order requires is in the counts:
  more `mechanism`, less `prose`.
- **The batch template.** The result records the procedure as a template
  (selection rule, classification, unit shape, lowering, measurement,
  write-backs) so that batch two is cut by copying it, and the rows name
  batch two's candidates.
- **Declined alternatives, recorded:** every role's directed load
  strictly lower, as the umbrella required (the generated role text each
  unit adds makes it depend on retirements no order bounds; reopen when
  the generated line per unit leaves the role skills); a scoring model for
  which rule
  matters (the attention policy's frequency baseline is measured, not
  assumed); migrating every shape in one order; prose units at rung nine
  for convenience (a shape that lowers only to always-on prose is a
  `reference` or a finding, not a unit).

**Deliverables:** the units, the reference, the measurement, the template,
the write-backs below.

**Acceptance criteria (all required)**

1. Six units with the full shape and regression fixtures, at least one
   lowering to a role skill at rung seven and one cadence-shaped; across the
   twelve the selection rule WO-096 states holds; at least one `reference`
   row is recorded, and the render counts it under `reference` and `none`,
   never among the units or under `mechanism`.
2. The `feedback-v1` extension compiles the twenty-two units, with a
   fixture for each new handler kind and one refusing an inventory above
   the bound; each unit lowers through `harness-v1`;
   `npm run harness -- check` passes on the regenerated bundle;
   `scripts/test-harness.mjs` covers each new hook; the generated
   instruction block still names five refusals.
3. Each unit's sentence in the always-on set is removed with its hash
   pinned and its absence asserted; the reverse-mapping fixture maps every
   sentence removed across the twelve to a covering unit and fails on a
   fixture removal without one; a cold-start ceiling the regenerated text
   exceeds is raised or accepted as `docs/control/budgets.json` states.
4. The measurement is directional and derived: the `mechanism` count is
   higher and the `prose` count lower after this order than at WO-097's
   activation base; every role's directed-load total by WO-039's criterion
   6 method is reported at both points with the split the Design states;
   the verifier searches the always-on set WO-096
   declares for a restatement of each `mechanism` row, records the search,
   and a restatement found reverts that row to `prose` before the counts are
   reported; the remaining sentences are listed with reasons. The criterion
   is judged against the declared set; a case outside it is a follow-up,
   not a failure.
5. The template is recorded in the result and the rows name batch two's
   candidates.
6. Write-backs land, each in place with no dated paragraph: 02 §Feedback
   compiler v1 (the batch and the extension; at most 200 bytes added,
   against 2,776 bytes of headroom on 2026-09-28; WO-065, WO-066, WO-058,
   WO-097, WO-091 and WO-092 also write 02); 06 §Application version
   pending — Harness lowering and rule migration → WO-039 + WO-040 (the
   rung's status; at most 200 bytes added, against 1,802; WO-086 and WO-087
   restructure 06 first, and WO-061, WO-066, WO-124, WO-112, WO-083, WO-095
   and WO-096 also write it); 13 §Assistance the platform owes each role
   (the engineer and tester rows; at most 200 bytes added, against 539;
   WO-083 also writes 13). For each document the executor re-measures the
   headroom at its base; where the bound does not fit, it consolidates the
   section it edits in the same change; a ceiling is raised only by a
   planning-document decision. The root README §What runs today (one
   sentence folded in, rewriting what it supersedes); a dated
   capability-table row `feedback.migration` with the counts; the decisions
   file; the publication locks refreshed.
7. The deterministic re-mints the Cost line names are recorded. After the
   last edit to a judged source the executor runs one live feedback
   self-host episode on Codex `gpt-6-sol` or Claude Code `claude-opus-5-5`,
   at `xhigh` (`packages/skeleton/README.md` §Feedback compiler and bounded
   self-hosting), records it as a new feedback edition and re-pins the
   console's self-host fixtures to it; the decisions record the
   configuration. A repair that edits a judged source again runs another
   the same way.
8. The executor runs the local-terms check (`npm run terms -- check
   <paths>`) over every committed row and unit text with the operator's
   list present, reported and not assumed; the verifier reads each
   incident summary against the lineage reference it cites; the kernel is
   unchanged. Only where the list is absent from the machine does the
   executor record this criterion unmet with that command; it then closes
   by a run with the list or by a recorded waiver.
9. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts; the measurement; the feedback
edition; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because `packages/skeleton/src/loadouts/` is a
declared source of harness-fixtures and harness, and again at final
review. The live row is the executor's feedback self-host episode
(criterion 7).

**Write-back duty:** as listed in criterion 6.

**Non-goals:** batch two onward (the recorded candidate, one batch per
wave); a sixth refusal; any kernel change.

**Operator-review assumptions**

1. Employer-specific shapes stay excluded by default.
2. This order takes the contract extension WO-097's Design decides,
   widened to a rung-seven and a cadence handler kind.
3. Directed load is a reported comparison, not a required fall; the
   counts carry the direction.
4. The live feedback episode runs on one of the two configurations the
   operator set on 2026-09-28, with no authorization and its cost
   accepted.
