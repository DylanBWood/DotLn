# WO-030 — Concurrent control state: one append-only segment per work order, lifecycle legality scoped to the named order, a selected-order status projection over every in-flight order, and a proven serial integration of two concurrent orders, v0.7.0

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.7.0` minor above published `v0.6.0`, pinned by
the 2026-09-05 planning pass under the operator's opt-out default
(06-roadmap.md §Release boundary); retime with a dated note if another order
activates first. It adds control-plane capability (several in-flight orders)
while keeping the historical log, the event schema, and every existing
reader's JSON contract; no exported runtime package capability changes. The
executor updates the root README release block to `v0.7.0` and moves the
version of any component whose `src/` changes.
**Nomination provenance:** the 2026-09-05 planning pass after the `v0.6.0`
close, discharging the Fable planning handoff in
`docs/planning/budget-window-work-order-ladders.md` into the plan at
`docs/planning/concurrent-work-orders-plan.md`. Planner-synthesized draft; the
operator's dispatch is preserved locally as a compaction-safety capture
(`docs/intake/notes/2026-09-05-planning-session-uifa-roles-ideation.md`).
Opaque identifier, not a priority. The clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** WO-018 merged (the shared `scripts/lib/` helpers and
`status --json`; satisfied at `v0.4.1`); WO-028 merged (`recordedAt`; satisfied
at `v0.5.1`); WO-026 merged (the index's per-order fold; satisfied at
`v0.5.2`).
**Recommended placement:** before WO-021, whose per-transition beacon emission
and group composite assume per-order state, and before any paired wave; the
ladders document's paired trial requires this order. A recommendation, not a
dependency token.

**Cites (read these sections):** 03-architecture.md §Session lifecycle &
resilience (“One writable agent per worktree serializes appends in v1;
concurrent control-log writers are deferred”; the operator worktree
projection); 06-roadmap.md §Work-order navigation and identity (three separate
answers) and §Candidate — budget-window work-order ladders;
07-execution-guide.md §Operator resume phrases and §Workflow closeout and
releases; `docs/PLAYBOOK.md` §Concurrency; 10-ir-compatibility.md §Separate
version axes and §Transformation graph (direct support versus migration);
12-workstream-application.md §One outcome from request to return (the shared
status question); `docs/planning/budget-window-work-order-ladders.md`
§Feasibility and integration gate and §Fable planning handoff;
`docs/planning/concurrent-work-orders-plan.md`; `scripts/lib/control.mjs`
(`scanControl`, `fold`, `foldWorkOrders`), `scripts/lib/control-time.mjs`,
`scripts/resume.mjs` (`legalActions`, `requirePhase`, `appendTransition`,
`checkpoint`, `statusProjection`), `scripts/worktree.mjs` (`start`, `finish`),
`scripts/release.mjs` (`controlEventsAt`, `addedControlEvents`,
`parseControlStateAt`), `scripts/work-orders.mjs` (`prefixMatches`,
`closeTime`, `beforeClose`), and their shell and Node suites.

**Objective:** Let the control plane hold zero, one, or many in-flight work
orders as independent lifecycles with attributable history, so two orders can
be active in two worktrees at once, a transition can advance only its own
order, merging one order into `main` cannot erase or reinterpret another's
evidence, and every existing reader keeps working over the historical
single-slot log without a rewrite.

**Observed gap (dated 2026-09-05, `main` at `v0.6.0`):**

- `scanControl` in `scripts/lib/control.mjs` keeps one `state` object.
  `WorkOrderActivated` overwrites `workOrderId` and resets every field, so
  activating a second order captures the first order's later events: the
  ladders document's in-memory observation (“activate WO-901; activate WO-902;
  implementation ready for WO-901” folds to WO-902 in `ready-to-verify`)
  reproduces at this base. `requirePhase` consults that single state and
  `activate` requires phase `none` or `closed` globally, so the CLI refuses a
  second activation rather than misattributing, which is correct but forbids
  concurrency.
- All eight event types carry `workOrderId`; every completion event carries
  `actor`; checkpoint refs are already per order
  (`refs/dotln/checkpoint/WO-NNN/<n>`). Attribution data exists in every event
  and only the fold discards it after activation.
- The single `docs/control/resume.jsonl` is appended in each work-order
  branch. Two concurrent branches would produce a textual conflict at the pull
  request, or, under a union merge, an interleaving that shifts ordinals.
  `release.mjs` proves append-only history by byte-prefix comparison of that
  one file (`addedControlEvents`), and `work-orders.mjs` attributes releases and
  legacy close times through the same prefix rule (`prefixMatches`,
  `closeTime`, `beforeClose`). Both proofs must survive.
- Readers: `worktree finish` reads the subject's committed `status --json` and
  requires `closed` for its order; `release close` reads
  `parseControlStateAt(root, revision)` at the merged commit; `next` and
  `current.md` are single-slot; the index already folds every order through
  `foldWorkOrders`.

**Design (scope discipline):**

- **Segments.** `activate WO-NNN` creates `docs/control/orders/WO-NNN.jsonl`
  and appends the activation there. Every later transition for that order
  appends to the segment that holds its activation. `docs/control/resume.jsonl`
  becomes a frozen legacy segment: it is read first, its events keep their
  ordinals, and an order whose activation lives there keeps appending there
  until it closes, so no event ever moves. A segment whose file name and
  activation disagree, or that contains an event with another `workOrderId`,
  refuses at fold with the segment path and ordinal; no transition appends
  anything after such a refusal.
- **Fold.** `foldSegments(legacy, segments)` returns one state per order plus
  the legacy fold; `fold(events)` is retained for a single order's events and
  its phase table does not change. Legality consults only the named order's
  state; `activate` is legal when that order's own phase is `none` or `closed`.
  The event schema stays `1`; the segment layout is a documented storage axis,
  not an event field.
- **Selection.** In a `wo-NNN` worktree, `status`, `next`, and every transition
  bind `WO-NNN` from the branch name; `--work-order WO-NNN` overrides and is
  required on `main` when more than one order is open. An unknown or ambiguous
  selection refuses and lists the open orders. `status --json` keeps its
  existing top-level fields for the selected order (so `worktree.mjs` and
  `release.mjs` keep their contract) and adds `orders[]`, one entry per known
  order with `phase`, `latestVerdict`, `recordedAt`, and `elapsed`.
  `current.md` lists every non-closed order first, then the latest closed one.
- **Integration and release.** `addedControlEvents` and the index's prefix
  rules run per segment; a tag's recorded control snapshot names each segment
  it contained. `worktree finish` and `release close` read the selected order's
  segment at the merged revision; their preconditions do not change.
  Pull-request merges touch only the merging order's segment plus regenerated
  projections.
- **Checkpoints and time.** Unchanged: per-order refs, `recordedAt` at append,
  `times` over legacy events byte-identical, with a segment label added for new
  events. Timing never orders events across segments.
- **Declined alternatives, recorded:** a union merge driver on the single file
  (reorders global ordinals and weakens the byte-prefix proofs); rewriting the
  legacy log into segments (a migration of immutable evidence with no
  consumer).

**Bounded boy-scout item (nominated 2026-09-05, authorized here):** add
`"types": ["node"]` to `compilerOptions` in `packages/kernel/tsconfig.json`,
`packages/compiler/tsconfig.json`, and `packages/skeleton/tsconfig.json`.
TypeScript 7.0.2 no longer includes `@types/node` implicitly and reports
`Cannot find name 'node:test'` plus downstream `CompileResult` narrowing errors
in an editor; with the field present all three packages are clean under 7.0.2,
and the pinned 5.4.5 accepts it. Covered by this order's `npm test`; report it
in the result. ADR-0002's 2026-09-05 amendment records the posture.

**Deliverables:** the segment layout and fold; order-scoped legality; selection
by branch name and `--work-order`; the `orders[]` projection and `current.md`
rendering; per-segment append-only and release attribution; the two-branch
integration fixture; tests in `scripts/test-resume.sh`,
`scripts/test-checkpoint.sh`, `scripts/test-worktree.sh`,
`scripts/test-release.sh`, and `scripts/test-work-orders.mjs`; the write-backs
below.

**Acceptance criteria (all required)**

1. In a real-Git fixture, two worktrees activate WO-901 and WO-902; WO-901
   advances to `ready-to-verify` and WO-902 to `verifying`. Each
   `status --json` reports its own phase; WO-901's `implementation-ready`
   leaves WO-902's segment and projection byte-identical; the ladders
   document's synthetic sequence now folds to WO-901 `ready-to-verify` and
   WO-902 `active`.
2. A segment holding an event with a foreign `workOrderId`, or an activation
   that disagrees with its file name, refuses at fold with path and ordinal;
   every transition against that repository refuses and appends nothing.
3. The real `docs/control/resume.jsonl` at activation folds to per-order states
   equal, field for field, to `foldWorkOrders` at `v0.6.0` (a committed JSON
   comparison); `npm run resume --silent -- times` over it is byte-identical to
   the pre-change output for those events; and `npm run work-orders -- index`
   differs only where the layout is described.
4. An order activated in the legacy file keeps appending there; a newly
   activated order gets its own segment; no order's events ever span two files
   (a test scans every segment).
5. Selection: in a `wo-NNN` worktree the phrases bind that order without a
   flag; on `main` with two open orders a bare `status` lists both and a
   transition refuses until `--work-order` names one; an unknown id refuses.
6. Integration: merge the WO-901 branch into the fixture `main`, then WO-902's;
   both per-order states equal their pre-merge states; `worktree finish` for
   WO-901 succeeds while WO-902 is open; a no-publish `release close` for
   WO-901 validates from the merged revision; after WO-902 closes and releases,
   the index attributes each order to its own release; a third branch created
   before the first merge and merged after it keeps its segment intact and its
   append-only proof passing.
7. `current.md` and `status --json` render every in-flight order with elapsed
   phases; `worktree.mjs` and `release.mjs` contain no new parse of
   `current.md` and read only the JSON contract.
8. Write-backs land: 03 §Session lifecycle & resilience (segment layout,
   selection, per-order legality, and a dated migration note superseding
   “concurrent control-log writers are deferred”); 07 §Operator resume phrases
   (`--work-order` and the between-orders report); `docs/PLAYBOOK.md`
   §Concurrency (the paired-wave procedure and serial integration);
   02-domain-model.md's control-plane paragraph (one sentence);
   `docs/planning/budget-window-work-order-ladders.md` (the feasibility gate is
   discharged for this slice); `docs/planning/concurrent-work-orders-plan.md`
   and the map; ledger entry.
9. `npm test` green; `git diff --check` clean; no new dependency;
   `scripts/*.mjs` and `scripts/lib/*.mjs` line counts reported against
   `main`.

**Evidence gate:** the fixture transcripts for criteria 1 through 7; the
committed legacy-fold comparison and `times` comparison; the integration
fixture's Git log; `npm test`.

**Write-back duty:** as listed in criterion 8, plus `docs/work-orders/README.md`
regenerated and the capability table's control-plane row updated to name
several in-flight orders as demonstrable.

**Non-goals:** lane or wave generation; admission control, throttling, or
pauses; tenant or track schema; contribution tracks and release-membership
views beyond the existing per-order attribution; automatic dispatch or worker
launch; beacon emission (WO-021); concurrent appends inside one worktree; a
union merge driver; rewriting or moving any legacy event; an event
schema-version bump; per-order declared workflows (a later slice; this order
keeps the single lifecycle contract).

**Operator-review assumptions**

1. One append-only segment per order is preferred over a union-merged single
   file; the alternative and its cost are recorded in the plan.
2. The legacy file is frozen by activation location, not by a migration event,
   so nothing in immutable history moves.
3. Selection binds to the `wo-NNN` branch name in a worktree, with
   `--work-order` as the explicit override on `main`.
4. WO-030 runs before WO-021 and before the first paired wave; if the operator
   prefers Beacons first, the map's reversal condition applies and this
   order's scope is unchanged.
