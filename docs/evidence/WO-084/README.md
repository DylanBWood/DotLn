# WO-084 implementation evidence

Dispatch: `resume: next`, 2026-09-19. Actor: Codex CLI 0.155.0,
`gpt-6-astra`, effort `ultra` (xhigh plus workflows), from current-session
readback. The executor is the sole writer; one read-only agent audited ledger
formats and the finished migration without acting as lifecycle verifier.

## Delivered behavior

`node scripts/lineage.mjs index` generates [the lineage index](../../lineage/README.md).
`index --check` checks its current bytes and validates newest-first dates,
founding-corpus boundaries, entry lead tags and the declared status set.
Both the checker and its fixtures are document suites; neither enters the
product gate. No dependency or component source changes.

The [migration manifest](migration.json) lists all six tag normalizations.
[Preservation evidence](preservation.json) records the baseline and compares
all 142 original sections against 141 ledger sections plus Resolutions:
all entry prose and all 13 planning-pass IDs survive. The moved Resolutions
body is byte-identical apart from its trailing blank separator. Final blank
separators at EOF in the ledger and Resolutions are removed for the whitespace
check; section headings and internal whitespace are unchanged.
Stable same-date sorting retains prior relative order. Thirty-one misplaced
sessions now precede the founding corpus.

Counts independently checked from entry lead tags: adopted 533, preserved 319,
raw 16, superseded 4, transformed 63, rejected 26, deferred 1, candidate 7,
open 3 and specified 4. These are 976 tag memberships over 970 idea entries;
six entries have two lifecycle tags. The 38 Images references are not ideas.
Images and the prose-only WO-137 section appear explicitly under sections
lacking a lifecycle tag.

Live Resolutions pointers now name the new path in product 07, the planning
map and WO-109; the docs map and ledger header link the separate surface.
Historical measurements remain unchanged. [Decisions](decisions.md) and the
generated decisions index discharge the pre-2026-09-09 ledger-entry duty;
the migration note links that record without inventing a new history entry.

## Evidence at the pre-gate cutoff

Seven `node --test scripts/test-lineage.mjs` cases pass, including CLI
refusals for a stale index, unknown status, unlabeled entry and a section
below the boundary. Additional cases reject out-of-order/invalid dates,
duplicate tags, numbered unlabeled entries, orphan indented lists and tags
borrowed across a code fence. The read-only audit found the alternate-list
and fence-concatenation gaps; both now have passing regressions.

`npm run plan -- check` passes with 19 receipts and 10 enforced passes;
the independent migration comparison checks all 13 historical pass IDs.
Product-pointer and activation-note edits refresh their affected publication
source locks. `git diff --check` passes. The local release preparation confirms
patch target `v0.31.2` above `v0.31.1`; no component version changes.

`npm run test:docs` passed all 19 suites in 156.11 s (19 fresh tasks).
The lineage check took 0.13 s and its fixture suite 1.07 s in that run.
The runner-registration check exposed its hard-coded fixture-script inventory;
adding the two newly registered scripts repairs that fixture. This fixture-only
edit does not change any document-suite input. The required `npm test` and
repaired runner-registration check follow this cutoff. Their results belong to
`validation.txt`/the lifecycle handoff and ignored host gate records, not a
claim inferred from these targeted cases. Independent verification, final
review, publication and tags remain separate dispatches.
