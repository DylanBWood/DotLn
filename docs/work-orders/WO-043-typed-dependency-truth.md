# WO-043 — Typed dependency truth: work orders declare typed dependency relations, only an unmet hard dependency or planning deferral blocks activation, and the index and lifecycle status share one projection (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Control-plane tooling and documentation:
a typed dependency block in work-order files, one shared projection in
`scripts/lib/`, an additive `status --json` field, one activation refusal,
and the generated index. No exported runtime capability, no event-schema
change. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the generated index's own rows (a closed order
shown as "blocked on WO-001"), the planning map's standing disclaimer that
dependency readiness is a conservative token view, the 2026-09-08 external
source audit, and the operator's 2026-09-08 `planning:` dispatch, which names
this order as the parallel companion of WO-042. Planner-synthesized draft; the
dispatch is preserved locally as a compaction-safety capture
(`docs/intake/notes/2026-09-08-critical-path-planning-dispatch.md`, SHA-256
recorded in the ledger section of the same date). Opaque identifier, not a
priority. The clean-room screen found no stop condition.
**Depends on:** WO-026 merged (the generated index this order extends;
satisfied at `v0.5.2`); WO-030 merged (per-order control segments and
selection; satisfied at `v0.7.0`). No open order is an input; the typed
graph this order migrates from is `docs/planning/critical-path-2026-09-08.json`.
**Recommended placement:** the 2026-09-08 horizon's second order, beside
WO-042 and WO-036, with which it shares no primary write surface (this order
edits `scripts/work-orders.mjs`, `scripts/resume.mjs`, a new
`scripts/lib/dependencies.mjs`, the open work-order files' leading metadata,
and products 06 and 07; WO-042 edits the compiler; WO-036 edits the test
runner). A recommendation, not a dependency token.

**Cites (read these sections):** 06-roadmap.md §Work-order navigation and
identity (candidate; "Eligible now"; hard dependency graph as a distinct
planning input; standardized front matter and a registry remain unselected);
07-execution-guide.md §Operator resume phrases (the three separate answers:
legal transition, dependency eligibility, recommendation) and §Discipline
(forward-only enforcement; never back-fill history);
`docs/planning/work-order-map.md` §Status boundaries and §Catalog;
`docs/planning/concurrent-work-orders-plan.md` §Lane rules (rule 1: every
`Depends on` token is control-closed);
`docs/planning/work-order-index-activation-2026-09-04.md`;
`docs/planning/critical-path-2026-09-08.md` §Dependency graph and the JSON
graph beside it; `scripts/work-orders.mjs` (`parseHeader`, the
`dependency-ready` / `blocked on` derivation, the rendered `References` line
and the Sources and limits text); `scripts/resume.mjs` (`activate`, the
legal-action tables); `scripts/lib/release-records.mjs` (local annotated
release tags); `scripts/test-work-orders.sh`, `scripts/test-work-orders.mjs`,
`scripts/test-resume.sh`.

**Objective:** Make "may this order begin" a question the machine answers
from typed declarations rather than from every `WO-NNN` token in a paragraph.
An open work order declares each dependency with a relation and a reason;
only an unmet `hard` dependency or a `planning-deferral` blocks activation;
citations, historical evidence, satisfied releases, waivers and supersessions
never do; the generated index and `status --json` render the same projection;
and orders without a typed block keep today's conservative token view,
labeled as such and never as a blocker.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `parseHeader` tokenizes every `WO-NNN` in the `Depends on` paragraph and
  the index marks an order `blocked on` any token that is not control-closed
  (`scripts/work-orders.mjs:75-88, 237-245`). WO-001 and WO-002 are
  time-indexed and never close, so the closed WO-039, WO-004 and WO-027 rows
  read "blocked on WO-001" (`docs/work-orders/README.md`), and the closed
  WO-017 reads "blocked on WO-105" because its paragraph cites a corpus order
  as an oracle.
- `scripts/resume.mjs` reads no dependency at all: `activate` is gated by
  the lifecycle phase tables and argument shape only. The index's word
  "blocked" therefore blocks nothing, and the map says so ("a conservative
  token view ... need human interpretation"). Activation is human preflight
  with no machine-checkable dependency input.
- The 2026-09-08 planning pass records typed relations for every open order
  and the critical-path candidates in a JSON graph, but no file in the
  repository consumes it; the new WO-042 already references two closed orders
  whose only machine reading is the token view.
- The lane rule "every `Depends on` token is control-closed" and the roadmap's
  "Eligible now" answer both presuppose a typed hard-dependency set that does
  not exist.

**Design (scope discipline):**

- **The typed block.** An open work order may carry, in its leading metadata
  region after a blank line, a block delimited by
  `<!-- dotln-dependencies:start -->` and `<!-- dotln-dependencies:end -->`
  holding one JSON array. Each entry is
  `{ "workOrderId": "WO-NNN", "relation": <relation>, "reason": <one line> }`
  plus the relation's fields: `hard` (blocks until the order is
  control-closed with a passing final-review verdict; a closed order whose
  verdict is failed or absent still blocks); `satisfied-by-release` with `release: "vX.Y.Z"` (met when
  that local annotated release tag is in `HEAD`'s ancestry, otherwise
  blocking); `satisfied-by-close` (met when control-closed with a passing
  final-review verdict, otherwise blocking); `historical-evidence` and `reference-only` (never block);
  `waived` with `date` (never blocks; the reason is the review record);
  `superseded` with `by: "WO-NNN"` (never blocks); and `planning-deferral`
  with `until` naming a work order or a candidate label and `date` (blocks
  while the named order is not control-closed or while a candidate label is
  named; a dated `waived` entry replaces it). A `hard` or `satisfied-by-*`
  entry naming a historical id (WO-001, WO-002), a self-reference, a duplicate
  id, an unknown relation, or a missing reason refuses the index with the
  path. The `Depends on` prose paragraph stays for readers; the block is the
  machine reading.
