# Work-order map — human planning judgment

**Planning revision:** 2026-09-05, the planning pass after the `v0.6.0`
close (previous revision 2026-09-04, WO-020 ideation). The generated
[work-order index](../work-orders/README.md) now owns header observations,
control evidence, dependency-token status, and local release attribution. This
map retains recommendations, rationale, tracks, and human activation preflight.
The catalog's manually maintained evidence, hard-dependency, and model/effort
columns were removed on this date; their drift is documented in the
[activation comparison](work-order-index-activation-2026-09-04.md).

For the active slot's legal action, use `npm run resume --silent -- status
--json`. For authority, read the selected work order. The index's computed
readiness is only a conservative token view: recommendations, independent
orders, oracle references, and reverse references inside a Depends on paragraph
need human interpretation. No view chooses or authorizes the next order.

Work-order numbers are stable opaque identities. They are not a queue, priority,
roadmap position, or family code. The adjacent evidence/corpus track does not
require mainline work to count upward to reach it.

## Recommendation and rationale

The operator restated this sequence during WO-020; the 2026-09-05 planning
pass inserted WO-030 ahead of WO-021 and placed WO-031 in the free lane beside
WO-009 (see the [concurrent work-orders plan](concurrent-work-orders-plan.md)).
This marked list is its single editable source; the work-order README renders
it with evidence-derived progress marks. Keep the plain one-item-per-line form
usable in a text editor.
Closed entries remain here until the operator changes the planning horizon;
the generator marks them rather than asking the operator to cross them off.

<!-- dotln-work-order-sequence:start -->

- WO-020 — Beacon codebook
- WO-030 — Concurrent control state
- WO-021 — Control-plane beacons
- WO-029 — Pinned artifact identity
- WO-009 — Real disposable worker
- WO-031 — Actor usage projection
- WO-022 — Senses
- WO-010 — Independent verification
- WO-011 — Feedback compiler

<!-- dotln-work-order-sequence:end -->

Revalidate each selection against its authority, the index, and current
preflight facts; this is a human recommendation, not a scheduler or an
activation. WO-026 has passing final-review and local release evidence; WO-020
passed independent verification and final review at this revision and awaits
operator merge. The README derives those facts anew instead of relying on this
dated planning sentence.

The planning reasons remain: the index reduces repeated evidence gardening;
the beacons make state and staleness legible before the external worker;
WO-029 pins consuming artifact identities immediately before WO-009; and
WO-022 follows the worker boundary for mount semantics. The earlier pull-forward
of WO-023 responded to repeated manual review/planning and availability of the
real compiler. WO-028's append-time projection can support beacon derivation
without introducing attention or resource telemetry.

WO-030 precedes WO-021 because the beacon hook and group composite assume
per-order control state, and because the paired trial in the ladders document
cannot run on a fold that lets a second activation capture the first order's
events. After WO-030 merges, WO-021 and WO-029 are the first paired wave
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

After WO-021, the [proposed beacon usefulness checkpoint](beacon-usefulness-checkpoint.md)
compares the new projection with existing status views before recommending
further investment. The technical orders do not by themselves prove the wider
DotLn or Protíno product thesis. This observation adds no release gate or
automatic change to the sequence above.

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

- The concurrent-workflow control change is planned and its first slice is
  filed as WO-030; the lane-plan projection, declared per-order workflows,
  admission policy, contribution tracks, and tenant-scoped tracks remain
  unfiled with the filing conditions in the
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
- **Unallocated governance candidate — licensing and distribution posture:**
  protect every unpublished workspace (`@dotln/kernel` is the measured gap),
  record `UNLICENSED` while no rights are granted, and add a tested publication
  refusal. Before the first outside contribution or distributed/hosted consumer
  surface, compile the operator's actual choice into scoped code,
  documentation, data, and asset licenses; inbound terms; third-party notices;
  privacy/service obligations; and brand review as applicable. The candidate
  has no number, selected license, version, sequence position, or activation
  authority.
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

| Work order                                                     | Purpose / track                                                                                                | Activation preflight                                                                                                                                                                                          | Execution role                                                                  | Environment / capability preflight                                                                      | Primary affected surfaces                                                                                                                                                              |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [WO-001](../work-orders/WO-001-environment-truth.md)           | discovery — bounded host truth                                                                                 | not applicable; historical evidence input                                                                                                                                                                     | bounded environment investigator                                                | read-only host inspection                                                                               | `docs/discovery/`                                                                                                                                                                      |
| [WO-002](../work-orders/WO-002-pure-kernel.md)                 | core runtime — pure kernel                                                                                     | not applicable                                                                                                                                                                                                | pure-kernel implementer                                                         | deterministic build/test harness                                                                        | `packages/kernel/`                                                                                                                                                                     |
| [WO-003](../work-orders/WO-003-walking-skeleton.md)            | integration — fake end-to-end vertical                                                                         | not applicable                                                                                                                                                                                                | integration/scenario implementer                                                | deterministic fake-executor scenario                                                                    | `packages/skeleton/`; bounded kernel gaps                                                                                                                                              |
| [WO-004](../work-orders/WO-004-environment-truth-addendum.md)  | operations/discovery — lifecycle and environment corrections                                                   | not applicable                                                                                                                                                                                                | lifecycle/release engineer and environment investigator                         | authenticated transport probes where required                                                           | discovery, scripts, control, lifecycle docs                                                                                                                                            |
| [WO-005](../work-orders/WO-005-capability-table.md)            | planning/evidence — capability maturity inventory                                                              | not applicable                                                                                                                                                                                                | evidence planner/documentarian                                                  | document/evidence review                                                                                | capability table, docs map, lifecycle/evidence records                                                                                                                                 |
| [WO-006](../work-orders/WO-006-publication-bootstrap.md)       | publication/process/tooling — publication loop plus authorized expansions                                      | not applicable                                                                                                                                                                                                | completed executor/reviewer                                                     | repository toolchain; personal-harness reconciliation deferred to WO-014                                | publication, product, lineage, decisions, docs, scripts                                                                                                                                |
| [WO-007](../work-orders/WO-007-audit-record-baseline.md)       | auditability — deterministic projections                                                                       | not applicable                                                                                                                                                                                                | audit-projection implementer, then independent verifier                         | real walking-skeleton log plus deterministic checks                                                     | skeleton audit types; product 09; CLI/docs plus authorized documentation expansions                                                                                                    |
| [WO-008](../work-orders/WO-008-composition-compiler.md)        | composition — compiled loadouts and diff                                                                       | satisfied — activated from published `v0.3.6`; `v0.4.0` pinned by the order; the 21 WO-003 decision traces were frozen before the loadout was replaced                                                        | pure-compiler implementer                                                       | deterministic compiler/fixture harness                                                                  | new compiler package; skeleton integration; product docs                                                                                                                               |
| [WO-009](../work-orders/WO-009-real-disposable-worker.md)      | runtime/integration — real worker transport                                                                    | refresh cites to landed WO-016/WO-008 at activation, assign the next compatible release, and consume WO-029's whole-program receipt if it has landed without importing its deferred component-membership gate | runtime/adapter implementer                                                     | authenticated nonsandboxed runner and two live CLI transports                                           | transport adapters; real-episode integration                                                                                                                                           |
| [WO-010](../work-orders/WO-010-independent-verification.md)    | verification runtime — blinded repair/reverify loop                                                            | active slot must close after dependency lands                                                                                                                                                                 | verification-system implementer, followed by a separate verifier                | fake/live transport fixtures and planted-defect loop                                                    | verification runtime, workstream matrix, status projection                                                                                                                             |
| [WO-011](../work-orders/WO-011-feedback-compiler.md)           | feedback/self-hosting — ten units and first dogfood                                                            | active slot must close after dependencies land                                                                                                                                                                | feedback-compiler implementer, followed by separate verification                | operator-witnessed self-hosted run is acceptance evidence                                               | feedback compiler, runtime, fixtures, product docs                                                                                                                                     |
| [WO-012](../work-orders/WO-012-release-gate-path-quoting.md)   | operations patch — release path safety                                                                         | not applicable                                                                                                                                                                                                | release-tooling repairer                                                        | path-byte fixtures and release/worktree tests                                                           | release/worktree scripts and tests                                                                                                                                                     |
| [WO-013](../work-orders/WO-013-portable-fixture-temp-roots.md) | test-infrastructure patch — portable fixture temporary roots                                                   | satisfied — used the governed post-`v0.3.0` base; activation's version-placeholder miss was forward-corrected in the authority; merge and release close completed                                             | shell-fixture repairer working inside a sandboxed harness                       | supplied-root-only macOS policy plus Claude Code 2.1.258 sandbox evidence captured                      | `scripts/test-*.sh`, shared temp-root helper, a new temp-root fixture, one runbook note                                                                                                |
| [WO-014](../work-orders/WO-014-approval-burden-contract.md)    | harness evidence/process — approval-burden contract; carries WO-006's deferred posture reconciliation          | assign version and close disposition; both harnesses installed at recorded versions; operator available to witness fresh-session runs                                                                         | harness-evidence executor, independent fresh-session verifier, operator witness | Claude Code and Codex CLI; personal-setting authority stays with the operator                           | runbook, ADR-0003/ADR-0004 amendments, `docs/discovery/` matrices, a synthetic approval-surface fixture                                                                                |
| [WO-015](../work-orders/WO-015-release-cadence-parser.md)      | operations patch — release-manifest cadence extraction                                                         | not applicable                                                                                                                                                                                                | release-tooling repairer, then independent verifier                             | canonical TypeScript source plus isolated release/tag fixtures                                          | `scripts/release.mjs`, `scripts/test-release.sh`, roadmap and this map                                                                                                                 |
| [WO-016](../work-orders/WO-016-skeleton-reactor.md)            | skeleton architecture/evidence — one Reactor for live execution and replay                                     | satisfied — activated from published `v0.3.5`; `v0.3.6` assigned; Stage 1 baselines captured before source edits                                                                                              | skeleton/reactor implementer                                                    | deterministic live/replay and mutation harness                                                          | skeleton reactor, scenario, tests, and README; bounded kernel gaps                                                                                                                     |
| [WO-017](../work-orders/WO-017-kernel-truthfulness.md)         | kernel correctness/evidence — store codec, outbox ordering, authority guard, evidence hardening                | satisfied — `v0.3.5` assigned; operator merge and release close completed                                                                                                                                     | pure-kernel boundary repairer                                                   | built-kernel probes and deterministic mutation drills                                                   | kernel store/core/tests/README, skeleton envelope, domain and architecture docs                                                                                                        |
| [WO-018](../work-orders/WO-018-control-plane-consolidation.md) | control-plane/tooling — shared helpers, machine state, built-kernel manifest                                   | satisfied — activated from published `v0.4.0`; `v0.4.1` and `@dotln/kernel` `0.2.1` assigned; landed WO-013 shell-fixture and WO-024/WO-025 release-script changes consumed                                   | control-plane refactorer/evidence engineer                                      | shell fixtures plus real-repository publication/corpus checks                                           | script libraries, lifecycle/release/publication suites, guide/playbook/release/corpus docs                                                                                             |
| [WO-019](../work-orders/WO-019-effort-truth.md)                | process/control evidence — declared and attested effort truth                                                  | satisfied — active branch contained published `v0.3.3`; bounded readback probe completed without importing personal settings; merge and release close completed                                               | control-plane/process implementer, then verifier and reviewer                   | attested harness/model/effort/source                                                                    | resume script/tests, discovery, guide/playbook/domain/evidence docs                                                                                                                    |
| [WO-020](../work-orders/WO-020-beacon-codebook.md)             | skeleton projection/CLI — metadata-only episode Beacons and exact disclosure codebook                          | satisfied — activated from published `v0.5.2`; `v0.6.0` assigned under the release-assignment default; intake sources and host metadata re-observed in the stage receipts; see the index for evidence         | beacon projection/codebook implementer plus bounded environment probe           | deterministic pure/filesystem fixtures on a re-observed host                                            | skeleton beacon pure/filesystem modules, CLI/tests, discovery, product/README/capability table                                                                                         |
| [WO-021](../work-orders/WO-021-control-plane-beacons.md)       | control-plane dogfood/projection — authorized beacon sweeps, staleness, audiences, group composites            | active slot must close; assign version and close disposition; activate from a governed base containing all dependencies                                                                                       | control-plane/beacon integrator                                                 | deterministic resume/worktree and metadata fixtures                                                     | resume/worktree scripts, codebook v2, Observe guard choice, audience directories, skeleton, classifier                                                                                 |
| [WO-022](../work-orders/WO-022-senses.md)                      | composition/runtime capability — Senses as compiled, authorized, mounted perception                            | active slot must close; assign version and close disposition; consume bounded v2; re-observe sparse/numeric/filesystem limits; arrange a non-repository key; prove v3 representable                           | composition/perception-capability implementer                                   | deterministic compiler/path/keyed-residue/authorization fixtures                                        | perception supports/fixtures, sparse-twin affordance, host path/provenance residue, bounded guard, docs/tests                                                                          |
| [WO-023](../work-orders/WO-023-compile-entropy-reducer.md)     | instance content — compile the Entropy Reducer reviewer and generated dispatch residue                         | historical compiled-instance scope; consult current evidence in the index                                                                                                                                     | instance-content/compiler implementer, then human review and blinded refutation | compiled reviewer Claude Fable 5.1 at max with attestation                                              | compiler wildcard contract; skeleton loadout/compiler boundary; instance residue and run evidence; tests; pattern/playbook/architecture/ledger docs                                    |
| [WO-024](../work-orders/WO-024-release-notes-surfaced.md)      | operations patch — reviewed release notes in the tag, GitHub Release projection, local render                  | satisfied — used the governed post-`v0.3.1` base; real outside-sandbox close completed after fixture-stubbed implementation evidence                                                                          | release-tooling implementer, then independent verifier                          | `gh` stub in fixtures                                                                                   | `scripts/release.mjs`, `scripts/worktree.mjs`, release and worktree suites, the final-review package, guide/playbook/releases docs                                                     |
| [WO-025](../work-orders/WO-025-version-bearing-surfaces.md)    | operations patch — checked release surfaces and renderer-wrapped GitHub bodies                                 | satisfied — active branch included WO-024 and published `v0.3.2`; merge and release close completed                                                                                                           | release-tooling implementer, then independent verifier                          | see authority                                                                                           | README/release checks, publisher/close gates, body profile, skeleton version/banner, release/process/compatibility docs                                                                |
| [WO-026](../work-orders/WO-026-work-order-index.md)            | planning tooling — generated open/closed work-order index over control evidence; files never move              | satisfied — activated from published `v0.5.1`; `v0.5.2` assigned under the release-assignment default; consult current evidence in the index                                                                  | planning-tooling implementer, then independent verifier                         | see authority                                                                                           | new `scripts/work-orders.mjs`, generated `docs/work-orders/README.md`, this map's catalog, roadmap/playbook/guide docs                                                                 |
| [WO-027](../work-orders/WO-027-local-inference-probe.md)       | discovery — local-inference runner inventory, pinned artifact, no-egress evidence, calibration decision        | satisfied — `v0.3.3` assigned; operator present; no download; one combined-boundary launch; v3 loopback succeeded, external attribution ambiguous; operator merge and no-release close completed              | bounded environment investigator, then independent verifier                     | LM Studio 0.4.13+1 was the only installed runner and its sole service launch crashed                    | `docs/discovery/local-inference.md` and `.json`, roadmap/discovery/README/ledger write-backs; nothing under `packages/` or `scripts/`                                                  |
| [WO-028](../work-orders/WO-028-control-event-time.md)          | control plane — `recordedAt` on control events, elapsed-phase projection, labeled recovery of historical times | historical bounded local-ref observation; no activation decision maintained here                                                                                                                              | control-plane implementer, then independent verifier                            | see authority                                                                                           | `scripts/resume.mjs` and `scripts/lib/`, resume and checkpoint suites, `docs/control/current.md`, a dated `docs/discovery/` observation, architecture/guide/playbook/domain-model docs |
| [WO-029](../work-orders/WO-029-pinned-artifact-identity.md)    | composition/runtime evidence — pin equipped artifact identity and refuse on drift                              | interpret the reverse WO-009 reference; assign version and close disposition; pin semantic/component-definition identities and legacy-event policy                                                            | compiler/skeleton receipt implementer, then independent verifier                | pure compiler plus deterministic runtime/audit fixtures                                                 | compiler artifact identity; skeleton equip/recompile/refusal/audit path; product, map, and lineage docs                                                                                |
| [WO-030](../work-orders/WO-030-concurrent-control-state.md)    | control plane — one segment per order, order-scoped legality, multi-order projection, proven integration       | runs alone as wave 0 while the active slot is closed; `v0.7.0` pinned 2026-09-05, retime with a dated note if WO-021 runs first; confirm per-segment layout over a union-merged file                          | control-plane implementer, then independent verifier                            | real-Git fixtures with two worktrees and a fixture main; no network                                     | `scripts/lib/control.mjs`, `resume.mjs`, `worktree.mjs`, `release.mjs`, `work-orders.mjs`, control docs, playbook, ladders plan                                                        |
| [WO-031](../work-orders/WO-031-actor-usage-projection.md)      | control-plane projection — elapsed time per actor and phase; opt-in opaque account label                       | WO-030 merged; assign version and close disposition; confirm the public two-accounts disclosure                                                                                                               | control-plane implementer                                                       | deterministic log fixtures; the real log for the echoed report                                          | `resume.mjs`, `scripts/lib/control-time.mjs`, `.gitignore`, product 02/07/09, playbook                                                                                                 |
| [WO-101](../work-orders/WO-101-program-and-hash-corpus.md)     | evidence/corpus — Program and identity regression floor                                                        | not applicable                                                                                                                                                                                                | deterministic corpus executor                                                   | offline harness                                                                                         | `corpus/harness/`, fixtures, manifests                                                                                                                                                 |
| [WO-102](../work-orders/WO-102-cadence-corpus.md)              | evidence/corpus — cadence boundary sweep                                                                       | assign version and close disposition; pin suitable base/deps and governed closeout path                                                                                                                       | deterministic corpus executor                                                   | offline harness                                                                                         | cadence fixtures and manifests                                                                                                                                                         |
| [WO-103](../work-orders/WO-103-authority-outbox-corpus.md)     | evidence/corpus — authority/outbox decision table                                                              | assign version and close disposition; pin the landed WO-017 base and governed closeout path                                                                                                                   | deterministic corpus executor                                                   | offline harness                                                                                         | authority/outbox fixtures and manifests                                                                                                                                                |
| [WO-105](../work-orders/WO-105-crash-shape-corpus.md)          | evidence/recovery — crash/truncation sweep                                                                     | assign version and close disposition; pin the landed WO-017 base and governed closeout path                                                                                                                   | long deterministic corpus executor                                              | offline harness                                                                                         | retained store/skeleton corpus, trees, traces, fixtures, manifests                                                                                                                     |
| [WO-107](../work-orders/WO-107-profiling-baseline.md)          | performance evidence — baseline without optimization                                                           | assign version and close disposition; pin suitable base/deps and governed closeout path                                                                                                                       | measurement operator                                                            | representative quiet environment; two runs are acceptance evidence                                      | profiling harness, baselines, manifests                                                                                                                                                |
| [WO-108](../work-orders/WO-108-mutation-probe.md)              | evidence quality — suite thinness probe; survivors are findings, not fixes                                     | assign version and close disposition; pin suitable base/deps and governed closeout path                                                                                                                       | mutation-testing operator                                                       | deterministic mutator; red baseline is an execution refusal condition                                   | `corpus/mutation/`, manifests, scratch fixtures                                                                                                                                        |
| [WO-109](../work-orders/WO-109-shape-first-source-remine.md)   | research/lineage — bounded shape-first re-mining pilot and measured yield                                      | revalidate authoritative single-copy intake in main and narrow access; observe original-resolution image harness; pin budget, yield threshold, version, and close                                             | mechanical census/capsules, planning-role lineage/weaving, independent verifier | mechanical census/register/capsule side routines may use high+; observed image-capable harness required | main-checkout ignored registers; immutable `docs/lineage/remining/runs/draw-001/` artifacts                                                                                            |

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
