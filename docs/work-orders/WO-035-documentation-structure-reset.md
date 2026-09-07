# WO-035 — Documentation structure reset: one ledger order, a spec/receipt boundary, generated release history, and a shorter cold start (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation structure, generators, and
checks; no exported runtime capability. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the 2026-09-06 planning pass, from the operator's
dispatch ("what will this repo look like in 6 months if it continues like
this? are we good with that?") and the read-only documentation sweep recorded
in `docs/planning/phase-two-plan-2026-09-06.md`. It applies the corpus
maintenance constraint in 03-architecture.md §Corpus policy, which asks for a
demonstrated reading or upkeep problem before intervention; the sweep supplies
the measurements. Planner-synthesized draft; the unedited dispatch is
preserved locally in
`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`. Opaque
identifier, not a priority. The clean-room screen found no stop condition.
**Depends on:** WO-033 merged (the configuration root names the document
roots this order moves and checks, and its export copies the conventions
this order sets).
**Recommended placement:** wave 2, beside WO-034, or third in serial
execution. WO-034 may run beside this order because this order must not edit
`scripts/work-orders.mjs` or `packages/console`, which WO-034 owns. A
recommendation, not a dependency token.

**Cites (read these sections):** 03-architecture.md §Corpus policy (the
maintenance constraint; archives preserve discoverability, provenance, stable
references, and replay dependencies); 07-execution-guide.md §Read order for a
cold start, §Documentation freshness and ownership, and §Discipline (time-
index the standard; forward-only enforcement; never back-fill history);
08-publication-compiler.md §Freshness and ownership and §Authority and honesty
rules; 06-roadmap.md §Release boundary (the tag is the record; the roadmap is
a plan) and §Candidate — bounded system baseline; 05-pattern-library.md
§Candidate — success under growth; 01-principles.md Principle 12 (the ledger
is append-only; superseding names what it supersedes); `CLAUDE.md` §Start
here (the cold-start read order and where settled questions live);
`docs/lineage/idea-ledger.md` header (lines 1–25: the declared ordering);
`docs/verifications/README.md` (the migration-note precedent);
`scripts/check-publication.mjs`, `scripts/release.mjs` (`list`, the README
release-block check), `scripts/resume.mjs` (the phrase table);
`docs/planning/phase-two-plan-2026-09-06.md` §Six-month projection and
§Documentation sweep.

**Redirect note (2026-09-06):** the shorter cold start this order targets
is measured by WO-039's method and is reached first by removal, not by
pruning: where WO-039 has lowered a role's procedure into a generated role
skill, the guide's copy of that procedure is removed rather than shortened,
and the line target counts only the always-on read. A session governed by a
shorter biography is still governed by a biography; this order shortens the
prose that remains after compilation, and nominates what it cannot remove
to the next migration batch.

**Objective:** Stop the four growth patterns the sweep measured before they
compound — a ledger that grows at both ends, specification documents that
accrete dated implementation receipts, release history maintained by hand in
three places, and a cold start that reads roughly 1,300 lines before the first
cited section — by moving each recurring fact to one generated or immutable
home, adding a check that keeps it there, and leaving immutable evidence,
stable work-order addresses, and settled decisions untouched.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`; measured by the
read-only sweep):**

- `docs/lineage/idea-ledger.md` declares newest-first insertion below its
  header and Resolutions at the bottom (lines 18–24). It has 103 sections: 95
  above `## Resolutions of known tensions` (line 4680) and seven appended
  below it by executor sessions on 2026-09-05 and 2026-09-06, while other
  same-day sections were prepended. The four newest top sections use a bold
  `**Adopted:**` lead instead of the backtick status tag. Of 283 `preserved`
  entries, 24 carry any forward pointer to a product document, decision, or
  work order.
- Dated implementation receipts live inside specifications: seven bold
  `**WO-NNN … (date):**` paragraphs plus ten dated parentheticals in
  06-roadmap.md, nine dated lines including three migration receipts in
  03-architecture.md, one in 02-domain-model.md, seven dated addenda in the
  capability table, and seven receipt paragraphs in the planning map's
  recommendation section. Three product documents carry version-bearing
  status banners that nothing checks: 03 says the source prepares `v0.11.0`
  and 04 says `v0.2.0` while `v0.13.1` is published; only the README block is
  checked. The capability table still shows transports and verification at
  level 0 after WO-009 and WO-010 shipped, with the change recorded in
  addenda rather than the rows, and has no WO-010 row.
- Release history is maintained by hand in three layers of 06-roadmap.md
  (the 2026-08-31 retiming table still names WO-009 at `v0.5.0`, WO-010 at
  `v0.6.0`, and WO-011 at `v0.7.0`), in 10-ir-compatibility.md, and in the
  map, while the annotated tags and the generated index are the record.
  Sixteen of the twenty-six published tags have no rung heading in the
  roadmap. The resume-phrase table exists in four copies; the README's copy
  omits `resume: times`.
- The mandatory cold start is `CLAUDE.md` (78 lines) plus the execution guide
  (804) plus the work order; for WO-011 the minimum with cited sections was
  about 1,340 lines and a realistic whole-file load about 3,900. The guide is
  seven times the work order; its resume-phrase and discipline sections alone
  are 375 lines, and its model-specific and Codex-sandbox paragraphs
  duplicate the harness runbook and playbook.
- Relative-link health is clean: 993 links and 422 anchors, zero broken. No
  link checker is needed yet; a cheap one belongs in the same check script so
  the next restructure cannot break it silently.

**Design (scope discipline):**

- **Ledger order and index.** Declare one insertion rule and enforce it.
  Recommended: keep newest-first below the header; move Resolutions to
  `docs/lineage/resolutions.md` as its own immutable-ish surface so nothing
  sits "at the bottom", and update `CLAUDE.md` §Start here to point there;
  relocate the seven trailing sections to their dated positions with a dated
  migration note in the ledger header (a relocation of whole sections is not
  a rewrite of any entry). Normalize the four bold-lead sections to the
  backtick tag convention without changing their prose. Add
  `scripts/lineage.mjs index` generating `docs/lineage/README.md` (section →
  line, counts by status, sections lacking a status tag) and `--check`, run
  by `npm test`, refusing any section below the declared boundary, any
  unlabeled top-level entry, and any status outside the declared set.
- **Spec/receipt boundary.** Dated implementation receipts leave product
  documents: each `**WO-NNN … (date):**` paragraph in 02, 03, and 06 and each
  receipt paragraph in the map's recommendation section moves verbatim to
  the owning order's `docs/evidence/WO-NNN/README.md` (created where absent)
  with a one-line dated pointer left in place; a `scripts/docs-check.mjs`
  check refuses new dated receipt paragraphs under `docs/product/` and in the
  map's recommendation section. Version-bearing banners in 03 and 04 are
  replaced by a one-line pointer to the README block and the generated index.
  The execution guide's §Documentation freshness and ownership names the
  evidence README as the receipt's home; the map's dated provenance section
  moves to a dated planning receipt file.
- **Generated release history.** Replace the roadmap's three retiming layers
  (§2026-08-31 forward retiming, §2026-09-04 forward retiming, and the dated
  activation-completion paragraphs) with one generated table from local
  annotated tags and work-order headers, produced by `release list --markdown`
  or an equivalent addition to the release helper (never by editing
  `work-orders.mjs`, which WO-034 owns), inserted between marker lines in
  06-roadmap.md and 10-ir-compatibility.md and checked like the README block.
  The retiming records themselves are preserved verbatim in a dated planning
  receipt so history is not rewritten; the roadmap keeps only rungs with exit
  criteria and links to that record.
- **Roadmap split.** Move the roadmap's candidate sections (lines 243–897:
  work-order navigation, whole-or-split, beacon checkpoint, unattended
  portfolio, budget windows, capability progression policies, efficiency,
  bounded system baseline, counterfactual profiling) into
  `docs/product/14-planning-policies.md` so 06 holds the ladder; every moved
  heading keeps its slug, and the publication index rows move with them.
