# WO-097 — Rule migration batch 1a: six new units at rung one or two compile through the harness target into the Contributor build, each retiring its always-on sentence with the reverse mapping proven (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. Six compiled units, their lowering and
the compatible `feedback-v1` extension they need to compile, with a
compiler minor release. Assigned at activation under the standing opt-out
default.
**Cost:** adds six feedback units with their incidents, regression
fixtures, maturity stats and lowering; the `feedback-v1` extension
assumption 2 takes; the regenerated harness bundle; the pinned retirements
and the reverse-mapping fixture; and at most 200 bytes each in products 02
and 10. Removes each hand-written always-on sentence a new unit covers. It
unblocks WO-098, which depends on it. Re-mints:
`packages/compiler/src/feedback.ts`,
`packages/skeleton/src/loadouts/feedback.ts`,
`packages/skeleton/src/feedback-boundary.ts`,
`packages/skeleton/src/feedback-selfhost.ts` and
`packages/skeleton/test/feedback-fixtures.test.ts` are sources the feedback
verifier judges, so the executor runs one live feedback self-host episode
on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, which
needs no authorization and whose cost is accepted; they,
`packages/compiler/src/harness.ts`, `packages/compiler/package.json` and
the loadout under `packages/skeleton/src/loadouts/` that holds a retired
sentence are registered sources, so each other edition they stale is
re-minted deterministically; the compiler release moves the policy hash the console
binds, so the console's self-host fixtures are re-pinned to the new
edition (WO-154 D011; WO-162 D012). Wall-clock, tokens and context bytes
are unknown until run.
**Nomination provenance:** the first half of WO-040's batch one, cut into a
bounded child at the operator's 2026-09-08 correction. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: the unit, retirement and reverse-mapping rules are stated here,
the compiler's ten-unit, one-per-handler contract and the default this
order takes are named, a new unit adds no refusal, the live episode is
the executor's, the registered and judged sources and both gates are
named, and
register row FUP-0025 (rule migration batch one, allocated to WO-096 to
WO-098 and WO-113) is carried here
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: applies with force.
**Depends on:** WO-096 merged (the ledger rows the batch selects from).
**Recommended placement:** in the serial run, directly after WO-096. This
order edits `packages/compiler/src/feedback.ts` and `harness.ts`, the
compiler's `package.json`, `packages/skeleton/src/loadouts/` (`feedback.ts`
and the loadout that holds a retired sentence),
`packages/skeleton/src/feedback-boundary.ts` and `feedback-selfhost.ts`,
`packages/skeleton/test/feedback-fixtures.test.ts`,
`scripts/test-harness.mjs`, the regenerated bundle, the migration rows,
`docs/control/budgets.json` where a ceiling moves, products 02 and 10, the
console README and the console's self-host fixtures; WO-098, after it,
edits the same surfaces. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-096",
    "relation": "hard",
    "reason": "the ledger rows the batch selects from"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Feedback (the
mechanism hierarchy) and §Feedback compiler v1; 10-ir-compatibility.md
§Separate version axes; `docs/work-orders/WO-096-migration-ledger.md` (the
row shape, the always-on set and the selection rule);
`docs/evidence/WO-011/README.md` (the per-unit measurement);
`packages/compiler/src/feedback.ts` (`FEEDBACK_HANDLERS`, the unit bound,
the handler uniqueness); `packages/compiler/src/harness.ts` (`hookFor`, the
refusal sentence); `packages/skeleton/src/loadouts/feedback.ts`;
`packages/skeleton/src/feedback-selfhost.ts` (the ten-fixture assertion);
`packages/skeleton/src/feedback-audit.ts` (`FEEDBACK_SOURCE_PATHS`);
`packages/skeleton/README.md` §Feedback compiler and bounded self-hosting;
`docs/control/budgets.json` (the cold-start ceilings and their rule);
`docs/evidence/WO-154/decisions.md` D011 and
`docs/evidence/WO-162/decisions.md` D012; `docs/control/doc-ceilings.json`;
`docs/work-orders/WO-040-rule-migration-batch-one.md` (history: the
umbrella's rules, stated below as they now hold); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Six new units, all at rung one or two (a deterministic check
or a generated hook), each complete (FeedbackUnit shape, a synthesized
incident citing public lineage, a regression fixture failing when the
mechanism is removed, maturity stats, handler, lowering into the Contributor
build), each retiring the always-on sentence that stated it with the
sentence's hash pinned and absence asserted, with the reverse-mapping
fixture proving every removed sentence has a covering unit.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Ten units are equipped. Four declare `mechanism.kind: prose`, the three
  Stop-time units advise, and the hooks of the six hook-lowered units do
  not fire under the Codex profile; the generated instruction block names
  five refusals and calls every other tool and completion judgment
  advisory. Compiled no longer means governed by mechanism.
