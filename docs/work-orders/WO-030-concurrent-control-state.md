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

## Executor outcome — 2026-09-05

Implemented the bounded concurrent-control slice. New activations own one
segment; legacy activations, including this order, retain their original file.
The shared fold isolates every order's lifecycle and evidence. Branch/flag
selection preserves the selected-order JSON contract and adds `orders[]`;
current Markdown lists all known in-flight orders and the latest closed order.
Worktree finish, release close, release-note attribution, and the generated
index read committed segments and prove append-only prefixes per file.

**Actor:** Codex CLI `0.153.2` (observed); `gpt-6-astra`, effort `max`, source
`operator-attested` under the execution guide's dated Codex default. This is not
an effective-session readback claim.

**Evidence:** `npm test` passed: formatting, publication and index freshness,
all lifecycle/backup/temp-root shell suites, the real-Git concurrency fixture,
187 kernel/compiler/skeleton tests, and 8 ID corpus tests. `git diff --check`
passed. [Executor evidence](../evidence/WO-030/README.md) contains the acceptance
mapping, committed v0.6.0 fold comparison for the unchanged 153-event activation
prefix, byte-identical legacy timing observation, fixture transcripts and Git
log, and line counts for every `scripts/*.mjs` and `scripts/lib/*.mjs` against
main. Total script lines: 6,001 → 7,227 (+1,226), including 851 added test lines.
The fixture proves named-order finish/release while another order is open and
separate release attribution, including a third branch created before the
first merge. Its remote and npm/GitHub operations are isolated test fixtures;
the root test gate ran the actual pinned build.

**Write-backs:** product 02/03/06/07/10, operator playbook, docs entry point,
ladders/concurrency plans, planning map, capability table, ledger, generated
work-order index, and affected publication status/locks. The root README source
claim is `v0.7.0` above published `v0.6.0`; no component `src/` changed, so
component versions stay unchanged. The authorized boy-scout change adds
`"types": ["node"]` to all three package tsconfigs; the pinned TypeScript 5.4.5
build passed. No new dependency.

**Clarifications and limits:** storage ownership persists through legal
reactivation, so an identity never spans files. Status observes segments in its
checkout/revision rather than polling unmerged siblings. The latest closed
display uses the subject branch or Git integration order, never timestamps.
There was no existing control-plane capability row, so a dated demonstrable
row was added without changing historical assessments. No scope expansion or
unresolved implementation question; a measured paired wave and the named
future workflow/admission/dispatch slices remain deferred. The lifecycle tools
used for this work are also deliverables; baseline comparisons and independent
fixture assertions provide evidence beyond their successful self-use.

Independent verification and final review remain outstanding. No work-order
branch commit, production push, PR, tag, release, or deployment was performed.

## Ideation breakout receipt — 2026-09-05

**Authority and source treatment:** the operator opened two `ideation:` entries
while WO-030's implementation evidence was green and before its
`implementation-ready` transition: optional decomposition of any work order
under one umbrella with mutually exclusive execution routes, and UIFA human
responsibility for security, authentication/authorization, logs, and
traceability. This explicitly authorizes the full documentation breakout under
07 §Operator-opened ideation mode. Shape-First Synthesis uses the saved public
Clean Room loadout; this was ordinary raw ideation, not a ready-to-file draft.
The clean-room screen found no employer code/configuration/identifiers,
credentials, internal services, or other stop condition. The synthesis retains
the desired interaction and omits incidental workplace comparison. No extra
review support was equipped.

**Raw intake and preservation:**
`docs/intake/notes/WO-030-expanded-ideation-2026-09-05.md`, SHA-256
`858b8458926d8bed33db88c1e2b8f5156413e9f00a7f33ad2e20af10b0462255`.
The main control-plane checkout was explicitly resolved from Git's worktree
inventory. After a one-invocation filesystem approval, the provisional capture
was moved without overwrite to that checkout's ignored intake. Its hash matches
the capture and backup, its mode is `0600`, it is untracked, and no worktree-local
duplicate remains. The existing backup helper produced and archive-tested
`DotLn-wo030-intake-20260905T053955Z.zip` outside the repository (four files,
including the three intake placeholders). Reconciliation is complete; preserve
the canonical capture and backup independently of worktree removal.

**Durable surfaces:**

- [Ledger](../lineage/idea-ledger.md#2026-09-05-wo-030-work-order-splitting-and-uifa-assurance-ideation):
  new preserved entries for alternative whole/child routes, useful split
  suggestions including no split, and UIFA security/identity/evidence judgment.
  Earlier entries retain their bytes.
- [Product 06](../product/06-roadmap.md#candidate--whole-or-split-work-orders-under-one-umbrella):
  candidate umbrella and route-exclusion behavior, serial/parallel/mixed
  dependency plans, acceptance coverage, and unchanged opaque identity contract.
- [Product 13](../product/13-uifa-roles.md#candidate--security-identity-logs-and-traceability-responsibilities):
  candidate responsibilities and assistance, with role grouping/names open;
  showrunner cross-reference. [Product 09](../product/09-audit-resilience-privacy.md)
  connects this to its existing concern and privacy boundaries.
- Publication audience/status rows and affected edition source locks are part
  of the same write-back. Both new sections remain `vision` candidates.

**Open choices and effects:** split suggestions and route selection are future
behavior; no command or child-ID syntax is adopted. Planning must still resolve
active/historical orders, atomic route choice across worktrees, nesting and
revision, failure handling, aggregate closure, and release attribution. A child
failure cannot quietly reopen the original whole route. One versus several
UIFA hats, their names, and responsibility overlaps remain open. The proposed
one-hat or two-hat groupings are synthesis options, not operator decisions.
No ADR, schema, runtime, dependency, setting, or release target changes from this
breakout. No reusable helper was created; capture and documentation edits used
ordinary file operations and the existing backup/publication tools.

**Required review:** the independent verifier and final reviewer must read this
receipt and the promoted sections. Check source-treatment fidelity, the permanent
whole-route exclusion after a child starts, stable historical identities,
acceptance/evidence coverage, and the separation of hierarchy from scheduling.
Check the five adopted UIFA names against the speculative additions; preserve
authentication/authorization/log/audit distinctions and the ADR-0006
platform/instance boundary. Verify links, candidate status, publication
freshness, ignored capture/backup/reconciliation, and preservation of the
pre-breakout implementation and passing evidence. This doc-only expansion is
not authority to implement either candidate. The earlier `resume: next`
dispatch remains the authority for finishing WO-030's implementation handoff;
the ideation did not cancel it. This receipt and its checks are complete before
recording `implementation-ready`, with the candidates included in review scope.

**Executor checks:** full-repository formatting, publication coverage (222/222
product headings), both edition source locks, generated work-order index
freshness, and `git diff --check` passed after the write-back. The canonical
capture and archive member match the recorded SHA-256; ignored/untracked status,
file mode, and absence of staging were checked. WO-030's earlier full `npm test`
pass remains the implementation evidence; this breakout changed documentation
only. Independent verification and final review remain outstanding.
