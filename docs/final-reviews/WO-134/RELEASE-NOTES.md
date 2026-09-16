## Release overview

Planning reviews stay on the current pass when two planning passes share a calendar day. Reordering ledger sections no longer sends the operator back to an already reviewed pass.

## Read before upgrading

No migration is required. Existing receipts and saved direct requests remain compatible. Multiple unjudged passes on the latest date report ambiguity; filing several passes before judging them is still a documented limitation.

## Substantive changes

Both refutation transports select from the gate's enforced passes using validated planning receipts. The sole unjudged pass on the latest date wins; when all are judged, the latest planning receipt identifies the pass. Introduction exemptions and the continuation gate keep their existing meaning.

Direct requests now retain the selected pass in their local filename, so consecutive reviews with identical subjects preserve separate requests and earlier evidence. Legacy request filenames remain accepted.

## Progressive polish

One regression case covers section swaps, both transports, single and multiple dates, introduction exemptions, ambiguity and saved-request compatibility. The review also removes an unused import and updates the planning dispositions to cite completed verification.

## Evidence and compatibility

Target v0.23.0 retains the order's patch classification. The annotated tag and its release manifest will identify the exact merged source and reviewer product-gate row. No package component, dependency, receipt schema or subject format changes in WO-134. [VER-001](../../verifications/WO-134/VER-001.md) passed all six criteria; [FINAL-001](FINAL-001.md) records 20 passing reviewer suites, 17 passing document suites and the preserved historical receipts. Fake transport fixtures establish selection behavior, not the quality of a live independent judgment.