- The compiler refuses an inventory above ten units and a second unit on a
  handler, and its handler vocabulary is closed at ten
  (`packages/compiler/src/feedback.ts` lines 11–22, 102–105 and 196–199 at
  `5f3849ec`; the same three checks stood at `33e2c25`). Six new units
  cannot compile without a change to `feedback-v1`.
- Seven handlers map to hook events (`hookFor`); the self-host asserts
  exactly ten fixtures (`packages/skeleton/src/feedback-selfhost.ts` line
  280 at `5f3849ec`); the console README and product 06's harness-lowering
  rung say ten.
- Each of the six role skills carries one generated line per unit (ten
  lines, 1,899 bytes in the executor skill at `5f3849ec`), and the
  instruction file carries a Codex residue line per hook-lowered unit. The
  reviewer's cold start is 24,171 bytes against its ceiling of 24,576. The
  executor re-measures these at its base.
- Ceilings are planning's since the 2026-10-07 pass; no byte figure binds
  this order.

**Design (scope discipline):**

- Six units, not twelve. The rules below are stated here from WO-040 as
  they now hold; the row shape, the always-on set and the selection rule
  are WO-096's.
- **Each unit is complete:** the full FeedbackUnit shape, a synthesized
  incident citing public lineage (never intake, which the compiler
  refuses), a regression fixture that fails when its mechanism is removed,
  maturity stats, its handler and its lowering through `harness-v1` into
  the Contributor build.
- **The contract.** This order takes the change its own rule implies: a
  compatible extension
  of `feedback-v1` whose unit bound holds the equipped units, in which a
  unit may share an existing handler kind that fits and a new kind is
  added only where none fits. The extension is recorded in 02 §Feedback
  compiler v1 and 10 §Separate version axes with a compiler minor release.
- **No new refusal.** A new unit's hook advises; the build's hard
  enforcement stays the five refusals the generated instruction block names
  (02 §Feedback compiler v1).
- **Retirement.** Each unit retires the hand-written sentence in the
  always-on set WO-096 declares (the instruction file outside its generated
  block, the role procedure and support text the role skills carry, the
  product 07 sections their `Read` directives name) that stated its rule:
  the sentence's hash is pinned and its absence asserted. A shape no such
  sentence states is not selected for the six. Each retired sentence maps
  to the unit that covers it, and a reverse-mapping fixture fails when a
  sentence removed in this order has no covering unit, so a byte fall
  cannot come from deleting a correction no unit carries.
- **Measurement.** WO-011's method for each unit: the mechanism present and
  removed, and the matched instruction-byte comparison with its prose
  equivalent.
- **Cold start.** Each new unit adds a generated line to every role skill,
  and a hook-lowered one a residue line where its hook does not fire. A
  cold-start ceiling in `docs/control/budgets.json` that the regenerated
  text exceeds is raised in the same change to the measured bytes plus one
  4 KB step with the units named, or the breach is recorded there as a
  dated acceptance, as that file's rule states.
- **Declined alternatives, recorded:** re-cutting the family to fit the
  ten-unit bound (fewer new units, or units that supersede equipped ones;
  it would leave most of the migrated shapes as prose; reopen when the
  extension breaks a consumer of `feedback-v1`); a sixth refusal for a
  rung-two unit
  (the current harness policy has five; reopen by a planning-document
  decision); a unit whose rule no always-on sentence states (it retires
  nothing here; a later batch may compile it).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07; the six shapes and the `retired` schema come from WO-096 at the base):**

