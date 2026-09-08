# Work-order map — human planning judgment

**Planning revision:** 2026-09-06, the phase-two planning pass after the
`v0.13.1` close (previous revision 2026-09-05, after the `v0.6.0` close). The generated
[work-order index](../work-orders/README.md) now owns header observations,
control evidence, dependency-token status, and local release attribution. This
map retains recommendations, rationale, tracks, and human activation preflight.
The catalog's manually maintained evidence, hard-dependency, and model/effort
columns were removed on this date; their drift is documented in the
[activation comparison](work-order-index-activation-2026-09-04.md).

For the selected order's legal action, use `npm run resume --silent -- status
--json`. For authority, read the selected work order. The index's computed
readiness is only a conservative token view: recommendations, independent
orders, oracle references, and reverse references inside a Depends on paragraph
need human interpretation. No view chooses or authorizes the next order.

Work-order numbers are stable opaque identities. They are not a queue, priority,
roadmap position, or family code. The adjacent evidence/corpus track does not
require mainline work to count upward to reach it.

## Recommendation and rationale

**Phase two (2026-09-06, redirected the same day):** the 2026-09-05 horizon
is complete and every order in it ran serially. The first phase-two pass
filed a horizon of process machinery (a showrunner board over control state,
a process-kit export, a workstream pilot, a documentation reset, a test
runner, the 5S set, the license order). The operator's correction, recorded
in the [phase-two plan](phase-two-plan-2026-09-06.md#the-redirect--second-pass-of-2026-09-06),
turned it toward the product: a session must get a build, not a biography,
and a fork of the starter must receive an actor. The redirected horizon
therefore leads with the compiler target that lowers a saved build into
enforceable harness configuration and runs this repository on its own
compiled build (WO-039), the actor board as UIFA v0 (WO-032, rescoped), the
starter as a compiled export that carries that build (WO-033, rescoped), the
first batch of the rule migration through that target (WO-040), and a plan
refuter that gates every later planning pass on the vision (WO-041). The
pilot (WO-034, rescoped so the Angular repository's first change is a UIFA
v1 shell), the documentation reset (WO-035), the evidence runner (WO-036),
and the 5S set (WO-037) keep their places behind them. The wave pairing is
in the plan: lane 0 is WO-038 ∥ WO-041, wave 1 is WO-039 ∥ WO-032, wave 2 is
WO-033 ∥ WO-040, wave 3 is WO-034 ∥ WO-035, wave 4 is WO-037 beside the
migration's second batch, and WO-036 floats. The serial reading order below
puts the fork-binding critical path first: the operator's fork and the
first external fork wait on WO-038, WO-039's first phase and self-host, and
WO-033; if capacity is short, run those three alone. Version assignment
follows the opt-out default at activation: the first order in a wave to
merge takes the next version above the latest published tag, and the second
retimes at its sync step. The license posture was decided inside the first
pass (`docs/LEGAL.md` §Decision) with the license files landing in the
planning pull request. The adjacent track is unchanged; WO-014 floats and
gains weight once target-repository sessions report approval friction.

**WO-038 source (2026-09-06):** the planning license files are present in this activation base. The missing release assignment is completed at `v0.13.2`, the next patch above published `v0.13.1`. The [executor receipt](../evidence/WO-038/README.md) records package metadata, npm refusal probes, the pinned license surfaces, contribution sign-offs, and the WO-033 export-default handoff. This source work does not discharge the critical path's merge dependencies or establish that the proposed paired wave occurred; the generated index and control fold own later lifecycle evidence.

**WO-108 source (2026-09-06):** the operator selected the mutation evidence lane on published `v0.13.0` and authorized adapting its stale scope to the current repository. It prepares internal tooling/evidence patch `v0.13.1`: a complete candidate census plus a deterministic 32-site campaign over kernel, compiler, and skeleton, with all historical compiler probes remeasured. The [corpus outcome](../../corpus/mutation/README.md) owns measured results and limitations; survivors inform future evidence-hardening orders and do not authorize fixes here. Its [work-order receipt](../work-orders/WO-108-mutation-probe.md#ideation-breakout-receipt--implementation-consequences-2026-09-06) adds the implementation-consequences ideation to independent review. This supersedes the activation-preflight recommendation below for WO-108; lifecycle status still comes from the control fold.

**WO-011 source (2026-09-06):** this worktree prepares `v0.13.0` above published `v0.12.0`. The ten-unit feedback compiler and a bounded self-hosted audit are the active implementation. The [executor receipt](../evidence/WO-011/README.md) distinguishes causal fixture evidence, instruction-byte accounting, and separate verifier episodes. Independent repository verification, final review, and integration still follow the control fold. Optional sibling-repo and artifact-organization pilots remain unallocated candidates; the marked sequence is unchanged.

**WO-022 source (2026-09-06):** this worktree prepares `v0.11.0` above published
`v0.10.1`. WO-021, WO-008 and WO-009 are present in the activation base; the
fresh sparse probe emits the entire v3 maximum within eight allocated blocks.
The [WO-022 evidence](../evidence/WO-022/README.md) covers compiled senses,
the host mount/profile boundary, weak provenance and deterministic verifier
blinding. Native model verification remains WO-010, and the marked sequence
is unchanged. The generated index and control fold own lifecycle status.

**WO-031 implementation (2026-09-05):** this source prepares `v0.10.1` above
published `v0.10.0`. The actor-usage report and opt-in labels are implemented;
the [evidence](../evidence/WO-031/README.md) and generated index own validation
and lifecycle status. Publication and continuation corrections from the
[ideation receipt](../evidence/WO-031/ideation.md) join the review subject.
The marked work-order sequence is unchanged.

The operator restated this sequence during WO-020; the 2026-09-05 planning
pass inserted WO-030 ahead of WO-021 and placed WO-031 in the free lane beside
WO-009 (see the [concurrent work-orders plan](concurrent-work-orders-plan.md)).
This marked list is its single editable source; the work-order README renders
it with evidence-derived progress marks. Keep the plain one-item-per-line form
usable in a text editor.
Closed entries remain here until the operator changes the planning horizon;
the generator marks them rather than asking the operator to cross them off.

<!-- dotln-work-order-sequence:start -->

- WO-038 — License posture lands
- WO-039 — Harness lowering
- WO-033 — Compiled starter export
- WO-041 — Plan refutation mechanism
- WO-032 — UIFA v0 actor board
- WO-040 — Rule migration, batch one
- WO-036 — Evidence runner
- WO-034 — Cross-repository workstream pilot
- WO-035 — Documentation structure reset
- WO-037 — 5S equipment set

<!-- dotln-work-order-sequence:end -->

Revalidate each selection against its authority, the index, and current
preflight facts; this is a human recommendation, not a scheduler or an
activation. The list is the serial reading order with the fork-binding
critical path first; the wave pairing (lane 0 WO-038 ∥ WO-041, wave 1
WO-039 ∥ WO-032, wave 2 WO-033 ∥ WO-040, wave 3 WO-034 ∥ WO-035, wave 4
WO-037 beside the migration's second batch, WO-036 floating) is in the
phase-two plan. The
completed 2026-09-05 horizon (WO-020, WO-030, WO-021, WO-029, WO-009, WO-031,
WO-022, WO-010, WO-011) keeps its closed evidence in the generated index; its
rationale is retained below for the record.

**Operator correction (2026-09-07, WO-041):** the pairings above are opportunities
for overlap, not phase prerequisites. Implementation and verification progress
independently. The operator voluntarily completes each final-review-through-
release-close window before opening another; no gate enforces it. The integrating
actor handles routine upstream incorporation, release retiming, and projections
within that window and requests new evidence only for affected claims. The
[integration contract](../product/07-execution-guide.md#independent-workflows-and-integration)
and WO-041 breakout receipt supersede the earlier automatic restart rule.

The planning reasons remain: the index reduces repeated evidence gardening;
the beacons make state and staleness legible before the external worker;
WO-029 pins consuming artifact identities immediately before WO-009; and
WO-022 follows the worker boundary for mount semantics. The earlier pull-forward
of WO-023 responded to repeated manual review/planning and availability of the
real compiler. WO-028's append-time projection can support beacon derivation
without introducing attention or resource telemetry.

WO-030 precedes WO-021 because the beacon hook and group composite assume
per-order control state. The 2026-09-05 WO-030 source preserves independent
states and passes its serial-integration fixture, and it passed independent
verification and final review at this revision; operator merge remains before
the actual paired trial. After WO-030 merges, WO-021 and WO-029 are the first paired wave
(disjoint write surfaces), WO-009 pairs with the small read-only WO-031, and
WO-022 pairs with WO-010 after the worker lands; WO-011 follows WO-010. The
[concurrent work-orders plan](concurrent-work-orders-plan.md) holds the hand
rules, the unfiled later slices, and the reversal condition (Beacons first if
the operator prefers, with the trial one wave later).

Version assignment is the operator's opt-out default. Complete an unassigned
activation target using the roadmap classification, observed release base, and
matching source claim. Published tags and already pinned targets keep their
separate immutability/retiming rules. WO-026 prepared the compatible v0.5.2 patch
above v0.5.1; the candidate application journey does not allocate a runtime rung.

**WO-021 activation completion (2026-09-05):** this worktree starts from
published `v0.7.0`, which contains WO-030. WO-021's expected minor classification
therefore assigns `v0.8.0`; skeleton source advances independently to component
`0.7.0`. The dated merge-pending statements above describe the planning revision,
not this activation. This does not change the recommended sequence or claim that
the paired trial or operator usefulness comparison has occurred. The 2026-09-05
WO-021 source passed independent verification and final review at this
revision and awaits operator merge; the sequence above is unchanged.

After WO-021, the [proposed beacon usefulness checkpoint](beacon-usefulness-checkpoint.md)
compares the new projection with existing status views before recommending
further investment. The technical orders do not by themselves prove the wider
DotLn or Protíno product thesis. This observation adds no release gate or
automatic change to the sequence above.

**WO-029 implementation (2026-09-05):** this worktree starts from published `v0.8.0`, which contains WO-021; it is not evidence that the proposed paired wave was run. Its missing activation target is completed at `v0.9.0`, with compiler `0.3.0` and skeleton `0.8.0`. The source now implements separate artifact identity, v2 equip, the logged legacy cutover, one consumer comparison, typed refusals, and L0/governed-raw receipts. The generated index owns subsequent verification and close status. WO-009 should consume the successful equip's whole-program hash and compiler axes, retain the exact compilation environment, and preserve the boundary/re-equip rule when submitting its first external work. Component-membership submissions, pulse issuance stamps, signatures, and worker-result echo remain deferred; this handoff does not expand WO-009 or authorize it to start. WO-029 passed independent verification (`VER-001`) and final review (`FINAL-001`) on 2026-09-05 at this revision and awaits operator merge; the recommended sequence and the deferred items above are unchanged.

**WO-009 implementation (2026-09-05):** this checkout starts from published `v0.9.0` (`002593f`), which contains WO-029 and supersedes the earlier pending-merge observation. Activation now targets `v0.10.0`, with skeleton `0.9.0`, compiler `0.3.0` and kernel `0.2.1`. Both observed CLI transports execute one bounded inspection episode through the pinned shared reactor. The durable store, safe detached worktree lifecycle, explicit leases, read-only status, failure rows 2/4/6 and authenticated kill/recovery evidence are staged for independent verification. No deferred component-membership submission, worker identity attestation or real verifier was added. The [executor evidence](../evidence/WO-009/README.md) and generated index own subsequent evidence and lifecycle status. This execution alone does not establish that the proposed WO-009/WO-031 paired trial occurred. WO-009 passed independent verification (`VER-001`) and final review (`FINAL-001`) on 2026-09-05 at this revision and awaits operator merge; the recommended sequence and the deferred items above are unchanged.

An alternative [budget-window ladder plan](budget-window-work-order-ladders.md)
preserves the operator's proposed two-lane experiment and the original
[Fable planning handoff](budget-window-work-order-ladders.md#fable-planning-handoff).
That handoff was discharged on 2026-09-05 into the
[concurrent work-orders plan](concurrent-work-orders-plan.md) and WO-030; the
waves the sequence above implies are WO-030 → WO-021 ∥ WO-029 → WO-009 ∥
WO-031 → WO-022 ∥ WO-010 → WO-011. Neither document is a second live status
checklist.

WO-014 remains a floating option when approval friction is the constraint.
For adjacent evidence/corpus work, **WO-107 is now the first candidate**: the
operator's declared-versus-observed cost loop needs an observed baseline
column before analysis, and the profiling order is written to be executable by
a low-cost model in a quiet window. WO-108 remains the first choice when
evidence quality is the concern (a base at or after v0.4.0 includes the
compiler in its commit-keyed mutation matrix); WO-103, WO-105, and WO-102
remain alternative uses of that track.
Each still needs its own version, close disposition, base and environment
preflight, and governed authority; writing it in the map grants none.
WO-109 remains a bounded research pilot with its source, image-harness, budget,
and yield-threshold preflight rather than a release gate.

The original series runbook's existing map link now reaches this index pointer.
Its bytes are preserved under WO-026's file-freeze rule; there is no path or
identity migration.

## Preserved unallocated candidates

- **Concept registry through actual app use — operator-nominated 2026-09-07
  during WO-109.** The [planning proposal](../lineage/remining/runs/draw-001/idea-pipeline-proposal.md)
  connects inexpensive capture, stable concept records, relevant retrieval,
  explicit promotion gaps, implementation evidence and actual consumer use.
  Its recommended delivery model is a continuing queue cut into named batches,
  such as ten authorable patterns per ordinary work order, with per-item app
  acceptance and remaining ideas retained for later batches. The next planning
  session should decide the minimal registry/projection, first retrieval and
  app-use witness, and bounded order allocation. The proposal links the detailed
  book research and the existing temporal-authoring candidate; it grants no
  activation, selected schema, number family or implementation authority.
- **Artifact growth and maintenance:** if a reading or upkeep problem is
  demonstrated, a bounded assessment can apply the [corpus policy](../product/03-architecture.md#corpus-policy)
  to documentation, logs, and derived views. Consider clearer organization,
  explicit archives, or consolidation while preserving links and required
  immutable history. A healthy structure needs no change. No file quota,
  mandatory cleanup, selected layout, order number, or activation is assigned.
- **Sibling workflow pilot — filed 2026-09-06, redirected the same day.**
  The first pass filed the launchpad export and target-repository mechanics
  as WO-033 and the synthetic-plus-real pilot as WO-034; the redirect made
  the export carry the compiled Contributor build (through WO-039) and made
  the Angular repository's first change a UIFA v1 shell over the actor
  board's view model; the route is recorded in the
  [phase-two plan](phase-two-plan-2026-09-06.md#the-enterprise-workflow-decision-redirected).
  The example may still witness implicit documentation lookup with Context7;
  the product must remain usable without that adapter or a paid account.
  Authentication, packaging beyond the process kit, and per-repository
  release policy remain open; licensing was decided on 2026-09-06 and lands
  through WO-038.
- **Rule migration, batches two onward — named 2026-09-06 by the
  redirect's refutation receipts.** WO-040 compiles batch one and leaves
  roughly 120 shapes classified but not compiled. One batch per wave from
  wave 4, each cut from WO-040's template, each with its candidates named in
  the migration ledger before it is filed, each measured by the same
  directional method; the migration ledger's counts are the progress
  record. No number until each is filed; the template is the authority.
- **Pattern workshop v1, remaining shelf entries — named 2026-09-06 by the
  redirect's refutation receipts.** After WO-037 compiles the 5S set, the
  Marquet ladder as a typed protocol, the mitigated-speech voice selector,
  Theory of Constraints, the commedia masks as a party topology, and the
  Algorithms-to-Live-By policies each become one compiler-side order in the
  shape of WO-037, in an order the pattern library's founding sequence and
  the console's evidence decide; no number until filed.
- **Intent declaration and the stranger test — named 2026-09-06 by the
  redirect's final refutation receipt.** The smallest useful loop's first
  step, declare a bounded intent in prose and receive a fire-and-forget
  receipt, still enters this repository as a hand-written work order through
  a planning pass, and the `v1.0.0` criterion (a person who has never read
  these docs declares one bounded intent and receives a verifiable result)
  has no order. After the parity contract exists, one order makes intent
  declaration a command over it, from prose to a compiled work order with
  its receipt, exercised by a non-author; the workstream application
  journeys in product 12 are its scenarios. No number until filed.
- **Console parity contract and drag-equip authoring — wave-5 candidate,
  named 2026-09-06 by the redirect's refutation receipt.** The differentiated
  interface's authoring half (the analogies are the ways you mix and match
  the agents; drag a pattern card onto an actor and see the exact compiled
  diff) has no order after this horizon: the actor board is read-only, the
  5S set is authored as data, and every build is written by the author.
  The next planning pass files, once WO-032 and WO-037 have merged and
  WO-034's shell exists: first the parity contract that names which
  commands a console may invoke (equip preview, compiled diff, saved-build
  selection) as the same commands the terminal runs, in core; then the
  drag-equip surface over that contract as a `WS-001` member order in the
  example consumer, and the pattern-card, statechart, function-table, and
  temporal views as further equivalent views under 04's round-trip laws.
  Precondition, not a number: the redirect's receipts are the input.
- **JSON forms for the index, the constellation, and `release list`:**
  nominated by WO-032, which parses their pinned text so that wave 1's write
  surfaces stay disjoint. A bounded follow-on adds `--json` to each once a
  second consumer exists or the text parsers break. No number, sequence
  position, or activation authority.

- The concurrent-workflow control slice shipped in WO-030 (`v0.7.0`); the
  first measured paired wave is phase two's lane 0 (WO-038 ∥ WO-041), and the
  rebase helper the plan named is filed as WO-033's `worktree sync`. The
  lane-plan projection, declared per-order workflows, admission policy,
  contribution tracks, and tenant-scoped tracks remain unfiled with the
  filing conditions in the
  [concurrent work-orders plan](concurrent-work-orders-plan.md#later-slices-unfiled).

- Correct the compiled Entropy Reducer's Shape-First wording and regenerate its
  residue under a bounded follow-on. The current manual usage guide records the
  operator's relationship-first interpretation; this observation allocates no
  order or priority.
- Choose a bounded consumer, privacy profile, cadence, cost ceiling, and useful
  comparison before implementing the [system baseline](../product/06-roadmap.md#candidate--bounded-system-baseline)
  or [success-under-growth review](../product/05-pattern-library.md#candidate--success-under-growth).
- Develop a synthetic pilot for the [end-user workstream application](../product/12-workstream-application.md),
  with parity and reduced coordination burden as the outcome. Host topology,
  first integration, application identity, and work-order allocation remain open.

- **Unallocated follow-on candidate — audit causal-association hardening:**
  in a bounded follow-on, teach the WO-007 fold to prefer valid canonical cause and
  correlation links while retaining an explicitly labeled, strict
  scope-and-time adjacency fallback only for historical logs without usable
  links. Adversarial fixtures should cover adjacent decoys, cross-scope links,
  missing links, invalid links, and the sibling decision/refusal consequences of
  one attempted action. This nomination has no work-order number, sequence
  position, release, or activation authority.
- **Unallocated workflow candidate — Additional Opinion cohorts:** after
  WO-009 provides real bounded episodes and WO-010 proves blinded independent
  verification, pilot two verification results over one frozen candidate and a
  sealed adjudication that can route only to fix or final review. Preserve raw
  results, duplicate provenance, minority findings, actor/model/effort
  attestations, and finite cost/concurrency bounds; one blocking finding cannot
  be outvoted. Defer mutating implementation alternatives until the evidence
  model works; each candidate then needs its own writer/worktree and any
  synthesized artifact needs fresh verification. This candidate has no work-
  order number, version, sequence position, or activation authority and does
  not change resume control v1.
- **Unallocated product candidate — profiles, PresencePolicy, and unattended
  portfolios:** separate the reusable platform mechanisms from saved instance
  doctrine; define capability declarations for intentionally absent evidence,
  history, and replay; and compile a four-axis PresencePolicy over attention,
  work scope, effect authority, and observed external capability. Representative
  fixtures include hold, decay, progressive authority, peak/reset/loop, return
  races, unavailable adapters, and an explicitly preauthorized optional
  WorkOrder portfolio. The candidate includes no wildcard authority, provider
  bypass, implementation name, version, sequence position, or activation grant.
- **Unallocated control candidate — canonical private intake reconciliation:**
  replace worktree-relative raw-note drift with one private-store resolver and
  capture/status/reconcile operations. Require locking, contained regular
  files, atomic no-overwrite copy, same-content deduplication, divergent-
  collision refusal, verified owner-only backup, source removal only after a
  recoverable canonical copy, and a private capture-to-synthesis manifest.
  Storage reconciliation remains distinct from semantic ideation synthesis.
- **Unallocated evidence candidate — source-bound feedback refresh:** WO-038's
  [receipt](../evidence/WO-038/README.md#feedback-evidence-refresh) records a
  manifest-only change requiring the existing regenerate → bounded live audit
  → validated recording sequence. Add one resumable helper that diagnoses the
  changed declared inputs, reuses those existing commands, preserves prior
  editions, and carries explicit transport/model/effort and budget authority.
  Fixtures must cover unchanged-source reuse, interrupted audit recovery, and
  refusal to record stale or incomplete results. Include the host's full
  return-format contract in the verifier input and retain bounded rejection
  diagnostics: WO-038 observed an envelope refusal and found a summary bound
  enforced by the parser but omitted from the verifier prompt and schema.
  No weaker source pin, hidden model spend, new runtime capability, or WO-038
  scope expansion is nominated.
- **Governance candidate — licensing and distribution posture: allocated
  2026-09-06.** The operator decided the posture (`docs/LEGAL.md` §Decision:
  Apache-2.0 code, CC BY 4.0 documentation, DCO inbound, names reserved) and
  the license files landed with the planning pass; the executable half
  (workspace `license` and `private` metadata with `@dotln/kernel` the
  measured gap, a tested publication refusal, `CONTRIBUTING.md`) is WO-038.
  Third-party notices at the first bundled artifact, privacy and service
  review, and the brand check stay as gates in the legal record.
- **Unallocated composition candidate — claim-layer authority floor and
  envelope-projected inspection:** compiler v1 lets any linked support claim
  the `safety-invariants` layer, so an author-supplied graph can grant itself
  an effect its own read-only support denies, and the tooltip's RESTRICTIONS
  are authored strings that do not notice (WO-008 VER-001 F2, reproduced in
  FINAL-001). A bounded follow-on before saved or community builds should
  decide which layers a support may claim and project RESTRICTIONS from the
  compiled envelope. This nomination has no work-order number, sequence
  position, release, or activation authority.
- **Nominated boy-scout item for the next activation — explicit Node types:**
  add `"types": ["node"]` to the `compilerOptions` of the three package
  `tsconfig.json` files. TypeScript 7.0.2 (current `latest`) reports
  `Cannot find name 'node:test'` and the downstream `CompileResult` narrowing
  errors the operator saw in an editor because `@types/node` is no longer
  included implicitly; with `--types node` all three packages are clean, and
  the pinned 5.4.5 accepts the field. Unambiguous, low risk, covered by the
  activated order's `npm test`; record it in that order's result.
- **Unallocated measurement candidate — presentation-surface comparison:**
  once WO-009 lands two transports, a WO-107-style profiling cell compares the
  same order through a terminal harness, a raw API episode, and, where
  observable, an IDE or desktop surface, on protected outcomes, elapsed time,
  and accounting regime. Product 03's candidate names the axes; no surface is
  preferred in advance.
- **Unallocated data candidate — UIFA roles as data:** the five human roles
  are prose in product 13 until a consumer needs one as an event field; the
  first plausible consumer is tester-authored scenarios in WO-011.

## Direct-draft provenance for the 2026-09-02 batch

WO-016 through WO-022 were supplied by the operator as complete public drafts
with an explicit instruction to file them. The same turns were first written to
ignored intake as compaction-safety copies. Their earlier local timestamps
therefore describe capture order, not a later agent promotion from raw notes:
both copies descend from the same operator-authored filing instruction. During
VER-001 repair the operator confirmed that exact wording and word choice were
intentional. The batch passed the employer/credential/internal-service screen;
this provenance does not relax that boundary or grant direct-filing status to
ordinary intake.

WO-024 through WO-026 are planner-synthesized drafts from the operator's
2026-09-02 post-`v0.3.0` planning messages, which are preserved locally as a
compaction-safety capture. They are not direct drafts: their wording is the
planner's, their observed-problem sections were measured against the repository
at `v0.3.0`, and they carry no direct-filing provenance.

WO-027 and WO-028 are planner-synthesized drafts from the operator's 2026-09-03
post-`v0.3.4` planning messages, preserved locally as a compaction-safety
capture. Their observed gaps were measured against the repository at `v0.3.4`;
they carry no direct-filing provenance.

WO-030 and WO-031 are planner-synthesized drafts from the operator's 2026-09-05
planning dispatch, preserved locally as a compaction-safety capture. Their
observed gaps were measured against the repository at `v0.6.0`; they carry no
direct-filing provenance. WO-030 discharges the ladders document's Fable
planning handoff through the concurrent work-orders plan.

The 2026-09-04 gardening pass added one
`**Effort:** executor xhigh+; verifier xhigh+; reviewer any.` line, immediately
after the Model field, to the nine remaining drafts that lacked one (WO-009,
WO-010, WO-011, WO-014, WO-102, WO-103, WO-105, WO-107, WO-108) so activation no
longer stalls on the WO-019 declaration check. No other wording in those drafts
changed, so their provenance is unchanged; a lower floor for a mechanical corpus
order remains available through the dated amendment path at activation.

WO-032 through WO-038 are planner-synthesized drafts from the operator's
2026-09-06 phase-two planning dispatch, preserved locally as a
compaction-safety capture
(`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`, SHA-256
`e8ccc4e788ca0ce66612a12cdd8919d7f4dee5e9303b799460e18dc1c087b287`). Their
observed gaps were measured against the repository at `v0.13.1` and by two
delegated read-only sweeps whose numbers the phase-two plan reproduces; they
carry no direct-filing provenance. WO-032, WO-033, and WO-034 were rescoped
the same day, and WO-039 through WO-041 filed, by the phase-two redirect
after the operator's correction of the first pass; the correction is
preserved locally as a compaction-safety capture and its synthesis is the
plan's redirect section and the ledger's redirect entries. The first two
kept their numbers and changed their file names to match their scope
before any activation; no link to the earlier names remains.

## Status boundaries

The [index](../work-orders/README.md) defines its evidence labels. Control
closure, repository integration, and release inclusion are distinct boundaries.
A historical order is explicitly time-indexed; absence of events is not proof
of completion. A dependency-ready row still needs human preflight and selection.
In particular, all tokens in a dependency paragraph are observations, not a
semantic declaration that every reference is a hard prerequisite.

## Catalog — human preflight and scope notes

Consult each linked authority for current Model, Effort, dependency wording,
and acceptance. The retained rows are planning context; they do not maintain a
second completion ledger.

| Work order                                                           | Purpose / track                                                                                                                                                                                                                                                                                | Activation preflight                                                                                                                                                                                                       | Execution role                                                                                            | Environment / capability preflight                                                                                | Primary affected surfaces                                                                                                                                                              |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [WO-001](../work-orders/WO-001-environment-truth.md)                 | discovery — bounded host truth                                                                                                                                                                                                                                                                 | not applicable; historical evidence input                                                                                                                                                                                  | bounded environment investigator                                                                          | read-only host inspection                                                                                         | `docs/discovery/`                                                                                                                                                                      |
| [WO-002](../work-orders/WO-002-pure-kernel.md)                       | core runtime — pure kernel                                                                                                                                                                                                                                                                     | not applicable                                                                                                                                                                                                             | pure-kernel implementer                                                                                   | deterministic build/test harness                                                                                  | `packages/kernel/`                                                                                                                                                                     |
| [WO-003](../work-orders/WO-003-walking-skeleton.md)                  | integration — fake end-to-end vertical                                                                                                                                                                                                                                                         | not applicable                                                                                                                                                                                                             | integration/scenario implementer                                                                          | deterministic fake-executor scenario                                                                              | `packages/skeleton/`; bounded kernel gaps                                                                                                                                              |
| [WO-004](../work-orders/WO-004-environment-truth-addendum.md)        | operations/discovery — lifecycle and environment corrections                                                                                                                                                                                                                                   | not applicable                                                                                                                                                                                                             | lifecycle/release engineer and environment investigator                                                   | authenticated transport probes where required                                                                     | discovery, scripts, control, lifecycle docs                                                                                                                                            |
| [WO-005](../work-orders/WO-005-capability-table.md)                  | planning/evidence — capability maturity inventory                                                                                                                                                                                                                                              | not applicable                                                                                                                                                                                                             | evidence planner/documentarian                                                                            | document/evidence review                                                                                          | capability table, docs map, lifecycle/evidence records                                                                                                                                 |
| [WO-006](../work-orders/WO-006-publication-bootstrap.md)             | publication/process/tooling — publication loop plus authorized expansions                                                                                                                                                                                                                      | not applicable                                                                                                                                                                                                             | completed executor/reviewer                                                                               | repository toolchain; personal-harness reconciliation deferred to WO-014                                          | publication, product, lineage, decisions, docs, scripts                                                                                                                                |
| [WO-007](../work-orders/WO-007-audit-record-baseline.md)             | auditability — deterministic projections                                                                                                                                                                                                                                                       | not applicable                                                                                                                                                                                                             | audit-projection implementer, then independent verifier                                                   | real walking-skeleton log plus deterministic checks                                                               | skeleton audit types; product 09; CLI/docs plus authorized documentation expansions                                                                                                    |
| [WO-008](../work-orders/WO-008-composition-compiler.md)              | composition — compiled loadouts and diff                                                                                                                                                                                                                                                       | satisfied — activated from published `v0.3.6`; `v0.4.0` pinned by the order; the 21 WO-003 decision traces were frozen before the loadout was replaced                                                                     | pure-compiler implementer                                                                                 | deterministic compiler/fixture harness                                                                            | new compiler package; skeleton integration; product docs                                                                                                                               |
| [WO-009](../work-orders/WO-009-real-disposable-worker.md)            | runtime/integration — real worker transport                                                                                                                                                                                                                                                    | active v0.10.0 from published v0.9.0; landed WO-016/WO-029 consumed; live and deterministic evidence staged for independent verification                                                                                   | runtime/adapter implementer                                                                               | authenticated nonsandboxed runner and two live CLI transports                                                     | transport adapters; real-episode integration                                                                                                                                           |
| [WO-010](../work-orders/WO-010-independent-verification.md)          | verification runtime — blinded repair/reverify loop                                                                                                                                                                                                                                            | dependency must land; recheck shared surfaces and verifier capacity for the paired wave                                                                                                                                    | verification-system implementer, followed by a separate verifier                                          | fake/live transport fixtures and planted-defect loop                                                              | verification runtime, workstream matrix, status projection                                                                                                                             |
| [WO-011](../work-orders/WO-011-feedback-compiler.md)                 | feedback/self-hosting — ten units and first dogfood                                                                                                                                                                                                                                            | dependencies must land; follows WO-010 under the marked sequence                                                                                                                                                           | feedback-compiler implementer, followed by separate verification                                          | operator-witnessed self-hosted run is acceptance evidence                                                         | feedback compiler, runtime, fixtures, product docs                                                                                                                                     |
| [WO-012](../work-orders/WO-012-release-gate-path-quoting.md)         | operations patch — release path safety                                                                                                                                                                                                                                                         | not applicable                                                                                                                                                                                                             | release-tooling repairer                                                                                  | path-byte fixtures and release/worktree tests                                                                     | release/worktree scripts and tests                                                                                                                                                     |
| [WO-013](../work-orders/WO-013-portable-fixture-temp-roots.md)       | test-infrastructure patch — portable fixture temporary roots                                                                                                                                                                                                                                   | satisfied — used the governed post-`v0.3.0` base; activation's version-placeholder miss was forward-corrected in the authority; merge and release close completed                                                          | shell-fixture repairer working inside a sandboxed harness                                                 | supplied-root-only macOS policy plus Claude Code 2.1.258 sandbox evidence captured                                | `scripts/test-*.sh`, shared temp-root helper, a new temp-root fixture, one runbook note                                                                                                |
| [WO-014](../work-orders/WO-014-approval-burden-contract.md)          | harness evidence/process — approval-burden contract; carries WO-006's deferred posture reconciliation                                                                                                                                                                                          | assign version and close disposition; both harnesses installed at recorded versions; operator available to witness fresh-session runs                                                                                      | harness-evidence executor, independent fresh-session verifier, operator witness                           | Claude Code and Codex CLI; personal-setting authority stays with the operator                                     | runbook, ADR-0003/ADR-0004 amendments, `docs/discovery/` matrices, a synthetic approval-surface fixture                                                                                |
| [WO-015](../work-orders/WO-015-release-cadence-parser.md)            | operations patch — release-manifest cadence extraction                                                                                                                                                                                                                                         | not applicable                                                                                                                                                                                                             | release-tooling repairer, then independent verifier                                                       | canonical TypeScript source plus isolated release/tag fixtures                                                    | `scripts/release.mjs`, `scripts/test-release.sh`, roadmap and this map                                                                                                                 |
| [WO-016](../work-orders/WO-016-skeleton-reactor.md)                  | skeleton architecture/evidence — one Reactor for live execution and replay                                                                                                                                                                                                                     | satisfied — activated from published `v0.3.5`; `v0.3.6` assigned; Stage 1 baselines captured before source edits                                                                                                           | skeleton/reactor implementer                                                                              | deterministic live/replay and mutation harness                                                                    | skeleton reactor, scenario, tests, and README; bounded kernel gaps                                                                                                                     |
| [WO-017](../work-orders/WO-017-kernel-truthfulness.md)               | kernel correctness/evidence — store codec, outbox ordering, authority guard, evidence hardening                                                                                                                                                                                                | satisfied — `v0.3.5` assigned; operator merge and release close completed                                                                                                                                                  | pure-kernel boundary repairer                                                                             | built-kernel probes and deterministic mutation drills                                                             | kernel store/core/tests/README, skeleton envelope, domain and architecture docs                                                                                                        |
| [WO-018](../work-orders/WO-018-control-plane-consolidation.md)       | control-plane/tooling — shared helpers, machine state, built-kernel manifest                                                                                                                                                                                                                   | satisfied — activated from published `v0.4.0`; `v0.4.1` and `@dotln/kernel` `0.2.1` assigned; landed WO-013 shell-fixture and WO-024/WO-025 release-script changes consumed                                                | control-plane refactorer/evidence engineer                                                                | shell fixtures plus real-repository publication/corpus checks                                                     | script libraries, lifecycle/release/publication suites, guide/playbook/release/corpus docs                                                                                             |
| [WO-019](../work-orders/WO-019-effort-truth.md)                      | process/control evidence — declared and attested effort truth                                                                                                                                                                                                                                  | satisfied — active branch contained published `v0.3.3`; bounded readback probe completed without importing personal settings; merge and release close completed                                                            | control-plane/process implementer, then verifier and reviewer                                             | attested harness/model/effort/source                                                                              | resume script/tests, discovery, guide/playbook/domain/evidence docs                                                                                                                    |
| [WO-020](../work-orders/WO-020-beacon-codebook.md)                   | skeleton projection/CLI — metadata-only episode Beacons and exact disclosure codebook                                                                                                                                                                                                          | satisfied — activated from published `v0.5.2`; `v0.6.0` assigned under the release-assignment default; intake sources and host metadata re-observed in the stage receipts; see the index for evidence                      | beacon projection/codebook implementer plus bounded environment probe                                     | deterministic pure/filesystem fixtures on a re-observed host                                                      | skeleton beacon pure/filesystem modules, CLI/tests, discovery, product/README/capability table                                                                                         |
| [WO-021](../work-orders/WO-021-control-plane-beacons.md)             | control-plane dogfood/projection — authorized beacon sweeps, staleness, audiences, group composites                                                                                                                                                                                            | recheck wave eligibility and integration base; assign version and close disposition; activate from a governed base containing all dependencies                                                                             | control-plane/beacon integrator                                                                           | deterministic resume/worktree and metadata fixtures                                                               | resume/worktree scripts, codebook v2, Observe guard choice, audience directories, skeleton, classifier                                                                                 |
| [WO-022](../work-orders/WO-022-senses.md)                            | composition/runtime capability — Senses as compiled, authorized, mounted perception                                                                                                                                                                                                            | recheck wave eligibility and integration base; assign version and close disposition; consume bounded v2; re-observe sparse/numeric/filesystem limits; arrange a non-repository key; prove v3 representable                 | composition/perception-capability implementer                                                             | deterministic compiler/path/keyed-residue/authorization fixtures                                                  | perception supports/fixtures, sparse-twin affordance, host path/provenance residue, bounded guard, docs/tests                                                                          |
| [WO-023](../work-orders/WO-023-compile-entropy-reducer.md)           | instance content — compile the Entropy Reducer reviewer and generated dispatch residue                                                                                                                                                                                                         | historical compiled-instance scope; consult current evidence in the index                                                                                                                                                  | instance-content/compiler implementer, then human review and blinded refutation                           | compiled reviewer Claude Fable 5.1 at max with attestation                                                        | compiler wildcard contract; skeleton loadout/compiler boundary; instance residue and run evidence; tests; pattern/playbook/architecture/ledger docs                                    |
| [WO-024](../work-orders/WO-024-release-notes-surfaced.md)            | operations patch — reviewed release notes in the tag, GitHub Release projection, local render                                                                                                                                                                                                  | satisfied — used the governed post-`v0.3.1` base; real outside-sandbox close completed after fixture-stubbed implementation evidence                                                                                       | release-tooling implementer, then independent verifier                                                    | `gh` stub in fixtures                                                                                             | `scripts/release.mjs`, `scripts/worktree.mjs`, release and worktree suites, the final-review package, guide/playbook/releases docs                                                     |
| [WO-025](../work-orders/WO-025-version-bearing-surfaces.md)          | operations patch — checked release surfaces and renderer-wrapped GitHub bodies                                                                                                                                                                                                                 | satisfied — active branch included WO-024 and published `v0.3.2`; merge and release close completed                                                                                                                        | release-tooling implementer, then independent verifier                                                    | see authority                                                                                                     | README/release checks, publisher/close gates, body profile, skeleton version/banner, release/process/compatibility docs                                                                |
| [WO-026](../work-orders/WO-026-work-order-index.md)                  | planning tooling — generated open/closed work-order index over control evidence; files never move                                                                                                                                                                                              | satisfied — activated from published `v0.5.1`; `v0.5.2` assigned under the release-assignment default; consult current evidence in the index                                                                               | planning-tooling implementer, then independent verifier                                                   | see authority                                                                                                     | new `scripts/work-orders.mjs`, generated `docs/work-orders/README.md`, this map's catalog, roadmap/playbook/guide docs                                                                 |
| [WO-027](../work-orders/WO-027-local-inference-probe.md)             | discovery — local-inference runner inventory, pinned artifact, no-egress evidence, calibration decision                                                                                                                                                                                        | satisfied — `v0.3.3` assigned; operator present; no download; one combined-boundary launch; v3 loopback succeeded, external attribution ambiguous; operator merge and no-release close completed                           | bounded environment investigator, then independent verifier                                               | LM Studio 0.4.13+1 was the only installed runner and its sole service launch crashed                              | `docs/discovery/local-inference.md` and `.json`, roadmap/discovery/README/ledger write-backs; nothing under `packages/` or `scripts/`                                                  |
| [WO-028](../work-orders/WO-028-control-event-time.md)                | control plane — `recordedAt` on control events, elapsed-phase projection, labeled recovery of historical times                                                                                                                                                                                 | historical bounded local-ref observation; no activation decision maintained here                                                                                                                                           | control-plane implementer, then independent verifier                                                      | see authority                                                                                                     | `scripts/resume.mjs` and `scripts/lib/`, resume and checkpoint suites, `docs/control/current.md`, a dated `docs/discovery/` observation, architecture/guide/playbook/domain-model docs |
| [WO-029](../work-orders/WO-029-pinned-artifact-identity.md)          | composition/runtime evidence — pin equipped artifact identity and refuse on drift                                                                                                                                                                                                              | published in v0.9.0; WO-009 consumes the pinned receipt and exact environment; deferred component-membership and pulse identity work remain separate                                                                       | compiler/skeleton receipt implementer, then independent verifier                                          | pure compiler plus deterministic runtime/audit fixtures                                                           | compiler artifact identity; skeleton equip/recompile/refusal/audit path; product, map, and lineage docs                                                                                |
| [WO-030](../work-orders/WO-030-concurrent-control-state.md)          | control plane — one segment per order, order-scoped legality, multi-order projection, proven integration                                                                                                                                                                                       | activation preflight satisfied at `v0.6.0`; runs alone as wave 0; `v0.7.0` retained; per-segment implementation and fixture evidence staged, with lifecycle results in the generated index                                 | control-plane implementer, then independent verifier                                                      | real-Git fixtures with two worktrees and a fixture main; no network                                               | `scripts/lib/control.mjs`, `resume.mjs`, `worktree.mjs`, `release.mjs`, `work-orders.mjs`, control docs, playbook, ladders plan                                                        |
| [WO-031](../work-orders/WO-031-actor-usage-projection.md)            | control-plane projection — elapsed time per actor and phase; opt-in opaque account label                                                                                                                                                                                                       | WO-030 merged; assign version and close disposition; confirm the public two-accounts disclosure                                                                                                                            | control-plane implementer                                                                                 | deterministic log fixtures; the real log for the echoed report                                                    | `resume.mjs`, `scripts/lib/control-time.mjs`, `.gitignore`, product 02/07/09, playbook                                                                                                 |
| [WO-032](../work-orders/WO-032-uifa-actor-board.md)                  | projections/console — UIFA v0: a read-only actor board with Actors, Builds, Mechanisms, Work, and Blueprint panels over a versioned `uifa-board-v1` view model; terminal and zero-asset page                                                                                                   | wave 1 lane B beside WO-039; assign version at activation (minor; the second wave-1 merger retimes); activate from clean published main; no `scripts/` edits; zero dependencies, no framework                              | projection/renderer implementer, then independent verifier                                                | fixture inputs recorded from the documented machine interfaces and evidence stores; no live worker required       |
| [WO-033](../work-orders/WO-033-compiled-starter-export.md)           | control plane — configuration root, target repositories as builds (authority profile, class, profile, worktree-local harness emit), a launchpad export carrying the Contributor build and a pinned runtime build, kit/instance/overlay manifest, lane sync, Beacon portability                 | wave 2 lane A after WO-039 and WO-038; the fork-binding order; assign version at activation (minor); real-Git fixtures; the boy-scout build-first item authorized                                                          | control-plane implementer, then independent verifier; the second wave merger records the wave receipt     | offline `npm ci` for the export fixture; `gh` stub; the local harness for the export's recorded smoke             |
| [WO-034](../work-orders/WO-034-cross-repository-workstream-pilot.md) | workstream application — synthetic six-demonstration pilot plus the operator-witnessed real run from a fork running the compiled build into `DotLn-Angular`, whose first change is a UIFA v1 shell over `uifa-board-v1`                                                                        | wave 3 beside WO-035 after WO-033 and WO-032; assign version at activation (minor); the operator forks, registers the target, and witnesses the run                                                                        | implementer for fixtures; launchpad-dispatched executor, verifier, and reviewer sessions for the real run | the operator's fork and target repositories; hook logs from the fork's sessions for the fired-unit counts         |
| [WO-035](../work-orders/WO-035-documentation-structure-reset.md)     | documentation structure — ledger order and index, spec/receipt boundary, generated release history, shorter cold start                                                                                                                                                                         | WO-033 merged (roots); must not edit `work-orders.mjs` or `packages/console`; assign version at activation (patch)                                                                                                         | documentation/tooling implementer, then independent verifier                                              | repository-wide checks; no network                                                                                | ledger, `docs/lineage/`, product 02/03/06/10/14, capability table, execution guide, `scripts/lineage.mjs`, `scripts/docs-check.mjs`, publication index and locks                       |
| [WO-036](../work-orders/WO-036-evidence-runner.md)                   | test infrastructure — build-first evidence runner with concurrent suites and per-case reporting                                                                                                                                                                                                | any free lane, ideally between waves; assign version at activation (patch)                                                                                                                                                 | test-infrastructure implementer, then independent verifier                                                | the same host and commit for the before/after timing                                                              | `package.json` `test`, `scripts/test-runner.mjs`, `scripts/test-*.mjs`, product 07 evidence-gate sentence, README test paragraph                                                       |
| [WO-037](../work-orders/WO-037-five-s-equipment-set.md)              | pattern workshop, compiler side — multi-active link groups, the 5S set, set bonuses, a second scenario                                                                                                                                                                                         | wave 3 after WO-032 merges; assign version at activation (minor); existing hashes and the frozen oracle must stay byte-identical; must not edit `packages/console`                                                         | compiler/skeleton implementer, then independent verifier                                                  | deterministic compiler and scenario fixtures; no network                                                          | `packages/compiler`, skeleton loadouts/scenario/reactor, product 02/04/05/06/10, README, capability table row                                                                          |
| [WO-038](../work-orders/WO-038-license-posture-lands.md)             | governance — workspace `license` and `private` metadata, a publication-refusal check in the release-surface preflight, `CONTRIBUTING.md` with the DCO rule, export default license files                                                                                                       | first free lane before the first external fork of the starter; assign version at activation (patch); no hook or settings change; no package publication                                                                    | any capable model, then independent verifier                                                              | none; `npm publish --dry-run` refusal per workspace                                                               | root and workspace `package.json`, `scripts/release.mjs`, `CONTRIBUTING.md`, README, `docs/LEGAL.md`, WO-033's export paragraph                                                        |
| [WO-039](../work-orders/WO-039-harness-lowering.md)                  | harness lowering — the `harness-v1` compiler target (settings permissions and hooks at rung 2, role skills at rung 7, a marked residue block at rung 8), the Contributor build, `harness emit` and `check`, and this repository running on its own generated configuration                     | wave 1 lane A beside WO-032; phase 1 and the self-host are the fork-binding minimum; assign version at activation (minor); authorizes exactly the project-scope generated configuration mutation; ADR-0005 dated amendment | compiler and host implementer, then independent verifier; the live smoke needs the actual harness         | phase 0 harness smoke recorded in discovery before any lowering rule; Claude Code required, Codex where installed |
| [WO-040](../work-orders/WO-040-rule-migration-batch-one.md)          | rule migration — the generated migration ledger over every shape the operator named, batch one of at least twelve units through `harness-v1` into the Contributor build, the whole-set measurement, and the batch template                                                                     | wave 2 lane B beside WO-033 after WO-039; assign version at activation (minor); clean room applies with force: no predecessor file, employer-specific shapes excluded or generalized                                       | unit author and lowering implementer, then independent verifier                                           | none beyond WO-039's; the operator may add or strike candidate shapes by `ideation:` before activation            |
| [WO-041](../work-orders/WO-041-plan-refutation-mechanism.md)         | control plane — a compiled blinded plan refuter over the marked sequence and the vision, the `plan-refutation-v1` result, immutable receipts under `docs/planning/refutations/`, and an evidence-gate check that refuses a planning pass without a matching receipt or with an unanswered hold | lane 0 beside WO-038; assign version at activation (patch); read-only envelope; forward-only enforcement from its merge                                                                                                    | script and loadout implementer, then independent verifier; the live receipt needs one actual transport    | one WO-009 transport for the live receipt; `fake` for fixtures                                                    |
| [WO-101](../work-orders/WO-101-program-and-hash-corpus.md)           | evidence/corpus — Program and identity regression floor                                                                                                                                                                                                                                        | not applicable                                                                                                                                                                                                             | deterministic corpus executor                                                                             | offline harness                                                                                                   | `corpus/harness/`, fixtures, manifests                                                                                                                                                 |
| [WO-102](../work-orders/WO-102-cadence-corpus.md)                    | evidence/corpus — cadence boundary sweep                                                                                                                                                                                                                                                       | assign version and close disposition; pin suitable base/deps and governed closeout path                                                                                                                                    | deterministic corpus executor                                                                             | offline harness                                                                                                   | cadence fixtures and manifests                                                                                                                                                         |
| [WO-103](../work-orders/WO-103-authority-outbox-corpus.md)           | evidence/corpus — authority/outbox decision table                                                                                                                                                                                                                                              | assign version and close disposition; pin the landed WO-017 base and governed closeout path                                                                                                                                | deterministic corpus executor                                                                             | offline harness                                                                                                   | authority/outbox fixtures and manifests                                                                                                                                                |
| [WO-105](../work-orders/WO-105-crash-shape-corpus.md)                | evidence/recovery — crash/truncation sweep                                                                                                                                                                                                                                                     | assign version and close disposition; pin the landed WO-017 base and governed closeout path                                                                                                                                | long deterministic corpus executor                                                                        | offline harness                                                                                                   | retained store/skeleton corpus, trees, traces, fixtures, manifests                                                                                                                     |
| [WO-107](../work-orders/WO-107-profiling-baseline.md)                | performance evidence — baseline without optimization                                                                                                                                                                                                                                           | assign version and close disposition; pin suitable base/deps and governed closeout path                                                                                                                                    | measurement operator                                                                                      | representative quiet environment; two runs are acceptance evidence                                                | profiling harness, baselines, manifests                                                                                                                                                |
| [WO-108](../work-orders/WO-108-mutation-probe.md)                    | evidence quality — current kernel/compiler/skeleton mutation campaign; survivors become investigations                                                                                                                                                                                         | operator-amended on published v0.13.0; v0.13.1 tooling/evidence patch; locked dependencies provisioned offline                                                                                                             | mutation-evidence implementer, independent verifier, final reviewer                                       | deterministic census and 32-site selection; real green baseline, scratch provenance, resumable matrix             | corpus mutation runner/data/run evidence; root test wiring; current reader docs and ideation receipt                                                                                   |
| [WO-109](../work-orders/WO-109-shape-first-source-remine.md)         | research/lineage — bounded shape-first re-mining pilot and measured yield                                                                                                                                                                                                                      | revalidate authoritative single-copy intake in main and narrow access; observe original-resolution image harness; pin budget, yield threshold, version, and close                                                          | mechanical census/capsules, planning-role lineage/weaving, independent verifier                           | mechanical census/register/capsule side routines may use high+; observed image-capable harness required           | main-checkout ignored registers; immutable `docs/lineage/remining/runs/draw-001/` artifacts                                                                                            |

## Tracks and dispatch dimensions

The labels above are pilot metadata, not a final taxonomy:

- **Mainline/product:** the release ladder and its bounded patches.
- **Evidence/corpus:** independent grind work that strengthens evidence without
  becoming release evidence automatically.
- **Research candidate:** source or scenario exploration without an allocated
  work-order identity yet.

“Who should work it?” needs several independent fields: planning, execution,
verification, and final-review role; model and effort constraint; harness;
needed tools or external access; and environmental conditions. “What does it
affect?” needs a conceptual product/app area plus an optional writable-path
envelope. “What does it require?” needs hard dependency separately from
activation preflight.

Unallocated research candidates currently include the source-grounded Team
Topologies mining pass and the post-1.0 Embodied Explorer simulation fixture.
They have no WO number, execution slot, or release promise merely because they
appear here.

## Pilot questions

- Is family single-valued or can one order span several tracks, as WO-004 did?
- Should planning metadata live in each work order, a separate registry, or a
  generated projection over both?
- What evidence boundary should the operator-facing word “complete” default to?
- How should in-slot and governed out-of-slot eligibility appear together?
- Which conditions can be computed, and which require explicit operator
  preflight or recommendation?
- Does a human alias improve scanning enough to justify a second identifier?

The generated index answers the evidence-state question after this pilot exposed
repeated drift. Historical IDs remain unchanged. Standardized front matter, a
registry, a scheduler, and an automatic recommendation remain unselected; the
remaining questions need their own bounded consumer and evidence.
