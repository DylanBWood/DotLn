# WO-026 — Work-order index: open and closed orders as a generated view over control evidence; files never move (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: patch, or the honest no-release path. Planning tooling; no exported
runtime capability.
**Nomination provenance:** the operator's 2026-09-02 planning session ("it also
might make sense to separate open and closed work orders, though that would
include a lot of updating other docs as they are likely referenced a lot"),
discharging the ledger's 2026-09-01 navigation entry ("pilot the view manually,
then decide from use whether standardized work-order metadata and a generated
DAG/index deserve a bounded work order"). The manual map has now been used
across the WO-006/WO-015 and WO-007 closes and two planning batches, and its
hand-written evidence cells went stale at each close. Planner-synthesized
draft; the operator's message is preserved locally as a compaction-safety
capture in ignored intake
(`docs/intake/notes/WO-024-WO-026-release-surfaces-planning-2026-09-02.md`).
Opaque identifier, not a priority. The clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** WO-018 merged — the shared `scripts/lib/` helpers,
`status --json`, and the exported fold vocabulary; this order must not add
another parser of `resume.jsonl` or another work-order authority check on the
eve of their consolidation. WO-019 merged is recommended (declared Effort lines
become index columns). WO-024 merged is recommended (`release list`'s
tag-to-work-order derivation is reused, not duplicated).

**Cites (read these sections):** 06-roadmap.md §Work-order navigation and
identity (candidate) — the three answers and the provisional row;
`docs/planning/work-order-map.md` §Status boundaries and §Pilot questions;
docs/lineage/idea-ledger.md "Work-order IDs name work; evidence and policy
explain what can run next" (§WO-006 work-order navigation ideation);
`docs/work-orders/codex-downtime-series.md` §Identity migration note;
07-execution-guide.md §Discipline (verification artifacts are immutable;
forward-only enforcement); `scripts/resume.mjs` (`fold`, `render`);
`scripts/release.mjs` (`workOrderAuthority`, `manifestFromTag`);
03-architecture.md §Session lifecycle & resilience (resume control v1).

**Objective:** Answer "which work orders are open, which are closed, and what
closed them" from evidence, in a generated index that `npm test` proves fresh,
without moving, renaming, or renumbering a single work-order file.

**Why the index is generated and the files stay put (recorded so the file-move
variant is not relitigated cheaply):**

- Work-order paths are addresses in immutable and append-only records: 106
  references outside `docs/work-orders/` at `v0.3.0`, among them every
  verification and final-review report, the control log's `workOrderPath` on
  eight `WorkOrderActivated` events, the `workOrder.path` field in four
  annotated tag manifests, and fixtures in four shell suites. The immutable
  ones cannot follow a move; the rest would need a migration commit at every
  close.
- `release close` opens the closed work order at the path the control log
  recorded; a move before close breaks the close, and a move after breaks the
  tag's manifest. All three lifecycle scripts require the authority file
  directly under `docs/work-orders/`.
- Open versus closed is not binary. The fold knows `none`, `active`,
  `ready-to-verify`, `verifying`, `needs-fix`, `repairing`, `final-review`, and
  `closed`; release close adds released, no-release, and unreleased-closed;
  drafts add dependency-ready, needs-preflight, and blocked. A directory holds
  one bit; an index holds the row.
- The identifier is already opaque and stable by decision; a `closed/` prefix
  would reintroduce location as meaning.

**Design (scope discipline):**

- `scripts/work-orders.mjs` (package script `work-orders`) with `index` (writes
  `docs/work-orders/README.md`) and `index --check` (regenerates to memory,
  diffs, exits non-zero naming the first differing line). Deterministic:
  locale-independent code-unit sort by id; two runs byte-identical.
- Sources, each with its epistemic label in the output: (a) every
  `docs/work-orders/WO-*.md` header — the H1 title, its sole strict version or
  `unassigned`/`malformed`, `**Model:**`, `**Effort:**`, and the `WO-NNN`
  tokens of `**Depends on:**`; (b) a per-work-order reduction over
  `docs/control/resume.jsonl` that shares WO-018's transition table (latest
  phase, latest `VER-NNN` and `FINAL-NNN` with verdicts; an unknown event type
  refuses with its ordinal, consistent with WO-018 criterion 4); (c) annotated
  release tags' manifests: a work order is released in the earliest tag whose
  manifest names it as `workOrder.id` or whose `changedFiles` contains a
  `docs/final-reviews/<id>/` path; `v0.2.0` (hand-closed, no tag manifest) is a
  recorded exception resolved from `docs/releases/v0.2.0.md`; a closed order
  matched by no tag renders `unreleased` unless its H1 version was strictly
  below the latest published tag at its close, which renders
  `no-release close`. Tags are read locally; the index states the local tag
  set it was generated from and never fetches.
