# WO-091 — Multi-active link groups: one link group may hold several active mechanics sharing linked supports, with per-active emissions, the commutativity rule per active, a visible six-link budget, and every pinned hash unchanged (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. Compiler lowering capability; existing
programs keep their hashes. Assigned at activation under the standing
opt-out default.
**Cost:** adds multi-active lowering to `packages/compiler/src/compile.ts`,
a budget signal for a multi-active group beyond six links as an additive
field of the compiled program (`packages/compiler/src/types.ts`),
fixtures, and at most 400 bytes in product 02 and 200 in product 10.
Removes the refusal of every graph that holds more than one active, which
keeps the 5S set from compiling. WO-092 and WO-093 declare a hard
dependency on it. Re-mints: deterministic, each edition selected in
`docs/evidence/current.json` whose check `compile.ts`, `types.ts` or
`packages/compiler/package.json` stales; the compiler release moves the
policy hash the console binds, so the feedback edition is carried
(`feedback-evidence --carry`), the console is re-pinned, the four console
self-host fixtures that record that hash follow the label (WO-154 D011;
WO-162 D011 and D012) and the harness bundle, whose manifest records the
label, is regenerated; in the files the feedback verifier judges only the
release label moves, so no live episode. Wall-clock, tokens and context
bytes are unknown until run.
**Nomination provenance:** WO-037's first design item, cut into a bounded
child at the operator's 2026-09-08 correction; the ledger's "Shared
supports across multiple actives". Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: no stop condition. Register
row FUP-0024, the critical-path plan's deferred pattern-workshop entry, is
allocated to WO-091 to WO-095 by the 2026-09-19 cleanup pass and reopens
if one of them is withdrawn. Amended by the 2026-09-28 planning pass,
which re-observed the order on `main` at `5f3849ec`: the pinned hashes and
fixtures are named as they stand, the over-budget signal no longer
refuses a program that compiles today, and the re-mints and both gates
are named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-008 merged (compiler v1; satisfied at `v0.4.0`); WO-016
merged (one reactor; satisfied at `v0.3.6`); WO-023 merged (the Entropy
Reducer; satisfied at `v0.5.0`); WO-029 merged (artifact identity;
satisfied at `v0.9.0`). The dated planning deferral until WO-053 is met:
WO-053 passed final review on 2026-09-18 (closed, `v0.29.3`).
**Recommended placement:** first of the five workshop orders in the serial
run, after WO-098 (`docs/planning/sequence.md`). This order edits
`packages/compiler/src/compile.ts` and `types.ts`, their tests and
fixtures, products 02 and 10, the console's pins and the self-host
fixtures the release moves, and the harness bundle. WO-092, next, edits
the same compiler sources and both products. A recommendation, not a
dependency token.

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
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "Horizon 2 does not advance the missing work loop",
    "until": "WO-053"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §LoadoutGraph v1
payload contract ("exactly one active mechanic, at most one participating
link group", within its §Authority grants and trusted admission at
`5f3849ec`) and §Identity and composition (the six-link default budget);
03-architecture.md §Composition system (precedence, commutativity,
pipelines); 10-ir-compatibility.md §Separate version axes;
`packages/compiler/src/compile.ts`; `packages/compiler/src/types.ts`
(`Container`, `ExplicitPipeline`, `CompiledProgram`, `CompileResult`);
`packages/compiler/test/artifact-identity.test.ts`;
`scripts/lib/evidence-sources.mjs`; `docs/evidence/WO-154/decisions.md`
D011 and `docs/evidence/WO-162/decisions.md` D011 and D012 (what a
compiler release owes); `docs/control/doc-ceilings.json`;
`docs/work-orders/WO-037-five-s-equipment-set.md` (the superseded
umbrella; history only); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Extend lowering so one link group may hold several actives
sharing linked supports: each active keeps its own WorkOrder seed, envelope
and claims; a shared support's emissions apply per active; precedence and
commutativity apply per active; a non-commuting pair still needs an
explicit pipeline; a multi-active group beyond six links still compiles
and carries a visible signal naming the decomposition question;
single-active programs normalize and hash exactly as before.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Compiler v1 refuses a graph that holds other than one active, more than
  one participating link group, or more than one explicit pipeline in it
  (`packages/compiler/src/compile.ts`, lines 555–581 at `5f3849ec`; the
  executor re-measures line ranges at its base). The 5S set needs several
  actives in one group; two 5S actives exist, in two programs: Seiri in
  `packages/compiler/src/seiri.ts` and Seisō in the Entropy Reducer, where
  Seiketsu is a support, not an active.
