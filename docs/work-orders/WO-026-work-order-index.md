# WO-026 — Work-order index: open and closed orders as a generated view over control evidence; files never move, v0.5.2

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch, v0.5.2 above locally present published
v0.5.1 (`68b1ab2`), completed on 2026-09-04 under the operator's release-assignment
default after activation omitted the target. Planning tooling and candidate
product documentation; no exported runtime capability. This fills an unassigned
target, not a retiming or publication authorization.
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

1. No file under `docs/work-orders/` is moved, renamed, or deleted by this
   order. Apart from this authority's activation-target completion and the
   operator-authorized breakout/implementation receipts and dated amendments below, existing files
   retain their bytes; the only added file there is the generated README.
   Every pre-existing `docs/work-orders/WO-*` reference in the repository still
   resolves (script-checked in the result). This bounded exception was recorded
   on 2026-09-04 because the operator opened ideation requiring a scope receipt
   and the standing activation default requires the missing release target.
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

## Operator-authorized ideation breakout receipt — 2026-09-04

**Authority and return:** During `resume: next`, the operator requested an
end-user application/workflow exploration: everyday use on an available host,
gradual replacement of a successful but costly existing workflow, and durable
workstreams across repositories. The operator expressly authorized the full
intake pipeline, return to this implementation, and a stop at readiness for
independent verification. This expands the documentation subject, not the
index's runtime or lifecycle scope.

**Intake and source treatment:** Main's canonical ignored capture is
`docs/intake/notes/WO-026-end-user-workflows-2026-09-04.md`. The worktree staging
copy, canonical file, and entry in the validated mode-0600
`DotLn-intake-20260904T224818Z.zip` local snapshot were compared byte for byte;
staging was removed only afterward. The snapshot is temporary local recovery,
not external durability. No canonical reconciliation remains pending.
Ordinary Shape-First Synthesis rewrote the intent; this was not a public draft
for direct filing. The private early-use label was withheld from committed
surfaces. No predecessor implementation, employer code/configuration, internal
service detail, or credential was requested or incorporated. Host constraints
remain generic and unobserved; the worked example is synthetic.

**Promoted surfaces:** `docs/product/12-workstream-application.md` records the
candidate desk-to-delivery journey, incremental parity checks, cross-repository
coordination, current capability limits, and open choices. Vision and interfaces
link that candidate. The idea-ledger section “WO-026 ideation — an end-user
workstream application” records the three adopted product directions and the
preserved pilot choices. The documentation map and publication coverage/locks
include the new blueprint document. No ADR, schema, dependency, application
identity, deployment, UI host, command, or implementation order was introduced.

**Required review:** The verifier and final reviewer must include these
documents and this receipt in their subject. Check source fidelity without
publishing the private label, synthetic-example treatment, consistency with
ADR-0006 and the settled core/vertical boundary, candidate versus implemented
claims, source/repository authority boundaries, partial-delivery honesty,
publication coverage/locks, and cross-references. No executable helper was
created for this ideation; capture/reconciliation used direct file operations
and the existing tested backup utility. The index implementation remains
subject to its own executable evidence gate below.

**Bounded file-freeze exception:** The receipt and missing activation target
require editing this authority, as now stated in criterion 1. The requested
`codex-downtime-series.md` pointer write-back conflicts with the remaining file
freeze: preserve that file and give its existing map link the generated-index
pointer instead. No work-order path changes.

## Operator-authorized tag-snapshot amendment — 2026-09-04

The executor identified a reproducibility conflict in the original freshness
rule: creating the next annotated release tag changes the full local tag set
after the reviewed source is committed, so that source would immediately fail
`npm test` and the equal-tag release-close retry. The operator selected the
recommended recorded-snapshot solution during this execution.

`index` observes current local annotated release tags and records their names
and immutable tag-object IDs in the generated README. `index --check` reads
current headers and control evidence against that recorded snapshot, requires
every recorded local tag to exist with the same object, and regenerates to
memory for the byte/first-differing-line check. Additional local release tags
are reported as newer evidence without failing the snapshot check. Explicit
`index` refresh includes them. No fetch, lifecycle regeneration, Git mutation,
or silent tag substitution is added.

