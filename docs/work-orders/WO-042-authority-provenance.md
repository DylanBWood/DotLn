# WO-042 — Authority provenance and monotone envelopes: a linked support may only narrow a compiled build's authority, widening needs an explicit provenance-bearing grant, and the tooltip projects GRANTS and RESTRICTIONS from the effective envelope (v0.16.0)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It changes compiler capability (a
validation floor, an additive `authorityGrants` graph collection, an additive
compiled-program field that normalization omits when empty, two diagnostic
codes, one correction kind, and one pure inspection projection) and bumps the
compiler package. The kernel, the `feedback-v1` and `verification-v1`
contracts, lifecycle legality and the event schema are unchanged. The
committed Contributor bundle is regenerated only because every generated hook
pins the compiler package version. Assigned at activation under the standing
opt-out default (06-roadmap.md §Release boundary).
**Nomination provenance:** WO-008 VER-001 finding F2 (2026-09-03, reproduced
in that order's FINAL-001) and its standing home in the planning map as the
unallocated composition candidate "claim-layer authority floor and
envelope-projected inspection"; the 2026-09-08 external source audit, which
named the same hole its first priority; and the operator's 2026-09-08
`planning:` dispatch, which names this gate first. Planner-synthesized draft;
the dispatch is preserved locally as a compaction-safety capture
(`docs/intake/notes/2026-09-08-critical-path-planning-dispatch.md`, SHA-256
recorded in the ledger section of the same date). Opaque identifier, not a
priority. The clean-room screen found no employer, credential,
internal-service, or other stop condition; nothing from the audit's text is
copied here beyond the mechanism it describes.
**Depends on:** WO-008 merged (compiler v1; satisfied at `v0.4.0`); WO-039
merged (the `harness-v1` target and the Contributor build this order
regenerates; satisfied by the closed order's merge into `main` at `33e2c25`,
the `v0.15.0` source). No open order is an input.
**Recommended placement:** first in the 2026-09-08 horizon, alone or beside
WO-043 and WO-036, with which it shares no primary write surface: this order
edits `packages/compiler`, skeleton loadout fixtures, the regenerated
`.claude/` bundle and products 02, 03, 04 and 10; WO-043 edits `scripts/` and
work-order files; WO-036 edits the test runner and the root `test` entry. A
recommendation, not a dependency token.

**Cites (read these sections):** 01-principles.md Principles 5, 10, 11, and
18; 02-domain-model.md §Identity and composition (AuthorityEnvelope; the
support facet's declared "authority changes"), §LoadoutGraph v1 payload
contract (claims, precedence layers, and the sentence "the winner rewrites the
emitted AuthorityEnvelope"), and §Harness compiler v1 ("The envelope must
equal the compiled build's envelope"); 03-architecture.md §Composition system
(step 3, the nine-level precedence) and §Platform and instance boundary;
04-interfaces.md §Editable-view v1 normalization and semantic hash (what the
semantic hash covers) and §RPG / Path-of-Exile view (item tooltip anatomy and
the honest-status-effects doctrine VER-001 F2 names); 10-ir-compatibility.md
§Separate version axes and §Invariants; ADR-0005 Amendments (project
configuration is compiler output); ADR-0006 Decisions 1–3;
`docs/verifications/WO-008/VER-001.md` §Findings, F2;
`corpus/mutation/findings-WO-108.md` F-00001 and F-00002;
`packages/compiler/src/types.ts` (`COMPOSITION_PRECEDENCE`,
`CompositionClaim`, `PermissionEmission`, `InspectionContribution`,
`CompiledProgram`, `DiagnosticCode`, `CompileCorrection`),
`packages/compiler/src/compile.ts` (`resolveClaims`, `graphDiagnostics`,
`applyAuthorityClaims`, `emitProgram`), `packages/compiler/src/render.ts`
(`renderCompiledDiff`), `packages/compiler/src/normalize.ts`,
`packages/compiler/src/harness.ts` (`lowerToHarness`: the envelope equality
check and the permission hook), `packages/compiler/src/seiri.ts`;
`packages/skeleton/src/loadouts/contributor.ts`, `entropy-reducer.ts`,
`plan-refuter.ts`; `.claude/hooks/permissions.mjs`;
`packages/console/README.md` (the Builds panel renders through the compiler
render).

**Objective:** Make a compiled build unable to grant itself authority. After
this order, the effective `AuthorityEnvelope` and WorkOrder operation lists of
any compiled program are the active mechanic's base lists, narrowed by linked
supports, widened only by explicit `authorityGrants` that carry their
provenance, and the tooltip's GRANTS and RESTRICTIONS are a projection of
that effective envelope rather than authored strings, so what a build shows
and what its lowered hooks enforce cannot diverge.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`, the `v0.15.0` source):**

- A linked support's `CompositionClaim` selects its own `PrecedenceLayer`,
  including `safety-invariants` and `hard-permissions`
  (`packages/compiler/src/types.ts:19-30, 239-245, 279`). `graphDiagnostics`
  checks only that the layer exists, that an `authority.*` value is `allow`
  or `deny`, and that a linked claim carries no wildcard
  (`compile.ts:477-506`). `resolveClaims` sorts candidates by that layer and
  takes the first (`compile.ts:383-396`). `applyAuthorityClaims` implements
  an `allow` winner by deleting the effect from the denied list and appending
  it to the allowed list (`compile.ts:729-741`), and `emitProgram` feeds both
  the WorkOrder operation lists and the authority envelope through it
  (`compile.ts:789-801, 826-840`). A support can therefore allow an effect the
  active denies. VER-001 F2 reproduced exactly this on 2026-09-03: a support
  claiming `authority.repo.delete = allow` at `safety-invariants` compiled
  with `ok: true` and moved `repo.delete` into `allowedEffects`.
- A second widening path is not named by the earlier finding: a support's
  `permission-guard` emission contributes `allowedEffects` and
  `allowedOperations` that `emitProgram` unions with the active's base lists
  before claims apply (`compile.ts:789-801, 826-836`).
- The lowered hooks enforce the compiled envelope: `lowerToHarness` refuses an
  envelope that differs from `program.loadout.authorityEnvelope`
  (`harness.ts:235-239`) and emits it into the PreToolUse permission hook
  (`harness.ts:427-439`; the installed `.claude/hooks/permissions.mjs:35-61`
  carries `contributor.sandboxed`). Since WO-039 the widening path reaches a
  running session's permission decisions. The Contributor and plan-refuter
  loadouts author no claims (`contributor.ts:272`), so the hole is latent, not
  exploited.
- The tooltip's GRANTS and RESTRICTIONS are authored `inspection` strings,
  appended per linked support (`compile.ts:855-857`) and rendered verbatim
  (`render.ts:89-135`); no rule relates them to the compiled envelope. The
  Seiri tooltip's "Deletion remains operator-owned" would print unchanged
  beside an envelope that allows deletion.
- The mutation campaign left two survivors in the same validation code: the
  tag half of link compatibility (`findings-WO-108.md` F-00001,
  `compile.ts:175`) and the equal-precedence rejection (F-00002,
  `compile.ts:408`).

**Design (scope discipline):**

- **The monotone floor.** For every linked support, an `authority.*` claim
  with value `deny` is accepted at any layer and narrows the envelope; a claim
  with value `allow` is accepted only when the named effect is in the active
  mechanic's base `allowedEffects` and not in its base `deniedEffects`, so an
  `allow` can at most restore a base allowance against a lower-precedence
  support's `deny` and can never add an effect. The same rule applies to
  WorkOrder operation targets and to the `allowedEffects` and
  `allowedOperations` of a linked support's `permission-guard` emission: each
  entry must already be in the active's base list, or the graph rejects. A
  violation is a new typed diagnostic, `AUTHORITY WIDENING`, naming the
  support, the claim or emission id, the effect, and the base list it
  violates, with corrections `unequip-support` (existing) and the new
  `declare-authority-grant` naming the effect. Precedence, commutativity,
  pipelines and hard-conflict rules are unchanged; `safety-invariants` remains
  a legal layer for a support's `deny`, which is what a future Safety piece of
  the 5S set needs.
- **Explicit grants.** `LoadoutGraph` gains an optional, additive
  `authorityGrants` collection under schema version 1 (absent normalizes to
  empty; the three editable views encode and decode it; normalization sorts
  by `grantId`). A grant is
  `{ grantId, version, grantedBy: "operator" | "host-policy" | "registered-repository", effects: exact effect ids, operations?: exact operation ids, repo, reason }`.
  `repo` must equal the compilation environment's `repo`, so a grant compiled
  into another repository rejects. Grants apply after claims: only a grant may
  add an allowed effect or remove a base denial. Every applied grant is
  recorded in the compiled program's new optional `grants` field with its
  provenance and in the trace; normalization omits the field when no grant
  applied, so every grant-free program keeps its exact semantic hash. Unknown
  `grantedBy`, wildcard effects, an empty or foreign `repo`, a missing reason,
  and duplicate ids reject.
- **Trusted admission.** A grant in a submitted graph carries no authority by
  itself. The compilation environment supplies a host-owned grant registry:
  a committed `grants.json` beside the loadouts for `operator` and
  `registered-repository` provenance, reviewed like any authority file, and
  an ignored local file for `host-policy`; a graph grant is admitted only
  when the registry holds an entry with the same `grantId`, `version`,
  `effects`, `operations`, `repo` and `grantedBy`, otherwise the graph
  rejects with `AUTHORITY GRANT UNADMITTED`. The manifest records the
  registry's hash. An unattended consumer therefore cannot be handed
  authority by text that merely claims operator provenance.
- **Projected inspection.** A pure `projectAuthorityInspection(program)`
  returns GRANTS as the effective allowed effects (a granted effect annotated
  with its grant id and provenance) and RESTRICTIONS as the effective denied
  effects. `renderCompiledDiff` prints those projected sections and moves the
  authored `inspection.grants` and `inspection.restrictions` strings under a
  labeled `AUTHORED NOTES` section that the render marks non-enforcing.
  `program.inspection` itself is not changed, so no hash moves. An authored
  note that contains a token exactly equal to an effect id in the envelope's
  opposite list (an authored restriction naming an allowed effect, or an
  authored grant naming a denied one) rejects with `INSPECTION CONTRADICTION`.
  The actor board's Builds panel renders through the compiler render, so its
  recorded fixture expectations are regenerated with the existing
  `npm run evidence:console` command; no console source changes.
- **Harness.** `lowerToHarness` keeps its contract and its envelope equality
  check. The bundle manifest gains the applied grants with provenance, so a
  bundle emitted for a fork or a target names where any authority beyond the
  base came from. The compiler package bump changes every generated hook's
  pin, so this order regenerates the committed Contributor bundle with
  `npm run harness -- emit`; skills, settings, matchers, the envelope and the
  instruction block must be byte-identical before and after, which a diff
  fixture proves.
- **Versions and evidence editions.** Compiler package `0.7.0` → `0.8.0`
  (minor: additive contract, a narrowed acceptance set). The compiled-program
  contract stays `"1"` with the narrowing recorded in 10 §Separate version
  axes: a graph that widened authority through a support compiled before and
  rejects now; no committed loadout does. The package change gives artifact
  identity, verification and feedback evidence new editions under
  `docs/evidence/WO-042/`, as WO-010, WO-022 and WO-039 recorded; the feedback
  edition is a live audit the operator runs from a terminal outside the
  sandbox, because the sandbox refuses both CLI transports.
- **Bounded boy-scout item (authorized here):** add the two negative tests the
  mutation survivors F-00001 and F-00002 lack, because both sites are inside
  the validation code this order rewrites; reproduce the kills with
  `node corpus/mutation/mutate.mjs --reproduce` and report them in the result.
- **Declined alternatives, recorded:** a per-layer whitelist by component kind
  (every claim comes from a support today, so a kind rule would be vacuous
  and would still let a support widen at a permitted layer); forbidding the
  `safety-invariants` layer for supports (a `deny` there is the legitimate
  case); rejecting authored inspection strings outright (they carry intent;
  labeling and the contradiction check keep them honest); deferring until
  saved or community builds (the lowering already emits the envelope into
  live hooks); wildcard grants (v1 is exact effects only); authenticating
  grants with signatures (provenance is reviewed text under the same limit
  WO-029 recorded; an external principal would justify keys).

**Deliverables:** the floor diagnostics and corrections; the
`authorityGrants` collection with view codecs and normalization; the applied
`grants` program field; `projectAuthorityInspection` and the render change;
the manifest provenance field; the regenerated Contributor bundle; the
compiler version bump; fixtures for every criterion below; the two boy-scout
negative tests; the new evidence editions; the write-backs below.

**Acceptance criteria (all required)**

1. Widening rejects. Four fixture graphs compile to `ok: false` with
   `AUTHORITY WIDENING` naming the support, the claim or emission, the effect
   and the violated base list, and offer `unequip-support` and
   `declare-authority-grant` corrections: the VER-001 F2 graph (a linked
   support allows `repo.delete` at `safety-invariants` while the active denies
   it); a support allowing an effect absent from the base allowed list at
   `hard-permissions`; a support whose `permission-guard` emission adds an
   allowed effect; and a support whose emission adds an allowed operation.
2. Narrowing is accepted. A linked support's `deny` at each of the nine layers
   compiles, removes the effect from `allowedEffects` and the operation from
   `allowedOperations`, and appends both to the denied lists; two supports
   where one denies a base-allowed effect at a lower layer and the other
   allows it at a higher layer compile to the base allowance with the
   resolution in the trace; the trace and the runtime `authorize` guard agree
   on every fixture.
3. Grants widen with provenance, are admitted only from the registry, and
   are reversible. An adversarial fixture graph that carries an
   `operator`-provenance grant with no registry entry, or whose entry
   differs in one field, rejects with `AUTHORITY GRANT UNADMITTED`; the same
   graph with a matching registry entry compiles and the manifest records
   the registry hash. A graph with an
   `authorityGrants` entry (`grantedBy: "operator"`, the environment's `repo`)
   allowing a base-denied effect compiles with that effect in `allowedEffects`
   and absent from `deniedEffects`, records the grant in `grants` and in the
   trace, and its three editable views round-trip and hash equal; the same
   graph without the grant compiles to the base denial and to its pre-grant
   semantic hash; grants with an unknown `grantedBy`, a wildcard effect, a
   foreign or empty `repo`, a missing reason, or a duplicate id reject with a
   diagnostic that names the field.
4. Hashes hold. The Seiri program keeps `fnv1a64:9ca8d0229c6bd8db`, the
   Entropy Reducer keeps `fnv1a64:c5ddbca75f1c4cee`, the Contributor keeps
   `fnv1a64:06245f5c581212f1`, and the plan-refuter program keeps the hash its
   fixture pins; their artifact identities differ only in
   `compilerPackageVersion`; the frozen WO-003 trace oracle and the WO-029 CLI
   fixture are byte-identical; every existing compiler, skeleton, console and
   corpus test passes with the regenerated console expectations.
5. The tooltip projects the envelope. For Seiri, the Contributor and the
   grant fixture, the rendered GRANTS and RESTRICTIONS sections equal the
   effective envelope's allowed and denied effects (granted effects annotated
   with grant id and provenance); the authored strings appear only under the
   labeled `AUTHORED NOTES` section; a fixture whose authored restriction
   names an allowed effect id rejects with `INSPECTION CONTRADICTION`; the
   `inspection` field of every compiled program is byte-identical to the
   activation base.
6. The lowered bundle agrees. The regenerated committed Contributor bundle
   differs from the activation base only in the hooks' compiler-version pins,
   runtime file hashes and the manifest (a recorded diff proves skills,
   settings, matchers, the envelope and the instruction block unchanged);
   `npm run harness -- check` passes; the WO-039 hook fixtures pass
   unchanged; a fixture bundle lowered from the grant program carries the
   grant's provenance in its manifest; `lowerToHarness` still refuses an
   envelope that differs from the compiled one.
7. The two mutation survivors are killed: the F-00001 and F-00002 mutants,
   reproduced with the mutation runner against this order's source, fail at
   least one named test each.
8. Write-backs land: 02 §LoadoutGraph v1 payload contract (the floor, grants,
   and the corrected sentence about winning claims) and §Identity and
   composition (AuthorityEnvelope provenance); 03 §Composition system step 3;
   04 §Editable-view v1 normalization and semantic hash (the optional `grants`
   field omitted when empty) and the tooltip projection rule; 10 §Separate
   version axes (compiler `0.8.0`; the recorded narrowing under contract
   `"1"`); dated capability-table rows reassessing `compiler.seiri-v1` and
   `compiler.harness-v1`; README "What runs today" (one sentence);
   publication index rows and both edition locks; ledger entry; the planning
   map's candidate marked allocated.
9. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged; fresh artifact-identity, verification and feedback evidence
   editions recorded under `docs/evidence/WO-042/`; the local-terms screen
   run over the changed product prose with the list's presence reported.

**Evidence gate:** the fixture transcripts for criteria 1 through 7; the
bundle diff for criterion 6; `npm test`; the three evidence editions.

**Write-back duty:** as listed in criterion 8.

**Non-goals:** signatures or an identity system (the registry is a trusted
local boundary under review, not authentication); multi-active link groups or set bonuses (WO-037); presence
policy transitions (ADR-0007); wildcard or time-scoped grants; the
owner-sovereign profile; new harness facets, hooks, roles or profiles;
changing any `feedbackBoundary` predicate; the harness host's tool
classification (a separately recorded candidate); console source changes;
lifecycle legality or the event schema; registered-repository authority
profiles (WO-033), which are the first expected consumer of the
`registered-repository` provenance.

**Operator-review assumptions**

1. The three provenance values are enough for v1; a fourth provenance is a
   contract change, not a string.
2. Narrowing the accepted graph set under compiled-program contract `"1"` with
   a compiler minor bump is acceptable because no committed loadout used the
   widening path; the reviewer may instead require contract `"2"`, which
   changes this order's classification and nothing else.
3. The live feedback audit is operator-run outside the sandbox, as WO-039's
   was.
4. Regenerating the committed bundle is the one project-scope configuration
   mutation this order authorizes, and only pins and hashes may change.

## Execution record

The operator's 2026-09-08 ideation expands the order to equip atomic Contributor
supports for adjacent repair, decision receipts, a follow-up queue, intent
communication and operator check-in, and repair the planning gate's refusal of
required execution write-backs. The
[breakout receipt](../evidence/WO-042/ideation.md) records the explicit authority,
source provenance, decisions, rejected options, affected comparisons and added
verification duties. It supersedes the compiler-only bundle/source constraints
for those named supports and their projection, the planning comparison and
queue, and the queued console edition repair recorded in the receipt. The
original saved-program
compatibility checks remain; the installed support overlay has its own identity
and comparison. The executor continues through the complete evidence gate;
the verifier and final reviewer must include the receipt and promoted documents.

The 2026-09-09 [VER-001 F1 repair](../evidence/WO-042/repair-001.md) restores
criterion 5's Unicode prose punctuation boundaries while retaining exact
effect-id matching. It preserves the original order, the operator-expanded
duties and the immutable verification report; the repair record carries its
regression and renewed evidence gate.
