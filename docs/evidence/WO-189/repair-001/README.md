# WO-189 repair 001 (VER-001 F1)

The repair for [VER-001](../../../verifications/WO-189/VER-001.md) F1, criterion 5.
The rule the repaired `frontPageFindings` holds: "What runs today" is one range from
its heading to the next heading of the same or a higher level; the marker pair stands
inside it in order; nothing in the range but blank lines, generated blocks and the
markers stands outside the pair; each non-empty line between the markers is one
sentence, a terminator followed by a space and more text being a second sentence
whatever it starts with; the heading occurs once; the count of those lines is the
budget. [D013](../decisions.md#wo-189-d013--repair-what-runs-today-is-judged-as-one-range)
records the design and the alternatives.

| Record | Source | Outcome |
| --- | --- | --- |
| [front-page-probes-rerun.json](front-page-probes-rerun.json) | the verifier's [front-page-probes.mjs](../verify-001/front-page-probes.mjs), rerun unchanged under `node scripts/harness.mjs bounded --` | exit 0; `missedRefusals: []`; the unchanged and authorized cases still pass |
| [release-line-probes-rerun.json](release-line-probes-rerun.json) | the verifier's [release-line-probes.mjs](../verify-001/release-line-probes.mjs), rerun unchanged under the same guard after the adjacent repair for F2 ([D014](../decisions.md#wo-189-d014--adjacent-repair-a-current-target-still-rewrites-the-block-as-its-generated-line)) | exit 0; the legacy claim on a current target is rewritten as the exact generated line with one edit and nothing outside the block changed |
| `node --test scripts/test-release-preparation.mjs` under the guard | adjacent-0001's check | 16 of 16 pass, including the current-target rewrite and no-op cases |
| `node docs/evidence/WO-189/inventory-check.mjs`, then the same with `--readme docs/evidence/WO-189/candidate-2000.md` and with `--readme docs/evidence/WO-189/candidate-3000.md`, each under the guard | adjacent-0002's checks ([D015](../decisions.md#wo-189-d015--adjacent-repair-the-b025-anchor-names-the-fact-not-one-pages-wording)) | PASS with 0 failures each; the page holds 9 counted sentences of 11 |

Cases the report did not quote, added to `scripts/test-docs-check.mjs` under "What runs
today is one range from its heading to the next heading": a `###` subheading under the
heading with a sentence below it; a second `## What runs today` heading; the closing
marker standing under the next heading; and a line whose only terminators sit inside a
link, a code span and "i.e.", which is admitted as one sentence.