This supersedes only the original requirement that every check implicitly
refresh the tag set. Fixtures must prove a newly created release tag leaves the
recorded check green with a newer-evidence notice, explicit refresh incorporates
it, and missing or changed required tag objects refuse. Control changes still
stale the index: refresh after the readiness/result transition as well as before
its evidence gate; reviewers/verifiers refresh after their dispatch transition.
The immutable transition checkpoint therefore predates the final projection
refresh. The next role checks that projection before running its evidence gate.

## Implementation evidence receipt — 2026-09-04

**Executor attestation:** Codex CLI `0.153.2`; model `gpt-6-astra`; effort
`max`; source `operator-attested`. The installed CLI version was observed;
the repository's dated operator assignment supplies model/effort selection,
not effective-session readback. The executor floor is xhigh+.

**Delivered:** `scripts/work-orders.mjs` and its package mapping; the generated
36-row README; shared control parsing/folding in `scripts/lib/control.mjs`
with the existing `resume.mjs` exports preserved; shared local tag, manifest,
version, and attribution helpers in `scripts/lib/release-records.mjs`; guarded
shell/Node fixtures; the reduced human map; blueprint/playbook/ledger write-back;
and the separately authorized end-user workflow candidate. No dependency,
component `src/`, `.claude/`, control-log schema, or lifecycle legality changed.

**Executable evidence run successfully:**

- `npm ci`: installed the existing lockfile; no dependency or lockfile change.
- `npm test`: exit 0 on the final code, including all existing shell suites,
  the new index fixtures, real-repository publication/index checks, 173 package
  tests, and 8 corpus tests; zero failures.
- [Fixture transcript](../planning/work-order-index-fixtures-2026-09-04.txt):
  eleven scenario groups cover the required derived states, complete/sorted
  rows, deterministic bytes, edited/deleted rows with first-line diagnostics,
  read-only checks, tag-snapshot refresh/refusal, later-tag time, malformed and
  missing metadata, historical attribution, Markdown escaping, and path guards.
- [Activation comparison](../planning/work-order-index-activation-2026-09-04.md):
  all 36 orders compared with the base map; the eight originally named closure
  mappings agree. Later closures and prose-token discrepancies are explained.
- [Reference audit](../planning/work-order-index-references-2026-09-04.txt):
  242 concrete pre-existing references resolve to all 36 retained authority
  paths; 35 other authorities and the runbook retain exact base bytes.
- `rg` found exactly one definition each of `runGit`, `containedRegularFile`,
  and `readJsonFile`, and one event-type switch, all inside `scripts/lib/`.
- Publication coverage is 183/183 headings; both current-byte edition locks
  pass. The staleness demonstration appends the ideation and index recaptures.
- The read-only release-surface check passed: source/target `v0.5.2` above
  published `v0.5.1`; all component sources unchanged, so no component bump.
  Its sandbox-blocked origin tag lookup was rerun with one-invocation approval;
  the index itself never contacts origin.
- `git diff --check` passed. The changed/added public surfaces contain no
  private early-use label or credential-pattern match.

**Deviations and limits:** The operator selected the recorded-tag amendment
above. This authority is the bounded existing-file exception for the omitted
activation target, explicit scope receipt, amendments, and evidence. The
runbook's existing map link supplies the indirect index pointer. One historical
dangling reference already existed in `WO-003/VER-001.md`; it remains disclosed
in the audit, not rewritten or represented as newly resolved. Dependency tokens
are not a semantic prerequisite parser. Historical no-release timing uses a
clearly labeled first-committed-prefix observation when `recordedAt` is absent;
it does not recover append time or prove remote publication time. The new
application journey remains a candidate with pilot, deployment, and parity
threshold choices open.

**Self-referential instrument:** Readiness is recorded through `resume.mjs`,
whose shared fold was extracted in this deliverable. The unchanged lifecycle
behavior was independently exercised by the existing resume, checkpoint,
worktree, and release fixture suites, and the new index fixtures test its
per-order projection. The next independent verifier must inspect those helpers
as subject code, not treat a successful readiness event as their proof.

**Handoff:** Stop at `ready-to-verify`; do not allocate or write a VER report in
this executor session. After `resume: verify`, refresh the index before the
verification gate, include the ideation receipt and candidate docs in review,
and retain the immutable prior evidence. No work-order branch commit, push,
PR, merge, tag, Release, or deployment is part of this executor handoff.
