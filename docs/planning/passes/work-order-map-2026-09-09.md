# Historical planning rationale through 2026-09-06

Moved in WO-126 on 2026-09-09. The source blocks retain every byte. Historical relative links used `docs/planning/` as their base; the resolved links below remain navigable. The [current map](../work-order-map.md) and [sequence](../sequence.md) own the current recommendation.

- [phase-two plan](../phase-two-plan-2026-09-06.md#the-redirect--second-pass-of-2026-09-06)
- [executor receipt](../../evidence/WO-038/README.md)
- [corpus outcome](../../../corpus/mutation/README.md)
- [work-order receipt](../../work-orders/WO-108-mutation-probe.md#ideation-breakout-receipt--implementation-consequences-2026-09-06)
- [executor receipt](../../evidence/WO-011/README.md)
- [WO-022 evidence](../../evidence/WO-022/README.md)
- [evidence](../../evidence/WO-031/README.md)
- [ideation receipt](../../evidence/WO-031/ideation.md)
- [concurrent work-orders plan](../concurrent-work-orders-plan.md)
- [integration contract](../../product/07-execution-guide.md#independent-workflows-and-integration)
- [proposed beacon usefulness checkpoint](../beacon-usefulness-checkpoint.md)
- [executor evidence](../../evidence/WO-009/README.md)
- [budget-window ladder plan](../budget-window-work-order-ladders.md)
- [Fable planning handoff](../budget-window-work-order-ladders.md#fable-planning-handoff)

~~~~markdown
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

~~~~