- The single-active Entropy Reducer already links eight supports in one
  group, in a container whose `socketBudget` equals that count
  (`packages/skeleton/src/loadouts/entropy-reducer.ts`). A group larger
  than its container's `socketBudget` refuses as INVALID GRAPH.
- Every compile diagnostic refuses: a successful `CompileResult` carries
  an empty `diagnostics` tuple (`compile.ts`; `types.ts`). A diagnostic at
  seven links refuses the eight-link Entropy Reducer if applied to every
  group, and every multi-active group over six if applied to those alone.
- An `ExplicitPipeline` names a link group, not an active; the program
  fields added since v1, `grants` and `presence`, are omitted when empty
  so existing programs keep their bytes (`types.ts`).
- The Entropy Reducer's pinned hash is `fnv1a64:e3505eb7f111ba22`
  (`packages/compiler/fixtures/wo029-identities.json`); the order as filed
  named `fnv1a64:c5ddbca75f1c4cee`, which WO-142, WO-100 and WO-165 moved.
  Seiri's `fnv1a64:9ca8d0229c6bd8db` is unchanged, and three Contributor
  builds, the Plan Refuter, the Mission Check and the reviewer work order
  are pinned too (`packages/skeleton/test/`).

**Design (scope discipline):**

- The floor from WO-042 applies per active.
- Commutativity is judged per active: two supports linked to one active
  that do not commute need an explicit pipeline. That pipeline is the
  group's, since a pipeline names a group and v1 still lowers at most one
  per group; it orders the pair for every active that links both.
- The six-link budget is visible, not a cap (assumption 1), so its signal
  is not a diagnostic. It applies to a group with more than one active
  and more than six links; a program with one active carries none, so the
  Entropy Reducer and every other single-active program keep their bytes.
  The container's `socketBudget` stays the cap it is today. The signal is
  an additive program field, omitted when absent as `grants` and
  `presence` are (assumption 2).
- A graph the widened lowering cannot place refuses with a diagnostic
  naming the group or active, as today: links in more than one
  participating group, or two explicit pipelines in the group. No active
  is dropped from a program that compiles.