- **One source for the phrase table.** `scripts/resume.mjs` emits the
  operator-phrase table between marker lines in the execution guide, the
  playbook, and the README; `docs/README.md`'s fourth copy becomes a pointer.
- **Capability table.** Fold the seven dated addenda into the rows they
  reassess using the existing `Last change` column, add the missing WO-010
  row, and keep the historical assessment text under a dated migration note;
  no level is promoted without the evidence the addenda already cite.
- **Shorter cold start.** Reduce 07-execution-guide.md to the executor's
  operating contract by moving §Model-specific notes and the Codex-approval
  paragraphs to `docs/AI-HARNESS-SECURITY.md` and the playbook with pointers,
  and by generating the phrase table; target under 450 lines without dropping
  a rule, with a table in the result showing where every moved paragraph
  went.
- **Declined alternatives, recorded:** per-session ledger files (changes a
  foundational address cited by every work order; reconsider when the ledger
  index proves insufficient); retiring the `11-proteino.md` pointer stub
  (immutable reports and WO-109 cite the old path in prose; keep it);
  deleting any verification, final-review, release, or decision bytes.

**Deliverables:** the ledger relocation and migration note, `resolutions.md`,
`scripts/lineage.mjs` with its index and check; `scripts/docs-check.mjs`
(receipt ban, banner ban, phrase-table sync, a relative-link and anchor
check); the evidence README moves; the release-history generator and marker
blocks; `14-planning-policies.md`; the capability-table fold; the trimmed
execution guide; publication index and edition locks; `npm test` wiring; the
write-backs below.