1. `packages/compiler/src/feedback.ts`: export `FEEDBACK_UNIT_BOUND` (16 here, 22 after
   WO-098) and use it at line 103; add six `FEEDBACK_HANDLERS` keys at rung 1 or 2, one key
   per unit (keeping the duplicate-handler refusal at line 198), six `FeedbackRequest`
   variants and six `reason()` cases. Check: `npm run build`.
2. `packages/compiler/test/feedback.test.ts`: in the WO-011 case (line 44) change `Array(11)`
   to the bound plus one; add "WO-097 sixteen units compile and an inventory above the bound
   refuses". Check: `node --test packages/compiler/dist/test/feedback.test.js`.
3. `packages/compiler/src/harness.ts`: add each hook-lowered handler to `hookFor` (line 389;
   `PreToolUse` lowers at rung 2 and `PostToolUse` at rung 1, lines 781 to 787).
4. `packages/skeleton/src/harness-host.ts`: one `harnessFeedbackFacts` branch (line 2854) per
   new hook handler, building its request from `input.tool_input`.
5. `packages/skeleton/src/loadouts/feedback.ts`: a `batchOneAUnits` array (`version: 1`,
   `regressionFixtures: ["WO-097 regression <unitId>"]`, public `sourceRefs`, never
   `docs/intake/`) appended to `personalFeedbackUnits`; every role picks them up
   (`contributor.ts` line 54 maps all triggers).
6. `packages/skeleton/test/feedback-fixtures.test.ts`: one test per unit named exactly its
   fixture string; under `DOTLN_FEEDBACK_ABLATE=<unitId>` (line 31) it must fail by
   `ERR_ASSERTION` (`feedback-audit.ts` lines 226 to 231).
7. Counts: `packages/skeleton/src/feedback-selfhost.ts` line 280 to `program.units.length`
   and the strings at 236, 245 and 276 count-derived; `packages/skeleton/test/feedback-host.test.ts`
   line 130 and the three asserts in `packages/console/test/board.test.ts` (587, 627, 666)
   to the bound.
8. `scripts/test-harness.mjs`: one test per new hook, modelled on the WO-132 unit-removal case
   (line 2797); add the chained role oracle fixture
   `packages/skeleton/fixtures/wo097-role-baseline.json` and point the process-debt baseline
   test and `machinerySources["process-debt"]` at it. Check: `npm test -- --only harness-fixtures`.
9. Retirements: remove each covered sentence from CLAUDE.md above the harness marker, the
   `contributor.ts` procedure arrays or the 07 sections WO-096 pins; add `retired` records
   to `corpus/feedback/migration.json`; the reverse-mapping fixture fails when a record's
   `unitId` is not compiled or its text is still present, and every line
   `git diff <activation base> -- <always-on files>` removes must lie inside a record's text.
   Check: `npm run feedback -- migration --check`.
10. Regenerate: `npm run build && npm run harness -- emit`; `npm run harness -- check`;
    `node scripts/harness-context.mjs --check`; record each role root's bytes in the decisions
    (the ceilings advise; no acceptance ritual).
11. Live episode after the last judged edit:
    `npm run evidence:feedback -- --write --edition WO-097 --revision 001`, then the self-host
    on the pinned transport and `--record-selfhost`; re-mint authority, artifact-identity and
    verification; re-pin the console fixtures through `scripts/console-fixtures.mjs` as WO-162
    D012 directs.