- Sections: **Active** (zero or one row); **Open** (drafts and the
  not-yet-closed, with computed `dependency-ready` or `blocked on WO-NNN` from
  the closed set; preflight stays human); **Closed** (with release
  disposition); **Historical** (orders that predate the control log — WO-001
  and WO-002 — labeled time-indexed, never inferred as complete from the
  absence of events). Columns: id, title, version, phase, latest verification
  and final review with verdicts, release disposition, model, effort, hard
  dependencies with satisfaction, path.
- The human map keeps only what cannot be computed — recommendation,
  rationale, preflight facts, tracks — and links the index for evidence state;
  the catalog's computable columns are removed with a dated note.
  Recommendation stays a human answer, per the roadmap's three-answer rule.
- Refresh is the executor's duty at `implementation-ready` and the reviewer's
  at final review; no lifecycle transition regenerates it, so the control plane
  stays lean; `npm test` fails when it is stale (after WO-018 criterion 6 the
  chain already runs `check-publication.mjs` against the real repository; add
  `index --check` beside it).
- No metadata schema is pinned: headers are parsed as they are; a missing or
  unparseable header renders `unknown` with the path, never a guess.
  Standardized front matter stays a candidate.

**Deliverables:** the script and package mapping; `docs/work-orders/README.md`
generated and committed; a test suite in the `test` chain with fixtures; the
reduced map; the write-backs below.

**Acceptance criteria (all required)**

1. No file under `docs/work-orders/` is moved, renamed, deleted, or edited by
   this order; `git diff --name-status` against the base shows only the added
   README there; every pre-existing `docs/work-orders/WO-*` reference in the
   repository still resolves (script-checked in the result).
2. The index lists every `WO-*.md` exactly once, in exactly one section, with
   every column; `index --check` passes on the committed tree; deleting one
   committed row or editing one cell makes it fail naming the line; two
   generations are byte-identical.
3. Derivations, in a fixture with a synthetic control log and simulated tags:
   a work order released as `workOrder.id`; a second released via
   `changedFiles`; a closed no-release order; a closed unreleased order; an
   active order; a draft blocked on an unclosed dependency; a draft that is
   dependency-ready; a header with two versions rendering `malformed`; a header
   with no `Depends on` rendering `unknown`.
4. Against the real repository at activation: WO-003 through WO-007, WO-012,
   WO-015, and WO-101 render closed with the release each landed in (`v0.2.0`;
   `v0.2.1` for WO-004 and WO-012; `v0.2.2` for WO-005 and WO-101; `v0.2.3` for
   WO-006 and WO-015; `v0.3.0` for WO-007), WO-001 and WO-002 render
   historical, and every other order renders open with a computed dependency
   status that matches the map's hand-written cell or is a documented
   correction of it.
5. A grep proves no duplicate `runGit`, `containedRegularFile`, `readJsonFile`,
   or event-type switch outside `scripts/lib/`; an unknown event type in a
   fixture log refuses with its ordinal.
6. `npm test` includes `index --check` and stays green; the suite's fixture
   root follows WO-013's temp-root guard; `git diff --check` clean; no new
   dependency; no `.claude/` change.

**Evidence gate:** fixture transcripts; the real-repository index diffed
against the map's cells with each discrepancy explained; `npm test`;
`git diff --check`; the reference-resolution script output.

**Write-back duty:** `docs/README.md` map line for `docs/work-orders/`;
06-roadmap.md §Work-order navigation and identity (from candidate to: the
generated index is the evidence-state answer; recommendation stays human);
`docs/PLAYBOOK.md` step 1 and 07-execution-guide.md §Operator resume phrases
(consult the index for evidence state, the map for recommendation);
`docs/work-orders/codex-downtime-series.md` pointer; ledger entry (adopted:
work-order files are immutable addresses and open/closed is a generated view;
superseded: the hand-maintained evidence columns of the pilot map).
Product-doc edits stale the publication locks; refresh them and append the
staleness recapture as WO-007 did.

**Non-goals:** moving or renumbering files; a scheduler, priority engine, or
automatic recommendation; standardized front matter (candidate); beacons
(WO-020 and WO-021 project episode state, not the backlog); changing any
lifecycle transition; editing historical evidence or the control log; fetching
from origin.