- **Declined alternatives, recorded:** a new schema version; a blocking
  over-budget diagnostic at seven links (it caps multi-active groups,
  which assumption 1 excludes, and applied to every group it refuses the
  Entropy Reducer that criterion 1 keeps; reopen when a planning document
  makes the budget a cap); an advisory beside a successful
  `CompileResult`, outside the hashed program (it changes the result type
  for every consumer; reopen when a consumer needs the signal outside the
  hashed program).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `packages/compiler/src/types.ts`: add `DEFAULT_LINK_BUDGET = 6`;
   `CompiledActive { activeMechanicId; linkedSupportFacetIds; semantics; workOrder; authorityEnvelope; effectiveClaims; inspection }`;
   `LinkBudgetSignal { linkGroupId; linkCount; defaultBudget; question }`; optional
   `CompiledProgram.actives?` and `linkBudget?`, both omitted for one active (decided
   2026-10-07: these names; a shared support's emissions are listed per active, since each
   active's lowering is independent). Check: `node scripts/build.mjs`.
2. `packages/compiler/src/compile.ts` `graphDiagnostics` (line 555): refuse only zero actives
   (`SEMANTICS UNSUPPORTED: no active mechanic`); keep the blocks at 565 and 575 byte-identical
   except that each refusal now names its `linkGroupId` or `activeMechanicId` (today both
   build `diagnostic("SEMANTICS UNSUPPORTED", msg)` with counts only; the Design's "as today"
   is corrected by this step).
3. Same file: add `supportsLinkedTo(graph, activeMechanicId)` beside `supportsInGroup` (line
   223); `conflictDiagnostics` (245) and `resolveClaims` (322) iterate per active; the
   pipeline lookup stays by group.
4. Same file `emitProgram` (line 763): move the per-active body into
   `lowerActive(graph, environment, active, supports, claims)`. One active: today's object
   unchanged. Several: the top-level `workOrder`, `authorityEnvelope`, `inspection` and
   `authorityExpiresAt` come from the first active by normalized id (decided 2026-10-07);
   `actives` lists each; `linkBudget` lists each group over six links.
5. `compileLoadout` (line 1024): run `grantEnvelopeDiagnostics` and
   `inspectionAuthorityDiagnostics` (`authority.ts`) per `actives` entry; presence with
   several actives refuses `SEMANTICS UNSUPPORTED: presence with several actives` (decided
   2026-10-07).
6. `packages/compiler/test/multi-active.test.ts` (new): "WO-091 three actives sharing two
   supports compile per active, no signal"; "WO-091 a non-commuting pair on one active needs
   the group pipeline"; "WO-091 a pair split across two actives needs none"; "WO-091 a seventh
   link in a seven-socket container carries the signal"; "WO-091 two groups and two pipelines
   refuse with the named diagnostics"; "WO-091 every active of a compiling fixture is in its
   program". Check: `node scripts/build.mjs && node --test packages/compiler/dist/test/multi-active.test.js`
   (the `compiler` row).
7. The pinned literals stay: Seiri `9ca8d0229c6bd8db` (compiler tests presence line 346,
   tooltip 66 and 112 to 114, views 203 to 205; skeleton `cli.test.ts` 27 to 29 and 75;
   `wo029-identities.json` line 6; `wo051-inspection-baseline.json` line 121); Entropy
   Reducer `e3505eb7f111ba22` (`wo029-identities.json` line 66); Contributor
   `fcf61a6d699e7ffd`, `06245f5c581212f1`, `87aa6e1263d6d74d` (`executor-supports.test.ts`
   341, 360, 371); Plan Refuter `e9f7e0080fcb9810` and Mission Check `4c09a5d98f6bc433`
   (`entropy-reducer.test.ts` 46, 50); the reviewer order `ecb0eca5675332f7`
   (`entropy-reducer-artifacts.test.ts` 314; receipt `b81d0609ee2e9fed` line 262). Check:
   `git diff --exit-code <base> --` on the five frozen fixtures.
8. Labels: `packages/compiler/package.json`, `COMPILER_PACKAGE_VERSION`
   (`packages/compiler/src/artifact-identity.ts` line 15), the skeleton compiler pin
   (`packages/skeleton/package.json` line 18), `packages/console/package.json` line 28,
   `package-lock.json` lines 480, 491 and 513. Check: `npm run release -- check-surfaces --local`.
9. Re-mints: select WO-091 revision 001 for all four kinds in `docs/evidence/current.json`;
   `node scripts/build.mjs`; `node scripts/harness.mjs emit`;
   `node scripts/authority-evidence.mjs --write`, `node scripts/artifact-identity-evidence.mjs --write`,
   `node scripts/verification-evidence.mjs --write`;
   `node scripts/feedback-evidence.mjs --carry <the edition selected at the base>`;
   `node scripts/console-fixtures.mjs --record-current-selfhost`; then each `--check` and
   `node scripts/harness.mjs check`.
10. Write-backs: product 02 §"#### Authority grants and trusted admission" under
    §"### LoadoutGraph v1 payload contract": rewrite the sentence at lines 522 to 526
    ("Compiler v1 lowers exactly one active mechanic...") to the multi-active rule and the
    signal, in place; product 10 §"## Separate version axes": one sentence after lines 41 to
    49 on the additive fields and the compiler version; `packages/compiler/README.md` line
    113: drop "multi-active lowering" from the deferred list; `docs/evidence/WO-091/decisions.md`
    (new, with the pinned-literal list); `node scripts/check-publication.mjs --print-locks`
    into both `docs/publication/*-toc.md` `Source lock:` lines; `npm run meta`;
    `npm run work-orders -- index`; `npm run publication:check`.
11. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-091/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the lowering, the budget signal, fixtures, the re-mints,
the write-backs below.

**Acceptance criteria (all required)**

1. The semantic-hash literals that tests and fixtures under `packages/`
   pin at the order's base keep their values (at `5f3849ec`: Seiri, the
   Entropy Reducer, three Contributor builds, the Plan Refuter, the
   Mission Check, the reviewer work order); the executor lists each with
   its file in the decisions file. The frozen WO-003 oracle
   `packages/skeleton/fixtures/wo003-decision-traces.json` and the four
   WO-029 fixtures (`packages/skeleton/fixtures/wo029-cli.txt` and
   `wo029-legacy-scenario.jsonl`,
   `packages/compiler/fixtures/wo029-identities.json` and
   `wo029-entropy-reducer.json`) are byte-identical to the order's base;
   the identity test binds `compilerPackageVersion` to the running
   compiler, so the release label changes none of them. The criterion is
   judged against the declared set; a case outside it is a follow-up, not
   a failure.
