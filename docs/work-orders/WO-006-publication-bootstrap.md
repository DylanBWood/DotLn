# WO-006 — Publication bootstrap (two contents, one staleness loop), v0.0.4

**Model:** any capable model.
**Depends on:** nothing executable (doc-only; runs against the blueprint as
committed).

**Cites (read these sections):** 08-publication-compiler.md §Source model,
§Audience editions, §Outline first, §Authority and honesty rules, §Bootstrap
path (steps 1–4 are this order's exact scope); 07-execution-guide.md (doc-only
work lands on the working branch); 01-principles.md Principles 7 and 11.

**Objective:** Run steps 1–4 of the publication bootstrap path and nothing
past them: (1) a minimal audience/status index over the existing blueprint
sections; (2) the base DotLn outline, an implementation-overlay template, and
two sharply different tables of contents from the same sources — an everyday
AI-user book and a software-engineer book; (3) one shared concept rendered in
both voices with identical claim links; (4) a deliberate source-claim change
proving both editions become stale. The key test is traceability, not prose
quality.

**Scope discipline (one step at a time):**
- Headings and links are the claim graph — no `Claim` IR, no
  `PublicationPlan` type promotion (08 defers both until two editions prove
  the outline insufficient; an outline is allowed to be sufficient).
- Status labels come from 08's fixed vocabulary (vision / specified / planned
  / implemented / verified / blocked / deprecated) and must not blur.
- The staleness check uses the cheapest sufficient mechanism: a small script
  or a documented manual diff procedure — not a pipeline.
- Gitignored intake is never quoted or linked (clean-room rule; 08 §Source
  model).

**Deliverables:** `docs/publication/` (new directory): the audience/status
index, base outline, overlay template, the two tables of contents, and the
dual-voice sample; a map line in `docs/README.md`.

**Acceptance criteria (all required)**
1. Every section of docs/product/00–09 appears in the index with audience
   tags and a status label.
2. The two tables of contents differ sharply in sequence, vocabulary, and
   depth, cite only shared committed sources, and differ in no fact,
   limitation, permission, or evidence (08's audience rule).
3. The dual-voice sample explains one concept in both voices with identical
   claim links to blueprint headings.
4. The staleness loop is demonstrated: change one source claim, show both
   editions flag stale, revert; the demonstration is captured.
5. No content derives from `docs/intake/`.

**Evidence gate:** the captured staleness demonstration plus the index
coverage check (no untagged section), recorded in the result.

**Write-back duty:** the roadmap's v0.0.4 entry already points here; the
`docs/README.md` map line lands in the same change; ledger duty for any transformed publication idea.

**Non-goals:** manager / IT-director / VP-development / CFO editions (08
gates them on this loop working); rendering pipelines, sites, or printable
output; Claim IR; publishing any edition anywhere.