- **One projection.** `scripts/lib/dependencies.mjs` exports the parser and a
  `projectDependencies(order, closedSet, releases)` that returns
  `{ source: "typed" | "conservative-tokens", entries, blocking }`.
  `work-orders.mjs` renders it in each row (typed entries with their
  relation and state; a token-view row labeled "conservative token view;
  does not block"); a closed or historical order's row never uses the word
  "blocked". `resume.mjs` adds `dependencies` to `status --json` for the
  selected order through the same function, and `activate` refuses when
  `blocking` is non-empty, appending nothing and naming the entry and the
  corrective action (close the named order, or change the relation in the
  authority file with a dated note, which is a reviewed edit).
- **Forward-only migration.** Every open order (the 2026-09-08 horizon as
  filed, WO-042 through WO-117 with their number gaps, plus WO-014, WO-036,
  WO-102, WO-103, WO-105 and WO-107) receives a typed block transcribing the
  meaning of its `Depends on` paragraph and the 2026-09-08 graph (for
  example WO-052 carries `hard` on WO-049, WO-050 and WO-051; WO-084
  carries a `planning-deferral` naming WO-053; WO-042 carries only satisfied
  entries); the five umbrella records (WO-033, WO-034, WO-035, WO-037,
  WO-040) receive `superseded` entries naming their children and nothing
  that blocks. Closed and historical orders are not edited; their rows
  carry the labeled token view.
- **Declined alternatives, recorded:** a separate registry file (the roadmap
  keeps it unselected; the authority file remains the single source);
  waivers or supersessions as control-log events (the lifecycle log is
  phase-only and its schema is a non-goal; a dependency decision is reviewed
  text in the authority, as the plan-deferral marker already is); a scheduler
  or recommendation engine (the map recommends, the operator selects);
  refusing activation on the conservative token view (that would turn every
  historical citation into a blocker, the defect this order removes).

**Deliverables:** `scripts/lib/dependencies.mjs` with its parser and
projection; the index and status changes; the activation refusal; the
migration of every open order; fixtures in the work-order and resume suites;
the write-backs below.

**Acceptance criteria (all required)**

1. The parser accepts a fixture block with one entry per relation and refuses,
   with the path and the offending entry, fixtures containing an unknown
   relation, a missing reason, a duplicate id, a self-reference, a `hard`
   entry naming WO-001, and a malformed JSON array.
2. The projection is deterministic over fixtures: `hard` on an open order
   blocks, and on an order closed without a passing verdict still blocks;
   `satisfied-by-close` on an order closed with a passing verdict is met; `satisfied-by-release`
   is met when the named annotated tag is in the fixture repository's `HEAD`
   ancestry and blocking when it is not; `historical-evidence`,
   `reference-only`, `waived` and `superseded` never block;
   `planning-deferral` blocks while its `until` names an open order or a
   candidate label and stops blocking when a dated `waived` entry replaces it.
3. The generated index renders the typed projection for every open order with
   the relation and state of each entry, renders the labeled conservative
   token view for orders without a block, and uses the word "blocked" for no
   closed or historical order; `index --check` refuses a stale render.
4. `status --json` carries `dependencies` for the selected order from the same
   function; `resume activate` refuses an order with a non-empty `blocking`
   set, appends no event, names the entry and the corrective action, and
   activates an order whose entries are all met or non-blocking; both are
   fixture-proven in the resume suite, and every existing status consumer
   (`worktree.mjs`, `release.mjs`, the console's text sources) still parses
   the output.
5. Every open order carries a typed block whose entries match its `Depends
   on` prose and the 2026-09-08 graph's edges for that order, recorded as a
   comparison in the evidence receipt; WO-052 projects `hard` on WO-049,
   WO-050 and WO-051; the umbrella records project `superseded` and no
   blocking entry; WO-042 projects no blocking entry.
6. Write-backs land: 06 §Work-order navigation and identity (the typed
   projection; which part of "Eligible now" is now computed); 07 §Operator
   resume phrases (the status field and the activation refusal); the planning
   map's §Status boundaries and the catalog's activation-preflight column
   (dependency state is the index's, not the map's); `docs/PLAYBOOK.md` step
   1; `docs/work-orders/README.md` Sources and limits (generated); ledger
   entry; publication index rows and both edition locks.
7. `npm test` green; `git diff --check` clean; no new dependency; no change
   under `packages/`; no control event appended by any fixture outside its
   temporary root.

**Evidence gate:** the fixture transcripts for criteria 1 through 4; the
migration comparison for criterion 5; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** a scheduler, lane generator or automatic recommendation; a
registry or front-matter migration; editing closed or historical orders;
workstream grouping (WO-034); new control events; changing lifecycle legality
beyond the one activation refusal; the console's rendering of dependency
state.

**Operator-review assumptions**

1. The activation refusal is acceptable as the first dependency-based
   lifecycle check; it names its corrective action and the operator can
   always change the authority file.
2. Waivers and planning deferrals are reviewed text in the authority file,
   not control events.
3. The 2026-09-08 graph seeds the migration; later planning passes maintain
   both the blocks and the graph, and the index is the projection readers
   trust.
