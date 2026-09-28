# WO-078 — Sibling registry and export receipts: core tracks the starter and the Angular consumer as siblings with their kit version and build hash, and every export appends a receipt (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation convention plus one check.
Assigned at activation under the standing opt-out default.
**Cost:** adds one receipt written inside the export and update commands
(`scripts/launchpad.mjs`; bytes on disk, no step, command or prompt), a
generator for `docs/siblings/README.md` with a check in the manner of the
work-order index and its suite row in `scripts/test-runner.mjs`, the
once-per-sibling declaration, a document root key for `docs/siblings/` in
`scripts/lib/config.mjs`, and at most 150 bytes in product 07; the fixture
records the generator's wall-clock and the table's bytes. Removes the
manual lookup of each sibling's kit manifest version and build hash in its
own checkout before every update, planning pass or receipt that names the
sibling, one checkout read per sibling per occasion, and the risk that the
recorded version is memory: the removal receipt 009's hold asked for. No
recurring bookkeeping is added: the once-per-sibling declaration is written
at registration, not per export. Re-mints: none; the generator, its check,
`scripts/launchpad.mjs` and the documents are in no evidence inventory, and
`scripts/lib/config.mjs` is excluded from every inventory with a recorded
reason. If the generator gains a `package.json` script, each edition whose
check that entry stales is re-minted deterministically, a feedback edition
by carry; no live episode. Wall-clock, tokens and context bytes are unknown
until run.
**Nomination provenance:** WO-033's "sibling registry in core" item, cut
into a bounded child at the operator's 2026-09-08 correction. Planner-
synthesized draft. Opaque identifier, not a priority. Clean-room screen:
the siblings are the operator's public repositories. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: it depends on the orders that supply the receipt's fields,
names the document root the registry needs and the gate its check runs
under, and declares the Angular consumer's entry and where a receipt is
committed ([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-074 merged (the first export receipt); WO-075 merged (the
build hash a receipt records); WO-077 merged (`--update`, which writes a
receipt); WO-167 merged (product 07 holds 9 bytes of headroom until the fold
resets its ceiling).
**Recommended placement:** in the serial run after WO-077 and before
WO-118. This order edits `scripts/launchpad.mjs`, `scripts/lib/config.mjs`,
`scripts/test-runner.mjs`, `docs/README.md` and product 07, and adds the
generator with its check, `docs/siblings/` and `docs/evidence/siblings/`;
WO-083 writes the Angular consumer's entry after it. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "the first export receipt"
  },
  {
    "workOrderId": "WO-075",
    "relation": "hard",
    "reason": "the build hash a receipt records"
  },
  {
    "workOrderId": "WO-077",
    "relation": "hard",
    "reason": "--update, which writes a receipt"
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "product 07 has 9 bytes of headroom until the fold resets its ceiling"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary (the sibling-repository experiments);
`docs/planning/capability-table.md`; `scripts/work-orders.mjs` (the
generated index and its `--check`, a document suite in
`scripts/test-runner.mjs`); `scripts/lib/config.mjs` (`ROOT_SEGMENTS`) and
`scripts/test-configuration-root.mjs`; 07-execution-guide.md §Where the
control plane finds its documents (the root list);
`scripts/check-registrations.mjs` (JSONL under `docs/`);
`docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-009.md` (the
hold on criterion 1); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; `docs/work-orders/WO-033-compiled-starter-export.md`, as history only
(the Design bullet led "Sibling registry in core.").

**Objective:** `docs/siblings/README.md` is generated, never hand-maintained:
one entry per sibling (purpose and upstream relation, either an export of
core at a named commit or a consumer of a named contract version, from a
once-per-sibling declaration; the kit manifest version and build hash it
carries, the orders in core that advanced it and its capability rows from
the receipts and the kit manifests); every `launchpad export` and `--update`
writes its receipt under `docs/evidence/siblings/` (destination sibling id,
core commit, manifest hash, build hash, date) inside the command's existing
manifest step; the generator's check refuses a hand-edited entry or one
whose recorded manifest hash differs from the latest receipt.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No export, receipt, `docs/siblings/` or `docs/evidence/siblings/` exists;
  the export is WO-074's, `--update` WO-077's and the build hash WO-075's,
  all open.
- `docs/siblings/` has no root key, and `scripts/test-configuration-root.mjs`
  refuses a quoted `docs/` path in any script but `scripts/lib/config.mjs`;
  receipts under the configured evidence root need no new key.
- The work-order index's generator has a `--check` form, which the runner
  runs as a document suite under `npm run test:docs`, not under `npm test`.
- Refutation receipt 009 held criterion 1 on 2026-09-12 for recurring
  bookkeeping with no named removal; the Cost line names the removal.

**Design (scope discipline):**

- Forks of the starter are not tracked unless a fork's experience changes
  core, the starter or the Angular consumer; the lesson then enters through
  an ordinary planning pass.
- The registry lives under a new document root, declared in
  `scripts/lib/config.mjs` and listed in product 07; receipts go under the
  configured evidence root. A receipt written as JSONL is a classified
  protocol for `scripts/check-registrations.mjs`.
- The Angular consumer is a target, not an export destination: its entry
  holds its declaration (a consumer of a named contract version) and "not
  evidenced" in every field a receipt supplies until one exists.
- A receipt is written by the export or update command itself and enters
  `main` with the change in which the operator ran that command
  (operator-review assumption 2).
- The generator and its check read every receipt; one they cannot read or
  decode refuses, naming the receipt, and nothing is written.
- **Declined alternatives, recorded:** a registry of every fork.

**Deliverables:** the registry generator with its check, the receipt written
by the export and update commands, the once-per-sibling declaration, the
root key, the write-backs below.

**Acceptance criteria (all required)**

1. The registry is generated, never hand-maintained: `launchpad export` and
   `--update` write the receipt with the five fields inside their existing
   manifest step, with no DotLn command or hand edit beyond that command,
   and the generator rebuilds `docs/siblings/README.md` from the receipts,
   the kit manifests and the once-per-sibling declaration, with a check
   form in the manner of the work-order index; an export fixture proves the
   receipt and the regenerated entry; a hand-edited entry, one whose
   manifest hash disagrees with the latest receipt, and a receipt that does
   not decode are refused (the criterion is judged against that declared
   set; a case outside it is a follow-up, not a failure); the fixture
   records the generator's wall-clock and the table's bytes. The removed
   work is the manual lookup of a sibling's kit manifest version and build
   hash in its own checkout before every update, planning pass or receipt
   that names the sibling; the order's execution record names that lookup
   and its cost.
2. The registry carries the starter's entry and the Angular consumer's
   entry; every field no receipt supplies reads "not evidenced".
3. Write-backs land: `docs/README.md` §Map (the siblings root); 07 §Where
   the control plane finds its documents (the root's name), in place with
   no dated paragraph, at most 150 bytes added, against 9 bytes of headroom
   on 2026-09-28, which WO-167's fold resets first; WO-173, WO-172, WO-086,
   WO-123, WO-072, WO-073, WO-113, WO-080 and WO-077 also write product 07,
   so the executor re-measures the headroom at its base; where the bound
   does not fit, it consolidates the section it edits in the same change; a
   ceiling is raised only by a planning-document decision. The decisions
   file; the publication locks refreshed.
4. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`scripts/launchpad.mjs` is a declared source of configuration-root, and
again at final review. No live row.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** tracking external organizations' forks; a control event for
a receipt.

**Operator-review assumptions**

1. Sibling ids are public repository names.
2. A receipt written into core's evidence root enters `main` with the
   change in which the operator ran the export or update, so committing it
   is part of that change, not a separate bookkeeping step. If the operator
   counts that commit as bookkeeping, receipt 009's concern reopens.