**Acceptance criteria (all required)**

1. `lineage index --check` passes on the reset ledger, refuses a section
   placed below the boundary, an unlabeled entry, and an unknown status in
   fixtures, and the generated `docs/lineage/README.md` counts equal a grep
   of the file; no entry's prose changes (diff shows only section moves, tag
   normalization, and the header note).
2. `docs-check` refuses a fixture product document containing a dated
   receipt paragraph and a version-bearing banner, refuses a broken relative
   link or anchor, and passes on the reset repository; every moved receipt is
   present verbatim in its evidence README with a pointer left behind.
3. The generated release table equals the local annotated tags joined to the
   orders they name (checked against `release list`), the roadmap and 10
   contain it between markers, and the marker check refuses a stale table;
   the preserved retiming records are byte-identical in their receipt file.
4. `14-planning-policies.md` holds the moved sections with unchanged slugs;
   `check-publication` passes with the index rows relocated and both edition
   locks refreshed; zero broken links.
5. The mandatory cold-start total per role, measured by WO-039's criterion 6
   method (every file the instruction file or the role skill directs the
   session to read before acting, derived mechanically), is lower after this
   order than before it for every role, and no paragraph relocated "with a
   pointer" is in any role's directed-read set unless it was already there;
   the execution guide is under 450 lines as a consequence, not as the
   measure; the relocation table in the result accounts for every removed
   paragraph and names, for each, whether it was retired because a generated
   skill or compiled unit carries it or relocated as reference; and the
   resume-phrase table is byte-identical in the guide, the playbook, and the
   README and generated from `resume.mjs`.
6. The capability table has one row per capability with the addenda folded
   and a dated migration note; the WO-010 row exists; no level exceeds what a
   cited passing final review supports.
7. No file under `docs/verifications/`, `docs/final-reviews/`,
   `docs/releases/`, `docs/decisions/`, or `docs/control/` changes; no
   work-order file moves or renames; `docs/work-orders/README.md` regenerates
   unchanged apart from the new order's own row.
8. Write-backs land: 07 (§Read order; §Documentation freshness names the
   receipt home; the trimmed sections' pointers), `CLAUDE.md` §Start here
   (Resolutions path), `docs/README.md` map, 03 §Corpus policy (a dated note
   that this reset applied the constraint and what it measured), the
   planning map's provenance section relocation, ledger entry.
9. `npm test` green with the new checks in the chain; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the check transcripts for criteria 1 through 6; a diff
summary proving criterion 7; `npm test`.

**Write-back duty:** as listed in criterion 8.

**Non-goals:** editing immutable evidence or decision bodies; renumbering or
moving work orders; per-session ledger files; a claim-level publication IR;
rewriting ledger entry prose; changing lifecycle scripts beyond the phrase
table emission and the release-history output; editing `work-orders.mjs` or
`packages/console`; a documentation site.

**Operator-review assumptions**

1. Relocating whole ledger sections to their dated positions, with a
   migration note, honors the append-only rule; entry text is never edited.
2. Receipts belong beside the order's evidence, not inside specifications;
   the one-line pointer preserves discoverability.
3. The roadmap becomes the ladder and its exit criteria; candidate policy
   text moves to a numbered product document rather than being deleted.
4. A cold start under 450 guide lines is worth the relocation churn once;
   every rule keeps a home.