2. A fixture group with three actives sharing two supports (six links)
   compiles with per-active emissions and no budget signal; a
   non-commuting pair linked to one active refuses without the group's
   explicit pipeline and compiles with it; the same group with a seventh
   link, in a container whose `socketBudget` admits seven, compiles and
   carries the signal with the link count, the six-link default and the
   decomposition question.
3. A fixture whose actives' links name two groups, and one with two
   explicit pipelines in the group, each refuse with the existing
   diagnostic; every active of a fixture that compiles appears in its
   program.
4. Write-backs land, each in place with no dated paragraph: 02
   §LoadoutGraph v1 payload contract (the v1 lowering sentence states the
   multi-active rule and the signal, in place with no dated paragraph (ceilings are planning's since the 2026-10-07 pass)) and 10 §Separate version
   axes (the additive lowering and the compiler version). WO-092, WO-097
   and WO-098 also write 02, and WO-076, WO-092, WO-097 and WO-194 also
   write 10; a
   ceiling is raised only by a planning-document decision. The decisions
   file; the publication locks refreshed.
5. Every edition the Cost line names is re-minted or carried, the console
   re-pinned with its self-host fixtures and the harness bundle
   regenerated; the decisions file records each.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; kernel unchanged.

**Evidence gate:** the fixture transcripts; the list of pinned literals;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `packages/compiler/src/compile.ts` is a declared source of the
authority-, artifact-, verification-, feedback- and harness-evidence
suites, and again at final review. No live row.

**Write-back duty:** as listed in criterion 4.

**Known issues and carry-ins:**

- 2026-10-07 pass: stale and corrected above: products 02 and 10
  headroom and co-writers; the Design's claim that the existing refusals
  name the group or active (they give counts only; step 2 names them);
  the Cost line omitted the version labels, the lockfile lines and the
  compiler README sentence (steps 8 and 10).
- Decided by the 2026-10-07 pass: the `actives` and `linkBudget` fields;
  per-active emissions; the first active fills the top level; presence
  with several actives refuses; zero actives refuses. Reopen: a consumer
  needs a merged top level.

**Non-goals:** sets (WO-092); the 5S mechanics (WO-093); more than one
participating link group or explicit pipeline per group; the budget as a
cap.

**Operator-review assumptions**

1. The six-link budget stays a visible budget, not a cap.
2. The budget signal is a field of a multi-active group's compiled
   program, so it enters that program's semantic hash while single-active
   programs keep their bytes.
