# WO-080 — Workstream document, field and index grouping: a launchpad holds one document per outcome, member orders declare it, and the index groups members with repository, base, phase, verdict, integration state and staleness (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** patch. A document convention, one metadata
field and an index projection; no event type. Assigned at activation under
the standing opt-out default.
**Cost:** adds a workstream document convention and its template under the
configured `workstreams` root, one leading metadata field
(`**Workstream:** WS-NNN`), a grouping of member orders in the generated
index with repository, base, phase, verdict, integration state and a stale
mark, a record in the index of the target facts it read, fixtures, and at
most 350 bytes in product 12 and 200 in product 07. Removes nothing that
runs today: no workstream document, field or grouping exists. It unblocks
WO-081 and WO-082, which depend on it. Re-mints: none;
`scripts/work-orders.mjs`, its fixtures and the template are not
registered evidence sources (`scripts/lib/evidence-sources.mjs`); an edit
to `scripts/lib/git.mjs`, `scripts/lib/helpers.mjs` or
`scripts/lib/paths.mjs`, which every edition registers, would owe a
deterministic re-mint of each edition it stales. Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** WO-034's "workstream as a document plus
projections" item (index half), cut into a bounded child at the operator's
2026-09-08 correction. Amended by the 2026-09-28 planning pass, which
re-observed the order on `main` at `5f3849ec`: WO-071 has closed, product
07's headroom makes WO-167 a dependency, the staleness column states what
it shows for a target it cannot read and how the committed index stays
checkable, the write-backs are bounded, the final criterion names both
gates, and register row FUP-0126 (the workstream application, allocated to
WO-080 to WO-083) is carried here
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-072 merged (the id-to-clone mapping and the target
worktree lifecycle whose Git state this order's members report);
WO-167 merged (closed, v0.53.1); WO-071 merged (member orders name
registered repositories; closed, `v0.38.0`).
**Recommended placement:** in the serial run, directly after WO-113. This
order edits `scripts/work-orders.mjs`, its fixtures
(`scripts/test-work-orders.mjs`, `scripts/test-work-orders.sh`), the
generated index, a template under the configured `workstreams` root,
products 12 and 07 and the decisions file; WO-113, directly before it,
also edits `scripts/work-orders.mjs` and product 07, and the Design states
how the two meet in either order. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-072",
    "relation": "hard",
    "reason": "the id-to-clone mapping and target worktree lifecycle whose Git state the members report"
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "closed at v0.53.1; the fold this order's product 07 write-back followed"
  },
  {
    "workOrderId": "WO-071",
    "relation": "hard",
    "reason": "member orders name registered repositories"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 12-workstream-application.md §One
workstream across repositories; 02-domain-model.md §Memory and observation
(Workstream); 03-architecture.md §Ports (the source revision guard);
07-execution-guide.md §Where the control plane finds its documents (the
`**Repository:**` field); `scripts/work-orders.mjs` (`parseHeader`,
`readTagSnapshot`, the `--check` path); `scripts/lib/work-order-repository.mjs`;
`scripts/lib/config.mjs` (the `workstreams` root);
`scripts/test-configuration-root.mjs`;
`packages/console/src/text-sources.ts` (`parseWorkOrderIndex`);
`docs/work-orders/WO-113-work-order-files-stable-contracts.md` (the
allowed-section check); `docs/control/doc-ceilings.json`;
`docs/work-orders/WO-034-cross-repository-workstream-pilot.md` (history:
the umbrella's wording); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `docs/workstreams/WS-NNN-<slug>.md` carries the outcome,
acceptance contract, member orders (each naming repository and base), the
dependency and compatibility plan and delivery states; an order may declare
`**Workstream:** WS-NNN`; the index groups members and shows repository,
base, phase, verdict and integration state, and marks a member stale when
its declared base is no longer the target's integration base; no control
event or schema changes.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- "Workstream" is vocabulary only: no workstream document is tracked and
  `scripts/work-orders.mjs` has no workstream handling, so nothing groups
  orders into an outcome.
- The configuration loader already declares a `workstreams` document root
  (default `docs/workstreams`) that no control-plane surface uses yet, and
  `scripts/test-configuration-root.mjs` refuses a quoted `docs/...` literal
  in any control-plane script.
- The `**Repository:** <id> @ <base-commit>` field that member orders rely
  on shipped with WO-071 (`scripts/lib/work-order-repository.mjs`; product
  07 and product 12 describe it).
- `parseHeader` is a tolerant view that attributes an unknown header field
  instead of refusing it, and no check reads an order's sections; WO-113
  plans a positive check over them, with the allowed set documented in
  product 07.
- `index --check` regenerates release rows from the tag snapshot the index
  records (`readTagSnapshot`) and reports newer tags without refusing, so
  the committed index checks on any host; a target's integration base is
  host state of the same kind.
- Product 07 holds 188,390 bytes under a ceiling of 188,399 and product 12
  holds 17,997 under 18,357 (`docs/control/doc-ceilings.json`, at
  `5f3849ec`); the executor re-measures both at its base.

**Design (scope discipline):**

- Staleness follows the source-revision guard's shape as a projection.
- The generator resolves the `workstreams` root through
  `scripts/lib/config.mjs`; no literal document root enters a script.
- The grouping keeps every `### WO-NNN` row of the index whole, because the
  console parses those rows (`parseWorkOrderIndex`) in its document test.
- A member's integration base and containment are read from its target
  repository's Git state. A target the generating host cannot read shows
  `unknown` in each cell that needs it, never current or stale. The index
  records the target facts it read, and `index --check` regenerates the
  grouping from that record, as it regenerates release rows from the tag
  snapshot; a target whose state moved since is reported, not refused.
- The field needs no admission from WO-113 today, because `parseHeader`
  attributes an unknown field. If WO-113's allowed-section check is on
  `main` at this order's base, the field joins its allowed set and the 07
  sentence that lists it in this change; if it is not, WO-113 admits the
  field when it lands. Either order works.
- **Declined alternatives, recorded:** a `WorkstreamOpened` event (no
  consumer needs outcome-level legality yet); re-reading each target at
  `index --check` (a host without a target's checkout would refuse a
  correct index; reopen when targets are only registered on hosts that hold
  their checkouts); a typed dependency on WO-113 (the field needs no
  admission from it; reopen if WO-113 lands a metadata set a later order
  may not extend).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `scripts/lib/work-order-workstream.mjs` (new): `parseWorkstreamDeclaration(markdown, path)`
   modelled on `parseRepositoryDeclaration` (`dependencyHeader`;
   `^\*\*Workstream:\*\*\s+(WS-\d{3})\s*$`; refuse a duplicate or malformed field). Check:
   `npm test -- --only work-orders-fixtures` (the `shell("work-orders-fixtures", "scripts/test-work-orders.sh")` row).
2. `scripts/work-orders.mjs`: `parseHeader` (line 68) gains `workstream`; `readIndex` (line
   191) carries it per row. Target reads stay out of `readIndex` (called by
   `plan-receipts.mjs` and `planning-conditions.mjs`) and `parseHeader` (called by
   `plan-failures.mjs` and `plan-subject.mjs`).
3. Same file: `readTargetFacts(root, rows)`, called only by `main` without `--check`: the
   repository's `baseBranch` plus WO-072's clone map (`scripts/lib/target-worktrees.mjs`);
   `runGit(clone, [...], { raw: true })` for `rev-parse --verify refs/heads/<baseBranch>^{commit}`
   and `merge-base --is-ancestor <baseCommit> <tip>`; an unreadable target gives `unknown`.
   Decided 2026-10-07: target facts are never written into the committed index (they would
   churn across hosts); `status` and the console render them live from the local registry, and
   the committed `README.md` carries only the grouping.
4. Same file: `renderIndex({ ..., workstreams = [] })` emits `## Workstreams` before
   `## Active`: `### WS-NNN` and one list line per member, never a `### WO-NNN` heading
   (`parseWorkOrderIndex` would read a duplicate row and `projectBoard` refuses duplicate
   targets); the grouping as one JSON line beside the tag snapshot,
   `<!-- dotln-workstreams: {...} -->`, with members and `edges`, so WO-081 and WO-082 parse
   JSON and never the rendered Markdown (prose-parsing screen); `renderSources` "Header
   observation" names the field and record.
5. Same file, `--check`: the grouping only; no target state is judged or refused.
6. `docs/workstreams/README.md` (new; creates the directory): the convention plus a fenced
   template; the document carries a JSON block between `<!-- dotln-workstream:start -->` and
   `<!-- dotln-workstream:end -->`:
   `{ "id", "members": [{ "workOrderId", "repositoryId" }], "edges": [{ "from", "to", "relation" }] }`;
   membership stays sourced from `**Workstream:**` and the generator refuses a differing block.
   "Integration state" is the enum `current`, `behind` (the base is an ancestor of the tip),
   `diverged`, `unknown`; stale means not `current`. Resolve the root through
   `docPath(root, "workstreams")` (configuration-root refuses `docs/...` literals); the README
   escapes the `WS-NNN-*.md` glob. WO-074's kit workstream template is kept in step with this
   convention (the executor edits `scripts/kit/` if WO-074 has landed).
7. `scripts/test-work-orders.mjs`: `await check("WO-080 members group with repository, base,
   phase, verdict, integration state and staleness")` (`makeRepo`, `writeLog`, `commit`, a
   `dotln.config.json` with two repositories copying `authorityProfile` and
   `registeredRepository` from `scripts/test-configuration-root.mjs` lines 60 to 77, two
   target repositories, three members; each cell equals the header, the segment or
   `rev-parse`; no fixture path in the render) and `await check("WO-080 moved base stays stale
   beside a green sibling; unreadable target is unknown; --check passes with targets absent")`.
   Check: `npm test -- --only work-orders-fixtures`.
8. If WO-113's check is on `main` at the base, add `Workstream` to its allowed set.
9. `npm run work-orders -- index`; check `npm run work-orders -- index --check` (the `index`
   row).
10. Write-backs: product 12 §"## One workstream across repositories" (the convention, in
    place); product 07 §"### Where the control plane finds its documents" (the field, one
    sentence after the `**Repository:**` paragraph); `docs/evidence/WO-080/decisions.md`
    (new); `npm run meta`; `node scripts/check-publication.mjs --print-locks`;
    `npm run publication:check`.
11. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-080/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the convention and template, the field, the index
grouping with its record of target facts, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture launchpad with two registered repositories holds a workstream
   of three member orders, and the generated index shows them grouped
   under it. Each column equals the value the fixture sets in the member's
   header, its control segment or its target repository's Git history, and
   the render holds none of the fixture's physical paths (the launchpad
   root, the target checkouts and the worktree parent). The criterion is
   judged against the declared set; a case outside it is a follow-up, not a
   failure.
2. In the fixture, a member whose declared base differs from its target's
   integration base shows stale, and a green sibling leaves it stale; a
   member whose target cannot be read shows `unknown`; `index --check`
   passes on the committed fixture index with the targets' checkouts
   absent. The criterion is judged against the declared set; a case outside
   it is a follow-up, not a failure.
3. Write-backs land, each in place with no dated paragraph: 12 §One
   workstream across repositories (the document convention, in place with no dated paragraph (ceilings are planning's since the 2026-10-07 pass);
   WO-118, WO-082, WO-083, WO-193 and WO-194 also write 12); 07 §Where the
   control plane finds its documents (the field; WO-072, WO-073, WO-113,
   WO-077, WO-078, WO-188, WO-189, WO-190, WO-192 and WO-193 also write
   07), with the allowed set and its 07 sentence where WO-113's check is on
   `main` at the base. The decisions file; the publication locks refreshed.
4. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts; the regenerated index;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `scripts/work-orders.mjs` is a declared source of harness-fixtures
and process-debt, and again at final review. No live row.

**Write-back duty:** as listed in criterion 3.

**Known issues and carry-ins:**

- 2026-10-07 pass: stale and corrected above: WO-167, WO-061, WO-112,
  WO-173, WO-172, WO-086 and WO-123 are closed; the 12 and 07 figures;
  `scripts/work-orders.mjs` also selects `plan-refutation` and
  `configuration-root` under `--review`.
- Decided by the 2026-10-07 pass: WO-072 is a hard dependency (the
  mapping this order reads is WO-072's); target facts are rendered live
  and never committed; the workstream document and the index grouping
  are JSON blocks (prose-parsing screen); the integration enum. Reopen: a
  consumer needs target facts in the committed index.
- Blocked on WO-074 for the kit template path and WO-113 for the allowed
  set's name.

**Non-goals:** the board (WO-081); the pilot (WO-082); events; re-reading a
target repository at `index --check`.

**Operator-review assumptions**

1. A document plus projections is enough for the first pilot.
