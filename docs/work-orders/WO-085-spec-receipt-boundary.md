# WO-085 — Spec/receipt boundary: dated receipts leave product documents and the map for their evidence READMEs, version banners become pointers, and a docs check refuses new receipts, banners, broken links and anchors (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation moves and one check.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-035's spec/receipt item, cut into a bounded
child at the operator's 2026-09-08 correction; the audit's five-surface
separation (WO-113 covers the work-order files). Planner-synthesized draft.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** none open (a dated planning deferral until WO-053 closes or
the operator waives it; reads document roots through WO-069 when it has
landed).
**Recommended placement:** any free lane under the deferral; it edits
products 02, 03, 04 and 06, the map's recommendation section, the evidence
READMEs, and adds `scripts/docs-check.mjs`. A recommendation, not a
dependency token.

**Cites (read these sections):** `docs/work-orders/WO-035-documentation-structure-reset.md`
(the counts: seven bold dated paragraphs and ten parentheticals in 06, nine
dated lines in 03, one in 02, seven receipt paragraphs in the map);
07-execution-guide.md §Documentation freshness and ownership;
08-publication-compiler.md §Freshness and ownership.

**Objective:** Move each dated receipt paragraph in 02, 03 and 06 and each
receipt paragraph in the map's recommendation section verbatim to the
owning order's `docs/evidence/WO-NNN/README.md` with a one-line dated
pointer; replace the version banners in 03 and 04 with a pointer to the
README block and the index; add `scripts/docs-check.mjs` refusing a new
dated receipt paragraph under `docs/product/` or in the map's
recommendation section, a version banner, and any broken relative link or
anchor; run it in `npm test`.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Specifications accrete receipts; banners nothing checks name stale
  versions; links are healthy but unchecked.

**Design (scope discipline):**

- Verbatim moves with pointers; the guide's freshness section names the
  evidence README as the receipt's home.
- **Declined alternatives, recorded:** deleting any receipt.

**Deliverables:** the moves, the banners, the check, the write-backs below.

**Acceptance criteria (all required)**

1. `docs-check` refuses a fixture product document with a dated receipt
   paragraph and a version banner, refuses a broken link and anchor, and
   passes on the reset repository.
2. Every moved receipt is byte-identical in its evidence README with a
   pointer left behind; publication locks refreshed.
3. Write-backs land: 07 §Documentation freshness and ownership, the map's
   provenance relocation, ledger entry.
4. `npm test` green with the check; `git diff --check` clean; no new
   dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** work-order files (WO-113); the roadmap's retiming layers
(WO-086).

**Operator-review assumptions**

1. Receipts belong beside evidence; the pointer preserves discoverability.
