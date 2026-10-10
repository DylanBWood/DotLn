# WO-189 VER-004 evidence

Independent verification of the repaired subject dispatched by `resume: verify`.
Code identity: `8fdbf2796bd4fa15eff2542652428b83aab2cc10a31234bd6e6d2105192ad545`.
The recorded version is judged as staged. No implementation was edited.

| Claim | Evidence and result |
| --- | --- |
| Covering product gate | [gate-subject-result.json](gate-subject-result.json): passing review row at the same identity, all 32 selected suites, no missing suite; recorded 2026-10-10T21:39:40.776Z, duration 1,410.155 seconds. |
| Earlier bypasses | Original probe sources from verify-001, verify-002 and verify-003 rerun unchanged; [first](ver001-front-page-result.json), [second](ver002-boundary-result.json), [third](ver003-boundary-result.json) have no missed refusal or expectation mismatch. |
| New attacks | [new-probes.mjs](new-probes.mjs) and [result](new-probes-result.json): 26 shape cases before and after formatting plus 7 ownership cases; no mismatch. Varied escapes, references, Unicode, code spans, containers, markers, the exact budget, records and configuration; valid prose controls pass. |
| Inventory | [inventory.txt](inventory.txt): 131 blocks, 90 keep, 1 move, 40 cut, 0 failures; [middle](inventory-2000.txt) and [long](inventory-3000.txt) candidates also pass their anchor checks. |
| Reader provenance and links | [artifact-result.json](artifact-result.json): key precedes all three candidates, current scores and all quotes match raw records, six packages mapped, no file-link failure, manifests unchanged. Its old exact-copy assertion fails because D023 authorizes factual corrections while preserving the scored candidate. [external-link.txt](external-link.txt): Releases URL returns HTTP 200. |
| Release contract | [release-line-result.json](release-line-result.json): canonical and legacy inputs normalize, outside bytes stay unchanged, appended prose refuses before writing. [release-preparation-fixtures.txt](release-preparation-fixtures.txt): 16 pass. [integration-fixture.txt](integration-fixture.txt): the one-line merge case passes. [release-surfaces.txt](release-surfaces.txt): staged release surfaces pass. |
| Guard fixtures | [docs-fixtures.txt](docs-fixtures.txt): 57 pass, 0 skipped, including the 915-row corpus and executed historical comparison against `08845c71`. |
| Handoff checks | [format-check.txt](format-check.txt): passing code format check; [diff-check.txt](diff-check.txt): empty output, exit 0; [test-docs.txt](test-docs.txt): 32 suites pass, 0 fail, 125.30 seconds. |
| Evidence discrepancy | [readme-record.mjs](readme-record.mjs) applies D023's saved patch to the scored candidate; [result](readme-record-result.json) shows ten claimed restorations missing from the current page. Its bytes equal checkpoint 16. [D024](../decisions.md#wo-189-d024--verification-follow-up-the-restoration-record-describes-another-readme) boards F1 without guessing the cause. |

The four unchanged runnable README commands retain VER-001's executed
[temporary-mirror evidence](../verify-001/command-probes-result.json). Their
script mappings, command implementations and dependencies are unchanged by
this repair. The two executor worker reports and the repair's two reviews were
read; consequential claims were reproduced with the attacks and fixtures above.
No new worker or background monitor was needed.

Limits: original reader stdin and effective user-level instruction isolation
are unobserved. The alternate candidates need section reshaping if selected,
as D013 records. D021 records conservative grammar limits. The executor's
GitHub rendering record covers 915 synthetic pages; this verification sends no
page to its Markdown API. The document checker under review also participates
in the document gate; its passing row does not replace the counterexample probes.

The first new-probe run failed because my temporary fixture lacked its product
directory, before ownership judgments. The fixture was corrected and rerun;
[new-probes-setup-error.txt](new-probes-setup-error.txt) preserves that diagnostic
with local paths redacted. This was a probe setup failure, not a subject failure.