12. `npm run terms -- check corpus/feedback/migration.json packages/skeleton/src/loadouts/feedback.ts`.
13. Write-backs: product 02 §"### Feedback compiler v1" (the unit bound and the per-unit
    handler rule, in place); product 10 §"## Separate version axes" (the compiler minor and
    the compatible `feedback-v1` extension); `packages/console/README.md` lines 316 to 317
    (rewrite without a count); `docs/evidence/WO-097/decisions.md` (the per-unit byte
    comparison, why no equipped unit carries each rule); `node scripts/meta.mjs`;
    `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
14. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-097/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the units, the extension, fixtures, retirements, the
regenerated bundle, the write-backs below.

**Acceptance criteria (all required)**

1. Six units at rung one or two, each with the full shape and a regression
   fixture that fails when its mechanism is removed; no unit reuses an
   equipped unit's id, and the executor records for each why no equipped
   unit already carries its rule.
2. The `feedback-v1` extension compiles the sixteen units; the compiler's
   refusals of an unknown handler, a duplicate unit id and a co-equipped
   superseded unit keep passing fixtures, and a fixture refuses an
   inventory above the new bound.
3. Each unit lowers through `harness-v1`; `npm run harness -- check` passes
   on the regenerated bundle; `scripts/test-harness.mjs` covers each new
   hook; the generated instruction block still names five refusals.
4. Each unit's sentence in the always-on set is removed with its hash
   pinned and its absence asserted; the reverse-mapping fixture maps every
   removed sentence to a covering unit among the sixteen and fails on a
   fixture removal without one; the per-unit instruction-byte comparison is
   recorded; a cold-start ceiling the regenerated text exceeds is raised or
   accepted as the Design states. The criterion is judged against the
   declared set; a case outside it is a follow-up, not a failure.
5. Write-backs land, each in place with no dated paragraph: the migration
   rows updated; 02 §Feedback compiler v1 (the extension, in place with no dated paragraph (ceilings are planning's: the 2026-10-07 pass set every product document's ceiling at measured bytes plus one tenth); WO-098,
   WO-091 and WO-092 also write 02); 10 §Separate version axes (the
   compiler release and the extension; WO-076, WO-091, WO-092 and WO-194
   also write 10). The console README's sentence that counts
   the mechanisms, rewritten without a count; the decisions file; the
   publication locks refreshed.
6. The deterministic re-mints the Cost line names are recorded. After the
   last edit to a judged source the executor runs one live feedback
   self-host episode on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh` (`packages/skeleton/README.md` §Feedback compiler and bounded
   self-hosting), records it as a new feedback edition and re-pins the
   console's self-host fixtures to it; the decisions record the
   configuration. A repair that edits a judged source again runs another
   the same way.
7. The executor runs the local-terms check (`npm run terms -- check
   <paths>`) over every committed row and unit text with the operator's
   list present, reported and not assumed; the verifier reads each
   incident summary against the lineage reference it cites; the kernel is
   unchanged. Only where the list is absent from the machine does the
   executor record this criterion unmet with that command; it then closes
   by a run with the list or by a recorded waiver.
8. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts; the pinned retirements and the
reverse-mapping fixture; the per-unit byte comparison; the feedback
edition; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because `packages/skeleton/src/loadouts/` is a
declared source of harness-fixtures and harness, and again at final
review. The live row is the executor's feedback self-host episode
(criterion 6).

**Write-back duty:** as listed in criterion 5.

**Known issues and carry-ins:**

- Stale on 2026-10-07 and corrected above: the reviewer's and executor's
  cold-start bytes and ceilings (the ceilings advise; WO-196 brings the
  roots under them first); the 02 and 10 headroom and co-writers.
- Decided by the 2026-10-07 pass: one handler key per unit; the
  `harnessFeedbackFacts` branches and the hard-coded tens are in scope
  (named above); the reverse mapping is typed (prose-parsing screen); the
  role oracle fixture chain is a named step.
- Blocked on WO-096 for the six shapes, the rows schema and the check
  script's name.

**Non-goals:** the skill and cadence units, the whole-set measurement and
the template (WO-098); a sixth refusal; any kernel change.

**Operator-review assumptions**

1. Six is a half batch; the selection rule is satisfied across both halves.
2. The compiler admits at most ten units, one per handler, from a closed
   vocabulary, and this batch needs more, so the order extends
   `feedback-v1` compatibly (the Design) with a compiler minor release.
3. A new unit adds no refusal; the five refusals stay the build's hard
   enforcement unless a planning document decides otherwise.
4. The live feedback episode runs on one of the two configurations the
   operator set on 2026-09-28, with no authorization and its cost
   accepted.
